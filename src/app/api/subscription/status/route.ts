import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

/**
 * GET /api/subscription/status
 * Check if user has active subscription
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check for active subscription
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        plan:subscription_plans (
          name,
          price_monthly,
          features
        )
      `)
      .eq('profile_id', user.id)
      .eq('status', 'active')
      .single()

    return NextResponse.json({
      hasSubscription: !!subscription,
      subscription: subscription || null,
    })
  } catch (error: any) {
    console.error('Error checking subscription:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check subscription' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/subscription/subscribe
 * Create subscription (mock payment)
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId } = await req.json()

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID required' }, { status: 400 })
    }

    // Get plan
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Cancel existing subscription
    await supabase
      .from('user_subscriptions')
      .update({ status: 'cancelled' })
      .eq('profile_id', user.id)
      .eq('status', 'active')

    // Create new subscription (mock - in production, verify payment first)
    const endsAt = new Date()
    endsAt.setMonth(endsAt.getMonth() + 1) // 1 month from now

    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .insert({
        profile_id: user.id,
        plan_id: planId,
        status: 'active',
        starts_at: new Date().toISOString(),
        ends_at: endsAt.toISOString(),
        payment_provider: 'mock',
        payment_id: `mock_${Date.now()}`,
      })
      .select()
      .single()

    if (subError) {
      console.error('Error creating subscription:', subError)
      return NextResponse.json(
        { error: subError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription,
    })
  } catch (error: any) {
    console.error('Error subscribing:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe' },
      { status: 500 }
    )
  }
}

