# Shadowrun 5E – Karma Point-Buy Character Creation Spec

_Last updated: 2025-11-10_

This specification translates the SR5 **Point Buy** (Karma-based) character creation method described in `docs/POINT_BUY.md` into concrete implementation requirements. It mirrors the structure used for the Sum-to-Ten plan so we can deliver Priority, Sum-to-Ten, and Karma creation methods consistently.

---

## 1. Design Summary

**Purpose:** Provide maximum flexibility by letting players spend Karma to construct characters from the ground up.

**Availability:** Campaigns with `edition="sr5"` and `creation_method="karma"` (name TBD; aligns with book’s “Point Buy”).

**Core Rule:** Characters start with **800 Karma** to allocate; they must purchase metatype, attributes, skills, qualities, contacts, gear, and other features in accordance with SR5 advancement costs.

Key constraints:
- Must purchase a metatype from the **Metatype Cost Table**.
- Attributes begin at racial minimums; Karma is used to improve them just like post-creation advancement.
- Magic/Resonance capacities require buying specific qualities (Adept, Aspected Magician, Magician, Mystic Adept, Technomancer).
- Maximum of one Physical or Mental attribute at natural maximum during creation (Magic/Resonance exempt).
- Gear purchased at 2,000¥ per 1 Karma, up to 200 Karma.
- Leftover Karma cannot be saved; leftover nuyen max 5,000¥.

---

## 2. Data Requirements

### 2.1 Edition JSON (`data/editions/sr5/character_creation.json`)

Introduce a new creation method entry:

```json
"creation_methods": {
  "karma": {
    "label": "Karma Point-Buy",
    "description": "Start with 800 Karma. Purchase metatype, attributes, skills, qualities, gear, and more using advancement costs.",
    "karma_budget": 800,
    "metatype_costs": {
      "human": 0,
      "dwarf": 50,
      "elf": 40,
      "ork": 50,
      "troll": 90
    },
    "gear_conversion": {
      "karma_per_nuyen": 0.0005,
      "max_karma_for_gear": 200,
      "max_starting_nuyen": 5000
    },
    "magic_qualities": [
      { "name": "Adept", "cost": 20, "grants": { "attribute": "magic", "base": 1, "free_power_points": "equal_to_magic" } },
      { "name": "Aspected Magician", "cost": 15, "grants": { "attribute": "magic", "base": 1, "notes": "choose Sorcery/Conjuring/Enchanting" } },
      { "name": "Magician", "cost": 30, "grants": { "attribute": "magic", "base": 1 } },
      { "name": "Mystic Adept", "cost": 35, "grants": { "attribute": "magic", "base": 1, "power_point_cost": 5 } },
      { "name": "Technomancer", "cost": 15, "grants": { "attribute": "resonance", "base": 1 } }
    ],
    "notes": [
      "Attributes start at metatype minimums.",
      "Only one Physical or Mental attribute can be at natural maximum during creation.",
      "Unspent Karma cannot be carried over."
    ],
    "references": [
      "docs/POINT_BUY.md",
      "Shadowrun 5E Core Rulebook p. 103, 104, 249"
    ]
  }
}
```

Additional JSON tasks:
- Ensure attribute caps per metatype are catalogued (if not already stored elsewhere).
- Store references to advancement costs (attributes, skills, etc.) to guide UI hints.

### 2.2 Supporting Data

- Consider separate JSON files for **advancement costs** if needed:
  - `attribute_advancement.json`
  - `skill_advancement.json`
  - `quality_catalog.json` (flag items needing campaign approval)
- Provide cross-links or IDs to SR5 qualities and advanced options.

---

## 3. Backend Requirements

1. **Campaign & Service Layer**
   - Allow `creation_method="karma"` for SR5 campaigns.
   - Expose Karma method metadata via `/api/campaigns/{id}/character-creation`.
   - Default to Sum-to-Ten or Priority when UI/backends detect unimplemented method (until fully supported).

2. **Character Creation Engine**
   - Extend SR5 ruleset with:
     - Karma budget tracking.
     - Functions to validate purchases (metatype cost, attribute increases, skill buys, qualities, gear conversion).
     - Enforcement of max natural attributes and leftover restrictions.
   - Provide APIs/helpers to compute remaining Karma for UI display.
   - Support partial saves (e.g., storing intermediate state), if the wizard allows.

3. **Persistence**
   - Store final Karma expenditures (metatype, attributes, skills, gear, qualities).
   - Possibly maintain a ledger for audit/debugging (e.g., `[]Expenditure` objects with type/cost descriptors).
   - Align data model with future `advancement` system to avoid duplication.

4. **Testing**
   - Unit tests for validation functions (e.g., cannot exceed gear budget, cannot max two Physical stats).
   - Integration tests verifying full character creation path with Karma method.

---

## 4. Frontend Requirements

### 4.1 Campaign Creation UI
| Feature | Details |
| --- | --- |
| Dropdown Option | Add “Karma Point-Buy (SR5)” to creation method list when edition is SR5. |
| UX Hint | State that this method is experimental until wizard support lands. |
| API | Submit `creation_method: 'karma'` to backend. |

### 4.2 Character Wizard (React)

**High-level Flow**
1. Select campaign (which defines edition + creation method).
2. If method is Karma, present a specialized wizard distinct from the priority grid.

**Wizard Requirements**
- Budget tracker (starting at 800, subtract on purchases).
- Steps:
  1. **Metatype Selection:** Show cost table, subtract Karma on selection.
  2. **Attribute Allocation:** Start from min values; enforce advancement costs (per raising attribute by 1).
  3. **Magic/Resonance Path:** Offer qualities; manage Magic/Resonance attribute purchases and power points.
  4. **Skills:** Allow skill and skill group purchases with Karma costs.
  5. **Qualities, Contacts, Gear:** UI for selecting positive qualities, assign Karma to gear (with 200 Karma cap).
  6. **Summary & Validation:** Show expenditure ledger, remaining Karma (must be 0), reminders of attribute caps.

- Provide errors/warnings for:
  - Exceeding Karma budget.
  - Attempting to set multiple Physical/Mental attributes at natural max.
  - Spending >200 Karma on gear.
  - Leaving leftover Karma > 0.

- Integration with legacy systems:
  - Bridge necessary data to existing modals until full migration is complete.

**UX Copy**
> “Start with 800 Karma. Buy a metatype, raise attributes from their minimums, purchase skills, qualities, contacts, and gear. No Karma carries over—use it all before completing creation.”

### 4.3 Fallback Handling
- Hide “Karma Point-Buy” option if front-end wizard is not ready (feature flag).
- If user loads a Karma campaign before wizard is implemented, show a notice and fall back to Priority or block creation (decision TBD).

---

## 5. Testing Strategy

- **Backend**
  - Validate each expense type via unit tests.
  - End-to-end tests for campaign → character creation flow with Karma method.

- **Frontend**
  - Component tests for budget calculations, attribute caps, gear conversions.
  - E2E scenario: create Karma campaign, build character, ensure summary matches expected Karma expenditures.

- **Data**
  - Static analysis script to ensure metatype costs and advancement tables match rulebook values.

---

## 6. Open Questions / Next Steps

- Where to store advancement cost tables (backend vs. JSON data vs. hardcoded)? Recommend JSON for flexibility.
- How do campaign gameplay levels impact Karma method (e.g., resource limits)? Need explicit rules or clarifications.
- How to present contacts, qualities, and gear catalogs in UI without overwhelming users (filtering, recommended bundles)?
- Should leftover Karma be auto-assigned to nuyen up to cap, or must player manually convert?

---

### References
- `docs/POINT_BUY.md` – base rule text.
- ShadowMaster Unified Roadmap – “Edition & Creation Method Support”.
- SR5 Core Rulebook: p. 98 (contacts/gear), p. 103–106 (advancement costs), p. 249 (technomancers), etc.


