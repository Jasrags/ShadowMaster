package main

import (
	"encoding/xml"
	"fmt"
	"io"
	"os"
	"path/filepath"
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
	DuplicateIDs []string
	InvalidIDs  []string
}

func main() {
	xmlDir := "data/chummerxml"
	if len(os.Args) > 1 {
		xmlDir = os.Args[1]
	}

	files, err := filepath.Glob(filepath.Join(xmlDir, "*.xml"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error finding XML files: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Analyzing %d XML files...\n\n", len(files))

	allReports := make([]*AnalysisReport, 0, len(files))
	for _, file := range files {
		report, err := analyzeFile(file)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error analyzing %s: %v\n", file, err)
			continue
		}
		allReports = append(allReports, report)
		printReport(report)
		fmt.Println()
	}

	// Summary
	fmt.Println("=== SUMMARY ===")
	totalIssues := 0
	totalErrors := 0
	for _, r := range allReports {
		totalIssues += len(r.Issues)
		totalErrors += len(r.Errors)
	}
	fmt.Printf("Total files analyzed: %d\n", len(allReports))
	fmt.Printf("Total issues found: %d\n", totalIssues)
	fmt.Printf("Total errors found: %d\n", totalErrors)
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
		FilePath:    filepath.Base(filePath),
		FileSize:    stat.Size(),
		Structure:   make(map[string]int),
		Issues:      make([]string, 0),
		Errors:      make([]string, 0),
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
					id := attr.Value
					if id == "" {
						report.Issues = append(report.Issues, fmt.Sprintf("Empty ID attribute at element %s", elementName))
					} else {
						if idx, exists := ids[id]; exists {
							report.DuplicateIDs = append(report.DuplicateIDs, id)
							report.Issues = append(report.Issues, fmt.Sprintf("Duplicate ID '%s' found (first at position %d)", id, idx))
						} else {
							ids[id] = recordCount
							// Validate UUID format
							if !loader.ValidateUUID(id) {
								report.InvalidIDs = append(report.InvalidIDs, id)
								report.Issues = append(report.Issues, fmt.Sprintf("Invalid UUID format: %s", id))
							}
						}
					}
				}
			}

			// Check for ID elements (not just attributes)
			if strings.ToLower(elementName) == "id" {
				// Will be handled when we read the character data
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
	fmt.Printf("=== %s ===\n", report.FilePath)
	fmt.Printf("Size: %.2f KB | Records: %d | Root: %s | Well-formed: %v\n", 
		float64(report.FileSize)/1024, report.RecordCount, report.RootElement, report.WellFormed)
	if len(report.Errors) > 0 {
		fmt.Printf("  ERRORS: %d\n", len(report.Errors))
		for _, err := range report.Errors {
			fmt.Printf("    - %s\n", err)
		}
	}
	if len(report.DuplicateIDs) > 0 {
		fmt.Printf("  Duplicate IDs: %d\n", len(report.DuplicateIDs))
	}
	if len(report.InvalidIDs) > 0 {
		fmt.Printf("  Invalid UUIDs: %d\n", len(report.InvalidIDs))
	}
	if len(report.Issues) > 0 {
		fmt.Printf("  Issues: %d\n", len(report.Issues))
		if len(report.Issues) <= 5 {
			for _, issue := range report.Issues {
				fmt.Printf("    - %s\n", issue)
			}
		} else {
			for i := 0; i < 5; i++ {
				fmt.Printf("    - %s\n", report.Issues[i])
			}
			fmt.Printf("    ... and %d more\n", len(report.Issues)-5)
		}
	}
}

