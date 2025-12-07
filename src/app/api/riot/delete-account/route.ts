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

    const { riotAccountId } = await req.json()

    if (!riotAccountId) {
      return NextResponse.json({ error: 'Riot account ID required' }, { status: 400 })
    }

    // Verify ownership
    const { data: riotAccount, error: fetchError } = await supabase
      .from('riot_accounts')
      .select('*')
      .eq('id', riotAccountId)
      .eq('profile_id', user.id)
      .single()

    if (fetchError || !riotAccount) {
      return NextResponse.json({ error: 'Riot account not found' }, { status: 404 })
    }

    // Delete associated player_stats first (foreign key constraint)
    await supabase
      .from('player_stats')
      .delete()
      .eq('riot_account_id', riotAccountId)

    // Delete riot account
    const { error: deleteError } = await supabase
      .from('riot_accounts')
      .delete()
      .eq('id', riotAccountId)
      .eq('profile_id', user.id)

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Riot account deleted successfully' 
    })
  } catch (error: any) {
    console.error('Error deleting Riot account:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete Riot account' },
      { status: 500 }
    )
  }
}

