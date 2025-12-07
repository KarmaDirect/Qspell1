import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getAccountByRiotId, getSummonerByPuuid, getSummonerByName, getRankedStats } from '@/lib/riot-api/client'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { gameName, tagLine, region } = await req.json()

    if (!gameName || !tagLine || !region) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Determine platform routing
    const platform = region.startsWith('na') ? 'americas' : 
                    region.startsWith('kr') || region.startsWith('jp') ? 'asia' : 
                    'europe'

    // Fetch account from Riot API
    const account = await getAccountByRiotId(gameName, tagLine, platform as any)
    console.log('✅ Account fetched:', account)
    
    // Fetch summoner data
    // Force fresh fetch (cache is bypassed inside if incomplete)
    let summoner = await getSummonerByPuuid(account.puuid, region as any)
    console.log('✅ Summoner fetched:', summoner)
    
    // Extract summoner ID (may not exist in newer API versions)
    let summonerId = (summoner as any).id || null
    let accountId = (summoner as any).accountId || null

    // Fallback: try by-name if id is missing
    if (!summonerId) {
      console.warn('⚠️ Summoner ID missing from by-puuid response, trying by-name...')
      try {
        const summonerByName = await getSummonerByName(account.gameName, region as any)
        console.log('✅ Summoner (by-name) fetched:', summonerByName)
        summoner = summonerByName
        summonerId = (summonerByName as any).id || null
        accountId = (summonerByName as any).accountId || null
      } catch (fallbackError) {
        console.error('❌ Fallback by-name failed:', fallbackError)
      }
    }

    console.log('📝 Summoner ID:', summonerId)
    console.log('📝 Account ID:', accountId)

    // Check if account already exists
    const { data: existingAccount } = await supabase
      .from('riot_accounts')
      .select('*')
      .eq('puuid', account.puuid)
      .single()

    if (existingAccount) {
      return NextResponse.json(
        { error: 'Ce compte Riot est déjà lié à un profil' },
        { status: 409 }
      )
    }

    // Check how many accounts user has
    const { data: userAccounts } = await supabase
      .from('riot_accounts')
      .select('id')
      .eq('profile_id', user.id)

    // Insert riot account
    const supabaseAny = supabase as any
    const insertData = {
      profile_id: user.id,
      puuid: account.puuid,
      game_name: account.gameName,
      tag_line: account.tagLine,
      summoner_id: summonerId,
      account_id: accountId,
      region: region,
      summoner_level: summoner.summonerLevel,
      profile_icon_id: summoner.profileIconId,
      is_primary: (userAccounts?.length || 0) === 0,
      verified: true,
    }
    console.log('📝 Inserting into Supabase:', insertData)

    const { data: newAccount, error } = await supabaseAny
      .from('riot_accounts')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase insert error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Account saved in DB:', newAccount)

    // Fetch and save ranked stats immediately
    // Use PUUID directly (no need for summoner ID anymore!)
    try {
      console.log('📊 Fetching ranked stats with PUUID:', account.puuid, 'region:', region)
      const rankedStats = await getRankedStats(account.puuid, region as any)
      console.log('📊 Ranked stats fetched:', rankedStats)

      // Insert stats for each queue
      for (const queueStats of rankedStats) {
        console.log('💾 Saving stats for queue:', queueStats.queueType)
        await supabaseAny
          .from('player_stats')
          .insert({
            riot_account_id: newAccount.id,
            queue_type: queueStats.queueType,
            tier: queueStats.tier,
            rank: queueStats.rank,
            league_points: queueStats.leaguePoints,
            wins: queueStats.wins,
            losses: queueStats.losses,
            last_synced: new Date().toISOString(),
          })
      }
      console.log('✅ All stats saved successfully!')
    } catch (statsError: any) {
      console.error('❌ Error fetching ranked stats:', statsError)
      console.error('❌ Error message:', statsError.message)
      console.error('❌ Error stack:', statsError.stack)
      // Don't fail the whole operation if stats fail
    }

    return NextResponse.json({
      success: true,
      account: newAccount,
    })
  } catch (error: any) {
    console.error('Error adding Riot account:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add Riot account' },
      { status: 500 }
    )
  }
}

