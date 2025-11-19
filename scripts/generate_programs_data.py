#!/usr/bin/env python3
"""Generate programs_data.go from programs.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    # Replace spaces and special chars with underscores
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def main():
    with open("data/chummer/programs.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    categories = data["categories"]["category"]
    programs = data["programs"]["program"]
    
    print("package v5")
    print()
    print("// DataProgramCategories contains program categories")
    print("var DataProgramCategories = []string{")
    for cat in categories:
        print(f'	{json.dumps(cat)},')
    print("}")
    print()
    print("// DataPrograms contains program records keyed by their ID (lowercase with underscores)")
    print("var DataPrograms = map[string]Program{")
    
    # Track used IDs to handle duplicates
    used_ids = {}
    
    for program in programs:
        # Use name as the key, converted to snake_case
        name = program["name"]
        program_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = program_id
        suffix = 0
        while program_id in used_ids:
            suffix += 1
            program_id = f"{original_id}_{suffix}"
        
        used_ids[program_id] = True
        
        program_id_str = program["id"]
        category = program["category"]
        avail = program["avail"]
        cost = program["cost"]
        source = program["source"]
        page = program["page"]
        
        print(f'''	"{program_id}": {{
		ID: "{program_id_str}",
		Name: {json.dumps(name)},
		Category: {json.dumps(category)},
		Avail: {json.dumps(avail)},
		Cost: {json.dumps(cost)},
		Source: {json.dumps(source)},
		Page: {json.dumps(page)},
	}},''')
    
    print("}")

if __name__ == "__main__":
    main()

