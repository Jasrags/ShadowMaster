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
	data, err := loader.LoadPowersFromXML("data/chummerxml/powers.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generatePowersDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/powers_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	fmt.Printf("  Total powers: %d\n", len(data.Powers.Power))
}

func generatePowersDataCode(data *v5.PowersChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from powers.xml. DO NOT EDIT.\n\n")
	b.WriteString("var powersData = &PowersChummer{\n")

	// Powers
	b.WriteString("\tPowers: PowerItems{\n")
	b.WriteString("\t\tPower: []PowerItem{\n")

	for _, power := range data.Powers.Power {
		b.WriteString("\t\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", power.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", power.Name))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tPoints: %.2f,\n", power.Points))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tLevels: %q,\n", power.Levels))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tLimit: %d,\n", power.Limit))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tSource: %q,\n", power.Source))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tPage: %d,\n", power.Page))

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

		// Optional IncludeInLimit
		if power.IncludeInLimit != nil && len(power.IncludeInLimit.Name) > 0 {
			b.WriteString("\t\t\t\t\tIncludeInLimit: &PowerIncludeInLimit{\n")
			b.WriteString("\t\t\t\t\t\tName: []string{\n")
			for _, name := range power.IncludeInLimit.Name {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t%q,\n", name))
			}
			b.WriteString("\t\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t\t},\n")
		}

		if power.Action != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tAction: stringPtr(%q),\n", *power.Action))
		}
		if power.AdeptWay != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tAdeptWay: float64Ptr(%.2f),\n", *power.AdeptWay))
		}

		// Optional AdeptWayRequires
		if power.AdeptWayRequires != nil {
			b.WriteString("\t\t\t\t\tAdeptWayRequires: &AdeptWayRequires{\n")
			if power.AdeptWayRequires.MagiciansWayForbids != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tMagiciansWayForbids: stringPtr(%q),\n", *power.AdeptWayRequires.MagiciansWayForbids))
			}
			if power.AdeptWayRequires.Required != nil {
				b.WriteString("\t\t\t\t\t\tRequired: &common.Required{},\n")
			}
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Optional Bonus
		if power.Bonus != nil && !isBaseBonusEmpty(power.Bonus) {
			b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{\n")
			writeBaseBonusFields(&b, power.Bonus, "\t\t\t\t\t\t")
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Optional Required
		if power.Required != nil {
			b.WriteString("\t\t\t\t\tRequired: &common.Required{},\n")
		}

		// Optional Forbidden
		if power.Forbidden != nil {
			b.WriteString("\t\t\t\t\tForbidden: &common.Forbidden{},\n")
		}

		b.WriteString("\t\t\t\t},\n")
	}

	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")
	b.WriteString("}\n\n")

	b.WriteString("// Helper function for float64 pointers\n")
	b.WriteString("func float64Ptr(f float64) *float64 { return &f }\n\n")

	b.WriteString("// GetPowersData returns the loaded powers data.\n")
	b.WriteString("func GetPowersData() *PowersChummer {\n")
	b.WriteString("\treturn powersData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllPowers returns all powers.\n")
	b.WriteString("func GetAllPowers() []PowerItem {\n")
	b.WriteString("\treturn powersData.Powers.Power\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetPowerByID returns the power with the given ID, or nil if not found.\n")
	b.WriteString("func GetPowerByID(id string) *PowerItem {\n")
	b.WriteString("\tpowers := GetAllPowers()\n")
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

