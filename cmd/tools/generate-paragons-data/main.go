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
	data, err := loader.LoadParagonsFromXML("data/chummerxml/paragons.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateParagonsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/paragons_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalParagons := 0
	for _, paragons := range data.Paragons {
		totalParagons += len(paragons.Paragon)
	}
	fmt.Printf("  Total paragons: %d\n", totalParagons)
}

func generateParagonsDataCode(data *v5.ParagonsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from paragons.xml. DO NOT EDIT.\n\n")
	b.WriteString("var paragonsData = &ParagonsChummer{\n")

	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Categories
	if len(data.Categories) > 0 {
		b.WriteString("\tCategories: []ParagonCategories{\n")
		for _, cats := range data.Categories {
			b.WriteString("\t\t{\n")
			b.WriteString("\t\t\tCategory: []ParagonCategory{\n")
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

	// Paragons
	b.WriteString("\tParagons: []Paragons{\n")
	b.WriteString("\t\t{\n")
	b.WriteString("\t\t\tParagon: []Paragon{\n")

	allParagons := make([]v5.Paragon, 0)
	for _, paragons := range data.Paragons {
		allParagons = append(allParagons, paragons.Paragon...)
	}

	for _, paragon := range allParagons {
		b.WriteString("\t\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", paragon.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", paragon.Name))

		// Embedded Visibility
		if paragon.Hide != nil || paragon.IgnoreSourceDisabled != nil {
			b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
			if paragon.Hide != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *paragon.Hide))
			}
			if paragon.IgnoreSourceDisabled != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *paragon.IgnoreSourceDisabled))
			}
			b.WriteString("\t\t\t\t\t},\n")
		}

		if paragon.Category != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tCategory: stringPtr(%q),\n", *paragon.Category))
		}

		b.WriteString(fmt.Sprintf("\t\t\t\t\tAdvantage: %q,\n", escapeString(paragon.Advantage)))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tDisadvantage: %q,\n", escapeString(paragon.Disadvantage)))

		// Optional Bonus
		if paragon.Bonus != nil && !isBaseBonusEmpty(paragon.Bonus) {
			b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{\n")
			writeBaseBonusFields(&b, paragon.Bonus, "\t\t\t\t\t\t")
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Optional Choices
		if paragon.Choices != nil && len(paragon.Choices.Choice) > 0 {
			b.WriteString("\t\t\t\t\tChoices: &ParagonChoices{\n")
			b.WriteString("\t\t\t\t\t\tChoice: []ParagonChoice{\n")
			for _, choice := range paragon.Choices.Choice {
				b.WriteString("\t\t\t\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tName: %q,\n", choice.Name))
				if choice.Hide != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tHide: stringPtr(%q),\n", *choice.Hide))
				}
				if choice.Bonus != nil && !isBaseBonusEmpty(choice.Bonus) {
					b.WriteString("\t\t\t\t\t\t\t\tBonus: &common.BaseBonus{\n")
					writeBaseBonusFields(&b, choice.Bonus, "\t\t\t\t\t\t\t\t\t")
					b.WriteString("\t\t\t\t\t\t\t\t},\n")
				}
				if choice.Set != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tSet: intPtr(%d),\n", *choice.Set))
				}
				b.WriteString("\t\t\t\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Embedded SourceReference
		b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", paragon.Source))
		b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", paragon.Page))
		b.WriteString("\t\t\t\t\t},\n")

		b.WriteString("\t\t\t\t},\n")
	}

	b.WriteString("\t\t\t},\n")
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetParagonsData returns the loaded paragons data.\n")
	b.WriteString("func GetParagonsData() *ParagonsChummer {\n")
	b.WriteString("\treturn paragonsData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllParagons returns all paragons.\n")
	b.WriteString("func GetAllParagons() []Paragon {\n")
	b.WriteString("\tif len(paragonsData.Paragons) == 0 {\n")
	b.WriteString("\t\treturn []Paragon{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn paragonsData.Paragons[0].Paragon\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetParagonByID returns the paragon with the given ID, or nil if not found.\n")
	b.WriteString("func GetParagonByID(id string) *Paragon {\n")
	b.WriteString("\tparagons := GetAllParagons()\n")
	b.WriteString("\tfor i := range paragons {\n")
	b.WriteString("\t\tif paragons[i].ID == id {\n")
	b.WriteString("\t\t\treturn &paragons[i]\n")
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
				elem := field.Elem()
				elemType := fieldType.Type.Elem()
				
				if elemType.Name() == "Livingpersona" {
					b.WriteString(fmt.Sprintf("%s%s: &common.Livingpersona{\n", indent, fieldName))
					writeLivingpersonaFields(b, elem.Interface().(common.Livingpersona), indent+"\t")
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

func escapeString(s string) string {
	s = strings.ReplaceAll(s, "\\", "\\\\")
	s = strings.ReplaceAll(s, "\"", "\\\"")
	s = strings.ReplaceAll(s, "\n", "\\n")
	s = strings.ReplaceAll(s, "\r", "\\r")
	s = strings.ReplaceAll(s, "\t", "\\t")
	return s
}

