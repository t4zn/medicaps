import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const filters = {
      program: searchParams.get('program') || 'all',
      year: searchParams.get('year') || 'all',
      branch: searchParams.get('branch') || 'all'
    }

    if (!query || query.length < 1) {
      return NextResponse.json({ files: [] })
    }

    // Create admin client for server-side operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Build the query
    let dbQuery = supabaseAdmin
      .from('files')
      .select(`
        id,
        filename,
        original_name,
        program,
        branch,
        year,
        subject,
        category,
        downloads,
        created_at
      `)
      .eq('is_approved', true)
      .ilike('original_name', `%${query}%`)

    // Apply filters
    if (filters.program !== 'all') {
      dbQuery = dbQuery.eq('program', filters.program)
    }
    
    if (filters.year !== 'all') {
      dbQuery = dbQuery.eq('year', filters.year)
    }
    
    if (filters.branch !== 'all') {
      dbQuery = dbQuery.eq('branch', filters.branch)
    }

    const { data: files, error } = await dbQuery
      .order('downloads', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json({ files: [] })
    }

    // Transform files to search results format
    const fileResults = (files || []).map(file => {
      // Generate the subject page URL - ALL files redirect to notes route
      let href = ''
      
      // For B.Tech files, we need to determine the branch
      // If branch is null, we'll try to infer it or default to 'cse' for 2nd year and above files
      let effectiveBranch = file.branch
      if (file.program === 'btech' && file.year !== '1st-year' && !effectiveBranch) {
        // Try to infer branch from subject name or default to CSE
        const subjectName = file.subject.toLowerCase()
        if (subjectName.includes('electrical') || subjectName.includes('power') || subjectName.includes('circuit')) {
          effectiveBranch = 'electrical'
        } else if (subjectName.includes('mechanical') || subjectName.includes('thermal') || subjectName.includes('fluid')) {
          effectiveBranch = 'mechanical'
        } else if (subjectName.includes('civil') || subjectName.includes('structural') || subjectName.includes('concrete')) {
          effectiveBranch = 'civil'
        } else if (subjectName.includes('electronics') || subjectName.includes('communication') || subjectName.includes('signal')) {
          effectiveBranch = 'ece'
        } else {
          effectiveBranch = 'cse' // Default to CSE for legacy files without branch
        }
      }
      
      // All file types redirect to notes route for consistency
      href = effectiveBranch 
        ? `/notes/${file.program}/${effectiveBranch}/${file.year}/${file.subject}`
        : `/notes/${file.program}/${file.year}/${file.subject}`

      return {
        id: file.id,
        title: file.original_name,
        href,
        snippet: `${file.category.toUpperCase()} • ${file.program.toUpperCase()} ${file.year.replace('-', ' ')}`,
        description: `File in ${file.subject}`,
        type: 'file',
        category: file.category,
        subject: file.subject,
        program: file.program,
        year: file.year,
        branch: file.branch
      }
    })

    return NextResponse.json({ files: fileResults })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ files: [] })
  }
}