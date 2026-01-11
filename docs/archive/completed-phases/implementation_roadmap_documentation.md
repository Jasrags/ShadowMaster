# Implementation Roadmap & Documentation — Deliverables

## Priority 1 — Foundation & Data Structures

### 1. TypeScript Data Structures (Schemas)

Copy/paste-ready TypeScript interfaces (concise but extensible). These intentionally use `unknown` in a few places where ruleset JSON blobs will live; replace with more exact types as you implement module schemas.

```ts
// types/core.ts
export type ID = string; // uuid

export interface User {
  id: ID;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  timezone?: string;
  createdAt: string; // ISO
  updatedAt?: string;
  roles: Array<"player" | "gm" | "admin">;
  settings?: Record<string, unknown>;
}

export interface EditionRef {
  id: ID;
  name: string; // "SR5", "SR6", "SR4A", "Anarchy"
  shortCode: string; // "sr5"
  version?: string;
}

export interface Book {
  id: ID;
  editionId: ID;
  title: string;
  abbreviation?: string;
  publisher?: string;
  releaseYear?: number;
  isbn?: string;
  isCore: boolean;
  categories: Array<"core" | "sourcebook" | "adventure" | "mission" | "novel">;
  metadata?: Record<string, unknown>;
  // pointer to payload file (JSON rules)
  payloadRef: string; // path or storage key
  createdAt: string;
}
```

```ts
// types/rules.ts
export type RuleModuleType =
  | "attributes"
  | "skills"
  | "combat"
  | "matrix"
  | "magic"
  | "cyberware"
  | "bioware"
  | "gear"
  | "creationMethods"
  | "limits"
  | "vehicles"
  | "spells"
  | "qualities"
  | "lore";

export interface RuleModule {
  id: ID;
  editionId: ID;
  moduleType: RuleModuleType;
  name?: string;
  description?: string;
  basePayload: Record<string, unknown>; // edition core shape
  version?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RuleOverride {
  id: ID;
  bookId: ID;
  moduleId: ID;
  overridePayload: Record<string, unknown>;
  mergeStrategy: "replace" | "merge" | "append" | "remove";
  reason?: string; // e.g., "errata", "expansion"
  createdAt: string;
}
```

```ts
// types/creation.ts
export interface CreationMethod {
  id: ID;
  editionId: ID;
  bookId?: ID; // optional if created or added by a book
  name: string; // "Priority", "PointBuy", "Life Modules", "Anarchy Cue"
  description?: string;
  version?: string;
  // A structured JSON payload that describes steps, budgets, constraints
  payloadSchemaRef?: string; // pointer to a formal JSON schema for this method
  payload?: Record<string, unknown>;
  createdAt: string;
  deprecated?: boolean;
}
```

```ts
// types/character.ts
export interface Character {
  id: ID;
  ownerId: ID;
  editionId: ID;
  creationMethodId: ID;
  creationMethodVersion?: string;
  name: string;
  metatype?: string;
  attributes: Record<string, number>;
  skills: Record<string, number>;
  qualities?: string[]; // ids or names
  gear?: Array<{ itemId?: ID; name: string; qty?: number; metadata?: Record<string, unknown> }>;
  magicalPath?: {
    type: "mundane" | "mage" | "adept" | "technomancer" | "druid";
    rating?: number;
  } | null;
  resources?: { nuyen: number; essence?: number; edge?: number };
  derived?: Record<string, number>;
  attachedBooks?: ID[]; // books used during creation
  createdAt: string;
  updatedAt?: string;
}
```

```ts
// types/campaign.ts
export interface Campaign {
  id: ID;
  gmId: ID;
  title: string;
  description?: string;
  editionId: ID;
  enabledBookIds: ID[]; // book bundles the GM enabled
  enabledCreationMethodIds?: ID[]; // restrict creation methods
  players: ID[]; // user ids
  createdAt: string;
  updatedAt?: string;
  settings?: {
    visibility: "private" | "invite" | "public";
    allowHomebrew?: boolean;
    allowBookOverrides?: boolean;
  };
}
```

---

### 2. Ruleset bundle JSON specification (structure for book data files)

A recommended normalized JSON structure stored as each book's `payloadRef`. Use `jsonschema` for validation.

Example `book-payload.json` skeleton:

```json
{
  "meta": {
    "bookId": "<uuid>",
    "title": "Run Faster",
    "edition": "sr5",
    "version": "1.0",
    "category": "sourcebook"
  },
  "modules": {
    "attributes": {
      "replace": false,
      "payload": {
        "newAttributes": []
      }
    },
    "skills": {
      "mergeStrategy": "merge",
      "payload": {
        "skills": [{ "id": "vehicledriving", "name": "Vehicle Driving", "group": "vehicle" }]
      }
    },
    "creationMethods": {
      "append": true,
      "payload": {
        "creationMethods": [
          {
            "id": "life-modules",
            "name": "Life Modules",
            "version": "1.0",
            "payload": {
              /* full creation method descriptor */
            }
          }
        ]
      }
    }
  }
}
```

Key rules:

- `modules` maps module types to payloads + merge hints.
- `mergeStrategy` may be provided per module.
- Each payload must be schema-validated against the edition's module schema.

---

### 3. System Architecture Documentation (ASCII diagrams + notes)

#### Overall Architecture (high level)

```
 ┌──────────────────┐            ┌──────────────────┐
 │  Web / Mobile UI │ <------->  │  API Gateway     │
 └─────────┬────────┘            └────────┬─────────┘
           │                            │
           v                            v
     ┌──────────────┐            ┌───────────────┐
     │ Frontend App │            │  Backend App  │
     │ (React + WS) │            │ (Node/TS)     │
     └────┬─────────┘            └────┬──────────┘
          │                          │
          │                          │
          v                          v
   ┌──────────────┐           ┌───────────────┐
   │ Rules Engine │  <------> │ Persistence   │
   │ (stat calc,  │           │ (Postgres +   │
   │  merge layer)│           │  JSONB blobs) │
   └──────────────┘           └───────────────┘
           ▲                          ▲
           │                          │
           └──────────┬───────────────┘
                      │
                 Job Queue (optional)
                  / Background Tasks
```

Notes:

- Rules Engine: load/merge rules, produce immutable merged ruleset per campaign session, used for validation and dice calculations.
- Persistence: relational store for entities (users, characters, campaigns) + JSONB for rule modules and book payloads.
- Real-time: WebSocket service (or P2P/SSE) for live sessions and dice sharing.

#### Ruleset loading & merging flow

```
[Request: create character or start campaign]
         |
         v
[Resolve Edition] -> [Load Edition Core Modules]
         |
         v
[Load Enabled Books in Campaign (ordered)]
         |
         v
[Apply Overrides via Merge Engine]
         |
         v
[Produce Final Merged Ruleset Object (immutable)]
         |
         v
[Character Creation/Validation uses this concrete ruleset]
```

Key constraints:

- Book load order matters; GM chooses order or system defines canonical order (core first, then sourcebooks sorted by release or GM choice).
- Merged ruleset is cached per campaign (and versioned) to ensure reproducible validation.

---

### 4. Ruleset loading/merging algorithm specification (detailed)

**Inputs**

- `baseModules`: dict moduleType->modulePayload (from core)
- `bookOverrides`: ordered list of book payloads each containing overrides per module
- `mergeStrategy` default = `deepMerge`

**Pseudocode**

```
function produceMergedRuleset(baseModules, bookOverrides):
    merged = deepClone(baseModules)

    for book in bookOverrides in definedLoadOrder:
        for (moduleType, override) in book.modules:
            strategy = override.mergeStrategy || inferDefaultStrategy(moduleType)
            merged[moduleType] = applyOverride(merged[moduleType], override.payload, strategy)

    normalizeAndValidate(merged)
    return merged
```

`applyOverride(base, overridePayload, strategy)`:

- `replace` => return deepClone(overridePayload)
- `merge` => deepMerge(base, overridePayload)
  - objects: recursive merge
  - arrays: if array elements have `id`, merge by id; otherwise append
  - scalars: override

- `append` => base + override (append arrays or add keys)
- `remove` => remove keys/ids referenced in overridePayload

Edge cases:

- Conflicting IDs: if two sourcebooks introduce same `id`, system must either namespace by book or require GM resolution.
- Validation: after merge run JSON schema validations for each module.

---

## Priority 2 — Product Design & Planning

### 5. Polished PRD (full summary — executive + sections)

Below is a compressed but structured PRD skeleton. Use this to expand into a full multi-page doc.

# PRD: Shadowrun Ruleset-based Campaign Manager (Executive Summary)

**Problem:** Shadowrun players and GMs lack a modern, edition-aware digital tool that respects edition differences, book-based extensions, and GM control.
**Solution:** Web app to create accounts, build edition-specific characters, run campaigns with modular rulesets, and provide GM session tools.

## High-level features

- Multi-edition rule sandboxing
- Book-based data bundles + overrides
- Modular creation methods
- GM campaign control, invites, session tools (combat tracker, dice engine)
- Player-facing character sheets & mobile-friendly UI

## Success metrics

- Launch MVP supporting SR5 core + 2 sourcebooks
- 1,000 registered users in first 6 months (example)
- Average session length ≥ 45 minutes for active GMs

## Stakeholders

- Product manager, Lead Engineer, Rules SME, Designer, QA

## Timeline (see roadmap below)

(Include sections: Goals, Personas, User Stories, Nonfunctional Requirements, Acceptance Criteria — I can expand further into a full PRD file on request.)

---

### 6. Feature Roadmap (MVP → Beta → v1 → v2)

High-level milestones with recommended scope.

---

#### **MVP (3–6 months)** — Goal: Complete SR5 Priority Character Creation

The MVP delivers a fully functional SR5 Priority-based character creation system. This section details the specific components required based on the SR5 Core Rulebook (p. 62-107).

##### Status Legend

- ✅ Complete — Feature fully implemented
- ⚠️ Partial — Basic implementation, minor features missing
- 🔜 Deferred — Intentionally moved to Beta phase
- ❌ Not Started — Not yet implemented

##### Overall Progress Summary (Updated: December 2024)

**Core Character Creation:** ~95% Complete

- All 10 creation steps implemented and functional
- Full wizard flow with auto-save and draft recovery
- Character saving and finalization working

**Key Completed Phases:**

- Phase 6.2: Knowledge & Language skills
- Phase 6.3: Skill specializations
- Phase 6.4: Derived stats calculation
- Phase 7: Contacts system
- Phase 8: Gear & Resources with lifestyle selection

**Deferred to Beta:**

- Cyberware/Bioware (Augmentations)
- Adept Powers allocation
- Spirit/Sprite binding
- Foci bonding

##### MVP Completion Status

| Component                                 | Status      | Notes                                         |
| ----------------------------------------- | ----------- | --------------------------------------------- |
| Priority Selection Grid                   | ✅ Complete | A-E assignment across 5 categories            |
| Metatype Selection                        | ✅ Complete | Based on priority, shows racial traits        |
| Physical/Mental Attributes                | ✅ Complete | Point allocation with metatype limits         |
| Special Attributes (Edge/Magic/Resonance) | ✅ Complete | SpecialAttributeAllocator component           |
| Magic/Resonance Path Selection            | ✅ Complete | Path selection based on priority              |
| Active Skills                             | ✅ Complete | Individual + group point allocation           |
| Skill Specializations                     | ✅ Complete | +2 dice bonus, 1 point cost                   |
| Knowledge & Language Skills               | ✅ Complete | (INT+LOG)×2 free points, native language free |
| Qualities Selection                       | ✅ Complete | Positive/Negative with 25 Karma caps          |
| Contacts System                           | ✅ Complete | Connection + Loyalty, CHA×3 free Karma        |
| Gear & Resources                          | ✅ Complete | Catalog, lifestyle, Karma-to-Nuyen            |
| Spells/Complex Forms                      | ✅ Complete | Karma purchase, priority-based free items     |
| Derived Stats                             | ✅ Complete | Limits, condition monitors, initiative        |
| Review Step                               | ✅ Complete | Full summary with validation                  |
| Draft Auto-save                           | ✅ Complete | LocalStorage persistence                      |

##### MVP Remaining Work — SR5 Character Creation Steps

**Step 2: Metatype & Special Attributes**
| Task | Priority | Status |
|------|----------|--------|
| Special Attribute Points UI | High | ✅ Complete |
| Edge allocation (starts 1, humans 2) | High | ✅ Complete |
| Magic allocation (from Magic priority) | High | ✅ Complete |
| Resonance allocation (Technomancers) | High | ✅ Complete |
| Validate special points fully spent | High | ✅ Complete |
| Human Edge cap 7 vs 6 for others | Medium | ✅ Complete |

**Step 3: Magic/Resonance Details**
| Task | Priority | Status |
|------|----------|--------|
| Starting Magic/Resonance from priority | High | ✅ Complete |
| Free magical skills from priority A/B | Medium | ⚠️ Partial |
| Tradition selection for Magicians | Medium | ✅ Complete |
| Aspected Magician skill group lock | Medium | ⚠️ Partial |

**Step 5: Skills (Knowledge & Language)**
| Task | Priority | Status |
|------|----------|--------|
| Knowledge Skills allocation UI | High | ✅ Complete |
| Language Skills allocation UI | High | ✅ Complete |
| Free points: (Intuition + Logic) × 2 | High | ✅ Complete |
| Native language at rating 6 (free) | High | ✅ Complete |
| Knowledge skill categories (Academic/Interest/Professional/Street) | Medium | ✅ Complete |
| Skill Specializations (+2 dice, 1 point) | Medium | ✅ Complete |
| Specialization breaks skill group rule | Low | ⚠️ Partial |

**Step 6: Resources/Gear**
| Task | Priority | Status |
|------|----------|--------|
| Gear catalog UI (searchable) | High | ✅ Complete |
| Nuyen budget tracking | High | ✅ Complete |
| Lifestyle selection | High | ✅ Complete |
| Lifestyle cost modifiers (Troll +10%, Dwarf +20%) | Medium | ✅ Complete |
| Availability ≤12 validation | High | ✅ Complete |
| Device Rating ≤6 validation | Medium | ⚠️ Partial |
| 5,000¥ carryover limit | Medium | ✅ Complete |
| Karma-to-Nuyen conversion (max 10 Karma = 20,000¥) | Medium | ✅ Complete |
| Cyberware/Bioware selection | Medium | 🔜 Deferred to Beta |
| Essence tracking | Medium | 🔜 Deferred to Beta |
| Essence loss reduces Magic/Resonance | Medium | 🔜 Deferred to Beta |
| Augmentation bonus ≤+4 per attribute | Low | 🔜 Deferred to Beta |
| Starting Nuyen roll by lifestyle | Low | ❌ Not Started |

**Step 7: Leftover Karma**
| Task | Priority | Status |
|------|----------|--------|
| Contacts system (Connection + Loyalty) | High | ✅ Complete |
| Free Contacts Karma = Charisma × 3 | High | ✅ Complete |
| Max 7 Karma per contact | Medium | ✅ Complete |
| Karma purchase: Attributes (new × 5) | Medium | ❌ Not Started |
| Karma purchase: Skills (new × 2) | Medium | ❌ Not Started |
| Karma purchase: Spells (5 Karma each) | Medium | ✅ Complete |
| Karma purchase: Complex Forms (4 Karma each) | Medium | ✅ Complete |
| 7 Karma carryover maximum | High | ✅ Complete |
| Bound Spirits (1 Karma per service) | Low | 🔜 Deferred to Beta |
| Registered Sprites (1 Karma per task) | Low | 🔜 Deferred to Beta |
| Foci bonding (variable cost) | Low | 🔜 Deferred to Beta |
| Mystic Adept Power Points (5 Karma each) | Low | 🔜 Deferred to Beta |

**Step 8: Final Calculations**
| Task | Priority | Status |
|------|----------|--------|
| Initiative = Intuition + Reaction | High | ✅ Complete |
| Physical Limit = [(STR×2) + BOD + REA] / 3 ↑ | High | ✅ Complete |
| Mental Limit = [(LOG×2) + INT + WIL] / 3 ↑ | High | ✅ Complete |
| Social Limit = [(CHA×2) + WIL + ESS] / 3 ↑ | High | ✅ Complete |
| Physical Condition Monitor = [BOD/2] + 8 | High | ✅ Complete |
| Stun Condition Monitor = [WIL/2] + 8 | High | ✅ Complete |
| Overflow = Body + augmentation bonuses | Medium | ⚠️ Partial |
| Astral Initiative (magical characters) | Medium | ❌ Not Started |
| Matrix Initiative (deckers/technomancers) | Medium | ❌ Not Started |
| Living Persona stats (technomancers) | Medium | ❌ Not Started |
| Store derivedStats on character | High | ✅ Complete |

**Validation Rules (Creation-time)**
| Task | Priority | Status |
|------|----------|--------|
| Each Priority Level (A-E) used exactly once | ✅ | Complete |
| Only one Physical/Mental attribute at max | High | ⚠️ Warning only |
| All attribute points must be spent | High | ⚠️ Warning only |
| All skill points must be spent | High | ⚠️ Warning only |
| Maximum 25 Karma positive qualities | ✅ | Complete |
| Maximum 25 Karma negative qualities | ✅ | Complete |
| Maximum 7 Karma carryover | High | ✅ Complete |
| Maximum 5,000¥ carryover | Medium | ✅ Complete |
| Gear Availability ≤12 | High | ✅ Complete |
| Device Rating ≤6 | Medium | ⚠️ Partial |
| Max bound spirits = Charisma | Low | 🔜 Deferred to Beta |
| Max registered sprites = Charisma | Low | 🔜 Deferred to Beta |
| Max complex forms = Resonance | Low | ✅ Complete |
| Max spells = Magic × 2 | Low | ✅ Complete |
| Max foci Force = Magic × 2 | Low | 🔜 Deferred to Beta |

##### MVP — Other Systems

- User accounts & campaign creation
- GM invites and player approval flow
- Dice roller + simple logs
- Simple rulebook ingestion (manual JSON payload upload)
- Basic character sheet (SR5 layout)
- Web UI for desktop

---

#### **Beta (6–9 months)** — Goal: Richer GM Tools + Sourcebook Support

- **Sourcebook merging** (Run Faster, Street Grimoire)
  - Metavariants from Run Faster
  - Additional qualities, skills, gear
- **Combat tracker** (initiative order, rounds, damage application)
- **Full inventory management**
  - Ammunition tracking
  - Gear modification system
  - Damage tracking on gear
- **Cyberware/Bioware system** (full implementation)
  - Grade selection (Standard, Alpha, Beta, Delta)
  - Capacity tracking
  - Essence hole tracking for magic users
- **Adept Powers system**
  - Power Point allocation
  - Power selection catalog
  - Level-based powers
- **Spell management**
  - Spell catalog with full details
  - Ritual spells
  - Alchemical preparations
- **Complex Forms catalog** (Technomancers)
- **Mobile-responsive UI** improvements
- **Basic session persistence** and WebSockets

---

#### **v1 (9–12 months)** — Goal: Multi-Edition + Advanced Features

- **SR6 support** (new priority table, Edge system)
- **SR4A support** (Build Points system)
- **Advanced creation methods**
  - Life Modules (Run Faster)
  - Sum-to-Ten variant
  - Karma Point-Buy (Run Faster p.64)
- **Street-Level / Prime Runner variants**
  - Modified resource tables
  - Adjusted Karma pools
  - Different availability limits
- **NPC manager** + encounter templates
- **Spirits & Sprites system**
  - Spirit summoning and binding
  - Sprite compiling and registering
  - Service/task tracking
- **Foci system**
  - Bonding costs
  - Force limits
  - Addiction rules
- **Module marketplace** (homebrew bundles)
- **Integration hooks** for VTTs (Foundry/other)
- **Permissions & billing** (if monetizing)
- **Improved analytics & monitoring**

---

#### **v2 (12–24 months)** — Goal: Deep Automation + Content

- **Matrix automation**
  - Cyberdeck programs
  - Matrix actions
  - IC and host rules
- **Rigger subsystems**
  - Vehicle customization
  - Drone control
  - Jumped-in rules
- **Spells automation**
  - Drain calculation
  - Sustained spell tracking
  - Spell defense
- **Mentor Spirits** system
- **AI-assisted rule linking** & search (map item to book page)
- **Offline capabilities**, native mobile apps
- **Expanded edition support** (SR1–SR3 + Anarchy)
- **Third-party plugin API**
- **Character import/export** (Chummer, HeroLab formats)
- **Export PDF character sheet**

---

### 7. User Personas

**Player Persona — “Riley, the Runner”**

- Age: 30; plays weekly
- Goals: Create detailed run-ready characters quickly, track gear, and use during live sessions on mobile
- Frustrations: Inconsistent rules across sites, heavy manual tracking, mismatched info between books
- Needs: Fast character creation, edition accuracy, mobile-friendly quick-roll buttons

**GM Persona — “Sam, the Deckmaster”**

- Age: 36; runs weekly campaigns
- Goals: Manage campaign content, enable specific sourcebooks, prepare encounters, and keep secrets for players
- Frustrations: Tools that force a single edition or don't allow homebrew, clumsy combat trackers
- Needs: Per-campaign book control, NPC templates, encounter/scene manager, private notes

---

## Priority 3 — Character Creation System

### 8. JSON Schema for CreationMethod module

A concise example JSON Schema (draft-07 style) for a CreationMethod payload. This schema should be extended as each creation method needs more complexity.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "CreationMethod",
  "type": "object",
  "required": ["id", "name", "steps"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "description": { "type": "string" },
    "version": { "type": "string" },
    "steps": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "title", "type"],
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string" },
          "type": {
            "type": "string",
            "enum": ["select", "allocate", "choose", "validate", "info"]
          },
          "payload": { "type": "object" }
        }
      }
    },
    "budgets": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "label", "initialValue"],
        "properties": {
          "id": { "type": "string" },
          "label": { "type": "string" },
          "initialValue": { "type": "number" },
          "min": { "type": "number" },
          "max": { "type": "number" }
        }
      }
    },
    "constraints": {
      "type": "array",
      "items": { "type": "object" }
    }
  }
}
```

This allows creation methods to declare ordered `steps`, budgets (BP, karma, priorities), and constraints (e.g., "if metatype=orc then attr.body>=3").

---

### 9. Ruleset loading/merging algorithm for character creation

Same engine as general merging but with character-focused steps:

- Resolve edition + enabled books
- Produce merged creation method set (books can add/modify creation methods)
- Validate chosen creationMethodId for campaign
- During creation:
  - For each step in creationMethod.payload.steps:
    - Render UI from `step.type` and `step.payload`
    - Run step-level validators (constraints)

  - After all steps, run global validators (budgets, attribute caps, item availability)

- Persist character with `attachedBooks` and `creationMethodVersion` for reproducibility

Important: Freeze the merged ruleset snapshot used for creation and store a `rulesetSnapshotId` in the Character so future changes don't break legacy characters.

---

### 10. Flowchart: Character Creation Load & Validation (ASCII)

```
User -> Select Campaign -> (Campaign edition + enabled books)
     -> System: produceMergedRuleset(campaign)
     -> List available CreationMethods (from merged.rules.creationMethods)
     -> Player selects CreationMethod
     -> For each step in CreationMethod.steps:
           -> Render UI step
           -> User input -> run step validators
           -> Update local draft character
     -> After steps complete -> run global validators
            -> If errors: show errors -> user fixes
            -> If pass: persist character with rulesetSnapshotId
```

---

### 11. Character Creation UX/UI — Edition selection & Wizard flow (brief)

**Edition selection UX**

- Screen with card grid for each edition; each card shows core features, whether bioware exists, and sample creation methods.
- Filter: show only editions enabled for selected campaign (GM-controlled).

**Wizard essentials**

- Left-side stepper (sticky) with step names (dynamic)
- Main pane shows step-specific UI + contextual help (book references)
- Right-side validation panel showing resource spend (nuyen, BP, karma) and live warnings
- Top toolbar shows edition and active books (click to expand book details)
- Save as Draft, Validate, Finalize buttons

---

### 12. React component structure for Character Creation UI

High-level component tree (use TypeScript + React):

```
App
└─ CampaignContextProvider
   └─ CharacterBuilderPage
      ├─ EditionHeader (edition badge, book toggles)
      ├─ CreationMethodSelectorModal
      ├─ CreationWizard
      │  ├─ StepperSidebar
      │  ├─ StepRenderer  (switch by step.type)
      │  │  ├─ Step_Select (metatype, magic type)
      │  │  ├─ Step_Allocate (attributes, budgets)
      │  │  ├─ Step_Choose (skills, qualities)
      │  │  └─ Step_Validate (final checks)
      │  └─ ValidationPanel (live resource panel)
      └─ PreviewPane (Character Summary, PDF export button)
```

Notes:

- Each step component reads rules from `RulesetContext` which contains the merged ruleset snapshot.
- Use `react-hook-form` for step-level forms with custom validators sourced from JSON schema constraints.
- Persist drafts to backend via autosave.

---

# Practical next steps & recommendations

1. **MVP pick:** Build SR5 core first (you already flagged it as a sensible default). That minimizes rule surprises and lets you exercise creation methods & sourcebook merging with Run Faster later.
2. **Implement as snapshots:** Always produce an immutable `rulesetSnapshot` for every campaign configuration. Characters reference that snapshot — avoids breaking characters when books or rules change.
3. **Start with the TypeScript interfaces and JSON schema above** and wire a simple CLI to upload a `book-payload.json` and run the merging algorithm locally before integrating into backend.
4. **Design:** use the Figma prompt you already have + the component tree to build a design system (buttons, cards, stepper) before engineering.
5. **Testing:** Create a test harness for every edition with canonical example characters (from core books) so merging behavior is validated.

---

If you want, I’ll:

- Expand any of the above into a **downloadable markdown file** (one-per-artifact or a single bundle)
- Produce a **detailed sequence diagram** for the merging and validation algorithm (SVG or mermaid)
- Create a **starter backend repo scaffold** (Express + TypeORM + rules engine stub) with the TypeScript types wired in

Which one should I generate next as files?
