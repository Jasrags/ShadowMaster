package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains echo structures generated from echoes.xsd

// Echo represents an echo
type Echo struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 29
// Examples: 36aa9af4-5c04-40d9-ba09-31b401cc1ff0, cd2e640c-06b7-4638-9eb4-bf75c28452a2, 4550fe9d-e5da-4b01-8115-14f7a0dfab1c (and 7 more)
// Enum Candidate: Yes
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: LOG, WIL
// Enum Candidate: LOG, WIL
	Name string `xml:"name" json:"name"`
	common.SourceReference
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	common.Visibility
// Limit represents limit
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Mental
	Limit *string `xml:"limit,omitempty" json:"limit,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
}

// Echoes represents a collection of echoes
type Echoes struct {
	Echo []Echo `xml:"echo,omitempty" json:"echo,omitempty"`
}

// EchoesChummer represents the root chummer element for echoes
type EchoesChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Echoes []Echoes `xml:"echoes,omitempty" json:"echoes,omitempty"`
}

