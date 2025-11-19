#!/usr/bin/env python3
"""Generate drugcomponents_data.go from drugcomponents.json"""

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

def convert_grade_to_go(grade, grade_id):
    """Convert a grade to Go struct literal"""
    grade_id_str = grade["id"]
    name = grade["name"]
    cost = grade["cost"]
    source = grade["source"]
    
    parts = [
        f'ID: "{grade_id_str}"',
        f'Name: {json.dumps(name)}',
        f'Cost: {json.dumps(cost)}',
        f'Source: {json.dumps(source)}',
    ]
    
    if "addictionthreshold" in grade:
        threshold_str = convert_string_ptr(grade["addictionthreshold"])
        if threshold_str != "nil":
            parts.append(f"AddictionThreshold: {threshold_str}")
    
    return f'''	"{grade_id}": {{
		{",\n\t\t".join(parts)},
	}},'''

def convert_bonus_to_go(bonus):
    """Convert bonus object to Go struct literal"""
    if not bonus:
        return "nil"
    
    parts = []
    
    if "attribute" in bonus:
        parts.append("Attribute: nil")  # TODO: Handle complex attribute structure
    
    if "limit" in bonus:
        parts.append("Limit: nil")  # TODO: Handle complex limit structure
    
    if "initiativedice" in bonus:
        parts.append(f'InitiativeDice: {json.dumps(bonus["initiativedice"])}')
    
    if "quality" in bonus:
        parts.append("Quality: nil")  # TODO: Handle complex quality structure
    
    if "specificskill" in bonus:
        parts.append("SpecificSkill: nil")  # TODO: Handle complex specificskill structure
    
    if not parts:
        return "nil"
    
    return "&DrugBonus{" + ", ".join(parts) + "}"

def convert_drug_to_go(drug, drug_id):
    """Convert a drug to Go struct literal"""
    drug_id_str = drug["id"]
    name = drug["name"]
    category = drug["category"]
    source = drug["source"]
    page = drug["page"]
    
    parts = [
        f'ID: "{drug_id_str}"',
        f'Name: {json.dumps(name)}',
        f'Category: {json.dumps(category)}',
        f'Source: {json.dumps(source)}',
        f'Page: {json.dumps(page)}',
    ]
    
    if "rating" in drug:
        parts.append(f'Rating: {json.dumps(drug["rating"])}')
    if "avail" in drug:
        parts.append(f'Avail: {json.dumps(drug["avail"])}')
    if "cost" in drug:
        parts.append(f'Cost: {json.dumps(drug["cost"])}')
    if "speed" in drug:
        parts.append(f'Speed: {json.dumps(drug["speed"])}')
    if "vectors" in drug:
        parts.append(f'Vectors: {json.dumps(drug["vectors"])}')
    if "duration" in drug:
        parts.append(f'Duration: {json.dumps(drug["duration"])}')
    
    bonus_str = convert_bonus_to_go(drug.get("bonus"))
    if bonus_str != "nil":
        parts.append(f"Bonus: {bonus_str}")
    
    return f'''	"{drug_id}": {{
		{",\n\t\t".join(parts)},
	}},'''

def convert_effects_to_go(effects):
    """Convert effects to Go struct literal"""
    if not effects or "effect" not in effects:
        return "nil"
    
    # TODO: Handle complex effects structure
    return "&DrugComponentEffects{Effect: nil}"

def convert_component_to_go(component, component_id):
    """Convert a drug component to Go struct literal"""
    component_id_str = component["id"]
    name = component["name"]
    category = component["category"]
    source = component["source"]
    page = component["page"]
    
    parts = [
        f'ID: "{component_id_str}"',
        f'Name: {json.dumps(name)}',
        f'Category: {json.dumps(category)}',
        f'Source: {json.dumps(source)}',
        f'Page: {json.dumps(page)}',
    ]
    
    effects_str = convert_effects_to_go(component.get("effects"))
    if effects_str != "nil":
        parts.append(f"Effects: {effects_str}")
    
    if "availability" in component:
        parts.append(f'Availability: {json.dumps(component["availability"])}')
    if "cost" in component:
        parts.append(f'Cost: {json.dumps(component["cost"])}')
    if "rating" in component:
        parts.append(f'Rating: {json.dumps(component["rating"])}')
    if "threshold" in component:
        parts.append(f'Threshold: {json.dumps(component["threshold"])}')
    if "limit" in component:
        parts.append(f'Limit: {json.dumps(component["limit"])}')
    
    return f'''	"{component_id}": {{
		{",\n\t\t".join(parts)},
	}},'''

def main():
    with open("data/chummer/drugcomponents.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    print("package v5")
    print()
    
    # Categories
    cats = data["categories"]["category"]
    print("// DataDrugComponentCategories contains drug component category names")
    print("var DataDrugComponentCategories = []string{")
    for cat in cats:
        print(f'	{json.dumps(cat)},')
    print("}")
    print()
    
    # Grades
    grades = data["grades"]["grade"]
    print("// DataDrugComponentGrades contains drug component grade records keyed by their ID (lowercase with underscores)")
    print("var DataDrugComponentGrades = map[string]DrugComponentGrade{")
    
    used_grade_ids = {}
    for grade in grades:
        name = grade["name"]
        grade_id = to_snake_case(name)
        
        original_id = grade_id
        suffix = 0
        while grade_id in used_grade_ids:
            suffix += 1
            grade_id = f"{original_id}_{suffix}"
        
        used_grade_ids[grade_id] = True
        print(convert_grade_to_go(grade, grade_id))
    
    print("}")
    print()
    
    # Drugs
    drugs = data["drugs"]["drug"]
    print("// DataDrugs contains drug records keyed by their ID (lowercase with underscores)")
    print("var DataDrugs = map[string]Drug{")
    
    used_drug_ids = {}
    for drug in drugs:
        name = drug["name"]
        drug_id = to_snake_case(name)
        
        original_id = drug_id
        suffix = 0
        while drug_id in used_drug_ids:
            suffix += 1
            drug_id = f"{original_id}_{suffix}"
        
        used_drug_ids[drug_id] = True
        print(convert_drug_to_go(drug, drug_id))
    
    print("}")
    print()
    
    # Drug components
    components = data["drugcomponents"]["drugcomponent"]
    print("// DataDrugComponents contains drug component records keyed by their ID (lowercase with underscores)")
    print("var DataDrugComponents = map[string]DrugComponent{")
    
    used_component_ids = {}
    for component in components:
        name = component["name"]
        component_id = to_snake_case(name)
        
        original_id = component_id
        suffix = 0
        while component_id in used_component_ids:
            suffix += 1
            component_id = f"{original_id}_{suffix}"
        
        used_component_ids[component_id] = True
        print(convert_component_to_go(component, component_id))
    
    print("}")

if __name__ == "__main__":
    main()

