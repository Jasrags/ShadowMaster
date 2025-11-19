#!/usr/bin/env python3
"""Generate priorities_data.go from priorities.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    # Replace spaces and special chars with underscores
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_metavariant_to_go(mv):
    """Convert a metavariant to Go struct literal"""
    return f'PriorityMetavariant{{Name: {json.dumps(mv["name"])}, Value: {json.dumps(mv["value"])}, Karma: {json.dumps(mv["karma"])}}}'

def convert_metavariants_to_go(metavariants):
    """Convert metavariants to Go struct literal"""
    if not metavariants or "metavariant" not in metavariants:
        return "nil"
    
    mv = metavariants["metavariant"]
    if mv is None:
        return "nil"
    
    if isinstance(mv, list):
        if len(mv) == 0:
            return "nil"
        mv_strs = [convert_metavariant_to_go(m) for m in mv]
        mv_list = ', '.join(mv_strs)
        return f"&PriorityMetavariants{{Metavariant: []interface{{}}{{{mv_list}}}}}"
    elif isinstance(mv, dict):
        mv_str = convert_metavariant_to_go(mv)
        return f"&PriorityMetavariants{{Metavariant: interface{{}}({mv_str})}}"
    
    return "nil"

def convert_metatype_to_go(mt):
    """Convert a metatype to Go struct literal"""
    parts = [
        f'Name: {json.dumps(mt["name"])}',
        f'Value: {json.dumps(mt["value"])}',
        f'Karma: {json.dumps(mt["karma"])}',
    ]
    
    if "metavariants" in mt and mt["metavariants"]:
        mv_str = convert_metavariants_to_go(mt["metavariants"])
        if mv_str != "nil":
            parts.append(f"Metavariants: {mv_str}")
    
    return "PriorityMetatype{" + ", ".join(parts) + "}"

def convert_metatypes_to_go(metatypes):
    """Convert metatypes to Go struct literal"""
    if not metatypes or "metatype" not in metatypes:
        return "nil"
    
    mt = metatypes["metatype"]
    if mt is None:
        return "nil"
    
    if isinstance(mt, list):
        if len(mt) == 0:
            return "nil"
        mt_strs = [convert_metatype_to_go(m) for m in mt]
        mt_list = ', '.join(mt_strs)
        return f"&PriorityMetatypes{{Metatype: []interface{{}}{{{mt_list}}}}}"
    elif isinstance(mt, dict):
        mt_str = convert_metatype_to_go(mt)
        return f"&PriorityMetatypes{{Metatype: interface{{}}({mt_str})}}"
    
    return "nil"

def convert_talent_forbidden_to_go(forbidden):
    """Convert forbidden to Go struct literal"""
    if not forbidden:
        return "nil"
    # TODO: Handle complex forbidden structures
    return "&TalentForbidden{OneOf: nil}"  # Simplified for now

def convert_talent_qualities_to_go(qualities):
    """Convert qualities to Go struct literal"""
    if not qualities:
        return "nil"
    # TODO: Handle complex quality structures
    return "&TalentQualities{Quality: nil}"  # Simplified for now

def convert_talent_to_go(talent):
    """Convert a talent to Go struct literal"""
    parts = [
        f'Name: {json.dumps(talent["name"])}',
        f'Value: {json.dumps(talent["value"])}',
    ]
    
    if "qualities" in talent and talent["qualities"]:
        qual_str = convert_talent_qualities_to_go(talent["qualities"])
        if qual_str != "nil":
            parts.append(f"Qualities: {qual_str}")
    
    if "magic" in talent:
        parts.append(f'Magic: {json.dumps(talent["magic"])}')
    if "spells" in talent:
        parts.append(f'Spells: {json.dumps(talent["spells"])}')
    if "skillqty" in talent:
        parts.append(f'SkillQty: {json.dumps(talent["skillqty"])}')
    if "skillval" in talent:
        parts.append(f'SkillVal: {json.dumps(talent["skillval"])}')
    if "skilltype" in talent:
        skilltype = talent["skilltype"]
        if isinstance(skilltype, dict):
            # Complex object - set to nil for now
            parts.append("SkillType: nil")  # TODO: Handle complex skilltype
        else:
            parts.append(f'SkillType: {json.dumps(skilltype)}')
    if "forbidden" in talent and talent["forbidden"]:
        forb_str = convert_talent_forbidden_to_go(talent["forbidden"])
        if forb_str != "nil":
            parts.append(f"Forbidden: {forb_str}")
    
    return "PriorityTalent{" + ", ".join(parts) + "}"

def convert_talents_to_go(talents):
    """Convert talents to Go struct literal"""
    if not talents or "talent" not in talents:
        return "nil"
    
    t = talents["talent"]
    if t is None:
        return "nil"
    
    if isinstance(t, list):
        if len(t) == 0:
            return "nil"
        t_strs = [convert_talent_to_go(talent) for talent in t]
        t_list = ', '.join(t_strs)
        return f"&PriorityTalents{{Talent: []interface{{}}{{{t_list}}}}}"
    elif isinstance(t, dict):
        t_str = convert_talent_to_go(t)
        return f"&PriorityTalents{{Talent: interface{{}}({t_str})}}"
    
    return "nil"

def convert_priority_to_go(priority, priority_id):
    """Convert a priority object to Go struct literal"""
    priority_id_str = priority["id"]
    name = priority["name"]
    value = priority["value"]
    category = priority["category"]
    
    parts = [
        f'ID: "{priority_id_str}"',
        f'Name: {json.dumps(name)}',
        f'Value: {json.dumps(value)}',
        f'Category: {json.dumps(category)}',
    ]
    
    # Category-specific fields
    if "metatypes" in priority and priority["metatypes"]:
        mt_str = convert_metatypes_to_go(priority["metatypes"])
        if mt_str != "nil":
            parts.append(f"Metatypes: {mt_str}")
    
    if "talents" in priority and priority["talents"]:
        t_str = convert_talents_to_go(priority["talents"])
        if t_str != "nil":
            parts.append(f"Talents: {t_str}")
    
    if "attributes" in priority:
        parts.append(f'Attributes: {json.dumps(priority["attributes"])}')
    
    if "skills" in priority:
        parts.append(f'Skills: {json.dumps(priority["skills"])}')
    
    if "skillgroups" in priority:
        parts.append(f'SkillGroups: {json.dumps(priority["skillgroups"])}')
    
    if "resources" in priority:
        parts.append(f'Resources: {json.dumps(priority["resources"])}')
    
    if "prioritytable" in priority:
        parts.append(f'PriorityTable: {json.dumps(priority["prioritytable"])}')
    
    return f'''	"{priority_id}": {{
		{",\n\t\t".join(parts)},
	}},'''

def main():
    with open("data/chummer/priorities.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    priorities = data["priorities"]["priority"]
    categories = data["categories"]["category"]
    priority_tables = data["prioritytables"]["prioritytable"]
    sum_to_ten = data["priortysumtotenvalues"]
    
    print("package v5")
    print()
    print("// DataPriorities contains priority records keyed by their ID (lowercase with underscores)")
    print("var DataPriorities = map[string]Priority{")
    
    # Track used IDs to handle duplicates
    used_ids = {}
    
    for priority in priorities:
        # Use name as the key, converted to snake_case
        name = priority["name"]
        priority_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = priority_id
        suffix = 0
        while priority_id in used_ids:
            suffix += 1
            priority_id = f"{original_id}_{suffix}"
        
        used_ids[priority_id] = True
        
        print(convert_priority_to_go(priority, priority_id))
    
    print("}")
    print()
    print("// DataPriorityCategories contains priority category names")
    print("var DataPriorityCategories = []string{")
    for cat in categories:
        print(f'	{json.dumps(cat)},')
    print("}")
    print()
    print("// DataPriorityTables contains priority table names")
    print("var DataPriorityTables = []string{")
    for table in priority_tables:
        print(f'	{json.dumps(table)},')
    print("}")
    print()
    print("// DataPrioritySumToTenValues contains sum-to-ten values for each priority letter")
    print("var DataPrioritySumToTenValues = map[string]string{")
    for letter, value in sorted(sum_to_ten.items()):
        print(f'	{json.dumps(letter)}: {json.dumps(value)},')
    print("}")

if __name__ == "__main__":
    main()

