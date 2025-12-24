# Character Sheet Capability

## Purpose

The Character Sheet capability provides an authoritative and integrated presentation of character state. It ensures that participants have a unified and accurate view of character attributes, resources, and status, enabling seamless interaction with gameplay mechanics across diverse devices.

## Guarantees

- The character sheet MUST present an accurate and comprehensive reflection of the character's current state.
- Derived statistics and condition monitors MUST be updated automatically to mirror changes in core character data.
- Character information MUST remain accessible and optimized for mobile, tablet, and desktop environments.
- Participant-defined visual preferences MUST be persistent and consistently applied to the presentation.

## Requirements

### State Visualization

- The system MUST represent core attributes, skills, and specializations using clear, rating-based indicators.
- Derived stats, including limits and initiative, MUST be calculated according to active ruleset formulas.
- Condition monitors MUST visually track physical and stun damage, including the automatic identification of associated penalties.
- Current resource levels (e.g., Karma, Nuyen, Essence) MUST be prominently displayed and verifiable.

### Interactive Integration

- The system MUST provide integrated tools for rapid gameplay actions, such as dice rolling, using the active character state.
- Common dice pools MUST be pre-calculated and available for immediate use by participants.
- Visual themes MUST be selectable and persistent for the authorized participant.
- The character sheet MUST provide a direct transition to refinement states for characters in a non-finalized lifecycle status.

### Presentation Structure

- Character information MUST be organized into logical, domain-specific domains (e.g., Attributes, Skills, Combat Gear, Biometrics).
- The layout MUST adapt dynamically to optimize for readability and scannability based on screen dimensions.
- Header records MUST identify the character's metatype, game edition, magical path, and current lifecycle status.

## Constraints

- The character sheet MUST NOT facilitate direct modification of finalized character state outside of authorized advancement workflows.
- Derived values MUST be dependent solely on the underlying character state and MUST NOT be manually overridden.
- Access to the character sheet MUST be governed by character ownership and participant authorization.

## Non-Goals

- This capability does not define the logic for character initialization or advancement.
- This capability does not cover the real-time synchronization protocol for multi-participant sessions.
- This capability does not address the management of ephemeral or non-persistent session-level modifiers.
