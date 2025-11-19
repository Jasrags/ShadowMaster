#!/usr/bin/env python3
"""Generate spiritpowers_data.go from spiritpowers.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    # Replace spaces and special chars with underscores
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def main():
    with open("data/chummer/spiritpowers.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    powers = data["powers"]["power"]
    
    print("package v5")
    print()
    print("// DataSpiritPowers contains spirit power records keyed by their ID (lowercase with underscores)")
    print("var DataSpiritPowers = map[string]SpiritPower{")
    
    # Track used IDs to handle duplicates
    used_ids = {}
    
    for power in powers:
        # Use name as the key, converted to snake_case
        name = power["name"]
        power_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = power_id
        suffix = 0
        while power_id in used_ids:
            suffix += 1
            power_id = f"{original_id}_{suffix}"
        
        used_ids[power_id] = True
        
        source = power["source"]
        page = power["page"]
        
        print(f'''	"{power_id}": {{
		Name: {json.dumps(name)},
		Source: {json.dumps(source)},
		Page: {json.dumps(page)},
	}},''')
    
    print("}")

if __name__ == "__main__":
    main()

