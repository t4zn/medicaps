import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { canManageUsers } from '@/lib/roles'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user can manage users (admin access)
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('email, role')
      .eq('id', userId)
      .single()

    const isAdmin = canManageUsers(userProfile?.email || '', userProfile?.role)

    let query = supabaseAdmin
      .from('role_requests')
      .select(`
        *,
        profiles:user_id (
          full_name,
          email,
          avatar_url,
          role
        )
      `)

    // If not admin, only show user's own requests
    if (!isAdmin) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ requests: data || [] })
  } catch (error) {
    console.error('Error fetching role requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch role requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, requested_role, reason } = body

    if (!userId || !requested_role || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate requested role
    if (!['uploader', 'moderator'].includes(requested_role)) {
      return NextResponse.json(
        { error: 'Invalid role requested' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user already has a pending request for this role
    const { data: existingRequest } = await supabaseAdmin
      .from('role_requests')
      .select('id')
      .eq('user_id', userId)
      .eq('requested_role', requested_role)
      .eq('status', 'pending')
      .single()

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending request for this role' },
        { status: 400 }
      )
    }

    // Create the role request
    const { data, error } = await supabaseAdmin
      .from('role_requests')
      .insert({
        user_id: userId,
        requested_role,
        reason: reason.trim()
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      request: data,
      message: 'Role request submitted successfully!'
    })
  } catch (error) {
    console.error('Error creating role request:', error)
    return NextResponse.json(
      { error: 'Failed to submit role request' },
      { status: 500 }
    )
  }
}