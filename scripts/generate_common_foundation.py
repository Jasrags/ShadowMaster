#!/usr/bin/env python3
"""Generate common foundation files from XSD schemas"""

import xml.etree.ElementTree as ET
import re
import os

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

def generate_schema_extensions():
    """Generate common/schema_extensions.go from SchemaExtensions.xsd"""
    
    # SchemaExtensions.xsd is simple - just defines boolean type
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
    print("Generating common foundation files...")
    generate_schema_extensions()
    print("Done!")


