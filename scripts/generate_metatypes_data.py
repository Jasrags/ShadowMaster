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
    
    # Handle MetatypeQualities
    if 'positive' in d or 'negative' in d:
        parts = []
        if 'positive' in d:
            pos = d.get('positive')
            if pos and 'quality' in pos:
                q = pos.get('quality')
                if isinstance(q, list):
                    items = []
                    for item in q:
                        if isinstance(item, dict):
                            # Complex quality object - convert to map[string]interface{}
                            item_parts = []
                            for k, v in item.items():
                                # All keys need to be quoted for map[string]interface{}
                                item_parts.append(f'"{k}": {convert_value(v, k)}')
                            brace_open = '{'
                            brace_close = '}'
                            items.append(f'map[string]interface{brace_open}{brace_close}{brace_open}{", ".join(item_parts)}{brace_close}')
                        else:
                            items.append(convert_value(item, 'quality'))
                    brace_open = '{'
                    brace_close = '}'
                    parts.append(f"Positive: &MetatypeQualityList{{\n\t\t\t\t\tQuality: []interface{brace_open}{brace_close}{brace_open}{', '.join(items)}{brace_close},\n\t\t\t\t}}")
                else:
                    # Single quality - could be string or dict
                    if isinstance(q, dict):
                        # Convert dict to map[string]interface{}
                        item_parts = []
                        for k, v in q.items():
                            item_parts.append(f'"{k}": {convert_value(v, k)}')
                        brace_open = '{'
                        brace_close = '}'
                        q_str = f'map[string]interface{brace_open}{brace_close}{brace_open}{", ".join(item_parts)}{brace_close}'
                        parts.append(f"Positive: &MetatypeQualityList{{\n\t\t\t\t\tQuality: {q_str},\n\t\t\t\t}}")
                    else:
                        parts.append(f"Positive: &MetatypeQualityList{{\n\t\t\t\t\tQuality: {convert_value(q, 'quality')},\n\t\t\t\t}}")
        if 'negative' in d:
            neg = d.get('negative')
            if neg and 'quality' in neg:
                q = neg.get('quality')
                if isinstance(q, list):
                    items = []
                    for item in q:
                        if isinstance(item, dict):
                            # Complex quality object - convert to map[string]interface{}
                            item_parts = []
                            for k, v in item.items():
                                # All keys need to be quoted for map[string]interface{}
                                item_parts.append(f'"{k}": {convert_value(v, k)}')
                            brace_open = '{'
                            brace_close = '}'
                            items.append(f'map[string]interface{brace_open}{brace_close}{brace_open}{", ".join(item_parts)}{brace_close}')
                        else:
                            items.append(convert_value(item, 'quality'))
                    brace_open = '{'
                    brace_close = '}'
                    parts.append(f"Negative: &MetatypeQualityList{{\n\t\t\t\t\tQuality: []interface{brace_open}{brace_close}{brace_open}{', '.join(items)}{brace_close},\n\t\t\t\t}}")
                else:
                    # Single quality - could be string or dict
                    if isinstance(q, dict):
                        # Convert dict to map[string]interface{}
                        item_parts = []
                        for k, v in q.items():
                            item_parts.append(f'"{k}": {convert_value(v, k)}')
                        brace_open = '{'
                        brace_close = '}'
                        q_str = f'map[string]interface{brace_open}{brace_close}{brace_open}{", ".join(item_parts)}{brace_close}'
                        parts.append(f"Negative: &MetatypeQualityList{{\n\t\t\t\t\tQuality: {q_str},\n\t\t\t\t}}")
                    else:
                        parts.append(f"Negative: &MetatypeQualityList{{\n\t\t\t\t\tQuality: {convert_value(q, 'quality')},\n\t\t\t\t}}")
        if parts:
            return f"&MetatypeQualities{{\n\t\t\t\t{', '.join(parts)},\n\t\t\t}}"
        return "nil"
    
    # Handle MetatypeBonus
    if 'lifestylecost' in d:
        # Simple bonus with just lifestylecost
        return f"&MetatypeBonus{{\n\t\t\t\t\tLifestyleCost: {convert_value(d.get('lifestylecost'), 'lifestylecost')},\n\t\t\t\t}}"
    # Complex bonus with other fields - set to nil for now
    # TODO: Expand MetatypeBonus struct to handle complex bonuses
    return "nil"
    
    # Generic struct
    lines = []
    for k, v in d.items():
        go_key = k.title() if not k.startswith('+') else k.replace('+', '').replace('@', '')
        lines.append(f"{go_key}: {convert_value(v, k)}")
    return "{\n\t\t\t\t" + ",\n\t\t\t\t".join(lines) + ",\n\t\t\t}"

def convert_metavariant_to_go(mv):
    """Convert metavariant JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'ID: {convert_value(mv.get("id"), "id")}')
    parts.append(f'Name: {convert_value(mv.get("name"), "name")}')
    parts.append(f'Category: {convert_value(mv.get("category"), "category")}')
    # Karma can be string or array - if array, take first value or convert to string
    karma_val = mv.get("karma")
    if isinstance(karma_val, list):
        karma_val = karma_val[0] if karma_val else "0"
    parts.append(f'Karma: {convert_value(karma_val, "karma")}')
    
    # Attribute limits - all are ints
    attr_fields = [
        ('bodmin', 'BODMin'), ('bodmax', 'BODMax'), ('bodaug', 'BODAug'),
        ('agimin', 'AGIMin'), ('agimax', 'AGIMax'), ('agiaug', 'AGIAug'),
        ('reamin', 'REAMin'), ('reamax', 'REAMax'), ('reaaug', 'REAAug'),
        ('strmin', 'STRMin'), ('strmax', 'STRMax'), ('straug', 'STRAug'),
        ('chamin', 'CHAMin'), ('chamax', 'CHAMax'), ('chaaug', 'CHAAug'),
        ('intmin', 'INTMin'), ('intmax', 'INTMax'), ('intaug', 'INTAug'),
        ('logmin', 'LOGMin'), ('logmax', 'LOGMax'), ('logaug', 'LOGAug'),
        ('wilmin', 'WILMin'), ('wilmax', 'WILMax'), ('wilaug', 'WILAug'),
        ('inimin', 'INIMin'), ('inimax', 'INIMax'), ('iniaug', 'INIAug'),
        ('edgmin', 'EDGMin'), ('edgmax', 'EDGMax'), ('edgaug', 'EDGAug'),
        ('magmin', 'MAGMin'), ('magmax', 'MAGMax'), ('magaug', 'MAGAug'),
        ('resmin', 'RESMin'), ('resmax', 'RESMax'), ('resaug', 'RESAug'),
        ('essmin', 'ESSMin'), ('essmax', 'ESSMax'), ('essaug', 'ESSAug'),
        ('depmin', 'DEPMin'), ('depmax', 'DEPMax'), ('depaug', 'DEPAug'),
    ]
    for json_field, go_field in attr_fields:
        if json_field in mv:
            val = mv.get(json_field)
            # Convert string to int
            if isinstance(val, str):
                try:
                    val = int(val)
                except ValueError:
                    val = 0
            parts.append(f'{go_field}: {val}')
    
    # Optional fields
    if 'qualities' in mv:
        q = mv.get("qualities")
        if isinstance(q, dict):
            parts.append(f'Qualities: {convert_dict_to_go(q, "qualities")}')
        else:
            parts.append('Qualities: nil')  # Handle list or other types
    if 'bonus' in mv:
        bonus = mv.get("bonus")
        if bonus is None:
            parts.append('Bonus: nil')
        elif isinstance(bonus, dict):
            parts.append(f'Bonus: {convert_dict_to_go(bonus, "bonus")}')
        else:
            parts.append('Bonus: nil')  # Handle list or other types
    if 'source' in mv:
        parts.append(f'Source: {convert_value(mv.get("source"), "source")}')
    if 'page' in mv:
        parts.append(f'Page: {convert_value(mv.get("page"), "page")}')
    
    return "{\n\t\t\t\t" + ",\n\t\t\t\t".join(parts) + ",\n\t\t\t}"

def convert_metatype_to_go(metatype):
    """Convert metatype JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'ID: {convert_value(metatype.get("id"), "id")}')
    parts.append(f'Name: {convert_value(metatype.get("name"), "name")}')
    parts.append(f'Category: {convert_value(metatype.get("category"), "category")}')
    parts.append(f'Karma: {convert_value(metatype.get("karma"), "karma")}')
    
    # Attribute limits - all are ints
    attr_fields = [
        ('bodmin', 'BODMin'), ('bodmax', 'BODMax'), ('bodaug', 'BODAug'),
        ('agimin', 'AGIMin'), ('agimax', 'AGIMax'), ('agiaug', 'AGIAug'),
        ('reamin', 'REAMin'), ('reamax', 'REAMax'), ('reaaug', 'REAAug'),
        ('strmin', 'STRMin'), ('strmax', 'STRMax'), ('straug', 'STRAug'),
        ('chamin', 'CHAMin'), ('chamax', 'CHAMax'), ('chaaug', 'CHAAug'),
        ('intmin', 'INTMin'), ('intmax', 'INTMax'), ('intaug', 'INTAug'),
        ('logmin', 'LOGMin'), ('logmax', 'LOGMax'), ('logaug', 'LOGAug'),
        ('wilmin', 'WILMin'), ('wilmax', 'WILMax'), ('wilaug', 'WILAug'),
        ('inimin', 'INIMin'), ('inimax', 'INIMax'), ('iniaug', 'INIAug'),
        ('edgmin', 'EDGMin'), ('edgmax', 'EDGMax'), ('edgaug', 'EDGAug'),
        ('magmin', 'MAGMin'), ('magmax', 'MAGMax'), ('magaug', 'MAGAug'),
        ('resmin', 'RESMin'), ('resmax', 'RESMax'), ('resaug', 'RESAug'),
        ('essmin', 'ESSMin'), ('essmax', 'ESSMax'), ('essaug', 'ESSAug'),
        ('depmin', 'DEPMin'), ('depmax', 'DEPMax'), ('depaug', 'DEPAug'),
    ]
    for json_field, go_field in attr_fields:
        if json_field in metatype:
            val = metatype.get(json_field)
            # Convert string to int
            if isinstance(val, str):
                try:
                    val = int(val)
                except ValueError:
                    val = 0
            parts.append(f'{go_field}: {val}')
    
    # Movement fields
    if 'walk' in metatype:
        parts.append(f'Walk: {convert_value(metatype.get("walk"), "walk")}')
    if 'run' in metatype:
        parts.append(f'Run: {convert_value(metatype.get("run"), "run")}')
    if 'sprint' in metatype:
        parts.append(f'Sprint: {convert_value(metatype.get("sprint"), "sprint")}')
    
    # Optional fields
    if 'qualities' in metatype:
        q = metatype.get("qualities")
        if isinstance(q, dict):
            parts.append(f'Qualities: {convert_dict_to_go(q, "qualities")}')
        else:
            parts.append('Qualities: nil')  # Handle list or other types
    if 'bonus' in metatype:
        bonus = metatype.get("bonus")
        if bonus is None:
            parts.append('Bonus: nil')
        elif isinstance(bonus, dict):
            parts.append(f'Bonus: {convert_dict_to_go(bonus, "bonus")}')
        else:
            parts.append('Bonus: nil')  # Handle list or other types
    if 'metavariants' in metatype:
        mv_data = metatype.get("metavariants")
        if mv_data and 'metavariant' in mv_data:
            mv = mv_data.get('metavariant')
            if mv is None:
                parts.append('Metavariants: nil')
            elif isinstance(mv, list):
                mv_parts = [convert_metavariant_to_go(m) for m in mv]
                mv_str = ',\n\t\t\t\t\t\t'.join(mv_parts)
                parts.append(f'Metavariants: &Metavariants{{\n\t\t\t\t\tMetavariant: []Metavariant{{\n\t\t\t\t\t\t{mv_str},\n\t\t\t\t\t}},\n\t\t\t\t}}')
            else:
                mv_go = convert_metavariant_to_go(mv)
                # For single metavariant, assign directly (interface{} can hold the struct)
                parts.append(f'Metavariants: &Metavariants{{\n\t\t\t\t\tMetavariant: {mv_go},\n\t\t\t\t}}')
        else:
            parts.append('Metavariants: nil')
    if 'source' in metatype:
        parts.append(f'Source: {convert_value(metatype.get("source"), "source")}')
    if 'page' in metatype:
        parts.append(f'Page: {convert_value(metatype.get("page"), "page")}')
    
    # Handle other optional interface{} fields
    if 'powers' in metatype:
        parts.append('Powers: nil')  # TODO: Handle complex powers structure
    if 'addweapon' in metatype:
        parts.append(f'AddWeapon: {convert_value(metatype.get("addweapon"), "addweapon")}')
    if 'halveattributepoints' in metatype:
        hap = metatype.get("halveattributepoints")
        if hap is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'HalveAttributePoints: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'HalveAttributePoints: &[]bool{brace_open}{str(hap).lower()}{brace_close}[0]')
    if 'movement' in metatype:
        parts.append('Movement: nil')  # TODO: Handle complex movement structure
    if 'qualityrestriction' in metatype:
        parts.append('QualityRestriction: nil')  # TODO: Handle quality restrictions
    
    return "{\n\t\t\t" + ",\n\t\t\t".join(parts) + ",\n\t\t}"

# Read JSON file
with open('data/chummer/metatypes.json', 'r') as f:
    data = json.load(f)

# Generate category entries
category_entries = []
for category in data['categories']['category']:
    category_entries.append(f'\t{convert_value(category, "category")}')

# Generate metatype entries
metatype_entries = []
for metatype in data['metatypes']['metatype']:
    metatype_id = to_snake_case(metatype.get('name', ''))
    metatype_go = convert_metatype_to_go(metatype)
    metatype_entries.append(f'\t"{metatype_id}": {metatype_go}')

# Write to file
with open('metatypes_data_generated.go', 'w') as f:
    f.write('package v5\n\n')
    f.write('// DataMetatypeCategories contains metatype category names\n')
    f.write('var DataMetatypeCategories = []string{\n')
    f.write(',\n'.join(category_entries))
    f.write(',\n}\n\n')
    f.write('// DataMetatypes contains metatype records keyed by their ID (lowercase with underscores)\n')
    f.write('var DataMetatypes = map[string]Metatype{\n')
    f.write(',\n'.join(metatype_entries))
    f.write(',\n}\n')

print(f"Generated {len(category_entries)} categories and {len(metatype_entries)} metatypes")

