import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileHeader } from '@/components/profile/profile-header'
import { RiotAccountCard } from '@/components/profile/riot-account-card'
import { PlayerStatsCard } from '@/components/profile/player-stats-card'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type RiotAccount = Database['public']['Tables']['riot_accounts']['Row']
type PlayerStats = Database['public']['Tables']['player_stats']['Row']

export default async function ProfilePage() {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: Profile | null }

  // Fetch riot accounts
  const { data: riotAccounts } = await supabase
    .from('riot_accounts')
    .select('*')
    .eq('profile_id', user.id)
    .order('is_primary', { ascending: false }) as { data: RiotAccount[] | null }

  // Fetch player stats for primary account
  const primaryAccount = riotAccounts?.find(acc => acc.is_primary) || riotAccounts?.[0]
  const { data: playerStats } = primaryAccount
    ? await supabase
        .from('player_stats')
        .select('*')
        .eq('riot_account_id', primaryAccount.id) as { data: PlayerStats[] | null }
    : { data: null }

  return (
    <div className="space-y-6">
      <ProfileHeader profile={profile} />
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RiotAccountCard 
            riotAccounts={riotAccounts || []} 
            profileId={user.id}
          />
          
          {primaryAccount && playerStats && (
            <PlayerStatsCard 
              account={primaryAccount}
              stats={playerStats}
            />
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Activité récente</h3>
            <p className="text-sm text-muted-foreground">
              Aucune activité récente
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Statistiques</h3>
            <div className="space-y-3">
              <StatItem label="Tournois joués" value="0" />
              <StatItem label="Victoires" value="0" />
              <StatItem label="Équipes" value="0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

