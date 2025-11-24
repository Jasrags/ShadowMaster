#!/usr/bin/env python3
"""Generate spells.go from spells.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def generate_spells():
    """Generate spells.go from spells.xsd"""
    
    tree = ET.parse('data/chummerxml/spells.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/spells.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains spell structures generated from spells.xsd\n\n')
        
        # Generate SpellCategory struct
        f.write('// SpellCategory represents a spell category\n')
        f.write('type SpellCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tUseSkill *string `xml:"useskill,attr,omitempty" json:"+@useskill,omitempty"`\n')
        f.write('\tAlchemicalSkill *string `xml:"alchemicalskill,attr,omitempty" json:"+@alchemicalskill,omitempty"`\n')
        f.write('\tBarehandedAdeptSkill *string `xml:"barehandedadeptskill,attr,omitempty" json:"+@barehandedadeptskill,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate SpellCategories struct
        f.write('// SpellCategories represents a collection of spell categories\n')
        f.write('type SpellCategories struct {\n')
        f.write('\tCategory []SpellCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Spell struct (main element)
        f.write('// Spell represents a spell definition\n')
        f.write('type Spell struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tDamage string `xml:"damage" json:"damage"`\n')
        f.write('\tDescriptor string `xml:"descriptor" json:"descriptor"`\n')
        f.write('\tDuration string `xml:"duration" json:"duration"`\n')
        f.write('\tDV string `xml:"dv" json:"dv"`\n')
        f.write('\tRange string `xml:"range" json:"range"`\n')
        f.write('\tType string `xml:"type" json:"type"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tUseSkill *string `xml:"useskill,omitempty" json:"useskill,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tForbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Spells struct (container)
        f.write('// Spells represents a collection of spells\n')
        f.write('type Spells struct {\n')
        f.write('\tSpell []Spell `xml:"spell,omitempty" json:"spell,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate SpellsChummer struct (root element)
        f.write('// SpellsChummer represents the root chummer element for spells\n')
        f.write('type SpellsChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tCategories []SpellCategories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tSpells []Spells `xml:"spells,omitempty" json:"spells,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated spells.go")

if __name__ == '__main__':
    print("Generating spells from spells.xsd...")
    generate_spells()
    print("Done!")

