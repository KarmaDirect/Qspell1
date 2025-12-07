import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const teamId = params.id

    // Get team details
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select(`
        *,
        captain:profiles!teams_captain_id_fkey (
          id,
          username,
          avatar_url
        )
      `)
      .eq('id', teamId)
      .single()

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Get team members
    const { data: members, error: membersError } = await supabase
      .from('team_members')
      .select(`
        *,
        profile:profiles (
          id,
          username,
          avatar_url,
          riot_accounts (
            game_name,
            tag_line,
            region,
            is_primary
          ),
          player_stats (
            queue_type,
            tier,
            rank,
            league_points,
            wins,
            losses
          )
        )
      `)
      .eq('team_id', teamId)

    if (membersError) {
      console.error('Error fetching members:', membersError)
      return NextResponse.json(
        { error: membersError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      team,
      members,
    })
  } catch (error: any) {
    console.error('Error fetching team:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch team' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const teamId = params.id
    const updates = await req.json()

    // Check if user is captain
    const { data: team } = await supabase
      .from('teams')
      .select('captain_id')
      .eq('id', teamId)
      .single()

    if (!team || team.captain_id !== user.id) {
      return NextResponse.json(
        { error: 'Only team captain can update team' },
        { status: 403 }
      )
    }

    // Update team
    const { data: updatedTeam, error: updateError } = await supabase
      .from('teams')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', teamId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating team:', updateError)
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      team: updatedTeam,
    })
  } catch (error: any) {
    console.error('Error updating team:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update team' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const teamId = params.id

    // Check if user is captain
    const { data: team } = await supabase
      .from('teams')
      .select('captain_id')
      .eq('id', teamId)
      .single()

    if (!team || team.captain_id !== user.id) {
      return NextResponse.json(
        { error: 'Only team captain can delete team' },
        { status: 403 }
      )
    }

    // Delete team (cascade will delete members)
    const { error: deleteError } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId)

    if (deleteError) {
      console.error('Error deleting team:', deleteError)
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Team deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting team:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete team' },
      { status: 500 }
    )
  }
}

