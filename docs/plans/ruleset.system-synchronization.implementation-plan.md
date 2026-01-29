# Implementation Plan: System Synchronization

## Goal Description

Implement the **System Synchronization** capability to guarantee the integrity and stable evolution of character data relative to its authoritative ruleset source. This system detects "drift" between character snapshots and rulebook updates, maintains mechanical stability during gameplay, and provides controlled migration pathways when breaking changes occur.

**Core Objectives:**

- Protect character mechanical state via mandatory snapshotting (already partially implemented per ADR-004)
- Distinguish between Live (auto-sync), Snapshot (buffered), and Delta (immutable) data layers
- Automatically detect and categorize structural changes (Non-Breaking vs. Breaking)
- Continuously monitor character "Legality" with Draft/Invalid states upon breaking drift
- Provide "Sync Lab" for reconciliation and "Migration Wizard" for breaking changes

---

## User Review Required

### Critical Architectural Decisions

1. **Snapshot Storage Strategy**: Each character will store a complete mechanical snapshot of relevant ruleset data. This increases JSON file size but ensures offline playability and audit integrity.

2. **Breaking Change Definition**: The system will categorize changes as:
   - **Type A (Non-Breaking)**: Additive changes (new skills, qualities) or flavor-only updates
   - **Type B (Breaking)**: Removed items, renamed identifiers, changed mechanical values, structural schema changes

3. **Legality Enforcement Level**: Invalid characters (with unreconciled breaking drift) will be restricted from:
   - Encounter resolution participation
   - Karma spending/advancement
   - Export to official formats

   Users may override to "Draft" mode for continued editing without gameplay.

4. **Migration Atomicity**: All synchronization operations are atomic - character records either fully update to the target version or remain in their previous stable state. Partial migrations are never persisted.

---

## Proposed Changes

### Phase 1: Type Definitions and Data Modeling

#### 1.1 Synchronization Types (`lib/types/synchronization.ts`) [NEW]

**Satisfies:** Capability Requirement "Layered Data Modeling"
**References:** ADR-004 (Hybrid Snapshot Model)

```typescript
// Core synchronization types
export type DataLayerType = "live" | "snapshot" | "delta";

export type DriftSeverity = "none" | "non-breaking" | "breaking";

export type SyncStatus =
  | "synchronized" // Character matches current ruleset
  | "outdated" // Non-breaking changes available
  | "invalid" // Breaking changes require reconciliation
  | "migrating"; // Active migration in progress

export type LegalityStatus =
  | "rules-legal" // Fully compliant with ruleset version
  | "draft" // Editable but not gameplay-ready
  | "invalid" // Requires reconciliation
  | "legacy"; // Locked to obsolete ruleset version

export interface RulesetVersionRef {
  editionCode: EditionCode;
  editionVersion: string;
  bookVersions: Record<ID, string>; // bookId -> version
  snapshotId: ID;
  createdAt: ISODateString;
}

export interface DriftReport {
  id: ID;
  characterId: ID;
  generatedAt: ISODateString;
  currentVersion: RulesetVersionRef;
  targetVersion: RulesetVersionRef;
  overallSeverity: DriftSeverity;
  changes: DriftChange[];
  recommendations: MigrationRecommendation[];
}

export interface DriftChange {
  id: ID;
  module: RuleModuleType; // "skills", "qualities", "metatypes", etc.
  changeType: DriftChangeType;
  severity: DriftSeverity;
  affectedItems: AffectedItem[];
  description: string;
}

export type DriftChangeType =
  | "added" // New items available (non-breaking)
  | "removed" // Items no longer exist (breaking)
  | "renamed" // Identifier changed (breaking)
  | "modified" // Mechanical values changed (severity varies)
  | "restructured" // Schema/structure changed (breaking)
  | "deprecated"; // Still works but will be removed (warning)

export interface AffectedItem {
  itemId: ID;
  itemType: string;
  previousValue?: unknown;
  currentValue?: unknown;
  characterUsage?: CharacterUsageContext[];
}

export interface CharacterUsageContext {
  field: string; // e.g., "positiveQualities", "skills"
  path: string; // JSON path to affected data
  currentValue: unknown;
}

export interface MigrationRecommendation {
  changeId: ID;
  strategy: MigrationStrategy;
  description: string;
  autoApplicable: boolean; // Can be auto-applied
  requiresUserChoice: boolean; // User must select option
  options?: MigrationOption[];
}

export type MigrationStrategy =
  | "auto-update" // Safe to apply automatically
  | "manual-select" // User must choose replacement
  | "archive" // Move to legacy storage
  | "remove"; // Remove from character

export interface MigrationOption {
  id: ID;
  label: string;
  description: string;
  targetItemId?: ID;
  karmaDelta?: number; // Karma adjustment if applicable
}
```

#### 1.2 Character Type Extensions (`lib/types/character.ts`) [MODIFY]

**Satisfies:** Capability Requirement "Locked Version identifier"
**References:** ADR-004 (Hybrid Snapshot Model)

Add to `Character` interface:

```typescript
// Existing fields to formalize:
rulesetSnapshotId: ID;              // REQUIRED (currently optional)
rulesetVersion: RulesetVersionRef;  // NEW: Full version tracking

// Synchronization state:
syncStatus: SyncStatus;             // Current sync state
legalityStatus: LegalityStatus;     // Rules compliance state
lastSyncCheck?: ISODateString;      // When drift was last evaluated
lastSyncAt?: ISODateString;         // When last synchronized
pendingMigration?: ID;              // DriftReport ID if migration pending

// Snapshot layer (mechanical data):
mechanicalSnapshot: MechanicalSnapshot;

// Delta layer (character-specific):
deltaOverrides?: DeltaOverrides;
```

```typescript
export interface MechanicalSnapshot {
  capturedAt: ISODateString;
  rulesetVersion: RulesetVersionRef;

  // Snapshotted mechanical values
  metatype: MetatypeSnapshot;
  attributeDefinitions: AttributeDefinitionSnapshot;
  skillDefinitions: SkillDefinitionSnapshot;
  qualityDefinitions: QualityDefinitionSnapshot;
  // ... additional module snapshots as needed
}

export interface MetatypeSnapshot {
  id: ID;
  attributeModifiers: Record<string, number>;
  specialAbilities: string[];
  racialQualities: string[];
}

export interface DeltaOverrides {
  customNotes: Record<string, string>;
  temporaryModifiers: TemporaryModifier[];
  characterSpecificData: Record<string, unknown>;
}
```

#### 1.3 Edition Version Tracking (`lib/types/edition.ts`) [MODIFY]

**Satisfies:** Capability Requirement "Locked Version identifier"

Ensure version fields are required:

```typescript
interface Edition {
  version: string; // REQUIRED (currently optional) - semver format
}

interface Book {
  version: string; // NEW REQUIRED field - semver format
}
```

---

### Phase 2: Storage Layer Extensions

#### 2.1 Ruleset Snapshot Storage (`lib/storage/ruleset-snapshots.ts`) [NEW]

**Satisfies:** Capability Guarantee "mandatory snapshotting layer"
**References:** ADR-006 (File-Based Persistence)

```
data/
├── ruleset-snapshots/
│   └── {snapshotId}.json          # Immutable snapshot files
```

**Primary Functions:**

```typescript
// Create and store a new ruleset snapshot
export async function captureRulesetSnapshot(config: RulesetLoadConfig): Promise<RulesetVersionRef>;

// Retrieve a historical snapshot by ID
export async function getRulesetSnapshot(snapshotId: ID): Promise<MergedRuleset | null>;

// Compare two snapshots for drift
export async function compareSnapshots(
  baseSnapshotId: ID,
  targetSnapshotId: ID
): Promise<DriftReport>;

// Get current (latest) snapshot for edition
export async function getCurrentSnapshot(editionCode: EditionCode): Promise<RulesetVersionRef>;
```

#### 2.2 Character Storage Extensions (`lib/storage/characters.ts`) [MODIFY]

**Satisfies:** Capability Requirement "per-character reconciliation"
**References:** ADR-009 (Append-Only Ledger)

**Add functions:**

```typescript
// Update character sync status
export async function updateSyncStatus(
  userId: ID,
  characterId: ID,
  syncStatus: SyncStatus,
  legalityStatus: LegalityStatus
): Promise<Character>;

// Store drift report for character
export async function storeDriftReport(
  userId: ID,
  characterId: ID,
  report: DriftReport
): Promise<void>;

// Record synchronization in audit trail
export async function recordSyncEvent(
  userId: ID,
  characterId: ID,
  event: SyncAuditEvent
): Promise<void>;

// Atomic migration application
export async function applyMigration(
  userId: ID,
  characterId: ID,
  migration: AppliedMigration
): Promise<Character>;
```

---

### Phase 3: Drift Detection Engine

#### 3.1 Drift Analyzer (`lib/rules/sync/drift-analyzer.ts`) [NEW]

**Satisfies:** Capability Requirement "Drift Detection and Severity"

```typescript
// Main drift analysis entry point
export async function analyzeCharacterDrift(character: Character): Promise<DriftReport>;

// Module-specific drift analyzers
export function analyzeMetatypeDrift(
  characterSnapshot: MetatypeSnapshot,
  currentRuleset: MergedRuleset
): DriftChange[];

export function analyzeSkillDrift(
  characterSkills: Record<string, number>,
  characterSnapshot: SkillDefinitionSnapshot,
  currentRuleset: MergedRuleset
): DriftChange[];

export function analyzeQualityDrift(
  characterQualities: QualitySelection[],
  characterSnapshot: QualityDefinitionSnapshot,
  currentRuleset: MergedRuleset
): DriftChange[];

// Severity classification
export function classifyDriftSeverity(changes: DriftChange[]): DriftSeverity;
```

**Detection Logic:**

| Change Type                | Severity     | Auto-Resolvable  |
| -------------------------- | ------------ | ---------------- |
| New items added to catalog | Non-Breaking | Yes (no action)  |
| Flavor text updated        | Non-Breaking | Yes (auto-sync)  |
| Mechanical value increased | Non-Breaking | Yes (favorable)  |
| Mechanical value decreased | Breaking     | No (user choice) |
| Item removed from catalog  | Breaking     | No (migration)   |
| Skill/quality renamed      | Breaking     | No (migration)   |
| Schema restructured        | Breaking     | No (wizard)      |

#### 3.2 Legality Validator (`lib/rules/sync/legality-validator.ts`) [NEW]

**Satisfies:** Capability Requirement "Legality and Compliance"

```typescript
// Validate character against its locked ruleset version
export function validateRulesLegality(character: Character): LegalityValidationResult;

// Check if character can participate in encounters
export function canParticipateInEncounter(character: Character): EncounterEligibility;

// Get legality shield status for UI
export function getLegalityShield(character: Character): StabilityShield;

interface StabilityShield {
  status: "green" | "yellow" | "red";
  label: string;
  tooltip: string;
  actionRequired?: string;
}
```

---

### Phase 4: Reconciliation and Migration

#### 4.1 Migration Engine (`lib/rules/sync/migration-engine.ts`) [NEW]

**Satisfies:** Capability Requirement "Reconciliation and Migration"
**Satisfies:** Capability Constraint "atomic synchronization"

```typescript
// Generate migration plan from drift report
export function generateMigrationPlan(
  report: DriftReport,
  userSelections?: Map<ID, MigrationOption>
): MigrationPlan;

// Apply migration atomically
export async function executeMigration(
  character: Character,
  plan: MigrationPlan
): Promise<MigrationResult>;

// Validate migration before execution
export function validateMigrationPlan(character: Character, plan: MigrationPlan): ValidationResult;

interface MigrationPlan {
  id: ID;
  characterId: ID;
  sourceVersion: RulesetVersionRef;
  targetVersion: RulesetVersionRef;
  steps: MigrationStep[];
  isComplete: boolean; // All choices made
  estimatedKarmaDelta: number;
}

interface MigrationStep {
  changeId: ID;
  action: MigrationAction;
  before: unknown;
  after: unknown;
}

interface MigrationResult {
  success: boolean;
  character?: Character;
  error?: string;
  appliedSteps: MigrationStep[];
  rollbackAvailable: boolean;
}
```

#### 4.2 Sync Audit Trail (`lib/rules/sync/sync-audit.ts`) [NEW]

**Satisfies:** Capability Guarantee "atomic synchronization"
**References:** ADR-009 (Append-Only Ledger)

```typescript
export interface SyncAuditEntry {
  id: ID;
  timestamp: ISODateString;
  eventType: SyncEventType;
  sourceVersion: RulesetVersionRef;
  targetVersion?: RulesetVersionRef;
  changes: AppliedChange[];
  actor: AuditActor;
}

export type SyncEventType =
  | "drift_detected"
  | "migration_started"
  | "migration_completed"
  | "migration_rolled_back"
  | "legality_changed"
  | "manual_resync";
```

---

### Phase 5: React Hooks and Context

#### 5.1 Synchronization Hooks (`lib/rules/sync/hooks.ts`) [NEW]

**Satisfies:** Capability Requirement "visual indicators"

```typescript
// Check if character needs sync
export function useSyncStatus(characterId: ID): {
  status: SyncStatus;
  legalityStatus: LegalityStatus;
  driftReport?: DriftReport;
  isChecking: boolean;
};

// Get stability shield for display
export function useStabilityShield(characterId: ID): StabilityShield;

// Trigger drift analysis
export function useDriftAnalysis(characterId: ID): {
  analyze: () => Promise<DriftReport>;
  report?: DriftReport;
  isAnalyzing: boolean;
};

// Migration workflow state
export function useMigrationWizard(characterId: ID): {
  report: DriftReport | null;
  plan: MigrationPlan | null;
  currentStep: number;
  makeSelection: (changeId: ID, option: MigrationOption) => void;
  applyMigration: () => Promise<MigrationResult>;
  canApply: boolean;
  isApplying: boolean;
};
```

#### 5.2 RulesetContext Extensions (`lib/rules/RulesetContext.tsx`) [MODIFY]

Add version-aware hooks:

```typescript
export function useRulesetVersion(): RulesetVersionRef | null;
export function useCurrentSnapshotId(): ID | null;
export function useRulesetComparison(characterSnapshotId: ID): {
  isDifferent: boolean;
  changes?: DriftChange[];
};
```

---

### Phase 6: UI Components

#### 6.1 Stability Shield Component (`components/sync/StabilityShield.tsx`) [NEW]

**Satisfies:** Capability Requirement "visual indicators (Stability Shield statuses)"

Visual indicator component showing character sync status:

- **Green Shield**: "Rules Legal" - Fully synchronized
- **Yellow Shield**: "Update Available" - Non-breaking changes detected
- **Red Shield**: "Sync Required" - Breaking changes require reconciliation

Props: `{ characterId: ID; size?: "sm" | "md" | "lg"; showTooltip?: boolean }`

#### 6.2 Sync Lab Page (`app/characters/[id]/sync/page.tsx`) [NEW]

**Satisfies:** Capability Requirement "Sync Lab for review and reconciliation"

Full-page sync management interface:

- Current version vs. available version comparison
- Drift report visualization (grouped by module and severity)
- Non-breaking changes: One-click "Apply Safe Updates"
- Breaking changes: Detailed review with migration options
- Preview of mechanical changes before applying

#### 6.3 Migration Wizard Modal (`components/sync/MigrationWizard.tsx`) [NEW]

**Satisfies:** Capability Requirement "Migration Wizard for manual transformation"

Step-by-step wizard for breaking changes:

1. **Overview**: Summary of detected breaking changes
2. **Review Changes**: For each breaking change, show context and options
3. **Make Selections**: User chooses migration path for each item
4. **Confirm**: Review final plan with karma adjustments
5. **Apply**: Atomic migration with success/failure feedback

#### 6.4 Character Sheet Integration

**Modify:** `app/characters/[id]/page.tsx`

Add StabilityShield to character header:

```tsx
<CharacterHeader>
  <StabilityShield characterId={character.id} />
  ...
</CharacterHeader>
```

Add sync warning banner when status is not "synchronized":

```tsx
{
  syncStatus !== "synchronized" && (
    <SyncWarningBanner
      status={syncStatus}
      onSyncClick={() => router.push(`/characters/${id}/sync`)}
    />
  );
}
```

---

### Phase 7: API Endpoints

#### 7.1 Sync Status API (`app/api/characters/[characterId]/sync/route.ts`) [NEW]

```typescript
// GET: Check current sync status
// Returns: { status, legalityStatus, driftReport?, lastCheck }

// POST: Trigger drift analysis
// Returns: { report: DriftReport }
```

#### 7.2 Migration API (`app/api/characters/[characterId]/sync/migrate/route.ts`) [NEW]

```typescript
// POST: Apply migration plan
// Body: { plan: MigrationPlan, selections: Map<ID, MigrationOption> }
// Returns: { success, character?, error? }

// DELETE: Rollback last migration (if available)
// Returns: { success, character? }
```

#### 7.3 Ruleset Snapshots API (`app/api/rulesets/snapshots/route.ts`) [NEW]

```typescript
// GET: Get current snapshot for edition
// Query: ?editionCode=sr5
// Returns: { snapshotId, version, capturedAt }

// POST: Capture new snapshot (admin only)
// Returns: { snapshotId, version }
```

---

## Verification Plan

### Automated Testing

#### Unit Tests (`lib/rules/sync/__tests__/`)

| Test File                    | Coverage                                |
| ---------------------------- | --------------------------------------- |
| `drift-analyzer.test.ts`     | Drift detection for all module types    |
| `legality-validator.test.ts` | Legality status transitions             |
| `migration-engine.test.ts`   | Migration plan generation and execution |
| `sync-audit.test.ts`         | Audit trail append-only behavior        |

**Critical Test Cases:**

1. **Guarantee: Snapshotting Protection**
   - Character created with ruleset v1.0
   - Ruleset updated to v1.1 with mechanical changes
   - Verify: Character dice pools unchanged until explicit sync

2. **Guarantee: Data Layer Separation**
   - Modify Live data (flavor text) → Character reflects change
   - Modify Snapshot data (dice value) → Character unchanged
   - Modify Delta data (custom notes) → Data preserved through sync

3. **Guarantee: Drift Categorization**
   - New skill added → Non-Breaking (Type A)
   - Skill cost increased → Breaking (Type B)
   - Quality removed → Breaking (Type B)
   - Description typo fixed → Non-Breaking (Type A)

4. **Guarantee: Legality Monitoring**
   - Character with breaking drift → Status = "invalid"
   - Invalid character → Cannot join encounter
   - User reconciles → Status = "rules-legal"

5. **Constraint: Atomic Synchronization**
   - Start migration, simulate failure mid-process
   - Verify: Character unchanged (rollback successful)
   - No partial migrations persisted

6. **Constraint: Delta Preservation**
   - Character has custom notes, temp modifiers
   - Apply migration
   - Verify: All delta data preserved

7. **Constraint: Per-Character Basis**
   - Two characters, same edition
   - Sync one character only
   - Verify: Other character unaffected

#### Integration Tests (`lib/rules/sync/__tests__/integration/`)

| Test File                  | Coverage                                      |
| -------------------------- | --------------------------------------------- |
| `sync-workflow.test.ts`    | End-to-end sync from detection to application |
| `migration-wizard.test.ts` | Full wizard flow with user selections         |
| `api-endpoints.test.ts`    | API route behavior                            |

#### E2E Tests (`e2e/sync/`)

| Test File                  | Coverage                    |
| -------------------------- | --------------------------- |
| `sync-lab.spec.ts`         | Sync Lab page functionality |
| `migration-wizard.spec.ts` | Migration wizard modal flow |
| `stability-shield.spec.ts` | Shield status display       |

### Manual Testing Checklist

1. **Create character with SR5 core rulebook v1.0**
   - [ ] Character created successfully
   - [ ] StabilityShield shows green
   - [ ] Sync status = "synchronized"

2. **Update rulebook with non-breaking changes**
   - [ ] StabilityShield turns yellow
   - [ ] Sync Lab shows available updates
   - [ ] "Apply Safe Updates" works
   - [ ] Shield returns to green

3. **Update rulebook with breaking changes**
   - [ ] StabilityShield turns red
   - [ ] Character marked "invalid"
   - [ ] Cannot join encounter
   - [ ] Migration Wizard appears
   - [ ] User makes selections
   - [ ] Migration applies atomically
   - [ ] Shield returns to green

4. **Delta data preservation**
   - [ ] Add custom notes to character
   - [ ] Apply migration
   - [ ] Custom notes preserved

5. **Rollback capability**
   - [ ] Apply migration
   - [ ] Rollback available
   - [ ] Rollback restores previous state

---

## Dependency Ordering

```
Phase 1 ─────────────────────────────────────────────────────────────────────►
   Types (synchronization.ts, character.ts updates, edition.ts updates)
                    │
                    ▼
Phase 2 ─────────────────────────────────────────────────────────────────────►
   Storage (ruleset-snapshots.ts, characters.ts extensions)
                    │
                    ▼
Phase 3 ─────────────────────────────────────────────────────────────────────►
   Detection (drift-analyzer.ts, legality-validator.ts)
                    │
                    ▼
Phase 4 ─────────────────────────────────────────────────────────────────────►
   Migration (migration-engine.ts, sync-audit.ts)
                    │
                    ▼
Phase 5 ─────────────────────────────────────────────────────────────────────►
   Hooks (hooks.ts, RulesetContext.tsx updates)
                    │
                    ▼
Phase 6 ─────────────────────────────────────────────────────────────────────►
   UI (StabilityShield, Sync Lab, Migration Wizard, character sheet integration)
                    │
                    ▼
Phase 7 ─────────────────────────────────────────────────────────────────────►
   API (sync endpoints, migration endpoints, snapshots endpoints)
```

---

## Files Summary

### New Files

| Path                                                     | Purpose                        |
| -------------------------------------------------------- | ------------------------------ |
| `lib/types/synchronization.ts`                           | Core sync types and interfaces |
| `lib/storage/ruleset-snapshots.ts`                       | Snapshot storage functions     |
| `lib/rules/sync/drift-analyzer.ts`                       | Drift detection engine         |
| `lib/rules/sync/legality-validator.ts`                   | Legality validation            |
| `lib/rules/sync/migration-engine.ts`                     | Migration execution            |
| `lib/rules/sync/sync-audit.ts`                           | Sync audit trail               |
| `lib/rules/sync/hooks.ts`                                | React hooks for sync           |
| `components/sync/StabilityShield.tsx`                    | Status indicator component     |
| `components/sync/SyncWarningBanner.tsx`                  | Warning banner component       |
| `components/sync/MigrationWizard.tsx`                    | Migration wizard modal         |
| `app/characters/[id]/sync/page.tsx`                      | Sync Lab page                  |
| `app/api/characters/[characterId]/sync/route.ts`         | Sync status API                |
| `app/api/characters/[characterId]/sync/migrate/route.ts` | Migration API                  |
| `app/api/rulesets/snapshots/route.ts`                    | Snapshots API                  |

### Modified Files

| Path                           | Changes                                             |
| ------------------------------ | --------------------------------------------------- |
| `lib/types/character.ts`       | Add sync fields, MechanicalSnapshot, DeltaOverrides |
| `lib/types/edition.ts`         | Make version fields required                        |
| `lib/types/index.ts`           | Export new types                                    |
| `lib/storage/characters.ts`    | Add sync-related functions                          |
| `lib/rules/RulesetContext.tsx` | Add version-aware hooks                             |
| `app/characters/[id]/page.tsx` | Integrate StabilityShield and warning banner        |

---

## Referenced Documents

- **Capability:** `docs/capabilities/ruleset.system-synchronization.md`
- **ADR-003:** Rule Merging Strategies
- **ADR-004:** Hybrid Snapshot Model
- **ADR-006:** File-Based Persistence
- **ADR-009:** Append-Only Ledger Pattern
