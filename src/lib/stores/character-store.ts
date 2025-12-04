import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createClient } from '@/lib/supabase/client'
import {
  getCharacters,
  getCharacterById,
  createCharacter as createCharacterQuery,
  updateCharacter as updateCharacterQuery,
  type Character,
  type CharacterInsert,
  type CharacterUpdate,
} from '@/lib/supabase/schema'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Json } from '@/types/database'

/**
 * Character with relations (includes player and campaign)
 */
type CharacterWithRelations = Character & {
  player?: {
    id: string
    username: string
    avatar_url: string | null
    created_at: string
    updated_at: string
  }
  campaign?: {
    id: string
    name: string
    description: string | null
    setting: string | null
    gm_user_id: string
    is_active: boolean
    created_at: string
    updated_at: string
  }
}

/**
 * Character store state interface
 */
interface CharacterState {
  /** Currently active character */
  activeCharacter: CharacterWithRelations | null
  /** List of characters for current campaign */
  characters: CharacterWithRelations[]
  /** Loading state */
  isLoading: boolean
  /** Error state */
  error: string | null
  /** Current campaign ID filter */
  currentCampaignId: string | null
  /** Realtime subscription channel */
  subscription: RealtimeChannel | null
}

/**
 * Character store actions interface
 */
interface CharacterActions {
  /** Set the active character */
  setCharacter: (character: CharacterWithRelations | null) => void
  /** Set the characters list */
  setCharacters: (characters: CharacterWithRelations[]) => void
  /** Update a character */
  updateCharacter: (
    characterId: string,
    updates: CharacterUpdate
  ) => Promise<void>
  /** Update nested character_data JSON field */
  updateCharacterData: (
    characterId: string,
    updates: (data: Json) => Json
  ) => Promise<void>
  /** Add a character to the list */
  addCharacter: (character: CharacterWithRelations) => void
  /** Remove a character from the list */
  removeCharacter: (characterId: string) => void
  /** Load characters for a campaign */
  loadCharacters: (campaignId: string) => Promise<void>
  /** Load a character by ID */
  loadCharacterById: (characterId: string) => Promise<void>
  /** Create a new character */
  createCharacter: (
    data: CharacterInsert
  ) => Promise<CharacterWithRelations | null>
  /** Set current campaign ID filter */
  setCurrentCampaignId: (campaignId: string | null) => void
  /** Set error state */
  setError: (error: string | null) => void
  /** Subscribe to realtime updates */
  subscribe: (campaignId?: string) => void
  /** Unsubscribe from realtime updates */
  unsubscribe: () => void
}

/**
 * Character store type
 */
type CharacterStore = CharacterState & CharacterActions

/**
 * Character store with Supabase integration and immer middleware for nested updates
 */
export const useCharacterStore = create<CharacterStore>()(
  immer((set, get) => ({
    // Initial state
    activeCharacter: null,
    characters: [],
    isLoading: false,
    error: null,
    currentCampaignId: null,
    subscription: null,

    // Actions
    setCharacter: (character) =>
      set((state) => {
        state.activeCharacter = character
      }),

    setCharacters: (characters) =>
      set((state) => {
        state.characters = characters
      }),

    updateCharacter: async (characterId, updates) => {
      try {
        set((state) => {
          state.isLoading = true
          state.error = null
        })
        const client = createClient()
        const { data, error } = await updateCharacterQuery(
          client,
          characterId,
          updates
        )

        if (error) throw error

        if (data) {
          const updatedCharacter = data as CharacterWithRelations
          set((state) => {
            state.characters = state.characters.map((c) =>
              c.id === characterId ? updatedCharacter : c
            )
            if (state.activeCharacter?.id === characterId) {
              state.activeCharacter = updatedCharacter
            }
          })
        }
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error
              ? error.message
              : 'Failed to update character'
        })
        throw error
      } finally {
        set((state) => {
          state.isLoading = false
        })
      }
    },

    updateCharacterData: async (characterId, updater) => {
      try {
        set((state) => {
          state.isLoading = true
          state.error = null
        })
        const client = createClient()

        // Get current character to access character_data
        const character = get().characters.find((c) => c.id === characterId)
        if (!character) {
          throw new Error('Character not found')
        }

        // Update character_data using the updater function
        const currentData = (character.character_data as Json) || {}
        const updatedData = updater(currentData)

        const { data, error } = await updateCharacterQuery(client, characterId, {
          character_data: updatedData,
        })

        if (error) throw error

        if (data) {
          const updatedCharacter = data as CharacterWithRelations
          set((state) => {
            state.characters = state.characters.map((c) =>
              c.id === characterId ? updatedCharacter : c
            )
            if (state.activeCharacter?.id === characterId) {
              state.activeCharacter = updatedCharacter
            }
          })
        }
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error
              ? error.message
              : 'Failed to update character data'
        })
        throw error
      } finally {
        set((state) => {
          state.isLoading = false
        })
      }
    },

    addCharacter: (character) =>
      set((state) => {
        // Only add if it matches current campaign filter or no filter is set
        if (
          !state.currentCampaignId ||
          character.campaign_id === state.currentCampaignId
        ) {
          state.characters.push(character)
        }
      }),

    removeCharacter: (characterId) =>
      set((state) => {
        state.characters = state.characters.filter((c) => c.id !== characterId)
        if (state.activeCharacter?.id === characterId) {
          state.activeCharacter = null
        }
      }),

    loadCharacters: async (campaignId) => {
      try {
        set((state) => {
          state.isLoading = true
          state.error = null
          state.currentCampaignId = campaignId
        })
        const client = createClient()
        const { data, error } = await getCharacters(client, campaignId)

        if (error) throw error

        set((state) => {
          state.characters = (data as CharacterWithRelations[]) || []
        })
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error
              ? error.message
              : 'Failed to load characters'
        })
      } finally {
        set((state) => {
          state.isLoading = false
        })
      }
    },

    loadCharacterById: async (characterId) => {
      try {
        set((state) => {
          state.isLoading = true
          state.error = null
        })
        const client = createClient()
        const { data, error } = await getCharacterById(client, characterId)

        if (error) throw error

        if (data) {
          const character = data as CharacterWithRelations
          set((state) => {
            state.activeCharacter = character
            // Also update in characters list if present
            const index = state.characters.findIndex((c) => c.id === characterId)
            if (index >= 0) {
              state.characters[index] = character
            } else {
              state.characters.push(character)
            }
          })
        }
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error ? error.message : 'Failed to load character'
        })
      } finally {
        set((state) => {
          state.isLoading = false
        })
      }
    },

    createCharacter: async (data) => {
      try {
        set((state) => {
          state.isLoading = true
          state.error = null
        })
        const client = createClient()
        const { data: character, error } = await createCharacterQuery(
          client,
          data
        )

        if (error) throw error

        if (character) {
          const newCharacter = character as CharacterWithRelations
          get().addCharacter(newCharacter)
          return newCharacter
        }
        return null
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error ? error.message : 'Failed to create character'
        })
        return null
      } finally {
        set((state) => {
          state.isLoading = false
        })
      }
    },

    setCurrentCampaignId: (campaignId) =>
      set((state) => {
        state.currentCampaignId = campaignId
      }),

    setError: (error) =>
      set((state) => {
        state.error = error
      }),

    subscribe: (campaignId) => {
      const { subscription } = get()
      if (subscription) {
        subscription.unsubscribe()
      }

      const client = createClient()
      let channel: RealtimeChannel

      if (campaignId) {
        // Subscribe to characters for specific campaign
        channel = client
          .channel(`characters:campaign:${campaignId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'characters',
              filter: `campaign_id=eq.${campaignId}`,
            },
            (payload) => {
              if (payload.eventType === 'INSERT' && payload.new) {
                const newCharacter = payload.new as CharacterWithRelations
                get().addCharacter(newCharacter)
              } else if (payload.eventType === 'UPDATE' && payload.new) {
                const updated = payload.new as CharacterWithRelations
                set((state) => {
                  const index = state.characters.findIndex(
                    (c) => c.id === updated.id
                  )
                  if (index >= 0) {
                    state.characters[index] = updated
                  }
                  if (state.activeCharacter?.id === updated.id) {
                    state.activeCharacter = updated
                  }
                })
              } else if (payload.eventType === 'DELETE' && payload.old) {
                get().removeCharacter(payload.old.id)
              }
            }
          )
          .subscribe()
      } else {
        // Subscribe to all character updates
        channel = client
          .channel('characters:all')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'characters',
            },
            (payload) => {
              if (payload.eventType === 'INSERT' && payload.new) {
                const newCharacter = payload.new as CharacterWithRelations
                get().addCharacter(newCharacter)
              } else if (payload.eventType === 'UPDATE' && payload.new) {
                const updated = payload.new as CharacterWithRelations
                set((state) => {
                  const index = state.characters.findIndex(
                    (c) => c.id === updated.id
                  )
                  if (index >= 0) {
                    state.characters[index] = updated
                  }
                  if (state.activeCharacter?.id === updated.id) {
                    state.activeCharacter = updated
                  }
                })
              } else if (payload.eventType === 'DELETE' && payload.old) {
                get().removeCharacter(payload.old.id)
              }
            }
          )
          .subscribe()
      }

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

