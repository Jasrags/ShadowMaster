package v5

// KarmaCost represents karma costs for various character advancement options
type KarmaCost struct {
	KarmaAttribute               string `json:"karmaattribute,omitempty"`
	KarmaQuality                 string `json:"karmaquality,omitempty"`
	KarmaSpecialization          string `json:"karmaspecialization,omitempty"`
	KarmaKnoSpecialization       string `json:"karmaknospecialization,omitempty"`
	KarmaNewKnowledgeSkill       string `json:"karmanewknowledgeskill,omitempty"`
	KarmaNewActiveSkill          string `json:"karmanewactiveskill,omitempty"`
	KarmaNewSkillGroup           string `json:"karmanewskillgroup,omitempty"`
	KarmaImproveKnowledgeSkill   string `json:"karmaimproveknowledgeskill,omitempty"`
	KarmaImproveActiveSkill      string `json:"karmaimproveactiveskill,omitempty"`
	KarmaImproveSkillGroup       string `json:"karmaimproveskillgroup,omitempty"`
	KarmaSpell                   string `json:"karmaspell,omitempty"`
	KarmaEnhancement             string `json:"karmaenhancement,omitempty"`
	KarmaNewComplexForm          string `json:"karmanewcomplexform,omitempty"`
	KarmaImproveComplexForm      string `json:"karmaimprovecomplexform,omitempty"`
	KarmaNewAIProgram            string `json:"karmanewaiprogram,omitempty"`
	KarmaNewAIAdvancedProgram    string `json:"karmanewaiadvancedprogram,omitempty"`
	KarmaContact                 string `json:"karmacontact,omitempty"`
	KarmaEnemy                   string `json:"karmaenemy,omitempty"`
	KarmaCarryOver               string `json:"karmacarryover,omitempty"`
	KarmaSpirit                  string `json:"karmaspirit,omitempty"`
	KarmaManeuver                string `json:"karmamaneuver,omitempty"`
	KarmaInitiation              string `json:"karmainitiation,omitempty"`
	KarmaInitiationFlat          string `json:"karmainitiationflat,omitempty"`
	KarmaMetamagic               string `json:"karmametamagic,omitempty"`
	KarmaComplexFormOption       string `json:"karmacomplexformoption,omitempty"`
	KarmaComplexFormSkillsoft    string `json:"karmacomplexformskillsoft,omitempty"`
	KarmaJoinGroup               string `json:"karmajoingroup,omitempty"`
	KarmaLeaveGroup              string `json:"karmaleavegroup,omitempty"`
	KarmaAlchemicalFocus         string `json:"karmaalchemicalfocus,omitempty"`
	KarmaBanishingFocus          string `json:"karmabanishingfocus,omitempty"`
	KarmaBindingFocus            string `json:"karmabindingfocus,omitempty"`
	KarmaCenteringFocus          string `json:"karmacenteringfocus,omitempty"`
	KarmaCounterspellingFocus    string `json:"karmacounterspellingfocus,omitempty"`
	KarmaDisenchantingFocus      string `json:"karmadisenchantingfocus,omitempty"`
	KarmaFlexibleSignatureFocus  string `json:"karmaflexiblesignaturefocus,omitempty"`
	KarmaMaskingFocus            string `json:"karmamaskingfocus,omitempty"`
	KarmaPowerFocus              string `json:"karmapowerfocus,omitempty"`
	KarmaQIFocus                 string `json:"karmaqifocus,omitempty"`
	KarmaRitualSpellcastingFocus string `json:"karmaritualspellcastingfocus,omitempty"`
	KarmaSpellcastingFocus       string `json:"karmaspellcastingfocus,omitempty"`
	KarmaSpellshapingFocus       string `json:"karmaspellshapingfocus,omitempty"`
	KarmaSummoningFocus          string `json:"karmasummoningfocus,omitempty"`
	KarmaSustainingFocus         string `json:"karmasustainingfocus,omitempty"`
	KarmaWeaponFocus             string `json:"karmaweaponfocus,omitempty"`
	KarmaMysadPP                 string `json:"karmamysadpp,omitempty"`
	KarmaSpiritFettering         string `json:"karmaspiritfettering,omitempty"`
	KarmaTechnique               string `json:"karmatechnique,omitempty"`
}

// BannedWareGrades represents banned ware grades
type BannedWareGrades struct {
	Grade interface{} `json:"grade,omitempty"` // Can be string or []string
}

// Books represents allowed books
type Books struct {
	Book interface{} `json:"book,omitempty"` // Can be string or []string
}

// CustomDataDirectoryName represents a custom data directory name
type CustomDataDirectoryName struct {
	DirectoryName string `json:"directoryname"`
	Order         string `json:"order"`
	Enabled       string `json:"enabled"`
}

// CustomDataDirectoryNames represents a collection of custom data directory names
type CustomDataDirectoryNames struct {
	CustomDataDirectoryName interface{} `json:"customdatadirectoryname,omitempty"` // Can be single or []CustomDataDirectoryName
}

// RedlineExclusion represents redline exclusions
type RedlineExclusion struct {
	Limb interface{} `json:"limb,omitempty"` // Can be string or []string
}

// Setting represents a character creation/gameplay setting from Shadowrun 5th Edition
// This is a very large struct with many configuration options
type Setting struct {
	ID   string `json:"id"`   // Unique identifier (UUID)
	Name string `json:"name"` // Setting name (e.g., "Standard", "Street Level")

	// Boolean flags (stored as strings "True"/"False")
	LicenseRestricted                         string `json:"licenserestricted,omitempty"`
	MoreLethalGameplay                        string `json:"morelethalgameplay,omitempty"`
	SpiritForceBasedOnTotalMag                string `json:"spiritforcebasedontotalmag,omitempty"`
	UnarmedImprovementsApplyToWeapons         string `json:"unarmedimprovementsapplytoweapons,omitempty"`
	AllowInitiationInCreateMode               string `json:"allowinitiationincreatemode,omitempty"`
	UsePointsOnBrokenGroups                   string `json:"usepointsonbrokengroups,omitempty"`
	DontDoubleQualities                       string `json:"dontdoublequalities,omitempty"`
	DontDoubleQualityRefunds                  string `json:"dontdoublequalityrefunds,omitempty"`
	IgnoreART                                 string `json:"ignoreart,omitempty"`
	CyberlegMovement                          string `json:"cyberlegmovement,omitempty"`
	Allow2ndMaxAttribute                      string `json:"allow2ndmaxattribute,omitempty"`
	DroneArmorMultiplierEnabled               string `json:"dronearmormultiplierenabled,omitempty"`
	NoSingleArmorEncumbrance                  string `json:"nosinglearmorencumbrance,omitempty"`
	IgnoreComplexFormLimit                    string `json:"ignorecomplexformlimit,omitempty"`
	NoArmorEncumbrance                        string `json:"noarmorencumbrance,omitempty"`
	UncappedArmorAccessoryBonuses             string `json:"uncappedarmoraccessorybonuses,omitempty"`
	EssLossReducesMaximumOnly                 string `json:"esslossreducesmaximumonly,omitempty"`
	AllowSkillRegrouping                      string `json:"allowskillregrouping,omitempty"`
	MetatypeCostsKarma                        string `json:"metatypecostskarma,omitempty"`
	AllowCyberwareEssDiscounts                string `json:"allowcyberwareessdiscounts,omitempty"`
	MaximumArmorModifications                 string `json:"maximumarmormodifications,omitempty"`
	ArmorDegredation                          string `json:"armordegredation,omitempty"`
	SpecialKarmaCostBasedOnShownValue         string `json:"specialkarmacostbasedonshownvalue,omitempty"`
	ExceedPositiveQualities                   string `json:"exceedpositivequalities,omitempty"`
	ExceedPositiveQualitiesCostDoubled        string `json:"exceedpositivequalitiescostdoubled,omitempty"`
	MysadPPCareer                             string `json:"mysaddppcareer,omitempty"`
	MysadAdeptSecondMagAttribute              string `json:"mysadeptsecondmagattribute,omitempty"`
	ExceedNegativeQualities                   string `json:"exceednegativequalities,omitempty"`
	ExceedNegativeQualitiesNoBonus            string `json:"exceednegativequalitiesnobonus,omitempty"`
	MultiplyRestrictedCost                    string `json:"multiplyrestrictedcost,omitempty"`
	MultiplyForbiddenCost                     string `json:"multiplyforbiddencost,omitempty"`
	DoNotRoundEssenceInternally               string `json:"donotroundessenceinternally,omitempty"`
	EnableEnemyTracking                       string `json:"enableenemytracking,omitempty"`
	EnemyKarmaQualityLimit                    string `json:"enemykarmaqualitylimit,omitempty"`
	EnforceCapacity                           string `json:"enforcecapacity,omitempty"`
	RestrictRecoil                            string `json:"restrictrecoil,omitempty"`
	UnrestrictedNuyen                         string `json:"unrestrictednuyen,omitempty"`
	AllowHigherStackedFoci                    string `json:"allowhigherstackedfoci,omitempty"`
	AllowEditPartOfBaseWeapon                 string `json:"alloweditpartofbaseweapon,omitempty"`
	BreakSkillGroupsInCreateMode              string `json:"breakskillgroupsincreatemode,omitempty"`
	AllowPointBuySpecializationsOnKarmaSkills string `json:"allowpointbuyspecializationsonkarmaskills,omitempty"`
	ExtendAnyDetectionSpell                   string `json:"extendanydetectionspell,omitempty"`
	AllowSkillDiceRolling                     string `json:"allowskilldicerolling,omitempty"`
	DontUseCyberlimbCalculation               string `json:"dontusecyberlimbcalculation,omitempty"`
	AlternateMetatypeAttributeKarma           string `json:"alternatemetatypeattributekarma,omitempty"`
	ReverseAttributePriorityOrder             string `json:"reverseattributepriorityorder,omitempty"`
	AllowObsolescentUpgrade                   string `json:"allowobsolescentupgrade,omitempty"`
	AllowBiowareSuites                        string `json:"allowbiowaresuites,omitempty"`
	FreeSpiritPowerPointsMag                  string `json:"freespiritpowerpointsmag,omitempty"`
	CompensateSkillGroupKarmaDifference       string `json:"compensateskillgroupkarmadifference,omitempty"`
	AutoBackstory                             string `json:"autobackstory,omitempty"`
	FreeMartialArtSpecialization              string `json:"freemartialartspecialization,omitempty"`
	PrioritySpellsAsAdeptPowers               string `json:"priorityspellsasadeptpowers,omitempty"`
	UseCalculatedPublicAwareness              string `json:"usecalculatedpublicawareness,omitempty"`
	IncreasedImprovedAbilityModifier          string `json:"increasedimprovedabilitymodifier,omitempty"`
	AllowFreeGrids                            string `json:"allowfreegrids,omitempty"`
	AllowTechnomancerSchooling                string `json:"allowtechnomancerschooling,omitempty"`
	UnclampAttributeMinimum                   string `json:"unclampattributeminimum,omitempty"`
	DroneMods                                 string `json:"dronemods,omitempty"`
	DroneModsMaximumPilot                     string `json:"dronemodsmaximumpilot,omitempty"`

	// Numeric values (stored as strings)
	NuyenPerBPWFTM               string `json:"nuyenperbpwftm,omitempty"`
	NuyenPerBPWFTP               string `json:"nuyenperbpwftp,omitempty"`
	DroneArmorFlatNumber         string `json:"dronearmorflatnumber,omitempty"`
	MetatypeCostsKarmaMultiplier string `json:"metatypecostskarmamultiplier,omitempty"`
	LimbCount                    string `json:"limbcount,omitempty"`
	RestrictedCostMultiplier     string `json:"restrictedcostmultiplier,omitempty"`
	ForbiddenCostMultiplier      string `json:"forbiddencostmultiplier,omitempty"`
	CyberlimbAttributeBonusCap   string `json:"cyberlimbattributebonuscap,omitempty"`
	DicePenaltySustaining        string `json:"dicepenaltysustaining,omitempty"`
	MinInitiativeDice            string `json:"mininitiativedice,omitempty"`
	MaxInitiativeDice            string `json:"maxinitiativedice,omitempty"`
	MinAstralInitiativeDice      string `json:"minastralinitiativedice,omitempty"`
	MaxAstralInitiativeDice      string `json:"maxastralinitiativedice,omitempty"`
	MinColdSimInitiativeDice     string `json:"mincoldsiminitiativedice,omitempty"`
	MaxColdSimInitiativeDice     string `json:"maxcoldsiminitiativedice,omitempty"`
	MinHotSimInitiativeDice      string `json:"minhotsiminitiativedice,omitempty"`
	MaxHotSimInitiativeDice      string `json:"maxhotsiminitiativedice,omitempty"`

	// Formula expressions (stored as strings)
	ContactPointsExpression       string `json:"contactpointsexpression,omitempty"`
	KnowledgePointsExpression     string `json:"knowledgepointsexpression,omitempty"`
	ChargenKarmaToNuyenExpression string `json:"chargenkarmatonuyenexpression,omitempty"`
	BoundSpiritExpression         string `json:"boundspiritexpression,omitempty"`
	CompiledSpiritExpression      string `json:"compiledspiritexpression,omitempty"`

	// Format strings
	NuyenFormat   string `json:"nuyenformat,omitempty"`
	EssenceFormat string `json:"essenceformat,omitempty"`

	// Build method and points
	BuildMethod                        string `json:"buildmethod,omitempty"`
	BuildPoints                        string `json:"buildpoints,omitempty"`
	QualityKarmaLimit                  string `json:"qualitykarmalimit,omitempty"`
	PriorityArray                      string `json:"priorityarray,omitempty"`
	PriorityTable                      string `json:"prioritytable,omitempty"`
	SumToTen                           string `json:"sumtoten,omitempty"`
	Availability                       string `json:"availability,omitempty"`
	NuyenMaxBP                         string `json:"nuyenmaxbp,omitempty"`
	CompiledSpriteExpression           string `json:"compiledspriteexpression,omitempty"`
	CyberlimbAttributeBonusCapOverride string `json:"cyberlimbattributebonuscapoverride,omitempty"`
	ExceedNegativeQualitiesLimit       string `json:"exceednegativequalitieslimit,omitempty"`

	// Optional/nullable fields
	ExcludeLimbSlot *string `json:"excludelimbslot,omitempty"`

	// Nested structures
	KarmaCost                *KarmaCost                `json:"karmacost,omitempty"`
	BannedWareGrades         *BannedWareGrades         `json:"bannedwaregrades,omitempty"`
	Books                    *Books                    `json:"books,omitempty"`
	CustomDataDirectoryNames *CustomDataDirectoryNames `json:"customdatadirectorynames,omitempty"`
	RedlineExclusion         *RedlineExclusion         `json:"redlinerexclusion,omitempty"`
}
