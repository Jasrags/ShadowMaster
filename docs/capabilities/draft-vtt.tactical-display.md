# Tactical Display Capability

> [!NOTE] > **Draft Status:** This capability is in draft. Implementation pending completion of `vtt.map-import`, `campaign.live-sessions`, and `mechanics.multiplayer-combat`.

## Purpose

The Tactical Display capability ensures Shadow Master provides a self-contained, browser-based virtual tabletop experience for tactical combat. It delivers map rendering, token management, dynamic lighting, and fog of war as an integrated alternative to external VTT platforms, enabling groups to run tactical encounters entirely within Shadow Master.

## Guarantees

- Map rendering MUST accurately represent imported map imagery and geometry.
- Dynamic lighting MUST correctly calculate shadows based on wall geometry.
- Token positions MUST be visually accurate and synchronized across all participants.
- The display MUST remain responsive during typical combat scenarios.
- All participants MUST observe consistent token positions (eventual consistency acceptable).

## Requirements

### Canvas Rendering

- The display MUST render maps using HTML5 Canvas or WebGL.
- Rendering MUST support maps up to 100x100 grid squares at standard resolution.
- The display MUST maintain at least 30 FPS during normal operations.
- Rendering layers MUST be composited in correct order:
  1. Map image (base layer)
  2. Grid overlay
  3. Fog of war / unexplored areas
  4. Lighting and shadows
  5. Area effects and templates
  6. Tokens and auras
  7. UI overlays (selection, measurement)

### Viewport Controls

- The display MUST support pan via mouse drag or touch gestures.
- The display MUST support zoom via scroll wheel or pinch gestures.
- Zoom MUST have configurable minimum and maximum bounds.
- The display MUST support "fit to view" and "center on token" commands.
- Viewport state MUST be preserved across session reconnections.

### Grid System

- The display MUST render grid lines aligned to the imported grid scale.
- Grid display MUST support square and hexagonal modes.
- Grid visibility MUST be toggleable by the user.
- Grid coordinates MUST be displayable on hover or selection.
- Grid cell size MUST be configurable for display scaling.

### Token Display

- Tokens MUST be rendered as circular or square images on the map.
- Token size MUST be configurable (small, medium, large, huge, etc.).
- Tokens MUST display the character portrait or a default icon.
- Selected tokens MUST have a visible selection indicator.
- Token status indicators MUST display:
  - Current condition markers
  - Initiative order number
  - Health/damage status (color coding)
  - Active effects (iconography)

### Token Interaction

- Users MUST be able to select tokens via click or tap.
- Users MUST be able to move owned tokens via drag-and-drop.
- Movement MUST display distance traveled during drag.
- Movement MUST snap to grid when released (configurable).
- The GM MUST be able to move any token.
- Players MUST only be able to move their own character tokens.
- Token movement MUST respect wall geometry (no clipping through walls).

### Dynamic Lighting

- The display MUST render dynamic lighting from defined light sources.
- Light sources MUST cast illumination based on their range and intensity.
- Light color MUST tint the illuminated area appropriately.
- Walls MUST cast shadows blocking light propagation.
- Ambient light MUST fill areas not covered by specific light sources.
- Light sources MUST be togglable (on/off) by the GM.
- Shadowrun-specific lighting scenarios MUST be supported:
  - Total darkness (no ambient light)
  - Dim lighting (partial penalties)
  - Glare/bright light (flash effects)

### Vision and Line of Sight

- Each token MUST have a vision range based on character attributes.
- Tokens MUST only "see" areas within their line of sight, considering walls.
- Players viewing as their character MUST see only what that character sees.
- The GM MUST have a "reveal all" mode showing the entire map.
- Vision modes MUST support Shadowrun-specific enhancements:
  - **Normal vision**: Standard light-based visibility
  - **Low-light vision**: Double effective light range
  - **Thermographic vision**: See heat signatures through light obscurement
  - **Ultrasound**: Detect shapes through walls within limited range
- Vision mode selection MUST be per-token based on character capabilities.

### Fog of War

- The display MUST support exploration-based fog of war.
- Areas never seen MUST be fully obscured (black or filtered).
- Previously explored areas MAY be shown dimmed (GM configurable).
- Fog state MUST persist across sessions.
- The GM MUST be able to manually reveal or hide fog regions.
- Fog MUST update in real-time as tokens move and explore.

### Wall and Obstruction System

- Walls MUST block line-of-sight for vision calculations.
- Walls MUST block light for shadow calculations.
- Walls MUST block token movement.
- The system MUST support different wall types:
  - **Standard walls**: Block movement and vision
  - **Windows**: Block movement, allow vision
  - **Doors**: Toggleable state, may be locked
  - **One-way walls**: Directional transparency
- Wall data MUST be sourced from imported maps.

### Portal Interactions

- Doors MUST be rendered with distinct open/closed visual states.
- The GM MUST be able to toggle door states.
- Players MAY be able to toggle doors their tokens can reach (GM configurable).
- Door state changes MUST update line-of-sight calculations immediately.
- Locked doors MUST be visually distinct from unlocked doors.

### Measurement Tools

- The display MUST provide a ruler tool for distance measurement.
- Distance MUST be calculated respecting grid scale.
- The display MUST support template shapes:
  - Circle (burst/emanation)
  - Cone (breath weapons, sprays)
  - Line (beams, lightning)
  - Rectangle (area effects)
- Templates MUST display affected grid squares.
- Measurement units MUST align with ruleset definitions (meters).

### Range and Cover Calculations

- The display MUST calculate range between tokens using grid distance.
- Range categories (close, near, medium, far, extreme) MUST align with ruleset definitions.
- Cover assessment MUST consider wall geometry when calculating modifiers.
- Range and cover modifiers MUST integrate with `mechanics.action-execution`.
- The system MUST support manual override of calculated modifiers.

### Multi-Floor Support

- Maps linked to the same location MUST support floor navigation.
- The current floor MUST be clearly indicated in the UI.
- Switching floors MUST preserve viewport zoom level.
- Tokens on other floors MUST be hidden or ghosted.
- Floor connections (stairs, elevators) MUST be visually indicated.
- Range calculations MUST account for vertical distance across floors.

### Performance Optimization

- The display MUST implement efficient rendering for large maps.
- Off-screen elements MUST be culled from rendering.
- Lighting calculations MAY be cached and updated incrementally.
- The display MUST degrade gracefully on lower-powered devices.
- A "performance mode" MAY disable advanced lighting for speed.

## Constraints

- The display MUST function in modern browsers (Chrome, Firefox, Safari, Edge).
- Display state MUST NOT be authoritative; the server is source of truth.
- Rendering MUST NOT block the main thread for extended periods.
- Mobile devices MUST have a functional (if simplified) experience.
- The display MUST NOT load all campaign maps simultaneously.

## Non-Goals

- This capability does not provide map editing or creation tools.
- This capability does not handle map import or storage (see `vtt.map-import`).
- This capability does not provide 3D or isometric rendering.
- This capability does not address animated map backgrounds or weather effects.
- This capability does not provide audio integration with map elements.
- This capability does not address integration with external VTT platforms (see `campaign.vtt-integration`).

## Dependencies

- `vtt.map-import` - Source data for maps, walls, lights, and portals.
- `vtt.map-viewer` - Core rendering and display infrastructure.
- `campaign.live-sessions` - Real-time synchronization of token positions.
- `campaign.location-governance` - Location linking for map context.
- `mechanics.multiplayer-combat` - Combat state for initiative and action display.
- `mechanics.action-execution` - Integration with range/cover modifiers.
