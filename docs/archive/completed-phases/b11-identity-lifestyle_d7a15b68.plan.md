---
name: b11-identity-lifestyle
overview: Implement Identity/Lifestyle/SIN system (B11) with data structures, creation wizard steps, and review display per SR5 rules.
todos: []
---

## Goals

- Add identity/SIN/license/lifestyle data structures and validation hooks per SR5.
- Integrate Identities and Lifestyle management into creation wizard (GearStep + new IdentitiesStep).
- Ensure ReviewStep displays identity/lifestyle data with rule validations.

## Plan

1. **Define Types**: Update `/lib/types/character.ts` and `/lib/types/edition.ts` to add Identity, SIN, License, Lifestyle, LifestyleModification, SinnerQuality enums; extend Character with identities, lifestyles, primaryLifestyleId. Ensure loader/creation types support new structures.
2. **Identity Step**: Add IdentitiesStep + editors (`IdentitiesStep.tsx`, `IdentityEditor.tsx`, `LicenseEditor.tsx`), wire into `CreationWizard.tsx`, and link to `QualitiesStep` (SINner) and `GearStep` (fake SIN/license purchases). Add validations for SIN rules.
3. **Lifestyle Management**: Enhance `GearStep` with multiple lifestyles, LifestyleEditor, modification selector, subscriptions, custom expenses/income, permanent purchase option, and lifestyle-identity associations; update cost calculations and validations.
4. **Review Integration**: Update `ReviewStep.tsx` to show identities/SINs/licenses/lifestyles with association info and validation states.

## Todos

- types-setup: Add identity/SIN/license/lifestyle types and character fields.
- identities-step: Build IdentitiesStep + editors; integrate with wizard, qualities, gear; add SIN/license validations.
- lifestyle-ui: Expand GearStep with lifestyle editor, mods, subscriptions, costs, and associations; add validations.
- review-display: Render identities/lifestyles in ReviewStep with validation indicators.
