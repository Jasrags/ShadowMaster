import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createClient } from '@/lib/supabase/client'
import {
  getGameState,
  createGameState as createGameStateQuery,
  updateGameState as updateGameStateQuery,
  type GameState,
} from '@/lib/supabase/schema'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Json } from '@/types/database'

/**
 * Initiative entry type
 */
export interface InitiativeEntry {
  id: string
  characterId?: string
  name: string
  initiative: number
  order?: number
}

/**
 * Active effect type
 */
export interface ActiveEffect {
  id: string
  characterId?: string
  name: string
  description?: string
  duration?: number
  remaining?: number
  type: 'buff' | 'debuff' | 'condition' | 'other'
}

/**
 * Tool mode type
 */
export type ToolMode = 'select' | 'move' | 'draw' | 'measure' | 'erase' | 'text'

/**
 * Game state store state interface
 */
interface GameStateState {
  /** Initiative order array */
  initiativeOrder: InitiativeEntry[]
  /** Active effects array */
  activeEffects: ActiveEffect[]
  /** Selected token IDs */
  selectedTokens: string[]
  /** Current tool mode */
  toolMode: ToolMode
  /** Current session ID */
  currentSessionId: string | null
  /** Loading state */
  isLoading: boolean
  /** Error state */
  error: string | null
  /** Realtime subscription channel */
  subscription: RealtimeChannel | null
}

/**
 * Game state store actions interface
 */
interface GameStateActions {
  /** Set initiative order */
  setInitiativeOrder: (order: InitiativeEntry[]) => void
  /** Add entry to initiative */
  addToInitiative: (entry: InitiativeEntry) => void
  /** Remove entry from initiative */
  removeFromInitiative: (id: string) => void
  /** Update initiative entry */
  updateInitiativeEntry: (id: string, updates: Partial<InitiativeEntry>) => void
  /** Set active effects */
  setActiveEffects: (effects: ActiveEffect[]) => void
  /** Add an effect */
  addEffect: (effect: ActiveEffect) => void
  /** Remove an effect */
  removeEffect: (id: string) => void
  /** Update an effect */
  updateEffect: (id: string, updates: Partial<ActiveEffect>) => void
  /** Set selected tokens */
  setSelectedTokens: (tokenIds: string[]) => void
  /** Add token to selection */
  addSelectedToken: (tokenId: string) => void
  /** Remove token from selection */
  removeSelectedToken: (tokenId: string) => void
  /** Clear selected tokens */
  clearSelectedTokens: () => void
  /** Set tool mode */
  setToolMode: (mode: ToolMode) => void
  /** Set current session ID */
  setSessionId: (sessionId: string | null) => void
  /** Load game state from Supabase */
  loadGameState: (sessionId: string) => Promise<void>
  /** Save game state to Supabase */
  saveGameState: () => Promise<void>
  /** Set error state */
  setError: (error: string | null) => void
  /** Subscribe to realtime updates */
  subscribe: (sessionId: string) => void
  /** Unsubscribe from realtime updates */
  unsubscribe: () => void
}

/**
 * Game state store type
 */
type GameStateStore = GameStateState & GameStateActions

/**
 * Game state store with Supabase integration and immer middleware
 */
export const useGameStateStore = create<GameStateStore>()(
  immer((set, get) => ({
    // Initial state
    initiativeOrder: [],
    activeEffects: [],
    selectedTokens: [],
    toolMode: 'select',
    currentSessionId: null,
    isLoading: false,
    error: null,
    subscription: null,

    // Actions
    setInitiativeOrder: (order) =>
      set((state) => {
        state.initiativeOrder = order
      }),

    addToInitiative: (entry) =>
      set((state) => {
        state.initiativeOrder.push(entry)
        // Sort by initiative value (descending)
        state.initiativeOrder.sort((a, b) => b.initiative - a.initiative)
      }),

    removeFromInitiative: (id) =>
      set((state) => {
        state.initiativeOrder = state.initiativeOrder.filter(
          (entry) => entry.id !== id
        )
      }),

    updateInitiativeEntry: (id, updates) =>
      set((state) => {
        const index = state.initiativeOrder.findIndex((entry) => entry.id === id)
        if (index >= 0) {
          state.initiativeOrder[index] = {
            ...state.initiativeOrder[index],
            ...updates,
          }
          // Re-sort if initiative changed
          if (updates.initiative !== undefined) {
            state.initiativeOrder.sort((a, b) => b.initiative - a.initiative)
          }
        }
      }),

    setActiveEffects: (effects) =>
      set((state) => {
        state.activeEffects = effects
      }),

    addEffect: (effect) =>
      set((state) => {
        state.activeEffects.push(effect)
      }),

    removeEffect: (id) =>
      set((state) => {
        state.activeEffects = state.activeEffects.filter(
          (effect) => effect.id !== id
        )
      }),

    updateEffect: (id, updates) =>
      set((state) => {
        const index = state.activeEffects.findIndex((effect) => effect.id === id)
        if (index >= 0) {
          state.activeEffects[index] = {
            ...state.activeEffects[index],
            ...updates,
          }
        }
      }),

    setSelectedTokens: (tokenIds) =>
      set((state) => {
        state.selectedTokens = tokenIds
      }),

    addSelectedToken: (tokenId) =>
      set((state) => {
        if (!state.selectedTokens.includes(tokenId)) {
          state.selectedTokens.push(tokenId)
        }
      }),

    removeSelectedToken: (tokenId) =>
      set((state) => {
        state.selectedTokens = state.selectedTokens.filter(
          (id) => id !== tokenId
        )
      }),

    clearSelectedTokens: () =>
      set((state) => {
        state.selectedTokens = []
      }),

    setToolMode: (mode) =>
      set((state) => {
        state.toolMode = mode
      }),

    setSessionId: (sessionId) =>
      set((state) => {
        state.currentSessionId = sessionId
      }),

    loadGameState: async (sessionId) => {
      try {
        set((state) => {
          state.isLoading = true
          state.error = null
          state.currentSessionId = sessionId
        })
        const client = createClient()
        const { data, error } = await getGameState(client, sessionId)

        if (error) throw error

        if (data) {
          set((state) => {
            // Parse initiative_order from JSON
            if (data.initiative_order) {
              try {
                state.initiativeOrder =
                  (data.initiative_order as InitiativeEntry[]) || []
              } catch {
                state.initiativeOrder = []
              }
            }

            // Parse active_effects from JSON
            if (data.active_effects) {
              try {
                state.activeEffects =
                  (data.active_effects as ActiveEffect[]) || []
              } catch {
                state.activeEffects = []
              }
            }
          })
        }
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error
              ? error.message
              : 'Failed to load game state'
        })
      } finally {
        set((state) => {
          state.isLoading = false
        })
      }
    },

    saveGameState: async () => {
      const { currentSessionId, initiativeOrder, activeEffects } = get()
      if (!currentSessionId) {
        throw new Error('No session ID set')
      }

      try {
        set((state) => {
          state.isLoading = true
          state.error = null
        })
        const client = createClient()

        // Check if game state exists
        const { data: existing } = await getGameState(
          client,
          currentSessionId
        )

        const gameStateData = {
          initiative_order: initiativeOrder as Json,
          active_effects: activeEffects as Json,
        }

        if (existing) {
          // Update existing game state
          const { error } = await updateGameStateQuery(
            client,
            currentSessionId,
            gameStateData
          )
          if (error) throw error
        } else {
          // Create new game state
          const { error } = await createGameStateQuery(client, {
            session_id: currentSessionId,
            ...gameStateData,
          })
          if (error) throw error
        }
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error
              ? error.message
              : 'Failed to save game state'
        })
        throw error
      } finally {
        set((state) => {
          state.isLoading = false
        })
      }
    },

    setError: (error) =>
      set((state) => {
        state.error = error
      }),

    subscribe: (sessionId) => {
      const { subscription } = get()
      if (subscription) {
        subscription.unsubscribe()
      }

      const client = createClient()
      const channel = client
        .channel(`game-state:${sessionId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'game_state',
            filter: `session_id=eq.${sessionId}`,
          },
          (payload) => {
            if (payload.new) {
              const gameState = payload.new as GameState
              set((state) => {
                // Update initiative order
                if (gameState.initiative_order) {
                  try {
                    state.initiativeOrder =
                      (gameState.initiative_order as InitiativeEntry[]) || []
                  } catch {
                    state.initiativeOrder = []
                  }
                }

                // Update active effects
                if (gameState.active_effects) {
                  try {
                    state.activeEffects =
                      (gameState.active_effects as ActiveEffect[]) || []
                  } catch {
                    state.activeEffects = []
                  }
                }
              })
            }
          }
        )
        .subscribe()

      set((state) => {
        state.subscription = channel
      })
    },

    unsubscribe: () => {
      const { subscription } = get()
      if (subscription) {
        subscription.unsubscribe()
        set((state) => {
          state.subscription = null
        })
      }
    },
  }))
)

