package v5

// SpellCategory represents a spell category with its associated skills
type SpellCategory struct {
	Name                 string `json:"name"`                             // Category name like "Combat", "Detection", etc.
	UseSkill             string `json:"use_skill,omitempty"`              // Skill used for casting like "Spellcasting", "Artificing", etc.
	AlchemicalSkill      string `json:"alchemical_skill,omitempty"`       // Skill for alchemy like "Alchemy"
	BarehandedAdeptSkill string `json:"barehanded_adept_skill,omitempty"` // Skill for barehanded adept like "Unarmed Combat"
}

// Spell represents a spell from Shadowrun 5th Edition
type Spell struct {
	// Required fields
	Name     string `json:"name"`     // Spell name
	Category string `json:"category"` // Category like "Combat", "Detection", etc.
	Type     string `json:"type"`     // Type: "P" (Physical) or "M" (Mana)
	Range    string `json:"range"`    // Range like "LOS", "T", "LOS (A)", etc.
	Duration string `json:"duration"` // Duration like "I" (Instant), "S" (Sustained), etc.
	DV       string `json:"dv"`       // Drain value like "F-3", "F", "F+1", etc.
	Source   string `json:"source"`   // Source book like "SR5", "SG", etc.

	// Optional fields
	Page       string      `json:"page,omitempty"`       // Page number in source book
	Damage     string      `json:"damage,omitempty"`     // Damage type like "P" (Physical), "S" (Stun), etc.
	Descriptor string      `json:"descriptor,omitempty"` // Descriptor like "Indirect, Elemental", "Direct, Area", etc.
	Bonus      interface{} `json:"bonus,omitempty"`      // Bonuses (can be complex structure)
	Required   interface{} `json:"required,omitempty"`   // Requirements (can be complex structure)
}
