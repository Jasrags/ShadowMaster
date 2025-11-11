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

type chummerCyberwareFile struct {
	Grades struct {
		Grade []map[string]interface{} `json:"grade"`
	} `json:"grades"`
	Categories struct {
		Category []map[string]interface{} `json:"category"`
	} `json:"categories"`
	Cyberwares struct {
		Cyberware []map[string]interface{} `json:"cyberware"`
	} `json:"cyberwares"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedGrade struct {
	ID             string            `json:"id"`
	Name           string            `json:"name"`
	EssMultiplier  string            `json:"ess_multiplier,omitempty"`
	CostMultiplier string            `json:"cost_multiplier,omitempty"`
	DeviceRating   string            `json:"device_rating,omitempty"`
	Availability   string            `json:"availability,omitempty"`
	SourceBook     string            `json:"source_book,omitempty"`
	SourcePage     string            `json:"source_page,omitempty"`
	Attributes     map[string]string `json:"attributes,omitempty"`
}

type NormalizedCategory struct {
	Name        string            `json:"name"`
	Slug        string            `json:"slug"`
	BlackMarket string            `json:"black_market,omitempty"`
	Attributes  map[string]string `json:"attributes,omitempty"`
}

type NormalizedCyberware struct {
	ID           string            `json:"id"`
	Name         string            `json:"name"`
	Category     string            `json:"category,omitempty"`
	CategorySlug string            `json:"category_slug,omitempty"`
	EssCost      string            `json:"essence_cost,omitempty"`
	Capacity     string            `json:"capacity,omitempty"`
	Availability string            `json:"availability,omitempty"`
	Cost         string            `json:"cost,omitempty"`
	Rating       string            `json:"rating,omitempty"`
	SourceBook   string            `json:"source_book,omitempty"`
	SourcePage   string            `json:"source_page,omitempty"`
	Attributes   map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source         SourceMetadata `json:"source"`
		GeneratedBy    string         `json:"generated_by"`
		GradeCount     int            `json:"grade_count"`
		CategoryCount  int            `json:"category_count"`
		CyberwareCount int            `json:"cyberware_count"`
	} `json:"metadata"`
	Grades     []NormalizedGrade     `json:"grades"`
	Categories []NormalizedCategory  `json:"categories"`
	Cyberware  []NormalizedCyberware `json:"cyberware"`
}

const (
	inputPath  = "data/chummer/cyberware.json"
	outputPath = "data/editions/sr5/cyberware/all.json"
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

	var parsed chummerCyberwareFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Cyberwares.Cyberware) == 0 {
		return errors.New("no cyberware records found")
	}

	grades := normalizeGrades(parsed.Grades.Grade)
	categories := normalizeCategories(parsed.Categories.Category)
	items := normalizeCyberware(parsed.Cyberwares.Cyberware)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Cyberware Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(items),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummercyberware (ShadowMaster)"
	output.Metadata.GradeCount = len(grades)
	output.Metadata.CategoryCount = len(categories)
	output.Metadata.CyberwareCount = len(items)
	output.Grades = grades
	output.Categories = categories
	output.Cyberware = items

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

	fmt.Printf("Normalized %d cyberware items into %s\n", len(items), outputPath)
	return nil
}

func normalizeGrades(raw []map[string]interface{}) []NormalizedGrade {
	if len(raw) == 0 {
		return nil
	}
	var grades []NormalizedGrade
	for _, entry := range raw {
		g := NormalizedGrade{
			Attributes: make(map[string]string),
		}
		for key, value := range entry {
			switch key {
			case "id":
				g.ID = valueToString(value)
			case "name":
				g.Name = valueToString(value)
			case "ess":
				g.EssMultiplier = valueToString(value)
			case "cost":
				g.CostMultiplier = valueToString(value)
			case "devicerating":
				g.DeviceRating = valueToString(value)
			case "avail":
				g.Availability = valueToString(value)
			case "source":
				g.SourceBook = valueToString(value)
			case "page":
				g.SourcePage = valueToString(value)
			default:
				if str := serializeValue(value); str != "" {
					g.Attributes[key] = str
				}
			}
		}
		if len(g.Attributes) == 0 {
			g.Attributes = nil
		}
		if g.ID == "" {
			g.ID = makeSlug(g.Name)
		}
		if g.Name == "" {
			g.Name = "Unnamed Grade"
		}
		grades = append(grades, g)
	}
	sort.Slice(grades, func(i, j int) bool {
		return grades[i].Name < grades[j].Name
	})
	return grades
}

func normalizeCategories(raw []map[string]interface{}) []NormalizedCategory {
	if len(raw) == 0 {
		return nil
	}
	var categories []NormalizedCategory
	for _, entry := range raw {
		c := NormalizedCategory{
			Attributes: make(map[string]string),
		}
		for key, value := range entry {
			switch key {
			case "+content":
				c.Name = valueToString(value)
			case "+@blackmarket":
				c.BlackMarket = valueToString(value)
			default:
				if str := valueToString(value); str != "" {
					c.Attributes[key] = str
				}
			}
		}
		if c.Name == "" {
			continue
		}
		c.Slug = makeSlug(c.Name)
		if len(c.Attributes) == 0 {
			c.Attributes = nil
		}
		categories = append(categories, c)
	}
	sort.Slice(categories, func(i, j int) bool {
		return categories[i].Name < categories[j].Name
	})
	return categories
}

func normalizeCyberware(raw []map[string]interface{}) []NormalizedCyberware {
	var items []NormalizedCyberware
	for _, entry := range raw {
		c := NormalizedCyberware{
			Attributes: make(map[string]string),
		}
		for key, value := range entry {
			switch key {
			case "id":
				c.ID = valueToString(value)
			case "name":
				c.Name = valueToString(value)
			case "category":
				c.Category = valueToString(value)
				c.CategorySlug = makeSlug(c.Category)
			case "ess":
				c.EssCost = valueToString(value)
			case "capacity":
				c.Capacity = valueToString(value)
			case "avail":
				c.Availability = valueToString(value)
			case "cost":
				c.Cost = valueToString(value)
			case "rating":
				c.Rating = valueToString(value)
			case "source":
				c.SourceBook = valueToString(value)
			case "page":
				c.SourcePage = valueToString(value)
			default:
				if str := serializeValue(value); str != "" {
					c.Attributes[key] = str
				}
			}
		}
		if len(c.Attributes) == 0 {
			c.Attributes = nil
		}
		if c.ID == "" {
			c.ID = makeSlug(c.Category, c.Name)
		}
		if c.Name == "" {
			c.Name = "Unnamed Cyberware"
		}
		items = append(items, c)
	}
	sort.Slice(items, func(i, j int) bool {
		if items[i].Category == items[j].Category {
			return items[i].Name < items[j].Name
		}
		return items[i].Category < items[j].Category
	})
	return items
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
		return string(b)
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
