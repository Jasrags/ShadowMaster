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

type chummerQualitiesFile struct {
	Categories struct {
		Category []interface{} `json:"category"`
	} `json:"categories"`
	Qualities struct {
		Quality []map[string]interface{} `json:"quality"`
	} `json:"qualities"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedQuality struct {
	ID           string            `json:"id"`
	Name         string            `json:"name"`
	Slug         string            `json:"slug"`
	Karma        string            `json:"karma,omitempty"`
	Category     string            `json:"category,omitempty"`
	CategorySlug string            `json:"category_slug,omitempty"`
	Limit        string            `json:"limit,omitempty"`
	Source       string            `json:"source,omitempty"`
	Page         string            `json:"page,omitempty"`
	ChargenOnly  bool              `json:"chargen_only"`
	Mutant       bool              `json:"mutant"`
	Bonus        map[string]string `json:"bonus,omitempty"`
	Required     map[string]string `json:"required,omitempty"`
	Forbidden    map[string]string `json:"forbidden,omitempty"`
	Attributes   map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source        SourceMetadata `json:"source"`
		GeneratedBy   string         `json:"generated_by"`
		CategoryCount int            `json:"category_count"`
		QualityCount  int            `json:"quality_count"`
	} `json:"metadata"`
	Categories []string            `json:"categories"`
	Qualities  []NormalizedQuality `json:"qualities"`
}

const (
	inputPath  = "data/chummer/qualities.json"
	outputPath = "data/editions/sr5/qualities/all.json"
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

	var parsed chummerQualitiesFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Qualities.Quality) == 0 {
		return errors.New("no qualities found")
	}

	categories := normalizeCategories(parsed.Categories.Category)
	qualities := normalizeQualities(parsed.Qualities.Quality)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Qualities Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(qualities),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerqualities (ShadowMaster)"
	output.Metadata.CategoryCount = len(categories)
	output.Metadata.QualityCount = len(qualities)
	output.Categories = categories
	output.Qualities = qualities

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

	fmt.Printf("Normalized %d qualities into %s\n", len(qualities), outputPath)
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

func normalizeQualities(raw []map[string]interface{}) []NormalizedQuality {
	qualities := make([]NormalizedQuality, 0, len(raw))
	for _, entry := range raw {
		quality := NormalizedQuality{
			Bonus:      make(map[string]string),
			Required:   make(map[string]string),
			Forbidden:  make(map[string]string),
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				quality.ID = valueToString(val)
			case "name":
				quality.Name = valueToString(val)
			case "karma":
				quality.Karma = valueToString(val)
			case "category":
				quality.Category = valueToString(val)
				quality.CategorySlug = makeSlug(quality.Category)
			case "limit":
				quality.Limit = valueToString(val)
			case "source":
				quality.Source = valueToString(val)
			case "page":
				quality.Page = valueToString(val)
			case "chargenonly":
				quality.ChargenOnly = parseBool(val)
			case "mutant":
				quality.Mutant = parseBool(val)
			case "bonus":
				if serialized := serializeValue(val); serialized != "" {
					quality.Bonus["raw"] = serialized
				}
			case "required":
				if serialized := serializeValue(val); serialized != "" {
					quality.Required["raw"] = serialized
				}
			case "forbidden":
				if serialized := serializeValue(val); serialized != "" {
					quality.Forbidden["raw"] = serialized
				}
			default:
				if serialized := serializeValue(val); serialized != "" {
					quality.Attributes[key] = serialized
				}
			}
		}
		if quality.ID == "" {
			quality.ID = makeSlug(quality.Name, quality.Category)
		}
		if quality.Name == "" {
			quality.Name = "Unnamed Quality"
		}
		quality.Slug = makeSlug(quality.Name)
		if len(quality.Bonus) == 0 {
			quality.Bonus = nil
		}
		if len(quality.Required) == 0 {
			quality.Required = nil
		}
		if len(quality.Forbidden) == 0 {
			quality.Forbidden = nil
		}
		if len(quality.Attributes) == 0 {
			quality.Attributes = nil
		}
		qualities = append(qualities, quality)
	}

	sort.Slice(qualities, func(i, j int) bool {
		if qualities[i].Category == qualities[j].Category {
			return qualities[i].Name < qualities[j].Name
		}
		return qualities[i].Category < qualities[j].Category
	})
	return qualities
}

func parseBool(value interface{}) bool {
	switch v := value.(type) {
	case bool:
		return v
	case string:
		lower := strings.ToLower(strings.TrimSpace(v))
		return lower == "true" || lower == "1" || lower == "yes"
	case float64:
		return v != 0
	}
	return false
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
