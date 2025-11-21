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
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	common.Visibility
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
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	common.Visibility
	Bod string `xml:"bod" json:"bod"`
	Agi string `xml:"agi" json:"agi"`
	Rea string `xml:"rea" json:"rea"`
	Str string `xml:"str" json:"str"`
	Cha string `xml:"cha" json:"cha"`
	Int string `xml:"int" json:"int"`
	Log string `xml:"log" json:"log"`
	Wil string `xml:"wil" json:"wil"`
	Ini string `xml:"ini" json:"ini"`
	Edg *string `xml:"edg,omitempty" json:"edg,omitempty"`
	Mag *string `xml:"mag,omitempty" json:"mag,omitempty"`
	Res *uint8 `xml:"res,omitempty" json:"res,omitempty"`
	Dep *uint8 `xml:"dep,omitempty" json:"dep,omitempty"`
	Ess *string `xml:"ess,omitempty" json:"ess,omitempty"`
	Source string `xml:"source" json:"source"`
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

