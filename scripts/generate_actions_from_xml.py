#!/usr/bin/env python3
"""Generate actions.go from actions.xml"""

import xml.etree.ElementTree as ET
import os

def generate_actions():
    """Generate actions.go from actions.xml"""
    
    tree = ET.parse('data/chummerxml/actions.xml')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/actions.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('// This file contains action structures generated from actions.xml\n\n')
        
        # Generate ActionTest struct
        f.write('// ActionTest represents a test for an action\n')
        f.write('type ActionTest struct {\n')
        f.write('\tDice string `xml:"dice" json:"dice"`\n')
        f.write('}\n\n')
        
        # Generate Action struct
        f.write('// Action represents an action definition\n')
        f.write('type Action struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tType string `xml:"type" json:"type"`\n')
        f.write('\tTest ActionTest `xml:"test" json:"test"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('}\n\n')
        
        # Generate Actions struct
        f.write('// Actions represents a collection of actions\n')
        f.write('type Actions struct {\n')
        f.write('\tAction []Action `xml:"action" json:"action"`\n')
        f.write('}\n\n')
        
        # Generate ActionsChummer struct (root element)
        f.write('// ActionsChummer represents the root chummer element for actions\n')
        f.write('type ActionsChummer struct {\n')
        f.write('\tVersion string `xml:"version" json:"version"`\n')
        f.write('\tActions Actions `xml:"actions" json:"actions"`\n')
        f.write('}\n\n')
    
    print("Generated actions.go")

if __name__ == '__main__':
    print("Generating actions from actions.xml...")
    generate_actions()
    print("Done!")

