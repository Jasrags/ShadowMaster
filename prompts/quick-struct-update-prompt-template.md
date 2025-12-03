I need to [add/update] the [STRUCT_NAME] domain struct. Please update all layers following the same pattern used for the Character struct.

Reference: 
- Domain: `internal/domain/character.go` (lines 13-28)
- Repository: `internal/repository/json/character.go` (storedCharacter, lines 26-41)
- API: `internal/api/handlers.go` (characterResponse, lines 63-76)
- UI: `web/ui/src/lib/types.ts` (Character interface, lines 34-48)

[Describe your changes here]

Ensure consistency across all layers: JSON tags (snake_case), time fields (string in JSON/API/UI), enums, and optional fields.