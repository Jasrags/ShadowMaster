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

	// For SR5, replace priority data and sync metatype special attribute points with Go code source of truth
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

		// Sync metatypes' special_attribute_points from Go code to match priority data
		priorityData := v5.GetPriorityData()
		metatypePriorityData := priorityData.Metatype
		
		// Map Go code metatype names to JSON metatype IDs
		metatypeNameToID := map[string]string{
			"Human": "human",
			"Elf":   "elf",
			"Dwarf": "dwarf",
			"Ork":   "ork",
			"Troll": "troll",
		}

		for i := range data.Metatypes {
			metatype := &data.Metatypes[i]
			metatypeID := metatype.ID
			
			// Find the Go code metatype name for this ID
			var metatypeName string
			for name, id := range metatypeNameToID {
				if id == metatypeID {
					metatypeName = name
					break
				}
			}

			if metatypeName == "" {
				continue // Skip if we can't map this metatype
			}

			// Build special_attribute_points from Go code priority data
			if metatype.SpecialAttributePoints == nil {
				metatype.SpecialAttributePoints = make(map[string]int)
			}

			// For each priority tier this metatype is available in, get the special attribute points
			for _, priority := range []string{"A", "B", "C", "D", "E"} {
				if option, exists := metatypePriorityData[priority]; exists {
					if points, hasPoints := option.Metatypes[metatypeName]; hasPoints {
						metatype.SpecialAttributePoints[priority] = points
					}
				}
			}
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
