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
	data, err := loader.LoadMartialArtsFromXML("data/chummerxml/martialarts.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateMartialArtsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/martialarts_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalMartialArts := 0
	for _, ma := range data.MartialArts {
		totalMartialArts += len(ma.MartialArt)
	}
	fmt.Printf("  Total martial arts: %d\n", totalMartialArts)
}

func generateMartialArtsDataCode(data *v5.MartialArtsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from martialarts.xml. DO NOT EDIT.\n\n")
	b.WriteString("var martialArtsData = &MartialArtsChummer{\n")

	// Version
	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// MartialArts
	if len(data.MartialArts) > 0 {
		b.WriteString("\tMartialArts: []MartialArts{\n")
		for _, mas := range data.MartialArts {
			b.WriteString("\t\t{\n")
			b.WriteString("\t\t\tMartialArt: []MartialArt{\n")
			for _, ma := range mas.MartialArt {
				b.WriteString("\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", ma.ID))
				b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", ma.Name))
				if ma.Cost != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\tCost: intPtr(%d),\n", *ma.Cost))
				}

				// Embedded Visibility
				if ma.Hide != nil || ma.IgnoreSourceDisabled != nil {
					b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
					if ma.Hide != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *ma.Hide))
					}
					if ma.IgnoreSourceDisabled != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *ma.IgnoreSourceDisabled))
					}
					b.WriteString("\t\t\t\t\t},\n")
				}

				// Optional Bonus
				if ma.Bonus != nil && !isBaseBonusEmpty(ma.Bonus) {
					b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{\n")
					writeBaseBonusFields(&b, ma.Bonus, "\t\t\t\t\t\t")
					b.WriteString("\t\t\t\t\t},\n")
				}

				if ma.AllTechniques != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\tAllTechniques: stringPtr(%q),\n", *ma.AllTechniques))
				}

				// Optional Techniques
				if ma.Techniques != nil && len(ma.Techniques.Technique) > 0 {
					b.WriteString("\t\t\t\t\tTechniques: &Techniques{\n")
					b.WriteString("\t\t\t\t\t\tTechnique: []Technique{\n")
					for _, tech := range ma.Techniques.Technique {
						b.WriteString("\t\t\t\t\t\t\t{\n")
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tName: %q,\n", tech.Name))
						if tech.Hide != nil {
							b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tHide: stringPtr(%q),\n", *tech.Hide))
						}
						b.WriteString("\t\t\t\t\t\t\t},\n")
					}
					b.WriteString("\t\t\t\t\t\t},\n")
					b.WriteString("\t\t\t\t\t},\n")
				}

				// SourceReference (embedded)
				b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", ma.Source))
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", ma.Page))
				b.WriteString("\t\t\t\t\t},\n")

				b.WriteString("\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t},\n")
			b.WriteString("\t\t},\n")
		}
		b.WriteString("\t},\n")
	}

	// Techniques
	if len(data.Techniques) > 0 {
		b.WriteString("\tTechniques: []TechniqueItems{\n")
		for _, techs := range data.Techniques {
			b.WriteString("\t\t{\n")
			b.WriteString("\t\t\tTechnique: []TechniqueItem{\n")
			for _, tech := range techs.Technique {
				b.WriteString("\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", tech.ID))
				b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", tech.Name))

				// Optional Bonus
				if tech.Bonus != nil && !isBaseBonusEmpty(tech.Bonus) {
					b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{\n")
					writeBaseBonusFields(&b, tech.Bonus, "\t\t\t\t\t\t")
					b.WriteString("\t\t\t\t\t},\n")
				}

				// Embedded Visibility
				if tech.Hide != nil || tech.IgnoreSourceDisabled != nil {
					b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
					if tech.Hide != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *tech.Hide))
					}
					if tech.IgnoreSourceDisabled != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *tech.IgnoreSourceDisabled))
					}
					b.WriteString("\t\t\t\t\t},\n")
				}

				// SourceReference (embedded)
				b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", tech.Source))
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", tech.Page))
				b.WriteString("\t\t\t\t\t},\n")

				b.WriteString("\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t},\n")
			b.WriteString("\t\t},\n")
		}
		b.WriteString("\t},\n")
	}

	b.WriteString("}\n\n")


	b.WriteString("// GetMartialArtsData returns the loaded martial arts data.\n")
	b.WriteString("func GetMartialArtsData() *MartialArtsChummer {\n")
	b.WriteString("\treturn martialArtsData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllMartialArts returns all martial arts.\n")
	b.WriteString("func GetAllMartialArts() []MartialArt {\n")
	b.WriteString("\tif len(martialArtsData.MartialArts) == 0 {\n")
	b.WriteString("\t\treturn []MartialArt{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn martialArtsData.MartialArts[0].MartialArt\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetMartialArtByID returns the martial art with the given ID, or nil if not found.\n")
	b.WriteString("func GetMartialArtByID(id string) *MartialArt {\n")
	b.WriteString("\tarts := GetAllMartialArts()\n")
	b.WriteString("\tfor i := range arts {\n")
	b.WriteString("\t\tif arts[i].ID == id {\n")
	b.WriteString("\t\t\treturn &arts[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllTechniques returns all standalone techniques.\n")
	b.WriteString("func GetAllTechniques() []TechniqueItem {\n")
	b.WriteString("\tif len(martialArtsData.Techniques) == 0 {\n")
	b.WriteString("\t\treturn []TechniqueItem{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn martialArtsData.Techniques[0].Technique\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetTechniqueByID returns the technique with the given ID, or nil if not found.\n")
	b.WriteString("func GetTechniqueByID(id string) *TechniqueItem {\n")
	b.WriteString("\ttechniques := GetAllTechniques()\n")
	b.WriteString("\tfor i := range techniques {\n")
	b.WriteString("\t\tif techniques[i].ID == id {\n")
	b.WriteString("\t\t\treturn &techniques[i]\n")
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

