package v5

// PowerRequired represents requirements for an adept power
type PowerRequired struct {
	OneOf *PowerRequiredOneOf `json:"oneof,omitempty"` // One-of requirement
}

// PowerRequiredOneOf represents a one-of requirement for adept powers
type PowerRequiredOneOf struct {
	Quality interface{} `json:"quality,omitempty"` // Can be string or []string
}

// AdeptWayRequires represents adept way requirements
type AdeptWayRequires struct {
	Required *PowerRequired `json:"required,omitempty"` // Required conditions
}

// PowerBonus represents bonuses for an adept power
// Note: Many bonus types are reused from other packages
type PowerBonus struct {
	SelectAttribute    interface{}      `json:"selectattribute,omitempty"`    // Selectable attribute bonus
	SelectSkill        *SelectSkill     `json:"selectskill,omitempty"`        // Selectable skill bonus
	SpecificSkill      interface{}      `json:"specificskill,omitempty"`      // Specific skill bonuses
	UnlockSkills       interface{}      `json:"unlockskills,omitempty"`       // Unlock skills
	Dodge              string           `json:"dodge,omitempty"`              // Dodge bonus
	Surprise           string           `json:"surprise,omitempty"`           // Surprise bonus
	WeaponCategoryDV   interface{}      `json:"weaponcategorydv,omitempty"`   // Weapon category DV bonus
	WeaponSkillAccuracy interface{}     `json:"weaponskillaccuracy,omitempty"` // Weapon skill accuracy bonus
	// Add other bonus types as needed
}

// Power represents an adept power from Shadowrun 5th Edition
type Power struct {
	// Required fields
	ID       string `json:"id"`       // Unique identifier (UUID)
	Name     string `json:"name"`     // Power name
	Points   string `json:"points"`   // Power point cost (e.g., "0.25", "1")
	Levels   string `json:"levels"`   // Whether it has levels ("True" or "False")
	Limit    string `json:"limit"`    // Maximum level/rating limit
	Source   string `json:"source"`   // Source book like "SR5", "SG", etc.
	Page     string `json:"page"`     // Page number

	// Optional fields
	Action           *string          `json:"action,omitempty"`           // Action type like "Free", "Simple", etc.
	AdeptWay         *string          `json:"adeptway,omitempty"`         // Adept way point cost
	AdeptWayRequires *AdeptWayRequires `json:"adeptwayrequires,omitempty"` // Adept way requirements
	Bonus            *PowerBonus      `json:"bonus,omitempty"`            // Bonuses provided by this power
}

// EnhancementRequired represents requirements for a power enhancement
type EnhancementRequired struct {
	AllOf *EnhancementRequiredAllOf `json:"allof,omitempty"` // All-of requirement
}

// EnhancementRequiredAllOf represents an all-of requirement for enhancements
type EnhancementRequiredAllOf struct {
	Power   string `json:"power,omitempty"`   // Required power
	Quality string `json:"quality,omitempty"` // Required quality
}

// Enhancement represents a power enhancement from Shadowrun 5th Edition
type Enhancement struct {
	// Required fields
	ID       string `json:"id"`       // Unique identifier (UUID)
	Name     string `json:"name"`     // Enhancement name
	Power    string `json:"power"`    // Power this enhances
	Source   string `json:"source"`   // Source book like "SG", etc.
	Page     string `json:"page"`     // Page number

	// Optional fields
	Required *EnhancementRequired `json:"required,omitempty"` // Requirements for this enhancement
}

