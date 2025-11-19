#!/usr/bin/env python3
"""Generate packs_data.go from packs.json"""

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

def convert_gear_name_to_go(name):
    """Convert gear name (can be string or complex object) to Go"""
    if isinstance(name, dict):
        # Complex object with +content and +@select
        return "nil"  # TODO: Handle complex name structure
    elif isinstance(name, str):
        return json.dumps(name)
    return "nil"

def convert_gear_to_go(gear):
    """Convert a gear to Go struct literal"""
    parts = []
    
    # Name can be string or complex object
    name_val = gear.get("name")
    if isinstance(name_val, dict):
        parts.append("Name: nil")  # TODO: Handle complex name
    elif isinstance(name_val, str):
        parts.append(f'Name: {json.dumps(name_val)}')
    else:
        parts.append("Name: nil")
    
    if "category" in gear:
        parts.append(f'Category: {json.dumps(gear["category"])}')
    if "rating" in gear:
        parts.append(f'Rating: {json.dumps(gear["rating"])}')
    if "qty" in gear:
        parts.append(f'Qty: {json.dumps(gear["qty"])}')
    
    # Handle nested gears
    if "gears" in gear and gear["gears"]:
        nested_gears = gear["gears"].get("gear", [])
        if nested_gears:
            # For now, set to nil due to complexity
            parts.append("Gears: &PackGears{Gear: nil}")  # TODO: Handle nested gears
    
    return "PackGear{" + ", ".join(parts) + "}"

def convert_gears_to_go(gears):
    """Convert gears to Go struct literal"""
    if not gears or "gear" not in gears:
        return "nil"
    
    g = gears["gear"]
    if g is None:
        return "nil"
    
    if isinstance(g, list):
        if len(g) == 0:
            return "nil"
        # For now, set to nil due to complexity
        return "&PackGears{Gear: nil}"  # TODO: Handle list of gears
    elif isinstance(g, dict):
        gear_str = convert_gear_to_go(g)
        return f"&PackGears{{Gear: {gear_str}}}"
    
    return "nil"

def convert_armor_to_go(armor):
    """Convert an armor to Go struct literal"""
    name = armor.get("name", "")
    return f'PackArmor{{Name: {json.dumps(name)}}}'

def convert_armors_to_go(armors):
    """Convert armors to Go struct literal"""
    if not armors or "armor" not in armors:
        return "nil"
    
    a = armors["armor"]
    if a is None:
        return "nil"
    
    if isinstance(a, list):
        if len(a) == 0:
            return "nil"
        # For now, set to nil due to complexity
        return "&PackArmors{Armor: nil}"  # TODO: Handle list of armors
    elif isinstance(a, dict):
        armor_str = convert_armor_to_go(a)
        return f"&PackArmors{{Armor: {armor_str}}}"
    
    return "nil"

def convert_weapon_accessory_to_go(accessory):
    """Convert a weapon accessory to Go struct literal"""
    name = accessory.get("name", "")
    mount_str = convert_string_ptr(accessory.get("mount"))
    
    parts = [f'Name: {json.dumps(name)}']
    if mount_str != "nil":
        parts.append(f"Mount: {mount_str}")
    
    return "PackWeaponAccessory{" + ", ".join(parts) + "}"

def convert_weapon_accessories_to_go(accessories):
    """Convert weapon accessories to Go struct literal"""
    if not accessories or "accessory" not in accessories:
        return "nil"
    
    acc = accessories["accessory"]
    if acc is None:
        return "nil"
    
    if isinstance(acc, list):
        if len(acc) == 0:
            return "nil"
        # For now, set to nil due to complexity
        return "&PackWeaponAccessories{Accessory: nil}"  # TODO: Handle list of accessories
    elif isinstance(acc, dict):
        acc_str = convert_weapon_accessory_to_go(acc)
        return f"&PackWeaponAccessories{{Accessory: {acc_str}}}"
    
    return "nil"

def convert_weapon_to_go(weapon):
    """Convert a weapon to Go struct literal"""
    name = weapon.get("name", "")
    
    parts = [f'Name: {json.dumps(name)}']
    
    if "accessories" in weapon and weapon["accessories"]:
        acc_str = convert_weapon_accessories_to_go(weapon["accessories"])
        if acc_str != "nil":
            parts.append(f"Accessories: {acc_str}")
    
    return "PackWeapon{" + ", ".join(parts) + "}"

def convert_weapons_to_go(weapons):
    """Convert weapons to Go struct literal"""
    if not weapons or "weapon" not in weapons:
        return "nil"
    
    w = weapons["weapon"]
    if w is None:
        return "nil"
    
    if isinstance(w, list):
        if len(w) == 0:
            return "nil"
        # For now, set to nil due to complexity
        return "&PackWeapons{Weapon: nil}"  # TODO: Handle list of weapons
    elif isinstance(w, dict):
        weapon_str = convert_weapon_to_go(w)
        return f"&PackWeapons{{Weapon: {weapon_str}}}"
    
    return "nil"

def convert_pack_to_go(pack, pack_id):
    """Convert a pack to Go struct literal"""
    name = pack["name"]
    category = pack["category"]
    nuyenbp = pack["nuyenbp"]
    
    parts = [
        f'Name: {json.dumps(name)}',
        f'Category: {json.dumps(category)}',
        f'NuyenBP: {json.dumps(nuyenbp)}',
    ]
    
    armors_str = convert_armors_to_go(pack.get("armors"))
    if armors_str != "nil":
        parts.append(f"Armors: {armors_str}")
    
    gears_str = convert_gears_to_go(pack.get("gears"))
    if gears_str != "nil":
        parts.append(f"Gears: {gears_str}")
    
    weapons_str = convert_weapons_to_go(pack.get("weapons"))
    if weapons_str != "nil":
        parts.append(f"Weapons: {weapons_str}")
    
    return f'''	"{pack_id}": {{
		{",\n\t\t".join(parts)},
	}},'''

def main():
    with open("data/chummer/packs.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    print("package v5")
    print()
    
    # Categories
    cats = data["categories"]["category"]
    print("// DataPackCategories contains pack category names")
    print("var DataPackCategories = []string{")
    for cat in cats:
        print(f'	{json.dumps(cat)},')
    print("}")
    print()
    
    # Packs
    packs = data["packs"]["pack"]
    print("// DataPacks contains pack records keyed by their ID (lowercase with underscores)")
    print("var DataPacks = map[string]Pack{")
    
    used_pack_ids = {}
    for pack in packs:
        name = pack["name"]
        pack_id = to_snake_case(name)
        
        original_id = pack_id
        suffix = 0
        while pack_id in used_pack_ids:
            suffix += 1
            pack_id = f"{original_id}_{suffix}"
        
        used_pack_ids[pack_id] = True
        print(convert_pack_to_go(pack, pack_id))
    
    print("}")

if __name__ == "__main__":
    main()

