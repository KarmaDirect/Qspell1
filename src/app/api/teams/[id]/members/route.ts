import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const teamId = params.id
    const { username, role = 'player' } = await req.json()

    // Check if user is captain
    const { data: team } = await supabase
      .from('teams')
      .select('captain_id')
      .eq('id', teamId)
      .single()

    if (!team || team.captain_id !== user.id) {
      return NextResponse.json(
        { error: 'Only team captain can invite members' },
        { status: 403 }
      )
    }

    // Find user by username
    const { data: invitedUser, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single()

    if (userError || !invitedUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Check if already a member
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('profile_id', invitedUser.id)
      .single()

    if (existingMember) {
      return NextResponse.json(
        { error: 'Ce joueur est déjà membre de l&apos;équipe' },
        { status: 409 }
      )
    }

    // Create invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('team_invitations')
      .insert({
        team_id: teamId,
        inviter_id: user.id,
        invitee_id: invitedUser.id,
        role,
        status: 'pending',
      })
      .select()
      .single()

    if (inviteError) {
      console.error('Error creating invitation:', inviteError)
      return NextResponse.json(
        { error: inviteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      invitation,
    })
  } catch (error: any) {
    console.error('Error inviting member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to invite member' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const teamId = params.id
    const { memberId } = await req.json()

    // Check if user is captain
    const { data: team } = await supabase
      .from('teams')
      .select('captain_id')
      .eq('id', teamId)
      .single()

    if (!team || team.captain_id !== user.id) {
      return NextResponse.json(
        { error: 'Only team captain can remove members' },
        { status: 403 }
      )
    }

    // Cannot remove captain
    if (memberId === team.captain_id) {
      return NextResponse.json(
        { error: 'Cannot remove team captain' },
        { status: 400 }
      )
    }

    // Remove member
    const { error: deleteError } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('profile_id', memberId)

    if (deleteError) {
      console.error('Error removing member:', deleteError)
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Member removed successfully',
    })
  } catch (error: any) {
    console.error('Error removing member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to remove member' },
      { status: 500 }
    )
  }
}

