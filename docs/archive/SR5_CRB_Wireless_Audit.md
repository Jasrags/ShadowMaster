# SR5 Core Rulebook — Wireless Bonus Gap Analysis

Gap analysis comparing the [SR5 Wireless Bonuses Catalog](SR5_Wireless_Bonuses_Catalog.md) against the actual `core-rulebook.json` data. Identifies missing `wirelessBonus` text, missing `wirelessEffects` arrays, and items absent from the JSON entirely.

> **Scope:** Core Rulebook items only. Non-CRB sourcebook items (Run & Gun, Chrome Flesh, etc.) are tracked in the catalog but out of scope here.

---

## 1. Current Coverage Summary

| Metric                                        | Count |
| --------------------------------------------- | ----- |
| Items with `wirelessBonus` text               | 77    |
| Items with `wirelessEffects` arrays           | 61    |
| Items with text but **no** structured effects | 16    |

The 16 remaining items without `wirelessEffects` are grenades/rockets (11) and weapons (5) that received `wirelessBonus` text in Phase 1 but whose effects (wireless trigger, cumulative smart-throwing bonuses) are deferred until the relevant subsystems exist.

### Items With Structured `wirelessEffects`

All 61 items have both `wirelessBonus` text and a `wirelessEffects` array:

- **10 original items**: `smartgun-internal`, `smartgun-external`, `control-rig`, `reaction-enhancers`, `wired-reflexes`, `cyberlimb-gyromount`, `cyberlimb-holster`, `cyberlimb-hydraulic-jacks`, `cyberlimb-large-smuggling-compartment`, `muscle-toner`
- **15 augmentation/gear items** (Phase 2 prep): `datajack`, `cybereyes`, `cyberears`, `audio-enhancement` (×2), `select-sound-filter`, `skilljack`, `skillwires`, `spatial-recognizer`, `thermal-damping`, `medkit`, `laser-sight`, `monofilament-whip`, `periscope`
- **36 Tier 2–6 items** (Phase 4): See section 3 below

---

## 2. Items Missing `wirelessBonus` Text — RESOLVED (Phase 1)

Phase 1 (commit `de07918`) added `wirelessBonus` text to all 16 items:

- **5 weapons**: `defiance-ex-shocker`, `yamaha-pulsar`, `shock-gloves`, `shuriken`, `throwing-knife`
- **11 grenades/rockets**: `flash-bang-grenade`, `flash-pak`, `fragmentation-grenade`, `gas`, `gas-grenade-cs-tear`, `high-explosive-grenade`, `smoke-grenade`, `thermal-smoke-grenade`, `anti-vehicle-rocket`, `fragmentation-rocket`, `high-explosive-rocket`

---

## 3. Items Missing `wirelessEffects` Arrays — RESOLVED (Phases 2 + 4)

All 47 unique items that had `wirelessBonus` text without structured effects have been resolved.

### Tier 1: Structured Effects (Phase 2, commit `589f4d6`)

13 items with concrete dice pool, limit, or stat bonuses:

`laser-sight`, `datajack`, `spatial-recognizer`, `cybereyes`, `cyberears`, `audio-enhancement`, `select-sound-filter`, `thermal-damping`, `skilljack`, `skillwires`, `monofilament-whip`, `periscope`, `medkit`

### Tier 2: Action Economy (Phase 4)

14 items — Free Action upgrades and remote configuration:

`bipod`, `chemical-seal`, `extendable-baton`, `forearm-snap-blades`, `gyro-mount`, `hidden-arm-slide`, `internal-air-tank`, `shock-frills`, `smuggling-compartment`, `telescoping-staff`, `tripod`, `fingertip-compartment`, `area-jammer`, `directional-jammer`

### Tier 3: Informational / Telemetry (Phase 4)

9 items — status reporting and telemetry:

`biomonitor`, `gas-mask`, `hazmat-suit`, `imaging-scope`, `parashield-dart-pistol`, `parashield-dart-rifle`, `survival-knife`, `fichetti-tiffani-needler`, `gecko-tape-gloves`

### Tier 4: Induction Recharging / Remote Activation (Phase 4)

3 items:

`fichetti-pain-inducer`, `stun-baton`, `thermite-burning-bar`

### Tier 5: Concealment / Suppressor (Phase 4)

4 items:

`concealable-holster`, `silencer-suppressor`, `silencer-light-fire-70`, `silencer-light-fire-75`

### Tier 6: Launcher-Specific Wireless (Phase 4)

6 items:

`airburst-link`, `ares-antioch-2`, `armtech-mgl-12`, `aztechnology-striker`, `onotari-interceptor`, `smart-firing-platform`

All Tier 2–6 items use `{ "type": "special", "modifier": 0, "description": "..." }` since their effects are action-economy, informational, or otherwise non-mechanical.

---

## 4. Items Entirely Missing from CRB JSON

### Resolved

The two jammers (`jammer-area`, `jammer-directional`) from the original catalog exist in `core-rulebook.json` as `area-jammer` and `directional-jammer`. `wirelessBonus` and `wirelessEffects` added in Phase 4.

### Intentionally Excluded

These 3 items are not in `core-rulebook.json` and are excluded from this audit scope:

| Item                         | Reason                                               |
| ---------------------------- | ---------------------------------------------------- |
| `cavalier-safeguard`         | Taser variant — out of scope for initial CRB pass    |
| `tiffani-defiance-protector` | Taser variant — out of scope for initial CRB pass    |
| `mitsubishi-yakusoku-mrl`    | Launcher variant — out of scope for initial CRB pass |

---

## 5. Phase Completion Status

| Phase   | Description                              | Status   |
| ------- | ---------------------------------------- | -------- |
| Phase 1 | Add missing `wirelessBonus` text (16)    | Complete |
| Phase 2 | Structured `wirelessEffects` Tier 1 (13) | Complete |
| Phase 3 | Resolve missing CRB entries (jammers)    | Complete |
| Phase 4 | Tier 2–6 `wirelessEffects` (36)          | Complete |

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
