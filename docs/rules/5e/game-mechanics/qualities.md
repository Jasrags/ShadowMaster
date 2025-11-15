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
- Stores the master list of qualities (see data tables section below).
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
   - All official quality definitions live in the data tables section below. Specs and tools should refer to that section for authoritative data.

## Reference

- Data tables section below: Complete positive/negative quality tables and supporting reference charts (Prejudiced, Allergy, Scorched).
- SR5 Core Rulebook, Qualities chapter (pp. 84–92, 134–138) for detailed descriptions and edge cases.
- Character creation limits: SR5 Core p. 63 (25 Karma limit for positive, 25 Karma bonus cap for negative).

*Last updated: 2025-11-08*

---

## Qualities Data Tables

## Positive Qualities

| Quality | Karma Cost | Summary | Notes |
|---------|------------|---------|-------|
| Ambidextrous | 4 | Ignore off-hand penalties; both hands treated equally. | Removes –2 dice off-hand modifier. |
| Analytical Mind | 5 | +2 dice to Logic tests involving pattern analysis; halves time for problem solving. | Applies to puzzles, ciphers, clue hunting, etc. |
| Aptitude | 14 | Raise one skill to 7 at creation; cap becomes 13. | May take once; GM approval recommended. |
| Astral Chameleon | 10 | Astral signature fades twice as fast; hard to detect. | –2 dice to Assensing tests against your signature; requires Magic attribute. |
| Bilingual | 5 | Gain a second native language at chargen. | Grants an extra free language skill. |
| Blandness | 8 | Harder to notice/recall; blends into crowds. | +1 threshold to remember; –2 dice to track in populated areas; suppressed by distinctive features. |
| Catlike | 7 | +2 dice to Sneaking tests. | — |
| Codeslinger | 10 | +2 dice to a chosen Matrix action test. | Action chosen when quality is taken. |
| Double-Jointed | 6 | +2 dice to Escape Artist; fit into tight spaces. | — |
| Exceptional Attribute | 14 | Increase natural maximum of one attribute (including Magic/Resonance) by 1. | Cannot affect Edge; may take once with GM approval. |
| First Impression | 11 | +2 dice to relevant Social tests during first meetings. | Applies only to initial encounter. |
| Focused Concentration | 4 × rating (max 6) | Sustain one spell/complex form up to rating without penalty. | Magic users/technomancers only; penalties still apply beyond free sustain. |
| Gearhead | 11 | +2 dice to difficult vehicle tests; boost Speed by 20% or Handling +1 for 1D6 minutes. | Extra duration inflicts 1 stress per additional minute. |
| Guts | 10 | +2 dice to resist fear/intimidation (including magical). | — |
| High Pain Tolerance | 7 × rating (max 3) | Ignore 1 damage box per rating when applying wound modifiers. | Incompatible with Pain Resistance adept power, pain editor, damage compensator. |
| Home Ground | 10 | Gain specialized advantage tied to a familiar neighborhood/host. | Choose one option (Astral Acclimation, You Know a Guy, Digital Turf, Transporter, On the Lam, Street Politics); can be taken multiple times with different options. |
| Human-Looking | 6 | Metahuman appears human; humans treat them neutrally. | Elves, dwarfs, orks only; may incur distrust from metahumans. |
| Indomitable | 8 × rating (max 3) | +1 to chosen Inherent limit per rating. | Distribute levels among Physical/Mental/Social limits. |
| Juryrigger | 10 | +2 dice to Mechanics tests when improvising fixes; reduce thresholds by 1. | Effects temporary; can overclock devices short term. |
| Lucky | 12 | Raise Edge natural maximum by 1. | Does not increase current Edge; cannot combine with Exceptional Attribute; take once with GM approval. |
| Magic Resistance | 6 × rating (max 4) | +1 die per rating on Spell Resistance tests. | Always on; blocks beneficial voluntary spells; unavailable to characters with Magic attribute. |
| Mentor Spirit | 5 | Gain mentor spirit benefits/drawbacks. | Magic attribute required; switching mentors costs Karma (buy off then repurchase). |
| Natural Athlete | 7 | +2 dice to Running and Gymnastics tests. | — |
| Natural Hardening | 10 | +1 point natural biofeedback filtering. | Stacks with programs/firewall; technomancers benefit. |
| Natural Immunity | 4 or 10 | Immunity to one natural (4) or synthetic (10) disease/toxin. | Halved recovery time on subsequent exposures; can still be a carrier; GM/player agree on target. |
| Photographic Memory | 6 | Perfect recall; +2 dice to Memory tests. | — |
| Quick Healer | 3 | +2 dice to all Healing tests (self or others). | Includes magical healing. |
| Resistance to Pathogens/Toxins | 4 or 8 | +1 die to resist pathogens (4) or toxins (4); both if 8 Karma. | — |
| Spirit Affinity | 7 | +1 service and +1 die to Binding for one spirit type. | Magic users only; can select spirits outside tradition. |
| Toughness | 9 | +1 die to Body for Damage Resistance tests. | — |
| Will to Live | 3 × rating (max 3) | +1 Damage Overflow box per rating. | Extends death threshold only (not unconscious limits). |

## Negative Qualities

| Quality | Karma Bonus | Summary | Notes |
|---------|-------------|---------|-------|
| Addiction | 4–25 | Character is dependent on a substance/device/activity; cravings impose penalties and downtime requirements. | Mild (4): monthly cravings, –2 Mental/Physical dice when withdrawing.<br>Moderate (9): biweekly, –4.<br>Severe (20): weekly, –4 plus –2 Social always.<br>Burnout (25): daily, –6 plus –3 Social. |
| Allergy | 5–25 | Harmed by a substance/condition; value = prevalence + severity. | See allergy reference tables below. |
| Astral Beacon | 10 | Astral signature is bright and long-lasting; easier to track. | Signature lasts twice as long; Assensing threshold –1. Magic-only. |
| Bad Luck | 12 | Edge occasionally backfires. | When spending Edge, roll 1d6; on 1 the effect reverses. Happens once per session. |
| Bad Rep | 7 | Tainted reputation follows the character. | Start with 3 Notoriety; must resolve source to remove. |
| Code of Honor | 15 | Bound by strict rules about who may be harmed. | Choose protected group or credo; failure forces nonlethal options, may incur Karma loss; includes variants like Assassin’s Creed or Warrior’s Code. |
| Codeblock | 10 | Struggles with a specific Matrix action. | –2 dice to chosen Matrix action tests; must involve tested action. |
| Combat Paralysis | 12 | Freezes at start of combat. | First Initiative score halved (rounded up); –3 dice on Surprise tests; +1 threshold to Composure under fire. |
| Dependents | 3 / 6 / 9 | Loved ones rely on character, draining time/resources. | +50% training/project time. Lifestyle cost +10% / +20% / +30% depending on commitment level. |
| Distinctive Style | 5 | Memorable look or mannerism. | +2 dice to identify/trace; –1 Memory threshold. Incompatible with Blandness. |
| Elf Poser | 6 | Human seeks to pass as elf. | Gains elf appearance but risks hostility if discovered; humans only. |
| Gremlins | 4 × rating (max 4) | Technology malfunctions around the character. | Reduce glitch threshold by rating on tech use; affects external gear only. |
| Incompetent | 5 | Totally inept with one Active skill group. | Treated as Unaware; cannot learn/use that group; GM may veto trivial picks. |
| Insomnia | 10 / 15 | Restless sleeper; slow Stun recovery. | 10 Karma: failed Intuition+Willpower (4) doubles recovery time and delays Edge refresh.<br>15 Karma: failure prevents any Stun recovery and Edge refresh for 24h. |
| Loss of Confidence | 10 | Doubts a once-proud skill. | Choose skill rating ≥4; –2 dice; can’t use specialization or Edge with that skill until resolved. |
| Low Pain Tolerance | 9 | More sensitive to injury. | Wound modifiers every 2 boxes instead of 3 (both tracks). |
| Ork Poser | 6 | Human/elf adopts ork appearance. | Social consequences if revealed; humans or elves only. |
| Prejudiced | 3–10 | Open bias against a group. | See prejudiced reference tables below. |
| Scorched | 10 | Neurological trauma from Black IC/BTLs. | See scorched side effects table below. |
| Sensitive System | 12 | Body rejects cyberware. | Cyber Essence costs doubled; bioware impossible. Awakened/technomancers risk +2 Drain/Fading if Willpower (2) fails. |
| Simsense Vertigo | 5 | Suffers disorientation in AR/VR. | –2 dice on all AR/VR/simsense interactions (smartlinks, simrigs, etc.). |
| SINner (Layered) | 5–25 | Possesses legal/corporate/criminal SIN with obligations. | National (5): 15% tax; Criminal (10): constant scrutiny; Corporate Limited (15): 20% corp tax; Corporate Born (25): 10% tax and deep distrust. |
| Social Stress | 8 | Emotional triggers hinder social grace. | Define trigger; reduce number of 1s needed to glitch by 1 on relevant tests. |
| Spirit Bane | 7 | Specific spirit type hates the character. | Spirits of that type attack preferentially; –2 dice to summon/bind; +2 to resist banishing. Magic-only. |
| Uncouth | 14 | Socially inept and impulsive. | –2 dice to resist acting improperly; double Karma cost for Social skills; cannot learn Social groups; treated as Unaware if skill <1. |
| Uneducated | 8 | Lacks formal schooling. | Unaware in Technical, Academic, Professional Knowledge skills without ranks; cannot default; double Karma cost to learn/improve them. |
| Unsteady Hands | 7 | Hands tremble under stress. | –2 dice to Agility-based tests when symptoms occur; after stressful event roll Agility+Body (4) to avoid episode. |
| Weak Immune System | 10 | Poor disease resistance. | Increase disease Power by +2 on resistance; cannot take Natural Immunity or Resistance to Pathogens/Toxins. |

## Reference Tables

### Prejudiced Reference Table

**Prevalence of Target Group**

| Target Group Type | Karma Value |
|-------------------|-------------|
| Common group (e.g., humans, metahumans) | 5 |
| Specific group (e.g., Awakened, technomancers, shapeshifters, aspected magicians) | 3 |

**Degree of Prejudice**

| Degree | Karma Value |
|--------|-------------|
| Biased (closet meta-hater) | 0 |
| Outspoken (typical Humanis member) | 2 |
| Radical (racial supremacist) | 5 |

### Addiction Severity Reference

> TODO: add summary table of severity levels, dosage requirements, craving frequency, and penalties.

### Allergy Reference Table

**Prevalence of Allergen**

| Condition | Karma Value | Description |
|-----------|-------------|-------------|
| Uncommon  | 2           | Allergen is rare in the local environment (e.g., silver, gold, antibiotics, grass). |
| Common    | 7           | Allergen is prevalent in the local environment (e.g., sunlight, seafood, bees, pollen, pollutants, Wi-Fi, soy, wheat). |

**Severity of Reaction**

| Severity | Karma Value | Effects |
|----------|-------------|---------|
| Mild     | 3           | Discomfort and distraction; –2 dice to Physical tests while exposed. |
| Moderate | 8           | Intense pain; –4 dice to Physical tests while exposed. |
| Severe   | 13          | Extreme pain plus damage; –4 dice to all tests while exposed and 1 unresisted Physical box per minute of exposure. |
| Extreme  | 18          | Anaphylactic shock; –6 dice to all tests, 1 unresisted Physical box every 30 seconds until treated. |

### Scorched Physical Side Effects

| Effect | Game Rules |
|--------|------------|
| Memory Loss (short term) | Character forgets slotting the BTL. Must immediately take a Withdrawal Test; failure reintroduces cravings and withdrawal. When encountering IC, Memory Tests have threshold +1; failure causes gaps in memory and disorientation. |
| Memory Loss (long term) | As above, plus the character loses access to one active skill (treated as Unaware) for the duration. |
| Blackout | No memories retained for the duration; neither tech nor magic can restore them. |
| Migraines | –2 dice to all Physical and Mental tests; also suffers light sensitivity and nausea (see p. 409). |
| Paranoia/Anxiety | Must make Social Success Tests (threshold 5) for basic interactions; if no skill applies, default to Charisma –1. Failure means paranoia/anxiety reactions for the effect’s duration. |

*Last updated: 2025-11-08*
