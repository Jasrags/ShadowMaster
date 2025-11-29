package v5

import (
	"shadowmaster/internal/domain"
)

// PriorityData contains comprehensive priority table data for SR5 character creation
// Based on Shadowrun 5th Edition Core Rulebook and character creation documentation

// GetPriorityData returns detailed priority data for all categories
func GetPriorityData() PriorityData {
	return PriorityData{
		Metatype:   getMetatypePriorityData(),
		Attributes: getAttributesPriorityData(),
		Skills:     getSkillsPriorityData(),
		Resources:  getResourcesPriorityData(),
		Magic:      getMagicPriorityData(),
	}
}

// PriorityData holds all priority table information
type PriorityData struct {
	Metatype   MetatypePriorityData
	Attributes AttributesPriorityData
	Skills     SkillsPriorityData
	Resources  ResourcesPriorityData
	Magic      MagicPriorityData
}

// MetatypePriorityData defines metatype options and special attribute points for each priority
type MetatypePriorityData map[string]MetatypePriorityOption

// MetatypePriorityOption defines available metatypes and their special attribute points
type MetatypePriorityOption struct {
	Label       string
	Summary     string
	Metatypes   map[string]int // Metatype name -> special attribute points
	Description string
}

func getMetatypePriorityData() MetatypePriorityData {
	return MetatypePriorityData{
		"A": {
			Label:   "Human, Elf, Dwarf, Ork, Troll",
			Summary: "Includes special attribute points.",
			Metatypes: map[string]int{
				"Human": 9,
				"Elf":   8,
				"Dwarf": 7,
				"Ork":   7,
				"Troll": 5,
			},
			Description: "All metatypes available with maximum special attribute points",
		},
		"B": {
			Label:   "Human, Elf, Dwarf, Ork, Troll",
			Summary: "",
			Metatypes: map[string]int{
				"Human": 7,
				"Elf":   6,
				"Dwarf": 4,
				"Ork":   4,
				"Troll": 0,
			},
			Description: "Most metatypes available with good special attribute points",
		},
		"C": {
			Label:   "Human, Elf, Dwarf, Ork",
			Summary: "",
			Metatypes: map[string]int{
				"Human": 5,
				"Elf":   3,
				"Dwarf": 1,
				"Ork":   0,
			},
			Description: "Limited metatype selection with moderate special attribute points",
		},
		"D": {
			Label:   "Human, Elf",
			Summary: "",
			Metatypes: map[string]int{
				"Human": 3,
				"Elf":   0,
			},
			Description: "Only Human and Elf available with minimal special attribute points",
		},
		"E": {
			Label:   "Human",
			Summary: "",
			Metatypes: map[string]int{
				"Human": 1,
			},
			Description: "Only Human available with minimal special attribute points",
		},
	}
}

// AttributesPriorityData defines attribute point pools for each priority
type AttributesPriorityData map[string]AttributesPriorityOption

// AttributesPriorityOption defines attribute points available
type AttributesPriorityOption struct {
	Label       string
	Points      int
	Description string
}

func getAttributesPriorityData() AttributesPriorityData {
	return AttributesPriorityData{
		"A": {
			Label:       "24 attribute points",
			Points:      24,
			Description: "Maximum attribute points for creating powerful characters",
		},
		"B": {
			Label:       "20 attribute points",
			Points:      20,
			Description: "Good attribute point pool for well-rounded characters",
		},
		"C": {
			Label:       "16 attribute points",
			Points:      16,
			Description: "Moderate attribute point pool",
		},
		"D": {
			Label:       "14 attribute points",
			Points:      14,
			Description: "Limited attribute point pool",
		},
		"E": {
			Label:       "12 attribute points",
			Points:      12,
			Description: "Minimum attribute point pool",
		},
	}
}

// SkillsPriorityData defines skill points for each priority
type SkillsPriorityData map[string]SkillsPriorityOption

// SkillsPriorityOption defines individual and group skill points
type SkillsPriorityOption struct {
	Label            string
	IndividualPoints int
	GroupPoints      int
	Description      string
}

func getSkillsPriorityData() SkillsPriorityData {
	return SkillsPriorityData{
		"A": {
			Label:            "46 skill / 10 group points",
			IndividualPoints: 46,
			GroupPoints:      10,
			Description:      "Maximum skill points and skill group points",
		},
		"B": {
			Label:            "36 skill / 5 group points",
			IndividualPoints: 36,
			GroupPoints:      5,
			Description:      "Good skill point allocation with some skill groups",
		},
		"C": {
			Label:            "28 skill / 2 group points",
			IndividualPoints: 28,
			GroupPoints:      2,
			Description:      "Moderate skill points with limited skill groups",
		},
		"D": {
			Label:            "22 skill points",
			IndividualPoints: 22,
			GroupPoints:      0,
			Description:      "Limited skill points, no skill groups",
		},
		"E": {
			Label:            "18 skill points",
			IndividualPoints: 18,
			GroupPoints:      0,
			Description:      "Minimum skill points, no skill groups",
		},
	}
}

// ResourcesPriorityData defines starting nuyen for each priority
type ResourcesPriorityData map[string]ResourcesPriorityOption

// ResourcesPriorityOption defines starting nuyen (base experienced level)
type ResourcesPriorityOption struct {
	Label       string
	Nuyen       int
	Description string
}

func getResourcesPriorityData() ResourcesPriorityData {
	return ResourcesPriorityData{
		"A": {
			Label:       "450,000¥",
			Nuyen:       450000,
			Description: "Maximum starting nuyen for experienced level",
		},
		"B": {
			Label:       "275,000¥",
			Nuyen:       275000,
			Description: "Good starting nuyen for experienced level",
		},
		"C": {
			Label:       "140,000¥",
			Nuyen:       140000,
			Description: "Moderate starting nuyen for experienced level",
		},
		"D": {
			Label:       "50,000¥",
			Nuyen:       50000,
			Description: "Limited starting nuyen for experienced level",
		},
		"E": {
			Label:       "6,000¥",
			Nuyen:       6000,
			Description: "Minimum starting nuyen for experienced level",
		},
	}
}

// MagicPriorityData defines magic/resonance benefits for each priority
type MagicPriorityData map[string]MagicPriorityOption

// MagicPriorityOption defines magic/resonance options and benefits
type MagicPriorityOption struct {
	Label            string
	Summary          string
	MagicRating      int      // Magic or Resonance rating (0 if mundane)
	AvailableTypes   []string // Available magic types: "Magician", "Adept", "Aspected Magician", "Mystic Adept", "Technomancer"
	FreeSkills       int      // Number of free magical/resonance skills
	SkillRating      int      // Rating of free skills
	FreeSpells       int      // Number of free spells (for Magicians/Mystic Adepts)
	FreeComplexForms int      // Number of free complex forms (for Technomancers)
	FreePowerPoints  float64  // Free power points (for Adepts, equal to Magic rating)
	Description      string
}

func getMagicPriorityData() MagicPriorityData {
	return MagicPriorityData{
		"A": {
			Label:            "Magician/Mystic Adept or Technomancer top tier",
			Summary:          "Magic/Resonance 6 with advanced packages.",
			MagicRating:      6,
			AvailableTypes:   []string{"Magician", "Mystic Adept", "Technomancer"},
			FreeSkills:       2,
			SkillRating:      5,
			FreeSpells:       10,
			FreeComplexForms: 5,
			FreePowerPoints:  6.0, // Adepts get power points equal to Magic rating
			Description:      "Top tier magical or technomancer options with maximum rating and extensive free resources",
		},
		"B": {
			Label:            "Full caster, adept, or technomancer mid tier",
			Summary:          "",
			MagicRating:      4,
			AvailableTypes:   []string{"Magician", "Adept", "Aspected Magician", "Mystic Adept", "Technomancer"},
			FreeSkills:       2,
			SkillRating:      4,
			FreeSpells:       7,
			FreeComplexForms: 2,
			FreePowerPoints:  4.0,
			Description:      "Good magical or technomancer options with solid rating and good free resources",
		},
		"C": {
			Label:            "Limited caster or technomancer",
			Summary:          "",
			MagicRating:      3,
			AvailableTypes:   []string{"Magician", "Adept", "Aspected Magician", "Mystic Adept", "Technomancer"},
			FreeSkills:       0,
			SkillRating:      0,
			FreeSpells:       5,
			FreeComplexForms: 1,
			FreePowerPoints:  3.0,
			Description:      "Limited magical or technomancer options with moderate rating and minimal free resources",
		},
		"D": {
			Label:            "Adept or Aspected Magician",
			Summary:          "",
			MagicRating:      2,
			AvailableTypes:   []string{"Adept", "Aspected Magician"},
			FreeSkills:       0,
			SkillRating:      0,
			FreeSpells:       0,
			FreeComplexForms: 0,
			FreePowerPoints:  2.0,
			Description:      "Limited to Adept or Aspected Magician with low rating and no free spells",
		},
		"E": {
			Label:            "No magical or technomancer options",
			Summary:          "",
			MagicRating:      0,
			AvailableTypes:   []string{}, // Mundane only
			FreeSkills:       0,
			SkillRating:      0,
			FreeSpells:       0,
			FreeComplexForms: 0,
			FreePowerPoints:  0.0,
			Description:      "Mundane character - no magic or resonance. Can purchase magic/resonance later with Karma if desired",
		},
	}
}

// GetResourcesForPriorityAndGameplayLevel returns resources adjusted for gameplay level
func GetResourcesForPriorityAndGameplayLevel(priority string, gameplayLevel string) int {
	baseData := getResourcesPriorityData()
	baseOption, exists := baseData[priority]
	if !exists {
		return 0
	}

	baseNuyen := baseOption.Nuyen

	switch gameplayLevel {
	case "street":
		// Street level: Reduced resources
		streetMultipliers := map[string]float64{
			"A": 75000.0 / 450000.0, // ~0.167
			"B": 50000.0 / 275000.0, // ~0.182
			"C": 25000.0 / 140000.0, // ~0.179
			"D": 15000.0 / 50000.0,  // 0.3
			"E": 1.0,                // 1.0 (no change)
		}
		if mult, ok := streetMultipliers[priority]; ok {
			return int(float64(baseNuyen) * mult)
		}
		// Fallback to direct values
		streetValues := map[string]int{
			"A": 75000,
			"B": 50000,
			"C": 25000,
			"D": 15000,
			"E": 6000,
		}
		return streetValues[priority]

	case "prime":
		// Prime runner: Increased resources
		primeMultipliers := map[string]float64{
			"A": 500000.0 / 450000.0, // ~1.111
			"B": 325000.0 / 275000.0, // ~1.182
			"C": 210000.0 / 140000.0, // 1.5
			"D": 150000.0 / 50000.0,  // 3.0
			"E": 100000.0 / 6000.0,   // ~16.667
		}
		if mult, ok := primeMultipliers[priority]; ok {
			return int(float64(baseNuyen) * mult)
		}
		// Fallback to direct values
		primeValues := map[string]int{
			"A": 500000,
			"B": 325000,
			"C": 210000,
			"D": 150000,
			"E": 100000,
		}
		return primeValues[priority]

	default: // "experienced"
		return baseNuyen
	}
}

// GetMetatypeSpecialAttributePoints returns special attribute points for a metatype at a given priority
func GetMetatypeSpecialAttributePoints(metatype string, priority string) int {
	data := getMetatypePriorityData()
	option, exists := data[priority]
	if !exists {
		return 0
	}
	return option.Metatypes[metatype]
}

// GetAttributePoints returns attribute points for a given priority
func GetAttributePoints(priority string) int {
	data := getAttributesPriorityData()
	option, exists := data[priority]
	if !exists {
		return 0
	}
	return option.Points
}

// GetSkillPoints returns individual and group skill points for a given priority
func GetSkillPoints(priority string) (individual int, group int) {
	data := getSkillsPriorityData()
	option, exists := data[priority]
	if !exists {
		return 0, 0
	}
	return option.IndividualPoints, option.GroupPoints
}

// GetMagicPriorityOption returns magic priority option for a given priority level
func GetMagicPriorityOption(priority string) (MagicPriorityOption, bool) {
	data := getMagicPriorityData()
	option, exists := data[priority]
	return option, exists
}

// IsMagicTypeAvailableAtPriority checks if a magic type is available at a given priority
func IsMagicTypeAvailableAtPriority(magicType string, priority string) bool {
	option, exists := getMagicPriorityData()[priority]
	if !exists {
		return false
	}
	for _, availableType := range option.AvailableTypes {
		if availableType == magicType {
			return true
		}
	}
	return false
}

// GetPrioritiesForAPI converts PriorityData to the domain format for API responses
// This function serves as the source of truth for priority data, replacing JSON file data
func GetPrioritiesForAPI() map[string]map[string]domain.PriorityOption {
	priorityData := GetPriorityData()

	result := make(map[string]map[string]domain.PriorityOption)

	// Convert Metatype priorities
	metatypeMap := make(map[string]domain.PriorityOption)
	for priority, option := range priorityData.Metatype {
		metatypeMap[priority] = domain.PriorityOption{
			Label:   option.Label,
			Summary: option.Summary,
		}
	}
	result["metatype"] = metatypeMap

	// Convert Attributes priorities
	attributesMap := make(map[string]domain.PriorityOption)
	for priority, option := range priorityData.Attributes {
		attributesMap[priority] = domain.PriorityOption{
			Label: option.Label,
		}
	}
	result["attributes"] = attributesMap

	// Convert Skills priorities
	skillsMap := make(map[string]domain.PriorityOption)
	for priority, option := range priorityData.Skills {
		skillsMap[priority] = domain.PriorityOption{
			Label: option.Label,
		}
	}
	result["skills"] = skillsMap

	// Convert Resources priorities
	resourcesMap := make(map[string]domain.PriorityOption)
	for priority, option := range priorityData.Resources {
		resourcesMap[priority] = domain.PriorityOption{
			Label: option.Label,
		}
	}
	result["resources"] = resourcesMap

	// Convert Magic priorities
	magicMap := make(map[string]domain.PriorityOption)
	for priority, option := range priorityData.Magic {
		magicMap[priority] = domain.PriorityOption{
			Label:          option.Label,
			Summary:        option.Summary,
			AvailableTypes: option.AvailableTypes, // Include available magic types
			MagicRating:    option.MagicRating,    // Include magic/resonance rating
			FreeSpells:     option.FreeSpells,     // Include free spells count
		}
	}
	result["magic"] = magicMap

	return result
}
