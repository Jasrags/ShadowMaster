import { useEffect, useRef, useState, useCallback } from 'react'
import {
  createRealtimeChannel,
  subscribeToPresence,
  broadcastPresence,
  untrackPresence,
  type PresenceState,
  type PresencePayload,
} from '@/lib/supabase/realtime'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Configuration for usePresence hook
 */
export interface UsePresenceConfig {
  /** Session ID or campaign ID to track presence for */
  sessionId?: string
  /** Campaign ID (alternative to sessionId) */
  campaignId?: string
  /** Map ID being viewed */
  mapId?: string
  /** Whether presence tracking is enabled */
  enabled?: boolean
  /** Throttle interval for cursor position updates in ms (default: 100) */
  throttleMs?: number
}

/**
 * Return type for usePresence hook
 */
export interface UsePresenceReturn {
  /** Map of online users (userId -> PresenceState) */
  onlineUsers: PresencePayload
  /** Array of online user states */
  onlineUsersList: PresenceState[]
  /** Whether presence is currently being tracked */
  isTracking: boolean
  /** Error message if any */
  error: string | null
  /** Update cursor position (throttled) */
  updateCursorPosition: (x: number, y: number) => void
  /** Update viewing state */
  updateViewingState: (mapId?: string, sessionId?: string) => void
}

/**
 * React hook for tracking online users and broadcasting presence
 * 
 * Tracks active users in a session/campaign, broadcasts cursor position,
 * and shows which users are viewing which maps/sessions.
 * 
 * @example
 * ```tsx
 * const { onlineUsers, updateCursorPosition } = usePresence({
 *   sessionId: 'session-123',
 *   mapId: 'map-456',
 * })
 * ```
 */
export function usePresence(
  config: UsePresenceConfig
): UsePresenceReturn {
  const {
    sessionId,
    campaignId,
    mapId,
    enabled = true,
    throttleMs = 100,
  } = config

  const { user, profile } = useAuthStore()
  const [onlineUsers, setOnlineUsers] = useState<PresencePayload>({})
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const channelRef = useRef<RealtimeChannel | null>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const cursorThrottleRef = useRef<NodeJS.Timeout | null>(null)
  const lastCursorPositionRef = useRef<{ x: number; y: number } | null>(null)

  // Generate channel name from sessionId or campaignId
  const channelName = sessionId
    ? `presence:session:${sessionId}`
    : campaignId
      ? `presence:campaign:${campaignId}`
      : null

  // Update cursor position with throttling
  const updateCursorPosition = useCallback(
    (x: number, y: number) => {
      if (!channelRef.current || !enabled || !user) return

      // Throttle cursor updates
      if (cursorThrottleRef.current) {
        clearTimeout(cursorThrottleRef.current)
      }

      cursorThrottleRef.current = setTimeout(() => {
        if (channelRef.current && user) {
          const presenceState: PresenceState = {
            userId: user.id,
            userName: profile?.display_name || profile?.username || user.email || 'Unknown',
            avatarUrl: profile?.avatar_url || undefined,
            cursorPosition: { x, y },
            mapId,
            sessionId,
            lastSeen: new Date().toISOString(),
          }

          try {
            broadcastPresence(channelRef.current, presenceState)
            lastCursorPositionRef.current = { x, y }
          } catch (err) {
            console.error('Error updating cursor position:', err)
          }
        }
      }, throttleMs)
    },
    [enabled, user, profile, mapId, sessionId, throttleMs]
  )

  // Update viewing state
  const updateViewingState = useCallback(
    (newMapId?: string, newSessionId?: string) => {
      if (!channelRef.current || !enabled || !user) return

      const presenceState: PresenceState = {
        userId: user.id,
        userName: profile?.display_name || profile?.username || user.email || 'Unknown',
        avatarUrl: profile?.avatar_url || undefined,
        cursorPosition: lastCursorPositionRef.current || undefined,
        mapId: newMapId || mapId,
        sessionId: newSessionId || sessionId,
        lastSeen: new Date().toISOString(),
      }

      try {
        broadcastPresence(channelRef.current, presenceState)
      } catch (err) {
        console.error('Error updating viewing state:', err)
        setError(
          err instanceof Error ? err.message : 'Failed to update viewing state'
        )
      }
    },
    [enabled, user, profile, mapId, sessionId]
  )

  // Setup presence tracking
  useEffect(() => {
    if (!enabled || !channelName || !user) {
      setIsTracking(false)
      setOnlineUsers({})
      return
    }

    const cleanup = () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }

      if (channelRef.current) {
        try {
          untrackPresence(channelRef.current)
          channelRef.current.unsubscribe()
        } catch (err) {
          console.error('Error cleaning up presence:', err)
        }
        channelRef.current = null
      }

      if (cursorThrottleRef.current) {
        clearTimeout(cursorThrottleRef.current)
        cursorThrottleRef.current = null
      }

      setIsTracking(false)
      setOnlineUsers({})
    }

    try {
      setError(null)

      // Create presence channel
      const channel = createRealtimeChannel({
        channelName,
        enablePresence: true,
        onStatusChange: (status) => {
          if (status === 'SUBSCRIBED') {
            setIsTracking(true)
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setIsTracking(false)
            setError(
              status === 'CHANNEL_ERROR'
                ? 'Failed to connect to presence channel'
                : 'Connection timed out'
            )
          }
        },
        onError: (err) => {
          setError(err.message)
          setIsTracking(false)
        },
      })

      // Subscribe to presence changes
      const unsubscribe = subscribeToPresence(channel, {
        onPresenceChange: (presence) => {
          setOnlineUsers(presence)
        },
        onUserJoin: (userState) => {
          setOnlineUsers((prev) => ({
            ...prev,
            [userState.userId]: userState,
          }))
        },
        onUserLeave: (userState) => {
          setOnlineUsers((prev) => {
            const updated = { ...prev }
            delete updated[userState.userId]
            return updated
          })
        },
        onError: (err) => {
          console.error('Presence error:', err)
          setError(err.message)
        },
      })

      // Subscribe to channel
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsTracking(true)

          // Broadcast initial presence
          if (user) {
            const initialPresence: PresenceState = {
              userId: user.id,
              userName: profile?.display_name || profile?.username || user.email || 'Unknown',
              avatarUrl: profile?.avatar_url || undefined,
              mapId,
              sessionId,
              lastSeen: new Date().toISOString(),
            }

            try {
              broadcastPresence(channel, initialPresence)
            } catch (err) {
              console.error('Error broadcasting initial presence:', err)
              setError(
                err instanceof Error
                  ? err.message
                  : 'Failed to broadcast presence'
              )
            }
          }
        }
      })

      channelRef.current = channel
      unsubscribeRef.current = unsubscribe
    } catch (err) {
      console.error('Error setting up presence:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to setup presence tracking'
      )
      setIsTracking(false)
    }

    return cleanup
  }, [enabled, channelName, user, profile, mapId, sessionId])

  // Update presence when mapId or sessionId changes
  useEffect(() => {
    if (channelRef.current && isTracking && user) {
      updateViewingState(mapId, sessionId)
    }
  }, [mapId, sessionId, isTracking, user, updateViewingState])

  // Convert onlineUsers object to array
  const onlineUsersList = Object.values(onlineUsers).filter(
    (presenceUser) => presenceUser.userId !== user?.id // Exclude current user if needed
  )

  return {
    onlineUsers,
    onlineUsersList,
    isTracking,
    error,
    updateCursorPosition,
    updateViewingState,
  }
}

