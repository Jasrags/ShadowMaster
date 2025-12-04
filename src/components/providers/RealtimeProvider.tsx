'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Realtime connection status
 */
export type RealtimeConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error'

/**
 * Realtime context value
 */
export interface RealtimeContextValue {
  /** Current connection status */
  status: RealtimeConnectionStatus
  /** Error message if connection failed */
  error: string | null
  /** Whether realtime is enabled */
  enabled: boolean
  /** Manually reconnect */
  reconnect: () => void
  /** Manually disconnect */
  disconnect: () => void
}

/**
 * Realtime context
 */
const RealtimeContext = createContext<RealtimeContextValue | null>(null)

/**
 * Props for RealtimeProvider
 */
export interface RealtimeProviderProps {
  /** Child components */
  children: ReactNode
  /** Whether realtime is enabled (default: true) */
  enabled?: boolean
  /** Initial connection delay in ms (default: 0) */
  initialDelay?: number
  /** Maximum reconnection attempts (default: 5) */
  maxReconnectAttempts?: number
  /** Base delay for exponential backoff in ms (default: 1000) */
  reconnectDelay?: number
  /** Maximum delay between reconnection attempts in ms (default: 30000) */
  maxReconnectDelay?: number
}

/**
 * React context provider for realtime connection management
 * 
 * Manages global realtime connection status, handles reconnection logic
 * with exponential backoff, and provides connection status to child components.
 * 
 * @example
 * ```tsx
 * <RealtimeProvider>
 *   <PlaySession />
 * </RealtimeProvider>
 * ```
 */
export function RealtimeProvider({
  children,
  enabled = true,
  initialDelay = 0,
  maxReconnectAttempts = 5,
  reconnectDelay = 1000,
  maxReconnectDelay = 30000,
}: RealtimeProviderProps) {
  const [status, setStatus] = useState<RealtimeConnectionStatus>('disconnected')
  const [error, setError] = useState<string | null>(null)

  const clientRef = useRef<SupabaseClient | null>(null)
  const testChannelRef = useRef<ReturnType<SupabaseClient['channel']> | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isManualDisconnectRef = useRef(false)
  const connectionCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize Supabase realtime connection
  const connect = () => {
    if (!enabled) {
      setStatus('disconnected')
      return
    }

    try {
      setStatus('connecting')
      setError(null)

      const client = createClient()
      clientRef.current = client

      // Create a test channel to check connection status
      // Supabase realtime connects automatically when channels are created
      const testChannel = client
        .channel('realtime-connection-test')
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setStatus('connected')
            reconnectAttemptsRef.current = 0 // Reset on successful connection
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            if (!isManualDisconnectRef.current) {
              setStatus('error')
              setError('Realtime connection failed')
              attemptReconnect()
            }
          }
        })

      testChannelRef.current = testChannel

      // Set up periodic connection check
      connectionCheckIntervalRef.current = setInterval(() => {
        if (testChannel && testChannel.state === 'closed') {
          if (!isManualDisconnectRef.current) {
            setStatus('disconnected')
            attemptReconnect()
          }
        }
      }, 5000) // Check every 5 seconds
    } catch (err) {
      console.error('Error initializing realtime connection:', err)
      setStatus('error')
      setError(
        err instanceof Error ? err.message : 'Failed to initialize realtime'
      )
      attemptReconnect()
    }
  }

  // Attempt reconnection with exponential backoff
  const attemptReconnect = () => {
    if (!enabled || isManualDisconnectRef.current) {
      return
    }

    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      setStatus('error')
      setError(
        `Failed to reconnect after ${maxReconnectAttempts} attempts. Please refresh the page.`
      )
      return
    }

    reconnectAttemptsRef.current += 1
    setStatus('reconnecting')

    // Calculate delay with exponential backoff
    const delay = Math.min(
      reconnectDelay * Math.pow(2, reconnectAttemptsRef.current - 1),
      maxReconnectDelay
    )

    reconnectTimeoutRef.current = setTimeout(() => {
      connect()
    }, delay)
  }

  // Manual reconnect
  const reconnect = () => {
    // Clear any pending reconnection
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    reconnectAttemptsRef.current = 0
    isManualDisconnectRef.current = false
    connect()
  }

  // Manual disconnect
  const disconnect = () => {
    isManualDisconnectRef.current = true

    // Clear any pending reconnection
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    // Clear connection check interval
    if (connectionCheckIntervalRef.current) {
      clearInterval(connectionCheckIntervalRef.current)
      connectionCheckIntervalRef.current = null
    }

    // Unsubscribe from test channel
    if (testChannelRef.current) {
      try {
        testChannelRef.current.unsubscribe()
      } catch (err) {
        console.error('Error unsubscribing from test channel:', err)
      }
      testChannelRef.current = null
    }

    clientRef.current = null
    setStatus('disconnected')
  }

  // Initial connection
  useEffect(() => {
    if (initialDelay > 0) {
      const timeout = setTimeout(() => {
        connect()
      }, initialDelay)
      return () => clearTimeout(timeout)
    } else {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [enabled]) // Only re-run if enabled changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      disconnect()
    }
  }, [])

  const value: RealtimeContextValue = {
    status,
    error,
    enabled,
    reconnect,
    disconnect,
  }

  return (
    <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>
  )
}

/**
 * Hook to access realtime context
 * 
 * @throws {Error} If used outside RealtimeProvider
 */
export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error('useRealtime must be used within RealtimeProvider')
  }
  return context
}

