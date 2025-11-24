package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadSheetsFromXML("data/chummerxml/sheets.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateSheetsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/sheets_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalSheets := 0
	for _, sheets := range data.Sheets {
		totalSheets += len(sheets.Sheet)
	}
	fmt.Printf("  Total sheets: %d\n", totalSheets)
}

func generateSheetsDataCode(data *v5.SheetsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from sheets.xml. DO NOT EDIT.\n\n")
	b.WriteString("var sheetsData = &SheetsChummer{\n")

	// Sheets
	if len(data.Sheets) > 0 {
		b.WriteString("\tSheets: []Sheets{\n")
		for _, sheets := range data.Sheets {
			b.WriteString("\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\tLang: %q,\n", sheets.Lang))
			b.WriteString("\t\t\tSheet: []Sheet{\n")
			for _, sheet := range sheets.Sheet {
				b.WriteString("\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", sheet.ID))
				b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", sheet.Name))
				b.WriteString(fmt.Sprintf("\t\t\t\t\tFilename: %q,\n", sheet.Filename))
				b.WriteString("\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t},\n")
			b.WriteString("\t\t},\n")
		}
		b.WriteString("\t},\n")
	}

	b.WriteString("}\n\n")

	b.WriteString("// GetSheetsData returns the loaded sheets data.\n")
	b.WriteString("func GetSheetsData() *SheetsChummer {\n")
	b.WriteString("\treturn sheetsData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllSheets returns all sheets.\n")
	b.WriteString("func GetAllSheets() []Sheet {\n")
	b.WriteString("\tif len(sheetsData.Sheets) == 0 {\n")
	b.WriteString("\t\treturn []Sheet{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn sheetsData.Sheets[0].Sheet\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetSheetByID returns the sheet with the given ID, or nil if not found.\n")
	b.WriteString("func GetSheetByID(id string) *Sheet {\n")
	b.WriteString("\tsheets := GetAllSheets()\n")
	b.WriteString("\tfor i := range sheets {\n")
	b.WriteString("\t\tif sheets[i].ID == id {\n")
	b.WriteString("\t\t\treturn &sheets[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n")

	return b.String()
}

