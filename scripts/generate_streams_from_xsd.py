#!/usr/bin/env python3
"""Generate streams.go from streams.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def generate_streams():
    """Generate streams.go from streams.xsd"""
    
    tree = ET.parse('data/chummerxml/streams.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/streams.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains stream structures generated from streams.xsd\n\n')
        
        # Generate StreamSpirit struct (for spirits within tradition)
        f.write('// StreamSpirit represents a spirit name for a stream\n')
        f.write('type StreamSpirit struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate StreamSpirits struct
        f.write('// StreamSpirits represents a collection of spirit names\n')
        f.write('type StreamSpirits struct {\n')
        f.write('\tSpirit []StreamSpirit `xml:"spirit,omitempty" json:"spirit,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Stream struct
        f.write('// Stream represents a magical stream\n')
        f.write('type Stream struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tDrain string `xml:"drain" json:"drain"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tSpirits *StreamSpirits `xml:"spirits,omitempty" json:"spirits,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate Streams struct (container)
        f.write('// Streams represents a collection of streams\n')
        f.write('type Streams struct {\n')
        f.write('\tTradition []Stream `xml:"tradition,omitempty" json:"tradition,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate StreamSpiritPower struct (for powers within spirit)
        f.write('// StreamSpiritPower represents a stream spirit power\n')
        f.write('type StreamSpiritPower struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate StreamSpiritPowers struct
        f.write('// StreamSpiritPowers represents a collection of stream spirit powers\n')
        f.write('type StreamSpiritPowers struct {\n')
        f.write('\tPower []StreamSpiritPower `xml:"power" json:"power"`\n')
        f.write('}\n\n')
        
        # Generate StreamSpiritOptionalPowers struct
        f.write('// StreamSpiritOptionalPowers represents optional powers for stream spirits\n')
        f.write('type StreamSpiritOptionalPowers struct {\n')
        f.write('\tPower []string `xml:"power,omitempty" json:"power,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate StreamSpiritBonus struct
        f.write('// StreamSpiritBonus represents a custom bonus type for stream spirits\n')
        f.write('type StreamSpiritBonus struct {\n')
        f.write('\tEnableTab *EnableTab `xml:"enabletab,omitempty" json:"enabletab,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate StreamSpiritSkill struct
        f.write('// StreamSpiritSkill represents a stream spirit skill\n')
        f.write('type StreamSpiritSkill struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tAttr *string `xml:"attr,attr,omitempty" json:"+@attr,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate StreamSpiritSkills struct
        f.write('// StreamSpiritSkills represents a collection of stream spirit skills\n')
        f.write('type StreamSpiritSkills struct {\n')
        f.write('\tSkill []StreamSpiritSkill `xml:"skill" json:"skill"`\n')
        f.write('}\n\n')
        
        # Generate StreamWeaknesses struct
        f.write('// StreamWeaknesses represents a collection of weaknesses\n')
        f.write('type StreamWeaknesses struct {\n')
        f.write('\tWeakness []string `xml:"weakness,omitempty" json:"weakness,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate StreamSpiritItem struct
        f.write('// StreamSpiritItem represents a stream spirit definition\n')
        f.write('type StreamSpiritItem struct {\n')
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
        f.write('\tBonus *StreamSpiritBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tOptionalPowers *StreamSpiritOptionalPowers `xml:"optionalpowers,omitempty" json:"optionalpowers,omitempty"`\n')
        f.write('\tPowers StreamSpiritPowers `xml:"powers" json:"powers"`\n')
        f.write('\tSkills StreamSpiritSkills `xml:"skills" json:"skills"`\n')
        f.write('\tWeaknesses *StreamWeaknesses `xml:"weaknesses,omitempty" json:"weaknesses,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate StreamSpiritsContainer struct (container)
        f.write('// StreamSpiritsContainer represents a collection of stream spirits\n')
        f.write('type StreamSpiritsContainer struct {\n')
        f.write('\tSpirit []StreamSpiritItem `xml:"spirit" json:"spirit"`\n')
        f.write('}\n\n')
        
        # Generate StreamsChummer struct (root element)
        f.write('// StreamsChummer represents the root chummer element for streams\n')
        f.write('type StreamsChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tTraditions []Streams `xml:"traditions,omitempty" json:"traditions,omitempty"`\n')
        f.write('\tSpirits StreamSpiritsContainer `xml:"spirits" json:"spirits"`\n')
        f.write('}\n\n')
    
    print("Generated streams.go")

if __name__ == '__main__':
    print("Generating streams from streams.xsd...")
    generate_streams()
    print("Done!")

