import { createServerClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { TeamHeader } from '@/components/teams/team-header'
import { TeamRoster } from '@/components/teams/team-roster'
import { TeamActions } from '@/components/teams/team-actions'

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Handle params (can be Promise in Next.js 15+)
  const resolvedParams = await (params instanceof Promise ? params : Promise.resolve(params))
  const teamId = resolvedParams.id

  if (!teamId) {
    notFound()
  }

  // Fetch team details directly via Supabase (évite le fetch HTTP et les problèmes de source maps)
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
    notFound()
  }

  // Fetch members (simplified query to avoid RLS issues)
  const { data: membersData, error: membersError } = await supabase
    .from('team_members')
    .select(`
      id,
      role,
      joined_at,
      profile_id
    `)
    .eq('team_id', teamId)

  // Fetch profile details separately for each member
  let members: any[] = []
  if (membersData && !membersError) {
    for (const member of membersData) {
      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', member.profile_id)
        .single()

      // Get primary Riot account
      const { data: riotAccount } = await supabase
        .from('riot_accounts')
        .select('id, game_name, tag_line, region, is_primary')
        .eq('profile_id', member.profile_id)
        .eq('is_primary', true)
        .single()

      // Get ranked stats (if riot account exists)
      let playerStats: any[] = []
      if (riotAccount?.id) {
        const { data: stats } = await supabase
          .from('player_stats')
          .select('queue_type, tier, rank, league_points, wins, losses')
          .eq('riot_account_id', riotAccount.id)
          .limit(2)
        playerStats = stats || []
      }

      members.push({
        id: member.id,
        role: member.role,
        joined_at: member.joined_at,
        profile: {
          id: profile?.id || member.profile_id,
          username: profile?.username || 'Unknown',
          avatar_url: profile?.avatar_url,
          riot_accounts: riotAccount ? [riotAccount] : [],
          player_stats: playerStats,
        },
      })
    }
  } else if (membersError) {
    console.error('Error fetching members:', membersError)
  }

  const isCaptain = team.captain_id === user.id

  return (
    <div className="container py-8">
      <TeamHeader team={team} isCaptain={isCaptain} />
      
      <div className="grid gap-6 md:grid-cols-3 mt-8">
        <div className="md:col-span-2">
          <TeamRoster 
            members={members} 
            teamId={team.id}
            isCaptain={isCaptain}
            captainId={team.captain_id}
          />
        </div>
        
        <div>
          <TeamActions 
            team={team}
            isCaptain={isCaptain}
          />
        </div>
      </div>
    </div>
  )
}

