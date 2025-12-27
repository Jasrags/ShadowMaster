# Map Import Capability

> [!NOTE] > **Draft Status:** This capability is in draft. Implementation pending completion of `campaign.location-governance`.

## Purpose

The Map Import capability ensures the reliable ingestion and storage of tactical map data from external map-making tools. It provides parsing, validation, and persistence of Universal VTT format files (including Dungeondraft DD2VTT exports), ensuring that all map elements—images, walls, lights, and portals—are correctly captured and made available for use in the built-in VTT viewer.

## Guarantees

- Imported map files MUST be validated against the Universal VTT specification.
- Map data MUST be stored in a format that preserves all source information.
- Import operations MUST NOT corrupt existing campaign or location data.
- Failed imports MUST provide actionable error messages identifying the failure point.
- Imported maps MUST be retrievable and usable across all campaign sessions.

## Requirements

### Universal VTT Format Support

- The system MUST parse Universal VTT files with extensions: `.dd2vtt`, `.df2vtt`, `.uvtt`.
- The parser MUST extract and store the following data elements:
  - **Image**: Base64-encoded map image (PNG or WEBP format)
  - **Resolution**: Map origin coordinates and overall size in grid squares
  - **Grid Scale**: Pixels per grid value for coordinate conversion
  - **Walls/Obstructions**: Arrays of coordinate pairs defining line-of-sight blockers
  - **Portals**: Door and window definitions with position and state
  - **Ambient Light**: Hexadecimal color code for base lighting
  - **Light Sources**: Array of lights with position, range, intensity, color, and shadow flags
  - **Format Version**: File format version for compatibility handling
- The system MUST support format versions currently in use by Dungeondraft.

### Dungeondraft Integration

- The system MUST fully support Dungeondraft's DD2VTT export format.
- Wall data from Dungeondraft MUST correctly translate to line-of-sight obstructions.
- Light data from Dungeondraft MUST correctly translate to dynamic light sources.
- The system SHOULD document the recommended Dungeondraft export settings for optimal import.
- Baked lighting flag MUST be respected when determining rendering approach.

### Image Processing

- Imported map images MUST be decoded from base64 and stored as binary assets.
- The system MUST validate image format and dimensions before storage.
- Images MUST be stored in a campaign-accessible location with stable identifiers.
- The system MAY generate lower-resolution thumbnails for preview purposes.
- Image storage MUST respect configurable maximum file size limits.

### Map Metadata

- Each imported map MUST have editable metadata:
  - Name (required, defaults to filename)
  - Description (optional)
  - Tags (optional, for organization)
  - Floor order (integer, for multi-floor buildings)
- Metadata MUST be stored separately from raw import data to allow updates.
- The system MUST track import timestamp and source filename.

### Location Linking

- Imported maps MUST be linkable to locations from `campaign.location-governance`.
- A location MAY have multiple linked maps (e.g., multiple floors).
- Maps MAY exist without location links for general-purpose use.
- When a map is linked to a location:
  - Location environmental modifiers MUST apply to the map context
  - Map access MUST respect location visibility rules
  - Location name SHOULD be suggested as default map name
- Unlinking a map from a location MUST NOT delete the map.

### Multi-Floor Organization

- Maps linked to the same location MUST support floor ordering.
- Floor order MUST be represented as a signed integer (negative for basements).
- The system MUST provide floor navigation metadata for linked map sets.
- Floor transitions MUST be definable via portal connections between floors.
- The system MUST support vertical distance calculation across floors.

### Validation and Error Handling

- The parser MUST validate JSON structure before processing.
- The parser MUST verify required fields are present and correctly typed.
- Coordinate arrays MUST be validated for proper structure (x,y pairs).
- The system MUST reject files exceeding configurable size limits.
- Validation errors MUST identify the specific field and issue.
- Partial imports MUST NOT be persisted; imports are atomic.

### Map Storage

- Maps MUST be stored in a campaign-scoped storage location.
- Map data MUST be retrievable by stable identifier.
- The system MUST support listing all maps for a campaign.
- The system MUST support listing all maps for a specific location.
- Map deletion MUST remove all associated data (image, metadata, geometry).
- The system MUST track storage usage per campaign.

### Import Workflow

- Users MUST be able to import maps via file upload interface.
- The system MUST provide import progress indication for large files.
- Successful imports MUST display a preview of the imported map.
- Users MUST be prompted to set metadata and location link after import.
- The system MUST support batch import of multiple maps.

## Constraints

- Import file size MUST be limited to a configurable maximum (recommended: 50MB).
- Image dimensions MUST be limited to prevent memory exhaustion during rendering.
- Import operations MUST complete within reasonable time bounds for user experience.
- Imported geometry MUST NOT exceed coordinate precision limits of the storage system.
- The system MUST NOT execute or interpret any code embedded in import files.

## Non-Goals

- This capability does not provide map editing or creation tools.
- This capability does not render or display imported maps (see `vtt.map-viewer`).
- This capability does not handle token or character placement on maps.
- This capability does not address proprietary formats beyond Universal VTT.
- This capability does not provide format conversion between VTT formats.

## Dependencies

- `campaign.location-governance` - Location linking for imported maps.
- `campaign.management` - Campaign-scoped storage context.
