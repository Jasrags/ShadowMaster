#!/usr/bin/env python3
"""Generate settings_data.go from settings.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_value_to_go(value, field_name):
    """Convert a JSON value to Go literal"""
    if value is None:
        return "nil"
    elif isinstance(value, bool):
        return "true" if value else "false"
    elif isinstance(value, (int, float)):
        return str(value)
    elif isinstance(value, str):
        # Escape quotes and special characters
        escaped = value.replace('\\', '\\\\').replace('"', '\\"')
        return f'"{escaped}"'
    elif isinstance(value, dict):
        # Handle nested structures
        if field_name == "karmacost":
            return convert_karmacost_to_go(value)
        elif field_name == "bannedwaregrades":
            return convert_bannedwaregrades_to_go(value)
        elif field_name == "books":
            return convert_books_to_go(value)
        elif field_name == "customdatadirectorynames":
            return convert_customdatadirectorynames_to_go(value)
        elif field_name == "redlinerexclusion":
            return convert_redlineexclusion_to_go(value)
        else:
            return "nil"  # TODO: Handle other nested structures
    elif isinstance(value, list):
        # Handle lists
        if not value:
            return "nil"
        # For now, return nil for complex lists
        return "nil"  # TODO: Handle lists properly
    else:
        return "nil"

def convert_karmacost_to_go(kc):
    """Convert karmacost dict to Go struct literal"""
    if not kc:
        return "nil"
    
    # Mapping from JSON field names to Go struct field names for KarmaCost
    karma_cost_mapping = {
        "karmaattribute": "KarmaAttribute",
        "karmaquality": "KarmaQuality",
        "karmaspecialization": "KarmaSpecialization",
        "karmaknospecialization": "KarmaKnoSpecialization",
        "karmanewknowledgeskill": "KarmaNewKnowledgeSkill",
        "karmanewactiveskill": "KarmaNewActiveSkill",
        "karmanewskillgroup": "KarmaNewSkillGroup",
        "karmaimproveknowledgeskill": "KarmaImproveKnowledgeSkill",
        "karmaimproveactiveskill": "KarmaImproveActiveSkill",
        "karmaimproveskillgroup": "KarmaImproveSkillGroup",
        "karmaspell": "KarmaSpell",
        "karmaenhancement": "KarmaEnhancement",
        "karmanewcomplexform": "KarmaNewComplexForm",
        "karmaimprovecomplexform": "KarmaImproveComplexForm",
        "karmanewaiprogram": "KarmaNewAIProgram",
        "karmanewaiadvancedprogram": "KarmaNewAIAdvancedProgram",
        "karmacontact": "KarmaContact",
        "karmaenemy": "KarmaEnemy",
        "karmacarryover": "KarmaCarryOver",
        "karmaspirit": "KarmaSpirit",
        "karmamaneuver": "KarmaManeuver",
        "karmainitiation": "KarmaInitiation",
        "karmainitiationflat": "KarmaInitiationFlat",
        "karmametamagic": "KarmaMetamagic",
        "karmacomplexformoption": "KarmaComplexFormOption",
        "karmacomplexformskillsoft": "KarmaComplexFormSkillsoft",
        "karmajoingroup": "KarmaJoinGroup",
        "karmaleavegroup": "KarmaLeaveGroup",
        "karmaalchemicalfocus": "KarmaAlchemicalFocus",
        "karmabanishingfocus": "KarmaBanishingFocus",
        "karmabindingfocus": "KarmaBindingFocus",
        "karmacenteringfocus": "KarmaCenteringFocus",
        "karmacounterspellingfocus": "KarmaCounterspellingFocus",
        "karmadisenchantingfocus": "KarmaDisenchantingFocus",
        "karmaflexiblesignaturefocus": "KarmaFlexibleSignatureFocus",
        "karmamaskingfocus": "KarmaMaskingFocus",
        "karmapowerfocus": "KarmaPowerFocus",
        "karmaqifocus": "KarmaQIFocus",
        "karmaritualspellcastingfocus": "KarmaRitualSpellcastingFocus",
        "karmaspellcastingfocus": "KarmaSpellcastingFocus",
        "karmaspellshapingfocus": "KarmaSpellshapingFocus",
        "karmasummoningfocus": "KarmaSummoningFocus",
        "karmasustainingfocus": "KarmaSustainingFocus",
        "karmaweaponfocus": "KarmaWeaponFocus",
        "karmamysadpp": "KarmaMysadPP",
        "karmaspiritfettering": "KarmaSpiritFettering",
        "karmatechnique": "KarmaTechnique",
    }
    
    parts = []
    for key, value in sorted(kc.items()):
        if value is not None:
            go_key = karma_cost_mapping.get(key, key[0].upper() + key[1:])
            parts.append(f'{go_key}: {json.dumps(value)}')
    
    if not parts:
        return "nil"
    
    return "&KarmaCost{" + ", ".join(parts) + "}"

def convert_bannedwaregrades_to_go(bwg):
    """Convert bannedwaregrades dict to Go struct literal"""
    if not bwg or "grade" not in bwg:
        return "nil"
    
    grade = bwg["grade"]
    if isinstance(grade, list):
        grade_str = "[]interface{}{" + ", ".join(json.dumps(g) for g in grade) + "}"
    else:
        grade_str = json.dumps(grade)
    
    return f"&BannedWareGrades{{Grade: {grade_str}}}"

def convert_books_to_go(books):
    """Convert books dict to Go struct literal"""
    if not books or "book" not in books:
        return "nil"
    
    book = books["book"]
    if isinstance(book, list):
        book_str = "[]interface{}{" + ", ".join(json.dumps(b) for b in book) + "}"
    else:
        book_str = json.dumps(book)
    
    return f"&Books{{Book: {book_str}}}"

def convert_customdatadirectorynames_to_go(cddn):
    """Convert customdatadirectorynames dict to Go struct literal"""
    if not cddn or "customdatadirectoryname" not in cddn:
        return "nil"
    
    cddn_item = cddn["customdatadirectoryname"]
    if isinstance(cddn_item, list):
        # Handle list
        items = []
        for item in cddn_item:
            items.append(f'CustomDataDirectoryName{{DirectoryName: {json.dumps(item["directoryname"])}, Order: {json.dumps(item["order"])}, Enabled: {json.dumps(item["enabled"])}}}')
        items_str = "[]interface{}{" + ", ".join(items) + "}"
        return f"&CustomDataDirectoryNames{{CustomDataDirectoryName: {items_str}}}"
    elif isinstance(cddn_item, dict):
        # Handle single item
        item_str = f'CustomDataDirectoryName{{DirectoryName: {json.dumps(cddn_item["directoryname"])}, Order: {json.dumps(cddn_item["order"])}, Enabled: {json.dumps(cddn_item["enabled"])}}}'
        return f"&CustomDataDirectoryNames{{CustomDataDirectoryName: {item_str}}}"
    else:
        return "nil"

def convert_redlineexclusion_to_go(re):
    """Convert redlineexclusion dict to Go struct literal"""
    if not re or "limb" not in re:
        return "nil"
    
    limb = re["limb"]
    if isinstance(limb, list):
        limb_str = "[]interface{}{" + ", ".join(json.dumps(l) for l in limb) + "}"
    else:
        limb_str = json.dumps(limb)
    
    return f"&RedlineExclusion{{Limb: {limb_str}}}"

def get_field_mapping():
    """Get mapping from JSON field names to Go struct field names"""
    # This mapping is extracted from the struct definition
    # Format: json_field_name -> GoFieldName
    return {
        "licenserestricted": "LicenseRestricted",
        "morelethalgameplay": "MoreLethalGameplay",
        "spiritforcebasedontotalmag": "SpiritForceBasedOnTotalMag",
        "unarmedimprovementsapplytoweapons": "UnarmedImprovementsApplyToWeapons",
        "allowinitiationincreatemode": "AllowInitiationInCreateMode",
        "usepointsonbrokengroups": "UsePointsOnBrokenGroups",
        "dontdoublequalities": "DontDoubleQualities",
        "dontdoublequalityrefunds": "DontDoubleQualityRefunds",
        "ignoreart": "IgnoreART",
        "cyberlegmovement": "CyberlegMovement",
        "allow2ndmaxattribute": "Allow2ndMaxAttribute",
        "dronearmormultiplierenabled": "DroneArmorMultiplierEnabled",
        "nosinglearmorencumbrance": "NoSingleArmorEncumbrance",
        "ignorecomplexformlimit": "IgnoreComplexFormLimit",
        "noarmorencumbrance": "NoArmorEncumbrance",
        "uncappedarmoraccessorybonuses": "UncappedArmorAccessoryBonuses",
        "esslossreducesmaximumonly": "EssLossReducesMaximumOnly",
        "allowskillregrouping": "AllowSkillRegrouping",
        "metatypecostskarma": "MetatypeCostsKarma",
        "allowcyberwareessdiscounts": "AllowCyberwareEssDiscounts",
        "maximumarmormodifications": "MaximumArmorModifications",
        "armordegredation": "ArmorDegredation",
        "specialkarmacostbasedonshownvalue": "SpecialKarmaCostBasedOnShownValue",
        "exceedpositivequalities": "ExceedPositiveQualities",
        "exceedpositivequalitiescostdoubled": "ExceedPositiveQualitiesCostDoubled",
        "mysaddppcareer": "MysadPPCareer",
        "mysadeptsecondmagattribute": "MysadAdeptSecondMagAttribute",
        "exceednegativequalities": "ExceedNegativeQualities",
        "exceednegativequalitiesnobonus": "ExceedNegativeQualitiesNoBonus",
        "multiplyrestrictedcost": "MultiplyRestrictedCost",
        "multiplyforbiddencost": "MultiplyForbiddenCost",
        "donotroundessenceinternally": "DoNotRoundEssenceInternally",
        "enableenemytracking": "EnableEnemyTracking",
        "enemykarmaqualitylimit": "EnemyKarmaQualityLimit",
        "enforcecapacity": "EnforceCapacity",
        "restrictrecoil": "RestrictRecoil",
        "unrestrictednuyen": "UnrestrictedNuyen",
        "allowhigherstackedfoci": "AllowHigherStackedFoci",
        "alloweditpartofbaseweapon": "AllowEditPartOfBaseWeapon",
        "breakskillgroupsincreatemode": "BreakSkillGroupsInCreateMode",
        "allowpointbuyspecializationsonkarmaskills": "AllowPointBuySpecializationsOnKarmaSkills",
        "extendanydetectionspell": "ExtendAnyDetectionSpell",
        "allowskilldicerolling": "AllowSkillDiceRolling",
        "dontusecyberlimbcalculation": "DontUseCyberlimbCalculation",
        "alternatemetatypeattributekarma": "AlternateMetatypeAttributeKarma",
        "reverseattributepriorityorder": "ReverseAttributePriorityOrder",
        "allowobsolescentupgrade": "AllowObsolescentUpgrade",
        "allowbiowaresuites": "AllowBiowareSuites",
        "freespiritpowerpointsmag": "FreeSpiritPowerPointsMag",
        "compensateskillgroupkarmadifference": "CompensateSkillGroupKarmaDifference",
        "autobackstory": "AutoBackstory",
        "freemartialartspecialization": "FreeMartialArtSpecialization",
        "priorityspellsasadeptpowers": "PrioritySpellsAsAdeptPowers",
        "usecalculatedpublicawareness": "UseCalculatedPublicAwareness",
        "increasedimprovedabilitymodifier": "IncreasedImprovedAbilityModifier",
        "allowfreegrids": "AllowFreeGrids",
        "allowtechnomancerschooling": "AllowTechnomancerSchooling",
        "unclampattributeminimum": "UnclampAttributeMinimum",
        "dronemods": "DroneMods",
        "dronemodsmaximumpilot": "DroneModsMaximumPilot",
        "nuyenperbpwftm": "NuyenPerBPWFTM",
        "nuyenperbpwftp": "NuyenPerBPWFTP",
        "dronearmorflatnumber": "DroneArmorFlatNumber",
        "metatypecostskarmamultiplier": "MetatypeCostsKarmaMultiplier",
        "limbcount": "LimbCount",
        "restrictedcostmultiplier": "RestrictedCostMultiplier",
        "forbiddencostmultiplier": "ForbiddenCostMultiplier",
        "cyberlimbattributebonuscap": "CyberlimbAttributeBonusCap",
        "dicepenaltysustaining": "DicePenaltySustaining",
        "mininitiativedice": "MinInitiativeDice",
        "maxinitiativedice": "MaxInitiativeDice",
        "minastralinitiativedice": "MinAstralInitiativeDice",
        "maxastralinitiativedice": "MaxAstralInitiativeDice",
        "mincoldsiminitiativedice": "MinColdSimInitiativeDice",
        "maxcoldsiminitiativedice": "MaxColdSimInitiativeDice",
        "minhotsiminitiativedice": "MinHotSimInitiativeDice",
        "maxhotsiminitiativedice": "MaxHotSimInitiativeDice",
        "contactpointsexpression": "ContactPointsExpression",
        "knowledgepointsexpression": "KnowledgePointsExpression",
        "chargenkarmatonuyenexpression": "ChargenKarmaToNuyenExpression",
        "boundspiritexpression": "BoundSpiritExpression",
        "compiledspiritexpression": "CompiledSpiritExpression",
        "nuyenformat": "NuyenFormat",
        "essenceformat": "EssenceFormat",
        "buildmethod": "BuildMethod",
        "buildpoints": "BuildPoints",
        "qualitykarmalimit": "QualityKarmaLimit",
        "priorityarray": "PriorityArray",
        "prioritytable": "PriorityTable",
        "sumtoten": "SumToTen",
        "availability": "Availability",
        "nuyenmaxbp": "NuyenMaxBP",
        "compiledspriteexpression": "CompiledSpriteExpression",
        "cyberlimbattributebonuscapoverride": "CyberlimbAttributeBonusCapOverride",
        "exceednegativequalitieslimit": "ExceedNegativeQualitiesLimit",
        "excludelimbslot": "ExcludeLimbSlot",
        "karmacost": "KarmaCost",
        "bannedwaregrades": "BannedWareGrades",
        "books": "Books",
        "customdatadirectorynames": "CustomDataDirectoryNames",
        "redlinerexclusion": "RedlineExclusion",
    }

def convert_setting_to_go(setting, setting_id):
    """Convert a setting object to Go struct literal"""
    setting_id_str = setting["id"]
    name = setting["name"]
    
    field_mapping = get_field_mapping()
    
    # Build field assignments
    parts = [
        f'ID: "{setting_id_str}"',
        f'Name: {json.dumps(name)}',
    ]
    
    # Process all fields from the JSON
    field_order = [
        # Boolean flags
        "licenserestricted", "morelethalgameplay", "spiritforcebasedontotalmag",
        "unarmedimprovementsapplytoweapons", "allowinitiationincreatemode",
        "usepointsonbrokengroups", "dontdoublequalities", "dontdoublequalityrefunds",
        "ignoreart", "cyberlegmovement", "allow2ndmaxattribute",
        "dronearmormultiplierenabled", "nosinglearmorencumbrance",
        "ignorecomplexformlimit", "noarmorencumbrance",
        "uncappedarmoraccessorybonuses", "esslossreducesmaximumonly",
        "allowskillregrouping", "metatypecostskarma",
        "allowcyberwareessdiscounts", "maximumarmormodifications",
        "armordegredation", "specialkarmacostbasedonshownvalue",
        "exceedpositivequalities", "exceedpositivequalitiescostdoubled",
        "mysaddppcareer", "mysadeptsecondmagattribute",
        "exceednegativequalities", "exceednegativequalitiesnobonus",
        "multiplyrestrictedcost", "multiplyforbiddencost",
        "donotroundessenceinternally", "enableenemytracking",
        "enemykarmaqualitylimit", "enforcecapacity",
        "restrictrecoil", "unrestrictednuyen",
        "allowhigherstackedfoci", "alloweditpartofbaseweapon",
        "breakskillgroupsincreatemode", "allowpointbuyspecializationsonkarmaskills",
        "extendanydetectionspell", "allowskilldicerolling",
        "dontusecyberlimbcalculation", "alternatemetatypeattributekarma",
        "reverseattributepriorityorder", "allowobsolescentupgrade",
        "allowbiowaresuites", "freespiritpowerpointsmag",
        "compensateskillgroupkarmadifference", "autobackstory",
        "freemartialartspecialization", "priorityspellsasadeptpowers",
        "usecalculatedpublicawareness", "increasedimprovedabilitymodifier",
        "allowfreegrids", "allowtechnomancerschooling",
        "unclampattributeminimum", "dronemods", "dronemodsmaximumpilot",
        # Numeric values
        "nuyenperbpwftm", "nuyenperbpwftp", "dronearmorflatnumber",
        "metatypecostskarmamultiplier", "limbcount",
        "restrictedcostmultiplier", "forbiddencostmultiplier",
        "cyberlimbattributebonuscap", "dicepenaltysustaining",
        "mininitiativedice", "maxinitiativedice",
        "minastralinitiativedice", "maxastralinitiativedice",
        "mincoldsiminitiativedice", "maxcoldsiminitiativedice",
        "minhotsiminitiativedice", "maxhotsiminitiativedice",
        # Formula expressions
        "contactpointsexpression", "knowledgepointsexpression",
        "chargenkarmatonuyenexpression", "boundspiritexpression",
        "compiledspiritexpression",
        # Format strings
        "nuyenformat", "essenceformat",
        # Build method and points
        "buildmethod", "buildpoints", "qualitykarmalimit", "priorityarray",
        "prioritytable", "sumtoten", "availability", "nuyenmaxbp",
        "compiledspriteexpression", "cyberlimbattributebonuscapoverride",
        "exceednegativequalitieslimit",
        # Optional/nullable
        "excludelimbslot",
        # Nested structures (handled separately)
        "karmacost", "bannedwaregrades", "books",
        "customdatadirectorynames", "redlinerexclusion",
    ]
    
    # Process fields in order
    for field in field_order:
        if field in setting:
            value = setting[field]
            go_field_name = field_mapping.get(field, field[0].upper() + field[1:])
            
            if value is None and field == "excludelimbslot":
                parts.append(f'{go_field_name}: nil')
            elif field == "excludelimbslot" and value is not None:
                # excludelimbslot is a *string, so we need to create a pointer
                parts.append(f'{go_field_name}: &[]string{{{json.dumps(value)}}}[0]')
            elif field in ["karmacost", "bannedwaregrades", "books", "customdatadirectorynames", "redlinerexclusion"]:
                go_value = convert_value_to_go(value, field)
                if go_value != "nil":
                    parts.append(f'{go_field_name}: {go_value}')
            else:
                go_value = convert_value_to_go(value, field)
                if go_value != "nil" or field == "excludelimbslot":
                    parts.append(f'{go_field_name}: {go_value}')
    
    # Handle any remaining fields not in our order list
    for key, value in setting.items():
        if key not in ["id", "name"] and key not in field_order:
            go_field_name = field_mapping.get(key, key[0].upper() + key[1:])
            go_value = convert_value_to_go(value, key)
            if go_value != "nil" or key == "excludelimbslot":
                parts.append(f'{go_field_name}: {go_value}')
    
    return f'''	"{setting_id}": {{
		{",\n\t\t".join(parts)},
	}},'''

def main():
    with open("data/chummer/settings.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    print("package v5")
    print()
    
    # Settings
    settings = data["settings"]["setting"]
    print("// DataSettings contains setting records keyed by their ID (lowercase with underscores)")
    print("// These are character creation and gameplay configuration settings")
    print("var DataSettings = map[string]Setting{")
    
    used_setting_ids = {}
    for setting in settings:
        name = setting["name"]
        setting_id = to_snake_case(name)
        
        # Handle duplicates by appending numeric suffix
        original_id = setting_id
        suffix = 0
        while setting_id in used_setting_ids:
            suffix += 1
            setting_id = f"{original_id}_{suffix}"
        
        used_setting_ids[setting_id] = True
        print(convert_setting_to_go(setting, setting_id))
    
    print("}")

if __name__ == "__main__":
    main()

