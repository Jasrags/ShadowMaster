package v5

import (
	"fmt"
)

// PrioritySelection holds character creation priorities for SR5 Priority method
// Each priority (A-E) can only be used once
type PrioritySelection struct {
	Metatype      string `json:"metatype_priority"`        // A-E
	Attributes    string `json:"attributes_priority"`      // A-E
	Magic         string `json:"magic_priority"`           // A-E or "none" for mundane
	Skills        string `json:"skills_priority"`          // A-E
	Resources     string `json:"resources_priority"`       // A-E
	GameplayLevel string `json:"gameplay_level,omitempty"` // "experienced", "street", "prime"
}

// SumToTenSelection holds character creation data for Sum-to-Ten method
type SumToTenSelection struct {
	Metatype      string `json:"metatype_priority"`   // A-E
	Attributes    string `json:"attributes_priority"` // A-E
	Magic         string `json:"magic_priority"`      // A-E or "none"
	Skills        string `json:"skills_priority"`     // A-E
	Resources     string `json:"resources_priority"`  // A-E
	GameplayLevel string `json:"gameplay_level,omitempty"`
}

// KarmaSelection holds character creation data for Karma Point-Buy method
type KarmaSelection struct {
	Metatype      string               `json:"metatype"`
	Attributes    map[string]int       `json:"attributes"`
	MagicType     string               `json:"magic_type,omitempty"` // "Adept", "Magician", etc.
	Tradition     string               `json:"tradition,omitempty"`
	Skills        map[string]int       `json:"skills"`
	Qualities     []QualitySelection   `json:"qualities,omitempty"`
	Equipment     []EquipmentSelection `json:"equipment,omitempty"`
	GameplayLevel string               `json:"gameplay_level,omitempty"`
}

// QualitySelection represents a quality selection in karma build
type QualitySelection struct {
	Name string `json:"name"`
	Type string `json:"type"` // "positive" or "negative"
}

// EquipmentSelection represents equipment purchase in karma build
type EquipmentSelection struct {
	Type string `json:"type"` // "weapon", "armor", "cyberware", etc.
	Name string `json:"name"`
}

// PriorityTable defines the SR5 priority table values
type PriorityTable struct {
	Metatype   map[string]MetatypePriority
	Attributes map[string]int // Attribute points
	Skills     map[string]SkillPriority
	Resources  map[string]int // Nuyen
	Magic      map[string]MagicPriority
}

// MetatypePriority defines metatype options for a priority level
type MetatypePriority struct {
	Options map[string]int // Metatype name -> special attribute points
}

// SkillPriority defines skill points for a priority level
type SkillPriority struct {
	Individual int // Individual skill points
	Group      int // Skill group points
}

// MagicPriority defines magic/resonance benefits for a priority level
type MagicPriority struct {
	MagicRating      int     // Magic or Resonance rating
	MagicType        string  // "Magician", "Adept", "Aspected Magician", "Mystic Adept", "Technomancer"
	FreeSkills       int     // Number of free magical/resonance skills
	SkillRating      int     // Rating of free skills
	FreeSpells       int     // Number of free spells (for Magicians/Mystic Adepts)
	FreeComplexForms int     // Number of free complex forms (for Technomancers)
	FreePowerPoints  float64 // Free power points (for Adepts)
}

// GetPriorityTable returns the SR5 priority table
// This function now uses priority_data.go as the source of truth for consistency
func GetPriorityTable() PriorityTable {
	priorityData := GetPriorityData()

	// Convert MetatypePriorityData to the legacy format
	metatypeMap := make(map[string]MetatypePriority)
	for priority, option := range priorityData.Metatype {
		metatypeMap[priority] = MetatypePriority{
			Options: option.Metatypes,
		}
	}

	// Convert AttributesPriorityData to the legacy format
	attributesMap := make(map[string]int)
	for priority, option := range priorityData.Attributes {
		attributesMap[priority] = option.Points
	}

	// Convert SkillsPriorityData to the legacy format
	skillsMap := make(map[string]SkillPriority)
	for priority, option := range priorityData.Skills {
		skillsMap[priority] = SkillPriority{
			Individual: option.IndividualPoints,
			Group:      option.GroupPoints,
		}
	}

	// Convert ResourcesPriorityData to the legacy format (experienced level)
	resourcesMap := make(map[string]int)
	for priority, option := range priorityData.Resources {
		resourcesMap[priority] = option.Nuyen
	}

	// Convert MagicPriorityData to the legacy format
	magicMap := make(map[string]MagicPriority)
	for priority, option := range priorityData.Magic {
		magicMap[priority] = MagicPriority{
			MagicRating:      option.MagicRating,
			FreeSkills:       option.FreeSkills,
			SkillRating:      option.SkillRating,
			FreeSpells:       option.FreeSpells,
			FreeComplexForms: option.FreeComplexForms,
			FreePowerPoints:  option.FreePowerPoints,
		}
	}

	return PriorityTable{
		Metatype:   metatypeMap,
		Attributes: attributesMap,
		Skills:     skillsMap,
		Resources:  resourcesMap,
		Magic:      magicMap,
	}
}

// GetResourcesForGameplayLevel returns resources adjusted for gameplay level
// This function now uses priority_data.go as the source of truth
func GetResourcesForGameplayLevel(priority string, gameplayLevel string) int {
	return GetResourcesForPriorityAndGameplayLevel(priority, gameplayLevel)
}

// GetStartingKarmaForGameplayLevel returns starting karma for gameplay level
func GetStartingKarmaForGameplayLevel(gameplayLevel string) int {
	switch gameplayLevel {
	case "street":
		return 13
	case "prime":
		return 35
	default: // "experienced"
		return 25
	}
}

// ValidatePrioritySelection validates that all priorities are assigned and unique
func ValidatePrioritySelection(selection PrioritySelection) error {
	priorities := []string{
		selection.Metatype,
		selection.Attributes,
		selection.Magic,
		selection.Skills,
		selection.Resources,
	}

	// Check that all priorities are set
	for i, p := range priorities {
		if p == "" {
			categories := []string{"Metatype", "Attributes", "Magic", "Skills", "Resources"}
			return fmt.Errorf("%s priority not set", categories[i])
		}
	}

	// Check that Magic can be "none" for mundane characters
	validPriorities := map[string]bool{}
	for _, p := range priorities {
		if p == "none" {
			continue // Magic can be "none"
		}
		if p < "A" || p > "E" {
			return fmt.Errorf("invalid priority level: %s (must be A-E)", p)
		}
		if validPriorities[p] {
			return fmt.Errorf("duplicate priority level: %s (each priority can only be used once)", p)
		}
		validPriorities[p] = true
	}

	return nil
}
