# Rulesets Page Specification

**Last Updated:** 2025-01-27  
**Status:** Implemented (MVP)
**Category:** UI/UX, Ruleset Management  
**Affected Editions:** All editions (architecture supports all)

---

## Overview

The Rulesets page (`/rulesets`) provides a comprehensive interface for users to browse, explore, and understand the available Shadowrun edition rulesets in the system. This page serves as both a reference tool and a discovery interface, allowing users to:

- Browse all available Shadowrun editions
- View detailed information about each edition
- Explore available books and sourcebooks for each edition
- Understand creation methods available per edition
- Preview ruleset content (skills, metatypes, gear, etc.)
- Compare editions side-by-side (future enhancement)

This page is accessible from the main navigation sidebar.

---

## User Stories

### Primary Use Cases

1. **As a new player**, I want to browse available editions to understand which one I should use for character creation.

2. **As an experienced player**, I want to see what books and sourcebooks are available for my preferred edition.

3. **As a GM**, I want to review the ruleset content available for an edition to plan my campaign.

4. **As a player**, I want to explore the skills, metatypes, and gear available in an edition before starting character creation.

5. **As a user**, I want to understand the differences between editions to make an informed choice.

---

## Implementation Record (MVP - 2025-01-27)

The logic for this page was implemented as specified, with the following technical notes:

- **Layout**: The page is wrapped in `AuthenticatedLayout` (consistent with Characters/User Management) rather than inheriting directly from root.
- **Icons**: Used `lucide-react` for UI icons (`BookOpen`, `UserPlus`, `Layers`, etc.).
- **Sidebar**: The navigation link "Rulesets" was enabled in `AuthenticatedLayout.tsx`.
- **Dashboard**: The dashboard card for "View Rulesets" was enabled in `app/page.tsx`.

---

## Page Structure

### Route
- **Path:** `/app/rulesets/page.tsx`
- **Layout:** Uses `RulesetsLayout` (wrapping `AuthenticatedLayout`)
- **Authentication:** Required (protected route)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (from AuthenticatedLayout)                                │
├──────────┬──────────────────────────────────────────────────────┤
│ SIDEBAR   │ MAIN CONTENT AREA                                    │
│ (nav)     │                                                       │
│           │ ┌─────────────────────────────────────────────────┐ │
│           │ │ Page Header                                      │ │
│           │ │ - Title: "Rulesets"                               │ │
│           │ │ - Subtitle: "Browse Shadowrun editions"          │ │
│           │ └─────────────────────────────────────────────────┘ │
│           │                                                       │
│           │ ┌─────────────────────────────────────────────────┐ │
│           │ │ Edition Browser                                   │ │
│           │ │ - Grid/List of available editions                │ │
│           │ │ - Filter/Search (future)                         │ │
│           │ └─────────────────────────────────────────────────┘ │
│           │                                                       │
│           │ ┌─────────────────────────────────────────────────┐ │
│           │ │ Selected Edition Detail View (conditional)       │ │
│           │ │ - Edition metadata                                │ │
│           │ │ - Available books                                │ │
│           │ │ - Creation methods                               │ │
│           │ │ - Content preview tabs                           │ │
│           │ └─────────────────────────────────────────────────┘ │
└───────────┴──────────────────────────────────────────────────────┘
```

---

## Components

### 1. RulesetsPage (Main Component)

**Location:** `/app/rulesets/page.tsx`

**Responsibilities:**
- Fetch and display all available editions
- Handle edition selection
- Coordinate between edition browser and detail view
- Manage loading and error states

**State:**
- `editions: Edition[]` - All available editions
- `selectedEdition: EditionCode | null` - Currently selected edition
- `loading: boolean` - Loading state
- `error: string | null` - Error state

**Props:** None (server component or client with data fetching)

---

### 2. EditionBrowser

**Location:** `/app/rulesets/components/EditionBrowser.tsx`

**Description:** Grid/list view of all available editions, similar to `EditionSelector` but optimized for browsing rather than selection.

**Features:**
- Display all editions in a responsive grid
- Show edition metadata (name, year, description)
- Visual indicators for availability status
- Click to view details (expands detail view)
- Badge showing number of books available
- Badge showing creation methods count

**Props:**
```typescript
interface EditionBrowserProps {
  editions: Edition[];
  selectedEdition: EditionCode | null;
  onSelectEdition: (editionCode: EditionCode) => void;
}
```

**Visual Design:**
- Card-based layout (similar to `EditionSelector`)
- Hover effects with elevation
- Active/selected state highlighting
- Responsive: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)

---

### 3. EditionDetailView

**Location:** `/app/rulesets/components/EditionDetailView.tsx`

**Description:** Detailed view of a selected edition showing metadata, books, creation methods, and content preview.

**Sections:**

#### 3.1 Edition Header
- Edition name and year
- Description
- Version information
- Release date
- Quick action: "Create Character with this Edition" button

#### 3.2 Books Section
- List of all books available for the edition
- Core rulebook highlighted
- Sourcebooks listed with categories
- Book metadata (title, publisher, ISBN if available)
- Expandable book details (future: show rule modules in each book)

#### 3.3 Creation Methods Section
- List of available creation methods
- Default method highlighted
- Brief description of each method
- Link to character creation with pre-selected method

#### 3.4 Content Preview Tabs
- **Metatypes:** List of playable races
- **Skills:** Skill categories and counts
- **Gear:** Equipment categories
- **Magic:** Traditions, spells count, adept powers count
- **Augmentations:** Cyberware/bioware categories
- **Vehicles:** Vehicle types available
- **Matrix:** Programs, complex forms count

**Props:**
```typescript
interface EditionDetailViewProps {
  editionCode: EditionCode;
  onClose: () => void;
  onCreateCharacter: (editionCode: EditionCode) => void;
}
```

**State:**
- `activeTab: ContentTab` - Currently active preview tab
- `rulesetData: RulesetData | null` - Loaded ruleset data for preview

---

### 4. BookCard

**Location:** `/app/rulesets/components/BookCard.tsx`

**Description:** Individual book display card showing metadata and category.

**Features:**
- Book title and abbreviation
- Category badge (Core, Sourcebook, Adventure, etc.)
- Publisher and release year
- ISBN if available
- Expandable details (future)

**Props:**
```typescript
interface BookCardProps {
  book: Book;
  isCore?: boolean;
}
```

---

### 5. CreationMethodCard

**Location:** `/app/rulesets/components/CreationMethodCard.tsx`

**Description:** Display card for a character creation method.

**Features:**
- Method name and ID
- Brief description
- Default indicator if applicable
- "Use this method" action button

**Props:**
```typescript
interface CreationMethodCardProps {
  method: CreationMethod;
  isDefault?: boolean;
  onSelect: (methodId: string) => void;
}
```

---

### 6. ContentPreviewTabs

**Location:** `/app/rulesets/components/ContentPreviewTabs.tsx`

**Description:** Tabbed interface for previewing ruleset content without loading full ruleset.

**Tabs:**
- **Overview:** Summary statistics
- **Metatypes:** List with basic stats
- **Skills:** Categories and skill counts
- **Gear:** Equipment categories
- **Magic:** Traditions, spell counts
- **Augmentations:** Cyberware/bioware overview
- **Vehicles:** Vehicle types
- **Matrix:** Programs and complex forms

**Props:**
```typescript
interface ContentPreviewTabsProps {
  editionCode: EditionCode;
  rulesetData?: RulesetData | null;
}
```

**Note:** Content preview may require loading the ruleset via API. Consider lazy loading or summary endpoints.

---

## Data Requirements

### API Endpoints

#### 1. GET `/api/editions`
**Purpose:** List all available editions

**Response:**
```typescript
{
  success: boolean;
  editions: Edition[];
}
```

**Implementation:** Use existing `getAllEditions()` from `/lib/storage/editions.ts`

---

#### 2. GET `/api/editions/[editionCode]`
**Purpose:** Get detailed edition information including books and creation methods

**Response:**
```typescript
{
  success: boolean;
  edition: Edition;
  books: Book[];
  creationMethods: CreationMethod[];
}
```

**Implementation:** Combine `getEdition()`, `getAllBooks()`, and `getAllCreationMethods()`

---

#### 3. GET `/api/rulesets/[editionCode]/summary`
**Purpose:** Get summary statistics about ruleset content without full load

**Response:**
```typescript
{
  success: boolean;
  summary: {
    metatypesCount: number;
    skillsCount: number;
    qualitiesCount: number;
    spellsCount: number;
    traditionsCount: number;
    cyberwareCount: number;
    biowareCount: number;
    gearCategories: string[];
    vehicleTypes: string[];
    // ... other summary stats
  };
}
```

**Implementation:** Load ruleset, extract counts, return summary (or create optimized summary endpoint)

**Note:** This is a new endpoint. Alternatively, use existing `/api/rulesets/[editionCode]` and extract summary client-side.

---

## UI/UX Considerations

### Visual Design

- **Consistent with existing UI:** Follow Tailwind CSS patterns and dark mode support
- **Card-based layout:** Use elevation and hover effects for interactivity
- **Responsive design:** Mobile-first, adapts to tablet and desktop
- **Loading states:** Skeleton loaders for async content
- **Error handling:** User-friendly error messages with retry options

### Accessibility

- **Keyboard navigation:** Full keyboard support for all interactive elements
- **Screen readers:** Proper ARIA labels and semantic HTML
- **Focus management:** Clear focus indicators
- **Color contrast:** Meet WCAG AA standards

### Performance

- **Lazy loading:** Load edition details on demand
- **Caching:** Cache edition metadata in client state
- **Optimistic UI:** Show cached data while fetching updates
- **Pagination:** If editions list grows large (future)

### User Flow

1. User navigates to `/rulesets` from sidebar
2. Page loads, displays all available editions in grid
3. User clicks on an edition card
4. Detail view expands/slides in showing:
   - Edition metadata
   - Books list
   - Creation methods
   - Content preview tabs
5. User can:
   - Browse content previews
   - Click "Create Character" to go to `/characters/create` with edition pre-selected
   - Close detail view to return to browser
6. User can navigate directly to character creation from any edition card

---

## Implementation Notes

### File Structure

```
app/rulesets/
├── page.tsx                          # Main page component
├── layout.tsx                        # AuthenticatedLayout wrapper
└── components/
    ├── EditionBrowser.tsx            # Edition grid
    ├── EditionDetailView.tsx         # Detail view
    ├── EditionCard.tsx               # Individual edition card
    ├── BookCard.tsx                  # Book display card
    ├── CreationMethodCard.tsx        # Creation method card
    └── ContentPreviewTabs.tsx         # Content preview interface
```

### Dependencies

- **Existing:**
  - `@/lib/types` - Type definitions
  - `@/lib/storage/editions` - Edition data access
  - `@/lib/rules` - Ruleset loading (for preview)
  - `react-aria-components` - UI components
  - `next/navigation` - Routing

### State Management

- **Client-side state:** Use React `useState` for UI state (selected edition, active tab)
- **Server data:** Fetch via API routes on page load and edition selection
- **Caching:** Consider React Query or SWR for data fetching and caching (future)

### Routing Integration

- **Character creation:** Link to `/characters/create?edition={editionCode}` with pre-selected edition
- **Deep linking:** Support `/rulesets?edition={editionCode}` to open specific edition detail

---

## Acceptance Criteria

### MVP (Minimum Viable Product)

- [x] Page displays all available editions in a grid/list view
- [x] Each edition card shows: name, year, description, availability status
- [x] Clicking an edition opens a detail view
- [x] Detail view shows: edition metadata, books list, creation methods
- [x] "Create Character" button navigates to character creation with edition pre-selected
- [x] Page is responsive (mobile, tablet, desktop)
- [x] Dark mode support
- [x] Loading states for async data
- [x] Error handling for failed API calls
- [x] Accessibility: keyboard navigation, screen reader support

### Enhanced Features (Future)

- [ ] Content preview tabs with actual ruleset data
- [ ] Search/filter editions
- [ ] Edition comparison view
- [ ] Book detail expansion (show rule modules)
- [ ] Export ruleset summary as PDF
- [ ] Favorite/bookmark editions
- [ ] Recent editions history
- [ ] Edition statistics dashboard

---

## Future Enhancements

### Phase 2: Content Exploration

- Full content browser for each ruleset module
- Search within ruleset content
- Bookmark favorite items
- Export content lists

### Phase 3: Comparison Tools

- Side-by-side edition comparison
- Feature matrix (what each edition supports)
- Migration guides (moving characters between editions)

### Phase 4: Advanced Features

- Ruleset customization UI (for GMs)
- Custom book creation interface
- Ruleset validation and testing tools
- Community-contributed content browser

---

## Related Documentation

- **Architecture:** `/docs/architecture/ruleset_architecture_and_source_material_system.md`
- **Edition Support:** `/docs/architecture/edition_support_and_ruleset_architecture.md`
- **Character Creation:** `/docs/architecture/character_creation_framework.md`
- **Wireframe:** `/docs/prompts/design/wireframe-homepage.md` (mentions "View Rulesets")

---

## Open Questions

1. **Content Preview Depth:** How much detail should be shown in preview tabs? Full data or summary only?
   - **Recommendation:** Start with summary/counts, expand to full data on demand

2. **Ruleset Loading:** Should we load full ruleset for preview or create summary endpoints?
   - **Recommendation:** Use existing `/api/rulesets/[editionCode]` endpoint, extract summary client-side initially

3. **Caching Strategy:** How long should edition metadata be cached?
   - **Recommendation:** Cache in React state for session, refresh on page reload

4. **Mobile Experience:** Should detail view be modal, slide-over, or full page?
   - **Recommendation:** Slide-over on desktop, full page on mobile

5. **Search/Filter:** When should search functionality be added?
   - **Recommendation:** Phase 2, when more editions are available

---

## Implementation Priority

**Priority:** Medium  
**Estimated Effort:** 2-3 days  
**Dependencies:** None (all infrastructure exists)  
**Blockers:** None

This feature enhances discoverability and user education but is not critical for MVP character creation workflow. However, it provides significant value for new users understanding the system.

---

## Notes

- This page complements the character creation flow by providing a discovery interface
- Consider adding analytics to track which editions users explore most
- Future: Consider adding user ratings/reviews for editions (community feature)
- Integration with campaign management (future): Allow GMs to specify which editions/books are allowed in their campaigns

