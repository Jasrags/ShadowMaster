package common

// RequirementOneOf represents a one-of requirement (at least one must be met)
type RequirementOneOf struct {
	Cyberware interface{} `json:"cyberware,omitempty"` // Can be string or []string
	Bioware   interface{} `json:"bioware,omitempty"`   // Can be string or []string
	Metatype  string      `json:"metatype,omitempty"`  // Required metatype
	Quality   interface{} `json:"quality,omitempty"`   // Can be string or []string
	Power     string      `json:"power,omitempty"`     // Required power
	Group     interface{} `json:"group,omitempty"`     // Required group (can be complex)
}

// RequirementAllOf represents an all-of requirement (all must be met)
type RequirementAllOf struct {
	Metatype string      `json:"metatype,omitempty"` // Required metatype
	Quality  string      `json:"quality,omitempty"`  // Required quality
	Power    string      `json:"power,omitempty"`    // Required power
	MagEnabled interface{} `json:"magenabled,omitempty"` // Magic enabled requirement
}

// ParentDetails represents parent item details requirement
type ParentDetails struct {
	Name string `json:"name"` // Parent name
}

// WeaponDetails represents weapon details requirement (complex structure)
type WeaponDetails struct {
	// This is a placeholder for complex weapon details requirements
	// Currently set to interface{} in the original code
	Details interface{} `json:"details,omitempty"`
}

// Requirement represents a unified requirement structure
// This can be embedded or used directly in specific requirement types
type Requirement struct {
	OneOf       *RequirementOneOf `json:"oneof,omitempty"`
	AllOf       *RequirementAllOf `json:"allof,omitempty"`
	Parent      *ParentDetails    `json:"parentdetails,omitempty"`
	WeaponDetails *WeaponDetails  `json:"weapondetails,omitempty"`
}

