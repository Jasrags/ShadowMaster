# Character Management Implementation Plan

**Capability Document:** [character.management.md](../character.management.md)
**Last Updated:** 2025-01-27
**Status:** Draft
**Priority:** Critical (Core Functionality)

---

## Goal Description

Implement the complete Character Creation and Management capability as defined in `docs/capabilities/character.management.md`. This plan addresses gaps between the current implementation and the capability guarantees, focusing on:

1. **Lifecycle Governance** - Enforce controlled state transitions with validation
2. **Ruleset-Driven Creation** - Server-side validation and real-time feedback
3. **Retrieval and Management** - Multi-criteria search, filtering, and authorization
4. **Data Integrity** - Audit trails and state machine enforcement

---

## Architectural Decisions (Approved)

The following architectural decisions have been approved:

### 1. State Machine Enforcement Strategy ✅

**Decision:** Create a dedicated `CharacterStateMachine` module in `/lib/rules/character/` that validates all transitions and maintains transition rules as data.

**Rationale:** More testable, extensible, single source of truth for all state transition logic.

### 2. Server-Side Validation Architecture ✅

**Decision:** Create `/lib/rules/validation/character-validator.ts` that can be called from both API routes and finalization.

**Rationale:** Reusable, consistent validation across all entry points.

### 3. Audit Trail Storage ✅

**Decision:** Add `auditLog: AuditEntry[]` field to Character entity, persisted in JSON file.

**Rationale:** Self-contained, easy to query, atomic with character updates.

---

## Proposed Changes

### Phase 1: Lifecycle Governance (Critical Safety)

#### 1.1 Character State Machine

**Files to Create:**
- `/lib/rules/character/state-machine.ts` - State transition logic

**Requirements Satisfied:**
- **Guarantee:** "The system MUST enforce a controlled lifecycle for every character entity"
- **Requirement:** "The system MUST track and enforce character status transitions"

**Interface Definition:**
```typescript
// /lib/rules/character/state-machine.ts

export type CharacterStatus = "draft" | "active" | "retired" | "deceased";

export interface StateTransition {
  from: CharacterStatus;
  to: CharacterStatus;
  validator?: (character: Character) => ValidationResult;
  requiresGMApproval?: boolean;
}

export const VALID_TRANSITIONS: StateTransition[] = [
  { from: "draft", to: "active", validator: validateCharacterComplete },
  { from: "active", to: "retired" },
  { from: "active", to: "deceased" },
  { from: "retired", to: "active" },  // GM can reactivate
  { from: "deceased", to: "active", requiresGMApproval: true }, // Resurrection
];

export function canTransition(
  character: Character,
  targetStatus: CharacterStatus
): ValidationResult;

export function executeTransition(
  character: Character,
  targetStatus: CharacterStatus,
  actor: { userId: ID; role: "owner" | "gm" | "admin" }
): Promise<Character>;
```

**Implementation Steps:**
1. Create state machine module with transition definitions
2. Implement `canTransition()` with validation callbacks
3. Implement `executeTransition()` with authorization checks
4. Add comprehensive unit tests for all transitions

#### 1.2 Update API Routes to Use State Machine

**Files to Modify:**
- `/app/api/characters/[characterId]/route.ts`
- `/app/api/characters/[characterId]/finalize/route.ts`

**Requirements Satisfied:**
- **Guarantee:** "Every character transition to an active state MUST satisfy the full set of ruleset-defined validation criteria"
- **Constraint:** "Character entities MUST NOT be promoted to an active state until all mandatory selections and attributes are finalized"

**Changes:**
```typescript
// /app/api/characters/[characterId]/route.ts - PATCH handler

// BEFORE: Direct status update allowed
const updated = await updateCharacter(userId, characterId, updates);

// AFTER: Status changes go through state machine
if (updates.status && updates.status !== existing.status) {
  const transitionResult = await executeTransition(
    existing,
    updates.status,
    { userId, role: "owner" }
  );
  if (!transitionResult.success) {
    return NextResponse.json(
      { error: "Invalid state transition", details: transitionResult.errors },
      { status: 400 }
    );
  }
  delete updates.status; // Status handled by state machine
}
```

#### 1.3 Authorization Guard Middleware

**Files to Create:**
- `/lib/auth/character-authorization.ts` - Character-specific authorization

**Requirements Satisfied:**
- **Requirement:** "Access to character modification and deletion operations MUST be restricted to authorized owners"
- **Requirement:** "Authentication and authorization MUST be verified for every operation"

**Interface Definition:**
```typescript
// /lib/auth/character-authorization.ts

export type CharacterPermission =
  | "view"
  | "edit"
  | "delete"
  | "finalize"
  | "retire"
  | "advance";

export interface AuthorizationContext {
  userId: ID;
  characterId: ID;
  campaignId?: ID;
  requiredPermission: CharacterPermission;
}

export async function authorizeCharacterAccess(
  context: AuthorizationContext
): Promise<AuthorizationResult>;

export function getCharacterPermissions(
  character: Character,
  userId: ID,
  campaignRole?: "player" | "gm"
): CharacterPermission[];
```

**Permission Matrix:**
| Actor | View | Edit | Delete | Finalize | Retire | Advance |
|-------|------|------|--------|----------|--------|---------|
| Owner | ✓ | ✓ (draft) | ✓ | ✓ | ✓ | ✓ |
| Campaign GM | ✓ | - | - | ✓ (approve) | ✓ | ✓ (approve) |
| Campaign Player | - | - | - | - | - | - |
| Admin | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

### Phase 2: Ruleset-Driven Creation (Validation)

#### 2.1 Character Validation Engine

**Files to Create:**
- `/lib/rules/validation/character-validator.ts` - Comprehensive validation
- `/lib/rules/validation/types.ts` - Validation types

**Requirements Satisfied:**
- **Guarantee:** "Character data MUST remain consistent with the selected game edition and creation method"
- **Requirement:** "Real-time validation MUST be enforced throughout the creation process"
- **Constraint:** "Validation failures MUST prevent character finalization"

**Interface Definition:**
```typescript
// /lib/rules/validation/character-validator.ts

export interface CharacterValidationContext {
  character: Character;
  ruleset: MergedRuleset;
  creationMethod: CreationMethod;
  campaignSettings?: CampaignSettings;
  validationMode: "creation" | "finalization" | "advancement";
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  completeness: {
    requiredSteps: StepCompleteness[];
    budgetsAllocated: BudgetCompleteness[];
    overallPercentage: number;
  };
}

export async function validateCharacter(
  context: CharacterValidationContext
): Promise<ValidationResult>;

// Step-specific validators
export function validatePriorities(character: Character, ruleset: MergedRuleset): ValidationResult;
export function validateAttributes(character: Character, ruleset: MergedRuleset): ValidationResult;
export function validateSkills(character: Character, ruleset: MergedRuleset): ValidationResult;
export function validateQualities(character: Character, ruleset: MergedRuleset): ValidationResult;
export function validateGear(character: Character, ruleset: MergedRuleset): ValidationResult;
```

**Validation Checks:**
1. **Budget Constraints:**
   - Attribute points within priority allocation
   - Skill points within priority allocation
   - Karma spent ≤ karma available
   - Nuyen spent ≤ resources available
   - Quality karma within limits (+25/-25)

2. **Ruleset Compliance:**
   - All selected items exist in active ruleset
   - Prerequisites satisfied for qualities/gear
   - Incompatibilities checked (quality conflicts)
   - Attribute ranges valid (1-6 for natural, 1-10 augmented)

3. **Completeness:**
   - Required fields populated (name, metatype)
   - Required steps completed
   - At least one lifestyle selected
   - At least one identity (SIN) configured

#### 2.2 Server-Side Validation on Finalization

**Files to Modify:**
- `/app/api/characters/[characterId]/finalize/route.ts`

**Requirements Satisfied:**
- **Guarantee:** "Every character transition to an active state MUST satisfy the full set of ruleset-defined validation criteria"
- **Constraint:** "Core ruleset integrity MUST NOT be bypassed during the creation or management lifecycle"
- **Ref: Ruleset Integrity Capability:** "Character creation and advancement MUST be continuously validated against the current combination of active ruleset bundles"

**Current State (Gap):**
```typescript
// Current finalize route - INSUFFICIENT VALIDATION
if (existing.status !== "draft") {
  return NextResponse.json({ error: "Character is not a draft" }, { status: 400 });
}
// No validation that character is complete or rule-compliant!
```

**Proposed Implementation:**
```typescript
// /app/api/characters/[characterId]/finalize/route.ts

export async function POST(request: NextRequest, { params }: RouteParams) {
  // ... authentication and ownership checks ...

  // Load ruleset for validation
  const ruleset = await loadRuleset(character.editionCode);
  const creationMethod = getCreationMethod(ruleset, character.creationMethodId);

  // Full validation before finalization
  const validationResult = await validateCharacter({
    character,
    ruleset,
    creationMethod,
    validationMode: "finalization",
  });

  if (!validationResult.valid) {
    return NextResponse.json({
      error: "Character validation failed",
      errors: validationResult.errors,
      warnings: validationResult.warnings,
      completeness: validationResult.completeness,
    }, { status: 400 });
  }

  // State machine transition (draft → active)
  const result = await executeTransition(character, "active", { userId, role: "owner" });

  // Record finalization in audit log
  await addAuditEntry(character.id, {
    action: "finalized",
    actor: userId,
    timestamp: new Date().toISOString(),
    validationSnapshot: validationResult,
  });

  return NextResponse.json({ character: result.character });
}
```

#### 2.3 Real-Time Validation API Endpoint

**Files to Create:**
- `/app/api/characters/[characterId]/validate/route.ts`

**Requirements Satisfied:**
- **Requirement:** "Real-time validation MUST be enforced throughout the creation process, providing feedback on budget allocations and rule compliance"

**Purpose:** Allow the CreationWizard to call server-side validation without finalizing, enabling real-time feedback.

**Interface:**
```typescript
// POST /api/characters/[characterId]/validate
// Request body: { character: Partial<Character>, step?: string }
// Response: ValidationResult
```

---

### Phase 3: Retrieval and Management (Search & Discovery)

#### 3.1 Enhanced Character Retrieval API

**Files to Modify:**
- `/app/api/characters/route.ts`

**Requirements Satisfied:**
- **Requirement:** "Character entities MUST be discoverable and retrievable through multi-criteria searching, filtering, and sorting"
- **Requirement:** "Character data MUST be accessible in multiple presentation formats"

**Current State (Gap):**
```typescript
// Current - Limited filtering
const status = searchParams.get("status");
const edition = searchParams.get("edition");
```

**Proposed Query Parameters:**
```typescript
interface CharacterQueryParams {
  // Existing
  status?: CharacterStatus;
  edition?: EditionCode;
  campaignId?: ID;

  // New filters
  search?: string;          // Full-text search (name, metatype, path)
  metatype?: string;        // Filter by metatype
  magicalPath?: MagicalPath; // Filter by magical tradition

  // Sorting
  sortBy?: "name" | "updatedAt" | "createdAt" | "karma";
  sortOrder?: "asc" | "desc";

  // Pagination
  limit?: number;           // Default: 20, Max: 100
  offset?: number;          // For pagination

  // Presentation
  format?: "summary" | "full"; // Summary for list, full for details
}
```

**Implementation Steps:**
1. Add new query parameter parsing to GET handler
2. Implement search function in storage layer
3. Add sorting support with multiple fields
4. Implement pagination for scalability
5. Add summary format option for performance

#### 3.2 Storage Layer Search Functions

**Files to Modify:**
- `/lib/storage/characters.ts`

**New Functions:**
```typescript
// /lib/storage/characters.ts

export interface CharacterSearchOptions {
  userId: ID;
  filters: {
    status?: CharacterStatus[];
    edition?: EditionCode[];
    campaignId?: ID;
    metatype?: string;
    magicalPath?: MagicalPath;
    search?: string; // Name, metatype, or magical path contains
  };
  sort?: {
    field: "name" | "updatedAt" | "createdAt" | "karmaCurrent";
    order: "asc" | "desc";
  };
  pagination?: {
    limit: number;
    offset: number;
  };
}

export interface CharacterSearchResult {
  characters: Character[] | CharacterSummary[];
  total: number;
  hasMore: boolean;
}

export async function searchCharacters(
  options: CharacterSearchOptions
): Promise<CharacterSearchResult>;

// Helper for list views (reduced payload)
export function toCharacterSummary(character: Character): CharacterSummary;
```

---

### Phase 4: Data Integrity (Audit & Traceability)

#### 4.1 Audit Log Implementation

**Files to Create:**
- `/lib/storage/audit.ts` - Audit log management
- `/lib/types/audit.ts` - Audit type definitions

**Requirements Satisfied:**
- **Guarantee:** "All character state modifications MUST be persistent and recoverable"
- **Ref: Ruleset Integrity:** "The system MUST maintain a record of which ruleset version and bundles were active at the time of any character state change"

**Interface Definition:**
```typescript
// /lib/types/audit.ts

export interface AuditEntry {
  id: ID;
  timestamp: ISODateString;
  action: AuditAction;
  actor: {
    userId: ID;
    role: "owner" | "gm" | "admin";
  };
  details: Record<string, unknown>;
  rulesetSnapshot?: {
    editionCode: EditionCode;
    activeBookIds: ID[];
    version: string;
  };
}

export type AuditAction =
  | "created"
  | "updated"
  | "finalized"
  | "retired"
  | "reactivated"
  | "deceased"
  | "advancement_applied"
  | "advancement_approved"
  | "advancement_rejected"
  | "campaign_joined"
  | "campaign_left";
```

**Storage Approach (Option A from User Review):**
```typescript
// Character entity now includes audit log
interface Character {
  // ... existing fields ...
  auditLog?: AuditEntry[];
}
```

#### 4.2 Audit-Aware Operations

**Files to Modify:**
- `/lib/storage/characters.ts`

**Changes:**
```typescript
// Wrap existing functions to add audit entries

export async function updateCharacterWithAudit(
  userId: ID,
  characterId: ID,
  updates: Partial<Character>,
  auditContext: { action: AuditAction; actor: ID; details?: Record<string, unknown> }
): Promise<Character> {
  const character = await getCharacter(userId, characterId);
  if (!character) throw new Error("Character not found");

  const auditEntry: AuditEntry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    action: auditContext.action,
    actor: { userId: auditContext.actor, role: "owner" },
    details: auditContext.details || {},
  };

  const updatedCharacter = {
    ...character,
    ...updates,
    auditLog: [...(character.auditLog || []), auditEntry],
    updatedAt: new Date().toISOString(),
  };

  return writeCharacter(userId, characterId, updatedCharacter);
}
```

---

## Verification Plan

### Automated Tests

#### Unit Tests

| Test File | Coverage Target | Requirements Verified |
|-----------|-----------------|----------------------|
| `/lib/rules/character/__tests__/state-machine.test.ts` | All transition paths | Lifecycle Governance |
| `/lib/rules/validation/__tests__/character-validator.test.ts` | All validation rules | Ruleset-Driven Creation |
| `/lib/auth/__tests__/character-authorization.test.ts` | All permission scenarios | Authorization |
| `/lib/storage/__tests__/characters.search.test.ts` | Search/filter/sort | Retrieval & Management |
| `/lib/storage/__tests__/audit.test.ts` | Audit log operations | Data Integrity |

**State Machine Tests:**
```typescript
describe("CharacterStateMachine", () => {
  describe("canTransition", () => {
    it("allows draft → active when character is complete");
    it("rejects draft → active when validation fails");
    it("allows active → retired without validation");
    it("allows active → deceased without validation");
    it("allows retired → active (reactivation)");
    it("rejects deceased → active without GM approval");
    it("rejects invalid transitions (e.g., draft → retired)");
  });

  describe("executeTransition", () => {
    it("updates character status on valid transition");
    it("creates audit entry on transition");
    it("returns validation errors on rejection");
    it("respects authorization requirements");
  });
});
```

**Validation Tests:**
```typescript
describe("CharacterValidator", () => {
  describe("validateCharacter", () => {
    it("validates attribute points against priority allocation");
    it("validates skill points against priority allocation");
    it("validates karma within positive/negative limits");
    it("validates nuyen against resources budget");
    it("validates quality prerequisites");
    it("validates quality incompatibilities");
    it("validates gear against active ruleset");
    it("validates completeness for finalization");
  });
});
```

#### Integration Tests

| Test File | Scenarios | Requirements Verified |
|-----------|-----------|----------------------|
| `/app/api/characters/__tests__/finalize.integration.test.ts` | End-to-end finalization flow | Validation + State Machine |
| `/app/api/characters/__tests__/search.integration.test.ts` | Multi-criteria search | Retrieval |
| `/app/api/characters/__tests__/authorization.integration.test.ts` | Permission enforcement | Authorization |

**Finalization Integration Test:**
```typescript
describe("POST /api/characters/[id]/finalize", () => {
  it("rejects incomplete characters with validation errors");
  it("rejects characters violating ruleset constraints");
  it("accepts complete, valid characters");
  it("transitions status from draft to active");
  it("creates audit entry on successful finalization");
  it("returns 401 for unauthenticated requests");
  it("returns 403 for non-owner requests");
});
```

#### E2E Tests (Playwright)

| Test File | User Flow | Requirements Verified |
|-----------|-----------|----------------------|
| `/e2e/character-creation-finalization.spec.ts` | Complete creation wizard → finalize | Full lifecycle |
| `/e2e/character-list-search.spec.ts` | Search, filter, sort characters | Retrieval |
| `/e2e/character-authorization.spec.ts` | Owner vs non-owner access | Authorization |

### Manual Testing Checklist

#### Lifecycle Governance
- [ ] Create character, verify status is "draft"
- [ ] Attempt to finalize incomplete character, verify rejection with errors
- [ ] Complete all required fields, finalize successfully
- [ ] Verify status changed to "active"
- [ ] Retire an active character
- [ ] Attempt to edit a finalized character (should be blocked)
- [ ] Verify audit log contains all state transitions

#### Ruleset Validation
- [ ] Select qualities that exceed karma limit, verify validation error
- [ ] Select incompatible qualities, verify validation error
- [ ] Allocate more attribute points than allowed, verify error
- [ ] Select gear from disabled sourcebook, verify rejection
- [ ] Complete valid character, verify no errors on finalize

#### Search and Retrieval
- [ ] Create 5+ characters with different metatypes/paths
- [ ] Search by name substring, verify results
- [ ] Filter by status, verify correct characters shown
- [ ] Filter by metatype, verify results
- [ ] Sort by different fields, verify ordering
- [ ] Verify pagination works with > 20 characters

#### Authorization
- [ ] Access own characters (should work)
- [ ] Attempt to access another user's character (should 404)
- [ ] As GM, view campaign character (should work)
- [ ] As player, attempt to modify another player's character (should fail)

---

## Implementation Order and Dependencies

```
Phase 1: Lifecycle Governance (Foundation)
├── 1.1 State Machine ← No dependencies
├── 1.2 API Route Updates ← Depends on 1.1
└── 1.3 Authorization Guards ← Depends on 1.1

Phase 2: Ruleset-Driven Creation
├── 2.1 Validation Engine ← Depends on 1.1
├── 2.2 Server-Side Finalization ← Depends on 1.1, 2.1
└── 2.3 Real-Time Validation API ← Depends on 2.1

Phase 3: Retrieval and Management
├── 3.1 Enhanced Query API ← Independent
└── 3.2 Storage Layer Search ← Depends on 3.1

Phase 4: Data Integrity
├── 4.1 Audit Log Types ← Independent
└── 4.2 Audit-Aware Operations ← Depends on 4.1, 1.1
```

---

## Files Summary

### Files to Create
| Path | Purpose |
|------|---------|
| `/lib/rules/character/state-machine.ts` | Character lifecycle state machine |
| `/lib/auth/character-authorization.ts` | Character permission management |
| `/lib/rules/validation/character-validator.ts` | Comprehensive validation engine |
| `/lib/rules/validation/types.ts` | Validation type definitions |
| `/lib/types/audit.ts` | Audit log type definitions |
| `/lib/storage/audit.ts` | Audit log storage functions |
| `/app/api/characters/[characterId]/validate/route.ts` | Real-time validation endpoint |

### Files to Modify
| Path | Changes |
|------|---------|
| `/app/api/characters/[characterId]/route.ts` | Add state machine, authorization |
| `/app/api/characters/[characterId]/finalize/route.ts` | Add validation, audit |
| `/app/api/characters/route.ts` | Add search, filter, sort, pagination |
| `/lib/storage/characters.ts` | Add search functions, audit integration |
| `/lib/types/character.ts` | Add auditLog field |

### Test Files to Create
| Path | Purpose |
|------|---------|
| `/lib/rules/character/__tests__/state-machine.test.ts` | State machine unit tests |
| `/lib/rules/validation/__tests__/character-validator.test.ts` | Validation unit tests |
| `/lib/auth/__tests__/character-authorization.test.ts` | Authorization unit tests |
| `/lib/storage/__tests__/characters.search.test.ts` | Search function tests |
| `/app/api/characters/__tests__/finalize.integration.test.ts` | Finalization integration |
| `/e2e/character-lifecycle.spec.ts` | E2E lifecycle tests |

---

## Related Capabilities

- **Ruleset Integrity** (`ruleset.integrity.md`): Validation must use active ruleset bundles
- **Account Governance** (`security.account-governance.md`): User identity for authorization
- **Character Advancement** (`character.advancement.md`): Advancement validation uses same patterns
- **Campaign Governance** (`campaign.governance-approval.md`): GM approval workflows

---

## Open Items

1. **Campaign-Scoped Character Approval:** Should characters require GM approval when created in a campaign context? (Currently only advancements require approval)

2. **Draft Expiration:** Should draft characters be automatically deleted after inactivity? If so, what period?

3. **Character Cloning:** Should users be able to clone a character as a new draft? (Useful for "what-if" scenarios)

4. **Batch Operations:** Should we support bulk delete/archive operations for multiple characters?
