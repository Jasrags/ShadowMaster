# Beta Implementation Plan

## Overview

**Goal:** Richer GM Tools + Sourcebook Support
**Timeline:** 6-9 months post-MVP
**Prerequisites:** MVP character creation ~95% complete (current state)

This document breaks down the Beta phase into actionable implementation phases with specific tasks, dependencies, and acceptance criteria.

---

## Recommended Work Items (Priority Order)

The following items are recommended for immediate implementation to complete character creation:

| #   | Task                                                                      | Effort | Phase           | Status      |
| --- | ------------------------------------------------------------------------- | ------ | --------------- | ----------- |
| 1   | Fix Adept skill filtering bug - block ALL magical skill groups for adepts | Small  | M0.3.8          | ✅ Complete |
| 2   | Add Aspected Mage group selection                                         | Medium | M0.8            | ✅ Complete |
| 3   | Implement free skills from priority in SkillsStep                         | Medium | M0.3.9          | Not Started |
| 4   | Track free spells/complex forms separately from Karma-purchased           | Medium | M0.7.10         | Not Started |
| 5   | Add Power Points budget for Adepts (free = Magic rating)                  | Medium | B5.1.4          | Not Started |
| 6   | Add Karma-purchased Power Points for Mystic Adepts                        | Medium | B5.1.5, B5.2.6  | Not Started |
| 7   | Add Adept Powers data to ruleset                                          | Large  | B5.1.1          | Not Started |
| 8   | Create AdeptPowersStep component                                          | Large  | B5.2            | Not Started |
| 9   | Add spell formula limits validation (Magic × 2 per category)              | Small  | M0.7.11         | Not Started |
| 10  | Conditional Assensing for Adepts (requires powers system first)           | Small  | B5.1.6, B5.2.11 | Not Started |

**Next Steps:** Focus on completing M0 phase items (M0.3.9, M0.4-M0.7) before moving to Beta features (B5 Adept Powers).

---

## Complete Implementation Order

### Character Creation Wizard Flow (Post-Implementation)

```
1. Priority Selection       ✅ Complete (MVP)
2. Metatype Selection       ✅ Complete (MVP) + M0.2 enhancements pending
3. Attributes Allocation    ✅ Complete (MVP) + M0.6 karma purchases pending
4. Magic/Resonance Path     ✅ Complete (MVP) + B6 tradition enhancements pending
5. Skills Allocation        ✅ Complete (MVP) + M0.3/M0.6 enhancements pending
6. Qualities Selection      ✅ Complete (MVP) + M0.4 enhancements pending
7. Augmentations           ✅ Complete (B1)
8. Spells/Powers           🔜 M0.7 SpellsStep (magical) / B5 AdeptPowersStep (adepts)
9. Complex Forms           🔜 B7 (technomancers only)
10. Contacts               ✅ Complete (MVP) + M0.5 enhancements pending
11. Gear & Resources       ✅ Complete (MVP) + M0.6 karma-to-nuyen pending
12. Review & Finalize      ✅ Complete (MVP)
```

### Full Phase Summary with Status

| Order | Phase  | Focus Area                           | Duration      | Priority     | Status          |
| ----- | ------ | ------------------------------------ | ------------- | ------------ | --------------- |
| 1     | **M0** | **MVP Gaps & Enhancements**          | **1-2 weeks** | **Critical** | 🔄 In Progress  |
|       | M0.1   | Bug Fixes                            | -             | Critical     | ✅ Complete     |
|       | M0.2   | Metatype Enhancements                | -             | Critical     | ✅ Complete     |
|       | M0.3   | Skills Enhancements                  | -             | Critical     | ✅ Complete     |
|       | M0.3.8 | Adept Skill Filtering Bug Fix        | -             | Critical     | ✅ Complete     |
|       | M0.3.9 | Free Skills from Priority            | -             | Critical     | Not Started     |
|       | M0.4   | Qualities Enhancements               | -             | Critical     | 🔜 Next         |
|       | M0.5   | Contacts Enhancements                | -             | Critical     | Not Started     |
|       | M0.6   | Distributed Karma Architecture       | -             | Critical     | Not Started     |
|       | M0.7   | SpellsStep Creation                  | -             | Critical     | Not Started     |
|       | M0.8   | Aspected Mage Enhancements           | -             | Critical     | ✅ Complete     |
| 2     | **B1** | **Cyberware/Bioware System**         | **2-3 weeks** | **High**     | ✅ **Complete** |
| 3     | **B4** | **Combat Tracker**                   | **3-4 weeks** | **High**     | Not Started     |
| 4     | **B3** | **Inventory Management**             | **1-2 weeks** | **High**     | Not Started     |
| 5     | **B5** | **Adept Powers System**              | **1-2 weeks** | **Medium**   | Not Started     |
| 6     | **B6** | **Spell Management**                 | **1-2 weeks** | **Medium**   | Not Started     |
| 7     | **B7** | **Complex Forms & Matrix**           | **1-2 weeks** | **Medium**   | Not Started     |
| 8     | **B2** | **Sourcebook Integration**           | **2 weeks**   | **Medium**   | Not Started     |
| 9     | **B8** | **UI/UX Improvements**               | **1-2 weeks** | **Medium**   | Not Started     |
| 10    | **B9** | **Session Persistence & WebSockets** | **2-3 weeks** | **Low**      | Not Started     |

### Completed Work Summary

| Phase                  | Completion Date | Key Deliverables                                                                                                                                         |
| ---------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MVP Core               | Dec 2024        | Priority system, metatypes, attributes, skills, qualities, contacts, gear, review                                                                        |
| B1 Cyberware           | Dec 2024        | 70+ cyberware items, 60+ bioware items, essence tracking, grade selection, AugmentationsStep                                                             |
| M0.1 Bug Fixes         | Dec 2024        | Validation panel consistency fix, synced validation state across wizard                                                                                  |
| M0.2 Metatype          | Dec 2024        | Racial traits auto-populated, racialQualities field, ReviewStep display                                                                                  |
| M0.3 Skills            | Dec 2024        | Magical/resonance skill filtering, suggested specializations for all skills, example knowledge skills (40+) and languages (20+) with quick-add dropdowns |
| M0.3.8 Adept Filtering | Dec 2024        | Fixed adept skill filtering to block ALL magical skill groups (both individual skills and groups)                                                        |
| M0.8 Aspected Mage     | Dec 2024        | Aspected Mage group selection (Sorcery, Conjuring, Enchanting) implemented and working                                                                   |

### Estimated Remaining Timeline

| Milestone                 | Phases             | Est. Duration   |
| ------------------------- | ------------------ | --------------- |
| MVP Polish                | M0                 | 1-2 weeks       |
| Beta Core                 | B4, B3, B5, B6, B7 | 8-12 weeks      |
| Beta Polish               | B2, B8, B9         | 4-6 weeks       |
| **Total to Beta Release** | All                | **13-20 weeks** |

---

## Phase Summary (Quick Reference)

| Phase  | Focus Area                       | Duration      | Priority     | Status         |
| ------ | -------------------------------- | ------------- | ------------ | -------------- |
| **M0** | **MVP Gaps & Enhancements**      | **1-2 weeks** | **Critical** | 🔄 In Progress |
| B1     | Cyberware/Bioware System         | 2-3 weeks     | High         | ✅ Complete    |
| B4     | Combat Tracker                   | 3-4 weeks     | High         | Not Started    |
| B3     | Inventory Management             | 1-2 weeks     | High         | Not Started    |
| B5     | Adept Powers System              | 1-2 weeks     | Medium       | Not Started    |
| B6     | Spell Management                 | 1-2 weeks     | Medium       | Not Started    |
| B7     | Complex Forms & Matrix           | 1-2 weeks     | Medium       | Not Started    |
| B2     | Sourcebook Integration           | 2 weeks       | Medium       | Not Started    |
| B8     | UI/UX Improvements               | 1-2 weeks     | Medium       | Not Started    |
| B9     | Session Persistence & WebSockets | 2-3 weeks     | Low          | Not Started    |

---

## Phase M0: MVP Gaps & Enhancements

**Objective:** Address gaps and bugs discovered during MVP development before proceeding to Beta features.

**Priority:** Critical - Must complete before Beta phases

### M0.1 Bug Fixes

**Files to modify:**

- `/app/characters/create/components/CreationWizard.tsx`
- `/app/characters/create/components/ValidationPanel.tsx` (or equivalent)

**Tasks:**

| Task   | Description                                                                                                      | Status   |
| ------ | ---------------------------------------------------------------------------------------------------------------- | -------- |
| M0.1.1 | Fix validation panel inconsistency - sidebar shows green "All validations passing" but ReviewStep shows warnings | Complete |
| M0.1.2 | Ensure validation state is consistent across all UI elements                                                     | Complete |

### M0.2 Metatype Enhancements

**Files to modify:**

- `/app/characters/create/components/steps/MetatypeStep.tsx`
- `/lib/types/character.ts`

**Tasks:**

| Task   | Description                                                                                 | Status   |
| ------ | ------------------------------------------------------------------------------------------- | -------- |
| M0.2.1 | When metatype is selected, automatically add racial traits as Racial Qualities to character | Complete |
| M0.2.2 | Display racial qualities in character data (separate from selected qualities)               | Complete |
| M0.2.3 | Ensure racial qualities appear on character sheet/review                                    | Complete |

### M0.3 Skills Enhancements

**Files to modify:**

- `/app/characters/create/components/steps/SkillsStep.tsx`
- `/data/editions/sr5/core-rulebook.json`

**Tasks:**

| Task   | Description                                                                                                         | Status      |
| ------ | ------------------------------------------------------------------------------------------------------------------- | ----------- |
| M0.3.1 | Disable magical skill groups (Sorcery, Conjuring, Enchanting) for mundane characters                                | Complete    |
| M0.3.2 | Disable individual magical skills for mundane characters                                                            | Complete    |
| M0.3.3 | Add suggested specializations to skill data (e.g., Archery: "Bow", "Crossbow", "Slingshot")                         | Complete    |
| M0.3.4 | Update specialization UI to show suggestions as dropdown but still allow free text                                  | Complete    |
| M0.3.5 | Add example knowledge skills to ruleset data (e.g., "Corporate Politics", "Seattle Gangs")                          | Complete    |
| M0.3.6 | Add example language skills to ruleset data (e.g., "Or'zet", "Sperethiel", "Japanese")                              | Complete    |
| M0.3.7 | Ensure custom knowledge/language skill creation still works alongside examples                                      | Complete    |
| M0.3.8 | Fix adept skill filtering bug - block ALL magical skill groups for adepts (both individual skills and skill groups) | Complete    |
| M0.3.9 | Implement free skills from priority in SkillsStep (track free skill points separately from karma-purchased)         | Not Started |

### M0.4 Qualities Enhancements

**Files to modify:**

- `/app/characters/create/components/steps/QualitiesStep.tsx`
- `/data/editions/sr5/core-rulebook.json`
- `/lib/types/edition.ts`

**Tasks:**

| Task   | Description                                                                     | Status      |
| ------ | ------------------------------------------------------------------------------- | ----------- |
| M0.4.1 | Add `isRacial: boolean` flag to Quality interface                               | Not Started |
| M0.4.2 | Filter out racial qualities from quality selection UI                           | Not Started |
| M0.4.3 | Add `levels` or `maxRating` field to Quality interface for leveled qualities    | Not Started |
| M0.4.4 | Update quality data with levels (e.g., Addiction: Mild/Moderate/Severe/Burnout) | Not Started |
| M0.4.5 | Add level selector UI for leveled qualities                                     | Not Started |
| M0.4.6 | Add `statModifiers` field to Quality interface for stat-modifying qualities     | Not Started |
| M0.4.7 | Implement Aptitude quality (raises skill max by 1, limit 1 per character)       | Not Started |
| M0.4.8 | Apply quality stat modifiers to derived stats calculations                      | Not Started |

**Leveled Quality Example:**

```json
{
  "id": "addiction",
  "name": "Addiction",
  "type": "negative",
  "levels": [
    { "level": 1, "name": "Mild", "karma": -4 },
    { "level": 2, "name": "Moderate", "karma": -9 },
    { "level": 3, "name": "Severe", "karma": -20 },
    { "level": 4, "name": "Burnout", "karma": -25 }
  ],
  "requiresSpecification": true,
  "specificationLabel": "Substance"
}
```

**Stat-Modifying Quality Example:**

```json
{
  "id": "aptitude",
  "name": "Aptitude",
  "type": "positive",
  "karma": 14,
  "requiresSpecification": true,
  "specificationLabel": "Skill",
  "statModifiers": {
    "skillMaxBonus": 1,
    "appliesToSpecification": true
  },
  "limit": 1
}
```

### M0.5 Contacts Enhancements

**Files to modify:**

- `/app/characters/create/components/steps/ContactsStep.tsx`
- `/data/editions/sr5/core-rulebook.json`

**Tasks:**

| Task   | Description                                                               | Status      |
| ------ | ------------------------------------------------------------------------- | ----------- |
| M0.5.1 | Add example contacts to ruleset data (Fixer, Street Doc, Bartender, etc.) | Not Started |
| M0.5.2 | Create contact template selector with pre-filled archetypes               | Not Started |
| M0.5.3 | Allow customization of selected template (edit name, adjust ratings)      | Not Started |
| M0.5.4 | Ensure fully custom contact creation still works                          | Not Started |

**Example Contact Template:**

```json
{
  "contactTemplates": [
    {
      "id": "fixer",
      "name": "Fixer",
      "description": "A shadow broker who connects runners with jobs and gear",
      "suggestedConnection": 3,
      "suggestedLoyalty": 2,
      "commonMetatypes": ["Human", "Elf", "Dwarf"]
    },
    {
      "id": "street-doc",
      "name": "Street Doc",
      "description": "An underground medical professional",
      "suggestedConnection": 2,
      "suggestedLoyalty": 2,
      "commonMetatypes": ["Human", "Dwarf"]
    }
  ]
}
```

### M0.6 Distributed Karma Spending Architecture

**Objective:** Integrate karma spending into relevant steps instead of a monolithic KarmaStep.

**Files to modify:**

- `/lib/types/creation.ts`
- `/app/characters/create/components/CreationWizard.tsx`
- All step components that will support karma purchases

**Tasks:**

| Task    | Description                                                               | Status      |
| ------- | ------------------------------------------------------------------------- | ----------- |
| M0.6.1  | Add global karma budget tracker to CreationState                          | Not Started |
| M0.6.2  | Create KarmaBudgetContext for cross-step karma tracking                   | Not Started |
| M0.6.3  | Define karma cost constants (Attributes: ×5, Skills: ×2, Spells: 5, etc.) | Not Started |
| M0.6.4  | Create reusable KarmaPurchasePanel component                              | Not Started |
| M0.6.5  | Update AttributesStep to allow karma purchases (new rating × 5)           | Not Started |
| M0.6.6  | Update SkillsStep to allow karma purchases (new rating × 2, specs: 7)     | Not Started |
| M0.6.7  | Update ContactsStep to show karma spending beyond free CHA×3 points       | Not Started |
| M0.6.8  | Update GearStep to allow Karma-to-Nuyen conversion (2,000¥ per, max 10)   | Not Started |
| M0.6.9  | Refactor KarmaStep to become "Karma Summary" or merge into ReviewStep     | Not Started |
| M0.6.10 | Ensure 7 Karma max carryover validation works with distributed spending   | Not Started |

**Karma Purchase Costs (SR5 Creation Rules):**

```typescript
const KARMA_COSTS = {
  attribute: (newRating: number) => newRating * 5, // New rating × 5
  activeSkill: (newRating: number) => newRating * 2, // New rating × 2
  skillGroup: (newRating: number) => newRating * 5, // New rating × 5
  specialization: 7, // Flat 7 Karma
  spell: 5, // Flat 5 Karma
  complexForm: 4, // Flat 4 Karma
  powerPoint: 5, // 5 Karma per PP (Mystic Adept)
  contact: (connection: number, loyalty: number) => connection + loyalty,
  nuyenConversion: 2000, // 2,000¥ per Karma (max 10)
  positiveQuality: (karma: number) => karma, // Quality's karma cost
  buyOffNegativeQuality: (karma: number) => karma * 2, // Double karma cost (post-creation)
};
```

**UI Pattern - Karma Purchase Section:**

```
┌─────────────────────────────────────────────────────────────┐
│ ⚡ Karma Purchases                    Budget: 25 → 18 Karma │
├─────────────────────────────────────────────────────────────┤
│ You can spend Karma to gain additional [spells/skills/etc.] │
│                                                             │
│ [+ Add with Karma (5 Karma)]                               │
│                                                             │
│ Karma Purchases in this step:                               │
│ • Heal spell (5 Karma)                    [Remove]          │
│ • Levitate spell (5 Karma)                [Remove]          │
│                                           Total: 10 Karma   │
└─────────────────────────────────────────────────────────────┘
```

### M0.7 SpellsStep Creation

**Objective:** Create dedicated spell selection step for magical characters.

**Files to create:**

- `/app/characters/create/components/steps/SpellsStep.tsx`

**Files to modify:**

- `/app/characters/create/components/CreationWizard.tsx`
- `/app/characters/create/components/steps/KarmaStep.tsx`
- `/lib/types/creation.ts`

**Tasks:**

| Task    | Description                                                              | Status      |
| ------- | ------------------------------------------------------------------------ | ----------- |
| M0.7.1  | Create SpellsStep component                                              | Not Started |
| M0.7.2  | Implement free spell allocation based on Magic priority                  | Not Started |
| M0.7.3  | Add spell catalog browser with category filters                          | Not Started |
| M0.7.4  | Display spell details (drain, range, duration, effects)                  | Not Started |
| M0.7.5  | Integrate karma purchase for additional spells (5 Karma each)            | Not Started |
| M0.7.6  | Add spell limit validation (max spells = Magic × 2)                      | Not Started |
| M0.7.7  | Conditionally show step only for magical characters                      | Not Started |
| M0.7.8  | Register step in CreationWizard after MagicStep                          | Not Started |
| M0.7.9  | Move spell selection out of KarmaStep                                    | Not Started |
| M0.7.10 | Track free spells/complex forms separately from Karma-purchased in state | Not Started |
| M0.7.11 | Add spell formula limits validation (Magic × 2 per category)             | Not Started |

**Free Spells by Priority:**
| Magic Priority | Free Spells |
|----------------|-------------|
| A (Magic 6) | 10 spells |
| B (Magic 5) | 7 spells |
| C (Magic 4) | 5 spells |
| D (Magic 3) | 3 spells |
| E | N/A (Mundane) |

**SpellsStep UI Wireframe:**

```
┌─────────────────────────────────────────────────────────────┐
│ Spells                              Karma Remaining: 18     │
├─────────────────────────────────────────────────────────────┤
│ Free Spells: 7/7 selected (Magic Priority B)               │
│ Spell Limit: 10/12 (Magic × 2)                             │
├─────────────────────────────────────────────────────────────┤
│ Category: [All ▼]  Search: [____________]                   │
│                                                             │
│ COMBAT SPELLS                                               │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ☑ Manabolt           Direct | P | LOS | I | WIL        ││
│ │   Drain: F-3         A single target spell...           ││
│ └─────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ☐ Fireball           Indirect | P | LOS(A) | I | -     ││
│ │   Drain: F+1         An area spell dealing fire...      ││
│ │                                    [+ Add Free]         ││
│ └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│ Selected Spells (7 free + 3 karma):                         │
│ • Manabolt (Free)                                           │
│ • Stunbolt (Free)                                           │
│ • Heal (Free)                                               │
│ • Increase Reflexes (Free)                                  │
│ • Improved Invisibility (Free)                              │
│ • Levitate (Free)                                           │
│ • Physical Barrier (Free)                                   │
│ • Detect Life (5 Karma)                    [Remove]         │
│ • Armor (5 Karma)                          [Remove]         │
│ • Combat Sense (5 Karma)                   [Remove]         │
├─────────────────────────────────────────────────────────────┤
│ ⚡ Karma spent on spells: 15                                │
└─────────────────────────────────────────────────────────────┘
```

### M0.8 Aspected Mage Enhancements

**Files to modify:**

- `/app/characters/create/components/steps/MagicStep.tsx`
- `/app/characters/create/components/steps/SkillsStep.tsx`

**Tasks:**

| Task   | Description                                                           | Status   |
| ------ | --------------------------------------------------------------------- | -------- |
| M0.8.1 | Add Aspected Mage group selection UI (Sorcery, Conjuring, Enchanting) | Complete |
| M0.8.2 | Store selected aspected mage group in CreationState                   | Complete |
| M0.8.3 | Filter skills and skill groups based on selected aspect               | Complete |
| M0.8.4 | Validate aspected mage group selection before proceeding              | Complete |

**Note:** Aspected Mage group selection is already implemented. This section documents the completion status.

### M0.9 Acceptance Criteria

- [x] Validation panel shows consistent state across wizard
- [x] Racial traits automatically become racial qualities on character
- [x] Magical skills disabled for mundane characters
- [x] Adept skill filtering blocks ALL magical skill groups (both individual skills and groups)
- [x] Skill specializations show suggestions with free text option
- [x] Example knowledge/language skills available
- [x] Aspected Mage group selection implemented and working
- [ ] Free skills from priority tracked separately from karma-purchased
- [ ] Racial qualities hidden from quality selection
- [ ] Leveled qualities (Addiction) work correctly
- [ ] Stat-modifying qualities (Aptitude) apply correctly
- [ ] Example contacts available as templates
- [ ] Global karma budget tracks spending across all steps
- [ ] Each step shows karma purchase option where applicable
- [ ] SpellsStep appears only for magical characters
- [ ] Free spells allocated correctly by priority
- [ ] Free spells/complex forms tracked separately from karma-purchased
- [ ] Spell formula limits validated (Magic × 2 per category)
- [ ] Karma spell purchases work within SpellsStep
- [ ] 7 Karma max carryover validated correctly

---

## Phase B1: Cyberware/Bioware System

**Objective:** Full augmentation system with essence tracking, capacity, and grades.

### B1.1 Data Structure Updates

**Files to modify:**

- `/lib/types/character.ts`
- `/lib/types/edition.ts`
- `/data/editions/sr5/core-rulebook.json`

**Tasks:**

| Task   | Description                                                                          | Status               |
| ------ | ------------------------------------------------------------------------------------ | -------------------- |
| B1.1.1 | Add CyberwareGrade type (standard, alpha, beta, delta, used)                         | Complete             |
| B1.1.2 | Add CyberwareCategory enum (headware, eyeware, earware, bodyware, cyberlimbs, etc.)  | Complete             |
| B1.1.3 | Expand Cyberware interface with capacity, capacityUsed, grade, essenceCostMultiplier | Complete             |
| B1.1.4 | Add Bioware interface mirroring Cyberware with bioIndex instead of capacity          | Complete             |
| B1.1.5 | Add EssenceHole tracking for magic users                                             | Complete             |
| B1.1.6 | Populate core-rulebook.json with SR5 cyberware catalog (50+ items)                   | Complete (70+ items) |
| B1.1.7 | Populate core-rulebook.json with SR5 bioware catalog (30+ items)                     | Complete (60+ items) |

**Cyberware Grade Essence Multipliers:**

```typescript
const gradeMultipliers = {
  used: 1.25, // +25% essence cost
  standard: 1.0, // base cost
  alpha: 0.8, // -20% essence cost
  beta: 0.6, // -40% essence cost
  delta: 0.5, // -50% essence cost
};
```

### B1.2 Ruleset Context Hooks

**Files to modify:**

- `/lib/rules/RulesetContext.tsx`

**Tasks:**

| Task   | Description                                                          | Status   |
| ------ | -------------------------------------------------------------------- | -------- |
| B1.2.1 | Add `useCyberware()` hook returning filtered cyberware catalog       | Complete |
| B1.2.2 | Add `useBioware()` hook returning filtered bioware catalog           | Complete |
| B1.2.3 | Add `useAugmentationRules()` hook for essence limits, capacity rules | Complete |
| B1.2.4 | Add essence calculation utilities                                    | Complete |

### B1.3 Character Creation Step

**Files to create:**

- `/app/characters/create/components/steps/AugmentationsStep.tsx`

**Files to modify:**

- `/app/characters/create/components/CreationWizard.tsx`
- `/lib/types/creation.ts`

**Tasks:**

| Task    | Description                                                                  | Status   |
| ------- | ---------------------------------------------------------------------------- | -------- |
| B1.3.1  | Create AugmentationsStep component with tabbed interface (Cyberware/Bioware) | Complete |
| B1.3.2  | Implement searchable augmentation catalog with category filters              | Complete |
| B1.3.3  | Add grade selector per augmentation item                                     | Complete |
| B1.3.4  | Implement real-time essence tracking display                                 | Complete |
| B1.3.5  | Add capacity tracking for modular cyberware (cyberlimbs)                     | Complete |
| B1.3.6  | Implement availability validation (≤12 at creation)                          | Complete |
| B1.3.7  | Add nuyen cost tracking integrated with GearStep budget                      | Complete |
| B1.3.8  | Handle Magic/Resonance reduction from essence loss                           | Complete |
| B1.3.9  | Add augmentation bonus validation (max +4 per attribute)                     | Complete |
| B1.3.10 | Register step in CreationWizard between QualitiesStep and ContactsStep       | Complete |

**UI Wireframe:**

```
┌─────────────────────────────────────────────────────────────┐
│ Augmentations                                               │
├─────────────────────────────────────────────────────────────┤
│ [Cyberware] [Bioware]                                       │
│                                                             │
│ Essence: 5.2 / 6.0  ████████████░░░░                       │
│ Nuyen: 45,000¥ remaining                                    │
├─────────────────────────────────────────────────────────────┤
│ Search: [____________] Category: [All ▼] Grade: [All ▼]     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Datajack                         Essence: 0.1           │ │
│ │ Headware | Avail 4 | 1,000¥                             │ │
│ │ Grade: [Standard ▼]              [+ Add]                │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Wired Reflexes 1                 Essence: 2.0           │ │
│ │ Bodyware | Avail 8R | 39,000¥    +1 REA, +1D6 Init      │ │
│ │ Grade: [Standard ▼]              [+ Add]                │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Selected Augmentations:                                     │
│ • Datajack (Standard) - 0.1 ESS - 1,000¥       [Remove]    │
│ • Smartlink (Alpha) - 0.08 ESS - 6,000¥        [Remove]    │
└─────────────────────────────────────────────────────────────┘
```

### B1.4 Derived Stats Updates

**Files to modify:**

- `/app/characters/create/components/steps/ReviewStep.tsx`
- `/lib/types/character.ts`

**Tasks:**

| Task   | Description                                                      | Status   |
| ------ | ---------------------------------------------------------------- | -------- |
| B1.4.1 | Update derived stats calculation to include augmentation bonuses | Complete |
| B1.4.2 | Calculate Social Limit with reduced Essence                      | Complete |
| B1.4.3 | Calculate Overflow with augmentation Body bonuses                | Complete |
| B1.4.4 | Display augmentation-modified attributes clearly                 | Complete |

### B1.5 Acceptance Criteria

- [x] User can browse cyberware/bioware catalog with filters
- [x] Essence cost correctly calculated with grade multipliers
- [x] Magic/Resonance automatically reduced when essence drops
- [x] Capacity system works for modular cyberware
- [x] Availability validation prevents >12 items at creation
- [x] Nuyen budget properly deducted
- [x] Augmentation bonuses apply to derived stats
- [x] No augmentation bonus exceeds +4 per attribute

---

## Phase B2: Sourcebook Integration

**Objective:** Enable Run Faster and Street Grimoire content with proper merging.

### B2.1 Run Faster Sourcebook

**Files to create:**

- `/data/editions/sr5/run-faster.json`

**Content to include:**

| Module          | Content                                    | Priority |
| --------------- | ------------------------------------------ | -------- |
| metatypes       | Metavariants (Nocturna, Satyr, Ogre, etc.) | High     |
| qualities       | New positive/negative qualities (~40)      | High     |
| lifestyles      | Lifestyle options and qualities            | Medium   |
| creationMethods | Life Modules, Sum-to-Ten, Karma Point-Buy  | Medium   |
| skills          | New knowledge skill categories             | Low      |

**Tasks:**

| Task   | Description                                                     | Status      |
| ------ | --------------------------------------------------------------- | ----------- |
| B2.1.1 | Create run-faster.json skeleton with meta and modules structure | Not Started |
| B2.1.2 | Add metavariants with racial modifiers and costs                | Not Started |
| B2.1.3 | Add Run Faster qualities with karma costs                       | Not Started |
| B2.1.4 | Add Life Modules creation method definition                     | Not Started |
| B2.1.5 | Add Sum-to-Ten variant rules                                    | Not Started |
| B2.1.6 | Add Karma Point-Buy method (850 Karma)                          | Not Started |
| B2.1.7 | Add lifestyle qualities and options                             | Not Started |

**Run Faster Metavariants Structure:**

```json
{
  "metatypes": {
    "mergeStrategy": "append",
    "payload": {
      "metatypes": [
        {
          "id": "elf-nocturna",
          "name": "Nocturna",
          "baseMetatype": "elf",
          "priorityAvailability": { "A": true, "B": true, "C": false, "D": false, "E": false },
          "specialAttributePoints": 3,
          "attributeModifiers": {
            "body": { "min": 1, "max": 5 },
            "agility": { "min": 3, "max": 8 },
            "reaction": { "min": 2, "max": 7 },
            "strength": { "min": 1, "max": 5 },
            "willpower": { "min": 1, "max": 6 },
            "logic": { "min": 1, "max": 6 },
            "intuition": { "min": 2, "max": 7 },
            "charisma": { "min": 3, "max": 8 }
          },
          "racialTraits": ["Low-Light Vision", "Enhanced Hearing", "Allergy (Sunlight, Moderate)"],
          "karmaCost": 10
        }
      ]
    }
  }
}
```

### B2.2 Street Grimoire Sourcebook

**Files to create:**

- `/data/editions/sr5/street-grimoire.json`

**Content to include:**

| Module        | Content                               | Priority |
| ------------- | ------------------------------------- | -------- |
| spells        | New spells by category (~100)         | High     |
| traditions    | Additional magical traditions         | High     |
| mentorSpirits | Mentor spirit catalog                 | Medium   |
| adeptPowers   | New adept powers (~30)                | Medium   |
| rituals       | Ritual spellcasting rules and rituals | Medium   |
| qualities     | Magic-related qualities               | Medium   |

**Tasks:**

| Task   | Description                                                                    | Status      |
| ------ | ------------------------------------------------------------------------------ | ----------- |
| B2.2.1 | Create street-grimoire.json skeleton                                           | Not Started |
| B2.2.2 | Add new spells by category (Combat, Detection, Health, Illusion, Manipulation) | Not Started |
| B2.2.3 | Add magical traditions (Black Magic, Chaos, Shinto, etc.)                      | Not Started |
| B2.2.4 | Add mentor spirits catalog with bonuses/drawbacks                              | Not Started |
| B2.2.5 | Add ritual spellcasting rules                                                  | Not Started |
| B2.2.6 | Add new adept powers                                                           | Not Started |
| B2.2.7 | Add magic-related qualities                                                    | Not Started |

### B2.3 Sourcebook Selection UI

**Files to create:**

- `/app/characters/create/components/SourcebookSelector.tsx`

**Files to modify:**

- `/app/characters/create/page.tsx`
- `/lib/types/creation.ts`

**Tasks:**

| Task   | Description                                                      | Status      |
| ------ | ---------------------------------------------------------------- | ----------- |
| B2.3.1 | Create SourcebookSelector component with checkbox list           | Not Started |
| B2.3.2 | Display sourcebook metadata (name, description, content summary) | Not Started |
| B2.3.3 | Store enabled sourcebooks in CreationState                       | Not Started |
| B2.3.4 | Pass sourcebook selection to ruleset loader                      | Not Started |
| B2.3.5 | Update ruleset merge to include only selected sourcebooks        | Not Started |

### B2.4 Merge Algorithm Testing

**Files to create:**

- `/lib/rules/__tests__/merge.test.ts` (when testing framework added)

**Tasks:**

| Task   | Description                                              | Status      |
| ------ | -------------------------------------------------------- | ----------- |
| B2.4.1 | Test append merge strategy with metavariants             | Not Started |
| B2.4.2 | Test merge strategy with conflicting quality IDs         | Not Started |
| B2.4.3 | Test replace strategy for creation method overrides      | Not Started |
| B2.4.4 | Verify merge order (core → Run Faster → Street Grimoire) | Not Started |
| B2.4.5 | Document any ID conflicts and resolutions                | Not Started |

### B2.5 Acceptance Criteria

- [ ] Run Faster sourcebook loads without errors
- [ ] Street Grimoire sourcebook loads without errors
- [ ] Metavariants appear in metatype selection when Run Faster enabled
- [ ] New spells appear in spell selection when Street Grimoire enabled
- [ ] Sourcebook selection persists across wizard navigation
- [ ] Merge conflicts handled gracefully with clear error messages
- [ ] Character records which sourcebooks were used

---

## Phase B3: Inventory Management

**Objective:** Full post-creation gear management with tracking.

### B3.1 Data Structure Updates

**Files to modify:**

- `/lib/types/character.ts`

**Tasks:**

| Task   | Description                                               | Status      |
| ------ | --------------------------------------------------------- | ----------- |
| B3.1.1 | Add InventoryItem interface with condition tracking       | Not Started |
| B3.1.2 | Add Inventory interface with capacity/weight calculations | Not Started |
| B3.1.3 | Add EquipmentSlot enum for equipped items                 | Not Started |
| B3.1.4 | Add AmmoTracker type for ammunition management            | Not Started |
| B3.1.5 | Update Character.gear to use new Inventory structure      | Not Started |

**Inventory Data Structure:**

```typescript
interface InventoryItem {
  id: string;
  itemId: string; // Reference to catalog item
  name: string;
  category: GearCategory;
  quantity: number;
  condition: "pristine" | "good" | "worn" | "damaged" | "destroyed";
  equipped: boolean;
  slot?: EquipmentSlot;
  modifications?: ItemModification[];
  ammoLoaded?: number; // For weapons
  ammoType?: string; // Ammo variant
  notes?: string;
}

interface Inventory {
  items: InventoryItem[];
  totalWeight: number;
  carryingCapacity: number; // STR × 10 kg
  encumbranceLevel: "none" | "light" | "medium" | "heavy";
  nuyen: number; // Current cash on hand
  credsticks: Credstick[];
}
```

### B3.2 API Endpoints

**Files to create:**

- `/app/api/characters/[characterId]/inventory/route.ts`

**Tasks:**

| Task   | Description                                       | Status      |
| ------ | ------------------------------------------------- | ----------- |
| B3.2.1 | GET - Retrieve character inventory                | Not Started |
| B3.2.2 | POST - Add item to inventory                      | Not Started |
| B3.2.3 | PUT - Update item (quantity, condition, equipped) | Not Started |
| B3.2.4 | DELETE - Remove item from inventory               | Not Started |
| B3.2.5 | POST /reload - Reload weapon ammunition           | Not Started |
| B3.2.6 | POST /fire - Expend ammunition                    | Not Started |

### B3.3 Storage Layer

**Files to modify:**

- `/lib/storage/characters.ts`

**Tasks:**

| Task   | Description                                              | Status      |
| ------ | -------------------------------------------------------- | ----------- |
| B3.3.1 | Add addInventoryItem function                            | Not Started |
| B3.3.2 | Add removeInventoryItem function                         | Not Started |
| B3.3.3 | Add updateInventoryItem function                         | Not Started |
| B3.3.4 | Add calculateEncumbrance utility                         | Not Started |
| B3.3.5 | Add transferItem between characters (future: party loot) | Not Started |

### B3.4 Inventory UI

**Files to create:**

- `/app/characters/[characterId]/inventory/page.tsx`
- `/components/inventory/InventoryList.tsx`
- `/components/inventory/InventoryItemCard.tsx`
- `/components/inventory/AddItemModal.tsx`
- `/components/inventory/AmmoTracker.tsx`

**Tasks:**

| Task   | Description                                        | Status      |
| ------ | -------------------------------------------------- | ----------- |
| B3.4.1 | Create inventory page with gear list               | Not Started |
| B3.4.2 | Create InventoryList with sorting/filtering        | Not Started |
| B3.4.3 | Create InventoryItemCard with quick actions        | Not Started |
| B3.4.4 | Create AddItemModal with catalog search            | Not Started |
| B3.4.5 | Create AmmoTracker for quick reloading             | Not Started |
| B3.4.6 | Add drag-and-drop reordering                       | Not Started |
| B3.4.7 | Add equipment slots visual (what's equipped where) | Not Started |

**UI Wireframe:**

```
┌─────────────────────────────────────────────────────────────┐
│ Inventory - John "Ghost" Smith                              │
├─────────────────────────────────────────────────────────────┤
│ Weight: 12.5 / 60 kg   Nuyen: 3,450¥   [+ Add Item]        │
├─────────────────────────────────────────────────────────────┤
│ Filter: [All ▼]  Sort: [Name ▼]  [Show Equipped Only ☐]    │
├─────────────────────────────────────────────────────────────┤
│ WEAPONS                                                     │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ⚔ Ares Predator V                    [Equipped ✓]      ││
│ │   Heavy Pistol | 15/15 APDS | Good                      ││
│ │   [Fire] [Reload] [Unequip] [Details]                   ││
│ └─────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ⚔ Combat Knife                       [Equipped ✓]      ││
│ │   Blade | — | Pristine                                  ││
│ │   [Unequip] [Details]                                   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ARMOR                                                       │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 🛡 Armored Jacket                    [Equipped ✓]       ││
│ │   Armor 12 | 2.0 kg | Good                              ││
│ │   [Unequip] [Details]                                   ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### B3.5 Acceptance Criteria

- [ ] User can view full inventory list
- [ ] User can add items from gear catalog
- [ ] User can remove items from inventory
- [ ] User can track ammunition with reload/fire actions
- [ ] Encumbrance calculated correctly based on STR
- [ ] Item condition can be updated
- [ ] Equipped items displayed prominently
- [ ] Nuyen balance tracked separately

---

## Phase B4: Combat Tracker

**Objective:** Full combat encounter management with initiative, turns, and damage.

### B4.1 Data Structures

**Files to create:**

- `/lib/types/combat.ts`

**Tasks:**

| Task   | Description                                      | Status      |
| ------ | ------------------------------------------------ | ----------- |
| B4.1.1 | Create CombatSession interface                   | Not Started |
| B4.1.2 | Create Combatant interface (character or NPC)    | Not Started |
| B4.1.3 | Create Initiative interface with pass tracking   | Not Started |
| B4.1.4 | Create CombatAction interface                    | Not Started |
| B4.1.5 | Create CombatRound interface with phase tracking | Not Started |
| B4.1.6 | Create CombatLog for history                     | Not Started |

**Combat Data Structure:**

```typescript
interface CombatSession {
  id: string;
  campaignId?: string;
  gmId: string;
  name: string;
  status: "preparing" | "active" | "paused" | "completed";
  combatants: Combatant[];
  currentRound: number;
  currentPass: number;
  currentTurnIndex: number;
  initiativeOrder: Initiative[];
  environmentModifiers: EnvironmentModifier[];
  combatLog: CombatLogEntry[];
  createdAt: string;
  updatedAt: string;
}

interface Combatant {
  id: string;
  characterId?: string; // For player characters
  npcId?: string; // For NPCs
  name: string;
  type: "pc" | "npc" | "spirit" | "sprite" | "drone";
  team: "player" | "enemy" | "neutral";
  initiative: number;
  initiativeDice: number; // How many d6s for initiative
  currentPhysical: number;
  maxPhysical: number;
  currentStun: number;
  maxStun: number;
  conditions: CombatCondition[];
  actionsRemaining: {
    free: number;
    simple: number;
    complex: number;
  };
}

interface Initiative {
  combatantId: string;
  baseInitiative: number; // REA + INT + bonuses
  roll: number; // Dice result
  total: number; // base + roll
  passes: number; // Number of passes this combatant gets
  currentPass: number; // Which pass they're on
}
```

### B4.2 Storage Layer

**Files to create:**

- `/lib/storage/combat.ts`

**Tasks:**

| Task   | Description                  | Status      |
| ------ | ---------------------------- | ----------- |
| B4.2.1 | createCombatSession function | Not Started |
| B4.2.2 | getCombatSession function    | Not Started |
| B4.2.3 | updateCombatSession function | Not Started |
| B4.2.4 | deleteCombatSession function | Not Started |
| B4.2.5 | addCombatant function        | Not Started |
| B4.2.6 | removeCombatant function     | Not Started |
| B4.2.7 | logCombatAction function     | Not Started |

### B4.3 API Endpoints

**Files to create:**

- `/app/api/combat/route.ts`
- `/app/api/combat/[sessionId]/route.ts`
- `/app/api/combat/[sessionId]/initiative/route.ts`
- `/app/api/combat/[sessionId]/turn/route.ts`
- `/app/api/combat/[sessionId]/action/route.ts`

**Tasks:**

| Task    | Description                                                     | Status      |
| ------- | --------------------------------------------------------------- | ----------- |
| B4.3.1  | POST /combat - Create new combat session                        | Not Started |
| B4.3.2  | GET /combat - List active combat sessions                       | Not Started |
| B4.3.3  | GET /combat/[id] - Get combat session details                   | Not Started |
| B4.3.4  | PUT /combat/[id] - Update session (pause, resume, complete)     | Not Started |
| B4.3.5  | DELETE /combat/[id] - Delete combat session                     | Not Started |
| B4.3.6  | POST /combat/[id]/initiative - Roll initiative for all          | Not Started |
| B4.3.7  | POST /combat/[id]/turn/next - Advance to next turn              | Not Started |
| B4.3.8  | POST /combat/[id]/turn/delay - Delay current turn               | Not Started |
| B4.3.9  | POST /combat/[id]/action - Log an action (attack, defend, etc.) | Not Started |
| B4.3.10 | POST /combat/[id]/damage - Apply damage to combatant            | Not Started |

### B4.4 Combat UI

**Files to create:**

- `/app/combat/page.tsx` (combat session list)
- `/app/combat/[sessionId]/page.tsx` (active combat tracker)
- `/components/combat/InitiativeTracker.tsx`
- `/components/combat/CombatantCard.tsx`
- `/components/combat/ActionPanel.tsx`
- `/components/combat/DamageModal.tsx`
- `/components/combat/CombatLog.tsx`

**Tasks:**

| Task    | Description                                        | Status      |
| ------- | -------------------------------------------------- | ----------- |
| B4.4.1  | Create combat session list page                    | Not Started |
| B4.4.2  | Create new combat session form                     | Not Started |
| B4.4.3  | Create InitiativeTracker with turn order display   | Not Started |
| B4.4.4  | Create CombatantCard with health bars              | Not Started |
| B4.4.5  | Create ActionPanel for current turn actions        | Not Started |
| B4.4.6  | Create DamageModal for applying damage             | Not Started |
| B4.4.7  | Create CombatLog showing action history            | Not Started |
| B4.4.8  | Add condition management (prone, suppressed, etc.) | Not Started |
| B4.4.9  | Add round/pass counter display                     | Not Started |
| B4.4.10 | Integrate DiceRoller component for rolls           | Not Started |

**UI Wireframe:**

```
┌─────────────────────────────────────────────────────────────┐
│ Combat: Warehouse Ambush         Round 2 | Pass 1          │
│ [Pause] [End Combat] [Add Combatant]                        │
├─────────────────────────────────────────────────────────────┤
│ Initiative Order                                            │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ▶ 1. Ghost (PC)       Init: 14+3d6=25    ████████ 10/10││
│ │   2. Ganger 1 (Enemy) Init: 8+1d6=12     ████░░░░  5/9 ││
│ │   3. Razor (PC)       Init: 12+2d6=20    ██████░░  8/10││
│ │   4. Ganger 2 (Enemy) Init: 8+1d6=11     ████████  9/9 ││
│ │   — Pass 2 —                                            ││
│ │   5. Ghost (PC)       Pass 2                            ││
│ │   6. Razor (PC)       Pass 2                            ││
│ └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│ Current Turn: Ghost                                         │
│ Actions: [2 Simple] or [1 Complex] + [1 Free]              │
│                                                             │
│ [Attack] [Defend] [Move] [Spell] [Other] [End Turn]        │
├─────────────────────────────────────────────────────────────┤
│ Combat Log                                                  │
│ • Ghost attacks Ganger 1: 4 hits vs 2 hits. 2 net hits.    │
│ • Ganger 1 takes 8P damage (soaked 3). 5P remaining.       │
│ • Round 2 begins. Rolling initiative...                     │
└─────────────────────────────────────────────────────────────┘
```

### B4.5 Initiative System

**SR5 Initiative Rules:**

- Base Initiative = Reaction + Intuition + modifiers
- Initiative Dice = 1d6 + bonus dice (cyberware, drugs, magic)
- Initiative Score = Base + dice roll
- Multiple passes: Score > 10 gets extra pass, > 20 gets third pass, etc.
- Each pass deducts 10 from score until score ≤ 0

**Tasks:**

| Task   | Description                                        | Status      |
| ------ | -------------------------------------------------- | ----------- |
| B4.5.1 | Calculate base initiative from attributes          | Not Started |
| B4.5.2 | Calculate initiative dice from bonuses             | Not Started |
| B4.5.3 | Implement multi-pass system (score - 10 each pass) | Not Started |
| B4.5.4 | Handle initiative ties (higher REA + INT wins)     | Not Started |
| B4.5.5 | Support delayed actions                            | Not Started |
| B4.5.6 | Support interrupt actions (-5 to -10 initiative)   | Not Started |

### B4.6 Acceptance Criteria

- [ ] GM can create new combat session
- [ ] GM can add player characters and NPCs
- [ ] Initiative rolls correctly with all modifiers
- [ ] Turn order displays correctly with multiple passes
- [ ] Current turn clearly indicated
- [ ] Damage can be applied with proper track handling
- [ ] Combat log records all actions
- [ ] Session can be paused and resumed
- [ ] Conditions affect relevant rolls

---

## Phase B5: Adept Powers System

**Objective:** Complete adept character support with power point allocation.

### B5.1 Data Structure Updates

**Files to modify:**

- `/data/editions/sr5/core-rulebook.json`
- `/lib/types/character.ts`
- `/lib/types/creation.ts`

**Tasks:**

| Task   | Description                                                                       | Status      |
| ------ | --------------------------------------------------------------------------------- | ----------- |
| B5.1.1 | Create comprehensive adept powers catalog (~50 powers)                            | Not Started |
| B5.1.2 | Add AdeptPower interface with levels, prerequisites                               | Not Started |
| B5.1.3 | Add power point pool calculation to Character                                     | Not Started |
| B5.1.4 | Add power point budget tracking to CreationState (free = Magic rating for adepts) | Not Started |
| B5.1.5 | Add mystic adept power point purchase tracking (5 Karma = 1 PP)                   | Not Started |
| B5.1.6 | Add conditional Assensing skill availability for adepts (requires powers system)  | Not Started |

**Adept Power Structure:**

```json
{
  "adeptPowers": [
    {
      "id": "improved-reflexes",
      "name": "Improved Reflexes",
      "cost": 1.5,
      "costPerLevel": true,
      "maxLevels": 3,
      "description": "+1 REA and +1D6 Initiative per level",
      "effects": [
        { "attribute": "reaction", "modifier": 1, "perLevel": true },
        { "derived": "initiativeDice", "modifier": 1, "perLevel": true }
      ],
      "prerequisites": [],
      "source": "core-rulebook",
      "page": 309
    },
    {
      "id": "killing-hands",
      "name": "Killing Hands",
      "cost": 0.5,
      "costPerLevel": false,
      "maxLevels": 1,
      "description": "Unarmed attacks deal Physical damage",
      "effects": [{ "combat": "unarmedDamageType", "value": "physical" }],
      "prerequisites": [],
      "source": "core-rulebook",
      "page": 310
    }
  ]
}
```

### B5.2 Creation Step Updates

**Files to create:**

- `/app/characters/create/components/steps/AdeptPowersStep.tsx`

**Files to modify:**

- `/app/characters/create/components/CreationWizard.tsx`
- `/app/characters/create/components/steps/MagicStep.tsx`
- `/lib/types/creation.ts`

**Tasks:**

| Task    | Description                                                                     | Status      |
| ------- | ------------------------------------------------------------------------------- | ----------- |
| B5.2.1  | Create AdeptPowersStep component                                                | Not Started |
| B5.2.2  | Add Power Points budget display (free = Magic rating for adepts)                | Not Started |
| B5.2.3  | Track spent power points with real-time display                                 | Not Started |
| B5.2.4  | Handle power levels with fractional costs                                       | Not Started |
| B5.2.5  | Enforce prerequisites between powers                                            | Not Started |
| B5.2.6  | For mystic adepts: implement PP purchase with karma (5 Karma = 1 PP)            | Not Started |
| B5.2.7  | Display power effects in selection UI                                           | Not Started |
| B5.2.8  | Add power catalog browser with search and filters                               | Not Started |
| B5.2.9  | Register AdeptPowersStep in CreationWizard (after MagicStep, before SpellsStep) | Not Started |
| B5.2.10 | Conditionally show step only for adepts and mystic adepts                       | Not Started |
| B5.2.11 | Add conditional Assensing skill availability (requires Astral Perception power) | Not Started |

### B5.3 Acceptance Criteria

- [ ] Adept powers catalog fully populated (~50 powers)
- [ ] Power point pool calculated correctly (free = Magic rating for adepts)
- [ ] Power point budget tracked in CreationState
- [ ] Powers with levels correctly cost per level
- [ ] Prerequisites enforced
- [ ] Mystic adepts can purchase PP with Karma (5 Karma = 1 PP)
- [ ] Power effects clearly displayed
- [ ] Selected powers apply to derived stats
- [ ] AdeptPowersStep appears only for adepts and mystic adepts
- [ ] Assensing skill available only when Astral Perception power is selected

---

## Phase B6: Spell Management

**Objective:** Enhanced spell system with traditions, rituals, and mentor spirits.

### B6.1 Tradition System

**Files to modify:**

- `/data/editions/sr5/core-rulebook.json`
- `/lib/types/character.ts`
- `/app/characters/create/components/steps/MagicStep.tsx`

**Tasks:**

| Task   | Description                                                                  | Status      |
| ------ | ---------------------------------------------------------------------------- | ----------- |
| B6.1.1 | Add Tradition interface with drain attributes                                | Not Started |
| B6.1.2 | Create traditions catalog (Hermetic, Shamanic, etc.)                         | Not Started |
| B6.1.3 | Map traditions to spirit types                                               | Not Started |
| B6.1.4 | Add tradition selection to character creation (Magicians)                    | Not Started |
| B6.1.5 | Calculate drain resistance based on tradition                                | Not Started |
| B6.1.6 | Add magical lodge selection for Shamans                                      | Not Started |
| B6.1.7 | Add aspect selection for Aspected Magicians (Sorcery, Conjuring, Enchanting) | Not Started |

**Tradition Structure:**

```json
{
  "traditions": [
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
    },
    {
      "id": "shamanic",
      "name": "Shamanic",
      "drainAttributes": ["willpower", "charisma"],
      "spiritTypes": {
        "combat": "beast",
        "detection": "air",
        "health": "earth",
        "illusion": "water",
        "manipulation": "man"
      },
      "description": "Spiritual connection to nature and totem"
    }
  ]
}
```

### B6.2 Mentor Spirits

**Files to modify:**

- `/data/editions/sr5/core-rulebook.json`

**Tasks:**

| Task   | Description                                       | Status      |
| ------ | ------------------------------------------------- | ----------- |
| B6.2.1 | Create mentor spirits catalog (~15 spirits)       | Not Started |
| B6.2.2 | Add MentorSpirit interface with bonuses/drawbacks | Not Started |
| B6.2.3 | Add mentor spirit selection to character creation | Not Started |
| B6.2.4 | Apply mentor bonuses to spell/skill calculations  | Not Started |

### B6.3 Ritual Magic

**Files to create:**

- `/components/magic/RitualSelector.tsx`

**Tasks:**

| Task   | Description                                         | Status      |
| ------ | --------------------------------------------------- | ----------- |
| B6.3.1 | Add ritual spells to spell catalog                  | Not Started |
| B6.3.2 | Create RitualSelector for ritual-capable characters | Not Started |
| B6.3.3 | Track ritual materials and reagent costs            | Not Started |
| B6.3.4 | Add ritual teamwork rules                           | Not Started |

### B6.4 Acceptance Criteria

- [ ] Traditions affect drain resistance calculation
- [ ] Mentor spirits provide correct bonuses
- [ ] Ritual spells distinguished from standard spells
- [ ] Drain calculated correctly per tradition

---

## Phase B7: Complex Forms & Matrix

**Objective:** Enhanced technomancer support with full complex forms catalog.

### B7.1 Complex Forms Catalog

**Files to modify:**

- `/data/editions/sr5/core-rulebook.json`

**Tasks:**

| Task   | Description                                                  | Status      |
| ------ | ------------------------------------------------------------ | ----------- |
| B7.1.1 | Expand complex forms catalog (~30 forms)                     | Not Started |
| B7.1.2 | Add ComplexForm interface with fading values                 | Not Started |
| B7.1.3 | Categorize forms (attack, sleaze, data processing, firewall) | Not Started |
| B7.1.4 | Add threading rules                                          | Not Started |

### B7.2 Living Persona

**Files to modify:**

- `/app/characters/create/components/steps/ReviewStep.tsx`

**Tasks:**

| Task   | Description                                                           | Status      |
| ------ | --------------------------------------------------------------------- | ----------- |
| B7.2.1 | Calculate Living Persona stats for technomancers                      | Not Started |
| B7.2.2 | Display Matrix attributes (Attack, Sleaze, Data Processing, Firewall) | Not Started |
| B7.2.3 | Calculate Matrix Initiative (Data Processing + Intuition + 4d6)       | Not Started |

### B7.3 Acceptance Criteria

- [ ] Complete complex forms catalog available
- [ ] Fading values correctly displayed
- [ ] Living Persona calculated for technomancers
- [ ] Matrix Initiative calculated correctly

---

## Phase B8: UI/UX Improvements

**Objective:** Improve overall UI/UX including mobile responsiveness and layout fixes.

### B8.1 Layout Improvements

**Files to modify:**

- `/app/characters/create/components/CreationWizard.tsx`
- `/components/layout/Sidebar.tsx` (or create)
- `/app/characters/create/components/steps/GearStep.tsx`

**Tasks:**

| Task   | Description                                                                           | Status      |
| ------ | ------------------------------------------------------------------------------------- | ----------- |
| B8.1.1 | Make sidebar collapsible to increase main content width                               | Not Started |
| B8.1.2 | Add collapse/expand toggle button to sidebar                                          | Not Started |
| B8.1.3 | Persist sidebar collapse state in localStorage                                        | Not Started |
| B8.1.4 | Fix GearStep shopping cart width - give gear catalog more horizontal space            | Not Started |
| B8.1.5 | Consider side-by-side layout for gear catalog and cart on wide screens                | Not Started |
| B8.1.6 | Add responsive breakpoints for cart layout (stack on mobile, side-by-side on desktop) | Not Started |

### B8.2 Mobile Audit & Testing

**Tasks:**

| Task   | Description                                       | Status      |
| ------ | ------------------------------------------------- | ----------- |
| B8.2.1 | Test all creation wizard steps on mobile viewport | Not Started |
| B8.2.2 | Test character sheet on mobile                    | Not Started |
| B8.2.3 | Test combat tracker on mobile                     | Not Started |
| B8.2.4 | Test inventory management on mobile               | Not Started |
| B8.2.5 | Document specific mobile issues                   | Not Started |

### B8.3 Mobile UI Fixes

**Tasks:**

| Task   | Description                                      | Status      |
| ------ | ------------------------------------------------ | ----------- |
| B8.3.1 | Convert fixed-width tables to responsive layouts | Not Started |
| B8.3.2 | Add touch-friendly tap targets (minimum 44px)    | Not Started |
| B8.3.3 | Implement collapsible sections for dense content | Not Started |
| B8.3.4 | Add swipe gestures for navigation                | Not Started |
| B8.3.5 | Optimize dice roller for touch interaction       | Not Started |
| B8.3.6 | Add bottom navigation for key actions            | Not Started |

### B8.4 Acceptance Criteria

- [ ] Sidebar can be collapsed/expanded
- [ ] Sidebar state persists across page navigation
- [ ] Gear catalog has adequate width for browsing
- [ ] All pages usable on 375px viewport
- [ ] Touch targets meet accessibility guidelines
- [ ] No horizontal scrolling on mobile
- [ ] Text readable without zooming

---

## Phase B9: Session Persistence & WebSockets

**Objective:** Real-time multiplayer support for combat and sessions.

### B9.1 WebSocket Infrastructure

**Files to create:**

- `/lib/websocket/server.ts`
- `/lib/websocket/client.ts`
- `/lib/websocket/events.ts`

**Tasks:**

| Task   | Description                                            | Status      |
| ------ | ------------------------------------------------------ | ----------- |
| B9.1.1 | Evaluate WebSocket library (Socket.io vs ws vs Pusher) | Not Started |
| B9.1.2 | Implement WebSocket server integration with Next.js    | Not Started |
| B9.1.3 | Create event types for combat updates                  | Not Started |
| B9.1.4 | Create event types for dice roll broadcasts            | Not Started |
| B9.1.5 | Implement client-side WebSocket hook                   | Not Started |

### B9.2 Combat Session Sharing

**Tasks:**

| Task   | Description                                         | Status      |
| ------ | --------------------------------------------------- | ----------- |
| B9.2.1 | Broadcast initiative changes to all participants    | Not Started |
| B9.2.2 | Broadcast damage/healing updates                    | Not Started |
| B9.2.3 | Broadcast turn changes                              | Not Started |
| B9.2.4 | Handle participant join/leave                       | Not Started |
| B9.2.5 | Implement GM-only actions vs player-visible actions | Not Started |

### B9.3 Session State Management

**Tasks:**

| Task   | Description                                       | Status      |
| ------ | ------------------------------------------------- | ----------- |
| B9.3.1 | Create session join flow with invite codes        | Not Started |
| B9.3.2 | Persist session state across reconnections        | Not Started |
| B9.3.3 | Handle conflict resolution for concurrent updates | Not Started |
| B9.3.4 | Add session recovery for disconnections           | Not Started |

### B9.4 Acceptance Criteria

- [ ] Multiple users can view same combat session
- [ ] Updates appear in real-time for all participants
- [ ] Disconnected users can rejoin and sync state
- [ ] GM actions properly authorized

---

## Dependencies & Prerequisites

### Technical Dependencies

| Dependency        | Required For | Notes                             |
| ----------------- | ------------ | --------------------------------- |
| WebSocket library | B9           | Socket.io recommended for Next.js |
| Test framework    | B2.4         | Jest + React Testing Library      |
| Mobile testing    | B8           | Physical devices or BrowserStack  |

### Data Dependencies

| Data Required           | Required For | Source                       |
| ----------------------- | ------------ | ---------------------------- |
| Cyberware catalog       | B1           | SR5 Core Rulebook p. 451-462 |
| Bioware catalog         | B1           | SR5 Core Rulebook p. 462-468 |
| Run Faster content      | B2           | Run Faster sourcebook        |
| Street Grimoire content | B2           | Street Grimoire sourcebook   |
| Adept powers catalog    | B5           | SR5 Core Rulebook p. 308-312 |
| Traditions              | B6           | SR5 Core Rulebook p. 280-282 |

### Phase Dependencies

```
B1 (Cyberware) ──────────────────────────────┐
B2 (Sourcebooks) ────────────────────────────┤
B3 (Inventory) ──────────────────────────────┼──> Beta Release
B4 (Combat) ─────────────────────────────────┤
B5 (Adept) ─────> B6 (Spells) ───────────────┤
                 B7 (Matrix) ────────────────┤
B8 (Mobile) ─────────────────────────────────┤
B4 ─────> B9 (WebSockets) ───────────────────┘
```

---

## Risk Assessment

### High Risk Items

| Risk                         | Impact                  | Mitigation                          |
| ---------------------------- | ----------------------- | ----------------------------------- |
| Sourcebook data entry errors | Character creation bugs | Thorough QA with reference books    |
| Combat system complexity     | Development delays      | Start with MVP combat, iterate      |
| WebSocket scaling            | Performance issues      | Use proven library, test under load |

### Medium Risk Items

| Risk                                | Impact                       | Mitigation                             |
| ----------------------------------- | ---------------------------- | -------------------------------------- |
| Mobile layout breaks                | Poor UX on mobile            | Early mobile testing, responsive-first |
| Essence calculation edge cases      | Character validation errors  | Unit tests for edge cases              |
| Merge conflicts between sourcebooks | Unexpected rule interactions | Document all conflicts, GM resolution  |

---

## Success Metrics

| Metric                    | Target  | Measurement                  |
| ------------------------- | ------- | ---------------------------- |
| Cyberware items available | 50+     | Count in catalog             |
| Sourcebook integration    | 2 books | Run Faster + Street Grimoire |
| Combat sessions created   | 100     | Analytics                    |
| Mobile usability score    | 90+     | Lighthouse audit             |
| WebSocket latency         | <100ms  | Performance monitoring       |

---

## Appendix A: File Locations Quick Reference

### New Files to Create

```
/data/editions/sr5/
├── run-faster.json
└── street-grimoire.json

/lib/types/
└── combat.ts

/lib/storage/
└── combat.ts

/lib/websocket/
├── server.ts
├── client.ts
└── events.ts

/app/api/combat/
├── route.ts
└── [sessionId]/
    ├── route.ts
    ├── initiative/route.ts
    ├── turn/route.ts
    └── action/route.ts

/app/combat/
├── page.tsx
└── [sessionId]/page.tsx

/app/characters/[characterId]/inventory/
└── page.tsx

/app/characters/create/components/steps/
├── AugmentationsStep.tsx
├── SpellsStep.tsx
└── AdeptPowersStep.tsx

/components/combat/
├── InitiativeTracker.tsx
├── CombatantCard.tsx
├── ActionPanel.tsx
├── DamageModal.tsx
└── CombatLog.tsx

/components/inventory/
├── InventoryList.tsx
├── InventoryItemCard.tsx
├── AddItemModal.tsx
└── AmmoTracker.tsx

/components/magic/
└── RitualSelector.tsx
```

### Files to Modify

```
/lib/types/character.ts        # Add inventory, augmentation types
/lib/types/edition.ts          # Add new module types
/lib/types/creation.ts         # Add sourcebook selection, power point budget, free spell/complex form tracking
/lib/rules/RulesetContext.tsx  # Add new hooks
/lib/storage/characters.ts     # Add inventory functions
/data/editions/sr5/core-rulebook.json  # Expand catalogs (adept powers, spells)
/app/characters/create/components/CreationWizard.tsx  # Add AugmentationsStep, SpellsStep, AdeptPowersStep
```
