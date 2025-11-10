import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const OWNER_EMAIL = 'pathforge2025@gmail.com'

async function checkAdminAccess(userId: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: userProfile } = await supabaseAdmin
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single()

  return userProfile?.email === OWNER_EMAIL
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user is admin
    const isAdmin = await checkAdminAccess(userId)

    let query = supabaseAdmin
      .from('subject_requests')
      .select(`
        *,
        requested_by_profile:profiles!requested_by(full_name, email),
        reviewed_by_profile:profiles!reviewed_by(full_name)
      `)
      .order('created_at', { ascending: false })

    // If not admin, only show user's own requests
    if (!isAdmin) {
      query = query.eq('requested_by', userId)
    }

    const { data: requests, error } = await query

    if (error) {
      console.error('Error fetching subject requests:', error)
      return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
    }

    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Error in subject requests GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject_name, subject_code, description, program, branch, year, userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Validation
    if (!subject_name || !subject_code || !description || !program || !branch || !year) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (description.length > 150) {
      return NextResponse.json({ error: 'Description must be 150 characters or less' }, { status: 400 })
    }

    if (program !== 'btech') {
      return NextResponse.json({ error: 'Currently only B.Tech subjects are supported' }, { status: 400 })
    }

    // Check if user already has a pending request for the same subject
    const { data: existingRequest } = await supabaseAdmin
      .from('subject_requests')
      .select('id')
      .eq('requested_by', userId)
      .eq('subject_name', subject_name)
      .eq('program', program)
      .eq('branch', branch)
      .eq('year', year)
      .eq('status', 'pending')
      .single()

    if (existingRequest) {
      return NextResponse.json({ error: 'You already have a pending request for this subject' }, { status: 400 })
    }

    // Check if user is admin (admins get auto-approval)
    const isAdmin = await checkAdminAccess(userId)

    const { data: newRequest, error } = await supabaseAdmin
      .from('subject_requests')
      .insert({
        subject_name,
        subject_code,
        description,
        program,
        branch,
        year,
        requested_by: userId,
        status: isAdmin ? 'approved' : 'pending',
        reviewed_by: isAdmin ? userId : null,
        reviewed_at: isAdmin ? new Date().toISOString() : null
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating subject request:', error)
      return NextResponse.json({ error: 'Failed to create request' }, { status: 500 })
    }

    return NextResponse.json({ 
      request: newRequest,
      message: isAdmin ? 'Subject request approved automatically' : 'Subject request submitted for review'
    })
  } catch (error) {
    console.error('Error in subject requests POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}