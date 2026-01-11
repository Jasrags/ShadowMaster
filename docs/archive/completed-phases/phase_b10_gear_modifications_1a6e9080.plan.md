---
name: Phase B10 Gear Modifications
overview: Deliver gear modification support across data, catalog loading, creation UI, validation, and review per SR5 rules.
todos:
  - id: audit-data
    content: Verify mod types/catalog hooks exist and align
    status: completed
  - id: catalog-complete
    content: Ensure modifications module populated in core-rulebook.json
    status: completed
    dependencies:
      - audit-data
  - id: ui-mods
    content: "Finish mod UI: modal, selector, cart display, remove"
    status: completed
    dependencies:
      - audit-data
  - id: validation-cost
    content: Add validation (availability/capacity/mount/reqs) and cost calc
    status: completed
    dependencies:
      - ui-mods
      - catalog-complete
  - id: review-display
    content: Show mods + costs in ReviewStep
    status: completed
    dependencies:
      - validation-cost
  - id: augmentation-integration
    content: Integrate Augmentations into GearStep with cyberware enhancements
    status: completed
    dependencies:
      - review-display
  - id: testing
    content: Run acceptance checks for B10.5 AC1-AC12
    status: pending
    dependencies:
      - augmentation-integration
---

# Phase B10: Gear Modifications Plan

## Scope

Implement complete gear modification support in character creation: catalog data loading, UI to add/inspect modifications, validation (capacity/mount/requirements/availability), and cost tracking through review.

## Approach

- Confirm data structures and catalog hooks exist and align (`/lib/types/character.ts`, `/lib/types/edition.ts`, `/lib/rules/RulesetContext.tsx`).
- Finalize modification catalog in `/data/editions/sr5/core-rulebook.json` and ensure RuleModuleType includes `modifications`.
- Enhance GearStep UI: modification modal/selector, mount selection, capacity display, install/remove flows, and render installed mods in cart.
- Add validation and cost propagation in `GearStep` and `ReviewStep`, backed by rules in `/lib/rules/validation.ts`.
- Verify acceptance criteria with manual checks; update docs if needed.

## Files to touch

- `app/characters/create/components/steps/GearStep.tsx`
- `app/characters/create/components/ShoppingCartSection.tsx`
- `app/characters/create/components/ModificationModal.tsx`
- `app/characters/create/components/ModificationSelector.tsx`
- `app/characters/create/components/steps/ReviewStep.tsx`
- `lib/rules/validation.ts`
- `lib/rules/RulesetContext.tsx`
- `data/editions/sr5/core-rulebook.json`
- `lib/types/character.ts`, `lib/types/edition.ts`

## Validation Flow (Mermaid)

```mermaid
flowchart TD
  catalog(ModCatalog loaded) --> modal(ModificationModal)
  modal --> selector(ModificationSelector)
  selector --> validation(Validation rules)
  validation --> cart(ShoppingCartSection with mods)
  cart --> budget(Budget calc in GearStep)
  cart --> review(ReviewStep displays mods)
```
