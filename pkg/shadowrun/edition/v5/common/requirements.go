package common

// ParentDetails represents parent item details requirement
type ParentDetails struct {
	Name string `json:"name"` // Parent name
}

// Requirement represents a unified requirement structure
// This can be embedded or used directly in specific requirement types
// Note: RequirementOneOf, RequirementAllOf, and WeaponDetails are now defined in conditions.go
type Requirement struct {
	OneOf       *RequirementOneOf `json:"oneof,omitempty"`
	AllOf       *RequirementAllOf `json:"allof,omitempty"`
	Parent      *ParentDetails    `json:"parentdetails,omitempty"`
	WeaponDetails *WeaponDetails  `json:"weapondetails,omitempty"`
}

