# Participant Governance Capability

## Purpose

The Participant Governance capability provides administrative control over all participant identities and access permissions within the system. It ensures that role-based access control (RBAC) is strictly enforced, maintains the security of account state transitions, and manages the lifecycle of participant records to protect system-wide operational integrity.

## Guarantees

- Administrative authority MUST be strictly restricted to participants with the "administrator" role.
- Every participant record MUST be governed by at least one active system role (e.g., User, Gamemaster, Administrator).
- The system MUST prevent the deletion or demotion of the final remaining administrative identity to ensure continuous system stewardship.
- Participant metadata transitions (e.g., role changes, attribute updates) MUST be atomic and verified against uniqueness constraints.
- Access to participant management interfaces MUST be subject to real-time administrative authorization checks.

## Requirements

### Administrative Control and Visibility

- The system MUST provide administrators with a sortable and searchable registry of all system participants.
- Participant records MUST expose verifiable metadata, including identity (email/username), role assignments, and account creation timestamps.
- Administrators MUST have the authority to initiate profile updates to correct errors or reflect changes in participant status.

### Role-Based Access Control (RBAC)

- Access permissions MUST be derived from the set of roles assigned to a participant identity.
- The system MUST support multi-role assignments, allowing participants to possess overlapping sets of privileges (e.g., both Administrator and Gamemaster).
- Modifications to participant roles MUST be immediately propagated to all session and authorization checks.

### Account Stewardship and Safety

- Deletion of participant accounts MUST be an explicit, administrative action requiring confirmation.
- The system MUST enforce safety locks that block the removal of the final administrator to prevent system abandonment.
- Participant records MUST validate that no identity is left in a "role-less" state, ensuring continuous governance.

### Systematic Oversight

- The system MUST facilitate the monitoring of participant activity through last-login timestamps and associated entity counts (e.g., characters owned).
- Administrative actions regarding participant management SHOULD be recorded to maintain a verifiable audit trail of system governance.
- Large participant registries MUST be accessible through structured navigation, including pagination and precise filtering.

## Constraints

- Non-administrative participants MUST NOT have visibility into the records or roles of other participants.
- Sensitive participant data, such as hashed credentials, MUST NOT be exposed through any administrative interface.
- Modifications to core participant identity (e.g., email) MUST be restricted to account owners or system administrators.

## Non-Goals

- This capability does not manage individual participant preferences or interface settings (see Account Governance).
- This capability does not govern the social conduct or narrative activities of participants within a campaign.
- This capability does not handle the resolution of authentication challenges or credential verification (see Authentication).
