# Governance Approval Capability

## Purpose

The Governance Approval capability ensures the integrity of character advancement through the review and authorization of progression events within a campaign context. It provides a verifiable audit trail of approvals, rejections, and associated justifications, guaranteeing that all progression-related state changes are subjected to campaign authority oversight.

## Guarantees

- Advancement events marked for review MUST be restricted from final execution until an explicit approval action is recorded by a campaign authority.
- Review and authorization authority MUST be strictly restricted to participants possessing valid campaign authority (e.g., Gamemaster) or system administrative roles.
- The rejection of an advancement event MUST include a recorded justification and ensure the integrity of character resources (e.g., Karma, Nuyen refund).
- The system MUST maintain a persistent, immutable history of all approval and rejection transitions, attributed to the authorizing participant and timestamped for audit support.

## Requirements

### Event Review and Authorization

- The system MUST provide an authoritative registry of all pending advancement requests within a campaign scope.
- Advancement requests MUST detail the specific changes (e.g., Attribute 3 → 4), associated costs, and player-provided justifications.
- Approval actions MUST trigger the atomic transition of the character state from "Pending" to "Approved" and propagate all mechanical changes.

### Authority and Permissions

- Authorization checks MUST be performed for every approval or rejection attempt, verifying the participant's role within the specific campaign.
- Participants MUST NOT be permitted to authorize their own advancement requests (Self-Approval Restriction).
- Administrative overrides MUST be available to resolve edge cases or stalled approval workflows.

### Justification and Auditability

- Rejection actions MUST capture a mandatory justification text to provide feedback to the initiating participant.
- Every governance action (Approval/Rejection) MUST be persisted in the character's advancement history with a link to the authorizing campaign authority.
- The system MUST support filtering and searching of advancement histories based on approval status and authoritative participant.

### State Restoration and Continuity

- Rejection of a request MUST automatically restore any character resources (e.g., Karma) that were tentatively allocated for the advancement.
- Unapproved advancements MUST be clearly identified on character records to ensure participants are aware of pending status.
- The system MUST facilitate the refreshing of advancement registries to reflect real-time changes in authorization status.

## Constraints

- An advancement record MUST NOT exist in an "Active" state if it has been explicitly rejected by a campaign authority.
- Modifications to the justification of a rejected event MUST NOT be permitted after the decision has been finalized.
- Advancement requests MUST NOT be deletable by participants once they have entered the review queue.

## Non-Goals

- This capability does not govern the automated validation of advancement costs (see Character Advancement).
- This capability does not manage the narrative interpretation or roleplaying requirements for character progression.
- This capability does not handle the visual layout of the approval notification badges or UI tabs.
