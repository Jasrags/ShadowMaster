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
        # Complex structure - delegate to convert_dict_to_go
        return convert_dict_to_go(value, field_name)
    return str(value)

def convert_to_map_string_interface(d):
    """Convert a dictionary to Go map[string]interface{} syntax"""
    if not d:
        return "nil"
    
    parts = []
    for k, v in d.items():
        # Keys must be strings in map[string]interface{}
        go_key = convert_value(k, 'key')  # Key as string
        if isinstance(v, dict):
            go_value = convert_to_map_string_interface(v)
        elif isinstance(v, list):
            items = []
            for item in v:
                if isinstance(item, dict):
                    items.append(convert_to_map_string_interface(item))
                else:
                    items.append(convert_value(item, 'value'))
            brace_open = '{'
            brace_close = '}'
            go_value = f"[]interface{brace_open}{brace_close}{brace_open}{', '.join(items)}{brace_close}"
        else:
            go_value = convert_value(v, 'value')
        parts.append(f"{go_key}: {go_value}")
    
    brace_open = '{'
    brace_close = '}'
    return f"map[string]interface{brace_open}{brace_close}{brace_open}\n\t\t\t\t\t\t{', '.join(parts)},\n\t\t\t\t\t{brace_close}"

def convert_dict_to_go(d, context=""):
    """Convert a dictionary to Go struct initialization"""
    if not d:
        return "nil"
    
    # Handle map[string]interface{} for complex structures like geardetails
    if context == "geardetails":
        return convert_to_map_string_interface(d)
    
    # Handle SelectTextBonus (common across gear and other types)
    if '+@xml' in d or '+@xpath' in d or '+@allowedit' in d or context == "selecttext":
        parts = []
        if '+@xml' in d:
            parts.append(f"XML: {convert_value(d.get('+@xml'), 'xml')}")
        if '+@xpath' in d:
            parts.append(f"XPath: {convert_value(d.get('+@xpath'), 'xpath')}")
        if '+@allowedit' in d:
            parts.append(f"AllowEdit: {convert_value(d.get('+@allowedit'), 'allowedit')}")
        if not parts:
            return "&SelectTextBonus{}"
        return f"&common.SelectTextBonus{{\n\t\t\t\t\t{', '.join(parts)},\n\t\t\t\t}}"
    
    # Handle LimitModifier
    if 'limit' in d and 'value' in d and 'condition' in d:
        return f"common.LimitModifier{{\n\t\t\t\tLimit: {convert_value(d.get('limit'), 'limit')}, Value: {convert_value(d.get('value'), 'value')}, Condition: {convert_value(d.get('condition'), 'condition')},\n\t\t\t}}"
    
    # Handle SelectSkill
    if 'val' in d or '+@limittoskill' in d or '+@limittoattribute' in d or '+@knowledgeskills' in d or '+@skillcategory' in d or '+@maximumrating' in d or 'applytorating' in d or 'excludeattribute' in d or '+@excludecategory' in d or context == "selectskill":
        parts = []
        if 'val' in d:
            parts.append(f"Val: {convert_value(d.get('val'), 'val')}")
        if '+@limittoskill' in d:
            parts.append(f"LimitToAttribute: {convert_value(d.get('+@limittoskill'), 'limittoskill')}")
        if '+@limittoattribute' in d:
            parts.append(f"LimitToAttribute: {convert_value(d.get('+@limittoattribute'), 'limittoattribute')}")
        if '+@maximumrating' in d:
            parts.append(f"MaximumRating: {convert_value(d.get('+@maximumrating'), 'maximumrating')}")
        if '+@knowledgeskills' in d:
            parts.append(f"KnowledgeSkills: {convert_value(d.get('+@knowledgeskills'), 'knowledgeskills')}")
        if '+@skillcategory' in d:
            parts.append(f"SkillCategory: {convert_value(d.get('+@skillcategory'), 'skillcategory')}")
        if 'applytorating' in d:
            parts.append(f"ApplyToRating: {convert_value(d.get('applytorating'), 'applytorating')}")
        if 'excludeattribute' in d:
            parts.append(f"ExcludeAttribute: {convert_value(d.get('excludeattribute'), 'excludeattribute')}")
        if '+@excludecategory' in d:
            parts.append(f"ExcludeAttribute: {convert_value(d.get('+@excludecategory'), 'excludecategory')}")
        if parts:
            return f"&common.SelectSkill{{\n\t\t\t\t{', '.join(parts)},\n\t\t\t}}"
    
    # Handle WeaponDetails (for selectweapon)
    if '+@weapondetails' in d or context == "selectweapon":
        if '+@weapondetails' in d:
            return f"&common.WeaponDetails{{\n\t\t\t\tDetails: {convert_value(d.get('+@weapondetails'), 'weapondetails')},\n\t\t\t}}"
        return "nil"
    
    # Handle SpecificSkillBonus
    if 'name' in d and 'bonus' in d:
        bonus_val = d.get('bonus')
        # Bonus can be int or string (like "Rating")
        if isinstance(bonus_val, int):
            bonus_val = str(bonus_val)
        elif isinstance(bonus_val, str) and bonus_val.isdigit():
            # Keep as string but it's numeric
            bonus_val = convert_value(bonus_val, 'bonus')
        else:
            bonus_val = convert_value(bonus_val, 'bonus')
        return f"common.SpecificSkillBonus{{\n\t\t\t\tName: {convert_value(d.get('name'), 'name')}, Bonus: {bonus_val},\n\t\t\t}}"
    
    # Handle SkillAttributeBonus
    if 'name' in d and 'bonus' in d and context == "skillattribute":
        return f"&common.SkillAttributeBonus{{\n\t\t\t\tName: {convert_value(d.get('name'), 'name')}, Bonus: {convert_value(d.get('bonus'), 'bonus')},\n\t\t\t}}"
    
    # Generic struct - just convert key-value pairs
    lines = []
    for k, v in d.items():
        go_key = to_snake_case(k) if not k.startswith('+') else k.replace('+', '').replace('@', '')
        if go_key and go_key[0].islower():
            go_key = go_key[0].upper() + go_key[1:]
        lines.append(f"{go_key}: {convert_value(v, k)}")
    return "{\n\t\t\t\t" + ",\n\t\t\t\t".join(lines) + ",\n\t\t\t}"

def convert_gear_bonus_to_go(d):
    """Convert gear bonus dictionary to Go GearBonus struct"""
    base_bonus_parts = []
    gear_specific_parts = []
    
    # Handle BaseBonus fields first (shared with bioware/cyberware)
    # Handle limitmodifier
    if 'limitmodifier' in d:
        lm = d.get('limitmodifier')
        if isinstance(lm, list):
            items = [convert_dict_to_go(item, "limitmodifier") for item in lm]
            items_str = ', '.join(items)
            brace_open = '{'
            brace_close = '}'
            base_bonus_parts.append(f"LimitModifier: []interface{brace_open}{brace_close}{brace_open}{items_str}{brace_close}")
        else:
            base_bonus_parts.append(f"LimitModifier: {convert_dict_to_go(lm, 'limitmodifier')}")
    
    # Handle specificskill
    if 'specificskill' in d:
        ss = d.get('specificskill')
        if isinstance(ss, list):
            items = [convert_dict_to_go(item, "specificskill") for item in ss]
            items_str = ', '.join(items)
            brace_open = '{'
            brace_close = '}'
            base_bonus_parts.append(f"SpecificSkill: []interface{brace_open}{brace_close}{brace_open}{items_str}{brace_close}")
        else:
            base_bonus_parts.append(f"SpecificSkill: {convert_dict_to_go(ss, 'specificskill')}")
    
    # Handle selectskill
    if 'selectskill' in d:
        base_bonus_parts.append(f"SelectSkill: {convert_dict_to_go(d.get('selectskill'), 'selectskill')}")
    
    # Handle skillattribute
    if 'skillattribute' in d:
        sa_dict = d.get('skillattribute')
        name = convert_value(sa_dict.get('name'), 'name')
        bonus = convert_value(sa_dict.get('bonus'), 'bonus')
        base_bonus_parts.append(f"SkillAttribute: &common.SkillAttributeBonus{{\n\t\t\t\t\t\tName: {name}, Bonus: {bonus},\n\t\t\t\t\t}}")
    
    # Handle string fields from BaseBonus
    base_string_fields = {
        'toxincontactresist': 'ToxinContactResist',
        'toxininhalationresist': 'ToxinInhalationResist',
        'pathogencontactresist': 'PathogenContactResist',
        'pathogeninhalationresist': 'PathogenInhalationResist',
    }
    for field, go_field in base_string_fields.items():
        if field in d:
            base_bonus_parts.append(f"{go_field}: {convert_value(d.get(field), field)}")
    
    
    # Handle gear-specific bonus fields (NOT in BaseBonus)
    if 'selecttradition' in d:
        st = d.get('selecttradition')
        if st is None:
            gear_specific_parts.append("SelectTradition: nil")
        elif isinstance(st, dict):
            gear_specific_parts.append(f"SelectTradition: {convert_dict_to_go(st, 'selecttradition')}")
        else:
            gear_specific_parts.append(f"SelectTradition: {convert_value(st, 'selecttradition')}")
    
    if 'selecttext' in d:
        st = d.get('selecttext')
        if st is None:
            gear_specific_parts.append("SelectText: &common.SelectTextBonus{}")
        else:
            gear_specific_parts.append(f"SelectText: {convert_dict_to_go(st, 'selecttext')}")
    
    if 'selectweapon' in d:
        sw = d.get('selectweapon')
        if sw is None:
            gear_specific_parts.append("SelectWeapon: nil")
        elif isinstance(sw, dict):
            gear_specific_parts.append(f"SelectWeapon: {convert_dict_to_go(sw, 'selectweapon')}")
        else:
            gear_specific_parts.append(f"SelectWeapon: {convert_value(sw, 'selectweapon')}")
    
    if 'selectpowers' in d:
        sp = d.get('selectpowers')
        if sp is None:
            gear_specific_parts.append("SelectPowers: nil")
        elif isinstance(sp, dict):
            # SelectPowers is interface{}, use map syntax
            gear_specific_parts.append(f"SelectPowers: {convert_to_map_string_interface(sp)}")
        else:
            gear_specific_parts.append(f"SelectPowers: {convert_value(sp, 'selectpowers')}")
    
    if 'selectrestricted' in d:
        sr = d.get('selectrestricted')
        if sr is None:
            gear_specific_parts.append("SelectRestricted: nil")
        elif isinstance(sr, dict):
            gear_specific_parts.append(f"SelectRestricted: {convert_dict_to_go(sr, 'selectrestricted')}")
        else:
            gear_specific_parts.append(f"SelectRestricted: {convert_value(sr, 'selectrestricted')}")
    
    if 'spellcategory' in d:
        sc = d.get('spellcategory')
        if isinstance(sc, list):
            items = [convert_dict_to_go(item, "spellcategory") for item in sc]
            items_str = ', '.join(items)
            brace_open = '{'
            brace_close = '}'
            gear_specific_parts.append(f"SpellCategory: []interface{brace_open}{brace_close}{brace_open}{items_str}{brace_close}")
        else:
            gear_specific_parts.append(f"SpellCategory: {convert_dict_to_go(sc, 'spellcategory')}")
    
    if 'smartlink' in d:
        sl = d.get('smartlink')
        if sl is None:
            gear_specific_parts.append("SmartLink: nil")
        elif isinstance(sl, dict):
            gear_specific_parts.append(f"SmartLink: {convert_dict_to_go(sl, 'smartlink')}")
        else:
            # Handle string values for smartlink
            gear_specific_parts.append(f"SmartLink: {convert_value(sl, 'smartlink')}")
    
    if 'weaponspecificdice' in d:
        wsd = d.get('weaponspecificdice')
        if wsd is None:
            gear_specific_parts.append("WeaponSpecificDice: nil")
        elif isinstance(wsd, dict):
            # WeaponSpecificDice is interface{}, use map syntax
            gear_specific_parts.append(f"WeaponSpecificDice: {convert_to_map_string_interface(wsd)}")
        else:
            gear_specific_parts.append(f"WeaponSpecificDice: {convert_value(wsd, 'weaponspecificdice')}")
    
    if 'skillsoft' in d:
        ss = d.get('skillsoft')
        if ss is None:
            gear_specific_parts.append("SkillSoft: nil")
        elif isinstance(ss, dict):
            gear_specific_parts.append(f"SkillSoft: {convert_dict_to_go(ss, 'skillsoft')}")
        else:
            gear_specific_parts.append(f"SkillSoft: {convert_value(ss, 'skillsoft')}")
    
    if 'activesoft' in d:
        as_soft = d.get('activesoft')
        if as_soft is None:
            gear_specific_parts.append("ActiveSoft: nil")
        elif isinstance(as_soft, dict):
            gear_specific_parts.append(f"ActiveSoft: {convert_dict_to_go(as_soft, 'activesoft')}")
        else:
            gear_specific_parts.append(f"ActiveSoft: {convert_value(as_soft, 'activesoft')}")
    
    # Handle matrixinitiativedice (can be string or dict)
    if 'matrixinitiativedice' in d:
        mid = d.get('matrixinitiativedice')
        if mid is not None:
            if isinstance(mid, dict):
                # Extract content if available, otherwise empty string
                content = mid.get('+content', mid.get('content', ''))
                if content:
                    gear_specific_parts.append(f"MatrixInitiativeDice: {convert_value(content, 'matrixinitiativedice')}")
                else:
                    gear_specific_parts.append('MatrixInitiativeDice: ""')
            else:
                gear_specific_parts.append(f"MatrixInitiativeDice: {convert_value(mid, 'matrixinitiativedice')}")
    
    # Handle simple string fields (gear-specific)
    gear_string_fields = {
        'essencepenaltyt100': 'EssencePenaltyT100',
        'toxincontactimmune': 'ToxinContactImmune',
        'toxininhalationimmune': 'ToxinInhalationImmune',
        'pathogencontactimmune': 'PathogenContactImmune',
        'pathogeninhalationimmune': 'PathogenInhalationImmune',
        '+@unique': 'Unique',
    }
    for field, go_field in gear_string_fields.items():
        if field in d and d.get(field) is not None:
            gear_specific_parts.append(f"{go_field}: {convert_value(d.get(field), field)}")
    
    if not base_bonus_parts and not gear_specific_parts:
        return "nil"
    
    # Build the struct with BaseBonus and gear-specific fields
    all_parts = []
    if base_bonus_parts:
        base_bonus_fields = ',\n\t\t\t\t\t'.join(base_bonus_parts)
        all_parts.append(f"BaseBonus: common.BaseBonus{{\n\t\t\t\t\t{base_bonus_fields},\n\t\t\t\t}}")
    if gear_specific_parts:
        all_parts.extend(gear_specific_parts)
    
    all_fields = ',\n\t\t\t\t'.join(all_parts)
    return f"&GearBonus{{\n\t\t\t\t{all_fields},\n\t\t\t}}"

def convert_gear_required_to_go(d):
    """Convert gear required dictionary to Go GearRequired struct"""
    parts = []
    
    if 'oneof' in d:
        oo = d.get('oneof')
        oo_parts = []
        if 'cyberware' in oo:
            cw = oo.get('cyberware')
            if isinstance(cw, list):
                items = [convert_value(item, 'cyberware') for item in cw]
                brace_open = '{'
                brace_close = '}'
                oo_parts.append(f"Cyberware: []interface{brace_open}{brace_close}{brace_open}{', '.join(items)}{brace_close}")
            else:
                oo_parts.append(f"Cyberware: {convert_value(cw, 'cyberware')}")
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
            q = oo.get('quality')
            if isinstance(q, list):
                items = [convert_value(item, 'quality') for item in q]
                brace_open = '{'
                brace_close = '}'
                oo_parts.append(f"Quality: []interface{brace_open}{brace_close}{brace_open}{', '.join(items)}{brace_close}")
            else:
                oo_parts.append(f"Quality: {convert_value(q, 'quality')}")
        if 'power' in oo:
            oo_parts.append(f"Power: {convert_value(oo.get('power'), 'power')}")
        if 'group' in oo:
            oo_parts.append(f"Group: {convert_value(oo.get('group'), 'group')}")
        if oo_parts:
            parts.append(f"OneOf: &common.RequirementOneOf{{\n\t\t\t\t\t{', '.join(oo_parts)},\n\t\t\t\t}}")
    
    if 'allof' in d:
        ao = d.get('allof')
        ao_parts = []
        if 'metatype' in ao:
            ao_parts.append(f"Metatype: {convert_value(ao.get('metatype'), 'metatype')}")
        if 'quality' in ao:
            ao_parts.append(f"Quality: {convert_value(ao.get('quality'), 'quality')}")
        if 'power' in ao:
            ao_parts.append(f"Power: {convert_value(ao.get('power'), 'power')}")
        if 'magenabled' in ao:
            ao_parts.append(f"MagEnabled: {convert_value(ao.get('magenabled'), 'magenabled')}")
        if ao_parts:
            parts.append(f"AllOf: &common.RequirementAllOf{{\n\t\t\t\t\t{', '.join(ao_parts)},\n\t\t\t\t}}")
    
    if 'parentdetails' in d:
        pd = d.get('parentdetails')
        if pd:
            if 'name' in pd:
                parts.append(f"Parent: &common.ParentDetails{{\n\t\t\t\t\tName: {convert_value(pd.get('name'), 'name')},\n\t\t\t\t}}")
            elif 'ammoforweapontype' in pd:
                # Handle parentdetails with ammoforweapontype
                parts.append(f"Parent: &common.ParentDetails{{\n\t\t\t\t\tName: {convert_value(pd.get('ammoforweapontype'), 'ammoforweapontype')},\n\t\t\t\t}}")
    
    if 'geardetails' in d:
        gd = d.get('geardetails')
        if gd:
            # GearDetails can be complex (e.g., with OR/AND structures)
            # Since it's interface{} in Go, use map[string]interface{} syntax
            if isinstance(gd, dict):
                parts.append(f"GearDetails: {convert_dict_to_go(gd, 'geardetails')}")
            else:
                parts.append(f"GearDetails: {convert_value(gd, 'geardetails')}")
    
    if not parts:
        return "nil"
    
    return f"&GearRequired{{\n\t\t\t\t{', '.join(parts)},\n\t\t\t}}"

def convert_gear_to_go(gear):
    """Convert gear JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'Name: {convert_value(gear.get("name"), "name")}')
    parts.append(f'Category: {convert_value(gear.get("category"), "category")}')
    parts.append(f'Source: {convert_value(gear.get("source"), "source")}')
    
    # Optional fields
    if 'page' in gear and gear.get("page"):
        parts.append(f'Page: {convert_value(gear.get("page"), "page")}')
    if 'rating' in gear and gear.get("rating") is not None:
        parts.append(f'Rating: {convert_value(gear.get("rating"), "rating")}')
    if 'avail' in gear and gear.get("avail") is not None:
        parts.append(f'Avail: {convert_value(gear.get("avail"), "avail")}')
    if 'cost' in gear and gear.get("cost") is not None:
        parts.append(f'Cost: {convert_value(gear.get("cost"), "cost")}')
    if 'costfor' in gear and gear.get("costfor") is not None:
        parts.append(f'CostFor: {convert_value(gear.get("costfor"), "costfor")}')
    if 'addweapon' in gear and gear.get("addweapon") is not None:
        aw = gear.get("addweapon")
        # AddWeapon is a string field in Go, but can be a dict in JSON
        if isinstance(aw, dict):
            # Extract content if available, otherwise empty string
            content = aw.get('+content', aw.get('content', ''))
            if content:
                parts.append(f'AddWeapon: {convert_value(content, "addweapon")}')
            else:
                parts.append('AddWeapon: ""')
        else:
            parts.append(f'AddWeapon: {convert_value(aw, "addweapon")}')
    if 'ammoforweapontype' in gear and gear.get("ammoforweapontype") is not None:
        afwt = gear.get("ammoforweapontype")
        # AmmoForWeaponType is a string field in Go, but can be a dict in JSON
        if isinstance(afwt, dict):
            # Extract content if available, otherwise empty string
            content = afwt.get('+content', afwt.get('content', ''))
            if content:
                parts.append(f'AmmoForWeaponType: {convert_value(content, "ammoforweapontype")}')
            else:
                parts.append('AmmoForWeaponType: ""')
        else:
            parts.append(f'AmmoForWeaponType: {convert_value(afwt, "ammoforweapontype")}')
    if 'isflechetteammo' in gear:
        is_flechette = gear.get("isflechetteammo")
        if is_flechette is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'IsFlechetteAmmo: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'IsFlechetteAmmo: &[]bool{brace_open}{str(is_flechette).lower()}{brace_close}[0]')
    if 'flechetteweaponbonus' in gear and gear.get("flechetteweaponbonus") is not None:
        fwb = gear.get("flechetteweaponbonus")
        # FlechetteWeaponBonus is a string field in Go, but can be a dict in JSON
        if isinstance(fwb, dict):
            # Convert dict to empty string for now
            parts.append('FlechetteWeaponBonus: ""')
        else:
            parts.append(f'FlechetteWeaponBonus: {convert_value(fwb, "flechetteweaponbonus")}')
    if 'weaponbonus' in gear and gear.get("weaponbonus") is not None:
        wb = gear.get("weaponbonus")
        # WeaponBonus is a string field in Go, but can be a dict in JSON
        # Convert dict to string representation
        if isinstance(wb, dict):
            # For now, convert to empty string or extract a key value
            # This may need refinement based on actual data
            parts.append('WeaponBonus: ""')
        else:
            parts.append(f'WeaponBonus: {convert_value(wb, "weaponbonus")}')
    if 'addoncategory' in gear:
        addon = gear.get("addoncategory")
        if isinstance(addon, list):
            items = [convert_value(item, "addoncategory") for item in addon]
            brace_open = '{'
            brace_close = '}'
            parts.append(f'AddonCategory: []string{brace_open}{', '.join(items)}{brace_close}')
        else:
            parts.append(f'AddonCategory: {convert_value(addon, "addoncategory")}')
    if 'required' in gear:
        req = gear.get('required')
        if req:
            parts.append(f'Required: {convert_gear_required_to_go(req)}')
    if 'requireparent' in gear:
        req_parent = gear.get("requireparent")
        if req_parent is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'RequireParent: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'RequireParent: &[]bool{brace_open}{str(req_parent).lower()}{brace_close}[0]')
    if 'bonus' in gear:
        bonus = gear.get('bonus')
        if bonus:
            parts.append(f'Bonus: {convert_gear_bonus_to_go(bonus)}')
    
    return "{\n\t\t\t" + ",\n\t\t\t".join(parts) + ",\n\t\t}"

# Read JSON file
with open('data/chummer/gear.json', 'r') as f:
    data = json.load(f)

# Generate category entries
category_entries = []
for category in data['categories']['category']:
    if isinstance(category, str):
        # Handle string categories (no black market info)
        category_name = category
        category_id = to_snake_case(category_name)
        category_go = f'GearCategory{{\n\t\t\tName: {convert_value(category_name, "name")}, BlackMarket: "",\n\t\t}}'
    else:
        category_name = category.get('+content', '')
        category_id = to_snake_case(category_name)
        category_go = f'GearCategory{{\n\t\t\tName: {convert_value(category_name, "name")}, BlackMarket: {convert_value(category.get("+@blackmarket", ""), "blackmarket")},\n\t\t}}'
    category_entries.append(f'\t"{category_id}": {category_go}')

# Generate gear entries
gear_entries = []
gear_ids_seen = {}
for gear in data['gears']['gear']:
    gear_id = to_snake_case(gear.get('name', ''))
    # Handle duplicate IDs by appending a suffix
    if gear_id in gear_ids_seen:
        gear_ids_seen[gear_id] += 1
        gear_id = f"{gear_id}_{gear_ids_seen[gear_id]}"
    else:
        gear_ids_seen[gear_id] = 0
    gear_go = convert_gear_to_go(gear)
    gear_entries.append(f'\t"{gear_id}": {gear_go}')

# Write to file
with open('pkg/shadowrun/edition/v5/gear_data.go', 'w') as f:
    f.write('package v5\n\n')
    f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
    f.write('// DataGearCategories contains gear categories keyed by their ID (lowercase with underscores)\n')
    f.write('var DataGearCategories = map[string]GearCategory{\n')
    f.write(',\n'.join(category_entries))
    f.write(',\n}\n\n')
    f.write('// DataGears contains gear records keyed by their ID (lowercase with underscores)\n')
    f.write('var DataGears = map[string]Gear{\n')
    f.write(',\n'.join(gear_entries))
    f.write(',\n}\n')

print(f"Generated {len(category_entries)} categories and {len(gear_entries)} gears")

