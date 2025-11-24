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
	data, err := loader.LoadCritterPowersFromXML("data/chummerxml/critterpowers.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateCritterPowersDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/critterpowers_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalPowers := 0
	for _, powers := range data.Powers {
		totalPowers += len(powers.Power)
	}
	fmt.Printf("  Total critter powers: %d\n", totalPowers)
}

func generateCritterPowersDataCode(data *v5.CritterPowersChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from critterpowers.xml. DO NOT EDIT.\n\n")
	b.WriteString("var critterPowersData = &CritterPowersChummer{\n")

	// Version
	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Categories
	if len(data.Categories) > 0 {
		b.WriteString("\tCategories: []CritterPowerCategories{\n")
		for _, cats := range data.Categories {
			b.WriteString("\t\t{\n")
			b.WriteString("\t\t\tCategory: []CritterPowerCategory{\n")
			for _, cat := range cats.Category {
				b.WriteString("\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\tContent: %q,\n", cat.Content))
				b.WriteString("\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t},\n")
			b.WriteString("\t\t},\n")
		}
		b.WriteString("\t},\n")
	}

	// Powers
	if len(data.Powers) > 0 {
		b.WriteString("\tPowers: []CritterPowerItems{\n")
		for _, powers := range data.Powers {
			b.WriteString("\t\t{\n")
			b.WriteString("\t\t\tPower: []CritterPowerItem{\n")
			for _, power := range powers.Power {
				b.WriteString("\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", power.ID))
				b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", power.Name))
				b.WriteString(fmt.Sprintf("\t\t\t\t\tCategory: %q,\n", power.Category))
				b.WriteString(fmt.Sprintf("\t\t\t\t\tType: %q,\n", power.Type))
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAction: %q,\n", power.Action))
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRange: %q,\n", power.Range))
				b.WriteString(fmt.Sprintf("\t\t\t\t\tDuration: %q,\n", power.Duration))
				// SourceReference (embedded)
				b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", power.Source))
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", power.Page))
				b.WriteString("\t\t\t\t\t},\n")

				// Embedded Visibility
				if power.Hide != nil || power.IgnoreSourceDisabled != nil {
					b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
					if power.Hide != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *power.Hide))
					}
					if power.IgnoreSourceDisabled != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *power.IgnoreSourceDisabled))
					}
					b.WriteString("\t\t\t\t\t},\n")
				}

				if power.Toxic != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\tToxic: stringPtr(%q),\n", *power.Toxic))
				}
				if power.Rating != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\tRating: stringPtr(%q),\n", *power.Rating))
				}

				// Optional Bonus
				if power.Bonus != nil && !isBaseBonusEmpty(power.Bonus) {
					b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{\n")
					writeBaseBonusFields(&b, power.Bonus, "\t\t\t\t\t\t")
					b.WriteString("\t\t\t\t\t},\n")
				}

				// Optional Forbidden
				if power.Forbidden != nil {
					b.WriteString("\t\t\t\t\tForbidden: &common.Forbidden{},\n")
				}

				// Optional Required
				if power.Required != nil {
					b.WriteString("\t\t\t\t\tRequired: &common.Required{},\n")
				}

				if power.Karma != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\tKarma: stringPtr(%q),\n", *power.Karma))
				}

				b.WriteString("\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t},\n")
			b.WriteString("\t\t},\n")
		}
		b.WriteString("\t},\n")
	}

	b.WriteString("}\n\n")


	b.WriteString("// GetCritterPowersData returns the loaded critter powers data.\n")
	b.WriteString("func GetCritterPowersData() *CritterPowersChummer {\n")
	b.WriteString("\treturn critterPowersData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllCritterPowers returns all critter powers.\n")
	b.WriteString("func GetAllCritterPowers() []CritterPowerItem {\n")
	b.WriteString("\tif len(critterPowersData.Powers) == 0 {\n")
	b.WriteString("\t\treturn []CritterPowerItem{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn critterPowersData.Powers[0].Power\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetCritterPowerByID returns the critter power with the given ID, or nil if not found.\n")
	b.WriteString("func GetCritterPowerByID(id string) *CritterPowerItem {\n")
	b.WriteString("\tpowers := GetAllCritterPowers()\n")
	b.WriteString("\tfor i := range powers {\n")
	b.WriteString("\t\tif powers[i].ID == id {\n")
	b.WriteString("\t\t\treturn &powers[i]\n")
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

