#!/usr/bin/env python3
"""Generate improvements_data.go from improvements.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    # Replace spaces and special chars with underscores
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_fields_to_go(fields):
    """Convert fields object to Go struct literal"""
    if not fields or "field" not in fields:
        return "nil"
    
    field = fields["field"]
    if field is None:
        return "nil"
    
    if isinstance(field, list):
        if len(field) == 0:
            return "nil"
        field_strs = [json.dumps(f) for f in field]
        field_list = ', '.join(field_strs)
        return f"&ImprovementFields{{Field: []interface{{}}{{{field_list}}}}}"
    elif isinstance(field, str):
        return f"&ImprovementFields{{Field: {json.dumps(field)}}}"
    
    return "nil"

def convert_xml_to_go(xml_val):
    """Convert XML value to *string or nil"""
    if xml_val is None:
        return "nil"
    if isinstance(xml_val, str):
        if xml_val == "":
            return "nil"
        return f'&[]string{{{json.dumps(xml_val)}}}[0]'
    return "nil"

def convert_improvement_to_go(improvement, improvement_id):
    """Convert an improvement object to Go struct literal"""
    improvement_id_str = improvement["id"]
    name = improvement["name"]
    internal = improvement["internal"]
    page = improvement["page"]
    
    # Handle optional fields
    fields_str = convert_fields_to_go(improvement.get("fields"))
    xml_str = convert_xml_to_go(improvement.get("xml"))
    
    # Build the struct
    lines = [
        f'	"{improvement_id}": {{',
        f'		Name: {json.dumps(name)},',
        f'		ID: {json.dumps(improvement_id_str)},',
        f'		Internal: {json.dumps(internal)},',
        f'		Page: {json.dumps(page)},',
    ]
    
    if fields_str != "nil":
        lines.append(f'		Fields: {fields_str},')
    if xml_str != "nil":
        lines.append(f'		XML: {xml_str},')
    
    lines.append("	},")
    return "\n".join(lines)

def main():
    with open("data/chummer/improvements.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    improvements = data["improvements"]["improvement"]
    
    print("package v5")
    print()
    print("// DataImprovements contains improvement records keyed by their ID (lowercase with underscores)")
    print("var DataImprovements = map[string]Improvement{")
    
    # Track used IDs to handle duplicates
    used_ids = {}
    
    for improvement in improvements:
        # Use name as the key, converted to snake_case
        name = improvement["name"]
        improvement_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = improvement_id
        suffix = 0
        while improvement_id in used_ids:
            suffix += 1
            improvement_id = f"{original_id}_{suffix}"
        
        used_ids[improvement_id] = True
        
        print(convert_improvement_to_go(improvement, improvement_id))
    
    print("}")

if __name__ == "__main__":
    main()

