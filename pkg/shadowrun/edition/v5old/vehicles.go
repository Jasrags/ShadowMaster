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
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Drones, Drones, Drones (and 1 more)
	Category []VehicleCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// ModCategory represents a mod category
type ModCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Blackmarket *string `xml:"blackmarket,attr,omitempty" json:"+@blackmarket,omitempty"`
}

// ModCategories represents a collection of mod categories
type ModCategories struct {
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Drones, Drones, Drones (and 1 more)
	Category []ModCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// WeaponMountCategory represents a weapon mount category
type WeaponMountCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Blackmarket *string `xml:"blackmarket,attr,omitempty" json:"+@blackmarket,omitempty"`
}

// WeaponMountCategories represents a collection of weapon mount categories
type WeaponMountCategories struct {
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Drones, Drones, Drones (and 1 more)
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
// Rating represents rating
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 2 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Rating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
}

// VehicleMods represents a mods container
type VehicleMods struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Blow-Away Panel Weapon Mount Add-on (Drone), Pop-Out Weapon Mount Add-on (Drone), Expanded Ammunition Bay (Second Bin) Weapon Mount Add-on (Drone) (and 2 more)
// Length: 8-64 characters
	Name []VehicleModName `xml:"name,omitempty" json:"name,omitempty"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
// AddSlots represents addslots
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 3
// Note: 100.0% of values are numeric strings
	AddSlots *string `xml:"addslots,omitempty" json:"addslots,omitempty"`
// Mod represents mod
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: Expanded Ammunition Bay (Second Bin) Weapon Mount Add-on (Drone), Ammo Bin, Ammo Bin
// Length: 8-64 characters
	Mod []VehicleModItem `xml:"mod,omitempty" json:"mod,omitempty"`
}

// VehicleWeaponMountMods represents weapon mount mods
type VehicleWeaponMountMods struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Blow-Away Panel Weapon Mount Add-on (Drone), Pop-Out Weapon Mount Add-on (Drone), Expanded Ammunition Bay (Second Bin) Weapon Mount Add-on (Drone) (and 2 more)
// Length: 8-64 characters
	Name []VehicleModName `xml:"name,omitempty" json:"name,omitempty"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
// AddSlots represents addslots
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 3
// Note: 100.0% of values are numeric strings
	AddSlots *string `xml:"addslots,omitempty" json:"addslots,omitempty"`
// Mod represents mod
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: Expanded Ammunition Bay (Second Bin) Weapon Mount Add-on (Drone), Ammo Bin, Ammo Bin
// Length: 8-64 characters
	Mod []VehicleModItem `xml:"mod,omitempty" json:"mod,omitempty"`
}

// VehicleModBonus represents a vehicle mod bonus
type VehicleModBonus struct {
// Accel represents accel
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: +Rating, 0, -1 (and 6 more)
// Enum Candidate: +Rating, -1, 0, Rating
// Length: 1-7 characters
	Accel *string `xml:"accel,omitempty" json:"accel,omitempty"`
// Armor represents armor
// Type: mixed_numeric, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: +Rating, +Rating, Rating (and 1 more)
// Enum Candidate: +Rating, -3, Rating
// Length: 2-7 characters
	Armor *string `xml:"armor,omitempty" json:"armor,omitempty"`
// Body represents body
// Type: mixed_numeric, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: -Rating, -1
// Enum Candidate: -1, -Rating
// Length: 2-7 characters
	Body *string `xml:"body,omitempty" json:"body,omitempty"`
// DeviceRating represents devicerating
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	DeviceRating *string `xml:"devicerating,omitempty" json:"devicerating,omitempty"`
// Handling represents handling
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: +Rating, -1, -1 (and 7 more)
// Note: 81.8% of values are numeric strings
// Enum Candidate: +1, +Rating, -1, Rating
// Length: 2-7 characters
	Handling *string `xml:"handling,omitempty" json:"handling,omitempty"`
	ImproveSensor *string `xml:"improvesensor,omitempty" json:"improvesensor,omitempty"`
// OffroadAccel represents offroadaccel
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: +Rating, 0, -1 (and 6 more)
// Enum Candidate: +Rating, -1, 0, Rating
// Length: 1-7 characters
	OffroadAccel *string `xml:"offroadaccel,omitempty" json:"offroadaccel,omitempty"`
// OffroadHandling represents offroadhandling
// Type: mixed_numeric, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: +Rating, +1, +1 (and 3 more)
// Enum Candidate: +1, +Rating, -1, Rating
// Length: 2-7 characters
	OffroadHandling *string `xml:"offroadhandling,omitempty" json:"offroadhandling,omitempty"`
// OffroadSpeed represents offroadspeed
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: +Rating, 0, -1 (and 6 more)
// Enum Candidate: +Rating, -1, 0, Rating
// Length: 1-7 characters
	OffroadSpeed *string `xml:"offroadspeed,omitempty" json:"offroadspeed,omitempty"`
// Pilot represents pilot
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Rating, Rating
	Pilot *string `xml:"pilot,omitempty" json:"pilot,omitempty"`
// Seats represents seats
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Seats *string `xml:"seats,omitempty" json:"seats,omitempty"`
	SelectText *string `xml:"selecttext,omitempty" json:"selecttext,omitempty"`
// Sensor represents sensor
// Type: mixed_numeric, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: Rating, Rating, Rating (and 1 more)
// Enum Candidate: -1, Rating
// Length: 2-6 characters
	Sensor *string `xml:"sensor,omitempty" json:"sensor,omitempty"`
// Speed represents speed
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: +Rating, 0, -1 (and 6 more)
// Enum Candidate: +Rating, -1, 0, Rating
// Length: 1-7 characters
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
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Blow-Away Panel Weapon Mount Add-on (Drone), Pop-Out Weapon Mount Add-on (Drone), Expanded Ammunition Bay (Second Bin) Weapon Mount Add-on (Drone) (and 2 more)
// Length: 8-64 characters
	Name *string `xml:"name,omitempty" json:"name,omitempty"`
	Forced *string `xml:"forced,omitempty" json:"forced,omitempty"`
// Rating represents rating
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 2 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
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
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 45d84d77-5461-4441-a529-527aba347334, dd03dc64-64e1-49a7-8836-d932cd4cb95b, c3f9f5a4-b8d4-11e6-80f5-76304dec7eb7 (and 2 more)
// Enum Candidate: 45d84d77-5461-4441-a529-527aba347334, 6741d080-0e40-4941-a7b5-85ab3e1a9cb2, c3f9f5a4-b8d4-11e6-80f5-76304dec7eb7, c3f9fa86-b8d4-11e6-80f5-76304dec7eb7, dd03dc64-64e1-49a7-8836-d932cd4cb95b
	ID string `xml:"id" json:"id"`
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Blow-Away Panel Weapon Mount Add-on (Drone), Pop-Out Weapon Mount Add-on (Drone), Expanded Ammunition Bay (Second Bin) Weapon Mount Add-on (Drone) (and 2 more)
// Length: 8-64 characters
	Name string `xml:"name" json:"name"`
	common.SourceReference
// Avail represents avail
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 0, 0, 0 (and 2 more)
// Enum Candidate: 0, 6R
// Length: 1-2 characters
	Avail string `xml:"avail" json:"avail"`
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Drones, Drones, Drones (and 1 more)
	Category string `xml:"category" json:"category"`
// Cost represents cost
// Type: mixed_numeric, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 25, Slots * 100, 50 (and 2 more)
// Enum Candidate: 200, 25, 50, 500, Slots * 100
// Length: 2-11 characters
	Cost string `xml:"cost" json:"cost"`
// Rating represents rating
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 2 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Rating string `xml:"rating" json:"rating"`
// Slots represents slots
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 0, 1, 1 (and 2 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 1, 2
	Slots string `xml:"slots" json:"slots"`
	Bonus *VehicleModBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
// AmmoBonus represents ammobonus
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 250
// Note: 100.0% of values are numeric strings
	AmmoBonus *int `xml:"ammobonus,omitempty" json:"ammobonus,omitempty"`
// AmmoBonusPercent represents ammobonuspercent
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 100
// Note: 100.0% of values are numeric strings
	AmmoBonusPercent *int `xml:"ammobonuspercent,omitempty" json:"ammobonuspercent,omitempty"`
// AmmoReplace represents ammoreplace
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 100(belt)
	AmmoReplace *string `xml:"ammoreplace,omitempty" json:"ammoreplace,omitempty"`
// Capacity represents capacity
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 15, 15, 15 (and 2 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 15, 20
	Capacity *string `xml:"capacity,omitempty" json:"capacity,omitempty"`
// ConditionMonitor represents conditionmonitor
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1, 1, 1
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	ConditionMonitor *string `xml:"conditionmonitor,omitempty" json:"conditionmonitor,omitempty"`
	Downgrade *Downgrade `xml:"downgrade,omitempty" json:"downgrade,omitempty"`
	Firewall *int `xml:"firewall,omitempty" json:"firewall,omitempty"`
	common.Visibility
	Limit *string `xml:"limit,omitempty" json:"limit,omitempty"`
// MinRating represents minrating
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Sensor + 1, Handling + 1, Speed + 1 (and 3 more)
// Enum Candidate: Acceleration + 1, Armor + 1, Handling + 1, Sensor + 1, Speed + 1
// Length: 9-16 characters
	MinRating *string `xml:"minrating,omitempty" json:"minrating,omitempty"`
	OptionalDrone *OptionalDrone `xml:"optionaldrone,omitempty" json:"optionaldrone,omitempty"`
// Pilot represents pilot
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Rating, Rating
	Pilot *int `xml:"pilot,omitempty" json:"pilot,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
	Subsystems []Subsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`
// WeaponMountCategories represents weaponmountcategories
// Usage: always present (100.0%)
// Unique Values: 8
// Examples: Micro-Drone Weapons, Tasers,Holdouts,Light Pistols,Grenades,Blades,Clubs, Blades,Clubs,Improvised Weapons,Exotic Melee Weapons,Cyberweapon,Bio-Weapon,Unarmed,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols (and 5 more)
// Length: 19-350 characters
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
// Rating represents rating
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0, 0, 0 (and 2 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Rating *int `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`
// Cost represents cost
// Type: mixed_numeric, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 25, Slots * 100, 50 (and 2 more)
// Enum Candidate: 200, 25, 50, 500, Slots * 100
// Length: 2-11 characters
	Cost *int `xml:"cost,attr,omitempty" json:"+@cost,omitempty"`
}

// VehicleModItemContainer represents a mod container within a vehicle
type VehicleModItemContainer struct {
// AddSlots represents addslots
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 3
// Note: 100.0% of values are numeric strings
	AddSlots *int `xml:"addslots,omitempty" json:"addslots,omitempty"`
// Mod represents mod
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: Expanded Ammunition Bay (Second Bin) Weapon Mount Add-on (Drone), Ammo Bin, Ammo Bin
// Length: 8-64 characters
	Mod []VehicleModItemInner `xml:"mod,omitempty" json:"mod,omitempty"`
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Blow-Away Panel Weapon Mount Add-on (Drone), Pop-Out Weapon Mount Add-on (Drone), Expanded Ammunition Bay (Second Bin) Weapon Mount Add-on (Drone) (and 2 more)
// Length: 8-64 characters
	Name []VehicleModItemName `xml:"name,omitempty" json:"name,omitempty"`
}

// VehicleModItemInner represents a mod within a vehicle
type VehicleModItemInner struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Blow-Away Panel Weapon Mount Add-on (Drone), Pop-Out Weapon Mount Add-on (Drone), Expanded Ammunition Bay (Second Bin) Weapon Mount Add-on (Drone) (and 2 more)
// Length: 8-64 characters
	Name *string `xml:"name,omitempty" json:"name,omitempty"`
	Subsystems *VehicleSubsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`
}

// VehicleSubsystems represents subsystems within a mod
type VehicleSubsystems struct {
	Cyberware *VehicleCyberwareItem `xml:"cyberware,omitempty" json:"cyberware,omitempty"`
}

// WeaponMount represents a weapon mount within a vehicle
type WeaponMount struct {
// Control represents control
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: Manual [SR5], Remote [SR5], None (and 6 more)
// Enum Candidate: Manual [SR5], None, Remote [SR5]
// Length: 4-12 characters
	Control string `xml:"control" json:"control"`
// Flexibility represents flexibility
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: Flexible [SR5], None, Flexible [SR5] (and 3 more)
// Enum Candidate: Flexible [SR5], None
// Length: 4-14 characters
	Flexibility string `xml:"flexibility" json:"flexibility"`
// Size represents size
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 11
// Examples: Standard, Standard, Heavy (and 7 more)
// Enum Candidate: Built-In, Heavy, Heavy (Drone), Heavy [SR5], Huge (Drone), Large (Drone), Light, Mini (Drone), Small (Drone), Standard, Standard (Drone)
// Length: 5-16 characters
	Size string `xml:"size" json:"size"`
// Visibility represents visibility
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: External [SR5], None, External [SR5] (and 3 more)
// Enum Candidate: External [SR5], None
// Length: 4-14 characters
	Visibility string `xml:"visibility" json:"visibility"`
// AllowedWeapons represents allowedweapons
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 13
// Examples: Melee Bite, Colt Cobra TZ-120, Defiance EX Shocker (and 7 more)
// Enum Candidate: Colt Cobra TZ-120, Defiance EX Shocker, GE Vindicator Mini-Gun, Jaws, Krupp Munitions 3E Firefighting Cannon, Melee Bite, Micro-Torpedo Launcher, Riot Shield, Siemens FWD Screamer Sonic Cannon, Stoner-Ares M202, Sword, Underbarrel Grenade Launcher, Yamaha Pulsar
// Length: 4-38 characters
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
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 45d84d77-5461-4441-a529-527aba347334, dd03dc64-64e1-49a7-8836-d932cd4cb95b, c3f9f5a4-b8d4-11e6-80f5-76304dec7eb7 (and 2 more)
// Enum Candidate: 45d84d77-5461-4441-a529-527aba347334, 6741d080-0e40-4941-a7b5-85ab3e1a9cb2, c3f9f5a4-b8d4-11e6-80f5-76304dec7eb7, c3f9fa86-b8d4-11e6-80f5-76304dec7eb7, dd03dc64-64e1-49a7-8836-d932cd4cb95b
	ID string `xml:"id" json:"id"`
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Blow-Away Panel Weapon Mount Add-on (Drone), Pop-Out Weapon Mount Add-on (Drone), Expanded Ammunition Bay (Second Bin) Weapon Mount Add-on (Drone) (and 2 more)
// Length: 8-64 characters
	Name string `xml:"name" json:"name"`
	common.SourceReference
// Accel represents accel
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: +Rating, 0, -1 (and 6 more)
// Enum Candidate: +Rating, -1, 0, Rating
// Length: 1-7 characters
	Accel string `xml:"accel" json:"accel"`
// Armor represents armor
// Type: mixed_numeric, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: +Rating, +Rating, Rating (and 1 more)
// Enum Candidate: +Rating, -3, Rating
// Length: 2-7 characters
	Armor string `xml:"armor" json:"armor"`
// Avail represents avail
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 0, 0, 0 (and 2 more)
// Enum Candidate: 0, 6R
// Length: 1-2 characters
	Avail string `xml:"avail" json:"avail"`
// Body represents body
// Type: mixed_numeric, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: -Rating, -1
// Enum Candidate: -1, -Rating
// Length: 2-7 characters
	Body string `xml:"body" json:"body"`
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Drones, Drones, Drones (and 1 more)
	Category string `xml:"category" json:"category"`
// Cost represents cost
// Type: mixed_numeric, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 25, Slots * 100, 50 (and 2 more)
// Enum Candidate: 200, 25, 50, 500, Slots * 100
// Length: 2-11 characters
	Cost string `xml:"cost" json:"cost"`
// Handling represents handling
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: +Rating, -1, -1 (and 7 more)
// Note: 81.8% of values are numeric strings
// Enum Candidate: +1, +Rating, -1, Rating
// Length: 2-7 characters
	Handling string `xml:"handling" json:"handling"`
// Pilot represents pilot
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Rating, Rating
	Pilot string `xml:"pilot" json:"pilot"`
// Sensor represents sensor
// Type: mixed_numeric, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: Rating, Rating, Rating (and 1 more)
// Enum Candidate: -1, Rating
// Length: 2-6 characters
	Sensor string `xml:"sensor" json:"sensor"`
// Speed represents speed
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: +Rating, 0, -1 (and 6 more)
// Enum Candidate: +Rating, -1, 0, Rating
// Length: 1-7 characters
	Speed string `xml:"speed" json:"speed"`
// BodyModSlots represents bodymodslots
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 4, 4, 4 (and 1 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: -7, 4
// Length: 1-2 characters
	BodyModSlots *string `xml:"bodymodslots,omitempty" json:"bodymodslots,omitempty"`
	Cyberwares *VehicleCyberwares `xml:"cyberwares,omitempty" json:"cyberwares,omitempty"`
	Gears *VehicleGears `xml:"gears,omitempty" json:"gears,omitempty"`
	common.Visibility
	Mods *VehicleModItemContainer `xml:"mods,omitempty" json:"mods,omitempty"`
// ModSlots represents modslots
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: 0, 0, 1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 1, 2, 3, 4, 7
	ModSlots *string `xml:"modslots,omitempty" json:"modslots,omitempty"`
// Seats represents seats
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Seats *string `xml:"seats,omitempty" json:"seats,omitempty"`
// WeaponModSlots represents weaponmodslots
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 3, 4, -7
// Note: 100.0% of values are numeric strings
// Enum Candidate: -7, 3, 4
// Length: 1-2 characters
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
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 45d84d77-5461-4441-a529-527aba347334, dd03dc64-64e1-49a7-8836-d932cd4cb95b, c3f9f5a4-b8d4-11e6-80f5-76304dec7eb7 (and 2 more)
// Enum Candidate: 45d84d77-5461-4441-a529-527aba347334, 6741d080-0e40-4941-a7b5-85ab3e1a9cb2, c3f9f5a4-b8d4-11e6-80f5-76304dec7eb7, c3f9fa86-b8d4-11e6-80f5-76304dec7eb7, dd03dc64-64e1-49a7-8836-d932cd4cb95b
	ID string `xml:"id" json:"id"`
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Blow-Away Panel Weapon Mount Add-on (Drone), Pop-Out Weapon Mount Add-on (Drone), Expanded Ammunition Bay (Second Bin) Weapon Mount Add-on (Drone) (and 2 more)
// Length: 8-64 characters
	Name string `xml:"name" json:"name"`
	common.Visibility
	common.SourceReference
// Avail represents avail
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 0, 0, 0 (and 2 more)
// Enum Candidate: 0, 6R
// Length: 1-2 characters
	Avail string `xml:"avail" json:"avail"`
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Drones, Drones, Drones (and 1 more)
	Category string `xml:"category" json:"category"`
// Cost represents cost
// Type: mixed_numeric, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 25, Slots * 100, 50 (and 2 more)
// Enum Candidate: 200, 25, 50, 500, Slots * 100
// Length: 2-11 characters
	Cost string `xml:"cost" json:"cost"`
	Create *string `xml:"create,omitempty" json:"create,omitempty"`
	OptionalDrone *string `xml:"optionaldrone,omitempty" json:"optionaldrone,omitempty"`
// Slots represents slots
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 0, 1, 1 (and 2 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 0, 1, 2
	Slots *string `xml:"slots,omitempty" json:"slots,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
// WeaponCategories represents weaponcategories
// Usage: always present (100.0%)
// Unique Values: 12
// Examples: Blades,Clubs,Exotic Melee Weapons,Crossbows,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols,Submachine Guns,Assault Rifles,Shotguns,Exotic Ranged Weapons,Flamethrowers,Special Weapons,Sporting Rifles, Blades,Clubs,Exotic Melee Weapons,Crossbows,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols,Submachine Guns,Assault Rifles,Sniper Rifles,Shotguns,Grenade Launchers,Missile Launchers,Laser Weapons,Light Machine Guns,Medium Machine Guns,Heavy Machine Guns,Assault Cannons,Flamethrowers,Sporting Rifles,Exotic Ranged Weapons, Blades,Clubs,Improvised Weapons,Exotic Melee Weapons,Cyberweapon,Bio-Weapon,Unarmed,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols,Submachine Guns (and 7 more)
// Length: 19-350 characters
	WeaponCategories *string `xml:"weaponcategories,omitempty" json:"weaponcategories,omitempty"`
	WeaponCapacity *string `xml:"weaponcapacity,omitempty" json:"weaponcapacity,omitempty"`
// WeaponFilter represents weaponfilter
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: ((type != "Melee") or (type = "Melee" and reach = "0"))
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
// WeaponMountCategories represents weaponmountcategories
// Usage: always present (100.0%)
// Unique Values: 8
// Examples: Micro-Drone Weapons, Tasers,Holdouts,Light Pistols,Grenades,Blades,Clubs, Blades,Clubs,Improvised Weapons,Exotic Melee Weapons,Cyberweapon,Bio-Weapon,Unarmed,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols (and 5 more)
// Length: 19-350 characters
	WeaponMountCategories []WeaponMountCategories `xml:"weaponmountcategories,omitempty" json:"weaponmountcategories,omitempty"`
	Limits []Limits `xml:"limits,omitempty" json:"limits,omitempty"`
	Vehicles *Vehicles `xml:"vehicles,omitempty" json:"vehicles,omitempty"`
	Mods *VehicleMods `xml:"mods,omitempty" json:"mods,omitempty"`
	WeaponMounts *WeaponMountItems `xml:"weaponmounts,omitempty" json:"weaponmounts,omitempty"`
	WeaponMountMods *VehicleWeaponMountMods `xml:"weaponmountmods,omitempty" json:"weaponmountmods,omitempty"`
}

