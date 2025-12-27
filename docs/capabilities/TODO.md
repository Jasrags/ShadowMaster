# Capabilities TODO

This document tracks proposed future capabilities that have been identified but not yet implemented. Each entry includes a brief description, dependencies, and estimated scope.

---

## Proposed Capabilities

### 1. Campaign Live Sessions (`campaign.live-sessions`)

**Status:** Proposed
**Priority:** High
**Dependencies:** `mechanics.action-execution`

Real-time session infrastructure enabling multiple players and a GM to participate in shared gameplay sessions.

**Scope:**
- WebSocket or Server-Sent Events (SSE) infrastructure for real-time updates
- Session creation, joining, and participant management
- Connection state handling (reconnection, timeout, heartbeat)
- Session state synchronization across all connected clients
- Presence indicators (who's online, who's typing/rolling)
- Session persistence and recovery

**Key Features:**
- GM creates a live session linked to a campaign
- Players join via invite link or campaign membership
- All participants see real-time state updates
- Graceful handling of disconnections and reconnections

**Technical Considerations:**
- May require Next.js API routes with WebSocket upgrade or separate WebSocket server
- Consider using Server-Sent Events for simpler one-way updates initially
- Need conflict resolution strategy for concurrent updates

---

### 2. GM Combat Tools (`campaign.gm-combat-tools`)

**Status:** Proposed
**Priority:** High
**Dependencies:** `campaign.live-sessions`, `mechanics.action-execution`

GM-specific controls for managing combat encounters with multiple participants.

**Scope:**
- NPC/Grunt management within combat sessions
- Initiative order control (reorder, delay, hold)
- Environment effect application (visibility, terrain, weather modifiers)
- Adjudication controls for opposed tests
- Damage application to any participant
- Combat pause/resume/end controls
- Secret rolls (GM-only visibility)

**Key Features:**
- GM dashboard showing all participants' status
- Quick NPC spawning from grunt templates
- Bulk actions (damage all, apply condition to group)
- Override capabilities for rule edge cases
- Combat log with full audit trail

---

### 3. Multiplayer Combat (`mechanics.multiplayer-combat`)

**Status:** Proposed
**Priority:** High
**Dependencies:** `campaign.live-sessions`, `campaign.gm-combat-tools`, `mechanics.action-execution`

Cross-player combat interactions with real-time resolution.

**Scope:**
- Shared combat tracker visible to all participants
- Turn notifications and alerts
- Cross-player opposed tests (Player A attacks Player B)
- Defense roll requests sent to defending player
- Interrupt action requests during others' turns
- Action visibility settings (what can other players see)
- Initiative tracking across multiple initiative passes

**Key Features:**
- "Your Turn" notifications (visual + optional audio)
- Defense roll prompts with timeout and auto-roll fallback
- Interrupt action request system
- Spectator mode for non-participants
- Combat replay/history viewer

**Technical Considerations:**
- Opposed tests require request/response flow between players
- Need timeout handling when players don't respond
- GM should be able to force-resolve stalled interactions

---

### 4. Session Chat (`campaign.session-chat`)

**Status:** Proposed
**Priority:** Medium
**Dependencies:** `campaign.live-sessions`

Real-time chat system for live session communication.

**Scope:**
- Text chat during live sessions
- Multiple chat channels (OOC, IC, GM-only, whispers)
- Dice roll integration (inline roll results in chat)
- Character name display for IC messages
- Chat history persistence
- Typing indicators
- Message reactions/acknowledgments

**Key Features:**
- **OOC (Out of Character)** - Player-to-player chat
- **IC (In Character)** - Character-to-character with character names
- **GM Broadcast** - GM messages highlighted for all
- **Whispers** - Private messages between participants
- **GM Secret** - GM-only channel for notes
- Inline dice notation parsing (`/roll 8d6` renders as roll result)
- Emotes/actions (`/me draws their weapon`)

**Integration Points:**
- Action execution results can be posted to chat
- Combat events (damage, conditions) announced in chat
- Initiative order changes broadcast to chat

---

### 5. Virtual Tabletop Integration (`campaign.vtt-integration`)

**Status:** Proposed
**Priority:** Low
**Dependencies:** `campaign.live-sessions`, `mechanics.multiplayer-combat`

Integration with virtual tabletop platforms for visual combat representation.

**Scope:**
- Token/map state synchronization
- Position tracking for range/cover calculations
- Integration APIs for popular VTT platforms (Foundry, Roll20)
- Embedded simple map viewer
- Movement action tracking

**Key Features:**
- Sync character tokens with VTT
- Calculate range modifiers from token positions
- Cover/concealment based on map features
- Movement tracking integrated with action economy

**Technical Considerations:**
- Each VTT has different APIs/extension mechanisms
- May start with export/import rather than live sync
- Consider building simple built-in map as alternative

---

### 6. Async Play (`campaign.async-play`)

**Status:** Proposed
**Priority:** Medium
**Dependencies:** `mechanics.action-execution`, `campaign.session-chat`

Support for play-by-post and asynchronous gameplay styles.

**Scope:**
- Turn-based play without real-time requirements
- Notification system for pending actions
- Action queuing and scheduling
- Flexible response windows
- Thread-based scene organization

**Key Features:**
- Email/push notifications when it's your turn
- Configurable turn timeouts (hours/days)
- Auto-skip or NPC-takeover for absent players
- Scene threads for parallel storylines
- Catch-up summaries for returning players

---

## Implementation Order Recommendation

```
Phase A: Foundation
├── campaign.live-sessions (real-time infrastructure)
└── campaign.session-chat (communication layer)

Phase B: Combat
├── campaign.gm-combat-tools (GM controls)
└── mechanics.multiplayer-combat (shared combat)

Phase C: Extended Play
├── campaign.async-play (play-by-post)
└── campaign.vtt-integration (visual maps)
```

---

## Quick Wins Before Multiplayer

Before tackling the multiplayer capabilities, complete these items from `mechanics.action-execution`:

1. **Phase 5 Extension: Quick Combat Mode** (Option 2)
   - Solo combat session from character sheet
   - Action execution through combat API
   - Results applied to character state
   - Full action economy enforcement
   - See: `action-execution-implementation-plan.md`

---

## Notes

- Each capability should have its own specification document before implementation
- Capabilities should be implemented incrementally with working features at each step
- Real-time features (WebSocket) add operational complexity - consider SSE for MVP
- All multiplayer features need offline/degraded mode handling
