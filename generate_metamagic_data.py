#!/usr/bin/env python3
"""Generate metamagic_data.go from metamagic.json"""

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

def convert_required_allof_to_go(allof):
    """Convert allof requirement to Go struct literal"""
    if not allof:
        return "nil"
    
    parts = []
    if "art" in allof:
        art_val = allof["art"]
        if isinstance(art_val, list):
            # For lists, set to nil for now - TODO: Handle properly
            parts.append("Art: nil")
        else:
            parts.append(f'Art: {json.dumps(art_val)}')
    if "metamagic" in allof:
        parts.append(f'Metamagic: {json.dumps(allof["metamagic"])}')
    if "group" in allof:
        parts.append("Group: nil")  # TODO: Handle complex group structure
    
    if not parts:
        return "nil"
    
    return "&MetamagicRequiredAllOf{" + ", ".join(parts) + "}"

def convert_required_oneof_to_go(oneof):
    """Convert oneof requirement to Go struct literal"""
    if not oneof:
        return "nil"
    
    parts = []
    if "art" in oneof:
        parts.append("Art: nil")  # TODO: Handle string or []string
    if "quality" in oneof:
        parts.append("Quality: nil")  # TODO: Handle string or []string
    if "metamagic" in oneof:
        parts.append(f'Metamagic: {json.dumps(oneof["metamagic"])}')
    if "tradition" in oneof:
        parts.append(f'Tradition: {json.dumps(oneof["tradition"])}')
    if "group" in oneof:
        parts.append("Group: nil")  # TODO: Handle complex group structure
    
    if not parts:
        return "nil"
    
    return "&MetamagicRequiredOneOf{" + ", ".join(parts) + "}"

def convert_required_to_go(required):
    """Convert required object to Go struct literal"""
    if not required:
        return "nil"
    
    parts = []
    if "allof" in required and required["allof"]:
        allof_str = convert_required_allof_to_go(required["allof"])
        if allof_str != "nil":
            parts.append(f"AllOf: {allof_str}")
    
    if "oneof" in required and required["oneof"]:
        oneof_str = convert_required_oneof_to_go(required["oneof"])
        if oneof_str != "nil":
            parts.append(f"OneOf: {oneof_str}")
    
    if not parts:
        return "nil"
    
    return "&MetamagicRequired{" + ", ".join(parts) + "}"

def convert_bonus_to_go(bonus):
    """Convert bonus object to Go struct literal"""
    if not bonus:
        return "nil"
    
    parts = []
    if "adeptpowerpoints" in bonus:
        parts.append(f'AdeptPowerPoints: {json.dumps(bonus["adeptpowerpoints"])}')
    if "quickeningmetamagic" in bonus:
        parts.append("QuickeningMetamagic: nil")  # TODO: Handle complex structure
    
    if not parts:
        return "nil"
    
    return "&MetamagicBonus{" + ", ".join(parts) + "}"

def convert_metamagic_to_go(meta, meta_id):
    """Convert a metamagic object to Go struct literal"""
    meta_id_str = meta["id"]
    name = meta["name"]
    adept = meta["adept"]
    magician = meta["magician"]
    source = meta["source"]
    page = meta["page"]
    
    # Handle optional fields
    limit_str = convert_string_ptr(meta.get("limit"))
    bonus_str = convert_bonus_to_go(meta.get("bonus"))
    required_str = convert_required_to_go(meta.get("required"))
    
    # Build the struct
    lines = [
        f'	"{meta_id}": {{',
        f'		ID: "{meta_id_str}",',
        f'		Name: {json.dumps(name)},',
        f'		Adept: {json.dumps(adept)},',
        f'		Magician: {json.dumps(magician)},',
        f'		Source: {json.dumps(source)},',
        f'		Page: {json.dumps(page)},',
    ]
    
    if limit_str != "nil":
        lines.append(f'		Limit: {limit_str},')
    if bonus_str != "nil":
        lines.append(f'		Bonus: {bonus_str},')
    if required_str != "nil":
        lines.append(f'		Required: {required_str},')
    
    lines.append("	},")
    return "\n".join(lines)

def convert_art_to_go(art, art_id):
    """Convert an art object to Go struct literal"""
    art_id_str = art["id"]
    name = art["name"]
    source = art["source"]
    page = art["page"]
    
    return f'''	"{art_id}": {{
		ID: "{art_id_str}",
		Name: {json.dumps(name)},
		Source: {json.dumps(source)},
		Page: {json.dumps(page)},
	}},'''

def main():
    with open("data/chummer/metamagic.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    metamagics = data["metamagics"]["metamagic"]
    arts = data["arts"]["art"]
    
    print("package v5")
    print()
    print("// DataMetamagics contains metamagic technique records keyed by their ID (lowercase with underscores)")
    print("var DataMetamagics = map[string]Metamagic{")
    
    # Track used IDs to handle duplicates
    used_ids = {}
    
    for meta in metamagics:
        # Use name as the key, converted to snake_case
        name = meta["name"]
        meta_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = meta_id
        suffix = 0
        while meta_id in used_ids:
            suffix += 1
            meta_id = f"{original_id}_{suffix}"
        
        used_ids[meta_id] = True
        
        print(convert_metamagic_to_go(meta, meta_id))
    
    print("}")
    print()
    print("// DataArts contains art records keyed by their ID (lowercase with underscores)")
    print("var DataArts = map[string]Art{")
    
    # Track used IDs for arts
    used_art_ids = {}
    
    for art in arts:
        # Use name as the key, converted to snake_case
        name = art["name"]
        art_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = art_id
        suffix = 0
        while art_id in used_art_ids:
            suffix += 1
            art_id = f"{original_id}_{suffix}"
        
        used_art_ids[art_id] = True
        
        print(convert_art_to_go(art, art_id))
    
    print("}")

if __name__ == "__main__":
    main()

