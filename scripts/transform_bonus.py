#!/usr/bin/env python3
"""
Transform BiowareBonus struct literals to use embedded BaseBonus.

Transforms:
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

def find_struct_literal_end(text, start_pos):
    """Find the end position of a struct literal starting at start_pos."""
    depth = 0
    pos = start_pos
    in_string = False
    string_char = None
    in_comment = False
    
    while pos < len(text):
        char = text[pos]
        next_char = text[pos + 1] if pos + 1 < len(text) else None
        
        # Handle comments
        if not in_string and char == '/' and next_char == '/':
            # Skip to end of line
            while pos < len(text) and text[pos] != '\n':
                pos += 1
            continue
        
        # Handle strings
        if not in_comment and (char == '"' or char == '`'):
            if not in_string:
                in_string = True
                string_char = char
            elif char == string_char:
                # Check if it's escaped
                if pos == 0 or text[pos - 1] != '\\':
                    in_string = False
                    string_char = None
        elif in_string:
            pos += 1
            continue
        
        # Handle braces
        if not in_string:
            if char == '{':
                depth += 1
            elif char == '}':
                depth -= 1
                if depth == 0:
                    return pos
        
        pos += 1
    
    return -1

def transform_file(filename, bonus_type, package_prefix):
    """Transform all bonus struct literals in a file."""
    with open(filename, 'r') as f:
        content = f.read()
    
    pattern = rf'&{bonus_type}\{{'
    matches = list(re.finditer(pattern, content))
    
    if not matches:
        print(f"No {bonus_type} literals found in {filename}")
        return
    
    # Process matches in reverse order to maintain positions
    for match in reversed(matches):
        start = match.start()
        brace_start = match.end() - 1  # Position of opening brace
        
        # Find the matching closing brace
        brace_end = find_struct_literal_end(content, brace_start)
        if brace_end == -1:
            print(f"Warning: Could not find matching brace for {bonus_type} at position {start}")
            continue
        
        # Extract the content between braces
        inner_content = content[brace_start + 1:brace_end]
        
        # Skip if already transformed
        if 'BaseBonus:' in inner_content:
            continue
        
        # Determine indentation of the opening line
        line_start = content.rfind('\n', 0, start) + 1
        indent = content[line_start:start]
        field_indent = indent + '\t'
        base_indent = indent + '\t\t'
        
        # Transform the inner content
        # Add extra indentation to each line
        lines = inner_content.split('\n')
        if not lines or not lines[0].strip():
            # Empty struct
            new_inner = f'\n{field_indent}BaseBonus: {package_prefix}.BaseBonus{{\n{field_indent}}},\n{indent}'
        else:
            # Add indentation to each non-empty line
            indented_lines = []
            for line in lines:
                if line.strip():
                    # Add one more level of indentation
                    indented_lines.append(base_indent + line.lstrip())
                else:
                    indented_lines.append('')
            
            new_inner = f'\n{field_indent}BaseBonus: {package_prefix}.BaseBonus{{\n' + '\n'.join(indented_lines) + f'\n{field_indent}}},\n{indent}'
        
        # Replace the content
        content = content[:brace_start + 1] + new_inner + content[brace_end:]
    
    # Write back
    with open(filename, 'w') as f:
        f.write(content)
    
    print(f"Transformed {len(matches)} {bonus_type} literals in {filename}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <file.go> [bonus_type] [package_prefix]")
        sys.exit(1)
    
    filename = sys.argv[1]
    bonus_type = sys.argv[2] if len(sys.argv) > 2 else 'BiowareBonus'
    package_prefix = sys.argv[3] if len(sys.argv) > 3 else 'common'
    
    transform_file(filename, bonus_type, package_prefix)

