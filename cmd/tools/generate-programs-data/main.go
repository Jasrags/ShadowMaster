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
	data, err := loader.LoadProgramsFromXML("data/chummerxml/programs.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateProgramsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/programs_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalPrograms := 0
	for _, programs := range data.Programs {
		totalPrograms += len(programs.Program)
	}
	fmt.Printf("  Categories: %d, Programs: %d\n", len(data.Categories), totalPrograms)
}

func generateProgramsDataCode(data *v5.ProgramsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from programs.xml. DO NOT EDIT.\n\n")
	b.WriteString("var programsData = &ProgramsChummer{\n")

	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Categories
	if len(data.Categories) > 0 {
		b.WriteString("\tCategories: []ProgramCategories{\n")
		for _, cats := range data.Categories {
			b.WriteString("\t\t{\n")
			b.WriteString("\t\t\tCategory: []ProgramCategory{\n")
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

	// Programs
	b.WriteString("\tPrograms: []ProgramItems{\n")
	b.WriteString("\t\t{\n")
	b.WriteString("\t\t\tProgram: []ProgramItem{\n")

	allPrograms := make([]v5.ProgramItem, 0)
	for _, programs := range data.Programs {
		allPrograms = append(allPrograms, programs.Program...)
	}

	for _, prog := range allPrograms {
		b.WriteString("\t\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", prog.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", prog.Name))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tCategory: %q,\n", prog.Category))

		// Embedded SourceReference
		b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", prog.Source))
		b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", prog.Page))
		b.WriteString("\t\t\t\t\t},\n")

		// Embedded Visibility
		if prog.Hide != nil || prog.IgnoreSourceDisabled != nil {
			b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
			if prog.Hide != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *prog.Hide))
			}
			if prog.IgnoreSourceDisabled != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *prog.IgnoreSourceDisabled))
			}
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Optional Tags
		if prog.Tags != nil && len(prog.Tags.Tag) > 0 {
			b.WriteString("\t\t\t\t\tTags: &Tags{\n")
			b.WriteString("\t\t\t\t\t\tTag: []string{\n")
			for _, tag := range prog.Tags.Tag {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t%q,\n", tag))
			}
			b.WriteString("\t\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t\t},\n")
		}

		if prog.Rating != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tRating: stringPtr(%q),\n", *prog.Rating))
		}
		if prog.MinRating != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tMinRating: stringPtr(%q),\n", *prog.MinRating))
		}
		if prog.ComplexForm != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tComplexForm: stringPtr(%q),\n", *prog.ComplexForm))
		}
		if prog.Avail != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tAvail: stringPtr(%q),\n", *prog.Avail))
		}
		if prog.Cost != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tCost: stringPtr(%q),\n", *prog.Cost))
		}

		// Optional Bonus
		if prog.Bonus != nil && !isBaseBonusEmpty(prog.Bonus) {
			b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{\n")
			writeBaseBonusFields(&b, prog.Bonus, "\t\t\t\t\t\t")
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Optional Forbidden
		if prog.Forbidden != nil {
			b.WriteString("\t\t\t\t\tForbidden: &common.Forbidden{},\n")
		}

		// Optional Required
		if prog.Required != nil {
			b.WriteString("\t\t\t\t\tRequired: &common.Required{},\n")
		}

		b.WriteString("\t\t\t\t},\n")
	}

	b.WriteString("\t\t\t},\n")
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetProgramsData returns the loaded programs data.\n")
	b.WriteString("func GetProgramsData() *ProgramsChummer {\n")
	b.WriteString("\treturn programsData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllPrograms returns all programs.\n")
	b.WriteString("func GetAllPrograms() []ProgramItem {\n")
	b.WriteString("\tif len(programsData.Programs) == 0 {\n")
	b.WriteString("\t\treturn []ProgramItem{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn programsData.Programs[0].Program\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetProgramByID returns the program with the given ID, or nil if not found.\n")
	b.WriteString("func GetProgramByID(id string) *ProgramItem {\n")
	b.WriteString("\tprograms := GetAllPrograms()\n")
	b.WriteString("\tfor i := range programs {\n")
	b.WriteString("\t\tif programs[i].ID == id {\n")
	b.WriteString("\t\t\treturn &programs[i]\n")
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

