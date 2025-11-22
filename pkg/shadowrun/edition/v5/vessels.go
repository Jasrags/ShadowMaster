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
// This is an alias for CategoryBase for backward compatibility
type VesselCategory = common.CategoryBase

// VesselCategories represents a collection of vessel categories
type VesselCategories struct {
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Inanimate Vessels, Inanimate Vessels, Inanimate Vessels (and 6 more)
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
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Inanimate Vessels, Inanimate Vessels, Inanimate Vessels (and 6 more)
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
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Inanimate Vessels, Inanimate Vessels, Inanimate Vessels (and 6 more)
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
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: 3E980802-7A90-49D2-B878-12983BB4B62F, 712889BF-CD58-425C-8D14-0E9720B2C713, AF455A22-2B54-469A-9A08-A029473282B3 (and 6 more)
// Enum Candidate: 2643B4A2-05C6-47FF-8E15-FC094415FE44, 2ACF277D-76BF-45B7-BC85-FD084D1D7027, 2CC51D65-54DA-4FDA-AEF5-B641D4C9ED5F, 39B667F0-48AB-41D6-8FB9-54F3B34D42AC, 3E980802-7A90-49D2-B878-12983BB4B62F, 6B7BDAA6-99A5-4FB2-9648-E1E0E9568E30, 712889BF-CD58-425C-8D14-0E9720B2C713, AF455A22-2B54-469A-9A08-A029473282B3, E1556535-CC23-401A-9635-01AC2D640BEC
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: Fragile Material, Cheap Material, Average Material (and 6 more)
// Enum Candidate: Armored/Reinforced Material, Average Material, Cheap Material, Fragile Material, Hardened Material, Heavy Material, Heavy Structural Material, Reinforced Material, Structural Material
// Length: 14-27 characters
	Name string `xml:"name" json:"name"`
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Inanimate Vessels, Inanimate Vessels, Inanimate Vessels (and 6 more)
	Category *string `xml:"category,omitempty" json:"category,omitempty"`
	ForceCreature *string `xml:"forcecreature,omitempty" json:"forcecreature,omitempty"`
// BP represents bp
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	BP *string `xml:"bp,omitempty" json:"bp,omitempty"`
// BodMin represents bodmin
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: 1, 2, 4 (and 6 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 1, 10, 12, 14, 16, 2, 4, 6, 8
// Length: 1-2 characters
	BodMin string `xml:"bodmin" json:"bodmin"`
// BodMax represents bodmax
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: 1, 2, 4 (and 6 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 1, 10, 12, 14, 16, 2, 4, 6, 8
// Length: 1-2 characters
	BodMax string `xml:"bodmax" json:"bodmax"`
// BodAug represents bodaug
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: 1, 2, 4 (and 6 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 1, 10, 12, 14, 16, 2, 4, 6, 8
// Length: 1-2 characters
	BodAug string `xml:"bodaug" json:"bodaug"`
// AgiMin represents agimin
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	AgiMin string `xml:"agimin" json:"agimin"`
// AgiMax represents agimax
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	AgiMax string `xml:"agimax" json:"agimax"`
// AgiAug represents agiaug
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	AgiAug string `xml:"agiaug" json:"agiaug"`
// ReaMin represents reamin
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	ReaMin string `xml:"reamin" json:"reamin"`
// ReaMax represents reamax
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	ReaMax string `xml:"reamax" json:"reamax"`
// ReaAug represents reaaug
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	ReaAug string `xml:"reaaug" json:"reaaug"`
// StrMin represents strmin
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	StrMin string `xml:"strmin" json:"strmin"`
// StrMax represents strmax
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	StrMax string `xml:"strmax" json:"strmax"`
// StrAug represents straug
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	StrAug string `xml:"straug" json:"straug"`
// ChaMin represents chamin
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	ChaMin string `xml:"chamin" json:"chamin"`
// ChaMax represents chamax
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	ChaMax string `xml:"chamax" json:"chamax"`
// ChaAug represents chaaug
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	ChaAug string `xml:"chaaug" json:"chaaug"`
// IntMin represents intmin
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	IntMin string `xml:"intmin" json:"intmin"`
// IntMax represents intmax
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	IntMax string `xml:"intmax" json:"intmax"`
// IntAug represents intaug
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	IntAug string `xml:"intaug" json:"intaug"`
// LogMin represents logmin
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	LogMin string `xml:"logmin" json:"logmin"`
// LogMax represents logmax
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	LogMax string `xml:"logmax" json:"logmax"`
// LogAug represents logaug
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	LogAug string `xml:"logaug" json:"logaug"`
// WilMin represents wilmin
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	WilMin string `xml:"wilmin" json:"wilmin"`
// WilMax represents wilmax
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	WilMax string `xml:"wilmax" json:"wilmax"`
// WilAug represents wilaug
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	WilAug string `xml:"wilaug" json:"wilaug"`
// IniMin represents inimin
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	IniMin string `xml:"inimin" json:"inimin"`
// IniMax represents inimax
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	IniMax string `xml:"inimax" json:"inimax"`
// IniAug represents iniaug
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	IniAug string `xml:"iniaug" json:"iniaug"`
// EdgMin represents edgmin
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	EdgMin string `xml:"edgmin" json:"edgmin"`
// EdgMax represents edgmax
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	EdgMax string `xml:"edgmax" json:"edgmax"`
// EdgAug represents edgaug
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	EdgAug string `xml:"edgaug" json:"edgaug"`
// MagMin represents magmin
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	MagMin string `xml:"magmin" json:"magmin"`
// MagMax represents magmax
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	MagMax string `xml:"magmax" json:"magmax"`
// MagAug represents magaug
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	MagAug string `xml:"magaug" json:"magaug"`
// ResMin represents resmin
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	ResMin string `xml:"resmin" json:"resmin"`
// ResMax represents resmax
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	ResMax string `xml:"resmax" json:"resmax"`
// ResAug represents resaug
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	ResAug string `xml:"resaug" json:"resaug"`
// EssMin represents essmin
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	EssMin string `xml:"essmin" json:"essmin"`
// EssMax represents essmax
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	EssMax string `xml:"essmax" json:"essmax"`
// EssAug represents essaug
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 6 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
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

