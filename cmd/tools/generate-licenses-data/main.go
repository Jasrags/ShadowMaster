package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadLicensesFromXML("data/chummerxml/licenses.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateLicensesDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/licenses_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	fmt.Printf("  Total licenses: %d\n", len(data.Licenses.License))
}

func generateLicensesDataCode(data *v5.LicensesChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from licenses.xml. DO NOT EDIT.\n\n")
	b.WriteString("var licensesData = &LicensesChummer{\n")
	b.WriteString("\tLicenses: Licenses{\n")
	b.WriteString("\t\tLicense: []string{\n")
	for _, license := range data.Licenses.License {
		b.WriteString(fmt.Sprintf("\t\t\t%q,\n", license))
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetLicensesData returns the loaded licenses data.\n")
	b.WriteString("func GetLicensesData() *LicensesChummer {\n")
	b.WriteString("\treturn licensesData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllLicenses returns all license types.\n")
	b.WriteString("func GetAllLicenses() []string {\n")
	b.WriteString("\treturn licensesData.Licenses.License\n")
	b.WriteString("}\n")

	return b.String()
}

