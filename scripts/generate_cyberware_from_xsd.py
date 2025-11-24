#!/usr/bin/env python3
"""Generate cyberware.go from cyberware.xsd"""

import xml.etree.ElementTree as ET
import re
import os

NS = {'xs': 'http://www.w3.org/2001/XMLSchema'}

def generate_cyberware():
    """Generate cyberware.go from cyberware.xsd"""
    
    tree = ET.parse('data/chummerxml/cyberware.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/cyberware.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains cyberware structures generated from cyberware.xsd\n\n')
        
        # Generate CyberwareCategory struct
        f.write('// CyberwareCategory represents a cyberware category\n')
        f.write('type CyberwareCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tShow *string `xml:"show,attr,omitempty" json:"+@show,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CyberwareCategories struct
        f.write('// CyberwareCategories represents a collection of cyberware categories\n')
        f.write('type CyberwareCategories struct {\n')
        f.write('\tCategory []CyberwareCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CyberwareGrade struct (uses common.Grade structure)
        f.write('// CyberwareGrade represents a cyberware grade\n')
        f.write('type CyberwareGrade struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName *string `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('\tEss *string `xml:"ess,omitempty" json:"ess,omitempty"`\n')
        f.write('\tCost *string `xml:"cost,omitempty" json:"cost,omitempty"`\n')
        f.write('\tDeviceRating *int `xml:"devicerating,omitempty" json:"devicerating,omitempty"`\n')
        f.write('\tAvail *string `xml:"avail,omitempty" json:"avail,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate CyberwareGrades struct
        f.write('// CyberwareGrades represents a collection of cyberware grades\n')
        f.write('type CyberwareGrades struct {\n')
        f.write('\tGrade []CyberwareGrade `xml:"grade,omitempty" json:"grade,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate AllowGear struct
        f.write('// AllowGear represents allowed gear categories\n')
        f.write('type AllowGear struct {\n')
        f.write('\tGearCategory []string `xml:"gearcategory,omitempty" json:"gearcategory,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate AllowSubsystems struct
        f.write('// AllowSubsystems represents allowed subsystems\n')
        f.write('type AllowSubsystems struct {\n')
        f.write('\tCategory []string `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate IncludePair struct
        f.write('// IncludePair represents an include pair\n')
        f.write('type IncludePair struct {\n')
        f.write('\tName []string `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate BannedGrades struct
        f.write('// BannedGrades represents banned grades\n')
        f.write('type BannedGrades struct {\n')
        f.write('\tGrade []string `xml:"grade,omitempty" json:"grade,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CyberwareSubsystem struct (for subsystems reference)
        f.write('// CyberwareSubsystem represents a subsystem within cyberware\n')
        f.write('type CyberwareSubsystem struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tRating *int `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('\tForced *string `xml:"forced,omitempty" json:"forced,omitempty"`\n')
        f.write('\tSubsystems *CyberwareSubsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`\n')
        f.write('\tGears *common.Gears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate BiowareSubsystem struct (for subsystems reference)
        f.write('// BiowareSubsystem represents a bioware subsystem within cyberware subsystems\n')
        f.write('type BiowareSubsystem struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tRating *int `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('\tForced *string `xml:"forced,omitempty" json:"forced,omitempty"`\n')
        f.write('\tSubsystems *CyberwareSubsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`\n')
        f.write('\tGears *common.Gears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CyberwareSubsystems struct (recursive reference)
        f.write('// CyberwareSubsystems represents subsystems (can contain cyberware or bioware)\n')
        f.write('type CyberwareSubsystems struct {\n')
        f.write('\tCyberware []CyberwareSubsystem `xml:"cyberware,omitempty" json:"cyberware,omitempty"`\n')
        f.write('\tBioware []BiowareSubsystem `xml:"bioware,omitempty" json:"bioware,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CyberwareName struct (for cyberwares reference)
        f.write('// CyberwareName represents a cyberware name with optional attributes\n')
        f.write('type CyberwareName struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('\tSelect *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CyberwareItem struct (for cyberwares reference - recursive)
        f.write('// CyberwareItem represents a cyberware item within a cyberwares container\n')
        f.write('type CyberwareItem struct {\n')
        f.write('\tName CyberwareName `xml:"name" json:"name"`\n')
        f.write('\tHide *string `xml:"hide,omitempty" json:"hide,omitempty"`\n')
        f.write('\tRating *int `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('\tCyberwares *CyberwaresContainer `xml:"cyberwares,omitempty" json:"cyberwares,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate CyberwaresContainer struct (for cyberwares reference - recursive)
        f.write('// CyberwaresContainer represents a recursive cyberwares container\n')
        f.write('type CyberwaresContainer struct {\n')
        f.write('\tCyberware []CyberwareItem `xml:"cyberware" json:"cyberware"`\n')
        f.write('}\n\n')
        
        # Generate Cyberware struct (main element)
        f.write('// Cyberware represents a cyberware definition\n')
        f.write('type Cyberware struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tEss string `xml:"ess" json:"ess"`\n')
        f.write('\tCapacity string `xml:"capacity" json:"capacity"`\n')
        f.write('\tAvail string `xml:"avail" json:"avail"`\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('\tRequireParent string `xml:"requireparent" json:"requireparent"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('\tLimit *string `xml:"limit,omitempty" json:"limit,omitempty"`\n')
        f.write('\tAddToParentCapacity *string `xml:"addtoparentcapacity,omitempty" json:"addtoparentcapacity,omitempty"`\n')
        f.write('\tAddVehicle []string `xml:"addvehicle,omitempty" json:"addvehicle,omitempty"`\n')
        f.write('\tAddWeapon []string `xml:"addweapon,omitempty" json:"addweapon,omitempty"`\n')
        f.write('\tAllowGear *AllowGear `xml:"allowgear,omitempty" json:"allowgear,omitempty"`\n')
        f.write('\tAllowSubsystems *AllowSubsystems `xml:"allowsubsystems,omitempty" json:"allowsubsystems,omitempty"`\n')
        f.write('\tIncludePair *IncludePair `xml:"includepair,omitempty" json:"includepair,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tForbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`\n')
        f.write('\tForceGrade *string `xml:"forcegrade,omitempty" json:"forcegrade,omitempty"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tMountsTo *string `xml:"mountsto,omitempty" json:"mountsto,omitempty"`\n')
        f.write('\tModularMount *string `xml:"modularmount,omitempty" json:"modularmount,omitempty"`\n')
        f.write('\tBlocksMounts *string `xml:"blocksmounts,omitempty" json:"blocksmounts,omitempty"`\n')
        f.write('\tAddToParentEss *string `xml:"addtoparentess,omitempty" json:"addtoparentess,omitempty"`\n')
        f.write('\tBannedGrades *BannedGrades `xml:"bannedgrades,omitempty" json:"bannedgrades,omitempty"`\n')
        f.write('\tInheritAttributes *string `xml:"inheritattributes,omitempty" json:"inheritattributes,omitempty"`\n')
        f.write('\tLimbSlot *string `xml:"limbslot,omitempty" json:"limbslot,omitempty"`\n')
        f.write('\tLimbSlotCount *string `xml:"limbslotcount,omitempty" json:"limbslotcount,omitempty"`\n')
        f.write('\tMinAgility *int `xml:"minagility,omitempty" json:"minagility,omitempty"`\n')
        f.write('\tMinStrength *int `xml:"minstrength,omitempty" json:"minstrength,omitempty"`\n')
        f.write('\tMinRating *string `xml:"minrating,omitempty" json:"minrating,omitempty"`\n')
        f.write('\tNotes *string `xml:"notes,omitempty" json:"notes,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('\tSubsystems *CyberwareSubsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`\n')
        f.write('\tGears *common.Gears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Cyberwares struct (container)
        f.write('// Cyberwares represents a collection of cyberware\n')
        f.write('type Cyberwares struct {\n')
        f.write('\tCyberware []Cyberware `xml:"cyberware,omitempty" json:"cyberware,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Suite struct
        f.write('// Suite represents a cyberware suite\n')
        f.write('type Suite struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tGrade string `xml:"grade" json:"grade"`\n')
        f.write('\tHide *string `xml:"hide,omitempty" json:"hide,omitempty"`\n')
        f.write('\tCyberwares CyberwaresContainer `xml:"cyberwares" json:"cyberwares"`\n')
        f.write('}\n\n')
        
        # Generate Suites struct
        f.write('// Suites represents a collection of cyberware suites\n')
        f.write('type Suites struct {\n')
        f.write('\tSuite []Suite `xml:"suite" json:"suite"`\n')
        f.write('}\n\n')
        
        # Generate CyberwareChummer struct (root element)
        f.write('// CyberwareChummer represents the root chummer element for cyberware\n')
        f.write('type CyberwareChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tGrades []CyberwareGrades `xml:"grades,omitempty" json:"grades,omitempty"`\n')
        f.write('\tCategories []CyberwareCategories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tCyberwares *Cyberwares `xml:"cyberwares,omitempty" json:"cyberwares,omitempty"`\n')
        f.write('\tSuites *Suites `xml:"suites,omitempty" json:"suites,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated cyberware.go")

if __name__ == '__main__':
    print("Generating cyberware from cyberware.xsd...")
    generate_cyberware()
    print("Done!")

