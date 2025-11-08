# Shadowrun Fifth Edition Gear Spec

## Purpose

Document how ShadowMaster should represent, categorize, and manage Shadowrun 5e gear, including acquisition, availability, legality, and mechanical effects.

## Scope

- Weapons (firearms, melee, heavy, exotic)
- Armor and protective gear
- Cyberware, bioware, nanotech
- Vehicles, drones, and RCCs
- Electronics (commlinks, decks, sensors)
- Miscellaneous gear (kits, tools, lifestyle upgrades)
- Ammunition, explosives, toxins
- Availability, legality, and cost tracking
- Modification systems (weapon mods, vehicle customizations)

## Gear Data Model

### GearItem
- `id`: unique identifier
- `name`: display name
- `category`: e.g., `weapon`, `armor`, `cyberware`, `vehicle`, `consumable`
- `subtype`: further specialization (e.g., `pistol`, `smartgun system`, `cyberarm`)
- `cost`: base nuyen cost
- `availability`: rating plus legality tag (e.g., `R`, `F`)
- `rating`: optional numeric rating (for augmentations/devices)
- `description`: short summary of usage/effects
- `rules`: structured modifiers (e.g., DV/AP for weapons, armor rating, essence cost)
- `modSlots`: list of compatible modifications (weapon, vehicle, cyber)
- `source`: rulebook reference

### Modification
- `name`, `applicableCategories`, `slotsRequired`, `effects`
- Include weapon accessories (smartgun, gas-vent), vehicle mods (armor, sensor packages), armor upgrades (chemical seal), cyberware enhancements.

### LifestyleAddon
- `name`, `costModifier`, `effect` (e.g., increase security rating, add workspace).

## Acquisition Mechanics

- **Availability Checks**: Opposed test (`Negotiation + Charisma`) vs availability threshold; time increments per SR5 (typically `Availability × duration unit`).
- **Legality**: tag gear as Legal, Restricted, or Forbidden. Track fake licenses (rating vs scans).
- **Black Market**: apply modifiers to availability/cost when sourcing illegally.
- Maintain gear vendor system tied to contacts, lifestyle, and reputation.

## Weapons Overview

- Store weapon stats: Damage Value, Damage Type (Physical/Stun, elemental), Armor Piercing, Mode (SS/SA/BF/FA), recoil compensation (RC), accuracy, range bands.
- Include built-in accessories and notes (integral smartlink, folding stock).
- Support weapon customization: attachments (smartgun, scopes, bayonets), ammo type effects.
- Burst/full-auto rules integrate with combat spec.

## Armor & Protection

- Track ballistic/impact ratings, capacity for accessories, encumbrance thresholds (`Ballistic + Impact <= STR × 2`).
- Armor mods: chemical protection, nonconductivity, gel packs, thermal damping.
- Sample armor pieces (jacket, vest, mil-spec suits) with availability and cost.

## Augmentations

- Cyberware fields: Essence cost, grade (standard, alpha, beta, delta), implant skill/attribute effects.
- Bioware: Essence+permanent attribute adjustments, compatibility rules, capacity.
- Nanotech/genetech placeholders for future data.
- Include rules for ware stress, removal/upgrade, synergy with qualities/powers.

## Vehicles & Drones

- Data fields: Handling, Speed, Acceleration, Body, Armor, Pilot, Sensor, Seats.
- Weapon mounts and hardpoints, mod capacity, rigger adaptation.
- Drones: include form factor, standard autosofts, power supply.
- Vehicle mod catalog (armor, morphing plates, spoof chips, amphibious). Reference matrix/rigging spec.

## Electronics & Matrix Gear

- Commlinks: Device Rating, attributes (Firewall, Data Processing, etc.), slots for programs/apps.
- Cyberdecks: Attack, Sleaze, Data Processing, Firewall, program load.
- RCCs: Device Pilot, Sharing autosofts, Noise reduction.
- Sensors, spoof chips, tag erasers, scanners with ratings and availability.

## Consumables & Miscellaneous

- Ammunition types (APDS, EX-EX, Stick-n-Shock), each with DV/AP changes and costs.
- Explosives/demolitions: rating, blast radius, activation methods.
- Chemical agents/toxins: vector, speed, Power, effect.
- Kits, medkits, trauma patches, magical supplies (reagents), pharmaceuticals (PsiBoost, Jazz).

## Gear Integration Rules

- Encumbrance and carry limits (link to attributes spec).
- Repair and maintenance costs/time.
- Device degradation, signal range, and noise interactions.
- Ownership tracking (legitimate vs spoofed, SIN/license linkage).
- Gear degradation from damage (weapon jams, armor degradation).

## Implementation Notes

- Store gear data in structured tables for filtering/search.
- Provide tag-based queries (category, legality, availability range).
- Support loadout presets per archetype and quick-purchase flows.
- Align with advancement system (Karma-to-nuyen conversion, gear upgrades).

## Open Questions & Data Gaps

- Comprehensive gear tables (SR5 core + supplements) pending ingestion.
- Need standardized modifier schema (dice bonuses, limit changes, DV/AP overrides).
- Vehicle/drone accessory catalog requires coordination with matrix/rigging spec.
- Consumable rules (toxins, drugs) need data-driven effects and addiction tracking.
- Magical gear (foci, reagents) partially covered in magic spec—ensure cross-reference.

*Last updated: 2025-11-08*
