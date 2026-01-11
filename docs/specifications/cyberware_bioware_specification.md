> [!NOTE]
> This implementation guide is governed by the [Capability (character.augmentation-systems.md)](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/character.augmentation-systems.md).

# Cyberware and Bioware Specification

**Last Updated:** 2025-12-21
**Status:** Specification
**Category:** Core Functionality, Character Creation, Gameplay
**Affected Editions:** SR5 (primary), extensible to other editions

---

## Overview

Cyberware and Bioware are augmentation systems that allow characters to enhance their physical and mental capabilities at the cost of Essence—their metaphysical connection to the world. This specification covers the complete lifecycle of augmentations in Shadow Master, from character creation through gameplay.

**Key Features:**

- Comprehensive cyberware catalog with 12+ categories
- Bioware catalog with 6 categories (basic and cultured)
- Grade system affecting essence cost, nuyen cost, and availability
- Essence tracking with magic/resonance interaction
- Cyberlimb system with capacity and customization
- Modular cyberware with enhancements
- Wireless bonus tracking and Matrix integration
- Essence hole tracking for magic users
- Post-creation augmentation management

**Current Status:** Foundational types and data structures implemented. GearStep provides basic augmentation selection during character creation. See [Acceptance Criteria](#acceptance-criteria) for detailed status.

---

## Data Structures

### Catalog Types (Ruleset)

```typescript
/**
 * Cyberware catalog item definition
 */
interface CyberwareCatalogItem {
  id: string;
  name: string;
  category: CyberwareCategory;
  /** Base essence cost before grade multiplier */
  essenceCost: number;
  /** Base cost in nuyen */
  cost: number;
  /** Base availability rating */
  availability: number;
  /** Whether base availability is Restricted */
  restricted?: boolean;
  /** Whether base availability is Forbidden */
  forbidden?: boolean;
  /** Has variable rating (e.g., Wired Reflexes 1-3) */
  hasRating?: boolean;
  /** Maximum rating if hasRating is true */
  maxRating?: number;
  /** Whether essence cost scales with rating */
  essenceCostPerRating?: boolean;
  /** Whether nuyen cost scales with rating */
  costPerRating?: boolean;
  /** Provides capacity for enhancements (cyberlimbs) */
  providesCapacity?: number;
  /** Uses capacity from parent (enhancements) */
  capacityCost?: number;
  /** Attribute bonuses provided */
  attributeBonuses?: Record<string, number>;
  /** Initiative dice bonus */
  initiativeDiceBonus?: number;
  /** Description of the augmentation */
  description?: string;
  /** Wireless bonus description */
  wirelessBonus?: string;
  /** Page reference in source book */
  page?: number;
  /** Source book ID */
  source?: string;
  /** Compatible mount locations for this enhancement */
  mountLocations?: string[];
  /** Special rules or notes */
  specialRules?: string;
}

/**
 * Bioware catalog item definition
 */
interface BiowareCatalogItem {
  id: string;
  name: string;
  category: BiowareCategory;
  /** Base essence cost before grade multiplier */
  essenceCost: number;
  /** Base cost in nuyen */
  cost: number;
  /** Base availability rating */
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
  hasRating?: boolean;
  maxRating?: number;
  essenceCostPerRating?: boolean;
  costPerRating?: boolean;
  /** Attribute bonuses provided */
  attributeBonuses?: Record<string, number>;
  description?: string;
  page?: number;
  source?: string;
}

/**
 * Cyberware grade definition
 */
interface CyberwareGradeData {
  id: CyberwareGrade;
  name: string;
  /** Multiplier applied to essence cost */
  essenceMultiplier: number;
  /** Multiplier applied to nuyen cost */
  costMultiplier: number;
  /** Modifier added to availability */
  availabilityModifier: number;
  /** Whether this grade is available during creation */
  availableAtCreation: boolean;
}

/**
 * Bioware grade definition
 */
interface BiowareGradeData {
  id: BiowareGrade;
  name: string;
  essenceMultiplier: number;
  costMultiplier: number;
  availabilityModifier: number;
  availableAtCreation: boolean;
}
```

### Character Types (Already Implemented)

```typescript
/**
 * Categories of cyberware
 */
type CyberwareCategory =
  | "headware"
  | "eyeware"
  | "earware"
  | "bodyware"
  | "cyberlimb"
  | "cyberlimb-enhancement"
  | "cyberlimb-accessory"
  | "hand-blade"
  | "hand-razor"
  | "spur"
  | "cybernetic-weapon"
  | "nanocyber";

/**
 * Categories of bioware
 */
type BiowareCategory =
  | "basic"
  | "cultured"
  | "cosmetic"
  | "bio-weapons"
  | "chemical-gland"
  | "organ";

/**
 * Cyberware grade with used option
 */
type CyberwareGrade = "used" | "standard" | "alpha" | "beta" | "delta";

/**
 * Bioware grade (no used option)
 */
type BiowareGrade = "standard" | "alpha" | "beta" | "delta";

/**
 * Installed cyberware on a character
 */
interface CyberwareItem {
  id?: ID;
  catalogId: string;
  name: string;
  category: CyberwareCategory;
  grade: CyberwareGrade;
  baseEssenceCost: number;
  essenceCost: number;
  rating?: number;
  capacity?: number;
  capacityUsed?: number;
  cost: number;
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
  attributeBonuses?: Record<string, number>;
  initiativeDiceBonus?: number;
  notes?: string;
  wirelessBonus?: string;
  wirelessEnabled?: boolean;
  enhancements?: CyberwareItem[];
}

/**
 * Installed bioware on a character
 */
interface BiowareItem {
  id?: ID;
  catalogId: string;
  name: string;
  category: BiowareCategory;
  grade: BiowareGrade;
  baseEssenceCost: number;
  essenceCost: number;
  rating?: number;
  bioIndex?: number;
  cost: number;
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
  attributeBonuses?: Record<string, number>;
  notes?: string;
}

/**
 * Essence hole tracking for magic users
 */
interface EssenceHole {
  peakEssenceLoss: number;
  currentEssenceLoss: number;
  essenceHole: number;
  magicLost: number;
}
```

### Augmentation Rules

```typescript
/**
 * Augmentation rules from ruleset
 */
interface AugmentationRulesData {
  /** Maximum natural essence (typically 6) */
  maxEssence: number;
  /** Maximum attribute bonus from single augmentation */
  maxAttributeBonus: number;
  /** Maximum availability during creation */
  maxAvailabilityAtCreation: number;
  /** Whether to track essence holes */
  trackEssenceHoles: boolean;
  /** How to calculate magic reduction: "roundDown" | "roundUp" */
  magicReductionFormula: string;
  /** Minimum essence to stay alive */
  minimumEssence: number;
}
```

---

## UI Components

### AugmentationsStep (Character Creation)

**Location:** `/app/characters/create/components/steps/AugmentationsStep.tsx`

**Purpose:** Dedicated step for selecting cyberware and bioware during character creation.

**Props:**

```typescript
interface AugmentationsStepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}
```

**Sections:**

1. **Essence Budget Display** - Visual progress bar showing essence spent/remaining
2. **Cyberware Browser** - Categorized list with filters
3. **Bioware Browser** - Categorized list with filters
4. **Selected Augmentations** - List of chosen items with remove option
5. **Cyberlimb Customizer** - Modal/panel for configuring cyberlimbs

**Features:**

- Category accordion for navigation
- Grade selector per item
- Search/filter bar
- Availability badges
- Essence/cost preview before adding
- Magic warning for awakened characters
- Remove button for selected items

### AugmentationCard

**Location:** `/app/characters/create/components/AugmentationCard.tsx`

**Purpose:** Display a single augmentation option in the catalog browser.

**Props:**

```typescript
interface AugmentationCardProps {
  item: CyberwareCatalogItem | BiowareCatalogItem;
  type: "cyberware" | "bioware";
  selectedGrade: CyberwareGrade | BiowareGrade;
  onGradeChange: (grade: string) => void;
  onAdd: () => void;
  disabled?: boolean;
  disabledReason?: string;
}
```

**Display:**

- Item name and category
- Base essence cost (with grade modifier preview)
- Base cost (with grade modifier preview)
- Availability with R/F badge
- Description (collapsible)
- Wireless bonus (if applicable)
- Add button

### InstalledAugmentationCard

**Location:** `/app/characters/create/components/InstalledAugmentationCard.tsx`

**Purpose:** Display an augmentation that has been selected/installed.

**Props:**

```typescript
interface InstalledAugmentationCardProps {
  item: CyberwareItem | BiowareItem;
  type: "cyberware" | "bioware";
  onRemove: () => void;
  onOpenCustomizer?: () => void; // For cyberlimbs
}
```

**Display:**

- Item name with grade badge
- Final essence cost
- Final nuyen cost
- Attribute bonuses (if any)
- Remove button
- Customize button (cyberlimbs only)

### CyberlimbCustomizer

**Location:** `/app/characters/create/components/CyberlimbCustomizer.tsx`

**Purpose:** Modal for configuring a cyberlimb with enhancements.

**Props:**

```typescript
interface CyberlimbCustomizerProps {
  cyberlimb: CyberwareItem;
  availableEnhancements: CyberwareCatalogItem[];
  onUpdate: (updatedLimb: CyberwareItem) => void;
  onClose: () => void;
}
```

**Features:**

- Base stats display (STR 3, AGI 3)
- Attribute customization (+1 to +3)
- Capacity display and tracking
- Enhancement browser
- Installed enhancements list
- Accessory slots

### EssenceDisplay

**Location:** `/components/EssenceDisplay.tsx`

**Purpose:** Reusable essence tracking display.

**Props:**

```typescript
interface EssenceDisplayProps {
  maxEssence: number;
  currentEssence: number;
  essenceHole?: EssenceHole;
  showMagicWarning?: boolean;
  compact?: boolean;
}
```

**Display:**

- Progress bar (full to empty)
- Numeric display (e.g., "4.35 / 6.00")
- Color coding (green > 4, yellow 2-4, red < 2)
- Essence hole indicator (if applicable)
- Magic reduction warning

---

## Character Sheet Integration

### Augmentations Section

**Location:** Right column of character sheet

**Display Structure:**

```
┌─────────────────────────────────────┐
│ AUGMENTATIONS                       │
├─────────────────────────────────────┤
│ Essence: 4.35 / 6.00               │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░ 72.5%        │
├─────────────────────────────────────┤
│ CYBERWARE                           │
│ ┌─────────────────────────────────┐ │
│ │ Wired Reflexes 2 [Alpha]        │ │
│ │ Essence: 2.40 | +2 REA, +2 Init │ │
│ │ 📶 Wireless: Enabled            │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Datajack [Standard]             │ │
│ │ Essence: 0.10                   │ │
│ │ 📶 Wireless: Disabled           │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ▶ Cyberarm (Right) [Alpha]      │ │
│ │   Essence: 0.80 | Capacity: 8   │ │
│ │   STR 5 (+2), AGI 4 (+1)        │ │
│ │   ├─ Cyberarm Gyromount (4)     │ │
│ │   └─ Armor Enhancement 2 (2)    │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ BIOWARE                             │
│ ┌─────────────────────────────────┐ │
│ │ Muscle Toner 2 [Alpha]          │ │
│ │ Essence: 0.32 | +2 AGI          │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Platelet Factories [Standard]   │ │
│ │ Essence: 0.20                   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Derived Stats Impact

Augmentations affect character derived stats:

**Attributes:**

- Muscle Toner: +AGI (up to +4)
- Muscle Augmentation: +STR (up to +4)
- Cerebral Booster: +LOG (up to +3)
- Bone Density Augmentation: +Body for damage resistance

**Initiative:**

- Wired Reflexes: +REA and +1d6 per rating
- Synaptic Booster: +REA and +1d6 per rating
- Reaction Enhancers: +REA per rating

**Limits:**

- Cyberlimb Physical Limit: Uses limb's average attribute for Physical Limit
- Bone Lacing: Increases unarmed damage

**Defense:**

- Dermal Plating: +Armor
- Bone Lacing: +Armor (adamantium, titanium)
- Orthoskin: +Armor

---

## Gameplay Mechanics

### Essence System

**Core Rules:**

1. Characters start with 6.0 Essence
2. Each augmentation costs Essence (modified by grade)
3. Essence cannot drop below 0.01 (death occurs at 0)
4. Each full point of Essence loss reduces Magic/Resonance by 1

**Essence Calculation:**

```typescript
function calculateEssenceCost(
  baseCost: number,
  grade: CyberwareGrade | BiowareGrade,
  rating?: number,
  perRating?: boolean
): number {
  const gradeMultiplier = GRADE_MULTIPLIERS[grade];
  const ratingMultiplier = perRating && rating ? rating : 1;
  return baseCost * gradeMultiplier * ratingMultiplier;
}
```

**Grade Multipliers:**

| Grade    | Cyberware | Bioware | Cost Multi | Avail Mod |
| -------- | --------- | ------- | ---------- | --------- |
| Used     | 1.25x     | N/A     | 0.5x       | -4        |
| Standard | 1.0x      | 1.0x    | 1.0x       | 0         |
| Alpha    | 0.8x      | 0.8x    | 2.0x       | +2        |
| Beta     | 0.6x      | 0.6x    | 4.0x       | +4        |
| Delta    | 0.5x      | 0.5x    | 10.0x      | +8        |

### Essence Holes (Magic Users)

When a magic user loses Essence, their maximum Magic is reduced. If they later remove augmentations, the "essence hole" represents permanent Magic loss.

**Tracking:**

```typescript
interface EssenceHoleState {
  peakEssenceLoss: number; // Highest Essence ever lost
  currentEssenceLoss: number; // Current Essence lost
  essenceHole: number; // peakLoss - currentLoss
  magicLost: number; // Floor(peakEssenceLoss)
}
```

**Example:**

1. Mage has Magic 6, Essence 6.0
2. Installs cyberware costing 2.5 Essence → Essence 3.5, Magic reduced to 4
3. Later removes 1.0 Essence of cyberware → Essence 4.5
4. Essence hole = 2.5 - 1.5 = 1.0 Essence
5. Magic stays at 4 (cannot recover the lost point without special means)

### Cyberlimb System

**Base Stats:**

- All cyberlimbs start with AGI 3, STR 3
- Can be customized up to natural racial maximum +4
- Each +1 costs capacity and nuyen

**Capacity:**

```
| Limb Type        | Base Capacity |
|------------------|---------------|
| Obvious Hand     | 2             |
| Obvious Lower Arm| 10            |
| Obvious Full Arm | 15            |
| Obvious Lower Leg| 8             |
| Obvious Full Leg | 12            |
| Synthetic (any)  | -1 capacity   |
| Skull            | 4             |
| Torso            | 10            |
```

**Enhancements (use capacity):**

- Armor Enhancement (+1-3 armor, 1 cap/rating)
- Strength Enhancement (+1-3 STR, 1 cap/rating)
- Agility Enhancement (+1-3 AGI, 1 cap/rating)
- Cyberarm Gyromount (4 cap)
- Large Smuggling Compartment (5 cap)

### Wireless Bonuses

Most cyberware has wireless bonuses that provide extra benefits when connected to the Matrix:

**Examples:**

- **Wired Reflexes:** +1 to Initiative Score when wireless enabled
- **Smartlink:** +2 to weapon accuracy (instead of +1)
- **Cybereyes:** Real-time updates to visual data

**Trade-offs:**

- Wireless-enabled devices can be hacked
- Noise penalties apply to wireless connections
- EMP attacks can disable wireless functionality

**Tracking:**

```typescript
interface CyberwareItem {
  // ... other fields
  wirelessBonus?: string;
  wirelessEnabled?: boolean; // Default true, can be toggled
}
```

---

## API Endpoints

### Augmentation Operations

**Add Augmentation (Post-Creation):**

```
POST /api/characters/[id]/augmentations
Body: {
  type: "cyberware" | "bioware",
  catalogId: string,
  grade: string,
  rating?: number,
  enhancements?: CyberwareItem[]
}
Response: {
  character: Character,
  addedItem: CyberwareItem | BiowareItem,
  essenceChange: number
}
```

**Remove Augmentation:**

```
DELETE /api/characters/[id]/augmentations/[augId]
Response: {
  character: Character,
  removedItem: CyberwareItem | BiowareItem,
  essenceRecovered: number,
  essenceHoleChange?: number
}
```

**Upgrade Grade:**

```
PATCH /api/characters/[id]/augmentations/[augId]/grade
Body: {
  newGrade: string
}
Response: {
  character: Character,
  essenceChange: number,
  costDifference: number
}
```

**Toggle Wireless:**

```
PATCH /api/characters/[id]/augmentations/[augId]/wireless
Body: {
  enabled: boolean
}
Response: {
  character: Character
}
```

---

## Validation Rules

### Character Creation

1. **Availability Limit:** No augmentation with availability > 12
2. **Forbidden Items:** No items marked as forbidden
3. **Essence Minimum:** Total essence cost cannot exceed 5.99 (minimum 0.01 remaining)
4. **Magic Warning:** Warn when essence loss would reduce Magic below desired level
5. **Duplicate Prevention:** Cannot install same base augmentation twice (e.g., two datajacks)
6. **Incompatibility:** Some augmentations conflict (e.g., cybereyes replace natural eyes)

### Gameplay

1. **Karma/Nuyen Cost:** Adding augmentations requires nuyen (and potentially karma for availability tests)
2. **Street Doc:** Access to high-availability items may require contacts or story justification
3. **Grade Upgrade:** Only upgrade to better grades (not downgrade)
4. **Essence Recovery:** Removing augmentations recovers essence (minus essence hole for magic users)

---

## Calculation Functions

### Essence Calculations

```typescript
/**
 * Calculate current essence
 */
function calculateCurrentEssence(character: Character): number {
  const maxEssence = 6.0;

  const cyberwareEssence = (character.cyberware || []).reduce(
    (sum, item) => sum + item.essenceCost,
    0
  );

  const biowareEssence = (character.bioware || []).reduce((sum, item) => sum + item.essenceCost, 0);

  return Math.max(0.01, maxEssence - cyberwareEssence - biowareEssence);
}

/**
 * Calculate Magic reduction from essence loss
 */
function calculateMagicReduction(essenceLoss: number, formula: "roundDown" | "roundUp"): number {
  return formula === "roundDown" ? Math.floor(essenceLoss) : Math.ceil(essenceLoss);
}

/**
 * Calculate current Magic after essence loss
 */
function calculateCurrentMagic(
  baseMagic: number,
  essenceLoss: number,
  essenceHole?: EssenceHole
): number {
  const lossFromHole = essenceHole?.magicLost || 0;
  const currentReduction = Math.floor(essenceLoss);
  return Math.max(0, baseMagic - Math.max(lossFromHole, currentReduction));
}
```

### Cost Calculations

```typescript
/**
 * Calculate final cost with grade multiplier
 */
function calculateAugmentationCost(
  baseCost: number,
  grade: CyberwareGrade | BiowareGrade,
  rating?: number,
  perRating?: boolean
): number {
  const gradeData = GRADE_DATA[grade];
  const ratingMultiplier = perRating && rating ? rating : 1;
  return baseCost * gradeData.costMultiplier * ratingMultiplier;
}

/**
 * Calculate final availability
 */
function calculateAugmentationAvailability(
  baseAvailability: number,
  grade: CyberwareGrade | BiowareGrade,
  rating?: number,
  perRating?: boolean
): number {
  const gradeData = GRADE_DATA[grade];
  const ratingAddition = perRating && rating ? rating : 0;
  return baseAvailability + gradeData.availabilityModifier + ratingAddition;
}
```

---

## Integration Points

### Character Creation Wizard

**Integration with CreationWizard.tsx:**

- AugmentationsStep added to step list
- CreationState includes cyberware[] and bioware[] arrays
- Budget tracking includes essence spent
- Auto-save persists augmentation selections

### Character Sheet

**Integration with Character Sheet:**

- Augmentations section in right column
- Derived stats reflect augmentation bonuses
- Initiative includes cyberware bonuses
- Essence displayed in quick stats bar

### Dice Roller

**Integration with Dice Roller:**

- Attribute rolls use augmented values
- Initiative rolls include bonus dice
- Combat rolls apply cyberlimb stats

### Magic System

**Integration with Magic:**

- Magic rating reduced by essence loss
- Essence hole tracking for awakened
- Tradition compatibility checks

---

## Future Considerations

### Sourcebook Support

**Chrome Flesh:**

- Geneware (genetic modifications)
- Nanoware expansions
- Bioware symbionts
- Additional cyberware categories

**Run Faster:**

- Metatype-specific augmentations
- Quality interactions

**Rigger 5.0:**

- Vehicle control rig details
- Drone integration

### Edition Differences

**SR6:**

- Simplified essence system
- Different grade structure
- Adjusted availability rules

**SR4:**

- Bio-index vs. essence
- Different capacity rules
- Wireless matrix differences

---

## Testing Requirements

### Unit Tests

**Essence Calculations:**

- Grade multiplier application
- Rating scaling
- Total essence from multiple items
- Magic reduction calculation
- Essence hole tracking

**Cost Calculations:**

- Grade cost multipliers
- Rating cost scaling
- Availability modifiers

**Validation:**

- Availability limit enforcement
- Forbidden item blocking
- Duplicate detection

### Integration Tests

**Character Creation:**

- Add/remove augmentations
- Grade selection
- Cyberlimb customization
- Essence budget tracking

**Character Sheet:**

- Augmentation display
- Derived stat calculation
- Essence display

**Gameplay:**

- Post-creation modification
- Wireless toggle
- Damage tracking

### E2E Tests

**Full Creation Flow:**

- Create character with augmentations
- Verify essence calculations
- Verify derived stats
- Save and reload character

---

## Related Documentation

- **Character Creation:** `/docs/specifications/character_creation_and_management_specification.md`
- **Character Sheet:** `/docs/specifications/character_sheet_specification.md`
- **Gameplay Actions:** `/docs/specifications/gameplay_actions_specification.md`
- **Equipment Ratings:** `/docs/features/equipment-rating-system.md`
- **Character Types:** `/lib/types/character.ts`
- **Ruleset Context:** `/lib/rules/RulesetContext.tsx`

---

## Change Log

### 2025-12-21

- Initial specification created
- Documents existing type definitions and data structures
- Defines complete lifecycle from creation through gameplay
- Outlines phase-based implementation plan

---

## Open Questions

1. **Cyberlimb Partial Actions:** How should actions involving both cyberlimb and natural limb be resolved (e.g., two-handed weapons)?

2. **Wireless Security:** Should we implement full Matrix hacking for wireless augmentations, or simplified vulnerability tracking?

3. **Essence Hole Healing:** What mechanisms should allow essence hole recovery (e.g., initiation, specific spells)?

4. **Visible vs. Concealed:** How detailed should obvious vs. synthetic distinction tracking be?

5. **Cross-Edition Support:** Should augmentation rules be fully edition-specific, or share common infrastructure?

6. **NPC Augmentations:** Should NPCs have simplified or full augmentation tracking?

7. **Augmentation Damage:** How detailed should individual augmentation damage tracking be?

8. **Auto-Soft Integration:** How should cyberware with on-board computers (e.g., smartlink) integrate with programs?

---

_This specification is a living document and will be updated as the augmentation system evolves._
