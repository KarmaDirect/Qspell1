'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Crown, Loader2 } from 'lucide-react'

interface TournamentEntry {
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
  } | null
  tournament_wins: number
  tournaments_played: number
}

export function TournamentLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<TournamentEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard/tournaments?limit=100')
      const data = await response.json()
      
      if (response.ok) {
        setLeaderboard(data.leaderboard || [])
      }
    } catch (error) {
      console.error('Error fetching tournament leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Trophy className="h-5 w-5 text-orange-600" />
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
        Aucun joueur n&apos;a encore gagné de tournoi
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
              {entry.riot_account && (
                <Badge variant="outline" className="text-xs">
                  {entry.riot_account.game_name}#{entry.riot_account.tag_line}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {entry.tournaments_played} tournoi{entry.tournaments_played > 1 ? 's' : ''} joué{entry.tournaments_played > 1 ? 's' : ''}
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-lg font-bold text-primary">
              <Trophy className="h-5 w-5" />
              {entry.tournament_wins}
            </div>
            <div className="text-xs text-muted-foreground">Victoire{entry.tournament_wins > 1 ? 's' : ''}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

