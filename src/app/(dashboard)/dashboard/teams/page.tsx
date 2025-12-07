import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TeamList } from '@/components/teams/team-list'
import { CreateTeamButton } from '@/components/teams/create-team-button'

export default async function TeamsPage() {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mes Équipes</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos équipes et participez à des tournois
          </p>
        </div>
        <CreateTeamButton />
      </div>

      <TeamList />
    </div>
  )
}

