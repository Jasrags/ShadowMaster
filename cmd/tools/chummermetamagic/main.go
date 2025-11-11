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

type chummerMetamagicsFile struct {
	Metamagics struct {
		Metamagic []map[string]interface{} `json:"metamagic"`
	} `json:"metamagics"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedMetamagic struct {
	ID           string            `json:"id"`
	Name         string            `json:"name"`
	Slug         string            `json:"slug"`
	Adept        bool              `json:"adept"`
	Magician     bool              `json:"magician"`
	Limit        string            `json:"limit,omitempty"`
	Source       string            `json:"source,omitempty"`
	Page         string            `json:"page,omitempty"`
	Requirements map[string]string `json:"requirements,omitempty"`
	Bonus        map[string]string `json:"bonus,omitempty"`
	Attributes   map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source         SourceMetadata `json:"source"`
		GeneratedBy    string         `json:"generated_by"`
		MetamagicCount int            `json:"metamagic_count"`
	} `json:"metadata"`
	Metamagics []NormalizedMetamagic `json:"metamagics"`
}

const (
	inputPath  = "data/chummer/metamagic.json"
	outputPath = "data/editions/sr5/metamagic/all.json"
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

	var parsed chummerMetamagicsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Metamagics.Metamagic) == 0 {
		return errors.New("no metamagics found")
	}

	metamagics := normalizeMetamagics(parsed.Metamagics.Metamagic)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Metamagic Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(metamagics),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummermetamagic (ShadowMaster)"
	output.Metadata.MetamagicCount = len(metamagics)
	output.Metamagics = metamagics

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

	fmt.Printf("Normalized %d metamagics into %s\n", len(metamagics), outputPath)
	return nil
}

func normalizeMetamagics(raw []map[string]interface{}) []NormalizedMetamagic {
	metamagics := make([]NormalizedMetamagic, 0, len(raw))
	for _, entry := range raw {
		meta := NormalizedMetamagic{
			Requirements: make(map[string]string),
			Bonus:        make(map[string]string),
			Attributes:   make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				meta.ID = valueToString(val)
			case "name":
				meta.Name = valueToString(val)
			case "adept":
				meta.Adept = parseBool(val)
			case "magician":
				meta.Magician = parseBool(val)
			case "limit":
				meta.Limit = valueToString(val)
			case "source":
				meta.Source = valueToString(val)
			case "page":
				meta.Page = valueToString(val)
			case "required":
				if serialized := serializeValue(val); serialized != "" {
					meta.Requirements["raw"] = serialized
				}
			case "bonus":
				if serialized := serializeValue(val); serialized != "" {
					meta.Bonus["raw"] = serialized
				}
			default:
				if serialized := serializeValue(val); serialized != "" {
					meta.Attributes[key] = serialized
				}
			}
		}
		if meta.ID == "" {
			meta.ID = makeSlug(meta.Name)
		}
		if meta.Name == "" {
			meta.Name = "Unnamed Metamagic"
		}
		meta.Slug = makeSlug(meta.Name)
		if len(meta.Requirements) == 0 {
			meta.Requirements = nil
		}
		if len(meta.Bonus) == 0 {
			meta.Bonus = nil
		}
		if len(meta.Attributes) == 0 {
			meta.Attributes = nil
		}
		metamagics = append(metamagics, meta)
	}

	sort.Slice(metamagics, func(i, j int) bool {
		return metamagics[i].Name < metamagics[j].Name
	})
	return metamagics
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
