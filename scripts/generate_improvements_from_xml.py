#!/usr/bin/env python3
"""Generate improvements.go from improvements.xml"""

import xml.etree.ElementTree as ET
import os

def generate_improvements():
    """Generate improvements.go from improvements.xml"""
    
    tree = ET.parse('data/chummerxml/improvements.xml')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/improvements.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('// This file contains improvement structures generated from improvements.xml\n\n')
        
        # Generate ImprovementFields struct
        f.write('// ImprovementFields represents a collection of field names for an improvement\n')
        f.write('type ImprovementFields struct {\n')
        f.write('\tField []string `xml:"field" json:"field"`\n')
        f.write('}\n\n')
        
        # Generate Improvement struct
        f.write('// Improvement represents an improvement definition\n')
        f.write('type Improvement struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tInternal string `xml:"internal" json:"internal"`\n')
        f.write('\tFields *ImprovementFields `xml:"fields,omitempty" json:"fields,omitempty"`\n')
        f.write('\tXML *string `xml:"xml,omitempty" json:"xml,omitempty"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('}\n\n')
        
        # Generate Improvements struct
        f.write('// Improvements represents a collection of improvements\n')
        f.write('type Improvements struct {\n')
        f.write('\tImprovement []Improvement `xml:"improvement" json:"improvement"`\n')
        f.write('}\n\n')
        
        # Generate ImprovementsChummer struct (root element)
        f.write('// ImprovementsChummer represents the root chummer element for improvements\n')
        f.write('type ImprovementsChummer struct {\n')
        f.write('\tImprovements Improvements `xml:"improvements" json:"improvements"`\n')
        f.write('}\n\n')
    
    print("Generated improvements.go")

if __name__ == '__main__':
    print("Generating improvements from improvements.xml...")
    generate_improvements()
    print("Done!")

