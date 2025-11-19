package v5

// Quality represents a quality (positive or negative) from Shadowrun 5th Edition
type Quality struct {
	// Required fields
	Name     string `json:"name"`     // Quality name
	Karma    string `json:"karma"`    // Karma cost (can be negative for negative qualities)
	Category string `json:"category"` // "Positive" or "Negative"
	Source   string `json:"source"`   // Source book like "SR5", "RG", etc.

	// Optional fields
	Limit                 string            `json:"limit,omitempty"`                 // Limit like "False", "{arm} - 1", etc.
	Bonus                 *QualityBonus     `json:"bonus,omitempty"`                 // Bonuses provided by this quality
	Required              *QualityRequired  `json:"required,omitempty"`              // Requirements for this quality
	Forbidden             *QualityForbidden `json:"forbidden,omitempty"`             // Forbidden items/qualities
	Page                  string            `json:"page,omitempty"`                  // Page number in source book
	ChargenOnly           *bool             `json:"chargenonly,omitempty"`           // Whether only available at character creation
	CareerOnly            *bool             `json:"careeronly,omitempty"`            // Whether only available during career
	Mutant                string            `json:"mutant,omitempty"`                // Mutant flag (usually "True" or empty)
	Metagenic             string            `json:"metagenic,omitempty"`             // Metagenic flag
	NoLevels              *bool             `json:"nolevels,omitempty"`              // Whether this quality has no levels
	StagedPurchase        *bool             `json:"stagedpurchase,omitempty"`        // Whether this can be purchased in stages
	RefundKarmaOnRemove   *bool             `json:"refundkarmaonremove,omitempty"`   // Whether karma is refunded on removal
	ContributeToBP        *bool             `json:"contributetobp,omitempty"`        // Whether this contributes to build points
	ContributeToLimit     *bool             `json:"contributetolimit,omitempty"`     // Whether this contributes to limits
	IncludeInLimit        *IncludeInLimit   `json:"includeinlimit,omitempty"`        // Whether included in limit calculations
	LimitWithinInclusions *bool             `json:"limitwithinclusions,omitempty"`   // Limit within inclusions
	OnlyPriorityGiven     *bool             `json:"onlyprioritygiven,omitempty"`     // Only available with priority
	CanBuyWithSpellPoints *bool             `json:"canbuywithspellpoints,omitempty"` // Can be bought with spell points
	DoubleCareer          *bool             `json:"doublecareer,omitempty"`          // Double career flag
	ChargenLimit          string            `json:"chargenlimit,omitempty"`          // Character generation limit
	CostDiscount          string            `json:"costdiscount,omitempty"`          // Cost discount
	FirstLevelBonus       *bool             `json:"firstlevelbonus,omitempty"`       // First level bonus
	Hide                  *bool             `json:"hide,omitempty"`                  // Whether to hide this quality
	Implemented           *bool             `json:"implemented,omitempty"`           // Whether implemented
	NameOnPage            string            `json:"nameonpage,omitempty"`            // Name as it appears on page
	NaturalWeapons        interface{}       `json:"naturalweapons,omitempty"`        // Natural weapons (can be bool or complex structure)
	AddWeapon             string            `json:"addweapon,omitempty"`             // Weapon added by this quality
}

// QualityBonus represents bonuses provided by a quality
// This is a very flexible structure with many possible bonus types
type QualityBonus struct {
	// Many fields similar to BiowareBonus but with additional quality-specific ones
	// For now, we'll use a flexible approach with interface{} for complex nested structures

	// Common bonus fields (similar to bioware)
	LimitModifier            interface{} `json:"limitmodifier,omitempty"`
	SkillCategory            interface{} `json:"skillcategory,omitempty"`
	SpecificSkill            interface{} `json:"specificskill,omitempty"`
	SkillGroup               interface{} `json:"skillgroup,omitempty"`
	SelectSkill              interface{} `json:"selectskill,omitempty"`
	SkillAttribute           interface{} `json:"skillattribute,omitempty"`
	SpecificAttribute        interface{} `json:"specificattribute,omitempty"`
	PhysicalLimit            string      `json:"physicallimit,omitempty"`
	MentalLimit              string      `json:"mentallimit,omitempty"`
	SocialLimit              string      `json:"sociallimit,omitempty"`
	ConditionMonitor         interface{} `json:"conditionmonitor,omitempty"`
	Initiative               interface{} `json:"initiative,omitempty"`
	InitiativePass           interface{} `json:"initiativepass,omitempty"`
	Dodge                    string      `json:"dodge,omitempty"`
	DamageResistance         string      `json:"damageresistance,omitempty"`
	UnarmedDV                string      `json:"unarmeddv,omitempty"`
	UnarmedDVPhysical        *bool       `json:"unarmeddvphysical,omitempty"`
	UnarmedReach             string      `json:"unarmedreach,omitempty"`
	Armor                    interface{} `json:"armor,omitempty"`
	FireArmor                string      `json:"firearmor,omitempty"`
	ColdArmor                string      `json:"coldarmor,omitempty"`
	ElectricityArmor         string      `json:"electricityarmor,omitempty"`
	ToxinContactResist       string      `json:"toxincontactresist,omitempty"`
	ToxinIngestionResist     string      `json:"toxiningestionresist,omitempty"`
	ToxinInhalationResist    string      `json:"toxininhalationresist,omitempty"`
	ToxinInjectionResist     string      `json:"toxininjectionresist,omitempty"`
	PathogenContactResist    string      `json:"pathogencontactresist,omitempty"`
	PathogenIngestionResist  string      `json:"pathogeningestionresist,omitempty"`
	PathogenInhalationResist string      `json:"pathogeninhalationresist,omitempty"`
	PathogenInjectionResist  string      `json:"pathogeninjectionresist,omitempty"`
	RadiationResist          string      `json:"radiationresist,omitempty"`
	FatigueResist            string      `json:"fatigueresist,omitempty"`
	StunCMRecovery           string      `json:"stuncmrecovery,omitempty"`
	PhysicalCMRecovery       string      `json:"physicalcmrecovery,omitempty"`
	Memory                   string      `json:"memory,omitempty"`
	DrainResist              string      `json:"drainresist,omitempty"`
	FadingResist             string      `json:"fadingresist,omitempty"`
	Composure                string      `json:"composure,omitempty"`
	LifestyleCost            string      `json:"lifestylecost,omitempty"`
	Ambidextrous             *bool       `json:"ambidextrous,omitempty"`

	// Quality-specific bonus fields
	Notoriety                                      string      `json:"notoriety,omitempty"`
	PublicAwareness                                string      `json:"publicawareness,omitempty"`
	Fame                                           string      `json:"fame,omitempty"`
	StreetCredMultiplier                           string      `json:"streetcredmultiplier,omitempty"`
	AstralReputation                               string      `json:"astralreputation,omitempty"`
	NativeLanguageLimit                            string      `json:"nativelanguagelimit,omitempty"`
	KnowledgeskillPoints                           string      `json:"knowledgeskillpoints,omitempty"`
	KnowledgeskillKarmaCost                        string      `json:"knowledgeskillkarmacost,omitempty"`
	KnowledgeskillKarmaCostMin                     string      `json:"knowledgeskillkarmacostmin,omitempty"`
	ActiveskillKarmaCost                           string      `json:"activeskillkarmacost,omitempty"`
	SkillCategoryKarmaCost                         string      `json:"skillcategorykarmacost,omitempty"`
	SkillCategoryKarmaCostMultiplier               string      `json:"skillcategorykarmacostmultiplier,omitempty"`
	SkillCategoryPointCostMultiplier               string      `json:"skillcategorypointcostmultiplier,omitempty"`
	SkillCategorySpecializationKarmaCostMultiplier string      `json:"skillcategoryspecializationkarmacostmultiplier,omitempty"`
	SkillGroupCategoryKarmaCostMultiplier          string      `json:"skillgroupcategorykarmacostmultiplier,omitempty"`
	NewspellKarmaCost                              string      `json:"newspellkarmacost,omitempty"`
	FocusBindingKarmaCost                          string      `json:"focusbindingkarmacost,omitempty"`
	ContactKarma                                   string      `json:"contactkarma,omitempty"`
	ContactKarmaMinimum                            string      `json:"contactkarmaminimum,omitempty"`
	AddContact                                     interface{} `json:"addcontact,omitempty"`
	AddQuality                                     interface{} `json:"addqualities,omitempty"`
	AddSkill                                       interface{} `json:"addskillspecializationoption,omitempty"`
	AddSpell                                       interface{} `json:"addspell,omitempty"`
	AddSpirit                                      interface{} `json:"addspirit,omitempty"`
	AddEcho                                        interface{} `json:"addecho,omitempty"`
	AddGear                                        interface{} `json:"addgear,omitempty"`
	AddWare                                        interface{} `json:"addware,omitempty"`
	AddLimb                                        interface{} `json:"addlimb,omitempty"`
	AddMetamagic                                   interface{} `json:"addmetamagic,omitempty"`
	SelectAttributes                               interface{} `json:"selectattributes,omitempty"`
	SelectContact                                  interface{} `json:"selectcontact,omitempty"`
	SelectExpertise                                interface{} `json:"selectexpertise,omitempty"`
	SelectInherentAIProgram                        interface{} `json:"selectinherentaiprogram,omitempty"`
	SelectMentorSpirit                             interface{} `json:"selectmentorspirit,omitempty"`
	SelectParagon                                  interface{} `json:"selectparagon,omitempty"`
	SelectQuality                                  interface{} `json:"selectquality,omitempty"`
	SelectSide                                     interface{} `json:"selectside,omitempty"`
	SelectSprite                                   interface{} `json:"selectsprite,omitempty"`
	SelectText                                     interface{} `json:"selecttext,omitempty"`
	ActionDicePool                                 interface{} `json:"actiondicepool,omitempty"`
	SpellDicePool                                  string      `json:"spelldicepool,omitempty"`
	SpellResistance                                string      `json:"spellresistance,omitempty"`
	SpellCategoryDamage                            string      `json:"spellcategorydamage,omitempty"`
	SpellCategoryDrain                             string      `json:"spellcategorydrain,omitempty"`
	SpellDescriptorDamage                          string      `json:"spelldescriptordamage,omitempty"`
	SpellDescriptorDrain                           string      `json:"spelldescriptordrain,omitempty"`
	AllowSpellCategory                             interface{} `json:"allowspellcategory,omitempty"`
	AllowSpellRange                                interface{} `json:"allowspellrange,omitempty"`
	LimitSpellCategory                             interface{} `json:"limitspellcategory,omitempty"`
	BlockSpellDescriptor                           interface{} `json:"blockspelldescriptor,omitempty"`
	DefenseTest                                    string      `json:"defensetest,omitempty"`
	Surprise                                       string      `json:"surprise,omitempty"`
	Reach                                          string      `json:"reach,omitempty"`
	WalkMultiplier                                 string      `json:"walkmultiplier,omitempty"`
	SprintBonus                                    string      `json:"sprintbonus,omitempty"`
	RunMultiplier                                  string      `json:"runmultiplier,omitempty"`
	MovementReplace                                interface{} `json:"movementreplace,omitempty"`
	WeaponCategoryDV                               string      `json:"weaponcategorydv,omitempty"`
	WeaponSkillAccuracy                            string      `json:"weaponskillaccuracy,omitempty"`
	EssenceMax                                     string      `json:"essencemax,omitempty"`
	EssencePenalty                                 string      `json:"essencepenalty,omitempty"`
	EssencePenaltyMagonlyT100                      string      `json:"essencepenaltymagonlyt100,omitempty"`
	EssencePenaltyT100                             string      `json:"essencepenaltyt100,omitempty"`
	AddEssToPhysicalCMRecovery                     string      `json:"addesstophysicalcmrecovery,omitempty"`
	AddEssToStunCMRecovery                         string      `json:"addesstostuncmrecovery,omitempty"`
	BiowareEssMultiplier                           string      `json:"biowareessmultiplier,omitempty"`
	CyberwareEssMultiplier                         string      `json:"cyberwareessmultiplier,omitempty"`
	CyberwareTotalEssMultiplier                    string      `json:"cyberwaretotalessmultiplier,omitempty"`
	DisableBioware                                 interface{} `json:"disablebioware,omitempty"`
	DisableBiowareGrade                            interface{} `json:"disablebiowaregrade,omitempty"`
	DisableCyberwareGrade                          interface{} `json:"disablecyberwaregrade,omitempty"`
	SkillDisable                                   interface{} `json:"skilldisable,omitempty"`
	SkillGroupDisable                              interface{} `json:"skillgroupdisable,omitempty"`
	SkillGroupDisableChoice                        interface{} `json:"skillgroupdisablechoice,omitempty"`
	SkillGroupCategoryDisable                      interface{} `json:"skillgroupcategorydisable,omitempty"`
	BlockSkillCategoryDefaulting                   interface{} `json:"blockskillcategorydefaulting,omitempty"`
	UnlockSkills                                   interface{} `json:"unlockskills,omitempty"`
	SwapSkillAttribute                             interface{} `json:"swapskillattribute,omitempty"`
	SwapSkillSpecAttribute                         interface{} `json:"swapskillspecattribute,omitempty"`
	EnableAttribute                                interface{} `json:"enableattribute,omitempty"`
	EnableTab                                      interface{} `json:"enabletab,omitempty"`
	ReplaceAttributes                              interface{} `json:"replaceattributes,omitempty"`
	RestrictGear                                   interface{} `json:"restrictedgear,omitempty"`
	DealerConnection                               string      `json:"dealerconnection,omitempty"`
	BlackMarketDiscount                            string      `json:"blackmarketdiscount,omitempty"`
	BasicLifestyleCost                             string      `json:"basiclifestylecost,omitempty"`
	TrustFund                                      string      `json:"trustfund,omitempty"`
	NuyenAmt                                       string      `json:"nuyenamt,omitempty"`
	NuyenMaxBP                                     string      `json:"nuyenmaxbp,omitempty"`
	FriendsInHighPlaces                            string      `json:"friendsinhighplaces,omitempty"`
	MadeMan                                        string      `json:"mademan,omitempty"`
	ExCon                                          string      `json:"excon,omitempty"`
	Erased                                         string      `json:"erased,omitempty"`
	JudgeIntentionsDefense                         string      `json:"judgeintentionsdefense,omitempty"`
	JudgeIntentionsOffense                         string      `json:"judgeintentionsoffense,omitempty"`
	DecreaseIntResist                              string      `json:"decreaseintresist,omitempty"`
	DecreaseLogResist                              string      `json:"decreaselogresist,omitempty"`
	DetectionSpellResist                           string      `json:"detectionspellresist,omitempty"`
	ManaIllusionResist                             string      `json:"manaillusionresist,omitempty"`
	MentalManipulationResist                       string      `json:"mentalmanipulationresist,omitempty"`
	PhysicalIllusionResist                         string      `json:"physicalillusionresist,omitempty"`
	DrainValue                                     string      `json:"drainvalue,omitempty"`
	FadingValue                                    string      `json:"fadingvalue,omitempty"`
	PhysiologicalAddictionFirstTime                string      `json:"physiologicaladdictionfirsttime,omitempty"`
	PsychologicalAddictionFirstTime                string      `json:"psychologicaladdictionfirsttime,omitempty"`
	PhysiologicalAddictionAlreadyAddicted          string      `json:"physiologicaladdictionalreadyaddicted,omitempty"`
	PsychologicalAddictionAlreadyAddicted          string      `json:"psychologicaladdictionalreadyaddicted,omitempty"`
	AdeptPowerPoints                               string      `json:"adeptpowerpoints,omitempty"`
	FreeSpells                                     string      `json:"freespells,omitempty"`
	FreeQuality                                    interface{} `json:"freequality,omitempty"`
	MartialArt                                     interface{} `json:"martialart,omitempty"`
	OptionalPowers                                 interface{} `json:"optionalpowers,omitempty"`
	CritterPowers                                  interface{} `json:"critterpowers,omitempty"`
	LimitCritterPowerCategory                      interface{} `json:"limitcritterpowercategory,omitempty"`
	LimitSpiritCategory                            interface{} `json:"limitspiritcategory,omitempty"`
	AllowspriteFettering                           interface{} `json:"allowspritefettering,omitempty"`
	LivingPersona                                  interface{} `json:"livingpersona,omitempty"`
	CyberAdeptDaemon                               interface{} `json:"cyberadeptdaemon,omitempty"`
	CyberSeeker                                    interface{} `json:"cyberseeker,omitempty"`
	Overclocker                                    interface{} `json:"overclocker,omitempty"`
	PrototypeTranshuman                            interface{} `json:"prototypetranshuman,omitempty"`
	BurnoutsWay                                    interface{} `json:"burnoutsway,omitempty"`
	MagiciansWayDiscount                           string      `json:"magicianswaydiscount,omitempty"`
	MetagenicLimit                                 string      `json:"metageniclimit,omitempty"`
	SpecialAttBurnMultiplier                       string      `json:"specialattburnmultiplier,omitempty"`
	SpecialModificationLimit                       string      `json:"specialmodificationlimit,omitempty"`
	Unique                                         string      `json:"+@unique,omitempty"`
	UseSelected                                    string      `json:"+@useselected,omitempty"`
}

// QualityRequired represents requirements for a quality
// Note: common.Requirement exists with unified structure - future migration could use it
type QualityRequired struct {
	OneOf *QualityRequiredOneOf `json:"oneof,omitempty"`
	AllOf *QualityRequiredAllOf `json:"allof,omitempty"`
}

// QualityRequiredOneOf represents a one-of requirement
// Note: common.RequirementOneOf exists with similar structure
type QualityRequiredOneOf struct {
	Metatype    interface{} `json:"metatype,omitempty"`   // Can be string or []string
	Quality     interface{} `json:"quality,omitempty"`    // Can be string or []string
	Power       string      `json:"power,omitempty"`      // Power name
	MageEnabled *bool       `json:"magenabled,omitempty"` // Magic enabled flag
}

// QualityRequiredAllOf represents an all-of requirement
// Note: common.RequirementAllOf exists with similar structure
type QualityRequiredAllOf struct {
	Metatype string `json:"metatype,omitempty"`
}

// QualityForbidden represents forbidden items or qualities
type QualityForbidden struct {
	OneOf *QualityForbiddenOneOf `json:"oneof,omitempty"`
}

// QualityForbiddenOneOf represents a one-of forbidden constraint
type QualityForbiddenOneOf struct {
	Quality interface{} `json:"quality,omitempty"` // Can be string or []string
	Bioware interface{} `json:"bioware,omitempty"` // Can be string or []string
	Power   string      `json:"power,omitempty"`   // Power name
}

// ActionDicePool represents an action dice pool bonus
type ActionDicePool struct {
	Category string `json:"+@category,omitempty"` // Category like "Matrix"
}

// IncludeInLimit represents an include in limit structure
type IncludeInLimit struct {
	Name interface{} `json:"name,omitempty"` // Can be string or []string
}
