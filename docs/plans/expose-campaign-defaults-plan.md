# Plan: Expose Campaign Defaults to Character Creation

## 1. Backend Enhancements
- **Campaign Service:** Extend `DescribeGameplayRules` to return structured defaults (already available). Add helper that merges edition data + campaign overrides for character creation.
- **API Layer:** Introduce `/api/campaigns/{id}/character-creation` endpoint returning edition data plus gameplay-rule overrides (resources, karma caps, gear limits). Reuse existing edition repository and campaign service.
- **Legacy JS Bridge:** Expose a method in `window.ShadowmasterLegacyApp` to accept campaign gameplay defaults so the legacy steps remain consistent.

## 2. Frontend Updates (React shell)
- **Edition Context:** Allow fetching campaign-specific character creation config when a campaign ID is present, cascading gameplay rule overrides into React components (priority resources, karma limits, gear warnings).
- **Character Wizard:** Consume the merged data to display active gameplay level and enforce limits (e.g., resource totals, karma conversion cap). Provide UI copy indicating the campaign’s gameplay level.

## 3. Tests & Documentation
- **Go Tests:** Add coverage for the new campaign character-creation endpoint ensuring overrides are applied correctly.
- **React/Vitest:** Add unit tests verifying edition context merges gameplay rules and wizard applies resource defaults.
- **Docs:** Update `docs/application-architecture-plan.md` to reflect campaign-aware character creation, and add brief usage notes in relevant README/documentation.

