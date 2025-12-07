# Beta Implementation Plan

## Overview

**Goal:** Richer GM Tools + Sourcebook Support
**Timeline:** 6-9 months post-MVP
**Prerequisites:** MVP character creation ~95% complete (current state)

This document breaks down the Beta phase into actionable implementation phases with specific tasks, dependencies, and acceptance criteria.

---

## Phase Summary

| Phase | Focus Area | Duration | Priority |
|-------|-----------|----------|----------|
| B1 | Cyberware/Bioware System | 2-3 weeks | High |
| B2 | Sourcebook Integration | 2 weeks | High |
| B3 | Inventory Management | 1-2 weeks | High |
| B4 | Combat Tracker | 3-4 weeks | High |
| B5 | Adept Powers System | 1-2 weeks | Medium |
| B6 | Spell Management | 1-2 weeks | Medium |
| B7 | Complex Forms & Matrix | 1-2 weeks | Medium |
| B8 | Mobile Responsiveness | 1 week | Medium |
| B9 | Session Persistence & WebSockets | 2-3 weeks | Medium |

---

## Phase B1: Cyberware/Bioware System

**Objective:** Full augmentation system with essence tracking, capacity, and grades.

### B1.1 Data Structure Updates

**Files to modify:**
- `/lib/types/character.ts`
- `/lib/types/edition.ts`
- `/data/editions/sr5/core-rulebook.json`

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

**Files to modify:**
- `/lib/rules/RulesetContext.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B1.2.1 | Add `useCyberware()` hook returning filtered cyberware catalog | Complete |
| B1.2.2 | Add `useBioware()` hook returning filtered bioware catalog | Complete |
| B1.2.3 | Add `useAugmentationRules()` hook for essence limits, capacity rules | Complete |
| B1.2.4 | Add essence calculation utilities | Complete |

### B1.3 Character Creation Step

**Files to create:**
- `/app/characters/create/components/steps/AugmentationsStep.tsx`

**Files to modify:**
- `/app/characters/create/components/CreationWizard.tsx`
- `/lib/types/creation.ts`

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

**Files to modify:**
- `/app/characters/create/components/steps/ReviewStep.tsx`
- `/lib/types/character.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B1.4.1 | Update derived stats calculation to include augmentation bonuses | Complete |
| B1.4.2 | Calculate Social Limit with reduced Essence | Complete |
| B1.4.3 | Calculate Overflow with augmentation Body bonuses | Complete |
| B1.4.4 | Display augmentation-modified attributes clearly | Complete |

### B1.5 Acceptance Criteria

- [x] User can browse cyberware/bioware catalog with filters
- [x] Essence cost correctly calculated with grade multipliers
- [x] Magic/Resonance automatically reduced when essence drops
- [x] Capacity system works for modular cyberware
- [x] Availability validation prevents >12 items at creation
- [x] Nuyen budget properly deducted
- [x] Augmentation bonuses apply to derived stats
- [x] No augmentation bonus exceeds +4 per attribute

---

## Phase B2: Sourcebook Integration

**Objective:** Enable Run Faster and Street Grimoire content with proper merging.

### B2.1 Run Faster Sourcebook

**Files to create:**
- `/data/editions/sr5/run-faster.json`

**Content to include:**

| Module | Content | Priority |
|--------|---------|----------|
| metatypes | Metavariants (Nocturna, Satyr, Ogre, etc.) | High |
| qualities | New positive/negative qualities (~40) | High |
| lifestyles | Lifestyle options and qualities | Medium |
| creationMethods | Life Modules, Sum-to-Ten, Karma Point-Buy | Medium |
| skills | New knowledge skill categories | Low |

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B2.1.1 | Create run-faster.json skeleton with meta and modules structure | Not Started |
| B2.1.2 | Add metavariants with racial modifiers and costs | Not Started |
| B2.1.3 | Add Run Faster qualities with karma costs | Not Started |
| B2.1.4 | Add Life Modules creation method definition | Not Started |
| B2.1.5 | Add Sum-to-Ten variant rules | Not Started |
| B2.1.6 | Add Karma Point-Buy method (850 Karma) | Not Started |
| B2.1.7 | Add lifestyle qualities and options | Not Started |

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

### B2.2 Street Grimoire Sourcebook

**Files to create:**
- `/data/editions/sr5/street-grimoire.json`

**Content to include:**

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
| B2.2.1 | Create street-grimoire.json skeleton | Not Started |
| B2.2.2 | Add new spells by category (Combat, Detection, Health, Illusion, Manipulation) | Not Started |
| B2.2.3 | Add magical traditions (Black Magic, Chaos, Shinto, etc.) | Not Started |
| B2.2.4 | Add mentor spirits catalog with bonuses/drawbacks | Not Started |
| B2.2.5 | Add ritual spellcasting rules | Not Started |
| B2.2.6 | Add new adept powers | Not Started |
| B2.2.7 | Add magic-related qualities | Not Started |

### B2.3 Sourcebook Selection UI

**Files to create:**
- `/app/characters/create/components/SourcebookSelector.tsx`

**Files to modify:**
- `/app/characters/create/page.tsx`
- `/lib/types/creation.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B2.3.1 | Create SourcebookSelector component with checkbox list | Not Started |
| B2.3.2 | Display sourcebook metadata (name, description, content summary) | Not Started |
| B2.3.3 | Store enabled sourcebooks in CreationState | Not Started |
| B2.3.4 | Pass sourcebook selection to ruleset loader | Not Started |
| B2.3.5 | Update ruleset merge to include only selected sourcebooks | Not Started |

### B2.4 Merge Algorithm Testing

**Files to create:**
- `/lib/rules/__tests__/merge.test.ts` (when testing framework added)

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B2.4.1 | Test append merge strategy with metavariants | Not Started |
| B2.4.2 | Test merge strategy with conflicting quality IDs | Not Started |
| B2.4.3 | Test replace strategy for creation method overrides | Not Started |
| B2.4.4 | Verify merge order (core → Run Faster → Street Grimoire) | Not Started |
| B2.4.5 | Document any ID conflicts and resolutions | Not Started |

### B2.5 Acceptance Criteria

- [ ] Run Faster sourcebook loads without errors
- [ ] Street Grimoire sourcebook loads without errors
- [ ] Metavariants appear in metatype selection when Run Faster enabled
- [ ] New spells appear in spell selection when Street Grimoire enabled
- [ ] Sourcebook selection persists across wizard navigation
- [ ] Merge conflicts handled gracefully with clear error messages
- [ ] Character records which sourcebooks were used

---

## Phase B3: Inventory Management

**Objective:** Full post-creation gear management with tracking.

### B3.1 Data Structure Updates

**Files to modify:**
- `/lib/types/character.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B3.1.1 | Add InventoryItem interface with condition tracking | Not Started |
| B3.1.2 | Add Inventory interface with capacity/weight calculations | Not Started |
| B3.1.3 | Add EquipmentSlot enum for equipped items | Not Started |
| B3.1.4 | Add AmmoTracker type for ammunition management | Not Started |
| B3.1.5 | Update Character.gear to use new Inventory structure | Not Started |

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

### B3.2 API Endpoints

**Files to create:**
- `/app/api/characters/[characterId]/inventory/route.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B3.2.1 | GET - Retrieve character inventory | Not Started |
| B3.2.2 | POST - Add item to inventory | Not Started |
| B3.2.3 | PUT - Update item (quantity, condition, equipped) | Not Started |
| B3.2.4 | DELETE - Remove item from inventory | Not Started |
| B3.2.5 | POST /reload - Reload weapon ammunition | Not Started |
| B3.2.6 | POST /fire - Expend ammunition | Not Started |

### B3.3 Storage Layer

**Files to modify:**
- `/lib/storage/characters.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B3.3.1 | Add addInventoryItem function | Not Started |
| B3.3.2 | Add removeInventoryItem function | Not Started |
| B3.3.3 | Add updateInventoryItem function | Not Started |
| B3.3.4 | Add calculateEncumbrance utility | Not Started |
| B3.3.5 | Add transferItem between characters (future: party loot) | Not Started |

### B3.4 Inventory UI

**Files to create:**
- `/app/characters/[characterId]/inventory/page.tsx`
- `/components/inventory/InventoryList.tsx`
- `/components/inventory/InventoryItemCard.tsx`
- `/components/inventory/AddItemModal.tsx`
- `/components/inventory/AmmoTracker.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B3.4.1 | Create inventory page with gear list | Not Started |
| B3.4.2 | Create InventoryList with sorting/filtering | Not Started |
| B3.4.3 | Create InventoryItemCard with quick actions | Not Started |
| B3.4.4 | Create AddItemModal with catalog search | Not Started |
| B3.4.5 | Create AmmoTracker for quick reloading | Not Started |
| B3.4.6 | Add drag-and-drop reordering | Not Started |
| B3.4.7 | Add equipment slots visual (what's equipped where) | Not Started |

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

### B3.5 Acceptance Criteria

- [ ] User can view full inventory list
- [ ] User can add items from gear catalog
- [ ] User can remove items from inventory
- [ ] User can track ammunition with reload/fire actions
- [ ] Encumbrance calculated correctly based on STR
- [ ] Item condition can be updated
- [ ] Equipped items displayed prominently
- [ ] Nuyen balance tracked separately

---

## Phase B4: Combat Tracker

**Objective:** Full combat encounter management with initiative, turns, and damage.

### B4.1 Data Structures

**Files to create:**
- `/lib/types/combat.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B4.1.1 | Create CombatSession interface | Not Started |
| B4.1.2 | Create Combatant interface (character or NPC) | Not Started |
| B4.1.3 | Create Initiative interface with pass tracking | Not Started |
| B4.1.4 | Create CombatAction interface | Not Started |
| B4.1.5 | Create CombatRound interface with phase tracking | Not Started |
| B4.1.6 | Create CombatLog for history | Not Started |

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
  initiativeOrder: Initiative[];
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

interface Initiative {
  combatantId: string;
  baseInitiative: number;  // REA + INT + bonuses
  roll: number;            // Dice result
  total: number;           // base + roll
  passes: number;          // Number of passes this combatant gets
  currentPass: number;     // Which pass they're on
}
```

### B4.2 Storage Layer

**Files to create:**
- `/lib/storage/combat.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B4.2.1 | createCombatSession function | Not Started |
| B4.2.2 | getCombatSession function | Not Started |
| B4.2.3 | updateCombatSession function | Not Started |
| B4.2.4 | deleteCombatSession function | Not Started |
| B4.2.5 | addCombatant function | Not Started |
| B4.2.6 | removeCombatant function | Not Started |
| B4.2.7 | logCombatAction function | Not Started |

### B4.3 API Endpoints

**Files to create:**
- `/app/api/combat/route.ts`
- `/app/api/combat/[sessionId]/route.ts`
- `/app/api/combat/[sessionId]/initiative/route.ts`
- `/app/api/combat/[sessionId]/turn/route.ts`
- `/app/api/combat/[sessionId]/action/route.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B4.3.1 | POST /combat - Create new combat session | Not Started |
| B4.3.2 | GET /combat - List active combat sessions | Not Started |
| B4.3.3 | GET /combat/[id] - Get combat session details | Not Started |
| B4.3.4 | PUT /combat/[id] - Update session (pause, resume, complete) | Not Started |
| B4.3.5 | DELETE /combat/[id] - Delete combat session | Not Started |
| B4.3.6 | POST /combat/[id]/initiative - Roll initiative for all | Not Started |
| B4.3.7 | POST /combat/[id]/turn/next - Advance to next turn | Not Started |
| B4.3.8 | POST /combat/[id]/turn/delay - Delay current turn | Not Started |
| B4.3.9 | POST /combat/[id]/action - Log an action (attack, defend, etc.) | Not Started |
| B4.3.10 | POST /combat/[id]/damage - Apply damage to combatant | Not Started |

### B4.4 Combat UI

**Files to create:**
- `/app/combat/page.tsx` (combat session list)
- `/app/combat/[sessionId]/page.tsx` (active combat tracker)
- `/components/combat/InitiativeTracker.tsx`
- `/components/combat/CombatantCard.tsx`
- `/components/combat/ActionPanel.tsx`
- `/components/combat/DamageModal.tsx`
- `/components/combat/CombatLog.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B4.4.1 | Create combat session list page | Not Started |
| B4.4.2 | Create new combat session form | Not Started |
| B4.4.3 | Create InitiativeTracker with turn order display | Not Started |
| B4.4.4 | Create CombatantCard with health bars | Not Started |
| B4.4.5 | Create ActionPanel for current turn actions | Not Started |
| B4.4.6 | Create DamageModal for applying damage | Not Started |
| B4.4.7 | Create CombatLog showing action history | Not Started |
| B4.4.8 | Add condition management (prone, suppressed, etc.) | Not Started |
| B4.4.9 | Add round/pass counter display | Not Started |
| B4.4.10 | Integrate DiceRoller component for rolls | Not Started |

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

### B4.5 Initiative System

**SR5 Initiative Rules:**
- Base Initiative = Reaction + Intuition + modifiers
- Initiative Dice = 1d6 + bonus dice (cyberware, drugs, magic)
- Initiative Score = Base + dice roll
- Multiple passes: Score > 10 gets extra pass, > 20 gets third pass, etc.
- Each pass deducts 10 from score until score ≤ 0

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B4.5.1 | Calculate base initiative from attributes | Not Started |
| B4.5.2 | Calculate initiative dice from bonuses | Not Started |
| B4.5.3 | Implement multi-pass system (score - 10 each pass) | Not Started |
| B4.5.4 | Handle initiative ties (higher REA + INT wins) | Not Started |
| B4.5.5 | Support delayed actions | Not Started |
| B4.5.6 | Support interrupt actions (-5 to -10 initiative) | Not Started |

### B4.6 Acceptance Criteria

- [ ] GM can create new combat session
- [ ] GM can add player characters and NPCs
- [ ] Initiative rolls correctly with all modifiers
- [ ] Turn order displays correctly with multiple passes
- [ ] Current turn clearly indicated
- [ ] Damage can be applied with proper track handling
- [ ] Combat log records all actions
- [ ] Session can be paused and resumed
- [ ] Conditions affect relevant rolls

---

## Phase B5: Adept Powers System

**Objective:** Complete adept character support with power point allocation.

### B5.1 Data Structure Updates

**Files to modify:**
- `/data/editions/sr5/core-rulebook.json`
- `/lib/types/character.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B5.1.1 | Create comprehensive adept powers catalog (~50 powers) | Not Started |
| B5.1.2 | Add AdeptPower interface with levels, prerequisites | Not Started |
| B5.1.3 | Add power point pool calculation to Character | Not Started |
| B5.1.4 | Add mystic adept power point purchase tracking | Not Started |

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

### B5.2 Creation Step Updates

**Files to modify:**
- `/app/characters/create/components/steps/MagicStep.tsx`
- `/app/characters/create/components/steps/KarmaStep.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B5.2.1 | Add AdeptPowerSelector sub-component | Not Started |
| B5.2.2 | Display power point pool (= Magic rating) | Not Started |
| B5.2.3 | Track spent power points with real-time display | Not Started |
| B5.2.4 | Handle power levels with fractional costs | Not Started |
| B5.2.5 | Enforce prerequisites between powers | Not Started |
| B5.2.6 | For mystic adepts: implement PP purchase (5 Karma = 1 PP) | Not Started |
| B5.2.7 | Display power effects in selection UI | Not Started |

### B5.3 Acceptance Criteria

- [ ] Adept powers catalog fully populated
- [ ] Power point pool calculated correctly
- [ ] Powers with levels correctly cost per level
- [ ] Prerequisites enforced
- [ ] Mystic adepts can purchase PP with Karma
- [ ] Power effects clearly displayed
- [ ] Selected powers apply to derived stats

---

## Phase B6: Spell Management

**Objective:** Enhanced spell system with traditions, rituals, and mentor spirits.

### B6.1 Tradition System

**Files to modify:**
- `/data/editions/sr5/core-rulebook.json`
- `/lib/types/character.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B6.1.1 | Add Tradition interface with drain attributes | Not Started |
| B6.1.2 | Create traditions catalog (Hermetic, Shamanic, etc.) | Not Started |
| B6.1.3 | Map traditions to spirit types | Not Started |
| B6.1.4 | Add tradition selection to character creation | Not Started |
| B6.1.5 | Calculate drain resistance based on tradition | Not Started |

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

### B6.2 Mentor Spirits

**Files to modify:**
- `/data/editions/sr5/core-rulebook.json`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B6.2.1 | Create mentor spirits catalog (~15 spirits) | Not Started |
| B6.2.2 | Add MentorSpirit interface with bonuses/drawbacks | Not Started |
| B6.2.3 | Add mentor spirit selection to character creation | Not Started |
| B6.2.4 | Apply mentor bonuses to spell/skill calculations | Not Started |

### B6.3 Ritual Magic

**Files to create:**
- `/components/magic/RitualSelector.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B6.3.1 | Add ritual spells to spell catalog | Not Started |
| B6.3.2 | Create RitualSelector for ritual-capable characters | Not Started |
| B6.3.3 | Track ritual materials and reagent costs | Not Started |
| B6.3.4 | Add ritual teamwork rules | Not Started |

### B6.4 Acceptance Criteria

- [ ] Traditions affect drain resistance calculation
- [ ] Mentor spirits provide correct bonuses
- [ ] Ritual spells distinguished from standard spells
- [ ] Drain calculated correctly per tradition

---

## Phase B7: Complex Forms & Matrix

**Objective:** Enhanced technomancer support with full complex forms catalog.

### B7.1 Complex Forms Catalog

**Files to modify:**
- `/data/editions/sr5/core-rulebook.json`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B7.1.1 | Expand complex forms catalog (~30 forms) | Not Started |
| B7.1.2 | Add ComplexForm interface with fading values | Not Started |
| B7.1.3 | Categorize forms (attack, sleaze, data processing, firewall) | Not Started |
| B7.1.4 | Add threading rules | Not Started |

### B7.2 Living Persona

**Files to modify:**
- `/app/characters/create/components/steps/ReviewStep.tsx`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B7.2.1 | Calculate Living Persona stats for technomancers | Not Started |
| B7.2.2 | Display Matrix attributes (Attack, Sleaze, Data Processing, Firewall) | Not Started |
| B7.2.3 | Calculate Matrix Initiative (Data Processing + Intuition + 4d6) | Not Started |

### B7.3 Acceptance Criteria

- [ ] Complete complex forms catalog available
- [ ] Fading values correctly displayed
- [ ] Living Persona calculated for technomancers
- [ ] Matrix Initiative calculated correctly

---

## Phase B8: Mobile Responsiveness

**Objective:** Ensure full mobile usability across all features.

### B8.1 Audit & Testing

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B8.1.1 | Test all creation wizard steps on mobile viewport | Not Started |
| B8.1.2 | Test character sheet on mobile | Not Started |
| B8.1.3 | Test combat tracker on mobile | Not Started |
| B8.1.4 | Test inventory management on mobile | Not Started |
| B8.1.5 | Document specific mobile issues | Not Started |

### B8.2 UI Fixes

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B8.2.1 | Convert fixed-width tables to responsive layouts | Not Started |
| B8.2.2 | Add touch-friendly tap targets (minimum 44px) | Not Started |
| B8.2.3 | Implement collapsible sections for dense content | Not Started |
| B8.2.4 | Add swipe gestures for navigation | Not Started |
| B8.2.5 | Optimize dice roller for touch interaction | Not Started |
| B8.2.6 | Add bottom navigation for key actions | Not Started |

### B8.3 Acceptance Criteria

- [ ] All pages usable on 375px viewport
- [ ] Touch targets meet accessibility guidelines
- [ ] No horizontal scrolling on mobile
- [ ] Text readable without zooming

---

## Phase B9: Session Persistence & WebSockets

**Objective:** Real-time multiplayer support for combat and sessions.

### B9.1 WebSocket Infrastructure

**Files to create:**
- `/lib/websocket/server.ts`
- `/lib/websocket/client.ts`
- `/lib/websocket/events.ts`

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B9.1.1 | Evaluate WebSocket library (Socket.io vs ws vs Pusher) | Not Started |
| B9.1.2 | Implement WebSocket server integration with Next.js | Not Started |
| B9.1.3 | Create event types for combat updates | Not Started |
| B9.1.4 | Create event types for dice roll broadcasts | Not Started |
| B9.1.5 | Implement client-side WebSocket hook | Not Started |

### B9.2 Combat Session Sharing

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B9.2.1 | Broadcast initiative changes to all participants | Not Started |
| B9.2.2 | Broadcast damage/healing updates | Not Started |
| B9.2.3 | Broadcast turn changes | Not Started |
| B9.2.4 | Handle participant join/leave | Not Started |
| B9.2.5 | Implement GM-only actions vs player-visible actions | Not Started |

### B9.3 Session State Management

**Tasks:**

| Task | Description | Status |
|------|-------------|--------|
| B9.3.1 | Create session join flow with invite codes | Not Started |
| B9.3.2 | Persist session state across reconnections | Not Started |
| B9.3.3 | Handle conflict resolution for concurrent updates | Not Started |
| B9.3.4 | Add session recovery for disconnections | Not Started |

### B9.4 Acceptance Criteria

- [ ] Multiple users can view same combat session
- [ ] Updates appear in real-time for all participants
- [ ] Disconnected users can rejoin and sync state
- [ ] GM actions properly authorized

---

## Dependencies & Prerequisites

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

| Metric | Target | Measurement |
|--------|--------|-------------|
| Cyberware items available | 50+ | Count in catalog |
| Sourcebook integration | 2 books | Run Faster + Street Grimoire |
| Combat sessions created | 100 | Analytics |
| Mobile usability score | 90+ | Lighthouse audit |
| WebSocket latency | <100ms | Performance monitoring |

---

## Appendix A: File Locations Quick Reference

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
└── events.ts

/app/api/combat/
├── route.ts
└── [sessionId]/
    ├── route.ts
    ├── initiative/route.ts
    ├── turn/route.ts
    └── action/route.ts

/app/combat/
├── page.tsx
└── [sessionId]/page.tsx

/app/characters/[characterId]/inventory/
└── page.tsx

/app/characters/create/components/steps/
└── AugmentationsStep.tsx

/components/combat/
├── InitiativeTracker.tsx
├── CombatantCard.tsx
├── ActionPanel.tsx
├── DamageModal.tsx
└── CombatLog.tsx

/components/inventory/
├── InventoryList.tsx
├── InventoryItemCard.tsx
├── AddItemModal.tsx
└── AmmoTracker.tsx

/components/magic/
└── RitualSelector.tsx
```

### Files to Modify

```
/lib/types/character.ts        # Add inventory, augmentation types
/lib/types/edition.ts          # Add new module types
/lib/types/creation.ts         # Add sourcebook selection
/lib/rules/RulesetContext.tsx  # Add new hooks
/lib/storage/characters.ts     # Add inventory functions
/data/editions/sr5/core-rulebook.json  # Expand catalogs
/app/characters/create/components/CreationWizard.tsx  # Add AugmentationsStep
```
