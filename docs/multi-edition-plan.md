# Multi-Edition Support Plan

## Current State Summary
- **SR3 implementation**
  - Frontend: vanilla JS/CSS wizard covering priorities, metatype selection, attributes, magic. Several later steps (skills, gear, spells) still pending.
  - Backend: Go services renamed `race` → `metatype`; logic hard-codes SR3 rules for validation and derived stats.
- **SR5 implementation**
  - Docs: comprehensive specifications under `docs/5e/` (character creation, attributes, skills, magic, combat, gear, game concepts, questions & gaps).
  - Data: tables for priorities, metatypes, lifestyles, skill listings; many datasets still TODO (spells, gear catalog, augmentations, advancement costs, combat modifier tables).
  - Code: no frontend/backend implementation yet—specifications only.
- **Direction**: Focus on implementing SR5 first while ensuring the architecture can support additional editions (SR3, future rulesets).

## Goals
1. Deliver SR5 wizard and backend support using an edition-aware ruleset architecture that can be extended to other editions.
2. Identify and refactor shared UI/backend components for reuse across editions.
3. Migrate the frontend to React incrementally to manage complexity.
4. Separate edition-specific data (JSON) from shared utilities while keeping markdown specs as human-readable sources.

## Architectural Assessment (Immediate Actions)
1. Inventory current SR3 code paths to understand existing assumptions (JS wizard modules, Go services).
2. Document hardcoded priority tables, metatype modifiers, attribute caps, and derived stat calculations so they can be abstracted.
3. Identify shared UI components that can be parameterized (priority grid, attribute allocator, skill tables) and note any SR5-specific variations.

## Ruleset Interface Proposal
- Implement a shared `Ruleset` contract consumed by frontend and backend. Extend previous draft to allow optional features:
  ```text
  type Ruleset interface {
    Metadata() (edition string, version string)
    PriorityOptions() (PriorityConfig, error)
    Metatypes() ([]Metatype, error)
    Attributes() (AttributeRules, error)
    Skills() (SkillRules, error)
    Magic() (MagicRules, error)
    Validate(character DraftCharacter) (ValidationResult, error)
    DerivedStats(character DraftCharacter) (DerivedValues, error)
  }
  ```
- Edition implementations may return `NotImplemented` (via errors) for ruleset items that are not defined for that edition.
- `SR3Ruleset`: wraps existing logic during refactor. `SR5Ruleset`: primary focus for new work.
- Frontend passes edition key to load config; backend endpoints accept `edition` field and dispatch accordingly.

## Frontend Migration Strategy (React Adoption)
- Adopt React (Option B) to manage edition complexity.
- Migration plan:
  1. Introduce a React root (TypeScript recommended) hosting current wizard inside a compatibility component.
  2. Create an EditionContext provider to supply ruleset data to React components.
  3. Port wizard steps incrementally (priorities → metatypes → attributes → magic, etc.), replacing vanilla JS modules step-by-step.
  4. Retain existing JS logic temporarily by bridging with React hooks until fully migrated.
  5. Set up bundler/build pipeline (Vite or Webpack) and testing stack (Jest/React Testing Library).

## Data Separation Blueprint
- Edition data stored under `data/<edition>/` as JSON (stakeholder preference):
  - `data/sr5/priorities.json`, `data/sr5/metatypes.json`, `data/sr5/attributes.json`, `data/sr5/skills.json`, `data/sr5/combat_modifiers.json`, etc.
  - Create analogous SR3 files during refactor.
- Provide loaders that map edition key → data files → typed models.
- Keep markdown specs in `docs/<edition>/`; annotate JSON with metadata/version pointing back to source tables.
- Build transformation scripts (Node/Go) to regenerate JSON from markdown tables to avoid manual drift.

## SR5-First Phased Roadmap
**Step 1: React Foundation & Edition Context**
- [ ] Initialize React + TypeScript project structure (build pipeline, linting, tests).
- [ ] Introduce root React component that mounts existing wizard for backward compatibility.
- [ ] Create `EditionContext` provider/hooks to supply ruleset data.
- [ ] Load mock SR5 data via context to validate bootstrapping.
- [ ] Document setup in `/docs/frontend/react-migration.md`.

**Step 2: SR5 Data Ingestion (JSON)**
- [ ] Convert priority tables, metatype modifiers, lifestyles, skill lists into JSON.
- [ ] Populate combat modifier tables per `shadowrun-5e-combat.md`.
- [ ] Schedule ingestion for remaining datasets (spells, gear catalog, augmentations, advancement costs) and record timelines.

3. **SR5 Wizard Implementation**
   - Build React components for SR5 priorities/metatypes, driven by JSON data and ruleset API.
   - Implement SR5 attributes/magic validation in backend (`SR5Ruleset`).
   - Continue through skills, gear, lifestyle, run rewards as data becomes available.
   - For unimplemented sections, return `NotImplemented` errors with TODO references.

4. **SR3 Refactor into Ruleset Architecture**
   - After SR5 core flows are functional, wrap SR3 logic in `SR3Ruleset` implementing the same interface.
   - Migrate SR3 data to JSON to match new loaders.
   - Use shared React components, parameterized by edition config, to render SR3 wizard (ensuring backwards compatibility).

5. **Testing & Fixtures**
   - Add unit tests for SR5 ruleset (priority validation, attribute caps, derived stats).
   - Integration tests for SR5 wizard flow (React Testing Library/Cypress).
   - Create fixture characters for SR5 (and later SR3) to validate serialization and derived values.

6. **Documentation & Contributor Guidance**
   - Update `/docs/editions.md` (new) explaining ruleset architecture, data locations, and how to add/extend editions.
   - Ensure `docs/3e/` catches up with TODOs for parity with 5e documentation.
   - Document React migration guidelines and coding standards.

## Decisions Captured
- **Edition focus**: Implement SR5 first; maintain architecture flexibility for other editions.
- **Shared components**: identify and parameterize components for reuse across editions (agreed).
- **Ruleset interface**: allow `NotImplemented` responses for edition gaps.
- **Frontend tech**: adopt React and create migration plan.
- **Data format**: JSON files under `data/<edition>/`.
- **Initial SR5 release goal**: minimal wizard (priorities through attributes) for first milestone, then expand to full feature set.

## Next Steps Checklist
- [ ] Document SR3 hardcoded assumptions and shared component inventory.
- [ ] Set up React environment & EditionContext scaffold.
- [ ] Convert initial SR5 data tables to JSON and wire loaders.
- [ ] Implement SR5 priority/metatype React components and backend validation.

## Reference
- Previous open questions are now resolved in this plan per stakeholder responses (React adoption, SR5-first prioritization, JSON data format, minimal wizard milestone).

*Last updated: 2025-11-08*
