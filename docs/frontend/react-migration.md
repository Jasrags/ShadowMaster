# React Migration Notes

*Last updated: 2025-11-10*

> **Roadmap Reference:** Overall priorities now live in `docs/project-roadmap.md`. Use this file to capture React-specific migration details and decisions.

## Step 1 — React Foundation & Edition Context
- Added Vite + TypeScript scaffold under `web/app/` with linting (`eslint`), formatting (`prettier`), and a lightweight smoke test (`tsx`).
- Builds emit to `web/static/dist/main.js` for drop-in compatibility with the existing Go HTTP server.
- React now requests character-creation data from `/api/editions/{key}/character-creation` and shares the results with the legacy wizard bridge.
- Priority Assignment step is rendered via React (dropdown workflow) and syncs selections back to legacy state; legacy drag-and-drop UI is hidden when the React component mounts.
- Metatype selection is React-driven, sourcing modifiers/abilities from edition JSON and feeding the legacy validations.
- Magical Abilities step is React-driven, mirroring SR3 logic (Full Magician, Adept, Aspected, Mundane), handling tradition/totem choices, and synchronizing with legacy validation.
- Introduced `EditionContext` with SR5 as the default active ruleset and SR3 recorded for parity.
- React shell mounts into `#shadowmaster-react-root` without disturbing the legacy DOM and triggers `window.ShadowmasterLegacyApp.initialize()` when needed.
- Legacy wizard exposes `initializeLegacyApp` and `isInitialized` for future React components to coordinate progressive rewrites.

## Step 2 — Campaign Management Reactification
- `CampaignCreation` React flow now owns the entire campaign onboarding experience with edition, gameplay level, and creation method controls.
- `CampaignTable` reuses the shared `DataTable` to list campaigns with admin/GM-scoped edit & delete actions plus empty-state messaging.
- Legacy prompt-driven campaign creation and the static `#create-campaign-btn` have been removed; React is now the only way to create campaigns.
- React bridge dispatches `shadowmaster:campaigns:refresh` events so any remaining legacy consumers stay synchronized during the migration window.

## Development Workflow
- Install dependencies: `cd web/app && npm install`
- Local iteration: `npm run dev` (Vite dev server) *(TODO: proxy backend endpoints)*
- Production bundle: `npm run build` (outputs to `web/static/dist/`)
- Tests: `npm test` (runs `tsx src/smoke-test.tsx`)
- Lint: `npm run lint`

## Next Steps
- Convert the remaining character creation steps (attributes, summary, validation) into React-managed flows.
- Replace the legacy character list/cards with a shared `DataTable` implementation.
- Continue pruning direct DOM manipulation from `web/static/js/app.js` as React covers more surfaces.
