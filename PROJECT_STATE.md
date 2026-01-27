# PROJECT_STATE.md

**Last Updated:** 2026-01-10

## Current Focus

1. **MVP Polish:** Finalizing the character creation sheet workflow and addressing minor UI/UX inconsistencies.
2. **Character Sheet Integration:** Multiple gameplay subsystems have backend/API complete but need UI integration into the character sheet.
3. **Gameplay Features Transition:** Combat tracker, augmentations panel, and matrix/rigging interfaces ready for integration.

## Subsystem Status

### Core Systems (Production Ready)

| Subsystem                 | State       | Notes                                                                               |
| ------------------------- | ----------- | ----------------------------------------------------------------------------------- |
| **Ruleset System**        | Implemented | Core SR5 ruleset complete; support for merging sourcebooks exists.                  |
| **Character Creation**    | Implemented | Sheet-based SR5 Priority creation including Magic, Resonance, Rigging, and Decking. |
| **Character Sheet**       | Implemented | Persistent viewing and theming of finalized characters.                             |
| **Character Advancement** | Implemented | Core karma logic and GM Approval UI are functional.                                 |
| **Campaign Management**   | Implemented | Basic campaign creation, player roster, and location management complete.           |
| **Authentication**        | Implemented | Email/password auth with secure session management.                                 |
| **File-Based Storage**    | Implemented | Atomic JSON-based persistence layers for all entities.                              |
| **UI/UX Framework**       | Implemented | Next.js 16, React 19, React Aria, and Tailwind CSS 4 foundation.                    |

### Gameplay Systems (Backend Complete, UI Pending Integration)

| Subsystem              | State            | Notes                                                                                 | Issue                                                    |
| ---------------------- | ---------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Matrix Operations**  | Backend Complete | Rule engine, API routes, and UI components built. Needs character sheet integration.  | [#88](https://github.com/Jasrags/ShadowMaster/issues/88) |
| **Rigging/Drones**     | Backend Complete | VCR, RCC, drone network, noise calculation complete. UI needs integration.            | [#89](https://github.com/Jasrags/ShadowMaster/issues/89) |
| **Combat Tracker**     | UI Built         | Components for initiative, actions, condition monitors built. Needs page integration. | [#90](https://github.com/Jasrags/ShadowMaster/issues/90) |
| **Augmentations**      | Backend Complete | Full cyberware/bioware/cyberlimb API and rule engine. UI components ready.            | [#91](https://github.com/Jasrags/ShadowMaster/issues/91) |
| **Magic/Technomancer** | UI Built         | Spellbook, adept powers, magic summary components built. Needs integration.           | [#92](https://github.com/Jasrags/ShadowMaster/issues/92) |

### Planned Systems (Not Started)

| Subsystem                  | State       | Notes                                                                                     |
| -------------------------- | ----------- | ----------------------------------------------------------------------------------------- |
| **Sourcebook Integration** | Not Started | Infrastructure exists but specific sourcebook data (Run Faster, etc.) not yet integrated. |
| **Inventory Management**   | Not Started | Planned post-creation gear and ammunition tracking.                                       |
| **NPC / Grunt System**     | Design Only | Specified in documentation but no implementation exists yet.                              |
| **System Synchronization** | Design Only | Draft specification for managing data drift between characters and rulesets.              |
| **Session Persistence**    | Not Started | Planned WebSocket implementation for real-time collaboration.                             |

## Recent Changes (2026-01-10)

- Performed Knip dead code analysis and triage
- Created GitHub issues for all pending UI integrations (#88-#92)
- Removed unused `SpecialAttributesCard.tsx` component
- Cleaned up `knip.config.ts` configuration
- Updated dependency declarations

## Explicit Blockers and Dependencies

- **NPCs/Grunts (Not Started):** Blocks the implementation of the **Encounter System** and full **Combat Tracker** functionality.
- **Encounter System (Not Started):** Blocks the realization of full **Gameplay Actions**.
- **System Synchronization (Draft):** Blocks safe updates to rulebooks and character migrations.
- **Character Sheet Integration:** Multiple completed backends are blocked on UI integration work.

## Technical Debt Tracking

| Item                          | Status               | Issue                                                    |
| ----------------------------- | -------------------- | -------------------------------------------------------- |
| Unused context hooks review   | Scheduled April 2026 | [#93](https://github.com/Jasrags/ShadowMaster/issues/93) |
| Barrel file strategy decision | Pending discussion   | [#94](https://github.com/Jasrags/ShadowMaster/issues/94) |

## Quick Reference: Backend Complete Systems

These systems have full rule engines and API routes but need UI wiring:

```
lib/rules/matrix/          → components/character/Matrix*.tsx
lib/rules/rigging/         → components/character/Rigging*.tsx, Drone*.tsx
lib/rules/augmentations/   → components/cyberlimbs/*, AugmentationsPanel.tsx
components/combat/         → CombatTrackerModal.tsx integration
```
