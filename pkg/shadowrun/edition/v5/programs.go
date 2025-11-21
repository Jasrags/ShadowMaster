package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains program structures generated from programs.xsd

// ProgramCategory represents a program category
type ProgramCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// ProgramCategories represents a collection of program categories
type ProgramCategories struct {
	Category []ProgramCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// Tags represents tags
type Tags struct {
	Tag []string `xml:"tag" json:"tag"`
}

// ProgramItem represents a program definition
type ProgramItem struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	common.SourceReference
	common.Visibility
	Tags *Tags `xml:"tags,omitempty" json:"tags,omitempty"`
	Rating *string `xml:"rating,omitempty" json:"rating,omitempty"`
	MinRating *string `xml:"minrating,omitempty" json:"minrating,omitempty"`
	ComplexForm *string `xml:"complexform,omitempty" json:"complexform,omitempty"`
	Avail *string `xml:"avail,omitempty" json:"avail,omitempty"`
	Cost *string `xml:"cost,omitempty" json:"cost,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
}

// ProgramItems represents a collection of programs
type ProgramItems struct {
	Program []ProgramItem `xml:"program,omitempty" json:"program,omitempty"`
}

// ProgramTypes represents program types
type ProgramTypes struct {
	ProgramType []string `xml:"programtype" json:"programtype"`
}

// OptionTags represents tags for options
type OptionTags struct {
	Tag []string `xml:"tag" json:"tag"`
}

// Option represents a program option
type Option struct {
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	MaxRating string `xml:"maxrating" json:"maxrating"`
	ComplexForm string `xml:"complexform" json:"complexform"`
	common.SourceReference
	common.Visibility
	ProgramTypes *ProgramTypes `xml:"programtypes,omitempty" json:"programtypes,omitempty"`
	Tags *OptionTags `xml:"tags,omitempty" json:"tags,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
}

// Options represents a collection of options
type Options struct {
	Option []Option `xml:"option,omitempty" json:"option,omitempty"`
}

// ProgramsChummer represents the root chummer element for programs
type ProgramsChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []ProgramCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Programs []ProgramItems `xml:"programs,omitempty" json:"programs,omitempty"`
	Options []Options `xml:"options,omitempty" json:"options,omitempty"`
}

