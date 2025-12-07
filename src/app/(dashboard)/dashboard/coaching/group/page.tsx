import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { GroupCoachingList } from '@/components/coaching/group-coaching-list'

export default async function GroupCoachingPage() {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check subscription
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('id')
    .eq('profile_id', user.id)
    .eq('status', 'active')
    .single()

  const hasSubscription = !!subscription

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Coaching Groupe</h1>
        <p className="text-muted-foreground">
          Rejoignez des sessions de coaching en groupe avec d&apos;autres joueurs de votre lane
        </p>
      </div>

      {!hasSubscription ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Un abonnement Premium est requis pour accéder au coaching groupe
          </p>
        </div>
      ) : (
        <GroupCoachingList />
      )}
    </div>
  )
}

