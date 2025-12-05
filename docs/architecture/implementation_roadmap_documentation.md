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
  roles: Array<'player'|'gm'|'admin'>;
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
  categories: Array<'core'|'sourcebook'|'adventure'|'mission'|'novel'>;
  metadata?: Record<string, unknown>;
  // pointer to payload file (JSON rules)
  payloadRef: string; // path or storage key
  createdAt: string;
}
```

```ts
// types/rules.ts
export type RuleModuleType =
  | 'attributes' | 'skills' | 'combat' | 'matrix' | 'magic'
  | 'cyberware' | 'bioware' | 'gear' | 'creationMethods' | 'limits'
  | 'vehicles' | 'spells' | 'qualities' | 'lore';

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
  mergeStrategy: 'replace' | 'merge' | 'append' | 'remove';
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
  magicalPath?: { type: 'mundane'|'mage'|'adept'|'technomancer'|'druid'; rating?: number } | null;
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
    visibility: 'private'|'invite'|'public';
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
        "skills": [
          { "id": "vehicledriving", "name": "Vehicle Driving", "group": "vehicle" }
        ]
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
            "payload": { /* full creation method descriptor */ }
          }
        ]
      }
    }
  }
}
```

Key rules:

* `modules` maps module types to payloads + merge hints.
* `mergeStrategy` may be provided per module.
* Each payload must be schema-validated against the edition's module schema.

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

* Rules Engine: load/merge rules, produce immutable merged ruleset per campaign session, used for validation and dice calculations.
* Persistence: relational store for entities (users, characters, campaigns) + JSONB for rule modules and book payloads.
* Real-time: WebSocket service (or P2P/SSE) for live sessions and dice sharing.

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

* Book load order matters; GM chooses order or system defines canonical order (core first, then sourcebooks sorted by release or GM choice).
* Merged ruleset is cached per campaign (and versioned) to ensure reproducible validation.

---

### 4. Ruleset loading/merging algorithm specification (detailed)

**Inputs**

* `baseModules`: dict moduleType->modulePayload (from core)
* `bookOverrides`: ordered list of book payloads each containing overrides per module
* `mergeStrategy` default = `deepMerge`

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

* `replace` => return deepClone(overridePayload)
* `merge` => deepMerge(base, overridePayload)

  * objects: recursive merge
  * arrays: if array elements have `id`, merge by id; otherwise append
  * scalars: override
* `append` => base + override (append arrays or add keys)
* `remove` => remove keys/ids referenced in overridePayload

Edge cases:

* Conflicting IDs: if two sourcebooks introduce same `id`, system must either namespace by book or require GM resolution.
* Validation: after merge run JSON schema validations for each module.

---

## Priority 2 — Product Design & Planning

### 5. Polished PRD (full summary — executive + sections)

Below is a compressed but structured PRD skeleton. Use this to expand into a full multi-page doc.

# PRD: Shadowrun Ruleset-based Campaign Manager (Executive Summary)

**Problem:** Shadowrun players and GMs lack a modern, edition-aware digital tool that respects edition differences, book-based extensions, and GM control.
**Solution:** Web app to create accounts, build edition-specific characters, run campaigns with modular rulesets, and provide GM session tools.

## High-level features

* Multi-edition rule sandboxing
* Book-based data bundles + overrides
* Modular creation methods
* GM campaign control, invites, session tools (combat tracker, dice engine)
* Player-facing character sheets & mobile-friendly UI

## Success metrics

* Launch MVP supporting SR5 core + 2 sourcebooks
* 1,000 registered users in first 6 months (example)
* Average session length ≥ 45 minutes for active GMs

## Stakeholders

* Product manager, Lead Engineer, Rules SME, Designer, QA

## Timeline (see roadmap below)

(Include sections: Goals, Personas, User Stories, Nonfunctional Requirements, Acceptance Criteria — I can expand further into a full PRD file on request.)

---

### 6. Feature Roadmap (MVP → Beta → v1 → v2)

High-level milestones with recommended scope.

**MVP (3–6 months)** — Goal: playable SR5 character creation + campaign with GM invites

* SR5 core ruleset implemented (attributes, skills, gear baseline)
* Character creation: Priority + Point-Buy
* Basic character sheet (SR5 layout)
* User accounts & campaign creation
* GM invites and player approval flow
* Dice roller + simple logs
* Simple rulebook ingestion (manual JSON payload upload)
* Basic validation engine
* Web UI for desktop

**Beta (6–9 months)** — Goal: richer GM tools + sourcebook support

* Sourcebook merging (1–2 sourcebooks)
* Combat tracker (initiative, rounds)
* Inventory management, damage tracking
* Mobile-responsive UI improvements
* Export PDF character sheet
* Basic session persistence and WebSockets

**v1 (9–12 months)** — Goal: multi-edition + marketplace

* Add SR6 support + SR4A
* Advanced creation methods (Life Modules)
* NPC manager + encounter templates
* Module marketplace (homebrew bundles)
* Integration hooks for VTTs (Foundry/other)
* Permissions & billing (if monetizing)
* Improved analytics & monitoring

**v2 (12–24 months)** — Goal: deep automation + content

* Matrix automation, rigger subsystems, spells automation
* AI-assisted rule linking & search (map item to book page)
* Offline capabilities, native mobile apps
* Expanded edition support (SR1–SR3 + Anarchy)
* Third-party plugin API

---

### 7. User Personas

**Player Persona — “Riley, the Runner”**

* Age: 30; plays weekly
* Goals: Create detailed run-ready characters quickly, track gear, and use during live sessions on mobile
* Frustrations: Inconsistent rules across sites, heavy manual tracking, mismatched info between books
* Needs: Fast character creation, edition accuracy, mobile-friendly quick-roll buttons

**GM Persona — “Sam, the Deckmaster”**

* Age: 36; runs weekly campaigns
* Goals: Manage campaign content, enable specific sourcebooks, prepare encounters, and keep secrets for players
* Frustrations: Tools that force a single edition or don't allow homebrew, clumsy combat trackers
* Needs: Per-campaign book control, NPC templates, encounter/scene manager, private notes

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
          "type": { "type": "string", "enum": ["select","allocate","choose","validate","info"] },
          "payload": { "type": "object" }
        }
      }
    },
    "budgets": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id","label","initialValue"],
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

* Resolve edition + enabled books
* Produce merged creation method set (books can add/modify creation methods)
* Validate chosen creationMethodId for campaign
* During creation:

  * For each step in creationMethod.payload.steps:

    * Render UI from `step.type` and `step.payload`
    * Run step-level validators (constraints)
  * After all steps, run global validators (budgets, attribute caps, item availability)
* Persist character with `attachedBooks` and `creationMethodVersion` for reproducibility

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

* Screen with card grid for each edition; each card shows core features, whether bioware exists, and sample creation methods.
* Filter: show only editions enabled for selected campaign (GM-controlled).

**Wizard essentials**

* Left-side stepper (sticky) with step names (dynamic)
* Main pane shows step-specific UI + contextual help (book references)
* Right-side validation panel showing resource spend (nuyen, BP, karma) and live warnings
* Top toolbar shows edition and active books (click to expand book details)
* Save as Draft, Validate, Finalize buttons

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

* Each step component reads rules from `RulesetContext` which contains the merged ruleset snapshot.
* Use `react-hook-form` for step-level forms with custom validators sourced from JSON schema constraints.
* Persist drafts to backend via autosave.

---

# Practical next steps & recommendations

1. **MVP pick:** Build SR5 core first (you already flagged it as a sensible default). That minimizes rule surprises and lets you exercise creation methods & sourcebook merging with Run Faster later.
2. **Implement as snapshots:** Always produce an immutable `rulesetSnapshot` for every campaign configuration. Characters reference that snapshot — avoids breaking characters when books or rules change.
3. **Start with the TypeScript interfaces and JSON schema above** and wire a simple CLI to upload a `book-payload.json` and run the merging algorithm locally before integrating into backend.
4. **Design:** use the Figma prompt you already have + the component tree to build a design system (buttons, cards, stepper) before engineering.
5. **Testing:** Create a test harness for every edition with canonical example characters (from core books) so merging behavior is validated.

---

If you want, I’ll:

* Expand any of the above into a **downloadable markdown file** (one-per-artifact or a single bundle)
* Produce a **detailed sequence diagram** for the merging and validation algorithm (SVG or mermaid)
* Create a **starter backend repo scaffold** (Express + TypeORM + rules engine stub) with the TypeScript types wired in

Which one should I generate next as files?
