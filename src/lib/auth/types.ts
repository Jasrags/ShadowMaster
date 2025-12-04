import { User as SupabaseUser } from '@supabase/supabase-js'

/**
 * Extended user type that includes profile information
 */
export interface User extends SupabaseUser {
  // Additional profile fields can be added here
  // when the users_profile table is created
}

/**
 * Session type for authentication
 */
export interface Session {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: User
}

/**
 * User profile type (matches database schema)
 */
export interface UserProfile {
  id: string
  username: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

