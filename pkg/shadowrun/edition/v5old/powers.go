package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains power structures generated from powers.xsd

// PowerIncludeInLimit represents include in limit for powers
type PowerIncludeInLimit struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 11
// Examples: Air Walking, Pied Piper, Skin Artist (and 7 more)
// Enum Candidate: Air Walking, Barrage, Claws, Digital Celerity, Hot Qi, Master of Taijiquan, Master of the Nine Chakras, Pied Piper, Shadow Touch, Silver-Tongued Devil, Skin Artist
// Length: 5-26 characters
	Name []string `xml:"name,omitempty" json:"name,omitempty"`
}

// AdeptWayRequires represents adept way requirements
type AdeptWayRequires struct {
	MagiciansWayForbids *string `xml:"magicianswayforbids,omitempty" json:"magicianswayforbids,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
}

// PowerItem represents a power definition
type PowerItem struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 11
// Examples: 8dc0a8e3-535a-4935-8c90-2079666e6a01, 19bafb80-2f5a-4370-8cbe-875477ce7471, 855a7a07-5def-4ec5-bb69-29273327b885 (and 7 more)
// Enum Candidate: 19bafb80-2f5a-4370-8cbe-875477ce7471, 215a5a0e-09fc-47ff-9a84-74c99f4f1a53, 25f6368f-21ef-4544-ac55-3c20d8a60374, 2d2939f0-486c-4915-bbeb-084b857c2450, 3f0a99c7-6524-46cb-b43e-070a978c5052, 47cb80a1-a11b-4a60-a557-feada7114379, 855a7a07-5def-4ec5-bb69-29273327b885, 8dc0a8e3-535a-4935-8c90-2079666e6a01, e5cf0578-be0f-4453-9223-118234d3e749, e66fac54-39e4-4e3e-92c6-670485c28c25, fafc7fd4-8418-4a86-b396-6e90943d9e68
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 11
// Examples: Air Walking, Pied Piper, Skin Artist (and 7 more)
// Enum Candidate: Air Walking, Barrage, Claws, Digital Celerity, Hot Qi, Master of Taijiquan, Master of the Nine Chakras, Pied Piper, Shadow Touch, Silver-Tongued Devil, Skin Artist
// Length: 5-26 characters
	Name string `xml:"name" json:"name"`
// Points represents points
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: 0.25, 1, 0.25 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 0.25, 0.5, 0.75, 1, 1.5
// Length: 1-4 characters
	Points float64 `xml:"points" json:"points"`
// Levels represents levels
// Type: boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: True, False, True (and 7 more)
// Note: 100.0% of values are boolean strings
// Enum Candidate: False, True
// Length: 4-5 characters
	Levels string `xml:"levels" json:"levels"`
// Limit represents limit
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 1, 1, 4 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 88.1% of values are boolean strings
// Enum Candidate: 1, 100, 12, 20, 4
// Length: 1-3 characters
	Limit int `xml:"limit" json:"limit"`
// Source represents source
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: SG, SG, SG (and 7 more)
	Source string `xml:"source" json:"source"`
// Page represents page
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: 156, 156, 157 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 156, 157, 158, 159
	Page int `xml:"page" json:"page"`
	common.Visibility
	IncludeInLimit *PowerIncludeInLimit `xml:"includeinlimit,omitempty" json:"includeinlimit,omitempty"`
// Action represents action
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Free, Simple, Simple (and 7 more)
// Enum Candidate: Complex, Free, Interrupt, Simple, Special
// Length: 4-9 characters
	Action *string `xml:"action,omitempty" json:"action,omitempty"`
// AdeptWay represents adeptway
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 0.5, 0.25, 0.25 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0.25, 0.5, 0.75
// Length: 3-4 characters
	AdeptWay *float64 `xml:"adeptway,omitempty" json:"adeptway,omitempty"`
	AdeptWayRequires *AdeptWayRequires `xml:"adeptwayrequires,omitempty" json:"adeptwayrequires,omitempty"`
// Bonus represents bonus
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: Rating, Rating, Rating (and 7 more)
// Enum Candidate: 1, 2, Rating
// Length: 1-6 characters
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
// DoubleCost represents doublecost
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: False
// Note: 100.0% of values are boolean strings
	DoubleCost *string `xml:"doublecost,omitempty" json:"doublecost,omitempty"`
// ExtraPointCost represents extrapointcost
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0.5
// Note: 100.0% of values are numeric strings
	ExtraPointCost *float64 `xml:"extrapointcost,omitempty" json:"extrapointcost,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
// MaxLevels represents maxlevels
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 3, 3, 3 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 3, 4, 6
	MaxLevels *int `xml:"maxlevels,omitempty" json:"maxlevels,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
}

// PowerItems represents a collection of powers
type PowerItems struct {
	Power []PowerItem `xml:"power" json:"power"`
}

// EnhancementAdeptWayRequires represents adept way requirements for enhancements
type EnhancementAdeptWayRequires struct {
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
}

// Enhancement represents an enhancement definition
type Enhancement struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 11
// Examples: 8dc0a8e3-535a-4935-8c90-2079666e6a01, 19bafb80-2f5a-4370-8cbe-875477ce7471, 855a7a07-5def-4ec5-bb69-29273327b885 (and 7 more)
// Enum Candidate: 19bafb80-2f5a-4370-8cbe-875477ce7471, 215a5a0e-09fc-47ff-9a84-74c99f4f1a53, 25f6368f-21ef-4544-ac55-3c20d8a60374, 2d2939f0-486c-4915-bbeb-084b857c2450, 3f0a99c7-6524-46cb-b43e-070a978c5052, 47cb80a1-a11b-4a60-a557-feada7114379, 855a7a07-5def-4ec5-bb69-29273327b885, 8dc0a8e3-535a-4935-8c90-2079666e6a01, e5cf0578-be0f-4453-9223-118234d3e749, e66fac54-39e4-4e3e-92c6-670485c28c25, fafc7fd4-8418-4a86-b396-6e90943d9e68
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 11
// Examples: Air Walking, Pied Piper, Skin Artist (and 7 more)
// Enum Candidate: Air Walking, Barrage, Claws, Digital Celerity, Hot Qi, Master of Taijiquan, Master of the Nine Chakras, Pied Piper, Shadow Touch, Silver-Tongued Devil, Skin Artist
// Length: 5-26 characters
	Name string `xml:"name" json:"name"`
// Power represents power
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 10
// Examples: Light Body, Melanin Control, Keratin Control (and 7 more)
// Enum Candidate: Commanding Voice, Counterstrike, Keratin Control, Light Body, Living Focus, Melanin Control, Missile Mastery, Nerve Strike, Nimble Fingers, Traceless Walk
// Length: 10-16 characters
	Power string `xml:"power" json:"power"`
// Source represents source
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: SG, SG, SG (and 7 more)
	Source string `xml:"source" json:"source"`
// Page represents page
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: 156, 156, 157 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 156, 157, 158, 159
	Page int `xml:"page" json:"page"`
	common.Visibility
	AdeptWayRequires *EnhancementAdeptWayRequires `xml:"adeptwayrequires,omitempty" json:"adeptwayrequires,omitempty"`
// Bonus represents bonus
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: Rating, Rating, Rating (and 7 more)
// Enum Candidate: 1, 2, Rating
// Length: 1-6 characters
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
}

// Enhancements represents a collection of enhancements
type Enhancements struct {
	Enhancement []Enhancement `xml:"enhancement" json:"enhancement"`
}

// PowersChummer represents the root chummer element for powers
type PowersChummer struct {
	Version int `xml:"version" json:"version"`
	Powers PowerItems `xml:"powers" json:"powers"`
	Enhancements Enhancements `xml:"enhancements" json:"enhancements"`
}

