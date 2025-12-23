# PROJECT_STATE.md

**Last Updated:** 2025-12-23

## Current Focus

1. **MVP Polish:** Finalizing the character creation wizard and addressing minor UI/UX inconsistencies.
2. **Gameplay Features Transition:** Starting implementation of post-creation features like the Combat Tracker and Inventory Management.

## Subsystem Status

| Subsystem                  | State       | Notes                                                                                         |
| -------------------------- | ----------- | --------------------------------------------------------------------------------------------- |
| **Ruleset System**         | Implemented | Core SR5 ruleset complete; support for merging sourcebooks exists.                            |
| **Character Creation**     | Implemented | Full wizard for SR5 Priority-based creation including Magic, Resonance, Rigging, and Decking. |
| **Character Sheet**        | Implemented | Persistent viewing and theming of finalized characters.                                       |
| **Character Advancement**  | Implemented | Core karma logic and GM Approval UI are functional.                                           |
| **Campaign Management**    | Implemented | Basic campaign creation, player roster, and location management complete.                     |
| **Authentication**         | Implemented | Email/password auth with secure session management.                                           |
| **File-Based Storage**     | Implemented | Atomic JSON-based persistence layers for all entities.                                        |
| **UI/UX Framework**        | Implemented | Next.js 16, React 19, React Aria, and Tailwind CSS 4 foundation.                              |
| **Sourcebook Integration** | Not Started | Infrastructure exists but specific sourcebook data (Run Faster, etc.) not yet integrated.     |
| **Combat Tracker**         | Not Started | Planned gameplay feature for GM initiative and turn tracking.                                 |
| **Inventory Management**   | Not Started | Planned post-creation gear and ammunition tracking.                                           |
| **NPC / Grunt System**     | Design Only | Specified in documentation but no implementation exists yet.                                  |
| **System Synchronization** | Design Only | Draft specification for managing data drift between characters and rulesets.                  |
| **Session Persistence**    | Not Started | Planned WebSocket implementation for real-time collaboration.                                 |

## Explicit Blockers and Dependencies

- **NPCs/Grunts (Not Started):** Blocks the implementation of the **Encounter System** and **Combat Tracker**.
- **Encounter System (Not Started):** Blocks the realization of full **Gameplay Actions**.
- **System Synchronization (Draft):** Blocks safe updates to rulebooks and character migrations.
