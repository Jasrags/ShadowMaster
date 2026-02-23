# SR5 Core Rulebook — Wireless Bonus Gap Analysis

Gap analysis comparing the [SR5 Wireless Bonuses Catalog](SR5_Wireless_Bonuses_Catalog.md) against the actual `core-rulebook.json` data. Identifies missing `wirelessBonus` text, missing `wirelessEffects` arrays, and items absent from the JSON entirely.

> **Scope:** Core Rulebook items only. Non-CRB sourcebook items (Run & Gun, Chrome Flesh, etc.) are tracked in the catalog but out of scope here.

---

## 1. Current Coverage Summary

| Metric                                          | Count                           |
| ----------------------------------------------- | ------------------------------- |
| Items with `wirelessBonus` text                 | 58                              |
| Items with `wirelessEffects` arrays             | 10                              |
| Items with text but **no** structured effects   | 47 unique (48 entries\*)        |
| CRB items missing `wirelessBonus` text entirely | 5 weapons + 11 grenades/rockets |
| Core-source items missing from CRB JSON         | 5                               |

### Items With Structured `wirelessEffects` (Complete)

These 10 items already have both `wirelessBonus` text and a `wirelessEffects` array:

| ID                                      | Category                |
| --------------------------------------- | ----------------------- |
| `smartgun-internal`                     | Weapon accessory        |
| `smartgun-external`                     | Weapon accessory        |
| `control-rig`                           | Augmentation (headware) |
| `reaction-enhancers`                    | Augmentation (bodyware) |
| `wired-reflexes`                        | Augmentation (bodyware) |
| `cyberlimb-gyromount`                   | Cyberlimb enhancement   |
| `cyberlimb-holster`                     | Cyberlimb enhancement   |
| `cyberlimb-hydraulic-jacks`             | Cyberlimb enhancement   |
| `cyberlimb-large-smuggling-compartment` | Cyberlimb enhancement   |
| `muscle-toner`                          | Augmentation (bioware)  |

---

## 2. Items Missing `wirelessBonus` Text

These items exist in `core-rulebook.json` but have **no `wirelessBonus` field** despite having documented wireless bonuses in the SR5 rules.

### Weapons (5 items)

| ID                    | Subcategory      | Expected `wirelessBonus` Text                                                                                    | Page |
| --------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------- | ---- |
| `defiance-ex-shocker` | light-pistol     | "A successful hit informs you of the target's basic health and Condition Monitors."                              | 425  |
| `yamaha-pulsar`       | taser            | "A successful hit informs you of the target's basic health and Condition Monitors."                              | 425  |
| `shock-gloves`        | melee            | "Recharges by induction, regaining one charge per full hour of wireless-enabled time."                           | 422  |
| `shuriken`            | throwing-weapons | "With smartlink, each knife/shuriken thrown at same target that Combat Turn gets +1 dice pool per knife thrown." | 424  |
| `throwing-knife`      | throwing-weapons | "With smartlink, each knife/shuriken thrown at same target that Combat Turn gets +1 dice pool per knife thrown." | 424  |

### Grenades & Rockets (11 items)

All 11 items in the `grenades` subcategory lack `wirelessBonus`. They should all have the generic wireless trigger text, with `flash-pak` having an additional unique bonus.

| ID                       | Name                   | Expected `wirelessBonus` Text                                                                                                                                              | Page |
| ------------------------ | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| `flash-bang-grenade`     | Flash-Bang Grenade     | "You can use the wireless link trigger, even if you don't have DNI."                                                                                                       | 435  |
| `flash-pak`              | Flash-pak              | "Avoids directing strong flashes at subscribed characters (half glare penalties). Recharges by induction (1 charge/hour). Can also use wireless link trigger without DNI." | 435  |
| `fragmentation-grenade`  | Fragmentation Grenade  | "You can use the wireless link trigger, even if you don't have DNI."                                                                                                       | 435  |
| `gas`                    | Gas                    | "You can use the wireless link trigger, even if you don't have DNI."                                                                                                       | 435  |
| `gas-grenade-cs-tear`    | Gas Grenade (CS/Tear)  | "You can use the wireless link trigger, even if you don't have DNI."                                                                                                       | 435  |
| `high-explosive-grenade` | High Explosive Grenade | "You can use the wireless link trigger, even if you don't have DNI."                                                                                                       | 435  |
| `smoke-grenade`          | Smoke Grenade          | "You can use the wireless link trigger, even if you don't have DNI."                                                                                                       | 435  |
| `thermal-smoke-grenade`  | Thermal Smoke Grenade  | "You can use the wireless link trigger, even if you don't have DNI."                                                                                                       | 435  |
| `anti-vehicle-rocket`    | Anti-vehicle Rocket    | "You can use the wireless link trigger, even if you don't have DNI."                                                                                                       | 436  |
| `fragmentation-rocket`   | Fragmentation Rocket   | "You can use the wireless link trigger, even if you don't have DNI."                                                                                                       | 436  |
| `high-explosive-rocket`  | High-explosive Rocket  | "You can use the wireless link trigger, even if you don't have DNI."                                                                                                       | 436  |

---

## 3. Items Missing `wirelessEffects` Arrays

These 47 unique items have `wirelessBonus` text but **no structured `wirelessEffects` array**. Organized by structurability priority.

> \* `audio-enhancement` appears twice in the JSON (standalone sensor enhancement at line 10470 and cyberware capacity enhancement at line 13410), accounting for the 58 vs 57 discrepancy.

### Tier 1: High Priority — Mechanically Structurable

These have concrete dice pool, limit, or stat bonuses that map directly to `wirelessEffects` entries.

| #   | ID                    | Current `wirelessBonus` Text                                                                                                                         | Proposed Effect Type               |
| --- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 1   | `laser-sight`         | "+1 dice pool bonus (not cumulative with smartlink). Activating/deactivating is a Free Action."                                                      | `attack_pool +1`                   |
| 2   | `datajack`            | "Can switch between devices and maintain multiple connections without physical contact. Rating 1 noise reduction."                                   | `noise_reduction +1`               |
| 3   | `spatial-recognizer`  | "Provides +2 dice pool modifier to Perception Tests when looking for a sound's source."                                                              | `perception +2` (conditional)      |
| 4   | `cybereyes`           | "When wirelessly enabled, gives +1 limit to Perception tests."                                                                                       | `limit: perception +1`             |
| 5   | `cyberears`           | "+1 limit to audio Perception tests."                                                                                                                | `limit: perception +1` (audio)     |
| 6   | `audio-enhancement`   | "Add the audio enhancement's rating as a dice pool modifier to audio Perception Tests."                                                              | `perception +Rating`               |
| 7   | `select-sound-filter` | "+Dice Pool bonus to Audio Perception vs specific sound equal to rating."                                                                            | `perception +Rating` (conditional) |
| 8   | `thermal-damping`     | "+Rating dice pool bonus to Sneaking tests against heat-based detection."                                                                            | `sneaking +Rating` (conditional)   |
| 9   | `skilljack`           | "Increases total skill rating limit to Rating x 3."                                                                                                  | `special` (limit change)           |
| 10  | `skillwires`          | "+1 to relevant inherent Limit (Physical, Mental, or Social) for skills used through skillwires."                                                    | `limit +1` (variable)              |
| 11  | `monofilament-whip`   | "Ready as Free Action. Safety system auto-retracts on glitch. +2 Accuracy."                                                                          | `accuracy +2`                      |
| 12  | `periscope`           | "Dice pool penalty for shooting around corners is -1 instead of -2."                                                                                 | `penalty_reduction +1`             |
| 13  | `medkit`              | "Provides dice pool bonus equal to rating to First Aid + Logic tests, or can operate itself with dice pool of Rating x 2 and limit equal to Rating." | `first_aid +Rating`                |

> **Note:** Items 6-8, 13 are rating-dependent and will need the effect system to support `modifier: "rating"` or similar dynamic values.

### Tier 2: Action Economy — Free Action Upgrades

These upgrade a Simple/Complex Action to a Free Action when wireless is enabled. They are text-only by nature until an action economy system is implemented.

| #   | ID                      | Current `wirelessBonus` Text                                                               |
| --- | ----------------------- | ------------------------------------------------------------------------------------------ |
| 14  | `bipod`                 | "Folding up or deploying is a Free Action."                                                |
| 15  | `chemical-seal`         | "Activating the chemical seal is a Free Action."                                           |
| 16  | `extendable-baton`      | "Readying is a Free Action instead of a Simple Action."                                    |
| 17  | `forearm-snap-blades`   | "Readying is a Free Action instead of a Simple Action."                                    |
| 18  | `gyro-mount`            | "Quick-release to exit harness is a Free Action."                                          |
| 19  | `hidden-arm-slide`      | "Ready weapon as a Free Action."                                                           |
| 20  | `internal-air-tank`     | "Activating or deactivating is a Free Action. Always aware of exact air level and purity." |
| 21  | `shock-frills`          | "Activating or deactivating is a Free Action. Recharges by induction (1 charge per hour)." |
| 22  | `smuggling-compartment` | "Inserting or retrieving an object is a Simple Action."                                    |
| 23  | `telescoping-staff`     | "Extending is a Free Action instead of a Simple Action."                                   |
| 24  | `tripod`                | "Folding up, deploying, or removing is a Free Action."                                     |
| 25  | `fingertip-compartment` | "Inserting or removing an item is a Simple Action."                                        |

### Tier 3: Informational / Telemetry

These provide information, status reporting, or telemetry benefits that are flavor-only with no mechanical modifier.

| #   | ID                         | Current `wirelessBonus` Text                                                                                                                          |
| --- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 26  | `biomonitor`               | "Shares information with designated wireless devices and can auto-alert DocWagon or other ambulance services if life signs reach certain thresholds." |
| 27  | `gas-mask`                 | "Analyzes and gives information about the surrounding air that you're not breathing."                                                                 |
| 28  | `hazmat-suit`              | "Analyzes and transmits information about the environment you're not touching or breathing."                                                          |
| 29  | `imaging-scope`            | "Share line of sight with team."                                                                                                                      |
| 30  | `parashield-dart-pistol`   | "Dart reports whether it struck home and successfully injected. May report gross physical anomalies (Device Rating 1)."                               |
| 31  | `parashield-dart-rifle`    | "Dart reports whether it struck home and successfully injected. May report gross physical anomalies (Device Rating 1)."                               |
| 32  | `survival-knife`           | "Displays ARO of local maps, GPS position, and can make commcalls."                                                                                   |
| 33  | `fichetti-tiffani-needler` | "You can change the color of the Tiffani Needler with a Simple Action."                                                                               |
| 34  | `gecko-tape-gloves`        | "Adhesive outer layer can be temporarily neutralized with a wireless signal, useful for getting on and off without sticking."                         |

### Tier 4: Induction Recharging / Remote Activation

These provide recharging or remote activation capabilities.

| #   | ID                      | Current `wirelessBonus` Text                   |
| --- | ----------------------- | ---------------------------------------------- |
| 35  | `fichetti-pain-inducer` | "Recharges by induction at 1 charge per hour." |
| 36  | `stun-baton`            | "Recharges by induction (1 charge per hour)."  |
| 37  | `thermite-burning-bar`  | "Can be activated wirelessly."                 |

### Tier 5: Weapon Accessories — Concealment / Suppressor

| #   | ID                       | Current `wirelessBonus` Text                                                               |
| --- | ------------------------ | ------------------------------------------------------------------------------------------ |
| 38  | `concealable-holster`    | "Additional -1 to Concealability."                                                         |
| 39  | `silencer-light-fire-70` | "Rating 2 microphone with Select Sound Filter alerts you if someone reacts to shot sound." |
| 40  | `silencer-light-fire-75` | "Rating 2 microphone with Select Sound Filter alerts you if someone reacts to shot sound." |
| 41  | `silencer-suppressor`    | "Rating 2 microphone with Select Sound Filter alerts you if someone reacts to shot sound." |

### Tier 6: Launcher-Specific Wireless

These are grenade launcher / missile launcher wireless trigger bonuses embedded in the weapon itself.

| #   | ID                      | Current `wirelessBonus` Text                                                                      |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------- |
| 42  | `airburst-link`         | "Reduces scatter distance by 2m per net hit instead of 1m. Can detonate grenade/rocket remotely." |
| 43  | `ares-antioch-2`        | "Use wireless link trigger for grenades without DNI."                                             |
| 44  | `armtech-mgl-12`        | "Use wireless link trigger for grenades without DNI."                                             |
| 45  | `aztechnology-striker`  | "Use wireless link trigger for missiles without DNI."                                             |
| 46  | `onotari-interceptor`   | "Use wireless link trigger for missiles without DNI."                                             |
| 47  | `smart-firing-platform` | "Fire mounted weapon remotely like a drone. Use implanted smartlink in VR."                       |

---

## 4. Items Entirely Missing from CRB JSON

These are Core-source items documented in RAW with wireless bonuses that have **no entry at all** in `core-rulebook.json`.

| Item                         | Expected Category  | Expected `wirelessBonus` Text                                                       | Page |
| ---------------------------- | ------------------ | ----------------------------------------------------------------------------------- | ---- |
| `cavalier-safeguard`         | weapons / taser    | "A successful hit informs you of the target's basic health and Condition Monitors." | 425  |
| `tiffani-defiance-protector` | weapons / taser    | "A successful hit informs you of the target's basic health and Condition Monitors." | 425  |
| `mitsubishi-yakusoku-mrl`    | weapons / launcher | "Choose missile to launch via smartgun as Free Action."                             | 432  |
| `jammer-area`                | gear / security    | "Designate devices/personas to not interfere with."                                 | 441  |
| `jammer-directional`         | gear / security    | "Designate devices/personas to not interfere with."                                 | 441  |

---

## 5. Follow-Up Recommendations

### Phase 1: Add Missing `wirelessBonus` Text (Data-Only)

**Scope:** 16 items — straightforward text additions, no code changes.

- Add `wirelessBonus` to the 5 weapons: `defiance-ex-shocker`, `yamaha-pulsar`, `shock-gloves`, `shuriken`, `throwing-knife`
- Add `wirelessBonus` to all 11 grenade/rocket items with the generic wireless trigger text (plus `flash-pak` unique bonus)

### Phase 2: Add `wirelessEffects` to Tier 1 Items (Structured Effects)

**Scope:** 13 items from Tier 1 — requires `wirelessEffects` array population following the patterns established by the existing 10 items.

- Fixed-modifier items (1-5, 11-12): Straightforward, follow `smartgun-internal` pattern
- Rating-dependent items (6-8, 13): May need effect system enhancement to support dynamic `modifier: "rating"` values
- Variable-limit items (9-10): Complex — `skillwires` applies to whichever limit is relevant

### Phase 3: Create Missing CRB Entries

**Scope:** 5 items — requires full catalog entry authoring using `/edition-data-author` skill.

- 2 tasers: `cavalier-safeguard`, `tiffani-defiance-protector`
- 1 launcher: `mitsubishi-yakusoku-mrl`
- 2 security gear: `jammer-area`, `jammer-directional`

### Phase 4: Tier 2-6 Effects (Future)

**Scope:** 35 remaining items — deferred until action economy or other systems make structured effects meaningful.

- Tier 2 (action economy): 12 items — blocked on action economy system
- Tier 3 (informational): 9 items — text-only by nature, low priority
- Tier 4 (recharging): 3 items — text-only by nature
- Tier 5 (concealment/suppressor): 4 items — may become structurable with concealment system
- Tier 6 (launcher wireless): 6 items — partially structurable (`airburst-link` scatter reduction)

---

## Appendix: Wireless Effect Pattern Distribution

From the full catalog (~129 items across all sources):

| Pattern                   | Approximate % | Example                                      |
| ------------------------- | ------------- | -------------------------------------------- |
| Free Action upgrade       | ~40%          | Deploying bipod, readying weapon             |
| Dice pool bonus           | ~20%          | +1/+2 to attack, perception, sneaking        |
| Informational / telemetry | ~15%          | Health monitoring, environment analysis      |
| Induction recharging      | ~8%           | 1 charge per hour                            |
| Limit bonus               | ~5%           | +1 Perception limit, +1 Social limit         |
| Rating substitution       | ~3%           | Operates at Rating x 2                       |
| Special / unique          | ~9%           | Smartlink integration, compatibility unlocks |
