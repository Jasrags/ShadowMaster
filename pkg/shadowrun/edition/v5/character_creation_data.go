package v5

import (
	"fmt"
	"shadowmaster/internal/domain"
)

// GetCharacterCreationDataFromGo generates CharacterCreationData entirely from Go code
// This serves as the source of truth for SR5 character creation metadata
func GetCharacterCreationDataFromGo() *domain.CharacterCreationData {
	data := &domain.CharacterCreationData{
		Priorities:      GetPrioritiesForAPI(),
		Metatypes:       convertMetatypesToDefinitions(),
		GameplayLevels:  getGameplayLevels(),
		CreationMethods: getCreationMethods(),
	}

	return data
}

// convertMetatypesToDefinitions converts v5.Metatype to domain.MetatypeDefinition
func convertMetatypesToDefinitions() []domain.MetatypeDefinition {
	allMetatypes := GetAllMetatypes()
	definitions := make([]domain.MetatypeDefinition, 0, len(allMetatypes))
	priorityData := GetPriorityData()

	// Map metatype names to their priority tiers
	metatypeToTiers := make(map[string][]string)
	for priority, option := range priorityData.Metatype {
		for metatypeName := range option.Metatypes {
			metatypeToTiers[metatypeName] = append(metatypeToTiers[metatypeName], priority)
		}
	}

	// Map Go metatype names to IDs (lowercase)
	nameToID := map[string]string{
		"Human": "human",
		"Elf":   "elf",
		"Dwarf": "dwarf",
		"Ork":   "ork",
		"Troll": "troll",
	}

	for _, mt := range allMetatypes {
		// Only include standard metatypes for character creation
		if mt.Category != MetatypeCategoryStandard {
			continue
		}

		// Get ID from name
		id, ok := nameToID[mt.Name]
		if !ok {
			// Skip metatypes we don't have IDs for
			continue
		}

		// Get priority tiers for this metatype
		tiers := metatypeToTiers[mt.Name]
		if len(tiers) == 0 {
			// Default to all tiers if not found
			tiers = []string{"A", "B", "C", "D", "E"}
		}

		// Convert attribute ranges
		attrRanges := make(map[string]domain.AttributeRange)
		attrRanges["body"] = domain.AttributeRange{Min: mt.Body.Min, Max: mt.Body.Max}
		attrRanges["agility"] = domain.AttributeRange{Min: mt.Agility.Min, Max: mt.Agility.Max}
		attrRanges["reaction"] = domain.AttributeRange{Min: mt.Reaction.Min, Max: mt.Reaction.Max}
		attrRanges["strength"] = domain.AttributeRange{Min: mt.Strength.Min, Max: mt.Strength.Max}
		attrRanges["willpower"] = domain.AttributeRange{Min: mt.Willpower.Min, Max: mt.Willpower.Max}
		attrRanges["logic"] = domain.AttributeRange{Min: mt.Logic.Min, Max: mt.Logic.Max}
		attrRanges["intuition"] = domain.AttributeRange{Min: mt.Intuition.Min, Max: mt.Intuition.Max}
		attrRanges["charisma"] = domain.AttributeRange{Min: mt.Charisma.Min, Max: mt.Charisma.Max}
		if mt.Edge != nil {
			attrRanges["edge"] = domain.AttributeRange{Min: mt.Edge.Min, Max: mt.Edge.Max}
		}

		// Convert racial traits to abilities list with descriptions
		// Store as "Name" or "Name (Description)" format for frontend display
		abilities := make([]string, len(mt.RacialTraits))
		for i, trait := range mt.RacialTraits {
			if trait.Description != "" {
				abilities[i] = fmt.Sprintf("%s (%s)", trait.Name, trait.Description)
			} else {
				abilities[i] = trait.Name
			}
		}

		// Build special attribute points from priority data
		specialAttrPoints := make(map[string]int)
		for _, priority := range tiers {
			if option, exists := priorityData.Metatype[priority]; exists {
				if points, hasPoints := option.Metatypes[mt.Name]; hasPoints {
					specialAttrPoints[priority] = points
				}
			}
		}

		def := domain.MetatypeDefinition{
			ID:                     id,
			Name:                   mt.Name,
			PriorityTiers:          tiers,
			AttributeRanges:        attrRanges,
			SpecialAttributePoints: specialAttrPoints,
			Abilities:              abilities,
			Notes:                  mt.Description,
		}

		definitions = append(definitions, def)
	}

	return definitions
}

// getGameplayLevels returns gameplay level definitions
func getGameplayLevels() map[string]domain.GameplayLevel {
	return map[string]domain.GameplayLevel{
		"street": {
			Label:         "Street",
			Description:   "Street-level characters with reduced resources",
			StartingKarma: GetStartingKarmaForGameplayLevel("street"),
			Resources: map[string]int{
				"A": 75000,
				"B": 50000,
				"C": 25000,
				"D": 15000,
				"E": 6000,
			},
		},
		"experienced": {
			Label:         "Experienced",
			Description:   "Standard experienced runners",
			StartingKarma: GetStartingKarmaForGameplayLevel("experienced"),
			Resources: map[string]int{
				"A": 450000,
				"B": 275000,
				"C": 140000,
				"D": 50000,
				"E": 6000,
			},
		},
		"prime": {
			Label:         "Prime",
			Description:   "Prime runner characters with increased resources",
			StartingKarma: GetStartingKarmaForGameplayLevel("prime"),
			Resources: map[string]int{
				"A": 500000,
				"B": 325000,
				"C": 210000,
				"D": 150000,
				"E": 100000,
			},
		},
	}
}

// getCreationMethods returns creation method definitions
func getCreationMethods() map[string]domain.CreationMethod {
	return map[string]domain.CreationMethod{
		"priority": {
			Label:       "Priority",
			Description: "Standard priority-based character creation",
		},
		"sum_to_ten": {
			Label:                           "Sum-to-Ten",
			Description:                     "Flexible priority system where priorities sum to 10",
			SupportsMultipleColumnSelection: true,
		},
		"karma": {
			Label:       "Karma Point-Buy",
			Description: "Build characters using karma points",
			KarmaBudget: 800, // Base karma budget
		},
	}
}

