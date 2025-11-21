package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains martial arts structures generated from martialarts.xsd

// Technique represents a martial art technique
type Technique struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 79
// Examples: Ballestra, Barbed Hooks, Bending of the Reed (and 7 more)
// Length: 5-49 characters
	Name string `xml:"name" json:"name"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
}

// Techniques represents a collection of techniques
type Techniques struct {
	Technique []Technique `xml:"technique,omitempty" json:"technique,omitempty"`
}

// MartialArt represents a martial art
type MartialArt struct {
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 79
// Examples: d2234863-297d-4a61-a939-ff263381e209, c46f550f-3148-4b91-a0fa-299a57e7879c, 378a6f47-9375-4810-8324-4a6230cd6914 (and 7 more)
	ID string `xml:"id" json:"id"`
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 79
// Examples: Ballestra, Barbed Hooks, Bending of the Reed (and 7 more)
// Length: 5-49 characters
	Name string `xml:"name" json:"name"`
// Cost represents cost
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 15
// Note: 100.0% of values are numeric strings
	Cost *int `xml:"cost,omitempty" json:"cost,omitempty"`
	common.Visibility
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	AllTechniques *string `xml:"alltechniques,omitempty" json:"alltechniques,omitempty"`
	Techniques *Techniques `xml:"techniques,omitempty" json:"techniques,omitempty"`
	common.SourceReference
}

// MartialArts represents a collection of martial arts
type MartialArts struct {
	MartialArt []MartialArt `xml:"martialart,omitempty" json:"martialart,omitempty"`
}

// TechniqueItem represents a standalone martial art technique
type TechniqueItem struct {
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 79
// Examples: d2234863-297d-4a61-a939-ff263381e209, c46f550f-3148-4b91-a0fa-299a57e7879c, 378a6f47-9375-4810-8324-4a6230cd6914 (and 7 more)
	ID string `xml:"id" json:"id"`
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 79
// Examples: Ballestra, Barbed Hooks, Bending of the Reed (and 7 more)
// Length: 5-49 characters
	Name string `xml:"name" json:"name"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	common.Visibility
	common.SourceReference
}

// TechniqueItems represents a collection of standalone techniques
type TechniqueItems struct {
	Technique []TechniqueItem `xml:"technique,omitempty" json:"technique,omitempty"`
}

// MartialArtsChummer represents the root chummer element for martial arts
type MartialArtsChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	MartialArts []MartialArts `xml:"martialarts,omitempty" json:"martialarts,omitempty"`
	Techniques []TechniqueItems `xml:"techniques,omitempty" json:"techniques,omitempty"`
}

