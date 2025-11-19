#!/usr/bin/env python3
"""Generate complexforms_data.go from complexforms.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    # Replace spaces and special chars with underscores
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_select_text_bonus_to_go(bonus):
    """Convert selecttext bonus to Go struct literal"""
    if not bonus or "selecttext" not in bonus:
        return "nil"
    
    selecttext = bonus["selecttext"]
    if not selecttext:
        return "nil"
    
    xml = selecttext.get("+@xml", "")
    xpath = selecttext.get("+@xpath", "")
    
    return f'&ComplexFormBonus{{SelectText: &SelectTextBonus{{XML: "{xml}", XPath: {json.dumps(xpath)}}}}}'

def convert_required_to_go(required):
    """Convert required object to Go struct literal"""
    if not required:
        return "nil"
    
    if "oneof" in required and required["oneof"]:
        oneof = required["oneof"]
        quality = oneof.get("quality", "")
        if quality:
            return f'&ComplexFormRequired{{OneOf: &ComplexFormRequiredOneOf{{Quality: {json.dumps(quality)}}}}}'
    
    return "nil"

def convert_complexform_to_go(cf, cf_id):
    """Convert a complexform object to Go struct literal"""
    cf_id_str = cf["id"]
    name = cf["name"]
    target = cf["target"]
    duration = cf["duration"]
    fv = cf["fv"]
    source = cf["source"]
    page = cf["page"]
    
    # Handle bonus
    bonus_str = "nil"
    if "bonus" in cf and cf["bonus"]:
        bonus_str = convert_select_text_bonus_to_go(cf["bonus"])
    
    # Handle required
    required_str = "nil"
    if "required" in cf and cf["required"]:
        required_str = convert_required_to_go(cf["required"])
    
    return f'''	"{cf_id}": {{
		ID: "{cf_id_str}",
		Name: {json.dumps(name)},
		Target: "{target}",
		Duration: "{duration}",
		FV: "{fv}",
		Source: "{source}",
		Page: "{page}",
		Bonus: {bonus_str},
		Required: {required_str},
	}},'''

def main():
    with open("data/chummer/complexforms.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    complexforms = data["complexforms"]["complexform"]
    
    print("package v5")
    print()
    print("// DataComplexForms contains complex form records keyed by their ID (lowercase with underscores)")
    print("var DataComplexForms = map[string]ComplexForm{")
    
    for cf in complexforms:
        # Use name as the key, converted to snake_case
        name = cf["name"]
        cf_id = to_snake_case(name)
        
        print(convert_complexform_to_go(cf, cf_id))
    
    print("}")

if __name__ == "__main__":
    main()

