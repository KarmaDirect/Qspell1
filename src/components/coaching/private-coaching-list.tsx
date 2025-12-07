'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Video, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Coach {
  id: string
  profile: {
    username: string
    avatar_url?: string
  }
  bio: string
  specialties: string[]
  hourly_rate: number
  rating: number
  total_sessions: number
}

export function PrivateCoachingList() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCoaches()
  }, [])

  const fetchCoaches = async () => {
    try {
      const response = await fetch('/api/coaching/coaches')
      const data = await response.json()
      
      if (response.ok) {
        setCoaches(data.coaches || [])
      }
    } catch (error) {
      console.error('Error fetching coaches:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des coachs...</p>
        </div>
      </div>
    )
  }

  if (coaches.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">
          Aucun coach disponible pour le moment.
          <br />
          Revenez bientôt pour découvrir nos coachs certifiés !
        </p>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {coaches.map((coach) => (
        <Card key={coach.id} className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={coach.profile.avatar_url} />
              <AvatarFallback>
                {coach.profile.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{coach.profile.username}</h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold">{coach.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">
                  ({coach.total_sessions} sessions)
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {coach.bio}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {coach.specialties.map((specialty) => (
              <Badge key={specialty} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4 p-3 bg-primary/5 rounded-lg">
            <div className="text-sm">
              <span className="text-muted-foreground">Tarif: </span>
              <span className="font-bold text-lg text-primary">{coach.hourly_rate || 30}€/heure</span>
            </div>
          </div>

          <Button className="w-full">
            Réserver une session
          </Button>
        </Card>
      ))}
    </div>
  )
}

