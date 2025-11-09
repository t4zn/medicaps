import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const program = searchParams.get('program')
    const year = searchParams.get('year')
    const subject = searchParams.get('subject')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let query = supabase
      .from('files')
      .select(`
        *,
        profiles:uploaded_by (
          full_name,
          email
        )
      `)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    // Apply filters
    if (program) query = query.eq('program', program)
    if (year) query = query.eq('year', year)
    if (subject) query = query.eq('subject', subject)
    if (category) query = query.eq('category', category)
    
    if (search) {
      query = query.or(`original_name.ilike.%${search}%,subject.ilike.%${search}%`)
    }

    const { data: files, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch files' },
        { status: 500 }
      )
    }

    return NextResponse.json({ files })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}