import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { canAccessAdminPanel } from '@/lib/roles'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const program = searchParams.get('program')
    const year = searchParams.get('year')
    const subject = searchParams.get('subject')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const userId = searchParams.get('userId')

    // Create admin client for server-side operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user has admin access to see unapproved files
    let showUnapproved = false
    if (userId) {
      const { data: userProfile } = await supabaseAdmin
        .from('profiles')
        .select('email, role')
        .eq('id', userId)
        .single()
      
      showUnapproved = canAccessAdminPanel(userProfile?.email || '', userProfile?.role)
    }

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
    
    // Only show approved files to regular users
    if (!showUnapproved) {
      query = query.eq('is_approved', true)
    }

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

    // Order by downloads (most downloaded first), then by creation date
    query = query.order('downloads', { ascending: false }).order('created_at', { ascending: false })

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