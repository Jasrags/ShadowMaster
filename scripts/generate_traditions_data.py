#!/usr/bin/env python3
"""Generate traditions_data.go from traditions.json"""

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

def convert_spirits_to_go(spirits):
    """Convert spirits object to Go struct literal"""
    if not spirits:
        return "nil"
    
    parts = []
    if "spiritcombat" in spirits:
        parts.append(f'SpiritCombat: {json.dumps(spirits["spiritcombat"])}')
    if "spiritdetection" in spirits:
        parts.append(f'SpiritDetection: {json.dumps(spirits["spiritdetection"])}')
    if "spirithealth" in spirits:
        parts.append(f'SpiritHealth: {json.dumps(spirits["spirithealth"])}')
    if "spiritillusion" in spirits:
        parts.append(f'SpiritIllusion: {json.dumps(spirits["spiritillusion"])}')
    if "spiritmanipulation" in spirits:
        parts.append(f'SpiritManipulation: {json.dumps(spirits["spiritmanipulation"])}')
    
    if not parts:
        return "nil"
    
    return "&TraditionSpirits{" + ", ".join(parts) + "}"

def convert_add_qualities_to_go(addqualities):
    """Convert addqualities to Go struct literal"""
    if not addqualities:
        return "nil"
    
    if "addquality" in addqualities and addqualities["addquality"]:
        qualities = addqualities["addquality"]
        if isinstance(qualities, list):
            # For now, set to nil as it's complex - TODO: handle properly
            return "nil"
        elif isinstance(qualities, dict):
            # Single quality
            return "nil"  # TODO: handle properly
    
    return "nil"

def convert_bonus_to_go(bonus):
    """Convert bonus object to Go struct literal"""
    if not bonus:
        return "nil"
    
    if "addqualities" in bonus and bonus["addqualities"]:
        addqualities_str = convert_add_qualities_to_go(bonus["addqualities"])
        if addqualities_str != "nil":
            return f'&TraditionBonus{{AddQualities: {addqualities_str}}}'
    
    return "nil"

def convert_tradition_to_go(trad, trad_id):
    """Convert a tradition object to Go struct literal"""
    trad_id_str = trad["id"]
    name = trad["name"]
    source = trad["source"]
    page = trad["page"]
    
    # Handle optional fields
    drain_str = convert_string_ptr(trad.get("drain"))
    spirits_str = convert_spirits_to_go(trad.get("spirits"))
    spiritform_str = convert_string_ptr(trad.get("spiritform"))
    bonus_str = convert_bonus_to_go(trad.get("bonus"))
    
    # Build the struct
    lines = [
        f'	"{trad_id}": {{',
        f'		ID: "{trad_id_str}",',
        f'		Name: {json.dumps(name)},',
        f'		Source: {json.dumps(source)},',
        f'		Page: {json.dumps(page)},',
    ]
    
    if drain_str != "nil":
        lines.append(f'		Drain: {drain_str},')
    if spirits_str != "nil":
        lines.append(f'		Spirits: {spirits_str},')
    if spiritform_str != "nil":
        lines.append(f'		SpiritForm: {spiritform_str},')
    if bonus_str != "nil":
        lines.append(f'		Bonus: {bonus_str},')
    
    lines.append("	},")
    return "\n".join(lines)

def convert_drainattribute_to_go(attr, attr_id):
    """Convert a drain attribute object to Go struct literal"""
    attr_id_str = attr["id"]
    name = attr["name"]
    
    return f'''	"{attr_id}": {{
		ID: "{attr_id_str}",
		Name: {json.dumps(name)},
	}},'''

def main():
    with open("data/chummer/traditions.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    traditions = data["traditions"]["tradition"]
    drainattributes = data["drainattributes"]["drainattribute"]
    
    print("package v5")
    print()
    print("// DataTraditions contains tradition records keyed by their ID (lowercase with underscores)")
    print("var DataTraditions = map[string]Tradition{")
    
    # Track used IDs to handle duplicates
    used_ids = {}
    
    for trad in traditions:
        # Use name as the key, converted to snake_case
        name = trad["name"]
        trad_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = trad_id
        suffix = 0
        while trad_id in used_ids:
            suffix += 1
            trad_id = f"{original_id}_{suffix}"
        
        used_ids[trad_id] = True
        
        print(convert_tradition_to_go(trad, trad_id))
    
    print("}")
    print()
    print("// DataDrainAttributes contains drain attribute records keyed by their ID (lowercase with underscores)")
    print("var DataDrainAttributes = map[string]DrainAttribute{")
    
    # Track used IDs for drain attributes
    used_attr_ids = {}
    
    for attr in drainattributes:
        # Use name as the key, converted to snake_case
        name = attr["name"]
        attr_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = attr_id
        suffix = 0
        while attr_id in used_attr_ids:
            suffix += 1
            attr_id = f"{original_id}_{suffix}"
        
        used_attr_ids[attr_id] = True
        
        print(convert_drainattribute_to_go(attr, attr_id))
    
    print("}")

if __name__ == "__main__":
    main()

