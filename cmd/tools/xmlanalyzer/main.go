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
	FilePath     string
	FileSize     int64
	RecordCount  int
	RootElement  string
	WellFormed   bool
	Structure    map[string]int
	Issues       []string
	Errors       []string
	DuplicateIDs []string
	InvalidIDs   []string
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
		FilePath:     filePath,
		FileSize:     stat.Size(),
		Structure:    make(map[string]int),
		Issues:       make([]string, 0),
		Errors:       make([]string, 0),
		DuplicateIDs: make([]string, 0),
		InvalidIDs:   make([]string, 0),
		WellFormed:   true,
	}

	decoder := xml.NewDecoder(file)
	var depth int
	var recordCount int
	var rootElement string
	var currentElement string
	ids := make(map[string]int) // Track IDs for duplicates
	var currentID string

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

			if depth == 1 {
				rootElement = elementName
				report.RootElement = rootElement
			}

			// Track element counts
			report.Structure[elementName]++

			// Check for ID attributes
			for _, attr := range t.Attr {
				if attr.Name.Local == "id" {
					currentID = attr.Value
					if currentID == "" {
						report.Issues = append(report.Issues, fmt.Sprintf("Empty ID attribute at element %s", elementName))
					} else {
						if idx, exists := ids[currentID]; exists {
							report.DuplicateIDs = append(report.DuplicateIDs, currentID)
							report.Issues = append(report.Issues, fmt.Sprintf("Duplicate ID '%s' found (first at position %d)", currentID, idx))
						} else {
							ids[currentID] = recordCount
							// Validate UUID format
							if !loader.ValidateUUID(currentID) {
								report.InvalidIDs = append(report.InvalidIDs, currentID)
								report.Issues = append(report.Issues, fmt.Sprintf("Invalid UUID format: %s", currentID))
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
			if currentElement != "" && t.Name.Local == currentElement {
				currentElement = ""
			}
			// Handle ID elements (not attributes)
			if strings.ToLower(t.Name.Local) == "id" && currentID == "" {
				// ID was read as element content, will be handled in CharData
			}
			depth--

		case xml.CharData:
			// If we're inside an ID element, validate it
			if depth > 0 {
				text := strings.TrimSpace(string(t))
				if text != "" && currentID == "" {
					// This might be an ID element content
					// We'd need to track the parent element to know for sure
					// For now, skip this complexity
				}
			}
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
	if len(report.DuplicateIDs) > 0 {
		fmt.Printf("\n=== Duplicate IDs (%d) ===\n", len(report.DuplicateIDs))
		for i, id := range report.DuplicateIDs {
			if i < 10 {
				fmt.Printf("  - %s\n", id)
			}
		}
		if len(report.DuplicateIDs) > 10 {
			fmt.Printf("  ... and %d more\n", len(report.DuplicateIDs)-10)
		}
	}
	if len(report.InvalidIDs) > 0 {
		fmt.Printf("\n=== Invalid UUIDs (%d) ===\n", len(report.InvalidIDs))
		for i, id := range report.InvalidIDs {
			if i < 10 {
				fmt.Printf("  - %s\n", id)
			}
		}
		if len(report.InvalidIDs) > 10 {
			fmt.Printf("  ... and %d more\n", len(report.InvalidIDs)-10)
		}
	}
	if len(report.Issues) > 0 {
		fmt.Printf("\n=== Issues (%d) ===\n", len(report.Issues))
		for i, issue := range report.Issues {
			if i < 20 {
				fmt.Printf("  - %s\n", issue)
			}
		}
		if len(report.Issues) > 20 {
			fmt.Printf("  ... and %d more\n", len(report.Issues)-20)
		}
	} else {
		fmt.Printf("\n=== No Issues Found ===\n")
	}
}

