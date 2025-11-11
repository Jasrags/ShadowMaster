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

type chummerMartialArtsFile struct {
	MartialArts struct {
		MartialArt []map[string]interface{} `json:"martialart"`
	} `json:"martialarts"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedMartialArt struct {
	ID         string            `json:"id"`
	Name       string            `json:"name"`
	Slug       string            `json:"slug"`
	Source     string            `json:"source,omitempty"`
	Page       string            `json:"page,omitempty"`
	Techniques []string          `json:"techniques,omitempty"`
	Bonus      map[string]string `json:"bonus,omitempty"`
	Attributes map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source          SourceMetadata `json:"source"`
		GeneratedBy     string         `json:"generated_by"`
		MartialArtCount int            `json:"martial_art_count"`
	} `json:"metadata"`
	MartialArts []NormalizedMartialArt `json:"martial_arts"`
}

const (
	inputPath  = "data/chummer/martialarts.json"
	outputPath = "data/editions/sr5/martialarts/all.json"
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

	var parsed chummerMartialArtsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.MartialArts.MartialArt) == 0 {
		return errors.New("no martial arts found")
	}

	arts := normalizeMartialArts(parsed.MartialArts.MartialArt)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Martial Arts Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(arts),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummermartialarts (ShadowMaster)"
	output.Metadata.MartialArtCount = len(arts)
	output.MartialArts = arts

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

	fmt.Printf("Normalized %d martial arts into %s\n", len(arts), outputPath)
	return nil
}

func normalizeMartialArts(raw []map[string]interface{}) []NormalizedMartialArt {
	arts := make([]NormalizedMartialArt, 0, len(raw))
	for _, entry := range raw {
		art := NormalizedMartialArt{
			Bonus:      make(map[string]string),
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				art.ID = valueToString(val)
			case "name":
				art.Name = valueToString(val)
			case "source":
				art.Source = valueToString(val)
			case "page":
				art.Page = valueToString(val)
			case "techniques":
				art.Techniques = extractTechniques(val)
			case "bonus":
				if serialized := serializeValue(val); serialized != "" {
					art.Bonus["raw"] = serialized
				}
			default:
				if serialized := serializeValue(val); serialized != "" {
					art.Attributes[key] = serialized
				}
			}
		}
		if art.ID == "" {
			art.ID = makeSlug(art.Name)
		}
		if art.Name == "" {
			art.Name = "Unnamed Martial Art"
		}
		if art.Slug == "" {
			art.Slug = makeSlug(art.Name)
		}
		if len(art.Techniques) == 0 {
			art.Techniques = nil
		}
		if len(art.Bonus) == 0 {
			art.Bonus = nil
		}
		if len(art.Attributes) == 0 {
			art.Attributes = nil
		}
		arts = append(arts, art)
	}

	sort.Slice(arts, func(i, j int) bool {
		return arts[i].Name < arts[j].Name
	})
	return arts
}

func extractTechniques(value interface{}) []string {
	if value == nil {
		return nil
	}
	switch v := value.(type) {
	case map[string]interface{}:
		if raw, ok := v["technique"]; ok {
			return extractTechniques(raw)
		}
	case []interface{}:
		techniques := make([]string, 0, len(v))
		for _, item := range v {
			switch entry := item.(type) {
			case map[string]interface{}:
				name := valueToString(entry["name"])
				if name == "" {
					name = valueToString(entry["+content"])
				}
				if name != "" {
					techniques = append(techniques, name)
				}
			case string:
				if entry != "" {
					techniques = append(techniques, entry)
				}
			}
		}
		return techniques
	case string:
		if v != "" {
			return []string{v}
		}
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
