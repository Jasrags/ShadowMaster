# ShadowMaster Rules Reference (SR5 Focus)

_Last updated: 2025-11-11_

This guide summarizes the Shadowrun 5th Edition mechanics that the application currently models or plans to automate. It exists to keep the product, engineering, and rules teams aligned when extending data sets or workflows.

---

## 1. Campaign Configuration
Campaigns are the source of truth for rule settings. The following fields are immutable after creation:

| Field | Purpose | Supported Values | Data Source |
| --- | --- | --- | --- |
| `edition` | Determines ruleset and data catalogs. | `sr5` (today) | `data/editions/{edition}/character_creation.json` |
| `gameplay_level` | Adjusts starting resources, karma, gear limits. | `street`, `experienced`, `prime` | Same as above (`gameplay_levels`). |
| `creation_method` | Determines character builder workflow. | `priority`, `sum_to_ten`, `karma` | Same file (`creation_methods`). |
| `enabled_books[]` | Controls which gear/spells/etc. are legal. | SR5 core + optional source book codes | `data/editions/sr5/books/all.json` |
| `house_rules` | Freeform JSON (currently string) describing toggles/notes. | N/A | Stored on campaign; future automation hooks. |

### Gameplay Levels (SR5)
| Level | Resources Summary | Karma | Gear Restrictions |
| --- | --- | --- | --- |
| Street | Priority A funds drop to ¥75,000 (vs. ¥450,000 base). | Starting karma 13. | Max device rating 4, max availability 10. |
| Experienced | Baseline from core rules (no adjustments). | Starting karma 25. | No additional restrictions. |
| Prime Runner | Priority A funds increase to ¥500,000. | Starting karma 35. | Max device rating 6, max availability 15. |

Implementation detail: rules are merged at runtime via `CampaignService.DescribeGameplayRules` and injected into edition context for the React wizard.

---

## 2. Character Creation Workflows
### Priority (Baseline)
- Assign the letters A–E uniquely across `metatype`, `attributes`, `skills`, `magic`, `resources`.
- Derived tables come from `character_creation.priorities` in the edition JSON.
- Validation is currently handled in the legacy flow; React migration forthcoming.

### Sum-to-Ten
- Budget: 10 points; letters map to costs `{A:4, B:3, C:2, D:1, E:0}` (per edition data).
- Must cover all five categories; each letter usable multiple times while budget allows.
- Validation in `internal/service/sr5_sum_to_ten.go` ensures:
  - Total points == 10.
  - Every category assigned at least one letter.
  - Letters exist in edition tables.
- React UI (`PriorityAssignment`) surfaces remaining points and category selections; warnings if incomplete.

**GM-facing guidance**
- Gameplay levels apply exactly as they do for Priority characters—resource values, starting karma, and gear caps come straight from the campaign defaults.
- Sum-to-Ten characters must spend the full 10-point budget; the service rejects underspend/overspend arrays so your table stays consistent.
- No extra house-rule toggles are exposed yet; campaigns either allow or disallow the method via the creation method setting.

### Karma Point-Buy
- Starting budget: 800 karma (`character_creation.creation_methods.karma.karma_budget`).
- Costs:
  - Metatypes: `metatype_costs` map (e.g., Human 0, Elf 40).
  - Attributes: `getKarmaAttributeCost` (progressive) with restriction: only one physical + one mental attribute may be maxed (service enforces).
  - Skills, gear, qualities: functions in `web/app/src/utils/priorities.ts` mirror service logic.
- Gear conversion: `max_karma_for_gear` and `karma_per_nuyen` govern tradeoff; validated server-side.
- Ledger UI in React tracks spends by category with remaining budget indicator.

### Pending Work
- Advancement/karma costs post-character creation still TBD (see roadmap Section 2). Store decisions here once finalized.
- NPC builder will reuse the same validation (Sum-to-Ten/Karma) when React migration reaches character management.

---

## 3. Character Advancement (SR5 Default Rules)
ShadowMaster uses the SR5 core advancement rules without campaign-specific modifiers. Gameplay levels do not alter post-creation karma costs; they only affect starting resources and caps.

### General Guidelines
- Training is required before karma is spent (except Edge). Attribute training time cannot be reduced; an instructor can reduce skill training time by 25 %.
- A downtime period may cover one physical + one mental attribute, or one attribute + one skill. Skill groups consume the whole downtime.
- Rating increases are capped per downtime: attributes +2, skills +3, skill groups +1.
- Augmentation recovery blocks attribute training for the same rating in that downtime.

### Karma Costs
- **Attributes (Physical, Mental, Magic, Resonance):** `new rating × 5`
- **Active skills:** `new rating × 2`
- **Knowledge/Language skills:** `new rating × 1`
- **Skill groups:** `new rating × 5`
- **Specializations:** 7 karma
- **New knowledge/language skill:** 1 karma
- **New complex form:** 4 karma
- **New spell / ritual / preparation:** 5 karma
- **Initiation:** `10 + (grade × 3)` karma
- **Positive quality (post-play):** listed cost × 2  
  Removing a negative quality: bonus karma × 2 (with GM approval)
- **Focus bonding:** see table below (`Force` is the item’s rating)

| Focus Type | Karma Cost |
| --- | --- |
| Enchanting, Metamagic, Weapon | `Force × 3` |
| Power | `Force × 6` |
| Qi | `Force × 2` |
| Spell, Spirit | `Force × 2` |

*Edge increases follow the same karma cost formula as attributes but require no downtime.*

### Training Times
- **Attributes:** `new rating × 1 week`
- **Active skills:**  
  - Ratings 1–4: `new rating × 1 day`  
  - Ratings 5–8: `new rating × 1 week`  
  - Ratings 9–13: `new rating × 2 weeks`
- **Skill groups:** `new rating × 2 weeks`
- **Specializations:** 1 month
- **Edge:** no downtime required

### Future Enhancements
- Karma↔nuyen conversions tied to gameplay level (Not implemented yet)
- Technomancer Submersion workflow (Not implemented yet)
- Additional house-rule toggles surfaced in campaign settings

All pending items remain on the roadmap; when they graduate from “future feature” to implemented behavior we’ll update this section and the gameplay-level defaults.

---

## 3. Source Books & Availability
- Each normalized dataset (gear, spells, qualities, etc.) includes a `source` code referencing `books/all.json`.
- Campaign creation lets GMs toggle available books; SR5 core (`SR5`) is always enabled.
- Backend book repository returns a fallback core book for editions without catalogs to keep UI stable.
- Future enforcement: filters gear/spell listings and builder options to enabled books; add cross-checks before character save.

---

## 4. Automation Hooks (Planned)
These rules inform upcoming session automation:

| System | Key Mechanics to Model | Status |
| --- | --- | --- |
| Initiative & Combat | Action phases, edge usage, recoil, weapon modes, limits. | Design pending; reference GM persona “Live Session Mode.” |
| Matrix | Marks, overwatch score, deck attributes. | Not yet implemented; needs SR5 matrix data tables. |
| Magic | Drain, sustained spell penalties, spirits. | Partial data available; automation not started. |
| Condition Tracks | Physical/stun damage, overflow, healing. | Will tie into live session dashboard. |

When implementing, ensure automation references campaign gameplay rules (e.g., Street-level availability caps weapon legality).

---

## 5. Data Files & References
| File | Description |
| --- | --- |
| `data/editions/sr5/character_creation.json` | Authoritative source for gameplay levels, priority tables, creation methods. |
| `data/editions/sr5/books/all.json` | Normalized source books with metadata (code, localized matches). |
| `data/editions/sr5/<dataset>/all.json` | Gear, spells, qualities, etc. normalized from Chummer via CLI tools. |
| `internal/service/sr5_sum_to_ten.go` | Sum-to-Ten validation logic. |
| `internal/service/sr5_karma.go` | Karma workflow validation. |
| `web/app/src/utils/priorities.ts` | Shared helper functions for Sum-to-Ten & Karma UI. |
| `web/app/src/components/PriorityAssignment.tsx` | React workflows for priority-based creation.

---

## 6. Glossary
- **Gameplay Level**: Difficulty/intensity presets affecting resources and gear availability.
- **Creation Method**: Rule-set guiding how characters allocate starting resources.
- **Source Book**: Published supplement controlling equipment/spell availability; toggled per campaign.
- **House Rules**: Custom automations/toggles stored as structured JSON; future automation should read from this field.

Document owner: Engineering + Rules group. Update whenever SR5 mechanics change or new editions come online.
