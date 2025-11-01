package service

import (
	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
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

// CreateSR3Character creates a new Shadowrun 3rd edition character
func (s *CharacterService) CreateSR3Character(name, playerName string, priorities PrioritySelection) (*domain.Character, error) {
	// Create base character
	character := &domain.Character{
		Name:       name,
		PlayerName: playerName,
		Edition:    "sr3",
	}

	// Initialize SR3 data
	sr3Data := &domain.CharacterSR3{
		MagicPriority:     priorities.Magic,
		RacePriority:      priorities.Race,
		AttrPriority:      priorities.Attributes,
		SkillsPriority:    priorities.Skills,
		ResourcesPriority: priorities.Resources,

		ActiveSkills:    make(map[string]domain.Skill),
		KnowledgeSkills: make(map[string]domain.Skill),
		Weapons:         []domain.Weapon{},
		Armor:           []domain.Armor{},
		Cyberware:       []domain.Cyberware{},
		Bioware:         []domain.Bioware{},
		Gear:            []domain.Item{},
		Vehicles:        []domain.Vehicle{},
		Spells:          []domain.Spell{},
		Focuses:         []domain.Focus{},
		Spirits:         []domain.Spirit{},
		Contacts:        []domain.Contact{},

		Reputation: domain.Reputation{
			StreetCred:      0,
			Notoriety:       0,
			PublicAwareness: 0,
		},

		Karma:      0,
		TotalKarma: 0,
		Nuyen:      getResourcesPriority(priorities.Resources),
	}

	// Apply priority-based character creation
	if err := applyPriorities(sr3Data, priorities); err != nil {
		return nil, err
	}

	// Calculate derived attributes
	sr3Data.Reaction = sr3Data.Quickness + sr3Data.Intelligence
	sr3Data.Essence = 6.0 // Starting essence

	character.EditionData = sr3Data

	// Save character
	if err := s.characterRepo.Create(character); err != nil {
		return nil, err
	}

	return character, nil
}

// PrioritySelection holds character creation priorities
type PrioritySelection struct {
	Magic      string // A-E or "None"
	Race       string // A-E
	Attributes string // A-E
	Skills     string // A-E
	Resources  string // A-E
}

// applyPriorities applies priority system to character
func applyPriorities(char *domain.CharacterSR3, priorities PrioritySelection) error {
	// Apply race priority (metatype selection)
	metatype, attrMods, err := getMetatypeFromPriority(priorities.Race)
	if err != nil {
		return err
	}
	char.Metatype = metatype
	char.Body += attrMods.Body
	char.Quickness += attrMods.Quickness
	char.Strength += attrMods.Strength
	char.Charisma += attrMods.Charisma
	char.Intelligence += attrMods.Intelligence
	char.Willpower += attrMods.Willpower

	// Apply attribute priority
	attrPoints := getAttributePriority(priorities.Attributes)
	char.Body += attrPoints.Body
	char.Quickness += attrPoints.Quickness
	char.Strength += attrPoints.Strength
	char.Charisma += attrPoints.Charisma
	char.Intelligence += attrPoints.Intelligence
	char.Willpower += attrPoints.Willpower

	// Apply skills priority
	char.SkillsPriority = priorities.Skills

	// Apply magic priority
	if priorities.Magic != "None" {
		char.MagicRating = getMagicRatingFromPriority(priorities.Magic)
		char.MagicPriority = priorities.Magic
	}

	return nil
}

// MetatypeModifiers holds attribute modifications for metatypes
type MetatypeModifiers struct {
	Body         int
	Quickness    int
	Strength     int
	Charisma     int
	Intelligence int
	Willpower    int
}

// getMetatypeFromPriority returns metatype and modifiers based on priority
func getMetatypeFromPriority(priority string) (string, MetatypeModifiers, error) {
	// Simplified: Human is default, higher priorities allow other metatypes
	mods := MetatypeModifiers{} // Human has no modifiers

	switch priority {
	case "A", "B":
		// Allow non-human metatypes
		// For now, default to Human
		return "Human", mods, nil
	default:
		return "Human", mods, nil
	}
}

// AttributePoints holds attribute point allocation
type AttributePoints struct {
	Body         int
	Quickness    int
	Strength     int
	Charisma     int
	Intelligence int
	Willpower    int
}

// getAttributePriority returns attribute points based on priority
func getAttributePriority(priority string) AttributePoints {
	switch priority {
	case "A":
		return AttributePoints{Body: 6, Quickness: 6, Strength: 6, Charisma: 6, Intelligence: 6, Willpower: 6}
	case "B":
		return AttributePoints{Body: 4, Quickness: 4, Strength: 4, Charisma: 4, Intelligence: 4, Willpower: 4}
	case "C":
		return AttributePoints{Body: 3, Quickness: 3, Strength: 3, Charisma: 3, Intelligence: 3, Willpower: 3}
	case "D":
		return AttributePoints{Body: 2, Quickness: 2, Strength: 2, Charisma: 2, Intelligence: 2, Willpower: 2}
	case "E":
		return AttributePoints{Body: 1, Quickness: 1, Strength: 1, Charisma: 1, Intelligence: 1, Willpower: 1}
	default:
		return AttributePoints{}
	}
}

// getMagicRatingFromPriority returns magic rating based on priority
func getMagicRatingFromPriority(priority string) int {
	switch priority {
	case "A":
		return 6
	case "B":
		return 4
	case "C":
		return 2
	default:
		return 0
	}
}

// getResourcesPriority returns starting nuyen based on priority
func getResourcesPriority(priority string) int {
	switch priority {
	case "A":
		return 400000
	case "B":
		return 275000
	case "C":
		return 175000
	case "D":
		return 100000
	case "E":
		return 50000
	default:
		return 0
	}
}
