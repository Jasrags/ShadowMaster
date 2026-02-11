# Gear State Refinements — Implementation Plan

## Overview

This plan describes the code changes needed to implement the gear state refinements documented in `character.inventory-management.md`. These changes add a `stashed` readiness state, a device activation overlay, and item containment references.

## 1. Add `stashed` to EquipmentReadiness

**File:** `lib/types/gear-state.ts`

- Add `"stashed"` to the `EquipmentReadiness` union type.
- Add `stashed` to `VALID_READINESS_STATES` for all equipment categories.

## 2. Add Activation and Containment Fields to GearState

**File:** `lib/types/gear-state.ts`

- Add optional `active?: boolean` field to `GearState` interface (defaults to `true` for electronic items, absent for non-electronic items).
- Add optional `containedIn?: { itemId: string; slotType: string }` field to `GearState` interface.

## 3. Update State Transition Costs

**File:** `lib/rules/inventory/state-manager.ts`

- Add `stashed` transitions to `STATE_TRANSITION_COSTS`:
  - Any on-person state to `stashed`: not available during combat (narrative time only).
  - `stashed` to `stored`: narrative time only.
- Add activation toggle costs:
  - Free Action outside combat.
  - Simple Action during combat.

## 4. Update Encumbrance Calculator

**File:** `lib/rules/encumbrance/calculator.ts`

- Update `isItemCarried()` (or equivalent weight aggregation logic) to exclude items with readiness `stashed`.
- Ensure contained item weight is attributed to parent container, not double-counted.

## 5. Containment Validation

**File:** `lib/rules/inventory/state-manager.ts` (or new `containment-validator.ts`)

- Validate that `containedIn.itemId` references a valid container item owned by the character.
- Validate capacity and compatibility against catalog data.
- Enforce readiness constraint: contained item readiness cannot exceed container readiness.

## 6. Migration Script

**File:** `data/migrations/` (new migration)

- Existing characters have no `active` or `containedIn` fields — these are optional and default safely, so no destructive migration is needed.
- If any existing items need a default `stashed` state (unlikely), handle via opt-in migration.

## 7. Test Updates

- Update unit tests in `__tests__/lib/rules/inventory/` for new `stashed` transitions.
- Add tests for activation state toggling.
- Add tests for containment validation and readiness constraints.
- Update encumbrance tests to verify `stashed` exclusion.

## 8. UI Updates (Future)

- Inventory view: add stash section grouped separately from on-person items.
- Device activation toggle alongside wireless toggle.
- Containment visualization (nested items under parent container).

## Dependencies

- No external dependencies required.
- Changes are additive and backwards-compatible with existing character data.

## Sequence

1. Types first (steps 1-2)
2. State manager and encumbrance (steps 3-4)
3. Containment validation (step 5)
4. Tests (step 7)
5. Migration if needed (step 6)
6. UI (step 8, separate PR)
