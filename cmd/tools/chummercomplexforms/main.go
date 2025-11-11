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

type chummerComplexFormsFile struct {
	ComplexForms struct {
		ComplexForm []map[string]interface{} `json:"complexform"`
	} `json:"complexforms"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedComplexForm struct {
	ID         string            `json:"id"`
	Name       string            `json:"name"`
	Target     string            `json:"target,omitempty"`
	Duration   string            `json:"duration,omitempty"`
	ForceValue string            `json:"force_value,omitempty"`
	SourceBook string            `json:"source_book,omitempty"`
	SourcePage string            `json:"source_page,omitempty"`
	Attributes map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source      SourceMetadata `json:"source"`
		GeneratedBy string         `json:"generated_by"`
		FormCount   int            `json:"form_count"`
	} `json:"metadata"`
	ComplexForms []NormalizedComplexForm `json:"complex_forms"`
}

const (
	inputPath  = "data/chummer/complexforms.json"
	outputPath = "data/editions/sr5/complexforms/all.json"
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

	var parsed chummerComplexFormsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.ComplexForms.ComplexForm) == 0 {
		return errors.New("no complex forms found")
	}

	forms := normalizeForms(parsed.ComplexForms.ComplexForm)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Complex Forms Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(forms),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummercomplexforms (ShadowMaster)"
	output.Metadata.FormCount = len(forms)
	output.ComplexForms = forms

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

	fmt.Printf("Normalized %d complex forms into %s\n", len(forms), outputPath)
	return nil
}

func normalizeForms(raw []map[string]interface{}) []NormalizedComplexForm {
	var forms []NormalizedComplexForm
	for _, entry := range raw {
		form := NormalizedComplexForm{
			Attributes: make(map[string]string),
		}
		for key, value := range entry {
			switch key {
			case "id":
				form.ID = valueToString(value)
			case "name":
				form.Name = valueToString(value)
			case "target":
				form.Target = valueToString(value)
			case "duration":
				form.Duration = valueToString(value)
			case "fv":
				form.ForceValue = valueToString(value)
			case "source":
				form.SourceBook = valueToString(value)
			case "page":
				form.SourcePage = valueToString(value)
			default:
				if str := serializeValue(value); str != "" {
					form.Attributes[key] = str
				}
			}
		}
		if len(form.Attributes) == 0 {
			form.Attributes = nil
		}
		if form.ID == "" {
			form.ID = makeSlug(form.Name)
		}
		if form.Name == "" {
			form.Name = "Unnamed Complex Form"
		}
		forms = append(forms, form)
	}

	sort.Slice(forms, func(i, j int) bool {
		return forms[i].Name < forms[j].Name
	})
	return forms
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
