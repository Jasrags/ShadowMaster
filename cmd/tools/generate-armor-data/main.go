package main

import (
	"fmt"
	"os"
	"reflect"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/common"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadArmorFromXML("data/chummerxml/armor.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateArmorDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/armor_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalArmor := 0
	for _, armors := range data.Armors {
		totalArmor += len(armors.Armor)
	}
	totalMods := 0
	for _, mods := range data.Mods {
		totalMods += len(mods.Mod)
	}
	fmt.Printf("  Categories: %d, ModCategories: %d, Armor items: %d, Mods: %d\n",
		len(data.Categories[0].Category),
		len(data.ModCategories[0].Category),
		totalArmor,
		totalMods)
}

func generateArmorDataCode(data *v5.ArmorChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from armor.xml. DO NOT EDIT.\n\n")
	b.WriteString("var armorData = &ArmorChummer{\n")

	// Version
	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Categories
	if len(data.Categories) > 0 && len(data.Categories[0].Category) > 0 {
		b.WriteString("\tCategories: []ArmorCategories{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tCategory: []ArmorCategory{\n")
		for _, cat := range data.Categories[0].Category {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString("\t\t\t\t\tCategoryBase: common.CategoryBase{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tContent: %q,\n", cat.Content))
			b.WriteString("\t\t\t\t\t},\n")
			if cat.Blackmarket != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tBlackmarket: stringPtr(%q),\n", *cat.Blackmarket))
			}
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// ModCategories
	if len(data.ModCategories) > 0 && len(data.ModCategories[0].Category) > 0 {
		b.WriteString("\tModCategories: []ArmorModCategories{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tCategory: []ArmorModCategory{\n")
		for _, cat := range data.ModCategories[0].Category {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString("\t\t\t\t\tCategoryBase: common.CategoryBase{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tContent: %q,\n", cat.Content))
			b.WriteString("\t\t\t\t\t},\n")
			if cat.Blackmarket != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tBlackmarket: stringPtr(%q),\n", *cat.Blackmarket))
			}
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Armors
	if len(data.Armors) > 0 {
		b.WriteString("\tArmors: []ArmorItems{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tArmor: []ArmorItem{\n")
		for _, armor := range data.Armors[0].Armor {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", armor.ID))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", armor.Name))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tCategory: %q,\n", armor.Category))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tArmor: %q,\n", armor.Armor))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tArmorCapacity: %q,\n", armor.ArmorCapacity))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tAvail: %q,\n", armor.Avail))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tCost: %q,\n", armor.Cost))

			// Embedded Visibility
			if armor.Hide != nil || armor.IgnoreSourceDisabled != nil {
				b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
				if armor.Hide != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *armor.Hide))
				}
				if armor.IgnoreSourceDisabled != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *armor.IgnoreSourceDisabled))
				}
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional fields
			if len(armor.AddonCategory) > 0 {
				b.WriteString("\t\t\t\t\tAddonCategory: []string{\n")
				for _, cat := range armor.AddonCategory {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t%q,\n", cat))
				}
				b.WriteString("\t\t\t\t\t},\n")
			}
			if armor.Rating != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRating: stringPtr(%q),\n", *armor.Rating))
			}
			if armor.ArmorOverride != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tArmorOverride: stringPtr(%q),\n", *armor.ArmorOverride))
			}
			if armor.GearCapacity != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tGearCapacity: stringPtr(%q),\n", *armor.GearCapacity))
			}
			if armor.PhysicalLimit != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tPhysicalLimit: stringPtr(%q),\n", *armor.PhysicalLimit))
			}
			if armor.SocialLimit != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tSocialLimit: stringPtr(%q),\n", *armor.SocialLimit))
			}
			if armor.AddModCategory != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAddModCategory: stringPtr(%q),\n", *armor.AddModCategory))
			}
			if armor.ForceModCategory != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tForceModCategory: stringPtr(%q),\n", *armor.ForceModCategory))
			}

			// Optional slices
			if len(armor.AddWeapon) > 0 {
				b.WriteString("\t\t\t\t\tAddWeapon: []string{\n")
				for _, weapon := range armor.AddWeapon {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t%q,\n", weapon))
				}
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional nested structures
			if armor.SelectModsFromCategory != nil && len(armor.SelectModsFromCategory.Category) > 0 {
				b.WriteString("\t\t\t\t\tSelectModsFromCategory: &SelectModsFromCategory{\n")
				b.WriteString("\t\t\t\t\t\tCategory: []string{\n")
				for _, cat := range armor.SelectModsFromCategory.Category {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t%q,\n", cat))
				}
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional Bonus
			if armor.Bonus != nil && !isBaseBonusEmpty(armor.Bonus) {
				b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{\n")
				writeBaseBonusFields(&b, armor.Bonus, "\t\t\t\t\t\t")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional WirelessBonus
			if armor.WirelessBonus != nil && !isBaseBonusEmpty(armor.WirelessBonus) {
				b.WriteString("\t\t\t\t\tWirelessBonus: &common.BaseBonus{\n")
				writeBaseBonusFields(&b, armor.WirelessBonus, "\t\t\t\t\t\t")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional Mods (simplified)
			if armor.Mods != nil && len(armor.Mods.Name) > 0 {
				b.WriteString("\t\t\t\t\tMods: &ArmorItemMods{\n")
				b.WriteString("\t\t\t\t\t\tName: []ArmorModName{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t// %d items omitted\n", len(armor.Mods.Name)))
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional Gears (simplified)
			if armor.Gears != nil && len(armor.Gears.UseGear) > 0 {
				b.WriteString("\t\t\t\t\tGears: &ArmorGears{\n")
				b.WriteString("\t\t\t\t\t\tUseGear: []ArmorUseGear{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t// %d items omitted\n", len(armor.Gears.UseGear)))
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional Forbidden
			if armor.Forbidden != nil {
				b.WriteString("\t\t\t\t\tForbidden: &common.Forbidden{},\n")
			}

			// Optional Required
			if armor.Required != nil {
				b.WriteString("\t\t\t\t\tRequired: &common.Required{},\n")
			}

			// SourceReference
			b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", armor.Source))
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", armor.Page))
			b.WriteString("\t\t\t\t\t},\n")

			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Mods
	if len(data.Mods) > 0 {
		b.WriteString("\tMods: []ArmorModItems{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tMod: []ArmorModItem{\n")
		for _, mod := range data.Mods[0].Mod {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", mod.ID))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", mod.Name))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tCategory: %q,\n", mod.Category))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tMaxRating: %q,\n", mod.MaxRating))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tArmorCapacity: %q,\n", mod.ArmorCapacity))
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

			// Optional fields
			if mod.Armor != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tArmor: stringPtr(%q),\n", *mod.Armor))
			}

			// Optional slices
			if len(mod.AddWeapon) > 0 {
				b.WriteString("\t\t\t\t\tAddWeapon: []string{\n")
				for _, weapon := range mod.AddWeapon {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t%q,\n", weapon))
				}
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional Bonus
			if mod.Bonus != nil && !isBaseBonusEmpty(mod.Bonus) {
				b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{\n")
				writeBaseBonusFields(&b, mod.Bonus, "\t\t\t\t\t\t")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional Gears (simplified)
			if mod.Gears != nil && len(mod.Gears.UseGear) > 0 {
				b.WriteString("\t\t\t\t\tGears: &ArmorModGears{\n")
				b.WriteString("\t\t\t\t\t\tUseGear: []ArmorModUseGear{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t// %d items omitted\n", len(mod.Gears.UseGear)))
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// SourceReference
			b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", mod.Source))
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", mod.Page))
			b.WriteString("\t\t\t\t\t},\n")

			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	b.WriteString("}\n\n")

	b.WriteString("// GetArmorData returns the loaded armor data.\n")
	b.WriteString("func GetArmorData() *ArmorChummer {\n")
	b.WriteString("\treturn armorData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllArmor returns all armor items.\n")
	b.WriteString("func GetAllArmor() []ArmorItem {\n")
	b.WriteString("\tif len(armorData.Armors) == 0 {\n")
	b.WriteString("\t\treturn []ArmorItem{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn armorData.Armors[0].Armor\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetArmorByID returns the armor item with the given ID, or nil if not found.\n")
	b.WriteString("func GetArmorByID(id string) *ArmorItem {\n")
	b.WriteString("\titems := GetAllArmor()\n")
	b.WriteString("\tfor i := range items {\n")
	b.WriteString("\t\tif items[i].ID == id {\n")
	b.WriteString("\t\t\treturn &items[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllArmorMods returns all armor mods.\n")
	b.WriteString("func GetAllArmorMods() []ArmorModItem {\n")
	b.WriteString("\tif len(armorData.Mods) == 0 {\n")
	b.WriteString("\t\treturn []ArmorModItem{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn armorData.Mods[0].Mod\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetArmorModByID returns the armor mod with the given ID, or nil if not found.\n")
	b.WriteString("func GetArmorModByID(id string) *ArmorModItem {\n")
	b.WriteString("\tmods := GetAllArmorMods()\n")
	b.WriteString("\tfor i := range mods {\n")
	b.WriteString("\t\tif mods[i].ID == id {\n")
	b.WriteString("\t\t\treturn &mods[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n")

	return b.String()
}

func isBaseBonusEmpty(b *common.BaseBonus) bool {
	v := reflect.ValueOf(b).Elem()
	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		if !field.IsZero() {
			return false
		}
	}
	return true
}

func writeBaseBonusFields(b *strings.Builder, bonus *common.BaseBonus, indent string) {
	v := reflect.ValueOf(bonus).Elem()
	t := reflect.TypeOf(bonus).Elem()
	
	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		fieldType := t.Field(i)
		
		if field.IsZero() {
			continue
		}
		
		fieldName := fieldType.Name
		
		switch field.Kind() {
		case reflect.Ptr:
			if !field.IsNil() {
				elemType := fieldType.Type.Elem()
				if elemType.Name() == "Livingpersona" {
					b.WriteString(fmt.Sprintf("%s%s: &common.Livingpersona{\n", indent, fieldName))
					writeLivingpersonaFields(b, field.Elem().Interface().(common.Livingpersona), indent+"\t")
					b.WriteString(fmt.Sprintf("%s},\n", indent))
				} else {
					b.WriteString(fmt.Sprintf("%s%s: &common.%s{},\n", indent, fieldName, elemType.Name()))
				}
			}
		case reflect.Slice:
			if field.Len() > 0 {
				elemType := fieldType.Type.Elem()
				var typeName string
				switch elemType.Kind() {
				case reflect.Bool:
					typeName = "bool"
				case reflect.String:
					typeName = "string"
				case reflect.Int:
					typeName = "int"
				default:
					if elemType.PkgPath() != "" {
						pkgName := "common"
						if elemType.PkgPath() != "shadowmaster/pkg/shadowrun/edition/v5/common" {
							parts := strings.Split(elemType.PkgPath(), "/")
							pkgName = parts[len(parts)-1]
						}
						typeName = pkgName + "." + elemType.Name()
					} else {
						typeName = elemType.Name()
					}
				}
				b.WriteString(fmt.Sprintf("%s%s: []%s{\n", indent, fieldName, typeName))
				b.WriteString(fmt.Sprintf("%s\t// %d items omitted\n", indent, field.Len()))
				b.WriteString(fmt.Sprintf("%s},\n", indent))
			}
		}
	}
}

func writeLivingpersonaFields(b *strings.Builder, lp common.Livingpersona, indent string) {
	if lp.Attack != nil {
		b.WriteString(fmt.Sprintf("%sAttack: stringPtr(%q),\n", indent, *lp.Attack))
	}
	if lp.Dataprocessing != nil {
		b.WriteString(fmt.Sprintf("%sDataprocessing: stringPtr(%q),\n", indent, *lp.Dataprocessing))
	}
	if lp.Devicerating != nil {
		b.WriteString(fmt.Sprintf("%sDevicerating: stringPtr(%q),\n", indent, *lp.Devicerating))
	}
	if lp.Firewall != nil {
		b.WriteString(fmt.Sprintf("%sFirewall: stringPtr(%q),\n", indent, *lp.Firewall))
	}
	if lp.Sleaze != nil {
		b.WriteString(fmt.Sprintf("%sSleaze: stringPtr(%q),\n", indent, *lp.Sleaze))
	}
}

