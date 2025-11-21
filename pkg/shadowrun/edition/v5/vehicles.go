package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains vehicle structures generated from vehicles.xsd

// VehicleCategory represents a vehicle category
type VehicleCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Blackmarket *string `xml:"blackmarket,attr,omitempty" json:"+@blackmarket,omitempty"`
}

// VehicleCategories represents a collection of vehicle categories
type VehicleCategories struct {
	Category []VehicleCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// ModCategory represents a mod category
type ModCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Blackmarket *string `xml:"blackmarket,attr,omitempty" json:"+@blackmarket,omitempty"`
}

// ModCategories represents a collection of mod categories
type ModCategories struct {
	Category []ModCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// WeaponMountCategory represents a weapon mount category
type WeaponMountCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Blackmarket *string `xml:"blackmarket,attr,omitempty" json:"+@blackmarket,omitempty"`
}

// WeaponMountCategories represents a collection of weapon mount categories
type WeaponMountCategories struct {
	Category []WeaponMountCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// Limit represents a limit
type Limit struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// Limits represents a collection of limits
type Limits struct {
	Limit []Limit `xml:"limit,omitempty" json:"limit,omitempty"`
}

// VehicleModName represents a mod name
type VehicleModName struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// VehicleMods represents a mods container
type VehicleMods struct {
	Name []VehicleModName `xml:"name,omitempty" json:"name,omitempty"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
	AddSlots *string `xml:"addslots,omitempty" json:"addslots,omitempty"`
	Mod []VehicleModItem `xml:"mod,omitempty" json:"mod,omitempty"`
}

// VehicleWeaponMountMods represents weapon mount mods
type VehicleWeaponMountMods struct {
	Name []VehicleModName `xml:"name,omitempty" json:"name,omitempty"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
	AddSlots *string `xml:"addslots,omitempty" json:"addslots,omitempty"`
	Mod []VehicleModItem `xml:"mod,omitempty" json:"mod,omitempty"`
}

// VehicleModBonus represents a vehicle mod bonus
type VehicleModBonus struct {
	Accel *string `xml:"accel,omitempty" json:"accel,omitempty"`
	Armor *string `xml:"armor,omitempty" json:"armor,omitempty"`
	Body *string `xml:"body,omitempty" json:"body,omitempty"`
	DeviceRating *string `xml:"devicerating,omitempty" json:"devicerating,omitempty"`
	Handling *string `xml:"handling,omitempty" json:"handling,omitempty"`
	ImproveSensor *string `xml:"improvesensor,omitempty" json:"improvesensor,omitempty"`
	OffroadAccel *string `xml:"offroadaccel,omitempty" json:"offroadaccel,omitempty"`
	OffroadHandling *string `xml:"offroadhandling,omitempty" json:"offroadhandling,omitempty"`
	OffroadSpeed *string `xml:"offroadspeed,omitempty" json:"offroadspeed,omitempty"`
	Pilot *string `xml:"pilot,omitempty" json:"pilot,omitempty"`
	Seats *string `xml:"seats,omitempty" json:"seats,omitempty"`
	SelectText *string `xml:"selecttext,omitempty" json:"selecttext,omitempty"`
	Sensor *string `xml:"sensor,omitempty" json:"sensor,omitempty"`
	Speed *string `xml:"speed,omitempty" json:"speed,omitempty"`
}

// Subsystem represents a subsystem
type Subsystem struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// Subsystems represents a collection of subsystems
type Subsystems struct {
	Subsystem []Subsystem `xml:"subsystem,omitempty" json:"subsystem,omitempty"`
}

// VehicleCyberwareName represents a cyberware name for vehicles
type VehicleCyberwareName struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// VehicleCyberwareItem represents a cyberware item for vehicles
type VehicleCyberwareItem struct {
	Name *string `xml:"name,omitempty" json:"name,omitempty"`
	Forced *string `xml:"forced,omitempty" json:"forced,omitempty"`
	Rating *string `xml:"rating,omitempty" json:"rating,omitempty"`
}

// VehicleCyberwares represents a collection of cyberware
type VehicleCyberwares struct {
	Cyberware []VehicleCyberwareItem `xml:"cyberware,omitempty" json:"cyberware,omitempty"`
}

// VehicleGear represents a gear item
type VehicleGear struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// VehicleGears represents a collection of gear items
type VehicleGears struct {
	Gear []VehicleGear `xml:"gear,omitempty" json:"gear,omitempty"`
}

// VehicleModItem represents a standalone vehicle mod
type VehicleModItem struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	common.SourceReference
	Avail string `xml:"avail" json:"avail"`
	Category string `xml:"category" json:"category"`
	Cost string `xml:"cost" json:"cost"`
	Rating string `xml:"rating" json:"rating"`
	Slots string `xml:"slots" json:"slots"`
	Bonus *VehicleModBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	AmmoBonus *int `xml:"ammobonus,omitempty" json:"ammobonus,omitempty"`
	AmmoBonusPercent *int `xml:"ammobonuspercent,omitempty" json:"ammobonuspercent,omitempty"`
	AmmoReplace *string `xml:"ammoreplace,omitempty" json:"ammoreplace,omitempty"`
	Capacity *string `xml:"capacity,omitempty" json:"capacity,omitempty"`
	ConditionMonitor *string `xml:"conditionmonitor,omitempty" json:"conditionmonitor,omitempty"`
	Downgrade *Downgrade `xml:"downgrade,omitempty" json:"downgrade,omitempty"`
	Firewall *int `xml:"firewall,omitempty" json:"firewall,omitempty"`
	common.Visibility
	Limit *string `xml:"limit,omitempty" json:"limit,omitempty"`
	MinRating *string `xml:"minrating,omitempty" json:"minrating,omitempty"`
	OptionalDrone *OptionalDrone `xml:"optionaldrone,omitempty" json:"optionaldrone,omitempty"`
	Pilot *int `xml:"pilot,omitempty" json:"pilot,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
	Subsystems []Subsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`
	WeaponMountCategories *string `xml:"weaponmountcategories,omitempty" json:"weaponmountcategories,omitempty"`
}

// Downgrade represents a downgrade
type Downgrade struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// OptionalDrone represents an optional drone
type OptionalDrone struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// VehicleModItemName represents a mod name within a vehicle
type VehicleModItemName struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
	Rating *int `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
	Cost *int `xml:"cost,attr,omitempty" json:"+@cost,omitempty"`
}

// VehicleModItemContainer represents a mod container within a vehicle
type VehicleModItemContainer struct {
	AddSlots *int `xml:"addslots,omitempty" json:"addslots,omitempty"`
	Mod []VehicleModItemInner `xml:"mod,omitempty" json:"mod,omitempty"`
	Name []VehicleModItemName `xml:"name,omitempty" json:"name,omitempty"`
}

// VehicleModItemInner represents a mod within a vehicle
type VehicleModItemInner struct {
	Name *string `xml:"name,omitempty" json:"name,omitempty"`
	Subsystems *VehicleSubsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`
}

// VehicleSubsystems represents subsystems within a mod
type VehicleSubsystems struct {
	Cyberware *VehicleCyberwareItem `xml:"cyberware,omitempty" json:"cyberware,omitempty"`
}

// WeaponMount represents a weapon mount within a vehicle
type WeaponMount struct {
	Control string `xml:"control" json:"control"`
	Flexibility string `xml:"flexibility" json:"flexibility"`
	Size string `xml:"size" json:"size"`
	Visibility string `xml:"visibility" json:"visibility"`
	AllowedWeapons *string `xml:"allowedweapons,omitempty" json:"allowedweapons,omitempty"`
	Mods []WeaponMountModsContainer `xml:"mods,omitempty" json:"mods,omitempty"`
}

// WeaponMountModsContainer represents mods for a weapon mount
type WeaponMountModsContainer struct {
	Mod []string `xml:"mod" json:"mod"`
}

// VehicleWeaponMounts represents weapon mounts within a vehicle
type VehicleWeaponMounts struct {
	WeaponMount []WeaponMount `xml:"weaponmount,omitempty" json:"weaponmount,omitempty"`
}

// VehicleWeapons represents weapons within a vehicle
type VehicleWeapons struct {
	Weapon []string `xml:"weapon,omitempty" json:"weapon,omitempty"`
}

// Vehicle represents a vehicle definition
type Vehicle struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	common.SourceReference
	Accel string `xml:"accel" json:"accel"`
	Armor string `xml:"armor" json:"armor"`
	Avail string `xml:"avail" json:"avail"`
	Body string `xml:"body" json:"body"`
	Category string `xml:"category" json:"category"`
	Cost string `xml:"cost" json:"cost"`
	Handling string `xml:"handling" json:"handling"`
	Pilot string `xml:"pilot" json:"pilot"`
	Sensor string `xml:"sensor" json:"sensor"`
	Speed string `xml:"speed" json:"speed"`
	BodyModSlots *string `xml:"bodymodslots,omitempty" json:"bodymodslots,omitempty"`
	Cyberwares *VehicleCyberwares `xml:"cyberwares,omitempty" json:"cyberwares,omitempty"`
	Gears *VehicleGears `xml:"gears,omitempty" json:"gears,omitempty"`
	common.Visibility
	Mods *VehicleModItemContainer `xml:"mods,omitempty" json:"mods,omitempty"`
	ModSlots *string `xml:"modslots,omitempty" json:"modslots,omitempty"`
	Seats *string `xml:"seats,omitempty" json:"seats,omitempty"`
	WeaponModSlots *string `xml:"weaponmodslots,omitempty" json:"weaponmodslots,omitempty"`
	WeaponMounts *VehicleWeaponMounts `xml:"weaponmounts,omitempty" json:"weaponmounts,omitempty"`
	Weapons *VehicleWeapons `xml:"weapons,omitempty" json:"weapons,omitempty"`
}

// Vehicles represents a collection of vehicles
type Vehicles struct {
	Vehicle []Vehicle `xml:"vehicle,omitempty" json:"vehicle,omitempty"`
}

// WeaponMountItem represents a standalone weapon mount
type WeaponMountItem struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	common.Visibility
	common.SourceReference
	Avail string `xml:"avail" json:"avail"`
	Category string `xml:"category" json:"category"`
	Cost string `xml:"cost" json:"cost"`
	Create *string `xml:"create,omitempty" json:"create,omitempty"`
	OptionalDrone *string `xml:"optionaldrone,omitempty" json:"optionaldrone,omitempty"`
	Slots *string `xml:"slots,omitempty" json:"slots,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
	WeaponCategories *string `xml:"weaponcategories,omitempty" json:"weaponcategories,omitempty"`
	WeaponCapacity *string `xml:"weaponcapacity,omitempty" json:"weaponcapacity,omitempty"`
	WeaponFilter *string `xml:"weaponfilter,omitempty" json:"weaponfilter,omitempty"`
}

// WeaponMountItems represents a collection of standalone weapon mounts
type WeaponMountItems struct {
	WeaponMount []WeaponMountItem `xml:"weaponmount,omitempty" json:"weaponmount,omitempty"`
}

// VehiclesChummer represents the root chummer element for vehicles
type VehiclesChummer struct {
	Categories []VehicleCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	ModCategories []ModCategories `xml:"modcategories,omitempty" json:"modcategories,omitempty"`
	WeaponMountCategories []WeaponMountCategories `xml:"weaponmountcategories,omitempty" json:"weaponmountcategories,omitempty"`
	Limits []Limits `xml:"limits,omitempty" json:"limits,omitempty"`
	Vehicles *Vehicles `xml:"vehicles,omitempty" json:"vehicles,omitempty"`
	Mods *VehicleMods `xml:"mods,omitempty" json:"mods,omitempty"`
	WeaponMounts *WeaponMountItems `xml:"weaponmounts,omitempty" json:"weaponmounts,omitempty"`
	WeaponMountMods *VehicleWeaponMountMods `xml:"weaponmountmods,omitempty" json:"weaponmountmods,omitempty"`
}

