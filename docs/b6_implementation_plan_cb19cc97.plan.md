---
name: B6 Implementation Plan
overview: "Implement B6 phase: Enhanced magic system with traditions (drain calculations, spirit types), mentor spirits (catalog and bonuses), and ritual magic (ritual spells, material tracking)."
todos:
  - id: b6-1-expand-traditions
    content: Expand traditions data structure in core-rulebook.json to include spiritTypes, description, and add missing traditions
    status: completed
  - id: b6-2-extract-traditions
    content: Add extractTraditions() function in loader.ts and useTraditions() hook in RulesetContext.tsx
    status: completed
    dependencies:
      - b6-1-expand-traditions
  - id: b6-3-tradition-selection
    content: Add tradition selection UI to MagicStep.tsx for magical characters
    status: completed
    dependencies:
      - b6-2-extract-traditions
  - id: b6-4-drain-calculation
    content: Implement drain resistance calculation based on tradition attributes and display in SpellsStep/ReviewStep
    status: completed
    dependencies:
      - b6-3-tradition-selection
  - id: b6-5-mentor-catalog
    content: Create mentor spirits catalog (~15 spirits) with bonuses/drawbacks in core-rulebook.json
    status: completed
  - id: b6-6-extract-mentors
    content: Add extractMentorSpirits() function in loader.ts and useMentorSpirits() hook in RulesetContext.tsx
    status: completed
    dependencies:
      - b6-5-mentor-catalog
  - id: b6-7-mentor-selection
    content: Add mentor spirit selection UI to MagicStep.tsx with karma cost tracking
    status: completed
    dependencies:
      - b6-6-extract-mentors
  - id: b6-8-mentor-bonuses
    content: Apply mentor spirit bonuses/drawbacks in ReviewStep and derived stats calculations
    status: completed
    dependencies:
      - b6-7-mentor-selection
  - id: b6-9-mark-rituals
    content: Add rituals catalog with 9 Core Rulebook rituals including keywords and spell categories
    status: completed
  - id: b6-10-ritual-display
    content: Create RitualsStep.tsx component with keyword filtering, search, and karma tracking
    status: completed
    dependencies:
      - b6-9-mark-rituals
  - id: b6-11-ritual-materials
    content: Integrated ritual selection into creation flow with karma-spent-rituals budget tracking
    status: completed
    dependencies:
      - b6-10-ritual-display
  - id: b6-12-update-character-type
    content: Verify/update Character interface to include tradition, mentorSpirit, magicalLodge, ritualSpells fields
    status: completed
  - id: b6-13-update-api
    content: Update /api/rulesets/[editionCode] route to include traditions and mentorSpirits in response
    status: completed
    dependencies:
      - b6-2-extract-traditions
      - b6-6-extract-mentors
---

# B6 Implementation Plan: Enhanced Magic System

## Overview

This plan implements Phase B6 from the beta implementation plan, focusing on enhanced magic system support. The implementation includes:

1. **B6.1.1**: Tradition system (drain resistance calculation, spirit types mapping, tradition selection, magical lodge, aspect selection)
2. **B6.1.2**: Mentor spirits system (catalog, selection, bonus/drawback application)
3. **B6.1.3**: Ritual magic system (ritual spells in catalog, ritual selection, material/reagent tracking, teamwork rules)

## Progress Summary

**Status: 13/13 tasks completed (100%) - PHASE COMPLETE**

### Completed
- **B6.1.1 Traditions System** - COMPLETE
  - Traditions expanded with spiritTypes, drainAttributes, descriptions (Core Rulebook only)
  - Extraction functions and hooks added (`extractTraditions()`, `useTraditions()`)
  - Tradition selection UI in MagicStep with drain formula and spirit types display
  - Drain resistance calculation displayed in ReviewStep

- **B6.1.2 Mentor Spirits System** - COMPLETE
  - 16 mentor spirits from Core Rulebook added (Bear, Cat, Dog, Dragonslayer, Eagle, Fire-Bringer, Mountain, Rat, Raven, Sea, Seducer, Shark, Snake, Thunderbird, Wise Warrior, Wolf)
  - Extraction functions and hooks added (`extractMentorSpirits()`, `useMentorSpirits()`)
  - Mentor spirit selection UI in MagicStep with advantages/disadvantages display
  - Integrated with quality system - selecting mentor spirit adds "Mentor Spirit" quality (5 karma)
  - Quality specification dropdown in QualitiesStep synced with MagicStep selection
  - Karma budget properly updated when selecting/deselecting mentor spirit

- **B6.1.3 Ritual Magic System** - COMPLETE
  - 9 Core Rulebook rituals added (Curse, Prodigal Spell, Remote Sensing, Ward, Circle of Protection, Circle of Healing, Renascence, Watcher, Homunculus)
  - 5 ritual keywords defined (Anchored, Material Link, Minion, Spell, Spotter)
  - Extraction functions and hooks added (`extractRituals()`, `useRituals()`, `extractRitualKeywords()`, `useRitualKeywords()`)
  - RitualsStep.tsx component created with keyword filtering, search, and karma cost tracking (5 karma per ritual)
  - Integrated into character creation wizard after Spells step
  - Path-based access control: only Magicians, Mystic Adepts, and Sorcery-aspected mages can learn rituals
  - Karma budget tracked via `karma-spent-rituals`
  - Minion stat blocks added for Watcher and Homunculus with attributes, initiative, skills, and powers

## Current State Analysis

Based on codebase review:

- **Traditions**: Basic structure exists in `core-rulebook.json` (lines 1309-1374) with 8 traditions (Hermetic, Shaman, Buddhist, Wiccan, Vodou, Norse, Druid, Chaos Magic). Each has `id`, `name`, and `drain` attributes, but missing:
  - `spiritTypes` mapping (combat/detection/health/illusion/manipulation → spirit type)
  - `description` field
  - Full catalog (should have ~15-20 traditions per source material)

- **Mentor Spirits**: Quality exists (line 4304) with `requiresSpecification: true`, but no catalog of actual mentor spirits with bonuses/drawbacks

- **Ritual Magic**: 
  - `Ritual Spellcasting` skill exists (line 3227)
  - No ritual spells marked in spell catalog
  - No ritual selection UI component

- **Character Type**: `tradition` field exists in `Character` interface (line 161 in `character.ts`)

- **MagicStep**: Currently handles magical path and aspected mage group selection, but no tradition selection

## Implementation Tasks

### Task 1: Expand Traditions Data Structure (B6.1.1)

**File**: [`data/editions/sr5/core-rulebook.json`](data/editions/sr5/core-rulebook.json)

**Changes needed**:

1. Update existing 8 traditions to include:

   - `spiritTypes` object mapping spell categories to spirit types
   - `description` field
   - Rename `drain` to `drainAttributes` for consistency (or keep both for backward compatibility)

2. Add missing traditions from source material (at minimum, add core ones):

   - Aztec, Black Magic, Christian Theurgy, Egyptian, Hinduism, Islam, Path Of The Wheel, Qabbalism, Shinto, Sioux, Wuxing
   - Reference: `docs/web_pages/SR5_Magic_Traditions.md` has full list

**Tradition Structure** (update existing entries):

```json
{
  "id": "hermetic",
  "name": "Hermetic",
  "drainAttributes": ["willpower", "logic"],
  "spiritTypes": {
    "combat": "fire",
    "detection": "air",
    "health": "man",
    "illusion": "water",
    "manipulation": "earth"
  },
  "description": "Academic and formulaic approach to magic"
}
```

### Task 2: Add Traditions Extraction and Hooks (B6.1.1)

**Files**:

- [`lib/rules/loader.ts`](lib/rules/loader.ts) - Add `extractTraditions()` function
- [`lib/rules/RulesetContext.tsx`](lib/rules/RulesetContext.tsx) - Add `useTraditions()` hook
- [`lib/rules/index.ts`](lib/rules/index.ts) - Export hook

**Implementation**:

- Extract traditions from `magic` module in ruleset
- Add to `RulesetData` interface
- Add hook for component access

### Task 3: Add Tradition Selection to MagicStep (B6.1.1)

**File**: [`app/characters/create/components/steps/MagicStep.tsx`](app/characters/create/components/steps/MagicStep.tsx)

**Changes needed**:

1. Add tradition selection UI for magical characters (magician, mystic-adept, aspected-mage):

   - Display available traditions from ruleset
   - Show drain attributes for each tradition
   - Show spirit types mapping
   - Store selection in `state.selections.tradition`

2. Add magical lodge selection for Shaman tradition:

   - Only show if tradition is "shaman" or "shamanic"
   - Store in `state.selections.magicalLodge` (optional)

3. Verify aspect selection already works (lines 186-249):

   - Aspected mage group selection (Sorcery, Conjuring, Enchanting) is already implemented
   - Ensure it's properly stored in `state.selections["aspected-mage-group"]`

### Task 4: Implement Drain Resistance Calculation (B6.1.1)

**Files**:

- [`app/characters/create/components/steps/SpellsStep.tsx`](app/characters/create/components/steps/SpellsStep.tsx) - Display drain with tradition
- [`app/characters/create/components/steps/ReviewStep.tsx`](app/characters/create/components/steps/ReviewStep.tsx) - Show drain calculation

**Implementation**:

- Create utility function to calculate drain resistance based on tradition
- Formula: `[Attribute1] + [Attribute2] `(from tradition's `drainAttributes`)
- Display drain formula in spell selection UI
- Show calculated drain resistance in ReviewStep

**Note**: Drain value in spells (e.g., "F-3") is the drain code, not the resistance. Resistance is calculated from tradition attributes.

### Task 5: Create Mentor Spirits Catalog (B6.1.2)

**File**: [`data/editions/sr5/core-rulebook.json`](data/editions/sr5/core-rulebook.json)

**Changes needed**:

1. Add `mentorSpirits` array in `magic` module with ~15 mentor spirits
2. Each mentor spirit should have:

   - `id`, `name`, `description`
   - `bonuses`: Array of bonus effects (e.g., "+2 dice to [skill]", "+1 to [attribute]")
   - `drawbacks`: Array of drawback effects (e.g., "-1 die to [skill]", "compulsion: [behavior]")
   - `karmaCost`: 5 (standard for mentor spirit quality)

**Reference**: `docs/web_pages/SR5_Mentor_Spirits.md` may have details

**Structure**:

```json
{
  "id": "bear",
  "name": "Bear",
  "description": "Strength and protection",
  "bonuses": [
    "+2 dice to Intimidation tests",
    "+1 to Body"
  ],
  "drawbacks": [
    "-1 die to Social tests (except Intimidation)",
    "Compulsion: Protect the weak"
  ],
  "karmaCost": 5
}
```

### Task 6: Add Mentor Spirits Extraction and Hooks (B6.1.2)

**Files**:

- [`lib/rules/loader.ts`](lib/rules/loader.ts) - Add `extractMentorSpirits()` function
- [`lib/rules/RulesetContext.tsx`](lib/rules/RulesetContext.tsx) - Add `useMentorSpirits()` hook
- [`lib/rules/index.ts`](lib/rules/index.ts) - Export hook

### Task 7: Add Mentor Spirit Selection to MagicStep (B6.1.2)

**File**: [`app/characters/create/components/steps/MagicStep.tsx`](app/characters/create/components/steps/MagicStep.tsx)

**Changes needed**:

1. Add mentor spirit selection UI:

   - Show available mentor spirits from ruleset
   - Display bonuses and drawbacks for each
   - Show karma cost (5 karma)
   - Store selection in `state.selections.mentorSpirit` (optional, character can choose not to have one)

2. Update karma budget:

   - Deduct 5 karma if mentor spirit selected
   - Track in `state.budgets["karma-spent-mentor-spirit"]`

### Task 8: Apply Mentor Spirit Bonuses (B6.1.2)

**Files**:

- [`app/characters/create/components/steps/ReviewStep.tsx`](app/characters/create/components/steps/ReviewStep.tsx) - Display mentor spirit bonuses
- Character creation validation - Apply bonuses to derived stats

**Implementation**:

- Parse mentor spirit bonuses/drawbacks
- Apply to relevant skills/attributes in calculations
- Display in ReviewStep with clear indication of source

**Note**: Full bonus application may require parsing bonus strings. For MVP, display bonuses clearly and apply simple numeric bonuses.

### Task 9: Mark Ritual Spells in Catalog (B6.1.3)

**File**: [`data/editions/sr5/core-rulebook.json`](data/editions/sr5/core-rulebook.json)

**Changes needed**:

1. Add `isRitual: true` flag to ritual spells in spell catalog
2. Identify ritual spells (typically have "Ritual" in name or are from ritual spellcasting category)
3. Add `ritualData` object (optional) with:

   - `materialCost`: Base material cost
   - `reagentCost`: Reagent cost per participant
   - `teamworkRequired`: Boolean
   - `minimumParticipants`: Number

**Note**: May need to research which spells are ritual spells from source material.

### Task 10: Add Ritual Spells Filter/Display (B6.1.3)

**File**: [`app/characters/create/components/steps/SpellsStep.tsx`](app/characters/create/components/steps/SpellsStep.tsx)

**Changes needed**:

1. Add filter toggle for ritual spells
2. Display ritual indicator on ritual spells
3. Show ritual-specific information (material cost, teamwork requirements)

**Alternative**: Create separate `RitualSelector.tsx` component if rituals need separate selection flow

### Task 11: Track Ritual Materials/Reagents (B6.1.3)

**Files**:

- [`lib/types/character.ts`](lib/types/character.ts) - Add ritual tracking fields
- [`app/characters/create/components/steps/SpellsStep.tsx`](app/characters/create/components/steps/SpellsStep.tsx) - Display costs

**Implementation**:

- Track ritual material costs in character creation
- Display total ritual material cost
- Optionally track reagent costs (may be post-creation expense)

### Task 12: Update Character Type for Traditions (B6.1.1)

**File**: [`lib/types/character.ts`](lib/types/character.ts)

**Changes needed**:

- Verify `tradition?: string` field exists (line 161) - already exists
- Add `mentorSpirit?: string` field if missing
- Add `magicalLodge?: string` field for shaman tradition
- Add `ritualSpells?: string[]` field if rituals tracked separately from regular spells

### Task 13: Update API Route for Traditions/Mentors (B6.1.1, B6.1.2)

**File**: [`app/api/rulesets/[editionCode]/route.ts`](app/api/rulesets/[editionCode]/route.ts)

**Changes needed**:

- Include `traditions` in API response
- Include `mentorSpirits` in API response
- Verify response structure matches `RulesetData` interface

## Implementation Order

1. **Phase 1: Data Structures** (Tasks 1, 5, 9)

   - Expand traditions data
   - Create mentor spirits catalog
   - Mark ritual spells

2. **Phase 2: Backend Integration** (Tasks 2, 6, 13)

   - Add extraction functions
   - Add hooks
   - Update API routes

3. **Phase 3: UI - Traditions** (Tasks 3, 4)

   - Add tradition selection
   - Implement drain calculation

4. **Phase 4: UI - Mentor Spirits** (Tasks 7, 8)

   - Add mentor spirit selection
   - Apply bonuses

5. **Phase 5: UI - Ritual Magic** (Tasks 10, 11)

   - Add ritual spell filtering/display
   - Track materials

## Testing Checklist

- [x] Traditions display correctly in MagicStep
- [x] Tradition selection stored in character state
- [x] Drain resistance calculates correctly based on tradition
- [x] Spirit types mapping displays for each tradition
- [ ] Magical lodge selection appears for Shaman tradition (deferred - not in Core Rulebook)
- [x] Mentor spirits catalog displays in MagicStep
- [x] Mentor spirit selection deducts 5 karma (integrated with quality system)
- [x] Mentor spirit bonuses/drawbacks display in ReviewStep
- [x] Rituals are displayed in dedicated RitualsStep with keyword filtering
- [x] Ritual karma costs (5 per ritual) tracked correctly
- [x] Path-based access control works (only ritual-capable paths see selection)
- [x] All changes work with existing character creation flow

## Acceptance Criteria (from beta_implementation_plan_v2.md)

- **B6.2.AC.1** [x] Traditions affect drain resistance calculation
- **B6.2.AC.2** [x] Mentor spirits provide correct bonuses
- **B6.2.AC.3** [x] Ritual spells distinguished from standard spells (separate RitualsStep)
- **B6.2.AC.4** [x] Drain calculated correctly per tradition

## Notes

- **Drain Calculation**: The drain value in spell data (e.g., "F-3") is the drain code. The actual drain resistance is calculated as `[Tradition Attribute 1] + [Tradition Attribute 2]`. The drain code determines how much drain the spellcaster takes after casting.

- **Mentor Spirit Bonuses**: Full implementation may require a bonus parsing system. For MVP, focus on displaying bonuses clearly and applying simple numeric bonuses where possible.

- **Ritual Magic**: Ritual spells may be integrated into SpellsStep with filtering, or may need a separate component. Decision depends on whether rituals have significantly different selection mechanics.

- **Spirit Types**: The spirit types mapping determines which type of spirit a tradition summons for each spell category. This is important for conjuring mechanics (future feature).

- **Magical Lodge**: Only relevant for Shaman tradition. May be optional or required - check source material for requirements.