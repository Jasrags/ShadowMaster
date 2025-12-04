import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/lib/auth/types'
import { UserProfile } from '@/lib/supabase/schema'
import type { Session } from '@/lib/auth/types'

/**
 * Auth store state interface
 */
interface AuthState {
  /** Current authenticated user */
  user: User | null
  /** User profile information */
  profile: UserProfile | null
  /** Current session (not persisted for security) */
  session: Session | null
  /** Loading state */
  isLoading: boolean
}

/**
 * Auth store actions interface
 */
interface AuthActions {
  /** Set the current user */
  setUser: (user: User | null) => void
  /** Clear user and profile data */
  clearUser: () => void
  /** Set user profile */
  setProfile: (profile: UserProfile | null) => void
  /** Update user profile */
  updateProfile: (updates: Partial<UserProfile>) => void
  /** Set the current session */
  setSession: (session: Session | null) => void
  /** Set loading state */
  setIsLoading: (isLoading: boolean) => void
}

/**
 * Auth store type
 */
type AuthStore = AuthState & AuthActions

/**
 * Auth store with persistence
 * 
 * Persists user and profile to localStorage, but excludes session tokens for security.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      profile: null,
      session: null,
      isLoading: false,

      // Actions
      setUser: (user) => set({ user }),

      clearUser: () =>
        set({
          user: null,
          profile: null,
          session: null,
        }),

      setProfile: (profile) => set({ profile }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...updates }
            : null,
        })),

      setSession: (session) => set({ session }),

      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      // Only persist user and profile, exclude session for security
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
      }),
    }
  )
)

