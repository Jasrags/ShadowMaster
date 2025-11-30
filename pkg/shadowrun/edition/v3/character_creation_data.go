package v3

import (
	"shadowmaster/internal/domain"
)

// GetCharacterCreationDataFromGo generates CharacterCreationData entirely from Go code
// This serves as the source of truth for SR3 character creation metadata
func GetCharacterCreationDataFromGo() *domain.CharacterCreationData {
	data := &domain.CharacterCreationData{
		Priorities:      getSR3Priorities(),
		Metatypes:       getSR3Metatypes(),
		GameplayLevels:  getSR3GameplayLevels(),
		CreationMethods: getSR3CreationMethods(),
	}

	return data
}

// getSR3Priorities returns the priority system for SR3
func getSR3Priorities() map[string]map[string]domain.PriorityOption {
	return map[string]map[string]domain.PriorityOption{
		"magic": {
			"A": {
				Label:       "A - Full Magician",
				Description: "Full Magician with Magic Rating 6",
				MagicRating: 6,
			},
			"B": {
				Label:       "B - Adept/Aspected",
				Description: "Adept or Aspected Magician with Magic Rating 4",
				MagicRating: 4,
			},
			"C": {
				Label:       "C - Mundane",
				Description: "Mundane character (no magic)",
				MagicRating: 0,
			},
			"D": {
				Label:       "D - Mundane",
				Description: "Mundane character (no magic)",
				MagicRating: 0,
			},
			"E": {
				Label:       "E - Mundane",
				Description: "Mundane character (no magic)",
				MagicRating: 0,
			},
		},
		"metatype": {
			"A": {
				Label:       "A - All Metatypes",
				Description: "Choose any metatype (Human, Elf, Dwarf, Ork, Troll)",
			},
			"B": {
				Label:       "B - All Metatypes",
				Description: "Choose any metatype (Human, Elf, Dwarf, Ork, Troll)",
			},
			"C": {
				Label:       "C - Troll or Elf",
				Description: "Choose Troll or Elf",
			},
			"D": {
				Label:       "D - Dwarf or Ork",
				Description: "Choose Dwarf or Ork",
			},
			"E": {
				Label:       "E - Human Only",
				Description: "Human only",
			},
		},
		"attributes": {
			"A": {
				Label:       "A - 36 Points",
				Description: "36 attribute points (6 per attribute)",
			},
			"B": {
				Label:       "B - 24 Points",
				Description: "24 attribute points (4 per attribute)",
			},
			"C": {
				Label:       "C - 18 Points",
				Description: "18 attribute points (3 per attribute)",
			},
			"D": {
				Label:       "D - 12 Points",
				Description: "12 attribute points (2 per attribute)",
			},
			"E": {
				Label:       "E - 6 Points",
				Description: "6 attribute points (1 per attribute)",
			},
		},
		"skills": {
			"A": {
				Label:       "A - 40 Skill Points",
				Description: "40 skill points",
			},
			"B": {
				Label:       "B - 30 Skill Points",
				Description: "30 skill points",
			},
			"C": {
				Label:       "C - 20 Skill Points",
				Description: "20 skill points",
			},
			"D": {
				Label:       "D - 10 Skill Points",
				Description: "10 skill points",
			},
			"E": {
				Label:       "E - 5 Skill Points",
				Description: "5 skill points",
			},
		},
		"resources": {
			"A": {
				Label:       "A - 1,000,000¥",
				Description: "1,000,000 nuyen",
			},
			"B": {
				Label:       "B - 400,000¥",
				Description: "400,000 nuyen",
			},
			"C": {
				Label:       "C - 90,000¥",
				Description: "90,000 nuyen",
			},
			"D": {
				Label:       "D - 20,000¥",
				Description: "20,000 nuyen",
			},
			"E": {
				Label:       "E - 5,000¥",
				Description: "5,000 nuyen",
			},
		},
	}
}

// getSR3Metatypes returns metatype definitions for SR3
func getSR3Metatypes() []domain.MetatypeDefinition {
	humanMods := GetMetatypeModifiers("Human")
	elfMods := GetMetatypeModifiers("Elf")
	dwarfMods := GetMetatypeModifiers("Dwarf")
	orkMods := GetMetatypeModifiers("Ork")
	trollMods := GetMetatypeModifiers("Troll")

	return []domain.MetatypeDefinition{
		{
			ID:            "human",
			Name:          "Human",
			PriorityTiers: []string{"A", "B", "C", "D", "E"},
			AttributeModifiers: map[string]int{
				"body":         humanMods.Body,
				"quickness":    humanMods.Quickness,
				"strength":     humanMods.Strength,
				"charisma":     humanMods.Charisma,
				"intelligence": humanMods.Intelligence,
				"willpower":    humanMods.Willpower,
			},
			AttributeRanges: map[string]domain.AttributeRange{
				"body":         {Min: 1, Max: 6},
				"quickness":    {Min: 1, Max: 6},
				"strength":     {Min: 1, Max: 6},
				"charisma":     {Min: 1, Max: 6},
				"intelligence": {Min: 1, Max: 6},
				"willpower":    {Min: 1, Max: 6},
			},
			Abilities: []string{},
			Notes:     "Standard metatype with no special modifiers",
		},
		{
			ID:            "elf",
			Name:          "Elf",
			PriorityTiers: []string{"A", "B", "C"},
			AttributeModifiers: map[string]int{
				"body":         elfMods.Body,
				"quickness":    elfMods.Quickness,
				"strength":     elfMods.Strength,
				"charisma":     elfMods.Charisma,
				"intelligence": elfMods.Intelligence,
				"willpower":    elfMods.Willpower,
			},
			AttributeRanges: map[string]domain.AttributeRange{
				"body":         {Min: 1, Max: 6},
				"quickness":    {Min: 1, Max: 7},
				"strength":     {Min: 1, Max: 6},
				"charisma":     {Min: 1, Max: 8},
				"intelligence": {Min: 1, Max: 6},
				"willpower":    {Min: 1, Max: 6},
			},
			Abilities: []string{"Low-light Vision"},
			Notes:     "Gains +1 Quickness, +2 Charisma. Special ability: Low-light Vision",
		},
		{
			ID:            "dwarf",
			Name:          "Dwarf",
			PriorityTiers: []string{"A", "B", "D"},
			AttributeModifiers: map[string]int{
				"body":         dwarfMods.Body,
				"quickness":    dwarfMods.Quickness,
				"strength":     dwarfMods.Strength,
				"charisma":     dwarfMods.Charisma,
				"intelligence": dwarfMods.Intelligence,
				"willpower":    dwarfMods.Willpower,
			},
			AttributeRanges: map[string]domain.AttributeRange{
				"body":         {Min: 1, Max: 7},
				"quickness":    {Min: 1, Max: 6},
				"strength":     {Min: 1, Max: 8},
				"charisma":     {Min: 1, Max: 6},
				"intelligence": {Min: 1, Max: 6},
				"willpower":    {Min: 1, Max: 7},
			},
			Abilities: []string{"Thermographic Vision", "Resistance"},
			Notes:     "Gains +1 Body, +2 Strength, +1 Willpower. Special abilities: Thermographic Vision, Resistance (+2 Body vs disease/toxin)",
		},
		{
			ID:            "ork",
			Name:          "Ork",
			PriorityTiers: []string{"A", "B", "D"},
			AttributeModifiers: map[string]int{
				"body":         orkMods.Body,
				"quickness":    orkMods.Quickness,
				"strength":     orkMods.Strength,
				"charisma":     orkMods.Charisma,
				"intelligence": orkMods.Intelligence,
				"willpower":    orkMods.Willpower,
			},
			AttributeRanges: map[string]domain.AttributeRange{
				"body":         {Min: 1, Max: 9},
				"quickness":    {Min: 1, Max: 6},
				"strength":     {Min: 1, Max: 8},
				"charisma":     {Min: 1, Max: 5},
				"intelligence": {Min: 1, Max: 5},
				"willpower":    {Min: 1, Max: 6},
			},
			Abilities: []string{},
			Notes:     "Gains +3 Body, +2 Strength, -1 Charisma, -1 Intelligence",
		},
		{
			ID:            "troll",
			Name:          "Troll",
			PriorityTiers: []string{"A", "B", "C"},
			AttributeModifiers: map[string]int{
				"body":         trollMods.Body,
				"quickness":    trollMods.Quickness,
				"strength":     trollMods.Strength,
				"charisma":     trollMods.Charisma,
				"intelligence": trollMods.Intelligence,
				"willpower":    trollMods.Willpower,
			},
			AttributeRanges: map[string]domain.AttributeRange{
				"body":         {Min: 1, Max: 11},
				"quickness":    {Min: 1, Max: 5},
				"strength":     {Min: 1, Max: 10},
				"charisma":     {Min: 1, Max: 4},
				"intelligence": {Min: 1, Max: 4},
				"willpower":    {Min: 1, Max: 6},
			},
			Abilities: []string{"Thermographic Vision", "Reach", "Dermal Armor"},
			Notes:     "Gains +5 Body, -1 Quickness, +4 Strength, -2 Intelligence, -2 Charisma. Special abilities: Thermographic Vision, +1 Reach for Armed/Unarmed Combat, Dermal Armor (+1 Body)",
		},
	}
}

// getSR3GameplayLevels returns gameplay level definitions for SR3
// SR3 doesn't have formal gameplay levels like SR5, but we provide a basic structure
func getSR3GameplayLevels() map[string]domain.GameplayLevel {
	return map[string]domain.GameplayLevel{
		"standard": {
			Label:       "Standard",
			Description: "Standard Shadowrun 3rd Edition character creation",
		},
	}
}

// getSR3CreationMethods returns creation method definitions for SR3
func getSR3CreationMethods() map[string]domain.CreationMethod {
	return map[string]domain.CreationMethod{
		"priority": {
			Label:       "Priority",
			Description: "Standard priority-based character creation (A-E for each category)",
		},
	}
}
