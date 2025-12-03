# Domain Struct Update Prompt Template

Use this prompt when adding or updating a domain struct to ensure consistency across Repository, API, and UI layers.

## Prompt Template

```
I need to [add/update] the [STRUCT_NAME] domain struct. Please update all layers following the same pattern used for the Character struct.

Reference the Character struct implementation as the pattern:
- Domain: `internal/domain/character.go` (lines 13-28)
- Repository: `internal/repository/json/character.go` (storedCharacter struct, lines 26-41, and conversion methods)
- API: `internal/api/handlers.go` (characterResponse struct, lines 63-76, and handler methods)
- UI: `web/ui/src/lib/types.ts` (Character interface, lines 34-48)

[DESCRIBE THE CHANGES - either new struct definition or changes to existing struct]

Please ensure:

1. **Domain Layer** (`internal/domain/[struct].go`):
   - Add/update the struct with proper JSON tags using snake_case
   - Use `time.Time` for timestamps, `*time.Time` for optional timestamps
   - Use custom types for enums (e.g., `CharacterState`)
   - Include standard fields: `CreatedAt`, `UpdatedAt`, `DeletedAt` (if applicable)

2. **Repository Layer** (`internal/repository/json/[struct].go`):
   - Create/update `stored[Struct]` struct that converts `time.Time` → `string` for JSON storage
   - Update `storedToDomain()` method to convert back from storage format
   - Update `Create()`, `Update()`, and `GetByID()` methods to handle all fields
   - Ensure time fields are formatted as `"2006-01-02T15:04:05Z07:00"`

3. **API Layer** (`internal/api/handlers.go`):
   - Create/update `[struct]Response` struct matching the domain struct but with:
     - `time.Time` fields converted to `string`
     - Enum types converted to `string`
   - Update all handler methods that return this struct to format times properly
   - Use `.Format("2006-01-02T15:04:05Z07:00")` for time fields

4. **UI Layer** (`web/ui/src/lib/types.ts`):
   - Add/update TypeScript interface matching the API response structure
   - Use snake_case for field names (matching JSON tags)
   - Use `string` for all time fields
   - Use union types for enums (e.g., `type CharacterState = 'creation' | 'gm_review' | 'advancement'`)
   - Mark optional fields with `?`

5. **Consistency Checks**:
   - JSON field names must match across all layers (snake_case)
   - All time fields must be strings in JSON/API/UI layers
   - Enum values must be consistent across Go and TypeScript
   - Optional fields should use `omitempty` in Go and `?` in TypeScript

Please update all necessary files and ensure the changes are consistent with the Character struct pattern.
```

## Example Usage

### Example 1: Adding a new struct

```
I need to add the Campaign domain struct. Please update all layers following the same pattern used for the Character struct.

Reference the Character struct implementation as the pattern:
- Domain: `internal/domain/character.go` (lines 13-28)
- Repository: `internal/repository/json/character.go` (storedCharacter struct, lines 26-41, and conversion methods)
- API: `internal/api/handlers.go` (characterResponse struct, lines 63-76, and handler methods)
- UI: `web/ui/src/lib/types.ts` (Character interface, lines 34-48)

The Campaign struct should have:
- ID (string)
- Name (string)
- Description (string, optional)
- GMUserID (string)
- Status (enum: "planning" | "active" | "completed" | "archived")
- CreatedAt, UpdatedAt, DeletedAt (timestamps)

Please ensure [follow the checklist above]...
```

### Example 2: Updating an existing struct

```
I need to update the Character domain struct to add a new field. Please update all layers following the same pattern used for the Character struct.

Reference the Character struct implementation as the pattern:
- Domain: `internal/domain/character.go` (lines 13-28)
- Repository: `internal/repository/json/character.go` (storedCharacter struct, lines 26-41, and conversion methods)
- API: `internal/api/handlers.go` (characterResponse struct, lines 63-76, and handler methods)
- UI: `web/ui/src/lib/types.ts` (Character interface, lines 34-48)

Add the following field to Character:
- PortraitURL (string, optional) - URL to character portrait image

Please ensure [follow the checklist above]...
```

## Quick Reference: File Locations

| Layer | File Pattern | Key Components |
|-------|-------------|----------------|
| **Domain** | `internal/domain/[name].go` | Struct definition with JSON tags |
| **Repository** | `internal/repository/json/[name].go` | `stored[Name]` struct, conversion methods |
| **API** | `internal/api/handlers.go` | `[name]Response` struct, handler methods |
| **UI** | `web/ui/src/lib/types.ts` | TypeScript interface |

## Key Patterns to Follow

1. **JSON Tags**: Always use snake_case (e.g., `user_id`, `created_at`)
2. **Time Fields**: 
   - Domain: `time.Time` or `*time.Time`
   - Repository/API: `string` (formatted as RFC3339)
   - UI: `string`
3. **Enums**:
   - Domain: Custom type (e.g., `type CharacterState string`)
   - Repository/API: `string`
   - UI: Union type (e.g., `type CharacterState = 'creation' | 'gm_review'`)
4. **Optional Fields**:
   - Domain: Pointer type (`*time.Time`) or omit from required
   - JSON: `omitempty` tag
   - UI: `?` suffix

