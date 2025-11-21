package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains armor structures generated from armor.xsd

// ArmorCategory represents an armor category
type ArmorCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Blackmarket *string `xml:"blackmarket,attr,omitempty" json:"+@blackmarket,omitempty"`
}

// ArmorCategories represents a collection of armor categories
type ArmorCategories struct {
	Category []ArmorCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// ArmorModCategory represents an armor mod category
type ArmorModCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Blackmarket *string `xml:"blackmarket,attr,omitempty" json:"+@blackmarket,omitempty"`
}

// ArmorModCategories represents a collection of armor mod categories
type ArmorModCategories struct {
	Category []ArmorModCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// SelectModsFromCategory represents selectmodsfromcategory element
type SelectModsFromCategory struct {
	Category []string `xml:"category" json:"category"`
}

// ArmorModName represents a mod name
type ArmorModName struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
// Rating represents rating
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 2, 2
// Note: 100.0% of values are numeric strings
	Rating *int `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// ArmorItemMods represents armor mods
type ArmorItemMods struct {
	Name []ArmorModName `xml:"name" json:"name"`
}

// ArmorUseGear represents a usegear element for armor
type ArmorUseGear struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
// Rating represents rating
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 2, 2
// Note: 100.0% of values are numeric strings
	Rating *int `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// ArmorGears represents armor gears
type ArmorGears struct {
	UseGear []ArmorUseGear `xml:"usegear" json:"usegear"`
}

// ArmorItem represents an armor item
type ArmorItem struct {
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 70
// Examples: 9ee8e6ad-2472-485d-ae42-d1978749b456, 3fdd4706-9052-4c6b-8c2c-61dbb5c1f16f, 142031f9-ab13-4dd0-a5a4-2cc4d06055ea (and 7 more)
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	common.Visibility
	Category string `xml:"category" json:"category"`
	AddonCategory []string `xml:"addoncategory,omitempty" json:"addoncategory,omitempty"`
	Rating *string `xml:"rating,omitempty" json:"rating,omitempty"`
	Armor string `xml:"armor" json:"armor"`
	ArmorOverride *string `xml:"armoroverride,omitempty" json:"armoroverride,omitempty"`
	ArmorCapacity string `xml:"armorcapacity" json:"armorcapacity"`
	GearCapacity *string `xml:"gearcapacity,omitempty" json:"gearcapacity,omitempty"`
// AddWeapon represents addweapon
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: Ballistic Shield, Riot Shield, Shiawase Arms Simoom (and 1 more)
// Enum Candidate: Ares Briefcase Shield, Ballistic Shield, Riot Shield, Shiawase Arms Simoom
// Length: 11-21 characters
	AddWeapon []string `xml:"addweapon,omitempty" json:"addweapon,omitempty"`
	PhysicalLimit *string `xml:"physicallimit,omitempty" json:"physicallimit,omitempty"`
	SocialLimit *string `xml:"sociallimit,omitempty" json:"sociallimit,omitempty"`
	Avail string `xml:"avail" json:"avail"`
	Cost string `xml:"cost" json:"cost"`
	SelectModsFromCategory *SelectModsFromCategory `xml:"selectmodsfromcategory,omitempty" json:"selectmodsfromcategory,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	WirelessBonus *common.BaseBonus `xml:"wirelessbonus,omitempty" json:"wirelessbonus,omitempty"`
	AddModCategory *string `xml:"addmodcategory,omitempty" json:"addmodcategory,omitempty"`
	ForceModCategory *string `xml:"forcemodcategory,omitempty" json:"forcemodcategory,omitempty"`
	Mods *ArmorItemMods `xml:"mods,omitempty" json:"mods,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	Gears *ArmorGears `xml:"gears,omitempty" json:"gears,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
	common.SourceReference
}

// ArmorItems represents a collection of armor items
type ArmorItems struct {
	Armor []ArmorItem `xml:"armor,omitempty" json:"armor,omitempty"`
}

// ArmorModUseGear represents a usegear element for armor mods
type ArmorModUseGear struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
// Rating represents rating
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 2, 2
// Note: 100.0% of values are numeric strings
	Rating *int `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// ArmorModGears represents armor mod gears
type ArmorModGears struct {
	UseGear []ArmorModUseGear `xml:"usegear" json:"usegear"`
}

// ArmorModItem represents an armor mod item
type ArmorModItem struct {
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 70
// Examples: 9ee8e6ad-2472-485d-ae42-d1978749b456, 3fdd4706-9052-4c6b-8c2c-61dbb5c1f16f, 142031f9-ab13-4dd0-a5a4-2cc4d06055ea (and 7 more)
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	Armor *string `xml:"armor,omitempty" json:"armor,omitempty"`
	common.Visibility
	MaxRating string `xml:"maxrating" json:"maxrating"`
	ArmorCapacity string `xml:"armorcapacity" json:"armorcapacity"`
	Avail string `xml:"avail" json:"avail"`
	AddWeapon []string `xml:"addweapon,omitempty" json:"addweapon,omitempty"`
	Cost string `xml:"cost" json:"cost"`
// Bonus represents bonus
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1, 1
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Gears *ArmorModGears `xml:"gears,omitempty" json:"gears,omitempty"`
	common.SourceReference
}

// ArmorModItems represents a collection of armor mod items
type ArmorModItems struct {
	Mod []ArmorModItem `xml:"mod,omitempty" json:"mod,omitempty"`
}

// ArmorChummer represents the root chummer element for armor
type ArmorChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []ArmorCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	ModCategories []ArmorModCategories `xml:"modcategories,omitempty" json:"modcategories,omitempty"`
	Armors []ArmorItems `xml:"armors,omitempty" json:"armors,omitempty"`
	Mods []ArmorModItems `xml:"mods,omitempty" json:"mods,omitempty"`
}

