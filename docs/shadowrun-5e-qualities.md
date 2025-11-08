# Shadowrun Fifth Edition Qualities Specification

## Overview

Qualities represent positive and negative traits that modify a character’s capabilities, costs, and behavior. Each quality has a Karma value, gameplay effects, and possible prerequisites or incompatibilities. This spec outlines how qualities should be modeled, validated, and applied so future code can manage them consistently.

## Data Model

### Quality
- `name`: string identifier (e.g., "Ambidextrous", "Addiction")
- `type`: `positive` or `negative`
- `karmaValue`: integer or structured value (fixed, range, or per-rating formula)
- `summary`: short description of the core benefit/drawback
- `notes`: extended text for special handling, prerequisites, or cross-references
- `categories`: optional tags (e.g., `magic-only`, `metatype-restricted`, `per-rating`)
- `prerequisites`: optional list of requirements (attribute thresholds, archetype, metatype, other qualities)
- `incompatibilities`: optional list of mutually exclusive qualities (e.g., Lucky vs. Exceptional Attribute (Edge))
- `rating`: optional numeric field for per-rating qualities (e.g., High Pain Tolerance, Magic Resistance)

### QualitySelection
- `qualityId`: references a `Quality`
- `rating`: chosen rating when applicable
- `source`: indicates when/how the quality was acquired (`creation`, `advancement`, `story`, etc.)
- `notes`: player/GM annotations for context (e.g., mentor spirit chosen, addiction target)

### QualityCatalog
- Stores the master list of qualities (see `shadowrun-5e-qualities-data.md`).
- Should support filtering by type, tags, prerequisites, and rating requirements.

## Behavior Rules

1. **Karma Accounting**
   - Positive qualities cost Karma; negative qualities grant Karma (or impose story obligations).
   - At character creation, enforce SR5 totals: max 25 Karma in positive qualities, 25 Karma gained from negatives.
   - Track Karma spent/refunded when qualities are added or removed during advancement.

2. **Prerequisites & Restrictions**
   - Validate prerequisites (metatype, Magic rating, skill rating, other qualities, etc.) before adding a quality.
   - Enforce incompatibilities (e.g., Lucky cannot coexist with Exceptional Attribute (Edge)).
   - Some qualities apply only to specific archetypes (e.g., Mentor Spirit → characters with Magic attribute).

3. **Per-Rating Qualities**
   - Qualities like High Pain Tolerance or Magic Resistance scale with rating; cost (or Karma bonus) equals base value × rating.
   - Maintain rating and apply cumulative effects (e.g., ignore `rating` boxes of damage when calculating wound modifiers).

4. **Conditional Effects**
   - Many qualities have ongoing modifiers (dice bonuses, penalties) triggered by context. Document and store these effects for rules processing (e.g., `modifierType`, `amount`, `appliesTo`).
   - Some qualities create hooks into other systems (e.g., Addiction → Withdrawal tests; Mentor Spirit → spell bonuses and limitations). Tag these to ensure downstream systems can react.

5. **Dynamic Qualities**
   - Certain qualities change over time (Addiction severity, Dependents tier). Provide a way to track current severity or sub-option.
   - Example fields: `variant` (e.g., Mild/Moderate/Severe/Burnout), `customDescription` (selected group for Code of Honor).

6. **Removal & Advancement**
   - Removing positive qualities typically requires GM approval and may refund Karma at reduced value (per SR5 rules).
   - Buying off negative qualities costs Karma equal to the Karma bonus originally gained. Implement history tracking to know original value.

7. **Data Source**
   - All official quality definitions live in `shadowrun-5e-qualities-data.md`. Specs and tools should refer to that file for authoritative data.

## Reference

- `shadowrun-5e-qualities-data.md`: Complete positive/negative quality tables and supporting reference charts (Prejudiced, Allergy, Scorched).
- SR5 Core Rulebook, Qualities chapter (pp. 84–92, 134–138) for detailed descriptions and edge cases.
- Character creation limits: SR5 Core p. 63 (25 Karma limit for positive, 25 Karma bonus cap for negative).
