# Shadowrun 5E – Karma Point-Buy Character Creation

_Last updated: 2025-11-10_

This document describes the SR5 **Point Buy** (Karma-based) character creation method, combining narrative rules and implementation specifications.

---

## Overview

The Point Buy method has greater flexibility than any other system; the tradeoff, of course, is that the complete range of options available can make character creation a somewhat time-consuming process. For many, though, the time investment is worth it, as they have the chance to design a character precisely the way they want it to be.

In the Point Buy system, you start with **800 Karma**. The first thing you have to do is purchase a metatype, as per the Metatype Cost Table.

Once you have purchased your metatype, set your attributes at the minimum levels using the Metatype Attribute Table on p. 66, SR5, or p. 106 of this book. From this point on, the Point Buy system generally works similar to Character Advancement (p 103, SR5), only you are advancing a character with the minimum attributes for their metatype and no skills. The player uses Karma to buy attributes, skills, qualities, contacts (per the rules on p. 98, SR5), gear (at the cost of 1 Karma for every 2,000 nuyen; a maximum of 200 Karma can be spent this way), and anything else needed to flesh the character out.

---

## Core Rules

**Starting Budget:** Characters start with **800 Karma** to allocate.

**Key Constraints:**
- Must purchase a metatype from the **Metatype Cost Table**.
- Attributes begin at racial minimums; Karma is used to improve them just like post-creation advancement.
- Magic/Resonance capacities require buying specific qualities (Adept, Aspected Magician, Magician, Mystic Adept, Technomancer).
- Maximum of one Physical or Mental attribute at natural maximum during creation (Magic/Resonance exempt).
- Gear purchased at 2,000¥ per 1 Karma, up to 200 Karma.
- Leftover Karma cannot be saved; leftover nuyen max 5,000¥.

---

## Metatype Cost Table

| Metatype | Cost |
|----------|------|
| Human | 0 Karma |
| Dwarf | 50 Karma |
| Elf | 40 Karma |
| Ork | 50 Karma |
| Troll | 90 Karma |

---

## Magic/Resonance Qualities

The things that must be taken in consideration are the following: First, as with the Priority System, characters at creation may only have 1 Mental or Physical attribute at their natural maximum (the special attributes—Edge, Magic, and Resonance—do not fall under this limit). Second, if characters want to use Magic or the Resonance, they must buy one of the additional qualities below:

### Adept (20 Karma)
This makes a character an adept, able to channel mana into physical abilities. They get a Magic Rating of 1 and can buy more ranks with Karma. As with customary character creation, the character gets free power points equal to their Magic Rating. For more information on adepts, see p. 69, SR5.

### Aspected Magician (15 Karma)
Selecting this quality allows a character to be an aspected magician, meaning they are skilled in one particular area of magic—Sorcery, Conjuring, or Enchanting. They get a Magic Rating of 1 and can buy more ranks with Karma. For more information on the abilities and limitations of aspected magicians, see p. 69, SR5.

### Magician (30 Karma)
This makes the character a magic-user, able to cast spells, conjure spirits, and use other magical abilities. They get a Magic Rating of 1 and can buy more ranks with Karma. For more information on magicians and what they can do, see p. 69, SR5.

### Mystic Adept (35 Karma)
This makes the character a mystic adept, a hybrid of magician and adept who can cast spells while also gaining some of the physical abilities of an adept. They get a Magic Rating of 1 and can buy more ranks with Karma. They do not gain free power points; instead, they need to buy power points at a cost of 5 Karma per power point (to a maximum number equal to their Magic Rating).

### Technomancer (15 Karma)
With this quality, a character becomes a technomancer. They gain the Resonance attribute at a level of 1 and can buy more ranks with Karma. For more information on technomancers, see the Life as a Technomancer in 2075 sidebar on p. 69, SR5, as well as game rules starting on p. 249, SR5.

---

## Additional Rules

Note that leftover Karma from the point-buy process cannot be carried over from character creation—it's use it or lose it! As with the priority system, no more than 5,000 nuyen can be carried over from character creation. Characters roll for starting nuyen per their purchased lifestyle, using the Starting Nuyen Table, p. 95, SR5.

---

## Implementation Specification

### Availability
Campaigns with `edition="sr5"` and `creation_method="karma"` (name aligns with book's "Point Buy").

### Data Requirements

#### Edition JSON (`data/editions/sr5/character_creation.json`)

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
      "docs/rules/5e/creation-methods/karma-point-buy.md",
      "Shadowrun 5E Core Rulebook p. 103, 104, 249"
    ]
  }
}
```

### Backend Requirements

1. **Campaign & Service Layer**
   - Allow `creation_method="karma"` for SR5 campaigns.
   - Expose Karma method metadata via `/api/campaigns/{id}/character-creation`.

2. **Character Creation Engine**
   - Extend SR5 ruleset with:
     - Karma budget tracking.
     - Functions to validate purchases (metatype cost, attribute increases, skill buys, qualities, gear conversion).
     - Enforcement of max natural attributes and leftover restrictions.
   - Provide APIs/helpers to compute remaining Karma for UI display.

3. **Validation Rules**
   - Cannot exceed gear budget (200 Karma max).
   - Cannot max two Physical stats.
   - Cannot max two Mental stats.
   - Leftover Karma must be 0.
   - Leftover nuyen cannot exceed 5,000¥.

4. **Testing**
   - Unit tests for validation functions.
   - Integration tests verifying full character creation path with Karma method.

### Frontend Requirements

1. **Campaign Creation UI**
   - Add "Karma Point-Buy (SR5)" to creation method list when edition is SR5.
   - Submit `creation_method: 'karma'` to backend.

2. **Character Wizard (React)**
   - Budget tracker (starting at 800, subtract on purchases).
   - Steps:
     1. **Metatype Selection:** Show cost table, subtract Karma on selection.
     2. **Attribute Allocation:** Start from min values; enforce advancement costs (per raising attribute by 1).
     3. **Magic/Resonance Path:** Offer qualities; manage Magic/Resonance attribute purchases and power points.
     4. **Skills:** Allow skill and skill group purchases with Karma costs.
     5. **Qualities, Contacts, Gear:** UI for selecting positive qualities, assign Karma to gear (with 200 Karma cap).
     6. **Summary & Validation:** Show expenditure ledger, remaining Karma (must be 0), reminders of attribute caps.

3. **UX Copy**
   > "Start with 800 Karma. Buy a metatype, raise attributes from their minimums, purchase skills, qualities, contacts, and gear. No Karma carries over—use it all before completing creation."

### Open Questions

- Where to store advancement cost tables (backend vs. JSON data vs. hardcoded)? Recommend JSON for flexibility.
- How do campaign gameplay levels impact Karma method (e.g., resource limits)? Need explicit rules or clarifications.
- How to present contacts, qualities, and gear catalogs in UI without overwhelming users (filtering, recommended bundles)?
- Should leftover Karma be auto-assigned to nuyen up to cap, or must player manually convert?

---

## References

- Shadowrun 5E Core Rulebook: p. 98 (contacts/gear), p. 103–106 (advancement costs), p. 249 (technomancers)
- ShadowMaster Unified Roadmap – "Edition & Creation Method Support"
- `internal/service/sr5_karma.go` – Karma workflow validation
