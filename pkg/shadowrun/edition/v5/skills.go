package v5

// Category represents a skill category with its type (active or knowledge)
type SkillCategory struct {
	Name string `json:"name"` // Category name like "Combat Active", "Academic", etc.
	Type string `json:"type"` // "active" or "knowledge"
}

// Skill represents a skill from Shadowrun 5th Edition
type Skill struct {
	// Required fields
	Name      string `json:"name"`             // Skill name
	Attribute string `json:"attribute"`        // Linked attribute like "AGI", "LOG", "CHA", etc.
	Category  string `json:"category"`         // Category like "Combat Active", "Technical Active", etc.
	Default   string `json:"default"`          // "True" or "False" - whether it can default
	Source    string `json:"source,omitempty"` // Source book like "SR5", "RG", etc. (optional for knowledge skills)

	// Optional fields
	SkillGroup *string `json:"skillgroup,omitempty"` // Skill group name, or nil if not in a group
	Specs      *Specs  `json:"specs,omitempty"`      // Available specializations
	Exotic     *bool   `json:"exotic,omitempty"`     // Whether this is an exotic skill
	Page       string  `json:"page,omitempty"`       // Page number in source book

	// Movement requirements (for vehicle skills)
	RequiresFlyMovement    *bool `json:"requiresflymovement,omitempty"`
	RequiresGroundMovement *bool `json:"requiresgroundmovement,omitempty"`
	RequiresSwimMovement   *bool `json:"requiresswimmovement,omitempty"`
}

// Specs represents available specializations for a skill
type Specs struct {
	Spec []string `json:"spec"` // List of specialization names
}
