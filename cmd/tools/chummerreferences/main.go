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

type chummerReferencesFile struct {
	Rules struct {
		Rule []map[string]interface{} `json:"rule"`
	} `json:"rules"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedReference struct {
	ID         string            `json:"id"`
	Name       string            `json:"name"`
	Slug       string            `json:"slug"`
	Source     string            `json:"source,omitempty"`
	Page       string            `json:"page,omitempty"`
	Section    string            `json:"section,omitempty"`
	Subsection string            `json:"subsection,omitempty"`
	Attributes map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source         SourceMetadata `json:"source"`
		GeneratedBy    string         `json:"generated_by"`
		ReferenceCount int            `json:"reference_count"`
	} `json:"metadata"`
	References []NormalizedReference `json:"references"`
}

const (
	inputPath  = "data/chummer/references.json"
	outputPath = "data/editions/sr5/references/all.json"
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

	var parsed chummerReferencesFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Rules.Rule) == 0 {
		return errors.New("no references found")
	}

	refs := normalizeReferences(parsed.Rules.Rule)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 References Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(refs),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerreferences (ShadowMaster)"
	output.Metadata.ReferenceCount = len(refs)
	output.References = refs

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

	fmt.Printf("Normalized %d references into %s\n", len(refs), outputPath)
	return nil
}

func normalizeReferences(raw []map[string]interface{}) []NormalizedReference {
	refs := make([]NormalizedReference, 0, len(raw))
	for _, entry := range raw {
		ref := NormalizedReference{
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch strings.ToLower(key) {
			case "id":
				ref.ID = valueToString(val)
			case "name":
				ref.Name = valueToString(val)
			case "source":
				ref.Source = valueToString(val)
			case "page":
				ref.Page = valueToString(val)
			case "section":
				ref.Section = valueToString(val)
			case "subsection":
				ref.Subsection = valueToString(val)
			default:
				if serialized := serializeValue(val); serialized != "" {
					ref.Attributes[key] = serialized
				}
			}
		}
		if ref.ID == "" {
			ref.ID = makeSlug(ref.Name)
		}
		if ref.Name == "" {
			ref.Name = "Unnamed Reference"
		}
		ref.Slug = makeSlug(ref.Name)
		if len(ref.Attributes) == 0 {
			ref.Attributes = nil
		}
		refs = append(refs, ref)
	}

	sort.Slice(refs, func(i, j int) bool {
		if refs[i].Source == refs[j].Source {
			return refs[i].Page < refs[j].Page
		}
		return refs[i].Source < refs[j].Source
	})
	return refs
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
