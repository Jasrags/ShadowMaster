package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains metamagic structures generated from metamagic.xsd

// MetamagicItem represents a metamagic definition
type MetamagicItem struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Adept string `xml:"adept" json:"adept"`
	Magician string `xml:"magician" json:"magician"`
	common.SourceReference
	common.Visibility
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
	ID string `xml:"id" json:"id"`
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

