# Character Sheet Creation Mode - UI Mocks

This document captures UI exploration for a character-sheet-driven creation approach.
The goal is to bring the pen-and-paper nature of RPGs into an online experience,
where the character sheet is the primary interface for both creation and gameplay.

> **Status:** Exploratory design - not yet implemented
> **Last Updated:** 2026-01-01

---

## Table of Contents

1. [Design Decisions](#design-decisions)
2. [Priority Selection Component](#priority-selection-component)
3. [Metatype Selection](#metatype-selection)
4. [Magic/Resonance Selection](#magicresonance-selection)
5. [Magician Path Modal](#magician-path-modal)
6. [Attributes Component](#attributes-component)
7. [Skills Component](#skills-component)
8. [Spells Component](#spells-component)
9. [Adept Powers Component](#adept-powers-component)
10. [Qualities Component](#qualities-component)
11. [Gear Component](#gear-component)
12. [Purchase Components Summary](#purchase-components-summary)
13. [State Indicators](#state-indicators)
14. [Open Questions](#open-questions)

---

## Design Decisions

Decisions made during design exploration:

### Priority Component

| Question                                              | Decision                                                                          |
| ----------------------------------------------------- | --------------------------------------------------------------------------------- |
| Where does this component live?                       | Top left, first component on the sheet                                            |
| What triggers when priority changes?                  | Validation warnings shown; overspent points convert to karma per creation rules   |
| How to handle invalid metatype after priority change? | Validation error explaining required priority (e.g., "Dwarf requires Priority C") |
| Default vs. blank state?                              | Default A-B-C-D-E order, but no metatype or magic/resonance selection made        |
| Show priority impact downstream?                      | Yes, e.g., "20 points (from Priority B)" in Attributes section                    |

### Interaction Patterns

| Pattern                                    | Decision                                                          |
| ------------------------------------------ | ----------------------------------------------------------------- |
| Priority changes                           | Not destructive - user can change back quickly                    |
| Drag preview                               | No budget preview while dragging; just trigger validation on drop |
| Undo support                               | Not needed - changes aren't destructive                           |
| Complex selections (metatype, magic path)  | Modals preferred over dropdowns for better detail                 |
| Purchase components (spells, skills, gear) | Header + "Add" button that opens modal with valid options         |

---

## Priority Selection Component

**Location:** Top left of character sheet (first component)
**Approach:** Drag-and-drop rank list with inline selections

### Default State (No Selections Made)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PRIORITIES                                          Drag to reorder ↕      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ A ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  METATYPE                                       ○ Selection needed│    │
│  │    Any metatype • 13 special attribute points                       │    │
│  │    ┌───────────────────────────────────────────────────────────┐    │    │
│  │    │  Choose metatype...                                 [▼]  │    │    │
│  │    └───────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─ B ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  ATTRIBUTES                                             ● Complete│    │
│  │    20 points to distribute                                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─ C ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  MAGIC / RESONANCE                              ○ Selection needed│    │
│  │    Adept, Aspected, or Technomancer • Magic/Resonance 4             │    │
│  │    ┌───────────────────────────────────────────────────────────┐    │    │
│  │    │  Choose path...                                     [▼]  │    │    │
│  │    └───────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─ D ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  SKILLS                                                 ● Complete│    │
│  │    22 skill points • 0 skill group points                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─ E ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  RESOURCES                                              ● Complete│    │
│  │    6,000¥ starting nuyen                                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Validation Error State (After Invalid Priority Change)

When Elf is selected at Priority A, then Metatype is dragged to Priority E:

```
┌─ E ─────────────────────────────────────────────────────────────────────────┐
│ ≡  METATYPE                                                     ⚠ Conflict │
│                                                                             │
│    ┌─────────────────────────────────────────────────────────────────────┐  │
│    │  ELF                                                     ⚠  [▼]   │  │
│    └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│    ⚠ Elf requires Priority D or higher for metatype                        │
│                                                                             │
│    Available at Priority E: Human only                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Budget Overspend Handling

When attributes are fully spent (20 points at Priority B), then Attributes priority changes to E (12 points):

- The 8 overspent points are automatically converted to karma spend
- The Attributes section shows the karma conversion
- No data is lost; user can change priority back

```
┌─ E ─────────────────────────────────────────────────────────────────────────┐
│ ≡  ATTRIBUTES                                                ⚠ Over budget │
│    12 points available (+8 converted to karma)                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Complete State (All Selections Made)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PRIORITIES                                          Drag to reorder ↕      │
│                                                     All selections complete │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ A ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  METATYPE                                               ● Complete│    │
│  │    ELF • 8 special attribute points • Low-Light Vision              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─ B ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  ATTRIBUTES                                             ● Complete│    │
│  │    20 points to distribute                                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─ C ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  MAGIC / RESONANCE                                      ● Complete│    │
│  │    ADEPT • Magic 4 • 4 Power Points                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─ D ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  SKILLS                                                 ● Complete│    │
│  │    22 skill points • 0 skill group points                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─ E ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  RESOURCES                                              ● Complete│    │
│  │    6,000¥ starting nuyen                                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ BUDGETS UNLOCKED                                                            │
│                                                                             │
│  Attribute Points     20      Special Attributes    8                       │
│  Skill Points         22      Skill Group Points    0                       │
│  Starting Nuyen    6,000¥     Power Points          4                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Metatype Selection

Metatype selection opens a modal when clicked (preferred over dropdown for complex options).

### Trigger State (No Selection)

```
│  ┌─ A ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  METATYPE                                       ○ Selection needed│    │
│  │    Any metatype • 13 special attribute points                       │    │
│  │    ┌───────────────────────────────────────────────────────────┐    │    │
│  │    │  Choose metatype...                              [Select] │    │    │
│  │    └───────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
```

### Metatype Selection Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SELECT METATYPE                                                        [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Available at Priority A: All metatypes                                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  ○  HUMAN                                                           │    │
│  │     ─────────────────────────────────────────────────────────────   │    │
│  │     Adaptable and ambitious, humans are the most common metatype    │    │
│  │     in the Sixth World. Their versatility makes them suited to      │    │
│  │     any role.                                                       │    │
│  │                                                                     │    │
│  │     Special Attribute Points: 9                                     │    │
│  │     Racial Traits: None                                             │    │
│  │                                                                     │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │                                                                     │    │
│  │  ○  ELF                                                             │    │
│  │     ─────────────────────────────────────────────────────────────   │    │
│  │     Graceful and long-lived, elves are known for their keen senses  │    │
│  │     and natural charisma. Many gravitate toward social or           │    │
│  │     magical roles.                                                  │    │
│  │                                                                     │    │
│  │     Special Attribute Points: 8                                     │    │
│  │     Racial Traits: Low-Light Vision                                 │    │
│  │                                                                     │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │                                                                     │    │
│  │  ○  DWARF                                                           │    │
│  │     ─────────────────────────────────────────────────────────────   │    │
│  │     Stout and resilient, dwarves possess natural resistance to      │    │
│  │     toxins and magic. Their determination is legendary.             │    │
│  │                                                                     │    │
│  │     Special Attribute Points: 11                                    │    │
│  │     Racial Traits: Thermographic Vision, +2 dice vs toxins/disease  │    │
│  │                                                                     │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │                                                                     │    │
│  │  ○  ORK                                                             │    │
│  │     ─────────────────────────────────────────────────────────────   │    │
│  │     Strong and tough, orks mature quickly and often form tight-knit │    │
│  │     communities. They excel in physical confrontations.             │    │
│  │                                                                     │    │
│  │     Special Attribute Points: 12                                    │    │
│  │     Racial Traits: Low-Light Vision                                 │    │
│  │                                                                     │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │                                                                     │    │
│  │  ○  TROLL                                                           │    │
│  │     ─────────────────────────────────────────────────────────────   │    │
│  │     Massive and powerful, trolls possess natural dermal armor and   │    │
│  │     extended reach. Their size commands respect and fear.           │    │
│  │                                                                     │    │
│  │     Special Attribute Points: 10                                    │    │
│  │     Racial Traits: Thermographic Vision, +1 Reach, +1 Dermal Armor  │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                              [Cancel]        [Confirm]      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Selected State (Elf)

After selection, the priority card shows summary without attribute ranges
(attribute min/max is applied to the Attributes component):

```
│  ┌─ A ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  METATYPE                                               ● Complete│    │
│  │                                                                     │    │
│  │    ┌───────────────────────────────────────────────────────────┐    │    │
│  │    │  ELF                                              [Change] │    │    │
│  │    └───────────────────────────────────────────────────────────┘    │    │
│  │                                                                     │    │
│  │    Special Attribute Points: 8                                      │    │
│  │                                                                     │    │
│  │    Racial Traits                                                    │    │
│  │    └─ Low-Light Vision                                              │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
```

---

## Magic/Resonance Selection

Magic/Resonance selection opens a modal. Some paths require additional selections
(e.g., Magician requires Tradition).

### Trigger State (No Selection)

```
│  ┌─ C ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  MAGIC / RESONANCE                              ○ Selection needed│    │
│  │    Adept, Aspected, Magician, or Technomancer available             │    │
│  │    ┌───────────────────────────────────────────────────────────┐    │    │
│  │    │  Choose path...                                   [Select] │    │    │
│  │    └───────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
```

### Auto-Selected State (Priority E - Mundane Only)

When Magic/Resonance is at Priority E, only Mundane is available.
No modal is shown - selection is automatic:

```
│  ┌─ E ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  MAGIC / RESONANCE                                      ● Complete│    │
│  │                                                                     │    │
│  │    ┌───────────────────────────────────────────────────────────┐    │    │
│  │    │  MUNDANE                                           (auto) │    │    │
│  │    └───────────────────────────────────────────────────────────┘    │    │
│  │                                                                     │    │
│  │    No magical or resonance abilities available at Priority E.       │    │
│  │    Move Magic/Resonance to a higher priority for awakened options.  │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
```

### Path Selection Modal

All available paths shown in the modal, including Mundane.
A selection must be made - there is no "cancel without choosing" option.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SELECT MAGICAL PATH                                                    [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Available at Priority C                                                    │
│                                                                             │
│  ┌─ AWAKENED ───────────────────────────────────────────────────────────┐   │
│  │                                                                       │   │
│  │  ○  MAGICIAN                                              Magic 3    │   │
│  │      Full spellcaster with summoning and enchanting                  │   │
│  │      5 spells • Requires tradition selection                         │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  MYSTIC ADEPT                                          Magic 3    │   │
│  │      Blend of adept powers and spellcasting                          │   │
│  │      Split Magic between powers and spells • Requires tradition      │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ●  ADEPT                                                 Magic 4    │   │
│  │      Physical magic channeled through the body                       │   │
│  │      4 Power Points • No spells • No tradition needed                │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  ASPECTED MAGICIAN                                     Magic 3    │   │
│  │      Specialist in one magical discipline only                       │   │
│  │      Choose: Sorcery, Conjuring, or Enchanting                       │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ EMERGED ────────────────────────────────────────────────────────────┐   │
│  │                                                                       │   │
│  │  ○  TECHNOMANCER                                       Resonance 3   │   │
│  │      Living interface with the Matrix                                │   │
│  │      3 complex forms • Compile sprites • Living Persona              │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ MUNDANE ────────────────────────────────────────────────────────────┐   │
│  │                                                                       │   │
│  │  ○  NO MAGICAL ABILITIES                                              │   │
│  │      Focus your build on physical, technical, or social strengths   │   │
│  │      No essence concerns for cyberware or bioware                    │   │
│  │      Street Samurai, Rigger, Decker, Face archetypes                 │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                              [Confirm]      │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Close behavior:** Clicking [X] without a selection closes the modal. The priority card
shows a validation warning indicating a selection is needed. The user can reopen to complete.

### Selected State (Adept - Complete)

```
│  ┌─ C ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  MAGIC / RESONANCE                                      ● Complete│    │
│  │                                                                     │    │
│  │    ┌───────────────────────────────────────────────────────────┐    │    │
│  │    │  ADEPT                                             [Change] │    │    │
│  │    └───────────────────────────────────────────────────────────┘    │    │
│  │                                                                     │    │
│  │    Magic Rating: 4                                                  │    │
│  │    Power Points: 4.0 PP                                             │    │
│  │                                                                     │    │
│  │    Abilities                                                        │    │
│  │    ├─ Physical magic channeled through the body                     │    │
│  │    ├─ Adept Powers section unlocked                                 │    │
│  │    └─ Essence loss reduces Magic (and Power Points)                 │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
```

### Selected State (Mundane - Complete)

```
│  ┌─ C ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  MAGIC / RESONANCE                                      ● Complete│    │
│  │                                                                     │    │
│  │    ┌───────────────────────────────────────────────────────────┐    │    │
│  │    │  MUNDANE                                           [Change] │    │    │
│  │    └───────────────────────────────────────────────────────────┘    │    │
│  │                                                                     │    │
│  │    No magical or resonance abilities.                               │    │
│  │                                                                     │    │
│  │    Build Focus                                                      │    │
│  │    ├─ Physical, technical, or social specialization                 │    │
│  │    ├─ Cyberware/bioware without essence concerns for magic          │    │
│  │    └─ Full priority points available for other categories           │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
```

### Validation Warning State (Modal Closed Without Selection)

If user opens modal but closes with [X] without making a selection:

```
│  ┌─ C ─────────────────────────────────────────────────────────────────┐    │
│  │ ≡  MAGIC / RESONANCE                              ⚠ Selection needed│    │
│  │                                                                     │    │
│  │    ┌───────────────────────────────────────────────────────────┐    │    │
│  │    │  No path selected                                 [Select] │    │    │
│  │    └───────────────────────────────────────────────────────────┘    │    │
│  │                                                                     │    │
│  │    ⚠ A magical path must be selected to continue                   │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
```

---

## Magician Path Modal

When Magician (or Mystic Adept) is selected, additional configuration is required.
Using Option A: Single-page modal with all selections visible.

### Single-Page Modal

All selections on one scrollable page:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ MAGICIAN PATH CONFIGURATION                                            [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ PATH ───────────────────────────────────────────────────────────────┐   │
│  │                                                                       │   │
│  │  MAGICIAN                                                 Magic 3    │   │
│  │  Full spellcaster with summoning and enchanting                      │   │
│  │  5 free spells • All magical skills available                        │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ TRADITION ────────────────────────────────────── ○ Required ────────┐   │
│  │                                                                       │   │
│  │  Your tradition determines how you perceive and interact with magic. │   │
│  │  It affects your drain resistance and the types of spirits you can   │   │
│  │  summon.                                                              │   │
│  │                                                                       │   │
│  │  ○  HERMETIC                                                          │   │
│  │      Scientific approach to magic through formulae and study         │   │
│  │      Drain: LOG + WIL                                                 │   │
│  │      Spirits: Fire, Earth, Water, Air, Man                           │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  SHAMANIC                                                          │   │
│  │      Spiritual connection to the natural world and its denizens      │   │
│  │      Drain: CHA + WIL                                                 │   │
│  │      Spirits: Beasts, Earth, Air, Water, Man, Guidance               │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  CHAOS MAGIC                                                       │   │
│  │      Belief-based magic drawing power from conviction                │   │
│  │      Drain: INT + WIL                                                 │   │
│  │      Spirits: Fire, Air, Man, Guardian, Task                         │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  BLACK MAGIC                                                       │   │
│  │      Power through domination and dark pacts                         │   │
│  │      Drain: CHA + WIL                                                 │   │
│  │      Spirits: Fire, Air, Water, Man, Guardian, Task                  │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  [Show more traditions...]                                            │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ MENTOR SPIRIT ────────────────────────────────── ○ Optional ────────┐   │
│  │                                                                       │   │
│  │  A mentor spirit provides guidance and bonuses, but also expects     │   │
│  │  certain behaviors from you.                                          │   │
│  │                                                                       │   │
│  │  ┌───────────────────────────────────────────────────────────────┐   │   │
│  │  │  None selected                                     [Choose]   │   │   │
│  │  └───────────────────────────────────────────────────────────────┘   │   │
│  │                                                                       │   │
│  │  Skip mentor spirit selection for now - you can add one later        │   │
│  │  using karma during character creation or after play begins.         │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Tradition must be selected to continue                                     │
│                                              [Cancel]      [Confirm] (dim)  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Option A: After Tradition Selected

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ MAGICIAN PATH CONFIGURATION                                            [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ PATH ───────────────────────────────────────────────────────────────┐   │
│  │                                                                       │   │
│  │  MAGICIAN                                                 Magic 3    │   │
│  │  Full spellcaster with summoning and enchanting                      │   │
│  │  5 free spells • All magical skills available                        │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ TRADITION ──────────────────────────────────────── ● Selected ──────┐   │
│  │                                                                       │   │
│  │  ●  HERMETIC                                               [Change]  │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │      Scientific approach to magic through formulae and study         │   │
│  │                                                                       │   │
│  │      Drain Resistance:  LOG + WIL                                    │   │
│  │      Combat Spirits:    Fire                                         │   │
│  │      Detection Spirits: Air                                          │   │
│  │      Health Spirits:    Man                                          │   │
│  │      Illusion Spirits:  Water                                        │   │
│  │      Manipulation:      Earth                                        │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ MENTOR SPIRIT ────────────────────────────────── ○ Optional ────────┐   │
│  │                                                                       │   │
│  │  ┌───────────────────────────────────────────────────────────────┐   │   │
│  │  │  None selected                                     [Choose]   │   │   │
│  │  └───────────────────────────────────────────────────────────────┘   │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ✓ Ready to confirm                                                         │
│                                              [Cancel]        [Confirm]      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Reopening Modal with Existing Selections

When user clicks [Change] on a configured Magician, the modal reopens with all
current selections pre-filled and changeable:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ MAGICIAN PATH CONFIGURATION                                            [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ PATH ───────────────────────────────────────────────────────────────┐   │
│  │                                                                       │   │
│  │  ●  MAGICIAN                                              Magic 3    │   │
│  │      Full spellcaster with summoning and enchanting                  │   │
│  │      5 free spells • Requires tradition                              │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  MYSTIC ADEPT                                          Magic 3    │   │
│  │      Blend of adept powers and spellcasting                          │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  ADEPT                                                 Magic 4    │   │
│  │      Physical magic channeled through the body                       │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  ASPECTED MAGICIAN                                     Magic 3    │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  TECHNOMANCER                                       Resonance 3   │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  MUNDANE                                                           │   │
│  │      No magical abilities                                            │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ TRADITION ──────────────────────────────────────── ● Selected ──────┐   │
│  │                                                                       │   │
│  │  ●  HERMETIC                                               [Change]  │   │
│  │      Drain: LOG + WIL • Spirits: Fire, Earth, Water, Air, Man        │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ MENTOR SPIRIT ──────────────────────────────────── ● Selected ──────┐   │
│  │                                                                       │   │
│  │  ●  DOG                                                    [Change]  │   │
│  │      Bonus: +2 Detection spells, +2 Tracking                         │   │
│  │      Disadvantage: Cannot abandon allies                             │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ✓ Ready to confirm                                                         │
│                                              [Cancel]        [Confirm]      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dynamic Path Change: Magician → Adept

When user selects a different path, the modal updates dynamically.
Switching from Magician to Adept hides Tradition (not applicable) and updates Magic rating:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ADEPT PATH CONFIGURATION                                               [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ PATH ───────────────────────────────────────────────────────────────┐   │
│  │                                                                       │   │
│  │  ○  MAGICIAN                                              Magic 3    │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  MYSTIC ADEPT                                          Magic 3    │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ●  ADEPT                                                 Magic 4    │   │
│  │      Physical magic channeled through the body                       │   │
│  │      4 Power Points • No spells • No tradition needed                │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  ASPECTED MAGICIAN                                     Magic 3    │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  TECHNOMANCER                                       Resonance 3   │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  MUNDANE                                                           │   │
│  │      No magical abilities                                            │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ MENTOR SPIRIT ──────────────────────────────────── ● Selected ──────┐   │
│  │                                                                       │   │
│  │  ●  DOG                                                    [Change]  │   │
│  │      Bonus: +2 Detection spells, +2 Tracking                         │   │
│  │      Disadvantage: Cannot abandon allies                             │   │
│  │                                                                       │   │
│  │  Note: Adepts can have mentor spirits for roleplay and some bonuses  │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Tradition section hidden (not applicable for Adept)                        │
│  Previous Hermetic selection will be cleared on confirm                     │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ✓ Ready to confirm                                                         │
│                                              [Cancel]        [Confirm]      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dynamic Path Change: Magician → Mundane

Selecting Mundane clears all magical sub-selections (tradition, mentor spirit):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SELECT MAGICAL PATH                                                    [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ PATH ───────────────────────────────────────────────────────────────┐   │
│  │                                                                       │   │
│  │  ○  MAGICIAN                                              Magic 3    │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  MYSTIC ADEPT                                          Magic 3    │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  ADEPT                                                 Magic 4    │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  ASPECTED MAGICIAN                                     Magic 3    │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ○  TECHNOMANCER                                       Resonance 3   │   │
│  │      ───────────────────────────────────────────────────────────     │   │
│  │                                                                       │   │
│  │  ●  MUNDANE                                                           │   │
│  │      No magical abilities                                            │   │
│  │      Focus on physical, technical, or social strengths              │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  ⚠ Selecting Mundane will clear your current configuration:        │    │
│  │                                                                     │    │
│  │     • Tradition: Hermetic → (cleared)                               │    │
│  │     • Mentor Spirit: Dog → (cleared)                                │    │
│  │     • Selected Spells: 3 spells → (will become invalid)             │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                              [Cancel]        [Confirm]      │
└─────────────────────────────────────────────────────────────────────────────┘
```

The warning shows what will be cleared/invalidated when confirming a path change.
This follows the pattern of non-destructive changes with visible validation warnings.

---

## Attributes Component

Based on the existing wizard design, adapted for character sheet context.
Shows priority connection and includes special attributes (Edge, Magic, Resonance).

### Standard State (Points Available)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ATTRIBUTES                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Attribute Points                                                  0  │  │
│  │  Distribute points among your physical and mental attributes          │  │
│  │  20 points from Priority B                            of 20 remaining │  │
│  │  ████████████████████████████████████████████████████████████████████ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  PHYSICAL ATTRIBUTES                                                        │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Body          BOD                                          Range     │  │
│  │  Physical health and resistance to damage                    1–6      │  │
│  │                                                       (−)  [ 3 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Agility       AGI                                          Range     │  │
│  │  Coordination and fine motor skills                          2–7      │  │
│  │                                                       (−)  [ 4 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Reaction      REA                                          Range     │  │
│  │  Response time and reflexes                                  1–6      │  │
│  │                                                       (−)  [ 3 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Strength      STR                                          Range     │  │
│  │  Raw physical power                                          1–6      │  │
│  │                                                       (−)  [ 2 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  MENTAL ATTRIBUTES                                                          │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Willpower     WIL                                          Range     │  │
│  │  Mental fortitude and resistance to magic                    1–6      │  │
│  │                                                       (−)  [ 3 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Logic         LOG                                          Range     │  │
│  │  Problem solving and analytical thinking                     1–6      │  │
│  │                                                       (−)  [ 3 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Intuition     INT                                          Range     │  │
│  │  Gut feelings and situational awareness                      1–6      │  │
│  │                                                       (−)  [ 3 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Charisma      CHA                                          Range     │  │
│  │  Social influence and personal magnetism                     3–8      │  │
│  │                                                       (−)  [ 5 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Special Attribute Points                                          3  │  │
│  │  Edge, Magic, or Resonance based on your metatype and path            │  │
│  │  8 points from Elf at Priority A                      of 8 remaining  │  │
│  │  █████████████████████████████████████████████████░░░░░░░░░░░░░░░░░░░ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  SPECIAL ATTRIBUTES                                                         │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Edge          EDG                                          Range     │  │
│  │  Luck and ability to push beyond limits                      1–6      │  │
│  │                                                       (−)  [ 3 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Magic         MAG                                 Adept    Range     │  │
│  │  Magical power and connection to astral plane                1–6      │  │
│  │  Power Points: 4.0 PP                             (−)  [ 4 ]  (+)     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Validation: Attribute at Minimum

When attribute is at its minimum value, (−) button is disabled:

```
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Agility       AGI                                          Range     │  │
│  │  Coordination and fine motor skills                          2–7      │  │
│  │                                                  (−)dim [ 2 ]  (+)    │  │
│  │                                                   ▲                   │  │
│  │                                                   at minimum          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
```

### Validation: Attribute at Maximum

When attribute is at its maximum value, (+) button is disabled:

```
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Agility       AGI                                 ● MAX    Range     │  │
│  │  Coordination and fine motor skills                          2–7      │  │
│  │                                                       (−)  [ 7 ]  (+)dim │
│  │                                                              ▲        │  │
│  │                                                         at maximum    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
```

### Validation: Budget Exceeded (Karma Conversion)

When attribute points exceed budget, excess converts to karma spend.
Per creation rules: 5 karma per attribute point over budget.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ATTRIBUTES                                                      ⚠ Over budget│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Attribute Points                                                 -3  │  │
│  │  Distribute points among your physical and mental attributes          │  │
│  │  20 points from Priority B                                            │  │
│  │  ████████████████████████████████████████████████████████████████████ │  │
│  │                                                                       │  │
│  │  ⚠ 3 points over budget → 15 karma (5 karma per point)               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  PHYSICAL ATTRIBUTES                                                        │
│  ...                                                                        │
```

### Validation: Karma Budget Also Exceeded

When karma conversion would exceed available karma, show error:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ATTRIBUTES                                                         ⚠ Error │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Attribute Points                                                 -5  │  │
│  │  Distribute points among your physical and mental attributes          │  │
│  │  20 points from Priority B                                            │  │
│  │  ████████████████████████████████████████████████████████████████████ │  │
│  │                                                                       │  │
│  │  ⚠ 5 points over budget → 25 karma required                          │  │
│  │  ✗ Only 10 karma available — reduce attributes by 3 points           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
```

### Validation: Before Metatype Selection

When no metatype is selected, show default ranges with notice:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ATTRIBUTES                                              ○ Awaiting metatype │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Attribute Points                                                 20  │  │
│  │  Distribute points among your physical and mental attributes          │  │
│  │  20 points from Priority B                            of 20 remaining │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  │                                                                       │  │
│  │  ⓘ Select a metatype to see adjusted attribute ranges                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  PHYSICAL ATTRIBUTES                                                        │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Body          BOD                                          Range     │  │
│  │  Physical health and resistance to damage                    1–6      │  │
│  │                                                  (−)dim [ 1 ]  (+)    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  All attributes start at 1. Ranges will update based on metatype selection. │
│                                                                             │
```

### Validation: Before Priority Selection

When no priority is set for attributes, component is non-interactive:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ATTRIBUTES                                             ○ Awaiting priority  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Attribute Points                                                  —  │  │
│  │  Distribute points among your physical and mental attributes          │  │
│  │  Set attribute priority to unlock                                     │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Attributes locked until priorities are configured.                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Special Attributes: Technomancer (Resonance)

```
│  SPECIAL ATTRIBUTES                                                         │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Edge          EDG                                          Range     │  │
│  │  Luck and ability to push beyond limits                      1–6      │  │
│  │                                                       (−)  [ 2 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Resonance     RES                           Technomancer   Range     │  │
│  │  Connection to the living Matrix                             1–6      │  │
│  │                                                       (−)  [ 4 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
```

### Special Attributes: Mundane (Edge Only)

```
│  SPECIAL ATTRIBUTES                                                         │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Edge          EDG                                          Range     │  │
│  │  Luck and ability to push beyond limits                      1–6      │  │
│  │                                                       (−)  [ 5 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  No Magic or Resonance — Mundane character                                  │
```

### Validation Summary

| State                             | Indicator                 | Behavior                               |
| --------------------------------- | ------------------------- | -------------------------------------- |
| At minimum                        | (−) disabled              | Cannot decrease below metatype minimum |
| At maximum                        | (+) disabled, "MAX" badge | Cannot exceed metatype maximum         |
| Budget exceeded (karma available) | ⚠ Over budget             | Shows karma conversion cost            |
| Budget exceeded (no karma)        | ⚠ Error                   | Shows error, requires reduction        |
| No metatype selected              | ○ Awaiting metatype       | Default 1-6 ranges, info notice        |
| No priority selected              | ○ Awaiting priority       | Component locked/non-interactive       |

---

## Skills Component

Based on existing wizard design. Skills have multiple budget pools and categories.

**Budget types:**

- Skill Points (from Priority, e.g., 22 from D)
- Skill Group Points (from Priority, e.g., 5 from B, 0 from D)
- Knowledge/Language Points (from (INT + LOG) × 2)
- Free Skills (from Magic Priority, e.g., "2 magical skills at rating 5")

### Standard State (Points Available)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SKILLS                                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────┐   │
│  │  Skill Points                   │ │  Skill Group Points             │   │
│  │  For individual skills          │ │  For skill groups               │   │
│  │  22 points from Priority D      │ │  0 points from Priority D       │   │
│  │                                 │ │                                 │   │
│  │  ████████████░░░░░░░░  10       │ │  No group points available      │   │
│  │                      of 22      │ │                                 │   │
│  └─────────────────────────────────┘ └─────────────────────────────────┘   │
│                                                                             │
│  ACTIVE SKILLS                                        [Search...]  [All ▾] │
│                                                                             │
│  ─ COMBAT ──────────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Automatics      AGI                                                  │  │
│  │  Assault rifles, SMGs, machine guns                                   │  │
│  │  Group: Firearms                                      (−)  [ 4 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Blades          AGI                                                  │  │
│  │  Swords, knives, and other edged weapons                              │  │
│  │  Group: Close Combat                                  (−)  [ 3 ]  (+) │  │
│  │  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │  │
│  │  Specialization: Swords                                 +2 dice       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Pistols         AGI                                         Free 4   │  │
│  │  Hold-out pistols, light pistols, heavy pistols                       │  │
│  │  Group: Firearms                                      (−)  [ 4 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ─ PHYSICAL ────────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Gymnastics      AGI                                                  │  │
│  │  Climbing, jumping, parkour, tumbling                                 │  │
│  │  Group: Athletics                                     (−)  [ 2 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Sneaking        AGI                                                  │  │
│  │  Moving silently and avoiding detection                               │  │
│  │  Group: Stealth                                       (−)  [ 5 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ─ SOCIAL ──────────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Con              CHA                                                 │  │
│  │  Fast-talking, deception, and manipulation                            │  │
│  │  Group: Acting                                        (−)  [ 0 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ... more skills ...                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Skill Groups Section (When Group Points > 0)

When Priority grants skill group points (e.g., Priority B = 5 group points):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────┐   │
│  │  Skill Points                   │ │  Skill Group Points             │   │
│  │  For individual skills          │ │  For skill groups               │   │
│  │  36 points from Priority B      │ │  5 points from Priority B       │   │
│  │                                 │ │                                 │   │
│  │  ████████████████░░░░  20       │ │  ███████████░░░░░░░░  3         │   │
│  │                      of 36      │ │                    of 5         │   │
│  └─────────────────────────────────┘ └─────────────────────────────────┘   │
│                                                                             │
│  SKILL GROUPS                                                               │
│  Increase all skills in a group at once. Cannot have individual ratings.   │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Firearms                                                             │  │
│  │  Automatics, Longarms, Pistols, Shotguns                              │  │
│  │                                                       (−)  [ 2 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Athletics                                                            │  │
│  │  Gymnastics, Running, Swimming                                        │  │
│  │                                                       (−)  [ 0 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Stealth                                                              │  │
│  │  Disguise, Palming, Sneaking                                          │  │
│  │                                                       (−)  [ 0 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
```

### Skill with Group Rating Applied

When a skill group has points, individual skills show the group contribution:

```
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Automatics      AGI                                                  │  │
│  │  Assault rifles, SMGs, machine guns                                   │  │
│  │  Group: Firearms (+2 from group)                      (−)  [ 2 ]  (+) │  │
│  │                                                              ▲        │  │
│  │                                              value from group rating  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
```

### Skill with Group Rating + Individual Rating (Breaks Group)

When you add individual points to a skill in a group, it breaks the group:

```
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Automatics      AGI                                        ⚠ Broken  │  │
│  │  Assault rifles, SMGs, machine guns                                   │  │
│  │  Group: Firearms (broken - has individual points)     (−)  [ 4 ]  (+) │  │
│  │  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │  │
│  │  ⚠ Adding individual points breaks the Firearms group.               │  │
│  │    Group rating (2) no longer applies to this skill.                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
```

### Knowledge & Languages Section

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ KNOWLEDGE & LANGUAGES                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Knowledge Points                                                  6  │  │
│  │  Based on (INT + LOG) × 2                             of 10 remaining │  │
│  │  INT 3 + LOG 2 = 5 × 2 = 10 points                                   │  │
│  │  ██████████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  LANGUAGES                                                                  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  English                                                      Native  │  │
│  │  Native language (free)                                           N   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Japanese                                                             │  │
│  │  Learned language                                     (−)  [ 3 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  [+ Add Language]                                                           │
│                                                                             │
│  KNOWLEDGE SKILLS                                                           │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Seattle Gangs              Street                                    │  │
│  │  Knowledge skill                                      (−)  [ 2 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Corporate Politics         Professional                              │  │
│  │  Knowledge skill                                      (−)  [ 2 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  [+ Add Knowledge Skill]                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Free Skills Section (From Magic Priority)

When magic priority grants free skills (e.g., "2 magical skills at rating 5"):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FREE SKILL ALLOCATIONS                                    From Magic (A)  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  2 magical skills at rating 5                       1/2 allocated     │  │
│  │  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │  │
│  │                                                                       │  │
│  │  Allocated:                                                           │  │
│  │  • Spellcasting (rating 5)                              [Remove]      │  │
│  │                                                                       │  │
│  │  ┌───────────────────────────────────────────────────────────────┐    │  │
│  │  │  Select skill to allocate...                            [▾]  │    │  │
│  │  └───────────────────────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Validation: Skill at Maximum (6 at Creation)

```
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Sneaking        AGI                                   ● MAX          │  │
│  │  Moving silently and avoiding detection                               │  │
│  │  Group: Stealth                                  (−)  [ 6 ]  (+)dim   │  │
│  │                                                        ▲              │  │
│  │                                          Maximum at character creation │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
```

### Validation: Budget Exceeded (Karma Conversion)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SKILLS                                                         ⚠ Over budget│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────┐   │
│  │  Skill Points       ⚠ Over     │ │  Skill Group Points             │   │
│  │  For individual skills          │ │  For skill groups               │   │
│  │  22 points from Priority D      │ │  0 points from Priority D       │   │
│  │                                 │ │                                 │   │
│  │  ████████████████████████  -4   │ │  No group points available      │   │
│  │                                 │ │                                 │   │
│  │  ⚠ 4 points over budget        │ │                                 │   │
│  │    → 8 karma (2 karma/point)   │ │                                 │   │
│  └─────────────────────────────────┘ └─────────────────────────────────┘   │
│                                                                             │
```

### Validation: Before Priority Selection

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SKILLS                                                ○ Awaiting priority   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Skill Points                                                      —  │  │
│  │  Set skills priority to unlock                                        │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Skills locked until priorities are configured.                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Magical/Resonance Skills (Filtered by Path)

For Magician - shows magical skills:

```
│  ─ MAGICAL ─────────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Spellcasting    MAG                                         Free 5   │  │
│  │  Casting manipulation, combat, and other spells                       │  │
│  │  Group: Sorcery                                       (−)  [ 5 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Summoning       MAG                                                  │  │
│  │  Calling and binding spirits                                          │  │
│  │  Group: Conjuring                                     (−)  [ 3 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Counterspelling MAG                                                  │  │
│  │  Defending against magical attacks                                    │  │
│  │  Group: Sorcery                                       (−)  [ 0 ]  (+) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
```

For Mundane - magical skills hidden:

```
│  ─ MAGICAL ─────────────────────────────────────────────────────────────── │
│                                                                             │
│  No magical skills available — Mundane character                            │
│                                                                             │
```

### Skills Validation Summary

| State                      | Indicator                 | Behavior                               |
| -------------------------- | ------------------------- | -------------------------------------- |
| At maximum (6)             | (+) disabled, "MAX" badge | Cannot exceed 6 at creation            |
| Budget exceeded (karma ok) | ⚠ Over budget             | Shows karma conversion (2 karma/point) |
| Budget exceeded (no karma) | ⚠ Error                   | Shows error, requires reduction        |
| Group broken               | ⚠ Broken                  | Individual points break group rating   |
| Skill from group           | "Group: X (+N)"           | Shows group contribution               |
| Free skill                 | "Free N" badge            | From magic priority allocation         |
| Awaiting priority          | ○ Awaiting priority       | Component locked                       |
| No magical ability         | Section hidden            | Magical skills not shown for mundane   |

---

## Spells Component

For Magicians and Mystic Adepts. Spell count comes from Magic Priority.
Uses header + [Add] button + modal pattern.

**Budget:** Free spells from priority (e.g., "10 spells" from Priority A Magic)
Additional spells can be purchased with karma (5 karma per spell).

### Standard State (Spells Available)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SPELLS                                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Free Spells                                                      4   │  │
│  │  From Magic Priority A (Magician)                        of 10 remaining│ │
│  │  ████████████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Spells via Karma                                         0 karma    │  │
│  │  Additional spells at 5 karma each                                   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  SELECTED SPELLS                                    [Search...]  [+ Add]   │
│                                                                             │
│  ─ COMBAT ─────────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Manabolt                                          Direct • Mana      │  │
│  │  Type: M  Range: LOS  Damage: P  Duration: I  Drain: F-3              │  │
│  │  Channels destructive magical energy at target's life force           │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Stunbolt                                          Direct • Mana      │  │
│  │  Type: M  Range: LOS  Damage: S  Duration: I  Drain: F-3              │  │
│  │  Channels magical energy to stun target                               │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ─ DETECTION ──────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Detect Life                                           Active • Mana  │  │
│  │  Type: M  Range: T(A)  Duration: S  Drain: F-2                        │  │
│  │  Detects living beings within range                                   │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ─ HEALTH ─────────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Heal                                                Essence • Mana   │  │
│  │  Type: M  Range: T  Duration: P  Drain: F-4                           │  │
│  │  Repairs physical damage to living tissue                             │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Increase Reflexes                                   Essence • Mana   │  │
│  │  Type: M  Range: T  Duration: S  Drain: F                             │  │
│  │  Increases target's Reaction and grants Initiative Dice               │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ─ ILLUSION ───────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Invisibility                                         Multi-Sense     │  │
│  │  Type: M  Range: LOS  Duration: S  Drain: F-1                         │  │
│  │  Makes target invisible to normal senses                              │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  6 spells selected                                          4 free remaining│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Spell Selection Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ADD SPELL                                                               [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Search spells...]                               [Category ▾] [Type ▾]    │
│                                                                             │
│  4 free spells remaining • Additional spells: 5 karma each                 │
│                                                                             │
│  ─ COMBAT (12) ────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  □  Acid Stream                                    Indirect • Physical│  │
│  │      Type: P  Range: LOS  Damage: P  Duration: I  Drain: F-3          │  │
│  │      Projects a stream of magical acid at target                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ☑  Manabolt                                       Direct • Mana      │  │
│  │      Type: M  Range: LOS  Damage: P  Duration: I  Drain: F-3          │  │
│  │      Channels destructive magical energy at target's life force       │  │
│  │                                                        (already added) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  □  Powerbolt                                      Direct • Physical  │  │
│  │      Type: P  Range: LOS  Damage: P  Duration: I  Drain: F-2          │  │
│  │      Channels mana through the target, causing physical damage        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  □  Lightning Bolt                                 Indirect • Physical│  │
│  │      Type: P  Range: LOS  Damage: P  Duration: I  Drain: F-3          │  │
│  │      Channels powerful electrical energy at target                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ... more spells ...                                                        │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Selected: 2 spells                                    2 of 4 free remaining│
│                                              [Cancel]        [Add Selected] │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Validation: Over Free Limit (Karma Required)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SPELLS                                                        ⚠ Karma spend │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Free Spells                                                      0   │  │
│  │  From Magic Priority A (Magician)                        of 10 remaining│ │
│  │  ████████████████████████████████████████████████████████████████████ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Spells via Karma                                   ⚠ 10 karma       │  │
│  │  2 additional spells at 5 karma each                                 │  │
│  │                                                                       │  │
│  │  ⚠ 2 spells over free limit → 10 karma                              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  SELECTED SPELLS (12)                               [Search...]  [+ Add]   │
│  ...                                                                        │
```

### Validation: Mundane Character (No Spells)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SPELLS                                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  No spells available — Mundane character                                    │
│                                                                             │
│  Change your Magic/Resonance priority selection to unlock spells.           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Validation: Adept (No Spells, Has Powers)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SPELLS                                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  No spells available — Adept                                                │
│                                                                             │
│  Adepts channel magic through their bodies as Adept Powers, not spells.     │
│  See the Adept Powers section to allocate your Power Points.                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Adept Powers Component

For Adepts and Mystic Adepts. Power Points come from Magic attribute.
Uses header + [Add] button + modal pattern.

**Budget:** Power Points = Magic Rating (e.g., Magic 4 = 4.0 PP)
Each power costs a fractional amount of PP (0.25, 0.5, 1.0, etc.)

### Standard State (Powers Selected)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ADEPT POWERS                                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Power Points                                                  1.25   │  │
│  │  From Magic 4                                       of 4.00 remaining │  │
│  │  ████████████████████████████████████████████████░░░░░░░░░░░░░░░░░░░░ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  SELECTED POWERS                                    [Search...]  [+ Add]   │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Improved Reflexes                                        Level 2     │  │
│  │  +2 Reaction, +2 Initiative Dice                              2.00 PP │  │
│  │  (−)  [ 2 ]  (+)                                          [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Combat Sense                                             Level 1     │  │
│  │  +1 die to defense tests                                      0.50 PP │  │
│  │  (−)  [ 1 ]  (+)                                          [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Enhanced Accuracy (Skill)                              Automatics    │  │
│  │  +1 Accuracy for chosen skill                                 0.25 PP │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  2.75 PP spent                                             1.25 PP remaining│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Adept Power Selection Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ADD ADEPT POWER                                                         [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Search powers...]                                    [Category ▾]        │
│                                                                             │
│  1.25 PP remaining                                                          │
│                                                                             │
│  ─ COMBAT ─────────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  □  Killing Hands                                           0.50 PP   │  │
│  │      Unarmed attacks deal Physical damage instead of Stun             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  □  Critical Strike (Skill)                          0.50 PP / level  │  │
│  │      +1 DV for unarmed attacks with chosen skill                      │  │
│  │      Select skill: [Unarmed Combat ▾]                Level: [ 1 ]     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ☑  Combat Sense                                     0.50 PP / level  │  │
│  │      +1 die to defense tests per level                                │  │
│  │                                                        (already added) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ─ PHYSICAL ──────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ☒  Improved Reflexes                                1.00 PP / level  │  │
│  │      +1 Reaction and +1 Initiative Die per level                      │  │
│  │                              ⚠ Exceeds available PP (need 1.00, have 1.25)│
│  │                                                    (insufficient PP)  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ... more powers ...                                                        │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Selected: Killing Hands (0.50 PP)                         0.75 PP remaining│
│                                              [Cancel]        [Add Selected] │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Validation: Not an Adept

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ADEPT POWERS                                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  No adept powers available — not an Adept or Mystic Adept                   │
│                                                                             │
│  Change your Magic/Resonance path to Adept or Mystic Adept                  │
│  to unlock Adept Powers.                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Qualities Component

Qualities are purchased with karma during character creation.
Positive qualities cost karma; negative qualities grant karma.

**Budget:** Starting karma (typically 25) minus/plus quality costs
**Limits:** Max 25 karma in positive qualities, max 25 karma from negative qualities

### Standard State (Qualities Selected)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ QUALITIES                                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────┐   │
│  │  Positive Qualities             │ │  Negative Qualities             │   │
│  │  Cost karma to acquire          │ │  Grant karma when taken         │   │
│  │                                 │ │                                 │   │
│  │  ██████████████░░░░░░  18       │ │  █████████░░░░░░░░░░░  10       │   │
│  │               of 25 max karma   │ │               of 25 max karma   │   │
│  └─────────────────────────────────┘ └─────────────────────────────────┘   │
│                                                                             │
│  POSITIVE QUALITIES                                             [+ Add]    │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Exceptional Attribute (Agility)                            14 karma  │  │
│  │  Raise one attribute's maximum by 1                                   │  │
│  │  Your Agility maximum is now 8 (instead of 7)                         │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Ambidextrous                                                4 karma  │  │
│  │  No off-hand penalty                                                  │  │
│  │  Use either hand without penalty                                      │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  NEGATIVE QUALITIES                                             [+ Add]    │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Allergy (Common, Moderate)                                +10 karma  │  │
│  │  Allergic reaction to common substance                                │  │
│  │  Substance: Pollutants                                                │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Karma Balance:  25 (starting) − 18 (positive) + 10 (negative) = 17 karma  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Quality Selection Modal - Positive

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ADD POSITIVE QUALITY                                                    [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Search qualities...]                                 [Category ▾]        │
│                                                                             │
│  7 karma available for positive qualities (18 of 25 max used)              │
│                                                                             │
│  ─ PHYSICAL ──────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  □  Catlike                                                  7 karma  │  │
│  │      +2 dice on balance and falling tests                             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  □  Double Jointed                                           6 karma  │  │
│  │      +2 dice on escape and contortion tests                           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ☒  High Pain Tolerance                                     10 karma  │  │
│  │      Reduce wound penalties by up to 3 boxes                          │  │
│  │                                                     ⚠ Exceeds budget  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ─ MENTAL ────────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  □  Analytical Mind                                          5 karma  │  │
│  │      +2 dice on Logic-based tests involving patterns                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ☑  Exceptional Attribute (Agility)                         14 karma  │  │
│  │      Raise one attribute's maximum by 1                               │  │
│  │                                                        (already added) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Selected: Analytical Mind (5 karma)                   2 karma remaining   │
│                                              [Cancel]        [Add Selected] │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Quality Selection Modal - Negative

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ADD NEGATIVE QUALITY                                                    [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Search qualities...]                                 [Category ▾]        │
│                                                                             │
│  15 karma available from negative qualities (10 of 25 max taken)           │
│                                                                             │
│  ─ PHYSICAL ──────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  □  Addiction (Mild)                                         +4 karma │  │
│  │      Character has a mild addiction                                   │  │
│  │      Select substance: [Choose... ▾]                                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  □  Bad Luck                                                +12 karma │  │
│  │      GM can force reroll of a favorable die result once per session   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ☑  Allergy (Common, Moderate)                              +10 karma │  │
│  │      Allergic reaction to common substance                            │  │
│  │                                                        (already added) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ─ SOCIAL ────────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  □  SINner (National)                                        +5 karma │  │
│  │      Character has a registered national SIN                          │  │
│  │      Select nation: [Choose... ▾]                                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ☒  Prejudiced (Outspoken)                                  +10 karma │  │
│  │      Strong dislike of a group, vocally expressed                     │  │
│  │                                           ⚠ Exceeds remaining (15 max) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Selected: SINner (National) (+5 karma)                 10 karma remaining │
│                                              [Cancel]        [Add Selected] │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Quality With Required Selection

Some qualities require additional choices (e.g., Exceptional Attribute needs attribute selection):

```
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  □  Exceptional Attribute                                   14 karma  │  │
│  │      Raise one attribute's maximum by 1                               │  │
│  │      ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │  │
│  │      Select attribute: [Agility           ▾]                          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
```

### Validation: Quality Limits Exceeded

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ QUALITIES                                                          ⚠ Error │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────┐   │
│  │  Positive Qualities   ⚠ Over   │ │  Negative Qualities             │   │
│  │  Cost karma to acquire          │ │  Grant karma when taken         │   │
│  │                                 │ │                                 │   │
│  │  ████████████████████████  28   │ │  █████████░░░░░░░░░░░  10       │   │
│  │               of 25 max karma   │ │               of 25 max karma   │   │
│  │                                 │ │                                 │   │
│  │  ⚠ 3 karma over limit          │ │                                 │   │
│  └─────────────────────────────────┘ └─────────────────────────────────┘   │
│                                                                             │
│  ⚠ Reduce positive qualities by 3 karma or remove a quality               │
│                                                                             │
```

### Validation: Metatype-Restricted Quality

```
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ☒  Low-Light Vision                                         0 karma  │  │
│  │      Can see in low-light conditions                                  │  │
│  │                                                                       │  │
│  │      ⚠ Elves have Low-Light Vision as a racial trait.                │  │
│  │        Cannot take as a quality.                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
```

---

## Gear Component

Equipment purchased with nuyen from Resources priority.
Uses header + [Add] button + modal pattern.

**Budget:** Starting nuyen from Priority (e.g., 450,000¥ from Priority A)
**Structure:** Categories (Weapons, Armor, Electronics, etc.)

### Standard State (Gear Purchased)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ GEAR                                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Starting Nuyen                                            147,250¥   │  │
│  │  From Resources Priority B (275,000¥)              of 275,000¥ remaining│ │
│  │  ██████████████████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  PURCHASED GEAR                     [Search...]  [All ▾]        [+ Add]    │
│                                                                             │
│  ─ WEAPONS ────────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Ares Predator V                                Heavy Pistol           │  │
│  │  Acc 5(7)  DV 8P  AP -1  Mode SA  RC -  Ammo 15(c)                    │  │
│  │                                                             725¥      │  │
│  │  Accessories:                                                          │  │
│  │  ├─ Smartgun System (internal)                              200¥      │  │
│  │  └─ Extended Clip                                            75¥      │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Katana                                                    Blade      │  │
│  │  Acc 7  Reach 1  DV 10P  AP -3                                        │  │
│  │                                                           1,000¥      │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ─ ARMOR ──────────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Armor Jacket                                          Armor: 12      │  │
│  │  Standard armor jacket with concealable armor                         │  │
│  │                                                           1,000¥      │  │
│  │  Modifications:                                                        │  │
│  │  └─ Chemical Protection 4                                   800¥      │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ─ ELECTRONICS ────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Transys Avalon                                          Commlink     │  │
│  │  Device Rating 6  Firewall 6                                          │  │
│  │                                                           5,000¥      │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ─ CYBERWARE ──────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Wired Reflexes (Rating 1)                               Essence 2.0  │  │
│  │  +1 Reaction, +1 Initiative Die                                       │  │
│  │                                                          39,000¥      │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Smartlink                                               Essence 0.2  │  │
│  │  +2 dice with smartgun-linked weapons                                 │  │
│  │                                                           4,000¥      │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ─ LIFESTYLE ──────────────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Medium Lifestyle                                          3 months   │  │
│  │  Comfortable apartment in a decent neighborhood                       │  │
│  │                                                 5,000¥/mo × 3 months  │  │
│  │                                                          15,000¥      │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  127,750¥ spent                                       147,250¥ remaining   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Gear Selection Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ADD GEAR                                                                [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Search gear...]                            [Category ▾] [Availability ▾] │
│                                                                             │
│  147,250¥ available                             Availability limit: 12 (R) │
│                                                                             │
│  ─ WEAPONS > PISTOLS ──────────────────────────────────────────────────── │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  □  Browning Ultra-Power                        Heavy Pistol          │  │
│  │      Acc 5(6)  DV 8P  AP -1  Mode SA  RC -  Ammo 10(c)               │  │
│  │      Avail: 4  Cost: 640¥                                             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ☑  Ares Predator V                             Heavy Pistol          │  │
│  │      Acc 5(7)  DV 8P  AP -1  Mode SA  RC -  Ammo 15(c)               │  │
│  │      Avail: 5R  Cost: 725¥                         (already purchased) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  □  Savalette Guardian                          Heavy Pistol          │  │
│  │      Acc 5(6)  DV 8P  AP -1  Mode SA/BF  RC 1  Ammo 12(c)            │  │
│  │      Avail: 6R  Cost: 870¥                                            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ☒  Ares Desert Strike                          Sniper Rifle          │  │
│  │      Acc 7  DV 13P  AP -4  Mode SA  RC -  Ammo 14(c)                 │  │
│  │      Avail: 10F  Cost: 17,500¥                  ⚠ Forbidden (10F)    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ... more gear ...                                                          │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Cart: Browning Ultra-Power (640¥)                    146,610¥ remaining   │
│                                              [Cancel]        [Add to Gear] │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Gear With Accessories/Modifications

Weapons and armor can have modifications added:

```
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Ares Predator V                                Heavy Pistol           │  │
│  │  Acc 5(7)  DV 8P  AP -1  Mode SA  RC -  Ammo 15(c)                    │  │
│  │                                                             725¥      │  │
│  │  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │  │
│  │  Accessories:                                           [+ Add Mod]   │  │
│  │  ├─ Smartgun System (internal)                              200¥   [×]│  │
│  │  ├─ Extended Clip                                            75¥   [×]│  │
│  │  └─ Laser Sight                                             125¥   [×]│  │
│  │                                                                       │  │
│  │  Total: 1,125¥                                            [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
```

### Cyberware With Essence Tracking

```
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Essence                                                         3.8  │  │
│  │  Cyberware and bioware reduce essence                   of 6.0 starting│ │
│  │  ████████████████████████████████████████████████████████████░░░░░░░░ │  │
│  │                                                                       │  │
│  │  ⚠ Magic reduced to 3 (Essence 3.8 → Magic 3)                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  CYBERWARE                                                       [+ Add]   │
│  ...                                                                        │
```

### Validation: Insufficient Funds

```
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ☒  Ingram Smartgun X                           SMG                   │  │
│  │      Acc 4(6)  DV 8P  AP -  Mode BF/FA  RC 2  Ammo 32(c)             │  │
│  │      Avail: 6R  Cost: 800¥                                            │  │
│  │                                     ⚠ Insufficient funds (need 800¥,  │  │
│  │                                        have 640¥)                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
```

### Validation: Availability Exceeded

```
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ☒  Panther XXL                                 Assault Cannon        │  │
│  │      Acc 5(8)  DV 17P  AP -6  Mode SS  RC 5  Ammo 15(c)              │  │
│  │      Avail: 20F  Cost: 7,500¥                                        │  │
│  │                                                                       │  │
│  │      ⚠ Forbidden gear (Avail 20F) — requires GM approval             │  │
│  │        Cannot purchase during standard character creation             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
```

### Validation: Budget Exceeded

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ GEAR                                                          ⚠ Over budget │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Starting Nuyen                                           -12,500¥   │  │
│  │  From Resources Priority B (275,000¥)                                │  │
│  │  ████████████████████████████████████████████████████████████████████ │  │
│  │                                                                       │  │
│  │  ⚠ 12,500¥ over budget — remove gear or change Resources priority   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
```

---

## Purchase Components Summary

All purchase components follow a consistent pattern:

| Component     | Budget Source      | Free Items   | Extra Cost       | Categories                                        |
| ------------- | ------------------ | ------------ | ---------------- | ------------------------------------------------- |
| Spells        | Magic Priority     | 5-10 spells  | 5 karma each     | Combat, Detection, Health, Illusion, Manipulation |
| Adept Powers  | Magic Rating       | Power Points | N/A (PP only)    | Combat, Physical, Perception, etc.                |
| Complex Forms | Resonance Priority | 1-5 forms    | 4 karma each     | (Technomancer equivalent of spells)               |
| Qualities     | Karma              | None         | Karma cost/grant | Physical, Mental, Social, Magical                 |
| Gear          | Resources Priority | None         | Nuyen cost       | Weapons, Armor, Electronics, Cyberware, etc.      |

### Consistent Modal Pattern

1. **Header**: Title + close [X]
2. **Search/Filter**: Search box + category/type dropdowns
3. **Budget display**: "X remaining" or "X of Y used"
4. **Item list**: Checkboxes/selection with details
5. **Already added indicator**: Grayed out with "(already added)"
6. **Unavailable indicator**: Crossed out with reason (cost, prereq, etc.)
7. **Footer**: Selected count + budget impact + [Cancel] [Add Selected]

### Validation States for Purchase Components

| State                         | Indicator       | Behavior                               |
| ----------------------------- | --------------- | -------------------------------------- |
| Within budget                 | Normal          | Items can be added freely              |
| Over budget (karma available) | ⚠ Karma spend   | Shows karma conversion                 |
| Over budget (no karma)        | ⚠ Over budget   | Error, must reduce                     |
| Unavailable (prereq)          | ☒ crossed out   | Shows reason, cannot select            |
| Already added                 | ☑ grayed        | Shows "(already added)", cannot re-add |
| Path not available            | Section message | "No X available — [reason]"            |

---

## State Indicators

Consistent indicators used across components:

| Indicator              | Meaning                           | Visual                           |
| ---------------------- | --------------------------------- | -------------------------------- |
| `○ Selection needed`   | Required field, not yet set       | Empty circle                     |
| `○ Optional`           | Optional field, not set           | Empty circle (different context) |
| `◐ Partially complete` | Some sub-selections needed        | Half-filled circle               |
| `● Complete`           | All required selections made      | Filled circle                    |
| `⚠ Conflict`           | Validation error needs resolution | Warning triangle                 |

---

## Full Character Sheet Layout - Creation Mode

This shows how all components appear together during character creation.
The layout uses a two-column approach with Priority at top-left driving the rest.

### Example: Elf Magician (Priorities: A-Magic, B-Attributes, C-Skills, D-Metatype, E-Resources)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CHARACTER CREATION                                                    [Save Draft]  [Validate]  [Finalize Character]│
│ Unnamed Character • SR5 • Priority                                                              Draft Auto-saved ✓  │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                     │
│  ┌─────────────────────────────────────────────────┐  ┌─────────────────────────────────────────────────────────┐  │
│  │ PRIORITIES                    Drag to reorder ↕ │  │ ATTRIBUTES                                              │  │
│  ├─────────────────────────────────────────────────┤  ├─────────────────────────────────────────────────────────┤  │
│  │                                                 │  │                                                         │  │
│  │  ┌─ A ───────────────────────────────────────┐  │  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │ ≡  MAGIC / RESONANCE          ● Complete  │  │  │  │  Attribute Points                           5   │   │  │
│  │  │    MAGICIAN • Magic 6 • 10 spells         │  │  │  │  20 points from Priority B      of 20 remaining │   │  │
│  │  │    Tradition: Hermetic                    │  │  │  │  ███████████████████████████░░░░░░░░░░░░░░░░░░░ │   │  │
│  │  └───────────────────────────────────────────┘  │  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                 │  │                                                         │  │
│  │  ┌─ B ───────────────────────────────────────┐  │  │  PHYSICAL                                               │  │
│  │  │ ≡  ATTRIBUTES                 ● Complete  │  │  │  ┌──────────────────────┐ ┌──────────────────────┐     │  │
│  │  │    20 points to distribute                │  │  │  │ Body         1–6     │ │ Agility      2–7     │     │  │
│  │  └───────────────────────────────────────────┘  │  │  │         (−) [ 3 ] (+)│ │         (−) [ 5 ] (+)│     │  │
│  │                                                 │  │  └──────────────────────┘ └──────────────────────┘     │  │
│  │  ┌─ C ───────────────────────────────────────┐  │  │  ┌──────────────────────┐ ┌──────────────────────┐     │  │
│  │  │ ≡  SKILLS                     ● Complete  │  │  │  │ Reaction     1–6     │ │ Strength     1–6     │     │  │
│  │  │    28 skill points • 2 group points       │  │  │  │         (−) [ 3 ] (+)│ │         (−) [ 2 ] (+)│     │  │
│  │  └───────────────────────────────────────────┘  │  │  └──────────────────────┘ └──────────────────────┘     │  │
│  │                                                 │  │                                                         │  │
│  │  ┌─ D ───────────────────────────────────────┐  │  │  MENTAL                                                 │  │
│  │  │ ≡  METATYPE                   ● Complete  │  │  │  ┌──────────────────────┐ ┌──────────────────────┐     │  │
│  │  │    ELF • 6 special attribute points       │  │  │  │ Willpower    1–6     │ │ Logic        1–6     │     │  │
│  │  │    Low-Light Vision                       │  │  │  │         (−) [ 4 ] (+)│ │         (−) [ 5 ] (+)│     │  │
│  │  └───────────────────────────────────────────┘  │  │  └──────────────────────┘ └──────────────────────┘     │  │
│  │                                                 │  │  ┌──────────────────────┐ ┌──────────────────────┐     │  │
│  │  ┌─ E ───────────────────────────────────────┐  │  │  │ Intuition    1–6     │ │ Charisma     3–8     │     │  │
│  │  │ ≡  RESOURCES                  ● Complete  │  │  │  │         (−) [ 4 ] (+)│ │         (−) [ 4 ] (+)│     │  │
│  │  │    6,000¥ starting nuyen                  │  │  │  └──────────────────────┘ └──────────────────────┘     │  │
│  │  └───────────────────────────────────────────┘  │  │                                                         │  │
│  │                                                 │  │  ┌─────────────────────────────────────────────────┐   │  │
│  └─────────────────────────────────────────────────┘  │  │  Special Attribute Points                   2   │   │  │
│                                                        │  │  6 points from Elf at Priority D of 6 remaining │   │  │
│  ┌─────────────────────────────────────────────────┐  │  │  █████████████████████████████████████████░░░░░░ │   │  │
│  │ KARMA                                           │  │  └─────────────────────────────────────────────────┘   │  │
│  ├─────────────────────────────────────────────────┤  │                                                         │  │
│  │                                                 │  │  SPECIAL                                                │  │
│  │  Starting Karma                           25   │  │  ┌──────────────────────┐ ┌──────────────────────┐     │  │
│  │                                                 │  │  │ Edge         1–6     │ │ Magic        1–6     │     │  │
│  │  Positive Qualities               −18 karma   │  │  │         (−) [ 2 ] (+)│ │         (−) [ 6 ] (+)│     │  │
│  │  Negative Qualities               +10 karma   │  │  │                      │ │         Magician     │     │  │
│  │                                    ──────────  │  │  └──────────────────────┘ └──────────────────────┘     │  │
│  │  Available                          17 karma   │  │                                                         │  │
│  │                                                 │  └─────────────────────────────────────────────────────────┘  │
│  │  █████████████████████████████████░░░░░░░░░░░░ │                                                               │
│  │                                                 │  ┌─────────────────────────────────────────────────────────┐  │
│  └─────────────────────────────────────────────────┘  │ SKILLS                                                  │  │
│                                                        ├─────────────────────────────────────────────────────────┤  │
│  ┌─────────────────────────────────────────────────┐  │                                                         │  │
│  │ QUALITIES                                       │  │  ┌────────────────────────┐ ┌────────────────────────┐ │  │
│  ├─────────────────────────────────────────────────┤  │  │ Skill Points       10  │ │ Skill Group Points  1  │ │  │
│  │                                                 │  │  │ 28 pts Priority C      │ │ 2 pts Priority C       │ │  │
│  │  ┌───────────────────┐ ┌───────────────────┐   │  │  │ █████████████░░░░░░░░░ │ │ ██████████░░░░░░░░░░░░ │ │  │
│  │  │ Positive  18/25   │ │ Negative  10/25   │   │  │  └────────────────────────┘ └────────────────────────┘ │  │
│  │  │ █████████████░░░░ │ │ ████████░░░░░░░░░ │   │  │                                                         │  │
│  │  └───────────────────┘ └───────────────────┘   │  │  ACTIVE SKILLS                      [Search] [All ▾]   │  │
│  │                                                 │  │                                                         │  │
│  │  POSITIVE                          [+ Add]     │  │  ─ COMBAT ──────────────────────────────────────────── │  │
│  │  ┌───────────────────────────────────────────┐ │  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │ Exceptional Attribute (AGI)     14 karma  │ │  │  │ Spellcasting  MAG  Free 5      (−)  [ 5 ]  (+) │   │  │
│  │  │ Agility max now 8                [Remove] │ │  │  └─────────────────────────────────────────────────┘   │  │
│  │  └───────────────────────────────────────────┘ │  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  ┌───────────────────────────────────────────┐ │  │  │ Counterspelling MAG            (−)  [ 3 ]  (+) │   │  │
│  │  │ Ambidextrous                     4 karma  │ │  │  └─────────────────────────────────────────────────┘   │  │
│  │  │ No off-hand penalty              [Remove] │ │  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  └───────────────────────────────────────────┘ │  │  │ Pistols       AGI  Free 5      (−)  [ 5 ]  (+) │   │  │
│  │                                                 │  │  └─────────────────────────────────────────────────┘   │  │
│  │  NEGATIVE                          [+ Add]     │  │                                                         │  │
│  │  ┌───────────────────────────────────────────┐ │  │  ─ SOCIAL ──────────────────────────────────────────── │  │
│  │  │ Allergy (Common, Moderate)     +10 karma  │ │  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │ Substance: Pollutants           [Remove]  │ │  │  │ Etiquette     CHA               (−)  [ 3 ]  (+) │   │  │
│  │  └───────────────────────────────────────────┘ │  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                 │  │  ┌─────────────────────────────────────────────────┐   │  │
│  └─────────────────────────────────────────────────┘  │  │ Negotiation   CHA               (−)  [ 2 ]  (+) │   │  │
│                                                        │  └─────────────────────────────────────────────────┘   │  │
│                                                        │                                                         │  │
│                                                        │  ... more skills ...                                    │  │
│                                                        │                                                         │  │
│                                                        └─────────────────────────────────────────────────────────┘  │
│                                                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  ┌───────────────────────────────────────────┐  │
│  │ SPELLS                                                        │  │ GEAR                                      │  │
│  ├───────────────────────────────────────────────────────────────┤  ├───────────────────────────────────────────┤  │
│  │                                                               │  │                                           │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │  ┌─────────────────────────────────────┐  │  │
│  │  │ Free Spells                                          4  │  │  │  │ Nuyen                       3,200¥  │  │  │
│  │  │ 10 from Priority A (Magician)        of 10 remaining    │  │  │  │ 6,000¥ from Priority E  of 6,000¥   │  │  │
│  │  │ ██████████████████████████████████████████████████████░░│  │  │  │ ████████████████████████████████░░░ │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │  └─────────────────────────────────────┘  │  │
│  │                                                               │  │                                           │  │
│  │  SELECTED SPELLS                               [+ Add]       │  │  PURCHASED GEAR          [All ▾] [+ Add] │  │
│  │                                                               │  │                                           │  │
│  │  ─ COMBAT ─────────────────────────────────────────────────  │  │  ─ WEAPONS ──────────────────────────────│  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │  ┌─────────────────────────────────────┐  │  │
│  │  │ Manabolt              Direct • Mana                     │  │  │  │ Ares Predator V         Heavy Pistol│  │  │
│  │  │ Type: M  Range: LOS  Damage: P  Drain: F-3    [Remove]  │  │  │  │ Acc 5(7) DV 8P AP -1        725¥    │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │  │ └─ Smartgun System         200¥ [×] │  │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │  │                            [Remove] │  │  │
│  │  │ Stunbolt              Direct • Mana                     │  │  │  └─────────────────────────────────────┘  │  │
│  │  │ Type: M  Range: LOS  Damage: S  Drain: F-3    [Remove]  │  │  │                                           │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │  ─ ARMOR ─────────────────────────────── │  │
│  │                                                               │  │  ┌─────────────────────────────────────┐  │  │
│  │  ─ DETECTION ──────────────────────────────────────────────  │  │  │ Armor Vest               Armor: 9   │  │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │  │                              200¥   │  │  │
│  │  │ Detect Life           Active • Mana                     │  │  │  │                            [Remove] │  │  │
│  │  │ Type: M  Range: T(A)  Drain: F-2              [Remove]  │  │  │  └─────────────────────────────────────┘  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │                                           │  │
│  │                                                               │  │  ─ ELECTRONICS ────────────────────────  │  │
│  │  ─ HEALTH ─────────────────────────────────────────────────  │  │  ┌─────────────────────────────────────┐  │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │  │ Meta Link                 Commlink  │  │  │
│  │  │ Heal                  Essence • Mana                    │  │  │  │ Device Rating 1              100¥   │  │  │
│  │  │ Type: M  Range: T  Duration: P  Drain: F-4    [Remove]  │  │  │  │                            [Remove] │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │  └─────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │                                           │  │
│  │  │ Increase Reflexes     Essence • Mana                    │  │  │  ─ LIFESTYLE ────────────────────────── │  │
│  │  │ Type: M  Range: T  Duration: S  Drain: F      [Remove]  │  │  │  ┌─────────────────────────────────────┐  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │  │ Low Lifestyle              1 month  │  │  │
│  │                                                               │  │  │ Basic housing             2,000¥/mo │  │  │
│  │  ─ ILLUSION ───────────────────────────────────────────────  │  │  │                            [Remove] │  │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │  └─────────────────────────────────────┘  │  │
│  │  │ Invisibility          Multi-Sense                       │  │  │                                           │  │
│  │  │ Type: M  Range: LOS  Duration: S  Drain: F-1  [Remove]  │  │  │  2,800¥ spent          3,200¥ remaining  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │                                           │  │
│  │                                                               │  └───────────────────────────────────────────┘  │
│  │  6 spells selected                        4 free remaining   │                                                  │
│  │                                                               │                                                  │
│  └───────────────────────────────────────────────────────────────┘                                                  │
│                                                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                     │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ KNOWLEDGE & LANGUAGES                                                                                         │  │
│  ├───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                                                               │  │
│  │  ┌─────────────────────────────────────────────────────────┐                                                  │  │
│  │  │ Knowledge Points                                     6  │  LANGUAGES                                       │  │
│  │  │ (INT 4 + LOG 5) × 2 = 18 points       of 18 remaining   │  ┌──────────────────────────────────────────┐    │  │
│  │  │ ██████████████████████████████████████████████████░░░░░ │  │ English                           Native │    │  │
│  │  └─────────────────────────────────────────────────────────┘  │ Sperethiel                 (−) [ 3 ] (+) │    │  │
│  │                                                               │                               [+ Add]    │    │  │
│  │  KNOWLEDGE SKILLS                                             └──────────────────────────────────────────┘    │  │
│  │  ┌────────────────────────────────┐ ┌────────────────────────────────┐ ┌────────────────────────────────┐    │  │
│  │  │ Magical Theory    Academic     │ │ Seattle Street Gangs   Street  │ │ Corporate Politics  Professional│    │  │
│  │  │              (−)  [ 4 ]  (+)   │ │              (−)  [ 3 ]  (+)   │ │              (−)  [ 2 ]  (+)   │    │  │
│  │  └────────────────────────────────┘ └────────────────────────────────┘ └────────────────────────────────┘    │  │
│  │                                                                                                   [+ Add]    │  │
│  │                                                                                                               │  │
│  └───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ VALIDATION                                                                                           ● Ready       │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                     │
│  ✓ All priorities assigned                    ✓ Attributes allocated (0 remaining)                                │
│  ✓ Metatype selected: Elf                     ✓ Skills allocated (10 remaining — optional)                        │
│  ✓ Magic path configured: Magician            ✓ Spells selected (4 remaining — optional)                          │
│  ✓ Tradition selected: Hermetic               ✓ Qualities within limits (17 karma remaining)                      │
│  ✓ Special attributes allocated               ✓ Gear within budget (3,200¥ remaining)                             │
│                                                                                                                     │
│  Character is valid and ready to finalize.                                              [Finalize Character →]     │
│                                                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Example: Ork Street Samurai (Priorities: A-Resources, B-Attributes, C-Skills, D-Metatype, E-Magic)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CHARACTER CREATION                                                    [Save Draft]  [Validate]  [Finalize Character]│
│ Unnamed Character • SR5 • Priority                                                              Draft Auto-saved ✓  │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                     │
│  ┌─────────────────────────────────────────────────┐  ┌─────────────────────────────────────────────────────────┐  │
│  │ PRIORITIES                    Drag to reorder ↕ │  │ ATTRIBUTES                                              │  │
│  ├─────────────────────────────────────────────────┤  ├─────────────────────────────────────────────────────────┤  │
│  │                                                 │  │                                                         │  │
│  │  ┌─ A ───────────────────────────────────────┐  │  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │ ≡  RESOURCES                  ● Complete  │  │  │  │  Attribute Points                           0   │   │  │
│  │  │    450,000¥ starting nuyen                │  │  │  │  20 points from Priority B      of 20 remaining │   │  │
│  │  └───────────────────────────────────────────┘  │  │  │  ████████████████████████████████████████████████ │   │  │
│  │                                                 │  │  └─────────────────────────────────────────────────┘   │  │
│  │  ┌─ B ───────────────────────────────────────┐  │  │                                                         │  │
│  │  │ ≡  ATTRIBUTES                 ● Complete  │  │  │  PHYSICAL                                               │  │
│  │  │    20 points to distribute                │  │  │  ┌──────────────────────┐ ┌──────────────────────┐     │  │
│  │  └───────────────────────────────────────────┘  │  │  │ Body         4–9     │ │ Agility      1–6     │     │  │
│  │                                                 │  │  │         (−) [ 6 ] (+)│ │         (−) [ 5 ] (+)│     │  │
│  │  ┌─ C ───────────────────────────────────────┐  │  │  └──────────────────────┘ └──────────────────────┘     │  │
│  │  │ ≡  SKILLS                     ● Complete  │  │  │  ┌──────────────────────┐ ┌──────────────────────┐     │  │
│  │  │    28 skill points • 2 group points       │  │  │  │ Reaction     1–6     │ │ Strength     3–8     │     │  │
│  │  └───────────────────────────────────────────┘  │  │  │         (−) [ 4 ] (+)│ │         (−) [ 6 ] (+)│     │  │
│  │                                                 │  │  └──────────────────────┘ └──────────────────────┘     │  │
│  │  ┌─ D ───────────────────────────────────────┐  │  │                                                         │  │
│  │  │ ≡  METATYPE                   ● Complete  │  │  │  MENTAL                                                 │  │
│  │  │    ORK • 7 special attribute points       │  │  │  ┌──────────────────────┐ ┌──────────────────────┐     │  │
│  │  │    Low-Light Vision                       │  │  │  │ Willpower    1–6     │ │ Logic        1–5     │     │  │
│  │  └───────────────────────────────────────────┘  │  │  │         (−) [ 3 ] (+)│ │         (−) [ 3 ] (+)│     │  │
│  │                                                 │  │  └──────────────────────┘ └──────────────────────┘     │  │
│  │  ┌─ E ───────────────────────────────────────┐  │  │  ┌──────────────────────┐ ┌──────────────────────┐     │  │
│  │  │ ≡  MAGIC / RESONANCE          ● Complete  │  │  │  │ Intuition    1–6     │ │ Charisma     1–5     │     │  │
│  │  │    MUNDANE (auto)                         │  │  │  │         (−) [ 4 ] (+)│ │         (−) [ 2 ] (+)│     │  │
│  │  └───────────────────────────────────────────┘  │  │  └──────────────────────┘ └──────────────────────┘     │  │
│  │                                                 │  │                                                         │  │
│  └─────────────────────────────────────────────────┘  │  ┌─────────────────────────────────────────────────┐   │  │
│                                                        │  │  Special Attribute Points                   1   │   │  │
│  ┌─────────────────────────────────────────────────┐  │  │  7 points from Ork at Priority D of 7 remaining  │   │  │
│  │ KARMA                                           │  │  │  ██████████████████████████████████████████████░░ │   │  │
│  ├─────────────────────────────────────────────────┤  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                 │  │                                                         │  │
│  │  Starting Karma                           25   │  │  SPECIAL                                                │  │
│  │                                                 │  │  ┌──────────────────────┐                              │  │
│  │  Positive Qualities               −21 karma   │  │  │ Edge         1–6     │  No Magic/Resonance          │  │
│  │  Negative Qualities               +15 karma   │  │  │         (−) [ 6 ] (+)|  Mundane character            │  │
│  │  Additional Attribute Points       −0 karma   │  │  └──────────────────────┘                              │  │
│  │                                    ──────────  │  │                                                         │  │
│  │  Available                          19 karma   │  └─────────────────────────────────────────────────────────┘  │
│  │                                                 │                                                               │
│  │  █████████████████████████████████░░░░░░░░░░░░ │  ┌─────────────────────────────────────────────────────────┐  │
│  │                                                 │  │ SKILLS                                                  │  │
│  └─────────────────────────────────────────────────┘  ├─────────────────────────────────────────────────────────┤  │
│                                                        │                                                         │  │
│  ┌─────────────────────────────────────────────────┐  │  ┌────────────────────────┐ ┌────────────────────────┐ │  │
│  │ QUALITIES                                       │  │  │ Skill Points        8  │ │ Skill Group Points  0  │ │  │
│  ├─────────────────────────────────────────────────┤  │  │ 28 pts Priority C      │ │ 2 pts Priority C       │ │  │
│  │                                                 │  │  │ ████████████████░░░░░░ │ │ ████████████████████░░ │ │  │
│  │  ┌───────────────────┐ ┌───────────────────┐   │  │  └────────────────────────┘ └────────────────────────┘ │  │
│  │  │ Positive  21/25   │ │ Negative  15/25   │   │  │                                                         │  │
│  │  │ ████████████████░ │ │ ████████████░░░░░ │   │  │  SKILL GROUPS (Rating 2 from Group Points)             │  │
│  │  └───────────────────┘ └───────────────────┘   │  │  ┌─────────────────────────────────────────────────┐   │  │
│  │                                                 │  │  │ Firearms                         (−)  [ 2 ]  (+) │   │  │
│  │  POSITIVE                          [+ Add]     │  │  │ Automatics, Longarms, Pistols                     │   │  │
│  │  ┌───────────────────────────────────────────┐ │  │  └─────────────────────────────────────────────────┘   │  │
│  │  │ Toughness                         9 karma │ │  │                                                         │  │
│  │  │ +1 Physical damage box           [Remove] │ │  │  ACTIVE SKILLS                      [Search] [All ▾]   │  │
│  │  └───────────────────────────────────────────┘ │  │                                                         │  │
│  │  ┌───────────────────────────────────────────┐ │  │  ─ COMBAT ──────────────────────────────────────────── │  │
│  │  │ High Pain Tolerance (2)          12 karma │ │  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │ Ignore 2 wound modifiers         [Remove] │ │  │  │ Blades        AGI               (−)  [ 5 ]  (+) │   │  │
│  │  └───────────────────────────────────────────┘ │  │  │ Spec: Swords                            +2 dice │   │  │
│  │                                                 │  │  └─────────────────────────────────────────────────┘   │  │
│  │  NEGATIVE                          [+ Add]     │  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  ┌───────────────────────────────────────────┐ │  │  │ Unarmed       AGI               (−)  [ 4 ]  (+) │   │  │
│  │  │ SINner (Criminal)              +10 karma  │ │  │  └─────────────────────────────────────────────────┘   │  │
│  │  │ Criminal record on file          [Remove] │ │  │                                                         │  │
│  │  └───────────────────────────────────────────┘ │  │  ─ PHYSICAL ─────────────────────────────────────────  │  │
│  │  ┌───────────────────────────────────────────┐ │  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │ Bad Rep                          +5 karma │ │  │  │ Sneaking      AGI               (−)  [ 3 ]  (+) │   │  │
│  │  │ Word on the street is bad        [Remove] │ │  │  └─────────────────────────────────────────────────┘   │  │
│  │  └───────────────────────────────────────────┘ │  │  ┌─────────────────────────────────────────────────┐   │  │
│  │                                                 │  │  │ Perception    INT               (−)  [ 3 ]  (+) │   │  │
│  └─────────────────────────────────────────────────┘  │  └─────────────────────────────────────────────────┘   │  │
│                                                        │                                                         │  │
│                                                        │  ... more skills ...                                    │  │
│                                                        │                                                         │  │
│                                                        └─────────────────────────────────────────────────────────┘  │
│                                                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                     │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ GEAR                                                                                                          │  │
│  ├───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                                                               │  │
│  │  ┌─────────────────────────────────────────────────────┐  ┌─────────────────────────────────────────────────┐│  │
│  │  │ Nuyen                                   127,450¥    │  │ Essence                                    4.2  ││  │
│  │  │ 450,000¥ from Priority A        of 450,000¥ remaining│  │ Cyberware installed               of 6.0 starting││  │
│  │  │ ███████████████████████████████████████████████░░░░░│  │ ██████████████████████████████████████████████░░││  │
│  │  └─────────────────────────────────────────────────────┘  └─────────────────────────────────────────────────┘│  │
│  │                                                                                                               │  │
│  │  PURCHASED GEAR                                                                     [All ▾]        [+ Add]  │  │
│  │                                                                                                               │  │
│  │  ─ CYBERWARE ─────────────────────────────────────────────────────────────────────────────────────────────── │  │
│  │  ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐               │  │
│  │  │ Wired Reflexes (Rating 2)                  │ │ Smartlink                                  │               │  │
│  │  │ +2 REA, +2 Initiative Dice    Essence 3.0  │ │ +2 dice with smartgun           Essence 0.2│               │  │
│  │  │ Grade: Standard                 149,000¥   │ │ Grade: Standard                    4,000¥  │               │  │
│  │  │                                  [Remove]  │ │                                  [Remove]  │               │  │
│  │  └────────────────────────────────────────────┘ └────────────────────────────────────────────┘               │  │
│  │  ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐               │  │
│  │  │ Muscle Replacement (Rating 2)              │ │ Bone Lacing (Aluminum)                     │               │  │
│  │  │ +2 STR, +2 AGI                Essence 0.4  │ │ +2 Body for damage                Essence 0.5│               │  │
│  │  │ Grade: Used (−0.1 ESS)           20,000¥   │ │ Grade: Alphaware (−0.2 ESS)       22,500¥  │               │  │
│  │  │                                  [Remove]  │ │                                  [Remove]  │               │  │
│  │  └────────────────────────────────────────────┘ └────────────────────────────────────────────┘               │  │
│  │                                                                                                               │  │
│  │  ─ WEAPONS ───────────────────────────────────────────────────────────────────────────────────────────────── │  │
│  │  ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐               │  │
│  │  │ Ares Predator V              Heavy Pistol  │ │ Katana                               Blade │               │  │
│  │  │ Acc 5(7) DV 8P AP -1 SA                    │ │ Acc 7 Reach 1 DV 10P AP -3                 │               │  │
│  │  │ └─ Smartgun System (int)          200¥     │ │                                            │               │  │
│  │  │ └─ Spare Clip ×3                   15¥     │ │                                    1,000¥  │               │  │
│  │  │                                    940¥    │ │                                  [Remove]  │               │  │
│  │  │                                  [Remove]  │ └────────────────────────────────────────────┘               │  │
│  │  └────────────────────────────────────────────┘                                                               │  │
│  │  ┌────────────────────────────────────────────┐                                                               │  │
│  │  │ Ingram Smartgun X                     SMG  │                                                               │  │
│  │  │ Acc 4(6) DV 8P AP - BF/FA                  │                                                               │  │
│  │  │ └─ Suppressor                     500¥     │                                                               │  │
│  │  │                                  1,300¥    │                                                               │  │
│  │  │                                  [Remove]  │                                                               │  │
│  │  └────────────────────────────────────────────┘                                                               │  │
│  │                                                                                                               │  │
│  │  ─ ARMOR ─────────────────────────────────────────────────────────────────────────────────────────────────── │  │
│  │  ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐               │  │
│  │  │ Armor Jacket                    Armor: 12  │ │ Helmet                            Armor: 2 │               │  │
│  │  │ └─ Fire Resistance 4             800¥      │ │                                      100¥  │               │  │
│  │  │                                  1,800¥    │ │                                  [Remove]  │               │  │
│  │  │                                  [Remove]  │ └────────────────────────────────────────────┘               │  │
│  │  └────────────────────────────────────────────┘                                                               │  │
│  │                                                                                                               │  │
│  │  ─ ELECTRONICS ───────────────────────────────────────────────────────────────────────────────────────────── │  │
│  │  ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐               │  │
│  │  │ Transys Avalon                   Commlink  │ │ Contacts (Rating 3)              Eyewear  │               │  │
│  │  │ Device Rating 6  Firewall 6      5,000¥    │ │ Image Link, Smartlink, Thermo     1,025¥  │               │  │
│  │  │                                  [Remove]  │ │                                  [Remove]  │               │  │
│  │  └────────────────────────────────────────────┘ └────────────────────────────────────────────┘               │  │
│  │                                                                                                               │  │
│  │  ─ LIFESTYLE ─────────────────────────────────────────────────────────────────────────────────────────────── │  │
│  │  ┌────────────────────────────────────────────┐                                                               │  │
│  │  │ Medium Lifestyle                 3 months  │                                                               │  │
│  │  │ Comfortable apartment           5,000¥/mo  │  322,550¥ spent          127,450¥ remaining                  │  │
│  │  │                                 15,000¥    │                                                               │  │
│  │  │                                  [Remove]  │                                                               │  │
│  │  └────────────────────────────────────────────┘                                                               │  │
│  │                                                                                                               │  │
│  └───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ VALIDATION                                                                                           ● Ready       │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                     │
│  ✓ All priorities assigned                    ✓ Attributes allocated (0 remaining)                                │
│  ✓ Metatype selected: Ork                     ✓ Skills allocated (8 remaining — optional)                         │
│  ✓ Mundane (auto-selected at Priority E)      ✓ Qualities within limits (19 karma remaining)                      │
│  ✓ Special attributes allocated               ✓ Gear within budget (127,450¥ remaining)                           │
│  ✓ Essence 4.2 (cyberware installed)                                                                               │
│                                                                                                                     │
│  Character is valid and ready to finalize.                                              [Finalize Character →]     │
│                                                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Layout Notes (Two-Column)

**Two-Column Layout (Top Section):**

- Left column: Priority Selection, Karma tracker, Qualities
- Right column: Attributes, Skills
- Priority drives all other components via their budgets

**Full-Width Sections (Bottom):**

- Spells/Adept Powers + Gear (side by side when both fit)
- Knowledge & Languages (full width)
- Validation summary (always visible at bottom)

---

## Three-Column Layout - Creation Mode

A three-column layout provides better horizontal space usage and clearer visual grouping.

### Column Organization

| Column 1 (Left)    | Column 2 (Center)     | Column 3 (Right)      |
| ------------------ | --------------------- | --------------------- |
| Priority Selection | Attributes            | Skills                |
| Karma Summary      | Special Attributes    | Knowledge & Languages |
| Qualities          | Spells / Adept Powers | Gear                  |

### Example: Elf Magician (Three-Column)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CHARACTER CREATION                                                              [Save Draft]  [Validate]  [Finalize Character →]    │
│ Unnamed Character • SR5 • Priority                                                                            Draft Auto-saved ✓    │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                                      │
│  ┌────────────────────────────────────────┐  ┌────────────────────────────────────────┐  ┌────────────────────────────────────────┐ │
│  │ PRIORITIES          Drag to reorder ↕ │  │ ATTRIBUTES                             │  │ SKILLS                                 │ │
│  ├────────────────────────────────────────┤  ├────────────────────────────────────────┤  ├────────────────────────────────────────┤ │
│  │                                        │  │                                        │  │                                        │ │
│  │  ┌─ A ──────────────────────────────┐  │  │  ┌────────────────────────────────┐   │  │  ┌──────────────┐ ┌──────────────┐    │ │
│  │  │ ≡  MAGIC            ● Complete   │  │  │  │ Attribute Points           5   │   │  │  │ Skill Pts 10 │ │ Group Pts  1 │    │ │
│  │  │    MAGICIAN • Magic 6            │  │  │  │ 20 pts from B    of 20 remain  │   │  │  │ 28 from C    │ │ 2 from C     │    │ │
│  │  │    Tradition: Hermetic           │  │  │  │ ██████████████████████████░░░░ │   │  │  │ █████████░░░ │ │ ██████████░░ │    │ │
│  │  └──────────────────────────────────┘  │  │  └────────────────────────────────┘   │  │  └──────────────┘ └──────────────┘    │ │
│  │                                        │  │                                        │  │                                        │ │
│  │  ┌─ B ──────────────────────────────┐  │  │  PHYSICAL                              │  │  ACTIVE SKILLS          [Search] [▾]  │ │
│  │  │ ≡  ATTRIBUTES       ● Complete   │  │  │  ┌────────────┐ ┌────────────┐        │  │                                        │ │
│  │  │    20 points                     │  │  │  │ BOD    1–6 │ │ AGI    2–7 │        │  │  ─ COMBAT ─────────────────────────── │ │
│  │  └──────────────────────────────────┘  │  │  │  (−)[3](+) │ │  (−)[5](+) │        │  │  ┌────────────────────────────────┐   │ │
│  │                                        │  │  └────────────┘ └────────────┘        │  │  │ Spellcasting MAG      Free 5   │   │ │
│  │  ┌─ C ──────────────────────────────┐  │  │  ┌────────────┐ ┌────────────┐        │  │  │                   (−) [ 5 ] (+) │   │ │
│  │  │ ≡  SKILLS           ● Complete   │  │  │  │ REA    1–6 │ │ STR    1–6 │        │  │  └────────────────────────────────┘   │ │
│  │  │    28 pts • 2 group pts          │  │  │  │  (−)[3](+) │ │  (−)[2](+) │        │  │  ┌────────────────────────────────┐   │ │
│  │  └──────────────────────────────────┘  │  │  └────────────┘ └────────────┘        │  │  │ Counterspelling MAG             │   │ │
│  │                                        │  │                                        │  │  │                   (−) [ 3 ] (+) │   │ │
│  │  ┌─ D ──────────────────────────────┐  │  │  MENTAL                                │  │  └────────────────────────────────┘   │ │
│  │  │ ≡  METATYPE         ● Complete   │  │  │  ┌────────────┐ ┌────────────┐        │  │  ┌────────────────────────────────┐   │ │
│  │  │    ELF • 6 special pts           │  │  │  │ WIL    1–6 │ │ LOG    1–6 │        │  │  │ Pistols AGI           Free 5   │   │ │
│  │  │    Low-Light Vision              │  │  │  │  (−)[4](+) │ │  (−)[5](+) │        │  │  │                   (−) [ 5 ] (+) │   │ │
│  │  └──────────────────────────────────┘  │  │  └────────────┘ └────────────┘        │  │  └────────────────────────────────┘   │ │
│  │                                        │  │  ┌────────────┐ ┌────────────┐        │  │                                        │ │
│  │  ┌─ E ──────────────────────────────┐  │  │  │ INT    1–6 │ │ CHA    3–8 │        │  │  ─ SOCIAL ─────────────────────────── │ │
│  │  │ ≡  RESOURCES        ● Complete   │  │  │  │  (−)[4](+) │ │  (−)[4](+) │        │  │  ┌────────────────────────────────┐   │ │
│  │  │    6,000¥                        │  │  │  └────────────┘ └────────────┘        │  │  │ Etiquette CHA                   │   │ │
│  │  └──────────────────────────────────┘  │  │                                        │  │  │                   (−) [ 3 ] (+) │   │ │
│  │                                        │  ├────────────────────────────────────────┤  │  └────────────────────────────────┘   │ │
│  └────────────────────────────────────────┘  │                                        │  │  ┌────────────────────────────────┐   │ │
│                                              │  ┌────────────────────────────────┐   │  │  │ Negotiation CHA                 │   │ │
│  ┌────────────────────────────────────────┐  │  │ Special Attribute Points   2   │   │  │  │                   (−) [ 2 ] (+) │   │ │
│  │ KARMA                                  │  │  │ 6 pts from Elf D  of 6 remain  │   │  │  └────────────────────────────────┘   │ │
│  ├────────────────────────────────────────┤  │  │ █████████████████████████░░░░░ │   │  │                                        │ │
│  │                                        │  │  └────────────────────────────────┘   │  │  ─ PHYSICAL ────────────────────────  │ │
│  │  Starting                        25   │  │                                        │  │  ┌────────────────────────────────┐   │ │
│  │  Positive Qualities             −18   │  │  SPECIAL                               │  │  │ Sneaking AGI                    │   │ │
│  │  Negative Qualities             +10   │  │  ┌────────────┐ ┌────────────┐        │  │  │                   (−) [ 2 ] (+) │   │ │
│  │                          ───────────  │  │  │ EDG    1–6 │ │ MAG    1–6 │        │  │  └────────────────────────────────┘   │ │
│  │  Available                   17 karma │  │  │  (−)[2](+) │ │  (−)[6](+) │        │  │                                        │ │
│  │                                        │  │  │            │ │  Magician  │        │  │  ... more skills ...                   │ │
│  │  ████████████████████████████░░░░░░░░ │  │  └────────────┘ └────────────┘        │  │                                        │ │
│  │                                        │  │                                        │  ├────────────────────────────────────────┤ │
│  └────────────────────────────────────────┘  └────────────────────────────────────────┘  │                                        │ │
│                                                                                          │  KNOWLEDGE & LANGUAGES                 │ │
│  ┌────────────────────────────────────────┐  ┌────────────────────────────────────────┐  ├────────────────────────────────────────┤ │
│  │ QUALITIES                              │  │ SPELLS                                 │  │                                        │ │
│  ├────────────────────────────────────────┤  ├────────────────────────────────────────┤  │  ┌────────────────────────────────┐   │ │
│  │                                        │  │                                        │  │  │ Knowledge Points           6   │   │ │
│  │  ┌───────────────┐ ┌───────────────┐  │  │  ┌────────────────────────────────┐   │  │  │ (INT+LOG)×2 = 18  of 18 remain │   │ │
│  │  │ Pos    18/25  │ │ Neg    10/25  │  │  │  │ Free Spells                 4  │   │  │  │ ██████████████████████████░░░░ │   │ │
│  │  │ ██████████░░░ │ │ ████████░░░░░ │  │  │  │ 10 from A      of 10 remaining │   │  │  └────────────────────────────────┘   │ │
│  │  └───────────────┘ └───────────────┘  │  │  │ ████████████████████████████░░ │   │  │                                        │ │
│  │                                        │  │  └────────────────────────────────┘   │  │  LANGUAGES                             │ │
│  │  POSITIVE                    [+ Add]  │  │                                        │  │  ┌────────────────────────────────┐   │ │
│  │  ┌──────────────────────────────────┐ │  │  SELECTED                    [+ Add]  │  │  │ English                 Native │   │ │
│  │  │ Exceptional Attr (AGI)   14 karma│ │  │                                        │  │  │ Sperethiel        (−) [ 3 ] (+)│   │ │
│  │  │ Agility max now 8        [Remove]│ │  │  ─ COMBAT ─────────────────────────── │  │  └────────────────────────────────┘   │ │
│  │  └──────────────────────────────────┘ │  │  ┌────────────────────────────────┐   │  │                             [+ Add]   │ │
│  │  ┌──────────────────────────────────┐ │  │  │ Manabolt         Direct • Mana │   │  │                                        │ │
│  │  │ Ambidextrous              4 karma│ │  │  │ M  LOS  P  I  F-3     [Remove] │   │  │  KNOWLEDGE                             │ │
│  │  │ No off-hand penalty      [Remove]│ │  │  └────────────────────────────────┘   │  │  ┌────────────────────────────────┐   │ │
│  │  └──────────────────────────────────┘ │  │  ┌────────────────────────────────┐   │  │  │ Magical Theory    (−) [ 4 ] (+)│   │ │
│  │                                        │  │  │ Stunbolt         Direct • Mana │   │  │  │ Academic                       │   │ │
│  │  NEGATIVE                    [+ Add]  │  │  │ M  LOS  S  I  F-3     [Remove] │   │  │  └────────────────────────────────┘   │ │
│  │  ┌──────────────────────────────────┐ │  │  └────────────────────────────────┘   │  │  ┌────────────────────────────────┐   │ │
│  │  │ Allergy (Common, Mod)   +10 karma│ │  │                                        │  │  │ Seattle Gangs     (−) [ 3 ] (+)│   │ │
│  │  │ Pollutants               [Remove]│ │  │  ─ DETECTION ──────────────────────── │  │  │ Street                         │   │ │
│  │  └──────────────────────────────────┘ │  │  ┌────────────────────────────────┐   │  │  └────────────────────────────────┘   │ │
│  │                                        │  │  │ Detect Life     Active • Mana  │   │  │                             [+ Add]   │ │
│  └────────────────────────────────────────┘  │  │ M  T(A)  S  F-2       [Remove] │   │  │                                        │ │
│                                              │  └────────────────────────────────┘   │  └────────────────────────────────────────┘ │
│                                              │                                        │                                            │
│                                              │  ─ HEALTH ────────────────────────────│  ┌────────────────────────────────────────┐ │
│                                              │  ┌────────────────────────────────┐   │  │ GEAR                                   │ │
│                                              │  │ Heal           Essence • Mana  │   │  ├────────────────────────────────────────┤ │
│                                              │  │ M  T  P  F-4         [Remove] │   │  │                                        │ │
│                                              │  └────────────────────────────────┘   │  │  ┌────────────────────────────────┐   │ │
│                                              │  ┌────────────────────────────────┐   │  │  │ Nuyen                   3,200¥  │   │ │
│                                              │  │ Increase Reflexes  Ess • Mana  │   │  │  │ 6,000¥ from E   of 6,000 remain│   │ │
│                                              │  │ M  T  S  F             [Remove] │   │  │  │ ████████████████████████████░░ │   │ │
│                                              │  └────────────────────────────────┘   │  │  └────────────────────────────────┘   │ │
│                                              │                                        │  │                                        │ │
│                                              │  ─ ILLUSION ──────────────────────────│  │  PURCHASED               [▾] [+ Add]  │ │
│                                              │  ┌────────────────────────────────┐   │  │                                        │ │
│                                              │  │ Invisibility     Multi-Sense   │   │  │  ─ WEAPONS ─────────────────────────  │ │
│                                              │  │ M  LOS  S  F-1       [Remove] │   │  │  ┌────────────────────────────────┐   │ │
│                                              │  └────────────────────────────────┘   │  │  │ Ares Predator V     Heavy Pistol│   │ │
│                                              │                                        │  │  │ Acc 5(7) DV 8P AP -1     725¥  │   │ │
│                                              │  6 selected             4 remaining   │  │  │ └ Smartgun System        200¥  │   │ │
│                                              │                                        │  │  │                       [Remove] │   │ │
│                                              └────────────────────────────────────────┘  │  └────────────────────────────────┘   │ │
│                                                                                          │                                        │ │
│                                                                                          │  ─ ARMOR ──────────────────────────── │ │
│                                                                                          │  ┌────────────────────────────────┐   │ │
│                                                                                          │  │ Armor Vest           Armor: 9  │   │ │
│                                                                                          │  │                          200¥  │   │ │
│                                                                                          │  │                       [Remove] │   │ │
│                                                                                          │  └────────────────────────────────┘   │ │
│                                                                                          │                                        │ │
│                                                                                          │  ─ LIFESTYLE ────────────────────────│ │
│                                                                                          │  ┌────────────────────────────────┐   │ │
│                                                                                          │  │ Low Lifestyle         1 month  │   │ │
│                                                                                          │  │                      2,000¥/mo │   │ │
│                                                                                          │  │                       [Remove] │   │ │
│                                                                                          │  └────────────────────────────────┘   │ │
│                                                                                          │                                        │ │
│                                                                                          │  2,800¥ spent      3,200¥ remaining   │ │
│                                                                                          │                                        │ │
│                                                                                          └────────────────────────────────────────┘ │
│                                                                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ VALIDATION                                                                                                              ● Ready     │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  ✓ Priorities assigned    ✓ Metatype: Elf     ✓ Magician/Hermetic    ✓ Attributes (0 left)    ✓ Skills (10 left)    ✓ Valid       │
│                                                                                                                                      │
│  Character is valid and ready to finalize.                                                            [Finalize Character →]        │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Example: Ork Street Samurai (Three-Column)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CHARACTER CREATION                                                              [Save Draft]  [Validate]  [Finalize Character →]    │
│ Unnamed Character • SR5 • Priority                                                                            Draft Auto-saved ✓    │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                                      │
│  ┌────────────────────────────────────────┐  ┌────────────────────────────────────────┐  ┌────────────────────────────────────────┐ │
│  │ PRIORITIES          Drag to reorder ↕ │  │ ATTRIBUTES                             │  │ SKILLS                                 │ │
│  ├────────────────────────────────────────┤  ├────────────────────────────────────────┤  ├────────────────────────────────────────┤ │
│  │                                        │  │                                        │  │                                        │ │
│  │  ┌─ A ──────────────────────────────┐  │  │  ┌────────────────────────────────┐   │  │  ┌──────────────┐ ┌──────────────┐    │ │
│  │  │ ≡  RESOURCES        ● Complete   │  │  │  │ Attribute Points           0   │   │  │  │ Skill Pts  8 │ │ Group Pts  0 │    │ │
│  │  │    450,000¥                      │  │  │  │ 20 pts from B    of 20 remain  │   │  │  │ 28 from C    │ │ 2 from C     │    │ │
│  │  └──────────────────────────────────┘  │  │  │ ████████████████████████████████│   │  │  │ ████████░░░░ │ │ ██████████████│    │ │
│  │                                        │  │  └────────────────────────────────┘   │  │  └──────────────┘ └──────────────┘    │ │
│  │  ┌─ B ──────────────────────────────┐  │  │                                        │  │                                        │ │
│  │  │ ≡  ATTRIBUTES       ● Complete   │  │  │  PHYSICAL                              │  │  SKILL GROUPS                          │ │
│  │  │    20 points                     │  │  │  ┌────────────┐ ┌────────────┐        │  │  ┌────────────────────────────────┐   │ │
│  │  └──────────────────────────────────┘  │  │  │ BOD    4–9 │ │ AGI    1–6 │        │  │  │ Firearms              (+2 grp) │   │ │
│  │                                        │  │  │  (−)[6](+) │ │  (−)[5](+) │        │  │  │                   (−) [ 2 ] (+) │   │ │
│  │  ┌─ C ──────────────────────────────┐  │  │  └────────────┘ └────────────┘        │  │  └────────────────────────────────┘   │ │
│  │  │ ≡  SKILLS           ● Complete   │  │  │  ┌────────────┐ ┌────────────┐        │  │                                        │ │
│  │  │    28 pts • 2 group pts          │  │  │  │ REA    1–6 │ │ STR    3–8 │        │  │  ACTIVE SKILLS          [Search] [▾]  │ │
│  │  └──────────────────────────────────┘  │  │  │  (−)[4](+) │ │  (−)[6](+) │        │  │                                        │ │
│  │                                        │  │  └────────────┘ └────────────┘        │  │  ─ COMBAT ─────────────────────────── │ │
│  │  ┌─ D ──────────────────────────────┐  │  │                                        │  │  ┌────────────────────────────────┐   │ │
│  │  │ ≡  METATYPE         ● Complete   │  │  │  MENTAL                                │  │  │ Blades AGI                      │   │ │
│  │  │    ORK • 7 special pts           │  │  │  ┌────────────┐ ┌────────────┐        │  │  │ Spec: Swords           +2 dice  │   │ │
│  │  │    Low-Light Vision              │  │  │  │ WIL    1–6 │ │ LOG    1–5 │        │  │  │                   (−) [ 5 ] (+) │   │ │
│  │  └──────────────────────────────────┘  │  │  │  (−)[3](+) │ │  (−)[3](+) │        │  │  └────────────────────────────────┘   │ │
│  │                                        │  │  └────────────┘ └────────────┘        │  │  ┌────────────────────────────────┐   │ │
│  │  ┌─ E ──────────────────────────────┐  │  │  ┌────────────┐ ┌────────────┐        │  │  │ Unarmed AGI                     │   │ │
│  │  │ ≡  MAGIC            ● Complete   │  │  │  │ INT    1–6 │ │ CHA    1–5 │        │  │  │                   (−) [ 4 ] (+) │   │ │
│  │  │    MUNDANE (auto)                │  │  │  │  (−)[4](+) │ │  (−)[2](+) │        │  │  └────────────────────────────────┘   │ │
│  │  └──────────────────────────────────┘  │  │  └────────────┘ └────────────┘        │  │                                        │ │
│  │                                        │  ├────────────────────────────────────────┤  │  ─ PHYSICAL ────────────────────────  │ │
│  └────────────────────────────────────────┘  │                                        │  │  ┌────────────────────────────────┐   │ │
│                                              │  ┌────────────────────────────────┐   │  │  │ Sneaking AGI                    │   │ │
│  ┌────────────────────────────────────────┐  │  │ Special Attribute Points   1   │   │  │  │                   (−) [ 3 ] (+) │   │ │
│  │ KARMA                                  │  │  │ 7 pts from Ork D  of 7 remain  │   │  │  └────────────────────────────────┘   │ │
│  ├────────────────────────────────────────┤  │  │ █████████████████████████████░ │   │  │  ┌────────────────────────────────┐   │ │
│  │                                        │  │  └────────────────────────────────┘   │  │  │ Perception INT                  │   │ │
│  │  Starting                        25   │  │                                        │  │  │                   (−) [ 3 ] (+) │   │ │
│  │  Positive Qualities             −21   │  │  SPECIAL                               │  │  └────────────────────────────────┘   │ │
│  │  Negative Qualities             +15   │  │  ┌────────────┐                        │  │                                        │ │
│  │                          ───────────  │  │  │ EDG    1–6 │  No Magic/Resonance   │  │  ... more skills ...                   │ │
│  │  Available                   19 karma │  │  │  (−)[6](+) │  Mundane character    │  │                                        │ │
│  │                                        │  │  └────────────┘                        │  ├────────────────────────────────────────┤ │
│  │  █████████████████████████████░░░░░░░ │  │                                        │  │                                        │ │
│  │                                        │  └────────────────────────────────────────┘  │  KNOWLEDGE & LANGUAGES                 │ │
│  └────────────────────────────────────────┘                                              ├────────────────────────────────────────┤ │
│                                              ┌────────────────────────────────────────┐  │                                        │ │
│  ┌────────────────────────────────────────┐  │ ESSENCE TRACKER                        │  │  ┌────────────────────────────────┐   │ │
│  │ QUALITIES                              │  ├────────────────────────────────────────┤  │  │ Knowledge Points          12   │   │ │
│  ├────────────────────────────────────────┤  │                                        │  │  │ (INT+LOG)×2 = 14 of 14 remain  │   │ │
│  │                                        │  │  ┌────────────────────────────────┐   │  │  │ ██████████████░░░░░░░░░░░░░░░░ │   │ │
│  │  ┌───────────────┐ ┌───────────────┐  │  │  │ Essence                   4.2  │   │  │  └────────────────────────────────┘   │ │
│  │  │ Pos    21/25  │ │ Neg    15/25  │  │  │  │ Cyberware       of 6.0 starting │   │  │                                        │ │
│  │  │ █████████████░│ │ ████████████░░│  │  │  │ ██████████████████████████████░ │   │  │  LANGUAGES                             │ │
│  │  └───────────────┘ └───────────────┘  │  │  └────────────────────────────────┘   │  │  ┌────────────────────────────────┐   │ │
│  │                                        │  │                                        │  │  │ Or'zet                  Native │   │ │
│  │  POSITIVE                    [+ Add]  │  │  Cyberware installed:                  │  │  │ English           (−) [ 4 ] (+)│   │ │
│  │  ┌──────────────────────────────────┐ │  │  • Wired Reflexes 2        Ess 3.0    │  │  └────────────────────────────────┘   │ │
│  │  │ Toughness                 9 karma│ │  │  • Smartlink               Ess 0.2    │  │                             [+ Add]   │ │
│  │  │ +1 Physical box          [Remove]│ │  │  • Muscle Replacement 2   Ess 0.4    │  │                                        │ │
│  │  └──────────────────────────────────┘ │  │  • Bone Lacing (Alum)      Ess 0.4    │  │  KNOWLEDGE                             │ │
│  │  ┌──────────────────────────────────┐ │  │                     ────────────────  │  │  ┌────────────────────────────────┐   │ │
│  │  │ High Pain Tolerance(2)   12 karma│ │  │  Total Essence Lost:           4.0    │  │  │ Security Procedures (−)[2](+)  │   │ │
│  │  │ Ignore 2 wound mod       [Remove]│ │  │                                        │  │  │ Professional                   │   │ │
│  │  └──────────────────────────────────┘ │  └────────────────────────────────────────┘  │  └────────────────────────────────┘   │ │
│  │                                        │                                              │                             [+ Add]   │ │
│  │  NEGATIVE                    [+ Add]  │                                              │                                        │ │
│  │  ┌──────────────────────────────────┐ │                                              └────────────────────────────────────────┘ │
│  │  │ SINner (Criminal)       +10 karma│ │                                                                                         │
│  │  │ Criminal record          [Remove]│ │  ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│  │  └──────────────────────────────────┘ │  │ GEAR                                                                               │ │
│  │  ┌──────────────────────────────────┐ │  ├────────────────────────────────────────────────────────────────────────────────────┤ │
│  │  │ Bad Rep                  +5 karma│ │  │                                                                                    │ │
│  │  │ Word on street is bad    [Remove]│ │  │  ┌──────────────────────────────────────────────────────────────────────────────┐ │ │
│  │  └──────────────────────────────────┘ │  │  │ Nuyen                                                               127,450¥  │ │ │
│  │                                        │  │  │ 450,000¥ from Priority A                               of 450,000¥ remaining │ │ │
│  └────────────────────────────────────────┘  │  │ █████████████████████████████████████████████████████████████████████████░░░░░│ │ │
│                                              │  └──────────────────────────────────────────────────────────────────────────────┘ │ │
│                                              │                                                                                    │ │
│                                              │  PURCHASED GEAR                                                     [▾] [+ Add]  │ │
│                                              │                                                                                    │ │
│                                              │  ─ CYBERWARE ─────────────────────────────────────────────────────────────────── │ │
│                                              │  ┌────────────────────────────┐┌────────────────────────────┐┌──────────────────┐│ │
│                                              │  │ Wired Reflexes 2           ││ Smartlink                  ││ Muscle Repl 2    ││ │
│                                              │  │ +2 REA, +2 Init    Ess 3.0 ││ +2 dice smartgun   Ess 0.2 ││ +2 STR/AGI Ess0.4││ │
│                                              │  │ Standard        149,000¥   ││ Standard           4,000¥  ││ Used     20,000¥ ││ │
│                                              │  │                   [Remove] ││                   [Remove] ││         [Remove] ││ │
│                                              │  └────────────────────────────┘└────────────────────────────┘└──────────────────┘│ │
│                                              │  ┌────────────────────────────┐                                                   │ │
│                                              │  │ Bone Lacing (Aluminum)     │                                                   │ │
│                                              │  │ +2 BOD dmg resist  Ess 0.4 │                                                   │ │
│                                              │  │ Alphaware         22,500¥  │                                                   │ │
│                                              │  │                   [Remove] │                                                   │ │
│                                              │  └────────────────────────────┘                                                   │ │
│                                              │                                                                                    │ │
│                                              │  ─ WEAPONS ───────────────────────────────────────────────────────────────────── │ │
│                                              │  ┌────────────────────────────┐┌────────────────────────────┐┌──────────────────┐│ │
│                                              │  │ Ares Predator V            ││ Katana                     ││ Ingram Smartgun X││ │
│                                              │  │ Heavy Pistol               ││ Blade                      ││ SMG              ││ │
│                                              │  │ Acc 5(7) DV 8P AP -1       ││ Acc 7 R1 DV 10P AP -3      ││ Acc 4(6) DV 8P   ││ │
│                                              │  │ └ Smartgun Sys      200¥   ││                    1,000¥  ││ └ Suppressor 500¥││ │
│                                              │  │ └ Spare Clip ×3      15¥   ││                   [Remove] ││         1,300¥   ││ │
│                                              │  │                     940¥   │└────────────────────────────┘│         [Remove] ││ │
│                                              │  │                   [Remove] │                              └──────────────────┘│ │
│                                              │  └────────────────────────────┘                                                   │ │
│                                              │                                                                                    │ │
│                                              │  ─ ARMOR ─────────────────────────────────────────────────────────────────────── │ │
│                                              │  ┌────────────────────────────┐┌────────────────────────────┐                    │ │
│                                              │  │ Armor Jacket    Armor: 12  ││ Helmet            Armor: 2 │                    │ │
│                                              │  │ └ Fire Resistance 4  800¥  ││                      100¥  │                    │ │
│                                              │  │                   1,800¥   ││                   [Remove] │                    │ │
│                                              │  │                   [Remove] │└────────────────────────────┘                    │ │
│                                              │  └────────────────────────────┘                                                   │ │
│                                              │                                                                                    │ │
│                                              │  ─ ELECTRONICS & LIFESTYLE ───────────────────────────────────────────────────── │ │
│                                              │  ┌────────────────────────────┐┌────────────────────────────┐┌──────────────────┐│ │
│                                              │  │ Transys Avalon             ││ Contacts (R3)              ││ Medium Lifestyle ││ │
│                                              │  │ Commlink DR 6     5,000¥   ││ Image/Smart/Thermo 1,025¥  ││ 3 months 15,000¥ ││ │
│                                              │  │                   [Remove] ││                   [Remove] ││         [Remove] ││ │
│                                              │  └────────────────────────────┘└────────────────────────────┘└──────────────────┘│ │
│                                              │                                                                                    │ │
│                                              │  322,550¥ spent                                               127,450¥ remaining │ │
│                                              │                                                                                    │ │
│                                              └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ VALIDATION                                                                                                              ● Ready     │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  ✓ Priorities    ✓ Metatype: Ork    ✓ Mundane (auto)    ✓ Attributes (0)    ✓ Skills (8)    ✓ Essence 4.2    ✓ Gear (127k¥)       │
│                                                                                                                                      │
│  Character is valid and ready to finalize.                                                            [Finalize Character →]        │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Layout Notes (Three-Column)

**Column 1 - Character Foundation:**

- Priority Selection (drives all budgets)
- Karma Summary (shows spending from qualities)
- Qualities (positive/negative)

**Column 2 - Core Stats:**

- Attributes (physical, mental, special)
- Essence Tracker (for characters with cyberware)
- Spells / Adept Powers (for awakened characters)

**Column 3 - Abilities & Equipment:**

- Skills (active, groups, specializations)
- Knowledge & Languages
- Gear (full width when column 2 has less content)

**Gear Section:**

- For mundane characters with Priority A Resources, Gear expands to span columns 2-3
- This gives more room for extensive equipment lists
- Uses card-based layout with items in rows

**Responsive Behavior:**

- Desktop (1400px+): Full three-column layout
- Tablet (1024-1400px): Two columns (merge columns 2+3)
- Mobile (<1024px): Single column, stacked vertically

**Key Differences from Two-Column:**

- More horizontal space utilization
- Gear section can expand for equipment-heavy builds
- Better visual grouping (foundation | stats | abilities)
- Less vertical scrolling on wide screens
- Essence tracker prominently visible for street samurai builds

---

## Contacts Component

Contacts represent the character's network of useful people in the shadows.
Uses header + [Add] button + modal pattern.

**Budget:** CHA × 3 points (e.g., CHA 4 = 12 points)
**Per Contact:** Connection (1-6) + Loyalty (1-6) = points spent
**Minimum:** 1 contact required

### Standard State (Contacts Added)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ CONTACTS                                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Contact Points                                                    4  │  │
│  │  CHA 4 × 3 = 12 points                              of 12 remaining  │  │
│  │  ██████████████████████████████████████████████████████████████░░░░░ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  YOUR CONTACTS                                                    [+ Add]  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  "Fixer" Mike                                              Fixer      │  │
│  │  Your go-to guy for finding work and moving goods                     │  │
│  │                                                                       │  │
│  │  Connection                          Loyalty                          │  │
│  │  ○ ○ ○ ● ○ ○                        ○ ○ ● ○ ○ ○                       │  │
│  │  (−) [ 4 ] (+)                      (−) [ 3 ] (+)              7 pts  │  │
│  │                                                                       │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Dr. Sarah Chen                                        Street Doc     │  │
│  │  No questions asked medical care in Redmond                           │  │
│  │                                                                       │  │
│  │  Connection                          Loyalty                          │  │
│  │  ○ ○ ● ○ ○ ○                        ○ ● ○ ○ ○ ○                       │  │
│  │  (−) [ 3 ] (+)                      (−) [ 2 ] (+)              5 pts  │  │
│  │                                                                       │  │
│  │                                                           [Remove]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  8 points spent                                          4 points remaining│
│  2 contacts                                                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Contact Add/Edit Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ADD CONTACT                                                             [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  4 points remaining                                                         │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Name *                                                               │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │ Detective Kate Murphy                                           │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Type                                                                 │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │ Lone Star Detective                                         ▾  │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                       │  │
│  │  Common types: Fixer, Street Doc, Gang Leader, Corp Exec,            │  │
│  │  Talismonger, Arms Dealer, Info Broker, Bartender, Journalist...     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  CONNECTION                                         How powerful/useful│  │
│  │                                                                       │  │
│  │     1         2         3         4         5         6               │  │
│  │    [ ]       [ ]       [●]       [ ]       [ ]       [ ]              │  │
│  │  Street    Useful    Well-    Signif-   Major    Power-              │  │
│  │   level             connected  icant    player    broker              │  │
│  │                                                                       │  │
│  │  A Lone Star detective with access to case files and patrol routes   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  LOYALTY                                          How much they trust │  │
│  │                                                                       │  │
│  │     1         2         3         4         5         6               │  │
│  │    [ ]       [●]       [ ]       [ ]       [ ]       [ ]              │  │
│  │  Just biz   Reliable  Buddy    Close    Best     Blood              │  │
│  │                               friend   friend                        │  │
│  │                                                                       │  │
│  │  Will help for pay, but won't stick their neck out                   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Description (optional)                                               │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │ Crooked cop who owes you for saving her partner. Can run       │  │  │
│  │  │ plates, check records, and tip you off about investigations.   │  │  │
│  │  │                                                                 │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Cost: 5 points (Connection 3 + Loyalty 2)                1 pt remaining   │
│                                              [Cancel]        [Add Contact] │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Validation: Exceeds Budget

```
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  CONNECTION                                                           │  │
│  │     1         2         3         4         5         6               │  │
│  │    [ ]       [ ]       [ ]       [ ]       [●]       [ ]              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  LOYALTY                                                              │  │
│  │     1         2         3         4         5         6               │  │
│  │    [ ]       [ ]       [ ]       [●]       [ ]       [ ]              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Cost: 9 points (Connection 5 + Loyalty 4)             ⚠ Exceeds budget   │
│  ⚠ 5 points over — reduce Connection or Loyalty                           │
│                                              [Cancel]        [Add Contact] │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Validation: No Contacts

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ CONTACTS                                                     ○ Need 1+ contact│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Contact Points                                                   12  │  │
│  │  CHA 4 × 3 = 12 points                              of 12 remaining  │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  YOUR CONTACTS                                                    [+ Add]  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │             No contacts yet — every runner needs connections          │  │
│  │                                                                       │  │
│  │                          [+ Add Your First Contact]                   │  │
│  │                                                                       │  │
│  │  Examples: Fixer (finds you work), Street Doc (patches you up),       │  │
│  │  Info Broker (knows things), Bartender (hears rumors)                 │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Contact Card States (Compact for Three-Column)

```
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────┐   │
│  │ "Fixer" Mike           Fixer    │ │ Dr. Sarah Chen      Street Doc  │   │
│  │ Conn: ●●●●○○  Loy: ●●●○○○       │ │ Conn: ●●●○○○  Loy: ●●○○○○       │   │
│  │                    7 pts  [×]   │ │                    5 pts  [×]   │   │
│  └─────────────────────────────────┘ └─────────────────────────────────┘   │
```

---

## Identities & SINs Component

Manages the character's System Identification Numbers (legal and fake),
attached licenses, and associated lifestyles.

**Key Rules (SR5):**

- **Fake SINs:** Rating 1-4 only, cost = Rating × 2,500¥
- **Fake Licenses:** Rating 1-4 only, cost = Rating × 200¥
- **Real SIN:** From SINner negative quality (National, Criminal, Corporate Limited, Corporate Born)
- **Real Licenses:** No rating, tied to real SIN
- **Licenses must match SIN type:** Fake licenses for fake SIN, real licenses for real SIN
- **Lifestyles:** Can be associated with an identity, monthly or permanent (100× monthly cost)

### Identity Card - Populated State

Shows a fully configured identity with SIN, licenses, and lifestyle.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  Jimmy Smith                                        [Edit]     [Remove]     │
│                                                      gray        red        │
│  ┌──────────────────────┐                                                   │
│  │ Fake SIN (Rating 4)  │  ← Blue/purple pill badge                         │
│  └──────────────────────┘                                                   │
│                                                                             │
│  Licenses (2)                                          [+ Add License]      │
│                                                           blue button       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Pistol (Rating 4)                                   Edit   Remove    │  │
│  │                                                      blue    red      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Conceal Carry (Rating 4)                            Edit   Remove    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Associated Lifestyle                                  [Edit Lifestyle]     │
│                                                           blue button       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Medium                                                      Remove   │  │
│  │  Monthly: ¥5,000                                              red     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Identity Card - Empty State

Shows an identity with no licenses or lifestyle yet.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  Tom                                                [Edit]     [Remove]     │
│                                                                             │
│  ┌──────────────────────┐                                                   │
│  │ Fake SIN (Rating 1)  │                                                   │
│  └──────────────────────┘                                                   │
│                                                                             │
│  Licenses                                              [+ Add License]      │
│                                                                             │
│  No licenses added yet. Click "Add License" to add a license to this        │
│  identity.                                                                  │
│                                                                             │
│  Associated Lifestyle                                  [+ Add Lifestyle]    │
│                                                                             │
│  No lifestyle associated yet. Click "Add Lifestyle" to create or select     │
│  a lifestyle for this identity.                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Identity Card - Real SIN (SINner Quality)

Shows an identity with a real SIN from the SINner negative quality.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  John Smith                                         [Edit]     [Remove]     │
│                                                                             │
│  ┌─────────────────────────────────┐                                        │
│  │ Real SIN (National)            │  ← Green/emerald pill badge             │
│  └─────────────────────────────────┘                                        │
│                                                                             │
│  Licenses                                              [+ Add License]      │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Driver's License                                    Edit   Remove    │  │
│  │  (no rating - real license)                                           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Associated Lifestyle                                  [+ Add Lifestyle]    │
│  ...                                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### New Identity Modal

Modal for creating a new identity with SIN type selection.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  New Identity                                                               │
│                                                                             │
│  Identity Name                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ e.g., John Smith, Jane Doe                                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  SIN Type                                                                   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ┌─────────────────────────────────────────────────────────────────┐ │    │
│  │ │                                                                 │ │    │
│  │ │  Fake SIN                                    ← Selected (blue   │ │    │
│  │ │  Purchased as gear (Rating 1-4)                 border)         │ │    │
│  │ │                                                                 │ │    │
│  │ └─────────────────────────────────────────────────────────────────┘ │    │
│  │                                                                     │    │
│  │ ┌─────────────────────────────────────────────────────────────────┐ │    │
│  │ │                                                                 │ │    │
│  │ │  Real SIN  (Requires SINner quality)  ← amber/yellow text       │ │    │
│  │ │  From SINner quality                                            │ │    │
│  │ │                                                                 │ │    │
│  │ └─────────────────────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Fake SIN Rating                                                    │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────┐        │    │
│  │  │ Rating 1                                              ▾ │        │    │
│  │  └─────────────────────────────────────────────────────────┘        │    │
│  │                                                                     │    │
│  │  ⚠ No fake SINs found in gear. Make sure to purchase a fake SIN    │    │
│  │    in the Gear step first.                        ← amber warning   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│                                                   [Cancel]  [Save Identity] │
│                                                    gray       blue          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Conditional Display:**

- "Fake SIN Rating" section only shows when "Fake SIN" is selected
- Warning about gear only shows if no fake SINs purchased in Gear step
- "Real SIN" option is disabled/grayed if character doesn't have SINner quality
- If Real SIN selected, show the SINner quality type (National, Criminal, etc.)

### New License Modal

Modal for adding a license to an identity.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  New License                                                                │
│                                                                             │
│  License Name/Type                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ e.g., Firearms License, Driver's License                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Common license types:                                                      │
│  ┌──────────────────┐ ┌────────────────────┐ ┌─────────────────┐            │
│  │ Firearms License │ │ Magic User License │ │ Driver's License│            │
│  └──────────────────┘ └────────────────────┘ └─────────────────┘            │
│  ┌──────────────────┐ ┌───────────────────────────────┐                     │
│  │Vehicle Registr.. │ │ Restricted Augmentation Lic.. │                     │
│  └──────────────────┘ └───────────────────────────────┘                     │
│  ┌──────────────────┐ ┌────────────────────────────┐                        │
│  │ Security License │ │ Private Investigator Lic.. │                        │
│  └──────────────────┘ └────────────────────────────┘                        │
│  ┌──────────────────────┐ ┌───────────────────┐ ┌────────────────┐          │
│  │ Bounty Hunter License│ │ Bodyguard License │ │Academic License│          │
│  └──────────────────────┘ └───────────────────┘ └────────────────┘          │
│  ┌───────────────┐                                                          │
│  │ Media License │  ← Clickable chip/tag buttons                            │
│  └───────────────┘                                                          │
│                                                                             │
│  License Type                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Fake License (matches fake SIN)                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│  License type automatically matches the identity's SIN type.                │
│                                                                             │
│  License Rating                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Rating 1                                                          ▾ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│  Fake licenses must have a rating between 1-4. Higher ratings are more      │
│  expensive but harder to detect.                                            │
│                                                                             │
│  Notes (Optional)                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Additional notes about this license...                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│                                                   [Cancel]  [Save License]  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Conditional Display:**

- License Rating dropdown only shows for fake licenses (real licenses have no rating)
- Rating options are 1-4 only
- License Type field is read-only, auto-set based on identity's SIN type

### New Lifestyle Modal

Modal for associating a lifestyle with an identity.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  New Lifestyle                                                              │
│                                                                             │
│  Lifestyle Type *                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Select a lifestyle...                                             ▾ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Options: Street (Free), Squatter (500¥), Low (2,000¥), Medium (5,000¥),    │
│           High (10,000¥), Luxury (100,000¥)                                 │
│                                                                             │
│  Location (Optional)                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ e.g., Downtown Seattle, Redmond Barrens                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Modifications                                             [+ Add Modification]│
│                                                                             │
│  No modifications added. Click "Add Modification" to add lifestyle          │
│  modifications.                                                             │
│                                                                             │
│  Subscriptions                                             [+ Add Subscription]│
│                                                                             │
│  No subscriptions added. Click "Add Subscription" to add services like      │
│  DocWagon contracts.                                                        │
│                                                                             │
│  Custom Expenses (¥/month)              Custom Income (¥/month)             │
│  ┌─────────────────────────┐            ┌─────────────────────────┐         │
│  │ 0                     ▲▼│            │ 0                     ▲▼│         │
│  └─────────────────────────┘            └─────────────────────────┘         │
│                                                                             │
│  Notes (Optional)                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Additional notes about this lifestyle...                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│                                                   [Cancel]  [Save Lifestyle]│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Lifestyle Modifications:**
When "+ Add Modification" is clicked, show options like:

- Special Work Area (+1,000¥/month)
- Extra Secure (+20%)
- Obscure/Difficult to Find (+10%)
- Cramped (-10%)
- Dangerous Area (-20%)
- Permanent Lifestyle (one-time cost = 100× monthly)

### IdentitiesCard - Sheet-Driven Creation Mode

Compact card view for the sheet-driven creation layout.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ IDENTITIES & SINs                          1 identity • ¥10,800      ✓     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  SINs & Licenses Cost:                                    ¥10,800    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Jimmy Smith                        Fake R4           [Edit] [Remove] │  │
│  │                                     blue badge                        │  │
│  │  ├─ 📄 Pistol (R4)                                              [×]  │  │
│  │  └─ 📄 Conceal Carry (R4)                                       [×]  │  │
│  │                                                                       │  │
│  │  [+ Add License]                                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│  │                      [+ Add Identity]                                 │  │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │
│                                                                             │
│  Every runner needs at least one identity with a SIN.                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### SINner Quality Warning State

When character has SINner quality but no real SIN identity created:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ IDENTITIES & SINs                          0 identities              ⚠     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ⚠ SINner quality requires at least one identity with a real SIN     │  │
│  │    (National).                                          amber banner  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│  │                      [+ Add Identity]                                 │  │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cost Reference

| Item                  | Cost Formula                          |
| --------------------- | ------------------------------------- |
| Fake SIN              | Rating × 2,500¥                       |
| Fake License          | Rating × 200¥                         |
| Real SIN              | Free (from SINner quality karma cost) |
| Real License          | Free (no rating)                      |
| Lifestyle (monthly)   | Base cost per type                    |
| Lifestyle (permanent) | 100 × monthly cost                    |

---

## Character Info Component

Biographical and descriptive information about the character.
Mostly free-form text entry. All fields optional.

### Standard State

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ CHARACTER INFO                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │            ┌─────────────────────────┐                                  ││
│  │            │                         │                                  ││
│  │            │                         │                                  ││
│  │            │      [Portrait]         │   Legal Name                     ││
│  │            │                         │   ┌───────────────────────────┐  ││
│  │            │    Click to upload      │   │ John Smith                │  ││
│  │            │       or drag           │   └───────────────────────────┘  ││
│  │            │                         │                                  ││
│  │            │                         │   Metatype: Elf                  ││
│  │            └─────────────────────────┘   Age: 34                        ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  PHYSICAL DESCRIPTION                                                       │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐            │
│  │ Sex              │ │ Height           │ │ Weight           │            │
│  │ ┌──────────────┐ │ │ ┌──────────────┐ │ │ ┌──────────────┐ │            │
│  │ │ Male      ▾  │ │ │ │ 185 cm       │ │ │ │ 75 kg        │ │            │
│  │ └──────────────┘ │ │ └──────────────┘ │ │ └──────────────┘ │            │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘            │
│                                                                             │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐            │
│  │ Hair             │ │ Eyes             │ │ Skin             │            │
│  │ ┌──────────────┐ │ │ ┌──────────────┐ │ │ ┌──────────────┐ │            │
│  │ │ Black, short │ │ │ │ Green        │ │ │ │ Fair         │ │            │
│  │ └──────────────┘ │ │ └──────────────┘ │ │ └──────────────┘ │            │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘            │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Distinguishing Features                                               │  │
│  │ ┌─────────────────────────────────────────────────────────────────┐   │  │
│  │ │ Pointed ears (typical elf), cybereyes with obvious chrome       │   │  │
│  │ │ finish, old bullet scar on left shoulder, tribal tattoo on      │   │  │
│  │ │ right forearm                                                   │   │  │
│  │ └─────────────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  BACKGROUND                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Nationality                        │ Birthplace                       │  │
│  │ ┌───────────────────────────────┐  │ ┌───────────────────────────────┐│  │
│  │ │ UCAS                       ▾  │  │ │ Seattle                       ││  │
│  │ └───────────────────────────────┘  │ └───────────────────────────────┘│  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Background / History                                                  │  │
│  │ ┌─────────────────────────────────────────────────────────────────┐   │  │
│  │ │ Born SINless in the Redmond Barrens, Ghost learned early that   │   │  │
│  │ │ the only way to survive was to be invisible. Discovered an      │   │  │
│  │ │ aptitude for magic during adolescence and trained under a       │   │  │
│  │ │ street shaman before the old man was killed by gangers.         │   │  │
│  │ │                                                                  │   │  │
│  │ │ Worked as a courier and lookout for various crews before        │   │  │
│  │ │ getting noticed by a fixer who saw potential. Now runs the      │   │  │
│  │ │ shadows as a combat mage, using magic to protect the team       │   │  │
│  │ │ and eliminate threats before they know he's there.              │   │  │
│  │ │                                                                  │   │  │
│  │ └─────────────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Personality & Motivations                                             │  │
│  │ ┌─────────────────────────────────────────────────────────────────┐   │  │
│  │ │ Quiet and observant, Ghost prefers to watch and listen before   │   │  │
│  │ │ acting. Fiercely loyal to those who earn his trust, but slow    │   │  │
│  │ │ to give it. Motivated by a desire to protect the downtrodden    │   │  │
│  │ │ and stick it to the corps who left the Barrens to rot.          │   │  │
│  │ └─────────────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Goals                                                                 │  │
│  │ ┌─────────────────────────────────────────────────────────────────┐   │  │
│  │ │ • Find out who killed his mentor and why                        │   │  │
│  │ │ • Make enough nuyen to get out of the shadows eventually        │   │  │
│  │ │ • Protect his neighborhood from corporate exploitation          │   │  │
│  │ └─────────────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Notes (GM or Player)                                                  │  │
│  │ ┌─────────────────────────────────────────────────────────────────┐   │  │
│  │ │ Mentor might have been killed because he knew something about   │   │  │
│  │ │ a corp black site in the Barrens. Plot hook for later.          │   │  │
│  │ └─────────────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Compact View (For Three-Column Layout)

```
┌────────────────────────────────────────┐
│ CHARACTER INFO                         │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────┐  Legal Name: John Smith  │
│  │          │  Metatype: Elf           │
│  │ Portrait │  Sex: Male  Age: 34      │
│  │          │  Height: 185cm           │
│  │          │  Weight: 75kg            │
│  └──────────┘                          │
│                                        │
│  Hair: Black, short                    │
│  Eyes: Green (cybereyes)               │
│  Skin: Fair                            │
│                                        │
│  Distinguishing Features:              │
│  Cybereyes (chrome), bullet scar       │
│  on left shoulder, tribal tattoo       │
│                                        │
│                          [Edit Bio →]  │
│                                        │
└────────────────────────────────────────┘
```

### Empty State

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ CHARACTER INFO                                            ○ Optional fields │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │           Who is your character? Tell their story.                    │  │
│  │                                                                       │  │
│  │           Fill in as much or as little as you like.                   │  │
│  │           This information helps bring your runner to life.           │  │
│  │                                                                       │  │
│  │                        [Start Building Bio →]                         │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Derived Stats Component

Display-only component showing calculated values from character stats.

### Standard State

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ DERIVED STATS                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  INITIATIVE                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Physical Initiative                           7 + 1D6               │  │
│  │  REA 3 + INT 4                                                        │  │
│  │                                                                       │  │
│  │  Astral Initiative                            8 + 2D6               │  │
│  │  INT 4 × 2 (Magician)                                                 │  │
│  │                                                                       │  │
│  │  Matrix Initiative (AR)                        7 + 1D6               │  │
│  │  REA 3 + INT 4                                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  LIMITS                                                                     │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ │
│  │  Physical        5   │ │  Mental          6   │ │  Social          6   │ │
│  │  (STR×2+BOD+REA)/3   │ │  (LOG×2+INT+WIL)/3   │ │  (CHA×2+WIL+ESS)/3   │ │
│  │  (2×2+3+3)/3 = 5     │ │  (5×2+4+4)/3 = 6     │ │  (4×2+4+6)/3 = 6     │ │
│  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘ │
│                                                                             │
│  CONDITION MONITORS                                                         │
│  ┌──────────────────────────────────┐ ┌──────────────────────────────────┐  │
│  │  Physical              10 boxes  │ │  Stun                  10 boxes  │  │
│  │  8 + (BOD 3 / 2) = 10            │ │  8 + (WIL 4 / 2) = 10            │  │
│  │  □ □ □ □ □ □ □ □ □ □             │ │  □ □ □ □ □ □ □ □ □ □             │  │
│  │  Overflow: 3 (BOD)               │ │                                  │  │
│  └──────────────────────────────────┘ └──────────────────────────────────┘  │
│                                                                             │
│  SECONDARY STATS                                                            │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ │
│  │  Composure       8   │ │  Judge Intent    8   │ │  Memory          9   │ │
│  │  CHA 4 + WIL 4       │ │  CHA 4 + INT 4       │ │  LOG 5 + WIL 4       │ │
│  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘ │
│  ┌──────────────────────┐ ┌──────────────────────┐                          │
│  │  Lift/Carry      5   │ │  Movement       10/20│                          │
│  │  STR 2 + BOD 3       │ │  Walk/Run (AGI×2/×4) │                          │
│  └──────────────────────┘ └──────────────────────┘                          │
│                                                                             │
│  DEFENSE                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Defense Rating                    7 dice                             │  │
│  │  REA 3 + INT 4                                                        │  │
│  │                                                                       │  │
│  │  Armor                            12                                  │  │
│  │  Armor Jacket (12)                                                    │  │
│  │                                                                       │  │
│  │  Soak                             15 dice                             │  │
│  │  BOD 3 + Armor 12                                                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Compact View (For Sheet Header)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ QUICK STATS                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Initiative: 7+1D6    Physical CM: 10    Armor: 12    Defense: 7           │
│  Astral: 8+2D6        Stun CM: 10        Soak: 15     Composure: 8         │
│                                                                             │
│  Limits:  Physical 5  |  Mental 6  |  Social 6                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Complex Forms Component (Technomancer)

Technomancers use Complex Forms instead of Spells. They thread them using Resonance.
Similar pattern to Spells but with Matrix-specific terminology.

**Budget:** Number of Complex Forms from Priority (Magic column for Technomancer)

### Standard State

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ COMPLEX FORMS                                                     [+ Add]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Forms: 2/5 selected                                              RES: 5   │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ┌─────────┐                                                         │  │
│  │  │ ▒▒▒▒▒▒▒ │   Puppeteer                                     [Edit] │  │
│  │  │ ▒ CF  ▒ │   Target: Device     Fade: L+2                   [✕]   │  │
│  │  │ ▒▒▒▒▒▒▒ │   Duration: Sustained                                  │  │
│  │  │         │                                                         │  │
│  │  └─────────┘   Force a device to perform a Matrix action. The       │  │
│  │                target must be a device, not a host or persona.      │  │
│  │                                                                      │  │
│  │  Threading: RES + skill [Software] vs target                         │  │
│  │                                                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ┌─────────┐                                                         │  │
│  │  │ ▒▒▒▒▒▒▒ │   Resonance Spike                               [Edit] │  │
│  │  │ ▒ CF  ▒ │   Target: Device, Persona, Sprite                [✕]   │  │
│  │  │ ▒▒▒▒▒▒▒ │   Duration: Immediate     Fade: L+3                    │  │
│  │  │         │                                                         │  │
│  │  └─────────┘   Deal Matrix damage to a target on the Matrix.        │  │
│  │                This is the technomancer's primary attack form.      │  │
│  │                                                                      │  │
│  │  Threading: RES + skill [Software] vs target Defense                 │  │
│  │                                                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│                        [+ Add Another Complex Form]                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Add Complex Form Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ADD COMPLEX FORM                                                      [✕]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search complex forms...                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ ACTION TYPE               │ TARGET                                   │  │
│  │ ┌────────────────────────┐│ ┌──────────────────────────────────────┐ │  │
│  │ │ All Actions         ▾ ││ │ All Targets                       ▾ │ │  │
│  │ └────────────────────────┘│ └──────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Showing 12 complex forms                                   3 slots left   │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  ATTACK FORMS                                                         │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │  Resonance Spike                    Target: Device/Persona/Sprite│ │  │
│  │  │  Fade: L+3     Duration: Immediate                        [Add] │ │  │
│  │  │  Deal Matrix damage to a target on the Matrix.                   │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │  Resonance Veil                              Target: Device/Area │ │  │
│  │  │  Fade: L+1     Duration: Sustained                        [Add] │ │  │
│  │  │  Create a false Matrix illusion to fool sensors and icons.       │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                       │  │
│  │  SUPPORT FORMS                                                        │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │  Cleaner                                           Target: Self │ │  │
│  │  │  Fade: L+1     Duration: Permanent                        [Add] │ │  │
│  │  │  Remove overwatch score. Essential for avoiding GOD.             │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │  Diffusion of [Attribute]                       Target: Device │ │  │
│  │  │  Fade: L+1     Duration: Sustained                        [Add] │ │  │
│  │  │  Reduce a target's Matrix attribute temporarily.                 │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │  Editor                                            Target: File │ │  │
│  │  │  Fade: L+2     Duration: Permanent                        [Add] │ │  │
│  │  │  Create, edit, or delete files on the Matrix.                    │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │  Infusion of [Attribute]                          Target: Self │ │  │
│  │  │  Fade: L+1     Duration: Sustained                        [Add] │ │  │
│  │  │  Boost your own Living Persona's Matrix attribute.               │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                       │  │
│  │  CONTROL FORMS                                                        │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │ ✓ Puppeteer                          Target: Device  (Selected) │ │  │
│  │  │  Fade: L+2     Duration: Sustained                      [Added] │ │  │
│  │  │  Force a device to perform a single Matrix action.               │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │  Static Veil                                       Target: Self │ │  │
│  │  │  Fade: L+1     Duration: Sustained                        [Add] │ │  │
│  │  │  Hide your overwatch score accumulation from GOD.                │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│                                               [Cancel]    [Add Selected]   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Living Persona Display (Companion to Complex Forms)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ LIVING PERSONA                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Your mind IS your cyberdeck. Living Persona stats are derived from        │
│  your mental attributes. No commlink or deck required.                     │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │    Device Rating:    5                                                │  │
│  │    (Resonance)                                                        │  │
│  │                                                                       │  │
│  │  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌─────────────┐│  │
│  │  │  Attack     4 │ │  Sleaze     4 │ │  Data Proc  5 │ │ Firewall  4 ││  │
│  │  │  (Charisma)   │ │  (Intuition)  │ │  (Logic)      │ │ (Willpower) ││  │
│  │  └───────────────┘ └───────────────┘ └───────────────┘ └─────────────┘│  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  MATRIX INITIATIVE                                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Hot Sim VR:    DP + INT + 4D6  =  9 + 4D6                           │  │
│  │  Cold Sim VR:   DP + INT + 3D6  =  9 + 3D6                           │  │
│  │  AR:            REA + INT + 1D6 =  7 + 1D6                           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Sprites Section (For Registered Sprites)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SPRITES                                                     Tasks: 8/12    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Registered sprites persist beyond compilation. You have 8 tasks           │
│  remaining out of 12 total services.                                       │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  "Whisper"                                                    [Edit] │  │
│  │  Courier Sprite    Rating 5                                    [✕]   │  │
│  │  ════════════════════════════════════════════════════════════════     │  │
│  │                                                                       │  │
│  │  Tasks Remaining:  4                                                  │  │
│  │                                                                       │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐  │  │
│  │  │ Attack    3 │ │ Sleaze    7 │ │ D.Proc    5 │ │ Firewall      5 │  │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────┘  │  │
│  │                                                                       │  │
│  │  Special Powers: Cookie, Hash                                         │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  "Lockpick"                                                   [Edit] │  │
│  │  Crack Sprite     Rating 4                                     [✕]   │  │
│  │  ════════════════════════════════════════════════════════════════     │  │
│  │                                                                       │  │
│  │  Tasks Remaining:  4                                                  │  │
│  │                                                                       │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐  │  │
│  │  │ Attack    6 │ │ Sleaze    6 │ │ D.Proc    4 │ │ Firewall      4 │  │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────┘  │  │
│  │                                                                       │  │
│  │  Special Powers: Suppression, Resonance Veil                          │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│                            [+ Register New Sprite]                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Empty State (Technomancer Without Forms)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ COMPLEX FORMS                                                     [+ Add]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Forms: 0/5 available                                             RES: 5   │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │                    No complex forms selected yet.                     │  │
│  │                                                                       │  │
│  │    Complex forms are technomancer programs powered by Resonance.     │  │
│  │    They are similar to spells but work exclusively in the Matrix.    │  │
│  │                                                                       │  │
│  │                      [Browse Complex Forms →]                         │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Compact View (Three-Column Layout)

```
┌────────────────────────────────────────┐
│ COMPLEX FORMS              2/5 [+ Add] │
├────────────────────────────────────────┤
│                                        │
│  Puppeteer                             │
│  Control │ Device │ L+2               │
│                                        │
│  Resonance Spike                       │
│  Attack │ Persona │ L+3               │
│                                        │
│  ─────────────────────────────────     │
│                                        │
│  LIVING PERSONA           RES 5        │
│  ATK 4 │ SLZ 4 │ DP 5 │ FW 4          │
│                                        │
│  ─────────────────────────────────     │
│                                        │
│  SPRITES                 4/8 tasks     │
│  Whisper (Courier 5): 4 tasks          │
│  Lockpick (Crack 4): 4 tasks           │
│                                        │
└────────────────────────────────────────┘
```

---

## Vehicles & Drones Component (Rigger)

For rigger characters who control vehicles and drones via Rigger Command Console (RCC).

**Budget:** Purchased with Resources (nuyen)

### Standard State

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ VEHICLES & DRONES                                                 [+ Add]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  RIGGER COMMAND CONSOLE                                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  Proteus Poseidon                                     Rating 4       │  │
│  │  ═══════════════════════════════════════════════════════════════════  │  │
│  │                                                                       │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐  │  │
│  │  │ Noise Red 3 │ │ Sharing   4 │ │ D.Proc    4 │ │ Firewall      4 │  │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────┘  │  │
│  │                                                                       │  │
│  │  Autosofts Running: 3/4 slots                                         │  │
│  │  • Clearsight 4                                                       │  │
│  │  • Electronic Warfare 3                                               │  │
│  │  • Maneuvering (Roto-Drone) 4                                        │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  VEHICLES                                                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  "Ghost"                                                              │  │
│  │  Suzuki Mirage (Racing Bike)                          Cost: 8,500¥   │  │
│  │  ═══════════════════════════════════════════════════════════════════  │  │
│  │                                                                       │  │
│  │  STATS                                                                │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │  │
│  │  │ Handling 5 │ │ Speed   6  │ │ Accel   3  │ │ Body           5  │  │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────────────┘  │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │  │
│  │  │ Armor    6 │ │ Pilot   1  │ │ Sensor  2  │ │ Seats          1  │  │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────────────┘  │  │
│  │                                                                       │  │
│  │  MODIFICATIONS                                                        │  │
│  │  • Spoof Chips                                              500¥     │  │
│  │  • Morphing License Plate                                  1,000¥    │  │
│  │                                                                       │  │
│  │                                              Total: 10,000¥  [Edit]  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  "Wheels"                                                             │  │
│  │  GMC Bulldog Step-Van                                Cost: 35,000¥   │  │
│  │  ═══════════════════════════════════════════════════════════════════  │  │
│  │                                                                       │  │
│  │  STATS                                                                │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │  │
│  │  │ Handling 4 │ │ Speed   4  │ │ Accel   2  │ │ Body          16  │  │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────────────┘  │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │  │
│  │  │ Armor   12 │ │ Pilot   1  │ │ Sensor  2  │ │ Seats          6  │  │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────────────┘  │  │
│  │                                                                       │  │
│  │  MODIFICATIONS                                                        │  │
│  │  • Rigger Interface (Standard)                            1,000¥     │  │
│  │  • Smuggling Compartment                                  2,500¥     │  │
│  │  • Run-Flat Tires                                         1,200¥     │  │
│  │                                                                       │  │
│  │                                              Total: 39,700¥  [Edit]  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  DRONES                                                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  "Buzzer"                                                             │  │
│  │  MCT Fly-Spy                                           Cost: 2,000¥  │  │
│  │  Type: Micro                                                          │  │
│  │  ═══════════════════════════════════════════════════════════════════  │  │
│  │                                                                       │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │  │
│  │  │ Handling 4 │ │ Speed   3  │ │ Accel   2  │ │ Body           1  │  │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────────────┘  │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐                         │  │
│  │  │ Armor    0 │ │ Pilot   3  │ │ Sensor  3  │                         │  │
│  │  └────────────┘ └────────────┘ └────────────┘                         │  │
│  │                                                                       │  │
│  │  Standard Equipment: Micro-camera, Microphone                         │  │
│  │                                                                       │  │
│  │                                               Total: 2,000¥  [Edit]  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  "Eagle Eye" × 2                                                      │  │
│  │  Aztechnology Crawler                                  Cost: 4,000¥  │  │
│  │  Type: Small                                                          │  │
│  │  ═══════════════════════════════════════════════════════════════════  │  │
│  │                                                                       │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │  │
│  │  │ Handling 3 │ │ Speed   3  │ │ Accel   1  │ │ Body           2  │  │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────────────┘  │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐                         │  │
│  │  │ Armor    2 │ │ Pilot   3  │ │ Sensor  3  │                         │  │
│  │  └────────────┘ └────────────┘ └────────────┘                         │  │
│  │                                                                       │  │
│  │  Standard Equipment: Camera, Motion Sensor                            │  │
│  │                                                                       │  │
│  │                                          Total: 8,000¥ (×2)  [Edit]  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  "Stinger"                                                            │  │
│  │  MCT-Nissan Roto-Drone                                 Cost: 5,000¥  │  │
│  │  Type: Medium (Rotorcraft)                                            │  │
│  │  ═══════════════════════════════════════════════════════════════════  │  │
│  │                                                                       │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │  │
│  │  │ Handling 4 │ │ Speed   4  │ │ Accel   2  │ │ Body           3  │  │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────────────┘  │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐                         │  │
│  │  │ Armor    4 │ │ Pilot   3  │ │ Sensor  3  │                         │  │
│  │  └────────────┘ └────────────┘ └────────────┘                         │  │
│  │                                                                       │  │
│  │  WEAPON MOUNT                                                         │  │
│  │  • Standard Weapon Mount (External, Fixed)                            │  │
│  │    └─ Ingram Smartgun X (loaded: 32/32 regular ammo)                 │  │
│  │                                                                       │  │
│  │                                              Total: 6,650¥   [Edit]  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│                          [+ Add Vehicle]  [+ Add Drone]                     │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════   │
│  Total Vehicle/Drone Investment:                              66,350¥      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Add Vehicle Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ADD VEHICLE                                                           [✕]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search vehicles...                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ CATEGORY               │ PRICE RANGE                                 │  │
│  │ ┌────────────────────┐ │ ┌──────────────────────────────────────────┐│  │
│  │ │ All Categories  ▾  │ │ │ Any Price                             ▾ ││  │
│  │ └────────────────────┘ │ └──────────────────────────────────────────┘│  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Remaining Budget: 45,650¥                                                  │
│                                                                             │
│  BIKES                                                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Suzuki Mirage                                             8,500¥    │  │
│  │  Racing Bike    H5 S6 A3 B5 Ar6 P1 Se2 Seats:1                [Add] │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Harley-Davidson Scorpion                                 12,000¥    │  │
│  │  Cruiser        H4 S4 A2 B8 Ar9 P1 Se2 Seats:2                [Add] │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  CARS                                                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Ford Americar                                            16,000¥    │  │
│  │  Sedan          H4 S4 A2 B11 Ar4 P1 Se2 Seats:4               [Add] │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ✓ Honda Spirit (Selected)                                22,000¥    │  │
│  │  Sports Car     H5 S5 A3 B11 Ar6 P2 Se2 Seats:4             [Added] │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  TRUCKS & VANS                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  GMC Bulldog Step-Van                                     35,000¥    │  │
│  │  Van            H4 S4 A2 B16 Ar12 P1 Se2 Seats:6              [Add] │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│                                               [Cancel]    [Add Selected]   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Add Drone Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ADD DRONE                                                             [✕]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search drones...                                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ SIZE                   │ TYPE                                        │  │
│  │ ┌────────────────────┐ │ ┌──────────────────────────────────────────┐│  │
│  │ │ All Sizes       ▾  │ │ │ All Types                             ▾ ││  │
│  │ └────────────────────┘ │ └──────────────────────────────────────────┘│  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Size Types: Micro, Small, Medium, Large, Huge                              │
│  Types: Anthroform, Crawler, Rotorcraft, Tracked, Walker, Wheeled           │
│                                                                             │
│  RECONNAISSANCE                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  MCT Fly-Spy                                    Micro     2,000¥     │  │
│  │  H4 S3 A2 B1 Ar0 P3 Se3                                       [Add] │  │
│  │  Surveillance micro-drone. Nearly undetectable.                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Aztechnology Crawler                           Small     4,000¥     │  │
│  │  H3 S3 A1 B2 Ar2 P3 Se3                                       [Add] │  │
│  │  All-terrain crawler for surveillance operations.                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  COMBAT                                                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  MCT-Nissan Roto-Drone                          Medium    5,000¥     │  │
│  │  H4 S4 A2 B3 Ar4 P3 Se3    Standard Mount                     [Add] │  │
│  │  Versatile rotorcraft. Common choice for armed response.             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Steel Lynx Combat Drone                        Large    25,000¥     │  │
│  │  H5 S4 A3 B6 Ar12 P3 Se3   Heavy Mount                        [Add] │  │
│  │  Tracked assault drone. Serious firepower.                           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  UTILITY                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  GM-Nissan Doberman                             Medium    5,000¥     │  │
│  │  H5 S3 A1 B4 Ar4 P3 Se3    Standard Mount                     [Add] │  │
│  │  Rugged security drone. Reliable and affordable.                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│                                               [Cancel]    [Add Selected]   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Vehicle/Drone Modification Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ MODIFY: MCT-Nissan Roto-Drone                                         [✕]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  DRONE STATS                                                                │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────────────┐   │
│  │ Handling 4 │ │ Speed   4  │ │ Accel   2  │ │ Body               3  │   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────────────────┘   │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                              │
│  │ Armor    4 │ │ Pilot   3  │ │ Sensor  3  │                              │
│  └────────────┘ └────────────┘ └────────────┘                              │
│                                                                             │
│  Mod Slots Available: 3 (Body ÷ 2, round up)                               │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  DRONE NAME                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Stinger                                                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  WEAPON MOUNT                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Standard Weapon Mount (External, Fixed)                   Included  │  │
│  │                                                                       │  │
│  │  Weapon:                                                              │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │ Ingram Smartgun X                                           ▾  │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                       │  │
│  │  Compatible: SMGs, Machine Pistols, Assault Rifles (if Light Mount)  │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  MODIFICATIONS (0/3 slots used)                               [+ Add Mod]  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  No modifications installed.                                         │  │
│  │                                                                       │  │
│  │  Available mods:                                                      │  │
│  │  • Armor Enhancement (+1 to +3)               500¥/rating   1 slot   │  │
│  │  • Sensor Enhancement (+1 to +3)              500¥/rating   1 slot   │  │
│  │  • Speed Enhancement (+1 to +3)               500¥/rating   1 slot   │  │
│  │  • Weapon Mount Upgrade (Heavy)                   3,500¥    2 slots  │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  AMMUNITION                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Ingram Smartgun X - Clip Size: 32                                   │  │
│  │                                                                       │  │
│  │  ┌───────────────────────────────────────────┐  Quantity             │  │
│  │  │ Regular Ammo                          ▾  │  ┌─────────────────┐  │  │
│  │  └───────────────────────────────────────────┘  │ 100             │  │  │
│  │                                                  └─────────────────┘  │  │
│  │  200 rounds @ 20¥ per 10 = 400¥                                      │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════   │
│  Base Cost:    5,000¥    Weapon:    650¥    Ammo:    400¥                  │
│  Mods:             0¥                                                       │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Total:                                                        6,050¥      │
│                                                                             │
│                                               [Cancel]          [Save]     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Empty State (No Vehicles/Drones)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ VEHICLES & DRONES                                                 [+ Add]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │                    No vehicles or drones yet.                         │  │
│  │                                                                       │  │
│  │    Riggers command vehicles and drones via Control Rig cyberware     │  │
│  │    and a Rigger Command Console (RCC). Become one with your machines.│  │
│  │                                                                       │  │
│  │           [+ Add Vehicle]           [+ Add Drone]                     │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ⓘ Tip: Riggers typically need:                                            │
│    • Control Rig (cyberware) - Jump into vehicles directly                  │
│    • Rigger Command Console - Command multiple drones                       │
│    • Autosofts - Give drones skills they need to operate                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Compact View (Three-Column Layout)

```
┌────────────────────────────────────────┐
│ VEHICLES & DRONES              [+ Add] │
├────────────────────────────────────────┤
│                                        │
│  RCC: Proteus Poseidon (R4)            │
│  NR3 | Sh4 | DP4 | FW4                 │
│                                        │
│  ─────────────────────────────────     │
│                                        │
│  VEHICLES                              │
│  Ghost (Suzuki Mirage)      10,000¥    │
│    Racing Bike • H5 S6 B5              │
│                                        │
│  Wheels (GMC Bulldog)       39,700¥    │
│    Step-Van • H4 S4 B16                │
│                                        │
│  ─────────────────────────────────     │
│                                        │
│  DRONES                                │
│  Buzzer (MCT Fly-Spy)        2,000¥    │
│    Micro Recon • P3 Se3                │
│                                        │
│  Eagle Eye ×2 (Crawler)      8,000¥    │
│    Small Recon • P3 Se3                │
│                                        │
│  Stinger (Roto-Drone)        6,650¥    │
│    Medium Combat • P3 Se3              │
│    └ Ingram Smartgun X                 │
│                                        │
│  ─────────────────────────────────     │
│  Total:                     66,350¥    │
│                                        │
└────────────────────────────────────────┘
```

---

## Open Questions

### To Be Explored

1. **Responsive behavior:** How do these components adapt to mobile/tablet?
2. **Keyboard navigation:** Tab order and arrow key navigation within priority cards
3. **Animation:** Should priority reordering animate? How?

### Decisions Still Needed

(None currently - all resolved)

### Resolved Decisions

| Question                                      | Decision                                                                                                                 | Date       |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------- |
| Single-page vs. stepped modal for Magician    | Single-page modal                                                                                                        | 2026-01-01 |
| Where is "Remain Mundane" option?             | Inside the path selection modal as a choice                                                                              | 2026-01-01 |
| Priority E with only Mundane available        | Auto-selected, no modal shown                                                                                            | 2026-01-01 |
| Modal close without selection                 | Close allowed; validation warning shown on priority card                                                                 | 2026-01-01 |
| Changing tradition/mentor after configuration | Full modal reopens with current selections; changing path updates options dynamically; Mundane clears all sub-selections | 2026-01-01 |
