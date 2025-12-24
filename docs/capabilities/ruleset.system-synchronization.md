# System Synchronization Capability

## Purpose

The System Synchronization capability manages the integrity and evolution of character data relative to its authoritative ruleset source. It provides a structured protocol for detecting "drift" between character snapshots and rulebook updates, ensuring mechanical stability during gameplay while allowing for the controlled and verifiable propagation of descriptive, mechanical, and structural changes.

## Guarantees

- Character mechanical state MUST be protected by a mandatory snapshotting layer that prevents un-triggered updates to dice pools, attributes, or limits during active gameplay.
- The system MUST explicitly distinguish between descriptive "Live" data (auto-syncing), snapshotted "Mechanical" data (buffered), and character-specific "Delta" data (immutable).
- Structural changes to the underlying ruleset (e.g., skill merges, new attributes) MUST be automatically detected and categorized by severity (Non-Breaking vs. Breaking).
- Character "Legality" MUST be continuously monitored, with records entering a "Draft" or "Invalid" state upon detection of breaking structural drift until reconciliation is performed.

## Requirements

### Layered Data Modeling

- The system MUST implement a hybrid snapshot model that overlays live rulebook flavor text with snapshotted mechanical values to ensure consistency.
- Character-specific deltas (e.g., custom notes, temporary modifications) MUST be isolated from ruleset-driven updates to prevent data loss.
- Every character record MUST persist its "Locked Version" identifier, referencing the specific ruleset release used for its current mechanical snapshot.

### Drift Detection and Severity

- The system MUST perform real-time comparison between active character snapshots and the latest available ruleset version.
- Non-breaking changes (Type A) MUST be identified as additive updates that do not invalidate existing character configurations.
- Breaking structural changes (Type B) MUST be identified as destructive or transformative updates that require explicit participant reconciliation.

### Reconciliation and Migration

- The "Sync Lab" MUST provide a secure environment for participants to review detected drift and approve the reconciliation of mechanical snapshots.
- Breaking changes MUST trigger a mandatory "Migration Wizard" that facilitates the manual transformation of legacy data into the new ruleset structure.
- Synchronization actions MUST be atomic, ensuring that character records are either fully updated to the target version or remained in their previous stable state.

### Legality and Compliance

- A character record MUST be flagged as "Rules Legal" only if it satisfies all structural requirements of its designated ruleset version.
- The system MUST provide visual indicators (e.g., Stability Shield statuses) to communicate the drift state to the participant.
- Invalid characters (those with un-reconciled breaking drift) MUST be restricted from participating in active encounter resolution.

## Constraints

- Automatic synchronization MUST NOT modify any snapshotted mechanical values without an explicit trigger from a participant or campaign authority.
- Migration protocols MUST NOT result in the loss of character-unique "Delta" data.
- Reconciliation MUST be performed on a per-character basis to allow participants to manage their own stability schedules.

## Non-Goals

- This capability does not govern the creation or modification of the ruleset data itself (see Ruleset Integrity).
- This capability does not provide automated "re-optimization" or character rebuild suggestions after ruleset changes.
- This capability does not handle the synchronization of social or narrative data across different campaign participants.
