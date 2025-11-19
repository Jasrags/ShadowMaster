#!/usr/bin/env python3
"""Generate paragons_data.go from paragons.json"""

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
    
    parts = []
    
    if "specificskill" in bonus:
        parts.append("SpecificSkill: nil")  # TODO: Handle single or list
    
    if "actiondicepool" in bonus:
        parts.append("ActionDicePool: nil")  # TODO: Handle complex structure
    
    if "initiative" in bonus:
        parts.append(f'Initiative: {json.dumps(bonus["initiative"])}')
    
    if "matrixinitiative" in bonus:
        parts.append(f'MatrixInitiative: {json.dumps(bonus["matrixinitiative"])}')
    
    if "livingpersona" in bonus:
        parts.append("LivingPersona: nil")  # TODO: Handle complex structure
    
    if "weaponskillaccuracy" in bonus:
        parts.append("WeaponSkillAccuracy: nil")  # TODO: Handle single or list
    
    if not parts:
        return "nil"
    
    return "&ParagonBonus{" + ", ".join(parts) + "}"

def convert_paragon_to_go(paragon, paragon_id):
    """Convert a paragon object to Go struct literal"""
    paragon_id_str = paragon["id"]
    name = paragon["name"]
    category = paragon["category"]
    advantage = paragon["advantage"]
    disadvantage = paragon["disadvantage"]
    source = paragon["source"]
    page = paragon["page"]
    
    parts = [
        f'ID: "{paragon_id_str}"',
        f'Name: {json.dumps(name)}',
        f'Category: {json.dumps(category)}',
        f'Advantage: {json.dumps(advantage)}',
        f'Disadvantage: {json.dumps(disadvantage)}',
        f'Source: {json.dumps(source)}',
        f'Page: {json.dumps(page)}',
    ]
    
    bonus_str = convert_bonus_to_go(paragon.get("bonus"))
    if bonus_str != "nil":
        parts.append(f"Bonus: {bonus_str}")
    
    return f'''	"{paragon_id}": {{
		{",\n\t\t".join(parts)},
	}},'''

def main():
    with open("data/chummer/paragons.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    print("package v5")
    print()
    
    # Category (it's just a string, not a list)
    category = data["categories"]["category"]
    print("// DataParagonCategory contains the paragon category name")
    print(f'var DataParagonCategory = {json.dumps(category)}')
    print()
    
    # Paragons (mentors)
    paragons = data["mentors"]["mentor"]
    print("// DataParagons contains paragon records keyed by their ID (lowercase with underscores)")
    print("var DataParagons = map[string]Paragon{")
    
    used_paragon_ids = {}
    for paragon in paragons:
        name = paragon["name"]
        paragon_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = paragon_id
        suffix = 0
        while paragon_id in used_paragon_ids:
            suffix += 1
            paragon_id = f"{original_id}_{suffix}"
        
        used_paragon_ids[paragon_id] = True
        
        print(convert_paragon_to_go(paragon, paragon_id))
    
    print("}")

if __name__ == "__main__":
    main()

