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

// POST - Resolve or dismiss reports
export async function POST(request: NextRequest) {
  try {
    const { reportId, action, userId } = await request.json()

    if (!reportId || !action || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const isAdmin = await checkAdminAccess(userId)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (action === 'resolve') {
      const { error } = await supabaseAdmin
        .from('file_reports')
        .update({ 
          status: 'resolved',
          reviewed_by: userId,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reportId)

      if (error) {
        console.error('Error resolving report:', error)
        return NextResponse.json({ error: 'Failed to resolve report' }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'Report resolved successfully' })
    } else if (action === 'dismiss') {
      const { error } = await supabaseAdmin
        .from('file_reports')
        .update({ 
          status: 'dismissed',
          reviewed_by: userId,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reportId)

      if (error) {
        console.error('Error dismissing report:', error)
        return NextResponse.json({ error: 'Failed to dismiss report' }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'Report dismissed successfully' })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Admin report action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}