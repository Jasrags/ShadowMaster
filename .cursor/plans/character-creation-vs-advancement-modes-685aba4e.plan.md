<!-- 685aba4e-78a6-4279-bb09-c59aae77591d d6258782-9e29-44e1-88a6-9e4515ac43b1 -->
# Character Creation vs Advancement Modes Implementation

## Overview

Implement a status-based system for characters with three states: Creation, Review, and Advancement. The character sheet will display different UI and functionality based on the character's current status.

## Backend Changes

### 1. Character Creation Status Initialization

- **File**: `pkg/shadowrun/edition/v5/character.go` (or equivalent edition handler)
- Set character `Status` field to `"Creation"` when character is first created
- Ensure status is included in character creation response

### 2. Status Update Endpoint (if needed)

- **File**: `internal/api/handlers.go`
- Verify `UpdateCharacter` handler properly updates status field
- Consider adding validation for status transitions (Creation → Review → Advancement)

## Frontend Changes

### 3. Character Sheet Page - SR5 Labeling

- **File**: `web/ui/src/pages/CharacterSheetPage.tsx`
- Add "Shadowrun 5th Edition Character Sheet" header/title
- Consider renaming component to `CharacterSheetPageSR5` for clarity
- Add edition indicator in the page header

### 4. Status Detection and Conditional Rendering

- **File**: `web/ui/src/pages/CharacterSheetPage.tsx`
- Read `character.status` field
- Create helper function `getCharacterMode()` that returns "creation" | "review" | "advancement"
- Add conditional rendering based on status:
- **Creation mode**: Display creation-specific info, foundation for editing interface (to be built incrementally)
- **Review mode**: Show read-only view with "Move to Advancement" button
- **Advancement mode**: Show read-only view (no edit buttons)

### 5. Status Transition UI

- **File**: `web/ui/src/pages/CharacterSheetPage.tsx`
- Add status badge/indicator showing current status
- Add "Move to Review" button (Creation → Review)
- Add "Move to Advancement" button (Review → Advancement)
- Implement status update API call using existing `characterApi.updateCharacter()`
- Add confirmation dialog for status transitions
- Show success/error toast messages

### 6. Campaign Rules Integration (Creation Mode)

- **File**: `web/ui/src/pages/CharacterSheetPage.tsx`
- When character has `campaign_id`, fetch campaign data to get creation method rules
- Display campaign creation method restrictions/options
- Note: Creation choices editing interface will be built incrementally (not in MVP)

### 7. API Client Updates

- **File**: `web/ui/src/lib/api.ts`
- Verify `updateCharacter()` method exists and handles status updates
- Add method if missing: `updateCharacterStatus(id: string, status: string)`

### 8. Type Definitions

- **File**: `web/ui/src/lib/types.ts`
- Add type for character status: `type CharacterStatus = 'Creation' | 'Review' | 'Advancement'`
- Update `Character` interface to include status field (if not already present)

## UI/UX Considerations

### 9. Visual Status Indicators

- Add colored status badges:
- Creation: Yellow/Orange (in progress)
- Review: Blue (pending approval)
- Advancement: Green (active)
- Display status prominently in character sheet header

### 10. Mode-Specific Features

- **Creation Mode**:
- Show campaign creation rules if applicable
- Display creation method used (Priority/Sum-to-Ten/Karma)
- Foundation/placeholder for creation choices editing interface (to be built incrementally)

- **Review Mode**:
- Read-only display
- "Move to Advancement" button with confirmation
- Optional: Display what will change when moving to advancement

- **Advancement Mode**:
- Read-only display (for now)
- Future: Will show karma/nuyen spending UI (out of scope for MVP)

## MVP Scope Considerations

### Included:

- Status field initialization on character creation
- Status detection and conditional UI rendering
- Status transition buttons (Creation → Review → Advancement)
- SR5-specific labeling
- Read-only advancement mode
- Campaign rules display in creation mode
- Foundation for creation choices editing (to be built incrementally)

### Out of Scope (Future):

- GM approval workflow for status transitions
- Full creation choices editing interface (will be built incrementally)
- Advancement rules implementation (karma spending, etc.)
- Validation of character completeness before status transitions
- Multi-edition character sheet components

## Testing Considerations

- Test status transitions work correctly
- Verify character sheet displays correctly in each mode
- Ensure campaign rules are displayed when character has campaign_id
- Test status update API calls succeed/fail appropriately

### To-dos

- [x] Create CharacterSheetPage component with all sections from PDF
- [x] Add route for character sheet page in App.tsx
- [x] Update CharacterTable to navigate to character sheet on View click
- [x] Set character status to 'Creation' when character is created in edition handlers
- [x] Add CharacterStatus type and ensure Character interface includes status field
- [x] Verify/update characterApi.updateCharacter() handles status updates
- [x] Add 'Shadowrun 5th Edition Character Sheet' label to character sheet page
- [x] Add status detection logic and getCharacterMode() helper function
- [x] Add visual status badge/indicator in character sheet header
- [x] Implement conditional UI rendering based on character status (Creation/Review/Advancement)
- [x] Add status transition buttons (Move to Review, Move to Advancement) with confirmation dialogs
- [x] Fetch and display campaign creation rules when character has campaign_id
- [x] Add 'Edit Character' button in Creation mode that links to creation wizard