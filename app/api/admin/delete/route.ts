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

// DELETE - Delete any file (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')
    const userId = searchParams.get('userId')

    if (!fileId || !userId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const isAdmin = await checkAdminAccess(userId)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get file info before deletion
    const { data: file } = await supabaseAdmin
      .from('files')
      .select('file_path')
      .eq('id', fileId)
      .single()

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Delete from storage
    if (file.file_path) {
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
      console.error('Error deleting file:', error)
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'File deleted successfully' })
  } catch (error) {
    console.error('Delete file error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}