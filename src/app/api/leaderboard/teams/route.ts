import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

/**
 * GET /api/leaderboard/teams
 * Returns leaderboard of teams ranked by tournament performance
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient()

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get all completed tournament matches
    const { data: allMatches, error: allMatchesError } = await supabase
      .from('tournament_matches')
      .select(`
        winner_id,
        team1_id,
        team2_id,
        tournament_id
      `)

    if (allMatchesError) {
      console.error('Error fetching matches:', allMatchesError)
      return NextResponse.json(
        { error: allMatchesError.message },
        { status: 500 }
      )
    }

    // Get completed tournament IDs
    const { data: completedTournaments, error: tournamentsError } = await supabase
      .from('tournaments')
      .select('id')
      .eq('status', 'completed')

    if (tournamentsError) {
      console.error('Error fetching tournaments:', tournamentsError)
      return NextResponse.json(
        { error: tournamentsError.message },
        { status: 500 }
      )
    }

    const completedTournamentIds = new Set((completedTournaments || []).map((t: any) => t.id))
    
    // Filter matches to only completed tournaments
    const matches = (allMatches || []).filter((m: any) => 
      completedTournamentIds.has(m.tournament_id)
    )

    // Calculate team stats
    const teamStats: Record<string, {
      wins: number
      losses: number
      tournaments: Set<string>
      prize_money: number
    }> = {}

    for (const match of matches || []) {
      // Winner
      if (match.winner_id) {
        if (!teamStats[match.winner_id]) {
          teamStats[match.winner_id] = {
            wins: 0,
            losses: 0,
            tournaments: new Set(),
            prize_money: 0,
          }
        }
        teamStats[match.winner_id].wins++
        teamStats[match.winner_id].tournaments.add(match.tournament_id)
      }

      // Loser
      const loserId = match.winner_id === match.team1_id ? match.team2_id : match.team1_id
      if (loserId) {
        if (!teamStats[loserId]) {
          teamStats[loserId] = {
            wins: 0,
            losses: 0,
            tournaments: new Set(),
            prize_money: 0,
          }
        }
        teamStats[loserId].losses++
        teamStats[loserId].tournaments.add(match.tournament_id)
      }
    }

    // Get team details
    const teamIds = Object.keys(teamStats)
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select(`
        id,
        name,
        tag,
        logo_url,
        region,
        captain:profiles!teams_captain_id_fkey (
          username
        )
      `)
      .in('id', teamIds)

    if (teamsError) {
      console.error('Error fetching teams:', teamsError)
      return NextResponse.json(
        { error: teamsError.message },
        { status: 500 }
      )
    }

    // Build leaderboard sorted by wins, then winrate
    const leaderboard = Object.entries(teamStats)
      .map(([teamId, stats]) => {
        const team = (teams || []).find((t: any) => t.id === teamId)
        const totalGames = stats.wins + stats.losses
        const winrate = totalGames > 0 ? (stats.wins / totalGames) * 100 : 0
        const score = stats.wins * 1000 + winrate

        return {
          team: team || {
            id: teamId,
            name: 'Unknown Team',
            tag: '???',
          },
          wins: stats.wins,
          losses: stats.losses,
          total_games: totalGames,
          winrate: Math.round(winrate * 10) / 10,
          tournaments_played: stats.tournaments.size,
          score: Math.round(score),
        }
      })
      .sort((a, b) => b.score - a.score)
      .slice(offset, offset + limit)
      .map((item, index) => ({
        ...item,
        rank: offset + index + 1,
      }))

    return NextResponse.json({
      leaderboard,
      pagination: {
        limit,
        offset,
        total: Object.keys(teamStats).length,
      },
    })
  } catch (error: any) {
    console.error('Error in team leaderboard:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

