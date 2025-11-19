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
        return convert_dict_to_go(value, field_name)
    return str(value)

def convert_dict_to_go(d, context=""):
    """Convert a dictionary to Go struct initialization"""
    if not d:
        return "nil"
    
    # Handle WeaponAccessories
    if 'accessory' in d:
        acc = d.get('accessory')
        if acc is None:
            return "nil"
        if isinstance(acc, list):
            acc_parts = []
            for a in acc:
                if isinstance(a, dict):
                    acc_parts.append(convert_weapon_accessory_to_go(a))
                else:
                    # Simple string accessory - create minimal struct
                    acc_parts.append(f'WeaponAccessory{{\n\t\t\t\t\t\t\tName: {convert_value(a, "name")},\n\t\t\t\t\t\t}}')
            acc_str = ',\n\t\t\t\t\t'.join(acc_parts)
            return f"&WeaponAccessories{{\n\t\t\t\t\tAccessory: []WeaponAccessory{{\n\t\t\t\t\t\t{acc_str},\n\t\t\t\t\t}},\n\t\t\t\t}}"
        else:
            if isinstance(acc, dict):
                acc_go = convert_weapon_accessory_to_go(acc)
            else:
                # Simple string accessory
                acc_go = f'WeaponAccessory{{\n\t\t\t\t\t\t\tName: {convert_value(acc, "name")},\n\t\t\t\t\t\t}}'
            # For single accessory, wrap in slice to match interface{} type
            return f"&WeaponAccessories{{\n\t\t\t\t\tAccessory: []WeaponAccessory{{\n\t\t\t\t\t\t{acc_go},\n\t\t\t\t\t}},\n\t\t\t\t}}"
    
    # Handle WeaponAccessoryMounts
    if 'mount' in d:
        mount = d.get('mount')
        if mount is None:
            return "nil"
        if isinstance(mount, list):
            items = [convert_value(item, 'mount') for item in mount]
            brace_open = '{'
            brace_close = '}'
            return f"&WeaponAccessoryMounts{{\n\t\t\t\t\tMount: []string{brace_open}{', '.join(items)}{brace_close},\n\t\t\t\t}}"
        else:
            return f"&WeaponAccessoryMounts{{\n\t\t\t\t\tMount: {convert_value(mount, 'mount')},\n\t\t\t\t}}"
    
    # Handle WeaponRequired - complex structures, set to nil for now
    if 'weapondetails' in d or 'OR' in d or 'AND' in d:
        return "nil"  # TODO: Handle complex required structures
    
    # Generic struct
    lines = []
    for k, v in d.items():
        go_key = k.title() if not k.startswith('+') else k.replace('+', '').replace('@', '')
        lines.append(f"{go_key}: {convert_value(v, k)}")
    return "{\n\t\t\t\t" + ",\n\t\t\t\t".join(lines) + ",\n\t\t\t}"

def convert_weapon_accessory_to_go(acc):
    """Convert weapon accessory JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'Name: {convert_value(acc.get("name"), "name")}')
    
    # Optional fields
    if 'mount' in acc:
        parts.append(f'Mount: {convert_value(acc.get("mount"), "mount")}')
    if 'avail' in acc:
        parts.append(f'Avail: {convert_value(acc.get("avail"), "avail")}')
    if 'cost' in acc:
        parts.append(f'Cost: {convert_value(acc.get("cost"), "cost")}')
    if 'source' in acc:
        parts.append(f'Source: {convert_value(acc.get("source"), "source")}')
    if 'page' in acc:
        parts.append(f'Page: {convert_value(acc.get("page"), "page")}')
    if 'rating' in acc:
        parts.append(f'Rating: {convert_value(acc.get("rating"), "rating")}')
    if 'required' in acc:
        req = acc.get("required")
        # Check if it's a complex structure
        if isinstance(req, dict) and ('OR' in req or 'AND' in req or 'weapondetails' in req or any('oneof' in str(k).lower() for k in req.keys())):
            parts.append('Required: nil')  # TODO: Handle complex required structures
        else:
            parts.append(f'Required: {convert_dict_to_go(req, "required")}')
    
    return "{\n\t\t\t\t\t\t" + ",\n\t\t\t\t\t\t".join(parts) + ",\n\t\t\t\t\t}"

def convert_weapon_to_go(weapon):
    """Convert weapon JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'Name: {convert_value(weapon.get("name"), "name")}')
    parts.append(f'Category: {convert_value(weapon.get("category"), "category")}')
    parts.append(f'Type: {convert_value(weapon.get("type"), "type")}')
    parts.append(f'Source: {convert_value(weapon.get("source"), "source")}')
    
    # Weapon stats
    if 'conceal' in weapon:
        parts.append(f'Conceal: {convert_value(weapon.get("conceal"), "conceal")}')
    if 'accuracy' in weapon:
        parts.append(f'Accuracy: {convert_value(weapon.get("accuracy"), "accuracy")}')
    if 'reach' in weapon:
        parts.append(f'Reach: {convert_value(weapon.get("reach"), "reach")}')
    if 'damage' in weapon:
        parts.append(f'Damage: {convert_value(weapon.get("damage"), "damage")}')
    if 'ap' in weapon:
        parts.append(f'AP: {convert_value(weapon.get("ap"), "ap")}')
    if 'mode' in weapon:
        parts.append(f'Mode: {convert_value(weapon.get("mode"), "mode")}')
    if 'rc' in weapon:
        parts.append(f'RC: {convert_value(weapon.get("rc"), "rc")}')
    if 'ammo' in weapon:
        parts.append(f'Ammo: {convert_value(weapon.get("ammo"), "ammo")}')
    if 'range' in weapon:
        parts.append(f'Range: {convert_value(weapon.get("range"), "range")}')
    
    # Optional fields
    if 'avail' in weapon:
        parts.append(f'Avail: {convert_value(weapon.get("avail"), "avail")}')
    if 'cost' in weapon:
        parts.append(f'Cost: {convert_value(weapon.get("cost"), "cost")}')
    if 'page' in weapon:
        parts.append(f'Page: {convert_value(weapon.get("page"), "page")}')
    if 'accessories' in weapon:
        parts.append(f'Accessories: {convert_dict_to_go(weapon.get("accessories"), "accessories")}')
    if 'accessorymounts' in weapon:
        parts.append(f'AccessoryMounts: {convert_dict_to_go(weapon.get("accessorymounts"), "accessorymounts")}')
    
    # Handle other optional string fields (excluding addweapon which is handled separately)
    optional_string_fields = {
        'allowaccessory': 'AllowAccessory',
        'alternaterange': 'AlternateRange',
        'ammocategory': 'AmmoCategory',
        'ammoslots': 'AmmoSlots',
        'cyberware': 'Cyberware',
        'extramount': 'ExtraMount',
        'maxrating': 'MaxRating',
        'mount': 'Mount',
        'requireammo': 'RequireAmmo',
        'shortburst': 'ShortBurst',
        'singleshot': 'SingleShot',
        'sizecategory': 'SizeCategory',
        'spec': 'Spec',
        'spec2': 'Spec2',
        'useskill': 'UseSkill',
        'useskillspec': 'UseSkillSpec',
        'weapontype': 'WeaponType',
    }
    for field, go_field in optional_string_fields.items():
        if field in weapon:
            parts.append(f'{go_field}: {convert_value(weapon.get(field), field)}')
    
    # Handle interface{} fields
    if 'addweapon' in weapon:
        aw = weapon.get('addweapon')
        if isinstance(aw, list):
            items = [convert_value(item, 'addweapon') for item in aw]
            brace_open = '{'
            brace_close = '}'
            parts.append(f'AddWeapon: []interface{brace_open}{brace_close}{brace_open}{", ".join(items)}{brace_close}')
        else:
            parts.append(f'AddWeapon: {convert_value(aw, "addweapon")}')
    if 'allowgear' in weapon:
        parts.append('AllowGear: nil')  # TODO: Handle complex allowgear
    if 'underbarrels' in weapon:
        parts.append('Underbarrels: nil')  # TODO: Handle complex underbarrels
    if 'required' in weapon:
        req = weapon.get("required")
        # Check if it's a complex structure (has OR, AND, or nested weapondetails)
        if isinstance(req, dict) and ('OR' in req or 'AND' in req or 'weapondetails' in req):
            parts.append('Required: nil')  # TODO: Handle complex required structures
        else:
            parts.append(f'Required: {convert_dict_to_go(req, "required")}')
    
    # Handle boolean fields
    if 'doubledcostaccessorymounts' in weapon:
        dcam = weapon.get('doubledcostaccessorymounts')
        if dcam is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'DoubleCostAccessoryMounts: &[]bool{brace_open}true{brace_close}[0]')
        elif isinstance(dcam, dict):
            # Complex structure - set to nil
            parts.append('DoubleCostAccessoryMounts: nil')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'DoubleCostAccessoryMounts: &[]bool{brace_open}{str(dcam).lower()}{brace_close}[0]')
    if 'hide' in weapon:
        hide = weapon.get('hide')
        if hide is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'Hide: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'Hide: &[]bool{brace_open}{str(hide).lower()}{brace_close}[0]')
    
    return "{\n\t\t\t" + ",\n\t\t\t".join(parts) + ",\n\t\t}"

# Read JSON file
with open('data/chummer/weapons.json', 'r') as f:
    data = json.load(f)

# Generate category entries
category_entries = []
for category in data['categories']['category']:
    category_name = category.get('+content', '')
    category_id = to_snake_case(category_name)
    category_type = category.get('+@type', '')
    category_bm = category.get('+@blackmarket', '')
    category_gs = category.get('+@gunneryspec', '')
    
    parts = [
        f'Name: {convert_value(category_name, "name")}',
        f'Type: {convert_value(category_type, "type")}',
        f'BlackMarket: {convert_value(category_bm, "blackmarket")}',
    ]
    if category_gs:
        parts.append(f'GunnerySpec: {convert_value(category_gs, "gunnery_spec")}')
    
    category_go = f'WeaponCategory{{\n\t\t\t{", ".join(parts)},\n\t\t}}'
    category_entries.append(f'\t"{category_id}": {category_go}')

# Generate weapon entries
weapon_entries = []
for weapon in data['weapons']['weapon']:
    weapon_id = to_snake_case(weapon.get('name', ''))
    weapon_go = convert_weapon_to_go(weapon)
    weapon_entries.append(f'\t"{weapon_id}": {weapon_go}')

# Generate accessory entries
accessory_entries = []
if 'accessories' in data and 'accessory' in data['accessories']:
    for accessory in data['accessories']['accessory']:
        accessory_id = to_snake_case(accessory.get('name', ''))
        accessory_go = convert_weapon_accessory_to_go(accessory)
        accessory_entries.append(f'\t"{accessory_id}": {accessory_go}')

# Write to file
with open('weapons_data_generated.go', 'w') as f:
    f.write('package v5\n\n')
    f.write('// DataWeaponCategories contains weapon categories keyed by their ID (lowercase with underscores)\n')
    f.write('var DataWeaponCategories = map[string]WeaponCategory{\n')
    f.write(',\n'.join(category_entries))
    f.write(',\n}\n\n')
    f.write('// DataWeapons contains weapon records keyed by their ID (lowercase with underscores)\n')
    f.write('var DataWeapons = map[string]Weapon{\n')
    f.write(',\n'.join(weapon_entries))
    f.write(',\n}\n\n')
    if accessory_entries:
        f.write('// DataWeaponAccessories contains weapon accessory records keyed by their ID (lowercase with underscores)\n')
        f.write('var DataWeaponAccessories = map[string]WeaponAccessory{\n')
        f.write(',\n'.join(accessory_entries))
        f.write(',\n}\n')

print(f"Generated {len(category_entries)} categories, {len(weapon_entries)} weapons, and {len(accessory_entries)} accessories")

