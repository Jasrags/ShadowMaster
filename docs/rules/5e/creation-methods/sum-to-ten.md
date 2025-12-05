# Shadowrun 5E – Sum-to-Ten Character Creation

_Last updated: 2025-11-10_

This document describes the SR5 **Sum-to-Ten** character creation method, combining narrative rules and implementation specifications.

---

## Overview

Sum-to-Ten is an option for players and gamemasters seeking a middle ground between the rigidity of the standard priority chart and the complexity of more flexible, but advanced, character-generation methods.

Using this choice, players refer to either the new Sum to Ten Priority Table or simply the basic Priority Table (p. 65, SR5) with one change: Rather than selecting A, B, C, D, E as normal, players are given a pool of ten (10) points to spend on priorities. Choosing A costs 4 points, B is 3, C is 2, D is 1, and an E choice is free.

Creating a standard character, with a priority array of A, B, C, D, E, would cost 10 points. Sum to Ten characters receive the same 10 points to spend—the same amount of potential—but may invest them however they wish.

Sum to Ten allows a player to choose A multiple times and then settle for D and E levels for the rest of creation, to create a character with C Priority Levels all the way across the board, or even to essentially mimic the standard Priority array, if that's what they prefer.

Though each Priority Level (A, B, C, D, and E) can be selected more than once under this method, keep in mind that each column (Metatype, Attributes, Magic/Resonance, Skills, and Resources) may still only be selected once. No trying and take the 0-cost "E" option over and over again, gaining your Human character +1 special attribute point each time, or creating an infinite loop of 6,000 nuyen profits over and over again.

---

## Priority Point Costs

| Priority Choice | Point Cost | Notes |
| --- | --- | --- |
| A | 4 | Highest tier bundle |
| B | 3 | |
| C | 2 | |
| D | 1 | |
| E | 0 | Free selection |

**Core Rule:** Players receive 10 points to spend; columns still obey single-choice constraint. Columns remain mutually exclusive (Metatype, Attributes, Magic/Resonance, Skills, Resources). Multiple picks per column are not allowed.

---

## Example Builds

### Example 1: Combat Decker
Dave wants to build a hotshot combat decker, a tough merc who can hold his own in a firefight just as well as he can in the Matrix. He doesn't invest anything at all in either Metatype or Magic (E Priority in both cases for 0 points each, giving him no magical potential, and granting his human just 1 special attribute point). With all 10 of his priority points remaining, though, he spends 3 to get a B in Attributes (20 points, which should give him a decent spread of both physical and mental stats), spends 3 more for another B in Skills (36 skill points and 5 points of skill groups goes pretty far!), and then sinks his last 4 points to get an A for Resources (maxing out his bankroll with 450,000 to spend on a red-hot cyberdeck and a fair amount of combat chrome, to boot). Dave's final choices of A, B, B, E, E let him build the character he wants, while retaining the easy-to-use bundles provided by the priority chart.

### Example 2: Corporate Wagemage
Felicia wants to make a sort of "everyelf" character, a corporate wagemage whose new trickster totem drives her to the shadows. Choosing Priority C for Metatype costs her 2 of her 10 points and grants her an elven character with 3 special attribute points, which will give her a decent Edge score as long as she buys Magic points elsewhere). Another 2 points gets her the C choice in attributes, gaining her 16 points (which she'll use for a fairly even spread to all her stats, with a bit of a shamanic bent from her elven bonuses). Continuing the trend, spending 2 points at a time to get Cs across the board, she makes a Magician with a base Magic of 3 and 5 spells, 28/2 for skills, and a reasonable corporate employee savings account with 140,000 nuyen to invest. Her former researcher will be decent at lots of stuff, can use Edge to shine at key moments, and will have a lot of room to grow, thanks to her C, C, C, C, C array.

### Example 3: Urban Neo-Primitive
Kevin decides that a tough, no-frills, urban sprawl neo-primitive could be fun. As a semi-luddite who's just barely scraping by, he short-changes his Resources (E, for 0 points and just 6,000 to spend) and Magic (E, 0 points, as mundane as a brick). He goes for an impressive A in Skills (costing 4 priority points, but granting 46 skill points and 10 group points) and another A in Attributes (another 4, scoring him the maximum 24 attribute points). His last 2 priority points go toward a C in Metatype, making a Dwarf with 1 special attribute point to increase his Edge, showing that he's already pretty grizzled just from surviving amidst the urban squalor. With plenty of skill points and a solid base of attributes to go around, even with just a compound bow and a few blades, he'll be a pretty dangerous character thanks to his A, A, C, E, E spread.

### Example 4: Combat Mage
Rusty wants a classic combat mage, good with a gun or a blade, not just a spell. He decides to get a B (3 points each) in Attributes, Magic, and Skills (giving him enough stats to be all-around decent, a solid Magic score, diverse spells, and a few extra Magical skills, and a big 36/5 for a wide variety of skills). He opts for the 0-cost Human option for Metatype (still granting him an Edge point up his sleeve), and then spends his last priority point for 50,000 in Resources, which should be enough to let him kit himself out like a proper shadow-runner. B, B, B, D, E allows him to create a character with solid competence in more than one field.

---

## Implementation Specification

### Availability
Campaigns flagged `edition="sr5"` with `creation_method="sum_to_ten"` or `creation_method="priority"` when toggling fallback.

### Data Requirements

#### Edition JSON (`data/editions/sr5/character_creation.json`)

```json
"creation_methods": {
  "sum_to_ten": {
    "label": "Sum-to-Ten",
    "description": "Allocate 10 points across priority columns (A=4, B=3, C=2, D=1, E=0).",
    "priority_costs": { "A": 4, "B": 3, "C": 2, "D": 1, "E": 0 },
    "point_budget": 10,
    "supports_multiple_A": true,
    "notes": [
      "Each column can still be selected only once.",
      "Priority bundles (metatype, attributes, etc.) reuse standard SR5 tables."
    ]
  }
}
```

### Backend Requirements

1. **Service Updates**
   - Extend `CampaignService` to validate `creation_method="sum_to_ten"` and expose the full method definition via `/api/campaigns/{id}/character-creation`.
   - Update `CharacterService` to:
     - Accept a `CreationMethod` enum.
     - Validate Sum-to-Ten allocations: total points ≤ 10, column uniqueness, allowed priority letters.
     - Resolve underlying bundles using existing SR5 priority tables.
   - Provide derived calculations (karma, resources) respecting campaign gameplay level overrides.

2. **Validation Rules**
   - Total points must equal exactly 10 (enforce exact usage).
   - Every category must be assigned at least one letter.
   - Letters must exist in edition tables.
   - Each column can only be selected once.

3. **Testing**
   - Unit tests covering valid/invalid point allocations.
   - Regression tests ensuring Priority logic unaffected.
   - Campaign-level tests verifying Sum-to-Ten defaults propagate to character endpoint.

### Frontend Requirements

1. **Campaign Creation**
   - Add "Sum-to-Ten (SR5)" under creation method selector when `edition === 'sr5'`.
   - Send `creation_method: 'sum_to_ten'` when creating campaigns.

2. **Character Wizard (React)**
   - Display budget (10 points), remaining points, and cost table.
   - Allow selecting ANY priority letter regardless of prior picks until per-column restriction or budget prevents.
   - Visual feedback for point cost and remaining budget.
   - Error state when exceeding budget or violating column uniqueness.
   - Show final point expenditure, highlight leftover points if < 10 (should be zero but enforce).

3. **UX Copy**
   > "Allocate 10 priority points. A=4, B=3, C=2, D=1, E=0. Each column can be chosen only once."

### Open Questions

- How should leftover points be handled (strictly disallowed vs. allowed but flagged)? **Proposed: enforce exact 10-point usage.**
- Do gameplay levels modify available point budget or costs? (Currently assumed "no", but ensure documentation covers this if rulebooks say otherwise.)
- How do Sum-to-Ten characters interact with Karma buyouts? (Edge cases to be documented alongside Karma method implementation.)

---

## References

- Shadowrun 5E Core Rulebook p. 64–69 (Priority and Sum-to-Ten tables)
- ShadowMaster Unified Roadmap – "Edition & Creation Method Support"
- `internal/service/sr5_sum_to_ten.go` – Sum-to-Ten validation logic
