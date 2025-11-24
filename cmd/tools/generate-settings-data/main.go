package main

import (
	"fmt"
	"os"
	"reflect"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadSettingsFromXML("data/chummerxml/settings.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateSettingsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/settings_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	fmt.Printf("  Total settings: %d\n", len(data.Settings.Setting))
}

func generateSettingsDataCode(data *v5.SettingsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from settings.xml. DO NOT EDIT.\n\n")
	b.WriteString("var settingsData = &SettingsChummer{\n")

	// Settings
	b.WriteString("\tSettings: Settings{\n")
	b.WriteString("\t\tSetting: []Setting{\n")
	for _, setting := range data.Settings.Setting {
		b.WriteString("\t\t\t{\n")
		writeSettingFields(&b, setting, "\t\t\t\t")
		b.WriteString("\t\t\t},\n")
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	b.WriteString("}\n\n")

	b.WriteString("// GetSettingsData returns the loaded settings data.\n")
	b.WriteString("func GetSettingsData() *SettingsChummer {\n")
	b.WriteString("\treturn settingsData\n")
	b.WriteString("}\n")

	return b.String()
}

func writeSettingFields(b *strings.Builder, setting v5.Setting, indent string) {
	v := reflect.ValueOf(setting)
	t := reflect.TypeOf(setting)

	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		fieldType := t.Field(i)

		if field.IsZero() && !fieldType.Type.Implements(reflect.TypeOf((*fmt.Stringer)(nil)).Elem()) {
			continue
		}

		fieldName := fieldType.Name

		switch field.Kind() {
		case reflect.String:
			if field.String() != "" {
				b.WriteString(fmt.Sprintf("%s%s: %q,\n", indent, fieldName, field.String()))
			}
		case reflect.Bool:
			b.WriteString(fmt.Sprintf("%s%s: %t,\n", indent, fieldName, field.Bool()))
		case reflect.Int:
			b.WriteString(fmt.Sprintf("%s%s: %d,\n", indent, fieldName, field.Int()))
		case reflect.Ptr:
			if !field.IsNil() {
				elemType := fieldType.Type.Elem()
				switch elemType.Kind() {
				case reflect.String:
					b.WriteString(fmt.Sprintf("%s%s: stringPtr(%q),\n", indent, fieldName, field.Elem().String()))
				case reflect.Int:
					b.WriteString(fmt.Sprintf("%s%s: intPtr(%d),\n", indent, fieldName, field.Elem().Int()))
				default:
					// Handle complex types
					if fieldName == "KarmaCost" {
						b.WriteString(fmt.Sprintf("%s%s: &KarmaCost{\n", indent, fieldName))
						writeKarmaCostFields(b, field.Elem().Interface().(v5.KarmaCost), indent+"\t")
						b.WriteString(fmt.Sprintf("%s},\n", indent))
					} else if fieldName == "Books" {
						b.WriteString(fmt.Sprintf("%s%s: &SettingBooks{\n", indent, fieldName))
						writeSettingBooksFields(b, field.Elem().Interface().(v5.SettingBooks), indent+"\t")
						b.WriteString(fmt.Sprintf("%s},\n", indent))
					} else if fieldName == "BannedWareGrades" {
						b.WriteString(fmt.Sprintf("%s%s: &BannedWareGrades{\n", indent, fieldName))
						writeBannedWareGradesFields(b, field.Elem().Interface().(v5.BannedWareGrades), indent+"\t")
						b.WriteString(fmt.Sprintf("%s},\n", indent))
					} else if fieldName == "RedlineExclusion" {
						b.WriteString(fmt.Sprintf("%s%s: &RedlineExclusion{\n", indent, fieldName))
						writeRedlineExclusionFields(b, field.Elem().Interface().(v5.RedlineExclusion), indent+"\t")
						b.WriteString(fmt.Sprintf("%s},\n", indent))
					}
				}
			}
		}
	}
}

func writeKarmaCostFields(b *strings.Builder, kc v5.KarmaCost, indent string) {
	v := reflect.ValueOf(kc)
	t := reflect.TypeOf(kc)

	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		fieldType := t.Field(i)

		if field.IsNil() {
			continue
		}

		fieldName := fieldType.Name
		if field.Kind() == reflect.Ptr && field.Elem().Kind() == reflect.Int {
			b.WriteString(fmt.Sprintf("%s%s: intPtr(%d),\n", indent, fieldName, field.Elem().Int()))
		}
	}
}

func writeSettingBooksFields(b *strings.Builder, sb v5.SettingBooks, indent string) {
	if len(sb.Book) > 0 {
		b.WriteString(fmt.Sprintf("%sBook: []string{\n", indent))
		for _, book := range sb.Book {
			b.WriteString(fmt.Sprintf("%s\t%q,\n", indent, book))
		}
		b.WriteString(fmt.Sprintf("%s},\n", indent))
	}
}

func writeBannedWareGradesFields(b *strings.Builder, bwg v5.BannedWareGrades, indent string) {
	if len(bwg.Grade) > 0 {
		b.WriteString(fmt.Sprintf("%sGrade: []string{\n", indent))
		for _, grade := range bwg.Grade {
			b.WriteString(fmt.Sprintf("%s\t%q,\n", indent, grade))
		}
		b.WriteString(fmt.Sprintf("%s},\n", indent))
	}
}

func writeRedlineExclusionFields(b *strings.Builder, re v5.RedlineExclusion, indent string) {
	if len(re.Limb) > 0 {
		b.WriteString(fmt.Sprintf("%sLimb: []string{\n", indent))
		for _, limb := range re.Limb {
			b.WriteString(fmt.Sprintf("%s\t%q,\n", indent, limb))
		}
		b.WriteString(fmt.Sprintf("%s},\n", indent))
	}
}

