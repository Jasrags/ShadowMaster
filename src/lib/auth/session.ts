import { createClient } from '@/lib/supabase/server'
import { User, Session } from './types'

/**
 * Get the current session (server-side only)
 * @returns The current session or null if not authenticated
 */
export async function getSession(): Promise<Session | null> {
  try {
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return null
    }

    return {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_in: session.expires_in,
      expires_at: session.expires_at,
      token_type: session.token_type,
      user: session.user as User,
    }
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

/**
 * Check if a session is valid
 * @returns true if session exists and is valid, false otherwise
 */
export async function checkSession(): Promise<boolean> {
  try {
    const session = await getSession()
    return session !== null
  } catch (error) {
    console.error('Error checking session:', error)
    return false
  }
}

/**
 * Get the current user from the session (server-side only)
 * @returns The current user or null if not authenticated
 */
export async function getUser(): Promise<User | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    return user as User | null
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

