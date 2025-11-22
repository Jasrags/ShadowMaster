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
	data, err := loader.LoadComplexFormsFromXML("data/chummerxml/complexforms.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateComplexFormsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/complexforms_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalForms := 0
	for _, forms := range data.ComplexForms {
		totalForms += len(forms.ComplexForm)
	}
	fmt.Printf("  Total complex forms: %d\n", totalForms)
}

func generateComplexFormsDataCode(data *v5.ComplexFormsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from complexforms.xml. DO NOT EDIT.\n\n")
	b.WriteString("var complexFormsData = &ComplexFormsChummer{\n")

	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Categories
	if len(data.Categories) > 0 {
		b.WriteString("\tCategories: []ComplexFormCategories{\n")
		for _, cats := range data.Categories {
			b.WriteString("\t\t{\n")
			b.WriteString("\t\t\tCategory: []ComplexFormCategory{\n")
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

	// ComplexForms
	b.WriteString("\tComplexForms: []ComplexFormItems{\n")
	b.WriteString("\t\t{\n")
	b.WriteString("\t\t\tComplexForm: []ComplexFormItem{\n")

	allForms := make([]v5.ComplexFormItem, 0)
	for _, forms := range data.ComplexForms {
		allForms = append(allForms, forms.ComplexForm...)
	}

	for _, form := range allForms {
		b.WriteString("\t\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", form.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", form.Name))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tTarget: %q,\n", form.Target))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tDuration: %q,\n", form.Duration))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tFV: %q,\n", form.FV))

		// Embedded SourceReference
		b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", form.Source))
		b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", form.Page))
		b.WriteString("\t\t\t\t\t},\n")

		// Embedded Visibility
		if form.Hide != nil || form.IgnoreSourceDisabled != nil {
			b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
			if form.Hide != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *form.Hide))
			}
			if form.IgnoreSourceDisabled != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *form.IgnoreSourceDisabled))
			}
			b.WriteString("\t\t\t\t\t},\n")
		}

		if form.UseSkill != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tUseSkill: stringPtr(%q),\n", *form.UseSkill))
		}

		// Optional Bonus
		if form.Bonus != nil && !isBaseBonusEmpty(form.Bonus) {
			b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{\n")
			writeBaseBonusFields(&b, form.Bonus, "\t\t\t\t\t\t")
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Optional Required
		if form.Required != nil {
			b.WriteString("\t\t\t\t\tRequired: &common.Required{},\n")
		}

		// Optional Forbidden
		if form.Forbidden != nil {
			b.WriteString("\t\t\t\t\tForbidden: &common.Forbidden{},\n")
		}

		b.WriteString("\t\t\t\t},\n")
	}

	b.WriteString("\t\t\t},\n")
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetComplexFormsData returns the loaded complex forms data.\n")
	b.WriteString("func GetComplexFormsData() *ComplexFormsChummer {\n")
	b.WriteString("\treturn complexFormsData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllComplexForms returns all complex forms.\n")
	b.WriteString("func GetAllComplexForms() []ComplexFormItem {\n")
	b.WriteString("\tif len(complexFormsData.ComplexForms) == 0 {\n")
	b.WriteString("\t\treturn []ComplexFormItem{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn complexFormsData.ComplexForms[0].ComplexForm\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetComplexFormByID returns the complex form with the given ID, or nil if not found.\n")
	b.WriteString("func GetComplexFormByID(id string) *ComplexFormItem {\n")
	b.WriteString("\tforms := GetAllComplexForms()\n")
	b.WriteString("\tfor i := range forms {\n")
	b.WriteString("\t\tif forms[i].ID == id {\n")
	b.WriteString("\t\t\treturn &forms[i]\n")
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

