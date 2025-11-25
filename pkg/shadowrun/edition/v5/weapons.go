package v5

import "fmt"

// WeaponType represents the category of weapon
type WeaponType string

const (
	WeaponTypeMeleeBlade     WeaponType = "melee_blade"
	WeaponTypeMeleeClub      WeaponType = "melee_club"
	WeaponTypeMeleeOther     WeaponType = "melee_other"
	WeaponTypeThrowing       WeaponType = "throwing"
	WeaponTypeTaser          WeaponType = "taser"
	WeaponTypeHoldOut        WeaponType = "hold_out"
	WeaponTypeLightPistol    WeaponType = "light_pistol"
	WeaponTypeHeavyPistol    WeaponType = "heavy_pistol"
	WeaponTypeMachinePistol  WeaponType = "machine_pistol"
	WeaponTypeSubmachineGun  WeaponType = "submachine_gun"
	WeaponTypeAssaultRifle   WeaponType = "assault_rifle"
	WeaponTypeSniperRifle    WeaponType = "sniper_rifle"
	WeaponTypeShotgun        WeaponType = "shotgun"
	WeaponTypeSpecialWeapon  WeaponType = "special_weapon"
	WeaponTypeMachineGun     WeaponType = "machine_gun"
	WeaponTypeCannonLauncher WeaponType = "cannon_launcher"
)

// WeaponSkill represents the skill required to use a weapon
type WeaponSkill string

const (
	WeaponSkillBlades             WeaponSkill = "Blades"
	WeaponSkillClubs              WeaponSkill = "Clubs"
	WeaponSkillUnarmedCombat      WeaponSkill = "Unarmed Combat"
	WeaponSkillPistols            WeaponSkill = "Pistols"
	WeaponSkillAutomatics         WeaponSkill = "Automatics"
	WeaponSkillLongarms           WeaponSkill = "Longarms"
	WeaponSkillHeavyWeapons       WeaponSkill = "Heavy Weapons"
	WeaponSkillExoticMeleeWeapon  WeaponSkill = "Exotic Melee Weapon"
	WeaponSkillExoticRangedWeapon WeaponSkill = "Exotic Ranged Weapon"
	WeaponSkillArchery            WeaponSkill = "Archery"
)

// FireMode represents the firing modes available for a weapon
type FireMode string

const (
	FireModeSS FireMode = "SS" // Single Shot
	FireModeSA FireMode = "SA" // Semi-Automatic
	FireModeBF FireMode = "BF" // Burst Fire
	FireModeFA FireMode = "FA" // Full Auto
)

// DamageType represents the type of damage dealt
type DamageType string

const (
	DamageTypePhysical    DamageType = "P"    // Physical
	DamageTypeStun        DamageType = "S"    // Stun
	DamageTypeElectricity DamageType = "S(e)" // Stun (Electricity)
	DamageTypeFire        DamageType = "P(f)" // Physical (Fire)
	DamageTypeChemical    DamageType = "P(c)" // Physical (Chemical)
)

// WeaponSpecialProperty represents special properties of a weapon
type WeaponSpecialProperty struct {
	// ConcealabilityModifier modifies concealability (negative = easier to conceal)
	ConcealabilityModifier int `json:"concealability_modifier,omitempty"`
	// ConcealabilityModifierWhenRetracted applies when weapon is retracted
	ConcealabilityModifierWhenRetracted int `json:"concealability_modifier_when_retracted,omitempty"`
	// ConcealabilityModifierWhenExtended applies when weapon is extended
	ConcealabilityModifierWhenExtended int `json:"concealability_modifier_when_extended,omitempty"`
	// Reach indicates reach for melee weapons
	Reach int `json:"reach,omitempty"`
	// StrengthMinimum indicates minimum Strength required (for bows)
	StrengthMinimum int `json:"strength_minimum,omitempty"`
	// Rating indicates weapon rating (for bows, used for range and damage)
	Rating int `json:"rating,omitempty"`
	// MaxRating indicates maximum rating available
	MaxRating int `json:"max_rating,omitempty"`
	// BuiltInFeatures lists built-in features (e.g., "smartgun system", "silencer", "laser sight")
	BuiltInFeatures []string `json:"built_in_features,omitempty"`
	// RecoilCompensation indicates built-in recoil compensation
	RecoilCompensation int `json:"recoil_compensation,omitempty"`
	// CanMountTopAccessories indicates if top-mounted accessories can be attached
	CanMountTopAccessories bool `json:"can_mount_top_accessories,omitempty"`
	// CanMountBarrelAccessories indicates if barrel-mounted accessories can be attached
	CanMountBarrelAccessories bool `json:"can_mount_barrel_accessories,omitempty"`
	// CanMountUnderbarrelAccessories indicates if underbarrel-mounted accessories can be attached
	CanMountUnderbarrelAccessories bool `json:"can_mount_underbarrel_accessories,omitempty"`
	// Retractable indicates if weapon can be retracted/extended
	Retractable bool `json:"retractable,omitempty"`
	// Disassemblable indicates if weapon can be disassembled (e.g., Ranger Arms SM-5)
	Disassemblable bool `json:"disassemblable,omitempty"`
	// DisassemblyTime describes time to assemble/disassemble
	DisassemblyTime string `json:"disassembly_time,omitempty"`
	// Fragile indicates if weapon is fragile (e.g., Ranger Arms SM-5 loses Accuracy in combat)
	Fragile bool `json:"fragile,omitempty"`
	// FragilityRules describes how fragility affects the weapon
	FragilityRules string `json:"fragility_rules,omitempty"`
	// Charges indicates charge capacity and recharge rate
	Charges string `json:"charges,omitempty"`
	// ColorChangeable indicates if weapon color can be changed
	ColorChangeable bool `json:"color_changeable,omitempty"`
	// ActionTimeChange describes action time changes (e.g., "Simple Action to Free Action")
	ActionTimeChange string `json:"action_time_change,omitempty"`
	// SpecialRules describes special rules for the weapon (e.g., shotgun rules, bow rules)
	SpecialRules string `json:"special_rules,omitempty"`
	// AmmoTypeRestriction indicates if weapon can only use specific ammo types
	AmmoTypeRestriction string `json:"ammo_type_restriction,omitempty"`
	// GlitchEffects describes what happens on glitches (e.g., monofilament whip)
	GlitchEffects string `json:"glitch_effects,omitempty"`
	// CriticalGlitchEffects describes what happens on critical glitches
	CriticalGlitchEffects string `json:"critical_glitch_effects,omitempty"`
	// MeleeMode indicates if ranged weapon can be used in melee
	MeleeMode *MeleeMode `json:"melee_mode,omitempty"`
	// StockType indicates type of stock (folding, rigid, detachable, etc.)
	StockType string `json:"stock_type,omitempty"`
	// DoubleRecoilPenalty indicates if weapon suffers double modifiers for uncompensated recoil
	DoubleRecoilPenalty bool `json:"double_recoil_penalty,omitempty"`
}

// MeleeMode represents melee combat statistics for a ranged weapon
type MeleeMode struct {
	Accuracy int    `json:"accuracy"`
	Damage   string `json:"damage"`
	Reach    int    `json:"reach,omitempty"`
}

// Weapon represents a weapon definition
type Weapon struct {
	// Name is the weapon name (e.g., "Ares Predator V", "Katana")
	Name string `json:"name,omitempty"`
	// Type indicates the category of weapon
	Type WeaponType `json:"type,omitempty"`
	// Description is the full text description
	Description string `json:"description,omitempty"`
	// Skill indicates the skill required to use this weapon
	Skill WeaponSkill `json:"skill,omitempty"`
	// ExoticSkillName is the name of the exotic weapon skill if Skill is ExoticMeleeWeapon or ExoticRangedWeapon
	ExoticSkillName string `json:"exotic_skill_name,omitempty"`
	// Damage is the base damage value and type (e.g., "8P", "6S(e)")
	Damage string `json:"damage,omitempty"`
	// Accuracy is the weapon's base accuracy rating
	Accuracy int `json:"accuracy,omitempty"`
	// AP is the armor penetration value (negative number, e.g., -1)
	AP int `json:"ap,omitempty"`
	// Concealability is the base concealability modifier
	Concealability int `json:"concealability,omitempty"`
	// Range is the weapon's range (e.g., "50m", "500m", "Reach")
	Range string `json:"range,omitempty"`
	// FireModes lists available fire modes (SS, SA, BF, FA)
	FireModes []FireMode `json:"fire_modes,omitempty"`
	// MagazineCapacity is the magazine capacity (e.g., "15(c)", "30(c)", "4(m)")
	MagazineCapacity string `json:"magazine_capacity,omitempty"`
	// ReloadTime describes reload time/action required
	ReloadTime string `json:"reload_time,omitempty"`
	// SpecialProperties describes special properties of the weapon
	SpecialProperties *WeaponSpecialProperty `json:"special_properties,omitempty"`
	// WirelessBonus describes wireless-enabled functionality
	WirelessBonus *WirelessBonus `json:"wireless_bonus,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// WeaponData represents the complete weapon data structure organized by category
type WeaponData struct {
	MeleeBlades      []Weapon `json:"melee_blades,omitempty"`
	MeleeClubs       []Weapon `json:"melee_clubs,omitempty"`
	MeleeOther       []Weapon `json:"melee_other,omitempty"`
	Throwing         []Weapon `json:"throwing,omitempty"`
	Tasers           []Weapon `json:"tasers,omitempty"`
	HoldOuts         []Weapon `json:"hold_outs,omitempty"`
	LightPistols     []Weapon `json:"light_pistols,omitempty"`
	HeavyPistols     []Weapon `json:"heavy_pistols,omitempty"`
	MachinePistols   []Weapon `json:"machine_pistols,omitempty"`
	SubmachineGuns   []Weapon `json:"submachine_guns,omitempty"`
	AssaultRifles    []Weapon `json:"assault_rifles,omitempty"`
	SniperRifles     []Weapon `json:"sniper_rifles,omitempty"`
	Shotguns         []Weapon `json:"shotguns,omitempty"`
	SpecialWeapons   []Weapon `json:"special_weapons,omitempty"`
	MachineGuns      []Weapon `json:"machine_guns,omitempty"`
	CannonsLaunchers []Weapon `json:"cannons_launchers,omitempty"`
}

// GetAllWeapons returns all weapons
func GetAllWeapons() []Weapon {
	weapons := make([]Weapon, 0, len(dataWeapons))
	for _, w := range dataWeapons {
		weapons = append(weapons, w)
	}
	return weapons
}

// GetWeaponData returns the complete weapon data structure organized by category
func GetWeaponData() WeaponData {
	data := WeaponData{
		MeleeBlades:      []Weapon{},
		MeleeClubs:       []Weapon{},
		MeleeOther:       []Weapon{},
		Throwing:         []Weapon{},
		Tasers:           []Weapon{},
		HoldOuts:         []Weapon{},
		LightPistols:     []Weapon{},
		HeavyPistols:     []Weapon{},
		MachinePistols:   []Weapon{},
		SubmachineGuns:   []Weapon{},
		AssaultRifles:    []Weapon{},
		SniperRifles:     []Weapon{},
		Shotguns:         []Weapon{},
		SpecialWeapons:   []Weapon{},
		MachineGuns:      []Weapon{},
		CannonsLaunchers: []Weapon{},
	}

	for _, weapon := range dataWeapons {
		switch weapon.Type {
		case WeaponTypeMeleeBlade:
			data.MeleeBlades = append(data.MeleeBlades, weapon)
		case WeaponTypeMeleeClub:
			data.MeleeClubs = append(data.MeleeClubs, weapon)
		case WeaponTypeMeleeOther:
			data.MeleeOther = append(data.MeleeOther, weapon)
		case WeaponTypeThrowing:
			data.Throwing = append(data.Throwing, weapon)
		case WeaponTypeTaser:
			data.Tasers = append(data.Tasers, weapon)
		case WeaponTypeHoldOut:
			data.HoldOuts = append(data.HoldOuts, weapon)
		case WeaponTypeLightPistol:
			data.LightPistols = append(data.LightPistols, weapon)
		case WeaponTypeHeavyPistol:
			data.HeavyPistols = append(data.HeavyPistols, weapon)
		case WeaponTypeMachinePistol:
			data.MachinePistols = append(data.MachinePistols, weapon)
		case WeaponTypeSubmachineGun:
			data.SubmachineGuns = append(data.SubmachineGuns, weapon)
		case WeaponTypeAssaultRifle:
			data.AssaultRifles = append(data.AssaultRifles, weapon)
		case WeaponTypeSniperRifle:
			data.SniperRifles = append(data.SniperRifles, weapon)
		case WeaponTypeShotgun:
			data.Shotguns = append(data.Shotguns, weapon)
		case WeaponTypeSpecialWeapon:
			data.SpecialWeapons = append(data.SpecialWeapons, weapon)
		case WeaponTypeMachineGun:
			data.MachineGuns = append(data.MachineGuns, weapon)
		case WeaponTypeCannonLauncher:
			data.CannonsLaunchers = append(data.CannonsLaunchers, weapon)
		}
	}

	return data
}

// GetWeaponByName returns the weapon definition with the given name, or nil if not found
func GetWeaponByName(name string) *Weapon {
	for _, weapon := range dataWeapons {
		if weapon.Name == name {
			return &weapon
		}
	}
	return nil
}

// GetWeaponByKey returns the weapon definition with the given key, or nil if not found
func GetWeaponByKey(key string) *Weapon {
	weapon, ok := dataWeapons[key]
	if !ok {
		return nil
	}
	return &weapon
}

// GetWeaponsByType returns all weapons of the specified type
func GetWeaponsByType(weaponType WeaponType) []Weapon {
	weapons := make([]Weapon, 0)
	for _, w := range dataWeapons {
		if w.Type == weaponType {
			weapons = append(weapons, w)
		}
	}
	return weapons
}

// Validate validates that the weapon definition is well-formed
func (w *Weapon) Validate() error {
	if w.Name == "" {
		return fmt.Errorf("weapon name is required")
	}
	if w.Type == "" {
		return fmt.Errorf("weapon type is required")
	}
	if w.Skill == "" {
		return fmt.Errorf("weapon skill is required")
	}
	// Validate exotic skill name is provided if using exotic skill
	if (w.Skill == WeaponSkillExoticMeleeWeapon || w.Skill == WeaponSkillExoticRangedWeapon) && w.ExoticSkillName == "" {
		return fmt.Errorf("exotic skill name is required when using exotic weapon skill")
	}
	return nil
}
