package v5

// dataTraditions contains all tradition definitions
var dataTraditions = map[string]Tradition{
	"hermetic_mage": {
		Name:                "The Hermetic Mage",
		Description:         "Uses Logic + Willpower for drain resistance. Emphasizes ritualized formulae, mineral reagents, formal lodges, and comfort with binding spirits. Focuses on structured, academic approaches to magic.",
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
		Description:         "Uses Charisma + Willpower for drain resistance. Emphasizes mentor spirits, medicine lodges, natural/material reagents, and relationships with local spirits. Focuses on intuitive, spiritual connections to magic.",
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
