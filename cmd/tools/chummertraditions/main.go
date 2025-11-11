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

type chummerTraditionsFile struct {
	Traditions struct {
		Tradition []map[string]interface{} `json:"tradition"`
	} `json:"traditions"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type TraditionEntry struct {
	ID         string            `json:"id"`
	Name       string            `json:"name"`
	Slug       string            `json:"slug"`
	Drain      string            `json:"drain,omitempty"`
	Source     string            `json:"source,omitempty"`
	Page       string            `json:"page,omitempty"`
	Spirits    map[string]string `json:"spirits,omitempty"`
	Bonus      map[string]string `json:"bonus,omitempty"`
	Attributes map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source         SourceMetadata `json:"source"`
		GeneratedBy    string         `json:"generated_by"`
		TraditionCount int            `json:"tradition_count"`
	} `json:"metadata"`
	Traditions []TraditionEntry `json:"traditions"`
}

const (
	inputPath  = "data/chummer/traditions.json"
	outputPath = "data/editions/sr5/traditions/all.json"
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

	var parsed chummerTraditionsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Traditions.Tradition) == 0 {
		return errors.New("no traditions found")
	}

	traditions := normalizeTraditions(parsed.Traditions.Tradition)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Traditions Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(traditions),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummertraditions (ShadowMaster)"
	output.Metadata.TraditionCount = len(traditions)
	output.Traditions = traditions

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

	fmt.Printf("Normalized %d traditions into %s\n", len(traditions), outputPath)
	return nil
}

func normalizeTraditions(raw []map[string]interface{}) []TraditionEntry {
	traditions := make([]TraditionEntry, 0, len(raw))
	for _, entry := range raw {
		tradition := TraditionEntry{
			Spirits:    make(map[string]string),
			Bonus:      make(map[string]string),
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				tradition.ID = valueToString(val)
			case "name":
				tradition.Name = valueToString(val)
			case "drain":
				tradition.Drain = valueToString(val)
			case "source":
				tradition.Source = valueToString(val)
			case "page":
				tradition.Page = valueToString(val)
			case "spirits":
				for spiritKey, spiritVal := range parseMap(val) {
					tradition.Spirits[spiritKey] = spiritVal
				}
			case "bonus":
				if serialized := serializeValue(val); serialized != "" {
					tradition.Bonus["raw"] = serialized
				}
			default:
				if serialized := serializeValue(val); serialized != "" {
					tradition.Attributes[key] = serialized
				}
			}
		}
		if tradition.ID == "" {
			tradition.ID = makeSlug(tradition.Name)
		}
		if tradition.Name == "" {
			tradition.Name = "Unnamed Tradition"
		}
		tradition.Slug = makeSlug(tradition.Name)
		if len(tradition.Spirits) == 0 {
			tradition.Spirits = nil
		}
		if len(tradition.Bonus) == 0 {
			tradition.Bonus = nil
		}
		if len(tradition.Attributes) == 0 {
			tradition.Attributes = nil
		}
		traditions = append(traditions, tradition)
	}

	sort.Slice(traditions, func(i, j int) bool {
		return traditions[i].Name < traditions[j].Name
	})
	return traditions
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
