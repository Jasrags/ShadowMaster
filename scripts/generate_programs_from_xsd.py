#!/usr/bin/env python3
"""Generate programs.go from programs.xsd"""

import xml.etree.ElementTree as ET
import os

def generate_programs():
    """Generate programs.go from programs.xsd"""
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    with open('pkg/shadowrun/edition/v5/programs.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains program structures generated from programs.xsd\n\n')
        
        f.write('// ProgramCategory represents a program category\n')
        f.write('type ProgramCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// ProgramCategories represents a collection of program categories\n')
        f.write('type ProgramCategories struct {\n')
        f.write('\tCategory []ProgramCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// Tags represents tags\n')
        f.write('type Tags struct {\n')
        f.write('\tTag []string `xml:"tag" json:"tag"`\n')
        f.write('}\n\n')
        
        f.write('// ProgramItem represents a program definition\n')
        f.write('type ProgramItem struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tTags *Tags `xml:"tags,omitempty" json:"tags,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('\tMinRating *string `xml:"minrating,omitempty" json:"minrating,omitempty"`\n')
        f.write('\tComplexForm *string `xml:"complexform,omitempty" json:"complexform,omitempty"`\n')
        f.write('\tAvail *string `xml:"avail,omitempty" json:"avail,omitempty"`\n')
        f.write('\tCost *string `xml:"cost,omitempty" json:"cost,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tForbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// ProgramItems represents a collection of programs\n')
        f.write('type ProgramItems struct {\n')
        f.write('\tProgram []ProgramItem `xml:"program,omitempty" json:"program,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// ProgramTypes represents program types\n')
        f.write('type ProgramTypes struct {\n')
        f.write('\tProgramType []string `xml:"programtype" json:"programtype"`\n')
        f.write('}\n\n')
        
        f.write('// OptionTags represents tags for options\n')
        f.write('type OptionTags struct {\n')
        f.write('\tTag []string `xml:"tag" json:"tag"`\n')
        f.write('}\n\n')
        
        f.write('// Option represents a program option\n')
        f.write('type Option struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tMaxRating string `xml:"maxrating" json:"maxrating"`\n')
        f.write('\tComplexForm string `xml:"complexform" json:"complexform"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tProgramTypes *ProgramTypes `xml:"programtypes,omitempty" json:"programtypes,omitempty"`\n')
        f.write('\tTags *OptionTags `xml:"tags,omitempty" json:"tags,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// Options represents a collection of options\n')
        f.write('type Options struct {\n')
        f.write('\tOption []Option `xml:"option,omitempty" json:"option,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// ProgramsChummer represents the root chummer element for programs\n')
        f.write('type ProgramsChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tCategories []ProgramCategories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tPrograms []ProgramItems `xml:"programs,omitempty" json:"programs,omitempty"`\n')
        f.write('\tOptions []Options `xml:"options,omitempty" json:"options,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated programs.go")

if __name__ == '__main__':
    print("Generating programs from programs.xsd...")
    generate_programs()
    print("Done!")

