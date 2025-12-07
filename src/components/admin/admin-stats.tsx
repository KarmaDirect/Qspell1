'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Users, Trophy, GraduationCap, Calendar } from 'lucide-react'

export function AdminStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTournaments: 0,
    totalCoaches: 0,
    upcomingEvents: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      
      if (response.ok) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<Users className="h-8 w-8" />}
        title="Utilisateurs"
        value={stats.totalUsers}
        color="text-blue-500"
      />
      <StatCard
        icon={<Trophy className="h-8 w-8" />}
        title="Tournois"
        value={stats.totalTournaments}
        color="text-yellow-500"
      />
      <StatCard
        icon={<GraduationCap className="h-8 w-8" />}
        title="Coachs"
        value={stats.totalCoaches}
        color="text-green-500"
      />
      <StatCard
        icon={<Calendar className="h-8 w-8" />}
        title="Événements à venir"
        value={stats.upcomingEvents}
        color="text-purple-500"
      />
    </div>
  )
}

function StatCard({ icon, title, value, color }: {
  icon: React.ReactNode
  title: string
  value: number
  color: string
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={color}>{icon}</div>
      </div>
    </Card>
  )
}

