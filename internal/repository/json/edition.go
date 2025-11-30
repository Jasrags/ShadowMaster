package jsonrepo

import (
	"fmt"
	"log"
	"path/filepath"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
	v5 "shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/storage"
)

const (
	characterCreationFilename = "character_creation.json"
	campaignSupportFilename   = "campaign_support.json"
)

type editionRepository struct {
	store *storage.JSONStore
}

// NewEditionRepository creates a repository that reads edition metadata from JSON files.
func NewEditionRepository(store *storage.JSONStore) repository.EditionDataRepository {
	return &editionRepository{store: store}
}

// GetCharacterCreationData loads character creation data for the requested edition key.
// For SR5, all data comes from Go code as the source of truth.
func (r *editionRepository) GetCharacterCreationData(edition string) (*domain.CharacterCreationData, error) {
	if edition == "" {
		return nil, fmt.Errorf("edition key is required")
	}

	// For SR5, generate data entirely from Go code
	if edition == "sr5" {
		data := v5.GetCharacterCreationDataFromGo()
		
		// Load campaign support from JSON if it exists (optional)
		supportPath := filepath.Join("editions", edition, campaignSupportFilename)
		if r.store.Exists(supportPath) {
			var support domain.CampaignSupport
			if err := r.store.Read(supportPath, &support); err != nil {
				log.Printf("WARNING: Failed to load campaign support for %s: %v", edition, err)
			} else {
				data.CampaignSupport = &support
			}
		}
		
		return data, nil
	}

	// For other editions, load from JSON file
	path := filepath.Join("editions", edition, characterCreationFilename)
	var data domain.CharacterCreationData
	if err := r.store.Read(path, &data); err != nil {
		return nil, fmt.Errorf("failed to load character creation data for %s: %w", edition, err)
	}

	// Ensure priorities is initialized if missing
	if data.Priorities == nil {
		data.Priorities = make(map[string]map[string]domain.PriorityOption)
	}

	// Load campaign support if it exists
	if supportPath := filepath.Join("editions", edition, campaignSupportFilename); r.store.Exists(supportPath) {
		var support domain.CampaignSupport
		if err := r.store.Read(supportPath, &support); err != nil {
			return nil, fmt.Errorf("failed to load campaign support data for %s: %w", edition, err)
		}
		data.CampaignSupport = &support
	}

	return &data, nil
}
