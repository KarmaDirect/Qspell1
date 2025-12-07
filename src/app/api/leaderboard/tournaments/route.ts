import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

/**
 * GET /api/leaderboard/tournaments
 * Returns leaderboard of players ranked by tournament wins
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient()

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get all tournament matches and count wins per player
    const { data: matches, error: matchesError } = await supabase
      .from('tournament_matches')
      .select(`
        winner_id,
        tournament:tournaments (
          id,
          name,
          status
        )
      `)
      .not('winner_id', 'is', null)
      .eq('tournament.status', 'completed')

    if (matchesError) {
      console.error('Error fetching tournament matches:', matchesError)
      return NextResponse.json(
        { error: matchesError.message },
        { status: 500 }
      )
    }

    // Count wins per profile (via team members or direct participants)
    // Get all team members for teams that won
    const winningTeamIds = [...new Set((matches || []).map((m: any) => m.winner_id))]
    
    const { data: teamMembers, error: membersError } = await supabase
      .from('team_members')
      .select(`
        profile_id,
        team_id,
        team:teams!inner (
          id
        )
      `)
      .in('team_id', winningTeamIds)

    if (membersError) {
      console.error('Error fetching team members:', membersError)
      return NextResponse.json(
        { error: membersError.message },
        { status: 500 }
      )
    }

    // Count wins per profile
    const winCounts: Record<string, { count: number, tournaments: string[] }> = {}
    
    for (const match of matches || []) {
      const teamMembersForTeam = (teamMembers || []).filter(
        (tm: any) => tm.team_id === match.winner_id
      )
      
      for (const member of teamMembersForTeam) {
        const profileId = member.profile_id
        if (!winCounts[profileId]) {
          winCounts[profileId] = { count: 0, tournaments: [] }
        }
        winCounts[profileId].count++
        if (!winCounts[profileId].tournaments.includes(match.tournament.id)) {
          winCounts[profileId].tournaments.push(match.tournament.id)
        }
      }
    }

    // Get profile info for top winners
    const sortedWinners = Object.entries(winCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(offset, offset + limit)

    const profileIds = sortedWinners.map(([id]) => id)

    // Get profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, display_name')
      .in('id', profileIds)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return NextResponse.json(
        { error: profilesError.message },
        { status: 500 }
      )
    }

    // Get primary Riot accounts for profiles
    const { data: riotAccounts, error: riotError } = await supabase
      .from('riot_accounts')
      .select('profile_id, game_name, tag_line, region')
      .in('profile_id', profileIds)
      .eq('is_primary', true)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return NextResponse.json(
        { error: profilesError.message },
        { status: 500 }
      )
    }

    // Build leaderboard
    const leaderboard = sortedWinners.map(([profileId, stats], index) => {
      const profile = (profiles || []).find((p: any) => p.id === profileId)
      const riotAccount = (riotAccounts || []).find((ra: any) => ra.profile_id === profileId)

      return {
        rank: offset + index + 1,
        profile: {
          id: profile?.id || profileId,
          username: profile?.username || 'Unknown',
          display_name: profile?.display_name || profile?.username || 'Unknown',
          avatar_url: profile?.avatar_url,
        },
        riot_account: riotAccount ? {
          game_name: riotAccount.game_name,
          tag_line: riotAccount.tag_line,
          region: riotAccount.region,
        } : null,
        tournament_wins: stats.count,
        tournaments_played: stats.tournaments.length,
      }
    })

    return NextResponse.json({
      leaderboard,
      pagination: {
        limit,
        offset,
        total: Object.keys(winCounts).length,
      },
    })
  } catch (error: any) {
    console.error('Error in tournament leaderboard:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

