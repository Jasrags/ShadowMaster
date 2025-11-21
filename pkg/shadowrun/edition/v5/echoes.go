package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains echo structures generated from echoes.xsd

// Echo represents an echo
type Echo struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	common.SourceReference
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	common.Visibility
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

