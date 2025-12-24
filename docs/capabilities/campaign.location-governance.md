# Location Governance Capability

## Purpose

The Location Governance capability ensures the persistent and structured management of geographical and conceptual spaces within a campaign world. It maintains the integrity of spatial relationships, visibility controls, and environment-specific constraints, ensuring that all participants interact with a shared and verifiable model of the game world.

## Guarantees

- Locations MUST be uniquely identified and strictly attributed to a specific campaign context.
- The system MUST enforce visibility controls, restricting access to sensitive location metadata (e.g., GM notes, hidden NPCs) based on participant roles.
- Spatial hierarchies and connections MUST remain logically consistent and navigable within the campaign structure.
- Environment-specific mechanics (e.g., security ratings, mana levels, Matrix host attributes) MUST be authoritatively defined and accessible for encounter resolution.

## Requirements

### Spatial Modeling

- The system MUST support multiple location types, including physical sites, digital hosts, and astral spaces.
- Locations MUST support hierarchical nesting (e.g., rooms within buildings, districts within cities) to maintain spatial organization.
- Connections between locations MUST be explicitly defined, including connection types (e.g., physical, Matrix, transport) and directionality.

### Participant Visibility

- Every location attribute MUST have a defined visibility scope (e.g., GM-only, Public, Player-visible).
- The system MUST redact GM-only content from all responses serves to participants without campaign authority permissions.
- Shared location metadata MUST be consistently synchronized across all authorized participants to ensure a unified world view.

### Environmental Mechanics

- Locations MUST support the definition of authoritative game mechanics, such as Security Ratings (1–10) and background counts.
- Matrix-specific locations MUST govern host-specific attributes, including ratings, active IC types, and patrol configurations.
- Astral-specific locations MUST define mana levels and barrier ratings that influence astral resolution.

### Lifecycle and Templates

- The system MUST facilitate the creation of reusable location templates to ensure consistency across campaign environments.
- Location state MUST include tracking for participant visits and historical references to maintain campaign continuity.
- Changes to location metadata MUST be persistent and auditable within the campaign record.

## Constraints

- Location identifiers MUST NOT be shared across different campaign contexts.
- Modification of authoritative location mechanics MUST be restricted to campaign authorities (GMs).
- Visibility transitions (e.g., revealing a location to players) MUST be explicitly triggered by a campaign authority.

## Non-Goals

- This capability does not provide real-time map rendering or spatial positioning of participants.
- This capability does not manage the narrative descriptions or creative writing for locations.
- This capability does not handle the resolution of actions taken within a location (see Action Resolution).
