package main

import (
	"fmt"
	"os"
	"strings"

	v5 "shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadTipsFromXML("data/chummerxml/tips.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateTipsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/tips_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	fmt.Printf("  Total tips: %d\n", len(data.Tips.Tip))
}

func generateTipsDataCode(data *v5.TipsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from tips.xml. DO NOT EDIT.\n\n")
	b.WriteString("var tipsData = &TipsChummer{\n")
	b.WriteString("\tTips: Tips{\n")
	b.WriteString("\t\tTip: []Tip{\n")

	for _, tip := range data.Tips.Tip {
		b.WriteString("\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\tID: %q,\n", tip.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\tText: %q,\n", escapeString(tip.Text)))

		if tip.ChargenOnly != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tChargenOnly: boolPtr(%v),\n", *tip.ChargenOnly))
		}
		if tip.CareerOnly != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tCareerOnly: boolPtr(%v),\n", *tip.CareerOnly))
		}

		// Required and Forbidden are complex - skip for now or use simplified version
		if tip.Required != nil {
			b.WriteString("\t\t\t\tRequired: &common.Required{},\n")
		}
		if tip.Forbidden != nil {
			b.WriteString("\t\t\t\tForbidden: &common.Forbidden{},\n")
		}

		b.WriteString("\t\t\t},\n")
	}

	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")
	b.WriteString("}\n\n")

	b.WriteString("// Helper function for bool pointers\n")
	b.WriteString("func boolPtr(b bool) *bool { return &b }\n\n")

	b.WriteString("// GetTipsData returns the loaded tips data.\n")
	b.WriteString("func GetTipsData() *TipsChummer {\n")
	b.WriteString("\treturn tipsData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllTips returns all tips.\n")
	b.WriteString("func GetAllTips() []Tip {\n")
	b.WriteString("\treturn tipsData.Tips.Tip\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetTipByID returns the tip with the given ID, or nil if not found.\n")
	b.WriteString("func GetTipByID(id string) *Tip {\n")
	b.WriteString("\ttips := GetAllTips()\n")
	b.WriteString("\tfor i := range tips {\n")
	b.WriteString("\t\tif tips[i].ID == id {\n")
	b.WriteString("\t\t\treturn &tips[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n")

	return b.String()
}

func escapeString(s string) string {
	s = strings.ReplaceAll(s, "\\", "\\\\")
	s = strings.ReplaceAll(s, "\"", "\\\"")
	s = strings.ReplaceAll(s, "\n", "\\n")
	s = strings.ReplaceAll(s, "\r", "\\r")
	s = strings.ReplaceAll(s, "\t", "\\t")
	return s
}
