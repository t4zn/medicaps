import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

    // Validate Google Drive URL format
    const googleDriveRegex = /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view\?(usp=sharing|pli=1)$/
    if (!googleDriveRegex.test(googleDriveUrl)) {
      return NextResponse.json(
        { error: 'Please provide a valid Google Drive sharing link' },
        { status: 400 }
      )
    }

    // Create admin client for server-side operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user is owner (auto-approve their uploads)
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single()

    const isOwner = userProfile?.email === 'pathforge2025@gmail.com'

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
        mime_type: 'application/pdf',
        program,
        year,
        subject,
        category,
        uploaded_by: userId,
        is_approved: isOwner, // Auto-approve for owner
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
      message: isOwner 
        ? 'File link added and published successfully!' 
        : 'File link added successfully! It will be available after admin approval.',
    })

  } catch (error) {
    console.error('Upload error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}