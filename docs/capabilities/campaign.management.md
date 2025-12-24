# Campaign Management Capability

## Purpose

The Campaign Management capability ensures the continuous integrity of shared gameplay environments. it maintains a stable and verifiable state where character development and participant status are governed by a unified ruleset, ensuring that all campaign-attributed data remained persistent and valid relative to the established campaign identity.

## Guarantees

- A campaign MUST enforce a singular, immutable ruleset foundation for all associated entities.
- Character attributes and advancement MUST remain strictly compliant with the active campaign configuration.
- Participant access and authority MUST be governed by defined campaign roles.
- Campaign history and state MUST be persistent and auditable.

## Requirements

### Ruleset Integrity

- A campaign MUST designate exactly one game edition as its core ruleset.
- The system MUST restrict available source material and character creation methods to the enabled subset within the campaign.
- Characters MUST NOT maintain active status within a campaign if their configuration deviates from the campaign-defined ruleset.
- Any modification to the campaign ruleset MUST trigger a validity check for all associated character data.

### Participant Governance

- The system MUST recognize a primary authority with exclusive rights over campaign configuration and membership.
- Participant entry into a campaign MUST be verified through unique, campaign-specific credentials.
- The system MUST maintain a persistent record of participant membership and character associations.
- Campaign visibility MUST be restricted according to owner-defined privacy settings.

### Advancement and Rewards

- System-level rewards MUST be attributable to characters based on campaign activity records.
- Character advancement within a campaign context MUST be subject to owner-defined approval workflows and cost modifiers.
- The system MUST preserve an immutable log of all advancement events and reward distributions.

### Shared Knowledge

- The system MUST provide a central repository for shared campaign information, including events, notes, and locations.
- Access to shared information MUST be sensitive to participant roles and campaign visibility.
- Shared locations and entities MUST be persistent within the campaign scope.

## Constraints

- A character MUST NOT be associated with more than one active campaign ruleset.
- Ruleset modifications MUST NOT result in silent data corruption of existing characters.
- Privacy constraints MUST ensure that non-participants have no access to private campaign data.

## Non-Goals

- This capability does not define real-time interaction mechanics or automated combat resolution.
- This capability does not cover the migration of characters between independent campaign rulesets.
- This capability does not address the visual presentation or social promotion of campaign instances.
