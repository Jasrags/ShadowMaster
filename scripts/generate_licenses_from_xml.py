#!/usr/bin/env python3
"""Generate licenses.go from licenses.xml"""

import xml.etree.ElementTree as ET
import os

def generate_licenses():
    """Generate licenses.go from licenses.xml"""
    
    tree = ET.parse('data/chummerxml/licenses.xml')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/licenses.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('// This file contains license structures generated from licenses.xml\n\n')
        
        # Generate Licenses struct
        f.write('// Licenses represents a collection of license types\n')
        f.write('type Licenses struct {\n')
        f.write('\tLicense []string `xml:"license" json:"license"`\n')
        f.write('}\n\n')
        
        # Generate LicensesChummer struct (root element)
        f.write('// LicensesChummer represents the root chummer element for licenses\n')
        f.write('type LicensesChummer struct {\n')
        f.write('\tLicenses Licenses `xml:"licenses" json:"licenses"`\n')
        f.write('}\n\n')
    
    print("Generated licenses.go")

if __name__ == '__main__':
    print("Generating licenses from licenses.xml...")
    generate_licenses()
    print("Done!")

