import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getRankedStats, getRankedStatsFromMatches } from '@/lib/riot-api/client'
import type { Database } from '@/lib/types/database.types'

type RiotAccount = Database['public']['Tables']['riot_accounts']['Row']

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { riotAccountId } = await req.json()

    if (!riotAccountId) {
      return NextResponse.json({ error: 'Riot account ID required' }, { status: 400 })
    }

    // Fetch riot account
    const { data: riotAccount, error: accountError } = await supabase
      .from('riot_accounts')
      .select('*')
      .eq('id', riotAccountId)
      .eq('profile_id', user.id)
      .single() as { data: RiotAccount | null; error: any }

    if (accountError || !riotAccount) {
      return NextResponse.json({ error: 'Riot account not found' }, { status: 404 })
    }

    // Fetch ranked stats from Riot API using PUUID (modern API endpoint)
    console.log(`🔍 Fetching ranked stats for PUUID: ${riotAccount.puuid}`)
    const rankedStats = await getRankedStats(riotAccount.puuid, riotAccount.region as any)
    
    console.log(`✅ Received ${rankedStats.length} ranked queues from API`)
    
    if (rankedStats.length === 0) {
      console.warn('⚠️ No ranked stats found from API - trying match history fallback')
      // Fallback to match history
      const rankedStatsFromMatches = await getRankedStatsFromMatches(riotAccount.puuid, riotAccount.region as any)
      
      if (rankedStatsFromMatches.length === 0) {
        return NextResponse.json({ 
          error: 'No ranked stats found',
          message: 'This account may not have played ranked games recently'
        }, { status: 404 })
      }

      // Update or insert stats for each queue
      for (const queueStats of rankedStatsFromMatches) {
        const { error: upsertError } = await supabase
          .from('player_stats')
          .upsert({
            riot_account_id: riotAccount.id,
            queue_type: queueStats.queueType,
            tier: queueStats.tier,
            rank: queueStats.rank,
            league_points: queueStats.leaguePoints,
            wins: queueStats.wins,
            losses: queueStats.losses,
            last_synced: new Date().toISOString(),
          } as any, {
            onConflict: 'riot_account_id,queue_type'
          })

        if (upsertError) {
          console.error('Error upserting stats:', upsertError)
        }
      }

      // Update last_updated on riot account
      const supabaseAny = supabase as any
      await supabaseAny
        .from('riot_accounts')
        .update({ last_updated: new Date().toISOString() })
        .eq('id', riotAccount.id)

      return NextResponse.json({ 
        success: true, 
        message: 'Stats synchronized successfully (from match history)' 
      })
    }

    // Update or insert stats for each queue
    for (const queueStats of rankedStats) {
      const { error: upsertError } = await supabase
        .from('player_stats')
        .upsert({
          riot_account_id: riotAccount.id,
          queue_type: queueStats.queueType,
          tier: queueStats.tier,
          rank: queueStats.rank,
          league_points: queueStats.leaguePoints,
          wins: queueStats.wins,
          losses: queueStats.losses,
          last_synced: new Date().toISOString(),
        } as any, {
          onConflict: 'riot_account_id,queue_type'
        })

      if (upsertError) {
        console.error('Error upserting stats:', upsertError)
      }
    }

    // Update last_updated on riot account
    const supabaseAny = supabase as any
    await supabaseAny
      .from('riot_accounts')
      .update({ last_updated: new Date().toISOString() })
      .eq('id', riotAccount.id)

    return NextResponse.json({ 
      success: true, 
      message: 'Stats synchronized successfully' 
    })
  } catch (error: any) {
    console.error('Error syncing stats:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to sync stats' },
      { status: 500 }
    )
  }
}

