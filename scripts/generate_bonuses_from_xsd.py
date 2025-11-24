#!/usr/bin/env python3
"""Generate common/bonuses.go and common/base_bonus.go from bonuses.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def escape_go_string(s):
    """Escape string for Go code"""
    if s is None:
        return '""'
    s = str(s).replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
    return f'"{s}"'

def to_go_identifier(name):
    """Convert XML element name to Go identifier"""
    parts = re.split(r'[-_]', name)
    return ''.join(word.capitalize() for word in parts)

def get_min_occurs(elem):
    """Get minOccurs value, default 1"""
    val = elem.get('minOccurs')
    if val is None:
        return 1
    if val == '0':
        return 0
    return int(val) if val.isdigit() else 1

def get_max_occurs(elem):
    """Get maxOccurs value, default 1"""
    val = elem.get('maxOccurs')
    if val is None:
        return 1
    if val == 'unbounded':
        return -1
    return int(val) if val.isdigit() else 1

def xsd_type_to_go(xsd_type, min_occurs=1, max_occurs=1):
    """Convert XSD type to Go type"""
    if xsd_type is None:
        return 'string'
    
    # Handle simple types
    if xsd_type in ['xs:string', 'string']:
        go_type = 'string'
    elif xsd_type in ['xs:integer', 'xs:int', 'integer', 'int']:
        go_type = 'int'
    elif xsd_type in ['xs:boolean', 'boolean']:
        go_type = 'bool'
    elif xsd_type in ['xs:decimal', 'xs:double', 'xs:float']:
        go_type = 'float64'
    else:
        go_type = 'string'
    
    # Handle cardinality
    if min_occurs == 0:
        if max_occurs == 1:
            return f'*{go_type}'
        else:
            return f'[]{go_type}'
    elif max_occurs > 1 or max_occurs == -1:
        return f'[]{go_type}'
    else:
        return go_type

def parse_complex_type(elem, type_name, all_types=None):
    """Parse a complex type element and generate Go struct"""
    if all_types is None:
        all_types = {}
    
    complex_type = elem.find('.//xs:complexType', NS)
    if complex_type is None:
        return None, all_types
    
    fields = []
    sequence = complex_type.find('.//xs:sequence', NS)
    if sequence is not None:
        for child in sequence.findall('xs:element', NS):
            child_name = child.get('name')
            if child_name:
                child_type = child.get('type')
                min_occurs = get_min_occurs(child)
                max_occurs = get_max_occurs(child)
                
                # Check if it's a complex type
                if child.find('.//xs:complexType', NS) is not None:
                    nested_type_name = to_go_identifier(child_name)
                    # Recursively parse nested type
                    nested_fields, all_types = parse_complex_type(child, nested_type_name, all_types)
                    if nested_fields:
                        all_types[nested_type_name] = nested_fields
                    
                    go_type = nested_type_name
                    if max_occurs > 1 or max_occurs == -1:
                        go_type = f'[]{nested_type_name}'
                    elif min_occurs == 0:
                        go_type = f'*{nested_type_name}'
                    fields.append((child_name, go_type, min_occurs, max_occurs, True))
                else:
                    go_type = xsd_type_to_go(child_type, min_occurs, max_occurs)
                    fields.append((child_name, go_type, min_occurs, max_occurs, False))
    
    # Check for simpleContent (text content with attributes)
    simple_content = complex_type.find('.//xs:simpleContent', NS)
    if simple_content is not None:
        extension = simple_content.find('.//xs:extension', NS)
        if extension is not None:
            base_type = extension.get('base', 'xs:string')
            go_type = xsd_type_to_go(base_type)
            fields.append(('Content', go_type, 1, 1, False))
            
            # Add attributes
            for attr in extension.findall('.//xs:attribute', NS):
                attr_name = attr.get('name')
                attr_type = attr.get('type', 'xs:string')
                go_attr_type = xsd_type_to_go(attr_type, 0, 1)
                fields.append((to_go_identifier(attr_name), go_attr_type, 0, 1, False))
    
    return fields, all_types

def generate_bonus_types():
    """Generate bonus type structs from bonuses.xsd"""
    
    tree = ET.parse('data/chummerxml/bonuses.xsd')
    root = tree.getroot()
    
    # Find bonusTypes complexType
    bonus_type = root.find('.//xs:complexType[@name="bonusTypes"]', NS)
    if bonus_type is None:
        print("ERROR: Could not find bonusTypes")
        return
    
    # Get all direct child elements (top-level bonus fields)
    sequence = bonus_type.find('.//xs:sequence', NS)
    if sequence is None:
        print("ERROR: Could not find sequence in bonusTypes")
        return
    
    top_level_elements = sequence.findall('xs:element', NS)
    print(f"Found {len(top_level_elements)} top-level bonus elements")
    
    # Separate into categories
    simple_fields = []  # Simple string/int/bool fields
    complex_fields = []  # Complex types that need struct definitions
    empty_fields = []  # Empty elements (boolean flags)
    
    complex_type_defs = {}  # Store complex type definitions
    
    # First pass: collect all complex types
    for elem in top_level_elements:
        name = elem.get('name')
        xsd_type = elem.get('type')
        min_occurs = get_min_occurs(elem)
        max_occurs = get_max_occurs(elem)
        
        # Check if it's a complex type
        if elem.find('.//xs:complexType', NS) is not None:
            type_name = to_go_identifier(name)
            complex_fields.append((name, type_name, min_occurs, max_occurs))
    
    # Second pass: parse all complex types (including nested ones)
    for elem in top_level_elements:
        name = elem.get('name')
        if elem.find('.//xs:complexType', NS) is not None:
            type_name = to_go_identifier(name)
            # Parse the complex type (recursively)
            fields, nested_types = parse_complex_type(elem, type_name, complex_type_defs)
            if fields:
                complex_type_defs[type_name] = fields
            # Add any nested types found
            complex_type_defs.update(nested_types)
        elif xsd_type:
            # Simple typed field
            go_type = xsd_type_to_go(xsd_type, min_occurs, max_occurs)
            simple_fields.append((name, go_type, min_occurs, max_occurs))
        else:
            # Empty element (boolean flag)
            empty_fields.append((name, min_occurs, max_occurs))
    
    print(f"Simple fields: {len(simple_fields)}")
    print(f"Complex fields: {len(complex_fields)}")
    print(f"Empty fields: {len(empty_fields)}")
    print(f"Complex type definitions: {len(complex_type_defs)}")
    
    # Generate the Go code
    os.makedirs('pkg/shadowrun/edition/v5/common', exist_ok=True)
    
    # Generate bonus type structs first
    with open('pkg/shadowrun/edition/v5/common/bonuses.go', 'w', encoding='utf-8') as f:
        f.write('package common\n\n')
        f.write('// This file contains bonus type structs generated from bonuses.xsd\n\n')
        
        # Generate complex type structs
        for type_name, fields in sorted(complex_type_defs.items()):
            f.write(f'// {type_name} represents a {type_name.lower()} bonus\n')
            f.write(f'type {type_name} struct {{\n')
            for field_name, go_type, min_occ, max_occ, is_complex in fields:
                xml_tag = field_name.lower()
                json_tag = field_name.lower()
                
                # Handle special cases
                if field_name == 'Content':
                    xml_tag = ',chardata'
                    json_tag = '+content,omitempty'
                elif field_name.startswith('@'):
                    xml_tag = field_name[1:].lower() + ',attr'
                    json_tag = '+@' + field_name[1:].lower() + ',omitempty'
                
                omitempty = ',omitempty' if min_occ == 0 else ''
                f.write(f'\t{to_go_identifier(field_name)} {go_type} `xml:"{xml_tag}{omitempty}" json:"{json_tag}"`\n')
            f.write('}\n\n')
        
        f.write('// Additional bonus types (to be expanded)\n')
        f.write('// Note: This is a partial implementation - bonuses.xsd contains 642 elements\n')
    
    print("Generated common/bonuses.go (partial - complex types)")
    
    # Now generate BaseBonus with all fields
    # This will be a very large struct
    print("\nGenerating BaseBonus struct...")
    
    # Read existing base_bonus.go to preserve structure
    base_bonus_path = 'pkg/shadowrun/edition/v5/common/base_bonus.go'
    existing_content = ''
    if os.path.exists(base_bonus_path):
        with open(base_bonus_path, 'r', encoding='utf-8') as f:
            existing_content = f.read()
    
    # Generate complete BaseBonus
    with open(base_bonus_path, 'w', encoding='utf-8') as f:
        f.write('package common\n\n')
        f.write('// BaseBonus contains all common bonus fields that are shared across different bonus types\n')
        f.write('// This struct is generated from bonuses.xsd and contains all 282 top-level bonus elements\n')
        f.write('// This can be embedded in specific bonus structures like BiowareBonus, CyberwareBonus, etc.\n')
        f.write('type BaseBonus struct {\n')
        
        # Write simple fields
        for name, go_type, min_occ, max_occ in simple_fields:
            field_name = to_go_identifier(name)
            xml_tag = name
            json_tag = name
            omitempty = ',omitempty' if min_occ == 0 else ''
            f.write(f'\t{field_name} {go_type} `xml:"{xml_tag}{omitempty}" json:"{json_tag}{omitempty}"`\n')
        
        # Write complex fields
        for name, type_name, min_occ, max_occ in complex_fields:
            field_name = to_go_identifier(name)
            if max_occ > 1 or max_occ == -1:
                go_type = f'[]{type_name}'
            elif min_occ == 0:
                go_type = f'*{type_name}'
            else:
                go_type = type_name
            xml_tag = name
            json_tag = name
            omitempty = ',omitempty' if min_occ == 0 else ''
            f.write(f'\t{field_name} {go_type} `xml:"{xml_tag}{omitempty}" json:"{json_tag}{omitempty}"`\n')
        
        # Write empty fields (boolean flags)
        for name, min_occ, max_occ in empty_fields:
            field_name = to_go_identifier(name)
            if max_occ > 1 or max_occ == -1:
                go_type = '[]bool'
            elif min_occ == 0:
                go_type = '*bool'
            else:
                go_type = 'bool'
            xml_tag = name
            json_tag = name
            omitempty = ',omitempty' if min_occ == 0 else ''
            f.write(f'\t{field_name} {go_type} `xml:"{xml_tag}{omitempty}" json:"{json_tag}{omitempty}"`\n')
        
        # Add unique attribute
        f.write('\n\t// Unique identifier attribute\n')
        f.write('\tUnique string `xml:"unique,attr,omitempty" json:"+@unique,omitempty"`\n')
        f.write('\tUseSelected *Boolean `xml:"useselected,attr,omitempty" json:"+@useselected,omitempty"`\n')
        
        f.write('}\n')
    
    print(f"Generated BaseBonus with {len(simple_fields) + len(complex_fields) + len(empty_fields)} fields")

if __name__ == '__main__':
    print("Generating bonus types from bonuses.xsd...")
    generate_bonus_types()
    print("Done!")

