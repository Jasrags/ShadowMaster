package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains paragon structures generated from paragons.xsd

// ParagonCategory represents a paragon category
type ParagonCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// ParagonCategories represents a collection of paragon categories
type ParagonCategories struct {
	Category []ParagonCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// ParagonChoice represents a paragon choice
type ParagonChoice struct {
	Name string `xml:"name" json:"name"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Set *int `xml:"set,attr,omitempty" json:"+@set,omitempty"`
}

// ParagonChoices represents a collection of paragon choices
type ParagonChoices struct {
	Choice []ParagonChoice `xml:"choice" json:"choice"`
}

// Paragon represents a paragon
type Paragon struct {
	ID string `xml:"id" json:"id"`
	common.Visibility
	Name string `xml:"name" json:"name"`
	Category *string `xml:"category,omitempty" json:"category,omitempty"`
	Advantage string `xml:"advantage" json:"advantage"`
	Disadvantage string `xml:"disadvantage" json:"disadvantage"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Choices *ParagonChoices `xml:"choices,omitempty" json:"choices,omitempty"`
	common.SourceReference
}

// Paragons represents a collection of paragons
type Paragons struct {
	Paragon []Paragon `xml:"paragon,omitempty" json:"paragon,omitempty"`
}

// ParagonsChummer represents the root chummer element for paragons
type ParagonsChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []ParagonCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Paragons []Paragons `xml:"paragons,omitempty" json:"paragons,omitempty"`
}

