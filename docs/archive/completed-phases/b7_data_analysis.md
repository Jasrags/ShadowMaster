# B7 Data Analysis: Complex Forms & Matrix

**Date:** January 2025  
**Purpose:** Comprehensive analysis of existing data vs. B7 requirements for Complex Forms & Matrix implementation

---

## B7 Phase Overview

**Objective:** Enhanced technomancer support with full complex forms catalog and Living Persona mechanics.

**Tasks:**

- B7.1.1: Expand complex forms catalog (~30 forms) with ComplexForm interface, categorization, and threading rules
- B7.1.2: Implement Living Persona calculations and display (Matrix attributes, Matrix Initiative)

---

## 1. Complex Forms Data Analysis

### Current State

**Location:** `/data/editions/sr5/core-rulebook.json` (lines 2215-2328)

**Existing Forms:** 14 complex forms

| ID                | Name                            | Target  | Duration  | Fading (Current) | Status                |
| ----------------- | ------------------------------- | ------- | --------- | ---------------- | --------------------- |
| cleaner           | Cleaner                         | persona | permanent | L-2              | ✅ Exists             |
| diffusion         | Diffusion of [Matrix Attribute] | device  | sustained | L-1              | ✅ Exists             |
| editor            | Editor                          | file    | permanent | L-2              | ✅ Exists             |
| infusion          | Infusion of [Matrix Attribute]  | device  | sustained | L-1              | ✅ Exists             |
| primed-charge     | Primed Charge                   | self    | sustained | L-2              | ✅ Exists\*           |
| puppeteer         | Puppeteer                       | device  | immediate | L+1              | ⚠️ FV mismatch        |
| pulse-storm       | Pulse Storm                     | device  | immediate | L+1              | ⚠️ FV/Target mismatch |
| resonance-channel | Resonance Channel               | sprite  | sustained | L-1              | ⚠️ Target mismatch    |
| resonance-spike   | Resonance Spike                 | persona | immediate | L-1              | ⚠️ FV/Target mismatch |
| resonance-veil    | Resonance Veil                  | device  | sustained | L-1              | ✅ Exists             |
| static-veil       | Static Veil                     | self    | sustained | L-2              | ⚠️ FV mismatch        |
| stitches          | Stitches                        | sprite  | permanent | L                | ⚠️ FV mismatch        |
| transcendent-grid | Transcendent Grid               | self    | sustained | L-1              | ⚠️ FV mismatch        |
| tattletale        | Tattletale                      | device  | permanent | L-2              | ⚠️ Target mismatch    |

\*Note: Primed Charge is not in the source document provided, may be from errata or different source.

### Required Corrections (Based on Source Data)

| Form              | Current FV | Correct FV | Current Target | Correct Target | Action Needed      |
| ----------------- | ---------- | ---------- | -------------- | -------------- | ------------------ |
| cleaner           | L-2        | **L+1**    | persona        | persona        | ✅ Fix FV          |
| editor            | L-2        | **L+2**    | file           | file           | ✅ Fix FV          |
| puppeteer         | L+1        | **L+4**    | device         | device         | ✅ Fix FV          |
| pulse-storm       | L+1        | **L+0**    | device         | **persona**    | ✅ Fix FV & Target |
| resonance-channel | L-1        | L-1        | sprite         | **device**     | ✅ Fix Target      |
| resonance-spike   | L-1        | **L+0**    | persona        | **device**     | ✅ Fix FV & Target |
| static-veil       | L-2        | **L-1**    | self           | self           | ✅ Fix FV          |
| stitches          | L          | **L-2**    | sprite         | sprite         | ✅ Fix FV          |
| transcendent-grid | L-1        | **L-3**    | self           | self           | ✅ Fix FV          |
| tattletale        | L-2        | L-2        | device         | **persona**    | ✅ Fix Target      |

### Missing Forms

| Form        | Target | Duration  | Fading | Description Source            |
| ----------- | ------ | --------- | ------ | ----------------------------- |
| static-bomb | Self   | immediate | L+2    | From provided source document |

### Forms Mentioned in Reference Docs (Missing from Current Data)

From `docs/web_pages/SR5_Matrix_Complex_Forms.md`:

- Coriolis
- Derezz
- FAQ
- IC Tray
- Misread Marks
- Redundancy

**Status:** These 6 forms are mentioned but no data provided yet. Need to research or obtain from sourcebooks.

### Gap Analysis

**Target:** ~30 complex forms total

**Current Status:**

- ✅ Have: 14 forms (with corrections needed)
- ❌ Missing: 1 form (Static Bomb - have data)
- ❓ Unknown: 6 forms (mentioned but no data)
- **Total Known:** 21 forms
- **Gap:** ~9 forms to reach 30

**Recommended Approach:**

1. **Phase 1 (Immediate):** Implement with 15-20 forms
   - Fix existing 14 forms
   - Add Static Bomb (15 forms)
   - Research/add the 6 mentioned forms if data available (21 forms)
2. **Phase 2 (Future):** Expand to 30+ forms via sourcebooks:
   - Data Trails
   - Kill Code
   - Chrome Flesh
   - Other Matrix-focused sourcebooks

---

## 2. Sprites Data Analysis

### Current State

**Status:** ❌ **NO SPRITE DATA EXISTS**

**Character Interface:** Has `spirits?: BoundSpirit[]` field but no sprite-specific structure.

**Ruleset:** No sprite catalog in ruleset data.

### Required Data (From Provided Image)

Five sprite types with full statistics:

#### 1. Courier Sprite

- **Attack:** L
- **Sleaze:** L + 3
- **Data Processing:** L + 1
- **Firewall:** L + 2
- **Initiative:** (L × 2) + 1
- **Initiative Dice:** 4D6
- **Resonance:** L
- **Skills:** Computer, Hacking
- **Powers:** Cookie, Hash

#### 2. Crack Sprite

- **Attack:** L
- **Sleaze:** L + 3
- **Data Processing:** L + 2
- **Firewall:** L + 1
- **Initiative:** (L × 2) + 2
- **Initiative Dice:** 4D6
- **Resonance:** L
- **Skills:** Computer, Electronic Warfare, Hacking
- **Powers:** Suppression

#### 3. Data Sprite

- **Attack:** L - 1
- **Sleaze:** L
- **Data Processing:** L + 4
- **Firewall:** L + 1
- **Initiative:** (L × 2) + 4
- **Initiative Dice:** 4D6
- **Resonance:** L
- **Skills:** Computer, Electronic Warfare
- **Powers:** Camouflage, Watermark

#### 4. Fault Sprite

- **Attack:** L + 3
- **Sleaze:** L
- **Data Processing:** L + 1
- **Firewall:** L + 2
- **Initiative:** (L × 2) + 1
- **Initiative Dice:** 4D6
- **Resonance:** L
- **Skills:** Computer, Cybercombat, Hacking
- **Powers:** Electron Storm

#### 5. Machine Sprite

- **Attack:** L + 1
- **Sleaze:** L
- **Data Processing:** L + 3
- **Firewall:** L + 2
- **Initiative:** (L × 2) + 3
- **Initiative Dice:** 4D6
- **Resonance:** L
- **Skills:** Computer, Electronic Warfare, Hardware
- **Powers:** Diagnostics, Gremlins, Stability

### Implementation Requirements

**Data Structure Needed:**

```typescript
interface SpriteTypeData {
  id: string;
  name: string;
  attributes: {
    attack: string; // Formula with L (e.g., "L", "L+3", "L-1")
    sleaze: string;
    dataProcessing: string;
    firewall: string;
  };
  initiative: {
    formula: string; // e.g., "(L × 2) + 1"
    dice: number; // e.g., 4
  };
  resonance: string; // Usually "L"
  skills: string[]; // Array of skill IDs
  powers: string[]; // Array of sprite power IDs
}
```

**Integration Points:**

- Add to `/lib/types/edition.ts` as `SpriteTypeData`
- Add sprite catalog to ruleset JSON structure
- Extract via `/lib/rules/loader.ts`
- Add hook `useSpriteTypes()` to `/lib/rules/RulesetContext.tsx`
- Add to API route `/app/api/rulesets/[editionCode]/route.ts`

**Sprite Powers Data:**

- Need to define sprite power interfaces (Cookie, Hash, Suppression, Camouflage, Watermark, Electron Storm, Diagnostics, Gremlins, Stability)
- Reference: `docs/web_pages/SR5_Matrix_Sprite_Powers.md` may have details

---

## 3. Echoes Data Analysis

### Current State

**Status:** ❌ **NO ECHOES DATA EXISTS**

### Required Data (From Provided Source)

Echoes are technomancer submersion powers. Each grade of Submersion grants one echo.

**Echo Types:**

1. **Attack Upgrade**
   - Effect: Attack rating of living persona increases by 1
   - Max Uses: 2 (bonuses stack)

2. **Data Processing Upgrade**
   - Effect: Data Processing rating of living persona increases by 1
   - Max Uses: 2 (bonuses stack)

3. **Firewall Upgrade**
   - Effect: Firewall rating of living persona increases by 1
   - Max Uses: 2 (bonuses stack)

4. **Mind over Machine**
   - Effect: Benefit of Rating 1 control rig
   - Max Uses: 3 (rating increases by 1 each time: R1, R2, R3)

5. **NeuroFilter**
   - Effect: +1 dice pool bonus to resist biofeedback damage
   - Max Uses: 2 (bonuses stack)

6. **Overclocking**
   - Effect: Additional +1D6 while in hot-sim VR
   - Max Uses: 1

7. **Resonance Link**
   - Effect: One-way empathic link with another technomancer (if both take, becomes two-way)
   - Max Uses: 1

8. **Resonance [Program]**
   - Effect: Mimic effects of one common or hacking program
   - Max Uses: Multiple (each time for different program)
   - Must specify program when taken

9. **Sleaze Upgrade**
   - Effect: Sleaze rating of living persona increases by 1
   - Max Uses: 2 (bonuses stack)

### Implementation Requirements

**Data Structure Needed:**

```typescript
interface EchoData {
  id: string;
  name: string;
  description: string;
  effect: string;
  maxUses: number; // -1 if unlimited (like Resonance [Program])
  stacking?: boolean; // Whether bonuses stack
  requiresSpecification?: boolean; // For Resonance [Program]
  specificationType?: string; // What needs to be specified
}
```

**Note:** Echoes are post-creation advancement features (from Submersion), not character creation features. May be out of scope for B7 but should be tracked for future implementation.

---

## 4. Living Persona Calculations

### Current State

**Status:** ❌ **NOT IMPLEMENTED**

### Required Calculations

Living Persona attributes for technomancers are calculated as:

- **Attack:** Logic
- **Sleaze:** Intuition
- **Data Processing:** Logic
- **Firewall:** Willpower

**Matrix Initiative:**

- Formula: (Data Processing × 2) + Reaction + Intuition
- Dice: 4D6 (or 5D6 in hot-sim VR)

### Implementation Requirements

**Files to Modify:**

- `/app/characters/create/components/steps/ReviewStep.tsx` - Display Living Persona attributes
- `/lib/types/character.ts` - May need to store calculated values
- Derived stats calculation logic - Add Matrix Initiative calculation

**Requirements:**

- Detect technomancer character (resonanceRating > 0)
- Calculate Matrix attributes from character attributes
- Display in ReviewStep for technomancers
- Calculate Matrix Initiative
- Account for Echo upgrades (if echoes system implemented)

---

## 5. Missing Data Summary

### Critical Missing Data (Required for B7)

| Category           | Item                         | Status     | Priority |
| ------------------ | ---------------------------- | ---------- | -------- |
| **Complex Forms**  | Static Bomb                  | ❌ Missing | 🔴 High  |
| **Complex Forms**  | FV Corrections (7 forms)     | ⚠️ Wrong   | 🔴 High  |
| **Complex Forms**  | Target Corrections (4 forms) | ⚠️ Wrong   | 🔴 High  |
| **Sprites**        | Sprite catalog (5 types)     | ❌ Missing | 🔴 High  |
| **Sprites**        | Sprite powers definitions    | ❌ Missing | 🔴 High  |
| **Living Persona** | Calculation logic            | ❌ Missing | 🔴 High  |
| **Living Persona** | Display in ReviewStep        | ❌ Missing | 🔴 High  |

### Optional/Enhancement Data (Nice to Have)

| Category          | Item                                                                          | Status     | Priority  |
| ----------------- | ----------------------------------------------------------------------------- | ---------- | --------- |
| **Complex Forms** | 6 mentioned forms (Coriolis, Derezz, FAQ, IC Tray, Misread Marks, Redundancy) | ❓ Unknown | 🟡 Medium |
| **Complex Forms** | Additional 9 forms to reach 30                                                | ❓ Unknown | 🟢 Low    |
| **Echoes**        | Echo system (post-creation)                                                   | ❌ Missing | 🟢 Low    |

---

## 6. Implementation Checklist

### Phase 1: Data Corrections & Core Additions

- [ ] Fix 7 complex form Fading Values
- [ ] Fix 4 complex form Targets
- [ ] Add Static Bomb complex form
- [ ] Create SpriteTypeData interface
- [ ] Add 5 sprite types to ruleset JSON
- [ ] Create sprite powers data structure
- [ ] Add sprite powers to ruleset (Cookie, Hash, Suppression, etc.)
- [ ] Implement sprite extraction in loader.ts
- [ ] Add useSpriteTypes() hook

### Phase 2: Living Persona

- [ ] Create Living Persona calculation function
- [ ] Add Matrix Initiative calculation
- [ ] Display Living Persona in ReviewStep
- [ ] Test with technomancer character creation

### Phase 3: Complex Forms UI (B7.1.1)

- [ ] Verify ComplexForm interface supports all needed fields
- [ ] Ensure categorization exists (if needed)
- [ ] Verify threading rules are documented/stored
- [ ] Complete Complex Forms step (already exists in KarmaStep, may need review)

### Phase 4: Future Enhancements

- [ ] Research and add 6 missing complex forms (if data available)
- [ ] Expand to 30+ forms via sourcebooks
- [ ] Implement Echoes system (post-creation feature)
- [ ] Add sprite compilation/binding mechanics

---

## 7. Files That Need Modification

### Data Files

- `/data/editions/sr5/core-rulebook.json`
  - Fix complex forms data
  - Add Static Bomb
  - Add sprite catalog section
  - Add sprite powers section

### Type Definitions

- `/lib/types/edition.ts`
  - Add `SpriteTypeData` interface
  - Add `SpritePowerData` interface (if separate)
  - Add `EchoData` interface (future)

- `/lib/types/character.ts`
  - Verify `BoundSpirit` handles sprites or add separate sprite field
  - Add Living Persona calculated attributes (or compute on-the-fly)

### Ruleset Loading

- `/lib/rules/loader.ts`
  - Add `extractSpriteTypes()` function
  - Add `extractSpritePowers()` function (if needed)

- `/lib/rules/RulesetContext.tsx`
  - Add sprite types to `RulesetData` interface
  - Add `useSpriteTypes()` hook
  - Add `useSpritePowers()` hook (if needed)

### API

- `/app/api/rulesets/[editionCode]/route.ts`
  - Add spriteTypes to response
  - Add spritePowers to response (if needed)

### UI Components

- `/app/characters/create/components/steps/ReviewStep.tsx`
  - Add Living Persona display section for technomancers
  - Display Matrix Initiative

---

## 8. Data Sources Used

1. **Complex Forms:** Core Rulebook source document (user provided)
2. **Sprites:** Sprite statistics table (user provided image)
3. **Echoes:** Resonance Library document (user provided)
4. **Reference Docs:**
   - `docs/web_pages/SR5_Matrix_Complex_Forms.md`
   - `docs/rules/5e/game-mechanics/matrix.md`

---

## 9. Next Steps Recommendation

### Immediate (B7 Implementation)

1. ✅ Mark M0 as complete (done)
2. 🔜 Update complex forms data (fix FVs, targets, add Static Bomb)
3. 🔜 Add sprite catalog with 5 sprite types
4. 🔜 Add sprite powers definitions
5. 🔜 Implement Living Persona calculations
6. 🔜 Update ReviewStep to display Living Persona

### Short-term (Complete B7.1)

1. Test complex forms selection in character creation
2. Verify sprite data displays correctly (if UI needed)
3. Test Living Persona calculations
4. Complete acceptance criteria checklist

### Long-term (Post-B7)

1. Research and add missing 6 complex forms
2. Expand complex forms catalog to 30+ via sourcebooks
3. Implement Echoes system (post-creation advancement)
4. Add sprite compilation/binding UI

---

**Document Status:** ✅ Complete  
**Last Updated:** January 2025  
**Next Review:** After B7.1.1 implementation
