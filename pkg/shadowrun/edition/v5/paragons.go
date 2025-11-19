package v5

// ParagonBonus represents bonuses for a paragon (technomancer mentor)
// Note: Reuses structures from mentors.go where applicable
type ParagonBonus struct {
	SpecificSkill       interface{} `json:"specificskill,omitempty"`       // Specific skill bonus (can be single or list)
	ActionDicePool      interface{} `json:"actiondicepool,omitempty"`      // Action dice pool bonus (can be complex)
	Initiative          string      `json:"initiative,omitempty"`          // Initiative bonus
	MatrixInitiative    string      `json:"matrixinitiative,omitempty"`    // Matrix initiative bonus
	LivingPersona       interface{} `json:"livingpersona,omitempty"`       // Living persona bonuses (can be complex)
	WeaponSkillAccuracy interface{} `json:"weaponskillaccuracy,omitempty"` // Weapon skill accuracy bonus (can be single or list)
}

// Paragon represents a technomancer paragon (mentor) from Shadowrun 5th Edition
type Paragon struct {
	// Required fields
	ID           string `json:"id"`           // Unique identifier (UUID)
	Name         string `json:"name"`         // Paragon name
	Category     string `json:"category"`     // Category (usually "Resonance")
	Advantage    string `json:"advantage"`    // Advantage description
	Disadvantage string `json:"disadvantage"` // Disadvantage description
	Source       string `json:"source"`       // Source book
	Page         string `json:"page"`         // Page number

	// Optional fields
	Bonus *ParagonBonus `json:"bonus,omitempty"` // Bonuses provided by this paragon
}
