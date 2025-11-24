package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains stream structures generated from streams.xsd

// StreamSpirit represents a spirit name for a stream
type StreamSpirit struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// StreamSpirits represents a collection of spirit names
type StreamSpirits struct {
	Spirit []StreamSpirit `xml:"spirit,omitempty" json:"spirit,omitempty"`
}

// Stream represents a magical stream
type Stream struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: acf0c123-0881-4f13-8a98-010516e74019, 610c00a4-7f11-4c88-8074-158f33aeccc0, 61357134-dd63-442c-b532-355420b30b6e (and 4 more)
// Enum Candidate: 610c00a4-7f11-4c88-8074-158f33aeccc0, 61357134-dd63-442c-b532-355420b30b6e, 74db183e-2fef-4e6d-84a3-63e641d93bf0, 80788abc-4b14-40b0-8ffd-e36fe60653cb, 80bd0cd6-fcaa-49c2-a88f-c28b4eb28c61, acf0c123-0881-4f13-8a98-010516e74019, c3be27c2-247c-4039-9529-2ff3b2e670ec
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: Courier Sprite, Crack Sprite, Data Sprite (and 4 more)
// Enum Candidate: Companion Sprite, Courier Sprite, Crack Sprite, Data Sprite, Fault Sprite, Generalist Sprite, Machine Sprite
// Length: 11-17 characters
	Name string `xml:"name" json:"name"`
	common.Visibility
// Drain represents drain
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: {WIL} + {RES}
	Drain string `xml:"drain" json:"drain"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Spirits *StreamSpirits `xml:"spirits,omitempty" json:"spirits,omitempty"`
	common.SourceReference
}

// Streams represents a collection of streams
type Streams struct {
	Tradition []Stream `xml:"tradition,omitempty" json:"tradition,omitempty"`
}

// StreamSpiritPower represents a stream spirit power
type StreamSpiritPower struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// StreamSpiritPowers represents a collection of stream spirit powers
type StreamSpiritPowers struct {
	Power []StreamSpiritPower `xml:"power" json:"power"`
}

// StreamSpiritOptionalPowers represents optional powers for stream spirits
type StreamSpiritOptionalPowers struct {
	Power []string `xml:"power,omitempty" json:"power,omitempty"`
}

// StreamSpiritBonus represents a custom bonus type for stream spirits
type StreamSpiritBonus struct {
	EnableTab *EnableTab `xml:"enabletab,omitempty" json:"enabletab,omitempty"`
}

// StreamSpiritSkill represents a stream spirit skill
type StreamSpiritSkill struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Attr *string `xml:"attr,attr,omitempty" json:"+@attr,omitempty"`
}

// StreamSpiritSkills represents a collection of stream spirit skills
type StreamSpiritSkills struct {
	Skill []StreamSpiritSkill `xml:"skill" json:"skill"`
}

// StreamWeaknesses represents a collection of weaknesses
type StreamWeaknesses struct {
	Weakness []string `xml:"weakness,omitempty" json:"weakness,omitempty"`
}

// StreamSpiritItem represents a stream spirit definition
type StreamSpiritItem struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: acf0c123-0881-4f13-8a98-010516e74019, 610c00a4-7f11-4c88-8074-158f33aeccc0, 61357134-dd63-442c-b532-355420b30b6e (and 4 more)
// Enum Candidate: 610c00a4-7f11-4c88-8074-158f33aeccc0, 61357134-dd63-442c-b532-355420b30b6e, 74db183e-2fef-4e6d-84a3-63e641d93bf0, 80788abc-4b14-40b0-8ffd-e36fe60653cb, 80bd0cd6-fcaa-49c2-a88f-c28b4eb28c61, acf0c123-0881-4f13-8a98-010516e74019, c3be27c2-247c-4039-9529-2ff3b2e670ec
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: Courier Sprite, Crack Sprite, Data Sprite (and 4 more)
// Enum Candidate: Companion Sprite, Courier Sprite, Crack Sprite, Data Sprite, Fault Sprite, Generalist Sprite, Machine Sprite
// Length: 11-17 characters
	Name string `xml:"name" json:"name"`
	common.Visibility
// Bod represents bod
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 4 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Bod string `xml:"bod" json:"bod"`
// Agi represents agi
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 4 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Agi string `xml:"agi" json:"agi"`
// Rea represents rea
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 4 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Rea string `xml:"rea" json:"rea"`
	Str string `xml:"str" json:"str"`
// Cha represents cha
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: F+0, F+0, F-1 (and 4 more)
// Enum Candidate: F+0, F+1, F+3, F-1
	Cha string `xml:"cha" json:"cha"`
// Int represents int
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: F+3, F+3, F+0 (and 4 more)
// Enum Candidate: F+0, F+1, F+3
	Int string `xml:"int" json:"int"`
// Log represents log
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: F+1, F+2, F+4 (and 4 more)
// Enum Candidate: F, F+1, F+2, F+3, F+4
// Length: 1-3 characters
	Log string `xml:"log" json:"log"`
// Wil represents wil
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: F+2, F+1, F+1 (and 4 more)
// Enum Candidate: F+1, F+2, F+4
	Wil string `xml:"wil" json:"wil"`
// Ini represents ini
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: (F*2)+1, (F*2)+2, (F*2)+4 (and 4 more)
// Enum Candidate: (F*2), (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4
// Length: 5-7 characters
	Ini string `xml:"ini" json:"ini"`
	Edg *string `xml:"edg,omitempty" json:"edg,omitempty"`
	Mag *string `xml:"mag,omitempty" json:"mag,omitempty"`
	Res *uint8 `xml:"res,omitempty" json:"res,omitempty"`
	Dep *uint8 `xml:"dep,omitempty" json:"dep,omitempty"`
	Ess *string `xml:"ess,omitempty" json:"ess,omitempty"`
// Source represents source
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: SR5, SR5, SR5 (and 4 more)
// Enum Candidate: KC, SR5
// Length: 2-3 characters
	Source string `xml:"source" json:"source"`
// Page represents page
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 258, 258, 258 (and 4 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 100, 258
	Page uint16 `xml:"page" json:"page"`
	Bonus *StreamSpiritBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	OptionalPowers *StreamSpiritOptionalPowers `xml:"optionalpowers,omitempty" json:"optionalpowers,omitempty"`
	Powers StreamSpiritPowers `xml:"powers" json:"powers"`
	Skills StreamSpiritSkills `xml:"skills" json:"skills"`
	Weaknesses *StreamWeaknesses `xml:"weaknesses,omitempty" json:"weaknesses,omitempty"`
}

// StreamSpiritsContainer represents a collection of stream spirits
type StreamSpiritsContainer struct {
	Spirit []StreamSpiritItem `xml:"spirit" json:"spirit"`
}

// StreamsChummer represents the root chummer element for streams
type StreamsChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Traditions []Streams `xml:"traditions,omitempty" json:"traditions,omitempty"`
	Spirits StreamSpiritsContainer `xml:"spirits" json:"spirits"`
}

