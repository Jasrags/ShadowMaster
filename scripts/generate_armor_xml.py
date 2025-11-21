#!/usr/bin/env python3
"""Generate armor.go, armor_data.go, and armor_test.go from armor.xml using XSD schema"""

import xml.etree.ElementTree as ET
import re

def escape_go_string(s):
    """Escape string for Go code"""
    if s is None:
        return '""'
    # Replace " with \" and handle newlines
    s = str(s).replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
    return f'"{s}"'

def to_go_identifier(name):
    """Convert XML element name to Go identifier"""
    # Capitalize first letter of each word after removing underscores/dashes
    parts = re.split(r'[-_]', name)
    return ''.join(word.capitalize() for word in parts)

def parse_int_or_none(s):
    """Parse string to int or return None"""
    if s is None or s.strip() == '':
        return None
    try:
        return int(s.strip())
    except ValueError:
        return None

def parse_string_or_none(s):
    """Parse string or return None if empty"""
    if s is None or s.strip() == '':
        return None
    return s.strip()

def string_ptr(s):
    """Return Go code for *string"""
    if s is None:
        return "nil"
    return f'stringPtr({escape_go_string(s)})'

def int_ptr(i):
    """Return Go code for *int"""
    if i is None:
        return "nil"
    return f'intPtr({i})'

def generate_structs_file():
    """Generate armor.go with struct definitions based on XSD"""
    
    structs_code = '''package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// Note: Chummer root element is defined in books.go (shared across XML files)

// Category represents an armor or mod category with its black market classification
// XSD: category element with blackmarket attribute (xs:string, optional) and text content (xs:string)
type Category struct {
	Name        string `xml:",chardata" json:"name"`         // Category name
	BlackMarket string `xml:"blackmarket,attr,omitempty" json:"black_market"` // Black market classification
}

// SelectModsFromCategory represents a category to select mods from
// XSD: selectmodsfromcategory element containing category elements (minOccurs="1", maxOccurs="unbounded")
type SelectModsFromCategory struct {
	Category []string `xml:"category" json:"category"` // Categories to select mods from - XSD: minOccurs="1", maxOccurs="unbounded"
}

// Gears represents gears that can be used with armor
// XSD: gears element containing usegear elements (minOccurs="1", maxOccurs="unbounded")
type Gears struct {
	UseGear []UseGear `xml:"usegear" json:"usegear"` // Array of gear entries - XSD: minOccurs="1", maxOccurs="unbounded"
}

// UseGear represents a gear entry with optional rating and select attributes
// XSD: usegear element with rating (xs:integer, optional) and select (xs:string, optional) attributes, text content (xs:string)
type UseGear struct {
	Content string `xml:",chardata" json:"+content,omitempty"` // Gear name
	Rating  *int   `xml:"rating,attr,omitempty" json:"+@rating,omitempty"` // Optional rating - XSD: xs:integer, optional
	Select  string `xml:"select,attr,omitempty" json:"+@select,omitempty"` // Optional selection - XSD: xs:string, optional
}

// Mods represents pre-installed mods on armor
// XSD: mods element containing name elements (minOccurs="1", maxOccurs="unbounded")
type Mods struct {
	Name []ModName `xml:"name" json:"name"` // Array of mod names - XSD: minOccurs="1", maxOccurs="unbounded"
}

// ModName represents a mod name entry with optional rating attribute
// XSD: name element with rating (xs:integer, optional) attribute, text content (xs:string)
type ModName struct {
	Content string `xml:",chardata" json:"+content,omitempty"` // Mod name
	Rating  *int   `xml:"rating,attr,omitempty" json:"+@rating,omitempty"` // Optional rating - XSD: xs:integer, optional
}

// Bonus represents bonuses provided by armor or mods
// XSD: bonus element of type bonusTypes (from bonuses.xsd)
// Note: This is a simplified version focusing on common bonus types used in armor
// The full bonusTypes from bonuses.xsd is very complex with many possible fields
type Bonus struct {
	// Limit modifiers
	LimitModifier []common.LimitModifier `xml:"limitmodifier,omitempty" json:"limitmodifier,omitempty"` // XSD: minOccurs="0", maxOccurs="unbounded"

	// Skill bonuses
	SkillCategory []common.SkillCategoryBonus `xml:"skillcategory,omitempty" json:"skillcategory,omitempty"` // XSD: minOccurs="0", maxOccurs="unbounded"
	SpecificSkill []common.SpecificSkillBonus `xml:"specificskill,omitempty" json:"specificskill,omitempty"` // XSD: minOccurs="0", maxOccurs="unbounded"

	// Social limit
	SocialLimit string `xml:"sociallimit,omitempty" json:"sociallimit,omitempty"` // XSD: xs:string, minOccurs="0"

	// Resistance/immunity bonuses
	ToxinContactResist       string `xml:"toxincontactresist,omitempty" json:"toxincontactresist,omitempty"` // XSD: xs:string, minOccurs="0"
	ToxinContactImmune       bool   `xml:"toxincontactimmune,omitempty" json:"toxincontactimmune,omitempty"` // XSD: xs:boolean, minOccurs="0"
	ToxinInhalationImmune    bool   `xml:"toxininhalationimmune,omitempty" json:"toxininhalationimmune,omitempty"` // XSD: xs:boolean, minOccurs="0"
	PathogenContactResist    string `xml:"pathogencontactresist,omitempty" json:"pathogencontactresist,omitempty"` // XSD: xs:string, minOccurs="0"
	PathogenContactImmune    bool   `xml:"pathogencontactimmune,omitempty" json:"pathogencontactimmune,omitempty"` // XSD: xs:boolean, minOccurs="0"
	PathogenInhalationImmune bool   `xml:"pathogeninhalationimmune,omitempty" json:"pathogeninhalationimmune,omitempty"` // XSD: xs:boolean, minOccurs="0"

	// Armor bonuses
	FireArmor        string `xml:"firearmor,omitempty" json:"firearmor,omitempty"`         // XSD: xs:string, minOccurs="0"
	ColdArmor        string `xml:"coldarmor,omitempty" json:"coldarmor,omitempty"`         // XSD: xs:string, minOccurs="0"
	ElectricityArmor string `xml:"electricityarmor,omitempty" json:"electricityarmor,omitempty"` // XSD: xs:string, minOccurs="0"

	// Radiation resistance
	RadiationResist string `xml:"radiationresist,omitempty" json:"radiationresist,omitempty"` // XSD: xs:string, minOccurs="0"

	// Fatigue resistance
	FatigueResist string `xml:"fatigueresist,omitempty" json:"fatigueresist,omitempty"` // XSD: xs:string, minOccurs="0"

	// Select armor
	SelectArmor bool `xml:"selectarmor,omitempty" json:"selectarmor,omitempty"` // XSD: xs:boolean, minOccurs="0"

	// Unique identifier
	Unique string `xml:"unique,attr,omitempty" json:"+@unique,omitempty"` // XSD: xs:string, optional attribute

	// Select text
	SelectText bool `xml:"selecttext,omitempty" json:"selecttext,omitempty"` // XSD: xs:boolean, minOccurs="0"
}

// Armor represents a piece of armor from Shadowrun 5th Edition
// XSD: armor element with required and optional fields
type Armor struct {
	// Required fields (minOccurs="1")
	ID            string `xml:"id" json:"id"`                       // Unique identifier (UUID) - XSD: xs:string, minOccurs="1"
	Name          string `xml:"name" json:"name"`                   // Armor name - XSD: xs:string, minOccurs="1"
	Category      string `xml:"category" json:"category"`           // Category - XSD: xs:string, minOccurs="1"
	Armor         string `xml:"armor" json:"armor"`                 // Armor value - XSD: xs:string, minOccurs="1"
	ArmorCapacity string `xml:"armorcapacity" json:"armorcapacity"` // Armor capacity - XSD: xs:string, minOccurs="1"
	Avail         string `xml:"avail" json:"avail"`                 // Availability - XSD: xs:string, minOccurs="1"
	Cost          string `xml:"cost" json:"cost"`                   // Cost - XSD: xs:string, minOccurs="1"
	Source        string `xml:"source" json:"source"`               // Source book - XSD: xs:string, minOccurs="1"
	Page          string `xml:"page" json:"page"`                   // Page number - XSD: xs:string, minOccurs="1"

	// Optional fields (minOccurs="0")
	Hide                  *string                 `xml:"hide,omitempty" json:"hide,omitempty"`                               // Hide flag - XSD: xs:string, minOccurs="0"
	IgnoreSourceDisabled  *string                 `xml:"ignoresourcedisabled,omitempty" json:"ignoresourcedisabled,omitempty"` // Ignore source disabled - XSD: xs:string, minOccurs="0"
	Rating                *string                 `xml:"rating,omitempty" json:"rating,omitempty"`                           // Rating - XSD: xs:string, minOccurs="0"
	ArmorOverride         *string                 `xml:"armoroverride,omitempty" json:"armoroverride,omitempty"`             // Armor override - XSD: xs:string, minOccurs="0"
	GearCapacity          *string                 `xml:"gearcapacity,omitempty" json:"gearcapacity,omitempty"`               // Gear capacity - XSD: xs:string, minOccurs="0"
	PhysicalLimit         *string                 `xml:"physicallimit,omitempty" json:"physicallimit,omitempty"`             // Physical limit - XSD: xs:string, minOccurs="0"
	SocialLimit           *string                 `xml:"sociallimit,omitempty" json:"sociallimit,omitempty"`                 // Social limit - XSD: xs:string, minOccurs="0"
	AddModCategory        *string                 `xml:"addmodcategory,omitempty" json:"addmodcategory,omitempty"`           // Add mod category - XSD: xs:string, minOccurs="0"
	ForceModCategory      *string                 `xml:"forcemodcategory,omitempty" json:"forcemodcategory,omitempty"`       // Force mod category - XSD: xs:string, minOccurs="0"
	AddonCategory         []string                `xml:"addoncategory,omitempty" json:"addoncategory,omitempty"`             // Addon categories - XSD: xs:string, minOccurs="0", maxOccurs="unbounded"
	AddWeapon             []string                `xml:"addweapon,omitempty" json:"addweapon,omitempty"`                     // Add weapon - XSD: xs:string, minOccurs="0", maxOccurs="unbounded"
	SelectModsFromCategory *SelectModsFromCategory `xml:"selectmodsfromcategory,omitempty" json:"selectmodsfromcategory,omitempty"` // Select mods from category - XSD: minOccurs="0"
	Bonus                 *Bonus                  `xml:"bonus,omitempty" json:"bonus,omitempty"`                             // Bonus - XSD: bonusTypes, minOccurs="0"
	WirelessBonus         *Bonus                  `xml:"wirelessbonus,omitempty" json:"wirelessbonus,omitempty"`             // Wireless bonus - XSD: bonusTypes, minOccurs="0"
	Mods                  *Mods                   `xml:"mods,omitempty" json:"mods,omitempty"`                               // Pre-installed mods - XSD: minOccurs="0"
	Gears                 *Gears                  `xml:"gears,omitempty" json:"gears,omitempty"`                             // Gears - XSD: minOccurs="0"
	Forbidden             interface{}             `xml:"forbidden,omitempty" json:"forbidden,omitempty"`                     // Forbidden conditions - XSD: forbidden element from conditions.xsd (complex, TODO: type properly)
	Required              interface{}             `xml:"required,omitempty" json:"required,omitempty"`                       // Required conditions - XSD: required element from conditions.xsd (complex, TODO: type properly)
}

// ArmorMod represents an armor modification from Shadowrun 5th Edition
// XSD: mod element with required and optional fields
type ArmorMod struct {
	// Required fields (minOccurs="1")
	ID            string `xml:"id" json:"id"`                       // Unique identifier (UUID) - XSD: xs:string, minOccurs="1"
	Name          string `xml:"name" json:"name"`                   // Mod name - XSD: xs:string, minOccurs="1"
	Category      string `xml:"category" json:"category"`           // Category - XSD: xs:string, minOccurs="1"
	MaxRating     string `xml:"maxrating" json:"maxrating"`         // Maximum rating - XSD: xs:string, minOccurs="1"
	ArmorCapacity string `xml:"armorcapacity" json:"armorcapacity"` // Armor capacity - XSD: xs:string, minOccurs="1"
	Avail         string `xml:"avail" json:"avail"`                 // Availability - XSD: xs:string, minOccurs="1"
	Cost          string `xml:"cost" json:"cost"`                   // Cost - XSD: xs:string, minOccurs="1"
	Source        string `xml:"source" json:"source"`               // Source book - XSD: xs:string, minOccurs="1"
	Page          string `xml:"page" json:"page"`                   // Page number - XSD: xs:string, minOccurs="1"

	// Optional fields (minOccurs="0")
	Armor          *string    `xml:"armor,omitempty" json:"armor,omitempty"`                   // Armor value - XSD: xs:string, minOccurs="0"
	Hide           *string    `xml:"hide,omitempty" json:"hide,omitempty"`                     // Hide flag - XSD: xs:string, minOccurs="0"
	IgnoreSourceDisabled *string `xml:"ignoresourcedisabled,omitempty" json:"ignoresourcedisabled,omitempty"` // Ignore source disabled - XSD: xs:string, minOccurs="0"
	AddWeapon      []string   `xml:"addweapon,omitempty" json:"addweapon,omitempty"`           // Add weapon - XSD: xs:string, minOccurs="0", maxOccurs="unbounded"
	Bonus          *Bonus     `xml:"bonus,omitempty" json:"bonus,omitempty"`                   // Bonus - XSD: bonusTypes, minOccurs="0"
	WirelessBonus  *Bonus     `xml:"wirelessbonus,omitempty" json:"wirelessbonus,omitempty"`   // Wireless bonus - XSD: bonusTypes, minOccurs="0"
	Gears          *Gears     `xml:"gears,omitempty" json:"gears,omitempty"`                   // Gears - XSD: minOccurs="0"
	Forbidden      interface{} `xml:"forbidden,omitempty" json:"forbidden,omitempty"`          // Forbidden conditions - XSD: forbidden element from conditions.xsd (complex, TODO: type properly)
	Required       interface{} `xml:"required,omitempty" json:"required,omitempty"`            // Required conditions - XSD: required element from conditions.xsd (complex, TODO: type properly)
}

// Note: stringPtr and intPtr helper functions are defined in lifestyles.go (shared across XML-generated files)
'''
    
    with open('pkg/shadowrun/edition/v5/armor.go', 'w', encoding='utf-8') as f:
        f.write(structs_code)
    print("Generated armor.go")

def convert_limit_modifier_to_go(lm_elem):
    """Convert limitmodifier element to Go struct literal"""
    limit = lm_elem.findtext('limit', '')
    value = lm_elem.findtext('value', '')
    condition = lm_elem.findtext('condition', '')
    
    return f'common.LimitModifier{{\n\t\t\t\tLimit: {escape_go_string(limit)}, Value: {escape_go_string(value)}, Condition: {escape_go_string(condition)},\n\t\t\t}}'

def convert_skill_category_to_go(sc_elem):
    """Convert skillcategory element to Go struct literal"""
    name = sc_elem.findtext('name', '')
    bonus_text = sc_elem.findtext('bonus', '')
    # Bonus is an int in SkillCategoryBonus
    try:
        bonus_int = int(bonus_text)
        bonus_str = str(bonus_int)
    except ValueError:
        bonus_str = '0'  # Default to 0 if can't parse
    
    return f'common.SkillCategoryBonus{{\n\t\t\t\tName: {escape_go_string(name)}, Bonus: {bonus_str},\n\t\t\t}}'

def convert_specific_skill_to_go(ss_elem):
    """Convert specificskill element to Go struct literal"""
    name = ss_elem.findtext('name', '')
    bonus = ss_elem.findtext('bonus', '')
    
    return f'common.SpecificSkillBonus{{\n\t\t\t\tName: {escape_go_string(name)}, Bonus: {escape_go_string(bonus)},\n\t\t\t}}'

def convert_bonus_to_go(bonus_elem):
    """Convert bonus element to Go struct literal"""
    if bonus_elem is None:
        return "nil"
    
    parts = []
    
    # Limit modifiers
    lm_elems = bonus_elem.findall('limitmodifier')
    if lm_elems:
        lm_strs = [convert_limit_modifier_to_go(lm) for lm in lm_elems]
        parts.append(f'LimitModifier: []common.LimitModifier{{\n\t\t\t\t{",\n\t\t\t\t".join(lm_strs)},\n\t\t\t}}')
    
    # Skill categories
    sc_elems = bonus_elem.findall('skillcategory')
    if sc_elems:
        sc_strs = [convert_skill_category_to_go(sc) for sc in sc_elems]
        parts.append(f'SkillCategory: []common.SkillCategoryBonus{{\n\t\t\t\t{",\n\t\t\t\t".join(sc_strs)},\n\t\t\t}}')
    
    # Specific skills
    ss_elems = bonus_elem.findall('specificskill')
    if ss_elems:
        ss_strs = [convert_specific_skill_to_go(ss) for ss in ss_elems]
        parts.append(f'SpecificSkill: []common.SpecificSkillBonus{{\n\t\t\t\t{",\n\t\t\t\t".join(ss_strs)},\n\t\t\t}}')
    
    # Simple string fields
    for field_name, xml_name in [
        ('SocialLimit', 'sociallimit'),
        ('ToxinContactResist', 'toxincontactresist'),
        ('PathogenContactResist', 'pathogencontactresist'),
        ('FireArmor', 'firearmor'),
        ('ColdArmor', 'coldarmor'),
        ('ElectricityArmor', 'electricityarmor'),
        ('RadiationResist', 'radiationresist'),
        ('FatigueResist', 'fatigueresist'),
        ('Unique', 'unique'),
    ]:
        val = bonus_elem.findtext(xml_name)
        if val is not None and val.strip() != '':
            parts.append(f'{field_name}: {escape_go_string(val)}')
    
    # Boolean fields (check if element exists)
    for field_name, xml_name in [
        ('ToxinContactImmune', 'toxincontactimmune'),
        ('ToxinInhalationImmune', 'toxininhalationimmune'),
        ('PathogenContactImmune', 'pathogencontactimmune'),
        ('PathogenInhalationImmune', 'pathogeninhalationimmune'),
        ('SelectArmor', 'selectarmor'),
        ('SelectText', 'selecttext'),
    ]:
        if bonus_elem.find(xml_name) is not None:
            parts.append(f'{field_name}: true')
    
    if not parts:
        return "nil"
    
    return f"&Bonus{{\n\t\t\t{',\n\t\t\t'.join(parts)},\n\t\t}}"

def convert_gears_to_go(gears_elem):
    """Convert gears element to Go struct literal"""
    if gears_elem is None:
        return "nil"
    
    usegear_elems = gears_elem.findall('usegear')
    if not usegear_elems:
        return "nil"
    
    usegear_strs = []
    for ug_elem in usegear_elems:
        content = ug_elem.text or ''
        rating = ug_elem.get('rating')
        select = ug_elem.get('select', '')
        
        ug_parts = [f'Content: {escape_go_string(content)}']
        if rating:
            try:
                rating_int = int(rating)
                ug_parts.append(f'Rating: intPtr({rating_int})')
            except ValueError:
                pass
        if select:
            ug_parts.append(f'Select: {escape_go_string(select)}')
        
        usegear_strs.append(f'UseGear{{\n\t\t\t\t\t{", ".join(ug_parts)},\n\t\t\t\t}}')
    
    return f"&Gears{{\n\t\t\t\tUseGear: []UseGear{{\n\t\t\t\t\t{',\n\t\t\t\t\t'.join(usegear_strs)},\n\t\t\t\t}},\n\t\t\t}}"

def convert_mods_to_go(mods_elem):
    """Convert mods element to Go struct literal"""
    if mods_elem is None:
        return "nil"
    
    name_elems = mods_elem.findall('name')
    if not name_elems:
        return "nil"
    
    name_strs = []
    for name_elem in name_elems:
        content = name_elem.text or ''
        rating = name_elem.get('rating')
        
        name_parts = [f'Content: {escape_go_string(content)}']
        if rating:
            try:
                rating_int = int(rating)
                name_parts.append(f'Rating: intPtr({rating_int})')
            except ValueError:
                pass
        
        name_strs.append(f'ModName{{\n\t\t\t\t\t{", ".join(name_parts)},\n\t\t\t\t}}')
    
    return f"&Mods{{\n\t\t\t\tName: []ModName{{\n\t\t\t\t\t{',\n\t\t\t\t\t'.join(name_strs)},\n\t\t\t\t}},\n\t\t\t}}"

def convert_select_mods_from_category_to_go(smfc_elem):
    """Convert selectmodsfromcategory element to Go struct literal"""
    if smfc_elem is None:
        return "nil"
    
    category_elems = smfc_elem.findall('category')
    if not category_elems:
        return "nil"
    
    categories = [escape_go_string(cat.text or '') for cat in category_elems]
    categories_str = ',\n\t\t\t\t\t'.join(categories)
    
    return f"&SelectModsFromCategory{{\n\t\t\t\t\tCategory: []string{{\n\t\t\t\t\t\t{categories_str},\n\t\t\t\t\t}},\n\t\t\t\t}}"

def convert_armor_to_go(armor_elem, key_name):
    """Convert an XML armor element to Go struct literal"""
    # Required fields
    id_val = armor_elem.findtext('id', '')
    name_val = armor_elem.findtext('name', '')
    category_val = armor_elem.findtext('category', '')
    armor_val = armor_elem.findtext('armor', '')
    armor_capacity_val = armor_elem.findtext('armorcapacity', '')
    avail_val = armor_elem.findtext('avail', '')
    cost_val = armor_elem.findtext('cost', '')
    source_val = armor_elem.findtext('source', '')
    page_val = armor_elem.findtext('page', '')
    
    # Optional fields
    hide_elem = armor_elem.find('hide')
    hide_val = None
    if hide_elem is not None:
        hide_val = ""
    
    ignore_source_disabled = parse_string_or_none(armor_elem.findtext('ignoresourcedisabled'))
    rating = parse_string_or_none(armor_elem.findtext('rating'))
    armor_override = parse_string_or_none(armor_elem.findtext('armoroverride'))
    gear_capacity = parse_string_or_none(armor_elem.findtext('gearcapacity'))
    physical_limit = parse_string_or_none(armor_elem.findtext('physicallimit'))
    social_limit = parse_string_or_none(armor_elem.findtext('sociallimit'))
    add_mod_category = parse_string_or_none(armor_elem.findtext('addmodcategory'))
    force_mod_category = parse_string_or_none(armor_elem.findtext('forcemodcategory'))
    
    # Multiple occurrence fields
    addon_categories = [cat.text or '' for cat in armor_elem.findall('addoncategory')]
    add_weapons = [weapon.text or '' for weapon in armor_elem.findall('addweapon')]
    
    # Complex fields
    select_mods_from_category = convert_select_mods_from_category_to_go(armor_elem.find('selectmodsfromcategory'))
    bonus = convert_bonus_to_go(armor_elem.find('bonus'))
    wireless_bonus = convert_bonus_to_go(armor_elem.find('wirelessbonus'))
    mods = convert_mods_to_go(armor_elem.find('mods'))
    gears = convert_gears_to_go(armor_elem.find('gears'))
    
    # Forbidden and Required are complex and left as interface{} for now
    forbidden_elem = armor_elem.find('forbidden')
    required_elem = armor_elem.find('required')
    
    # Format the struct
    result = f'\t"{key_name}": {{\n'
    result += f'\t\tID: {escape_go_string(id_val)},\n'
    result += f'\t\tName: {escape_go_string(name_val)},\n'
    result += f'\t\tCategory: {escape_go_string(category_val)},\n'
    result += f'\t\tArmor: {escape_go_string(armor_val)},\n'
    result += f'\t\tArmorCapacity: {escape_go_string(armor_capacity_val)},\n'
    result += f'\t\tAvail: {escape_go_string(avail_val)},\n'
    result += f'\t\tCost: {escape_go_string(cost_val)},\n'
    result += f'\t\tSource: {escape_go_string(source_val)},\n'
    result += f'\t\tPage: {escape_go_string(page_val)},'
    
    if hide_val is not None:
        result += f'\n\t\tHide: stringPtr({escape_go_string(hide_val)}),'
    
    if ignore_source_disabled is not None:
        result += f'\n\t\tIgnoreSourceDisabled: stringPtr({escape_go_string(ignore_source_disabled)}),'
    
    if rating is not None:
        result += f'\n\t\tRating: stringPtr({escape_go_string(rating)}),'
    
    if armor_override is not None:
        result += f'\n\t\tArmorOverride: stringPtr({escape_go_string(armor_override)}),'
    
    if gear_capacity is not None:
        result += f'\n\t\tGearCapacity: stringPtr({escape_go_string(gear_capacity)}),'
    
    if physical_limit is not None:
        result += f'\n\t\tPhysicalLimit: stringPtr({escape_go_string(physical_limit)}),'
    
    if social_limit is not None:
        result += f'\n\t\tSocialLimit: stringPtr({escape_go_string(social_limit)}),'
    
    if add_mod_category is not None:
        result += f'\n\t\tAddModCategory: stringPtr({escape_go_string(add_mod_category)}),'
    
    if force_mod_category is not None:
        result += f'\n\t\tForceModCategory: stringPtr({escape_go_string(force_mod_category)}),'
    
    if addon_categories:
        categories_str = ',\n\t\t\t\t'.join(escape_go_string(cat) for cat in addon_categories)
        result += f'\n\t\tAddonCategory: []string{{\n\t\t\t\t{categories_str},\n\t\t\t}},'
    
    if add_weapons:
        weapons_str = ',\n\t\t\t\t'.join(escape_go_string(weapon) for weapon in add_weapons)
        result += f'\n\t\tAddWeapon: []string{{\n\t\t\t\t{weapons_str},\n\t\t\t}},'
    
    if select_mods_from_category != "nil":
        result += f'\n\t\tSelectModsFromCategory: {select_mods_from_category},'
    
    if bonus != "nil":
        result += f'\n\t\tBonus: {bonus},'
    
    if wireless_bonus != "nil":
        result += f'\n\t\tWirelessBonus: {wireless_bonus},'
    
    if mods != "nil":
        result += f'\n\t\tMods: {mods},'
    
    if gears != "nil":
        result += f'\n\t\tGears: {gears},'
    
    if forbidden_elem is not None:
        result += f'\n\t\tForbidden: nil, // TODO: Parse forbidden element from conditions.xsd'
    
    if required_elem is not None:
        result += f'\n\t\tRequired: nil, // TODO: Parse required element from conditions.xsd'
    
    result += '\n\t}'
    return result

def convert_armor_mod_to_go(mod_elem, key_name):
    """Convert an XML mod element to Go struct literal"""
    # Required fields
    id_val = mod_elem.findtext('id', '')
    name_val = mod_elem.findtext('name', '')
    category_val = mod_elem.findtext('category', '')
    max_rating_val = mod_elem.findtext('maxrating', '')
    armor_capacity_val = mod_elem.findtext('armorcapacity', '')
    avail_val = mod_elem.findtext('avail', '')
    cost_val = mod_elem.findtext('cost', '')
    source_val = mod_elem.findtext('source', '')
    page_val = mod_elem.findtext('page', '')
    
    # Optional fields
    armor_val = parse_string_or_none(mod_elem.findtext('armor'))
    hide_elem = mod_elem.find('hide')
    hide_val = None
    if hide_elem is not None:
        hide_val = ""
    
    ignore_source_disabled = parse_string_or_none(mod_elem.findtext('ignoresourcedisabled'))
    
    # Multiple occurrence fields
    add_weapons = [weapon.text or '' for weapon in mod_elem.findall('addweapon')]
    
    # Complex fields
    bonus = convert_bonus_to_go(mod_elem.find('bonus'))
    wireless_bonus = convert_bonus_to_go(mod_elem.find('wirelessbonus'))
    gears = convert_gears_to_go(mod_elem.find('gears'))
    
    # Forbidden and Required are complex and left as interface{} for now
    forbidden_elem = mod_elem.find('forbidden')
    required_elem = mod_elem.find('required')
    
    # Format the struct
    result = f'\t"{key_name}": {{\n'
    result += f'\t\tID: {escape_go_string(id_val)},\n'
    result += f'\t\tName: {escape_go_string(name_val)},\n'
    result += f'\t\tCategory: {escape_go_string(category_val)},\n'
    result += f'\t\tMaxRating: {escape_go_string(max_rating_val)},\n'
    result += f'\t\tArmorCapacity: {escape_go_string(armor_capacity_val)},\n'
    result += f'\t\tAvail: {escape_go_string(avail_val)},\n'
    result += f'\t\tCost: {escape_go_string(cost_val)},\n'
    result += f'\t\tSource: {escape_go_string(source_val)},\n'
    result += f'\t\tPage: {escape_go_string(page_val)},'
    
    if armor_val is not None:
        result += f'\n\t\tArmor: stringPtr({escape_go_string(armor_val)}),'
    
    if hide_val is not None:
        result += f'\n\t\tHide: stringPtr({escape_go_string(hide_val)}),'
    
    if ignore_source_disabled is not None:
        result += f'\n\t\tIgnoreSourceDisabled: stringPtr({escape_go_string(ignore_source_disabled)}),'
    
    if add_weapons:
        weapons_str = ',\n\t\t\t\t'.join(escape_go_string(weapon) for weapon in add_weapons)
        result += f'\n\t\tAddWeapon: []string{{\n\t\t\t\t{weapons_str},\n\t\t\t}},'
    
    if bonus != "nil":
        result += f'\n\t\tBonus: {bonus},'
    
    if wireless_bonus != "nil":
        result += f'\n\t\tWirelessBonus: {wireless_bonus},'
    
    if gears != "nil":
        result += f'\n\t\tGears: {gears},'
    
    if forbidden_elem is not None:
        result += f'\n\t\tForbidden: nil, // TODO: Parse forbidden element from conditions.xsd'
    
    if required_elem is not None:
        result += f'\n\t\tRequired: nil, // TODO: Parse required element from conditions.xsd'
    
    result += '\n\t}'
    return result

def generate_data_file():
    """Generate armor_data.go from armor.xml in batches to avoid overwhelming the IDE"""
    
    tree = ET.parse('data/chummerxml/armor.xml')
    root = tree.getroot()
    
    # Find chummer element
    chummer = root.find('.//chummer')
    if chummer is None:
        chummer = root
    
    BATCH_SIZE = 50  # Process and write in batches of 50 items
    
    with open('pkg/shadowrun/edition/v5/armor_data.go', 'w', encoding='utf-8') as f:
        # Write header
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        
        # Write categories header
        f.write('// DataCategories contains armor categories keyed by category name\n')
        f.write('var DataCategories = map[string]Category{\n')
        
        # Process categories in batches
        categories_elem = chummer.find('categories')
        if categories_elem is not None:
            seen_categories = set()
            batch = []
            for cat_elem in categories_elem.findall('category'):
                cat_name = (cat_elem.text or '').strip()
                if cat_name and cat_name not in seen_categories:
                    seen_categories.add(cat_name)
                    blackmarket = cat_elem.get('blackmarket', '')
                    batch.append(f'\t{escape_go_string(cat_name)}: {{\n')
                    batch.append(f'\t\tName: {escape_go_string(cat_name)},\n')
                    batch.append(f'\t\tBlackMarket: {escape_go_string(blackmarket)},\n')
                    batch.append('\t},\n')
                    
                    if len(batch) >= BATCH_SIZE * 4:  # 4 lines per category
                        f.write(''.join(batch))
                        f.flush()  # Force write to disk
                        batch = []
            
            if batch:
                f.write(''.join(batch))
        
        f.write('}\n\n')
        f.flush()
        
        # Write modcategories header
        f.write('// DataModCategories contains armor mod categories keyed by category name\n')
        f.write('var DataModCategories = map[string]Category{\n')
        
        # Process modcategories in batches
        modcategories_elem = chummer.find('modcategories')
        if modcategories_elem is not None:
            seen_modcategories = set()
            batch = []
            for cat_elem in modcategories_elem.findall('category'):
                cat_name = (cat_elem.text or '').strip()
                if cat_name and cat_name not in seen_modcategories:
                    seen_modcategories.add(cat_name)
                    blackmarket = cat_elem.get('blackmarket', '')
                    batch.append(f'\t{escape_go_string(cat_name)}: {{\n')
                    batch.append(f'\t\tName: {escape_go_string(cat_name)},\n')
                    batch.append(f'\t\tBlackMarket: {escape_go_string(blackmarket)},\n')
                    batch.append('\t},\n')
                    
                    if len(batch) >= BATCH_SIZE * 4:  # 4 lines per category
                        f.write(''.join(batch))
                        f.flush()
                        batch = []
            
            if batch:
                f.write(''.join(batch))
        
        f.write('}\n\n')
        f.flush()
        
        # Write armors header
        f.write('// DataArmors contains all armor entries keyed by armor ID\n')
        f.write('var DataArmors = map[string]Armor{\n')
        
        # Process armors in batches
        armors_elem = chummer.find('armors')
        if armors_elem is not None:
            armor_elems = armors_elem.findall('armor')
            total_armors = len(armor_elems)
            print(f"Processing {total_armors} armors in batches of {BATCH_SIZE}...")
            
            for i, armor_elem in enumerate(armor_elems):
                armor_id = armor_elem.findtext('id', '').strip()
                if armor_id:
                    armor_str = convert_armor_to_go(armor_elem, armor_id) + ',\n'
                    f.write(armor_str)
                    
                    # Flush every BATCH_SIZE items
                    if (i + 1) % BATCH_SIZE == 0:
                        f.flush()
                        print(f"  Processed {i + 1}/{total_armors} armors...")
        
        f.write('}\n\n')
        f.flush()
        
        # Write mods header
        f.write('// DataArmorMods contains all armor mod entries keyed by mod ID\n')
        f.write('var DataArmorMods = map[string]ArmorMod{\n')
        
        # Process mods in batches
        mods_elem = chummer.find('mods')
        if mods_elem is not None:
            mod_elems = mods_elem.findall('mod')
            total_mods = len(mod_elems)
            print(f"Processing {total_mods} mods in batches of {BATCH_SIZE}...")
            
            for i, mod_elem in enumerate(mod_elems):
                mod_id = mod_elem.findtext('id', '').strip()
                if mod_id:
                    mod_str = convert_armor_mod_to_go(mod_elem, mod_id) + ',\n'
                    f.write(mod_str)
                    
                    # Flush every BATCH_SIZE items
                    if (i + 1) % BATCH_SIZE == 0:
                        f.flush()
                        print(f"  Processed {i + 1}/{total_mods} mods...")
        
        f.write('}\n')
        f.flush()
    
    print("Generated armor_data.go")

def generate_test_file():
    """Generate armor_test.go with basic tests"""
    
    test_code = '''package v5

import "testing"

func TestDataArmors(t *testing.T) {
	if len(DataArmors) == 0 {
		t.Error("DataArmors should not be empty")
	}
	
	// Test that we can access a specific armor
	for id, armor := range DataArmors {
		if id == "" {
			t.Error("Armor ID should not be empty")
		}
		if armor.Name == "" {
			t.Errorf("Armor %s should have a name", id)
		}
		if armor.Category == "" {
			t.Errorf("Armor %s should have a category", id)
		}
		if armor.Armor == "" {
			t.Errorf("Armor %s should have an armor value", id)
		}
		if armor.ArmorCapacity == "" {
			t.Errorf("Armor %s should have an armor capacity", id)
		}
		if armor.Source == "" {
			t.Errorf("Armor %s should have a source", id)
		}
	}
}

func TestDataArmorMods(t *testing.T) {
	if len(DataArmorMods) == 0 {
		t.Error("DataArmorMods should not be empty")
	}
	
	// Test that we can access a specific mod
	for id, mod := range DataArmorMods {
		if id == "" {
			t.Error("Mod ID should not be empty")
		}
		if mod.Name == "" {
			t.Errorf("Mod %s should have a name", id)
		}
		if mod.Category == "" {
			t.Errorf("Mod %s should have a category", id)
		}
		if mod.MaxRating == "" {
			t.Errorf("Mod %s should have a max rating", id)
		}
		if mod.ArmorCapacity == "" {
			t.Errorf("Mod %s should have an armor capacity", id)
		}
		if mod.Source == "" {
			t.Errorf("Mod %s should have a source", id)
		}
	}
}

func TestDataCategories(t *testing.T) {
	if len(DataCategories) == 0 {
		t.Error("DataCategories should not be empty")
	}
}

func TestDataModCategories(t *testing.T) {
	if len(DataModCategories) == 0 {
		t.Error("DataModCategories should not be empty")
	}
}
'''
    
    with open('pkg/shadowrun/edition/v5/armor_test.go', 'w', encoding='utf-8') as f:
        f.write(test_code)
    print("Generated armor_test.go")

def main():
    print("Generating armor files from XML/XSD...")
    generate_structs_file()
    generate_data_file()
    generate_test_file()
    print("Done!")

if __name__ == '__main__':
    main()

