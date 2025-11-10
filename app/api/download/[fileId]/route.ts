import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params
    const { userId } = await request.json()
    const userAgent = request.headers.get('user-agent') || ''
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1'

    // Create admin client for server-side operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get file info
    const { data: file, error: fileError } = await supabaseAdmin
      .from('files')
      .select('*')
      .eq('id', fileId)
      .eq('is_approved', true)
      .single()

    if (fileError || !file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Track download
    const { error: downloadError } = await supabaseAdmin
      .from('downloads')
      .insert({
        file_id: fileId,
        user_id: userId || null,
        ip_address: ip,
        user_agent: userAgent,
      })

    if (downloadError) {
      console.error('Download tracking error:', downloadError)
    }

    // Increment download count
    const { error: updateError } = await supabaseAdmin
      .from('files')
      .update({ downloads: file.downloads + 1 })
      .eq('id', fileId)

    if (updateError) {
      console.error('Download count update error:', updateError)
    }

    // Use Google Drive URL if available, fallback to legacy cdn_url
    const downloadUrl = file.google_drive_url || file.cdn_url
    
    console.log('File data:', { 
      id: file.id, 
      google_drive_url: file.google_drive_url, 
      cdn_url: file.cdn_url,
      downloadUrl 
    }) // Debug log

    // Check if we have a valid download URL
    if (!downloadUrl || downloadUrl === 'null' || downloadUrl.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Download link not available for this file. Please contact the uploader to update the file with a Google Drive link.',
      })
    }

    return NextResponse.json({
      success: true,
      downloadUrl: downloadUrl,
      filename: file.original_name,
    })

  } catch (error) {
    console.error('Download API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}