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
	Quality []Quality `xml:"quality,omitempty" json:"quality,omitempty"`
}

// NegativeQualities represents negative qualities
type NegativeQualities struct {
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
	Name string `xml:"name" json:"name"`
	common.Visibility
	Category string `xml:"category" json:"category"`
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
	ID string `xml:"id" json:"id"`
	common.Visibility
	Name *string `xml:"name,omitempty" json:"name,omitempty"`
	ForceCreature *string `xml:"forcecreature,omitempty" json:"forcecreature,omitempty"`
	Karma *string `xml:"karma,omitempty" json:"karma,omitempty"`
	Category string `xml:"category" json:"category"`
	BodMin string `xml:"bodmin" json:"bodmin"`
	BodMax string `xml:"bodmax" json:"bodmax"`
	BodAug string `xml:"bodaug" json:"bodaug"`
	AgiMin string `xml:"agimin" json:"agimin"`
	AgiMax string `xml:"agimax" json:"agimax"`
	AgiAug string `xml:"agiaug" json:"agiaug"`
	ReaMin string `xml:"reamin" json:"reamin"`
	ReaMax string `xml:"reamax" json:"reamax"`
	ReaAug string `xml:"reaaug" json:"reaaug"`
	StrMin string `xml:"strmin" json:"strmin"`
	StrMax string `xml:"strmax" json:"strmax"`
	StrAug string `xml:"straug" json:"straug"`
	WilMin string `xml:"wilmin" json:"wilmin"`
	WilMax string `xml:"wilmax" json:"wilmax"`
	WilAug string `xml:"wilaug" json:"wilaug"`
	LogMin string `xml:"logmin" json:"logmin"`
	LogMax string `xml:"logmax" json:"logmax"`
	LogAug string `xml:"logaug" json:"logaug"`
	IntMin string `xml:"intmin" json:"intmin"`
	IntMax string `xml:"intmax" json:"intmax"`
	IntAug string `xml:"intaug" json:"intaug"`
	ChaMin string `xml:"chamin" json:"chamin"`
	ChaMax string `xml:"chamax" json:"chamax"`
	ChaAug string `xml:"chaaug" json:"chaaug"`
	EdgMin string `xml:"edgmin" json:"edgmin"`
	EdgMax string `xml:"edgmax" json:"edgmax"`
	EdgAug string `xml:"edgaug" json:"edgaug"`
	IniMin string `xml:"inimin" json:"inimin"`
	IniMax string `xml:"inimax" json:"inimax"`
	IniAug string `xml:"iniaug" json:"iniaug"`
	MagMin string `xml:"magmin" json:"magmin"`
	MagMax string `xml:"magmax" json:"magmax"`
	MagAug string `xml:"magaug" json:"magaug"`
	ResMin string `xml:"resmin" json:"resmin"`
	ResMax string `xml:"resmax" json:"resmax"`
	ResAug string `xml:"resaug" json:"resaug"`
	EssMin string `xml:"essmin" json:"essmin"`
	EssMax string `xml:"essmax" json:"essmax"`
	EssAug string `xml:"essaug" json:"essaug"`
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

