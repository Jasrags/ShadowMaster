#!/usr/bin/env python3
import json
import re

def to_snake_case(name):
    """Convert name to lowercase with underscores"""
    # Remove special characters except spaces and hyphens
    name = re.sub(r'[^\w\s-]', '', name)
    # Replace spaces and hyphens with underscores
    name = re.sub(r'[-\s]+', '_', name)
    # Convert to lowercase and strip underscores
    return name.lower().strip('_')

def convert_value(value, field_name):
    """Convert JSON value to Go value"""
    if value is None:
        return "nil"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int):
        return str(value)
    if isinstance(value, str):
        # Escape quotes
        return f'"{value.replace('"', '\\"')}"'
    if isinstance(value, list):
        items = [convert_value(item, field_name) for item in value]
        brace_open = '{'
        brace_close = '}'
        return f"[]string{brace_open}{', '.join(items)}{brace_close}"
    if isinstance(value, dict):
        return convert_dict_to_go(value, field_name)
    return str(value)

def convert_dict_to_go(d, context=""):
    """Convert a dictionary to Go struct initialization"""
    if not d:
        return "nil"
    
    # Handle LimitModifier (from common package)
    if 'limit' in d and 'value' in d and 'condition' in d:
        return f"&common.LimitModifier{{\n\t\t\t\tLimit: {convert_value(d.get('limit'), 'limit')}, Value: {convert_value(d.get('value'), 'value')}, Condition: {convert_value(d.get('condition'), 'condition')},\n\t\t\t}}"
    
    # Handle SkillCategoryBonus (for qualities, similar to bioware - pointer type)
    if 'name' in d and 'bonus' in d and context == "skillcategory":
        bonus_val = convert_value(d.get('bonus'), 'bonus')
        return f"&BiowareSkillCategoryBonus{{\n\t\t\t\tName: {convert_value(d.get('name'), 'name')}, Bonus: {bonus_val},\n\t\t\t}}"
    
    # Handle SpecificSkillBonus (from common package, value not pointer)
    if 'name' in d and 'bonus' in d and context == "specificskill":
        bonus_val = d.get('bonus')
        if isinstance(bonus_val, str) and bonus_val.isdigit():
            bonus_val = int(bonus_val)
        else:
            bonus_val = convert_value(bonus_val, 'bonus')
        return f"common.SpecificSkillBonus{{\n\t\t\t\tName: {convert_value(d.get('name'), 'name')}, Bonus: {bonus_val},\n\t\t\t}}"
    
    # Handle SkillGroupBonus (from common package)
    if 'name' in d and 'bonus' in d and context == "skillgroup":
        return f"&common.SkillGroupBonus{{\n\t\t\t\tName: {convert_value(d.get('name'), 'name')}, Bonus: {convert_value(d.get('bonus'), 'bonus')}, Condition: {convert_value(d.get('condition', ''), 'condition')},\n\t\t\t}}"
    
    # Handle SpecificAttributeBonus (from common package)
    if 'name' in d and 'val' in d and context == "specificattribute":
        parts = [f"Name: {convert_value(d.get('name'), 'name')}", f"Val: {convert_value(d.get('val'), 'val')}"]
        if 'max' in d:
            parts.append(f"Max: {convert_value(d.get('max'), 'max')}")
        return f"&common.SpecificAttributeBonus{{\n\t\t\t\t\t{', '.join(parts)},\n\t\t\t\t}}"
    
    # Handle SelectSkill (from common package)
    if ('val' in d or 'max' in d) and context in ["selectskill", "selectattributes"]:
        parts = []
        if 'val' in d:
            parts.append(f"Val: {convert_value(d.get('val'), 'val')}")
        if 'max' in d:
            parts.append(f"Max: {convert_value(d.get('max'), 'max')}")
        if '+@limittoattribute' in d:
            parts.append(f"LimitToAttribute: {convert_value(d.get('+@limittoattribute'), 'limittoattribute')}")
        if '+@maximumrating' in d:
            parts.append(f"MaximumRating: {convert_value(d.get('+@maximumrating'), 'maximumrating')}")
        if '+@knowledgeskills' in d:
            parts.append(f"KnowledgeSkills: {convert_value(d.get('+@knowledgeskills'), 'knowledgeskills')}")
        if 'applytorating' in d:
            parts.append(f"ApplyToRating: {convert_value(d.get('applytorating'), 'applytorating')}")
        if 'excludeattribute' in d:
            ex_attr = d.get('excludeattribute')
            if isinstance(ex_attr, list):
                # Convert list to comma-separated string
                parts.append(f"ExcludeAttribute: {convert_value(', '.join(ex_attr), 'excludeattribute')}")
            else:
                parts.append(f"ExcludeAttribute: {convert_value(ex_attr, 'excludeattribute')}")
        return f"&common.SelectSkill{{\n\t\t\t\t\t{', '.join(parts)},\n\t\t\t\t}}"
    
    # Handle SkillAttributeBonus (from common package)
    if 'name' in d and 'bonus' in d and context == "skillattribute":
        parts = [f"Name: {convert_value(d.get('name'), 'name')}", f"Bonus: {convert_value(d.get('bonus'), 'bonus')}"]
        if 'condition' in d:
            parts.append(f"Condition: {convert_value(d.get('condition'), 'condition')}")
        return f"&common.SkillAttributeBonus{{\n\t\t\t\t\t\t{', '.join(parts)},\n\t\t\t\t\t}}"
    
    # Handle ConditionMonitorBonus (from common package)
    if 'sharedthresholdoffset' in d or 'thresholdoffset' in d:
        parts = []
        if 'sharedthresholdoffset' in d:
            parts.append(f"SharedThresholdOffset: {convert_value(d.get('sharedthresholdoffset'), 'sharedthresholdoffset')}")
        if 'thresholdoffset' in d:
            parts.append(f"ThresholdOffset: {convert_value(d.get('thresholdoffset'), 'thresholdoffset')}")
        return f"&common.ConditionMonitorBonus{{\n\t\t\t\t\t{', '.join(parts)},\n\t\t\t\t}}"
    
    # Handle InitiativeBonus (from common package)
    if '+content' in d and '+@precedence' in d and context == "initiative":
        return f"&common.InitiativeBonus{{\n\t\t\t\t\tContent: {convert_value(d.get('+content'), 'content')}, Precedence: {convert_value(d.get('+@precedence'), 'precedence')},\n\t\t\t\t}}"
    
    # Handle InitiativePassBonus (from common package)
    if '+content' in d and '+@precedence' in d and context == "initiativepass":
        return f"&common.InitiativePassBonus{{\n\t\t\t\t\tContent: {convert_value(d.get('+content'), 'content')}, Precedence: {convert_value(d.get('+@precedence'), 'precedence')},\n\t\t\t\t}}"
    
    # Handle ArmorBonus (from common package)
    if '+content' in d and '+@group' in d:
        return f"&common.ArmorBonus{{\n\t\t\t\t\tContent: {convert_value(d.get('+content'), 'content')}, Group: {convert_value(d.get('+@group'), 'group')},\n\t\t\t\t}}"
    
    # Handle ActionDicePool
    if '+@category' in d and context == "actiondicepool":
        return f"&ActionDicePool{{\n\t\t\t\t\tCategory: {convert_value(d.get('+@category'), 'category')},\n\t\t\t\t}}"
    
    # Handle SelectTextBonus (from common package)
    if ('+@xml' in d or '+@xpath' in d or '+@allowedit' in d) and context == "selecttext":
        parts = []
        if '+@xml' in d:
            parts.append(f"XML: {convert_value(d.get('+@xml'), 'xml')}")
        if '+@xpath' in d:
            parts.append(f"XPath: {convert_value(d.get('+@xpath'), 'xpath')}")
        if '+@allowedit' in d:
            parts.append(f"AllowEdit: {convert_value(d.get('+@allowedit'), 'allowedit')}")
        if parts:
            return f"&common.SelectTextBonus{{\n\t\t\t\t\t{', '.join(parts)},\n\t\t\t\t}}"
        else:
            return "&common.SelectTextBonus{}"
    
    # Generic struct - for complex nested structures, use interface{}
    # This will be handled in the bonus conversion function
    return "nil"

def convert_quality_bonus_to_go(d):
    """Convert quality bonus dictionary to Go QualityBonus struct"""
    if not d:
        return "nil"
    
    parts = []
    
    # Handle limitmodifier (can be single pointer - from common package)
    if 'limitmodifier' in d:
        lm = d.get('limitmodifier')
        if isinstance(lm, list):
            # Should be single value, but handle array just in case
            if len(lm) > 0:
                parts.append(f"LimitModifier: {convert_dict_to_go(lm[0], 'limitmodifier')}")
            else:
                parts.append("LimitModifier: nil")
        else:
            parts.append(f"LimitModifier: {convert_dict_to_go(lm, 'limitmodifier')}")
    
    # Handle skillcategory (can be single or array)
    if 'skillcategory' in d:
        sc = d.get('skillcategory')
        if isinstance(sc, list):
            items = [convert_dict_to_go(item, "skillcategory") for item in sc]
            items_str = ', '.join(items)
            brace_open = '{'
            brace_close = '}'
            parts.append(f"SkillCategory: []interface{brace_open}{brace_close}{brace_open}{items_str}{brace_close}")
        else:
            parts.append(f"SkillCategory: {convert_dict_to_go(sc, 'skillcategory')}")
    
    # Handle specificskill (array from common package)
    if 'specificskill' in d:
        ss = d.get('specificskill')
        brace_open = '{'
        brace_close = '}'
        if isinstance(ss, list):
            items = [convert_dict_to_go(item, "specificskill") for item in ss]
            items_str = ', '.join(items)
            parts.append(f"SpecificSkill: []common.SpecificSkillBonus{brace_open}{items_str}{brace_close}")
        else:
            # Single value - wrap in array
            item = convert_dict_to_go(ss, 'specificskill')
            # Remove & if present and wrap in array
            if item.startswith('&'):
                item = item[1:]
            parts.append(f"SpecificSkill: []common.SpecificSkillBonus{brace_open}{item}{brace_close}")
    
    # Handle skillgroup (array from common package)
    if 'skillgroup' in d:
        sg = d.get('skillgroup')
        brace_open = '{'
        brace_close = '}'
        if isinstance(sg, list):
            items = [convert_dict_to_go(item, "skillgroup") for item in sg]
            items_str = ', '.join(items)
            parts.append(f"SkillGroup: []*common.SkillGroupBonus{brace_open}{items_str}{brace_close}")
        else:
            # Single value - wrap in array
            item = convert_dict_to_go(sg, 'skillgroup')
            parts.append(f"SkillGroup: []*common.SkillGroupBonus{brace_open}{item}{brace_close}")
    
    # Handle selectskill (from common package, but still interface{} for now)
    if 'selectskill' in d:
        parts.append(f"SelectSkill: {convert_dict_to_go(d.get('selectskill'), 'selectskill')}")
    
    # Handle skillattribute (from common package)
    if 'skillattribute' in d:
        parts.append(f"SkillAttribute: {convert_dict_to_go(d.get('skillattribute'), 'skillattribute')}")
    
    # Handle specificattribute (can be string, pointer, or array - from common package)
    if 'specificattribute' in d:
        sa = d.get('specificattribute')
        if isinstance(sa, list):
            items = [convert_dict_to_go(item, "specificattribute") for item in sa]
            items_str = ', '.join(items)
            brace_open = '{'
            brace_close = '}'
            parts.append(f"SpecificAttribute: []interface{brace_open}{brace_close}{brace_open}{items_str}{brace_close}")
        elif isinstance(sa, str):
            # Simple string value
            parts.append(f"SpecificAttribute: {convert_value(sa, 'specificattribute')}")
        else:
            sa_go = convert_dict_to_go(sa, 'specificattribute')
            if sa_go == "nil":
                parts.append(f"SpecificAttribute: nil")
            else:
                parts.append(f"SpecificAttribute: {sa_go}")
    
    # Handle selectattributes
    if 'selectattributes' in d:
        sa_dict = d.get('selectattributes')
        if 'selectattribute' in sa_dict:
            sa_val = sa_dict.get('selectattribute')
            if isinstance(sa_val, dict):
                parts.append(f"SelectAttributes: {convert_dict_to_go(sa_val, 'selectattributes')}")
            elif isinstance(sa_val, list):
                items = [convert_dict_to_go(item, 'selectattributes') for item in sa_val]
                items_str = ', '.join(items)
                brace_open = '{'
                brace_close = '}'
                parts.append(f"SelectAttributes: []interface{brace_open}{brace_close}{brace_open}{items_str}{brace_close}")
            else:
                parts.append(f"SelectAttributes: {convert_value(sa_val, 'selectattributes')}")
        else:
            parts.append(f"SelectAttributes: {convert_dict_to_go(sa_dict, 'selectattributes')}")
    
    # Handle conditionmonitor (from common package)
    if 'conditionmonitor' in d:
        parts.append(f"ConditionMonitor: {convert_dict_to_go(d.get('conditionmonitor'), 'conditionmonitor')}")
    
    # Handle initiative (from common package)
    if 'initiative' in d:
        init_val = d.get('initiative')
        if isinstance(init_val, dict):
            parts.append(f"Initiative: {convert_dict_to_go(init_val, 'initiative')}")
        else:
            parts.append(f"Initiative: &common.InitiativeBonus{{\n\t\t\t\t\t\tContent: {convert_value(init_val, 'initiative')},\n\t\t\t\t\t}}")
    
    # Handle initiativepass (from common package)
    if 'initiativepass' in d:
        ip_val = d.get('initiativepass')
        if isinstance(ip_val, dict):
            parts.append(f"InitiativePass: {convert_dict_to_go(ip_val, 'initiativepass')}")
        else:
            parts.append(f"InitiativePass: &common.InitiativePassBonus{{\n\t\t\t\t\t\tContent: {convert_value(ip_val, 'initiativepass')},\n\t\t\t\t\t}}")
    
    # Handle actiondicepool
    if 'actiondicepool' in d:
        parts.append(f"ActionDicePool: {convert_dict_to_go(d.get('actiondicepool'), 'actiondicepool')}")
    
    # Handle armor (can be *common.ArmorBonus or string)
    if 'armor' in d:
        armor_val = d.get('armor')
        if isinstance(armor_val, dict):
            parts.append(f"Armor: {convert_dict_to_go(armor_val, 'armor')}")
        else:
            parts.append(f"Armor: {convert_value(armor_val, 'armor')}")
    
    # Handle selecttext (from common package)
    if 'selecttext' in d:
        st = d.get('selecttext')
        if st is None:
            parts.append("SelectText: &common.SelectTextBonus{}")
        else:
            st_go = convert_dict_to_go(st, 'selecttext')
            if st_go == "nil":
                parts.append("SelectText: &common.SelectTextBonus{}")
            else:
                parts.append(f"SelectText: {st_go}")
    
    # Handle all other interface{} fields that can be complex structures
    interface_fields = {
        'addcontact': 'AddContact',
        'addqualities': 'AddQuality',  # Note: field name is AddQuality, not AddQualities
        'addskillspecializationoption': 'AddSkill',
        'addspell': 'AddSpell',
        'addspirit': 'AddSpirit',
        'addecho': 'AddEcho',
        'addgear': 'AddGear',
        'addware': 'AddWare',
        'addlimb': 'AddLimb',
        'addmetamagic': 'AddMetamagic',
        'selectcontact': 'SelectContact',
        # selectexpertise is handled separately as it's a string, not interface{}
        'selectinherentaiprogram': 'SelectInherentAIProgram',
        'selectmentorspirit': 'SelectMentorSpirit',
        'selectparagon': 'SelectParagon',
        'selectquality': 'SelectQuality',
        'selectside': 'SelectSide',
        'selectsprite': 'SelectSprite',
        'allowspellcategory': 'AllowSpellCategory',
        'allowspellrange': 'AllowSpellRange',
        'limitspellcategory': 'LimitSpellCategory',
        'blockspelldescriptor': 'BlockSpellDescriptor',
        'movementreplace': 'MovementReplace',
        'disablebioware': 'DisableBioware',
        'disablebiowaregrade': 'DisableBiowareGrade',
        'disablecyberwaregrade': 'DisableCyberwareGrade',
        'skilldisable': 'SkillDisable',
        'skillgroupdisable': 'SkillGroupDisable',
        'skillgroupdisablechoice': 'SkillGroupDisableChoice',
        'skillgroupcategorydisable': 'SkillGroupCategoryDisable',
        'blockskillcategorydefaulting': 'BlockSkillCategoryDefaulting',
        'unlockskills': 'UnlockSkills',
        'swapskillattribute': 'SwapSkillAttribute',
        'swapskillspecattribute': 'SwapSkillSpecAttribute',
        'enableattribute': 'EnableAttribute',
        'enabletab': 'EnableTab',
        'replaceattributes': 'ReplaceAttributes',
        'restrictedgear': 'RestrictGear',
        'freequality': 'FreeQuality',
        'martialart': 'MartialArt',
        'optionalpowers': 'OptionalPowers',
        'critterpowers': 'CritterPowers',
        'limitcritterpowercategory': 'LimitCritterPowerCategory',
        'limitspiritcategory': 'LimitSpiritCategory',
        'allowspritefettering': 'AllowspriteFettering',
        'livingpersona': 'LivingPersona',
        'cyberadeptdaemon': 'CyberAdeptDaemon',
        'cyberseeker': 'CyberSeeker',
        'overclocker': 'Overclocker',
        'prototypetranshuman': 'PrototypeTranshuman',
        'burnoutsway': 'BurnoutsWay'
    }
    for field, go_field in interface_fields.items():
        if field in d:
            val = d.get(field)
            if val is None:
                continue
            if isinstance(val, dict):
                parts.append(f"{go_field}: {convert_dict_to_go(val, field)}")
            elif isinstance(val, list):
                items = [convert_dict_to_go(item, field) if isinstance(item, dict) else convert_value(item, field) for item in val]
                items_str = ', '.join(items)
                brace_open = '{'
                brace_close = '}'
                parts.append(f"{go_field}: []interface{brace_open}{brace_close}{brace_open}{items_str}{brace_close}")
            else:
                parts.append(f"{go_field}: {convert_value(val, field)}")
    
    # Handle boolean fields (plain bool, not *bool)
    bool_fields = {
        'unarmeddvphysical': 'UnarmedDVPhysical',
        'ambidextrous': 'Ambidextrous',
    }
    for field, go_field in bool_fields.items():
        if field in d:
            value = d.get(field)
            if value is None:
                parts.append(f"{go_field}: true")  # Default to true for nil
            else:
                parts.append(f"{go_field}: {str(value).lower()}")
    
    # Handle selectexpertise (simple string field)
    if 'selectexpertise' in d:
        parts.append(f"SelectExpertise: {convert_value(d.get('selectexpertise'), 'selectexpertise')}")
    
    # Handle all string fields
    string_fields = {
        'physicallimit': 'PhysicalLimit',
        'mentallimit': 'MentalLimit',
        'sociallimit': 'SocialLimit',
        'dodge': 'Dodge',
        'damageresistance': 'DamageResistance',
        'unarmeddv': 'UnarmedDV',
        'unarmedreach': 'UnarmedReach',
        'firearmor': 'FireArmor',
        'coldarmor': 'ColdArmor',
        'electricityarmor': 'ElectricityArmor',
        'toxincontactresist': 'ToxinContactResist',
        'toxiningestionresist': 'ToxinIngestionResist',
        'toxininhalationresist': 'ToxinInhalationResist',
        'toxininjectionresist': 'ToxinInjectionResist',
        'pathogencontactresist': 'PathogenContactResist',
        'pathogeningestionresist': 'PathogenIngestionResist',
        'pathogeninhalationresist': 'PathogenInhalationResist',
        'pathogeninjectionresist': 'PathogenInjectionResist',
        'radiationresist': 'RadiationResist',
        'fatigueresist': 'FatigueResist',
        'stuncmrecovery': 'StunCMRecovery',
        'physicalcmrecovery': 'PhysicalCMRecovery',
        'memory': 'Memory',
        'drainresist': 'DrainResist',
        'fadingresist': 'FadingResist',
        'composure': 'Composure',
        'lifestylecost': 'LifestyleCost',
        'notoriety': 'Notoriety',
        'publicawareness': 'PublicAwareness',
        'fame': 'Fame',
        'streetcredmultiplier': 'StreetCredMultiplier',
        'astralreputation': 'AstralReputation',
        'nativelanguagelimit': 'NativeLanguageLimit',
        'knowledgeskillpoints': 'KnowledgeskillPoints',
        'knowledgeskillkarmacost': 'KnowledgeskillKarmaCost',
        'knowledgeskillkarmacostmin': 'KnowledgeskillKarmaCostMin',
        'activeskillkarmacost': 'ActiveskillKarmaCost',
        'skillcategorykarmacost': 'SkillCategoryKarmaCost',
        # skillcategorykarmacostmultiplier is handled separately - it's a string, not interface{}
        # skillcategorypointcostmultiplier is handled separately - it's a string, not interface{}
        # skillcategoryspecializationkarmacostmultiplier is a string, handled in string_fields
        'skillgroupcategorykarmacostmultiplier': 'SkillGroupCategoryKarmaCostMultiplier',
        'newspellkarmacost': 'NewspellKarmaCost',
        'focusbindingkarmacost': 'FocusBindingKarmaCost',
        'contactkarma': 'ContactKarma',
        'contactkarmaminimum': 'ContactKarmaMinimum',
        # spelldicepool is handled separately - it's a string, not interface{}
        'spellresistance': 'SpellResistance',
        'spellcategorydamage': 'SpellCategoryDamage',
        'spellcategorydrain': 'SpellCategoryDrain',
        'spelldescriptordamage': 'SpellDescriptorDamage',
        'spelldescriptordrain': 'SpellDescriptorDrain',
        'defensetest': 'DefenseTest',
        'surprise': 'Surprise',
        'reach': 'Reach',
        'walkmultiplier': 'WalkMultiplier',
        'sprintbonus': 'SprintBonus',
        'runmultiplier': 'RunMultiplier',
        'weaponcategorydv': 'WeaponCategoryDV',
        'weaponskillaccuracy': 'WeaponSkillAccuracy',
        'essencemax': 'EssenceMax',
        'essencepenalty': 'EssencePenalty',
        'essencepenaltymagonlyt100': 'EssencePenaltyMagonlyT100',
        'essencepenaltyt100': 'EssencePenaltyT100',
        'addesstophysicalcmrecovery': 'AddEssToPhysicalCMRecovery',
        'addesstostuncmrecovery': 'AddEssToStunCMRecovery',
        'biowareessmultiplier': 'BiowareEssMultiplier',
        'cyberwareessmultiplier': 'CyberwareEssMultiplier',
        'cyberwaretotalessmultiplier': 'CyberwareTotalEssMultiplier',
        'dealerconnection': 'DealerConnection',
        'blackmarketdiscount': 'BlackMarketDiscount',
        'basiclifestylecost': 'BasicLifestyleCost',
        'trustfund': 'TrustFund',
        'nuyenamt': 'NuyenAmt',
        'nuyenmaxbp': 'NuyenMaxBP',
        'friendsinhighplaces': 'FriendsInHighPlaces',
        'mademan': 'MadeMan',
        'excon': 'ExCon',
        'erased': 'Erased',
        'judgeintentionsdefense': 'JudgeIntentionsDefense',
        'judgeintentionsoffense': 'JudgeIntentionsOffense',
        'decreaseintresist': 'DecreaseIntResist',
        'decreaselogresist': 'DecreaseLogResist',
        'detectionspellresist': 'DetectionSpellResist',
        'manaillusionresist': 'ManaIllusionResist',
        'mentalmanipulationresist': 'MentalManipulationResist',
        'physicalillusionresist': 'PhysicalIllusionResist',
        'drainvalue': 'DrainValue',
        'fadingvalue': 'FadingValue',
        'physiologicaladdictionfirsttime': 'PhysiologicalAddictionFirstTime',
        'psychologicaladdictionfirsttime': 'PsychologicalAddictionFirstTime',
        'physiologicaladdictionalreadyaddicted': 'PhysiologicalAddictionAlreadyAddicted',
        'psychologicaladdictionalreadyaddicted': 'PsychologicalAddictionAlreadyAddicted',
        'adeptpowerpoints': 'AdeptPowerPoints',
        'freespells': 'FreeSpells',
        'magicianswaydiscount': 'MagiciansWayDiscount',
        'metageniclimit': 'MetagenicLimit',
        'specialattburnmultiplier': 'SpecialAttBurnMultiplier',
        'specialmodificationlimit': 'SpecialModificationLimit',
        '+@unique': 'Unique',
        '+@useselected': 'UseSelected',
    }
    for field, go_field in string_fields.items():
        if field in d:
            val = d.get(field)
            # Skip complex structures (arrays, dicts) for string fields
            if isinstance(val, (dict, list)):
                # Skip complex structures - they should be handled separately
                continue
            # Skip nil values for string fields (they'll be omitted)
            if val is None:
                continue
            parts.append(f"{go_field}: {convert_value(val, field)}")
    
    if not parts:
        return "nil"
    
    return f"&QualityBonus{{\n\t\t\t\t{',\n\t\t\t\t'.join(parts)},\n\t\t\t}}"

def convert_quality_required_to_go(d):
    """Convert quality required dictionary to Go QualityRequired struct"""
    parts = []
    if 'oneof' in d:
        oo = d.get('oneof')
        oo_parts = []
        brace_open = '{'
        brace_close = '}'
        if 'metatype' in oo:
            mt = oo.get('metatype')
            if isinstance(mt, list):
                items = [convert_value(item, 'metatype') for item in mt]
                oo_parts.append(f"Metatype: []string{brace_open}{', '.join(items)}{brace_close}")
            else:
                # Single value - wrap in array
                oo_parts.append(f"Metatype: []string{brace_open}{convert_value(mt, 'metatype')}{brace_close}")
        if 'quality' in oo:
            q = oo.get('quality')
            if isinstance(q, list):
                items = [convert_value(item, 'quality') for item in q]
                oo_parts.append(f"Quality: []string{brace_open}{', '.join(items)}{brace_close}")
            else:
                # Single value - wrap in array
                oo_parts.append(f"Quality: []string{brace_open}{convert_value(q, 'quality')}{brace_close}")
        if 'power' in oo:
            oo_parts.append(f"Power: {convert_value(oo.get('power'), 'power')}")
        if 'magenabled' in oo:
            mge = oo.get('magenabled')
            if mge is None:
                oo_parts.append(f"MageEnabled: true")  # Default to true for nil
            else:
                oo_parts.append(f"MageEnabled: {str(mge).lower()}")
        if oo_parts:
            parts.append(f"OneOf: &QualityRequiredOneOf{{\n\t\t\t\t\t{', '.join(oo_parts)},\n\t\t\t\t}}")
    if 'allof' in d:
        ao = d.get('allof')
        ao_parts = []
        if 'metatype' in ao:
            ao_parts.append(f"Metatype: {convert_value(ao.get('metatype'), 'metatype')}")
        if ao_parts:
            parts.append(f"AllOf: &QualityRequiredAllOf{{\n\t\t\t\t\t{', '.join(ao_parts)},\n\t\t\t\t}}")
    if not parts:
        return "nil"
    return f"&QualityRequired{{\n\t\t\t\t{', '.join(parts)},\n\t\t\t}}"

def convert_quality_forbidden_to_go(d):
    """Convert quality forbidden dictionary to Go QualityForbidden struct"""
    if 'oneof' in d:
        oo = d.get('oneof')
        parts = []
        brace_open = '{'
        brace_close = '}'
        if 'quality' in oo:
            q = oo.get('quality')
            if isinstance(q, list):
                items = [convert_value(item, 'quality') for item in q]
                parts.append(f"Quality: []string{brace_open}{', '.join(items)}{brace_close}")
            else:
                # Single value - wrap in array
                parts.append(f"Quality: []string{brace_open}{convert_value(q, 'quality')}{brace_close}")
        if 'bioware' in oo:
            bw = oo.get('bioware')
            if isinstance(bw, list):
                items = [convert_value(item, 'bioware') for item in bw]
                parts.append(f"Bioware: []string{brace_open}{', '.join(items)}{brace_close}")
            else:
                # Single value - wrap in array
                parts.append(f"Bioware: []string{brace_open}{convert_value(bw, 'bioware')}{brace_close}")
        if 'power' in oo:
            parts.append(f"Power: {convert_value(oo.get('power'), 'power')}")
        if not parts:
            return "nil"
        return f"&QualityForbidden{{\n\t\t\t\tOneOf: &QualityForbiddenOneOf{{\n\t\t\t\t\t{', '.join(parts)},\n\t\t\t\t}},\n\t\t\t}}"
    return "nil"

def convert_quality_to_go(quality):
    """Convert quality JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'Name: {convert_value(quality.get("name"), "name")}')
    parts.append(f'Karma: {convert_value(quality.get("karma"), "karma")}')
    parts.append(f'Category: {convert_value(quality.get("category"), "category")}')
    parts.append(f'Source: {convert_value(quality.get("source"), "source")}')
    
    # Optional fields
    if 'limit' in quality:
        parts.append(f'Limit: {convert_value(quality.get("limit"), "limit")}')
    if 'bonus' in quality:
        bonus = quality.get("bonus")
        if bonus is None:
            parts.append('Bonus: nil')
        else:
            parts.append(f'Bonus: {convert_quality_bonus_to_go(bonus)}')
    if 'required' in quality:
        parts.append(f'Required: {convert_quality_required_to_go(quality.get("required"))}')
    if 'forbidden' in quality:
        parts.append(f'Forbidden: {convert_quality_forbidden_to_go(quality.get("forbidden"))}')
    if 'page' in quality:
        parts.append(f'Page: {convert_value(quality.get("page"), "page")}')
    
    # Handle boolean fields (plain bool, not *bool)
    bool_fields = {
        'chargenonly': 'ChargenOnly',
        'careeronly': 'CareerOnly',
        'nolevels': 'NoLevels',
        'stagedpurchase': 'StagedPurchase',
        'refundkarmaonremove': 'RefundKarmaOnRemove',
        'contributetobp': 'ContributeToBP',
        'contributetolimit': 'ContributeToLimit',
        # includeinlimit is handled separately as it's a complex structure
        'limitwithininclusions': 'LimitWithinInclusions',
        'onlyprioritygiven': 'OnlyPriorityGiven',
        'canbuywithspellpoints': 'CanBuyWithSpellPoints',
        'doublecareer': 'DoubleCareer',
        # firstlevelbonus is handled separately as it can be a complex structure
        'hide': 'Hide',
        'implemented': 'Implemented',
        # naturalweapons is handled separately as it can be a complex structure
    }
    for field, go_field in bool_fields.items():
        if field in quality:
            value = quality.get(field)
            if value is None:
                parts.append(f'{go_field}: true')  # Default to true for nil
            else:
                parts.append(f'{go_field}: {str(value).lower()}')
    
    # Handle includeinlimit (complex structure)
    if 'includeinlimit' in quality:
        iil = quality.get('includeinlimit')
        if isinstance(iil, dict):
            name_val = iil.get('name')
            if isinstance(name_val, list):
                items = [convert_value(item, 'name') for item in name_val]
                brace_open = '{'
                brace_close = '}'
                parts.append(f'IncludeInLimit: &IncludeInLimit{{\n\t\t\t\t\tName: []interface{brace_open}{brace_close}{brace_open}{", ".join(items)}{brace_close},\n\t\t\t\t}}')
            else:
                parts.append(f'IncludeInLimit: &IncludeInLimit{{\n\t\t\t\t\tName: {convert_value(name_val, "name")},\n\t\t\t\t}}')
        else:
            # If it's not a dict, treat as boolean
            brace_open = '{'
            brace_close = '}'
            parts.append(f'IncludeInLimit: &[]bool{brace_open}true{brace_close}[0]')
    
    # Handle firstlevelbonus (plain bool, not *bool)
    if 'firstlevelbonus' in quality:
        flb = quality.get('firstlevelbonus')
        if isinstance(flb, dict):
            # Complex structure - default to false for now
            parts.append('FirstLevelBonus: false')  # TODO: Handle complex firstlevelbonus structures
        elif flb is None:
            parts.append('FirstLevelBonus: true')  # Default to true for nil
        else:
            parts.append(f'FirstLevelBonus: {str(flb).lower()}')
    
    # Handle naturalweapons (can be bool or complex structure)
    if 'naturalweapons' in quality:
        nw = quality.get('naturalweapons')
        if isinstance(nw, dict):
            # Complex structure - use interface{} for now
            parts.append('NaturalWeapons: nil')  # TODO: Handle complex naturalweapons structures
        elif nw is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'NaturalWeapons: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'NaturalWeapons: &[]bool{brace_open}{str(nw).lower()}{brace_close}[0]')
    
    # Handle string fields
    string_fields = {
        'mutant': 'Mutant',
        'metagenic': 'Metagenic',
        'chargenlimit': 'ChargenLimit',
        'costdiscount': 'CostDiscount',
        'nameonpage': 'NameOnPage',
        'addweapon': 'AddWeapon',
    }
    for field, go_field in string_fields.items():
        if field in quality:
            val = quality.get(field)
            # Skip nil values for string fields
            if val is None:
                continue
            parts.append(f'{go_field}: {convert_value(val, field)}')
    
    return "{\n\t\t\t" + ",\n\t\t\t".join(parts) + ",\n\t\t}"

# Read JSON file
with open('data/chummer/qualities.json', 'r') as f:
    data = json.load(f)

# Generate category entries (just a slice of strings)
category_entries = []
for category in data['categories']['category']:
    category_entries.append(f'\t{convert_value(category, "category")}')

# Generate quality entries
quality_entries = []
seen_ids = set()
for quality in data['qualities']['quality']:
    quality_id = to_snake_case(quality.get('name', ''))
    # Handle duplicate IDs by appending a counter
    original_id = quality_id
    counter = 1
    while quality_id in seen_ids:
        quality_id = f"{original_id}_{counter}"
        counter += 1
    seen_ids.add(quality_id)
    quality_go = convert_quality_to_go(quality)
    quality_entries.append(f'\t"{quality_id}": {quality_go}')

# Write to file
with open('pkg/shadowrun/edition/v5/qualities_data.go', 'w', encoding='utf-8') as f:
    f.write('package v5\n\n')
    f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
    f.write('// DataQualityCategories contains quality category names\n')
    f.write('var DataQualityCategories = []string{\n')
    f.write(',\n'.join(category_entries))
    f.write(',\n}\n\n')
    f.write('// DataQualities contains quality records keyed by their ID (lowercase with underscores)\n')
    f.write('var DataQualities = map[string]Quality{\n')
    f.write(',\n'.join(quality_entries))
    f.write(',\n}\n')

print(f"Generated {len(category_entries)} categories and {len(quality_entries)} qualities")

