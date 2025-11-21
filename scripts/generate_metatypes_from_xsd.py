#!/usr/bin/env python3
"""Generate metatypes.go from metatypes.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def to_go_identifier(name):
    """Convert XML element name to Go identifier"""
    parts = re.split(r'[-_]', name)
    return ''.join(word.capitalize() for word in parts)

def get_min_occurs(elem):
    """Get minOccurs value, default 1"""
    val = elem.get('minOccurs')
    if val is None:
        return 1
    if val == '0':
        return 0
    return int(val) if val.isdigit() else 1

def get_max_occurs(elem):
    """Get maxOccurs value, default 1"""
    val = elem.get('maxOccurs')
    if val is None:
        return 1
    if val == 'unbounded':
        return -1
    return int(val) if val.isdigit() else 1

def xsd_type_to_go(xsd_type, min_occurs=1, max_occurs=1):
    """Convert XSD type to Go type"""
    if xsd_type is None:
        return 'string'
    
    # Handle simple types
    if xsd_type in ['xs:string', 'string']:
        go_type = 'string'
    elif xsd_type in ['xs:integer', 'xs:int', 'integer', 'int']:
        go_type = 'int'
    elif xsd_type in ['xs:boolean', 'boolean']:
        go_type = 'bool'
    elif xsd_type in ['xs:decimal', 'xs:double', 'xs:float']:
        go_type = 'float64'
    elif xsd_type == 'bonusTypes':
        return 'common.BaseBonus'  # Special handling for bonusTypes
    else:
        go_type = 'string'
    
    # Handle cardinality
    if min_occurs == 0:
        if max_occurs == 1:
            return f'*{go_type}'
        else:
            return f'[]{go_type}'
    elif max_occurs > 1 or max_occurs == -1:
        return f'[]{go_type}'
    else:
        return go_type

def generate_metatypes():
    """Generate metatypes.go from metatypes.xsd"""
    
    tree = ET.parse('data/chummerxml/metatypes.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/metatypes.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains metatype structures generated from metatypes.xsd\n\n')
        
        # Generate Quality struct (referenced element)
        f.write('// Quality represents a quality with optional attributes\n')
        f.write('type Quality struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRemovable *string `xml:"removable,attr,omitempty" json:"+@removable,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Power struct (referenced element)
        f.write('// Power represents a power with optional attributes\n')
        f.write('type Power struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('\tCost *string `xml:"cost,attr,omitempty" json:"+@cost,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PositiveQualities struct
        f.write('// PositiveQualities represents positive qualities\n')
        f.write('type PositiveQualities struct {\n')
        f.write('\tQuality []Quality `xml:"quality,omitempty" json:"quality,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate NegativeQualities struct
        f.write('// NegativeQualities represents negative qualities\n')
        f.write('type NegativeQualities struct {\n')
        f.write('\tQuality []Quality `xml:"quality,omitempty" json:"quality,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Qualities struct
        f.write('// Qualities represents a collection of qualities\n')
        f.write('type Qualities struct {\n')
        f.write('\tPositive *PositiveQualities `xml:"positive,omitempty" json:"positive,omitempty"`\n')
        f.write('\tNegative *NegativeQualities `xml:"negative,omitempty" json:"negative,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Powers struct
        f.write('// Powers represents a collection of powers\n')
        f.write('type Powers struct {\n')
        f.write('\tPower []Power `xml:"power,omitempty" json:"power,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate OptionalPowers struct
        f.write('// OptionalPowers represents optional powers\n')
        f.write('type OptionalPowers struct {\n')
        f.write('\tPower []Power `xml:"power,omitempty" json:"power,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Metavariant struct
        f.write('// Metavariant represents a metavariant\n')
        f.write('type Metavariant struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tKarma string `xml:"karma" json:"karma"`\n')
        f.write('\tPowers *Powers `xml:"powers,omitempty" json:"powers,omitempty"`\n')
        f.write('\tQualities *Qualities `xml:"qualities,omitempty" json:"qualities,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate MetatypeSkill struct (for skills element - renamed to avoid conflict)
        f.write('// MetatypeSkill represents a skill with optional attributes for metatypes\n')
        f.write('type MetatypeSkill struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('\tSpec *string `xml:"spec,attr,omitempty" json:"+@spec,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate MetatypeSkillGroup struct (for skill groups)
        f.write('// MetatypeSkillGroup represents a skill group for metatypes\n')
        f.write('type MetatypeSkillGroup struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate MetatypeKnowledge struct (for knowledge skills)
        f.write('// MetatypeKnowledge represents a knowledge skill for metatypes\n')
        f.write('type MetatypeKnowledge struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('\tCategory *string `xml:"category,attr,omitempty" json:"+@category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate MetatypeSkills struct
        f.write('// MetatypeSkills represents a collection of skills for metatypes\n')
        f.write('type MetatypeSkills struct {\n')
        f.write('\tSkill []MetatypeSkill `xml:"skill,omitempty" json:"skill,omitempty"`\n')
        f.write('\tGroup []MetatypeSkillGroup `xml:"group,omitempty" json:"group,omitempty"`\n')
        f.write('\tKnowledge []MetatypeKnowledge `xml:"knowledge,omitempty" json:"knowledge,omitempty"`\n')
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
        
        # Generate Gear struct (for gears element)
        f.write('// Gear represents a gear item\n')
        f.write('type Gear struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Gears struct
        f.write('// Gears represents a collection of gear items\n')
        f.write('type Gears struct {\n')
        f.write('\tGear []Gear `xml:"gear,omitempty" json:"gear,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate QualityRestriction struct
        f.write('// QualityRestriction represents quality restrictions\n')
        f.write('type QualityRestriction struct {\n')
        f.write('\tPositive *PositiveQualities `xml:"positive,omitempty" json:"positive,omitempty"`\n')
        f.write('\tNegative *NegativeQualities `xml:"negative,omitempty" json:"negative,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Metavariants struct
        f.write('// Metavariants represents a collection of metavariants\n')
        f.write('type Metavariants struct {\n')
        f.write('\tMetavariant []Metavariant `xml:"metavariant,omitempty" json:"metavariant,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Metatype struct (main element)
        f.write('// Metatype represents a metatype definition\n')
        f.write('type Metatype struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tName *string `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('\tForceCreature *string `xml:"forcecreature,omitempty" json:"forcecreature,omitempty"`\n')
        f.write('\tKarma *string `xml:"karma,omitempty" json:"karma,omitempty"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
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
        f.write('\tWilMin string `xml:"wilmin" json:"wilmin"`\n')
        f.write('\tWilMax string `xml:"wilmax" json:"wilmax"`\n')
        f.write('\tWilAug string `xml:"wilaug" json:"wilaug"`\n')
        f.write('\tLogMin string `xml:"logmin" json:"logmin"`\n')
        f.write('\tLogMax string `xml:"logmax" json:"logmax"`\n')
        f.write('\tLogAug string `xml:"logaug" json:"logaug"`\n')
        f.write('\tIntMin string `xml:"intmin" json:"intmin"`\n')
        f.write('\tIntMax string `xml:"intmax" json:"intmax"`\n')
        f.write('\tIntAug string `xml:"intaug" json:"intaug"`\n')
        f.write('\tChaMin string `xml:"chamin" json:"chamin"`\n')
        f.write('\tChaMax string `xml:"chamax" json:"chamax"`\n')
        f.write('\tChaAug string `xml:"chaaug" json:"chaaug"`\n')
        f.write('\tEdgMin string `xml:"edgmin" json:"edgmin"`\n')
        f.write('\tEdgMax string `xml:"edgmax" json:"edgmax"`\n')
        f.write('\tEdgAug string `xml:"edgaug" json:"edgaug"`\n')
        f.write('\tIniMin string `xml:"inimin" json:"inimin"`\n')
        f.write('\tIniMax string `xml:"inimax" json:"inimax"`\n')
        f.write('\tIniAug string `xml:"iniaug" json:"iniaug"`\n')
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
        f.write('\tSkills *MetatypeSkills `xml:"skills,omitempty" json:"skills,omitempty"`\n')
        f.write('\tComplexForms *ComplexForms `xml:"complexforms,omitempty" json:"complexforms,omitempty"`\n')
        f.write('\tOptionalComplexForms *OptionalComplexForms `xml:"optionalcomplexforms,omitempty" json:"optionalcomplexforms,omitempty"`\n')
        f.write('\tGears *Gears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('\tMetavariants *Metavariants `xml:"metavariants,omitempty" json:"metavariants,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate MetatypeCategory struct
        f.write('// MetatypeCategory represents a metatype category\n')
        f.write('type MetatypeCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate MetatypeCategories struct
        f.write('// MetatypeCategories represents a collection of metatype categories\n')
        f.write('type MetatypeCategories struct {\n')
        f.write('\tCategory []MetatypeCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Metatypes struct (container)
        f.write('// Metatypes represents a collection of metatypes\n')
        f.write('type Metatypes struct {\n')
        f.write('\tMetatype []Metatype `xml:"metatype,omitempty" json:"metatype,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate MetatypesChummer struct (root element)
        f.write('// MetatypesChummer represents the root chummer element for metatypes\n')
        f.write('type MetatypesChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tCategories []MetatypeCategories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tMetatypes []Metatypes `xml:"metatypes,omitempty" json:"metatypes,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated metatypes.go")

if __name__ == '__main__':
    print("Generating metatypes from metatypes.xsd...")
    generate_metatypes()
    print("Done!")

