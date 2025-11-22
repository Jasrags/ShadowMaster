#!/usr/bin/env python3
"""Generate lifestyles.go from lifestyles.xsd"""

import xml.etree.ElementTree as ET
import os

def generate_lifestyles():
    """Generate lifestyles.go from lifestyles.xsd"""
    
    tree = ET.parse('data/chummerxml/lifestyles.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/lifestyles.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains lifestyle structures generated from lifestyles.xsd\n\n')
        
        # Generate LifestyleCategory struct
        f.write('// LifestyleCategory represents a lifestyle category\n')
        f.write('type LifestyleCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate LifestyleCategories struct
        f.write('// LifestyleCategories represents a collection of lifestyle categories\n')
        f.write('type LifestyleCategories struct {\n')
        f.write('\tCategory []LifestyleCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate FreeGrid struct
        f.write('// FreeGrid represents a free grid entry\n')
        f.write('type FreeGrid struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate FreeGrids struct
        f.write('// FreeGrids represents a collection of free grids\n')
        f.write('type FreeGrids struct {\n')
        f.write('\tFreeGrid []FreeGrid `xml:"freegrid,omitempty" json:"freegrid,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Lifestyle struct
        f.write('// Lifestyle represents a lifestyle definition\n')
        f.write('type Lifestyle struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('\tDice string `xml:"dice" json:"dice"`\n')
        f.write('\tFreeGrids *FreeGrids `xml:"freegrids,omitempty" json:"freegrids,omitempty"`\n')
        f.write('\tLP string `xml:"lp" json:"lp"`\n')
        f.write('\tCostForArea *int `xml:"costforarea,omitempty" json:"costforarea,omitempty"`\n')
        f.write('\tCostForComforts *int `xml:"costforcomforts,omitempty" json:"costforcomforts,omitempty"`\n')
        f.write('\tCostForSecurity *int `xml:"costforsecurity,omitempty" json:"costforsecurity,omitempty"`\n')
        f.write('\tAllowBonusLP *string `xml:"allowbonuslp,omitempty" json:"allowbonuslp,omitempty"`\n')
        f.write('\tMultiplier string `xml:"multiplier" json:"multiplier"`\n')
        f.write('\tIncrement *string `xml:"increment,omitempty" json:"increment,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate Lifestyles struct
        f.write('// Lifestyles represents a collection of lifestyles\n')
        f.write('type Lifestyles struct {\n')
        f.write('\tLifestyle []Lifestyle `xml:"lifestyle,omitempty" json:"lifestyle,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Comfort struct
        f.write('// Comfort represents a comfort entry\n')
        f.write('type Comfort struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tMinimum int `xml:"minimum" json:"minimum"`\n')
        f.write('\tLimit *int `xml:"limit,omitempty" json:"limit,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Comforts struct
        f.write('// Comforts represents a collection of comforts\n')
        f.write('type Comforts struct {\n')
        f.write('\tComfort []Comfort `xml:"comfort" json:"comfort"`\n')
        f.write('}\n\n')
        
        # Generate Entertainment struct
        f.write('// Entertainment represents an entertainment entry\n')
        f.write('type Entertainment struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tMinimum int `xml:"minimum" json:"minimum"`\n')
        f.write('\tLimit *int `xml:"limit,omitempty" json:"limit,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Entertainments struct
        f.write('// Entertainments represents a collection of entertainments\n')
        f.write('type Entertainments struct {\n')
        f.write('\tEntertainment []Entertainment `xml:"entertainment" json:"entertainment"`\n')
        f.write('}\n\n')
        
        # Generate Necessity struct
        f.write('// Necessity represents a necessity entry\n')
        f.write('type Necessity struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tMinimum int `xml:"minimum" json:"minimum"`\n')
        f.write('\tLimit *int `xml:"limit,omitempty" json:"limit,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Necessities struct
        f.write('// Necessities represents a collection of necessities\n')
        f.write('type Necessities struct {\n')
        f.write('\tNecessity []Necessity `xml:"necessity" json:"necessity"`\n')
        f.write('}\n\n')
        
        # Generate Neighborhood struct
        f.write('// Neighborhood represents a neighborhood entry\n')
        f.write('type Neighborhood struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tMinimum int `xml:"minimum" json:"minimum"`\n')
        f.write('\tLimit *int `xml:"limit,omitempty" json:"limit,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Neighborhoods struct
        f.write('// Neighborhoods represents a collection of neighborhoods\n')
        f.write('type Neighborhoods struct {\n')
        f.write('\tNeighborhood []Neighborhood `xml:"neighborhood" json:"neighborhood"`\n')
        f.write('}\n\n')
        
        # Generate Security struct
        f.write('// Security represents a security entry\n')
        f.write('type Security struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tMinimum int `xml:"minimum" json:"minimum"`\n')
        f.write('\tLimit *int `xml:"limit,omitempty" json:"limit,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Securities struct
        f.write('// Securities represents a collection of securities\n')
        f.write('type Securities struct {\n')
        f.write('\tSecurity []Security `xml:"security" json:"security"`\n')
        f.write('}\n\n')
        
        # Generate SelectText struct (for lifestyle quality bonus)
        f.write('// LifestyleSelectText represents a selecttext element\n')
        f.write('type LifestyleSelectText struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tXML *string `xml:"xml,attr,omitempty" json:"+@xml,omitempty"`\n')
        f.write('\tXPath *string `xml:"xpath,attr,omitempty" json:"+@xpath,omitempty"`\n')
        f.write('\tAllowEdit *string `xml:"allowedit,attr,omitempty" json:"+@allowedit,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate LifestyleQualityBonus struct
        f.write('// LifestyleQualityBonus represents a lifestyle quality bonus\n')
        f.write('type LifestyleQualityBonus struct {\n')
        f.write('\tSelectText []LifestyleSelectText `xml:"selecttext,omitempty" json:"selecttext,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate LifestyleQuality struct
        f.write('// LifestyleQuality represents a lifestyle quality\n')
        f.write('type LifestyleQuality struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tLP int `xml:"lp" json:"lp"`\n')
        f.write('\tCost *string `xml:"cost,omitempty" json:"cost,omitempty"`\n')
        f.write('\tBonus *LifestyleQualityBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tMultiplier *int `xml:"multiplier,omitempty" json:"multiplier,omitempty"`\n')
        f.write('\tMultiplierBaseOnly *int `xml:"multiplierbaseonly,omitempty" json:"multiplierbaseonly,omitempty"`\n')
        f.write('\tAreaMaximum *int `xml:"areamaximum,omitempty" json:"areamaximum,omitempty"`\n')
        f.write('\tComfortsMaximum *int `xml:"comfortsmaximum,omitempty" json:"comfortsmaximum,omitempty"`\n')
        f.write('\tSecurityMaximum *int `xml:"securitymaximum,omitempty" json:"securitymaximum,omitempty"`\n')
        f.write('\tAreaMinimum *int `xml:"areaminimum,omitempty" json:"areaminimum,omitempty"`\n')
        f.write('\tComfortsMinimum *int `xml:"comfortsminimum,omitempty" json:"comfortsminimum,omitempty"`\n')
        f.write('\tSecurityMinimum *int `xml:"securityminimum,omitempty" json:"securityminimum,omitempty"`\n')
        f.write('\tArea *int `xml:"area,omitempty" json:"area,omitempty"`\n')
        f.write('\tComforts *int `xml:"comforts,omitempty" json:"comforts,omitempty"`\n')
        f.write('\tSecurity *int `xml:"security,omitempty" json:"security,omitempty"`\n')
        f.write('\tAllowed *string `xml:"allowed,omitempty" json:"allowed,omitempty"`\n')
        f.write('\tAllowMultiple *string `xml:"allowmultiple,omitempty" json:"allowmultiple,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('\tForbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate LifestyleQualities struct
        f.write('// LifestyleQualities represents a collection of lifestyle qualities\n')
        f.write('type LifestyleQualities struct {\n')
        f.write('\tQuality []LifestyleQuality `xml:"quality" json:"quality"`\n')
        f.write('}\n\n')
        
        # Generate LifestyleCost struct
        f.write('// LifestyleCost represents a lifestyle cost entry\n')
        f.write('type LifestyleCost struct {\n')
        f.write('\tLP string `xml:"lp" json:"lp"`\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('}\n\n')
        
        # Generate LifestyleCosts struct
        f.write('// LifestyleCosts represents a collection of lifestyle costs\n')
        f.write('type LifestyleCosts struct {\n')
        f.write('\tCost []LifestyleCost `xml:"cost" json:"cost"`\n')
        f.write('}\n\n')
        
        # Generate SafehouseCost struct
        f.write('// SafehouseCost represents a safehouse cost entry\n')
        f.write('type SafehouseCost struct {\n')
        f.write('\tLP string `xml:"lp" json:"lp"`\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('}\n\n')
        
        # Generate SafehouseCosts struct
        f.write('// SafehouseCosts represents a collection of safehouse costs\n')
        f.write('type SafehouseCosts struct {\n')
        f.write('\tCost []SafehouseCost `xml:"cost" json:"cost"`\n')
        f.write('}\n\n')
        
        # Generate Borough struct
        f.write('// Borough represents a borough entry\n')
        f.write('type Borough struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tSecRating *string `xml:"secRating,omitempty" json:"secRating,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate District struct
        f.write('// District represents a district entry\n')
        f.write('type District struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tBorough []Borough `xml:"borough,omitempty" json:"borough,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate City struct
        f.write('// City represents a city entry\n')
        f.write('type City struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tDistrict []District `xml:"district,omitempty" json:"district,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Cities struct
        f.write('// Cities represents a collection of cities\n')
        f.write('type Cities struct {\n')
        f.write('\tCity []City `xml:"city" json:"city"`\n')
        f.write('}\n\n')
        
        # Generate LifestylesChummer struct (root element)
        f.write('// LifestylesChummer represents the root chummer element for lifestyles\n')
        f.write('type LifestylesChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tCategories []LifestyleCategories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tLifestyles *Lifestyles `xml:"lifestyles,omitempty" json:"lifestyles,omitempty"`\n')
        f.write('\tComforts *Comforts `xml:"comforts,omitempty" json:"comforts,omitempty"`\n')
        f.write('\tEntertainments *Entertainments `xml:"entertainments,omitempty" json:"entertainments,omitempty"`\n')
        f.write('\tNecessities *Necessities `xml:"necessities,omitempty" json:"necessities,omitempty"`\n')
        f.write('\tNeighborhoods *Neighborhoods `xml:"neighborhoods,omitempty" json:"neighborhoods,omitempty"`\n')
        f.write('\tSecurities *Securities `xml:"securities,omitempty" json:"securities,omitempty"`\n')
        f.write('\tQualities *LifestyleQualities `xml:"qualities,omitempty" json:"qualities,omitempty"`\n')
        f.write('\tCosts *LifestyleCosts `xml:"costs,omitempty" json:"costs,omitempty"`\n')
        f.write('\tSafehouseCosts *SafehouseCosts `xml:"safehousecosts,omitempty" json:"safehousecosts,omitempty"`\n')
        f.write('\tCities *Cities `xml:"cities,omitempty" json:"cities,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated lifestyles.go")

if __name__ == '__main__':
    print("Generating lifestyles from lifestyles.xsd...")
    generate_lifestyles()
    print("Done!")

