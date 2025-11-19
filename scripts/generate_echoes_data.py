#!/usr/bin/env python3
"""Generate echoes_data.go from echoes.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    # Replace spaces and special chars with underscores
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_bool_ptr(value):
    """Convert a value to *bool or nil"""
    if value is None:
        return "nil"
    if isinstance(value, bool):
        return "&[]bool{" + str(value).lower() + "}[0]"
    return "nil"

def convert_bonus_to_go(bonus):
    """Convert bonus object to Go struct literal"""
    if not bonus:
        return "nil"
    
    parts = []
    
    if "livingpersona" in bonus:
        parts.append("LivingPersona: nil")  # TODO: Handle complex livingpersona structure
    
    if "matrixinitiativediceadd" in bonus:
        parts.append(f'MatrixInitiativeDiceAdd: {json.dumps(bonus["matrixinitiativediceadd"])}')
    
    if "selecttext" in bonus:
        parts.append("SelectText: nil")  # TODO: Handle complex selecttext structure
    
    if "limitmodifier" in bonus:
        parts.append("LimitModifier: nil")  # TODO: Handle complex limitmodifier structure
    
    if "specificattribute" in bonus:
        parts.append("SpecificAttribute: nil")  # TODO: Handle complex specificattribute structure
    
    if "initiativepass" in bonus:
        parts.append(f'InitiativePass: {json.dumps(bonus["initiativepass"])}')
    
    if "penaltyfreesustain" in bonus:
        parts.append("PenaltyFreeSustain: nil")  # TODO: Handle complex penaltyfreesustain structure
    
    if not parts:
        return "nil"
    
    return "&EchoBonus{" + ", ".join(parts) + "}"

def convert_echo_to_go(echo, echo_id):
    """Convert an echo object to Go struct literal"""
    echo_id_str = echo["id"]
    name = echo["name"]
    source = echo["source"]
    page = echo["page"]
    
    # Handle optional fields
    bonus_str = convert_bonus_to_go(echo.get("bonus"))
    limit = echo.get("limit", "")
    hide_str = convert_bool_ptr(echo.get("hide"))
    
    # Build the struct
    lines = [
        f'	"{echo_id}": {{',
        f'		ID: "{echo_id_str}",',
        f'		Name: {json.dumps(name)},',
        f'		Source: {json.dumps(source)},',
        f'		Page: {json.dumps(page)},',
    ]
    
    if bonus_str != "nil":
        lines.append(f'		Bonus: {bonus_str},')
    if limit:
        lines.append(f'		Limit: {json.dumps(limit)},')
    if hide_str != "nil":
        lines.append(f'		Hide: {hide_str},')
    
    lines.append("	},")
    return "\n".join(lines)

def main():
    with open("data/chummer/echoes.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    echoes = data["echoes"]["echo"]
    
    print("package v5")
    print()
    print("// DataEchoes contains echo records keyed by their ID (lowercase with underscores)")
    print("var DataEchoes = map[string]Echo{")
    
    # Track used IDs to handle duplicates
    used_ids = {}
    
    for echo in echoes:
        # Use name as the key, converted to snake_case
        name = echo["name"]
        echo_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = echo_id
        suffix = 0
        while echo_id in used_ids:
            suffix += 1
            echo_id = f"{original_id}_{suffix}"
        
        used_ids[echo_id] = True
        
        print(convert_echo_to_go(echo, echo_id))
    
    print("}")

if __name__ == "__main__":
    main()

