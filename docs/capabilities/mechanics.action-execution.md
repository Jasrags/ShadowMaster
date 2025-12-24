# Action Economy and Execution Capability

## Purpose

The Action Economy and Execution capability ensures the systematic allocation and resolution of character interactions within the game environment. It provides a stable and verifiable framework for action costs, validation, and state modification, ensuring that all participant attempts are compliant with the underlying ruleset and entity attributes.

## Guarantees

- The system MUST enforce a consistent action economy (e.g., Free, Simple, Complex, Interrupt) for every participant turn.
- Every action execution MUST involve a real-time validity check against the character's potential and active status.
- Results from action execution MUST be automatically and accurately propagated to the character's physical, mental, and resource records.
- The system MUST maintain a persistent and auditable history of all action attempts and their outcomes.

## Requirements

### Economy and Allocation

- The system MUST track and restrict the available action pool for a participant within a single action phase.
- Actions MUST have authoritative costs in terms of time (phase allocation) or character resources (e.g., Initiative).
- Interrupt actions MUST be available for execution outside of a participant's primary turn at the cost of predefined initiative penalties.
- Changes to the character's operational state (e.g., Running, Prone) MUST automatically apply persistent situational modifiers to subsequent resolution pools.

### Execution Domains

- Combat execution MUST support multi-mode weapon interactions, ammunition management, and movement-based modifiers.
- Magic execution MUST govern spellcasting, summoning, and astral perception while ensuring that resource-costs (e.g., Drain) are correctly calculated.
- Matrix execution MUST regulate digital interactions, including device manipulation and data access within a governed digital environment.
- Lifecycle execution MUST facilitate the precise application of damage, healing, and resource adjustments (e.g., Karma) to character records.

### Validation and Scoping

- The system MUST pre-calculate action-specific resolution pools based on the entity's core attributes, skills, and active modifications.
- Actions MUST be restricted to those currently compatible with the character's state and environment.
- Participants MUST receive immediate verification of action costs, eligibility, and the resulting state changes.

## Constraints

- Action resolution MUST be exclusively derived from the character's current verifiable state.
- Resource expenditures resulting from actions MUST NOT cause the character state to fall into an invalid or negative threshold.
- Action execution MUST be restricted to authorized participants and campaign authorities.

## Non-Goals

- This capability does not define the visual representation or animation of character actions.
- This capability does not address the narrative or roleplaying interpretation of action outcomes.
- This capability does not cover the social interaction protocol between participants.
