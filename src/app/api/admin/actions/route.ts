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

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    // Get recent actions
    const { data: actions, error } = await supabase
      .from('admin_actions')
      .select(`
        id,
        action_type,
        target_type,
        target_id,
        details,
        created_at,
        admin:profiles!admin_actions_admin_id_fkey (
          username
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching admin actions:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      actions: actions || [],
    })
  } catch (error: any) {
    console.error('Error fetching admin actions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch actions' },
      { status: 500 }
    )
  }
}

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

    const { action_type, target_type, target_id, details } = await req.json()

    const { data, error } = await supabase
      .from('admin_actions')
      .insert({
        admin_id: user.id,
        action_type,
        target_type,
        target_id,
        details,
      })
      .select()
      .single()

    if (error) {
      console.error('Error logging admin action:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      action: data,
    })
  } catch (error: any) {
    console.error('Error logging admin action:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to log action' },
      { status: 500 }
    )
  }
}

