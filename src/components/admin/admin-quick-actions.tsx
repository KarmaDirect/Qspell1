'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Trophy, Calendar, GraduationCap, Shield, Settings } from 'lucide-react'
import Link from 'next/link'

interface AdminQuickActionsProps {
  isCEO: boolean
}

export function AdminQuickActions({ isCEO }: AdminQuickActionsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Actions rapides</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/admin/users">
          <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">Gestion utilisateurs</h3>
                <p className="text-sm text-muted-foreground">CRM complet</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/admin/tournaments">
          <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <h3 className="font-semibold">Gestion tournois</h3>
                <p className="text-sm text-muted-foreground">Créer & modérer</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/admin/calendar">
          <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div>
                <h3 className="font-semibold">Événements</h3>
                <p className="text-sm text-muted-foreground">Calendrier</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/admin/coaching/group">
          <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <GraduationCap className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Coaching Groupe</h3>
                <p className="text-sm text-muted-foreground">Organiser sessions</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/admin/moderation">
          <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Shield className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="font-semibold">Modération</h3>
                <p className="text-sm text-muted-foreground">Reports & bans</p>
              </div>
            </div>
          </Card>
        </Link>

        {isCEO && (
          <Link href="/dashboard/admin/settings">
            <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <Settings className="h-8 w-8 text-gray-500" />
                <div>
                  <h3 className="font-semibold">Paramètres</h3>
                  <p className="text-sm text-muted-foreground">Configuration</p>
                </div>
              </div>
            </Card>
          </Link>
        )}
      </div>
    </div>
  )
}

