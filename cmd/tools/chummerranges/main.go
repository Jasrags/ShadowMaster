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

type chummerRangesFile struct {
	Modifiers map[string]string `json:"modifiers"`
	Ranges    struct {
		Range []map[string]interface{} `json:"range"`
	} `json:"ranges"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type RangeBand struct {
	Min     string            `json:"min,omitempty"`
	Short   string            `json:"short,omitempty"`
	Medium  string            `json:"medium,omitempty"`
	Long    string            `json:"long,omitempty"`
	Extreme string            `json:"extreme,omitempty"`
	Notes   map[string]string `json:"notes,omitempty"`
}

type NormalizedRange struct {
	Name string    `json:"name"`
	Slug string    `json:"slug"`
	Band RangeBand `json:"band"`
}

type Output struct {
	Metadata struct {
		Source      SourceMetadata `json:"source"`
		GeneratedBy string         `json:"generated_by"`
		RangeCount  int            `json:"range_count"`
	} `json:"metadata"`
	Modifiers map[string]string `json:"modifiers"`
	Ranges    []NormalizedRange `json:"ranges"`
}

const (
	inputPath  = "data/chummer/ranges.json"
	outputPath = "data/editions/sr5/ranges/all.json"
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

	var parsed chummerRangesFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Ranges.Range) == 0 {
		return errors.New("no ranges found")
	}

	ranges := normalizeRanges(parsed.Ranges.Range)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Range Bands Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(ranges),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerranges (ShadowMaster)"
	output.Metadata.RangeCount = len(ranges)
	output.Modifiers = parsed.Modifiers
	output.Ranges = ranges

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

	fmt.Printf("Normalized %d ranges into %s\n", len(ranges), outputPath)
	return nil
}

func normalizeRanges(raw []map[string]interface{}) []NormalizedRange {
	ranges := make([]NormalizedRange, 0, len(raw))
	for _, entry := range raw {
		band := RangeBand{Notes: make(map[string]string)}
		rng := NormalizedRange{}
		for key, val := range entry {
			switch key {
			case "name":
				rng.Name = valueToString(val)
			case "min":
				band.Min = valueToString(val)
			case "short":
				band.Short = valueToString(val)
			case "medium":
				band.Medium = valueToString(val)
			case "long":
				band.Long = valueToString(val)
			case "extreme":
				band.Extreme = valueToString(val)
			default:
				if serialized := serializeValue(val); serialized != "" {
					band.Notes[key] = serialized
				}
			}
		}
		if len(band.Notes) == 0 {
			band.Notes = nil
		}
		if rng.Name == "" {
			rng.Name = "Unnamed Range"
		}
		rng.Slug = makeSlug(rng.Name)
		rng.Band = band
		ranges = append(ranges, rng)
	}

	sort.Slice(ranges, func(i, j int) bool {
		return ranges[i].Name < ranges[j].Name
	})
	return ranges
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
