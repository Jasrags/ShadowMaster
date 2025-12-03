package domain

// MetatypeCategory represents the category of metatype
type MetatypeCategory string

const (
	MetatypeCategoryStandard     MetatypeCategory = "standard"
	MetatypeCategoryMetavariant  MetatypeCategory = "metavariant"
	MetatypeCategoryShapeshifter MetatypeCategory = "shapeshifter"
)

type Metatypes = map[string]Metatype
type Metatype struct {
	ID string
	// Name is the metatype name (e.g., "Human", "Elf", "Gnome", "Bovine")
	Name string
	// Category indicates the category (standard, metavariant, shapeshifter)
	Category MetatypeCategory
	// BaseRace is the base race for metavariants (e.g., "Dwarf" for Gnome)
	BaseRace string
	// Description is the full text description
	Description string
	// Body is the body attribute range
	Body AttributeRange
	// Agility is the agility attribute range
	Agility AttributeRange
	// Reaction is the reaction attribute range
	Reaction AttributeRange
	// Strength is the strength attribute range
	Strength AttributeRange
	// Willpower is the willpower attribute range
	Willpower AttributeRange
	// Logic is the logic attribute range
	Logic AttributeRange
	// Intuition is the intuition attribute range
	Intuition AttributeRange
	// Charisma is the charisma attribute range
	Charisma AttributeRange
	// Edge is the edge attribute range (for standard metatypes and metavariants)
	Edge AttributeRange
	// Magic is the magic attribute range (for shapeshifters, replaces Edge)
	Magic AttributeRange
	// Essence is the essence value
	Essence float32
	// Initiative describes how initiative is calculated
	Initiative InitiativeCalculation
	// RacialTraits lists the racial traits and abilities
	RacialTraits []RacialTrait
	Source       string
}

// AttributeRange represents a minimum/maximum attribute range
type AttributeRange struct {
	// Min is the minimum attribute value
	Min int
	// Max is the maximum attribute value
	Max int
}

// InitiativeCalculation represents how initiative is calculated
type InitiativeCalculation struct {
	// Formula describes the initiative formula (e.g., "REA+INT")
	Formula string
	// BaseDice is the base initiative dice (for shapeshifters)
	BaseDice *int
	// AdditionalDice is additional initiative dice (for shapeshifters, e.g., "+1D6", "+2D6")
	AdditionalDice *int
}

// RacialTrait represents a racial trait or ability
type RacialTrait struct {
	// Name is the trait name (e.g., "Low-Light Vision", "Thermographic Vision")
	Name string
	// Description describes the trait effect (e.g., "+2 dice for pathogen and toxin resistance")
	Description string
}

var AllMetatypes = Metatypes{
	"human": {
		Name:      "Human",
		Category:  MetatypeCategoryStandard,
		Body:      AttributeRange{Min: 1, Max: 6},
		Agility:   AttributeRange{Min: 1, Max: 6},
		Reaction:  AttributeRange{Min: 1, Max: 6},
		Strength:  AttributeRange{Min: 1, Max: 6},
		Willpower: AttributeRange{Min: 1, Max: 6},
		Logic:     AttributeRange{Min: 1, Max: 6},
		Intuition: AttributeRange{Min: 1, Max: 6},
		Charisma:  AttributeRange{Min: 1, Max: 6},
		Edge:      AttributeRange{Min: 2, Max: 7},
		Essence:   6,
		Initiative: InitiativeCalculation{
			Formula: "REA+INT",
		},
		RacialTraits: []RacialTrait{},
		Source:       "SR5",
	},
	"elf": {
		Name:      "Elf",
		Category:  MetatypeCategoryStandard,
		Body:      AttributeRange{Min: 1, Max: 6},
		Agility:   AttributeRange{Min: 2, Max: 7},
		Reaction:  AttributeRange{Min: 1, Max: 6},
		Strength:  AttributeRange{Min: 1, Max: 6},
		Willpower: AttributeRange{Min: 1, Max: 6},
		Logic:     AttributeRange{Min: 1, Max: 6},
		Intuition: AttributeRange{Min: 1, Max: 6},
		Charisma:  AttributeRange{Min: 3, Max: 8},
		Edge:      AttributeRange{Min: 1, Max: 6},
		Essence:   6,
		Initiative: InitiativeCalculation{
			Formula: "REA+INT",
		},
		RacialTraits: []RacialTrait{
			{Name: "Low-Light Vision"},
		},
		Source: "SR5",
	},
	"dwarf": {
		Name:      "Dwarf",
		Category:  MetatypeCategoryStandard,
		Body:      AttributeRange{Min: 3, Max: 8},
		Agility:   AttributeRange{Min: 1, Max: 6},
		Reaction:  AttributeRange{Min: 1, Max: 5},
		Strength:  AttributeRange{Min: 3, Max: 8},
		Willpower: AttributeRange{Min: 2, Max: 7},
		Logic:     AttributeRange{Min: 1, Max: 6},
		Intuition: AttributeRange{Min: 1, Max: 6},
		Charisma:  AttributeRange{Min: 1, Max: 6},
		Edge:      AttributeRange{Min: 1, Max: 6},
		Essence:   6,
		Initiative: InitiativeCalculation{
			Formula: "REA+INT",
		},
		RacialTraits: []RacialTrait{
			{Name: "Thermographic Vision"},
			{Name: "Pathogen and Toxin Resistance", Description: "+2 dice for pathogen and toxin resistance"},
			{Name: "Increased Lifestyle Cost", Description: "+20% increased Lifestyle cost"},
		},
		Source: "SR5",
	},
	"ork": {
		Name:      "Ork",
		Category:  MetatypeCategoryStandard,
		Body:      AttributeRange{Min: 4, Max: 9},
		Agility:   AttributeRange{Min: 1, Max: 6},
		Reaction:  AttributeRange{Min: 1, Max: 6},
		Strength:  AttributeRange{Min: 3, Max: 8},
		Willpower: AttributeRange{Min: 1, Max: 6},
		Logic:     AttributeRange{Min: 1, Max: 5},
		Intuition: AttributeRange{Min: 1, Max: 6},
		Charisma:  AttributeRange{Min: 1, Max: 6},
		Edge:      AttributeRange{Min: 1, Max: 5},
		Essence:   6,
		Initiative: InitiativeCalculation{
			Formula: "REA+INT",
		},
		RacialTraits: []RacialTrait{
			{Name: "Low-Light Vision"},
		},

		Source: "SR5",
	},
	"troll": {
		Name:      "Troll",
		Category:  MetatypeCategoryStandard,
		Body:      AttributeRange{Min: 5, Max: 10},
		Agility:   AttributeRange{Min: 1, Max: 5},
		Reaction:  AttributeRange{Min: 1, Max: 6},
		Strength:  AttributeRange{Min: 5, Max: 10},
		Willpower: AttributeRange{Min: 1, Max: 6},
		Logic:     AttributeRange{Min: 1, Max: 5},
		Intuition: AttributeRange{Min: 1, Max: 5},
		Charisma:  AttributeRange{Min: 1, Max: 4},
		Edge:      AttributeRange{Min: 1, Max: 6},
		Essence:   6,
		Initiative: InitiativeCalculation{
			Formula: "REA+INT",
		},
		RacialTraits: []RacialTrait{
			{Name: "Thermographic Vision"},
			{Name: "Reach", Description: "+1 Reach"},
			{Name: "Dermal Armor", Description: "+1 dermal armor"},
			{Name: "Increased Lifestyle Cost", Description: "double Lifestyle costs"},
		},
		Source: "SR5",
	},
}
