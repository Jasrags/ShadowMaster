package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains quality structures generated from qualities.xsd

// QualityCategory represents a quality category
type QualityCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// QualityCategories represents a collection of quality categories
type QualityCategories struct {
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: ID/Credsticks, ID/Credsticks, ID/Credsticks (and 1 more)
	Category []QualityCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// AddQuality represents an addquality element
type AddQuality struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
// ContributeToBP represents contributetobp
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: False
// Note: 100.0% of values are boolean strings
	ContributeToBP *bool `xml:"contributetobp,attr,omitempty" json:"+@contributetobp,omitempty"`
}

// AddQualities represents addqualities element
type AddQualities struct {
// AddQuality represents addquality
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: SINner (Criminal), High Pain Tolerance, Distinctive Style (and 7 more)
// Enum Candidate: Distinctive Style, High Pain Tolerance, Home Ground, Magic Resistance, SINner (Criminal), Wanted
// Length: 6-19 characters
	AddQuality []AddQuality `xml:"addquality,omitempty" json:"addquality,omitempty"`
}

// CostDiscount represents a cost discount
type CostDiscount struct {
	Required common.Required `xml:"required" json:"required"`
// Value represents value
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Value int `xml:"value" json:"value"`
}

// QualityPower represents a power with optional attributes for qualities
type QualityPower struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
// Rating represents rating
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 3, 3, 3 (and 1 more)
// Note: 100.0% of values are numeric strings
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// QualityCritterPowers represents a collection of critter powers for qualities
type QualityCritterPowers struct {
	Power []QualityPower `xml:"power,omitempty" json:"power,omitempty"`
}

// IncludeInLimit represents include in limit
type IncludeInLimit struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Fake License, Fake License, Fake License (and 1 more)
	Name []string `xml:"name" json:"name"`
}

// NaturalWeapon represents a natural weapon
type NaturalWeapon struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Fake License, Fake License, Fake License (and 1 more)
	Name string `xml:"name" json:"name"`
// Reach represents reach
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 0, -1, -1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: -1, 0, 1
// Length: 1-2 characters
	Reach string `xml:"reach" json:"reach"`
// Damage represents damage
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: ({STR}+2)P, ({STR}+1)P, ({STR}+1)P (and 7 more)
// Enum Candidate: ({STR}+1)P, ({STR}+2)P, ({STR}+3)P
	Damage string `xml:"damage" json:"damage"`
// AP represents ap
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: -1, -1, -1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: -1, -2, -4, 4
// Length: 1-2 characters
	AP string `xml:"ap" json:"ap"`
// UseSkill represents useskill
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: Unarmed Combat, Unarmed Combat, Unarmed Combat (and 7 more)
// Enum Candidate: Throwing Weapons, Unarmed Combat
// Length: 14-16 characters
	UseSkill string `xml:"useskill" json:"useskill"`
// Accuracy represents accuracy
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Physical, Physical, Physical (and 7 more)
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
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: bc8adb44-f2a6-43c6-b3e8-e0825209f86c, 02d0c37b-c3c4-4892-ad32-c91e4de72742, 33868824-d80c-4db5-baee-d993d87fc70a (and 4 more)
// Enum Candidate: 02d0c37b-c3c4-4892-ad32-c91e4de72742, 33868824-d80c-4db5-baee-d993d87fc70a, 3b5fca95-9f04-4815-999a-a35fca1f856a, 5760ec8d-f7ca-4290-8f9f-c711da200353, bc8adb44-f2a6-43c6-b3e8-e0825209f86c, cdd640dc-5b69-45a5-8d5e-5367ed3dddbc, d6a8a731-0225-4123-9388-212024bacd35
	ID string `xml:"id" json:"id"`
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Fake License, Fake License, Fake License (and 1 more)
	Name string `xml:"name" json:"name"`
// Karma represents karma
// Type: numeric_string, mixed_boolean
// Usage: always present (100.0%)
// Unique Values: 53
// Examples: 4, 5, 14 (and 7 more)
// Note: 100.0% of values are numeric strings
// Length: 1-3 characters
	Karma string `xml:"karma" json:"karma"`
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: ID/Credsticks, ID/Credsticks, ID/Credsticks (and 1 more)
	Category string `xml:"category" json:"category"`
	common.SourceReference
	AddQualities *AddQualities `xml:"addqualities,omitempty" json:"addqualities,omitempty"`
// AddWeapon represents addweapon
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 10
// Examples: Kick (Centaur), Bite (Naga), Raptor Beak (and 7 more)
// Enum Candidate: Bite (Naga), Digging Claws, Fangs, Functional Tail (Thagomizer), Goring Horns, Kick (Centaur), Larger Tusks, Raptor Beak, Razor Claws, Retractable Claws
// Length: 5-28 characters
	AddWeapon []string `xml:"addweapon,omitempty" json:"addweapon,omitempty"`
// CanBuyWithSpellPoints represents canbuywithspellpoints
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: True, True, True (and 7 more)
// Note: 100.0% of values are boolean strings
	CanBuyWithSpellPoints *common.Boolean `xml:"canbuywithspellpoints,omitempty" json:"canbuywithspellpoints,omitempty"`
	CareerOnly *string `xml:"careeronly,omitempty" json:"careeronly,omitempty"`
// ChargenLimit represents chargenlimit
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	ChargenLimit *string `xml:"chargenlimit,omitempty" json:"chargenlimit,omitempty"`
	ChargenOnly *string `xml:"chargenonly,omitempty" json:"chargenonly,omitempty"`
// ContributeToBP represents contributetobp
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: False
// Note: 100.0% of values are boolean strings
	ContributeToBP *string `xml:"contributetobp,omitempty" json:"contributetobp,omitempty"`
// ContributeToLimit represents contributetolimit
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: False, False, False (and 7 more)
// Note: 100.0% of values are boolean strings
	ContributeToLimit *string `xml:"contributetolimit,omitempty" json:"contributetolimit,omitempty"`
	CostDiscount *CostDiscount `xml:"costdiscount,omitempty" json:"costdiscount,omitempty"`
	CritterPowers *QualityCritterPowers `xml:"critterpowers,omitempty" json:"critterpowers,omitempty"`
// DoubleCareer represents doublecareer
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: False, False, False (and 7 more)
// Note: 100.0% of values are boolean strings
	DoubleCareer *string `xml:"doublecareer,omitempty" json:"doublecareer,omitempty"`
	common.Visibility
// Implemented represents implemented
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: False, False
// Note: 100.0% of values are boolean strings
	Implemented *string `xml:"implemented,omitempty" json:"implemented,omitempty"`
	IncludeInLimit *IncludeInLimit `xml:"includeinlimit,omitempty" json:"includeinlimit,omitempty"`
// Limit represents limit
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: Mental, Social, Social (and 6 more)
// Enum Candidate: Mental, Social
	Limit *string `xml:"limit,omitempty" json:"limit,omitempty"`
// LimitWithInclusions represents limitwithinclusions
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 4, 4
// Note: 100.0% of values are numeric strings
	LimitWithInclusions *string `xml:"limitwithinclusions,omitempty" json:"limitwithinclusions,omitempty"`
// Metagenic represents metagenic
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: True, True, True (and 7 more)
// Note: 100.0% of values are boolean strings
	Metagenic *string `xml:"metagenic,omitempty" json:"metagenic,omitempty"`
// Mutant represents mutant
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: True
// Note: 100.0% of values are boolean strings
	Mutant *string `xml:"mutant,omitempty" json:"mutant,omitempty"`
	NaturalWeapons *NaturalWeapons `xml:"naturalweapons,omitempty" json:"naturalweapons,omitempty"`
	NoLevels *string `xml:"nolevels,omitempty" json:"nolevels,omitempty"`
	OnlyPriorityGiven *string `xml:"onlyprioritygiven,omitempty" json:"onlyprioritygiven,omitempty"`
	Powers *QualityPowers `xml:"powers,omitempty" json:"powers,omitempty"`
	Print *string `xml:"print,omitempty" json:"print,omitempty"`
	RefundKarmaOnRemove *string `xml:"refundkarmaonremove,omitempty" json:"refundkarmaonremove,omitempty"`
// StagedPurchase represents stagedpurchase
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: True, True, True (and 1 more)
// Note: 100.0% of values are boolean strings
	StagedPurchase *string `xml:"stagedpurchase,omitempty" json:"stagedpurchase,omitempty"`
// Bonus represents bonus
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	FirstLevelBonus *common.BaseBonus `xml:"firstlevelbonus,omitempty" json:"firstlevelbonus,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
// NameOnPage represents nameonpage
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Magicians, Adepts, Mystic Adepts (and 2 more)
// Enum Candidate: Adepts, Aspected Magicians, Magicians, Mystic Adepts, Special Modifications
// Length: 6-21 characters
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

