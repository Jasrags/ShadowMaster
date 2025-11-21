package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains tradition structures generated from traditions.xsd

// TraditionSpirits represents spirit attributes for a tradition
type TraditionSpirits struct {
	SpiritCombat *string `xml:"spiritcombat,omitempty" json:"spiritcombat,omitempty"`
	SpiritDetection *string `xml:"spiritdetection,omitempty" json:"spiritdetection,omitempty"`
	SpiritHealth *string `xml:"spirithealth,omitempty" json:"spirithealth,omitempty"`
	SpiritIllusion *string `xml:"spiritillusion,omitempty" json:"spiritillusion,omitempty"`
	SpiritManipulation *string `xml:"spiritmanipulation,omitempty" json:"spiritmanipulation,omitempty"`
}

// Tradition represents a magical tradition
type Tradition struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	common.Visibility
	Drain string `xml:"drain" json:"drain"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Source string `xml:"source" json:"source"`
	Page uint16 `xml:"page" json:"page"`
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
	ID string `xml:"id" json:"id"`
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

