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

	// ALWAYS ensure character has required data - don't trust the handler
	// This is defensive programming to ensure data integrity
	character.Edition = editionID
	character.Name = name
	if character.Status == "" {
		character.Status = "Creation"
	}

	// ALWAYS ensure edition_data is set for SR5 characters
	// Check if it's nil or if it's not the right type
	if editionID == "sr5" {
		needsSR5Data := false
		if character.EditionData == nil {
			needsSR5Data = true
		} else {
			// Try to get SR5 data to verify it's actually set
			_, err := character.GetSR5Data()
			if err != nil {
				needsSR5Data = true
			}
		}

		if needsSR5Data {
			// Create minimal SR5 data structure
			sr5Data := &domain.CharacterSR5{
				ActiveSkills:    make(map[string]domain.Skill),
				KnowledgeSkills: make(map[string]domain.Skill),
				LanguageSkills:  make(map[string]domain.Skill),
				Essence:         6.0,
			}
			// Try to extract creation_method and gameplay_level from creationData
			if dataMap, ok := creationData.(map[string]interface{}); ok {
				if cm, ok := dataMap["creation_method"].(string); ok && cm != "" {
					sr5Data.CreationMethod = cm
				} else {
					sr5Data.CreationMethod = "priority"
				}
				if gl, ok := dataMap["gameplay_level"].(string); ok && gl != "" {
					sr5Data.GameplayLevel = gl
				} else {
					sr5Data.GameplayLevel = "experienced"
				}
			} else {
				sr5Data.CreationMethod = "priority"
				sr5Data.GameplayLevel = "experienced"
			}
			character.SetSR5Data(sr5Data)
		}
	}

	// Skip validation for characters in "Creation" status (they're incomplete)
	// Validation will be performed when the character is completed
	if character.Status != "Creation" {
		// Validate the character
		if err := handler.ValidateCharacter(character); err != nil {
			return nil, fmt.Errorf("character validation failed: %w", err)
		}
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
