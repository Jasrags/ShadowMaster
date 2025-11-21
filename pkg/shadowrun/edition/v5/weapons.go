package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains weapon structures generated from weapons.xsd

// WeaponCategory represents a weapon category
type WeaponCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Blackmarket *string `xml:"blackmarket,attr,omitempty" json:"+@blackmarket,omitempty"`
	Gunneryspec *string `xml:"gunneryspec,attr,omitempty" json:"+@gunneryspec,omitempty"`
	Type *string `xml:"type,attr,omitempty" json:"+@type,omitempty"`
}

// WeaponCategories represents a collection of weapon categories
type WeaponCategories struct {
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
	Name WeaponUseGearName `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
	Capacity *int `xml:"capacity,omitempty" json:"capacity,omitempty"`
	Page *int `xml:"page,omitempty" json:"page,omitempty"`
	Source *int `xml:"source,omitempty" json:"source,omitempty"`
	Gears *WeaponGears `xml:"gears,omitempty" json:"gears,omitempty"`
}

// WeaponAccessory represents a weapon accessory
type WeaponAccessory struct {
	Name []string `xml:"name" json:"name"`
	Mount []string `xml:"mount,omitempty" json:"mount,omitempty"`
	Rating []string `xml:"rating,omitempty" json:"rating,omitempty"`
	Gears *WeaponGears `xml:"gears,omitempty" json:"gears,omitempty"`
}

// WeaponAccessories represents a collection of weapon accessories
type WeaponAccessories struct {
	Accessory []WeaponAccessory `xml:"accessory" json:"accessory"`
}

// AccessoryMounts represents accessory mounts
type AccessoryMounts struct {
	Mount []string `xml:"mount" json:"mount"`
}

// AllowGear represents allowed gear categories
type AllowGear struct {
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
	Accuracy *string `xml:"accuracy,omitempty" json:"accuracy,omitempty"`
	AccuracyReplace *string `xml:"accuracyreplace,omitempty" json:"accuracyreplace,omitempty"`
	AP *string `xml:"ap,omitempty" json:"ap,omitempty"`
	APReplace *string `xml:"apreplace,omitempty" json:"apreplace,omitempty"`
	Damage *string `xml:"damage,omitempty" json:"damage,omitempty"`
	DamageReplace *string `xml:"damagereplace,omitempty" json:"damagereplace,omitempty"`
	DamageType *string `xml:"damagetype,omitempty" json:"damagetype,omitempty"`
	Mode *string `xml:"mode,omitempty" json:"mode,omitempty"`
	ModeReplace *string `xml:"modereplace,omitempty" json:"modereplace,omitempty"`
	Pool *string `xml:"pool,omitempty" json:"pool,omitempty"`
	RangeBonus *int `xml:"rangebonus,omitempty" json:"rangebonus,omitempty"`
	RC *string `xml:"rc,omitempty" json:"rc,omitempty"`
	SmartlinkPool *string `xml:"smartlinkpool,omitempty" json:"smartlinkpool,omitempty"`
	UseRange *string `xml:"userange,omitempty" json:"userange,omitempty"`
}

// Weapon represents a weapon definition
type Weapon struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	Type string `xml:"type" json:"type"`
	Conceal int `xml:"conceal" json:"conceal"`
	Accuracy string `xml:"accuracy" json:"accuracy"`
	Reach string `xml:"reach" json:"reach"`
	Damage string `xml:"damage" json:"damage"`
	AP string `xml:"ap" json:"ap"`
	Mode string `xml:"mode" json:"mode"`
	RC string `xml:"rc" json:"rc"`
	Ammo string `xml:"ammo" json:"ammo"`
	Avail string `xml:"avail" json:"avail"`
	Cost string `xml:"cost" json:"cost"`
	common.SourceReference
	Accessories *WeaponAccessories `xml:"accessories,omitempty" json:"accessories,omitempty"`
	AccessoryMounts *AccessoryMounts `xml:"accessorymounts,omitempty" json:"accessorymounts,omitempty"`
	AddWeapon []string `xml:"addweapon,omitempty" json:"addweapon,omitempty"`
	AllowAccessory *string `xml:"allowaccessory,omitempty" json:"allowaccessory,omitempty"`
	AllowGear *AllowGear `xml:"allowgear,omitempty" json:"allowgear,omitempty"`
	AllowMod *string `xml:"allowmod,omitempty" json:"allowmod,omitempty"`
	AllowFullBurst *string `xml:"allowfullburst,omitempty" json:"allowfullburst,omitempty"`
	AllowLongBurst *string `xml:"allowlongburst,omitempty" json:"allowlongburst,omitempty"`
	AllowShortBurst *string `xml:"allowshortburst,omitempty" json:"allowshortburst,omitempty"`
	AllowSingleShot *string `xml:"allowsingleshot,omitempty" json:"allowsingleshot,omitempty"`
	AllowSuppressive *string `xml:"allowsuppressive,omitempty" json:"allowsuppressive,omitempty"`
	AlternateRange []AlternateRange `xml:"alternaterange,omitempty" json:"alternaterange,omitempty"`
	AmmoCategory *string `xml:"ammocategory,omitempty" json:"ammocategory,omitempty"`
	AmmoSlots *int `xml:"ammoslots,omitempty" json:"ammoslots,omitempty"`
	Cyberware *string `xml:"cyberware,omitempty" json:"cyberware,omitempty"`
	DoubledCostAccessoryMounts *DoubledCostAccessoryMounts `xml:"doubledcostaccessorymounts,omitempty" json:"doubledcostaccessorymounts,omitempty"`
	ExtraMount *string `xml:"extramount,omitempty" json:"extramount,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	FullBurst *int `xml:"fullburst,omitempty" json:"fullburst,omitempty"`
	common.Visibility
	LongBurst *int `xml:"longburst,omitempty" json:"longburst,omitempty"`
	Mods *WeaponMods `xml:"mods,omitempty" json:"mods,omitempty"`
	Mount *string `xml:"mount,omitempty" json:"mount,omitempty"`
	Range []WeaponRange `xml:"range,omitempty" json:"range,omitempty"`
	RequireAmmo *string `xml:"requireammo,omitempty" json:"requireammo,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
	SingleShot *int `xml:"singleshot,omitempty" json:"singleshot,omitempty"`
	SizeCategory *string `xml:"sizecategory,omitempty" json:"sizecategory,omitempty"`
	ShortBurst *int `xml:"shortburst,omitempty" json:"shortburst,omitempty"`
	Spec *string `xml:"spec,omitempty" json:"spec,omitempty"`
	Spec2 *string `xml:"spec2,omitempty" json:"spec2,omitempty"`
	Suppressive *int `xml:"suppressive,omitempty" json:"suppressive,omitempty"`
	Underbarrels *Underbarrels `xml:"underbarrels,omitempty" json:"underbarrels,omitempty"`
	UseSkill *string `xml:"useskill,omitempty" json:"useskill,omitempty"`
	UseSkillSpec *string `xml:"useskillspec,omitempty" json:"useskillspec,omitempty"`
	WeaponType *string `xml:"weapontype,omitempty" json:"weapontype,omitempty"`
	WirelessWeaponBonus *WirelessWeaponBonus `xml:"wirelessweaponbonus,omitempty" json:"wirelessweaponbonus,omitempty"`
}

// Weapons represents a collection of weapons
type Weapons struct {
	Weapon []Weapon `xml:"weapon,omitempty" json:"weapon,omitempty"`
}

// WeaponAccessoryItem represents a standalone weapon accessory
type WeaponAccessoryItem struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Mount string `xml:"mount" json:"mount"`
	ExtraMount *string `xml:"extramount,omitempty" json:"extramount,omitempty"`
	AddMount *string `xml:"addmount,omitempty" json:"addmount,omitempty"`
	Avail string `xml:"avail" json:"avail"`
	Cost string `xml:"cost" json:"cost"`
	common.SourceReference
	AccessoryCostMultiplier *string `xml:"accessorycostmultiplier,omitempty" json:"accessorycostmultiplier,omitempty"`
	Accuracy *string `xml:"accuracy,omitempty" json:"accuracy,omitempty"`
	AddUnderbarrels *AddUnderbarrels `xml:"addunderbarrels,omitempty" json:"addunderbarrels,omitempty"`
	AllowGear *AllowGear `xml:"allowgear,omitempty" json:"allowgear,omitempty"`
	AmmoBonus *string `xml:"ammobonus,omitempty" json:"ammobonus,omitempty"`
	AmmoReplace *string `xml:"ammoreplace,omitempty" json:"ammoreplace,omitempty"`
	AmmoSlots *string `xml:"ammoslots,omitempty" json:"ammoslots,omitempty"`
	Conceal *string `xml:"conceal,omitempty" json:"conceal,omitempty"`
	Damage *string `xml:"damage,omitempty" json:"damage,omitempty"`
	DamageType *string `xml:"damagetype,omitempty" json:"damagetype,omitempty"`
	DicePool *int `xml:"dicepool,omitempty" json:"dicepool,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	Gears *WeaponGears `xml:"gears,omitempty" json:"gears,omitempty"`
	common.Visibility
	ModifyAmmoCapacity *string `xml:"modifyammocapacity,omitempty" json:"modifyammocapacity,omitempty"`
	Rating *string `xml:"rating,omitempty" json:"rating,omitempty"`
	RC *string `xml:"rc,omitempty" json:"rc,omitempty"`
	RCDeployable *string `xml:"rcdeployable,omitempty" json:"rcdeployable,omitempty"`
	RCGroup *int `xml:"rcgroup,omitempty" json:"rcgroup,omitempty"`
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
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// ModsContainer represents a mods container
type ModsContainer struct {
	Name []ModName `xml:"name,omitempty" json:"name,omitempty"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
	AddSlots *string `xml:"addslots,omitempty" json:"addslots,omitempty"`
	Mod []WeaponModItem `xml:"mod,omitempty" json:"mod,omitempty"`
}

// WeaponModItem represents a standalone weapon mod
type WeaponModItem struct {
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	Rating string `xml:"rating" json:"rating"`
	common.Visibility
	Slots string `xml:"slots" json:"slots"`
	Avail string `xml:"avail" json:"avail"`
	Cost string `xml:"cost" json:"cost"`
	common.SourceReference
	AccessoryCostMultiplier *string `xml:"accessorycostmultiplier,omitempty" json:"accessorycostmultiplier,omitempty"`
	AddMode *string `xml:"addmode,omitempty" json:"addmode,omitempty"`
	AmmoBonus *string `xml:"ammobonus,omitempty" json:"ammobonus,omitempty"`
	AmmoReplace *string `xml:"ammoreplace,omitempty" json:"ammoreplace,omitempty"`
	APBonus *int `xml:"apbonus,omitempty" json:"apbonus,omitempty"`
	Conceal *int `xml:"conceal,omitempty" json:"conceal,omitempty"`
	DicePool *string `xml:"dicepool,omitempty" json:"dicepool,omitempty"`
	DVBonus *int `xml:"dvbonus,omitempty" json:"dvbonus,omitempty"`
	FullBurst *int `xml:"fullburst,omitempty" json:"fullburst,omitempty"`
	ModCostMultiplier *string `xml:"modcostmultiplier,omitempty" json:"modcostmultiplier,omitempty"`
	RangeBonus *int `xml:"rangebonus,omitempty" json:"rangebonus,omitempty"`
	RC *string `xml:"rc,omitempty" json:"rc,omitempty"`
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

