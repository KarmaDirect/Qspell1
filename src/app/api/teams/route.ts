import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, tag, region, description } = await req.json()

    // Validation
    if (!name || !tag || !region) {
      return NextResponse.json(
        { error: 'Name, tag, and region are required' },
        { status: 400 }
      )
    }

    if (tag.length > 5) {
      return NextResponse.json(
        { error: 'Tag must be 5 characters or less' },
        { status: 400 }
      )
    }

    // Check if tag already exists
    const { data: existingTeam } = await supabase
      .from('teams')
      .select('id')
      .eq('tag', tag)
      .single()

    if (existingTeam) {
      return NextResponse.json(
        { error: 'Ce tag d&apos;équipe est déjà utilisé' },
        { status: 409 }
      )
    }

    // Create team
    const { data: newTeam, error: teamError } = await supabase
      .from('teams')
      .insert({
        name,
        tag: tag.toUpperCase(),
        region,
        description,
        captain_id: user.id,
        looking_for_players: false,
      })
      .select()
      .single()

    if (teamError) {
      console.error('Error creating team:', teamError)
      return NextResponse.json(
        { error: teamError.message },
        { status: 500 }
      )
    }

    // Add creator as team member
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: newTeam.id,
        profile_id: user.id,
        role: 'captain',
      })

    if (memberError) {
      console.error('Error adding team member:', memberError)
      // Delete team if member creation fails
      await supabase.from('teams').delete().eq('id', newTeam.id)
      return NextResponse.json(
        { error: 'Failed to create team member' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      team: newTeam,
    })
  } catch (error: any) {
    console.error('Error creating team:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create team' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's teams
    const { data: teamMembers, error: membersError } = await supabase
      .from('team_members')
      .select(`
        *,
        team:teams (
          *,
          captain:profiles!teams_captain_id_fkey (
            username,
            avatar_url
          )
        )
      `)
      .eq('profile_id', user.id)

    if (membersError) {
      console.error('Error fetching teams:', membersError)
      return NextResponse.json(
        { error: membersError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      teams: teamMembers.map((tm: any) => ({
        ...tm.team,
        member_role: tm.role,
        member_since: tm.joined_at,
      })),
    })
  } catch (error: any) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch teams' },
      { status: 500 }
    )
  }
}

