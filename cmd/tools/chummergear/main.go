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

type chummerFile struct {
	Gears struct {
		Gear []map[string]interface{} `json:"gear"`
	} `json:"gears"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type CategoryMetadata struct {
	Name  string `json:"name"`
	Slug  string `json:"slug"`
	Count int    `json:"count"`
}

type NormalizedGearItem struct {
	ID           string            `json:"id"`
	Name         string            `json:"name"`
	Category     string            `json:"category"`
	CategorySlug string            `json:"category_slug"`
	ItemType     string            `json:"item_type,omitempty"`
	Subcategory  string            `json:"subcategory,omitempty"`
	Availability string            `json:"availability,omitempty"`
	Legality     string            `json:"legality,omitempty"`
	Cost         string            `json:"cost,omitempty"`
	CostFor      string            `json:"cost_for,omitempty"`
	Rating       string            `json:"rating,omitempty"`
	Source       string            `json:"source,omitempty"`
	Page         string            `json:"page,omitempty"`
	Attributes   map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source      SourceMetadata     `json:"source"`
		Categories  []CategoryMetadata `json:"categories"`
		GeneratedBy string             `json:"generated_by"`
	} `json:"metadata"`
	ItemsByCategory map[string][]NormalizedGearItem `json:"items_by_category"`
}

const (
	inputPath  = "data/chummer/gear.json"
	outputPath = "data/editions/sr5/gear/all.json"
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

	var parsed chummerFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Gears.Gear) == 0 {
		return errors.New("no gear records found in input")
	}

	itemsByCategory := make(map[string][]NormalizedGearItem)

	for _, item := range parsed.Gears.Gear {
		n := normalizeItem(item)
		if n.Category == "" {
			n.Category = "Uncategorized"
			n.CategorySlug = "uncategorized"
		}
		itemsByCategory[n.Category] = append(itemsByCategory[n.Category], n)
	}

	var categoryNames []string
	for name := range itemsByCategory {
		categoryNames = append(categoryNames, name)
	}
	sort.Strings(categoryNames)

	var categories []CategoryMetadata
	total := 0

	for _, name := range categoryNames {
		slug := makeSlug(name)
		items := itemsByCategory[name]
		sort.Slice(items, func(i, j int) bool {
			if items[i].Name == items[j].Name {
				return items[i].ID < items[j].ID
			}
			return items[i].Name < items[j].Name
		})
		itemsByCategory[name] = items
		categories = append(categories, CategoryMetadata{
			Name:  name,
			Slug:  slug,
			Count: len(items),
		})
		total += len(items)
	}

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Gear Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: total,
	}
	output.Metadata.Categories = categories
	output.Metadata.GeneratedBy = "cmd/tools/chummergear (ShadowMaster)"
	output.ItemsByCategory = itemsByCategory

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

	fmt.Printf("Normalized %d gear items into %s\n", total, outputPath)
	return nil
}

func normalizeItem(item map[string]interface{}) NormalizedGearItem {
	result := NormalizedGearItem{
		Attributes: make(map[string]string),
	}

	for key, val := range item {
		strVal := valueToString(val)
		switch key {
		case "id":
			result.ID = strVal
		case "name":
			result.Name = strVal
		case "category":
			result.Category = strVal
			result.CategorySlug = makeSlug(strVal)
		case "type":
			result.ItemType = strVal
		case "subcategory":
			result.Subcategory = strVal
		case "avail":
			result.Availability = strVal
			result.Legality = deriveLegality(strVal)
		case "cost":
			result.Cost = strVal
		case "costfor":
			result.CostFor = strVal
		case "rating":
			result.Rating = strVal
		case "source":
			result.Source = strVal
		case "page":
			result.Page = strVal
		default:
			if strVal == "" {
				continue
			}
			result.Attributes[key] = strVal
		}
	}

	if result.ID == "" {
		result.ID = makeSlug(result.Category, result.Name)
	}
	if result.Name == "" {
		result.Name = "Unnamed Gear"
	}
	if len(result.Attributes) == 0 {
		result.Attributes = nil
	}

	return result
}

func valueToString(val interface{}) string {
	switch v := val.(type) {
	case nil:
		return ""
	case string:
		return strings.TrimSpace(v)
	case float64:
		// JSON numbers decode as float64
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

func deriveLegality(avail string) string {
	trimmed := strings.TrimSpace(avail)
	if trimmed == "" {
		return ""
	}
	last := trimmed[len(trimmed)-1]
	switch last {
	case 'F', 'f':
		return "Forbidden"
	case 'R', 'r':
		return "Restricted"
	default:
		return "Legal"
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
