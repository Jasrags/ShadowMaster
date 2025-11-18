package service

import (
	"fmt"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
	edition "shadowmaster/pkg/shadowrun/edition"
	v3 "shadowmaster/pkg/shadowrun/edition/v3"
)

// CharacterService handles character business logic
type CharacterService struct {
	characterRepo repository.CharacterRepository
}

// NewCharacterService creates a new character service
func NewCharacterService(characterRepo repository.CharacterRepository) *CharacterService {
	return &CharacterService{
		characterRepo: characterRepo,
	}
}

// CreateCharacter creates a new character using the edition registry.
// The edition parameter determines which edition handler to use.
func (s *CharacterService) CreateCharacter(editionID, name, playerName string, creationData interface{}) (*domain.Character, error) {
	// Get the edition handler
	handler, err := edition.GetHandler(editionID)
	if err != nil {
		return nil, fmt.Errorf("failed to get edition handler: %w", err)
	}

	// Create character using the handler
	character, err := handler.CreateCharacter(name, playerName, creationData)
	if err != nil {
		return nil, fmt.Errorf("failed to create character: %w", err)
	}

	// Validate the character
	if err := handler.ValidateCharacter(character); err != nil {
		return nil, fmt.Errorf("character validation failed: %w", err)
	}

	// Save character
	if err := s.characterRepo.Create(character); err != nil {
		return nil, fmt.Errorf("failed to save character: %w", err)
	}

	return character, nil
}

// CreateSR3Character creates a new Shadowrun 3rd edition character.
// This method is kept for backward compatibility and delegates to the edition registry.
// Deprecated: Use CreateCharacter instead for a more generic approach.
func (s *CharacterService) CreateSR3Character(name, playerName string, priorities v3.PrioritySelection) (*domain.Character, error) {
	return s.CreateCharacter("sr3", name, playerName, priorities)
}
