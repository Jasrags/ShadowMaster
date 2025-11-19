#!/usr/bin/env python3
"""Generate streams_data.go from streams.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_spirits_to_go(spirits):
    """Convert spirits object to Go struct literal"""
    if not spirits or "spirit" not in spirits:
        return "nil"
    
    spirit = spirits["spirit"]
    if isinstance(spirit, list):
        spirit_str = "[]interface{}{" + ", ".join(json.dumps(s) for s in spirit) + "}"
    else:
        spirit_str = json.dumps(spirit)
    
    return f"&StreamTraditionSpirits{{Spirit: {spirit_str}}}"

def convert_powers_to_go(powers):
    """Convert powers object to Go struct literal"""
    if not powers or "power" not in powers:
        return "nil"
    
    power = powers["power"]
    if isinstance(power, list):
        power_str = "[]interface{}{" + ", ".join(json.dumps(p) for p in power) + "}"
    else:
        power_str = json.dumps(power)
    
    return f"&StreamSpiritPowers{{Power: {power_str}}}"

def convert_optional_powers_to_go(optional_powers):
    """Convert optional powers object to Go struct literal"""
    if not optional_powers or "power" not in optional_powers:
        return "nil"
    
    power = optional_powers["power"]
    if isinstance(power, list):
        power_str = "[]interface{}{" + ", ".join(json.dumps(p) for p in power) + "}"
    else:
        power_str = json.dumps(power)
    
    return f"&StreamSpiritOptionalPowers{{Power: {power_str}}}"

def convert_skills_to_go(skills):
    """Convert skills object to Go struct literal"""
    if not skills or "skill" not in skills:
        return "nil"
    
    skill = skills["skill"]
    if isinstance(skill, list):
        skill_str = "[]interface{}{" + ", ".join(json.dumps(s) for s in skill) + "}"
    else:
        skill_str = json.dumps(skill)
    
    return f"&StreamSpiritSkills{{Skill: {skill_str}}}"

def convert_tradition_to_go(tradition):
    """Convert a tradition object to Go struct literal"""
    tradition_id_str = tradition["id"]
    name = tradition["name"]
    drain = tradition["drain"]
    source = tradition["source"]
    page = tradition["page"]
    
    parts = [
        f'ID: "{tradition_id_str}"',
        f'Name: {json.dumps(name)}',
        f'Drain: {json.dumps(drain)}',
        f'Source: {json.dumps(source)}',
        f'Page: {json.dumps(page)}',
    ]
    
    spirits_str = convert_spirits_to_go(tradition.get("spirits"))
    if spirits_str != "nil":
        parts.append(f"Spirits: {spirits_str}")
    
    return "StreamTradition{\n\t\t" + ",\n\t\t".join(parts) + ",\n\t}"

def convert_spirit_to_go(spirit, spirit_id):
    """Convert a spirit object to Go struct literal"""
    spirit_id_str = spirit["id"]
    name = spirit["name"]
    page = spirit["page"]
    source = spirit["source"]
    bod = spirit["bod"]
    agi = spirit["agi"]
    rea = spirit["rea"]
    str_val = spirit["str"]
    cha = spirit["cha"]
    int_val = spirit["int"]
    log = spirit["log"]
    wil = spirit["wil"]
    ini = spirit["ini"]
    
    parts = [
        f'ID: "{spirit_id_str}"',
        f'Name: {json.dumps(name)}',
        f'Page: {json.dumps(page)}',
        f'Source: {json.dumps(source)}',
        f'BOD: {json.dumps(bod)}',
        f'AGI: {json.dumps(agi)}',
        f'REA: {json.dumps(rea)}',
        f'STR: {json.dumps(str_val)}',
        f'CHA: {json.dumps(cha)}',
        f'INT: {json.dumps(int_val)}',
        f'LOG: {json.dumps(log)}',
        f'WIL: {json.dumps(wil)}',
        f'INI: {json.dumps(ini)}',
    ]
    
    powers_str = convert_powers_to_go(spirit.get("powers"))
    if powers_str != "nil":
        parts.append(f"Powers: {powers_str}")
    
    optional_powers_str = convert_optional_powers_to_go(spirit.get("optionalpowers"))
    if optional_powers_str != "nil":
        parts.append(f"OptionalPowers: {optional_powers_str}")
    
    skills_str = convert_skills_to_go(spirit.get("skills"))
    if skills_str != "nil":
        parts.append(f"Skills: {skills_str}")
    
    return f'''	"{spirit_id}": {{
		{",\n\t\t".join(parts)},
	}},'''

def main():
    with open("data/chummer/streams.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    print("package v5")
    print()
    
    # Tradition (single object, not array)
    traditions = data.get("traditions", {})
    tradition = traditions.get("tradition", {})
    if tradition:
        print("// DataStreamTradition contains the stream tradition")
        print("var DataStreamTradition = " + convert_tradition_to_go(tradition))
        print()
    
    # Spirits
    spirits = data.get("spirits", {}).get("spirit", [])
    print("// DataStreamSpirits contains stream spirit records keyed by their ID (lowercase with underscores)")
    print("var DataStreamSpirits = map[string]StreamSpirit{")
    
    used_spirit_ids = {}
    for spirit in spirits:
        name = spirit["name"]
        spirit_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = spirit_id
        suffix = 0
        while spirit_id in used_spirit_ids:
            suffix += 1
            spirit_id = f"{original_id}_{suffix}"
        
        used_spirit_ids[spirit_id] = True
        print(convert_spirit_to_go(spirit, spirit_id))
    
    print("}")

if __name__ == "__main__":
    main()

