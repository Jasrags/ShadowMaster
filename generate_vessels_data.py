#!/usr/bin/env python3
"""Generate vessels_data.go from vessels.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_bonus_to_go(bonus):
    """Convert bonus object to Go struct literal"""
    if not bonus:
        return "nil"
    
    parts = []
    
    if "armor" in bonus:
        parts.append(f'Armor: {json.dumps(bonus["armor"])}')
    
    if not parts:
        return "nil"
    
    return "&VesselBonus{" + ", ".join(parts) + "}"

def convert_vessel_to_go(vessel, vessel_id):
    """Convert a vessel object to Go struct literal"""
    vessel_id_str = vessel["id"]
    name = vessel["name"]
    category = vessel["category"]
    bp = vessel["bp"]
    
    # Attribute limits
    bodmin = int(vessel["bodmin"])
    bodmax = int(vessel["bodmax"])
    bodaug = int(vessel["bodaug"])
    agimin = int(vessel["agimin"])
    agimax = int(vessel["agimax"])
    agiaug = int(vessel["agiaug"])
    reamin = int(vessel["reamin"])
    reamax = int(vessel["reamax"])
    reaaug = int(vessel["reaaug"])
    strmin = int(vessel["strmin"])
    strmax = int(vessel["strmax"])
    straug = int(vessel["straug"])
    chamin = int(vessel["chamin"])
    chamax = int(vessel["chamax"])
    chaaug = int(vessel["chaaug"])
    intmin = int(vessel["intmin"])
    intmax = int(vessel["intmax"])
    intaug = int(vessel["intaug"])
    logmin = int(vessel["logmin"])
    logmax = int(vessel["logmax"])
    logaug = int(vessel["logaug"])
    wilmin = int(vessel["wilmin"])
    wilmax = int(vessel["wilmax"])
    wilaug = int(vessel["wilaug"])
    inimin = int(vessel["inimin"])
    inimax = int(vessel["inimax"])
    iniaug = int(vessel["iniaug"])
    edgmin = int(vessel["edgmin"])
    edgmax = int(vessel["edgmax"])
    edgaug = int(vessel["edgaug"])
    magmin = int(vessel["magmin"])
    magmax = int(vessel["magmax"])
    magaug = int(vessel["magaug"])
    resmin = int(vessel["resmin"])
    resmax = int(vessel["resmax"])
    resaug = int(vessel["resaug"])
    essmin = int(vessel["essmin"])
    essmax = int(vessel["essmax"])
    essaug = int(vessel["essaug"])
    
    # Movement
    walk = vessel["walk"]
    run = vessel["run"]
    sprint = vessel["sprint"]
    
    parts = [
        f'ID: "{vessel_id_str}"',
        f'Name: {json.dumps(name)}',
        f'Category: {json.dumps(category)}',
        f'BP: {json.dumps(bp)}',
        f'BODMin: {bodmin}',
        f'BODMax: {bodmax}',
        f'BODAug: {bodaug}',
        f'AGIMin: {agimin}',
        f'AGIMax: {agimax}',
        f'AGIAug: {agiaug}',
        f'REAMin: {reamin}',
        f'REAMax: {reamax}',
        f'REAAug: {reaaug}',
        f'STRMin: {strmin}',
        f'STRMax: {strmax}',
        f'STRAug: {straug}',
        f'CHAMin: {chamin}',
        f'CHAMax: {chamax}',
        f'CHAAug: {chaaug}',
        f'INTMin: {intmin}',
        f'INTMax: {intmax}',
        f'INTAug: {intaug}',
        f'LOGMin: {logmin}',
        f'LOGMax: {logmax}',
        f'LOGAug: {logaug}',
        f'WILMin: {wilmin}',
        f'WILMax: {wilmax}',
        f'WILAug: {wilaug}',
        f'INIMin: {inimin}',
        f'INIMax: {inimax}',
        f'INIAug: {iniaug}',
        f'EDGMin: {edgmin}',
        f'EDGMax: {edgmax}',
        f'EDGAug: {edgaug}',
        f'MAGMin: {magmin}',
        f'MAGMax: {magmax}',
        f'MAGAug: {magaug}',
        f'RESMin: {resmin}',
        f'RESMax: {resmax}',
        f'RESAug: {resaug}',
        f'ESSMin: {essmin}',
        f'ESSMax: {essmax}',
        f'ESSAug: {essaug}',
        f'Walk: {json.dumps(walk)}',
        f'Run: {json.dumps(run)}',
        f'Sprint: {json.dumps(sprint)}',
    ]
    
    bonus_str = convert_bonus_to_go(vessel.get("bonus"))
    if bonus_str != "nil":
        parts.append(f"Bonus: {bonus_str}")
    
    # Powers is usually null, so we'll skip it for now
    if "powers" in vessel and vessel["powers"] is not None:
        parts.append("Powers: nil")  # TODO: Handle powers if they exist
    
    if "source" in vessel and vessel["source"]:
        parts.append(f'Source: {json.dumps(vessel["source"])}')
    
    if "page" in vessel and vessel["page"]:
        parts.append(f'Page: {json.dumps(vessel["page"])}')
    
    return f'''	"{vessel_id}": {{
		{",\n\t\t".join(parts)},
	}},'''

def main():
    with open("data/chummer/vessels.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    print("package v5")
    print()
    
    # Category (it's just a string, not a list)
    category = data["categories"]["category"]
    print("// DataVesselCategory contains the vessel category name")
    print(f'var DataVesselCategory = {json.dumps(category)}')
    print()
    
    # Vessels (metatypes)
    vessels = data["metatypes"]["metatype"]
    print("// DataVessels contains vessel records keyed by their ID (lowercase with underscores)")
    print("var DataVessels = map[string]Vessel{")
    
    used_vessel_ids = {}
    for vessel in vessels:
        name = vessel["name"]
        vessel_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = vessel_id
        suffix = 0
        while vessel_id in used_vessel_ids:
            suffix += 1
            vessel_id = f"{original_id}_{suffix}"
        
        used_vessel_ids[vessel_id] = True
        print(convert_vessel_to_go(vessel, vessel_id))
    
    print("}")

if __name__ == "__main__":
    main()

