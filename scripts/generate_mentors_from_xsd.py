#!/usr/bin/env python3
"""Generate mentors.go from mentors.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def generate_mentors():
    """Generate mentors.go from mentors.xsd"""
    
    tree = ET.parse('data/chummerxml/mentors.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/mentors.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains mentor structures generated from mentors.xsd\n\n')
        
        # Generate MentorCategory struct
        f.write('// MentorCategory represents a mentor category\n')
        f.write('type MentorCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate MentorCategories struct
        f.write('// MentorCategories represents a collection of mentor categories\n')
        f.write('type MentorCategories struct {\n')
        f.write('\tCategory []MentorCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate MentorChoice struct
        f.write('// MentorChoice represents a mentor choice\n')
        f.write('type MentorChoice struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tHide *string `xml:"hide,omitempty" json:"hide,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tSet *int `xml:"set,attr,omitempty" json:"+@set,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate MentorChoices struct
        f.write('// MentorChoices represents a collection of mentor choices\n')
        f.write('type MentorChoices struct {\n')
        f.write('\tChoice []MentorChoice `xml:"choice" json:"choice"`\n')
        f.write('}\n\n')
        
        # Generate Mentor struct
        f.write('// Mentor represents a mentor\n')
        f.write('type Mentor struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory *string `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('\tAdvantage string `xml:"advantage" json:"advantage"`\n')
        f.write('\tDisadvantage string `xml:"disadvantage" json:"disadvantage"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tChoices *MentorChoices `xml:"choices,omitempty" json:"choices,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate Mentors struct (container)
        f.write('// Mentors represents a collection of mentors\n')
        f.write('type Mentors struct {\n')
        f.write('\tMentor []Mentor `xml:"mentor,omitempty" json:"mentor,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate MentorsChummer struct (root element)
        f.write('// MentorsChummer represents the root chummer element for mentors\n')
        f.write('type MentorsChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tCategories []MentorCategories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tMentors []Mentors `xml:"mentors,omitempty" json:"mentors,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated mentors.go")

if __name__ == '__main__':
    print("Generating mentors from mentors.xsd...")
    generate_mentors()
    print("Done!")

