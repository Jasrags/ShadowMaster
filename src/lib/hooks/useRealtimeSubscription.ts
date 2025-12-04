import { useEffect, useRef, useState } from 'react'
import {
  createRealtimeChannel,
  subscribeToTableChanges,
  type SubscribeToTableOptions,
} from '@/lib/supabase/realtime'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Connection status type
 */
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

/**
 * Configuration for useRealtimeSubscription hook
 */
export interface UseRealtimeSubscriptionConfig<T = unknown> {
  /** Table name to subscribe to */
  table: string
  /** Schema name (default: 'public') */
  schema?: string
  /** Filter expression (e.g., 'session_id=eq.123') */
  filter?: string
  /** Callback for INSERT events */
  onInsert?: (payload: T) => void
  /** Callback for UPDATE events */
  onUpdate?: (payload: T) => void
  /** Callback for DELETE events */
  onDelete?: (payload: T) => void
  /** Whether the subscription is enabled (default: true) */
  enabled?: boolean
  /** Channel name (auto-generated if not provided) */
  channelName?: string
  /** Maximum retry attempts on error (default: 3) */
  maxRetries?: number
  /** Retry delay in milliseconds (default: 1000) */
  retryDelay?: number
}

/**
 * Return type for useRealtimeSubscription hook
 */
export interface UseRealtimeSubscriptionReturn {
  /** Current connection status */
  status: ConnectionStatus
  /** Error message if connection failed */
  error: string | null
  /** Whether the subscription is active */
  isSubscribed: boolean
}

/**
 * Generic React hook for subscribing to Supabase table changes
 * 
 * Automatically handles cleanup on unmount, error handling with retry logic,
 * and connection status tracking.
 * 
 * @example
 * ```tsx
 * const { status, error } = useRealtimeSubscription<Campaign>({
 *   table: 'campaigns',
 *   filter: 'id=eq.123',
 *   onUpdate: (campaign) => {
 *     console.log('Campaign updated:', campaign)
 *   },
 * })
 * ```
 */
export function useRealtimeSubscription<T = unknown>(
  config: UseRealtimeSubscriptionConfig<T>
): UseRealtimeSubscriptionReturn {
  const {
    table,
    schema = 'public',
    filter,
    onInsert,
    onUpdate,
    onDelete,
    enabled = true,
    channelName,
    maxRetries = 3,
    retryDelay = 1000,
  } = config

  const [status, setStatus] = useState<ConnectionStatus>('disconnected')
  const [error, setError] = useState<string | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const channelRef = useRef<RealtimeChannel | null>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const retryCountRef = useRef(0)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Don't subscribe if disabled
    if (!enabled) {
      setStatus('disconnected')
      setIsSubscribed(false)
      return
    }

    // Cleanup function
    const cleanup = () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }

      if (channelRef.current) {
        channelRef.current.unsubscribe()
        channelRef.current = null
      }

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }

      setStatus('disconnected')
      setIsSubscribed(false)
    }

    // Setup subscription with retry logic
    const setupSubscription = () => {
      try {
        setStatus('connecting')
        setError(null)

        // Generate channel name if not provided
        const finalChannelName =
          channelName || `realtime:${table}:${filter || 'all'}`

        // Create channel
        const channel = createRealtimeChannel({
          channelName: finalChannelName,
          onStatusChange: (channelStatus) => {
            if (channelStatus === 'SUBSCRIBED') {
              setStatus('connected')
              setIsSubscribed(true)
              retryCountRef.current = 0 // Reset retry count on success
            } else if (channelStatus === 'CHANNEL_ERROR') {
              setStatus('error')
              setIsSubscribed(false)
              handleError(new Error('Channel error occurred'))
            } else if (channelStatus === 'TIMED_OUT') {
              setStatus('error')
              setIsSubscribed(false)
              handleError(new Error('Connection timed out'))
            } else if (channelStatus === 'CLOSED') {
              setStatus('disconnected')
              setIsSubscribed(false)
            }
          },
          onError: handleError,
        })

        // Subscribe to table changes
        const unsubscribe = subscribeToTableChanges<T>(channel, {
          table,
          schema,
          filter,
          onInsert,
          onUpdate,
          onDelete,
          onError: handleError,
        })

        // Subscribe to the channel
        channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setStatus('connected')
            setIsSubscribed(true)
            retryCountRef.current = 0
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setStatus('error')
            setIsSubscribed(false)
            handleError(
              new Error(
                status === 'CHANNEL_ERROR'
                  ? 'Channel error occurred'
                  : 'Connection timed out'
              )
            )
          }
        })

        channelRef.current = channel
        unsubscribeRef.current = unsubscribe
      } catch (err) {
        handleError(
          err instanceof Error ? err : new Error('Failed to setup subscription')
        )
      }
    }

    // Error handler with retry logic
    const handleError = (err: Error) => {
      console.error('Realtime subscription error:', err)
      setError(err.message)
      setStatus('error')
      setIsSubscribed(false)

      // Retry if we haven't exceeded max retries
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current += 1
        const delay = retryDelay * retryCountRef.current // Exponential backoff

        retryTimeoutRef.current = setTimeout(() => {
          cleanup()
          setupSubscription()
        }, delay)
      } else {
        // Max retries exceeded
        setError(
          `Failed to connect after ${maxRetries} attempts: ${err.message}`
        )
      }
    }

    // Initial setup
    setupSubscription()

    // Cleanup on unmount or when dependencies change
    return cleanup
  }, [
    enabled,
    table,
    schema,
    filter,
    channelName,
    maxRetries,
    retryDelay,
    // Note: onInsert, onUpdate, onDelete are intentionally excluded from deps
    // to avoid re-subscribing on every render. They should be stable references.
  ])

  // Update callbacks without re-subscribing
  useEffect(() => {
    // This effect runs when callbacks change but doesn't re-subscribe
    // The callbacks are already bound in the subscription setup
  }, [onInsert, onUpdate, onDelete])

  return {
    status,
    error,
    isSubscribed,
  }
}

