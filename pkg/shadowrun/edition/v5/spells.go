package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains spell structures generated from spells.xsd

// SpellCategory represents a spell category
type SpellCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	UseSkill *string `xml:"useskill,attr,omitempty" json:"+@useskill,omitempty"`
	AlchemicalSkill *string `xml:"alchemicalskill,attr,omitempty" json:"+@alchemicalskill,omitempty"`
	BarehandedAdeptSkill *string `xml:"barehandedadeptskill,attr,omitempty" json:"+@barehandedadeptskill,omitempty"`
}

// SpellCategories represents a collection of spell categories
type SpellCategories struct {
	Category []SpellCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// Spell represents a spell definition
type Spell struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	Damage string `xml:"damage" json:"damage"`
	Descriptor string `xml:"descriptor" json:"descriptor"`
	Duration string `xml:"duration" json:"duration"`
	DV string `xml:"dv" json:"dv"`
	Range string `xml:"range" json:"range"`
	Type string `xml:"type" json:"type"`
	common.SourceReference
	common.Visibility
	UseSkill *string `xml:"useskill,omitempty" json:"useskill,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
}

// Spells represents a collection of spells
type Spells struct {
	Spell []Spell `xml:"spell,omitempty" json:"spell,omitempty"`
}

// SpellsChummer represents the root chummer element for spells
type SpellsChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []SpellCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Spells []Spells `xml:"spells,omitempty" json:"spells,omitempty"`
}

