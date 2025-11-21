#!/usr/bin/env python3
"""Analyze bonuses.xsd to understand structure"""

import xml.etree.ElementTree as ET

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

tree = ET.parse('data/chummerxml/bonuses.xsd')
root = tree.getroot()

# Find bonusTypes complexType
bonus_type = root.find('.//xs:complexType[@name="bonusTypes"]', NS)
if bonus_type is None:
    print("Could not find bonusTypes")
    exit(1)

# Find all element children
elements = bonus_type.findall('.//xs:element[@name]', NS)
print(f"Total bonus type elements: {len(elements)}")

# Categorize
simple_elements = []
complex_elements = []
empty_elements = []

for elem in elements:
    name = elem.get('name')
    xsd_type = elem.get('type')
    has_complex = elem.find('.//xs:complexType', NS) is not None
    
    if has_complex:
        complex_elements.append(name)
    elif xsd_type:
        simple_elements.append((name, xsd_type))
    else:
        empty_elements.append(name)

print(f"\nSimple typed elements: {len(simple_elements)}")
print(f"Complex elements: {len(complex_elements)}")
print(f"Empty elements (boolean flags): {len(empty_elements)}")

print("\nFirst 10 simple elements:")
for name, typ in simple_elements[:10]:
    print(f"  {name}: {typ}")

print("\nFirst 10 complex elements:")
for name in complex_elements[:10]:
    print(f"  {name}")

print("\nEmpty elements (boolean flags):")
for name in empty_elements[:10]:
    print(f"  {name}")


