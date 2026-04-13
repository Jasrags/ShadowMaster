# Plan: #870 — Structured House Rules with Mechanical Enforcement

**Issue:** https://github.com/Jasrags/ShadowMaster/issues/870
**Branch:** `feature/870-structured-house-rules`
**Scope:** ~8-10 files, medium complexity

## Context

The epic (#872) identifies 35 GM-configurable toggles across 3 sourcebooks. Today, `houseRules` on `Campaign` is `string | Record<string, unknown>` — untyped bag with no enforcement. Each future toggle issue (#845, #851, etc.) needs a consistent way to:

1. Register what can be toggled (schema)
2. Store the GM's choices (campaign settings)
3. Read the toggle value at enforcement time (lookup)
4. Show a UI for the GM to configure it (settings form)

This issue builds that foundation so every subsequent toggle is just "add a field + wire one check."

## Design Decisions

### Approach: Typed `houseRules` object (not a separate toggle system)

The `houseRules` field already exists on `Campaign`. Rather than adding a parallel `featureToggles` field, we **replace the loose type** with a structured `HouseRules` interface. This keeps one source of truth and avoids confusion about where GM overrides live.

- `optionalRules` (existing) stays for **book-defined** rules from ruleset payloads
- `houseRules` becomes the **app-level** GM toggle surface

### Toggle value types

Each toggle field is optional on `HouseRules` (undefined = use default). Three shapes:

- **boolean** — on/off (`gearAvailabilityRestrictions: boolean`)
- **enum** — mode selection (`diceMode: 'app-roll' | 'manual-entry'`)
- **number** — numeric override (`qualityKarmaCap: number`)

### Registry pattern

A `TOGGLE_REGISTRY` constant maps each toggle ID to its metadata (label, description, category, default value, value type). The UI iterates this to render controls. Rule engine code reads values via a typed getter.

## Implementation Checklist

### Phase 1: Types & Registry (~3 files)

- [ ] **`lib/types/house-rules.ts`** — New file
  - Define `HouseRules` interface with all toggle fields (start with ~5 high-priority placeholders from #845, #851, #852, #857, #862)
  - Define `ToggleCategory` union: `'dice-combat' | 'character-creation' | 'contacts' | 'augmentation' | 'magic' | 'matrix'`
  - Define `ToggleMeta` interface: `{ id, label, description, category, defaultValue, valueType }`
  - Export `createDefaultHouseRules(): HouseRules` — returns `{}` (all defaults)

- [ ] **`lib/rules/house-rules-registry.ts`** — New file
  - Export `TOGGLE_REGISTRY: Record<keyof HouseRules, ToggleMeta>` — metadata for all toggles
  - Export `getToggleValue<K>(houseRules: HouseRules | undefined, key: K): HouseRules[K]` — returns stored value or default from registry
  - Export `getTogglesByCategory(category): ToggleMeta[]` — for UI grouping
  - Pure functions, no side effects, follows `optional-rules.ts` pattern

- [ ] **`lib/types/campaign.ts`** — Edit
  - Change `houseRules?: string | Record<string, unknown>` → `houseRules?: HouseRules` on `Campaign`
  - Same change on `CampaignTemplate`, `CreateCampaignRequest`, `UpdateCampaignRequest`
  - Import `HouseRules` from `./house-rules`

- [ ] **`lib/types/index.ts`** — Edit
  - Re-export `HouseRules`, `ToggleMeta`, `ToggleCategory` from `./house-rules`

### Phase 2: Storage & Validation (~2 files)

- [ ] **`lib/storage/campaigns.ts`** — Edit
  - Pass `houseRules` through in create/update (already does, but verify type flows)
  - No migration needed — existing `houseRules` values are `undefined` or freeform strings that won't break (field is optional, old data just won't match new type at runtime — fine for file-based JSON)

- [ ] **`lib/storage/validation.ts`** — Edit
  - Update `houseRules` validation: accept `HouseRules` object, validate known keys against registry, reject unknown keys
  - Keep backward compat: if `houseRules` is a string (legacy), convert to `{ freeformNotes: string }`

### Phase 3: UI (~2 files)

- [ ] **`app/campaigns/[id]/settings/components/HouseRulesForm.tsx`** — New file
  - Follow `AdvancementSettingsForm.tsx` pattern exactly (props: `{ houseRules, onChange }`)
  - Iterate `TOGGLE_REGISTRY` grouped by category
  - Render: boolean → checkbox/switch, enum → select, number → number input
  - Show default value as placeholder, "Reset to default" button per toggle
  - Include a freeform notes textarea for unstructured house rules

- [ ] **`app/campaigns/[id]/settings/page.tsx`** — Edit
  - Add `houseRules` state (like `advancementSettings`)
  - Load from campaign, include in `handleSave` body
  - Render `<HouseRulesForm>` section between Advancement and Visibility sections

### Phase 4: Tests (~2 files)

- [ ] **`lib/rules/__tests__/house-rules-registry.test.ts`** — New file
  - `getToggleValue` returns default when `houseRules` is undefined
  - `getToggleValue` returns stored value when present
  - `getTogglesByCategory` groups correctly
  - Registry covers all keys on `HouseRules` interface (no orphans)

- [ ] **`app/campaigns/[id]/settings/components/__tests__/HouseRulesForm.test.tsx`** — New file
  - Renders all categories
  - Toggle changes call `onChange` with updated object (immutable)
  - Default values shown correctly

### Phase 5: Seed Data Update (~1 file)

- [ ] **`scripts/seed-data.ts`** — Edit
  - Update seed campaigns to use structured `houseRules` instead of string arrays

## Files Summary

| File                                                   | Action | Purpose                                            |
| ------------------------------------------------------ | ------ | -------------------------------------------------- |
| `lib/types/house-rules.ts`                             | Create | HouseRules interface, ToggleMeta, defaults         |
| `lib/rules/house-rules-registry.ts`                    | Create | Toggle registry, getToggleValue, category grouping |
| `lib/types/campaign.ts`                                | Edit   | Tighten houseRules type                            |
| `lib/types/index.ts`                                   | Edit   | Re-export new types                                |
| `lib/storage/campaigns.ts`                             | Edit   | Verify type flow                                   |
| `lib/storage/validation.ts`                            | Edit   | Structured validation                              |
| `app/.../settings/components/HouseRulesForm.tsx`       | Create | GM toggle UI                                       |
| `app/.../settings/page.tsx`                            | Edit   | Wire in HouseRulesForm                             |
| `lib/rules/__tests__/house-rules-registry.test.ts`     | Create | Registry unit tests                                |
| `app/.../components/__tests__/HouseRulesForm.test.tsx` | Create | Form component tests                               |
| `scripts/seed-data.ts`                                 | Edit   | Update seed data                                   |

## What This Unlocks

After this ships, each subsequent toggle issue becomes:

1. Add a field to `HouseRules` interface
2. Add an entry to `TOGGLE_REGISTRY`
3. Wire `getToggleValue(campaign.houseRules, 'toggleId')` into the rule check
4. UI auto-renders from registry — no form changes needed

## Out of Scope

- Actual enforcement wiring for specific toggles (that's per-issue: #845, #851, etc.)
- Migration script for existing campaigns (field is optional, graceful degradation)
- Player-visible toggle display (future: show active house rules on campaign page)
