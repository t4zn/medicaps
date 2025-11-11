import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { canManageUsers } from '@/lib/roles'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { action, userId, rejection_reason } = body
    const { id: requestId } = await params

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    if (action === 'reject' && !rejection_reason?.trim()) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user can manage users
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('email, role')
      .eq('id', userId)
      .single()

    const canManage = canManageUsers(userProfile?.email || '', userProfile?.role)

    if (!canManage) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Get the role request
    const { data: roleRequest, error: fetchError } = await supabaseAdmin
      .from('role_requests')
      .select('user_id, requested_role, status')
      .eq('id', requestId)
      .single()

    if (fetchError || !roleRequest) {
      return NextResponse.json(
        { error: 'Role request not found' },
        { status: 404 }
      )
    }

    if (roleRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'Role request has already been reviewed' },
        { status: 400 }
      )
    }

    if (action === 'approve') {
      // Update the role request
      const { error: updateError } = await supabaseAdmin
        .from('role_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: userId
        })
        .eq('id', requestId)

      if (updateError) throw updateError

      // Update the user's role
      const { error: roleError } = await supabaseAdmin
        .from('profiles')
        .update({ role: roleRequest.requested_role })
        .eq('id', roleRequest.user_id)

      if (roleError) throw roleError

      return NextResponse.json({
        success: true,
        message: 'Role request approved successfully!'
      })
    } else {
      // Reject the request
      const { error: updateError } = await supabaseAdmin
        .from('role_requests')
        .update({
          status: 'rejected',
          rejection_reason: rejection_reason.trim(),
          reviewed_at: new Date().toISOString(),
          reviewed_by: userId
        })
        .eq('id', requestId)

      if (updateError) throw updateError

      return NextResponse.json({
        success: true,
        message: 'Role request rejected'
      })
    }
  } catch (error) {
    console.error('Error processing role request:', error)
    return NextResponse.json(
      { error: 'Failed to process role request' },
      { status: 500 }
    )
  }
}