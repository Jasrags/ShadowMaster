# Character Inventory Management Capability

## Purpose

The Character Inventory Management capability governs the operational state of all equipment owned by a character. It ensures consistent tracking of equipment readiness, wireless connectivity, device condition, ammunition state, and carrying capacity, enabling seamless integration with combat actions and Matrix operations.

## Guarantees

- Equipment state MUST be persistent and accurately reflect the current operational status of every owned item.
- Wireless bonus effects MUST be mechanically calculable from structured catalog data without text parsing.
- Device conditions MUST persist across sessions and correctly influence equipment availability and Matrix vulnerability.
- Ammunition and magazine state MUST be tracked with precision sufficient for combat action validation.
- Encumbrance MUST be calculated from carried equipment weight and enforced through pool modifiers.

## Requirements

### Equipment State Governance

- Every equipment item MUST have an authoritative readiness state appropriate to its type:
  - Weapons: `readied` (in hand), `holstered` (accessible), `stored` (not accessible)
  - Armor: `worn` (providing protection), `stored` (not worn)
  - Gear: `worn`, `holstered`, or `stored` as appropriate
  - Augmentations: Always active (implanted)
- The system MUST enforce state transition rules:
  - Readying a holstered weapon requires a Simple Action
  - Holstering a readied weapon requires a Simple Action
  - Accessing stored gear requires appropriate time based on storage location
- Equipment state MUST directly influence action eligibility (only readied weapons may fire).

### Wireless Connectivity

- Every wireless-capable item MUST have an independent wireless enabled/disabled state.
- The global `wirelessBonusesEnabled` toggle MUST override individual item states when disabled.
- Wireless bonuses MUST be defined in catalog data as structured effect arrays alongside human-readable descriptions.
- The system MUST calculate and apply wireless bonuses to relevant pools when items are wireless-enabled.
- Participants MUST be able to toggle wireless state for individual items as a Free Action.

### Device Condition

- Matrix-capable devices (cyberdecks, commlinks, RCCs, drones, vehicles, smartguns) MUST track condition state:
  - `functional`: Operating normally
  - `bricked`: Disabled by Matrix damage, repairable
  - `destroyed`: Permanently disabled, not repairable
- Bricked devices MUST NOT provide any mechanical benefits until repaired.
- Condition state MUST persist across sessions and synchronize with character records.
- The system MUST update device condition based on Matrix damage received (see Matrix Operations).

### Ammunition Management

- Weapons with ammunition MUST track:
  - Currently loaded ammunition type
  - Current round count in active magazine
  - Maximum magazine capacity
- Weapons with removable magazines MUST include one magazine at time of purchase.
- Spare magazines MUST be trackable as separate inventory items with their own ammunition state.
- The system MUST validate ammunition compatibility based on weapon caliber and ammunition type.
- Reloading MUST consume a Complex Action and draw from owned ammunition inventory.
- Ammunition consumption MUST be enforced based on firing mode (SS: 1, SA: 1, BF: 3, FA: 6+).

### Encumbrance

- Every physical item MUST have a weight value defined in catalog data.
- The system MUST calculate total carried weight from all non-stored equipment.
- Carrying capacity MUST be derived from character Strength (Strength × 10 kg base).
- Exceeding carrying capacity MUST apply pool penalties to physical actions.
- The system MUST display current encumbrance state to participants.

### Inventory Visualization

- The system MUST provide a unified inventory management interface.
- Equipment MUST be organized by category with clear state indicators.
- Quick actions (equip, toggle wireless, reload) MUST be accessible from the inventory view.
- Ammunition and magazine state MUST be visible on weapon entries.
- Encumbrance MUST be displayed as current/maximum with visual indicator.

## Constraints

- Equipment state changes MUST NOT bypass action economy requirements during active combat.
- Wireless bonuses MUST NOT be applied when the item's wireless state is disabled.
- Bricked devices MUST NOT be usable until explicitly repaired through appropriate actions.
- Ammunition MUST NOT be consumed beyond available inventory.
- Weight values MUST be sourced exclusively from authoritative catalog data.

## Non-Goals

- This capability does not govern the acquisition of new equipment (see Character Creation, Character Advancement).
- This capability does not define weapon modification or accessory installation (see Weapon Customization).
- This capability does not manage the repair process for bricked devices (see Matrix Operations, future repair mechanics).
- This capability does not handle vehicle or drone equipment separately (future Vehicle Management capability).
- This capability does not address equipment trading between characters (future Social/Campaign capability).
