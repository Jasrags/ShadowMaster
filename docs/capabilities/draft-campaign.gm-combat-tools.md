# GM Combat Tools Capability

> [!NOTE] > **Draft Status:** This capability is in draft. Implementation pending completion of `campaign.live-sessions` and `mechanics.action-execution`.

## Purpose

The GM Combat Tools capability ensures the game master has authoritative control over combat encounters within live sessions. It provides a comprehensive set of tools for managing NPCs, controlling initiative order, applying environmental effects, and adjudicating contested situations, ensuring that combat remains fluid and properly governed by the campaign's ruleset.

## Guarantees

- The GM MUST have exclusive authority over combat session creation, modification, and termination.
- NPC and grunt management MUST be fully integrated with the ruleset-compliant entity system.
- All combat state modifications MUST be auditable and reversible where appropriate.
- The system MUST provide the GM with complete visibility over all participant statuses.

## Requirements

### Combat Session Control

- The system MUST allow the GM to initiate, pause, resume, and end combat encounters.
- Combat sessions MUST track all participants (PCs, NPCs, grunts) with their current status.
- The GM MUST be able to add or remove participants from an active combat session.
- The system MUST support multiple concurrent or sequential combat sessions within a live session.

### NPC and Grunt Management

- The system MUST provide quick-spawn functionality for NPCs from predefined templates.
- Grunts MUST aggregate into groups with shared condition tracks for simplified management.
- NPC actions MUST be executable through the same action resolution system as PCs.
- The system MUST support on-the-fly NPC attribute adjustments.

### Initiative Order Control

- The system MUST display and allow modification of the initiative order.
- The GM MUST be able to manually reorder participants regardless of rolled initiative.
- The system MUST support delay and held action mechanics.
- Initiative passes MUST be tracked and advanced according to ruleset specifications.

### Environment and Modifiers

- The system MUST allow the GM to apply environmental effects (visibility, terrain, weather).
- Environmental modifiers MUST automatically adjust resolution pools for affected participants.
- The system MUST support creation and application of custom situational modifiers.
- Environmental effects MUST have configurable scope (area, target, duration).

### Adjudication Controls

- The GM MUST be able to manually resolve contested rolls and override system calculations.
- The system MUST support secret GM rolls not visible to players.
- Damage application MUST be manually adjustable by the GM to any participant.
- The system MUST provide an undo/rollback mechanism for recent adjudication decisions.

### Bulk Operations

- The system MUST support applying damage, conditions, or effects to multiple targets simultaneously.
- Bulk actions MUST respect individual target resistance or immunity rules.
- The GM MUST be able to select groups of participants for bulk operations.
- Bulk operation results MUST be individually logged for each affected entity.

### Combat Logging

- The system MUST maintain a complete audit trail of all combat actions and state changes.
- Combat logs MUST be filterable by participant, action type, and time.
- The GM MUST have access to a real-time combat log dashboard.
- Combat logs MUST be persistable and exportable for campaign records.

## Constraints

- GM controls MUST NOT be accessible to non-GM participants.
- NPC data MUST remain hidden from players except where explicitly revealed.
- Override actions MUST NOT corrupt the integrity of participant state data.
- Secret rolls MUST be cryptographically verifiable to prove they were not retroactively modified.

## Non-Goals

- This capability does not define automated AI for NPC decision-making.
- This capability does not provide visual combat maps or positioning systems.
- This capability does not address narrative encounter design or story integration.

## Dependencies

- `campaign.live-sessions` - Real-time session infrastructure.
- `mechanics.action-execution` - Action resolution for combat interactions.
