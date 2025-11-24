#!/usr/bin/env python3
"""Generate references.go from references.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def generate_references():
    """Generate references.go from references.xsd"""
    
    tree = ET.parse('data/chummerxml/references.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/references.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "github.com/jrags/ShadowMaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains reference structures generated from references.xsd\n\n')
        
        # Generate Rule struct
        f.write('// Rule represents a reference rule\n')
        f.write('type Rule struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage uint16 `xml:"page" json:"page"`\n')
        f.write('}\n\n')
        
        # Generate Rules struct
        f.write('// Rules represents a collection of reference rules\n')
        f.write('type Rules struct {\n')
        f.write('\tRule []Rule `xml:"rule" json:"rule"`\n')
        f.write('}\n\n')
        
        # Generate Chummer struct (root element)
        f.write('// Chummer represents the root chummer element for references\n')
        f.write('type Chummer struct {\n')
        f.write('\tRules Rules `xml:"rules" json:"rules"`\n')
        f.write('}\n\n')
    
    print("Generated references.go")

if __name__ == '__main__':
    print("Generating references from references.xsd...")
    generate_references()
    print("Done!")

