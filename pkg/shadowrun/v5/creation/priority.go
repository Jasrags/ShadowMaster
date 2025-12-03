package creation

import "errors"

// PriorityLevel represents a priority assignment (A through E)
type PriorityLevel string

const (
	PriorityA PriorityLevel = "A"
	PriorityB PriorityLevel = "B"
	PriorityC PriorityLevel = "C"
	PriorityD PriorityLevel = "D"
	PriorityE PriorityLevel = "E"
)

// PlayLevel represents the character creation play level
type PlayLevel string

const (
	PlayLevelStreet      PlayLevel = "street"
	PlayLevelExperienced PlayLevel = "experienced"
	PlayLevelPrime       PlayLevel = "prime"
)

// PriorityAssignment represents a complete priority assignment across all five columns
type PriorityAssignment struct {
	Metatype       PriorityLevel `json:"metatype"`
	Attributes     PriorityLevel `json:"attributes"`
	MagicResonance PriorityLevel `json:"magic_resonance"`
	Skills         PriorityLevel `json:"skills"`
	Resources      PriorityLevel `json:"resources"`
}

// MetatypePriorityData represents the special attribute points granted by metatype priority
type MetatypePriorityData struct {
	Human int `json:"human"`
	Elf   int `json:"elf"`
	Dwarf int `json:"dwarf"`
	Ork   int `json:"ork"`
	Troll int `json:"troll"`
}

// MagicPriorityData represents magic/resonance resources granted by priority
type MagicPriorityData struct {
	MagicRating     int `json:"magic_rating"`
	ResonanceRating int `json:"resonance_rating"`
	SkillRating     int `json:"skill_rating"`
	Spells          int `json:"spells"`
	ComplexForms    int `json:"complex_forms"`
	SkillGroups     int `json:"skill_groups"`
}

// SkillsPriorityData represents skill points granted by priority
type SkillsPriorityData struct {
	IndividualPoints int `json:"individual_points"`
	GroupPoints      int `json:"group_points"`
}

// PriorityTables contains all priority table data
type PriorityTables struct {
	Metatype       map[PriorityLevel]MetatypePriorityData `json:"metatype"`
	Attributes     map[PriorityLevel]int                  `json:"attributes"`
	MagicResonance map[PriorityLevel]MagicPriorityData    `json:"magic_resonance"`
	Skills         map[PriorityLevel]SkillsPriorityData   `json:"skills"`
	Resources      map[PriorityLevel]int                  `json:"resources"`
}

// PlayLevelConfig contains configuration for a specific play level
type PlayLevelConfig struct {
	StartingKarma          int `json:"starting_karma"`
	MaxKarma               int `json:"max_karma"`
	MaxKarmaToNuyen        int `json:"max_karma_to_nuyen"`
	MaxNuyenFromKarma      int `json:"max_nuyen_from_karma"`
	ContactKarmaMultiplier int `json:"contact_karma_multiplier"` // Charisma multiplier for contact karma
}

// GetPlayLevelConfig returns the configuration for a specific play level
func GetPlayLevelConfig(level PlayLevel) PlayLevelConfig {
	switch level {
	case PlayLevelStreet:
		return PlayLevelConfig{
			StartingKarma:          13,
			MaxKarma:               26,
			MaxKarmaToNuyen:        5,
			MaxNuyenFromKarma:      10000,
			ContactKarmaMultiplier: 3, // Standard Charisma x 3
		}
	case PlayLevelPrime:
		return PlayLevelConfig{
			StartingKarma:          35,
			MaxKarma:               70,
			MaxKarmaToNuyen:        25,
			MaxNuyenFromKarma:      50000,
			ContactKarmaMultiplier: 6, // Prime Runner: Charisma x 6
		}
	case PlayLevelExperienced:
		fallthrough
	default:
		return PlayLevelConfig{
			StartingKarma:          25,
			MaxKarma:               25, // No maximum for experienced (standard rules)
			MaxKarmaToNuyen:        10,
			MaxNuyenFromKarma:      20000,
			ContactKarmaMultiplier: 3, // Standard Charisma x 3
		}
	}
}

// GetPriorityTables returns priority tables for a specific play level
func GetPriorityTables(level PlayLevel) PriorityTables {
	baseTables := GetDefaultPriorityTables()

	// Modify resources based on play level
	switch level {
	case PlayLevelStreet:
		baseTables.Resources = map[PriorityLevel]int{
			PriorityA: 75000,
			PriorityB: 50000,
			PriorityC: 25000,
			PriorityD: 15000,
			PriorityE: 6000,
		}
	case PlayLevelPrime:
		baseTables.Resources = map[PriorityLevel]int{
			PriorityA: 500000,
			PriorityB: 325000,
			PriorityC: 210000,
			PriorityD: 150000,
			PriorityE: 100000,
		}
		// Experienced uses default values
	}

	return baseTables
}

// GetDefaultPriorityTables returns the standard Shadowrun 5E priority tables (Experienced level)
func GetDefaultPriorityTables() PriorityTables {
	return PriorityTables{
		Metatype: map[PriorityLevel]MetatypePriorityData{
			PriorityA: {Human: 9, Elf: 8, Dwarf: 7, Ork: 7, Troll: 5},
			PriorityB: {Human: 7, Elf: 6, Dwarf: 4, Ork: 4, Troll: 0},
			PriorityC: {Human: 5, Elf: 3, Dwarf: 1, Ork: 0},
			PriorityD: {Human: 3, Elf: 0},
			PriorityE: {Human: 1},
		},
		Attributes: map[PriorityLevel]int{
			PriorityA: 24,
			PriorityB: 20,
			PriorityC: 16,
			PriorityD: 14,
			PriorityE: 12,
		},
		MagicResonance: map[PriorityLevel]MagicPriorityData{
			PriorityA: {
				MagicRating:     6,
				ResonanceRating: 6,
				SkillRating:     5,
				Spells:          10,
				ComplexForms:    5,
				SkillGroups:     0,
			},
			PriorityB: {
				MagicRating:     6, // Adept
				ResonanceRating: 4,
				SkillRating:     4,
				Spells:          7,
				ComplexForms:    2,
				SkillGroups:     0,
			},
			PriorityC: {
				MagicRating:     4, // Adept
				ResonanceRating: 3,
				SkillRating:     2,
				Spells:          5,
				ComplexForms:    1,
				SkillGroups:     0,
			},
			PriorityD: {
				MagicRating:     2,
				ResonanceRating: 0,
				SkillRating:     0,
				Spells:          0,
				ComplexForms:    0,
				SkillGroups:     0,
			},
			PriorityE: {
				MagicRating:     0,
				ResonanceRating: 0,
				SkillRating:     0,
				Spells:          0,
				ComplexForms:    0,
				SkillGroups:     0,
			},
		},
		Skills: map[PriorityLevel]SkillsPriorityData{
			PriorityA: {IndividualPoints: 46, GroupPoints: 10},
			PriorityB: {IndividualPoints: 36, GroupPoints: 5},
			PriorityC: {IndividualPoints: 28, GroupPoints: 2},
			PriorityD: {IndividualPoints: 22, GroupPoints: 0},
			PriorityE: {IndividualPoints: 18, GroupPoints: 0},
		},
		Resources: map[PriorityLevel]int{
			PriorityA: 450000,
			PriorityB: 275000,
			PriorityC: 140000,
			PriorityD: 50000,
			PriorityE: 6000,
		},
	}
}

// ValidatePriorityAssignment checks that all priority levels are used exactly once
func ValidatePriorityAssignment(assignment PriorityAssignment) error {
	priorities := []PriorityLevel{
		assignment.Metatype,
		assignment.Attributes,
		assignment.MagicResonance,
		assignment.Skills,
		assignment.Resources,
	}

	used := make(map[PriorityLevel]bool)
	for _, p := range priorities {
		if p == "" {
			return errors.New("all priority levels must be assigned")
		}
		if used[p] {
			return errors.New("each priority level (A-E) must be used exactly once")
		}
		if p != PriorityA && p != PriorityB && p != PriorityC && p != PriorityD && p != PriorityE {
			return errors.New("invalid priority level: must be A, B, C, D, or E")
		}
		used[p] = true
	}

	// Ensure all levels A-E are present
	required := []PriorityLevel{PriorityA, PriorityB, PriorityC, PriorityD, PriorityE}
	for _, req := range required {
		if !used[req] {
			return errors.New("all priority levels (A-E) must be assigned")
		}
	}

	return nil
}

// GetAvailableMetatypes returns a list of available metatypes for a given priority level
// Returns a map of metatype name to special attribute points
func GetAvailableMetatypes(tables PriorityTables, priority PriorityLevel) (map[string]int, error) {
	metatypeData, ok := tables.Metatype[priority]
	if !ok {
		return nil, errors.New("invalid priority level for metatype")
	}

	available := make(map[string]int)
	if metatypeData.Human > 0 {
		available["human"] = metatypeData.Human
	}
	if metatypeData.Elf > 0 {
		available["elf"] = metatypeData.Elf
	}
	if metatypeData.Dwarf > 0 {
		available["dwarf"] = metatypeData.Dwarf
	}
	if metatypeData.Ork > 0 {
		available["ork"] = metatypeData.Ork
	}
	if metatypeData.Troll > 0 {
		available["troll"] = metatypeData.Troll
	}

	return available, nil
}

// GetMetatypeSpecialAttributePoints returns the special attribute points for a metatype at a given priority
func GetMetatypeSpecialAttributePoints(tables PriorityTables, priority PriorityLevel, metatype string) (int, error) {
	metatypeData, ok := tables.Metatype[priority]
	if !ok {
		return 0, errors.New("invalid priority level for metatype")
	}

	switch metatype {
	case "Human":
		return metatypeData.Human, nil
	case "Elf":
		return metatypeData.Elf, nil
	case "Dwarf":
		return metatypeData.Dwarf, nil
	case "Ork":
		return metatypeData.Ork, nil
	case "Troll":
		return metatypeData.Troll, nil
	default:
		return 0, errors.New("invalid metatype")
	}
}

// GetAttributePoints returns the attribute point pool for a given priority
func GetAttributePoints(tables PriorityTables, priority PriorityLevel) (int, error) {
	points, ok := tables.Attributes[priority]
	if !ok {
		return 0, errors.New("invalid priority level for attributes")
	}
	return points, nil
}

// GetSkillsPoints returns the skill points (individual and group) for a given priority
func GetSkillsPoints(tables PriorityTables, priority PriorityLevel) (SkillsPriorityData, error) {
	data, ok := tables.Skills[priority]
	if !ok {
		return SkillsPriorityData{}, errors.New("invalid priority level for skills")
	}
	return data, nil
}

// GetResourcesNuyen returns the starting nuyen for a given priority
func GetResourcesNuyen(tables PriorityTables, priority PriorityLevel) (int, error) {
	nuyen, ok := tables.Resources[priority]
	if !ok {
		return 0, errors.New("invalid priority level for resources")
	}
	return nuyen, nil
}

// GetMagicResonanceData returns the magic/resonance data for a given priority
func GetMagicResonanceData(tables PriorityTables, priority PriorityLevel) (MagicPriorityData, error) {
	data, ok := tables.MagicResonance[priority]
	if !ok {
		return MagicPriorityData{}, errors.New("invalid priority level for magic/resonance")
	}
	return data, nil
}

// ValidationRules contains all validation rules for priority character creation
type ValidationRules struct {
	MaxKarmaPositiveQualities int `json:"max_karma_positive_qualities"`
	MaxKarmaNegativeQualities int `json:"max_karma_negative_qualities"`
	MaxKarmaCarryover         int `json:"max_karma_carryover"`
	MaxNuyenCarryover         int `json:"max_nuyen_carryover"`
	MaxGearAvailability       int `json:"max_gear_availability"`
	MaxGearDeviceRating       int `json:"max_gear_device_rating"`
	MaxAugmentationBonus      int `json:"max_augmentation_bonus"`
}

// GetValidationRules returns validation rules for a specific play level
func GetValidationRules(level PlayLevel) ValidationRules {
	switch level {
	case PlayLevelStreet:
		return ValidationRules{
			MaxKarmaPositiveQualities: 25,
			MaxKarmaNegativeQualities: 25,
			MaxKarmaCarryover:         7,
			MaxNuyenCarryover:         5000,
			MaxGearAvailability:       10, // Street level: max 10
			MaxGearDeviceRating:       4,  // Street level: max 4
			MaxAugmentationBonus:      4,
		}
	case PlayLevelPrime:
		return ValidationRules{
			MaxKarmaPositiveQualities: 25,
			MaxKarmaNegativeQualities: 25,
			MaxKarmaCarryover:         7,
			MaxNuyenCarryover:         5000,
			MaxGearAvailability:       15, // Prime Runner: max 15
			MaxGearDeviceRating:       6,  // Prime Runner: max 6
			MaxAugmentationBonus:      4,
		}
	case PlayLevelExperienced:
		fallthrough
	default:
		return GetDefaultValidationRules()
	}
}

// GetDefaultValidationRules returns the standard validation rules for priority character creation (Experienced level)
func GetDefaultValidationRules() ValidationRules {
	return ValidationRules{
		MaxKarmaPositiveQualities: 25,
		MaxKarmaNegativeQualities: 25,
		MaxKarmaCarryover:         7,
		MaxNuyenCarryover:         5000,
		MaxGearAvailability:       12,
		MaxGearDeviceRating:       6,
		MaxAugmentationBonus:      4,
	}
}

// ValidateKarmaQualities checks that karma spent on qualities is within limits
func ValidateKarmaQualities(positiveKarma, negativeKarma int, rules ValidationRules) error {
	if positiveKarma > rules.MaxKarmaPositiveQualities {
		return errors.New("exceeds maximum karma for positive qualities")
	}
	if negativeKarma > rules.MaxKarmaNegativeQualities {
		return errors.New("exceeds maximum karma for negative qualities")
	}
	return nil
}

// ValidateCarryover checks that karma and nuyen carryover are within limits
func ValidateCarryover(karma, nuyen int, rules ValidationRules) error {
	if karma > rules.MaxKarmaCarryover {
		return errors.New("exceeds maximum karma carryover")
	}
	if nuyen > rules.MaxNuyenCarryover {
		return errors.New("exceeds maximum nuyen carryover")
	}
	return nil
}

// ValidateGearAvailability checks that gear availability is within limits
func ValidateGearAvailability(availability int, rules ValidationRules) error {
	if availability > rules.MaxGearAvailability {
		return errors.New("exceeds maximum gear availability")
	}
	return nil
}

// ValidateGearDeviceRating checks that device rating is within limits
func ValidateGearDeviceRating(rating int, rules ValidationRules) error {
	if rating > rules.MaxGearDeviceRating {
		return errors.New("exceeds maximum gear device rating")
	}
	return nil
}

// ValidateAugmentationBonus checks that augmentation bonus per attribute is within limits
func ValidateAugmentationBonus(bonus int, rules ValidationRules) error {
	if bonus > rules.MaxAugmentationBonus {
		return errors.New("exceeds maximum augmentation bonus per attribute")
	}
	return nil
}

// GetContactKarma calculates the free contact karma based on Charisma and play level
func GetContactKarma(charisma int, level PlayLevel) int {
	config := GetPlayLevelConfig(level)
	return charisma * config.ContactKarmaMultiplier
}

// ValidateKarmaToNuyenConversion validates karma to nuyen conversion based on play level
func ValidateKarmaToNuyenConversion(karmaToConvert int, level PlayLevel) error {
	config := GetPlayLevelConfig(level)
	if karmaToConvert > config.MaxKarmaToNuyen {
		return errors.New("exceeds maximum karma that can be converted to nuyen for this play level")
	}
	return nil
}

// GetMaxNuyenFromKarma returns the maximum nuyen that can be obtained from karma conversion for a play level
func GetMaxNuyenFromKarma(level PlayLevel) int {
	config := GetPlayLevelConfig(level)
	return config.MaxNuyenFromKarma
}
