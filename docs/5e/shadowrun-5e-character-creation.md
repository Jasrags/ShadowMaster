# Shadowrun Fifth Edition Character Creation

## Step One: Tips for Character Creation

A spreadsheet, word processing document, or pen and paper will help keep things organized as you go through the character creation process. Organization makes it easier to track your chosen priorities, Karma expenditures, Essence, and other elements. As you work, note any bonuses you receive from Qualities or augmentations on the character sheet, because these may modify your statistics by the end of character creation.

Character creation involves many decisions, from choosing the right skills to purchasing the appropriate gear. It can take as little as an hour or as long as an evening. Having an idea of what you want to play before you sit down helps the process run smoothly.

### Choose Concept

The sidebar “Common Character Concepts and Their Roles Explained” provides a snapshot of character types you are likely to find in the shadows. Disparate characters band together as runner teams, blending their talents and expertise to complete missions they could not accomplish alone. Some runner teams form for a single job, while others stay together throughout their careers, becoming as close-knit as family. The gallery is only a starting point—many characters do not conform to any list. The one you create will be uniquely yours.

Consider some core background concepts. Your character could be an ex-soldier applying her combat skills on the streets, a former corporate headhunter forced out by a rival and now leveraging negotiation talent to survive the shadows, a second-generation runner who learned the trade from SINless parents, a bounty hunter supplementing income through shadowrunning, a gang member seeking a better life, or someone fresh out of jail eager to use the skills and connections gained inside.

You do not need to understand every nuance of character creation to get started. Begin with a concept and dive in—your character will quickly become unique.

Players and the gamemaster should collaborate to develop a team of characters suited to the campaign. The rules in this document create an experienced shadowrunner. For alternate creation levels (street level, prime runner), see the Alternate Gameplay sidebar.

All characters start with 25 Karma to improve themselves and gain additional resources during the process.

### Implementation Notes

- Provide an introductory wizard screen that captures player and character concept notes.
- Surface quick reminders about total Karma pool, tracking aids, and recommended prep steps.
- Allow free-form notes that persist through the wizard for later reference.

### Open Questions & Data Gaps

- None currently. See [SR5 Questions & Gaps](./shadowrun-5e-questions-and-gaps.md) for future updates.

## Step Two: Choose Metatype

### Metatype & Special Attributes

Shadowrun Fifth Edition uses the Priority System, a table with columns for Metatype, Attributes, Magic or Resonance, Skills, and Resources. Rows cover Priority Levels A through E. Players assign a distinct priority level to each column—no duplicates allowed. Higher priorities grant greater benefits. Karma can later customize attributes further.

Character creation begins by selecting a metatype (human, elf, dwarf, ork, troll). Each metatype provides different advantages and disadvantages. Humans gain +1 Edge. Trolls receive thermographic vision, +1 Reach, dermal armor, and doubled lifestyle costs, reflecting the expense of adapting gear to their massive frames. Many metatypes adjust natural attribute limits as well. Consult the [Metatype Attribute Table](./shadowrun-5e-data-tables.md#metatype-attribute-table) for details.

After choosing a metatype, review the Metatype column to determine which priority levels offer enough special attribute points (Edge, Magic, Resonance). Technomancers need high Resonance, while magicians and adepts prioritise Magic. Edge starts at the value shown on the Metatype Attribute Table; Magic and Resonance start at 0.

Special attribute points may be allocated to Edge, Magic, or Resonance. They cannot improve physical or mental attributes. Unspent special attribute points disappear at the end of creation. If a priority selection grants zero special attribute points, players may spend Karma later to raise these attributes using the Character Advancement rules (p. 103).

Most metatypes cap Magic, Resonance, and Edge at 6; humans can have Edge 7. Qualities like Lucky or Exceptional Attribute allow ratings one point above the usual limit but require Karma and gamemaster approval. Purchasing such a quality does not grant the increase automatically—the character must still spend attribute points or Karma to raise the rating. With Exceptional Attribute, a character can start with Magic or Resonance 7 before initiation or submersion.

### Mental and Physical Attributes

Next, allocate physical and mental attribute points. Choose a priority level in the Attribute column that matches your vision for the character. The number in that column is the pool of points available to raise Body, Agility, Reaction, Strength, Charisma, Intuition, Logic, and Willpower.

Refer to the Metatype Attribute Table while spending points. It lists starting ratings (before the slash) and maximums for each metatype. Characters begin at their metatype’s base ratings at no cost—human Body 1, dwarf Body 3, ork Body 4, troll Body 5, and so on. It costs one attribute point to increase a rating by 1.

All attribute points must be spent during character creation. You cannot use these points to raise special attributes, nor can they be saved for later. Characters may have only one physical or mental attribute at their natural maximum during creation (special attributes are exempt). Some metatypes have natural limits below 6; plan accordingly.

Attribute choices affect derived stats calculated later, such as Initiative and Inherent Limits. Initiative is Intuition + Reaction (see p. 52). Inherent Limits restrict the number of hits counted in certain tests (p. 46). Technomancers should note that mental attributes determine their Living Persona in the Matrix (p. 249), and magicians use mental attributes for astral projections (p. 314).

### Implementation Notes

- UI must support assigning unique priorities to five categories and reflect SR5-specific values.
- Build metatype selection cards that enforce availability based on chosen priority and display racial traits/maximums.
- Provide a special attribute allocation interface tied to Edge/Magic/Resonance with validation for caps and unspent points.
- Attribute distribution page must preload metatype starting ratings, enforce “one attribute at natural max” rule, and track remaining points in real time.
- Persist modifier effects (e.g., troll lifestyle cost multiplier) for later steps.

### Open Questions & Data Gaps

- See [Step Two questions](./shadowrun-5e-questions-and-gaps.md#step-two-choose-metatype).

## Step Three: Choose Magic or Resonance

The Magic/Resonance column governs magical characters (adepts, aspected magicians, full magicians, mystic adepts) and technomancers. Players uninterested in these roles assign priority E here. Review the Magic User Types sidebar, along with “Life as a Magic User in 2075” and “Life as a Technomancer in 2075,” for expectations.

Priorities A through C specify starting Magic or Resonance ratings and bundled skills, spells, or complex forms. These bundles are prepaid and do not cost skill points or Karma, though ratings can increase later. Consult the Skills chapter (p. 128) for active skill descriptions and the list of magic and Resonance skills. Adepts should ensure their chosen skills support desired powers (p. 308). Spell lists begin on p. 283; complex forms on p. 252.

Aspected magicians must select a specific magic skill group (Sorcery, Conjuring, or Enchanting). Once chosen, they can never acquire skills from the other magical groups, at creation or later.

Adepts gain Power Points equal to Magic for free. Mystic adepts must purchase Power Points with Karma (5 Karma per point) up to their Magic rating. These points are typically purchased during Step Seven.

Players are not restricted to the bundles provided by their priority choice. Additional spells, complex forms, registered sprites, or bound spirits can be purchased with Karma near the end of character creation.

### Implementation Notes

- Provide a step that unlocks options based on Magic/Resonance priority (Full Magician, Aspected, Adept, Mystic Adept, Technomancer, Mundane).
- Display starting Magic/Resonance ratings, bundled skill/spell allowances, and any automatic resources (spell points, Power Points).
- Enforce tradition/aspect selection rules (e.g., aspected magicians limited to one skill group, mystic adept Power Point purchases).
- Support Karma-based add-ons (extra spells, spirits, complex forms) and queue them for Step Seven costs.

### Open Questions & Data Gaps

- See [Step Three questions](./shadowrun-5e-questions-and-gaps.md#step-three-choose-magic-or-resonance).

## Step Four: Purchase Qualities

Qualities round out your character’s personality and provide bonuses or penalties. Positive Qualities grant benefits at the cost of Karma; Negative Qualities impose drawbacks but reward Karma.

Characters begin with 25 Karma. They may spend any portion on Qualities while respecting the limits of no more than 25 Karma worth of Positive Qualities and 25 Karma worth of Negative Qualities. Qualities acquired later follow Character Advancement rules (p. 103). Negative Qualities can be awarded by the gamemaster or bought off with Karma.

Record each Quality on the character sheet, noting any modifiers to skills or attributes.

### Implementation Notes

- Build a catalogue UI for browsing, filtering, and selecting Positive/Negative Qualities with costs and mechanical effects.
- Track Karma spent/refunded and enforce ±25 Karma caps during creation.
- Store quality-driven modifiers for later calculations (attribute adjustments, dice pool bonuses, restrictions).

### Open Questions & Data Gaps

- See [Step Four questions](./shadowrun-5e-questions-and-gaps.md#step-four-purchase-qualities).

## Step Five: Purchase Skills

With attributes assigned, choose skills using the Skills priority column. At this point only two priorities remain, so select one for Skills.

Skills fall into three categories:

- **Active Skills**: Offensive, defensive, and task-oriented abilities (firearms, driving, conning, spellcasting, registering sprites, etc.).
- **Knowledge Skills**: Information the character knows (hangouts, city layout, street clinics, corp politics, etc.).
- **Language Skills**: Languages the character can read, write, and speak.

### What the Numbers Mean

The first number in the Skills column is the pool of points available for individual skills, usually spent on Active skills but also usable for Knowledge and Language skills when needed. Spending one skill point either buys a new skill at rating 1 or increases an existing skill by 1.

The second number in the column is for skill groups. Groups bundle related skills that advance together. Purchasing a group grants all skills in the group at the same rating. Group points cannot buy individual skills, and individual skill points cannot raise group ratings. Skill groups cannot be broken during this step; you must wait until Step Seven to split them.

During character generation, no skill can exceed rating 6 (rating 7 requires the Aptitude quality). After creation, the maximum is 12 (13 with Aptitude). Spend every skill and group point before finishing this step.

Avoid duplicating purchases: if you buy the Athletics skill group, it already includes Running, so you do not need to buy Running separately.

Specializations represent focused expertise within a skill. Purchasing a specialization costs 1 skill point and grants +2 dice to tests involving that specialty. At character creation, a skill can have only one specialization. Additional specializations can be added later with Karma. Specializations cannot be applied to skill groups; adding one to a group skill immediately breaks the group, forcing future advancements to be purchased individually.

Strong characters balance marquee skills with supporting abilities. Shooters may also take Perception, Sneaking, and First Aid. Magicians often add Gymnastics or Palming. Faces benefit from backup combat skills. Build a versatile spread—you can raise secondary skills later with earned Karma.

### Restricted Skills

Some skills are restricted to characters with specific attributes. Magic and Resonance-based skills require corresponding Magic or Resonance ratings. Aspected magicians are limited to one category of magical skills, while full magicians and mystic adepts can take the entire range. Deckers cannot learn Resonance-based skills (Compiling, Decompiling, Registering). Consult the Skills chapter (p. 128) for detailed restrictions.

### Implementation Notes

- Implement a skill allocation UI that tracks individual and group point pools, prevents duplicate purchases, and enforces rating caps.
- Calculate skill costs dynamically based on linked attributes (1 point if ≤ attribute, 2 points if > attribute) and reflect projections for Karma upgrades.
- Support adding, editing, and removing specializations with automatic +2 dice tracking and group-breaking rules.
- Enforce restricted skill availability by checking Magic/Resonance status and aspected limitations.

### Open Questions & Data Gaps

- See [Step Five questions](./shadowrun-5e-questions-and-gaps.md#step-five-purchase-skills).

## Knowledge and Language Skills

Characters receive free Knowledge and Language skill points equal to (Intuition + Logic) × 2, spent like other skill points (1 point per rating). Each character also gains one native language at rating 6 for free (marked with “N”). The Bilingual quality grants a second native language.

Purchased language skills have numeric ratings that represent fluency. A rating of 1 indicates basic comprehension, while higher ratings reflect greater mastery. No Knowledge or Language skill may exceed rating 6 at creation. Language skills use Intuition as their linked attribute.

Knowledge skills fall into four categories:

- **Academic**
- **Interests**
- **Professional**
- **Street**

Determine whether each Knowledge skill uses Intuition or Logic based on its category. Some skills may straddle categories—choose the most appropriate one for your character concept.

### Implementation Notes

- Auto-calculate free Knowledge/Language point pool from current Intuition and Logic values.
- Provide category tagging for Knowledge skills and enforce maximum rating 6.
- Support native language selection with automatic rating assignment and optional second native language via Bilingual quality.
- Integrate Knowledge/Language spending into the main skill UI while keeping pools separate from Active skill points.

### Open Questions & Data Gaps

- See [Knowledge & Language questions](./shadowrun-5e-questions-and-gaps.md#knowledge--language-skills).

## Step Six: Spend Your Resources

Assign the remaining priority to Resources. This governs starting nuyen for gear and lifestyle.

Spend most of your starting nuyen before game play. Up to 5,000¥ may be carried over; any remaining balance is lost. Karma cannot be converted to nuyen, but you may convert up to 10 Karma into 20,000¥ (2,000¥ per Karma) to supplement purchases.

Essential gear often includes a commlink (p. 438), a fake SIN (p. 442), and appropriate licenses. Refer to the Gear Checklist sidebar for more ideas.

Three major restrictions apply to purchases:

1. Attribute augmentations from cyberware or bioware are capped at +4 over natural ratings.
2. Gear is limited to Availability 12 and Device Rating 6 at creation.
3. All gear choices require gamemaster approval.

### Implementation Notes

- Build a budget tracker that pulls Resource priority value, handles Karma-to-nuyen conversion, and enforces the 5,000¥ carryover limit.
- Present searchable catalogues for gear, augmentations, and lifestyle options with costs, availability, and device ratings.
- Flag purchases exceeding availability/device limits or violating metatype modifiers (e.g., troll lifestyle costs).
- Queue expenditures for later validation (e.g., ammunition quantity checks once inventory systems exist).

### Open Questions & Data Gaps

- See [Step Six questions](./shadowrun-5e-questions-and-gaps.md#step-six-spend-your-resources).

### Cyberware and Bioware

Cyberware and bioware enhance or replace parts of the body. Cyberware is mechanical, bioware is living tissue. Cyberware usually costs more Essence; bioware is more expensive in nuyen.

Racial bonuses can be lost when replacing body parts. For example, cybereyes remove an elf’s natural low-light vision unless the implant includes that modification. Orthoskin replaces a troll’s dermal deposits, eliminating the natural +1 dermal armor unless supplemented.

Cyberware/bioware grades include standard, alphaware, betaware, and deltaware (p. 451). Only standard and alphaware are available during character creation.

Essence loss affects magic users and technomancers severely: every fractional point of Essence lost reduces Magic or Resonance by 1. A magician with Magic 5 who installs rating 4 cybereyes drops to Essence 5.5 and Magic 4. The magician can lose another 0.5 Essence without penalty, but dropping below 5.0 reduces Magic again. Extensive augmentations can burn out magical or Resonance abilities entirely (see Magic Loss, p. 278, and Resonance Loss, p. 249).

Attributes boosted by augmentations do not affect calculations for Knowledge skills or Contacts, but they alter Initiative and Inherent Limits. When computing the Social limit, round remaining Essence up to the nearest whole number. Record augmented attributes on the sheet as `rating (augmented rating)`—for example, Strength 4 (6) after adding muscle augmentation 2.

### Implementation Notes

- Provide augmentation selection UI that tracks Essence costs, grade modifiers, nuyen costs, and attribute bonuses.
- Automatically decrement Magic/Resonance when Essence thresholds are crossed and warn when ratings approach zero.
- Handle replacement of racial traits (e.g., auto-remove natural low-light vision when cybereyes installed) and note compensating upgrades.
- Display augmented vs. natural attribute values for later derived calculations.

### Open Questions & Data Gaps

- See [Cyberware & Bioware questions](./shadowrun-5e-questions-and-gaps.md#cyberware--bioware).

### Lifestyle

Lifestyle defines day-to-day living conditions and monthly expenses. Options include Street, Squatter, Low, Middle, High, and Luxury (p. 373). Choose a lifestyle that fits the character concept and budget.

### Implementation Notes

- Offer lifestyle selection UI with costs, descriptive text, and automatic application of troll cost multipliers or quality modifiers.
- Integrate lifestyle purchase into overall resource budget and record monthly upkeep for campaign tracking.

### Open Questions & Data Gaps

- See [Lifestyle & Starting Nuyen questions](./shadowrun-5e-questions-and-gaps.md#lifestyle--starting-nuyen).

### Starting Nuyen

Starting nuyen depends on chosen lifestyle and a dice roll specified by the Starting Nuyen Table. Add the roll result to any unspent funds (up to the 5,000¥ carryover limit).

### Implementation Notes

- Add a helper that rolls or allows manual entry of starting nuyen per lifestyle table, applying carryover correctly.
- Store final starting funds for downstream systems (equipment purchase, session zero handoff).

### Open Questions & Data Gaps

- See [Lifestyle & Starting Nuyen questions](./shadowrun-5e-questions-and-gaps.md#lifestyle--starting-nuyen).

## Step Seven: Spend Your Leftover Karma

This step is the last opportunity to polish the character before final calculations. By now, you should understand the character concept and mechanics. Spend remaining Karma to smooth rough edges, improve skills or attributes, buy spells, acquire bound spirits, bond foci, or purchase contacts. Consult the Additional Purchases and Restrictions table to confirm any limitations. You may carry over up to 7 Karma into play.

Remember ongoing creation limits: only one attribute at its natural maximum, gear Availability no higher than 12, and Device Rating no higher than 6.

When spending Karma on attributes or skills, follow the advancement rules in Character Advancement (p. 103).

### Contacts

Contacts are vital. They supply gear, jobs, information, and favors. Every character receives free Karma equal to Charisma × 3 to spend on initial contacts.

Each contact has two ratings:

- **Connection**: Reach and influence in the shadows and beyond.
- **Loyalty**: Willingness to help the runner.

Both ratings must be at least 1. Loyalty 1–2 represents a business relationship; higher loyalty indicates friendship and greater risk tolerance. Refer to p. 386 for detailed rules.

### Implementation Notes

- Provide a Karma management panel that lists pending purchases (skills, spells, Power Points, contacts) and enforces the 7 Karma carryover cap.
- Support upgrading attributes/skills per Character Advancement costs and lock out illegal moves (e.g., exceeding natural maxima).
- Build a contacts manager that tracks Connection/Loyalty, free Karma allocation (Charisma × 3), and notes for each contact.
- Handle specialization purchases that break skill groups and adjust future advancement paths automatically.

### Open Questions & Data Gaps

- See [Step Seven questions](./shadowrun-5e-questions-and-gaps.md#step-seven-spend-your-leftover-karma).

## Step Eight: Final Calculations

After spending resources and Karma, compute derived mechanics. Many depend on final attribute and augmentation choices.

- **Initiative**: Intuition + Reaction. List natural and augmented values (e.g., 9 (11) + 2D6). Note additional initiative dice from augmentations.
- **Matrix Initiative** and **Astral Initiative**: Determined by mode (cold-sim, hot-sim) or astral rules (see p. 229 and p. 313).
- **Inherent Limits**: Calculated using formulas on the Final Calculations table (p. 101). Round up to the nearest whole number. When computing the Social limit, round Essence up before applying the formula.
- **Condition Monitors**: Determine Physical and Stun monitor boxes per the Damage chapter (p. 169).
- **Living Persona** (technomancers): Derive attributes per p. 250.

### Implementation Notes

- Automate derived statistic calculations using stored attribute and augmentation data, with breakdowns for natural vs. augmented values.
- Display formula inputs and outputs for verification and allow manual overrides with GM approval.
- Include prompts for Matrix/Astral initiative only when relevant (e.g., technomancer, awakened character).

### Open Questions & Data Gaps

- See [Step Eight questions](./shadowrun-5e-questions-and-gaps.md#step-eight-final-calculations).

## Step Nine: Final Touches

With mechanics in place, secure gamemaster approval. The GM may request adjustments to better fit the campaign. Be flexible and collaborate to ensure a fun experience.

Flesh out the character’s backstory. Qualities, attributes, and contacts provide a blueprint, but narrative details bring them to life. Consider why the character is a shadowrunner, notable aliases or street names, scars, friends, enemies, and unresolved relationships. Explain the origins of unusual gear or cyberware. A compelling background enriches roleplaying opportunities for everyone at the table.

### Implementation Notes

- Provide a final review screen summarizing priorities, metatype, attributes, skills, gear, and derived stats for GM sign-off.
- Offer export options (PDF, JSON, print-friendly) and space for narrative notes/backstory.
- Track approval status and revisions to support iterative updates.

### Open Questions & Data Gaps

- See [Step Nine questions](./shadowrun-5e-questions-and-gaps.md#step-nine-final-touches).

