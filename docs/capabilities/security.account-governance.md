# Account Governance Capability

## Purpose

The Account Governance capability guarantees the integrity of identity, preferences, and data portability for individual participants. It ensures a secure state for account-specific metadata, provides a stable framework for user-controlled security transitions, and guarantees the systematic lifecycle integrity of participant data through precise export, import, and deletion protocols.

## Guarantees

- Participant identities MUST be uniquely defined and protected by authoritative authentication and authorization protocols.
- Account-level preferences (e.g., theme, interface behavior, default ruleset selection) MUST be persistent and linked to the participant identity.
- The system MUST provide high-fidelity data portability, allowing participants to export their character and campaign data in a structured, ruleset-compliant JSON format.
- Modifications to sensitive account attributes (e.g., passwords, email addresses) MUST require multi-factor or re-authentication verification.
- Account deletion MUST follow a verifiable protocol that results in the irreversible purging of all participant-attributed data from the system.

## Requirements

### Identity and Profile Integrity

- The system MUST facilitate the management of participant profiles, including verifiable email addresses and unique usernames.
- Account records MUST maintain metadata regarding the participant's role (e.g., Player, GM, Admin) and system-wide activity summaries.
- Changes to profile attributes MUST be validated for uniqueness and format compliance before persistence.

### Security and Access Transitions

- Participants MUST have the authority to trigger secure password transitions, requiring verification of current credentials.
- The system MUST provide feedback on password strength and complexity during security updates.
- Future transitions (e.g., Two-Factor Authentication, Session Termination) MUST be supported via the account governance interfaces.

### Preference and Interface Personalization

- The system MUST persist participant-defined interface preferences, including visual themes (Light/Dark/System) and navigation behaviors.
- Preferences MUST be automatically applied across different system modules (Character Sheet, Campaign View) to ensure a consistent user experience.
- The capability MUST support the future synchronization of preferences across multiple participant devices.

### Data Lifecycle and Portability

- The system MUST generate structured, versioned data exports for all character entities and associated participant records.
- Import protocols MUST validate incoming data against the current ruleset architecture and schema definitions before merging into the active system.
- Account deletion requests MUST be explicitly confirmed and result in the atomic removal of the user record and all orphaned character data.

## Constraints

- Participant data exports MUST NOT include sensitive security tokens or hashed credentials.
- Account-level modifications MUST NOT be possible for dormant or suspended accounts without administrative intervention.
- The system MUST prevent the deletion of the last remaining administrative account.

## Non-Goals

- This capability does not govern the social interactions or communication between different participants (see Shared Knowledge).
- This capability does not manage the specific ruleset data or character creation logic (see Ruleset System and Character Management).
- This capability does not handle the external hosting or storage of character data outside of the system's authoritative database.
