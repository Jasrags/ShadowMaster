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

type chummerVesselsFile struct {
	Categories struct {
		Category string `json:"category"`
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

type VesselEntry struct {
	ID         string            `json:"id"`
	Name       string            `json:"name"`
	Slug       string            `json:"slug"`
	Category   string            `json:"category"`
	Body       map[string]string `json:"body,omitempty"`
	Attributes map[string]string `json:"attributes,omitempty"`
	Movements  map[string]string `json:"movements,omitempty"`
	Source     string            `json:"source,omitempty"`
	Page       string            `json:"page,omitempty"`
	Bonus      map[string]string `json:"bonus,omitempty"`
	Powers     []string          `json:"powers,omitempty"`
}

type Output struct {
	Metadata struct {
		Source      SourceMetadata `json:"source"`
		GeneratedBy string         `json:"generated_by"`
		Category    string         `json:"category"`
		VesselCount int            `json:"vessel_count"`
	} `json:"metadata"`
	Vessels []VesselEntry `json:"vessels"`
}

const (
	inputPath  = "data/chummer/vessels.json"
	outputPath = "data/editions/sr5/vessels/all.json"
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

	var parsed chummerVesselsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Metatypes.Metatype) == 0 {
		return errors.New("no vessels found")
	}

	vessels := normalizeVessels(parsed.Metatypes.Metatype, parsed.Categories.Category)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Vessels Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(vessels),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummervessels (ShadowMaster)"
	output.Metadata.Category = parsed.Categories.Category
	output.Metadata.VesselCount = len(vessels)
	output.Vessels = vessels

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

	fmt.Printf("Normalized %d vessels into %s\n", len(vessels), outputPath)
	return nil
}

func normalizeVessels(raw []map[string]interface{}, category string) []VesselEntry {
	vessels := make([]VesselEntry, 0, len(raw))
	for _, entry := range raw {
		vessel := VesselEntry{
			Category:   category,
			Body:       make(map[string]string),
			Attributes: make(map[string]string),
			Movements:  make(map[string]string),
			Bonus:      make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				vessel.ID = valueToString(val)
			case "name":
				vessel.Name = valueToString(val)
			case "category":
				vessel.Category = valueToString(val)
			case "bp":
				vessel.Attributes["bp"] = valueToString(val)
			case "source":
				vessel.Source = valueToString(val)
			case "page":
				vessel.Page = valueToString(val)
			case "bonus":
				if m := parseMap(val); len(m) > 0 {
					vessel.Bonus = m
				}
			case "powers":
				vessel.Powers = extractStringList(val)
			case "walk", "run", "sprint":
				vessel.Movements[key] = valueToString(val)
			default:
				if strings.HasSuffix(key, "min") || strings.HasSuffix(key, "max") || strings.HasSuffix(key, "aug") {
					vessel.Body[key] = valueToString(val)
				} else {
					if str := valueToString(val); str != "" {
						vessel.Attributes[key] = str
					} else if serialized := serializeValue(val); serialized != "" {
						vessel.Attributes[key] = serialized
					}
				}
			}
		}
		if vessel.ID == "" {
			vessel.ID = makeSlug(vessel.Name)
		}
		if vessel.Name == "" {
			vessel.Name = "Unnamed Vessel"
		}
		vessel.Slug = makeSlug(vessel.Name)
		if len(vessel.Body) == 0 {
			vessel.Body = nil
		}
		if len(vessel.Attributes) == 0 {
			vessel.Attributes = nil
		}
		if len(vessel.Movements) == 0 {
			vessel.Movements = nil
		}
		if len(vessel.Bonus) == 0 {
			vessel.Bonus = nil
		}
		vessels = append(vessels, vessel)
	}

	sort.Slice(vessels, func(i, j int) bool {
		return vessels[i].Name < vessels[j].Name
	})
	return vessels
}

func extractStringList(value interface{}) []string {
	switch v := value.(type) {
	case map[string]interface{}:
		if raw, ok := v["power"]; ok {
			return extractStringList(raw)
		}
	case []interface{}:
		list := make([]string, 0, len(v))
		for _, item := range v {
			list = append(list, extractStringList(item)...)
		}
		return list
	case string:
		if v != "" {
			return []string{v}
		}
	}
	return nil
}

func parseMap(value interface{}) map[string]string {
	result := make(map[string]string)
	if value == nil {
		return result
	}
	if m, ok := value.(map[string]interface{}); ok {
		for key, val := range m {
			result[key] = valueToString(val)
		}
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
