import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

export async function getCurrentUser() {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile as Profile | null
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentProfile()
  
  if (!profile) return false
  
  return profile.role === 'admin' && !profile.is_banned
}

export async function isModeratorOrAdmin(): Promise<boolean> {
  const profile = await getCurrentProfile()
  
  if (!profile) return false
  
  return (profile.role === 'admin' || profile.role === 'moderator') && !profile.is_banned
}

export async function isUserBanned(): Promise<{
  banned: boolean
  reason?: string
  until?: string
}> {
  const profile = await getCurrentProfile()
  
  if (!profile) {
    return { banned: false }
  }

  // Check if banned
  if (!profile.is_banned) {
    return { banned: false }
  }

  // Check if temporary ban has expired
  if (profile.banned_until) {
    const banExpiry = new Date(profile.banned_until)
    const now = new Date()
    
    if (now > banExpiry) {
      // Ban has expired, unban the user
      const supabase = await createServerClient()
      await supabase
        .from('profiles')
        .update({
          is_banned: false,
          ban_reason: null,
          banned_until: null,
        })
        .eq('id', profile.id)
      
      return { banned: false }
    }
  }

  return {
    banned: true,
    reason: profile.ban_reason || undefined,
    until: profile.banned_until || undefined,
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  const banStatus = await isUserBanned()
  if (banStatus.banned) {
    throw new Error('User is banned')
  }
  
  return user
}

export async function requireAdmin() {
  await requireAuth()
  
  const adminStatus = await isAdmin()
  
  if (!adminStatus) {
    throw new Error('Admin access required')
  }
  
  return true
}

export async function requireModeratorOrAdmin() {
  await requireAuth()
  
  const modStatus = await isModeratorOrAdmin()
  
  if (!modStatus) {
    throw new Error('Moderator or admin access required')
  }
  
  return true
}
