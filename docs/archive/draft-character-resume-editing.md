# Feature Request Template

## (Tailored for Game/Character Management Applications)

## Overview

**Feature Name:** Draft Character Resume Editing
**Requested By:** Development Team
**Date:** 2025-01-10
**Priority:** High
**Category:** Character Creation, Character Management
**Affected Editions:** All editions (SR5, SR6, Anarchy, etc.)

---

## Problem Statement

**What problem does this solve?**
Currently, when users start creating a character, the creation state is saved to localStorage, which means:

1. Drafts are not visible in the characters list, making it hard to track work-in-progress characters
2. Drafts cannot be resumed if the user switches devices or browsers
3. There's no clear way to continue editing an incomplete character
4. The "Create Character" flow always starts fresh, even if there are existing drafts

**Who would benefit from this?**

- **Players creating characters**: Can pause and resume character creation across devices
- **Character Builders**: Can work on multiple characters simultaneously and easily switch between them
- **Mobile users**: Can start on desktop and finish on mobile (or vice versa)

**Current Workaround:**

- Users must complete character creation in a single session
- If they close the browser or switch devices, they lose progress (localStorage is device-specific)
- Users can manually create a draft via API, but there's no UI to resume it

**Game Impact:**

- Character creation is a complex, multi-step process that can take 30+ minutes
- Losing progress is frustrating and discourages users from creating characters
- The inability to resume drafts makes the system less user-friendly

---

## Proposed Solution

**Feature Description:**
Enable draft characters to appear in the characters list with a "Resume Editing" action. When a draft character is selected, the creation wizard should load the existing draft state and allow the user to continue from where they left off. The "Create Character" button should only create new characters, not resume existing drafts.

**User Stories:**

- As a player, I want to see my draft characters in the characters list so that I know what I'm working on
- As a player, I want to click on a draft character to resume editing so that I can continue where I left off
- As a player, I want my draft progress to be saved server-side so that I can access it from any device
- As a player, I want "Create Character" to always start a new character so that I don't accidentally resume an old draft

**Key Functionality:**

1. **Draft Visibility**: Draft characters appear in the characters list with a visual indicator (status badge)
2. **Resume Action**: Clicking a draft character opens the creation wizard with the saved state loaded
3. **Server-Side Persistence**: Draft state is saved to the server (already exists via `createCharacterDraft` API)
4. **State Loading**: Creation wizard loads draft state from server instead of localStorage when resuming
5. **Clear Separation**: "Create Character" always starts fresh; drafts are resumed via the characters list

---

## Game Mechanics Integration

**Related Game Rules:**

- All editions (SR5, SR6, Anarchy, etc.)
- Character creation rules remain unchanged
- Draft status is already defined in the character type system

**Rules Compliance:**

- No rule changes required
- Draft characters maintain the same validation rules as active characters
- Finalization process (draft → active) remains unchanged

**Edition Considerations:**

- Works across all editions since draft status is edition-agnostic
- Each edition's creation method is preserved in the draft
- Ruleset snapshot is maintained when resuming

---

## User Experience

**User Flow:**

1. User starts creating a character via "Create Character"
2. System creates a server-side draft (already implemented)
3. User makes progress through wizard steps
4. User closes browser or switches devices
5. User navigates to Characters list
6. Draft character appears with "Draft" status badge
7. User clicks on draft character
8. System loads creation wizard with saved state
9. User continues from where they left off
10. User completes character and finalizes (status changes to "active")

**UI/UX Considerations:**

- **Draft Badge**: Draft characters show an amber/yellow "DRAFT" badge (already implemented in character detail page)
- **Resume Button**: Draft characters in the list should have a prominent "Resume Editing" button or action
- **Visual Distinction**: Draft cards can have a subtle border or background color to distinguish from active characters
- **Progress Indicator**: Show creation progress (e.g., "Step 3 of 8") on draft character cards
- **Last Updated**: Display when the draft was last modified to help users identify recent work
- **Navigation**: Clicking a draft character should navigate to `/characters/[id]/edit` or similar resume route

**Character Sheet Integration:**

- Draft characters can still be viewed on the character sheet (already supported)
- Character sheet should show a "Resume Creation" button for draft characters
- Character sheet edit button should also resume creation for drafts

**Example/Inspiration:**

- Similar to Google Docs "Continue editing" functionality
- Many character builders (D&D Beyond, Hero Lab) show drafts in the character list
- Drafts are typically sorted by "last updated" to show most recent work first

---

## Technical Considerations

> **📋 Technical Specification:** For detailed API contracts, route structures, error handling, and implementation details, see the [Technical Specification](./draft-character-resume-editing-technical-spec.md).

**Technical Approach:**

1. Modify character creation wizard to accept an optional `characterId` prop
2. When `characterId` is provided, load existing draft from API (includes `character.metadata.creationState`)
3. Restore wizard state from `creationState` instead of creating new state
4. Update characters list to show drafts and handle resume action (clicking card navigates to resume route)
5. Replace localStorage-based draft saving with server-side persistence:
   - Save `CreationState` to `character.metadata.creationState` on every state change
   - Update character via `PATCH /api/characters/[id]` with both character data and creationState
6. Create resume route: `/characters/[id]/edit` or `/characters/create?resume=[id]`

**Calculation Engine:**

- No changes to calculation logic required
- Draft state includes all necessary creation state (priorities, selections, budgets)
- Validation rules apply the same to drafts

**Data Requirements:**

- **Character Data**: Draft character already exists in storage with `status: "draft"`
- **Creation State**: Store `CreationState` in `character.metadata.creationState`
  - Contains: `currentStep`, `completedSteps`, `budgets`, `selections`, `priorities`, `errors`, `warnings`
  - Updated on every wizard state change during creation
  - Can be removed on finalization (or kept for audit trail)

**Performance:**

- Loading draft state should be fast (single API call)
- No real-time calculation requirements beyond existing wizard behavior
- Caching: Ruleset is already cached via RulesetContext

**Integration Points:**

- **API Changes**:
  - `GET /api/characters/[id]` - Already returns draft characters with metadata (includes `creationState`)
  - `PATCH /api/characters/[id]` - Update both character data and `metadata.creationState` during creation
  - No new endpoints needed - creationState is part of character metadata
- **Component Changes**:
  - `CreationWizard` - Accept optional `characterId` prop, load `creationState` from character metadata when provided
  - `CharactersPage` - Show drafts in list (already shows all characters), clicking draft navigates to resume route
  - `CharacterCard` - Clicking a draft character card navigates to resume route (no separate button needed)
- **Route Changes**:
  - `/characters/create` - Always creates new character (no change)
  - `/characters/[id]/edit` - New route for resuming drafts (loads character with creationState and shows wizard)

---

## Acceptance Criteria

- [ ] Draft characters appear in the characters list with "Draft" status badge
- [ ] Draft characters are sorted by "last updated" by default when filtering by draft status
- [ ] Clicking a draft character card navigates to creation wizard with saved state loaded
- [ ] Creation wizard correctly restores all creation state from `character.metadata.creationState` (step, priorities, selections, budgets)
- [ ] "Create Character" button always starts a new character (does not resume drafts)
- [ ] Draft state is persisted server-side and accessible from any device
- [ ] Resuming a draft shows the correct step in the wizard
- [ ] Draft characters can be deleted from the characters list
- [ ] Character sheet shows "Resume Creation" button for draft characters
- [ ] Works correctly for all supported editions (SR5, SR6, etc.)

---

## Success Metrics

**How will we measure success?**

- **User adoption**: % of users who create and resume draft characters
- **Completion rate**: Increase in character creation completion rate
- **Cross-device usage**: % of users who resume drafts on different devices
- **Time saved**: Reduction in abandoned character creations
- **User satisfaction**: Positive feedback on draft resume functionality

**Target Goals:**

- 80% of started characters are completed (vs. current abandonment rate)
- 50% of users resume at least one draft character
- Zero reports of lost draft progress due to device switching

---

## Game Rules Validation

**Test Cases:**

- Create a draft character, close browser, resume on same device
- Create a draft character, resume on different device/browser
- Create multiple drafts, verify all appear in list
- Resume draft, make changes, verify updates are saved
- Resume draft, complete character, verify finalization works
- Delete draft character, verify it's removed from list
- Create new character while having existing drafts, verify it doesn't resume a draft

**Rules Compliance Verification:**

- Verify draft characters maintain all creation method constraints
- Verify finalization process works correctly after resuming
- Verify validation rules apply correctly to resumed drafts

---

## Alternatives Considered

**Alternative 1: Keep localStorage, add server sync**

- **Description**: Continue using localStorage but sync to server periodically
- **Why this wasn't chosen**: More complex, requires conflict resolution, doesn't solve cross-device issue

**Alternative 2: Auto-resume on "Create Character"**

- **Description**: "Create Character" automatically resumes the most recent draft
- **Why this wasn't chosen**: Less explicit, users might want to start fresh, harder to manage multiple drafts

**Alternative 3: Separate "Drafts" section**

- **Description**: Create a separate drafts page instead of showing in main list
- **Why this wasn't chosen**: Adds navigation complexity, drafts are still characters and should be visible in main list

---

## Additional Context

**Related Documentation:**

- [Technical Specification](./draft-character-resume-editing-technical-spec.md) - Detailed API contracts, route structures, error handling, and implementation details

**Related Features:**

- Character creation wizard (`/app/characters/create/components/CreationWizard.tsx`)
- Character list page (`/app/characters/page.tsx`)
- Character detail page (`/app/characters/[id]/page.tsx`)
- Draft creation API (`/app/api/characters/route.ts` POST endpoint)
- Character finalization (`/app/api/characters/[characterId]/finalize/route.ts`)

**Game System Context:**

- This feature improves the character creation workflow, which is a core user journey
- Complements existing draft system (server-side drafts already exist)
- Enhances multi-device support, which is important for mobile users

**Community Feedback:**

- Users have expressed frustration with losing character creation progress
- Common request: "I want to save my character and finish it later"
- Mobile users need cross-device access

**Timeline Considerations:**

- High priority for MVP completion
- Blocking issue: Users cannot reliably create characters without completing in one session
- Dependencies: Server-side draft storage already exists, mainly UI/UX work needed

---

## Implementation Decisions

### Decision: Store `CreationState` in Character Metadata

**Chosen Approach:** Store `CreationState` in `character.metadata.creationState`

**Rationale:** See tradeoff analysis below. Key factors:

- Priority assignments cannot be reliably reconstructed from final character stats
- Step position and completion status are essential for UX
- Storage overhead is minimal (~2-5KB per draft)
- Implementation is simpler and more reliable

### Tradeoffs: Storing CreationState vs. Reconstructing

**Option 1: Store `CreationState` in Character Metadata**

**Pros:**

- ✅ **Exact state preservation**: Can resume exactly where the user left off, including:
  - Current step index (`currentStep`)
  - Which steps were completed (`completedSteps`)
  - Remaining budget values (e.g., "3 attribute points left")
  - Validation errors/warnings that were showing
  - All intermediate selections that may not be reflected in final character data
- ✅ **Simple implementation**: Just save/load the state object - no complex logic needed
- ✅ **No information loss**: Preserves all wizard-specific UI state
- ✅ **Works for all creation methods**: Priority, point-buy, life modules, etc. all supported
- ✅ **Preserves priorities**: The exact priority assignments (e.g., "Metatype: B, Attributes: A") are stored, which are needed to:
  - Calculate remaining budgets correctly
  - Show the priority table in the UI
  - Validate against creation method constraints
- ✅ **Fast resume**: No calculation needed on load - just restore state

**Cons:**

- ❌ **Data duplication**: Some information exists in both `CreationState` and `Character` (e.g., attributes, skills)
- ❌ **Storage overhead**: Storing both the final character data AND the creation state (~2-5KB per draft)
- ❌ **Potential inconsistency**: If character is updated outside the wizard (via API), `CreationState` might become stale
- ❌ **More complex data model**: Need to manage two sources of truth and keep them in sync
- ❌ **Migration complexity**: If creation method changes, old `CreationState` might be incompatible

**Option 2: Reconstruct from Character Data**

**Pros:**

- ✅ **Single source of truth**: Character data is the only authoritative source
- ✅ **No data duplication**: Smaller storage footprint
- ✅ **Always consistent**: State is derived from current character data, so it's never stale
- ✅ **Simpler data model**: Only one data structure to manage
- ✅ **No migration issues**: Character data format is stable; reconstruction logic can adapt

**Cons:**

- ❌ **Information loss**: Cannot recover:
  - Current step position (would need to guess or start from beginning)
  - Completed steps (don't know which steps user finished)
  - Remaining budgets (must recalculate, but need priorities first)
  - Validation errors/warnings (transient state, not stored in character)
  - Some intermediate selections that don't affect final character
- ❌ **Complex reconstruction logic**: Need to reverse-engineer:
  - Priority assignments from final stats (ambiguous - multiple priority combos can produce same stats)
  - Budget calculations (need priorities first, which are ambiguous)
  - Step completion status (would need to infer from what data exists)
- ❌ **Ambiguous cases**:
  - A character with Body 6, Agility 5 could come from Priority A attributes + metatype bonuses OR Priority B attributes + different metatype
  - Can't determine which priority was chosen for each category
  - Can't determine if user was on step 3 or step 7 (both might have same partial data)
- ❌ **May not work for all creation methods**:
  - Priority system: Priorities are lost (can't infer from final stats)
  - Point-buy: Might work better, but still loses step position
  - Life modules: Module selections might not be fully inferrable
- ❌ **Performance**: Requires complex calculations on every resume
- ❌ **Edge cases**: What if character has partial data? Which step were they on?

**Recommendation: Store `CreationState` in Metadata**

Given that:

1. Priority assignments are critical and cannot be reliably reconstructed
2. Step position and completion status are essential for good UX
3. Remaining budgets are needed for validation and display
4. Storage overhead is minimal (~2-5KB per draft)
5. The implementation is simpler and more reliable

**Implementation Approach:**

- Store `CreationState` in `character.metadata.creationState`
- When resuming, load both character and creationState from `GET /api/characters/[id]`
- When saving during creation, update both character data AND `metadata.creationState` via `PATCH /api/characters/[id]`
- On finalization, can optionally remove creationState to save space (or keep for audit trail)
- Add validation to ensure creationState and character data are consistent when both exist

### Other Decisions

- **Multiple drafts of same character**: No - one draft per character ID
- **Auto-delete inactive drafts**: Defer to later - manual deletion for now
- **Show creation progress on cards**: Defer to later - can add "Step X of Y" indicator in future
- **Resume interaction**: Clicking the card - no separate button needed, clicking draft card navigates to resume route
