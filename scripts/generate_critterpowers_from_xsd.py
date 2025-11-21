#!/usr/bin/env python3
"""Generate critterpowers.go from critterpowers.xsd"""

import xml.etree.ElementTree as ET
import os

def generate_critterpowers():
    """Generate critterpowers.go from critterpowers.xsd"""
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    with open('pkg/shadowrun/edition/v5/critterpowers.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains critter power structures generated from critterpowers.xsd\n\n')
        
        f.write('// CritterPowerCategory represents a critter power category\n')
        f.write('type CritterPowerCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// CritterPowerCategories represents a collection of critter power categories\n')
        f.write('type CritterPowerCategories struct {\n')
        f.write('\tCategory []CritterPowerCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// CritterPowerItem represents a critter power definition\n')
        f.write('type CritterPowerItem struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tType string `xml:"type" json:"type"`\n')
        f.write('\tAction string `xml:"action" json:"action"`\n')
        f.write('\tRange string `xml:"range" json:"range"`\n')
        f.write('\tDuration string `xml:"duration" json:"duration"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tToxic *string `xml:"toxic,omitempty" json:"toxic,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tForbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('\tKarma *string `xml:"karma,omitempty" json:"karma,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// CritterPowerItems represents a collection of critter powers\n')
        f.write('type CritterPowerItems struct {\n')
        f.write('\tPower []CritterPowerItem `xml:"power,omitempty" json:"power,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// CritterPowersChummer represents the root chummer element for critter powers\n')
        f.write('type CritterPowersChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tCategories []CritterPowerCategories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tPowers []CritterPowerItems `xml:"powers,omitempty" json:"powers,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated critterpowers.go")

if __name__ == '__main__':
    print("Generating critterpowers from critterpowers.xsd...")
    generate_critterpowers()
    print("Done!")

