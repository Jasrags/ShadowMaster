#!/usr/bin/env python3
"""Generate packs.go from packs.xsd"""

import xml.etree.ElementTree as ET
import os

def generate_packs():
    """Generate packs.go from packs.xsd"""
    
    tree = ET.parse('data/chummerxml/packs.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/packs.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('// This file contains pack structures generated from packs.xsd\n\n')
        
        # Generate PackQuality struct (with select attribute)
        f.write('// PackQuality represents a quality in a pack\n')
        f.write('type PackQuality struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackQualities struct
        f.write('// PackQualities represents qualities in a pack\n')
        f.write('type PackQualities struct {\n')
        f.write('\tPositive *PackQualitiesPositive `xml:"positive,omitempty" json:"positive,omitempty"`\n')
        f.write('\tNegative *PackQualitiesNegative `xml:"negative,omitempty" json:"negative,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackQualitiesPositive struct
        f.write('// PackQualitiesPositive represents positive qualities\n')
        f.write('type PackQualitiesPositive struct {\n')
        f.write('\tQuality []PackQuality `xml:"quality" json:"quality"`\n')
        f.write('}\n\n')
        
        # Generate PackQualitiesNegative struct
        f.write('// PackQualitiesNegative represents negative qualities\n')
        f.write('type PackQualitiesNegative struct {\n')
        f.write('\tQuality []PackQuality `xml:"quality" json:"quality"`\n')
        f.write('}\n\n')
        
        # Generate PackAttributes struct
        f.write('// PackAttributes represents attributes in a pack\n')
        f.write('type PackAttributes struct {\n')
        f.write('\tBOD string `xml:"bod" json:"bod"`\n')
        f.write('\tAGI string `xml:"agi" json:"agi"`\n')
        f.write('\tREA string `xml:"rea" json:"rea"`\n')
        f.write('\tSTR string `xml:"str" json:"str"`\n')
        f.write('\tCHA string `xml:"cha" json:"cha"`\n')
        f.write('\tINT string `xml:"int" json:"int"`\n')
        f.write('\tLOG string `xml:"log" json:"log"`\n')
        f.write('\tWIL string `xml:"wil" json:"wil"`\n')
        f.write('\tMAG *string `xml:"mag,omitempty" json:"mag,omitempty"`\n')
        f.write('\tRES *string `xml:"res,omitempty" json:"res,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackSkill struct
        f.write('// PackSkill represents a skill in a pack\n')
        f.write('type PackSkill struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tRating int `xml:"rating" json:"rating"`\n')
        f.write('\tSpec *string `xml:"spec,omitempty" json:"spec,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackSkillGroup struct
        f.write('// PackSkillGroup represents a skill group in a pack\n')
        f.write('type PackSkillGroup struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tRating int `xml:"rating" json:"rating"`\n')
        f.write('}\n\n')
        
        # Generate PackSkills struct
        f.write('// PackSkills represents skills in a pack\n')
        f.write('type PackSkills struct {\n')
        f.write('\tSkill []PackSkill `xml:"skill,omitempty" json:"skill,omitempty"`\n')
        f.write('\tSkillGroup []PackSkillGroup `xml:"skillgroup,omitempty" json:"skillgroup,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackPowerName struct (with select attribute)
        f.write('// PackPowerName represents a power name in a pack\n')
        f.write('type PackPowerName struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackPower struct
        f.write('// PackPower represents a power in a pack\n')
        f.write('type PackPower struct {\n')
        f.write('\tName PackPowerName `xml:"name" json:"name"`\n')
        f.write('\tRating *int `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackPowers struct
        f.write('// PackPowers represents powers in a pack\n')
        f.write('type PackPowers struct {\n')
        f.write('\tPower []PackPower `xml:"power" json:"power"`\n')
        f.write('}\n\n')
        
        # Generate PackProgram struct
        f.write('// PackProgram represents a program in a pack\n')
        f.write('type PackProgram struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tRating int `xml:"rating" json:"rating"`\n')
        f.write('}\n\n')
        
        # Generate PackPrograms struct
        f.write('// PackPrograms represents programs in a pack\n')
        f.write('type PackPrograms struct {\n')
        f.write('\tProgram []PackProgram `xml:"program" json:"program"`\n')
        f.write('}\n\n')
        
        # Generate PackSpell struct (with select attribute)
        f.write('// PackSpell represents a spell in a pack\n')
        f.write('type PackSpell struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackSpells struct
        f.write('// PackSpells represents spells in a pack\n')
        f.write('type PackSpells struct {\n')
        f.write('\tSpell []PackSpell `xml:"spell" json:"spell"`\n')
        f.write('}\n\n')
        
        # Generate PackSpirit struct
        f.write('// PackSpirit represents a spirit in a pack\n')
        f.write('type PackSpirit struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tForce int `xml:"force" json:"force"`\n')
        f.write('\tServices int `xml:"services" json:"services"`\n')
        f.write('}\n\n')
        
        # Generate PackSpirits struct
        f.write('// PackSpirits represents spirits in a pack\n')
        f.write('type PackSpirits struct {\n')
        f.write('\tSpirit []PackSpirit `xml:"spirit" json:"spirit"`\n')
        f.write('}\n\n')
        
        # Generate PackCyberware struct
        f.write('// PackCyberware represents a cyberware item in a pack\n')
        f.write('type PackCyberware struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tRating *int `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('\tGrade string `xml:"grade" json:"grade"`\n')
        f.write('\tCyberwares *PackCyberwares `xml:"cyberwares,omitempty" json:"cyberwares,omitempty"`\n')
        f.write('\tGears *PackGears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackCyberwares struct (recursive)
        f.write('// PackCyberwares represents nested cyberware in a pack\n')
        f.write('type PackCyberwares struct {\n')
        f.write('\tCyberware []PackCyberware `xml:"cyberware" json:"cyberware"`\n')
        f.write('}\n\n')
        
        # Generate PackBioware struct
        f.write('// PackBioware represents a bioware item in a pack\n')
        f.write('type PackBioware struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tRating *int `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('\tGrade string `xml:"grade" json:"grade"`\n')
        f.write('}\n\n')
        
        # Generate PackBiowares struct
        f.write('// PackBiowares represents bioware in a pack\n')
        f.write('type PackBiowares struct {\n')
        f.write('\tBioware []PackBioware `xml:"bioware" json:"bioware"`\n')
        f.write('}\n\n')
        
        # Generate PackArmorMod struct
        f.write('// PackArmorMod represents an armor mod in a pack\n')
        f.write('type PackArmorMod struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tRating *string `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackArmorMods struct
        f.write('// PackArmorMods represents armor mods in a pack\n')
        f.write('type PackArmorMods struct {\n')
        f.write('\tMod []PackArmorMod `xml:"mod" json:"mod"`\n')
        f.write('}\n\n')
        
        # Generate PackArmor struct
        f.write('// PackArmor represents an armor item in a pack\n')
        f.write('type PackArmor struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tGears *PackGears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('\tMods *PackArmorMods `xml:"mods,omitempty" json:"mods,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackArmors struct
        f.write('// PackArmors represents armor in a pack\n')
        f.write('type PackArmors struct {\n')
        f.write('\tArmor []PackArmor `xml:"armor" json:"armor"`\n')
        f.write('}\n\n')
        
        # Generate PackWeaponAccessory struct
        f.write('// PackWeaponAccessory represents a weapon accessory in a pack\n')
        f.write('type PackWeaponAccessory struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tMount *string `xml:"mount,omitempty" json:"mount,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackWeaponAccessories struct
        f.write('// PackWeaponAccessories represents weapon accessories in a pack\n')
        f.write('type PackWeaponAccessories struct {\n')
        f.write('\tAccessory []PackWeaponAccessory `xml:"accessory" json:"accessory"`\n')
        f.write('}\n\n')
        
        # Generate PackWeaponMod struct
        f.write('// PackWeaponMod represents a weapon mod in a pack\n')
        f.write('type PackWeaponMod struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tRating *string `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackWeaponMods struct
        f.write('// PackWeaponMods represents weapon mods in a pack\n')
        f.write('type PackWeaponMods struct {\n')
        f.write('\tMod []PackWeaponMod `xml:"mod" json:"mod"`\n')
        f.write('}\n\n')
        
        # Generate PackWeapon struct
        f.write('// PackWeapon represents a weapon in a pack\n')
        f.write('type PackWeapon struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tAccessories *PackWeaponAccessories `xml:"accessories,omitempty" json:"accessories,omitempty"`\n')
        f.write('\tMods *PackWeaponMods `xml:"mods,omitempty" json:"mods,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackWeapons struct
        f.write('// PackWeapons represents weapons in a pack\n')
        f.write('type PackWeapons struct {\n')
        f.write('\tWeapon []PackWeapon `xml:"weapon" json:"weapon"`\n')
        f.write('}\n\n')
        
        # Generate PackGearName struct (with select attribute)
        f.write('// PackGearName represents a gear name in a pack\n')
        f.write('type PackGearName struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackGear struct (recursive)
        f.write('// PackGear represents a gear item in a pack\n')
        f.write('type PackGear struct {\n')
        f.write('\tName PackGearName `xml:"name" json:"name"`\n')
        f.write('\tCategory *string `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('\tQty *int `xml:"qty,omitempty" json:"qty,omitempty"`\n')
        f.write('\tRating *int `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('\tBonded *string `xml:"bonded,omitempty" json:"bonded,omitempty"`\n')
        f.write('\tGears *PackGears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackGears struct (recursive)
        f.write('// PackGears represents gears in a pack (recursive)\n')
        f.write('type PackGears struct {\n')
        f.write('\tGear []PackGear `xml:"gear" json:"gear"`\n')
        f.write('}\n\n')
        
        # Generate PackVehicleMod struct
        f.write('// PackVehicleMod represents a vehicle mod in a pack\n')
        f.write('type PackVehicleMod struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tRating *string `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackVehicleMods struct
        f.write('// PackVehicleMods represents vehicle mods in a pack\n')
        f.write('type PackVehicleMods struct {\n')
        f.write('\tMod []PackVehicleMod `xml:"mod" json:"mod"`\n')
        f.write('}\n\n')
        
        # Generate PackVehicle struct
        f.write('// PackVehicle represents a vehicle in a pack\n')
        f.write('type PackVehicle struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tMods *PackVehicleMods `xml:"mods,omitempty" json:"mods,omitempty"`\n')
        f.write('\tGears *PackGears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('\tWeapons *PackWeapons `xml:"weapons,omitempty" json:"weapons,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackVehicles struct
        f.write('// PackVehicles represents vehicles in a pack\n')
        f.write('type PackVehicles struct {\n')
        f.write('\tVehicle []PackVehicle `xml:"vehicle" json:"vehicle"`\n')
        f.write('}\n\n')
        
        # Generate PackLifestyleQuality struct
        f.write('// PackLifestyleQuality represents a lifestyle quality in a pack\n')
        f.write('type PackLifestyleQuality struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tRating *string `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackLifestyleQualities struct
        f.write('// PackLifestyleQualities represents lifestyle qualities in a pack\n')
        f.write('type PackLifestyleQualities struct {\n')
        f.write('\tQuality []PackLifestyleQuality `xml:"quality" json:"quality"`\n')
        f.write('}\n\n')
        
        # Generate PackLifestyle struct
        f.write('// PackLifestyle represents a lifestyle in a pack\n')
        f.write('type PackLifestyle struct {\n')
        f.write('\tBaseLifestyle string `xml:"baselifestyle" json:"baselifestyle"`\n')
        f.write('\tMonths int `xml:"months" json:"months"`\n')
        f.write('\tQualities *PackLifestyleQualities `xml:"qualities,omitempty" json:"qualities,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackLifestyles struct
        f.write('// PackLifestyles represents lifestyles in a pack\n')
        f.write('type PackLifestyles struct {\n')
        f.write('\tLifestyle []PackLifestyle `xml:"lifestyle" json:"lifestyle"`\n')
        f.write('}\n\n')
        
        # Generate PackCategory struct
        f.write('// PackCategory represents a category in packs\n')
        f.write('type PackCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PackCategories struct
        f.write('// PackCategories represents categories in packs\n')
        f.write('type PackCategories struct {\n')
        f.write('\tCategory []PackCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Pack struct
        f.write('// Pack represents a pack definition\n')
        f.write('type Pack struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tNuyenBP int `xml:"nuyenbp" json:"nuyenbp"`\n')
        f.write('\tArmors *PackArmors `xml:"armors,omitempty" json:"armors,omitempty"`\n')
        f.write('\tAttributes *PackAttributes `xml:"attributes,omitempty" json:"attributes,omitempty"`\n')
        f.write('\tBiowares *PackBiowares `xml:"biowares,omitempty" json:"biowares,omitempty"`\n')
        f.write('\tCyberwares *PackCyberwares `xml:"cyberwares,omitempty" json:"cyberwares,omitempty"`\n')
        f.write('\tGears *PackGears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('\tLifestyles *PackLifestyles `xml:"lifestyles,omitempty" json:"lifestyles,omitempty"`\n')
        f.write('\tPowers *PackPowers `xml:"powers,omitempty" json:"powers,omitempty"`\n')
        f.write('\tPrograms *PackPrograms `xml:"programs,omitempty" json:"programs,omitempty"`\n')
        f.write('\tQualities *PackQualities `xml:"qualities,omitempty" json:"qualities,omitempty"`\n')
        f.write('\tSelectMartialArt *string `xml:"selectmartialart,omitempty" json:"selectmartialart,omitempty"`\n')
        f.write('\tSkills *PackSkills `xml:"skills,omitempty" json:"skills,omitempty"`\n')
        f.write('\tSpells *PackSpells `xml:"spells,omitempty" json:"spells,omitempty"`\n')
        f.write('\tSpirits *PackSpirits `xml:"spirits,omitempty" json:"spirits,omitempty"`\n')
        f.write('\tVehicles *PackVehicles `xml:"vehicles,omitempty" json:"vehicles,omitempty"`\n')
        f.write('\tWeapons *PackWeapons `xml:"weapons,omitempty" json:"weapons,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Packs struct
        f.write('// Packs represents a collection of packs\n')
        f.write('type Packs struct {\n')
        f.write('\tPack []Pack `xml:"pack,omitempty" json:"pack,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PacksChummer struct (root element)
        f.write('// PacksChummer represents the root chummer element for packs\n')
        f.write('type PacksChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tCategories *PackCategories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tPacks *Packs `xml:"packs,omitempty" json:"packs,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated packs.go")

if __name__ == '__main__':
    print("Generating packs from packs.xsd...")
    generate_packs()
    print("Done!")

