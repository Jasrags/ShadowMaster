package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains complex form structures generated from complexforms.xsd

// ComplexFormCategory represents a complex form category
type ComplexFormCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// ComplexFormCategories represents a collection of complex form categories
type ComplexFormCategories struct {
	Category []ComplexFormCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// ComplexFormItem represents a complex form definition
type ComplexFormItem struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 38
// Examples: 373638b9-4334-4645-99f5-c3673e4f809b, 33e75cd6-cad7-43dd-87ac-9838c83eccb5, 6b4ed8d5-75c8-4415-9578-15afa4ac8494 (and 7 more)
// Enum Candidate: Yes
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 38
// Examples: Cleaner, Diffusion of [Matrix Attribute], Editor (and 7 more)
// Enum Candidate: Yes
// Length: 3-31 characters
	Name string `xml:"name" json:"name"`
// Target represents target
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: Persona, Device, File (and 7 more)
// Enum Candidate: Cyberware, Device, File, Host, IC, Icon, Persona, Self, Sprite
// Length: 2-9 characters
	Target string `xml:"target" json:"target"`
// Duration represents duration
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: P, S, P (and 7 more)
// Enum Candidate: E, I, P, S, Special
// Length: 1-7 characters
	Duration string `xml:"duration" json:"duration"`
// FV represents fv
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 10
// Examples: L-2, L-2, L-1 (and 7 more)
// Enum Candidate: L, L+0, L+1, L+2, L+3, L+6, L-1, L-2, L-3, Special
// Length: 1-7 characters
	FV string `xml:"fv" json:"fv"`
	common.SourceReference
	common.Visibility
	UseSkill *string `xml:"useskill,omitempty" json:"useskill,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
}

// ComplexFormItems represents a collection of complex forms
type ComplexFormItems struct {
	ComplexForm []ComplexFormItem `xml:"complexform,omitempty" json:"complexform,omitempty"`
}

// ComplexFormsChummer represents the root chummer element for complex forms
type ComplexFormsChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []ComplexFormCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	ComplexForms []ComplexFormItems `xml:"complexforms,omitempty" json:"complexforms,omitempty"`
}

