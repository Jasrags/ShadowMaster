#!/usr/bin/env python3
"""Generate drugcomponents.go from drugcomponents.xsd"""

import xml.etree.ElementTree as ET
import os

def generate_drugcomponents():
    """Generate drugcomponents.go from drugcomponents.xsd"""
    
    tree = ET.parse('data/chummerxml/drugcomponents.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/drugcomponents.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains drug component structures generated from drugcomponents.xsd\n\n')
        
        # Generate Grade struct (for drug grades)
        f.write('// DrugGrade represents a drug grade definition\n')
        f.write('type DrugGrade struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tName *string `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('\tEss *string `xml:"ess,omitempty" json:"ess,omitempty"`\n')
        f.write('\tCost *string `xml:"cost,omitempty" json:"cost,omitempty"`\n')
        f.write('\tAddictionThreshold *int `xml:"addictionthreshold,omitempty" json:"addictionthreshold,omitempty"`\n')
        f.write('\tAvail *string `xml:"avail,omitempty" json:"avail,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate Grades struct
        f.write('// DrugGrades represents a collection of drug grades\n')
        f.write('type DrugGrades struct {\n')
        f.write('\tGrade []DrugGrade `xml:"grade,omitempty" json:"grade,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Attribute struct (for effect attributes)
        f.write('// DrugEffectAttribute represents an attribute in a drug effect\n')
        f.write('type DrugEffectAttribute struct {\n')
        f.write('\tName *string `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('\tValue *int `xml:"value,omitempty" json:"value,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Limit struct (for effect limits)
        f.write('// DrugEffectLimit represents a limit in a drug effect\n')
        f.write('type DrugEffectLimit struct {\n')
        f.write('\tName *string `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('\tValue *int `xml:"value,omitempty" json:"value,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Effect struct
        f.write('// DrugEffect represents a drug effect\n')
        f.write('type DrugEffect struct {\n')
        f.write('\tLevel *int `xml:"level,omitempty" json:"level,omitempty"`\n')
        f.write('\tAttribute []DrugEffectAttribute `xml:"attribute,omitempty" json:"attribute,omitempty"`\n')
        f.write('\tCrashDamage *int `xml:"crashdamage,omitempty" json:"crashdamage,omitempty"`\n')
        f.write('\tDuration *int `xml:"duration,omitempty" json:"duration,omitempty"`\n')
        f.write('\tInitiativeDice *int `xml:"initiativedice,omitempty" json:"initiativedice,omitempty"`\n')
        f.write('\tInfo *string `xml:"info,omitempty" json:"info,omitempty"`\n')
        f.write('\tLimit []DrugEffectLimit `xml:"limit,omitempty" json:"limit,omitempty"`\n')
        f.write('\tQuality *string `xml:"quality,omitempty" json:"quality,omitempty"`\n')
        f.write('\tSpeed *int `xml:"speed,omitempty" json:"speed,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Effects struct
        f.write('// DrugEffects represents a collection of drug effects\n')
        f.write('type DrugEffects struct {\n')
        f.write('\tEffect []DrugEffect `xml:"effect" json:"effect"`\n')
        f.write('}\n\n')
        
        # Generate DrugComponent struct
        f.write('// DrugComponent represents a drug component definition\n')
        f.write('type DrugComponent struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tEffects DrugEffects `xml:"effects" json:"effects"`\n')
        f.write('\tAvailability string `xml:"availability" json:"availability"`\n')
        f.write('\tCost int `xml:"cost" json:"cost"`\n')
        f.write('\tRating *int `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('\tThreshold *int `xml:"threshold,omitempty" json:"threshold,omitempty"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage int `xml:"page" json:"page"`\n')
        f.write('}\n\n')
        
        # Generate DrugComponents struct
        f.write('// DrugComponents represents a collection of drug components\n')
        f.write('type DrugComponents struct {\n')
        f.write('\tDrugComponent []DrugComponent `xml:"drugcomponent" json:"drugcomponent"`\n')
        f.write('}\n\n')
        
        # Generate DrugComponentsChummer struct (root element)
        f.write('// DrugComponentsChummer represents the root chummer element for drug components\n')
        f.write('type DrugComponentsChummer struct {\n')
        f.write('\tGrades *DrugGrades `xml:"grades,omitempty" json:"grades,omitempty"`\n')
        f.write('\tDrugComponents DrugComponents `xml:"drugcomponents" json:"drugcomponents"`\n')
        f.write('}\n\n')
    
    print("Generated drugcomponents.go")

if __name__ == '__main__':
    print("Generating drugcomponents from drugcomponents.xsd...")
    generate_drugcomponents()
    print("Done!")

