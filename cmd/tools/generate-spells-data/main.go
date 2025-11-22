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
	data, err := loader.LoadSpellsFromXML("data/chummerxml/spells.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateSpellsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/spells_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalSpells := 0
	for _, spells := range data.Spells {
		totalSpells += len(spells.Spell)
	}
	fmt.Printf("  Categories: %d, Spells: %d\n",
		len(data.Categories[0].Category),
		totalSpells)
}

func generateSpellsDataCode(data *v5.SpellsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from spells.xml. DO NOT EDIT.\n\n")
	b.WriteString("var spellsData = &SpellsChummer{\n")

	// Version
	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Categories
	if len(data.Categories) > 0 && len(data.Categories[0].Category) > 0 {
		b.WriteString("\tCategories: []SpellCategories{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tCategory: []SpellCategory{\n")
		for _, cat := range data.Categories[0].Category {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tContent: %q,\n", cat.Content))
			if cat.UseSkill != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tUseSkill: stringPtr(%q),\n", *cat.UseSkill))
			}
			if cat.AlchemicalSkill != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tAlchemicalSkill: stringPtr(%q),\n", *cat.AlchemicalSkill))
			}
			if cat.BarehandedAdeptSkill != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tBarehandedAdeptSkill: stringPtr(%q),\n", *cat.BarehandedAdeptSkill))
			}
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Spells
	if len(data.Spells) > 0 {
		b.WriteString("\tSpells: []Spells{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tSpell: []Spell{\n")
		for _, spell := range data.Spells[0].Spell {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", spell.ID))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", spell.Name))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tCategory: %q,\n", spell.Category))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tDamage: %q,\n", spell.Damage))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tDescriptor: %q,\n", spell.Descriptor))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tDuration: %q,\n", spell.Duration))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tDV: %q,\n", spell.DV))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tRange: %q,\n", spell.Range))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tType: %q,\n", spell.Type))

			// Embedded Visibility
			if spell.Hide != nil || spell.IgnoreSourceDisabled != nil {
				b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
				if spell.Hide != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *spell.Hide))
				}
				if spell.IgnoreSourceDisabled != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *spell.IgnoreSourceDisabled))
				}
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional fields
			if spell.UseSkill != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tUseSkill: stringPtr(%q),\n", *spell.UseSkill))
			}

			// SourceReference
			b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", spell.Source))
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", spell.Page))
			b.WriteString("\t\t\t\t\t},\n")

			// Optional Bonus
			if spell.Bonus != nil && !isBaseBonusEmpty(spell.Bonus) {
				b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{\n")
				writeBaseBonusFields(&b, spell.Bonus, "\t\t\t\t\t\t")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional Forbidden
			if spell.Forbidden != nil {
				b.WriteString("\t\t\t\t\tForbidden: &common.Forbidden{},\n")
			}

			// Optional Required
			if spell.Required != nil {
				b.WriteString("\t\t\t\t\tRequired: &common.Required{},\n")
			}

			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	b.WriteString("}\n\n")

	b.WriteString("// GetSpellsData returns the loaded spells data.\n")
	b.WriteString("func GetSpellsData() *SpellsChummer {\n")
	b.WriteString("\treturn spellsData\n")
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

