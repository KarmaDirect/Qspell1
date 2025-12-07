'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, TrendingUp, Target } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type RiotAccount = Database['public']['Tables']['riot_accounts']['Row']
type PlayerStats = Database['public']['Tables']['player_stats']['Row']

const RANK_COLORS: Record<string, string> = {
  IRON: 'bg-gray-600',
  BRONZE: 'bg-orange-700',
  SILVER: 'bg-gray-400',
  GOLD: 'bg-yellow-500',
  PLATINUM: 'bg-cyan-500',
  EMERALD: 'bg-emerald-500',
  DIAMOND: 'bg-blue-500',
  MASTER: 'bg-purple-500',
  GRANDMASTER: 'bg-red-500',
  CHALLENGER: 'bg-amber-500',
}

export function PlayerStatsCard({ 
  account, 
  stats 
}: { 
  account: RiotAccount
  stats: PlayerStats[]
}) {
  const rankedSolo = stats.find(s => s.queue_type === 'RANKED_SOLO_5x5')
  const rankedFlex = stats.find(s => s.queue_type === 'RANKED_FLEX_SR')

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Statistiques Ranked</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Solo/Duo */}
        <RankedStatsSection 
          title="Solo/Duo"
          stat={rankedSolo}
        />

        {/* Flex */}
        <RankedStatsSection 
          title="Flex 5v5"
          stat={rankedFlex}
        />
      </div>

      {/* Champion Mastery */}
      {rankedSolo?.champion_mastery && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Champions maîtrisés
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {/* Placeholder - would need champion icons from Data Dragon */}
            <div className="text-center">
              <div className="h-16 w-16 bg-muted rounded-lg mx-auto mb-2" />
              <p className="text-xs font-medium">Champion</p>
              <p className="text-xs text-muted-foreground">M7</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

function RankedStatsSection({ 
  title, 
  stat 
}: { 
  title: string
  stat?: PlayerStats
}) {
  if (!stat || !stat.tier) {
    return (
      <div>
        <h3 className="font-semibold mb-3">{title}</h3>
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Non classé</p>
        </div>
      </div>
    )
  }

  const totalGames = (stat.wins || 0) + (stat.losses || 0)
  const winrate = totalGames > 0 ? Math.round(((stat.wins || 0) / totalGames) * 100) : 0
  const rankColor = RANK_COLORS[stat.tier] || 'bg-gray-500'

  return (
    <div>
      <h3 className="font-semibold mb-3">{title}</h3>
      
      <div className="space-y-4">
        {/* Rank Badge */}
        <div className="flex items-center gap-3">
          <div className={`h-16 w-16 rounded-lg ${rankColor} flex items-center justify-center text-white font-bold`}>
            <div className="text-center">
              <div className="text-xs">{stat.tier}</div>
              <div className="text-xl">{stat.rank}</div>
            </div>
          </div>
          <div>
            <p className="font-semibold">{stat.tier} {stat.rank}</p>
            <p className="text-sm text-muted-foreground">{stat.league_points} LP</p>
          </div>
        </div>

        {/* Win/Loss */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Winrate</span>
            <span className="font-semibold">{winrate}%</span>
          </div>
          <Progress value={winrate} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{stat.wins}V</span>
            <span>{stat.losses}D</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-muted rounded p-2">
            <div className="text-muted-foreground text-xs">Total</div>
            <div className="font-semibold">{totalGames} games</div>
          </div>
          <div className="bg-muted rounded p-2">
            <div className="text-muted-foreground text-xs">Form</div>
            <div className="font-semibold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {winrate > 50 ? 'En forme' : 'En baisse'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

