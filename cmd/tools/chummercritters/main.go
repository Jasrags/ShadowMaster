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

type chummerCrittersFile struct {
	Categories struct {
		Category []interface{} `json:"category"`
	} `json:"categories"`
	Metatypes struct {
		Metatype []map[string]interface{} `json:"metatype"`
	} `json:"metatypes"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedCategory struct {
	Name       string            `json:"name"`
	Slug       string            `json:"slug"`
	Attributes map[string]string `json:"attributes,omitempty"`
}

type NormalizedCritter struct {
	ID           string            `json:"id"`
	Name         string            `json:"name"`
	Category     string            `json:"category,omitempty"`
	CategorySlug string            `json:"category_slug,omitempty"`
	Karma        string            `json:"karma,omitempty"`
	Walk         string            `json:"walk,omitempty"`
	Run          string            `json:"run,omitempty"`
	Sprint       string            `json:"sprint,omitempty"`
	SourceBook   string            `json:"source_book,omitempty"`
	SourcePage   string            `json:"source_page,omitempty"`
	Stats        map[string]string `json:"stats,omitempty"`
	Attributes   map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source        SourceMetadata `json:"source"`
		GeneratedBy   string         `json:"generated_by"`
		CategoryCount int            `json:"category_count"`
		CritterCount  int            `json:"critter_count"`
	} `json:"metadata"`
	Categories []NormalizedCategory `json:"categories"`
	Critters   []NormalizedCritter  `json:"critters"`
}

const (
	inputPath  = "data/chummer/critters.json"
	outputPath = "data/editions/sr5/critters/all.json"
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

	var parsed chummerCrittersFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Metatypes.Metatype) == 0 {
		return errors.New("no critters found")
	}

	categories := normalizeCategories(parsed.Categories.Category)
	critters := normalizeCritters(parsed.Metatypes.Metatype)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Critters Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(critters),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummercritters (ShadowMaster)"
	output.Metadata.CategoryCount = len(categories)
	output.Metadata.CritterCount = len(critters)
	output.Categories = categories
	output.Critters = critters

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

	fmt.Printf("Normalized %d critters into %s\n", len(critters), outputPath)
	return nil
}

func normalizeCategories(raw []interface{}) []NormalizedCategory {
	if len(raw) == 0 {
		return nil
	}
	var categories []NormalizedCategory
	for _, entry := range raw {
		switch v := entry.(type) {
		case string:
			name := strings.TrimSpace(v)
			if name == "" {
				continue
			}
			categories = append(categories, NormalizedCategory{
				Name: name,
				Slug: makeSlug(name),
			})
		case map[string]interface{}:
			name := valueToString(v["+content"])
			if name == "" {
				continue
			}
			cat := NormalizedCategory{
				Name: name,
				Slug: makeSlug(name),
			}
			attrs := make(map[string]string)
			for key, val := range v {
				if key == "+content" {
					continue
				}
				if str := valueToString(val); str != "" {
					attrs[strings.TrimPrefix(key, "+@")] = str
				}
			}
			if len(attrs) > 0 {
				cat.Attributes = attrs
			}
			categories = append(categories, cat)
		}
	}
	sort.Slice(categories, func(i, j int) bool {
		return categories[i].Name < categories[j].Name
	})
	return categories
}

func normalizeCritters(raw []map[string]interface{}) []NormalizedCritter {
	var critters []NormalizedCritter
	statKeys := map[string]bool{
		"bodmin": true, "bodmax": true, "bodaug": true,
		"agimin": true, "agimax": true, "agiaug": true,
		"reamin": true, "reamax": true, "reaaug": true,
		"strmin": true, "strmax": true, "straug": true,
		"chamin": true, "chamax": true, "chaaug": true,
		"intmin": true, "intmax": true, "intaug": true,
		"logmin": true, "logmax": true, "logaug": true,
		"wilmin": true, "wilmax": true, "wilaug": true,
		"inimin": true, "inimax": true, "iniaug": true,
		"edgmin": true, "edgmax": true, "edgaug": true,
		"magmin": true, "magmax": true, "magaug": true,
		"resmin": true, "resmax": true, "resaug": true,
		"depmin": true, "depmax": true, "depaug": true,
		"essmin": true, "essmax": true, "essaug": true,
	}

	for _, entry := range raw {
		critter := NormalizedCritter{
			Stats:      make(map[string]string),
			Attributes: make(map[string]string),
		}
		for key, value := range entry {
			switch key {
			case "id":
				critter.ID = valueToString(value)
			case "name":
				critter.Name = valueToString(value)
			case "category":
				critter.Category = valueToString(value)
				critter.CategorySlug = makeSlug(critter.Category)
			case "karma":
				critter.Karma = valueToString(value)
			case "walk":
				critter.Walk = valueToString(value)
			case "run":
				critter.Run = valueToString(value)
			case "sprint":
				critter.Sprint = valueToString(value)
			case "source":
				critter.SourceBook = valueToString(value)
			case "page":
				critter.SourcePage = valueToString(value)
			default:
				if statKeys[key] {
					if str := valueToString(value); str != "" {
						critter.Stats[key] = str
					}
				} else {
					if str := serializeValue(value); str != "" {
						critter.Attributes[key] = str
					}
				}
			}
		}
		if len(critter.Stats) == 0 {
			critter.Stats = nil
		}
		if len(critter.Attributes) == 0 {
			critter.Attributes = nil
		}
		if critter.ID == "" {
			critter.ID = makeSlug(critter.Category, critter.Name)
		}
		if critter.Name == "" {
			critter.Name = "Unnamed Critter"
		}
		critters = append(critters, critter)
	}

	sort.Slice(critters, func(i, j int) bool {
		if critters[i].Category == critters[j].Category {
			return critters[i].Name < critters[j].Name
		}
		return critters[i].Category < critters[j].Category
	})

	return critters
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
