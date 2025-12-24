> [!NOTE]
> This implementation guide is governed by the [Capability (character.management.md)](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/character.management.md).

# Character Creation and Management Specification

**Last Updated:** 2025-01-27  
**Status:** Specification  
**Category:** Core Functionality, Character Management, Ruleset Integration  
**Affected Editions:** All editions (edition-aware implementation)

---

## Overview

Character creation and management is the core functionality of Shadow Master, enabling users to create, view, edit, and manage Shadowrun characters. The system uses a wizard-based, step-by-step character creation process that is dynamically driven by the selected edition's ruleset and creation method. Characters progress through multiple statuses (draft, active, retired, deceased) throughout their lifecycle.

**Key Features:**
- Edition-aware character creation (SR5, SR6, etc.)
- Creation method support (Priority, Point Buy, Karma, etc.)
- Step-by-step wizard with live validation
- Auto-save functionality for draft recovery
- Character list with filtering and search
- Character sheet view with comprehensive stats display
- Character editing (draft status only)
- Character deletion
- Integration with campaign system
- Ruleset-driven validation

---


## Page Structure

### Routes

#### Character List Page
- **Path:** `/app/characters/page.tsx`
- **Layout:** Uses `AuthenticatedLayout` (inherits sidebar navigation)
- **Authentication:** Required (protected route)
- **Description:** Lists all user's characters with filtering, search, and sorting

#### Character Creation Page
- **Path:** `/app/characters/create/page.tsx`
- **Layout:** Uses `AuthenticatedLayout`
- **Authentication:** Required (protected route)
- **Description:** Character creation wizard entry point with edition selection

#### Character Detail/Sheet Page
- **Path:** `/app/characters/[id]/page.tsx`
- **Layout:** Uses `AuthenticatedLayout`
- **Authentication:** Required (protected route)
- **Description:** Detailed character sheet view

#### Character Edit Page (Draft Only)
- **Path:** `/app/characters/[id]/edit/page.tsx`
- **Layout:** Uses `AuthenticatedLayout`
- **Authentication:** Required (protected route)
- **Description:** Resume character creation wizard for draft characters

---

## Character Creation Flow

### High-Level Flow

```
1. User navigates to /characters/create
2. User selects edition (EditionSelector)
3. System loads ruleset for selected edition
4. CreationWizard initializes with creation method
5. User progresses through steps:
   - Priority selection (if Priority method)
   - Metatype selection
   - Attribute allocation
   - Magic/Resonance selection
   - Skills allocation
   - Qualities selection
   - Contacts
   - Gear/Equipment
   - Vehicles (optional)
   - Programs (optional)
   - Spells (optional, if mage)
   - Rituals (optional)
   - Adept Powers (optional, if adept)
   - Karma spending
   - Identities & Lifestyles
   - Review & Finalize
6. System validates character at each step
7. Character is auto-saved as draft during creation
8. On finalization, character status changes to "active"
9. User is redirected to character sheet
```

### Creation Steps (SR5 Priority Method Example)

The creation steps are dynamically loaded from the ruleset's creation method definition. For SR5 Priority, typical steps include:

1. **Priority Selection** - Assign priorities (A-E) to metatype, attributes, skills, magic, resources
2. **Metatype Selection** - Choose metatype based on priority assignment
3. **Attributes** - Allocate attribute points based on priority
4. **Magic/Resonance** - Choose magical path (mundane, mage, adept, technomancer) if magic priority selected
5. **Skills** - Allocate skill points and skill group points based on priority
6. **Qualities** - Select positive and negative qualities
7. **Contacts** - Allocate contact points
8. **Gear** - Purchase equipment with resources budget
9. **Vehicles** - Purchase vehicles (optional)
10. **Programs** - Purchase matrix programs (optional)
11. **Spells** - Select spells (if mage)
12. **Rituals** - Select rituals (optional)
13. **Adept Powers** - Select adept powers (if adept)
14. **Karma** - Spend remaining karma
15. **Identities & Lifestyles** - Configure SINs and lifestyles
16. **Review** - Review all selections and finalize

**Note:** Steps may vary by edition and creation method. The wizard dynamically adapts based on the loaded ruleset.

---

## Components

### 1. Character List Page

**Location:** `/app/characters/page.tsx`

**Responsibilities:**
- Fetch and display user's characters
- Provide filtering by status
- Provide search functionality
- Provide sorting options
- Support grid and list view modes
- Handle character deletion
- Display empty state when no characters
- Navigate to character creation

**State:**
- `characters: Character[]` - All user's characters
- `loading: boolean` - Loading state
- `error: string | null` - Error state
- `activeFilter: CharacterStatus | "all"` - Current status filter
- `searchQuery: string` - Search input
- `sortBy: SortOption` - Current sort option
- `viewMode: "grid" | "list"` - Current view mode

**Filters:**
- **All** - Show all characters
- **Active** - Show active characters (status: "active")
- **Drafts** - Show draft characters (status: "draft")
- **Retired** - Show retired characters (status: "retired")
- **Deceased** - Show deceased characters (status: "deceased")

**Sort Options:**
- **Recently Updated** - Sort by `updatedAt` (default)
- **Recently Created** - Sort by `createdAt`
- **Name (A-Z)** - Alphabetical by name
- **Karma (High-Low)** - Sort by current karma

---

### 2. CharacterCard

**Location:** `/app/characters/page.tsx` (component)

**Description:** Individual character display card in list/grid view.

**Features:**
- Character name and metatype
- Status badge
- Edition code badge
- Quick stats (karma, nuyen, essence)
- Magical path indicator (if applicable)
- Last updated date
- Delete button (on hover)
- Click to navigate to character sheet or edit page (if draft)

**Props:**
```typescript
interface CharacterCardProps {
  character: Character;
  onDelete: (id: string) => void;
  viewMode?: "grid" | "list";
}
```

---

### 3. EditionSelector

**Location:** `/app/characters/create/components/EditionSelector.tsx`

**Description:** Initial step for selecting Shadowrun edition.

**Features:**
- Display available editions as cards
- Show edition metadata (name, year, description)
- Handle edition selection
- Trigger ruleset loading on selection

**Props:**
```typescript
interface EditionSelectorProps {
  onSelect: (editionCode: EditionCode) => Promise<void>;
}
```

---

### 4. CreationWizard

**Location:** `/app/characters/create/components/CreationWizard.tsx`

**Description:** Main orchestrator for character creation wizard.

**Responsibilities:**
- Manage creation state (step progression, selections, budgets)
- Coordinate step rendering
- Handle navigation (next, previous, jump to step)
- Auto-save draft state
- Validate character at each step
- Finalize character creation
- Handle cancellation

**State:**
- `state: CreationState` - Complete creation state
- `characterId: ID | undefined` - Character ID (for draft recovery)
- `isSaving: boolean` - Save operation state
- `saveError: string | null` - Save error state
- `isSidebarCollapsed: boolean` - UI state

**Props:**
```typescript
interface CreationWizardProps {
  characterId?: ID; // For resuming draft
  initialState?: CreationState; // For draft recovery
  onCancel: () => void;
  onComplete: (characterId: ID) => void;
}
```

---

### 5. StepperSidebar

**Location:** `/app/characters/create/components/StepperSidebar.tsx`

**Description:** Sidebar navigation showing all steps and progress.

**Features:**
- List all creation steps
- Show step completion status
- Highlight current step
- Allow clicking to jump to completed steps
- Show step icons/indicators
- Collapsible sidebar

**Props:**
```typescript
interface StepperSidebarProps {
  steps: CreationStep[];
  currentStepIndex: number;
  completedSteps: number[];
  onStepClick: (stepIndex: number) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}
```

---

### 6. ValidationPanel

**Location:** `/app/characters/create/components/ValidationPanel.tsx`

**Description:** Panel displaying validation errors and warnings.

**Features:**
- Display validation errors (blocking)
- Display validation warnings (non-blocking)
- Show budget summaries
- Show remaining points/resources
- Color-coded (errors: red, warnings: amber)

**Props:**
```typescript
interface ValidationPanelProps {
  errors: ValidationError[];
  warnings: ValidationError[];
  budgets: Record<string, number>;
  budgetValues: Record<string, number>;
}
```

---

### 7. Step Components

**Location:** `/app/characters/create/components/steps/`

Each step is a self-contained component that handles its specific part of character creation:

- **PriorityStep** - Priority table assignment
- **MetatypeStep** - Metatype selection
- **AttributesStep** - Attribute allocation
- **MagicStep** - Magical path selection
- **SkillsStep** - Skill allocation (active, knowledge, languages)
- **QualitiesStep** - Quality selection
- **ContactsStep** - Contact allocation
- **GearStep** - Equipment shopping
- **VehiclesStep** - Vehicle selection
- **ProgramsStep** - Matrix program selection
- **SpellsStep** - Spell selection (mages)
- **RitualsStep** - Ritual selection
- **AdeptPowersStep** - Adept power selection
- **KarmaStep** - Karma spending
- **IdentitiesStep** - SIN and lifestyle configuration
- **ReviewStep** - Final review and character name

**Common Step Props:**
```typescript
interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}
```

---

### 8. CharacterSheet (Character Detail Page)

**Location:** `/app/characters/[id]/page.tsx`

**Description:** Comprehensive character sheet view.

**Sections:**
- **Character Header** - Name, metatype, magical path, status, quick stats
- **Attributes** - Core attributes display
- **Derived Stats** - Physical/Mental/Social limits, initiative
- **Condition Monitors** - Physical and stun damage tracking
- **Skills** - Active skills with ratings
- **Knowledge Skills** - Knowledge and language skills
- **Qualities** - Positive and negative qualities
- **Gear** - Equipment list
- **Contacts** - Contact information
- **Lifestyles** - Lifestyle details and costs

**Features:**
- Dice roller integration
- Edit button (for draft characters only)
- Navigation back to character list
- Responsive layout (mobile, tablet, desktop)
- Dark mode support

---

### 9. Character Edit Page

**Location:** `/app/characters/[id]/edit/page.tsx`

**Description:** Resume character creation for draft characters.

**Features:**
- Load draft character state
- Reinitialize CreationWizard with saved state
- Allow continuing from where user left off
- Same wizard experience as new character creation

---

## Data Model

### Character Type

See `/lib/types/character.ts` for complete type definition. Key fields:

```typescript
interface Character {
  id: ID;
  ownerId: ID;
  editionId: ID;
  editionCode: EditionCode;
  creationMethodId: ID;
  creationMethodVersion?: string;
  rulesetSnapshotId?: ID;
  attachedBookIds: ID[];
  campaignId?: ID; // Optional campaign association
  
  name: string;
  metatype: string;
  status: CharacterStatus; // "draft" | "active" | "retired" | "deceased"
  
  attributes: Record<string, number>;
  specialAttributes: {
    edge: number;
    essence: number;
    magic?: number;
    resonance?: number;
  };
  
  skills: Record<string, number>;
  knowledgeSkills?: KnowledgeSkill[];
  languages?: LanguageSkill[];
  
  positiveQualities: string[];
  negativeQualities: string[];
  
  magicalPath: MagicalPath;
  tradition?: string;
  spells?: string[];
  adeptPowers?: AdeptPower[];
  
  gear: GearItem[];
  vehicles?: Vehicle[];
  contacts: Contact[];
  identities?: Identity[];
  lifestyles?: Lifestyle[];
  
  nuyen: number;
  startingNuyen: number;
  
  karmaTotal: number;
  karmaCurrent: number;
  karmaSpentAtCreation: number;
  
  derivedStats: Record<string, number>;
  condition: {
    physicalDamage: number;
    stunDamage: number;
    overflowDamage?: number;
  };
  
  createdAt: ISODateString;
  updatedAt?: ISODateString;
}
```

### CreationState Type

```typescript
interface CreationState {
  characterId: ID;
  creationMethodId: ID;
  currentStep: number;
  completedSteps: number[];
  budgets: Record<string, number>; // Budget allocations (spent)
  selections: Record<string, unknown>; // User selections
  priorities?: Record<string, string>; // Priority assignments (if Priority method)
  errors: ValidationError[];
  warnings: ValidationError[];
  updatedAt: ISODateString;
}
```

### CharacterStatus Type

```typescript
type CharacterStatus =
  | "draft"    // Still being created
  | "active"   // Playable character
  | "retired"  // No longer in active play
  | "deceased"; // Character died in game
```

---

## Data Requirements

### API Endpoints

#### 1. GET `/api/characters`

**Purpose:** List all characters for the authenticated user

**Query Parameters:**
- `status?: CharacterStatus` - Filter by status
- `campaignId?: ID` - Filter by campaign (future)

**Response:**
```typescript
{
  success: boolean;
  characters: Character[];
  error?: string;
}
```

**Implementation:** Query characters where `ownerId = userId`, optionally filter by status

---

#### 2. GET `/api/characters/[id]`

**Purpose:** Get detailed character information

**Response:**
```typescript
{
  success: boolean;
  character?: Character;
  error?: string;
}
```

**Security:** Verify `character.ownerId === userId`

---

#### 3. POST `/api/characters`

**Purpose:** Create a new character draft

**Request:**
```typescript
{
  editionId: ID;
  editionCode: EditionCode;
  creationMethodId: ID;
  name?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  character?: Character;
  error?: string;
}
```

**Implementation:** Creates draft character with minimal fields, sets status to "draft"

---

#### 4. PUT `/api/characters/[id]`

**Purpose:** Update a character (draft or active)

**Request:**
```typescript
{
  character: Partial<Character>;
}
```

**Response:**
```typescript
{
  success: boolean;
  character?: Character;
  error?: string;
}
```

**Security:** Verify `character.ownerId === userId`
**Validation:** Validate character against ruleset (if status is "active", stricter validation)

---

#### 5. DELETE `/api/characters/[id]`

**Purpose:** Delete a character

**Request:** None (character ID from route)

**Response:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Security:** Verify `character.ownerId === userId`
**Implementation:** Deletes character file from storage

---

#### 6. POST `/api/characters/[id]/finalize`

**Purpose:** Finalize a draft character (change status to "active")

**Request:**
```typescript
{
  character: Character; // Complete character data
  characterName?: string; // Override name if provided
}
```

**Response:**
```typescript
{
  success: boolean;
  character?: Character;
  error?: string;
}
```

**Security:** Verify `character.ownerId === userId` and `character.status === "draft"`
**Validation:** Full character validation against ruleset
**Implementation:** Updates character with final data, changes status to "active", validates character is complete

---

### Storage Layer

**File Structure:**
```
data/characters/
├── {userId}/
│   ├── {characterId}.json
│   └── {characterId}.json
```

**Functions in `/lib/storage/characters.ts`:**

```typescript
// CRUD operations
export function createCharacterDraft(...): Promise<CharacterDraft>;
export function getCharacterById(userId: ID, characterId: ID): Promise<Character | null>;
export function updateCharacter(userId: ID, characterId: ID, updates: Partial<Character>): Promise<Character>;
export function deleteCharacter(userId: ID, characterId: ID): Promise<void>;

// Query operations
export function getUserCharacters(userId: ID): Promise<Character[]>;
export function getCharactersByCampaign(userId: ID, campaignId: ID): Promise<Character[]>;

// Character operations
export function finalizeCharacter(userId: ID, characterId: ID, characterData: Character): Promise<Character>;
export function awardKarma(userId: ID, characterId: ID, amount: number): Promise<Character>;
export function applyDamage(userId: ID, characterId: ID, damage: Damage): Promise<Character>;
export function setCharacterCampaign(userId: ID, characterId: ID, campaignId: ID | null): Promise<Character>;
export function retireCharacter(userId: ID, characterId: ID): Promise<Character>;
```

---

## Auto-Save and Draft Management

### Auto-Save Behavior

**Current Implementation:**
- Creation state is auto-saved to localStorage during wizard progression
- Character draft is created via API on first save
- Subsequent changes update the draft via API
- Auto-save is debounced (e.g., 2 seconds after last change)

**Auto-Save Triggers:**
- Any state update in CreationWizard
- Step navigation
- Form field changes
- Budget allocations
- Selections made

**Draft Recovery:**
- When user returns to character creation, system checks for existing draft
- Draft can be loaded from API or localStorage
- User can resume from where they left off

**Limitations:**
- Drafts are stored per user (no cross-device sync without server-side storage)
- Drafts expire after extended inactivity (future enhancement)

---

## Validation

### Validation Levels

#### 1. Client-Side Validation (Real-Time)

**Purpose:** Immediate feedback, better UX

**Validation Points:**
- Budget constraints (points remaining)
- Required field completion
- Step completion requirements
- Value ranges (e.g., attributes 1-6)

**Display:**
- Inline error messages
- Budget indicators
- Step completion status
- Validation panel

#### 2. Server-Side Validation (On Save/Finalize)

**Purpose:** Security, data integrity, rules enforcement

**Validation Checks:**
- Budget constraints (all budgets spent correctly)
- Required fields present
- Value ranges valid
- Creation method rules followed
- Edition-specific rules enforced
- Book availability rules (if campaign-linked)

**Response:**
- Return validation errors if invalid
- Reject save/finalize if critical errors
- Allow warnings but proceed if non-critical

#### 3. Final Validation (On Character Finalization)

**Purpose:** Ensure character is playable and rule-compliant

**Checks:**
- All required steps completed
- All budgets fully allocated
- Character name provided
- No critical rule violations
- Derived stats calculable

---

## UI/UX Considerations

### Visual Design

- **Consistent with existing UI:** Follow Tailwind CSS patterns and dark mode support
- **Wizard layout:** Sidebar navigation + main content area
- **Step indicators:** Clear visual indication of current step, completed steps, remaining steps
- **Budget displays:** Always visible budget summaries and remaining points
- **Validation feedback:** Clear error and warning displays
- **Responsive design:** Mobile-first, adapts to tablet and desktop
- **Loading states:** Skeleton loaders for async operations
- **Error handling:** User-friendly error messages with recovery options

### Accessibility

- **Keyboard navigation:** Full keyboard support for wizard navigation
- **Screen readers:** Proper ARIA labels and semantic HTML
- **Focus management:** Clear focus indicators, logical tab order
- **Form labels:** All inputs have associated labels
- **Error announcements:** ARIA live regions for validation errors
- **Color contrast:** Meet WCAG AA standards

### User Experience

#### Character Creation

- **Progressive disclosure:** Show only relevant steps based on selections
- **Back navigation:** Allow returning to previous steps
- **Step jumping:** Allow clicking completed steps to revisit
- **Auto-save feedback:** Subtle indicator when auto-save occurs
- **Validation feedback:** Real-time validation with clear error messages
- **Budget tracking:** Always visible budget summaries
- **Help text:** Tooltips and help text for complex rules

#### Character List

- **Quick scanning:** Key information visible at a glance
- **Filtering:** Easy status filtering
- **Search:** Fast search with clear results
- **Sorting:** Multiple sort options for different use cases
- **View modes:** Grid for visual browsing, list for detailed scanning
- **Empty states:** Helpful empty states with clear calls to action

#### Character Sheet

- **Information hierarchy:** Most important information prominently displayed
- **Section organization:** Logical grouping of related information
- **Quick stats:** Key stats (karma, nuyen, essence) always visible
- **Condition tracking:** Clear visual representation of damage
- **Navigation:** Easy navigation back to character list
- **Actions:** Contextual actions (edit, delete, etc.) easily accessible

---

## Implementation Notes

### File Structure

```
app/characters/
├── page.tsx                                    # Character list page
├── create/
│   ├── page.tsx                                # Character creation entry
│   └── components/
│       ├── CreationWizard.tsx                  # Main wizard orchestrator
│       ├── EditionSelector.tsx                 # Edition selection
│       ├── StepperSidebar.tsx                  # Step navigation
│       ├── ValidationPanel.tsx                 # Validation display
│       ├── IdentityEditor.tsx                  # Identity/SIN editor
│       ├── LifestyleEditor.tsx                 # Lifestyle editor
│       └── steps/
│           ├── PriorityStep.tsx
│           ├── MetatypeStep.tsx
│           ├── AttributesStep.tsx
│           ├── MagicStep.tsx
│           ├── SkillsStep.tsx
│           ├── QualitiesStep.tsx
│           ├── ContactsStep.tsx
│           ├── GearStep.tsx
│           ├── VehiclesStep.tsx
│           ├── ProgramsStep.tsx
│           ├── SpellsStep.tsx
│           ├── RitualsStep.tsx
│           ├── AdeptPowersStep.tsx
│           ├── KarmaStep.tsx
│           ├── IdentitiesStep.tsx
│           └── ReviewStep.tsx
├── [id]/
│   ├── page.tsx                                # Character sheet
│   └── edit/
│       └── page.tsx                            # Resume creation (draft)

lib/
├── storage/
│   └── characters.ts                           # Character storage layer
└── types/
    ├── character.ts                            # Character type definitions
    └── creation.ts                             # Creation state types

app/api/characters/
├── route.ts                                    # GET, POST /api/characters
└── [id]/
    ├── route.ts                                # GET, PUT, DELETE /api/characters/[id]
    └── finalize/
        └── route.ts                            # POST /api/characters/[id]/finalize
```

### Dependencies

- **Existing:**
  - `@/lib/types` - Type definitions
  - `@/lib/storage/characters` - Character storage
  - `@/lib/rules` - Ruleset loading and context
  - `react-aria-components` - UI components
  - `next/navigation` - Routing

### State Management

- **Creation state:** React `useState` in CreationWizard, persisted via auto-save
- **Character list:** React `useState` with API fetching
- **Ruleset state:** React Context via RulesetProvider
- **Draft state:** localStorage for client-side persistence, API for server-side

### Integration Points

#### Ruleset Integration

- Character creation loads ruleset based on selected edition
- Steps are dynamically generated from creation method definition
- Validation uses ruleset constraints
- Character stores `rulesetSnapshotId` for future validation

#### Campaign Integration

- Characters can be linked to campaigns via `campaignId`
- Campaign rules constrain character creation (enabled books, creation methods)
- Character creation wizard respects campaign constraints

---


## Related Documentation

- **Character Creation Framework:** `/docs/architecture/character_creation_framework.md`
- **Ruleset Architecture:** `/docs/architecture/ruleset_architecture_and_source_material_system.md`
- **Edition Support:** `/docs/architecture/edition_support_and_ruleset_architecture.md`
- **Campaign Support:** `/docs/specifications/campaign_support_specification.md`

---

## Open Questions

1. **Draft Expiration:** Should drafts expire after a certain period of inactivity?
   - **Recommendation:** Phase 2 feature - start with persistent drafts, add expiration later

2. **Character Versioning:** Should we track character history/versions?
   - **Recommendation:** Phase 2 feature - useful for tracking changes and recovery

3. **Character Templates:** Should users be able to save characters as templates?
   - **Recommendation:** Phase 3 feature - useful for creating similar characters

4. **Cross-Device Sync:** How should drafts sync across devices?
   - **Recommendation:** Server-side auto-save already supports this, ensure it's reliable

5. **Character Sharing:** Should users be able to share characters with others?
   - **Recommendation:** Phase 2 feature - useful for GMs reviewing characters

6. **Character Validation on Edit:** Should active characters be editable, or should editing create a new version?
   - **Recommendation:** Keep current approach (drafts editable, active characters view-only) for data integrity

7. **Bulk Operations:** Should users be able to perform bulk actions (delete multiple, export multiple)?
   - **Recommendation:** Phase 2 feature - useful for power users

8. **Character Search:** Should search be full-text across all fields or limited to specific fields?
   - **Recommendation:** Start with name/metatype/path search, expand to full-text in Phase 2

9. **Character Images:** Should characters support custom images/avatars?
   - **Recommendation:** Phase 3 feature - nice to have, not critical

10. **Print-Friendly Sheets:** Should character sheets have a print-optimized layout?
    - **Recommendation:** Phase 2 feature - useful for tabletop play

---

## Implementation Priority

**Priority:** Critical (Core functionality)  
**Current Status:** ✅ Basic implementation complete, ongoing enhancements

**Recent Enhancements:**
- Auto-save to server (not just localStorage)
- Draft recovery and resume
- Comprehensive character sheet
- Improved character list with filtering and search

**Future Enhancements (Priority Order):**

1. **Character Export/Import** (High Priority)
   - Export character as JSON
   - Import character from JSON
   - Useful for backup and migration
   - Estimated effort: 2-3 days

2. **Character Templates** (Medium Priority)
   - Save character as template
   - Create character from template
   - Useful for creating similar characters
   - Estimated effort: 3-4 days

3. **Character Versioning** (Medium Priority)
   - Track character change history
   - Revert to previous versions
   - Useful for tracking advancement
   - Estimated effort: 4-5 days

4. **Print-Friendly Sheets** (Medium Priority)
   - Optimized layout for printing
   - PDF export option
   - Useful for tabletop play
   - Estimated effort: 2-3 days

5. **Character Sharing** (Low Priority)
   - Share characters with other users
   - Permission-based access
   - Useful for GM review
   - Estimated effort: 3-4 days

---

## Notes

- Character creation is the most complex feature in the application, involving dynamic ruleset loading, multi-step wizards, validation, and state management
- The wizard-based approach provides clear guidance for users new to Shadowrun character creation
- Auto-save is critical for preventing data loss during long character creation sessions
- Character validation ensures rule compliance and data integrity
- The system is designed to support multiple editions and creation methods through the ruleset system
- Character status management enables character lifecycle tracking (creation → play → retirement/death)
- Integration with campaigns (future) will add campaign-specific constraints and validation

