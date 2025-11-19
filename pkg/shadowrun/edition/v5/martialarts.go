package v5

// MartialArtTechnique represents a technique reference within a martial art
type MartialArtTechnique struct {
	Name string `json:"name"` // Technique name
}

// MartialArtTechniques represents a collection of techniques for a martial art
type MartialArtTechniques struct {
	Technique interface{} `json:"technique,omitempty"` // Can be single MartialArtTechnique or []MartialArtTechnique
}

// AddSkillSpecializationOption represents a skill specialization option bonus
type AddSkillSpecializationOption struct {
	Skill string `json:"skill"` // Skill name
	Spec  string `json:"spec"`  // Specialization name
}

// MartialArtBonus represents bonuses for a martial art
type MartialArtBonus struct {
	AddSkillSpecializationOption *AddSkillSpecializationOption `json:"addskillspecializationoption,omitempty"` // Skill specialization option
}

// MartialArtRequired represents requirements for a martial art technique
type MartialArtRequired struct {
	AllOf *MartialArtRequiredAllOf `json:"allof,omitempty"` // All-of requirement
}

// MartialArtRequiredAllOf represents an all-of requirement for martial art techniques
type MartialArtRequiredAllOf struct {
	MagEnabled interface{} `json:"magenabled,omitempty"` // Magic enabled requirement
}

// MartialArt represents a martial art from Shadowrun 5th Edition
type MartialArt struct {
	// Required fields
	ID       string `json:"id"`       // Unique identifier (UUID)
	Name     string `json:"name"`     // Martial art name
	Source   string `json:"source"`   // Source book like "RG", "FA", etc.
	Page     string `json:"page"`     // Page number

	// Optional fields
	Bonus     *MartialArtBonus     `json:"bonus,omitempty"`     // Bonuses provided by this martial art
	Techniques *MartialArtTechniques `json:"techniques,omitempty"` // Techniques available in this martial art
}

// Technique represents a martial art technique definition from Shadowrun 5th Edition
type Technique struct {
	// Required fields
	ID       string `json:"id"`       // Unique identifier (UUID)
	Name     string `json:"name"`     // Technique name
	Source   string `json:"source"`   // Source book like "RG", "FA", etc.
	Page     string `json:"page"`     // Page number

	// Optional fields
	Required *MartialArtRequired `json:"required,omitempty"` // Requirements for this technique
}

