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
        # Check if it's a numeric string that should be int
        if field_name in ['rating', 'maxrating', 'gearcapacity'] and value.isdigit():
            return value
        # Escape quotes
        return f'"{value.replace('"', '\\"')}"'
    if isinstance(value, list):
        items = [convert_value(item, field_name) for item in value]
        brace_open = '{'
        brace_close = '}'
        return f"[]string{brace_open}{', '.join(items)}{brace_close}"
    if isinstance(value, dict):
        # This is a complex nested structure
        return convert_dict_to_go(value, field_name)
    return str(value)

def convert_dict_to_go(d, context=""):
    """Convert a dictionary to Go struct initialization"""
    if not d:
        return "nil"
    
    # Handle special cases for Bonus structures
    if context == "bonus" or any(k in d for k in ['limitmodifier', 'skillcategory', 'specificskill', 'sociallimit', 
                                                    'toxincontactresist', 'firearmor', 'coldarmor', 'electricityarmor',
                                                    'radiationresist', 'fatigueresist', 'selectarmor', '+@unique', 'selecttext']):
        return convert_bonus_to_go(d)
    
    # Handle LimitModifier
    if 'limit' in d and 'value' in d and 'condition' in d:
        return f"LimitModifier{{\n\t\t\t\tLimit: {convert_value(d.get('limit'), 'limit')}, Value: {convert_value(d.get('value'), 'value')}, Condition: {convert_value(d.get('condition'), 'condition')},\n\t\t\t}}"
    
    # Handle SkillCategoryBonus
    if 'name' in d and 'bonus' in d and context != "modnameentry":
        bonus_val = d.get('bonus')
        if isinstance(bonus_val, str) and bonus_val.isdigit():
            bonus_val = int(bonus_val)
        return f"SkillCategoryBonus{{\n\t\t\t\tName: {convert_value(d.get('name'), 'name')}, Bonus: {bonus_val},\n\t\t\t}}"
    
    # Handle SpecificSkillBonus
    if 'name' in d and 'bonus' in d:
        bonus_val = d.get('bonus')
        if isinstance(bonus_val, str) and bonus_val.isdigit():
            bonus_val = int(bonus_val)
        return f"SpecificSkillBonus{{\n\t\t\t\tName: {convert_value(d.get('name'), 'name')}, Bonus: {bonus_val},\n\t\t\t}}"
    
    # Handle ModNameEntry
    if '+content' in d or '+@rating' in d or '+@maxrating' in d:
        content = convert_value(d.get('+content', ''), 'content')
        rating = d.get('+@rating', '')
        # Rating should always be a string in ModNameEntry (not int)
        if rating:
            # Ensure rating is a string, not an int
            rating_str = f'"{str(rating)}"'
            parts = [f"Content: {content}", f"Rating: {rating_str}"]
        else:
            parts = [f"Content: {content}"]
        # Note: ModNameEntry doesn't have MaxRating field, ignore it
        return f"ModNameEntry{{\n\t\t\t\t{', '.join(parts)},\n\t\t\t}}"
    
    # Handle SelectModsCategory
    if 'category' in d and len(d) == 1:
        return f"&SelectModsCategory{{\n\t\t\t\tCategory: {convert_value(d.get('category'), 'category')},\n\t\t\t}}"
    
    # Handle Gears
    if 'usegear' in d:
        usegear = d.get('usegear')
        if isinstance(usegear, str):
            return f"&Gears{{\n\t\t\t\tUseGear: {convert_value(usegear, 'usegear')},\n\t\t\t}}"
        elif isinstance(usegear, list):
            items = []
            for item in usegear:
                if isinstance(item, dict):
                    # Complex gear item - extract name if available, otherwise use a string representation
                    if '+content' in item:
                        gear_name = item.get('+content', 'Unknown')
                        items.append(f'"{gear_name}"')
                    elif 'name' in item:
                        gear_name = item.get('name', 'Unknown')
                        items.append(f'"{gear_name}"')
                    else:
                        # Fallback to string representation
                        items.append('"complex_gear"')
                else:
                    items.append(convert_value(item, 'usegear'))
            items_str = ', '.join(items)
            brace_open = '{'
            brace_close = '}'
            return f"&Gears{brace_open}\n\t\t\t\tUseGear: []interface{brace_open}{brace_close}{brace_open}{items_str}{brace_close},\n\t\t\t{brace_close}"
    
    # Handle Mods
    if 'name' in d and context != "bonus":
        name_val = d.get('name')
        if isinstance(name_val, str):
            return f"&Mods{{\n\t\t\t\tName: {convert_value(name_val, 'name')},\n\t\t\t}}"
        elif isinstance(name_val, list):
            items = []
            for item in name_val:
                if isinstance(item, dict):
                    items.append(convert_dict_to_go(item, "modnameentry"))
                else:
                    items.append(convert_value(item, 'name'))
            items_str = ', '.join(items)
            brace_open = '{'
            brace_close = '}'
            return f"&Mods{brace_open}\n\t\t\t\tName: []interface{brace_open}{brace_close}{brace_open}{items_str}{brace_close},\n\t\t\t{brace_close}"
        elif name_val is None:
            # Handle None/null case - return nil
            return "nil"
    
    # Handle Required
    if 'parentdetails' in d or 'oneof' in d:
        parts = []
        if 'parentdetails' in d:
            pd = d.get('parentdetails')
            parts.append(f"ParentDetails: &ParentDetails{{\n\t\t\t\t\tName: {convert_value(pd.get('name'), 'name')},\n\t\t\t\t}}")
        if 'oneof' in d:
            oo = d.get('oneof')
            if 'armormod' in oo:
                am = oo.get('armormod')
                parts.append(f"OneOf: &OneOf{{\n\t\t\t\t\tArmorMod: &ArmorModRef{{\n\t\t\t\t\t\tContent: {convert_value(am.get('+content', ''), 'content')}, SameParent: {convert_value(am.get('+@sameparent', ''), 'sameparent')},\n\t\t\t\t\t}},\n\t\t\t\t}}")
        return f"&Required{{\n\t\t\t\t{', '.join(parts)},\n\t\t\t}}"
    
    # Generic struct
    lines = []
    for k, v in d.items():
        go_key = to_snake_case(k) if not k.startswith('+') else k.replace('+', '').replace('@', '')
        lines.append(f"{go_key}: {convert_value(v, k)}")
    return "{\n\t\t\t\t" + ",\n\t\t\t\t".join(lines) + ",\n\t\t\t}"

def convert_bonus_to_go(d):
    """Convert bonus dictionary to Go Bonus struct"""
    parts = []
    
    # Handle limitmodifier (can be single or array)
    if 'limitmodifier' in d:
        lm = d.get('limitmodifier')
        if isinstance(lm, list):
            items = [convert_dict_to_go(item, "limitmodifier") for item in lm]
            items_str = ', '.join(items)
            brace_open = '{'
            brace_close = '}'
            parts.append(f"LimitModifier: []interface{brace_open}{brace_close}{brace_open}{items_str}{brace_close}")
        else:
            parts.append(f"LimitModifier: {convert_dict_to_go(lm, 'limitmodifier')}")
    
    # Handle skillcategory (can be single or array)
    if 'skillcategory' in d:
        sc = d.get('skillcategory')
        if isinstance(sc, list):
            items = [convert_dict_to_go(item, "skillcategory") for item in sc]
            items_str = ', '.join(items)
            brace_open = '{'
            brace_close = '}'
            parts.append(f"SkillCategory: []interface{brace_open}{brace_close}{brace_open}{items_str}{brace_close}")
        else:
            parts.append(f"SkillCategory: {convert_dict_to_go(sc, 'skillcategory')}")
    
    # Handle specificskill (can be single or array)
    if 'specificskill' in d:
        ss = d.get('specificskill')
        if isinstance(ss, list):
            items = [convert_dict_to_go(item, "specificskill") for item in ss]
            items_str = ', '.join(items)
            brace_open = '{'
            brace_close = '}'
            parts.append(f"SpecificSkill: []interface{brace_open}{brace_close}{brace_open}{items_str}{brace_close}")
        else:
            parts.append(f"SpecificSkill: {convert_dict_to_go(ss, 'specificskill')}")
    
    # Handle other bonus fields
    field_mapping = {
        'sociallimit': 'SocialLimit',
        'toxincontactresist': 'ToxinContactResist',
        'toxincontactimmune': 'ToxinContactImmune',
        'toxininhalationimmune': 'ToxinInhalationImmune',
        'pathogencontactresist': 'PathogenContactResist',
        'pathogencontactimmune': 'PathogenContactImmune',
        'pathogeninhalationimmune': 'PathogenInhalationImmune',
        'firearmor': 'FireArmor',
        'coldarmor': 'ColdArmor',
        'electricityarmor': 'ElectricityArmor',
        'radiationresist': 'RadiationResist',
        'fatigueresist': 'FatigueResist',
        'selectarmor': 'SelectArmor',
        '+@unique': 'Unique',
        'selecttext': 'SelectText',
    }
    for field, go_field in field_mapping.items():
        if field in d:
            value = d.get(field)
            if field in ['toxincontactimmune', 'toxininhalationimmune', 'pathogencontactimmune',
                        'pathogeninhalationimmune', 'selectarmor', 'selecttext']:
                if value is None:
                    brace_open = '{'
                    brace_close = '}'
                    parts.append(f"{go_field}: &[]bool{brace_open}true{brace_close}[0]")  # Pointer to true
                else:
                    brace_open = '{'
                    brace_close = '}'
                    parts.append(f"{go_field}: &[]bool{brace_open}{str(value).lower()}{brace_close}[0]")
            else:
                parts.append(f"{go_field}: {convert_value(value, field)}")
    
    if not parts:
        return "nil"
    
    return f"&Bonus{{\n\t\t\t\t{',\n\t\t\t\t'.join(parts)},\n\t\t\t}}"

def convert_armor_to_go(armor):
    """Convert armor JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'Name: {convert_value(armor.get("name"), "name")}')
    parts.append(f'Category: {convert_value(armor.get("category"), "category")}')
    parts.append(f'Armor: {convert_value(armor.get("armor"), "armor")}')
    parts.append(f'ArmorCapacity: {convert_value(armor.get("armorcapacity"), "armorcapacity")}')
    parts.append(f'Avail: {convert_value(armor.get("avail"), "avail")}')
    parts.append(f'Cost: {convert_value(armor.get("cost"), "cost")}')
    parts.append(f'Source: {convert_value(armor.get("source"), "source")}')
    
    # Optional fields
    if 'armoroverride' in armor:
        parts.append(f'ArmorOverride: {convert_value(armor.get("armoroverride"), "armoroverride")}')
    if 'rating' in armor:
        rating = armor.get("rating")
        if isinstance(rating, str) and rating.isdigit():
            parts.append(f'Rating: {int(rating)}')
        else:
            parts.append(f'Rating: {convert_value(rating, "rating")}')
    if 'addmodcategory' in armor:
        parts.append(f'AddModCategory: {convert_value(armor.get("addmodcategory"), "addmodcategory")}')
    if 'selectmodsfromcategory' in armor:
        parts.append(f'SelectModsFromCategory: {convert_dict_to_go(armor.get("selectmodsfromcategory"), "selectmods")}')
    if 'gears' in armor:
        parts.append(f'Gears: {convert_dict_to_go(armor.get("gears"), "gears")}')
    if 'addweapon' in armor:
        parts.append(f'AddWeapon: {convert_value(armor.get("addweapon"), "addweapon")}')
    if 'bonus' in armor:
        parts.append(f'Bonus: {convert_bonus_to_go(armor.get("bonus"))}')
    if 'wirelessbonus' in armor:
        parts.append(f'WirelessBonus: {convert_bonus_to_go(armor.get("wirelessbonus"))}')
    if 'mods' in armor:
        parts.append(f'Mods: {convert_dict_to_go(armor.get("mods"), "mods")}')
    
    return "{\n\t\t\t" + ",\n\t\t\t".join(parts) + ",\n\t\t}"

def convert_mod_to_go(mod):
    """Convert mod JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'Name: {convert_value(mod.get("name"), "name")}')
    parts.append(f'Category: {convert_value(mod.get("category"), "category")}')
    # Armor field - handle nil case
    armor_val = mod.get("armor")
    if armor_val is None:
        parts.append('Armor: "0"')
    else:
        parts.append(f'Armor: {convert_value(armor_val, "armor")}')
    
    # MaxRating - convert to int
    maxrating = mod.get("maxrating")
    if isinstance(maxrating, str) and maxrating.isdigit():
        parts.append(f'MaxRating: {int(maxrating)}')
    elif maxrating is not None:
        parts.append(f'MaxRating: {convert_value(maxrating, "maxrating")}')
    else:
        parts.append('MaxRating: 0')
    
    # ArmorCapacity field - handle nil case
    armorcap_val = mod.get("armorcapacity")
    if armorcap_val is None:
        parts.append('ArmorCapacity: "[0]"')
    else:
        parts.append(f'ArmorCapacity: {convert_value(armorcap_val, "armorcapacity")}')
    parts.append(f'Avail: {convert_value(mod.get("avail"), "avail")}')
    parts.append(f'Cost: {convert_value(mod.get("cost"), "cost")}')
    parts.append(f'Source: {convert_value(mod.get("source"), "source")}')
    
    # Optional fields
    if 'gearcapacity' in mod:
        gearcap = mod.get("gearcapacity")
        if isinstance(gearcap, str) and gearcap.isdigit():
            brace_open = '{'
            brace_close = '}'
            parts.append(f'GearCapacity: &[]int{brace_open}{int(gearcap)}{brace_close}[0]')
        else:
            parts.append(f'GearCapacity: {convert_value(gearcap, "gearcapacity")}')
    if 'hide' in mod:
        hide_val = mod.get("hide")
        if hide_val is None:
            parts.append('Hide: &[]bool{true}[0]')
        else:
            parts.append(f'Hide: &[]bool{{{str(hide_val).lower()}}}[0]')
    if 'required' in mod:
        parts.append(f'Required: {convert_dict_to_go(mod.get("required"), "required")}')
    if 'addoncategory' in mod:
        parts.append(f'AddonCategory: {convert_value(mod.get("addoncategory"), "addoncategory")}')
    if 'bonus' in mod:
        parts.append(f'Bonus: {convert_bonus_to_go(mod.get("bonus"))}')
    if 'wirelessbonus' in mod:
        parts.append(f'WirelessBonus: {convert_bonus_to_go(mod.get("wirelessbonus"))}')
    
    return "{\n\t\t\t" + ",\n\t\t\t".join(parts) + ",\n\t\t}"

# Read JSON file
with open('data/chummer/armor.json', 'r') as f:
    data = json.load(f)

# Generate armor entries
armor_entries = []
for armor in data['armors']['armor']:
    armor_id = to_snake_case(armor.get('name', ''))
    armor_go = convert_armor_to_go(armor)
    armor_entries.append(f'\t"{armor_id}": {armor_go}')

# Generate mod entries
mod_entries = []
for mod in data['mods']['mod']:
    mod_id = to_snake_case(mod.get('name', ''))
    mod_go = convert_mod_to_go(mod)
    mod_entries.append(f'\t"{mod_id}": {mod_go}')

# Write to file
with open('armor_data_generated.go', 'w') as f:
    f.write('package v5\n\n')
    f.write('// DataArmors contains armor records keyed by their ID (lowercase with underscores)\n')
    f.write('var DataArmors = map[string]Armor{\n')
    f.write(',\n'.join(armor_entries))
    f.write(',\n}\n\n')
    f.write('// DataArmorMods contains armor mod records keyed by their ID (lowercase with underscores)\n')
    f.write('var DataArmorMods = map[string]ArmorMod{\n')
    f.write(',\n'.join(mod_entries))
    f.write(',\n}\n')

print(f"Generated {len(armor_entries)} armor entries and {len(mod_entries)} mod entries")

