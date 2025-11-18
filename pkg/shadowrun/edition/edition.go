package edition

import (
	"shadowmaster/internal/domain"
)

// EditionHandler defines the interface for edition-specific operations.
// Each edition (SR3, SR5, etc.) must implement this interface to provide
// edition-specific character creation, validation, and data access.
type EditionHandler interface {
	// Edition returns the edition identifier (e.g., "sr3", "sr5")
	Edition() string

	// CreateCharacter creates a new character using edition-specific creation data.
	// The creationData parameter is edition-specific and should be validated by the handler.
	// For SR3, this would be a PrioritySelection struct.
	// For SR5, this might be a SumToTenSelection or KarmaPointBuySelection.
	CreateCharacter(name, playerName string, creationData interface{}) (*domain.Character, error)

	// ValidateCharacter validates that a character conforms to edition-specific rules.
	// This includes attribute limits, skill point allocation, resource limits, etc.
	ValidateCharacter(character *domain.Character) error

	// GetCharacterCreationData returns the metadata needed for character creation UI.
	// This includes available priorities, metatypes, creation methods, etc.
	GetCharacterCreationData() (*domain.CharacterCreationData, error)
}

