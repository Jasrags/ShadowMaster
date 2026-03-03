# ShadowMaster Persona Validation: Feature Gap Analysis

This report identifies gaps in ShadowMaster's feature set relative to two reference personas:

- **Marcus "Fixer" Delacroix** — Experienced GM ([full persona](./marcus-gm.md))
- **Priya "Static" Vasquez** — Experienced Player ([full persona](./priya-player.md))

## Feature Inventory (What Exists)

| Area                              | Status         | Key Strengths                                                                          |
| --------------------------------- | -------------- | -------------------------------------------------------------------------------------- |
| Priority-based character creation | Complete       | Sheet-based single-page, auto-save, 17 creation cards                                  |
| Server-side validation            | Complete       | 15+ validators, attribute caps, budget enforcement, essence tracking                   |
| Combat tracking                   | Complete       | Initiative, action economy (Free/Simple/Complex/Interrupt), turn sequencing            |
| Condition monitors                | Complete       | Separate Physical/Stun/Overflow tracks, wound modifiers, interactive UI                |
| Grunt/NPC templates               | Complete       | PR0-PR6 templates, morale, group Edge, single-track CM                                 |
| Campaign management               | Complete       | Sessions, rewards, advancement approval, activity feeds, 9 UI tabs                     |
| Karma advancement                 | Complete       | Attributes, skills, specializations, Edge, spells, complex forms with correct formulas |
| Karma/nuyen session awards        | Complete       | Post-session distribution via SessionRewardDialog                                      |
| Ammunition system                 | Complete       | Caliber matching, magazine tracking, reload mechanics, firing mode consumption rates   |
| Edge tracking                     | Complete       | Maximum + current resource, advancement via karma                                      |
| Wireless system                   | Complete       | Global + per-item toggles, structured effect types, conditional modifiers              |
| Augmentations                     | Complete       | Cyberware/bioware, grades, essence (2-decimal precision), cyberlimb system             |
| Gear readiness states             | Complete       | 5 states: readied, holstered, worn, stored, stashed with action costs                  |
| Augmented vs natural display      | Complete       | Emerald highlight for augmented values, breakdown tooltips                             |
| Sourcebook configuration          | Complete (API) | Campaign-level `enabledBookIds` and `enabledCreationMethodIds`                         |
| Character persistence             | Complete       | Full JSON storage, immutable audit trail, append-only advancement records              |
| Essence hole mechanism            | Complete       | Permanent Magic loss tracking with configurable rounding formula                       |

## Gap Report

### BLOCKER Priority

#### GAP 1: Live dice pool display during character creation

**Persona:** Priya
**Issue:** No dice pools are calculated or shown during character creation. As attributes and skills are allocated, Priya cannot see computed pools like "Firearms (Pistols): 12 dice" or "Spellcasting: 10 dice." Dice pool calculators exist for Matrix and Rigging post-creation, but nothing surfaces pools in the creation UI. This is fundamental to how Priya thinks about character building — she "calculates her shooting pool before she's chosen her character's name."

#### GAP 2: GM character creation approval workflow

**Persona:** Marcus
**Issue:** No GM review gate exists between character creation and activation. Characters finalize from draft to active with only automated server validation — no "pending-review" state. Marcus needs to verify player characters are valid and appropriate before play. Advancement approval exists (`/lib/rules/advancement/approval.ts`) but creation approval does not. Marcus's workflow explicitly includes "review and approve player characters before the run."

### HIGH Priority

#### GAP 3: GM party overview / character roster summary

**Persona:** Marcus
**Issue:** No unified GM view showing all player characters at a glance. `CampaignCharactersTab.tsx` lists characters but does not surface key stats (initiative, condition monitors, dice pools, armor values) in a scannable format. Marcus needs to see party composition and combat readiness without clicking into individual sheets. During combat, this becomes critical for tracking the state of the entire encounter.

#### GAP 4: Specialization +2 dice bonus not applied to dice pools

**Persona:** Priya
**Issue:** Specializations are tracked in character data (`skillSpecializations` record) and displayed by name in the skill list, but the +2 dice bonus is not calculated into displayed dice pools. Priya expects specializations to be mechanically reflected, not just labeled. When she takes Pistols (Revolvers), the sheet should show the +2 bonus in context.

#### GAP 5: Downstream effect preview for qualities and augmentations

**Persona:** Priya
**Issue:** Only essence loss to Magic cap reduction is previewed live during creation. Quality effects (18 effect types, 21 triggers in `/lib/rules/effects/constants.ts`) are not rendered during creation — they only apply after finalization. Priya cannot see how installing cyberware changes her dice pools, how a quality modifies her defense pool, or how choosing an Adept way opens new power options. She wants to "understand the downstream effect of every choice before committing."

#### GAP 6: Archetype / quick-build character creation

**Persona:** Marcus
**Issue:** No archetype or quick-build system exists. No pre-allocated attribute/skill/gear packages. Grunt templates exist for NPCs (`/data/editions/sr5/grunt-templates/`) but no player character archetypes. Marcus needs to "build one-shots fast using archetypes or quick-build options." This also helps new players at his table get started without mastering the full priority system.

#### GAP 7: In-app rule quick-reference

**Persona:** Marcus (primary), Priya (secondary)
**Issue:** No searchable in-app rule reference exists. `CombatQuickReference.tsx` shows pre-calculated combat pools for individual characters, but there is no general-purpose rule lookup for action types, modifiers, opposed test tables, range bands, or situational rules. Marcus's definition of success is "running a full session without opening the physical book." Rules documentation exists in `/docs/rules/` as markdown but is not surfaced in the app.

#### GAP 8: Sourcebook configuration UI

**Persona:** Marcus
**Issue:** Campaign-level book control exists at the API level (`enabledBookIds` in campaign settings) but there is no GM-facing UI to configure which sourcebooks are active. Marcus cannot toggle books on/off from the campaign interface. During character creation, there is no indication of which books are active or why certain options may be unavailable. Marcus needs to "configure which sourcebooks and optional rules are active per campaign" through a visible interface.

#### GAP 9: Edge spending integration in combat UI

**Persona:** Priya
**Issue:** Edge is tracked as maximum and current resource, and the combat system checks Edge availability, but there is no UI to spend Edge during combat for rerolls, Push the Limit, Second Chance, or Seize Initiative. The dice engine in `/lib/rules/action-resolution/dice-engine.ts` supports these Edge actions mechanically, but they are not accessible from the combat interface. Priya needs to "track Edge spent" during sessions.

### MEDIUM Priority

#### GAP 10: Ammo consumption tracking in combat

**Persona:** Priya
**Issue:** Full ammunition inventory exists (caliber matching, magazine capacity, spare magazines, reload mechanics, firing mode consumption rates) but rounds fired are not consumed during combat. The combat system does not decrement ammo counts when attacks are made. Priya tracks "ammo, grenades, Edge spent" as part of her session workflow. The data model supports this but the combat flow does not trigger consumption.

#### GAP 11: Magic/Resonance maximum reduction display on character sheet

**Persona:** Priya
**Issue:** The essence hole mechanism is fully implemented in `/lib/rules/augmentations/essence-hole.ts` and tracks permanent Magic loss. However, the character sheet does not display the reduced Magic maximum versus the base Magic rating. Priya expects to see that her Adept's Magic 6 has been reduced to Magic 5 because of 0.8 Essence lost, with the reduction clearly attributed.

#### GAP 12: Lifestyle management during play

**Persona:** Priya
**Issue:** Lifestyle data structures exist (type, monthly cost, prepaid months, location, modifications, subscriptions, identity link) but there is no UI for managing lifestyles between sessions. No automatic cost deduction, no "current lifestyle" indicator, no downtime integration. Priya expects to "purchase new gear, update lifestyle" between sessions.

#### GAP 13: Grunt team UI builder in campaigns

**Persona:** Marcus
**Issue:** The grunt rules engine is comprehensive (PR0-PR6, morale, group Edge, rally mechanics in `/lib/rules/grunts.ts`, 809 lines) and 7 pre-built templates exist, but there is no UI in the campaign interface to build, customize, or manage grunt teams. Marcus must use templates directly rather than having a campaign-integrated encounter builder. He needs NPCs to take "under 10 minutes to build."

#### GAP 14: Character creation conflict detection

**Persona:** Priya
**Issue:** Priority conflict detection in `PrioritySelectionCard.tsx` is marked TODO (lines 284-286). When swapping priorities, downstream effects on already-allocated attributes/skills/resources are not flagged. Priya's workflow includes "swap a priority, observe all downstream changes live" — she needs clear feedback when a priority change invalidates or reduces existing allocations.

### LOW Priority

#### GAP 15: Edge recovery rules

**Persona:** Both
**Issue:** Edge tracking exists for maximum and current values, but there are no Edge recovery rules implemented (Edge refreshes between sessions per SR5 rules). Neither Marcus nor Priya has a mechanism to refresh Edge pools between scenes or sessions.

#### GAP 16: Mid-session karma/nuyen awards

**Persona:** Marcus
**Issue:** Session rewards are distributed post-session via `SessionRewardDialog.tsx`. There is no mechanism for mid-session bonuses (roleplay rewards, combat excellence, etc.). This is a minor convenience gap — Marcus can note and distribute after the session.

#### GAP 17: Container/hierarchy gear system

**Persona:** Priya
**Issue:** Gear readiness has 5 states (readied through stashed) but no container hierarchy. Items cannot be placed "inside" a backpack or vehicle trunk as sub-containers. The current system is abstract — "stored" means generally not accessible, but Priya cannot organize gear by physical location. The 5-state system is a reasonable approximation but lacks the granularity SR5 players expect for inventory planning.

## Top 5 Issues by Priority and Impact

| Rank  | Gap                                                 | Persona | Priority | Impact                                                                                                  |
| ----- | --------------------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------- |
| **1** | Live dice pool display during character creation    | Priya   | BLOCKER  | Core to how experienced SR5 players build characters. Without pools, creation becomes guesswork.        |
| **2** | GM character creation approval workflow             | Marcus  | BLOCKER  | No quality gate before play. Marcus cannot fulfill his core responsibility of verifying characters.     |
| **3** | GM party overview / character roster summary        | Marcus  | HIGH     | Forces Marcus to click through individual sheets during prep and play, breaking flow.                   |
| **4** | Specialization +2 dice not applied to pools         | Priya   | HIGH     | Mechanical inaccuracy. Specializations are a core SR5 optimization and the bonus must be visible.       |
| **5** | Downstream effect preview (qualities/augmentations) | Priya   | HIGH     | Prevents informed decision-making during creation. Effects exist in code but are invisible to the user. |

## Methodology Notes

- All gaps were verified against actual codebase implementations, not documentation claims
- "Complete" features were confirmed by reading source code, types, and component files
- Priorities reflect the personas' stated workflows and definitions of success
- Several HIGH-priority items (archetypes, rule reference, sourcebook UI, Edge spending) ranked just below the top 5 and would appear in a top 10
