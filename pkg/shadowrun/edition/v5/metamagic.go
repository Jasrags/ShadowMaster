package v5

// MetamagicRequiredAllOf represents an all-of requirement for metamagic
type MetamagicRequiredAllOf struct {
	Art        interface{} `json:"art,omitempty"`        // Required art (can be string or []string)
	Metamagic  string      `json:"metamagic,omitempty"`  // Required metamagic
	Group      interface{} `json:"group,omitempty"`      // Required group (can be complex)
}

// MetamagicRequiredOneOf represents a one-of requirement for metamagic
type MetamagicRequiredOneOf struct {
	Art       interface{} `json:"art,omitempty"`       // Required art (can be string or []string)
	Quality   interface{} `json:"quality,omitempty"`   // Required quality (can be string or []string)
	Metamagic string      `json:"metamagic,omitempty"` // Required metamagic
	Tradition string      `json:"tradition,omitempty"` // Required tradition
	Group     interface{} `json:"group,omitempty"`     // Required group (can be complex)
}

// MetamagicRequired represents requirements for a metamagic technique
type MetamagicRequired struct {
	AllOf *MetamagicRequiredAllOf `json:"allof,omitempty"` // All-of requirement
	OneOf *MetamagicRequiredOneOf `json:"oneof,omitempty"` // One-of requirement
}

// MetamagicBonus represents bonuses for a metamagic technique
type MetamagicBonus struct {
	AdeptPowerPoints    string      `json:"adeptpowerpoints,omitempty"`    // Adept power points bonus
	QuickeningMetamagic interface{} `json:"quickeningmetamagic,omitempty"` // Quickening metamagic (can be null or complex)
}

// Metamagic represents a metamagic technique from Shadowrun 5th Edition
type Metamagic struct {
	// Required fields
	ID       string `json:"id"`       // Unique identifier (UUID)
	Name     string `json:"name"`     // Metamagic name
	Adept    string `json:"adept"`    // Whether available to adepts ("True" or "False")
	Magician string `json:"magician"` // Whether available to magicians ("True" or "False")
	Source   string `json:"source"`   // Source book like "SR5", "SG", etc.
	Page     string `json:"page"`     // Page number

	// Optional fields
	Limit    *string           `json:"limit,omitempty"`    // Limit like "False"
	Bonus    *MetamagicBonus   `json:"bonus,omitempty"`    // Bonuses provided by this metamagic
	Required *MetamagicRequired `json:"required,omitempty"` // Requirements for this metamagic
}

// Art represents a metamagic art from Shadowrun 5th Edition
type Art struct {
	// Required fields
	ID     string `json:"id"`     // Unique identifier (UUID)
	Name   string `json:"name"`   // Art name
	Source string `json:"source"` // Source book like "SG", etc.
	Page   string `json:"page"`   // Page number
}

