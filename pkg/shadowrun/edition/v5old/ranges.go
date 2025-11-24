package v5

// This file contains range structures generated from ranges.xsd

// RangeModifiers represents range modifiers
type RangeModifiers struct {
// Short represents short
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 13
// Examples: 5, 5, 5 (and 7 more)
// Note: 80.6% of values are numeric strings
// Enum Candidate: 10, 15, 2, 25, 40, 5, 50, 6, 70, 9, {STR}, {STR}*2, {STR}/2
// Length: 1-7 characters
	Short *string `xml:"short,omitempty" json:"short,omitempty"`
	Medium *string `xml:"medium,omitempty" json:"medium,omitempty"`
	Long *string `xml:"long,omitempty" json:"long,omitempty"`
	Extreme *string `xml:"extreme,omitempty" json:"extreme,omitempty"`
}

// Range represents a range definition
type Range struct {
	Name string `xml:"name" json:"name"`
	Min *string `xml:"min,omitempty" json:"min,omitempty"`
// Short represents short
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 13
// Examples: 5, 5, 5 (and 7 more)
// Note: 80.6% of values are numeric strings
// Enum Candidate: 10, 15, 2, 25, 40, 5, 50, 6, 70, 9, {STR}, {STR}*2, {STR}/2
// Length: 1-7 characters
	Short *string `xml:"short,omitempty" json:"short,omitempty"`
	Medium *string `xml:"medium,omitempty" json:"medium,omitempty"`
	Long *string `xml:"long,omitempty" json:"long,omitempty"`
	Extreme *string `xml:"extreme,omitempty" json:"extreme,omitempty"`
}

// Ranges represents a collection of ranges
type Ranges struct {
	Range []Range `xml:"range" json:"range"`
}

// RangesChummer represents the root chummer element for ranges
type RangesChummer struct {
	Modifiers RangeModifiers `xml:"modifiers" json:"modifiers"`
	Ranges []Ranges `xml:"ranges,omitempty" json:"ranges,omitempty"`
}

