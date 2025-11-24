#!/usr/bin/env python3
"""
Convert skill-related fields in qualities_data.go from interface{} to concrete types.
Handles brace matching carefully to avoid syntax errors.
"""

import re
import sys

def convert_specific_skill_field(content):
    """Convert SpecificSkill field from interface{} to []common.SpecificSkillBonus"""
    lines = content.split('\n')
    new_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check if this line starts a SpecificSkill field
        if re.search(r'\s+SpecificSkill:\s*', line):
            # Case 1: Single value: SpecificSkill: SpecificSkillBonus{
            if re.search(r'SpecificSkill:\s*SpecificSkillBonus\s*\{', line):
                # Convert to: SpecificSkill: []common.SpecificSkillBonus{{
                line = re.sub(
                    r'SpecificSkill:\s*SpecificSkillBonus\s*\{',
                    r'SpecificSkill: []common.SpecificSkillBonus{{',
                    line
                )
                new_lines.append(line)
                i += 1
                
                # Find the matching closing brace for the struct
                brace_count = 1  # We already have one opening brace
                while i < len(lines) and brace_count > 0:
                    new_lines.append(lines[i])
                    brace_count += lines[i].count('{') - lines[i].count('}')
                    if brace_count == 0:
                        # This line closes the struct, now we need to close the slice
                        # Check if next line has a comma
                        if i + 1 < len(lines) and lines[i].rstrip().endswith(','):
                            # Replace the closing }, with }},
                            new_lines[-1] = re.sub(r'\},\s*$', r'}},', new_lines[-1])
                        else:
                            # Add closing brace for slice
                            new_lines[-1] = new_lines[-1].rstrip() + '},'
                        break
                    i += 1
                i += 1
                continue
            
            # Case 2: Array with []interface{}: SpecificSkill: []interface{}{SpecificSkillBonus{
            elif re.search(r'SpecificSkill:\s*\[\]interface\{\}\s*\{', line):
                # Convert opening: []interface{}{SpecificSkillBonus{ -> []common.SpecificSkillBonus{{
                line = re.sub(
                    r'SpecificSkill:\s*\[\]interface\{\}\s*\{SpecificSkillBonus\s*\{',
                    r'SpecificSkill: []common.SpecificSkillBonus{{',
                    line
                )
                new_lines.append(line)
                i += 1
                
                # Find all structs in the array and convert them
                brace_count = 1
                while i < len(lines) and brace_count > 0:
                    current_line = lines[i]
                    
                    # Convert any SpecificSkillBonus{ to common.SpecificSkillBonus{
                    current_line = re.sub(
                        r'(,\s*)SpecificSkillBonus\s*\{',
                        r'\1common.SpecificSkillBonus{',
                        current_line
                    )
                    
                    new_lines.append(current_line)
                    brace_count += current_line.count('{') - current_line.count('}')
                    
                    if brace_count == 0:
                        # This closes the array, check if we need to adjust closing
                        if not current_line.rstrip().endswith(','):
                            # Add comma if missing
                            new_lines[-1] = current_line.rstrip() + ','
                        break
                    i += 1
                i += 1
                continue
        
        new_lines.append(line)
        i += 1
    
    return '\n'.join(new_lines)

def convert_skill_group_field(content):
    """Convert SkillGroup field from interface{} to []*common.SkillGroupBonus"""
    lines = content.split('\n')
    new_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check if this line starts a SkillGroup field
        if re.search(r'\s+SkillGroup:\s*', line):
            # Case 1: Single pointer: SkillGroup: &common.SkillGroupBonus{
            if re.search(r'SkillGroup:\s*&common\.SkillGroupBonus\s*\{', line):
                # Convert to: SkillGroup: []*common.SkillGroupBonus{{
                line = re.sub(
                    r'SkillGroup:\s*&common\.SkillGroupBonus\s*\{',
                    r'SkillGroup: []*common.SkillGroupBonus{{',
                    line
                )
                new_lines.append(line)
                i += 1
                
                # Find the matching closing brace
                brace_count = 1
                while i < len(lines) and brace_count > 0:
                    new_lines.append(lines[i])
                    brace_count += lines[i].count('{') - lines[i].count('}')
                    if brace_count == 0:
                        # Close the slice
                        if lines[i].rstrip().endswith(','):
                            new_lines[-1] = re.sub(r'\},\s*$', r'}},', new_lines[-1])
                        else:
                            new_lines[-1] = new_lines[-1].rstrip() + '},'
                        break
                    i += 1
                i += 1
                continue
            
            # Case 2: Array with []interface{}: SkillGroup: []interface{}{&common.SkillGroupBonus{
            elif re.search(r'SkillGroup:\s*\[\]interface\{\}\s*\{', line):
                # Convert opening: []interface{}{&common.SkillGroupBonus{ -> []*common.SkillGroupBonus{{
                # Handle case where &common.SkillGroupBonus{ is on same line
                if re.search(r'\[\]interface\{\}\s*\{&common\.SkillGroupBonus\s*\{', line):
                    line = re.sub(
                        r'SkillGroup:\s*\[\]interface\{\}\s*\{&common\.SkillGroupBonus\s*\{',
                        r'SkillGroup: []*common.SkillGroupBonus{{',
                        line
                    )
                    new_lines.append(line)
                    i += 1
                else:
                    # &common.SkillGroupBonus{ is on next line, just convert the array declaration
                    line = re.sub(
                        r'SkillGroup:\s*\[\]interface\{\}\s*\{',
                        r'SkillGroup: []*common.SkillGroupBonus{',
                        line
                    )
                    new_lines.append(line)
                    i += 1
                    # Next line should have &common.SkillGroupBonus{, convert it
                    if i < len(lines):
                        lines[i] = re.sub(
                            r'&common\.SkillGroupBonus\s*\{',
                            r'&common.SkillGroupBonus{',
                            lines[i]
                        )
                
                # Find all structs in the array
                brace_count = 1
                while i < len(lines) and brace_count > 0:
                    current_line = lines[i]
                    new_lines.append(current_line)
                    brace_count += current_line.count('{') - current_line.count('}')
                    
                    if brace_count == 0:
                        if not current_line.rstrip().endswith(','):
                            new_lines[-1] = current_line.rstrip() + ','
                        break
                    i += 1
                i += 1
                continue
        
        new_lines.append(line)
        i += 1
    
    return '\n'.join(new_lines)

def convert_select_skill_field(content):
    """Convert SelectSkill field from interface{} to *common.SelectSkill"""
    # Simple conversion: SelectSkill: &SelectSkill{ -> SelectSkill: &common.SelectSkill{
    content = re.sub(
        r'SelectSkill:\s*&SelectSkill\s*\{',
        r'SelectSkill: &common.SelectSkill{',
        content
    )
    # nil stays as nil
    return content

def main():
    file_path = 'pkg/shadowrun/edition/v5/qualities_data.go'
    
    print(f"Reading {file_path}...")
    with open(file_path, 'r') as f:
        content = f.read()
    
    original_content = content
    
    print("Converting SpecificSkill fields...")
    content = convert_specific_skill_field(content)
    
    print("Converting SkillGroup fields...")
    content = convert_skill_group_field(content)
    
    print("Converting SelectSkill fields...")
    content = convert_select_skill_field(content)
    
    print(f"Writing {file_path}...")
    with open(file_path, 'w') as f:
        f.write(content)
    
    # Verify brace balance
    open_braces = content.count('{')
    close_braces = content.count('}')
    diff = open_braces - close_braces
    
    print(f"\nVerification:")
    print(f"  Opening braces: {open_braces}")
    print(f"  Closing braces: {close_braces}")
    print(f"  Difference: {diff}")
    
    if diff != 0:
        print(f"  WARNING: Brace mismatch of {diff} braces!")
        return 1
    
    print("  ✓ Braces are balanced")
    return 0

if __name__ == '__main__':
    sys.exit(main())

