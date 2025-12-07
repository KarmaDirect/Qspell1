'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function GroupCoachingForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    lane: 'general',
    description: '',
    scheduled_at: '',
    duration_minutes: '60',
    max_participants: '10',
    price: '0',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/coaching/group-sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          duration_minutes: parseInt(formData.duration_minutes),
          max_participants: parseInt(formData.max_participants),
          price: parseFloat(formData.price),
        }),
      })

      if (response.ok) {
        toast.success('Session de coaching créée')
        setFormData({
          title: '',
          lane: 'general',
          description: '',
          scheduled_at: '',
          duration_minutes: '60',
          max_participants: '10',
          price: '0',
        })
        window.location.reload()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erreur lors de la création')
      }
    } catch (error) {
      toast.error('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Créer une session</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Titre *</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Coaching Top Lane - Basics"
            required
          />
        </div>

        <div>
          <Label>Lane *</Label>
          <Select value={formData.lane} onValueChange={(value) => setFormData({ ...formData, lane: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">🏔️ Top Lane</SelectItem>
              <SelectItem value="jungle">🌲 Jungle</SelectItem>
              <SelectItem value="mid">⚡ Mid Lane</SelectItem>
              <SelectItem value="bot">🎯 Bot Lane (ADC)</SelectItem>
              <SelectItem value="support">🛡️ Support</SelectItem>
              <SelectItem value="general">🌟 Général</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Description</Label>
          <Input
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description de la session..."
          />
        </div>

        <div>
          <Label>Date et heure *</Label>
          <Input
            type="datetime-local"
            value={formData.scheduled_at}
            onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Durée (minutes)</Label>
            <Input
              type="number"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
              min="30"
              step="15"
            />
          </div>
          <div>
            <Label>Max participants</Label>
            <Input
              type="number"
              value={formData.max_participants}
              onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
              min="1"
              max="20"
            />
          </div>
        </div>

        <div>
          <Label>Prix (€)</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            min="0"
            step="0.01"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Gratuit si inclus dans l&apos;abonnement Premium
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Créer la session
        </Button>
      </form>
    </Card>
  )
}

