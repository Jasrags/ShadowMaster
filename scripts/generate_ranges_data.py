#!/usr/bin/env python3
"""Generate ranges_data.go from ranges.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    # Replace spaces and special chars with underscores
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_range_to_go(r, range_id):
    """Convert a range object to Go struct literal"""
    name = r["name"]
    min_val = r["min"]
    short = r["short"]
    medium = r["medium"]
    long_val = r["long"]
    extreme = r["extreme"]
    
    return f'''	"{range_id}": {{
		Name: {json.dumps(name)},
		Min: {json.dumps(min_val)},
		Short: {json.dumps(short)},
		Medium: {json.dumps(medium)},
		Long: {json.dumps(long_val)},
		Extreme: {json.dumps(extreme)},
	}},'''

def main():
    with open("data/chummer/ranges.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    print("package v5")
    print()
    
    # Modifiers
    modifiers = data["modifiers"]
    print("// DataRangeModifiers contains range modifier values")
    print("var DataRangeModifiers = map[string]string{")
    for key, value in sorted(modifiers.items()):
        print(f'	{json.dumps(key)}: {json.dumps(value)},')
    print("}")
    print()
    
    # Ranges
    ranges = data["ranges"]["range"]
    print("// DataRanges contains range table records keyed by their ID (lowercase with underscores)")
    print("var DataRanges = map[string]Range{")
    
    used_range_ids = {}
    for r in ranges:
        name = r["name"]
        range_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = range_id
        suffix = 0
        while range_id in used_range_ids:
            suffix += 1
            range_id = f"{original_id}_{suffix}"
        
        used_range_ids[range_id] = True
        print(convert_range_to_go(r, range_id))
    
    print("}")

if __name__ == "__main__":
    main()

