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
	data, err := loader.LoadEchoesFromXML("data/chummerxml/echoes.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateEchoesDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/echoes_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalEchoes := 0
	for _, echoes := range data.Echoes {
		totalEchoes += len(echoes.Echo)
	}
	fmt.Printf("  Total echoes: %d\n", totalEchoes)
}

func generateEchoesDataCode(data *v5.EchoesChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from echoes.xml. DO NOT EDIT.\n\n")
	b.WriteString("var echoesData = &EchoesChummer{\n")

	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	b.WriteString("\tEchoes: []Echoes{\n")
	b.WriteString("\t\t{\n")
	b.WriteString("\t\t\tEcho: []Echo{\n")

	// Flatten all echoes
	allEchoes := make([]v5.Echo, 0)
	for _, echoes := range data.Echoes {
		allEchoes = append(allEchoes, echoes.Echo...)
	}

	for _, echo := range allEchoes {
		b.WriteString("\t\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", echo.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", echo.Name))

		// Embedded SourceReference
		b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", echo.Source))
		b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", echo.Page))
		b.WriteString("\t\t\t\t\t},\n")

		// Optional Bonus
		if echo.Bonus != nil && !isBaseBonusEmpty(echo.Bonus) {
			b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{\n")
			writeBaseBonusFields(&b, echo.Bonus, "\t\t\t\t\t\t")
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Optional Forbidden
		if echo.Forbidden != nil && !isForbiddenEmpty(echo.Forbidden) {
			b.WriteString("\t\t\t\t\tForbidden: &common.Forbidden{\n")
			writeForbiddenFields(&b, echo.Forbidden, "\t\t\t\t\t\t")
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Embedded Visibility
		if echo.Hide != nil || echo.IgnoreSourceDisabled != nil {
			b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
			if echo.Hide != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *echo.Hide))
			}
			if echo.IgnoreSourceDisabled != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *echo.IgnoreSourceDisabled))
			}
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Optional Limit
		if echo.Limit != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tLimit: stringPtr(%q),\n", *echo.Limit))
		}

		// Optional Required
		if echo.Required != nil && !isRequiredEmpty(echo.Required) {
			b.WriteString("\t\t\t\t\tRequired: &common.Required{\n")
			writeRequiredFields(&b, echo.Required, "\t\t\t\t\t\t")
			b.WriteString("\t\t\t\t\t},\n")
		}

		b.WriteString("\t\t\t\t},\n")
	}

	b.WriteString("\t\t\t},\n")
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetEchoesData returns the loaded echoes data.\n")
	b.WriteString("func GetEchoesData() *EchoesChummer {\n")
	b.WriteString("\treturn echoesData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllEchoes returns all echoes.\n")
	b.WriteString("func GetAllEchoes() []Echo {\n")
	b.WriteString("\tif len(echoesData.Echoes) == 0 {\n")
	b.WriteString("\t\treturn []Echo{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn echoesData.Echoes[0].Echo\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetEchoByID returns the echo with the given ID, or nil if not found.\n")
	b.WriteString("func GetEchoByID(id string) *Echo {\n")
	b.WriteString("\techoes := GetAllEchoes()\n")
	b.WriteString("\tfor i := range echoes {\n")
	b.WriteString("\t\tif echoes[i].ID == id {\n")
	b.WriteString("\t\t\treturn &echoes[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n")

	return b.String()
}

// Helper functions to check if structs are empty
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

func isForbiddenEmpty(f *common.Forbidden) bool {
	return f.AllOf == nil && len(f.OneOf) == 0 && f.Details == nil && f.Unique == nil
}

func isRequiredEmpty(r *common.Required) bool {
	return r.AllOf == nil && len(r.OneOf) == 0 && r.Details == nil && r.Unique == nil
}

// writeBaseBonusFields generates Go code for BaseBonus fields
// This is a simplified version that handles common fields
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
				elem := field.Elem()
				elemType := fieldType.Type.Elem()
				
				// Handle specific known types
				if elemType.Name() == "Livingpersona" {
					b.WriteString(fmt.Sprintf("%s%s: &common.Livingpersona{\n", indent, fieldName))
					writeLivingpersonaFields(b, elem.Interface().(common.Livingpersona), indent+"\t")
					b.WriteString(fmt.Sprintf("%s},\n", indent))
				} else {
					// For other pointer types, use a generic approach
					b.WriteString(fmt.Sprintf("%s%s: &common.%s{},\n", indent, fieldName, elemType.Name()))
				}
			}
		case reflect.Slice:
			if field.Len() > 0 {
				elemType := fieldType.Type.Elem()
				var typeName string
				
				// Handle built-in types first
				switch elemType.Kind() {
				case reflect.Bool:
					typeName = "bool"
				case reflect.String:
					typeName = "string"
				case reflect.Int:
					typeName = "int"
				case reflect.Int8:
					typeName = "int8"
				case reflect.Int16:
					typeName = "int16"
				case reflect.Int32:
					typeName = "int32"
				case reflect.Int64:
					typeName = "int64"
				case reflect.Uint:
					typeName = "uint"
				case reflect.Uint8:
					typeName = "uint8"
				case reflect.Uint16:
					typeName = "uint16"
				case reflect.Uint32:
					typeName = "uint32"
				case reflect.Uint64:
					typeName = "uint64"
				case reflect.Float32:
					typeName = "float32"
				case reflect.Float64:
					typeName = "float64"
				default:
					// It's a named type
					if elemType.PkgPath() != "" {
						// It's from another package
						pkgName := "common"
						if elemType.PkgPath() != "shadowmaster/pkg/shadowrun/edition/v5/common" {
							// Extract package name from path
							parts := strings.Split(elemType.PkgPath(), "/")
							pkgName = parts[len(parts)-1]
						}
						typeName = pkgName + "." + elemType.Name()
					} else {
						typeName = elemType.Name()
					}
				}
				b.WriteString(fmt.Sprintf("%s%s: []%s{\n", indent, fieldName, typeName))
				// For now, skip slice elements - would need type-specific handling
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

func writeForbiddenFields(b *strings.Builder, f *common.Forbidden, indent string) {
	if f.Unique != nil {
		b.WriteString(fmt.Sprintf("%sUnique: stringPtr(%q),\n", indent, *f.Unique))
	}
	// AllOf, OneOf, Details are complex nested structures - skip for now
}

func writeRequiredFields(b *strings.Builder, r *common.Required, indent string) {
	if r.Unique != nil {
		b.WriteString(fmt.Sprintf("%sUnique: stringPtr(%q),\n", indent, *r.Unique))
	}
	// AllOf, OneOf, Details are complex nested structures - skip for now
}

