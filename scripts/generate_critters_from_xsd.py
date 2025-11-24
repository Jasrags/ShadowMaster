#!/usr/bin/env python3
"""Generate critters.go from critters.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def generate_critters():
    """Generate critters.go from critters.xsd"""
    
    tree = ET.parse('data/chummerxml/critters.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/critters.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains critter structures generated from critters.xsd\n\n')
        
        # Generate CritterQuality struct (referenced element)
        f.write('// CritterQuality represents a quality with optional attributes\n')
        f.write('type CritterQuality struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterBiowareName struct
        f.write('// CritterBiowareName represents a bioware name\n')
        f.write('type CritterBiowareName struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('\tRating *int `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterBioware struct
        f.write('// CritterBioware represents a bioware item\n')
        f.write('type CritterBioware struct {\n')
        f.write('\tName []CritterBiowareName `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterCyberwareName struct
        f.write('// CritterCyberwareName represents a cyberware name\n')
        f.write('type CritterCyberwareName struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('\tRating *int `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterCyberware struct
        f.write('// CritterCyberware represents a cyberware item\n')
        f.write('type CritterCyberware struct {\n')
        f.write('\tName []CritterCyberwareName `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterPower struct
        f.write('// CritterPower represents a critter power\n')
        f.write('type CritterPower struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterOptionalPower struct
        f.write('// CritterOptionalPower represents an optional critter power\n')
        f.write('type CritterOptionalPower struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PositiveQualities struct
        f.write('// CritterPositiveQualities represents positive qualities\n')
        f.write('type CritterPositiveQualities struct {\n')
        f.write('\tQuality []CritterQuality `xml:"quality,omitempty" json:"quality,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate NegativeQualities struct
        f.write('// CritterNegativeQualities represents negative qualities\n')
        f.write('type CritterNegativeQualities struct {\n')
        f.write('\tQuality []CritterQuality `xml:"quality,omitempty" json:"quality,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterQualities struct
        f.write('// CritterQualities represents a collection of qualities\n')
        f.write('type CritterQualities struct {\n')
        f.write('\tPositive *CritterPositiveQualities `xml:"positive,omitempty" json:"positive,omitempty"`\n')
        f.write('\tNegative *CritterNegativeQualities `xml:"negative,omitempty" json:"negative,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterPowers struct
        f.write('// CritterPowers represents a collection of critter powers\n')
        f.write('type CritterPowers struct {\n')
        f.write('\tPower []CritterPower `xml:"power,omitempty" json:"power,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterOptionalPowers struct
        f.write('// CritterOptionalPowers represents optional critter powers\n')
        f.write('type CritterOptionalPowers struct {\n')
        f.write('\tOptionalPower []CritterOptionalPower `xml:"optionalpower,omitempty" json:"optionalpower,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterMetavariant struct
        f.write('// CritterMetavariant represents a critter metavariant\n')
        f.write('type CritterMetavariant struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tKarma string `xml:"karma" json:"karma"`\n')
        f.write('\tPowers *CritterPowers `xml:"powers,omitempty" json:"powers,omitempty"`\n')
        f.write('\tOptionalPowers *CritterOptionalPowers `xml:"optionalpowers,omitempty" json:"optionalpowers,omitempty"`\n')
        f.write('\tSkills *CritterMetatypeSkills `xml:"skills,omitempty" json:"skills,omitempty"`\n')
        f.write('\tQualities *CritterQualities `xml:"qualities,omitempty" json:"qualities,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate CritterMetatypeSkill struct
        f.write('// CritterMetatypeSkill represents a skill with optional attributes for critters\n')
        f.write('type CritterMetatypeSkill struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('\tSpec *string `xml:"spec,attr,omitempty" json:"+@spec,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterMetatypeSkillGroup struct
        f.write('// CritterMetatypeSkillGroup represents a skill group for critters\n')
        f.write('type CritterMetatypeSkillGroup struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterMetatypeKnowledge struct
        f.write('// CritterMetatypeKnowledge represents a knowledge skill for critters\n')
        f.write('type CritterMetatypeKnowledge struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('\tCategory *string `xml:"category,attr,omitempty" json:"+@category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterMetatypeSkills struct
        f.write('// CritterMetatypeSkills represents a collection of skills for critters\n')
        f.write('type CritterMetatypeSkills struct {\n')
        f.write('\tSkill []CritterMetatypeSkill `xml:"skill,omitempty" json:"skill,omitempty"`\n')
        f.write('\tGroup []CritterMetatypeSkillGroup `xml:"group,omitempty" json:"group,omitempty"`\n')
        f.write('\tKnowledge []CritterMetatypeKnowledge `xml:"knowledge,omitempty" json:"knowledge,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterComplexForm struct
        f.write('// CritterComplexForm represents a complex form\n')
        f.write('type CritterComplexForm struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('\tCategory *string `xml:"category,attr,omitempty" json:"+@category,omitempty"`\n')
        f.write('\tOption *string `xml:"option,attr,omitempty" json:"+@option,omitempty"`\n')
        f.write('\tOptionRating *string `xml:"optionrating,attr,omitempty" json:"+@optionrating,omitempty"`\n')
        f.write('\tOptionSelect *string `xml:"optionselect,attr,omitempty" json:"+@optionselect,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterComplexForms struct
        f.write('// CritterComplexForms represents a collection of complex forms\n')
        f.write('type CritterComplexForms struct {\n')
        f.write('\tComplexForm []CritterComplexForm `xml:"complexform,omitempty" json:"complexform,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterOptionalComplexForms struct
        f.write('// CritterOptionalComplexForms represents optional complex forms\n')
        f.write('type CritterOptionalComplexForms struct {\n')
        f.write('\tComplexForm []CritterComplexForm `xml:"complexform,omitempty" json:"complexform,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterGear struct
        f.write('// CritterGear represents a gear item\n')
        f.write('type CritterGear struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterGears struct
        f.write('// CritterGears represents a collection of gear items\n')
        f.write('type CritterGears struct {\n')
        f.write('\tGear []CritterGear `xml:"gear,omitempty" json:"gear,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterBiowares struct
        f.write('// CritterBiowares represents a collection of bioware items\n')
        f.write('type CritterBiowares struct {\n')
        f.write('\tBioware []CritterBioware `xml:"bioware,omitempty" json:"bioware,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterCyberwares struct
        f.write('// CritterCyberwares represents a collection of cyberware items\n')
        f.write('type CritterCyberwares struct {\n')
        f.write('\tCyberware []CritterCyberware `xml:"cyberware,omitempty" json:"cyberware,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterQualityRestriction struct
        f.write('// CritterQualityRestriction represents quality restrictions\n')
        f.write('type CritterQualityRestriction struct {\n')
        f.write('\tPositive *CritterPositiveQualities `xml:"positive,omitempty" json:"positive,omitempty"`\n')
        f.write('\tNegative *CritterNegativeQualities `xml:"negative,omitempty" json:"negative,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterMetavariants struct
        f.write('// CritterMetavariants represents a collection of critter metavariants\n')
        f.write('type CritterMetavariants struct {\n')
        f.write('\tMetavariant []CritterMetavariant `xml:"metavariant,omitempty" json:"metavariant,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Critter struct (main element - similar to Metatype)
        f.write('// Critter represents a critter definition\n')
        f.write('type Critter struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tName *string `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('\tCategory *string `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('\tForceCreature *string `xml:"forcecreature,omitempty" json:"forcecreature,omitempty"`\n')
        f.write('\tKarma *string `xml:"karma,omitempty" json:"karma,omitempty"`\n')
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
        f.write('\tDepMin string `xml:"depmin" json:"depmin"`\n')
        f.write('\tDepMax string `xml:"depmax" json:"depmax"`\n')
        f.write('\tDepAug string `xml:"depaug" json:"depaug"`\n')
        f.write('\tEssMin string `xml:"essmin" json:"essmin"`\n')
        f.write('\tEssMax string `xml:"essmax" json:"essmax"`\n')
        f.write('\tEssAug string `xml:"essaug" json:"essaug"`\n')
        f.write('\tForceIsLevels *string `xml:"forceislevels,omitempty" json:"forceislevels,omitempty"`\n')
        f.write('\tMovement *string `xml:"movement,omitempty" json:"movement,omitempty"`\n')
        f.write('\tWalk *string `xml:"walk,omitempty" json:"walk,omitempty"`\n')
        f.write('\tRun *string `xml:"run,omitempty" json:"run,omitempty"`\n')
        f.write('\tSprint *string `xml:"sprint,omitempty" json:"sprint,omitempty"`\n')
        f.write('\tQualityRestriction *CritterQualityRestriction `xml:"qualityrestriction,omitempty" json:"qualityrestriction,omitempty"`\n')
        f.write('\tQualities *CritterQualities `xml:"qualities,omitempty" json:"qualities,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tBiowares *CritterBiowares `xml:"biowares,omitempty" json:"biowares,omitempty"`\n')
        f.write('\tComplexForms *CritterComplexForms `xml:"complexforms,omitempty" json:"complexforms,omitempty"`\n')
        f.write('\tCyberwares *CritterCyberwares `xml:"cyberwares,omitempty" json:"cyberwares,omitempty"`\n')
        f.write('\tGears *CritterGears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('\tOptionalComplexForms *CritterOptionalComplexForms `xml:"optionalcomplexforms,omitempty" json:"optionalcomplexforms,omitempty"`\n')
        f.write('\tOptionalPowers *CritterOptionalPowers `xml:"optionalpowers,omitempty" json:"optionalpowers,omitempty"`\n')
        f.write('\tPowers *CritterPowers `xml:"powers,omitempty" json:"powers,omitempty"`\n')
        f.write('\tSkills *CritterMetatypeSkills `xml:"skills,omitempty" json:"skills,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('\tMetavariants *CritterMetavariants `xml:"metavariants,omitempty" json:"metavariants,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterCategory struct
        f.write('// CritterCategory represents a critter category\n')
        f.write('type CritterCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterCategories struct
        f.write('// CritterCategories represents a collection of critter categories\n')
        f.write('type CritterCategories struct {\n')
        f.write('\tCategory []CritterCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Critters struct (container)
        f.write('// Critters represents a collection of critters\n')
        f.write('type Critters struct {\n')
        f.write('\tMetatype []Critter `xml:"metatype,omitempty" json:"metatype,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CrittersChummer struct (root element)
        f.write('// CrittersChummer represents the root chummer element for critters\n')
        f.write('type CrittersChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tCategories []CritterCategories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tMetatypes []Critters `xml:"metatypes,omitempty" json:"metatypes,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated critters.go")

if __name__ == '__main__':
    print("Generating critters from critters.xsd...")
    generate_critters()
    print("Done!")

