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

type chummerSheetsFile struct {
	Sheets []struct {
		Lang  string                   `json:"+@lang"`
		Sheet []map[string]interface{} `json:"sheet"`
	} `json:"sheets"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedSheet struct {
	ID         string            `json:"id"`
	Name       string            `json:"name"`
	Slug       string            `json:"slug"`
	Filename   string            `json:"filename"`
	Language   string            `json:"language"`
	Attributes map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source      SourceMetadata `json:"source"`
		GeneratedBy string         `json:"generated_by"`
		SheetCount  int            `json:"sheet_count"`
		Languages   []string       `json:"languages"`
	} `json:"metadata"`
	Sheets []NormalizedSheet `json:"sheets"`
}

const (
	inputPath  = "data/chummer/sheets.json"
	outputPath = "data/editions/sr5/sheets/all.json"
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

	var parsed chummerSheetsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	sheets, languages := normalizeSheets(parsed.Sheets)
	if len(sheets) == 0 {
		return errors.New("no sheets found")
	}

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Sheets Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(sheets),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummersheets (ShadowMaster)"
	output.Metadata.SheetCount = len(sheets)
	output.Metadata.Languages = languages
	output.Sheets = sheets

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

	fmt.Printf("Normalized %d sheets into %s\n", len(sheets), outputPath)
	return nil
}

func normalizeSheets(raw []struct {
	Lang  string                   `json:"+@lang"`
	Sheet []map[string]interface{} `json:"sheet"`
}) ([]NormalizedSheet, []string) {
	var sheets []NormalizedSheet
	langSet := make(map[string]struct{})

	for _, group := range raw {
		language := group.Lang
		if language == "" {
			language = "en-us"
		}
		langSet[language] = struct{}{}
		for _, entry := range group.Sheet {
			sheet := NormalizedSheet{
				Attributes: make(map[string]string),
				Language:   language,
			}
			for key, val := range entry {
				switch key {
				case "id":
					sheet.ID = valueToString(val)
				case "name":
					sheet.Name = valueToString(val)
				case "filename":
					sheet.Filename = valueToString(val)
				default:
					if serialized := serializeValue(val); serialized != "" {
						sheet.Attributes[key] = serialized
					}
				}
			}
			if sheet.ID == "" {
				sheet.ID = makeSlug(sheet.Filename, sheet.Language)
			}
			if sheet.Name == "" {
				sheet.Name = sheet.Filename
			}
			sheet.Slug = makeSlug(sheet.Name, sheet.Language)
			if len(sheet.Attributes) == 0 {
				sheet.Attributes = nil
			}
			sheets = append(sheets, sheet)
		}
	}

	sort.Slice(sheets, func(i, j int) bool {
		if sheets[i].Language == sheets[j].Language {
			return sheets[i].Name < sheets[j].Name
		}
		return sheets[i].Language < sheets[j].Language
	})

	languages := make([]string, 0, len(langSet))
	for lang := range langSet {
		languages = append(languages, lang)
	}
	sort.Strings(languages)

	return sheets, languages
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
