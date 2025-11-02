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
		LanguageSkills:  make(map[string]domain.Skill),
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

	// Apply racial special abilities
	applyRacialAbilities(sr3Data)

	// Apply language skills (free native language at rating 6)
	applyLanguageSkills(sr3Data)

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
// Note: This function returns default modifiers. Actual metatype selection should happen
// based on player choice within the allowed metatypes for the priority level.
// This function should be called with the selected metatype name, not the priority.
func getMetatypeFromPriority(priority string) (string, MetatypeModifiers, error) {
	// Simplified: Human is default, higher priorities allow other metatypes
	mods := MetatypeModifiers{} // Human has no modifiers

	switch priority {
	case "A", "B":
		// Allow all metatypes (Human, Elf, Dwarf, Ork, Troll)
		// For now, default to Human - actual selection should be done by player
		return "Human", mods, nil
	case "C":
		// Allow Troll or Elf only
		// For now, default to Elf - actual selection should be done by player
		return "Elf", MetatypeModifiers{Quickness: 1, Charisma: 2}, nil
	case "D":
		// Allow Dwarf or Ork only
		// For now, default to Dwarf - actual selection should be done by player
		return "Dwarf", MetatypeModifiers{Body: 1, Strength: 2, Willpower: 1}, nil
	case "E":
		// Human only
		return "Human", mods, nil
	default:
		return "Human", mods, nil
	}
}

// GetMetatypeModifiers returns attribute modifiers for a given metatype
// Based on the official Shadowrun 3rd Edition Racial Modifications Table
func GetMetatypeModifiers(metatype string) MetatypeModifiers {
	switch metatype {
	case "Human":
		return MetatypeModifiers{} // No modifiers
	case "Dwarf":
		return MetatypeModifiers{
			Body:      1,
			Strength:  2,
			Willpower: 1,
		}
		// Special abilities: Thermographic Vision, Resistance (+2 Body vs disease/toxin)
	case "Elf":
		return MetatypeModifiers{
			Quickness: 1,
			Charisma:  2,
		}
		// Special abilities: Low-light Vision
	case "Ork":
		return MetatypeModifiers{
			Body:        3,
			Strength:    2,
			Charisma:    -1,
			Intelligence: -1,
		}
	case "Troll":
		return MetatypeModifiers{
			Body:         5,
			Quickness:    -1,
			Strength:     4,
			Intelligence: -2,
			Charisma:     -2,
		}
		// Special abilities: Thermographic Vision, +1 Reach for Armed/Unarmed Combat, Dermal Armor (+1 Body)
	default:
		return MetatypeModifiers{} // Default to Human (no modifiers)
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
		return 1000000
	case "B":
		return 400000
	case "C":
		return 90000
	case "D":
		return 20000
	case "E":
		return 5000
	default:
		return 0
	}
}

// applyRacialAbilities applies racial special abilities based on metatype
// This includes adding racial abilities to the RacialAbilities list
// and adding Troll Dermal Armor as inherent cyberware
func applyRacialAbilities(char *domain.CharacterSR3) {
	char.RacialAbilities = []domain.RacialAbility{}

	switch char.Metatype {
	case "Dwarf":
		char.RacialAbilities = append(char.RacialAbilities,
			domain.RacialAbility{
				Name:        "Thermographic Vision",
				Description: "Can see heat signatures",
			},
			domain.RacialAbility{
				Name:        "Resistance",
				Description: "Resistance to disease and toxins",
				Effect:      "+2 Body to any disease or toxin",
			},
		)
	case "Elf":
		char.RacialAbilities = append(char.RacialAbilities,
			domain.RacialAbility{
				Name:        "Low-light Vision",
				Description: "Can see in low-light conditions",
			},
		)
	case "Troll":
		char.RacialAbilities = append(char.RacialAbilities,
			domain.RacialAbility{
				Name:        "Thermographic Vision",
				Description: "Can see heat signatures",
			},
			domain.RacialAbility{
				Name:        "Reach",
				Description: "Increased reach in combat",
				Effect:      "+1 Reach for Armed/Unarmed Combat",
			},
		)
		// Add Troll Dermal Armor as inherent cyberware (no essence cost, no nuyen cost)
		char.Cyberware = append(char.Cyberware,
			domain.Cyberware{
				Name:        "Dermal Armor (Racial)",
				Rating:      1,
				EssenceCost:  0.0, // Inherent - no essence cost
				Cost:        0,    // Inherent - no nuyen cost
				Racial:      true, // Mark as racial cyberware
				Notes:       "Inherent Troll racial trait - +1 Body",
			},
		)
	}
}

// applyLanguageSkills applies language skill rules during character creation
// - Characters get one free native language at rating 6
// - Language skill points = Intelligence * 1.5 (rounded down)
// - Language skills link to Intelligence attribute
func applyLanguageSkills(char *domain.CharacterSR3) {
	// Give one free native language at rating 6 (default to English)
	if len(char.LanguageSkills) == 0 {
		char.LanguageSkills["English"] = domain.Skill{
			Name:   "English",
			Rating: 6,
		}
	}
}

// GetLanguageSkillPoints calculates available language skill points during character creation
// Formula: Intelligence * 1.5 (rounded down)
func GetLanguageSkillPoints(intelligence int) int {
	return int(float64(intelligence) * 1.5)
}
