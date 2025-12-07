'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Invitation {
  id: string
  role: string
  created_at: string
  team: {
    id: string
    name: string
    tag: string
    region: string
    captain: {
      username: string
    }
  }
  inviter: {
    username: string
  }
}

export function TeamInvitations() {
  const router = useRouter()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [responding, setResponding] = useState<string | null>(null)

  useEffect(() => {
    fetchInvitations()
  }, [])

  const fetchInvitations = async () => {
    try {
      const response = await fetch('/api/teams/invitations')
      const data = await response.json()
      
      if (response.ok) {
        setInvitations(data.invitations || [])
      }
    } catch (error) {
      console.error('Error fetching invitations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRespond = async (invitationId: string, action: 'accept' | 'decline') => {
    setResponding(invitationId)

    try {
      const response = await fetch('/api/teams/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invitationId, action }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        fetchInvitations()
        router.refresh()
      } else {
        toast.error('Erreur', { description: data.error })
      }
    } catch (error) {
      toast.error('Erreur lors de la réponse')
    } finally {
      setResponding(null)
    }
  }

  if (loading) {
    return null
  }

  if (invitations.length === 0) {
    return null
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-5 w-5" />
        <h3 className="font-semibold">Invitations d&apos;équipe</h3>
        <Badge variant="default">{invitations.length}</Badge>
      </div>

      <div className="space-y-3">
        {invitations.map((invite) => (
          <div
            key={invite.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{invite.team.name}</span>
                <Badge variant="outline">[{invite.team.tag}]</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Invité par {invite.inviter.username} • {invite.team.region.toUpperCase()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(invite.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={() => handleRespond(invite.id, 'accept')}
                disabled={responding === invite.id}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRespond(invite.id, 'decline')}
                disabled={responding === invite.id}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

