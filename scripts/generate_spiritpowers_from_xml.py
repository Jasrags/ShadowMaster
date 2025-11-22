#!/usr/bin/env python3
"""Generate spiritpowers.go from spiritpowers.xml"""

import xml.etree.ElementTree as ET
import os

def generate_spiritpowers():
    """Generate spiritpowers.go from spiritpowers.xml"""
    
    tree = ET.parse('data/chummerxml/spiritpowers.xml')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/spiritpowers.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('// This file contains spirit power structures generated from spiritpowers.xml\n\n')
        
        # Generate SpiritPower struct
        f.write('// SpiritPower represents a spirit power definition\n')
        f.write('type SpiritPower struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('}\n\n')
        
        # Generate SpiritPowers struct
        f.write('// SpiritPowers represents a collection of spirit powers\n')
        f.write('type SpiritPowers struct {\n')
        f.write('\tPower []SpiritPower `xml:"power" json:"power"`\n')
        f.write('}\n\n')
        
        # Generate SpiritPowersChummer struct (root element)
        f.write('// SpiritPowersChummer represents the root chummer element for spirit powers\n')
        f.write('type SpiritPowersChummer struct {\n')
        f.write('\tPowers SpiritPowers `xml:"powers" json:"powers"`\n')
        f.write('}\n\n')
    
    print("Generated spiritpowers.go")

if __name__ == '__main__':
    print("Generating spiritpowers from spiritpowers.xml...")
    generate_spiritpowers()
    print("Done!")

