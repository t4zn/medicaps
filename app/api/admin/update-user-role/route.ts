import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { canManageUsers, getUserRole } from '@/lib/roles'
import { canManageUsersFallback } from '@/lib/roles-fallback'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, newRole, adminUserId } = body

    if (!userId || !newRole || !adminUserId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, newRole, adminUserId' },
        { status: 400 }
      )
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verify admin permissions
    const { data: adminProfile } = await supabaseAdmin
      .from('profiles')
      .select('email, role')
      .eq('id', adminUserId)
      .single()

    if (!adminProfile) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      )
    }

    // Check if admin has permission to manage users
    const canManage = canManageUsers(adminProfile.email || '', adminProfile.role) || 
                     canManageUsersFallback(adminProfile.email || '')

    if (!canManage) {
      return NextResponse.json(
        { error: 'Insufficient permissions to manage users' },
        { status: 403 }
      )
    }

    // Get the target user to check if they're trying to change an owner
    const { data: targetUser } = await supabaseAdmin
      .from('profiles')
      .select('email, role')
      .eq('id', userId)
      .single()

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Target user not found' },
        { status: 404 }
      )
    }

    // Prevent changing owner role (owners are hardcoded)
    const currentRole = getUserRole(targetUser.email || '', targetUser.role || 'user')
    if (currentRole === 'owner') {
      return NextResponse.json(
        { error: 'Cannot change owner role' },
        { status: 403 }
      )
    }

    // Prevent users from changing their own role
    if (userId === adminUserId) {
      return NextResponse.json(
        { error: 'Cannot change your own role' },
        { status: 403 }
      )
    }

    // Validate the new role
    const validRoles = ['admin', 'moderator', 'uploader', 'user']
    if (!validRoles.includes(newRole)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      )
    }

    // Update the user's role using service role key
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating user role:', updateError)
      return NextResponse.json(
        { error: 'Failed to update user role' },
        { status: 500 }
      )
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'User role updated successfully',
      userId,
      newRole
    })

  } catch (error) {
    console.error('Update user role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}