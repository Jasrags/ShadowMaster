# Async Play Capability

> [!NOTE] > **Draft Status:** This capability is in draft. Implementation pending completion of `mechanics.action-execution` and `campaign.session-chat`.

## Purpose

The Async Play capability ensures the continuity of gameplay for groups unable to participate in real-time sessions. It provides turn-based play infrastructure, notification systems, and flexible response windows, ensuring that play-by-post and asynchronous game styles maintain engagement and proper mechanical resolution.

## Guarantees

- Turn-based play MUST function without requiring real-time participant presence.
- The notification system MUST reliably alert participants when action is required.
- Async game state MUST remain consistent and valid across extended time periods.
- The system MUST prevent indefinite blocking by unresponsive participants.

## Requirements

### Turn-Based Play Infrastructure

- The system MUST support combat and scene resolution without real-time requirements.
- Turn order MUST be maintained and advanced based on participant action submission.
- The system MUST queue pending actions when participants are unavailable.
- State changes MUST be applied atomically when actions are resolved.

### Notification System

- The system MUST notify participants when their action is requested.
- Notification channels MUST include:
  - In-app notifications (when available)
  - Email notifications (configurable)
  - Push notifications (where platform permits)
- Notification preferences MUST be individually configurable per participant.
- The system MUST support notification batching to prevent spam.

### Response Windows

- The GM MUST be able to configure turn timeout durations (hours, days).
- The system MUST track time elapsed since action was requested.
- Approaching deadlines MUST trigger reminder notifications.
- The system MUST support pause periods (vacations, holidays) where timeouts are suspended.

### Timeout Resolution

- The system MUST support configurable behavior when timeouts expire:
  - Auto-skip: Proceed without the participant's action.
  - Auto-roll: Execute a default action with system-generated rolls.
  - GM takeover: Transfer control to the GM.
  - NPC mode: Replace character with AI-controlled equivalent (if available).
- Timeout resolution MUST be logged for transparency.
- The GM MUST be able to override or undo timeout resolutions.

### Scene Threading

- The system MUST support parallel scene threads within a campaign.
- Participants MAY be active in multiple scenes concurrently.
- Scene threads MUST maintain independent state and turn order.
- The system MUST support scene merging when separate threads converge.

### Catch-Up Features

- The system MUST provide activity summaries for returning participants.
- Summaries MUST include key events, state changes, and pending decisions.
- The system MUST indicate what has changed since the participant's last activity.
- Chat and action history MUST be scrollable for complete context.

### Action Scheduling

- Participants MUST be able to queue conditional actions (e.g., "If attacked, dodge").
- Scheduled actions MUST execute automatically when conditions are met.
- The system MUST validate scheduled actions against current state at trigger time.
- Participants MUST be able to cancel or modify scheduled actions before execution.

### Campaign Pacing Controls

- The GM MUST be able to set campaign-wide pacing expectations (turns per day, etc.).
- The system MUST track and report participation rates.
- Chronically unresponsive participants MUST be flaggable for GM attention.
- The GM MUST be able to force-advance scenes past stalled participants.

## Constraints

- Async play MUST NOT compromise the mechanical integrity of combat resolution.
- State MUST remain valid even if weeks elapse between participant actions.
- Notifications MUST respect participant privacy and preference settings.
- The system MUST NOT require always-on server connections for async play.

## Non-Goals

- This capability does not define real-time session features (see `campaign.live-sessions`).
- This capability does not provide automated game mastering or AI storytelling.
- This capability does not address voice or video message recording for async communication.

## Dependencies

- `mechanics.action-execution` - Action resolution for queued actions.
- `campaign.session-chat` - Chat infrastructure for async messages.
