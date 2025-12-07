'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, Ban, AlertTriangle, CheckCircle } from 'lucide-react'

export function ModerationDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Reports en attente</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Utilisateurs bannis</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <Ban className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Reports traités</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avertissements</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <Shield className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Reports list */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Reports récents</h3>
          <div className="text-center py-12 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun report pour le moment</p>
            <p className="text-sm mt-2">La communauté QSPELL reste respectueuse 🎉</p>
          </div>
        </div>
      </Card>

      {/* Banned users */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Utilisateurs bannis</h3>
          <div className="text-center py-8 text-muted-foreground">
            Aucun utilisateur banni
          </div>
        </div>
      </Card>
    </div>
  )
}

