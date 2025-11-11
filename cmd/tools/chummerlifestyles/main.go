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

type chummerLifestylesFile struct {
	Categories struct {
		Category []interface{} `json:"category"`
	} `json:"categories"`
	Lifestyles struct {
		Lifestyle []map[string]interface{} `json:"lifestyle"`
	} `json:"lifestyles"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedCategory struct {
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type NormalizedFreeGrid struct {
	Name      string `json:"name"`
	Selection string `json:"selection,omitempty"`
}

type NormalizedLifestyle struct {
	ID              string               `json:"id"`
	Name            string               `json:"name"`
	Category        string               `json:"category,omitempty"`
	CategorySlug    string               `json:"category_slug,omitempty"`
	Type            string               `json:"type,omitempty"`
	Cost            string               `json:"cost,omitempty"`
	Dice            string               `json:"dice,omitempty"`
	LifestylePoints string               `json:"lifestyle_points,omitempty"`
	Multiplier      string               `json:"multiplier,omitempty"`
	ContractPrice   string               `json:"contract_price,omitempty"`
	CostForArea     string               `json:"cost_for_area,omitempty"`
	CostForComforts string               `json:"cost_for_comforts,omitempty"`
	CostForSecurity string               `json:"cost_for_security,omitempty"`
	MinimumMonths   string               `json:"minimum_months,omitempty"`
	Source          string               `json:"source,omitempty"`
	Page            string               `json:"page,omitempty"`
	FreeGrids       []NormalizedFreeGrid `json:"free_grids,omitempty"`
	Attributes      map[string]string    `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source         SourceMetadata `json:"source"`
		GeneratedBy    string         `json:"generated_by"`
		CategoryCount  int            `json:"category_count"`
		LifestyleCount int            `json:"lifestyle_count"`
	} `json:"metadata"`
	Categories []NormalizedCategory  `json:"categories"`
	Lifestyles []NormalizedLifestyle `json:"lifestyles"`
}

const (
	inputPath  = "data/chummer/lifestyles.json"
	outputPath = "data/editions/sr5/lifestyles/all.json"
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

	var parsed chummerLifestylesFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Lifestyles.Lifestyle) == 0 {
		return errors.New("no lifestyles found")
	}

	categories := normalizeCategories(parsed.Categories.Category)
	lifestyles := normalizeLifestyles(parsed.Lifestyles.Lifestyle)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Lifestyles Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(lifestyles),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerlifestyles (ShadowMaster)"
	output.Metadata.CategoryCount = len(categories)
	output.Metadata.LifestyleCount = len(lifestyles)
	output.Categories = categories
	output.Lifestyles = lifestyles

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

	fmt.Printf("Normalized %d lifestyles into %s\n", len(lifestyles), outputPath)
	return nil
}

func normalizeCategories(raw []interface{}) []NormalizedCategory {
	if len(raw) == 0 {
		return nil
	}
	categories := make([]NormalizedCategory, 0, len(raw))
	for _, entry := range raw {
		name := valueToString(entry)
		if name == "" {
			continue
		}
		categories = append(categories, NormalizedCategory{
			Name: name,
			Slug: makeSlug(name),
		})
	}
	sort.Slice(categories, func(i, j int) bool {
		return categories[i].Name < categories[j].Name
	})
	return categories
}

func normalizeLifestyles(raw []map[string]interface{}) []NormalizedLifestyle {
	lifestyles := make([]NormalizedLifestyle, 0, len(raw))
	for _, entry := range raw {
		lifestyle := NormalizedLifestyle{
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				lifestyle.ID = valueToString(val)
			case "name":
				lifestyle.Name = valueToString(val)
			case "category":
				lifestyle.Category = valueToString(val)
			case "type":
				lifestyle.Type = valueToString(val)
			case "cost":
				lifestyle.Cost = valueToString(val)
			case "dice":
				lifestyle.Dice = valueToString(val)
			case "lp":
				lifestyle.LifestylePoints = valueToString(val)
			case "multiplier":
				lifestyle.Multiplier = valueToString(val)
			case "contractprice":
				lifestyle.ContractPrice = valueToString(val)
			case "costforarea":
				lifestyle.CostForArea = valueToString(val)
			case "costforcomforts":
				lifestyle.CostForComforts = valueToString(val)
			case "costforsecurity":
				lifestyle.CostForSecurity = valueToString(val)
			case "minimummonths":
				lifestyle.MinimumMonths = valueToString(val)
			case "source":
				lifestyle.Source = valueToString(val)
			case "page":
				lifestyle.Page = valueToString(val)
			case "freegrids":
				lifestyle.FreeGrids = normalizeFreeGrids(val)
			default:
				if serialized := serializeValue(val); serialized != "" {
					lifestyle.Attributes[key] = serialized
				}
			}
		}
		if lifestyle.Attributes != nil && len(lifestyle.Attributes) == 0 {
			lifestyle.Attributes = nil
		}
		if lifestyle.CategorySlug == "" && lifestyle.Category != "" {
			lifestyle.CategorySlug = makeSlug(lifestyle.Category)
		}
		if lifestyle.ID == "" {
			lifestyle.ID = makeSlug(lifestyle.Name)
		}
		if lifestyle.Name == "" {
			lifestyle.Name = "Unnamed Lifestyle"
		}
		lifestyles = append(lifestyles, lifestyle)
	}

	sort.Slice(lifestyles, func(i, j int) bool {
		if lifestyles[i].Category == lifestyles[j].Category {
			return lifestyles[i].Name < lifestyles[j].Name
		}
		return lifestyles[i].Category < lifestyles[j].Category
	})

	return lifestyles
}

func normalizeFreeGrids(value interface{}) []NormalizedFreeGrid {
	if value == nil {
		return nil
	}

	switch v := value.(type) {
	case map[string]interface{}:
		if raw, ok := v["freegrid"]; ok {
			return normalizeFreeGrids(raw)
		}
	case []interface{}:
		grids := make([]NormalizedFreeGrid, 0, len(v))
		for _, item := range v {
			if grid := parseFreeGrid(item); grid != nil {
				grids = append(grids, *grid)
			}
		}
		return grids
	default:
		if grid := parseFreeGrid(v); grid != nil {
			return []NormalizedFreeGrid{*grid}
		}
	}
	return nil
}

func parseFreeGrid(value interface{}) *NormalizedFreeGrid {
	switch entry := value.(type) {
	case map[string]interface{}:
		grid := NormalizedFreeGrid{}
		if name := valueToString(entry["+content"]); name != "" {
			grid.Name = name
		}
		if sel := valueToString(entry["+@select"]); sel != "" {
			grid.Selection = sel
		}
		if grid.Name == "" && grid.Selection == "" {
			return nil
		}
		if grid.Name == "" {
			grid.Name = grid.Selection
		}
		return &grid
	case string:
		if entry == "" {
			return nil
		}
		return &NormalizedFreeGrid{Name: entry}
	}
	return nil
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
