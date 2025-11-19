#!/usr/bin/env python3
"""Generate mentors_data.go from mentors.json"""

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
    
    # Handle simple string bonuses
    if "damageresistance" in bonus:
        parts.append(f'DamageResistance: {json.dumps(bonus["damageresistance"])}')
    
    # Handle complex bonuses - set to nil for now
    if "selectskill" in bonus and bonus["selectskill"]:
        parts.append("SelectSkill: nil")  # TODO: Handle properly
    if "specificskill" in bonus:
        parts.append("SpecificSkill: nil")  # TODO: Handle complex structure
    if "addqualities" in bonus:
        parts.append("AddQualities: nil")  # TODO: Handle complex structure
    
    if not parts:
        return "nil"
    
    return "&MentorBonus{" + ", ".join(parts) + "}"

def convert_choice_to_go(choice):
    """Convert a choice object to Go struct literal"""
    name = choice.get("name", "")
    set_val = choice.get("+@set", "")
    bonus = choice.get("bonus")
    
    parts = [f'Name: {json.dumps(name)}']
    if set_val:
        parts.append(f'Set: {json.dumps(set_val)}')
    if bonus:
        parts.append("Bonus: nil")  # TODO: Handle complex bonus structure
    
    return "MentorChoice{" + ", ".join(parts) + "}"

def convert_choices_to_go(choices):
    """Convert choices object to Go struct literal"""
    if not choices or "choice" not in choices:
        return "nil"
    
    choice_list = choices["choice"]
    if not choice_list:
        return "nil"
    
    if isinstance(choice_list, list):
        if len(choice_list) == 0:
            return "nil"
        # Filter out None values
        valid_choices = [ch for ch in choice_list if ch is not None]
        if len(valid_choices) == 0:
            return "nil"
        choice_strs = [convert_choice_to_go(ch) for ch in valid_choices]
        choices_list = ', '.join(choice_strs)
        # Use string concatenation to avoid f-string brace issues
        return "&MentorChoices{Choice: []interface{}{" + choices_list + "}}"
    elif isinstance(choice_list, dict):
        choice_str = convert_choice_to_go(choice_list)
        return f'&MentorChoices{{Choice: {choice_str}}}'
    
    return "nil"

def convert_mentor_to_go(mentor, mentor_id):
    """Convert a mentor object to Go struct literal"""
    mentor_id_str = mentor["id"]
    name = mentor["name"]
    advantage = mentor["advantage"]
    disadvantage = mentor["disadvantage"]
    source = mentor["source"]
    page = mentor["page"]
    
    # Handle optional fields
    bonus_str = convert_bonus_to_go(mentor.get("bonus"))
    choices_str = convert_choices_to_go(mentor.get("choices"))
    
    # Build the struct
    lines = [
        f'	"{mentor_id}": {{',
        f'		ID: "{mentor_id_str}",',
        f'		Name: {json.dumps(name)},',
        f'		Advantage: {json.dumps(advantage)},',
        f'		Disadvantage: {json.dumps(disadvantage)},',
        f'		Source: {json.dumps(source)},',
        f'		Page: {json.dumps(page)},',
    ]
    
    if bonus_str != "nil":
        lines.append(f'		Bonus: {bonus_str},')
    if choices_str != "nil":
        lines.append(f'		Choices: {choices_str},')
    
    lines.append("	},")
    return "\n".join(lines)

def main():
    with open("data/chummer/mentors.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    mentors = data["mentors"]["mentor"]
    
    print("package v5")
    print()
    print("// DataMentors contains mentor spirit records keyed by their ID (lowercase with underscores)")
    print("var DataMentors = map[string]Mentor{")
    
    # Track used IDs to handle duplicates
    used_ids = {}
    
    for mentor in mentors:
        # Use name as the key, converted to snake_case
        name = mentor["name"]
        mentor_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = mentor_id
        suffix = 0
        while mentor_id in used_ids:
            suffix += 1
            mentor_id = f"{original_id}_{suffix}"
        
        used_ids[mentor_id] = True
        
        print(convert_mentor_to_go(mentor, mentor_id))
    
    print("}")

if __name__ == "__main__":
    main()

