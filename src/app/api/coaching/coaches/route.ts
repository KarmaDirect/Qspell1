import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

/**
 * GET /api/coaching/coaches
 * Returns list of active coaches
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get all active coaches
    const { data: coaches, error } = await supabase
      .from('coaches')
      .select(`
        id,
        profile_id,
        bio,
        specialties,
        hourly_rate,
        rating,
        total_sessions
      `)
      .eq('is_active', true)
      .order('rating', { ascending: false })

    if (error) {
      console.error('Error fetching coaches:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Get profiles for coaches
    const profileIds = (coaches || []).map((c: any) => c.profile_id).filter(Boolean)
    let profiles: any[] = []
    
    if (profileIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, display_name')
        .in('id', profileIds)
      
      profiles = profilesData || []
    }

    // Combine coaches with profiles
    const coachesWithProfiles = (coaches || []).map((coach: any) => {
      const profile = profiles.find((p: any) => p.id === coach.profile_id)
      return {
        ...coach,
        profile: profile || {
          username: 'Unknown',
          display_name: 'Unknown',
          avatar_url: null,
        },
      }
    })

    // Format response
    const formattedCoaches = coachesWithProfiles.map((coach: any) => ({
      id: coach.id,
      profile: {
        username: coach.profile.username || 'Unknown',
        display_name: coach.profile.display_name || coach.profile.username || 'Unknown',
        avatar_url: coach.profile.avatar_url,
      },
      bio: coach.bio || 'Coach certifié League of Legends',
      specialties: coach.specialties || [],
      hourly_rate: coach.hourly_rate || 30, // Default 30€/h
      rating: coach.rating || 0,
      total_sessions: coach.total_sessions || 0,
    }))

    return NextResponse.json({
      coaches: formattedCoaches,
    })
  } catch (error: any) {
    console.error('Error in coaches API:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch coaches' },
      { status: 500 }
    )
  }
}

