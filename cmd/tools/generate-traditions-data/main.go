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
	data, err := loader.LoadTraditionsFromXML("data/chummerxml/traditions.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateTraditionsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/traditions_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	fmt.Printf("  Traditions: %d, Spirits: %d, DrainAttributes: %d\n",
		len(data.Traditions.Tradition),
		len(data.Spirits.Spirit),
		len(data.DrainAttributes.DrainAttribute))
}

func generateTraditionsDataCode(data *v5.TraditionsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from traditions.xml. DO NOT EDIT.\n\n")
	b.WriteString("var traditionsData = &TraditionsChummer{\n")

	// Version
	b.WriteString(fmt.Sprintf("\tVersion: %d,\n", data.Version))

	// Traditions
	b.WriteString("\tTraditions: Traditions{\n")
	b.WriteString("\t\tTradition: []Tradition{\n")
	for _, trad := range data.Traditions.Tradition {
		b.WriteString("\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\tID: %q,\n", trad.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", trad.Name))
		b.WriteString(fmt.Sprintf("\t\t\t\tDrain: %q,\n", trad.Drain))
		b.WriteString(fmt.Sprintf("\t\t\t\tSource: %q,\n", trad.Source))
		b.WriteString(fmt.Sprintf("\t\t\t\tPage: %d,\n", trad.Page))

		// Embedded Visibility
		if trad.Hide != nil || trad.IgnoreSourceDisabled != nil {
			b.WriteString("\t\t\t\tVisibility: common.Visibility{\n")
			if trad.Hide != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tHide: stringPtr(%q),\n", *trad.Hide))
			}
			if trad.IgnoreSourceDisabled != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *trad.IgnoreSourceDisabled))
			}
			b.WriteString("\t\t\t\t},\n")
		}

		// Optional Bonus
		if trad.Bonus != nil && !isBaseBonusEmpty(trad.Bonus) {
			b.WriteString("\t\t\t\tBonus: &common.BaseBonus{\n")
			writeBaseBonusFields(&b, trad.Bonus, "\t\t\t\t\t")
			b.WriteString("\t\t\t\t},\n")
		}

		if trad.SpiritForm != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tSpiritForm: stringPtr(%q),\n", *trad.SpiritForm))
		}

		// Spirits
		b.WriteString("\t\t\t\tSpirits: TraditionSpirits{\n")
		if trad.Spirits.SpiritCombat != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tSpiritCombat: stringPtr(%q),\n", *trad.Spirits.SpiritCombat))
		}
		if trad.Spirits.SpiritDetection != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tSpiritDetection: stringPtr(%q),\n", *trad.Spirits.SpiritDetection))
		}
		if trad.Spirits.SpiritHealth != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tSpiritHealth: stringPtr(%q),\n", *trad.Spirits.SpiritHealth))
		}
		if trad.Spirits.SpiritIllusion != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tSpiritIllusion: stringPtr(%q),\n", *trad.Spirits.SpiritIllusion))
		}
		if trad.Spirits.SpiritManipulation != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tSpiritManipulation: stringPtr(%q),\n", *trad.Spirits.SpiritManipulation))
		}
		b.WriteString("\t\t\t\t},\n")

		b.WriteString("\t\t\t},\n")
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	// Spirits
	b.WriteString("\tSpirits: Spirits{\n")
	b.WriteString("\t\tSpirit: []Spirit{\n")
	for _, spirit := range data.Spirits.Spirit {
		b.WriteString("\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\tID: %q,\n", spirit.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", spirit.Name))
		b.WriteString(fmt.Sprintf("\t\t\t\tBod: %q,\n", spirit.Bod))
		b.WriteString(fmt.Sprintf("\t\t\t\tAgi: %q,\n", spirit.Agi))
		b.WriteString(fmt.Sprintf("\t\t\t\tRea: %q,\n", spirit.Rea))
		b.WriteString(fmt.Sprintf("\t\t\t\tStr: %q,\n", spirit.Str))
		b.WriteString(fmt.Sprintf("\t\t\t\tCha: %q,\n", spirit.Cha))
		b.WriteString(fmt.Sprintf("\t\t\t\tInt: %q,\n", spirit.Int))
		b.WriteString(fmt.Sprintf("\t\t\t\tLog: %q,\n", spirit.Log))
		b.WriteString(fmt.Sprintf("\t\t\t\tWil: %q,\n", spirit.Wil))
		b.WriteString(fmt.Sprintf("\t\t\t\tIni: %q,\n", spirit.Ini))
		b.WriteString(fmt.Sprintf("\t\t\t\tSource: %q,\n", spirit.Source))
		b.WriteString(fmt.Sprintf("\t\t\t\tPage: %d,\n", spirit.Page))

		// Embedded Visibility
		if spirit.Hide != nil || spirit.IgnoreSourceDisabled != nil {
			b.WriteString("\t\t\t\tVisibility: common.Visibility{\n")
			if spirit.Hide != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tHide: stringPtr(%q),\n", *spirit.Hide))
			}
			if spirit.IgnoreSourceDisabled != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *spirit.IgnoreSourceDisabled))
			}
			b.WriteString("\t\t\t\t},\n")
		}

		if spirit.Edg != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tEdg: stringPtr(%q),\n", *spirit.Edg))
		}
		if spirit.Mag != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tMag: stringPtr(%q),\n", *spirit.Mag))
		}
		if spirit.Res != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tRes: uint8Ptr(%d),\n", *spirit.Res))
		}
		if spirit.Dep != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tDep: uint8Ptr(%d),\n", *spirit.Dep))
		}
		if spirit.Ess != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tEss: stringPtr(%q),\n", *spirit.Ess))
		}

		// Optional Bonus
		if spirit.Bonus != nil {
			b.WriteString("\t\t\t\tBonus: &SpiritBonus{\n")
			if spirit.Bonus.EnableTab != nil {
				b.WriteString("\t\t\t\t\tEnableTab: &EnableTab{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tName: %q,\n", spirit.Bonus.EnableTab.Name))
				b.WriteString("\t\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t\t},\n")
		}

		// OptionalPowers
		if spirit.OptionalPowers != nil && len(spirit.OptionalPowers.Power) > 0 {
			b.WriteString("\t\t\t\tOptionalPowers: &SpiritOptionalPowers{\n")
			b.WriteString("\t\t\t\t\tPower: []string{\n")
			for _, power := range spirit.OptionalPowers.Power {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t%q,\n", power))
			}
			b.WriteString("\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t},\n")
		}

		// Powers
		b.WriteString("\t\t\t\tPowers: SpiritPowers{\n")
		b.WriteString("\t\t\t\t\tPower: []SpiritPower{\n")
		for _, power := range spirit.Powers.Power {
			b.WriteString("\t\t\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tContent: %q,\n", power.Content))
			if power.Select != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tSelect: stringPtr(%q),\n", *power.Select))
			}
			b.WriteString("\t\t\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t\t\t},\n")
		b.WriteString("\t\t\t\t},\n")

		// Skills
		b.WriteString("\t\t\t\tSkills: SpiritSkills{\n")
		b.WriteString("\t\t\t\t\tSkill: []SpiritSkill{\n")
		for _, skill := range spirit.Skills.Skill {
			b.WriteString("\t\t\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tContent: %q,\n", skill.Content))
			if skill.Attr != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tAttr: stringPtr(%q),\n", *skill.Attr))
			}
			b.WriteString("\t\t\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t\t\t},\n")
		b.WriteString("\t\t\t\t},\n")

		// Optional Weaknesses
		if spirit.Weaknesses != nil && len(spirit.Weaknesses.Weakness) > 0 {
			b.WriteString("\t\t\t\tWeaknesses: &Weaknesses{\n")
			b.WriteString("\t\t\t\t\tWeakness: []string{\n")
			for _, weakness := range spirit.Weaknesses.Weakness {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t%q,\n", weakness))
			}
			b.WriteString("\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t},\n")
		}

		b.WriteString("\t\t\t},\n")
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	// DrainAttributes
	b.WriteString("\tDrainAttributes: DrainAttributes{\n")
	b.WriteString("\t\tDrainAttribute: []DrainAttribute{\n")
	for _, da := range data.DrainAttributes.DrainAttribute {
		b.WriteString("\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\tID: %q,\n", da.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", da.Name))
		if da.Hide != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tHide: stringPtr(%q),\n", *da.Hide))
		}
		b.WriteString("\t\t\t},\n")
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	b.WriteString("}\n\n")

	b.WriteString("// GetTraditionsData returns the loaded traditions data.\n")
	b.WriteString("func GetTraditionsData() *TraditionsChummer {\n")
	b.WriteString("\treturn traditionsData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllTraditions returns all traditions.\n")
	b.WriteString("func GetAllTraditions() []Tradition {\n")
	b.WriteString("\treturn traditionsData.Traditions.Tradition\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetTraditionByID returns the tradition with the given ID, or nil if not found.\n")
	b.WriteString("func GetTraditionByID(id string) *Tradition {\n")
	b.WriteString("\ttraditions := GetAllTraditions()\n")
	b.WriteString("\tfor i := range traditions {\n")
	b.WriteString("\t\tif traditions[i].ID == id {\n")
	b.WriteString("\t\t\treturn &traditions[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllSpirits returns all spirits.\n")
	b.WriteString("func GetAllSpirits() []Spirit {\n")
	b.WriteString("\treturn traditionsData.Spirits.Spirit\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetSpiritByID returns the spirit with the given ID, or nil if not found.\n")
	b.WriteString("func GetSpiritByID(id string) *Spirit {\n")
	b.WriteString("\tspirits := GetAllSpirits()\n")
	b.WriteString("\tfor i := range spirits {\n")
	b.WriteString("\t\tif spirits[i].ID == id {\n")
	b.WriteString("\t\t\treturn &spirits[i]\n")
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

