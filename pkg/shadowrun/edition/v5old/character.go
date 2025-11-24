package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains character structures generated from character.xsd

// CharacterGear represents gear within a character
type CharacterGear struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	Capacity *string `xml:"capacity,omitempty" json:"capacity,omitempty"`
	ArmorCapacity *string `xml:"armorcapacity,omitempty" json:"armorcapacity,omitempty"`
	MinRating *int `xml:"minrating,omitempty" json:"minrating,omitempty"`
	MaxRating int `xml:"maxrating" json:"maxrating"`
	Rating int `xml:"rating" json:"rating"`
	Qty int `xml:"qty" json:"qty"`
	Avail string `xml:"avail" json:"avail"`
	Avail3 *string `xml:"avail3,omitempty" json:"avail3,omitempty"`
	Avail6 *string `xml:"avail6,omitempty" json:"avail6,omitempty"`
	Avail10 *string `xml:"avail10,omitempty" json:"avail10,omitempty"`
	CostFor *int `xml:"costfor,omitempty" json:"costfor,omitempty"`
	Cost string `xml:"cost" json:"cost"`
	Cost3 *string `xml:"cost3,omitempty" json:"cost3,omitempty"`
	Cost6 *string `xml:"cost6,omitempty" json:"cost6,omitempty"`
	Cost10 *string `xml:"cost10,omitempty" json:"cost10,omitempty"`
	Extra string `xml:"extra" json:"extra"`
	Bonded string `xml:"bonded" json:"bonded"`
	Equipped string `xml:"equipped" json:"equipped"`
	HomeNode string `xml:"homenode" json:"homenode"`
	WeaponGUID *string `xml:"weaponguid,omitempty" json:"weaponguid,omitempty"`
	Bonus common.BaseBonus `xml:"bonus" json:"bonus"`
	WeaponBonus *CharacterGearWeaponBonus `xml:"weaponbonus,omitempty" json:"weaponbonus,omitempty"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	Attack string `xml:"attack" json:"attack"`
	DataProcessing string `xml:"dataprocessing" json:"dataprocessing"`
	Firewall string `xml:"firewall" json:"firewall"`
	ProgramLimit string `xml:"programlimit" json:"programlimit"`
	Sleaze string `xml:"sleaze" json:"sleaze"`
	GearName string `xml:"gearname" json:"gearname"`
	IncludedInParent string `xml:"includedinparent" json:"includedinparent"`
	MaxSkillRating *int `xml:"maxskillrating,omitempty" json:"maxskillrating,omitempty"`
	ChildCostMultiplier *int `xml:"childcostmultiplier,omitempty" json:"childcostmultiplier,omitempty"`
	ChildAvailModifier *int `xml:"childavailmodifier,omitempty" json:"childavailmodifier,omitempty"`
	Children CharacterGearChildren `xml:"children" json:"children"`
	Location string `xml:"location" json:"location"`
	Notes string `xml:"notes" json:"notes"`
	DiscountedCost string `xml:"discountedcost" json:"discountedcost"`
	Active *string `xml:"active,omitempty" json:"active,omitempty"`
}

// CharacterGearWeaponBonus represents weapon bonus for gear
type CharacterGearWeaponBonus struct {
	AP *int `xml:"ap,omitempty" json:"ap,omitempty"`
	APReplace *string `xml:"apreplace,omitempty" json:"apreplace,omitempty"`
	Damage *int `xml:"damage,omitempty" json:"damage,omitempty"`
	DamageReplace *string `xml:"damagereplace,omitempty" json:"damagereplace,omitempty"`
	DamageType *string `xml:"damagetype,omitempty" json:"damagetype,omitempty"`
	Pool *string `xml:"pool,omitempty" json:"pool,omitempty"`
	RangeBonus *int `xml:"rangebonus,omitempty" json:"rangebonus,omitempty"`
	RC *string `xml:"rc,omitempty" json:"rc,omitempty"`
}

// CharacterGearChildren represents children gear (recursive)
type CharacterGearChildren struct {
	Gear []CharacterGear `xml:"gear,omitempty" json:"gear,omitempty"`
}

// CharacterWeapon represents a weapon within a character
type CharacterWeapon struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	Type string `xml:"type" json:"type"`
	Spec *string `xml:"spec,omitempty" json:"spec,omitempty"`
	Spec2 *string `xml:"spec2,omitempty" json:"spec2,omitempty"`
	Reach int `xml:"reach" json:"reach"`
	Damage string `xml:"damage" json:"damage"`
	AP string `xml:"ap" json:"ap"`
	Mode string `xml:"mode" json:"mode"`
	RC string `xml:"rc" json:"rc"`
	Ammo string `xml:"ammo" json:"ammo"`
	AmmoCategory string `xml:"ammocategory" json:"ammocategory"`
	RequireAmmo string `xml:"requireammo" json:"requireammo"`
	AmmoRemaining int `xml:"ammoremaining" json:"ammoremaining"`
	AmmoRemaining2 int `xml:"ammoremaining2" json:"ammoremaining2"`
	AmmoRemaining3 int `xml:"ammoremaining3" json:"ammoremaining3"`
	AmmoRemaining4 int `xml:"ammoremaining4" json:"ammoremaining4"`
	AmmoLoaded string `xml:"ammoloaded" json:"ammoloaded"`
	AmmoLoaded2 string `xml:"ammoloaded2" json:"ammoloaded2"`
	AmmoLoaded3 string `xml:"ammoloaded3" json:"ammoloaded3"`
	AmmoLoaded4 string `xml:"ammoloaded4" json:"ammoloaded4"`
	Conceal int `xml:"conceal" json:"conceal"`
	Avail string `xml:"avail" json:"avail"`
	Cost int `xml:"cost" json:"cost"`
	UseSkill *CharacterWeaponUseSkill `xml:"useskill,omitempty" json:"useskill,omitempty"`
	Range string `xml:"range" json:"range"`
	RangeMultiply string `xml:"rangemultiply" json:"rangemultiply"`
	FullBurst int `xml:"fullburst" json:"fullburst"`
	Suppressive int `xml:"suppressive" json:"suppressive"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	WeaponName string `xml:"weaponname" json:"weaponname"`
	Included string `xml:"included" json:"included"`
	Installed string `xml:"installed" json:"installed"`
	Accessories *CharacterWeaponAccessories `xml:"accessories,omitempty" json:"accessories,omitempty"`
	WeaponMods *CharacterWeaponMods `xml:"weaponmods,omitempty" json:"weaponmods,omitempty"`
	Underbarrel []CharacterWeaponUnderbarrel `xml:"underbarrel,omitempty" json:"underbarrel,omitempty"`
	Notes string `xml:"notes" json:"notes"`
	DiscountedCost string `xml:"discountedcost" json:"discountedcost"`
}

// CharacterWeaponUseSkill represents use skill for weapon
type CharacterWeaponUseSkill struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// CharacterWeaponAccessory represents a weapon accessory
type CharacterWeaponAccessory struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Mount string `xml:"mount" json:"mount"`
	RC string `xml:"rc" json:"rc"`
	RCGroup *int `xml:"rcgroup,omitempty" json:"rcgroup,omitempty"`
	DVBonus *int `xml:"dvbonus,omitempty" json:"dvbonus,omitempty"`
	APBonus *int `xml:"apbonus,omitempty" json:"apbonus,omitempty"`
	Conceal int `xml:"conceal" json:"conceal"`
	DicePool *int `xml:"dicepool,omitempty" json:"dicepool,omitempty"`
	Avail string `xml:"avail" json:"avail"`
	Cost string `xml:"cost" json:"cost"`
	Included string `xml:"included" json:"included"`
	Installed string `xml:"installed" json:"installed"`
	AllowGear *CharacterWeaponAccessoryAllowGear `xml:"allowgear,omitempty" json:"allowgear,omitempty"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	Gears *CharacterWeaponAccessoryGears `xml:"gears,omitempty" json:"gears,omitempty"`
	Location string `xml:"location" json:"location"`
	Notes string `xml:"notes" json:"notes"`
	DiscountedCost string `xml:"discountedcost" json:"discountedcost"`
}

// CharacterWeaponAccessoryAllowGear represents allowed gear for weapon accessory
type CharacterWeaponAccessoryAllowGear struct {
	GearCategory []string `xml:"gearcategory" json:"gearcategory"`
}

// CharacterWeaponAccessoryGears represents gears for weapon accessory
type CharacterWeaponAccessoryGears struct {
	Gear []CharacterGear `xml:"gear,omitempty" json:"gear,omitempty"`
}

// CharacterWeaponAccessories represents weapon accessories
type CharacterWeaponAccessories struct {
	Accessory []CharacterWeaponAccessory `xml:"accessory" json:"accessory"`
}

// CharacterWeaponMod represents a weapon mod
type CharacterWeaponMod struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Slots int `xml:"slots" json:"slots"`
	Avail string `xml:"avail" json:"avail"`
	RC string `xml:"rc" json:"rc"`
	RCGroup *int `xml:"rcgroup,omitempty" json:"rcgroup,omitempty"`
	DVBonus *int `xml:"dvbonus,omitempty" json:"dvbonus,omitempty"`
	APBonus *int `xml:"apbonus,omitempty" json:"apbonus,omitempty"`
	Conceal int `xml:"conceal" json:"conceal"`
	Cost string `xml:"cost" json:"cost"`
	Included string `xml:"included" json:"included"`
	Installed string `xml:"installed" json:"installed"`
	Rating int `xml:"rating" json:"rating"`
	AmmoBonus *int `xml:"ammobonus,omitempty" json:"ammobonus,omitempty"`
	AmmoReplace *string `xml:"ammoreplace,omitempty" json:"ammoreplace,omitempty"`
	AccessoryCostMultiplier *int `xml:"accessorycostmultiplier,omitempty" json:"accessorycostmultiplier,omitempty"`
	ModCostMultiplier *int `xml:"modcostmultiplier,omitempty" json:"modcostmultiplier,omitempty"`
	AddMode *string `xml:"addmode,omitempty" json:"addmode,omitempty"`
	FullBurst *int `xml:"fullburst,omitempty" json:"fullburst,omitempty"`
	Suppressive *int `xml:"suppressive,omitempty" json:"suppressive,omitempty"`
	RangeBonus *int `xml:"rangebonus,omitempty" json:"rangebonus,omitempty"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	Notes string `xml:"notes" json:"notes"`
	DiscountedCost string `xml:"discountedcost" json:"discountedcost"`
}

// CharacterWeaponMods represents weapon mods
type CharacterWeaponMods struct {
	WeaponMod []CharacterWeaponMod `xml:"weaponmod" json:"weaponmod"`
}

// CharacterWeaponUnderbarrel represents an underbarrel weapon
type CharacterWeaponUnderbarrel struct {
	Weapon CharacterWeapon `xml:"weapon" json:"weapon"`
}

// CharacterCyberware represents cyberware within a character
type CharacterCyberware struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	LimbSlot string `xml:"limbslot" json:"limbslot"`
	Ess string `xml:"ess" json:"ess"`
	Capacity string `xml:"capacity" json:"capacity"`
	Avail string `xml:"avail" json:"avail"`
	Cost string `xml:"cost" json:"cost"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	Rating int `xml:"rating" json:"rating"`
	MinRating int `xml:"minrating" json:"minrating"`
	MaxRating int `xml:"maxrating" json:"maxrating"`
	Subsystems string `xml:"subsystems" json:"subsystems"`
	Grade string `xml:"grade" json:"grade"`
	Location string `xml:"location" json:"location"`
	Suite string `xml:"suite" json:"suite"`
	EssDiscount string `xml:"essdiscount" json:"essdiscount"`
	ForceGrade CharacterCyberwareForceGrade `xml:"forcegrade" json:"forcegrade"`
	Bonus common.BaseBonus `xml:"bonus" json:"bonus"`
	AllowGear *CharacterCyberwareAllowGear `xml:"allowgear,omitempty" json:"allowgear,omitempty"`
	ImprovementSource string `xml:"improvementsource" json:"improvementsource"`
	WeaponGUID *string `xml:"weaponguid,omitempty" json:"weaponguid,omitempty"`
	Children CharacterCyberwareChildren `xml:"children" json:"children"`
	Gears *CharacterCyberwareGears `xml:"gears,omitempty" json:"gears,omitempty"`
	Notes string `xml:"notes" json:"notes"`
	DiscountedCost string `xml:"discountedcost" json:"discountedcost"`
}

// CharacterCyberwareForceGrade represents force grade
type CharacterCyberwareForceGrade struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// CharacterCyberwareAllowGear represents allowed gear for cyberware
type CharacterCyberwareAllowGear struct {
	GearCategory []string `xml:"gearcategory" json:"gearcategory"`
}

// CharacterCyberwareChildren represents children cyberware (recursive)
type CharacterCyberwareChildren struct {
	Cyberware []CharacterCyberware `xml:"cyberware,omitempty" json:"cyberware,omitempty"`
}

// CharacterCyberwareGears represents gears for cyberware
type CharacterCyberwareGears struct {
	Gear []CharacterGear `xml:"gear,omitempty" json:"gear,omitempty"`
}

// Attribute represents a character attribute
type Attribute struct {
	Name string `xml:"name" json:"name"`
	MetatypeMin int `xml:"metatypemin" json:"metatypemin"`
	MetatypeMax int `xml:"metatypemax" json:"metatypemax"`
	MetatypeAugMax int `xml:"metatypeaugmax" json:"metatypeaugmax"`
	Value int `xml:"value" json:"value"`
	AugModifier int `xml:"augmodifier" json:"augmodifier"`
	TotalValue int `xml:"totalvalue" json:"totalvalue"`
}

// Attributes represents character attributes
type Attributes struct {
	Attribute []Attribute `xml:"attribute" json:"attribute"`
}

// SkillGroup represents a skill group
type SkillGroup struct {
	Name string `xml:"name" json:"name"`
	Rating int `xml:"rating" json:"rating"`
	RatingMax int `xml:"ratingmax" json:"ratingmax"`
	Broken string `xml:"broken" json:"broken"`
}

// CharacterSkillGroups represents skill groups
type CharacterSkillGroups struct {
	SkillGroup []SkillGroup `xml:"skillgroup,omitempty" json:"skillgroup,omitempty"`
}

// CharacterSkill represents a character skill
type CharacterSkill struct {
	Name string `xml:"name" json:"name"`
	SkillGroup string `xml:"skillgroup" json:"skillgroup"`
	SkillCategory string `xml:"skillcategory" json:"skillcategory"`
	Grouped string `xml:"grouped" json:"grouped"`
	Default string `xml:"default" json:"default"`
	Rating int `xml:"rating" json:"rating"`
	RatingMax int `xml:"ratingmax" json:"ratingmax"`
	Knowledge string `xml:"knowledge" json:"knowledge"`
	Exotic string `xml:"exotic" json:"exotic"`
	Spec string `xml:"spec" json:"spec"`
	AllowDelete string `xml:"allowdelete" json:"allowdelete"`
	Attribute string `xml:"attribute" json:"attribute"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	TotalValue int `xml:"totalvalue" json:"totalvalue"`
}

// CharacterSkills represents character skills
type CharacterSkills struct {
	Skill []CharacterSkill `xml:"skill,omitempty" json:"skill,omitempty"`
}

// Contact represents a character contact
type Contact struct {
	Name string `xml:"name" json:"name"`
	Connection int `xml:"connection" json:"connection"`
	Loyalty int `xml:"loyalty" json:"loyalty"`
	Membership int `xml:"membership" json:"membership"`
	AreaOfInfluence int `xml:"areaofinfluence" json:"areaofinfluence"`
	MagicalResources int `xml:"magicalresources" json:"magicalresources"`
	MatrixResources int `xml:"matrixresources" json:"matrixresources"`
	Type string `xml:"type" json:"type"`
	File string `xml:"file" json:"file"`
	Notes string `xml:"notes" json:"notes"`
	GroupName string `xml:"groupname" json:"groupname"`
	Colour string `xml:"colour" json:"colour"`
	Free string `xml:"free" json:"free"`
}

// Contacts represents character contacts
type Contacts struct {
	Contact []Contact `xml:"contact,omitempty" json:"contact,omitempty"`
}

// CharacterSpell represents a character spell
type CharacterSpell struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Descriptors string `xml:"descriptors" json:"descriptors"`
	Category string `xml:"category" json:"category"`
	Type string `xml:"type" json:"type"`
	Range string `xml:"range" json:"range"`
	Damage string `xml:"damage" json:"damage"`
	Duration string `xml:"duration" json:"duration"`
	DV string `xml:"dv" json:"dv"`
	Limited string `xml:"limited" json:"limited"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	Extra string `xml:"extra" json:"extra"`
	Notes string `xml:"notes" json:"notes"`
}

// CharacterSpells represents character spells
type CharacterSpells struct {
	Spell []CharacterSpell `xml:"spell,omitempty" json:"spell,omitempty"`
}

// Focus represents a focus
type Focus struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	GearID string `xml:"gearid" json:"gearid"`
	Rating int `xml:"rating" json:"rating"`
}

// Foci represents character foci
type Foci struct {
	Focus []Focus `xml:"focus,omitempty" json:"focus,omitempty"`
}

// StackedFocus represents a stacked focus
type StackedFocus struct {
	GUID string `xml:"guid" json:"guid"`
	GearID string `xml:"gearid" json:"gearid"`
	Bonded string `xml:"bonded" json:"bonded"`
	Gears CharacterStackedFocusGears `xml:"gears" json:"gears"`
}

// CharacterStackedFocusGears represents gears for stacked focus
type CharacterStackedFocusGears struct {
	Gear []CharacterGear `xml:"gear" json:"gear"`
}

// StackedFoci represents stacked foci
type StackedFoci struct {
	StackedFocus []StackedFocus `xml:"stackedfocus,omitempty" json:"stackedfocus,omitempty"`
}

// CharacterPower represents an adept power
type CharacterPower struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Extra string `xml:"extra" json:"extra"`
	PointsPerLevel string `xml:"pointsperlevel" json:"pointsperlevel"`
	Rating int `xml:"rating" json:"rating"`
	Levels string `xml:"levels" json:"levels"`
	MaxLevels int `xml:"maxlevels" json:"maxlevels"`
	Discounted string `xml:"discounted" json:"discounted"`
	DiscountedGear string `xml:"discountedgeas" json:"discountedgeas"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	DoubleCost string `xml:"doublecost" json:"doublecost"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Notes string `xml:"notes" json:"notes"`
}

// CharacterPowers represents character powers
type CharacterPowers struct {
	Power []CharacterPower `xml:"power,omitempty" json:"power,omitempty"`
}

// CharacterSpirit represents a spirit or sprite
type CharacterSpirit struct {
	Name string `xml:"name" json:"name"`
	CritterName string `xml:"crittername" json:"crittername"`
	Services int `xml:"services" json:"services"`
	Force int `xml:"force" json:"force"`
	Bound string `xml:"bound" json:"bound"`
	Type string `xml:"type" json:"type"`
	File string `xml:"file" json:"file"`
	Notes string `xml:"notes" json:"notes"`
}

// CharacterSpirits represents character spirits
type CharacterSpirits struct {
	Spirit []CharacterSpirit `xml:"spirit,omitempty" json:"spirit,omitempty"`
}

// TechProgram represents a technomancer program/complex form
type TechProgram struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	Rating int `xml:"rating" json:"rating"`
	MaxRating int `xml:"maxrating" json:"maxrating"`
	Capacity string `xml:"capacity" json:"capacity"`
	Extra string `xml:"extra" json:"extra"`
	Skill string `xml:"skill" json:"skill"`
	Tags *TechProgramTags `xml:"tags,omitempty" json:"tags,omitempty"`
	ProgramOptions *TechProgramOptions `xml:"programoptions,omitempty" json:"programoptions,omitempty"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	Notes string `xml:"notes" json:"notes"`
}

// TechProgramTags represents tags for tech program
type TechProgramTags struct {
	Tag []string `xml:"tag" json:"tag"`
}

// TechProgramOption represents a program option
type TechProgramOption struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Rating int `xml:"rating" json:"rating"`
	MaxRating int `xml:"maxrating" json:"maxrating"`
	Extra string `xml:"extra" json:"extra"`
	Tags *TechProgramTags `xml:"tags,omitempty" json:"tags,omitempty"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	Notes string `xml:"notes" json:"notes"`
}

// TechProgramOptions represents program options
type TechProgramOptions struct {
	ProgramOption []TechProgramOption `xml:"programoption" json:"programoption"`
}

// TechPrograms represents character tech programs
type TechPrograms struct {
	TechProgram []TechProgram `xml:"techprogram,omitempty" json:"techprogram,omitempty"`
}

// MartialArtTechnique represents a martial art technique
type MartialArtTechnique struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Notes string `xml:"notes" json:"notes"`
}

// MartialArtTechniques represents martial art techniques
type MartialArtTechniques struct {
	MartialArtTechnique []MartialArtTechnique `xml:"martialarttechnique,omitempty" json:"martialarttechnique,omitempty"`
}

// CharacterMartialArt represents a martial art
type CharacterMartialArt struct {
	Name string `xml:"name" json:"name"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	Rating int `xml:"rating" json:"rating"`
	MartialArtTechniques MartialArtTechniques `xml:"martialarttechniques" json:"martialarttechniques"`
	Notes string `xml:"notes" json:"notes"`
}

// CharacterMartialArts represents character martial arts
type CharacterMartialArts struct {
	MartialArt []CharacterMartialArt `xml:"martialart,omitempty" json:"martialart,omitempty"`
}

// ArmorMod represents an armor mod
type ArmorMod struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	B string `xml:"b" json:"b"`
	I string `xml:"i" json:"i"`
	ArmorCapacity string `xml:"armorcapacity" json:"armorcapacity"`
	MaxRating int `xml:"maxrating" json:"maxrating"`
	Rating int `xml:"rating" json:"rating"`
	Avail string `xml:"avail" json:"avail"`
	Cost string `xml:"cost" json:"cost"`
	Bonus common.BaseBonus `xml:"bonus" json:"bonus"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	Equipped string `xml:"equipped" json:"equipped"`
	Extra string `xml:"extra" json:"extra"`
	Notes string `xml:"notes" json:"notes"`
	DiscountedCost string `xml:"discountedcost" json:"discountedcost"`
}

// ArmorMods represents armor mods
type ArmorMods struct {
	ArmorMod []ArmorMod `xml:"armormod,omitempty" json:"armormod,omitempty"`
}

// CharacterArmor represents character armor
type CharacterArmor struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	B string `xml:"b" json:"b"`
	I string `xml:"i" json:"i"`
	ArmorCapacity string `xml:"armorcapacity" json:"armorcapacity"`
	Avail string `xml:"avail" json:"avail"`
	Cost int `xml:"cost" json:"cost"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	ArmorName string `xml:"armorname" json:"armorname"`
	Equipped string `xml:"equipped" json:"equipped"`
	Extra string `xml:"extra" json:"extra"`
	BDamage int `xml:"bdamage" json:"bdamage"`
	IDamage int `xml:"idamage" json:"idamage"`
	ArmorMods ArmorMods `xml:"armormods" json:"armormods"`
	Gears *CharacterArmorGears `xml:"gears,omitempty" json:"gears,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Location string `xml:"location" json:"location"`
	Notes string `xml:"notes" json:"notes"`
	DiscountedCost string `xml:"discountedcost" json:"discountedcost"`
}

// CharacterArmorGears represents gears for armor
type CharacterArmorGears struct {
	Gear []CharacterGear `xml:"gear" json:"gear"`
}

// Armors represents character armor
type Armors struct {
	Armor []CharacterArmor `xml:"armor,omitempty" json:"armor,omitempty"`
}

// CharacterWeapons represents character weapons
type CharacterWeapons struct {
	Weapon []CharacterWeapon `xml:"weapon,omitempty" json:"weapon,omitempty"`
}

// CharacterCyberwares represents character cyberware
type CharacterCyberwares struct {
	Cyberware []CharacterCyberware `xml:"cyberware,omitempty" json:"cyberware,omitempty"`
}

// CharacterQuality represents a character quality
type CharacterQuality struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Extra string `xml:"extra" json:"extra"`
	BP int `xml:"bp" json:"bp"`
	ContributeToLimit string `xml:"contributetolimit" json:"contributetolimit"`
	Print string `xml:"print" json:"print"`
	QualityType string `xml:"qualitytype" json:"qualitytype"`
	QualitySource string `xml:"qualitysource" json:"qualitysource"`
	Mutant *string `xml:"mutant,omitempty" json:"mutant,omitempty"`
	Free string `xml:"free" json:"free"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	Bonus common.BaseBonus `xml:"bonus" json:"bonus"`
	WeaponGUID *string `xml:"weaponguid,omitempty" json:"weaponguid,omitempty"`
	Notes string `xml:"notes" json:"notes"`
}

// CharacterQualities represents character qualities
type CharacterQualities struct {
	Quality []CharacterQuality `xml:"quality,omitempty" json:"quality,omitempty"`
}

// LifestyleQualities represents lifestyle qualities
type LifestyleQualities struct {
	Quality []string `xml:"quality,omitempty" json:"quality,omitempty"`
}

// Lifestyle represents a lifestyle
type Lifestyle struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Cost int `xml:"cost" json:"cost"`
	Dice int `xml:"dice" json:"dice"`
	Multiplier int `xml:"multiplier" json:"multiplier"`
	Months int `xml:"months" json:"months"`
	Roommates int `xml:"roommates" json:"roommates"`
	Percentage int `xml:"percentage" json:"percentage"`
	LifestyleName string `xml:"lifestylename" json:"lifestylename"`
	Purchased string `xml:"purchased" json:"purchased"`
	Comforts string `xml:"comforts" json:"comforts"`
	Entertainment string `xml:"entertainment" json:"entertainment"`
	Necessities string `xml:"necessities" json:"necessities"`
	Neighborhood string `xml:"neighborhood" json:"neighborhood"`
	Security string `xml:"security" json:"security"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	Type string `xml:"type" json:"type"`
	Qualities LifestyleQualities `xml:"qualities" json:"qualities"`
	Notes string `xml:"notes" json:"notes"`
}

// Lifestyles represents character lifestyles
type Lifestyles struct {
	Lifestyle *Lifestyle `xml:"lifestyle,omitempty" json:"lifestyle,omitempty"`
}

// CharacterGears represents character gear
type CharacterGears struct {
	Gear []CharacterGear `xml:"gear,omitempty" json:"gear,omitempty"`
}

// CharacterVehicleModBonus represents vehicle mod bonus
type CharacterVehicleModBonus struct {
	Accel *string `xml:"accel,omitempty" json:"accel,omitempty"`
	Armor *string `xml:"armor,omitempty" json:"armor,omitempty"`
	Body *string `xml:"body,omitempty" json:"body,omitempty"`
	Handling *string `xml:"handling,omitempty" json:"handling,omitempty"`
	Speed *string `xml:"speed,omitempty" json:"speed,omitempty"`
	ImproveSensor *string `xml:"improvesensor,omitempty" json:"improvesensor,omitempty"`
	SelectText *string `xml:"selecttext,omitempty" json:"selecttext,omitempty"`
	DeviceRating *string `xml:"devicerating,omitempty" json:"devicerating,omitempty"`
}

// CharacterVehicleModWeapons represents weapons for vehicle mod
type CharacterVehicleModWeapons struct {
	Weapon []CharacterWeapon `xml:"weapon,omitempty" json:"weapon,omitempty"`
}

// CharacterVehicleMod represents a vehicle mod
type CharacterVehicleMod struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	Limit string `xml:"limit" json:"limit"`
	Slots string `xml:"slots" json:"slots"`
	Rating int `xml:"rating" json:"rating"`
	MaxRating string `xml:"maxrating" json:"maxrating"`
	Avail string `xml:"avail" json:"avail"`
	Cost string `xml:"cost" json:"cost"`
	Extra string `xml:"extra" json:"extra"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	Included string `xml:"included" json:"included"`
	Installed string `xml:"installed" json:"installed"`
	Subsystems string `xml:"subsystems" json:"subsystems"`
	Weapons CharacterVehicleModWeapons `xml:"weapons" json:"weapons"`
	Bonus *CharacterVehicleModBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Notes string `xml:"notes" json:"notes"`
	DiscountedCost string `xml:"discountedcost" json:"discountedcost"`
}

// CharacterVehicleMods represents vehicle mods
type CharacterVehicleMods struct {
	Mod []CharacterVehicleMod `xml:"mod,omitempty" json:"mod,omitempty"`
}

// CharacterVehicleGears represents gears for vehicle
type CharacterVehicleGears struct {
	Gear []CharacterGear `xml:"gear,omitempty" json:"gear,omitempty"`
}

// CharacterVehicleWeapons represents weapons for vehicle
type CharacterVehicleWeapons struct {
	Weapon []CharacterWeapon `xml:"weapon,omitempty" json:"weapon,omitempty"`
}

// CharacterVehicleLocations represents vehicle locations
type CharacterVehicleLocations struct {
	Location []string `xml:"location,omitempty" json:"location,omitempty"`
}

// CharacterVehicle represents a vehicle
type CharacterVehicle struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	Handling int `xml:"handling" json:"handling"`
	Accel string `xml:"accel" json:"accel"`
	Speed int `xml:"speed" json:"speed"`
	Pilot int `xml:"pilot" json:"pilot"`
	Body int `xml:"body" json:"body"`
	Armor int `xml:"armor" json:"armor"`
	Sensor int `xml:"sensor" json:"sensor"`
	DeviceRating int `xml:"devicerating" json:"devicerating"`
	Avail string `xml:"avail" json:"avail"`
	Cost string `xml:"cost" json:"cost"`
	AddSlots int `xml:"addslots" json:"addslots"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	PhysicalCMFilled int `xml:"physicalcmfilled" json:"physicalcmfilled"`
	VehicleName string `xml:"vehiclename" json:"vehiclename"`
	HomeNode string `xml:"homenode" json:"homenode"`
	Mods CharacterVehicleMods `xml:"mods" json:"mods"`
	Gears CharacterVehicleGears `xml:"gears" json:"gears"`
	Weapons CharacterVehicleWeapons `xml:"weapons" json:"weapons"`
	Locations *CharacterVehicleLocations `xml:"locations,omitempty" json:"locations,omitempty"`
	Notes string `xml:"notes" json:"notes"`
	DiscountedCost string `xml:"discountedcost" json:"discountedcost"`
}

// CharacterVehicles represents character vehicles
type CharacterVehicles struct {
	Vehicle []CharacterVehicle `xml:"vehicle,omitempty" json:"vehicle,omitempty"`
}

// Metamagic represents a metamagic or echo
type Metamagic struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Source string `xml:"source" json:"source"`
	PaidWithKarma string `xml:"paidwithkarma" json:"paidwithkarma"`
	Page string `xml:"page" json:"page"`
	Bonus common.BaseBonus `xml:"bonus" json:"bonus"`
	ImprovementSource string `xml:"improvementsource" json:"improvementsource"`
	Notes string `xml:"notes" json:"notes"`
}

// Metamagics represents character metamagics
type Metamagics struct {
	Metamagic []Metamagic `xml:"metamagic,omitempty" json:"metamagic,omitempty"`
}

// CharacterCritterPower represents a critter power
type CharacterCritterPower struct {
	GUID string `xml:"guid" json:"guid"`
	Name string `xml:"name" json:"name"`
	Extra string `xml:"extra" json:"extra"`
	Category string `xml:"category" json:"category"`
	Type string `xml:"type" json:"type"`
	Action string `xml:"action" json:"action"`
	Range string `xml:"range" json:"range"`
	Duration string `xml:"duration" json:"duration"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
	Points string `xml:"points" json:"points"`
	CountTowardsLimit string `xml:"counttowardslimit" json:"counttowardslimit"`
	Bonus common.BaseBonus `xml:"bonus" json:"bonus"`
	Notes string `xml:"notes" json:"notes"`
}

// CharacterCritterPowers represents character critter powers
type CharacterCritterPowers struct {
	CritterPower []CharacterCritterPower `xml:"critterpower,omitempty" json:"critterpower,omitempty"`
}

// InitiationGrade represents an initiation or submersion grade
type InitiationGrade struct {
	GUID string `xml:"guid" json:"guid"`
	Res string `xml:"res" json:"res"`
	Grade string `xml:"grade" json:"grade"`
	Group string `xml:"group" json:"group"`
	Ordeal string `xml:"ordeal" json:"ordeal"`
	Notes string `xml:"notes" json:"notes"`
}

// InitiationGrades represents initiation grades
type InitiationGrades struct {
	InitiationGrade []InitiationGrade `xml:"initiationgrade,omitempty" json:"initiationgrade,omitempty"`
}

// Improvement represents an improvement
type Improvement struct {
	Unique *string `xml:"unique,omitempty" json:"unique,omitempty"`
	ImprovedName string `xml:"improvedname" json:"improvedname"`
	SourceName string `xml:"sourcename" json:"sourcename"`
	Min int `xml:"min" json:"min"`
	Max int `xml:"max" json:"max"`
	Aug int `xml:"aug" json:"aug"`
	AugMax int `xml:"augmax" json:"augmax"`
	Val int `xml:"val" json:"val"`
	Rating int `xml:"rating" json:"rating"`
	Exclude string `xml:"exclude" json:"exclude"`
	ImprovementType string `xml:"improvementttype" json:"improvementttype"`
	ImprovementSource string `xml:"improvementsource" json:"improvementsource"`
	Custom string `xml:"custom" json:"custom"`
	CustomName string `xml:"customname" json:"customname"`
	CustomID string `xml:"customid" json:"customid"`
	CustomGroup string `xml:"customgroup" json:"customgroup"`
	AddToRating string `xml:"addtorating" json:"addtorating"`
	Enabled string `xml:"enabled" json:"enabled"`
	Order int `xml:"order" json:"order"`
	Notes string `xml:"notes" json:"notes"`
}

// Improvements represents character improvements
type Improvements struct {
	Improvement []Improvement `xml:"improvement,omitempty" json:"improvement,omitempty"`
}

// ExpenseUndo represents expense undo information
type ExpenseUndo struct {
	KarmaType string `xml:"karmatype" json:"karmatype"`
	NuyenType string `xml:"nuyentype" json:"nuyentype"`
	ObjectID string `xml:"objectid" json:"objectid"`
	Qty int `xml:"qty" json:"qty"`
	Extra string `xml:"extra" json:"extra"`
}

// Expense represents an expense
type Expense struct {
	GUID string `xml:"guid" json:"guid"`
	Date string `xml:"date" json:"date"`
	Amount int `xml:"amount" json:"amount"`
	Reason string `xml:"reason" json:"reason"`
	Type string `xml:"type" json:"type"`
	Refund string `xml:"refund" json:"refund"`
	Undo *ExpenseUndo `xml:"undo,omitempty" json:"undo,omitempty"`
}

// Expenses represents character expenses
type Expenses struct {
	Expense []Expense `xml:"expense,omitempty" json:"expense,omitempty"`
}

// Locations represents character locations
type Locations struct {
	Location []string `xml:"location,omitempty" json:"location,omitempty"`
}

// ArmorBundles represents armor bundles
type ArmorBundles struct {
	ArmorBundle []string `xml:"armorbundle,omitempty" json:"armorbundle,omitempty"`
}

// WeaponLocations represents weapon locations
type WeaponLocations struct {
	WeaponLocation []string `xml:"weaponlocation,omitempty" json:"weaponlocation,omitempty"`
}

// ImprovementGroups represents improvement groups
type ImprovementGroups struct {
	ImprovementGroup []string `xml:"improvementgroup,omitempty" json:"improvementgroup,omitempty"`
}

// CalendarWeek represents a calendar week
type CalendarWeek struct {
	GUID string `xml:"guid" json:"guid"`
	Year int `xml:"year" json:"year"`
	Week int `xml:"week" json:"week"`
	Notes string `xml:"notes" json:"notes"`
}

// Calendar represents character calendar
type Calendar struct {
	Week []CalendarWeek `xml:"week,omitempty" json:"week,omitempty"`
}

// Character represents a Shadowrun character
type Character struct {
	Settings string `xml:"settings" json:"settings"`
	Metatype string `xml:"metatype" json:"metatype"`
	MetatypeBP int `xml:"metatypebp" json:"metatypebp"`
	Metavariant string `xml:"metavariant" json:"metavariant"`
	MetatypeCategory string `xml:"metatypecategory" json:"metatypecategory"`
	Movement string `xml:"movement" json:"movement"`
	Name string `xml:"name" json:"name"`
	Mugshot string `xml:"mugshot" json:"mugshot"`
	Sex string `xml:"sex" json:"sex"`
	Gender string `xml:"gender" json:"gender"`
	Age string `xml:"age" json:"age"`
	Eyes string `xml:"eyes" json:"eyes"`
	Height string `xml:"height" json:"height"`
	Weight string `xml:"weight" json:"weight"`
	Skin string `xml:"skin" json:"skin"`
	Hair string `xml:"hair" json:"hair"`
	Description string `xml:"description" json:"description"`
	Background string `xml:"background" json:"background"`
	Concept string `xml:"concept" json:"concept"`
	Notes string `xml:"notes" json:"notes"`
	Alias string `xml:"alias" json:"alias"`
	PlayerName string `xml:"playername" json:"playername"`
	GameNotes string `xml:"gamenotes" json:"gamenotes"`
	IgnoreRules *string `xml:"ignorerules,omitempty" json:"ignorerules,omitempty"`
	IsCritter *string `xml:"iscritter,omitempty" json:"iscritter,omitempty"`
	Possessed *string `xml:"possessed,omitempty" json:"possessed,omitempty"`
	Karma int `xml:"karma" json:"karma"`
	TotalKarma int `xml:"totalkarma" json:"totalkarma"`
	StreetCred int `xml:"streetcred" json:"streetcred"`
	Notoriety int `xml:"notoriety" json:"notoriety"`
	PublicAwareness int `xml:"publicawareness" json:"publicawareness"`
	BurntStreetCred int `xml:"burntstreetcred" json:"burntstreetcred"`
	Created string `xml:"created" json:"created"`
	MaxAvail int `xml:"maxavail" json:"maxavail"`
	Nuyen int `xml:"nuyen" json:"nuyen"`
	BP int `xml:"bp" json:"bp"`
	BuildKarma int `xml:"buildkarma" json:"buildkarma"`
	BuildMethod string `xml:"buildmethod" json:"buildmethod"`
	KnowPts int `xml:"knowpts" json:"knowpts"`
	NuyenBP int `xml:"nuyenbp" json:"nuyenbp"`
	NuyenMaxBP int `xml:"nuyenmaxbp" json:"nuyenmaxbp"`
	Adept string `xml:"adept" json:"adept"`
	Magician string `xml:"magician" json:"magician"`
	Technomancer string `xml:"technomancer" json:"technomancer"`
	InitiationOverride string `xml:"initiationoverride" json:"initiationoverride"`
	Critter string `xml:"critter" json:"critter"`
	Uneducated string `xml:"uneducated" json:"uneducated"`
	Uncouth string `xml:"uncouth" json:"uncouth"`
	Infirm string `xml:"infirm" json:"infirm"`
	Attributes Attributes `xml:"attributes" json:"attributes"`
	MagEnabled string `xml:"magenabled" json:"magenabled"`
	InitiateGrade int `xml:"initiategrade" json:"initiategrade"`
	ResEnabled string `xml:"resenabled" json:"resenabled"`
	SubmersionGrade int `xml:"submersiongrade" json:"submersiongrade"`
	GroupMember string `xml:"groupmember" json:"groupmember"`
	GroupName string `xml:"groupname" json:"groupname"`
	GroupNotes string `xml:"groupnotes" json:"groupnotes"`
	TotalEss string `xml:"totaless" json:"totaless"`
	MagSplitAdept *int `xml:"magsplitadept,omitempty" json:"magsplitadept,omitempty"`
	MagSplitMagician *int `xml:"magsplitmagician,omitempty" json:"magsplitmagician,omitempty"`
	Tradition string `xml:"tradition" json:"tradition"`
	Stream string `xml:"stream" json:"stream"`
	PhysicalCMFilled int `xml:"physicalcmfilled" json:"physicalcmfilled"`
	StunCMFilled int `xml:"stuncmfilled" json:"stuncmfilled"`
		SkillGroups CharacterSkillGroups `xml:"skillgroups" json:"skillgroups"`
		Skills CharacterSkills `xml:"skills" json:"skills"`
		Contacts Contacts `xml:"contacts" json:"contacts"`
		Spells CharacterSpells `xml:"spells" json:"spells"`
		Foci Foci `xml:"foci" json:"foci"`
		StackedFoci StackedFoci `xml:"stackedfoci" json:"stackedfoci"`
		Powers CharacterPowers `xml:"powers" json:"powers"`
		Spirits CharacterSpirits `xml:"spirits" json:"spirits"`
		TechPrograms TechPrograms `xml:"techprograms" json:"techprograms"`
		MartialArts CharacterMartialArts `xml:"martialarts" json:"martialarts"`
		Armors Armors `xml:"armors" json:"armors"`
		Weapons CharacterWeapons `xml:"weapons" json:"weapons"`
		Cyberwares CharacterCyberwares `xml:"cyberwares" json:"cyberwares"`
		Qualities CharacterQualities `xml:"qualities" json:"qualities"`
		Lifestyles Lifestyles `xml:"lifestyles" json:"lifestyles"`
		Gears CharacterGears `xml:"gears" json:"gears"`
		Vehicles CharacterVehicles `xml:"vehicles" json:"vehicles"`
		Metamagics Metamagics `xml:"metamagics" json:"metamagics"`
		CritterPowers CharacterCritterPowers `xml:"critterpowers" json:"critterpowers"`
	InitiationGrades InitiationGrades `xml:"initiationgrades" json:"initiationgrades"`
	Improvements Improvements `xml:"improvements" json:"improvements"`
	Expenses Expenses `xml:"expenses" json:"expenses"`
	Locations Locations `xml:"locations" json:"locations"`
	ArmorBundles ArmorBundles `xml:"armorbundles" json:"armorbundles"`
	WeaponLocations WeaponLocations `xml:"weaponlocations" json:"weaponlocations"`
	ImprovementGroups ImprovementGroups `xml:"improvementgroups" json:"improvementgroups"`
	Calendar Calendar `xml:"calendar" json:"calendar"`
}

// CharacterDataSet represents the root dataset element
type CharacterDataSet struct {
	Character []Character `xml:"character" json:"character"`
}

