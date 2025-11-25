<!-- bbfa3b59-eb1e-4da5-919a-6839ac3610c1 200b185b-0b6f-433e-b921-4b69a34129b1 -->
# Wire in Missing v5 Database Tabs

Create database tabs for all 11 missing v5 data files following the database-table-guidelines.md patterns.

## Missing Data Files

1. **actions_data.go** → Actions
2. **augmentations_data.go** → Cyberware + Bioware (separate tabs)
3. **complexforms_data.go** → Complex Forms
4. **mentors_data.go** → Mentors
5. **metatypes_data.go** → Metatypes
6. **powers_data.go** → Powers
7. **programs_data.go** → Programs
8. **spells_data.go** → Spells
9. **traditions_data.go** → Traditions
10. **vehical_modifications_data.go** → Vehicle Modifications
11. **vehicles_data.go** → Vehicles

## Implementation Plan

### Phase 1: Backend API Handlers

For each data type, add:

- Handler function in `internal/api/handlers.go` (following existing patterns like `GetArmor`, `GetWeapons`)
- Route registration in `cmd/shadowmaster-server/main.go` under `/api/equipment/` (admin-only routes)

**Files to modify:**

- `internal/api/handlers.go` - Add 11 new handler functions
- `cmd/shadowmaster-server/main.go` - Add 11 new routes

**Handler pattern:**

```go
func (h *Handlers) Get[Entity](w http.ResponseWriter, r *http.Request) {
    items := sr5.GetAll[Entity]()
    // Return JSON response matching existing pattern
}
```

**Special cases:**

- **Augmentations**: Create `GetCyberware` and `GetBioware` handlers (separate endpoints)
- **Vehicle Modifications**: Use `GetAllVehicleModifications()` (note: filename has typo "vehical" but function name is correct)

### Phase 2: Frontend TypeScript Types

Add type definitions in `web/ui/src/lib/types.ts` for all 11 entities, matching the Go struct definitions from v5 package.

**Files to modify:**

- `web/ui/src/lib/types.ts` - Add 12 new type interfaces (11 entities + separate Cyberware/Bioware)

**Type sources:**

- Actions: `pkg/shadowrun/edition/v5/actions.go` - `Action` struct
- Cyberware: `pkg/shadowrun/edition/v5/augmentations.go` - `Cyberware` struct
- Bioware: `pkg/shadowrun/edition/v5/augmentations.go` - `Bioware` struct
- Complex Forms: `pkg/shadowrun/edition/v5/complexforms.go` - `ComplexForm` struct
- Mentors: `pkg/shadowrun/edition/v5/mentors.go` - `Mentor` struct
- Metatypes: `pkg/shadowrun/edition/v5/metatypes.go` - `Metatype` struct
- Powers: `pkg/shadowrun/edition/v5/powers.go` - `Power` struct
- Programs: `pkg/shadowrun/edition/v5/programs.go` - `Program` struct
- Spells: `pkg/shadowrun/edition/v5/spells.go` - `Spell` struct
- Traditions: `pkg/shadowrun/edition/v5/traditions.go` - `Tradition` struct
- Vehicle Modifications: `pkg/shadowrun/edition/v5/vehical_modifications.go` - `VehicleModification` struct
- Vehicles: `pkg/shadowrun/edition/v5/vehicles.go` - `Vehicle` struct

### Phase 3: Frontend API Client

Add API functions in `web/ui/src/lib/api.ts` following existing patterns.

**Files to modify:**

- `web/ui/src/lib/api.ts` - Add 12 new API client functions

**Pattern:**

```typescript
export const [entity]Api = {
  async get[Entity](): Promise<[Entity][]> {
    const response = await apiRequest<{ [entity]: [Entity][] }>('/equipment/[entity]');
    return response.[entity] || [];
  },
};
```

### Phase 4: Frontend Page Components

Create page components following `GearPage.tsx` pattern.

**Files to create:**

- `web/ui/src/pages/ActionsPage.tsx`
- `web/ui/src/pages/CyberwarePage.tsx`
- `web/ui/src/pages/BiowarePage.tsx`
- `web/ui/src/pages/ComplexFormsPage.tsx`
- `web/ui/src/pages/MentorsPage.tsx`
- `web/ui/src/pages/MetatypesPage.tsx`
- `web/ui/src/pages/PowersPage.tsx`
- `web/ui/src/pages/ProgramsPage.tsx`
- `web/ui/src/pages/SpellsPage.tsx`
- `web/ui/src/pages/TraditionsPage.tsx`
- `web/ui/src/pages/VehicleModificationsPage.tsx`
- `web/ui/src/pages/VehiclesPage.tsx`

**Requirements (from guidelines):**

- Use `DatabasePageLayout` wrapper
- Implement data fetching with `useCallback` and `useEffect`
- Use `useToast` for error handling
- Include view mode state if table has grouped/flat views
- Pass all required props to `DatabasePageLayout`

### Phase 5: Frontend Table Components

Create table components following `GearTable.tsx` pattern.

**Files to create (flat tables):**

- `web/ui/src/components/action/ActionsTable.tsx`
- `web/ui/src/components/cyberware/CyberwareTable.tsx`
- `web/ui/src/components/bioware/BiowareTable.tsx`
- `web/ui/src/components/complexform/ComplexFormsTable.tsx`
- `web/ui/src/components/mentor/MentorsTable.tsx`
- `web/ui/src/components/metatype/MetatypesTable.tsx`
- `web/ui/src/components/power/PowersTable.tsx`
- `web/ui/src/components/program/ProgramsTable.tsx`
- `web/ui/src/components/spell/SpellsTable.tsx`
- `web/ui/src/components/tradition/TraditionsTable.tsx`
- `web/ui/src/components/vehicle-modification/VehicleModificationsTable.tsx`
- `web/ui/src/components/vehicle/VehiclesTable.tsx`

**Requirements (from guidelines):**

- Wrap component with `React.memo`
- Memoize column definitions with `useMemo`
- Use `useCallback` for event handlers
- Use `DataTable` component from `../common/DataTable`
- Include filters above table if applicable
- Include view modal for item details
- Memoize filtered data with `useMemo`
- Configure DataTable with proper props (searchFields, rowsPerPageOptions, etc.)

**Grouped tables (if applicable):**

Create grouped versions for entities that benefit from category grouping (similar to `GearTableGrouped.tsx`):

- Spells (by category: Combat, Detection, Health, Illusion, Manipulation)
- Programs (by type: Agent, Commlink App, Common, Hacking)
- Powers (by activation type or category if available)
- Vehicles (by type: Groundcraft, Watercraft, Aircraft, Drone)
- Vehicle Modifications (by type: Base Mods, Power Train, Protection, etc.)
- Actions (by type: Free, Simple, Complex, Interrupt)

### Phase 6: Frontend View Modals

Create view modal components for detailed item views.

**Files to create:**

- `web/ui/src/components/action/ActionViewModal.tsx`
- `web/ui/src/components/cyberware/CyberwareViewModal.tsx`
- `web/ui/src/components/bioware/BiowareViewModal.tsx`
- `web/ui/src/components/complexform/ComplexFormViewModal.tsx`
- `web/ui/src/components/mentor/MentorViewModal.tsx`
- `web/ui/src/components/metatype/MetatypeViewModal.tsx`
- `web/ui/src/components/power/PowerViewModal.tsx`
- `web/ui/src/components/program/ProgramViewModal.tsx`
- `web/ui/src/components/spell/SpellViewModal.tsx`
- `web/ui/src/components/tradition/TraditionViewModal.tsx`
- `web/ui/src/components/vehicle-modification/VehicleModificationViewModal.tsx`
- `web/ui/src/components/vehicle/VehicleViewModal.tsx`

**Pattern:** Follow `GearViewModal.tsx` or `BookViewModal.tsx` for simpler entities.

### Phase 7: Frontend Filters (if applicable)

Create filter components for entities that benefit from filtering.

**Likely candidates:**

- Source filters (all entities should have this)
- Category filters (Spells, Programs, Powers, Vehicles, Vehicle Modifications, Actions)
- Type filters (Cyberware by Part, Bioware by Type, etc.)

**Files to create (as needed):**

- `web/ui/src/components/[entity]/[Entity]CategoryFilter.tsx`
- `web/ui/src/components/[entity]/[Entity]SourceFilter.tsx`

### Phase 8: Routes and Navigation

Add routes and update navigation.

**Files to modify:**

- `web/ui/src/App.tsx` - Add 12 new routes under admin-only section
- `web/ui/src/components/layout/AppLayout.tsx` - Add 12 new nested tabs under Database

**Route pattern:**

```typescript
<Route
  path="/[entity]"
  element={
    <AdminRoute>
      <[Entity]Page />
    </AdminRoute>
  }
/>
```

**Tab organization (initial - will reorganize in Phase 9):**

Add all tabs alphabetically or by logical grouping under Database nested tabs.

### Phase 9: Tab Organization

Reorganize tabs into logical groups for better UX.

**Proposed organization:**

1. **Combat & Actions**

   - Actions
   - Weapons
   - Weapon Accessories
   - Weapon Consumables
   - Armor

2. **Equipment & Gear**

   - Gear
   - Vehicles
   - Vehicle Modifications

3. **Augmentations**

   - Cyberware
   - Bioware

4. **Magic**

   - Spells
   - Traditions
   - Mentors
   - Powers

5. **Matrix**

   - Programs
   - Complex Forms

6. **Character Creation**

   - Metatypes
   - Qualities
   - Skills
   - Lifestyles
   - Contacts

7. **Reference**

   - Books

**Implementation:**

- Update `AppLayout.tsx` to organize nested tabs into logical groups
- Consider using section headers or visual separators if needed
- Maintain alphabetical order within each group

## Implementation Order

1. Backend handlers and routes (Phase 1)
2. TypeScript types (Phase 2)
3. API client functions (Phase 3)
4. Page components (Phase 4)
5. Table components (Phase 5)
6. View modals (Phase 6)
7. Filters (Phase 7)
8. Routes and navigation (Phase 8)
9. Tab organization (Phase 9)

## Key Guidelines to Follow

From `database-table-guidelines.md`:

- ✅ All table components must be memoized with `React.memo`
- ✅ Column definitions must be wrapped in `useMemo`
- ✅ Event handlers must use `useCallback`
- ✅ Filtered data must use `useMemo` with proper dependencies
- ✅ Use `DatabasePageLayout` for all pages
- ✅ Use `DataTable` component with proper configuration
- ✅ Include view modals for detailed item views
- ✅ Use `useToast` for error handling
- ✅ Loading states handled by `DatabasePageLayout`
- ✅ Follow existing file structure conventions
- ✅ Provide proper TypeScript types
- ✅ Include accessibility labels

## Testing Considerations

- Verify all API endpoints return correct data
- Test table sorting, filtering, and pagination
- Verify view modals display all relevant information
- Test responsive design
- Verify admin-only access restrictions
- Test tab navigation and organization

### To-dos

- [x] Add 11 backend API handlers in handlers.go (Actions, Cyberware, Bioware, ComplexForms, Mentors, Metatypes, Powers, Programs, Spells, Traditions, VehicleModifications, Vehicles)
- [x] Add 12 API routes in main.go under /api/equipment/ (admin-only)
- [x] Add TypeScript type definitions in types.ts for all 12 entities (matching Go structs)
- [x] Add 12 API client functions in api.ts following existing patterns
- [x] Create 12 page components following GearPage.tsx pattern with DatabasePageLayout
- [x] Create 12 flat table components following GearTable.tsx pattern with React.memo, useMemo, useCallback
- [x] Create grouped table components for entities that benefit from category grouping (Spells, Programs, Powers, Vehicles, VehicleModifications, Actions)
- [x] Create 12 view modal components for detailed item views
- [x] Create filter components (CategoryFilter, SourceFilter) for entities that need filtering
- [x] Add 12 routes in App.tsx and update AppLayout.tsx with nested tabs
- [x] Reorganize tabs into logical groups (Combat, Equipment, Augmentations, Magic, Matrix, Character Creation, Reference)