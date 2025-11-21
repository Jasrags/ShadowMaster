package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains critter structures generated from critters.xsd

// CritterQuality represents a quality with optional attributes
type CritterQuality struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// CritterBiowareName represents a bioware name
type CritterBiowareName struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
	Rating *int `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// CritterBioware represents a bioware item
type CritterBioware struct {
	Name []CritterBiowareName `xml:"name,omitempty" json:"name,omitempty"`
}

// CritterCyberwareName represents a cyberware name
type CritterCyberwareName struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
	Rating *int `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// CritterCyberware represents a cyberware item
type CritterCyberware struct {
	Name []CritterCyberwareName `xml:"name,omitempty" json:"name,omitempty"`
}

// CritterPower represents a critter power
type CritterPower struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// CritterOptionalPower represents an optional critter power
type CritterOptionalPower struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// CritterPositiveQualities represents positive qualities
type CritterPositiveQualities struct {
	Quality []CritterQuality `xml:"quality,omitempty" json:"quality,omitempty"`
}

// CritterNegativeQualities represents negative qualities
type CritterNegativeQualities struct {
	Quality []CritterQuality `xml:"quality,omitempty" json:"quality,omitempty"`
}

// CritterQualities represents a collection of qualities
type CritterQualities struct {
	Positive *CritterPositiveQualities `xml:"positive,omitempty" json:"positive,omitempty"`
	Negative *CritterNegativeQualities `xml:"negative,omitempty" json:"negative,omitempty"`
}

// CritterPowers represents a collection of critter powers
type CritterPowers struct {
	Power []CritterPower `xml:"power,omitempty" json:"power,omitempty"`
}

// CritterOptionalPowers represents optional critter powers
type CritterOptionalPowers struct {
	OptionalPower []CritterOptionalPower `xml:"optionalpower,omitempty" json:"optionalpower,omitempty"`
}

// CritterMetavariant represents a critter metavariant
type CritterMetavariant struct {
	ID string `xml:"id" json:"id"`
	common.Visibility
	Name string `xml:"name" json:"name"`
	Karma string `xml:"karma" json:"karma"`
	Powers *CritterPowers `xml:"powers,omitempty" json:"powers,omitempty"`
	OptionalPowers *CritterOptionalPowers `xml:"optionalpowers,omitempty" json:"optionalpowers,omitempty"`
	Skills *CritterMetatypeSkills `xml:"skills,omitempty" json:"skills,omitempty"`
	Qualities *CritterQualities `xml:"qualities,omitempty" json:"qualities,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	common.SourceReference
}

// CritterMetatypeSkill represents a skill with optional attributes for critters
type CritterMetatypeSkill struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
	Spec *string `xml:"spec,attr,omitempty" json:"+@spec,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// CritterMetatypeSkillGroup represents a skill group for critters
type CritterMetatypeSkillGroup struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// CritterMetatypeKnowledge represents a knowledge skill for critters
type CritterMetatypeKnowledge struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
	Category *string `xml:"category,attr,omitempty" json:"+@category,omitempty"`
}

// CritterMetatypeSkills represents a collection of skills for critters
type CritterMetatypeSkills struct {
	Skill []CritterMetatypeSkill `xml:"skill,omitempty" json:"skill,omitempty"`
	Group []CritterMetatypeSkillGroup `xml:"group,omitempty" json:"group,omitempty"`
	Knowledge []CritterMetatypeKnowledge `xml:"knowledge,omitempty" json:"knowledge,omitempty"`
}

// CritterComplexForm represents a complex form
type CritterComplexForm struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
	Category *string `xml:"category,attr,omitempty" json:"+@category,omitempty"`
	Option *string `xml:"option,attr,omitempty" json:"+@option,omitempty"`
	OptionRating *string `xml:"optionrating,attr,omitempty" json:"+@optionrating,omitempty"`
	OptionSelect *string `xml:"optionselect,attr,omitempty" json:"+@optionselect,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// CritterComplexForms represents a collection of complex forms
type CritterComplexForms struct {
	ComplexForm []CritterComplexForm `xml:"complexform,omitempty" json:"complexform,omitempty"`
}

// CritterOptionalComplexForms represents optional complex forms
type CritterOptionalComplexForms struct {
	ComplexForm []CritterComplexForm `xml:"complexform,omitempty" json:"complexform,omitempty"`
}

// CritterGear represents a gear item
type CritterGear struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// CritterGears represents a collection of gear items
type CritterGears struct {
	Gear []CritterGear `xml:"gear,omitempty" json:"gear,omitempty"`
}

// CritterBiowares represents a collection of bioware items
type CritterBiowares struct {
	Bioware []CritterBioware `xml:"bioware,omitempty" json:"bioware,omitempty"`
}

// CritterCyberwares represents a collection of cyberware items
type CritterCyberwares struct {
	Cyberware []CritterCyberware `xml:"cyberware,omitempty" json:"cyberware,omitempty"`
}

// CritterQualityRestriction represents quality restrictions
type CritterQualityRestriction struct {
	Positive *CritterPositiveQualities `xml:"positive,omitempty" json:"positive,omitempty"`
	Negative *CritterNegativeQualities `xml:"negative,omitempty" json:"negative,omitempty"`
}

// CritterMetavariants represents a collection of critter metavariants
type CritterMetavariants struct {
	Metavariant []CritterMetavariant `xml:"metavariant,omitempty" json:"metavariant,omitempty"`
}

// Critter represents a critter definition
type Critter struct {
	ID string `xml:"id" json:"id"`
	common.Visibility
	Name *string `xml:"name,omitempty" json:"name,omitempty"`
	Category *string `xml:"category,omitempty" json:"category,omitempty"`
	ForceCreature *string `xml:"forcecreature,omitempty" json:"forcecreature,omitempty"`
	Karma *string `xml:"karma,omitempty" json:"karma,omitempty"`
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
	ChaMin string `xml:"chamin" json:"chamin"`
	ChaMax string `xml:"chamax" json:"chamax"`
	ChaAug string `xml:"chaaug" json:"chaaug"`
	IntMin string `xml:"intmin" json:"intmin"`
	IntMax string `xml:"intmax" json:"intmax"`
	IntAug string `xml:"intaug" json:"intaug"`
	LogMin string `xml:"logmin" json:"logmin"`
	LogMax string `xml:"logmax" json:"logmax"`
	LogAug string `xml:"logaug" json:"logaug"`
	WilMin string `xml:"wilmin" json:"wilmin"`
	WilMax string `xml:"wilmax" json:"wilmax"`
	WilAug string `xml:"wilaug" json:"wilaug"`
	IniMin string `xml:"inimin" json:"inimin"`
	IniMax string `xml:"inimax" json:"inimax"`
	IniAug string `xml:"iniaug" json:"iniaug"`
	EdgMin string `xml:"edgmin" json:"edgmin"`
	EdgMax string `xml:"edgmax" json:"edgmax"`
	EdgAug string `xml:"edgaug" json:"edgaug"`
	MagMin string `xml:"magmin" json:"magmin"`
	MagMax string `xml:"magmax" json:"magmax"`
	MagAug string `xml:"magaug" json:"magaug"`
	ResMin string `xml:"resmin" json:"resmin"`
	ResMax string `xml:"resmax" json:"resmax"`
	ResAug string `xml:"resaug" json:"resaug"`
	DepMin string `xml:"depmin" json:"depmin"`
	DepMax string `xml:"depmax" json:"depmax"`
	DepAug string `xml:"depaug" json:"depaug"`
	EssMin string `xml:"essmin" json:"essmin"`
	EssMax string `xml:"essmax" json:"essmax"`
	EssAug string `xml:"essaug" json:"essaug"`
	ForceIsLevels *string `xml:"forceislevels,omitempty" json:"forceislevels,omitempty"`
	Movement *string `xml:"movement,omitempty" json:"movement,omitempty"`
	Walk *string `xml:"walk,omitempty" json:"walk,omitempty"`
	Run *string `xml:"run,omitempty" json:"run,omitempty"`
	Sprint *string `xml:"sprint,omitempty" json:"sprint,omitempty"`
	QualityRestriction *CritterQualityRestriction `xml:"qualityrestriction,omitempty" json:"qualityrestriction,omitempty"`
	Qualities *CritterQualities `xml:"qualities,omitempty" json:"qualities,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Biowares *CritterBiowares `xml:"biowares,omitempty" json:"biowares,omitempty"`
	ComplexForms *CritterComplexForms `xml:"complexforms,omitempty" json:"complexforms,omitempty"`
	Cyberwares *CritterCyberwares `xml:"cyberwares,omitempty" json:"cyberwares,omitempty"`
	Gears *CritterGears `xml:"gears,omitempty" json:"gears,omitempty"`
	OptionalComplexForms *CritterOptionalComplexForms `xml:"optionalcomplexforms,omitempty" json:"optionalcomplexforms,omitempty"`
	OptionalPowers *CritterOptionalPowers `xml:"optionalpowers,omitempty" json:"optionalpowers,omitempty"`
	Powers *CritterPowers `xml:"powers,omitempty" json:"powers,omitempty"`
	Skills *CritterMetatypeSkills `xml:"skills,omitempty" json:"skills,omitempty"`
	common.SourceReference
	Metavariants *CritterMetavariants `xml:"metavariants,omitempty" json:"metavariants,omitempty"`
}

// CritterCategory represents a critter category
type CritterCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// CritterCategories represents a collection of critter categories
type CritterCategories struct {
	Category []CritterCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// Critters represents a collection of critters
type Critters struct {
	Metatype []Critter `xml:"metatype,omitempty" json:"metatype,omitempty"`
}

// CrittersChummer represents the root chummer element for critters
type CrittersChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []CritterCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Metatypes []Critters `xml:"metatypes,omitempty" json:"metatypes,omitempty"`
}

