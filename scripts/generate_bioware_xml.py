#!/usr/bin/env python3
"""Generate bioware.go, bioware_data.go, and bioware_test.go from bioware.xml using XSD schema"""

import xml.etree.ElementTree as ET
import re

def escape_go_string(s):
    """Escape string for Go code"""
    if s is None:
        return '""'
    # Replace " with \" and handle newlines
    s = str(s).replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
    return f'"{s}"'

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

def generate_structs_file():
    """Generate bioware.go with struct definitions based on XSD"""
    
    structs_code = '''package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// Note: Chummer root element is defined in books.go (shared across XML files)

// Grade represents a bioware grade (Standard, Used, Alphaware, etc.)
// XSD: grade element with required and optional fields
type Grade struct {
	// Required fields (minOccurs="1")
	ID string `xml:"id" json:"id"` // Unique identifier (UUID) - XSD: xs:string, minOccurs="1"

	// Optional fields (minOccurs="0")
	Name         *string `xml:"name,omitempty" json:"name,omitempty"`                 // Grade name - XSD: xs:string, minOccurs="0"
	Hide         *string `xml:"hide,omitempty" json:"hide,omitempty"`                 // Hide flag - XSD: xs:string, minOccurs="0"
	IgnoreSourceDisabled *string `xml:"ignoresourcedisabled,omitempty" json:"ignoresourcedisabled,omitempty"` // Ignore source disabled - XSD: xs:string, minOccurs="0"
	Ess          *string `xml:"ess,omitempty" json:"ess,omitempty"`                   // Essence multiplier - XSD: xs:string, minOccurs="0"
	Cost         *string `xml:"cost,omitempty" json:"cost,omitempty"`                 // Cost multiplier - XSD: xs:string, minOccurs="0"
	DeviceRating *int    `xml:"devicerating,omitempty" json:"devicerating,omitempty"` // Device rating - XSD: xs:integer, minOccurs="0"
	Avail        *string `xml:"avail,omitempty" json:"avail,omitempty"`               // Availability modifier - XSD: xs:string, minOccurs="0"
	Source       *string `xml:"source,omitempty" json:"source,omitempty"`             // Source book - XSD: xs:string, minOccurs="0"
	Page         *string `xml:"page,omitempty" json:"page,omitempty"`                 // Page number - XSD: xs:string, minOccurs="0"
}

// BiowareCategory represents a bioware category with its black market classification
// XSD: category element with blackmarket attribute (xs:string, optional) and text content (xs:string)
type BiowareCategory struct {
	Name        string `xml:",chardata" json:"name"`         // Category name
	BlackMarket string `xml:"blackmarket,attr,omitempty" json:"black_market"` // Black market classification
}

// BiowareBonus represents bonuses provided by bioware
// XSD: bonus element of type bonusTypes (from bonuses.xsd)
// This embeds BaseBonus which contains all common bonus fields
type BiowareBonus struct {
	common.BaseBonus
}

// BannedGrades represents banned grades for bioware
// XSD: bannedgrades element containing grade elements (minOccurs="0", maxOccurs="unbounded")
type BannedGrades struct {
	Grade []string `xml:"grade,omitempty" json:"grade,omitempty"` // Banned grade names - XSD: minOccurs="0", maxOccurs="unbounded"
}

// AllowSubsystems represents allowed subsystem categories
// XSD: allowsubsystems element containing category elements (minOccurs="0", maxOccurs="unbounded")
type AllowSubsystems struct {
	Category []string `xml:"category,omitempty" json:"category,omitempty"` // Allowed subsystem categories - XSD: minOccurs="0", maxOccurs="unbounded"
}

// PairInclude represents items that pair with this bioware
// XSD: includepair element containing name elements (minOccurs="0", maxOccurs="unbounded")
type PairInclude struct {
	Name []string `xml:"name,omitempty" json:"name,omitempty"` // Item names that pair with this - XSD: minOccurs="0", maxOccurs="unbounded"
}

// BiowareRequired represents requirements for bioware
// XSD: required element from conditions.xsd (complex, using interface{} for now)
type BiowareRequired struct {
	OneOf *BiowareRequiredOneOf `json:"oneof,omitempty"`
	AllOf *BiowareRequiredAllOf `json:"allof,omitempty"`
}

// BiowareRequiredOneOf represents a one-of requirement
type BiowareRequiredOneOf struct {
	Cyberware string      `json:"cyberware,omitempty"` // Required cyberware
	Bioware   interface{} `json:"bioware,omitempty"`   // Can be string or []string
	Metatype  string      `json:"metatype,omitempty"`  // Required metatype
	Quality   string      `json:"quality,omitempty"`   // Required quality
}

// BiowareRequiredAllOf represents an all-of requirement
type BiowareRequiredAllOf struct {
	Metatype string `json:"metatype,omitempty"` // Required metatype
}

// Bioware represents a piece of bioware from Shadowrun 5th Edition
// XSD: bioware element with required and optional fields
type Bioware struct {
	// Required fields (minOccurs="1")
	ID       string `xml:"id" json:"id"`             // Unique identifier (UUID) - XSD: xs:string, minOccurs="1"
	Name     string `xml:"name" json:"name"`         // Bioware name - XSD: xs:string, minOccurs="1"
	Category string `xml:"category" json:"category"` // Category - XSD: xs:string, minOccurs="1"
	Ess      string `xml:"ess" json:"ess"`           // Essence cost - XSD: xs:string, minOccurs="1"
	Capacity string `xml:"capacity" json:"capacity"` // Capacity cost - XSD: xs:string, minOccurs="1"
	Avail    string `xml:"avail" json:"avail"`       // Availability - XSD: xs:string, minOccurs="1"
	Cost     string `xml:"cost" json:"cost"`         // Cost - XSD: xs:string, minOccurs="1"
	RequireParent string `xml:"requireparent" json:"requireparent"` // Require parent - XSD: xs:string, minOccurs="1"
	Source   string `xml:"source" json:"source"`     // Source book - XSD: xs:string, minOccurs="1"
	Page     string `xml:"page" json:"page"`         // Page number - XSD: xs:string, minOccurs="1"

	// Optional fields (minOccurs="0")
	Limit              *string            `xml:"limit,omitempty" json:"limit,omitempty"`                           // Limit - XSD: xs:string, minOccurs="0"
	Hide               *string            `xml:"hide,omitempty" json:"hide,omitempty"`                             // Hide flag - XSD: xs:string, minOccurs="0"
	IgnoreSourceDisabled *string          `xml:"ignoresourcedisabled,omitempty" json:"ignoresourcedisabled,omitempty"` // Ignore source disabled - XSD: xs:string, minOccurs="0"
	MountsTo           *string            `xml:"mountsto,omitempty" json:"mountsto,omitempty"`                     // Mounts to - XSD: xs:string, minOccurs="0"
	ModularMount       *string            `xml:"modularmount,omitempty" json:"modularmount,omitempty"`             // Modular mount - XSD: xs:string, minOccurs="0"
	BlocksMounts       *string            `xml:"blocksmounts,omitempty" json:"blocksmounts,omitempty"`             // Blocks mounts - XSD: xs:string, minOccurs="0"
	AddToParentCapacity *string           `xml:"addtoparentcapacity,omitempty" json:"addtoparentcapacity,omitempty"` // Add to parent capacity - XSD: xs:string, minOccurs="0"
	AddToParentEss     *string            `xml:"addtoparentess,omitempty" json:"addtoparentess,omitempty"`          // Add to parent essence - XSD: xs:string, minOccurs="0"
	Rating             *string            `xml:"rating,omitempty" json:"rating,omitempty"`                         // Rating - XSD: xs:string, minOccurs="0"
	ForceGrade         *string            `xml:"forcegrade,omitempty" json:"forcegrade,omitempty"`                 // Force grade - XSD: xs:string, minOccurs="0"
	Notes              *string            `xml:"notes,omitempty" json:"notes,omitempty"`                           // Notes - XSD: xs:string, minOccurs="0"
	AddWeapon          []string           `xml:"addweapon,omitempty" json:"addweapon,omitempty"`                   // Add weapon - XSD: xs:string, minOccurs="0", maxOccurs="unbounded"
	Bonus              *BiowareBonus      `xml:"bonus,omitempty" json:"bonus,omitempty"`                           // Bonus - XSD: bonusTypes, minOccurs="0"
	Forbidden          *common.Forbidden  `xml:"forbidden,omitempty" json:"forbidden,omitempty"`                   // Forbidden - XSD: forbidden element from conditions.xsd
	BannedGrades       *BannedGrades      `xml:"bannedgrades,omitempty" json:"bannedgrades,omitempty"`             // Banned grades - XSD: minOccurs="0"
	Required           *BiowareRequired   `xml:"required,omitempty" json:"required,omitempty"`                     // Required - XSD: required element from conditions.xsd
	AllowGear          *common.AllowGear  `xml:"allowgear,omitempty" json:"allowgear,omitempty"`                   // Allow gear - XSD: from gear.xsd
	AllowSubsystems    *AllowSubsystems   `xml:"allowsubsystems,omitempty" json:"allowsubsystems,omitempty"`       // Allow subsystems - XSD: minOccurs="0"
	PairInclude        *PairInclude       `xml:"includepair,omitempty" json:"pairinclude,omitempty"`               // Pair include - XSD: minOccurs="0"
	PairBonus          *common.PairBonus  `xml:"pairbonus,omitempty" json:"pairbonus,omitempty"`                   // Pair bonus - XSD: from bonuses.xsd
	Subsystems         interface{}        `xml:"subsystems,omitempty" json:"subsystems,omitempty"`                 // Subsystems - XSD: subsystems element (complex, TODO: type properly)
}

// Note: stringPtr and intPtr helper functions are defined in lifestyles_data.go (shared across XML-generated files)
'''
    
    with open('pkg/shadowrun/edition/v5/bioware.go', 'w', encoding='utf-8') as f:
        f.write(structs_code)
    print("Generated bioware.go")

def convert_specific_skill_to_go(ss_elem):
    """Convert specificskill element to Go struct literal"""
    name = ss_elem.findtext('name', '')
    bonus = ss_elem.findtext('bonus', '')
    
    # Bonus can be int or string, try to parse as int first
    try:
        bonus_int = int(bonus)
        bonus_str = str(bonus_int)
    except ValueError:
        bonus_str = escape_go_string(bonus)
    
    return f'common.SpecificSkillBonus{{\n\t\t\t\t\t\tName: {escape_go_string(name)}, Bonus: {bonus_str},\n\t\t\t\t\t}}'

def convert_limit_modifier_to_go(lm_elem):
    """Convert limitmodifier element to Go struct literal"""
    limit = lm_elem.findtext('limit', '')
    value = lm_elem.findtext('value', '')
    condition = lm_elem.findtext('condition', '')
    
    return f'common.LimitModifier{{\n\t\t\t\t\t\tLimit: {escape_go_string(limit)}, Value: {escape_go_string(value)}, Condition: {escape_go_string(condition)},\n\t\t\t\t\t}}'

def convert_specific_attribute_to_go(sa_elem):
    """Convert specificattribute element to Go struct literal"""
    name = sa_elem.findtext('name', '')
    val = sa_elem.findtext('val', '')
    max_val = sa_elem.findtext('max', '')
    
    parts = [f'Name: {escape_go_string(name)}', f'Val: {escape_go_string(val)}']
    if max_val:
        parts.append(f'Max: {escape_go_string(max_val)}')
    
    return f'&common.SpecificAttributeBonus{{\n\t\t\t\t\t\t{", ".join(parts)},\n\t\t\t\t\t}}'

def convert_condition_monitor_to_go(cm_elem):
    """Convert conditionmonitor element to Go struct literal"""
    shared_threshold = cm_elem.findtext('sharedthresholdoffset', '')
    threshold = cm_elem.findtext('thresholdoffset', '')
    
    parts = []
    if shared_threshold:
        parts.append(f'SharedThresholdOffset: {escape_go_string(shared_threshold)}')
    if threshold:
        parts.append(f'ThresholdOffset: {escape_go_string(threshold)}')
    
    if not parts:
        return "nil"
    
    return f'&common.ConditionMonitorBonus{{\n\t\t\t\t{", ".join(parts)},\n\t\t\t}}'

def convert_bonus_to_go(bonus_elem):
    """Convert bonus element to Go struct literal"""
    if bonus_elem is None:
        return "nil"
    
    parts = []
    
    # Limit modifiers
    lm_elems = bonus_elem.findall('limitmodifier')
    if lm_elems:
        lm_strs = [convert_limit_modifier_to_go(lm) for lm in lm_elems]
        parts.append(f'LimitModifier: []common.LimitModifier{{\n\t\t\t\t\t{",\n\t\t\t\t\t".join(lm_strs)},\n\t\t\t\t}}')
    
    # Skill categories
    sc_elems = bonus_elem.findall('skillcategory')
    if sc_elems:
        sc_strs = []
        for sc in sc_elems:
            name = sc.findtext('name', '')
            bonus_val = sc.findtext('bonus', '')
            try:
                bonus_int = int(bonus_val)
                sc_strs.append(f'common.SkillCategoryBonus{{\n\t\t\t\t\tName: {escape_go_string(name)}, Bonus: {bonus_int},\n\t\t\t\t}}')
            except ValueError:
                # If not an int, use string (though SkillCategoryBonus.Bonus is int, so this might be an error)
                sc_strs.append(f'common.SkillCategoryBonus{{\n\t\t\t\t\tName: {escape_go_string(name)}, Bonus: 0, // TODO: Parse "{bonus_val}"\n\t\t\t\t}}')
        parts.append(f'SkillCategory: []common.SkillCategoryBonus{{\n\t\t\t\t\t{",\n\t\t\t\t\t".join(sc_strs)},\n\t\t\t\t}}')
    
    # Specific skills
    ss_elems = bonus_elem.findall('specificskill')
    if ss_elems:
        ss_strs = [convert_specific_skill_to_go(ss) for ss in ss_elems]
        parts.append(f'SpecificSkill: []common.SpecificSkillBonus{{\n\t\t\t\t\t\t{",\n\t\t\t\t\t\t".join(ss_strs)},\n\t\t\t\t\t}}')
    
    # Specific attributes
    sa_elems = bonus_elem.findall('specificattribute')
    if sa_elems:
        sa_strs = [convert_specific_attribute_to_go(sa) for sa in sa_elems]
        parts.append(f'SpecificAttribute: []*common.SpecificAttributeBonus{{\n\t\t\t\t\t\t{",\n\t\t\t\t\t\t".join(sa_strs)},\n\t\t\t\t\t}}')
    
    # Condition monitor
    cm_elem = bonus_elem.find('conditionmonitor')
    if cm_elem is not None:
        cm_str = convert_condition_monitor_to_go(cm_elem)
        if cm_str != "nil":
            parts.append(f'ConditionMonitor: {cm_str}')
    
    # Simple string fields
    for field_name, xml_name in [
        ('PhysicalLimit', 'physicallimit'),
        ('MentalLimit', 'mentallimit'),
        ('SocialLimit', 'sociallimit'),
        ('DamageResistance', 'damageresistance'),
        ('UnarmedDV', 'unarmeddv'),
        ('UnarmedReach', 'unarmedreach'),
    ]:
        val = bonus_elem.findtext(xml_name)
        if val is not None and val.strip() != '':
            parts.append(f'{field_name}: {escape_go_string(val)}')
    
    # Boolean fields (check if element exists)
    # Note: UnarmedDVPhysical is *bool in BaseBonus
    if bonus_elem.find('unarmeddvphysical') is not None:
        parts.append('UnarmedDVPhysical: boolPtr(true)')
    
    if not parts:
        return "nil"
    
    return f"&BiowareBonus{{\n\t\t\tBaseBonus: common.BaseBonus{{\n\t\t\t\t{',\n\t\t\t\t'.join(parts)},\n\t\t\t}},\n\t\t}}"

def convert_forbidden_to_go(forbidden_elem):
    """Convert forbidden element to Go struct literal"""
    if forbidden_elem is None:
        return "nil"
    
    oneof_elem = forbidden_elem.find('oneof')
    if oneof_elem is None:
        return "nil"
    
    parts = []
    cyberware_elems = oneof_elem.findall('cyberware')
    bioware_elems = oneof_elem.findall('bioware')
    quality_elems = oneof_elem.findall('quality')
    
    if cyberware_elems or bioware_elems or quality_elems:
        oneof_parts = []
        if cyberware_elems:
            if len(cyberware_elems) == 1:
                oneof_parts.append(f'Cyberware: {escape_go_string(cyberware_elems[0].text or "")}')
            else:
                cyberware_list = ',\n\t\t\t\t\t\t'.join(escape_go_string(c.text or '') for c in cyberware_elems)
                oneof_parts.append(f'Cyberware: []string{{\n\t\t\t\t\t\t{cyberware_list},\n\t\t\t\t\t}}')
        if bioware_elems:
            if len(bioware_elems) == 1:
                oneof_parts.append(f'Bioware: {escape_go_string(bioware_elems[0].text or "")}')
            else:
                bioware_list = ',\n\t\t\t\t\t\t'.join(escape_go_string(b.text or '') for b in bioware_elems)
                oneof_parts.append(f'Bioware: []string{{\n\t\t\t\t\t\t{bioware_list},\n\t\t\t\t\t}}')
        if quality_elems:
            if len(quality_elems) == 1:
                oneof_parts.append(f'Quality: {escape_go_string(quality_elems[0].text or "")}')
            else:
                quality_list = ',\n\t\t\t\t\t\t'.join(escape_go_string(q.text or '') for q in quality_elems)
                oneof_parts.append(f'Quality: []string{{\n\t\t\t\t\t\t{quality_list},\n\t\t\t\t\t}}')
        
        parts.append(f'OneOf: &common.ForbiddenOneOf{{\n\t\t\t\t\t{", ".join(oneof_parts)},\n\t\t\t\t}}')
    
    if not parts:
        return "nil"
    
    return f"&common.Forbidden{{\n\t\t\t\t{', '.join(parts)},\n\t\t\t}}"

def convert_banned_grades_to_go(banned_grades_elem):
    """Convert bannedgrades element to Go struct literal"""
    if banned_grades_elem is None:
        return "nil"
    
    grade_elems = banned_grades_elem.findall('grade')
    if not grade_elems:
        return "nil"
    
    grades = [escape_go_string(grade.text or '') for grade in grade_elems]
    grades_str = ',\n\t\t\t\t\t'.join(grades)
    
    return f"&BannedGrades{{\n\t\t\t\t\tGrade: []string{{\n\t\t\t\t\t\t{grades_str},\n\t\t\t\t\t}},\n\t\t\t\t}}"

def convert_allow_subsystems_to_go(allow_subsystems_elem):
    """Convert allowsubsystems element to Go struct literal"""
    if allow_subsystems_elem is None:
        return "nil"
    
    category_elems = allow_subsystems_elem.findall('category')
    if not category_elems:
        return "nil"
    
    categories = [escape_go_string(cat.text or '') for cat in category_elems]
    categories_str = ',\n\t\t\t\t\t'.join(categories)
    
    return f"&AllowSubsystems{{\n\t\t\t\t\tCategory: []string{{\n\t\t\t\t\t\t{categories_str},\n\t\t\t\t\t}},\n\t\t\t\t}}"

def convert_pair_include_to_go(pair_include_elem):
    """Convert includepair element to Go struct literal"""
    if pair_include_elem is None:
        return "nil"
    
    name_elems = pair_include_elem.findall('name')
    if not name_elems:
        return "nil"
    
    names = [escape_go_string(name.text or '') for name in name_elems]
    names_str = ',\n\t\t\t\t\t'.join(names)
    
    return f"&PairInclude{{\n\t\t\t\t\tName: []string{{\n\t\t\t\t\t\t{names_str},\n\t\t\t\t\t}},\n\t\t\t\t}}"

def convert_required_to_go(required_elem):
    """Convert required element to Go struct literal"""
    if required_elem is None:
        return None
    
    # For now, return None since it's complex
    return None

def convert_bioware_to_go(bioware_elem, key_name):
    """Convert an XML bioware element to Go struct literal"""
    # Required fields
    id_val = bioware_elem.findtext('id', '')
    name_val = bioware_elem.findtext('name', '')
    category_val = bioware_elem.findtext('category', '')
    ess_val = bioware_elem.findtext('ess', '')
    capacity_val = bioware_elem.findtext('capacity', '')
    avail_val = bioware_elem.findtext('avail', '')
    cost_val = bioware_elem.findtext('cost', '')
    require_parent_val = bioware_elem.findtext('requireparent', '')
    source_val = bioware_elem.findtext('source', '')
    page_val = bioware_elem.findtext('page', '')
    
    # Optional fields
    limit = parse_string_or_none(bioware_elem.findtext('limit'))
    hide_elem = bioware_elem.find('hide')
    hide_val = None
    if hide_elem is not None:
        hide_val = ""
    
    ignore_source_disabled = parse_string_or_none(bioware_elem.findtext('ignoresourcedisabled'))
    mounts_to = parse_string_or_none(bioware_elem.findtext('mountsto'))
    modular_mount = parse_string_or_none(bioware_elem.findtext('modularmount'))
    blocks_mounts = parse_string_or_none(bioware_elem.findtext('blocksmounts'))
    add_to_parent_capacity = parse_string_or_none(bioware_elem.findtext('addtoparentcapacity'))
    add_to_parent_ess = parse_string_or_none(bioware_elem.findtext('addtoparentess'))
    rating = parse_string_or_none(bioware_elem.findtext('rating'))
    force_grade = parse_string_or_none(bioware_elem.findtext('forcegrade'))
    notes = parse_string_or_none(bioware_elem.findtext('notes'))
    
    # Multiple occurrence fields
    add_weapons = [weapon.text or '' for weapon in bioware_elem.findall('addweapon')]
    
    # Complex fields
    bonus = convert_bonus_to_go(bioware_elem.find('bonus'))
    forbidden = convert_forbidden_to_go(bioware_elem.find('forbidden'))
    banned_grades = convert_banned_grades_to_go(bioware_elem.find('bannedgrades'))
    required = convert_required_to_go(bioware_elem.find('required'))
    allow_subsystems = convert_allow_subsystems_to_go(bioware_elem.find('allowsubsystems'))
    pair_include = convert_pair_include_to_go(bioware_elem.find('includepair'))
    
    # AllowGear and PairBonus are complex and left as nil for now
    allow_gear_elem = bioware_elem.find('allowgear')
    pair_bonus_elem = bioware_elem.find('pairbonus')
    subsystems_elem = bioware_elem.find('subsystems')
    
    # Format the struct
    result = f'\t"{key_name}": {{\n'
    result += f'\t\tID: {escape_go_string(id_val)},\n'
    result += f'\t\tName: {escape_go_string(name_val)},\n'
    result += f'\t\tCategory: {escape_go_string(category_val)},\n'
    result += f'\t\tEss: {escape_go_string(ess_val)},\n'
    result += f'\t\tCapacity: {escape_go_string(capacity_val)},\n'
    result += f'\t\tAvail: {escape_go_string(avail_val)},\n'
    result += f'\t\tCost: {escape_go_string(cost_val)},\n'
    result += f'\t\tRequireParent: {escape_go_string(require_parent_val)},\n'
    result += f'\t\tSource: {escape_go_string(source_val)},\n'
    result += f'\t\tPage: {escape_go_string(page_val)},'
    
    if limit is not None:
        result += f'\n\t\tLimit: stringPtr({escape_go_string(limit)}),'
    
    if hide_val is not None:
        result += f'\n\t\tHide: stringPtr({escape_go_string(hide_val)}),'
    
    if ignore_source_disabled is not None:
        result += f'\n\t\tIgnoreSourceDisabled: stringPtr({escape_go_string(ignore_source_disabled)}),'
    
    if mounts_to is not None:
        result += f'\n\t\tMountsTo: stringPtr({escape_go_string(mounts_to)}),'
    
    if modular_mount is not None:
        result += f'\n\t\tModularMount: stringPtr({escape_go_string(modular_mount)}),'
    
    if blocks_mounts is not None:
        result += f'\n\t\tBlocksMounts: stringPtr({escape_go_string(blocks_mounts)}),'
    
    if add_to_parent_capacity is not None:
        result += f'\n\t\tAddToParentCapacity: stringPtr({escape_go_string(add_to_parent_capacity)}),'
    
    if add_to_parent_ess is not None:
        result += f'\n\t\tAddToParentEss: stringPtr({escape_go_string(add_to_parent_ess)}),'
    
    if rating is not None:
        result += f'\n\t\tRating: stringPtr({escape_go_string(rating)}),'
    
    if force_grade is not None:
        result += f'\n\t\tForceGrade: stringPtr({escape_go_string(force_grade)}),'
    
    if notes is not None:
        result += f'\n\t\tNotes: stringPtr({escape_go_string(notes)}),'
    
    if add_weapons:
        weapons_str = ',\n\t\t\t\t'.join(escape_go_string(weapon) for weapon in add_weapons)
        result += f'\n\t\tAddWeapon: []string{{\n\t\t\t\t{weapons_str},\n\t\t\t}},'
    
    if bonus != "nil":
        result += f'\n\t\tBonus: {bonus},'
    
    if forbidden != "nil":
        result += f'\n\t\tForbidden: {forbidden},'
    
    if banned_grades != "nil":
        result += f'\n\t\tBannedGrades: {banned_grades},'
    
    if required is not None:
        result += f'\n\t\tRequired: nil, // TODO: Parse required element from conditions.xsd'
    
    if allow_subsystems != "nil":
        result += f'\n\t\tAllowSubsystems: {allow_subsystems},'
    
    if pair_include != "nil":
        result += f'\n\t\tPairInclude: {pair_include},'
    
    if allow_gear_elem is not None:
        result += f'\n\t\tAllowGear: nil, // TODO: Parse allowgear element from gear.xsd'
    
    if pair_bonus_elem is not None:
        result += f'\n\t\tPairBonus: nil, // TODO: Parse pairbonus element from bonuses.xsd'
    
    if subsystems_elem is not None:
        result += f'\n\t\tSubsystems: nil, // TODO: Parse subsystems element'
    
    result += '\n\t}'
    return result

def generate_data_file():
    """Generate bioware_data.go from bioware.xml in batches to avoid overwhelming the IDE"""
    
    tree = ET.parse('data/chummerxml/bioware.xml')
    root = tree.getroot()
    
    # Find chummer element
    chummer = root.find('.//chummer')
    if chummer is None:
        chummer = root
    
    BATCH_SIZE = 50  # Process and write in batches of 50 items
    
    with open('pkg/shadowrun/edition/v5/bioware_data.go', 'w', encoding='utf-8') as f:
        # Write header
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// Helper function for bool pointers\n')
        f.write('func boolPtr(b bool) *bool { return &b }\n\n')
        
        # Write grades header
        f.write('// DataGrades contains bioware grades keyed by grade ID\n')
        f.write('var DataGrades = map[string]Grade{\n')
        
        # Process grades in batches
        grades_elem = chummer.find('grades')
        if grades_elem is not None:
            grade_elems = grades_elem.findall('grade')
            total_grades = len(grade_elems)
            print(f"Processing {total_grades} grades in batches of {BATCH_SIZE}...")
            
            for i, grade_elem in enumerate(grade_elems):
                grade_id = grade_elem.findtext('id', '').strip()
                if grade_id:
                    grade_str = convert_grade_to_go(grade_elem, grade_id) + ',\n'
                    f.write(grade_str)
                    
                    if (i + 1) % BATCH_SIZE == 0:
                        f.flush()
                        print(f"  Processed {i + 1}/{total_grades} grades...")
        
        f.write('}\n\n')
        f.flush()
        
        # Write categories header
        f.write('// DataBiowareCategories contains bioware categories keyed by category name\n')
        f.write('var DataBiowareCategories = map[string]BiowareCategory{\n')
        
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
                    
                    if len(batch) >= BATCH_SIZE * 4:
                        f.write(''.join(batch))
                        f.flush()
                        batch = []
            
            if batch:
                f.write(''.join(batch))
        
        f.write('}\n\n')
        f.flush()
        
        # Write biowares header
        f.write('// DataBiowares contains all bioware entries keyed by bioware ID\n')
        f.write('var DataBiowares = map[string]Bioware{\n')
        
        # Process biowares in batches
        biowares_elem = chummer.find('biowares')
        if biowares_elem is not None:
            bioware_elems = biowares_elem.findall('bioware')
            total_biowares = len(bioware_elems)
            print(f"Processing {total_biowares} biowares in batches of {BATCH_SIZE}...")
            
            for i, bioware_elem in enumerate(bioware_elems):
                bioware_id = bioware_elem.findtext('id', '').strip()
                if bioware_id:
                    bioware_str = convert_bioware_to_go(bioware_elem, bioware_id) + ',\n'
                    f.write(bioware_str)
                    
                    if (i + 1) % BATCH_SIZE == 0:
                        f.flush()
                        print(f"  Processed {i + 1}/{total_biowares} biowares...")
        
        f.write('}\n')
        f.flush()
    
    print("Generated bioware_data.go")

def convert_grade_to_go(grade_elem, key_name):
    """Convert an XML grade element to Go struct literal"""
    # Required fields
    id_val = grade_elem.findtext('id', '')
    
    # Optional fields
    name = parse_string_or_none(grade_elem.findtext('name'))
    hide_elem = grade_elem.find('hide')
    hide_val = None
    if hide_elem is not None:
        hide_val = ""
    
    ignore_source_disabled = parse_string_or_none(grade_elem.findtext('ignoresourcedisabled'))
    ess = parse_string_or_none(grade_elem.findtext('ess'))
    cost = parse_string_or_none(grade_elem.findtext('cost'))
    device_rating = parse_int_or_none(grade_elem.findtext('devicerating'))
    avail = parse_string_or_none(grade_elem.findtext('avail'))
    source = parse_string_or_none(grade_elem.findtext('source'))
    page = parse_string_or_none(grade_elem.findtext('page'))
    
    # Format the struct
    result = f'\t"{key_name}": {{\n'
    result += f'\t\tID: {escape_go_string(id_val)},'
    
    if name is not None:
        result += f'\n\t\tName: stringPtr({escape_go_string(name)}),'
    
    if hide_val is not None:
        result += f'\n\t\tHide: stringPtr({escape_go_string(hide_val)}),'
    
    if ignore_source_disabled is not None:
        result += f'\n\t\tIgnoreSourceDisabled: stringPtr({escape_go_string(ignore_source_disabled)}),'
    
    if ess is not None:
        result += f'\n\t\tEss: stringPtr({escape_go_string(ess)}),'
    
    if cost is not None:
        result += f'\n\t\tCost: stringPtr({escape_go_string(cost)}),'
    
    if device_rating is not None:
        result += f'\n\t\tDeviceRating: intPtr({device_rating}),'
    
    if avail is not None:
        result += f'\n\t\tAvail: stringPtr({escape_go_string(avail)}),'
    
    if source is not None:
        result += f'\n\t\tSource: stringPtr({escape_go_string(source)}),'
    
    if page is not None:
        result += f'\n\t\tPage: stringPtr({escape_go_string(page)}),'
    
    result += '\n\t}'
    return result

def generate_test_file():
    """Generate bioware_test.go with basic tests"""
    
    test_code = '''package v5

import "testing"

func TestDataBiowares(t *testing.T) {
	if len(DataBiowares) == 0 {
		t.Error("DataBiowares should not be empty")
	}
	
	// Test that we can access a specific bioware
	for id, bioware := range DataBiowares {
		if id == "" {
			t.Error("Bioware ID should not be empty")
		}
		if bioware.Name == "" {
			t.Errorf("Bioware %s should have a name", id)
		}
		if bioware.Category == "" {
			t.Errorf("Bioware %s should have a category", id)
		}
		if bioware.Ess == "" {
			t.Errorf("Bioware %s should have an essence cost", id)
		}
		if bioware.Capacity == "" {
			t.Errorf("Bioware %s should have a capacity", id)
		}
		if bioware.Source == "" {
			t.Errorf("Bioware %s should have a source", id)
		}
	}
}

func TestDataGrades(t *testing.T) {
	if len(DataGrades) == 0 {
		t.Error("DataGrades should not be empty")
	}
}

func TestDataBiowareCategories(t *testing.T) {
	if len(DataBiowareCategories) == 0 {
		t.Error("DataBiowareCategories should not be empty")
	}
}
'''
    
    with open('pkg/shadowrun/edition/v5/bioware_test.go', 'w', encoding='utf-8') as f:
        f.write(test_code)
    print("Generated bioware_test.go")

def main():
    print("Generating bioware files from XML/XSD...")
    generate_structs_file()
    generate_data_file()
    generate_test_file()
    print("Done!")

if __name__ == '__main__':
    main()

