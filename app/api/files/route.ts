import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const program = searchParams.get('program')
    const year = searchParams.get('year')
    const subject = searchParams.get('subject')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // Create admin client for server-side operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    let query = supabaseAdmin
      .from('files')
      .select(`
        *,
        profiles:uploaded_by (
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('is_approved', true)

    // Apply filters
    if (program && program !== 'all') {
      query = query.eq('program', program)
    }
    if (year && year !== 'all') {
      query = query.eq('year', year)
    }
    if (subject && subject !== 'all') {
      query = query.eq('subject', subject)
    }
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    // Apply search
    if (search) {
      query = query.or(`original_name.ilike.%${search}%,subject.ilike.%${search}%`)
    }

    // Order by creation date (newest first)
    query = query.order('created_at', { ascending: false })

    const { data: files, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch files' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      files: files || [],
    })

  } catch (error) {
    console.error('Files API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}