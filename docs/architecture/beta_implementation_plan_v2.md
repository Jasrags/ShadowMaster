# Beta Implementation Plan

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

- **Phase-level tasks:** Use format `M0.1`, `B1`, `B4`, etc.
- **Sub-phase tasks:** Use format `M0.3.8`, `B5.1.4`, etc.
- **Individual tasks:** Use format `M0.1.1`, `M0.2.1`, `B5.2.6`, etc.
- **File modification markers:** Use format `M0.1.FM.1`, `M0.2.FM.2`, etc. (FM = Files to Modify)

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
   - Update "Character Creation Wizard Flow" if applicable

4. **Task JSON format** (required for each task):
   ```json
   {
     "id": "M0.X.Y",
     "title": "Task title (same as table)",
     "description": "Phase objective description. Task title.",
     "files": ["/path/to/file1.tsx", "/path/to/file2.ts"],
     "status": "Complete" | "In Progress" | "Not Started",
     "dependsOn": ["M0.X.Z"] // Array of task IDs, empty array if none
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

3. **Update "Character Creation Wizard Flow"** if the task affects the wizard steps

4. **Update phase status** in summary tables:
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
2. **Files to modify** section with numbered file markers (e.g., `M0.X.FM.1`)
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

**Goal:** Richer GM Tools + Sourcebook Support
**Timeline:** 6-9 months post-MVP
**Prerequisites:** MVP character creation ~95% complete (current state)

This document breaks down the Beta phase into actionable implementation phases with specific tasks, dependencies, and acceptance criteria.

---

## Recommended Work Items (Priority Order)

This section prioritizes the most critical remaining tasks needed to complete character creation. These items focus on fixing bugs, completing essential features, and ensuring all character types can be created properly. The list is ordered by priority to guide immediate development efforts.

| # | Task | Effort | Phase | Status |
|---|------|--------|-------|--------|
| 1 | Fix Adept skill filtering bug - block ALL magical skill groups for adepts | Small | M0.3.8 | ✅ Complete |
| 2 | Add Aspected Mage group selection | Medium | M0.8 | ✅ Complete |
| 3 | Implement free skills from priority in SkillsStep | Medium | M0.3.9 | ✅ Complete |
| 4 | Track free spells/complex forms separately from Karma-purchased | Medium | M0.7.10 | ✅ Complete |
| 5 | Add Power Points budget for Adepts (free = Magic rating) | Medium | B5.1.4 | Not Started |
| 6 | Add Karma-purchased Power Points for Mystic Adepts | Medium | B5.1.5, B5.2.6 | Not Started |
| 7 | Add Adept Powers data to ruleset | Large | B5.1.1 | Not Started |
| 8 | Create AdeptPowersStep component | Large | B5.2 | Not Started |
| 9 | Add spell formula limits validation (Magic × 2 per category) | Small | M0.7.11 | Not Started |
| 10 | Conditional Assensing for Adepts (requires powers system first) | Small | B5.1.6, B5.2.11 | Not Started |

**Next Steps:** Focus on completing M0 phase items (M0.3.9, M0.4-M0.7) before moving to Beta features (B5 Adept Powers).

---

## Complete Implementation Order

This section provides a comprehensive view of the entire implementation roadmap, showing the complete character creation wizard flow and all phases with their status. It serves as both a planning document and progress tracker, allowing quick assessment of what's complete and what remains.

### Character Creation Wizard Flow (Post-Implementation)

```
1. Priority Selection       ✅ Complete (MVP)
2. Metatype Selection       ✅ Complete (MVP) + M0.2 enhancements pending
3. Attributes Allocation    ✅ Complete (MVP) + M0.6 karma purchases completed
4. Magic/Resonance Path     ✅ Complete (MVP) + B6 tradition enhancements pending
5. Skills Allocation        ✅ Complete (MVP) + M0.3 enhancements completed
6. Qualities Selection      ✅ Complete (MVP) + M0.4 enhancements pending
7. Augmentations           ✅ Complete (B1)
8. Spells/Powers           🔜 M0.7 SpellsStep (magical) / B5 AdeptPowersStep (adepts)
9. Complex Forms           🔜 B7 (technomancers only)
10. Contacts               ✅ Complete (MVP) + M0.5 enhancements pending
11. Gear & Resources       ✅ Complete (MVP) + M0.6 karma-to-nuyen completed
12. Review & Finalize      ✅ Complete (MVP)
```

### Full Phase Summary with Status

| Order | Phase | Focus Area | Duration | Priority | Status |
|-------|-------|-----------|----------|----------|--------|
| 1 | **M0** | **MVP Gaps & Enhancements** | **1-2 weeks** | **Critical** | 🔄 In Progress |
| | M0.1 | Bug Fixes | - | Critical | ✅ Complete |
| | M0.2 | Metatype Enhancements | - | Critical | ✅ Complete |
| | M0.3 | Skills Enhancements | - | Critical | ✅ Complete |
| | M0.3.8 | Adept Skill Filtering Bug Fix | - | Critical | ✅ Complete |
| | M0.3.9 | Free Skills from Priority | - | Critical | ✅ Complete |
| | M0.4 | Qualities Enhancements | - | Critical | ✅ Complete |
| | M0.5 | Contacts Enhancements | - | Critical | Not Started |
| | M0.6 | Distributed Karma Architecture | - | Critical | ✅ Complete |
| | M0.7 | SpellsStep Creation | - | Critical | ✅ Complete |
| | M0.8 | Aspected Mage Enhancements | - | Critical | ✅ Complete |
| 2 | **B1** | **Cyberware/Bioware System** | **2-3 weeks** | **High** | ✅ **Complete** |
| 3 | **B4** | **Combat Tracker** | **3-4 weeks** | **High** | Not Started |
| 4 | **B3** | **Inventory Management** | **1-2 weeks** | **High** | Not Started |
| 5 | **B5** | **Adept Powers System** | **1-2 weeks** | **Medium** | Not Started |
| 6 | **B6** | **Spell Management** | **1-2 weeks** | **Medium** | Not Started |
| 7 | **B7** | **Complex Forms & Matrix** | **1-2 weeks** | **Medium** | Not Started |
| 8 | **B2** | **Sourcebook Integration** | **2 weeks** | **Medium** | Not Started |
| 9 | **B8** | **UI/UX Improvements** | **1-2 weeks** | **Medium** | Not Started |
| 10 | **B9** | **Session Persistence & WebSockets** | **2-3 weeks** | **Low** | Not Started |

### Completed Work Summary

| Phase | Completion Date | Key Deliverables |
|-------|-----------------|------------------|
| MVP Core | Dec 2024 | Priority system, metatypes, attributes, skills, qualities, contacts, gear, review |
| B1 Cyberware | Dec 2024 | 70+ cyberware items, 60+ bioware items, essence tracking, grade selection, AugmentationsStep |
| M0.1 Bug Fixes | Dec 2024 | Validation panel consistency fix, synced validation state across wizard |
| M0.2 Metatype | Dec 2024 | Racial traits auto-populated, racialQualities field, ReviewStep display |
| M0.3 Skills | Dec 2024 | Magical/resonance skill filtering, suggested specializations for all skills, example knowledge skills (40+) and languages (20+) with quick-add dropdowns |
| M0.3.8 Adept Filtering | Dec 2024 | Fixed adept skill filtering to block ALL magical skill groups (both individual skills and groups) |
| M0.8 Aspected Mage | Dec 2024 | Aspected Mage group selection (Sorcery, Conjuring, Enchanting) implemented and working |
| M0.4 Qualities | Dec 2024 | Leveled qualities support (Addiction, Allergy, etc.), racial quality filtering, specification inputs (e.g. Mentor Spirit choice), 20+ new qualities added |
| M0.6 Karma Arch | Dec 2024 | Distributed karma spending, global karma budget, karma-to-nuyen conversion, 7 karma carryover limit |
| B8.1 Gear Layout | Dec 2024 | Improved gear catalog layout, shopping cart width fixes, responsive design |

### Estimated Remaining Timeline

| Milestone | Phases | Est. Duration |
|-----------|--------|---------------|
| MVP Polish | M0 | 1-2 weeks |
| Beta Core | B4, B3, B5, B6, B7 | 8-12 weeks |
| Beta Polish | B2, B8, B9 | 4-6 weeks |
| **Total to Beta Release** | All | **13-20 weeks** |

---

## Phase Summary (Quick Reference)

| Phase | Focus Area | Duration | Priority | Status |
|-------|-----------|----------|----------|--------|
| **M0** | **MVP Gaps & Enhancements** | **1-2 weeks** | **Critical** | 🔄 In Progress |
| B1 | Cyberware/Bioware System | 2-3 weeks | High | ✅ Complete |
| B4 | Combat Tracker | 3-4 weeks | High | Not Started |
| B3 | Inventory Management | 1-2 weeks | High | Not Started |
| B5 | Adept Powers System | 1-2 weeks | Medium | Not Started |
| B6 | Spell Management | 1-2 weeks | Medium | Not Started |
| B7 | Complex Forms & Matrix | 1-2 weeks | Medium | Not Started |
| B2 | Sourcebook Integration | 2 weeks | Medium | Not Started |
| B8 | UI/UX Improvements | 1-2 weeks | Medium | Not Started |
| B9 | Session Persistence & WebSockets | 2-3 weeks | Low | Not Started |

---

## Phase M0: MVP Gaps & Enhancements

**Objective:** Address gaps and bugs discovered during MVP development before proceeding to Beta features.

**Priority:** Critical - Must complete before Beta phases

This phase addresses critical gaps and inconsistencies found during MVP development. It ensures the core character creation experience is polished and complete before adding new Beta features. All items in this phase must be completed to achieve a production-ready MVP state.

### M0.1 Bug Fixes

This milestone resolves validation state inconsistencies that cause confusion in the character creation wizard. The goal is to ensure all UI elements display the same validation status, preventing discrepancies between the sidebar panel and the review step.

**Files to modify:**
- **M0.1.FM.1** `/app/characters/create/components/CreationWizard.tsx`
- **M0.1.FM.2** `/app/characters/create/components/ValidationPanel.tsx` (or equivalent)

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| M0.1.1 | Fix validation panel inconsistency - sidebar shows green "All validations passing" but ReviewStep shows warnings | Complete |
| M0.1.2 | Ensure validation state is consistent across all UI elements | Complete |

**Tasks JSON:**
```json
[
  {
    "id": "M0.1.1",
    "title": "Fix validation panel inconsistency - sidebar shows green \"All validations passing\" but ReviewStep shows warnings",
    "description": "This milestone resolves validation state inconsistencies that cause confusion in the character creation wizard. The goal is to ensure all UI elements display the same validation status, preventing discrepancies between the sidebar panel and the review step. Fix validation panel inconsistency - sidebar shows green \"All validations passing\" but ReviewStep shows warnings.",
    "files": [
      "/app/characters/create/components/CreationWizard.tsx",
      "/app/characters/create/components/ValidationPanel.tsx"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "M0.1.2",
    "title": "Ensure validation state is consistent across all UI elements",
    "description": "This milestone resolves validation state inconsistencies that cause confusion in the character creation wizard. The goal is to ensure all UI elements display the same validation status, preventing discrepancies between the sidebar panel and the review step. Ensure validation state is consistent across all UI elements.",
    "files": [
      "/app/characters/create/components/CreationWizard.tsx",
      "/app/characters/create/components/ValidationPanel.tsx"
    ],
    "status": "Complete",
    "dependsOn": ["M0.1.1"]
  }
]
```

### M0.2 Metatype Enhancements

This enhancement automatically applies racial traits as racial qualities when a metatype is selected during character creation. It ensures racial qualities are properly tracked separately from player-selected qualities and appear correctly on the character sheet and review screen.

**Files to modify:**
- **M0.2.FM.1** `/app/characters/create/components/steps/MetatypeStep.tsx`
- **M0.2.FM.2** `/lib/types/character.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| M0.2.1 | When metatype is selected, automatically add racial traits as Racial Qualities to character | Complete |
| M0.2.2 | Display racial qualities in character data (separate from selected qualities) | Complete |
| M0.2.3 | Ensure racial qualities appear on character sheet/review | Complete |

**Tasks JSON:**
```json
[
  {
    "id": "M0.2.1",
    "title": "When metatype is selected, automatically add racial traits as Racial Qualities to character",
    "description": "This enhancement automatically applies racial traits as racial qualities when a metatype is selected during character creation. It ensures racial qualities are properly tracked separately from player-selected qualities and appear correctly on the character sheet and review screen. When metatype is selected, automatically add racial traits as Racial Qualities to character.",
    "files": [
      "/app/characters/create/components/steps/MetatypeStep.tsx",
      "/lib/types/character.ts"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "M0.2.2",
    "title": "Display racial qualities in character data (separate from selected qualities)",
    "description": "This enhancement automatically applies racial traits as racial qualities when a metatype is selected during character creation. It ensures racial qualities are properly tracked separately from player-selected qualities and appear correctly on the character sheet and review screen. Display racial qualities in character data (separate from selected qualities).",
    "files": [
      "/app/characters/create/components/steps/MetatypeStep.tsx",
      "/lib/types/character.ts"
    ],
    "status": "Complete",
    "dependsOn": ["M0.2.1"]
  },
  {
    "id": "M0.2.3",
    "title": "Ensure racial qualities appear on character sheet/review",
    "description": "This enhancement automatically applies racial traits as racial qualities when a metatype is selected during character creation. It ensures racial qualities are properly tracked separately from player-selected qualities and appear correctly on the character sheet and review screen. Ensure racial qualities appear on character sheet/review.",
    "files": [
      "/app/characters/create/components/steps/MetatypeStep.tsx",
      "/lib/types/character.ts"
    ],
    "status": "Complete",
    "dependsOn": ["M0.2.2"]
  }
]
```

### M0.3 Skills Enhancements

This milestone improves the skills selection experience by adding suggested specializations, example knowledge and language skills, and proper filtering for magical skills. It also implements proper tracking of free skills from priority separately from karma-purchased skills. The goal is to make skill selection more intuitive while maintaining full customizability.

**Files to modify:**
- **M0.3.FM.1** `/app/characters/create/components/steps/SkillsStep.tsx`
- **M0.3.FM.2** `/data/editions/sr5/core-rulebook.json`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| M0.3.1 | Disable magical skill groups (Sorcery, Conjuring, Enchanting) for mundane characters | Complete |
| M0.3.2 | Disable individual magical skills for mundane characters | Complete |
| M0.3.3 | Add suggested specializations to skill data (e.g., Archery: "Bow", "Crossbow", "Slingshot") | Complete |
| M0.3.4 | Update specialization UI to show suggestions as dropdown but still allow free text | Complete |
| M0.3.5 | Add example knowledge skills to ruleset data (e.g., "Corporate Politics", "Seattle Gangs") | Complete |
| M0.3.6 | Add example language skills to ruleset data (e.g., "Or'zet", "Sperethiel", "Japanese") | Complete |
| M0.3.7 | Ensure custom knowledge/language skill creation still works alongside examples | Complete |
| M0.3.8 | Fix adept skill filtering bug - block ALL magical skill groups for adepts (both individual skills and skill groups) | Complete |
| M0.3.9 | Implement free skills from priority in SkillsStep (track free skill points separately from karma-purchased) | ✅ Complete |
| M0.3.10 | Update skill data with detailed descriptions and missing skills (e.g. pilot-aerospace, exotic-ranged-weapon) | ✅ Complete |

**Tasks JSON:**
```json
[
  {
    "id": "M0.3.1",
    "title": "Disable magical skill groups (Sorcery, Conjuring, Enchanting) for mundane characters",
    "description": "This milestone improves the skills selection experience by adding suggested specializations, example knowledge and language skills, and proper filtering for magical skills. It also implements proper tracking of free skills from priority separately from karma-purchased skills. The goal is to make skill selection more intuitive while maintaining full customizability. Disable magical skill groups (Sorcery, Conjuring, Enchanting) for mundane characters.",
    "files": [
      "/app/characters/create/components/steps/SkillsStep.tsx",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "M0.3.2",
    "title": "Disable individual magical skills for mundane characters",
    "description": "This milestone improves the skills selection experience by adding suggested specializations, example knowledge and language skills, and proper filtering for magical skills. It also implements proper tracking of free skills from priority separately from karma-purchased skills. The goal is to make skill selection more intuitive while maintaining full customizability. Disable individual magical skills for mundane characters.",
    "files": [
      "/app/characters/create/components/steps/SkillsStep.tsx",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Complete",
    "dependsOn": ["M0.3.1"]
  },
  {
    "id": "M0.3.3",
    "title": "Add suggested specializations to skill data (e.g., Archery: \"Bow\", \"Crossbow\", \"Slingshot\")",
    "description": "This milestone improves the skills selection experience by adding suggested specializations, example knowledge and language skills, and proper filtering for magical skills. It also implements proper tracking of free skills from priority separately from karma-purchased skills. The goal is to make skill selection more intuitive while maintaining full customizability. Add suggested specializations to skill data (e.g., Archery: \"Bow\", \"Crossbow\", \"Slingshot\").",
    "files": [
      "/app/characters/create/components/steps/SkillsStep.tsx",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "M0.3.4",
    "title": "Update specialization UI to show suggestions as dropdown but still allow free text",
    "description": "This milestone improves the skills selection experience by adding suggested specializations, example knowledge and language skills, and proper filtering for magical skills. It also implements proper tracking of free skills from priority separately from karma-purchased skills. The goal is to make skill selection more intuitive while maintaining full customizability. Update specialization UI to show suggestions as dropdown but still allow free text.",
    "files": [
      "/app/characters/create/components/steps/SkillsStep.tsx",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Complete",
    "dependsOn": ["M0.3.3"]
  },
  {
    "id": "M0.3.5",
    "title": "Add example knowledge skills to ruleset data (e.g., \"Corporate Politics\", \"Seattle Gangs\")",
    "description": "This milestone improves the skills selection experience by adding suggested specializations, example knowledge and language skills, and proper filtering for magical skills. It also implements proper tracking of free skills from priority separately from karma-purchased skills. The goal is to make skill selection more intuitive while maintaining full customizability. Add example knowledge skills to ruleset data (e.g., \"Corporate Politics\", \"Seattle Gangs\").",
    "files": [
      "/app/characters/create/components/steps/SkillsStep.tsx",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "M0.3.6",
    "title": "Add example language skills to ruleset data (e.g., \"Or'zet\", \"Sperethiel\", \"Japanese\")",
    "description": "This milestone improves the skills selection experience by adding suggested specializations, example knowledge and language skills, and proper filtering for magical skills. It also implements proper tracking of free skills from priority separately from karma-purchased skills. The goal is to make skill selection more intuitive while maintaining full customizability. Add example language skills to ruleset data (e.g., \"Or'zet\", \"Sperethiel\", \"Japanese\").",
    "files": [
      "/app/characters/create/components/steps/SkillsStep.tsx",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "M0.3.7",
    "title": "Ensure custom knowledge/language skill creation still works alongside examples",
    "description": "This milestone improves the skills selection experience by adding suggested specializations, example knowledge and language skills, and proper filtering for magical skills. It also implements proper tracking of free skills from priority separately from karma-purchased skills. The goal is to make skill selection more intuitive while maintaining full customizability. Ensure custom knowledge/language skill creation still works alongside examples.",
    "files": [
      "/app/characters/create/components/steps/SkillsStep.tsx",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Complete",
    "dependsOn": ["M0.3.5", "M0.3.6"]
  },
  {
    "id": "M0.3.8",
    "title": "Fix adept skill filtering bug - block ALL magical skill groups for adepts (both individual skills and skill groups)",
    "description": "This milestone improves the skills selection experience by adding suggested specializations, example knowledge and language skills, and proper filtering for magical skills. It also implements proper tracking of free skills from priority separately from karma-purchased skills. The goal is to make skill selection more intuitive while maintaining full customizability. Fix adept skill filtering bug - block ALL magical skill groups for adepts (both individual skills and skill groups).",
    "files": [
      "/app/characters/create/components/steps/SkillsStep.tsx",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "M0.3.9",
    "title": "Implement free skills from priority in SkillsStep (track free skill points separately from karma-purchased)",
    "description": "This milestone improves the skills selection experience by adding suggested specializations, example knowledge and language skills, and proper filtering for magical skills. It also implements proper tracking of free skills from priority separately from karma-purchased skills. The goal is to make skill selection more intuitive while maintaining full customizability. Implement free skills from priority in SkillsStep (track free skill points separately from karma-purchased).",
    "files": [
      "/app/characters/create/components/steps/SkillsStep.tsx",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Complete",
    "dependsOn": []
  }
]
```

### M0.4 Qualities Enhancements

This enhancement extends the qualities system to support leveled qualities (like Addiction with severity levels) and stat-modifying qualities (like Aptitude that increases skill maximums). It also filters out racial qualities from the selection UI to prevent duplicate entries. The result enables full SR5 quality mechanics including complex interactions with character stats.

**Files to modify:**
- **M0.4.FM.1** `/app/characters/create/components/steps/QualitiesStep.tsx`
- **M0.4.FM.2** `/data/editions/sr5/core-rulebook.json`
- **M0.4.FM.3** `/lib/types/edition.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| M0.4.1 | Add `isRacial: boolean` flag to Quality interface and filter racial qualities from selection UI | Complete |
| M0.4.2 | Implement leveled qualities system (add `levels` field to Quality interface, update quality data with levels, add level selector UI) | Complete |
| M0.4.3 | Implement stat-modifying qualities system (add `statModifiers` field, implement Aptitude quality, apply modifiers to derived stats calculations) | Complete |

**Tasks JSON:**
```json
[
  {
    "id": "M0.4.1",
    "title": "Add `isRacial: boolean` flag to Quality interface and filter racial qualities from selection UI",
    "description": "This enhancement extends the qualities system to support leveled qualities (like Addiction with severity levels) and stat-modifying qualities (like Aptitude that increases skill maximums). It also filters out racial qualities from the selection UI to prevent duplicate entries. The result enables full SR5 quality mechanics including complex interactions with character stats. Add `isRacial: boolean` flag to Quality interface and filter racial qualities from selection UI.",
    "files": [
      "/app/characters/create/components/steps/QualitiesStep.tsx",
      "/data/editions/sr5/core-rulebook.json",
      "/lib/types/edition.ts"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "M0.4.2",
    "title": "Implement leveled qualities system (add `levels` field to Quality interface, update quality data with levels, add level selector UI)",
    "description": "This enhancement extends the qualities system to support leveled qualities (like Addiction with severity levels) and stat-modifying qualities (like Aptitude that increases skill maximums). It also filters out racial qualities from the selection UI to prevent duplicate entries. The result enables full SR5 quality mechanics including complex interactions with character stats. Implement leveled qualities system (add `levels` field to Quality interface, update quality data with levels, add level selector UI).",
    "files": [
      "/app/characters/create/components/steps/QualitiesStep.tsx",
      "/data/editions/sr5/core-rulebook.json",
      "/lib/types/edition.ts"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "M0.4.3",
    "title": "Implement stat-modifying qualities system (add `statModifiers` field, implement Aptitude quality, apply modifiers to derived stats calculations)",
    "description": "This enhancement extends the qualities system to support leveled qualities (like Addiction with severity levels) and stat-modifying qualities (like Aptitude that increases skill maximums). It also filters out racial qualities from the selection UI to prevent duplicate entries. The result enables full SR5 quality mechanics including complex interactions with character stats. Implement stat-modifying qualities system (add `statModifiers` field, implement Aptitude quality, apply modifiers to derived stats calculations).",
    "files": [
      "/app/characters/create/components/steps/QualitiesStep.tsx",
      "/data/editions/sr5/core-rulebook.json",
      "/lib/types/edition.ts"
    ],
    "status": "Complete",
    "dependsOn": []
  }
]
```

**Leveled Quality Example:**
```json
{
  "id": "addiction",
  "name": "Addiction",
  "type": "negative",
  "levels": [
    { "level": 1, "name": "Mild", "karma": -4 },
    { "level": 2, "name": "Moderate", "karma": -9 },
    { "level": 3, "name": "Severe", "karma": -20 },
    { "level": 4, "name": "Burnout", "karma": -25 }
  ],
  "requiresSpecification": true,
  "specificationLabel": "Substance"
}
```

**Stat-Modifying Quality Example:**
```json
{
  "id": "aptitude",
  "name": "Aptitude",
  "type": "positive",
  "karma": 14,
  "requiresSpecification": true,
  "specificationLabel": "Skill",
  "statModifiers": {
    "skillMaxBonus": 1,
    "appliesToSpecification": true
  },
  "limit": 1
}
```

### M0.5 Contacts Enhancements

This milestone adds example contact templates (Fixer, Street Doc, Bartender, etc.) to streamline contact creation while preserving full customization. Players can select a template and customize it, or create contacts from scratch. The goal is to reduce decision fatigue while maintaining flexibility for unique contacts.

**Files to modify:**
- **M0.5.FM.1** `/app/characters/create/components/steps/ContactsStep.tsx`
- **M0.5.FM.2** `/data/editions/sr5/core-rulebook.json`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| M0.5.1 | Add example contacts to ruleset data (Fixer, Street Doc, Bartender, etc.) | Not Started |
| M0.5.2 | Create contact template selector with pre-filled archetypes | Not Started |
| M0.5.3 | Allow customization of selected template (edit name, adjust ratings) | Not Started |
| M0.5.4 | Ensure fully custom contact creation still works | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "M0.5.1",
    "title": "Add example contacts to ruleset data (Fixer, Street Doc, Bartender, etc.)",
    "description": "This milestone adds example contact templates (Fixer, Street Doc, Bartender, etc.) to streamline contact creation while preserving full customization. Players can select a template and customize it, or create contacts from scratch. The goal is to reduce decision fatigue while maintaining flexibility for unique contacts. Add example contacts to ruleset data (Fixer, Street Doc, Bartender, etc.).",
    "files": [
      "/app/characters/create/components/steps/ContactsStep.tsx",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "M0.5.2",
    "title": "Create contact template selector with pre-filled archetypes",
    "description": "This milestone adds example contact templates (Fixer, Street Doc, Bartender, etc.) to streamline contact creation while preserving full customization. Players can select a template and customize it, or create contacts from scratch. The goal is to reduce decision fatigue while maintaining flexibility for unique contacts. Create contact template selector with pre-filled archetypes.",
    "files": [
      "/app/characters/create/components/steps/ContactsStep.tsx",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Not Started",
    "dependsOn": ["M0.5.1"]
  },
  {
    "id": "M0.5.3",
    "title": "Allow customization of selected template (edit name, adjust ratings)",
    "description": "This milestone adds example contact templates (Fixer, Street Doc, Bartender, etc.) to streamline contact creation while preserving full customization. Players can select a template and customize it, or create contacts from scratch. The goal is to reduce decision fatigue while maintaining flexibility for unique contacts. Allow customization of selected template (edit name, adjust ratings).",
    "files": [
      "/app/characters/create/components/steps/ContactsStep.tsx",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Not Started",
    "dependsOn": ["M0.5.2"]
  },
  {
    "id": "M0.5.4",
    "title": "Ensure fully custom contact creation still works",
    "description": "This milestone adds example contact templates (Fixer, Street Doc, Bartender, etc.) to streamline contact creation while preserving full customization. Players can select a template and customize it, or create contacts from scratch. The goal is to reduce decision fatigue while maintaining flexibility for unique contacts. Ensure fully custom contact creation still works.",
    "files": [
      "/app/characters/create/components/steps/ContactsStep.tsx",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Not Started",
    "dependsOn": ["M0.5.2"]
  }
]
```

**Example Contact Template:**
```json
{
  "contactTemplates": [
    {
      "id": "fixer",
      "name": "Fixer",
      "description": "A shadow broker who connects runners with jobs and gear",
      "suggestedConnection": 3,
      "suggestedLoyalty": 2,
      "commonMetatypes": ["Human", "Elf", "Dwarf"]
    },
    {
      "id": "street-doc",
      "name": "Street Doc",
      "description": "An underground medical professional",
      "suggestedConnection": 2,
      "suggestedLoyalty": 2,
      "commonMetatypes": ["Human", "Dwarf"]
    }
  ]
}
```

### M0.6 Distributed Karma Spending Architecture

**Objective:** Integrate karma spending into relevant steps instead of a monolithic KarmaStep.

This architectural change distributes karma spending across all relevant character creation steps rather than concentrating it in a single KarmaStep. Users can spend karma on attributes, skills, spells, contacts, and nuyen conversion directly within each step, with a global karma budget tracker ensuring consistency. The result is a more intuitive workflow where karma purchases happen contextually alongside their related selections.

**Files to modify:**
- **M0.6.FM.1** `/lib/types/creation.ts`
- **M0.6.FM.2** `/app/characters/create/components/CreationWizard.tsx`
- **M0.6.FM.3** All step components that will support karma purchases

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| M0.6.1 | Create karma budget tracking system (global tracker in CreationState + KarmaBudgetContext) | ✅ Complete |
| M0.6.2 | Define karma cost constants (Attributes: ×5, Skills: ×2, Spells: 5, etc.) | ✅ Complete |
| M0.6.3 | Create reusable KarmaPurchasePanel component | ✅ Complete |
| M0.6.4 | Integrate karma purchases into all relevant steps using KarmaPurchasePanel (AttributesStep, SkillsStep, ContactsStep, GearStep) | ✅ Complete |
| M0.6.5 | Refactor KarmaStep to become "Karma Summary" or merge into ReviewStep | ✅ Complete |
| M0.6.6 | Ensure 7 Karma max carryover validation works with distributed spending | ✅ Complete |

**Tasks JSON:**
```json
[
  {
    "id": "M0.6.1",
    "title": "Create karma budget tracking system (global tracker in CreationState + KarmaBudgetContext)",
    "description": "This architectural change distributes karma spending across all relevant character creation steps rather than concentrating it in a single KarmaStep. Users can spend karma on attributes, skills, spells, contacts, and nuyen conversion directly within each step, with a global karma budget tracker ensuring consistency. The result is a more intuitive workflow where karma purchases happen contextually alongside their related selections. Create karma budget tracking system (global tracker in CreationState + KarmaBudgetContext).",
    "files": [
      "/lib/types/creation.ts",
      "/app/characters/create/components/CreationWizard.tsx"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "M0.6.2",
    "title": "Define karma cost constants (Attributes: ×5, Skills: ×2, Spells: 5, etc.)",
    "description": "This architectural change distributes karma spending across all relevant character creation steps rather than concentrating it in a single KarmaStep. Users can spend karma on attributes, skills, spells, contacts, and nuyen conversion directly within each step, with a global karma budget tracker ensuring consistency. The result is a more intuitive workflow where karma purchases happen contextually alongside their related selections. Define karma cost constants (Attributes: ×5, Skills: ×2, Spells: 5, etc.).",
    "files": [
      "/lib/types/creation.ts",
      "/app/characters/create/components/CreationWizard.tsx"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "M0.6.3",
    "title": "Create reusable KarmaPurchasePanel component",
    "description": "This architectural change distributes karma spending across all relevant character creation steps rather than concentrating it in a single KarmaStep. Users can spend karma on attributes, skills, spells, contacts, and nuyen conversion directly within each step, with a global karma budget tracker ensuring consistency. The result is a more intuitive workflow where karma purchases happen contextually alongside their related selections. Create reusable KarmaPurchasePanel component.",
    "files": [
      "/lib/types/creation.ts",
      "/app/characters/create/components/CreationWizard.tsx"
    ],
    "status": "Complete",
    "dependsOn": ["M0.6.1", "M0.6.2"]
  },
  {
    "id": "M0.6.4",
    "title": "Integrate karma purchases into all relevant steps using KarmaPurchasePanel (AttributesStep, SkillsStep, ContactsStep, GearStep)",
    "description": "This architectural change distributes karma spending across all relevant character creation steps rather than concentrating it in a single KarmaStep. Users can spend karma on attributes, skills, spells, contacts, and nuyen conversion directly within each step, with a global karma budget tracker ensuring consistency. The result is a more intuitive workflow where karma purchases happen contextually alongside their related selections. Integrate karma purchases into all relevant steps using KarmaPurchasePanel (AttributesStep, SkillsStep, ContactsStep, GearStep).",
    "files": [
      "/lib/types/creation.ts",
      "/app/characters/create/components/CreationWizard.tsx"
    ],
    "status": "Complete",
    "dependsOn": ["M0.6.3"]
  },
  {
    "id": "M0.6.5",
    "title": "Refactor KarmaStep to become \"Karma Summary\" or merge into ReviewStep",
    "description": "This architectural change distributes karma spending across all relevant character creation steps rather than concentrating it in a single KarmaStep. Users can spend karma on attributes, skills, spells, contacts, and nuyen conversion directly within each step, with a global karma budget tracker ensuring consistency. The result is a more intuitive workflow where karma purchases happen contextually alongside their related selections. Refactor KarmaStep to become \"Karma Summary\" or merge into ReviewStep.",
    "files": [
      "/lib/types/creation.ts",
      "/app/characters/create/components/CreationWizard.tsx"
    ],
    "status": "Complete",
    "dependsOn": ["M0.6.4"]
  },
  {
    "id": "M0.6.6",
    "title": "Ensure 7 Karma max carryover validation works with distributed spending",
    "description": "This architectural change distributes karma spending across all relevant character creation steps rather than concentrating it in a single KarmaStep. Users can spend karma on attributes, skills, spells, contacts, and nuyen conversion directly within each step, with a global karma budget tracker ensuring consistency. The result is a more intuitive workflow where karma purchases happen contextually alongside their related selections. Ensure 7 Karma max carryover validation works with distributed spending.",
    "files": [
      "/lib/types/creation.ts",
      "/app/characters/create/components/CreationWizard.tsx"
    ],
    "status": "Complete",
    "dependsOn": ["M0.6.1"]
  }
]
```

**Karma Purchase Costs (SR5 Creation Rules):**
```typescript
const KARMA_COSTS = {
  attribute: (newRating: number) => newRating * 5,      // New rating × 5
  activeSkill: (newRating: number) => newRating * 2,   // New rating × 2
  skillGroup: (newRating: number) => newRating * 5,    // New rating × 5
  specialization: 7,                                    // Flat 7 Karma
  spell: 5,                                            // Flat 5 Karma
  complexForm: 4,                                       // Flat 4 Karma
  powerPoint: 5,                                        // 5 Karma per PP (Mystic Adept)
  contact: (connection: number, loyalty: number) => connection + loyalty,
  nuyenConversion: 2000,                               // 2,000¥ per Karma (max 10)
  positiveQuality: (karma: number) => karma,           // Quality's karma cost
  buyOffNegativeQuality: (karma: number) => karma * 2, // Double karma cost (post-creation)
};
```

**UI Pattern - Karma Purchase Section:**
```
┌─────────────────────────────────────────────────────────────┐
│ ⚡ Karma Purchases                    Budget: 25 → 18 Karma │
├─────────────────────────────────────────────────────────────┤
│ You can spend Karma to gain additional [spells/skills/etc.] │
│                                                             │
│ [+ Add with Karma (5 Karma)]                               │
│                                                             │
│ Karma Purchases in this step:                               │
│ • Heal spell (5 Karma)                    [Remove]          │
│ • Levitate spell (5 Karma)                [Remove]          │
│                                           Total: 10 Karma   │
└─────────────────────────────────────────────────────────────┘
```

### M0.7 SpellsStep Creation

**Objective:** Create dedicated spell selection step for magical characters.

This milestone creates a dedicated step for spell selection that replaces spell management currently embedded in KarmaStep. It implements free spell allocation based on Magic priority, karma purchases for additional spells, and proper validation of spell formula limits. The step only appears for magical characters and provides a comprehensive spell catalog browser with category filters.

**Files to create:**
- **M0.7.FC.1** `/app/characters/create/components/steps/SpellsStep.tsx`

**Files to modify:**
- **M0.7.FM.1** `/app/characters/create/components/CreationWizard.tsx`
- **M0.7.FM.2** `/app/characters/create/components/steps/KarmaStep.tsx`
- **M0.7.FM.3** `/lib/types/creation.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| M0.7.1 | Create SpellsStep component | ✅ Complete |
| M0.7.2 | Implement free spell allocation and tracking system (based on Magic priority, track source: 'free' | 'karma' on each spell) | ✅ Complete |
| M0.7.3 | Add spell catalog browser with category filters | ✅ Complete |
| M0.7.4 | Display spell details (drain, range, duration, effects) | ✅ Complete |
| M0.7.5 | Integrate karma purchase for additional spells (5 Karma each) | ✅ Complete |
| M0.7.6 | Implement spell validation (total limit = Magic × 2 + formula limits = Magic × 2 per category) | ✅ Complete |
| M0.7.7 | Conditionally show step only for magical characters | ✅ Complete |
| M0.7.8 | Register step in CreationWizard after MagicStep and move spell selection out of KarmaStep | ✅ Complete |

**Tasks JSON:**
```json
[
  {
    "id": "M0.7.1",
    "title": "Create SpellsStep component",
    "description": "This milestone creates a dedicated step for spell selection that replaces spell management currently embedded in KarmaStep. It implements free spell allocation based on Magic priority, karma purchases for additional spells, and proper validation of spell formula limits. The step only appears for magical characters and provides a comprehensive spell catalog browser with category filters. Create SpellsStep component.",
    "files": [
      "/app/characters/create/components/steps/SpellsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/app/characters/create/components/steps/KarmaStep.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "M0.7.2",
    "title": "Implement free spell allocation and tracking system (based on Magic priority, track source: 'free' | 'karma' on each spell)",
    "description": "This milestone creates a dedicated step for spell selection that replaces spell management currently embedded in KarmaStep. It implements free spell allocation based on Magic priority, karma purchases for additional spells, and proper validation of spell formula limits. The step only appears for magical characters and provides a comprehensive spell catalog browser with category filters. Implement free spell allocation and tracking system (based on Magic priority, track source: 'free' | 'karma' on each spell).",
    "files": [
      "/app/characters/create/components/steps/SpellsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/app/characters/create/components/steps/KarmaStep.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["M0.7.1"]
  },
  {
    "id": "M0.7.3",
    "title": "Add spell catalog browser with category filters",
    "description": "This milestone creates a dedicated step for spell selection that replaces spell management currently embedded in KarmaStep. It implements free spell allocation based on Magic priority, karma purchases for additional spells, and proper validation of spell formula limits. The step only appears for magical characters and provides a comprehensive spell catalog browser with category filters. Add spell catalog browser with category filters.",
    "files": [
      "/app/characters/create/components/steps/SpellsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/app/characters/create/components/steps/KarmaStep.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["M0.7.1"]
  },
  {
    "id": "M0.7.4",
    "title": "Display spell details (drain, range, duration, effects)",
    "description": "This milestone creates a dedicated step for spell selection that replaces spell management currently embedded in KarmaStep. It implements free spell allocation based on Magic priority, karma purchases for additional spells, and proper validation of spell formula limits. The step only appears for magical characters and provides a comprehensive spell catalog browser with category filters. Display spell details (drain, range, duration, effects).",
    "files": [
      "/app/characters/create/components/steps/SpellsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/app/characters/create/components/steps/KarmaStep.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["M0.7.1"]
  },
  {
    "id": "M0.7.5",
    "title": "Integrate karma purchase for additional spells (5 Karma each)",
    "description": "This milestone creates a dedicated step for spell selection that replaces spell management currently embedded in KarmaStep. It implements free spell allocation based on Magic priority, karma purchases for additional spells, and proper validation of spell formula limits. The step only appears for magical characters and provides a comprehensive spell catalog browser with category filters. Integrate karma purchase for additional spells (5 Karma each).",
    "files": [
      "/app/characters/create/components/steps/SpellsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/app/characters/create/components/steps/KarmaStep.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["M0.7.2", "M0.6.3"]
  },
  {
    "id": "M0.7.6",
    "title": "Implement spell validation (total limit = Magic × 2 + formula limits = Magic × 2 per category)",
    "description": "This milestone creates a dedicated step for spell selection that replaces spell management currently embedded in KarmaStep. It implements free spell allocation based on Magic priority, karma purchases for additional spells, and proper validation of spell formula limits. The step only appears for magical characters and provides a comprehensive spell catalog browser with category filters. Implement spell validation (total limit = Magic × 2 + formula limits = Magic × 2 per category).",
    "files": [
      "/app/characters/create/components/steps/SpellsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/app/characters/create/components/steps/KarmaStep.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["M0.7.2"]
  },
  {
    "id": "M0.7.7",
    "title": "Conditionally show step only for magical characters",
    "description": "This milestone creates a dedicated step for spell selection that replaces spell management currently embedded in KarmaStep. It implements free spell allocation based on Magic priority, karma purchases for additional spells, and proper validation of spell formula limits. The step only appears for magical characters and provides a comprehensive spell catalog browser with category filters. Conditionally show step only for magical characters.",
    "files": [
      "/app/characters/create/components/steps/SpellsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/app/characters/create/components/steps/KarmaStep.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["M0.7.1"]
  },
  {
    "id": "M0.7.8",
    "title": "Register step in CreationWizard after MagicStep and move spell selection out of KarmaStep",
    "description": "This milestone creates a dedicated step for spell selection that replaces spell management currently embedded in KarmaStep. It implements free spell allocation based on Magic priority, karma purchases for additional spells, and proper validation of spell formula limits. The step only appears for magical characters and provides a comprehensive spell catalog browser with category filters. Register step in CreationWizard after MagicStep and move spell selection out of KarmaStep.",
    "files": [
      "/app/characters/create/components/steps/SpellsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/app/characters/create/components/steps/KarmaStep.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["M0.7.7", "M0.6.5"]
  }
]
```

**Free Spells by Priority:**
| Magic Priority | Free Spells |
|----------------|-------------|
| A (Magic 6) | 10 spells |
| B (Magic 5) | 7 spells |
| C (Magic 4) | 5 spells |
| D (Magic 3) | 3 spells |
| E | N/A (Mundane) |

**SpellsStep UI Wireframe:**
```
┌─────────────────────────────────────────────────────────────┐
│ Spells                              Karma Remaining: 18     │
├─────────────────────────────────────────────────────────────┤
│ Free Spells: 7/7 selected (Magic Priority B)               │
│ Spell Limit: 10/12 (Magic × 2)                             │
├─────────────────────────────────────────────────────────────┤
│ Category: [All ▼]  Search: [____________]                   │
│                                                             │
│ COMBAT SPELLS                                               │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ☑ Manabolt           Direct | P | LOS | I | WIL        ││
│ │   Drain: F-3         A single target spell...           ││
│ └─────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ☐ Fireball           Indirect | P | LOS(A) | I | -     ││
│ │   Drain: F+1         An area spell dealing fire...      ││
│ │                                    [+ Add Free]         ││
│ └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│ Selected Spells (7 free + 3 karma):                         │
│ • Manabolt (Free)                                           │
│ • Stunbolt (Free)                                           │
│ • Heal (Free)                                               │
│ • Increase Reflexes (Free)                                  │
│ • Improved Invisibility (Free)                              │
│ • Levitate (Free)                                           │
│ • Physical Barrier (Free)                                   │
│ • Detect Life (5 Karma)                    [Remove]         │
│ • Armor (5 Karma)                          [Remove]         │
│ • Combat Sense (5 Karma)                   [Remove]         │
├─────────────────────────────────────────────────────────────┤
│ ⚡ Karma spent on spells: 15                                │
└─────────────────────────────────────────────────────────────┘
```

### M0.8 Aspected Mage Enhancements

This enhancement enables proper aspected mage character creation by allowing players to select their magical aspect (Sorcery, Conjuring, or Enchanting). The system then filters available skills and skill groups based on the selected aspect, ensuring aspected mages can only access skills appropriate to their specialization. This is already complete and documented here for reference.

**Files to modify:**
- **M0.8.FM.1** `/app/characters/create/components/steps/MagicStep.tsx`
- **M0.8.FM.2** `/app/characters/create/components/steps/SkillsStep.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| M0.8.1 | Add Aspected Mage group selection UI (Sorcery, Conjuring, Enchanting) | Complete |
| M0.8.2 | Store selected aspected mage group in CreationState | Complete |
| M0.8.3 | Filter skills and skill groups based on selected aspect | Complete |
| M0.8.4 | Validate aspected mage group selection before proceeding | Complete |

**Tasks JSON:**
```json
[
  {
    "id": "M0.8.1",
    "title": "Add Aspected Mage group selection UI (Sorcery, Conjuring, Enchanting)",
    "description": "This enhancement enables proper aspected mage character creation by allowing players to select their magical aspect (Sorcery, Conjuring, or Enchanting). The system then filters available skills and skill groups based on the selected aspect, ensuring aspected mages can only access skills appropriate to their specialization. This is already complete and documented here for reference. Add Aspected Mage group selection UI (Sorcery, Conjuring, Enchanting).",
    "files": [
      "/app/characters/create/components/steps/MagicStep.tsx",
      "/app/characters/create/components/steps/SkillsStep.tsx"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "M0.8.2",
    "title": "Store selected aspected mage group in CreationState",
    "description": "This enhancement enables proper aspected mage character creation by allowing players to select their magical aspect (Sorcery, Conjuring, or Enchanting). The system then filters available skills and skill groups based on the selected aspect, ensuring aspected mages can only access skills appropriate to their specialization. This is already complete and documented here for reference. Store selected aspected mage group in CreationState.",
    "files": [
      "/app/characters/create/components/steps/MagicStep.tsx",
      "/app/characters/create/components/steps/SkillsStep.tsx"
    ],
    "status": "Complete",
    "dependsOn": ["M0.8.1"]
  },
  {
    "id": "M0.8.3",
    "title": "Filter skills and skill groups based on selected aspect",
    "description": "This enhancement enables proper aspected mage character creation by allowing players to select their magical aspect (Sorcery, Conjuring, or Enchanting). The system then filters available skills and skill groups based on the selected aspect, ensuring aspected mages can only access skills appropriate to their specialization. This is already complete and documented here for reference. Filter skills and skill groups based on selected aspect.",
    "files": [
      "/app/characters/create/components/steps/MagicStep.tsx",
      "/app/characters/create/components/steps/SkillsStep.tsx"
    ],
    "status": "Complete",
    "dependsOn": ["M0.8.2"]
  },
  {
    "id": "M0.8.4",
    "title": "Validate aspected mage group selection before proceeding",
    "description": "This enhancement enables proper aspected mage character creation by allowing players to select their magical aspect (Sorcery, Conjuring, or Enchanting). The system then filters available skills and skill groups based on the selected aspect, ensuring aspected mages can only access skills appropriate to their specialization. This is already complete and documented here for reference. Validate aspected mage group selection before proceeding.",
    "files": [
      "/app/characters/create/components/steps/MagicStep.tsx",
      "/app/characters/create/components/steps/SkillsStep.tsx"
    ],
    "status": "Complete",
    "dependsOn": ["M0.8.1"]
  }
]
```

**Note:** Aspected Mage group selection is already implemented. This section documents the completion status.

### M0.9 Acceptance Criteria

This section defines the acceptance criteria that must be met for Phase M0 to be considered complete. Each criterion represents a specific feature or behavior that must function correctly before proceeding to Beta phases. These criteria ensure all MVP gaps are properly addressed and the character creation system is production-ready.

- **M0.9.AC.1** [x] Validation panel shows consistent state across wizard
- **M0.9.AC.2** [x] Racial traits automatically become racial qualities on character
- **M0.9.AC.3** [x] Magical skills disabled for mundane characters
- **M0.9.AC.4** [x] Adept skill filtering blocks ALL magical skill groups (both individual skills and groups)
- **M0.9.AC.5** [x] Skill specializations show suggestions with free text option
- **M0.9.AC.6** [x] Example knowledge/language skills available
- **M0.9.AC.7** [x] Aspected Mage group selection implemented and working
- **M0.9.AC.8** [x] Free skills from priority tracked separately from karma-purchased
- **M0.9.AC.9** [ ] Racial qualities hidden from quality selection
- **M0.9.AC.10** [ ] Leveled qualities (Addiction) work correctly
- **M0.9.AC.11** [ ] Stat-modifying qualities (Aptitude) apply correctly
- **M0.9.AC.12** [ ] Example contacts available as templates
- **M0.9.AC.13** [ ] Global karma budget tracks spending across all steps
- **M0.9.AC.14** [ ] Each step shows karma purchase option where applicable
- **M0.9.AC.15** [ ] SpellsStep appears only for magical characters
- **M0.9.AC.16** [ ] Free spells allocated correctly by priority
- **M0.9.AC.17** [ ] Free spells/complex forms tracked separately from karma-purchased
- **M0.9.AC.18** [ ] Spell formula limits validated (Magic × 2 per category)
- **M0.9.AC.19** [ ] Karma spell purchases work within SpellsStep
- **M0.9.AC.20** [ ] 7 Karma max carryover validated correctly

---

## Phase B1: Cyberware/Bioware System

**Objective:** Full augmentation system with essence tracking, capacity, and grades.

This phase implements the complete augmentation system for cyberware and bioware, including essence tracking, grade selection, capacity management, and integration with character stats. It enables players to install augmentations during character creation with proper validation and automatic calculation of derived stats. The phase is already complete and serves as a foundation for post-creation augmentation management.

### B1.1 Data Structure Updates

This milestone establishes the data structures needed to represent cyberware and bioware in the system. It defines interfaces for augmentation items, grades, categories, and essence costs. The goal is to create a flexible type system that supports all SR5 augmentation mechanics including capacity tracking for cyberlimbs and essence hole tracking for magical characters.

**Files to modify:**

**Files to modify:**
- **B1.1.FM.1** `/lib/types/character.ts`
- **B1.1.FM.2** `/lib/types/edition.ts`
- **B1.1.FM.3** `/data/editions/sr5/core-rulebook.json`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B1.1.1 | Add CyberwareGrade type (standard, alpha, beta, delta, used) | Complete |
| B1.1.2 | Add CyberwareCategory enum (headware, eyeware, earware, bodyware, cyberlimbs, etc.) | Complete |
| B1.1.3 | Expand Cyberware interface with capacity, capacityUsed, grade, essenceCostMultiplier | Complete |
| B1.1.4 | Add Bioware interface mirroring Cyberware with bioIndex instead of capacity | Complete |
| B1.1.5 | Add EssenceHole tracking for magic users | Complete |
| B1.1.6 | Populate core-rulebook.json with SR5 cyberware catalog (50+ items) | Complete (70+ items) |
| B1.1.7 | Populate core-rulebook.json with SR5 bioware catalog (30+ items) | Complete (60+ items) |

**Tasks JSON:**
```json
[
  {
    "id": "B1.1.1",
    "title": "Add CyberwareGrade type (standard, alpha, beta, delta, used)",
    "description": "This milestone establishes the data structures needed to represent cyberware and bioware in the system. It defines interfaces for augmentation items, grades, categories, and essence costs. The goal is to create a flexible type system that supports all SR5 augmentation mechanics including capacity tracking for cyberlimbs and essence hole tracking for magical characters. Add CyberwareGrade type (standard, alpha, beta, delta, used).",
    "files": [
      "/lib/types/character.ts",
      "/lib/types/edition.ts",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "B1.1.2",
    "title": "Add CyberwareCategory enum (headware, eyeware, earware, bodyware, cyberlimbs, etc.)",
    "description": "This milestone establishes the data structures needed to represent cyberware and bioware in the system. It defines interfaces for augmentation items, grades, categories, and essence costs. The goal is to create a flexible type system that supports all SR5 augmentation mechanics including capacity tracking for cyberlimbs and essence hole tracking for magical characters. Add CyberwareCategory enum (headware, eyeware, earware, bodyware, cyberlimbs, etc.).",
    "files": [
      "/lib/types/character.ts",
      "/lib/types/edition.ts",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "B1.1.3",
    "title": "Expand Cyberware interface with capacity, capacityUsed, grade, essenceCostMultiplier",
    "description": "This milestone establishes the data structures needed to represent cyberware and bioware in the system. It defines interfaces for augmentation items, grades, categories, and essence costs. The goal is to create a flexible type system that supports all SR5 augmentation mechanics including capacity tracking for cyberlimbs and essence hole tracking for magical characters. Expand Cyberware interface with capacity, capacityUsed, grade, essenceCostMultiplier.",
    "files": [
      "/lib/types/character.ts",
      "/lib/types/edition.ts",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Complete",
    "dependsOn": ["B1.1.1", "B1.1.2"]
  },
  {
    "id": "B1.1.4",
    "title": "Add Bioware interface mirroring Cyberware with bioIndex instead of capacity",
    "description": "This milestone establishes the data structures needed to represent cyberware and bioware in the system. It defines interfaces for augmentation items, grades, categories, and essence costs. The goal is to create a flexible type system that supports all SR5 augmentation mechanics including capacity tracking for cyberlimbs and essence hole tracking for magical characters. Add Bioware interface mirroring Cyberware with bioIndex instead of capacity.",
    "files": [
      "/lib/types/character.ts",
      "/lib/types/edition.ts",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Complete",
    "dependsOn": ["B1.1.3"]
  },
  {
    "id": "B1.1.5",
    "title": "Add EssenceHole tracking for magic users",
    "description": "This milestone establishes the data structures needed to represent cyberware and bioware in the system. It defines interfaces for augmentation items, grades, categories, and essence costs. The goal is to create a flexible type system that supports all SR5 augmentation mechanics including capacity tracking for cyberlimbs and essence hole tracking for magical characters. Add EssenceHole tracking for magic users.",
    "files": [
      "/lib/types/character.ts",
      "/lib/types/edition.ts",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "B1.1.6",
    "title": "Populate core-rulebook.json with SR5 cyberware catalog (50+ items)",
    "description": "This milestone establishes the data structures needed to represent cyberware and bioware in the system. It defines interfaces for augmentation items, grades, categories, and essence costs. The goal is to create a flexible type system that supports all SR5 augmentation mechanics including capacity tracking for cyberlimbs and essence hole tracking for magical characters. Populate core-rulebook.json with SR5 cyberware catalog (50+ items).",
    "files": [
      "/lib/types/character.ts",
      "/lib/types/edition.ts",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Complete",
    "dependsOn": ["B1.1.3"]
  },
  {
    "id": "B1.1.7",
    "title": "Populate core-rulebook.json with SR5 bioware catalog (30+ items)",
    "description": "This milestone establishes the data structures needed to represent cyberware and bioware in the system. It defines interfaces for augmentation items, grades, categories, and essence costs. The goal is to create a flexible type system that supports all SR5 augmentation mechanics including capacity tracking for cyberlimbs and essence hole tracking for magical characters. Populate core-rulebook.json with SR5 bioware catalog (30+ items).",
    "files": [
      "/lib/types/character.ts",
      "/lib/types/edition.ts",
      "/data/editions/sr5/core-rulebook.json"
    ],
    "status": "Complete",
    "dependsOn": ["B1.1.4"]
  }
]
```

**Cyberware Grade Essence Multipliers:**
```typescript
const gradeMultipliers = {
  used: 1.25,      // +25% essence cost
  standard: 1.0,   // base cost
  alpha: 0.8,      // -20% essence cost
  beta: 0.6,       // -40% essence cost
  delta: 0.5       // -50% essence cost
};
```

### B1.2 Ruleset Context Hooks

This milestone adds React hooks to the RulesetContext that provide easy access to cyberware and bioware catalogs throughout the application. It also includes hooks for augmentation rules like essence limits and capacity calculations. These hooks enable components to filter and search augmentations without directly accessing the raw ruleset data.

**Files to modify:**
- **B1.2.FM.1** `/lib/rules/RulesetContext.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B1.2.1 | Add `useCyberware()` hook returning filtered cyberware catalog | Complete |
| B1.2.2 | Add `useBioware()` hook returning filtered bioware catalog | Complete |
| B1.2.3 | Add `useAugmentationRules()` hook for essence limits, capacity rules | Complete |
| B1.2.4 | Add essence calculation utilities | Complete |

**Tasks JSON:**
```json
[
  {
    "id": "B1.2.1",
    "title": "Add `useCyberware()` hook returning filtered cyberware catalog",
    "description": "This milestone adds React hooks to the RulesetContext that provide easy access to cyberware and bioware catalogs throughout the application. It also includes hooks for augmentation rules like essence limits and capacity calculations. These hooks enable components to filter and search augmentations without directly accessing the raw ruleset data. Add `useCyberware()` hook returning filtered cyberware catalog.",
    "files": [
      "/lib/rules/RulesetContext.tsx"
    ],
    "status": "Complete",
    "dependsOn": ["B1.1.6"]
  },
  {
    "id": "B1.2.2",
    "title": "Add `useBioware()` hook returning filtered bioware catalog",
    "description": "This milestone adds React hooks to the RulesetContext that provide easy access to cyberware and bioware catalogs throughout the application. It also includes hooks for augmentation rules like essence limits and capacity calculations. These hooks enable components to filter and search augmentations without directly accessing the raw ruleset data. Add `useBioware()` hook returning filtered bioware catalog.",
    "files": [
      "/lib/rules/RulesetContext.tsx"
    ],
    "status": "Complete",
    "dependsOn": ["B1.1.7"]
  },
  {
    "id": "B1.2.3",
    "title": "Add `useAugmentationRules()` hook for essence limits, capacity rules",
    "description": "This milestone adds React hooks to the RulesetContext that provide easy access to cyberware and bioware catalogs throughout the application. It also includes hooks for augmentation rules like essence limits and capacity calculations. These hooks enable components to filter and search augmentations without directly accessing the raw ruleset data. Add `useAugmentationRules()` hook for essence limits, capacity rules.",
    "files": [
      "/lib/rules/RulesetContext.tsx"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "B1.2.4",
    "title": "Add essence calculation utilities",
    "description": "This milestone adds React hooks to the RulesetContext that provide easy access to cyberware and bioware catalogs throughout the application. It also includes hooks for augmentation rules like essence limits and capacity calculations. These hooks enable components to filter and search augmentations without directly accessing the raw ruleset data. Add essence calculation utilities.",
    "files": [
      "/lib/rules/RulesetContext.tsx"
    ],
    "status": "Complete",
    "dependsOn": []
  }
]
```

### B1.3 Character Creation Step

This milestone creates the AugmentationsStep component that allows players to select and install cyberware and bioware during character creation. It provides a searchable catalog with category filters, grade selection, real-time essence tracking, and availability validation. The component integrates with the character creation wizard and enforces all augmentation rules from the SR5 core rulebook.

**Files to create:**
- **B1.3.FC.1** `/app/characters/create/components/steps/AugmentationsStep.tsx`

**Files to modify:**
- **B1.3.FM.1** `/app/characters/create/components/CreationWizard.tsx`
- **B1.3.FM.2** `/lib/types/creation.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B1.3.1 | Create AugmentationsStep component with tabbed interface (Cyberware/Bioware) | Complete |
| B1.3.2 | Implement searchable augmentation catalog with category filters | Complete |
| B1.3.3 | Add grade selector per augmentation item | Complete |
| B1.3.4 | Implement real-time essence tracking display | Complete |
| B1.3.5 | Add capacity tracking for modular cyberware (cyberlimbs) | Complete |
| B1.3.6 | Implement availability validation (≤12 at creation) | Complete |
| B1.3.7 | Add nuyen cost tracking integrated with GearStep budget | Complete |
| B1.3.8 | Handle Magic/Resonance reduction from essence loss | Complete |
| B1.3.9 | Add augmentation bonus validation (max +4 per attribute) | Complete |
| B1.3.10 | Register step in CreationWizard between QualitiesStep and ContactsStep | Complete |

**Tasks JSON:**
```json
[
  {
    "id": "B1.3.1",
    "title": "Create AugmentationsStep component with tabbed interface (Cyberware/Bioware)",
    "description": "This milestone creates the AugmentationsStep component that allows players to select and install cyberware and bioware during character creation. It provides a searchable catalog with category filters, grade selection, real-time essence tracking, and availability validation. The component integrates with the character creation wizard and enforces all augmentation rules from the SR5 core rulebook. Create AugmentationsStep component with tabbed interface (Cyberware/Bioware).",
    "files": [
      "/app/characters/create/components/steps/AugmentationsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["B1.1.6", "B1.1.7", "B1.2.1", "B1.2.2"]
  },
  {
    "id": "B1.3.2",
    "title": "Implement searchable augmentation catalog with category filters",
    "description": "This milestone creates the AugmentationsStep component that allows players to select and install cyberware and bioware during character creation. It provides a searchable catalog with category filters, grade selection, real-time essence tracking, and availability validation. The component integrates with the character creation wizard and enforces all augmentation rules from the SR5 core rulebook. Implement searchable augmentation catalog with category filters.",
    "files": [
      "/app/characters/create/components/steps/AugmentationsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["B1.3.1"]
  },
  {
    "id": "B1.3.3",
    "title": "Add grade selector per augmentation item",
    "description": "This milestone creates the AugmentationsStep component that allows players to select and install cyberware and bioware during character creation. It provides a searchable catalog with category filters, grade selection, real-time essence tracking, and availability validation. The component integrates with the character creation wizard and enforces all augmentation rules from the SR5 core rulebook. Add grade selector per augmentation item.",
    "files": [
      "/app/characters/create/components/steps/AugmentationsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["B1.3.1"]
  },
  {
    "id": "B1.3.4",
    "title": "Implement real-time essence tracking display",
    "description": "This milestone creates the AugmentationsStep component that allows players to select and install cyberware and bioware during character creation. It provides a searchable catalog with category filters, grade selection, real-time essence tracking, and availability validation. The component integrates with the character creation wizard and enforces all augmentation rules from the SR5 core rulebook. Implement real-time essence tracking display.",
    "files": [
      "/app/characters/create/components/steps/AugmentationsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["B1.3.1", "B1.2.4"]
  },
  {
    "id": "B1.3.5",
    "title": "Add capacity tracking for modular cyberware (cyberlimbs)",
    "description": "This milestone creates the AugmentationsStep component that allows players to select and install cyberware and bioware during character creation. It provides a searchable catalog with category filters, grade selection, real-time essence tracking, and availability validation. The component integrates with the character creation wizard and enforces all augmentation rules from the SR5 core rulebook. Add capacity tracking for modular cyberware (cyberlimbs).",
    "files": [
      "/app/characters/create/components/steps/AugmentationsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["B1.3.1"]
  },
  {
    "id": "B1.3.6",
    "title": "Implement availability validation (≤12 at creation)",
    "description": "This milestone creates the AugmentationsStep component that allows players to select and install cyberware and bioware during character creation. It provides a searchable catalog with category filters, grade selection, real-time essence tracking, and availability validation. The component integrates with the character creation wizard and enforces all augmentation rules from the SR5 core rulebook. Implement availability validation (≤12 at creation).",
    "files": [
      "/app/characters/create/components/steps/AugmentationsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["B1.3.1"]
  },
  {
    "id": "B1.3.7",
    "title": "Add nuyen cost tracking integrated with GearStep budget",
    "description": "This milestone creates the AugmentationsStep component that allows players to select and install cyberware and bioware during character creation. It provides a searchable catalog with category filters, grade selection, real-time essence tracking, and availability validation. The component integrates with the character creation wizard and enforces all augmentation rules from the SR5 core rulebook. Add nuyen cost tracking integrated with GearStep budget.",
    "files": [
      "/app/characters/create/components/steps/AugmentationsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["B1.3.1"]
  },
  {
    "id": "B1.3.8",
    "title": "Handle Magic/Resonance reduction from essence loss",
    "description": "This milestone creates the AugmentationsStep component that allows players to select and install cyberware and bioware during character creation. It provides a searchable catalog with category filters, grade selection, real-time essence tracking, and availability validation. The component integrates with the character creation wizard and enforces all augmentation rules from the SR5 core rulebook. Handle Magic/Resonance reduction from essence loss.",
    "files": [
      "/app/characters/create/components/steps/AugmentationsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["B1.3.4", "B1.1.5"]
  },
  {
    "id": "B1.3.9",
    "title": "Add augmentation bonus validation (max +4 per attribute)",
    "description": "This milestone creates the AugmentationsStep component that allows players to select and install cyberware and bioware during character creation. It provides a searchable catalog with category filters, grade selection, real-time essence tracking, and availability validation. The component integrates with the character creation wizard and enforces all augmentation rules from the SR5 core rulebook. Add augmentation bonus validation (max +4 per attribute).",
    "files": [
      "/app/characters/create/components/steps/AugmentationsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["B1.3.1"]
  },
  {
    "id": "B1.3.10",
    "title": "Register step in CreationWizard between QualitiesStep and ContactsStep",
    "description": "This milestone creates the AugmentationsStep component that allows players to select and install cyberware and bioware during character creation. It provides a searchable catalog with category filters, grade selection, real-time essence tracking, and availability validation. The component integrates with the character creation wizard and enforces all augmentation rules from the SR5 core rulebook. Register step in CreationWizard between QualitiesStep and ContactsStep.",
    "files": [
      "/app/characters/create/components/steps/AugmentationsStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Complete",
    "dependsOn": ["B1.3.1", "B1.3.2", "B1.3.3", "B1.3.4", "B1.3.5", "B1.3.6", "B1.3.7", "B1.3.8", "B1.3.9"]
  }
]
```

**UI Wireframe:**
```
┌─────────────────────────────────────────────────────────────┐
│ Augmentations                                               │
├─────────────────────────────────────────────────────────────┤
│ [Cyberware] [Bioware]                                       │
│                                                             │
│ Essence: 5.2 / 6.0  ████████████░░░░                       │
│ Nuyen: 45,000¥ remaining                                    │
├─────────────────────────────────────────────────────────────┤
│ Search: [____________] Category: [All ▼] Grade: [All ▼]     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Datajack                         Essence: 0.1           │ │
│ │ Headware | Avail 4 | 1,000¥                             │ │
│ │ Grade: [Standard ▼]              [+ Add]                │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Wired Reflexes 1                 Essence: 2.0           │ │
│ │ Bodyware | Avail 8R | 39,000¥    +1 REA, +1D6 Init      │ │
│ │ Grade: [Standard ▼]              [+ Add]                │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Selected Augmentations:                                     │
│ • Datajack (Standard) - 0.1 ESS - 1,000¥       [Remove]    │
│ • Smartlink (Alpha) - 0.08 ESS - 6,000¥        [Remove]    │
└─────────────────────────────────────────────────────────────┘
```

### B1.4 Derived Stats Updates

This milestone ensures that all character derived stats correctly account for augmentation bonuses and essence loss. It updates calculations for Social Limit, Overflow, and other derived attributes to reflect installed augmentations. The goal is to ensure that character sheets and review displays accurately represent the character's final stats after augmentation modifications.

**Files to modify:**
- **B1.4.FM.1** `/app/characters/create/components/steps/ReviewStep.tsx`
- **B1.4.FM.2** `/lib/types/character.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B1.4.1 | Update derived stats calculation to include augmentation bonuses | Complete |
| B1.4.2 | Calculate Social Limit with reduced Essence | Complete |
| B1.4.3 | Calculate Overflow with augmentation Body bonuses | Complete |
| B1.4.4 | Display augmentation-modified attributes clearly | Complete |

**Tasks JSON:**
```json
[
  {
    "id": "B1.4.1",
    "title": "Update derived stats calculation to include augmentation bonuses",
    "description": "This milestone ensures that all character derived stats correctly account for augmentation bonuses and essence loss. It updates calculations for Social Limit, Overflow, and other derived attributes to reflect installed augmentations. The goal is to ensure that character sheets and review displays accurately represent the character's final stats after augmentation modifications. Update derived stats calculation to include augmentation bonuses.",
    "files": [
      "/app/characters/create/components/steps/ReviewStep.tsx",
      "/lib/types/character.ts"
    ],
    "status": "Complete",
    "dependsOn": ["B1.3.9"]
  },
  {
    "id": "B1.4.2",
    "title": "Calculate Social Limit with reduced Essence",
    "description": "This milestone ensures that all character derived stats correctly account for augmentation bonuses and essence loss. It updates calculations for Social Limit, Overflow, and other derived attributes to reflect installed augmentations. The goal is to ensure that character sheets and review displays accurately represent the character's final stats after augmentation modifications. Calculate Social Limit with reduced Essence.",
    "files": [
      "/app/characters/create/components/steps/ReviewStep.tsx",
      "/lib/types/character.ts"
    ],
    "status": "Complete",
    "dependsOn": ["B1.4.1", "B1.3.4"]
  },
  {
    "id": "B1.4.3",
    "title": "Calculate Overflow with augmentation Body bonuses",
    "description": "This milestone ensures that all character derived stats correctly account for augmentation bonuses and essence loss. It updates calculations for Social Limit, Overflow, and other derived attributes to reflect installed augmentations. The goal is to ensure that character sheets and review displays accurately represent the character's final stats after augmentation modifications. Calculate Overflow with augmentation Body bonuses.",
    "files": [
      "/app/characters/create/components/steps/ReviewStep.tsx",
      "/lib/types/character.ts"
    ],
    "status": "Complete",
    "dependsOn": ["B1.4.1"]
  },
  {
    "id": "B1.4.4",
    "title": "Display augmentation-modified attributes clearly",
    "description": "This milestone ensures that all character derived stats correctly account for augmentation bonuses and essence loss. It updates calculations for Social Limit, Overflow, and other derived attributes to reflect installed augmentations. The goal is to ensure that character sheets and review displays accurately represent the character's final stats after augmentation modifications. Display augmentation-modified attributes clearly.",
    "files": [
      "/app/characters/create/components/steps/ReviewStep.tsx",
      "/lib/types/character.ts"
    ],
    "status": "Complete",
    "dependsOn": ["B1.4.1", "B1.4.2", "B1.4.3"]
  }
]
```

### B1.5 Acceptance Criteria

- **B1.5.AC.1** [x] User can browse cyberware/bioware catalog with filters
- **B1.5.AC.2** [x] Essence cost correctly calculated with grade multipliers
- **B1.5.AC.3** [x] Magic/Resonance automatically reduced when essence drops
- **B1.5.AC.4** [x] Capacity system works for modular cyberware
- **B1.5.AC.5** [x] Availability validation prevents >12 items at creation
- **B1.5.AC.6** [x] Nuyen budget properly deducted
- **B1.5.AC.7** [x] Augmentation bonuses apply to derived stats
- **B1.5.AC.8** [x] No augmentation bonus exceeds +4 per attribute

---

## Phase B2: Sourcebook Integration

**Objective:** Enable Run Faster and Street Grimoire content with proper merging.

This phase enables integration of additional SR5 sourcebooks (Run Faster and Street Grimoire) into the character creation system. It implements sourcebook selection UI, data loading, and proper merging of new content with core rules. The goal is to provide players with access to metavariants, additional spells, traditions, and other expanded content while maintaining rule consistency.

### B2.1 Sourcebook Data Files

This milestone creates the sourcebook data files for Run Faster and Street Grimoire, containing metavariants, additional spells, qualities, traditions, and other expanded content. It structures the data to work with the existing merge system, allowing players to enable sourcebook content during character creation. The result expands character options significantly while maintaining compatibility with core rulebook content.

**Files to create:**
- **B2.1.FC.1** `/data/editions/sr5/run-faster.json`
- **B2.1.FC.2** `/data/editions/sr5/street-grimoire.json`

**Content to include:**

**Run Faster:**
| Module | Content | Priority |
|--------|---------|----------|
| metatypes | Metavariants (Nocturna, Satyr, Ogre, etc.) | High |
| qualities | New positive/negative qualities (~40) | High |
| lifestyles | Lifestyle options and qualities | Medium |
| creationMethods | Life Modules, Sum-to-Ten, Karma Point-Buy | Medium |
| skills | New knowledge skill categories | Low |

**Street Grimoire:**
| Module | Content | Priority |
|--------|---------|----------|
| spells | New spells by category (~100) | High |
| traditions | Additional magical traditions | High |
| mentorSpirits | Mentor spirit catalog | Medium |
| adeptPowers | New adept powers (~30) | Medium |
| rituals | Ritual spellcasting rules and rituals | Medium |
| qualities | Magic-related qualities | Medium |

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B2.1.1 | Create run-faster.json skeleton with meta and modules structure | Not Started |
| B2.1.2 | Populate Run Faster content (metavariants, qualities, creation methods, lifestyles) | Not Started |
| B2.1.3 | Create street-grimoire.json skeleton | Not Started |
| B2.1.4 | Populate Street Grimoire content (spells, traditions, mentor spirits, adept powers, rituals, qualities) | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B2.1.1",
    "title": "Create run-faster.json skeleton with meta and modules structure",
    "description": "This milestone creates the sourcebook data files for Run Faster and Street Grimoire, containing metavariants, additional spells, qualities, traditions, and other expanded content. It structures the data to work with the existing merge system, allowing players to enable sourcebook content during character creation. The result expands character options significantly while maintaining compatibility with core rulebook content. Create run-faster.json skeleton with meta and modules structure.",
    "files": [
      "/data/editions/sr5/run-faster.json"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B2.1.2",
    "title": "Populate Run Faster content (metavariants, qualities, creation methods, lifestyles)",
    "description": "This milestone creates the sourcebook data files for Run Faster and Street Grimoire, containing metavariants, additional spells, qualities, traditions, and other expanded content. It structures the data to work with the existing merge system, allowing players to enable sourcebook content during character creation. The result expands character options significantly while maintaining compatibility with core rulebook content. Populate Run Faster content (metavariants, qualities, creation methods, lifestyles).",
    "files": [
      "/data/editions/sr5/run-faster.json"
    ],
    "status": "Not Started",
    "dependsOn": ["B2.1.1"]
  },
  {
    "id": "B2.1.3",
    "title": "Create street-grimoire.json skeleton",
    "description": "This milestone creates the sourcebook data files for Run Faster and Street Grimoire, containing metavariants, additional spells, qualities, traditions, and other expanded content. It structures the data to work with the existing merge system, allowing players to enable sourcebook content during character creation. The result expands character options significantly while maintaining compatibility with core rulebook content. Create street-grimoire.json skeleton.",
    "files": [
      "/data/editions/sr5/street-grimoire.json"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B2.1.4",
    "title": "Populate Street Grimoire content (spells, traditions, mentor spirits, adept powers, rituals, qualities)",
    "description": "This milestone creates the sourcebook data files for Run Faster and Street Grimoire, containing metavariants, additional spells, qualities, traditions, and other expanded content. It structures the data to work with the existing merge system, allowing players to enable sourcebook content during character creation. The result expands character options significantly while maintaining compatibility with core rulebook content. Populate Street Grimoire content (spells, traditions, mentor spirits, adept powers, rituals, qualities).",
    "files": [
      "/data/editions/sr5/street-grimoire.json"
    ],
    "status": "Not Started",
    "dependsOn": ["B2.1.3"]
  }
]
```

**Run Faster Metavariants Structure:**
```json
{
  "metatypes": {
    "mergeStrategy": "append",
    "payload": {
      "metatypes": [
        {
          "id": "elf-nocturna",
          "name": "Nocturna",
          "baseMetatype": "elf",
          "priorityAvailability": { "A": true, "B": true, "C": false, "D": false, "E": false },
          "specialAttributePoints": 3,
          "attributeModifiers": {
            "body": { "min": 1, "max": 5 },
            "agility": { "min": 3, "max": 8 },
            "reaction": { "min": 2, "max": 7 },
            "strength": { "min": 1, "max": 5 },
            "willpower": { "min": 1, "max": 6 },
            "logic": { "min": 1, "max": 6 },
            "intuition": { "min": 2, "max": 7 },
            "charisma": { "min": 3, "max": 8 }
          },
          "racialTraits": ["Low-Light Vision", "Enhanced Hearing", "Allergy (Sunlight, Moderate)"],
          "karmaCost": 10
        }
      ]
    }
  }
}
```


### B2.2 Sourcebook Selection UI

This milestone creates a UI component that allows players to select which sourcebooks to enable during character creation. It displays sourcebook metadata and content summaries to help players make informed choices. The selection persists throughout the character creation process and is saved with the character record for future reference.

**Files to create:**
- **B2.2.FC.1** `/app/characters/create/components/SourcebookSelector.tsx`

**Files to modify:**
- **B2.2.FM.1** `/app/characters/create/page.tsx`
- **B2.2.FM.2** `/lib/types/creation.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B2.2.1 | Implement sourcebook selection UI with state persistence (component, metadata display, CreationState storage, ruleset loader integration) | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B2.2.1",
    "title": "Implement sourcebook selection UI with state persistence (component, metadata display, CreationState storage, ruleset loader integration)",
    "description": "This milestone creates a UI component that allows players to select which sourcebooks to enable during character creation. It displays sourcebook metadata and content summaries to help players make informed choices. The selection persists throughout the character creation process and is saved with the character record for future reference. Implement sourcebook selection UI with state persistence (component, metadata display, CreationState storage, ruleset loader integration).",
    "files": [
      "/app/characters/create/components/SourcebookSelector.tsx",
      "/app/characters/create/page.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B2.1.1", "B2.1.3"]
  }
]
```

### B2.3 Merge Algorithm Testing

This milestone creates comprehensive tests for the ruleset merging system to ensure all sourcebooks combine correctly without conflicts. It verifies that append, replace, and other merge strategies work as intended when combining core rules with sourcebook content. The goal is to catch merge conflicts and data inconsistencies before they affect character creation, and to create a testing framework that works for current and future sourcebooks.

**Files to create:**
- **B2.3.FC.1** `/lib/rules/__tests__/merge.test.ts` (when testing framework added)

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B2.3.1 | Create comprehensive merge testing framework (test append/replace strategies, verify merge order, test ID conflicts) | Not Started |
| B2.3.2 | Document any ID conflicts and resolutions | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B2.3.1",
    "title": "Create comprehensive merge testing framework (test append/replace strategies, verify merge order, test ID conflicts)",
    "description": "This milestone creates comprehensive tests for the ruleset merging system to ensure all sourcebooks combine correctly without conflicts. It verifies that append, replace, and other merge strategies work as intended when combining core rules with sourcebook content. The goal is to catch merge conflicts and data inconsistencies before they affect character creation, and to create a testing framework that works for current and future sourcebooks. Create comprehensive merge testing framework (test append/replace strategies, verify merge order, test ID conflicts).",
    "files": [
      "/lib/rules/__tests__/merge.test.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B2.1.2", "B2.1.4"]
  },
  {
    "id": "B2.3.2",
    "title": "Document any ID conflicts and resolutions",
    "description": "This milestone creates comprehensive tests for the ruleset merging system to ensure all sourcebooks combine correctly without conflicts. It verifies that append, replace, and other merge strategies work as intended when combining core rules with sourcebook content. The goal is to catch merge conflicts and data inconsistencies before they affect character creation, and to create a testing framework that works for current and future sourcebooks. Document any ID conflicts and resolutions.",
    "files": [
      "/lib/rules/__tests__/merge.test.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B2.3.1"]
  }
]
```

### B2.4 Acceptance Criteria

- **B2.4.AC.1** [ ] Run Faster sourcebook loads without errors
- **B2.4.AC.2** [ ] Street Grimoire sourcebook loads without errors
- **B2.4.AC.3** [ ] Metavariants appear in metatype selection when Run Faster enabled
- **B2.4.AC.4** [ ] New spells appear in spell selection when Street Grimoire enabled
- **B2.4.AC.5** [ ] Sourcebook selection persists across wizard navigation
- **B2.4.AC.6** [ ] Merge conflicts handled gracefully with clear error messages
- **B2.4.AC.7** [ ] Character records which sourcebooks were used

---

## Phase B3: Inventory Management

**Objective:** Full post-creation gear management with tracking.

This phase creates a comprehensive inventory management system that allows players to track gear, ammunition, equipment condition, and encumbrance after character creation. It provides full CRUD operations for inventory items and integrates with the gear catalog for adding new items. The result enables complete gear lifecycle management throughout a character's career.

### B3.1 Data Structure Updates

This milestone establishes the data structures needed to represent inventory items, equipment states, and encumbrance calculations. It defines interfaces for inventory items with condition tracking, equipped state, ammunition counts, and modifications. The goal is to create a flexible system that supports all gear management needs including equipment slots and weight calculations.

**Files to modify:**

**Files to modify:**
- **B3.1.FM.1** `/lib/types/character.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B3.1.1 | Add InventoryItem interface with condition tracking | Not Started |
| B3.1.2 | Add Inventory interface with capacity/weight calculations | Not Started |
| B3.1.3 | Add EquipmentSlot enum for equipped items | Not Started |
| B3.1.4 | Add AmmoTracker type for ammunition management | Not Started |
| B3.1.5 | Update Character.gear to use new Inventory structure | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B3.1.1",
    "title": "Add InventoryItem interface with condition tracking",
    "description": "This milestone establishes the data structures needed to represent inventory items, equipment states, and encumbrance calculations. It defines interfaces for inventory items with condition tracking, equipped state, ammunition counts, and modifications. The goal is to create a flexible system that supports all gear management needs including equipment slots and weight calculations. Add InventoryItem interface with condition tracking.",
    "files": [
      "/lib/types/character.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B3.1.2",
    "title": "Add Inventory interface with capacity/weight calculations",
    "description": "This milestone establishes the data structures needed to represent inventory items, equipment states, and encumbrance calculations. It defines interfaces for inventory items with condition tracking, equipped state, ammunition counts, and modifications. The goal is to create a flexible system that supports all gear management needs including equipment slots and weight calculations. Add Inventory interface with capacity/weight calculations.",
    "files": [
      "/lib/types/character.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B3.1.3",
    "title": "Add EquipmentSlot enum for equipped items",
    "description": "This milestone establishes the data structures needed to represent inventory items, equipment states, and encumbrance calculations. It defines interfaces for inventory items with condition tracking, equipped state, ammunition counts, and modifications. The goal is to create a flexible system that supports all gear management needs including equipment slots and weight calculations. Add EquipmentSlot enum for equipped items.",
    "files": [
      "/lib/types/character.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B3.1.4",
    "title": "Add AmmoTracker type for ammunition management",
    "description": "This milestone establishes the data structures needed to represent inventory items, equipment states, and encumbrance calculations. It defines interfaces for inventory items with condition tracking, equipped state, ammunition counts, and modifications. The goal is to create a flexible system that supports all gear management needs including equipment slots and weight calculations. Add AmmoTracker type for ammunition management.",
    "files": [
      "/lib/types/character.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B3.1.5",
    "title": "Update Character.gear to use new Inventory structure",
    "description": "This milestone establishes the data structures needed to represent inventory items, equipment states, and encumbrance calculations. It defines interfaces for inventory items with condition tracking, equipped state, ammunition counts, and modifications. The goal is to create a flexible system that supports all gear management needs including equipment slots and weight calculations. Update Character.gear to use new Inventory structure.",
    "files": [
      "/lib/types/character.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B3.1.1", "B3.1.2", "B3.1.3", "B3.1.4"]
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

### B3.2 Inventory API and Storage Layer

This milestone implements the complete inventory persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides full CRUD operations for inventory items, ammunition management actions, and encumbrance calculations.

**Files to create:**
- **B3.2.FC.1** `/app/api/characters/[characterId]/inventory/route.ts`
- **B3.2.FC.2** `/app/api/characters/[characterId]/inventory/actions/route.ts`

**Files to modify:**
- **B3.2.FM.1** `/lib/storage/characters.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B3.2.1 | Implement inventory CRUD operations (API endpoints: GET, POST, PUT, DELETE + storage functions: addInventoryItem, removeInventoryItem, updateInventoryItem) | Not Started |
| B3.2.2 | Implement ammunition management actions endpoint (POST /actions with action: 'reload' | 'fire') | Not Started |
| B3.2.3 | Add calculateEncumbrance utility function | Not Started |
| B3.2.4 | Add transferItem between characters (future: party loot) | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B3.2.1",
    "title": "Implement inventory CRUD operations (API endpoints: GET, POST, PUT, DELETE + storage functions: addInventoryItem, removeInventoryItem, updateInventoryItem)",
    "description": "This milestone implements the complete inventory persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides full CRUD operations for inventory items, ammunition management actions, and encumbrance calculations. Implement inventory CRUD operations (API endpoints: GET, POST, PUT, DELETE + storage functions: addInventoryItem, removeInventoryItem, updateInventoryItem).",
    "files": [
      "/app/api/characters/[characterId]/inventory/route.ts",
      "/lib/storage/characters.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B3.1.5"]
  },
  {
    "id": "B3.2.2",
    "title": "Implement ammunition management actions endpoint (POST /actions with action: 'reload' | 'fire')",
    "description": "This milestone implements the complete inventory persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides full CRUD operations for inventory items, ammunition management actions, and encumbrance calculations. Implement ammunition management actions endpoint (POST /actions with action: 'reload' | 'fire').",
    "files": [
      "/app/api/characters/[characterId]/inventory/actions/route.ts",
      "/lib/storage/characters.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B3.2.1", "B3.1.4"]
  },
  {
    "id": "B3.2.3",
    "title": "Add calculateEncumbrance utility function",
    "description": "This milestone implements the complete inventory persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides full CRUD operations for inventory items, ammunition management actions, and encumbrance calculations. Add calculateEncumbrance utility function.",
    "files": [
      "/app/api/characters/[characterId]/inventory/route.ts",
      "/lib/storage/characters.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B3.1.2"]
  },
  {
    "id": "B3.2.4",
    "title": "Add transferItem between characters (future: party loot)",
    "description": "This milestone implements the complete inventory persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides full CRUD operations for inventory items, ammunition management actions, and encumbrance calculations. Add transferItem between characters (future: party loot).",
    "files": [
      "/app/api/characters/[characterId]/inventory/route.ts",
      "/lib/storage/characters.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B3.2.1"]
  }
]
```

### B3.3 Inventory UI

This milestone creates the complete inventory management user interface with item lists, filtering, sorting, and quick actions. It includes components for viewing equipped items, tracking ammunition, and adding new items from the gear catalog. The goal is to provide an intuitive interface that makes gear management efficient and enjoyable for players.

**Files to create:**
- **B3.3.FC.1** `/app/characters/[characterId]/inventory/page.tsx`
- **B3.3.FC.2** `/components/inventory/InventoryList.tsx` (includes InventoryItemCard)
- **B3.3.FC.3** `/components/inventory/ItemModal.tsx` (handles both add and edit)
- **B3.3.FC.4** `/components/inventory/AmmoTracker.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B3.3.1 | Create inventory page with gear list | Not Started |
| B3.3.2 | Create InventoryList with item cards, sorting, and filtering | Not Started |
| B3.3.3 | Create ItemModal with catalog search (supports both adding and editing items) | Not Started |
| B3.3.4 | Create AmmoTracker for quick reloading | Not Started |
| B3.3.5 | Add drag-and-drop reordering | Not Started |
| B3.3.6 | Add equipment slots visual (what's equipped where) | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B3.3.1",
    "title": "Create inventory page with gear list",
    "description": "This milestone creates the complete inventory management user interface with item lists, filtering, sorting, and quick actions. It includes components for viewing equipped items, tracking ammunition, and adding new items from the gear catalog. The goal is to provide an intuitive interface that makes gear management efficient and enjoyable for players. Create inventory page with gear list.",
    "files": [
      "/app/characters/[characterId]/inventory/page.tsx",
      "/components/inventory/InventoryList.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B3.2.1"]
  },
  {
    "id": "B3.3.2",
    "title": "Create InventoryList with item cards, sorting, and filtering",
    "description": "This milestone creates the complete inventory management user interface with item lists, filtering, sorting, and quick actions. It includes components for viewing equipped items, tracking ammunition, and adding new items from the gear catalog. The goal is to provide an intuitive interface that makes gear management efficient and enjoyable for players. Create InventoryList with item cards, sorting, and filtering.",
    "files": [
      "/app/characters/[characterId]/inventory/page.tsx",
      "/components/inventory/InventoryList.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B3.3.1"]
  },
  {
    "id": "B3.3.3",
    "title": "Create ItemModal with catalog search (supports both adding and editing items)",
    "description": "This milestone creates the complete inventory management user interface with item lists, filtering, sorting, and quick actions. It includes components for viewing equipped items, tracking ammunition, and adding new items from the gear catalog. The goal is to provide an intuitive interface that makes gear management efficient and enjoyable for players. Create ItemModal with catalog search (supports both adding and editing items).",
    "files": [
      "/components/inventory/ItemModal.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B3.3.1"]
  },
  {
    "id": "B3.3.4",
    "title": "Create AmmoTracker for quick reloading",
    "description": "This milestone creates the complete inventory management user interface with item lists, filtering, sorting, and quick actions. It includes components for viewing equipped items, tracking ammunition, and adding new items from the gear catalog. The goal is to provide an intuitive interface that makes gear management efficient and enjoyable for players. Create AmmoTracker for quick reloading.",
    "files": [
      "/components/inventory/AmmoTracker.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B3.3.1", "B3.2.2"]
  },
  {
    "id": "B3.3.5",
    "title": "Add drag-and-drop reordering",
    "description": "This milestone creates the complete inventory management user interface with item lists, filtering, sorting, and quick actions. It includes components for viewing equipped items, tracking ammunition, and adding new items from the gear catalog. The goal is to provide an intuitive interface that makes gear management efficient and enjoyable for players. Add drag-and-drop reordering.",
    "files": [
      "/components/inventory/InventoryList.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B3.3.2"]
  },
  {
    "id": "B3.3.6",
    "title": "Add equipment slots visual (what's equipped where)",
    "description": "This milestone creates the complete inventory management user interface with item lists, filtering, sorting, and quick actions. It includes components for viewing equipped items, tracking ammunition, and adding new items from the gear catalog. The goal is to provide an intuitive interface that makes gear management efficient and enjoyable for players. Add equipment slots visual (what's equipped where).",
    "files": [
      "/components/inventory/InventoryList.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B3.3.2", "B3.1.3"]
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

### B3.4 Acceptance Criteria

- **B3.4.AC.1** [ ] User can view full inventory list
- **B3.4.AC.2** [ ] User can add items from gear catalog
- **B3.4.AC.3** [ ] User can remove items from inventory
- **B3.4.AC.4** [ ] User can track ammunition with reload/fire actions
- **B3.4.AC.5** [ ] Encumbrance calculated correctly based on STR
- **B3.4.AC.6** [ ] Item condition can be updated
- **B3.4.AC.7** [ ] Equipped items displayed prominently
- **B3.4.AC.8** [ ] Nuyen balance tracked separately

---

## Phase B4: Combat Tracker

**Objective:** Full combat encounter management with initiative, turns, and damage.

This phase implements a complete combat tracking system that manages initiative, turn order, damage application, and combat state for game masters running Shadowrun sessions. It supports multiple combatants, initiative passes, condition tracking, and combat logging. The result enables smooth combat encounter management with minimal manual tracking overhead.

### B4.1 Data Structures

This milestone establishes the core data structures needed to represent combat sessions, combatants, initiative order, and combat actions. It defines interfaces for tracking health, conditions, initiative passes, and combat rounds. The goal is to create a comprehensive type system that accurately models SR5 combat mechanics including multi-pass initiative and various combatant types.

**Files to create:**

**Files to create:**
- **B4.1.FC.1** `/lib/types/combat.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B4.1.1 | Create CombatSession interface | Not Started |
| B4.1.2 | Create Combatant interface with initiative data embedded (character or NPC) | Not Started |
| B4.1.3 | Create CombatAction interface | Not Started |
| B4.1.4 | Create CombatLog interface for history | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B4.1.1",
    "title": "Create CombatSession interface",
    "description": "This milestone establishes the core data structures needed to represent combat sessions, combatants, initiative order, and combat actions. It defines interfaces for tracking health, conditions, initiative passes, and combat rounds. The goal is to create a comprehensive type system that accurately models SR5 combat mechanics including multi-pass initiative and various combatant types. Create CombatSession interface.",
    "files": [
      "/lib/types/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B4.1.2",
    "title": "Create Combatant interface with initiative data embedded (character or NPC)",
    "description": "This milestone establishes the core data structures needed to represent combat sessions, combatants, initiative order, and combat actions. It defines interfaces for tracking health, conditions, initiative passes, and combat rounds. The goal is to create a comprehensive type system that accurately models SR5 combat mechanics including multi-pass initiative and various combatant types. Create Combatant interface with initiative data embedded (character or NPC).",
    "files": [
      "/lib/types/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B4.1.3",
    "title": "Create CombatAction interface",
    "description": "This milestone establishes the core data structures needed to represent combat sessions, combatants, initiative order, and combat actions. It defines interfaces for tracking health, conditions, initiative passes, and combat rounds. The goal is to create a comprehensive type system that accurately models SR5 combat mechanics including multi-pass initiative and various combatant types. Create CombatAction interface.",
    "files": [
      "/lib/types/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B4.1.4",
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

// Note: Initiative data stored directly on Combatant interface
// initiativeOrder is an array of combatant IDs sorted by total initiative
```

### B4.2 Combat API and Storage Layer

This milestone implements the complete combat persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides session management, combatant management, and action logging. The API design supports both single-player and multiplayer combat scenarios and will integrate with WebSockets in Phase B9.

**Files to create:**
- **B4.2.FC.1** `/lib/storage/combat.ts`
- **B4.2.FC.2** `/app/api/combat/route.ts`
- **B4.2.FC.3** `/app/api/combat/[sessionId]/route.ts`
- **B4.2.FC.4** `/app/api/combat/[sessionId]/actions/route.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B4.2.1 | Implement combat session CRUD (storage functions + API: GET /combat, POST /combat, GET /combat/[id], PUT /combat/[id], DELETE /combat/[id]) | Not Started |
| B4.2.2 | Implement combatant management (addCombatant, removeCombatant storage functions) | Not Started |
| B4.2.3 | Implement combat actions endpoint (POST /combat/[id]/actions with action: 'initiative' | 'turn' | 'damage' | 'delay') | Not Started |
| B4.2.4 | Implement combat action logging (logCombatAction storage function) | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B4.2.1",
    "title": "Implement combat session CRUD (storage functions + API: GET /combat, POST /combat, GET /combat/[id], PUT /combat/[id], DELETE /combat/[id])",
    "description": "This milestone implements the complete combat persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides session management, combatant management, and action logging. The API design supports both single-player and multiplayer combat scenarios and will integrate with WebSockets in Phase B9. Implement combat session CRUD (storage functions + API: GET /combat, POST /combat, GET /combat/[id], PUT /combat/[id], DELETE /combat/[id]).",
    "files": [
      "/lib/storage/combat.ts",
      "/app/api/combat/route.ts",
      "/app/api/combat/[sessionId]/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.1.1", "B4.1.2", "B4.1.3", "B4.1.4"]
  },
  {
    "id": "B4.2.2",
    "title": "Implement combatant management (addCombatant, removeCombatant storage functions)",
    "description": "This milestone implements the complete combat persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides session management, combatant management, and action logging. The API design supports both single-player and multiplayer combat scenarios and will integrate with WebSockets in Phase B9. Implement combatant management (addCombatant, removeCombatant storage functions).",
    "files": [
      "/lib/storage/combat.ts",
      "/app/api/combat/[sessionId]/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.2.1"]
  },
  {
    "id": "B4.2.3",
    "title": "Implement combat actions endpoint (POST /combat/[id]/actions with action: 'initiative' | 'turn' | 'damage' | 'delay')",
    "description": "This milestone implements the complete combat persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides session management, combatant management, and action logging. The API design supports both single-player and multiplayer combat scenarios and will integrate with WebSockets in Phase B9. Implement combat actions endpoint (POST /combat/[id]/actions with action: 'initiative' | 'turn' | 'damage' | 'delay').",
    "files": [
      "/app/api/combat/[sessionId]/actions/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.2.1", "B4.1.3"]
  },
  {
    "id": "B4.2.4",
    "title": "Implement combat action logging (logCombatAction storage function)",
    "description": "This milestone implements the complete combat persistence layer including REST API endpoints and storage functions. The API routes directly call storage functions, so both are implemented together. It provides session management, combatant management, and action logging. The API design supports both single-player and multiplayer combat scenarios and will integrate with WebSockets in Phase B9. Implement combat action logging (logCombatAction storage function).",
    "files": [
      "/lib/storage/combat.ts",
      "/app/api/combat/[sessionId]/actions/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.2.3", "B4.1.4"]
  }
]
```

### B4.3 Combat UI

This milestone creates the complete combat tracking user interface with initiative order display, combatant health bars, action panels, and combat logging. It provides an intuitive interface for game masters to manage combat encounters with clear visual indicators for turn order, damage states, and combat progress. The UI integrates with dice rolling and supports all SR5 combat mechanics.

**Files to create:**
- **B4.3.FC.1** `/app/combat/page.tsx` (combat session list)
- **B4.3.FC.2** `/app/combat/[sessionId]/page.tsx` (active combat tracker)
- **B4.3.FC.3** `/components/combat/InitiativeTracker.tsx`
- **B4.3.FC.4** `/components/combat/CombatantCard.tsx`
- **B4.3.FC.5** `/components/combat/ActionPanel.tsx`
- **B4.3.FC.6** `/components/combat/DamageModal.tsx`
- **B4.3.FC.7** `/components/combat/CombatLog.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B4.3.1 | Create combat session list page with new session form | Not Started |
| B4.3.2 | Create InitiativeTracker with turn order display | Not Started |
| B4.3.3 | Create CombatantCard with health bars | Not Started |
| B4.3.4 | Create ActionPanel for current turn actions | Not Started |
| B4.3.5 | Create DamageModal for applying damage | Not Started |
| B4.3.6 | Create CombatLog showing action history | Not Started |
| B4.3.7 | Add condition management, round/pass counter, and DiceRoller integration | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B4.3.1",
    "title": "Create combat session list page with new session form",
    "description": "This milestone creates the complete combat tracking user interface with initiative order display, combatant health bars, action panels, and combat logging. It provides an intuitive interface for game masters to manage combat encounters with clear visual indicators for turn order, damage states, and combat progress. The UI integrates with dice rolling and supports all SR5 combat mechanics. Create combat session list page with new session form.",
    "files": [
      "/app/combat/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.2.1"]
  },
  {
    "id": "B4.3.2",
    "title": "Create InitiativeTracker with turn order display",
    "description": "This milestone creates the complete combat tracking user interface with initiative order display, combatant health bars, action panels, and combat logging. It provides an intuitive interface for game masters to manage combat encounters with clear visual indicators for turn order, damage states, and combat progress. The UI integrates with dice rolling and supports all SR5 combat mechanics. Create InitiativeTracker with turn order display.",
    "files": [
      "/components/combat/InitiativeTracker.tsx",
      "/app/combat/[sessionId]/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.3.1", "B4.4.3"]
  },
  {
    "id": "B4.3.3",
    "title": "Create CombatantCard with health bars",
    "description": "This milestone creates the complete combat tracking user interface with initiative order display, combatant health bars, action panels, and combat logging. It provides an intuitive interface for game masters to manage combat encounters with clear visual indicators for turn order, damage states, and combat progress. The UI integrates with dice rolling and supports all SR5 combat mechanics. Create CombatantCard with health bars.",
    "files": [
      "/components/combat/CombatantCard.tsx",
      "/app/combat/[sessionId]/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.3.1"]
  },
  {
    "id": "B4.3.4",
    "title": "Create ActionPanel for current turn actions",
    "description": "This milestone creates the complete combat tracking user interface with initiative order display, combatant health bars, action panels, and combat logging. It provides an intuitive interface for game masters to manage combat encounters with clear visual indicators for turn order, damage states, and combat progress. The UI integrates with dice rolling and supports all SR5 combat mechanics. Create ActionPanel for current turn actions.",
    "files": [
      "/components/combat/ActionPanel.tsx",
      "/app/combat/[sessionId]/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.3.1", "B4.2.3"]
  },
  {
    "id": "B4.3.5",
    "title": "Create DamageModal for applying damage",
    "description": "This milestone creates the complete combat tracking user interface with initiative order display, combatant health bars, action panels, and combat logging. It provides an intuitive interface for game masters to manage combat encounters with clear visual indicators for turn order, damage states, and combat progress. The UI integrates with dice rolling and supports all SR5 combat mechanics. Create DamageModal for applying damage.",
    "files": [
      "/components/combat/DamageModal.tsx",
      "/app/combat/[sessionId]/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.3.1", "B4.2.3"]
  },
  {
    "id": "B4.3.6",
    "title": "Create CombatLog showing action history",
    "description": "This milestone creates the complete combat tracking user interface with initiative order display, combatant health bars, action panels, and combat logging. It provides an intuitive interface for game masters to manage combat encounters with clear visual indicators for turn order, damage states, and combat progress. The UI integrates with dice rolling and supports all SR5 combat mechanics. Create CombatLog showing action history.",
    "files": [
      "/components/combat/CombatLog.tsx",
      "/app/combat/[sessionId]/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.3.1", "B4.2.4"]
  },
  {
    "id": "B4.3.7",
    "title": "Add condition management, round/pass counter, and DiceRoller integration",
    "description": "This milestone creates the complete combat tracking user interface with initiative order display, combatant health bars, action panels, and combat logging. It provides an intuitive interface for game masters to manage combat encounters with clear visual indicators for turn order, damage states, and combat progress. The UI integrates with dice rolling and supports all SR5 combat mechanics. Add condition management, round/pass counter, and DiceRoller integration.",
    "files": [
      "/app/combat/[sessionId]/page.tsx",
      "/components/combat/InitiativeTracker.tsx",
      "/components/combat/CombatantCard.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.3.2", "B4.3.3", "B4.3.4", "B4.3.5", "B4.3.6"]
  }
]
```

**UI Wireframe:**
```
┌─────────────────────────────────────────────────────────────┐
│ Combat: Warehouse Ambush         Round 2 | Pass 1          │
│ [Pause] [End Combat] [Add Combatant]                        │
├─────────────────────────────────────────────────────────────┤
│ Initiative Order                                            │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ▶ 1. Ghost (PC)       Init: 14+3d6=25    ████████ 10/10││
│ │   2. Ganger 1 (Enemy) Init: 8+1d6=12     ████░░░░  5/9 ││
│ │   3. Razor (PC)       Init: 12+2d6=20    ██████░░  8/10││
│ │   4. Ganger 2 (Enemy) Init: 8+1d6=11     ████████  9/9 ││
│ │   — Pass 2 —                                            ││
│ │   5. Ghost (PC)       Pass 2                            ││
│ │   6. Razor (PC)       Pass 2                            ││
│ └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│ Current Turn: Ghost                                         │
│ Actions: [2 Simple] or [1 Complex] + [1 Free]              │
│                                                             │
│ [Attack] [Defend] [Move] [Spell] [Other] [End Turn]        │
├─────────────────────────────────────────────────────────────┤
│ Combat Log                                                  │
│ • Ghost attacks Ganger 1: 4 hits vs 2 hits. 2 net hits.    │
│ • Ganger 1 takes 8P damage (soaked 3). 5P remaining.       │
│ • Round 2 begins. Rolling initiative...                     │
└─────────────────────────────────────────────────────────────┘
```

### B4.4 Initiative System

This milestone implements the complete SR5 initiative calculation system including base initiative from attributes, initiative dice rolling, and multi-pass initiative resolution. It handles edge cases like delayed actions, interrupt actions, and initiative ties. The goal is to automate initiative tracking completely, reducing manual calculation errors and speeding up combat resolution.

**SR5 Initiative Rules:**
- Base Initiative = Reaction + Intuition + modifiers
- Initiative Dice = 1d6 + bonus dice (cyberware, drugs, magic)
- Initiative Score = Base + dice roll
- Multiple passes: Score > 10 gets extra pass, > 20 gets third pass, etc.
- Each pass deducts 10 from score until score ≤ 0

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B4.4.1 | Calculate base initiative from attributes | Not Started |
| B4.4.2 | Calculate initiative dice from bonuses | Not Started |
| B4.4.3 | Implement multi-pass system (score - 10 each pass) | Not Started |
| B4.4.4 | Handle initiative ties (higher REA + INT wins) | Not Started |
| B4.4.5 | Support delayed actions | Not Started |
| B4.4.6 | Support interrupt actions (-5 to -10 initiative) | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B4.4.1",
    "title": "Calculate base initiative from attributes",
    "description": "This milestone implements the complete SR5 initiative calculation system including base initiative from attributes, initiative dice rolling, and multi-pass initiative resolution. It handles edge cases like delayed actions, interrupt actions, and initiative ties. The goal is to automate initiative tracking completely, reducing manual calculation errors and speeding up combat resolution. Calculate base initiative from attributes.",
    "files": [
      "/lib/storage/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.1.2"]
  },
  {
    "id": "B4.4.2",
    "title": "Calculate initiative dice from bonuses",
    "description": "This milestone implements the complete SR5 initiative calculation system including base initiative from attributes, initiative dice rolling, and multi-pass initiative resolution. It handles edge cases like delayed actions, interrupt actions, and initiative ties. The goal is to automate initiative tracking completely, reducing manual calculation errors and speeding up combat resolution. Calculate initiative dice from bonuses.",
    "files": [
      "/lib/storage/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.4.1"]
  },
  {
    "id": "B4.4.3",
    "title": "Implement multi-pass system (score - 10 each pass)",
    "description": "This milestone implements the complete SR5 initiative calculation system including base initiative from attributes, initiative dice rolling, and multi-pass initiative resolution. It handles edge cases like delayed actions, interrupt actions, and initiative ties. The goal is to automate initiative tracking completely, reducing manual calculation errors and speeding up combat resolution. Implement multi-pass system (score - 10 each pass).",
    "files": [
      "/lib/storage/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.4.1", "B4.4.2"]
  },
  {
    "id": "B4.4.4",
    "title": "Handle initiative ties (higher REA + INT wins)",
    "description": "This milestone implements the complete SR5 initiative calculation system including base initiative from attributes, initiative dice rolling, and multi-pass initiative resolution. It handles edge cases like delayed actions, interrupt actions, and initiative ties. The goal is to automate initiative tracking completely, reducing manual calculation errors and speeding up combat resolution. Handle initiative ties (higher REA + INT wins).",
    "files": [
      "/lib/storage/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.4.3"]
  },
  {
    "id": "B4.4.5",
    "title": "Support delayed actions",
    "description": "This milestone implements the complete SR5 initiative calculation system including base initiative from attributes, initiative dice rolling, and multi-pass initiative resolution. It handles edge cases like delayed actions, interrupt actions, and initiative ties. The goal is to automate initiative tracking completely, reducing manual calculation errors and speeding up combat resolution. Support delayed actions.",
    "files": [
      "/lib/storage/combat.ts",
      "/app/api/combat/[sessionId]/actions/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.4.3"]
  },
  {
    "id": "B4.4.6",
    "title": "Support interrupt actions (-5 to -10 initiative)",
    "description": "This milestone implements the complete SR5 initiative calculation system including base initiative from attributes, initiative dice rolling, and multi-pass initiative resolution. It handles edge cases like delayed actions, interrupt actions, and initiative ties. The goal is to automate initiative tracking completely, reducing manual calculation errors and speeding up combat resolution. Support interrupt actions (-5 to -10 initiative).",
    "files": [
      "/lib/storage/combat.ts",
      "/app/api/combat/[sessionId]/actions/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.4.3"]
  }
]
```

### B4.5 Acceptance Criteria

- **B4.5.AC.1** [ ] GM can create new combat session
- **B4.5.AC.2** [ ] GM can add player characters and NPCs
- **B4.5.AC.3** [ ] Initiative rolls correctly with all modifiers
- **B4.5.AC.4** [ ] Turn order displays correctly with multiple passes
- **B4.5.AC.5** [ ] Current turn clearly indicated
- **B4.5.AC.6** [ ] Damage can be applied with proper track handling
- **B4.5.AC.7** [ ] Combat log records all actions
- **B4.5.AC.8** [ ] Session can be paused and resumed
- **B4.5.AC.9** [ ] Conditions affect relevant rolls

---

## Phase B5: Adept Powers System

**Objective:** Complete adept character support with power point allocation.

This phase implements the complete adept powers system, enabling adept and mystic adept characters to select and allocate power points to various magical abilities. It includes a comprehensive powers catalog, power point budgeting, and proper tracking of power effects on character stats. The result enables full adept character creation with all core SR5 adept mechanics.

### B5.1 Adept Powers System (Data Structures + Creation Step)

This milestone implements the complete adept powers system including data structures and the creation step component. Since the step component needs the data structures, both are developed together to avoid intermediate states and reduce iteration. It includes a comprehensive powers catalog, power point budgeting, and proper tracking of power effects on character stats.

**Files to create:**
- **B5.1.FC.1** `/app/characters/create/components/steps/AdeptPowersStep.tsx`

**Files to modify:**
- **B5.1.FM.1** `/data/editions/sr5/core-rulebook.json`
- **B5.1.FM.2** `/lib/types/character.ts`
- **B5.1.FM.3** `/lib/types/creation.ts`
- **B5.1.FM.4** `/app/characters/create/components/CreationWizard.tsx`
- **B5.1.FM.5** `/app/characters/create/components/steps/MagicStep.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B5.1.1 | Create comprehensive adept powers catalog (~50 powers) and AdeptPower interface | Not Started |
| B5.1.2 | Add power point pool calculation to Character and budget tracking to CreationState (free = Magic rating for adepts) | Not Started |
| B5.1.3 | Create AdeptPowersStep component with power catalog browser, real-time tracking, and prerequisite validation | Not Started |
| B5.1.4 | Implement mystic adept power point purchase with karma (5 Karma = 1 PP) | Not Started |
| B5.1.5 | Add conditional Assensing skill availability (requires Astral Perception power) | Not Started |
| B5.1.6 | Register AdeptPowersStep in CreationWizard (after MagicStep, before SpellsStep) and conditionally show for adepts/mystic adepts | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B5.1.1",
    "title": "Create comprehensive adept powers catalog (~50 powers) and AdeptPower interface",
    "description": "This milestone implements the complete adept powers system including data structures and the creation step component. Since the step component needs the data structures, both are developed together to avoid intermediate states and reduce iteration. It includes a comprehensive powers catalog, power point budgeting, and proper tracking of power effects on character stats. Create comprehensive adept powers catalog (~50 powers) and AdeptPower interface.",
    "files": [
      "/data/editions/sr5/core-rulebook.json",
      "/lib/types/character.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B5.1.2",
    "title": "Add power point pool calculation to Character and budget tracking to CreationState (free = Magic rating for adepts)",
    "description": "This milestone implements the complete adept powers system including data structures and the creation step component. Since the step component needs the data structures, both are developed together to avoid intermediate states and reduce iteration. It includes a comprehensive powers catalog, power point budgeting, and proper tracking of power effects on character stats. Add power point pool calculation to Character and budget tracking to CreationState (free = Magic rating for adepts).",
    "files": [
      "/lib/types/character.ts",
      "/lib/types/creation.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B5.1.3",
    "title": "Create AdeptPowersStep component with power catalog browser, real-time tracking, and prerequisite validation",
    "description": "This milestone implements the complete adept powers system including data structures and the creation step component. Since the step component needs the data structures, both are developed together to avoid intermediate states and reduce iteration. It includes a comprehensive powers catalog, power point budgeting, and proper tracking of power effects on character stats. Create AdeptPowersStep component with power catalog browser, real-time tracking, and prerequisite validation.",
    "files": [
      "/app/characters/create/components/steps/AdeptPowersStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B5.1.1", "B5.1.2"]
  },
  {
    "id": "B5.1.4",
    "title": "Implement mystic adept power point purchase with karma (5 Karma = 1 PP)",
    "description": "This milestone implements the complete adept powers system including data structures and the creation step component. Since the step component needs the data structures, both are developed together to avoid intermediate states and reduce iteration. It includes a comprehensive powers catalog, power point budgeting, and proper tracking of power effects on character stats. Implement mystic adept power point purchase with karma (5 Karma = 1 PP).",
    "files": [
      "/app/characters/create/components/steps/AdeptPowersStep.tsx",
      "/lib/types/creation.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B5.1.3", "M0.6.3"]
  },
  {
    "id": "B5.1.5",
    "title": "Add conditional Assensing skill availability (requires Astral Perception power)",
    "description": "This milestone implements the complete adept powers system including data structures and the creation step component. Since the step component needs the data structures, both are developed together to avoid intermediate states and reduce iteration. It includes a comprehensive powers catalog, power point budgeting, and proper tracking of power effects on character stats. Add conditional Assensing skill availability (requires Astral Perception power).",
    "files": [
      "/app/characters/create/components/steps/AdeptPowersStep.tsx",
      "/app/characters/create/components/steps/SkillsStep.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B5.1.3"]
  },
  {
    "id": "B5.1.6",
    "title": "Register AdeptPowersStep in CreationWizard (after MagicStep, before SpellsStep) and conditionally show for adepts/mystic adepts",
    "description": "This milestone implements the complete adept powers system including data structures and the creation step component. Since the step component needs the data structures, both are developed together to avoid intermediate states and reduce iteration. It includes a comprehensive powers catalog, power point budgeting, and proper tracking of power effects on character stats. Register AdeptPowersStep in CreationWizard (after MagicStep, before SpellsStep) and conditionally show for adepts/mystic adepts.",
    "files": [
      "/app/characters/create/components/steps/AdeptPowersStep.tsx",
      "/app/characters/create/components/CreationWizard.tsx",
      "/app/characters/create/components/steps/MagicStep.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B5.1.3", "B5.1.4", "B5.1.5"]
  }
]
```

**Adept Power Structure:**
```json
{
  "adeptPowers": [
    {
      "id": "improved-reflexes",
      "name": "Improved Reflexes",
      "cost": 1.5,
      "costPerLevel": true,
      "maxLevels": 3,
      "description": "+1 REA and +1D6 Initiative per level",
      "effects": [
        { "attribute": "reaction", "modifier": 1, "perLevel": true },
        { "derived": "initiativeDice", "modifier": 1, "perLevel": true }
      ],
      "prerequisites": [],
      "source": "core-rulebook",
      "page": 309
    },
    {
      "id": "killing-hands",
      "name": "Killing Hands",
      "cost": 0.5,
      "costPerLevel": false,
      "maxLevels": 1,
      "description": "Unarmed attacks deal Physical damage",
      "effects": [
        { "combat": "unarmedDamageType", "value": "physical" }
      ],
      "prerequisites": [],
      "source": "core-rulebook",
      "page": 310
    }
  ]
}
```

### B5.2 Acceptance Criteria

- **B5.2.AC.1** [ ] Adept powers catalog fully populated (~50 powers)
- **B5.2.AC.2** [ ] Power point pool calculated correctly (free = Magic rating for adepts)
- **B5.2.AC.3** [ ] Power point budget tracked in CreationState
- **B5.2.AC.4** [ ] Powers with levels correctly cost per level
- **B5.2.AC.5** [ ] Prerequisites enforced
- **B5.2.AC.6** [ ] Mystic adepts can purchase PP with Karma (5 Karma = 1 PP)
- **B5.2.AC.7** [ ] Power effects clearly displayed
- **B5.2.AC.8** [ ] Selected powers apply to derived stats
- **B5.2.AC.9** [ ] AdeptPowersStep appears only for adepts and mystic adepts
- **B5.2.AC.10** [ ] Assensing skill available only when Astral Perception power is selected

---

## Phase B6: Spell Management

**Objective:** Enhanced spell system with traditions, rituals, and mentor spirits.

This phase enhances the spell system with magical traditions, mentor spirits, and ritual magic support. It implements tradition-based drain calculations, mentor spirit bonuses and drawbacks, and ritual spellcasting mechanics. The result provides a richer magical character creation experience that reflects the diversity of magical practices in Shadowrun.

### B6.1 Enhanced Magic System (Traditions + Mentors + Rituals)

This milestone implements the complete enhanced magic system including traditions, mentor spirits, and ritual magic. All three components affect the same magic system and share data structures, so they are implemented together. It provides tradition-based drain calculations, mentor spirit bonuses and drawbacks, and ritual spellcasting mechanics.

**Files to create:**
- **B6.1.FC.1** `/components/magic/RitualSelector.tsx` (or integrate into SpellsStep if rituals are just filtered spells)

**Files to modify:**
- **B6.1.FM.1** `/data/editions/sr5/core-rulebook.json`
- **B6.1.FM.2** `/lib/types/character.ts`
- **B6.1.FM.3** `/app/characters/create/components/steps/MagicStep.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B6.1.1 | Implement tradition system (Tradition interface, traditions catalog, tradition selection, drain resistance calculation, magical lodge selection, aspect selection) | Not Started |
| B6.1.2 | Implement mentor spirits system (MentorSpirit interface, catalog, selection, bonus/drawback application) | Not Started |
| B6.1.3 | Implement ritual magic system (ritual spells in catalog, RitualSelector component or SpellsStep integration, material/reagent tracking, teamwork rules) | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B6.1.1",
    "title": "Implement tradition system (Tradition interface, traditions catalog, tradition selection, drain resistance calculation, magical lodge selection, aspect selection)",
    "description": "This milestone implements the complete enhanced magic system including traditions, mentor spirits, and ritual magic. All three components affect the same magic system and share data structures, so they are implemented together. It provides tradition-based drain calculations, mentor spirit bonuses and drawbacks, and ritual spellcasting mechanics. Implement tradition system (Tradition interface, traditions catalog, tradition selection, drain resistance calculation, magical lodge selection, aspect selection).",
    "files": [
      "/data/editions/sr5/core-rulebook.json",
      "/lib/types/character.ts",
      "/app/characters/create/components/steps/MagicStep.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["M0.7.1"]
  },
  {
    "id": "B6.1.2",
    "title": "Implement mentor spirits system (MentorSpirit interface, catalog, selection, bonus/drawback application)",
    "description": "This milestone implements the complete enhanced magic system including traditions, mentor spirits, and ritual magic. All three components affect the same magic system and share data structures, so they are implemented together. It provides tradition-based drain calculations, mentor spirit bonuses and drawbacks, and ritual spellcasting mechanics. Implement mentor spirits system (MentorSpirit interface, catalog, selection, bonus/drawback application).",
    "files": [
      "/data/editions/sr5/core-rulebook.json",
      "/lib/types/character.ts",
      "/app/characters/create/components/steps/MagicStep.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["M0.7.1"]
  },
  {
    "id": "B6.1.3",
    "title": "Implement ritual magic system (ritual spells in catalog, RitualSelector component or SpellsStep integration, material/reagent tracking, teamwork rules)",
    "description": "This milestone implements the complete enhanced magic system including traditions, mentor spirits, and ritual magic. All three components affect the same magic system and share data structures, so they are implemented together. It provides tradition-based drain calculations, mentor spirit bonuses and drawbacks, and ritual spellcasting mechanics. Implement ritual magic system (ritual spells in catalog, RitualSelector component or SpellsStep integration, material/reagent tracking, teamwork rules).",
    "files": [
      "/data/editions/sr5/core-rulebook.json",
      "/components/magic/RitualSelector.tsx",
      "/app/characters/create/components/steps/SpellsStep.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["M0.7.1"]
  }
]
```

**Tradition Structure:**
```json
{
  "traditions": [
    {
      "id": "hermetic",
      "name": "Hermetic",
      "drainAttributes": ["willpower", "logic"],
      "spiritTypes": {
        "combat": "fire",
        "detection": "air",
        "health": "man",
        "illusion": "water",
        "manipulation": "earth"
      },
      "description": "Academic and formulaic approach to magic"
    },
    {
      "id": "shamanic",
      "name": "Shamanic",
      "drainAttributes": ["willpower", "charisma"],
      "spiritTypes": {
        "combat": "beast",
        "detection": "air",
        "health": "earth",
        "illusion": "water",
        "manipulation": "man"
      },
      "description": "Spiritual connection to nature and totem"
    }
  ]
}
```

### B6.2 Acceptance Criteria

- **B6.2.AC.1** [ ] Traditions affect drain resistance calculation
- **B6.2.AC.2** [ ] Mentor spirits provide correct bonuses
- **B6.2.AC.3** [ ] Ritual spells distinguished from standard spells
- **B6.2.AC.4** [ ] Drain calculated correctly per tradition

---

## Phase B7: Complex Forms & Matrix

**Objective:** Enhanced technomancer support with full complex forms catalog.

This phase completes technomancer character support by implementing the full complex forms catalog and Living Persona mechanics. It includes complex form selection during character creation, fading value calculations, and Matrix attribute display. The result enables complete technomancer character creation with all Matrix-related mechanics properly tracked.

### B7.1 Technomancer Support (Complex Forms + Living Persona)

This milestone implements complete technomancer character support including the complex forms catalog and Living Persona mechanics. Since Living Persona calculations depend on the forms catalog, both are implemented together. It includes complex form selection during character creation, fading value calculations, and Matrix attribute display.

**Files to modify:**
- **B7.1.FM.1** `/data/editions/sr5/core-rulebook.json`
- **B7.1.FM.2** `/app/characters/create/components/steps/ReviewStep.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B7.1.1 | Expand complex forms catalog (~30 forms) with ComplexForm interface, categorization, and threading rules | Not Started |
| B7.1.2 | Implement Living Persona calculations and display (Matrix attributes, Matrix Initiative) | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B7.1.1",
    "title": "Expand complex forms catalog (~30 forms) with ComplexForm interface, categorization, and threading rules",
    "description": "This milestone implements complete technomancer character support including the complex forms catalog and Living Persona mechanics. Since Living Persona calculations depend on the forms catalog, both are implemented together. It includes complex form selection during character creation, fading value calculations, and Matrix attribute display. Expand complex forms catalog (~30 forms) with ComplexForm interface, categorization, and threading rules.",
    "files": [
      "/data/editions/sr5/core-rulebook.json",
      "/app/characters/create/components/steps/ReviewStep.tsx"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B7.1.2",
    "title": "Implement Living Persona calculations and display (Matrix attributes, Matrix Initiative)",
    "description": "This milestone implements complete technomancer character support including the complex forms catalog and Living Persona mechanics. Since Living Persona calculations depend on the forms catalog, both are implemented together. It includes complex form selection during character creation, fading value calculations, and Matrix attribute display. Implement Living Persona calculations and display (Matrix attributes, Matrix Initiative).",
    "files": [
      "/app/characters/create/components/steps/ReviewStep.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B7.1.1"]
  }
]
```

### B7.2 Acceptance Criteria

- **B7.2.AC.1** [ ] Complete complex forms catalog available
- **B7.2.AC.2** [ ] Fading values correctly displayed
- **B7.2.AC.3** [ ] Living Persona calculated for technomancers
- **B7.2.AC.4** [ ] Matrix Initiative calculated correctly

---

## Phase B8: UI/UX Improvements

**Objective:** Improve overall UI/UX including mobile responsiveness and layout fixes.

This phase focuses on improving the user experience across all parts of the application, particularly on mobile devices. It addresses layout issues, implements responsive design patterns, and ensures all features are accessible on smaller screens. The result is a polished, professional application that works well on all device types.

### B8.1 Layout Improvements

This milestone addresses desktop layout issues including sidebar width management and gear catalog display problems. It implements a collapsible sidebar to maximize content area and improves the gear selection interface for better usability. The goal is to optimize screen real estate usage and improve navigation efficiency.

**Files to modify:**

**Files to modify:**
- **B8.1.FM.1** `/app/characters/create/components/CreationWizard.tsx`
- **B8.1.FM.2** `/components/layout/Sidebar.tsx` (or create)
- **B8.1.FM.3** `/app/characters/create/components/steps/GearStep.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B8.1.1 | Make sidebar collapsible to increase main content width | Not Started |
| B8.1.2 | Add collapse/expand toggle button to sidebar | Not Started |
| B8.1.3 | Persist sidebar collapse state in localStorage | Not Started |
| B8.1.4 | Fix GearStep shopping cart width - give gear catalog more horizontal space | ✅ Complete |
| B8.1.5 | Consider side-by-side layout for gear catalog and cart on wide screens | ✅ Complete |
| B8.1.6 | Add responsive breakpoints for cart layout (stack on mobile, side-by-side on desktop) | ✅ Complete |

**Tasks JSON:**
```json
[
  {
    "id": "B8.1.1",
    "title": "Make sidebar collapsible to increase main content width",
    "description": "This milestone addresses desktop layout issues including sidebar width management and gear catalog display problems. It implements a collapsible sidebar to maximize content area and improves the gear selection interface for better usability. The goal is to optimize screen real estate usage and improve navigation efficiency. Make sidebar collapsible to increase main content width.",
    "files": [
      "/app/characters/create/components/CreationWizard.tsx",
      "/components/layout/Sidebar.tsx"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B8.1.2",
    "title": "Add collapse/expand toggle button to sidebar",
    "description": "This milestone addresses desktop layout issues including sidebar width management and gear catalog display problems. It implements a collapsible sidebar to maximize content area and improves the gear selection interface for better usability. The goal is to optimize screen real estate usage and improve navigation efficiency. Add collapse/expand toggle button to sidebar.",
    "files": [
      "/components/layout/Sidebar.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B8.1.1"]
  },
  {
    "id": "B8.1.3",
    "title": "Persist sidebar collapse state in localStorage",
    "description": "This milestone addresses desktop layout issues including sidebar width management and gear catalog display problems. It implements a collapsible sidebar to maximize content area and improves the gear selection interface for better usability. The goal is to optimize screen real estate usage and improve navigation efficiency. Persist sidebar collapse state in localStorage.",
    "files": [
      "/components/layout/Sidebar.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B8.1.2"]
  },
  {
    "id": "B8.1.4",
    "title": "Fix GearStep shopping cart width - give gear catalog more horizontal space",
    "description": "This milestone addresses desktop layout issues including sidebar width management and gear catalog display problems. It implements a collapsible sidebar to maximize content area and improves the gear selection interface for better usability. The goal is to optimize screen real estate usage and improve navigation efficiency. Fix GearStep shopping cart width - give gear catalog more horizontal space.",
    "files": [
      "/app/characters/create/components/steps/GearStep.tsx"
    ],
    "status": "Complete",
    "dependsOn": []
  },
  {
    "id": "B8.1.5",
    "title": "Consider side-by-side layout for gear catalog and cart on wide screens",
    "description": "This milestone addresses desktop layout issues including sidebar width management and gear catalog display problems. It implements a collapsible sidebar to maximize content area and improves the gear selection interface for better usability. The goal is to optimize screen real estate usage and improve navigation efficiency. Consider side-by-side layout for gear catalog and cart on wide screens.",
    "files": [
      "/app/characters/create/components/steps/GearStep.tsx"
    ],
    "status": "Complete",
    "dependsOn": ["B8.1.4"]
  },
  {
    "id": "B8.1.6",
    "title": "Add responsive breakpoints for cart layout (stack on mobile, side-by-side on desktop)",
    "description": "This milestone addresses desktop layout issues including sidebar width management and gear catalog display problems. It implements a collapsible sidebar to maximize content area and improves the gear selection interface for better usability. The goal is to optimize screen real estate usage and improve navigation efficiency. Add responsive breakpoints for cart layout (stack on mobile, side-by-side on desktop).",
    "files": [
      "/app/characters/create/components/steps/GearStep.tsx"
    ],
    "status": "Complete",
    "dependsOn": ["B8.1.5"]
  }
]
```

### B8.2 Mobile Optimization (Test and Fix Incrementally)

This milestone implements mobile optimization using an incremental test-and-fix approach rather than a separate audit phase. It tests each feature area on mobile devices and fixes issues immediately, reducing documentation overhead and enabling faster iteration. The goal is to ensure all features are fully usable and accessible on mobile devices with good performance and intuitive interaction.

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B8.2.1 | Test and fix creation wizard steps on mobile (responsive layouts, touch targets, collapsible sections) | Not Started |
| B8.2.2 | Test and fix character sheet on mobile | Not Started |
| B8.2.3 | Test and fix combat tracker on mobile | Not Started |
| B8.2.4 | Test and fix inventory management on mobile | Not Started |
| B8.2.5 | Add mobile-specific enhancements (swipe gestures, bottom navigation, touch-optimized dice roller) | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B8.2.1",
    "title": "Test and fix creation wizard steps on mobile (responsive layouts, touch targets, collapsible sections)",
    "description": "This milestone implements mobile optimization using an incremental test-and-fix approach rather than a separate audit phase. It tests each feature area on mobile devices and fixes issues immediately, reducing documentation overhead and enabling faster iteration. The goal is to ensure all features are fully usable and accessible on mobile devices with good performance and intuitive interaction. Test and fix creation wizard steps on mobile (responsive layouts, touch targets, collapsible sections).",
    "files": [
      "/app/characters/create/components/CreationWizard.tsx",
      "/app/characters/create/components/steps/*.tsx"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B8.2.2",
    "title": "Test and fix character sheet on mobile",
    "description": "This milestone implements mobile optimization using an incremental test-and-fix approach rather than a separate audit phase. It tests each feature area on mobile devices and fixes issues immediately, reducing documentation overhead and enabling faster iteration. The goal is to ensure all features are fully usable and accessible on mobile devices with good performance and intuitive interaction. Test and fix character sheet on mobile.",
    "files": [
      "/app/characters/[characterId]/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B8.2.3",
    "title": "Test and fix combat tracker on mobile",
    "description": "This milestone implements mobile optimization using an incremental test-and-fix approach rather than a separate audit phase. It tests each feature area on mobile devices and fixes issues immediately, reducing documentation overhead and enabling faster iteration. The goal is to ensure all features are fully usable and accessible on mobile devices with good performance and intuitive interaction. Test and fix combat tracker on mobile.",
    "files": [
      "/app/combat/[sessionId]/page.tsx",
      "/components/combat/*.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B4.3.7"]
  },
  {
    "id": "B8.2.4",
    "title": "Test and fix inventory management on mobile",
    "description": "This milestone implements mobile optimization using an incremental test-and-fix approach rather than a separate audit phase. It tests each feature area on mobile devices and fixes issues immediately, reducing documentation overhead and enabling faster iteration. The goal is to ensure all features are fully usable and accessible on mobile devices with good performance and intuitive interaction. Test and fix inventory management on mobile.",
    "files": [
      "/app/characters/[characterId]/inventory/page.tsx",
      "/components/inventory/*.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B3.3.6"]
  },
  {
    "id": "B8.2.5",
    "title": "Add mobile-specific enhancements (swipe gestures, bottom navigation, touch-optimized dice roller)",
    "description": "This milestone implements mobile optimization using an incremental test-and-fix approach rather than a separate audit phase. It tests each feature area on mobile devices and fixes issues immediately, reducing documentation overhead and enabling faster iteration. The goal is to ensure all features are fully usable and accessible on mobile devices with good performance and intuitive interaction. Add mobile-specific enhancements (swipe gestures, bottom navigation, touch-optimized dice roller).",
    "files": [
      "/app/characters/create/components/CreationWizard.tsx",
      "/app/combat/[sessionId]/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B8.2.1", "B8.2.2", "B8.2.3", "B8.2.4"]
  }
]
```

### B8.3 Acceptance Criteria

- **B8.3.AC.1** [ ] Sidebar can be collapsed/expanded
- **B8.3.AC.2** [ ] Sidebar state persists across page navigation
- **B8.3.AC.3** [ ] Gear catalog has adequate width for browsing
- **B8.3.AC.4** [ ] All pages usable on 375px viewport
- **B8.3.AC.5** [ ] Touch targets meet accessibility guidelines
- **B8.3.AC.6** [ ] No horizontal scrolling on mobile
- **B8.3.AC.7** [ ] Text readable without zooming

---

## Phase B9: Session Persistence & WebSockets

**Objective:** Real-time multiplayer support for combat and sessions.

This phase implements real-time multiplayer functionality using WebSockets, enabling multiple users to view and interact with the same combat sessions simultaneously. It provides session persistence, conflict resolution, and reconnection handling. The result enables collaborative gameplay where GMs and players can all see combat updates in real-time.

### B9.1 WebSocket Infrastructure

This milestone establishes the WebSocket server and client infrastructure needed for real-time communication. It selects and integrates a WebSocket library, creates event type definitions, and implements the basic connection handling. The goal is to create a robust foundation for real-time features that can scale to multiple concurrent sessions.

**Files to create:**
- **B9.1.FC.1** `/lib/websocket/server.ts`
- **B9.1.FC.2** `/lib/websocket/client.ts`
- **B9.1.FC.3** `/lib/websocket/types.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B9.1.1 | Evaluate WebSocket library (Socket.io vs ws vs Pusher) | Not Started |
| B9.1.2 | Implement WebSocket server integration with Next.js | Not Started |
| B9.1.3 | Create event and message type definitions in types.ts | Not Started |
| B9.1.4 | Implement client-side WebSocket hook | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B9.1.1",
    "title": "Evaluate WebSocket library (Socket.io vs ws vs Pusher)",
    "description": "This milestone establishes the WebSocket server and client infrastructure needed for real-time communication. It selects and integrates a WebSocket library, creates event type definitions, and implements the basic connection handling. The goal is to create a robust foundation for real-time features that can scale to multiple concurrent sessions. Evaluate WebSocket library (Socket.io vs ws vs Pusher).",
    "files": [],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B9.1.2",
    "title": "Implement WebSocket server integration with Next.js",
    "description": "This milestone establishes the WebSocket server and client infrastructure needed for real-time communication. It selects and integrates a WebSocket library, creates event type definitions, and implements the basic connection handling. The goal is to create a robust foundation for real-time features that can scale to multiple concurrent sessions. Implement WebSocket server integration with Next.js.",
    "files": [
      "/lib/websocket/server.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B9.1.1"]
  },
  {
    "id": "B9.1.3",
    "title": "Create event and message type definitions in types.ts",
    "description": "This milestone establishes the WebSocket server and client infrastructure needed for real-time communication. It selects and integrates a WebSocket library, creates event type definitions, and implements the basic connection handling. The goal is to create a robust foundation for real-time features that can scale to multiple concurrent sessions. Create event and message type definitions in types.ts.",
    "files": [
      "/lib/websocket/types.ts"
    ],
    "status": "Not Started",
    "dependsOn": []
  },
  {
    "id": "B9.1.4",
    "title": "Implement client-side WebSocket hook",
    "description": "This milestone establishes the WebSocket server and client infrastructure needed for real-time communication. It selects and integrates a WebSocket library, creates event type definitions, and implements the basic connection handling. The goal is to create a robust foundation for real-time features that can scale to multiple concurrent sessions. Implement client-side WebSocket hook.",
    "files": [
      "/lib/websocket/client.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B9.1.2", "B9.1.3"]
  }
]
```

### B9.2 Combat Session Sharing

This milestone implements real-time broadcasting of combat updates to all participants in a combat session. It handles initiative changes, damage/healing updates, turn changes, and participant join/leave events. The goal is to ensure all connected users see the same combat state simultaneously, enabling true multiplayer combat tracking.

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B9.2.1 | Broadcast initiative changes to all participants | Not Started |
| B9.2.2 | Broadcast damage/healing updates | Not Started |
| B9.2.3 | Broadcast turn changes | Not Started |
| B9.2.4 | Handle participant join/leave | Not Started |
| B9.2.5 | Implement GM-only actions vs player-visible actions | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B9.2.1",
    "title": "Broadcast initiative changes to all participants",
    "description": "This milestone implements real-time broadcasting of combat updates to all participants in a combat session. It handles initiative changes, damage/healing updates, turn changes, and participant join/leave events. The goal is to ensure all connected users see the same combat state simultaneously, enabling true multiplayer combat tracking. Broadcast initiative changes to all participants.",
    "files": [
      "/lib/websocket/server.ts",
      "/app/api/combat/[sessionId]/actions/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B9.1.4", "B4.2.3"]
  },
  {
    "id": "B9.2.2",
    "title": "Broadcast damage/healing updates",
    "description": "This milestone implements real-time broadcasting of combat updates to all participants in a combat session. It handles initiative changes, damage/healing updates, turn changes, and participant join/leave events. The goal is to ensure all connected users see the same combat state simultaneously, enabling true multiplayer combat tracking. Broadcast damage/healing updates.",
    "files": [
      "/lib/websocket/server.ts",
      "/app/api/combat/[sessionId]/actions/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B9.1.4", "B4.2.3"]
  },
  {
    "id": "B9.2.3",
    "title": "Broadcast turn changes",
    "description": "This milestone implements real-time broadcasting of combat updates to all participants in a combat session. It handles initiative changes, damage/healing updates, turn changes, and participant join/leave events. The goal is to ensure all connected users see the same combat state simultaneously, enabling true multiplayer combat tracking. Broadcast turn changes.",
    "files": [
      "/lib/websocket/server.ts",
      "/app/api/combat/[sessionId]/actions/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B9.1.4", "B4.2.3"]
  },
  {
    "id": "B9.2.4",
    "title": "Handle participant join/leave",
    "description": "This milestone implements real-time broadcasting of combat updates to all participants in a combat session. It handles initiative changes, damage/healing updates, turn changes, and participant join/leave events. The goal is to ensure all connected users see the same combat state simultaneously, enabling true multiplayer combat tracking. Handle participant join/leave.",
    "files": [
      "/lib/websocket/server.ts",
      "/lib/websocket/client.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B9.1.4"]
  },
  {
    "id": "B9.2.5",
    "title": "Implement GM-only actions vs player-visible actions",
    "description": "This milestone implements real-time broadcasting of combat updates to all participants in a combat session. It handles initiative changes, damage/healing updates, turn changes, and participant join/leave events. The goal is to ensure all connected users see the same combat state simultaneously, enabling true multiplayer combat tracking. Implement GM-only actions vs player-visible actions.",
    "files": [
      "/lib/websocket/server.ts",
      "/app/api/combat/[sessionId]/actions/route.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B9.2.1", "B9.2.2", "B9.2.3"]
  }
]
```

### B9.3 Session State Management

This milestone implements session joining, state persistence across reconnections, and conflict resolution for concurrent updates. It creates invite code systems for session access and ensures disconnected users can rejoin and sync their state properly. The goal is to provide robust session management that handles network issues gracefully and prevents data loss.

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B9.3.1 | Create session join flow with invite codes | Not Started |
| B9.3.2 | Persist session state across reconnections | Not Started |
| B9.3.3 | Handle conflict resolution for concurrent updates | Not Started |
| B9.3.4 | Add session recovery for disconnections | Not Started |

**Tasks JSON:**
```json
[
  {
    "id": "B9.3.1",
    "title": "Create session join flow with invite codes",
    "description": "This milestone implements session joining, state persistence across reconnections, and conflict resolution for concurrent updates. It creates invite code systems for session access and ensures disconnected users can rejoin and sync their state properly. The goal is to provide robust session management that handles network issues gracefully and prevents data loss. Create session join flow with invite codes.",
    "files": [
      "/lib/websocket/server.ts",
      "/app/combat/[sessionId]/page.tsx"
    ],
    "status": "Not Started",
    "dependsOn": ["B9.1.4", "B4.2.1"]
  },
  {
    "id": "B9.3.2",
    "title": "Persist session state across reconnections",
    "description": "This milestone implements session joining, state persistence across reconnections, and conflict resolution for concurrent updates. It creates invite code systems for session access and ensures disconnected users can rejoin and sync their state properly. The goal is to provide robust session management that handles network issues gracefully and prevents data loss. Persist session state across reconnections.",
    "files": [
      "/lib/websocket/server.ts",
      "/lib/websocket/client.ts",
      "/lib/storage/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B9.3.1"]
  },
  {
    "id": "B9.3.3",
    "title": "Handle conflict resolution for concurrent updates",
    "description": "This milestone implements session joining, state persistence across reconnections, and conflict resolution for concurrent updates. It creates invite code systems for session access and ensures disconnected users can rejoin and sync their state properly. The goal is to provide robust session management that handles network issues gracefully and prevents data loss. Handle conflict resolution for concurrent updates.",
    "files": [
      "/lib/websocket/server.ts",
      "/lib/storage/combat.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B9.3.2"]
  },
  {
    "id": "B9.3.4",
    "title": "Add session recovery for disconnections",
    "description": "This milestone implements session joining, state persistence across reconnections, and conflict resolution for concurrent updates. It creates invite code systems for session access and ensures disconnected users can rejoin and sync their state properly. The goal is to provide robust session management that handles network issues gracefully and prevents data loss. Add session recovery for disconnections.",
    "files": [
      "/lib/websocket/server.ts",
      "/lib/websocket/client.ts"
    ],
    "status": "Not Started",
    "dependsOn": ["B9.3.2"]
  }
]
```

### B9.4 Acceptance Criteria

- **B9.4.AC.1** [ ] Multiple users can view same combat session
- **B9.4.AC.2** [ ] Updates appear in real-time for all participants
- **B9.4.AC.3** [ ] Disconnected users can rejoin and sync state
- **B9.4.AC.4** [ ] GM actions properly authorized

---

## Dependency Graph

This section provides comprehensive dependency graphs for all phases, showing creation ordering, required data structures, and dependent components. The graphs help visualize the implementation sequence and identify critical path items.

### Phase-Level Dependency Graph (ASCII)

```
MVP Core (Complete)
│
├─► M0: MVP Gaps & Enhancements (Critical Path)
│   │
│   ├─► M0.1: Bug Fixes ✅
│   ├─► M0.2: Metatype Enhancements ✅
│   ├─► M0.3: Skills Enhancements
│   │   ├─► M0.3.1-8: Complete ✅
│   │   └─► M0.3.9: Free Skills (Not Started)
│   ├─► M0.4: Qualities Enhancements (Next)
│   ├─► M0.5: Contacts Enhancements
│   ├─► M0.6: Distributed Karma Architecture
│   │   └─► Required for: M0.7.5, B5.1.4
│   ├─► M0.7: SpellsStep Creation
│   │   ├─► M0.7.1-8: All tasks
│   │   └─► Required for: B6.1.1, B6.1.2, B6.1.3
│   └─► M0.8: Aspected Mage ✅
│
├─► B1: Cyberware/Bioware System ✅ (Complete)
│   │
│   ├─► B1.1: Data Structure Updates ✅
│   │   ├─► Creates: CyberwareGrade, CyberwareCategory, Cyberware, Bioware interfaces
│   │   └─► Files: /lib/types/character.ts, /lib/types/edition.ts
│   ├─► B1.2: Ruleset Context Hooks ✅
│   │   └─► Creates: useCyberware(), useBioware(), useAugmentationRules()
│   ├─► B1.3: Character Creation Step ✅
│   │   └─► Creates: AugmentationsStep component
│   └─► B1.4: Derived Stats Updates ✅
│
├─► B2: Sourcebook Integration (Independent)
│   │
│   ├─► B2.1: Sourcebook Data Files
│   │   ├─► Creates: run-faster.json, street-grimoire.json
│   │   └─► Required for: B2.2.1
│   ├─► B2.2: Sourcebook Selection UI
│   │   └─► Depends on: B2.1.1, B2.1.3
│   └─► B2.3: Merge Algorithm Testing
│       └─► Depends on: B2.1.2, B2.1.4
│
├─► B3: Inventory Management (Independent)
│   │
│   ├─► B3.1: Data Structure Updates
│   │   ├─► Creates: InventoryItem, Inventory, EquipmentSlot, AmmoTracker
│   │   └─► Files: /lib/types/character.ts
│   ├─► B3.2: Inventory API and Storage Layer
│   │   ├─► Depends on: B3.1.5
│   │   └─► Creates: /app/api/characters/[characterId]/inventory/route.ts
│   └─► B3.3: Inventory UI
│       ├─► Depends on: B3.2.1
│       └─► Creates: InventoryList, ItemModal, AmmoTracker components
│
├─► B4: Combat Tracker (Independent)
│   │
│   ├─► B4.1: Data Structures
│   │   ├─► Creates: CombatSession, Combatant, CombatAction, CombatLog
│   │   └─► Files: /lib/types/combat.ts
│   ├─► B4.2: Combat API and Storage Layer
│   │   ├─► Depends on: B4.1.1-4
│   │   └─► Creates: /lib/storage/combat.ts, /app/api/combat/route.ts
│   ├─► B4.3: Combat UI
│   │   ├─► Depends on: B4.2.1, B4.4.3
│   │   └─► Creates: InitiativeTracker, CombatantCard, ActionPanel, DamageModal, CombatLog
│   ├─► B4.4: Initiative System
│   │   ├─► Depends on: B4.1.2
│   │   └─► Required for: B4.3.2
│   └─► Required for: B9.2.1-5, B9.3.1
│
├─► B5: Adept Powers System
│   │
│   ├─► B5.1: Adept Powers System (Data + Step)
│   │   ├─► B5.1.1: Adept powers catalog (~50 powers)
│   │   ├─► B5.1.2: Power point pool calculation
│   │   ├─► B5.1.3: AdeptPowersStep component
│   │   ├─► B5.1.4: Mystic adept PP purchase (Depends on: M0.6.3)
│   │   ├─► B5.1.5: Conditional Assensing
│   │   └─► B5.1.6: Register in CreationWizard
│   └─► Required for: B6.1.1 (traditions can reference adept powers)
│
├─► B6: Spell Management
│   │
│   ├─► B6.1: Enhanced Magic System
│   │   ├─► B6.1.1: Tradition system (Depends on: M0.7.1)
│   │   ├─► B6.1.2: Mentor spirits (Depends on: M0.7.1)
│   │   └─► B6.1.3: Ritual magic (Depends on: M0.7.1)
│   └─► Can be done in parallel with B5
│
├─► B7: Complex Forms & Matrix (Independent)
│   │
│   └─► B7.1: Technomancer Support
│       ├─► B7.1.1: Complex forms catalog (~30 forms)
│       └─► B7.1.2: Living Persona calculations (Depends on: B7.1.1)
│
├─► B8: UI/UX Improvements (Independent, can be done anytime)
│   │
│   ├─► B8.1: Layout Improvements
│   │   └─► Independent of other phases
│   └─► B8.2: Mobile Optimization
│       ├─► B8.2.3: Depends on: B4.3.7 (combat tracker)
│       └─► B8.2.4: Depends on: B3.3.6 (inventory)
│
└─► B9: Session Persistence & WebSockets
    │
    ├─► B9.1: WebSocket Infrastructure
    │   └─► Independent foundation
    ├─► B9.2: Combat Session Sharing
    │   ├─► Depends on: B9.1.4, B4.2.3
    │   └─► Broadcasts combat updates
    └─► B9.3: Session State Management
        ├─► Depends on: B9.1.4, B4.2.1
        └─► Handles reconnections and conflicts
```

### Critical Path Analysis

**Phase M0 (Critical - Must Complete First):**
```
M0.1 (Bug Fixes) ✅
  └─► M0.2 (Metatype) ✅
      └─► M0.3 (Skills) [M0.3.9 pending]
          └─► M0.4 (Qualities) [Next]
              └─► M0.5 (Contacts)
                  └─► M0.6 (Karma Architecture)
                      └─► M0.7 (SpellsStep)
                          └─► Required for: B5, B6
```

**Beta Features (Can Start After M0 Complete):**
```
B1 ✅ (Complete - Independent)
B2 (Independent - Sourcebooks)
B3 (Independent - Inventory)
B4 (Independent - Combat)
  └─► B9 (WebSockets depends on B4)
B5 (Adept Powers - depends on M0.6, M0.7)
B6 (Spell Management - depends on M0.7)
B7 (Matrix - Independent)
B8 (UI/UX - Independent, but B8.2.3 depends on B4, B8.2.4 depends on B3)
```

### Data Structure Creation Order

```
1. Core Types (Already Exist)
   └─► /lib/types/character.ts (base)
   └─► /lib/types/edition.ts (base)
   └─► /lib/types/creation.ts (base)

2. B1.1: Augmentation Types
   ├─► CyberwareGrade enum
   ├─► CyberwareCategory enum
   ├─► Cyberware interface
   ├─► Bioware interface
   └─► EssenceHole tracking

3. B3.1: Inventory Types
   ├─► InventoryItem interface
   ├─► Inventory interface
   ├─► EquipmentSlot enum
   └─► AmmoTracker type

4. B4.1: Combat Types
   ├─► CombatSession interface
   ├─► Combatant interface
   ├─► CombatAction interface
   └─► CombatLog interface

5. B5.1.1: Adept Power Types
   └─► AdeptPower interface (in ruleset)

6. B6.1.1: Magic Enhancement Types
   ├─► Tradition interface
   ├─► MentorSpirit interface
   └─► Ritual interface

7. B7.1.1: Matrix Types
   └─► ComplexForm interface (in ruleset)
```

### Component Creation Order

```
Character Creation Components:
├─► M0.7.1: SpellsStep.tsx (depends on: MagicStep exists)
├─► B1.3.1: AugmentationsStep.tsx (depends on: B1.1, B1.2)
├─► B5.1.3: AdeptPowersStep.tsx (depends on: B5.1.1, B5.1.2)
└─► B2.2.1: SourcebookSelector.tsx (depends on: B2.1.1, B2.1.3)

Post-Creation Components:
├─► B3.3.1: Inventory page (depends on: B3.2.1)
│   ├─► B3.3.2: InventoryList.tsx
│   ├─► B3.3.3: ItemModal.tsx
│   └─► B3.3.4: AmmoTracker.tsx
│
└─► B4.3.1: Combat page (depends on: B4.2.1)
    ├─► B4.3.2: InitiativeTracker.tsx (depends on: B4.4.3)
    ├─► B4.3.3: CombatantCard.tsx
    ├─► B4.3.4: ActionPanel.tsx
    ├─► B4.3.5: DamageModal.tsx
    └─► B4.3.6: CombatLog.tsx
```

### Machine-Readable Dependency Graph (JSON)

```json
{
  "phases": {
    "M0": {
      "id": "M0",
      "name": "MVP Gaps & Enhancements",
      "priority": "Critical",
      "status": "In Progress",
      "dependsOn": [],
      "milestones": {
        "M0.1": {
          "id": "M0.1",
          "name": "Bug Fixes",
          "status": "Complete",
          "dependsOn": [],
          "dataStructures": [],
          "components": ["ValidationPanel.tsx"],
          "files": [
            "/app/characters/create/components/CreationWizard.tsx",
            "/app/characters/create/components/ValidationPanel.tsx"
          ]
        },
        "M0.2": {
          "id": "M0.2",
          "name": "Metatype Enhancements",
          "status": "Complete",
          "dependsOn": [],
          "dataStructures": ["racialQualities field in Character"],
          "components": ["MetatypeStep.tsx"],
          "files": [
            "/app/characters/create/components/steps/MetatypeStep.tsx",
            "/lib/types/character.ts"
          ]
        },
        "M0.3": {
          "id": "M0.3",
          "name": "Skills Enhancements",
          "status": "Partial",
          "dependsOn": [],
          "dataStructures": ["suggested specializations in skill data"],
          "components": ["SkillsStep.tsx"],
          "files": [
            "/app/characters/create/components/steps/SkillsStep.tsx",
            "/data/editions/sr5/core-rulebook.json"
          ],
          "blocking": ["M0.3.9"]
        },
        "M0.4": {
          "id": "M0.4",
          "name": "Qualities Enhancements",
          "status": "Not Started",
          "dependsOn": [],
          "dataStructures": [
            "Quality.isRacial",
            "Quality.levels",
            "Quality.statModifiers"
          ],
          "components": ["QualitiesStep.tsx"],
          "files": [
            "/app/characters/create/components/steps/QualitiesStep.tsx",
            "/data/editions/sr5/core-rulebook.json",
            "/lib/types/edition.ts"
          ]
        },
        "M0.5": {
          "id": "M0.5",
          "name": "Contacts Enhancements",
          "status": "Not Started",
          "dependsOn": [],
          "dataStructures": ["contactTemplates in ruleset"],
          "components": ["ContactsStep.tsx"],
          "files": [
            "/app/characters/create/components/steps/ContactsStep.tsx",
            "/data/editions/sr5/core-rulebook.json"
          ]
        },
        "M0.6": {
          "id": "M0.6",
          "name": "Distributed Karma Spending Architecture",
          "status": "Not Started",
          "dependsOn": [],
          "dataStructures": [
            "KarmaBudgetContext",
            "karma budget tracking in CreationState"
          ],
          "components": ["KarmaPurchasePanel"],
          "files": [
            "/lib/types/creation.ts",
            "/app/characters/create/components/CreationWizard.tsx"
          ],
          "requiredBy": ["M0.7.5", "B5.1.4"]
        },
        "M0.7": {
          "id": "M0.7",
          "name": "SpellsStep Creation",
          "status": "Not Started",
          "dependsOn": [],
          "dataStructures": [
            "spell source tracking ('free' | 'karma')"
          ],
          "components": ["SpellsStep.tsx"],
          "files": [
            "/app/characters/create/components/steps/SpellsStep.tsx",
            "/app/characters/create/components/CreationWizard.tsx",
            "/app/characters/create/components/steps/KarmaStep.tsx",
            "/lib/types/creation.ts"
          ],
          "requiredBy": ["B6.1.1", "B6.1.2", "B6.1.3"]
        },
        "M0.8": {
          "id": "M0.8",
          "name": "Aspected Mage Enhancements",
          "status": "Complete",
          "dependsOn": [],
          "dataStructures": ["aspectedMageGroup in CreationState"],
          "components": ["MagicStep.tsx", "SkillsStep.tsx"],
          "files": [
            "/app/characters/create/components/steps/MagicStep.tsx",
            "/app/characters/create/components/steps/SkillsStep.tsx"
          ]
        }
      }
    },
    "B1": {
      "id": "B1",
      "name": "Cyberware/Bioware System",
      "priority": "High",
      "status": "Complete",
      "dependsOn": [],
      "milestones": {
        "B1.1": {
          "id": "B1.1",
          "name": "Data Structure Updates",
          "status": "Complete",
          "dependsOn": [],
          "dataStructures": [
            "CyberwareGrade",
            "CyberwareCategory",
            "Cyberware interface",
            "Bioware interface",
            "EssenceHole tracking"
          ],
          "components": [],
          "files": [
            "/lib/types/character.ts",
            "/lib/types/edition.ts",
            "/data/editions/sr5/core-rulebook.json"
          ]
        },
        "B1.2": {
          "id": "B1.2",
          "name": "Ruleset Context Hooks",
          "status": "Complete",
          "dependsOn": ["B1.1.6", "B1.1.7"],
          "dataStructures": [],
          "components": [],
          "files": ["/lib/rules/RulesetContext.tsx"]
        },
        "B1.3": {
          "id": "B1.3",
          "name": "Character Creation Step",
          "status": "Complete",
          "dependsOn": ["B1.1.6", "B1.1.7", "B1.2.1", "B1.2.2"],
          "dataStructures": [],
          "components": ["AugmentationsStep.tsx"],
          "files": [
            "/app/characters/create/components/steps/AugmentationsStep.tsx",
            "/app/characters/create/components/CreationWizard.tsx",
            "/lib/types/creation.ts"
          ]
        },
        "B1.4": {
          "id": "B1.4",
          "name": "Derived Stats Updates",
          "status": "Complete",
          "dependsOn": ["B1.3.9"],
          "dataStructures": [],
          "components": [],
          "files": [
            "/app/characters/create/components/steps/ReviewStep.tsx",
            "/lib/types/character.ts"
          ]
        }
      }
    },
    "B2": {
      "id": "B2",
      "name": "Sourcebook Integration",
      "priority": "Medium",
      "status": "Not Started",
      "dependsOn": [],
      "milestones": {
        "B2.1": {
          "id": "B2.1",
          "name": "Sourcebook Data Files",
          "status": "Not Started",
          "dependsOn": [],
          "dataStructures": ["sourcebook JSON structure"],
          "components": [],
          "files": [
            "/data/editions/sr5/run-faster.json",
            "/data/editions/sr5/street-grimoire.json"
          ]
        },
        "B2.2": {
          "id": "B2.2",
          "name": "Sourcebook Selection UI",
          "status": "Not Started",
          "dependsOn": ["B2.1.1", "B2.1.3"],
          "dataStructures": ["sourcebook selection in CreationState"],
          "components": ["SourcebookSelector.tsx"],
          "files": [
            "/app/characters/create/components/SourcebookSelector.tsx",
            "/app/characters/create/page.tsx",
            "/lib/types/creation.ts"
          ]
        },
        "B2.3": {
          "id": "B2.3",
          "name": "Merge Algorithm Testing",
          "status": "Not Started",
          "dependsOn": ["B2.1.2", "B2.1.4"],
          "dataStructures": [],
          "components": [],
          "files": ["/lib/rules/__tests__/merge.test.ts"]
        }
      }
    },
    "B3": {
      "id": "B3",
      "name": "Inventory Management",
      "priority": "High",
      "status": "Not Started",
      "dependsOn": [],
      "milestones": {
        "B3.1": {
          "id": "B3.1",
          "name": "Data Structure Updates",
          "status": "Not Started",
          "dependsOn": [],
          "dataStructures": [
            "InventoryItem interface",
            "Inventory interface",
            "EquipmentSlot enum",
            "AmmoTracker type"
          ],
          "components": [],
          "files": ["/lib/types/character.ts"]
        },
        "B3.2": {
          "id": "B3.2",
          "name": "Inventory API and Storage Layer",
          "status": "Not Started",
          "dependsOn": ["B3.1.5"],
          "dataStructures": [],
          "components": [],
          "files": [
            "/app/api/characters/[characterId]/inventory/route.ts",
            "/app/api/characters/[characterId]/inventory/actions/route.ts",
            "/lib/storage/characters.ts"
          ]
        },
        "B3.3": {
          "id": "B3.3",
          "name": "Inventory UI",
          "status": "Not Started",
          "dependsOn": ["B3.2.1"],
          "dataStructures": [],
          "components": [
            "InventoryList.tsx",
            "ItemModal.tsx",
            "AmmoTracker.tsx"
          ],
          "files": [
            "/app/characters/[characterId]/inventory/page.tsx",
            "/components/inventory/InventoryList.tsx",
            "/components/inventory/ItemModal.tsx",
            "/components/inventory/AmmoTracker.tsx"
          ]
        }
      }
    },
    "B4": {
      "id": "B4",
      "name": "Combat Tracker",
      "priority": "High",
      "status": "Not Started",
      "dependsOn": [],
      "milestones": {
        "B4.1": {
          "id": "B4.1",
          "name": "Data Structures",
          "status": "Not Started",
          "dependsOn": [],
          "dataStructures": [
            "CombatSession interface",
            "Combatant interface",
            "CombatAction interface",
            "CombatLog interface"
          ],
          "components": [],
          "files": ["/lib/types/combat.ts"]
        },
        "B4.2": {
          "id": "B4.2",
          "name": "Combat API and Storage Layer",
          "status": "Not Started",
          "dependsOn": ["B4.1.1", "B4.1.2", "B4.1.3", "B4.1.4"],
          "dataStructures": [],
          "components": [],
          "files": [
            "/lib/storage/combat.ts",
            "/app/api/combat/route.ts",
            "/app/api/combat/[sessionId]/route.ts",
            "/app/api/combat/[sessionId]/actions/route.ts"
          ]
        },
        "B4.3": {
          "id": "B4.3",
          "name": "Combat UI",
          "status": "Not Started",
          "dependsOn": ["B4.2.1", "B4.4.3"],
          "dataStructures": [],
          "components": [
            "InitiativeTracker.tsx",
            "CombatantCard.tsx",
            "ActionPanel.tsx",
            "DamageModal.tsx",
            "CombatLog.tsx"
          ],
          "files": [
            "/app/combat/page.tsx",
            "/app/combat/[sessionId]/page.tsx",
            "/components/combat/InitiativeTracker.tsx",
            "/components/combat/CombatantCard.tsx",
            "/components/combat/ActionPanel.tsx",
            "/components/combat/DamageModal.tsx",
            "/components/combat/CombatLog.tsx"
          ]
        },
        "B4.4": {
          "id": "B4.4",
          "name": "Initiative System",
          "status": "Not Started",
          "dependsOn": ["B4.1.2"],
          "dataStructures": [],
          "components": [],
          "files": ["/lib/storage/combat.ts"],
          "requiredBy": ["B4.3.2"]
        }
      },
      "requiredBy": ["B9.2.1", "B9.2.2", "B9.2.3", "B9.3.1"]
    },
    "B5": {
      "id": "B5",
      "name": "Adept Powers System",
      "priority": "Medium",
      "status": "Not Started",
      "dependsOn": ["M0.6", "M0.7"],
      "milestones": {
        "B5.1": {
          "id": "B5.1",
          "name": "Adept Powers System (Data + Step)",
          "status": "Not Started",
          "dependsOn": ["M0.6.3", "M0.7.1"],
          "dataStructures": [
            "AdeptPower interface",
            "power point pool in Character",
            "power point budget in CreationState"
          ],
          "components": ["AdeptPowersStep.tsx"],
          "files": [
            "/app/characters/create/components/steps/AdeptPowersStep.tsx",
            "/data/editions/sr5/core-rulebook.json",
            "/lib/types/character.ts",
            "/lib/types/creation.ts",
            "/app/characters/create/components/CreationWizard.tsx",
            "/app/characters/create/components/steps/MagicStep.tsx"
          ]
        }
      }
    },
    "B6": {
      "id": "B6",
      "name": "Spell Management",
      "priority": "Medium",
      "status": "Not Started",
      "dependsOn": ["M0.7"],
      "milestones": {
        "B6.1": {
          "id": "B6.1",
          "name": "Enhanced Magic System",
          "status": "Not Started",
          "dependsOn": ["M0.7.1"],
          "dataStructures": [
            "Tradition interface",
            "MentorSpirit interface",
            "Ritual interface"
          ],
          "components": ["RitualSelector.tsx (optional)"],
          "files": [
            "/data/editions/sr5/core-rulebook.json",
            "/lib/types/character.ts",
            "/app/characters/create/components/steps/MagicStep.tsx",
            "/components/magic/RitualSelector.tsx"
          ]
        }
      }
    },
    "B7": {
      "id": "B7",
      "name": "Complex Forms & Matrix",
      "priority": "Medium",
      "status": "Not Started",
      "dependsOn": [],
      "milestones": {
        "B7.1": {
          "id": "B7.1",
          "name": "Technomancer Support",
          "status": "Not Started",
          "dependsOn": [],
          "dataStructures": [
            "ComplexForm interface",
            "Living Persona calculations"
          ],
          "components": [],
          "files": [
            "/data/editions/sr5/core-rulebook.json",
            "/app/characters/create/components/steps/ReviewStep.tsx"
          ]
        }
      }
    },
    "B8": {
      "id": "B8",
      "name": "UI/UX Improvements",
      "priority": "Medium",
      "status": "Not Started",
      "dependsOn": [],
      "milestones": {
        "B8.1": {
          "id": "B8.1",
          "name": "Layout Improvements",
          "status": "Not Started",
          "dependsOn": [],
          "dataStructures": [],
          "components": ["Sidebar.tsx"],
          "files": [
            "/app/characters/create/components/CreationWizard.tsx",
            "/components/layout/Sidebar.tsx",
            "/app/characters/create/components/steps/GearStep.tsx"
          ]
        },
        "B8.2": {
          "id": "B8.2",
          "name": "Mobile Optimization",
          "status": "Not Started",
          "dependsOn": [],
          "dataStructures": [],
          "components": [],
          "files": [
            "/app/characters/create/components/CreationWizard.tsx",
            "/app/characters/[characterId]/page.tsx",
            "/app/combat/[sessionId]/page.tsx",
            "/app/characters/[characterId]/inventory/page.tsx"
          ],
          "conditionalDependencies": {
            "B8.2.3": ["B4.3.7"],
            "B8.2.4": ["B3.3.6"]
          }
        }
      }
    },
    "B9": {
      "id": "B9",
      "name": "Session Persistence & WebSockets",
      "priority": "Low",
      "status": "Not Started",
      "dependsOn": ["B4"],
      "milestones": {
        "B9.1": {
          "id": "B9.1",
          "name": "WebSocket Infrastructure",
          "status": "Not Started",
          "dependsOn": [],
          "dataStructures": ["WebSocket event types"],
          "components": [],
          "files": [
            "/lib/websocket/server.ts",
            "/lib/websocket/client.ts",
            "/lib/websocket/types.ts"
          ]
        },
        "B9.2": {
          "id": "B9.2",
          "name": "Combat Session Sharing",
          "status": "Not Started",
          "dependsOn": ["B9.1.4", "B4.2.3"],
          "dataStructures": [],
          "components": [],
          "files": [
            "/lib/websocket/server.ts",
            "/app/api/combat/[sessionId]/actions/route.ts"
          ]
        },
        "B9.3": {
          "id": "B9.3",
          "name": "Session State Management",
          "status": "Not Started",
          "dependsOn": ["B9.1.4", "B4.2.1"],
          "dataStructures": [],
          "components": [],
          "files": [
            "/lib/websocket/server.ts",
            "/lib/websocket/client.ts",
            "/lib/storage/combat.ts",
            "/app/combat/[sessionId]/page.tsx"
          ]
        }
      }
    }
  },
  "criticalPath": [
    "M0.1",
    "M0.2",
    "M0.3",
    "M0.4",
    "M0.5",
    "M0.6",
    "M0.7",
    "B5",
    "B6"
  ],
  "parallelizablePhases": [
    ["B1", "B2", "B3", "B4", "B7", "B8"],
    ["B5", "B6"],
    ["B8.1", "B8.2"]
  ],
  "blockingTasks": {
    "M0.3.9": "Free skills from priority",
    "M0.6": "Required for M0.7.5 and B5.1.4",
    "M0.7": "Required for B5 and B6"
  }
}
```

---

## Dependencies & Prerequisites

This section documents all external dependencies, data requirements, and phase interdependencies needed to complete the Beta implementation. It helps identify blockers, required resources, and implementation order constraints. Understanding these dependencies is critical for planning and scheduling the Beta development work.

### Technical Dependencies

| Dependency | Required For | Notes |
|------------|--------------|-------|
| WebSocket library | B9 | Socket.io recommended for Next.js |
| Test framework | B2.4 | Jest + React Testing Library |
| Mobile testing | B8 | Physical devices or BrowserStack |

### Data Dependencies

| Data Required | Required For | Source |
|---------------|--------------|--------|
| Cyberware catalog | B1 | SR5 Core Rulebook p. 451-462 |
| Bioware catalog | B1 | SR5 Core Rulebook p. 462-468 |
| Run Faster content | B2 | Run Faster sourcebook |
| Street Grimoire content | B2 | Street Grimoire sourcebook |
| Adept powers catalog | B5 | SR5 Core Rulebook p. 308-312 |
| Traditions | B6 | SR5 Core Rulebook p. 280-282 |

### Phase Dependencies

```
B1 (Cyberware) ──────────────────────────────┐
B2 (Sourcebooks) ────────────────────────────┤
B3 (Inventory) ──────────────────────────────┼──> Beta Release
B4 (Combat) ─────────────────────────────────┤
B5 (Adept) ─────> B6 (Spells) ───────────────┤
                 B7 (Matrix) ────────────────┤
B8 (Mobile) ─────────────────────────────────┤
B4 ─────> B9 (WebSockets) ───────────────────┘
```

---

## Risk Assessment

This section identifies potential risks that could impact the Beta implementation timeline or quality. It categorizes risks by severity and provides mitigation strategies. Understanding these risks helps prioritize work, allocate resources appropriately, and avoid common pitfalls.

### High Risk Items

| Risk | Impact | Mitigation |
|------|--------|------------|
| Sourcebook data entry errors | Character creation bugs | Thorough QA with reference books |
| Combat system complexity | Development delays | Start with MVP combat, iterate |
| WebSocket scaling | Performance issues | Use proven library, test under load |

### Medium Risk Items

| Risk | Impact | Mitigation |
|------|--------|------------|
| Mobile layout breaks | Poor UX on mobile | Early mobile testing, responsive-first |
| Essence calculation edge cases | Character validation errors | Unit tests for edge cases |
| Merge conflicts between sourcebooks | Unexpected rule interactions | Document all conflicts, GM resolution |

---

## Success Metrics

This section defines measurable success criteria for the Beta phase. These metrics help assess whether the Beta implementation achieves its goals and provides value to users. They serve as both targets during development and validation criteria before Beta release.

| Metric | Target | Measurement |
|--------|--------|-------------|
| Cyberware items available | 50+ | Count in catalog |
| Sourcebook integration | 2 books | Run Faster + Street Grimoire |
| Combat sessions created | 100 | Analytics |
| Mobile usability score | 90+ | Lighthouse audit |
| WebSocket latency | <100ms | Performance monitoring |

---

## Appendix A: File Locations Quick Reference

This appendix provides a quick reference for all files that need to be created or modified during the Beta implementation. It serves as a checklist and helps developers quickly locate where specific functionality should be implemented. Use this as a guide when planning file structure and organizing code changes.

### New Files to Create

```
/data/editions/sr5/
├── run-faster.json
└── street-grimoire.json

/lib/types/
└── combat.ts

/lib/storage/
└── combat.ts

/lib/websocket/
├── server.ts
├── client.ts
└── types.ts

/app/api/combat/
├── route.ts
└── [sessionId]/
    ├── route.ts
    └── actions/route.ts

/app/combat/
├── page.tsx
└── [sessionId]/page.tsx

/app/api/characters/[characterId]/inventory/
├── route.ts
└── actions/route.ts

/app/characters/[characterId]/inventory/
└── page.tsx

/app/characters/create/components/steps/
├── AugmentationsStep.tsx
├── SpellsStep.tsx
└── AdeptPowersStep.tsx

/components/combat/
├── InitiativeTracker.tsx
├── CombatantCard.tsx
├── ActionPanel.tsx
├── DamageModal.tsx
└── CombatLog.tsx

/components/inventory/
├── InventoryList.tsx
├── ItemModal.tsx
└── AmmoTracker.tsx

/components/magic/
└── (RitualSelector.tsx - optional, may integrate into SpellsStep)
```

### Files to Modify

```
/lib/types/character.ts        # Add inventory, augmentation types
/lib/types/edition.ts          # Add new module types
/lib/types/creation.ts         # Add sourcebook selection, power point budget, free spell/complex form tracking
/lib/rules/RulesetContext.tsx  # Add new hooks
/lib/storage/characters.ts     # Add inventory functions
/data/editions/sr5/core-rulebook.json  # Expand catalogs (adept powers, spells)
/app/characters/create/components/CreationWizard.tsx  # Add AugmentationsStep, SpellsStep, AdeptPowersStep
```

---

## Prompt Pack

This section provides ready-to-use prompts optimized for working with the Beta Implementation Plan. These prompts leverage the plan's terminology, task IDs, and structure to produce high-quality, consistent outputs. Use them exactly as written, replacing placeholders (e.g., `X.Y.Z`, `M0.7.1`) with specific task IDs from the plan.

### Code Generation Prompts

#### Generate Implementation for Specific Task

```
Using the Beta Implementation Plan as the only source of truth, implement task X.Y.Z 
exactly as specified. Include:

1. All data structures defined in the milestone (interfaces, types, enums)
2. All file paths listed in the "Files to modify/create" section
3. All acceptance criteria from the milestone
4. Integration with existing patterns (RulesetContext hooks, CreationState updates, 
   storage layer functions)
5. Proper TypeScript types imported from @/lib/types
6. React Server Components vs Client Components as appropriate
7. Validation logic matching SR5 rules from the plan

Reference the dependency graph to ensure prerequisite tasks are accounted for. 
Show complete implementations, not placeholders.
```

#### Generate Component with CreationState Integration

```
Generate a React component for milestone X.Y that integrates with the character 
creation wizard. Requirements:

1. Use CreationState from @/lib/types/creation.ts for state management
2. Implement auto-save to localStorage on every state change
3. Use RulesetContext hooks (useRuleset(), useMetatypes(), etc.) for data access
4. Follow the step component pattern from existing steps (MetatypeStep, SkillsStep)
5. Include ValidationPanel integration for error display
6. Support navigation via CreationWizard's step system
7. Track free vs karma-purchased items separately where applicable
8. Implement budget tracking (karma, nuyen, power points, etc.)

Show the complete component with proper TypeScript types, error handling, and 
accessibility attributes.
```

#### Generate API Route with Storage Layer

```
Create the API route handler for milestone X.Y following the authentication pattern:

1. Extract session from cookie via getSession()
2. Validate user exists via getUserById()
3. Return 401 if unauthenticated
4. Call storage layer functions from /lib/storage/
5. Use atomic file writes (temp file + rename pattern)
6. Return JSON responses with proper error handling
7. Support all HTTP methods specified in the milestone (GET, POST, PUT, DELETE)

Include the corresponding storage layer functions if they don't exist. Use the 
file-based storage pattern with readJsonFile() and writeJsonFile() utilities.
```

### Code Review Prompts

#### Validate Implementation Against Acceptance Criteria

```
Review this code implementation for milestone X.Y against the acceptance criteria 
in section X.Y.AC. Check:

1. Each acceptance criterion (X.Y.AC.1 through X.Y.AC.N) is satisfied
2. All file paths match the "Files to modify/create" section
3. Data structures match the interfaces defined in the milestone
4. Integration points with other steps/components are correct
5. Validation logic matches SR5 rules from the plan
6. Budget tracking (karma, nuyen, essence, power points) is accurate
7. Free vs karma-purchased items are tracked separately where required
8. Error handling and edge cases are covered

List all missing items, incorrect logic, incomplete validation, or deviations 
from the acceptance criteria. Provide specific line numbers and suggestions.
```

#### Review Data Structure Consistency

```
Review the data structures in this implementation for milestone X.Y:

1. Verify all interfaces match the types defined in /lib/types/character.ts, 
   /lib/types/edition.ts, or /lib/types/creation.ts
2. Check that CreationState updates are properly typed
3. Ensure MergedRuleset structure is respected when accessing ruleset data
4. Validate that racial qualities, free skills, and karma purchases are tracked 
   separately as specified
5. Confirm augmentation bonuses, essence tracking, and Magic/Resonance reduction 
   follow the rules
6. Check that power point budgets, spell limits, and adept power prerequisites 
   are correctly implemented

Flag any type mismatches, missing fields, or incorrect data relationships.
```

#### Review Component Architecture

```
Review this component implementation for architectural consistency:

1. Server Component vs Client Component usage is correct ("use client" directive)
2. RulesetContext hooks are used instead of direct ruleset access
3. CreationState updates use immutable patterns (setState with new objects)
4. Auto-save to localStorage follows the draft pattern
5. Validation state is synced with ValidationPanel
6. Step navigation integrates with CreationWizard's step system
7. File paths use @/* aliases correctly
8. No direct file I/O in components (uses storage layer or API routes)

Identify any architectural violations or deviations from established patterns.
```

### Architecture Generation Prompts

#### Design Data Structure for New Feature

```
Design the data structures needed for milestone X.Y following the existing patterns:

1. Define interfaces in /lib/types/character.ts, /lib/types/edition.ts, or 
   /lib/types/creation.ts as appropriate
2. Follow the existing type system patterns (Character, CreationState, MergedRuleset)
3. Include proper TypeScript types with optional fields, unions, and enums
4. Consider merge strategies if this is ruleset data (append, replace, merge)
5. Account for free vs karma-purchased tracking where applicable
6. Include validation constraints in type definitions where possible
7. Reference similar structures from completed milestones (B1.1, M0.2, etc.)

Show the complete type definitions with JSDoc comments explaining each field and 
its relationship to SR5 rules.
```

#### Design Component Hierarchy

```
Design the component architecture for milestone X.Y:

1. Identify Server Components vs Client Components based on interactivity needs
2. Break down into reusable sub-components following existing patterns
3. Define props interfaces with proper TypeScript types
4. Plan state management (CreationState, local state, RulesetContext)
5. Identify shared components that can be reused (KarmaPurchasePanel, 
   ValidationPanel, etc.)
6. Map component tree showing parent-child relationships
7. Identify integration points with CreationWizard and other steps

Provide a component tree diagram and prop/state definitions for each component.
```

#### Design API and Storage Layer

```
Design the API routes and storage layer functions for milestone X.Y:

1. Define REST API endpoints following the pattern: 
   /app/api/{resource}/[id]/route.ts
2. Create storage functions in /lib/storage/ following atomic write patterns
3. Map CRUD operations to HTTP methods (GET, POST, PUT, DELETE)
4. Define request/response types
5. Plan authentication and authorization checks
6. Identify validation logic needed before storage operations
7. Consider file structure for data persistence (/data/{resource}/{id}.json)

Show the complete API route handlers and storage functions with error handling, 
validation, and proper TypeScript types.
```

### UI Design Prompts

#### Generate Step Component UI

```
Design the UI for milestone X.Y step component following the character creation 
wizard patterns:

1. Use the wireframe from the milestone as a reference
2. Implement responsive layout with Tailwind CSS 4
3. Include dark mode support
4. Add proper accessibility attributes (ARIA labels, keyboard navigation)
5. Integrate with ValidationPanel for error display
6. Show budget tracking (karma, nuyen, essence, power points) prominently
7. Display free vs karma-purchased items separately where applicable
8. Include search/filter functionality for catalogs (spells, powers, gear, etc.)
9. Use React Aria Components for form elements
10. Follow the existing step component layout patterns

Provide the complete JSX structure with Tailwind classes, accessibility attributes, 
and proper component composition.
```

#### Design Catalog Browser Component

```
Design a catalog browser component for milestone X.Y that displays items from 
MergedRuleset data:

1. Use RulesetContext hooks to access filtered catalog data
2. Implement search functionality (by name, category, etc.)
3. Add category filters with proper state management
4. Display item details (cost, availability, effects, prerequisites)
5. Show selected items separately with remove functionality
6. Track free vs karma-purchased items with visual distinction
7. Include validation feedback (availability limits, budget constraints)
8. Support both selection and detailed view modes

Show the component structure with search, filter, and selection logic using 
React hooks and RulesetContext.
```

#### Design Budget Tracker Component

```
Design a budget tracking component for milestone X.Y that displays:

1. Current budget (karma, nuyen, essence, power points) vs remaining
2. Visual progress bars or indicators
3. Breakdown of spending by category
4. Warnings when approaching limits
5. Integration with KarmaPurchasePanel where applicable
6. Real-time updates as selections change

Use the budget tracking patterns from existing steps and ensure proper 
CreationState integration.
```

### Dependency Analysis Prompts

#### Analyze Task Dependencies

```
Analyze the dependencies for milestone X.Y:

1. Identify all prerequisite tasks from the dependsOn fields in the JSON task data
2. Check the dependency graph for phase-level dependencies
3. Verify required data structures are created first
4. Confirm required components exist or are created in order
5. Check file dependencies (imports, shared types, etc.)
6. Identify any circular dependencies or missing prerequisites
7. Determine the minimum viable implementation order

Provide a dependency tree showing the exact order tasks must be completed, 
highlighting any blockers or missing prerequisites.
```

#### Identify Integration Points

```
Identify all integration points for milestone X.Y:

1. Which existing components/steps need to be modified?
2. What CreationState fields need to be added or updated?
3. Which RulesetContext hooks need to be created or extended?
4. What storage layer functions need to be added?
5. Which API routes need to be created or modified?
6. What validation logic needs to be shared across steps?
7. How does this milestone affect the ReviewStep display?

List all files that need changes, the type of change (create, modify, extend), 
and the specific integration points.
```

#### Analyze Cross-Phase Dependencies

```
Analyze how milestone X.Y affects or is affected by other phases:

1. Check the dependency graph for phase-level relationships
2. Identify shared data structures (Character, CreationState, MergedRuleset)
3. Find components that will be reused or extended
4. Identify validation rules that span multiple phases
5. Check for conflicts with parallel phases
6. Verify merge strategies for ruleset data

Provide a cross-phase impact analysis showing what needs coordination and 
what can be developed independently.
```

### Refactoring Prompts

#### Refactor to Use Distributed Karma Architecture

```
Refactor this code to use the distributed karma spending architecture from M0.6:

1. Remove karma spending from KarmaStep
2. Integrate KarmaPurchasePanel into relevant steps (AttributesStep, SkillsStep, 
   ContactsStep, GearStep, SpellsStep, AdeptPowersStep)
3. Use global karma budget tracking from CreationState
4. Implement karma cost constants from M0.6.2
5. Ensure 7 Karma max carryover validation works
6. Update ReviewStep to show karma summary instead of KarmaStep

Show the refactored code with all karma purchases moved to their contextual steps 
and KarmaStep converted to a summary view or merged into ReviewStep.
```

#### Refactor to Track Free vs Karma-Purchased

```
Refactor this implementation to properly track free vs karma-purchased items 
as specified in the plan:

1. Add source tracking ('free' | 'karma') to spells, complex forms, skills, 
   power points, etc.
2. Update CreationState to track free allocations separately
3. Modify UI to display free vs karma-purchased items distinctly
4. Update validation to check free allocation limits (Magic priority, etc.)
5. Ensure ReviewStep shows the breakdown correctly

Show the refactored data structures and component logic with proper separation 
of free and karma-purchased tracking.
```

#### Refactor Component to Use RulesetContext

```
Refactor this component to use RulesetContext hooks instead of direct ruleset 
access:

1. Replace direct ruleset imports with useRuleset(), useMetatypes(), useSkills(), 
   etc.
2. Remove ruleset prop drilling
3. Use RulesetProvider if component tree needs ruleset access
4. Leverage filtered hooks (useCyberware(), useBioware()) for catalog access
5. Ensure proper loading and error state handling

Show the refactored component using RulesetContext patterns and remove any 
direct ruleset file access.
```

### Validation Check Prompts

#### Validate SR5 Rules Implementation

```
Validate that this implementation correctly implements SR5 rules from the plan:

1. Priority table allocations match SR5 rules
2. Karma costs match the constants (attribute ×5, skill ×2, spell 5, etc.)
3. Free spell allocation matches Magic priority (A=10, B=7, C=5, D=3)
4. Spell formula limits are Magic × 2 per category
5. Power point budgets are Magic rating for adepts
6. Essence calculations use grade multipliers correctly
7. Augmentation bonuses don't exceed +4 per attribute
8. Availability validation prevents >12 at creation
9. Skill maximums respect Aptitude and other stat modifiers
10. Racial qualities are applied automatically and tracked separately

List any rule violations, incorrect calculations, or missing validations with 
specific references to SR5 rules from the plan.
```

#### Validate CreationState Consistency

```
Validate that CreationState is used consistently throughout this implementation:

1. All state updates use immutable patterns (setState with new objects)
2. Auto-save to localStorage happens on every state change
3. Validation state is synced across ValidationPanel and ReviewStep
4. Budget tracking (karma, nuyen, essence, power points) is consistent
5. Free vs karma-purchased tracking is maintained correctly
6. Step navigation preserves state correctly
7. Draft recovery works on page reload

Identify any state management issues, missing auto-saves, or inconsistent 
validation state.
```

#### Validate File Structure and Imports

```
Validate the file structure and imports for this implementation:

1. All file paths match the "Files to modify/create" section exactly
2. Imports use @/* path aliases correctly
3. Types are imported from @/lib/types
4. Storage functions are imported from @/lib/storage/
5. RulesetContext hooks are imported from @/lib/rules/RulesetContext
6. No circular dependencies exist
7. Server Components don't import Client Components incorrectly
8. File-based storage uses atomic write patterns

Flag any incorrect paths, missing imports, circular dependencies, or 
architectural violations.
```

#### Validate Acceptance Criteria Coverage

```
Validate that all acceptance criteria for milestone X.Y are met:

1. Go through each acceptance criterion (X.Y.AC.1 through X.Y.AC.N)
2. Verify each criterion has corresponding implementation
3. Check that validation logic covers all criteria
4. Ensure UI displays all required information
5. Confirm error handling covers all edge cases
6. Verify integration with other steps/components works correctly

Provide a checklist showing which acceptance criteria are fully met, partially 
met, or missing, with specific code references.
```

### Usage Guidelines

**When to use these prompts:**
- **Code Generation**: Starting a new milestone or task
- **Code Review**: Before marking a task complete
- **Architecture Generation**: Designing new features or data structures
- **UI Design**: Creating new step components or catalog browsers
- **Dependency Analysis**: Planning implementation order or identifying blockers
- **Refactoring**: Updating existing code to match new patterns
- **Validation Checks**: Final verification before moving to next task

**Best practices:**
1. Always replace placeholder task IDs (X.Y.Z) with actual task IDs from the plan
2. Reference specific sections of the plan when asking for implementation
3. Use the dependency graph to understand prerequisites
4. Check acceptance criteria before marking tasks complete
5. Validate against SR5 rules from the plan, not external sources
6. Follow the established patterns from completed milestones (B1, M0.1-M0.8)

**Example usage:**
```
Using the Beta Implementation Plan, implement task M0.7.1 (Create SpellsStep component) 
exactly as specified. Include all data structures, file paths, and acceptance criteria 
from milestone M0.7. Reference the dependency graph to ensure M0.6.3 (KarmaPurchasePanel) 
is available for M0.7.5.
```

---

## Appendix B: SR5 RULESHEET

This appendix consolidates all SR5 game rules, constraints, karma values, magical limits, drain mechanics, adept power rules, priority tables, and creation method requirements referenced in the Beta Implementation Plan. Use this as a centralized reference for implementing validation logic and game mechanics.

### Karma Costs

**Character Creation Karma Purchase Costs:**

| Purchase Type | Karma Cost Formula | Notes |
|---------------|-------------------|-------|
| Attribute | New rating × 5 | Applies to all 8 attributes |
| Active Skill | New rating × 2 | Individual skills only |
| Skill Group | New rating × 5 | Entire group at once |
| Specialization | 7 | Flat cost per specialization |
| Spell | 5 | Flat cost per spell |
| Complex Form | 4 | Flat cost per complex form |
| Power Point (Mystic Adept) | 5 | 5 Karma = 1 Power Point |
| Contact | Connection + Loyalty | Sum of both ratings |
| Nuyen Conversion | 2,000¥ per Karma | Maximum 10 Karma (20,000¥) |
| Positive Quality | Quality's karma cost | As listed in quality data |
| Buy Off Negative Quality | Quality karma × 2 | Post-creation only |

**Karma Budget Rules:**
- Maximum 7 Karma carryover from character creation
- Karma budget tracked globally across all creation steps
- Free allocations (from priority) tracked separately from karma-purchased

**TypeScript Constant:**
```typescript
const KARMA_COSTS = {
  attribute: (newRating: number) => newRating * 5,
  activeSkill: (newRating: number) => newRating * 2,
  skillGroup: (newRating: number) => newRating * 5,
  specialization: 7,
  spell: 5,
  complexForm: 4,
  powerPoint: 5,
  contact: (connection: number, loyalty: number) => connection + loyalty,
  nuyenConversion: 2000,  // Max 10 Karma
  positiveQuality: (karma: number) => karma,
  buyOffNegativeQuality: (karma: number) => karma * 2,
};
```

### Priority Table & Magic Ratings

**Magic Priority to Rating Mapping:**

| Magic Priority | Magic Rating | Resonance Rating (Technomancer) |
|----------------|--------------|--------------------------------|
| A | 6 | 6 |
| B | 5 | 5 |
| C | 4 | 4 |
| D | 3 | 3 |
| E | 0 (Mundane) | 0 (Mundane) |

**Free Spells by Magic Priority:**

| Magic Priority | Magic Rating | Free Spells |
|----------------|--------------|-------------|
| A | 6 | 10 spells |
| B | 5 | 7 spells |
| C | 4 | 5 spells |
| D | 3 | 3 spells |
| E | 0 | N/A (Mundane) |

**Spell Limits:**
- Total spell limit: Magic rating × 2
- Formula limit per category: Magic rating × 2 per category
- Free spells allocated based on Magic priority (see table above)
- Additional spells cost 5 Karma each
- Free spells tracked separately from karma-purchased spells

### Essence & Augmentation Rules

**Cyberware Grade Essence Multipliers:**

| Grade | Multiplier | Essence Cost Change |
|-------|------------|---------------------|
| Used | 1.25 | +25% essence cost |
| Standard | 1.0 | Base cost (no change) |
| Alpha | 0.8 | -20% essence cost |
| Beta | 0.6 | -40% essence cost |
| Delta | 0.5 | -50% essence cost |

**Essence Calculation:**
- Base essence = 6.0 (for all characters)
- Essence cost = Base cost × Grade multiplier
- Magic/Resonance automatically reduced when essence drops below 6.0
- Essence hole tracking for magic users (prevents Magic/Resonance recovery)

**Augmentation Constraints:**
- Maximum augmentation bonus: +4 per attribute
- Availability limit at creation: ≤12
- Social Limit calculated with reduced Essence
- Overflow calculated with augmentation Body bonuses

**TypeScript Constant:**
```typescript
const gradeMultipliers = {
  used: 1.25,
  standard: 1.0,
  alpha: 0.8,
  beta: 0.6,
  delta: 0.5
};
```

### Adept Power Rules

**Power Point Budgets:**
- Adepts: Free power points = Magic rating
- Mystic Adepts: Can purchase additional power points with Karma (5 Karma = 1 PP)
- Power point budget tracked in CreationState
- Powers with levels cost per level (e.g., Improved Reflexes 1.5 PP per level, max 3 levels)
- Powers without levels have flat cost (e.g., Killing Hands 0.5 PP)

**Adept Power Constraints:**
- Prerequisites must be met before selecting a power
- Assensing skill only available when Astral Perception power is selected
- Power effects apply to derived stats (reaction, initiative dice, etc.)

**Example Power Costs:**
- Improved Reflexes: 1.5 PP per level (max 3 levels) = +1 REA and +1D6 Initiative per level
- Killing Hands: 0.5 PP (flat) = Unarmed attacks deal Physical damage

### Skill Rules

**Skill Filtering Rules:**
- Mundane characters: Cannot access magical skill groups (Sorcery, Conjuring, Enchanting) or individual magical skills
- Adepts: Cannot access ANY magical skill groups (both individual skills and groups blocked)
- Aspected Mages: Can only access skills from their selected aspect (Sorcery, Conjuring, or Enchanting)
- Technomancers: Can access Resonance skills but not magical skills

**Skill Tracking:**
- Free skills from priority tracked separately from karma-purchased skills
- Specializations cost 7 Karma (tracked separately from skill rating)
- Custom knowledge/language skills allowed alongside examples

**Stat-Modifying Qualities:**
- Aptitude quality: +1 skill maximum for specified skill
- Applies to skill maximum calculations
- Limit: 1 per character

### Quality Rules

**Leveled Qualities:**
- Some qualities have multiple levels (e.g., Addiction)
- Each level has different karma cost
- Level must be selected during creation

**Addiction Quality Levels:**
| Level | Name | Karma Cost |
|-------|------|------------|
| 1 | Mild | -4 |
| 2 | Moderate | -9 |
| 3 | Severe | -20 |
| 4 | Burnout | -25 |

**Racial Qualities:**
- Automatically applied when metatype is selected
- Tracked separately from player-selected qualities
- Filtered out from quality selection UI to prevent duplicates
- Displayed on character sheet/review separately

**Quality Constraints:**
- Positive qualities: Cost karma equal to their listed value
- Negative qualities: Provide karma equal to their listed value (negative)
- Some qualities require specification (e.g., Addiction requires substance, Aptitude requires skill)
- Some qualities have limits (e.g., Aptitude limit: 1)

### Contact Rules

**Contact Karma Cost:**
- Cost = Connection rating + Loyalty rating
- Example: Connection 3, Loyalty 2 = 5 Karma
- Contacts can be created from templates or fully custom

**Contact Template Examples:**
- Fixer: Suggested Connection 3, Loyalty 2
- Street Doc: Suggested Connection 2, Loyalty 2

### Drain & Tradition Rules

**Drain Resistance Calculation:**
- Base drain resistance = Willpower + (Tradition-specific attribute)
- Hermetic tradition: Willpower + Logic
- Shamanic tradition: Willpower + Charisma
- Other traditions have their own drain attribute pairs

**Tradition Spirit Types:**
- Each tradition maps spell categories to spirit types
- Hermetic: Combat=Fire, Detection=Air, Health=Man, Illusion=Water, Manipulation=Earth
- Shamanic: Combat=Beast, Detection=Air, Health=Earth, Illusion=Water, Manipulation=Man

**Drain Values:**
- Spells have drain codes (e.g., F-3, F+1)
- Drain resisted using tradition's drain attributes
- Displayed in spell details (drain, range, duration, effects)

### Initiative Rules

**Base Initiative Calculation:**
- Base Initiative = Reaction + Intuition + modifiers
- Initiative Dice = 1d6 + bonus dice (cyberware, drugs, magic)
- Initiative Score = Base + dice roll

**Multi-Pass Initiative:**
- Score > 10: Gets extra pass
- Score > 20: Gets third pass
- Each pass deducts 10 from score until score ≤ 0
- Passes continue until initiative score ≤ 0

**Initiative Tie Breaking:**
- Higher REA + INT wins ties
- If still tied, higher individual attribute wins

**Special Actions:**
- Delayed actions: Can delay turn to act later
- Interrupt actions: Cost -5 to -10 initiative penalty

### Availability & Equipment Rules

**Availability Limits:**
- Maximum availability at character creation: ≤12
- Items with availability >12 cannot be purchased during creation
- Availability validation prevents illegal equipment

**Encumbrance Rules:**
- Carrying capacity = Strength × 10 kg
- Encumbrance levels: none, light, medium, heavy
- Calculated based on total weight of inventory

### Complex Forms & Matrix Rules

**Complex Form Limits:**
- Complex forms catalog: ~30 forms
- Fading values displayed for each form
- Threading rules apply to complex forms

**Living Persona (Technomancers):**
- Matrix attributes calculated from Resonance and attributes
- Matrix Initiative calculated separately from physical initiative
- Displayed on character sheet for technomancers

### Validation Constraints

**Character Creation Validation:**
- All required steps must be completed
- Budgets must not be exceeded (karma, nuyen, essence, power points)
- Limits must be respected (spell limits, availability, augmentation bonuses)
- Prerequisites must be met (adept powers, skills, qualities)
- Free allocations must be used before karma purchases (where applicable)

**Budget Validation:**
- Karma: Track spending across all steps, ensure ≤7 carryover
- Nuyen: Track gear purchases, ensure within Resources priority budget
- Essence: Track augmentation costs, ensure ≥0 remaining
- Power Points: Track adept power costs, ensure within Magic rating budget
- Spells: Track free spells (by priority) and karma-purchased separately

**Derived Stat Calculations:**
- Social Limit: Calculated with reduced Essence
- Overflow: Calculated with augmentation Body bonuses
- Initiative: Reaction + Intuition + modifiers
- Initiative Dice: 1d6 + bonus dice from augmentations/magic

### Creation Method Requirements

**Priority-Based Creation (Current Method):**
- Attributes, Skills, Magic, Resources, Metatype priorities (A-E)
- Each priority slot provides different allocations
- Karma budget for additional purchases
- Free allocations based on priority selections

**Future Creation Methods (B2 - Sourcebook Integration):**
- Life Modules (Run Faster)
- Sum-to-Ten (Run Faster)
- Karma Point-Buy (Run Faster)

### Sourcebook Integration Rules

**Merge Strategies:**
- Append: Add new items to existing catalog
- Replace: Override existing items with new data
- Merge: Combine data structures intelligently
- Remove: Remove items from catalog

**Sourcebook Content:**
- Run Faster: Metavariants, qualities, creation methods, lifestyles
- Street Grimoire: Spells, traditions, mentor spirits, adept powers, rituals, qualities

### UI Display Rules

**Budget Display:**
- Show current budget vs remaining
- Display breakdown by category
- Warn when approaching limits
- Show free vs karma-purchased items separately

**Validation Display:**
- ValidationPanel shows consistent state across wizard
- ReviewStep displays all validation warnings
- Errors prevent progression to next step
- Success indicators when all validations pass

### File Structure Rules

**Data Storage:**
- Characters: `/data/characters/{userId}/{characterId}.json`
- Users: `/data/users/{userId}.json`
- Rulesets: `/data/editions/{editionCode}/`
- Atomic writes: Temp file + rename pattern

**Type Definitions:**
- Character types: `/lib/types/character.ts`
- Edition types: `/lib/types/edition.ts`
- Creation types: `/lib/types/creation.ts`
- Combat types: `/lib/types/combat.ts`

---

**Usage Notes:**
- All values in this rulesheet are extracted from the Beta Implementation Plan
- Use these constants and formulas when implementing validation logic
- Reference specific sections of the plan for detailed implementation requirements
- These rules apply to SR5 (5th Edition) character creation only

---

## Appendix C: Component Hierarchies & UI Wireframes

This appendix provides detailed React component hierarchies and matching ASCII wireframe layouts for each character creation step. Each section includes component trees with props, state, event handlers, and child components, along with 1:1 corresponding UI wireframes.

### AttributesStep

**High-Level Overview:**
The AttributesStep allows players to allocate attribute points from their Attributes priority selection. It displays all 8 attributes (Body, Agility, Reaction, Strength, Willpower, Logic, Intuition, Charisma) with their current ratings, minimums, maximums, and remaining allocation points. Players can increase attributes using priority points or karma purchases. The step integrates with the distributed karma architecture for attribute purchases.

**UI Wireframe:**
```
┌─────────────────────────────────────────────────────────────┐
│ Attributes                              Karma Remaining: 25  │
├─────────────────────────────────────────────────────────────┤
│ Attribute Points Remaining: 12 / 20                         │
│ ⚡ Karma Purchases Available                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Body                    [3] ──┐ ──┐ ──┐ ──┐ ──┐        │ │
│ │ Min: 1  Max: 6  Current: 3/6  [+1] [+1 with Karma]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Agility                  [4] ──┐ ──┐ ──┐ ──┐ ──┐ ──┐   │ │
│ │ Min: 1  Max: 6  Current: 4/6  [+1] [+1 with Karma]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Reaction                 [3] ──┐ ──┐ ──┐ ──┐ ──┐        │ │
│ │ Min: 1  Max: 6  Current: 3/6  [+1] [+1 with Karma]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Strength                 [2] ──┐ ──┐ ──┐ ──┐ ──┐ ──┐   │ │
│ │ Min: 1  Max: 6  Current: 2/6  [+1] [+1 with Karma]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Willpower                [4] ──┐ ──┐ ──┐ ──┐ ──┐ ──┐   │ │
│ │ Min: 1  Max: 6  Current: 4/6  [+1] [+1 with Karma]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Logic                    [5] ──┐ ──┐ ──┐ ──┐ ──┐ ──┐ ──┐│ │
│ │ Min: 1  Max: 6  Current: 5/6  [+1] [+1 with Karma]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Intuition                [3] ──┐ ──┐ ──┐ ──┐ ──┐ ──┐   │ │
│ │ Min: 1  Max: 6  Current: 3/6  [+1] [+1 with Karma]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Charisma                 [2] ──┐ ──┐ ──┐ ──┐ ──┐ ──┐   │ │
│ │ Min: 1  Max: 6  Current: 2/6  [+1] [+1 with Karma]    │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ⚡ Karma Purchases in this step:                             │
│ • Logic +1 (5 Karma)                        [Remove]        │
│                                           Total: 5 Karma     │
└─────────────────────────────────────────────────────────────┘
```

**Component Tree Hierarchy:**
```
AttributesStep (Client Component)
├── Props
│   ├── state: CreationState
│   ├── updateState: (updates: Partial<CreationState>) => void
│   └── budgetValues: Record<string, number>
├── State (Local)
│   ├── localAttributes: Record<AttributeName, number> (derived from state.attributes)
│   └── karmaPurchases: Array<{ attribute: AttributeName, rating: number, karma: number }>
├── Context Usage
│   ├── useRuleset() → ruleset, editionCode
│   ├── useMetatypes() → metatypes (for min/max from metatype)
│   └── usePriorityTable() → priorityTable (for attribute point allocation)
├── Derived Values
│   ├── attributePointsRemaining: number (from budgetValues.attributes - allocated)
│   ├── attributeMinMax: Record<AttributeName, { min: number, max: number }> (from metatype + ruleset)
│   ├── karmaSpent: number (sum of karmaPurchases)
│   └── karmaRemaining: number (from state.karmaBudget - karmaSpent)
├── Child Components
│   ├── AttributeAllocator (8 instances, one per attribute)
│   │   ├── Props
│   │   │   ├── attributeName: AttributeName
│   │   │   ├── currentRating: number
│   │   │   ├── min: number
│   │   │   ├── max: number
│   │   │   ├── pointsRemaining: number
│   │   │   ├── karmaRemaining: number
│   │   │   ├── onIncrease: (attribute: AttributeName) => void
│   │   │   ├── onDecrease: (attribute: AttributeName) => void
│   │   │   └── onKarmaPurchase: (attribute: AttributeName, newRating: number) => void
│   │   ├── State (Local)
│   │   │   └── isHovering: boolean
│   │   └── Child Components
│   │       ├── AttributeSlider (React Aria Slider)
│   │       │   ├── Props
│   │       │   │   ├── value: number
│   │       │   │   ├── min: number
│   │       │   │   ├── max: number
│   │       │   │   ├── step: 1
│   │       │   │   └── onChange: (value: number[]) => void
│   │       │   └── Event Handlers
│   │       │       └── onChange → updateState({ attributes: { ...state.attributes, [name]: value } })
│   │       ├── AttributeButtons
│   │       │   ├── IncreaseButton (disabled if pointsRemaining === 0 || currentRating >= max)
│   │       │   │   └── onClick → handleIncrease()
│   │       │   └── DecreaseButton (disabled if currentRating <= min)
│   │       │       └── onClick → handleDecrease()
│   │       └── AttributeDisplay
│   │           ├── CurrentRating: number
│   │           ├── MinMaxDisplay: "Min: X  Max: Y"
│   │           └── RatingIndicator: visual dots/bars
│   └── KarmaPurchasePanel
│       ├── Props
│       │   ├── purchases: Array<{ attribute: AttributeName, rating: number, karma: number }>
│       │   ├── karmaRemaining: number
│       │   ├── onRemove: (index: number) => void
│       │   └── karmaCost: (rating: number) => rating * 5
│       └── Child Components
│           ├── KarmaPurchaseList
│           │   └── KarmaPurchaseItem (for each purchase)
│           │       ├── Props
│           │       │   ├── attribute: AttributeName
│           │       │   ├── rating: number
│           │       │   ├── karma: number
│           │       │   └── onRemove: () => void
│           │       └── Event Handlers
│           │           └── onRemove → removeKarmaPurchase(index)
│           └── KarmaTotal
│               └── Display: "Total: X Karma"
├── Event Handlers
│   ├── handleAttributeIncrease: (attribute: AttributeName) => void
│   │   └── Validates: pointsRemaining > 0, currentRating < max
│   │   └── Updates: state.attributes[attribute] += 1, attributePointsRemaining -= 1
│   ├── handleAttributeDecrease: (attribute: AttributeName) => void
│   │   └── Validates: currentRating > min
│   │   └── Updates: state.attributes[attribute] -= 1, attributePointsRemaining += 1
│   └── handleKarmaPurchase: (attribute: AttributeName, newRating: number) => void
│       └── Validates: karmaRemaining >= (newRating * 5), newRating <= max
│       └── Updates: karmaPurchases.push({ attribute, rating: newRating, karma: newRating * 5 })
│       └── Updates: state.karmaBudget -= (newRating * 5)
└── Validation Logic
    ├── All attributes within min/max range (from metatype)
    ├── Attribute points allocated ≤ budgetValues.attributes
    ├── Karma purchases don't exceed karma budget
    ├── No attribute exceeds maximum (6 for most metatypes)
    └── All required attributes have minimum value (1)
```

**Notes:**
- **State Management**: Attributes stored in `state.attributes` (Record<AttributeName, number>)
- **Karma Integration**: Uses KarmaPurchasePanel component from M0.6.3
- **Metatype Dependencies**: Min/max values come from selected metatype in state.metatype
- **Priority Dependencies**: Attribute points come from Attributes priority in budgetValues
- **Auto-save**: Changes automatically saved to localStorage via CreationWizard's useEffect
- **Validation**: Real-time validation prevents invalid allocations

---

### SkillsStep

**High-Level Overview:**
The SkillsStep allows players to allocate skill points from their Skills priority, purchase skills with karma, and add specializations. It displays active skills, skill groups, knowledge skills, and language skills with filtering based on character type (mundane, magical, adept, technomancer). Free skill points from priority are tracked separately from karma-purchased skills. The step includes suggested specializations and example knowledge/language skills.

**UI Wireframe:**
```
┌─────────────────────────────────────────────────────────────┐
│ Skills                               Karma Remaining: 20     │
├─────────────────────────────────────────────────────────────┤
│ Skill Points Remaining: 24 / 28 (4 free, 0 karma)            │
│ ⚡ Karma Purchases Available                                │
├─────────────────────────────────────────────────────────────┤
│ [Active Skills] [Skill Groups] [Knowledge] [Languages]      │
├─────────────────────────────────────────────────────────────┤
│ Search: [____________]  Category: [All ▼]                   │
│                                                             │
│ ACTIVE SKILLS                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☑ Firearms                [4] ──┐ ──┐ ──┐ ──┐ ──┐      │ │
│ │   Specialization: [Pistols ▼] or [Custom...]           │ │
│ │   [+1] [+1 with Karma]  [Add Spec (7 Karma)]          │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☐ Sorcery Group           [0] ──┐ ──┐ ──┐ ──┐ ──┐ ──┐ │ │
│ │   (Disabled - Mundane character)                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ KNOWLEDGE SKILLS                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [+ Add Custom]  [Quick Add: Corporate Politics ▼]      │ │
│ │                                                         │ │
│ │ ☑ Corporate Politics      [2] ──┐ ──┐                 │ │
│ │   [+1] [+1 with Karma]  [Remove]                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ LANGUAGES                                                   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [+ Add Custom]  [Quick Add: Japanese ▼]                │ │
│ │                                                         │ │
│ │ ☑ Japanese                [3] ──┐ ──┐ ──┐             │ │
│ │   [+1] [+1 with Karma]  [Remove]                       │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Selected Skills Summary:                                    │
│ • Firearms 4 (Pistols) - 4 free points                      │
│ • Corporate Politics 2 - 2 free points                      │
│ • Japanese 3 - 3 free points                                │
│                                                             │
│ ⚡ Karma Purchases in this step:                             │
│ • Firearms +1 (2 Karma)                    [Remove]         │
│ • Firearms Spec: Rifles (7 Karma)          [Remove]         │
│                                           Total: 9 Karma    │
└─────────────────────────────────────────────────────────────┘
```

**Component Tree Hierarchy:**
```
SkillsStep (Client Component)
├── Props
│   ├── state: CreationState
│   ├── updateState: (updates: Partial<CreationState>) => void
│   └── budgetValues: Record<string, number>
├── State (Local)
│   ├── activeTab: "active" | "groups" | "knowledge" | "languages"
│   ├── searchQuery: string
│   ├── categoryFilter: string
│   ├── selectedSkillId: string | null
│   └── karmaPurchases: Array<{ skillId: string, rating: number, karma: number, type: "skill" | "spec" }>
├── Context Usage
│   ├── useRuleset() → ruleset, editionCode
│   ├── useSkills() → skills catalog
│   ├── useSkillGroups() → skill groups catalog
│   └── useMetatype() → selected metatype (for filtering)
├── Derived Values
│   ├── skillPointsRemaining: number (from budgetValues.skills - allocated)
│   ├── freeSkillPoints: number (from priority allocation)
│   ├── karmaSkillPoints: number (from karma purchases)
│   ├── filteredSkills: Skill[] (filtered by search, category, character type)
│   ├── availableSkillGroups: SkillGroup[] (filtered by character type)
│   ├── isMagical: boolean (from state.magicPath)
│   ├── isAdept: boolean (from state.magicPath === "adept")
│   ├── isTechnomancer: boolean (from state.magicPath === "technomancer")
│   ├── aspectedMageGroup: string | null (from state.aspectedMageGroup)
│   └── karmaSpent: number (sum of karmaPurchases)
├── Child Components
│   ├── SkillsTabBar
│   │   ├── Props
│   │   │   ├── activeTab: string
│   │   │   └── onTabChange: (tab: string) => void
│   │   └── Child Components
│   │       └── TabButton (4 instances)
│   │           └── onClick → setActiveTab(tab)
│   ├── SkillsSearchAndFilter
│   │   ├── Props
│   │   │   ├── searchQuery: string
│   │   │   ├── categoryFilter: string
│   │   │   ├── categories: string[]
│   │   │   ├── onSearchChange: (query: string) => void
│   │   │   └── onCategoryChange: (category: string) => void
│   │   └── Child Components
│   │       ├── SearchInput (React Aria TextField)
│   │       └── CategorySelect (React Aria Select)
│   ├── ActiveSkillsList (conditional on activeTab === "active")
│   │   ├── Props
│   │   │   ├── skills: Skill[]
│   │   │   ├── selectedSkills: Record<string, SkillSelection>
│   │   │   ├── skillPointsRemaining: number
│   │   │   ├── karmaRemaining: number
│   │   │   ├── onSkillSelect: (skillId: string, rating: number, source: "free" | "karma") => void
│   │   │   └── onSkillRemove: (skillId: string) => void
│   │   └── Child Components
│   │       └── SkillCard (for each skill)
│   │           ├── Props
│   │           │   ├── skill: Skill
│   │           │   ├── currentRating: number
│   │           │   ├── specialization: string | null
│   │           │   ├── isDisabled: boolean (magical skills for mundane, etc.)
│   │           │   ├── suggestedSpecializations: string[]
│   │           │   ├── pointsRemaining: number
│   │           │   ├── karmaRemaining: number
│   │           │   ├── onRatingChange: (rating: number, source: "free" | "karma") => void
│   │           │   ├── onSpecializationAdd: (spec: string) => void
│   │           │   └── onRemove: () => void
│   │           ├── State (Local)
│   │           │   └── specInputMode: "dropdown" | "custom"
│   │           └── Child Components
│   │               ├── SkillRatingSlider
│   │               ├── SpecializationSelector
│   │               │   ├── Props
│   │               │   │   ├── suggestedSpecs: string[]
│   │               │   │   ├── currentSpec: string | null
│   │               │   │   ├── mode: "dropdown" | "custom"
│   │               │   │   └── onSpecChange: (spec: string) => void
│   │               │   └── Child Components
│   │               │       ├── SpecDropdown (React Aria Select)
│   │               │       └── SpecCustomInput (React Aria TextField)
│   │               ├── SkillActionButtons
│   │               │   ├── IncreaseButton
│   │               │   ├── DecreaseButton
│   │               │   ├── AddSpecButton (disabled if karmaRemaining < 7)
│   │               │   └── RemoveButton
│   │               └── SkillDisabledIndicator (if isDisabled)
│   ├── SkillGroupsList (conditional on activeTab === "groups")
│   │   ├── Props
│   │   │   ├── skillGroups: SkillGroup[]
│   │   │   ├── selectedGroups: Record<string, number>
│   │   │   └── onGroupSelect: (groupId: string, rating: number) => void
│   │   └── Child Components
│   │       └── SkillGroupCard (similar to SkillCard)
│   ├── KnowledgeSkillsList (conditional on activeTab === "knowledge")
│   │   ├── Props
│   │   │   ├── exampleSkills: string[] (from ruleset)
│   │   │   ├── customSkills: KnowledgeSkill[]
│   │   │   └── onSkillAdd: (name: string, rating: number) => void
│   │   └── Child Components
│   │       ├── QuickAddDropdown
│   │       │   ├── Props
│   │       │   │   ├── examples: string[]
│   │       │   │   └── onSelect: (skill: string) => void
│   │       │   └── Event Handlers
│   │       │       └── onSelect → addKnowledgeSkill(selected)
│   │       ├── CustomSkillInput
│   │       │   └── onSubmit → addKnowledgeSkill(customName)
│   │       └── KnowledgeSkillCard (for each skill)
│   │           └── Similar structure to SkillCard
│   ├── LanguageSkillsList (conditional on activeTab === "languages")
│   │   └── Similar structure to KnowledgeSkillsList
│   ├── SkillsSummary
│   │   ├── Props
│   │   │   ├── selectedSkills: Record<string, SkillSelection>
│   │   │   └── freePointsUsed: number
│   │   └── Child Components
│   │       └── SkillSummaryItem (for each selected skill)
│   └── KarmaPurchasePanel
│       ├── Props
│       │   ├── purchases: Array<{ skillId: string, rating: number, karma: number, type: "skill" | "spec" }>
│       │   ├── karmaRemaining: number
│       │   ├── onRemove: (index: number) => void
│       │   └── karmaCost: (rating: number, type: "skill" | "spec") => number
│       └── Child Components
│           └── KarmaPurchaseItem (for each purchase)
├── Event Handlers
│   ├── handleSkillSelect: (skillId: string, rating: number, source: "free" | "karma") => void
│   │   └── Validates: pointsRemaining > 0 (if free), karmaRemaining >= cost (if karma)
│   │   └── Updates: state.skills[skillId] = { rating, source, specialization: null }
│   ├── handleSkillRatingChange: (skillId: string, newRating: number, source: "free" | "karma") => void
│   │   └── Validates: newRating within limits, budget available
│   │   └── Updates: state.skills[skillId].rating = newRating
│   ├── handleSpecializationAdd: (skillId: string, spec: string) => void
│   │   └── Validates: karmaRemaining >= 7
│   │   └── Updates: state.skills[skillId].specialization = spec
│   │   └── Updates: karmaPurchases.push({ skillId, type: "spec", karma: 7 })
│   ├── handleKnowledgeSkillAdd: (name: string, rating: number) => void
│   │   └── Updates: state.knowledgeSkills.push({ name, rating, source: "free" })
│   └── handleKarmaPurchase: (skillId: string, rating: number, type: "skill" | "spec") => void
│       └── Validates: karmaRemaining >= cost
│       └── Updates: karmaPurchases.push({ skillId, rating, karma: cost, type })
│       └── Updates: state.karmaBudget -= cost
└── Validation Logic
    ├── Skill points allocated ≤ budgetValues.skills
    ├── Free skill points tracked separately from karma-purchased
    ├── Magical skills disabled for mundane characters
    ├── ALL magical skill groups disabled for adepts (both groups and individual skills)
    ├── Aspected mages can only access skills from their selected aspect
    ├── Specializations cost 7 Karma (tracked separately)
    ├── Knowledge/language skills can be custom or from examples
    └── Karma purchases don't exceed karma budget
```

**Notes:**
- **State Management**: Skills stored in `state.skills` (Record<string, SkillSelection>)
- **Free vs Karma Tracking**: Each skill has `source: "free" | "karma"` field
- **Skill Filtering**: Uses character type (mundane, magical, adept, technomancer) to filter available skills
- **Specializations**: Tracked per skill, cost 7 Karma each
- **Knowledge/Language Skills**: Separate arrays in state, support both examples and custom
- **Auto-save**: Changes automatically saved to localStorage

---

### QualitiesStep

**High-Level Overview:**
The QualitiesStep allows players to select positive and negative qualities. It supports leveled qualities (like Addiction with severity levels), stat-modifying qualities (like Aptitude), and filters out racial qualities from the selection UI. Players can browse qualities by type, search by name, and see karma costs/benefits. The step tracks quality limits and prerequisites.

**UI Wireframe:**
```
┌─────────────────────────────────────────────────────────────┐
│ Qualities                            Karma Budget: 25       │
├─────────────────────────────────────────────────────────────┤
│ [Positive] [Negative]  Search: [____________]              │
│                                                             │
│ POSITIVE QUALITIES                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☑ Aptitude                    +14 Karma                  │ │
│ │   Increases maximum rating for specified skill by 1      │ │
│ │   Limit: 1  Spec: [Firearms ▼]                          │ │
│ │   [+ Add]  [Remove]                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☐ First Impression              +10 Karma                │ │
│ │   +2 dice on all Etiquette tests for first meeting       │ │
│ │   Limit: 1                                                │ │
│ │   [+ Add]                                                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ NEGATIVE QUALITIES                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☑ Addiction                    -9 Karma                  │ │
│ │   Level: [Moderate ▼]  Spec: [Novacoke ▼]              │ │
│ │   -9 Karma (Moderate level)                             │ │
│ │   [Change Level]  [Remove]                              │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☐ Allergy (Sunlight, Severe)    -12 Karma                │ │
│ │   -3 dice on all tests when exposed to sunlight         │ │
│ │   [Add]                                                 │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Selected Qualities:                                         │
│ • Aptitude (Firearms) - +14 Karma                           │
│ • Addiction (Novacoke, Moderate) - -9 Karma                 │
│                                                             │
│ Karma Balance: +5 (14 - 9)                                  │
└─────────────────────────────────────────────────────────────┘
```

**Component Tree Hierarchy:**
```
QualitiesStep (Client Component)
├── Props
│   ├── state: CreationState
│   ├── updateState: (updates: Partial<CreationState>) => void
│   └── budgetValues: Record<string, number>
├── State (Local)
│   ├── activeTab: "positive" | "negative"
│   ├── searchQuery: string
│   ├── selectedQualityId: string | null
│   └── qualityDetailsOpen: string | null
├── Context Usage
│   ├── useRuleset() → ruleset, editionCode
│   └── useQualities() → qualities catalog (filtered to exclude racial)
├── Derived Values
│   ├── positiveQualities: Quality[] (filtered by type === "positive")
│   ├── negativeQualities: Quality[] (filtered by type === "negative")
│   ├── selectedQualities: Record<string, QualitySelection>
│   ├── karmaBalance: number (sum of positive karma - sum of negative karma)
│   ├── filteredQualities: Quality[] (filtered by search, tab, excludes racial)
│   └── availableQualities: Quality[] (excludes already selected, respects limits)
├── Child Components
│   ├── QualitiesTabBar
│   │   ├── Props
│   │   │   ├── activeTab: "positive" | "negative"
│   │   │   └── onTabChange: (tab: string) => void
│   │   └── Child Components
│   │       └── TabButton (2 instances)
│   ├── QualitiesSearch
│   │   ├── Props
│   │   │   ├── searchQuery: string
│   │   │   └── onSearchChange: (query: string) => void
│   │   └── Child Components
│   │       └── SearchInput (React Aria TextField)
│   ├── QualitiesList
│   │   ├── Props
│   │   │   ├── qualities: Quality[]
│   │   │   ├── selectedQualities: Record<string, QualitySelection>
│   │   │   ├── onQualitySelect: (qualityId: string, level?: number, spec?: string) => void
│   │   │   └── onQualityRemove: (qualityId: string) => void
│   │   └── Child Components
│   │       └── QualityCard (for each quality)
│   │           ├── Props
│   │           │   ├── quality: Quality
│   │           │   ├── isSelected: boolean
│   │           │   ├── selectedLevel: number | null
│   │           │   ├── selectedSpec: string | null
│   │           │   ├── karmaBalance: number
│   │           │   ├── onSelect: (level?: number, spec?: string) => void
│   │           │   ├── onRemove: () => void
│   │           │   └── onLevelChange: (level: number) => void
│   │           ├── State (Local)
│   │           │   └── isExpanded: boolean
│   │           └── Child Components
│   │               ├── QualityHeader
│   │               │   ├── QualityName: string
│   │               │   ├── QualityKarmaCost: number (with +/- indicator)
│   │               │   └── QualityCheckbox (React Aria Checkbox)
│   │               ├── QualityDescription: string
│   │               ├── QualityLevelSelector (conditional on quality.levels)
│   │               │   ├── Props
│   │               │   │   ├── levels: Array<{ level: number, name: string, karma: number }>
│   │               │   │   ├── selectedLevel: number | null
│   │               │   │   └── onLevelChange: (level: number) => void
│   │               │   └── Child Components
│   │               │       └── LevelSelect (React Aria Select)
│   │               ├── QualitySpecInput (conditional on quality.requiresSpecification)
│   │               │   ├── Props
│   │               │   │   ├── label: string (quality.specificationLabel)
│   │               │   │   ├── value: string | null
│   │               │   │   └── onChange: (spec: string) => void
│   │               │   └── Child Components
│   │               │       └── SpecTextField (React Aria TextField)
│   │               ├── QualityLimitIndicator (conditional on quality.limit)
│   │               │   └── Display: "Limit: X"
│   │               ├── QualityStatModifiers (conditional on quality.statModifiers)
│   │               │   └── Display: Modifier effects (e.g., "+1 skill maximum")
│   │               └── QualityActionButtons
│   │                   ├── AddButton (if !isSelected)
│   │                   └── RemoveButton (if isSelected)
│   ├── QualitiesSummary
│   │   ├── Props
│   │   │   ├── selectedQualities: Record<string, QualitySelection>
│   │   │   └── karmaBalance: number
│   │   └── Child Components
│   │       └── QualitySummaryItem (for each selected quality)
│   │           ├── Props
│   │           │   ├── quality: Quality
│   │           │   ├── level: number | null
│   │           │   ├── spec: string | null
│   │           │   └── karma: number
│   │           └── Display: "QualityName (Spec, Level) - +/-X Karma"
│   └── KarmaBalanceDisplay
│       ├── Props
│       │   └── karmaBalance: number
│       └── Display: "Karma Balance: +/-X"
├── Event Handlers
│   ├── handleQualitySelect: (qualityId: string, level?: number, spec?: string) => void
│   │   └── Validates: limit not exceeded, prerequisites met, spec provided if required
│   │   └── Updates: state.qualities[qualityId] = { level, spec, karma: calculatedKarma }
│   ├── handleQualityRemove: (qualityId: string) => void
│   │   └── Updates: delete state.qualities[qualityId]
│   ├── handleLevelChange: (qualityId: string, newLevel: number) => void
│   │   └── Updates: state.qualities[qualityId].level = newLevel
│   │   └── Updates: state.qualities[qualityId].karma = levelKarma[newLevel]
│   └── handleSpecChange: (qualityId: string, newSpec: string) => void
│       └── Updates: state.qualities[qualityId].spec = newSpec
└── Validation Logic
    ├── Racial qualities filtered out from selection UI
    ├── Quality limits respected (e.g., Aptitude limit: 1)
    ├── Leveled qualities require level selection
    ├── Qualities requiring specification must have spec provided
    ├── Prerequisites must be met before selection
    └── Karma balance calculated correctly (positive - negative)
```

**Notes:**
- **State Management**: Qualities stored in `state.qualities` (Record<string, QualitySelection>)
- **Racial Qualities**: Filtered out from selection (already in state.racialQualities from MetatypeStep)
- **Leveled Qualities**: Support multiple levels with different karma costs
- **Stat Modifiers**: Qualities like Aptitude modify derived stats (tracked separately)
- **Specification**: Some qualities require specification (e.g., Addiction requires substance)
- **Karma Balance**: Positive qualities cost karma, negative qualities provide karma

---

### SpellsStep

**High-Level Overview:**
The SpellsStep allows magical characters to select spells. It displays free spells allocated based on Magic priority, allows karma purchases for additional spells, and validates spell formula limits (Magic × 2 per category). The step shows spell details (drain, range, duration, effects) and tracks free vs karma-purchased spells separately. It only appears for magical characters (mages, aspected mages, mystic adepts).

**UI Wireframe:**
```
┌─────────────────────────────────────────────────────────────┐
│ Spells                              Karma Remaining: 18     │
├─────────────────────────────────────────────────────────────┤
│ Free Spells: 7/7 selected (Magic Priority B)                │
│ Spell Limit: 10/12 (Magic × 2)                              │
│ Formula Limits: Combat 2/10, Detection 1/10, Health 2/10... │
├─────────────────────────────────────────────────────────────┤
│ Category: [All ▼]  Search: [____________]                   │
│                                                             │
│ COMBAT SPELLS                                               │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ☑ Manabolt           Direct | P | LOS | I | WIL        ││
│ │   Drain: F-3         A single target spell...           ││
│ │   Formula: 2/10 (Magic × 2)                            ││
│ │   [Remove]                                            ││
│ └─────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ☐ Fireball           Indirect | P | LOS(A) | I | -     ││
│ │   Drain: F+1         An area spell dealing fire...      ││
│ │   Formula: 0/10                                       ││
│ │   [+ Add Free]  [+ Add with Karma (5 Karma)]          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ DETECTION SPELLS                                            │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ☑ Detect Life        Area | P | LOS(A) | S | WIL       ││
│ │   Drain: F-1         Detects living beings...           ││
│ │   Formula: 1/10                                        ││
│ │   [Remove]                                            ││
│ └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│ Selected Spells (7 free + 3 karma):                         │
│ • Manabolt (Free)                                           │
│ • Stunbolt (Free)                                           │
│ • Heal (Free)                                               │
│ • Increase Reflexes (Free)                                  │
│ • Improved Invisibility (Free)                              │
│ • Levitate (Free)                                           │
│ • Physical Barrier (Free)                                   │
│ • Detect Life (5 Karma)                    [Remove]         │
│ • Armor (5 Karma)                          [Remove]         │
│ • Combat Sense (5 Karma)                   [Remove]         │
├─────────────────────────────────────────────────────────────┤
│ ⚡ Karma spent on spells: 15                                │
└─────────────────────────────────────────────────────────────┘
```

**Component Tree Hierarchy:**
```
SpellsStep (Client Component)
├── Props
│   ├── state: CreationState
│   ├── updateState: (updates: Partial<CreationState>) => void
│   └── budgetValues: Record<string, number>
├── State (Local)
│   ├── searchQuery: string
│   ├── categoryFilter: string
│   ├── selectedSpellId: string | null
│   ├── spellDetailsOpen: string | null
│   └── karmaPurchases: Array<{ spellId: string, karma: number }>
├── Context Usage
│   ├── useRuleset() → ruleset, editionCode
│   └── useSpells() → spells catalog
├── Derived Values
│   ├── magicRating: number (from state.magicRating or budgetValues.magic)
│   ├── magicPriority: "A" | "B" | "C" | "D" | "E" (from state.priorities.magic)
│   ├── freeSpellsAllocated: number (from priority table: A=10, B=7, C=5, D=3)
│   ├── freeSpellsRemaining: number (freeSpellsAllocated - freeSpellsSelected.length)
│   ├── totalSpellLimit: number (magicRating × 2)
│   ├── selectedSpells: Array<{ spellId: string, source: "free" | "karma" }>
│   ├── freeSpells: Array<string> (spellIds with source === "free")
│   ├── karmaSpells: Array<string> (spellIds with source === "karma")
│   ├── formulaLimits: Record<string, { current: number, limit: number }> (per category)
│   ├── filteredSpells: Spell[] (filtered by search, category)
│   ├── spellsByCategory: Record<string, Spell[]> (grouped by category)
│   └── karmaSpent: number (sum of karmaPurchases)
├── Child Components
│   ├── SpellsHeader
│   │   ├── Props
│   │   │   ├── freeSpellsSelected: number
│   │   │   ├── freeSpellsAllocated: number
│   │   │   ├── totalSpellsSelected: number
│   │   │   ├── totalSpellLimit: number
│   │   │   └── magicPriority: string
│   │   └── Child Components
│   │       ├── FreeSpellsIndicator
│   │       │   └── Display: "Free Spells: X/Y selected (Magic Priority Z)"
│   │       ├── SpellLimitIndicator
│   │       │   └── Display: "Spell Limit: X/Y (Magic × 2)"
│   │       └── FormulaLimitsIndicator
│   │           └── Display: "Formula Limits: Combat X/Y, Detection X/Y..."
│   ├── SpellsSearchAndFilter
│   │   ├── Props
│   │   │   ├── searchQuery: string
│   │   │   ├── categoryFilter: string
│   │   │   ├── categories: string[]
│   │   │   ├── onSearchChange: (query: string) => void
│   │   │   └── onCategoryChange: (category: string) => void
│   │   └── Child Components
│   │       ├── SearchInput (React Aria TextField)
│   │       └── CategorySelect (React Aria Select)
│   ├── SpellsByCategoryList
│   │   ├── Props
│   │   │   ├── spellsByCategory: Record<string, Spell[]>
│   │   │   ├── selectedSpells: Array<{ spellId: string, source: "free" | "karma" }>
│   │   │   ├── freeSpellsRemaining: number
│   │   │   ├── karmaRemaining: number
│   │   │   ├── formulaLimits: Record<string, { current: number, limit: number }>
│   │   │   ├── onSpellSelect: (spellId: string, source: "free" | "karma") => void
│   │   │   └── onSpellRemove: (spellId: string) => void
│   │   └── Child Components
│   │       └── SpellCategorySection (for each category)
│   │           ├── Props
│   │           │   ├── category: string
│   │           │   ├── spells: Spell[]
│   │           │   ├── selectedSpells: string[]
│   │           │   ├── formulaLimit: { current: number, limit: number }
│   │           │   └── onSpellSelect: (spellId: string, source: "free" | "karma") => void
│   │           └── Child Components
│   │               ├── CategoryHeader
│   │               │   └── Display: "CATEGORY SPELLS" + formula limit
│   │               └── SpellCard (for each spell)
│   │                   ├── Props
│   │                   │   ├── spell: Spell
│   │                   │   ├── isSelected: boolean
│   │                   │   ├── source: "free" | "karma" | null
│   │                   │   ├── freeSpellsRemaining: number
│   │                   │   ├── karmaRemaining: number
│   │                   │   ├── formulaLimitReached: boolean
│   │                   │   ├── onSelectFree: () => void
│   │                   │   ├── onSelectKarma: () => void
│   │                   │   └── onRemove: () => void
│   │                   ├── State (Local)
│   │                   │   └── isExpanded: boolean
│   │                   └── Child Components
│   │                       ├── SpellCheckbox (React Aria Checkbox)
│   │                       ├── SpellName: string
│   │                       ├── SpellType: string (Direct/Indirect, P/S, LOS/LOS(A), I/S, Drain stat)
│   │                       ├── SpellDrain: string (e.g., "F-3")
│   │                       ├── SpellDescription: string
│   │                       ├── SpellFormulaLimit (conditional)
│   │                       │   └── Display: "Formula: X/Y (Magic × 2)"
│   │                       ├── SpellActionButtons
│   │                       │   ├── AddFreeButton (disabled if freeSpellsRemaining === 0 || formulaLimitReached)
│   │                       │   ├── AddKarmaButton (disabled if karmaRemaining < 5 || formulaLimitReached || totalLimitReached)
│   │                       │   └── RemoveButton (if isSelected)
│   │                       └── SpellDetailsExpander (conditional on isExpanded)
│   │                           └── Display: Full spell description, range, duration, effects
│   ├── SelectedSpellsList
│   │   ├── Props
│   │   │   ├── selectedSpells: Array<{ spellId: string, source: "free" | "karma" }>
│   │   │   └── onSpellRemove: (spellId: string) => void
│   │   └── Child Components
│   │       └── SelectedSpellItem (for each spell)
│   │           ├── Props
│   │           │   ├── spell: Spell
│   │           │   ├── source: "free" | "karma"
│   │           │   └── onRemove: () => void
│   │           └── Display: "• SpellName (Source)" + Remove button
│   └── KarmaPurchasePanel
│       ├── Props
│       │   ├── purchases: Array<{ spellId: string, karma: number }>
│       │   ├── karmaRemaining: number
│       │   └── onRemove: (index: number) => void
│       └── Child Components
│           └── KarmaPurchaseItem (for each purchase)
├── Event Handlers
│   ├── handleSpellSelectFree: (spellId: string) => void
│   │   └── Validates: freeSpellsRemaining > 0, formula limit not reached, total limit not reached
│   │   └── Updates: state.spells.push({ spellId, source: "free" })
│   │   └── Updates: freeSpellsRemaining -= 1, formulaLimits[category].current += 1
│   ├── handleSpellSelectKarma: (spellId: string) => void
│   │   └── Validates: karmaRemaining >= 5, formula limit not reached, total limit not reached
│   │   └── Updates: state.spells.push({ spellId, source: "karma" })
│   │   └── Updates: karmaPurchases.push({ spellId, karma: 5 })
│   │   └── Updates: state.karmaBudget -= 5, formulaLimits[category].current += 1
│   └── handleSpellRemove: (spellId: string) => void
│       └── Finds spell in state.spells, determines source
│       └── Updates: state.spells = state.spells.filter(s => s.spellId !== spellId)
│       └── Updates: If karma, remove from karmaPurchases and refund karma
│       └── Updates: If free, freeSpellsRemaining += 1
│       └── Updates: formulaLimits[category].current -= 1
└── Validation Logic
    ├── Free spells allocated based on Magic priority (A=10, B=7, C=5, D=3)
    ├── Total spell limit = Magic rating × 2
    ├── Formula limit per category = Magic rating × 2
    ├── Free spells tracked separately from karma-purchased
    ├── Karma spell purchases cost 5 Karma each
    ├── Cannot exceed total spell limit
    ├── Cannot exceed formula limit per category
    └── Step only appears for magical characters (mages, aspected mages, mystic adepts)
```

**Notes:**
- **State Management**: Spells stored in `state.spells` (Array<{ spellId: string, source: "free" | "karma" }>)
- **Free Spell Allocation**: Based on Magic priority from priority table
- **Formula Limits**: Each spell category has limit of Magic × 2
- **Dual Tracking**: Free and karma-purchased spells tracked separately
- **Conditional Display**: Step only shown for magical characters
- **Spell Details**: Display drain, range, duration, type, and effects

---

### AdeptPowersStep

**High-Level Overview:**
The AdeptPowersStep allows adept and mystic adept characters to select and allocate power points to adept powers. It displays the power point budget (free = Magic rating for adepts), allows mystic adepts to purchase additional power points with karma (5 Karma = 1 PP), and validates prerequisites. The step shows power effects on character stats and tracks power point costs per power.

**UI Wireframe:**
```
┌─────────────────────────────────────────────────────────────┐
│ Adept Powers                        Karma Remaining: 20      │
├─────────────────────────────────────────────────────────────┤
│ Power Points: 4.0 / 5.0 (Magic Rating)                      │
│ ⚡ Mystic Adepts: Purchase additional PP (5 Karma = 1 PP)   │
├─────────────────────────────────────────────────────────────┤
│ Search: [____________]  Category: [All ▼]                     │
│                                                             │
│ COMBAT POWERS                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☑ Improved Reflexes           1.5 PP per level (max 3)  │ │
│ │   +1 REA and +1D6 Initiative per level                  │ │
│ │   Level: [2 ▼]  Cost: 3.0 PP                            │ │
│ │   [Increase Level] [Decrease Level] [Remove]            │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☐ Killing Hands                 0.5 PP (flat)           │ │
│ │   Unarmed attacks deal Physical damage                   │ │
│ │   Prerequisites: None                                     │ │
│ │   [+ Add]                                                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ DETECTION POWERS                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☑ Astral Perception            1.0 PP (flat)            │ │
│ │   Can perceive the astral plane                          │ │
│ │   Enables Assensing skill                                │ │
│ │   [Remove]                                                │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Selected Powers:                                            │
│ • Improved Reflexes (Level 2) - 3.0 PP                      │
│ • Astral Perception - 1.0 PP                                │
│                                                             │
│ ⚡ Karma Purchases in this step:                             │
│ • +1 Power Point (5 Karma)                  [Remove]        │
│                                           Total: 5 Karma    │
└─────────────────────────────────────────────────────────────┘
```

**Component Tree Hierarchy:**
```
AdeptPowersStep (Client Component)
├── Props
│   ├── state: CreationState
│   ├── updateState: (updates: Partial<CreationState>) => void
│   └── budgetValues: Record<string, number>
├── State (Local)
│   ├── searchQuery: string
│   ├── categoryFilter: string
│   ├── selectedPowerId: string | null
│   ├── powerDetailsOpen: string | null
│   └── karmaPurchases: Array<{ type: "powerPoint", karma: number, powerPoints: number }>
├── Context Usage
│   ├── useRuleset() → ruleset, editionCode
│   └── useAdeptPowers() → adept powers catalog
├── Derived Values
│   ├── magicRating: number (from state.magicRating or budgetValues.magic)
│   ├── isMysticAdept: boolean (from state.magicPath === "mysticAdept")
│   ├── freePowerPoints: number (magicRating for adepts)
│   ├── karmaPowerPoints: number (from karma purchases for mystic adepts)
│   ├── totalPowerPoints: number (freePowerPoints + karmaPowerPoints)
│   ├── powerPointsUsed: number (sum of selected powers costs)
│   ├── powerPointsRemaining: number (totalPowerPoints - powerPointsUsed)
│   ├── selectedPowers: Array<{ powerId: string, level: number, cost: number }>
│   ├── filteredPowers: AdeptPower[] (filtered by search, category)
│   ├── powersByCategory: Record<string, AdeptPower[]> (grouped by category)
│   ├── prerequisitesMet: Record<string, boolean> (for each power)
│   └── karmaSpent: number (sum of karmaPurchases)
├── Child Components
│   ├── PowerPointsHeader
│   │   ├── Props
│   │   │   ├── powerPointsUsed: number
│   │   │   ├── totalPowerPoints: number
│   │   │   ├── magicRating: number
│   │   │   └── isMysticAdept: boolean
│   │   └── Child Components
│   │       ├── PowerPointsIndicator
│   │       │   └── Display: "Power Points: X/Y (Magic Rating)"
│   │       └── MysticAdeptNote (conditional on isMysticAdept)
│   │           └── Display: "Mystic Adepts: Purchase additional PP (5 Karma = 1 PP)"
│   ├── PowersSearchAndFilter
│   │   ├── Props
│   │   │   ├── searchQuery: string
│   │   │   ├── categoryFilter: string
│   │   │   ├── categories: string[]
│   │   │   ├── onSearchChange: (query: string) => void
│   │   │   └── onCategoryChange: (category: string) => void
│   │   └── Child Components
│   │       ├── SearchInput (React Aria TextField)
│   │       └── CategorySelect (React Aria Select)
│   ├── PowersByCategoryList
│   │   ├── Props
│   │   │   ├── powersByCategory: Record<string, AdeptPower[]>
│   │   │   ├── selectedPowers: Array<{ powerId: string, level: number, cost: number }>
│   │   │   ├── powerPointsRemaining: number
│   │   │   ├── prerequisitesMet: Record<string, boolean>
│   │   │   ├── onPowerSelect: (powerId: string, level: number) => void
│   │   │   └── onPowerRemove: (powerId: string) => void
│   │   └── Child Components
│   │       └── PowerCategorySection (for each category)
│   │           ├── Props
│   │           │   ├── category: string
│   │           │   ├── powers: AdeptPower[]
│   │           │   ├── selectedPowers: Array<{ powerId: string, level: number }>
│   │           │   └── onPowerSelect: (powerId: string, level: number) => void
│   │           └── Child Components
│   │               ├── CategoryHeader
│   │               │   └── Display: "CATEGORY POWERS"
│   │               └── PowerCard (for each power)
│   │                   ├── Props
│   │                   │   ├── power: AdeptPower
│   │                   │   ├── isSelected: boolean
│   │                   │   ├── selectedLevel: number | null
│   │                   │   ├── powerPointsRemaining: number
│   │                   │   ├── prerequisitesMet: boolean
│   │                   │   ├── onSelect: (level: number) => void
│   │                   │   ├── onLevelChange: (level: number) => void
│   │                   │   └── onRemove: () => void
│   │                   ├── State (Local)
│   │                   │   └── isExpanded: boolean
│   │                   └── Child Components
│   │                       ├── PowerCheckbox (React Aria Checkbox)
│   │                       ├── PowerName: string
│   │                       ├── PowerCost: string (e.g., "1.5 PP per level (max 3)" or "0.5 PP (flat)")
│   │                       ├── PowerDescription: string
│   │                       ├── PowerLevelSelector (conditional on power.costPerLevel && power.maxLevels > 1)
│   │                       │   ├── Props
│   │                       │   │   ├── maxLevels: number
│   │                       │   │   ├── selectedLevel: number
│   │                       │   │   ├── costPerLevel: number
│   │                       │   │   └── onLevelChange: (level: number) => void
│   │                       │   └── Child Components
│   │                       │       └── LevelSelect (React Aria Select)
│   │                       ├── PowerPrerequisites (conditional on power.prerequisites.length > 0)
│   │                       │   ├── Props
│   │                       │   │   ├── prerequisites: string[]
│   │                       │   │   └── prerequisitesMet: boolean
│   │                       │   └── Display: Prerequisites list + met/not met indicator
│   │                       ├── PowerEffects
│   │                       │   └── Display: Effects on attributes/stats (e.g., "+1 REA and +1D6 Initiative per level")
│   │                       ├── PowerActionButtons
│   │                       │   ├── AddButton (if !isSelected, disabled if !prerequisitesMet || powerPointsRemaining < power.cost)
│   │                       │   ├── IncreaseLevelButton (if isSelected && power.costPerLevel && selectedLevel < power.maxLevels)
│   │                       │   ├── DecreaseLevelButton (if isSelected && power.costPerLevel && selectedLevel > 1)
│   │                       │   └── RemoveButton (if isSelected)
│   │                       └── PowerDetailsExpander (conditional on isExpanded)
│   │                           └── Display: Full power description, effects, prerequisites
│   ├── SelectedPowersList
│   │   ├── Props
│   │   │   ├── selectedPowers: Array<{ powerId: string, level: number, cost: number }>
│   │   │   └── onPowerRemove: (powerId: string) => void
│   │   └── Child Components
│   │       └── SelectedPowerItem (for each power)
│   │           ├── Props
│   │           │   ├── power: AdeptPower
│   │           │   ├── level: number | null
│   │           │   ├── cost: number
│   │           │   └── onRemove: () => void
│   │           └── Display: "• PowerName (Level X) - Y.Z PP" + Remove button
│   └── KarmaPurchasePanel
│       ├── Props
│       │   ├── purchases: Array<{ type: "powerPoint", karma: number, powerPoints: number }>
│       │   ├── karmaRemaining: number
│       │   ├── isMysticAdept: boolean
│       │   └── onRemove: (index: number) => void
│       └── Child Components
│           ├── PurchasePowerPointButton (conditional on isMysticAdept)
│           │   ├── Props
│           │   │   ├── karmaRemaining: number
│           │   │   └── onPurchase: () => void
│           │   └── Event Handlers
│           │       └── onClick → handlePurchasePowerPoint()
│           └── KarmaPurchaseItem (for each purchase)
│               └── Display: "+X Power Point (Y Karma)" + Remove button
├── Event Handlers
│   ├── handlePowerSelect: (powerId: string, level: number) => void
│   │   └── Validates: powerPointsRemaining >= power.cost, prerequisites met
│   │   └── Calculates: cost = power.costPerLevel ? (power.cost * level) : power.cost
│   │   └── Updates: state.adeptPowers.push({ powerId, level, cost })
│   │   └── Updates: powerPointsUsed += cost
│   ├── handlePowerLevelChange: (powerId: string, newLevel: number) => void
│   │   └── Validates: newLevel within 1..maxLevels, powerPointsRemaining >= cost difference
│   │   └── Updates: state.adeptPowers[powerId].level = newLevel
│   │   └── Updates: Recalculate cost and powerPointsUsed
│   ├── handlePowerRemove: (powerId: string) => void
│   │   └── Updates: state.adeptPowers = state.adeptPowers.filter(p => p.powerId !== powerId)
│   │   └── Updates: powerPointsUsed -= removedCost
│   └── handlePurchasePowerPoint: () => void (mystic adepts only)
│       └── Validates: karmaRemaining >= 5
│       └── Updates: karmaPurchases.push({ type: "powerPoint", karma: 5, powerPoints: 1 })
│       └── Updates: state.karmaBudget -= 5, karmaPowerPoints += 1, totalPowerPoints += 1
└── Validation Logic
    ├── Power point budget = Magic rating (for adepts)
    ├── Mystic adepts can purchase additional PP with karma (5 Karma = 1 PP)
    ├── Powers with levels cost per level (e.g., Improved Reflexes 1.5 PP × level)
    ├── Powers without levels have flat cost (e.g., Killing Hands 0.5 PP)
    ├── Prerequisites must be met before selection
    ├── Power points used cannot exceed total power points available
    ├── Assensing skill only available when Astral Perception power is selected
    └── Step only appears for adepts and mystic adepts
```

**Notes:**
- **State Management**: Adept powers stored in `state.adeptPowers` (Array<{ powerId: string, level: number, cost: number }>)
- **Power Point Budget**: Free = Magic rating for adepts, can purchase more for mystic adepts
- **Leveled Powers**: Support multiple levels with cost per level
- **Prerequisites**: Must be validated before power selection
- **Power Effects**: Applied to derived stats (reaction, initiative dice, etc.)
- **Conditional Skills**: Assensing skill availability depends on Astral Perception power

---

### MagicStep (Traditions Section)

**High-Level Overview:**
The MagicStep (Traditions section) allows magical characters to select their magical tradition. It displays available traditions with their drain attributes, spirit type mappings, and descriptions. The tradition selection affects drain resistance calculations and spirit summoning. This section is part of the broader MagicStep that also handles magic path selection (mage, adept, mystic adept, aspected mage, technomancer).

**UI Wireframe:**
```
┌─────────────────────────────────────────────────────────────┐
│ Magic / Resonance Path                                       │
├─────────────────────────────────────────────────────────────┤
│ Magic Priority: B (Magic 5)                                  │
│                                                             │
│ Magic Path: [Full Mage ▼]                                   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Full Mage                                                 ││
│ │ Can cast spells, summon spirits, and perform rituals     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│                                                             │
│ TRADITION SELECTION                                         │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ☑ Hermetic                                               ││
│ │   Drain Attributes: Willpower + Logic                    ││
│ │   Academic and formulaic approach to magic              ││
│ │   Spirit Types: Combat=Fire, Detection=Air, Health=Man...││
│ │   [Select]                                               ││
│ └─────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ☐ Shamanic                                               ││
│ │   Drain Attributes: Willpower + Charisma                 ││
│ │   Spiritual connection to nature and totem               ││
│ │   Spirit Types: Combat=Beast, Detection=Air, Health=... ││
│ │   [Select]                                               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ASPECTED MAGE GROUP (conditional on Aspected Mage)         │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Aspect: [Sorcery ▼]                                      ││
│ │   [Sorcery] [Conjuring] [Enchanting]                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ MENTOR SPIRIT (optional)                                   │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [None] [Bear] [Eagle] [Fire-Born] [Rat] ...            ││
│ │                                                         ││
│ │ Selected: Bear                                          ││
│ │   Bonus: +2 dice on Conjuring tests                     ││
│ │   Drawback: -2 dice on tests involving technology       ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Component Tree Hierarchy:**
```
MagicStep (Client Component)
├── Props
│   ├── state: CreationState
│   ├── updateState: (updates: Partial<CreationState>) => void
│   └── budgetValues: Record<string, number>
├── State (Local)
│   ├── magicPath: "mage" | "adept" | "mysticAdept" | "aspectedMage" | "technomancer" | null
│   ├── traditionId: string | null
│   ├── aspectedMageGroup: "sorcery" | "conjuring" | "enchanting" | null
│   ├── mentorSpiritId: string | null
│   └── traditionDetailsOpen: string | null
├── Context Usage
│   ├── useRuleset() → ruleset, editionCode
│   ├── useTraditions() → traditions catalog
│   └── useMentorSpirits() → mentor spirits catalog
├── Derived Values
│   ├── magicPriority: "A" | "B" | "C" | "D" | "E" (from state.priorities.magic)
│   ├── magicRating: number (from priority table: A=6, B=5, C=4, D=3, E=0)
│   ├── availableTraditions: Tradition[] (filtered by magic path)
│   ├── selectedTradition: Tradition | null (from traditionId)
│   ├── drainAttributes: string[] (from selectedTradition.drainAttributes)
│   ├── spiritTypes: Record<string, string> (from selectedTradition.spiritTypes)
│   ├── availableMentorSpirits: MentorSpirit[] (filtered by tradition compatibility)
│   ├── selectedMentorSpirit: MentorSpirit | null (from mentorSpiritId)
│   └── mentorSpiritBonuses: Record<string, number> (from selectedMentorSpirit)
├── Child Components
│   ├── MagicPathSelector
│   │   ├── Props
│   │   │   ├── magicPath: string | null
│   │   │   ├── magicPriority: string
│   │   │   └── onPathChange: (path: string) => void
│   │   └── Child Components
│   │       ├── MagicPathSelect (React Aria Select)
│   │       │   └── Options: ["Full Mage", "Adept", "Mystic Adept", "Aspected Mage", "Technomancer"]
│   │       └── MagicPathDescription
│   │           └── Display: Description of selected path
│   ├── TraditionsList (conditional on magicPath === "mage" | "mysticAdept" | "aspectedMage")
│   │   ├── Props
│   │   │   ├── traditions: Tradition[]
│   │   │   ├── selectedTraditionId: string | null
│   │   │   ├── onTraditionSelect: (traditionId: string) => void
│   │   │   └── onTraditionDetails: (traditionId: string) => void
│   │   └── Child Components
│   │       └── TraditionCard (for each tradition)
│   │           ├── Props
│   │           │   ├── tradition: Tradition
│   │           │   ├── isSelected: boolean
│   │           │   ├── onSelect: () => void
│   │           │   └── onDetails: () => void
│   │           ├── State (Local)
│   │           │   └── isExpanded: boolean
│   │           └── Child Components
│   │               ├── TraditionRadio (React Aria Radio)
│   │               ├── TraditionName: string
│   │               ├── TraditionDrainAttributes
│   │               │   └── Display: "Drain Attributes: X + Y"
│   │               ├── TraditionDescription: string
│   │               ├── TraditionSpiritTypes
│   │               │   └── Display: "Spirit Types: Combat=X, Detection=Y, Health=Z..."
│   │               └── TraditionDetailsExpander (conditional on isExpanded)
│   │                   └── Display: Full tradition description, spirit type mappings
│   ├── AspectedMageGroupSelector (conditional on magicPath === "aspectedMage")
│   │   ├── Props
│   │   │   ├── aspectedMageGroup: string | null
│   │   │   └── onGroupChange: (group: string) => void
│   │   └── Child Components
│   │       ├── AspectRadioGroup (React Aria RadioGroup)
│   │       │   └── Options: ["Sorcery", "Conjuring", "Enchanting"]
│   │       └── AspectDescription
│   │           └── Display: Description of selected aspect
│   ├── MentorSpiritSelector (conditional on traditionId !== null)
│   │   ├── Props
│   │   │   ├── mentorSpirits: MentorSpirit[]
│   │   │   ├── selectedMentorSpiritId: string | null
│   │   │   ├── traditionId: string | null
│   │   │   └── onMentorSpiritSelect: (mentorSpiritId: string | null) => void
│   │   └── Child Components
│   │       ├── MentorSpiritSelect (React Aria Select)
│   │       │   ├── Options: ["None", ...mentorSpirits.map(m => m.name)]
│   │       │   └── Default: "None"
│   │       └── MentorSpiritDetails (conditional on selectedMentorSpiritId !== null)
│   │           ├── Props
│   │           │   └── mentorSpirit: MentorSpirit
│   │           └── Child Components
│   │               ├── MentorSpiritName: string
│   │               ├── MentorSpiritBonuses
│   │               │   └── Display: Bonuses (e.g., "+2 dice on Conjuring tests")
│   │               └── MentorSpiritDrawbacks
│   │                   └── Display: Drawbacks (e.g., "-2 dice on technology tests")
│   └── TraditionSummary
│       ├── Props
│       │   ├── tradition: Tradition | null
│       │   ├── mentorSpirit: MentorSpirit | null
│       │   └── aspectedMageGroup: string | null
│       └── Child Components
│           └── SummaryDisplay
│               └── Display: Selected tradition, aspect (if applicable), mentor spirit (if selected)
├── Event Handlers
│   ├── handleMagicPathChange: (path: string) => void
│   │   └── Updates: state.magicPath = path
│   │   └── Updates: If path changes, reset tradition/mentor spirit if incompatible
│   ├── handleTraditionSelect: (traditionId: string) => void
│   │   └── Updates: state.traditionId = traditionId
│   │   └── Updates: state.drainAttributes = tradition.drainAttributes
│   │   └── Updates: state.spiritTypes = tradition.spiritTypes
│   ├── handleAspectedMageGroupChange: (group: string) => void
│   │   └── Updates: state.aspectedMageGroup = group
│   │   └── Note: This affects SkillsStep filtering
│   └── handleMentorSpiritSelect: (mentorSpiritId: string | null) => void
│       └── Updates: state.mentorSpiritId = mentorSpiritId
│       └── Updates: state.mentorSpiritBonuses = mentorSpirit.bonuses (if selected)
│       └── Updates: state.mentorSpiritDrawbacks = mentorSpirit.drawbacks (if selected)
└── Validation Logic
    ├── Magic path must be selected for magical characters
    ├── Tradition must be selected for mages, mystic adepts, aspected mages
    ├── Aspected mage group must be selected for aspected mages
    ├── Mentor spirit is optional but must be compatible with tradition
    ├── Drain attributes calculated from tradition selection
    ├── Spirit types mapped from tradition selection
    └── Tradition selection affects drain resistance in spellcasting
```

**Notes:**
- **State Management**: Magic path, tradition, aspected mage group, and mentor spirit stored in `state.magicPath`, `state.traditionId`, `state.aspectedMageGroup`, `state.mentorSpiritId`
- **Tradition Dependencies**: Tradition affects drain calculation and spirit summoning
- **Aspected Mage Group**: Affects skill filtering in SkillsStep (only skills from selected aspect)
- **Mentor Spirits**: Optional, provide bonuses and drawbacks
- **Drain Attributes**: Stored in state for use in spellcasting calculations
- **Conditional Display**: Traditions section only shown for mages, mystic adepts, aspected mages

---

**General Notes for All Steps:**

1. **Common Props Pattern**: All steps receive `state`, `updateState`, and `budgetValues` props
2. **Auto-save**: All state changes automatically saved to localStorage via CreationWizard's useEffect
3. **Validation Integration**: All steps integrate with ValidationPanel for error display
4. **RulesetContext**: All steps use RulesetContext hooks for data access
5. **Karma Integration**: Steps with karma purchases use KarmaPurchasePanel component
6. **Free vs Karma Tracking**: Items with free allocations track source separately
7. **Budget Display**: All steps show relevant budgets (karma, nuyen, essence, power points, etc.)
8. **Accessibility**: All interactive elements use React Aria Components
9. **Responsive Design**: All layouts use Tailwind CSS 4 with responsive breakpoints
10. **Dark Mode**: All components support dark mode via Tailwind classes

