import { useEffect, useRef, useState } from 'react'
import { useRealtimeSubscription } from './useRealtimeSubscription'
import { useGameStateStore } from '@/lib/stores/game-state-store'
import type { GameState } from '@/lib/supabase/schema'
import type { InitiativeEntry, ActiveEffect } from '@/lib/stores/game-state-store'

/**
 * Configuration for useGameState hook
 */
export interface UseGameStateConfig {
  /** Session ID to sync game state for */
  sessionId: string | null
  /** Whether the sync is enabled */
  enabled?: boolean
  /** Debounce delay for rapid updates in ms (default: 300) */
  debounceMs?: number
}

/**
 * Return type for useGameState hook
 */
export interface UseGameStateReturn {
  /** Whether game state is currently syncing */
  isSyncing: boolean
  /** Error message if any */
  error: string | null
  /** Whether subscription is active */
  isSubscribed: boolean
}

/**
 * React hook to sync game_state table with Zustand store
 * 
 * Subscribes to game_state table changes for a session and syncs with
 * useGameStateStore. Handles initiative order updates, active effects updates,
 * and provides optimistic updates with rollback on conflict.
 * 
 * @example
 * ```tsx
 * const { isSyncing, error } = useGameState({
 *   sessionId: 'session-123',
 * })
 * ```
 */
export function useGameState(
  config: UseGameStateConfig
): UseGameStateReturn {
  const { sessionId, enabled = true, debounceMs = 300 } = config

  const {
    initiativeOrder,
    activeEffects,
    setInitiativeOrder,
    setActiveEffects,
    subscribe: storeSubscribe,
    unsubscribe: storeUnsubscribe,
    setSessionId,
    loadGameState,
    saveGameState,
    error: storeError,
  } = useGameStateStore()

  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastUpdateRef = useRef<string | null>(null)

  // Load initial game state when sessionId changes
  useEffect(() => {
    if (!enabled || !sessionId) {
      setSessionId(null)
      return
    }

    let cancelled = false

    const loadInitialState = async () => {
      try {
        setIsSyncing(true)
        setError(null)
        setSessionId(sessionId)
        await loadGameState(sessionId)
        if (!cancelled) {
          setIsSyncing(false)
        }
      } catch (err) {
        if (!cancelled) {
          setIsSyncing(false)
          setError(
            err instanceof Error ? err.message : 'Failed to load game state'
          )
        }
      }
    }

    loadInitialState()

    return () => {
      cancelled = true
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [enabled, sessionId, setSessionId, loadGameState])

  // Subscribe to game_state table changes
  const { status, error: subscriptionError, isSubscribed } =
    useRealtimeSubscription<GameState>({
      table: 'game_state',
      filter: sessionId ? `session_id=eq.${sessionId}` : undefined,
      enabled: enabled && !!sessionId,
      onUpdate: (gameState) => {
        // Debounce rapid updates to avoid UI flicker
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current)
        }

        debounceTimeoutRef.current = setTimeout(() => {
          try {
            // Only update if this is a new update (check timestamp)
            const updateKey = `${gameState.session_id}-${gameState.updated_at}`
            if (updateKey === lastUpdateRef.current) {
              return // Already processed this update
            }
            lastUpdateRef.current = updateKey

            // Parse and update initiative order
            if (gameState.initiative_order) {
              try {
                const parsed = gameState.initiative_order as InitiativeEntry[]
                if (Array.isArray(parsed)) {
                  setInitiativeOrder(parsed)
                }
              } catch (err) {
                console.error('Error parsing initiative_order:', err)
              }
            }

            // Parse and update active effects
            if (gameState.active_effects) {
              try {
                const parsed = gameState.active_effects as ActiveEffect[]
                if (Array.isArray(parsed)) {
                  setActiveEffects(parsed)
                }
              } catch (err) {
                console.error('Error parsing active_effects:', err)
              }
            }
          } catch (err) {
            console.error('Error handling game state update:', err)
            setError(
              err instanceof Error
                ? err.message
                : 'Failed to handle game state update'
            )
          }
        }, debounceMs)
      },
      onError: (err) => {
        console.error('Game state subscription error:', err)
        setError(err.message)
      },
    })

  // Use store's subscribe method for additional realtime handling
  useEffect(() => {
    if (!enabled || !sessionId) {
      storeUnsubscribe()
      return
    }

    // The store's subscribe method handles its own realtime subscription
    // We use it in addition to our generic subscription for compatibility
    storeSubscribe(sessionId)

    return () => {
      storeUnsubscribe()
    }
  }, [enabled, sessionId, storeSubscribe, storeUnsubscribe])

  // Merge store error with subscription error
  const finalError = error || subscriptionError || storeError

  return {
    isSyncing: isSyncing || status === 'connecting',
    error: finalError,
    isSubscribed,
  }
}

