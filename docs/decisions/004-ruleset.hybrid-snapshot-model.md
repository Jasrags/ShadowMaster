# ADR-004.ruleset: Hybrid Snapshot Model

## Decision

The system MUST adopt a **Hybrid Snapshot Model** to manage data "drift" between characters and their source rulebooks. Character entities will store a point-in-time snapshot of their ruleset data (mechanical values) while maintaining live links to non-mechanical metadata.

Data is divided into three distinct synchronization layers:

1. **Live Layer (Auto-Sync)**: Non-mechanical data (e.g., flavor text, icons, descriptions) that is always fetched from the current latest version of the ruleset.
2. **Snapshot Layer (Buffered)**: Mechanical values that drive calculations (e.g., DV, AP, Skill Rating, Attribute Min/Max). These are stored in the character record and only update during an explicit, user-initiated resynchronization.
3. **Delta Layer (Unique)**: Data specific to that individual character instance (e.g., current ammo, installed modifications, custom notes). These are never overwritten by the system.

## Context

Shadow Master characters are built against a specific version of a ruleset. However, rulesets are not static; sourcebooks add content, and errata can change existing values. If a character automatically updated its mechanical stats whenever the source data changed:

- A player might find their dice pools or damage values shifting unexpectedly mid-session.
- Characters could become "invalid" due to structural changes (e.g., a skill being renamed or merged).
- The "Rules Legal" state of a character would lose its persistence.

A pure snapshot model (freezing everything) was rejected because it prevents users from benefiting from non-breaking updates (like typo fixes or improved descriptions) and makes the system feel stale.

## Consequences

### Positive

- **Session Stability**: Mechanical "math" is protected from external changes, ensuring characters remain consistent during play.
- **Improved UX**: Flavor text and icons stay updated automatically without requiring manual "sync" actions.
- **Managed Migration**: Major structural changes (drifts) can be detected and handled through a dedicated "Sync Lab" interface rather than failing silently.

### Negative

- **Data Redundancy**: Character JSON files will grow larger as they must store snapshots of all mechanical attributes of their items and skills.
- **Resynchronization Complexity**: The logic for detecting "mechanical drift" is more complex than a simple timestamp check.

## Alternatives Considered

- **Pure Snapshotting**: Rejected. Disconnects characters from legitimate, non-mechanical improvements to the ruleset data files.
- **Full Live Linking**: Rejected. Too volatile; character math would change without notice when data files are edited.
- **Single Timestamp Check**: Rejected. Doesn't provide enough granularity to distinguish between a "flavor fix" and a "balance nerf."
