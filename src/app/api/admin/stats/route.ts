import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
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

    // Get stats
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: totalTournaments } = await supabase
      .from('tournaments')
      .select('*', { count: 'exact', head: true })

    const { count: totalCoaches } = await supabase
      .from('coaches')
      .select('*', { count: 'exact', head: true })

    const { count: upcomingEvents } = await supabase
      .from('tournaments')
      .select('*', { count: 'exact', head: true })
      .in('status', ['upcoming', 'registration_open'])

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        totalTournaments: totalTournaments || 0,
        totalCoaches: totalCoaches || 0,
        upcomingEvents: upcomingEvents || 0,
      },
    })
  } catch (error: any) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

