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

type chummerImprovementsFile struct {
	Improvements struct {
		Improvement []map[string]interface{} `json:"improvement"`
	} `json:"improvements"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedImprovement struct {
	ID          string            `json:"id"`
	Name        string            `json:"name"`
	Internal    string            `json:"internal,omitempty"`
	Fields      []string          `json:"fields,omitempty"`
	XML         string            `json:"xml,omitempty"`
	Description string            `json:"description,omitempty"`
	Attributes  map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source      SourceMetadata `json:"source"`
		GeneratedBy string         `json:"generated_by"`
		EntryCount  int            `json:"entry_count"`
	} `json:"metadata"`
	Improvements []NormalizedImprovement `json:"improvements"`
}

const (
	inputPath  = "data/chummer/improvements.json"
	outputPath = "data/editions/sr5/improvements/all.json"
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

	var parsed chummerImprovementsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Improvements.Improvement) == 0 {
		return errors.New("no improvements found")
	}

	improvements := normalizeImprovements(parsed.Improvements.Improvement)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Improvements Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(improvements),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerimprovements (ShadowMaster)"
	output.Metadata.EntryCount = len(improvements)
	output.Improvements = improvements

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

	fmt.Printf("Normalized %d improvements into %s\n", len(improvements), outputPath)
	return nil
}

func normalizeImprovements(raw []map[string]interface{}) []NormalizedImprovement {
	var improvements []NormalizedImprovement
	for _, entry := range raw {
		improvement := NormalizedImprovement{
			Attributes: make(map[string]string),
		}
		for key, value := range entry {
			switch key {
			case "id":
				improvement.ID = valueToString(value)
			case "name":
				improvement.Name = valueToString(value)
			case "internal":
				improvement.Internal = valueToString(value)
			case "fields":
				improvement.Fields = flattenFields(value)
			case "xml":
				improvement.XML = valueToString(value)
			case "page":
				improvement.Description = valueToString(value)
			default:
				if str := serializeValue(value); str != "" {
					improvement.Attributes[key] = str
				}
			}
		}
		if len(improvement.Attributes) == 0 {
			improvement.Attributes = nil
		}
		if improvement.ID == "" {
			improvement.ID = makeSlug(improvement.Name)
		}
		if improvement.Name == "" {
			improvement.Name = "Unnamed Improvement"
		}
		improvements = append(improvements, improvement)
	}

	sort.Slice(improvements, func(i, j int) bool {
		return improvements[i].Name < improvements[j].Name
	})

	return improvements
}

func flattenFields(value interface{}) []string {
	switch v := value.(type) {
	case string:
		field := strings.TrimSpace(v)
		if field == "" {
			return nil
		}
		return []string{field}
	case map[string]interface{}:
		if raw, ok := v["field"]; ok {
			switch rv := raw.(type) {
			case string:
				field := strings.TrimSpace(rv)
				if field == "" {
					return nil
				}
				return []string{field}
			case []interface{}:
				var fields []string
				for _, item := range rv {
					if str := valueToString(item); str != "" {
						fields = append(fields, str)
					}
				}
				return fields
			}
		}
	case []interface{}:
		var fields []string
		for _, item := range v {
			if str := valueToString(item); str != "" {
				fields = append(fields, str)
			}
		}
		return fields
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
