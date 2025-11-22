#!/usr/bin/env python3
"""Generate lifemodules.go from lifemodules.xml"""

import xml.etree.ElementTree as ET
import os

def generate_lifemodules():
    """Generate lifemodules.go from lifemodules.xml"""
    
    tree = ET.parse('data/chummerxml/lifemodules.xml')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/lifemodules.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('// This file contains life module structures generated from lifemodules.xml\n\n')
        
        # Generate Stage struct
        f.write('// LifeModuleStage represents a life module stage\n')
        f.write('type LifeModuleStage struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tOrder int `xml:"order,attr" json:"+@order"`\n')
        f.write('}\n\n')
        
        # Generate Stages struct
        f.write('// LifeModuleStages represents a collection of life module stages\n')
        f.write('type LifeModuleStages struct {\n')
        f.write('\tStage []LifeModuleStage `xml:"stage" json:"stage"`\n')
        f.write('}\n\n')
        
        # Generate AttributeLevel struct
        f.write('// LifeModuleAttributeLevel represents an attribute level bonus\n')
        f.write('type LifeModuleAttributeLevel struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tVal *int `xml:"val,omitempty" json:"val,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate SkillLevel struct
        f.write('// LifeModuleSkillLevel represents a skill level bonus\n')
        f.write('type LifeModuleSkillLevel struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tVal *int `xml:"val,omitempty" json:"val,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate KnowledgeSkillLevelOptions struct
        f.write('// LifeModuleKnowledgeSkillLevelOptions represents options for a knowledge skill level\n')
        f.write('type LifeModuleKnowledgeSkillLevelOptions struct {\n')
        f.write('\tSpanish *string `xml:"spanish,omitempty" json:"spanish,omitempty"`\n')
        f.write('\tGerman *string `xml:"german,omitempty" json:"german,omitempty"`\n')
        f.write('\tItalian *string `xml:"italian,omitempty" json:"italian,omitempty"`\n')
        f.write('\tFlee *string `xml:"flee,omitempty" json:"flee,omitempty"`\n')
        f.write('\tOrange *string `xml:"orange,omitempty" json:"orange,omitempty"`\n')
        f.write('\tPolish *string `xml:"polish,omitempty" json:"polish,omitempty"`\n')
        f.write('\tYiddish *string `xml:"yiddish,omitempty" json:"yiddish,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate KnowledgeSkillLevel struct
        f.write('// LifeModuleKnowledgeSkillLevel represents a knowledge skill level bonus\n')
        f.write('type LifeModuleKnowledgeSkillLevel struct {\n')
        f.write('\tID *string `xml:"id,omitempty" json:"id,omitempty"`\n')
        f.write('\tGroup *string `xml:"group,omitempty" json:"group,omitempty"`\n')
        f.write('\tName *string `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('\tVal *int `xml:"val,omitempty" json:"val,omitempty"`\n')
        f.write('\tOptions *LifeModuleKnowledgeSkillLevelOptions `xml:"options,omitempty" json:"options,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate QualityLevel struct
        f.write('// LifeModuleQualityLevel represents a quality level bonus\n')
        f.write('type LifeModuleQualityLevel struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tGroup *string `xml:"group,attr,omitempty" json:"+@group,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate LifeModuleBonus struct
        f.write('// LifeModuleBonus represents a bonus structure for life modules\n')
        f.write('type LifeModuleBonus struct {\n')
        f.write('\tAttributeLevel []LifeModuleAttributeLevel `xml:"attributelevel,omitempty" json:"attributelevel,omitempty"`\n')
        f.write('\tSkillLevel []LifeModuleSkillLevel `xml:"skilllevel,omitempty" json:"skilllevel,omitempty"`\n')
        f.write('\tKnowledgeSkillLevel []LifeModuleKnowledgeSkillLevel `xml:"knowledgeskilllevel,omitempty" json:"knowledgeskilllevel,omitempty"`\n')
        f.write('\tPushText *string `xml:"pushtext,omitempty" json:"pushtext,omitempty"`\n')
        f.write('\tFreeNegativeQualities *int `xml:"freenegativequalities,omitempty" json:"freenegativequalities,omitempty"`\n')
        f.write('\tQualityLevel []LifeModuleQualityLevel `xml:"qualitylevel,omitempty" json:"qualitylevel,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate LifeModuleVersion struct
        f.write('// LifeModuleVersion represents a version of a life module\n')
        f.write('type LifeModuleVersion struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tStory *string `xml:"story,omitempty" json:"story,omitempty"`\n')
        f.write('\tBonus *LifeModuleBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate LifeModuleVersions struct
        f.write('// LifeModuleVersions represents a collection of life module versions\n')
        f.write('type LifeModuleVersions struct {\n')
        f.write('\tVersion []LifeModuleVersion `xml:"version" json:"version"`\n')
        f.write('}\n\n')
        
        # Generate LifeModule struct
        f.write('// LifeModule represents a life module definition\n')
        f.write('type LifeModule struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tStage string `xml:"stage" json:"stage"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tKarma int `xml:"karma" json:"karma"`\n')
        f.write('\tVersions *LifeModuleVersions `xml:"versions,omitempty" json:"versions,omitempty"`\n')
        f.write('\tBonus *LifeModuleBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tStory *string `xml:"story,omitempty" json:"story,omitempty"`\n')
        f.write('\tSource string `xml:"source" json:"source"`\n')
        f.write('\tPage string `xml:"page" json:"page"`\n')
        f.write('}\n\n')
        
        # Generate LifeModules struct
        f.write('// LifeModules represents a collection of life modules\n')
        f.write('type LifeModules struct {\n')
        f.write('\tModule []LifeModule `xml:"module" json:"module"`\n')
        f.write('}\n\n')
        
        # Generate LifeModulesChummer struct (root element)
        f.write('// LifeModulesChummer represents the root chummer element for life modules\n')
        f.write('type LifeModulesChummer struct {\n')
        f.write('\tStages LifeModuleStages `xml:"stages" json:"stages"`\n')
        f.write('\tModules LifeModules `xml:"modules" json:"modules"`\n')
        f.write('}\n\n')
    
    print("Generated lifemodules.go")

if __name__ == '__main__':
    print("Generating lifemodules from lifemodules.xml...")
    generate_lifemodules()
    print("Done!")

