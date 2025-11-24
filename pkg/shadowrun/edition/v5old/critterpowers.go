package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains critter power structures generated from critterpowers.xsd

// CritterPowerCategory represents a critter power category
type CritterPowerCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// CritterPowerCategories represents a collection of critter power categories
type CritterPowerCategories struct {
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Ground
	Category []CritterPowerCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// CritterPowerItem represents a critter power definition
type CritterPowerItem struct {
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 291
// Examples: 57dd33b3-7fea-421e-bcf3-336d56ea08b5, a3f11764-2569-48a1-8eb8-8cdae58b23e8, 410c17d0-0490-4e67-b2ca-4ad5e2feb016 (and 7 more)
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 8
// Examples: BOD, AGI, REA (and 5 more)
// Enum Candidate: AGI, BOD, CHA, INT, LOG, REA, STR, WIL
	Name string `xml:"name" json:"name"`
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Ground
	Category string `xml:"category" json:"category"`
// Type represents type
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 10
// Examples: M, P, M (and 7 more)
// Enum Candidate: As Spell, As ritual, Device, File, Host, Icon, M, P, Persona, Persona or Device
// Length: 1-17 characters
	Type string `xml:"type" json:"type"`
// Action represents action
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: Simple, Complex, Complex (and 7 more)
// Enum Candidate: As ritual, Auto, Complex, Free, None, Simple, Special
// Length: 4-9 characters
	Action string `xml:"action" json:"action"`
// Range represents range
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 11
// Examples: MAG x 50, LOS, LOS (and 7 more)
// Enum Candidate: As ritual, LOS, LOS (A), MAG, MAG x 25 m, MAG x 50, Per Spell, Self, Special, Touch, Touch or LOS
// Length: 3-12 characters
	Range string `xml:"range" json:"range"`
// Duration represents duration
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: Always, Instant, Sustained (and 7 more)
// Enum Candidate: Always, As ritual, F x 10 Combat Turns, Instant, Per Spell, Permanent, Predetermined by Sprite, Special, Sustained
// Length: 6-23 characters
	Duration string `xml:"duration" json:"duration"`
	common.SourceReference
	common.Visibility
// Toxic represents toxic
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: True, True, True (and 7 more)
// Note: 100.0% of values are boolean strings
	Toxic *string `xml:"toxic,omitempty" json:"toxic,omitempty"`
// Rating represents rating
// Type: mixed_numeric, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: True, True, True (and 7 more)
// Note: 90.0% of values are boolean strings
// Enum Candidate: 2, 20, True
// Length: 1-4 characters
	Rating *string `xml:"rating,omitempty" json:"rating,omitempty"`
// Bonus represents bonus
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: 4, 1, 2 (and 5 more)
// Note: 87.5% of values are numeric strings
// Enum Candidate: 1, 2, 4, Rating
// Length: 1-6 characters
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
// Karma represents karma
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 10
// Examples: 9, 9, 50 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 12, 14, 16, 25, 3, 5, 50, 6, 8, 9
// Length: 1-2 characters
	Karma *string `xml:"karma,omitempty" json:"karma,omitempty"`
}

// CritterPowerItems represents a collection of critter powers
type CritterPowerItems struct {
	Power []CritterPowerItem `xml:"power,omitempty" json:"power,omitempty"`
}

// CritterPowersChummer represents the root chummer element for critter powers
type CritterPowersChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []CritterPowerCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Powers []CritterPowerItems `xml:"powers,omitempty" json:"powers,omitempty"`
}

