import { useEffect, useRef, useCallback, useState } from 'react'
import { useRealtimeSubscription } from './useRealtimeSubscription'
import { useVTTStore } from '@/lib/stores/vtt-store'
import { useGameStateStore } from '@/lib/stores/game-state-store'
import { useAuthStore } from '@/lib/stores/auth-store'
import { createClient } from '@/lib/supabase/client'
import { updateGameState } from '@/lib/supabase/schema'
import type { GameState } from '@/lib/supabase/schema'
import type { TokenPosition } from '@/lib/stores/vtt-store'
import type { Json } from '@/types/database'

/**
 * Token selection tracking (which user selected which token)
 */
export interface TokenSelection {
  userId: string
  userName: string
  tokenId: string
  timestamp: string
}

/**
 * Map state structure stored in game_state.map_state
 */
export interface MapState {
  tokenPositions: Record<string, TokenPosition>
  tokenSelections?: Record<string, TokenSelection[]>
}

/**
 * Configuration for useTokenSync hook
 */
export interface UseTokenSyncConfig {
  /** Session ID */
  sessionId: string | null
  /** Whether token sync is enabled */
  enabled?: boolean
  /** Debounce delay for position updates in ms (default: 300) */
  debounceMs?: number
}

/**
 * Return type for useTokenSync hook
 */
export interface UseTokenSyncReturn {
  /** Update token position (debounced, will sync to server) */
  updateTokenPosition: (tokenId: string, position: TokenPosition) => void
  /** Select a token (broadcasts selection to other users) */
  selectToken: (tokenId: string) => void
  /** Deselect a token */
  deselectToken: (tokenId: string) => void
  /** Get selections for a token (which users have it selected) */
  getTokenSelections: (tokenId: string) => TokenSelection[]
  /** Whether sync is currently active */
  isSyncing: boolean
  /** Error message if any */
  error: string | null
}

/**
 * React hook for real-time token position synchronization
 * 
 * Subscribes to token position changes in map_state JSON field, debounces
 * position changes during drag operations, handles conflict resolution using
 * last-write-wins strategy, and shows other users' token selections.
 * 
 * @example
 * ```tsx
 * const { updateTokenPosition, selectToken } = useTokenSync({
 *   sessionId: 'session-123',
 * })
 * 
 * // Update position (will be debounced and synced)
 * updateTokenPosition('token-1', { x: 100, y: 200 })
 * 
 * // Select token (broadcasts to other users)
 * selectToken('token-1')
 * ```
 */
export function useTokenSync(
  config: UseTokenSyncConfig
): UseTokenSyncReturn {
  const { sessionId, enabled = true, debounceMs = 300 } = config

  const {
    tokenPositions,
    updateTokenPosition: storeUpdateTokenPosition,
    updateTokenPositions: storeUpdateTokenPositions,
    setCurrentMapId,
    currentMapId,
  } = useVTTStore()

  const { currentSessionId } = useGameStateStore()

  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tokenSelections, setTokenSelections] = useState<
    Record<string, TokenSelection[]>
  >({})

  const { user, profile } = useAuthStore()
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pendingUpdatesRef = useRef<Record<string, TokenPosition>>({})
  const lastUpdateTimestampRef = useRef<Record<string, number>>({})

  // Get current user info for selections
  const getCurrentUser = useCallback(() => {
    if (!user) {
      return { userId: 'unknown', userName: 'Unknown User' }
    }
    return {
      userId: user.id,
      userName:
        profile?.display_name || profile?.username || user.email || 'Unknown User',
    }
  }, [user, profile])

  // Update token position locally and queue for sync
  const updateTokenPosition = useCallback(
    (tokenId: string, position: TokenPosition) => {
      if (!enabled || !sessionId) return

      // Update local store immediately (optimistic update)
      storeUpdateTokenPosition(tokenId, position)

      // Queue for debounced sync
      pendingUpdatesRef.current[tokenId] = position
      lastUpdateTimestampRef.current[tokenId] = Date.now()

      // Clear existing debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      // Set new debounce timeout
      debounceTimeoutRef.current = setTimeout(() => {
        syncTokenPositionsToServer()
      }, debounceMs)
    },
    [enabled, sessionId, debounceMs, storeUpdateTokenPosition]
  )

  // Sync pending token positions to server
  const syncTokenPositionsToServer = useCallback(async () => {
    if (!sessionId || Object.keys(pendingUpdatesRef.current).length === 0) {
      return
    }

    const updates = { ...pendingUpdatesRef.current }
    pendingUpdatesRef.current = {}

    try {
      setIsSyncing(true)
      setError(null)

      const client = createClient()

      // Get current game state
      const { data: gameState, error: fetchError } = await client
        .from('game_state')
        .select('map_state')
        .eq('session_id', sessionId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "not found" which is okay
        throw fetchError
      }

      // Parse existing map state or create new
      let mapState: MapState = gameState?.map_state
        ? (gameState.map_state as MapState)
        : { tokenPositions: {} }

      // Apply updates with conflict resolution (last-write-wins)
      const updatedPositions: Record<string, TokenPosition> = {
        ...mapState.tokenPositions,
      }

      Object.entries(updates).forEach(([tokenId, position]) => {
        const localTimestamp = lastUpdateTimestampRef.current[tokenId] || 0
        const remoteTimestamp =
          lastUpdateTimestampRef.current[`remote:${tokenId}`] || 0

        // Last-write-wins: use local update if it's newer or if no remote timestamp
        if (localTimestamp >= remoteTimestamp) {
          updatedPositions[tokenId] = position
        }
      })

      // Update map state
      const newMapState: MapState = {
        ...mapState,
        tokenPositions: updatedPositions,
      }

      // Save to database
      const { error: updateError } = await updateGameState(client, sessionId, {
        map_state: newMapState as Json,
      })

      if (updateError) {
        throw updateError
      }
    } catch (err) {
      console.error('Error syncing token positions:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to sync token positions'
      )

      // Rollback: revert to last known good state from server
      // This would require fetching the current state again
      // For now, we'll just log the error
    } finally {
      setIsSyncing(false)
    }
  }, [sessionId])

  // Select a token (broadcasts to other users)
  const selectToken = useCallback(
    (tokenId: string) => {
      if (!enabled || !sessionId) return

      const currentUser = getCurrentUser()
      const selection: TokenSelection = {
        userId: currentUser.userId,
        userName: currentUser.userName,
        tokenId,
        timestamp: new Date().toISOString(),
      }

      setTokenSelections((prev) => {
        const tokenSelections = prev[tokenId] || []
        // Remove existing selection by this user
        const filtered = tokenSelections.filter(
          (s) => s.userId !== currentUser.userId
        )
        // Add new selection
        return {
          ...prev,
          [tokenId]: [...filtered, selection],
        }
      })

      // Sync selection to server (store in map_state)
      syncTokenSelectionToServer(tokenId, selection)
    },
    [enabled, sessionId]
  )

  // Deselect a token
  const deselectToken = useCallback(
    (tokenId: string) => {
      if (!enabled || !sessionId) return

      const currentUser = getCurrentUser()
      setTokenSelections((prev) => {
        const tokenSelections = prev[tokenId] || []
        return {
          ...prev,
          [tokenId]: tokenSelections.filter(
            (s) => s.userId !== currentUser.userId
          ),
        }
      })

      // Remove selection from server
      syncTokenSelectionToServer(tokenId, null)
    },
    [enabled, sessionId]
  )

  // Sync token selection to server
  const syncTokenSelectionToServer = useCallback(
    async (tokenId: string, selection: TokenSelection | null) => {
      if (!sessionId) return

      try {
        const client = createClient()

        // Get current game state
        const { data: gameState } = await client
          .from('game_state')
          .select('map_state')
          .eq('session_id', sessionId)
          .single()

        let mapState: MapState = gameState?.map_state
          ? (gameState.map_state as MapState)
          : { tokenPositions: {} }

        const selections = mapState.tokenSelections || {}
        const tokenSelections = selections[tokenId] || []

        let updatedSelections: TokenSelection[]
        if (selection) {
          // Add or update selection
          const filtered = tokenSelections.filter(
            (s) => s.userId !== selection.userId
          )
          updatedSelections = [...filtered, selection]
        } else {
          // Remove selection for current user
          const currentUser = getCurrentUser()
          updatedSelections = tokenSelections.filter(
            (s) => s.userId !== currentUser.userId
          )
        }

        const newMapState: MapState = {
          ...mapState,
          tokenSelections: {
            ...selections,
            [tokenId]: updatedSelections,
          },
        }

        await updateGameState(client, sessionId, {
          map_state: newMapState as Json,
        })
      } catch (err) {
        console.error('Error syncing token selection:', err)
      }
    },
    [sessionId]
  )

  // Get selections for a token
  const getTokenSelections = useCallback(
    (tokenId: string): TokenSelection[] => {
      return tokenSelections[tokenId] || []
    },
    [tokenSelections]
  )

  // Subscribe to game_state.map_state updates
  const { error: subscriptionError } = useRealtimeSubscription<GameState>({
    table: 'game_state',
    filter: sessionId ? `session_id=eq.${sessionId}` : undefined,
    enabled: enabled && !!sessionId,
    onUpdate: (gameState) => {
      if (!gameState.map_state) return

      try {
        const mapState = gameState.map_state as MapState

        // Update token positions from remote
        if (mapState.tokenPositions) {
          // Mark remote timestamps
          Object.keys(mapState.tokenPositions).forEach((tokenId) => {
            lastUpdateTimestampRef.current[`remote:${tokenId}`] = Date.now()
          })

          // Update store with remote positions (only if not pending local update)
          const remotePositions: Record<string, TokenPosition> = {}
          Object.entries(mapState.tokenPositions).forEach(([tokenId, position]) => {
            const localTimestamp = lastUpdateTimestampRef.current[tokenId] || 0
            const remoteTimestamp =
              lastUpdateTimestampRef.current[`remote:${tokenId}`] || 0

            // Only use remote if it's newer than local or no local update pending
            if (
              remoteTimestamp >= localTimestamp ||
              !pendingUpdatesRef.current[tokenId]
            ) {
              remotePositions[tokenId] = position
            }
          })

          if (Object.keys(remotePositions).length > 0) {
            storeUpdateTokenPositions(remotePositions)
          }
        }

        // Update token selections
        if (mapState.tokenSelections) {
          setTokenSelections(mapState.tokenSelections)
        }
      } catch (err) {
        console.error('Error processing map_state update:', err)
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to process map state update'
        )
      }
    },
  })

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  // Merge errors
  const finalError = error || subscriptionError

  return {
    updateTokenPosition,
    selectToken,
    deselectToken,
    getTokenSelections,
    isSyncing,
    error: finalError,
  }
}

