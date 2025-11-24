#!/usr/bin/env python3
"""Generate vessels.go from vessels.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def generate_vessels():
    """Generate vessels.go from vessels.xsd"""
    
    tree = ET.parse('data/chummerxml/vessels.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/vessels.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains vessel structures generated from vessels.xsd\n\n')
        
        # Generate VesselQuality struct (referenced element)
        f.write('// VesselQuality represents a quality with optional attributes\n')
        f.write('type VesselQuality struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRemovable *string `xml:"removable,attr,omitempty" json:"+@removable,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VesselPower struct (referenced element)
        f.write('// VesselPower represents a power with optional attributes\n')
        f.write('type VesselPower struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('\tCost *string `xml:"cost,attr,omitempty" json:"+@cost,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VesselCategory struct
        f.write('// VesselCategory represents a vessel category\n')
        f.write('type VesselCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VesselCategories struct
        f.write('// VesselCategories represents a collection of vessel categories\n')
        f.write('type VesselCategories struct {\n')
        f.write('\tCategory []VesselCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PositiveQualities struct
        f.write('// PositiveQualities represents positive qualities\n')
        f.write('type PositiveQualities struct {\n')
        f.write('\tQuality []VesselQuality `xml:"quality,omitempty" json:"quality,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate NegativeQualities struct
        f.write('// NegativeQualities represents negative qualities\n')
        f.write('type NegativeQualities struct {\n')
        f.write('\tQuality []VesselQuality `xml:"quality,omitempty" json:"quality,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Qualities struct
        f.write('// Qualities represents a collection of qualities\n')
        f.write('type Qualities struct {\n')
        f.write('\tPositive *PositiveQualities `xml:"positive,omitempty" json:"positive,omitempty"`\n')
        f.write('\tNegative *NegativeQualities `xml:"negative,omitempty" json:"negative,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate QualityRestriction struct
        f.write('// QualityRestriction represents quality restrictions\n')
        f.write('type QualityRestriction struct {\n')
        f.write('\tPositive *PositiveQualities `xml:"positive,omitempty" json:"positive,omitempty"`\n')
        f.write('\tNegative *NegativeQualities `xml:"negative,omitempty" json:"negative,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Powers struct
        f.write('// Powers represents a collection of powers\n')
        f.write('type Powers struct {\n')
        f.write('\tPower []VesselPower `xml:"power,omitempty" json:"power,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate OptionalPowers struct
        f.write('// OptionalPowers represents optional powers\n')
        f.write('type OptionalPowers struct {\n')
        f.write('\tPower []VesselPower `xml:"power,omitempty" json:"power,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VesselSkill struct (for skills element)
        f.write('// VesselSkill represents a skill with optional attributes for vessels\n')
        f.write('type VesselSkill struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('\tSpec *string `xml:"spec,attr,omitempty" json:"+@spec,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VesselSkillGroup struct (for skill groups)
        f.write('// VesselSkillGroup represents a skill group for vessels\n')
        f.write('type VesselSkillGroup struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VesselKnowledge struct (for knowledge skills)
        f.write('// VesselKnowledge represents a knowledge skill for vessels\n')
        f.write('type VesselKnowledge struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('\tCategory *string `xml:"category,attr,omitempty" json:"+@category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VesselSkills struct
        f.write('// VesselSkills represents a collection of skills for vessels\n')
        f.write('type VesselSkills struct {\n')
        f.write('\tSkill []VesselSkill `xml:"skill,omitempty" json:"skill,omitempty"`\n')
        f.write('\tGroup []VesselSkillGroup `xml:"group,omitempty" json:"group,omitempty"`\n')
        f.write('\tKnowledge []VesselKnowledge `xml:"knowledge,omitempty" json:"knowledge,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ComplexForm struct
        f.write('// ComplexForm represents a complex form\n')
        f.write('type ComplexForm struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('\tCategory *string `xml:"category,attr,omitempty" json:"+@category,omitempty"`\n')
        f.write('\tOption *string `xml:"option,attr,omitempty" json:"+@option,omitempty"`\n')
        f.write('\tOptionRating *string `xml:"optionrating,attr,omitempty" json:"+@optionrating,omitempty"`\n')
        f.write('\tOptionSelect *string `xml:"optionselect,attr,omitempty" json:"+@optionselect,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate ComplexForms struct
        f.write('// ComplexForms represents a collection of complex forms\n')
        f.write('type ComplexForms struct {\n')
        f.write('\tComplexForm []ComplexForm `xml:"complexform,omitempty" json:"complexform,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate OptionalComplexForms struct
        f.write('// OptionalComplexForms represents optional complex forms\n')
        f.write('type OptionalComplexForms struct {\n')
        f.write('\tComplexForm []ComplexForm `xml:"complexform,omitempty" json:"complexform,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Metatype struct (main element - same structure as in metatypes.xsd)
        f.write('// Metatype represents a metatype definition for vessels\n')
        f.write('type Metatype struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory *string `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('\tForceCreature *string `xml:"forcecreature,omitempty" json:"forcecreature,omitempty"`\n')
        f.write('\tBP *string `xml:"bp,omitempty" json:"bp,omitempty"`\n')
        # Attribute ranges
        f.write('\tBodMin string `xml:"bodmin" json:"bodmin"`\n')
        f.write('\tBodMax string `xml:"bodmax" json:"bodmax"`\n')
        f.write('\tBodAug string `xml:"bodaug" json:"bodaug"`\n')
        f.write('\tAgiMin string `xml:"agimin" json:"agimin"`\n')
        f.write('\tAgiMax string `xml:"agimax" json:"agimax"`\n')
        f.write('\tAgiAug string `xml:"agiaug" json:"agiaug"`\n')
        f.write('\tReaMin string `xml:"reamin" json:"reamin"`\n')
        f.write('\tReaMax string `xml:"reamax" json:"reamax"`\n')
        f.write('\tReaAug string `xml:"reaaug" json:"reaaug"`\n')
        f.write('\tStrMin string `xml:"strmin" json:"strmin"`\n')
        f.write('\tStrMax string `xml:"strmax" json:"strmax"`\n')
        f.write('\tStrAug string `xml:"straug" json:"straug"`\n')
        f.write('\tChaMin string `xml:"chamin" json:"chamin"`\n')
        f.write('\tChaMax string `xml:"chamax" json:"chamax"`\n')
        f.write('\tChaAug string `xml:"chaaug" json:"chaaug"`\n')
        f.write('\tIntMin string `xml:"intmin" json:"intmin"`\n')
        f.write('\tIntMax string `xml:"intmax" json:"intmax"`\n')
        f.write('\tIntAug string `xml:"intaug" json:"intaug"`\n')
        f.write('\tLogMin string `xml:"logmin" json:"logmin"`\n')
        f.write('\tLogMax string `xml:"logmax" json:"logmax"`\n')
        f.write('\tLogAug string `xml:"logaug" json:"logaug"`\n')
        f.write('\tWilMin string `xml:"wilmin" json:"wilmin"`\n')
        f.write('\tWilMax string `xml:"wilmax" json:"wilmax"`\n')
        f.write('\tWilAug string `xml:"wilaug" json:"wilaug"`\n')
        f.write('\tIniMin string `xml:"inimin" json:"inimin"`\n')
        f.write('\tIniMax string `xml:"inimax" json:"inimax"`\n')
        f.write('\tIniAug string `xml:"iniaug" json:"iniaug"`\n')
        f.write('\tEdgMin string `xml:"edgmin" json:"edgmin"`\n')
        f.write('\tEdgMax string `xml:"edgmax" json:"edgmax"`\n')
        f.write('\tEdgAug string `xml:"edgaug" json:"edgaug"`\n')
        f.write('\tMagMin string `xml:"magmin" json:"magmin"`\n')
        f.write('\tMagMax string `xml:"magmax" json:"magmax"`\n')
        f.write('\tMagAug string `xml:"magaug" json:"magaug"`\n')
        f.write('\tResMin string `xml:"resmin" json:"resmin"`\n')
        f.write('\tResMax string `xml:"resmax" json:"resmax"`\n')
        f.write('\tResAug string `xml:"resaug" json:"resaug"`\n')
        f.write('\tEssMin string `xml:"essmin" json:"essmin"`\n')
        f.write('\tEssMax string `xml:"essmax" json:"essmax"`\n')
        f.write('\tEssAug string `xml:"essaug" json:"essaug"`\n')
        f.write('\tMovement string `xml:"movement" json:"movement"`\n')
        f.write('\tQualityRestriction *QualityRestriction `xml:"qualityrestriction,omitempty" json:"qualityrestriction,omitempty"`\n')
        f.write('\tQualities *Qualities `xml:"qualities,omitempty" json:"qualities,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tPowers *Powers `xml:"powers,omitempty" json:"powers,omitempty"`\n')
        f.write('\tOptionalPowers *OptionalPowers `xml:"optionalpowers,omitempty" json:"optionalpowers,omitempty"`\n')
        f.write('\tSkills *VesselSkills `xml:"skills,omitempty" json:"skills,omitempty"`\n')
        f.write('\tComplexForms *ComplexForms `xml:"complexforms,omitempty" json:"complexforms,omitempty"`\n')
        f.write('\tOptionalComplexForms *OptionalComplexForms `xml:"optionalcomplexforms,omitempty" json:"optionalcomplexforms,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate Metatypes struct (container)
        f.write('// Metatypes represents a collection of metatypes\n')
        f.write('type Metatypes struct {\n')
        f.write('\tMetatype []Metatype `xml:"metatype,omitempty" json:"metatype,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate VesselsChummer struct (root element)
        f.write('// VesselsChummer represents the root chummer element for vessels\n')
        f.write('type VesselsChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tCategories []VesselCategories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tMetatypes []Metatypes `xml:"metatypes,omitempty" json:"metatypes,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated vessels.go")

if __name__ == '__main__':
    print("Generating vessels from vessels.xsd...")
    generate_vessels()
    print("Done!")

