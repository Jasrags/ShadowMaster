> [!NOTE]
> This implementation guide is governed by the [Capability (character.advancement.md)](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/character.advancement.md).

# Character Advancement Specification

**Last Updated:** 2025-01-27
**Status:** Specification
**Category:** Character Management, Gameplay, Campaign Integration
**Affected Editions:** All editions (costs vary by edition)

---

## Overview

Character advancement is the post-creation system for improving characters using Karma earned during gameplay. This specification defines how characters grow over time through attribute improvements, skill development, quality acquisition, magical advancement, and other progression paths.

**Key Features:**
- Karma-based advancement with edition-specific costs
- Campaign-integrated reward distribution
- GM approval workflows for significant changes
- Full advancement history and audit trail
- Training time rules (optional)
- Advancement validation against prerequisites and limits

**Integration Points:**
- **Campaigns:** GMs award karma, set house rules, approve advancements
- **Character Sheets:** Display advancement options and karma balance
- **Gameplay Actions:** Low-level karma transactions
- **Ruleset System:** Edition-specific costs and constraints

---


## Advancement Rules (SR5)

### Karma Cost Formulas

The following tables define karma costs for Shadowrun 5th Edition. Other editions may have different costs defined in their ruleset data.

#### Attribute Improvement

| Improvement | Karma Cost | Notes |
|-------------|------------|-------|
| Physical/Mental Attribute | New Rating × 5 | Cannot exceed racial maximum |
| Special Attribute (Edge) | New Rating × 5 | Cannot exceed racial maximum |
| Special Attribute (Magic/Resonance) | New Rating × 5 | Requires Awakened/Emerged |

**Example:** Raising Agility from 4 to 5 costs 5 × 5 = 25 karma.

**Cumulative Costs (Starting → Target):**

| From | To 2 | To 3 | To 4 | To 5 | To 6 | To 7 | To 8 | To 9 | To 10 |
|------|------|------|------|------|------|------|------|------|-------|
| 1 | 10 | 25 | 45 | 70 | 100 | 135 | 175 | 220 | 270 |
| 2 | — | 15 | 35 | 60 | 90 | 125 | 165 | 210 | 260 |
| 3 | — | — | 20 | 45 | 75 | 110 | 150 | 195 | 245 |
| 4 | — | — | — | 25 | 55 | 90 | 130 | 175 | 225 |
| 5 | — | — | — | — | 30 | 65 | 105 | 150 | 200 |
| 6 | — | — | — | — | — | 35 | 75 | 120 | 170 |

#### Skill Improvement

| Skill Type | Karma Cost | Notes |
|------------|------------|-------|
| Active Skill | New Rating × 2 | Max rating = linked attribute |
| Skill Group | New Rating × 5 | All skills must be at same rating |
| Knowledge Skill | New Rating × 1 | — |
| Language Skill | New Rating × 1 | — |

**Example:** Raising Pistols from 4 to 5 costs 5 × 2 = 10 karma.

**Cumulative Costs (Active Skills):**

| From | To 1 | To 2 | To 3 | To 4 | To 5 | To 6 | To 7 | To 8 | To 9 | To 10 | To 11 | To 12 |
|------|------|------|------|------|------|------|------|------|------|-------|-------|-------|
| 0 | 2 | 6 | 12 | 20 | 30 | 42 | 56 | 72 | 90 | 110 | 132 | 156 |

#### New Skills and Specializations

| Improvement | Karma Cost | Notes |
|-------------|------------|-------|
| New Active Skill (Rating 1) | 2 | Must have linked attribute ≥ 1 |
| New Knowledge/Language Skill | 1 | — |
| New Specialization | 7 | Skill must be Rating 1+ |
| New Expertise | 14 | Requires specialization first (optional rule) |

#### Qualities

| Improvement | Karma Cost | Notes |
|-------------|------------|-------|
| New Positive Quality | Quality Cost × 2 | Subject to prerequisites and GM approval |
| Buy Off Negative Quality | Bonus Value × 2 | Subject to story justification |

**Example:** Acquiring Ambidextrous (4 karma at creation) costs 4 × 2 = 8 karma post-creation.

**Example:** Buying off Addiction (Mild, 4 karma bonus) costs 4 × 2 = 8 karma.

#### Magic and Resonance

| Improvement | Karma Cost | Notes |
|-------------|------------|-------|
| New Spell | 5 | Requires Spellcasting skill |
| New Ritual | 5 | Requires Ritual Spellcasting skill |
| New Preparation Formula | 5 | Requires Alchemy skill |
| New Complex Form | 4 | Technomancers only |
| New Adept Power | Power Point cost × ? | See Adept section |
| New Initiate Grade | 10 + (Grade × 3) | Awakened only |
| New Submersion Grade | 10 + (Grade × 3) | Technomancers only |

**Initiation/Submersion Costs:**

| Grade | Base Cost | With Ordeal/Task | With Group |
|-------|-----------|------------------|------------|
| 1 | 13 | 10 | 10 |
| 2 | 16 | 13 | 13 |
| 3 | 19 | 15 | 15 |
| 4 | 22 | 18 | 18 |
| 5 | 25 | 20 | 20 |
| 6 | 28 | 22 | 22 |

**Ordeal Discount:** −10% (round down)
**Group Discount:** −10% (round down)
**Both:** −20% (round down)

#### Adept Powers

Adepts gain Power Points equal to their Magic attribute. Additional Power Points can be purchased:

| Improvement | Karma Cost | Notes |
|-------------|------------|-------|
| Power Point | 5 | Cannot exceed Magic rating |

Adept powers cost Power Points, not karma directly. The PP cost varies by power.

#### Contacts

| Improvement | Karma Cost | Notes |
|-------------|------------|-------|
| New Contact | (Connection + Loyalty) × 1 | Subject to narrative justification |
| Increase Connection | New Rating × 1 | Requires story interaction |
| Increase Loyalty | New Rating × 1 | Requires story interaction |

---

## Advancement Constraints

### Attribute Limits

- **Racial Maximum:** Each metatype has maximum attribute ratings. Standard humans max at 6, with exceptional attribute quality allowing 7.
- **Augmented Maximum:** Racial maximum + 4 (from augmentations/magic)
- **Special Attributes:** Edge, Magic, and Resonance have their own racial limits

### Skill Limits

- **Maximum Rating:** Active skills cannot exceed the linked attribute rating without qualities (Aptitude allows rating 7 in one skill)
- **Skill Group Integrity:** To raise a skill group, all component skills must be at the same rating
- **Specializations:** Limited to one per skill (expertise is optional additional specialization)

### Quality Restrictions

- **Prerequisites:** Many qualities have attribute, skill, or other quality prerequisites
- **Incompatibilities:** Some qualities cannot be taken together
- **GM Approval:** Post-creation quality acquisition typically requires GM approval
- **Story Justification:** Buying off negative qualities requires appropriate in-game narrative

### Magic/Resonance Restrictions

- **Cannot Awaken:** Non-magical characters cannot become magical after creation
- **Cannot Emerge:** Non-technomancer characters cannot become technomancers after creation
- **Initiation Requirements:** Must be Awakened, may require group membership or ordeal completion
- **Tradition Limits:** Some spells/powers restricted to certain traditions

---

## Training Time Rules (Optional)

Some campaigns use training time to pace advancement. When enabled:

| Improvement | Training Time | Notes |
|-------------|---------------|-------|
| Attribute | (New Rating) weeks | May require trainer |
| Active Skill | (New Rating) days | May require trainer or practice |
| Skill Group | (New Rating) weeks | All skills train together |
| New Skill (Rating 1) | 1 week | May require instruction |
| Specialization | 1 week | Focused practice |
| Spell/Ritual | 1 week | Study or instruction |
| Complex Form | 1 week | Resonance meditation |
| Initiation | 1 month minimum | Ordeal, group ritual, or solo quest |
| Quality | Varies | GM discretion based on narrative |

**Trainer Bonus:** Having a qualified trainer reduces time by 25-50% (GM discretion).

---

## Data Model

### Advancement Request

```typescript
/**
 * Types of advancements that can be made
 */
export type AdvancementType =
  | "attribute"
  | "active_skill"
  | "skill_group"
  | "knowledge_skill"
  | "language_skill"
  | "specialization"
  | "positive_quality"
  | "buy_off_quality"
  | "spell"
  | "ritual"
  | "complex_form"
  | "adept_power"
  | "power_point"
  | "initiation"
  | "submersion"
  | "metamagic"
  | "echo"
  | "contact"
  | "contact_improvement";

/**
 * Request to advance a character
 */
export interface AdvancementRequest {
  /** Type of advancement */
  type: AdvancementType;

  /** Target being improved (attribute ID, skill ID, quality ID, etc.) */
  targetId: string;

  /** Human-readable target name */
  targetName?: string;

  /** New rating (for rating-based improvements) */
  newRating?: number;

  /** Additional options (specialization name, spell details, etc.) */
  options?: Record<string, unknown>;

  /** Player notes/justification */
  notes?: string;

  /** If this requires GM approval */
  requiresApproval?: boolean;
}

/**
 * Result of advancement validation
 */
export interface AdvancementValidationResult {
  valid: boolean;
  errors: Array<{ message: string; field?: string }>;
  warnings?: Array<{ message: string }>;
  cost: number;
  trainingTime?: {
    duration: number;
    unit: "days" | "weeks" | "months";
  };
  requiresApproval: boolean;
  prerequisites?: Array<{
    met: boolean;
    description: string;
  }>;
}

/**
 * Completed advancement record
 */
export interface AdvancementRecord {
  id: ID;
  characterId: ID;
  campaignId?: ID;
  sessionId?: ID;

  /** Type of advancement */
  type: AdvancementType;

  /** What was improved */
  targetId: string;
  targetName: string;

  /** Before and after values */
  previousValue?: number | string;
  newValue: number | string;

  /** Karma spent */
  karmaCost: number;

  /** Training time (if applicable) */
  trainingTime?: {
    duration: number;
    unit: "days" | "weeks" | "months";
    startDate?: ISODateString;
    endDate?: ISODateString;
  };

  /** Approval tracking */
  status: "pending" | "approved" | "rejected" | "completed";
  approvedBy?: ID;
  approvedAt?: ISODateString;
  rejectionReason?: string;

  /** Player notes */
  notes?: string;

  /** Timestamps */
  requestedAt: ISODateString;
  completedAt?: ISODateString;
}
```

### Karma Transaction

```typescript
/**
 * Categories of karma transactions
 */
export type KarmaCategory =
  | "run_reward"
  | "session_reward"
  | "attribute"
  | "skill"
  | "quality"
  | "magic"
  | "resonance"
  | "contact"
  | "other"
  | "gm_adjustment";

/**
 * A single karma transaction in the ledger
 */
export interface KarmaTransaction {
  id: ID;
  characterId: ID;
  campaignId?: ID;
  sessionId?: ID;

  /** Transaction type */
  type: "award" | "expense";

  /** Amount (positive for awards, positive for expenses - type determines sign) */
  amount: number;

  /** Category for grouping/filtering */
  category: KarmaCategory;

  /** Description of the transaction */
  description: string;

  /** Link to advancement record if this was an expense */
  advancementId?: ID;

  /** Link to specific target (skill ID, quality ID, etc.) */
  targetId?: string;
  targetName?: string;

  /** Who recorded this transaction */
  recordedBy: ID;

  /** GM approval status */
  gmApproved?: boolean;
  approvedBy?: ID;

  /** Timestamp */
  timestamp: ISODateString;

  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Character's karma summary
 */
export interface KarmaSummary {
  /** Total karma ever earned */
  karmaTotal: number;

  /** Current unspent karma */
  karmaCurrent: number;

  /** Breakdown by category */
  earned: {
    runRewards: number;
    sessionRewards: number;
    gmAwards: number;
    other: number;
  };

  /** Breakdown by category */
  spent: {
    attributes: number;
    skills: number;
    qualities: number;
    magic: number;
    contacts: number;
    other: number;
  };

  /** Recent transactions */
  recentTransactions: KarmaTransaction[];
}
```

### Campaign Advancement Settings

```typescript
/**
 * Campaign-specific advancement configuration
 */
export interface CampaignAdvancementSettings {
  /** Training time rules enabled */
  trainingTimeEnabled: boolean;

  /** Trainer availability modifier (0.5 = 50% time reduction) */
  trainerModifier?: number;

  /** Advancements requiring GM approval */
  requireApprovalFor: AdvancementType[];

  /** Restricted advancement types (not allowed in this campaign) */
  restrictedAdvancements?: AdvancementType[];

  /** Karma cost modifiers (multipliers) */
  costModifiers?: Partial<Record<AdvancementType, number>>;

  /** House rules (freeform) */
  houseRules?: string;

  /** Maximum rating caps (overrides ruleset) */
  ratingCaps?: {
    attributes?: number;
    skills?: number;
    magic?: number;
  };

  /** Auto-approve minor advancements (skills below rating X) */
  autoApproveThreshold?: number;
}
```

---

## API Endpoints

### Character Advancement

#### GET `/api/characters/[characterId]/advancement`

**Purpose:** Get character's advancement history and available options

**Response:**
```typescript
{
  success: boolean;
  karmaSummary: KarmaSummary;
  advancementHistory: AdvancementRecord[];
  pendingAdvancements: AdvancementRecord[];
  availableAdvancements: AvailableAdvancement[];
  error?: string;
}
```

---

#### POST `/api/characters/[characterId]/advancement`

**Purpose:** Request a character advancement

**Request:**
```typescript
{
  type: AdvancementType;
  targetId: string;
  newRating?: number;
  options?: Record<string, unknown>;
  notes?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  advancement?: AdvancementRecord;
  transaction?: KarmaTransaction;
  updatedCharacter?: Character;
  error?: string;
  validationErrors?: Array<{ message: string; field?: string }>;
}
```

**Validation:**
- Character must belong to authenticated user
- Character must have sufficient karma
- Target must exist and be improvable
- Prerequisites must be met
- Rating limits must not be exceeded
- Campaign restrictions must be respected

---

#### GET `/api/characters/[characterId]/advancement/options`

**Purpose:** Get available advancement options with costs

**Query Parameters:**
- `type?: AdvancementType` - Filter by type
- `affordable?: boolean` - Only show affordable options

**Response:**
```typescript
{
  success: boolean;
  options: {
    attributes: AttributeAdvancementOption[];
    skills: SkillAdvancementOption[];
    qualities: QualityAdvancementOption[];
    magic: MagicAdvancementOption[];
    other: OtherAdvancementOption[];
  };
  karmaCurrent: number;
  error?: string;
}
```

---

#### POST `/api/characters/[characterId]/advancement/validate`

**Purpose:** Validate an advancement request without executing it

**Request:**
```typescript
{
  type: AdvancementType;
  targetId: string;
  newRating?: number;
  options?: Record<string, unknown>;
}
```

**Response:**
```typescript
{
  success: boolean;
  validation: AdvancementValidationResult;
  error?: string;
}
```

---

### Karma Management

#### GET `/api/characters/[characterId]/karma`

**Purpose:** Get character's karma ledger

**Query Parameters:**
- `limit?: number` - Number of transactions (default 50)
- `offset?: number` - Pagination offset
- `category?: KarmaCategory` - Filter by category
- `type?: "award" | "expense"` - Filter by type

**Response:**
```typescript
{
  success: boolean;
  summary: KarmaSummary;
  transactions: KarmaTransaction[];
  total: number;
  error?: string;
}
```

---

#### POST `/api/characters/[characterId]/karma`

**Purpose:** Record a karma transaction (award or manual expense)

**Request:**
```typescript
{
  type: "award" | "expense";
  amount: number;
  category: KarmaCategory;
  description: string;
  sessionId?: ID;
  metadata?: Record<string, unknown>;
}
```

**Response:**
```typescript
{
  success: boolean;
  transaction?: KarmaTransaction;
  updatedKarma?: { total: number; current: number };
  error?: string;
}
```

**Validation:**
- GM or character owner can award karma
- Only character owner can spend karma (via advancement endpoints)
- Amount must be positive
- Cannot spend more than available

---

### Campaign Advancement

#### GET `/api/campaigns/[campaignId]/advancement`

**Purpose:** Get advancement log for entire campaign (GM only)

**Query Parameters:**
- `status?: "pending" | "approved" | "completed"` - Filter by status
- `characterId?: ID` - Filter by character
- `type?: AdvancementType` - Filter by type
- `limit?: number` - Pagination limit
- `offset?: number` - Pagination offset

**Response:**
```typescript
{
  success: boolean;
  advancements: AdvancementRecord[];
  total: number;
  pendingCount: number;
  error?: string;
}
```

---

#### POST `/api/campaigns/[campaignId]/karma/award`

**Purpose:** Award karma to multiple characters at once (GM only)

**Request:**
```typescript
{
  characterIds: ID[];        // Characters to award (empty = all active)
  amount: number;
  category: KarmaCategory;
  description: string;
  sessionId?: ID;
}
```

**Response:**
```typescript
{
  success: boolean;
  transactions: KarmaTransaction[];
  error?: string;
}
```

---

#### PUT `/api/campaigns/[campaignId]/advancement/[advancementId]`

**Purpose:** Approve or reject a pending advancement (GM only)

**Request:**
```typescript
{
  action: "approve" | "reject";
  reason?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  advancement?: AdvancementRecord;
  error?: string;
}
```

---

#### PUT `/api/campaigns/[campaignId]/settings/advancement`

**Purpose:** Update campaign advancement settings (GM only)

**Request:**
```typescript
{
  settings: Partial<CampaignAdvancementSettings>;
}
```

**Response:**
```typescript
{
  success: boolean;
  settings?: CampaignAdvancementSettings;
  error?: string;
}
```

---

## Components

### 1. AdvancementPanel

**Location:** `/app/characters/[id]/components/AdvancementPanel.tsx`

**Description:** Main panel for viewing and managing character advancement.

**Features:**
- Karma summary display (total, current, breakdown)
- Quick advancement shortcuts for common improvements
- Pending advancement queue (if any awaiting approval)
- Link to full advancement history
- Context-aware suggestions based on character build

**Props:**
```typescript
interface AdvancementPanelProps {
  character: Character;
  campaign?: Campaign;
  onAdvance: (request: AdvancementRequest) => Promise<void>;
}
```

---

### 2. KarmaSummaryCard

**Location:** `/app/characters/[id]/components/KarmaSummaryCard.tsx`

**Description:** Compact display of karma status.

**Features:**
- Current karma prominently displayed
- Total earned karma
- Pie chart or bar showing spent by category
- Recent transactions preview
- Link to full karma ledger

---

### 3. AdvancementDialog

**Location:** `/app/characters/[id]/components/AdvancementDialog.tsx`

**Description:** Modal dialog for executing an advancement.

**Features:**
- Target selection (attribute, skill, etc.)
- Current and new value display
- Cost calculation with breakdown
- Prerequisites checklist
- Training time display (if enabled)
- Confirmation with karma deduction preview
- GM approval notice (if required)

---

### 4. AdvancementOptionsGrid

**Location:** `/app/characters/[id]/components/AdvancementOptionsGrid.tsx`

**Description:** Grid/list of available advancement options.

**Sections:**
- Attributes (grouped by category)
- Skills (grouped by group, with linked attribute shown)
- Qualities (positive available for purchase)
- Magic/Resonance (spells, powers, initiation)
- Contacts (improvement options)

**Features:**
- Cost display for each option
- Affordable/unaffordable visual distinction
- Prerequisites indicator
- Quick-advance action for simple improvements
- Search/filter functionality

---

### 5. KarmaLedger

**Location:** `/app/characters/[id]/components/KarmaLedger.tsx`

**Description:** Full karma transaction history.

**Features:**
- Chronological transaction list
- Category filters
- Type filters (awards vs expenses)
- Running balance display
- Export to CSV
- Session grouping option

---

### 6. CampaignAdvancementLog

**Location:** `/app/campaigns/[id]/components/CampaignAdvancementLog.tsx`

**Description:** Campaign-wide advancement history (GM view).

**Features:**
- All character advancements in one view
- Pending approvals queue
- Filter by character, type, status
- Bulk approval actions
- Export functionality

---

### 7. SessionRewardDialog

**Location:** `/app/campaigns/[id]/components/SessionRewardDialog.tsx`

**Description:** GM dialog for awarding post-session karma.

**Features:**
- Session selection (from calendar)
- Character checklist (select who participated)
- Karma amount input
- Nuyen amount input (separate tracking)
- Suggested amounts based on SR5 formulas
- Notes field
- Bulk award execution

---

### 8. PendingApprovalCard

**Location:** `/components/advancement/PendingApprovalCard.tsx`

**Description:** Card showing a pending advancement awaiting GM approval.

**Features:**
- Character name and advancement summary
- Cost and impact preview
- Player notes/justification
- Approve/Reject buttons (GM only)
- Rejection reason input

---

## UI/UX Workflows

### Player: Advancing a Skill

1. Player opens character sheet
2. Player clicks skill rating or "Improve" button
3. System shows AdvancementDialog with:
   - Current rating: 4
   - New rating: 5
   - Karma cost: 10
   - Prerequisites: ✓ Linked attribute 5+
   - Training time: 5 days (if enabled)
4. Player confirms advancement
5. System validates and processes:
   - Deducts karma
   - Updates skill rating
   - Records transaction and advancement
   - Recalculates derived stats
6. Character sheet updates with new rating
7. Karma display updates

### Player: Acquiring a Quality

1. Player opens Qualities section or Advancement Panel
2. Player browses available qualities
3. Player selects desired quality
4. System shows AdvancementDialog with:
   - Quality: Ambidextrous
   - Karma cost: 8 (base 4 × 2)
   - Prerequisites: ✓ None
   - Status: Requires GM Approval
5. Player submits request with notes
6. System creates pending advancement
7. GM receives notification
8. GM reviews and approves/rejects
9. If approved:
   - Karma deducted
   - Quality added to character
   - Notifications sent

### GM: Awarding Session Karma

1. GM opens campaign detail page
2. GM navigates to Calendar or Sessions
3. GM clicks "Award Rewards" on completed session
4. SessionRewardDialog opens:
   - Session: "Run Against Aztechnology" - Jan 15
   - Participants: [✓] Alice [✓] Bob [✓] Charlie
   - Karma: 6 (suggested based on difficulty)
   - Nuyen: 15,000 per runner
   - Notes: "Bonus for creative solution"
5. GM confirms
6. System creates transactions for each character
7. Players receive notifications
8. Campaign advancement log updated

### GM: Reviewing Pending Advancements

1. GM opens campaign detail page
2. GM sees "3 Pending Approvals" badge
3. GM clicks to view pending queue
4. For each pending advancement:
   - Reviews character, advancement type, cost
   - Reads player justification
   - Approves or rejects with reason
5. System processes approved advancements
6. Players notified of decisions

---

## Validation Logic

### Attribute Advancement Validation

```typescript
function validateAttributeAdvancement(
  character: Character,
  attributeId: string,
  newRating: number,
  ruleset: MergedRuleset,
  campaign?: Campaign
): AdvancementValidationResult {
  const errors: Array<{ message: string; field?: string }> = [];
  const warnings: Array<{ message: string }> = [];

  // Get current rating
  const currentRating = character.attributes[attributeId] || 1;

  // Check rating increase is valid (can only increase by 1)
  if (newRating !== currentRating + 1) {
    errors.push({
      message: "Can only increase attribute by 1 at a time",
      field: "newRating"
    });
  }

  // Get racial maximum
  const metatype = ruleset.metatypes.find(m => m.id === character.metatypeId);
  const racialMax = metatype?.attributeLimits?.[attributeId]?.max || 6;
  const exceptionalMax = characterHasQuality(character, "exceptional_attribute", attributeId)
    ? racialMax + 1
    : racialMax;

  // Check against maximum
  if (newRating > exceptionalMax) {
    errors.push({
      message: `Cannot exceed racial maximum of ${exceptionalMax}`,
      field: "newRating"
    });
  }

  // Calculate cost
  const cost = newRating * 5;

  // Check karma availability
  if (character.karmaCurrent < cost) {
    errors.push({
      message: `Insufficient karma. Need ${cost}, have ${character.karmaCurrent}`,
      field: "karma"
    });
  }

  // Check campaign restrictions
  if (campaign?.advancementSettings?.restrictedAdvancements?.includes("attribute")) {
    errors.push({
      message: "Attribute advancement is restricted in this campaign"
    });
  }

  // Apply campaign cost modifiers
  let finalCost = cost;
  if (campaign?.advancementSettings?.costModifiers?.attribute) {
    finalCost = Math.ceil(cost * campaign.advancementSettings.costModifiers.attribute);
  }

  // Calculate training time
  const trainingTime = campaign?.advancementSettings?.trainingTimeEnabled
    ? { duration: newRating, unit: "weeks" as const }
    : undefined;

  // Determine if approval needed
  const requiresApproval = campaign?.advancementSettings?.requireApprovalFor?.includes("attribute")
    ?? false;

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    cost: finalCost,
    trainingTime,
    requiresApproval,
    prerequisites: []
  };
}
```

### Skill Advancement Validation

```typescript
function validateSkillAdvancement(
  character: Character,
  skillId: string,
  newRating: number,
  ruleset: MergedRuleset,
  campaign?: Campaign
): AdvancementValidationResult {
  const errors: Array<{ message: string; field?: string }> = [];
  const prerequisites: Array<{ met: boolean; description: string }> = [];

  // Get skill definition
  const skill = ruleset.skills.find(s => s.id === skillId);
  if (!skill) {
    return {
      valid: false,
      errors: [{ message: `Skill '${skillId}' not found` }],
      cost: 0,
      requiresApproval: false
    };
  }

  // Get current rating
  const currentRating = character.skills?.[skillId]?.rating || 0;

  // Check rating increase is valid
  if (newRating !== currentRating + 1) {
    errors.push({
      message: "Can only increase skill by 1 at a time",
      field: "newRating"
    });
  }

  // Check linked attribute limit
  const linkedAttribute = skill.linkedAttribute;
  const attributeRating = character.attributes[linkedAttribute] || 1;

  const aptitudeSkill = getAptitudeSkillId(character);
  const maxRating = aptitudeSkill === skillId ? 7 : Math.min(attributeRating, 6);

  prerequisites.push({
    met: newRating <= attributeRating,
    description: `${linkedAttribute} must be at least ${newRating}`
  });

  if (newRating > maxRating) {
    errors.push({
      message: `Cannot exceed skill maximum of ${maxRating}`,
      field: "newRating"
    });
  }

  // Check skill group integrity (if part of group)
  if (skill.groupId && character.skillGroups?.[skill.groupId]) {
    // Breaking from group - that's allowed but warn
    warnings.push({
      message: "This will break the skill group"
    });
  }

  // Calculate cost
  const isNewSkill = currentRating === 0;
  const cost = isNewSkill ? 2 : newRating * 2;

  // Check karma
  if (character.karmaCurrent < cost) {
    errors.push({
      message: `Insufficient karma. Need ${cost}, have ${character.karmaCurrent}`,
      field: "karma"
    });
  }

  // Training time
  const trainingTime = campaign?.advancementSettings?.trainingTimeEnabled
    ? { duration: newRating, unit: "days" as const }
    : undefined;

  // Approval threshold
  const autoApproveThreshold = campaign?.advancementSettings?.autoApproveThreshold ?? 6;
  const requiresApproval = newRating > autoApproveThreshold ||
    campaign?.advancementSettings?.requireApprovalFor?.includes("active_skill");

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    cost,
    trainingTime,
    requiresApproval,
    prerequisites
  };
}
```

---

## Integration with Campaign System

### Campaign Settings Extension

The Campaign type should be extended to include advancement settings:

```typescript
interface Campaign {
  // ... existing fields ...

  /** Advancement configuration */
  advancementSettings?: CampaignAdvancementSettings;
}
```

### Run Reward Integration

When a session is marked complete in the campaign calendar:

1. GM can trigger "Award Run Rewards" action
2. System suggests karma/nuyen based on SR5 formulas:
   - Base karma: 2 (survival) + 2 (objectives) + difficulty bonus
   - Base nuyen: 3,000¥ + negotiation bonus
3. GM adjusts as needed
4. System creates karma transactions for all participating characters
5. Transactions link to session for audit trail

### Character Creation Karma

Characters created for a campaign start with 0 post-creation karma. Any leftover karma from creation (if the creation method allows) should be recorded as:
- Type: "award"
- Category: "other"
- Description: "Leftover karma from character creation"

---

## Storage Layer

### File Structure

```
data/
├── characters/
│   └── {userId}/
│       └── {characterId}.json  # Includes karma fields
└── advancement/
    └── {characterId}/
        ├── transactions.json   # Karma ledger
        └── history.json        # Advancement records
```

### Storage Functions

**Location:** `/lib/storage/advancement.ts`

```typescript
// Karma transactions
export function getKarmaTransactions(characterId: ID, options?: QueryOptions): KarmaTransaction[];
export function createKarmaTransaction(transaction: Omit<KarmaTransaction, "id">): KarmaTransaction;
export function getKarmaSummary(characterId: ID): KarmaSummary;

// Advancement records
export function getAdvancementHistory(characterId: ID, options?: QueryOptions): AdvancementRecord[];
export function createAdvancementRecord(record: Omit<AdvancementRecord, "id">): AdvancementRecord;
export function updateAdvancementRecord(recordId: ID, updates: Partial<AdvancementRecord>): AdvancementRecord;
export function getPendingAdvancements(campaignId: ID): AdvancementRecord[];

// Campaign-level queries
export function getCampaignAdvancementLog(campaignId: ID, options?: QueryOptions): AdvancementRecord[];
export function awardKarmaToCampaign(campaignId: ID, amount: number, description: string, characterIds?: ID[]): KarmaTransaction[];
```

---


## Security Considerations

### Authorization

- Players can only advance their own characters
- Players can only spend their own karma
- GMs can award karma to any character in their campaign
- GMs can approve/reject advancements in their campaign
- Only GMs can modify campaign advancement settings

### Validation

- All advancement requests validated server-side
- Karma balance verified before any expense
- Prerequisites checked against current character state
- Rating limits enforced per ruleset and campaign
- Transaction amounts must be positive integers

### Audit Trail

- All karma transactions recorded with timestamp and source
- All advancement records preserved indefinitely
- GM approvals/rejections logged with reason
- No deletion of historical records (soft delete only)

---

## Related Documentation

- **Campaign Support:** `/docs/specifications/campaign_support_specification.md`
- **Gameplay Actions:** `/docs/specifications/gameplay_actions_specification.md`
- **Character Creation:** `/docs/specifications/character_creation_and_management_specification.md`
- **Qualities System:** `/docs/specifications/qualities_specification.md`
- **SR5 Rules Reference:** `/docs/rules/5e/`
- **Karma Tables:** `/docs/data_tables/creation/`

---

## SR5 Core Rulebook References

### Character Improvement (p. 103-107)

> **Improving Attributes**
> Increasing an attribute costs New Rating × 5 Karma. A character cannot raise an attribute above their natural maximum for their metatype.

> **Improving Skills**
> Increasing an Active skill costs New Rating × 2 Karma. Increasing a skill group costs New Rating × 5 Karma. Increasing a Knowledge or Language skill costs New Rating × 1 Karma.

> **Learning New Skills**
> A character can learn a new Active skill at Rating 1 for 2 Karma. A new Knowledge or Language skill costs 1 Karma.

> **Specializations**
> A character can add a specialization to an existing skill for 7 Karma.

> **Improving Qualities**
> Positive qualities may be acquired after character creation at double the listed Karma cost, subject to GM approval. Negative qualities may be bought off at double the Karma bonus received, subject to appropriate in-game justification.

### Initiation and Submersion (p. 324-326, 325-327)

> **Initiation**
> Awakened characters can undergo initiation to increase their magical abilities. The Karma cost for each grade is 10 + (Grade × 3). Ordeals and magical group membership can reduce this cost.

> **Submersion**
> Technomancers follow a similar path called submersion. The cost formula is identical to initiation.

### Contact Improvement (p. 389)

> **Improving Contacts**
> Characters can improve their contacts' Connection or Loyalty ratings by paying Karma equal to the new rating. New contacts cost (Connection + Loyalty) Karma.

---

## Open Questions

1. **Skill Group Advancement:** When a player wants to advance a skill group, should all component skills already be at the same rating, or can we automatically bring them up?
   - **Recommendation:** Require all skills at same rating before group advancement

2. **Partial Advancements:** Should players be able to "reserve" karma toward a future advancement?
   - **Recommendation:** No reservation - karma is spent immediately or not at all

3. **Advancement Rollback:** Should GMs be able to undo approved advancements?
   - **Recommendation:** Yes, with audit trail, but only for recent advancements

4. **Cross-Campaign Characters:** If a character is in multiple campaigns, how do advancement settings interact?
   - **Recommendation:** Characters can only be in one campaign at a time (per campaign spec)

5. **Training During Play:** Should training time pause during active runs/sessions?
   - **Recommendation:** Training time is "downtime" between sessions, GM discretion

6. **Attribute vs Skill Priority:** Should the system warn if a player tries to raise a skill above its linked attribute?
   - **Recommendation:** Yes, show warning but allow the skill increase (will be "capped" at attribute for tests)

7. **Negative Karma:** Can karma balance go negative (debt)?
   - **Recommendation:** No - karma cannot go below 0

8. **Retroactive Advancements:** If campaign settings change, do existing advancements get re-validated?
   - **Recommendation:** No - already-completed advancements are grandfathered

---

## Change Log

### 2025-01-27
- Initial specification created
- Defined SR5 karma cost formulas
- Designed data models for transactions and records
- Defined API endpoints
- Integrated with campaign system
- Added validation logic examples

---

*This specification is a living document and will be updated as the advancement system evolves.*
