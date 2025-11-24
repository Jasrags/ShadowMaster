package loader

import (
	"encoding/xml"
	"fmt"
	"io"
	"os"
	"strings"
)

// FileAnalysis contains analysis results for an XML file
type FileAnalysis struct {
	FilePath      string
	FileSize      int64
	RecordCount   int
	RootElement   string
	WellFormed    bool
	Structure     map[string]int // Element name -> count
	Issues        []string
	SampleRecords []map[string]interface{}
}

// AnalyzeXMLFile performs a basic analysis of an XML file
func AnalyzeXMLFile(filePath string) (*FileAnalysis, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		return nil, fmt.Errorf("failed to stat file: %w", err)
	}

	analysis := &FileAnalysis{
		FilePath:    filePath,
		FileSize:    stat.Size(),
		Structure:   make(map[string]int),
		Issues:      make([]string, 0),
		WellFormed:  true,
		SampleRecords: make([]map[string]interface{}, 0),
	}

	decoder := xml.NewDecoder(file)
	var depth int
	var recordCount int
	var rootElement string
	var currentElement string
	var currentRecord map[string]interface{}

	for {
		token, err := decoder.Token()
		if err == io.EOF {
			break
		}
		if err != nil {
			analysis.WellFormed = false
			analysis.Issues = append(analysis.Issues, fmt.Sprintf("XML parsing error: %v", err))
			break
		}

		switch t := token.(type) {
		case xml.StartElement:
			depth++
			elementName := t.Name.Local

			if depth == 1 {
				rootElement = elementName
				analysis.RootElement = rootElement
			}

			// Track element counts
			analysis.Structure[elementName]++

			// Track current element for record counting
			if depth == 2 || (depth > 2 && strings.ToLower(elementName) == "armor" || 
				strings.ToLower(elementName) == "weapon" || 
				strings.ToLower(elementName) == "gear" ||
				strings.ToLower(elementName) == "spell" ||
				strings.ToLower(elementName) == "quality" ||
				strings.ToLower(elementName) == "skill" ||
				strings.ToLower(elementName) == "vehicle" ||
				strings.ToLower(elementName) == "critter") {
				currentElement = elementName
				currentRecord = make(map[string]interface{})
			}

		case xml.EndElement:
			// If we're ending a record-level element, increment count
			if currentElement != "" && t.Name.Local == currentElement {
				recordCount++
				if len(analysis.SampleRecords) < 3 {
					analysis.SampleRecords = append(analysis.SampleRecords, currentRecord)
				}
				currentElement = ""
				currentRecord = nil
			}
			depth--

		case xml.CharData:
			// Store character data in current record if we're tracking one
			if currentRecord != nil && currentElement != "" {
				text := strings.TrimSpace(string(t))
				if text != "" {
					currentRecord[currentElement] = text
				}
			}
		}
	}

	analysis.RecordCount = recordCount

	return analysis, nil
}

// CountRecords counts the number of records of a specific type in an XML file
func CountRecords(filePath string, recordTag string) (int, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return 0, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	decoder := xml.NewDecoder(file)
	count := 0

	for {
		token, err := decoder.Token()
		if err == io.EOF {
			break
		}
		if err != nil {
			return 0, fmt.Errorf("failed to read token: %w", err)
		}

		if se, ok := token.(xml.StartElement); ok && se.Name.Local == recordTag {
			count++
			// Skip the element content
			for {
				token, err := decoder.Token()
				if err != nil {
					return 0, err
				}
				if ee, ok := token.(xml.EndElement); ok && ee.Name.Local == recordTag {
					break
				}
			}
		}
	}

	return count, nil
}

