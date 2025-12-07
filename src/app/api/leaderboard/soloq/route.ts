import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

/**
 * GET /api/leaderboard/soloq
 * Returns leaderboard of players ranked by SoloQ rank
 * Ordered by: LP (league_points) DESC, Winrate DESC
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient()

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get all SoloQ stats with player info
    const { data: soloqStats, error } = await supabase
      .from('player_stats')
      .select(`
        *,
        riot_account:riot_accounts!inner (
          profile:profiles!inner (
            id,
            username,
            avatar_url,
            display_name
          )
        )
      `)
      .eq('queue_type', 'RANKED_SOLO_5x5')
      .order('league_points', { ascending: false, nullsLast: true })
      .order('wins', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching SoloQ leaderboard:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Format and calculate winrate
    const leaderboard = (soloqStats || [])
      .filter((stat: any) => stat.riot_account?.profile)
      .map((stat: any, index: number) => {
        const totalGames = stat.wins + stat.losses
        const winrate = totalGames > 0 ? (stat.wins / totalGames) * 100 : 0

        // Calculate rank score (LP + winrate bonus)
        // Higher tier = higher base score
        const tierScore: Record<string, number> = {
          'CHALLENGER': 5000,
          'GRANDMASTER': 4000,
          'MASTER': 3000,
          'DIAMOND': 2000,
          'EMERALD': 1500,
          'PLATINUM': 1000,
          'GOLD': 500,
          'SILVER': 200,
          'BRONZE': 100,
          'IRON': 0,
          'UNRANKED': 0,
        }

        const rankScore: Record<string, number> = {
          'I': 4,
          'II': 3,
          'III': 2,
          'IV': 1,
        }

        const baseScore = tierScore[stat.tier] || 0
        const rankBonus = (rankScore[stat.rank] || 0) * 100
        const totalScore = baseScore + rankBonus + stat.league_points + (winrate * 10)

        return {
          rank: offset + index + 1,
          profile: {
            id: stat.riot_account.profile.id,
            username: stat.riot_account.profile.username,
            display_name: stat.riot_account.profile.display_name || stat.riot_account.profile.username,
            avatar_url: stat.riot_account.profile.avatar_url,
          },
          riot_account: {
            game_name: stat.riot_account.game_name,
            tag_line: stat.riot_account.tag_line,
            region: stat.riot_account.region,
          },
          tier: stat.tier,
          rank_division: stat.rank,
          league_points: stat.league_points,
          wins: stat.wins,
          losses: stat.losses,
          total_games: totalGames,
          winrate: Math.round(winrate * 10) / 10,
          score: Math.round(totalScore),
        }
      })
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        ...item,
        rank: offset + index + 1,
      }))

    return NextResponse.json({
      leaderboard,
      pagination: {
        limit,
        offset,
        total: leaderboard.length,
      },
    })
  } catch (error: any) {
    console.error('Error in SoloQ leaderboard:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

