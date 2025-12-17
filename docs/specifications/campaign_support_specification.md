# Campaign Support Specification

**Last Updated:** 2025-01-27  
**Status:** Specification  
**Category:** UI/UX, Campaign Management, Ruleset Control  
**Affected Editions:** All editions (campaign controls ruleset selection)

---

## Overview

Campaign support enables Game Masters (GMs) to create and manage Shadowrun campaigns with centralized ruleset control. A campaign defines the rules environment for a group of players, controlling which edition, books, creation methods, and optional rules are available. Players can join campaigns and create characters that conform to the campaign's ruleset constraints.

**Key Features:**
- GM creates campaigns with edition and book selection
- Campaign controls which creation methods are allowed
- Campaign defines gameplay level (Street, Experienced, Prime Runner)
- Players join campaigns and create characters within campaign constraints
- Campaign-specific character validation
- Campaign roster management (players and characters)
- Optional rules and house rules management

This feature is critical for multiplayer Shadowrun sessions where the GM needs to enforce consistent rules across all player characters.

---

## User Stories

### Primary Use Cases (GM)

1. **As a GM**, I want to create a new campaign and specify which Shadowrun edition and sourcebooks are allowed.

2. **As a GM**, I want to control which character creation methods players can use (Priority, Point Buy, etc.).

3. **As a GM**, I want to set the gameplay level (Street, Experienced, Prime Runner) to control starting resources.

4. **As a GM**, I want to invite players to my campaign and manage the player roster.

5. **As a GM**, I want to view all characters in my campaign to ensure they comply with campaign rules.

6. **As a GM**, I want to configure optional rules and house rules that apply to the campaign.

7. **As a GM**, I want to see campaign statistics (number of players, characters, active sessions).

### Primary Use Cases (Player)

8. **As a player**, I want to browse available campaigns I can join.

9. **As a player**, I want to join a campaign using an invite code or link.

10. **As a player**, I want to create a character specifically for a campaign, ensuring it follows campaign rules.

11. **As a player**, I want to see which campaigns my characters belong to.

12. **As a player**, I want to view campaign details (edition, allowed books, gameplay level).

### Secondary Use Cases

13. **As a GM**, I want to archive or close a campaign when it ends.

14. **As a player**, I want to leave a campaign if I'm no longer participating.

15. **As a GM**, I want to export campaign data (characters, notes) for backup.

16. **As a GM**, I want to set campaign visibility (private, invite-only, public).

---

## Page Structure

### Routes

#### Campaign List Page
- **Path:** `/app/campaigns/page.tsx`
- **Layout:** Uses `AuthenticatedLayout` (inherits sidebar navigation)
- **Authentication:** Required (protected route)
- **Description:** Lists all campaigns the user is involved in (as GM or player)

#### Campaign Detail Page
- **Path:** `/app/campaigns/[id]/page.tsx`
- **Layout:** Uses `AuthenticatedLayout`
- **Authentication:** Required (protected route)
- **Description:** Shows campaign details, roster, characters, settings

#### Campaign Creation Page
- **Path:** `/app/campaigns/create/page.tsx`
- **Layout:** Uses `AuthenticatedLayout`
- **Authentication:** Required (protected route)
- **Description:** Wizard/form for creating a new campaign

#### Campaign Settings Page
- **Path:** `/app/campaigns/[id]/settings/page.tsx`
- **Layout:** Uses `AuthenticatedLayout`
- **Authentication:** Required (protected route, GM-only)
- **Description:** Campaign configuration and management

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (from AuthenticatedLayout)                                │
├──────────┬──────────────────────────────────────────────────────┤
│ SIDEBAR   │ MAIN CONTENT AREA                                    │
│ (nav)     │                                                       │
│           │ ┌─────────────────────────────────────────────────┐ │
│           │ │ Campaign Header                                  │ │
│           │ │ - Title, Edition Badge                           │ │
│           │ │ - GM info, player count                          │ │
│           │ │ - Actions (Join, Leave, Settings if GM)          │ │
│           │ └─────────────────────────────────────────────────┘ │
│           │                                                       │
│           │ ┌─────────────────────────────────────────────────┐ │
│           │ │ Campaign Navigation Tabs                         │ │
│           │ │ - Overview | Characters | Roster | Settings      │ │
│           │ └─────────────────────────────────────────────────┘ │
│           │                                                       │
│           │ ┌─────────────────────────────────────────────────┐ │
│           │ │ Active Tab Content                               │ │
│           │ │ (Overview/Characters/Roster/Settings)            │ │
│           │ └─────────────────────────────────────────────────┘ │
└───────────┴──────────────────────────────────────────────────────┘
```

---

## Data Model

### Campaign Type

```typescript
/**
 * Campaign visibility levels
 */
export type CampaignVisibility = "private" | "invite-only" | "public";

/**
 * Gameplay level affects starting resources and restrictions
 */
export type GameplayLevel = "street" | "experienced" | "prime-runner";

/**
 * A Shadowrun campaign managed by a GM
 */
export interface Campaign {
  id: ID;

  /** GM user ID (campaign creator/owner) */
  gmId: ID;

  /** Campaign title */
  title: string;

  /** Campaign description/narrative */
  description?: string;

  /** Campaign status */
  status: "active" | "paused" | "archived" | "completed";

  // -------------------------------------------------------------------------
  // Ruleset Configuration
  // -------------------------------------------------------------------------

  /** Edition this campaign uses */
  editionId: ID;
  editionCode: EditionCode;

  /** Books/sourcebooks enabled for this campaign */
  enabledBookIds: ID[];

  /** Creation methods allowed for character creation */
  enabledCreationMethodIds: ID[];

  /** Gameplay level (Street, Experienced, Prime Runner) */
  gameplayLevel: GameplayLevel;

  /** Optional rules enabled (e.g., "wireless bonuses", "alternate init") */
  enabledOptionalRules?: string[];

  /** House rules (freeform text or structured JSON) */
  houseRules?: string | Record<string, unknown>;

  // -------------------------------------------------------------------------
  // Roster & Access
  // -------------------------------------------------------------------------

  /** Player user IDs (excluding GM) */
  playerIds: ID[];

  /** Campaign visibility */
  visibility: CampaignVisibility;

  /** Invite code for join-by-code (generated if visibility is "invite-only") */
  inviteCode?: string;

  /** Maximum number of players (null = unlimited) */
  maxPlayers?: number;

  // -------------------------------------------------------------------------
  // Metadata
  // -------------------------------------------------------------------------

  /** Campaign start date (first session) */
  startDate?: ISODateString;

  /** Campaign end date (if completed/archived) */
  endDate?: ISODateString;

  /** Campaign image/logo URL */
  imageUrl?: string;

  /** Tags/categories for discoverability */
  tags?: string[];

  /** GM-only notes */
  gmNotes?: string;

  createdAt: ISODateString;
  updatedAt: ISODateString;

  /** Extensible metadata */
  metadata?: Metadata;
}
```

### Campaign Membership Type

```typescript
/**
 * Player membership in a campaign
 */
export interface CampaignMembership {
  id: ID;
  campaignId: ID;
  userId: ID;
  role: "gm" | "player";
  joinedAt: ISODateString;
  status: "active" | "invited" | "left";
  /** Optional player-specific notes from GM */
  notes?: string;
}
```

---

## Components

### 1. CampaignsPage (Campaign List)

**Location:** `/app/campaigns/page.tsx`

**Responsibilities:**
- Fetch and display user's campaigns (as GM and player)
- Filter campaigns by status
- Search campaigns
- Create new campaign action
- Join campaign by code

**State:**
- `campaigns: Campaign[]` - All user's campaigns
- `filterStatus: CampaignStatus | "all"` - Current filter
- `searchQuery: string` - Search input
- `loading: boolean` - Loading state
- `error: string | null` - Error state

**Props:** None (server component or client with data fetching)

---

### 2. CampaignCard

**Location:** `/app/campaigns/components/CampaignCard.tsx`

**Description:** Individual campaign display card in list view.

**Features:**
- Campaign title and description preview
- Edition badge
- Gameplay level badge
- GM name
- Player count
- Campaign status indicator
- Role indicator (GM vs Player)
- Quick actions (View, Settings if GM)
- Campaign image (if available)

**Props:**
```typescript
interface CampaignCardProps {
  campaign: Campaign;
  userRole: "gm" | "player";
  playerCount: number;
  characterCount: number;
  onView: (campaignId: ID) => void;
  onSettings?: (campaignId: ID) => void;
}
```

---

### 3. CampaignDetailPage

**Location:** `/app/campaigns/[id]/page.tsx`

**Responsibilities:**
- Fetch and display campaign details
- Render appropriate tab content
- Handle user actions (join, leave, create character)
- Check user permissions (GM vs player)

**State:**
- `campaign: Campaign | null` - Campaign data
- `activeTab: CampaignTab` - Currently active tab
- `characters: Character[]` - Campaign characters
- `players: User[]` - Campaign players
- `userRole: "gm" | "player" | null` - Current user's role
- `loading: boolean` - Loading state

**Props:** None (route params provide campaign ID)

---

### 4. CampaignHeader

**Location:** `/app/campaigns/[id]/components/CampaignHeader.tsx`

**Description:** Campaign header with title, metadata, and actions.

**Features:**
- Campaign title and description
- Edition badge
- Gameplay level indicator
- GM name and avatar
- Player count and character count
- Status badge (active, paused, archived)
- Action buttons (context-aware):
  - GM: Settings, Invite Players, Archive
  - Player: Leave Campaign, Create Character
  - Non-member: Join Campaign (if public/invite)

**Props:**
```typescript
interface CampaignHeaderProps {
  campaign: Campaign;
  userRole: "gm" | "player" | null;
  playerCount: number;
  characterCount: number;
  onJoin?: () => void;
  onLeave?: () => void;
  onSettings?: () => void;
}
```

---

### 5. CampaignTabs

**Location:** `/app/campaigns/[id]/components/CampaignTabs.tsx`

**Description:** Tab navigation for campaign detail sections.

**Tabs:**
- **Overview** - Campaign info, ruleset summary, enabled books
- **Characters** - All characters in campaign (GM sees all, players see own)
- **Roster** - Player list with their characters (GM-only management)
- **Settings** - Campaign configuration (GM-only)

**Props:**
```typescript
interface CampaignTabsProps {
  activeTab: CampaignTab;
  onTabChange: (tab: CampaignTab) => void;
  userRole: "gm" | "player" | null;
}
```

---

### 6. CampaignOverviewTab

**Location:** `/app/campaigns/[id]/components/CampaignOverviewTab.tsx`

**Description:** Overview of campaign configuration and ruleset.

**Sections:**
- Campaign description
- Ruleset summary:
  - Edition name and version
  - Enabled books (expandable list)
  - Allowed creation methods
  - Gameplay level effects
  - Enabled optional rules
  - House rules (if any)
- Campaign statistics:
  - Start date
  - Number of sessions (future)
  - Total karma awarded (future)
- Recent activity (future)

**Props:**
```typescript
interface CampaignOverviewTabProps {
  campaign: Campaign;
  enabledBooks: Book[];
  creationMethods: CreationMethod[];
}
```

---

### 7. CampaignCharactersTab

**Location:** `/app/campaigns/[id]/components/CampaignCharactersTab.tsx`

**Description:** List of characters in the campaign.

**Features:**
- Character cards/list view
- Filter by player
- Search characters
- GM sees all characters
- Players see only their own characters
- Create character button (if player, links to creation with campaign pre-selected)
- Character status indicators (active, retired, deceased)

**Props:**
```typescript
interface CampaignCharactersTabProps {
  campaign: Campaign;
  characters: Character[];
  userRole: "gm" | "player";
  currentUserId: ID;
  onCreateCharacter: () => void;
}
```

---

### 8. CampaignRosterTab

**Location:** `/app/campaigns/[id]/components/CampaignRosterTab.tsx`

**Description:** Player roster management (GM-only).

**Features:**
- Player list with avatars
- Characters per player
- Player status (active, invited, left)
- Invite players (by email or invite code)
- Remove players (with confirmation)
- Player notes (GM-only)
- Invite code display and regeneration

**Props:**
```typescript
interface CampaignRosterTabProps {
  campaign: Campaign;
  players: User[];
  charactersByPlayer: Record<ID, Character[]>;
  onInvitePlayer: (email: string) => Promise<void>;
  onRemovePlayer: (userId: ID) => Promise<void>;
  onRegenerateInviteCode: () => Promise<void>;
}
```

---

### 9. CampaignSettingsTab

**Location:** `/app/campaigns/[id]/components/CampaignSettingsTab.tsx`

**Description:** Campaign configuration (GM-only).

**Sections:**
- Basic Info (title, description, image)
- Ruleset Configuration:
  - Edition (immutable after creation)
  - Enabled books (multi-select)
  - Allowed creation methods (multi-select)
  - Gameplay level (dropdown)
  - Optional rules (checkboxes)
  - House rules (textarea or JSON editor)
- Campaign Status (active, paused, archived)
- Visibility Settings (private, invite-only, public)
- Danger Zone (archive, delete campaign)

**Props:**
```typescript
interface CampaignSettingsTabProps {
  campaign: Campaign;
  allBooks: Book[];
  allCreationMethods: CreationMethod[];
  onUpdate: (updates: Partial<Campaign>) => Promise<void>;
  onArchive: () => Promise<void>;
  onDelete: () => Promise<void>;
}
```

---

### 10. CreateCampaignWizard

**Location:** `/app/campaigns/create/components/CreateCampaignWizard.tsx`

**Description:** Step-by-step wizard for creating a new campaign.

**Steps:**
1. **Basic Info** - Title, description, image
2. **Edition Selection** - Choose Shadowrun edition
3. **Ruleset Configuration** - Select books, creation methods, gameplay level
4. **Optional Rules** - Enable optional rules
5. **Visibility** - Set campaign visibility and invite settings
6. **Review** - Review all settings and create

**State:**
- `currentStep: number` - Current wizard step
- `formData: Partial<Campaign>` - Accumulated form data
- `validationErrors: Record<string, string>` - Form validation errors

**Props:**
```typescript
interface CreateCampaignWizardProps {
  onComplete: (campaign: Campaign) => void;
  onCancel: () => void;
}
```

---

## Data Requirements

### API Endpoints

#### 1. GET `/api/campaigns`

**Purpose:** List all campaigns the user is involved in (as GM or player)

**Query Parameters:**
- `status?: CampaignStatus` - Filter by status
- `role?: "gm" | "player"` - Filter by user's role
- `search?: string` - Search campaigns by title/description

**Response:**
```typescript
{
  success: boolean;
  campaigns: Campaign[];
  error?: string;
}
```

**Implementation:** New endpoint - query campaigns where `gmId = userId` OR `playerIds` contains `userId`

---

#### 2. GET `/api/campaigns/[id]`

**Purpose:** Get detailed campaign information

**Response:**
```typescript
{
  success: boolean;
  campaign: Campaign;
  userRole: "gm" | "player" | null;
  error?: string;
}
```

**Implementation:** New endpoint - return campaign and determine user's role

---

#### 3. POST `/api/campaigns`

**Purpose:** Create a new campaign

**Request:**
```typescript
{
  title: string;
  description?: string;
  editionCode: EditionCode;
  enabledBookIds: ID[];
  enabledCreationMethodIds: ID[];
  gameplayLevel: GameplayLevel;
  enabledOptionalRules?: string[];
  houseRules?: string | Record<string, unknown>;
  visibility: CampaignVisibility;
  maxPlayers?: number;
}
```

**Response:**
```typescript
{
  success: boolean;
  campaign?: Campaign;
  error?: string;
}
```

**Implementation:** New endpoint - create campaign, set `gmId` to current user, generate `inviteCode` if needed

**Validation:**
- Title required (3-100 characters)
- Edition code must be valid
- At least one enabled book (core rulebook)
- At least one enabled creation method
- Max players must be positive if specified

---

#### 4. PUT `/api/campaigns/[id]`

**Purpose:** Update campaign settings (GM-only)

**Request:**
```typescript
{
  title?: string;
  description?: string;
  enabledBookIds?: ID[];
  enabledCreationMethodIds?: ID[];
  gameplayLevel?: GameplayLevel;
  enabledOptionalRules?: string[];
  houseRules?: string | Record<string, unknown>;
  status?: CampaignStatus;
  visibility?: CampaignVisibility;
  maxPlayers?: number;
}
```

**Response:**
```typescript
{
  success: boolean;
  campaign?: Campaign;
  error?: string;
}
```

**Implementation:** New endpoint - verify user is GM, update allowed fields

**Restrictions:**
- `editionId` and `editionCode` are immutable after creation
- Cannot change edition once campaign has characters

---

#### 5. DELETE `/api/campaigns/[id]`

**Purpose:** Delete a campaign (GM-only)

**Request:** None (campaign ID from route)

**Response:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Implementation:** New endpoint - verify user is GM, optionally handle character associations

**Note:** Consider soft delete (set status to "archived") instead of hard delete

---

#### 6. POST `/api/campaigns/[id]/join`

**Purpose:** Join a campaign (by invite code or public join)

**Request:**
```typescript
{
  inviteCode?: string; // Required if campaign is invite-only
}
```

**Response:**
```typescript
{
  success: boolean;
  campaign?: Campaign;
  error?: string;
}
```

**Implementation:** New endpoint - verify invite code if needed, add user to `playerIds`, check `maxPlayers` limit

---

#### 7. POST `/api/campaigns/[id]/leave`

**Purpose:** Leave a campaign (player action)

**Request:** None

**Response:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Implementation:** New endpoint - remove user from `playerIds`, optionally handle character associations

---

#### 8. POST `/api/campaigns/[id]/players`

**Purpose:** Invite a player to the campaign (GM-only)

**Request:**
```typescript
{
  email: string; // User email to invite
}
```

**Response:**
```typescript
{
  success: boolean;
  player?: User;
  error?: string;
}
```

**Implementation:** New endpoint - find user by email, add to `playerIds` if not already member

---

#### 9. DELETE `/api/campaigns/[id]/players/[playerId]`

**Purpose:** Remove a player from the campaign (GM-only)

**Request:** None

**Response:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Implementation:** New endpoint - verify user is GM, remove player from `playerIds`

---

#### 10. GET `/api/campaigns/[id]/characters`

**Purpose:** Get all characters in a campaign

**Query Parameters:**
- `playerId?: ID` - Filter by player (for players, only their characters)

**Response:**
```typescript
{
  success: boolean;
  characters: Character[];
  error?: string;
}
```

**Implementation:** New endpoint - query characters where `campaignId = campaignId`, filter by player if specified and user is not GM

---

#### 11. GET `/api/campaigns/public`

**Purpose:** List public campaigns (for discovery)

**Query Parameters:**
- `editionCode?: EditionCode` - Filter by edition
- `search?: string` - Search by title/description
- `limit?: number` - Limit results (default: 20)
- `offset?: number` - Pagination offset

**Response:**
```typescript
{
  success: boolean;
  campaigns: Campaign[];
  total: number;
  error?: string;
}
```

**Implementation:** New endpoint - query campaigns where `visibility = "public"` and `status = "active"`

---

### Storage Layer

**File Structure:**
```
data/campaigns/
├── {campaignId}.json
└── {campaignId}.json
```

**Functions needed in `/lib/storage/campaigns.ts`:**

```typescript
// CRUD operations
export function createCampaign(campaign: Campaign): Campaign;
export function getCampaignById(campaignId: ID): Campaign | null;
export function updateCampaign(campaignId: ID, updates: Partial<Campaign>): Campaign;
export function deleteCampaign(campaignId: ID): void;

// Query operations
export function getCampaignsByUserId(userId: ID): Campaign[];
export function getCampaignsByGmId(gmId: ID): Campaign[];
export function getPublicCampaigns(filters?: PublicCampaignFilters): Campaign[];

// Membership operations
export function addPlayerToCampaign(campaignId: ID, userId: ID): Campaign;
export function removePlayerFromCampaign(campaignId: ID, userId: ID): Campaign;
export function isPlayerInCampaign(campaignId: ID, userId: ID): boolean;

// Character associations
export function getCampaignCharacters(campaignId: ID, userId?: ID): Character[];
export function getCharacterCountByCampaign(campaignId: ID): number;
```

---

## UI/UX Considerations

### Visual Design

- **Consistent with existing UI:** Follow Tailwind CSS patterns and dark mode support
- **Card-based layout:** Campaign cards with hover effects and clear hierarchy
- **Badge system:** Edition badges, gameplay level badges, status badges
- **Responsive design:** Mobile-first, adapts to tablet and desktop
- **Loading states:** Skeleton loaders for async content
- **Error handling:** User-friendly error messages with retry options

### Accessibility

- **Keyboard navigation:** Full keyboard support for all interactive elements
- **Screen readers:** Proper ARIA labels and semantic HTML
- **Focus management:** Clear focus indicators, proper tab order
- **Color contrast:** Meet WCAG AA standards
- **Form labels:** All inputs have associated labels

### User Flow - Creating a Campaign

1. User clicks "Create Campaign" button
2. Wizard opens with Basic Info step
3. User enters title and description
4. User selects edition (SR5, SR6, etc.)
5. System loads available books and creation methods for that edition
6. User selects enabled books and creation methods
7. User selects gameplay level
8. User enables optional rules (if desired)
9. User sets visibility and invite settings
10. User reviews all settings
11. Campaign is created
12. User is redirected to campaign detail page
13. Campaign shows in user's campaign list

### User Flow - Joining a Campaign

**Public Campaign:**
1. User browses public campaigns
2. User clicks "Join" on a campaign
3. User is added to campaign
4. User is redirected to campaign detail page

**Invite-Only Campaign:**
1. User receives invite code or link
2. User navigates to campaign join page with code
3. User enters invite code (if not in link)
4. User clicks "Join Campaign"
5. User is added to campaign
6. User is redirected to campaign detail page

### User Flow - Creating Character for Campaign

1. User navigates to campaign detail page
2. User clicks "Create Character for this Campaign"
3. System navigates to `/characters/create?campaignId={id}`
4. Character creation wizard loads with:
   - Campaign's edition pre-selected
   - Only campaign's enabled books available
   - Only campaign's allowed creation methods available
   - Campaign's gameplay level applied
5. User creates character following campaign rules
6. Character is created with `campaignId` set
7. User is redirected to character sheet
8. Character appears in campaign's character list

---

## Implementation Notes

### File Structure

```
app/campaigns/
├── page.tsx                                    # Campaign list page
├── create/
│   ├── page.tsx                                # Create campaign page
│   └── components/
│       ├── CreateCampaignWizard.tsx            # Main wizard
│       ├── BasicInfoStep.tsx                   # Step 1
│       ├── EditionSelectionStep.tsx            # Step 2
│       ├── RulesetConfigStep.tsx               # Step 3
│       ├── OptionalRulesStep.tsx               # Step 4
│       ├── VisibilityStep.tsx                  # Step 5
│       └── ReviewStep.tsx                      # Step 6
├── [id]/
│   ├── page.tsx                                # Campaign detail page
│   ├── settings/
│   │   └── page.tsx                            # Campaign settings page
│   └── components/
│       ├── CampaignHeader.tsx                  # Campaign header
│       ├── CampaignTabs.tsx                    # Tab navigation
│       ├── CampaignOverviewTab.tsx             # Overview tab
│       ├── CampaignCharactersTab.tsx           # Characters tab
│       ├── CampaignRosterTab.tsx               # Roster tab
│       └── CampaignSettingsTab.tsx             # Settings tab
└── components/
    ├── CampaignCard.tsx                        # Campaign list card
    ├── CampaignList.tsx                        # Campaign list container
    ├── JoinCampaignDialog.tsx                  # Join by code dialog
    └── CampaignInviteCode.tsx                  # Invite code display

lib/storage/
└── campaigns.ts                                # Campaign storage layer

lib/types/
└── campaign.ts                                 # Campaign type definitions

app/api/campaigns/
├── route.ts                                    # GET, POST /api/campaigns
├── [id]/
│   ├── route.ts                                # GET, PUT, DELETE /api/campaigns/[id]
│   ├── join/
│   │   └── route.ts                            # POST /api/campaigns/[id]/join
│   ├── leave/
│   │   └── route.ts                            # POST /api/campaigns/[id]/leave
│   ├── characters/
│   │   └── route.ts                            # GET /api/campaigns/[id]/characters
│   └── players/
│       ├── route.ts                            # POST /api/campaigns/[id]/players
│       └── [playerId]/
│           └── route.ts                        # DELETE /api/campaigns/[id]/players/[playerId]
└── public/
    └── route.ts                                # GET /api/campaigns/public
```

### Dependencies

- **Existing:**
  - `@/lib/types` - Type definitions (extend with Campaign types)
  - `@/lib/storage` - Storage layer (add campaigns.ts)
  - `@/lib/auth` - Authentication utilities
  - `@/lib/rules` - Ruleset loading (for campaign ruleset configuration)
  - `react-aria-components` - UI components
  - `next/navigation` - Routing

- **New:**
  - Campaign type definitions in `/lib/types/campaign.ts`
  - Campaign storage layer in `/lib/storage/campaigns.ts`

### State Management

- **Client-side state:** React `useState` for UI state (tabs, filters, form data)
- **Server data:** Fetch via API routes
- **Campaign context:** Consider React Context for campaign data shared across campaign pages (future)

### Character Creation Integration

**Update Character Creation Wizard:**
- Accept `campaignId` query parameter
- Load campaign ruleset configuration
- Filter edition/books/methods based on campaign
- Apply gameplay level modifications
- Set `campaignId` on created character

**Files to modify:**
- `/app/characters/create/page.tsx` - Accept campaignId param
- `/app/characters/create/components/EditionSelector.tsx` - Pre-select campaign edition
- `/app/characters/create/components/CreationWizard.tsx` - Apply campaign constraints

### Validation Rules

**Campaign Creation:**
- Title: 3-100 characters, required
- Edition: Must be valid edition code
- Enabled books: Must include core rulebook
- Creation methods: At least one required
- Gameplay level: Must be valid level

**Campaign Updates:**
- Edition cannot be changed if campaign has characters
- Cannot remove required creation methods if characters use them
- Cannot remove core rulebook
- Max players must be >= current player count

**Character Creation (with campaign):**
- Character edition must match campaign edition
- Character must use allowed creation method
- Character must only use enabled books
- Character must comply with gameplay level restrictions

---

## Acceptance Criteria

### MVP (Minimum Viable Product)

- [x] GM can create a campaign with edition, books, creation methods, and gameplay level
- [x] Campaign list page shows user's campaigns (as GM and player)
- [x] Campaign detail page displays campaign information
- [ ] GM can invite players by email
- [x] Players can join campaigns via invite code
- [x] Players can create characters for a campaign (campaign constraints applied)
- [x] Campaign characters tab shows all characters (GM) or own characters (player)
- [x] Campaign roster tab shows player list (GM-only)
- [ ] Campaign settings tab allows GM to update campaign configuration
- [x] Campaign ruleset configuration affects character creation wizard
- [x] All forms have proper validation
- [x] Success and error messages display appropriately
- [x] Page is responsive (mobile, tablet, desktop)
- [x] Dark mode support
- [ ] Accessibility: keyboard navigation, screen reader support

### Enhanced Features (Future)

- [ ] Public campaign discovery and browsing
- [ ] Campaign search and filtering
- [ ] Campaign tags and categories
- [ ] Campaign image/logo upload
- [ ] Campaign start/end date tracking
- [ ] Campaign statistics dashboard
- [ ] Export campaign data (characters, notes)
- [ ] Campaign templates (save common configurations)
- [x] Campaign notes and journal entries *(Phase 3 complete)*
- [x] Session tracking and scheduling *(Phase 3 complete)*
- [ ] Campaign-specific dice roller
- [ ] Campaign announcements/bulletin board
- [x] Character approval workflow (GM approves characters) *(Phase 3 complete)*
- [ ] Campaign calendar integration

---

## Security Considerations

### Access Control

- **Campaign Creation:** Any authenticated user can create campaigns
- **Campaign Settings:** Only GM can modify campaign settings
- **Campaign Deletion:** Only GM can delete campaign (with confirmation)
- **Player Management:** Only GM can invite/remove players
- **Character Viewing:** GM sees all characters, players see only own characters
- **Campaign Data:** Players can view campaign ruleset but not GM notes

### Invite Code Security

- Invite codes should be cryptographically random (UUID or similar)
- Invite codes should be long enough to prevent brute force (8+ characters)
- Consider expiring invite codes (future)
- Regenerating invite code should invalidate old code

### Data Validation

- Validate all user inputs server-side
- Sanitize campaign descriptions and house rules
- Validate edition codes and book IDs
- Validate creation method IDs
- Enforce max players limit

---

## Future Enhancements

### Phase 2: Advanced Campaign Features *(COMPLETED)*

- [x] Campaign detail page refactored with tabbed interface
- [x] Campaign characters API and tab
- [x] Campaign roster management (remove player, regenerate code)
- [x] Character creation integration with campaigns

### Phase 3: Campaign Management Features *(COMPLETED)*

- [x] Campaign notes and journal system
- [x] Session tracking and scheduling
- [x] Character approval workflow

### Phase 3: Multi-Campaign Management

- Campaign tags and categories
- Campaign search and discovery
- Campaign recommendations
- Campaign activity feed
- Campaign comparison tools

### Phase 4: Campaign Content

- Campaign-specific NPCs and locations (see [NPCs/Grunts Specification](/docs/specifications/npcs_grunts_specification.md) and [Locations Specification](/docs/specifications/locations_specification.md))
- Mission/adventure tracking
- Campaign maps and handouts
- Campaign-specific house rules automation
- Integration with adventure modules

### Phase 5: Social Features

- Campaign forums/discussion boards
- Campaign chat integration
- Player ratings and reviews
- Campaign sharing and cloning
- Campaign export/import

---

## Related Documentation

- **Architecture:** `/docs/architecture/architecture-overview.md`
- **Character Creation:** `/docs/architecture/character_creation_framework.md`
- **Ruleset System:** `/docs/architecture/ruleset_architecture_and_source_material_system.md`
- **Edition Support:** `/docs/architecture/edition_support_and_ruleset_architecture.md`
- **Rules Reference:** `/docs/rules/reference.md` (Campaign Configuration section)
- **NPCs/Grunts:** `/docs/specifications/npcs_grunts_specification.md`
- **Locations:** `/docs/specifications/locations_specification.md`

---

## Open Questions

1. **Edition Immutability:** Should campaigns allow edition changes if no characters exist yet?
   - **Recommendation:** Allow edition change only if campaign has zero characters

2. **Character Association:** What happens to characters when a player leaves a campaign?
   - **Recommendation:** Characters remain associated with campaign but player loses access (or allow GM to transfer ownership)

3. **Campaign Deletion:** Should deleting a campaign delete associated characters?
   - **Recommendation:** No - unlink characters from campaign (set `campaignId` to null) but preserve characters

4. **Invite Code Expiration:** Should invite codes expire after a certain time?
   - **Recommendation:** Phase 2 feature - start with permanent codes, add expiration later

5. **Max Players Enforcement:** What happens if max players is set lower than current player count?
   - **Recommendation:** Prevent reducing max players below current count, or require removing players first

6. **Character Validation:** Should system validate existing characters when campaign rules change?
   - **Recommendation:** Phase 2 feature - start with validation only at character creation, add validation checks later

7. **House Rules Format:** Should house rules be freeform text or structured JSON?
   - **Recommendation:** Start with freeform text, add structured format in Phase 2 for automation

8. **Campaign Visibility:** Should "public" campaigns be searchable by anyone or require login?
   - **Recommendation:** Require login for discovery, but allow unauthenticated users to see public campaign details if they have link

9. **Gameplay Level Changes:** Can GM change gameplay level after campaign has characters?
   - **Recommendation:** Allow with warning that it may affect character validity, add validation checks

10. **Multiple Campaigns per Character:** Can a character belong to multiple campaigns?
    - **Recommendation:** No - one character per campaign (character `campaignId` is single value, not array)

---

## Implementation Priority

**Priority:** High  
**Estimated Effort:** 7-10 days  
**Dependencies:**
- Campaign type definitions
- Campaign storage layer
- Campaign API endpoints
- Character creation wizard updates (campaign integration)
- Campaign UI components

**Blockers:** None (all infrastructure exists, need to add campaign-specific code)

This feature is critical for multiplayer Shadowrun sessions and enables the GM control requirements specified in the character creation framework. It provides the foundation for campaign-based character validation and ruleset enforcement.

---

## Notes

- Campaign support is essential for the multi-edition, book-driven ruleset system
- Campaigns act as the "ruleset selector" for character creation, ensuring consistency across players
- This feature enables future gameplay features like campaign-specific dice rolling, session tracking, and adventure modules
- Consider adding campaign analytics to understand usage patterns (future)
- Integration with identity/lifestyle system (future): Campaigns could track SIN and lifestyle management across characters
- Integration with gameplay features (future): Campaigns could track combat sessions, karma awards, and game events

