#!/usr/bin/env python3
"""Generate qualitylevels.go from qualitylevels.xsd"""

import xml.etree.ElementTree as ET
import os

def generate_qualitylevels():
    """Generate qualitylevels.go from qualitylevels.xsd"""
    
    tree = ET.parse('data/chummerxml/qualitylevels.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/qualitylevels.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('// This file contains quality level structures generated from qualitylevels.xsd\n\n')
        
        # Generate Level struct
        f.write('// QualityLevel represents a quality level entry\n')
        f.write('type QualityLevel struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tValue int `xml:"value,attr" json:"+@value"`\n')
        f.write('}\n\n')
        
        # Generate Levels struct
        f.write('// QualityLevels represents a collection of quality levels\n')
        f.write('type QualityLevels struct {\n')
        f.write('\tLevel []QualityLevel `xml:"level" json:"level"`\n')
        f.write('}\n\n')
        
        # Generate QualityGroup struct
        f.write('// QualityGroup represents a quality group definition\n')
        f.write('type QualityGroup struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tLevels QualityLevels `xml:"levels" json:"levels"`\n')
        f.write('}\n\n')
        
        # Generate QualityGroups struct
        f.write('// QualityGroups represents a collection of quality groups\n')
        f.write('type QualityGroups struct {\n')
        f.write('\tQualityGroup []QualityGroup `xml:"qualitygroup,omitempty" json:"qualitygroup,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate QualityLevelsChummer struct (root element)
        f.write('// QualityLevelsChummer represents the root chummer element for quality levels\n')
        f.write('type QualityLevelsChummer struct {\n')
        f.write('\tQualityGroups *QualityGroups `xml:"qualitygroups,omitempty" json:"qualitygroups,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated qualitylevels.go")

if __name__ == '__main__':
    print("Generating qualitylevels from qualitylevels.xsd...")
    generate_qualitylevels()
    print("Done!")

