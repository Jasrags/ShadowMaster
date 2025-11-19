#!/usr/bin/env python3
"""
Transform struct literals to use embedded BaseBonus syntax.

This script transforms:
    &BiowareBonus{
        Field1: value1,
        Field2: value2,
    }

To:
    &BiowareBonus{
        BaseBonus: common.BaseBonus{
            Field1: value1,
            Field2: value2,
        },
    }
"""

import re
import sys

# Fields that belong to BaseBonus (all of them for BiowareBonus)
BASE_BONUS_FIELDS = {
    'LimitModifier', 'SkillCategory', 'SpecificSkill', 'SkillGroup',
    'SelectSkill', 'SkillAttribute', 'SkillLinkedAttribute',
    'SpecificAttribute', 'AttributeKarmaCost', 'PhysicalLimit', 'MentalLimit',
    'SocialLimit', 'ConditionMonitor', 'Initiative', 'InitiativePass',
    'Dodge', 'DamageResistance', 'UnarmedDV', 'UnarmedDVPhysical',
    'UnarmedReach', 'WeaponAccuracy', 'Armor', 'FireArmor', 'ColdArmor',
    'ElectricityArmor', 'ToxinContactResist', 'ToxinIngestionResist',
    'ToxinInhalationResist', 'ToxinInjectionResist', 'PathogenContactResist',
    'PathogenIngestionResist', 'PathogenInhalationResist', 'PathogenInjectionResist',
    'RadiationResist', 'FatigueResist', 'StunCMRecovery', 'PhysicalCMRecovery',
    'Memory', 'DrainResist', 'FadingResist', 'DirectManaSpellResist',
    'DetectionSpellResist', 'ManaIllusionResist', 'MentalManipulationResist',
    'DecreaseBODResist', 'DecreaseAGIResist', 'DecreaseREAResist',
    'DecreaseSTRResist', 'DecreaseCHAResist', 'DecreaseINTResist',
    'DecreaseLOGResist', 'DecreaseWILResist', 'Composure',
    'JudgeIntentionsDefense', 'LifestyleCost', 'PhysiologicalAddictionFirstTime',
    'PsychologicalAddictionFirstTime', 'PhysiologicalAddictionAlreadyAddicted',
    'PsychologicalAddictionAlreadyAddicted', 'DisableQuality', 'AddQualities',
    'ReflexRecorderOptimization', 'Ambidextrous', 'Adapsin', 'Unique', 'SelectText'
}

def find_matching_brace(text, start_pos):
    """Find the matching closing brace for an opening brace."""
    depth = 0
    pos = start_pos
    while pos < len(text):
        if text[pos] == '{':
            depth += 1
        elif text[pos] == '}':
            depth -= 1
            if depth == 0:
                return pos
        elif text[pos] == '"':
            # Skip string literals
            pos += 1
            while pos < len(text) and text[pos] != '"':
                if text[pos] == '\\':
                    pos += 1
                pos += 1
        elif text[pos] == '`':
            # Skip raw string literals
            pos += 1
            while pos < len(text) and text[pos] != '`':
                pos += 1
        pos += 1
    return -1

def transform_bonus_literal(content, bonus_type, package_prefix):
    """Transform a bonus struct literal to use embedded BaseBonus."""
    pattern = rf'&{bonus_type}\{{'
    
    def replace_literal(match):
        start = match.start()
        brace_start = match.end() - 1  # Position of the opening brace
        
        # Find the matching closing brace
        brace_end = find_matching_brace(content, brace_start)
        if brace_end == -1:
            return match.group(0)  # Return unchanged if we can't find the match
        
        # Extract the struct literal content
        literal_content = content[brace_start + 1:brace_end]
        
        # Check if this literal has any BaseBonus fields
        has_base_fields = any(field in literal_content for field in BASE_BONUS_FIELDS)
        
        if not has_base_fields:
            # No BaseBonus fields, return unchanged
            return match.group(0)
        
        # Split into lines to process
        lines = literal_content.split('\n')
        base_lines = []
        other_lines = []
        
        for line in lines:
            # Check if line contains a BaseBonus field
            is_base_field = any(
                re.match(rf'^\s*{field}\s*:', line) 
                for field in BASE_BONUS_FIELDS
            )
            if is_base_field:
                base_lines.append(line)
            else:
                other_lines.append(line)
        
        # Reconstruct the struct literal
        if base_lines and not other_lines:
            # All fields are BaseBonus fields
            base_content = '\n'.join(base_lines)
            return f'&{bonus_type}{{\n\t\t\tBaseBonus: {package_prefix}.BaseBonus{{\n\t\t\t\t{base_content}\n\t\t\t}},\n\t\t}}'
        elif base_lines and other_lines:
            # Mixed fields
            base_content = '\n'.join(base_lines)
            other_content = '\n'.join(other_lines)
            return f'&{bonus_type}{{\n\t\t\tBaseBonus: {package_prefix}.BaseBonus{{\n\t\t\t\t{base_content}\n\t\t\t}},\n\t\t\t{other_content}\n\t\t}}'
        else:
            # No BaseBonus fields (shouldn't happen, but handle it)
            return match.group(0)
    
    return re.sub(pattern, replace_literal, content)

def main():
    if len(sys.argv) < 2:
        print("Usage: transform_bonus_literals.py <file> [bonus_type] [package_prefix]")
        sys.exit(1)
    
    filename = sys.argv[1]
    bonus_type = sys.argv[2] if len(sys.argv) > 2 else 'BiowareBonus'
    package_prefix = sys.argv[3] if len(sys.argv) > 3 else 'common'
    
    with open(filename, 'r') as f:
        content = f.read()
    
    # Transform the file
    transformed = transform_bonus_literal(content, bonus_type, package_prefix)
    
    # Write back
    with open(filename, 'w') as f:
        f.write(transformed)
    
    print(f"Transformed {bonus_type} literals in {filename}")

if __name__ == '__main__':
    main()

