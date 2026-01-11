# Character-Aware Action Filtering - Manual Testing Plan

**Feature:** Character-Aware Action Filtering
**Version:** 1.0
**Date:** 2024-12-28
**Status:** Ready for Testing

## Overview

This document provides a comprehensive manual testing plan for the character-aware action filtering feature. This feature ensures that combat actions displayed to the user are filtered based on the character's equipment, abilities, and magical path.

### Features Under Test

1. **Prerequisite Validation** - Checking character equipment/abilities against action requirements
2. **Action Extraction Hooks** - Loading actions from JSON catalog via RulesetContext
3. **ActionPanel UI** - Displaying available/unavailable actions with multi-step flow
4. **TargetSelector Integration** - Selecting targets for attack actions
5. **Quick NPC Management** - Adding/removing opponents for combat testing

### Key Files

| Component              | File Path                                                          |
| ---------------------- | ------------------------------------------------------------------ |
| Prerequisite Validator | `lib/rules/action-resolution/action-validator.ts`                  |
| Action Hooks           | `lib/rules/RulesetContext.tsx`                                     |
| Action Extractor       | `lib/rules/loader.ts`                                              |
| ActionPanel UI         | `app/characters/[id]/components/ActionPanel.tsx`                   |
| TargetSelector         | `app/characters/[id]/components/TargetSelector.tsx`                |
| QuickNPCPanel          | `app/characters/[id]/components/QuickNPCPanel.tsx`                 |
| Participant API        | `app/api/combat/[sessionId]/participants/[participantId]/route.ts` |

---

## Prerequisites

### Environment Setup

- [ ] Development server running (`pnpm dev`)
- [ ] Test user account created
- [ ] Browser developer tools accessible

### Test Characters Required

Create or verify these test characters exist:

| Character Name      | Configuration                                    | Purpose                       |
| ------------------- | ------------------------------------------------ | ----------------------------- |
| **Armed Fighter**   | Ranged weapon (pistol) + Melee weapon (blade)    | Weapon-based action filtering |
| **Unarmed Mundane** | No weapons, `magicalPath: null`                  | Unavailable actions display   |
| **Full Mage**       | `magicalPath: "full-mage"`, Magic: 6, Has spells | Magic action availability     |
| **Technomancer**    | `magicalPath: "technomancer"`, Resonance: 5      | Matrix/techno filtering       |
| **Street Sam**      | Multiple firearms with different firing modes    | Firing mode prerequisites     |

---

## Test Suites

### Suite 1: Prerequisite Validation

#### Test 1.1: Ranged Weapon Detection

**Objective:** Verify ranged weapon prerequisites are correctly evaluated

| #   | Step                                  | Expected Result                                           | Pass/Fail |
| --- | ------------------------------------- | --------------------------------------------------------- | --------- |
| 1   | Open Armed Fighter character sheet    | Character loads                                           |           |
| 2   | Navigate to Action Panel > Combat tab | Combat actions displayed                                  |           |
| 3   | Locate "Fire Weapon" actions          | Actions should be in "Available" section                  |           |
| 4   | Open Unarmed Mundane character sheet  | Character loads                                           |           |
| 5   | Navigate to Action Panel > Combat tab | Combat actions displayed                                  |           |
| 6   | Locate "Fire Weapon" actions          | Actions should be in "Unavailable" section with lock icon |           |

**Notes:**

```
Ranged weapon subcategories: light-pistol, heavy-pistol, hold-out, machine-pistol,
smg, assault-rifle, rifle, sniper-rifle, shotgun, machine-gun, cannon, launcher
```

---

#### Test 1.2: Melee Weapon Detection

**Objective:** Verify melee weapon prerequisites are correctly evaluated

| #   | Step                                    | Expected Result                    | Pass/Fail |
| --- | --------------------------------------- | ---------------------------------- | --------- |
| 1   | Open Armed Fighter (with melee weapon)  | Character loads                    |           |
| 2   | Check "Melee Attack" action             | Should be in "Available" section   |           |
| 3   | Open character with ONLY ranged weapons | Character loads                    |           |
| 4   | Check "Melee Attack" action             | Should be in "Unavailable" section |           |

---

#### Test 1.3: Magic User Detection

**Objective:** Verify magic prerequisites check both attribute and magical path

| #   | Step                                              | Expected Result                           | Pass/Fail |
| --- | ------------------------------------------------- | ----------------------------------------- | --------- |
| 1   | Open Full Mage character                          | Character loads                           |           |
| 2   | Verify `magicalPath: "full-mage"` and `magic > 0` | Data correct                              |           |
| 3   | Check magic-related actions (if in catalog)       | Should be available                       |           |
| 4   | Open Unarmed Mundane character                    | Character loads                           |           |
| 5   | Check same magic actions                          | Should be unavailable                     |           |
| 6   | Open Adept character (if exists)                  | Character loads                           |           |
| 7   | Check spellcasting actions                        | Should be unavailable (adepts can't cast) |           |

**Valid magic paths for spellcasting:** `full-mage`, `aspected-mage`, `mystic-adept`

---

#### Test 1.4: Technomancer Detection

**Objective:** Verify technomancer prerequisites

| #   | Step                                                     | Expected Result       | Pass/Fail |
| --- | -------------------------------------------------------- | --------------------- | --------- |
| 1   | Open Technomancer character                              | Character loads       |           |
| 2   | Verify `magicalPath: "technomancer"` and `resonance > 0` | Data correct          |           |
| 3   | Check matrix/technomancer actions                        | Should be available   |           |
| 4   | Open Full Mage character                                 | Character loads       |           |
| 5   | Check same technomancer actions                          | Should be unavailable |           |

---

### Suite 2: Action Extraction & Hooks

#### Test 2.1: Actions Load from Catalog

**Objective:** Verify actions are extracted from JSON catalog

| #   | Step                                  | Expected Result                                                             | Pass/Fail |
| --- | ------------------------------------- | --------------------------------------------------------------------------- | --------- |
| 1   | Open browser dev tools > Network tab  | Network panel visible                                                       |           |
| 2   | Load any character sheet              | API calls made                                                              |           |
| 3   | Find `GET /api/rulesets/sr5` response | Response received                                                           |           |
| 4   | Inspect `extractedData.actions`       | Contains `combat`, `general`, `magic`, `matrix`, `social`, `vehicle` arrays |           |
| 5   | Verify `combat` array has ~20 actions | Actions present                                                             |           |

**API Response Structure:**

```json
{
  "extractedData": {
    "actions": {
      "combat": [...],
      "general": [...],
      "magic": [],
      "matrix": [],
      "social": [],
      "vehicle": []
    }
  }
}
```

---

#### Test 2.2: useAvailableActions Hook

**Objective:** Verify hook correctly filters actions by character capabilities

| #   | Step                                         | Expected Result                  | Pass/Fail |
| --- | -------------------------------------------- | -------------------------------- | --------- |
| 1   | Open Armed Fighter character                 | Character loads                  |           |
| 2   | Open Combat tab in Action Panel              | Actions displayed                |           |
| 3   | Count actions in "Available" section         | Multiple actions present         |           |
| 4   | Verify fire-weapon and melee actions present | Weapon actions available         |           |
| 5   | Open Unarmed Mundane character               | Character loads                  |           |
| 6   | Open Combat tab                              | Actions displayed                |           |
| 7   | Count actions in "Available" section         | Fewer actions than Armed Fighter |           |
| 8   | Count actions in "Unavailable" section       | Weapon actions listed here       |           |

---

### Suite 3: ActionPanel UI

#### Test 3.1: Available Actions Display

**Objective:** Verify available actions render correctly with proper styling

| #   | Step                                       | Expected Result                                          | Pass/Fail |
| --- | ------------------------------------------ | -------------------------------------------------------- | --------- |
| 1   | Open Armed Fighter character               | Character loads                                          |           |
| 2   | Expand Action Panel (click header)         | Panel expands                                            |           |
| 3   | Click "Combat" tab                         | Combat actions displayed                                 |           |
| 4   | Observe "Available Actions" section header | Header visible                                           |           |
| 5   | Verify action buttons are colored by type  | Free=green, Simple=blue, Complex=purple, Interrupt=amber |           |
| 6   | Verify dice pool shown on each action      | Format: "Xd6"                                            |           |
| 7   | Verify action type badge shown             | F, S, C, or Int                                          |           |
| 8   | Click an available action                  | Action selectable                                        |           |

---

#### Test 3.2: Unavailable Actions Display

**Objective:** Verify unavailable actions are grayed out with reasons

| #   | Step                                     | Expected Result                                  | Pass/Fail |
| --- | ---------------------------------------- | ------------------------------------------------ | --------- |
| 1   | Open Unarmed Mundane character           | Character loads                                  |           |
| 2   | Navigate to Combat tab                   | Actions displayed                                |           |
| 3   | Locate "Unavailable Actions" section     | Section visible with lock icon                   |           |
| 4   | Observe grayed-out action styling        | Opacity reduced, muted colors                    |           |
| 5   | Hover over an unavailable action         | Tooltip shows requirement reason                 |           |
| 6   | Attempt to click unavailable action      | Action not selectable (disabled)                 |           |
| 7   | Verify alert icon on unavailable actions | Amber alert circle visible                       |           |
| 8   | Verify helper text                       | "Hover over an action to see requirements" shown |           |

---

#### Test 3.3: Fallback Legacy Actions

**Objective:** Verify fallback to hardcoded actions when catalog empty

| #   | Step                                     | Expected Result                                         | Pass/Fail |
| --- | ---------------------------------------- | ------------------------------------------------------- | --------- |
| 1   | Simulate empty action catalog (dev only) | Catalog returns empty                                   |           |
| 2   | Open any character's Combat tab          | Actions displayed                                       |           |
| 3   | Verify legacy actions shown              | Melee Attack, Ranged Attack, Dodge, Block, Soak visible |           |
| 4   | Verify actions are functional            | Can select and use                                      |           |

**Note:** This is an edge case for error recovery. Normal operation uses the catalog.

---

### Suite 4: Multi-Step Action Flow

#### Test 4.1: Action Selection (Step 1)

**Objective:** Verify action selection initiates multi-step flow

| #   | Step                                 | Expected Result                            | Pass/Fail |
| --- | ------------------------------------ | ------------------------------------------ | --------- |
| 1   | Open Armed Fighter, go to Combat tab | Actions displayed                          |           |
| 2   | Click "Fire Weapon (SS)" action      | Flow advances                              |           |
| 3   | Observe header changes               | Shows "Select Target for Fire Weapon (SS)" |           |
| 4   | Verify back arrow appears            | Arrow button visible                       |           |
| 5   | Click back arrow                     | Returns to action selection                |           |
| 6   | Verify original action list restored | All actions visible again                  |           |

---

#### Test 4.2: Target Selection (Step 2)

**Objective:** Verify target selection works during combat

| #   | Step                                      | Expected Result                  | Pass/Fail |
| --- | ----------------------------------------- | -------------------------------- | --------- |
| 1   | Start Quick Combat (click button)         | Combat session created           |           |
| 2   | Add 2 NPCs via Quick NPC Panel            | NPCs added to combat             |           |
| 3   | Select an attack action (melee or ranged) | Target selection step shown      |           |
| 4   | Observe TargetSelector component          | Lists NPCs as selectable targets |           |
| 5   | Click on first NPC target                 | Target selected, flow advances   |           |
| 6   | Verify target indicator                   | Selected target highlighted      |           |
| 7   | Go back, select different target          | Can change selection             |           |
| 8   | Click "Skip (no target)"                  | Advances without target          |           |

---

#### Test 4.3: Confirmation (Step 3)

**Objective:** Verify confirmation step displays correct information

| #   | Step                                | Expected Result                       | Pass/Fail |
| --- | ----------------------------------- | ------------------------------------- | --------- |
| 1   | Complete action + target selection  | Confirm step displayed                |           |
| 2   | Verify action summary card          | Shows action icon, name, description  |           |
| 3   | Verify target display (if selected) | Shows "Target: [NPC Name]" in amber   |           |
| 4   | Verify dice pool preview            | Shows calculated pool in "Xd6" format |           |
| 5   | Verify "Roll" button text           | Shows "Roll Xd6" with correct number  |           |
| 6   | Click Roll button                   | Dice roller modal opens               |           |
| 7   | Complete roll                       | Flow resets to action selection       |           |

---

#### Test 4.4: Non-Attack Actions

**Objective:** Verify actions without targets skip target selection

| #   | Step                   | Expected Result               | Pass/Fail |
| --- | ---------------------- | ----------------------------- | --------- |
| 1   | Start combat, add NPCs | Combat active                 |           |
| 2   | Select "Dodge" action  | Should skip target selection  |           |
| 3   | Observe flow           | Goes directly to confirm step |           |
| 4   | Verify no target shown | No "Target:" line displayed   |           |
| 5   | Complete roll          | Works correctly               |           |

---

### Suite 5: Quick Combat & NPC Management

#### Test 5.1: Start Quick Combat

**Objective:** Verify quick combat session creation

| #   | Step                                   | Expected Result                    | Pass/Fail |
| --- | -------------------------------------- | ---------------------------------- | --------- |
| 1   | Open any character sheet               | Character loads                    |           |
| 2   | Locate "Quick Combat Controls" section | Section visible                    |           |
| 3   | Click "Start Quick Combat" button      | Button responds                    |           |
| 4   | Observe UI changes                     | Combat status indicator appears    |           |
| 5   | Verify Action Panel updates            | Action economy display shown       |           |
| 6   | Verify NO page refresh                 | URL unchanged, state preserved     |           |
| 7   | Check server logs                      | `POST /api/combat/quick-start 201` |           |

---

#### Test 5.2: Add NPCs

**Objective:** Verify NPC addition to combat

| #   | Step                        | Expected Result                                  | Pass/Fail |
| --- | --------------------------- | ------------------------------------------------ | --------- |
| 1   | Expand Quick NPC Panel      | Panel shows templates                            |           |
| 2   | Verify 5 templates visible  | Ganger, Security Guard, CorpSec, HTR, Street Sam |           |
| 3   | Click "Ganger" template     | NPC added                                        |           |
| 4   | Observe "In Combat" section | Shows "Ganger" with initiative                   |           |
| 5   | Check initiative score      | Random roll applied                              |           |
| 6   | Add another Ganger          | Named "Ganger 2" (unique)                        |           |
| 7   | Add Security Guard          | Different template works                         |           |
| 8   | Check server logs           | `POST .../participants 201` for each             |           |

**NPC Template Stats:**

| Template        | Init Pool | Attack | Defense | CM  |
| --------------- | --------- | ------ | ------- | --- |
| Ganger          | 7         | 8      | 6       | 9   |
| Security Guard  | 8         | 10     | 8       | 10  |
| CorpSec Trooper | 10        | 12     | 10      | 11  |
| HTR Member      | 12        | 15     | 12      | 12  |
| Street Samurai  | 14        | 16     | 14      | 12  |

---

#### Test 5.3: Remove NPCs

**Objective:** Verify NPC removal works without errors

| #   | Step                            | Expected Result                    | Pass/Fail |
| --- | ------------------------------- | ---------------------------------- | --------- |
| 1   | Have at least 2 NPCs in combat  | NPCs visible                       |           |
| 2   | Click trash icon on first NPC   | NPC removed                        |           |
| 3   | Verify NPC disappears from list | List updated                       |           |
| 4   | Verify NO JSON parse error      | No error toast/message             |           |
| 5   | Check server logs               | `DELETE .../participants/[id] 200` |           |
| 6   | Remove remaining NPCs           | All removable                      |           |

---

### Suite 6: Integration Tests

#### Test 6.1: Full Combat Flow

**Objective:** End-to-end test of complete combat action

| #   | Step                                               | Expected Result                     | Pass/Fail |
| --- | -------------------------------------------------- | ----------------------------------- | --------- |
| 1   | Open Armed Fighter character                       | Character loads                     |           |
| 2   | Start Quick Combat                                 | Combat session created              |           |
| 3   | Add 2 Gangers via Quick NPC Panel                  | NPCs in combat                      |           |
| 4   | Go to Action Panel > Combat tab                    | Available actions shown             |           |
| 5   | Select "Fire Weapon (SS)"                          | Target selection shown              |           |
| 6   | Select first Ganger as target                      | Confirm step shown                  |           |
| 7   | Verify dice pool = AGI + Firearms + wound modifier | Pool calculated correctly           |           |
| 8   | Click "Roll Xd6" button                            | Dice roller opens                   |           |
| 9   | Complete the roll                                  | Results displayed                   |           |
| 10  | Verify flow resets                                 | Back to action selection            |           |
| 11  | Check action economy                               | Simple action consumed (if tracked) |           |

---

#### Test 6.2: Unarmed Character Restrictions

**Objective:** Verify unarmed characters see appropriate restrictions

| #   | Step                                  | Expected Result                | Pass/Fail |
| --- | ------------------------------------- | ------------------------------ | --------- |
| 1   | Open Unarmed Mundane character        | Character loads                |           |
| 2   | Start Quick Combat                    | Combat active                  |           |
| 3   | Add 1 NPC                             | NPC in combat                  |           |
| 4   | Go to Combat tab                      | Actions displayed              |           |
| 5   | Verify Fire-weapon actions grayed out | In "Unavailable" section       |           |
| 6   | Hover over grayed Fire Weapon         | Shows "Requires ranged weapon" |           |
| 7   | Verify Dodge IS available             | In "Available" section         |           |
| 8   | Select and complete Dodge action      | Works correctly                |           |

---

### Suite 7: Edge Cases

#### Test 7.1: No Targets in Combat

**Objective:** Verify behavior when no NPCs added

| #   | Step                         | Expected Result                      | Pass/Fail |
| --- | ---------------------------- | ------------------------------------ | --------- |
| 1   | Start Quick Combat (no NPCs) | Combat active                        |           |
| 2   | Select attack action         | Target selection shown               |           |
| 3   | Observe TargetSelector       | Shows "No targets available" message |           |
| 4   | Click "Skip (no target)"     | Can proceed without target           |           |
| 5   | Complete action              | Works correctly                      |           |

---

#### Test 7.2: Wound Modifier Application

**Objective:** Verify wound modifiers affect dice pools

| #   | Step                                     | Expected Result      | Pass/Fail |
| --- | ---------------------------------------- | -------------------- | --------- |
| 1   | Apply damage to character (Physical: 3+) | Wound modifier = -1  |           |
| 2   | Check action dice pools                  | Pools reduced by 1   |           |
| 3   | Apply more damage (Physical: 6+)         | Wound modifier = -2  |           |
| 4   | Check pools again                        | Further reduced      |           |
| 5   | Verify minimum pool is 0                 | Never shows negative |           |

---

#### Test 7.3: Session Persistence

**Objective:** Verify combat state persists across page refreshes

| #   | Step                   | Expected Result          | Pass/Fail |
| --- | ---------------------- | ------------------------ | --------- |
| 1   | Start combat, add NPCs | Combat with participants |           |
| 2   | Refresh page (F5)      | Page reloads             |           |
| 3   | Check combat status    | Still in combat          |           |
| 4   | Check NPCs             | Still present            |           |
| 5   | Leave combat           | Combat ended             |           |
| 6   | Refresh page           | No combat session        |           |

---

## API Endpoint Tests

### Endpoint: GET /api/rulesets/sr5

```bash
curl -s http://localhost:3000/api/rulesets/sr5 | jq '.extractedData.actions | keys'
```

**Expected:** `["combat", "general", "magic", "matrix", "social", "vehicle"]`

---

### Endpoint: DELETE /api/combat/[sessionId]/participants/[participantId]

```bash
curl -X DELETE http://localhost:3000/api/combat/{sessionId}/participants/{participantId} \
  -H "Cookie: session=..."
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Removed [name] from combat"
}
```

---

## Test Results Summary

| Suite                      | Total Tests | Passed | Failed | Blocked |
| -------------------------- | ----------- | ------ | ------ | ------- |
| 1. Prerequisite Validation | 4           |        |        |         |
| 2. Action Extraction       | 2           |        |        |         |
| 3. ActionPanel UI          | 3           |        |        |         |
| 4. Multi-Step Flow         | 4           |        |        |         |
| 5. Quick Combat & NPC      | 3           |        |        |         |
| 6. Integration             | 2           |        |        |         |
| 7. Edge Cases              | 3           |        |        |         |
| **TOTAL**                  | **21**      |        |        |         |

---

## Defects Found

| ID  | Severity | Description | Status |
| --- | -------- | ----------- | ------ |
|     |          |             |        |

---

## Sign-Off

| Role      | Name | Date | Signature |
| --------- | ---- | ---- | --------- |
| Tester    |      |      |           |
| Developer |      |      |           |

---

## Appendix A: Character Setup Scripts

### Creating Armed Fighter via API

```bash
# Example character with weapons
POST /api/characters
{
  "name": "Armed Fighter",
  "editionCode": "sr5",
  "weapons": [
    {
      "id": "ares-predator",
      "name": "Ares Predator V",
      "category": "firearms",
      "subcategory": "heavy-pistol",
      "damage": "8P",
      "mode": ["SA"]
    },
    {
      "id": "combat-knife",
      "name": "Combat Knife",
      "category": "melee",
      "subcategory": "melee",
      "damage": "STR+2",
      "reach": 0
    }
  ],
  "attributes": {
    "agility": 5,
    "reaction": 4,
    "intuition": 4
  },
  "skills": {
    "pistols": 4,
    "blades": 3
  }
}
```

### Creating Unarmed Mundane

```bash
POST /api/characters
{
  "name": "Unarmed Mundane",
  "editionCode": "sr5",
  "weapons": [],
  "magicalPath": null,
  "attributes": {
    "agility": 3,
    "reaction": 3,
    "intuition": 3
  }
}
```

---

## Appendix B: Troubleshooting

### Common Issues

| Issue                          | Cause                     | Solution                                              |
| ------------------------------ | ------------------------- | ----------------------------------------------------- |
| No actions displayed           | Ruleset not loaded        | Check `/api/rulesets/sr5` response                    |
| All actions unavailable        | Character has no weapons  | Add weapons to character                              |
| JSON parse error on NPC delete | Missing DELETE endpoint   | Verify route exists at `participants/[participantId]` |
| Target selector empty          | No NPCs in combat         | Add NPCs via Quick NPC Panel                          |
| Dice pool shows 0              | Missing skills/attributes | Check character data                                  |
