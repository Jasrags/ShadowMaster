#!/usr/bin/env python3
"""Generate powers.go from powers.xsd"""

import xml.etree.ElementTree as ET
import os

def generate_powers():
    """Generate powers.go from powers.xsd"""
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    with open('pkg/shadowrun/edition/v5/powers.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains power structures generated from powers.xsd\n\n')
        
        f.write('// IncludeInLimit represents include in limit\n')
        f.write('type IncludeInLimit struct {\n')
        f.write('\tName []string `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// AdeptWayRequires represents adept way requirements\n')
        f.write('type AdeptWayRequires struct {\n')
        f.write('\tMagiciansWayForbids *string `xml:"magicianswayforbids,omitempty" json:"magicianswayforbids,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// PowerItem represents a power definition\n')
        f.write('type PowerItem struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tPoints float64 `xml:"points" json:"points"`\n')
        f.write('\tLevels string `xml:"levels" json:"levels"`\n')
        f.write('\tLimit int `xml:"limit" json:"limit"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage int `xml:"page" json:"page"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tIncludeInLimit *IncludeInLimit `xml:"includeinlimit,omitempty" json:"includeinlimit,omitempty"`\n')
        f.write('\tAction *string `xml:"action,omitempty" json:"action,omitempty"`\n')
        f.write('\tAdeptWay *float64 `xml:"adeptway,omitempty" json:"adeptway,omitempty"`\n')
        f.write('\tAdeptWayRequires *AdeptWayRequires `xml:"adeptwayrequires,omitempty" json:"adeptwayrequires,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tDoubleCost *string `xml:"doublecost,omitempty" json:"doublecost,omitempty"`\n')
        f.write('\tExtraPointCost *float64 `xml:"extrapointcost,omitempty" json:"extrapointcost,omitempty"`\n')
        f.write('\tForbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`\n')
        f.write('\tMaxLevels *int `xml:"maxlevels,omitempty" json:"maxlevels,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// Powers represents a collection of powers\n')
        f.write('type Powers struct {\n')
        f.write('\tPower []PowerItem `xml:"power" json:"power"`\n')
        f.write('}\n\n')
        
        f.write('// EnhancementAdeptWayRequires represents adept way requirements for enhancements\n')
        f.write('type EnhancementAdeptWayRequires struct {\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// Enhancement represents an enhancement definition\n')
        f.write('type Enhancement struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tPower string `xml:"power" json:"power"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage int `xml:"page" json:"page"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tAdeptWayRequires *EnhancementAdeptWayRequires `xml:"adeptwayrequires,omitempty" json:"adeptwayrequires,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// Enhancements represents a collection of enhancements\n')
        f.write('type Enhancements struct {\n')
        f.write('\tEnhancement []Enhancement `xml:"enhancement" json:"enhancement"`\n')
        f.write('}\n\n')
        
        f.write('// PowersChummer represents the root chummer element for powers\n')
        f.write('type PowersChummer struct {\n')
        f.write('\tVersion int `xml:"version" json:"version"`\n')
        f.write('\tPowers Powers `xml:"powers" json:"powers"`\n')
        f.write('\tEnhancements Enhancements `xml:"enhancements" json:"enhancements"`\n')
        f.write('}\n\n')
    
    print("Generated powers.go")

if __name__ == '__main__':
    print("Generating powers from powers.xsd...")
    generate_powers()
    print("Done!")

