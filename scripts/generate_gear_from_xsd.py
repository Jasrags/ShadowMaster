#!/usr/bin/env python3
"""Generate common/gear.go from gear.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

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
    elif xsd_type == 'bonusTypes':
        # Reference to bonusTypes from bonuses.xsd
        go_type = 'BaseBonus'
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
            child_ref = child.get('ref')
            
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
            elif child_ref:
                # Reference to another element
                ref_type_name = to_go_identifier(child_ref)
                min_occurs = get_min_occurs(child)
                max_occurs = get_max_occurs(child)
                if max_occurs > 1 or max_occurs == -1:
                    go_type = f'*{ref_type_name}'
                elif min_occurs == 0:
                    go_type = f'*{ref_type_name}'
                else:
                    go_type = ref_type_name
                fields.append((child_ref, go_type, None, min_occurs, max_occurs, False))
    
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
    
    # Check for attributes on complex type
    for attr in complex_type.findall('.//xs:attribute', NS):
        attr_name = attr.get('name')
        attr_type = attr.get('type', 'xs:string')
        go_attr_type = xsd_type_to_go(attr_type, 0, 1)
        fields.append((to_go_identifier(attr_name), go_attr_type, None, 0, 1, False))
    
    return fields

def generate_gear():
    """Generate gear.go from gear.xsd"""
    
    tree = ET.parse('data/chummerxml/gear.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5/common', exist_ok=True)
    
    # Find the gears element (standalone definition)
    gears_elem = root.find('.//xs:element[@name="gears"]', NS)
    if gears_elem is None:
        print("ERROR: Could not find gears element")
        return
    
    # Find gear element within gears
    gear_elem = gears_elem.find('.//xs:element[@name="gear"]', NS)
    usegear_elem = gears_elem.find('.//xs:element[@name="usegear"]', NS)
    choosegear_elem = gears_elem.find('.//xs:element[@name="choosegear"]', NS)
    
    # Also find the gear element in the chummer/gears path (may have more fields)
    chummer_gears = root.find('.//xs:element[@name="chummer"]', NS)
    chummer_gear = None
    if chummer_gears is not None:
        chummer_gears_seq = chummer_gears.find('.//xs:element[@name="gears"]', NS)
        if chummer_gears_seq is not None:
            chummer_gear = chummer_gears_seq.find('.//xs:element[@name="gear"]', NS)
    
    # Use the chummer gear if it exists (more complete), otherwise use the standalone one
    if chummer_gear is not None:
        gear_elem = chummer_gear
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/common/gear.go', 'w', encoding='utf-8') as f:
        f.write('package common\n\n')
        f.write('// This file contains gear structures generated from gear.xsd\n\n')
        
        # Generate UseGear struct
        if usegear_elem is not None:
            usegear_fields = parse_complex_type(usegear_elem, 'UseGear')
            f.write('// UseGear represents a usegear element within gears\n')
            f.write('type UseGear struct {\n')
            for field_name, field_type, nested_fields, min_occ, max_occ, is_complex in usegear_fields:
                xml_tag = field_name.lower()
                json_tag = field_name.lower()
                omitempty = ',omitempty' if min_occ == 0 else ''
                
                if field_name == 'Content':
                    xml_tag = ',chardata'
                    json_tag = '+content,omitempty'
                elif field_name == 'gears':
                    # Reference to Gears
                    xml_tag = 'gears'
                    json_tag = 'gears'
                
                f.write(f'\t{to_go_identifier(field_name)} {field_type} `xml:"{xml_tag}{omitempty}" json:"{json_tag}{omitempty}"`\n')
            f.write('}\n\n')
        
        # Generate ChooseGear struct
        if choosegear_elem is not None:
            choosegear_fields = parse_complex_type(choosegear_elem, 'ChooseGear')
            f.write('// ChooseGear represents a choosegear element within gears\n')
            f.write('type ChooseGear struct {\n')
            for field_name, field_type, nested_fields, min_occ, max_occ, is_complex in choosegear_fields:
                xml_tag = field_name.lower()
                json_tag = field_name.lower()
                omitempty = ',omitempty' if min_occ == 0 else ''
                
                if field_name == 'gears':
                    xml_tag = 'gears'
                    json_tag = 'gears'
                
                f.write(f'\t{to_go_identifier(field_name)} {field_type} `xml:"{xml_tag}{omitempty}" json:"{json_tag}{omitempty}"`\n')
            f.write('\tRequired *string `xml:"required,attr,omitempty" json:"+@required,omitempty"`\n')
            f.write('}\n\n')
        
        # Generate Gear struct (from the gear element in chummer/gears)
        if gear_elem is not None:
            gear_fields = parse_complex_type(gear_elem, 'Gear')
            f.write('// Gear represents a gear element\n')
            f.write('// This is the main gear structure used in gear.xml files\n')
            f.write('type Gear struct {\n')
            for field_name, field_type, nested_fields, min_occ, max_occ, is_complex in gear_fields:
                xml_tag = field_name.lower()
                json_tag = field_name.lower()
                omitempty = ',omitempty' if min_occ == 0 else ''
                
                if field_name == 'Content':
                    xml_tag = ',chardata'
                    json_tag = '+content,omitempty'
                elif field_name == 'gears':
                    # Reference to Gears
                    xml_tag = 'gears'
                    json_tag = 'gears'
                elif field_name == 'required':
                    # Reference to Required from conditions.xsd
                    xml_tag = 'required'
                    json_tag = 'required'
                elif field_name == 'bonus':
                    # Reference to BaseBonus
                    xml_tag = 'bonus'
                    json_tag = 'bonus'
                
                f.write(f'\t{to_go_identifier(field_name)} {field_type} `xml:"{xml_tag}{omitempty}" json:"{json_tag}{omitempty}"`\n')
            f.write('}\n\n')
        
        # Generate nested types (like WeaponBonus, Tags, etc.)
        if gear_elem is not None:
            for field_name, field_type, nested_fields, min_occ, max_occ, is_complex in gear_fields:
                if nested_fields and is_complex:
                    f.write(f'// {field_type} represents a {field_name} element\n')
                    f.write(f'type {field_type} struct {{\n')
                    for nf_name, nf_type, nf_nested, nf_min, nf_max, nf_complex in nested_fields:
                        xml_tag = nf_name.lower()
                        json_tag = nf_name.lower()
                        omitempty = ',omitempty' if nf_min == 0 else ''
                        
                        if nf_name == 'Content':
                            xml_tag = ',chardata'
                            json_tag = '+content,omitempty'
                        
                        f.write(f'\t{to_go_identifier(nf_name)} {nf_type} `xml:"{xml_tag}{omitempty}" json:"{json_tag}{omitempty}"`\n')
                    f.write('}\n\n')
        
        # Generate Gears struct (container)
        gears_fields = parse_complex_type(gears_elem, 'Gears')
        f.write('// Gears represents a gears container element\n')
        f.write('// This can contain gear, usegear, and choosegear elements\n')
        f.write('type Gears struct {\n')
        f.write('\tGear []Gear `xml:"gear,omitempty" json:"gear,omitempty"`\n')
        f.write('\tUseGear []UseGear `xml:"usegear,omitempty" json:"usegear,omitempty"`\n')
        f.write('\tChooseGear []ChooseGear `xml:"choosegear,omitempty" json:"choosegear,omitempty"`\n')
        f.write('\tStartCollapsed *string `xml:"startcollapsed,attr,omitempty" json:"+@startcollapsed,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate GearCategory struct (from categories)
        f.write('// GearCategory represents a gear category\n')
        f.write('type GearCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tShow *string `xml:"show,attr,omitempty" json:"+@show,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// GearCategories represents a categories container\n')
        f.write('type GearCategories struct {\n')
        f.write('\tCategory []GearCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated common/gear.go")

if __name__ == '__main__':
    print("Generating gear structures from gear.xsd...")
    generate_gear()
    print("Done!")

