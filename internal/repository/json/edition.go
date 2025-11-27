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
// For SR5, priority data comes from Go code (priority_data.go) as the source of truth.
func (r *editionRepository) GetCharacterCreationData(edition string) (*domain.CharacterCreationData, error) {
	if edition == "" {
		return nil, fmt.Errorf("edition key is required")
	}

	path := filepath.Join("editions", edition, characterCreationFilename)
	var data domain.CharacterCreationData
	if err := r.store.Read(path, &data); err != nil {
		return nil, fmt.Errorf("failed to load character creation data for %s: %w", edition, err)
	}

	// For SR5, replace priority data with Go code source of truth
	// Always ensure priorities are set, even if JSON doesn't have them
	if edition == "sr5" {
		priorities := v5.GetPrioritiesForAPI()
		// Always set priorities from Go code for SR5, even if JSON had them
		// This ensures Go code is the single source of truth
		if len(priorities) == 0 {
			// This should never happen, but log it if it does
			log.Printf("WARNING: GetPrioritiesForAPI() returned empty for edition %s", edition)
			// Fallback: ensure priorities is at least an empty map, not nil
			data.Priorities = make(map[string]map[string]domain.PriorityOption)
		} else {
			data.Priorities = priorities
		}
	} else if data.Priorities == nil {
		// For other editions, ensure priorities is initialized if missing
		data.Priorities = make(map[string]map[string]domain.PriorityOption)
	}

	// Final safety check: ensure priorities is never nil
	if data.Priorities == nil {
		data.Priorities = make(map[string]map[string]domain.PriorityOption)
	}

	if supportPath := filepath.Join("editions", edition, campaignSupportFilename); r.store.Exists(supportPath) {
		var support domain.CampaignSupport
		if err := r.store.Read(supportPath, &support); err != nil {
			return nil, fmt.Errorf("failed to load campaign support data for %s: %w", edition, err)
		}
		data.CampaignSupport = &support
	}

	return &data, nil
}
