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
	data, err := loader.LoadMentorsFromXML("data/chummerxml/mentors.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateMentorsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/mentors_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalMentors := 0
	for _, mentors := range data.Mentors {
		totalMentors += len(mentors.Mentor)
	}
	fmt.Printf("  Total mentors: %d\n", totalMentors)
}

func generateMentorsDataCode(data *v5.MentorsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from mentors.xml. DO NOT EDIT.\n\n")
	b.WriteString("var mentorsData = &MentorsChummer{\n")

	// Version
	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Categories
	if len(data.Categories) > 0 {
		b.WriteString("\tCategories: []MentorCategories{\n")
		for _, cats := range data.Categories {
			b.WriteString("\t\t{\n")
			b.WriteString("\t\t\tCategory: []MentorCategory{\n")
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

	// Mentors
	if len(data.Mentors) > 0 {
		b.WriteString("\tMentors: []Mentors{\n")
		for _, mentors := range data.Mentors {
			b.WriteString("\t\t{\n")
			b.WriteString("\t\t\tMentor: []Mentor{\n")
			for _, mentor := range mentors.Mentor {
				b.WriteString("\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", mentor.ID))
				b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", mentor.Name))
				if mentor.Category != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\tCategory: stringPtr(%q),\n", *mentor.Category))
				}
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAdvantage: %q,\n", mentor.Advantage))
				b.WriteString(fmt.Sprintf("\t\t\t\t\tDisadvantage: %q,\n", mentor.Disadvantage))

				// Embedded Visibility
				if mentor.Hide != nil || mentor.IgnoreSourceDisabled != nil {
					b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
					if mentor.Hide != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *mentor.Hide))
					}
					if mentor.IgnoreSourceDisabled != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *mentor.IgnoreSourceDisabled))
					}
					b.WriteString("\t\t\t\t\t},\n")
				}

				// Optional Bonus
				if mentor.Bonus != nil && !isBaseBonusEmpty(mentor.Bonus) {
					b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{\n")
					writeBaseBonusFields(&b, mentor.Bonus, "\t\t\t\t\t\t")
					b.WriteString("\t\t\t\t\t},\n")
				}

				// Optional Choices
				if mentor.Choices != nil && len(mentor.Choices.Choice) > 0 {
					b.WriteString("\t\t\t\t\tChoices: &MentorChoices{\n")
					b.WriteString("\t\t\t\t\t\tChoice: []MentorChoice{\n")
					for _, choice := range mentor.Choices.Choice {
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

				// SourceReference (embedded)
				b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", mentor.Source))
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", mentor.Page))
				b.WriteString("\t\t\t\t\t},\n")

				b.WriteString("\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t},\n")
			b.WriteString("\t\t},\n")
		}
		b.WriteString("\t},\n")
	}

	b.WriteString("}\n\n")


	b.WriteString("// GetMentorsData returns the loaded mentors data.\n")
	b.WriteString("func GetMentorsData() *MentorsChummer {\n")
	b.WriteString("\treturn mentorsData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllMentors returns all mentors.\n")
	b.WriteString("func GetAllMentors() []Mentor {\n")
	b.WriteString("\tif len(mentorsData.Mentors) == 0 {\n")
	b.WriteString("\t\treturn []Mentor{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn mentorsData.Mentors[0].Mentor\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetMentorByID returns the mentor with the given ID, or nil if not found.\n")
	b.WriteString("func GetMentorByID(id string) *Mentor {\n")
	b.WriteString("\tmentors := GetAllMentors()\n")
	b.WriteString("\tfor i := range mentors {\n")
	b.WriteString("\t\tif mentors[i].ID == id {\n")
	b.WriteString("\t\t\treturn &mentors[i]\n")
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

