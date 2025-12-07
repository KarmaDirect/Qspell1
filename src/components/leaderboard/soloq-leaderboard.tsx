'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Medal, Trophy, Crown, Loader2 } from 'lucide-react'

interface SoloQEntry {
  rank: number
  profile: {
    id: string
    username: string
    display_name: string
    avatar_url?: string
  }
  riot_account: {
    game_name: string
    tag_line: string
    region: string
  }
  tier: string
  rank_division: string
  league_points: number
  wins: number
  losses: number
  total_games: number
  winrate: number
}

export function SoloQLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<SoloQEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard/soloq?limit=100')
      const data = await response.json()
      
      if (response.ok) {
        setLeaderboard(data.leaderboard || [])
      }
    } catch (error) {
      console.error('Error fetching SoloQ leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      'CHALLENGER': 'text-yellow-500',
      'GRANDMASTER': 'text-red-500',
      'MASTER': 'text-purple-500',
      'DIAMOND': 'text-blue-400',
      'EMERALD': 'text-green-500',
      'PLATINUM': 'text-cyan-400',
      'GOLD': 'text-yellow-400',
      'SILVER': 'text-gray-300',
      'BRONZE': 'text-orange-600',
      'IRON': 'text-gray-500',
    }
    return colors[tier] || 'text-gray-400'
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-600" />
    return <span className="text-muted-foreground">#{rank}</span>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucun joueur dans le classement SoloQ pour le moment
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {leaderboard.map((entry) => (
        <div
          key={entry.profile.id}
          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="w-12 flex items-center justify-center font-bold">
            {getRankIcon(entry.rank)}
          </div>

          <Avatar>
            <AvatarImage src={entry.profile.avatar_url} />
            <AvatarFallback>
              {entry.profile.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{entry.profile.display_name}</span>
              <Badge variant="outline" className="text-xs">
                {entry.riot_account.game_name}#{entry.riot_account.tag_line}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${getTierColor(entry.tier)} bg-transparent border`}>
                {entry.tier} {entry.rank_division}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {entry.league_points} LP
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-semibold">
              {entry.winrate}% WR
            </div>
            <div className="text-xs text-muted-foreground">
              {entry.wins}W / {entry.losses}L
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

