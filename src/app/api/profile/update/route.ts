import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    
    // Fields that can be updated by the user
    const allowedFields = [
      'display_name',
      'bio',
      'avatar_url',
      'banner_url',
      'discord_username',
      'youtube_url',
      'twitch_url',
      'twitter_url',
      'instagram_url',
      'tiktok_url',
    ]

    // Filter only allowed fields
    const updateData: Record<string, any> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString()

    // Update profile
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      profile: data,
      message: 'Profile updated successfully' 
    })
  } catch (error: any) {
    console.error('Error in profile update:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}
