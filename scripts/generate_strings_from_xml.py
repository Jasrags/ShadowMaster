#!/usr/bin/env python3
"""Generate strings.go from strings.xml"""

import xml.etree.ElementTree as ET
import os

def generate_strings():
    """Generate strings.go from strings.xml"""
    
    tree = ET.parse('data/chummerxml/strings.xml')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/strings.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('// This file contains string constant structures generated from strings.xml\n\n')
        
        # Generate MatrixAttributes struct
        f.write('// MatrixAttributes represents a collection of matrix attribute keys\n')
        f.write('type MatrixAttributes struct {\n')
        f.write('\tKey []string `xml:"key" json:"key"`\n')
        f.write('}\n\n')
        
        # Generate Elements struct
        f.write('// Elements represents a collection of element types\n')
        f.write('type Elements struct {\n')
        f.write('\tElement []string `xml:"element" json:"element"`\n')
        f.write('}\n\n')
        
        # Generate Immunities struct
        f.write('// Immunities represents a collection of immunity types\n')
        f.write('type Immunities struct {\n')
        f.write('\tImmunity []string `xml:"immunity" json:"immunity"`\n')
        f.write('}\n\n')
        
        # Generate SpiritCategories struct
        f.write('// SpiritCategories represents a collection of spirit categories\n')
        f.write('type SpiritCategories struct {\n')
        f.write('\tCategory []string `xml:"category" json:"category"`\n')
        f.write('}\n\n')
        
        # Generate StringsChummer struct (root element)
        f.write('// StringsChummer represents the root chummer element for strings\n')
        f.write('type StringsChummer struct {\n')
        f.write('\tMatrixAttributes MatrixAttributes `xml:"matrixattributes" json:"matrixattributes"`\n')
        f.write('\tElements Elements `xml:"elements" json:"elements"`\n')
        f.write('\tImmunities Immunities `xml:"immunities" json:"immunities"`\n')
        f.write('\tSpiritCategories SpiritCategories `xml:"spiritcategories" json:"spiritcategories"`\n')
        f.write('}\n\n')
    
    print("Generated strings.go")

if __name__ == '__main__':
    print("Generating strings from strings.xml...")
    generate_strings()
    print("Done!")

