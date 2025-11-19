#!/usr/bin/env python3
"""Generate lifemodules_data.go from lifemodules.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    # Replace spaces and special chars with underscores
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_stage_to_go(stage, stage_id):
    """Convert a stage to Go struct literal"""
    content = stage.get("+content", "")
    order = stage.get("+@order", "")
    
    return f'''	"{stage_id}": {{
		Content: {json.dumps(content)},
		Order: {json.dumps(order)},
	}},'''

def convert_version_bonus_to_go(bonus):
    """Convert version bonus to Go struct literal"""
    if not bonus:
        return "nil"
    
    parts = []
    
    if "attributelevel" in bonus:
        parts.append("AttributeLevel: nil")  # TODO: Handle complex structure
    
    if "skilllevel" in bonus:
        parts.append("SkillLevel: nil")  # TODO: Handle single or list
    
    if "knowledgeskilllevel" in bonus:
        parts.append("KnowledgeSkillLevel: nil")  # TODO: Handle single or list
    
    if "pushtext" in bonus:
        parts.append(f'PushText: {json.dumps(bonus["pushtext"])}')
    
    if "freenegativequalities" in bonus:
        parts.append(f'FreeNegativeQualities: {json.dumps(bonus["freenegativequalities"])}')
    
    if "addqualities" in bonus:
        parts.append("AddQualities: nil")  # TODO: Handle complex structure
    
    if not parts:
        return "nil"
    
    return "&LifeModuleVersionBonus{" + ", ".join(parts) + "}"

def convert_version_to_go(version, version_id):
    """Convert a version to Go struct literal"""
    version_id_str = version["id"]
    name = version["name"]
    
    parts = [
        f'ID: "{version_id_str}"',
        f'Name: {json.dumps(name)}',
    ]
    
    if "story" in version:
        parts.append(f'Story: {json.dumps(version["story"])}')
    
    bonus_str = convert_version_bonus_to_go(version.get("bonus"))
    if bonus_str != "nil":
        parts.append(f"Bonus: {bonus_str}")
    
    return "LifeModuleVersion{" + ", ".join(parts) + "}"

def convert_versions_to_go(versions):
    """Convert versions to Go struct literal"""
    if not versions or "version" not in versions:
        return "nil"
    
    v = versions["version"]
    if v is None:
        return "nil"
    
    if isinstance(v, list):
        if len(v) == 0:
            return "nil"
        # For now, set to nil due to complexity
        return "&LifeModuleVersions{Version: nil}"  # TODO: Handle list of versions
    elif isinstance(v, dict):
        # For now, set to nil due to complexity
        return "&LifeModuleVersions{Version: nil}"  # TODO: Handle single version
    
    return "nil"

def convert_module_bonus_to_go(bonus):
    """Convert module bonus to Go struct literal"""
    if not bonus:
        return "nil"
    
    parts = []
    
    if "skilllevel" in bonus:
        parts.append("SkillLevel: nil")  # TODO: Handle single or list
    
    if "knowledgeskilllevel" in bonus:
        parts.append("KnowledgeSkillLevel: nil")  # TODO: Handle single or list
    
    if "attributelevel" in bonus:
        parts.append("AttributeLevel: nil")  # TODO: Handle complex structure
    
    if "addqualities" in bonus:
        parts.append("AddQualities: nil")  # TODO: Handle complex structure
    
    if not parts:
        return "nil"
    
    return "&LifeModuleBonus{" + ", ".join(parts) + "}"

def convert_module_to_go(module, module_id):
    """Convert a life module to Go struct literal"""
    module_id_str = module["id"]
    stage = module["stage"]
    category = module["category"]
    name = module["name"]
    karma = module["karma"]
    source = module.get("source", "")
    page = module.get("page", "")
    
    parts = [
        f'ID: "{module_id_str}"',
        f'Stage: {json.dumps(stage)}',
        f'Category: {json.dumps(category)}',
        f'Name: {json.dumps(name)}',
        f'Karma: {json.dumps(karma)}',
    ]
    
    if source:
        parts.append(f'Source: {json.dumps(source)}')
    if page:
        parts.append(f'Page: {json.dumps(page)}')
    
    versions_str = convert_versions_to_go(module.get("versions"))
    if versions_str != "nil":
        parts.append(f"Versions: {versions_str}")
    
    bonus_str = convert_module_bonus_to_go(module.get("bonus"))
    if bonus_str != "nil":
        parts.append(f"Bonus: {bonus_str}")
    
    if "story" in module and module["story"] is not None:
        parts.append(f'Story: {json.dumps(module["story"])}')
    
    return f'''	"{module_id}": {{
		{",\n\t\t".join(parts)},
	}},'''

def main():
    with open("data/chummer/lifemodules.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    print("package v5")
    print()
    
    # Stages
    stages = data["stages"]["stage"]
    print("// DataLifeModuleStages contains life module stage records keyed by their ID (lowercase with underscores)")
    print("var DataLifeModuleStages = map[string]LifeModuleStage{")
    
    used_stage_ids = {}
    for stage in stages:
        content = stage.get("+content", "")
        stage_id = to_snake_case(content)
        
        original_id = stage_id
        suffix = 0
        while stage_id in used_stage_ids:
            suffix += 1
            stage_id = f"{original_id}_{suffix}"
        
        used_stage_ids[stage_id] = True
        print(convert_stage_to_go(stage, stage_id))
    
    print("}")
    print()
    
    # Modules
    modules = data["modules"]["module"]
    print("// DataLifeModules contains life module records keyed by their ID (lowercase with underscores)")
    print("var DataLifeModules = map[string]LifeModule{")
    
    used_module_ids = {}
    for module in modules:
        name = module["name"]
        module_id = to_snake_case(name)
        
        original_id = module_id
        suffix = 0
        while module_id in used_module_ids:
            suffix += 1
            module_id = f"{original_id}_{suffix}"
        
        used_module_ids[module_id] = True
        print(convert_module_to_go(module, module_id))
    
    print("}")
    print()
    print("// Note: StoryBuilder macros are not included as they are application-specific configuration")

if __name__ == "__main__":
    main()

