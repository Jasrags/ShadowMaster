#!/usr/bin/env python3
"""Generate metamagic.go from metamagic.xsd"""

import xml.etree.ElementTree as ET
import os

def generate_metamagic():
    """Generate metamagic.go from metamagic.xsd"""
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    with open('pkg/shadowrun/edition/v5/metamagic.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains metamagic structures generated from metamagic.xsd\n\n')
        
        f.write('// MetamagicItem represents a metamagic definition\n')
        f.write('type MetamagicItem struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tAdept string `xml:"adept" json:"adept"`\n')
        f.write('\tMagician string `xml:"magician" json:"magician"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tLimit *string `xml:"limit,omitempty" json:"limit,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tForbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// MetamagicItems represents a collection of metamagic\n')
        f.write('type MetamagicItems struct {\n')
        f.write('\tMetamagic []MetamagicItem `xml:"metamagic,omitempty" json:"metamagic,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// Art represents an art definition\n')
        f.write('type Art struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        f.write('// Arts represents a collection of arts\n')
        f.write('type Arts struct {\n')
        f.write('\tArt []Art `xml:"art,omitempty" json:"art,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// MetamagicChummer represents the root chummer element for metamagic\n')
        f.write('type MetamagicChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tMetamagics []MetamagicItems `xml:"metamagics,omitempty" json:"metamagics,omitempty"`\n')
        f.write('\tArts []Arts `xml:"arts,omitempty" json:"arts,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated metamagic.go")

if __name__ == '__main__':
    print("Generating metamagic from metamagic.xsd...")
    generate_metamagic()
    print("Done!")

