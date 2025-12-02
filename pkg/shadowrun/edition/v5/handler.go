package v5

import (
	"fmt"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
	edition "shadowmaster/pkg/shadowrun/edition"
)

// SR5Handler implements the EditionHandler interface for Shadowrun 5th Edition
type SR5Handler struct {
	editionRepo repository.EditionDataRepository
}

// NewSR5Handler creates a new SR5 edition handler
func NewSR5Handler(editionRepo repository.EditionDataRepository) edition.EditionHandler {
	return &SR5Handler{
		editionRepo: editionRepo,
	}
}

// Edition returns the edition identifier
func (h *SR5Handler) Edition() string {
	return "sr5"
}

// CreateCharacter creates a new SR5 character using the provided creation data.
// The creationData parameter can be:
// - PrioritySelection for Priority method
// - SumToTenSelection for Sum-to-Ten method
// - KarmaSelection for Karma Point-Buy method
func (h *SR5Handler) CreateCharacter(name, playerName string, creationData interface{}) (*domain.Character, error) {
	// Create base character
	character := &domain.Character{
		Name:       name,
		PlayerName: playerName,
		Edition:    "sr5",
		Status:     "Creation",
	}

	// Initialize SR5 data structure
	sr5Data := &domain.CharacterSR5{
		ActiveSkills:    make(map[string]domain.Skill),
		KnowledgeSkills: make(map[string]domain.Skill),
		LanguageSkills:  make(map[string]domain.Skill),
		Weapons:         []domain.Weapon{},
		Armor:           []domain.Armor{},
		Cyberware:       []domain.Cyberware{},
		Bioware:         []domain.Bioware{},
		Gear:            []domain.Item{},
		Vehicles:        []domain.Vehicle{},
		Spells:          []domain.Spell{},
		ComplexForms:    []domain.ComplexForm{},
		Focuses:        []domain.Focus{},
		Spirits:         []domain.Spirit{},
		AdeptPowers:     []domain.AdeptPower{},
		Contacts:        []domain.Contact{},
		PositiveQualities: []domain.Quality{},
		NegativeQualities: []domain.Quality{},
		Reputation: domain.Reputation{
			StreetCred:      0,
			Notoriety:       0,
			PublicAwareness: 0,
		},
		Essence: 6.0, // Starting essence
		Karma:   0,
		Nuyen:   0,
	}

	// Determine creation method and process accordingly
	switch data := creationData.(type) {
	case map[string]interface{}:
		// Handle JSON unmarshaling case
		creationMethod, _ := data["creation_method"].(string)
		if creationMethod == "" {
			creationMethod = "priority" // Default
		}
		sr5Data.CreationMethod = creationMethod

		switch creationMethod {
		case "priority":
			if err := h.applyPriorityMethod(sr5Data, data); err != nil {
				return nil, fmt.Errorf("priority method failed: %w", err)
			}
		case "sum_to_ten":
			if err := h.applySumToTenMethod(sr5Data, data); err != nil {
				return nil, fmt.Errorf("sum-to-ten method failed: %w", err)
			}
		case "karma":
			if err := h.applyKarmaMethod(sr5Data, data); err != nil {
				return nil, fmt.Errorf("karma method failed: %w", err)
			}
		default:
			return nil, fmt.Errorf("unknown creation method: %s", creationMethod)
		}
	case PrioritySelection:
		sr5Data.CreationMethod = "priority"
		if err := h.applyPrioritySelection(sr5Data, data); err != nil {
			return nil, fmt.Errorf("priority selection failed: %w", err)
		}
	case SumToTenSelection:
		sr5Data.CreationMethod = "sum_to_ten"
		// For struct case, extract values (currently struct doesn't have special attributes, so pass nil)
		// This path is typically not used from frontend (which sends map), but kept for compatibility
		if err := h.applySumToTenSelection(sr5Data, data, "", "", nil, nil, nil); err != nil {
			return nil, fmt.Errorf("sum-to-ten selection failed: %w", err)
		}
	case KarmaSelection:
		sr5Data.CreationMethod = "karma"
		if err := h.applyKarmaSelection(sr5Data, data); err != nil {
			return nil, fmt.Errorf("karma selection failed: %w", err)
		}
	default:
		return nil, fmt.Errorf("invalid creation data type for SR5: expected PrioritySelection, SumToTenSelection, KarmaSelection, or map, got %T", creationData)
	}

	// Apply final calculations (this can fail with zero values, but that's okay for initial creation)
	// We'll calculate derived attributes later when the character has actual values
	if err := h.calculateDerivedAttributes(sr5Data); err != nil {
		// Log the error but don't fail - characters in "Creation" status may have zero values
		// The calculations will be done when the character is properly filled in
		_ = err // Ignore calculation errors for characters in creation
	}

	// Always set the SR5 data, even if calculations failed
	character.SetSR5Data(sr5Data)
	
	// Ensure edition is set
	character.Edition = "sr5"
	
	return character, nil
}

// ValidateCharacter validates that a character conforms to SR5 rules
func (h *SR5Handler) ValidateCharacter(character *domain.Character) error {
	if character.Edition != "sr5" {
		return fmt.Errorf("character is not SR5 edition (got: %s)", character.Edition)
	}

	sr5Data, err := character.GetSR5Data()
	if err != nil {
		return fmt.Errorf("invalid SR5 character data: %w", err)
	}

	return h.validateSR5Character(sr5Data)
}

// GetCharacterCreationData returns the metadata needed for SR5 character creation UI
func (h *SR5Handler) GetCharacterCreationData() (*domain.CharacterCreationData, error) {
	if h.editionRepo == nil {
		return nil, fmt.Errorf("edition repository not available")
	}
	return h.editionRepo.GetCharacterCreationData("sr5")
}

