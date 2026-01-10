---
name: B13 Implementation Plan
overview: "Implement B13 phase: Complete decker character creation with Matrix programs (common programs, hacking programs, agent programs) from SR5 Core Rulebook Chapter 10."
todos:
  - id: b13-1-program-interface
    content: "Create Program interface (name, category: common/hacking/agent, cost, description, effects, rating for agents)"
    status: pending
  - id: b13-2-character-update
    content: Add programs array to Character interface
    status: pending
    dependencies:
      - b13-1-program-interface
  - id: b13-3-common-programs
    content: Add common programs (Browse, Configurator, Edit, Encryption, Signal Scrub, Toolbox, Virtual Machine) to core-rulebook.json
    status: pending
    dependencies:
      - b13-1-program-interface
  - id: b13-4-hacking-programs
    content: Add hacking programs (Armor, Baby Monitor, Biofeedback, etc. - ~19 programs) to core-rulebook.json
    status: pending
    dependencies:
      - b13-1-program-interface
  - id: b13-5-agent-programs
    content: Add agent programs with ratings (1-6) to core-rulebook.json
    status: pending
    dependencies:
      - b13-1-program-interface
  - id: b13-6-extractor
    content: Add extractPrograms() function to loader.ts
    status: pending
    dependencies:
      - b13-3-common-programs
      - b13-4-hacking-programs
      - b13-5-agent-programs
  - id: b13-7-hook
    content: Create usePrograms() hook in RulesetContext.tsx
    status: pending
    dependencies:
      - b13-6-extractor
  - id: b13-8-gearstep-category
    content: Add programs category/tab to GearStep.tsx
    status: pending
    dependencies:
      - b13-7-hook
  - id: b13-9-program-filtering
    content: Add program filtering by category (common, hacking, agent) in GearStep
    status: pending
    dependencies:
      - b13-8-gearstep-category
  - id: b13-10-capacity-validation
    content: Add validation for program count against cyberdeck capacity in GearStep
    status: pending
    dependencies:
      - b13-8-gearstep-category
  - id: b13-11-review-step
    content: Display owned programs in ReviewStep.tsx with categories and ratings
    status: pending
    dependencies:
      - b13-8-gearstep-category
  - id: b13-12-api-route
    content: Update /api/rulesets/[editionCode] route to include programs in response
    status: pending
    dependencies:
      - b13-6-extractor
---

# B13 Implementation Plan: Decker Support (Programs)

## Overview

This plan implements Phase B13 from the beta implementation plan, focusing on complete decker character creation support with Matrix programs. The implementation includes program data structures, catalog data, ruleset integration, and program selection UI integrated into the existing GearStep component.

## Current State Analysis

- **Programs**: No Matrix program data exists in the ruleset
- **Cyberdecks**: Already exist in gear system (from B1)
- **Character Type**: No programs field in Character interface
- **GearStep**: Exists but doesn't have programs category

## Implementation Tasks

### Task 1: Create Program Data Structures (B13.1)

**Files**:

- [`lib/types/edition.ts`](lib/types/edition.ts) - Add Program interface
- [`lib/types/character.ts`](lib/types/character.ts) - Add programs to character

**Interfaces to create**:

1. **Program interface** with:

- `id`, `name`
- `category`: "common" | "hacking" | "agent"
- `cost`: number (in nuyen)
- `description`: string
- `effects`: Record<string, unknown> (structured effects)
- `availability`: number
- `restricted?`: boolean
- `forbidden?`: boolean
- `rating?`: number (for agent programs, 1-6)
- `source?`: string (book reference)
- `page?`: number

**Character interface updates**:

- Add `programs?: Program[]` or `programs?: string[]` (program IDs)

**Note**: Programs are purchased with nuyen like gear, so they integrate into the existing gear system.

### Task 2: Populate Program Catalog Data (B13.2)

**File**: [`data/editions/sr5/core-rulebook.json`](data/editions/sr5/core-rulebook.json)

**Data to add**:

1. **Common Programs** (7 programs):

- Browse
- Configurator
- Edit
- Encryption
- Signal Scrub
- Toolbox
- Virtual Machine

2. **Hacking Programs** (~19 programs):

- Armor
- Baby Monitor
- Biofeedback
- Biofeedback Filter
- Blackout
- Decryption
- Defuse
- Demolition
- Exploit
- Fork
- Guard
- Hammer
- Lockdown
- Mugger
- Shell
- Sneak
- Stealth
- Track
- Wrapper

3. **Agent Programs** (with ratings 1-6):

- Agent programs have ratings that determine their capabilities
- Cost typically scales with rating

**Structure**: Add new `programs` module to ruleset JSON with merge strategy, or add to existing `matrix` module if it exists.

### Task 3: Add Ruleset Context & Hooks (B13.3)

**Files**:

- [`lib/rules/loader.ts`](lib/rules/loader.ts) - Add extraction function
- [`lib/rules/RulesetContext.tsx`](lib/rules/RulesetContext.tsx) - Add hook
- [`lib/rules/index.ts`](lib/rules/index.ts) - Export hook

**Function to add**:

- `extractPrograms()` - Extract programs from ruleset

**Hook to add**:

- `usePrograms()` - Access program catalog, optionally filtered by category

**Update RulesetData interface** to include programs data

### Task 4: Integrate Program Selection into GearStep (B13.4)

**File**: [`app/characters/create/components/steps/GearStep.tsx`](app/characters/create/components/steps/GearStep.tsx)

**Changes needed**:

1. **Add programs category/tab**:

- Add "Programs" as a category option alongside existing gear categories
- Filter programs by category (common, hacking, agent)
- Display program catalog with search functionality

2. **Program selection UI**:

- Display program name, category, cost, description
- For agent programs, allow rating selection (1-6)
- Add to shopping cart like other gear items
- Track nuyen spending on programs

3. **Cyberdeck capacity validation**:

- Check if character owns a cyberdeck
- Validate program count against cyberdeck's program limit
- Display warning if approaching or exceeding capacity
- Formula: Cyberdeck has `programs` field indicating max program slots

4. **Program display in cart**:

- Show selected programs in shopping cart
- Display program category and rating (for agents)
- Show total program cost

**Integration points**:

- Programs stored in `state.selections.programs` or integrated into `state.selections.gear`
- Program costs tracked in nuyen budget (already handled by GearStep)
- Programs appear in shopping cart alongside other gear

### Task 5: Update ReviewStep (B13.4.4)

**File**: [`app/characters/create/components/steps/ReviewStep.tsx`](app/characters/create/components/steps/ReviewStep.tsx)

**Changes needed**:

- Display owned programs in a dedicated section or within gear section
- Show program categories (common, hacking, agent)
- Display agent program ratings
- Show total nuyen spent on programs
- Display cyberdeck capacity usage (X/Y programs loaded)

### Task 6: Update API Route (B13.3)

**File**: [`app/api/rulesets/[editionCode]/route.ts`](app/api/rulesets/[editionCode]/route.ts)

**Changes needed**:

- Include `programs` in API response
- Ensure response structure matches RulesetData interface

### Task 7: Cyberdeck Integration Validation

**Files**:

- [`app/characters/create/components/steps/GearStep.tsx`](app/characters/create/components/steps/GearStep.tsx)
- [`lib/rules/validation.ts`](lib/rules/validation.ts) - Optional validation function

**Validation logic**:

- If character has programs but no cyberdeck: Warning (programs need cyberdeck to run)
- If program count exceeds cyberdeck capacity: Error
- Display capacity usage: "X / Y programs" where Y is cyberdeck's program limit

## Implementation Order

1. **Phase 1: Data Structures** (Task 1)

- Create Program interface
- Update Character interface

2. **Phase 2: Catalog Data** (Task 2)

- Populate program catalog with all SR5 CRB programs

3. **Phase 3: Backend Integration** (Tasks 3, 6)

- Add extraction function
- Add hook
- Update API route

4. **Phase 4: UI Integration** (Tasks 4, 5, 7)

- Add programs to GearStep
- Update ReviewStep
- Add validation

## Testing Checklist

- [ ] All common programs available in catalog
- [ ] All hacking programs available in catalog
- [ ] Agent programs available with rating selection (1-6)
- [ ] Programs filterable by category (common, hacking, agent)
- [ ] Programs can be added to shopping cart
- [ ] Program costs tracked in nuyen budget
- [ ] Cyberdeck capacity validation works (prevents exceeding limit)
- [ ] Programs displayed in ReviewStep
- [ ] Capacity usage displayed correctly
- [ ] Decker character archetype fully creatable

## Acceptance Criteria (from beta_implementation_plan_v2.md)

- **B13.5.AC.1** [ ] All SR5 CRB common programs available
- **B13.5.AC.2** [ ] All SR5 CRB hacking programs available
- **B13.5.AC.3** [ ] Agent programs available with ratings
- **B13.5.AC.4** [ ] Program count validated against cyberdeck capacity
- **B13.5.AC.5** [ ] Decker character archetype fully creatable

## Notes

- **Program Categories**: Programs are divided into three categories - common (general use), hacking (offensive/defensive Matrix actions), and agent (AI assistants)
- **Agent Ratings**: Agent programs have ratings 1-6 that determine their capabilities and cost
- **Cyberdeck Requirement**: Programs require a cyberdeck to run. Validation should warn if programs are selected without a cyberdeck
- **Capacity Limits**: Each cyberdeck has a maximum number of program slots. The system should prevent exceeding this limit
- **Integration**: Programs are purchased with nuyen like gear, so they naturally fit into the existing GearStep component rather than requiring a separate step
- **Future**: Program effects and Matrix action integration will be implemented in future phases (Matrix gameplay)
