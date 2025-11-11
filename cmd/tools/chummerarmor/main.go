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

type chummerArmorFile struct {
	Categories struct {
		Category []map[string]interface{} `json:"category"`
	} `json:"categories"`
	ModCategories struct {
		Category []map[string]interface{} `json:"category"`
	} `json:"modcategories"`
	Armors struct {
		Armor []map[string]interface{} `json:"armor"`
	} `json:"armors"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedCategory struct {
	Name        string            `json:"name"`
	Slug        string            `json:"slug"`
	BlackMarket string            `json:"black_market,omitempty"`
	Attributes  map[string]string `json:"attributes,omitempty"`
}

type NormalizedArmor struct {
	ID              string            `json:"id"`
	Name            string            `json:"name"`
	Category        string            `json:"category,omitempty"`
	CategorySlug    string            `json:"category_slug,omitempty"`
	ArmorRating     string            `json:"armor_rating,omitempty"`
	Capacity        string            `json:"capacity,omitempty"`
	MaxRating       string            `json:"max_rating,omitempty"`
	Availability    string            `json:"availability,omitempty"`
	Cost            string            `json:"cost,omitempty"`
	SourceBook      string            `json:"source_book,omitempty"`
	SourcePage      string            `json:"source_page,omitempty"`
	Attributes      map[string]string `json:"attributes,omitempty"`
	ModificationTag string            `json:"mod_category,omitempty"`
}

type Output struct {
	Metadata struct {
		Source           SourceMetadata `json:"source"`
		GeneratedBy      string         `json:"generated_by"`
		ArmorCount       int            `json:"armor_count"`
		CategoryCount    int            `json:"category_count"`
		ModCategoryCount int            `json:"mod_category_count"`
	} `json:"metadata"`
	Categories    []NormalizedCategory `json:"categories"`
	ModCategories []NormalizedCategory `json:"mod_categories"`
	Armors        []NormalizedArmor    `json:"armors"`
}

const (
	inputPath  = "data/chummer/armor.json"
	outputPath = "data/editions/sr5/armor/all.json"
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

	var parsed chummerArmorFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Armors.Armor) == 0 {
		return errors.New("no armor records found")
	}

	categories := normalizeCategories(parsed.Categories.Category)
	modCategories := normalizeCategories(parsed.ModCategories.Category)
	armors := normalizeArmors(parsed.Armors.Armor)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Armor Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(armors),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerarmor (ShadowMaster)"
	output.Metadata.ArmorCount = len(armors)
	output.Metadata.CategoryCount = len(categories)
	output.Metadata.ModCategoryCount = len(modCategories)
	output.Categories = categories
	output.ModCategories = modCategories
	output.Armors = armors

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

	fmt.Printf("Normalized %d armor items into %s\n", len(armors), outputPath)
	return nil
}

func normalizeCategories(raw []map[string]interface{}) []NormalizedCategory {
	if len(raw) == 0 {
		return nil
	}

	var result []NormalizedCategory
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
				str := valueToString(value)
				if str != "" {
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
		result = append(result, c)
	}

	sort.Slice(result, func(i, j int) bool {
		return result[i].Name < result[j].Name
	})
	return result
}

func normalizeArmors(raw []map[string]interface{}) []NormalizedArmor {
	var armors []NormalizedArmor
	for _, entry := range raw {
		a := NormalizedArmor{
			Attributes: make(map[string]string),
		}
		for key, value := range entry {
			switch key {
			case "id":
				a.ID = valueToString(value)
			case "name":
				a.Name = valueToString(value)
			case "category":
				a.Category = valueToString(value)
				a.CategorySlug = makeSlug(a.Category)
			case "armor":
				a.ArmorRating = valueToString(value)
			case "armorcapacity":
				a.Capacity = valueToString(value)
			case "maxrating":
				a.MaxRating = valueToString(value)
			case "avail":
				a.Availability = valueToString(value)
			case "cost":
				a.Cost = valueToString(value)
			case "source":
				a.SourceBook = valueToString(value)
			case "page":
				a.SourcePage = valueToString(value)
			case "addmodcategory":
				a.ModificationTag = valueToString(value)
			default:
				if str := valueToString(value); str != "" {
					a.Attributes[key] = str
				}
			}
		}
		if len(a.Attributes) == 0 {
			a.Attributes = nil
		}
		if a.ID == "" {
			a.ID = makeSlug(a.Category, a.Name)
		}
		if a.Name == "" {
			a.Name = "Unnamed Armor"
		}
		armors = append(armors, a)
	}

	sort.Slice(armors, func(i, j int) bool {
		if armors[i].Category == armors[j].Category {
			return armors[i].Name < armors[j].Name
		}
		return armors[i].Category < armors[j].Category
	})
	return armors
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
