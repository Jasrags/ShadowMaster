package v5

// This file contains pack structures generated from packs.xsd

// PackQuality represents a quality in a pack
type PackQuality struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// PackQualities represents qualities in a pack
type PackQualities struct {
	Positive *PackQualitiesPositive `xml:"positive,omitempty" json:"positive,omitempty"`
	Negative *PackQualitiesNegative `xml:"negative,omitempty" json:"negative,omitempty"`
}

// PackQualitiesPositive represents positive qualities
type PackQualitiesPositive struct {
	Quality []PackQuality `xml:"quality" json:"quality"`
}

// PackQualitiesNegative represents negative qualities
type PackQualitiesNegative struct {
	Quality []PackQuality `xml:"quality" json:"quality"`
}

// PackAttributes represents attributes in a pack
type PackAttributes struct {
	BOD string `xml:"bod" json:"bod"`
	AGI string `xml:"agi" json:"agi"`
	REA string `xml:"rea" json:"rea"`
	STR string `xml:"str" json:"str"`
	CHA string `xml:"cha" json:"cha"`
	INT string `xml:"int" json:"int"`
	LOG string `xml:"log" json:"log"`
	WIL string `xml:"wil" json:"wil"`
	MAG *string `xml:"mag,omitempty" json:"mag,omitempty"`
	RES *string `xml:"res,omitempty" json:"res,omitempty"`
}

// PackSkill represents a skill in a pack
type PackSkill struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Colt Cobra TZ-120
	Name string `xml:"name" json:"name"`
	Rating int `xml:"rating" json:"rating"`
	Spec *string `xml:"spec,omitempty" json:"spec,omitempty"`
}

// PackSkillGroup represents a skill group in a pack
type PackSkillGroup struct {
	Name string `xml:"name" json:"name"`
	Rating int `xml:"rating" json:"rating"`
}

// PackSkills represents skills in a pack
type PackSkills struct {
	Skill []PackSkill `xml:"skill,omitempty" json:"skill,omitempty"`
	SkillGroup []PackSkillGroup `xml:"skillgroup,omitempty" json:"skillgroup,omitempty"`
}

// PackPowerName represents a power name in a pack
type PackPowerName struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// PackPower represents a power in a pack
type PackPower struct {
	Name PackPowerName `xml:"name" json:"name"`
// Rating represents rating
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1, 1
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
}

// PackPowers represents powers in a pack
type PackPowers struct {
	Power []PackPower `xml:"power" json:"power"`
}

// PackProgram represents a program in a pack
type PackProgram struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Colt Cobra TZ-120
	Name string `xml:"name" json:"name"`
	Rating int `xml:"rating" json:"rating"`
}

// PackPrograms represents programs in a pack
type PackPrograms struct {
	Program []PackProgram `xml:"program" json:"program"`
}

// PackSpell represents a spell in a pack
type PackSpell struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// PackSpells represents spells in a pack
type PackSpells struct {
	Spell []PackSpell `xml:"spell" json:"spell"`
}

// PackSpirit represents a spirit in a pack
type PackSpirit struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Colt Cobra TZ-120
	Name string `xml:"name" json:"name"`
	Force int `xml:"force" json:"force"`
	Services int `xml:"services" json:"services"`
}

// PackSpirits represents spirits in a pack
type PackSpirits struct {
	Spirit []PackSpirit `xml:"spirit" json:"spirit"`
}

// PackCyberware represents a cyberware item in a pack
type PackCyberware struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Colt Cobra TZ-120
	Name string `xml:"name" json:"name"`
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
	Grade string `xml:"grade" json:"grade"`
	Cyberwares *PackCyberwares `xml:"cyberwares,omitempty" json:"cyberwares,omitempty"`
	Gears *PackGears `xml:"gears,omitempty" json:"gears,omitempty"`
}

// PackCyberwares represents nested cyberware in a pack
type PackCyberwares struct {
	Cyberware []PackCyberware `xml:"cyberware" json:"cyberware"`
}

// PackBioware represents a bioware item in a pack
type PackBioware struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Colt Cobra TZ-120
	Name string `xml:"name" json:"name"`
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
	Grade string `xml:"grade" json:"grade"`
}

// PackBiowares represents bioware in a pack
type PackBiowares struct {
	Bioware []PackBioware `xml:"bioware" json:"bioware"`
}

// PackArmorMod represents an armor mod in a pack
type PackArmorMod struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Colt Cobra TZ-120
	Name string `xml:"name" json:"name"`
	Rating *string `xml:"rating,omitempty" json:"rating,omitempty"`
}

// PackArmorMods represents armor mods in a pack
type PackArmorMods struct {
	Mod []PackArmorMod `xml:"mod" json:"mod"`
}

// PackArmor represents an armor item in a pack
type PackArmor struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Colt Cobra TZ-120
	Name string `xml:"name" json:"name"`
	Gears *PackGears `xml:"gears,omitempty" json:"gears,omitempty"`
	Mods *PackArmorMods `xml:"mods,omitempty" json:"mods,omitempty"`
}

// PackArmors represents armor in a pack
type PackArmors struct {
	Armor []PackArmor `xml:"armor" json:"armor"`
}

// PackWeaponAccessory represents a weapon accessory in a pack
type PackWeaponAccessory struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Colt Cobra TZ-120
	Name string `xml:"name" json:"name"`
	Mount *string `xml:"mount,omitempty" json:"mount,omitempty"`
}

// PackWeaponAccessories represents weapon accessories in a pack
type PackWeaponAccessories struct {
	Accessory []PackWeaponAccessory `xml:"accessory" json:"accessory"`
}

// PackWeaponMod represents a weapon mod in a pack
type PackWeaponMod struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Colt Cobra TZ-120
	Name string `xml:"name" json:"name"`
	Rating *string `xml:"rating,omitempty" json:"rating,omitempty"`
}

// PackWeaponMods represents weapon mods in a pack
type PackWeaponMods struct {
	Mod []PackWeaponMod `xml:"mod" json:"mod"`
}

// PackWeapon represents a weapon in a pack
type PackWeapon struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Colt Cobra TZ-120
	Name string `xml:"name" json:"name"`
	Accessories *PackWeaponAccessories `xml:"accessories,omitempty" json:"accessories,omitempty"`
	Mods *PackWeaponMods `xml:"mods,omitempty" json:"mods,omitempty"`
}

// PackWeapons represents weapons in a pack
type PackWeapons struct {
	Weapon []PackWeapon `xml:"weapon" json:"weapon"`
}

// PackGearName represents a gear name in a pack
type PackGearName struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// PackGear represents a gear item in a pack
type PackGear struct {
	Name PackGearName `xml:"name" json:"name"`
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: Vision Enhancements, Vision Enhancements, Audio Enhancements
// Enum Candidate: Audio Enhancements, Vision Enhancements
// Length: 18-19 characters
	Category *string `xml:"category,omitempty" json:"category,omitempty"`
	Qty *int `xml:"qty,omitempty" json:"qty,omitempty"`
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
	Bonded *string `xml:"bonded,omitempty" json:"bonded,omitempty"`
	Gears *PackGears `xml:"gears,omitempty" json:"gears,omitempty"`
}

// PackGears represents gears in a pack (recursive)
type PackGears struct {
	Gear []PackGear `xml:"gear" json:"gear"`
}

// PackVehicleMod represents a vehicle mod in a pack
type PackVehicleMod struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Colt Cobra TZ-120
	Name string `xml:"name" json:"name"`
	Rating *string `xml:"rating,omitempty" json:"rating,omitempty"`
}

// PackVehicleMods represents vehicle mods in a pack
type PackVehicleMods struct {
	Mod []PackVehicleMod `xml:"mod" json:"mod"`
}

// PackVehicle represents a vehicle in a pack
type PackVehicle struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Colt Cobra TZ-120
	Name string `xml:"name" json:"name"`
	Mods *PackVehicleMods `xml:"mods,omitempty" json:"mods,omitempty"`
	Gears *PackGears `xml:"gears,omitempty" json:"gears,omitempty"`
	Weapons *PackWeapons `xml:"weapons,omitempty" json:"weapons,omitempty"`
}

// PackVehicles represents vehicles in a pack
type PackVehicles struct {
	Vehicle []PackVehicle `xml:"vehicle" json:"vehicle"`
}

// PackLifestyleQuality represents a lifestyle quality in a pack
type PackLifestyleQuality struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Colt Cobra TZ-120
	Name string `xml:"name" json:"name"`
	Rating *string `xml:"rating,omitempty" json:"rating,omitempty"`
}

// PackLifestyleQualities represents lifestyle qualities in a pack
type PackLifestyleQualities struct {
	Quality []PackLifestyleQuality `xml:"quality" json:"quality"`
}

// PackLifestyle represents a lifestyle in a pack
type PackLifestyle struct {
// BaseLifestyle represents baselifestyle
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Low, Low
	BaseLifestyle string `xml:"baselifestyle" json:"baselifestyle"`
	Months int `xml:"months" json:"months"`
	Qualities *PackLifestyleQualities `xml:"qualities,omitempty" json:"qualities,omitempty"`
}

// PackLifestyles represents lifestyles in a pack
type PackLifestyles struct {
	Lifestyle []PackLifestyle `xml:"lifestyle" json:"lifestyle"`
}

// PackCategory represents a category in packs
type PackCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// PackCategories represents categories in packs
type PackCategories struct {
	Category []PackCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// Pack represents a pack definition
type Pack struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Colt Cobra TZ-120
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	NuyenBP int `xml:"nuyenbp" json:"nuyenbp"`
	Armors *PackArmors `xml:"armors,omitempty" json:"armors,omitempty"`
	Attributes *PackAttributes `xml:"attributes,omitempty" json:"attributes,omitempty"`
	Biowares *PackBiowares `xml:"biowares,omitempty" json:"biowares,omitempty"`
	Cyberwares *PackCyberwares `xml:"cyberwares,omitempty" json:"cyberwares,omitempty"`
	Gears *PackGears `xml:"gears,omitempty" json:"gears,omitempty"`
	Lifestyles *PackLifestyles `xml:"lifestyles,omitempty" json:"lifestyles,omitempty"`
	Powers *PackPowers `xml:"powers,omitempty" json:"powers,omitempty"`
	Programs *PackPrograms `xml:"programs,omitempty" json:"programs,omitempty"`
	Qualities *PackQualities `xml:"qualities,omitempty" json:"qualities,omitempty"`
	SelectMartialArt *string `xml:"selectmartialart,omitempty" json:"selectmartialart,omitempty"`
	Skills *PackSkills `xml:"skills,omitempty" json:"skills,omitempty"`
	Spells *PackSpells `xml:"spells,omitempty" json:"spells,omitempty"`
	Spirits *PackSpirits `xml:"spirits,omitempty" json:"spirits,omitempty"`
	Vehicles *PackVehicles `xml:"vehicles,omitempty" json:"vehicles,omitempty"`
	Weapons *PackWeapons `xml:"weapons,omitempty" json:"weapons,omitempty"`
}

// Packs represents a collection of packs
type Packs struct {
	Pack []Pack `xml:"pack,omitempty" json:"pack,omitempty"`
}

// PacksChummer represents the root chummer element for packs
type PacksChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories *PackCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Packs *Packs `xml:"packs,omitempty" json:"packs,omitempty"`
}

