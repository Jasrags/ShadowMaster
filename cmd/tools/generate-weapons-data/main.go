package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadWeaponsFromXML("data/chummerxml/weapons.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateWeaponsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/weapons_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalWeapons := 0
	if len(data.Weapons) > 0 {
		totalWeapons = len(data.Weapons[0].Weapon)
	}
	totalAccessories := 0
	if len(data.Accessories) > 0 {
		totalAccessories = len(data.Accessories[0].Accessory)
	}
	totalMods := 0
	if len(data.Mods) > 0 {
		totalMods = len(data.Mods[0].Mod)
	}
	categoryCount := 0
	if len(data.Categories) > 0 {
		categoryCount = len(data.Categories[0].Category)
	}
	fmt.Printf("  Categories: %d, Weapons: %d, Accessories: %d, Mods: %d\n",
		categoryCount,
		totalWeapons,
		totalAccessories,
		totalMods)
}

func generateWeaponsDataCode(data *v5.WeaponsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from weapons.xml. DO NOT EDIT.\n\n")
	b.WriteString("var weaponsData = &WeaponsChummer{\n")

	// Version
	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Categories
	if len(data.Categories) > 0 && len(data.Categories[0].Category) > 0 {
		b.WriteString("\tCategories: []WeaponCategories{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tCategory: []WeaponCategory{\n")
		for _, cat := range data.Categories[0].Category {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tContent: %q,\n", cat.Content))
			if cat.Blackmarket != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tBlackmarket: stringPtr(%q),\n", *cat.Blackmarket))
			}
			if cat.Gunneryspec != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tGunneryspec: stringPtr(%q),\n", *cat.Gunneryspec))
			}
			if cat.Type != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tType: stringPtr(%q),\n", *cat.Type))
			}
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Weapons - simplified due to large size and complex nested structures
	if len(data.Weapons) > 0 && len(data.Weapons[0].Weapon) > 0 {
		b.WriteString("\tWeapons: []Weapons{\n")
		b.WriteString("\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\tWeapon: []Weapon{\n"))
		b.WriteString(fmt.Sprintf("\t\t\t\t// %d weapons omitted (complex nested structure)\n", len(data.Weapons[0].Weapon)))
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Accessories
	if len(data.Accessories) > 0 && len(data.Accessories[0].Accessory) > 0 {
		b.WriteString("\tAccessories: []WeaponAccessoryItems{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tAccessory: []WeaponAccessoryItem{\n")
		for _, acc := range data.Accessories[0].Accessory {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", acc.ID))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", acc.Name))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tMount: %q,\n", acc.Mount))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tAvail: %q,\n", acc.Avail))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tCost: %q,\n", acc.Cost))

			// Embedded Visibility
			if acc.Hide != nil || acc.IgnoreSourceDisabled != nil {
				b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
				if acc.Hide != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *acc.Hide))
				}
				if acc.IgnoreSourceDisabled != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *acc.IgnoreSourceDisabled))
				}
				b.WriteString("\t\t\t\t\t},\n")
			}

			// SourceReference
			b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", acc.Source))
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", acc.Page))
			b.WriteString("\t\t\t\t\t},\n")

			// Optional fields
			if acc.ExtraMount != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tExtraMount: stringPtr(%q),\n", *acc.ExtraMount))
			}
			if acc.AddMount != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAddMount: stringPtr(%q),\n", *acc.AddMount))
			}
			if acc.AccessoryCostMultiplier != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAccessoryCostMultiplier: stringPtr(%q),\n", *acc.AccessoryCostMultiplier))
			}
			if acc.Accuracy != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAccuracy: stringPtr(%q),\n", *acc.Accuracy))
			}
			if acc.AmmoBonus != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAmmoBonus: stringPtr(%q),\n", *acc.AmmoBonus))
			}
			if acc.AmmoReplace != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAmmoReplace: stringPtr(%q),\n", *acc.AmmoReplace))
			}
			if acc.AmmoSlots != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAmmoSlots: stringPtr(%q),\n", *acc.AmmoSlots))
			}
			if acc.Conceal != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tConceal: stringPtr(%q),\n", *acc.Conceal))
			}
			if acc.Damage != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tDamage: stringPtr(%q),\n", *acc.Damage))
			}
			if acc.DamageType != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tDamageType: stringPtr(%q),\n", *acc.DamageType))
			}
			if acc.DicePool != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tDicePool: intPtr(%d),\n", *acc.DicePool))
			}
			if acc.ModifyAmmoCapacity != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tModifyAmmoCapacity: stringPtr(%q),\n", *acc.ModifyAmmoCapacity))
			}
			if acc.Rating != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRating: stringPtr(%q),\n", *acc.Rating))
			}
			if acc.RC != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRC: stringPtr(%q),\n", *acc.RC))
			}
			if acc.RCDeployable != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRCDeployable: stringPtr(%q),\n", *acc.RCDeployable))
			}
			if acc.RCGroup != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRCGroup: intPtr(%d),\n", *acc.RCGroup))
			}
			if acc.ReplaceRange != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tReplaceRange: stringPtr(%q),\n", *acc.ReplaceRange))
			}

			// Optional nested structures
			if acc.AddUnderbarrels != nil && len(acc.AddUnderbarrels.Weapon) > 0 {
				b.WriteString("\t\t\t\t\tAddUnderbarrels: &AddUnderbarrels{\n")
				b.WriteString("\t\t\t\t\t\tWeapon: []string{\n")
				for _, weapon := range acc.AddUnderbarrels.Weapon {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t%q,\n", weapon))
				}
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			if acc.AllowGear != nil && len(acc.AllowGear.GearCategory) > 0 {
				b.WriteString("\t\t\t\t\tAllowGear: &AllowGear{\n")
				b.WriteString("\t\t\t\t\t\tGearCategory: []string{\n")
				for _, cat := range acc.AllowGear.GearCategory {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t%q,\n", cat))
				}
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional Forbidden
			if acc.Forbidden != nil {
				b.WriteString("\t\t\t\t\tForbidden: &common.Forbidden{},\n")
			}

			// Optional Required
			if acc.Required != nil {
				b.WriteString("\t\t\t\t\tRequired: &common.Required{},\n")
			}

			// Optional Gears (simplified)
			if acc.Gears != nil && len(acc.Gears.UseGear) > 0 {
				b.WriteString("\t\t\t\t\tGears: &WeaponGears{\n")
				b.WriteString("\t\t\t\t\t\tUseGear: []WeaponUseGear{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t// %d items omitted\n", len(acc.Gears.UseGear)))
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional WirelessWeaponBonus
			if acc.WirelessWeaponBonus != nil {
				b.WriteString("\t\t\t\t\tWirelessWeaponBonus: &WirelessWeaponBonus{\n")
				if acc.WirelessWeaponBonus.Accuracy != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tAccuracy: stringPtr(%q),\n", *acc.WirelessWeaponBonus.Accuracy))
				}
				if acc.WirelessWeaponBonus.AccuracyReplace != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tAccuracyReplace: stringPtr(%q),\n", *acc.WirelessWeaponBonus.AccuracyReplace))
				}
				if acc.WirelessWeaponBonus.AP != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tAP: stringPtr(%q),\n", *acc.WirelessWeaponBonus.AP))
				}
				if acc.WirelessWeaponBonus.APReplace != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tAPReplace: stringPtr(%q),\n", *acc.WirelessWeaponBonus.APReplace))
				}
				if acc.WirelessWeaponBonus.Damage != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tDamage: stringPtr(%q),\n", *acc.WirelessWeaponBonus.Damage))
				}
				if acc.WirelessWeaponBonus.DamageReplace != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tDamageReplace: stringPtr(%q),\n", *acc.WirelessWeaponBonus.DamageReplace))
				}
				if acc.WirelessWeaponBonus.DamageType != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tDamageType: stringPtr(%q),\n", *acc.WirelessWeaponBonus.DamageType))
				}
				if acc.WirelessWeaponBonus.Mode != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tMode: stringPtr(%q),\n", *acc.WirelessWeaponBonus.Mode))
				}
				if acc.WirelessWeaponBonus.ModeReplace != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tModeReplace: stringPtr(%q),\n", *acc.WirelessWeaponBonus.ModeReplace))
				}
				if acc.WirelessWeaponBonus.Pool != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPool: stringPtr(%q),\n", *acc.WirelessWeaponBonus.Pool))
				}
				if acc.WirelessWeaponBonus.RangeBonus != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tRangeBonus: intPtr(%d),\n", *acc.WirelessWeaponBonus.RangeBonus))
				}
				if acc.WirelessWeaponBonus.RC != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tRC: stringPtr(%q),\n", *acc.WirelessWeaponBonus.RC))
				}
				if acc.WirelessWeaponBonus.SmartlinkPool != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSmartlinkPool: stringPtr(%q),\n", *acc.WirelessWeaponBonus.SmartlinkPool))
				}
				if acc.WirelessWeaponBonus.UseRange != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tUseRange: stringPtr(%q),\n", *acc.WirelessWeaponBonus.UseRange))
				}
				b.WriteString("\t\t\t\t\t},\n")
			}

			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Mods
	if len(data.Mods) > 0 && len(data.Mods[0].Mod) > 0 {
		b.WriteString("\tMods: []ModsContainer{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tMod: []WeaponModItem{\n")
		for _, mod := range data.Mods[0].Mod {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", mod.Name))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tCategory: %q,\n", mod.Category))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tRating: %q,\n", mod.Rating))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tSlots: %q,\n", mod.Slots))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tAvail: %q,\n", mod.Avail))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tCost: %q,\n", mod.Cost))

			// Embedded Visibility
			if mod.Hide != nil || mod.IgnoreSourceDisabled != nil {
				b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
				if mod.Hide != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *mod.Hide))
				}
				if mod.IgnoreSourceDisabled != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *mod.IgnoreSourceDisabled))
				}
				b.WriteString("\t\t\t\t\t},\n")
			}

			// SourceReference
			b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", mod.Source))
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", mod.Page))
			b.WriteString("\t\t\t\t\t},\n")

			// Optional fields
			if mod.AccessoryCostMultiplier != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAccessoryCostMultiplier: stringPtr(%q),\n", *mod.AccessoryCostMultiplier))
			}
			if mod.AddMode != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAddMode: stringPtr(%q),\n", *mod.AddMode))
			}
			if mod.AmmoBonus != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAmmoBonus: stringPtr(%q),\n", *mod.AmmoBonus))
			}
			if mod.AmmoReplace != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAmmoReplace: stringPtr(%q),\n", *mod.AmmoReplace))
			}
			if mod.APBonus != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAPBonus: intPtr(%d),\n", *mod.APBonus))
			}
			if mod.Conceal != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tConceal: intPtr(%d),\n", *mod.Conceal))
			}
			if mod.DicePool != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tDicePool: stringPtr(%q),\n", *mod.DicePool))
			}
			if mod.DVBonus != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tDVBonus: intPtr(%d),\n", *mod.DVBonus))
			}
			if mod.FullBurst != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tFullBurst: intPtr(%d),\n", *mod.FullBurst))
			}
			if mod.ModCostMultiplier != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tModCostMultiplier: stringPtr(%q),\n", *mod.ModCostMultiplier))
			}
			if mod.RangeBonus != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRangeBonus: intPtr(%d),\n", *mod.RangeBonus))
			}
			if mod.RC != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRC: stringPtr(%q),\n", *mod.RC))
			}
			if mod.RCGroup != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRCGroup: intPtr(%d),\n", *mod.RCGroup))
			}
			if mod.Suppressive != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tSuppressive: intPtr(%d),\n", *mod.Suppressive))
			}

			// Optional Gears (simplified)
			if mod.Gears != nil && len(mod.Gears.UseGear) > 0 {
				b.WriteString("\t\t\t\t\tGears: &WeaponGears{\n")
				b.WriteString("\t\t\t\t\t\tUseGear: []WeaponUseGear{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t// %d items omitted\n", len(mod.Gears.UseGear)))
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	b.WriteString("}\n\n")

	b.WriteString("// GetWeaponsData returns the loaded weapons data.\n")
	b.WriteString("func GetWeaponsData() *WeaponsChummer {\n")
	b.WriteString("\treturn weaponsData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllWeaponAccessories returns all weapon accessories.\n")
	b.WriteString("func GetAllWeaponAccessories() []WeaponAccessoryItem {\n")
	b.WriteString("\tif len(weaponsData.Accessories) == 0 {\n")
	b.WriteString("\t\treturn []WeaponAccessoryItem{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn weaponsData.Accessories[0].Accessory\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetWeaponAccessoryByID returns the weapon accessory with the given ID, or nil if not found.\n")
	b.WriteString("func GetWeaponAccessoryByID(id string) *WeaponAccessoryItem {\n")
	b.WriteString("\taccessories := GetAllWeaponAccessories()\n")
	b.WriteString("\tfor i := range accessories {\n")
	b.WriteString("\t\tif accessories[i].ID == id {\n")
	b.WriteString("\t\t\treturn &accessories[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllWeaponMods returns all weapon mods.\n")
	b.WriteString("func GetAllWeaponMods() []WeaponModItem {\n")
	b.WriteString("\tif len(weaponsData.Mods) == 0 {\n")
	b.WriteString("\t\treturn []WeaponModItem{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn weaponsData.Mods[0].Mod\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetWeaponModByName returns the weapon mod with the given name, or nil if not found.\n")
	b.WriteString("func GetWeaponModByName(name string) *WeaponModItem {\n")
	b.WriteString("\tmods := GetAllWeaponMods()\n")
	b.WriteString("\tfor i := range mods {\n")
	b.WriteString("\t\tif mods[i].Name == name {\n")
	b.WriteString("\t\t\treturn &mods[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n")

	return b.String()
}

