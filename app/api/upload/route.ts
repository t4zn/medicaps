import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Configure route to handle larger payloads
export const runtime = 'nodejs'
export const maxDuration = 60 // 60 seconds timeout

export async function POST(request: NextRequest) {
  try {
    // Add timeout handling for mobile uploads
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 55000) // 55 second timeout
    })

    const formDataPromise = request.formData()
    const formData = await Promise.race([formDataPromise, timeoutPromise]) as FormData

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

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 50MB' },
        { status: 413 }
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
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}_${sanitizedName}`
    
    // Create storage path
    const storagePath = subject 
      ? `files/${category}/${program}/${year}/${subject}/${filename}`
      : `files/${category}/${program}/${year}/${filename}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('files')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('files')
      .getPublicUrl(storagePath)

    // Save metadata to Supabase
    const { data: fileRecord, error: dbError } = await supabaseAdmin
      .from('files')
      .insert({
        filename,
        original_name: file.name,
        file_path: storagePath,
        github_url: null, // No longer using GitHub
        cdn_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
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
        ? 'File uploaded and published successfully!' 
        : 'File uploaded successfully! It will be available after admin approval.',
    })

  } catch (error) {
    console.error('Upload error:', error)
    
    // Handle specific error types for better mobile experience
    if (error instanceof Error) {
      if (error.message === 'Request timeout') {
        return NextResponse.json(
          { error: 'Upload timeout. Please check your connection and try again.' },
          { status: 408 }
        )
      }
      if (error.message.includes('PayloadTooLargeError') || error.message.includes('413')) {
        return NextResponse.json(
          { error: 'File too large. Please select a file smaller than 50MB.' },
          { status: 413 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}