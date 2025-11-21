package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains spell structures generated from spells.xsd

// SpellCategory represents a spell category
type SpellCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
// UseSkill represents useskill
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Animal Handling
	UseSkill *string `xml:"useskill,attr,omitempty" json:"+@useskill,omitempty"`
	AlchemicalSkill *string `xml:"alchemicalskill,attr,omitempty" json:"+@alchemicalskill,omitempty"`
	BarehandedAdeptSkill *string `xml:"barehandedadeptskill,attr,omitempty" json:"+@barehandedadeptskill,omitempty"`
}

// SpellCategories represents a collection of spell categories
type SpellCategories struct {
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: Combat, Combat, Combat (and 7 more)
// Enum Candidate: Combat, Detection, Enchantments, Health, Illusion, Manipulation, Rituals
// Length: 6-12 characters
	Category []SpellCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// Spell represents a spell definition
type Spell struct {
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 363
// Examples: c78d91cc-fa02-48c3-a243-28823a2038ef, 87cb3685-22e8-46fa-890f-f3cfef10a71f, 10dd2924-36c6-42a3-8715-694c29c1fd48 (and 7 more)
	ID string `xml:"id" json:"id"`
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 358
// Examples: Acid Stream, Toxic Wave, Punch (and 7 more)
// Length: 3-28 characters
	Name string `xml:"name" json:"name"`
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: Combat, Combat, Combat (and 7 more)
// Enum Candidate: Combat, Detection, Enchantments, Health, Illusion, Manipulation, Rituals
// Length: 6-12 characters
	Category string `xml:"category" json:"category"`
// Damage represents damage
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: P, P, S (and 7 more)
// Note: 84.6% of values are numeric strings
// Note: 84.6% of values are boolean strings
// Enum Candidate: 0, P, S, Special
// Length: 1-7 characters
	Damage string `xml:"damage" json:"damage"`
// Descriptor represents descriptor
// Usage: always present (100.0%)
// Unique Values: 69
// Examples: Indirect, Elemental, Indirect, Elemental, Area, Indirect (and 7 more)
// Length: 4-30 characters
	Descriptor string `xml:"descriptor" json:"descriptor"`
// Duration represents duration
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: I, I, I (and 7 more)
// Enum Candidate: I, P, S, Special
// Length: 1-7 characters
	Duration string `xml:"duration" json:"duration"`
// DV represents dv
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 14
// Examples: F-3, F-1, F-6 (and 7 more)
// Enum Candidate: 0, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3, F-4, F-5, F-6, Special
// Length: 1-7 characters
	DV string `xml:"dv" json:"dv"`
// Range represents range
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: LOS, LOS (A), T (and 7 more)
// Enum Candidate: LOS, LOS (A), S, S (A), Special, T, T (A)
// Length: 1-7 characters
	Range string `xml:"range" json:"range"`
	Type string `xml:"type" json:"type"`
	common.SourceReference
	common.Visibility
// UseSkill represents useskill
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Animal Handling
	UseSkill *string `xml:"useskill,omitempty" json:"useskill,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
}

// Spells represents a collection of spells
type Spells struct {
	Spell []Spell `xml:"spell,omitempty" json:"spell,omitempty"`
}

// SpellsChummer represents the root chummer element for spells
type SpellsChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []SpellCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Spells []Spells `xml:"spells,omitempty" json:"spells,omitempty"`
}

