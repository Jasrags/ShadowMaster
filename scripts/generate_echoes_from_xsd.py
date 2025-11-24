#!/usr/bin/env python3
"""Generate echoes.go from echoes.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def generate_echoes():
    """Generate echoes.go from echoes.xsd"""
    
    tree = ET.parse('data/chummerxml/echoes.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/echoes.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains echo structures generated from echoes.xsd\n\n')
        
        # Generate Echo struct
        f.write('// Echo represents an echo\n')
        f.write('type Echo struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tForbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tLimit *string `xml:"limit,omitempty" json:"limit,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Echoes struct (container)
        f.write('// Echoes represents a collection of echoes\n')
        f.write('type Echoes struct {\n')
        f.write('\tEcho []Echo `xml:"echo,omitempty" json:"echo,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate EchoesChummer struct (root element)
        f.write('// EchoesChummer represents the root chummer element for echoes\n')
        f.write('type EchoesChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tEchoes []Echoes `xml:"echoes,omitempty" json:"echoes,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated echoes.go")

if __name__ == '__main__':
    print("Generating echoes from echoes.xsd...")
    generate_echoes()
    print("Done!")

