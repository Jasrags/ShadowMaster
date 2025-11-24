package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains metatype structures generated from metatypes.xsd

// Quality represents a quality with optional attributes
type Quality struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Removable *string `xml:"removable,attr,omitempty" json:"+@removable,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// Power represents a power with optional attributes
type Power struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
	Cost *string `xml:"cost,attr,omitempty" json:"+@cost,omitempty"`
}

// PositiveQualities represents positive qualities
type PositiveQualities struct {
// Quality represents quality
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 43
// Examples: Bad Luck, Bad Rep, Code of Honor (and 7 more)
// Enum Candidate: Yes
// Length: 6-32 characters
	Quality []Quality `xml:"quality,omitempty" json:"quality,omitempty"`
}

// NegativeQualities represents negative qualities
type NegativeQualities struct {
// Quality represents quality
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 43
// Examples: Bad Luck, Bad Rep, Code of Honor (and 7 more)
// Enum Candidate: Yes
// Length: 6-32 characters
	Quality []Quality `xml:"quality,omitempty" json:"quality,omitempty"`
}

// Qualities represents a collection of qualities
type Qualities struct {
	Positive *PositiveQualities `xml:"positive,omitempty" json:"positive,omitempty"`
	Negative *NegativeQualities `xml:"negative,omitempty" json:"negative,omitempty"`
}

// Powers represents a collection of powers
type Powers struct {
	Power []Power `xml:"power,omitempty" json:"power,omitempty"`
}

// OptionalPowers represents optional powers
type OptionalPowers struct {
	Power []Power `xml:"power,omitempty" json:"power,omitempty"`
}

// Metavariant represents a metavariant
type Metavariant struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 12
// Examples: Bite (Canine Form), Bite (Canine Form), Bite (Canine Form) (and 7 more)
// Enum Candidate: Bite (Canine Form), Bite (Falconine Form), Bite (Leonine Form), Bite (Lupine Form), Bite (Pantherine Form), Bite (Phocine Form), Bite (Seal Form), Bite (Tigrine Form), Bite (Ursine Form), Bite (Vulpine Form), Claws, Talons (Falconine Form)
// Length: 5-23 characters
	Name string `xml:"name" json:"name"`
	common.Visibility
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Metavariant, Metavariant, Metavariant (and 7 more)
	Category string `xml:"category" json:"category"`
// Karma represents karma
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 45
// Examples: 40, 90, 60 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: Yes
// Length: 2-3 characters
	Karma string `xml:"karma" json:"karma"`
	Powers *Powers `xml:"powers,omitempty" json:"powers,omitempty"`
	Qualities *Qualities `xml:"qualities,omitempty" json:"qualities,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	common.SourceReference
}

// MetatypeSkill represents a skill with optional attributes for metatypes
type MetatypeSkill struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
	Spec *string `xml:"spec,attr,omitempty" json:"+@spec,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// MetatypeSkillGroup represents a skill group for metatypes
type MetatypeSkillGroup struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// MetatypeKnowledge represents a knowledge skill for metatypes
type MetatypeKnowledge struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Metavariant, Metavariant, Metavariant (and 7 more)
	Category *string `xml:"category,attr,omitempty" json:"+@category,omitempty"`
}

// MetatypeSkills represents a collection of skills for metatypes
type MetatypeSkills struct {
	Skill []MetatypeSkill `xml:"skill,omitempty" json:"skill,omitempty"`
	Group []MetatypeSkillGroup `xml:"group,omitempty" json:"group,omitempty"`
	Knowledge []MetatypeKnowledge `xml:"knowledge,omitempty" json:"knowledge,omitempty"`
}

// ComplexForm represents a complex form
type ComplexForm struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Metavariant, Metavariant, Metavariant (and 7 more)
	Category *string `xml:"category,attr,omitempty" json:"+@category,omitempty"`
	Option *string `xml:"option,attr,omitempty" json:"+@option,omitempty"`
	OptionRating *string `xml:"optionrating,attr,omitempty" json:"+@optionrating,omitempty"`
	OptionSelect *string `xml:"optionselect,attr,omitempty" json:"+@optionselect,omitempty"`
}

// ComplexForms represents a collection of complex forms
type ComplexForms struct {
	ComplexForm []ComplexForm `xml:"complexform,omitempty" json:"complexform,omitempty"`
}

// OptionalComplexForms represents optional complex forms
type OptionalComplexForms struct {
	ComplexForm []ComplexForm `xml:"complexform,omitempty" json:"complexform,omitempty"`
}

// Gear represents a gear item
type Gear struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// Gears represents a collection of gear items
type Gears struct {
	Gear []Gear `xml:"gear,omitempty" json:"gear,omitempty"`
}

// QualityRestriction represents quality restrictions
type QualityRestriction struct {
	Positive *PositiveQualities `xml:"positive,omitempty" json:"positive,omitempty"`
	Negative *NegativeQualities `xml:"negative,omitempty" json:"negative,omitempty"`
}

// Metavariants represents a collection of metavariants
type Metavariants struct {
	Metavariant []Metavariant `xml:"metavariant,omitempty" json:"metavariant,omitempty"`
}

// Metatype represents a metatype definition
type Metatype struct {
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 262
// Examples: abfd41e2-3db6-4c02-b404-11f92e426279, bdb50e49-57c6-4179-a78f-9f56003b40ef, 55295969-101d-48fb-a009-b8289c2a6af9 (and 7 more)
	ID string `xml:"id" json:"id"`
	common.Visibility
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 12
// Examples: Bite (Canine Form), Bite (Canine Form), Bite (Canine Form) (and 7 more)
// Enum Candidate: Bite (Canine Form), Bite (Falconine Form), Bite (Leonine Form), Bite (Lupine Form), Bite (Pantherine Form), Bite (Phocine Form), Bite (Seal Form), Bite (Tigrine Form), Bite (Ursine Form), Bite (Vulpine Form), Claws, Talons (Falconine Form)
// Length: 5-23 characters
	Name *string `xml:"name,omitempty" json:"name,omitempty"`
	ForceCreature *string `xml:"forcecreature,omitempty" json:"forcecreature,omitempty"`
// Karma represents karma
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 45
// Examples: 40, 90, 60 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: Yes
// Length: 2-3 characters
	Karma *string `xml:"karma,omitempty" json:"karma,omitempty"`
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Metavariant, Metavariant, Metavariant (and 7 more)
	Category string `xml:"category" json:"category"`
// BodMin represents bodmin
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 8
// Examples: 1, 1, 1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 1, 121, 2, 3, 4, 5, 6
// Length: 1-3 characters
	BodMin string `xml:"bodmin" json:"bodmin"`
// BodMax represents bodmax
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: 6, 6, 5 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 10, 11, 4, 5, 6, 7, 8, 9
// Length: 1-2 characters
	BodMax string `xml:"bodmax" json:"bodmax"`
// BodAug represents bodaug
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: 10, 10, 9 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 10, 11, 12, 13, 14, 15, 8, 9
// Length: 1-2 characters
	BodAug string `xml:"bodaug" json:"bodaug"`
// AgiMin represents agimin
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: 1, 2, 3 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 1, 2, 3
	AgiMin string `xml:"agimin" json:"agimin"`
// AgiMax represents agimax
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 6, 7, 8 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 5, 6, 7, 8
	AgiMax string `xml:"agimax" json:"agimax"`
// AgiAug represents agiaug
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 10, 11, 12 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 10, 11, 12, 9
// Length: 1-2 characters
	AgiAug string `xml:"agiaug" json:"agiaug"`
// ReaMin represents reamin
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 1, 1, 1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 95.4% of values are boolean strings
// Enum Candidate: 0, 1, 2
	ReaMin string `xml:"reamin" json:"reamin"`
// ReaMax represents reamax
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: 6, 6, 6 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 5, 6, 7
	ReaMax string `xml:"reamax" json:"reamax"`
// ReaAug represents reaaug
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: 10, 10, 10 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 10, 11, 9
// Length: 1-2 characters
	ReaAug string `xml:"reaaug" json:"reaaug"`
// StrMin represents strmin
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: 1, 1, 1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 1, 2, 3, 5, 6
	StrMin string `xml:"strmin" json:"strmin"`
// StrMax represents strmax
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 8
// Examples: 6, 5, 6 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 10, 11, 4, 5, 6, 7, 8
// Length: 1-2 characters
	StrMax string `xml:"strmax" json:"strmax"`
// StrAug represents straug
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 8
// Examples: 10, 9, 10 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 10, 11, 12, 14, 15, 8, 9
// Length: 1-2 characters
	StrAug string `xml:"straug" json:"straug"`
// WilMin represents wilmin
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 1, 1, 1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 81.3% of values are boolean strings
// Enum Candidate: 1, 2
	WilMin string `xml:"wilmin" json:"wilmin"`
// WilMax represents wilmax
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 6, 6, 6 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 5, 6, 7
	WilMax string `xml:"wilmax" json:"wilmax"`
// WilAug represents wilaug
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 10, 10, 10 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 10, 11, 9
// Length: 1-2 characters
	WilAug string `xml:"wilaug" json:"wilaug"`
// LogMin represents logmin
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 1, 1, 1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 95.0% of values are boolean strings
// Enum Candidate: 1, 2, 3
	LogMin string `xml:"logmin" json:"logmin"`
// LogMax represents logmax
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 6, 6, 6 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 4, 5, 6, 7, 8
	LogMax string `xml:"logmax" json:"logmax"`
// LogAug represents logaug
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 10, 10, 10 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 10, 11, 12, 8, 9
// Length: 1-2 characters
	LogAug string `xml:"logaug" json:"logaug"`
// IntMin represents intmin
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 1, 1, 1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 90.1% of values are boolean strings
// Enum Candidate: 1, 2
	IntMin string `xml:"intmin" json:"intmin"`
// IntMax represents intmax
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: 6, 6, 6 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 4, 5, 6, 7
	IntMax string `xml:"intmax" json:"intmax"`
// IntAug represents intaug
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: 10, 10, 10 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 10, 11, 8, 9
// Length: 1-2 characters
	IntAug string `xml:"intaug" json:"intaug"`
// ChaMin represents chamin
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 1, 3, 2 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 1, 2, 3
	ChaMin string `xml:"chamin" json:"chamin"`
// ChaMax represents chamax
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 6, 8, 7 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 4, 5, 6, 7, 8
	ChaMax string `xml:"chamax" json:"chamax"`
// ChaAug represents chaaug
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 10, 12, 11 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 10, 11, 12, 8, 9
// Length: 1-2 characters
	ChaAug string `xml:"chaaug" json:"chaaug"`
// EdgMin represents edgmin
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 2, 1, 1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 91.2% of values are boolean strings
// Enum Candidate: 1, 2
	EdgMin string `xml:"edgmin" json:"edgmin"`
// EdgMax represents edgmax
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 7, 6, 6 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 5, 6, 7
	EdgMax string `xml:"edgmax" json:"edgmax"`
// EdgAug represents edgaug
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 7, 6, 6 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 5, 6, 7
	EdgAug string `xml:"edgaug" json:"edgaug"`
// IniMin represents inimin
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 2, 2, 2 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 2, 3
	IniMin string `xml:"inimin" json:"inimin"`
// IniMax represents inimax
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: 12, 12, 12 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 10, 11, 12, 13
	IniMax string `xml:"inimax" json:"inimax"`
// IniAug represents iniaug
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: 20, 20, 20 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 18, 19, 20, 21
	IniAug string `xml:"iniaug" json:"iniaug"`
// MagMin represents magmin
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 1, 1, 1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
// Enum Candidate: 0, 1
	MagMin string `xml:"magmin" json:"magmin"`
// MagMax represents magmax
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 6, 6, 6 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 6
	MagMax string `xml:"magmax" json:"magmax"`
// MagAug represents magaug
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 6, 6, 6 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 6
	MagAug string `xml:"magaug" json:"magaug"`
// ResMin represents resmin
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 1, 1, 1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
// Enum Candidate: 0, 1
	ResMin string `xml:"resmin" json:"resmin"`
// ResMax represents resmax
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 6, 6, 6 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 6
	ResMax string `xml:"resmax" json:"resmax"`
// ResAug represents resaug
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 6, 6, 6 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 6
	ResAug string `xml:"resaug" json:"resaug"`
// EssMin represents essmin
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	EssMin string `xml:"essmin" json:"essmin"`
// EssMax represents essmax
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 6, 6, 6 (and 7 more)
// Note: 100.0% of values are numeric strings
	EssMax string `xml:"essmax" json:"essmax"`
// EssAug represents essaug
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 6, 6, 6 (and 7 more)
// Note: 100.0% of values are numeric strings
	EssAug string `xml:"essaug" json:"essaug"`
// Movement represents movement
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Special, Special, Special
	Movement string `xml:"movement" json:"movement"`
	QualityRestriction *QualityRestriction `xml:"qualityrestriction,omitempty" json:"qualityrestriction,omitempty"`
	Qualities *Qualities `xml:"qualities,omitempty" json:"qualities,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Powers *Powers `xml:"powers,omitempty" json:"powers,omitempty"`
	OptionalPowers *OptionalPowers `xml:"optionalpowers,omitempty" json:"optionalpowers,omitempty"`
	Skills *MetatypeSkills `xml:"skills,omitempty" json:"skills,omitempty"`
	ComplexForms *ComplexForms `xml:"complexforms,omitempty" json:"complexforms,omitempty"`
	OptionalComplexForms *OptionalComplexForms `xml:"optionalcomplexforms,omitempty" json:"optionalcomplexforms,omitempty"`
	Gears *Gears `xml:"gears,omitempty" json:"gears,omitempty"`
	common.SourceReference
	Metavariants *Metavariants `xml:"metavariants,omitempty" json:"metavariants,omitempty"`
}

// MetatypeCategory represents a metatype category
type MetatypeCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// MetatypeCategories represents a collection of metatype categories
type MetatypeCategories struct {
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Metavariant, Metavariant, Metavariant (and 7 more)
	Category []MetatypeCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// Metatypes represents a collection of metatypes
type Metatypes struct {
	Metatype []Metatype `xml:"metatype,omitempty" json:"metatype,omitempty"`
}

// MetatypesChummer represents the root chummer element for metatypes
type MetatypesChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []MetatypeCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Metatypes []Metatypes `xml:"metatypes,omitempty" json:"metatypes,omitempty"`
}

