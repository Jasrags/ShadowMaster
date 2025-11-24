package v5

// This file contains setting structures generated from settings.xml

// KarmaCost represents karma costs for various actions
type KarmaCost struct {
// KarmaAttribute represents karmaattribute
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 5, 5, 5 (and 7 more)
// Note: 100.0% of values are numeric strings
	KarmaAttribute *int `xml:"karmaattribute,omitempty" json:"karmaattribute,omitempty"`
	KarmaQuality *int `xml:"karmaquality,omitempty" json:"karmaquality,omitempty"`
	KarmaSpecialization *int `xml:"karmaspecialization,omitempty" json:"karmaspecialization,omitempty"`
	KarmaKnoSpecialization *int `xml:"karmaknospecialization,omitempty" json:"karmaknospecialization,omitempty"`
	KarmaNewKnowledgeSkill *int `xml:"karmanewknowledgeskill,omitempty" json:"karmanewknowledgeskill,omitempty"`
	KarmaNewActiveSkill *int `xml:"karmanewactiveskill,omitempty" json:"karmanewactiveskill,omitempty"`
	KarmaNewSkillGroup *int `xml:"karmanewskillgroup,omitempty" json:"karmanewskillgroup,omitempty"`
	KarmaImproveKnowledgeSkill *int `xml:"karmaimproveknowledgeskill,omitempty" json:"karmaimproveknowledgeskill,omitempty"`
	KarmaImproveActiveSkill *int `xml:"karmaimproveactiveskill,omitempty" json:"karmaimproveactiveskill,omitempty"`
	KarmaImproveSkillGroup *int `xml:"karmaimproveskillgroup,omitempty" json:"karmaimproveskillgroup,omitempty"`
// KarmaSpell represents karmaspell
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 5, 5, 5 (and 7 more)
// Note: 100.0% of values are numeric strings
	KarmaSpell *int `xml:"karmaspell,omitempty" json:"karmaspell,omitempty"`
	KarmaEnhancement *int `xml:"karmaenhancement,omitempty" json:"karmaenhancement,omitempty"`
	KarmaNewComplexForm *int `xml:"karmanewcomplexform,omitempty" json:"karmanewcomplexform,omitempty"`
	KarmaImproveComplexForm *int `xml:"karmaimprovecomplexform,omitempty" json:"karmaimprovecomplexform,omitempty"`
	KarmaNewAIProgram *int `xml:"karmanewaiprogram,omitempty" json:"karmanewaiprogram,omitempty"`
	KarmaNewAIAdvancedProgram *int `xml:"karmanewaiadvancedprogram,omitempty" json:"karmanewaiadvancedprogram,omitempty"`
	KarmaContact *int `xml:"karmacontact,omitempty" json:"karmacontact,omitempty"`
	KarmaEnemy *int `xml:"karmaenemy,omitempty" json:"karmaenemy,omitempty"`
	KarmaCarryOver *int `xml:"karmacarryover,omitempty" json:"karmacarryover,omitempty"`
	KarmaSpirit *int `xml:"karmaspirit,omitempty" json:"karmaspirit,omitempty"`
// KarmaManeuver represents karmamaneuver
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 5, 5, 5 (and 7 more)
// Note: 100.0% of values are numeric strings
	KarmaManeuver *int `xml:"karmamaneuver,omitempty" json:"karmamaneuver,omitempty"`
	KarmaInitiation *int `xml:"karmainitiation,omitempty" json:"karmainitiation,omitempty"`
	KarmaInitiationFlat *int `xml:"karmainitiationflat,omitempty" json:"karmainitiationflat,omitempty"`
	KarmaMetamagic *int `xml:"karmametamagic,omitempty" json:"karmametamagic,omitempty"`
	KarmaComplexFormOption *int `xml:"karmacomplexformoption,omitempty" json:"karmacomplexformoption,omitempty"`
	KarmaComplexFormSkillSoft *int `xml:"karmacomplexformskillsoft,omitempty" json:"karmacomplexformskillsoft,omitempty"`
	KarmaJoinGroup *int `xml:"karmajoingroup,omitempty" json:"karmajoingroup,omitempty"`
	KarmaLeaveGroup *int `xml:"karmaleavegroup,omitempty" json:"karmaleavegroup,omitempty"`
	KarmaAlchemicalFocus *int `xml:"karmaalchemicalfocus,omitempty" json:"karmaalchemicalfocus,omitempty"`
	KarmaBanishingFocus *int `xml:"karmabanishingfocus,omitempty" json:"karmabanishingfocus,omitempty"`
// KarmaBindingFocus represents karmabindingfocus
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 2, 2, 2 (and 7 more)
// Note: 100.0% of values are numeric strings
	KarmaBindingFocus *int `xml:"karmabindingfocus,omitempty" json:"karmabindingfocus,omitempty"`
	KarmaCenteringFocus *int `xml:"karmacenteringfocus,omitempty" json:"karmacenteringfocus,omitempty"`
	KarmaCounterspellingFocus *int `xml:"karmacounterspellingfocus,omitempty" json:"karmacounterspellingfocus,omitempty"`
	KarmaDisenchantingFocus *int `xml:"karmadisenchantingfocus,omitempty" json:"karmadisenchantingfocus,omitempty"`
	KarmaFlexibleSignatureFocus *int `xml:"karmaflexiblesignaturefocus,omitempty" json:"karmaflexiblesignaturefocus,omitempty"`
	KarmaMaskingFocus *int `xml:"karmamaskingfocus,omitempty" json:"karmamaskingfocus,omitempty"`
	KarmaPowerFocus *int `xml:"karmapowerfocus,omitempty" json:"karmapowerfocus,omitempty"`
	KarmaQIFocus *int `xml:"karmaqifocus,omitempty" json:"karmaqifocus,omitempty"`
	KarmaRitualSpellcastingFocus *int `xml:"karmaritualspellcastingfocus,omitempty" json:"karmaritualspellcastingfocus,omitempty"`
	KarmaSpellcastingFocus *int `xml:"karmaspellcastingfocus,omitempty" json:"karmaspellcastingfocus,omitempty"`
// KarmaSpellshapingFocus represents karmaspellshapingfocus
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 3, 3, 3 (and 7 more)
// Note: 100.0% of values are numeric strings
	KarmaSpellshapingFocus *int `xml:"karmaspellshapingfocus,omitempty" json:"karmaspellshapingfocus,omitempty"`
	KarmaSummoningFocus *int `xml:"karmasummoningfocus,omitempty" json:"karmasummoningfocus,omitempty"`
	KarmaSustainingFocus *int `xml:"karmasustainingfocus,omitempty" json:"karmasustainingfocus,omitempty"`
	KarmaWeaponFocus *int `xml:"karmaweaponfocus,omitempty" json:"karmaweaponfocus,omitempty"`
	KarmaMysadPP *int `xml:"karmamysadpp,omitempty" json:"karmamysadpp,omitempty"`
	KarmaSpiritFettering *int `xml:"karmaspiritfettering,omitempty" json:"karmaspiritfettering,omitempty"`
}

// SettingBooks represents a collection of books for a setting
type SettingBooks struct {
	Book []string `xml:"book,omitempty" json:"book,omitempty"`
}

// BannedWareGrades represents a collection of banned ware grades
type BannedWareGrades struct {
	Grade []string `xml:"grade,omitempty" json:"grade,omitempty"`
}

// RedlineExclusion represents a collection of excluded limbs for redliner
type RedlineExclusion struct {
	Limb []string `xml:"limb,omitempty" json:"limb,omitempty"`
}

// Setting represents a game setting definition
type Setting struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 34
// Examples: 223a11ff-80e0-428b-89a9-6ef1c243b8b6, 507eef8e-eba8-41ea-84c4-4282258fe669, 33e5317f-12aa-416e-816e-3b8b6ad95712 (and 7 more)
// Enum Candidate: Yes
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	GameplayOptionName string `xml:"gameplayoptionname" json:"gameplayoptionname"`
	Allow2ndmaxattribute bool `xml:"allow2ndmaxattribute," json:"allow2ndmaxattribute,"`
	Allowbiowaresuites bool `xml:"allowbiowaresuites," json:"allowbiowaresuites,"`
	Allowcyberwareessdiscounts bool `xml:"allowcyberwareessdiscounts," json:"allowcyberwareessdiscounts,"`
	Alloweditpartofbaseweapon bool `xml:"alloweditpartofbaseweapon," json:"alloweditpartofbaseweapon,"`
	Allowfreegrids bool `xml:"allowfreegrids," json:"allowfreegrids,"`
	Allowhigherstackedfoci bool `xml:"allowhigherstackedfoci," json:"allowhigherstackedfoci,"`
	Allowinitiationincreatemode bool `xml:"allowinitiationincreatemode," json:"allowinitiationincreatemode,"`
// Allowpointbuyspecializationsonkarmaskills represents allowpointbuyspecializationsonkarmaskills
// Type: boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: False, False, False (and 7 more)
// Note: 100.0% of values are boolean strings
// Enum Candidate: False, True
// Length: 4-5 characters
	Allowpointbuyspecializationsonkarmaskills bool `xml:"allowpointbuyspecializationsonkarmaskills," json:"allowpointbuyspecializationsonkarmaskills,"`
	Allowskilldicerolling bool `xml:"allowskilldicerolling," json:"allowskilldicerolling,"`
	Allowskillregrouping bool `xml:"allowskillregrouping," json:"allowskillregrouping,"`
	Allowtechnomancerschooling bool `xml:"allowtechnomancerschooling," json:"allowtechnomancerschooling,"`
	Alternatemetatypeattributekarma bool `xml:"alternatemetatypeattributekarma," json:"alternatemetatypeattributekarma,"`
	Armordegredation bool `xml:"armordegredation," json:"armordegredation,"`
	Autobackstory bool `xml:"autobackstory," json:"autobackstory,"`
	Availability int `xml:"availability," json:"availability,"`
	Boundspiritexpression *string `xml:"boundspiritexpression,omitempty" json:"boundspiritexpression,omitempty"`
	Breakskillgroupsincreatemode bool `xml:"breakskillgroupsincreatemode," json:"breakskillgroupsincreatemode,"`
// Buildmethod represents buildmethod
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: Priority, Priority, Priority (and 7 more)
// Enum Candidate: Karma, LifeModule, Priority, SumtoTen
// Length: 5-10 characters
	Buildmethod *string `xml:"buildmethod,omitempty" json:"buildmethod,omitempty"`
	Buildpoints int `xml:"buildpoints," json:"buildpoints,"`
	Chargenkarmatonuyenexpression *string `xml:"chargenkarmatonuyenexpression,omitempty" json:"chargenkarmatonuyenexpression,omitempty"`
	Compensateskillgroupkarmadifference bool `xml:"compensateskillgroupkarmadifference," json:"compensateskillgroupkarmadifference,"`
	Contactpointsexpression *string `xml:"contactpointsexpression,omitempty" json:"contactpointsexpression,omitempty"`
	Customdatadirectorynames *string `xml:"customdatadirectorynames,omitempty" json:"customdatadirectorynames,omitempty"`
	Cyberlegmovement bool `xml:"cyberlegmovement," json:"cyberlegmovement,"`
	Cyberlimbattributebonuscap int `xml:"cyberlimbattributebonuscap," json:"cyberlimbattributebonuscap,"`
	Cyberlimbattributebonuscapoverride bool `xml:"cyberlimbattributebonuscapoverride," json:"cyberlimbattributebonuscapoverride,"`
	Dicepenaltysustaining int `xml:"dicepenaltysustaining," json:"dicepenaltysustaining,"`
// Donotroundessenceinternally represents donotroundessenceinternally
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: False, False, False (and 7 more)
// Note: 100.0% of values are boolean strings
	Donotroundessenceinternally bool `xml:"donotroundessenceinternally," json:"donotroundessenceinternally,"`
	Dontdoublequalities bool `xml:"dontdoublequalities," json:"dontdoublequalities,"`
	Dontdoublequalityrefunds bool `xml:"dontdoublequalityrefunds," json:"dontdoublequalityrefunds,"`
	Dontusecyberlimbcalculation bool `xml:"dontusecyberlimbcalculation," json:"dontusecyberlimbcalculation,"`
	Dronearmorflatnumber int `xml:"dronearmorflatnumber," json:"dronearmorflatnumber,"`
	Dronearmormultiplierenabled bool `xml:"dronearmormultiplierenabled," json:"dronearmormultiplierenabled,"`
	Dronemods bool `xml:"dronemods," json:"dronemods,"`
	Dronemodsmaximumpilot bool `xml:"dronemodsmaximumpilot," json:"dronemodsmaximumpilot,"`
	Enableenemytracking bool `xml:"enableenemytracking," json:"enableenemytracking,"`
	Enemykarmaqualitylimit bool `xml:"enemykarmaqualitylimit," json:"enemykarmaqualitylimit,"`
// Enforcecapacity represents enforcecapacity
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: True, True, True (and 7 more)
// Note: 100.0% of values are boolean strings
	Enforcecapacity bool `xml:"enforcecapacity," json:"enforcecapacity,"`
	Essenceformat *string `xml:"essenceformat,omitempty" json:"essenceformat,omitempty"`
	Esslossreducesmaximumonly bool `xml:"esslossreducesmaximumonly," json:"esslossreducesmaximumonly,"`
	Exceednegativequalities bool `xml:"exceednegativequalities," json:"exceednegativequalities,"`
	Exceednegativequalitieslimit bool `xml:"exceednegativequalitieslimit," json:"exceednegativequalitieslimit,"`
	Exceednegativequalitiesnobonus bool `xml:"exceednegativequalitiesnobonus," json:"exceednegativequalitiesnobonus,"`
	Exceedpositivequalities bool `xml:"exceedpositivequalities," json:"exceedpositivequalities,"`
	Exceedpositivequalitiescostdoubled bool `xml:"exceedpositivequalitiescostdoubled," json:"exceedpositivequalitiescostdoubled,"`
	Excludelimbslot *string `xml:"excludelimbslot,omitempty" json:"excludelimbslot,omitempty"`
	Extendanydetectionspell bool `xml:"extendanydetectionspell," json:"extendanydetectionspell,"`
// Forbiddencostmultiplier represents forbiddencostmultiplier
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1, 1, 1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Forbiddencostmultiplier int `xml:"forbiddencostmultiplier," json:"forbiddencostmultiplier,"`
	Freemartialartspecialization bool `xml:"freemartialartspecialization," json:"freemartialartspecialization,"`
	Freespiritpowerpointsmag bool `xml:"freespiritpowerpointsmag," json:"freespiritpowerpointsmag,"`
	Ignoreart bool `xml:"ignoreart," json:"ignoreart,"`
	Ignorecomplexformlimit bool `xml:"ignorecomplexformlimit," json:"ignorecomplexformlimit,"`
	Increasedimprovedabilitymodifier bool `xml:"increasedimprovedabilitymodifier," json:"increasedimprovedabilitymodifier,"`
	Knowledgepointsexpression *string `xml:"knowledgepointsexpression,omitempty" json:"knowledgepointsexpression,omitempty"`
	Licenserestricted bool `xml:"licenserestricted," json:"licenserestricted,"`
	Limbcount int `xml:"limbcount," json:"limbcount,"`
	Maxastralinitiativedice int `xml:"maxastralinitiativedice," json:"maxastralinitiativedice,"`
// Maxcoldsiminitiativedice represents maxcoldsiminitiativedice
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 5, 5, 5 (and 7 more)
// Note: 100.0% of values are numeric strings
	Maxcoldsiminitiativedice int `xml:"maxcoldsiminitiativedice," json:"maxcoldsiminitiativedice,"`
	Maxhotsiminitiativedice int `xml:"maxhotsiminitiativedice," json:"maxhotsiminitiativedice,"`
	Maximumarmormodifications bool `xml:"maximumarmormodifications," json:"maximumarmormodifications,"`
	Maxinitiativedice int `xml:"maxinitiativedice," json:"maxinitiativedice,"`
	Metatypecostskarma bool `xml:"metatypecostskarma," json:"metatypecostskarma,"`
	Metatypecostskarmamultiplier int `xml:"metatypecostskarmamultiplier," json:"metatypecostskarmamultiplier,"`
	Minastralinitiativedice int `xml:"minastralinitiativedice," json:"minastralinitiativedice,"`
	Mincoldsiminitiativedice int `xml:"mincoldsiminitiativedice," json:"mincoldsiminitiativedice,"`
	Minhotsiminitiativedice int `xml:"minhotsiminitiativedice," json:"minhotsiminitiativedice,"`
	Mininitiativedice int `xml:"mininitiativedice," json:"mininitiativedice,"`
// Morelethalgameplay represents morelethalgameplay
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: False, False, False (and 7 more)
// Note: 100.0% of values are boolean strings
	Morelethalgameplay bool `xml:"morelethalgameplay," json:"morelethalgameplay,"`
	Multiplyforbiddencost bool `xml:"multiplyforbiddencost," json:"multiplyforbiddencost,"`
	Multiplyrestrictedcost bool `xml:"multiplyrestrictedcost," json:"multiplyrestrictedcost,"`
	Mysaddppcareer bool `xml:"mysaddppcareer," json:"mysaddppcareer,"`
	Mysadeptsecondmagattribute bool `xml:"mysadeptsecondmagattribute," json:"mysadeptsecondmagattribute,"`
	Noarmorencumbrance bool `xml:"noarmorencumbrance," json:"noarmorencumbrance,"`
	Nosinglearmorencumbrance bool `xml:"nosinglearmorencumbrance," json:"nosinglearmorencumbrance,"`
	Nuyenformat *string `xml:"nuyenformat,omitempty" json:"nuyenformat,omitempty"`
	Nuyenmaxbp int `xml:"nuyenmaxbp," json:"nuyenmaxbp,"`
	Nuyenperbpwftm int `xml:"nuyenperbpwftm," json:"nuyenperbpwftm,"`
// Nuyenperbpwftp represents nuyenperbpwftp
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 2000, 2000, 2000 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 2000, 3000, 4000
	Nuyenperbpwftp int `xml:"nuyenperbpwftp," json:"nuyenperbpwftp,"`
	Priorityarray *string `xml:"priorityarray,omitempty" json:"priorityarray,omitempty"`
	Priorityspellsasadeptpowers bool `xml:"priorityspellsasadeptpowers," json:"priorityspellsasadeptpowers,"`
	Prioritytable *string `xml:"prioritytable,omitempty" json:"prioritytable,omitempty"`
	Qualitykarmalimit int `xml:"qualitykarmalimit," json:"qualitykarmalimit,"`
	Registeredspriteexpression *string `xml:"registeredspriteexpression,omitempty" json:"registeredspriteexpression,omitempty"`
	Restrictedcostmultiplier int `xml:"restrictedcostmultiplier," json:"restrictedcostmultiplier,"`
	Restrictrecoil bool `xml:"restrictrecoil," json:"restrictrecoil,"`
	Reverseattributepriorityorder bool `xml:"reverseattributepriorityorder," json:"reverseattributepriorityorder,"`
	Specialkarmacostbasedonshownvalue bool `xml:"specialkarmacostbasedonshownvalue," json:"specialkarmacostbasedonshownvalue,"`
// Spiritforcebasedontotalmag represents spiritforcebasedontotalmag
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: False, False, False (and 7 more)
// Note: 100.0% of values are boolean strings
	Spiritforcebasedontotalmag bool `xml:"spiritforcebasedontotalmag," json:"spiritforcebasedontotalmag,"`
	Sumtoten int `xml:"sumtoten," json:"sumtoten,"`
	Unarmedimprovementsapplytoweapons bool `xml:"unarmedimprovementsapplytoweapons," json:"unarmedimprovementsapplytoweapons,"`
	Uncappedarmoraccessorybonuses bool `xml:"uncappedarmoraccessorybonuses," json:"uncappedarmoraccessorybonuses,"`
	Unclampattributeminimum bool `xml:"unclampattributeminimum," json:"unclampattributeminimum,"`
	Unrestrictednuyen bool `xml:"unrestrictednuyen," json:"unrestrictednuyen,"`
	Usecalculatedpublicawareness bool `xml:"usecalculatedpublicawareness," json:"usecalculatedpublicawareness,"`
	Usepointsonbrokengroups bool `xml:"usepointsonbrokengroups," json:"usepointsonbrokengroups,"`
	KarmaCost *KarmaCost `xml:"karmacost,omitempty" json:"karmacost,omitempty"`
	Books *SettingBooks `xml:"books,omitempty" json:"books,omitempty"`
	BannedWareGrades *BannedWareGrades `xml:"bannedwaregrades,omitempty" json:"bannedwaregrades,omitempty"`
	RedlineExclusion *RedlineExclusion `xml:"redlinerexclusion,omitempty" json:"redlinerexclusion,omitempty"`
}

// Settings represents a collection of settings
type Settings struct {
	Setting []Setting `xml:"setting" json:"setting"`
}

// SettingsChummer represents the root chummer element for settings
type SettingsChummer struct {
	Settings Settings `xml:"settings" json:"settings"`
}

