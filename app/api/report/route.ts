import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { canModerateContent } from '@/lib/roles'

export async function POST(request: NextRequest) {
  try {
    const { fileId, reason, description, userId } = await request.json()

    if (!fileId || !reason || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const validReasons = ['inappropriate', 'copyright', 'spam', 'wrong_category', 'low_quality', 'other']
    if (!validReasons.includes(reason)) {
      return NextResponse.json(
        { error: 'Invalid reason' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user already reported this file
    const { data: existingReport } = await supabaseAdmin
      .from('file_reports')
      .select('id')
      .eq('file_id', fileId)
      .eq('reported_by', userId)
      .single()

    if (existingReport) {
      return NextResponse.json(
        { error: 'You have already reported this file' },
        { status: 400 }
      )
    }

    // Create new report
    const { data: report, error } = await supabaseAdmin
      .from('file_reports')
      .insert({
        file_id: fileId,
        reported_by: userId,
        reason,
        description: description || null,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating report:', error)
      return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully. We will review it shortly.',
      report
    })

  } catch (error) {
    console.error('Report error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
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

    // Check if user can moderate content
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('email, role')
      .eq('id', userId)
      .single()

    if (!userProfile || !canModerateContent(userProfile.email || '', userProfile.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get all pending reports
    const { data: reports, error } = await supabaseAdmin
      .from('file_reports')
      .select(`
        *,
        files:file_id (
          id,
          original_name,
          program,
          year,
          subject,
          category
        ),
        profiles:reported_by (
          full_name,
          email
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reports:', error)
      return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
    }

    return NextResponse.json({ reports })

  } catch (error) {
    console.error('Get reports error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}