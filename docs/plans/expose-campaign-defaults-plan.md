# Plan: Expose Campaign Defaults to Character Creation

## 1. Backend Enhancements
- [x] **Campaign Service:** Extend `DescribeGameplayRules` to return structured defaults and helper logic for character creation overrides.
- [x] **API Layer:** Introduce `/api/campaigns/{id}/character-creation` endpoint returning edition data plus gameplay rule overrides.
- [x] **Legacy JS Bridge:** Provide hooks on `window.ShadowmasterLegacyApp` for campaign defaults (React fills them at runtime).

## 2. Frontend Updates (React shell)
- [x] **Edition Context:** Fetch campaign-specific character creation config, merge resource overrides, and surface gameplay rules.
- [x] **Character Wizard:** Display campaign gameplay level and apply overrides (resources, karma) in UI/legacy bridge.
- [ ] **Campaign Creation UI:** Replace legacy modal with React wizard featuring:
  - Campaign name text field
  - Edition dropdown
  - Gameplay level dropdown (based on edition defaults)
  - Character creation method dropdown (defaulting to priority, other modes stubbed until implemented)
  - GM dropdown populated from active users with Gamemaster/Administrator roles
  - Optional group selector (hidden until group management exists)

## 3. Tests & Documentation
- [x] **Go Tests:** Added coverage for the campaign character-creation endpoint.
- [x] **React/Vitest:** Smoke test extended to cover campaign gameplay rule merging.
- [ ] **Docs:** Update `docs/application-architecture-plan.md` and related docs with campaign-aware character creation notes.

