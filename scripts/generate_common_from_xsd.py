#!/usr/bin/env python3
"""Generate common package files from XSD foundation schemas"""

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

def get_xsd_type(attr):
    """Get XSD type from attribute"""
    if attr is None:
        return None
    return attr

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
        return 'string'  # Default
    
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
        go_type = 'string'  # Default fallback
    
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

def generate_schema_extensions():
    """Generate common/schema_extensions.go from SchemaExtensions.xsd"""
    code = '''package common

// Boolean represents the SchemaExtensions boolean type
// XSD: boolean simpleType with enumeration values "True" and "False"
// This is used in XSD schemas that reference SchemaExtensions.xsd
// In Go, we use bool, but this type helps with XML unmarshaling
type Boolean string

const (
	BooleanTrue  Boolean = "True"
	BooleanFalse Boolean = "False"
)

// ToBool converts Boolean to Go bool
func (b Boolean) ToBool() bool {
	return b == BooleanTrue
}

// FromBool converts Go bool to Boolean
func FromBool(b bool) Boolean {
	if b {
		return BooleanTrue
	}
	return BooleanFalse
}
'''
    os.makedirs('pkg/shadowrun/edition/v5/common', exist_ok=True)
    with open('pkg/shadowrun/edition/v5/common/schema_extensions.go', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Generated common/schema_extensions.go")

if __name__ == '__main__':
    print("Generating common foundation files from XSD...")
    generate_schema_extensions()
    print("Done! (Phase 1 - SchemaExtensions complete)")


