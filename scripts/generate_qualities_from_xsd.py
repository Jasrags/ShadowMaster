#!/usr/bin/env python3
"""Generate qualities.go from qualities.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def generate_qualities():
    """Generate qualities.go from qualities.xsd"""
    
    tree = ET.parse('data/chummerxml/qualities.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/qualities.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains quality structures generated from qualities.xsd\n\n')
        
        # Generate QualityCategory struct
        f.write('// QualityCategory represents a quality category\n')
        f.write('type QualityCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate QualityCategories struct
        f.write('// QualityCategories represents a collection of quality categories\n')
        f.write('type QualityCategories struct {\n')
        f.write('\tCategory []QualityCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate AddQuality struct
        f.write('// AddQuality represents an addquality element\n')
        f.write('type AddQuality struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tContributeToBP *bool `xml:"contributetobp,attr,omitempty" json:"+@contributetobp,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate AddQualities struct
        f.write('// AddQualities represents addqualities element\n')
        f.write('type AddQualities struct {\n')
        f.write('\tAddQuality []AddQuality `xml:"addquality,omitempty" json:"addquality,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CostDiscount struct
        f.write('// CostDiscount represents a cost discount\n')
        f.write('type CostDiscount struct {\n')
        f.write('\tRequired common.Required `xml:"required" json:"required"`\n')
        f.write('\tValue int `xml:"value" json:"value"`\n')
        f.write('}\n\n')
        
        # Generate QualityPower struct (for critterpowers)
        f.write('// QualityPower represents a power with optional attributes for qualities\n')
        f.write('type QualityPower struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,attr,omitempty" json:"+@rating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CritterPowers struct
        f.write('// CritterPowers represents a collection of critter powers\n')
        f.write('type CritterPowers struct {\n')
        f.write('\tPower []QualityPower `xml:"power,omitempty" json:"power,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate IncludeInLimit struct
        f.write('// IncludeInLimit represents include in limit\n')
        f.write('type IncludeInLimit struct {\n')
        f.write('\tName []string `xml:"name" json:"name"`\n')
        f.write('}\n\n')
        
        # Generate NaturalWeapon struct
        f.write('// NaturalWeapon represents a natural weapon\n')
        f.write('type NaturalWeapon struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tReach string `xml:"reach" json:"reach"`\n')
        f.write('\tDamage string `xml:"damage" json:"damage"`\n')
        f.write('\tAP string `xml:"ap" json:"ap"`\n')
        f.write('\tUseSkill string `xml:"useskill" json:"useskill"`\n')
        f.write('\tAccuracy string `xml:"accuracy" json:"accuracy"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate NaturalWeapons struct
        f.write('// NaturalWeapons represents a collection of natural weapons\n')
        f.write('type NaturalWeapons struct {\n')
        f.write('\tNaturalWeapon []NaturalWeapon `xml:"naturalweapon,omitempty" json:"naturalweapon,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Powers struct (for powers element - empty element)
        f.write('// Powers represents a collection of powers\n')
        f.write('type Powers struct {\n')
        f.write('\tPower []string `xml:"power,omitempty" json:"power,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Quality struct (main element)
        f.write('// Quality represents a quality definition\n')
        f.write('type Quality struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tKarma string `xml:"karma" json:"karma"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('\tAddQualities *AddQualities `xml:"addqualities,omitempty" json:"addqualities,omitempty"`\n')
        f.write('\tAddWeapon []string `xml:"addweapon,omitempty" json:"addweapon,omitempty"`\n')
        f.write('\tCanBuyWithSpellPoints *common.Boolean `xml:"canbuywithspellpoints,omitempty" json:"canbuywithspellpoints,omitempty"`\n')
        f.write('\tCareerOnly *string `xml:"careeronly,omitempty" json:"careeronly,omitempty"`\n')
        f.write('\tChargenLimit *string `xml:"chargenlimit,omitempty" json:"chargenlimit,omitempty"`\n')
        f.write('\tChargenOnly *string `xml:"chargenonly,omitempty" json:"chargenonly,omitempty"`\n')
        f.write('\tContributeToBP *string `xml:"contributetobp,omitempty" json:"contributetobp,omitempty"`\n')
        f.write('\tContributeToLimit *string `xml:"contributetolimit,omitempty" json:"contributetolimit,omitempty"`\n')
        f.write('\tCostDiscount *CostDiscount `xml:"costdiscount,omitempty" json:"costdiscount,omitempty"`\n')
        f.write('\tCritterPowers *CritterPowers `xml:"critterpowers,omitempty" json:"critterpowers,omitempty"`\n')
        f.write('\tDoubleCareer *string `xml:"doublecareer,omitempty" json:"doublecareer,omitempty"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tImplemented *string `xml:"implemented,omitempty" json:"implemented,omitempty"`\n')
        f.write('\tIncludeInLimit *IncludeInLimit `xml:"includeinlimit,omitempty" json:"includeinlimit,omitempty"`\n')
        f.write('\tLimit *string `xml:"limit,omitempty" json:"limit,omitempty"`\n')
        f.write('\tLimitWithInclusions *string `xml:"limitwithinclusions,omitempty" json:"limitwithinclusions,omitempty"`\n')
        f.write('\tMetagenic *string `xml:"metagenic,omitempty" json:"metagenic,omitempty"`\n')
        f.write('\tMutant *string `xml:"mutant,omitempty" json:"mutant,omitempty"`\n')
        f.write('\tNaturalWeapons *NaturalWeapons `xml:"naturalweapons,omitempty" json:"naturalweapons,omitempty"`\n')
        f.write('\tNoLevels *string `xml:"nolevels,omitempty" json:"nolevels,omitempty"`\n')
        f.write('\tOnlyPriorityGiven *string `xml:"onlyprioritygiven,omitempty" json:"onlyprioritygiven,omitempty"`\n')
        f.write('\tPowers *Powers `xml:"powers,omitempty" json:"powers,omitempty"`\n')
        f.write('\tPrint *string `xml:"print,omitempty" json:"print,omitempty"`\n')
        f.write('\tRefundKarmaOnRemove *string `xml:"refundkarmaonremove,omitempty" json:"refundkarmaonremove,omitempty"`\n')
        f.write('\tStagedPurchase *string `xml:"stagedpurchase,omitempty" json:"stagedpurchase,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tFirstLevelBonus *common.BaseBonus `xml:"firstlevelbonus,omitempty" json:"firstlevelbonus,omitempty"`\n')
        f.write('\tForbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('\tNameOnPage *string `xml:"nameonpage,omitempty" json:"nameonpage,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Qualities struct (container)
        f.write('// Qualities represents a collection of qualities\n')
        f.write('type Qualities struct {\n')
        f.write('\tQuality []Quality `xml:"quality,omitempty" json:"quality,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate QualitiesChummer struct (root element)
        f.write('// QualitiesChummer represents the root chummer element for qualities\n')
        f.write('type QualitiesChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tCategories []QualityCategories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tQualities []Qualities `xml:"qualities,omitempty" json:"qualities,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated qualities.go")

if __name__ == '__main__':
    print("Generating qualities from qualities.xsd...")
    generate_qualities()
    print("Done!")

