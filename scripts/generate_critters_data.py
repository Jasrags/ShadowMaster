#!/usr/bin/env python3
import json
import re

def to_snake_case(name):
    """Convert name to lowercase with underscores"""
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower().strip('_')

def convert_value(value, field_name):
    """Convert JSON value to Go value"""
    if value is None:
        return None
    if isinstance(value, bool):
        return ("bool", "true" if value else "false")
    if isinstance(value, int):
        return ("int", str(value))
    if isinstance(value, str):
        return ("string", f'"{value.replace('"', '\\"')}"')
    if isinstance(value, list):
        items = [f'"{item}"' if isinstance(item, str) else str(item) for item in value]
        return ("list", f"[]string{{{', '.join(items)}}}")
    if isinstance(value, dict):
        return None
    return ("string", str(value))

def convert_critter_power_to_go(power):
    """Convert critter power JSON to Go struct"""
    if isinstance(power, str):
        return f'"{power}"'
    elif isinstance(power, dict):
        content = power.get('+content', '')
        select = power.get('+@select', '')
        parts = [f'Content: "{content}"']
        if select:
            parts.append(f'Select: "{select}"')
        return f'CritterPower{{\n\t\t\t\t\t\t{", ".join(parts)},\n\t\t\t\t\t}}'
    return '""'

def convert_critter_powers_to_go(powers):
    """Convert critter powers JSON to Go struct"""
    if not powers or 'power' not in powers:
        return "nil"
    
    power = powers.get('power')
    if isinstance(power, list):
        items = [convert_critter_power_to_go(p) for p in power]
        # Check if all are strings
        all_strings = all(isinstance(p, str) for p in power)
        if all_strings:
            return f"&CritterPowers{{\n\t\t\t\t\tPower: []string{{\n\t\t\t\t\t\t{', '.join(items)},\n\t\t\t\t\t}},\n\t\t\t\t}}"
        else:
            # Mixed or all objects - use interface{}
            brace_open = '{'
            brace_close = '}'
            return f"&CritterPowers{brace_open}\n\t\t\t\t\tPower: []interface{brace_open}{brace_close}{brace_open}\n\t\t\t\t\t\t{', '.join(items)},\n\t\t\t\t\t{brace_close},\n\t\t\t\t{brace_close}"
    elif isinstance(power, str):
        return f"&CritterPowers{{\n\t\t\t\t\tPower: \"{power}\",\n\t\t\t\t}}"
    else:
        power_go = convert_critter_power_to_go(power)
        return f"&CritterPowers{{\n\t\t\t\t\tPower: {power_go},\n\t\t\t\t}}"

def convert_critter_skill_to_go(skill):
    """Convert critter skill JSON to Go struct"""
    if isinstance(skill, dict):
        name = skill.get('+content', '')
        rating = skill.get('+@rating', '')
        spec = skill.get('+@spec', '')
        parts = [f'Name: "{name}"', f'Rating: "{rating}"']
        if spec:
            parts.append(f'Spec: "{spec}"')
        return f'CritterSkill{{\n\t\t\t\t\t\t{", ".join(parts)},\n\t\t\t\t\t}}'
    return 'CritterSkill{}'

def convert_critter_skills_to_go(skills):
    """Convert critter skills JSON to Go struct"""
    if not skills or 'skill' not in skills:
        return "nil"
    
    skill = skills.get('skill')
    if isinstance(skill, list):
        items = [convert_critter_skill_to_go(s) for s in skill]
        return f"&CritterSkills{{\n\t\t\t\t\tSkill: []CritterSkill{{\n\t\t\t\t\t\t{', '.join(items)},\n\t\t\t\t\t}},\n\t\t\t\t}}"
    else:
        skill_go = convert_critter_skill_to_go(skill)
        return f"&CritterSkills{{\n\t\t\t\t\tSkill: {skill_go},\n\t\t\t\t}}"

def convert_critter_bonus_to_go(bonus):
    """Convert critter bonus JSON to Go struct"""
    if not bonus:
        return "nil"
    
    parts = []
    if 'enabletab' in bonus:
        enable_tab = bonus.get('enabletab')
        if isinstance(enable_tab, dict):
            name = enable_tab.get('name', '')
            brace_open = '{'
            brace_close = '}'
            parts.append(f'EnableTab: map[string]interface{brace_open}{brace_close}{brace_open}\n\t\t\t\t\t\t"name": "{name}",\n\t\t\t\t\t{brace_close}')
        else:
            parts.append('EnableTab: nil')
    if 'initiativepass' in bonus:
        parts.append(f'InitiativePass: "{bonus.get("initiativepass")}"')
    
    if not parts:
        return "nil"
    
    return f"&CritterBonus{{\n\t\t\t\t\t{', '.join(parts)},\n\t\t\t\t}}"

def convert_critter_to_go(critter):
    """Convert critter JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'ID: "{critter.get("id")}"')
    parts.append(f'Name: "{critter.get("name")}"')
    parts.append(f'Category: "{critter.get("category")}"')
    parts.append(f'Karma: "{critter.get("karma")}"')
    
    # Attribute limits (all required, convert to int)
    attr_fields = [
        'bodmin', 'bodmax', 'bodaug', 'agimin', 'agimax', 'agiaug',
        'reamin', 'reamax', 'reaaug', 'strmin', 'strmax', 'straug',
        'chamin', 'chamax', 'chaaug', 'intmin', 'intmax', 'intaug',
        'logmin', 'logmax', 'logaug', 'wilmin', 'wilmax', 'wilaug',
        'inimin', 'inimax', 'iniaug', 'edgmin', 'edgmax', 'edgaug',
        'magmin', 'magmax', 'magaug', 'resmin', 'resmax', 'resaug',
        'depmin', 'depmax', 'depaug', 'essmin', 'essmax', 'essaug',
    ]
    
    # Map attribute names to Go field names
    attr_map = {
        'bodmin': 'BODMin', 'bodmax': 'BODMax', 'bodaug': 'BODAug',
        'agimin': 'AGIMin', 'agimax': 'AGIMax', 'agiaug': 'AGIAug',
        'reamin': 'REAMin', 'reamax': 'REAMax', 'reaaug': 'REAAug',
        'strmin': 'STRMin', 'strmax': 'STRMax', 'straug': 'STRAug',
        'chamin': 'CHAMin', 'chamax': 'CHAMax', 'chaaug': 'CHAAug',
        'intmin': 'INTMin', 'intmax': 'INTMax', 'intaug': 'INTAug',
        'logmin': 'LOGMin', 'logmax': 'LOGMax', 'logaug': 'LOGAug',
        'wilmin': 'WILMin', 'wilmax': 'WILMax', 'wilaug': 'WILAug',
        'inimin': 'INIMin', 'inimax': 'INIMax', 'iniaug': 'INIAug',
        'edgmin': 'EDGMin', 'edgmax': 'EDGMax', 'edgaug': 'EDGAug',
        'magmin': 'MAGMin', 'magmax': 'MAGMax', 'magaug': 'MAGAug',
        'resmin': 'RESMin', 'resmax': 'RESMax', 'resaug': 'RESAug',
        'depmin': 'DEPMin', 'depmax': 'DEPMax', 'depaug': 'DEPAug',
        'essmin': 'ESSMin', 'essmax': 'ESSMax', 'essaug': 'ESSAug',
    }
    
    for attr in attr_fields:
        val = critter.get(attr, "0")
        # Convert to int
        try:
            int_val = int(val)
        except:
            int_val = 0
        go_field = attr_map.get(attr, attr.upper())
        parts.append(f'{go_field}: {int_val}')
    
    # Movement (required)
    parts.append(f'Walk: "{critter.get("walk")}"')
    parts.append(f'Run: "{critter.get("run")}"')
    parts.append(f'Sprint: "{critter.get("sprint")}"')
    
    # Optional fields
    if 'bonus' in critter:
        parts.append(f'Bonus: {convert_critter_bonus_to_go(critter.get("bonus"))}')
    if 'powers' in critter:
        parts.append(f'Powers: {convert_critter_powers_to_go(critter.get("powers"))}')
    if 'skills' in critter:
        parts.append(f'Skills: {convert_critter_skills_to_go(critter.get("skills"))}')
    if 'source' in critter:
        parts.append(f'Source: "{critter.get("source")}"')
    if 'page' in critter:
        parts.append(f'Page: "{critter.get("page")}"')
    
    return "{\n\t\t\t" + ",\n\t\t\t".join(parts) + ",\n\t\t}"

# Read JSON file
with open('data/chummer/critters.json', 'r') as f:
    data = json.load(f)

# Generate category entries (just strings)
category_entries = []
for category in data['categories']['category']:
    category_name = category if isinstance(category, str) else category.get('+content', '')
    category_id = to_snake_case(category_name)
    category_go = f'CritterCategory{{\n\t\t\tName: "{category_name}",\n\t\t}}'
    category_entries.append(f'\t"{category_id}": {category_go}')

# Generate critter entries
critter_entries = []
critter_ids_seen = {}
for critter in data['metatypes']['metatype']:
    critter_id = to_snake_case(critter.get('name', ''))
    if critter_id in critter_ids_seen:
        critter_ids_seen[critter_id] += 1
        critter_id = f"{critter_id}_{critter_ids_seen[critter_id]}"
    else:
        critter_ids_seen[critter_id] = 0
    critter_go = convert_critter_to_go(critter)
    critter_entries.append(f'\t"{critter_id}": {critter_go}')

# Write to file
with open('critters_data_generated.go', 'w') as f:
    f.write('package v5\n\n')
    f.write('// DataCritterCategories contains critter categories keyed by their ID (lowercase with underscores)\n')
    f.write('var DataCritterCategories = map[string]CritterCategory{\n')
    f.write(',\n'.join(category_entries))
    f.write(',\n}\n\n')
    f.write('// DataCritters contains critter records keyed by their ID (lowercase with underscores)\n')
    f.write('var DataCritters = map[string]Critter{\n')
    f.write(',\n'.join(critter_entries))
    f.write(',\n}\n')

print(f"Generated {len(category_entries)} categories and {len(critter_entries)} critters")

