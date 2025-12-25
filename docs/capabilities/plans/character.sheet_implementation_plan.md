# Character Sheet Implementation Plan

**Capability Document:** [character.sheet.md](../character.sheet.md)
**Last Updated:** 2025-12-24
**Status:** Draft
**Priority:** High (Core User Experience)

---

## Goal Description

Implement the complete Character Sheet capability as defined in `docs/capabilities/character.sheet.md`. This plan addresses gaps between the current implementation and the capability guarantees, focusing on:

1. **State Visualization Enhancement** - Interactive condition monitors with damage application
2. **Derived Stats Automation** - Ensure all derived values update reactively and display wound modifiers
3. **Responsive Presentation** - Print-optimized layouts and enhanced mobile experience
4. **Interactive Integration** - Pre-calculated dice pools, inline actions, and workflow transitions
5. **Preference Persistence** - Theme and layout preferences stored and applied consistently

---

## Current Implementation Analysis

### Existing Features (Already Implemented)

| Feature | Location | Status |
|---------|----------|--------|
| Character header with metadata | `/app/characters/[id]/page.tsx:140-200` | Complete |
| Core attributes table | `/app/characters/[id]/page.tsx:1031-1050` | Complete |
| Condition monitors (display) | `/app/characters/[id]/page.tsx:850-950` | Partial |
| Derived stats (Limits, Initiative) | `/app/characters/[id]/page.tsx:1031-1069` | Complete |
| Skills with dice pools | `/app/characters/[id]/page.tsx:600-700` | Complete |
| Dice roller modal | `/app/characters/[id]/page.tsx` + `/components/DiceRoller.tsx` | Complete |
| Theme selector (neon-rain/modern-card) | `/app/characters/[id]/page.tsx:1100-1150` | Complete |
| Quality dynamic state tracking | `/app/characters/[id]/components/QualitiesSection.tsx` | Complete |
| Quality effect calculations | `/lib/rules/qualities/gameplay-integration.ts` | Complete |

### Gaps to Address

| Gap | Capability Reference | Priority |
|-----|----------------------|----------|
| Damage application UI | "Condition monitors MUST visually track physical and stun damage" | High |
| Wound modifier display on affected rolls | "automatic identification of associated penalties" | High |
| Print-optimized layout | "accessible and optimized for mobile, tablet, and desktop" | Medium |
| Combat action helper (defense values) | "pre-calculated and available for immediate use" | Medium |
| Healing timeline tracking | Quality effects integration | Low |
| Quality effect tooltips | "clear, rating-based indicators" | Low |
| Section collapse/expand state persistence | "persistent and consistently applied" | Low |

---

## User Review Required

### Critical Architectural Decisions

**1. Damage Application Approach**

The capability requires interactive condition monitors. Two approaches:

| Approach | Pros | Cons |
|----------|------|------|
| **A: Direct mutation (Recommended)** | Simpler UX, immediate feedback | No GM oversight |
| **B: Request-based** | GM can approve damage | More friction |

**Recommendation:** Approach A for non-campaign characters, Approach B for campaign-linked characters requiring GM approval.

**2. Wound Modifier Display Strategy**

Should wound modifiers be shown:
- **A: Inline with each dice pool** (e.g., "Pistols: 12 - 2 wound = 10")
- **B: Global banner** when wounded (persistent reminder at top)
- **C: Both** (Recommended)

**3. Print Layout Implementation**

Options for print optimization:
- **A: CSS @media print** (minimal code, browser-dependent)
- **B: Dedicated print route** (`/characters/[id]/print`) with simplified layout
- **C: PDF generation** (requires server-side library)

**Recommendation:** Start with A + B, defer C for future.

---

## Proposed Changes

### Phase 1: Interactive Condition Monitors (High Priority)

#### 1.1 Damage Application API

**Files to Create:**
- `/app/api/characters/[characterId]/damage/route.ts` - Apply/heal damage endpoint

**Requirements Satisfied:**
- **Guarantee:** "The character sheet MUST present an accurate and comprehensive reflection of the character's current state"
- **Requirement:** "Condition monitors MUST visually track physical and stun damage"

**Interface Definition:**
```typescript
// POST /api/characters/[characterId]/damage
interface DamageRequest {
  type: "physical" | "stun" | "overflow";
  amount: number;  // Positive = apply damage, negative = heal
  source?: string; // Optional description for audit log
}

interface DamageResponse {
  success: boolean;
  character: {
    condition: {
      physicalDamage: number;
      stunDamage: number;
      overflowDamage: number;
    };
    woundModifier: number;
  };
  overflow?: {
    physical: number;  // Excess physical that went to overflow
  };
}
```

**Implementation Notes:**
- Physical damage overflow to overflow track when physical monitor full
- Stun damage overflow converts to physical when stun monitor full
- Apply audit log entry for each damage event
- Return calculated wound modifier for immediate UI update

#### 1.2 Interactive Condition Monitor Component

**Files to Create:**
- `/app/characters/[id]/components/InteractiveConditionMonitor.tsx`

**Files to Modify:**
- `/app/characters/[id]/page.tsx` - Replace inline ConditionMonitor

**Requirements Satisfied:**
- **Requirement:** "Condition monitors MUST visually track physical and stun damage, including the automatic identification of associated penalties"
- **Requirement:** "integrated tools for rapid gameplay actions"

**Interface Definition:**
```typescript
// /app/characters/[id]/components/InteractiveConditionMonitor.tsx

interface InteractiveConditionMonitorProps {
  characterId: ID;
  type: "physical" | "stun" | "overflow";
  current: number;
  max: number;
  penaltyInterval: number;  // Boxes per -1 penalty (default: 3)
  theme: CharacterSheetTheme;
  onDamageApplied?: (newValue: number, woundModifier: number) => void;
  readonly?: boolean;  // True for finalized characters without edit permission
}

// Features:
// - Click box to toggle damage
// - Click-drag to apply multiple boxes
// - Right-click context menu: "Apply X damage", "Heal X damage"
// - Visual penalty indicators every 3 boxes
// - Current wound modifier display
```

**Visual Specification:**
```
Physical Monitor (8 boxes)
┌───┬───┬───┐ ┌───┬───┬───┐ ┌───┬───┐
│ ■ │ ■ │ ■ │ │ □ │ □ │ □ │ │ □ │ □ │
└───┴───┴───┘ └───┴───┴───┘ └───┴───┘
    -1            -2            -3
     ▲
  Current: 3/8  Wound Modifier: -1
```

#### 1.3 Wound Modifier Integration

**Files to Modify:**
- `/app/characters/[id]/page.tsx` - Add wound modifier state
- `/app/characters/[id]/components/SkillList.tsx` (extract from page.tsx)

**Requirements Satisfied:**
- **Requirement:** "automatic identification of associated penalties"
- **Requirement:** "Common dice pools MUST be pre-calculated and available for immediate use"

**Changes:**
```typescript
// Add wound modifier to character sheet state
const [woundModifier, setWoundModifier] = useState<number>(0);

// Calculate on mount and update
useEffect(() => {
  const modifier = calculateWoundModifier(character, ruleset);
  setWoundModifier(modifier);
}, [character.condition]);

// Display in dice pool calculations
// "Pistols: 12 dice" → "Pistols: 12 - 2 wound = 10 dice"
```

---

### Phase 2: Enhanced Dice Pool Display (High Priority)

#### 2.1 Dice Pool Component with Modifiers

**Files to Create:**
- `/app/characters/[id]/components/DicePoolDisplay.tsx`

**Requirements Satisfied:**
- **Requirement:** "Common dice pools MUST be pre-calculated and available for immediate use"
- **Guarantee:** "Derived statistics and condition monitors MUST be updated automatically"

**Interface Definition:**
```typescript
interface DicePoolDisplayProps {
  label: string;
  basePool: number;
  modifiers: DicePoolModifier[];
  limit?: number;
  onRoll?: () => void;
}

interface DicePoolModifier {
  source: string;
  value: number;
  type: "bonus" | "penalty";
}

// Example render:
// Pistols                    12 dice
//   Agility (5) + Skill (7)     +12
//   Wound Modifier               -2
//   Smartlink Bonus              +2
//   ─────────────────────────────
//   Total                     12 dice (Limit: 8)
//   [Roll]
```

#### 2.2 Combat Stats Quick Reference

**Files to Create:**
- `/app/characters/[id]/components/CombatQuickReference.tsx`

**Requirements Satisfied:**
- **Requirement:** "integrated tools for rapid gameplay actions"
- **Requirement:** "Common dice pools MUST be pre-calculated and available for immediate use"

**Interface Definition:**
```typescript
interface CombatQuickReferenceProps {
  character: Character;
  ruleset: MergedRuleset;
  woundModifier: number;
}

// Pre-calculated values:
// - Defense Pool (REA + INT + modifiers)
// - Dodge Pool (REA + Gymnastics/2)
// - Soak Pool (BOD + Armor)
// - Composure (CHA + WIL)
// - Judge Intentions (CHA + INT)
// - Memory (LOG + WIL)
// - Lift/Carry (BOD + STR)
```

---

### Phase 3: Responsive and Print Layouts (Medium Priority)

#### 3.1 Print Stylesheet

**Files to Create:**
- `/app/characters/[id]/print.css` - Print-specific styles
- `/app/characters/[id]/print/page.tsx` - Simplified print layout

**Requirements Satisfied:**
- **Guarantee:** "Character information MUST remain accessible and optimized for mobile, tablet, and desktop environments"

**Print Layout Specification:**
```
Page 1: Core Stats
├── Header (Name, Metatype, Status, Edition)
├── Attributes (2-column table)
├── Derived Stats (Initiative, Limits)
├── Condition Monitors (empty boxes for manual tracking)
└── Resources (Karma, Nuyen, Essence)

Page 2: Skills & Abilities
├── Active Skills (compact list with dice pools)
├── Knowledge Skills
├── Languages
└── Qualities (with effects summary)

Page 3: Gear & Equipment
├── Weapons (table format)
├── Armor (table format)
├── Augmentations
└── Other Gear

Page 4+: Magic/Matrix (if applicable)
├── Spells/Complex Forms
├── Adept Powers
└── Spirits/Sprites
```

**CSS Media Query Additions:**
```css
@media print {
  /* Hide interactive elements */
  .dice-roller-button,
  .theme-selector,
  .action-buttons { display: none; }

  /* Optimize for paper */
  body { font-size: 10pt; }
  .section { page-break-inside: avoid; }
  .character-header { page-break-after: avoid; }
}
```

#### 3.2 Mobile Layout Optimization

**Files to Modify:**
- `/app/characters/[id]/page.tsx` - Responsive breakpoints

**Requirements Satisfied:**
- **Guarantee:** "Character information MUST remain accessible and optimized for mobile, tablet, and desktop environments"
- **Requirement:** "The layout MUST adapt dynamically to optimize for readability"

**Changes:**
```typescript
// Mobile: Single column, collapsible sections
// Tablet: Two columns
// Desktop: Three columns (current)

// Add collapsible section state persistence
const [collapsedSections, setCollapsedSections] = useLocalStorage<string[]>(
  `character-${id}-collapsed`,
  []
);
```

---

### Phase 4: Preference Persistence (Medium Priority)

#### 4.1 UI Preferences API

**Files to Create:**
- `/app/api/characters/[characterId]/preferences/route.ts`

**Requirements Satisfied:**
- **Guarantee:** "Participant-defined visual preferences MUST be persistent and consistently applied"
- **Requirement:** "Visual themes MUST be selectable and persistent"

**Interface Definition:**
```typescript
// GET/PUT /api/characters/[characterId]/preferences
interface CharacterUIPreferences {
  theme: "neon-rain" | "modern-card" | "classic-paper";
  collapsedSections: string[];
  defaultDiceView: "compact" | "expanded";
  showDicePoolBreakdown: boolean;
}
```

#### 4.2 Enhanced Theme System

**Files to Modify:**
- `/lib/themes.ts` - Add classic-paper theme
- `/app/characters/[id]/page.tsx` - Apply preferences

**New Theme: Classic Paper**
```typescript
export const classicPaperTheme: CharacterSheetTheme = {
  id: "classic-paper",
  name: "Classic Paper",
  description: "Traditional character sheet aesthetic",
  colors: {
    background: "#f5f5dc",  // Beige
    surface: "#ffffff",
    text: "#333333",
    accent: "#8b4513",      // Saddle brown
    border: "#d2b48c",      // Tan
  },
  fonts: {
    heading: "serif",
    body: "sans-serif",
  },
};
```

---

### Phase 5: Advancement Workflow Integration (Low Priority)

#### 5.1 Quick Advancement Actions

**Files to Create:**
- `/app/characters/[id]/components/QuickAdvancementPanel.tsx`

**Requirements Satisfied:**
- **Requirement:** "The character sheet MUST provide a direct transition to refinement states for characters in a non-finalized lifecycle status"

**Interface Definition:**
```typescript
interface QuickAdvancementPanelProps {
  character: Character;
  visible: boolean; // Only for draft/active status
}

// Features:
// - Quick karma spend buttons for common actions
// - Link to full advancement page
// - Training progress indicators
// - Pending approval notifications
```

---

## Verification Plan

### Automated Tests

#### Unit Tests

| Test File | Coverage Target | Requirements Verified |
|-----------|-----------------|----------------------|
| `/app/characters/[id]/components/__tests__/InteractiveConditionMonitor.test.tsx` | All damage scenarios | Condition Monitor Tracking |
| `/app/characters/[id]/components/__tests__/DicePoolDisplay.test.tsx` | Modifier calculations | Dice Pool Pre-calculation |
| `/lib/rules/qualities/__tests__/wound-modifier.test.ts` | Quality effects on wounds | Automatic Penalty Identification |
| `/app/api/characters/__tests__/damage.test.ts` | Damage API logic | State Accuracy |

**Condition Monitor Tests:**
```typescript
describe("InteractiveConditionMonitor", () => {
  describe("damage application", () => {
    it("toggles single box on click");
    it("applies multiple boxes on drag selection");
    it("calculates wound modifier after each change");
    it("shows overflow when physical monitor exceeds max");
    it("converts stun overflow to physical damage");
    it("persists damage through API call");
    it("respects readonly mode for view-only access");
  });

  describe("wound modifier display", () => {
    it("shows -1 at 3 boxes filled");
    it("shows -2 at 6 boxes filled");
    it("applies quality modifiers (e.g., High Pain Tolerance)");
    it("updates immediately on damage change");
  });
});
```

**Dice Pool Tests:**
```typescript
describe("DicePoolDisplay", () => {
  describe("modifier aggregation", () => {
    it("sums all positive modifiers");
    it("subtracts wound modifier from total");
    it("displays each modifier source");
    it("applies limit cap to final pool");
  });

  describe("roll integration", () => {
    it("triggers dice roller with correct pool");
    it("passes limit to roller");
    it("includes modifier breakdown in roll context");
  });
});
```

#### Integration Tests

| Test File | Scenarios | Requirements Verified |
|-----------|-----------|----------------------|
| `/app/api/characters/__tests__/damage.integration.test.ts` | Full damage flow | State Persistence |
| `/app/characters/[id]/__tests__/sheet.integration.test.tsx` | Sheet rendering | State Visualization |

#### E2E Tests (Playwright)

| Test File | User Flow | Requirements Verified |
|-----------|-----------|----------------------|
| `/e2e/character-sheet-damage.spec.ts` | Apply damage, verify update | Interactive Integration |
| `/e2e/character-sheet-responsive.spec.ts` | Mobile/tablet/desktop views | Responsive Design |
| `/e2e/character-sheet-print.spec.ts` | Print preview verification | Print Optimization |

**E2E Damage Flow:**
```typescript
test.describe("Character Sheet Damage", () => {
  test("applies physical damage and updates wound modifier", async ({ page }) => {
    await page.goto("/characters/test-character-id");

    // Click on physical damage boxes
    await page.click('[data-testid="physical-box-1"]');
    await page.click('[data-testid="physical-box-2"]');
    await page.click('[data-testid="physical-box-3"]');

    // Verify wound modifier updated
    await expect(page.locator('[data-testid="wound-modifier"]')).toHaveText("-1");

    // Verify dice pool displays modifier
    await expect(page.locator('[data-testid="skill-pistols-pool"]'))
      .toContainText("wound: -1");
  });
});
```

### Manual Testing Checklist

#### State Visualization
- [ ] Verify all core attributes display correctly
- [ ] Verify derived stats match ruleset formulas
- [ ] Verify condition monitors show current damage
- [ ] Verify resource levels (Karma, Nuyen, Essence) are accurate
- [ ] Verify wound modifiers calculate correctly per 3-box intervals

#### Interactive Integration
- [ ] Click condition monitor boxes to apply damage
- [ ] Verify wound modifier updates immediately
- [ ] Verify dice pools reflect wound modifier
- [ ] Click skill to open dice roller with correct pool
- [ ] Verify dice roller includes limit and modifiers

#### Responsive Design
- [ ] Test on mobile viewport (375px width)
- [ ] Test on tablet viewport (768px width)
- [ ] Test on desktop viewport (1280px width)
- [ ] Verify sections collapse on mobile
- [ ] Print preview shows clean layout

#### Preference Persistence
- [ ] Change theme, refresh, verify theme persists
- [ ] Collapse sections, refresh, verify collapsed state
- [ ] Switch characters, verify independent preferences

---

## Implementation Order and Dependencies

```
Phase 1: Interactive Condition Monitors (Week 1)
├── 1.1 Damage API ← No dependencies
├── 1.2 Interactive Monitor Component ← Depends on 1.1
└── 1.3 Wound Modifier Integration ← Depends on 1.2

Phase 2: Enhanced Dice Pools (Week 1-2)
├── 2.1 DicePoolDisplay Component ← Depends on 1.3
└── 2.2 Combat Quick Reference ← Depends on 2.1

Phase 3: Responsive/Print (Week 2)
├── 3.1 Print Stylesheet ← Independent
└── 3.2 Mobile Optimization ← Independent

Phase 4: Preferences (Week 2-3)
├── 4.1 Preferences API ← Independent
└── 4.2 Enhanced Themes ← Depends on 4.1

Phase 5: Advancement Integration (Week 3)
└── 5.1 Quick Advancement Panel ← Independent
```

---

## Files Summary

### Files to Create

| Path | Purpose |
|------|---------|
| `/app/api/characters/[characterId]/damage/route.ts` | Damage application endpoint |
| `/app/api/characters/[characterId]/preferences/route.ts` | UI preferences endpoint |
| `/app/characters/[id]/components/InteractiveConditionMonitor.tsx` | Clickable condition monitor |
| `/app/characters/[id]/components/DicePoolDisplay.tsx` | Dice pool with modifier breakdown |
| `/app/characters/[id]/components/CombatQuickReference.tsx` | Pre-calculated combat stats |
| `/app/characters/[id]/components/QuickAdvancementPanel.tsx` | Quick advancement actions |
| `/app/characters/[id]/print/page.tsx` | Print-optimized layout |
| `/app/characters/[id]/print.css` | Print-specific styles |

### Files to Modify

| Path | Changes |
|------|---------|
| `/app/characters/[id]/page.tsx` | Integrate new components, add wound modifier state |
| `/lib/themes.ts` | Add classic-paper theme |
| `/lib/types/character.ts` | Extend UIPreferences interface |
| `/components/DiceRoller.tsx` | Accept modifier breakdown for display |

### Test Files to Create

| Path | Purpose |
|------|---------|
| `/app/characters/[id]/components/__tests__/InteractiveConditionMonitor.test.tsx` | Condition monitor unit tests |
| `/app/characters/[id]/components/__tests__/DicePoolDisplay.test.tsx` | Dice pool unit tests |
| `/app/api/characters/__tests__/damage.test.ts` | Damage API tests |
| `/e2e/character-sheet-damage.spec.ts` | E2E damage flow tests |
| `/e2e/character-sheet-responsive.spec.ts` | E2E responsive tests |

---

## Related Capabilities

- **Character Management** (`character.management.md`): Lifecycle status affects edit permissions
- **Character Advancement** (`character.advancement.md`): Quick advancement panel integration
- **Ruleset Integrity** (`ruleset.integrity.md`): Derived stats use active ruleset formulas
- **Quality Governance** (`character.quality-governance.md`): Quality effects on wound modifiers

---

## Constraints Compliance

| Constraint | Implementation |
|------------|----------------|
| "MUST NOT facilitate direct modification of finalized character state outside of authorized advancement workflows" | Damage API requires ownership verification; modification blocked for non-draft unless authorized |
| "Derived values MUST be dependent solely on the underlying character state and MUST NOT be manually overridden" | All derived stats calculated from `calculateDerivedStats()`, no manual input |
| "Access to the character sheet MUST be governed by character ownership and participant authorization" | API routes verify ownership via session; 403 for unauthorized access |

---

## Non-Goals (Explicitly Excluded)

Per the capability document, this implementation does NOT address:

1. **Character initialization or advancement logic** - Covered by `character.management.md` and `character.advancement.md`
2. **Real-time synchronization for multi-participant sessions** - Future capability (WebSocket integration)
3. **Ephemeral or non-persistent session-level modifiers** - Future capability (combat tracker integration)

---

## Open Items

1. **GM Override for Damage:** Should GMs be able to apply damage to any campaign character? If yes, add campaign role check to damage API.

2. **Damage History:** Should we track damage events with timestamps for session replay? Would require extending audit log or separate damage history array.

3. **Condition Monitor Animations:** Should damage application have visual feedback (e.g., flash, shake)? If yes, define animation library preference.

4. **Offline Support:** Should condition monitor changes work offline and sync later? Would require service worker and conflict resolution strategy.
