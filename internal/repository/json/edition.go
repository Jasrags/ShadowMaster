package jsonrepo

import (
	"fmt"
	"path/filepath"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
	"shadowmaster/pkg/storage"
)

const characterCreationFilename = "character_creation.json"

type editionRepository struct {
	store *storage.JSONStore
}

// NewEditionRepository creates a repository that reads edition metadata from JSON files.
func NewEditionRepository(store *storage.JSONStore) repository.EditionDataRepository {
	return &editionRepository{store: store}
}

// GetCharacterCreationData loads character creation data for the requested edition key.
func (r *editionRepository) GetCharacterCreationData(edition string) (*domain.CharacterCreationData, error) {
	if edition == "" {
		return nil, fmt.Errorf("edition key is required")
	}

	path := filepath.Join("editions", edition, characterCreationFilename)
	var data domain.CharacterCreationData
	if err := r.store.Read(path, &data); err != nil {
		return nil, fmt.Errorf("failed to load character creation data for %s: %w", edition, err)
	}

	return &data, nil
}
