package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains quality structures generated from qualities.xsd

// QualityCategory represents a quality category
type QualityCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// QualityCategories represents a collection of quality categories
type QualityCategories struct {
	Category []QualityCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// AddQuality represents an addquality element
type AddQuality struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	ContributeToBP *bool `xml:"contributetobp,attr,omitempty" json:"+@contributetobp,omitempty"`
}

// AddQualities represents addqualities element
type AddQualities struct {
	AddQuality []AddQuality `xml:"addquality,omitempty" json:"addquality,omitempty"`
}

// CostDiscount represents a cost discount
type CostDiscount struct {
	Required common.Required `xml:"required" json:"required"`
	Value int `xml:"value" json:"value"`
}

// QualityPower represents a power with optional attributes for qualities
type QualityPower struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// QualityCritterPowers represents a collection of critter powers for qualities
type QualityCritterPowers struct {
	Power []QualityPower `xml:"power,omitempty" json:"power,omitempty"`
}

// IncludeInLimit represents include in limit
type IncludeInLimit struct {
	Name []string `xml:"name" json:"name"`
}

// NaturalWeapon represents a natural weapon
type NaturalWeapon struct {
	Name string `xml:"name" json:"name"`
	Reach string `xml:"reach" json:"reach"`
	Damage string `xml:"damage" json:"damage"`
	AP string `xml:"ap" json:"ap"`
	UseSkill string `xml:"useskill" json:"useskill"`
	Accuracy string `xml:"accuracy" json:"accuracy"`
	common.SourceReference
}

// NaturalWeapons represents a collection of natural weapons
type NaturalWeapons struct {
	NaturalWeapon []NaturalWeapon `xml:"naturalweapon,omitempty" json:"naturalweapon,omitempty"`
}

// QualityPowers represents a collection of powers for qualities
type QualityPowers struct {
	Power []string `xml:"power,omitempty" json:"power,omitempty"`
}

// QualityItem represents a quality definition
type QualityItem struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Karma string `xml:"karma" json:"karma"`
	Category string `xml:"category" json:"category"`
	common.SourceReference
	AddQualities *AddQualities `xml:"addqualities,omitempty" json:"addqualities,omitempty"`
	AddWeapon []string `xml:"addweapon,omitempty" json:"addweapon,omitempty"`
	CanBuyWithSpellPoints *common.Boolean `xml:"canbuywithspellpoints,omitempty" json:"canbuywithspellpoints,omitempty"`
	CareerOnly *string `xml:"careeronly,omitempty" json:"careeronly,omitempty"`
	ChargenLimit *string `xml:"chargenlimit,omitempty" json:"chargenlimit,omitempty"`
	ChargenOnly *string `xml:"chargenonly,omitempty" json:"chargenonly,omitempty"`
	ContributeToBP *string `xml:"contributetobp,omitempty" json:"contributetobp,omitempty"`
	ContributeToLimit *string `xml:"contributetolimit,omitempty" json:"contributetolimit,omitempty"`
	CostDiscount *CostDiscount `xml:"costdiscount,omitempty" json:"costdiscount,omitempty"`
	CritterPowers *QualityCritterPowers `xml:"critterpowers,omitempty" json:"critterpowers,omitempty"`
	DoubleCareer *string `xml:"doublecareer,omitempty" json:"doublecareer,omitempty"`
	common.Visibility
	Implemented *string `xml:"implemented,omitempty" json:"implemented,omitempty"`
	IncludeInLimit *IncludeInLimit `xml:"includeinlimit,omitempty" json:"includeinlimit,omitempty"`
	Limit *string `xml:"limit,omitempty" json:"limit,omitempty"`
	LimitWithInclusions *string `xml:"limitwithinclusions,omitempty" json:"limitwithinclusions,omitempty"`
	Metagenic *string `xml:"metagenic,omitempty" json:"metagenic,omitempty"`
	Mutant *string `xml:"mutant,omitempty" json:"mutant,omitempty"`
	NaturalWeapons *NaturalWeapons `xml:"naturalweapons,omitempty" json:"naturalweapons,omitempty"`
	NoLevels *string `xml:"nolevels,omitempty" json:"nolevels,omitempty"`
	OnlyPriorityGiven *string `xml:"onlyprioritygiven,omitempty" json:"onlyprioritygiven,omitempty"`
	Powers *QualityPowers `xml:"powers,omitempty" json:"powers,omitempty"`
	Print *string `xml:"print,omitempty" json:"print,omitempty"`
	RefundKarmaOnRemove *string `xml:"refundkarmaonremove,omitempty" json:"refundkarmaonremove,omitempty"`
	StagedPurchase *string `xml:"stagedpurchase,omitempty" json:"stagedpurchase,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	FirstLevelBonus *common.BaseBonus `xml:"firstlevelbonus,omitempty" json:"firstlevelbonus,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
	NameOnPage *string `xml:"nameonpage,omitempty" json:"nameonpage,omitempty"`
}

// QualityItems represents a collection of quality items
type QualityItems struct {
	Quality []QualityItem `xml:"quality,omitempty" json:"quality,omitempty"`
}

// QualitiesChummer represents the root chummer element for qualities
type QualitiesChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []QualityCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Qualities []QualityItems `xml:"qualities,omitempty" json:"qualities,omitempty"`
}

