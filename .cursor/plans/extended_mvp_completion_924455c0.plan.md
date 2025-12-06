---
name: Extended MVP Completion
overview: Extend the completed MVP foundation to implement the remaining SR5 character creation features identified in the gap analysis, organized into 4 phases that build incrementally.
todos:
  - id: phase6-special-attrs
    content: "Phase 6.1: Create SpecialAttributeAllocator component for Edge/Magic/Resonance"
    status: pending
  - id: phase6-knowledge
    content: "Phase 6.2: Add Knowledge & Language skills to SkillsStep with free points"
    status: pending
  - id: phase6-specializations
    content: "Phase 6.3: Add skill specializations to SkillsStep"
    status: pending
  - id: phase6-derived
    content: "Phase 6.4: Implement calculateDerivedStats and store on character"
    status: pending
  - id: phase7-contacts
    content: "Phase 7: Build ContactsStep with Connection/Loyalty and Karma tracking"
    status: pending
    dependencies:
      - phase6-derived
  - id: phase8-gear-data
    content: "Phase 8.1-8.2: Add gear catalog data and implement GearStep UI"
    status: pending
  - id: phase8-lifestyle
    content: "Phase 8.3-8.4: Add lifestyle selection with metatype modifiers"
    status: pending
    dependencies:
      - phase8-gear-data
  - id: phase9-karma
    content: "Phase 9.1: Build KarmaStep for leftover Karma spending"
    status: pending
    dependencies:
      - phase6-derived
      - phase7-contacts
      - phase8-lifestyle
  - id: phase9-spells
    content: "Phase 9.2: Add spell/complex form selection for magical characters"
    status: pending
    dependencies:
      - phase9-karma
  - id: phase9-validation
    content: "Phase 9.3-9.4: Implement full validation engine and enhance ReviewStep"
    status: pending
    dependencies:
      - phase9-karma
---

# Extended MVP: SR5 Character Creation Completion

## Context

The [original MVP plan](/Users/jrags/.cursor/plans/shadow_master_mvp_plan_752d8833.plan.md) is complete. This plan addresses the gaps identified in [mvp_gap_analysis.md](docs/architecture/mvp_gap_analysis.md) to deliver a fully valid SR5 Priority character creation experience.

---

## Phase 6: Special Attributes & Core Gaps

**Goal:** Enable allocation of special attribute points and complete the skills system.

### 6.1 Special Attribute Allocator Component

Create `app/characters/create/components/SpecialAttributeAllocator.tsx`:

- Display Edge (always), Magic (if magical path), Resonance (if technomancer)
- Edge starts at 1 (2 for Humans), cap at 6 (7 for Humans)
- Magic/Resonance start at value from Magic priority selection
- Track special attribute points from metatype priority
- Validate all points must be spent

Integrate into `AttributesStep.tsx` or create new step after attributes.

### 6.2 Knowledge & Language Skills

Extend [SkillsStep.tsx](app/characters/create/components/steps/SkillsStep.tsx):

- Add "Knowledge Skills" tab with category selection (Academic/Interest/Professional/Street)
- Add "Language Skills" tab with native language at 6 (free)
- Calculate free points: (Intuition + Logic) x 2
- Separate point pool from Active skills
- Add skill name input (custom knowledge skills)

Update `useSkills` hook in [lib/rules/hooks.ts](lib/rules/hooks.ts) to provide knowledge/language data.

### 6.3 Skill Specializations

Add to `SkillsStep.tsx`:

- Specialization input for each skill with rating > 0
- Cost: 1 skill point, grants +2 dice
- Cannot add to skill groups (breaks group if attempted)
- Store in `state.selections.skillSpecializations`

### 6.4 Final Calculations

Add `calculateDerivedStats()` function to [CreationWizard.tsx](app/characters/create/components/CreationWizard.tsx):

```typescript
const derivedStats = {
  initiative: intuition + reaction,
  physicalLimit: Math.ceil(((strength * 2) + body + reaction) / 3),
  mentalLimit: Math.ceil(((logic * 2) + intuition + willpower) / 3),
  socialLimit: Math.ceil(((charisma * 2) + willpower + Math.ceil(essence)) / 3),
  physicalCM: Math.ceil(body / 2) + 8,
  stunCM: Math.ceil(willpower / 2) + 8,
};
```

Store in character on save.

---

## Phase 7: Contacts System

**Goal:** Implement contact creation with Connection/Loyalty ratings.

### 7.1 Contacts Step Component

Create `app/characters/create/components/steps/ContactsStep.tsx`:

- Display free Contact Karma: Charisma x 3
- "Add Contact" button opens form:
  - Name (text input)
  - Type (Fixer, Street Doc, etc. - suggestions)
  - Connection (1-6 slider)
  - Loyalty (1-6 slider)
  - Notes (optional)
- Show Karma cost: Connection + Loyalty
- Enforce max 7 Karma per contact
- Track total Contact Karma spent vs budget

### 7.2 Update Creation Method Steps

Add "contacts" step to Priority creation method in [core-rulebook.json](data/editions/sr5/core-rulebook.json) between Qualities and Gear (or combine with Karma step).

### 7.3 Wire Contact Data

Update [character.ts](lib/types/character.ts) `Contact` interface is already defined. Ensure `state.selections.contacts` is saved to character.

---

## Phase 8: Gear & Resources

**Goal:** Implement the gear purchasing step with nuyen tracking.

### 8.1 Gear Data Structure

Add gear catalog to [core-rulebook.json](data/editions/sr5/core-rulebook.json):

```json
{
  "gear": {
    "weapons": [...],
    "armor": [...],
    "electronics": [...],
    "lifestyle": [
      { "id": "street", "name": "Street", "cost": 0 },
      { "id": "squatter", "name": "Squatter", "cost": 500 },
      ...
    ]
  }
}
```

### 8.2 Gear Step Implementation

Replace placeholder in [GearStep.tsx](app/characters/create/components/steps/GearStep.tsx):

- Nuyen budget display (from Resources priority)
- Lifestyle selector (required)
- Gear catalog with categories and search
- Shopping cart with running total
- Availability filter (show only ≤12)
- Karma-to-Nuyen conversion option (max 10 Karma = 20,000 nuyen)
- 5,000 nuyen carryover limit warning

### 8.3 Lifestyle Modifiers

Apply metatype lifestyle cost modifiers:

- Troll: +10%
- Dwarf: +20%

Calculate and display adjusted costs in UI.

### 8.4 useGear Hook

Create `lib/rules/hooks.ts` addition:

```typescript
export function useGear() {
  const { ruleset } = useRuleset();
  return {
    weapons: ruleset?.modules?.gear?.weapons || [],
    armor: ruleset?.modules?.gear?.armor || [],
    lifestyles: ruleset?.modules?.gear?.lifestyle || [],
    // ...
  };
}
```

---

## Phase 9: Leftover Karma & Validation

**Goal:** Complete Karma spending step and enforce all validation rules.

### 9.1 Karma Step Component

Create `app/characters/create/components/steps/KarmaStep.tsx`:

- Display remaining Karma (25 + negative qualities - positive qualities)
- Karma purchase options:
  - Raise Attribute: (new rating) x 5 Karma
  - Raise Active Skill: (new rating) x 2 Karma
  - Raise Knowledge/Language: (new rating) x 1 Karma
  - Buy Spell: 5 Karma (max Magic x 2 total)
  - Buy Complex Form: 4 Karma (max Logic total)
- Show 7 Karma carryover limit
- Real-time remaining Karma calculation

### 9.2 Spell/Complex Form Selection

For magical characters in KarmaStep or dedicated sub-section:

- Spell catalog with search (filter by category)
- Selected spells list with count vs max (Magic x 2)
- Complex form catalog for Technomancers
- Max complex forms = Logic

### 9.3 Full Validation Engine

Update [CreationWizard.tsx](app/characters/create/components/CreationWizard.tsx) `validateCurrentStep`:

| Rule | Implementation |

|------|----------------|

| One attribute at natural max | Count attributes at metatype max, block if > 1 |

| All attribute points spent | Error if remaining > 0 |

| All skill points spent | Error if remaining > 0 |

| Max 7 Karma carryover | Error if Karma > 7 at finalize |

| Max 5,000 nuyen carryover | Warning/error if nuyen > 5,000 |

| Gear Availability ≤12 | Filter catalog, error if invalid item |

| Max spells = Magic x 2 | Count selected, block if exceeded |

### 9.4 Review Step Enhancements

Update [ReviewStep.tsx](app/characters/create/components/steps/ReviewStep.tsx):

- Show all validation errors with severity
- Block "Create Character" if critical errors
- Display final Karma and Nuyen carryover
- Show derived stats summary

---

## Implementation Order

| Phase | Tasks | Effort | Dependencies |

|-------|-------|--------|--------------|

| Phase 6 | Special Attrs, Knowledge/Language, Specializations, Derived Stats | 3-4 days | MVP complete |

| Phase 7 | Contacts System | 1-2 days | Phase 6 (needs CHA for budget) |

| Phase 8 | Gear Step | 3-4 days | Phase 6 |

| Phase 9 | Karma Step, Spells, Validation | 3-4 days | Phase 6-8 |

**Total: ~10-14 days of focused work**

---

## Files to Create/Modify

**New Files:**

- `app/characters/create/components/SpecialAttributeAllocator.tsx`
- `app/characters/create/components/steps/ContactsStep.tsx`
- `app/characters/create/components/steps/KarmaStep.tsx`

**Modified Files:**

- `app/characters/create/components/steps/SkillsStep.tsx` (Knowledge/Language/Specializations)
- `app/characters/create/components/steps/GearStep.tsx` (Full implementation)
- `app/characters/create/components/steps/ReviewStep.tsx` (Validation display)
- `app/characters/create/components/CreationWizard.tsx` (Derived stats, validation)
- `data/editions/sr5/core-rulebook.json` (Gear catalog, spells, complex forms)
- `lib/rules/hooks.ts` (useGear, useSpells hooks)

---

## Out of Scope (Deferred to Beta)

- Cyberware/Bioware with Essence tracking
- Adept Powers
- Bound Spirits / Registered Sprites
- Foci Bonding
- Street-Level / Prime Runner variants