package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains critter power structures generated from critterpowers.xsd

// CritterPowerCategory represents a critter power category
type CritterPowerCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// CritterPowerCategories represents a collection of critter power categories
type CritterPowerCategories struct {
	Category []CritterPowerCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// CritterPowerItem represents a critter power definition
type CritterPowerItem struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	Type string `xml:"type" json:"type"`
	Action string `xml:"action" json:"action"`
	Range string `xml:"range" json:"range"`
	Duration string `xml:"duration" json:"duration"`
	common.SourceReference
	common.Visibility
	Toxic *string `xml:"toxic,omitempty" json:"toxic,omitempty"`
	Rating *string `xml:"rating,omitempty" json:"rating,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
	Karma *string `xml:"karma,omitempty" json:"karma,omitempty"`
}

// CritterPowerItems represents a collection of critter powers
type CritterPowerItems struct {
	Power []CritterPowerItem `xml:"power,omitempty" json:"power,omitempty"`
}

// CritterPowersChummer represents the root chummer element for critter powers
type CritterPowersChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []CritterPowerCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Powers []CritterPowerItems `xml:"powers,omitempty" json:"powers,omitempty"`
}

