package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadQualityLevelsFromXML("data/chummerxml/qualitylevels.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateQualityLevelsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/qualitylevels_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	if data.QualityGroups != nil {
		fmt.Printf("  Total quality groups: %d\n", len(data.QualityGroups.QualityGroup))
	}
}

func generateQualityLevelsDataCode(data *v5.QualityLevelsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from qualitylevels.xml. DO NOT EDIT.\n\n")
	b.WriteString("var qualityLevelsData = &QualityLevelsChummer{\n")

	if data.QualityGroups != nil {
		b.WriteString("\tQualityGroups: &QualityGroups{\n")
		b.WriteString("\t\tQualityGroup: []QualityGroup{\n")

		for i, group := range data.QualityGroups.QualityGroup {
			b.WriteString("\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\tID: %q,\n", group.ID))
			b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", group.Name))
			b.WriteString("\t\t\t\tLevels: QualityLevels{\n")
			b.WriteString("\t\t\t\t\tLevel: []QualityLevel{\n")

			for _, level := range group.Levels.Level {
				b.WriteString("\t\t\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tContent: %q,\n", level.Content))
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tValue: %d,\n", level.Value))
				b.WriteString("\t\t\t\t\t\t},\n")
			}

			b.WriteString("\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t},\n")
			b.WriteString("\t\t\t},\n")
			_ = i
		}

		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	b.WriteString("}\n\n")

	b.WriteString("// GetQualityLevelsData returns the loaded quality levels data.\n")
	b.WriteString("func GetQualityLevelsData() *QualityLevelsChummer {\n")
	b.WriteString("\treturn qualityLevelsData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllQualityGroups returns all quality groups.\n")
	b.WriteString("func GetAllQualityGroups() []QualityGroup {\n")
	b.WriteString("\tif qualityLevelsData.QualityGroups == nil {\n")
	b.WriteString("\t\treturn []QualityGroup{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn qualityLevelsData.QualityGroups.QualityGroup\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetQualityGroupByID returns the quality group with the given ID, or nil if not found.\n")
	b.WriteString("func GetQualityGroupByID(id string) *QualityGroup {\n")
	b.WriteString("\tgroups := GetAllQualityGroups()\n")
	b.WriteString("\tfor i := range groups {\n")
	b.WriteString("\t\tif groups[i].ID == id {\n")
	b.WriteString("\t\t\treturn &groups[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetQualityGroupByName returns the quality group with the given name, or nil if not found.\n")
	b.WriteString("func GetQualityGroupByName(name string) *QualityGroup {\n")
	b.WriteString("\tgroups := GetAllQualityGroups()\n")
	b.WriteString("\tfor i := range groups {\n")
	b.WriteString("\t\tif groups[i].Name == name {\n")
	b.WriteString("\t\t\treturn &groups[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n")

	return b.String()
}

