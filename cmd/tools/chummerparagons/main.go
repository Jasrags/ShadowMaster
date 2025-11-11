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

type chummerParagonsFile struct {
	Categories struct {
		Category interface{} `json:"category"`
	} `json:"categories"`
	Mentors struct {
		Mentor []map[string]interface{} `json:"mentor"`
	} `json:"mentors"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedParagon struct {
	ID           string            `json:"id"`
	Name         string            `json:"name"`
	Slug         string            `json:"slug"`
	Category     string            `json:"category,omitempty"`
	Advantage    string            `json:"advantage,omitempty"`
	Disadvantage string            `json:"disadvantage,omitempty"`
	Source       string            `json:"source,omitempty"`
	Page         string            `json:"page,omitempty"`
	Bonus        map[string]string `json:"bonus,omitempty"`
	Attributes   map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source       SourceMetadata `json:"source"`
		GeneratedBy  string         `json:"generated_by"`
		ParagonCount int            `json:"paragon_count"`
	} `json:"metadata"`
	Categories []string            `json:"categories"`
	Paragons   []NormalizedParagon `json:"paragons"`
}

const (
	inputPath  = "data/chummer/paragons.json"
	outputPath = "data/editions/sr5/paragons/all.json"
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

	var parsed chummerParagonsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Mentors.Mentor) == 0 {
		return errors.New("no paragons found")
	}

	categories := normalizeCategories(parsed.Categories.Category)
	paragons := normalizeParagons(parsed.Mentors.Mentor)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Paragons Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(paragons),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerparagons (ShadowMaster)"
	output.Metadata.ParagonCount = len(paragons)
	output.Categories = categories
	output.Paragons = paragons

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

	fmt.Printf("Normalized %d paragons into %s\n", len(paragons), outputPath)
	return nil
}

func normalizeCategories(raw interface{}) []string {
	if raw == nil {
		return nil
	}
	switch v := raw.(type) {
	case string:
		if v == "" {
			return nil
		}
		return []string{v}
	case []interface{}:
		categories := make([]string, 0, len(v))
		for _, item := range v {
			if name := valueToString(item); name != "" {
				categories = append(categories, name)
			}
		}
		sort.Strings(categories)
		return categories
	}
	return nil
}

func normalizeParagons(raw []map[string]interface{}) []NormalizedParagon {
	paragons := make([]NormalizedParagon, 0, len(raw))
	for _, entry := range raw {
		paragon := NormalizedParagon{
			Bonus:      make(map[string]string),
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				paragon.ID = valueToString(val)
			case "name":
				paragon.Name = valueToString(val)
			case "category":
				paragon.Category = valueToString(val)
			case "advantage":
				paragon.Advantage = valueToString(val)
			case "disadvantage":
				paragon.Disadvantage = valueToString(val)
			case "source":
				paragon.Source = valueToString(val)
			case "page":
				paragon.Page = valueToString(val)
			case "bonus":
				if serialized := serializeValue(val); serialized != "" {
					paragon.Bonus["raw"] = serialized
				}
			default:
				if serialized := serializeValue(val); serialized != "" {
					paragon.Attributes[key] = serialized
				}
			}
		}
		if paragon.ID == "" {
			paragon.ID = makeSlug(paragon.Name)
		}
		if paragon.Name == "" {
			paragon.Name = "Unnamed Paragon"
		}
		paragon.Slug = makeSlug(paragon.Name)
		if len(paragon.Bonus) == 0 {
			paragon.Bonus = nil
		}
		if len(paragon.Attributes) == 0 {
			paragon.Attributes = nil
		}
		paragons = append(paragons, paragon)
	}

	sort.Slice(paragons, func(i, j int) bool {
		if paragons[i].Category == paragons[j].Category {
			return paragons[i].Name < paragons[j].Name
		}
		return paragons[i].Category < paragons[j].Category
	})
	return paragons
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
