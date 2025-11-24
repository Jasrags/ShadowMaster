package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains drug component structures generated from drugcomponents.xsd

// DrugGrade represents a drug grade definition
type DrugGrade struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 22
// Examples: 33ae6b1c-62f6-4824-967d-0e2b37c7d1b9, ca5e7e5e-6aab-472a-a273-6d21d4e9ad2e, cf8a2d2b-03b9-4440-873b-829c7d82489e (and 7 more)
// Enum Candidate: Yes
	ID string `xml:"id" json:"id"`
	common.Visibility
	Name *string `xml:"name,omitempty" json:"name,omitempty"`
	Ess *string `xml:"ess,omitempty" json:"ess,omitempty"`
	Cost *string `xml:"cost,omitempty" json:"cost,omitempty"`
	AddictionThreshold *int `xml:"addictionthreshold,omitempty" json:"addictionthreshold,omitempty"`
	Avail *string `xml:"avail,omitempty" json:"avail,omitempty"`
	common.SourceReference
}

// DrugGrades represents a collection of drug grades
type DrugGrades struct {
	Grade []DrugGrade `xml:"grade,omitempty" json:"grade,omitempty"`
}

// DrugEffectAttribute represents an attribute in a drug effect
type DrugEffectAttribute struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: Social, Physical, Mental (and 4 more)
// Enum Candidate: Mental, Physical, Social
// Length: 6-8 characters
	Name *string `xml:"name,omitempty" json:"name,omitempty"`
	Value *int `xml:"value,omitempty" json:"value,omitempty"`
}

// DrugEffectLimit represents a limit in a drug effect
type DrugEffectLimit struct {
	Name *string `xml:"name,omitempty" json:"name,omitempty"`
	Value *int `xml:"value,omitempty" json:"value,omitempty"`
}

// DrugEffect represents a drug effect
type DrugEffect struct {
// Level represents level
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 1, 2
	Level *int `xml:"level,omitempty" json:"level,omitempty"`
	Attribute []DrugEffectAttribute `xml:"attribute,omitempty" json:"attribute,omitempty"`
	CrashDamage *int `xml:"crashdamage,omitempty" json:"crashdamage,omitempty"`
	Duration *int `xml:"duration,omitempty" json:"duration,omitempty"`
	InitiativeDice *int `xml:"initiativedice,omitempty" json:"initiativedice,omitempty"`
	Info *string `xml:"info,omitempty" json:"info,omitempty"`
	Limit []DrugEffectLimit `xml:"limit,omitempty" json:"limit,omitempty"`
	Quality *string `xml:"quality,omitempty" json:"quality,omitempty"`
	Speed *int `xml:"speed,omitempty" json:"speed,omitempty"`
}

// DrugEffects represents a collection of drug effects
type DrugEffects struct {
	Effect []DrugEffect `xml:"effect" json:"effect"`
}

// DrugComponent represents a drug component definition
type DrugComponent struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 22
// Examples: 33ae6b1c-62f6-4824-967d-0e2b37c7d1b9, ca5e7e5e-6aab-472a-a273-6d21d4e9ad2e, cf8a2d2b-03b9-4440-873b-829c7d82489e (and 7 more)
// Enum Candidate: Yes
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	Effects DrugEffects `xml:"effects" json:"effects"`
	Availability string `xml:"availability" json:"availability"`
	Cost int `xml:"cost" json:"cost"`
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
	Threshold *int `xml:"threshold,omitempty" json:"threshold,omitempty"`
	Source string `xml:"source" json:"source"`
	Page int `xml:"page" json:"page"`
}

// DrugComponents represents a collection of drug components
type DrugComponents struct {
	DrugComponent []DrugComponent `xml:"drugcomponent" json:"drugcomponent"`
}

// DrugComponentsChummer represents the root chummer element for drug components
type DrugComponentsChummer struct {
	Grades *DrugGrades `xml:"grades,omitempty" json:"grades,omitempty"`
	DrugComponents DrugComponents `xml:"drugcomponents" json:"drugcomponents"`
}

