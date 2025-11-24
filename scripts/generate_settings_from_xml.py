#!/usr/bin/env python3
"""Generate settings.go from settings.xml"""

import xml.etree.ElementTree as ET
import os
import re

def to_go_name(name):
    """Convert XML name to Go name"""
    # Capitalize first letter and handle camelCase
    parts = re.split(r'[-_\s]', name)
    return ''.join(word.capitalize() for word in parts)

def get_go_type(value_text):
    """Determine Go type from value text"""
    if value_text is None or value_text.strip() == '':
        return '*string'
    
    value = value_text.strip()
    
    # Check for boolean
    if value.lower() in ('true', 'false'):
        return 'bool'
    
    # Check for integer
    try:
        int(value)
        return 'int'
    except ValueError:
        pass
    
    # Check for float
    try:
        float(value)
        return 'float64'
    except ValueError:
        pass
    
    # Default to string
    return 'string'

def generate_settings():
    """Generate settings.go from settings.xml"""
    
    tree = ET.parse('data/chummerxml/settings.xml')
    root = tree.getroot()
    
    # Collect all unique field names and their types from all settings
    field_types = {}
    settings_elem = root.find('settings')
    
    if settings_elem is not None:
        for setting in settings_elem.findall('setting'):
            for child in setting:
                tag = child.tag
                if tag not in field_types:
                    # Determine type from first occurrence
                    go_type = get_go_type(child.text)
                    field_types[tag] = go_type
                elif field_types[tag] == 'bool' and get_go_type(child.text) != 'bool':
                    # If we see a non-bool value, it might be string
                    field_types[tag] = 'string'
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/settings.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('// This file contains setting structures generated from settings.xml\n\n')
        
        # Generate KarmaCost struct
        f.write('// KarmaCost represents karma costs for various actions\n')
        f.write('type KarmaCost struct {\n')
        f.write('\tKarmaAttribute *int `xml:"karmaattribute,omitempty" json:"karmaattribute,omitempty"`\n')
        f.write('\tKarmaQuality *int `xml:"karmaquality,omitempty" json:"karmaquality,omitempty"`\n')
        f.write('\tKarmaSpecialization *int `xml:"karmaspecialization,omitempty" json:"karmaspecialization,omitempty"`\n')
        f.write('\tKarmaKnoSpecialization *int `xml:"karmaknospecialization,omitempty" json:"karmaknospecialization,omitempty"`\n')
        f.write('\tKarmaNewKnowledgeSkill *int `xml:"karmanewknowledgeskill,omitempty" json:"karmanewknowledgeskill,omitempty"`\n')
        f.write('\tKarmaNewActiveSkill *int `xml:"karmanewactiveskill,omitempty" json:"karmanewactiveskill,omitempty"`\n')
        f.write('\tKarmaNewSkillGroup *int `xml:"karmanewskillgroup,omitempty" json:"karmanewskillgroup,omitempty"`\n')
        f.write('\tKarmaImproveKnowledgeSkill *int `xml:"karmaimproveknowledgeskill,omitempty" json:"karmaimproveknowledgeskill,omitempty"`\n')
        f.write('\tKarmaImproveActiveSkill *int `xml:"karmaimproveactiveskill,omitempty" json:"karmaimproveactiveskill,omitempty"`\n')
        f.write('\tKarmaImproveSkillGroup *int `xml:"karmaimproveskillgroup,omitempty" json:"karmaimproveskillgroup,omitempty"`\n')
        f.write('\tKarmaSpell *int `xml:"karmaspell,omitempty" json:"karmaspell,omitempty"`\n')
        f.write('\tKarmaEnhancement *int `xml:"karmaenhancement,omitempty" json:"karmaenhancement,omitempty"`\n')
        f.write('\tKarmaNewComplexForm *int `xml:"karmanewcomplexform,omitempty" json:"karmanewcomplexform,omitempty"`\n')
        f.write('\tKarmaImproveComplexForm *int `xml:"karmaimprovecomplexform,omitempty" json:"karmaimprovecomplexform,omitempty"`\n')
        f.write('\tKarmaNewAIProgram *int `xml:"karmanewaiprogram,omitempty" json:"karmanewaiprogram,omitempty"`\n')
        f.write('\tKarmaNewAIAdvancedProgram *int `xml:"karmanewaiadvancedprogram,omitempty" json:"karmanewaiadvancedprogram,omitempty"`\n')
        f.write('\tKarmaContact *int `xml:"karmacontact,omitempty" json:"karmacontact,omitempty"`\n')
        f.write('\tKarmaEnemy *int `xml:"karmaenemy,omitempty" json:"karmaenemy,omitempty"`\n')
        f.write('\tKarmaCarryOver *int `xml:"karmacarryover,omitempty" json:"karmacarryover,omitempty"`\n')
        f.write('\tKarmaSpirit *int `xml:"karmaspirit,omitempty" json:"karmaspirit,omitempty"`\n')
        f.write('\tKarmaManeuver *int `xml:"karmamaneuver,omitempty" json:"karmamaneuver,omitempty"`\n')
        f.write('\tKarmaInitiation *int `xml:"karmainitiation,omitempty" json:"karmainitiation,omitempty"`\n')
        f.write('\tKarmaInitiationFlat *int `xml:"karmainitiationflat,omitempty" json:"karmainitiationflat,omitempty"`\n')
        f.write('\tKarmaMetamagic *int `xml:"karmametamagic,omitempty" json:"karmametamagic,omitempty"`\n')
        f.write('\tKarmaComplexFormOption *int `xml:"karmacomplexformoption,omitempty" json:"karmacomplexformoption,omitempty"`\n')
        f.write('\tKarmaComplexFormSkillSoft *int `xml:"karmacomplexformskillsoft,omitempty" json:"karmacomplexformskillsoft,omitempty"`\n')
        f.write('\tKarmaJoinGroup *int `xml:"karmajoingroup,omitempty" json:"karmajoingroup,omitempty"`\n')
        f.write('\tKarmaLeaveGroup *int `xml:"karmaleavegroup,omitempty" json:"karmaleavegroup,omitempty"`\n')
        f.write('\tKarmaAlchemicalFocus *int `xml:"karmaalchemicalfocus,omitempty" json:"karmaalchemicalfocus,omitempty"`\n')
        f.write('\tKarmaBanishingFocus *int `xml:"karmabanishingfocus,omitempty" json:"karmabanishingfocus,omitempty"`\n')
        f.write('\tKarmaBindingFocus *int `xml:"karmabindingfocus,omitempty" json:"karmabindingfocus,omitempty"`\n')
        f.write('\tKarmaCenteringFocus *int `xml:"karmacenteringfocus,omitempty" json:"karmacenteringfocus,omitempty"`\n')
        f.write('\tKarmaCounterspellingFocus *int `xml:"karmacounterspellingfocus,omitempty" json:"karmacounterspellingfocus,omitempty"`\n')
        f.write('\tKarmaDisenchantingFocus *int `xml:"karmadisenchantingfocus,omitempty" json:"karmadisenchantingfocus,omitempty"`\n')
        f.write('\tKarmaFlexibleSignatureFocus *int `xml:"karmaflexiblesignaturefocus,omitempty" json:"karmaflexiblesignaturefocus,omitempty"`\n')
        f.write('\tKarmaMaskingFocus *int `xml:"karmamaskingfocus,omitempty" json:"karmamaskingfocus,omitempty"`\n')
        f.write('\tKarmaPowerFocus *int `xml:"karmapowerfocus,omitempty" json:"karmapowerfocus,omitempty"`\n')
        f.write('\tKarmaQIFocus *int `xml:"karmaqifocus,omitempty" json:"karmaqifocus,omitempty"`\n')
        f.write('\tKarmaRitualSpellcastingFocus *int `xml:"karmaritualspellcastingfocus,omitempty" json:"karmaritualspellcastingfocus,omitempty"`\n')
        f.write('\tKarmaSpellcastingFocus *int `xml:"karmaspellcastingfocus,omitempty" json:"karmaspellcastingfocus,omitempty"`\n')
        f.write('\tKarmaSpellshapingFocus *int `xml:"karmaspellshapingfocus,omitempty" json:"karmaspellshapingfocus,omitempty"`\n')
        f.write('\tKarmaSummoningFocus *int `xml:"karmasummoningfocus,omitempty" json:"karmasummoningfocus,omitempty"`\n')
        f.write('\tKarmaSustainingFocus *int `xml:"karmasustainingfocus,omitempty" json:"karmasustainingfocus,omitempty"`\n')
        f.write('\tKarmaWeaponFocus *int `xml:"karmaweaponfocus,omitempty" json:"karmaweaponfocus,omitempty"`\n')
        f.write('\tKarmaMysadPP *int `xml:"karmamysadpp,omitempty" json:"karmamysadpp,omitempty"`\n')
        f.write('\tKarmaSpiritFettering *int `xml:"karmaspiritfettering,omitempty" json:"karmaspiritfettering,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Books struct
        f.write('// SettingBooks represents a collection of books for a setting\n')
        f.write('type SettingBooks struct {\n')
        f.write('\tBook []string `xml:"book,omitempty" json:"book,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate BannedWareGrades struct
        f.write('// BannedWareGrades represents a collection of banned ware grades\n')
        f.write('type BannedWareGrades struct {\n')
        f.write('\tGrade []string `xml:"grade,omitempty" json:"grade,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate RedlineExclusion struct
        f.write('// RedlineExclusion represents a collection of excluded limbs for redliner\n')
        f.write('type RedlineExclusion struct {\n')
        f.write('\tLimb []string `xml:"limb,omitempty" json:"limb,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Setting struct with all fields
        # Sort fields for consistency
        sorted_fields = sorted(field_types.items())
        
        f.write('// Setting represents a game setting definition\n')
        f.write('type Setting struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tGameplayOptionName string `xml:"gameplayoptionname" json:"gameplayoptionname"`\n')
        
        # Write all other fields
        for tag, go_type in sorted_fields:
            if tag not in ('id', 'name', 'gameplayoptionname', 'karmacost', 'books', 'bannedwaregrades', 'redlinerexclusion'):
                go_name = to_go_name(tag)
                optional = 'omitempty' if go_type.startswith('*') else ''
                if not optional and go_type != 'bool' and go_type != 'int' and go_type != 'float64':
                    optional = 'omitempty'
                    if not go_type.startswith('*'):
                        go_type = '*' + go_type
                xml_tag = tag
                f.write(f'\t{go_name} {go_type} `xml:"{xml_tag},{optional}" json:"{xml_tag},{optional}"`\n')
        
        # Add nested structures
        f.write('\tKarmaCost *KarmaCost `xml:"karmacost,omitempty" json:"karmacost,omitempty"`\n')
        f.write('\tBooks *SettingBooks `xml:"books,omitempty" json:"books,omitempty"`\n')
        f.write('\tBannedWareGrades *BannedWareGrades `xml:"bannedwaregrades,omitempty" json:"bannedwaregrades,omitempty"`\n')
        f.write('\tRedlineExclusion *RedlineExclusion `xml:"redlinerexclusion,omitempty" json:"redlinerexclusion,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Settings struct
        f.write('// Settings represents a collection of settings\n')
        f.write('type Settings struct {\n')
        f.write('\tSetting []Setting `xml:"setting" json:"setting"`\n')
        f.write('}\n\n')
        
        # Generate SettingsChummer struct (root element)
        f.write('// SettingsChummer represents the root chummer element for settings\n')
        f.write('type SettingsChummer struct {\n')
        f.write('\tSettings Settings `xml:"settings" json:"settings"`\n')
        f.write('}\n\n')
    
    print("Generated settings.go")

if __name__ == '__main__':
    print("Generating settings from settings.xml...")
    generate_settings()
    print("Done!")

