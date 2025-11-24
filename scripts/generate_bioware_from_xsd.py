#!/usr/bin/env python3
"""Generate bioware.go from bioware.xsd"""

import xml.etree.ElementTree as ET
import os

def generate_bioware():
    """Generate bioware.go from bioware.xsd"""
    
    tree = ET.parse('data/chummerxml/bioware.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/bioware.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains bioware structures generated from bioware.xsd\n\n')
        
        # Generate BiowareGrade struct (uses common.Grade structure)
        f.write('// BiowareGrade represents a bioware grade\n')
        f.write('type BiowareGrade struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tName *string `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('\tEss *string `xml:"ess,omitempty" json:"ess,omitempty"`\n')
        f.write('\tCost *string `xml:"cost,omitempty" json:"cost,omitempty"`\n')
        f.write('\tDeviceRating *int `xml:"devicerating,omitempty" json:"devicerating,omitempty"`\n')
        f.write('\tAvail *string `xml:"avail,omitempty" json:"avail,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate BiowareGrades struct
        f.write('// BiowareGrades represents a collection of bioware grades\n')
        f.write('type BiowareGrades struct {\n')
        f.write('\tGrade []BiowareGrade `xml:"grade,omitempty" json:"grade,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate BiowareCategory struct
        f.write('// BiowareCategory represents a bioware category\n')
        f.write('type BiowareCategory struct {\n')
        f.write('\tContent string `xml:",chardata" json:"+content,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate BiowareCategories struct
        f.write('// BiowareCategories represents a collection of bioware categories\n')
        f.write('type BiowareCategories struct {\n')
        f.write('\tCategory []BiowareCategory `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate BannedGrades struct
        f.write('// BiowareBannedGrades represents banned grades\n')
        f.write('type BiowareBannedGrades struct {\n')
        f.write('\tGrade []string `xml:"grade,omitempty" json:"grade,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate AllowSubsystems struct
        f.write('// BiowareAllowSubsystems represents allowed subsystems\n')
        f.write('type BiowareAllowSubsystems struct {\n')
        f.write('\tCategory []string `xml:"category,omitempty" json:"category,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate IncludePair struct
        f.write('// BiowareIncludePair represents an include pair\n')
        f.write('type BiowareIncludePair struct {\n')
        f.write('\tName []string `xml:"name,omitempty" json:"name,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate BiowareSubsystemCyberware struct (for subsystems/cyberware)
        f.write('// BiowareSubsystemCyberware represents a cyberware subsystem within bioware subsystems\n')
        f.write('type BiowareSubsystemCyberware struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tRating *int `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('\tForced *string `xml:"forced,omitempty" json:"forced,omitempty"`\n')
        f.write('\tSubsystems *BiowareSubsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`\n')
        f.write('\tGears *common.Gears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate BiowareSubsystemBioware struct (for subsystems/bioware)
        f.write('// BiowareSubsystemBioware represents a bioware subsystem within bioware subsystems\n')
        f.write('type BiowareSubsystemBioware struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tRating *int `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('\tForced *string `xml:"forced,omitempty" json:"forced,omitempty"`\n')
        f.write('\tSubsystems *BiowareSubsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`\n')
        f.write('\tGears *common.Gears `xml:"gears,omitempty" json:"gears,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate BiowareSubsystems struct (recursive reference)
        f.write('// BiowareSubsystems represents bioware subsystems (recursive)\n')
        f.write('type BiowareSubsystems struct {\n')
        f.write('\tCyberware []BiowareSubsystemCyberware `xml:"cyberware,omitempty" json:"cyberware,omitempty"`\n')
        f.write('\tBioware []BiowareSubsystemBioware `xml:"bioware,omitempty" json:"bioware,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate BiowareItem struct (for biowares/bioware)
        f.write('// BiowareItem represents a bioware item\n')
        f.write('type BiowareItem struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tLimit *string `xml:"limit,omitempty" json:"limit,omitempty"`\n')
        f.write('\tcommon.Visibility\n')
        f.write('\tMountsTo *string `xml:"mountsto,omitempty" json:"mountsto,omitempty"`\n')
        f.write('\tModularMount *string `xml:"modularmount,omitempty" json:"modularmount,omitempty"`\n')
        f.write('\tBlocksMounts *string `xml:"blocksmounts,omitempty" json:"blocksmounts,omitempty"`\n')
        f.write('\tBannedGrades *BiowareBannedGrades `xml:"bannedgrades,omitempty" json:"bannedgrades,omitempty"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tCategory string `xml:"category" json:"category"`\n')
        f.write('\tAddToParentCapacity *string `xml:"addtoparentcapacity,omitempty" json:"addtoparentcapacity,omitempty"`\n')
        f.write('\tEss string `xml:"ess" json:"ess"`\n')
        f.write('\tCapacity string `xml:"capacity" json:"capacity"`\n')
        f.write('\tAvail string `xml:"avail" json:"avail"`\n')
        f.write('\tCost string `xml:"cost" json:"cost"`\n')
        f.write('\tAddToParentEss *string `xml:"addtoparentess,omitempty" json:"addtoparentess,omitempty"`\n')
        f.write('\tRequireParent string `xml:"requireparent" json:"requireparent"`\n')
        f.write('\tAddWeapon []string `xml:"addweapon,omitempty" json:"addweapon,omitempty"`\n')
        f.write('\tAllowSubsystems *BiowareAllowSubsystems `xml:"allowsubsystems,omitempty" json:"allowsubsystems,omitempty"`\n')
        f.write('\tIncludePair *BiowareIncludePair `xml:"includepair,omitempty" json:"includepair,omitempty"`\n')
        f.write('\tBonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`\n')
        f.write('\tForbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`\n')
        f.write('\tForceGrade *string `xml:"forcegrade,omitempty" json:"forcegrade,omitempty"`\n')
        f.write('\tNotes *string `xml:"notes,omitempty" json:"notes,omitempty"`\n')
        f.write('\tRating *string `xml:"rating,omitempty" json:"rating,omitempty"`\n')
        f.write('\tRequired *common.Required `xml:"required,omitempty" json:"required,omitempty"`\n')
        f.write('\tSubsystems *BiowareSubsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`\n')
        f.write('\tcommon.SourceReference\n')
        f.write('}\n\n')
        
        # Generate BiowareItems struct
        f.write('// BiowareItems represents a collection of bioware items\n')
        f.write('type BiowareItems struct {\n')
        f.write('\tBioware []BiowareItem `xml:"bioware,omitempty" json:"bioware,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate BiowareChummer struct (root element)
        f.write('// BiowareChummer represents the root chummer element for bioware\n')
        f.write('type BiowareChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tGrades []BiowareGrades `xml:"grades,omitempty" json:"grades,omitempty"`\n')
        f.write('\tCategories []BiowareCategories `xml:"categories,omitempty" json:"categories,omitempty"`\n')
        f.write('\tBiowares []BiowareItems `xml:"biowares,omitempty" json:"biowares,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated bioware.go")

if __name__ == '__main__':
    print("Generating bioware from bioware.xsd...")
    generate_bioware()
    print("Done!")

