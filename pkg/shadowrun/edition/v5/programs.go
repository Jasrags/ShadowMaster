package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains program structures generated from programs.xsd

// ProgramCategory represents a program category
type ProgramCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// ProgramCategories represents a collection of program categories
type ProgramCategories struct {
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Common Programs, Common Programs, Common Programs (and 7 more)
// Enum Candidate: Advanced Programs, Autosofts, Common Programs, Hacking Programs, Software
// Length: 8-17 characters
	Category []ProgramCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// Tags represents tags
type Tags struct {
	Tag []string `xml:"tag" json:"tag"`
}

// ProgramItem represents a program definition
type ProgramItem struct {
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 71
// Examples: bed1f6eb-ead9-49aa-bb24-266c21d7aeb4, 734f653b-35ca-4b26-b837-f64662878e8f, dd35285a-7506-4b7e-8d5a-1b6ea8577e19 (and 7 more)
	ID string `xml:"id" json:"id"`
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 71
// Examples: Browse, Configurator, Edit (and 7 more)
// Length: 4-28 characters
	Name string `xml:"name" json:"name"`
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Common Programs, Common Programs, Common Programs (and 7 more)
// Enum Candidate: Advanced Programs, Autosofts, Common Programs, Hacking Programs, Software
// Length: 8-17 characters
	Category string `xml:"category" json:"category"`
	common.SourceReference
	common.Visibility
	Tags *Tags `xml:"tags,omitempty" json:"tags,omitempty"`
// Rating represents rating
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 2, 3, 6
	Rating *string `xml:"rating,omitempty" json:"rating,omitempty"`
// MinRating represents minrating
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 3, 2
// Note: 100.0% of values are numeric strings
// Enum Candidate: 2, 3
	MinRating *string `xml:"minrating,omitempty" json:"minrating,omitempty"`
	ComplexForm *string `xml:"complexform,omitempty" json:"complexform,omitempty"`
// Avail represents avail
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: 0, 0, 0 (and 7 more)
// Enum Candidate: (Rating * 2)R, 0, 0F, 12F, 4, 4R, 6R, Rating * 2, Rating * 3
// Length: 1-13 characters
	Avail *string `xml:"avail,omitempty" json:"avail,omitempty"`
// Cost represents cost
// Type: numeric_string, mixed_boolean
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: 80, 80, 80 (and 7 more)
// Note: 85.9% of values are numeric strings
// Length: 1-56 characters
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
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 71
// Examples: Browse, Configurator, Edit (and 7 more)
// Length: 4-28 characters
	Name string `xml:"name" json:"name"`
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Common Programs, Common Programs, Common Programs (and 7 more)
// Enum Candidate: Advanced Programs, Autosofts, Common Programs, Hacking Programs, Software
// Length: 8-17 characters
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

