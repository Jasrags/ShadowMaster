# Quality Governance Capability

## Purpose

The Quality Governance capability manages the definition, selection, and mechanical application of character traits that provide unique benefits or drawbacks. It ensures that all qualities are validated against ruleset-defined prerequisites, maintains accurate Karma accounting throughout the character lifecycle, and governs the progression of dynamic quality states.

## Guarantees

- Qualities MUST be authoritatively defined within the active ruleset, including verifiable Karma costs, bonuses, and prerequisites.
- Every quality selection MUST undergo real-time validation for metatype requirements, attribute thresholds, and mutual incompatibilities.
- The system MUST enforce strict Karma limits during the character creation phase while facilitating calibrated costs for post-creation acquisition and removal.
- Dynamic quality states (e.g., Addiction, Allergy, Dependents) MUST be persistent and updateable based on verifiable gameplay triggers or campaign authority intervention.
- Quality-derived effects MUST be automatically exposed for integration into action resolution, attribute calculations, and situational modifiers.

## Requirements

### Trait Validation and Selection

- The system MUST validate quality eligibility based on metatype, magical path, attribute ratings, and existing skills.
- Mutually exclusive qualities MUST be identified and restricted to prevent invalid character configurations.
- Qualities requiring player specification (e.g., Aptitude for a specific skill) MUST capture and persist these details as part of the character record.

### Karma and Economic Governance

- The system MUST enforce the maximum Karma expenditure and gain limits defined by the active edition during character creation.
- Post-creation acquisition of positive qualities MUST be governed by calibrated costs (e.g., 2× original Karma).
- Removal of negative qualities MUST involve a verifiable Karma expenditure ("buying off") according to ruleset-defined formulas.
- Every quality-related Karma transaction MUST be recorded in the character's advancement history.

### Dynamic State Management

- Qualities with temporal or situational states (e.g., Addiction withdrawal levels, Allergy exposure) MUST maintain a persistent and updateable state model.
- The system MUST provide interfaces for updating dynamic states based on elapsed time or specific gameplay events (e.g., dose consumption, allergen exposure).
- Changes to dynamic quality states MUST automatically propagate relevant modifiers to character performance pools.

### Effect Resolution and Integration

- Quality effects MUST be defined in a declarative format that specifies triggers (e.g., defense tests, social interactions) and targets (e.g., dice pools, limits).
- Effects MUST support variable resolution based on quality rating or provided specifications.
- Active quality effects MUST be consolidated and made available to the action resolution system for automatic pool adjustment.

## Constraints

- Qualities MUST NOT be modified or added post-creation without sufficient Karma or campaign authority approval.
- Dynamic state transitions MUST NOT cause the character record to enter an unrecoverable or invalid structural state.
- Quality effects MUST NOT be applied if the quality is marked as inactive in the character record.

## Non-Goals

- This capability does not define the narrative justification or roleplaying manifestations of qualities.
- This capability does not manage the specific flavor text or descriptive summaries for individual qualities (see Ruleset System).
- This capability does not cover the visual appearance of quality indicators on the character sheet UI.
