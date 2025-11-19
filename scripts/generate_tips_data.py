#!/usr/bin/env python3
"""Generate tips_data.go from tips.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_required_to_go(required):
    """Convert required object to Go struct literal"""
    if not required:
        return "nil"
    
    parts = []
    
    if "allof" in required:
        parts.append("AllOf: nil")  # TODO: Handle complex allof structure
    
    if "oneof" in required:
        parts.append("OneOf: nil")  # TODO: Handle complex oneof structure
    
    if "grouponeof" in required:
        parts.append("GroupOneOf: nil")  # TODO: Handle complex grouponeof structure
    
    if not parts:
        return "nil"
    
    return "&TipRequired{" + ", ".join(parts) + "}"

def convert_forbidden_to_go(forbidden):
    """Convert forbidden object to Go struct literal"""
    if not forbidden:
        return "nil"
    
    parts = []
    
    if "allof" in forbidden:
        parts.append("AllOf: nil")  # TODO: Handle complex allof structure
    
    if "oneof" in forbidden:
        parts.append("OneOf: nil")  # TODO: Handle complex oneof structure
    
    if not parts:
        return "nil"
    
    return "&TipForbidden{" + ", ".join(parts) + "}"

def convert_tip_to_go(tip, tip_id):
    """Convert a tip object to Go struct literal"""
    tip_id_str = tip["id"]
    text = tip["text"]
    
    parts = [
        f'ID: "{tip_id_str}"',
        f'Text: {json.dumps(text)}',
    ]
    
    if "chargenonly" in tip and tip["chargenonly"] is not None:
        parts.append(f'ChargenOnly: &[]string{{{json.dumps(tip["chargenonly"])}}}[0]')
    elif "chargenonly" in tip:
        parts.append("ChargenOnly: nil")
    
    if "careeronly" in tip and tip["careeronly"] is not None:
        parts.append(f'CareerOnly: &[]string{{{json.dumps(tip["careeronly"])}}}[0]')
    elif "careeronly" in tip:
        parts.append("CareerOnly: nil")
    
    required_str = convert_required_to_go(tip.get("required"))
    if required_str != "nil":
        parts.append(f"Required: {required_str}")
    
    forbidden_str = convert_forbidden_to_go(tip.get("forbidden"))
    if forbidden_str != "nil":
        parts.append(f"Forbidden: {forbidden_str}")
    
    return f'''	"{tip_id}": {{
		{",\n\t\t".join(parts)},
	}},'''

def main():
    with open("data/chummer/tips.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    print("package v5")
    print()
    
    # Tips
    tips = data["tips"]["tip"]
    print("// DataTips contains tip records keyed by their ID (lowercase with underscores)")
    print("// These are character creation tips that appear based on character configuration")
    print("var DataTips = map[string]Tip{")
    
    used_tip_ids = {}
    for tip in tips:
        # Use first 50 chars of text as ID base
        text = tip["text"]
        tip_id = to_snake_case(text[:50])
        
        # Handle duplicates by appending numeric suffix
        original_id = tip_id
        suffix = 0
        while tip_id in used_tip_ids:
            suffix += 1
            tip_id = f"{original_id}_{suffix}"
        
        used_tip_ids[tip_id] = True
        print(convert_tip_to_go(tip, tip_id))
    
    print("}")

if __name__ == "__main__":
    main()

