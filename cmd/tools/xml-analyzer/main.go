package main

import (
	"encoding/xml"
	"fmt"
	"io"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

type AnalysisReport struct {
	FilePath    string
	FileSize    int64
	RecordCount int
	RootElement string
	WellFormed  bool
	Structure   map[string]int
	Issues      []string
	Errors      []string
}

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintf(os.Stderr, "Usage: %s <xml-file-path>\n", os.Args[0])
		os.Exit(1)
	}

	filePath := os.Args[1]
	report, err := analyzeFile(filePath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error analyzing file: %v\n", err)
		os.Exit(1)
	}

	printReport(report)
}

func analyzeFile(filePath string) (*AnalysisReport, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		return nil, fmt.Errorf("failed to stat file: %w", err)
	}

	report := &AnalysisReport{
		FilePath:  filePath,
		FileSize:  stat.Size(),
		Structure: make(map[string]int),
		Issues:    make([]string, 0),
		Errors:    make([]string, 0),
		WellFormed: true,
	}

	decoder := xml.NewDecoder(file)
	var depth int
	var recordCount int
	var rootElement string
	var currentElement string
	var elementStack []string
	ids := make(map[string]int) // Track IDs for duplicates

	for {
		token, err := decoder.Token()
		if err == io.EOF {
			break
		}
		if err != nil {
			report.WellFormed = false
			report.Errors = append(report.Errors, fmt.Sprintf("XML parsing error: %v", err))
			break
		}

		switch t := token.(type) {
		case xml.StartElement:
			depth++
			elementName := t.Name.Local
			elementStack = append(elementStack, elementName)

			if depth == 1 {
				rootElement = elementName
				report.RootElement = rootElement
			}

			// Track element counts
			report.Structure[elementName]++

			// Check for ID attributes
			for _, attr := range t.Attr {
				if attr.Name.Local == "id" {
					id := attr.Value
					if id == "" {
						report.Issues = append(report.Issues, fmt.Sprintf("Empty ID attribute at element %s", elementName))
					} else {
						if idx, exists := ids[id]; exists {
							report.Issues = append(report.Issues, fmt.Sprintf("Duplicate ID '%s' found (first at position %d)", id, idx))
						} else {
							ids[id] = recordCount
							// Validate UUID format
							if !loader.ValidateUUID(id) {
								report.Issues = append(report.Issues, fmt.Sprintf("Invalid UUID format: %s", id))
							}
						}
					}
				}
			}

			// Track record-level elements for counting
			if isRecordElement(elementName) {
				currentElement = elementName
				recordCount++
			}

		case xml.EndElement:
			if len(elementStack) > 0 {
				elementStack = elementStack[:len(elementStack)-1]
			}
			if currentElement != "" && t.Name.Local == currentElement {
				currentElement = ""
			}
			depth--

		case xml.CharData:
			// Could analyze content here if needed
		}
	}

	report.RecordCount = recordCount

	return report, nil
}

func isRecordElement(name string) bool {
	recordElements := []string{
		"action", "armor", "book", "contact", "echo", "improvement", "license",
		"mentor", "metamagic", "option", "paragon", "priority", "qualitylevel",
		"range", "reference", "setting", "sheet", "spiritpower", "string", "tip",
		"bioware", "complexform", "critterpower", "critter", "cyberware",
		"drugcomponent", "lifemodule", "lifestyle", "martialart", "metatype",
		"pack", "power", "program", "quality", "skill", "spell", "stream",
		"tradition", "vessel", "vehicle", "weapon", "gear", "mod",
	}
	nameLower := strings.ToLower(name)
	for _, elem := range recordElements {
		if nameLower == elem {
			return true
		}
	}
	return false
}

func printReport(report *AnalysisReport) {
	fmt.Printf("=== XML File Analysis Report ===\n\n")
	fmt.Printf("File: %s\n", report.FilePath)
	fmt.Printf("Size: %d bytes (%.2f KB)\n", report.FileSize, float64(report.FileSize)/1024)
	fmt.Printf("Root Element: %s\n", report.RootElement)
	fmt.Printf("Well Formed: %v\n", report.WellFormed)
	fmt.Printf("Record Count: %d\n", report.RecordCount)
	fmt.Printf("\n=== Structure ===\n")
	for elem, count := range report.Structure {
		fmt.Printf("  %s: %d\n", elem, count)
	}
	if len(report.Errors) > 0 {
		fmt.Printf("\n=== Errors ===\n")
		for _, err := range report.Errors {
			fmt.Printf("  - %s\n", err)
		}
	}
	if len(report.Issues) > 0 {
		fmt.Printf("\n=== Issues ===\n")
		for _, issue := range report.Issues {
			fmt.Printf("  - %s\n", issue)
		}
	} else {
		fmt.Printf("\n=== No Issues Found ===\n")
	}
}

