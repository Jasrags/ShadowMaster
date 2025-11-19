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

def convert_spell_to_go(spell):
    """Convert spell JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'Name: {convert_value(spell.get("name"), "name")}')
    parts.append(f'Category: {convert_value(spell.get("category"), "category")}')
    parts.append(f'Type: {convert_value(spell.get("type"), "type")}')
    parts.append(f'Range: {convert_value(spell.get("range"), "range")}')
    parts.append(f'Duration: {convert_value(spell.get("duration"), "duration")}')
    parts.append(f'DV: {convert_value(spell.get("dv"), "dv")}')
    parts.append(f'Source: {convert_value(spell.get("source"), "source")}')
    
    # Optional fields
    if 'page' in spell and spell.get("page"):
        parts.append(f'Page: {convert_value(spell.get("page"), "page")}')
    if 'damage' in spell and spell.get("damage"):
        parts.append(f'Damage: {convert_value(spell.get("damage"), "damage")}')
    if 'descriptor' in spell and spell.get("descriptor"):
        parts.append(f'Descriptor: {convert_value(spell.get("descriptor"), "descriptor")}')
    if 'bonus' in spell:
        bonus = spell.get("bonus")
        if bonus:
            parts.append('Bonus: nil')  # TODO: Handle complex bonus structures
    if 'required' in spell:
        req = spell.get("required")
        if req:
            parts.append('Required: nil')  # TODO: Handle complex required structures
    
    return "{\n\t\t\t" + ",\n\t\t\t".join(parts) + ",\n\t\t}"

# Read JSON file
with open('data/chummer/spells.json', 'r') as f:
    data = json.load(f)

# Generate category entries
category_entries = []
for category in data['categories']['category']:
    category_name = category.get('+content', '')
    category_id = to_snake_case(category_name)
    
    parts = [
        f'Name: {convert_value(category_name, "name")}',
    ]
    
    if '+@useskill' in category:
        parts.append(f'UseSkill: {convert_value(category.get("+@useskill"), "use_skill")}')
    if '+@alchemicalskill' in category:
        parts.append(f'AlchemicalSkill: {convert_value(category.get("+@alchemicalskill"), "alchemical_skill")}')
    if '+@barehandedadeptskill' in category:
        parts.append(f'BarehandedAdeptSkill: {convert_value(category.get("+@barehandedadeptskill"), "barehanded_adept_skill")}')
    
    category_go = f'SpellCategory{{\n\t\t\t{", ".join(parts)},\n\t\t}}'
    category_entries.append(f'\t"{category_id}": {category_go}')

# Generate spell entries
spell_entries = []
spell_ids_seen = {}
for spell in data['spells']['spell']:
    spell_id = to_snake_case(spell.get('name', ''))
    # Handle duplicate IDs by appending a suffix
    if spell_id in spell_ids_seen:
        spell_ids_seen[spell_id] += 1
        spell_id = f"{spell_id}_{spell_ids_seen[spell_id]}"
    else:
        spell_ids_seen[spell_id] = 0
    spell_go = convert_spell_to_go(spell)
    spell_entries.append(f'\t"{spell_id}": {spell_go}')

# Write to file
with open('spells_data_generated.go', 'w') as f:
    f.write('package v5\n\n')
    f.write('// DataSpellCategories contains spell categories keyed by their ID (lowercase with underscores)\n')
    f.write('var DataSpellCategories = map[string]SpellCategory{\n')
    f.write(',\n'.join(category_entries))
    f.write(',\n}\n\n')
    f.write('// DataSpells contains spell records keyed by their ID (lowercase with underscores)\n')
    f.write('var DataSpells = map[string]Spell{\n')
    f.write(',\n'.join(spell_entries))
    f.write(',\n}\n')

print(f"Generated {len(category_entries)} categories and {len(spell_entries)} spells")

