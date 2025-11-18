#!/usr/bin/env python3
import json
import re

def to_snake_case(name):
    """Convert name to lowercase with underscores"""
    # Remove special characters except spaces and hyphens
    name = re.sub(r'[^\w\s-]', '', name)
    # Replace spaces and hyphens with underscores
    name = re.sub(r'[-\s]+', '_', name)
    # Convert to lowercase and strip underscores
    return name.lower().strip('_')

def convert_value(value, field_name):
    """Convert JSON value to Go value"""
    if value is None:
        return "nil"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int):
        return str(value)
    if isinstance(value, str):
        # Escape quotes
        return f'"{value.replace('"', '\\"')}"'
    if isinstance(value, list):
        items = [convert_value(item, field_name) for item in value]
        brace_open = '{'
        brace_close = '}'
        return f"[]string{brace_open}{', '.join(items)}{brace_close}"
    if isinstance(value, dict):
        # Complex structure - set to nil for now
        return "nil"  # TODO: Handle complex structures
    return str(value)

def convert_gear_to_go(gear):
    """Convert gear JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'Name: {convert_value(gear.get("name"), "name")}')
    parts.append(f'Category: {convert_value(gear.get("category"), "category")}')
    parts.append(f'Source: {convert_value(gear.get("source"), "source")}')
    
    # Optional fields
    if 'page' in gear and gear.get("page"):
        parts.append(f'Page: {convert_value(gear.get("page"), "page")}')
    if 'rating' in gear and gear.get("rating") is not None:
        parts.append(f'Rating: {convert_value(gear.get("rating"), "rating")}')
    if 'avail' in gear and gear.get("avail") is not None:
        parts.append(f'Avail: {convert_value(gear.get("avail"), "avail")}')
    if 'cost' in gear and gear.get("cost") is not None:
        parts.append(f'Cost: {convert_value(gear.get("cost"), "cost")}')
    if 'costfor' in gear and gear.get("costfor") is not None:
        parts.append(f'CostFor: {convert_value(gear.get("costfor"), "costfor")}')
    if 'addweapon' in gear and gear.get("addweapon") is not None:
        parts.append(f'AddWeapon: {convert_value(gear.get("addweapon"), "addweapon")}')
    if 'ammoforweapontype' in gear and gear.get("ammoforweapontype") is not None:
        parts.append(f'AmmoForWeaponType: {convert_value(gear.get("ammoforweapontype"), "ammoforweapontype")}')
    if 'isflechetteammo' in gear:
        is_flechette = gear.get("isflechetteammo")
        if is_flechette is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'IsFlechetteAmmo: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'IsFlechetteAmmo: &[]bool{brace_open}{str(is_flechette).lower()}{brace_close}[0]')
    if 'flechetteweaponbonus' in gear and gear.get("flechetteweaponbonus") is not None:
        parts.append(f'FlechetteWeaponBonus: {convert_value(gear.get("flechetteweaponbonus"), "flechetteweaponbonus")}')
    if 'weaponbonus' in gear and gear.get("weaponbonus") is not None:
        parts.append(f'WeaponBonus: {convert_value(gear.get("weaponbonus"), "weaponbonus")}')
    if 'addoncategory' in gear:
        addon = gear.get("addoncategory")
        if isinstance(addon, list):
            items = [convert_value(item, "addoncategory") for item in addon]
            brace_open = '{'
            brace_close = '}'
            parts.append(f'AddonCategory: []string{brace_open}{', '.join(items)}{brace_close}')
        else:
            parts.append(f'AddonCategory: {convert_value(addon, "addoncategory")}')
    if 'required' in gear:
        parts.append('Required: nil')  # TODO: Handle complex required structures
    if 'requireparent' in gear:
        req_parent = gear.get("requireparent")
        if req_parent is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'RequireParent: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'RequireParent: &[]bool{brace_open}{str(req_parent).lower()}{brace_close}[0]')
    if 'bonus' in gear:
        parts.append('Bonus: nil')  # TODO: Handle complex bonus structures
    
    return "{\n\t\t\t" + ",\n\t\t\t".join(parts) + ",\n\t\t}"

# Read JSON file
with open('data/chummer/gear.json', 'r') as f:
    data = json.load(f)

# Generate category entries
category_entries = []
for category in data['categories']['category']:
    if isinstance(category, str):
        # Handle string categories (no black market info)
        category_name = category
        category_id = to_snake_case(category_name)
        category_go = f'GearCategory{{\n\t\t\tName: {convert_value(category_name, "name")}, BlackMarket: "",\n\t\t}}'
    else:
        category_name = category.get('+content', '')
        category_id = to_snake_case(category_name)
        category_go = f'GearCategory{{\n\t\t\tName: {convert_value(category_name, "name")}, BlackMarket: {convert_value(category.get("+@blackmarket", ""), "blackmarket")},\n\t\t}}'
    category_entries.append(f'\t"{category_id}": {category_go}')

# Generate gear entries
gear_entries = []
gear_ids_seen = {}
for gear in data['gears']['gear']:
    gear_id = to_snake_case(gear.get('name', ''))
    # Handle duplicate IDs by appending a suffix
    if gear_id in gear_ids_seen:
        gear_ids_seen[gear_id] += 1
        gear_id = f"{gear_id}_{gear_ids_seen[gear_id]}"
    else:
        gear_ids_seen[gear_id] = 0
    gear_go = convert_gear_to_go(gear)
    gear_entries.append(f'\t"{gear_id}": {gear_go}')

# Write to file
with open('gear_data_generated.go', 'w') as f:
    f.write('package v5\n\n')
    f.write('// DataGearCategories contains gear categories keyed by their ID (lowercase with underscores)\n')
    f.write('var DataGearCategories = map[string]GearCategory{\n')
    f.write(',\n'.join(category_entries))
    f.write(',\n}\n\n')
    f.write('// DataGears contains gear records keyed by their ID (lowercase with underscores)\n')
    f.write('var DataGears = map[string]Gear{\n')
    f.write(',\n'.join(gear_entries))
    f.write(',\n}\n')

print(f"Generated {len(category_entries)} categories and {len(gear_entries)} gears")

