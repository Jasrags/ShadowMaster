#!/usr/bin/env python3
"""Generate martialarts.go from martialarts.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def generate_martialarts():
    """Generate martialarts.go from martialarts.xsd"""
    
    tree = ET.parse('data/chummerxml/martialarts.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/martialarts.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains martial arts structures generated from martialarts.xsd\n\n')
        
        # Generate Technique struct (for techniques within martialart)
        f.write('// Technique represents a martial art technique\n')
        f.write('type Technique struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tHide *string `xml:"hide,omitempty" json:"hide,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Techniques struct (for techniques within martialart)
        f.write('// Techniques represents a collection of techniques\n')
        f.write('type Techniques struct {\n')
        f.write('\tTechnique []Technique `xml:"technique,omitempty" json:"technique,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate MartialArt struct
        f.write('// MartialArt represents a martial art\n')
        f.write('type MartialArt struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCost *int `xml:"cost,omitempty" json:"cost,omitempty"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tAllTechniques *string `xml:"alltechniques,omitempty" json:"alltechniques,omitempty"`\n')
        f.write('\tTechniques *Techniques `xml:"techniques,omitempty" json:"techniques,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate MartialArts struct (container)
        f.write('// MartialArts represents a collection of martial arts\n')
        f.write('type MartialArts struct {\n')
        f.write('\tMartialArt []MartialArt `xml:"martialart,omitempty" json:"martialart,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate TechniqueItem struct (for standalone techniques)
        f.write('// TechniqueItem represents a standalone martial art technique\n')
        f.write('type TechniqueItem struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate TechniqueItems struct (container for standalone techniques)
        f.write('// TechniqueItems represents a collection of standalone techniques\n')
        f.write('type TechniqueItems struct {\n')
        f.write('\tTechnique []TechniqueItem `xml:"technique,omitempty" json:"technique,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate MartialArtsChummer struct (root element)
        f.write('// MartialArtsChummer represents the root chummer element for martial arts\n')
        f.write('type MartialArtsChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tMartialArts []MartialArts `xml:"martialarts,omitempty" json:"martialarts,omitempty"`\n')
        f.write('\tTechniques []TechniqueItems `xml:"techniques,omitempty" json:"techniques,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated martialarts.go")

if __name__ == '__main__':
    print("Generating martial arts from martialarts.xsd...")
    generate_martialarts()
    print("Done!")

