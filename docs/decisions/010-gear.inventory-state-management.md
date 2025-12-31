# ADR-010.gear: Inventory State Management

## Decision

The system MUST implement a **Unified Gear State Model** for all equipment items. Every piece of gear (weapons, armor, augmentations, electronics, general items) will have consistent state properties governing:

1. **Equipment State** - Whether an item is readied, holstered, worn, or stored
2. **Wireless State** - Per-item wireless enabled/disabled with structured bonus effects
3. **Device Condition** - Functional status (working, bricked, permanently bricked)
4. **Ammunition State** - Current loaded ammo and magazine tracking for weapons

All wireless bonuses MUST be defined as structured data in the catalog alongside human-readable descriptions, enabling mechanical calculation without text parsing.

## Context

The current system has partial infrastructure for gear state:

- `ArmorItem.equipped` boolean exists but weapons lack this field
- `Character.wirelessBonusesEnabled` provides global wireless toggle only
- Cyberdecks track condition at the combat session level (`matrixDamageTaken`) but not persistently on the device
- Weapons have `currentAmmo` and `ammoCapacity` fields but no UI or magazine system
- Wireless bonus text (e.g., "Gain +1 to Initiative") exists but is not machine-parseable

Users require:

- Character management with equip/unequip workflows
- Combat usage with fire modes and ammo consumption
- Encumbrance calculation based on carried gear
- Matrix integration where gear can be hacked and bricked
- Per-item wireless control rather than global toggle

Without a unified state model, each gear type would need bespoke handling, creating inconsistency and maintenance burden across the codebase.

## Consequences

### Positive

- **Consistency**: All gear types follow the same state patterns, reducing special-case logic
- **Extensibility**: New gear types inherit state properties without code changes
- **Combat Integration**: Equipment states feed directly into action resolution (readied weapons, wireless bonuses, bricked devices)
- **Data-Driven Wireless**: Structured bonus effects enable accurate pool calculations without fragile text parsing
- **Matrix Readiness**: Device condition tracking prepares for cybercombat and hacking

### Negative

- **Migration Required**: Existing characters must have state fields initialized with sensible defaults
- **Catalog Updates**: All items with wireless bonuses need structured `wirelessEffects` arrays added
- **Complexity Increase**: Every gear interaction must now consider state (equipped? wireless? bricked?)
- **UI Requirements**: Inventory management panel becomes necessary for state manipulation

## Alternatives Considered

### Per-Type State Fields

**Rejected.** Adding `equipped` to Weapon, `wireless` to Augmentation, `condition` to Cyberdeck separately would:
- Require different handling code for each type
- Create inconsistent APIs
- Make it harder to add new gear types

### Text Parsing for Wireless Bonuses

**Rejected.** Parsing bonus descriptions like "Gain +1 to your Initiative Score" would:
- Be fragile (text variations break parsing)
- Require maintenance as new bonuses are added
- Fail silently when patterns don't match
- Add runtime overhead for every calculation

### Global Wireless Toggle Only

**Rejected.** Keeping only `wirelessBonusesEnabled` at character level would:
- Prevent tactical choices (disable specific compromised items)
- Not support "running silent" on select devices
- Miss SR5's granular wireless control design

### Simplified Condition (Working/Bricked)

**Approved with modification.** Three-state condition (working, bricked, permanently bricked) is sufficient for MVP:
- Working: Normal operation
- Bricked: Disabled, can be repaired
- Permanently Bricked: Destroyed, cannot be repaired

Full damage tracking (condition monitors on all devices) deferred to future work.

## Implementation Notes

### Structured Wireless Effects

Catalog items will include both human-readable and machine-readable wireless data:

```json
{
  "id": "wired-reflexes-2",
  "wirelessBonus": "Gain +2 to your Initiative Score.",
  "wirelessEffects": [
    { "type": "initiative", "modifier": 2 }
  ]
}
```

Effect types include: `attribute`, `initiative`, `attack_pool`, `defense_pool`, `armor`, `limit`, `recoil`, `special`

### Magazine System

Weapons with removable magazines include one magazine at purchase. Spare magazines are separate inventory items. Magazine state tracks:
- Ammo type loaded
- Current round count
- Maximum capacity

### Equipment States

Four-state model for gear readiness:
- **readied**: In hand, immediately usable (weapons)
- **holstered**: Accessible, Simple Action to ready (weapons, some gear)
- **worn**: Currently worn (armor, clothing, some augmentations)
- **stored**: In bag/vehicle, not readily accessible

Not all states apply to all gear types (armor uses worn/stored, weapons use all four).

## Related

- **Capability**: `character.inventory-management` (to be created)
- **ADR-005**: Modular Step Wizard (gear selection during creation)
- **Capability**: `mechanics.weapon-customization` (modification system)
- **Capability**: `mechanics.matrix-operations` (device hacking)
