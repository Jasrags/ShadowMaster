# Multiplayer Combat Capability

> [!NOTE] > **Draft Status:** This capability is in draft. Implementation pending completion of `campaign.live-sessions`, `campaign.gm-combat-tools`, and `mechanics.action-execution`.

## Purpose

The Multiplayer Combat capability ensures the coordinated resolution of combat interactions across multiple connected players. It provides a synchronized combat tracker, cross-player opposed tests, and real-time turn notifications, ensuring that all participants experience a consistent and responsive combat flow.

## Guarantees

- All participants MUST observe a consistent view of combat state including initiative order and participant status.
- Cross-player interactions MUST be resolved with proper request/response flows and timeout handling.
- Turn transitions MUST be communicated to all participants in real-time.
- The system MUST provide graceful handling of unresponsive participants without blocking combat flow.

## Requirements

### Shared Combat Tracker

- The system MUST display a unified combat tracker visible to all participants.
- Initiative order MUST be synchronized across all connected clients.
- Participant status (health, conditions, active effects) MUST be updated in real-time.
- The combat tracker MUST indicate the current active participant and pending actions.

### Turn Notifications

- The system MUST notify participants when their turn begins via visual indication.
- Optional audio notifications MAY be supported for turn alerts.
- The system MUST indicate remaining action budget for the current turn.
- Turn timeout warnings MUST be displayed with configurable thresholds.

### Cross-Player Opposed Tests

- The system MUST support opposed tests where Player A's action requires a response from Player B.
- Defense rolls MUST be requested from the defending player with clear indication of the attack type.
- The system MUST enforce response timeouts with configurable duration.
- On timeout, the system MUST support auto-roll or GM-resolution fallback options.

### Interrupt and Reaction System

- Participants MUST be able to request interrupt actions during others' turns.
- Interrupt requests MUST be submitted to the GM for approval or automatic adjudication.
- The system MUST track and apply initiative penalties for interrupt actions.
- Eligible interrupt actions MUST be presented based on character capabilities.

### Action Visibility

- The system MUST support configurable visibility for action declarations and results.
- The GM MUST control what information is visible to which participants.
- Stealth and surprise mechanics MUST respect hidden action visibility.
- Players MUST NOT see opponent dice pools or exact modifiers unless rules permit.

### Initiative Pass Management

- The system MUST track multiple initiative passes per combat round.
- Participants exceeding initiative thresholds MUST be scheduled for additional passes.
- Pass transitions MUST be clearly communicated to all participants.
- Initiative score adjustments during combat MUST correctly update pass eligibility.

### Spectator Mode

- The system MUST support spectator participants who observe but do not act.
- Spectators MUST see public combat state but not hidden GM information.
- Spectator presence MUST be indicated but not disruptive to combat flow.
- Spectators MAY transition to active participants with GM approval.

### Combat History and Replay

- The system MUST maintain a timestamped log of all combat events.
- Participants MUST be able to review recent combat actions.
- Combat history MUST be exportable for campaign session records.
- The system MAY support replay visualization of combat sequences.

## Constraints

- Cross-player interactions MUST NOT proceed without proper response or timeout resolution.
- Combat state MUST remain consistent across all clients; desynchronization MUST trigger recovery.
- The system MUST NOT allow participants to act outside their turn except through interrupt mechanics.
- All combat resolution MUST use the authoritative server state, not client-side calculations.

## Non-Goals

- This capability does not provide AI-controlled player substitution for absent participants.
- This capability does not address visual combat mapping or token positioning.
- This capability does not define narrative descriptions or cinematic combat presentation.

## Dependencies

- `campaign.live-sessions` - Real-time session infrastructure.
- `campaign.gm-combat-tools` - GM controls for combat management.
- `mechanics.action-execution` - Action resolution system.
