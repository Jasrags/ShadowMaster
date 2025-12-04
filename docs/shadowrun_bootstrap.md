# Shadowrun VTT - Bootstrap Prompts

## Tech Stack Summary
- **Framework:** Next.js 14+ (App Router)
- **Database/Backend:** Supabase
- **Real-time:** Supabase Realtime
- **State Management:** Zustand
- **Canvas/Rendering:** Konva.js (react-konva)
- **UI Components:** Intent UI (React Aria + Tailwind)
- **Deployment:** Docker for production, local dev server for development

---

## Prompt 1: Project Initialization & Configuration

```
Create a new Next.js 14 project with TypeScript and the App Router using the following specifications:

1. Initialize with: create-next-app with TypeScript, Tailwind CSS, App Router, and src/ directory
2. Install core dependencies:
   - @supabase/supabase-js (latest)
   - @supabase/ssr (for Next.js)
   - zustand
   - react-konva
   - konva
   - lucide-react (for icons)

3. Set up the following directory structure:
   ```
   src/
   ├── app/
   │   ├── layout.tsx
   │   ├── page.tsx
   │   ├── (auth)/
   │   │   ├── login/
   │   │   └── signup/
   │   ├── campaigns/
   │   ├── characters/
   │   └── play/
   ├── components/
   │   ├── ui/ (for Intent UI components)
   │   ├── game/
   │   └── vtt/
   ├── lib/
   │   ├── supabase/
   │   ├── stores/
   │   └── utils/
   ├── types/
   └── styles/
   ```

4. Configure environment variables in .env.local:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```

5. Create a Dockerfile for production deployment with:
   - Multi-stage build (dependencies, builder, runner)
   - Node 20 Alpine base
   - Proper caching layers
   - Non-root user
   - Health check endpoint

6. Create docker-compose.yml for local Supabase development with:
   - Supabase Studio
   - PostgreSQL
   - Realtime server
   - Auth server
   - Storage

7. Add .dockerignore and .gitignore with appropriate exclusions

8. Configure Tailwind for Intent UI compatibility (no additional config needed initially)

9. Create package.json scripts for:
   - dev (local development)
   - build
   - start
   - docker:build
   - docker:run
   - supabase:start (local Supabase)
   - supabase:stop
```

---

## Prompt 2: Supabase Client Setup & Authentication

```
Set up Supabase integration with Next.js 14 App Router:

1. Create src/lib/supabase/client.ts:
   - Browser client using createBrowserClient
   - Proper cookie handling for auth
   - TypeScript types

2. Create src/lib/supabase/server.ts:
   - Server-side client using createServerClient
   - Cookie handling for Server Components and Route Handlers
   - Type-safe helpers

3. Create src/lib/supabase/middleware.ts:
   - Auth middleware for protected routes
   - Session refresh logic
   - Redirect handling

4. Set up middleware.ts in root:
   - Integrate Supabase auth middleware
   - Define protected route patterns
   - Handle auth state changes

5. Create authentication components:
   - src/components/auth/LoginForm.tsx
   - src/components/auth/SignupForm.tsx
   - src/components/auth/UserMenu.tsx (dropdown with logout)

6. Create auth pages:
   - src/app/(auth)/login/page.tsx
   - src/app/(auth)/signup/page.tsx
   - src/app/(auth)/layout.tsx (centered auth layout)

7. Add auth utilities:
   - src/lib/auth/session.ts (get/check session helpers)
   - src/lib/auth/types.ts (User, Session types)

8. Create a root layout that:
   - Checks auth state
   - Shows UserMenu when authenticated
   - Redirects to login when needed

Include proper error handling, loading states, and TypeScript types throughout.
```

---

## Prompt 3: Database Schema & Migrations

```
Create a Supabase database schema for a Shadowrun VTT application:

1. Create migration file: supabase/migrations/001_initial_schema.sql

2. Define the following tables with appropriate relationships:

   **users_profile** (extends Supabase auth.users):
   - id (uuid, FK to auth.users)
   - username (unique, not null)
   - avatar_url
   - created_at
   - updated_at

   **campaigns**:
   - id (uuid, PK)
   - name (text, not null)
   - description (text)
   - gm_user_id (uuid, FK to users_profile)
   - setting (text)
   - created_at
   - updated_at
   - is_active (boolean)

   **campaign_players**:
   - campaign_id (uuid, FK)
   - user_id (uuid, FK)
   - joined_at
   - role (enum: 'player', 'co-gm')
   - Primary key (campaign_id, user_id)

   **characters**:
   - id (uuid, PK)
   - campaign_id (uuid, FK)
   - player_user_id (uuid, FK)
   - name (text, not null)
   - character_data (jsonb) -- stores attributes, skills, gear
   - avatar_url (text)
   - created_at
   - updated_at
   - is_active (boolean)

   **sessions**:
   - id (uuid, PK)
   - campaign_id (uuid, FK)
   - name (text)
   - scheduled_date (timestamp)
   - status (enum: 'planned', 'active', 'completed')
   - notes (text)
   - created_at
   - updated_at

   **game_state**:
   - session_id (uuid, PK, FK)
   - initiative_order (jsonb)
   - active_effects (jsonb)
   - map_state (jsonb)
   - updated_at

   **maps**:
   - id (uuid, PK)
   - campaign_id (uuid, FK)
   - name (text, not null)
   - image_url (text)
   - grid_size (integer)
   - width (integer)
   - height (integer)
   - metadata (jsonb)
   - created_at

3. Set up Row Level Security (RLS) policies:
   - Users can read/update their own profile
   - GMs can manage their campaigns
   - Players can read campaigns they're in
   - Only GMs can update game_state
   - Characters are readable by campaign members

4. Create indexes for performance:
   - campaign_id on characters, sessions, maps
   - player_user_id on characters
   - gm_user_id on campaigns

5. Create TypeScript types from schema:
   - Use Supabase CLI to generate types
   - Export as src/types/database.ts

6. Add helper file src/lib/supabase/schema.ts with type-safe query builders
```

---

## Prompt 4: Zustand Stores Setup

```
Create Zustand stores for state management:

1. Create src/lib/stores/auth-store.ts:
   - Store user session
   - Store user profile
   - Actions: setUser, clearUser, updateProfile
   - Persist to localStorage
   - TypeScript types

2. Create src/lib/stores/campaign-store.ts:
   - Current campaign data
   - Campaign list
   - Actions: setCampaign, updateCampaign, addCampaign
   - Integration with Supabase queries

3. Create src/lib/stores/character-store.ts:
   - Active character
   - Character list for current campaign
   - Actions: setCharacter, updateCharacter, updateCharacterData
   - Handle nested character_data updates

4. Create src/lib/stores/game-state-store.ts:
   - Initiative tracker
   - Active effects
   - Selected tokens
   - Tool mode (select, move, draw, etc.)
   - Actions for game state manipulation

5. Create src/lib/stores/vtt-store.ts:
   - Canvas zoom/pan state
   - Grid settings
   - Layer visibility
   - Selected tools
   - Token positions (synced with Supabase)

6. Create store hooks in src/lib/stores/index.ts:
   - Export all stores
   - Create typed hooks
   - Add devtools integration

7. Add Zustand middleware:
   - Persist important stores
   - Subscribe to Supabase realtime and update stores
   - Add immer for nested state updates

Include proper TypeScript typing and JSDoc comments for all stores and actions.
```

---

## Prompt 5: Supabase Realtime Integration

```
Set up Supabase Realtime for multiplayer synchronization:

1. Create src/lib/supabase/realtime.ts:
   - RealtimeChannel setup helper
   - Subscribe to table changes
   - Broadcast presence (active users)
   - TypeScript types for realtime events

2. Create src/lib/hooks/useRealtimeSubscription.ts:
   - React hook for subscribing to table changes
   - Auto-cleanup on unmount
   - Error handling
   - Generic types for any table

3. Create src/lib/hooks/usePresence.ts:
   - Track online users in a session
   - Broadcast user cursor position
   - Show who's viewing what

4. Create src/lib/hooks/useGameState.ts:
   - Subscribe to game_state changes
   - Sync with vtt-store
   - Handle initiative updates
   - Optimistic updates with rollback

5. Create src/lib/hooks/useTokenSync.ts:
   - Real-time token position updates
   - Debounce position changes during drag
   - Conflict resolution (last-write-wins)
   - Show other users' token selections

6. Create src/components/game/PresenceIndicator.tsx:
   - Show online players
   - Display cursors or avatars on map
   - User list component

7. Add realtime connection provider:
   - src/components/providers/RealtimeProvider.tsx
   - Wrap play session pages
   - Handle connection status
   - Reconnection logic

Example implementation patterns for:
- Subscribing to specific campaign changes
- Broadcasting dice rolls to all players
- Syncing initiative order updates
- Handling token drag with optimistic UI
```

---

## Prompt 6: Core UI Components (Intent UI)

```
Set up Intent UI components and create core UI elements:

1. Install Intent UI dependencies:
   - react-aria-components
   - Follow Intent UI installation docs

2. Copy/paste these Intent UI components into src/components/ui/:
   - Button
   - Input (TextField)
   - Select (ListBox/Dropdown)
   - Table
   - Menu/ContextMenu
   - Sidebar
   - Modal (Dialog)
   - Tabs
   - Card
   - Form + Field

3. Create layout components:
   - src/components/layout/AppLayout.tsx (main app shell)
   - src/components/layout/Navbar.tsx
   - src/components/layout/Sidebar.tsx (using Intent UI Sidebar)

4. Create reusable game components:
   - src/components/game/CampaignCard.tsx
   - src/components/game/CampaignList.tsx
   - src/components/game/CharacterCard.tsx
   - src/components/game/CharacterSheet.tsx (tabbed interface)

5. Create form components:
   - src/components/forms/CampaignForm.tsx
   - src/components/forms/CharacterForm.tsx
   - Use Intent UI Form + Field components

6. Create a theme configuration:
   - src/styles/theme.ts (Tailwind color palette)
   - Shadowrun cyberpunk aesthetic
   - Dark mode support

7. Set up the root layout:
   - src/app/layout.tsx with AppLayout
   - Navbar with user menu
   - Sidebar for navigation

All components should:
- Use TypeScript
- Include proper accessibility
- Have loading states
- Handle errors gracefully
- Be responsive (mobile-friendly)
```

---

## Prompt 7: Campaign & Character Management Pages

```
Create the campaign and character management pages:

1. Campaign pages:
   
   **src/app/campaigns/page.tsx**:
   - List all campaigns user is in (as GM or player)
   - Show GM's campaigns separately
   - "Create Campaign" button (GMs only)
   - Filter/search functionality
   - Use CampaignList component

   **src/app/campaigns/new/page.tsx**:
   - CampaignForm for creating new campaign
   - Name, description, setting fields
   - Submit creates campaign and redirects

   **src/app/campaigns/[id]/page.tsx**:
   - Campaign details view
   - Show sessions, characters, players
   - Tabs: Overview, Characters, Sessions, Maps, Settings
   - GM controls (edit, invite players, start session)
   - Player view (their characters, session schedule)

   **src/app/campaigns/[id]/edit/page.tsx**:
   - Edit campaign details
   - Manage players (add/remove)
   - GM only

2. Character pages:

   **src/app/characters/page.tsx**:
   - List all user's characters across campaigns
   - Group by campaign
   - Create new character button

   **src/app/characters/new/page.tsx**:
   - Character creation form
   - Select campaign (dropdown)
   - Shadowrun character sheet fields:
     - Basic info (name, metatype, archetype)
     - Attributes (Body, Agility, Reaction, Strength, Willpower, Logic, Intuition, Charisma, Edge, Magic)
     - Skills (organized by category)
     - Qualities, gear, cyberware
   - Save as JSON in character_data field

   **src/app/characters/[id]/page.tsx**:
   - Full character sheet view
   - Read-only unless it's user's character
   - Tabs: Attributes, Skills, Gear, Magic/Resonance, Notes
   - Print-friendly layout option

   **src/app/characters/[id]/edit/page.tsx**:
   - Edit character sheet
   - Auto-save changes
   - Track advancement/karma spending

3. Create server actions:
   - src/app/campaigns/actions.ts
   - src/app/characters/actions.ts
   - CRUD operations with Supabase
   - Validate permissions

4. Create API routes if needed:
   - src/app/api/campaigns/[id]/invite/route.ts (invite players)

All pages should:
- Use App Router features (server components where possible)
- Handle loading states with Suspense
- Show errors with error boundaries
- Be protected (auth required)
- Have breadcrumbs for navigation
```

---

## Prompt 8: VTT Canvas Foundation (Konva)

```
Create the VTT canvas foundation using Konva.js:

1. Create src/components/vtt/VTTCanvas.tsx:
   - Main canvas component using react-konva
   - Stage setup with responsive sizing
   - Layers: background, grid, tokens, fog-of-war, UI
   - Pan and zoom functionality
   - Grid rendering

2. Create src/components/vtt/GridLayer.tsx:
   - Render square or hex grid
   - Configurable grid size
   - Show/hide grid toggle

3. Create src/components/vtt/MapLayer.tsx:
   - Display background map image
   - Handle image loading
   - Scaling and positioning

4. Create src/components/vtt/Token.tsx:
   - Draggable token component
   - Click to select
   - Show health/status indicators
   - Different shapes (circle for characters, square for objects)
   - Tooltip on hover

5. Create src/components/vtt/TokenLayer.tsx:
   - Manage all tokens on map
   - Handle token selection
   - Multi-select support
   - Sync positions with Supabase

6. Create src/lib/vtt/canvas-utils.ts:
   - Screen to grid coordinate conversion
   - Snap to grid helper
   - Distance calculation
   - Line of sight helpers (for future)

7. Create VTT control toolbar:
   - src/components/vtt/VTTToolbar.tsx
   - Tools: Select, Move, Draw, Measure, Ping
   - Grid controls
   - Zoom controls
   - Layer visibility toggles

8. Create the play session page:
   - src/app/play/[sessionId]/page.tsx
   - Main VTT interface
   - Canvas takes center stage
   - Sidebars: character sheet, chat, initiative
   - Resizable panels

Features to implement:
- Click and drag tokens
- Zoom with mouse wheel
- Pan with middle mouse or space+drag
- Snap to grid
- Select multiple tokens (shift-click or drag rectangle)
- Right-click context menu on tokens
- Save token positions to Supabase
- Realtime sync of token movements

Include proper TypeScript types and performance optimizations (use React.memo, avoid unnecessary re-renders).
```

---

## Prompt 9: Game Mechanics & Dice Rolling

```
Implement Shadowrun-specific game mechanics:

1. Create src/lib/shadowrun/dice.ts:
   - Shadowrun dice pool roller
   - Roll function: count hits (5s and 6s)
   - Handle edge cases (glitches, critical glitches)
   - Rule of Six (exploding 6s)
   - Return detailed results

2. Create src/lib/shadowrun/combat.ts:
   - Initiative calculation
   - Initiative order sorting
   - Pass tracking (Shadowrun initiative passes)
   - Damage calculation helpers

3. Create src/lib/shadowrun/character.ts:
   - Attribute/skill helpers
   - Dice pool calculation (attribute + skill + modifiers)
   - Condition monitor (Physical/Stun damage)
   - Essence calculation

4. Create src/lib/shadowrun/modifiers.ts:
   - Common modifiers (wound, visibility, recoil, etc.)
   - Situational modifier calculator

5. Create dice rolling UI:
   - src/components/game/DiceRoller.tsx
   - Input: dice pool size
   - Show rolling animation
   - Display results (hits, glitches)
   - Option to push to chat

6. Create initiative tracker:
   - src/components/game/InitiativeTracker.tsx
   - Show initiative order
   - Track current actor
   - Initiative passes
   - Add/remove combatants
   - Roll initiative for all

7. Create chat system:
   - src/components/game/ChatPanel.tsx
   - Show dice roll results
   - GM announcements
   - Player messages
   - Store in Supabase chat_messages table
   - Realtime updates

8. Add chat to database schema:
   - Migration for chat_messages table
   - session_id, user_id, message, type (chat/roll/system)
   - Timestamps

9. Create src/lib/hooks/useDiceRoll.ts:
   - Hook for rolling dice
   - Broadcast to realtime
   - Add to chat
   - Animation coordination

Include comprehensive TypeScript types for all Shadowrun game mechanics. Add JSDoc comments explaining Shadowrun rules where relevant.
```

---

## Prompt 10: Docker Configuration & Deployment

```
Create production-ready Docker configuration:

1. Create Dockerfile (multi-stage):
   ```
   # Stage 1: Dependencies
   - Base: node:20-alpine
   - Copy package files
   - Install dependencies (use pnpm or npm)
   
   # Stage 2: Builder
   - Copy source code
   - Build Next.js app
   - Generate standalone output
   
   # Stage 3: Runner
   - Minimal node:20-alpine
   - Copy standalone build
   - Set environment variables
   - Expose port 3000
   - Health check on /api/health
   - Run as non-root user
   - Use tini for proper signal handling
   ```

2. Create .dockerignore:
   - node_modules
   - .next
   - .git
   - All development files

3. Create docker-compose.yml for local development:
   ```yaml
   services:
     supabase-studio:
       # Supabase Studio UI
     postgres:
       # PostgreSQL database
     supabase-auth:
       # Auth server
     supabase-realtime:
       # Realtime server
     supabase-storage:
       # File storage
     app:
       # Next.js app (for testing Docker build)
   ```

4. Create docker-compose.prod.yml for production:
   - Just the Next.js app
   - Assumes external Supabase (hosted)
   - Environment variable configuration
   - Proper networking
   - Volume for static assets if needed

5. Create health check endpoint:
   - src/app/api/health/route.ts
   - Check database connection
   - Return 200 if healthy

6. Create startup script:
   - scripts/docker-entrypoint.sh
   - Run database migrations
   - Start Next.js server
   - Proper signal handling

7. Create CI/CD configuration (.github/workflows/):
   - build.yml: Build Docker image
   - deploy.yml: Deploy to production
   - Include steps:
     - Lint and type-check
     - Build Docker image
     - Push to registry
     - Deploy to server

8. Create deployment documentation:
   - docs/DEPLOYMENT.md
   - Environment variables needed
   - How to run locally with Docker
   - How to deploy to production
   - Backup strategies

9. Add npm scripts to package.json:
   ```json
   "docker:build": "docker build -t shadowrun-vtt .",
   "docker:run": "docker run -p 3000:3000 shadowrun-vtt",
   "docker:dev": "docker-compose up",
   "docker:prod": "docker-compose -f docker-compose.prod.yml up"
   ```

Include proper security practices:
- Non-root user in container
- No secrets in Dockerfile
- Use .env files for configuration
- Proper signal handling
- Health checks
- Resource limits
```

---

## Usage Instructions

1. **Start with Prompt 1**: Initialize the project structure and dependencies
2. **Run Prompts 2-3**: Set up authentication and database
3. **Execute Prompts 4-6**: Build state management and core UI
4. **Implement Prompts 7-9**: Create application features
5. **Finish with Prompt 10**: Prepare for deployment

Each prompt can be used with an AI assistant like Claude, or given to a development team member as a specification. Adjust details based on your specific Shadowrun edition rules and desired features.

## Additional Notes

- Test each component as you build it
- Set up Supabase locally first before deploying
- Use Supabase CLI for migrations and type generation
- Consider adding Storybook for component development
- Add tests (Vitest + React Testing Library) after core features work
- Document your custom Shadowrun rules/calculations

## Next Phase Features (Future Prompts)

Once core functionality is working:
- Fog of war
- Line of sight calculations
- Drawing tools (measure, shapes, freehand)
- Asset library (token images, maps)
- Sound/music integration
- Video/voice chat integration (Livekit)
- Mobile app (React Native)
- Advanced automation (macros, scripts)
