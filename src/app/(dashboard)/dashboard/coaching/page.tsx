import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CoachingHero } from '@/components/coaching/coaching-hero'
import { CoursesGrid } from '@/components/coaching/courses-grid'
import { SubscriptionCard } from '@/components/coaching/subscription-card'
import { CoachingTypes } from '@/components/coaching/coaching-types'

export default async function CoachingPage() {
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
    .select(`
      *,
      plan:subscription_plans (
        name,
        price_monthly
      )
    `)
    .eq('profile_id', user.id)
    .eq('status', 'active')
    .single()

  const hasSubscription = !!subscription

  return (
    <div className="space-y-12">
      <CoachingHero hasSubscription={hasSubscription} />
      
      {!hasSubscription && (
        <SubscriptionCard />
      )}

      <CoursesGrid hasSubscription={hasSubscription} />

      <CoachingTypes hasSubscription={hasSubscription} />
    </div>
  )
}

