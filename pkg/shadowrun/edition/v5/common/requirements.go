package common

// RequirementOneOf represents a one-of requirement (at least one must be met)
// Simplified to use []string instead of interface{} for consistency
type RequirementOneOf struct {
	Cyberware []string `json:"cyberware,omitempty"` // List of required cyberware (OR logic)
	Bioware   []string `json:"bioware,omitempty"`   // List of required bioware (OR logic)
	Metatype  string   `json:"metatype,omitempty"`  // Required metatype
	Quality   []string `json:"quality,omitempty"`   // List of required qualities (OR logic)
	Power     string   `json:"power,omitempty"`     // Required power
	Group     []string `json:"group,omitempty"`     // List of required groups (OR logic)
}

// RequirementAllOf represents an all-of requirement (all must be met)
// Simplified to use concrete types instead of interface{}
type RequirementAllOf struct {
	Metatype   string `json:"metatype,omitempty"`   // Required metatype
	Quality    string `json:"quality,omitempty"`    // Required quality
	Power      string `json:"power,omitempty"`      // Required power
	MagEnabled bool   `json:"magenabled,omitempty"` // Magic enabled requirement
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

