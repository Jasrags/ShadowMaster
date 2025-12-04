import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, SignupData, SigninData } from '../types/auth.js';
import * as authAPI from '../lib/api/auth.js';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  signup: (data: SignupData) => Promise<void>;
  signin: (data: SigninData) => Promise<void>;
  signout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      signup: async (data: SignupData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.signup(data);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to create account',
          });
          throw error;
        }
      },

      signin: async (data: SigninData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.signin(data);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to sign in',
          });
          throw error;
        }
      },

      signout: async () => {
        set({ isLoading: true });
        try {
          await authAPI.signout();
        } catch (error) {
          // Continue with signout even if API call fails
          console.error('Signout error:', error);
        } finally {
          get().clearAuth();
        }
      },

      getCurrentUser: async () => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authAPI.getCurrentUser();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          // Token might be invalid, clear auth
          get().clearAuth();
        }
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token: string | null) => {
        set({ token });
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

