import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PrivateCoachingList } from '@/components/coaching/private-coaching-list'

export default async function PrivateCoachingPage() {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Coaching Privé</h1>
        <p className="text-muted-foreground">
          Réservez une session individuelle avec un coach certifié • 30€/heure
        </p>
      </div>

      <PrivateCoachingList />
    </div>
  )
}

