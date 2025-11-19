#!/usr/bin/env python3
"""Generate critterpowers_data.go from critterpowers.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    # Replace spaces and special chars with underscores
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_select_skill_to_go(selectskill):
    """Convert selectskill bonus to Go struct literal"""
    if not selectskill:
        return "nil"
    
    skillcategory = selectskill.get("+@skillcategory", "")
    val = selectskill.get("val", "")
    applytorating = selectskill.get("applytorating", "")
    
    # Build the struct
    parts = []
    if skillcategory:
        parts.append(f'SkillCategory: {json.dumps(skillcategory)}')
    if val:
        parts.append(f'Val: {json.dumps(val)}')
    if applytorating:
        parts.append(f'ApplyToRating: {json.dumps(applytorating)}')
    
    if not parts:
        return "nil"
    
    return "&SelectSkill{" + ", ".join(parts) + "}"

def convert_select_text_to_go(selecttext):
    """Convert selecttext bonus to Go struct literal"""
    if not selecttext:
        return "nil"
    
    xml = selecttext.get("+@xml", "")
    xpath = selecttext.get("+@xpath", "")
    allowedit = selecttext.get("+@allowedit", "")
    
    parts = []
    if xml:
        parts.append(f'XML: {json.dumps(xml)}')
    if xpath:
        parts.append(f'XPath: {json.dumps(xpath)}')
    if allowedit:
        parts.append(f'AllowEdit: {json.dumps(allowedit)}')
    
    if not parts:
        return "nil"
    
    return "&SelectTextBonus{" + ", ".join(parts) + "}"

def convert_bonus_to_go(bonus):
    """Convert bonus object to Go struct literal"""
    if not bonus:
        return "nil"
    
    parts = []
    
    if "selectskill" in bonus and bonus["selectskill"]:
        selectskill_str = convert_select_skill_to_go(bonus["selectskill"])
        if selectskill_str != "nil":
            parts.append(f"SelectSkill: {selectskill_str}")
    
    if "selecttext" in bonus:
        selecttext_val = bonus["selecttext"]
        if selecttext_val is not None:
            selecttext_str = convert_select_text_to_go(selecttext_val)
            if selecttext_str != "nil":
                parts.append(f"SelectText: {selecttext_str}")
    
    # Handle unlockskills - for now set to nil as it's complex
    if "unlockskills" in bonus and bonus["unlockskills"]:
        parts.append("UnlockSkills: nil")  # TODO: Handle complex unlockskills structure
    
    if not parts:
        return "nil"
    
    return "&CritterPowerDefinitionBonus{" + ", ".join(parts) + "}"

def convert_string_ptr(value):
    """Convert a value to *string or nil"""
    if value is None:
        return "nil"
    if isinstance(value, str):
        if value == "":
            return "nil"
        return f'&[]string{{{json.dumps(value)}}}[0]'
    return "nil"

def convert_critterpower_to_go(power, power_id):
    """Convert a critter power object to Go struct literal"""
    power_id_str = power["id"]
    name = power["name"]
    category = power["category"]
    source = power["source"]
    page = power["page"]
    
    # Handle optional fields
    type_str = convert_string_ptr(power.get("type"))
    action_str = convert_string_ptr(power.get("action"))
    range_str = convert_string_ptr(power.get("range"))
    duration_str = convert_string_ptr(power.get("duration"))
    karma_str = convert_string_ptr(power.get("karma"))
    toxic_str = convert_string_ptr(power.get("toxic"))
    hide_str = convert_string_ptr(power.get("hide"))
    
    # Handle bonus
    bonus_str = convert_bonus_to_go(power.get("bonus"))
    
    # Build the struct
    lines = [
        f'	"{power_id}": {{',
        f'		ID: "{power_id_str}",',
        f'		Name: {json.dumps(name)},',
        f'		Category: {json.dumps(category)},',
        f'		Source: {json.dumps(source)},',
        f'		Page: {json.dumps(page)},',
    ]
    
    # Add optional fields only if they're not nil
    if type_str != "nil":
        lines.append(f'		Type: {type_str},')
    if action_str != "nil":
        lines.append(f'		Action: {action_str},')
    if range_str != "nil":
        lines.append(f'		Range: {range_str},')
    if duration_str != "nil":
        lines.append(f'		Duration: {duration_str},')
    if karma_str != "nil":
        lines.append(f'		Karma: {karma_str},')
    if toxic_str != "nil":
        lines.append(f'		Toxic: {toxic_str},')
    if bonus_str != "nil":
        lines.append(f'		Bonus: {bonus_str},')
    if hide_str != "nil":
        lines.append(f'		Hide: {hide_str},')
    
    lines.append("	},")
    return "\n".join(lines)

def convert_category_to_go(cat):
    """Convert a category to Go representation"""
    if isinstance(cat, str):
        return f'"{cat}"'
    elif isinstance(cat, dict):
        content = cat.get("+content", "")
        whitelist = cat.get("+@whitelist", "")
        parts = []
        if content:
            parts.append(f'Content: {json.dumps(content)}')
        if whitelist:
            parts.append(f'Whitelist: {json.dumps(whitelist)}')
        if parts:
            return "CritterPowerCategory{" + ", ".join(parts) + "}"
    return "nil"

def main():
    with open("data/chummer/critterpowers.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    categories = data["categories"]["category"]
    powers = data["powers"]["power"]
    
    print("package v5")
    print()
    print("// DataCritterPowerCategories contains critter power categories")
    print("// Categories can be strings or CritterPowerCategory objects")
    print("var DataCritterPowerCategories = []interface{}{")
    for cat in categories:
        cat_str = convert_category_to_go(cat)
        print(f"	{cat_str},")
    print("}")
    print()
    print("// DataCritterPowers contains critter power definition records keyed by their ID (lowercase with underscores)")
    print("var DataCritterPowers = map[string]CritterPowerDefinition{")
    
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
        
        print(convert_critterpower_to_go(power, power_id))
    
    print("}")

if __name__ == "__main__":
    main()

