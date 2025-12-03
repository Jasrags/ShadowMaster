package service

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"time"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
)

var (
	ErrCharacterNotFound = errors.New("character not found")
)

type CharacterService struct {
	repo repository.CharacterRepository
}

func NewCharacterService(repo repository.CharacterRepository) *CharacterService {
	return &CharacterService{repo: repo}
}

func (s *CharacterService) CreateCharacter(userID string, name string, editionData domain.EditionData) (*domain.Character, error) {
	// Generate ID using the same method as user service
	id := s.generateCharacterID()

	// Set timestamps
	now := time.Now()

	// Create character with initial state
	character := &domain.Character{
		ID:          id,
		Name:        name,
		UserID:      userID,
		State:       domain.CharacterStateCreation,
		EditionData: editionData,
		CreatedAt:   now,
		UpdatedAt:   now,
		Attributes: domain.Attributes{
			Body:      domain.IntAttribute{Min: 1, Max: 9, Value: 1},
			Agility:   domain.IntAttribute{Min: 1, Max: 9, Value: 1},
			Reaction:  domain.IntAttribute{Min: 1, Max: 9, Value: 1},
			Strength:  domain.IntAttribute{Min: 1, Max: 9, Value: 1},
			Willpower: domain.IntAttribute{Min: 1, Max: 9, Value: 1},
			Logic:     domain.IntAttribute{Min: 1, Max: 9, Value: 1},
			Intuition: domain.IntAttribute{Min: 1, Max: 9, Value: 1},
			Charisma:  domain.IntAttribute{Min: 1, Max: 9, Value: 1},
			Magic:     domain.IntAttribute{Min: 0, Max: 6, Value: 0},
			Resonance: domain.IntAttribute{Min: 0, Max: 6, Value: 0},
			Edge:      domain.IntAttribute{Min: 1, Max: 7, Value: 1},
			Essence:   domain.FloatAttribute{Min: 0.0, Max: 6.0, Value: 6.0},
		},
	}

	if err := s.repo.Create(character); err != nil {
		return nil, err
	}

	return character, nil
}

func (s *CharacterService) GetCharacter(characterID string) (*domain.Character, error) {
	character, err := s.repo.GetByID(characterID)
	if err != nil {
		return nil, ErrCharacterNotFound
	}
	return character, nil
}

func (s *CharacterService) GetCharactersByUserID(userID string) ([]*domain.Character, error) {
	return s.repo.GetByUserID(userID)
}

func (s *CharacterService) UpdateCharacter(character *domain.Character) error {
	// Get the current character to compare metatype changes
	currentCharacter, err := s.repo.GetByID(character.ID)
	if err != nil {
		return err
	}

	// Check if metatype has changed
	var metatypeID string
	if character.PriorityAssignment != nil {
		metatypeID = character.PriorityAssignment.SelectedMetatype
	}

	var previousMetatypeID string
	if currentCharacter.PriorityAssignment != nil {
		previousMetatypeID = currentCharacter.PriorityAssignment.SelectedMetatype
	}

	// Apply metatype attributes if metatype changed or was cleared
	if metatypeID != previousMetatypeID {
		if err := s.ApplyMetatypeAttributes(character, metatypeID); err != nil {
			return err
		}
	}

	character.UpdatedAt = time.Now()
	return s.repo.Update(character)
}

func (s *CharacterService) DeleteCharacter(characterID string) error {
	return s.repo.Delete(characterID)
}

// ApplyMetatypeAttributes applies metatype attribute ranges to a character
// If metatypeID is empty, it clears the metatype-specific attribute ranges
func (s *CharacterService) ApplyMetatypeAttributes(character *domain.Character, metatypeID string) error {
	if metatypeID == "" {
		// Clear metatype-specific attributes (reset to defaults)
		character.Attributes.Body.Min = 1
		character.Attributes.Body.Max = 9
		character.Attributes.Agility.Min = 1
		character.Attributes.Agility.Max = 9
		character.Attributes.Reaction.Min = 1
		character.Attributes.Reaction.Max = 9
		character.Attributes.Strength.Min = 1
		character.Attributes.Strength.Max = 9
		character.Attributes.Willpower.Min = 1
		character.Attributes.Willpower.Max = 9
		character.Attributes.Logic.Min = 1
		character.Attributes.Logic.Max = 9
		character.Attributes.Intuition.Min = 1
		character.Attributes.Intuition.Max = 9
		character.Attributes.Charisma.Min = 1
		character.Attributes.Charisma.Max = 9
		character.Attributes.Edge.Min = 1
		character.Attributes.Edge.Max = 7
		character.Attributes.Magic.Min = 0
		character.Attributes.Magic.Max = 6
		character.Attributes.Essence.Min = 0.0
		character.Attributes.Essence.Max = 6.0
		character.Attributes.Essence.Value = 6.0
		return nil
	}

	// Look up metatype
	metatype, exists := domain.AllMetatypes[metatypeID]
	if !exists {
		return errors.New("metatype not found")
	}

	// Apply attribute ranges from metatype
	character.Attributes.Body.Min = metatype.Body.Min
	character.Attributes.Body.Max = metatype.Body.Max
	character.Attributes.Agility.Min = metatype.Agility.Min
	character.Attributes.Agility.Max = metatype.Agility.Max
	character.Attributes.Reaction.Min = metatype.Reaction.Min
	character.Attributes.Reaction.Max = metatype.Reaction.Max
	character.Attributes.Strength.Min = metatype.Strength.Min
	character.Attributes.Strength.Max = metatype.Strength.Max
	character.Attributes.Willpower.Min = metatype.Willpower.Min
	character.Attributes.Willpower.Max = metatype.Willpower.Max
	character.Attributes.Logic.Min = metatype.Logic.Min
	character.Attributes.Logic.Max = metatype.Logic.Max
	character.Attributes.Intuition.Min = metatype.Intuition.Min
	character.Attributes.Intuition.Max = metatype.Intuition.Max
	character.Attributes.Charisma.Min = metatype.Charisma.Min
	character.Attributes.Charisma.Max = metatype.Charisma.Max

	// Handle Edge vs Magic based on metatype category
	if metatype.Category == domain.MetatypeCategoryShapeshifter {
		// Shapeshifters use Magic instead of Edge
		character.Attributes.Magic.Min = metatype.Magic.Min
		character.Attributes.Magic.Max = metatype.Magic.Max
		// Clear Edge ranges for shapeshifters
		character.Attributes.Edge.Min = 0
		character.Attributes.Edge.Max = 0
	} else {
		// Standard metatypes and metavariants use Edge
		character.Attributes.Edge.Min = metatype.Edge.Min
		character.Attributes.Edge.Max = metatype.Edge.Max
		// Magic remains at default for non-shapeshifters
		character.Attributes.Magic.Min = 0
		character.Attributes.Magic.Max = 6
	}

	// Apply Essence
	character.Attributes.Essence.Min = 0.0
	character.Attributes.Essence.Max = metatype.Essence
	character.Attributes.Essence.Value = metatype.Essence

	// Ensure current values are within new ranges
	character.Attributes.Body.Value = clamp(character.Attributes.Body.Value, character.Attributes.Body.Min, character.Attributes.Body.Max)
	character.Attributes.Agility.Value = clamp(character.Attributes.Agility.Value, character.Attributes.Agility.Min, character.Attributes.Agility.Max)
	character.Attributes.Reaction.Value = clamp(character.Attributes.Reaction.Value, character.Attributes.Reaction.Min, character.Attributes.Reaction.Max)
	character.Attributes.Strength.Value = clamp(character.Attributes.Strength.Value, character.Attributes.Strength.Min, character.Attributes.Strength.Max)
	character.Attributes.Willpower.Value = clamp(character.Attributes.Willpower.Value, character.Attributes.Willpower.Min, character.Attributes.Willpower.Max)
	character.Attributes.Logic.Value = clamp(character.Attributes.Logic.Value, character.Attributes.Logic.Min, character.Attributes.Logic.Max)
	character.Attributes.Intuition.Value = clamp(character.Attributes.Intuition.Value, character.Attributes.Intuition.Min, character.Attributes.Intuition.Max)
	character.Attributes.Charisma.Value = clamp(character.Attributes.Charisma.Value, character.Attributes.Charisma.Min, character.Attributes.Charisma.Max)
	character.Attributes.Edge.Value = clamp(character.Attributes.Edge.Value, character.Attributes.Edge.Min, character.Attributes.Edge.Max)
	character.Attributes.Magic.Value = clamp(character.Attributes.Magic.Value, character.Attributes.Magic.Min, character.Attributes.Magic.Max)

	return nil
}

// clamp ensures a value is within min and max bounds
func clamp(value, min, max int) int {
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}

// generateCharacterID creates a simple unique ID (32-character hex string)
func (s *CharacterService) generateCharacterID() string {
	bytes := make([]byte, 16)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}
