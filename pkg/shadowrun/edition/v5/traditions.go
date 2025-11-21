package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains tradition structures generated from traditions.xsd

// TraditionSpirits represents spirit attributes for a tradition
type TraditionSpirits struct {
// SpiritCombat represents spiritcombat
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 13
// Examples: Spirit of Fire, Spirit of Beasts, Guardian Spirit (and 7 more)
// Enum Candidate: All, Corpse Spirit, Guardian Spirit, Guidance Spirit, Plant Spirit, Soldier Spirit, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water, Task Spirit
// Length: 3-16 characters
	SpiritCombat *string `xml:"spiritcombat,omitempty" json:"spiritcombat,omitempty"`
// SpiritDetection represents spiritdetection
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 12
// Examples: Spirit of Air, Spirit of Water, Spirit of Fire (and 7 more)
// Enum Candidate: All, Carcass Spirit, Guardian Spirit, Guidance Spirit, Plant Spirit, Scout Spirit, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Water, Task Spirit
// Length: 3-16 characters
	SpiritDetection *string `xml:"spiritdetection,omitempty" json:"spiritdetection,omitempty"`
// SpiritHealth represents spirithealth
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 12
// Examples: Spirit of Man, Spirit of Earth, Plant Spirit (and 7 more)
// Enum Candidate: All, Caretaker Spirit, Guardian Spirit, Guidance Spirit, Plant Spirit, Rot Spirit, Spirit of Air, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water, Task Spirit
// Length: 3-16 characters
	SpiritHealth *string `xml:"spirithealth,omitempty" json:"spirithealth,omitempty"`
// SpiritIllusion represents spiritillusion
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 11
// Examples: Spirit of Water, Spirit of Air, Spirit of Water (and 7 more)
// Enum Candidate: All, Detritus Spirit, Guidance Spirit, Nymph Spirit, Plant Spirit, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water
// Length: 3-16 characters
	SpiritIllusion *string `xml:"spiritillusion,omitempty" json:"spiritillusion,omitempty"`
// SpiritManipulation represents spiritmanipulation
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 13
// Examples: Spirit of Earth, Spirit of Man, Spirit of Beasts (and 7 more)
// Enum Candidate: All, Guardian Spirit, Guidance Spirit, Palefire Spirit, Plant Spirit, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water, Task Spirit, Worker Spirit
// Length: 3-16 characters
	SpiritManipulation *string `xml:"spiritmanipulation,omitempty" json:"spiritmanipulation,omitempty"`
}

// Tradition represents a magical tradition
type Tradition struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: f10d9639-45c8-4c45-87b9-6af0fef73723, 06b8b7da-1301-4963-aba7-4862024559a8, aca1fd74-0c25-41d5-b621-434c3892cfb3 (and 2 more)
// Enum Candidate: 06b8b7da-1301-4963-aba7-4862024559a8, aca1fd74-0c25-41d5-b621-434c3892cfb3, c8adb0ec-7592-4801-b560-94805ef1c13e, f10d9639-45c8-4c45-87b9-6af0fef73723, f59248c7-7843-4b68-9a26-b966c32c8cae
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: {WIL} + {CHA}, {WIL} + {INT}, {WIL} + {LOG} (and 2 more)
// Enum Candidate: {WIL} + {CHA}, {WIL} + {INT}, {WIL} + {LOG}, {WIL} + {MAG}, {WIL} + {WIL}
	Name string `xml:"name" json:"name"`
	common.Visibility
// Drain represents drain
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: {WIL} + {LOG}, {WIL} + {CHA}, {WIL} + {CHA} (and 7 more)
// Enum Candidate: {WIL} + {CHA}, {WIL} + {INT}, {WIL} + {LOG}, {WIL} + {MAG}, {WIL} + {WIL}
	Drain string `xml:"drain" json:"drain"`
// Bonus represents bonus
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 2, 2, 2 (and 3 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 1, 2
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
// Source represents source
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: SR5, SR5, SR5 (and 7 more)
// Enum Candidate: FA, HS, HT, SG, SR5
// Length: 2-3 characters
	Source string `xml:"source" json:"source"`
// Page represents page
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 19
// Examples: 303, 303, 303 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: Yes
// Length: 2-3 characters
	Page uint16 `xml:"page" json:"page"`
// SpiritForm represents spiritform
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: Possession, Possession, Inhabitation (and 4 more)
// Enum Candidate: Inhabitation, Possession
// Length: 10-12 characters
	SpiritForm *string `xml:"spiritform,omitempty" json:"spiritform,omitempty"`
	Spirits TraditionSpirits `xml:"spirits" json:"spirits"`
}

// Traditions represents a collection of traditions
type Traditions struct {
	Tradition []Tradition `xml:"tradition" json:"tradition"`
}

// SpiritPower represents a spirit power
type SpiritPower struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// SpiritPowers represents a collection of spirit powers
type SpiritPowers struct {
	Power []SpiritPower `xml:"power" json:"power"`
}

// SpiritOptionalPowers represents optional powers for spirits
type SpiritOptionalPowers struct {
	Power []string `xml:"power,omitempty" json:"power,omitempty"`
}

// SpiritBonus represents a custom bonus type for spirits
type SpiritBonus struct {
	EnableTab *EnableTab `xml:"enabletab,omitempty" json:"enabletab,omitempty"`
}

// EnableTab represents an enable tab bonus
type EnableTab struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: {WIL} + {CHA}, {WIL} + {INT}, {WIL} + {LOG} (and 2 more)
// Enum Candidate: {WIL} + {CHA}, {WIL} + {INT}, {WIL} + {LOG}, {WIL} + {MAG}, {WIL} + {WIL}
	Name string `xml:"name" json:"name"`
}

// SpiritSkill represents a spirit skill
type SpiritSkill struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Attr *string `xml:"attr,attr,omitempty" json:"+@attr,omitempty"`
}

// SpiritSkills represents a collection of spirit skills
type SpiritSkills struct {
	Skill []SpiritSkill `xml:"skill" json:"skill"`
}

// Weaknesses represents a collection of weaknesses
type Weaknesses struct {
	Weakness []string `xml:"weakness,omitempty" json:"weakness,omitempty"`
}

// Spirit represents a spirit definition
type Spirit struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: f10d9639-45c8-4c45-87b9-6af0fef73723, 06b8b7da-1301-4963-aba7-4862024559a8, aca1fd74-0c25-41d5-b621-434c3892cfb3 (and 2 more)
// Enum Candidate: 06b8b7da-1301-4963-aba7-4862024559a8, aca1fd74-0c25-41d5-b621-434c3892cfb3, c8adb0ec-7592-4801-b560-94805ef1c13e, f10d9639-45c8-4c45-87b9-6af0fef73723, f59248c7-7843-4b68-9a26-b966c32c8cae
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: {WIL} + {CHA}, {WIL} + {INT}, {WIL} + {LOG} (and 2 more)
// Enum Candidate: {WIL} + {CHA}, {WIL} + {INT}, {WIL} + {LOG}, {WIL} + {MAG}, {WIL} + {WIL}
	Name string `xml:"name" json:"name"`
	common.Visibility
// Bod represents bod
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 14
// Examples: F-2, F+4, F+2 (and 7 more)
// Enum Candidate: 0, 1, 2, 6, 8, F, F+0, F+1, F+2, F+3, F+4, F+5, F-1, F-2
// Length: 1-3 characters
	Bod string `xml:"bod" json:"bod"`
// Agi represents agi
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: F+3, F-2, F+1 (and 7 more)
// Enum Candidate: 0, F, F+0, F+1, F+2, F+3, F-1, F-2, F-3
// Length: 1-3 characters
	Agi string `xml:"agi" json:"agi"`
// Rea represents rea
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: F+4, F-1, F+0 (and 7 more)
// Enum Candidate: 0, F, F+0, F+1, F+2, F+3, F+4, F-1, F-2
// Length: 1-3 characters
	Rea string `xml:"rea" json:"rea"`
// Str represents str
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 11
// Examples: F-3, F+4, F+2 (and 7 more)
// Enum Candidate: 0, F, F+0, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3
// Length: 1-3 characters
	Str string `xml:"str" json:"str"`
	Cha string `xml:"cha" json:"cha"`
// Int represents int
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: F+0, F+0, F+0 (and 7 more)
// Enum Candidate: (F/2)+1, 1, F, F+0, F+1, F-2, F/2
// Length: 1-7 characters
	Int string `xml:"int" json:"int"`
// Log represents log
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 8
// Examples: F+0, F-1, F+0 (and 7 more)
// Enum Candidate: (F/2)-1, 1, F, F+0, F+1, F-1, F-2, F/2
// Length: 1-7 characters
	Log string `xml:"log" json:"log"`
// Wil represents wil
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: F+0, F+0, F+0 (and 7 more)
// Enum Candidate: 1, F, F+0, F+1, F+2, F-2, F/2
// Length: 1-3 characters
	Wil string `xml:"wil" json:"wil"`
// Ini represents ini
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 14
// Examples: (F*2)+4, (F*2)-1, (F*2) (and 7 more)
// Enum Candidate: (F*2), (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4, (F*2)+5, (F*2)-1, (F-1), 0, 3, F+(F/2)+2, F+(F/2)+3, F+(F/2)+4, F+(F/2)-1
// Length: 1-9 characters
	Ini string `xml:"ini" json:"ini"`
// Edg represents edg
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: F, F, F (and 7 more)
// Enum Candidate: F, F/2
// Length: 1-3 characters
	Edg *string `xml:"edg,omitempty" json:"edg,omitempty"`
// Mag represents mag
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: F, F, F (and 7 more)
	Mag *string `xml:"mag,omitempty" json:"mag,omitempty"`
	Res *uint8 `xml:"res,omitempty" json:"res,omitempty"`
// Dep represents dep
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Dep *uint8 `xml:"dep,omitempty" json:"dep,omitempty"`
// Ess represents ess
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: F, F, F (and 7 more)
	Ess *string `xml:"ess,omitempty" json:"ess,omitempty"`
// Source represents source
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: SR5, SR5, SR5 (and 7 more)
// Enum Candidate: FA, HS, HT, SG, SR5
// Length: 2-3 characters
	Source string `xml:"source" json:"source"`
// Page represents page
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 19
// Examples: 303, 303, 303 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: Yes
// Length: 2-3 characters
	Page uint16 `xml:"page" json:"page"`
// Bonus represents bonus
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 2, 2, 2 (and 3 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 1, 2
	Bonus *SpiritBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	OptionalPowers *SpiritOptionalPowers `xml:"optionalpowers,omitempty" json:"optionalpowers,omitempty"`
	Powers SpiritPowers `xml:"powers" json:"powers"`
	Skills SpiritSkills `xml:"skills" json:"skills"`
	Weaknesses *Weaknesses `xml:"weaknesses,omitempty" json:"weaknesses,omitempty"`
}

// Spirits represents a collection of spirits
type Spirits struct {
	Spirit []Spirit `xml:"spirit" json:"spirit"`
}

// DrainAttribute represents a drain attribute
type DrainAttribute struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: f10d9639-45c8-4c45-87b9-6af0fef73723, 06b8b7da-1301-4963-aba7-4862024559a8, aca1fd74-0c25-41d5-b621-434c3892cfb3 (and 2 more)
// Enum Candidate: 06b8b7da-1301-4963-aba7-4862024559a8, aca1fd74-0c25-41d5-b621-434c3892cfb3, c8adb0ec-7592-4801-b560-94805ef1c13e, f10d9639-45c8-4c45-87b9-6af0fef73723, f59248c7-7843-4b68-9a26-b966c32c8cae
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: {WIL} + {CHA}, {WIL} + {INT}, {WIL} + {LOG} (and 2 more)
// Enum Candidate: {WIL} + {CHA}, {WIL} + {INT}, {WIL} + {LOG}, {WIL} + {MAG}, {WIL} + {WIL}
	Name string `xml:"name" json:"name"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
}

// DrainAttributes represents a collection of drain attributes
type DrainAttributes struct {
	DrainAttribute []DrainAttribute `xml:"drainattribute" json:"drainattribute"`
}

// TraditionsChummer represents the root chummer element for traditions
type TraditionsChummer struct {
	Version uint8 `xml:"version" json:"version"`
	Traditions Traditions `xml:"traditions" json:"traditions"`
	Spirits Spirits `xml:"spirits" json:"spirits"`
	DrainAttributes DrainAttributes `xml:"drainattributes" json:"drainattributes"`
}

