#!/usr/bin/env python3
"""Generate powers_data.go from powers.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    # Replace spaces and special chars with underscores
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_string_ptr(value):
    """Convert a value to *string or nil"""
    if value is None:
        return "nil"
    if isinstance(value, str):
        if value == "":
            return "nil"
        return f'&[]string{{{json.dumps(value)}}}[0]'
    return "nil"

def convert_required_oneof_to_go(oneof):
    """Convert oneof requirement to Go struct literal"""
    if not oneof:
        return "nil"
    
    quality = oneof.get("quality")
    if quality:
        if isinstance(quality, list):
            # For now, set to nil as it's complex - TODO: handle properly
            return "nil"
        elif isinstance(quality, str):
            return f'&PowerRequiredOneOf{{Quality: {json.dumps(quality)}}}'
    
    return "nil"

def convert_required_to_go(required):
    """Convert required object to Go struct literal"""
    if not required:
        return "nil"
    
    if "oneof" in required and required["oneof"]:
        oneof_str = convert_required_oneof_to_go(required["oneof"])
        if oneof_str != "nil":
            return f'&PowerRequired{{OneOf: {oneof_str}}}'
    
    return "nil"

def convert_adeptwayrequires_to_go(awr):
    """Convert adeptwayrequires to Go struct literal"""
    if not awr:
        return "nil"
    
    required_str = convert_required_to_go(awr.get("required"))
    if required_str != "nil":
        return f'&AdeptWayRequires{{Required: {required_str}}}'
    
    return "nil"

def convert_bonus_to_go(bonus):
    """Convert bonus object to Go struct literal"""
    if not bonus:
        return "nil"
    
    parts = []
    
    # Handle simple string bonuses
    if "dodge" in bonus:
        parts.append(f'Dodge: {json.dumps(bonus["dodge"])}')
    if "surprise" in bonus:
        parts.append(f'Surprise: {json.dumps(bonus["surprise"])}')
    
    # Handle complex bonuses - set to nil for now
    if "selectattribute" in bonus:
        parts.append("SelectAttribute: nil")  # TODO: Handle complex structure
    if "selectskill" in bonus and bonus["selectskill"]:
        # For now, set to nil - TODO: handle properly
        parts.append("SelectSkill: nil")
    if "specificskill" in bonus:
        parts.append("SpecificSkill: nil")  # TODO: Handle complex structure
    if "unlockskills" in bonus:
        parts.append("UnlockSkills: nil")  # TODO: Handle complex structure
    if "weaponcategorydv" in bonus:
        parts.append("WeaponCategoryDV: nil")  # TODO: Handle complex structure
    if "weaponskillaccuracy" in bonus:
        parts.append("WeaponSkillAccuracy: nil")  # TODO: Handle complex structure
    
    if not parts:
        return "nil"
    
    return "&PowerBonus{" + ", ".join(parts) + "}"

def convert_power_to_go(power, power_id):
    """Convert a power object to Go struct literal"""
    power_id_str = power["id"]
    name = power["name"]
    points = power["points"]
    levels = power["levels"]
    limit = power["limit"]
    source = power["source"]
    page = power["page"]
    
    # Handle optional fields
    action_str = convert_string_ptr(power.get("action"))
    adeptway_str = convert_string_ptr(power.get("adeptway"))
    adeptwayrequires_str = convert_adeptwayrequires_to_go(power.get("adeptwayrequires"))
    bonus_str = convert_bonus_to_go(power.get("bonus"))
    
    # Build the struct
    lines = [
        f'	"{power_id}": {{',
        f'		ID: "{power_id_str}",',
        f'		Name: {json.dumps(name)},',
        f'		Points: {json.dumps(points)},',
        f'		Levels: {json.dumps(levels)},',
        f'		Limit: {json.dumps(limit)},',
        f'		Source: {json.dumps(source)},',
        f'		Page: {json.dumps(page)},',
    ]
    
    if action_str != "nil":
        lines.append(f'		Action: {action_str},')
    if adeptway_str != "nil":
        lines.append(f'		AdeptWay: {adeptway_str},')
    if adeptwayrequires_str != "nil":
        lines.append(f'		AdeptWayRequires: {adeptwayrequires_str},')
    if bonus_str != "nil":
        lines.append(f'		Bonus: {bonus_str},')
    
    lines.append("	},")
    return "\n".join(lines)

def convert_enhancement_required_to_go(required):
    """Convert enhancement required to Go struct literal"""
    if not required:
        return "nil"
    
    if "allof" in required and required["allof"]:
        allof = required["allof"]
        power = allof.get("power", "")
        quality = allof.get("quality", "")
        if power or quality:
            parts = []
            if power:
                parts.append(f'Power: {json.dumps(power)}')
            if quality:
                parts.append(f'Quality: {json.dumps(quality)}')
            if parts:
                return f'&EnhancementRequired{{AllOf: &EnhancementRequiredAllOf{{{", ".join(parts)}}}}}'
    
    return "nil"

def convert_enhancement_to_go(enh, enh_id):
    """Convert an enhancement object to Go struct literal"""
    enh_id_str = enh["id"]
    name = enh["name"]
    power = enh.get("power", "")  # Power might be null/optional
    if power is None:
        power = ""
    source = enh["source"]
    page = enh["page"]
    
    # Handle required
    required_str = convert_enhancement_required_to_go(enh.get("required"))
    
    # Build the struct
    lines = [
        f'	"{enh_id}": {{',
        f'		ID: "{enh_id_str}",',
        f'		Name: {json.dumps(name)},',
        f'		Power: {json.dumps(power)},',
        f'		Source: {json.dumps(source)},',
        f'		Page: {json.dumps(page)},',
    ]
    
    if required_str != "nil":
        lines.append(f'		Required: {required_str},')
    
    lines.append("	},")
    return "\n".join(lines)

def main():
    with open("data/chummer/powers.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    powers = data["powers"]["power"]
    enhancements = data["enhancements"]["enhancement"]
    
    print("package v5")
    print()
    print("// DataPowers contains adept power records keyed by their ID (lowercase with underscores)")
    print("var DataPowers = map[string]Power{")
    
    # Track used IDs to handle duplicates
    used_ids = {}
    
    for power in powers:
        # Use name as the key, converted to snake_case
        name = power["name"]
        power_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = power_id
        suffix = 0
        while power_id in used_ids:
            suffix += 1
            power_id = f"{original_id}_{suffix}"
        
        used_ids[power_id] = True
        
        print(convert_power_to_go(power, power_id))
    
    print("}")
    print()
    print("// DataEnhancements contains power enhancement records keyed by their ID (lowercase with underscores)")
    print("var DataEnhancements = map[string]Enhancement{")
    
    # Track used IDs for enhancements
    used_enh_ids = {}
    
    for enh in enhancements:
        # Use name as the key, converted to snake_case
        name = enh["name"]
        enh_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = enh_id
        suffix = 0
        while enh_id in used_enh_ids:
            suffix += 1
            enh_id = f"{original_id}_{suffix}"
        
        used_enh_ids[enh_id] = True
        
        print(convert_enhancement_to_go(enh, enh_id))
    
    print("}")

if __name__ == "__main__":
    main()

