import { createClient } from './client'
import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js'

/**
 * Generic realtime event payload type
 */
export interface RealtimeEvent<T = unknown> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new?: T
  old?: T
  timestamp: string
}

/**
 * User presence state structure
 */
export interface PresenceState {
  /** User ID */
  userId: string
  /** User display name */
  userName: string
  /** User avatar URL (optional) */
  avatarUrl?: string
  /** Current cursor position on map (x, y) */
  cursorPosition?: { x: number; y: number }
  /** Current map ID being viewed */
  mapId?: string
  /** Current session ID */
  sessionId?: string
  /** Timestamp of last update */
  lastSeen: string
}

/**
 * Presence broadcast payload
 */
export interface PresencePayload {
  [userId: string]: PresenceState
}

/**
 * Options for creating a realtime channel
 */
export interface CreateChannelOptions {
  /** Channel name/identifier */
  channelName: string
  /** Enable presence tracking */
  enablePresence?: boolean
  /** Callback for connection status changes */
  onStatusChange?: (status: 'SUBSCRIBED' | 'CHANNEL_ERROR' | 'TIMED_OUT' | 'CLOSED') => void
  /** Callback for errors */
  onError?: (error: Error) => void
}

/**
 * Options for subscribing to table changes
 */
export interface SubscribeToTableOptions<T = unknown> {
  /** Table name */
  table: string
  /** Schema name (default: 'public') */
  schema?: string
  /** Filter expression (e.g., 'campaign_id=eq.123') */
  filter?: string
  /** Callback for INSERT events */
  onInsert?: (payload: T) => void
  /** Callback for UPDATE events */
  onUpdate?: (payload: T) => void
  /** Callback for DELETE events */
  onDelete?: (payload: T) => void
  /** Callback for errors */
  onError?: (error: Error) => void
}

/**
 * Create a realtime channel with error handling
 */
export function createRealtimeChannel(
  options: CreateChannelOptions
): RealtimeChannel {
  const client = createClient()
  const { channelName, enablePresence, onStatusChange, onError } = options

  const channel = client.channel(channelName, {
    config: {
      presence: enablePresence
        ? {
            key: channelName,
          }
        : undefined,
    },
  })

  // Handle status changes
  channel.on('system', {}, (payload) => {
    if (payload.status && onStatusChange) {
      onStatusChange(payload.status as any)
    }
  })

  // Handle errors
  channel.on('broadcast', { event: 'error' }, (payload) => {
    if (onError) {
      onError(new Error(payload.payload?.message || 'Realtime error'))
    }
  })

  return channel
}

/**
 * Subscribe to table changes (INSERT/UPDATE/DELETE)
 */
export function subscribeToTableChanges<T = unknown>(
  channel: RealtimeChannel,
  options: SubscribeToTableOptions<T>
): () => void {
  const {
    table,
    schema = 'public',
    filter,
    onInsert,
    onUpdate,
    onDelete,
    onError,
  } = options

  // Subscribe to INSERT events
  if (onInsert) {
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema,
        table,
        filter,
      },
      (payload: RealtimePostgresChangesPayload<T>) => {
        try {
          if (payload.new) {
            onInsert(payload.new)
          }
        } catch (error) {
          console.error('Error handling INSERT event:', error)
          if (onError) {
            onError(
              error instanceof Error
                ? error
                : new Error('Failed to handle INSERT event')
            )
          }
        }
      }
    )
  }

  // Subscribe to UPDATE events
  if (onUpdate) {
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema,
        table,
        filter,
      },
      (payload: RealtimePostgresChangesPayload<T>) => {
        try {
          if (payload.new) {
            onUpdate(payload.new)
          }
        } catch (error) {
          console.error('Error handling UPDATE event:', error)
          if (onError) {
            onError(
              error instanceof Error
                ? error
                : new Error('Failed to handle UPDATE event')
            )
          }
        }
      }
    )
  }

  // Subscribe to DELETE events
  if (onDelete) {
    channel.on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema,
        table,
        filter,
      },
      (payload: RealtimePostgresChangesPayload<T>) => {
        try {
          if (payload.old) {
            onDelete(payload.old)
          }
        } catch (error) {
          console.error('Error handling DELETE event:', error)
          if (onError) {
            onError(
              error instanceof Error
                ? error
                : new Error('Failed to handle DELETE event')
            )
          }
        }
      }
    )
  }

  // Return unsubscribe function
  return () => {
    channel.off('postgres_changes')
  }
}

/**
 * Set up presence channel for tracking active users
 */
export function subscribeToPresence(
  channel: RealtimeChannel,
  options: {
    /** Callback when presence state changes */
    onPresenceChange?: (state: PresencePayload) => void
    /** Callback when a user joins */
    onUserJoin?: (state: PresenceState) => void
    /** Callback when a user leaves */
    onUserLeave?: (state: PresenceState) => void
    /** Callback for errors */
    onError?: (error: Error) => void
  }
): () => void {
  const { onPresenceChange, onUserJoin, onUserLeave, onError } = options

  // Track previous presence state to detect joins/leaves
  let previousPresence: PresencePayload = {}

  channel.on('presence', { event: 'sync' }, () => {
    try {
      const presence = channel.presenceState<PresenceState>()
      const presencePayload: PresencePayload = {}

      // Convert Supabase presence format to our format
      Object.keys(presence).forEach((key) => {
        const states = presence[key] as PresenceState[]
        if (states && states.length > 0) {
          presencePayload[key] = states[0]
        }
      })

      // Detect joins and leaves
      const currentUserIds = new Set(Object.keys(presencePayload))
      const previousUserIds = new Set(Object.keys(previousPresence))

      // Find new users (joins)
      currentUserIds.forEach((userId) => {
        if (!previousUserIds.has(userId) && onUserJoin) {
          onUserJoin(presencePayload[userId])
        }
      })

      // Find removed users (leaves)
      previousUserIds.forEach((userId) => {
        if (!currentUserIds.has(userId) && onUserLeave) {
          onUserLeave(previousPresence[userId])
        }
      })

      previousPresence = presencePayload

      if (onPresenceChange) {
        onPresenceChange(presencePayload)
      }
    } catch (error) {
      console.error('Error handling presence sync:', error)
      if (onError) {
        onError(
          error instanceof Error
            ? error
            : new Error('Failed to handle presence sync')
        )
      }
    }
  })

  channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
    try {
      if (newPresences && newPresences.length > 0 && onUserJoin) {
        onUserJoin(newPresences[0] as PresenceState)
      }
    } catch (error) {
      console.error('Error handling presence join:', error)
      if (onError) {
        onError(
          error instanceof Error
            ? error
            : new Error('Failed to handle presence join')
        )
      }
    }
  })

  channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    try {
      if (leftPresences && leftPresences.length > 0 && onUserLeave) {
        onUserLeave(leftPresences[0] as PresenceState)
      }
    } catch (error) {
      console.error('Error handling presence leave:', error)
      if (onError) {
        onError(
          error instanceof Error
            ? error
            : new Error('Failed to handle presence leave')
        )
      }
    }
  })

  // Return unsubscribe function
  return () => {
    channel.off('presence')
  }
}

/**
 * Broadcast user presence data
 */
export function broadcastPresence(
  channel: RealtimeChannel,
  presenceState: PresenceState
): void {
  try {
    channel.track({
      ...presenceState,
      lastSeen: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error broadcasting presence:', error)
    throw error instanceof Error
      ? error
      : new Error('Failed to broadcast presence')
  }
}

/**
 * Untrack user presence (when user leaves)
 */
export function untrackPresence(channel: RealtimeChannel): void {
  try {
    channel.untrack()
  } catch (error) {
    console.error('Error untracking presence:', error)
  }
}

