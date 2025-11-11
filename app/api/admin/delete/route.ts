import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { canDeleteFiles } from '@/lib/roles'

async function checkDeleteAccess(userId: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: userProfile } = await supabaseAdmin
    .from('profiles')
    .select('email, role')
    .eq('id', userId)
    .single()

  if (!userProfile) return false

  return canDeleteFiles(userProfile.email || '', userProfile.role)
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')
    const userId = searchParams.get('userId')

    if (!fileId || !userId) {
      return NextResponse.json({ error: 'File ID and User ID required' }, { status: 400 })
    }

    const canDelete = await checkDeleteAccess(userId)
    if (!canDelete) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get file info before deletion
    const { data: file } = await supabaseAdmin
      .from('files')
      .select('file_path, filename')
      .eq('id', fileId)
      .single()

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Delete from storage if file_path exists
    if (file.file_path) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('files')
        .remove([file.file_path])
      
      if (storageError) {
        console.error('Error deleting from storage:', storageError)
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete from database
    const { error: dbError } = await supabaseAdmin
      .from('files')
      .delete()
      .eq('id', fileId)

    if (dbError) {
      console.error('Error deleting from database:', dbError)
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `File "${file.filename}" deleted successfully` 
    })
  } catch (error) {
    console.error('Admin delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}