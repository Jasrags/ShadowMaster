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

type chummerLicensesFile struct {
	Licenses struct {
		License []interface{} `json:"license"`
	} `json:"licenses"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedLicense struct {
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type Output struct {
	Metadata struct {
		Source       SourceMetadata `json:"source"`
		GeneratedBy  string         `json:"generated_by"`
		LicenseCount int            `json:"license_count"`
	} `json:"metadata"`
	Licenses []NormalizedLicense `json:"licenses"`
}

const (
	inputPath  = "data/chummer/licenses.json"
	outputPath = "data/editions/sr5/licenses/all.json"
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

	var parsed chummerLicensesFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Licenses.License) == 0 {
		return errors.New("no licenses found")
	}

	licenses := normalizeLicenses(parsed.Licenses.License)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Licenses Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(licenses),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerlicenses (ShadowMaster)"
	output.Metadata.LicenseCount = len(licenses)
	output.Licenses = licenses

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

	fmt.Printf("Normalized %d licenses into %s\n", len(licenses), outputPath)
	return nil
}

func normalizeLicenses(raw []interface{}) []NormalizedLicense {
	var licenses []NormalizedLicense
	for _, entry := range raw {
		name := valueToString(entry)
		if name == "" {
			continue
		}
		licenses = append(licenses, NormalizedLicense{
			Name: name,
			Slug: makeSlug(name),
		})
	}

	sort.Slice(licenses, func(i, j int) bool {
		return licenses[i].Name < licenses[j].Name
	})

	return licenses
}

func valueToString(val interface{}) string {
	switch v := val.(type) {
	case nil:
		return ""
	case string:
		return strings.TrimSpace(v)
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
