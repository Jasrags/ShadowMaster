# Ruleset Integrity Capability

## Purpose

The Ruleset Integrity capability ensures that all game mechanics, entity attributes, and operational logic are derived from a verifiable, sandboxed, and edition-specific data foundation. It governs the isolation, aggregation, and validation of source material bundles, ensuring that a campaign's mechanical state remains strictly consistent with its designated ruleset version and active content expansions.

## Guarantees

- Every campaign MUST be bound to exactly one core ruleset foundation that remains authoritative for all associated character and encounter resolution.
- Ruleset editions MUST be strictly sandboxed, preventing the leakage of mechanics, attributes, or rules across different game versions.
- All mechanical calculations and validation attempts MUST be exclusively derived from the active ruleset bundles (Core plus enabled Sourcebooks).
- Changes to ruleset data MUST NOT impact existing campaigns or characters bound to different ruleset versions or configuration sets.

## Requirements

### Edition Sanitization and Isolation

- Each ruleset edition MUST independently define its own set of attributes, skills, derived statistics, and action costs.
- The system MUST prevent the selection of content (e.g., qualities, gear) that is not explicitly registered within the character's active ruleset scope.
- Mechanical engines (e.g., dice rollers, damage counters) MUST adjust their resolution logic based on the edition-specific rules loaded for the current context.

### Bundle Governance and Aggregation

- Ruleset content MUST be organized into discrete bundles (Core Rulebooks, Sourcebooks, Adventures) with associated versioning metadata.
- Sourcebook bundles MUST extend the core foundation without overriding the fundamental ruleset identity.
- The system MUST support the toggling of optional sourcebook modules at the campaign level, with immediate propagation to all linked entities for validation.

### Mechanical Foundation and Optionality

- Core rulebooks MUST provide the mandatory baseline for metatypes, character creation priorities, and basic equipment availability.
- The system MUST support "optional rules" defined within bundles that can be activated or deactivated by a campaign authority.
- Data conflicts across multiple active bundles MUST be resolved using a predefined precedence model, ensuring a predictable and verifiable ruleset state.

### Validation Integrity

- Character creation and advancement MUST be continuously validated against the current combination of active ruleset bundles.
- Any attempt to use content or mechanics from a disabled or incompatible bundle MUST be rejected with a clear violation record.
- The system MUST maintain a record of which ruleset version and bundles were active at the time of any character state change or encounter resolution.

## Constraints

- A campaign MUST NOT transition between different game editions (e.g., SR5 to SR6) once initialized.
- Access to ruleset bundles MUST be restricted to those compatible with the campaign's core edition.
- Modification of authoritative ruleset bundles MUST be restricted to system administrators or high-level content managers.

## Non-Goals

- This capability does not govern the visual styling or layout of ruleset data for participants.
- This capability does not manage the licensing or digital rights management of source materials.
- This capability does not provide the narrative or purely descriptive content found in game books (see Shared Knowledge).
