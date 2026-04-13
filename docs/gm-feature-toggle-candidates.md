# GM Feature Toggle Candidates

Audit of the ShadowMaster codebase identifying every implemented system that could be surfaced as a GM-configurable feature toggle in campaign settings.

**Audit date:** 2026-03-26
**Codebase:** ShadowMaster (Next.js / TypeScript)
**Edition:** SR5 (3 books loaded: Core Rulebook, Core Errata 2014-02-09, Run Faster)

---

## SR5 Core Rulebook (SR5)

### 1. Dice Rolling (App vs. Physical Dice)

- **What it controls:** Whether the app rolls dice for combat, spellcasting, and skill tests, or defers to the GM and players rolling physical dice and entering results manually.
- **Current behavior:** The dice engine (`lib/rules/action-resolution/dice-engine.ts`) is fully implemented with `rollDice()`, `rollDiceExploding()`, `executeRoll()`, and `executeReroll()`. Rolls are always app-generated using cryptographically secure random. There is no "manual entry" mode.
- **Toggle idea:** "Dice Mode" — `app-roll` (default) vs. `manual-entry` (players enter hit counts from physical dice). In manual mode, the app skips auto-rolling and presents input fields for hits, ones, and glitch status.
- **Implementation location:**
  - `lib/rules/action-resolution/dice-engine.ts` — `executeRoll()`, `rollDice()`, `rollD6()`
  - `lib/rules/action-resolution/edge-actions.ts` — Edge action definitions (Push the Limit, Second Chance, etc.)
- **Toggle exists today:** No

### 2. Hit Threshold and Glitch Rules

- **What it controls:** What number counts as a hit (default: 5+), the glitch threshold (default: more than 50% ones), and whether critical glitches require zero hits.
- **Current behavior:** Hardcoded in `DEFAULT_DICE_RULES` — `hitThreshold: 5`, `glitchThreshold: 0.5`, `criticalGlitchRequiresZeroHits: true`. The `EditionDiceRules` type supports overrides, but no campaign UI exposes them.
- **Toggle idea:** Allow GMs to tweak for house rules — e.g., hits on 4+ (easier), critical glitches even with hits (harsher). Rare use case but the plumbing exists.
- **Implementation location:**
  - `lib/rules/action-resolution/dice-engine.ts:17-76` — `DEFAULT_DICE_RULES` constant
  - `lib/types/` — `EditionDiceRules` type (already supports overrides)
- **Toggle exists today:** Partial (type supports it, no UI)

### 3. Wound Modifier Calculation

- **What it controls:** How many damage boxes trigger a -1 dice pool penalty, and the maximum wound penalty.
- **Current behavior:** Hardcoded in `DEFAULT_DICE_RULES.woundModifiers` — `boxesPerPenalty: 3`, `maxPenalty: -4`. The type supports different values.
- **Toggle idea:** GMs running grittier games might set `boxesPerPenalty: 2` (harsher wounds). GMs running cinematic games might set `maxPenalty: -2` (less punishing).
- **Implementation location:**
  - `lib/rules/action-resolution/dice-engine.ts:72-75` — `woundModifiers` config
  - `lib/rules/action-resolution/pool-builder.ts` — wound modifier applied to dice pools
- **Toggle exists today:** Partial (type supports it, no UI)

### 4. Gameplay Level Presets (Street / Standard / Prime Runner)

- **What it controls:** Starting karma, maximum gear availability at creation, contact point multiplier, and resource multiplier.
- **Current behavior:** Three presets defined in `core-rulebook.json` module `gameplayLevels`. Selected at campaign creation and enforced throughout character creation. Values: Street (13 karma, avail 6, CHA×2), Experienced (25 karma, avail 12, CHA×3), Prime Runner (35 karma, avail 18, CHA×5, 1.5× resources).
- **Toggle idea:** Already configurable as a campaign setting. Could be extended with "Custom" option letting GMs set arbitrary values for each field.
- **Implementation location:**
  - `data/editions/sr5/core-rulebook.json` — `gameplayLevels` module
  - `app/campaigns/create/page.tsx:343-362` — gameplay level selector
  - `app/campaigns/[id]/settings/page.tsx:558-578` — editable in settings
  - `lib/types/edition.ts` — `GameplayLevelModifiers` interface
- **Toggle exists today:** Yes (preset selection), but not fully custom

### 5. Character Creation Method Restrictions

- **What it controls:** Which creation methods players can use (Priority, Sum-to-Ten, Point Buy, Life Modules).
- **Current behavior:** GMs select enabled creation methods at campaign creation (`enabledCreationMethodIds`). Characters are blocked from using disabled methods via `getAvailableCreationMethods()` and `validateCreationMethodForCampaign()`.
- **Toggle idea:** Already implemented. GMs can enable/disable each method per campaign.
- **Implementation location:**
  - `lib/types/campaign.ts:87` — `enabledCreationMethodIds`
  - `lib/rules/creation-method-filter.ts` — filtering and validation
  - `app/campaigns/[id]/settings/page.tsx:539-556` — creation method checkboxes
- **Toggle exists today:** Yes

### 6. Attribute Rating Cap (One at Max Rule)

- **What it controls:** During creation, only one Physical or Mental attribute can be at the metatype maximum. Exceptional Attribute quality allows one more.
- **Current behavior:** Hardcoded in `lib/rules/validation/constraint-attribute-limit.ts`. The constraint checks `maxAtMax` parameter (default 1) and grants +1 for Exceptional Attribute quality. Campaign `advancementSettings.attributeRatingCap` applies a separate absolute cap during advancement.
- **Toggle idea:** "Attribute Max Enforcement" — strict (only 1 at max, default), relaxed (2 at max), or off (no limit). Some GMs find the one-at-max rule too restrictive for experienced runners.
- **Implementation location:**
  - `lib/rules/validation/constraint-attribute-limit.ts` — `maxAtMax` parameter
  - `app/campaigns/[id]/settings/components/AdvancementSettingsForm.tsx:150-196` — attribute rating cap input
- **Toggle exists today:** Partial (advancement cap exists, creation "one at max" is hardcoded)

### 7. Skill Rating Cap at Creation

- **What it controls:** Maximum skill rating during character creation (default: 6, or 7 with Aptitude quality).
- **Current behavior:** Hardcoded in `lib/rules/validation/constraint-skill-limit.ts` — base max 6, Aptitude allows 7 for one skill. Campaign `advancementSettings.skillRatingCap` applies during advancement.
- **Toggle idea:** GMs who want more powerful starting characters could raise the creation cap to 7 or 8. Configurable as `creationSkillCap` separate from advancement cap.
- **Implementation location:**
  - `lib/rules/validation/constraint-skill-limit.ts` — `max` and `maxWithAptitude` params
  - `app/campaigns/[id]/settings/components/AdvancementSettingsForm.tsx:184-193` — skill rating cap input (advancement only)
- **Toggle exists today:** Partial (advancement cap exists, creation cap hardcoded)

### 8. Gear Availability at Creation

- **What it controls:** Maximum availability rating for gear purchasable during character creation (default: 12), and whether Restricted/Forbidden items are allowed.
- **Current behavior:** Hardcoded in `CREATION_CONSTRAINTS` — `maxAvailabilityAtCreation: 12`, `allowRestrictedAtCreation: false`, `allowForbiddenAtCreation: false`. Gameplay level modifiers override `maxAvailability` (Street: 6, Experienced: 12, Prime: 18).
- **Toggle idea:** "Gear Restriction Level" — strict (no R/F items, default), relaxed (R items with GM approval), or open (all items). Some GMs allow Restricted gear at creation for Prime Runner games.
- **Implementation location:**
  - `lib/rules/gear/validation.ts:42-54` — `CREATION_CONSTRAINTS`
  - `lib/rules/validation/constraint-equipment-rating.ts:117-122` — availability enforcement
  - `components/creation/matrix-gear/matrixGearHelpers.ts:16` — UI constraint reference
- **Toggle exists today:** No (hardcoded, gameplay level partially overrides availability number)

### 9. Quality Karma Caps (25/25 Rule)

- **What it controls:** Maximum karma spent on positive qualities (25) and maximum karma gained from negative qualities (25) during creation.
- **Current behavior:** Hardcoded in `lib/rules/creation/budget-validation.ts:90-109`. Exceeding either cap produces a blocking error.
- **Toggle idea:** "Quality Karma Limits" — standard (25/25), expanded (35/35 for experienced campaigns), or unlimited (honor system). Many GMs house-rule higher caps.
- **Implementation location:**
  - `lib/rules/creation/budget-validation.ts:90-109` — hardcoded 25 karma checks
  - `lib/types/index.ts` — `LIFE_MODULES_MAX_NEGATIVE_QUALITIES` constant (also 25)
- **Toggle exists today:** No

### 10. Karma-to-Nuyen Conversion Cap

- **What it controls:** How much karma can be converted to nuyen during creation (default: 10 karma = 20,000¥). Born Rich quality raises this to 40 karma.
- **Current behavior:** Default cap from `lib/rules/qualities/budget-modifiers.ts`. Life Modules uses a separate constant (`LIFE_MODULES_MAX_GEAR_KARMA = 200`). Enforced as an error in `budget-validation.ts:112-124`.
- **Toggle idea:** "Karma-to-Nuyen Cap" — standard (10), generous (20), or per creation method default. Lets GMs control how gear-heavy starting characters can be.
- **Implementation location:**
  - `lib/rules/creation/budget-validation.ts:112-124` — cap enforcement
  - `lib/rules/qualities/budget-modifiers.ts` — `getDefaultModifiers()` returns default cap
- **Toggle exists today:** No (quality-driven override exists, no GM override)

### 11. Nuyen and Karma Carryover Limits

- **What it controls:** How much unspent nuyen (default: 5,000¥) and karma (default: 7) a character can carry from creation into gameplay.
- **Current behavior:** Warnings (not errors) in `budget-validation.ts:51-68`. Excess is flagged but not blocked — the player is told "X will be lost."
- **Toggle idea:** "Carryover Policy" — standard (warn about loss), strict (hard error, must spend), or generous (raise caps to 10,000¥ / 15 karma).
- **Implementation location:**
  - `lib/rules/creation/budget-validation.ts:51-68` — warning-level checks
- **Toggle exists today:** No

### 12. Contact Rating Limits

- **What it controls:** Maximum Connection rating (SR5: 12) and Loyalty rating (all editions: 6) for contacts.
- **Current behavior:** Hardcoded in `lib/rules/contacts.ts` — `getMaxConnection('sr5')` returns 12, `getMaxLoyalty()` returns 6. Validated in `validateContact()`.
- **Toggle idea:** GMs could cap Connection lower (e.g., max 6 for street-level campaigns) or raise Loyalty cap for relationship-heavy games.
- **Implementation location:**
  - `lib/rules/contacts.ts:32-61` — max connection/loyalty by edition
  - `components/creation/contacts/ContactsCard.tsx:68-99` — UI enforcement
- **Toggle exists today:** No

### 13. Contact Karma Budget (CHA × Multiplier)

- **What it controls:** Free contact karma during creation, calculated as Charisma × gameplay level multiplier (Street: ×2, Experienced: ×3, Prime: ×5).
- **Current behavior:** Driven by gameplay level modifiers from `gameplayLevels` data module. "Friends in High Places" quality adds bonus via `FRIENDS_IN_HIGH_PLACES_CONTACT_MULTIPLIER`.
- **Toggle idea:** Already partially configurable via gameplay level. Could expose a direct "Contact Karma Multiplier" override independent of gameplay level.
- **Implementation location:**
  - `components/creation/contacts/ContactsCard.tsx:69-72` — budget calculation
  - `data/editions/sr5/core-rulebook.json` — `gameplayLevels` module `contactMultiplier`
- **Toggle exists today:** Partial (tied to gameplay level, no independent override)

### 14. Essence and Magic/Resonance Reduction Formula

- **What it controls:** How essence loss from augmentations reduces Magic (or Resonance) — round up (default, most punishing), round down (lenient), or exact (house rule).
- **Current behavior:** Configurable via `AugmentationRulesData.magicReductionFormula` in edition rules. Default is `"roundUp"`. The `calculateEffectiveMagic()` function supports all three modes.
- **Toggle idea:** "Magic Loss Formula" — `roundUp` (RAW), `roundDown` (lenient house rule), `exact` (fractional tracking). This is one of the most common house rules in SR5.
- **Implementation location:**
  - `lib/rules/magic/essence-magic-link.ts:20,37-63` — formula selection and calculation
  - `lib/rules/augmentations/validation.ts:127` — `magicReductionFormula` in default rules
- **Toggle exists today:** Partial (type and logic support it, no campaign UI to set it)

### 15. Essence Hole Tracking

- **What it controls:** Whether removing augmentations creates "essence holes" (permanently lost essence that can't be reclaimed), or whether essence fully returns.
- **Current behavior:** `trackEssenceHoles: true` in `DEFAULT_AUGMENTATION_RULES`. Logic exists in `lib/rules/augmentations/essence-hole.ts`. Currently tracks but essence hole value is always 0 in `getEssenceMagicState()`.
- **Toggle idea:** "Essence Holes" — on (RAW, essence is permanently lost when chrome is removed) vs. off (essence fully recovers, more forgiving).
- **Implementation location:**
  - `lib/rules/augmentations/essence-hole.ts` — essence hole calculations
  - `lib/rules/augmentations/validation.ts:125` — `trackEssenceHoles` flag
  - `lib/rules/magic/essence-magic-link.ts:139` — always 0 (not yet fully wired)
- **Toggle exists today:** Partial (flag exists in rules data, not exposed to GM)

### 16. Cyberware/Bioware Grade Availability

- **What it controls:** Which augmentation grades are available (Used, Standard, Alpha, Beta, Delta) and their essence multipliers.
- **Current behavior:** All grades defined with fixed multipliers — Used (1.5×), Standard (1.0×), Alpha (0.8×), Beta (0.6×), Delta (0.4×). No campaign-level restriction on which grades players can access.
- **Toggle idea:** "Available Augmentation Grades" — GMs could restrict to Standard-only for street-level games, or unlock Delta for high-power campaigns.
- **Implementation location:**
  - `lib/rules/augmentations/grades.ts` — `getCyberwareGradeMultiplier()`, `getBiowareGradeMultiplier()`
  - `lib/rules/augmentations/essence.ts` — essence cost calculations using grade multipliers
- **Toggle exists today:** No

### 17. Cyberlimb Attribute Bonus Cap

- **What it controls:** Maximum attribute bonus from cyberlimbs (default: +4 per attribute).
- **Current behavior:** Hardcoded in `DEFAULT_AUGMENTATION_RULES.maxAttributeBonus = 4`. Validated during augmentation installation.
- **Toggle idea:** GMs could lower this for grittier games or raise it for cyber-heavy campaigns.
- **Implementation location:**
  - `lib/rules/augmentations/validation.ts:124` — `maxAttributeBonus` in default rules
- **Toggle exists today:** No (value exists in rules data, not exposed to GM)

### 18. Advancement Karma Multipliers

- **What it controls:** Karma costs for improving attributes, skills, and learning spells during advancement.
- **Current behavior:** Fully configurable per campaign via `CampaignAdvancementSettings`. Default multipliers: Attribute (×5), Active Skill (×2), Skill Group (×5), Knowledge Skill (×1). Fixed costs: Specialization (7), Spell (5), Complex Form (4).
- **Toggle idea:** Already implemented. GMs can modify all multipliers and fixed costs.
- **Implementation location:**
  - `lib/types/campaign.ts:30-42` — `AdvancementRulesData` interface
  - `app/campaigns/[id]/settings/components/AdvancementSettingsForm.tsx` — full editing UI
  - `lib/rules/advancement/costs.ts` — karma cost calculations
- **Toggle exists today:** Yes

### 19. Advancement Rating Caps

- **What it controls:** Maximum attribute rating (default: 10) and skill rating (default: 13) during advancement.
- **Current behavior:** Required fields in `CampaignAdvancementSettings`. Enforced during validation in `campaign-validation.ts:71-98`.
- **Toggle idea:** Already implemented. GMs set caps per campaign.
- **Implementation location:**
  - `lib/types/campaign.ts:49-52` — `attributeRatingCap`, `skillRatingCap`
  - `lib/rules/campaign-validation.ts:71-98` — enforcement
  - `app/campaigns/[id]/settings/components/AdvancementSettingsForm.tsx:150-196` — UI inputs
- **Toggle exists today:** Yes

### 20. Training Time Requirements

- **What it controls:** Whether advancing attributes/skills requires in-game training time, and the time multiplier.
- **Current behavior:** Configurable via `trainingTimeMultiplier` in advancement settings. `allowInstantAdvancement` boolean bypasses training entirely.
- **Toggle idea:** Already implemented. GMs can set multiplier or enable instant advancement.
- **Implementation location:**
  - `lib/types/campaign.ts:31` — `trainingTimeMultiplier`
  - `lib/types/campaign.ts:41` — `allowInstantAdvancement`
  - `app/campaigns/[id]/settings/components/AdvancementSettingsForm.tsx:199-265` — UI toggles
  - `lib/rules/advancement/training.ts` — training time calculation
- **Toggle exists today:** Yes

### 21. GM Approval for Character Finalization

- **What it controls:** Whether newly created characters go through GM review before becoming active, or are auto-approved.
- **Current behavior:** If campaign has `requireApproval: true`, finalized characters enter "pending-review" state. GM must explicitly approve or reject with feedback.
- **Toggle idea:** Already implemented as `requireApproval` in advancement settings.
- **Implementation location:**
  - `lib/types/campaign.ts:54` — `requireApproval`
  - `app/api/characters/[characterId]/finalize/route.ts:126-171` — approval workflow
  - `app/api/campaigns/[id]/characters/[characterId]/approve/route.ts` — GM approval endpoint
- **Toggle exists today:** Yes

### 22. GM Approval for Advancements

- **What it controls:** Whether character advancements (spending karma to improve attributes/skills) require GM approval or are auto-applied.
- **Current behavior:** Tied to the same `requireApproval` flag. Advancement approval/rejection endpoints exist.
- **Toggle idea:** Could be separated from character approval — some GMs want to review new characters but auto-approve karma spending.
- **Implementation location:**
  - `app/api/campaigns/[id]/advancements/[recordId]/approve/route.ts`
  - `app/api/campaigns/[id]/advancements/[recordId]/reject/route.ts`
- **Toggle exists today:** Yes (shared with character approval)

### 23. Drain Minimum and Formula

- **What it controls:** Minimum drain value (default: 2) and drain formula for spellcasting.
- **Current behavior:** Minimum drain hardcoded to 2 in `lib/rules/magic/drain-calculator.ts:51`. Supports `customDrainFormula` parameter for house rules. Drain type (Stun vs Physical) determined by comparing drain value to Magic rating.
- **Toggle idea:** "Custom Drain Rules" — allow GMs to set minimum drain value and override drain formulas per tradition.
- **Implementation location:**
  - `lib/rules/magic/drain-calculator.ts` — drain calculations, `customDrainFormula` parameter
  - `lib/rules/magic/tradition-validator.ts` — tradition-specific drain attributes
- **Toggle exists today:** Partial (code supports custom formulas, no campaign UI)

### 24. Limit Enforcement (Physical/Mental/Social)

- **What it controls:** Whether hits on tests are capped by the relevant limit (Physical, Mental, Social), or if limits are ignored.
- **Current behavior:** Limits calculated in `pool-builder.ts` using `(Attr1 + Attr2 + Attr3) / 3, rounded up`. Applied via `calculateHitsWithLimit()` in the dice engine. Push the Limit edge action bypasses limits.
- **Toggle idea:** "Limit Enforcement" — on (RAW), off (house rule that many tables use to simplify play), or advisory (show the limit but don't cap hits).
- **Implementation location:**
  - `lib/rules/action-resolution/pool-builder.ts` — limit calculation formulas
  - `lib/rules/action-resolution/dice-engine.ts:176-196` — `calculateHitsWithLimit()`
- **Toggle exists today:** No

### 25. Sourcebook Availability Filtering

- **What it controls:** Which sourcebooks' content (gear, qualities, metatypes, spells, creation methods) is available in the campaign.
- **Current behavior:** Fully implemented via `enabledBookIds` on the Campaign type. Core and Errata books are required (cannot be disabled in UI). Optional sourcebooks (Run Faster) can be toggled. Character validation checks book availability.
- **Toggle idea:** Already implemented. Core books locked, optional books toggleable.
- **Implementation location:**
  - `lib/types/campaign.ts:84` — `enabledBookIds`
  - `app/campaigns/[id]/settings/page.tsx:470-536` — book selection UI with required/optional badges
  - `lib/rules/campaign-validation.ts:38-54` — book compliance validation
- **Toggle exists today:** Yes

### 26. Optional Rules System

- **What it controls:** Framework for enabling/disabling optional rules defined in sourcebooks. Rules can affect any module (combat, magic, matrix, etc.).
- **Current behavior:** Full infrastructure in `lib/rules/optional-rules.ts` — extraction from book data, resolution with campaign overrides, validation. `disabledRuleIds` takes precedence. Campaign type has `optionalRules` field.
- **Toggle idea:** Already implemented as an infrastructure. Currently no optional rules are defined in the book data, but the system is ready for them.
- **Implementation location:**
  - `lib/rules/optional-rules.ts` — full CRUD for optional rule state
  - `lib/types/campaign.ts:101-106` — campaign storage
  - `lib/rules/campaign-validation.ts:104-129` — compliance validation
- **Toggle exists today:** Yes (infrastructure), but no rules are populated yet

### 27. Edge Actions

- **What it controls:** Which Edge actions are available (Push the Limit, Second Chance, Seize the Initiative, Blitz, Close Call, Dead Man's Trigger).
- **Current behavior:** All six actions hardcoded in `DEFAULT_DICE_RULES.edgeActions`. Each has cost, timing (pre/post roll), and effects defined.
- **Toggle idea:** GMs could disable specific Edge actions (e.g., no Blitz in a slower-paced campaign) or modify Edge costs.
- **Implementation location:**
  - `lib/rules/action-resolution/dice-engine.ts:24-71` — edge action definitions
  - `lib/rules/action-resolution/edge-actions.ts` — edge action logic
- **Toggle exists today:** No

### 28. Lifestyle Options

- **What it controls:** Available lifestyle tiers and their mechanical effects (Street, Squatter, Low, Middle, High, Luxury).
- **Current behavior:** Six tiers with point budgets and component constraints (Comforts, Security, Neighborhood). Validated in `lib/rules/lifestyle/validation.ts`. Entertainment options have min-lifestyle requirements.
- **Toggle idea:** GMs could restrict available lifestyle tiers (e.g., no Luxury in a street-level campaign) or modify point budgets.
- **Implementation location:**
  - `lib/rules/lifestyle/validation.ts` — lifestyle component validation
  - `data/editions/sr5/core-rulebook.json` — lifestyle module data
- **Toggle exists today:** No

---

## Run Faster (RF)

### 29. Sum-to-Ten Budget

- **What it controls:** Total priority points for Sum-to-Ten creation (default: exactly 10, using A=4, B=3, C=2, D=1, E=0).
- **Current behavior:** Hardcoded in `lib/rules/sum-to-ten-validation.ts`. Point values per level and total budget (10) are constants.
- **Toggle idea:** "Sum-to-X" — GMs could set a different total (e.g., Sum-to-8 for street-level, Sum-to-12 for prime runner). The point values per level could also be adjusted.
- **Implementation location:**
  - `lib/rules/sum-to-ten-validation.ts` — validation logic and constants
- **Toggle exists today:** No

### 30. Point Buy Karma Budget

- **What it controls:** Starting karma for Point Buy creation (default: 800 Karma) and conversion rates (1 Karma = 2,000¥).
- **Current behavior:** Constants in `lib/rules/point-buy-validation.ts` — `POINT_BUY_KARMA_BUDGET = 800`, `POINT_BUY_MAX_GEAR_KARMA = 200`, `POINT_BUY_NUYEN_PER_KARMA = 2000`, `POINT_BUY_MAX_LEFTOVER_NUYEN = 5000`.
- **Toggle idea:** GMs could adjust the starting budget for different power levels, or modify the nuyen conversion rate.
- **Implementation location:**
  - `lib/rules/point-buy-validation.ts:19-28` — budget constants
  - `lib/rules/point-buy-validation.ts:34-50+` — metatype costs table
- **Toggle exists today:** No

### 31. Point Buy Metatype Costs

- **What it controls:** Karma cost to play each metatype in Point Buy creation (Human: 0, Elf: 40, Dwarf: 50, Ork: 50, Troll: 90, plus metavariants).
- **Current behavior:** Hardcoded table `POINT_BUY_METATYPE_COSTS` with 20+ entries including metavariants from Run Faster.
- **Toggle idea:** GMs could adjust metatype costs to encourage or discourage certain picks. Setting Human cost > 0 or Troll cost lower makes non-human characters more viable.
- **Implementation location:**
  - `lib/rules/point-buy-validation.ts:34-50+` — cost table
- **Toggle exists today:** No

### 32. Life Modules Budget and Caps

- **What it controls:** Starting karma (750), max active skill rating (7), max knowledge skill rating (9), max gear karma (200), and max negative quality karma (25) for Life Modules creation.
- **Current behavior:** Constants in `lib/rules/life-modules-validation.ts` and `lib/types/index.ts`.
- **Toggle idea:** Similar to Point Buy, GMs could adjust the starting budget and caps for different campaign power levels.
- **Implementation location:**
  - `lib/rules/life-modules-validation.ts` — validation logic and constants
  - `lib/types/index.ts` — `LIFE_MODULES_MAX_GEAR_KARMA`, `LIFE_MODULES_MAX_NEGATIVE_QUALITIES`
- **Toggle exists today:** No

### 33. Run Faster Metatype Availability

- **What it controls:** Whether exotic metatypes from Run Faster (Gnome, Hanuman, Naga, Pixie, Sasquatch, etc.) are available for character creation.
- **Current behavior:** Controlled by the sourcebook toggle (`enabledBookIds`). If Run Faster is disabled, its metatypes are unavailable. No per-metatype toggle within Run Faster.
- **Toggle idea:** Allow GMs to enable Run Faster for qualities/creation methods but restrict specific exotic metatypes that don't fit their campaign setting.
- **Implementation location:**
  - `data/editions/sr5/run-faster.json` — metatypes module with `mergeStrategy: "append"`
  - `lib/rules/campaign-validation.ts:38-54` — book-level filtering
- **Toggle exists today:** Partial (book-level only, no per-metatype granularity)

---

## Cross-Book Systems

### 34. House Rules Storage

- **What it controls:** Freeform storage for GM house rules — text description or structured JSON.
- **Current behavior:** Campaign type has `houseRules?: string | Record<string, unknown>` field. Stored and validated in `lib/storage/campaigns.ts` and `lib/storage/validation.ts`. Seed data shows example usage: `["No edge rerolls", "Threshold 5 for called shots"]`.
- **Toggle idea:** The field exists but has no mechanical enforcement. This is the natural home for structured house rules that map to the toggle candidates above.
- **Implementation location:**
  - `lib/types/campaign.ts:108-109` — type definition
  - `lib/storage/campaigns.ts:277` — persistence
  - `lib/storage/validation.ts:497-500` — validation
  - `scripts/seed-data.ts:430` — example seed data
- **Toggle exists today:** Partial (storage exists, no enforcement or structured UI)

### 35. Matrix Overwatch Score

- **What it controls:** Overwatch Score accumulation from Matrix actions. A comment in `lib/rules/matrix/overwatch-calculator.ts:88` notes "Critical glitches add extra OS (GM discretion, +2d6 is common house rule)."
- **Current behavior:** OS calculation implemented with explicit GM discretion noted in comments.
- **Toggle idea:** "Overwatch Critical Glitch Rule" — off (RAW, no extra OS), or +2d6 OS on critical glitch (common house rule).
- **Implementation location:**
  - `lib/rules/matrix/overwatch-calculator.ts` — OS calculation with house rule comment
- **Toggle exists today:** No

---

## Summary: Toggle Readiness

### Already Fully Toggleable (8 systems)

| #   | System                              | Location                           |
| --- | ----------------------------------- | ---------------------------------- |
| 5   | Creation Method Restrictions        | Campaign settings UI               |
| 18  | Advancement Karma Multipliers       | AdvancementSettingsForm            |
| 19  | Advancement Rating Caps             | AdvancementSettingsForm            |
| 20  | Training Time / Instant Advancement | AdvancementSettingsForm            |
| 21  | GM Approval for Characters          | AdvancementSettingsForm            |
| 22  | GM Approval for Advancements        | Approval API routes                |
| 25  | Sourcebook Filtering                | Campaign settings books UI         |
| 26  | Optional Rules Framework            | optional-rules.ts (infrastructure) |

### Partially Toggleable (8 systems — type/logic exists, no campaign UI)

| #   | System                          | What's Missing                               |
| --- | ------------------------------- | -------------------------------------------- |
| 2   | Hit Threshold / Glitch Rules    | Campaign UI for EditionDiceRules overrides   |
| 3   | Wound Modifiers                 | Campaign UI for boxesPerPenalty/maxPenalty   |
| 4   | Gameplay Level (Custom)         | Custom values beyond 3 presets               |
| 6   | Attribute One-at-Max Rule       | Campaign override for maxAtMax parameter     |
| 7   | Skill Cap at Creation           | Campaign override for creation-phase max     |
| 14  | Essence-Magic Reduction Formula | Campaign UI for magicReductionFormula        |
| 15  | Essence Hole Tracking           | Campaign UI for trackEssenceHoles flag       |
| 34  | House Rules                     | Structured schema for mechanical enforcement |

### Not Yet Toggleable (19 systems — hardcoded, need new config)

| #   | System                                | Priority                     |
| --- | ------------------------------------- | ---------------------------- |
| 1   | Dice Rolling Mode (App vs Physical)   | High                         |
| 8   | Gear Availability / Restricted Access | High                         |
| 9   | Quality Karma Caps (25/25)            | High                         |
| 10  | Karma-to-Nuyen Conversion Cap         | Medium                       |
| 11  | Nuyen/Karma Carryover Limits          | Medium                       |
| 12  | Contact Rating Limits                 | Medium                       |
| 13  | Contact Karma Budget Multiplier       | Low (tied to gameplay level) |
| 16  | Augmentation Grade Availability       | Medium                       |
| 17  | Cyberlimb Attribute Bonus Cap         | Low                          |
| 23  | Drain Minimum/Formula                 | Medium                       |
| 24  | Limit Enforcement (on/off/advisory)   | High                         |
| 27  | Edge Actions (enable/disable)         | Low                          |
| 28  | Lifestyle Tier Restrictions           | Low                          |
| 29  | Sum-to-Ten Budget                     | Medium                       |
| 30  | Point Buy Karma Budget                | Medium                       |
| 31  | Point Buy Metatype Costs              | Low                          |
| 32  | Life Modules Budget and Caps          | Low                          |
| 33  | Run Faster Metatype Granularity       | Low                          |
| 35  | Matrix Overwatch House Rule           | Low                          |

---

## Unimplemented Systems with Toggle Potential

These systems are present in the data or referenced in rules but have no app-level implementation yet. When built, they would be natural toggle candidates.

### 1. Initiative System

- **Data:** Initiative rules defined in `diceRules` module (initiative dice, passes, Blitz edge action)
- **Toggle potential:** Number of initiative dice, whether to use initiative passes or action economy, Blitz availability

### 2. Called Shots

- **Data:** Referenced in seed data house rules (`"Threshold 5 for called shots"`)
- **Toggle potential:** Called shot threshold, available called shot types, damage modifiers

### 3. Recoil and Firing Mode Rules

- **Data:** Weapon modifications module includes recoil compensation. Actions module includes Fire Weapon types
- **Toggle potential:** Recoil calculation mode, burst fire rules, suppressive fire area

### 4. Armor Encumbrance

- **Data:** Armor values in gear data, armor stacking rules referenced in modifications
- **Toggle potential:** Armor stacking limits, encumbrance penalties, armor-as-DR variant rule

### 5. Sprite/Spirit Service Limits

- **Data:** Spirit types per tradition defined in tradition data
- **Toggle potential:** Maximum number of bound spirits, spirit force caps, summoning drain modifiers

### 6. Noise Calculation (Matrix)

- **Data:** Noise modifiers referenced in RCC/Matrix rules
- **Toggle potential:** Base noise values, noise reduction calculations, running silent penalties

### 7. Background Count (Magic)

- **Data:** Not yet in data, but a core SR5 mechanic
- **Toggle potential:** Whether background count applies, aspected vs generic, severity levels

### 8. Toxin/Pathogen Rules

- **Data:** Not yet in data
- **Toggle potential:** Contact vector rules, resistance test modifiers, onset time

### 9. Vehicle Chase Rules

- **Data:** Vehicle stats in data, rigging system partially implemented
- **Toggle potential:** Chase scene abstraction level, crash damage, vehicle modification limits

### 10. Reputation / Street Cred / Notoriety

- **Data:** Notoriety tracking exists (`app/api/characters/[characterId]/reputation/`)
- **Toggle potential:** How street cred is calculated, whether notoriety auto-accumulates, public awareness thresholds
