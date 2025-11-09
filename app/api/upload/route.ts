import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { uploadToGitHub } from '@/lib/github'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const program = formData.get('program') as string
    const year = formData.get('year') as string
    const subject = formData.get('subject') as string
    const category = formData.get('category') as string
    const userId = formData.get('userId') as string

    if (!file || !program || !year || !category || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}_${sanitizedName}`
    
    // Create GitHub path
    const githubPath = subject 
      ? `${category}/${program}/${year}/${subject}/${filename}`
      : `${category}/${program}/${year}/${filename}`

    // Upload to GitHub
    const githubResult = await uploadToGitHub({
      content: buffer,
      path: githubPath,
      message: `Add ${file.name} for ${program} ${year} ${subject || ''} ${category}`,
    })

    if (!githubResult.success) {
      return NextResponse.json(
        { error: githubResult.error },
        { status: 500 }
      )
    }

    // Create admin client for server-side operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Save metadata to Supabase
    const { data: fileRecord, error: dbError } = await supabaseAdmin
      .from('files')
      .insert({
        filename,
        original_name: file.name,
        file_path: githubPath,
        github_url: githubResult.githubUrl,
        cdn_url: githubResult.downloadUrl,
        file_size: file.size,
        mime_type: file.type,
        program,
        year,
        subject,
        category,
        uploaded_by: userId,
        is_approved: false, // Requires admin approval
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
      message: 'File uploaded successfully! It will be available after admin approval.',
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}