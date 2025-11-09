import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const OWNER_EMAIL = 'pathforge2025@gmail.com'

async function checkAdminAccess(userId: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: userProfile } = await supabaseAdmin
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single()

  return userProfile?.email === OWNER_EMAIL
}

// GET - Fetch pending files for approval
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const isAdmin = await checkAdminAccess(userId)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: files, error } = await supabaseAdmin
      .from('files')
      .select(`
        *,
        profiles:uploaded_by (
          full_name,
          email
        )
      `)
      .eq('is_approved', false)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching files:', error)
      return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 })
    }

    return NextResponse.json({ files })
  } catch (error) {
    console.error('Admin files error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Approve or reject files
export async function POST(request: NextRequest) {
  try {
    const { fileId, action, userId } = await request.json()

    if (!fileId || !action || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const isAdmin = await checkAdminAccess(userId)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (action === 'approve') {
      const { error } = await supabaseAdmin
        .from('files')
        .update({ is_approved: true })
        .eq('id', fileId)

      if (error) {
        console.error('Error approving file:', error)
        return NextResponse.json({ error: 'Failed to approve file' }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'File approved successfully' })
    } else if (action === 'reject') {
      // Get file info before deletion
      const { data: file } = await supabaseAdmin
        .from('files')
        .select('file_path')
        .eq('id', fileId)
        .single()

      if (file?.file_path) {
        // Delete from storage
        await supabaseAdmin.storage
          .from('files')
          .remove([file.file_path])
      }

      // Delete from database
      const { error } = await supabaseAdmin
        .from('files')
        .delete()
        .eq('id', fileId)

      if (error) {
        console.error('Error rejecting file:', error)
        return NextResponse.json({ error: 'Failed to reject file' }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'File rejected and deleted' })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Admin action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}