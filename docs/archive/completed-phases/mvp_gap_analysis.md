# MVP Gap Analysis: SR5 Character Creation

_Last updated: 2025-01-27_

This document captures the gap analysis between the SR5 character creation documentation (`docs/rules/5e/character-creation.md`) and the current implementation, identifying remaining work to complete the MVP.

## Executive Summary

The character creation wizard has a solid foundation with the core flow implemented. However, several key SR5 mechanics are missing that prevent creating a fully valid character per the rules. The gaps fall into three categories:

1. **Missing Steps** — Entire creation steps not yet implemented
2. **Incomplete Steps** — Steps that exist but lack full functionality
3. **Validation Gaps** — Rules that aren't enforced during creation

---

## Gap Categories

### 🔴 Critical Gaps (Blocks Valid Character Creation)

| Gap                              | Description                                                        | Effort | Reference  |
| -------------------------------- | ------------------------------------------------------------------ | ------ | ---------- |
| **Special Attribute Allocation** | No UI to allocate special attribute points to Edge/Magic/Resonance | Medium | p. 66      |
| **Knowledge/Language Skills**    | Free points (INT+LOG)×2 not tracked or spent                       | Medium | p. 88-89   |
| **Contacts System**              | No way to create contacts with Connection/Loyalty                  | Medium | p. 98, 386 |
| **Gear Step**                    | Only placeholder UI, no actual gear purchasing                     | Large  | p. 94      |
| **Final Calculations**           | Derived stats not computed or stored                               | Small  | p. 101     |

### 🟡 Important Gaps (Affects Character Validity)

| Gap                       | Description                              | Effort | Reference |
| ------------------------- | ---------------------------------------- | ------ | --------- |
| **Leftover Karma Step**   | No UI for Karma-based purchases          | Medium | p. 98-100 |
| **Skill Specializations** | Can't add specializations to skills      | Small  | p. 88     |
| **Spell Selection**       | Magicians can't choose their spells      | Medium | p. 280    |
| **Complex Forms**         | Technomancers can't choose complex forms | Medium | p. 250    |
| **One Attribute at Max**  | Not validated during creation            | Small  | p. 66     |
| **All Points Spent**      | Warning only, not enforced               | Small  | p. 66     |

### 🟢 Nice-to-Have Gaps (Polish Items)

| Gap                     | Description                       | Effort | Reference |
| ----------------------- | --------------------------------- | ------ | --------- |
| **Adept Powers**        | Power selection for Adepts        | Medium | p. 308    |
| **Tradition Selection** | Magicians should choose tradition | Small  | p. 278    |
| **Bound Spirits**       | Spirit binding at creation        | Small  | p. 300    |
| **Registered Sprites**  | Sprite registration at creation   | Small  | p. 254    |
| **Foci Bonding**        | Foci bonding at creation          | Medium | p. 318    |
| **Starting Nuyen Roll** | Roll based on lifestyle           | Tiny   | p. 95     |

---

## Detailed Gap Analysis by Step

### Step 2: Metatype & Special Attributes

**Current State:** Metatype selection works. Special attribute points are calculated but not allocated.

**Missing:**

- `SpecialAttributeAllocator` component
- Edge starts at 1 (2 for Humans)
- Magic starts at value from Magic priority
- Resonance starts at value from Resonance priority
- Validation: all special points must be spent
- Validation: Edge cap 7 for humans, 6 for others
- Exceptional Attribute quality support

**Code Location:** `CreationWizard.tsx` has TODO comment at line 340

```typescript
specialAttributes: {
  edge: 1, // TODO: Calculate from special attribute points
  essence: 6,
  magic: (state.selections["magical-path"] as string) !== "mundane" ? 1 : undefined,
},
```

---

### Step 5: Skills (Knowledge & Language)

**Current State:** `SkillsStep.tsx` only handles Active Skills.

**Missing:**

- Knowledge Skills section
  - Academic knowledge (Logic-linked)
  - Interest knowledge (Intuition-linked)
  - Professional knowledge (Logic-linked)
  - Street knowledge (Intuition-linked)
- Language Skills section
  - Native language at 6 (free)
  - Bilingual quality support
  - Max rating 6
- Free points calculation: (Intuition + Logic) × 2
- Skill Specializations
  - Cost 1 skill point
  - Grant +2 dice
  - Cannot apply to skill groups

**Data Model:** Character type already supports these:

```typescript
knowledgeSkills?: KnowledgeSkill[];
languages?: LanguageSkill[];
skillSpecializations?: Record<string, string[]>;
```

---

### Step 6: Gear/Resources

**Current State:** `GearStep.tsx` shows placeholder only.

**Missing:**

- Gear catalog with search/filter
- Shopping cart functionality
- Nuyen budget tracking
- Lifestyle selection with costs:
  - Street (Free)
  - Squatter (500¥)
  - Low (2,000¥)
  - Middle (5,000¥)
  - High (10,000¥)
  - Luxury (100,000¥)
- Metatype lifestyle modifiers (Troll +10%, Dwarf +20%)
- Availability validation (≤12)
- Device Rating validation (≤6)
- Karma-to-Nuyen conversion (max 10 Karma = 20,000¥)
- 5,000¥ carryover limit
- Starting nuyen roll

**Cyberware/Bioware (can be separate step):**

- Essence cost tracking
- Essence loss reduces Magic/Resonance
- Grade selection (Standard/Alpha at creation)
- Augmentation bonus ≤+4 per attribute

---

### Step 7: Leftover Karma

**Current State:** Not implemented. Karma is tracked but can't be spent.

**Missing:**

- Karma management UI
- Contacts creation
  - Free Karma = Charisma × 3
  - Connection rating (1-6)
  - Loyalty rating (1-6)
  - Max 7 Karma per contact
- Karma purchases:
  - Attributes: new rating × 5
  - Active Skills: new rating × 2
  - Knowledge/Language Skills: new rating × 1
  - Skill Groups: new rating × 5
  - Spells: 5 Karma each
  - Complex Forms: 4 Karma each
  - Bound Spirits: 1 Karma per service
  - Registered Sprites: 1 Karma per task
  - Foci bonding: variable
- 7 Karma carryover maximum

---

### Step 8: Final Calculations

**Current State:** Character sheet view calculates some values, but they're not stored during creation.

**Missing Calculations:**

| Stat                     | Formula                             |
| ------------------------ | ----------------------------------- |
| Initiative               | Intuition + Reaction                |
| Physical Limit           | ceil((STR×2 + BOD + REA) / 3)       |
| Mental Limit             | ceil((LOG×2 + INT + WIL) / 3)       |
| Social Limit             | ceil((CHA×2 + WIL + ceil(ESS)) / 3) |
| Physical CM              | ceil(BOD / 2) + 8                   |
| Stun CM                  | ceil(WIL / 2) + 8                   |
| Overflow                 | Body + augmentation bonuses         |
| Astral Initiative        | INT × 2 + 2d6                       |
| Matrix Initiative (Cold) | Data Processing + INT + 3d6         |
| Matrix Initiative (Hot)  | Data Processing + INT + 4d6         |

**Living Persona (Technomancers):**
| Stat | Attribute |
|------|-----------|
| Attack | Charisma |
| Data Processing | Logic |
| Device Rating | Resonance |
| Firewall | Willpower |
| Sleaze | Intuition |

---

## Validation Rules Not Yet Enforced

| Rule                            | Current State   | Required   |
| ------------------------------- | --------------- | ---------- |
| Each Priority (A-E) used once   | ✅ Enforced     | —          |
| One attribute at natural max    | ❌ Not checked  | Block save |
| All attribute points spent      | ⚠️ Warning only | Enforce    |
| All skill points spent          | ⚠️ Warning only | Enforce    |
| Max 25 Karma positive qualities | ✅ Enforced     | —          |
| Max 25 Karma negative qualities | ✅ Enforced     | —          |
| Max 7 Karma carryover           | ❌ Not checked  | Enforce    |
| Max 5,000¥ carryover            | ❌ Not checked  | Enforce    |
| Gear Availability ≤12           | ❌ Not checked  | Enforce    |
| Device Rating ≤6                | ❌ Not checked  | Enforce    |
| Augmentation bonus ≤+4/attr     | ❌ Not checked  | Enforce    |
| Max bound spirits = CHA         | ❌ Not checked  | Enforce    |
| Max registered sprites = CHA    | ❌ Not checked  | Enforce    |
| Max complex forms = LOG         | ❌ Not checked  | Enforce    |
| Max spells = MAG × 2            | ❌ Not checked  | Enforce    |
| Max foci Force = MAG × 2        | ❌ Not checked  | Enforce    |

---

## Recommended Implementation Order

### Phase 1: Core Functionality (High Priority)

1. **Special Attribute Allocation** — Unblocks magical characters
2. **Knowledge/Language Skills** — Required for valid character
3. **Contacts System** — Required for valid character
4. **Final Calculations** — Store derived stats

### Phase 2: Resources (High Priority)

5. **Basic Gear Catalog** — Weapons, armor, commlinks
6. **Nuyen Budget Tracking** — With carryover limits
7. **Lifestyle Selection** — With metatype modifiers

### Phase 3: Karma & Magic (Medium Priority)

8. **Leftover Karma Step** — Full Karma spending UI
9. **Spell Selection** — For Magicians/Mystic Adepts
10. **Complex Forms** — For Technomancers
11. **Skill Specializations** — 1 point = +2 dice

### Phase 4: Validation & Polish (Medium Priority)

12. **Enforce All Validation Rules** — Block invalid characters
13. **Cyberware/Bioware System** — With Essence tracking
14. **Adept Powers** — Power Point allocation

---

## File References

| Component       | File                                                        |
| --------------- | ----------------------------------------------------------- |
| Creation Wizard | `app/characters/create/components/CreationWizard.tsx`       |
| Priority Step   | `app/characters/create/components/steps/PriorityStep.tsx`   |
| Metatype Step   | `app/characters/create/components/steps/MetatypeStep.tsx`   |
| Attributes Step | `app/characters/create/components/steps/AttributesStep.tsx` |
| Magic Step      | `app/characters/create/components/steps/MagicStep.tsx`      |
| Skills Step     | `app/characters/create/components/steps/SkillsStep.tsx`     |
| Qualities Step  | `app/characters/create/components/steps/QualitiesStep.tsx`  |
| Gear Step       | `app/characters/create/components/steps/GearStep.tsx`       |
| Review Step     | `app/characters/create/components/steps/ReviewStep.tsx`     |
| Character Types | `lib/types/character.ts`                                    |
| Creation Types  | `lib/types/creation.ts`                                     |
| SR5 Rules Docs  | `docs/rules/5e/character-creation.md`                       |

---

_This document should be updated as gaps are addressed. Mark items as complete by changing their status in the tables above._
