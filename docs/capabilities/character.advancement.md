# Character Advancement Capability

## Purpose

The Character Advancement capability ensures the persistent and verifiable growth of character entities. It maintains a stable progression state where character development is governed by ruleset-defined costs, campaign-specific limitations, and authoritative oversight, ensuring that all improvement records are immutable and valid relative to the character's history.

## Guarantees

- Character progression MUST be constrained by available resources (e.g., Karma) and ruleset-defined prerequisites.
- Advancement history MUST be persistent, immutable, and fully auditable.
- Significant character modifications MUST be subject to explicitly defined approval workflows within a campaign context.
- Character state MUST remain valid after all applied advancements according to the active ruleset.

## Requirements

### Progression Integrity

- Every character improvement MUST be validated against the active ruleset's cost formulas and prerequisites.
- Resource expenditure MUST be deducted from the character's available balance at the time of advancement confirmation.
- The system MUST prevent advancements that would exceed maximum attribute or skill ratings as defined by the character's metatype and active ruleset.
- Progression MUST be unidirectional; character state modifications are permanent unless reversed through an explicit, auditable administrative process.

### Governance and Oversight

- The system MUST distinguish between improvements that are automatically applied and those requiring authoritative (GM) approval.
- Campaign-defined cost modifiers and house rules MUST take precedence over standard ruleset costs.
- Certain advancement paths MUST remain restricted based on the character's original identity or campaign-level constraints.
- Optional training requirements MUST be enforced according to the campaign configuration.

### Auditability and Rewards

- Every update to a character's state MUST result in a persistent, immutable history record.
- Reward distributions MUST be attributable to specific events or sessions within a campaign.
- The system MUST maintain a transaction ledger for all progression resources, recording the origin and destination of every point.
- Advancement records MUST include the resulting state change, the resource cost, and the actor responsible for the modification.

### Validation and Limits

- Prerequisites for new abilities (e.g., spells, metamagics) MUST be met before the advancement is committed to the character state.
- Secondary characteristics dependent on improved attributes MUST be updated to reflect the new character state.
- Incompatibilities between new and existing character traits MUST be identified and prevented during the advancement process.

## Constraints

- A character MUST NOT undergo advancement while in an incomplete or invalid state.
- Advancement records MUST NOT store temporary session data or ephemeral UI states.
- Resource expenditures MUST NOT result in a negative balance for the character.

## Non-Goals

- This capability does not define the user interface for selecting advancements.
- This capability does not cover real-time gameplay effects or temporary attribute bonuses.
- This capability does not address the narrative or roleplaying justification for character growth.
