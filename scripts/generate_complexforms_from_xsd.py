#!/usr/bin/env python3
"""Generate complexforms.go from complexforms.xsd"""

import xml.etree.ElementTree as ET
import os

def generate_complexforms():
    """Generate complexforms.go from complexforms.xsd"""
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    with open('pkg/shadowrun/edition/v5/complexforms.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains complex form structures generated from complexforms.xsd\n\n')
        
        f.write('// ComplexFormCategory represents a complex form category\n')
        f.write('type ComplexFormCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// ComplexFormCategories represents a collection of complex form categories\n')
        f.write('type ComplexFormCategories struct {\n')
        f.write('\tCategory []ComplexFormCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// ComplexFormItem represents a complex form definition\n')
        f.write('type ComplexFormItem struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tTarget string `xml:"target" json:"target"`\n')
        f.write('\tDuration string `xml:"duration" json:"duration"`\n')
        f.write('\tFV string `xml:"fv" json:"fv"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tUseSkill *string `xml:"useskill,omitempty" json:"useskill,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('\tForbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// ComplexFormItems represents a collection of complex forms\n')
        f.write('type ComplexFormItems struct {\n')
        f.write('\tComplexForm []ComplexFormItem `xml:"complexform,omitempty" json:"complexform,omitempty"`\n')
        f.write('}\n\n')
        
        f.write('// ComplexFormsChummer represents the root chummer element for complex forms\n')
        f.write('type ComplexFormsChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tCategories []ComplexFormCategories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tComplexForms []ComplexFormItems `xml:"complexforms,omitempty" json:"complexforms,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated complexforms.go")

if __name__ == '__main__':
    print("Generating complexforms from complexforms.xsd...")
    generate_complexforms()
    print("Done!")

