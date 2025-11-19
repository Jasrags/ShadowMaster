package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// ComplexFormBonus represents bonuses for a complex form
// Note: SelectTextBonus is from common package
type ComplexFormBonus struct {
	SelectText *common.SelectTextBonus `json:"selecttext,omitempty"` // Select text bonus
}

// ComplexFormRequired represents requirements for a complex form
type ComplexFormRequired struct {
	OneOf *ComplexFormRequiredOneOf `json:"oneof,omitempty"` // One-of requirement
}

// ComplexFormRequiredOneOf represents a one-of requirement for complex forms
type ComplexFormRequiredOneOf struct {
	Quality string `json:"quality,omitempty"` // Required quality
}

// ComplexForm represents a complex form from Shadowrun 5th Edition
type ComplexForm struct {
	// Required fields
	ID       string `json:"id"`       // Unique identifier (UUID)
	Name     string `json:"name"`     // Complex form name
	Target   string `json:"target"`   // Target type like "Persona", "Device", "File", etc.
	Duration string `json:"duration"` // Duration like "P", "S", "I", "E", "Special"
	FV       string `json:"fv"`       // Fading Value like "L-2", "L+1", "L", "Special"
	Source   string `json:"source"`   // Source book like "SR5", "DT", "CF", "KC"
	Page     string `json:"page"`     // Page number

	// Optional fields
	Bonus    *ComplexFormBonus    `json:"bonus,omitempty"`    // Bonuses provided by this complex form
	Required *ComplexFormRequired `json:"required,omitempty"` // Requirements for this complex form
}
