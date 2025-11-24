#!/usr/bin/env python3
"""Generate traditions.go from traditions.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def generate_traditions():
    """Generate traditions.go from traditions.xsd"""
    
    tree = ET.parse('data/chummerxml/traditions.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/traditions.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains tradition structures generated from traditions.xsd\n\n')
        
        # Generate TraditionSpirits struct (for spirits within tradition)
        f.write('// TraditionSpirits represents spirit attributes for a tradition\n')
        f.write('type TraditionSpirits struct {\n')
        f.write('\tSpiritCombat *string `xml:"spiritcombat,omitempty" json:"spiritcombat,omitempty"`\n')
        f.write('\tSpiritDetection *string `xml:"spiritdetection,omitempty" json:"spiritdetection,omitempty"`\n')
        f.write('\tSpiritHealth *string `xml:"spirithealth,omitempty" json:"spirithealth,omitempty"`\n')
        f.write('\tSpiritIllusion *string `xml:"spiritillusion,omitempty" json:"spiritillusion,omitempty"`\n')
        f.write('\tSpiritManipulation *string `xml:"spiritmanipulation,omitempty" json:"spiritmanipulation,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Tradition struct
        f.write('// Tradition represents a magical tradition\n')
        f.write('type Tradition struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tDrain string `xml:"drain" json:"drain"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage uint16 `xml:"page" json:"page"`\n')
        f.write('\tSpiritForm *string `xml:"spiritform,omitempty" json:"spiritform,omitempty"`\n')
        f.write('\tSpirits TraditionSpirits `xml:"spirits" json:"spirits"`\n')
        f.write('}\n\n')
        
        # Generate Traditions struct (container)
        f.write('// Traditions represents a collection of traditions\n')
        f.write('type Traditions struct {\n')
        f.write('\tTradition []Tradition `xml:"tradition" json:"tradition"`\n')
        f.write('}\n\n')
        
        # Generate SpiritPower struct (for powers within spirit)
        f.write('// SpiritPower represents a spirit power\n')
        f.write('type SpiritPower struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate SpiritPowers struct
        f.write('// SpiritPowers represents a collection of spirit powers\n')
        f.write('type SpiritPowers struct {\n')
        f.write('\tPower []SpiritPower `xml:"power" json:"power"`\n')
        f.write('}\n\n')
        
        # Generate SpiritOptionalPowers struct (renamed to avoid conflict)
        f.write('// SpiritOptionalPowers represents optional powers for spirits\n')
        f.write('type SpiritOptionalPowers struct {\n')
        f.write('\tPower []string `xml:"power,omitempty" json:"power,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate SpiritBonus struct (custom bonus type for spirits)
        f.write('// SpiritBonus represents a custom bonus type for spirits\n')
        f.write('type SpiritBonus struct {\n')
        f.write('\tEnableTab *EnableTab `xml:"enabletab,omitempty" json:"enabletab,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate EnableTab struct
        f.write('// EnableTab represents an enable tab bonus\n')
        f.write('type EnableTab struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('}\n\n')
        
        # Generate SpiritSkill struct (for skills within spirit)
        f.write('// SpiritSkill represents a spirit skill\n')
        f.write('type SpiritSkill struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tAttr *string `xml:"attr,attr,omitempty" json:"+@attr,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate SpiritSkills struct
        f.write('// SpiritSkills represents a collection of spirit skills\n')
        f.write('type SpiritSkills struct {\n')
        f.write('\tSkill []SpiritSkill `xml:"skill" json:"skill"`\n')
        f.write('}\n\n')
        
        # Generate Weaknesses struct
        f.write('// Weaknesses represents a collection of weaknesses\n')
        f.write('type Weaknesses struct {\n')
        f.write('\tWeakness []string `xml:"weakness,omitempty" json:"weakness,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Spirit struct
        f.write('// Spirit represents a spirit definition\n')
        f.write('type Spirit struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tBod string `xml:"bod" json:"bod"`\n')
        f.write('\tAgi string `xml:"agi" json:"agi"`\n')
        f.write('\tRea string `xml:"rea" json:"rea"`\n')
        f.write('\tStr string `xml:"str" json:"str"`\n')
        f.write('\tCha string `xml:"cha" json:"cha"`\n')
        f.write('\tInt string `xml:"int" json:"int"`\n')
        f.write('\tLog string `xml:"log" json:"log"`\n')
        f.write('\tWil string `xml:"wil" json:"wil"`\n')
        f.write('\tIni string `xml:"ini" json:"ini"`\n')
        f.write('\tEdg *string `xml:"edg,omitempty" json:"edg,omitempty"`\n')
        f.write('\tMag *string `xml:"mag,omitempty" json:"mag,omitempty"`\n')
        f.write('\tRes *uint8 `xml:"res,omitempty" json:"res,omitempty"`\n')
        f.write('\tDep *uint8 `xml:"dep,omitempty" json:"dep,omitempty"`\n')
        f.write('\tEss *string `xml:"ess,omitempty" json:"ess,omitempty"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage uint16 `xml:"page" json:"page"`\n')
        f.write('\tBonus *SpiritBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tOptionalPowers *SpiritOptionalPowers `xml:"optionalpowers,omitempty" json:"optionalpowers,omitempty"`\n')
        f.write('\tPowers SpiritPowers `xml:"powers" json:"powers"`\n')
        f.write('\tSkills SpiritSkills `xml:"skills" json:"skills"`\n')
        f.write('\tWeaknesses *Weaknesses `xml:"weaknesses,omitempty" json:"weaknesses,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Spirits struct (container)
        f.write('// Spirits represents a collection of spirits\n')
        f.write('type Spirits struct {\n')
        f.write('\tSpirit []Spirit `xml:"spirit" json:"spirit"`\n')
        f.write('}\n\n')
        
        # Generate DrainAttribute struct
        f.write('// DrainAttribute represents a drain attribute\n')
        f.write('type DrainAttribute struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tHide *string `xml:"hide,omitempty" json:"hide,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate DrainAttributes struct (container)
        f.write('// DrainAttributes represents a collection of drain attributes\n')
        f.write('type DrainAttributes struct {\n')
        f.write('\tDrainAttribute []DrainAttribute `xml:"drainattribute" json:"drainattribute"`\n')
        f.write('}\n\n')
        
        # Generate TraditionsChummer struct (root element)
        f.write('// TraditionsChummer represents the root chummer element for traditions\n')
        f.write('type TraditionsChummer struct {\n')
        f.write('\tVersion uint8 `xml:"version" json:"version"`\n')
        f.write('\tTraditions Traditions `xml:"traditions" json:"traditions"`\n')
        f.write('\tSpirits Spirits `xml:"spirits" json:"spirits"`\n')
        f.write('\tDrainAttributes DrainAttributes `xml:"drainattributes" json:"drainattributes"`\n')
        f.write('}\n\n')
    
    print("Generated traditions.go")

if __name__ == '__main__':
    print("Generating traditions from traditions.xsd...")
    generate_traditions()
    print("Done!")

