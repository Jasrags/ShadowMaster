# Shadowrun Fifth Edition Magic Spec

## Overview

Describes how ShadowMaster should represent and automate Shadowrun 5e magic. Summarizes archetypes, traditions, mechanics, and system touchpoints while delegating raw spell and item catalogs to dedicated data files.

## Magical Population & Society

- Only a small minority ("Awakened") possess the `Magic` attribute, yet their impact spans corporate, academic, criminal, and cultural spheres.
- Second/third-generation Awakened often inherit training and networks; self-taught Awakened emerge unpredictably (typically during puberty) and face recruitment, regulation, or shadow work pressures.
- Corporations operate magic divisions, reagent supply chains, and require licensed practitioners. Street-level Awakened rely on talismongers, grey-market mentors, and personal lodges.

## Archetype Overview

| Archetype | Capabilities | Key Mechanics |
|-----------|--------------|----------------|
| Full Magician | Sorcery + Conjuring, astral projection. | Access to all spell categories, tradition spirit lists. |
| Mystic Adept | Combines spellcasting and adept powers. | Split Magic between spells and powers; track power point purchases. |
| Adept | Channels mana into intrinsic powers. | Power Point economy, initiation for more points, no Sorcery/Conjuring. |
| Aspected Magician | Limited (Sorcery, Conjuring, or Enchanting). | Reduced drain pools, tradition-specific options. |

## Magical Traditions

- Traditions define Drain attributes, spirit lists, trappings, lodge aesthetics, and reagent themes.
- **Hermetic**: Logic + Willpower drain; ritualized formulae, mineral reagents, formal lodges, comfort with binding spirits.
- **Shamanic**: Charisma + Willpower drain; mentor spirits, medicine lodges, natural/material reagents, emphasize relationships with local spirits.
- Extendable: future traditions (Chaos, Black Magic, Wuxing, etc.) should declare Drain pool, spirit mapping, ritual flavor, and gear preferences.

## Legal & Regulatory Context

- Awakened must flag status on their SINs and typically hold licenses for spellcasting, conjuring, or magical goods. Possession without permits invites fines or arrest.
- Magical guilds require registration; authorities may astrally patrol for unlicensed gatherings.
- Corp wage-mages receive training, SINs, and oversight; shadow practitioners rely on illicit networks and risk "geek the mage first" targeting.
- Enforcement tooling includes line-of-sight hoods, mage cuffs, anti-magic cells, and maleficium statutes (toxic/blood magic).

## Magic Attribute & Essence

- `Magic` ranges 1–6 at creation (7 via `Exceptional Attribute`). Essence loss (cyberware, bioware) reduces current and maximum `Magic` (1 per Essence point or fraction).
- `Magic` reaching 0 disables magical skills until raised; maximum 0 results in permanent burnout (magical skills become knowledge-only).

## Magic or Resonance Priority

During character creation, the Magic or Resonance Priority column determines starting ratings:

- The priority table (p. 65) shows your starting Resonance or Magic special attribute level. Your Special Attribute score should be immediately changed to reflect this, and this should be done **before** adding Special Attribute Points (see Metatype Priority).
- Aspected Magicians can never change back to regular Magicians.
- You may also get Magical Skills if you select priority "A" or "B".
  - Magical Skills are listed on page 90: Alchemy, Artificing, Banishing, Binding, Counterspelling, Disenchanting, Ritual Spellcasting, Spellcasting, Summoning

## Skill Groups & Categories

- **Sorcery**: Spellcasting, Ritual Spellcasting, Counterspelling.
- **Conjuring**: Summoning, Binding, Banishing.
- **Enchanting**: Alchemy, Artificing, Disenchanting.
- Magical skills should track sources (Priority, Karma, specialization) and enforce rating caps (e.g., Rating 6 max at creation with aptitudes).

## Force, Limits, & Drain

- `Force` acts as the limit for spells/preparations unless modified by reagents or foci; maximum cast Force = `Magic × 2`.
- Drain Value (DV) defined per action: Sorcery/Enchanting use listed formula; Conjuring uses `2 × spirit hits` (minimum 2).
- Drain defaults to Stun; becomes Physical if Force exceeds Magic or if hits exceed Magic when casting.
- Drain resistance pools depend on tradition (e.g., Hermetic `Logic + Willpower`, Shamanic `Charisma + Willpower`).

## Spellcasting Workflow

1. **Select Spell**: Known spell list; multiple simultaneous spells split dice pools (max spells = Magic rating).
2. **Select Target**: Line of sight (natural/Essence-paid cyber optics) or touch; area spells center on LOS point.
3. **Declare Force**: Limits hits; influences DV.
4. **Cast**: Roll `Spellcasting + Magic [Force]`, apply modifiers (injury, sustaining, background count). Hits exceeding Magic convert Drain to Physical.
5. **Resolve Effects**: Apply opposed tests (success vs threshold/opposition). Net hits determine damage/effect.
6. **Resist Drain**: Roll tradition drain pool; DV cannot drop below 2.
7. **Sustain/End**: Sustained spells impose `-2` dice penalty per spell; sustaining foci or spirits can offload penalties.
- Reckless spellcasting converts Complex to Simple Action with `+3 DV`.

## Spell Categories Summary

- **Combat** (direct/indirect, elemental variants): damage resolution differences, AP values, area vs single-target. Track keywords (Indirect, Elemental).
- **Detection**: grants or augments senses; active vs passive; directional vs area. Opposed by Logic/Willpower/Object Resistance.
- **Health**: healing, attribute mods, detox. Essence penalties apply to altered bodies.
- **Illusion**: mana vs physical illusions, single vs multi-sense; resisted by Logic+Willpower (mana) or Intuition+Logic/Object Resistance (physical).
- **Manipulation**: mental, environmental, physical, damaging subtypes; mental manipulations allow Complex Action resistance each round.
- Raw spell entries reside in the data tables section below (to be populated).

## Conjuring & Spirits

- Summoning: `Summoning + Magic [Force]` vs spirit Force; services equal net hits; drain = `2 × spirit hits` (Physical if Force > Magic).
- Binding: Time = Force hours, reagent cost `Force × 25` drams; opposed test vs `Force × 2`; drain identical formula.
- Banishing: `Banishing + Magic [Astral]` vs spirit Force (+ summoner Magic if bound); reduces owed services; drain follows same formula.
- Services: differentiate unbound (combat, powers, tasks, remote) vs bound (same plus Aid Sorcery/Alchemy/Study, sustaining/binding spells). Track Charisma limit on bound spirits.
- Spirit range: Magic × 100 meters; remote services exceed range and release unbound spirits.
- Record spirit hostility modifiers for abusive tasks (`-1` penalty) and contested leash tests.

## Adepts & Power Points

- Adepts receive Power Points equal to Magic at creation; mystic adepts purchase PP with Karma.
- Losing Magic reduces PP equivalently (powers must be "un-bought").
- Track activation costs (Free/Simple/Complex) and Drain (usually Stun) for specific powers.
- Adept content (power catalog, improved reflex tables) resides in data file placeholders.

## Astral Fundamentals

- Astral perception makes characters dual-natured (`-2` dice penalty on physical actions while perceiving); uses Assensing to interpret auras.
- Astral projection available to full magicians; travel limits `Magic × 2` hours per outing; movement at thought speed or measured walk/run (100 m CT / 5 km CT).
- Astral combat uses `Astral Combat + Willpower` vs `Intuition + Logic`; weapon foci apply `Accuracy`. Damage may be Stun or Physical; only mana spells function astrally.
- Mana barriers: Force equals both Armor and Structure; can be brute-forced or "pressed through" with `Magic + Charisma` opposed tests. Creator always senses breaches.
- Astral tracking uses `Assensing + Intuition (5,1 hour)` with modifiers (see data table placeholder).

## Ritual Magic

- Requires lodge of Force ≥ ritual Force; steps: leader selection, ritual choice, Force declaration, foundation setup, offering reagents (Force drams minimum), performance, sealing.
- Sealing test: `Ritual Spellcasting + Magic [Force]` vs `(Force × 2)` with Teamwork contributions; drain = `2 × defender hits` (Physical if hits > Magic).
- Spotters maintain astral links to remote targets; tracked as exception to "no leaving" rule.
- Ritual keywords: Anchored, Material Link, Minion, Spell, Spotter. Provide specialized validation and drain adjustments.

## Enchanting, Alchemy & Foci

- **Alchemy**: create preparations (lynchpins) with triggers (Command +2 DV, Contact +1 DV, Time +2 DV). Potency equals net hits; potency decay rules; activation uses Potency as dice pool.
- **Artificing**: craft foci via formula, telesma, reagents (karma-equivalent drams), multi-day process, opposed test vs formula Force + Object Resistance; drain = formula Force + `2 × hits`.
- **Disenchanting**: deactivate/harvest foci or preparations; opposed tests vs Force (+ owner Magic); drain `1S` per opposing hit (Physical if target Force > Magic).
- **Foci**: categories (Enchanting, Metamagic, Power, Qi, Spell, Spirit, Weapon). Bonding costs Karma; max bonded foci count = Magic; total Force ≤ `Magic × 5`. Only one focus adds dice per test. Track focus addiction when active total Force > Magic.
- Data file should catalog focus bonding costs, effects, and tables.

## Reagents & Magical Economy

- Reagents measured in drams (orichalcum-equivalent). Tradition alignment affects potency (half strength cross-tradition).
- Uses: set test limits (Spellcasting, Counterspelling, Summoning, Banishing, Alchemy, Disjoining), offset ritual drain, create temporary lodges, binding costs.
- Harvesting: `Alchemy + Magic [Mental]` per hour; yield 1 dram per 2 hits (aligned terrain) or per 4 hits otherwise. Areas require recovery time (2 days × drams gathered).

## Mentor Spirits

- Mentor spirit quality grants bonuses (general + magician-specific + adept-specific) and disadvantages. Represents cultural archetypes (animals, deities, ideals).
- Mentors influence behavior; violating tenets can temporarily reduce Magic or impose penalties.
- Group lodges may share a mentor spirit. Data file to include mentor archetype table.

## Initiation & Metamagic

- Initiation cost: `10 + (Grade × 3)` Karma; Extended Test `Arcana + Intuition [Astral] (Grade, 1 month)` for preparation.
- Benefits: raise Magic max to `6 + Grade`, gain metamagic, access metaplanes, optional ordeals (future detail).
- Common metamagics: Centering (adept/magician variants), Flexible Signature, Masking, Power Point (adepts), Quickening, Spell Shaping, Shielding, Fixation. Track prerequisites and interactions with foci (metamagic foci boost grade for specific techniques).

## Implementation Notes

- Centralize calculations for Drain, Force limits, sustaining penalties, and focus interactions to avoid duplication across spells, alchemy, and rituals.
- Provide configuration for tradition definitions (Drain pools, spirit mapping, reagent tags, mentor compatibility).
- Model spells, rituals, adept powers, foci, spirits, and mentor spirits via structured data in the data tables section below.
- Ensure compliance checks for licenses, focus bonding limits, spirit service counts, and remote range.
- Logging: capture astral signatures (duration, tampering), track maleficium flags (toxic, blood magic) for narrative hooks.

## Open Questions & Data Gaps

- Populate spell lists, ritual catalog, adept powers, spirit stat templates, focus tables, astral/mentor tables in data file.
- Need explicit Drain formulas for every spell and ritual; confirm optional power lists per spirit type.
- Mentor spirit archetype data (bonuses/penalties) pending; integrate Bear totem details for cross-reference with character creation wizard.
- Metamagic catalog beyond core list requires future supplements.
- Matrix analog (Fading) interactions already documented elsewhere; ensure crossover clarity.

*Last updated: 2025-11-08*


---

## Magic Data Tables

This file hosts structured tables and lists referenced by `shadowrun-5e-magic.md`. Populate as data becomes available.

## Spells

- TODO: Combat spells (direct, indirect, elemental) with Type, Range, Damage, Duration, Drain, Keywords.
- TODO: Detection spells (active/passive, directional/area, range modifiers).
- TODO: Health spells (healing, attribute modifiers, detox, negative effects).
- TODO: Illusion spells (mana/physical, single/multi-sense, obvious/realistic).
- TODO: Manipulation spells (mental, environmental, physical, damaging).

## Rituals

| Name | Keywords | Description | Drain | Notes |
|------|----------|-------------|-------|-------|
| _TODO_ | | | | |

## Adept Powers

| Power | Cost (PP) | Activation | Effect | Notes |
|-------|-----------|------------|--------|-------|
| _TODO_ | | | | |

## Mentor Spirits

| Archetype | Alternate Names | Magician Bonus | Adept Bonus | Disadvantage | Notes |
|-----------|------------------|----------------|-------------|--------------|-------|
| _TODO_ | | | | | |

## Foci Catalog

| Category | Subtype | Force Limitations | Effect Summary | Bond Karma | Notes |
|----------|---------|--------------------|----------------|------------|-------|
| _TODO_ | | | | | |

## Spirits

| Type | Tradition Mapping | Base Powers | Optional Powers (per 3 Force) | Services Guidance |
|------|-------------------|-------------|------------------------------|-------------------|
| _TODO_ | | | | |

## Astral Tables

- TODO: Object Resistance values.
- TODO: Assensing results table (hits vs info).
- TODO: Astral tracking modifiers.
- TODO: Astral damage values for unarmed vs weapon foci.
- TODO: Mana barrier sources and Force references.

## Magical Goods

| Item | Cost | Availability | Notes |
|------|------|--------------|-------|
| _TODO_ | | | |

## Reagents & Harvesting

| Environment | Tradition Alignment | Dice Pool Modifier | Notes |
|-------------|---------------------|--------------------|-------|
| _TODO_ | | | |

*Last updated: 2025-11-08*
