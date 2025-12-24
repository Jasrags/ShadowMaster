# Weapon Customization Capability

## Purpose

The Weapon Customization capability manages the modification and augmentation of tactical equipment within the game environment. It ensures that weapon modifications follow strict mount point constraints, correctly handles integrated "built-in" features, and maintains the mechanical integrity of gear attributes based on ruleset-defined compatibility and occupancy limits.

## Guarantees

- Weapon modifications MUST be validated against the authoritative mount point registry for the weapon's subcategory (e.g., Light Pistol, Assault Rifle).
- Built-in modifications MUST be automatically applied to specific weapon entities upon selection, marked as immutable, and excluded from Karma or Nuyen cost calculations.
- The system MUST enforce exclusive occupancy for mount points, preventing multiple accessories from sharing the same physical or digital slot.
- Accessory selection MUST be filtered by weapon size, category compatibility, and explicit ruleset allow/block lists to ensure valid tactical configurations.

## Requirements

### Mount Point Governance

- Every weapon subcategory MUST define a set of available mount points (e.g., Top, Under, Side, Barrel, Stock, Internal).
- The system MUST prevent the installation of modifications into mount points not supported by the weapon's physical structure.
- Modifications that occupy multiple mount points MUST be correctly tracked to prevent subsequent slot conflicts.

### Built-in Integration

- The system MUST support "built-in" modifications that are integral to the weapon's base design (e.g., integrated laser sights).
- Integrated modifications MUST be persistent and non-removable, ensuring the character record accurately reflects the weapon's factory internal state.
- Mount points occupied by built-in features MUST be correctly reserved and unavailable for additional external accessories.

### Accessory Compatibility

- Modification eligibility MUST be checked against the weapon's size rating and specific subcategory compatibility rules.
- The system MUST enforce ruleset-defined incompatibilities between specific weapons and modifications.
- Participants MUST receive clear feedback on modification restrictions based on occupied slots or failed compatibility checks.

### Modification Immutability

- Modifications flagged as "built-in" MUST NOT be removable through participant or campaign authority actions.
- Any manual modification MUST be reversible, resulting in the immediate restoration of the occupied mount point.
- The system MUST maintain a verifiable record of all installed modifications and their derived mechanical impacts on weapon performance.

## Constraints

- Modifications MUST NOT be applied to weapons that do not support customization (e.g., Hold-outs).
- Resource costs for manual modifications MUST be accurately deducted from the participant's character records.
- Modification state MUST be persistent and survive character synchronization events (see System Synchronization).

## Non-Goals

- This capability does not govern the visual representation or 3D modeling of weapon modifications.
- This capability does not manage the rules for custom-built or homebrew weapons (see Ruleset Integrity).
- This capability does not handle the ammunition or consumable tracking for modified weapons.
