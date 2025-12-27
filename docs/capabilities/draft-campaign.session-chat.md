# Session Chat Capability

> [!NOTE] > **Draft Status:** This capability is in draft. Implementation pending completion of `campaign.live-sessions`.

## Purpose

The Session Chat capability ensures reliable real-time text communication between participants during live gameplay sessions. It provides structured communication channels, inline dice integration, and persistent chat history, ensuring that all session dialogue—whether in-character or out-of-character—is preserved and accessible to appropriate participants.

## Guarantees

- All chat messages MUST be delivered to appropriate recipients in real-time.
- Channel-based message segregation MUST ensure proper visibility and privacy.
- Chat history MUST be persistent and searchable within session records.
- Inline dice and action integrations MUST seamlessly blend with text communication.

## Requirements

### Chat Channels

- The system MUST support multiple concurrent chat channels within a session.
- Required channels MUST include:
  - **OOC (Out of Character)** - Player-to-player meta-communication.
  - **IC (In Character)** - Character dialogue with character name attribution.
  - **GM Broadcast** - GM announcements visible to all participants.
  - **Whispers** - Private messages between specific participants.
  - **GM Secret** - GM-only private channel for notes and planning.
- Channel membership MUST be automatically determined by participant role.
- Custom channels MAY be created by the GM for specific purposes.

### Message Formatting

- Messages MUST support basic text formatting (bold, italic, code blocks).
- Messages MUST display sender identity appropriate to the channel (player name vs. character name).
- Timestamps MUST be attached to all messages.
- The system MUST support message editing and deletion with appropriate audit logging.

### Dice Integration

- The system MUST parse inline dice notation (e.g., `/roll 8d6`).
- Roll results MUST be rendered inline with the message content.
- Dice rolls MUST use the authoritative dice resolution system.
- Roll results MUST include success/failure counts for standard Shadowrun pools.
- Hidden rolls (GM-only visibility) MUST be supported via notation (e.g., `/gmroll`).

### Emotes and Actions

- The system MUST support emote notation (e.g., `/me draws their weapon`).
- Emotes MUST be rendered distinctly from dialogue messages.
- Emotes MUST attribute to the character name in IC channels.
- The system MAY support predefined emote shortcuts.

### Presence Indicators

- The system MUST display typing indicators when participants are composing messages.
- Typing indicators MUST respect channel visibility (only show in channels the viewer can see).
- The system MUST indicate when messages have been read by recipients (for whispers).
- Active participant presence MUST be displayed in the chat interface.

### Message Reactions

- Participants MUST be able to add reactions to messages (emoji or predefined).
- Reactions MUST be aggregated and displayed on the message.
- Reaction counts MUST update in real-time.
- The GM MAY disable reactions for specific channels.

### Integration Points

- Action execution results MUST be publishable to chat channels.
- Combat events (damage dealt, conditions applied) MUST be announceable in chat.
- Initiative order changes MUST optionally broadcast to chat.
- The system MUST support linking to character sheets, items, or rules from chat messages.

### History and Search

- All chat messages MUST be persistently stored with the session record.
- The system MUST support searching chat history by keyword, sender, or channel.
- Chat history MUST be loadable when rejoining a session.
- The system MUST support exporting chat logs in standard formats.

## Constraints

- Messages MUST NOT be delivered to channels where the sender lacks access.
- Whisper content MUST be encrypted or access-controlled to prevent unauthorized viewing.
- Chat history MUST NOT expose GM Secret channel content to non-GM participants.
- Message delivery MUST be reliable; failed deliveries MUST be retried or reported.

## Non-Goals

- This capability does not provide voice or video communication.
- This capability does not define automated chat moderation or content filtering.
- This capability does not address translation or language localization of chat content.

## Dependencies

- `campaign.live-sessions` - Real-time session infrastructure.
