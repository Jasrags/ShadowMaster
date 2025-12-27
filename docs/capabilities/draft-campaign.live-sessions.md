# Campaign Live Sessions Capability

> [!NOTE] > **Draft Status:** This capability is in draft. Implementation pending completion of `mechanics.action-execution`.

## Purpose

The Campaign Live Sessions capability ensures the reliable establishment and maintenance of real-time shared gameplay environments. It provides a stable communication infrastructure where multiple participants and game masters can engage in synchronized session activity, ensuring that all connected clients observe a consistent and verifiable session state.

## Guarantees

- The system MUST provide a real-time communication channel for all authorized session participants.
- Session state MUST be synchronized across all connected clients with minimal latency.
- The system MUST maintain session continuity through graceful handling of disconnection and reconnection events.
- All session activity MUST be attributable to authenticated participants with auditable presence records.

## Requirements

### Session Management

- The system MUST allow the campaign GM to create, start, and terminate live sessions linked to a campaign.
- Sessions MUST support a configurable maximum participant count.
- The system MUST generate unique, shareable invite tokens for session access.
- Session metadata (creation time, duration, participants) MUST be persistently recorded.

### Real-Time Infrastructure

- The system MUST support bidirectional real-time communication (WebSocket or equivalent).
- As an alternative, the system MAY implement Server-Sent Events (SSE) for simpler unidirectional updates.
- The system MUST implement heartbeat mechanisms to detect and handle stale connections.
- Connection state MUST be recoverable: participants rejoining within a timeout window MUST restore their session context.

### State Synchronization

- All connected clients MUST receive authoritative state updates from the session host.
- The system MUST implement conflict resolution for concurrent state modifications.
- State synchronization MUST be incremental to minimize data transfer overhead.
- The system MUST provide a full state snapshot for newly joining participants.

### Presence and Awareness

- The system MUST track and broadcast participant presence (online, idle, disconnected).
- The system MUST support activity indicators (typing, rolling, taking action).
- Presence changes MUST be propagated to all participants in real-time.
- The GM MUST have visibility into all participant connection states.

### Session Persistence

- The system MUST persist session state at regular intervals.
- In the event of server failure, the system MUST be capable of restoring the last persisted state.
- Session history (participants, duration, key events) MUST be retained for campaign records.
- The system MUST support explicit session pause and resume operations.

## Constraints

- Real-time features MUST NOT degrade the experience for participants with high-latency connections beyond reasonable thresholds.
- Session participation MUST be restricted to authenticated campaign members or explicit invitees.
- Session state synchronization MUST NOT cause data loss or corruption.
- The system MUST NOT expose session content to non-participants.

## Non-Goals

- This capability does not define the content of session interactions (combat, chat, etc.).
- This capability does not provide visual map or token positioning features.
- This capability does not address recording or replay of session content beyond metadata.

## Dependencies

- `mechanics.action-execution` - Action context for session activities.
