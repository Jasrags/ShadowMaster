package v5

// ArmorType represents the category of armor item
type ArmorType string

const (
	ArmorTypeClothing     ArmorType = "clothing"
	ArmorTypeArmor        ArmorType = "armor"
	ArmorTypeModification ArmorType = "modification"
	ArmorTypeHelmet       ArmorType = "helmet"
	ArmorTypeShield       ArmorType = "shield"
)

// ArmorModificationEffect represents the mechanical effect of an armor modification
type ArmorModificationEffect struct {
	// Type describes what the modification affects (e.g., "Fire", "Cold", "Electricity", "Chemical")
	Type string `json:"type,omitempty"`
	// ArmorBonus adds to armor value when resisting specific damage types
	ArmorBonus int `json:"armor_bonus,omitempty"`
	// ResistanceTestBonus adds to resistance test dice pools
	ResistanceTestBonus int `json:"resistance_test_bonus,omitempty"`
	// LimitBonus adds to limit on specific tests
	LimitBonus int `json:"limit_bonus,omitempty"`
	// DicePoolBonus adds to dice pool on specific tests
	DicePoolBonus int `json:"dice_pool_bonus,omitempty"`
	// TestType describes what type of test is affected (e.g., "Sneaking", "Toxin Resistance")
	TestType string `json:"test_type,omitempty"`
	// CompleteProtection indicates if it provides complete protection (e.g., chemical seal)
	CompleteProtection bool `json:"complete_protection,omitempty"`
	// DurationLimit describes time limits (e.g., "1 hour")
	DurationLimit string `json:"duration_limit,omitempty"`
	// ActivationAction describes how to activate (e.g., "Complex Action", "Free Action")
	ActivationAction string `json:"activation_action,omitempty"`
	// DamageInfo describes damage dealt (for offensive modifications like shock frills)
	DamageInfo string `json:"damage_info,omitempty"`
	// Charges describes charge capacity and recharge rate
	Charges string `json:"charges,omitempty"`
}

// ArmorSpecialProperty represents special properties of armor
type ArmorSpecialProperty struct {
	// ConcealabilityModifier modifies concealability (negative = easier to conceal)
	ConcealabilityModifier int `json:"concealability_modifier,omitempty"`
	// SneakingBonus adds to sneaking tests
	SneakingBonus int `json:"sneaking_bonus,omitempty"`
	// BuiltInFeatures lists built-in features (e.g., "music player", "biomonitor")
	BuiltInFeatures []string `json:"built_in_features,omitempty"`
	// Capacity describes capacity for modifications/accessories
	Capacity int `json:"capacity,omitempty"`
	// PhysicalLimitModifier modifies physical limit when using shield
	PhysicalLimitModifier int `json:"physical_limit_modifier,omitempty"`
	// EnvironmentalAdaptation indicates if can be modified for hot/cold environments
	EnvironmentalAdaptation bool `json:"environmental_adaptation,omitempty"`
	// ChemicallySealable indicates if can be chemically sealed
	ChemicallySealable bool `json:"chemically_sealable,omitempty"`
	// ColorChangeable indicates if color can be changed
	ColorChangeable bool `json:"color_changeable,omitempty"`
	// ActionTimeChange describes action time changes (e.g., "Simple Action to Free Action")
	ActionTimeChange string `json:"action_time_change,omitempty"`
}

// Armor represents an armor, clothing, modification, helmet, or shield definition
type Armor struct {
	// Name is the item name (e.g., "Armor jacket", "Chemical protection")
	Name string `json:"name,omitempty"`
	// Type indicates the category of armor item
	Type ArmorType `json:"type,omitempty"`
	// Description is the full text description
	Description string `json:"description,omitempty"`
	// ArmorRating is the base armor rating (for armor pieces, helmets, shields)
	ArmorRating int `json:"armor_rating,omitempty"`
	// Capacity is the capacity for modifications (for armor pieces, helmets, shields)
	Capacity int `json:"capacity,omitempty"`
	// Rating is the rating for modifications (1-6 typically)
	Rating int `json:"rating,omitempty"`
	// MaxRating is the maximum rating available (for modifications)
	MaxRating int `json:"max_rating,omitempty"`
	// ModificationEffects describes the mechanical effects of armor modifications
	ModificationEffects []ArmorModificationEffect `json:"modification_effects,omitempty"`
	// SpecialProperties describes special properties of the armor
	SpecialProperties *ArmorSpecialProperty `json:"special_properties,omitempty"`
	// WirelessBonus describes wireless-enabled functionality
	WirelessBonus *WirelessBonus `json:"wireless_bonus,omitempty"`
	// CompatibleWith lists what this modification is compatible with (for modifications)
	CompatibleWith []string `json:"compatible_with,omitempty"`
	// Requires lists prerequisites (e.g., "full body armor with helmet" for chemical seal)
	Requires string `json:"requires,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// ArmorData represents the complete armor data structure
type ArmorData struct {
	Clothing      []Armor `json:"clothing,omitempty"`
	Armor         []Armor `json:"armor,omitempty"`
	Modifications []Armor `json:"modifications,omitempty"`
	Helmets       []Armor `json:"helmets,omitempty"`
	Shields       []Armor `json:"shields,omitempty"`
}

// GetAllArmor returns all armor items
func GetAllArmor() []Armor {
	armor := make([]Armor, 0, len(dataArmor))
	for _, a := range dataArmor {
		armor = append(armor, a)
	}
	return armor
}

// GetArmorData returns the complete armor data structure organized by category
func GetArmorData() ArmorData {
	data := ArmorData{
		Clothing:      []Armor{},
		Armor:         []Armor{},
		Modifications: []Armor{},
		Helmets:       []Armor{},
		Shields:       []Armor{},
	}

	for _, armor := range dataArmor {
		switch armor.Type {
		case ArmorTypeClothing:
			data.Clothing = append(data.Clothing, armor)
		case ArmorTypeArmor:
			data.Armor = append(data.Armor, armor)
		case ArmorTypeModification:
			data.Modifications = append(data.Modifications, armor)
		case ArmorTypeHelmet:
			data.Helmets = append(data.Helmets, armor)
		case ArmorTypeShield:
			data.Shields = append(data.Shields, armor)
		}
	}

	return data
}

// GetArmorByName returns the armor definition with the given name, or nil if not found
func GetArmorByName(name string) *Armor {
	for _, armor := range dataArmor {
		if armor.Name == name {
			return &armor
		}
	}
	return nil
}

// GetArmorByKey returns the armor definition with the given key, or nil if not found
func GetArmorByKey(key string) *Armor {
	armor, ok := dataArmor[key]
	if !ok {
		return nil
	}
	return &armor
}

// GetArmorByType returns all armor items in the specified type
func GetArmorByType(armorType ArmorType) []Armor {
	armor := make([]Armor, 0)
	for _, a := range dataArmor {
		if a.Type == armorType {
			armor = append(armor, a)
		}
	}
	return armor
}
