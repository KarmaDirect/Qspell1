'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, User, Video, Calendar } from 'lucide-react'
import Link from 'next/link'

interface CoachingTypesProps {
  hasSubscription: boolean
}

export function CoachingTypes({ hasSubscription }: CoachingTypesProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Types de Coaching</h2>
      <p className="text-muted-foreground mb-8">
        Choisissez le format qui vous convient le mieux
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Group Coaching */}
        <Card className="p-8 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Coaching Groupe</h3>
              <p className="text-sm text-muted-foreground">Par lane</p>
            </div>
          </div>

          <p className="text-muted-foreground mb-6">
            Rejoignez des sessions de coaching en groupe avec d&apos;autres joueurs de votre lane.
            Partagez vos expériences et apprenez ensemble.
          </p>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Sessions programmées régulièrement</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>Jusqu&apos;à 10 participants par session</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Video className="h-4 w-4 text-primary" />
              <span>En direct avec le coach</span>
            </div>
          </div>

          <Link href="/dashboard/coaching/group">
            <Button className="w-full" variant={hasSubscription ? "default" : "outline"}>
              {hasSubscription ? 'Voir les sessions' : 'Premium requis'}
            </Button>
          </Link>
        </Card>

        {/* Private Coaching */}
        <Card className="p-8 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <User className="h-8 w-8 text-purple-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Coaching Privé</h3>
              <p className="text-sm text-muted-foreground">1-on-1</p>
            </div>
          </div>

          <p className="text-muted-foreground mb-6">
            Sessions personnalisées avec un coach certifié. Analyse approfondie de votre gameplay,
            conseils adaptés à votre niveau.
          </p>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-primary" />
              <span>Session individuelle 1-on-1</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Video className="h-4 w-4 text-primary" />
              <span>Analyse de replay personnalisée</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>Plusieurs coachs disponibles</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <span>30€/heure</span>
            </div>
          </div>

          <Link href="/dashboard/coaching/private">
            <Button className="w-full">
              Trouver un coach
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}

