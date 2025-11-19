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
        # Check if it's a numeric string that should be int
        if field_name in ['rating'] and value.isdigit():
            return value
        # Escape quotes
        return f'"{value.replace('"', '\\"')}"'
    if isinstance(value, list):
        items = [convert_value(item, field_name) for item in value]
        brace_open = '{'
        brace_close = '}'
        return f"[]string{brace_open}{', '.join(items)}{brace_close}"
    if isinstance(value, dict):
        # This is a complex nested structure
        return convert_dict_to_go(value, field_name)
    return str(value)

def convert_dict_to_go(d, context=""):
    """Convert a dictionary to Go struct initialization"""
    if not d:
        return "nil"
    
    # Handle special cases for Bonus structures
    if context == "bonus" or any(k in d for k in ['limitmodifier', 'skillcategory', 'specificskill', 'skillgroup',
                                                    'selectskill', 'skillattribute', 'skilllinkedattribute',
                                                    'specificattribute', 'attributekarmacost', 'physicallimit',
                                                    'mentallimit', 'sociallimit', 'conditionmonitor', 'initiative',
                                                    'initiativepass', 'dodge', 'damageresistance', 'unarmeddv',
                                                    'armor', 'firearmor', 'coldarmor', 'electricityarmor',
                                                    'toxincontactresist', 'pathogencontactresist', 'radiationresist',
                                                    'fatigueresist', 'stuncmrecovery', 'memory', 'drainresist',
                                                    'lifestylecost', 'disablequality', 'addqualities', '+@unique',
                                                    'selecttext', 'composure', 'ambidextrous', 'adapsin']):
        return convert_bioware_bonus_to_go(d)
    
    # Handle LimitModifier
    if 'limit' in d and 'value' in d and 'condition' in d:
        return f"LimitModifier{{\n\t\t\t\tLimit: {convert_value(d.get('limit'), 'limit')}, Value: {convert_value(d.get('value'), 'value')}, Condition: {convert_value(d.get('condition'), 'condition')},\n\t\t\t}}"
    
    # Handle SkillCategoryBonus (for bioware, use BiowareSkillCategoryBonus)
    # But only if context is skillcategory, otherwise check for other types
    if 'name' in d and 'bonus' in d and context == "skillcategory":
        bonus_val = convert_value(d.get('bonus'), 'bonus')
        return f"BiowareSkillCategoryBonus{{\n\t\t\t\tName: {convert_value(d.get('name'), 'name')}, Bonus: {bonus_val},\n\t\t\t}}"
    
    # Handle SpecificSkillBonus
    if 'name' in d and 'bonus' in d and context not in ["skillgroup", "specificattribute"]:
        bonus_val = d.get('bonus')
        if isinstance(bonus_val, str) and bonus_val.isdigit():
            bonus_val = int(bonus_val)
        else:
            bonus_val = convert_value(bonus_val, 'bonus')
        return f"SpecificSkillBonus{{\n\t\t\t\tName: {convert_value(d.get('name'), 'name')}, Bonus: {bonus_val},\n\t\t\t}}"
    
    # Handle SkillGroupBonus
    if 'name' in d and 'bonus' in d and context == "skillgroup":
        return f"SkillGroupBonus{{\n\t\t\t\tName: {convert_value(d.get('name'), 'name')}, Bonus: {convert_value(d.get('bonus'), 'bonus')}, Condition: {convert_value(d.get('condition', ''), 'condition')},\n\t\t\t}}"
    
    # Handle SpecificAttributeBonus
    if context == "specificattribute" and 'name' in d:
        parts = []
        parts.append(f"Name: {convert_value(d.get('name'), 'name')}")
        if 'val' in d:
            parts.append(f"Val: {convert_value(d.get('val'), 'val')}")
        if 'max' in d:
            parts.append(f"Max: {convert_value(d.get('max'), 'max')}")
        return f"&SpecificAttributeBonus{{\n\t\t\t\t\t{', '.join(parts)},\n\t\t\t\t}}"
    
    # Handle SelectSkill
    if 'val' in d and ('+@limittoattribute' in d or '+@maximumrating' in d or '+@knowledgeskills' in d):
        parts = [f"Val: {convert_value(d.get('val'), 'val')}"]
        if '+@limittoattribute' in d:
            parts.append(f"LimitToAttribute: {convert_value(d.get('+@limittoattribute'), 'limittoattribute')}")
        if '+@maximumrating' in d:
            parts.append(f"MaximumRating: {convert_value(d.get('+@maximumrating'), 'maximumrating')}")
        if '+@knowledgeskills' in d:
            parts.append(f"KnowledgeSkills: {convert_value(d.get('+@knowledgeskills'), 'knowledgeskills')}")
        if 'applytorating' in d:
            parts.append(f"ApplyToRating: {convert_value(d.get('applytorating'), 'applytorating')}")
        return f"&SelectSkill{{\n\t\t\t\t{', '.join(parts)},\n\t\t\t}}"
    
    # Handle SkillAttributeBonus
    if 'name' in d and 'bonus' in d and context == "skillattribute":
        return f"&SkillAttributeBonus{{\n\t\t\t\tName: {convert_value(d.get('name'), 'name')}, Bonus: {convert_value(d.get('bonus'), 'bonus')},\n\t\t\t}}"
    
    # Handle SkillLinkedAttributeBonus
    if 'name' in d and 'bonus' in d and context == "skilllinkedattribute":
        return f"&SkillLinkedAttributeBonus{{\n\t\t\t\tName: {convert_value(d.get('name'), 'name')}, Bonus: {convert_value(d.get('bonus'), 'bonus')},\n\t\t\t}}"
    
    # Handle AttributeKarmaCostBonus
    if 'name' in d and 'val' in d and context == "attributekarmacost":
        return f"&AttributeKarmaCostBonus{{\n\t\t\t\tName: {convert_value(d.get('name'), 'name')}, Val: {convert_value(d.get('val'), 'val')},\n\t\t\t}}"
    
    # Handle ConditionMonitorBonus
    if 'sharedthresholdoffset' in d:
        return f"&ConditionMonitorBonus{{\n\t\t\t\tSharedThresholdOffset: {convert_value(d.get('sharedthresholdoffset'), 'sharedthresholdoffset')},\n\t\t\t}}"
    
    # Handle InitiativeBonus
    if '+content' in d and '+@precedence' in d and context == "initiative":
        return f"&InitiativeBonus{{\n\t\t\t\tContent: {convert_value(d.get('+content'), 'content')}, Precedence: {convert_value(d.get('+@precedence'), 'precedence')},\n\t\t\t}}"
    
    # Handle InitiativePassBonus
    if '+content' in d and '+@precedence' in d and context == "initiativepass":
        return f"&InitiativePassBonus{{\n\t\t\t\tContent: {convert_value(d.get('+content'), 'content')}, Precedence: {convert_value(d.get('+@precedence'), 'precedence')},\n\t\t\t}}"
    
    # Handle ArmorBonus
    if '+content' in d and '+@group' in d:
        return f"&ArmorBonus{{\n\t\t\t\tContent: {convert_value(d.get('+content'), 'content')}, Group: {convert_value(d.get('+@group'), 'group')},\n\t\t\t}}"
    
    # Handle WeaponAccuracyBonus
    if 'name' in d and 'value' in d and context == "weaponaccuracy":
        return f"&WeaponAccuracyBonus{{\n\t\t\t\tName: {convert_value(d.get('name'), 'name')}, Value: {convert_value(d.get('value'), 'value')},\n\t\t\t}}"
    
    # Handle AddQualities
    if 'addquality' in d:
        return f"&AddQualities{{\n\t\t\t\tAddQuality: {convert_value(d.get('addquality'), 'addquality')},\n\t\t\t}}"
    
    # Handle SelectTextBonus
    if '+@xml' in d or '+@xpath' in d or '+@allowedit' in d:
        parts = []
        if '+@xml' in d:
            parts.append(f"XML: {convert_value(d.get('+@xml'), 'xml')}")
        if '+@xpath' in d:
            parts.append(f"XPath: {convert_value(d.get('+@xpath'), 'xpath')}")
        if '+@allowedit' in d:
            parts.append(f"AllowEdit: {convert_value(d.get('+@allowedit'), 'allowedit')}")
        return f"&SelectTextBonus{{\n\t\t\t\t{', '.join(parts)},\n\t\t\t}}"
    
    # Handle Forbidden
    if 'oneof' in d and context == "forbidden":
        return convert_forbidden_to_go(d)
    
    # Handle BannedGrades
    if 'grade' in d and isinstance(d.get('grade'), list):
        items = [convert_value(item, 'grade') for item in d.get('grade')]
        brace_open = '{'
        brace_close = '}'
        return f"&BannedGrades{{\n\t\t\t\tGrade: []string{brace_open}{', '.join(items)}{brace_close},\n\t\t\t}}"
    
    # Handle BiowareRequired
    if 'oneof' in d or 'allof' in d:
        return convert_bioware_required_to_go(d)
    
    # Handle AllowGear
    if 'gearcategory' in d:
        items = [convert_value(item, 'gearcategory') for item in d.get('gearcategory')]
        brace_open = '{'
        brace_close = '}'
        return f"&AllowGear{{\n\t\t\t\tGearCategory: []string{brace_open}{', '.join(items)}{brace_close},\n\t\t\t}}"
    
    # Handle AllowSubsystems
    if 'category' in d and context == "allowsubsystems":
        return f"&AllowSubsystems{{\n\t\t\t\tCategory: {convert_value(d.get('category'), 'category')},\n\t\t\t}}"
    
    # Handle PairBonus
    if 'unarmeddv' in d or 'unarmedreach' in d or 'walkmultiplier' in d or 'reach' in d:
        return convert_pair_bonus_to_go(d)
    
    # Handle PairInclude
    if 'name' in d and context == "pairinclude":
        return f"&PairInclude{{\n\t\t\t\tName: {convert_value(d.get('name'), 'name')},\n\t\t\t}}"
    
    # Generic struct
    lines = []
    for k, v in d.items():
        go_key = to_snake_case(k) if not k.startswith('+') else k.replace('+', '').replace('@', '')
        lines.append(f"{go_key}: {convert_value(v, k)}")
    return "{\n\t\t\t\t" + ",\n\t\t\t\t".join(lines) + ",\n\t\t\t}"

def convert_bioware_bonus_to_go(d):
    """Convert bioware bonus dictionary to Go BiowareBonus struct"""
    parts = []
    
    # Handle limitmodifier (can be single or array)
    if 'limitmodifier' in d:
        lm = d.get('limitmodifier')
        if isinstance(lm, list):
            items = [convert_dict_to_go(item, "limitmodifier") for item in lm]
            items_str = ', '.join(items)
            brace_open = '{'
            brace_close = '}'
            parts.append(f"LimitModifier: []interface{brace_open}{brace_close}{brace_open}{items_str}{brace_close}")
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
    
    # Handle specificskill (can be single or array)
    if 'specificskill' in d:
        ss = d.get('specificskill')
        if isinstance(ss, list):
            items = [convert_dict_to_go(item, "specificskill") for item in ss]
            items_str = ', '.join(items)
            brace_open = '{'
            brace_close = '}'
            parts.append(f"SpecificSkill: []interface{brace_open}{brace_close}{brace_open}{items_str}{brace_close}")
        else:
            parts.append(f"SpecificSkill: {convert_dict_to_go(ss, 'specificskill')}")
    
    # Handle skillgroup (can be single or array)
    if 'skillgroup' in d:
        sg = d.get('skillgroup')
        if isinstance(sg, list):
            items = [convert_dict_to_go(item, "skillgroup") for item in sg]
            items_str = ', '.join(items)
            brace_open = '{'
            brace_close = '}'
            parts.append(f"SkillGroup: []interface{brace_open}{brace_close}{brace_open}{items_str}{brace_close}")
        else:
            parts.append(f"SkillGroup: {convert_dict_to_go(sg, 'skillgroup')}")
    
    # Handle selectskill
    if 'selectskill' in d:
        parts.append(f"SelectSkill: {convert_dict_to_go(d.get('selectskill'), 'selectskill')}")
    
    # Handle skillattribute
    if 'skillattribute' in d:
        sa_dict = d.get('skillattribute')
        # Convert to SkillAttributeBonus struct
        name = convert_value(sa_dict.get('name'), 'name')
        bonus = convert_value(sa_dict.get('bonus'), 'bonus')
        parts.append(f"SkillAttribute: &SkillAttributeBonus{{\n\t\t\t\t\t\tName: {name}, Bonus: {bonus},\n\t\t\t\t\t}}")
    
    # Handle skilllinkedattribute
    if 'skilllinkedattribute' in d:
        sla_dict = d.get('skilllinkedattribute')
        # Convert to SkillLinkedAttributeBonus struct
        name = convert_value(sla_dict.get('name'), 'name')
        bonus = convert_value(sla_dict.get('bonus'), 'bonus')
        parts.append(f"SkillLinkedAttribute: &SkillLinkedAttributeBonus{{\n\t\t\t\t\t\tName: {name}, Bonus: {bonus},\n\t\t\t\t\t}}")
    
    # Handle specificattribute (can be single or array)
    if 'specificattribute' in d:
        sa = d.get('specificattribute')
        if isinstance(sa, list):
            items = [convert_dict_to_go(item, "specificattribute") for item in sa]
            items_str = ', '.join(items)
            brace_open = '{'
            brace_close = '}'
            parts.append(f"SpecificAttribute: []interface{brace_open}{brace_close}{brace_open}{items_str}{brace_close}")
        else:
            sa_go = convert_dict_to_go(sa, 'specificattribute')
            # Ensure it's properly typed - if it doesn't start with & or [], add &SpecificAttributeBonus
            if not sa_go.startswith('&') and not sa_go.startswith('[]'):
                # Check if it's already a struct literal
                if sa_go.startswith('SpecificAttributeBonus'):
                    sa_go = f"&{sa_go}"
                else:
                    # It's a bare struct, wrap it
                    sa_go = f"&SpecificAttributeBonus{sa_go}"
            parts.append(f"SpecificAttribute: {sa_go}")
    
    # Handle attributekarmacost
    if 'attributekarmacost' in d:
        parts.append(f"AttributeKarmaCost: {convert_dict_to_go(d.get('attributekarmacost'), 'attributekarmacost')}")
    
    # Handle conditionmonitor
    if 'conditionmonitor' in d:
        parts.append(f"ConditionMonitor: {convert_dict_to_go(d.get('conditionmonitor'), 'conditionmonitor')}")
    
    # Handle initiative
    if 'initiative' in d:
        init_val = d.get('initiative')
        if isinstance(init_val, dict):
            parts.append(f"Initiative: {convert_dict_to_go(init_val, 'initiative')}")
        else:
            # If it's a string, it should be converted to *InitiativeBonus with Content field
            parts.append(f"Initiative: &InitiativeBonus{{\n\t\t\t\t\t\tContent: {convert_value(init_val, 'initiative')},\n\t\t\t\t\t}}")
    
    # Handle initiativepass
    if 'initiativepass' in d:
        ip_val = d.get('initiativepass')
        if isinstance(ip_val, dict):
            parts.append(f"InitiativePass: {convert_dict_to_go(ip_val, 'initiativepass')}")
        else:
            parts.append(f"InitiativePass: {convert_value(ip_val, 'initiativepass')}")
    
    # Handle weaponaccuracy
    if 'weaponaccuracy' in d:
        parts.append(f"WeaponAccuracy: {convert_dict_to_go(d.get('weaponaccuracy'), 'weaponaccuracy')}")
    
    # Handle armor
    if 'armor' in d:
        armor_val = d.get('armor')
        if isinstance(armor_val, dict):
            parts.append(f"Armor: {convert_dict_to_go(armor_val, 'armor')}")
        else:
            parts.append(f"Armor: {convert_value(armor_val, 'armor')}")
    
    # Handle addqualities
    if 'addqualities' in d:
        parts.append(f"AddQualities: {convert_dict_to_go(d.get('addqualities'), 'addqualities')}")
    
    # Handle selecttext
    if 'selecttext' in d:
        st = d.get('selecttext')
        if st is None:
            parts.append("SelectText: &SelectTextBonus{}")
        else:
            parts.append(f"SelectText: {convert_dict_to_go(st, 'selecttext')}")
    
    # Handle boolean pointer fields
    bool_fields = {
        'unarmeddvphysical': 'UnarmedDVPhysical',
        'reflexrecorderoptimization': 'ReflexRecorderOptimization',
        'ambidextrous': 'Ambidextrous',
        'adapsin': 'Adapsin',
    }
    for field, go_field in bool_fields.items():
        if field in d:
            value = d.get(field)
            if value is None:
                brace_open = '{'
                brace_close = '}'
                parts.append(f"{go_field}: &[]bool{brace_open}true{brace_close}[0]")
            else:
                brace_open = '{'
                brace_close = '}'
                parts.append(f"{go_field}: &[]bool{brace_open}{str(value).lower()}{brace_close}[0]")
    
    # Handle all other string fields
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
        'directmanaspellresist': 'DirectManaSpellResist',
        'detectionspellresist': 'DetectionSpellResist',
        'manaillusionresist': 'ManaIllusionResist',
        'mentalmanipulationresist': 'MentalManipulationResist',
        'decreasebodresist': 'DecreaseBODResist',
        'decreaseagiresist': 'DecreaseAGIResist',
        'decreaserearesist': 'DecreaseREAResist',
        'decreasestrresist': 'DecreaseSTRResist',
        'decreasecharesist': 'DecreaseCHAResist',
        'decreaseintresist': 'DecreaseINTResist',
        'decreaselogresist': 'DecreaseLOGResist',
        'decreasewilresist': 'DecreaseWILResist',
        'composure': 'Composure',
        'judgeintentionsdefense': 'JudgeIntentionsDefense',
        'lifestylecost': 'LifestyleCost',
        'physiologicaladdictionfirsttime': 'PhysiologicalAddictionFirstTime',
        'psychologicaladdictionfirsttime': 'PsychologicalAddictionFirstTime',
        'physiologicaladdictionalreadyaddicted': 'PhysiologicalAddictionAlreadyAddicted',
        'psychologicaladdictionalreadyaddicted': 'PsychologicalAddictionAlreadyAddicted',
        'disablequality': 'DisableQuality',
        '+@unique': 'Unique',
    }
    for field, go_field in string_fields.items():
        if field in d:
            parts.append(f"{go_field}: {convert_value(d.get(field), field)}")
    
    if not parts:
        return "nil"
    
    # Wrap all BaseBonus fields in a BaseBonus field
    base_bonus_fields = ',\n\t\t\t\t\t'.join(parts)
    return f"&BiowareBonus{{\n\t\t\t\tBaseBonus: common.BaseBonus{{\n\t\t\t\t\t{base_bonus_fields},\n\t\t\t\t}},\n\t\t\t}}"

def convert_forbidden_to_go(d):
    """Convert forbidden dictionary to Go Forbidden struct"""
    if 'oneof' in d:
        oo = d.get('oneof')
        parts = []
        if 'cyberware' in oo:
            cw = oo.get('cyberware')
            if isinstance(cw, list):
                items = [convert_value(item, 'cyberware') for item in cw]
                brace_open = '{'
                brace_close = '}'
                parts.append(f"Cyberware: []interface{brace_open}{brace_close}{brace_open}{', '.join(items)}{brace_close}")
            else:
                parts.append(f"Cyberware: {convert_value(cw, 'cyberware')}")
        if 'bioware' in oo:
            bw = oo.get('bioware')
            if isinstance(bw, list):
                items = [convert_value(item, 'bioware') for item in bw]
                brace_open = '{'
                brace_close = '}'
                parts.append(f"Bioware: []interface{brace_open}{brace_close}{brace_open}{', '.join(items)}{brace_close}")
            else:
                parts.append(f"Bioware: {convert_value(bw, 'bioware')}")
        if 'quality' in oo:
            parts.append(f"Quality: {convert_value(oo.get('quality'), 'quality')}")
        return f"&Forbidden{{\n\t\t\t\tOneOf: &ForbiddenOneOf{{\n\t\t\t\t\t{', '.join(parts)},\n\t\t\t\t}},\n\t\t\t}}"
    return "nil"

def convert_bioware_required_to_go(d):
    """Convert bioware required dictionary to Go BiowareRequired struct"""
    parts = []
    if 'oneof' in d:
        oo = d.get('oneof')
        oo_parts = []
        if 'cyberware' in oo:
            oo_parts.append(f"Cyberware: {convert_value(oo.get('cyberware'), 'cyberware')}")
        if 'bioware' in oo:
            bw = oo.get('bioware')
            if isinstance(bw, list):
                items = [convert_value(item, 'bioware') for item in bw]
                brace_open = '{'
                brace_close = '}'
                oo_parts.append(f"Bioware: []interface{brace_open}{brace_close}{brace_open}{', '.join(items)}{brace_close}")
            else:
                oo_parts.append(f"Bioware: {convert_value(bw, 'bioware')}")
        if 'metatype' in oo:
            oo_parts.append(f"Metatype: {convert_value(oo.get('metatype'), 'metatype')}")
        if 'quality' in oo:
            oo_parts.append(f"Quality: {convert_value(oo.get('quality'), 'quality')}")
        parts.append(f"OneOf: &BiowareRequiredOneOf{{\n\t\t\t\t\t{', '.join(oo_parts)},\n\t\t\t\t}}")
    if 'allof' in d:
        ao = d.get('allof')
        ao_parts = []
        if 'metatype' in ao:
            ao_parts.append(f"Metatype: {convert_value(ao.get('metatype'), 'metatype')}")
        parts.append(f"AllOf: &BiowareRequiredAllOf{{\n\t\t\t\t\t{', '.join(ao_parts)},\n\t\t\t\t}}")
    if not parts:
        return "nil"
    return f"&BiowareRequired{{\n\t\t\t\t{', '.join(parts)},\n\t\t\t}}"

def convert_pair_bonus_to_go(d):
    """Convert pair bonus dictionary to Go PairBonus struct"""
    parts = []
    if 'unarmeddv' in d:
        parts.append(f"UnarmedDV: {convert_value(d.get('unarmeddv'), 'unarmeddv')}")
    if 'unarmedreach' in d:
        parts.append(f"UnarmedReach: {convert_value(d.get('unarmedreach'), 'unarmedreach')}")
    if 'walkmultiplier' in d:
        wm = d.get('walkmultiplier')
        parts.append(f"WalkMultiplier: &WalkMultiplier{{\n\t\t\t\t\tVal: {convert_value(wm.get('val'), 'val')}, Category: {convert_value(wm.get('category'), 'category')},\n\t\t\t\t}}")
    if 'reach' in d:
        r = d.get('reach')
        parts.append(f"Reach: &ReachBonus{{\n\t\t\t\t\tContent: {convert_value(r.get('+content', ''), 'content')}, Name: {convert_value(r.get('+@name', ''), 'name')},\n\t\t\t\t}}")
    if not parts:
        return "nil"
    return f"&PairBonus{{\n\t\t\t\t{', '.join(parts)},\n\t\t\t}}"

def convert_grade_to_go(grade):
    """Convert grade JSON to Go struct"""
    parts = []
    parts.append(f'Name: {convert_value(grade.get("name"), "name")}')
    parts.append(f'Ess: {convert_value(grade.get("ess"), "ess")}')
    parts.append(f'Cost: {convert_value(grade.get("cost"), "cost")}')
    parts.append(f'DeviceRating: {convert_value(grade.get("devicerating"), "devicerating")}')
    parts.append(f'Avail: {convert_value(grade.get("avail"), "avail")}')
    parts.append(f'Source: {convert_value(grade.get("source"), "source")}')
    return "{\n\t\t\t" + ",\n\t\t\t".join(parts) + ",\n\t\t}"

def convert_bioware_to_go(bioware):
    """Convert bioware JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'Name: {convert_value(bioware.get("name"), "name")}')
    parts.append(f'Category: {convert_value(bioware.get("category"), "category")}')
    parts.append(f'Ess: {convert_value(bioware.get("ess"), "ess")}')
    parts.append(f'Capacity: {convert_value(bioware.get("capacity"), "capacity")}')
    parts.append(f'Avail: {convert_value(bioware.get("avail"), "avail")}')
    parts.append(f'Cost: {convert_value(bioware.get("cost"), "cost")}')
    parts.append(f'Source: {convert_value(bioware.get("source"), "source")}')
    
    # Optional fields
    if 'rating' in bioware:
        rating = bioware.get("rating")
        if isinstance(rating, str) and rating.isdigit():
            parts.append(f'Rating: {int(rating)}')
        else:
            parts.append(f'Rating: {convert_value(rating, "rating")}')
    if 'limit' in bioware:
        parts.append(f'Limit: {convert_value(bioware.get("limit"), "limit")}')
    if 'bonus' in bioware:
        parts.append(f'Bonus: {convert_bioware_bonus_to_go(bioware.get("bonus"))}')
    if 'forbidden' in bioware:
        parts.append(f'Forbidden: {convert_forbidden_to_go(bioware.get("forbidden"))}')
    if 'bannedgrades' in bioware:
        parts.append(f'BannedGrades: {convert_dict_to_go(bioware.get("bannedgrades"), "bannedgrades")}')
    if 'required' in bioware:
        parts.append(f'Required: {convert_bioware_required_to_go(bioware.get("required"))}')
    if 'allowgear' in bioware:
        parts.append(f'AllowGear: {convert_dict_to_go(bioware.get("allowgear"), "allowgear")}')
    if 'allowsubsystems' in bioware:
        parts.append(f'AllowSubsystems: {convert_dict_to_go(bioware.get("allowsubsystems"), "allowsubsystems")}')
    if 'addweapon' in bioware:
        addweapon = bioware.get("addweapon")
        if addweapon is None:
            parts.append('AddWeapon: ""')
        else:
            parts.append(f'AddWeapon: {convert_value(addweapon, "addweapon")}')
    if 'addtoparentess' in bioware:
        atpe = bioware.get("addtoparentess")
        if atpe is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'AddToParentEss: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'AddToParentEss: &[]bool{brace_open}{str(atpe).lower()}{brace_close}[0]')
    if 'requireparent' in bioware:
        rp = bioware.get("requireparent")
        if rp is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'RequireParent: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'RequireParent: &[]bool{brace_open}{str(rp).lower()}{brace_close}[0]')
    if 'selectside' in bioware:
        ss = bioware.get("selectside")
        if ss is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'SelectSide: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'SelectSide: &[]bool{brace_open}{str(ss).lower()}{brace_close}[0]')
    if 'blocksmounts' in bioware:
        parts.append(f'BlocksMounts: {convert_value(bioware.get("blocksmounts"), "blocksmounts")}')
    if 'pairbonus' in bioware:
        parts.append(f'PairBonus: {convert_pair_bonus_to_go(bioware.get("pairbonus"))}')
    if 'pairinclude' in bioware:
        parts.append(f'PairInclude: {convert_dict_to_go(bioware.get("pairinclude"), "pairinclude")}')
    if 'notes' in bioware:
        parts.append(f'Notes: {convert_value(bioware.get("notes"), "notes")}')
    if 'forcegrade' in bioware:
        parts.append(f'ForceGrade: {convert_value(bioware.get("forcegrade"), "forcegrade")}')
    if 'isgeneware' in bioware:
        ig = bioware.get("isgeneware")
        if ig is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'IsGeneware: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'IsGeneware: &[]bool{brace_open}{str(ig).lower()}{brace_close}[0]')
    
    return "{\n\t\t\t" + ",\n\t\t\t".join(parts) + ",\n\t\t}"

# Read JSON file
with open('data/chummer/bioware.json', 'r') as f:
    data = json.load(f)

# Generate grade entries
grade_entries = []
for grade in data['grades']['grade']:
    grade_id = to_snake_case(grade.get('name', ''))
    grade_go = convert_grade_to_go(grade)
    grade_entries.append(f'\t"{grade_id}": {grade_go}')

# Generate category entries
category_entries = []
for category in data['categories']['category']:
    category_name = category.get('+content', '')
    category_id = to_snake_case(category_name)
    category_go = f'BiowareCategory{{\n\t\t\tName: {convert_value(category_name, "name")}, BlackMarket: {convert_value(category.get("+@blackmarket", ""), "blackmarket")},\n\t\t}}'
    category_entries.append(f'\t"{category_id}": {category_go}')

# Generate bioware entries
bioware_entries = []
bioware_ids_seen = {}
for bioware in data['biowares']['bioware']:
    bioware_id = to_snake_case(bioware.get('name', ''))
    # Handle duplicate IDs by appending a suffix
    if bioware_id in bioware_ids_seen:
        bioware_ids_seen[bioware_id] += 1
        bioware_id = f"{bioware_id}_{bioware_ids_seen[bioware_id]}"
    else:
        bioware_ids_seen[bioware_id] = 0
    bioware_go = convert_bioware_to_go(bioware)
    bioware_entries.append(f'\t"{bioware_id}": {bioware_go}')

# Write to file
with open('pkg/shadowrun/edition/v5/bioware_data.go', 'w') as f:
    f.write('package v5\n\n')
    f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
    f.write('// DataGrades contains bioware grades keyed by their ID (lowercase with underscores)\n')
    f.write('var DataGrades = map[string]Grade{\n')
    f.write(',\n'.join(grade_entries))
    f.write(',\n}\n\n')
    f.write('// DataBiowareCategories contains bioware categories keyed by their ID (lowercase with underscores)\n')
    f.write('var DataBiowareCategories = map[string]BiowareCategory{\n')
    f.write(',\n'.join(category_entries))
    f.write(',\n}\n\n')
    f.write('// DataBiowares contains bioware records keyed by their ID (lowercase with underscores)\n')
    f.write('var DataBiowares = map[string]Bioware{\n')
    f.write(',\n'.join(bioware_entries))
    f.write(',\n}\n')

print(f"Generated {len(grade_entries)} grade entries, {len(category_entries)} category entries, and {len(bioware_entries)} bioware entries")

