'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function CreateTeamButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    region: 'euw1',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Équipe créée avec succès !')
        setOpen(false)
        setFormData({ name: '', tag: '', region: 'euw1', description: '' })
        router.push(`/dashboard/teams/${data.team.id}`)
      } else {
        toast.error('Erreur lors de la création', {
          description: data.error,
        })
      }
    } catch (error) {
      toast.error('Erreur lors de la création de l&apos;équipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Créer une équipe
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle équipe</DialogTitle>
          <DialogDescription>
            Créez votre équipe pour participer aux tournois
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l&apos;équipe</Label>
            <Input
              id="name"
              placeholder="Team Awesome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag">Tag (max 5 caractères)</Label>
            <Input
              id="tag"
              placeholder="AWSM"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value.toUpperCase() })}
              required
              maxLength={5}
              style={{ textTransform: 'uppercase' }}
            />
            <p className="text-xs text-muted-foreground">
              Le tag s&apos;affichera entre crochets : [{formData.tag || 'TAG'}]
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Région</Label>
            <Select
              value={formData.region}
              onValueChange={(value) => setFormData({ ...formData, region: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="euw1">EUW - Europe de l&apos;Ouest</SelectItem>
                <SelectItem value="eune1">EUNE - Europe du Nord-Est</SelectItem>
                <SelectItem value="na1">NA - Amérique du Nord</SelectItem>
                <SelectItem value="br1">BR - Brésil</SelectItem>
                <SelectItem value="kr">KR - Corée</SelectItem>
                <SelectItem value="jp1">JP - Japon</SelectItem>
                <SelectItem value="la1">LAN - Amérique Latine Nord</SelectItem>
                <SelectItem value="la2">LAS - Amérique Latine Sud</SelectItem>
                <SelectItem value="oc1">OCE - Océanie</SelectItem>
                <SelectItem value="tr1">TR - Turquie</SelectItem>
                <SelectItem value="ru">RU - Russie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Input
              id="description"
              placeholder="Une équipe sérieuse et motivée..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              maxLength={200}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer l&apos;équipe'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

