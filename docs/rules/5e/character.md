# Shadowrun Fifth Edition Character Spec

## Purpose

Define the canonical data model and lifecycle for Shadowrun 5e characters inside ShadowMaster. This spec centralizes how UI flows, persistence, and rules engines should reason about a single runner.

## High-Level Lifecycle

1. **Creation**
   - Follows the priority-based workflow documented in `shadowrun-5e-character-creation.md`.
   - Captures metatype, attributes, skills, qualities, gear, magic/resonance, contacts, and lifestyle.
2. **Advancement**
   - Tracks Karma expenditures, nuyen earnings, and downtime improvements.
   - Applies post-creation adjustments (initiations, submersion, augmentations).
3. **Play State**
   - Maintains current condition monitors, ammo, spells known, marks, and temporary modifiers.
4. **Archival**
   - Supports version history, snapshots before major runs, and export formats.

## Core Identity

| Field           | Type      | Notes                                                              |
| --------------- | --------- | ------------------------------------------------------------------ |
| `characterId`   | UUID      | Immutable primary key.                                             |
| `playerName`    | string    | Optional display for campaign table.                               |
| `characterName` | string    | Preferred street name.                                             |
| `metatype`      | reference | Links to `shadowrun-5e-attributes-data.md` for metatype modifiers. |
| `sex`           | enum      | Optional; used for flavor or specific rules (e.g., certain gear).  |
| `age`           | int       | Optional narrative detail.                                         |
| `concept`       | string    | Short archetype summary (e.g., "Elf Face").                        |
| `campaignId`    | UUID      | Optional multi-character linking.                                  |

## Narrative Profile

- `backstory`: short-form biography that captures a runner’s origin, major events, and motivations.
- `personality`: key traits, quirks, and roleplaying cues.
- `appearance`: physical description, including distinctive metatype traits.
- `factionAffiliations`: corporations, gangs, or organizations tied to the character.
- `motivations`: goals and constraints that drive story decisions.
- Provide editable templates so the digital character sheet mirrors the narrative emphasis described in SR5 materials.

## Metatype Overview

Store structured data for each metatype to echo the descriptive guidance from the source text:

| Metatype | Key Themes                                                                   | Spec Hooks                                                                     |
| -------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Human    | Versatile, balanced attributes, higher Edge baseline.                        | Default baseline; ensure Edge allocation supports extra points.                |
| Dwarf    | Short, resilient, strong; corporate integration but face accessibility bias. | Apply Body/Willpower bonuses, toxin/pathogen resistance modifiers.             |
| Elf      | Agile, charismatic, long-lived, culturally distinctive.                      | Enforce Agility/Charisma bonuses; enable optional cultural packages.           |
| Ork      | Physically imposing, shorter lifespan, social prejudice.                     | Strength/Body boosts, Charisma/Logic penalties, lifestyle adjustments.         |
| Troll    | Massive build, natural armor (dermal deposits), social barriers.             | Extreme Body/Strength bonuses, Reach modifiers, gear availability constraints. |

- Use descriptions to seed default biography snippets and tooltips during creation.
- Link to metatype rules in `shadowrun-5e-attributes-data.md` for numerical modifiers.

## Priority Allocation Snapshot

Store the outcome of the priority table selection for audit and recalculation:

- `priorityAssignments`: mapping A–E → { Metatype, Attributes, Skills, Magic/Resonance, Resources } values.
- `metatypeChoice`: resolved metatype and options (special attribute points, qualities).
- `specialAttributes`: Edge, Magic, Resonance, or other special pools granted at creation.

## Attributes

- `baseAttributes`: Body, Agility, Reaction, Strength, Willpower, Logic, Intuition, Charisma, Edge, Magic, Resonance.
- `attributeLimits`: Physical, Mental, Social (derived per `shadowrun-5e-attributes.md`).
- `derivedStats`: Initiative values, Condition monitors, Defense ratings, etc.
- Track source breakdown: base, metatype modifier, augmentation, adept/magic boosts, temporary effects.

## Skills & Proficiencies

- `activeSkills`: rating, specialization, skill group link, source (priority, karma) per `shadowrun-5e-skills-data.md`.
- `knowledgeSkills`: subdivided into Street, Academic, Professional, Interests; capture rating/specialization.
- `languages`: native language flag, skill rating, source (karma, quality) per `shadowrun-5e-languages.md`.
- Validate against limits (e.g., max rating at creation, group integrity, defaulting rules).

## Qualities

- Maintain separate arrays for positive and negative qualities.
- Each entry stores karma cost, prerequisites, and effects (refer to `shadowrun-5e-qualities.md` & `...-data.md`).
- Provide hooks for conditional logic (e.g., bonus dice, limit adjustments, lifestyle modifiers).

## Resources & Gear

- `nuyenBalance`: starting + current.
- `gear`: categorized inventory (weapons, armor, cyber/bio ware, vehicles, drones, commlinks/decks, lifestyle, miscellaneous).
- Track availability and legality for compliance with creation limits.
- Placeholder: full gear catalog pending future data files.

## Magic & Resonance

- `tradition` / `discipline`: hermetic, shamanic, technomancer, etc.
- `spells`, `rituals`, `complexForms`, `adeptPowers`: lists with source, karma cost, sustaining modifiers.
- `foci`, `boundSpirits`, `registeredSprites`: include Force/Level, services owed.
- Link to future magic/resonance specs for drain/fading calculations.

## Contacts & Lifestyle

- `contacts`: name, archetype, Connection/Loyalty ratings, notes.
- `lifestyle`: tier, cost, modifiers, optional add-ons.
- Optional sections for SINs, fake licenses, and background notes.

## Advancement & Karma Ledger

- Track earned/spent Karma with timestamp, source, and description.
- Include planned advancements for downtime scheduling.
- Support delta snapshots for import/export with other tools.

## Play State Tracking

- `conditionMonitors`: physical/stun boxes, overflow, ongoing damage sources.
- `temporaryModifiers`: situational bonuses/penalties with expiration.
- `ammoAndConsumables`: per-weapon ammo counts, reagents, medkits, etc.
- `edgeCurrent`: fluctuates during sessions; ensure cannot exceed maximum without explicit rule.

## Reputation & Heat

- Track three independent scores per runner: `streetCred`, `notoriety`, and `publicAwareness`.
- **Street Cred**: `floor(totalKarma / 10)` plus GM-awarded bonuses for exceptional accomplishments. Serves as a positive limit modifier on Social tests when the runner’s exploits are relevant. Spending 2 points permanently can erase 1 point of Notoriety.
- **Notoriety**: starts at 0. Adjust for qualities (`+1` per negative quality in the SR5 list, `-1` per positive quality: Blandness, First Impression, Lucky). GM awards +1 for serious social or moral breaches (betraying team, killing innocents, stiffing a Johnson, etc.). High values impose Social penalties and reduce contact willingness.
- **Public Awareness**: GM increments when actions hit mainstream news (fights with law enforcement, high-profile extractions, collateral damage, broadcasted crimes). Use awareness tiers to determine recognition: 0–3 (unknown outside shadows), 4–6 (niche watchers), 7–9 (investigative media & agencies), 10+ (household name).
- Provide UI affordances to display current scores, recent triggers, and reminders that Notoriety/Public Awareness are sticky unless mitigated through story actions.

## Lifestyle Management

- Primary lifestyle required; additional lifestyles allowed for alternate IDs/safehouses but must be paid separately.
- Reference `shadowrun-5e-data-tables.md` for monthly costs and starting nuyen roll ranges.
- Support special lifestyles:
  - `hospitalized`: temporary; 500¥/day basic, 1,000¥/day intensive.
  - `teamLifestyle`: shared cost = base + 10% per extra occupant; designate tenant of record for debt tracking.
- Implement lifestyle options as modifiers on the base cost or limits:
  - **Special Work Area** (+1,000¥/month, +2 limit to relevant skill tests on-site).
  - **Extra Secure** (+20%; improves HTR/security response tier by one level).
  - **Obscure / Difficult to Find** (+10%; imposes –2 dice on intruders’ Sneaking tests nearby).
  - **Cramped** (–10%; –2 to Logic-linked test limits performed in the space).
  - **Dangerous Area** (–20%; degrades local security response tier by one).
  - Disallow options on Street or Hospitalized lifestyles; GM may veto combinations that defy narrative plausibility.
- Handle missed payments with eviction downgrade logic (roll 1d6 vs consecutive missed months; downgrade if failure). Allow prepayments and permanent lifestyle purchases (100 × monthly cost) with resale rules per SR5.

## Run Rewards

- **Cash**: base offer = 3,000¥ per runner, modified by Negotiation net hits (+100¥ each). Multiply by difficulty factors:
  - Highest opposing dice pool ÷ 4 (rounded down).
  - +1 if runners outnumbered 3:1 in any combat; +1 instead for 2:1 vs Professional Rating ≥4.
  - +1 for packs of ≥6 critters; +1 if ≥3 significant spirits encountered; +1 for notable lore threats; +1 for exceptional speed/subtlety; +1 if public exposure risk inherent.
  - Apply final moral modifier: standard (×1), “cold-hearted” jobs (+10–20%), “good feelings” jobs (–10–20%).
- **Karma**: award per runner using SR5 table: survival (2), all objectives (2), some objectives (1), plus `(highestOpposedDicePool / 6)` rounded down. Apply same moral modifier as cash (standard 0, cold-hearted –2, feel-good +2). Support GM overrides for standout play.
- Surface summary on run wrap-up screen showing negotiated base, multipliers applied, and modifiers so teams understand payouts.

## Implementation Notes

- Treat the character document as the integration point for all subsystem specs; avoid duplicating rules stored elsewhere.
- Provide schema versioning for migrations as rules evolve.
- Design APIs to fetch both the canonical snapshot and derived runtime state for virtual tabletop integrations.
- Consider partial saves during creation to support multi-session onboarding.

## Open Questions & Data Gaps

- Need full spell list with drain codes, ritual catalog, adept power data from SR5 core and expansions.
- Mentor spirits/totems require dedicated data fields (bonuses, disadvantages).
- Initiation and metamagics rules require elaboration (grade cost, benefits, ordeals).
- Background count tables and astral phenomena events pending documentation.

_Last updated: 2025-11-08_
