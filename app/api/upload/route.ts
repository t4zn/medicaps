import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { canUploadWithoutApproval } from '@/lib/roles'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      googleDriveUrl, 
      filename, 
      program, 
      year, 
      subject, 
      category, 
      userId 
    } = body

    if (!googleDriveUrl || !filename || !program || !year || !category || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate Google Drive URL format (support any valid Google Drive link)
    const fileRegex = /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
    const folderRegex = /^https:\/\/drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/
    const isValidUrl = fileRegex.test(googleDriveUrl) || folderRegex.test(googleDriveUrl)
    
    if (!isValidUrl) {
      if (googleDriveUrl.includes('drive.google.com')) {
        return NextResponse.json(
          { error: 'Please provide a valid Google Drive file or folder link' },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { error: 'Please provide a valid Google Drive link' },
          { status: 400 }
        )
      }
    }

    // Determine if it's a folder or file
    const isFolder = folderRegex.test(googleDriveUrl)

    // Create admin client for server-side operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check user role and permissions
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('email, role')
      .eq('id', userId)
      .single()

    const canAutoApprove = canUploadWithoutApproval(userProfile?.email || '', userProfile?.role)

    const timestamp = Date.now()
    const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFilename = `${timestamp}_${sanitizedName}`

    // Save metadata to Supabase with Google Drive URL
    const { data: fileRecord, error: dbError } = await supabaseAdmin
      .from('files')
      .insert({
        filename: uniqueFilename,
        original_name: filename,
        file_path: null, // No longer using file storage
        github_url: null, // Legacy field
        cdn_url: null, // Legacy field
        google_drive_url: googleDriveUrl,
        file_size: null, // Can't determine size from Google Drive link
        mime_type: isFolder ? 'application/folder' : 'application/pdf',
        program,
        year,
        subject,
        category,
        uploaded_by: userId,
        is_approved: canAutoApprove, // Auto-approve based on role
        requires_approval: !canAutoApprove,
        approved_at: canAutoApprove ? new Date().toISOString() : null,
        approved_by: canAutoApprove ? userId : null
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save file metadata' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      file: fileRecord,
      message: canAutoApprove 
        ? `${isFolder ? 'Folder' : 'File'} link added and published successfully!` 
        : `${isFolder ? 'Folder' : 'File'} link added successfully! It will be available after admin approval.`,
    })

  } catch (error) {
    console.error('Upload error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}