package v5

// MetatypeCategory represents the category of metatype
type MetatypeCategory string

const (
	MetatypeCategoryStandard     MetatypeCategory = "standard"
	MetatypeCategoryMetavariant  MetatypeCategory = "metavariant"
	MetatypeCategoryShapeshifter MetatypeCategory = "shapeshifter"
)

// AttributeRange represents a minimum/maximum attribute range
type AttributeRange struct {
	// Min is the minimum attribute value
	Min int `json:"min,omitempty"`
	// Max is the maximum attribute value
	Max int `json:"max,omitempty"`
}

// InitiativeCalculation represents how initiative is calculated
type InitiativeCalculation struct {
	// Formula describes the initiative formula (e.g., "REA+INT")
	Formula string `json:"formula,omitempty"`
	// BaseDice is the base initiative dice (for shapeshifters)
	BaseDice *int `json:"base_dice,omitempty"`
	// AdditionalDice is additional initiative dice (for shapeshifters, e.g., "+1D6", "+2D6")
	AdditionalDice *int `json:"additional_dice,omitempty"`
}

// RacialTrait represents a racial trait or ability
type RacialTrait struct {
	// Name is the trait name (e.g., "Low-Light Vision", "Thermographic Vision")
	Name string `json:"name,omitempty"`
	// Description describes the trait effect (e.g., "+2 dice for pathogen and toxin resistance")
	Description string `json:"description,omitempty"`
}

// Metatype represents a metatype, metavariant, or shapeshifter definition
type Metatype struct {
	// Name is the metatype name (e.g., "Human", "Elf", "Gnome", "Bovine")
	Name string `json:"name,omitempty"`
	// Category indicates the category (standard, metavariant, shapeshifter)
	Category MetatypeCategory `json:"category,omitempty"`
	// BaseRace is the base race for metavariants (e.g., "Dwarf" for Gnome)
	BaseRace string `json:"base_race,omitempty"`
	// Description is the full text description
	Description string `json:"description,omitempty"`
	// Body is the body attribute range
	Body AttributeRange `json:"body,omitempty"`
	// Agility is the agility attribute range
	Agility AttributeRange `json:"agility,omitempty"`
	// Reaction is the reaction attribute range
	Reaction AttributeRange `json:"reaction,omitempty"`
	// Strength is the strength attribute range
	Strength AttributeRange `json:"strength,omitempty"`
	// Willpower is the willpower attribute range
	Willpower AttributeRange `json:"willpower,omitempty"`
	// Logic is the logic attribute range
	Logic AttributeRange `json:"logic,omitempty"`
	// Intuition is the intuition attribute range
	Intuition AttributeRange `json:"intuition,omitempty"`
	// Charisma is the charisma attribute range
	Charisma AttributeRange `json:"charisma,omitempty"`
	// Edge is the edge attribute range (for standard metatypes and metavariants)
	Edge *AttributeRange `json:"edge,omitempty"`
	// Magic is the magic attribute range (for shapeshifters, replaces Edge)
	Magic *AttributeRange `json:"magic,omitempty"`
	// Essence is the essence attribute range
	Essence AttributeRange `json:"essence,omitempty"`
	// Initiative describes how initiative is calculated
	Initiative InitiativeCalculation `json:"initiative,omitempty"`
	// RacialTraits lists the racial traits and abilities
	RacialTraits []RacialTrait `json:"racial_traits,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// MetatypeData represents the complete metatype data structure organized by category
type MetatypeData struct {
	Standard      []Metatype `json:"standard,omitempty"`
	Metavariants  []Metatype `json:"metavariants,omitempty"`
	Shapeshifters []Metatype `json:"shapeshifters,omitempty"`
}

// dataMetatypes contains all metatype definitions
// This is populated in metatypes_data.go

// GetAllMetatypes returns all metatypes
func GetAllMetatypes() []Metatype {
	metatypes := make([]Metatype, 0, len(dataMetatypes))
	for _, m := range dataMetatypes {
		metatypes = append(metatypes, m)
	}
	return metatypes
}

// GetMetatypeData returns the complete metatype data structure organized by category
func GetMetatypeData() MetatypeData {
	data := MetatypeData{
		Standard:      []Metatype{},
		Metavariants:  []Metatype{},
		Shapeshifters: []Metatype{},
	}

	for _, metatype := range dataMetatypes {
		switch metatype.Category {
		case MetatypeCategoryStandard:
			data.Standard = append(data.Standard, metatype)
		case MetatypeCategoryMetavariant:
			data.Metavariants = append(data.Metavariants, metatype)
		case MetatypeCategoryShapeshifter:
			data.Shapeshifters = append(data.Shapeshifters, metatype)
		}
	}

	return data
}

// GetMetatypeByName returns the metatype definition with the given name, or nil if not found
func GetMetatypeByName(name string) *Metatype {
	for _, metatype := range dataMetatypes {
		if metatype.Name == name {
			return &metatype
		}
	}
	return nil
}

// GetMetatypeByKey returns the metatype definition with the given key, or nil if not found
func GetMetatypeByKey(key string) *Metatype {
	metatype, ok := dataMetatypes[key]
	if !ok {
		return nil
	}
	return &metatype
}

// GetMetatypesByCategory returns all metatypes in the specified category
func GetMetatypesByCategory(category MetatypeCategory) []Metatype {
	metatypes := make([]Metatype, 0)
	for _, m := range dataMetatypes {
		if m.Category == category {
			metatypes = append(metatypes, m)
		}
	}
	return metatypes
}
