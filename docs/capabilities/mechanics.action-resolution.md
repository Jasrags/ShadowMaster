# Action Resolution Capability

## Purpose

The Action Resolution capability governs the probabilistic determination of character actions. It ensures the consistent application of ruleset probability models to character state and situational modifiers, providing verifiable and auditable outcomes for all participant-initiated tests.

## Guarantees

- Every action resolution MUST adhere to the authoritative probability model defined by the game edition ruleset.
- Successful outcomes (Hits) and complications (Glitches) MUST be calculated with absolute precision.
- The system MUST maintain a persistent, auditable record of all action attempts and their resulting states.
- Resource-backed interventions (e.g., Edge rerolls) MUST be restricted by character state and MUST preserve established successes.

## Requirements

### Probability Modeling

- The system MUST support configurable action pools, incorporating base character attributes, skill ratings, and situational modifiers.
- Hit identification MUST be based on ruleset-defined value thresholds (e.g., d6 values of 5 and 6).
- Complication identification, including Glitches and Critical Glitches, MUST be calculated according to the distribution of minimum values (e.g., 1s) relative to the total pool size.
- Individual results within an action pool MUST be sorted and visualized for immediate participant verifiability.

### Intervention and Lifecycle

- The system MUST provide mechanisms for authoritative interventions, such as rerolling failures, according to character resource availability.
- Interventions MUST re-evaluate the complication status of the entire pool while maintaining the integrity of original successes.
- Resolution pools MUST automatically incorporate persistent character modifiers, such as wound penalties, where applicable.

### Auditability and History

- Every action resolution MUST result in a persistent history record containing the pool configuration, individual results, and outcome statistics.
- Participants MUST have access to a historical log of resolutions to ensure transparency and accountability in gameplay.
- Action records MUST maintain an immutable link to the character entity and the initiating participant.

## Constraints

- Action resolution MUST NOT proceed without an authorized participant request and a valid pool configuration.
- Individual results MUST be generated using an unbiased random distribution mechanism.
- Resource-backed interventions MUST NOT be available if the character's resource balance is insufficient.

## Non-Goals

- This capability does not define the narrative interpretation or roleplaying consequences of an action.
- This capability does not cover the physical modeling or 3D animation of dice.
- This capability does not address the management of complex turn-based combat sequences or initiative ordering.
