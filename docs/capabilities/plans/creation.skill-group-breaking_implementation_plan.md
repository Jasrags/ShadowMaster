# Skill Karma Purchases & Group Breaking Implementation Plan

## Overview

Enable karma-based skill modifications during character creation:

1. **Individual Skill Rating Purchases**: When skill points are exhausted, allow purchasing additional rating increases with karma
2. **Skill Group Breaking**: Groups can only be broken using karma (not skill points) and can be restored when all member skills reach equal ratings

## Background

### SR5 Rules Reference

From `docs/rules/5e/game-mechanics/skills.md`:

> - If a single member is advanced independently, mark `isBroken` and treat skills as individual entries at the former rating.
> - To restore a group, all member skills must reach an equal rating; only then can the group rating increase again.

From `docs/rules/5e/character-creation.md`:

> - In character creation, you cannot separate skill levels from the skill group level (if any). That must be done in the "Spending Leftover Karma" step.
> - Specializations can never apply to a skill group, and once purchased they "break up" the skill group preventing them from ever being raised together as a skill group again.

### Rule Translation for Sheet-Based Creation

Since we use a single-page sheet-based creation (not a multi-step wizard), the "when" rules translate to "what currency":

| Currency           | Can Break Groups? | Rationale                                      |
| ------------------ | ----------------- | ---------------------------------------------- |
| Skill Points       | No                | Equivalent to Step 5                           |
| Skill Group Points | No                | For groups only                                |
| Karma              | Yes               | Equivalent to Step 7 "Spending Leftover Karma" |

### SR5 Skill Point Rules

From SR5 Core Rulebook:

> All skill and skill group points must be spent at the time of character creation. These points cannot be saved or used after the game starts.
>
> At character creation, a specialization costs 1 skill point. No individual skill may have more than one specialization. As a character develops, though, they may gain other areas of expertise and so add more specializations to the same skills. Along with being purchased in this step, specializations may be purchased using Karma at the end of character creation.

**Key implications:**

- Skill points must be fully spent during creation
- Specializations cost 1 skill point (not 7 karma) during creation
- Karma can supplement skill purchases in the "Spending Leftover Karma" step
- In sheet-based creation, karma is available when skill points are exhausted

## Current State (Completed)

### Phase 0: Show Group Skills in Unified List

**Status:** Completed

Group skills now appear in the same list as individual skills with visual distinction:

- Created `SkillListItem` component (`components/creation/skills/SkillListItem.tsx`)
- Individual skills: Blue icon, full +/- controls, removable
- Group skills: Purple icon, read-only rating, shows group name
- All skills sorted alphabetically in unified list
- Summary shows total skills with breakdown

**Files Changed:**

- `components/creation/skills/SkillListItem.tsx` (new)
- `components/creation/skills/index.ts` (updated export)
- `components/creation/SkillsCard.tsx` (added `allSkillsSorted` memo, updated render)

## Implementation Phases

### Phase 1: Update Data Model

**Objective:** Modify skill group data structure to support `isBroken` state while maintaining backward compatibility.

#### Type Changes

**File:** `lib/types/creation.ts`

```typescript
// Current
skillGroups?: Record<string, number>;

// Revised
skillGroups?: Record<string, number | { rating: number; isBroken: boolean }>;
```

**Migration Strategy:** Support both formats during transition:

- Legacy: `{ "firearms": 4 }` → treat as `{ rating: 4, isBroken: false }`
- New: `{ "firearms": { rating: 4, isBroken: true } }`

#### Helper Functions

**File:** `lib/rules/skills/group-utils.ts` (new)

```typescript
// Normalize group value to new format
export function normalizeGroupValue(value: number | { rating: number; isBroken: boolean }): {
  rating: number;
  isBroken: boolean;
} {
  if (typeof value === "number") {
    return { rating: value, isBroken: false };
  }
  return value;
}

// Get group rating regardless of format
export function getGroupRating(value: number | { rating: number; isBroken: boolean }): number {
  return typeof value === "number" ? value : value.rating;
}

// Check if group is broken
export function isGroupBroken(value: number | { rating: number; isBroken: boolean }): boolean {
  return typeof value === "number" ? false : value.isBroken;
}
```

### Phase 2: Add Karma Budget Tracking

**Objective:** Track karma spent on skill upgrades and specializations during creation.

#### Budget Source

Karma available during creation comes from the priority system (varies by edition). For SR5:

- Priority A-E for Resources/Metatype/etc. may grant bonus karma
- Base 25 karma for all characters
- Additional karma from qualities (positive costs karma, negative grants karma)

#### State Changes

**File:** `lib/types/creation.ts`

```typescript
interface CreationSelections {
  // Existing
  skills?: Record<string, number>;
  skillGroups?: Record<string, number | { rating: number; isBroken: boolean }>;
  skillSpecializations?: Record<string, string[]>;

  // New - track karma spent on skills specifically
  skillKarmaSpent?: {
    skillRaises: Record<string, number>; // skillId -> karma spent raising
    specializations: number; // Total karma on specs (7 each)
  };
}
```

#### Budget Context Integration

Update `CreationBudgetContext` to include karma budget with skill karma deductions.

### Phase 3: Create Skill Customization Modal

**Objective:** Modal for karma-based skill customization on group skills.

**File:** `components/creation/skills/SkillCustomizeModal.tsx` (new)

#### Features

1. **Rating Increase Section**
   - Shows current rating (from group)
   - +/- controls for target rating
   - Karma cost display: `(New Rating × 2) - (Current Rating × 2)` per SR5
   - Max rating enforcement (6 during creation, 7 with Aptitude)

2. **Specialization Section**
   - List of suggested specializations
   - Custom specialization input
   - Cost display: 7 karma each
   - Multiple specialization support

3. **Cost Summary**
   - Total karma cost for all changes
   - Available karma display
   - Warning if over budget

#### Props

```typescript
interface SkillCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (changes: SkillCustomizeChanges) => void;
  skillId: string;
  skillName: string;
  currentRating: number;
  maxRating: number;
  suggestedSpecializations: string[];
  availableKarma: number;
  // Group context
  groupId: string;
  groupName: string;
}

interface SkillCustomizeChanges {
  newRating?: number; // If raising
  specializations?: string[]; // If adding specs
  karmaCost: number;
}
```

### Phase 4: Create Break Confirmation Modal

**Objective:** Warning modal before breaking a group.

**File:** `components/creation/skills/SkillGroupBreakModal.tsx` (new)

#### Content

1. **Warning Header**
   - "Breaking Skill Group" title
   - Alert icon

2. **Explanation**
   - "Customizing [Skill] will break the [Group] skill group."
   - "All skills in this group will become individual skills at rating [X]."
   - "The group can be restored later if all member skills reach the same rating."

3. **Skills List**
   - Show all member skills that will be converted
   - Highlight the skill being customized

4. **Action Being Applied**
   - Show what change triggered the break
   - Show karma cost

5. **Buttons**
   - "Cancel" - close without changes
   - "Break Group & Apply" - proceed with break

### Phase 5: Implement Break Handler

**Objective:** Logic to break a group and apply the triggering change.

**File:** `components/creation/SkillsCard.tsx`

#### Handler Implementation

```typescript
const handleBreakGroup = useCallback(
  (groupId: string, triggeringSkillId: string, changes: SkillCustomizeChanges) => {
    const groupData = skillGroups.find((g) => g.id === groupId);
    if (!groupData) return;

    const currentGroupValue = groups[groupId];
    const groupRating = getGroupRating(currentGroupValue);

    // 1. Mark group as broken (keep it, don't delete)
    const newGroups = {
      ...groups,
      [groupId]: { rating: groupRating, isBroken: true },
    };

    // 2. Add all member skills as individual skills at group rating
    const newSkills = { ...skills };
    groupData.skills.forEach((skillId) => {
      newSkills[skillId] = groupRating;
    });

    // 3. Apply the triggering change
    if (changes.newRating) {
      newSkills[triggeringSkillId] = changes.newRating;
    }

    // 4. Add specializations if any
    const newSpecs = { ...specializations };
    if (changes.specializations && changes.specializations.length > 0) {
      newSpecs[triggeringSkillId] = [
        ...(newSpecs[triggeringSkillId] || []),
        ...changes.specializations,
      ];
    }

    // 5. Track karma spent
    const newKarmaSpent = { ...karmaSpent };
    // ... update karma tracking

    updateState({
      selections: {
        ...state.selections,
        skillGroups: newGroups,
        skills: newSkills,
        skillSpecializations: newSpecs,
        skillKarmaSpent: newKarmaSpent,
      },
    });
  },
  [groups, skills, specializations, skillGroups, state.selections, updateState]
);
```

### Phase 6: Update SkillListItem for Customization

**Objective:** Add "Customize" button to group skills.

**File:** `components/creation/skills/SkillListItem.tsx`

#### Changes

1. Add `onCustomize` prop for group skills
2. Replace placeholder with "Customize" button
3. Button styling matches purple group theme
4. Disabled state when no karma available

```typescript
interface SkillListItemProps {
  // ... existing props
  onCustomize?: () => void; // New - only for group skills
  canCustomize?: boolean; // New - false if no karma
}
```

### Phase 7: Implement Restoration Detection

**Objective:** Detect when a broken group can be restored.

#### Detection Logic

```typescript
const getRestorableGroups = useMemo(() => {
  const restorable: Array<{
    groupId: string;
    groupName: string;
    currentRating: number;
  }> = [];

  Object.entries(groups).forEach(([groupId, value]) => {
    const normalized = normalizeGroupValue(value);
    if (!normalized.isBroken) return;

    const groupData = skillGroups.find((g) => g.id === groupId);
    if (!groupData) return;

    // Check if all member skills exist with equal ratings
    const ratings = groupData.skills.map((skillId) => skills[skillId]);
    const allExist = ratings.every((r) => r !== undefined);
    const allEqual = ratings.every((r) => r === ratings[0]);

    if (allExist && allEqual && ratings[0] !== undefined) {
      restorable.push({
        groupId,
        groupName: groupData.name,
        currentRating: ratings[0],
      });
    }
  });

  return restorable;
}, [groups, skills, skillGroups]);
```

### Phase 8: Create Restoration UI

**Objective:** Allow users to restore broken groups when eligible.

#### UI Options

**Option A: Inline notification in Skills section**

- Show banner when restoration is available
- "The [Group] group can be restored! All skills are at rating [X]."
- "Restore Group" button

**Option B: Notification on broken group in Skill Groups section**

- Show restore icon/button on broken group cards
- Tooltip explains restoration

**Recommended:** Option A - more discoverable since users are looking at skills list.

#### Restore Handler

```typescript
const handleRestoreGroup = useCallback(
  (groupId: string) => {
    const groupData = skillGroups.find((g) => g.id === groupId);
    if (!groupData) return;

    // Get the equal rating from any member skill
    const newRating = skills[groupData.skills[0]];

    // Remove member skills from individual skills
    const newSkills = { ...skills };
    const newSpecs = { ...specializations };
    groupData.skills.forEach((skillId) => {
      delete newSkills[skillId];
      delete newSpecs[skillId]; // Specs are lost on restore? Check rules
    });

    // Restore group
    const newGroups = {
      ...groups,
      [groupId]: { rating: newRating, isBroken: false },
    };

    updateState({
      selections: {
        ...state.selections,
        skillGroups: newGroups,
        skills: newSkills,
        skillSpecializations: newSpecs,
      },
    });
  },
  [groups, skills, specializations, skillGroups, state.selections, updateState]
);
```

### Phase 9: Update Validation

**Objective:** Ensure broken groups are handled correctly in validation.

#### Validation Rules

1. **Budget Calculation**
   - Broken groups still count their `rating` toward group points spent
   - Individual skills from broken groups count toward skill points IF raised above group rating

2. **Conflict Detection**
   - Skills in broken groups should not trigger "already in group" warnings
   - They are now individual skills

3. **Incompetent Quality**
   - If incompetent quality targets a broken group, all member skills are still blocked

### Phase 10: Update Skill Groups Section Display

**Objective:** Visual treatment for broken groups in the Skill Groups section.

#### Changes to SkillGroupCard

1. Show "Broken" badge when `isBroken: true`
2. Gray out or dim broken groups
3. Remove +/- rating controls for broken groups
4. Show "Restore" button when restoration is available
5. Keep remove button (removes broken group entirely)

### Phase 11: Individual Skill Karma Purchases

**Status:** Completed

**Objective:** Allow purchasing individual skill rating increases with karma when skill points are exhausted.

#### Scope

This applies to two scenarios:

1. **Adding new skills** via the "Add Skill" modal when skill points are exhausted
2. **Increasing existing skill ratings** via the inline Stepper when skill points are exhausted

#### Visual States

| Condition                               | + Button Color       | Behavior                                                      |
| --------------------------------------- | -------------------- | ------------------------------------------------------------- |
| Skill points available                  | Blue/Green (default) | Direct increment using skill points                           |
| Skill points exhausted, karma available | Amber                | Opens confirmation modal (inline) or shows karma cost (modal) |
| Both exhausted OR at max rating         | Gray (disabled)      | Shows tooltip with reason on hover                            |

#### Karma Cost for New Skills

When adding a new skill with karma, the cost is cumulative:

- Rating 1 = 2 karma (1 × 2)
- Rating 2 = 6 karma (2 + 4)
- Rating 3 = 12 karma (2 + 4 + 6)
- Rating 4 = 20 karma (2 + 4 + 6 + 8)
- Rating 5 = 30 karma (2 + 4 + 6 + 8 + 10)
- Rating 6 = 42 karma (2 + 4 + 6 + 8 + 10 + 12)

#### Implementation

**File:** `components/creation/skills/SkillModal.tsx` (modified)

Add Skill modal now supports karma purchases:

- New `karmaRemaining` prop
- Updated `onAdd` callback: `(skillId, rating, specs, karmaSpent?) => void`
- Calculates karma cost using `calculateSkillRaiseKarmaCost(0, rating)`
- Shows amber-themed UI when in karma mode (skill points exhausted)
- Displays karma cost breakdown (e.g., "2+4+6 = 12 karma")
- "Add Skill" button turns amber when using karma

**File:** `components/creation/skills/SkillKarmaConfirmModal.tsx` (new)

Confirmation modal for karma skill rating increases (inline Stepper):

- Amber-themed header indicating karma spending
- Shows skill name, current → new rating transition
- Displays karma cost (New Rating × 2)
- Shows remaining karma after purchase
- Confirm/Cancel actions

**File:** `components/creation/skills/SkillListItem.tsx` (modified)

New props for karma purchase support:

```typescript
interface SkillListItemProps {
  // ... existing props
  canIncreaseWithKarma?: boolean; // Amber button mode
  onKarmaIncrease?: () => void; // Opens confirmation modal
  disabledReason?: string; // Tooltip when disabled
}
```

- Stepper accent color changes based on purchase mode
- Wraps in Tooltip when disabled to show reason

**File:** `components/creation/SkillsCard.tsx` (modified)

Added purchase mode determination and handlers:

```typescript
// Determine purchase mode for each skill
const getPurchaseMode = (currentRating: number, isAtMax: boolean) => {
  if (isAtMax) return { mode: "disabled", disabledReason: "Maximum rating reached" };
  if (skillPointsRemaining > 0) return { mode: "skill-points" };
  const karmaCost = calculateSkillRaiseKarmaCost(currentRating, currentRating + 1);
  if (karmaRemaining >= karmaCost) return { mode: "karma" };
  return { mode: "disabled", disabledReason: `No skill points. Need ${karmaCost} karma` };
};
```

#### Karma Refund on Rating Reduction

When reducing a skill rating that was purchased with karma, the karma is refunded:

- Refund amount: `currentRating × 2` (cost of the rating being removed)
- Capped at the tracked karma for that skill (can't refund more than spent)
- Tracked in `skillKarmaSpent.skillRaises[skillId]`

Example flow:

1. Skill at 3, no skill points, 20 karma available
2. Purchase rating 4 → costs 8 karma (4 × 2), tracked = 8
3. Purchase rating 5 → costs 10 karma (5 × 2), tracked = 18
4. Reduce to 4 → refunds 10 karma, tracked = 8
5. Reduce to 3 → refunds 8 karma, tracked = 0 (deleted)

## File Changes Summary

| File                                                    | Change Type | Description                                  |
| ------------------------------------------------------- | ----------- | -------------------------------------------- |
| `lib/types/creation.ts`                                 | Modify      | Update skillGroups type, add karma tracking  |
| `lib/rules/skills/group-utils.ts`                       | New         | Helper functions for group normalization     |
| `components/creation/skills/SkillModal.tsx`             | Modify      | Add karma purchase support for new skills    |
| `components/creation/skills/SkillListItem.tsx`          | Modify      | Add onCustomize, karma purchase props        |
| `components/creation/skills/SkillCustomizeModal.tsx`    | New         | Karma-based skill customization (groups)     |
| `components/creation/skills/SkillGroupBreakModal.tsx`   | New         | Break confirmation dialog                    |
| `components/creation/skills/SkillKarmaConfirmModal.tsx` | New         | Individual skill karma purchase confirmation |
| `components/creation/skills/index.ts`                   | Modify      | Export new modals                            |
| `components/creation/SkillsCard.tsx`                    | Modify      | Add break/restore/karma purchase handlers    |
| `lib/contexts/CreationBudgetContext.tsx`                | Modify      | Add karma budget support                     |

## Testing Strategy

### Unit Tests

1. **Group Utils**
   - `normalizeGroupValue` handles both formats
   - `getGroupRating` returns correct rating
   - `isGroupBroken` returns correct state

2. **Break Logic**
   - Breaking converts all member skills
   - Group is marked as broken, not deleted
   - Triggering change is applied correctly
   - Karma is deducted properly

3. **Restoration Logic**
   - Detection works when all skills equal
   - Detection fails when skills differ
   - Restore removes member skills
   - Restore unmarks group as broken

### Integration Tests

1. **Full Break Flow**
   - Add skill group → Customize skill → Confirm break → Verify state

2. **Full Restore Flow**
   - Break group → Raise all skills to equal → Restore → Verify state

3. **Edge Cases**
   - Break then remove group entirely
   - Multiple broken groups
   - Specializations on broken group skills

## Open Questions

1. **Specializations on Restore:** When restoring a group, what happens to specializations on member skills? SR5 rules unclear - recommend keeping them (specs don't prevent restoration, they just prevent future group raises).

2. **Karma Cost for Group Skills:** Should raising a skill that's part of a broken group cost the same as raising any individual skill? (Yes, per SR5 advancement rules)

3. **Creation vs Advancement:** This plan focuses on character creation. Post-creation advancement uses the same mechanics but through a different UI flow.

## Timeline

| Phase                            | Estimated Effort | Dependencies   | Status    |
| -------------------------------- | ---------------- | -------------- | --------- |
| Phase 1: Data Model              | Small            | None           | Completed |
| Phase 2: Karma Budget            | Medium           | Phase 1        | Completed |
| Phase 3: Customize Modal         | Medium           | Phase 2        | Completed |
| Phase 4: Break Modal             | Small            | None           | Completed |
| Phase 5: Break Handler           | Medium           | Phases 1, 3, 4 | Completed |
| Phase 6: SkillListItem Update    | Small            | Phase 5        | Completed |
| Phase 7: Restoration Detection   | Small            | Phase 1        | Completed |
| Phase 8: Restoration UI          | Medium           | Phase 7        | Completed |
| Phase 9: Validation              | Small            | Phase 1        | Completed |
| Phase 10: Group Section Display  | Small            | Phase 7        | Completed |
| Phase 11: Individual Skill Karma | Small            | Phase 2        | Completed |

**Recommended Order:** 1 → 2 → 4 → 3 → 5 → 6 → 7 → 8 → 9 → 10 → 11

## Decisions Log

### Specialization Cost During Creation

**Decision:** Specializations cost 1 skill point during creation (per SR5 rules), not 7 karma.

**Note:** Karma-to-skill-point conversion for purchasing specializations is out of scope for this plan.

### Karma Availability for Skills

**Decision:** Karma is only available for skill rating purchases when skill points are exhausted.

**Rationale:**

- Encourages using free skill points first
- Clear to user what currency they're spending
- Matches spirit of SR5 rules (use points first, karma to supplement)

### Karma Refund Policy

**Decision:** When reducing a skill rating that was purchased with karma, the karma is refunded.

**Rationale:**

- Character creation is exploratory - users should experiment freely
- Prevents accidental "lost" karma from UI mistakes
- Refund is capped at tracked amount to prevent gaming

---

_Last updated: 2026-01-27_
