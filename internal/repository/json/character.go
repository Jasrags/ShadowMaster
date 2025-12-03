package json

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	"shadowmaster/internal/domain"
)

type CharacterRepository struct {
	dataPath string
	mu       sync.RWMutex
	index    *characterIndexData
}

type characterIndexData struct {
	Characters     map[string]string   `json:"characters"`
	UserCharacters map[string][]string `json:"user_characters"`
}

type storedCharacter struct {
	ID                string                      `json:"id"`
	Name              string                      `json:"name"`
	Description       string                      `json:"description"`
	Age               string                      `json:"age"`
	Gender            string                      `json:"gender"`
	Height            string                      `json:"height"`
	Weight            string                      `json:"weight"`
	State             string                      `json:"state"`
	UserID            string                      `json:"user_id"`
	Attributes        domain.Attributes           `json:"attributes"`
	EditionData       domain.EditionData          `json:"edition_data"`
	PriorityAssignment *domain.PriorityAssignment `json:"priority_assignment,omitempty"`
	CreatedAt         string                      `json:"created_at"`
	UpdatedAt         string                      `json:"updated_at"`
	DeletedAt         *string                     `json:"deleted_at,omitempty"`
}

func NewCharacterRepository(dataPath string) (*CharacterRepository, error) {
	repo := &CharacterRepository{
		dataPath: dataPath,
		index: &characterIndexData{
			Characters:     make(map[string]string),
			UserCharacters: make(map[string][]string),
		},
	}

	// Ensure data directory exists
	if err := os.MkdirAll(filepath.Join(dataPath, "characters"), 0755); err != nil {
		return nil, fmt.Errorf("failed to create characters directory: %w", err)
	}

	// Load index
	if err := repo.loadIndex(); err != nil {
		return nil, fmt.Errorf("failed to load index: %w", err)
	}

	return repo, nil
}

func (r *CharacterRepository) loadIndex() error {
	indexPath := filepath.Join(r.dataPath, "index.json")

	data, err := os.ReadFile(indexPath)
	if err != nil {
		if os.IsNotExist(err) {
			// Index doesn't exist yet, start with empty index
			return nil
		}
		return err
	}

	var fullIndex map[string]interface{}
	if err := json.Unmarshal(data, &fullIndex); err != nil {
		return err
	}

	// Extract character-related data
	if chars, ok := fullIndex["characters"].(map[string]interface{}); ok {
		for k, v := range chars {
			if str, ok := v.(string); ok {
				r.index.Characters[k] = str
			}
		}
	}

	if userChars, ok := fullIndex["user_characters"].(map[string]interface{}); ok {
		r.index.UserCharacters = make(map[string][]string)
		for k, v := range userChars {
			if arr, ok := v.([]interface{}); ok {
				ids := make([]string, 0, len(arr))
				for _, id := range arr {
					if str, ok := id.(string); ok {
						ids = append(ids, str)
					}
				}
				r.index.UserCharacters[k] = ids
			}
		}
	}

	return nil
}

func (r *CharacterRepository) saveIndex() error {
	indexPath := filepath.Join(r.dataPath, "index.json")

	// Read existing index to preserve other data
	var fullIndex map[string]interface{}
	data, err := os.ReadFile(indexPath)
	if err == nil {
		json.Unmarshal(data, &fullIndex)
	}
	if fullIndex == nil {
		fullIndex = make(map[string]interface{})
	}

	// Update character-related fields
	fullIndex["characters"] = r.index.Characters
	fullIndex["user_characters"] = r.index.UserCharacters

	// Write back
	data, err = json.MarshalIndent(fullIndex, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(indexPath, data, 0644)
}

func (r *CharacterRepository) Create(character *domain.Character) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	// Check if character already exists
	if _, exists := r.index.Characters[character.ID]; exists {
		return fmt.Errorf("character already exists: %s", character.ID)
	}

	// Store character file
	characterPath := filepath.Join(r.dataPath, "characters", character.ID+".json")
	stored := storedCharacter{
		ID:                character.ID,
		Name:              character.Name,
		Description:       character.Description,
		Age:               character.Age,
		Gender:            character.Gender,
		Height:            character.Height,
		Weight:            character.Weight,
		State:             string(character.State),
		UserID:            character.UserID,
		Attributes:        character.Attributes,
		EditionData:       character.EditionData,
		PriorityAssignment: character.PriorityAssignment,
		CreatedAt:         character.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:         character.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
	if character.DeletedAt != nil {
		deletedAtStr := character.DeletedAt.Format("2006-01-02T15:04:05Z07:00")
		stored.DeletedAt = &deletedAtStr
	}

	data, err := json.MarshalIndent(stored, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal character: %w", err)
	}

	if err := os.WriteFile(characterPath, data, 0644); err != nil {
		return fmt.Errorf("failed to write character file: %w", err)
	}

	// Update index
	r.index.Characters[character.ID] = characterPath

	// Update user characters mapping
	if r.index.UserCharacters == nil {
		r.index.UserCharacters = make(map[string][]string)
	}
	r.index.UserCharacters[character.UserID] = append(r.index.UserCharacters[character.UserID], character.ID)

	if err := r.saveIndex(); err != nil {
		// Try to clean up file if index save fails
		os.Remove(characterPath)
		return fmt.Errorf("failed to save index: %w", err)
	}

	return nil
}

func (r *CharacterRepository) GetByID(id string) (*domain.Character, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	filePath, exists := r.index.Characters[id]
	if !exists {
		return nil, errors.New("character not found")
	}

	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read character file: %w", err)
	}

	var stored storedCharacter
	if err := json.Unmarshal(data, &stored); err != nil {
		return nil, fmt.Errorf("failed to unmarshal character: %w", err)
	}

	return r.storedToDomain(&stored)
}

func (r *CharacterRepository) GetByUserID(userID string) ([]*domain.Character, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	characterIDs, exists := r.index.UserCharacters[userID]
	if !exists {
		return []*domain.Character{}, nil
	}

	characters := make([]*domain.Character, 0, len(characterIDs))
	for _, id := range characterIDs {
		filePath, exists := r.index.Characters[id]
		if !exists {
			continue // Skip if file doesn't exist
		}

		data, err := os.ReadFile(filePath)
		if err != nil {
			continue // Skip files that can't be read
		}

		var stored storedCharacter
		if err := json.Unmarshal(data, &stored); err != nil {
			continue // Skip invalid files
		}

		// Skip deleted characters
		if stored.DeletedAt != nil {
			continue
		}

		character, err := r.storedToDomain(&stored)
		if err != nil {
			continue // Skip invalid characters
		}

		characters = append(characters, character)
	}

	return characters, nil
}

func (r *CharacterRepository) Update(character *domain.Character) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	// Check if character exists
	filePath, exists := r.index.Characters[character.ID]
	if !exists {
		return errors.New("character not found")
	}

	// Load existing character to preserve data
	data, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("failed to read character file: %w", err)
	}

	var stored storedCharacter
	if err := json.Unmarshal(data, &stored); err != nil {
		return fmt.Errorf("failed to unmarshal character: %w", err)
	}

	// Update fields
	stored.Name = character.Name
	stored.Description = character.Description
	stored.Age = character.Age
	stored.Gender = character.Gender
	stored.Height = character.Height
	stored.Weight = character.Weight
	stored.State = string(character.State)
	stored.Attributes = character.Attributes
	stored.EditionData = character.EditionData
	stored.PriorityAssignment = character.PriorityAssignment
	stored.UpdatedAt = character.UpdatedAt.Format("2006-01-02T15:04:05Z07:00")
	if character.DeletedAt != nil {
		deletedAtStr := character.DeletedAt.Format("2006-01-02T15:04:05Z07:00")
		stored.DeletedAt = &deletedAtStr
	} else {
		stored.DeletedAt = nil
	}

	// Write back
	data, err = json.MarshalIndent(stored, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal character: %w", err)
	}

	return os.WriteFile(filePath, data, 0644)
}

func (r *CharacterRepository) Delete(id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	// Check if character exists
	stored, err := r.GetByID(id)
	if err != nil {
		return err
	}

	// Soft delete: set deleted_at timestamp
	now := time.Now()
	stored.DeletedAt = &now
	stored.UpdatedAt = now

	return r.Update(stored)
}

func (r *CharacterRepository) storedToDomain(stored *storedCharacter) (*domain.Character, error) {
	createdAt, err := time.Parse("2006-01-02T15:04:05Z07:00", stored.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("invalid created_at: %w", err)
	}

	updatedAt, err := time.Parse("2006-01-02T15:04:05Z07:00", stored.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("invalid updated_at: %w", err)
	}

	var deletedAt *time.Time
	if stored.DeletedAt != nil {
		deletedAtTime, err := time.Parse("2006-01-02T15:04:05Z07:00", *stored.DeletedAt)
		if err != nil {
			return nil, fmt.Errorf("invalid deleted_at: %w", err)
		}
		deletedAt = &deletedAtTime
	}

	return &domain.Character{
		ID:                stored.ID,
		Name:              stored.Name,
		Description:       stored.Description,
		Age:               stored.Age,
		Gender:            stored.Gender,
		Height:            stored.Height,
		Weight:            stored.Weight,
		State:             domain.CharacterState(stored.State),
		UserID:            stored.UserID,
		Attributes:        stored.Attributes,
		EditionData:       stored.EditionData,
		PriorityAssignment: stored.PriorityAssignment,
		CreatedAt:         createdAt,
		UpdatedAt:         updatedAt,
		DeletedAt:         deletedAt,
	}, nil
}
