import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get all subscription plans
    const { data: plans, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price_monthly', { ascending: true })

    if (error) {
      console.error('Error fetching plans:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      plans: plans || [],
    })
  } catch (error: any) {
    console.error('Error fetching subscription plans:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch plans' },
      { status: 500 }
    )
  }
}

