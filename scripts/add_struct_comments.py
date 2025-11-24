#!/usr/bin/env python3
"""Add comprehensive comments to struct fields based on XML analysis"""

import json
import re
import os
import sys
from pathlib import Path
from typing import Dict, Any, Optional, List

def xml_tag_to_go_field(xml_tag: str) -> str:
    """Convert XML tag name to Go field name (PascalCase)"""
    # Handle camelCase or snake_case
    if '_' in xml_tag:
        parts = xml_tag.split('_')
        return ''.join(word.capitalize() for word in parts)
    elif xml_tag:
        # Capitalize first letter
        return xml_tag[0].upper() + xml_tag[1:]
    return xml_tag

def extract_xml_tag_from_path(xml_path: str) -> str:
    """Extract XML tag name from path"""
    parts = xml_path.split('/')
    if not parts:
        return ""
    # Get last part, remove namespace
    tag = parts[-1].split(':')[-1]
    # Remove @ for attributes
    if tag.startswith('@'):
        tag = tag[1:]
    return tag

def generate_field_comment(field_data: Dict[str, Any], field_name: str, xml_path: str) -> str:
    """Generate comment for a struct field"""
    lines = []
    
    # Field description
    description = field_name.lower().replace('_', ' ')
    lines.append(f"// {field_name} represents {description}")
    
    # Type information
    type_patterns = field_data.get('type_patterns', [])
    if type_patterns:
        type_info = ', '.join(type_patterns)
        lines.append(f"// Type: {type_info}")
    
    # Usage information
    presence_rate = field_data.get('presence_rate', 0)
    if presence_rate >= 0.99:
        usage = "always present"
    elif presence_rate >= 0.5:
        usage = "usually present"
    elif presence_rate > 0:
        usage = "optional"
    else:
        usage = "rarely present"
    lines.append(f"// Usage: {usage} ({presence_rate:.1%})")
    
    # Value information
    unique_values = field_data.get('unique_values', 0)
    if unique_values > 0:
        lines.append(f"// Unique Values: {unique_values}")
    
    # Examples
    examples = field_data.get('examples', [])
    if examples:
        example_str = ', '.join(str(e) for e in examples[:3])
        if len(examples) > 3:
            example_str += f" (and {len(examples) - 3} more)"
        lines.append(f"// Examples: {example_str}")
    
    # Numeric/Boolean ratios
    numeric_ratio = field_data.get('numeric_ratio', 0)
    boolean_ratio = field_data.get('boolean_ratio', 0)
    if numeric_ratio > 0.8:
        lines.append(f"// Note: {numeric_ratio:.1%} of values are numeric strings")
    if boolean_ratio > 0.8:
        lines.append(f"// Note: {boolean_ratio:.1%} of values are boolean strings")
    
    # Enum candidate
    if field_data.get('is_enum_candidate', False):
        all_values = field_data.get('all_values', [])
        if all_values and len(all_values) <= 15:
            values_str = ', '.join(sorted(all_values))
            lines.append(f"// Enum Candidate: {values_str}")
        else:
            lines.append("// Enum Candidate: Yes")
    
    # Length range
    min_length = field_data.get('min_length', 0)
    max_length = field_data.get('max_length', 0)
    if min_length > 0 and max_length > 0 and min_length != max_length:
        lines.append(f"// Length: {min_length}-{max_length} characters")
    
    return '\n'.join(lines)

def extract_xml_tag_from_go_field(line: str) -> Optional[str]:
    """Extract XML tag name from Go struct field line"""
    # Look for xml:"tagname" pattern
    xml_tag_match = re.search(r'xml:"([^"]+)"', line)
    if xml_tag_match:
        tag = xml_tag_match.group(1)
        # Remove omitempty, chardata, attr markers
        tag = tag.split(',')[0]
        if tag.startswith('@'):
            tag = tag[1:]
        return tag
    return None

def build_xml_tag_to_analysis_mapping(fields: Dict[str, Any]) -> Dict[str, tuple]:
    """Build mapping from XML tag names to analysis data"""
    mapping = {}
    for xml_path, field_data in fields.items():
        xml_tag = extract_xml_tag_from_path(xml_path)
        if xml_tag:
            # Store with path for reference
            mapping[xml_tag] = (xml_path, field_data)
    return mapping

def add_comments_to_struct_file(go_file: str, analysis_data: Dict[str, Any], 
                                xml_file_key: str, struct_mapping: Dict[str, str]) -> bool:
    """Add comments to a Go struct file based on analysis"""
    if not os.path.exists(go_file):
        print(f"Warning: {go_file} not found")
        return False
    
    if xml_file_key not in analysis_data:
        print(f"Warning: {xml_file_key} not found in analysis data")
        return False
    
    result = analysis_data[xml_file_key]
    if 'error' in result:
        print(f"Warning: Error in analysis for {xml_file_key}: {result['error']}")
        return False
    
    # Read Go file
    with open(go_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    fields = result.get('fields', {})
    attributes = result.get('attributes', {})
    
    if not fields and not attributes:
        print(f"No fields or attributes found in analysis for {xml_file_key}")
        return False
    
    # Build mapping from XML tags to analysis data
    tag_mapping = build_xml_tag_to_analysis_mapping(fields)
    # Also map attributes
    for attr_path, attr_data in attributes.items():
        attr_tag = extract_xml_tag_from_path(attr_path)
        if attr_tag:
            tag_mapping[attr_tag] = (attr_path, attr_data)
    
    # Find struct definitions and add comments
    lines = content.split('\n')
    new_lines = []
    i = 0
    changed = False
    
    while i < len(lines):
        line = lines[i]
        new_lines.append(line)
        
        # Look for struct definitions
        struct_match = re.match(r'^type\s+(\w+)\s+struct\s*{', line)
        if struct_match:
            struct_name = struct_match.group(1)
            i += 1
            
            # Process fields in this struct
            while i < len(lines):
                field_line = lines[i]
                
                # Check if we've reached the end of the struct
                if field_line.strip() == '}':
                    new_lines.append(field_line)
                    i += 1
                    break
                
                # Look for field definition
                field_match = re.match(r'^\s+(\w+)\s+', field_line)
                if field_match:
                    field_name = field_match.group(1)
                    
                    # Extract XML tag from field line
                    xml_tag = extract_xml_tag_from_go_field(field_line)
                    
                    # Check if we have analysis data for this XML tag
                    if xml_tag and xml_tag in tag_mapping:
                        xml_path, field_data = tag_mapping[xml_tag]
                        
                        # Check if comment already exists (look back up to 10 lines)
                        has_comment = False
                        for j in range(max(0, len(new_lines) - 10), len(new_lines)):
                            line_text = new_lines[j].strip()
                            if line_text.startswith('//') and (field_name.lower() in line_text.lower() or 'Usage:' in line_text or 'Examples:' in line_text):
                                has_comment = True
                                break
                        # Also check if the field line itself has a comment
                        if not has_comment and '//' in field_line:
                            has_comment = True
                        
                        if not has_comment:
                            # Add comment before field
                            comment = generate_field_comment(field_data, field_name, xml_path)
                            new_lines.append(comment)
                            changed = True
                    
                    new_lines.append(field_line)
                else:
                    new_lines.append(field_line)
                
                i += 1
        else:
            i += 1
    
    # Write updated content if changed
    if changed:
        new_content = '\n'.join(new_lines)
        with open(go_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    
    return False

def create_struct_mapping() -> Dict[str, str]:
    """Create mapping from Go struct files to XML file keys"""
    return {
        'actions.go': 'actions',
        'armor.go': 'armor',
        'bioware.go': 'bioware',
        'books.go': 'books',
        'complexforms.go': 'complexforms',
        'contacts.go': 'contacts',
        'critterpowers.go': 'critterpowers',
        'critters.go': 'critters',
        'cyberware.go': 'cyberware',
        'drugcomponents.go': 'drugcomponents',
        'echoes.go': 'echoes',
        'gear.go': 'gear',
        'improvements.go': 'improvements',
        'licenses.go': 'licenses',
        'lifemodules.go': 'lifemodules',
        'lifestyles.go': 'lifestyles',
        'martialarts.go': 'martialarts',
        'mentors.go': 'mentors',
        'metamagic.go': 'metamagic',
        'metatypes.go': 'metatypes',
        'options.go': 'options',
        'packs.go': 'packs',
        'paragons.go': 'paragons',
        'powers.go': 'powers',
        'priorities.go': 'priorities',
        'programs.go': 'programs',
        'qualities.go': 'qualities',
        'qualitylevels.go': 'qualitylevels',
        'ranges.go': 'ranges',
        'references.go': 'references',
        'settings.go': 'settings',
        'sheets.go': 'sheets',
        'skills.go': 'skills',
        'spells.go': 'spells',
        'spiritpowers.go': 'spiritpowers',
        'streams.go': 'streams',
        'strings.go': 'strings',
        'tips.go': 'tips',
        'traditions.go': 'traditions',
        'vehicles.go': 'vehicles',
        'vessels.go': 'vessels',
        'weapons.go': 'weapons',
    }

def main():
    """Main entry point"""
    if len(sys.argv) < 3:
        print("Usage: add_struct_comments.py <analysis.json> <go_file> [xml_file_key]")
        print("   or: add_struct_comments.py <analysis.json> --all [go_dir]")
        sys.exit(1)
    
    analysis_json = sys.argv[1]
    go_file_arg = sys.argv[2]
    
    # Load analysis data
    with open(analysis_json, 'r', encoding='utf-8') as f:
        analysis_data = json.load(f)
    
    struct_mapping = create_struct_mapping()
    
    if go_file_arg == '--all':
        # Process all Go files
        go_dir = sys.argv[3] if len(sys.argv) > 3 else 'pkg/shadowrun/edition/v5'
        
        for go_file_name, xml_key in struct_mapping.items():
            go_file_path = os.path.join(go_dir, go_file_name)
            if os.path.exists(go_file_path):
                print(f"Processing {go_file_path}...")
                if add_comments_to_struct_file(go_file_path, analysis_data, xml_key, struct_mapping):
                    print(f"  Updated {go_file_path}")
                else:
                    print(f"  No changes needed for {go_file_path}")
            else:
                # Try common subdirectory
                common_path = os.path.join(go_dir, 'common', go_file_name)
                if os.path.exists(common_path):
                    print(f"Processing {common_path}...")
                    if add_comments_to_struct_file(common_path, analysis_data, xml_key, struct_mapping):
                        print(f"  Updated {common_path}")
                    else:
                        print(f"  No changes needed for {common_path}")
    else:
        # Process single file
        go_file = go_file_arg
        xml_key = sys.argv[3] if len(sys.argv) > 3 else None
        
        if not xml_key:
            # Try to infer from filename
            go_file_name = os.path.basename(go_file)
            xml_key = struct_mapping.get(go_file_name)
            if not xml_key:
                print(f"Error: Could not determine XML file key for {go_file_name}")
                print("Please specify it as the third argument")
                sys.exit(1)
        
        if add_comments_to_struct_file(go_file, analysis_data, xml_key, struct_mapping):
            print(f"Updated {go_file}")
        else:
            print(f"No changes needed for {go_file}")

if __name__ == '__main__':
    main()

