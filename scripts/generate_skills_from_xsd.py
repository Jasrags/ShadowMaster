#!/usr/bin/env python3
"""Generate skills.go from skills.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def to_go_identifier(name):
    """Convert XML element name to Go identifier"""
    # Handle special cases
    if name == 'default':
        return 'Default'
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
    
    return fields

def generate_skills():
    """Generate skills.go from skills.xsd"""
    
    tree = ET.parse('data/chummerxml/skills.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Parse skill element
    skill_elem = root.find('.//xs:element[@name="skill"]', NS)
    skill_fields = []
    if skill_elem is not None:
        skill_fields = parse_complex_type(skill_elem, 'Skill')
    
    # Parse chummer element
    chummer_elem = root.find('.//xs:element[@name="chummer"]', NS)
    chummer_fields = []
    if chummer_elem is not None:
        chummer_fields = parse_complex_type(chummer_elem, 'Chummer')
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/skills.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "github.com/jrags/ShadowMaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains skill structures generated from skills.xsd\n\n')
        
        # Generate Spec struct (for specs/spec elements)
        f.write('// Spec represents a skill specialization\n')
        f.write('type Spec struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Specs struct
        f.write('// Specs represents a collection of skill specializations\n')
        f.write('type Specs struct {\n')
        f.write('\tSpec []Spec `xml:"spec,omitempty" json:"spec,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Skill struct
        f.write('// Skill represents a skill definition\n')
        f.write('type Skill struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tAttribute string `xml:"attribute" json:"attribute"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tDefault string `xml:"default" json:"default"`\n')
        f.write('\tExotic *string `xml:"exotic,omitempty" json:"exotic,omitempty"`\n')
        f.write('\tSkillGroup string `xml:"skillgroup" json:"skillgroup"`\n')
        f.write('\tRequiresGroundMovement *string `xml:"requiresgroundmovement,omitempty" json:"requiresgroundmovement,omitempty"`\n')
        f.write('\tRequiresSwimMovement *string `xml:"requiresswimmovement,omitempty" json:"requiresswimmovement,omitempty"`\n')
        f.write('\tRequiresFlyMovement *string `xml:"requiresflymovement,omitempty" json:"requiresflymovement,omitempty"`\n')
        f.write('\tSpecs Specs `xml:"specs" json:"specs"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate SkillGroupName struct (for skillgroups/name elements)
        f.write('// SkillGroupName represents a skill group name\n')
        f.write('type SkillGroupName struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate SkillGroups struct
        f.write('// SkillGroups represents a collection of skill group names\n')
        f.write('type SkillGroups struct {\n')
        f.write('\tName []SkillGroupName `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Category struct (for categories/category elements)
        f.write('// Category represents a skill category with a type attribute\n')
        f.write('type Category struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tType string `xml:"type,attr" json:"+@type"`\n')
        f.write('}\n\n')
        
        # Generate Categories struct
        f.write('// Categories represents a collection of skill categories\n')
        f.write('type Categories struct {\n')
        f.write('\tCategory []Category `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Skills struct (container for skill elements)
        f.write('// Skills represents a collection of skills\n')
        f.write('type Skills struct {\n')
        f.write('\tSkill []Skill `xml:"skill,omitempty" json:"skill,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate KnowledgeSkills struct (container for knowledge skill elements)
        f.write('// KnowledgeSkills represents a collection of knowledge skills\n')
        f.write('type KnowledgeSkills struct {\n')
        f.write('\tSkill []Skill `xml:"skill,omitempty" json:"skill,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Chummer struct (root element)
        f.write('// Chummer represents the root chummer element for skills\n')
        f.write('type Chummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tSkillGroups []SkillGroups `xml:"skillgroups,omitempty" json:"skillgroups,omitempty"`\n')
        f.write('\tCategories []Categories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tSkills []Skills `xml:"skills,omitempty" json:"skills,omitempty"`\n')
        f.write('\tKnowledgeSkills []KnowledgeSkills `xml:"knowledgeskills,omitempty" json:"knowledgeskills,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated skills.go")

if __name__ == '__main__':
    print("Generating skills from skills.xsd...")
    generate_skills()
    print("Done!")

