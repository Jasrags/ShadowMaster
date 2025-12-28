# Virtual Tabletop Integration Capability

> [!NOTE] > **Draft Status:** This capability is in draft. Implementation pending completion of `campaign.live-sessions` and `mechanics.multiplayer-combat`.

## Purpose

The Virtual Tabletop Integration capability ensures seamless coordination between Shadow Master and external virtual tabletop platforms. It provides bidirectional synchronization of character tokens, position data import, and export workflows, enabling users to leverage their preferred VTT platform (FoundryVTT, Roll20) while maintaining Shadow Master as the authoritative source for character and rules data.

## Guarantees

- Character data synchronization MUST maintain consistency between Shadow Master and connected VTT platforms.
- The system MUST NOT corrupt character data during synchronization operations.
- Integration failures MUST degrade gracefully without disrupting core Shadow Master functionality.
- External VTT data imports MUST be validated before applying to game state.

## Requirements

### Token Export

- The system MUST support exporting character data as VTT-compatible tokens.
- Token data MUST include relevant statistics, conditions, and status indicators.
- Token exports MUST support formats compatible with target platforms:
  - Foundry VTT actor JSON format
  - Roll20 character sheet format
- Exports MUST include Shadowrun-specific data (initiative, damage tracks, essence).
- The system MUST support bulk export of entire team rosters.

### Position Import

- The system MUST support importing token position updates from VTT platforms.
- Imported positions MUST be validated and mapped to Shadow Master's coordinate system.
- Position imports MUST trigger recalculation of range-based modifiers.
- The system MUST handle coordinate system differences between platforms.

### Bidirectional Synchronization

- Synchronization MUST be bidirectional where VTT platform APIs permit.
- Real-time synchronization MUST be supported during live sessions.
- The system MUST implement conflict resolution for concurrent state modifications.
- Synchronization status MUST be visible to users.

### VTT Platform Adapters

- The system MUST implement integration adapters for supported VTT platforms.
- Initial target platforms MUST include:
  - **Foundry VTT** (via module or API)
  - **Roll20** (via API where available)
- Each integration adapter MUST implement a common interface for portability.
- The system MUST document requirements and limitations for each integration.
- Adapters MUST be maintainable independently of core system updates.

### Foundry VTT Integration

- The system MUST provide a Foundry VTT module for integration.
- The module MUST support actor import/export.
- The module MUST support real-time token position synchronization.
- The module MUST respect Foundry's permission and ownership model.
- The module MUST support Foundry VTT v11 and later.

### Roll20 Integration

- The system MUST support Roll20 character sheet export format.
- The system MAY support Roll20 API integration where available.
- Integration limitations due to Roll20's API restrictions MUST be documented.
- Static export MUST be available even without API access.

### Character Sheet Synchronization

- Exported character data MUST include:
  - Attributes and skills
  - Calculated derived values
  - Equipment and inventory
  - Active qualities and powers
  - Current condition (damage, status effects)
- Imported updates MUST be limited to position and transient combat state.
- Core character data modifications MUST originate in Shadow Master.

### Import/Export Workflows

- The system MUST support static export of character data in VTT-compatible formats.
- Static exports MUST be downloadable as files.
- Import workflows MUST validate incoming data against current ruleset.
- The system MUST provide clear feedback on import validation failures.
- The system MUST support scheduled or triggered synchronization.

## Constraints

- VTT synchronization MUST NOT introduce latency that impacts combat flow.
- External VTT API limitations MUST be documented and communicated to users.
- The system MUST NOT require specific VTT platform ownership to function.
- Character data in Shadow Master MUST remain authoritative over VTT copies.
- API keys or credentials for VTT platforms MUST be stored securely.

## Non-Goals

- This capability does not provide a built-in virtual tabletop (see `vtt.tactical-display`).
- This capability does not address audio/video conferencing integration with VTT platforms.
- This capability does not define map or asset management for external VTTs.
- This capability does not cover VTT platforms beyond the initially supported list.
- This capability does not provide map import from VTT platforms (see `vtt.map-import`).

## Dependencies

- `campaign.live-sessions` - Real-time session infrastructure for synchronization.
- `mechanics.multiplayer-combat` - Shared combat state for token synchronization.
