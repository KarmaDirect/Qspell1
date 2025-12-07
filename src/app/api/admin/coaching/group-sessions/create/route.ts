import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'ceo'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get or create coach profile for admin
    let { data: coach } = await supabase
      .from('coaches')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (!coach) {
      // Create coach profile
      const { data: newCoach, error: coachError } = await supabase
        .from('coaches')
        .insert({
          profile_id: user.id,
          bio: 'Coach QSPELL',
          hourly_rate: 30,
        })
        .select()
        .single()

      if (coachError) {
        return NextResponse.json({ error: 'Failed to create coach profile' }, { status: 500 })
      }
      coach = newCoach
    }

    const body = await req.json()
    const { title, lane, description, scheduled_at, duration_minutes, max_participants, price } = body

    // Create session
    const { data: session, error } = await supabase
      .from('group_coaching_sessions')
      .insert({
        coach_id: coach.id,
        title,
        lane,
        description,
        scheduled_at,
        duration_minutes,
        max_participants,
        price,
        status: 'scheduled',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating session:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log admin action
    await supabase.from('admin_actions').insert({
      admin_id: user.id,
      action_type: 'create',
      target_type: 'group_coaching_session',
      target_id: session.id,
      details: { title, lane, scheduled_at },
    })

    return NextResponse.json({ session })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

