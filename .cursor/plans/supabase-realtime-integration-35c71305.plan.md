<!-- 35c71305-95e7-4ece-895d-f79ff3d2cc2d f1ff7a81-9ab2-4550-b789-981aebd5bcec -->
# Supabase Realtime Integration

This plan implements a complete Supabase Realtime system for multiplayer synchronization in the ShadowMaster VTT application, including presence tracking, game state synchronization, token position updates, and reusable React hooks.

## Dependencies

No additional packages required - Supabase Realtime is included in `@supabase/supabase-js` which is already installed.

## Implementation

### 1. Realtime Utility (`src/lib/supabase/realtime.ts`)

Create core realtime channel management utilities:

- **`createRealtimeChannel()`** - Helper to create and configure channels with error handling
- **`subscribeToTableChanges()`** - Generic function to subscribe to table INSERT/UPDATE/DELETE events
- **`subscribeToPresence()`** - Set up presence channel for tracking active users
- **`broadcastPresence()`** - Broadcast user presence data (cursor position, viewing state)
- TypeScript types for realtime events:
  - `RealtimeEvent<T>` - Generic event payload type
  - `PresenceState` - User presence data structure
  - `PresencePayload` - Presence broadcast payload

Reference existing Supabase client from [`src/lib/supabase/client.ts`](src/lib/supabase/client.ts).

### 2. Generic Realtime Subscription Hook (`src/lib/hooks/useRealtimeSubscription.ts`)

Create reusable React hook for table subscriptions:

- Generic TypeScript types for any table row type
- Auto-cleanup on component unmount
- Error handling with retry logic
- Connection status tracking
- Support for filtering by column values
- Callback-based event handling (INSERT/UPDATE/DELETE)

Hook signature:

```typescript
useRealtimeSubscription<T>(config: {
  table: string
  filter?: string
  onInsert?: (payload: T) => void
  onUpdate?: (payload: T) => void
  onDelete?: (payload: T) => void
  enabled?: boolean
})
```

### 3. Presence Hook (`src/lib/hooks/usePresence.ts`)

Create hook for tracking online users in a session:

- Track active users in a campaign/session
- Broadcast user cursor position on map
- Show which users are viewing which maps/sessions
- Cleanup on unmount
- Throttle cursor position updates (avoid excessive broadcasts)

Hook will:

- Subscribe to presence channel for a specific session/campaign
- Broadcast current user's presence state
- Return list of online users with their metadata
- Handle user join/leave events

Integrate with auth store from [`src/lib/stores/auth-store.ts`](src/lib/stores/auth-store.ts) to get current user info.

### 4. Game State Sync Hook (`src/lib/hooks/useGameState.ts`)

Create hook to sync game_state table with Zustand store:

- Subscribe to `game_state` table changes for a session
- Sync with existing `useGameStateStore` from [`src/lib/stores/game-state-store.ts`](src/lib/stores/game-state-store.ts)
- Handle initiative order updates in real-time
- Handle active effects updates
- Optimistic updates with rollback on conflict
- Debounce rapid updates to avoid UI flicker

The hook will:

- Call `useGameStateStore.subscribe()` when sessionId changes
- Update store state when realtime events arrive
- Handle conflicts by merging changes intelligently
- Provide loading and error states

### 5. Token Sync Hook (`src/lib/hooks/useTokenSync.ts`)

Create hook for real-time token position synchronization:

- Subscribe to token position changes in `map_state` JSON field
- Debounce position changes during drag operations (300ms default)
- Conflict resolution using last-write-wins strategy
- Show other users' token selections visually
- Integrate with `useVTTStore` from [`src/lib/stores/vtt-store.ts`](src/lib/stores/vtt-store.ts)

The hook will:

- Subscribe to `game_state.map_state` updates
- Debounce local position updates before broadcasting
- Track which tokens are selected by which users
- Update `vtt-store.tokenPositions` when remote changes arrive
- Handle concurrent drag operations gracefully

### 6. Presence Indicator Component (`src/components/game/PresenceIndicator.tsx`)

Create UI component to display online players:

- Show list of online players with avatars/names
- Display user cursors or avatars on the map canvas
- Show which users are viewing which layers/maps
- Visual indicators for active users
- Optional compact/minimal view mode

Component props:

```typescript
{
  sessionId: string
  showList?: boolean
  showCursors?: boolean
  className?: string
}
```

Use `usePresence` hook internally to get online users data.

### 7. Realtime Provider (`src/components/providers/RealtimeProvider.tsx`)

Create React context provider for realtime connection management:

- Manage global realtime connection status
- Handle reconnection logic with exponential backoff
- Provide connection status to child components
- Wrap play session pages
- Cleanup all subscriptions on unmount

Provider will:

- Initialize Supabase realtime connection
- Track connection state (connected/disconnected/reconnecting)
- Provide context value with connection status and helpers
- Handle network failures gracefully
- Reconnect automatically with backoff strategy

Usage: Wrap play session pages in layout or page component.

## Integration Points

- **Supabase Client**: Use `createClient()` from [`src/lib/supabase/client.ts`](src/lib/supabase/client.ts)
- **Database Schema**: Reference types from [`src/lib/supabase/schema.ts`](src/lib/supabase/schema.ts) and [`src/types/database.ts`](src/types/database.ts)
- **Zustand Stores**: 
  - Integrate with `useGameStateStore` ([`src/lib/stores/game-state-store.ts`](src/lib/stores/game-state-store.ts))
  - Integrate with `useVTTStore` ([`src/lib/stores/vtt-store.ts`](src/lib/stores/vtt-store.ts))
  - Use `useAuthStore` for current user info
- **Existing Realtime**: The stores already have basic `subscribe()`/`unsubscribe()` methods - enhance these with the new infrastructure

## File Structure

```
src/lib/
├── supabase/
│   └── realtime.ts (new)
└── hooks/
    ├── useRealtimeSubscription.ts (new)
    ├── usePresence.ts (new)
    ├── useGameState.ts (new)
    └── useTokenSync.ts (new)

src/components/
├── game/
│   └── PresenceIndicator.tsx (new)
└── providers/
    └── RealtimeProvider.tsx (new)
```

## Implementation Patterns

### Subscribing to Campaign Changes

Use `useRealtimeSubscription` to watch `campaigns` table for updates to current campaign.

### Broadcasting Dice Rolls

Create a custom channel or use presence channel to broadcast dice roll events to all players in a session.

### Syncing Initiative Order Updates

Use `useGameState` hook which automatically syncs `game_state.initiative_order` changes.

### Handling Token Drag with Optimistic UI

Use `useTokenSync` hook which debounces local updates and handles conflicts, allowing immediate UI feedback while syncing in background.

## Error Handling

- All hooks include try/catch blocks
- Connection failures trigger reconnection attempts
- Invalid data is logged and ignored (don't crash app)
- User-friendly error messages in UI components
- Fallback to polling if realtime fails (future enhancement)

## Performance Considerations

- Debounce token position updates (300ms)
- Throttle cursor position broadcasts (100ms)
- Batch multiple rapid updates
- Cleanup subscriptions properly to avoid memory leaks
- Use React.memo for PresenceIndicator if needed

## Implementation Status

✅ **COMPLETED** - All Supabase Realtime integration components have been successfully implemented:

1. ✅ **Realtime Utility** (`src/lib/supabase/realtime.ts`) - Created with channel helpers, table subscription utilities, presence broadcasting functions, and comprehensive TypeScript types
2. ✅ **Generic Subscription Hook** (`src/lib/hooks/useRealtimeSubscription.ts`) - Created with auto-cleanup, error handling with retry logic, connection status tracking, and filtering support
3. ✅ **Presence Hook** (`src/lib/hooks/usePresence.ts`) - Created with online user tracking, cursor position broadcasting (throttled), viewing state tracking, and integration with auth store
4. ✅ **Game State Sync Hook** (`src/lib/hooks/useGameState.ts`) - Created with game_state table synchronization, initiative order updates, active effects updates, debouncing, and store integration
5. ✅ **Token Sync Hook** (`src/lib/hooks/useTokenSync.ts`) - Created with real-time token position synchronization, debouncing (300ms), conflict resolution (last-write-wins), token selection tracking, and VTT store integration
6. ✅ **Presence Indicator Component** (`src/components/game/PresenceIndicator.tsx`) - Created with online players list, cursor display support, compact view mode, and error handling
7. ✅ **Realtime Provider** (`src/components/providers/RealtimeProvider.tsx`) - Created with connection management, reconnection logic with exponential backoff, context API, and status tracking

### Additional Implementation Details

- All files pass linting with no errors
- All hooks include proper cleanup on unmount
- Error handling implemented throughout with user-friendly messages
- Performance optimizations: debouncing (300ms for tokens), throttling (100ms for cursors)
- TypeScript types defined for all interfaces and return types
- Integration with existing Zustand stores (game-state-store, vtt-store, auth-store)
- Realtime subscriptions use Supabase's postgres_changes and presence features

### Next Steps

The realtime infrastructure is ready for use. To integrate:

1. Wrap play session pages with `<RealtimeProvider>`
2. Use `useGameState` hook in session components to sync game state
3. Use `useTokenSync` hook in map/token components for position synchronization
4. Use `usePresence` hook or `<PresenceIndicator>` component to show online users
5. Use `useRealtimeSubscription` for any custom table subscriptions needed

### To-dos

- [x] Create src/lib/supabase/realtime.ts with channel helpers, table subscription utilities, and presence broadcasting functions
- [x] Create src/lib/hooks/useRealtimeSubscription.ts - generic React hook for subscribing to any table with auto-cleanup and error handling
- [x] Create src/lib/hooks/usePresence.ts - hook for tracking online users, broadcasting cursor position, and showing active viewers
- [x] Create src/lib/hooks/useGameState.ts - hook to sync game_state table with useGameStateStore, handle initiative updates, and optimistic updates
- [x] Create src/lib/hooks/useTokenSync.ts - hook for real-time token position updates with debouncing, conflict resolution, and selection tracking
- [x] Create src/components/game/PresenceIndicator.tsx - UI component to show online players, display cursors/avatars on map, and user list
- [x] Create src/components/providers/RealtimeProvider.tsx - React context provider for connection management, reconnection logic, and wrapping play sessions