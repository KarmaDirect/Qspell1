'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, Clock, Video } from 'lucide-react'
import { useState, useEffect } from 'react'

interface GroupSession {
  id: string
  title: string
  lane: string
  description: string
  scheduled_at: string
  duration_minutes: number
  max_participants: number
  current_participants: number
  price: number
  coach: {
    username: string
  }
}

export function GroupCoachingList() {
  const [sessions, setSessions] = useState<GroupSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Implement API fetch
    setSessions([])
    setLoading(false)
  }, [])

  const laneColors: Record<string, string> = {
    top: 'border-orange-500',
    jungle: 'border-green-500',
    mid: 'border-blue-500',
    bot: 'border-purple-500',
    support: 'border-yellow-500',
    general: 'border-indigo-500',
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  if (sessions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">
          Aucune session de coaching groupe programmée pour le moment.
          <br />
          Revenez bientôt pour découvrir les prochaines sessions !
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id} className={`p-6 border-l-4 ${laneColors[session.lane] || 'border-gray-500'}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold">{session.title}</h3>
                <Badge variant="outline" className="uppercase">
                  {session.lane}
                </Badge>
              </div>
              <p className="text-muted-foreground">{session.description}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{new Date(session.scheduled_at).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{session.duration_minutes} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>{session.current_participants} / {session.max_participants}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Video className="h-4 w-4 text-primary" />
              <span>Coach: {session.coach.username}</span>
            </div>
          </div>

          <Button className="w-full md:w-auto">
            S&apos;inscrire
          </Button>
        </Card>
      ))}
    </div>
  )
}

