package v5

// This file contains string constant structures generated from strings.xml

// MatrixAttributes represents a collection of matrix attribute keys
type MatrixAttributes struct {
	Key []string `xml:"key" json:"key"`
}

// Elements represents a collection of element types
type Elements struct {
	Element []string `xml:"element" json:"element"`
}

// Immunities represents a collection of immunity types
type Immunities struct {
	Immunity []string `xml:"immunity" json:"immunity"`
}

// SpiritCategories represents a collection of spirit categories
type SpiritCategories struct {
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Combat, Detection, Health (and 2 more)
// Enum Candidate: Combat, Detection, Health, Illusion, Manipulation
// Length: 6-12 characters
	Category []string `xml:"category" json:"category"`
}

// StringsChummer represents the root chummer element for strings
type StringsChummer struct {
	MatrixAttributes MatrixAttributes `xml:"matrixattributes" json:"matrixattributes"`
	Elements Elements `xml:"elements" json:"elements"`
	Immunities Immunities `xml:"immunities" json:"immunities"`
	SpiritCategories SpiritCategories `xml:"spiritcategories" json:"spiritcategories"`
}

