package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains weapon structures generated from weapons.xsd

// WeaponCategory represents a weapon category
type WeaponCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Blackmarket *string `xml:"blackmarket,attr,omitempty" json:"+@blackmarket,omitempty"`
	Gunneryspec *string `xml:"gunneryspec,attr,omitempty" json:"+@gunneryspec,omitempty"`
// Type represents type
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Melee
	Type *string `xml:"type,attr,omitempty" json:"+@type,omitempty"`
}

// WeaponCategories represents a collection of weapon categories
type WeaponCategories struct {
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: Shotguns, Sporting Rifles, Sniper Rifles (and 7 more)
// Enum Candidate: Assault Cannons, Grenade Launchers, Heavy Machine Guns, Light Machine Guns, Medium Machine Guns, Missile Launchers, Shotguns, Sniper Rifles, Sporting Rifles
// Length: 8-19 characters
	Category []WeaponCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// WeaponUseGearName represents a usegear name
type WeaponUseGearName struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
	CreateChildren *string `xml:"createchildren,attr,omitempty" json:"+@createchildren,omitempty"`
	AddImprovements *string `xml:"addimprovements,attr,omitempty" json:"+@addimprovements,omitempty"`
	Qty *string `xml:"qty,attr,omitempty" json:"+@qty,omitempty"`
}

// WeaponGears represents a gears container for weapons (recursive)
type WeaponGears struct {
	UseGear []WeaponUseGear `xml:"usegear,omitempty" json:"usegear,omitempty"`
	StartCollapsed *string `xml:"startcollapsed,attr,omitempty" json:"+@startcollapsed,omitempty"`
}

// WeaponUseGear represents a usegear element for weapons
type WeaponUseGear struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: Glock MP Custodes (MPV), Glock MP Custodes, HK Urban Combat
// Enum Candidate: Glock MP Custodes, Glock MP Custodes (MPV), HK Urban Combat
// Length: 15-23 characters
	Name WeaponUseGearName `xml:"name" json:"name"`
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: Shotguns, Sporting Rifles, Sniper Rifles (and 7 more)
// Enum Candidate: Assault Cannons, Grenade Launchers, Heavy Machine Guns, Light Machine Guns, Medium Machine Guns, Missile Launchers, Shotguns, Sniper Rifles, Sporting Rifles
// Length: 8-19 characters
	Category string `xml:"category" json:"category"`
// Rating represents rating
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 95.4% of values are boolean strings
// Enum Candidate: 0, 1, 10, 1000, 2, 6
// Length: 1-4 characters
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
	Capacity *int `xml:"capacity,omitempty" json:"capacity,omitempty"`
// Page represents page
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 41
// Examples: 425, 425, 431 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: Yes
// Length: 1-3 characters
	Page *int `xml:"page,omitempty" json:"page,omitempty"`
// Source represents source
// Type: mixed_numeric, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 12
// Examples: SR5, SR5, SR5 (and 7 more)
// Enum Candidate: 2050, BTB, CF, GH3, HT, KK, RG, SAG, SL, SLG2, SOTG, SR5
// Length: 2-4 characters
	Source *int `xml:"source,omitempty" json:"source,omitempty"`
	Gears *WeaponGears `xml:"gears,omitempty" json:"gears,omitempty"`
}

// WeaponAccessory represents a weapon accessory
type WeaponAccessory struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: Glock MP Custodes (MPV), Glock MP Custodes, HK Urban Combat
// Enum Candidate: Glock MP Custodes, Glock MP Custodes (MPV), HK Urban Combat
// Length: 15-23 characters
	Name []string `xml:"name" json:"name"`
// Mount represents mount
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Stock
	Mount []string `xml:"mount,omitempty" json:"mount,omitempty"`
// Rating represents rating
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 95.4% of values are boolean strings
// Enum Candidate: 0, 1, 10, 1000, 2, 6
// Length: 1-4 characters
	Rating []string `xml:"rating,omitempty" json:"rating,omitempty"`
	Gears *WeaponGears `xml:"gears,omitempty" json:"gears,omitempty"`
}

// WeaponAccessories represents a collection of weapon accessories
type WeaponAccessories struct {
// Accessory represents accessory
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: Smartgun System, External, Smartgun System, Internal, Krime Dual-Mode External Smartgun Link (and 7 more)
// Enum Candidate: Drum Magazine, 24-round, Drum Magazine, 32-round, Krime Dual-Mode External Smartgun Link, Safe Target System, Base, Smartgun System, External, Smartgun System, Internal
// Length: 23-38 characters
	Accessory []WeaponAccessory `xml:"accessory" json:"accessory"`
}

// AccessoryMounts represents accessory mounts
type AccessoryMounts struct {
	Mount []string `xml:"mount" json:"mount"`
}

// AllowGear represents allowed gear categories
type AllowGear struct {
// GearCategory represents gearcategory
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: Vision Enhancements, Custom, Autosofts (and 5 more)
// Enum Candidate: Autosofts, Commlinks, Custom, Vision Enhancements
// Length: 6-19 characters
	GearCategory []string `xml:"gearcategory,omitempty" json:"gearcategory,omitempty"`
}

// AlternateRange represents an alternate range
type AlternateRange struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Multiply *string `xml:"multiply,attr,omitempty" json:"+@multiply,omitempty"`
}

// DoubledCostAccessoryMounts represents doubled cost accessory mounts
type DoubledCostAccessoryMounts struct {
	Mount []string `xml:"mount" json:"mount"`
}

// WeaponMod represents a weapon mod
type WeaponMod struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
// Rating represents rating
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 95.4% of values are boolean strings
// Enum Candidate: 0, 1, 10, 1000, 2, 6
// Length: 1-4 characters
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// WeaponMods represents a collection of weapon mods
type WeaponMods struct {
	Mod []WeaponMod `xml:"mod" json:"mod"`
}

// WeaponRange represents a weapon range
type WeaponRange struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Multiply *string `xml:"multiply,attr,omitempty" json:"+@multiply,omitempty"`
}

// Underbarrels represents underbarrel weapons
type Underbarrels struct {
	Underbarrel []string `xml:"underbarrel" json:"underbarrel"`
}

// WirelessWeaponBonus represents wireless weapon bonuses
type WirelessWeaponBonus struct {
// Accuracy represents accuracy
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 1, 2, 2 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: -1, 1, 2
// Length: 1-2 characters
	Accuracy *string `xml:"accuracy,omitempty" json:"accuracy,omitempty"`
	AccuracyReplace *string `xml:"accuracyreplace,omitempty" json:"accuracyreplace,omitempty"`
// AP represents ap
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: -1
// Note: 100.0% of values are numeric strings
	AP *string `xml:"ap,omitempty" json:"ap,omitempty"`
	APReplace *string `xml:"apreplace,omitempty" json:"apreplace,omitempty"`
// Damage represents damage
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: S(e)
	Damage *string `xml:"damage,omitempty" json:"damage,omitempty"`
	DamageReplace *string `xml:"damagereplace,omitempty" json:"damagereplace,omitempty"`
// DamageType represents damagetype
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: P
	DamageType *string `xml:"damagetype,omitempty" json:"damagetype,omitempty"`
// Mode represents mode
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: SA, SA
	Mode *string `xml:"mode,omitempty" json:"mode,omitempty"`
	ModeReplace *string `xml:"modereplace,omitempty" json:"modereplace,omitempty"`
	Pool *string `xml:"pool,omitempty" json:"pool,omitempty"`
	RangeBonus *int `xml:"rangebonus,omitempty" json:"rangebonus,omitempty"`
// RC represents rc
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 2, 1, 2 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 1, 2, 3, 5, 6
	RC *string `xml:"rc,omitempty" json:"rc,omitempty"`
	SmartlinkPool *string `xml:"smartlinkpool,omitempty" json:"smartlinkpool,omitempty"`
	UseRange *string `xml:"userange,omitempty" json:"userange,omitempty"`
}

// Weapon represents a weapon definition
type Weapon struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: ad28b2dd-4f4f-4089-af6b-39f3ff6900fd, ad28b2dd-4f4f-4089-af6b-39f3ff6900fd, dc1ce668-94ba-44a5-a61b-d5b330537ac2 (and 1 more)
// Enum Candidate: 65b7803a-0efe-44d9-8b85-6410644f079d, ad28b2dd-4f4f-4089-af6b-39f3ff6900fd, dc1ce668-94ba-44a5-a61b-d5b330537ac2
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: Glock MP Custodes (MPV), Glock MP Custodes, HK Urban Combat
// Enum Candidate: Glock MP Custodes, Glock MP Custodes (MPV), HK Urban Combat
// Length: 15-23 characters
	Name string `xml:"name" json:"name"`
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: Shotguns, Sporting Rifles, Sniper Rifles (and 7 more)
// Enum Candidate: Assault Cannons, Grenade Launchers, Heavy Machine Guns, Light Machine Guns, Medium Machine Guns, Missile Launchers, Shotguns, Sniper Rifles, Sporting Rifles
// Length: 8-19 characters
	Category string `xml:"category" json:"category"`
	Type string `xml:"type" json:"type"`
// Conceal represents conceal
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Conceal int `xml:"conceal" json:"conceal"`
// Accuracy represents accuracy
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 1, 2, 2 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: -1, 1, 2
// Length: 1-2 characters
	Accuracy string `xml:"accuracy" json:"accuracy"`
// Reach represents reach
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Reach string `xml:"reach" json:"reach"`
// Damage represents damage
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: S(e)
	Damage string `xml:"damage" json:"damage"`
// AP represents ap
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: -1
// Note: 100.0% of values are numeric strings
	AP string `xml:"ap" json:"ap"`
// Mode represents mode
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: SA, SA
	Mode string `xml:"mode" json:"mode"`
// RC represents rc
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 2, 1, 2 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 1, 2, 3, 5, 6
	RC string `xml:"rc" json:"rc"`
// Ammo represents ammo
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: (cy), (d)
// Enum Candidate: (cy), (d)
// Length: 3-4 characters
	Ammo string `xml:"ammo" json:"ammo"`
// Avail represents avail
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 36
// Examples: 6F, 6F, 6R (and 7 more)
// Enum Candidate: Yes
// Length: 1-11 characters
	Avail string `xml:"avail" json:"avail"`
// Cost represents cost
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 44
// Examples: 750, 0, 600 (and 7 more)
// Note: 93.4% of values are numeric strings
// Enum Candidate: Yes
// Length: 1-20 characters
	Cost string `xml:"cost" json:"cost"`
	common.SourceReference
	Accessories *WeaponAccessories `xml:"accessories,omitempty" json:"accessories,omitempty"`
	AccessoryMounts *AccessoryMounts `xml:"accessorymounts,omitempty" json:"accessorymounts,omitempty"`
// AddWeapon represents addweapon
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 21
// Examples: HK XM30 Grenade Launcher, HK XM30 Carbine, HK XM30 LMG (and 7 more)
// Enum Candidate: Yes
// Length: 11-37 characters
	AddWeapon []string `xml:"addweapon,omitempty" json:"addweapon,omitempty"`
// AllowAccessory represents allowaccessory
// Type: boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: False, False, False (and 7 more)
// Note: 100.0% of values are boolean strings
// Enum Candidate: False, True
// Length: 4-5 characters
	AllowAccessory *string `xml:"allowaccessory,omitempty" json:"allowaccessory,omitempty"`
	AllowGear *AllowGear `xml:"allowgear,omitempty" json:"allowgear,omitempty"`
	AllowMod *string `xml:"allowmod,omitempty" json:"allowmod,omitempty"`
	AllowFullBurst *string `xml:"allowfullburst,omitempty" json:"allowfullburst,omitempty"`
	AllowLongBurst *string `xml:"allowlongburst,omitempty" json:"allowlongburst,omitempty"`
	AllowShortBurst *string `xml:"allowshortburst,omitempty" json:"allowshortburst,omitempty"`
	AllowSingleShot *string `xml:"allowsingleshot,omitempty" json:"allowsingleshot,omitempty"`
	AllowSuppressive *string `xml:"allowsuppressive,omitempty" json:"allowsuppressive,omitempty"`
// AlternateRange represents alternaterange
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: Shotguns (flechette), Harpoon Gun (Underwater), Harpoon Gun (Underwater) (and 7 more)
// Enum Candidate: Harpoon Gun (Underwater), Shotguns (flechette)
// Length: 20-24 characters
	AlternateRange []AlternateRange `xml:"alternaterange,omitempty" json:"alternaterange,omitempty"`
// AmmoCategory represents ammocategory
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Shotguns, Shotguns, Shotguns
	AmmoCategory *string `xml:"ammocategory,omitempty" json:"ammocategory,omitempty"`
// AmmoSlots represents ammoslots
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1, 1, 1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	AmmoSlots *int `xml:"ammoslots,omitempty" json:"ammoslots,omitempty"`
// Cyberware represents cyberware
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: True, True, True (and 7 more)
// Note: 100.0% of values are boolean strings
	Cyberware *string `xml:"cyberware,omitempty" json:"cyberware,omitempty"`
	DoubledCostAccessoryMounts *DoubledCostAccessoryMounts `xml:"doubledcostaccessorymounts,omitempty" json:"doubledcostaccessorymounts,omitempty"`
// ExtraMount represents extramount
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: Under/Barrel, Side, Barrel
// Enum Candidate: Barrel, Side, Under/Barrel
// Length: 4-12 characters
	ExtraMount *string `xml:"extramount,omitempty" json:"extramount,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	FullBurst *int `xml:"fullburst,omitempty" json:"fullburst,omitempty"`
	common.Visibility
	LongBurst *int `xml:"longburst,omitempty" json:"longburst,omitempty"`
	Mods *WeaponMods `xml:"mods,omitempty" json:"mods,omitempty"`
// Mount represents mount
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Stock
	Mount *string `xml:"mount,omitempty" json:"mount,omitempty"`
// Range represents range
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 27
// Examples: Grenade Launchers, Submachine Guns, Light Machine Guns (and 7 more)
// Enum Candidate: Yes
// Length: 3-23 characters
	Range []WeaponRange `xml:"range,omitempty" json:"range,omitempty"`
// RequireAmmo represents requireammo
// Type: boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: False, False, False (and 6 more)
// Note: 88.9% of values are boolean strings
// Enum Candidate: False, microtorpedo
// Length: 5-12 characters
	RequireAmmo *string `xml:"requireammo,omitempty" json:"requireammo,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
// SingleShot represents singleshot
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 2
// Note: 100.0% of values are numeric strings
	SingleShot *int `xml:"singleshot,omitempty" json:"singleshot,omitempty"`
// SizeCategory represents sizecategory
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 10
// Examples: Light Crossbows, Tasers, Tasers (and 7 more)
// Enum Candidate: Assault Rifles, Heavy Crossbows, Heavy Machine Guns, Heavy Pistols, Light Crossbows, Missile Launchers, Shotguns, Sporting Rifles, Submachine Guns, Tasers
// Length: 6-18 characters
	SizeCategory *string `xml:"sizecategory,omitempty" json:"sizecategory,omitempty"`
// ShortBurst represents shortburst
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 6
// Note: 100.0% of values are numeric strings
	ShortBurst *int `xml:"shortburst,omitempty" json:"shortburst,omitempty"`
// Spec represents spec
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: Revolvers, Shotguns, Revolvers (and 3 more)
// Enum Candidate: Revolvers, Shotguns
// Length: 8-9 characters
	Spec *string `xml:"spec,omitempty" json:"spec,omitempty"`
// Spec2 represents spec2
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: Revolvers, Shotguns, Revolvers (and 3 more)
// Enum Candidate: Revolvers, Shotguns
// Length: 8-9 characters
	Spec2 *string `xml:"spec2,omitempty" json:"spec2,omitempty"`
	Suppressive *int `xml:"suppressive,omitempty" json:"suppressive,omitempty"`
	Underbarrels *Underbarrels `xml:"underbarrels,omitempty" json:"underbarrels,omitempty"`
// UseSkill represents useskill
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: Longarms, Longarms, Heavy Weapons (and 4 more)
// Enum Candidate: Heavy Weapons, Longarms
// Length: 8-13 characters
	UseSkill *string `xml:"useskill,omitempty" json:"useskill,omitempty"`
// UseSkillSpec represents useskillspec
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: Laser Weapons, Laser Weapons, Laser Weapons (and 7 more)
// Enum Candidate: Bola, Crossbow, Grapple Gun, Grenade Launchers, Laser Weapons, Monofilament Bola, Shotguns
// Length: 4-17 characters
	UseSkillSpec *string `xml:"useskillspec,omitempty" json:"useskillspec,omitempty"`
// WeaponType represents weapontype
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 25
// Examples: harpoongun, slingshot, harpoongun (and 7 more)
// Enum Candidate: Yes
// Length: 3-25 characters
	WeaponType *string `xml:"weapontype,omitempty" json:"weapontype,omitempty"`
	WirelessWeaponBonus *WirelessWeaponBonus `xml:"wirelessweaponbonus,omitempty" json:"wirelessweaponbonus,omitempty"`
}

// Weapons represents a collection of weapons
type Weapons struct {
	Weapon []Weapon `xml:"weapon,omitempty" json:"weapon,omitempty"`
}

// WeaponAccessoryItem represents a standalone weapon accessory
type WeaponAccessoryItem struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: ad28b2dd-4f4f-4089-af6b-39f3ff6900fd, ad28b2dd-4f4f-4089-af6b-39f3ff6900fd, dc1ce668-94ba-44a5-a61b-d5b330537ac2 (and 1 more)
// Enum Candidate: 65b7803a-0efe-44d9-8b85-6410644f079d, ad28b2dd-4f4f-4089-af6b-39f3ff6900fd, dc1ce668-94ba-44a5-a61b-d5b330537ac2
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: Glock MP Custodes (MPV), Glock MP Custodes, HK Urban Combat
// Enum Candidate: Glock MP Custodes, Glock MP Custodes (MPV), HK Urban Combat
// Length: 15-23 characters
	Name string `xml:"name" json:"name"`
// Mount represents mount
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Stock
	Mount string `xml:"mount" json:"mount"`
// ExtraMount represents extramount
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: Under/Barrel, Side, Barrel
// Enum Candidate: Barrel, Side, Under/Barrel
// Length: 4-12 characters
	ExtraMount *string `xml:"extramount,omitempty" json:"extramount,omitempty"`
// AddMount represents addmount
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Under
	AddMount *string `xml:"addmount,omitempty" json:"addmount,omitempty"`
// Avail represents avail
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 36
// Examples: 6F, 6F, 6R (and 7 more)
// Enum Candidate: Yes
// Length: 1-11 characters
	Avail string `xml:"avail" json:"avail"`
// Cost represents cost
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 44
// Examples: 750, 0, 600 (and 7 more)
// Note: 93.4% of values are numeric strings
// Enum Candidate: Yes
// Length: 1-20 characters
	Cost string `xml:"cost" json:"cost"`
	common.SourceReference
// AccessoryCostMultiplier represents accessorycostmultiplier
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 2
// Note: 100.0% of values are numeric strings
	AccessoryCostMultiplier *string `xml:"accessorycostmultiplier,omitempty" json:"accessorycostmultiplier,omitempty"`
// Accuracy represents accuracy
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 1, 2, 2 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: -1, 1, 2
// Length: 1-2 characters
	Accuracy *string `xml:"accuracy,omitempty" json:"accuracy,omitempty"`
	AddUnderbarrels *AddUnderbarrels `xml:"addunderbarrels,omitempty" json:"addunderbarrels,omitempty"`
	AllowGear *AllowGear `xml:"allowgear,omitempty" json:"allowgear,omitempty"`
// AmmoBonus represents ammobonus
// Type: mixed_numeric, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: -2, 50 * Rating, 50 (and 2 more)
// Enum Candidate: -2, -25, -50, 50, 50 * Rating
// Length: 2-11 characters
	AmmoBonus *string `xml:"ammobonus,omitempty" json:"ammobonus,omitempty"`
// AmmoReplace represents ammoreplace
// Type: mixed_numeric, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: 100(belt), 24(d), 32(d) (and 6 more)
// Enum Candidate: 10, 100(belt), 20, 24(d), 2500(belt), 30, 32(d), 40(c), External Source
// Length: 2-15 characters
	AmmoReplace *string `xml:"ammoreplace,omitempty" json:"ammoreplace,omitempty"`
// AmmoSlots represents ammoslots
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1, 1, 1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	AmmoSlots *string `xml:"ammoslots,omitempty" json:"ammoslots,omitempty"`
// Conceal represents conceal
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Conceal *string `xml:"conceal,omitempty" json:"conceal,omitempty"`
// Damage represents damage
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: S(e)
	Damage *string `xml:"damage,omitempty" json:"damage,omitempty"`
// DamageType represents damagetype
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: P
	DamageType *string `xml:"damagetype,omitempty" json:"damagetype,omitempty"`
	DicePool *int `xml:"dicepool,omitempty" json:"dicepool,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	Gears *WeaponGears `xml:"gears,omitempty" json:"gears,omitempty"`
	common.Visibility
// ModifyAmmoCapacity represents modifyammocapacity
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: * 3 div 4, +(Weapon * 0.5)
// Enum Candidate: * 3 div 4, +(Weapon * 0.5)
// Length: 9-15 characters
	ModifyAmmoCapacity *string `xml:"modifyammocapacity,omitempty" json:"modifyammocapacity,omitempty"`
// Rating represents rating
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 95.4% of values are boolean strings
// Enum Candidate: 0, 1, 10, 1000, 2, 6
// Length: 1-4 characters
	Rating *string `xml:"rating,omitempty" json:"rating,omitempty"`
// RC represents rc
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 2, 1, 2 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 1, 2, 3, 5, 6
	RC *string `xml:"rc,omitempty" json:"rc,omitempty"`
// RCDeployable represents rcdeployable
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: True, True, True (and 4 more)
// Note: 100.0% of values are boolean strings
	RCDeployable *string `xml:"rcdeployable,omitempty" json:"rcdeployable,omitempty"`
// RCGroup represents rcgroup
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 1, 1, 2 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 1, 2
	RCGroup *int `xml:"rcgroup,omitempty" json:"rcgroup,omitempty"`
// ReplaceRange represents replacerange
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Heavy Pistols
	ReplaceRange *string `xml:"replacerange,omitempty" json:"replacerange,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
	WirelessWeaponBonus *WirelessWeaponBonus `xml:"wirelessweaponbonus,omitempty" json:"wirelessweaponbonus,omitempty"`
}

// AddUnderbarrels represents additional underbarrel weapons
type AddUnderbarrels struct {
	Weapon []string `xml:"weapon" json:"weapon"`
}

// WeaponAccessoryItems represents a collection of standalone weapon accessories
type WeaponAccessoryItems struct {
	Accessory []WeaponAccessoryItem `xml:"accessory,omitempty" json:"accessory,omitempty"`
}

// ModName represents a mod name
type ModName struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
// Rating represents rating
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 95.4% of values are boolean strings
// Enum Candidate: 0, 1, 10, 1000, 2, 6
// Length: 1-4 characters
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// ModsContainer represents a mods container
type ModsContainer struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: Glock MP Custodes (MPV), Glock MP Custodes, HK Urban Combat
// Enum Candidate: Glock MP Custodes, Glock MP Custodes (MPV), HK Urban Combat
// Length: 15-23 characters
	Name []ModName `xml:"name,omitempty" json:"name,omitempty"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
	AddSlots *string `xml:"addslots,omitempty" json:"addslots,omitempty"`
	Mod []WeaponModItem `xml:"mod,omitempty" json:"mod,omitempty"`
}

// WeaponModItem represents a standalone weapon mod
type WeaponModItem struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: Glock MP Custodes (MPV), Glock MP Custodes, HK Urban Combat
// Enum Candidate: Glock MP Custodes, Glock MP Custodes (MPV), HK Urban Combat
// Length: 15-23 characters
	Name string `xml:"name" json:"name"`
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: Shotguns, Sporting Rifles, Sniper Rifles (and 7 more)
// Enum Candidate: Assault Cannons, Grenade Launchers, Heavy Machine Guns, Light Machine Guns, Medium Machine Guns, Missile Launchers, Shotguns, Sniper Rifles, Sporting Rifles
// Length: 8-19 characters
	Category string `xml:"category" json:"category"`
// Rating represents rating
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: 0, 0, 0 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 95.4% of values are boolean strings
// Enum Candidate: 0, 1, 10, 1000, 2, 6
// Length: 1-4 characters
	Rating string `xml:"rating" json:"rating"`
	common.Visibility
	Slots string `xml:"slots" json:"slots"`
// Avail represents avail
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 36
// Examples: 6F, 6F, 6R (and 7 more)
// Enum Candidate: Yes
// Length: 1-11 characters
	Avail string `xml:"avail" json:"avail"`
// Cost represents cost
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 44
// Examples: 750, 0, 600 (and 7 more)
// Note: 93.4% of values are numeric strings
// Enum Candidate: Yes
// Length: 1-20 characters
	Cost string `xml:"cost" json:"cost"`
	common.SourceReference
// AccessoryCostMultiplier represents accessorycostmultiplier
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 2
// Note: 100.0% of values are numeric strings
	AccessoryCostMultiplier *string `xml:"accessorycostmultiplier,omitempty" json:"accessorycostmultiplier,omitempty"`
	AddMode *string `xml:"addmode,omitempty" json:"addmode,omitempty"`
// AmmoBonus represents ammobonus
// Type: mixed_numeric, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: -2, 50 * Rating, 50 (and 2 more)
// Enum Candidate: -2, -25, -50, 50, 50 * Rating
// Length: 2-11 characters
	AmmoBonus *string `xml:"ammobonus,omitempty" json:"ammobonus,omitempty"`
// AmmoReplace represents ammoreplace
// Type: mixed_numeric, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: 100(belt), 24(d), 32(d) (and 6 more)
// Enum Candidate: 10, 100(belt), 20, 24(d), 2500(belt), 30, 32(d), 40(c), External Source
// Length: 2-15 characters
	AmmoReplace *string `xml:"ammoreplace,omitempty" json:"ammoreplace,omitempty"`
	APBonus *int `xml:"apbonus,omitempty" json:"apbonus,omitempty"`
// Conceal represents conceal
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Conceal *int `xml:"conceal,omitempty" json:"conceal,omitempty"`
	DicePool *string `xml:"dicepool,omitempty" json:"dicepool,omitempty"`
	DVBonus *int `xml:"dvbonus,omitempty" json:"dvbonus,omitempty"`
	FullBurst *int `xml:"fullburst,omitempty" json:"fullburst,omitempty"`
	ModCostMultiplier *string `xml:"modcostmultiplier,omitempty" json:"modcostmultiplier,omitempty"`
	RangeBonus *int `xml:"rangebonus,omitempty" json:"rangebonus,omitempty"`
// RC represents rc
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 2, 1, 2 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 1, 2, 3, 5, 6
	RC *string `xml:"rc,omitempty" json:"rc,omitempty"`
// RCGroup represents rcgroup
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 1, 1, 2 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 1, 2
	RCGroup *int `xml:"rcgroup,omitempty" json:"rcgroup,omitempty"`
	Suppressive *int `xml:"suppressive,omitempty" json:"suppressive,omitempty"`
	Gears *WeaponGears `xml:"gears,omitempty" json:"gears,omitempty"`
}

// WeaponModItems represents a collection of standalone weapon mods
type WeaponModItems struct {
	Mod []WeaponModItem `xml:"mod,omitempty" json:"mod,omitempty"`
}

// WeaponMountMods represents weapon mount mods
type WeaponMountMods struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: Glock MP Custodes (MPV), Glock MP Custodes, HK Urban Combat
// Enum Candidate: Glock MP Custodes, Glock MP Custodes (MPV), HK Urban Combat
// Length: 15-23 characters
	Name []ModName `xml:"name,omitempty" json:"name,omitempty"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
	AddSlots *string `xml:"addslots,omitempty" json:"addslots,omitempty"`
	Mod []WeaponModItem `xml:"mod,omitempty" json:"mod,omitempty"`
}

// WeaponsChummer represents the root chummer element for weapons
type WeaponsChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []WeaponCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Weapons []Weapons `xml:"weapons,omitempty" json:"weapons,omitempty"`
	Accessories []WeaponAccessoryItems `xml:"accessories,omitempty" json:"accessories,omitempty"`
	Mods []ModsContainer `xml:"mods,omitempty" json:"mods,omitempty"`
}

