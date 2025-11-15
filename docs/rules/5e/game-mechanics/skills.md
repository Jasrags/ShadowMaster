# Shadowrun Fifth Edition Skills Specification

## Overview

Shadowrun 5e skills determine what actions a character can take and how they roll dice to resolve them. Skills are divided into Active, Knowledge, and Language categories. Each skill has a linked attribute, may belong to a skill group, and can include specializations. This spec captures the data model and key behavior so future code can manage skills consistently.

## Data Model

### Skill
- `name`: string (e.g., "Pistols", "Magic Theory")
- `category`: one of `active`, `knowledge`, `language`
- `linkedAttribute`: default governing attribute (e.g., `Agility`, `Logic`, `Intuition`); nullable when context varies
- `rating`: integer (1–12; 13 with Aptitude)
- `canDefault`: boolean (true if the skill may be used without ranks at –1 modifier)
- `specializations`: list of strings (each grants +2 dice when applicable)
- `group`: optional string referencing a skill group name (Active skills only)
- `notes`: optional text for rule nuances (e.g., "Cannot be defaulted", "Magic users only")

### SkillGroup
- `name`: string (e.g., "Outdoors")
- `skills`: array of skill names included in the group
- `rating`: integer (shared rating for all members)
- `isBroken`: boolean flag set when a member skill advances separately

### KnowledgePointPool
- Tracks free point budget for Knowledge/Language skills: `(Logic + Intuition) × 2`
- Fields: `totalPoints`, `spentPoints`, `remainingPoints`

## Behavior Rules

1. **Dice Pools**: Standard tests roll `linkedAttribute + skill rating`. Specializations add +2 dice when relevant. Defaulting applies –1 die and uses attribute only.
2. **Defaulting**: Only allowed when `canDefault` is true. Atlases must mark skills that forbid defaulting (per SR5 italics list). Attempts to default a prohibited skill should be blocked.
3. **Skill Ratings**: Range 1–12 (13 if the character owns the Aptitude quality for that skill). Enforce creation vs advancement caps.
4. **Skill Groups**:
   - Increasing a group raises all member skills.
   - If a single member is advanced independently, mark `isBroken` and treat skills as individual entries at the former rating.
   - To restore a group, all member skills must reach an equal rating; only then can the group rating increase again.
5. **Specializations**:
   - Each adds +2 dice when applicable.
   - At character creation, limit to one specialization per skill (more can be purchased later).
   - Cannot be applied to skill groups—only individual skills with rating ≥1.
6. **Knowledge Skills**:
   - Subdivide into categories: Academic, Interests, Professional, Street.
   - Default linked attributes: Academic/Professional → Logic, Interests/Street → Intuition. Use category table when ambiguity arises.
   - Characters receive `(Logic + Intuition) × 2` free points to spend on Knowledge and Language skills; track pool usage separately from Active skill points.
7. **Language Skills**:
   - Linked to Intuition by default.
   - Characters gain one native language at rating 6 for free. The Bilingual positive quality grants a second native language slot.
   - Additional languages consume points from the Knowledge pool.
8. **Defaulting Rules**:
   - When defaulting is allowed, roll attribute minus 1 die (before modifiers).
   - Some skills (e.g., Aeronautics Mechanic) are flagged as non-defaultable.
9. **Advancement**:
   - Raising a skill from rating `n` to `n+1` costs `(n + 1)` Karma (per SR5 creation/advancement rules—documented elsewhere).
   - Raising a specialization or adding new ones incurs Karma costs (ref: Character Advancement).

## Skill Rating Scale

| Rating | Label | Description |
|--------|-------|-------------|
| No Rating | Unaware | Total lack of knowledge (e.g., Incompetent quality); cannot default or conceivably attempt the skill. |
| 0 | Untrained | Basic awareness from everyday life; may attempt actions with defaulting rules. |
| 1 | Beginner | Minimal training; understands basic operation without full theory. |
| 2 | Novice | Hobbyist familiarity; limited practical experience. |
| 3 | Competent | Handles routine use but struggles with complex techniques. |
| 4 | Proficient | Comfortable and reliable under normal pressures; professional baseline. |
| 5 | Skilled | Adapts to unfamiliar situations and problem-solves creatively. |
| 6 | Professional | Marketable expert; maximum rating for starting characters. |
| 7 | Veteran | Seasoned practitioner; others seek their guidance. |
| 8 | Expert | Highly sought-after talent; corporations recruit or extract them. |
| 9 | Exceptional | Name synonymous with the skill; recognized as exceptionally gifted. |
| 10 | Elite | Famous among top practitioners worldwide. |
| 11 | Legendary | Paragon status; techniques are named after them. |
| 12–13 | Apex | Pinnacle of mortal achievement (top 0.00001%). Rating 13 requires the Aptitude quality. |

## Usage Guidelines

Summaries below capture key mechanics for commonly referenced skills. See SR5 Core Rulebook pages cited for full context.

### Gymnastics (Climbing & Jumping) — SR5 p. 134
- **Climbing Tests**: `Gymnastics + Strength [Physical]` Complex Action. Hits determine vertical/horizontal movement per the Climbing Table. Assisted climbs (ropes/harnesses) are easier and safer than unassisted.
- **Failures/Glitches**: Immediately halt progress; make `Reaction + Strength` to hold on. Failure causes a fall (~20m/Combat Turn). Safety lines allow a `Free-Fall + Logic [Mental]` check (threshold = half Body) to catch the fall.
- **Jumping**: `Gymnastics + Agility`; standing jumps gain 1m per hit, running jumps 2m per hit (cap: `Agility × 1.5`). Vertical jumps grant 0.5m altitude per hit, capped at 1.5× character height.

### Free-Fall (Rappelling) — SR5 p. 135
- **Rappelling**: `Free-Fall + Body [Physical] (2)` Simple Action; descent rate 20m per Combat Turn +1m per net hit. Taking another Simple Action during descent imposes –2 dice on both tests. Stopping requires another test; failure risks falling damage.

### Escape Artist — SR5 p. 135
- Opposed threshold test (`Escape Artist + Agility [Physical]`) vs restraint difficulty. Success frees character after 1 minute ÷ net hits. Modifiers apply for observation, tools, or restraint type.

### Perception — SR5 p. 135
- **Observation**: `Perception + Intuition [Mental]`; thresholds vary by subtlety. Opposed by stealth when targets hide. Apply visibility/light modifiers; use Teamwork Tests for group searches.

### Running — SR5 p. 136
- **Sprinting**: `Running + Strength [Physical]`; each hit adds 1–2m (metatype dependent) to movement that Combat Turn. Continuous running allowed for `(Body + Running) × 10` minutes before fatigue tests are required.

### Stealth Skills — SR5 p. 136
- Opposed tests: `Sneaking (or relevant Stealth skill) + Agility [Physical]` vs `Perception + Intuition [Mental]`. GM may substitute other Stealth skills as appropriate for hiding/locating attempts.

### Disguise & Impersonation — SR5 p. 136
- **Disguise Creation**: `Disguise + Intuition [Mental]`; hits set threshold to detect disguise. Kits (SR5 p. 443) grant up to +4 dice based on preparation quality.
- **Impersonation**: `Impersonation + Charisma [Social]`; hits add to threshold or stand alone when no physical disguise is used.

### Survival — SR5 p. 136
- Daily `Survival + Willpower [Mental]` tests when exposed to extreme conditions. Failure inflicts unhealable Stun damage (until proper rest). Overflow converts to Physical damage until the character is rescued or dies. Modifiers from the Survival Table apply.

### Swimming — SR5 p. 137
- **Movement**: Complex Action; base distance = average of Agility and Strength. Sprint with `Swimming + Strength [Physical]` Simple Action (hits add distance; elves/trolls double the bonus). Fatigue similar to running rules.
- **Holding Breath**: Base 60 seconds; extend via `Swimming + Willpower` (each net hit +15 seconds). After limit, take 1 Stun per Combat Turn until breathing resumes; overflow becomes Physical.
- **Treading Water**: Sustain for `Strength` minutes; then `Swimming + Strength [Physical] (2)` each interval or take 1 unresistable Stun damage. Flotation devices double interval.

### Tracking — SR5 p. 137
- **Environmental Tracking**: Threshold-based `Tracking + Intuition [Mental]` test; GM sets threshold by terrain. Opposed by `Sneaking + Agility [Physical]` when target obscures trail.
- Net hits provide details (number of individuals, age of trail, etc.). Apply modifiers for weather, traffic, or animals. Animal-assisted tracking uses `Animal Handling` as Teamwork on the critter’s test.

### Technical & Utility Skill Usage — SR5 p. 145
- **Building & Repairing**: Extended tests (`Skill + Attribute`) with thresholds/intervals set per Task Difficulty tables. GM may require specific tools/facilities; apply modifiers from the Build/Repair table.
- **Forgery**: `Forgery + Logic` test (limit Physical for tangible items, Mental for data). Hits establish quality/threshold to detect the fake. Opposed by `Perception + Intuition [Mental]` or `Forgery + Intuition [Mental]`. Data forgeries (credsticks, SINs) fail functional checks despite visual similarity.
- **Navigation**: Simple `Navigation + Intuition [Mental]` test when traversing unfamiliar/unmarked terrain; thresholds based on environment and visibility (per Success Test Thresholds table). AR-assisted travel typically bypasses tests.

## Reference

- SR5 Core Rulebook, Skill chapter (p. 86–151) for definitions, defaulting rules, and skill lists.
- Knowledge category table retained for attribute guidance.
- [Data Tables](../data-tables.md) links back to this spec for implementation context.
- Skill rating definitions and usage guidelines adapted from SR5 pp. 130–137.

### Social Skill Usage — SR5 pp. 138–142
- **General Approach**: Social skills complement role-played scenes. Apply SR5 Social Modifiers for attire, environment, NPC attitude, etc.
- **Influencing Groups**: Opposed tests use the crowd’s leader (`Charisma + appropriate skill`). Leader gains +2 dice and a limit bonus equal to crowd size.
- **Etiquette**: `Etiquette + Charisma [Social]` vs target’s `Perception + Charisma [Social]`. Net hits ≥1 grant acceptance; ≥3 improve NPC attitude one step. Glitches cause –2 dice on next social test; critical glitches may shift NPC stance toward Enemy.
- **Instruction**: Teacher must have target skill at rating ≥4. `Instruction + Charisma [Social]`; each hit reduces student advancement time by 1 day. Specialized rules apply for spells, complex forms, etc.
- **Leadership**:
  - *Command*: Opposed by `Leadership + Willpower [Mental]`. Each net hit grants command authority for 1 Combat Turn.
  - *Direct*: Hits act as Teamwork bonus to subordinate’s next skill/Composure test.
  - *Inspire*: Hits add to subordinates’ Surprise Test via Teamwork.
  - *Rally*: Every 2 hits grants +1 Initiative Score to subordinates.
- **Performance**: Simple test (`Performance + Charisma [Social]`) vs Social limit. To captivate/distract, apply Social Modifiers; targets resist with `Charisma + Willpower`.
- **Social Modifiers Table**: Use SR5 modifications for environment, relationship, attire, and leverage.

KNOWLEDGE
SKILLS
Knowledge skills fall into four categories: Street, Aca-
demic, Professional, and Interests. Each category pres-
ents an opportunity to shape the experiences of a char-
acter far beyond what happens on a run. Knowledge
skills do not affect tests the way Active skills do. In
certain cases Knowledge skills may provide the back-
ground needed to complete an action, but they typical-
ly do not provide dice for Active skill tests.
You get a number of free Knowledge skill points at
character creation. Skill advancement and addition-
al Knowledge skills follow the skill advancement rules
(Character Advancement, p. 103).
CHOOSING
KNOWLEDGE SKILLS
Knowledge skills complement your character. They cre-
ate meaning and history behind the Active skills and
abilities you choose. Shadowrun gives you some room to
play with Knowledge skills. You’re free to take practically
any Knowledge skill your can think up for your character.
Knowledge skills are meant to represent a limited set
of knowledge the character could have gained in some
in-game fashion. For example, a kid growing up in an
Evo corporate enclave could have a skill in Corporate
Culture. On the other hand, had she tried to take Culture
as a Knowledge skill, it would have been way too broad
to be a Knowledge skill and her gamemaster would have
told her she needs to narrow it down a bit. Check out the
Knowledge Skill Examples on p. 149 to get a good idea
about how to hit the Knowledge skill sweet spot.

KNOWLEDGE SKILL
SPECIALIZATIONS
Specializations are designed to narrow a field of knowl-
edge to a specific and limited subset. For example, the
same corp kid with Corporate Culture could specialize
her skill in Corporate Culture (Evo) for the specialization
bonus when she’s dealing with Evo. Specializations
narrow the aperture, but not so far that the Knowledge
skill becomes too specific. A specialization of Corpo-
rate Culture (Evo Social Culture of the Upper-Echelon
Jet Set in the 18–25 Age Bracket) would be way too
specific. The goal is for the skill to speak to the unique
background of the character but remain useful.
STREET KNOWLEDGE
Street Knowledge is linked to Intuition. This type of
Knowledge skill is about knowing the movers and shak-
ers in an urban area, along with how things get done on
the street. You know about the people who live in differ-
ent neighborhoods, who to ask to get what, and where
things are. The information that these skills cover tends
to change rapidly, but your instincts help you keep up.
ACADEMIC KNOWLEDGE
Academic knowledge is linked to Logic. This type of
knowledge includes university subjects such as history,
science, design, technology, magical theory, and the
people and organizations with fingers in those pies.
The humanities (cultures, art, philosophy, and so on)
are also included in this category.
PROFESSIONAL
KNOWLEDGE
Professional Knowledge skills deal with subjects re-
lated to normal trades, professions, and occupations,
things like journalism, engineering, business, and so
on. You might find them helpful when doing legwork
for a run, especially those in the corporate world. All
Professional Knowledge skills are linked to Logic.
INTERESTS
Strange as it might sound, you might have some hobbies
outside of slinging mana and bullets. Interests are the
kind of Knowledge skill that describes what you know
because of what you do for fun. There are no guidelines
(and no limit) to the sort of interest skills you can have.
Interest Knowledge skills are linked to Intuition.
USING
KNOWLEDGE SKILLS
Knowledge skills are about what the character knows,
even if you, the player, don’t. Check out the Knowledge
Skill Table for a few guidelines on what a skill reveals.
Keep in mind that general facts, such as the name of
the head of a megacorp and such, is info that can be
quickly found on the Matrix. Knowledge skills are not
about that basic level of detail, but rather information
that not everyone knows or can find so easily.

### Knowledge Skills Guidelines — SR5 pp. 149–150
- **Categories & Attributes**:
  - Street (Intuition): Movers/shakers in urban areas, street procedures, rapidly changing info.
  - Academic (Logic): Formal studies (history, sciences, magical theory, humanities).
  - Professional (Logic): Trades/professions (journalism, engineering, business). Useful for legwork.
  - Interests (Intuition): Hobbies/personal passions; no preset limits.
- **Selection**:
  - Must reflect knowledge realistically gained in-game (not overly broad). GM may require narrowing (e.g., “Corporate Culture (Evo)” instead of “Culture”).
  - During character creation, use free Knowledge points; further advancement follows standard Karma costs.
- **Specializations**:
  - Narrow the topic without becoming unusably specific. Example: “Corporate Culture (Evo)” grants +2 when dealing with Evo-related situations; avoid overly granular scopes.
- **Usage**:
  - Knowledge skills inform role-play and legwork; they rarely grant dice to Active tests but can provide background insights.
  - For general public facts, the Matrix suffices; Knowledge skills cover information not easily accessible.


  LANGUAGE SKILLS
There are few situations where language skills should
require a dice roll. Characters with a language skill don’t
need to make tests to understand one another in ev-
ery day situations. The character’s skill level serves as a
benchmark for how well they can communicate in a for-
eign language over time. However, in critical situations
where precise translation is important, a gamemaster
may elect to require a Language skill test. For more in-
formation, see Using Language Skills, at right.
LANGUAGE (INTUITION)
Language is the ability to converse in a specific lan-
guage through written and verbal means. Characters
who speak multiple languages must purchase a sepa-
rate language skill for each language.
Default: Yes
Skill Group: None
Specializations: Read/Write, Speak, by dialect, by
lingo

LINGOS
Lingos are informal languages formed out of a moth-
er tongue and heavy with slang, jargon, and culturally
significant metaphorical language. Lingos arise out of
professional and often cultural need. For example, the
Cityspeak word ”wiz” came from jargon specific to the
magically active. Lingos are specializations of base
languages


USING LANGUAGE SKILLS
A gamemaster may elect to call for a Language Test
anytime information needs to be translated hurriedly or
in a tense situation. The Language Skill Table suggests
thresholds for the test as well as possible modifiers.
Failing a Language Test means the parties are unable
to understand each other. If a glitch is rolled, some
meaningful portion of the information is presumed to
be understood but is actually misunderstood. The gam-
emaster may want to make the Language Test secretly,
in order to maintain the illusion that the characters un-
derstand what is going on.

SOCIAL SKILLS
AND LANGUAGE
When using Social skills in a foreign language, the lan-
guage barrier hinders your charms. You can’t add more
dice from your Social skill than you have in the language
you (attempt to) speak. So if Easy Sal knows he can
squeeze a few more nuyen out of Mr. Brackhaus if he
can communicate clearly with the man, and Sal’s Negoti-
ation is 6 but his German is only 3, Sal can only use 3 skill
dice to worm more money out of the man.

### Language Skills Guidelines — SR5 p. 150
- Language skills rarely require tests for everyday conversation; ratings act as fluency benchmarks.
- Gamemasters may call for tests when fast, precise translation is critical. See Language Skill Table for thresholds/modifiers.
- Failure means miscommunication; glitches imply partial but incorrect understanding. GM may roll tests secretly.
- Each language is purchased as a separate skill (`Language (Intuition)`); specializations include Read/Write, Speak, dialects, or slang/lingo.
- Lingos are treated as specializations of a base language, representing jargon-heavy variants.
- When making Social tests in a non-native language, the number of Social skill dice that can be applied is capped by the language’s rating (e.g., a Negotiation 6 character using German 3 may only add 3 dice).

*Last updated: 2025-11-08*


---

## Skills Data Tables

## Active Skills

### Combat Skills

| Skill | Linked Attribute | Skill Group | Can Default | Specializations | Notes |
|-------|------------------|-------------|-------------|-----------------|-------|
| Archery | Agility | — | Yes | Bow; Crossbow; Non-Standard Ammunition; Slingshot | Covers string-loaded projectile weapons. |
| Automatics | Agility | Firearms | Yes | Assault Rifles; Cyber-Implant; Machine Pistols; Submachine Guns | Includes fully automatic carbines and SMGs. |
| Blades | Agility | Close Combat | Yes | Axes; Knives; Swords; Parrying | All handheld slashing or stabbing weapons. |
| Clubs | Agility | Close Combat | Yes | Batons; Hammers; Saps; Staves; Parrying | Any handheld bludgeoning instrument. |
| Exotic Ranged Weapon (Specific) | Agility | — | No | — | Purchase separately for each unusual ranged weapon (e.g., blowgun, flamethrower). |
| Heavy Weapons | Agility | — | Yes | Assault Cannons; Grenade Launchers; Guided Missiles; Machine Guns; Rocket Launchers | Handheld/non-vehicle heavy projectile weapons. |
| Longarms | Agility | Firearms | Yes | Extended-Range Shots; Long-Range Shots; Shotguns; Sniper Rifles | Extended-barrel weapons designed for shoulder bracing. |
| Pistols | Agility | Firearms | Yes | Holdouts; Revolvers; Semi-Automatics; Tasers | All handheld pistols, including tasers. |
| Throwing Weapons | Agility | — | Yes | Aerodynamic; Blades; Non-Aerodynamic | Any handheld object thrown as a weapon. |
| Unarmed Combat | Agility | Close Combat | Yes | Blocking; Cyber Implants; Subduing Combat; Specific Martial Art | Body-as-weapon techniques, including implant fighting styles. |

> TODO: Add Ranged, Close Combat, and other active skill categories beyond Combat.

### Physical Skills

| Skill | Linked Attribute | Skill Group | Can Default | Specializations | Notes |
|-------|------------------|-------------|-------------|-----------------|-------|
| Disguise | Intuition | Stealth | Yes | Camouflage; Cosmetic; Theatrical; Trideo & Video | Non-magical identity masking and makeup work. |
| Diving | Body | — | Yes | Liquid Breathing Apparatus; Mixed Gas; Oxygen Extraction; SCUBA; Arctic; Cave; Commercial; Military; Controlled Hyperventilation | Underwater movement and use of diving gear. |
| Escape Artist | Agility | — | Yes | Cuffs; Ropes; Zip Ties; Contortionism | Escaping bindings via contortion or dexterity. |
| Free-Fall | Body | — | Yes | BASE Jumping; Break-Fall; Bungee; HALO; Low Altitude; Parachute; Static Line; Wingsuit; Zipline | Controlled descents from height, including parachuting. |
| Gymnastics | Agility | Athletics | Yes | Balance; Climbing; Dance; Leaping; Parkour; Rolling | General athleticism and acrobatic movement. |
| Palming | Agility | Stealth | No | Legerdemain; Pickpocket; Pilfering | Sleight of hand to conceal or manipulate small objects. |
| Perception | Intuition | — | Yes | Hearing; Scent; Searching; Taste; Touch; Visual | Spotting anomalies and gathering sensory information. |
| Running | Strength | Athletics | Yes | Distance; Sprinting; Terrain (Desert/Urban/Wilderness/etc.) | Covering ground quickly under varying conditions. |
| Sneaking | Agility | Stealth | Yes | Environment (Jungle/Urban/Desert/etc.) | Remaining inconspicuous in different environments. |
| Survival | Willpower | Outdoors | Yes | Desert; Forest; Jungle; Mountain; Polar; Urban; Other Terrain | Sustaining life in hostile environments (fire, shelter, food). |
| Swimming | Strength | Athletics | Yes | Dash; Long Distance | Movement through water and related endurance. |
| Tracking | Intuition | Outdoors | Yes | Desert; Forest; Jungle; Mountain; Polar; Urban; Other Terrain | Following trails and identifying paths through terrain. |

MAGICAL SKILLS
Magic skills are reserved for those who practice mag-
ic. In order to acquire magic-specific skills, characters
must be an Aspected Magician, Magician, or Mystic
Adept. In order to use these skills, their Magic rating
must be 1 or higher. Please visit Magic, p. 276, for all
your Magical skill-using needs.

ALCHEMY (MAGIC)
Alchemy is used to create substances that store spells.
Alchemy is most commonly used to brew potions, dis-
till magical reagents, and even create orichalcum.
Default: No
Skill Group: Enchanting
Specializations: By trigger (Command, Contact,
Time), by spell type (Combat Spells, Detection Spells, etc.)
ARCANA (LOGIC)
Arcana governs the creation of magical formulae used
to create spells, foci, and all other manner of magical
manipulations. Arcana is required to understand for-
mulae that may be purchased over the counter or dis-
covered by other means.
Default: No
Skill Group: None
Specializations: Spell Design, Focus Design, Spirit
Formula
ARTIFICING (MAGIC)
Artificing is the process of crafting magical foci. The
skill may also be used forensically, in order to assense
qualities about an existing focus’ creation and purpose.
See Artificing p. 306.
Default: No
Skill Group: Enchanting
Specializations: Focus Analysis, Crafting (by focus type)
ASSENSING (INTUITION)
Assensing is a magic user’s ability to read and interpret
fluctuations in the astral world. This skill allows practi-
tioners to learn information by reading astral auras. Only
characters capable of astral perception may take this
skill. For more information, see Astral Perception, p. 312
Default: No
Skill Group: None
Specializations: Aura Reading, Astral Signatures, by
aura type (Metahumans, Spirits, Foci, Wards, etc.)
ASTRAL COMBAT (WILLPOWER)
Fighting in Astral Space requires the Astral Combat
skill. Combat in the Astral World relies on a very differ-
ent set of abilities and attributes than physical combat-
ants. See Astral Combat, p. 315.
Default: No
Skill Group: None
Specializations: By specific weapon focus type, by
opponents (Magicians, Spirits, Mana Barriers, etc.)
BANISHING (MAGIC)
Banishing is used to disrupt the link between spirits and
the physical world. Banished spirits are forced to return
to their native plane and are no longer required to com-
plete unfulfilled services.
Default: No
Skill Group: Conjuring
Specializations: By spirit type (Spirits of Air, Spirits
of Man, etc.)
BINDING (MAGIC)
Binding is used to compel a summoned spirit to perform
a number of additional services. See Binding, p. 300.
Default: No
Skill Group: Conjuring
Specializations: By spirit type (Spirits of Fire, Spirits
of Earth, etc.)
COUNTERSPELLING (MAGIC)
Counterspelling is a defensive skill used to defend
against magical attacks and dispel sustained magical
spells. See Counterspelling, p. 294.
Default: No
Skill Group: Sorcery
Specializations: By spell type (Combat Spells,
Detection Spells, etc.)
DISENCHANTING (MAGIC)
This skill governs a character’s ability to remove the en-
chantment from an item. See Disenchanting, p. 307.
Default: No
Skill Group: Enchanting
Specializations: By type (Alchemical Preparations,
Power Foci, etc.)
RITUAL SPELLCASTING (MAGIC)
Ritual spellcasting is a spellcasting skill used to cast rit-
ual spells. See Ritual Spellcasting, p. 295.
Default: No
Skill Group: Sorcery
Specializations: By keyword (Anchored, Spell, etc.)
SPELLCASTING (MAGIC)
The Spellcasting skill permits the character to channel
mana into effects known as spells. See Spellcasting,
p. 281.
Default: No
Skill Group: Sorcery
Specializations: By spell type (Combat Spells,
Detection Spells, etc.)
SUMMONING (MAGIC)
This skill is used to summon spirits. See Summoning,
p. 300).
Default: No
Skill Group: Conjuring
Specializations: By spirit type (Spirits of Earth,
Spirits of Man, etc.)

RESONANCE SKILLS
Resonance skills are a unique subset of Matrix skills
that can only be used by technomancers. Resonance
skills, like magic skills, require the character to have a
special attribute. The Resonance attribute also serves
as the linked attribute for all of the skills.
COMPILING (RESONANCE)
Compiling involves the ability to translate the complex
0s and 1s of machine source language and the rhythms
of the resonance into sprites. See Sprites, p. 254.
Default: No
Skill Group: Tasking
Specializations: By sprite type (Data Sprites,
Machine Sprites, etc.)
DECOMPILING (RESONANCE)
Decompiling is a character’s ability to effectively delete
previously compiled sprites. See Sprites, p. 254.
Default: No
Skill Group: Tasking
Specializations: By sprite type (Courier Sprites, Fault
Sprites, etc.)
REGISTERING (RESONANCE)
This skill allows a technomancer to register sprites on
the Matrix, thereby convincing the grids that they are
legitimate. See Sprites, p. 254.
Default: No
Skill Group: Tasking
Specializations: By sprite type (Crack Sprites, Data
Sprites, etc.)


TECHNICAL SKILLS
Technical skills are called upon when you operate or fix
something. Technical skills link to a variety of attributes,
listed with the skill.
AERONAUTICS MECHANIC
(LOGIC)
Aeronautics mechanics have the ability to repair a vari-
ety of aerospace vehicles, provided the proper tools and
parts are available. See Building & Repairing, p. 145.
Default: No
Skill Group: Engineering
Specializations: Aerospace, Fixed Wing, LTA (blimp),
Rotary Wing, Tilt Wing, Vector Thrust
ANIMAL HANDLING (CHARISMA)
This skill governs the training, care, riding (if they’re big
enough), and control of non-sentient animals. Compe-
tent trainers have the ability to handle multiple animals.
It is even possible to approach an untrained animal and
get it to trust you, or at least not eat you.
Default: Yes
Skill Group: None
Specializations: By animal (Cat, Bird, Hell Hound,
Horse, Dolphin, etc.), Herding, Riding, Training
ARMORER (LOGIC)
Armorer encompasses the broad array of skills required
to build and maintain weapons and armor. As with all
mechanics-based skills, the proper tools and equip-
ment are required to perform any repair or build oper-
ation. For thresholds and information on determining
success results, see Building & Repairing, p. 145.
Default: Yes
Skill Group: None
Specializations: Armor, Artillery, Explosives, Firearms,
Melee Weapons, Heavy Weapons, Weapon Accessories
ARTISAN (INTUITION)
This skill includes several different forms of artistic im-
pression as well as the handcrafting of fine objects that
would otherwise be produced on an assembly line. The
world’s top artists and crafters are considered artisans.
Default: No
Skill Group: None
Specializations: By discipline (Cooking, Sculpting,
Drawing, Carpentry, etc.)
AUTOMOTIVE MECHANIC
(LOGIC)
Automotive mechanics are tasked with fixing all types
of ground-based vehicles ranging from commercial au-
tomobiles to wheeled drones to tanks. Repairs require
the proper tools and time. See Building & Repairing,
p. 145.
Default: No
Skill Group: Engineering
Specializations: Walker, Hover, Tracked, Wheeled
BIOTECHNOLOGY (LOGIC)
Biotechnology is a wide-ranging skill primarily used by
doctors and scientists to grow organic body parts. This
skill is the basis for cloning as well as all forms of bioware.
Provided the right equipment is available, biotechnology
can be used to repair damaged bioware, clone new tis-
sue, or detect any bioware in a subject’s body. This skill
does not allow characters to install or remove bioware.
Default: No
Skill Group: None
Specializations: Bioinformatics, Bioware, Cloning,
Gene Therapy, Vat Maintenance
CHEMISTRY (LOGIC)
Chemistry permits the character to create chemical
reactions and develop chemical compounds ranging
from drugs, to perfumes, to biopolymers like NuSkin.
Chemistry can also be used to analyze chemical com-
pounds to determine what they are.
Default: No
Skill Group: None
Specializations: Analytical, Biochemistry, Inorganic,
Organic, Physical
COMPUTER (LOGIC)
Computer is the base skill for interacting with the Matrix.
It represents the ability to use computers and other Ma-
trix-connected devices. The Computer skill focuses on
understanding multiple operating systems. It does not al-
low the character to exploit code (Hacking) or strip down
mainframes (Hardware). See Using Computer, p. 226.
Default: Yes
Skill Group: Electronics
Specializations: By action (Edit File, Matrix
Perception, Matrix Search, etc.)
CYBERCOMBAT (LOGIC)
Cybercombat is the skill used by hackers to engage in
combat on the Matrix. See Using Cybercombat, p. 226
Default: Yes
Skill Group: Cracking
Specializations: By target type (Devices, Grids, IC,
Personas, Sprites, etc.)
CYBERTECHNOLOGY (LOGIC)
Cybertechnology is the ability to create, maintain, and
repair cybernetic parts. A character with the proper
tools and parts may repair or even build new cybernet-
ics. Cybertechnology is not a surgical skill. Characters
cannot attach or re-attach cybernetics to organic ma-
terial with this skill. This skill may be used to modify or
upgrade cybernetics within cyberlimbs. See Building
and Repairing, p. 145.
Default: No
Skill Group: Biotech
Specializations: Bodyware, Cyberlimbs, Headware,
Repair
DEMOLITIONS (LOGIC)
Demolitions is used to prepare, plant, detonate, and of-
ten defuse chemical-based explosives. See Explosives,
p. 436.
Default: Yes
Skill Group: None
Specializations: Commercial Explosives, Defusing,
Improvised Explosives, Plastic Explosives
ELECTRONIC WARFARE
(LOGIC)
Electronic Warfare is the basis of military signals intelli-
gence. It governs the encoding, disruption, spoofing, and
decoding of communication systems. Providing the user
has the proper equipment, the skill can be used to manip-
ulate or even take over the signal of any item’s commu-
nication system. See Using Electronic Warfare, p. 226.
Default: No
Skill Group: Cracking
Specializations: Communications, Encryption,
Jamming, Sensor Operations
FIRST AID (LOGIC)
First Aid is the ability to provide emergency medical as-
sistance similar to that of a paramedic. This skill may be
used to stabilize wounds and prevent characters from
dying. First Aid cannot be used to perform surgery or
repair damaged implants. For more information, see
Healing, p. 205.
Default: Yes
Skill Group: Biotech
Specializations: By treatment (Gunshot Wounds,
Resuscitation, Broken Bones, Burns, etc.)
FORGERY (LOGIC)
Forgery is used to produce counterfeit items or alter ex-
isting items to a specific purpose. Depending on the type
of forgery, the forger may need specific tools or schemat-
ics to complete the task. See Using Forgery, p. 145.
Default: Yes
Skill Group: None
Specializations: Counterfeiting, Credstick Forgery,
False ID, Image Doctoring, Paper Forgery
HACKING (LOGIC)
Hacking is used to discover and exploit security flaws
in computers and other electronics. For more on how
Hacking is used, see Using Hacking, p. 226.
Default: Yes
Skill Group: Cracking
Specializations: Devices, Files, Hosts, Personas
HARDWARE (LOGIC)
Hardware reflects a characters ability to build and re-
pair electronic devices. A workspace, proper materials,
and sufficient build time are required to enact a repair
or to build a new device. See Building & Repairing, at
right.
Default: No
Skill Group: Electronics
Specializations: By hardware type (Commlinks,
Cyberdecks, Smartguns, etc.)
INDUSTRIAL MECHANIC (LOGIC)
An industrial mechanic is tasked with repairing or
modifying large-scale machines, such as assembly line
equipment, power generators, HVAC units, industrial
robots, etc. See Building and Repairing, at right.
Default: No
Skill Group: Engineering
Specializations: Electrical Power Systems, Hydraulics,
HVAC, Industrial Robotics, Structural, Welding
LOCKSMITH (AGILITY)
This skill covers building, repairing, and opening me-
chanical and electronic locks. While largely banished to
antiquity, traditional mechanical locking mechanisms
are still in use around the globe, often as throwbacks
or backups. Electronic locks are far more common and
quite susceptible to your ministrations. See Doors,
Windows, & Locks, p. 363.
Default: No
Skill Group: None
Specializations: By type (Combination, Keypad,
Maglock, Tumbler, Voice Recognition, etc.)
MEDICINE (LOGIC)
Medicine is used to perform advanced medical
procedures such as surgeries. It includes long-term
medical support for disease and illness, and the skill
can be used to diagnose a character’s medical con-
dition. This skill is used to implant or remove cyber-
netics and bioware but cannot be used to repair or
maintain implanted devices. For more information,
see Healing, p. 205.
Default: No
Skill Group: Biotech
Specializations: Cosmetic Surgery, Extended Care,
Implant Surgery, Magical Health, Organ Culture, Trauma
Surgery
NAUTICAL MECHANIC (LOGIC)
Nautical Mechanic is concerned with the maintenance
and repair of watercraft. This skill is only effective if
the necessary equipment and time are available. See
Building & Repairing below.
Default: No
Skill Group: Engineering
Specializations: Motorboat, Sailboat, Ship,
Submarine
NAVIGATION (INTUITION)
Navigation governs the use of technology and natural
instinct to navigate through territory. This skill enables
characters to read maps, use GPS devices, follow AR
nav points, or follow a course by landmarks or gener-
al direction sense. Navigation applies to both AR and
non-AR-enhanced environments.
Default: Yes
Skill Group: Outdoors
Specializations: Augmented Reality Markers,
Celestial, Compass, Maps, GPS
SOFTWARE (LOGIC)
Software is the skill used to create and manipulate pro-
gramming in the Matrix. See Using Software, p. 226.
It’s also what technomancers use when they create
their complex forms (Threading, p. 251).
Default: No
Skill Group: Electronics
Specializations: Data Bombs or by complex form
(Editor, Resonance Spike, Tattletale, etc.)



> TODO: Add remaining physical-adjacent active skills if any (e.g., Climbing references handled via Gymnastics).

## Skill Groups

| Skill Group | Member Skills |
|-------------|---------------|
| Acting | Con; Impersonation; Performance |
| Athletics | Gymnastics; Running; Swimming |
| Biotech | Cybertechnology; First Aid; Medicine |
| Close Combat | Blades; Clubs; Unarmed |
| Conjuring | Banishing; Binding; Summoning |
| Cracking | Cybercombat; Electronic Warfare; Hacking |
| Electronics | Computer; Hardware; Software |
| Enchanting | Alchemy; Artificing; Disenchanting |
| Firearms | Automatics; Longarms; Pistols |
| Influence | Etiquette; Leadership; Negotiation |
| Engineering | Aeronautics Mechanic; Automotive Mechanic; Industrial Mechanic; Nautical Mechanic |
| Outdoors | Navigation; Survival; Tracking |
| Sorcery | Counterspelling; Ritual Spellcasting; Spellcasting |
| Stealth | Disguise; Palming; Sneaking |
| Tasking | Compiling; Decompiling; Registering |

## Knowledge Skills

### Academic Knowledge

| Skill | Linked Attribute | Notes | Specialization Examples |
|-------|------------------|-------|-------------------------|
| History | Logic | Historical events, timelines, and context by region or era. | American; European; Asian; Ancient; Medieval; Modern |
| Literature | Logic | Study of written works across genres and cultures. | Japanese; Early 20th Century; Science Fiction; Poetry; Romance |
| Economics | Logic | Market theory, macro/micro trends, corporate finances. | Microeconomics; Macroeconomics |
| Biology | Logic | Life sciences, anatomy, and physiology, including para-lifeforms. | Anatomy; Microbiology; Parazoology; Physiology |
| Chemistry | Logic | Chemical reactions, compounds, and analysis. | Industrial Chemicals; Inorganic; Organic; Pharmaceuticals |

### Interests Knowledge

| Skill | Linked Attribute | Notes | Specialization Examples |
|-------|------------------|-------|-------------------------|
| Club Music | Intuition | Underground music scenes and performers. | Astral Rock; Electron Wave; Goblin Rock; Powernoize; WizPunk |
| Matrix Games | Intuition | Popular and niche AR/VR games and communities. | Dawn of Atlantis III; Dragon Storm; Grand Larceny; Killing Floor; Shadowrun Online |
| Sports | Intuition | Professional and underground athletic leagues. | Basketball; Combat Biking; Football; Urban Brawl |
| Street Drugs | Intuition | Recreational substances and their effects/markets. | BTLs; Cram; Deepweed; Novacoke; Tempo |
| Fashion & Nightlife | Intuition | Trends and hotspots in global nightlife. | Harajuku Scene; London Scene; New York Scene; Paris Scene |

### Professional Knowledge

| Skill | Linked Attribute | Notes | Specialization Examples |
|-------|------------------|-------|-------------------------|
| Architecture | Logic | Design styles and structural principles. | Commercial; Residential; Baroque; Brutalist; Art Nouveau |
| Business | Logic | Corporate operations, finance, and management. | Finance; Manufacturing; Megacorp Practices; Small Business |
| Engineering | Logic | Technical disciplines for infrastructure and machinery. | Chemical; Civil; Electrical; Mechanical; Nuclear |
| Military Procedures | Logic | Command structures, tactics, and protocol. | Army; Navy; Air Force; Special Forces |
| Security Design | Logic | Planning and analysis of security systems. | Corporate (Ares, Aztechnology, Wuxing); Magical; Matrix; Physical; Private |

### Street Knowledge

| Skill | Linked Attribute | Notes | Specialization Examples |
|-------|------------------|-------|-------------------------|
| Seattle Street Gangs | Intuition | Major gangs, turf, and politics within Seattle. | Halloweeners; Ancients; Brain Eaters; 405 Hellhounds |
| UCAS Politics | Intuition | Political players and factions within the UCAS. | Congressional; Presidential; State-Level; Lobby Groups; Political Parties |
| Ares Macrotechnology Operations | Intuition | Subsidiaries and departments of Ares in various regions. | Knight; AresSpace; Ares Arms; Seattle Operations |
| Hong Kong Triads | Intuition | Triad organizations and influence in Hong Kong. | Yellow Lotus; Red Dragons; Black Chrysanthemums |
| Security Companies | Intuition | Private security providers and their specialties. | Lone Star; Knight Errant; Hard Corps; Seattle Sec Corps |
| Sprawl Life | Intuition | Survival knowledge for living on the streets. | Soup Kitchens; Scavenging; Street Docs; Squats |

## Language Skills

| Language | Notes |
|----------|-------|
| *(add entries here)* | |


### Social Skills

| Skill | Linked Attribute | Skill Group | Can Default | Specializations | Notes |
|-------|------------------|-------------|-------------|-----------------|-------|
| Con | Charisma | Acting | Yes | Fast Talking; Seduction | Manipulating or deceiving NPCs during social encounters. |
| Etiquette | Charisma | Influence | Yes | Culture/Subculture (Corporate, High Society, Media, Mercenary, Street, Yakuza, etc.) | Navigating social rituals; acts as social equivalent of Sneaking. |
| Impersonation | Charisma | Acting | Yes | By metatype (Dwarf, Elf, Human, Ork, Troll) | Assuming another identity’s voice and mannerisms. |
| Instruction | Charisma | — | Yes | By skill category (Combat, Language, Magical, Academic Knowledge, Street Knowledge, etc.) | Teaching skills or knowledge to others. |
| Intimidation | Charisma | — | Yes | Interrogation; Mental; Physical; Torture | Menacing tactics; Opposed test vs `Charisma + Willpower`. |
| Leadership | Charisma | Influence | Yes | Command; Direct; Inspire; Rally | Directing or motivating others using authority. |
| Negotiation | Charisma | Influence | Yes | Bargaining; Contracts; Diplomacy | Gaining leverage in deals via charisma and tactics. |
| Performance | Charisma | Acting | Yes | By performance art (Presentation, Acting, Comedy, specific Musical Instrument, etc.) | Executing performing arts to entertain or influence. |

> TODO: Add other social or knowledge-adjacent skills as needed (e.g., Artisan, Instruction variants).

### Technical Skills

| Skill | Linked Attribute | Skill Group | Can Default | Specializations | Notes |
|-------|------------------|-------------|-------------|-----------------|-------|
| *(add technical skill here)* | | | | | |

### Magical Skills

| Skill | Linked Attribute | Skill Group | Can Default | Specializations | Notes |
|-------|------------------|-------------|-------------|-----------------|-------|
| Alchemy | Magic | Enchanting | No | Triggers (Command, Contact, Time); Spell Type (Combat, Detection, etc.) | Creates spell-storing preparations; brewing/reagents/orichalcum. |
| Arcana | Logic | — | No | Spell Design; Focus Design; Spirit Formula | Designing magical formulae for spells, foci, and rituals. |
| Artificing | Magic | Enchanting | No | Focus Analysis; Crafting (by focus type) | Crafting focal points; forensic focus analysis. |
| Assensing | Intuition | — | No | Aura Reading; Astral Signatures; Aura Type (Metahumans, Spirits, Foci, Wards) | Reading astral auras; requires astral perception. |
| Astral Combat | Willpower | — | No | Weapon Focus Type; Opponent Type (Magicians, Spirits, Mana Barriers) | Combat within astral space. |
| Banishing | Magic | Conjuring | No | Spirit Type (Air, Man, etc.) | Forcing spirits to return to their native plane. |
| Binding | Magic | Conjuring | No | Spirit Type (Fire, Earth, etc.) | Compelling spirits for additional services. |
| Counterspelling | Magic | Sorcery | No | Spell Type (Combat, Detection, etc.) | Defending against or dispelling spells. |
| Disenchanting | Magic | Enchanting | No | Enchantment Type (Alchemical Preparations, Power Foci, etc.) | Removing enchantments from items. |
| Ritual Spellcasting | Magic | Sorcery | No | Keyword (Anchored, Spell, etc.) | Casting ritual spells. |
| Spellcasting | Magic | Sorcery | No | Spell Type (Combat, Detection, etc.) | Channeling mana into spell effects. |
| Summoning | Magic | Conjuring | No | Spirit Type (Earth, Man, etc.) | Calling spirits for services. |

### Resonance Skills

| Skill | Linked Attribute | Skill Group | Can Default | Specializations | Notes |
|-------|------------------|-------------|-------------|-----------------|-------|
| Compiling | Resonance | Tasking | No | Sprite Type (Data, Machine, etc.) | Creating sprites from Resonance. |
| Decompiling | Resonance | Tasking | No | Sprite Type (Courier, Fault, etc.) | Deleting or disrupting existing sprites. |
| Registering | Resonance | Tasking | No | Sprite Type (Crack, Data, etc.) | Registering sprites as legitimate on the Matrix. |

### Technical Skills

| Skill | Linked Attribute | Skill Group | Can Default | Specializations | Notes |
|-------|------------------|-------------|-------------|-----------------|-------|
| Aeronautics Mechanic | Logic | Engineering | No | Aerospace; Fixed Wing; LTA; Rotary Wing; Tilt Wing; Vector Thrust | Repairing aerospace vehicles. |
| Animal Handling | Charisma | — | Yes | Animal Type (Cat, Bird, Hell Hound, etc.); Herding; Riding; Training | Managing and training animals. |
| Armorer | Logic | — | Yes | Armor; Artillery; Explosives; Firearms; Melee Weapons; Heavy Weapons; Weapon Accessories | Building and maintaining weapons/armor. |
| Artisan | Intuition | — | No | Discipline (Cooking, Sculpting, Drawing, Carpentry, etc.) | Artistic creation or fine handcrafting. |
| Automotive Mechanic | Logic | Engineering | No | Walker; Hover; Tracked; Wheeled | Repairing ground vehicles and wheeled drones. |
| Biotechnology | Logic | — | No | Bioinformatics; Bioware; Cloning; Gene Therapy; Vat Maintenance | Growing and repairing organic tissues/bioware. |
| Chemistry | Logic | — | No | Analytical; Biochemistry; Inorganic; Organic; Physical | Creating/analyzing chemical compounds. |
| Computer | Logic | Electronics | Yes | Action (Edit File, Matrix Perception, Matrix Search, etc.) | Operating Matrix-connected devices and OSes. |
| Cybercombat | Logic | Cracking | Yes | Target Type (Devices, Grids, IC, Personas, Sprites) | Engaging in Matrix combat. |
| Cybertechnology | Logic | Biotech | No | Bodyware; Cyberlimbs; Headware; Repair | Creating/maintaining cybernetic components. |
| Demolitions | Logic | — | Yes | Commercial Explosives; Defusing; Improvised Explosives; Plastic Explosives | Handling and disarming explosives. |
| Electronic Warfare | Logic | Cracking | No | Communications; Encryption; Jamming; Sensor Operations | Signals intelligence and manipulation. |
| First Aid | Logic | Biotech | Yes | Treatment Type (Gunshot, Resuscitation, Burns, etc.) | Emergency medical stabilization. |
| Forgery | Logic | — | Yes | Counterfeiting; Credstick; False ID; Image Doctoring; Paper | Producing or altering documents/items. |
| Hacking | Logic | Cracking | Yes | Devices; Files; Hosts; Personas | Exploiting security flaws in systems. |
| Hardware | Logic | Electronics | No | Hardware Type (Commlinks, Cyberdecks, Smartguns, etc.) | Building/repairing electronic devices. |
| Industrial Mechanic | Logic | Engineering | No | Electrical Power Systems; Hydraulics; HVAC; Industrial Robotics; Structural; Welding | Maintaining large-scale machinery. |
| Locksmith | Agility | — | No | Lock Type (Combination, Keypad, Maglock, Tumbler, Voice Recognition) | Building/opening mechanical/electronic locks. |
| Medicine | Logic | Biotech | No | Cosmetic Surgery; Extended Care; Implant Surgery; Magical Health; Organ Culture; Trauma Surgery | Performing advanced medical procedures. |
| Nautical Mechanic | Logic | Engineering | No | Motorboat; Sailboat; Ship; Submarine | Maintaining watercraft. |
| Navigation | Intuition | Outdoors | Yes | AR Markers; Celestial; Compass; Maps; GPS | Navigating via technology or instinct. |
| Software | Logic | Electronics | No | Data Bombs; Complex Form (Editor, Resonance Spike, Tattletale, etc.) | Programming and creating Matrix code/forms. |

### Matrix Skills

| Skill | Linked Attribute | Skill Group | Can Default | Specializations | Notes |
|-------|------------------|-------------|-------------|-----------------|-------|
| *(add matrix skill here)* | | | | | |

### Vehicle / Drone Skills

| Skill | Linked Attribute | Skill Group | Can Default | Specializations | Notes |
|-------|------------------|-------------|-------------|-----------------|-------|
| Gunnery | Agility | — | Yes | Artillery; Ballistic; Energy; Guided Missile; Rocket | Firing any vehicle-mounted weapon manually or via sensors. |
| Pilot Aerospace | Reaction | — | No | Deep Space; Launch Craft; Remote Operation; Semiballistic; Suborbital | Handling suborbital/extra-orbital craft. |
| Pilot Aircraft | Reaction | — | No | Fixed-Wing; Lighter-Than-Air; Remote Operation; Rotary Wing; Tilt Wing; Vectored Thrust | Piloting atmospheric aircraft. |
| Pilot Walker | Reaction | — | No | Biped; Multiped; Quadruped; Remote | Operating legged vehicles (mechs, walkers). |
| Pilot Exotic Vehicle (Specific) | Reaction | — | No | — | One skill per unique exotic vehicle; supports remote control. |
| Pilot Ground Craft | Reaction | — | Yes | Bike; Hovercraft; Remote Operation; Tracked; Wheeled | Driving ground-based vehicles (non-walker). |
| Pilot Watercraft | Reaction | — | Yes | Hydrofoil; Motorboat; Remote Operation; Sail; Ship; Submarine | Piloting waterborne vehicles locally or remotely. |

*Last updated: 2025-11-08*