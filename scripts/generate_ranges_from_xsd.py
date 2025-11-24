#!/usr/bin/env python3
"""Generate ranges.go from ranges.xsd"""

import xml.etree.ElementTree as ET
import os

def generate_ranges():
    """Generate ranges.go from ranges.xsd"""
    
    tree = ET.parse('data/chummerxml/ranges.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/ranges.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('// This file contains range structures generated from ranges.xsd\n\n')
        
        # Generate Modifiers struct
        f.write('// RangeModifiers represents range modifiers\n')
        f.write('type RangeModifiers struct {\n')
        f.write('\tShort *string `xml:"short,omitempty" json:"short,omitempty"`\n')
        f.write('\tMedium *string `xml:"medium,omitempty" json:"medium,omitempty"`\n')
        f.write('\tLong *string `xml:"long,omitempty" json:"long,omitempty"`\n')
        f.write('\tExtreme *string `xml:"extreme,omitempty" json:"extreme,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Range struct
        f.write('// Range represents a range definition\n')
        f.write('type Range struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tMin *string `xml:"min,omitempty" json:"min,omitempty"`\n')
        f.write('\tShort *string `xml:"short,omitempty" json:"short,omitempty"`\n')
        f.write('\tMedium *string `xml:"medium,omitempty" json:"medium,omitempty"`\n')
        f.write('\tLong *string `xml:"long,omitempty" json:"long,omitempty"`\n')
        f.write('\tExtreme *string `xml:"extreme,omitempty" json:"extreme,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Ranges struct
        f.write('// Ranges represents a collection of ranges\n')
        f.write('type Ranges struct {\n')
        f.write('\tRange []Range `xml:"range" json:"range"`\n')
        f.write('}\n\n')
        
        # Generate RangesChummer struct (root element)
        f.write('// RangesChummer represents the root chummer element for ranges\n')
        f.write('type RangesChummer struct {\n')
        f.write('\tModifiers RangeModifiers `xml:"modifiers" json:"modifiers"`\n')
        f.write('\tRanges []Ranges `xml:"ranges,omitempty" json:"ranges,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated ranges.go")

if __name__ == '__main__':
    print("Generating ranges from ranges.xsd...")
    generate_ranges()
    print("Done!")

