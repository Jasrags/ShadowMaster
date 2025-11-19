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
    
    # Handle Specs
    if 'spec' in d:
        items = [convert_value(item, 'spec') for item in d.get('spec')]
        brace_open = '{'
        brace_close = '}'
        return f"&Specs{{\n\t\t\t\tSpec: []string{brace_open}{', '.join(items)}{brace_close},\n\t\t\t}}"
    
    # Generic struct
    lines = []
    for k, v in d.items():
        go_key = k.title() if not k.startswith('+') else k.replace('+', '').replace('@', '')
        lines.append(f"{go_key}: {convert_value(v, k)}")
    return "{\n\t\t\t\t" + ",\n\t\t\t\t".join(lines) + ",\n\t\t\t}"

def convert_skill_to_go(skill):
    """Convert skill JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'Name: {convert_value(skill.get("name"), "name")}')
    parts.append(f'Attribute: {convert_value(skill.get("attribute"), "attribute")}')
    parts.append(f'Category: {convert_value(skill.get("category"), "category")}')
    parts.append(f'Default: {convert_value(skill.get("default"), "default")}')
    # Source is optional for knowledge skills
    if 'source' in skill:
        parts.append(f'Source: {convert_value(skill.get("source"), "source")}')
    
    # Optional fields
    if 'skillgroup' in skill:
        sg = skill.get("skillgroup")
        if sg is None:
            parts.append('SkillGroup: nil')
        else:
            # SkillGroup is a *string, so we need to create a pointer
            sg_str = convert_value(sg, "skillgroup")
            brace_open = '{'
            brace_close = '}'
            parts.append(f'SkillGroup: &[]string{brace_open}{sg_str}{brace_close}[0]')
    if 'specs' in skill:
        parts.append(f'Specs: {convert_dict_to_go(skill.get("specs"), "specs")}')
    if 'exotic' in skill:
        ex = skill.get("exotic")
        if ex is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'Exotic: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'Exotic: &[]bool{brace_open}{str(ex).lower()}{brace_close}[0]')
    if 'page' in skill:
        parts.append(f'Page: {convert_value(skill.get("page"), "page")}')
    if 'requiresflymovement' in skill:
        rfm = skill.get("requiresflymovement")
        if rfm is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'RequiresFlyMovement: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'RequiresFlyMovement: &[]bool{brace_open}{str(rfm).lower()}{brace_close}[0]')
    if 'requiresgroundmovement' in skill:
        rgm = skill.get("requiresgroundmovement")
        if rgm is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'RequiresGroundMovement: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'RequiresGroundMovement: &[]bool{brace_open}{str(rgm).lower()}{brace_close}[0]')
    if 'requiresswimmovement' in skill:
        rsm = skill.get("requiresswimmovement")
        if rsm is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'RequiresSwimMovement: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'RequiresSwimMovement: &[]bool{brace_open}{str(rsm).lower()}{brace_close}[0]')
    
    return "{\n\t\t\t" + ",\n\t\t\t".join(parts) + ",\n\t\t}"

# Read JSON file
with open('data/chummer/skills.json', 'r') as f:
    data = json.load(f)

# Generate skill group entries
skillgroup_entries = []
for sg_name in data['skillgroups']['name']:
    skillgroup_entries.append(f'\t{convert_value(sg_name, "name")}')

# Generate category entries
category_entries = []
for category in data['categories']['category']:
    category_name = category.get('+content', '')
    category_id = to_snake_case(category_name)
    category_type = category.get('+@type', '')
    category_go = f'SkillCategory{{\n\t\t\tName: {convert_value(category_name, "name")}, Type: {convert_value(category_type, "type")},\n\t\t}}'
    category_entries.append(f'\t"{category_id}": {category_go}')

# Generate skill entries
skill_entries = []
for skill in data['skills']['skill']:
    skill_id = to_snake_case(skill.get('name', ''))
    skill_go = convert_skill_to_go(skill)
    skill_entries.append(f'\t"{skill_id}": {skill_go}')

# Generate knowledge skill entries
knowledgeskill_entries = []
for skill in data['knowledgeskills']['skill']:
    skill_id = to_snake_case(skill.get('name', ''))
    skill_go = convert_skill_to_go(skill)
    knowledgeskill_entries.append(f'\t"{skill_id}": {skill_go}')

# Write to file
with open('skills_data_generated.go', 'w') as f:
    f.write('package v5\n\n')
    f.write('// DataSkillGroups contains skill group names\n')
    f.write('var DataSkillGroups = []string{\n')
    f.write(',\n'.join(skillgroup_entries))
    f.write(',\n}\n\n')
    f.write('// DataSkillCategories contains skill categories keyed by their ID (lowercase with underscores)\n')
    f.write('var DataSkillCategories = map[string]SkillCategory{\n')
    f.write(',\n'.join(category_entries))
    f.write(',\n}\n\n')
    f.write('// DataSkills contains active skills keyed by their ID (lowercase with underscores)\n')
    f.write('var DataSkills = map[string]Skill{\n')
    f.write(',\n'.join(skill_entries))
    f.write(',\n}\n\n')
    f.write('// DataKnowledgeSkills contains knowledge skills keyed by their ID (lowercase with underscores)\n')
    f.write('var DataKnowledgeSkills = map[string]Skill{\n')
    f.write(',\n'.join(knowledgeskill_entries))
    f.write(',\n}\n')

print(f"Generated {len(skillgroup_entries)} skill groups, {len(category_entries)} categories, {len(skill_entries)} skills, and {len(knowledgeskill_entries)} knowledge skills")

