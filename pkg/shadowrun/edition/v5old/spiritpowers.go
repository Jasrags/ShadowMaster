package v5

// This file contains spirit power structures generated from spiritpowers.xml

// SpiritPowerItem represents a spirit power definition
type SpiritPowerItem struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 85
// Examples: Accident, Animal Control, Armor (and 7 more)
// Length: 4-28 characters
	Name   string `xml:"name" json:"name"`
	Source string `xml:"source" json:"source"`
	Page   string `xml:"page" json:"page"`
}

// SpiritPowerItems represents a collection of spirit powers
type SpiritPowerItems struct {
	Power []SpiritPowerItem `xml:"power" json:"power"`
}

// SpiritPowersChummer represents the root chummer element for spirit powers
type SpiritPowersChummer struct {
	Powers SpiritPowerItems `xml:"powers" json:"powers"`
}
