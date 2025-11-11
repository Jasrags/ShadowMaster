package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

type chummerDrugComponentsFile struct {
	Categories struct {
		Category []interface{} `json:"category"`
	} `json:"categories"`
	Grades struct {
		Grade []map[string]interface{} `json:"grade"`
	} `json:"grades"`
	Drugs struct {
		Drug []map[string]interface{} `json:"drug"`
	} `json:"drugs"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedGrade struct {
	ID                 string            `json:"id"`
	Name               string            `json:"name"`
	Slug               string            `json:"slug"`
	CostMultiplier     string            `json:"cost_multiplier,omitempty"`
	AddictionThreshold string            `json:"addiction_threshold,omitempty"`
	Source             string            `json:"source,omitempty"`
	Attributes         map[string]string `json:"attributes,omitempty"`
}

type NormalizedDrug struct {
	ID           string            `json:"id"`
	Name         string            `json:"name"`
	Slug         string            `json:"slug"`
	Category     string            `json:"category,omitempty"`
	Rating       string            `json:"rating,omitempty"`
	Source       string            `json:"source,omitempty"`
	Page         string            `json:"page,omitempty"`
	Availability string            `json:"availability,omitempty"`
	Cost         string            `json:"cost,omitempty"`
	Speed        string            `json:"speed,omitempty"`
	Vectors      []string          `json:"vectors,omitempty"`
	Duration     string            `json:"duration,omitempty"`
	Bonus        map[string]string `json:"bonus,omitempty"`
	Crash        map[string]string `json:"crash,omitempty"`
	Addiction    map[string]string `json:"addiction,omitempty"`
	Attributes   map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source        SourceMetadata `json:"source"`
		GeneratedBy   string         `json:"generated_by"`
		CategoryCount int            `json:"category_count"`
		GradeCount    int            `json:"grade_count"`
		DrugCount     int            `json:"drug_count"`
	} `json:"metadata"`
	Categories []string          `json:"categories"`
	Grades     []NormalizedGrade `json:"grades"`
	Drugs      []NormalizedDrug  `json:"drugs"`
}

const (
	inputPath  = "data/chummer/drugcomponents.json"
	outputPath = "data/editions/sr5/drugcomponents/all.json"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}
}

func run() error {
	raw, err := os.ReadFile(inputPath)
	if err != nil {
		return fmt.Errorf("read input: %w", err)
	}

	var parsed chummerDrugComponentsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	grades := normalizeGrades(parsed.Grades.Grade)
	drugs := normalizeDrugs(parsed.Drugs.Drug)
	categories := normalizeCategories(parsed.Categories.Category)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Drug Components Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(grades) + len(drugs),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerdrugcomponents (ShadowMaster)"
	output.Metadata.CategoryCount = len(categories)
	output.Metadata.GradeCount = len(grades)
	output.Metadata.DrugCount = len(drugs)
	output.Categories = categories
	output.Grades = grades
	output.Drugs = drugs

	data, err := json.MarshalIndent(output, "", "  ")
	if err != nil {
		return fmt.Errorf("encode output: %w", err)
	}

	if err := ensureDir(filepath.Dir(outputPath)); err != nil {
		return err
	}

	if err := os.WriteFile(outputPath, data, 0o644); err != nil {
		return fmt.Errorf("write output: %w", err)
	}

	fmt.Printf("Normalized %d grades and %d drugs into %s\n", len(grades), len(drugs), outputPath)
	return nil
}

func normalizeCategories(raw []interface{}) []string {
	if len(raw) == 0 {
		return nil
	}
	categories := make([]string, 0, len(raw))
	for _, entry := range raw {
		if name := valueToString(entry); name != "" {
			categories = append(categories, name)
		}
	}
	sort.Strings(categories)
	return categories
}

func normalizeGrades(raw []map[string]interface{}) []NormalizedGrade {
	grades := make([]NormalizedGrade, 0, len(raw))
	for _, entry := range raw {
		grade := NormalizedGrade{
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				grade.ID = valueToString(val)
			case "name":
				grade.Name = valueToString(val)
			case "cost":
				grade.CostMultiplier = valueToString(val)
			case "addictionthreshold":
				grade.AddictionThreshold = valueToString(val)
			case "source":
				grade.Source = valueToString(val)
			default:
				if serialized := serializeValue(val); serialized != "" {
					grade.Attributes[key] = serialized
				}
			}
		}
		if len(grade.Attributes) == 0 {
			grade.Attributes = nil
		}
		if grade.ID == "" {
			grade.ID = makeSlug(grade.Name)
		}
		if grade.Name == "" {
			grade.Name = "Unknown Grade"
		}
		grade.Slug = makeSlug(grade.Name)
		grades = append(grades, grade)
	}
	sort.Slice(grades, func(i, j int) bool {
		return grades[i].Name < grades[j].Name
	})
	return grades
}

func normalizeDrugs(raw []map[string]interface{}) []NormalizedDrug {
	drugs := make([]NormalizedDrug, 0, len(raw))
	for _, entry := range raw {
		drug := NormalizedDrug{
			Bonus:      make(map[string]string),
			Crash:      make(map[string]string),
			Addiction:  make(map[string]string),
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				drug.ID = valueToString(val)
			case "name":
				drug.Name = valueToString(val)
			case "category":
				drug.Category = valueToString(val)
			case "rating":
				drug.Rating = valueToString(val)
			case "source":
				drug.Source = valueToString(val)
			case "page":
				drug.Page = valueToString(val)
			case "avail":
				drug.Availability = valueToString(val)
			case "cost":
				drug.Cost = valueToString(val)
			case "speed":
				drug.Speed = valueToString(val)
			case "vectors":
				drug.Vectors = splitCSV(val)
			case "duration":
				drug.Duration = valueToString(val)
			case "bonus":
				if serialized := serializeValue(val); serialized != "" {
					drug.Bonus["raw"] = serialized
				}
			case "crash":
				if serialized := serializeValue(val); serialized != "" {
					drug.Crash["raw"] = serialized
				}
			case "addiction":
				if serialized := serializeValue(val); serialized != "" {
					drug.Addiction["raw"] = serialized
				}
			default:
				if serialized := serializeValue(val); serialized != "" {
					drug.Attributes[key] = serialized
				}
			}
		}
		if len(drug.Bonus) == 0 {
			drug.Bonus = nil
		}
		if len(drug.Crash) == 0 {
			drug.Crash = nil
		}
		if len(drug.Addiction) == 0 {
			drug.Addiction = nil
		}
		if len(drug.Attributes) == 0 {
			drug.Attributes = nil
		}
		if drug.ID == "" {
			drug.ID = makeSlug(drug.Name)
		}
		if drug.Name == "" {
			drug.Name = "Unnamed Drug"
		}
		drug.Slug = makeSlug(drug.Name)
		drugs = append(drugs, drug)
	}

	sort.Slice(drugs, func(i, j int) bool {
		if drugs[i].Category == drugs[j].Category {
			return drugs[i].Name < drugs[j].Name
		}
		return drugs[i].Category < drugs[j].Category
	})

	return drugs
}

func splitCSV(val interface{}) []string {
	raw := valueToString(val)
	if raw == "" {
		return nil
	}
	parts := strings.Split(raw, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}
	if len(result) == 0 {
		return nil
	}
	return result
}

func serializeValue(value interface{}) string {
	switch value.(type) {
	case map[string]interface{}, []interface{}:
		data, err := json.Marshal(value)
		if err != nil {
			return ""
		}
		return string(data)
	default:
		return valueToString(value)
	}
}

func valueToString(val interface{}) string {
	switch v := val.(type) {
	case nil:
		return ""
	case string:
		return strings.TrimSpace(v)
	case float64:
		if float64(int64(v)) == v {
			return fmt.Sprintf("%d", int64(v))
		}
		return fmt.Sprintf("%f", v)
	default:
		b, err := json.Marshal(v)
		if err != nil {
			return fmt.Sprintf("%v", v)
		}
		return strings.Trim(string(b), "\"")
	}
}

func makeSlug(parts ...string) string {
	combined := strings.Join(parts, "-")
	combined = strings.ToLower(combined)
	var b strings.Builder
	lastDash := false
	for _, r := range combined {
		switch {
		case r >= 'a' && r <= 'z':
			b.WriteRune(r)
			lastDash = false
		case r >= '0' && r <= '9':
			b.WriteRune(r)
			lastDash = false
		default:
			if !lastDash {
				b.WriteRune('-')
				lastDash = true
			}
		}
	}
	slug := strings.Trim(b.String(), "-")
	if slug == "" {
		return "item"
	}
	return slug
}

func ensureDir(path string) error {
	if path == "" || path == "." {
		return nil
	}
	if err := os.MkdirAll(path, 0o755); err != nil {
		if !errors.Is(err, fs.ErrExist) {
			return fmt.Errorf("mkdir %s: %w", path, err)
		}
	}
	return nil
}
