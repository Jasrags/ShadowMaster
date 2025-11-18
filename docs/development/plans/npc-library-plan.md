# NPC Library Plan for Game Masters

_Last updated: 2025-01-27_

## Executive Summary

This plan outlines the design and implementation of an NPC (Non-Player Character) library system that enables game masters to create, organize, reuse, and quickly access NPCs across their campaigns. The NPC library addresses the GM persona's need for reusable content and fast reference access during live play sessions.

---

## 1. Goals & User Stories

### Primary Goals
1. **Reusability**: GMs can create NPCs once and reuse them across multiple campaigns, sessions, and scenes.
2. **Quick Access**: During live sessions, GMs can instantly find and reference NPC stat blocks, relationships, and notes.
3. **Organization**: NPCs can be tagged, categorized, and filtered by role, faction, campaign, or custom criteria.
4. **Flexibility**: NPCs support both full character sheets (for major NPCs) and simplified stat blocks (for minor NPCs).
5. **Campaign Integration**: NPCs seamlessly integrate with campaigns, sessions, and scenes for encounter planning and live play.

### User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| **GM** | Create NPCs with full character stats (attributes, skills, gear) | I can run complex encounters with mechanically accurate NPCs |
| **GM** | Create quick NPC stat blocks with minimal fields | I can populate scenes with minor NPCs without full character creation overhead |
| **GM** | Tag NPCs with roles (Fixer, Johnson, Opposition), factions, and custom tags | I can quickly filter and find NPCs by context |
| **GM** | Save NPCs to a personal library | I can reuse NPCs across multiple campaigns |
| **GM** | Clone NPCs from my library or other campaigns | I can adapt existing NPCs for new contexts without losing originals |
| **GM** | Link NPCs to campaigns, sessions, and scenes | I can plan encounters and track which NPCs appear where |
| **GM** | Search and filter NPCs by name, tags, faction, campaign, or role | I can find the right NPC quickly during prep or live play |
| **GM** | View NPCs in a table/list view with key stats visible | I can scan multiple NPCs at once for selection |
| **GM** | Access NPC details in a modal or drawer during scene prep | I can review NPC stats without leaving my current workflow |
| **GM** | Export NPCs to share with other GMs | I can contribute to community NPC libraries |
| **GM** | Import NPCs from external sources (JSON, Chummer data) | I can leverage existing NPC collections |

---

## 2. Domain Model & Data Structure

### 2.1 Core NPC Entity

The NPC library extends the existing `Character` domain model with NPC-specific metadata and library management fields:

```go
// Character already has:
// - ID, Name, UserID (empty for NPCs), CampaignID, IsNPC=true
// - Edition, EditionData (full character stats)
// - CreatedAt, UpdatedAt

// New NPC Library fields to add:
type NPCLibraryMetadata struct {
    // Library organization
    Tags           []string `json:"tags"`           // ["Fixer", "Ares", "Seattle"]
    Role           string   `json:"role,omitempty"`  // "Fixer", "Johnson", "Opposition", "Contact", "Dealer"
    Faction        string   `json:"faction,omitempty"` // Links to CampaignFaction
    
    // Reusability
    IsTemplate     bool     `json:"is_template"`    // True if saved to personal library
    TemplateName   string   `json:"template_name,omitempty"` // User-friendly template name
    SourceCampaign string   `json:"source_campaign,omitempty"` // Original campaign if cloned
    
    // Quick reference
    QuickNotes     string   `json:"quick_notes,omitempty"` // GM notes, motivations, hooks
    Appearance     string   `json:"appearance,omitempty"`  // Physical description
    Personality    string   `json:"personality,omitempty"` // Behavioral notes
    
    // Usage tracking
    UsedInSessions []string `json:"used_in_sessions,omitempty"` // Session IDs
    UsedInScenes   []string `json:"used_in_scenes,omitempty"`   // Scene IDs
    LastUsedAt     *time.Time `json:"last_used_at,omitempty"`
    
    // Visibility & sharing (future)
    IsPublic       bool     `json:"is_public"`      // For community sharing
    SharedBy       string   `json:"shared_by,omitempty"` // User ID if shared
}
```

### 2.2 NPC Template Types

Support two creation modes:

1. **Full Character NPC**: Complete character sheet with all attributes, skills, gear, cyberware, etc. (uses existing `CharacterSR3` or `CharacterSR5` structure)
2. **Quick Stat Block NPC**: Simplified NPC with only essential combat/social stats for minor characters

```go
// QuickStatBlock for minor NPCs (optional, stored in EditionData when simplified)
type QuickStatBlock struct {
    // Core attributes (minimal set)
    Body       int `json:"body"`
    Agility    int `json:"agility"`
    Reaction   int `json:"reaction"`
    Willpower  int `json:"willpower"`
    
    // Key skills (only what's needed)
    KeySkills  map[string]int `json:"key_skills"` // e.g., {"Firearms": 4, "Intimidation": 3}
    
    // Combat stats
    Initiative int `json:"initiative"`
    Defense    int `json:"defense"`
    Soak       int `json:"soak"`
    
    // Equipment (simplified)
    PrimaryWeapon string `json:"primary_weapon,omitempty"`
    ArmorRating   int    `json:"armor_rating,omitempty"`
    
    // Notes
    Notes string `json:"notes,omitempty"`
}
```

### 2.3 Relationships

```
User (GM)
  └─> NPC Library (templates with IsTemplate=true)
       └─> NPC Instances (cloned into campaigns)

Campaign
  ├─> NPCs (CampaignID set, IsNPC=true)
  └─> Factions
       └─> NPCs (Faction tag matches)

Session
  └─> Scenes
       └─> NPCs (referenced in scene participants)

Scene
  └─> NPCs (via InitiativeOrder or participant list)
```

---

## 3. Backend Architecture

### 3.1 Service Layer

Create `NPCService` to encapsulate NPC library business logic:

```go
// internal/service/npc_service.go
type NPCService struct {
    characterRepo repository.CharacterRepository
    campaignRepo  repository.CampaignRepository
    sessionRepo   repository.SessionRepository
    sceneRepo     repository.SceneRepository
}

// Key methods:
- CreateNPC(input NPCCreateInput) (*domain.Character, error)
- CreateQuickNPC(input QuickNPCCreateInput) (*domain.Character, error)
- GetNPC(id string) (*domain.Character, error)
- ListNPCs(filter NPCListFilter) ([]*domain.Character, error)
- ListNPCTemplates(userID string) ([]*domain.Character, error)
- CloneNPC(npcID string, targetCampaignID string) (*domain.Character, error)
- UpdateNPC(id string, input NPCUpdateInput) (*domain.Character, error)
- DeleteNPC(id string) error
- SearchNPCs(query string, filters NPCListFilter) ([]*domain.Character, error)
- LinkNPCToScene(npcID string, sceneID string) error
- GetNPCsForCampaign(campaignID string) ([]*domain.Character, error)
- GetNPCsForScene(sceneID string) ([]*domain.Character, error)
```

### 3.2 Repository Extensions

Extend `CharacterRepository` with NPC-specific queries:

```go
// internal/repository/character.go (extend existing)
- GetNPCsByCampaign(campaignID string) ([]*domain.Character, error)
- GetNPCsByTags(tags []string) ([]*domain.Character, error)
- GetNPCsByFaction(faction string) ([]*domain.Character, error)
- GetNPCTemplates(userID string) ([]*domain.Character, error)
- SearchNPCs(query string, filters NPCSearchFilters) ([]*domain.Character, error)
```

### 3.3 API Endpoints

Add REST endpoints under `/api/npcs`:

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `GET` | `/api/npcs` | List NPCs with filters (campaign, tags, role, faction) | GM/Admin |
| `GET` | `/api/npcs/templates` | List user's NPC templates (library) | Authenticated |
| `GET` | `/api/npcs/{id}` | Get NPC details | GM/Admin |
| `POST` | `/api/npcs` | Create new NPC | GM/Admin |
| `POST` | `/api/npcs/quick` | Create quick stat block NPC | GM/Admin |
| `POST` | `/api/npcs/{id}/clone` | Clone NPC to campaign | GM/Admin |
| `PUT` | `/api/npcs/{id}` | Update NPC | GM/Admin |
| `DELETE` | `/api/npcs/{id}` | Delete NPC | GM/Admin |
| `GET` | `/api/npcs/search?q={query}` | Search NPCs by name/tags | GM/Admin |
| `GET` | `/api/campaigns/{id}/npcs` | Get NPCs for campaign | GM/Admin |
| `GET` | `/api/scenes/{id}/npcs` | Get NPCs for scene | GM/Admin |
| `POST` | `/api/scenes/{id}/npcs/{npcId}` | Link NPC to scene | GM/Admin |

### 3.4 Validation & Business Rules

- **Ownership**: NPCs belong to campaigns (CampaignID required). Templates (IsTemplate=true) are user-owned.
- **RBAC**: Only GMs and Admins can create/manage NPCs. Players can view NPCs in their campaigns (read-only).
- **Cloning**: When cloning an NPC, create a new Character record with a new ID, copy all stats, set source metadata.
- **Deletion**: Deleting an NPC removes it from the campaign. If it's linked to scenes, warn or require unlinking first.
- **Templates**: Saving to library sets `IsTemplate=true` and clears `CampaignID` (or stores original campaign in metadata).

---

## 4. Frontend Architecture

### 4.1 React Components

#### NPC Library View (`NPCLibrary.tsx`)
- Main table/list view of NPCs
- Filters: Campaign, Tags, Role, Faction, Search query
- Actions: Create NPC, Create Quick NPC, Clone, Edit, Delete
- Uses shared `DataTable` component (reuse from campaign table)

#### NPC Creation Modal (`NPCCreationModal.tsx`)
- Wizard-style form for full NPC creation
- Reuses character creation wizard steps (Priority/Metatype/Attributes/Skills/Gear)
- Adds NPC-specific fields: Tags, Role, Faction, Quick Notes, Appearance, Personality
- Option to save as template to library

#### Quick NPC Creation (`QuickNPCCreationModal.tsx`)
- Simplified form for quick stat blocks
- Fields: Name, Core Attributes, Key Skills, Combat Stats, Equipment, Notes
- Faster creation path for minor NPCs

#### NPC Detail Drawer (`NPCDetailDrawer.tsx`)
- Slide-out panel showing full NPC details
- Tabs: Stats, Skills, Equipment, Notes, Usage History
- Quick actions: Clone, Edit, Link to Scene, Delete
- Accessible from table row click or scene participant list

#### NPC Selector (`NPCSelector.tsx`)
- Searchable dropdown/autocomplete for selecting NPCs
- Used in scene prep to add NPCs to encounters
- Shows name, role, and tags for quick identification

### 4.2 Integration Points

- **Campaign Management**: Add "NPCs" tab in campaign detail view
- **Scene Prep**: Add NPC selector to scene creation/editing
- **Session View**: Show NPCs participating in session scenes
- **Character Table**: Filter to show NPCs only (`is_npc=true`)

### 4.3 State Management

- Use React Context (`NPCContext`) for NPC library state
- Cache NPC lists per campaign to reduce API calls
- Optimistic updates for create/update/delete operations

---

## 5. Data Model Extensions

### 5.1 Character Domain Updates

Extend `domain.Character` to include NPC library metadata:

```go
// Add to Character struct:
NPCLibraryMetadata *NPCLibraryMetadata `json:"npc_library_metadata,omitempty"`
```

### 5.2 Index Updates

Update `internal/repository/json/index.go` to maintain:
- Campaign → NPC IDs mapping
- User → NPC Template IDs mapping
- Tag → NPC IDs mapping (for quick filtering)
- Faction → NPC IDs mapping

### 5.3 Storage Structure

```
data/
  characters/
    {id}.json          # Individual NPC files (same as PCs)
  index.json            # Updated with NPC indexes
```

---

## 6. Implementation Phases

### Phase 1: Foundation (Backend Core)
**Goal**: Enable basic NPC creation and storage

- [ ] Extend `Character` domain model with `NPCLibraryMetadata`
- [ ] Add NPC-specific repository methods (`GetNPCsByCampaign`, `GetNPCTemplates`, etc.)
- [ ] Create `NPCService` with core CRUD operations
- [ ] Add API endpoints for NPC creation, listing, retrieval
- [ ] Add RBAC middleware to NPC routes
- [ ] Write Go unit tests for service layer
- [ ] Write API integration tests

**Deliverables**: Backend API supports NPC CRUD operations

---

### Phase 2: Library & Organization
**Goal**: Enable NPC templates and library management

- [ ] Implement template saving (`IsTemplate` flag, user library)
- [ ] Add tagging system (tags stored in metadata)
- [ ] Implement NPC cloning functionality
- [ ] Add search and filtering endpoints
- [ ] Update repository indexes for tags and templates
- [ ] Add API endpoints for templates and cloning

**Deliverables**: GMs can save NPCs to library and clone them

---

### Phase 3: Frontend - NPC Management UI
**Goal**: React UI for NPC library management

- [ ] Create `NPCLibrary` component (table view with filters)
- [ ] Create `NPCCreationModal` (full NPC wizard)
- [ ] Create `NPCDetailDrawer` (detail view)
- [ ] Integrate with campaign management (NPCs tab)
- [ ] Add NPC context for state management
- [ ] Write React unit tests

**Deliverables**: GMs can create and manage NPCs via React UI

---

### Phase 4: Quick NPCs & Scene Integration
**Goal**: Simplified NPC creation and scene linking

- [ ] Implement `QuickStatBlock` data structure
- [ ] Create `QuickNPCCreationModal` component
- [ ] Add NPC selector to scene creation/editing
- [ ] Display NPCs in scene detail views
- [ ] Track NPC usage (sessions/scenes) in metadata
- [ ] Update scene domain to reference NPCs

**Deliverables**: Quick NPC creation and scene integration

---

### Phase 5: Advanced Features
**Goal**: Enhanced organization and sharing

- [ ] Faction linking (NPCs associated with campaign factions)
- [ ] Role-based filtering and templates (Fixer, Johnson, etc.)
- [ ] NPC usage history and analytics
- [ ] Export/import functionality (JSON format)
- [ ] Bulk operations (tag multiple NPCs, delete multiple)
- [ ] Advanced search (full-text, multiple filters)

**Deliverables**: Rich NPC library with advanced organization

---

### Phase 6: Community & Sharing (Future)
**Goal**: Enable NPC sharing between GMs

- [ ] Public NPC library (shared templates)
- [ ] NPC rating and reviews
- [ ] Import from Chummer data
- [ ] NPC marketplace/curation

**Deliverables**: Community NPC sharing features

---

## 7. Technical Considerations

### 7.1 Performance
- Index NPCs by campaign, tags, and faction for fast filtering
- Cache NPC lists in frontend context
- Paginate large NPC lists (if >100 NPCs per campaign)
- Lazy load NPC details (only fetch full stats when drawer opens)

### 7.2 Data Migration
- Existing NPCs (IsNPC=true) need metadata backfill
- Add default tags based on existing data if possible
- Migration script to populate NPCLibraryMetadata for legacy NPCs

### 7.3 Edition Support
- NPC creation respects campaign edition (SR3 vs SR5)
- Quick stat blocks are edition-agnostic (simplified)
- Full NPCs use edition-specific character data structures

### 7.4 Validation
- NPC names must be unique within a campaign (or warn on duplicates)
- Tags should be normalized (lowercase, trimmed)
- Role values should be validated against allowed list
- Faction references must exist in campaign

---

## 8. User Experience Flow

### Creating a Full NPC
1. GM navigates to Campaign → NPCs tab
2. Clicks "Create NPC" button
3. Modal opens with character creation wizard (reuses existing steps)
4. After character creation steps, shows NPC-specific fields:
   - Tags (multi-select or free-form)
   - Role (dropdown: Fixer, Johnson, Opposition, Contact, Dealer, Other)
   - Faction (dropdown from campaign factions)
   - Quick Notes, Appearance, Personality (text areas)
5. Option to "Save to Library" checkbox
6. Click "Create" → NPC created and added to campaign

### Creating a Quick NPC
1. GM clicks "Create Quick NPC" button
2. Simplified modal opens with:
   - Name, Role, Tags
   - Core Attributes (Body, Agility, Reaction, Willpower)
   - Key Skills (add/remove skills dynamically)
   - Combat Stats (Initiative, Defense, Soak)
   - Primary Weapon, Armor Rating
   - Notes
3. Click "Create" → Quick NPC created

### Using NPCs in Scenes
1. GM creates/edits a scene
2. Clicks "Add NPC" button
3. NPC selector opens (searchable, filtered by campaign)
4. Selects NPC(s) → NPCs added to scene participants
5. NPCs appear in scene detail view and initiative tracker

### Cloning NPCs
1. GM views NPC detail drawer
2. Clicks "Clone" button
3. Modal asks: "Clone to which campaign?" (dropdown)
4. Option to modify name/tags during clone
5. Click "Clone" → New NPC created in target campaign

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| NPC creation time (full) | < 5 minutes | Time from click to save |
| NPC creation time (quick) | < 1 minute | Time from click to save |
| NPC reuse rate | > 30% of NPCs cloned at least once | Track clone operations |
| NPC library usage | > 50% of GMs save at least 5 templates | Track IsTemplate=true |
| Scene NPC linking | > 80% of combat scenes have NPCs | Track scene → NPC links |
| Search effectiveness | < 3 seconds to find NPC | Time from search to result |

---

## 10. Open Questions & Decisions Needed

1. **Template Storage**: Should templates be stored separately from campaign NPCs, or use the same Character table with IsTemplate flag?
   - **Decision**: Use same table with `IsTemplate=true` and `CampaignID` empty for templates

2. **Quick NPCs**: Should quick stat blocks use a separate entity type or be stored as simplified Character records?
   - **Decision**: Store as Character records with simplified `EditionData` (QuickStatBlock structure)

3. **NPC Ownership**: Can NPCs belong to multiple campaigns, or must they be cloned?
   - **Decision**: NPCs belong to one campaign; use cloning for reuse

4. **Deletion Behavior**: What happens when deleting an NPC that's linked to scenes?
   - **Decision**: Warn user, require explicit unlinking, or soft-delete with "archived" status

5. **Tag System**: Free-form tags or predefined tag categories?
   - **Decision**: Hybrid - allow free-form tags but suggest common tags (Fixer, Johnson, etc.)

6. **NPC Limits**: Should there be limits on NPCs per campaign?
   - **Decision**: No hard limits initially; monitor performance and add pagination if needed

---

## 11. Dependencies & Prerequisites

- ✅ Character domain model exists with `IsNPC` field
- ✅ Campaign, Session, Scene domain models exist
- ✅ Character creation wizard exists (can be reused)
- ✅ RBAC system in place
- ✅ React component library (`DataTable`, modals, drawers)
- ⚙️ Scene participant linking (may need enhancement)

---

## 12. Related Documentation

- `docs/product/personas/gamemaster_persona_shadowrun.md` - GM workflow and needs
- `docs/architecture/application-plan.md` - Overall architecture
- `docs/development/plans/campaign-creation-flow.md` - Campaign creation patterns
- `docs/product/domain-brief.md` - Domain model overview

---

## 13. Next Steps

1. **Review & Approve Plan**: Get stakeholder feedback on approach and priorities
2. **Phase 1 Kickoff**: Start with backend foundation (domain model extensions, service layer)
3. **API Design Review**: Validate REST endpoint design before implementation
4. **UI Mockups**: Create mockups for NPC library UI components
5. **Data Migration Plan**: Design migration strategy for existing NPCs

---

**Document Owner**: Engineering Team  
**Reviewers**: Product, Engineering Leads  
**Status**: Draft - Awaiting Review
