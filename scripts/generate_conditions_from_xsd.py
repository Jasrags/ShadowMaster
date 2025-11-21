#!/usr/bin/env python3
"""Generate common/conditions.go from conditions.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def to_go_identifier(name):
    """Convert XML element name to Go identifier"""
    # Handle special cases like "OR", "AND"
    if name == 'OR':
        return 'Or'
    elif name == 'AND':
        return 'And'
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

def parse_group(root, group_name, processed_groups=None):
    """Parse an XSD group definition"""
    if processed_groups is None:
        processed_groups = {}
    
    if group_name in processed_groups:
        return processed_groups[group_name]
    
    group = root.find(f'.//xs:group[@name="{group_name}"]', NS)
    if group is None:
        return []
    
    fields = []
    sequence = group.find('.//xs:sequence', NS)
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
                    nested_fields = parse_complex_type(child, nested_type_name)
                    fields.append((child_name, nested_type_name, nested_fields, min_occurs, max_occurs, True))
                # Check if it references a group
                elif child.get('ref'):
                    ref_name = child.get('ref')
                    # Skip for now, will handle separately
                    pass
                else:
                    go_type = xsd_type_to_go(child_type, min_occurs, max_occurs)
                    fields.append((child_name, go_type, None, min_occurs, max_occurs, False))
    
    processed_groups[group_name] = fields
    return fields

def parse_complex_type(elem, type_name):
    """Parse a complex type element and return field definitions"""
    complex_type = elem.find('.//xs:complexType', NS)
    if complex_type is None:
        return []
    
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
                    nested_fields = parse_complex_type(child, nested_type_name)
                    fields.append((child_name, nested_type_name, nested_fields, min_occurs, max_occurs, True))
                else:
                    go_type = xsd_type_to_go(child_type, min_occurs, max_occurs)
                    fields.append((child_name, go_type, None, min_occurs, max_occurs, False))
    
    # Check for simpleContent (text content with attributes)
    simple_content = complex_type.find('.//xs:simpleContent', NS)
    if simple_content is not None:
        extension = simple_content.find('.//xs:extension', NS)
        if extension is not None:
            base_type = extension.get('base', 'xs:string')
            go_type = xsd_type_to_go(base_type)
            fields.append(('Content', go_type, None, 1, 1, False))
            
            # Add attributes
            for attr in extension.findall('.//xs:attribute', NS):
                attr_name = attr.get('name')
                attr_type = attr.get('type', 'xs:string')
                go_attr_type = xsd_type_to_go(attr_type, 0, 1)
                fields.append((to_go_identifier(attr_name), go_attr_type, None, 0, 1, False))
    
    # Check for group references
    group_ref = complex_type.find('.//xs:group', NS)
    if group_ref is not None:
        ref_name = group_ref.get('ref')
        if ref_name:
            # This will be handled at a higher level
            pass
    
    return fields

def generate_conditions():
    """Generate conditions.go from conditions.xsd"""
    
    tree = ET.parse('data/chummerxml/conditions.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5/common', exist_ok=True)
    
    # Collect all type definitions
    all_types = {}
    
    # Parse the checks group
    checks_group = root.find('.//xs:group[@name="checks"]', NS)
    check_types = {}
    if checks_group is not None:
        sequence = checks_group.find('.//xs:sequence', NS)
        if sequence is not None:
            for elem in sequence.findall('xs:element', NS):
                name = elem.get('name')
                xsd_type = elem.get('type')
                min_occurs = get_min_occurs(elem)
                max_occurs = get_max_occurs(elem)
                
                if elem.find('.//xs:complexType', NS) is not None:
                    type_name = to_go_identifier(name)
                    fields = parse_complex_type(elem, type_name)
                    check_types[type_name] = (name, fields, min_occurs, max_occurs)
                else:
                    go_type = xsd_type_to_go(xsd_type, min_occurs, max_occurs)
                    check_types[name] = (name, None, min_occurs, max_occurs, go_type)
    
    # Parse details groups
    details_types = {}
    
    # Gear detail options
    gear_detail_group = root.find('.//xs:group[@name="geardetailoptions"]', NS)
    if gear_detail_group is not None:
        fields = []
        sequence = gear_detail_group.find('.//xs:sequence', NS)
        if sequence is not None:
            for elem in sequence.findall('xs:element', NS):
                name = elem.get('name')
                min_occurs = get_min_occurs(elem)
                max_occurs = get_max_occurs(elem)
                # These have simpleContent with xmloperations attributeGroup
                type_name = to_go_identifier(name)
                fields.append((name, type_name, None, min_occurs, max_occurs, True))
        details_types['GearDetailOption'] = fields
    
    # Vehicle detail options
    vehicle_detail_group = root.find('.//xs:group[@name="vehicledetailoptions"]', NS)
    if vehicle_detail_group is not None:
        fields = []
        sequence = vehicle_detail_group.find('.//xs:sequence', NS)
        if sequence is not None:
            for elem in sequence.findall('xs:element', NS):
                name = elem.get('name')
                min_occurs = get_min_occurs(elem)
                max_occurs = get_max_occurs(elem)
                type_name = to_go_identifier(name)
                fields.append((name, type_name, None, min_occurs, max_occurs, True))
        details_types['VehicleDetailOption'] = fields
    
    # Weapon detail options
    weapon_detail_group = root.find('.//xs:group[@name="weapondetailoptions"]', NS)
    if weapon_detail_group is not None:
        fields = []
        sequence = weapon_detail_group.find('.//xs:sequence', NS)
        if sequence is not None:
            for elem in sequence.findall('xs:element', NS):
                name = elem.get('name')
                min_occurs = get_min_occurs(elem)
                max_occurs = get_max_occurs(elem)
                type_name = to_go_identifier(name)
                fields.append((name, type_name, None, min_occurs, max_occurs, True))
        details_types['WeaponDetailOption'] = fields
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/common/conditions.go', 'w', encoding='utf-8') as f:
        f.write('package common\n\n')
        f.write('// This file contains condition/requirement structures generated from conditions.xsd\n\n')
        
        # Generate check type structs
        for type_name, info in sorted(check_types.items()):
            if isinstance(info, tuple) and len(info) >= 3:
                name, fields, min_occ, max_occ = info[:4]
                if fields is not None:
                    # Complex type
                    f.write(f'// {type_name} represents a {name} check\n')
                    f.write(f'type {type_name} struct {{\n')
                    for field_name, field_type, nested_fields, f_min, f_max, is_complex in fields:
                        xml_tag = field_name.lower()
                        json_tag = field_name.lower()
                        omitempty = ',omitempty' if f_min == 0 else ''
                        
                        if field_name == 'Content':
                            xml_tag = ',chardata'
                            json_tag = '+content,omitempty'
                        
                        f.write(f'\t{to_go_identifier(field_name)} {field_type} `xml:"{xml_tag}{omitempty}" json:"{json_tag}{omitempty}"`\n')
                    f.write('}\n\n')
                elif len(info) == 5:
                    # Simple type
                    go_type = info[4]
                    f.write(f'// {type_name} represents a {name} check\n')
                    f.write(f'type {type_name} {go_type}\n\n')
        
        # Generate Checks struct (contains all check types)
        f.write('// Checks represents the checks group from conditions.xsd\n')
        f.write('// This contains all possible check types that can be used in requirements\n')
        f.write('type Checks struct {\n')
        for type_name, info in sorted(check_types.items()):
            if isinstance(info, tuple) and len(info) >= 3:
                name, fields, min_occ, max_occ = info[:4]
                field_name = to_go_identifier(name)
                if fields is not None:
                    # Complex type
                    if max_occ > 1 or max_occ == -1:
                        go_type = f'[]{type_name}'
                    elif min_occ == 0:
                        go_type = f'*{type_name}'
                    else:
                        go_type = type_name
                elif len(info) == 5:
                    # Simple type
                    base_type = info[4]
                    if max_occ > 1 or max_occ == -1:
                        go_type = f'[]{base_type}'
                    elif min_occ == 0:
                        go_type = f'*{base_type}'
                    else:
                        go_type = base_type
                else:
                    continue
                
                xml_tag = name.lower()
                json_tag = name.lower()
                omitempty = ',omitempty' if min_occ == 0 else ''
                f.write(f'\t{field_name} {go_type} `xml:"{xml_tag}{omitempty}" json:"{json_tag}{omitempty}"`\n')
        f.write('}\n\n')
        
        # Generate detail option structs
        for detail_type_name, fields in details_types.items():
            f.write(f'// {detail_type_name} represents a detail option with operation attribute\n')
            f.write(f'type {detail_type_name} struct {{\n')
            f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
            f.write('\tOperation *string `xml:"operation,attr,omitempty" json:"+@operation,omitempty"`\n')
            f.write('}\n\n')
        
        # Generate GearDetails, VehicleDetails, WeaponDetails
        f.write('// GearDetails represents gear detail requirements\n')
        f.write('type GearDetails struct {\n')
        f.write('\tOr *GearDetailOptions `xml:"OR,omitempty" json:"or,omitempty"`\n')
        f.write('\tOptions *GearDetailOptions `xml:",omitempty" json:"options,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// GearDetailOptions contains gear detail option elements\n')
        f.write('type GearDetailOptions struct {\n')
        for name, type_name, _, min_occ, max_occ, _ in details_types.get('GearDetailOption', []):
            field_name = to_go_identifier(name)
            if max_occ > 1 or max_occ == -1:
                go_type = f'[]{type_name}'
            elif min_occ == 0:
                go_type = f'*{type_name}'
            else:
                go_type = type_name
            xml_tag = name.lower()
            json_tag = name.lower()
            omitempty = ',omitempty' if min_occ == 0 else ''
            f.write(f'\t{field_name} {go_type} `xml:"{xml_tag}{omitempty}" json:"{json_tag}{omitempty}"`\n')
        f.write('}\n\n')
        
        f.write('// VehicleDetails represents vehicle detail requirements\n')
        f.write('type VehicleDetails struct {\n')
        f.write('\tOr *VehicleDetailOptions `xml:"OR,omitempty" json:"or,omitempty"`\n')
        f.write('\tOptions *VehicleDetailOptions `xml:",omitempty" json:"options,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// VehicleDetailOptions contains vehicle detail option elements\n')
        f.write('type VehicleDetailOptions struct {\n')
        for name, type_name, _, min_occ, max_occ, _ in details_types.get('VehicleDetailOption', []):
            field_name = to_go_identifier(name)
            if max_occ > 1 or max_occ == -1:
                go_type = f'[]{type_name}'
            elif min_occ == 0:
                go_type = f'*{type_name}'
            else:
                go_type = type_name
            xml_tag = name.lower()
            json_tag = name.lower()
            omitempty = ',omitempty' if min_occ == 0 else ''
            f.write(f'\t{field_name} {go_type} `xml:"{xml_tag}{omitempty}" json:"{json_tag}{omitempty}"`\n')
        f.write('}\n\n')
        
        f.write('// WeaponDetails represents weapon detail requirements\n')
        f.write('type WeaponDetails struct {\n')
        f.write('\tOr *WeaponDetailOptions `xml:"OR,omitempty" json:"or,omitempty"`\n')
        f.write('\tAnd *WeaponDetailOptions `xml:"AND,omitempty" json:"and,omitempty"`\n')
        f.write('\tOptions *WeaponDetailOptions `xml:",omitempty" json:"options,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// WeaponDetailOptions contains weapon detail option elements\n')
        f.write('type WeaponDetailOptions struct {\n')
        for name, type_name, _, min_occ, max_occ, _ in details_types.get('WeaponDetailOption', []):
            field_name = to_go_identifier(name)
            if max_occ > 1 or max_occ == -1:
                go_type = f'[]{type_name}'
            elif min_occ == 0:
                go_type = f'*{type_name}'
            else:
                go_type = type_name
            xml_tag = name.lower()
            json_tag = name.lower()
            omitempty = ',omitempty' if min_occ == 0 else ''
            f.write(f'\t{field_name} {go_type} `xml:"{xml_tag}{omitempty}" json:"{json_tag}{omitempty}"`\n')
        f.write('}\n\n')
        
        f.write('// WeaponMountDetails represents weapon mount detail requirements\n')
        f.write('type WeaponMountDetails struct {\n')
        f.write('\tControl []string `xml:"control,omitempty" json:"control,omitempty"`\n')
        f.write('\tFlexibility *string `xml:"flexibility,omitempty" json:"flexibility,omitempty"`\n')
        f.write('\tSize *string `xml:"size,omitempty" json:"size,omitempty"`\n')
        f.write('\tVisibility *string `xml:"visibility,omitempty" json:"visibility,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Details struct
        f.write('// Details represents the details group from conditions.xsd\n')
        f.write('type Details struct {\n')
        f.write('\tGearDetails *GearDetails `xml:"geardetails,omitempty" json:"geardetails,omitempty"`\n')
        f.write('\tVehicleDetails *VehicleDetails `xml:"vehicledetails,omitempty" json:"vehicledetails,omitempty"`\n')
        f.write('\tWeaponDetails *WeaponDetails `xml:"weapondetails,omitempty" json:"weapondetails,omitempty"`\n')
        f.write('\tWeaponMountDetails *WeaponMountDetails `xml:"weaponmountdetails,omitempty" json:"weaponmountdetails,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate RequirementOneOf and RequirementAllOf
        f.write('// RequirementOneOf represents a one-of requirement (at least one must be met)\n')
        f.write('type RequirementOneOf struct {\n')
        f.write('\tChecks *Checks `xml:",omitempty" json:"checks,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// RequirementAllOf represents an all-of requirement (all must be met)\n')
        f.write('type RequirementAllOf struct {\n')
        f.write('\tChecks *Checks `xml:",omitempty" json:"checks,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Required and Forbidden
        f.write('// Required represents a required condition element\n')
        f.write('type Required struct {\n')
        f.write('\tAllOf *RequirementAllOf `xml:"allof,omitempty" json:"allof,omitempty"`\n')
        f.write('\tOneOf []RequirementOneOf `xml:"oneof,omitempty" json:"oneof,omitempty"`\n')
        f.write('\tDetails *Details `xml:",omitempty" json:"details,omitempty"`\n')
        f.write('\tUnique *string `xml:"unique,attr,omitempty" json:"+@unique,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// Forbidden represents a forbidden condition element\n')
        f.write('type Forbidden struct {\n')
        f.write('\tAllOf *RequirementAllOf `xml:"allof,omitempty" json:"allof,omitempty"`\n')
        f.write('\tOneOf []RequirementOneOf `xml:"oneof,omitempty" json:"oneof,omitempty"`\n')
        f.write('\tDetails *Details `xml:",omitempty" json:"details,omitempty"`\n')
        f.write('\tUnique *string `xml:"unique,attr,omitempty" json:"+@unique,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated common/conditions.go")

if __name__ == '__main__':
    print("Generating conditions from conditions.xsd...")
    generate_conditions()
    print("Done!")

