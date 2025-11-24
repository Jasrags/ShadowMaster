#!/usr/bin/env python3
"""Generate armor.go from armor.xsd"""

import xml.etree.ElementTree as ET
import os

def generate_armor():
    """Generate armor.go from armor.xsd"""
    
    tree = ET.parse('data/chummerxml/armor.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/armor.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains armor structures generated from armor.xsd\n\n')
        
        # Generate ArmorCategory struct
        f.write('// ArmorCategory represents an armor category\n')
        f.write('type ArmorCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tBlackmarket *string `xml:"blackmarket,attr,omitempty" json:"+@blackmarket,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ArmorCategories struct
        f.write('// ArmorCategories represents a collection of armor categories\n')
        f.write('type ArmorCategories struct {\n')
        f.write('\tCategory []ArmorCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ArmorModCategory struct
        f.write('// ArmorModCategory represents an armor mod category\n')
        f.write('type ArmorModCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tBlackmarket *string `xml:"blackmarket,attr,omitempty" json:"+@blackmarket,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ArmorModCategories struct
        f.write('// ArmorModCategories represents a collection of armor mod categories\n')
        f.write('type ArmorModCategories struct {\n')
        f.write('\tCategory []ArmorModCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate SelectModsFromCategory struct
        f.write('// SelectModsFromCategory represents selectmodsfromcategory element\n')
        f.write('type SelectModsFromCategory struct {\n')
        f.write('\tCategory []string `xml:"category" json:"category"`\n')
        f.write('}\n\n')
        
        # Generate ArmorModName struct (for mods/name)
        f.write('// ArmorModName represents a mod name\n')
        f.write('type ArmorModName struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *int `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ArmorMods struct (for armor/mods)
        f.write('// ArmorMods represents armor mods\n')
        f.write('type ArmorMods struct {\n')
        f.write('\tName []ArmorModName `xml:"name" json:"name"`\n')
        f.write('}\n\n')
        
        # Generate ArmorUseGear struct (for armor/gears/usegear)
        f.write('// ArmorUseGear represents a usegear element for armor\n')
        f.write('type ArmorUseGear struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *int `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ArmorGears struct (for armor/gears)
        f.write('// ArmorGears represents armor gears\n')
        f.write('type ArmorGears struct {\n')
        f.write('\tUseGear []ArmorUseGear `xml:"usegear" json:"usegear"`\n')
        f.write('}\n\n')
        
        # Generate ArmorItem struct (for armors/armor)
        f.write('// ArmorItem represents an armor item\n')
        f.write('type ArmorItem struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tAddonCategory []string `xml:"addoncategory,omitempty" json:"addoncategory,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('\tArmor string `xml:"armor" json:"armor"`\n')
        f.write('\tArmorOverride *string `xml:"armoroverride,omitempty" json:"armoroverride,omitempty"`\n')
        f.write('\tArmorCapacity string `xml:"armorcapacity" json:"armorcapacity"`\n')
        f.write('\tGearCapacity *string `xml:"gearcapacity,omitempty" json:"gearcapacity,omitempty"`\n')
        f.write('\tAddWeapon []string `xml:"addweapon,omitempty" json:"addweapon,omitempty"`\n')
        f.write('\tPhysicalLimit *string `xml:"physicallimit,omitempty" json:"physicallimit,omitempty"`\n')
        f.write('\tSocialLimit *string `xml:"sociallimit,omitempty" json:"sociallimit,omitempty"`\n')
        f.write('\tAvail string `xml:"avail" json:"avail"`\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('\tSelectModsFromCategory *SelectModsFromCategory `xml:"selectmodsfromcategory,omitempty" json:"selectmodsfromcategory,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tWirelessBonus *common.BaseBonus `xml:"wirelessbonus,omitempty" json:"wirelessbonus,omitempty"`\n')
        f.write('\tAddModCategory *string `xml:"addmodcategory,omitempty" json:"addmodcategory,omitempty"`\n')
        f.write('\tForceModCategory *string `xml:"forcemodcategory,omitempty" json:"forcemodcategory,omitempty"`\n')
        f.write('\tMods *ArmorMods `xml:"mods,omitempty" json:"mods,omitempty"`\n')
        f.write('\tForbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`\n')
        f.write('\tGears *ArmorGears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate ArmorItems struct
        f.write('// ArmorItems represents a collection of armor items\n')
        f.write('type ArmorItems struct {\n')
        f.write('\tArmor []ArmorItem `xml:"armor,omitempty" json:"armor,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ArmorModUseGear struct (for mods/mod/gears/usegear)
        f.write('// ArmorModUseGear represents a usegear element for armor mods\n')
        f.write('type ArmorModUseGear struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *int `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ArmorModGears struct (for mods/mod/gears)
        f.write('// ArmorModGears represents armor mod gears\n')
        f.write('type ArmorModGears struct {\n')
        f.write('\tUseGear []ArmorModUseGear `xml:"usegear" json:"usegear"`\n')
        f.write('}\n\n')
        
        # Generate ArmorModItem struct (for mods/mod)
        f.write('// ArmorModItem represents an armor mod item\n')
        f.write('type ArmorModItem struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tArmor *string `xml:"armor,omitempty" json:"armor,omitempty"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tMaxRating string `xml:"maxrating" json:"maxrating"`\n')
        f.write('\tArmorCapacity string `xml:"armorcapacity" json:"armorcapacity"`\n')
        f.write('\tAvail string `xml:"avail" json:"avail"`\n')
        f.write('\tAddWeapon []string `xml:"addweapon,omitempty" json:"addweapon,omitempty"`\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tGears *ArmorModGears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate ArmorModItems struct
        f.write('// ArmorModItems represents a collection of armor mod items\n')
        f.write('type ArmorModItems struct {\n')
        f.write('\tMod []ArmorModItem `xml:"mod,omitempty" json:"mod,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ArmorChummer struct (root element)
        f.write('// ArmorChummer represents the root chummer element for armor\n')
        f.write('type ArmorChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tCategories []ArmorCategories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tModCategories []ArmorModCategories `xml:"modcategories,omitempty" json:"modcategories,omitempty"`\n')
        f.write('\tArmors []ArmorItems `xml:"armors,omitempty" json:"armors,omitempty"`\n')
        f.write('\tMods []ArmorModItems `xml:"mods,omitempty" json:"mods,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated armor.go")

if __name__ == '__main__':
    print("Generating armor from armor.xsd...")
    generate_armor()
    print("Done!")

