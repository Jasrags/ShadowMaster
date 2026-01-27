# Software & Programs Specification

## Overview

This document captures requirements and design considerations for adding software purchasing to the Matrix Gear card in character creation. Software encompasses a variety of digital tools, utilities, cyberprograms, and skillsofts that characters can acquire.

Software can be purchased as an online download or less commonly on chip from physical stores. Datasofts, mapsofts, shopsofts, and tutorsofts can be easily stored and accessed on a commlink, dataterminal, or cyberdeck.

---

## Software Categories

### 1. Data Software (Commlink/Cyberdeck)

Consumer utility software. No special requirements beyond having a device.

| Software               | Cost          | Availability | Effect                                              |
| ---------------------- | ------------- | ------------ | --------------------------------------------------- |
| Datasoft               | 120¥          | 4            | +1 Mental limit on related Knowledge Skill Tests    |
| Mapsoft                | 100¥          | 4            | +1 limit bonus to Navigation Tests for covered area |
| Shopsoft               | 150¥          | 4            | +1 Social limit for Availability/Negotiation tests  |
| Tutorsoft (Rating 1–6) | Rating × 400¥ | Rating       | Makes Instruction Tests with dice pool = Rating × 2 |

**Implementation Notes:**

- **Datasoft, Mapsoft, Shopsoft**: Require "Specific Details" free-form text input (e.g., "Datasoft - 18th Century Poetry", "Mapsoft - Downtown Seattle", "Shopsoft - Firearms")
- **Tutorsoft**: Requires skill selection (cannot be Magic or Resonance-based skills)

#### Detailed Descriptions

**Datasofts:** Encompass a wide variety of information files, databases containing information on everything from hydraulic fracturing to 18th century romantic poetry. An appropriate datasoft gives you a +1 bonus to your Mental limit on related Knowledge Skill Tests.

**Mapsofts:** Feature detailed information about a particular area, from streets to business/residential listings to topographical, census, GPS and environmental data. An interactive interface allows you to quickly determine the best routes and directions, locate the nearest spot of your choice, or create your own customized maps. If a wireless link is maintained, the map automatically self-updates with the latest data from GridGuide. Provides a +1 limit bonus to Navigation Tests made to navigate the area they cover.

**Shopsofts:** Shopping apps like Clothes Horse, Caveat Emptour, and Guns Near Me provide pricing breakdowns and user reviews for comparison shopping purposes, both for standard goods and black market purchases. Shopsofts self-update regularly to stay current. An appropriate shopsoft provides a +1 bonus to your Social limit for all Availability and Negotiation tests you make to buy and sell those items.

**Tutorsofts:** Virtual private tutors that aid you in learning a specific skill. The tutorsoft makes Instruction Tests with a dice pool equal to its Rating × 2. Tutorsofts cannot teach skills based on Magic or Resonance.

---

### 2. CyberPrograms (Cyberdeck Only)

Programs that run exclusively on cyberdecks. Cyberdecks have limited program slots (1-6 depending on model). You can't run more than one program of the same type on your deck at once.

#### Common Programs

General-purpose Matrix utilities. Legal and widely available.

| Program         | Cost | Avail | Effect                                                                      |
| --------------- | ---- | ----- | --------------------------------------------------------------------------- |
| Browse          | 80¥  | —     | Cuts Matrix Search time in half                                             |
| Configurator    | 80¥  | —     | Store an alternate deck config; switch to it when reconfiguring             |
| Edit            | 80¥  | —     | +2 to Data Processing limit for Edit tests                                  |
| Encryption      | 80¥  | —     | +1 Firewall                                                                 |
| Signal Scrub    | 80¥  | —     | Rating 2 noise reduction                                                    |
| Toolbox         | 80¥  | —     | +1 Data Processing                                                          |
| Virtual Machine | 80¥  | —     | Run 2 additional programs; take 1 extra unresistable Matrix damage when hit |

#### Hacking Programs

Offensive and defensive programs for Matrix operations. All Restricted (R) legality.

| Program            | Cost | Avail | Effect                                                                           |
| ------------------ | ---- | ----- | -------------------------------------------------------------------------------- |
| Armor              | 250¥ | 6R    | +2 dice pool modifier to resist Matrix damage                                    |
| Baby Monitor       | 250¥ | 6R    | Always know your current Overwatch Score                                         |
| Biofeedback        | 250¥ | 6R    | Matrix damage also deals equal Stun/Physical biofeedback damage                  |
| Biofeedback Filter | 250¥ | 6R    | +2 dice pool modifier to resist biofeedback damage                               |
| Blackout           | 250¥ | 6R    | Matrix damage also deals equal Stun biofeedback (regardless of sim mode)         |
| Decryption         | 250¥ | 6R    | +1 Attack attribute                                                              |
| Defuse             | 250¥ | 6R    | +4 dice pool modifier to resist Data Bomb damage                                 |
| Demolition         | 250¥ | 6R    | +1 to rating of Data Bombs you set                                               |
| Exploit            | 250¥ | 6R    | +2 Sleaze attribute when attempting Hack on the Fly                              |
| Fork               | 250¥ | 6R    | Perform a single Matrix action on two targets                                    |
| Guard              | 250¥ | 6R    | Reduce extra damage from marks by 1 DV per mark                                  |
| Hammer             | 250¥ | 6R    | +2 DV Matrix damage when you cause damage with an action                         |
| Lockdown           | 250¥ | 6R    | Damaged personas are link-locked until program stops or they Jack Out            |
| Mugger             | 250¥ | 6R    | +1 DV per mark bonus damage                                                      |
| Shell              | 250¥ | 6R    | +1 dice pool to resist Matrix and biofeedback damage (stacks)                    |
| Sneak              | 250¥ | 6R    | +2 dice pool vs Trace User; demiGOD convergence doesn't reveal physical location |
| Stealth            | 250¥ | 6R    | +1 Sleaze attribute                                                              |
| Track              | 250¥ | 6R    | +2 Data Processing for Trace User, OR negates Sneak's +2 (one benefit only)      |
| Wrapper            | 250¥ | 6R    | Icons can appear as anything via Change Icon; requires Matrix Perception to see  |

---

### 3. Agents (Cyberdeck Only)

Autonomous programs rated 1-6 that can perform Matrix actions on your behalf.

| Rating | Availability | Cost    |
| ------ | ------------ | ------- |
| 1      | 3            | 1,000¥  |
| 2      | 6            | 2,000¥  |
| 3      | 9            | 3,000¥  |
| 4      | 12           | 8,000¥  |
| 5      | 15           | 10,000¥ |
| 6      | 18           | 12,000¥ |

**Agent Characteristics:**

- Each agent occupies one program slot on your deck
- Uses device's Matrix attributes and agent's rating for skill tests
- Has Computer, Hacking, and Cybercombat skills equal to its rating
- Has its own persona and icon when running
- Attacks on an agent damage the device running it (shares Matrix Condition Monitor)
- About as smart as a pilot program of the same rating

---

### 4. Skillsofts (Requires Cyberware)

Software that provides skill capabilities. Requires specific cyberware to function. Tests made with a skillsoft may not be boosted with Edge in any way.

| Skillsoft               | Cost            | Availability | Requirement               |
| ----------------------- | --------------- | ------------ | ------------------------- |
| Activesoft (Rating 1–6) | Rating × 5,000¥ | 8            | Skillwires                |
| Knowsoft (Rating 1–6)   | Rating × 2,000¥ | 4            | Skilljack                 |
| Linguasoft (Rating 1–6) | Rating × 1,000¥ | 2            | Skilljack OR Translat-Ear |

**Implementation Notes:**

- **Activesoft**: Requires skill selection (active skills only, not Magic or Resonance-based)
- **Knowsoft**: Requires knowledge skill selection
- **Linguasoft**: Requires language selection

#### Detailed Descriptions

**Activesofts:** Replace physical active skills (every Active skill not based on Magic or Resonance). A skillwire system is needed to translate the 'softs into usable muscle memory. The number of skills usable at once is limited by the skillwires rating.

**Knowsofts:** Replicate Knowledge skills, actively overwriting the user's knowledge with their own data. Must be accessed with a skilljack, and the number usable at once is limited by the skilljack.

**Linguasofts:** Replicate language skills, allowing a user to speak a foreign language by automatically translating signals from the speech cortex. Chipped speech can be awkward and stilted. Must be accessed with a skilljack.

---

### 5. Autosofts (RCC or Vehicle/Drone Only)

Already implemented in rigging system. Run on RCCs or directly on vehicles/drones.

| Autosoft | Cost          | Availability |
| -------- | ------------- | ------------ |
| Various  | Rating × 500¥ | Rating × 2   |

**Status:** ✅ Already surfaced in VehiclesCard

---

### 6. BTL Programs (Commlink with Hot-Sim OR Chip + Reader)

Better-Than-Life illegal simsense programs. Consumable, single-use.

| Type       | Cost | Availability | Legality  |
| ---------- | ---- | ------------ | --------- |
| Dreamchip  | 20¥  | 4            | Forbidden |
| Moodchip   | 50¥  | 4            | Forbidden |
| Personafix | 200¥ | 4            | Forbidden |
| Tripchip   | 100¥ | 4            | Forbidden |

**Implementation Notes:**

- Require "Specific Details" free-form text input (e.g., "Moodchip - Euphoria", "Personafix - Corporate Executive")
- Consumable (single-use, self-erasing)
- Psychological addiction type
- All Forbidden legality

**Format Options:**

- **Chip format:** Requires modified simsense deck with hot-sim, OR skilljack/datajack for direct-input
- **Download format:** Requires commlink with modified hot-sim module

**Status:** ❌ Not in catalog - needs to be added

---

## Current State in Codebase

### Catalog Data (core-rulebook.json)

| Category         | Location              | Status                         |
| ---------------- | --------------------- | ------------------------------ |
| Common Programs  | `programs.common`     | ✅ Data exists (7 programs)    |
| Hacking Programs | `programs.hacking`    | ✅ Data exists (19 programs)   |
| Agents           | `programs.agents`     | ✅ Data exists                 |
| Datasofts        | `programs.datasofts`  | ✅ Data exists                 |
| Mapsofts         | `programs.mapsofts`   | ✅ Data exists                 |
| Shopsofts        | `programs.shopsofts`  | ✅ Data exists                 |
| Tutorsofts       | `programs.tutorsofts` | ✅ Data exists                 |
| Skillsofts       | `programs.skillsofts` | ✅ Data exists                 |
| Autosofts        | `gear.autosofts`      | ✅ Data exists, UI implemented |
| BTL Programs     | -                     | ❌ Missing                     |

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

## Implementation Plan: Phase 1 - Software on Matrix Gear Card

### Scope

Add a new **"Software"** category/section to the Matrix Gear card that allows purchasing:

1. **Data Software** (Datasoft, Mapsoft, Shopsoft, Tutorsoft)
2. **CyberPrograms** (Common and Hacking programs)
3. **Agents**
4. **Skillsofts** (Activesoft, Knowsoft, Linguasoft)

BTLs deferred to a later phase.

### UI Design

The Matrix Gear card will have a new collapsible section for "Software" with subcategories:

```
Matrix Gear Card
├── Commlinks (existing)
├── Cyberdecks (existing)
└── Software (NEW)
    ├── Data Software
    │   ├── Datasofts (with specific details input)
    │   ├── Mapsofts (with specific details input)
    │   ├── Shopsofts (with specific details input)
    │   └── Tutorsofts (with skill selection + rating)
    ├── CyberPrograms
    │   ├── Common Programs
    │   └── Hacking Programs
    ├── Agents (with rating selection)
    └── Skillsofts
        ├── Activesofts (with skill selection + rating)
        ├── Knowsofts (with skill selection + rating)
        └── Linguasofts (with language selection + rating)
```

### Data Schema Additions

#### CharacterSoftware Type (new)

```typescript
interface CharacterSoftware {
  id: string;
  catalogId: string;
  name: string;
  category:
    | "datasoft"
    | "mapsoft"
    | "shopsoft"
    | "tutorsoft"
    | "common"
    | "hacking"
    | "agent"
    | "skillsoft";
  subcategory?: "activesoft" | "knowsoft" | "linguasoft";
  cost: number;
  rating?: number;
  // For datasofts, mapsofts, shopsofts
  specificDetails?: string;
  // For tutorsofts and skillsofts
  skillId?: string;
  skillName?: string;
  // For linguasofts
  languageId?: string;
  languageName?: string;
}
```

#### CreationSelections Update

```typescript
interface CreationSelections {
  // ... existing fields
  software: CharacterSoftware[];
}
```

### Required Changes

1. **RulesetContext.tsx**: Add `usePrograms()` hook to expose program catalog data
2. **MatrixGearCard**: Add Software section with purchase modal
3. **SoftwarePurchaseModal**: New modal for browsing/purchasing software
4. **CreationBudgetContext**: Track software purchases in budget
5. **Character types**: Add software to character data structure

### Validation Rules

| Software Type | Validation                                     |
| ------------- | ---------------------------------------------- |
| Data Software | None (can store on any commlink/cyberdeck)     |
| CyberPrograms | Soft warning if no cyberdeck owned             |
| Agents        | Soft warning if no cyberdeck owned             |
| Skillsofts    | Soft warning if required cyberware not present |

**Note:** "Soft warning" means the purchase is allowed but displays a warning that the item requires specific hardware/cyberware to use.

---

## Open Questions

### Resolved

1. ✅ **Tutorsoft pricing:** Rating × 400¥, Availability = Rating
2. ✅ **Skillsoft pricing:**
   - Activesoft: Rating × 5,000¥, Availability 8
   - Knowsoft: Rating × 2,000¥, Availability 4
   - Linguasoft: Rating × 1,000¥, Availability 2

### Remaining Questions

1. **Program slot tracking:** Should we enforce cyberdeck program slot limits during creation, or is that a runtime concern?
   - **Recommendation:** Runtime concern for now; creation just purchases programs

2. **Device assignment:** Do programs need to be assigned to a specific device during creation, or just purchased as inventory?
   - **Recommendation:** Purchased as inventory; assignment is a runtime concern

3. **BTL classification:** Are BTLs gear (consumables) or software? Affects where they appear in UI.
   - **Recommendation:** Defer BTLs to Phase 2; they're edge-case for character creation

---

## Reference Tables

See also:

- `/docs/data_tables/matrix/software.md` - Software pricing summary
- `/docs/data_tables/matrix/programs_table.md` - Detailed program listings
- `/docs/data_tables/matrix/skillsofts.md` - Skillsoft details
