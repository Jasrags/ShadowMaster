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

type chummerProgramsFile struct {
	Categories struct {
		Category []interface{} `json:"category"`
	} `json:"categories"`
	Programs struct {
		Program []map[string]interface{} `json:"program"`
	} `json:"programs"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedProgram struct {
	ID           string            `json:"id"`
	Name         string            `json:"name"`
	Slug         string            `json:"slug"`
	Category     string            `json:"category,omitempty"`
	CategorySlug string            `json:"category_slug,omitempty"`
	Availability string            `json:"availability,omitempty"`
	Cost         string            `json:"cost,omitempty"`
	Source       string            `json:"source,omitempty"`
	Page         string            `json:"page,omitempty"`
	Attributes   map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source        SourceMetadata `json:"source"`
		GeneratedBy   string         `json:"generated_by"`
		CategoryCount int            `json:"category_count"`
		ProgramCount  int            `json:"program_count"`
	} `json:"metadata"`
	Categories []string            `json:"categories"`
	Programs   []NormalizedProgram `json:"programs"`
}

const (
	inputPath  = "data/chummer/programs.json"
	outputPath = "data/editions/sr5/programs/all.json"
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

	var parsed chummerProgramsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Programs.Program) == 0 {
		return errors.New("no programs found")
	}

	categories := normalizeCategories(parsed.Categories.Category)
	programs := normalizePrograms(parsed.Programs.Program)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Programs Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(programs),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerprograms (ShadowMaster)"
	output.Metadata.CategoryCount = len(categories)
	output.Metadata.ProgramCount = len(programs)
	output.Categories = categories
	output.Programs = programs

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

	fmt.Printf("Normalized %d programs into %s\n", len(programs), outputPath)
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

func normalizePrograms(raw []map[string]interface{}) []NormalizedProgram {
	programs := make([]NormalizedProgram, 0, len(raw))
	for _, entry := range raw {
		program := NormalizedProgram{
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				program.ID = valueToString(val)
			case "name":
				program.Name = valueToString(val)
			case "category":
				program.Category = valueToString(val)
				program.CategorySlug = makeSlug(program.Category)
			case "avail":
				program.Availability = valueToString(val)
			case "cost":
				program.Cost = valueToString(val)
			case "source":
				program.Source = valueToString(val)
			case "page":
				program.Page = valueToString(val)
			default:
				if serialized := serializeValue(val); serialized != "" {
					program.Attributes[key] = serialized
				}
			}
		}
		if len(program.Attributes) == 0 {
			program.Attributes = nil
		}
		if program.ID == "" {
			program.ID = makeSlug(program.Name)
		}
		if program.Name == "" {
			program.Name = "Unnamed Program"
		}
		program.Slug = makeSlug(program.Name)
		programs = append(programs, program)
	}

	sort.Slice(programs, func(i, j int) bool {
		if programs[i].Category == programs[j].Category {
			return programs[i].Name < programs[j].Name
		}
		return programs[i].Category < programs[j].Category
	})
	return programs
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
