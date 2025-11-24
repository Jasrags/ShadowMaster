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
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: critter, critter, critter (and 7 more)
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
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: critter, critter, critter (and 7 more)
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
// Quality represents quality
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: Cold-Blooded, Carrier (HMHVV Strain II), Gremlins (and 7 more)
// Enum Candidate: Carrier (HMHVV Strain II), Cold-Blooded, Gremlins, Real World Naiveté
// Length: 8-25 characters
	Quality []CritterQuality `xml:"quality,omitempty" json:"quality,omitempty"`
}

// CritterNegativeQualities represents negative qualities
type CritterNegativeQualities struct {
// Quality represents quality
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: Cold-Blooded, Carrier (HMHVV Strain II), Gremlins (and 7 more)
// Enum Candidate: Carrier (HMHVV Strain II), Cold-Blooded, Gremlins, Real World Naiveté
// Length: 8-25 characters
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
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 66
// Examples: fea12a53-9eb1-4e3b-9983-d8f86c7cb773, e6732218-d09e-4549-82a4-36f987d0f39f, b23e8914-c760-4bca-b574-aaba629765fd (and 7 more)
	ID string `xml:"id" json:"id"`
	common.Visibility
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: critter, critter, critter (and 7 more)
	Name string `xml:"name" json:"name"`
// Karma represents karma
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
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
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 18
// Examples: Mundane Critters, Mundane Critters, Mundane Critters (and 7 more)
// Enum Candidate: Yes
// Length: 6-21 characters
	Category *string `xml:"category,attr,omitempty" json:"+@category,omitempty"`
}

// CritterMetatypeSkills represents a collection of skills for critters
type CritterMetatypeSkills struct {
	Skill []CritterMetatypeSkill `xml:"skill,omitempty" json:"skill,omitempty"`
// Group represents group
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: Athletics, Athletics, Conjuring (and 7 more)
// Enum Candidate: Athletics, Close Combat, Conjuring, Influence, Outdoors, Sorcery
// Length: 7-12 characters
	Group []CritterMetatypeSkillGroup `xml:"group,omitempty" json:"group,omitempty"`
// Knowledge represents knowledge
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Animal Calls, Animal Calls
	Knowledge []CritterMetatypeKnowledge `xml:"knowledge,omitempty" json:"knowledge,omitempty"`
}

// CritterComplexForm represents a complex form
type CritterComplexForm struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 18
// Examples: Mundane Critters, Mundane Critters, Mundane Critters (and 7 more)
// Enum Candidate: Yes
// Length: 6-21 characters
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
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 66
// Examples: fea12a53-9eb1-4e3b-9983-d8f86c7cb773, e6732218-d09e-4549-82a4-36f987d0f39f, b23e8914-c760-4bca-b574-aaba629765fd (and 7 more)
	ID string `xml:"id" json:"id"`
	common.Visibility
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: critter, critter, critter (and 7 more)
	Name *string `xml:"name,omitempty" json:"name,omitempty"`
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 18
// Examples: Mundane Critters, Mundane Critters, Mundane Critters (and 7 more)
// Enum Candidate: Yes
// Length: 6-21 characters
	Category *string `xml:"category,omitempty" json:"category,omitempty"`
	ForceCreature *string `xml:"forcecreature,omitempty" json:"forcecreature,omitempty"`
// Karma represents karma
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Karma *string `xml:"karma,omitempty" json:"karma,omitempty"`
// BodMin represents bodmin
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: F, F, F (and 7 more)
// Enum Candidate: F, F+3, F+5, F-1
// Length: 1-3 characters
	BodMin string `xml:"bodmin" json:"bodmin"`
// BodMax represents bodmax
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: F, F, F (and 7 more)
// Enum Candidate: F, F+3, F+5, F-1
// Length: 1-3 characters
	BodMax string `xml:"bodmax" json:"bodmax"`
// BodAug represents bodaug
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: F, F, F (and 7 more)
// Enum Candidate: F, F+3, F+5, F-1
// Length: 1-3 characters
	BodAug string `xml:"bodaug" json:"bodaug"`
// AgiMin represents agimin
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: F+1, F+1, F+1 (and 7 more)
// Enum Candidate: F, F+1, F+2, F+3
// Length: 1-3 characters
	AgiMin string `xml:"agimin" json:"agimin"`
// AgiMax represents agimax
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: F+1, F+1, F+1 (and 7 more)
// Enum Candidate: F, F+1, F+2, F+3
// Length: 1-3 characters
	AgiMax string `xml:"agimax" json:"agimax"`
// AgiAug represents agiaug
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: F+1, F+1, F+1 (and 7 more)
// Enum Candidate: F, F+1, F+2, F+3
// Length: 1-3 characters
	AgiAug string `xml:"agiaug" json:"agiaug"`
// ReaMin represents reamin
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: F+1, F+1, F+1 (and 7 more)
// Enum Candidate: F, F+1, F+2, F+3, F+4
// Length: 1-3 characters
	ReaMin string `xml:"reamin" json:"reamin"`
// ReaMax represents reamax
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: F+1, F+1, F+1 (and 7 more)
// Enum Candidate: F, F+1, F+2, F+3, F+4
// Length: 1-3 characters
	ReaMax string `xml:"reamax" json:"reamax"`
// ReaAug represents reaaug
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: F+1, F+1, F+1 (and 7 more)
// Enum Candidate: F, F+1, F+2, F+3, F+4
// Length: 1-3 characters
	ReaAug string `xml:"reaaug" json:"reaaug"`
// StrMin represents strmin
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: F, F, F (and 7 more)
// Enum Candidate: F, F+1, F+3, F+5, F-1
// Length: 1-3 characters
	StrMin string `xml:"strmin" json:"strmin"`
// StrMax represents strmax
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: F, F, F (and 7 more)
// Enum Candidate: F, F+1, F+3, F+5, F-1
// Length: 1-3 characters
	StrMax string `xml:"strmax" json:"strmax"`
// StrAug represents straug
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: F, F, F (and 7 more)
// Enum Candidate: F, F+1, F+3, F+5, F-1
// Length: 1-3 characters
	StrAug string `xml:"straug" json:"straug"`
// ChaMin represents chamin
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: F, F, F (and 7 more)
	ChaMin string `xml:"chamin" json:"chamin"`
// ChaMax represents chamax
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: F, F, F (and 7 more)
	ChaMax string `xml:"chamax" json:"chamax"`
// ChaAug represents chaaug
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: F, F, F (and 7 more)
	ChaAug string `xml:"chaaug" json:"chaaug"`
// IntMin represents intmin
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: F, F, F (and 7 more)
// Enum Candidate: F, F+1
// Length: 1-3 characters
	IntMin string `xml:"intmin" json:"intmin"`
// IntMax represents intmax
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: F, F, F (and 7 more)
// Enum Candidate: F, F+1
// Length: 1-3 characters
	IntMax string `xml:"intmax" json:"intmax"`
// IntAug represents intaug
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: F, F, F (and 7 more)
// Enum Candidate: F, F+1
// Length: 1-3 characters
	IntAug string `xml:"intaug" json:"intaug"`
// LogMin represents logmin
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: F, F, F (and 7 more)
// Enum Candidate: F, F+1
// Length: 1-3 characters
	LogMin string `xml:"logmin" json:"logmin"`
// LogMax represents logmax
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: F, F, F (and 7 more)
// Enum Candidate: F, F+1
// Length: 1-3 characters
	LogMax string `xml:"logmax" json:"logmax"`
// LogAug represents logaug
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: F, F, F (and 7 more)
// Enum Candidate: F, F+1
// Length: 1-3 characters
	LogAug string `xml:"logaug" json:"logaug"`
// WilMin represents wilmin
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: F, F, F (and 7 more)
// Enum Candidate: F, F+1
// Length: 1-3 characters
	WilMin string `xml:"wilmin" json:"wilmin"`
// WilMax represents wilmax
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: F, F, F (and 7 more)
// Enum Candidate: F, F+1
// Length: 1-3 characters
	WilMax string `xml:"wilmax" json:"wilmax"`
// WilAug represents wilaug
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: F, F, F (and 7 more)
// Enum Candidate: F, F+1
// Length: 1-3 characters
	WilAug string `xml:"wilaug" json:"wilaug"`
// IniMin represents inimin
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: (F*2)+1, (F*2)+1, (F*2)+1 (and 7 more)
// Enum Candidate: (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4
	IniMin string `xml:"inimin" json:"inimin"`
// IniMax represents inimax
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: (F*2)+1, (F*2)+1, (F*2)+1 (and 7 more)
// Enum Candidate: (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4
	IniMax string `xml:"inimax" json:"inimax"`
// IniAug represents iniaug
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: (F*2)+1, (F*2)+1, (F*2)+1 (and 7 more)
// Enum Candidate: (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4
	IniAug string `xml:"iniaug" json:"iniaug"`
// EdgMin represents edgmin
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: F/2, F/2, F/2 (and 7 more)
	EdgMin string `xml:"edgmin" json:"edgmin"`
// EdgMax represents edgmax
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: F/2, F/2, F/2 (and 7 more)
	EdgMax string `xml:"edgmax" json:"edgmax"`
// EdgAug represents edgaug
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: F/2, F/2, F/2 (and 7 more)
	EdgAug string `xml:"edgaug" json:"edgaug"`
// MagMin represents magmin
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: F, F, F (and 7 more)
	MagMin string `xml:"magmin" json:"magmin"`
// MagMax represents magmax
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: F, F, F (and 7 more)
	MagMax string `xml:"magmax" json:"magmax"`
// MagAug represents magaug
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: F, F, F (and 7 more)
	MagAug string `xml:"magaug" json:"magaug"`
// ResMin represents resmin
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	ResMin string `xml:"resmin" json:"resmin"`
// ResMax represents resmax
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	ResMax string `xml:"resmax" json:"resmax"`
// ResAug represents resaug
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	ResAug string `xml:"resaug" json:"resaug"`
// DepMin represents depmin
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	DepMin string `xml:"depmin" json:"depmin"`
// DepMax represents depmax
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	DepMax string `xml:"depmax" json:"depmax"`
// DepAug represents depaug
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	DepAug string `xml:"depaug" json:"depaug"`
// EssMin represents essmin
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: F, F, F (and 7 more)
	EssMin string `xml:"essmin" json:"essmin"`
// EssMax represents essmax
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: F, F, F (and 7 more)
	EssMax string `xml:"essmax" json:"essmax"`
// EssAug represents essaug
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: F, F, F (and 7 more)
	EssAug string `xml:"essaug" json:"essaug"`
	ForceIsLevels *string `xml:"forceislevels,omitempty" json:"forceislevels,omitempty"`
// Movement represents movement
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Special, Special, Special (and 7 more)
	Movement *string `xml:"movement,omitempty" json:"movement,omitempty"`
// Walk represents walk
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 2/2/2, 2/2/2, 2/2/2 (and 7 more)
// Note: 100.0% of values are numeric strings
	Walk *string `xml:"walk,omitempty" json:"walk,omitempty"`
// Run represents run
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 4/4/4, 4/4/4, 4/4/4 (and 7 more)
// Note: 100.0% of values are numeric strings
	Run *string `xml:"run,omitempty" json:"run,omitempty"`
// Sprint represents sprint
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 2/2/2, 2/2/2, 2/2/2 (and 7 more)
// Note: 100.0% of values are numeric strings
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
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 18
// Examples: Mundane Critters, Mundane Critters, Mundane Critters (and 7 more)
// Enum Candidate: Yes
// Length: 6-21 characters
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

