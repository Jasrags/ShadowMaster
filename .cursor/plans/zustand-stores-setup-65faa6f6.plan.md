<!-- 65faa6f6-aa06-439f-a842-7c76572e2c5a 2ecf4ddc-61ff-4f28-a481-da28acdee624 -->
# Zustand Stores Setup

This plan implements a complete Zustand state management system for the ShadowMaster application, including stores for authentication, campaigns, characters, game state, and VTT functionality with Supabase integration.

## Dependencies

Install required packages:

- `immer` - For nested state updates
- `zustand` persist middleware is built into Zustand v5, no additional package needed

## Implementation

### 1. Auth Store (`src/lib/stores/auth-store.ts`)

Create store for user authentication and profile management:

- State: `user` (Supabase User), `profile` (UserProfile), `session` (Session), `isLoading`
- Actions: `setUser`, `clearUser`, `setProfile`, `updateProfile`, `setSession`
- Persist user and profile to localStorage (exclude session tokens for security)
- Use types from `@/lib/auth/types` and `@/lib/supabase/schema`

### 2. Campaign Store (`src/lib/stores/campaign-store.ts`)

Create store for campaign management:

- State: `currentCampaign` (Campaign with relations), `campaigns` (Campaign[]), `isLoading`, `error`
- Actions: `setCampaign`, `setCampaigns`, `updateCampaign`, `addCampaign`, `removeCampaign`, `loadCampaigns`, `loadCampaignById`
- Integrate with Supabase queries from `@/lib/supabase/schema`:
  - Use `getCampaigns`, `getCampaignById`, `getCampaignsForUser`, `createCampaign`, `updateCampaign`
- Subscribe to Supabase realtime for campaign updates

### 3. Character Store (`src/lib/stores/character-store.ts`)

Create store for character management:

- State: `activeCharacter` (Character with relations), `characters` (Character[]), `isLoading`, `error`
- Actions: `setCharacter`, `setCharacters`, `updateCharacter`, `updateCharacterData` (for nested character_data JSON), `addCharacter`, `loadCharacters`
- Integrate with Supabase queries:
  - Use `getCharacters`, `getCharacterById`, `createCharacter`, `updateCharacter`
- Handle nested `character_data` JSON updates using immer
- Filter characters by current campaign

### 4. Game State Store (`src/lib/stores/game-state-store.ts`)

Create store for game session state:

- State: `initiativeOrder` (array), `activeEffects` (array), `selectedTokens` (string[]), `toolMode` ('select' | 'move' | 'draw' | etc.), `currentSessionId` (string | null)
- Actions: `setInitiativeOrder`, `addToInitiative`, `removeFromInitiative`, `setActiveEffects`, `addEffect`, `removeEffect`, `setSelectedTokens`, `setToolMode`, `setSessionId`, `loadGameState`
- Integrate with Supabase `game_state` table queries
- Subscribe to realtime updates for game state changes

### 5. VTT Store (`src/lib/stores/vtt-store.ts`)

Create store for Virtual Tabletop canvas state:

- State: `zoom` (number), `pan` ({ x: number, y: number }), `gridSettings` (GridSettings), `layerVisibility` (Record<string, boolean>), `selectedTool` (string), `tokenPositions` (Record<string, { x: number, y: number }>)
- Actions: `setZoom`, `setPan`, `updateGridSettings`, `toggleLayer`, `setSelectedTool`, `updateTokenPosition`, `syncTokenPositions`
- Persist zoom, pan, and grid settings to localStorage
- Subscribe to Supabase realtime for token position updates (likely from a `tokens` or `map_tokens` table if exists, or use `map_state` JSON in game_state)

### 6. Store Index (`src/lib/stores/index.ts`)

Create centralized store exports and utilities:

- Export all stores
- Create typed hooks for each store (e.g., `useAuthStore`, `useCampaignStore`)
- Add Zustand devtools integration (conditional on `process.env.NODE_ENV === 'development'`)
- Export store types for use in components
- Create helper functions for store initialization

### 7. Middleware and Realtime Integration

Add middleware and realtime subscriptions:

- Use Zustand's built-in `persist` middleware for auth-store (user/profile only) and vtt-store (UI preferences)
- Use `immer` middleware (via `zustand/middleware/immer`) for stores with nested updates (character-store, game-state-store)
- Create Supabase realtime subscriptions:
  - Campaign changes → update campaign-store
  - Character changes → update character-store
  - Game state changes → update game-state-store
  - Token position changes → update vtt-store
- Handle subscription cleanup on store reset/unmount

## Type Definitions

- Use existing types from:
  - `@/lib/auth/types` for User, Session, UserProfile
  - `@/lib/supabase/schema` for Campaign, Character, GameState types
  - `@/types/database` for Database types
- Create additional types as needed for store state shapes
- Add JSDoc comments for all stores, actions, and complex types

## File Structure

```
src/lib/stores/
├── auth-store.ts
├── campaign-store.ts
├── character-store.ts
├── game-state-store.ts
├── vtt-store.ts
└── index.ts
```

## Integration Points

- Supabase client: Use `createClient()` from `@/lib/supabase/client`
- Supabase queries: Use functions from `@/lib/supabase/schema`
- Auth: Integrate with existing auth flow in `@/lib/auth/session`
- Realtime: Set up subscriptions using Supabase `.on()` method for relevant tables

### To-dos

- [x] Install immer package for nested state updates
- [x] Create auth-store.ts with user session, profile state, and actions (setUser, clearUser, updateProfile) with localStorage persistence
- [x] Create campaign-store.ts with current campaign, campaign list, and actions integrated with Supabase queries and realtime subscriptions
- [x] Create character-store.ts with active character, character list, and actions including nested character_data updates using immer
- [x] Create game-state-store.ts with initiative tracker, active effects, selected tokens, and tool mode state
- [x] Create vtt-store.ts with canvas zoom/pan, grid settings, layer visibility, selected tools, and token positions synced with Supabase
- [x] Create index.ts with store exports, typed hooks, and devtools integration
- [x] Add Supabase realtime subscriptions to relevant stores for live updates

## Implementation Status

✅ **COMPLETED** - All Zustand stores have been successfully implemented:

1. ✅ **Auth Store** - Created with user session, profile management, and localStorage persistence (excludes session tokens for security)
2. ✅ **Campaign Store** - Created with Supabase integration, realtime subscriptions, and full CRUD operations
3. ✅ **Character Store** - Created with immer middleware for nested updates, campaign filtering, and realtime subscriptions
4. ✅ **Game State Store** - Created with initiative tracking, active effects, token selection, tool modes, and Supabase integration
5. ✅ **VTT Store** - Created with canvas state management, grid settings, layer visibility, token positions, and localStorage persistence
6. ✅ **Store Index** - Created with centralized exports, typed hooks, and helper functions
7. ✅ **Realtime Subscriptions** - All stores include Supabase realtime subscriptions with proper cleanup

### Additional Fixes Completed

- ✅ Fixed authentication middleware to properly validate user existence (not just session cookies)
- ✅ Fixed login/signup form navigation to use full page reload for proper session handling
- ✅ Fixed favicon 404 error by adding icon.svg and updating middleware to skip static files
- ✅ All stores include proper TypeScript types and JSDoc comments
- ✅ All stores include error handling and loading states