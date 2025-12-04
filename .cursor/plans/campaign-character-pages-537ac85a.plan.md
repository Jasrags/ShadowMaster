<!-- 537ac85a-e2f5-4f1d-95c8-287e7b6bc7f3 ae6d65a2-de74-4c77-be8e-247af09f018a -->
# Campaign & Character Management Pages Implementation

## Overview

Create comprehensive campaign and character management pages following Next.js App Router patterns with server components, server actions, protected routes, and Shadowrun-specific character sheet features.

## Implementation Strategy

### 1. Server Actions Setup

Create server action files that handle all database operations with proper authentication and permission checks:

- **`src/app/campaigns/actions.ts`**: Campaign CRUD operations
- `createCampaign()` - Validate user is authenticated, set gm_user_id
- `updateCampaign()` - Verify user is GM of campaign
- `deleteCampaign()` - Verify user is GM
- `getCampaignsForUser()` - Get campaigns where user is GM or player
- `invitePlayerToCampaign()` - GM only, add to campaign_players
- `removePlayerFromCampaign()` - GM only
- Use existing schema functions from `src/lib/supabase/schema.ts`

- **`src/app/characters/actions.ts`**: Character CRUD operations
- `createCharacter()` - Validate user owns character and is in campaign
- `updateCharacter()` - Verify ownership
- `deleteCharacter()` - Verify ownership (soft delete via is_active)
- `getCharactersForUser()` - Get all user's characters, optionally by campaign
- Use `character_data` JSON field for Shadowrun sheet data

### 2. Campaign Pages

#### `src/app/campaigns/page.tsx` (Server Component)

- Fetch campaigns where user is GM or player using `getCampaignsForUser()`
- Separate into GM campaigns and player campaigns
- Use existing `CampaignList` component
- Add "Create Campaign" button (GMs only - check if user has any campaigns as GM)
- Implement client-side filter/search component
- Add Suspense boundary with loading skeleton
- Redirect to login if not authenticated

#### `src/app/campaigns/new/page.tsx` (Server Component + Client Form)

- Server component checks authentication, redirects if not logged in
- Client component wraps `CampaignForm`
- Server action for form submission
- Redirect to campaign detail page after creation

#### `src/app/campaigns/[id]/page.tsx` (Server Component)

- Fetch campaign details using `getCampaignWithDetails()` from schema
- Check if user has access (GM or player)
- Render tabbed interface:
- **Overview Tab**: Campaign info, description, setting, GM info
- **Characters Tab**: List of characters in campaign using CharacterCard
- **Sessions Tab**: List sessions (placeholder for now)
- **Maps Tab**: List maps (placeholder for now)
- **Settings Tab**: GM-only controls (edit, manage players)
- Use existing `Tabs` component from `src/components/ui/tabs.tsx`
- Show GM controls conditionally (edit button, invite players, start session)
- Player view shows their characters and session schedule

#### `src/app/campaigns/[id]/edit/page.tsx` (Server Component + Client Form)

- Verify user is GM of campaign
- Pre-populate `CampaignForm` with existing data
- Server action for updates
- Manage players list (add/remove via server actions)
- Redirect to campaign detail on success

### 3. Character Pages

#### `src/app/characters/page.tsx` (Server Component)

- Fetch all user's characters across campaigns
- Group by campaign using `getCharactersByPlayer()`
- Display using `CharacterCard` component (may need to create/enhance)
- "Create New Character" button
- Add Suspense boundary

#### `src/app/characters/new/page.tsx` (Server Component + Client Form)

- Enhanced character creation form with Shadowrun-specific fields
- Campaign selection dropdown (fetch user's campaigns)
- Shadowrun character sheet fields in `character_data` JSON:
- Basic info: name, metatype, archetype, description
- Attributes: Body, Agility, Reaction, Strength, Willpower, Logic, Intuition, Charisma, Edge, Magic (or Resonance)
- Skills: organized by category (Combat, Physical, Social, Technical, Magical, Resonance)
- Qualities (positive/negative)
- Gear/Equipment
- Cyberware/Bioware
- Enhance existing `CharacterForm` or create new `ShadowrunCharacterForm`
- Save as JSON in `character_data` field

#### `src/app/characters/[id]/page.tsx` (Server Component)

- Fetch character with relations
- Full character sheet view using enhanced `CharacterSheet` component
- Read-only unless it's user's character (check `player_user_id`)
- Tabs: Overview, Attributes, Skills, Gear, Magic/Resonance, Notes
- Print-friendly layout option (CSS media query)
- Enhance existing `CharacterSheet` to display Shadowrun data from `character_data`

#### `src/app/characters/[id]/edit/page.tsx` (Server Component + Client Form)

- Verify ownership before allowing edit
- Enhanced edit form with all Shadowrun fields
- Auto-save functionality (debounced, using server action)
- Track advancement/karma spending (store in character_data)

### 4. API Routes

#### `src/app/api/campaigns/[id]/invite/route.ts` (Route Handler)

- POST endpoint to invite players by username/email
- Verify GM permissions
- Look up user by username/email
- Add to campaign_players table
- Return success/error

### 5. Supporting Components

#### Enhance `CharacterSheet` component

- Update `src/components/game/CharacterSheet.tsx` to display Shadowrun-specific data from `character_data` JSON
- Add tabs for Attributes, Skills, Gear, Magic/Resonance, Notes
- Style Shadowrun attributes display (grid layout)

#### Create `ShadowrunCharacterForm` component (optional)

- New form component or enhance existing `CharacterForm`
- Structured form for all Shadowrun fields
- Organize into sections matching character sheet tabs
- Validate attribute totals, skill points, etc.

#### Breadcrumb component

- Create `src/components/ui/breadcrumb.tsx` using Intent UI patterns
- Add to all pages for navigation

#### Create `CharacterCard` component (if doesn't exist)

- Similar to `CampaignCard` but for characters
- Display character name, campaign, player
- Link to character detail page

### 6. Route Protection

Create middleware or utility for protecting routes:

- Check authentication in each server component using `getUser()` from `src/lib/auth/session.ts`
- Redirect to login if not authenticated
- Verify campaign/character access permissions
- Create reusable `requireAuth()` helper function

### 7. Loading States & Error Handling

- Add Suspense boundaries with loading skeletons
- Create error.tsx files for error boundaries:
- `src/app/campaigns/error.tsx`
- `src/app/characters/error.tsx`
- Handle not found cases (404)
- Show user-friendly error messages

## Files to Create

### Pages

- `src/app/campaigns/page.tsx`
- `src/app/campaigns/new/page.tsx`
- `src/app/campaigns/[id]/page.tsx`
- `src/app/campaigns/[id]/edit/page.tsx`
- `src/app/campaigns/loading.tsx`
- `src/app/campaigns/error.tsx`
- `src/app/characters/page.tsx`
- `src/app/characters/new/page.tsx`
- `src/app/characters/[id]/page.tsx`
- `src/app/characters/[id]/edit/page.tsx`
- `src/app/characters/loading.tsx`
- `src/app/characters/error.tsx`

### Server Actions

- `src/app/campaigns/actions.ts`
- `src/app/characters/actions.ts`

### API Routes

- `src/app/api/campaigns/[id]/invite/route.ts`

### Components (new/enhance)

- `src/components/game/CharacterCard.tsx` (if doesn't exist)
- `src/components/ui/breadcrumb.tsx`
- Enhance `src/components/game/CharacterSheet.tsx`
- Enhance or create Shadowrun-specific character form component

### Utilities

- `src/lib/auth/route-protection.ts` (reusable auth helpers)

## Key Dependencies

- Existing components: `CampaignList`, `CampaignForm`, `CharacterSheet`, UI components from `src/components/ui/`
- Existing schema functions: All query functions from `src/lib/supabase/schema.ts`
- Auth utilities: `getUser()`, `getSession()` from `src/lib/auth/session.ts`
- Supabase client: `createClient()` from `src/lib/supabase/server.ts`
- Database types: From `src/types/database.ts`

## Notes

- Use server components where possible for data fetching
- Client components only for interactive forms and search/filter
- All database operations go through server actions for security
- Character data structure in `character_data` JSON field follows Shadowrun 6e or 5e format
- Permission checks are critical - verify GM status, character ownership, campaign membership
- Reuse existing UI components and patterns from the codebase

### To-dos

- [ ] Create server actions for campaigns (CRUD operations, permissions) in src/app/campaigns/actions.ts
- [ ] Create server actions for characters (CRUD operations, permissions) in src/app/characters/actions.ts
- [ ] Create route protection utility in src/lib/auth/route-protection.ts for reusable auth checks
- [ ] Build campaigns list page (src/app/campaigns/page.tsx) with filter/search and CampaignList component
- [ ] Build campaign creation page (src/app/campaigns/new/page.tsx) with CampaignForm
- [ ] Build campaign detail page (src/app/campaigns/[id]/page.tsx) with tabs for Overview, Characters, Sessions, Maps, Settings
- [ ] Build campaign edit page (src/app/campaigns/[id]/edit/page.tsx) with player management
- [ ] Create API route for inviting players (src/app/api/campaigns/[id]/invite/route.ts)
- [ ] Build characters list page (src/app/characters/page.tsx) grouped by campaign
- [ ] Build character creation page (src/app/characters/new/page.tsx) with Shadowrun-specific fields in character_data JSON
- [ ] Build character detail page (src/app/characters/[id]/page.tsx) with enhanced CharacterSheet component
- [ ] Build character edit page (src/app/characters/[id]/edit/page.tsx) with auto-save functionality
- [ ] Enhance CharacterSheet component to display Shadowrun data from character_data JSON with proper tabs
- [ ] Create or enhance CharacterCard component for displaying characters in lists
- [ ] Create breadcrumb navigation component and add to all pages
- [ ] Add loading.tsx and error.tsx files for campaigns and characters routes