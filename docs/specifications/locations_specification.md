# Locations Specification

**Last Updated:** 2025-12-17  
**Status:** Implemented  
**Category:** Campaign Content, World Building, Reference Management  
**Affected Editions:** All editions (location concepts are edition-agnostic)

---

## Overview

This document specifies the implementation requirements for supporting **Locations** in Shadow Master. Locations represent places within a Shadowrun campaign world, including physical locations, Matrix hosts, astral spaces, and other significant places that characters may visit, interact with, or reference during gameplay.

**Key Features:**
- Campaign-specific location management
- Multiple location types (physical, Matrix, astral, etc.)
- Location hierarchies and relationships
- Rich metadata (description, images, notes, connections)
- GM-only and player-visible content
- Location templates and reuse
- Integration with encounters, NPCs, and sessions
- Search and filtering capabilities

**Source Material:** Shadowrun 5th Edition Core Rulebook and various sourcebooks (locations are campaign-specific world-building content)

---

## User Stories

### Primary Use Cases (GM)

1. **As a GM**, I want to create locations for my campaign world.

2. **As a GM**, I want to organize locations by type (physical, Matrix, astral, etc.).

3. **As a GM**, I want to add rich descriptions, images, and notes to locations.

4. **As a GM**, I want to link locations to NPCs, encounters, and sessions.

5. **As a GM**, I want to create location hierarchies (districts within cities, rooms within buildings).

6. **As a GM**, I want to mark certain location content as GM-only (hidden from players).

7. **As a GM**, I want to search and filter locations by type, tags, or name.

8. **As a GM**, I want to reuse location templates across campaigns.

9. **As a GM**, I want to track which locations have been visited or referenced in sessions.

10. **As a GM**, I want to add location-specific rules or modifiers (security ratings, matrix hosts, etc.).

### Primary Use Cases (Player)

11. **As a player**, I want to view locations that have been shared by the GM.

12. **As a player**, I want to see location descriptions and images.

13. **As a player**, I want to understand location relationships and connections.

14. **As a player**, I want to reference locations in character notes or journals.

### Secondary Use Cases

15. **As a GM**, I want to export/import locations between campaigns.

16. **As a GM**, I want to create location maps or diagrams.

17. **As a GM**, I want to track location history (when visited, by whom, what happened).

18. **As a GM**, I want to assign location-specific NPCs or grunt teams.

19. **As a GM**, I want to create location templates from existing locations.

20. **As a GM**, I want to link locations to campaign notes and journal entries.

---

## Page Structure

### Routes

#### Locations List Page
- **Path:** `/app/campaigns/[campaignId]/locations/page.tsx`
- **Layout:** Uses `AuthenticatedLayout` (inherits sidebar navigation)
- **Authentication:** Required (protected route)
- **Description:** Lists all locations for a campaign with filtering and search

#### Location Detail Page
- **Path:** `/app/campaigns/[campaignId]/locations/[locationId]/page.tsx`
- **Layout:** Uses `AuthenticatedLayout`
- **Authentication:** Required (protected route)
- **Description:** Shows location details, relationships, and associated content

#### Create Location Page
- **Path:** `/app/campaigns/[campaignId]/locations/create/page.tsx`
- **Layout:** Uses `AuthenticatedLayout`
- **Authentication:** Required (protected route, GM-only)
- **Description:** Form/wizard for creating a new location

#### Location Templates Page
- **Path:** `/app/campaigns/[campaignId]/locations/templates/page.tsx`
- **Layout:** Uses `AuthenticatedLayout`
- **Authentication:** Required (protected route, GM-only)
- **Description:** Manage location templates and create locations from templates

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (from AuthenticatedLayout)                                │
├──────────┬──────────────────────────────────────────────────────┤
│ SIDEBAR   │ MAIN CONTENT AREA                                    │
│ (nav)     │                                                       │
│           │ ┌─────────────────────────────────────────────────┐ │
│           │ │ Location Header                                  │ │
│           │ │ - Location Name, Type Badge                     │ │
│           │ │ - Campaign Link                                 │ │
│           │ │ - Actions (Edit, Delete, Duplicate, Export)    │ │
│           │ └─────────────────────────────────────────────────┘ │
│           │                                                       │
│           │ ┌─────────────────────────────────────────────────┐ │
│           │ │ Location Navigation Tabs                      │ │
│           │ │ - Overview | Details | Connections | History │ │
│           │ └─────────────────────────────────────────────────┘ │
│           │                                                       │
│           │ ┌─────────────────────────────────────────────────┐ │
│           │ │ Active Tab Content                              │ │
│           │ │ (Overview/Details/Connections/History)          │ │
│           │ └─────────────────────────────────────────────────┘ │
└───────────┴──────────────────────────────────────────────────────┘
```

---

## Data Model

### Location Type

```typescript
/**
 * Location type/category
 */
export type LocationType =
  | "physical"        // Physical locations (buildings, districts, cities)
  | "matrix-host"     // Matrix hosts
  | "astral"          // Astral spaces
  | "safe-house"      // Safe houses
  | "meeting-place"   // Meeting locations
  | "corporate"       // Corporate facilities
  | "gang-territory"  // Gang territories
  | "residential"     // Residential areas
  | "commercial"      // Commercial districts
  | "industrial"      // Industrial areas
  | "underground"     // Underground/undercity locations
  | "other";           // Other/uncategorized

/**
 * Location visibility
 */
export type LocationVisibility = "gm-only" | "players" | "public";

/**
 * A location within a campaign world
 */
export interface Location {
  id: ID;
  
  /** Campaign this location belongs to */
  campaignId: ID;
  
  /** Location metadata */
  name: string;
  type: LocationType;
  description?: string;
  
  /** Visibility control */
  visibility: LocationVisibility;
  
  /** GM-only content */
  gmNotes?: string;
  gmOnlyContent?: {
    /** Hidden NPCs at this location */
    npcIds?: ID[];
    /** Hidden grunt teams at this location */
    gruntTeamIds?: ID[];
    /** Hidden encounters at this location */
    encounterIds?: ID[];
    /** Additional GM-only notes */
    notes?: string;
  };
  
  // -------------------------------------------------------------------------
  // Physical Properties
  // -------------------------------------------------------------------------
  
  /** Physical address or location description */
  address?: string;
  
  /** Geographic coordinates (optional) */
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  
  /** District/area this location is in */
  district?: string;
  
  /** City/metroplex this location is in */
  city?: string;
  
  /** Country/nation this location is in */
  country?: string;
  
  // -------------------------------------------------------------------------
  // Hierarchy & Relationships
  // -------------------------------------------------------------------------
  
  /** Parent location (if this is a sub-location) */
  parentLocationId?: ID;
  
  /** Child locations (sub-locations within this location) */
  childLocationIds?: ID[];
  
  /** Related/connected locations */
  relatedLocationIds?: ID[];
  
  /** NPCs associated with this location */
  npcIds?: ID[];
  
  /** Grunt teams associated with this location */
  gruntTeamIds?: ID[];
  
  /** Encounters that occurred at this location */
  encounterIds?: ID[];
  
  /** Sessions that referenced this location */
  sessionIds?: ID[];
  
  // -------------------------------------------------------------------------
  // Game Mechanics
  // -------------------------------------------------------------------------
  
  /** Security rating (1-10, if applicable) */
  securityRating?: number;
  
  /** Matrix host details (if Matrix location) */
  matrixHost?: {
    hostRating: number;
    hostType: "public" | "private" | "restricted" | "public-grid";
    ic?: string[]; // IC types present
    patrol?: number; // Patrol IC rating
  };
  
  /** Astral properties (if astral location) */
  astralProperties?: {
    backgroundCount?: number;
    manaLevel?: "low" | "normal" | "high" | "very-high";
    barrierRating?: number;
  };
  
  /** Location-specific modifiers or rules */
  modifiers?: Record<string, unknown>;
  
  // -------------------------------------------------------------------------
  // Media & References
  // -------------------------------------------------------------------------
  
  /** Location image URL */
  imageUrl?: string;
  
  /** Additional images */
  images?: string[];
  
  /** Map image URL */
  mapUrl?: string;
  
  /** External references (sourcebook pages, etc.) */
  references?: Array<{
    source: string;
    page?: number;
    note?: string;
  }>;
  
  // -------------------------------------------------------------------------
  // Tags & Organization
  // -------------------------------------------------------------------------
  
  /** Tags for categorization and search */
  tags?: string[];
  
  /** Custom fields (extensible) */
  customFields?: Record<string, unknown>;
  
  // -------------------------------------------------------------------------
  // History & Tracking
  // -------------------------------------------------------------------------
  
  /** When this location was first created */
  createdAt: ISODateString;
  
  /** When this location was last updated */
  updatedAt?: ISODateString;
  
  /** When this location was first visited (in-game) */
  firstVisitedAt?: ISODateString;
  
  /** When this location was last visited (in-game) */
  lastVisitedAt?: ISODateString;
  
  /** Characters who have visited this location */
  visitedByCharacterIds?: ID[];
  
  /** Visit count */
  visitCount?: number;
  
  /** Extensible metadata */
  metadata?: Metadata;
}
```

### LocationTemplate Type

```typescript
/**
 * A reusable location template
 */
export interface LocationTemplate {
  id: ID;
  
  /** Template creator (user ID) */
  createdBy: ID;
  
  /** Template name */
  name: string;
  
  /** Template description */
  description?: string;
  
  /** Template type */
  type: LocationType;
  
  /** Template data (location structure without campaign-specific IDs) */
  templateData: Omit<Location, "id" | "campaignId" | "createdAt" | "updatedAt" | "npcIds" | "gruntTeamIds" | "encounterIds" | "sessionIds" | "visitedByCharacterIds">;
  
  /** Template tags */
  tags?: string[];
  
  /** Is this template public (shared) or private */
  isPublic: boolean;
  
  /** Usage count (how many times template has been used) */
  usageCount: number;
  
  createdAt: ISODateString;
  updatedAt?: ISODateString;
}
```

### LocationConnection Type

```typescript
/**
 * A connection or relationship between locations
 */
export interface LocationConnection {
  id: ID;
  fromLocationId: ID;
  toLocationId: ID;
  connectionType: "physical" | "matrix" | "astral" | "transport" | "related" | "other";
  description?: string;
  bidirectional: boolean; // If true, connection works both ways
  metadata?: Record<string, unknown>;
}
```

---

## Components

### 1. LocationsPage (Locations List)

**Location:** `/app/campaigns/[campaignId]/locations/page.tsx`

**Responsibilities:**
- Fetch and display campaign's locations
- Filter locations by type, tags, visibility
- Search locations by name, description
- Create new location action
- Link to location detail pages
- Display location hierarchy (tree view option)

**State:**
- `locations: Location[]` - All locations for campaign
- `filterType: LocationType | "all"` - Current type filter
- `filterVisibility: LocationVisibility | "all"` - Current visibility filter
- `searchQuery: string` - Search input
- `viewMode: "list" | "tree" | "map"` - Display mode
- `loading: boolean` - Loading state
- `error: string | null` - Error state

**Props:** None (route params provide campaign ID)

---

### 2. LocationCard

**Location:** `/app/campaigns/[campaignId]/locations/components/LocationCard.tsx`

**Description:** Individual location display card in list view.

**Features:**
- Location name and type badge
- Description preview
- Visibility indicator (GM-only badge if applicable)
- Related content counts (NPCs, encounters, etc.)
- Quick actions (View, Edit, Delete)
- Parent/child location indicators

**Props:**
```typescript
interface LocationCardProps {
  location: Location;
  userRole: "gm" | "player";
  onView: (locationId: ID) => void;
  onEdit?: (locationId: ID) => void;
  onDelete?: (locationId: ID) => void;
}
```

---

### 3. LocationDetailPage

**Location:** `/app/campaigns/[campaignId]/locations/[locationId]/page.tsx`

**Responsibilities:**
- Fetch and display location details
- Render appropriate tab content
- Handle user actions (edit, delete, link content)
- Check user permissions (GM vs player)
- Filter GM-only content for players

**State:**
- `location: Location | null` - Location data
- `activeTab: LocationTab` - Currently active tab
- `relatedLocations: Location[]` - Related locations
- `relatedNPCs: Character[]` - Associated NPCs
- `relatedGrunts: GruntTeam[]` - Associated grunt teams
- `userRole: "gm" | "player" | null` - Current user's role
- `loading: boolean` - Loading state

**Props:** None (route params provide location ID)

---

### 4. LocationHeader

**Location:** `/app/campaigns/[campaignId]/locations/[locationId]/components/LocationHeader.tsx`

**Description:** Location header with name, metadata, and actions.

**Features:**
- Location name and type badge
- Visibility indicator
- Address/coordinates display
- Image gallery (if available)
- Action buttons (context-aware):
  - GM: Edit, Delete, Duplicate, Export, Create Template
  - Player: View only

**Props:**
```typescript
interface LocationHeaderProps {
  location: Location;
  userRole: "gm" | "player" | null;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onExport?: () => void;
}
```

---

### 5. LocationTabs

**Location:** `/app/campaigns/[campaignId]/locations/[locationId]/components/LocationTabs.tsx`

**Description:** Tab navigation for location detail sections.

**Tabs:**
- **Overview** - Description, images, basic info
- **Details** - Physical properties, game mechanics, modifiers
- **Connections** - Related locations, NPCs, encounters
- **History** - Visit history, session references (GM-only)

**Props:**
```typescript
interface LocationTabsProps {
  activeTab: LocationTab;
  onTabChange: (tab: LocationTab) => void;
  userRole: "gm" | "player" | null;
}
```

---

### 6. LocationOverviewTab

**Location:** `/app/campaigns/[campaignId]/locations/[locationId]/components/LocationOverviewTab.tsx`

**Description:** Overview of location information.

**Sections:**
- Location description (rich text)
- Image gallery
- Address and coordinates
- Type and tags
- Visibility status
- Basic statistics (visit count, related content)

**Props:**
```typescript
interface LocationOverviewTabProps {
  location: Location;
  userRole: "gm" | "player";
}
```

---

### 7. LocationDetailsTab

**Location:** `/app/campaigns/[campaignId]/locations/[locationId]/components/LocationDetailsTab.tsx`

**Description:** Detailed location properties and game mechanics.

**Sections:**
- Physical properties (address, coordinates, district, city)
- Hierarchy (parent/child locations)
- Security rating
- Matrix host details (if applicable)
- Astral properties (if applicable)
- Location-specific modifiers
- References (sourcebook pages, etc.)
- GM-only content (if GM)

**Props:**
```typescript
interface LocationDetailsTabProps {
  location: Location;
  userRole: "gm" | "player";
}
```

---

### 8. LocationConnectionsTab

**Location:** `/app/campaigns/[campaignId]/locations/[locationId]/components/LocationConnectionsTab.tsx`

**Description:** Display location relationships and connections.

**Features:**
- Related locations list (with connection types)
- Associated NPCs list
- Associated grunt teams list
- Associated encounters list
- Link/unlink content actions (GM-only)
- Visual connection diagram (future)

**Props:**
```typescript
interface LocationConnectionsTabProps {
  location: Location;
  relatedLocations: Location[];
  relatedNPCs: Character[];
  relatedGrunts: GruntTeam[];
  relatedEncounters: Encounter[];
  userRole: "gm" | "player";
  onLinkContent?: (type: "npc" | "grunt" | "encounter", id: ID) => Promise<void>;
  onUnlinkContent?: (type: "npc" | "grunt" | "encounter", id: ID) => Promise<void>;
}
```

---

### 9. LocationHistoryTab

**Location:** `/app/campaigns/[campaignId]/locations/[locationId]/components/LocationHistoryTab.tsx`

**Description:** Location visit history and session references (GM-only).

**Features:**
- Visit timeline
- Characters who visited
- Sessions that referenced location
- First/last visit dates
- Visit count statistics
- GM notes about visits

**Props:**
```typescript
interface LocationHistoryTabProps {
  location: Location;
  sessions: CampaignSession[];
  characters: Character[];
  userRole: "gm" | "player";
}
```

---

### 10. CreateLocationForm

**Location:** `/app/campaigns/[campaignId]/locations/create/components/CreateLocationForm.tsx`

**Description:** Form for creating a new location.

**Sections:**
- Basic Info (name, type, description, visibility)
- Physical Properties (address, coordinates, district, city)
- Hierarchy (parent location selection)
- Game Mechanics (security rating, matrix host, astral properties)
- Media (images, map)
- Tags and References
- GM Notes (GM-only section)

**State:**
- `formData: Partial<Location>` - Form data
- `selectedTemplate?: LocationTemplate` - Selected template
- `validationErrors: Record<string, string>` - Form validation errors

**Props:**
```typescript
interface CreateLocationFormProps {
  campaignId: ID;
  onComplete: (location: Location) => void;
  onCancel: () => void;
  template?: LocationTemplate; // Optional template to start from
}
```

---

### 11. LocationTemplatesPage

**Location:** `/app/campaigns/[campaignId]/locations/templates/page.tsx`

**Description:** Manage location templates and create locations from templates.

**Features:**
- Template list (user templates + public templates)
- Create template from existing location
- Create location from template
- Template preview
- Template sharing (make public/private)
- Template search and filtering

**Props:**
```typescript
interface LocationTemplatesPageProps {
  campaignId: ID;
  userTemplates: LocationTemplate[];
  publicTemplates: LocationTemplate[];
}
```

---

## Data Requirements

### API Endpoints

#### 1. GET `/api/campaigns/[campaignId]/locations`

**Purpose:** List all locations for a campaign

**Query Parameters:**
- `type?: LocationType` - Filter by type
- `visibility?: LocationVisibility` - Filter by visibility
- `tags?: string[]` - Filter by tags (comma-separated)
- `search?: string` - Search by name/description
- `parentId?: ID` - Filter by parent location
- `includeChildren?: boolean` - Include child locations

**Response:**
```typescript
{
  success: boolean;
  locations: Location[];
  error?: string;
}
```

**Implementation:** New endpoint - query locations where `campaignId = campaignId`, apply filters

---

#### 2. GET `/api/locations/[locationId]`

**Purpose:** Get detailed location information

**Query Parameters:**
- `includeRelated?: boolean` - Include related locations, NPCs, etc.

**Response:**
```typescript
{
  success: boolean;
  location: Location;
  relatedLocations?: Location[];
  relatedNPCs?: Character[];
  relatedGrunts?: GruntTeam[];
  relatedEncounters?: Encounter[];
  error?: string;
}
```

**Implementation:** New endpoint - return location, optionally fetch related content, filter GM-only content based on user role

---

#### 3. POST `/api/campaigns/[campaignId]/locations`

**Purpose:** Create a new location

**Request:**
```typescript
{
  name: string;
  type: LocationType;
  description?: string;
  visibility: LocationVisibility;
  address?: string;
  coordinates?: { latitude: number; longitude: number };
  district?: string;
  city?: string;
  country?: string;
  parentLocationId?: ID;
  securityRating?: number;
  matrixHost?: Location["matrixHost"];
  astralProperties?: Location["astralProperties"];
  modifiers?: Record<string, unknown>;
  imageUrl?: string;
  images?: string[];
  mapUrl?: string;
  tags?: string[];
  gmNotes?: string;
  templateId?: ID; // Optional: create from template
}
```

**Response:**
```typescript
{
  success: boolean;
  location?: Location;
  error?: string;
}
```

**Implementation:** New endpoint - create location, set `campaignId`, initialize defaults

**Validation:**
- Name required (1-200 characters)
- Type must be valid LocationType
- Visibility must be valid LocationVisibility
- Security rating must be 1-10 if provided
- Coordinates must be valid if provided

---

#### 4. PUT `/api/locations/[locationId]`

**Purpose:** Update location (GM-only)

**Request:**
```typescript
{
  name?: string;
  type?: LocationType;
  description?: string;
  visibility?: LocationVisibility;
  address?: string;
  coordinates?: { latitude: number; longitude: number };
  district?: string;
  city?: string;
  country?: string;
  parentLocationId?: ID;
  securityRating?: number;
  matrixHost?: Location["matrixHost"];
  astralProperties?: Location["astralProperties"];
  modifiers?: Record<string, unknown>;
  imageUrl?: string;
  images?: string[];
  mapUrl?: string;
  tags?: string[];
  gmNotes?: string;
  gmOnlyContent?: Location["gmOnlyContent"];
}
```

**Response:**
```typescript
{
  success: boolean;
  location?: Location;
  error?: string;
}
```

**Implementation:** New endpoint - verify user is GM, update allowed fields

---

#### 5. DELETE `/api/locations/[locationId]`

**Purpose:** Delete a location (GM-only)

**Request:** None (location ID from route)

**Response:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Implementation:** New endpoint - verify user is GM, handle child location relationships

---

#### 6. POST `/api/locations/[locationId]/link`

**Purpose:** Link content to location (GM-only)

**Request:**
```typescript
{
  type: "npc" | "grunt" | "encounter" | "session";
  targetId: ID;
}
```

**Response:**
```typescript
{
  success: boolean;
  location?: Location;
  error?: string;
}
```

**Implementation:** New endpoint - add ID to appropriate array field

---

#### 7. DELETE `/api/locations/[locationId]/link`

**Purpose:** Unlink content from location (GM-only)

**Request:**
```typescript
{
  type: "npc" | "grunt" | "encounter" | "session";
  targetId: ID;
}
```

**Response:**
```typescript
{
  success: boolean;
  location?: Location;
  error?: string;
}
```

**Implementation:** New endpoint - remove ID from appropriate array field

---

#### 8. POST `/api/locations/[locationId]/visit`

**Purpose:** Record a location visit

**Request:**
```typescript
{
  characterId: ID;
  sessionId?: ID;
  notes?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  location?: Location;
  error?: string;
}
```

**Implementation:** New endpoint - update visit tracking, increment visit count

---

#### 9. GET `/api/location-templates`

**Purpose:** List location templates

**Query Parameters:**
- `userId?: ID` - Filter by user (for user's templates)
- `public?: boolean` - Filter public templates
- `type?: LocationType` - Filter by type
- `search?: string` - Search templates

**Response:**
```typescript
{
  success: boolean;
  templates: LocationTemplate[];
  error?: string;
}
```

**Implementation:** New endpoint - query templates, filter by user/public

---

#### 10. POST `/api/location-templates`

**Purpose:** Create a location template (GM-only)

**Request:**
```typescript
{
  name: string;
  description?: string;
  type: LocationType;
  templateData: Omit<Location, "id" | "campaignId" | "createdAt" | "updatedAt" | "npcIds" | "gruntTeamIds" | "encounterIds" | "sessionIds" | "visitedByCharacterIds">;
  tags?: string[];
  isPublic: boolean;
}
```

**Response:**
```typescript
{
  success: boolean;
  template?: LocationTemplate;
  error?: string;
}
```

**Implementation:** New endpoint - create template, set `createdBy` to current user

---

#### 11. POST `/api/locations/[locationId]/create-template`

**Purpose:** Create template from existing location (GM-only)

**Request:**
```typescript
{
  name: string;
  description?: string;
  isPublic: boolean;
}
```

**Response:**
```typescript
{
  success: boolean;
  template?: LocationTemplate;
  error?: string;
}
```

**Implementation:** New endpoint - extract template data from location, create template

---

### Storage Layer

**File Structure:**
```
data/campaigns/{campaignId}/
├── locations/
│   ├── {locationId}.json
│   └── {locationId}.json
└── location-templates/
    └── {templateId}.json

data/users/{userId}/
└── location-templates/
    └── {templateId}.json
```

**Functions needed in `/lib/storage/locations.ts`:**

```typescript
// CRUD operations
export function createLocation(
  campaignId: ID,
  location: Omit<Location, "id" | "campaignId" | "createdAt" | "updatedAt">
): Location;

export function getLocation(locationId: ID): Location | null;

export function updateLocation(
  locationId: ID,
  updates: Partial<Location>
): Location;

export function deleteLocation(locationId: ID): void;

// Query operations
export function getLocationsByCampaign(
  campaignId: ID,
  filters?: LocationFilters
): Location[];

export function getLocationHierarchy(
  campaignId: ID,
  rootLocationId?: ID
): Location[];

export function searchLocations(
  campaignId: ID,
  query: string
): Location[];

// Relationship operations
export function linkContentToLocation(
  locationId: ID,
  type: "npc" | "grunt" | "encounter" | "session",
  targetId: ID
): Location;

export function unlinkContentFromLocation(
  locationId: ID,
  type: "npc" | "grunt" | "encounter" | "session",
  targetId: ID
): Location;

// Visit tracking
export function recordLocationVisit(
  locationId: ID,
  characterId: ID,
  sessionId?: ID
): Location;

// Template operations
export function createLocationTemplate(
  userId: ID,
  template: Omit<LocationTemplate, "id" | "createdBy" | "createdAt" | "updatedAt" | "usageCount">
): LocationTemplate;

export function getLocationTemplates(
  filters?: TemplateFilters
): LocationTemplate[];

export function createLocationFromTemplate(
  campaignId: ID,
  templateId: ID,
  overrides?: Partial<Location>
): Location;
```

---

## UI/UX Considerations

### Visual Design

- **Consistent with existing UI:** Follow Tailwind CSS patterns and dark mode support
- **Card-based layout:** Location cards with hover effects
- **Badge system:** Location type badges, visibility badges
- **Hierarchy visualization:** Tree view for location hierarchies
- **Map integration:** Optional map view for locations with coordinates
- **Image galleries:** Rich image display for locations
- **Responsive design:** Mobile-first, adapts to tablet and desktop
- **Loading states:** Skeleton loaders for async content
- **Error handling:** User-friendly error messages with retry options

### Accessibility

- **Keyboard navigation:** Full keyboard support for all interactive elements
- **Screen readers:** Proper ARIA labels and semantic HTML
- **Focus management:** Clear focus indicators, proper tab order
- **Color contrast:** Meet WCAG AA standards
- **Form labels:** All inputs have associated labels
- **Image alt text:** All images have descriptive alt text

### User Flow - Creating a Location

1. GM navigates to campaign locations page
2. GM clicks "Create Location" button
3. Form opens with Basic Info section
4. GM enters name, selects type, adds description
5. GM sets visibility (GM-only or players)
6. GM optionally adds physical properties (address, coordinates)
7. GM optionally selects parent location (for hierarchy)
8. GM optionally adds game mechanics (security rating, matrix host, etc.)
9. GM optionally uploads images or map
10. GM adds tags and references
11. GM adds GM-only notes (if applicable)
12. Location is created
13. GM is redirected to location detail page

### User Flow - Linking Content to Location

1. GM navigates to location detail page
2. GM clicks "Connections" tab
3. GM clicks "Link Content" button
4. GM selects content type (NPC, Grunt Team, Encounter)
5. GM searches and selects content to link
6. Content is linked to location
7. Location connections tab updates

---

## Implementation Notes

### File Structure

```
app/campaigns/[campaignId]/locations/
├── page.tsx                                    # Locations list page
├── create/
│   ├── page.tsx                                # Create location page
│   └── components/
│       ├── CreateLocationForm.tsx              # Main form
│       ├── BasicInfoSection.tsx                 # Basic info
│       ├── PhysicalPropertiesSection.tsx        # Physical properties
│       ├── HierarchySection.tsx                # Parent/child selection
│       ├── GameMechanicsSection.tsx            # Security, matrix, astral
│       ├── MediaSection.tsx                    # Images, map
│       └── TagsReferencesSection.tsx           # Tags and references
├── templates/
│   ├── page.tsx                                # Templates page
│   └── components/
│       ├── LocationTemplateCard.tsx            # Template card
│       ├── CreateTemplateFromLocation.tsx      # Create template dialog
│       └── CreateLocationFromTemplate.tsx      # Create from template dialog
├── [locationId]/
│   ├── page.tsx                                # Location detail page
│   └── components/
│       ├── LocationHeader.tsx                  # Location header
│       ├── LocationTabs.tsx                    # Tab navigation
│       ├── LocationOverviewTab.tsx             # Overview tab
│       ├── LocationDetailsTab.tsx              # Details tab
│       ├── LocationConnectionsTab.tsx          # Connections tab
│       ├── LocationHistoryTab.tsx              # History tab
│       ├── LocationImageGallery.tsx            # Image gallery
│       └── LocationMap.tsx                     # Map display
└── components/
    ├── LocationCard.tsx                        # Location list card
    ├── LocationList.tsx                        # Location list container
    ├── LocationTree.tsx                        # Hierarchy tree view
    ├── LocationTypeBadge.tsx                   # Type badge
    └── LocationVisibilityBadge.tsx             # Visibility badge

lib/storage/
└── locations.ts                                # Location storage layer

lib/types/
└── location.ts                                 # Location type definitions

app/api/locations/
├── route.ts                                    # GET, POST /api/campaigns/[campaignId]/locations
├── [locationId]/
│   ├── route.ts                                # GET, PUT, DELETE /api/locations/[locationId]
│   ├── link/
│   │   └── route.ts                            # POST, DELETE /api/locations/[locationId]/link
│   ├── visit/
│   │   └── route.ts                            # POST /api/locations/[locationId]/visit
│   └── create-template/
│       └── route.ts                            # POST /api/locations/[locationId]/create-template
└── templates/
    └── route.ts                                # GET, POST /api/location-templates
```

### Dependencies

- **Existing:**
  - `@/lib/types` - Type definitions (extend with Location types)
  - `@/lib/storage` - Storage layer (add locations.ts)
  - `@/lib/auth` - Authentication utilities
  - `react-aria-components` - UI components
  - `next/navigation` - Routing

- **New:**
  - Location type definitions in `/lib/types/location.ts`
  - Location storage layer in `/lib/storage/locations.ts`
  - Image upload handling (if supporting image uploads)
  - Map integration library (optional, for map view)

### State Management

- **Client-side state:** React `useState` for UI state (tabs, filters, form data)
- **Server data:** Fetch via API routes
- **Location context:** Consider React Context for location data shared across location pages (future)

### Validation Rules

**Location Creation:**
- Name: 1-200 characters, required
- Type: Must be valid LocationType
- Visibility: Must be valid LocationVisibility
- Security rating: Must be 1-10 if provided
- Coordinates: Must be valid latitude/longitude if provided
- Parent location: Must exist and belong to same campaign

**Content Linking:**
- NPC/Grunt/Encounter must exist
- Cannot link same content twice
- Content must belong to same campaign (if applicable)

---

## Acceptance Criteria

### MVP (Minimum Viable Product)

- [x] GM can create locations with name, type, description
- [x] GM can set location visibility (GM-only or players)
- [x] GM can add physical properties (address, coordinates, district, city)
- [x] GM can create location hierarchies (parent/child)
- [x] GM can add GM-only notes and content (Basic `gmNotes` supported; structured `gmOnlyContent` for hidden links deferred to Phase 2)
- [x] GM can link NPCs, grunt teams, and encounters to locations
- [x] GM can search and filter locations by type, tags, visibility
- [x] Players can view locations shared by GM
- [x] System tracks location visits (Aggregate stats implemented; detailed timeline deferred)
- [x] All forms have proper validation
- [x] Success and error messages display appropriately
- [x] Page is responsive (mobile, tablet, desktop)
- [x] Dark mode support
- [x] Accessibility: keyboard navigation, screen reader support

### Enhanced Features (Future)

- [x] Location templates (create from template, save as template)
- [ ] Image galleries and map integration (Basic URL fields implemented in MVP)
- [ ] Matrix host and astral properties support (Fields implemented in MVP; deeper integration future)
- [ ] Location-specific modifiers and rules
- [ ] Visual location hierarchy tree
- [ ] Location connection diagrams
- [ ] Export/import locations between campaigns
- [ ] Location history timeline (Detailed chronological log)
- [ ] Location statistics and analytics
- [ ] Integration with campaign notes and sessions
- [ ] Location search with full-text search
- [ ] Location tags and categorization (Basic tagging implemented in MVP)
- [ ] Public location template library

---

## Security Considerations

### Access Control

- **Location Creation:** Only GM can create locations
- **Location Editing:** Only GM can modify locations
- **Location Deletion:** Only GM can delete locations
- **GM-Only Content:** Players cannot see GM-only content
- **Campaign Context:** Locations are campaign-specific, verify campaign membership

### Data Validation

- Validate all user inputs server-side
- Sanitize location descriptions and notes
- Validate location types
- Validate coordinates (latitude: -90 to 90, longitude: -180 to 180)
- Enforce campaign membership for linked content
- Prevent circular location hierarchies

---

## Future Enhancements

### Phase 2: Advanced Location Features

- Image galleries and map integration
- Matrix host and astral properties
- Location-specific modifiers
- Visual hierarchy tree
- Connection diagrams

### Phase 3: Template System

- Location templates
- Template library
- Create from template
- Save as template
- Template sharing

### Phase 4: Integration Features

- Integration with encounters
- Integration with sessions
- Location history timeline
- Visit tracking and statistics
- Location-based journal entries

### Phase 5: Advanced Features

- Full-text search
- Location analytics
- Export/import
- Public template library
- Location recommendations

---

## Related Documentation

- **Architecture:** `/docs/architecture/architecture-overview.md`
- **Campaign Support:** `/docs/specifications/campaign_support_specification.md`
- **NPCs/Grunts:** `/docs/specifications/npcs_grunts_specification.md`
- **Character Sheet:** `/docs/specifications/character_sheet_specification.md`
- **Gameplay Actions:** `/docs/specifications/gameplay_actions_specification.md`

---

## Open Questions

1. **Location Coordinates:** Should we support map integration, or just store coordinates?
   - **Recommendation:** Start with coordinate storage, add map integration in Phase 2

2. **Image Storage:** Where should location images be stored (local filesystem, cloud storage)?
   - **Recommendation:** Start with URL references, add file upload in Phase 2

3. **Location Hierarchy Depth:** Should there be a limit on hierarchy depth?
   - **Recommendation:** No hard limit, but warn if depth > 5 levels

4. **Template Sharing:** Should templates be shareable across all users or campaign-specific?
   - **Recommendation:** User templates are private, public templates are global

5. **Visit Tracking:** Should visit tracking be automatic or manual?
   - **Recommendation:** Manual (GM records visits), consider automatic in Phase 2

6. **Location Deletion:** What happens to linked content when location is deleted?
   - **Recommendation:** Unlink content (set location references to null), don't delete content

7. **Matrix Host Details:** Should Matrix hosts be separate entities or location properties?
   - **Recommendation:** Start as location properties, consider separate entities in Phase 2 if needed

8. **Location Search:** Should search include GM-only content for GMs?
   - **Recommendation:** Yes, GMs can search all content including GM-only

9. **Location Export:** What format should location export use (JSON, PDF, printable)?
   - **Recommendation:** Start with JSON, add PDF/printable formats in Phase 2

10. **Location Visibility:** Can visibility be changed after creation?
    - **Recommendation:** Yes, GM can change visibility at any time

---

## Implementation Priority

**Priority:** Medium  
**Estimated Effort:** 8-12 days  
**Dependencies:**
- Campaign system (for campaign context)
- Type definitions (extend with Location types)
- Storage layer (add locations.ts)
- UI components (location management)
- Optional: Image upload handling, map integration

**Blockers:** None (all infrastructure exists, need to add location-specific code)

This feature enables GMs to build rich campaign worlds with detailed locations, supporting world-building and gameplay reference. It provides the foundation for encounter management, session tracking, and campaign storytelling features.

---

## Notes

- Location support is essential for campaign world-building
- Locations serve as hubs for connecting NPCs, encounters, and sessions
- Template system allows quick creation of common location types
- Integration with campaign system ensures proper access control and context
- Future integration with encounter system will enable location-based encounters
- GM-only content allows GMs to keep secrets and hidden information
- Visit tracking enables campaign history and continuity
- Location hierarchies support complex world structures (cities → districts → buildings → rooms)
- Edition support: Location concepts are edition-agnostic, though specific mechanics (Matrix hosts, astral properties) may vary by edition


## Implemented Features (Phase 5-7 Additions)

### 12. Location Templates System
**Location:** `/app/campaigns/[campaignId]/locations/templates/page.tsx`
- **Create Template:** Create reusable templates from existing locations or from scratch.
- **Save as Template:** "Save as Template" button on Location Detail page.
- **Public/Private:** Share templates visibly or keep them private.
- **Usage:** Create new locations pre-filled from selected templates.

### 13. Export/Import System
**API Routes:**
- `GET /api/campaigns/[campaignId]/locations/export`: Download full campaign location data as JSON.
- `POST /api/campaigns/[campaignId]/locations/import`: Import location data from JSON.

**UI:**
- **Export Button:** On Locations List page header.
- **Import Button:** Opens `LocationImportDialog` to paste or upload JSON.

### 14. Location Tree View
**Location:** `/app/campaigns/[campaignId]/locations/components/LocationTree.tsx`
- **Visualization:** Recursive tree display of location hierarchy.
- **Interaction:** Expand/collapse nodes, click to view details.
- **Toggle:** Switch between List and Tree views on the main locations page.

### 15. Content Generation
- **Seattle Data:** Pre-generated `seattle-locations.json` included in repository for quick start.
