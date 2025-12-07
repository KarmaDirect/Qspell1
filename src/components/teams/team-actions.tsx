'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UserPlus, Settings, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Team {
  id: string
  name: string
}

interface TeamActionsProps {
  team: Team
  isCaptain: boolean
}

export function TeamActions({ team, isCaptain }: TeamActionsProps) {
  const router = useRouter()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [username, setUsername] = useState('')

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteLoading(true)

    try {
      const response = await fetch(`/api/teams/${team.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Invitation envoyée !')
        setUsername('')
        setInviteOpen(false)
      } else {
        toast.error('Erreur', { description: data.error })
      }
    } catch (error) {
      toast.error('Erreur lors de l&apos;invitation')
    } finally {
      setInviteLoading(false)
    }
  }

  const handleDeleteTeam = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'équipe "${team.name}" ? Cette action est irréversible.`)) {
      return
    }

    try {
      const response = await fetch(`/api/teams/${team.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Équipe supprimée')
        router.push('/dashboard/teams')
      } else {
        const data = await response.json()
        toast.error('Erreur', { description: data.error })
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  return (
    <div className="space-y-4">
      {isCaptain && (
        <>
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Actions du capitaine</h3>
            
            <div className="space-y-2">
              <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="default">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Inviter un joueur
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Inviter un joueur</DialogTitle>
                    <DialogDescription>
                      Entrez le nom d&apos;utilisateur du joueur à inviter
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleInvite} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                      <Input
                        id="username"
                        placeholder="username123"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={inviteLoading}>
                        {inviteLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Envoi...
                          </>
                        ) : (
                          'Envoyer l&apos;invitation'
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </Card>

          <Card className="p-6 border-destructive/50">
            <h3 className="font-semibold mb-4 text-destructive">Zone de danger</h3>
            
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDeleteTeam}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer l&apos;équipe
            </Button>
          </Card>
        </>
      )}

      {!isCaptain && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Actions</h3>
          <Button variant="destructive" className="w-full">
            Quitter l&apos;équipe
          </Button>
        </Card>
      )}
    </div>
  )
}

