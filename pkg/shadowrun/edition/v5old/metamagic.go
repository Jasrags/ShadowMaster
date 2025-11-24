package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains metamagic structures generated from metamagic.xsd

// MetamagicItem represents a metamagic definition
type MetamagicItem struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 18
// Examples: 5b922bcf-4114-4c49-a4f3-0f3dcb45dd2f, fa64531c-5f86-45a0-aaaf-b8425a5b6dd1, 9613228a-6c83-41f4-beaa-20ce6276334f (and 7 more)
// Enum Candidate: Yes
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 18
// Examples: Geomancy, Necromancy, Psychometry (and 7 more)
// Enum Candidate: Yes
// Length: 7-23 characters
	Name string `xml:"name" json:"name"`
// Adept represents adept
// Type: boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: True, False, False (and 7 more)
// Note: 100.0% of values are boolean strings
// Enum Candidate: False, True
// Length: 4-5 characters
	Adept string `xml:"adept" json:"adept"`
// Magician represents magician
// Type: boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: False, True, True (and 7 more)
// Note: 100.0% of values are boolean strings
// Enum Candidate: False, True
// Length: 4-5 characters
	Magician string `xml:"magician" json:"magician"`
	common.SourceReference
	common.Visibility
// Limit represents limit
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: False
// Note: 100.0% of values are boolean strings
	Limit *string `xml:"limit,omitempty" json:"limit,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
}

// MetamagicItems represents a collection of metamagic
type MetamagicItems struct {
	Metamagic []MetamagicItem `xml:"metamagic,omitempty" json:"metamagic,omitempty"`
}

// Art represents an art definition
type Art struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 18
// Examples: 5b922bcf-4114-4c49-a4f3-0f3dcb45dd2f, fa64531c-5f86-45a0-aaaf-b8425a5b6dd1, 9613228a-6c83-41f4-beaa-20ce6276334f (and 7 more)
// Enum Candidate: Yes
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 18
// Examples: Geomancy, Necromancy, Psychometry (and 7 more)
// Enum Candidate: Yes
// Length: 7-23 characters
	Name string `xml:"name" json:"name"`
	common.SourceReference
}

// Arts represents a collection of arts
type Arts struct {
	Art []Art `xml:"art,omitempty" json:"art,omitempty"`
}

// MetamagicChummer represents the root chummer element for metamagic
type MetamagicChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Metamagics []MetamagicItems `xml:"metamagics,omitempty" json:"metamagics,omitempty"`
	Arts []Arts `xml:"arts,omitempty" json:"arts,omitempty"`
}

