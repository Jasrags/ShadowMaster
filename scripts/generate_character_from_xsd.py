#!/usr/bin/env python3
"""Generate character.go from character.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def to_go_name(name):
    """Convert XML name to Go name"""
    # Handle special cases
    if name == 'gear':
        return 'CharacterGear'
    elif name == 'weapon':
        return 'CharacterWeapon'
    elif name == 'cyberware':
        return 'CharacterCyberware'
    elif name == 'character':
        return 'Character'
    elif name == 'NewDataSet':
        return 'CharacterDataSet'
    
    # Capitalize first letter and handle camelCase
    parts = re.split(r'[-_\s]', name)
    return ''.join(word.capitalize() for word in parts)

def get_go_type(xml_type, optional=False):
    """Convert XML type to Go type"""
    pointer = '*' if optional else ''
    
    if xml_type == 'xs:string':
        return f'{pointer}string'
    elif xml_type == 'xs:integer':
        return f'{pointer}int'
    elif xml_type == 'xs:float' or xml_type == 'xs:double':
        return f'{pointer}float64'
    elif xml_type == 'xs:boolean':
        return f'{pointer}bool'
    else:
        # Complex type - use the type name
        type_name = xml_type.split(':')[-1] if ':' in xml_type else xml_type
        return f'{pointer}{to_go_name(type_name)}'

def generate_character():
    """Generate character.go from character.xsd"""
    
    tree = ET.parse('data/chummerxml/character.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/character.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains character structures generated from character.xsd\n\n')
        
        # Generate CharacterGear struct (recursive reference from character.xsd)
        f.write('// CharacterGear represents gear within a character\n')
        f.write('type CharacterGear struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tCapacity *string `xml:"capacity,omitempty" json:"capacity,omitempty"`\n')
        f.write('\tArmorCapacity *string `xml:"armorcapacity,omitempty" json:"armorcapacity,omitempty"`\n')
        f.write('\tMinRating *int `xml:"minrating,omitempty" json:"minrating,omitempty"`\n')
        f.write('\tMaxRating int `xml:"maxrating" json:"maxrating"`\n')
        f.write('\tRating int `xml:"rating" json:"rating"`\n')
        f.write('\tQty int `xml:"qty" json:"qty"`\n')
        f.write('\tAvail string `xml:"avail" json:"avail"`\n')
        f.write('\tAvail3 *string `xml:"avail3,omitempty" json:"avail3,omitempty"`\n')
        f.write('\tAvail6 *string `xml:"avail6,omitempty" json:"avail6,omitempty"`\n')
        f.write('\tAvail10 *string `xml:"avail10,omitempty" json:"avail10,omitempty"`\n')
        f.write('\tCostFor *int `xml:"costfor,omitempty" json:"costfor,omitempty"`\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('\tCost3 *string `xml:"cost3,omitempty" json:"cost3,omitempty"`\n')
        f.write('\tCost6 *string `xml:"cost6,omitempty" json:"cost6,omitempty"`\n')
        f.write('\tCost10 *string `xml:"cost10,omitempty" json:"cost10,omitempty"`\n')
        f.write('\tExtra string `xml:"extra" json:"extra"`\n')
        f.write('\tBonded string `xml:"bonded" json:"bonded"`\n')
        f.write('\tEquipped string `xml:"equipped" json:"equipped"`\n')
        f.write('\tHomeNode string `xml:"homenode" json:"homenode"`\n')
        f.write('\tWeaponGUID *string `xml:"weaponguid,omitempty" json:"weaponguid,omitempty"`\n')
        f.write('\tBonus common.BaseBonus `xml:"bonus" json:"bonus"`\n')
        f.write('\tWeaponBonus *CharacterGearWeaponBonus `xml:"weaponbonus,omitempty" json:"weaponbonus,omitempty"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tAttack string `xml:"attack" json:"attack"`\n')
        f.write('\tDataProcessing string `xml:"dataprocessing" json:"dataprocessing"`\n')
        f.write('\tFirewall string `xml:"firewall" json:"firewall"`\n')
        f.write('\tProgramLimit string `xml:"programlimit" json:"programlimit"`\n')
        f.write('\tSleaze string `xml:"sleaze" json:"sleaze"`\n')
        f.write('\tGearName string `xml:"gearname" json:"gearname"`\n')
        f.write('\tIncludedInParent string `xml:"includedinparent" json:"includedinparent"`\n')
        f.write('\tMaxSkillRating *int `xml:"maxskillrating,omitempty" json:"maxskillrating,omitempty"`\n')
        f.write('\tChildCostMultiplier *int `xml:"childcostmultiplier,omitempty" json:"childcostmultiplier,omitempty"`\n')
        f.write('\tChildAvailModifier *int `xml:"childavailmodifier,omitempty" json:"childavailmodifier,omitempty"`\n')
        f.write('\tChildren CharacterGearChildren `xml:"children" json:"children"`\n')
        f.write('\tLocation string `xml:"location" json:"location"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('\tDiscountedCost string `xml:"discountedcost" json:"discountedcost"`\n')
        f.write('\tActive *string `xml:"active,omitempty" json:"active,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CharacterGearWeaponBonus struct
        f.write('// CharacterGearWeaponBonus represents weapon bonus for gear\n')
        f.write('type CharacterGearWeaponBonus struct {\n')
        f.write('\tAP *int `xml:"ap,omitempty" json:"ap,omitempty"`\n')
        f.write('\tAPReplace *string `xml:"apreplace,omitempty" json:"apreplace,omitempty"`\n')
        f.write('\tDamage *int `xml:"damage,omitempty" json:"damage,omitempty"`\n')
        f.write('\tDamageReplace *string `xml:"damagereplace,omitempty" json:"damagereplace,omitempty"`\n')
        f.write('\tDamageType *string `xml:"damagetype,omitempty" json:"damagetype,omitempty"`\n')
        f.write('\tPool *string `xml:"pool,omitempty" json:"pool,omitempty"`\n')
        f.write('\tRangeBonus *int `xml:"rangebonus,omitempty" json:"rangebonus,omitempty"`\n')
        f.write('\tRC *string `xml:"rc,omitempty" json:"rc,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CharacterGearChildren struct
        f.write('// CharacterGearChildren represents children gear (recursive)\n')
        f.write('type CharacterGearChildren struct {\n')
        f.write('\tGear []CharacterGear `xml:"gear,omitempty" json:"gear,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CharacterWeapon struct (recursive reference from character.xsd)
        f.write('// CharacterWeapon represents a weapon within a character\n')
        f.write('type CharacterWeapon struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tType string `xml:"type" json:"type"`\n')
        f.write('\tSpec *string `xml:"spec,omitempty" json:"spec,omitempty"`\n')
        f.write('\tSpec2 *string `xml:"spec2,omitempty" json:"spec2,omitempty"`\n')
        f.write('\tReach int `xml:"reach" json:"reach"`\n')
        f.write('\tDamage string `xml:"damage" json:"damage"`\n')
        f.write('\tAP string `xml:"ap" json:"ap"`\n')
        f.write('\tMode string `xml:"mode" json:"mode"`\n')
        f.write('\tRC string `xml:"rc" json:"rc"`\n')
        f.write('\tAmmo string `xml:"ammo" json:"ammo"`\n')
        f.write('\tAmmoCategory string `xml:"ammocategory" json:"ammocategory"`\n')
        f.write('\tRequireAmmo string `xml:"requireammo" json:"requireammo"`\n')
        f.write('\tAmmoRemaining int `xml:"ammoremaining" json:"ammoremaining"`\n')
        f.write('\tAmmoRemaining2 int `xml:"ammoremaining2" json:"ammoremaining2"`\n')
        f.write('\tAmmoRemaining3 int `xml:"ammoremaining3" json:"ammoremaining3"`\n')
        f.write('\tAmmoRemaining4 int `xml:"ammoremaining4" json:"ammoremaining4"`\n')
        f.write('\tAmmoLoaded string `xml:"ammoloaded" json:"ammoloaded"`\n')
        f.write('\tAmmoLoaded2 string `xml:"ammoloaded2" json:"ammoloaded2"`\n')
        f.write('\tAmmoLoaded3 string `xml:"ammoloaded3" json:"ammoloaded3"`\n')
        f.write('\tAmmoLoaded4 string `xml:"ammoloaded4" json:"ammoloaded4"`\n')
        f.write('\tConceal int `xml:"conceal" json:"conceal"`\n')
        f.write('\tAvail string `xml:"avail" json:"avail"`\n')
        f.write('\tCost int `xml:"cost" json:"cost"`\n')
        f.write('\tUseSkill *CharacterWeaponUseSkill `xml:"useskill,omitempty" json:"useskill,omitempty"`\n')
        f.write('\tRange string `xml:"range" json:"range"`\n')
        f.write('\tRangeMultiply string `xml:"rangemultiply" json:"rangemultiply"`\n')
        f.write('\tFullBurst int `xml:"fullburst" json:"fullburst"`\n')
        f.write('\tSuppressive int `xml:"suppressive" json:"suppressive"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tWeaponName string `xml:"weaponname" json:"weaponname"`\n')
        f.write('\tIncluded string `xml:"included" json:"included"`\n')
        f.write('\tInstalled string `xml:"installed" json:"installed"`\n')
        f.write('\tAccessories *CharacterWeaponAccessories `xml:"accessories,omitempty" json:"accessories,omitempty"`\n')
        f.write('\tWeaponMods *CharacterWeaponMods `xml:"weaponmods,omitempty" json:"weaponmods,omitempty"`\n')
        f.write('\tUnderbarrel []CharacterWeaponUnderbarrel `xml:"underbarrel,omitempty" json:"underbarrel,omitempty"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('\tDiscountedCost string `xml:"discountedcost" json:"discountedcost"`\n')
        f.write('}\n\n')
        
        # Generate CharacterWeaponUseSkill struct
        f.write('// CharacterWeaponUseSkill represents use skill for weapon\n')
        f.write('type CharacterWeaponUseSkill struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CharacterWeaponAccessory struct
        f.write('// CharacterWeaponAccessory represents a weapon accessory\n')
        f.write('type CharacterWeaponAccessory struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tMount string `xml:"mount" json:"mount"`\n')
        f.write('\tRC string `xml:"rc" json:"rc"`\n')
        f.write('\tRCGroup *int `xml:"rcgroup,omitempty" json:"rcgroup,omitempty"`\n')
        f.write('\tDVBonus *int `xml:"dvbonus,omitempty" json:"dvbonus,omitempty"`\n')
        f.write('\tAPBonus *int `xml:"apbonus,omitempty" json:"apbonus,omitempty"`\n')
        f.write('\tConceal int `xml:"conceal" json:"conceal"`\n')
        f.write('\tDicePool *int `xml:"dicepool,omitempty" json:"dicepool,omitempty"`\n')
        f.write('\tAvail string `xml:"avail" json:"avail"`\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('\tIncluded string `xml:"included" json:"included"`\n')
        f.write('\tInstalled string `xml:"installed" json:"installed"`\n')
        f.write('\tAllowGear *CharacterWeaponAccessoryAllowGear `xml:"allowgear,omitempty" json:"allowgear,omitempty"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tGears *CharacterWeaponAccessoryGears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('\tLocation string `xml:"location" json:"location"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('\tDiscountedCost string `xml:"discountedcost" json:"discountedcost"`\n')
        f.write('}\n\n')
        
        # Generate CharacterWeaponAccessoryAllowGear struct
        f.write('// CharacterWeaponAccessoryAllowGear represents allowed gear for weapon accessory\n')
        f.write('type CharacterWeaponAccessoryAllowGear struct {\n')
        f.write('\tGearCategory []string `xml:"gearcategory" json:"gearcategory"`\n')
        f.write('}\n\n')
        
        # Generate CharacterWeaponAccessoryGears struct
        f.write('// CharacterWeaponAccessoryGears represents gears for weapon accessory\n')
        f.write('type CharacterWeaponAccessoryGears struct {\n')
        f.write('\tGear []CharacterGear `xml:"gear,omitempty" json:"gear,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CharacterWeaponAccessories struct
        f.write('// CharacterWeaponAccessories represents weapon accessories\n')
        f.write('type CharacterWeaponAccessories struct {\n')
        f.write('\tAccessory []CharacterWeaponAccessory `xml:"accessory" json:"accessory"`\n')
        f.write('}\n\n')
        
        # Generate CharacterWeaponMod struct
        f.write('// CharacterWeaponMod represents a weapon mod\n')
        f.write('type CharacterWeaponMod struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tSlots int `xml:"slots" json:"slots"`\n')
        f.write('\tAvail string `xml:"avail" json:"avail"`\n')
        f.write('\tRC string `xml:"rc" json:"rc"`\n')
        f.write('\tRCGroup *int `xml:"rcgroup,omitempty" json:"rcgroup,omitempty"`\n')
        f.write('\tDVBonus *int `xml:"dvbonus,omitempty" json:"dvbonus,omitempty"`\n')
        f.write('\tAPBonus *int `xml:"apbonus,omitempty" json:"apbonus,omitempty"`\n')
        f.write('\tConceal int `xml:"conceal" json:"conceal"`\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('\tIncluded string `xml:"included" json:"included"`\n')
        f.write('\tInstalled string `xml:"installed" json:"installed"`\n')
        f.write('\tRating int `xml:"rating" json:"rating"`\n')
        f.write('\tAmmoBonus *int `xml:"ammobonus,omitempty" json:"ammobonus,omitempty"`\n')
        f.write('\tAmmoReplace *string `xml:"ammoreplace,omitempty" json:"ammoreplace,omitempty"`\n')
        f.write('\tAccessoryCostMultiplier *int `xml:"accessorycostmultiplier,omitempty" json:"accessorycostmultiplier,omitempty"`\n')
        f.write('\tModCostMultiplier *int `xml:"modcostmultiplier,omitempty" json:"modcostmultiplier,omitempty"`\n')
        f.write('\tAddMode *string `xml:"addmode,omitempty" json:"addmode,omitempty"`\n')
        f.write('\tFullBurst *int `xml:"fullburst,omitempty" json:"fullburst,omitempty"`\n')
        f.write('\tSuppressive *int `xml:"suppressive,omitempty" json:"suppressive,omitempty"`\n')
        f.write('\tRangeBonus *int `xml:"rangebonus,omitempty" json:"rangebonus,omitempty"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('\tDiscountedCost string `xml:"discountedcost" json:"discountedcost"`\n')
        f.write('}\n\n')
        
        # Generate CharacterWeaponMods struct
        f.write('// CharacterWeaponMods represents weapon mods\n')
        f.write('type CharacterWeaponMods struct {\n')
        f.write('\tWeaponMod []CharacterWeaponMod `xml:"weaponmod" json:"weaponmod"`\n')
        f.write('}\n\n')
        
        # Generate CharacterWeaponUnderbarrel struct
        f.write('// CharacterWeaponUnderbarrel represents an underbarrel weapon\n')
        f.write('type CharacterWeaponUnderbarrel struct {\n')
        f.write('\tWeapon CharacterWeapon `xml:"weapon" json:"weapon"`\n')
        f.write('}\n\n')
        
        # Generate CharacterCyberware struct (recursive reference from character.xsd)
        f.write('// CharacterCyberware represents cyberware within a character\n')
        f.write('type CharacterCyberware struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tLimbSlot string `xml:"limbslot" json:"limbslot"`\n')
        f.write('\tEss string `xml:"ess" json:"ess"`\n')
        f.write('\tCapacity string `xml:"capacity" json:"capacity"`\n')
        f.write('\tAvail string `xml:"avail" json:"avail"`\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tRating int `xml:"rating" json:"rating"`\n')
        f.write('\tMinRating int `xml:"minrating" json:"minrating"`\n')
        f.write('\tMaxRating int `xml:"maxrating" json:"maxrating"`\n')
        f.write('\tSubsystems string `xml:"subsystems" json:"subsystems"`\n')
        f.write('\tGrade string `xml:"grade" json:"grade"`\n')
        f.write('\tLocation string `xml:"location" json:"location"`\n')
        f.write('\tSuite string `xml:"suite" json:"suite"`\n')
        f.write('\tEssDiscount string `xml:"essdiscount" json:"essdiscount"`\n')
        f.write('\tForceGrade CharacterCyberwareForceGrade `xml:"forcegrade" json:"forcegrade"`\n')
        f.write('\tBonus common.BaseBonus `xml:"bonus" json:"bonus"`\n')
        f.write('\tAllowGear *CharacterCyberwareAllowGear `xml:"allowgear,omitempty" json:"allowgear,omitempty"`\n')
        f.write('\tImprovementSource string `xml:"improvementsource" json:"improvementsource"`\n')
        f.write('\tWeaponGUID *string `xml:"weaponguid,omitempty" json:"weaponguid,omitempty"`\n')
        f.write('\tChildren CharacterCyberwareChildren `xml:"children" json:"children"`\n')
        f.write('\tGears *CharacterCyberwareGears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('\tDiscountedCost string `xml:"discountedcost" json:"discountedcost"`\n')
        f.write('}\n\n')
        
        # Generate CharacterCyberwareForceGrade struct
        f.write('// CharacterCyberwareForceGrade represents force grade\n')
        f.write('type CharacterCyberwareForceGrade struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CharacterCyberwareAllowGear struct
        f.write('// CharacterCyberwareAllowGear represents allowed gear for cyberware\n')
        f.write('type CharacterCyberwareAllowGear struct {\n')
        f.write('\tGearCategory []string `xml:"gearcategory" json:"gearcategory"`\n')
        f.write('}\n\n')
        
        # Generate CharacterCyberwareChildren struct
        f.write('// CharacterCyberwareChildren represents children cyberware (recursive)\n')
        f.write('type CharacterCyberwareChildren struct {\n')
        f.write('\tCyberware []CharacterCyberware `xml:"cyberware,omitempty" json:"cyberware,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CharacterCyberwareGears struct
        f.write('// CharacterCyberwareGears represents gears for cyberware\n')
        f.write('type CharacterCyberwareGears struct {\n')
        f.write('\tGear []CharacterGear `xml:"gear,omitempty" json:"gear,omitempty"`\n')
        f.write('}\n\n')
        
        # Continue with main Character struct and all nested types...
        # This is a very large file, so I'll generate the most important structures
        # and continue in the next part
        
        print("Generated character.go (partial - continuing...)")
    
    # Continue generating the rest of the file
    with open('pkg/shadowrun/edition/v5/character.go', 'a', encoding='utf-8') as f:
        # Generate Attribute struct
        f.write('// Attribute represents a character attribute\n')
        f.write('type Attribute struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tMetatypeMin int `xml:"metatypemin" json:"metatypemin"`\n')
        f.write('\tMetatypeMax int `xml:"metatypemax" json:"metatypemax"`\n')
        f.write('\tMetatypeAugMax int `xml:"metatypeaugmax" json:"metatypeaugmax"`\n')
        f.write('\tValue int `xml:"value" json:"value"`\n')
        f.write('\tAugModifier int `xml:"augmodifier" json:"augmodifier"`\n')
        f.write('\tTotalValue int `xml:"totalvalue" json:"totalvalue"`\n')
        f.write('}\n\n')
        
        # Generate Attributes struct
        f.write('// Attributes represents character attributes\n')
        f.write('type Attributes struct {\n')
        f.write('\tAttribute []Attribute `xml:"attribute" json:"attribute"`\n')
        f.write('}\n\n')
        
        # Generate SkillGroup struct
        f.write('// SkillGroup represents a skill group\n')
        f.write('type SkillGroup struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tRating int `xml:"rating" json:"rating"`\n')
        f.write('\tRatingMax int `xml:"ratingmax" json:"ratingmax"`\n')
        f.write('\tBroken string `xml:"broken" json:"broken"`\n')
        f.write('}\n\n')
        
        # Generate SkillGroups struct
        f.write('// SkillGroups represents skill groups\n')
        f.write('type SkillGroups struct {\n')
        f.write('\tSkillGroup []SkillGroup `xml:"skillgroup,omitempty" json:"skillgroup,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CharacterSkill struct
        f.write('// CharacterSkill represents a character skill\n')
        f.write('type CharacterSkill struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tSkillGroup string `xml:"skillgroup" json:"skillgroup"`\n')
        f.write('\tSkillCategory string `xml:"skillcategory" json:"skillcategory"`\n')
        f.write('\tGrouped string `xml:"grouped" json:"grouped"`\n')
        f.write('\tDefault string `xml:"default" json:"default"`\n')
        f.write('\tRating int `xml:"rating" json:"rating"`\n')
        f.write('\tRatingMax int `xml:"ratingmax" json:"ratingmax"`\n')
        f.write('\tKnowledge string `xml:"knowledge" json:"knowledge"`\n')
        f.write('\tExotic string `xml:"exotic" json:"exotic"`\n')
        f.write('\tSpec string `xml:"spec" json:"spec"`\n')
        f.write('\tAllowDelete string `xml:"allowdelete" json:"allowdelete"`\n')
        f.write('\tAttribute string `xml:"attribute" json:"attribute"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tTotalValue int `xml:"totalvalue" json:"totalvalue"`\n')
        f.write('}\n\n')
        
        # Generate Skills struct
        f.write('// Skills represents character skills\n')
        f.write('type Skills struct {\n')
        f.write('\tSkill []CharacterSkill `xml:"skill,omitempty" json:"skill,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Contact struct
        f.write('// Contact represents a character contact\n')
        f.write('type Contact struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tConnection int `xml:"connection" json:"connection"`\n')
        f.write('\tLoyalty int `xml:"loyalty" json:"loyalty"`\n')
        f.write('\tMembership int `xml:"membership" json:"membership"`\n')
        f.write('\tAreaOfInfluence int `xml:"areaofinfluence" json:"areaofinfluence"`\n')
        f.write('\tMagicalResources int `xml:"magicalresources" json:"magicalresources"`\n')
        f.write('\tMatrixResources int `xml:"matrixresources" json:"matrixresources"`\n')
        f.write('\tType string `xml:"type" json:"type"`\n')
        f.write('\tFile string `xml:"file" json:"file"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('\tGroupName string `xml:"groupname" json:"groupname"`\n')
        f.write('\tColour string `xml:"colour" json:"colour"`\n')
        f.write('\tFree string `xml:"free" json:"free"`\n')
        f.write('}\n\n')
        
        # Generate Contacts struct
        f.write('// Contacts represents character contacts\n')
        f.write('type Contacts struct {\n')
        f.write('\tContact []Contact `xml:"contact,omitempty" json:"contact,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CharacterSpell struct
        f.write('// CharacterSpell represents a character spell\n')
        f.write('type CharacterSpell struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tDescriptors string `xml:"descriptors" json:"descriptors"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tType string `xml:"type" json:"type"`\n')
        f.write('\tRange string `xml:"range" json:"range"`\n')
        f.write('\tDamage string `xml:"damage" json:"damage"`\n')
        f.write('\tDuration string `xml:"duration" json:"duration"`\n')
        f.write('\tDV string `xml:"dv" json:"dv"`\n')
        f.write('\tLimited string `xml:"limited" json:"limited"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tExtra string `xml:"extra" json:"extra"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('}\n\n')
        
        # Generate Spells struct
        f.write('// Spells represents character spells\n')
        f.write('type Spells struct {\n')
        f.write('\tSpell []CharacterSpell `xml:"spell,omitempty" json:"spell,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Focus struct
        f.write('// Focus represents a focus\n')
        f.write('type Focus struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tGearID string `xml:"gearid" json:"gearid"`\n')
        f.write('\tRating int `xml:"rating" json:"rating"`\n')
        f.write('}\n\n')
        
        # Generate Foci struct
        f.write('// Foci represents character foci\n')
        f.write('type Foci struct {\n')
        f.write('\tFocus []Focus `xml:"focus,omitempty" json:"focus,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate StackedFocus struct
        f.write('// StackedFocus represents a stacked focus\n')
        f.write('type StackedFocus struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tGearID string `xml:"gearid" json:"gearid"`\n')
        f.write('\tBonded string `xml:"bonded" json:"bonded"`\n')
        f.write('\tGears CharacterStackedFocusGears `xml:"gears" json:"gears"`\n')
        f.write('}\n\n')
        
        # Generate CharacterStackedFocusGears struct
        f.write('// CharacterStackedFocusGears represents gears for stacked focus\n')
        f.write('type CharacterStackedFocusGears struct {\n')
        f.write('\tGear []CharacterGear `xml:"gear" json:"gear"`\n')
        f.write('}\n\n')
        
        # Generate StackedFoci struct
        f.write('// StackedFoci represents stacked foci\n')
        f.write('type StackedFoci struct {\n')
        f.write('\tStackedFocus []StackedFocus `xml:"stackedfocus,omitempty" json:"stackedfocus,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CharacterPower struct
        f.write('// CharacterPower represents an adept power\n')
        f.write('type CharacterPower struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tExtra string `xml:"extra" json:"extra"`\n')
        f.write('\tPointsPerLevel string `xml:"pointsperlevel" json:"pointsperlevel"`\n')
        f.write('\tRating int `xml:"rating" json:"rating"`\n')
        f.write('\tLevels string `xml:"levels" json:"levels"`\n')
        f.write('\tMaxLevels int `xml:"maxlevels" json:"maxlevels"`\n')
        f.write('\tDiscounted string `xml:"discounted" json:"discounted"`\n')
        f.write('\tDiscountedGear string `xml:"discountedgeas" json:"discountedgeas"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tDoubleCost string `xml:"doublecost" json:"doublecost"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('}\n\n')
        
        # Generate Powers struct
        f.write('// Powers represents character powers\n')
        f.write('type Powers struct {\n')
        f.write('\tPower []CharacterPower `xml:"power,omitempty" json:"power,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Spirit struct
        f.write('// Spirit represents a spirit or sprite\n')
        f.write('type Spirit struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCritterName string `xml:"crittername" json:"crittername"`\n')
        f.write('\tServices int `xml:"services" json:"services"`\n')
        f.write('\tForce int `xml:"force" json:"force"`\n')
        f.write('\tBound string `xml:"bound" json:"bound"`\n')
        f.write('\tType string `xml:"type" json:"type"`\n')
        f.write('\tFile string `xml:"file" json:"file"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('}\n\n')
        
        # Generate Spirits struct
        f.write('// Spirits represents character spirits\n')
        f.write('type Spirits struct {\n')
        f.write('\tSpirit []Spirit `xml:"spirit,omitempty" json:"spirit,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate TechProgram struct
        f.write('// TechProgram represents a technomancer program/complex form\n')
        f.write('type TechProgram struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tRating int `xml:"rating" json:"rating"`\n')
        f.write('\tMaxRating int `xml:"maxrating" json:"maxrating"`\n')
        f.write('\tCapacity string `xml:"capacity" json:"capacity"`\n')
        f.write('\tExtra string `xml:"extra" json:"extra"`\n')
        f.write('\tSkill string `xml:"skill" json:"skill"`\n')
        f.write('\tTags *TechProgramTags `xml:"tags,omitempty" json:"tags,omitempty"`\n')
        f.write('\tProgramOptions *TechProgramOptions `xml:"programoptions,omitempty" json:"programoptions,omitempty"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('}\n\n')
        
        # Generate TechProgramTags struct
        f.write('// TechProgramTags represents tags for tech program\n')
        f.write('type TechProgramTags struct {\n')
        f.write('\tTag []string `xml:"tag" json:"tag"`\n')
        f.write('}\n\n')
        
        # Generate TechProgramOption struct
        f.write('// TechProgramOption represents a program option\n')
        f.write('type TechProgramOption struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tRating int `xml:"rating" json:"rating"`\n')
        f.write('\tMaxRating int `xml:"maxrating" json:"maxrating"`\n')
        f.write('\tExtra string `xml:"extra" json:"extra"`\n')
        f.write('\tTags *TechProgramTags `xml:"tags,omitempty" json:"tags,omitempty"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('}\n\n')
        
        # Generate TechProgramOptions struct
        f.write('// TechProgramOptions represents program options\n')
        f.write('type TechProgramOptions struct {\n')
        f.write('\tProgramOption []TechProgramOption `xml:"programoption" json:"programoption"`\n')
        f.write('}\n\n')
        
        # Generate TechPrograms struct
        f.write('// TechPrograms represents character tech programs\n')
        f.write('type TechPrograms struct {\n')
        f.write('\tTechProgram []TechProgram `xml:"techprogram,omitempty" json:"techprogram,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate MartialArtTechnique struct
        f.write('// MartialArtTechnique represents a martial art technique\n')
        f.write('type MartialArtTechnique struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('}\n\n')
        
        # Generate MartialArtTechniques struct
        f.write('// MartialArtTechniques represents martial art techniques\n')
        f.write('type MartialArtTechniques struct {\n')
        f.write('\tMartialArtTechnique []MartialArtTechnique `xml:"martialarttechnique,omitempty" json:"martialarttechnique,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate MartialArt struct
        f.write('// MartialArt represents a martial art\n')
        f.write('type MartialArt struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tRating int `xml:"rating" json:"rating"`\n')
        f.write('\tMartialArtTechniques MartialArtTechniques `xml:"martialarttechniques" json:"martialarttechniques"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('}\n\n')
        
        # Generate MartialArts struct
        f.write('// MartialArts represents character martial arts\n')
        f.write('type MartialArts struct {\n')
        f.write('\tMartialArt []MartialArt `xml:"martialart,omitempty" json:"martialart,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ArmorMod struct
        f.write('// ArmorMod represents an armor mod\n')
        f.write('type ArmorMod struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tB string `xml:"b" json:"b"`\n')
        f.write('\tI string `xml:"i" json:"i"`\n')
        f.write('\tArmorCapacity string `xml:"armorcapacity" json:"armorcapacity"`\n')
        f.write('\tMaxRating int `xml:"maxrating" json:"maxrating"`\n')
        f.write('\tRating int `xml:"rating" json:"rating"`\n')
        f.write('\tAvail string `xml:"avail" json:"avail"`\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('\tBonus common.BaseBonus `xml:"bonus" json:"bonus"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tEquipped string `xml:"equipped" json:"equipped"`\n')
        f.write('\tExtra string `xml:"extra" json:"extra"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('\tDiscountedCost string `xml:"discountedcost" json:"discountedcost"`\n')
        f.write('}\n\n')
        
        # Generate ArmorMods struct
        f.write('// ArmorMods represents armor mods\n')
        f.write('type ArmorMods struct {\n')
        f.write('\tArmorMod []ArmorMod `xml:"armormod,omitempty" json:"armormod,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CharacterArmor struct
        f.write('// CharacterArmor represents character armor\n')
        f.write('type CharacterArmor struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tB string `xml:"b" json:"b"`\n')
        f.write('\tI string `xml:"i" json:"i"`\n')
        f.write('\tArmorCapacity string `xml:"armorcapacity" json:"armorcapacity"`\n')
        f.write('\tAvail string `xml:"avail" json:"avail"`\n')
        f.write('\tCost int `xml:"cost" json:"cost"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tArmorName string `xml:"armorname" json:"armorname"`\n')
        f.write('\tEquipped string `xml:"equipped" json:"equipped"`\n')
        f.write('\tExtra string `xml:"extra" json:"extra"`\n')
        f.write('\tBDamage int `xml:"bdamage" json:"bdamage"`\n')
        f.write('\tIDamage int `xml:"idamage" json:"idamage"`\n')
        f.write('\tArmorMods ArmorMods `xml:"armormods" json:"armormods"`\n')
        f.write('\tGears *CharacterArmorGears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tLocation string `xml:"location" json:"location"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('\tDiscountedCost string `xml:"discountedcost" json:"discountedcost"`\n')
        f.write('}\n\n')
        
        # Generate CharacterArmorGears struct
        f.write('// CharacterArmorGears represents gears for armor\n')
        f.write('type CharacterArmorGears struct {\n')
        f.write('\tGear []CharacterGear `xml:"gear" json:"gear"`\n')
        f.write('}\n\n')
        
        # Generate Armors struct
        f.write('// Armors represents character armor\n')
        f.write('type Armors struct {\n')
        f.write('\tArmor []CharacterArmor `xml:"armor,omitempty" json:"armor,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Weapons struct
        f.write('// Weapons represents character weapons\n')
        f.write('type Weapons struct {\n')
        f.write('\tWeapon []CharacterWeapon `xml:"weapon,omitempty" json:"weapon,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Cyberwares struct
        f.write('// Cyberwares represents character cyberware\n')
        f.write('type Cyberwares struct {\n')
        f.write('\tCyberware []CharacterCyberware `xml:"cyberware,omitempty" json:"cyberware,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CharacterQuality struct
        f.write('// CharacterQuality represents a character quality\n')
        f.write('type CharacterQuality struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tExtra string `xml:"extra" json:"extra"`\n')
        f.write('\tBP int `xml:"bp" json:"bp"`\n')
        f.write('\tContributeToLimit string `xml:"contributetolimit" json:"contributetolimit"`\n')
        f.write('\tPrint string `xml:"print" json:"print"`\n')
        f.write('\tQualityType string `xml:"qualitytype" json:"qualitytype"`\n')
        f.write('\tQualitySource string `xml:"qualitysource" json:"qualitysource"`\n')
        f.write('\tMutant *string `xml:"mutant,omitempty" json:"mutant,omitempty"`\n')
        f.write('\tFree string `xml:"free" json:"free"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tBonus common.BaseBonus `xml:"bonus" json:"bonus"`\n')
        f.write('\tWeaponGUID *string `xml:"weaponguid,omitempty" json:"weaponguid,omitempty"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('}\n\n')
        
        # Generate Qualities struct
        f.write('// Qualities represents character qualities\n')
        f.write('type Qualities struct {\n')
        f.write('\tQuality []CharacterQuality `xml:"quality,omitempty" json:"quality,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate LifestyleQualities struct
        f.write('// LifestyleQualities represents lifestyle qualities\n')
        f.write('type LifestyleQualities struct {\n')
        f.write('\tQuality []string `xml:"quality,omitempty" json:"quality,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Lifestyle struct
        f.write('// Lifestyle represents a lifestyle\n')
        f.write('type Lifestyle struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCost int `xml:"cost" json:"cost"`\n')
        f.write('\tDice int `xml:"dice" json:"dice"`\n')
        f.write('\tMultiplier int `xml:"multiplier" json:"multiplier"`\n')
        f.write('\tMonths int `xml:"months" json:"months"`\n')
        f.write('\tRoommates int `xml:"roommates" json:"roommates"`\n')
        f.write('\tPercentage int `xml:"percentage" json:"percentage"`\n')
        f.write('\tLifestyleName string `xml:"lifestylename" json:"lifestylename"`\n')
        f.write('\tPurchased string `xml:"purchased" json:"purchased"`\n')
        f.write('\tComforts string `xml:"comforts" json:"comforts"`\n')
        f.write('\tEntertainment string `xml:"entertainment" json:"entertainment"`\n')
        f.write('\tNecessities string `xml:"necessities" json:"necessities"`\n')
        f.write('\tNeighborhood string `xml:"neighborhood" json:"neighborhood"`\n')
        f.write('\tSecurity string `xml:"security" json:"security"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tType string `xml:"type" json:"type"`\n')
        f.write('\tQualities LifestyleQualities `xml:"qualities" json:"qualities"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('}\n\n')
        
        # Generate Lifestyles struct
        f.write('// Lifestyles represents character lifestyles\n')
        f.write('type Lifestyles struct {\n')
        f.write('\tLifestyle *Lifestyle `xml:"lifestyle,omitempty" json:"lifestyle,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Gears struct
        f.write('// Gears represents character gear\n')
        f.write('type Gears struct {\n')
        f.write('\tGear []CharacterGear `xml:"gear,omitempty" json:"gear,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleModBonus struct
        f.write('// VehicleModBonus represents vehicle mod bonus\n')
        f.write('type VehicleModBonus struct {\n')
        f.write('\tAccel *string `xml:"accel,omitempty" json:"accel,omitempty"`\n')
        f.write('\tArmor *string `xml:"armor,omitempty" json:"armor,omitempty"`\n')
        f.write('\tBody *string `xml:"body,omitempty" json:"body,omitempty"`\n')
        f.write('\tHandling *string `xml:"handling,omitempty" json:"handling,omitempty"`\n')
        f.write('\tSpeed *string `xml:"speed,omitempty" json:"speed,omitempty"`\n')
        f.write('\tImproveSensor *string `xml:"improvesensor,omitempty" json:"improvesensor,omitempty"`\n')
        f.write('\tSelectText *string `xml:"selecttext,omitempty" json:"selecttext,omitempty"`\n')
        f.write('\tDeviceRating *string `xml:"devicerating,omitempty" json:"devicerating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleModWeapons struct
        f.write('// VehicleModWeapons represents weapons for vehicle mod\n')
        f.write('type VehicleModWeapons struct {\n')
        f.write('\tWeapon []CharacterWeapon `xml:"weapon,omitempty" json:"weapon,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleMod struct
        f.write('// VehicleMod represents a vehicle mod\n')
        f.write('type VehicleMod struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tLimit string `xml:"limit" json:"limit"`\n')
        f.write('\tSlots string `xml:"slots" json:"slots"`\n')
        f.write('\tRating int `xml:"rating" json:"rating"`\n')
        f.write('\tMaxRating string `xml:"maxrating" json:"maxrating"`\n')
        f.write('\tAvail string `xml:"avail" json:"avail"`\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('\tExtra string `xml:"extra" json:"extra"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tIncluded string `xml:"included" json:"included"`\n')
        f.write('\tInstalled string `xml:"installed" json:"installed"`\n')
        f.write('\tSubsystems string `xml:"subsystems" json:"subsystems"`\n')
        f.write('\tWeapons VehicleModWeapons `xml:"weapons" json:"weapons"`\n')
        f.write('\tBonus *VehicleModBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('\tDiscountedCost string `xml:"discountedcost" json:"discountedcost"`\n')
        f.write('}\n\n')
        
        # Generate VehicleMods struct
        f.write('// VehicleMods represents vehicle mods\n')
        f.write('type VehicleMods struct {\n')
        f.write('\tMod []VehicleMod `xml:"mod,omitempty" json:"mod,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleGears struct
        f.write('// VehicleGears represents gears for vehicle\n')
        f.write('type VehicleGears struct {\n')
        f.write('\tGear []CharacterGear `xml:"gear,omitempty" json:"gear,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleWeapons struct
        f.write('// VehicleWeapons represents weapons for vehicle\n')
        f.write('type VehicleWeapons struct {\n')
        f.write('\tWeapon []CharacterWeapon `xml:"weapon,omitempty" json:"weapon,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VehicleLocations struct
        f.write('// VehicleLocations represents vehicle locations\n')
        f.write('type VehicleLocations struct {\n')
        f.write('\tLocation []string `xml:"location,omitempty" json:"location,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Vehicle struct
        f.write('// Vehicle represents a vehicle\n')
        f.write('type Vehicle struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tHandling int `xml:"handling" json:"handling"`\n')
        f.write('\tAccel string `xml:"accel" json:"accel"`\n')
        f.write('\tSpeed int `xml:"speed" json:"speed"`\n')
        f.write('\tPilot int `xml:"pilot" json:"pilot"`\n')
        f.write('\tBody int `xml:"body" json:"body"`\n')
        f.write('\tArmor int `xml:"armor" json:"armor"`\n')
        f.write('\tSensor int `xml:"sensor" json:"sensor"`\n')
        f.write('\tDeviceRating int `xml:"devicerating" json:"devicerating"`\n')
        f.write('\tAvail string `xml:"avail" json:"avail"`\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('\tAddSlots int `xml:"addslots" json:"addslots"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tPhysicalCMFilled int `xml:"physicalcmfilled" json:"physicalcmfilled"`\n')
        f.write('\tVehicleName string `xml:"vehiclename" json:"vehiclename"`\n')
        f.write('\tHomeNode string `xml:"homenode" json:"homenode"`\n')
        f.write('\tMods VehicleMods `xml:"mods" json:"mods"`\n')
        f.write('\tGears VehicleGears `xml:"gears" json:"gears"`\n')
        f.write('\tWeapons VehicleWeapons `xml:"weapons" json:"weapons"`\n')
        f.write('\tLocations *VehicleLocations `xml:"locations,omitempty" json:"locations,omitempty"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('\tDiscountedCost string `xml:"discountedcost" json:"discountedcost"`\n')
        f.write('}\n\n')
        
        # Generate Vehicles struct
        f.write('// Vehicles represents character vehicles\n')
        f.write('type Vehicles struct {\n')
        f.write('\tVehicle []Vehicle `xml:"vehicle,omitempty" json:"vehicle,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Metamagic struct
        f.write('// Metamagic represents a metamagic or echo\n')
        f.write('type Metamagic struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPaidWithKarma string `xml:"paidwithkarma" json:"paidwithkarma"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tBonus common.BaseBonus `xml:"bonus" json:"bonus"`\n')
        f.write('\tImprovementSource string `xml:"improvementsource" json:"improvementsource"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('}\n\n')
        
        # Generate Metamagics struct
        f.write('// Metamagics represents character metamagics\n')
        f.write('type Metamagics struct {\n')
        f.write('\tMetamagic []Metamagic `xml:"metamagic,omitempty" json:"metamagic,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterPower struct
        f.write('// CritterPower represents a critter power\n')
        f.write('type CritterPower struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tExtra string `xml:"extra" json:"extra"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tType string `xml:"type" json:"type"`\n')
        f.write('\tAction string `xml:"action" json:"action"`\n')
        f.write('\tRange string `xml:"range" json:"range"`\n')
        f.write('\tDuration string `xml:"duration" json:"duration"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('\tPoints string `xml:"points" json:"points"`\n')
        f.write('\tCountTowardsLimit string `xml:"counttowardslimit" json:"counttowardslimit"`\n')
        f.write('\tBonus common.BaseBonus `xml:"bonus" json:"bonus"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('}\n\n')
        
        # Generate CritterPowers struct
        f.write('// CritterPowers represents character critter powers\n')
        f.write('type CritterPowers struct {\n')
        f.write('\tCritterPower []CritterPower `xml:"critterpower,omitempty" json:"critterpower,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate InitiationGrade struct
        f.write('// InitiationGrade represents an initiation or submersion grade\n')
        f.write('type InitiationGrade struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tRes string `xml:"res" json:"res"`\n')
        f.write('\tGrade string `xml:"grade" json:"grade"`\n')
        f.write('\tGroup string `xml:"group" json:"group"`\n')
        f.write('\tOrdeal string `xml:"ordeal" json:"ordeal"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('}\n\n')
        
        # Generate InitiationGrades struct
        f.write('// InitiationGrades represents initiation grades\n')
        f.write('type InitiationGrades struct {\n')
        f.write('\tInitiationGrade []InitiationGrade `xml:"initiationgrade,omitempty" json:"initiationgrade,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Improvement struct
        f.write('// Improvement represents an improvement\n')
        f.write('type Improvement struct {\n')
        f.write('\tUnique *string `xml:"unique,omitempty" json:"unique,omitempty"`\n')
        f.write('\tImprovedName string `xml:"improvedname" json:"improvedname"`\n')
        f.write('\tSourceName string `xml:"sourcename" json:"sourcename"`\n')
        f.write('\tMin int `xml:"min" json:"min"`\n')
        f.write('\tMax int `xml:"max" json:"max"`\n')
        f.write('\tAug int `xml:"aug" json:"aug"`\n')
        f.write('\tAugMax int `xml:"augmax" json:"augmax"`\n')
        f.write('\tVal int `xml:"val" json:"val"`\n')
        f.write('\tRating int `xml:"rating" json:"rating"`\n')
        f.write('\tExclude string `xml:"exclude" json:"exclude"`\n')
        f.write('\tImprovementType string `xml:"improvementttype" json:"improvementttype"`\n')
        f.write('\tImprovementSource string `xml:"improvementsource" json:"improvementsource"`\n')
        f.write('\tCustom string `xml:"custom" json:"custom"`\n')
        f.write('\tCustomName string `xml:"customname" json:"customname"`\n')
        f.write('\tCustomID string `xml:"customid" json:"customid"`\n')
        f.write('\tCustomGroup string `xml:"customgroup" json:"customgroup"`\n')
        f.write('\tAddToRating string `xml:"addtorating" json:"addtorating"`\n')
        f.write('\tEnabled string `xml:"enabled" json:"enabled"`\n')
        f.write('\tOrder int `xml:"order" json:"order"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('}\n\n')
        
        # Generate Improvements struct
        f.write('// Improvements represents character improvements\n')
        f.write('type Improvements struct {\n')
        f.write('\tImprovement []Improvement `xml:"improvement,omitempty" json:"improvement,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ExpenseUndo struct
        f.write('// ExpenseUndo represents expense undo information\n')
        f.write('type ExpenseUndo struct {\n')
        f.write('\tKarmaType string `xml:"karmatype" json:"karmatype"`\n')
        f.write('\tNuyenType string `xml:"nuyentype" json:"nuyentype"`\n')
        f.write('\tObjectID string `xml:"objectid" json:"objectid"`\n')
        f.write('\tQty int `xml:"qty" json:"qty"`\n')
        f.write('\tExtra string `xml:"extra" json:"extra"`\n')
        f.write('}\n\n')
        
        # Generate Expense struct
        f.write('// Expense represents an expense\n')
        f.write('type Expense struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tDate string `xml:"date" json:"date"`\n')
        f.write('\tAmount int `xml:"amount" json:"amount"`\n')
        f.write('\tReason string `xml:"reason" json:"reason"`\n')
        f.write('\tType string `xml:"type" json:"type"`\n')
        f.write('\tRefund string `xml:"refund" json:"refund"`\n')
        f.write('\tUndo *ExpenseUndo `xml:"undo,omitempty" json:"undo,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Expenses struct
        f.write('// Expenses represents character expenses\n')
        f.write('type Expenses struct {\n')
        f.write('\tExpense []Expense `xml:"expense,omitempty" json:"expense,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Locations struct
        f.write('// Locations represents character locations\n')
        f.write('type Locations struct {\n')
        f.write('\tLocation []string `xml:"location,omitempty" json:"location,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ArmorBundles struct
        f.write('// ArmorBundles represents armor bundles\n')
        f.write('type ArmorBundles struct {\n')
        f.write('\tArmorBundle []string `xml:"armorbundle,omitempty" json:"armorbundle,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate WeaponLocations struct
        f.write('// WeaponLocations represents weapon locations\n')
        f.write('type WeaponLocations struct {\n')
        f.write('\tWeaponLocation []string `xml:"weaponlocation,omitempty" json:"weaponlocation,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ImprovementGroups struct
        f.write('// ImprovementGroups represents improvement groups\n')
        f.write('type ImprovementGroups struct {\n')
        f.write('\tImprovementGroup []string `xml:"improvementgroup,omitempty" json:"improvementgroup,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CalendarWeek struct
        f.write('// CalendarWeek represents a calendar week\n')
        f.write('type CalendarWeek struct {\n')
        f.write('\tGUID string `xml:"guid" json:"guid"`\n')
        f.write('\tYear int `xml:"year" json:"year"`\n')
        f.write('\tWeek int `xml:"week" json:"week"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('}\n\n')
        
        # Generate Calendar struct
        f.write('// Calendar represents character calendar\n')
        f.write('type Calendar struct {\n')
        f.write('\tWeek []CalendarWeek `xml:"week,omitempty" json:"week,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate main Character struct
        f.write('// Character represents a Shadowrun character\n')
        f.write('type Character struct {\n')
        f.write('\tSettings string `xml:"settings" json:"settings"`\n')
        f.write('\tMetatype string `xml:"metatype" json:"metatype"`\n')
        f.write('\tMetatypeBP int `xml:"metatypebp" json:"metatypebp"`\n')
        f.write('\tMetavariant string `xml:"metavariant" json:"metavariant"`\n')
        f.write('\tMetatypeCategory string `xml:"metatypecategory" json:"metatypecategory"`\n')
        f.write('\tMovement string `xml:"movement" json:"movement"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tMugshot string `xml:"mugshot" json:"mugshot"`\n')
        f.write('\tSex string `xml:"sex" json:"sex"`\n')
        f.write('\tGender string `xml:"gender" json:"gender"`\n')
        f.write('\tAge string `xml:"age" json:"age"`\n')
        f.write('\tEyes string `xml:"eyes" json:"eyes"`\n')
        f.write('\tHeight string `xml:"height" json:"height"`\n')
        f.write('\tWeight string `xml:"weight" json:"weight"`\n')
        f.write('\tSkin string `xml:"skin" json:"skin"`\n')
        f.write('\tHair string `xml:"hair" json:"hair"`\n')
        f.write('\tDescription string `xml:"description" json:"description"`\n')
        f.write('\tBackground string `xml:"background" json:"background"`\n')
        f.write('\tConcept string `xml:"concept" json:"concept"`\n')
        f.write('\tNotes string `xml:"notes" json:"notes"`\n')
        f.write('\tAlias string `xml:"alias" json:"alias"`\n')
        f.write('\tPlayerName string `xml:"playername" json:"playername"`\n')
        f.write('\tGameNotes string `xml:"gamenotes" json:"gamenotes"`\n')
        f.write('\tIgnoreRules *string `xml:"ignorerules,omitempty" json:"ignorerules,omitempty"`\n')
        f.write('\tIsCritter *string `xml:"iscritter,omitempty" json:"iscritter,omitempty"`\n')
        f.write('\tPossessed *string `xml:"possessed,omitempty" json:"possessed,omitempty"`\n')
        f.write('\tKarma int `xml:"karma" json:"karma"`\n')
        f.write('\tTotalKarma int `xml:"totalkarma" json:"totalkarma"`\n')
        f.write('\tStreetCred int `xml:"streetcred" json:"streetcred"`\n')
        f.write('\tNotoriety int `xml:"notoriety" json:"notoriety"`\n')
        f.write('\tPublicAwareness int `xml:"publicawareness" json:"publicawareness"`\n')
        f.write('\tBurntStreetCred int `xml:"burntstreetcred" json:"burntstreetcred"`\n')
        f.write('\tCreated string `xml:"created" json:"created"`\n')
        f.write('\tMaxAvail int `xml:"maxavail" json:"maxavail"`\n')
        f.write('\tNuyen int `xml:"nuyen" json:"nuyen"`\n')
        f.write('\tBP int `xml:"bp" json:"bp"`\n')
        f.write('\tBuildKarma int `xml:"buildkarma" json:"buildkarma"`\n')
        f.write('\tBuildMethod string `xml:"buildmethod" json:"buildmethod"`\n')
        f.write('\tKnowPts int `xml:"knowpts" json:"knowpts"`\n')
        f.write('\tNuyenBP int `xml:"nuyenbp" json:"nuyenbp"`\n')
        f.write('\tNuyenMaxBP int `xml:"nuyenmaxbp" json:"nuyenmaxbp"`\n')
        f.write('\tAdept string `xml:"adept" json:"adept"`\n')
        f.write('\tMagician string `xml:"magician" json:"magician"`\n')
        f.write('\tTechnomancer string `xml:"technomancer" json:"technomancer"`\n')
        f.write('\tInitiationOverride string `xml:"initiationoverride" json:"initiationoverride"`\n')
        f.write('\tCritter string `xml:"critter" json:"critter"`\n')
        f.write('\tUneducated string `xml:"uneducated" json:"uneducated"`\n')
        f.write('\tUncouth string `xml:"uncouth" json:"uncouth"`\n')
        f.write('\tInfirm string `xml:"infirm" json:"infirm"`\n')
        f.write('\tAttributes Attributes `xml:"attributes" json:"attributes"`\n')
        f.write('\tMagEnabled string `xml:"magenabled" json:"magenabled"`\n')
        f.write('\tInitiateGrade int `xml:"initiategrade" json:"initiategrade"`\n')
        f.write('\tResEnabled string `xml:"resenabled" json:"resenabled"`\n')
        f.write('\tSubmersionGrade int `xml:"submersiongrade" json:"submersiongrade"`\n')
        f.write('\tGroupMember string `xml:"groupmember" json:"groupmember"`\n')
        f.write('\tGroupName string `xml:"groupname" json:"groupname"`\n')
        f.write('\tGroupNotes string `xml:"groupnotes" json:"groupnotes"`\n')
        f.write('\tTotalEss string `xml:"totaless" json:"totaless"`\n')
        f.write('\tMagSplitAdept *int `xml:"magsplitadept,omitempty" json:"magsplitadept,omitempty"`\n')
        f.write('\tMagSplitMagician *int `xml:"magsplitmagician,omitempty" json:"magsplitmagician,omitempty"`\n')
        f.write('\tTradition string `xml:"tradition" json:"tradition"`\n')
        f.write('\tStream string `xml:"stream" json:"stream"`\n')
        f.write('\tPhysicalCMFilled int `xml:"physicalcmfilled" json:"physicalcmfilled"`\n')
        f.write('\tStunCMFilled int `xml:"stuncmfilled" json:"stuncmfilled"`\n')
        f.write('\tSkillGroups SkillGroups `xml:"skillgroups" json:"skillgroups"`\n')
        f.write('\tSkills Skills `xml:"skills" json:"skills"`\n')
        f.write('\tContacts Contacts `xml:"contacts" json:"contacts"`\n')
        f.write('\tSpells Spells `xml:"spells" json:"spells"`\n')
        f.write('\tFoci Foci `xml:"foci" json:"foci"`\n')
        f.write('\tStackedFoci StackedFoci `xml:"stackedfoci" json:"stackedfoci"`\n')
        f.write('\tPowers Powers `xml:"powers" json:"powers"`\n')
        f.write('\tSpirits Spirits `xml:"spirits" json:"spirits"`\n')
        f.write('\tTechPrograms TechPrograms `xml:"techprograms" json:"techprograms"`\n')
        f.write('\tMartialArts MartialArts `xml:"martialarts" json:"martialarts"`\n')
        f.write('\tArmors Armors `xml:"armors" json:"armors"`\n')
        f.write('\tWeapons Weapons `xml:"weapons" json:"weapons"`\n')
        f.write('\tCyberwares Cyberwares `xml:"cyberwares" json:"cyberwares"`\n')
        f.write('\tQualities Qualities `xml:"qualities" json:"qualities"`\n')
        f.write('\tLifestyles Lifestyles `xml:"lifestyles" json:"lifestyles"`\n')
        f.write('\tGears Gears `xml:"gears" json:"gears"`\n')
        f.write('\tVehicles Vehicles `xml:"vehicles" json:"vehicles"`\n')
        f.write('\tMetamagics Metamagics `xml:"metamagics" json:"metamagics"`\n')
        f.write('\tCritterPowers CritterPowers `xml:"critterpowers" json:"critterpowers"`\n')
        f.write('\tInitiationGrades InitiationGrades `xml:"initiationgrades" json:"initiationgrades"`\n')
        f.write('\tImprovements Improvements `xml:"improvements" json:"improvements"`\n')
        f.write('\tExpenses Expenses `xml:"expenses" json:"expenses"`\n')
        f.write('\tLocations Locations `xml:"locations" json:"locations"`\n')
        f.write('\tArmorBundles ArmorBundles `xml:"armorbundles" json:"armorbundles"`\n')
        f.write('\tWeaponLocations WeaponLocations `xml:"weaponlocations" json:"weaponlocations"`\n')
        f.write('\tImprovementGroups ImprovementGroups `xml:"improvementgroups" json:"improvementgroups"`\n')
        f.write('\tCalendar Calendar `xml:"calendar" json:"calendar"`\n')
        f.write('}\n\n')
        
        # Generate CharacterDataSet struct (root element)
        f.write('// CharacterDataSet represents the root dataset element\n')
        f.write('type CharacterDataSet struct {\n')
        f.write('\tCharacter []Character `xml:"character" json:"character"`\n')
        f.write('}\n\n')
    
    print("Generated character.go")

if __name__ == '__main__':
    print("Generating character from character.xsd...")
    generate_character()
    print("Done!")

