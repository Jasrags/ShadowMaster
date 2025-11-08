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

| Field | Type | Notes |
|-------|------|-------|
| `characterId` | UUID | Immutable primary key. |
| `playerName` | string | Optional display for campaign table. |
| `characterName` | string | Preferred street name. |
| `metatype` | reference | Links to `shadowrun-5e-attributes-data.md` for metatype modifiers. |
| `sex` | enum | Optional; used for flavor or specific rules (e.g., certain gear). |
| `age` | int | Optional narrative detail. |
| `concept` | string | Short archetype summary (e.g., "Elf Face"). |
| `campaignId` | UUID | Optional multi-character linking. |

## Narrative Profile

- `backstory`: short-form biography that captures a runner’s origin, major events, and motivations.
- `personality`: key traits, quirks, and roleplaying cues.
- `appearance`: physical description, including distinctive metatype traits.
- `factionAffiliations`: corporations, gangs, or organizations tied to the character.
- `motivations`: goals and constraints that drive story decisions.
- Provide editable templates so the digital character sheet mirrors the narrative emphasis described in SR5 materials.

## Metatype Overview

Store structured data for each metatype to echo the descriptive guidance from the source text:

| Metatype | Key Themes | Spec Hooks |
|----------|------------|------------|
| Human | Versatile, balanced attributes, higher Edge baseline. | Default baseline; ensure Edge allocation supports extra points. |
| Dwarf | Short, resilient, strong; corporate integration but face accessibility bias. | Apply Body/Willpower bonuses, toxin/pathogen resistance modifiers. |
| Elf | Agile, charismatic, long-lived, culturally distinctive. | Enforce Agility/Charisma bonuses; enable optional cultural packages. |
| Ork | Physically imposing, shorter lifespan, social prejudice. | Strength/Body boosts, Charisma/Logic penalties, lifestyle adjustments. |
| Troll | Massive build, natural armor (dermal deposits), social barriers. | Extreme Body/Strength bonuses, Reach modifiers, gear availability constraints. |

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

## Implementation Notes

- Treat the character document as the integration point for all subsystem specs; avoid duplicating rules stored elsewhere.
- Provide schema versioning for migrations as rules evolve.
- Design APIs to fetch both the canonical snapshot and derived runtime state for virtual tabletop integrations.
- Consider partial saves during creation to support multi-session onboarding.

## Open Questions & Data Gaps

- Gear, spell, and augmentation catalogs remain incomplete; need data ingest strategy.
- Derived attribute formulas pending finalization (see `shadowrun-5e-attributes.md`).
- Advancement rules for submersion/initiations require dedicated specs.
- Need clarity on how to represent mentor spirits/totems, matrix marks, and lifestyles with add-ons in data model.

*Last updated: 2025-11-08*


YOUR CHARACTER
At the heart of your experience in Shadowrun is your
character. This is who you are in the Sixth World, the per-
son whose story you will follow and develop through-
out the missions and campaigns you undertake. The
back of the book contains a character sheet that holds
all the data you’ll need to quickly reference for your
character. The character sheet may
contain a bunch of numbers and
other stats, but your character
is more than that. The char-
acter is the combination of
skills, inborn abilities, street
smarts, and bleeding-edge
gear that makes them dan-
gerous—sometimes to others,
sometimes to themselves, often
to both. The numbers are there to
give you a summary of your char-
acter’s skills and abilities, and to
provide the information you
need to resolve the various
tests that arise. As a player,
though, you can work within
the numbers and every other
part of the character to create
a vivid personality who is part of
the ongoing drama of the Sixth
World.
The building blocks below
are the critical elements that
help make your character
who they are.

METATYPE
The first crucial element of a
character is their metatype. Peo-
ple in the Sixth World belong to different strains of
metahumanity, which means the hands attempting
to strangle the life out of you come in a variety of
shapes and sizes. During the Awakening, when mag-
ic returned to the world, humans started turning into
the creatures out of fantasy and fairy tales, and these
kinds of people are now common sights in many parts
of the Sixth World. Your Shadowrun character will
be one of five different types of being (called meta-
types): human, elf, dwarf, ork, or troll. The game rules
for each of these metatypes are described in Creating
a Shadowrunner, p. 62.
Human (Homo sapiens sapiens) is the metatype that
has been around the longest (well, with one possible ex-
ception). You know them, you love them, and if you’re
reading this there’s a high probability that you are one.
They are balanced in their abilities and tend to have a
little larger portion of luck (represented by Edge) than
other metatypes.
Dwarfs (Homo sapiens pumilionis), as you may guess,
are shorter and stockier than humans. They tend to
be quite strong and very resilient, able to recover from
damage ranging from knocks to the head to doses of
hemlock. Or knocks to the head with a club wrapped
in hemlock leaves. Dwarfs are hard workers and tend to
be highly valued by corporations, which means they are
more deeply integrated into human society than the oth-
er metatypes. They still face discrimination due to their
size, and they often have to take steps to make a world
built for humans suitable for them.
Elves (Homo sapiens nobilis) are
taller than humans, thinner, and
have pointed ears. They have an
extremely annoying knack for
being more nimble than hu-
mans, and they generally are
better looking to boot. They
also have very long lifespans,
and continue to look young
into their forties and fifties. They
have occasionally been known to
lord those facts over humans, or
anyone who comes within hear-
ing range. While most elves
emerged at the Awakening
along with the other meta-
types, there are rumors that
a few elves were hiding some-
where during the magical ebb
of the Fifth World, and they are
far older than any creature has a
right to be.
Orks (Homo sapiens robustus) look like the crea-
tures that have been dying by the score in fantasy mov-
ies and trideos for almost one hundred fifty years. With
protruding brows, prominent tusks, and a large stature,
orks have trouble avoiding the stereotype of being un-
thinkingly violent brutes. It doesn’t help that there are
more than a few orks who are happy to live up to that
stereotype rather than fight it. The end result is a certain
underlying tension between orks and humans, which
leads to both groups often preferring to live in separate
communities. Elves and orks, on the other hand, often
prefer to live in entirely separate countries. Despite the
stereotypes, orks can be found in all walks of life, from
dank alleys to corporate boardrooms. They have a shorter
lifespan than humans, which often leads to them having a
certain desperation to pack as much living into their years
as they can.
Trolls (Homo sapiens ingentis) make orks look like the
ordinary man on the street. Orks might be, on average,
less than a quarter-meter taller than humans; trolls, by
contrast, are more than a half-meter taller than orks.
Orks might look like a monstrous version of humanity;
trolls, on the other hand, look like vaguely human ver-
sions of the creature from your most recent nightmare.
With thick, curled horns on their heads (some trolls
prefer to have them cut, while others polish them with
pride), spiky protrusions of calcium on their joints, and
individual muscles that are larger than a full-grown pig,
trolls give the immediate impression that they are built
for destruction. Most of them are able to live up to that
image. Not all trolls, though, are about absorbing and in-
flicting damage. They have tried to find their way into
different roles, but their large size combines with cultural
stereotypes to make it hard for them to fit in. Orks tend
to be the most accepting of trolls, and the two meta-
types often inhabit the same neighborhoods. Typically
these are not the most resource-rich neighborhoods in
any given sprawl.
