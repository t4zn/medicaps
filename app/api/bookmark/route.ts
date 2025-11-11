import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')
    const userId = searchParams.get('userId')

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user has bookmarked this file
    let isBookmarked = false
    if (userId) {
      const { data: bookmark } = await supabaseAdmin
        .from('file_bookmarks')
        .select('id')
        .eq('file_id', fileId)
        .eq('user_id', userId)
        .single()

      isBookmarked = !!bookmark
    }

    return NextResponse.json({
      isBookmarked
    })

  } catch (error) {
    console.error('Bookmark check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fileId, userId } = await request.json()

    if (!fileId || !userId) {
      return NextResponse.json(
        { error: 'File ID and User ID are required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if bookmark already exists
    const { data: existingBookmark } = await supabaseAdmin
      .from('file_bookmarks')
      .select('id')
      .eq('file_id', fileId)
      .eq('user_id', userId)
      .single()

    if (existingBookmark) {
      // Remove bookmark
      const { error } = await supabaseAdmin
        .from('file_bookmarks')
        .delete()
        .eq('file_id', fileId)
        .eq('user_id', userId)

      if (error) throw error

      return NextResponse.json({
        success: true,
        isBookmarked: false,
        message: 'Bookmark removed'
      })
    } else {
      // Add bookmark
      const { error } = await supabaseAdmin
        .from('file_bookmarks')
        .insert({
          file_id: fileId,
          user_id: userId
        })

      if (error) throw error

      return NextResponse.json({
        success: true,
        isBookmarked: true,
        message: 'File bookmarked'
      })
    }

  } catch (error) {
    console.error('Bookmark toggle error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}