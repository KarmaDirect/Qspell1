'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Users, TrendingUp, Medal, Crown } from 'lucide-react'
import { SoloQLeaderboard } from '@/components/leaderboard/soloq-leaderboard'
import { TournamentLeaderboard } from '@/components/leaderboard/tournament-leaderboard'
import { TeamLeaderboard } from '@/components/leaderboard/team-leaderboard'

export default function LeaderboardPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Classements QSPELL</h1>
        <p className="text-muted-foreground">
          Découvrez les meilleurs joueurs et équipes de la plateforme
        </p>
      </div>

      <Tabs defaultValue="soloq" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="soloq" className="gap-2">
            <Medal className="h-4 w-4" />
            SoloQ
          </TabsTrigger>
          <TabsTrigger value="tournaments" className="gap-2">
            <Trophy className="h-4 w-4" />
            Tournois
          </TabsTrigger>
          <TabsTrigger value="teams" className="gap-2">
            <Users className="h-4 w-4" />
            Équipes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="soloq">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Classement SoloQ</h2>
              <p className="text-muted-foreground">
                Classement des joueurs selon leur rang Solo/Duo Ranked
              </p>
            </div>
            <SoloQLeaderboard />
          </Card>
        </TabsContent>

        <TabsContent value="tournaments">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Classement Tournois</h2>
              <p className="text-muted-foreground">
                Joueurs avec le plus de victoires en tournois QSPELL
              </p>
            </div>
            <TournamentLeaderboard />
          </Card>
        </TabsContent>

        <TabsContent value="teams">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Classement Équipes</h2>
              <p className="text-muted-foreground">
                Meilleures équipes selon leurs performances en tournois
              </p>
            </div>
            <TeamLeaderboard />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

