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

## Reference

- SR5 Core Rulebook, Skill chapter (p. 86–151) for definitions, defaulting rules, and skill lists.
- Knowledge category table retained for attribute guidance.
- `shadowrun-5e-data-tables.md` links back to this spec for implementation context.
- Skill rating definitions and usage guidelines adapted from SR5 pp. 130–137.