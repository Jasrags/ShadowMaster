# Gameplay Features Implementation Plan

---

## 📋 Document Maintenance Guide

**IMPORTANT:** When adding, updating, or completing tasks in this document, follow these formatting and tracking conventions to maintain consistency.

### Status Indicators

Use these exact status indicators throughout the document:

- `✅ Complete` - Task/phase is fully implemented and tested
- `🔄 In Progress` - Task/phase is currently being worked on
- `🔜 Next` - Task/phase is next in queue (only one should have this status)
- `Not Started` - Task/phase has not been started yet

### Task ID Format

- **Phase-level tasks:** Use format `G1`, `G2`, `G3`, etc. (G = Gameplay)
- **Sub-phase tasks:** Use format `G1.1`, `G2.3`, etc.
- **Individual tasks:** Use format `G1.1.1`, `G2.3.4`, etc.
- **File modification markers:** Use format `G1.1.FM.1`, `G1.2.FM.2`, etc. (FM = Files to Modify)

### When Adding New Tasks

1. **Add to Recommended Work Items table** (if high priority):
   - Include: #, Task, Effort (Small/Medium/Large), Phase, Status
   - Use consistent task description format

2. **Add to appropriate Phase section:**
   - Add task row to the phase's **Tasks** table
   - Include: Task ID, Description, Status
   - Add corresponding JSON entry in **Tasks JSON** section

3. **Update Phase Summary tables:**
   - Update "Full Phase Summary with Status" table
   - Update "Phase Summary (Quick Reference)" table

4. **Task JSON format** (required for each task):
   ```json
   {
     "id": "G1.X.Y",
     "title": "Task title (same as table)",
     "description": "Phase objective description. Task title.",
     "files": ["/path/to/file1.tsx", "/path/to/file2.ts"],
     "status": "Complete" | "In Progress" | "Not Started",
     "dependsOn": ["G1.X.Z"] // Array of task IDs, empty array if none
   }
   ```

### When Completing Tasks

1. **Update task status** in all locations:
   - Recommended Work Items table (if present)
   - Phase's Tasks table
   - Phase's Tasks JSON (change `"status": "Complete"`)
   - Phase Summary tables (if phase is complete, mark as `✅ Complete`)

2. **Add completion entry** to "Completed Work Summary" table:
   - Include: Phase, Completion Date (format: "Dec 2024"), Key Deliverables

3. **Update phase status** in summary tables:
   - If all tasks in a phase are complete, mark phase as `✅ Complete`
   - If some tasks are complete, keep phase as `🔄 In Progress`
   - Update "Next Steps" in Recommended Work Items if priorities change

### Table Formatting Standards

- **Recommended Work Items:** `| # | Task | Effort | Phase | Status |`
- **Phase Summary:** `| Order | Phase | Focus Area | Duration | Priority | Status |`
- **Tasks table:** `| Task | Description | Status |`
- **Completed Work Summary:** `| Phase | Completion Date | Key Deliverables |`

### Phase Structure Template

Each phase section should include:

1. **Phase header** with objective and priority
2. **Files to modify/create** section with numbered file markers (e.g., `G1.1.FM.1`, `G1.1.FC.1`)
3. **Tasks** table with Task ID, Description, Status
4. **Tasks JSON** section with complete JSON array matching all tasks

### Dependencies

- Always specify `dependsOn` in JSON (empty array `[]` if no dependencies)
- Update dependencies when task relationships change
- Ensure dependency chain is logical (no circular dependencies)

### Consistency Checks

Before finalizing updates, verify:
- ✅ All status indicators match across all tables
- ✅ Task IDs are unique and follow numbering convention
- ✅ JSON task entries match table entries exactly
- ✅ Phase status reflects completion of all tasks in that phase
- ✅ Completion dates are added to Completed Work Summary
- ✅ File paths in JSON use absolute paths from project root

---

## Overview

**Goal:** Complete gameplay features for running Shadowrun sessions
**Timeline:** 6-9 weeks post-character creation
**Prerequisites:** Character creation complete (all archetypes supported)

This document breaks down gameplay features into actionable implementation phases with specific tasks, dependencies, and acceptance criteria. These features enable game masters to run sessions and players to manage their characters during gameplay.

---

## Recommended Work Items (Priority Order)

This section prioritizes the most critical gameplay features needed to support actual Shadowrun sessions. The list is ordered by priority to guide immediate development efforts.

| # | Task | Effort | Phase | Status |
|---|------|--------|-------|--------|
| 1 | Implement combat tracker data structures and API | Large | G1 (B4) | Not Started |
| 2 | Create combat tracker UI with initiative order and turn management | Large | G1 (B4) | Not Started |
| 3 | Implement inventory management data structures and API | Medium | G2 (B3) | Not Started |
| 4 | Create inventory management UI with equipment tracking | Medium | G2 (B3) | Not Started |
| 5 | Implement WebSocket infrastructure for real-time updates | Large | G3 (B9) | Not Started |
| 6 | Add real-time combat session sharing | Medium | G3 (B9) | Not Started |

**Next Steps:** Begin G1 (Combat Tracker) to provide core GM tools for running combat encounters.

---

## Complete Implementation Order

This section provides a comprehensive view of the entire gameplay features roadmap, showing all phases with their status. It serves as both a planning document and progress tracker, allowing quick assessment of what's complete and what remains.

### Full Phase Summary with Status

> **Priority Strategy:** Core gameplay features (combat, inventory) are prioritized over multiplayer infrastructure. Combat tracker enables the most critical GM functionality.

| Order | Phase | Focus Area | Duration | Priority | Status |
|-------|-------|-----------|----------|----------|--------|
| 1 | **G1** | **Combat Tracker** | **3-4 weeks** | **High** | **Not Started** |
| 2 | **G2** | **Inventory Management** | **1-2 weeks** | **High** | **Not Started** |
| 3 | **G3** | **Session Persistence & WebSockets** | **2-3 weeks** | **Medium** | **Not Started** |

### Completed Work Summary

| Phase | Completion Date | Key Deliverables |
|-------|-----------------|------------------|
| *(No phases completed yet)* | | |

### Estimated Remaining Timeline

| Milestone | Phases | Est. Duration |
|-----------|--------|---------------|
| Core Gameplay Features | G1, G2 | 4-6 weeks |
| Multiplayer Infrastructure | G3 | 2-3 weeks |
| **Total to Gameplay Release** | All | **6-9 weeks** |

---

## Phase Summary (Quick Reference)

> **Priority Strategy:** Combat tracker first (core GM tool), then inventory management (character management), then multiplayer (nice-to-have).

| Phase | Focus Area | Duration | Priority | Status |
|-------|-----------|----------|----------|--------|
| G1 | Combat Tracker | 3-4 weeks | High | Not Started |
| G2 | Inventory Management | 1-2 weeks | High | Not Started |
| G3 | Session Persistence & WebSockets | 2-3 weeks | Medium | Not Started |

---

## Phase G1: Combat Tracker

**Objective:** Full combat encounter management with initiative, turns, and damage.

This phase implements a complete combat tracking system that manages initiative, turn order, damage application, and combat state for game masters running Shadowrun sessions. It supports multiple combatants, initiative passes, condition tracking, and combat logging. The result enables smooth combat encounter management with minimal manual tracking overhead.

**Priority:** High - Core GM tool for running sessions

**Dependencies:**
- Character creation complete (characters exist to add to combat)
- Character data structure includes health/stats

### G1.1 Data Structures

This milestone establishes the core data structures needed to represent combat sessions, combatants, initiative order, and combat actions. It defines interfaces for tracking health, conditions, initiative passes, and combat rounds. The goal is to create a comprehensive type system that accurately models SR5 combat mechanics including multi-pass initiative and various combatant types.

**Files to create:**
- **G1.1.FC.1** `/lib/types/combat.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| G1.1.1 | Create CombatSession interface | Not Started |
| G1.1.2 | Create Combatant interface with initiative data embedded (character or NPC) | Not Started |
| G1.1.3 | Create CombatAction interface | Not Started |
| G1.1.4 | Create CombatLog interface for history | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "G1.1.1",
    "title": "Create CombatSession interface",
    "description": "This milestone establishes the core data structures needed to represent combat sessions, combatants, initiative order, and combat actions. It defines interfaces for tracking health, conditions, initiative passes, and combat rounds. The goal is to create a comprehensive type system that accurately models SR5 combat mechanics including multi-pass initiative and various combatant types. Create CombatSession interface.",
    "files": [
      "/lib/types/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "G1.1.2",
    "title": "Create Combatant interface with initiative data embedded (character or NPC)",
    "description": "This milestone establishes the core data structures needed to represent combat sessions, combatants, initiative order, and combat actions. It defines interfaces for tracking health, conditions, initiative passes, and combat rounds. The goal is to create a comprehensive type system that accurately models SR5 combat mechanics including multi-pass initiative and various combatant types. Create Combatant interface with initiative data embedded (character or NPC).",
    "files": [
      "/lib/types/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "G1.1.3",
    "title": "Create CombatAction interface",
    "description": "This milestone establishes the core data structures needed to represent combat sessions, combatants, initiative order, and combat actions. It defines interfaces for tracking health, conditions, initiative passes, and combat rounds. The goal is to create a comprehensive type system that accurately models SR5 combat mechanics including multi-pass initiative and various combatant types. Create CombatAction interface.",
    "files": [
      "/lib/types/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "G1.1.4",
    "title": "Create CombatLog interface for history",
    "description": "This milestone establishes the core data structures needed to represent combat sessions, combatants, initiative order, and combat actions. It defines interfaces for tracking health, conditions, initiative passes, and combat rounds. The goal is to create a comprehensive type system that accurately models SR5 combat mechanics including multi-pass initiative and various combatant types. Create CombatLog interface for history.",
    "files": [
      "/lib/types/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  }
]
```

**Combat Data Structure:**
```typescript
interface CombatSession {
  id: string;
  campaignId?: string;
  gmId: string;
  name: string;
  status: 'preparing' | 'active' | 'paused' | 'completed';
  combatants: Combatant[];
  currentRound: number;
  currentPass: number;
  currentTurnIndex: number;
  initiativeOrder: string[];  // Array of combatant IDs sorted by total initiative
  environmentModifiers: EnvironmentModifier[];
  combatLog: CombatLogEntry[];
  createdAt: string;
  updatedAt: string;
}

interface Combatant {
  id: string;
  characterId?: string;    // For player characters
  npcId?: string;          // For NPCs
  name: string;
  type: 'pc' | 'npc' | 'spirit' | 'sprite' | 'drone';
  team: 'player' | 'enemy' | 'neutral';
  initiative: number;
  initiativeDice: number;  // How many d6s for initiative
  currentPhysical: number;
  maxPhysical: number;
  currentStun: number;
  maxStun: number;
  conditions: CombatCondition[];
  actionsRemaining: {
    free: number;
    simple: number;
    complex: number;
  };
}

interface CombatAction {
  id: string;
  sessionId: string;
  combatantId: string;
  actionType: 'initiative' | 'attack' | 'defend' | 'delay' | 'pass' | 'damage' | 'heal';
  timestamp: string;
  details: Record<string, unknown>;
}

interface CombatLogEntry {
  id: string;
  sessionId: string;
  timestamp: string;
  combatantId?: string;
  action: string;
  details?: Record<string, unknown>;
}
```

### G1.2 Combat API and Storage Layer

This milestone implements the complete combat persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides session management, combatant management, and action logging. The API design supports both single-player and multiplayer combat scenarios and will integrate with WebSockets in Phase G3.

**Files to create:**
- **G1.2.FC.1** `/lib/storage/combat.ts`
- **G1.2.FC.2** `/app/api/combat/route.ts`
- **G1.2.FC.3** `/app/api/combat/[sessionId]/route.ts`
- **G1.2.FC.4** `/app/api/combat/[sessionId]/actions/route.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| G1.2.1 | Implement combat session CRUD (storage functions + API: GET /combat, POST /combat, GET /combat/[id], PUT /combat/[id], DELETE /combat/[id]) | Not Started |
| G1.2.2 | Implement combatant management (addCombatant, removeCombatant storage functions) | Not Started |
| G1.2.3 | Implement combat actions endpoint (POST /combat/[id]/actions with action: 'initiative' | 'turn' | 'damage' | 'delay') | Not Started |
| G1.2.4 | Implement combat action logging (logCombatAction storage function) | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "G1.2.1",
    "title": "Implement combat session CRUD (storage functions + API: GET /combat, POST /combat, GET /combat/[id], PUT /combat/[id], DELETE /combat/[id])",
    "description": "This milestone implements the complete combat persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides session management, combatant management, and action logging. The API design supports both single-player and multiplayer combat scenarios and will integrate with WebSockets in Phase G3. Implement combat session CRUD (storage functions + API: GET /combat, POST /combat, GET /combat/[id], PUT /combat/[id], DELETE /combat/[id]).",
    "files": [
      "/lib/storage/combat.ts",
      "/app/api/combat/route.ts",
      "/app/api/combat/[sessionId]/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G1.1.1"]
  },
  {
    "id": "G1.2.2",
    "title": "Implement combatant management (addCombatant, removeCombatant storage functions)",
    "description": "This milestone implements the complete combat persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides session management, combatant management, and action logging. The API design supports both single-player and multiplayer combat scenarios and will integrate with WebSockets in Phase G3. Implement combatant management (addCombatant, removeCombatant storage functions).",
    "files": [
      "/lib/storage/combat.ts",
      "/app/api/combat/[sessionId]/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G1.1.2", "G1.2.1"]
  },
  {
    "id": "G1.2.3",
    "title": "Implement combat actions endpoint (POST /combat/[id]/actions with action: 'initiative' | 'turn' | 'damage' | 'delay')",
    "description": "This milestone implements the complete combat persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides session management, combatant management, and action logging. The API design supports both single-player and multiplayer combat scenarios and will integrate with WebSockets in Phase G3. Implement combat actions endpoint (POST /combat/[id]/actions with action: 'initiative' | 'turn' | 'damage' | 'delay').",
    "files": [
      "/app/api/combat/[sessionId]/actions/route.ts",
      "/lib/storage/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G1.1.3", "G1.2.1"]
  },
  {
    "id": "G1.2.4",
    "title": "Implement combat action logging (logCombatAction storage function)",
    "description": "This milestone implements the complete combat persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides session management, combatant management, and action logging. The API design supports both single-player and multiplayer combat scenarios and will integrate with WebSockets in Phase G3. Implement combat action logging (logCombatAction storage function).",
    "files": [
      "/lib/storage/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G1.1.4", "G1.2.3"]
  }
]
```

### G1.3 Combat UI

This milestone creates the complete combat tracking user interface with initiative order display, combatant health bars, action panels, and combat logging. It provides an intuitive interface for game masters to manage combat encounters with clear visual indicators for turn order, damage states, and combat progress. The UI integrates with dice rolling and supports all SR5 combat mechanics.

**Files to create:**
- **G1.3.FC.1** `/app/combat/page.tsx` (combat session list)
- **G1.3.FC.2** `/app/combat/[sessionId]/page.tsx` (active combat tracker)
- **G1.3.FC.3** `/components/combat/InitiativeTracker.tsx`
- **G1.3.FC.4** `/components/combat/CombatantCard.tsx`
- **G1.3.FC.5** `/components/combat/ActionPanel.tsx`
- **G1.3.FC.6** `/components/combat/DamageModal.tsx`
- **G1.3.FC.7** `/components/combat/CombatLog.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| G1.3.1 | Create combat session list page with new session form | Not Started |
| G1.3.2 | Create InitiativeTracker with turn order display | Not Started |
| G1.3.3 | Create CombatantCard with health bars | Not Started |
| G1.3.4 | Create ActionPanel for current turn actions | Not Started |
| G1.3.5 | Create DamageModal for applying damage | Not Started |
| G1.3.6 | Create CombatLog showing action history | Not Started |
| G1.3.7 | Add condition management, round/pass counter, and DiceRoller integration | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "G1.3.1",
    "title": "Create combat session list page with new session form",
    "description": "This milestone creates the complete combat tracking user interface with initiative order display, combatant health bars, action panels, and combat logging. It provides an intuitive interface for game masters to manage combat encounters with clear visual indicators for turn order, damage states, and combat progress. The UI integrates with dice rolling and supports all SR5 combat mechanics. Create combat session list page with new session form.",
    "files": [
      "/app/combat/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["G1.2.1"]
  },
  {
    "id": "G1.3.2",
    "title": "Create InitiativeTracker with turn order display",
    "description": "This milestone creates the complete combat tracking user interface with initiative order display, combatant health bars, action panels, and combat logging. It provides an intuitive interface for game masters to manage combat encounters with clear visual indicators for turn order, damage states, and combat progress. The UI integrates with dice rolling and supports all SR5 combat mechanics. Create InitiativeTracker with turn order display.",
    "files": [
      "/components/combat/InitiativeTracker.tsx",
      "/app/combat/[sessionId]/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["G1.2.3"]
  },
  {
    "id": "G1.3.3",
    "title": "Create CombatantCard with health bars",
    "description": "This milestone creates the complete combat tracking user interface with initiative order display, combatant health bars, action panels, and combat logging. It provides an intuitive interface for game masters to manage combat encounters with clear visual indicators for turn order, damage states, and combat progress. The UI integrates with dice rolling and supports all SR5 combat mechanics. Create CombatantCard with health bars.",
    "files": [
      "/components/combat/CombatantCard.tsx",
      "/app/combat/[sessionId]/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["G1.2.2"]
  },
  {
    "id": "G1.3.4",
    "title": "Create ActionPanel for current turn actions",
    "description": "This milestone creates the complete combat tracking user interface with initiative order display, combatant health bars, action panels, and combat logging. It provides an intuitive interface for game masters to manage combat encounters with clear visual indicators for turn order, damage states, and combat progress. The UI integrates with dice rolling and supports all SR5 combat mechanics. Create ActionPanel for current turn actions.",
    "files": [
      "/components/combat/ActionPanel.tsx",
      "/app/combat/[sessionId]/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["G1.2.3", "G1.3.2"]
  },
  {
    "id": "G1.3.5",
    "title": "Create DamageModal for applying damage",
    "description": "This milestone creates the complete combat tracking user interface with initiative order display, combatant health bars, action panels, and combat logging. It provides an intuitive interface for game masters to manage combat encounters with clear visual indicators for turn order, damage states, and combat progress. The UI integrates with dice rolling and supports all SR5 combat mechanics. Create DamageModal for applying damage.",
    "files": [
      "/components/combat/DamageModal.tsx",
      "/app/combat/[sessionId]/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["G1.2.3", "G1.3.3"]
  },
  {
    "id": "G1.3.6",
    "title": "Create CombatLog showing action history",
    "description": "This milestone creates the complete combat tracking user interface with initiative order display, combatant health bars, action panels, and combat logging. It provides an intuitive interface for game masters to manage combat encounters with clear visual indicators for turn order, damage states, and combat progress. The UI integrates with dice rolling and supports all SR5 combat mechanics. Create CombatLog showing action history.",
    "files": [
      "/components/combat/CombatLog.tsx",
      "/app/combat/[sessionId]/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["G1.2.4"]
  },
  {
    "id": "G1.3.7",
    "title": "Add condition management, round/pass counter, and DiceRoller integration",
    "description": "This milestone creates the complete combat tracking user interface with initiative order display, combatant health bars, action panels, and combat logging. It provides an intuitive interface for game masters to manage combat encounters with clear visual indicators for turn order, damage states, and combat progress. The UI integrates with dice rolling and supports all SR5 combat mechanics. Add condition management, round/pass counter, and DiceRoller integration.",
    "files": [
      "/components/combat/CombatantCard.tsx",
      "/components/combat/ActionPanel.tsx",
      "/app/combat/[sessionId]/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["G1.3.3", "G1.3.4"]
  }
]
```

**UI Wireframe:**
```
┌─────────────────────────────────────────────────────────────┐
│ Combat: Warehouse Ambush         Round 2 | Pass 1          │
│ [Pause] [End Combat] [Add Combatant]                        │
├─────────────────────────────────────────────────────────────┤
│ INITIATIVE ORDER                                            │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 1. Ghost (PC)         Initiative: 18  [Current Turn →] ││
│ │    Physical: ████████░░ 8/10  Stun: ████████░░ 8/10    ││
│ │    [Damage] [Heal] [Delay] [Pass]                      ││
│ └─────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 2. Security Guard (Enemy)  Initiative: 15               ││
│ │    Physical: ████████░░ 8/10  Stun: ████████░░ 8/10    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ COMBATANTS                                                  │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Ghost (PC)                                              ││
│ │ Physical: ████████░░ 8/10  Stun: ████████░░ 8/10      ││
│ │ Conditions: None                                        ││
│ │ [View Character] [Remove]                               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ COMBAT LOG                                                  │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Round 2, Pass 1 - Ghost's turn                          ││
│ │ Round 1, Pass 3 - Security Guard attacks Ghost (-2 P)  ││
│ │ Round 1, Pass 1 - Initiative rolled                     ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### G1.4 Acceptance Criteria

- **G1.4.AC.1** [ ] GM can create new combat sessions
- **G1.4.AC.2** [ ] GM can add player characters and NPCs to combat
- **G1.4.AC.3** [ ] Initiative can be rolled for all combatants
- **G1.4.AC.4** [ ] Turn order displays correctly sorted by initiative
- **G1.4.AC.5** [ ] GM can advance to next turn/pass
- **G1.4.AC.6** [ ] Damage can be applied to combatants (physical/stun)
- **G1.4.AC.7** [ ] Health bars update correctly
- **G1.4.AC.8** [ ] Combat conditions can be tracked (prone, suppressed, etc.)
- **G1.4.AC.9** [ ] Combat log records all actions
- **G1.4.AC.10** [ ] Round and pass counters work correctly

---

## Phase G2: Inventory Management

**Objective:** Full post-creation gear management with tracking.

This phase creates a comprehensive inventory management system that allows players to track gear, ammunition, equipment condition, and encumbrance after character creation. It provides full CRUD operations for inventory items and integrates with the gear catalog for adding new items. The result enables complete gear lifecycle management throughout a character's career.

**Priority:** High - Essential for character management during gameplay

**Dependencies:**
- Character creation complete (characters exist to manage inventory for)
- Gear catalog exists (from character creation)

### G2.1 Data Structure Updates

This milestone establishes the data structures needed to represent inventory items, equipment states, and encumbrance calculations. It defines interfaces for inventory items with condition tracking, equipped state, ammunition counts, and modifications. The goal is to create a flexible system that supports all gear management needs including equipment slots and weight calculations.

**Files to modify:**
- **G2.1.FM.1** `/lib/types/character.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| G2.1.1 | Add InventoryItem interface with condition tracking | Not Started |
| G2.1.2 | Add Inventory interface with capacity/weight calculations | Not Started |
| G2.1.3 | Add EquipmentSlot enum for equipped items | Not Started |
| G2.1.4 | Add AmmoTracker type for ammunition management | Not Started |
| G2.1.5 | Update Character.gear to use new Inventory structure | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "G2.1.1",
    "title": "Add InventoryItem interface with condition tracking",
    "description": "This milestone establishes the data structures needed to represent inventory items, equipment states, and encumbrance calculations. It defines interfaces for inventory items with condition tracking, equipped state, ammunition counts, and modifications. The goal is to create a flexible system that supports all gear management needs including equipment slots and weight calculations. Add InventoryItem interface with condition tracking.",
    "files": [
      "/lib/types/character.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "G2.1.2",
    "title": "Add Inventory interface with capacity/weight calculations",
    "description": "This milestone establishes the data structures needed to represent inventory items, equipment states, and encumbrance calculations. It defines interfaces for inventory items with condition tracking, equipped state, ammunition counts, and modifications. The goal is to create a flexible system that supports all gear management needs including equipment slots and weight calculations. Add Inventory interface with capacity/weight calculations.",
    "files": [
      "/lib/types/character.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "G2.1.3",
    "title": "Add EquipmentSlot enum for equipped items",
    "description": "This milestone establishes the data structures needed to represent inventory items, equipment states, and encumbrance calculations. It defines interfaces for inventory items with condition tracking, equipped state, ammunition counts, and modifications. The goal is to create a flexible system that supports all gear management needs including equipment slots and weight calculations. Add EquipmentSlot enum for equipped items.",
    "files": [
      "/lib/types/character.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "G2.1.4",
    "title": "Add AmmoTracker type for ammunition management",
    "description": "This milestone establishes the data structures needed to represent inventory items, equipment states, and encumbrance calculations. It defines interfaces for inventory items with condition tracking, equipped state, ammunition counts, and modifications. The goal is to create a flexible system that supports all gear management needs including equipment slots and weight calculations. Add AmmoTracker type for ammunition management.",
    "files": [
      "/lib/types/character.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "G2.1.5",
    "title": "Update Character.gear to use new Inventory structure",
    "description": "This milestone establishes the data structures needed to represent inventory items, equipment states, and encumbrance calculations. It defines interfaces for inventory items with condition tracking, equipped state, ammunition counts, and modifications. The goal is to create a flexible system that supports all gear management needs including equipment slots and weight calculations. Update Character.gear to use new Inventory structure.",
    "files": [
      "/lib/types/character.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G2.1.1", "G2.1.2", "G2.1.3", "G2.1.4"]
  }
]
```

**Inventory Data Structure:**
```typescript
interface InventoryItem {
  id: string;
  itemId: string;           // Reference to catalog item
  name: string;
  category: GearCategory;
  quantity: number;
  condition: 'pristine' | 'good' | 'worn' | 'damaged' | 'destroyed';
  equipped: boolean;
  slot?: EquipmentSlot;
  modifications?: ItemModification[];
  ammoLoaded?: number;      // For weapons
  ammoType?: string;        // Ammo variant
  notes?: string;
}

interface Inventory {
  items: InventoryItem[];
  totalWeight: number;
  carryingCapacity: number; // STR × 10 kg
  encumbranceLevel: 'none' | 'light' | 'medium' | 'heavy';
  nuyen: number;            // Current cash on hand
  credsticks: Credstick[];
}
```

### G2.2 Inventory API and Storage Layer

This milestone implements the complete inventory persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides full CRUD operations for inventory items, ammunition management actions, and encumbrance calculations.

**Files to create:**
- **G2.2.FC.1** `/app/api/characters/[characterId]/inventory/route.ts`
- **G2.2.FC.2** `/app/api/characters/[characterId]/inventory/actions/route.ts`

**Files to modify:**
- **G2.2.FM.1** `/lib/storage/characters.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| G2.2.1 | Implement inventory CRUD operations (API endpoints: GET, POST, PUT, DELETE + storage functions: addInventoryItem, removeInventoryItem, updateInventoryItem) | Not Started |
| G2.2.2 | Implement ammunition management actions endpoint (POST /actions with action: 'reload' | 'fire') | Not Started |
| G2.2.3 | Add calculateEncumbrance utility function | Not Started |
| G2.2.4 | Add transferItem between characters (future: party loot) | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "G2.2.1",
    "title": "Implement inventory CRUD operations (API endpoints: GET, POST, PUT, DELETE + storage functions: addInventoryItem, removeInventoryItem, updateInventoryItem)",
    "description": "This milestone implements the complete inventory persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides full CRUD operations for inventory items, ammunition management actions, and encumbrance calculations. Implement inventory CRUD operations (API endpoints: GET, POST, PUT, DELETE + storage functions: addInventoryItem, removeInventoryItem, updateInventoryItem).",
    "files": [
      "/app/api/characters/[characterId]/inventory/route.ts",
      "/lib/storage/characters.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G2.1.5"]
  },
  {
    "id": "G2.2.2",
    "title": "Implement ammunition management actions endpoint (POST /actions with action: 'reload' | 'fire')",
    "description": "This milestone implements the complete inventory persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides full CRUD operations for inventory items, ammunition management actions, and encumbrance calculations. Implement ammunition management actions endpoint (POST /actions with action: 'reload' | 'fire').",
    "files": [
      "/app/api/characters/[characterId]/inventory/actions/route.ts",
      "/lib/storage/characters.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G2.2.1"]
  },
  {
    "id": "G2.2.3",
    "title": "Add calculateEncumbrance utility function",
    "description": "This milestone implements the complete inventory persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides full CRUD operations for inventory items, ammunition management actions, and encumbrance calculations. Add calculateEncumbrance utility function.",
    "files": [
      "/lib/storage/characters.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G2.1.2", "G2.2.1"]
  },
  {
    "id": "G2.2.4",
    "title": "Add transferItem between characters (future: party loot)",
    "description": "This milestone implements the complete inventory persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides full CRUD operations for inventory items, ammunition management actions, and encumbrance calculations. Add transferItem between characters (future: party loot).",
    "files": [
      "/lib/storage/characters.ts",
      "/app/api/characters/[characterId]/inventory/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G2.2.1"]
  }
]
```

### G2.3 Inventory UI

This milestone creates the complete inventory management user interface with item lists, filtering, sorting, and quick actions. It includes components for viewing equipped items, tracking ammunition, and adding new items from the gear catalog. The goal is to provide an intuitive interface that makes gear management efficient and enjoyable for players.

**Files to create:**
- **G2.3.FC.1** `/app/characters/[characterId]/inventory/page.tsx`
- **G2.3.FC.2** `/components/inventory/InventoryList.tsx`
- **G2.3.FC.3** `/components/inventory/ItemModal.tsx` (handles both add and edit)
- **G2.3.FC.4** `/components/inventory/AmmoTracker.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| G2.3.1 | Create inventory page with gear list | Not Started |
| G2.3.2 | Create InventoryList with item cards, sorting, and filtering | Not Started |
| G2.3.3 | Create ItemModal with catalog search (supports both adding and editing items) | Not Started |
| G2.3.4 | Create AmmoTracker for quick reloading | Not Started |
| G2.3.5 | Add drag-and-drop reordering | Not Started |
| G2.3.6 | Add equipment slots visual (what's equipped where) | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "G2.3.1",
    "title": "Create inventory page with gear list",
    "description": "This milestone creates the complete inventory management user interface with item lists, filtering, sorting, and quick actions. It includes components for viewing equipped items, tracking ammunition, and adding new items from the gear catalog. The goal is to provide an intuitive interface that makes gear management efficient and enjoyable for players. Create inventory page with gear list.",
    "files": [
      "/app/characters/[characterId]/inventory/page.tsx",
      "/components/inventory/InventoryList.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["G2.2.1"]
  },
  {
    "id": "G2.3.2",
    "title": "Create InventoryList with item cards, sorting, and filtering",
    "description": "This milestone creates the complete inventory management user interface with item lists, filtering, sorting, and quick actions. It includes components for viewing equipped items, tracking ammunition, and adding new items from the gear catalog. The goal is to provide an intuitive interface that makes gear management efficient and enjoyable for players. Create InventoryList with item cards, sorting, and filtering.",
    "files": [
      "/components/inventory/InventoryList.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["G2.3.1"]
  },
  {
    "id": "G2.3.3",
    "title": "Create ItemModal with catalog search (supports both adding and editing items)",
    "description": "This milestone creates the complete inventory management user interface with item lists, filtering, sorting, and quick actions. It includes components for viewing equipped items, tracking ammunition, and adding new items from the gear catalog. The goal is to provide an intuitive interface that makes gear management efficient and enjoyable for players. Create ItemModal with catalog search (supports both adding and editing items).",
    "files": [
      "/components/inventory/ItemModal.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["G2.3.1"]
  },
  {
    "id": "G2.3.4",
    "title": "Create AmmoTracker for quick reloading",
    "description": "This milestone creates the complete inventory management user interface with item lists, filtering, sorting, and quick actions. It includes components for viewing equipped items, tracking ammunition, and adding new items from the gear catalog. The goal is to provide an intuitive interface that makes gear management efficient and enjoyable for players. Create AmmoTracker for quick reloading.",
    "files": [
      "/components/inventory/AmmoTracker.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["G2.2.2", "G2.3.2"]
  },
  {
    "id": "G2.3.5",
    "title": "Add drag-and-drop reordering",
    "description": "This milestone creates the complete inventory management user interface with item lists, filtering, sorting, and quick actions. It includes components for viewing equipped items, tracking ammunition, and adding new items from the gear catalog. The goal is to provide an intuitive interface that makes gear management efficient and enjoyable for players. Add drag-and-drop reordering.",
    "files": [
      "/components/inventory/InventoryList.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["G2.3.2"]
  },
  {
    "id": "G2.3.6",
    "title": "Add equipment slots visual (what's equipped where)",
    "description": "This milestone creates the complete inventory management user interface with item lists, filtering, sorting, and quick actions. It includes components for viewing equipped items, tracking ammunition, and adding new items from the gear catalog. The goal is to provide an intuitive interface that makes gear management efficient and enjoyable for players. Add equipment slots visual (what's equipped where).",
    "files": [
      "/components/inventory/InventoryList.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["G2.3.2", "G2.1.3"]
  }
]
```

**UI Wireframe:**
```
┌─────────────────────────────────────────────────────────────┐
│ Inventory - John "Ghost" Smith                              │
├─────────────────────────────────────────────────────────────┤
│ Weight: 12.5 / 60 kg   Nuyen: 3,450¥   [+ Add Item]        │
├─────────────────────────────────────────────────────────────┤
│ Filter: [All ▼]  Sort: [Name ▼]  [Show Equipped Only ☐]    │
├─────────────────────────────────────────────────────────────┤
│ WEAPONS                                                     │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ⚔ Ares Predator V                    [Equipped ✓]      ││
│ │   Heavy Pistol | 15/15 APDS | Good                      ││
│ │   [Fire] [Reload] [Unequip] [Details]                   ││
│ └─────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ⚔ Combat Knife                       [Equipped ✓]      ││
│ │   Blade | — | Pristine                                  ││
│ │   [Unequip] [Details]                                   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ARMOR                                                       │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 🛡 Armored Jacket                    [Equipped ✓]       ││
│ │   Armor 12 | 2.0 kg | Good                              ││
│ │   [Unequip] [Details]                                   ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### G2.4 Acceptance Criteria

- **G2.4.AC.1** [ ] User can view full inventory list
- **G2.4.AC.2** [ ] User can add items from gear catalog
- **G2.4.AC.3** [ ] User can remove items from inventory
- **G2.4.AC.4** [ ] User can track ammunition with reload/fire actions
- **G2.4.AC.5** [ ] Encumbrance calculated correctly based on STR
- **G2.4.AC.6** [ ] Item condition can be updated
- **G2.4.AC.7** [ ] Equipped items displayed prominently
- **G2.4.AC.8** [ ] Nuyen balance tracked separately

---

## Phase G3: Session Persistence & WebSockets

**Objective:** Real-time multiplayer support for combat and sessions.

This phase implements WebSocket infrastructure to enable real-time collaboration for combat sessions. It provides session joining, state synchronization, and conflict resolution for concurrent updates. The result enables multiple users to view and interact with the same combat session simultaneously, with updates appearing in real-time for all participants.

**Priority:** Medium - Enhances multiplayer experience but not required for single-player use

**Dependencies:**
- G1 (Combat Tracker) must be complete - WebSockets enhance combat sessions

### G3.1 WebSocket Infrastructure

This milestone establishes the WebSocket server and client infrastructure needed for real-time communication. It implements connection management, event types, and basic message routing. The goal is to create a robust foundation that can handle multiple concurrent connections and support various real-time features.

**Files to create:**
- **G3.1.FC.1** `/lib/websocket/server.ts`
- **G3.1.FC.2** `/lib/websocket/client.ts`
- **G3.1.FC.3** `/lib/websocket/types.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| G3.1.1 | Evaluate WebSocket library (Socket.io vs ws vs Pusher) | Not Started |
| G3.1.2 | Implement WebSocket server integration with Next.js | Not Started |
| G3.1.3 | Create event types for combat updates | Not Started |
| G3.1.4 | Create event types for dice roll broadcasts | Not Started |
| G3.1.5 | Implement client-side WebSocket hook | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "G3.1.1",
    "title": "Evaluate WebSocket library (Socket.io vs ws vs Pusher)",
    "description": "This milestone establishes the WebSocket server and client infrastructure needed for real-time communication. It implements connection management, event types, and basic message routing. The goal is to create a robust foundation that can handle multiple concurrent connections and support various real-time features. Evaluate WebSocket library (Socket.io vs ws vs Pusher).",
    "files": [],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "G3.1.2",
    "title": "Implement WebSocket server integration with Next.js",
    "description": "This milestone establishes the WebSocket server and client infrastructure needed for real-time communication. It implements connection management, event types, and basic message routing. The goal is to create a robust foundation that can handle multiple concurrent connections and support various real-time features. Implement WebSocket server integration with Next.js.",
    "files": [
      "/lib/websocket/server.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G3.1.1"]
  },
  {
    "id": "G3.1.3",
    "title": "Create event types for combat updates",
    "description": "This milestone establishes the WebSocket server and client infrastructure needed for real-time communication. It implements connection management, event types, and basic message routing. The goal is to create a robust foundation that can handle multiple concurrent connections and support various real-time features. Create event types for combat updates.",
    "files": [
      "/lib/websocket/types.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G3.1.2"]
  },
  {
    "id": "G3.1.4",
    "title": "Create event types for dice roll broadcasts",
    "description": "This milestone establishes the WebSocket server and client infrastructure needed for real-time communication. It implements connection management, event types, and basic message routing. The goal is to create a robust foundation that can handle multiple concurrent connections and support various real-time features. Create event types for dice roll broadcasts.",
    "files": [
      "/lib/websocket/types.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G3.1.2"]
  },
  {
    "id": "G3.1.5",
    "title": "Implement client-side WebSocket hook",
    "description": "This milestone establishes the WebSocket server and client infrastructure needed for real-time communication. It implements connection management, event types, and basic message routing. The goal is to create a robust foundation that can handle multiple concurrent connections and support various real-time features. Implement client-side WebSocket hook.",
    "files": [
      "/lib/websocket/client.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G3.1.2"]
  }
]
```

### G3.2 Combat Session Sharing

This milestone implements real-time broadcasting of combat session updates to all connected participants. It enables multiple users to view the same combat session simultaneously, with changes appearing instantly for everyone. The goal is to provide seamless multiplayer combat tracking where GMs and players can all see the same state.

**Files to modify:**
- **G3.2.FM.1** `/lib/websocket/server.ts`
- **G3.2.FM.2** `/app/api/combat/[sessionId]/actions/route.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| G3.2.1 | Broadcast initiative changes to all participants | Not Started |
| G3.2.2 | Broadcast damage/healing updates | Not Started |
| G3.2.3 | Broadcast turn changes | Not Started |
| G3.2.4 | Handle participant join/leave | Not Started |
| G3.2.5 | Implement GM-only actions vs player-visible actions | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "G3.2.1",
    "title": "Broadcast initiative changes to all participants",
    "description": "This milestone implements real-time broadcasting of combat session updates to all connected participants. It enables multiple users to view the same combat session simultaneously, with changes appearing instantly for everyone. The goal is to provide seamless multiplayer combat tracking where GMs and players can all see the same state. Broadcast initiative changes to all participants.",
    "files": [
      "/lib/websocket/server.ts",
      "/app/api/combat/[sessionId]/actions/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G3.1.3", "G1.2.3"]
  },
  {
    "id": "G3.2.2",
    "title": "Broadcast damage/healing updates",
    "description": "This milestone implements real-time broadcasting of combat session updates to all connected participants. It enables multiple users to view the same combat session simultaneously, with changes appearing instantly for everyone. The goal is to provide seamless multiplayer combat tracking where GMs and players can all see the same state. Broadcast damage/healing updates.",
    "files": [
      "/lib/websocket/server.ts",
      "/app/api/combat/[sessionId]/actions/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G3.1.3", "G1.2.3"]
  },
  {
    "id": "G3.2.3",
    "title": "Broadcast turn changes",
    "description": "This milestone implements real-time broadcasting of combat session updates to all connected participants. It enables multiple users to view the same combat session simultaneously, with changes appearing instantly for everyone. The goal is to provide seamless multiplayer combat tracking where GMs and players can all see the same state. Broadcast turn changes.",
    "files": [
      "/lib/websocket/server.ts",
      "/app/api/combat/[sessionId]/actions/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G3.1.3", "G1.2.3"]
  },
  {
    "id": "G3.2.4",
    "title": "Handle participant join/leave",
    "description": "This milestone implements real-time broadcasting of combat session updates to all connected participants. It enables multiple users to view the same combat session simultaneously, with changes appearing instantly for everyone. The goal is to provide seamless multiplayer combat tracking where GMs and players can all see the same state. Handle participant join/leave.",
    "files": [
      "/lib/websocket/server.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G3.1.2"]
  },
  {
    "id": "G3.2.5",
    "title": "Implement GM-only actions vs player-visible actions",
    "description": "This milestone implements real-time broadcasting of combat session updates to all connected participants. It enables multiple users to view the same combat session simultaneously, with changes appearing instantly for everyone. The goal is to provide seamless multiplayer combat tracking where GMs and players can all see the same state. Implement GM-only actions vs player-visible actions.",
    "files": [
      "/lib/websocket/server.ts",
      "/app/api/combat/[sessionId]/actions/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G3.2.1", "G3.2.2", "G3.2.3"]
  }
]
```

### G3.3 Session State Management

This milestone implements session joining, state persistence across reconnections, and conflict resolution for concurrent updates. It creates invite code systems for session access and ensures disconnected users can rejoin and sync their state properly. The goal is to provide robust session management that handles network issues gracefully and prevents data loss.

**Files to modify:**
- **G3.3.FM.1** `/lib/websocket/server.ts`
- **G3.3.FM.2** `/lib/websocket/client.ts`
- **G3.3.FM.3** `/lib/storage/combat.ts`
- **G3.3.FM.4** `/app/combat/[sessionId]/page.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| G3.3.1 | Create session join flow with invite codes | Not Started |
| G3.3.2 | Persist session state across reconnections | Not Started |
| G3.3.3 | Handle conflict resolution for concurrent updates | Not Started |
| G3.3.4 | Add session recovery for disconnections | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "G3.3.1",
    "title": "Create session join flow with invite codes",
    "description": "This milestone implements session joining, state persistence across reconnections, and conflict resolution for concurrent updates. It creates invite code systems for session access and ensures disconnected users can rejoin and sync their state properly. The goal is to provide robust session management that handles network issues gracefully and prevents data loss. Create session join flow with invite codes.",
    "files": [
      "/lib/websocket/server.ts",
      "/app/combat/[sessionId]/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["G3.1.4", "G1.2.1"]
  },
  {
    "id": "G3.3.2",
    "title": "Persist session state across reconnections",
    "description": "This milestone implements session joining, state persistence across reconnections, and conflict resolution for concurrent updates. It creates invite code systems for session access and ensures disconnected users can rejoin and sync their state properly. The goal is to provide robust session management that handles network issues gracefully and prevents data loss. Persist session state across reconnections.",
    "files": [
      "/lib/websocket/server.ts",
      "/lib/websocket/client.ts",
      "/lib/storage/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G3.3.1"]
  },
  {
    "id": "G3.3.3",
    "title": "Handle conflict resolution for concurrent updates",
    "description": "This milestone implements session joining, state persistence across reconnections, and conflict resolution for concurrent updates. It creates invite code systems for session access and ensures disconnected users can rejoin and sync their state properly. The goal is to provide robust session management that handles network issues gracefully and prevents data loss. Handle conflict resolution for concurrent updates.",
    "files": [
      "/lib/websocket/server.ts",
      "/lib/storage/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["G3.3.2"]
  },
  {
    "id": "G3.3.4",
    "title": "Add session recovery for disconnections",
    "description": "This milestone implements session joining, state persistence across reconnections, and conflict resolution for concurrent updates. It creates invite code systems for session access and ensures disconnected users can rejoin and sync their state properly. The goal is to provide robust session management that handles network issues gracefully and prevents data loss. Add session recovery for disconnections.",
    "files": [
      "/lib/websocket/client.ts",
      "/app/combat/[sessionId]/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["G3.3.2"]
  }
]
```

### G3.4 Acceptance Criteria

- **G3.4.AC.1** [ ] Multiple users can view same combat session
- **G3.4.AC.2** [ ] Updates appear in real-time for all participants
- **G3.4.AC.3** [ ] Disconnected users can rejoin and sync state
- **G3.4.AC.4** [ ] GM actions properly authorized
- **G3.4.AC.5** [ ] Invite codes work for session access
- **G3.4.AC.6** [ ] Conflict resolution handles concurrent updates gracefully

---

## Dependencies & Prerequisites

This section documents all external dependencies, data requirements, and phase interdependencies needed to complete the gameplay features implementation.

### Technical Dependencies

| Dependency | Required For | Notes |
|------------|--------------|-------|
| WebSocket library | G3 | Socket.io recommended for Next.js |
| Character data structure | G1, G2 | Characters must exist with health/stats |
| Gear catalog | G2 | From character creation system |

### Data Dependencies

| Data Required | Required For | Source |
|---------------|--------------|--------|
| Character health/stats | G1 | Character creation system |
| Gear catalog | G2 | Character creation system |

### Phase Dependencies

- **G1 (Combat Tracker)** - Independent, can start immediately
- **G2 (Inventory Management)** - Independent, can start immediately
- **G3 (WebSockets)** - Depends on G1 (Combat Tracker) - requires combat sessions to exist

### Critical Path

```
G1 (Combat Tracker)
  └─► G3 (WebSockets) - depends on G1.2.3 (combat actions endpoint)

G2 (Inventory Management) - Independent, can run in parallel with G1
```

---

## Implementation Notes

### Combat Tracker (G1)
- Supports both player characters and NPCs
- Multi-pass initiative system (SR5 mechanic)
- Physical and stun damage tracking
- Condition management (prone, suppressed, etc.)
- Combat logging for session review

### Inventory Management (G2)
- Post-creation gear tracking (separate from creation gear)
- Equipment slots for equipped items
- Ammunition tracking with reload/fire actions
- Encumbrance calculation (STR × 10 kg)
- Item condition tracking

### WebSockets (G3)
- Real-time combat session sharing
- Session invite codes for access control
- State persistence across reconnections
- Conflict resolution for concurrent updates
- GM vs player action authorization

---

## Future Enhancements (Post-Implementation)

These features are beyond the scope of the initial gameplay implementation but may be added later:

- **Campaign Management** - Link multiple sessions to campaigns
- **NPC Management** - Create and manage NPC templates
- **Dice Roller Integration** - Real-time dice roll sharing via WebSockets
- **Character Advancement** - Karma spending and attribute increases
- **Lifestyle Tracking** - Monthly lifestyle costs and downtime activities
- **Contact Management** - Track and manage contacts during gameplay
- **Matrix Hosts** - Matrix encounter tracking (separate from physical combat)

