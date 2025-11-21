package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains vessel structures generated from vessels.xsd

// VesselQuality represents a quality with optional attributes
type VesselQuality struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Removable *string `xml:"removable,attr,omitempty" json:"+@removable,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// VesselPower represents a power with optional attributes
type VesselPower struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
	Cost *string `xml:"cost,attr,omitempty" json:"+@cost,omitempty"`
}

// VesselCategory represents a vessel category
type VesselCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// VesselCategories represents a collection of vessel categories
type VesselCategories struct {
	Category []VesselCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// VesselPositiveQualities represents positive qualities
type VesselPositiveQualities struct {
	Quality []VesselQuality `xml:"quality,omitempty" json:"quality,omitempty"`
}

// VesselNegativeQualities represents negative qualities
type VesselNegativeQualities struct {
	Quality []VesselQuality `xml:"quality,omitempty" json:"quality,omitempty"`
}

// VesselQualities represents a collection of qualities
type VesselQualities struct {
	Positive *VesselPositiveQualities `xml:"positive,omitempty" json:"positive,omitempty"`
	Negative *VesselNegativeQualities `xml:"negative,omitempty" json:"negative,omitempty"`
}

// VesselQualityRestriction represents quality restrictions
type VesselQualityRestriction struct {
	Positive *VesselPositiveQualities `xml:"positive,omitempty" json:"positive,omitempty"`
	Negative *VesselNegativeQualities `xml:"negative,omitempty" json:"negative,omitempty"`
}

// VesselPowers represents a collection of powers
type VesselPowers struct {
	Power []VesselPower `xml:"power,omitempty" json:"power,omitempty"`
}

// VesselOptionalPowers represents optional powers
type VesselOptionalPowers struct {
	Power []VesselPower `xml:"power,omitempty" json:"power,omitempty"`
}

// VesselSkill represents a skill with optional attributes for vessels
type VesselSkill struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
	Spec *string `xml:"spec,attr,omitempty" json:"+@spec,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// VesselSkillGroup represents a skill group for vessels
type VesselSkillGroup struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// VesselKnowledge represents a knowledge skill for vessels
type VesselKnowledge struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
	Category *string `xml:"category,attr,omitempty" json:"+@category,omitempty"`
}

// VesselSkills represents a collection of skills for vessels
type VesselSkills struct {
	Skill []VesselSkill `xml:"skill,omitempty" json:"skill,omitempty"`
	Group []VesselSkillGroup `xml:"group,omitempty" json:"group,omitempty"`
	Knowledge []VesselKnowledge `xml:"knowledge,omitempty" json:"knowledge,omitempty"`
}

// VesselComplexForm represents a complex form
type VesselComplexForm struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
	Category *string `xml:"category,attr,omitempty" json:"+@category,omitempty"`
	Option *string `xml:"option,attr,omitempty" json:"+@option,omitempty"`
	OptionRating *string `xml:"optionrating,attr,omitempty" json:"+@optionrating,omitempty"`
	OptionSelect *string `xml:"optionselect,attr,omitempty" json:"+@optionselect,omitempty"`
}

// VesselComplexForms represents a collection of complex forms
type VesselComplexForms struct {
	ComplexForm []VesselComplexForm `xml:"complexform,omitempty" json:"complexform,omitempty"`
}

// VesselOptionalComplexForms represents optional complex forms
type VesselOptionalComplexForms struct {
	ComplexForm []VesselComplexForm `xml:"complexform,omitempty" json:"complexform,omitempty"`
}

// VesselMetatype represents a metatype definition for vessels
type VesselMetatype struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Category *string `xml:"category,omitempty" json:"category,omitempty"`
	ForceCreature *string `xml:"forcecreature,omitempty" json:"forcecreature,omitempty"`
	BP *string `xml:"bp,omitempty" json:"bp,omitempty"`
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
	EssMin string `xml:"essmin" json:"essmin"`
	EssMax string `xml:"essmax" json:"essmax"`
	EssAug string `xml:"essaug" json:"essaug"`
	Movement string `xml:"movement" json:"movement"`
	QualityRestriction *VesselQualityRestriction `xml:"qualityrestriction,omitempty" json:"qualityrestriction,omitempty"`
	Qualities *VesselQualities `xml:"qualities,omitempty" json:"qualities,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Powers *VesselPowers `xml:"powers,omitempty" json:"powers,omitempty"`
	OptionalPowers *VesselOptionalPowers `xml:"optionalpowers,omitempty" json:"optionalpowers,omitempty"`
	Skills *VesselSkills `xml:"skills,omitempty" json:"skills,omitempty"`
	ComplexForms *VesselComplexForms `xml:"complexforms,omitempty" json:"complexforms,omitempty"`
	OptionalComplexForms *VesselOptionalComplexForms `xml:"optionalcomplexforms,omitempty" json:"optionalcomplexforms,omitempty"`
	common.SourceReference
}

// VesselMetatypes represents a collection of metatypes
type VesselMetatypes struct {
	Metatype []VesselMetatype `xml:"metatype,omitempty" json:"metatype,omitempty"`
}

// VesselsChummer represents the root chummer element for vessels
type VesselsChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []VesselCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Metatypes []VesselMetatypes `xml:"metatypes,omitempty" json:"metatypes,omitempty"`
}

