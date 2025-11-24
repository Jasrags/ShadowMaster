#!/usr/bin/env python3
"""Generate tips.go from tips.xml"""

import xml.etree.ElementTree as ET
import os

def generate_tips():
    """Generate tips.go from tips.xml"""
    
    tree = ET.parse('data/chummerxml/tips.xml')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/tips.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains tip structures generated from tips.xml\n\n')
        
        # Generate Tip struct
        # Note: chargenonly and careeronly are empty elements, so we use bool pointers
        f.write('// Tip represents a tip definition\n')
        f.write('type Tip struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tText string `xml:"text" json:"text"`\n')
        f.write('\tChargenOnly *bool `xml:"chargenonly,omitempty" json:"chargenonly,omitempty"`\n')
        f.write('\tCareerOnly *bool `xml:"careeronly,omitempty" json:"careeronly,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('\tForbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Tips struct
        f.write('// Tips represents a collection of tips\n')
        f.write('type Tips struct {\n')
        f.write('\tTip []Tip `xml:"tip" json:"tip"`\n')
        f.write('}\n\n')
        
        # Generate TipsChummer struct (root element)
        f.write('// TipsChummer represents the root chummer element for tips\n')
        f.write('type TipsChummer struct {\n')
        f.write('\tTips Tips `xml:"tips" json:"tips"`\n')
        f.write('}\n\n')
    
    print("Generated tips.go")

if __name__ == '__main__':
    print("Generating tips from tips.xml...")
    generate_tips()
    print("Done!")

