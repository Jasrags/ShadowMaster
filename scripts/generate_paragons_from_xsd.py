#!/usr/bin/env python3
"""Generate paragons.go from paragons.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def generate_paragons():
    """Generate paragons.go from paragons.xsd"""
    
    tree = ET.parse('data/chummerxml/paragons.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/paragons.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains paragon structures generated from paragons.xsd\n\n')
        
        # Generate ParagonCategory struct
        f.write('// ParagonCategory represents a paragon category\n')
        f.write('type ParagonCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ParagonCategories struct
        f.write('// ParagonCategories represents a collection of paragon categories\n')
        f.write('type ParagonCategories struct {\n')
        f.write('\tCategory []ParagonCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ParagonChoice struct
        f.write('// ParagonChoice represents a paragon choice\n')
        f.write('type ParagonChoice struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tHide *string `xml:"hide,omitempty" json:"hide,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tSet *int `xml:"set,attr,omitempty" json:"+@set,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ParagonChoices struct
        f.write('// ParagonChoices represents a collection of paragon choices\n')
        f.write('type ParagonChoices struct {\n')
        f.write('\tChoice []ParagonChoice `xml:"choice" json:"choice"`\n')
        f.write('}\n\n')
        
        # Generate Paragon struct
        f.write('// Paragon represents a paragon\n')
        f.write('type Paragon struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory *string `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('\tAdvantage string `xml:"advantage" json:"advantage"`\n')
        f.write('\tDisadvantage string `xml:"disadvantage" json:"disadvantage"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tChoices *ParagonChoices `xml:"choices,omitempty" json:"choices,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate Paragons struct (container)
        f.write('// Paragons represents a collection of paragons\n')
        f.write('type Paragons struct {\n')
        f.write('\tParagon []Paragon `xml:"paragon,omitempty" json:"paragon,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ParagonsChummer struct (root element)
        f.write('// ParagonsChummer represents the root chummer element for paragons\n')
        f.write('type ParagonsChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tCategories []ParagonCategories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tParagons []Paragons `xml:"paragons,omitempty" json:"paragons,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated paragons.go")

if __name__ == '__main__':
    print("Generating paragons from paragons.xsd...")
    generate_paragons()
    print("Done!")

