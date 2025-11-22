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
	data, err := loader.LoadCyberwareFromXML("data/chummerxml/cyberware.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateCyberwareDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/cyberware_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalCyberware := 0
	if data.Cyberwares != nil {
		totalCyberware = len(data.Cyberwares.Cyberware)
	}
	totalSuites := 0
	if data.Suites != nil {
		totalSuites = len(data.Suites.Suite)
	}
	fmt.Printf("  Grades: %d, Categories: %d, Cyberware items: %d, Suites: %d\n",
		len(data.Grades[0].Grade),
		len(data.Categories[0].Category),
		totalCyberware,
		totalSuites)
}

func generateCyberwareDataCode(data *v5.CyberwareChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from cyberware.xml. DO NOT EDIT.\n\n")
	b.WriteString("var cyberwareData = &CyberwareChummer{\n")

	// Version
	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Grades
	if len(data.Grades) > 0 && len(data.Grades[0].Grade) > 0 {
		b.WriteString("\tGrades: []CyberwareGrades{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tGrade: []CyberwareGrade{\n")
		for _, grade := range data.Grades[0].Grade {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", grade.ID))

			if grade.Name != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tName: stringPtr(%q),\n", *grade.Name))
			}
			if grade.Ess != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tEss: stringPtr(%q),\n", *grade.Ess))
			}
			if grade.Cost != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tCost: stringPtr(%q),\n", *grade.Cost))
			}
			if grade.DeviceRating != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tDeviceRating: intPtr(%d),\n", *grade.DeviceRating))
			}
			if grade.Avail != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAvail: stringPtr(%q),\n", *grade.Avail))
			}

			// Optional Bonus
			if grade.Bonus != nil && !isBaseBonusEmpty(grade.Bonus) {
				b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{\n")
				writeBaseBonusFields(&b, grade.Bonus, "\t\t\t\t\t\t")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// SourceReference
			b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", grade.Source))
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", grade.Page))
			b.WriteString("\t\t\t\t\t},\n")

			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Categories
	if len(data.Categories) > 0 && len(data.Categories[0].Category) > 0 {
		b.WriteString("\tCategories: []CyberwareCategories{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tCategory: []CyberwareCategory{\n")
		for _, cat := range data.Categories[0].Category {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tContent: %q,\n", cat.Content))
			if cat.Show != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tShow: stringPtr(%q),\n", *cat.Show))
			}
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Cyberwares
	if data.Cyberwares != nil && len(data.Cyberwares.Cyberware) > 0 {
		b.WriteString("\tCyberwares: &Cyberwares{\n")
		b.WriteString("\t\tCyberware: []Cyberware{\n")
		for _, item := range data.Cyberwares.Cyberware {
			b.WriteString("\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\tID: %q,\n", item.ID))
			b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", item.Name))
			b.WriteString(fmt.Sprintf("\t\t\t\tCategory: %q,\n", item.Category))
			b.WriteString(fmt.Sprintf("\t\t\t\tEss: %q,\n", item.Ess))
			b.WriteString(fmt.Sprintf("\t\t\t\tCapacity: %q,\n", item.Capacity))
			b.WriteString(fmt.Sprintf("\t\t\t\tAvail: %q,\n", item.Avail))
			b.WriteString(fmt.Sprintf("\t\t\t\tCost: %q,\n", item.Cost))
			b.WriteString(fmt.Sprintf("\t\t\t\tRequireParent: %q,\n", item.RequireParent))

			// Embedded Visibility
			if item.Hide != nil || item.IgnoreSourceDisabled != nil {
				b.WriteString("\t\t\t\tVisibility: common.Visibility{\n")
				if item.Hide != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\tHide: stringPtr(%q),\n", *item.Hide))
				}
				if item.IgnoreSourceDisabled != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *item.IgnoreSourceDisabled))
				}
				b.WriteString("\t\t\t\t},\n")
			}

			// Optional fields
			if item.Limit != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tLimit: stringPtr(%q),\n", *item.Limit))
			}
			if item.AddToParentCapacity != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tAddToParentCapacity: stringPtr(%q),\n", *item.AddToParentCapacity))
			}
			if item.MountsTo != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tMountsTo: stringPtr(%q),\n", *item.MountsTo))
			}
			if item.ModularMount != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tModularMount: stringPtr(%q),\n", *item.ModularMount))
			}
			if item.BlocksMounts != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tBlocksMounts: stringPtr(%q),\n", *item.BlocksMounts))
			}
			if item.AddToParentEss != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tAddToParentEss: stringPtr(%q),\n", *item.AddToParentEss))
			}
			if item.InheritAttributes != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tInheritAttributes: stringPtr(%q),\n", *item.InheritAttributes))
			}
			if item.LimbSlot != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tLimbSlot: stringPtr(%q),\n", *item.LimbSlot))
			}
			if item.LimbSlotCount != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tLimbSlotCount: stringPtr(%q),\n", *item.LimbSlotCount))
			}
			if item.MinAgility != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tMinAgility: intPtr(%d),\n", *item.MinAgility))
			}
			if item.MinStrength != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tMinStrength: intPtr(%d),\n", *item.MinStrength))
			}
			if item.MinRating != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tMinRating: stringPtr(%q),\n", *item.MinRating))
			}
			if item.Notes != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tNotes: stringPtr(%q),\n", *item.Notes))
			}
			if item.Rating != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tRating: stringPtr(%q),\n", *item.Rating))
			}
			if item.ForceGrade != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tForceGrade: stringPtr(%q),\n", *item.ForceGrade))
			}

			// Optional slices
			if len(item.AddVehicle) > 0 {
				b.WriteString("\t\t\t\tAddVehicle: []string{\n")
				for _, vehicle := range item.AddVehicle {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t%q,\n", vehicle))
				}
				b.WriteString("\t\t\t\t},\n")
			}
			if len(item.AddWeapon) > 0 {
				b.WriteString("\t\t\t\tAddWeapon: []string{\n")
				for _, weapon := range item.AddWeapon {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t%q,\n", weapon))
				}
				b.WriteString("\t\t\t\t},\n")
			}

			// Optional nested structures
			if item.AllowGear != nil && len(item.AllowGear.GearCategory) > 0 {
				b.WriteString("\t\t\t\tAllowGear: &CyberwareAllowGear{\n")
				b.WriteString("\t\t\t\t\tGearCategory: []string{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t// %d items omitted\n", len(item.AllowGear.GearCategory)))
				b.WriteString("\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t},\n")
			}

			if item.AllowSubsystems != nil && len(item.AllowSubsystems.Category) > 0 {
				b.WriteString("\t\t\t\tAllowSubsystems: &AllowSubsystems{\n")
				b.WriteString("\t\t\t\t\tCategory: []string{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t// %d items omitted\n", len(item.AllowSubsystems.Category)))
				b.WriteString("\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t},\n")
			}

			if item.IncludePair != nil && len(item.IncludePair.Name) > 0 {
				b.WriteString("\t\t\t\tIncludePair: &IncludePair{\n")
				b.WriteString("\t\t\t\t\tName: []string{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t// %d items omitted\n", len(item.IncludePair.Name)))
				b.WriteString("\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t},\n")
			}

			if item.BannedGrades != nil && len(item.BannedGrades.Grade) > 0 {
				b.WriteString("\t\t\t\tBannedGrades: &BannedGrades{\n")
				b.WriteString("\t\t\t\t\tGrade: []string{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t// %d items omitted\n", len(item.BannedGrades.Grade)))
				b.WriteString("\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t},\n")
			}

			// Optional Bonus
			if item.Bonus != nil && !isBaseBonusEmpty(item.Bonus) {
				b.WriteString("\t\t\t\tBonus: &common.BaseBonus{\n")
				writeBaseBonusFields(&b, item.Bonus, "\t\t\t\t\t\t")
				b.WriteString("\t\t\t\t},\n")
			}

			// Optional Forbidden
			if item.Forbidden != nil {
				b.WriteString("\t\t\t\tForbidden: &common.Forbidden{},\n")
			}

			// Optional Required
			if item.Required != nil {
				b.WriteString("\t\t\t\tRequired: &common.Required{},\n")
			}

			// Subsystems - omit complex nested structure
			if item.Subsystems != nil {
				b.WriteString("\t\t\t\tSubsystems: &CyberwareSubsystems{},\n")
				b.WriteString("\t\t\t\t// Complex nested structure omitted\n")
			}

			// SourceReference
			b.WriteString("\t\t\t\tSourceReference: common.SourceReference{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tSource: %q,\n", item.Source))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tPage: %q,\n", item.Page))
			b.WriteString("\t\t\t\t},\n")

			b.WriteString("\t\t\t},\n")
		}
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Suites - simplified, omit complex nested structure
	if data.Suites != nil && len(data.Suites.Suite) > 0 {
		b.WriteString("\tSuites: &Suites{\n")
		b.WriteString("\t\tSuite: []Suite{\n")
		b.WriteString(fmt.Sprintf("\t\t\t// %d suites omitted (complex nested structure)\n", len(data.Suites.Suite)))
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	b.WriteString("}\n\n")

	b.WriteString("// GetCyberwareData returns the loaded cyberware data.\n")
	b.WriteString("func GetCyberwareData() *CyberwareChummer {\n")
	b.WriteString("\treturn cyberwareData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllCyberware returns all cyberware items.\n")
	b.WriteString("func GetAllCyberware() []Cyberware {\n")
	b.WriteString("\tif cyberwareData.Cyberwares == nil {\n")
	b.WriteString("\t\treturn []Cyberware{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn cyberwareData.Cyberwares.Cyberware\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetCyberwareByID returns the cyberware item with the given ID, or nil if not found.\n")
	b.WriteString("func GetCyberwareByID(id string) *Cyberware {\n")
	b.WriteString("\titems := GetAllCyberware()\n")
	b.WriteString("\tfor i := range items {\n")
	b.WriteString("\t\tif items[i].ID == id {\n")
	b.WriteString("\t\t\treturn &items[i]\n")
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

