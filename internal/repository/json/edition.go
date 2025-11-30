package jsonrepo

import (
	"fmt"
	"log"
	"path/filepath"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
	v3 "shadowmaster/pkg/shadowrun/edition/v3"
	v5 "shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/storage"
)

const (
	campaignSupportFilename = "campaign_support.json"
)

type editionRepository struct {
	store *storage.JSONStore
}

// NewEditionRepository creates a repository that reads edition metadata from Go code.
// Campaign support data may optionally be loaded from JSON files if they exist.
func NewEditionRepository(store *storage.JSONStore) repository.EditionDataRepository {
	return &editionRepository{store: store}
}

// GetCharacterCreationData loads character creation data for the requested edition key.
// All data comes from Go code as the source of truth. Campaign support may be loaded from JSON if available.
func (r *editionRepository) GetCharacterCreationData(edition string) (*domain.CharacterCreationData, error) {
	if edition == "" {
		return nil, fmt.Errorf("edition key is required")
	}

	var data *domain.CharacterCreationData

	// Generate data entirely from Go code based on edition
	switch edition {
	case "sr5":
		data = v5.GetCharacterCreationDataFromGo()
	case "sr3":
		data = v3.GetCharacterCreationDataFromGo()
	default:
		return nil, fmt.Errorf("unsupported edition: %s (only sr3 and sr5 are supported)", edition)
	}

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
