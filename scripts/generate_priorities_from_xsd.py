#!/usr/bin/env python3
"""Generate priorities.go from priorities.xsd"""

import xml.etree.ElementTree as ET
import os

def generate_priorities():
    """Generate priorities.go from priorities.xsd"""
    
    tree = ET.parse('data/chummerxml/priorities.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/priorities.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains priority structures generated from priorities.xsd\n\n')
        
        # Generate PriorityTalentRequired struct
        f.write('// PriorityTalentRequired represents required conditions for a talent\n')
        f.write('type PriorityTalentRequired struct {\n')
        f.write('\tOneOf PriorityTalentRequiredOneOf `xml:"oneof" json:"oneof"`\n')
        f.write('}\n\n')
        
        # Generate PriorityTalentRequiredOneOf struct
        f.write('// PriorityTalentRequiredOneOf represents one-of requirement\n')
        f.write('type PriorityTalentRequiredOneOf struct {\n')
        f.write('\tMetatype string `xml:"metatype" json:"metatype"`\n')
        f.write('}\n\n')
        
        # Generate PriorityTalentForbidden struct
        f.write('// PriorityTalentForbidden represents forbidden conditions for a talent\n')
        f.write('type PriorityTalentForbidden struct {\n')
        f.write('\tOneOf PriorityTalentForbiddenOneOf `xml:"oneof" json:"oneof"`\n')
        f.write('}\n\n')
        
        # Generate PriorityTalentForbiddenOneOf struct
        f.write('// PriorityTalentForbiddenOneOf represents one-of forbidden condition\n')
        f.write('type PriorityTalentForbiddenOneOf struct {\n')
        f.write('\tMetatype string `xml:"metatype" json:"metatype"`\n')
        f.write('}\n\n')
        
        # Generate PriorityTalentQualities struct
        f.write('// PriorityTalentQualities represents qualities for a talent\n')
        f.write('type PriorityTalentQualities struct {\n')
        f.write('\tQuality []string `xml:"quality" json:"quality"`\n')
        f.write('}\n\n')
        
        # Generate PriorityTalentSkillGroupChoices struct
        f.write('// PriorityTalentSkillGroupChoices represents skill group choices for a talent\n')
        f.write('type PriorityTalentSkillGroupChoices struct {\n')
        f.write('\tSkillGroup []string `xml:"skillgroup" json:"skillgroup"`\n')
        f.write('}\n\n')
        
        # Generate PriorityTalentSkillChoices struct
        f.write('// PriorityTalentSkillChoices represents skill choices for a talent\n')
        f.write('type PriorityTalentSkillChoices struct {\n')
        f.write('\tSkill []string `xml:"skill" json:"skill"`\n')
        f.write('}\n\n')
        
        # Generate PriorityTalent struct
        f.write('// PriorityTalent represents a talent in a priority\n')
        f.write('type PriorityTalent struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tValue string `xml:"value" json:"value"`\n')
        f.write('\tDepth *byte `xml:"depth,omitempty" json:"depth,omitempty"`\n')
        f.write('\tSpecialAttribPoints *byte `xml:"specialattribpoints,omitempty" json:"specialattribpoints,omitempty"`\n')
        f.write('\tQualities *PriorityTalentQualities `xml:"qualities,omitempty" json:"qualities,omitempty"`\n')
        f.write('\tSkillGroupChoices *PriorityTalentSkillGroupChoices `xml:"skillgroupchoices,omitempty" json:"skillgroupchoices,omitempty"`\n')
        f.write('\tSkillChoices *PriorityTalentSkillChoices `xml:"skillchoices,omitempty" json:"skillchoices,omitempty"`\n')
        f.write('\tResonance *byte `xml:"resonance,omitempty" json:"resonance,omitempty"`\n')
        f.write('\tCFP *byte `xml:"cfp,omitempty" json:"cfp,omitempty"`\n')
        f.write('\tMagic *byte `xml:"magic,omitempty" json:"magic,omitempty"`\n')
        f.write('\tSkillGroupQty *byte `xml:"skillgroupqty,omitempty" json:"skillgroupqty,omitempty"`\n')
        f.write('\tSkillGroupVal *byte `xml:"skillgroupval,omitempty" json:"skillgroupval,omitempty"`\n')
        f.write('\tSkillGroupType *string `xml:"skillgrouptype,omitempty" json:"skillgrouptype,omitempty"`\n')
        f.write('\tSpells *byte `xml:"spells,omitempty" json:"spells,omitempty"`\n')
        f.write('\tSkillQty *byte `xml:"skillqty,omitempty" json:"skillqty,omitempty"`\n')
        f.write('\tSkillVal *byte `xml:"skillval,omitempty" json:"skillval,omitempty"`\n')
        f.write('\tSkillType *string `xml:"skilltype,omitempty" json:"skilltype,omitempty"`\n')
        f.write('\tRequired *PriorityTalentRequired `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('\tForbidden *PriorityTalentForbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PriorityTalents struct
        f.write('// PriorityTalents represents a collection of talents\n')
        f.write('type PriorityTalents struct {\n')
        f.write('\tTalent []PriorityTalent `xml:"talent" json:"talent"`\n')
        f.write('}\n\n')
        
        # Generate PriorityMetavariant struct
        f.write('// PriorityMetavariant represents a metavariant in a priority\n')
        f.write('type PriorityMetavariant struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tValue byte `xml:"value" json:"value"`\n')
        f.write('\tKarma byte `xml:"karma" json:"karma"`\n')
        f.write('}\n\n')
        
        # Generate PriorityMetavariants struct
        f.write('// PriorityMetavariants represents a collection of metavariants\n')
        f.write('type PriorityMetavariants struct {\n')
        f.write('\tMetavariant []PriorityMetavariant `xml:"metavariant,omitempty" json:"metavariant,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PriorityMetatype struct
        f.write('// PriorityMetatype represents a metatype in a priority\n')
        f.write('type PriorityMetatype struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tValue byte `xml:"value" json:"value"`\n')
        f.write('\tKarma byte `xml:"karma" json:"karma"`\n')
        f.write('\tMetavariants *PriorityMetavariants `xml:"metavariants,omitempty" json:"metavariants,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PriorityMetatypes struct
        f.write('// PriorityMetatypes represents a collection of metatypes\n')
        f.write('type PriorityMetatypes struct {\n')
        f.write('\tMetatype []PriorityMetatype `xml:"metatype" json:"metatype"`\n')
        f.write('}\n\n')
        
        # Generate PriorityCategories struct
        f.write('// PriorityCategories represents a collection of categories\n')
        f.write('type PriorityCategories struct {\n')
        f.write('\tCategory []string `xml:"category" json:"category"`\n')
        f.write('}\n\n')
        
        # Generate Priority struct (using xs:choice means these are optional fields)
        f.write('// Priority represents a priority definition\n')
        f.write('type Priority struct {\n')
        f.write('\tID *string `xml:"id,omitempty" json:"id,omitempty"`\n')
        f.write('\tName *string `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('\tHide *string `xml:"hide,omitempty" json:"hide,omitempty"`\n')
        f.write('\tValue *string `xml:"value,omitempty" json:"value,omitempty"`\n')
        f.write('\tCategory *string `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('\tGameplayOption *string `xml:"gameplayoption,omitempty" json:"gameplayoption,omitempty"`\n')
        f.write('\tSkills *byte `xml:"skills,omitempty" json:"skills,omitempty"`\n')
        f.write('\tSkillGroups *byte `xml:"skillgroups,omitempty" json:"skillgroups,omitempty"`\n')
        f.write('\tAttributes *byte `xml:"attributes,omitempty" json:"attributes,omitempty"`\n')
        f.write('\tTalents *PriorityTalents `xml:"talents,omitempty" json:"talents,omitempty"`\n')
        f.write('\tMetatypes *PriorityMetatypes `xml:"metatypes,omitempty" json:"metatypes,omitempty"`\n')
        f.write('\tResources *uint `xml:"resources,omitempty" json:"resources,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Priorities struct
        f.write('// Priorities represents a collection of priorities\n')
        f.write('type Priorities struct {\n')
        f.write('\tPriority []Priority `xml:"priority" json:"priority"`\n')
        f.write('}\n\n')
        
        # Generate PrioritiesChummer struct (root element)
        f.write('// PrioritiesChummer represents the root chummer element for priorities\n')
        f.write('type PrioritiesChummer struct {\n')
        f.write('\tVersion byte `xml:"version" json:"version"`\n')
        f.write('\tCategories PriorityCategories `xml:"categories" json:"categories"`\n')
        f.write('\tPriorities Priorities `xml:"priorities" json:"priorities"`\n')
        f.write('}\n\n')
    
    print("Generated priorities.go")

if __name__ == '__main__':
    print("Generating priorities from priorities.xsd...")
    generate_priorities()
    print("Done!")

