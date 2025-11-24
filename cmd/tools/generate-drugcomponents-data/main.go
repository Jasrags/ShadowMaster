package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadDrugComponentsFromXML("data/chummerxml/drugcomponents.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateDrugComponentsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/drugcomponents_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	fmt.Printf("  Grades: %d, DrugComponents: %d\n",
		len(data.Grades.Grade),
		len(data.DrugComponents.DrugComponent))
}

func generateDrugComponentsDataCode(data *v5.DrugComponentsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from drugcomponents.xml. DO NOT EDIT.\n\n")
	b.WriteString("var drugComponentsData = &DrugComponentsChummer{\n")

	// Grades
	if data.Grades != nil && len(data.Grades.Grade) > 0 {
		b.WriteString("\tGrades: &DrugGrades{\n")
		b.WriteString("\t\tGrade: []DrugGrade{\n")
		for _, grade := range data.Grades.Grade {
			b.WriteString("\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\tID: %q,\n", grade.ID))

			// Embedded Visibility
			if grade.Hide != nil || grade.IgnoreSourceDisabled != nil {
				b.WriteString("\t\t\t\tVisibility: common.Visibility{\n")
				if grade.Hide != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\tHide: stringPtr(%q),\n", *grade.Hide))
				}
				if grade.IgnoreSourceDisabled != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *grade.IgnoreSourceDisabled))
				}
				b.WriteString("\t\t\t\t},\n")
			}

			if grade.Name != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tName: stringPtr(%q),\n", *grade.Name))
			}
			if grade.Ess != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tEss: stringPtr(%q),\n", *grade.Ess))
			}
			if grade.Cost != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tCost: stringPtr(%q),\n", *grade.Cost))
			}
			if grade.AddictionThreshold != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tAddictionThreshold: intPtr(%d),\n", *grade.AddictionThreshold))
			}
			if grade.Avail != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tAvail: stringPtr(%q),\n", *grade.Avail))
			}

			// Embedded SourceReference
			b.WriteString("\t\t\t\tSourceReference: common.SourceReference{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tSource: %q,\n", grade.Source))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tPage: %q,\n", grade.Page))
			b.WriteString("\t\t\t\t},\n")

			b.WriteString("\t\t\t},\n")
		}
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// DrugComponents
	b.WriteString("\tDrugComponents: DrugComponents{\n")
	b.WriteString("\t\tDrugComponent: []DrugComponent{\n")
	for _, dc := range data.DrugComponents.DrugComponent {
		b.WriteString("\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\tID: %q,\n", dc.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", dc.Name))
		b.WriteString(fmt.Sprintf("\t\t\t\tCategory: %q,\n", dc.Category))

		// Effects
		b.WriteString("\t\t\t\tEffects: DrugEffects{\n")
		b.WriteString("\t\t\t\t\tEffect: []DrugEffect{\n")
		for _, effect := range dc.Effects.Effect {
			b.WriteString("\t\t\t\t\t\t{\n")
			if effect.Level != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tLevel: intPtr(%d),\n", *effect.Level))
			}

			// Attributes
			if len(effect.Attribute) > 0 {
				b.WriteString("\t\t\t\t\t\t\tAttribute: []DrugEffectAttribute{\n")
				for _, attr := range effect.Attribute {
					b.WriteString("\t\t\t\t\t\t\t\t{\n")
					if attr.Name != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tName: stringPtr(%q),\n", *attr.Name))
					}
					if attr.Value != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tValue: intPtr(%d),\n", *attr.Value))
					}
					b.WriteString("\t\t\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t\t\t},\n")
			}

			if effect.CrashDamage != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tCrashDamage: intPtr(%d),\n", *effect.CrashDamage))
			}
			if effect.Duration != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tDuration: intPtr(%d),\n", *effect.Duration))
			}
			if effect.InitiativeDice != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tInitiativeDice: intPtr(%d),\n", *effect.InitiativeDice))
			}
			if effect.Info != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tInfo: stringPtr(%q),\n", *effect.Info))
			}

			// Limits
			if len(effect.Limit) > 0 {
				b.WriteString("\t\t\t\t\t\t\tLimit: []DrugEffectLimit{\n")
				for _, limit := range effect.Limit {
					b.WriteString("\t\t\t\t\t\t\t\t{\n")
					if limit.Name != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tName: stringPtr(%q),\n", *limit.Name))
					}
					if limit.Value != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tValue: intPtr(%d),\n", *limit.Value))
					}
					b.WriteString("\t\t\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t\t\t},\n")
			}

			if effect.Quality != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tQuality: stringPtr(%q),\n", *effect.Quality))
			}
			if effect.Speed != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tSpeed: intPtr(%d),\n", *effect.Speed))
			}

			b.WriteString("\t\t\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t\t\t},\n")
		b.WriteString("\t\t\t\t},\n")

		b.WriteString(fmt.Sprintf("\t\t\t\tAvailability: %q,\n", dc.Availability))
		b.WriteString(fmt.Sprintf("\t\t\t\tCost: %d,\n", dc.Cost))
		if dc.Rating != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tRating: intPtr(%d),\n", *dc.Rating))
		}
		if dc.Threshold != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tThreshold: intPtr(%d),\n", *dc.Threshold))
		}
		b.WriteString(fmt.Sprintf("\t\t\t\tSource: %q,\n", dc.Source))
		b.WriteString(fmt.Sprintf("\t\t\t\tPage: %d,\n", dc.Page))

		b.WriteString("\t\t\t},\n")
	}

	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetDrugComponentsData returns the loaded drug components data.\n")
	b.WriteString("func GetDrugComponentsData() *DrugComponentsChummer {\n")
	b.WriteString("\treturn drugComponentsData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllDrugComponents returns all drug components.\n")
	b.WriteString("func GetAllDrugComponents() []DrugComponent {\n")
	b.WriteString("\treturn drugComponentsData.DrugComponents.DrugComponent\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetDrugComponentByID returns the drug component with the given ID, or nil if not found.\n")
	b.WriteString("func GetDrugComponentByID(id string) *DrugComponent {\n")
	b.WriteString("\tcomponents := GetAllDrugComponents()\n")
	b.WriteString("\tfor i := range components {\n")
	b.WriteString("\t\tif components[i].ID == id {\n")
	b.WriteString("\t\t\treturn &components[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n")

	return b.String()
}

