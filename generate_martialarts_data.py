#!/usr/bin/env python3
"""Generate martialarts_data.go from martialarts.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    # Replace spaces and special chars with underscores
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_bonus_to_go(bonus):
    """Convert bonus object to Go struct literal"""
    if not bonus:
        return "nil"
    
    if "addskillspecializationoption" in bonus and bonus["addskillspecializationoption"]:
        option = bonus["addskillspecializationoption"]
        # Handle both single object and list
        if isinstance(option, list):
            if len(option) > 0:
                option = option[0]  # Take first one
            else:
                return "nil"
        
        if isinstance(option, dict):
            skill = option.get("skill", "")
            spec = option.get("spec", "")
            if skill and spec:
                return f'&MartialArtBonus{{AddSkillSpecializationOption: &AddSkillSpecializationOption{{Skill: {json.dumps(skill)}, Spec: {json.dumps(spec)}}}}}'
    
    return "nil"

def convert_techniques_to_go(techniques):
    """Convert techniques object to Go struct literal"""
    if not techniques or "technique" not in techniques:
        return "nil"
    
    technique_list = techniques["technique"]
    if not technique_list:
        return "nil"
    
    if isinstance(technique_list, list):
        if len(technique_list) == 0:
            return "nil"
        tech_strs = []
        for tech in technique_list:
            name = tech.get("name", "")
            if name:
                tech_strs.append(f'MartialArtTechnique{{Name: {json.dumps(name)}}}')
        if tech_strs:
            techs_list = ', '.join(tech_strs)
            # Use string concatenation to avoid f-string brace issues
            return "&MartialArtTechniques{Technique: []interface{}{" + techs_list + "}}"
    elif isinstance(technique_list, dict):
        name = technique_list.get("name", "")
        if name:
            return f'&MartialArtTechniques{{Technique: MartialArtTechnique{{Name: {json.dumps(name)}}}}}'
    
    return "nil"

def convert_required_to_go(required):
    """Convert required object to Go struct literal"""
    if not required:
        return "nil"
    
    if "allof" in required and required["allof"]:
        allof = required["allof"]
        magenabled = allof.get("magenabled")
        if magenabled is not None:
            # For now, just set it to nil as it's a complex structure
            return f'&MartialArtRequired{{AllOf: &MartialArtRequiredAllOf{{MagEnabled: nil}}}}'
    
    return "nil"

def convert_martialart_to_go(art, art_id):
    """Convert a martial art object to Go struct literal"""
    art_id_str = art["id"]
    name = art["name"]
    source = art["source"]
    page = art["page"]
    
    # Handle bonus
    bonus_str = convert_bonus_to_go(art.get("bonus"))
    
    # Handle techniques
    techniques_str = convert_techniques_to_go(art.get("techniques"))
    
    # Build the struct
    lines = [
        f'	"{art_id}": {{',
        f'		ID: "{art_id_str}",',
        f'		Name: {json.dumps(name)},',
        f'		Source: {json.dumps(source)},',
        f'		Page: {json.dumps(page)},',
    ]
    
    if bonus_str != "nil":
        lines.append(f'		Bonus: {bonus_str},')
    if techniques_str != "nil":
        lines.append(f'		Techniques: {techniques_str},')
    
    lines.append("	},")
    return "\n".join(lines)

def convert_technique_to_go(tech, tech_id):
    """Convert a technique object to Go struct literal"""
    tech_id_str = tech["id"]
    name = tech["name"]
    source = tech["source"]
    page = tech["page"]
    
    # Handle required
    required_str = convert_required_to_go(tech.get("required"))
    
    # Build the struct
    lines = [
        f'	"{tech_id}": {{',
        f'		ID: "{tech_id_str}",',
        f'		Name: {json.dumps(name)},',
        f'		Source: {json.dumps(source)},',
        f'		Page: {json.dumps(page)},',
    ]
    
    if required_str != "nil":
        lines.append(f'		Required: {required_str},')
    
    lines.append("	},")
    return "\n".join(lines)

def main():
    with open("data/chummer/martialarts.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    martialarts = data["martialarts"]["martialart"]
    techniques = data["techniques"]["technique"]
    
    print("package v5")
    print()
    print("// DataMartialArts contains martial art records keyed by their ID (lowercase with underscores)")
    print("var DataMartialArts = map[string]MartialArt{")
    
    # Track used IDs to handle duplicates
    used_ids = {}
    
    for art in martialarts:
        # Use name as the key, converted to snake_case
        name = art["name"]
        art_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = art_id
        suffix = 0
        while art_id in used_ids:
            suffix += 1
            art_id = f"{original_id}_{suffix}"
        
        used_ids[art_id] = True
        
        print(convert_martialart_to_go(art, art_id))
    
    print("}")
    print()
    print("// DataTechniques contains technique definition records keyed by their ID (lowercase with underscores)")
    print("var DataTechniques = map[string]Technique{")
    
    # Track used IDs for techniques
    used_tech_ids = {}
    
    for tech in techniques:
        # Use name as the key, converted to snake_case
        name = tech["name"]
        tech_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = tech_id
        suffix = 0
        while tech_id in used_tech_ids:
            suffix += 1
            tech_id = f"{original_id}_{suffix}"
        
        used_tech_ids[tech_id] = True
        
        print(convert_technique_to_go(tech, tech_id))
    
    print("}")

if __name__ == "__main__":
    main()

