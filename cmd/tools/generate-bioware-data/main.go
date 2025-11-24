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
	data, err := loader.LoadBiowareFromXML("data/chummerxml/bioware.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateBiowareDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/bioware_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalBioware := 0
	for _, biowares := range data.Biowares {
		totalBioware += len(biowares.Bioware)
	}
	fmt.Printf("  Grades: %d, Categories: %d, Bioware items: %d\n",
		len(data.Grades[0].Grade),
		len(data.Categories[0].Category),
		totalBioware)
}

func generateBiowareDataCode(data *v5.BiowareChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from bioware.xml. DO NOT EDIT.\n\n")
	b.WriteString("var biowareData = &BiowareChummer{\n")

	// Version
	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Grades
	if len(data.Grades) > 0 && len(data.Grades[0].Grade) > 0 {
		b.WriteString("\tGrades: []BiowareGrades{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tGrade: []BiowareGrade{\n")
		for _, grade := range data.Grades[0].Grade {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", grade.ID))

			// Embedded Visibility
			if grade.Hide != nil || grade.IgnoreSourceDisabled != nil {
				b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
				if grade.Hide != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *grade.Hide))
				}
				if grade.IgnoreSourceDisabled != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *grade.IgnoreSourceDisabled))
				}
				b.WriteString("\t\t\t\t\t},\n")
			}

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
		b.WriteString("\tCategories: []BiowareCategories{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tCategory: []BiowareCategory{\n")
		for _, cat := range data.Categories[0].Category {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tContent: %q,\n", cat.Content))
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Biowares
	if len(data.Biowares) > 0 {
		b.WriteString("\tBiowares: []BiowareItems{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tBioware: []BiowareItem{\n")
		for _, item := range data.Biowares[0].Bioware {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", item.ID))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", item.Name))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tCategory: %q,\n", item.Category))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tEss: %q,\n", item.Ess))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tCapacity: %q,\n", item.Capacity))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tAvail: %q,\n", item.Avail))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tCost: %q,\n", item.Cost))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tRequireParent: %q,\n", item.RequireParent))

			// Embedded Visibility
			if item.Hide != nil || item.IgnoreSourceDisabled != nil {
				b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
				if item.Hide != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *item.Hide))
				}
				if item.IgnoreSourceDisabled != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *item.IgnoreSourceDisabled))
				}
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional fields
			if item.Limit != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tLimit: stringPtr(%q),\n", *item.Limit))
			}
			if item.MountsTo != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tMountsTo: stringPtr(%q),\n", *item.MountsTo))
			}
			if item.ModularMount != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tModularMount: stringPtr(%q),\n", *item.ModularMount))
			}
			if item.BlocksMounts != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tBlocksMounts: stringPtr(%q),\n", *item.BlocksMounts))
			}
			if item.AddToParentCapacity != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAddToParentCapacity: stringPtr(%q),\n", *item.AddToParentCapacity))
			}
			if item.AddToParentEss != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAddToParentEss: stringPtr(%q),\n", *item.AddToParentEss))
			}
			if item.Rating != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRating: stringPtr(%q),\n", *item.Rating))
			}
			if item.ForceGrade != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tForceGrade: stringPtr(%q),\n", *item.ForceGrade))
			}
			if item.Notes != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tNotes: stringPtr(%q),\n", *item.Notes))
			}

			// Optional slices
			if len(item.AddWeapon) > 0 {
				b.WriteString("\t\t\t\t\tAddWeapon: []string{\n")
				for _, weapon := range item.AddWeapon {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t%q,\n", weapon))
				}
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional nested structures (simplified - omit complex nested data)
			if item.BannedGrades != nil && len(item.BannedGrades.Grade) > 0 {
				b.WriteString("\t\t\t\t\tBannedGrades: &BiowareBannedGrades{\n")
				b.WriteString("\t\t\t\t\t\tGrade: []string{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t// %d items omitted\n", len(item.BannedGrades.Grade)))
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			if item.AllowSubsystems != nil && len(item.AllowSubsystems.Category) > 0 {
				b.WriteString("\t\t\t\t\tAllowSubsystems: &BiowareAllowSubsystems{\n")
				b.WriteString("\t\t\t\t\t\tCategory: []string{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t// %d items omitted\n", len(item.AllowSubsystems.Category)))
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			if item.IncludePair != nil && len(item.IncludePair.Name) > 0 {
				b.WriteString("\t\t\t\t\tIncludePair: &BiowareIncludePair{\n")
				b.WriteString("\t\t\t\t\t\tName: []string{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t// %d items omitted\n", len(item.IncludePair.Name)))
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional Bonus
			if item.Bonus != nil && !isBaseBonusEmpty(item.Bonus) {
				b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{\n")
				writeBaseBonusFields(&b, item.Bonus, "\t\t\t\t\t\t")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional Forbidden
			if item.Forbidden != nil {
				b.WriteString("\t\t\t\t\tForbidden: &common.Forbidden{},\n")
			}

			// Optional Required
			if item.Required != nil {
				b.WriteString("\t\t\t\t\tRequired: &common.Required{},\n")
			}

			// Subsystems - omit complex nested structure
			if item.Subsystems != nil {
				b.WriteString("\t\t\t\t\tSubsystems: &BiowareSubsystems{},\n")
				b.WriteString("\t\t\t\t\t// Complex nested structure omitted\n")
			}

			// SourceReference
			b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", item.Source))
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", item.Page))
			b.WriteString("\t\t\t\t\t},\n")

			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	b.WriteString("}\n\n")

	b.WriteString("// GetBiowareData returns the loaded bioware data.\n")
	b.WriteString("func GetBiowareData() *BiowareChummer {\n")
	b.WriteString("\treturn biowareData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllBioware returns all bioware items.\n")
	b.WriteString("func GetAllBioware() []BiowareItem {\n")
	b.WriteString("\tif len(biowareData.Biowares) == 0 {\n")
	b.WriteString("\t\treturn []BiowareItem{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn biowareData.Biowares[0].Bioware\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetBiowareByID returns the bioware item with the given ID, or nil if not found.\n")
	b.WriteString("func GetBiowareByID(id string) *BiowareItem {\n")
	b.WriteString("\titems := GetAllBioware()\n")
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

