#!/usr/bin/env python3
"""Generate lifestyles_data.go from lifestyles.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    # Replace spaces and special chars with underscores
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_string_ptr(value):
    """Convert a value to *string or nil"""
    if value is None:
        return "nil"
    if isinstance(value, str):
        if value == "":
            return "nil"
        return f'&[]string{{{json.dumps(value)}}}[0]'
    return "nil"

def convert_freegrid_to_go(freegrid):
    """Convert a freegrid object to Go struct literal"""
    if not freegrid:
        return "nil"
    
    content = freegrid.get("+content", "")
    select_val = freegrid.get("+@select", "")
    
    return f'FreeGrid{{Content: {json.dumps(content)}, Select: {json.dumps(select_val)}}}'

def convert_freegrids_to_go(freegrids):
    """Convert freegrids object to Go struct literal"""
    if not freegrids or "freegrid" not in freegrids:
        return "nil"
    
    freegrid_list = freegrids["freegrid"]
    if not freegrid_list:
        return "nil"
    
    if isinstance(freegrid_list, list):
        if len(freegrid_list) == 0:
            return "nil"
        grid_strs = [convert_freegrid_to_go(fg) for fg in freegrid_list]
        grids_list = ', '.join(grid_strs)
        # Use string concatenation to avoid f-string brace issues
        return "&FreeGrids{FreeGrid: []interface{}{" + grids_list + "}}"
    elif isinstance(freegrid_list, dict):
        grid_str = convert_freegrid_to_go(freegrid_list)
        return f'&FreeGrids{{FreeGrid: {grid_str}}}'
    
    return "nil"

def convert_lifestyle_to_go(lifestyle, lifestyle_id):
    """Convert a lifestyle object to Go struct literal"""
    lifestyle_id_str = lifestyle["id"]
    name = lifestyle["name"]
    cost = lifestyle["cost"]
    dice = lifestyle["dice"]
    lp = lifestyle["lp"]
    multiplier = lifestyle["multiplier"]
    source = lifestyle["source"]
    page = lifestyle["page"]
    
    # Handle optional fields
    hide_str = convert_string_ptr(lifestyle.get("hide"))
    freegrids_str = convert_freegrids_to_go(lifestyle.get("freegrids"))
    costforarea = lifestyle.get("costforarea", "")
    costforcomforts = lifestyle.get("costforcomforts", "")
    costforsecurity = lifestyle.get("costforsecurity", "")
    increment = lifestyle.get("increment", "")
    allowbonuslp = lifestyle.get("allowbonuslp", "")
    
    # Build the struct
    lines = [
        f'	"{lifestyle_id}": {{',
        f'		ID: "{lifestyle_id_str}",',
        f'		Name: {json.dumps(name)},',
        f'		Cost: {json.dumps(cost)},',
        f'		Dice: {json.dumps(dice)},',
        f'		LP: {json.dumps(lp)},',
        f'		Multiplier: {json.dumps(multiplier)},',
        f'		Source: {json.dumps(source)},',
        f'		Page: {json.dumps(page)},',
    ]
    
    if hide_str != "nil":
        lines.append(f'		Hide: {hide_str},')
    if freegrids_str != "nil":
        lines.append(f'		FreeGrids: {freegrids_str},')
    if costforarea:
        lines.append(f'		CostForArea: {json.dumps(costforarea)},')
    if costforcomforts:
        lines.append(f'		CostForComforts: {json.dumps(costforcomforts)},')
    if costforsecurity:
        lines.append(f'		CostForSecurity: {json.dumps(costforsecurity)},')
    if increment:
        lines.append(f'		Increment: {json.dumps(increment)},')
    if allowbonuslp:
        lines.append(f'		AllowBonusLP: {json.dumps(allowbonuslp)},')
    
    lines.append("	},")
    return "\n".join(lines)

def main():
    with open("data/chummer/lifestyles.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    categories = data["categories"]["category"]
    lifestyles = data["lifestyles"]["lifestyle"]
    comforts = data["comforts"]["comfort"]
    neighborhoods = data["neighborhoods"]["neighborhood"]
    securities = data["securities"]["security"]
    qualities = data["qualities"]["quality"]
    cities = data["cities"]["city"]
    
    print("package v5")
    print()
    print("// DataLifestyleCategories contains lifestyle categories")
    print("var DataLifestyleCategories = []string{")
    for cat in categories:
        print(f'	{json.dumps(cat)},')
    print("}")
    print()
    print("// DataLifestyles contains lifestyle records keyed by their ID (lowercase with underscores)")
    print("var DataLifestyles = map[string]Lifestyle{")
    
    # Track used IDs to handle duplicates
    used_ids = {}
    
    for lifestyle in lifestyles:
        # Use name as the key, converted to snake_case
        name = lifestyle["name"]
        lifestyle_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = lifestyle_id
        suffix = 0
        while lifestyle_id in used_ids:
            suffix += 1
            lifestyle_id = f"{original_id}_{suffix}"
        
        used_ids[lifestyle_id] = True
        
        print(convert_lifestyle_to_go(lifestyle, lifestyle_id))
    
    print("}")
    print()
    print("// DataComforts contains comfort records keyed by name (lowercase with underscores)")
    print("var DataComforts = map[string]Comfort{")
    for comfort in comforts:
        name = comfort["name"]
        comfort_id = to_snake_case(name)
        print(f'''	"{comfort_id}": {{
		Name: {json.dumps(name)},
		Minimum: {json.dumps(comfort["minimum"])},
		Limit: {json.dumps(comfort["limit"])},
	}},''')
    print("}")
    print()
    print("// DataNeighborhoods contains neighborhood records keyed by name (lowercase with underscores)")
    print("var DataNeighborhoods = map[string]Neighborhood{")
    for neighborhood in neighborhoods:
        name = neighborhood["name"]
        neighborhood_id = to_snake_case(name)
        print(f'''	"{neighborhood_id}": {{
		Name: {json.dumps(name)},
		Minimum: {json.dumps(neighborhood["minimum"])},
		Limit: {json.dumps(neighborhood["limit"])},
	}},''')
    print("}")
    print()
    print("// DataSecurities contains security records keyed by name (lowercase with underscores)")
    print("var DataSecurities = map[string]Security{")
    for security in securities:
        name = security["name"]
        security_id = to_snake_case(name)
        print(f'''	"{security_id}": {{
		Name: {json.dumps(name)},
		Minimum: {json.dumps(security["minimum"])},
		Limit: {json.dumps(security["limit"])},
	}},''')
    print("}")
    print()
    print("// DataLifestyleQualities contains lifestyle quality records keyed by their ID (lowercase with underscores)")
    print("var DataLifestyleQualities = map[string]LifestyleQuality{")
    used_quality_ids = {}
    for quality in qualities:
        name = quality["name"]
        quality_id = to_snake_case(name)
        original_id = quality_id
        suffix = 0
        while quality_id in used_quality_ids:
            suffix += 1
            quality_id = f"{original_id}_{suffix}"
        used_quality_ids[quality_id] = True
        lines = [
            f'	"{quality_id}": {{',
            f'		ID: "{quality["id"]}",',
            f'		Name: {json.dumps(name)},',
            f'		Category: {json.dumps(quality["category"])},',
            f'		LP: {json.dumps(quality["lp"])},',
        ]
        if "cost" in quality:
            lines.append(f'		Cost: {json.dumps(quality["cost"])},')
        if "allowed" in quality:
            lines.append(f'		Allowed: {json.dumps(quality["allowed"])},')
        lines.append(f'		Source: {json.dumps(quality["source"])},')
        lines.append(f'		Page: {json.dumps(quality["page"])},')
        lines.append("	},")
        print("\n".join(lines))
    print("}")
    print()
    print("// DataCities contains city records keyed by name (lowercase with underscores)")
    print("var DataCities = map[string]City{")
    for city in cities:
        name = city.get("name", "")
        if not name:
            continue  # Skip cities without names
        city_id = to_snake_case(name)
        district = city.get("district", "")
        # Cities don't have source/page, they have district
        # Update the City struct to match - for now just use empty strings
        print(f'''	"{city_id}": {{
		Name: {json.dumps(name)},
		Source: "",
		Page: "",
	}},''')
    print("}")

if __name__ == "__main__":
    main()

