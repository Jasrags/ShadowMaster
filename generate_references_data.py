#!/usr/bin/env python3
"""Generate references_data.go from references.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    # Replace spaces and special chars with underscores
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_reference_to_go(ref, ref_id):
    """Convert a reference object to Go struct literal"""
    ref_id_str = ref["id"]
    name = ref["name"]
    source = ref["source"]
    page = ref["page"]
    
    return f'''	"{ref_id}": {{
		ID: "{ref_id_str}",
		Name: {json.dumps(name)},
		Source: {json.dumps(source)},
		Page: {json.dumps(page)},
	}},'''

def main():
    with open("data/chummer/references.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    print("package v5")
    print()
    
    # References (rules)
    references = data["rules"]["rule"]
    print("// DataReferences contains reference records keyed by their ID (lowercase with underscores)")
    print("// These are page references to rules, sections, or content in sourcebooks")
    print("var DataReferences = map[string]Reference{")
    
    used_ref_ids = {}
    for ref in references:
        name = ref["name"]
        ref_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = ref_id
        suffix = 0
        while ref_id in used_ref_ids:
            suffix += 1
            ref_id = f"{original_id}_{suffix}"
        
        used_ref_ids[ref_id] = True
        print(convert_reference_to_go(ref, ref_id))
    
    print("}")

if __name__ == "__main__":
    main()

