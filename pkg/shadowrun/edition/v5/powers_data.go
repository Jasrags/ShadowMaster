package v5

// dataPowers contains all power definitions
var dataPowers = map[string]Power{
	"adrenaline_boost": {
		Name:                 "Adrenaline Boost",
		Activation:           ActivationTypeFreeAction,
		ActivationDescription: "Free Action",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(0.25),
			Formula:      "0.25 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"astral_perception": {
		Name:                 "Astral Perception",
		Activation:           ActivationTypeSimpleAction,
		ActivationDescription: "Simple Action",
		Cost: PowerCostFormula{
			BaseCost: floatPtr(1.0),
			Formula:   "1 PP",
		},
		Source: &SourceReference{Source: "Core"},
	},
	"attribute_boost": {
		Name:      "Attribute Boost (Attribute)",
		Parameter: "Attribute",
		Activation: ActivationTypeSimpleAction,
		ActivationDescription: "Simple Action",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(0.25),
			Formula:      "0.25 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"combat_sense": {
		Name:       "Combat Sense",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(0.5),
			Formula:      "0.5 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"critical_strike": {
		Name:      "Critical Strike (Skill)",
		Parameter: "Skill",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			BaseCost: floatPtr(0.5),
			Formula:   "0.5 PP",
		},
		Source: &SourceReference{Source: "Core"},
	},
	"danger_sense": {
		Name:       "Danger Sense",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(0.25),
			Formula:      "0.25 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"enhanced_accuracy": {
		Name:      "Enhanced Accuracy (Skill)",
		Parameter: "Skill",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			BaseCost: floatPtr(0.25),
			Formula:   "0.25 PP",
		},
		Source: &SourceReference{Source: "Core"},
	},
	"enhanced_perception": {
		Name:       "Enhanced Perception",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(0.5),
			Formula:      "0.5 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"improved_ability": {
		Name:      "Improved Ability (Skill)",
		Parameter: "Skill",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(0.5),
			Formula:      "0.5 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"improved_physical_attribute": {
		Name:       "Improved Physical Attribute",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(1.0),
			Formula:      "1 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"improved_potential": {
		Name:      "Improved Potential (Limit)",
		Parameter: "Limit",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(0.5),
			Formula:      "0.5 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"improved_reflexes": {
		Name:       "Improved Reflexes",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			AdditionalCost: floatPtr(0.5),
			MaxLevel:       intPtr(3),
			Formula:        "0.5 PP + level (Max 3)",
			IsVariable:     true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"improved_sense": {
		Name:       "Improved Sense",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			CostPerItem: floatPtr(0.25),
			Formula:     "0.25 PP each",
			IsVariable:  true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"killing_hands": {
		Name:                 "Killing Hands",
		Activation:           ActivationTypeFreeAction,
		ActivationDescription: "Free Action",
		Cost: PowerCostFormula{
			BaseCost: floatPtr(0.5),
			Formula:   "0.5 PP",
		},
		Source: &SourceReference{Source: "Core"},
	},
	"kinesics": {
		Name:       "Kinesics",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(0.25),
			Formula:      "0.25 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"light_body": {
		Name:       "Light Body",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(0.25),
			Formula:      "0.25 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"missile_parry": {
		Name:                 "Missile Parry",
		Activation:           ActivationTypeInterrupt,
		ActivationDescription: "Interrupt (-5 Initiative)",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(0.25),
			Formula:      "0.25 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"mystic_armor": {
		Name:       "Mystic Armor",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(0.5),
			Formula:      "0.5 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"natural_immunity": {
		Name:       "Natural Immunity",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(0.25),
			Formula:      "0.25 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"pain_resistance": {
		Name:       "Pain Resistance",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(0.5),
			Formula:      "0.5 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"rapid_healing": {
		Name:       "Rapid Healing",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(0.5),
			Formula:      "0.5 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"spell_resistance": {
		Name:       "Spell Resistance",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(0.5),
			Formula:      "0.5 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"traceless_walk": {
		Name:       "Traceless Walk",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			BaseCost: floatPtr(1.0),
			Formula:   "1 PP",
		},
		Source: &SourceReference{Source: "Core"},
	},
	"voice_control": {
		Name:       "Voice Control",
		Activation: ActivationTypePassive,
		ActivationDescription: "-",
		Cost: PowerCostFormula{
			CostPerLevel: floatPtr(0.5),
			Formula:      "0.5 PP per level",
			IsVariable:   true,
		},
		Source: &SourceReference{Source: "Core"},
	},
	"wall_running": {
		Name:                 "Wall Running",
		Activation:           ActivationTypeSimpleAction,
		ActivationDescription: "Simple Action",
		Cost: PowerCostFormula{
			BaseCost: floatPtr(0.5),
			Formula:   "0.5 PP",
		},
		Source: &SourceReference{Source: "Core"},
	},
}

// floatPtr returns a pointer to a float64
func floatPtr(f float64) *float64 {
	return &f
}

