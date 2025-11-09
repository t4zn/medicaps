import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { fileId, voteType, userId } = await request.json()

    if (!fileId || !voteType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['up', 'down'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Invalid vote type' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user already voted
    const { data: existingVote } = await supabaseAdmin
      .from('file_votes')
      .select('*')
      .eq('file_id', fileId)
      .eq('user_id', userId)
      .single()

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote if clicking the same vote type
        const { error } = await supabaseAdmin
          .from('file_votes')
          .delete()
          .eq('file_id', fileId)
          .eq('user_id', userId)

        if (error) {
          console.error('Error removing vote:', error)
          return NextResponse.json({ error: 'Failed to remove vote' }, { status: 500 })
        }
      } else {
        // Update vote if clicking different vote type
        const { error } = await supabaseAdmin
          .from('file_votes')
          .update({ vote_type: voteType, updated_at: new Date().toISOString() })
          .eq('file_id', fileId)
          .eq('user_id', userId)

        if (error) {
          console.error('Error updating vote:', error)
          return NextResponse.json({ error: 'Failed to update vote' }, { status: 500 })
        }
      }
    } else {
      // Create new vote
      const { error } = await supabaseAdmin
        .from('file_votes')
        .insert({
          file_id: fileId,
          user_id: userId,
          vote_type: voteType
        })

      if (error) {
        console.error('Error creating vote:', error)
        return NextResponse.json({ error: 'Failed to create vote' }, { status: 500 })
      }
    }

    // Get updated vote counts
    const { data: voteCounts } = await supabaseAdmin
      .from('file_votes')
      .select('vote_type')
      .eq('file_id', fileId)

    const upVotes = voteCounts?.filter(vote => vote.vote_type === 'up').length || 0
    const downVotes = voteCounts?.filter(vote => vote.vote_type === 'down').length || 0

    // Get user's current vote
    const { data: userVote } = await supabaseAdmin
      .from('file_votes')
      .select('vote_type')
      .eq('file_id', fileId)
      .eq('user_id', userId)
      .single()

    return NextResponse.json({
      success: true,
      upVotes,
      downVotes,
      userVote: userVote?.vote_type || null
    })

  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')
    const userId = searchParams.get('userId')

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get vote counts
    const { data: voteCounts } = await supabaseAdmin
      .from('file_votes')
      .select('vote_type')
      .eq('file_id', fileId)

    const upVotes = voteCounts?.filter(vote => vote.vote_type === 'up').length || 0
    const downVotes = voteCounts?.filter(vote => vote.vote_type === 'down').length || 0

    // Get user's vote if userId provided
    let userVote = null
    if (userId) {
      const { data: userVoteData } = await supabaseAdmin
        .from('file_votes')
        .select('vote_type')
        .eq('file_id', fileId)
        .eq('user_id', userId)
        .single()

      userVote = userVoteData?.vote_type || null
    }

    return NextResponse.json({
      upVotes,
      downVotes,
      userVote
    })

  } catch (error) {
    console.error('Get votes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}