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
    .single<{
      id: string
      name: string
      tag: string
      logo_url: string | null
      captain_id: string
      description: string | null
      region: string | null
      looking_for_players: boolean
      captain: { id: string; username: string; avatar_url: string | null }
      [key: string]: any
    }>()

  if (teamError || !team) {
    notFound()
  }

  // Ensure team has required properties
  if (!team.name || !team.tag || !team.region || !team.captain) {
    notFound()
  }

  // Fetch members (simplified query to avoid RLS issues)
  type TeamMemberRow = { id: string; role: string; joined_at: string; profile_id: string }
  const membersResult = await supabase
    .from('team_members')
    .select(`
      id,
      role,
      joined_at,
      profile_id
    `)
    .eq('team_id', teamId)
  const membersData = membersResult.data as TeamMemberRow[] | null
  const membersError = membersResult.error

  // Fetch profile details separately for each member
  let members: any[] = []
  if (membersData && !membersError) {
    for (const member of membersData) {
      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', member.profile_id)
        .single<{ id: string; username: string; avatar_url: string | null }>()

      // Get primary Riot account
      const { data: riotAccount } = await supabase
        .from('riot_accounts')
        .select('id, game_name, tag_line, region, is_primary')
        .eq('profile_id', member.profile_id)
        .eq('is_primary', true)
        .single<{ id: string; game_name: string; tag_line: string; region: string; is_primary: boolean }>()

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

  // Transform team to match component types
  const teamForHeader = {
    name: team.name,
    tag: team.tag,
    logo_url: team.logo_url || undefined,
    region: team.region || '',
    description: team.description || undefined,
    looking_for_players: team.looking_for_players,
    captain: team.captain,
  }

  const teamForActions = {
    id: team.id,
    name: team.name,
  }

  return (
    <div className="container py-8">
      <TeamHeader team={teamForHeader} isCaptain={isCaptain} />
      
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
            team={teamForActions}
            isCaptain={isCaptain}
          />
        </div>
      </div>
    </div>
  )
}

