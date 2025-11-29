# React Migration Notes

*Last updated: 2025-11-10*

> **Roadmap Reference:** Overall priorities now live in `docs/product/roadmap.md`. Use this file to capture React-specific migration details and decisions.

## Step 1 — React Foundation & Edition Context
- Added Vite + TypeScript scaffold under `web/ui/` with linting (`eslint`), formatting, and TypeScript compilation
- Builds emit to `web/static/` for compatibility with the Go HTTP server
- React requests character-creation data from `/api/editions/{edition}/character-creation` and `/api/campaigns/{id}/character-creation`
- Priority Assignment step is fully React-driven with dropdown workflow for Priority, Sum-to-Ten, and Karma methods
- Metatype selection is React-driven, sourcing modifiers/abilities from edition JSON
- Magic/Resonance selection is React-driven, supporting Magician, Adept, Mystic Adept, Aspected Magician, and Technomancer
- Introduced `EditionContext` with support for SR3 and SR5 editions
- React application uses React Router for full SPA navigation

## Step 2 — Campaign Management Reactification
- `CampaignCreation` React flow owns the entire campaign onboarding experience with edition, gameplay level, and creation method controls
- `CampaignTable` uses React components to list campaigns with admin/GM-scoped edit & delete actions
- Campaign management is fully React-based with modal dialogs for creation and editing
- Campaign support presets (factions, locations) are integrated into the campaign creation flow

## Development Workflow
- Install dependencies: `cd web/ui && npm install`
- Local iteration: `npm run dev` (Vite dev server on port 5173) or `make run-dev` (runs both API and frontend)
- Production bundle: `npm run build` (outputs to `web/static/`)
- Lint: `npm run lint`

## Current Status
- ✅ React application fully migrated from legacy static HTML/JS
- ✅ Character creation wizard for SR3 and SR5
- ✅ Campaign management (create, edit, view)
- ✅ User authentication and session management
- ✅ Character listing and management
- ✅ React Router for SPA navigation
- ✅ Tailwind CSS for styling
- ✅ React Aria Components for accessible UI

## Next Steps
- Equipment and gear selection interfaces
- Skill allocation improvements
- Dice rolling system
- Initiative tracking
- Combat state management
