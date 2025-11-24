package common

// PersonalLife represents a contact's personal life status
type PersonalLife string

const (
	PersonalLifeDivorced               PersonalLife = "Divorced"
	PersonalLifeFamilialRelationship   PersonalLife = "Familial Relationship"
	PersonalLifeInRelationship         PersonalLife = "In Relationship"
	PersonalLifeNoneOfYourDamnBusiness PersonalLife = "None of Your Damn Business"
	PersonalLifeSingle                 PersonalLife = "Single"
	PersonalLifeUnknown                PersonalLife = "Unknown"
	PersonalLifeWidowed                PersonalLife = "Widowed"
)

// GetAllPersonalLifeValues returns all valid PersonalLife enum values
// This is useful for populating UI dropdowns or API responses
func GetAllPersonalLifeValues() []PersonalLife {
	return []PersonalLife{
		PersonalLifeDivorced,
		PersonalLifeFamilialRelationship,
		PersonalLifeInRelationship,
		PersonalLifeNoneOfYourDamnBusiness,
		PersonalLifeSingle,
		PersonalLifeUnknown,
		PersonalLifeWidowed,
	}
}

// GetAllPersonalLifeStrings returns all valid PersonalLife enum values as strings
// This is useful when you need string values for JSON responses or UI display
func GetAllPersonalLifeStrings() []string {
	return []string{
		string(PersonalLifeDivorced),
		string(PersonalLifeFamilialRelationship),
		string(PersonalLifeInRelationship),
		string(PersonalLifeNoneOfYourDamnBusiness),
		string(PersonalLifeSingle),
		string(PersonalLifeUnknown),
		string(PersonalLifeWidowed),
	}
}

// AddonCategory represents a gear addon category
// Common values: Drugs, Toxins, Custom, etc.
type AddonCategory string

// DamageType represents weapon damage type
type DamageType string

const (
	DamageTypePhysicalFirearm DamageType = "P(f)"
	DamageTypeStunElectric    DamageType = "S(e)"
)

// GetAllDamageTypeValues returns all valid DamageType enum values
func GetAllDamageTypeValues() []DamageType {
	return []DamageType{
		DamageTypePhysicalFirearm,
		DamageTypeStunElectric,
	}
}

// GetAllDamageTypeStrings returns all valid DamageType enum values as strings
func GetAllDamageTypeStrings() []string {
	return []string{
		string(DamageTypePhysicalFirearm),
		string(DamageTypeStunElectric),
	}
}

// UseRange represents weapon use range category
type UseRange string

const (
	UseRangeHoldouts     UseRange = "Holdouts"
	UseRangeLightPistols UseRange = "Light Pistols"
)

// GetAllUseRangeValues returns all valid UseRange enum values
func GetAllUseRangeValues() []UseRange {
	return []UseRange{
		UseRangeHoldouts,
		UseRangeLightPistols,
	}
}

// GetAllUseRangeStrings returns all valid UseRange enum values as strings
func GetAllUseRangeStrings() []string {
	return []string{
		string(UseRangeHoldouts),
		string(UseRangeLightPistols),
	}
}

// SpellElement represents spell element types
type SpellElement string

const (
	SpellElementCombat       SpellElement = "Combat"
	SpellElementDetection    SpellElement = "Detection"
	SpellElementHealth       SpellElement = "Health"
	SpellElementIllusion     SpellElement = "Illusion"
	SpellElementManipulation SpellElement = "Manipulation"
)

// GetAllSpellElementValues returns all valid SpellElement enum values
func GetAllSpellElementValues() []SpellElement {
	return []SpellElement{
		SpellElementCombat,
		SpellElementDetection,
		SpellElementHealth,
		SpellElementIllusion,
		SpellElementManipulation,
	}
}

// GetAllSpellElementStrings returns all valid SpellElement enum values as strings
func GetAllSpellElementStrings() []string {
	return []string{
		string(SpellElementCombat),
		string(SpellElementDetection),
		string(SpellElementHealth),
		string(SpellElementIllusion),
		string(SpellElementManipulation),
	}
}

// Language represents supported language codes
type Language string

const (
	LanguageDeDe Language = "de-de"
	LanguageEnUs Language = "en-us"
	LanguageFrFr Language = "fr-fr"
	LanguageJaJp Language = "ja-jp"
	LanguagePtBr Language = "pt-br"
	LanguageZhCn Language = "zh-cn"
)

// GetAllLanguageValues returns all valid Language enum values
func GetAllLanguageValues() []Language {
	return []Language{
		LanguageDeDe,
		LanguageEnUs,
		LanguageFrFr,
		LanguageJaJp,
		LanguagePtBr,
		LanguageZhCn,
	}
}

// GetAllLanguageStrings returns all valid Language enum values as strings
func GetAllLanguageStrings() []string {
	return []string{
		string(LanguageDeDe),
		string(LanguageEnUs),
		string(LanguageFrFr),
		string(LanguageJaJp),
		string(LanguagePtBr),
		string(LanguageZhCn),
	}
}

// AttributeName represents character attribute names
type AttributeName string

const (
	AttributeNameBOD AttributeName = "BOD"
	AttributeNameAGI AttributeName = "AGI"
	AttributeNameREA AttributeName = "REA"
	AttributeNameSTR AttributeName = "STR"
	AttributeNameCHA AttributeName = "CHA"
	AttributeNameINT AttributeName = "INT"
	AttributeNameLOG AttributeName = "LOG"
	AttributeNameWIL AttributeName = "WIL"
	AttributeNameMAG AttributeName = "MAG"
	AttributeNameRES AttributeName = "RES"
)

// GetAllAttributeNameValues returns all valid AttributeName enum values
func GetAllAttributeNameValues() []AttributeName {
	return []AttributeName{
		AttributeNameBOD,
		AttributeNameAGI,
		AttributeNameREA,
		AttributeNameSTR,
		AttributeNameCHA,
		AttributeNameINT,
		AttributeNameLOG,
		AttributeNameWIL,
		AttributeNameMAG,
		AttributeNameRES,
	}
}

// GetAllAttributeNameStrings returns all valid AttributeName enum values as strings
func GetAllAttributeNameStrings() []string {
	return []string{
		string(AttributeNameBOD),
		string(AttributeNameAGI),
		string(AttributeNameREA),
		string(AttributeNameSTR),
		string(AttributeNameCHA),
		string(AttributeNameINT),
		string(AttributeNameLOG),
		string(AttributeNameWIL),
		string(AttributeNameMAG),
		string(AttributeNameRES),
	}
}

// CanFormPersona represents persona formation type
type CanFormPersona string

const (
	CanFormPersonaParent CanFormPersona = "Parent"
	CanFormPersonaSelf   CanFormPersona = "Self"
)

// GetAllCanFormPersonaValues returns all valid CanFormPersona enum values
func GetAllCanFormPersonaValues() []CanFormPersona {
	return []CanFormPersona{
		CanFormPersonaParent,
		CanFormPersonaSelf,
	}
}

// GetAllCanFormPersonaStrings returns all valid CanFormPersona enum values as strings
func GetAllCanFormPersonaStrings() []string {
	return []string{
		string(CanFormPersonaParent),
		string(CanFormPersonaSelf),
	}
}

// BuildMethod represents character creation build methods
type BuildMethod string

const (
	BuildMethodKarma      BuildMethod = "Karma"
	BuildMethodLifeModule BuildMethod = "LifeModule"
	BuildMethodPriority   BuildMethod = "Priority"
	BuildMethodSumtoTen   BuildMethod = "SumtoTen"
)

// GetAllBuildMethodValues returns all valid BuildMethod enum values
func GetAllBuildMethodValues() []BuildMethod {
	return []BuildMethod{
		BuildMethodKarma,
		BuildMethodLifeModule,
		BuildMethodPriority,
		BuildMethodSumtoTen,
	}
}

// GetAllBuildMethodStrings returns all valid BuildMethod enum values as strings
func GetAllBuildMethodStrings() []string {
	return []string{
		string(BuildMethodKarma),
		string(BuildMethodLifeModule),
		string(BuildMethodPriority),
		string(BuildMethodSumtoTen),
	}
}

// DrugEffectAttributeType represents drug effect attribute types
type DrugEffectAttributeType string

const (
	DrugEffectAttributeTypeMental   DrugEffectAttributeType = "Mental"
	DrugEffectAttributeTypePhysical DrugEffectAttributeType = "Physical"
	DrugEffectAttributeTypeSocial   DrugEffectAttributeType = "Social"
)

// GetAllDrugEffectAttributeTypeValues returns all valid DrugEffectAttributeType enum values
func GetAllDrugEffectAttributeTypeValues() []DrugEffectAttributeType {
	return []DrugEffectAttributeType{
		DrugEffectAttributeTypeMental,
		DrugEffectAttributeTypePhysical,
		DrugEffectAttributeTypeSocial,
	}
}

// GetAllDrugEffectAttributeTypeStrings returns all valid DrugEffectAttributeType enum values as strings
func GetAllDrugEffectAttributeTypeStrings() []string {
	return []string{
		string(DrugEffectAttributeTypeMental),
		string(DrugEffectAttributeTypePhysical),
		string(DrugEffectAttributeTypeSocial),
	}
}

// AddWeapon represents armor add weapon types
type AddWeapon string

const (
	AddWeaponAresBriefcaseShield AddWeapon = "Ares Briefcase Shield"
	AddWeaponBallisticShield     AddWeapon = "Ballistic Shield"
	AddWeaponRiotShield          AddWeapon = "Riot Shield"
	AddWeaponShiawaseArmsSimoom  AddWeapon = "Shiawase Arms Simoom"
)

// GetAllAddWeaponValues returns all valid AddWeapon enum values
func GetAllAddWeaponValues() []AddWeapon {
	return []AddWeapon{
		AddWeaponAresBriefcaseShield,
		AddWeaponBallisticShield,
		AddWeaponRiotShield,
		AddWeaponShiawaseArmsSimoom,
	}
}

// GetAllAddWeaponStrings returns all valid AddWeapon enum values as strings
func GetAllAddWeaponStrings() []string {
	return []string{
		string(AddWeaponAresBriefcaseShield),
		string(AddWeaponBallisticShield),
		string(AddWeaponRiotShield),
		string(AddWeaponShiawaseArmsSimoom),
	}
}

// SynthlinkType represents synthlink connection types
type SynthlinkType string

const (
	SynthlinkTypeExternal SynthlinkType = "External Synthlink"
	SynthlinkTypeInternal SynthlinkType = "Internal Synthlink"
)

// GetAllSynthlinkTypeValues returns all valid SynthlinkType enum values
func GetAllSynthlinkTypeValues() []SynthlinkType {
	return []SynthlinkType{
		SynthlinkTypeExternal,
		SynthlinkTypeInternal,
	}
}

// GetAllSynthlinkTypeStrings returns all valid SynthlinkType enum values as strings
func GetAllSynthlinkTypeStrings() []string {
	return []string{
		string(SynthlinkTypeExternal),
		string(SynthlinkTypeInternal),
	}
}

// PriorityCategory represents priority system categories
type PriorityCategory string

const (
	PriorityCategoryAttributes PriorityCategory = "Attributes"
	PriorityCategoryHeritage   PriorityCategory = "Heritage"
	PriorityCategoryResources  PriorityCategory = "Resources"
	PriorityCategorySkills     PriorityCategory = "Skills"
	PriorityCategoryTalent     PriorityCategory = "Talent"
)

// GetAllPriorityCategoryValues returns all valid PriorityCategory enum values
func GetAllPriorityCategoryValues() []PriorityCategory {
	return []PriorityCategory{
		PriorityCategoryAttributes,
		PriorityCategoryHeritage,
		PriorityCategoryResources,
		PriorityCategorySkills,
		PriorityCategoryTalent,
	}
}

// GetAllPriorityCategoryStrings returns all valid PriorityCategory enum values as strings
func GetAllPriorityCategoryStrings() []string {
	return []string{
		string(PriorityCategoryAttributes),
		string(PriorityCategoryHeritage),
		string(PriorityCategoryResources),
		string(PriorityCategorySkills),
		string(PriorityCategoryTalent),
	}
}

// KnowledgeSkillCategory represents knowledge skill categories
type KnowledgeSkillCategory string

const (
	KnowledgeSkillCategoryAcademic     KnowledgeSkillCategory = "Academic"
	KnowledgeSkillCategoryInterest     KnowledgeSkillCategory = "Interest"
	KnowledgeSkillCategoryLanguage     KnowledgeSkillCategory = "Language"
	KnowledgeSkillCategoryProfessional KnowledgeSkillCategory = "Professional"
	KnowledgeSkillCategoryStreet       KnowledgeSkillCategory = "Street"
)

// GetAllKnowledgeSkillCategoryValues returns all valid KnowledgeSkillCategory enum values
func GetAllKnowledgeSkillCategoryValues() []KnowledgeSkillCategory {
	return []KnowledgeSkillCategory{
		KnowledgeSkillCategoryAcademic,
		KnowledgeSkillCategoryInterest,
		KnowledgeSkillCategoryLanguage,
		KnowledgeSkillCategoryProfessional,
		KnowledgeSkillCategoryStreet,
	}
}

// GetAllKnowledgeSkillCategoryStrings returns all valid KnowledgeSkillCategory enum values as strings
func GetAllKnowledgeSkillCategoryStrings() []string {
	return []string{
		string(KnowledgeSkillCategoryAcademic),
		string(KnowledgeSkillCategoryInterest),
		string(KnowledgeSkillCategoryLanguage),
		string(KnowledgeSkillCategoryProfessional),
		string(KnowledgeSkillCategoryStreet),
	}
}

// WeaponCategory represents weapon category types
type WeaponCategory string

const (
	WeaponCategoryAssaultCannons    WeaponCategory = "Assault Cannons"
	WeaponCategoryGrenadeLaunchers  WeaponCategory = "Grenade Launchers"
	WeaponCategoryHeavyMachineGuns  WeaponCategory = "Heavy Machine Guns"
	WeaponCategoryLightMachineGuns  WeaponCategory = "Light Machine Guns"
	WeaponCategoryMediumMachineGuns WeaponCategory = "Medium Machine Guns"
	WeaponCategoryMissileLaunchers  WeaponCategory = "Missile Launchers"
	WeaponCategoryShotguns          WeaponCategory = "Shotguns"
	WeaponCategorySniperRifles      WeaponCategory = "Sniper Rifles"
	WeaponCategorySportingRifles    WeaponCategory = "Sporting Rifles"
)

// GetAllWeaponCategoryValues returns all valid WeaponCategory enum values
func GetAllWeaponCategoryValues() []WeaponCategory {
	return []WeaponCategory{
		WeaponCategoryAssaultCannons,
		WeaponCategoryGrenadeLaunchers,
		WeaponCategoryHeavyMachineGuns,
		WeaponCategoryLightMachineGuns,
		WeaponCategoryMediumMachineGuns,
		WeaponCategoryMissileLaunchers,
		WeaponCategoryShotguns,
		WeaponCategorySniperRifles,
		WeaponCategorySportingRifles,
	}
}

// GetAllWeaponCategoryStrings returns all valid WeaponCategory enum values as strings
func GetAllWeaponCategoryStrings() []string {
	return []string{
		string(WeaponCategoryAssaultCannons),
		string(WeaponCategoryGrenadeLaunchers),
		string(WeaponCategoryHeavyMachineGuns),
		string(WeaponCategoryLightMachineGuns),
		string(WeaponCategoryMediumMachineGuns),
		string(WeaponCategoryMissileLaunchers),
		string(WeaponCategoryShotguns),
		string(WeaponCategorySniperRifles),
		string(WeaponCategorySportingRifles),
	}
}

// ActiveSkillGroup represents active skill group types
type ActiveSkillGroup string

const (
	ActiveSkillGroupActing      ActiveSkillGroup = "Acting"
	ActiveSkillGroupAthletics   ActiveSkillGroup = "Athletics"
	ActiveSkillGroupBiotech     ActiveSkillGroup = "Biotech"
	ActiveSkillGroupCloseCombat ActiveSkillGroup = "Close Combat"
	ActiveSkillGroupConjuring   ActiveSkillGroup = "Conjuring"
	ActiveSkillGroupCracking    ActiveSkillGroup = "Cracking"
	ActiveSkillGroupElectronics ActiveSkillGroup = "Electronics"
	ActiveSkillGroupEnchanting  ActiveSkillGroup = "Enchanting"
	ActiveSkillGroupEngineering ActiveSkillGroup = "Engineering"
	ActiveSkillGroupFirearms    ActiveSkillGroup = "Firearms"
	ActiveSkillGroupInfluence   ActiveSkillGroup = "Influence"
	ActiveSkillGroupOutdoors    ActiveSkillGroup = "Outdoors"
	ActiveSkillGroupSorcery     ActiveSkillGroup = "Sorcery"
	ActiveSkillGroupStealth     ActiveSkillGroup = "Stealth"
	ActiveSkillGroupTasking     ActiveSkillGroup = "Tasking"
)

// GetAllActiveSkillGroupValues returns all valid ActiveSkillGroup enum values
func GetAllActiveSkillGroupValues() []ActiveSkillGroup {
	return []ActiveSkillGroup{
		ActiveSkillGroupActing,
		ActiveSkillGroupAthletics,
		ActiveSkillGroupBiotech,
		ActiveSkillGroupCloseCombat,
		ActiveSkillGroupConjuring,
		ActiveSkillGroupCracking,
		ActiveSkillGroupElectronics,
		ActiveSkillGroupEnchanting,
		ActiveSkillGroupEngineering,
		ActiveSkillGroupFirearms,
		ActiveSkillGroupInfluence,
		ActiveSkillGroupOutdoors,
		ActiveSkillGroupSorcery,
		ActiveSkillGroupStealth,
		ActiveSkillGroupTasking,
	}
}

// GetAllActiveSkillGroupStrings returns all valid ActiveSkillGroup enum values as strings
func GetAllActiveSkillGroupStrings() []string {
	return []string{
		string(ActiveSkillGroupActing),
		string(ActiveSkillGroupAthletics),
		string(ActiveSkillGroupBiotech),
		string(ActiveSkillGroupCloseCombat),
		string(ActiveSkillGroupConjuring),
		string(ActiveSkillGroupCracking),
		string(ActiveSkillGroupElectronics),
		string(ActiveSkillGroupEnchanting),
		string(ActiveSkillGroupEngineering),
		string(ActiveSkillGroupFirearms),
		string(ActiveSkillGroupInfluence),
		string(ActiveSkillGroupOutdoors),
		string(ActiveSkillGroupSorcery),
		string(ActiveSkillGroupStealth),
		string(ActiveSkillGroupTasking),
	}
}

// LifeModuleSkillGroup represents life module skill group types
// Note: This is the same as ActiveSkillGroup but kept separate for domain clarity
type LifeModuleSkillGroup = ActiveSkillGroup

// GetAllLifeModuleSkillGroupValues returns all valid LifeModuleSkillGroup enum values
// This is an alias for GetAllActiveSkillGroupValues for domain clarity
func GetAllLifeModuleSkillGroupValues() []LifeModuleSkillGroup {
	return GetAllActiveSkillGroupValues()
}

// GetAllLifeModuleSkillGroupStrings returns all valid LifeModuleSkillGroup enum values as strings
// This is an alias for GetAllActiveSkillGroupStrings for domain clarity
func GetAllLifeModuleSkillGroupStrings() []string {
	return GetAllActiveSkillGroupStrings()
}

// SpellCategory represents spell category types
type SpellCategory string

const (
	SpellCategoryCombat       SpellCategory = "Combat"
	SpellCategoryDetection    SpellCategory = "Detection"
	SpellCategoryEnchantments SpellCategory = "Enchantments"
	SpellCategoryHealth       SpellCategory = "Health"
	SpellCategoryIllusion     SpellCategory = "Illusion"
	SpellCategoryManipulation SpellCategory = "Manipulation"
	SpellCategoryRituals      SpellCategory = "Rituals"
)

// GetAllSpellCategoryValues returns all valid SpellCategory enum values
func GetAllSpellCategoryValues() []SpellCategory {
	return []SpellCategory{
		SpellCategoryCombat,
		SpellCategoryDetection,
		SpellCategoryEnchantments,
		SpellCategoryHealth,
		SpellCategoryIllusion,
		SpellCategoryManipulation,
		SpellCategoryRituals,
	}
}

// GetAllSpellCategoryStrings returns all valid SpellCategory enum values as strings
func GetAllSpellCategoryStrings() []string {
	return []string{
		string(SpellCategoryCombat),
		string(SpellCategoryDetection),
		string(SpellCategoryEnchantments),
		string(SpellCategoryHealth),
		string(SpellCategoryIllusion),
		string(SpellCategoryManipulation),
		string(SpellCategoryRituals),
	}
}

// SpellRange represents spell range types
type SpellRange string

const (
	SpellRangeLOS     SpellRange = "LOS"
	SpellRangeLOSA    SpellRange = "LOS (A)"
	SpellRangeS       SpellRange = "S"
	SpellRangeSA      SpellRange = "S (A)"
	SpellRangeSpecial SpellRange = "Special"
	SpellRangeT       SpellRange = "T"
	SpellRangeTA      SpellRange = "T (A)"
)

// GetAllSpellRangeValues returns all valid SpellRange enum values
func GetAllSpellRangeValues() []SpellRange {
	return []SpellRange{
		SpellRangeLOS,
		SpellRangeLOSA,
		SpellRangeS,
		SpellRangeSA,
		SpellRangeSpecial,
		SpellRangeT,
		SpellRangeTA,
	}
}

// GetAllSpellRangeStrings returns all valid SpellRange enum values as strings
func GetAllSpellRangeStrings() []string {
	return []string{
		string(SpellRangeLOS),
		string(SpellRangeLOSA),
		string(SpellRangeS),
		string(SpellRangeSA),
		string(SpellRangeSpecial),
		string(SpellRangeT),
		string(SpellRangeTA),
	}
}

// ComplexFormTarget represents complex form target types
type ComplexFormTarget string

const (
	ComplexFormTargetCyberware ComplexFormTarget = "Cyberware"
	ComplexFormTargetDevice    ComplexFormTarget = "Device"
	ComplexFormTargetFile      ComplexFormTarget = "File"
	ComplexFormTargetHost      ComplexFormTarget = "Host"
	ComplexFormTargetIC        ComplexFormTarget = "IC"
	ComplexFormTargetIcon      ComplexFormTarget = "Icon"
	ComplexFormTargetPersona   ComplexFormTarget = "Persona"
	ComplexFormTargetSelf      ComplexFormTarget = "Self"
	ComplexFormTargetSprite    ComplexFormTarget = "Sprite"
)

// GetAllComplexFormTargetValues returns all valid ComplexFormTarget enum values
func GetAllComplexFormTargetValues() []ComplexFormTarget {
	return []ComplexFormTarget{
		ComplexFormTargetCyberware,
		ComplexFormTargetDevice,
		ComplexFormTargetFile,
		ComplexFormTargetHost,
		ComplexFormTargetIC,
		ComplexFormTargetIcon,
		ComplexFormTargetPersona,
		ComplexFormTargetSelf,
		ComplexFormTargetSprite,
	}
}

// GetAllComplexFormTargetStrings returns all valid ComplexFormTarget enum values as strings
func GetAllComplexFormTargetStrings() []string {
	return []string{
		string(ComplexFormTargetCyberware),
		string(ComplexFormTargetDevice),
		string(ComplexFormTargetFile),
		string(ComplexFormTargetHost),
		string(ComplexFormTargetIC),
		string(ComplexFormTargetIcon),
		string(ComplexFormTargetPersona),
		string(ComplexFormTargetSelf),
		string(ComplexFormTargetSprite),
	}
}

// ProgramCategory represents program category types
type ProgramCategory string

const (
	ProgramCategoryAdvancedPrograms ProgramCategory = "Advanced Programs"
	ProgramCategoryAutosofts        ProgramCategory = "Autosofts"
	ProgramCategoryCommonPrograms   ProgramCategory = "Common Programs"
	ProgramCategoryHackingPrograms  ProgramCategory = "Hacking Programs"
	ProgramCategorySoftware         ProgramCategory = "Software"
)

// GetAllProgramCategoryValues returns all valid ProgramCategory enum values
func GetAllProgramCategoryValues() []ProgramCategory {
	return []ProgramCategory{
		ProgramCategoryAdvancedPrograms,
		ProgramCategoryAutosofts,
		ProgramCategoryCommonPrograms,
		ProgramCategoryHackingPrograms,
		ProgramCategorySoftware,
	}
}

// GetAllProgramCategoryStrings returns all valid ProgramCategory enum values as strings
func GetAllProgramCategoryStrings() []string {
	return []string{
		string(ProgramCategoryAdvancedPrograms),
		string(ProgramCategoryAutosofts),
		string(ProgramCategoryCommonPrograms),
		string(ProgramCategoryHackingPrograms),
		string(ProgramCategorySoftware),
	}
}

// SpriteType represents sprite type types
type SpriteType string

const (
	SpriteTypeCompanion  SpriteType = "Companion Sprite"
	SpriteTypeCourier    SpriteType = "Courier Sprite"
	SpriteTypeCrack      SpriteType = "Crack Sprite"
	SpriteTypeData       SpriteType = "Data Sprite"
	SpriteTypeFault      SpriteType = "Fault Sprite"
	SpriteTypeGeneralist SpriteType = "Generalist Sprite"
	SpriteTypeMachine    SpriteType = "Machine Sprite"
)

// GetAllSpriteTypeValues returns all valid SpriteType enum values
func GetAllSpriteTypeValues() []SpriteType {
	return []SpriteType{
		SpriteTypeCompanion,
		SpriteTypeCourier,
		SpriteTypeCrack,
		SpriteTypeData,
		SpriteTypeFault,
		SpriteTypeGeneralist,
		SpriteTypeMachine,
	}
}

// GetAllSpriteTypeStrings returns all valid SpriteType enum values as strings
func GetAllSpriteTypeStrings() []string {
	return []string{
		string(SpriteTypeCompanion),
		string(SpriteTypeCourier),
		string(SpriteTypeCrack),
		string(SpriteTypeData),
		string(SpriteTypeFault),
		string(SpriteTypeGeneralist),
		string(SpriteTypeMachine),
	}
}

// EquipmentCategory represents equipment category types
type EquipmentCategory string

const (
	EquipmentCategoryArmor       EquipmentCategory = "Armor"
	EquipmentCategoryBioware     EquipmentCategory = "Bioware"
	EquipmentCategoryCyberware   EquipmentCategory = "Cyberware"
	EquipmentCategoryDrugs       EquipmentCategory = "Drugs"
	EquipmentCategoryElectronics EquipmentCategory = "Electronics"
	EquipmentCategoryGeneware    EquipmentCategory = "Geneware"
	EquipmentCategoryMagic       EquipmentCategory = "Magic"
	EquipmentCategoryNanoware    EquipmentCategory = "Nanoware"
	EquipmentCategorySoftware    EquipmentCategory = "Software"
	EquipmentCategoryVehicles    EquipmentCategory = "Vehicles"
	EquipmentCategoryWeapons     EquipmentCategory = "Weapons"
)

// GetAllEquipmentCategoryValues returns all valid EquipmentCategory enum values
func GetAllEquipmentCategoryValues() []EquipmentCategory {
	return []EquipmentCategory{
		EquipmentCategoryArmor,
		EquipmentCategoryBioware,
		EquipmentCategoryCyberware,
		EquipmentCategoryDrugs,
		EquipmentCategoryElectronics,
		EquipmentCategoryGeneware,
		EquipmentCategoryMagic,
		EquipmentCategoryNanoware,
		EquipmentCategorySoftware,
		EquipmentCategoryVehicles,
		EquipmentCategoryWeapons,
	}
}

// GetAllEquipmentCategoryStrings returns all valid EquipmentCategory enum values as strings
func GetAllEquipmentCategoryStrings() []string {
	return []string{
		string(EquipmentCategoryArmor),
		string(EquipmentCategoryBioware),
		string(EquipmentCategoryCyberware),
		string(EquipmentCategoryDrugs),
		string(EquipmentCategoryElectronics),
		string(EquipmentCategoryGeneware),
		string(EquipmentCategoryMagic),
		string(EquipmentCategoryNanoware),
		string(EquipmentCategorySoftware),
		string(EquipmentCategoryVehicles),
		string(EquipmentCategoryWeapons),
	}
}

// MentorSkillCategory represents mentor skill category types
type MentorSkillCategory string

const (
	MentorSkillCategoryPhysicalActive  MentorSkillCategory = "Physical Active"
	MentorSkillCategorySocialActive    MentorSkillCategory = "Social Active"
	MentorSkillCategoryTechnicalActive MentorSkillCategory = "Technical Active"
	MentorSkillCategoryVehicleActive   MentorSkillCategory = "Vehicle Active"
)

// GetAllMentorSkillCategoryValues returns all valid MentorSkillCategory enum values
func GetAllMentorSkillCategoryValues() []MentorSkillCategory {
	return []MentorSkillCategory{
		MentorSkillCategoryPhysicalActive,
		MentorSkillCategorySocialActive,
		MentorSkillCategoryTechnicalActive,
		MentorSkillCategoryVehicleActive,
	}
}

// GetAllMentorSkillCategoryStrings returns all valid MentorSkillCategory enum values as strings
func GetAllMentorSkillCategoryStrings() []string {
	return []string{
		string(MentorSkillCategoryPhysicalActive),
		string(MentorSkillCategorySocialActive),
		string(MentorSkillCategoryTechnicalActive),
		string(MentorSkillCategoryVehicleActive),
	}
}

// EchoAttributeType represents echo attribute types
type EchoAttributeType string

const (
	EchoAttributeTypeLOG EchoAttributeType = "LOG"
	EchoAttributeTypeWIL EchoAttributeType = "WIL"
)

// GetAllEchoAttributeTypeValues returns all valid EchoAttributeType enum values
func GetAllEchoAttributeTypeValues() []EchoAttributeType {
	return []EchoAttributeType{
		EchoAttributeTypeLOG,
		EchoAttributeTypeWIL,
	}
}

// GetAllEchoAttributeTypeStrings returns all valid EchoAttributeType enum values as strings
func GetAllEchoAttributeTypeStrings() []string {
	return []string{
		string(EchoAttributeTypeLOG),
		string(EchoAttributeTypeWIL),
	}
}

// BiowareAttributeType represents bioware attribute types
type BiowareAttributeType string

const (
	BiowareAttributeTypeINT BiowareAttributeType = "INT"
	BiowareAttributeTypeLOG BiowareAttributeType = "LOG"
)

// GetAllBiowareAttributeTypeValues returns all valid BiowareAttributeType enum values
func GetAllBiowareAttributeTypeValues() []BiowareAttributeType {
	return []BiowareAttributeType{
		BiowareAttributeTypeINT,
		BiowareAttributeTypeLOG,
	}
}

// GetAllBiowareAttributeTypeStrings returns all valid BiowareAttributeType enum values as strings
func GetAllBiowareAttributeTypeStrings() []string {
	return []string{
		string(BiowareAttributeTypeINT),
		string(BiowareAttributeTypeLOG),
	}
}

// PackEnhancementType represents pack enhancement types
type PackEnhancementType string

const (
	PackEnhancementTypeAudioEnhancements  PackEnhancementType = "Audio Enhancements"
	PackEnhancementTypeVisionEnhancements PackEnhancementType = "Vision Enhancements"
)

// GetAllPackEnhancementTypeValues returns all valid PackEnhancementType enum values
func GetAllPackEnhancementTypeValues() []PackEnhancementType {
	return []PackEnhancementType{
		PackEnhancementTypeAudioEnhancements,
		PackEnhancementTypeVisionEnhancements,
	}
}

// GetAllPackEnhancementTypeStrings returns all valid PackEnhancementType enum values as strings
func GetAllPackEnhancementTypeStrings() []string {
	return []string{
		string(PackEnhancementTypeAudioEnhancements),
		string(PackEnhancementTypeVisionEnhancements),
	}
}

// ParagonWeaponType represents paragon weapon type types
type ParagonWeaponType string

const (
	ParagonWeaponTypeArchery            ParagonWeaponType = "Archery"
	ParagonWeaponTypeAutomatics         ParagonWeaponType = "Automatics"
	ParagonWeaponTypeBlades             ParagonWeaponType = "Blades"
	ParagonWeaponTypeClubs              ParagonWeaponType = "Clubs"
	ParagonWeaponTypeExoticMeleeWeapon  ParagonWeaponType = "Exotic Melee Weapon"
	ParagonWeaponTypeExoticRangedWeapon ParagonWeaponType = "Exotic Ranged Weapon"
	ParagonWeaponTypeGunnery            ParagonWeaponType = "Gunnery"
	ParagonWeaponTypeHeavyWeapons       ParagonWeaponType = "Heavy Weapons"
	ParagonWeaponTypeLongarms           ParagonWeaponType = "Longarms"
	ParagonWeaponTypePistols            ParagonWeaponType = "Pistols"
	ParagonWeaponTypeThrowingWeapons    ParagonWeaponType = "Throwing Weapons"
	ParagonWeaponTypeUnarmedCombat      ParagonWeaponType = "Unarmed Combat"
)

// GetAllParagonWeaponTypeValues returns all valid ParagonWeaponType enum values
func GetAllParagonWeaponTypeValues() []ParagonWeaponType {
	return []ParagonWeaponType{
		ParagonWeaponTypeArchery,
		ParagonWeaponTypeAutomatics,
		ParagonWeaponTypeBlades,
		ParagonWeaponTypeClubs,
		ParagonWeaponTypeExoticMeleeWeapon,
		ParagonWeaponTypeExoticRangedWeapon,
		ParagonWeaponTypeGunnery,
		ParagonWeaponTypeHeavyWeapons,
		ParagonWeaponTypeLongarms,
		ParagonWeaponTypePistols,
		ParagonWeaponTypeThrowingWeapons,
		ParagonWeaponTypeUnarmedCombat,
	}
}

// GetAllParagonWeaponTypeStrings returns all valid ParagonWeaponType enum values as strings
func GetAllParagonWeaponTypeStrings() []string {
	return []string{
		string(ParagonWeaponTypeArchery),
		string(ParagonWeaponTypeAutomatics),
		string(ParagonWeaponTypeBlades),
		string(ParagonWeaponTypeClubs),
		string(ParagonWeaponTypeExoticMeleeWeapon),
		string(ParagonWeaponTypeExoticRangedWeapon),
		string(ParagonWeaponTypeGunnery),
		string(ParagonWeaponTypeHeavyWeapons),
		string(ParagonWeaponTypeLongarms),
		string(ParagonWeaponTypePistols),
		string(ParagonWeaponTypeThrowingWeapons),
		string(ParagonWeaponTypeUnarmedCombat),
	}
}

// PowerActionType represents power action type types
type PowerActionType string

const (
	PowerActionTypeComplex   PowerActionType = "Complex"
	PowerActionTypeFree      PowerActionType = "Free"
	PowerActionTypeInterrupt PowerActionType = "Interrupt"
	PowerActionTypeSimple    PowerActionType = "Simple"
	PowerActionTypeSpecial   PowerActionType = "Special"
)

// GetAllPowerActionTypeValues returns all valid PowerActionType enum values
func GetAllPowerActionTypeValues() []PowerActionType {
	return []PowerActionType{
		PowerActionTypeComplex,
		PowerActionTypeFree,
		PowerActionTypeInterrupt,
		PowerActionTypeSimple,
		PowerActionTypeSpecial,
	}
}

// GetAllPowerActionTypeStrings returns all valid PowerActionType enum values as strings
func GetAllPowerActionTypeStrings() []string {
	return []string{
		string(PowerActionTypeComplex),
		string(PowerActionTypeFree),
		string(PowerActionTypeInterrupt),
		string(PowerActionTypeSimple),
		string(PowerActionTypeSpecial),
	}
}

// CritterPowerAction represents critter power action types
type CritterPowerAction string

const (
	CritterPowerActionAsRitual CritterPowerAction = "As ritual"
	CritterPowerActionAuto     CritterPowerAction = "Auto"
	CritterPowerActionComplex  CritterPowerAction = "Complex"
	CritterPowerActionFree     CritterPowerAction = "Free"
	CritterPowerActionNone     CritterPowerAction = "None"
	CritterPowerActionSimple   CritterPowerAction = "Simple"
	CritterPowerActionSpecial  CritterPowerAction = "Special"
)

// GetAllCritterPowerActionValues returns all valid CritterPowerAction enum values
func GetAllCritterPowerActionValues() []CritterPowerAction {
	return []CritterPowerAction{
		CritterPowerActionAsRitual,
		CritterPowerActionAuto,
		CritterPowerActionComplex,
		CritterPowerActionFree,
		CritterPowerActionNone,
		CritterPowerActionSimple,
		CritterPowerActionSpecial,
	}
}

// GetAllCritterPowerActionStrings returns all valid CritterPowerAction enum values as strings
func GetAllCritterPowerActionStrings() []string {
	return []string{
		string(CritterPowerActionAsRitual),
		string(CritterPowerActionAuto),
		string(CritterPowerActionComplex),
		string(CritterPowerActionFree),
		string(CritterPowerActionNone),
		string(CritterPowerActionSimple),
		string(CritterPowerActionSpecial),
	}
}

// VehicleControlType represents vehicle control types
type VehicleControlType string

const (
	VehicleControlTypeManualSR5 VehicleControlType = "Manual [SR5]"
	VehicleControlTypeNone      VehicleControlType = "None"
	VehicleControlTypeRemoteSR5 VehicleControlType = "Remote [SR5]"
)

// GetAllVehicleControlTypeValues returns all valid VehicleControlType enum values
func GetAllVehicleControlTypeValues() []VehicleControlType {
	return []VehicleControlType{
		VehicleControlTypeManualSR5,
		VehicleControlTypeNone,
		VehicleControlTypeRemoteSR5,
	}
}

// GetAllVehicleControlTypeStrings returns all valid VehicleControlType enum values as strings
func GetAllVehicleControlTypeStrings() []string {
	return []string{
		string(VehicleControlTypeManualSR5),
		string(VehicleControlTypeNone),
		string(VehicleControlTypeRemoteSR5),
	}
}

// VehicleMountFlexibility represents vehicle mount flexibility types
type VehicleMountFlexibility string

const (
	VehicleMountFlexibilityFlexibleSR5 VehicleMountFlexibility = "Flexible [SR5]"
	VehicleMountFlexibilityNone        VehicleMountFlexibility = "None"
)

// GetAllVehicleMountFlexibilityValues returns all valid VehicleMountFlexibility enum values
func GetAllVehicleMountFlexibilityValues() []VehicleMountFlexibility {
	return []VehicleMountFlexibility{
		VehicleMountFlexibilityFlexibleSR5,
		VehicleMountFlexibilityNone,
	}
}

// GetAllVehicleMountFlexibilityStrings returns all valid VehicleMountFlexibility enum values as strings
func GetAllVehicleMountFlexibilityStrings() []string {
	return []string{
		string(VehicleMountFlexibilityFlexibleSR5),
		string(VehicleMountFlexibilityNone),
	}
}

// VehicleMountSize represents vehicle mount size types
type VehicleMountSize string

const (
	VehicleMountSizeBuiltIn       VehicleMountSize = "Built-In"
	VehicleMountSizeHeavy         VehicleMountSize = "Heavy"
	VehicleMountSizeHeavyDrone    VehicleMountSize = "Heavy (Drone)"
	VehicleMountSizeHeavySR5      VehicleMountSize = "Heavy [SR5]"
	VehicleMountSizeHugeDrone     VehicleMountSize = "Huge (Drone)"
	VehicleMountSizeLargeDrone    VehicleMountSize = "Large (Drone)"
	VehicleMountSizeLight         VehicleMountSize = "Light"
	VehicleMountSizeMiniDrone     VehicleMountSize = "Mini (Drone)"
	VehicleMountSizeSmallDrone    VehicleMountSize = "Small (Drone)"
	VehicleMountSizeStandard      VehicleMountSize = "Standard"
	VehicleMountSizeStandardDrone VehicleMountSize = "Standard (Drone)"
)

// GetAllVehicleMountSizeValues returns all valid VehicleMountSize enum values
func GetAllVehicleMountSizeValues() []VehicleMountSize {
	return []VehicleMountSize{
		VehicleMountSizeBuiltIn,
		VehicleMountSizeHeavy,
		VehicleMountSizeHeavyDrone,
		VehicleMountSizeHeavySR5,
		VehicleMountSizeHugeDrone,
		VehicleMountSizeLargeDrone,
		VehicleMountSizeLight,
		VehicleMountSizeMiniDrone,
		VehicleMountSizeSmallDrone,
		VehicleMountSizeStandard,
		VehicleMountSizeStandardDrone,
	}
}

// GetAllVehicleMountSizeStrings returns all valid VehicleMountSize enum values as strings
func GetAllVehicleMountSizeStrings() []string {
	return []string{
		string(VehicleMountSizeBuiltIn),
		string(VehicleMountSizeHeavy),
		string(VehicleMountSizeHeavyDrone),
		string(VehicleMountSizeHeavySR5),
		string(VehicleMountSizeHugeDrone),
		string(VehicleMountSizeLargeDrone),
		string(VehicleMountSizeLight),
		string(VehicleMountSizeMiniDrone),
		string(VehicleMountSizeSmallDrone),
		string(VehicleMountSizeStandard),
		string(VehicleMountSizeStandardDrone),
	}
}

// VehicleMountVisibility represents vehicle mount visibility types
type VehicleMountVisibility string

const (
	VehicleMountVisibilityExternalSR5 VehicleMountVisibility = "External [SR5]"
	VehicleMountVisibilityNone        VehicleMountVisibility = "None"
)

// GetAllVehicleMountVisibilityValues returns all valid VehicleMountVisibility enum values
func GetAllVehicleMountVisibilityValues() []VehicleMountVisibility {
	return []VehicleMountVisibility{
		VehicleMountVisibilityExternalSR5,
		VehicleMountVisibilityNone,
	}
}

// GetAllVehicleMountVisibilityStrings returns all valid VehicleMountVisibility enum values as strings
func GetAllVehicleMountVisibilityStrings() []string {
	return []string{
		string(VehicleMountVisibilityExternalSR5),
		string(VehicleMountVisibilityNone),
	}
}

// VesselMaterialType represents vessel material types
type VesselMaterialType string

const (
	VesselMaterialTypeArmoredReinforcedMaterial VesselMaterialType = "Armored/Reinforced Material"
	VesselMaterialTypeAverageMaterial           VesselMaterialType = "Average Material"
	VesselMaterialTypeCheapMaterial             VesselMaterialType = "Cheap Material"
	VesselMaterialTypeFragileMaterial           VesselMaterialType = "Fragile Material"
	VesselMaterialTypeHardenedMaterial          VesselMaterialType = "Hardened Material"
	VesselMaterialTypeHeavyMaterial             VesselMaterialType = "Heavy Material"
	VesselMaterialTypeHeavyStructuralMaterial   VesselMaterialType = "Heavy Structural Material"
	VesselMaterialTypeReinforcedMaterial        VesselMaterialType = "Reinforced Material"
	VesselMaterialTypeStructuralMaterial        VesselMaterialType = "Structural Material"
)

// GetAllVesselMaterialTypeValues returns all valid VesselMaterialType enum values
func GetAllVesselMaterialTypeValues() []VesselMaterialType {
	return []VesselMaterialType{
		VesselMaterialTypeArmoredReinforcedMaterial,
		VesselMaterialTypeAverageMaterial,
		VesselMaterialTypeCheapMaterial,
		VesselMaterialTypeFragileMaterial,
		VesselMaterialTypeHardenedMaterial,
		VesselMaterialTypeHeavyMaterial,
		VesselMaterialTypeHeavyStructuralMaterial,
		VesselMaterialTypeReinforcedMaterial,
		VesselMaterialTypeStructuralMaterial,
	}
}

// GetAllVesselMaterialTypeStrings returns all valid VesselMaterialType enum values as strings
func GetAllVesselMaterialTypeStrings() []string {
	return []string{
		string(VesselMaterialTypeArmoredReinforcedMaterial),
		string(VesselMaterialTypeAverageMaterial),
		string(VesselMaterialTypeCheapMaterial),
		string(VesselMaterialTypeFragileMaterial),
		string(VesselMaterialTypeHardenedMaterial),
		string(VesselMaterialTypeHeavyMaterial),
		string(VesselMaterialTypeHeavyStructuralMaterial),
		string(VesselMaterialTypeReinforcedMaterial),
		string(VesselMaterialTypeStructuralMaterial),
	}
}
