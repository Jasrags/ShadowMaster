import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Json } from '@/types/database'

/**
 * Grid settings interface
 */
export interface GridSettings {
  /** Grid size in pixels */
  size: number
  /** Grid color */
  color: string
  /** Grid opacity (0-1) */
  opacity: number
  /** Whether grid is visible */
  visible: boolean
  /** Grid type */
  type: 'square' | 'hex' | 'none'
}

/**
 * Token position interface
 */
export interface TokenPosition {
  x: number
  y: number
  rotation?: number
  scale?: number
}

/**
 * Layer visibility record
 */
export type LayerVisibility = Record<string, boolean>

/**
 * VTT store state interface
 */
interface VTTState {
  /** Canvas zoom level */
  zoom: number
  /** Canvas pan position */
  pan: { x: number; y: number }
  /** Grid settings */
  gridSettings: GridSettings
  /** Layer visibility map */
  layerVisibility: LayerVisibility
  /** Currently selected tool */
  selectedTool: string
  /** Token positions map (tokenId -> position) */
  tokenPositions: Record<string, TokenPosition>
  /** Current map ID */
  currentMapId: string | null
  /** Loading state */
  isLoading: boolean
  /** Error state */
  error: string | null
  /** Realtime subscription channel */
  subscription: RealtimeChannel | null
}

/**
 * VTT store actions interface
 */
interface VTTActions {
  /** Set zoom level */
  setZoom: (zoom: number) => void
  /** Set pan position */
  setPan: (pan: { x: number; y: number }) => void
  /** Update grid settings */
  updateGridSettings: (settings: Partial<GridSettings>) => void
  /** Toggle layer visibility */
  toggleLayer: (layerId: string) => void
  /** Set layer visibility */
  setLayerVisibility: (layerId: string, visible: boolean) => void
  /** Set selected tool */
  setSelectedTool: (tool: string) => void
  /** Update token position */
  updateTokenPosition: (tokenId: string, position: TokenPosition) => void
  /** Update multiple token positions */
  updateTokenPositions: (positions: Record<string, TokenPosition>) => void
  /** Remove token position */
  removeTokenPosition: (tokenId: string) => void
  /** Sync token positions from Supabase */
  syncTokenPositions: (mapId: string) => Promise<void>
  /** Set current map ID */
  setCurrentMapId: (mapId: string | null) => void
  /** Set error state */
  setError: (error: string | null) => void
  /** Subscribe to realtime updates */
  subscribe: (mapId?: string) => void
  /** Unsubscribe from realtime updates */
  unsubscribe: () => void
}

/**
 * VTT store type
 */
type VTTStore = VTTState & VTTActions

/**
 * Default grid settings
 */
const defaultGridSettings: GridSettings = {
  size: 50,
  color: '#cccccc',
  opacity: 0.5,
  visible: true,
  type: 'square',
}

/**
 * VTT store with persistence and Supabase integration
 */
export const useVTTStore = create<VTTStore>()(
  persist(
    (set, get) => ({
      // Initial state
      zoom: 1,
      pan: { x: 0, y: 0 },
      gridSettings: defaultGridSettings,
      layerVisibility: {},
      selectedTool: 'select',
      tokenPositions: {},
      currentMapId: null,
      isLoading: false,
      error: null,
      subscription: null,

      // Actions
      setZoom: (zoom) => set({ zoom }),

      setPan: (pan) => set({ pan }),

      updateGridSettings: (settings) =>
        set((state) => ({
          gridSettings: { ...state.gridSettings, ...settings },
        })),

      toggleLayer: (layerId) =>
        set((state) => ({
          layerVisibility: {
            ...state.layerVisibility,
            [layerId]: !state.layerVisibility[layerId],
          },
        })),

      setLayerVisibility: (layerId, visible) =>
        set((state) => ({
          layerVisibility: {
            ...state.layerVisibility,
            [layerId]: visible,
          },
        })),

      setSelectedTool: (tool) => set({ selectedTool: tool }),

      updateTokenPosition: (tokenId, position) =>
        set((state) => ({
          tokenPositions: {
            ...state.tokenPositions,
            [tokenId]: position,
          },
        })),

      updateTokenPositions: (positions) =>
        set((state) => ({
          tokenPositions: {
            ...state.tokenPositions,
            ...positions,
          },
        })),

      removeTokenPosition: (tokenId) =>
        set((state) => {
          const { [tokenId]: removed, ...rest } = state.tokenPositions
          return { tokenPositions: rest }
        }),

      syncTokenPositions: async (mapId) => {
        try {
          set({ isLoading: true, error: null })
          const client = createClient()

          // Get game state for the current session to access map_state
          // This assumes map_state is stored in game_state table
          // If there's a separate tokens table, adjust accordingly
          const { data: gameState, error } = await client
            .from('game_state')
            .select('map_state')
            .eq('session_id', get().currentMapId || '')
            .single()

          if (error && error.code !== 'PGRST116') {
            // PGRST116 is "not found" which is okay
            throw error
          }

          if (gameState?.map_state) {
            try {
              const mapState = gameState.map_state as Json
              if (
                mapState &&
                typeof mapState === 'object' &&
                'tokenPositions' in mapState
              ) {
                const positions = (mapState.tokenPositions as Record<
                  string,
                  TokenPosition
                >) || {}
                set({ tokenPositions: positions })
              }
            } catch {
              // Invalid JSON, ignore
            }
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to sync token positions',
          })
        } finally {
          set({ isLoading: false })
        }
      },

      setCurrentMapId: (mapId) => set({ currentMapId: mapId }),

      setError: (error) => set({ error }),

      subscribe: (mapId) => {
        const { subscription } = get()
        if (subscription) {
          subscription.unsubscribe()
        }

        if (!mapId) {
          set({ subscription: null })
          return
        }

        const client = createClient()
        // Subscribe to game_state updates for map_state changes
        // This assumes token positions are stored in map_state JSON
        const channel = client
          .channel(`vtt:map:${mapId}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'game_state',
            },
            (payload) => {
              if (payload.new && payload.new.map_state) {
                try {
                  const mapState = payload.new.map_state as Json
                  if (
                    mapState &&
                    typeof mapState === 'object' &&
                    'tokenPositions' in mapState
                  ) {
                    const positions = (mapState.tokenPositions as Record<
                      string,
                      TokenPosition
                    >) || {}
                    set({ tokenPositions: positions })
                  }
                } catch {
                  // Invalid JSON, ignore
                }
              }
            }
          )
          .subscribe()

        set({ subscription: channel })
      },

      unsubscribe: () => {
        const { subscription } = get()
        if (subscription) {
          subscription.unsubscribe()
          set({ subscription: null })
        }
      },
    }),
    {
      name: 'vtt-storage',
      // Persist UI preferences (zoom, pan, grid settings, layer visibility, selected tool)
      // Don't persist token positions as they should come from Supabase
      partialize: (state) => ({
        zoom: state.zoom,
        pan: state.pan,
        gridSettings: state.gridSettings,
        layerVisibility: state.layerVisibility,
        selectedTool: state.selectedTool,
      }),
    }
  )
)

