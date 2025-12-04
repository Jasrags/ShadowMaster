import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import {
  getCampaigns,
  getCampaignById,
  getCampaignsForUser,
  createCampaign as createCampaignQuery,
  updateCampaign as updateCampaignQuery,
  type Campaign,
  type CampaignInsert,
  type CampaignUpdate,
} from '@/lib/supabase/schema'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Campaign with relations (includes gm_user)
 */
type CampaignWithRelations = Campaign & {
  gm_user?: {
    id: string
    username: string
    avatar_url: string | null
    created_at: string
    updated_at: string
  }
}

/**
 * Campaign store state interface
 */
interface CampaignState {
  /** Currently selected campaign */
  currentCampaign: CampaignWithRelations | null
  /** List of all campaigns */
  campaigns: CampaignWithRelations[]
  /** Loading state */
  isLoading: boolean
  /** Error state */
  error: string | null
  /** Realtime subscription channel */
  subscription: RealtimeChannel | null
}

/**
 * Campaign store actions interface
 */
interface CampaignActions {
  /** Set the current campaign */
  setCampaign: (campaign: CampaignWithRelations | null) => void
  /** Set the campaigns list */
  setCampaigns: (campaigns: CampaignWithRelations[]) => void
  /** Update a campaign in the list */
  updateCampaign: (campaignId: string, updates: CampaignUpdate) => Promise<void>
  /** Add a campaign to the list */
  addCampaign: (campaign: CampaignWithRelations) => void
  /** Remove a campaign from the list */
  removeCampaign: (campaignId: string) => void
  /** Load all campaigns */
  loadCampaigns: () => Promise<void>
  /** Load campaigns for a specific user */
  loadCampaignsForUser: (userId: string) => Promise<void>
  /** Load a campaign by ID */
  loadCampaignById: (campaignId: string) => Promise<void>
  /** Create a new campaign */
  createCampaign: (data: CampaignInsert) => Promise<CampaignWithRelations | null>
  /** Set error state */
  setError: (error: string | null) => void
  /** Subscribe to realtime updates */
  subscribe: (campaignId?: string) => void
  /** Unsubscribe from realtime updates */
  unsubscribe: () => void
}

/**
 * Campaign store type
 */
type CampaignStore = CampaignState & CampaignActions

/**
 * Campaign store with Supabase integration
 */
export const useCampaignStore = create<CampaignStore>((set, get) => ({
  // Initial state
  currentCampaign: null,
  campaigns: [],
  isLoading: false,
  error: null,
  subscription: null,

  // Actions
  setCampaign: (campaign) => set({ currentCampaign: campaign }),

  setCampaigns: (campaigns) => set({ campaigns }),

  updateCampaign: async (campaignId, updates) => {
    try {
      set({ isLoading: true, error: null })
      const client = createClient()
      const { data, error } = await updateCampaignQuery(client, campaignId, updates)

      if (error) throw error

      if (data) {
        const updatedCampaign = data as CampaignWithRelations
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === campaignId ? updatedCampaign : c
          ),
          currentCampaign:
            state.currentCampaign?.id === campaignId
              ? updatedCampaign
              : state.currentCampaign,
        }))
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update campaign' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  addCampaign: (campaign) =>
    set((state) => ({
      campaigns: [campaign, ...state.campaigns],
    })),

  removeCampaign: (campaignId) =>
    set((state) => ({
      campaigns: state.campaigns.filter((c) => c.id !== campaignId),
      currentCampaign:
        state.currentCampaign?.id === campaignId
          ? null
          : state.currentCampaign,
    })),

  loadCampaigns: async () => {
    try {
      set({ isLoading: true, error: null })
      const client = createClient()
      const { data, error } = await getCampaigns(client)

      if (error) throw error

      set({ campaigns: (data as CampaignWithRelations[]) || [] })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load campaigns',
      })
    } finally {
      set({ isLoading: false })
    }
  },

  loadCampaignsForUser: async (userId) => {
    try {
      set({ isLoading: true, error: null })
      const client = createClient()
      const { data, error } = await getCampaignsForUser(client, userId)

      if (error) throw error

      set({ campaigns: (data as CampaignWithRelations[]) || [] })
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load campaigns for user',
      })
    } finally {
      set({ isLoading: false })
    }
  },

  loadCampaignById: async (campaignId) => {
    try {
      set({ isLoading: true, error: null })
      const client = createClient()
      const { data, error } = await getCampaignById(client, campaignId)

      if (error) throw error

      if (data) {
        const campaign = data as CampaignWithRelations
        set({ currentCampaign: campaign })
        // Also update in campaigns list if present
        set((state) => ({
          campaigns: state.campaigns.some((c) => c.id === campaignId)
            ? state.campaigns.map((c) => (c.id === campaignId ? campaign : c))
            : [campaign, ...state.campaigns],
        }))
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to load campaign',
      })
    } finally {
      set({ isLoading: false })
    }
  },

  createCampaign: async (data) => {
    try {
      set({ isLoading: true, error: null })
      const client = createClient()
      const { data: campaign, error } = await createCampaignQuery(client, data)

      if (error) throw error

      if (campaign) {
        const newCampaign = campaign as CampaignWithRelations
        get().addCampaign(newCampaign)
        return newCampaign
      }
      return null
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to create campaign',
      })
      return null
    } finally {
      set({ isLoading: false })
    }
  },

  setError: (error) => set({ error }),

  subscribe: (campaignId) => {
    const { subscription } = get()
    if (subscription) {
      subscription.unsubscribe()
    }

    const client = createClient()
    let channel: RealtimeChannel

    if (campaignId) {
      // Subscribe to specific campaign updates
      channel = client
        .channel(`campaign:${campaignId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'campaigns',
            filter: `id=eq.${campaignId}`,
          },
          (payload) => {
            if (payload.eventType === 'UPDATE' && payload.new) {
              const updated = payload.new as CampaignWithRelations
              set((state) => ({
                currentCampaign:
                  state.currentCampaign?.id === campaignId ? updated : state.currentCampaign,
                campaigns: state.campaigns.map((c) =>
                  c.id === campaignId ? updated : c
                ),
              }))
            } else if (payload.eventType === 'DELETE') {
              get().removeCampaign(campaignId)
            }
          }
        )
        .subscribe()
    } else {
      // Subscribe to all campaign updates
      channel = client
        .channel('campaigns:all')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'campaigns',
          },
          (payload) => {
            if (payload.eventType === 'INSERT' && payload.new) {
              const newCampaign = payload.new as CampaignWithRelations
              get().addCampaign(newCampaign)
            } else if (payload.eventType === 'UPDATE' && payload.new) {
              const updated = payload.new as CampaignWithRelations
              set((state) => ({
                currentCampaign:
                  state.currentCampaign?.id === updated.id
                    ? updated
                    : state.currentCampaign,
                campaigns: state.campaigns.map((c) =>
                  c.id === updated.id ? updated : c
                ),
              }))
            } else if (payload.eventType === 'DELETE' && payload.old) {
              get().removeCampaign(payload.old.id)
            }
          }
        )
        .subscribe()
    }

    set({ subscription: channel })
  },

  unsubscribe: () => {
    const { subscription } = get()
    if (subscription) {
      subscription.unsubscribe()
      set({ subscription: null })
    }
  },
}))

