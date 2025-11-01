package jsonrepo

import (
	"fmt"
	"shadowmaster/internal/domain"
	"shadowmaster/pkg/storage"
	"time"

	"github.com/google/uuid"
)

// CharacterRepositoryJSON implements CharacterRepository using JSON files
type CharacterRepositoryJSON struct {
	store *storage.JSONStore
	index *Index
}

// NewCharacterRepository creates a new JSON-based character repository
func NewCharacterRepository(store *storage.JSONStore, index *Index) *CharacterRepositoryJSON {
	return &CharacterRepositoryJSON{
		store: store,
		index: index,
	}
}

// Create creates a new character
func (r *CharacterRepositoryJSON) Create(character *domain.Character) error {
	if character.ID == "" {
		character.ID = uuid.New().String()
	}
	character.CreatedAt = time.Now()
	character.UpdatedAt = time.Now()

	filename := fmt.Sprintf("characters/%s.json", character.ID)
	if err := r.store.Write(filename, character); err != nil {
		return err
	}

	r.index.mu.Lock()
	r.index.Characters[character.ID] = filename
	r.index.mu.Unlock()

	return r.saveIndex()
}

// GetByID retrieves a character by ID
func (r *CharacterRepositoryJSON) GetByID(id string) (*domain.Character, error) {
	r.index.mu.RLock()
	filename, exists := r.index.Characters[id]
	r.index.mu.RUnlock()

	if !exists {
		return nil, fmt.Errorf("character not found: %s", id)
	}

	var character domain.Character
	if err := r.store.Read(filename, &character); err != nil {
		return nil, err
	}

	return &character, nil
}

// GetAll retrieves all characters
func (r *CharacterRepositoryJSON) GetAll() ([]*domain.Character, error) {
	r.index.mu.RLock()
	characterMap := make(map[string]string)
	for k, v := range r.index.Characters {
		characterMap[k] = v
	}
	r.index.mu.RUnlock()

	characters := make([]*domain.Character, 0) // Ensure non-nil empty slice
	for _, filename := range characterMap {
		var character domain.Character
		if err := r.store.Read(filename, &character); err != nil {
			continue // Skip files that can't be read
		}
		characters = append(characters, &character)
	}

	return characters, nil
}

// Update updates an existing character
func (r *CharacterRepositoryJSON) Update(character *domain.Character) error {
	r.index.mu.RLock()
	_, exists := r.index.Characters[character.ID]
	r.index.mu.RUnlock()

	if !exists {
		return fmt.Errorf("character not found: %s", character.ID)
	}

	character.UpdatedAt = time.Now()
	filename := fmt.Sprintf("characters/%s.json", character.ID)
	return r.store.Write(filename, character)
}

// Delete deletes a character
func (r *CharacterRepositoryJSON) Delete(id string) error {
	r.index.mu.RLock()
	filename, exists := r.index.Characters[id]
	r.index.mu.RUnlock()

	if !exists {
		return fmt.Errorf("character not found: %s", id)
	}

	if err := r.store.Delete(filename); err != nil {
		return err
	}

	r.index.mu.Lock()
	delete(r.index.Characters, id)
	r.index.mu.Unlock()

	return r.saveIndex()
}

// saveIndex saves the index file
func (r *CharacterRepositoryJSON) saveIndex() error {
	return r.store.Write("index.json", r.index)
}
