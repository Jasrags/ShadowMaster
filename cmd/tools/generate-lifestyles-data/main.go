package main

import (
	"fmt"
	"os"
	"strings"

	v5 "shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadLifestylesFromXML("data/chummerxml/lifestyles.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateLifestylesDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/lifestyles_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalLifestyles := 0
	if data.Lifestyles != nil {
		totalLifestyles = len(data.Lifestyles.Lifestyle)
	}
	fmt.Printf("  Categories: %d, Lifestyles: %d\n",
		len(data.Categories[0].Category),
		totalLifestyles)
}

func generateLifestylesDataCode(data *v5.LifestylesChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from lifestyles.xml. DO NOT EDIT.\n\n")
	b.WriteString("var lifestylesData = &LifestylesChummer{\n")

	// Version
	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Categories
	if len(data.Categories) > 0 && len(data.Categories[0].Category) > 0 {
		b.WriteString("\tCategories: []LifestyleCategories{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tCategory: []LifestyleCategory{\n")
		for _, cat := range data.Categories[0].Category {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tContent: %q,\n", cat.Content))
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Lifestyles
	if data.Lifestyles != nil && len(data.Lifestyles.Lifestyle) > 0 {
		b.WriteString("\tLifestyles: &LifestyleItems{\n")
		b.WriteString("\t\tLifestyle: []LifestyleItem{\n")
		for _, lifestyle := range data.Lifestyles.Lifestyle {
			b.WriteString("\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\tID: %q,\n", lifestyle.ID))
			b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", lifestyle.Name))
			b.WriteString(fmt.Sprintf("\t\t\t\tCost: %q,\n", lifestyle.Cost))
			b.WriteString(fmt.Sprintf("\t\t\t\tDice: %q,\n", lifestyle.Dice))
			b.WriteString(fmt.Sprintf("\t\t\t\tLP: %q,\n", lifestyle.LP))
			b.WriteString(fmt.Sprintf("\t\t\t\tMultiplier: %q,\n", lifestyle.Multiplier))

			// Embedded Visibility
			if lifestyle.Hide != nil || lifestyle.IgnoreSourceDisabled != nil {
				b.WriteString("\t\t\t\tVisibility: common.Visibility{\n")
				if lifestyle.Hide != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\tHide: stringPtr(%q),\n", *lifestyle.Hide))
				}
				if lifestyle.IgnoreSourceDisabled != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *lifestyle.IgnoreSourceDisabled))
				}
				b.WriteString("\t\t\t\t},\n")
			}

			// Optional fields
			if lifestyle.FreeGrids != nil && len(lifestyle.FreeGrids.FreeGrid) > 0 {
				b.WriteString("\t\t\t\tFreeGrids: &FreeGrids{\n")
				b.WriteString("\t\t\t\t\tFreeGrid: []FreeGrid{\n")
				for _, fg := range lifestyle.FreeGrids.FreeGrid {
					b.WriteString("\t\t\t\t\t\t{\n")
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tContent: %q,\n", fg.Content))
					if fg.Select != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tSelect: stringPtr(%q),\n", *fg.Select))
					}
					b.WriteString("\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t},\n")
			}
			if lifestyle.CostForArea != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tCostForArea: intPtr(%d),\n", *lifestyle.CostForArea))
			}
			if lifestyle.CostForComforts != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tCostForComforts: intPtr(%d),\n", *lifestyle.CostForComforts))
			}
			if lifestyle.CostForSecurity != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tCostForSecurity: intPtr(%d),\n", *lifestyle.CostForSecurity))
			}
			if lifestyle.AllowBonusLP != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tAllowBonusLP: stringPtr(%q),\n", *lifestyle.AllowBonusLP))
			}
			if lifestyle.Increment != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tIncrement: stringPtr(%q),\n", *lifestyle.Increment))
			}

			// SourceReference
			b.WriteString("\t\t\t\tSourceReference: common.SourceReference{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tSource: %q,\n", lifestyle.Source))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tPage: %q,\n", lifestyle.Page))
			b.WriteString("\t\t\t\t},\n")

			b.WriteString("\t\t\t},\n")
		}
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Other optional sections - simplified (omit complex nested data)
	if data.Comforts != nil {
		b.WriteString("\tComforts: &Comforts{},\n")
		b.WriteString("\t// Complex nested structure omitted\n")
	}
	if data.Entertainments != nil {
		b.WriteString("\tEntertainments: &Entertainments{},\n")
		b.WriteString("\t// Complex nested structure omitted\n")
	}
	if data.Necessities != nil {
		b.WriteString("\tNecessities: &Necessities{},\n")
		b.WriteString("\t// Complex nested structure omitted\n")
	}
	if data.Neighborhoods != nil {
		b.WriteString("\tNeighborhoods: &Neighborhoods{},\n")
		b.WriteString("\t// Complex nested structure omitted\n")
	}
	if data.Securities != nil {
		b.WriteString("\tSecurities: &Securities{},\n")
		b.WriteString("\t// Complex nested structure omitted\n")
	}
	if data.Qualities != nil {
		b.WriteString("\tQualities: &LifestyleQualityItems{},\n")
		b.WriteString("\t// Complex nested structure omitted\n")
	}
	if data.Costs != nil {
		b.WriteString("\tCosts: &LifestyleCosts{},\n")
		b.WriteString("\t// Complex nested structure omitted\n")
	}
	if data.SafehouseCosts != nil {
		b.WriteString("\tSafehouseCosts: &SafehouseCosts{},\n")
		b.WriteString("\t// Complex nested structure omitted\n")
	}
	if data.Cities != nil {
		b.WriteString("\tCities: &Cities{},\n")
		b.WriteString("\t// Complex nested structure omitted\n")
	}

	b.WriteString("}\n\n")

	b.WriteString("// Helper functions for pointers\n")
	b.WriteString("func stringPtr(s string) *string { return &s }\n")
	b.WriteString("func intPtr(i int) *int { return &i }\n\n")

	b.WriteString("// GetLifestylesData returns the loaded lifestyles data.\n")
	b.WriteString("func GetLifestylesData() *LifestylesChummer {\n")
	b.WriteString("\treturn lifestylesData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllLifestyles returns all lifestyles.\n")
	b.WriteString("func GetAllLifestyles() []LifestyleItem {\n")
	b.WriteString("\tif lifestylesData.Lifestyles == nil {\n")
	b.WriteString("\t\treturn []LifestyleItem{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn lifestylesData.Lifestyles.Lifestyle\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetLifestyleByID returns the lifestyle with the given ID, or nil if not found.\n")
	b.WriteString("func GetLifestyleByID(id string) *LifestyleItem {\n")
	b.WriteString("\tlifestyles := GetAllLifestyles()\n")
	b.WriteString("\tfor i := range lifestyles {\n")
	b.WriteString("\t\tif lifestyles[i].ID == id {\n")
	b.WriteString("\t\t\treturn &lifestyles[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n")

	return b.String()
}
