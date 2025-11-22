#!/usr/bin/env python3
"""Generate sheets.go from sheets.xml"""

import xml.etree.ElementTree as ET
import os

def generate_sheets():
    """Generate sheets.go from sheets.xml"""
    
    tree = ET.parse('data/chummerxml/sheets.xml')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/sheets.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('// This file contains sheet structures generated from sheets.xml\n\n')
        
        # Generate Sheet struct
        f.write('// Sheet represents a sheet definition\n')
        f.write('type Sheet struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tFilename string `xml:"filename" json:"filename"`\n')
        f.write('}\n\n')
        
        # Generate Sheets struct (with lang attribute)
        f.write('// Sheets represents a collection of sheets for a language\n')
        f.write('type Sheets struct {\n')
        f.write('\tLang string `xml:"lang,attr" json:"+@lang"`\n')
        f.write('\tSheet []Sheet `xml:"sheet" json:"sheet"`\n')
        f.write('}\n\n')
        
        # Generate SheetsChummer struct (root element)
        f.write('// SheetsChummer represents the root chummer element for sheets\n')
        f.write('type SheetsChummer struct {\n')
        f.write('\tSheets []Sheets `xml:"sheets" json:"sheets"`\n')
        f.write('}\n\n')
    
    print("Generated sheets.go")

if __name__ == '__main__':
    print("Generating sheets from sheets.xml...")
    generate_sheets()
    print("Done!")

