# Software & Programs Specification

## Overview

This document captures requirements and design considerations for adding software/program purchasing to character creation. Software encompasses a variety of digital tools, utilities, and skillsofts that characters can acquire.

## Program Categories

### 1. CyberPrograms (Cyberdeck Only)

Programs that run exclusively on cyberdecks. Cyberdecks have limited program slots (1-6 depending on model).

#### Common Programs

General-purpose Matrix utilities. Legal and widely available.

| Program         | Cost | Availability | Effect                                                                 |
| --------------- | ---- | ------------ | ---------------------------------------------------------------------- |
| Browse          | 80¥  | 2            | +2 Matrix Search                                                       |
| Configurator    | 80¥  | 2            | Swap cyberdeck array once/turn for free                                |
| Edit            | 80¥  | 2            | +2 Edit File                                                           |
| Encryption      | 80¥  | 2            | +1 Firewall                                                            |
| Search          | 80¥  | 2            | Negate -2 penalty for Matrix search without index                      |
| Signal Scrub    | 80¥  | 2            | +2 to defense vs Trace User                                            |
| Toolbox         | 80¥  | 2            | +1 Data Processing                                                     |
| Virtual Machine | 80¥  | 2            | Run 2 extra programs; take 1 unresisted Matrix damage when one crashes |

#### Hacking Programs

Offensive and defensive programs for Matrix operations. All restricted.

| Program                                | Cost | Availability | Legality   |
| -------------------------------------- | ---- | ------------ | ---------- |
| Armor, Baby Monitor, Biofeedback, etc. | 250¥ | 4            | Restricted |

**19 hacking programs in catalog** - see `data/editions/sr5/core-rulebook.json` for full list.

### 2. Autosofts (RCC or Vehicle/Drone Only)

Already implemented in rigging system. Run on RCCs or directly on vehicles/drones.

| Autosoft | Cost          | Availability |
| -------- | ------------- | ------------ |
| Various  | 500¥ × Rating | 2 × Rating   |

**Status:** ✅ Already surfaced in VehiclesCard

### 3. Data Software (Commlink/Cyberdeck)

Consumer utility software. No special requirements beyond having a device.

| Software  | Cost       | Availability | Notes                                        |
| --------- | ---------- | ------------ | -------------------------------------------- |
| Datasoft  | 120¥       | 4            | Reference info on a single subject           |
| Mapsoft   | 100¥       | 4            | Detailed maps of a specific area             |
| Shopsoft  | 150¥       | 4            | Shopping catalogs and price comparisons      |
| Tutorsoft | Rating × ? | Rating × ?   | Interactive instruction program (Rating 1-6) |

**Question:** What are Tutorsoft cost/availability formulas?

### 4. BTL Programs (Commlink with Hot-Sim OR Chip + Reader)

Better-Than-Life illegal simsense programs. Consumable, single-use.

| Type       | Cost | Availability | Legality  |
| ---------- | ---- | ------------ | --------- |
| Dreamchip  | 20¥  | 4            | Forbidden |
| Moodchip   | 50¥  | 4            | Forbidden |
| Personafix | 200¥ | 4            | Forbidden |
| Tripchip   | 100¥ | 4            | Forbidden |

**Format Options:**

- **Chip format:** Requires modified simsense deck with hot-sim, OR skilljack/datajack for direct-input
- **Download format:** Requires commlink with modified hot-sim module

**Characteristics:**

- Consumable (single-use, self-erasing)
- Psychological addiction type
- All Forbidden legality

**Status:** ❌ Not in catalog - needs to be added

### 5. Skillsofts (Requires Cyberware)

Software that provides skill capabilities. Requires specific cyberware to function.

#### Activesoft

| Attribute       | Value                                         |
| --------------- | --------------------------------------------- |
| Rating          | 1-6                                           |
| Cost            | ? (per rating)                                |
| Availability    | ?                                             |
| **Requirement** | Skillwires OR Skilljack with Active Hardwires |

Provides active skill at software rating (capped by skillwires rating).

#### Knowsoft

| Attribute       | Value                            |
| --------------- | -------------------------------- |
| Rating          | 1-6                              |
| Cost            | ? (per rating)                   |
| Availability    | ?                                |
| **Requirement** | Skilljack OR Knowledge Hardwires |

Provides knowledge skill at software rating.

#### Linguasoft

| Attribute       | Value                                                   |
| --------------- | ------------------------------------------------------- |
| Rating          | 1-6                                                     |
| Cost            | ? (per rating)                                          |
| Availability    | ?                                                       |
| **Requirement** | Skilljack OR Knowledge Hardwires OR Translat-Ear (gear) |

Provides language at software rating.

---

## Current State in Codebase

### Catalog Data (core-rulebook.json)

| Category         | Location                                           | Status                         |
| ---------------- | -------------------------------------------------- | ------------------------------ |
| Common Programs  | `programs.common`                                  | ✅ Data exists                 |
| Hacking Programs | `programs.hacking`                                 | ✅ Data exists                 |
| Autosofts        | `gear.autosofts`                                   | ✅ Data exists, UI implemented |
| Data Software    | `programs.datasofts/mapsofts/shopsofts/tutorsofts` | ✅ Data exists                 |
| BTL Programs     | -                                                  | ❌ Missing                     |
| Skillsofts       | `programs.skillsofts`                              | ✅ Data exists                 |

### UI Components

| Component      | Programs Supported                       |
| -------------- | ---------------------------------------- |
| MatrixGearCard | Commlinks, Cyberdecks only (no programs) |
| VehiclesCard   | Autosofts ✅                             |
| GearPanel      | No software categories                   |

### Type Definitions

- `GearCatalogData` in `RulesetContext.tsx` does NOT include program categories
- No hooks exist for accessing programs (e.g., `usePrograms()`)

---

## Open Questions

### Data Questions

1. **Tutorsoft pricing:** What is the cost/availability formula per rating?
2. **Skillsoft pricing:** What are the cost/availability formulas for Activesoft, Knowsoft, Linguasoft?
3. **BTL addiction mechanics:** Do we need to track addiction during character creation, or is this a gameplay concern?

### Design Questions

1. **Program slot tracking:** Should we enforce cyberdeck program slot limits during creation, or is that a runtime concern?
2. **Cyberware validation:** Should purchasing an Activesoft validate that the character has Skillwires? Options:
   - Hard block (can't purchase without cyberware)
   - Soft warning (can purchase, show warning)
   - No validation (purchase freely, runtime concern)
3. **Device assignment:** Do programs need to be assigned to a specific device during creation, or just purchased as inventory?
4. **BTL classification:** Are BTLs gear (consumables) or software? Affects where they appear in UI.

---

## Proposed Approaches

### Approach A: Programs as Device Modifications

Treat programs like armor mods - installed onto a specific device.

**Pros:**

- Clear association between program and device
- Natural fit for program slot limits on cyberdecks
- Consistent with existing mod pattern (ArmorModificationModal)

**Cons:**

- More complex UX (select device, then add programs)
- Awkward for skillsofts (they're used via cyberware, not "installed" on a device per se)
- Data software doesn't really need device tracking

**Implementation:**

1. Add "Manage Programs" button to commlink/cyberdeck rows
2. Open modal showing compatible programs
3. Track `loadedPrograms` array on device (already exists on `CharacterCyberdeck`)

### Approach B: Programs in Gear Panel

Add software categories to the general Gear purchase flow.

**Pros:**

- Simple, consistent with other purchasable items
- Low implementation effort
- Programs are just inventory items

**Cons:**

- No device association
- No program slot validation
- Mixes physical gear with software

**Implementation:**

1. Add `usePrograms()` hook to RulesetContext
2. Add "Software" category to GearPurchaseModal
3. Store in `state.selections.programs`

### Approach C: Hybrid Approach

Different treatment based on program type:

| Category                       | Treatment            | Location                                           |
| ------------------------------ | -------------------- | -------------------------------------------------- |
| CyberPrograms (Common/Hacking) | Device mods          | MatrixGearCard → Cyberdeck row → "Programs" button |
| Data Software                  | Gear items           | GearPanel (new "Software" category)                |
| Skillsofts                     | Gear with validation | GearPanel with cyberware prerequisite warnings     |
| BTLs                           | Consumable gear      | GearPanel (new "BTL/Consumables" category)         |
| Autosofts                      | Device mods          | VehiclesCard (already implemented)                 |

**Pros:**

- Each category handled appropriately for its nature
- CyberPrograms get slot tracking where it matters
- Simpler treatment for utility software

**Cons:**

- More complex to implement (multiple integration points)
- Users need to look in different places for different software

### Approach D: Dedicated Software Card

New creation card specifically for all software types.

**Pros:**

- Single location for all software purchasing
- Can show cyberware/device prerequisites clearly
- Room for future expansion

**Cons:**

- Another card in an already busy creation flow
- May duplicate some device-selection UI
- Separates programs from their host devices

---

## Recommended Approach

**Hybrid (Approach C)** with phased implementation:

### Phase 1: CyberPrograms on Cyberdecks

- Add "Programs" button to cyberdeck rows in MatrixGearCard
- Modal to select Common and Hacking programs
- Enforce program slot limits
- Store in `cyberdeck.loadedPrograms`

### Phase 2: Data Software in Gear

- Add "Software" category to GearPurchaseModal
- Include Datasoft, Mapsoft, Shopsoft, Tutorsoft
- Simple purchase, no device assignment
- Store in `state.selections.software`

### Phase 3: Skillsofts with Validation

- Add to Gear or dedicated section
- Show warnings if cyberware prerequisites not met
- Store in `state.selections.skillsofts`

### Phase 4: BTLs (if desired)

- Add BTL data to catalog
- Add to Gear as consumables or dedicated "vice" category
- Track as inventory items

---

## Data Schema Additions Needed

### BTL Catalog Entry (to add)

```json
{
  "btl": [
    {
      "id": "dreamchip",
      "name": "Dreamchip",
      "category": "btl",
      "cost": 20,
      "availability": 4,
      "legality": "forbidden",
      "format": ["chip", "download"],
      "description": "Standard simsense recordings modified for BTL output.",
      "addictionType": "psychological",
      "page": 411,
      "source": "Core"
    }
  ]
}
```

### CharacterProgram Type (new)

```typescript
interface CharacterProgram {
  id: string;
  catalogId: string;
  name: string;
  category: "common" | "hacking" | "data" | "skillsoft" | "btl";
  cost: number;
  rating?: number;
  // For skillsofts
  skillId?: string;
  skillName?: string;
}
```

### Updated CharacterCyberdeck

```typescript
interface CharacterCyberdeck {
  // ... existing fields
  loadedPrograms: CharacterProgram[]; // Already exists, ensure it's used
}
```

---

## Next Steps

1. Confirm approach with stakeholder
2. Gather missing pricing data (Tutorsoft, Skillsofts)
3. Add BTL data to catalog
4. Create implementation plan with task breakdown
