'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Clock, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface GroupSession {
  id: string
  title: string
  lane: string
  description?: string
  scheduled_at: string
  duration_minutes: number
  max_participants: number
  status: string
}

export function GroupSessionsList() {
  const [sessions, setSessions] = useState<GroupSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/admin/coaching/group-sessions/list')
      const data = await response.json()
      
      if (response.ok) {
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette session ?')) return

    try {
      const response = await fetch(`/api/admin/coaching/group-sessions/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Session supprimée')
        fetchSessions()
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const laneEmojis: Record<string, string> = {
    top: '🏔️',
    jungle: '🌲',
    mid: '⚡',
    bot: '🎯',
    support: '🛡️',
    general: '🌟',
  }

  if (loading) {
    return <Card className="p-12 text-center">Chargement...</Card>
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Sessions programmées</h3>
      {sessions.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">
          Aucune session programmée
        </p>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Card key={session.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{laneEmojis[session.lane]}</span>
                    <h4 className="font-semibold">{session.title}</h4>
                    <Badge variant="outline" className="uppercase">
                      {session.lane}
                    </Badge>
                  </div>
                  {session.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {session.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(session.scheduled_at).toLocaleString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {session.duration_minutes} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Max {session.max_participants}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(session.id)}
                  className="text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  )
}

