#!/usr/bin/env python3
"""Generate vehicles.go from vehicles.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def generate_vehicles():
    """Generate vehicles.go from vehicles.xsd"""
    
    tree = ET.parse('data/chummerxml/vehicles.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/vehicles.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains vehicle structures generated from vehicles.xsd\n\n')
        
        # Generate VehicleCategory struct
        f.write('// VehicleCategory represents a vehicle category\n')
        f.write('type VehicleCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tBlackmarket *string `xml:"blackmarket,attr,omitempty" json:"+@blackmarket,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleCategories struct
        f.write('// VehicleCategories represents a collection of vehicle categories\n')
        f.write('type VehicleCategories struct {\n')
        f.write('\tCategory []VehicleCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ModCategory struct
        f.write('// ModCategory represents a mod category\n')
        f.write('type ModCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tBlackmarket *string `xml:"blackmarket,attr,omitempty" json:"+@blackmarket,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ModCategories struct
        f.write('// ModCategories represents a collection of mod categories\n')
        f.write('type ModCategories struct {\n')
        f.write('\tCategory []ModCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate WeaponMountCategory struct
        f.write('// WeaponMountCategory represents a weapon mount category\n')
        f.write('type WeaponMountCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tBlackmarket *string `xml:"blackmarket,attr,omitempty" json:"+@blackmarket,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate WeaponMountCategories struct
        f.write('// WeaponMountCategories represents a collection of weapon mount categories\n')
        f.write('type WeaponMountCategories struct {\n')
        f.write('\tCategory []WeaponMountCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Limit struct
        f.write('// Limit represents a limit\n')
        f.write('type Limit struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Limits struct
        f.write('// Limits represents a collection of limits\n')
        f.write('type Limits struct {\n')
        f.write('\tLimit []Limit `xml:"limit,omitempty" json:"limit,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ModName struct (for mods container)
        f.write('// ModName represents a mod name\n')
        f.write('type ModName struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleMods struct (for mods container)
        f.write('// VehicleMods represents a mods container\n')
        f.write('type VehicleMods struct {\n')
        f.write('\tName []ModName `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('\tHide *string `xml:"hide,omitempty" json:"hide,omitempty"`\n')
        f.write('\tAddSlots *string `xml:"addslots,omitempty" json:"addslots,omitempty"`\n')
        f.write('\tMod []VehicleModItem `xml:"mod,omitempty" json:"mod,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate WeaponMountMods struct
        f.write('// WeaponMountMods represents weapon mount mods\n')
        f.write('type WeaponMountMods struct {\n')
        f.write('\tName []ModName `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('\tHide *string `xml:"hide,omitempty" json:"hide,omitempty"`\n')
        f.write('\tAddSlots *string `xml:"addslots,omitempty" json:"addslots,omitempty"`\n')
        f.write('\tMod []VehicleModItem `xml:"mod,omitempty" json:"mod,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleModBonus struct
        f.write('// VehicleModBonus represents a vehicle mod bonus\n')
        f.write('type VehicleModBonus struct {\n')
        f.write('\tAccel *string `xml:"accel,omitempty" json:"accel,omitempty"`\n')
        f.write('\tArmor *string `xml:"armor,omitempty" json:"armor,omitempty"`\n')
        f.write('\tBody *string `xml:"body,omitempty" json:"body,omitempty"`\n')
        f.write('\tDeviceRating *string `xml:"devicerating,omitempty" json:"devicerating,omitempty"`\n')
        f.write('\tHandling *string `xml:"handling,omitempty" json:"handling,omitempty"`\n')
        f.write('\tImproveSensor *string `xml:"improvesensor,omitempty" json:"improvesensor,omitempty"`\n')
        f.write('\tOffroadAccel *string `xml:"offroadaccel,omitempty" json:"offroadaccel,omitempty"`\n')
        f.write('\tOffroadHandling *string `xml:"offroadhandling,omitempty" json:"offroadhandling,omitempty"`\n')
        f.write('\tOffroadSpeed *string `xml:"offroadspeed,omitempty" json:"offroadspeed,omitempty"`\n')
        f.write('\tPilot *string `xml:"pilot,omitempty" json:"pilot,omitempty"`\n')
        f.write('\tSeats *string `xml:"seats,omitempty" json:"seats,omitempty"`\n')
        f.write('\tSelectText *string `xml:"selecttext,omitempty" json:"selecttext,omitempty"`\n')
        f.write('\tSensor *string `xml:"sensor,omitempty" json:"sensor,omitempty"`\n')
        f.write('\tSpeed *string `xml:"speed,omitempty" json:"speed,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Subsystem struct
        f.write('// Subsystem represents a subsystem\n')
        f.write('type Subsystem struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Subsystems struct
        f.write('// Subsystems represents a collection of subsystems\n')
        f.write('type Subsystems struct {\n')
        f.write('\tSubsystem []Subsystem `xml:"subsystem,omitempty" json:"subsystem,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CyberwareName struct
        f.write('// CyberwareName represents a cyberware name\n')
        f.write('type CyberwareName struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Cyberware struct
        f.write('// Cyberware represents a cyberware item\n')
        f.write('type Cyberware struct {\n')
        f.write('\tName *string `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('\tForced *string `xml:"forced,omitempty" json:"forced,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleCyberwares struct
        f.write('// VehicleCyberwares represents a collection of cyberware\n')
        f.write('type VehicleCyberwares struct {\n')
        f.write('\tCyberware []Cyberware `xml:"cyberware,omitempty" json:"cyberware,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Gear struct (for vehicle gears)
        f.write('// VehicleGear represents a gear item\n')
        f.write('type VehicleGear struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleGears struct
        f.write('// VehicleGears represents a collection of gear items\n')
        f.write('type VehicleGears struct {\n')
        f.write('\tGear []VehicleGear `xml:"gear,omitempty" json:"gear,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleModItem struct (standalone mod)
        f.write('// VehicleModItem represents a standalone vehicle mod\n')
        f.write('type VehicleModItem struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('\tAvail string `xml:"avail" json:"avail"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('\tRating string `xml:"rating" json:"rating"`\n')
        f.write('\tSlots string `xml:"slots" json:"slots"`\n')
        f.write('\tBonus *VehicleModBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tAmmoBonus *int `xml:"ammobonus,omitempty" json:"ammobonus,omitempty"`\n')
        f.write('\tAmmoBonusPercent *int `xml:"ammobonuspercent,omitempty" json:"ammobonuspercent,omitempty"`\n')
        f.write('\tAmmoReplace *string `xml:"ammoreplace,omitempty" json:"ammoreplace,omitempty"`\n')
        f.write('\tCapacity *string `xml:"capacity,omitempty" json:"capacity,omitempty"`\n')
        f.write('\tConditionMonitor *string `xml:"conditionmonitor,omitempty" json:"conditionmonitor,omitempty"`\n')
        f.write('\tDowngrade *Downgrade `xml:"downgrade,omitempty" json:"downgrade,omitempty"`\n')
        f.write('\tFirewall *int `xml:"firewall,omitempty" json:"firewall,omitempty"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tLimit *string `xml:"limit,omitempty" json:"limit,omitempty"`\n')
        f.write('\tMinRating *string `xml:"minrating,omitempty" json:"minrating,omitempty"`\n')
        f.write('\tOptionalDrone *OptionalDrone `xml:"optionaldrone,omitempty" json:"optionaldrone,omitempty"`\n')
        f.write('\tPilot *int `xml:"pilot,omitempty" json:"pilot,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('\tSubsystems []Subsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`\n')
        f.write('\tWeaponMountCategories *string `xml:"weaponmountcategories,omitempty" json:"weaponmountcategories,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Downgrade struct
        f.write('// Downgrade represents a downgrade\n')
        f.write('type Downgrade struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate OptionalDrone struct
        f.write('// OptionalDrone represents an optional drone\n')
        f.write('type OptionalDrone struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleModItemName struct (for mods within vehicle)
        f.write('// VehicleModItemName represents a mod name within a vehicle\n')
        f.write('type VehicleModItemName struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('\tRating *int `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('\tCost *int `xml:"cost,attr,omitempty" json:"+@cost,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleModItemContainer struct (for mods within vehicle)
        f.write('// VehicleModItemContainer represents a mod container within a vehicle\n')
        f.write('type VehicleModItemContainer struct {\n')
        f.write('\tAddSlots *int `xml:"addslots,omitempty" json:"addslots,omitempty"`\n')
        f.write('\tMod []VehicleModItemInner `xml:"mod,omitempty" json:"mod,omitempty"`\n')
        f.write('\tName []VehicleModItemName `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleModItemInner struct (for mods within vehicle)
        f.write('// VehicleModItemInner represents a mod within a vehicle\n')
        f.write('type VehicleModItemInner struct {\n')
        f.write('\tName *string `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('\tSubsystems *VehicleSubsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleSubsystems struct (for subsystems within mod)
        f.write('// VehicleSubsystems represents subsystems within a mod\n')
        f.write('type VehicleSubsystems struct {\n')
        f.write('\tCyberware *Cyberware `xml:"cyberware,omitempty" json:"cyberware,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate WeaponMount struct (within vehicle)
        f.write('// WeaponMount represents a weapon mount within a vehicle\n')
        f.write('type WeaponMount struct {\n')
        f.write('\tControl string `xml:"control" json:"control"`\n')
        f.write('\tFlexibility string `xml:"flexibility" json:"flexibility"`\n')
        f.write('\tSize string `xml:"size" json:"size"`\n')
        f.write('\tVisibility string `xml:"visibility" json:"visibility"`\n')
        f.write('\tAllowedWeapons *string `xml:"allowedweapons,omitempty" json:"allowedweapons,omitempty"`\n')
        f.write('\tMods []WeaponMountModsContainer `xml:"mods,omitempty" json:"mods,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate WeaponMountModsContainer struct
        f.write('// WeaponMountModsContainer represents mods for a weapon mount\n')
        f.write('type WeaponMountModsContainer struct {\n')
        f.write('\tMod []string `xml:"mod" json:"mod"`\n')
        f.write('}\n\n')
        
        # Generate VehicleWeaponMounts struct
        f.write('// VehicleWeaponMounts represents weapon mounts within a vehicle\n')
        f.write('type VehicleWeaponMounts struct {\n')
        f.write('\tWeaponMount []WeaponMount `xml:"weaponmount,omitempty" json:"weaponmount,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleWeapons struct
        f.write('// VehicleWeapons represents weapons within a vehicle\n')
        f.write('type VehicleWeapons struct {\n')
        f.write('\tWeapon []string `xml:"weapon,omitempty" json:"weapon,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Vehicle struct (main element)
        f.write('// Vehicle represents a vehicle definition\n')
        f.write('type Vehicle struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('\tAccel string `xml:"accel" json:"accel"`\n')
        f.write('\tArmor string `xml:"armor" json:"armor"`\n')
        f.write('\tAvail string `xml:"avail" json:"avail"`\n')
        f.write('\tBody string `xml:"body" json:"body"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('\tHandling string `xml:"handling" json:"handling"`\n')
        f.write('\tPilot string `xml:"pilot" json:"pilot"`\n')
        f.write('\tSensor string `xml:"sensor" json:"sensor"`\n')
        f.write('\tSpeed string `xml:"speed" json:"speed"`\n')
        f.write('\tBodyModSlots *string `xml:"bodymodslots,omitempty" json:"bodymodslots,omitempty"`\n')
        f.write('\tCyberwares *VehicleCyberwares `xml:"cyberwares,omitempty" json:"cyberwares,omitempty"`\n')
        f.write('\tGears *VehicleGears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tMods *VehicleModItemContainer `xml:"mods,omitempty" json:"mods,omitempty"`\n')
        f.write('\tModSlots *string `xml:"modslots,omitempty" json:"modslots,omitempty"`\n')
        f.write('\tSeats *string `xml:"seats,omitempty" json:"seats,omitempty"`\n')
        f.write('\tWeaponModSlots *string `xml:"weaponmodslots,omitempty" json:"weaponmodslots,omitempty"`\n')
        f.write('\tWeaponMounts *VehicleWeaponMounts `xml:"weaponmounts,omitempty" json:"weaponmounts,omitempty"`\n')
        f.write('\tWeapons *VehicleWeapons `xml:"weapons,omitempty" json:"weapons,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Vehicles struct (container)
        f.write('// Vehicles represents a collection of vehicles\n')
        f.write('type Vehicles struct {\n')
        f.write('\tVehicle []Vehicle `xml:"vehicle,omitempty" json:"vehicle,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate WeaponMountItem struct (standalone weapon mount)
        f.write('// WeaponMountItem represents a standalone weapon mount\n')
        f.write('type WeaponMountItem struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tcommon.SourceReference\n')
        f.write('\tAvail string `xml:"avail" json:"avail"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('\tCreate *string `xml:"create,omitempty" json:"create,omitempty"`\n')
        f.write('\tOptionalDrone *string `xml:"optionaldrone,omitempty" json:"optionaldrone,omitempty"`\n')
        f.write('\tSlots *string `xml:"slots,omitempty" json:"slots,omitempty"`\n')
        f.write('\tForbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('\tWeaponCategories *string `xml:"weaponcategories,omitempty" json:"weaponcategories,omitempty"`\n')
        f.write('\tWeaponCapacity *string `xml:"weaponcapacity,omitempty" json:"weaponcapacity,omitempty"`\n')
        f.write('\tWeaponFilter *string `xml:"weaponfilter,omitempty" json:"weaponfilter,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate WeaponMountItems struct (container)
        f.write('// WeaponMountItems represents a collection of standalone weapon mounts\n')
        f.write('type WeaponMountItems struct {\n')
        f.write('\tWeaponMount []WeaponMountItem `xml:"weaponmount,omitempty" json:"weaponmount,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehiclesChummer struct (root element)
        f.write('// VehiclesChummer represents the root chummer element for vehicles\n')
        f.write('type VehiclesChummer struct {\n')
        f.write('\tCategories []VehicleCategories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tModCategories []ModCategories `xml:"modcategories,omitempty" json:"modcategories,omitempty"`\n')
        f.write('\tWeaponMountCategories []WeaponMountCategories `xml:"weaponmountcategories,omitempty" json:"weaponmountcategories,omitempty"`\n')
        f.write('\tLimits []Limits `xml:"limits,omitempty" json:"limits,omitempty"`\n')
        f.write('\tVehicles *Vehicles `xml:"vehicles,omitempty" json:"vehicles,omitempty"`\n')
        f.write('\tMods *VehicleMods `xml:"mods,omitempty" json:"mods,omitempty"`\n')
        f.write('\tWeaponMounts *WeaponMountItems `xml:"weaponmounts,omitempty" json:"weaponmounts,omitempty"`\n')
        f.write('\tWeaponMountMods *WeaponMountMods `xml:"weaponmountmods,omitempty" json:"weaponmountmods,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated vehicles.go")

if __name__ == '__main__':
    print("Generating vehicles from vehicles.xsd...")
    generate_vehicles()
    print("Done!")

