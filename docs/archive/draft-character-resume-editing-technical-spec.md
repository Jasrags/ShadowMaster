# Draft Character Resume Editing - Technical Specification

**Related Feature Request:** [Draft Character Resume Editing](./draft-character-resume-editing.md)  
**Date:** 2025-01-10  
**Status:** Draft

---

## Overview

This document provides technical implementation details for the draft character resume editing feature, including API contracts, route structures, state management, and error handling.

---

## API Contract Specification

### 1. Storing CreationState in Character Metadata

**Location:** `character.metadata.creationState`

**Structure:**
```typescript
interface Character {
  // ... other fields
  metadata?: {
    creationState?: CreationState;
    // ... other metadata fields
  };
}
```

**CreationState Type:**
```typescript
interface CreationState {
  characterId: ID;
  creationMethodId: ID;
  currentStep: number;
  completedSteps: string[];
  budgets: Record<string, number>;
  selections: Record<string, unknown>;
  priorities?: Record<string, string>;
  errors: ValidationError[];
  warnings: ValidationError[];
  updatedAt: ISODateString;
}
```

### 2. PATCH /api/characters/[characterId] - Update Character with CreationState

**Request:**
```typescript
PATCH /api/characters/{characterId}
Content-Type: application/json

{
  // Standard character fields (optional)
  name?: string;
  attributes?: Record<string, number>;
  // ... other character fields
  
  // CreationState update (optional, only during creation)
  metadata?: {
    creationState?: CreationState;
  }
}
```

**Response (Success):**
```typescript
{
  success: true;
  character: Character; // Full character object with updated metadata
}
```

**Response (Error - Unauthorized):**
```typescript
{
  success: false;
  error: "Unauthorized";
}
```
Status: 401

**Response (Error - Character Not Found):**
```typescript
{
  success: false;
  error: "Character not found";
}
```
Status: 404

**Response (Error - Validation Failed):**
```typescript
{
  success: false;
  error: "Validation failed";
  details?: {
    field: string;
    message: string;
  }[];
}
```
Status: 400

**Validation Rules:**
1. `characterId` in `creationState` must match route parameter `characterId`
2. `creationState.creationMethodId` must match `character.creationMethodId`
3. `creationState.characterId` must match `character.id`
4. `currentStep` must be a valid step index (0 to max steps - 1)
5. `completedSteps` must be an array of valid step IDs
6. `budgets` must be a record of string keys to number values
7. `selections` must be a record (no type validation, but must be an object)
8. `priorities` (if present) must be a record of string keys to string values
9. `updatedAt` must be a valid ISO date string

**Implementation Notes:**
- The PATCH endpoint already exists at `/app/api/characters/[characterId]/route.ts`
- The `updateCharacter` function in `/lib/storage/characters.ts` already supports partial updates
- Metadata updates are merged with existing metadata (not replaced)
- Validation should occur in the API route handler before calling `updateCharacter`

### 3. GET /api/characters/[characterId] - Retrieve Character with CreationState

**Request:**
```
GET /api/characters/{characterId}
```

**Response:**
```typescript
{
  success: true;
  character: Character; // Includes metadata.creationState if present
}
```

**Notes:**
- The existing GET endpoint already returns the full character object
- No changes needed - `metadata.creationState` will be included automatically if present
- Client should check `character.metadata?.creationState` to determine if draft can be resumed

---

## Route Structure

### Route Decision: `/characters/[id]/edit`

**Chosen Approach:** Use `/characters/[id]/edit` for resuming drafts

**Rationale:**
- Clear separation: `/characters/create` always creates new, `/characters/[id]/edit` resumes existing
- RESTful pattern: edit route for existing resources
- Easy to detect mode: presence of `id` in route indicates resume mode
- Consistent with existing character detail route pattern (`/characters/[id]`)

### Route Implementation

**File:** `/app/characters/[id]/edit/page.tsx`

**Route Detection Logic:**
```typescript
// In the edit page component
const { id } = useParams();
const isResumeMode = !!id; // If id exists, we're resuming

// Load character if resuming
useEffect(() => {
  if (isResumeMode) {
    // Fetch character with creationState
    fetch(`/api/characters/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.character.metadata?.creationState) {
          // Resume from saved state
          setInitialState(data.character.metadata.creationState);
        } else {
          // Character exists but no creationState - show error or start fresh?
          // Decision: Show error - this shouldn't happen for drafts
        }
      });
  }
}, [id, isResumeMode]);
```

**Navigation Flow:**
1. User clicks draft character in `/characters` list
2. Navigate to `/characters/[id]/edit`
3. Page loads character and checks for `metadata.creationState`
4. If present: Load `CreationWizard` with `initialState` prop
5. If absent: Show error (character is not a draft or state is missing)

**Alternative Route (Not Chosen):**
- `/characters/create?resume=[id]` - Rejected because:
  - Less RESTful
  - Requires query param parsing
  - Less clear intent
  - Harder to bookmark/share

---

## State Compatibility & Migration

### Version Compatibility Strategy

**Current Approach:** Store `creationState` as-is, no versioning initially

**Future Considerations:**
1. Add `creationStateVersion` field to `CreationState` interface
2. Store version when saving: `creationState.version = "1.0.0"`
3. On load, check version and migrate if needed
4. Migration functions in `/lib/rules/migration.ts`

**Initial Implementation:**
- No versioning required for MVP
- Assume all `creationState` objects are compatible
- If incompatible state detected, fall back to error handling (see Error Recovery)

### Schema Evolution Strategy

**Breaking Changes:**
- If `CreationState` interface changes significantly, old drafts may be incompatible
- Options:
  1. **Migration:** Write migration functions to transform old state to new format
  2. **Validation:** Detect incompatible state and show error to user
  3. **Fallback:** Start fresh if state is incompatible (lose progress)

**Recommended Approach (MVP):**
- Use validation to detect incompatible state
- Show user-friendly error: "This draft was created with an older version and cannot be resumed. Please start a new character."
- Optionally: Allow user to delete the draft and start fresh

**Future Enhancement:**
- Implement migration system when needed
- Track `creationStateVersion` in metadata
- Provide migration functions for each version bump

### Detection Logic

```typescript
function isCreationStateCompatible(state: unknown): state is CreationState {
  if (!state || typeof state !== 'object') return false;
  
  const s = state as Partial<CreationState>;
  
  // Required fields
  if (!s.characterId || !s.creationMethodId) return false;
  if (typeof s.currentStep !== 'number') return false;
  if (!Array.isArray(s.completedSteps)) return false;
  if (!s.budgets || typeof s.budgets !== 'object') return false;
  if (!s.selections || typeof s.selections !== 'object') return false;
  if (!Array.isArray(s.errors)) return false;
  if (!Array.isArray(s.warnings)) return false;
  
  return true;
}
```

---

## Concurrency & Conflict Resolution

### Multiple Tab Scenario

**Problem:** User opens same draft in multiple browser tabs

**Chosen Strategy:** Last-write-wins with optimistic updates

**Implementation:**
1. **Auto-save on state change:** Debounced (500ms delay)
2. **No locking mechanism:** MVP doesn't require file locking
3. **Optimistic updates:** UI updates immediately, server update happens async
4. **Conflict resolution:** Last PATCH request wins (simple overwrite)

**User Experience:**
- If user edits in Tab A, then Tab B, Tab B's changes will overwrite Tab A's
- This is acceptable for MVP - users should use one tab at a time
- Future: Add conflict detection and user notification

**Auto-save Implementation:**
```typescript
// In CreationWizard component
useEffect(() => {
  if (!characterId) return; // Only auto-save if character exists
  
  const timeoutId = setTimeout(() => {
    // Debounced save
    saveCreationState(state);
  }, 500);
  
  return () => clearTimeout(timeoutId);
}, [state, characterId]);
```

**Future Enhancement:**
- Add `updatedAt` timestamp comparison
- Detect conflicts: if server `updatedAt` > client `updatedAt`, show conflict dialog
- Allow user to choose: "Keep my changes" or "Load server version"

### Auto-save Frequency

**Strategy:** Debounced auto-save on every state change

**Debounce Delay:** 500ms

**Rationale:**
- Balances responsiveness with server load
- Prevents excessive API calls during rapid user input
- Ensures state is saved within 500ms of last change

**Manual Save:**
- No explicit "Save" button needed for MVP
- Auto-save handles all persistence
- Future: Add "Save" button for explicit user control

---

## Error Recovery Scenarios

### Scenario 1: Missing CreationState

**Situation:** Character exists but `metadata.creationState` is missing

**Detection:**
```typescript
const character = await getCharacter(userId, characterId);
if (character.status === 'draft' && !character.metadata?.creationState) {
  // Missing creationState
}
```

**Recovery Options:**
1. **Show Error (Recommended):**
   - Display: "This draft character's creation state is missing. Please start a new character."
   - Provide "Delete Draft" and "Start New Character" buttons
   - Don't attempt to resume

2. **Start Fresh (Alternative):**
   - Clear warning: "Creation state missing. Starting fresh."
   - Initialize new `CreationState` and overwrite existing draft
   - Risk: User may lose context about what they were building

**Chosen Approach:** Show error with recovery options

### Scenario 2: Corrupted CreationState

**Situation:** `metadata.creationState` exists but is invalid/malformed

**Detection:**
```typescript
function validateCreationState(state: unknown): state is CreationState {
  // Use isCreationStateCompatible() from above
  return isCreationStateCompatible(state);
}
```

**Recovery:**
- Same as Scenario 1: Show error with recovery options
- Log error for debugging: `console.error('Corrupted creationState:', state)`

### Scenario 3: Incompatible CreationState

**Situation:** `creationState` structure doesn't match current `CreationState` interface

**Detection:**
- Validation fails during `isCreationStateCompatible()` check
- Specific field type mismatches detected

**Recovery:**
- Show user-friendly error: "This draft was created with an older version and cannot be resumed."
- Options: "Delete Draft" or "Start New Character"
- Future: Implement migration to convert old format

### Scenario 4: Character Not Found

**Situation:** User navigates to `/characters/[id]/edit` but character doesn't exist

**Detection:**
- API returns 404
- `getCharacter()` returns null

**Recovery:**
- Show 404 error page
- Link back to characters list
- Standard Next.js error handling

### Scenario 5: Network Failure During Auto-save

**Situation:** Auto-save PATCH request fails (network error, server error)

**Detection:**
```typescript
try {
  await saveCreationState(state);
} catch (error) {
  // Network or server error
  setSaveError('Failed to save draft. Please try again.');
}
```

**Recovery:**
1. **Show Error Banner:**
   - Display: "Failed to save draft. Your changes may be lost if you leave this page."
   - Retry button: "Retry Save"
   - Keep state in memory (don't clear on error)

2. **Retry Logic:**
   - Exponential backoff: 1s, 2s, 4s, 8s (max 3 retries)
   - After max retries, show persistent error

3. **User Action:**
   - User can manually retry via "Retry Save" button
   - User can continue editing (state remains in memory)
   - Warning persists until save succeeds

**Implementation:**
```typescript
const [saveError, setSaveError] = useState<string | null>(null);
const [retryCount, setRetryCount] = useState(0);

async function saveWithRetry(state: CreationState, maxRetries = 3) {
  try {
    await saveCreationState(state);
    setSaveError(null);
    setRetryCount(0);
  } catch (error) {
    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        saveWithRetry(state, maxRetries);
      }, delay);
    } else {
      setSaveError('Failed to save draft after multiple attempts.');
    }
  }
}
```

### Scenario 6: Character Status Changed (Draft → Active)

**Situation:** User resumes draft, but character was finalized in another session

**Detection:**
```typescript
const character = await getCharacter(userId, characterId);
if (character.status !== 'draft') {
  // Character is no longer a draft
}
```

**Recovery:**
- Show message: "This character has been finalized and cannot be edited in creation mode."
- Redirect to character detail page: `/characters/[id]`
- Don't allow creation wizard to load

---

## Implementation Checklist

### Phase 1: Core Functionality
- [ ] Update `CreationWizard` to accept optional `characterId` prop
- [ ] Add `initialState` prop to `CreationWizard` for resuming
- [ ] Implement state loading from `character.metadata.creationState`
- [ ] Update auto-save to persist to `metadata.creationState` via PATCH
- [ ] Add validation in PATCH endpoint for `creationState`
- [ ] Create `/app/characters/[id]/edit/page.tsx` route
- [ ] Update character list to navigate drafts to edit route

### Phase 2: Error Handling
- [ ] Implement `isCreationStateCompatible()` validation
- [ ] Add error UI for missing/corrupted `creationState`
- [ ] Add network error handling with retry logic
- [ ] Add status check (prevent resuming non-draft characters)

### Phase 3: UX Enhancements
- [ ] Add "Resume Editing" button to draft character cards
- [ ] Show save status indicator (saving/saved/error)
- [ ] Add progress indicator on draft cards (optional)
- [ ] Update character detail page to show "Resume Creation" for drafts

### Phase 4: Testing & Polish
- [ ] Test resume flow end-to-end
- [ ] Test error scenarios
- [ ] Test concurrent tab editing
- [ ] Test network failure recovery
- [ ] Verify cross-device resume works

---

## Future Enhancements

1. **Version Migration System**
   - Track `creationStateVersion` in metadata
   - Implement migration functions for schema changes
   - Automatic migration on load

2. **Conflict Detection**
   - Compare `updatedAt` timestamps
   - Show conflict resolution dialog
   - Allow user to choose which version to keep

3. **Explicit Save Button**
   - Add "Save Draft" button for user control
   - Show last saved timestamp
   - Manual save bypasses debounce

4. **Draft Expiration**
   - Auto-delete drafts older than X days
   - User notification before deletion
   - Configurable retention period

5. **Draft Sharing**
   - Allow sharing draft links
   - Read-only view for shared drafts
   - Collaboration features (future)

---

## Related Files

- **Feature Request:** `/docs/feature-requests/draft-character-resume-editing.md`
- **API Route:** `/app/api/characters/[characterId]/route.ts`
- **Storage Layer:** `/lib/storage/characters.ts`
- **Creation Wizard:** `/app/characters/create/components/CreationWizard.tsx`
- **Character List:** `/app/characters/page.tsx`
- **Character Detail:** `/app/characters/[id]/page.tsx`
- **Types:** `/lib/types/creation.ts`, `/lib/types/character.ts`

---

## Questions & Decisions

### Open Questions
1. Should we allow resuming drafts that were created with different creation method versions?
   - **Decision:** No - show error if `creationMethodId` doesn't match current method
   
2. What happens if user deletes a draft while editing it in another tab?
   - **Decision:** Show error on next save attempt, redirect to characters list

3. Should we store `creationState` for finalized characters (for audit trail)?
   - **Decision:** No for MVP - remove on finalization. Future: optional retention

### Decisions Made
1. ✅ Use `/characters/[id]/edit` route (not query param)
2. ✅ Store `CreationState` in `metadata.creationState` (not separate table)
3. ✅ Last-write-wins for concurrency (no locking for MVP)
4. ✅ Debounced auto-save (500ms delay)
5. ✅ Show errors for missing/corrupted state (don't auto-recover)
6. ✅ Validate `creationState` structure on load and save

---

*Last updated: 2025-01-10*

