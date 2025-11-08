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
- `shadowrun-5e-data-tables.md` links back to this spec for implementation context.
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

