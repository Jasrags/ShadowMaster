package v5

// dataTraditions contains all tradition definitions
var dataTraditions = map[string]Tradition{
	"hermetic_mage": {
		Name:                "The Hermetic Mage",
		CombatElement:       "Fire",
		DetectionElement:    "Air",
		HealthElement:       "Man",
		IllusionElement:     "Water",
		ManipulationElement: "Earth",
		DrainFormula:        "Logic + Willpower",
		DrainAttributes:     []string{"Logic", "Willpower"},
		Source:              &SourceReference{Source: "SR5"},
	},
	"shaman": {
		Name:                "The Shaman",
		CombatElement:       "Beasts",
		DetectionElement:    "Water",
		HealthElement:       "Earth",
		IllusionElement:     "Air",
		ManipulationElement: "Man",
		DrainFormula:        "Charisma + Willpower",
		DrainAttributes:     []string{"Charisma", "Willpower"},
		Source:              &SourceReference{Source: "SR5"},
	},
}
