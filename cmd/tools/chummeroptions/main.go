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

type chummerOptionsFile struct {
	LimbCounts struct {
		Limb []map[string]interface{} `json:"limb"`
	} `json:"limbcounts"`
	PDFArguments struct {
		Argument []map[string]interface{} `json:"pdfargument"`
	} `json:"pdfarguments"`
	BlackMarketPipelineCategories struct {
		Category []interface{} `json:"category"`
	} `json:"blackmarketpipelinecategories"`
	AvailMap struct {
		Avail []map[string]interface{} `json:"avail"`
	} `json:"availmap"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type LimbCount struct {
	Name      string   `json:"name"`
	Slug      string   `json:"slug"`
	LimbCount string   `json:"limb_count"`
	Exclude   []string `json:"exclude,omitempty"`
}

type PDFArgument struct {
	Name     string   `json:"name"`
	Slug     string   `json:"slug"`
	Value    string   `json:"value"`
	AppNames []string `json:"app_names,omitempty"`
}

type AvailEntry struct {
	ID       string `json:"id"`
	Value    string `json:"value"`
	Duration string `json:"duration,omitempty"`
	Interval string `json:"interval,omitempty"`
}

type Output struct {
	Metadata struct {
		Source                   SourceMetadata `json:"source"`
		GeneratedBy              string         `json:"generated_by"`
		LimbCountTotal           int            `json:"limb_count_total"`
		PDFArgumentTotal         int            `json:"pdf_argument_total"`
		BlackMarketCategoryTotal int            `json:"black_market_category_total"`
		AvailEntryTotal          int            `json:"avail_entry_total"`
	} `json:"metadata"`
	LimbCounts                    []LimbCount   `json:"limb_counts"`
	PDFArguments                  []PDFArgument `json:"pdf_arguments"`
	BlackMarketPipelineCategories []string      `json:"black_market_pipeline_categories"`
	AvailMap                      []AvailEntry  `json:"avail_map"`
}

const (
	inputPath  = "data/chummer/options.json"
	outputPath = "data/editions/sr5/options/all.json"
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

	var parsed chummerOptionsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	limbCounts := normalizeLimbCounts(parsed.LimbCounts.Limb)
	pdfArguments := normalizePDFArguments(parsed.PDFArguments.Argument)
	categories := normalizeCategories(parsed.BlackMarketPipelineCategories.Category)
	avail := normalizeAvail(parsed.AvailMap.Avail)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Options Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(limbCounts) + len(pdfArguments) + len(categories) + len(avail),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummeroptions (ShadowMaster)"
	output.Metadata.LimbCountTotal = len(limbCounts)
	output.Metadata.PDFArgumentTotal = len(pdfArguments)
	output.Metadata.BlackMarketCategoryTotal = len(categories)
	output.Metadata.AvailEntryTotal = len(avail)

	output.LimbCounts = limbCounts
	output.PDFArguments = pdfArguments
	output.BlackMarketPipelineCategories = categories
	output.AvailMap = avail

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

	fmt.Printf("Normalized options into %s\n", outputPath)
	return nil
}

func normalizeLimbCounts(raw []map[string]interface{}) []LimbCount {
	result := make([]LimbCount, 0, len(raw))
	for _, entry := range raw {
		lc := LimbCount{
			Name:      valueToString(entry["name"]),
			LimbCount: valueToString(entry["limbcount"]),
		}
		if ex := valueToString(entry["exclude"]); ex != "" {
			parts := strings.Split(ex, ",")
			for _, part := range parts {
				trimmed := strings.TrimSpace(part)
				if trimmed != "" {
					lc.Exclude = append(lc.Exclude, trimmed)
				}
			}
		}
		if lc.Name == "" {
			lc.Name = fmt.Sprintf("%s limbs", lc.LimbCount)
		}
		lc.Slug = makeSlug(lc.Name)
		result = append(result, lc)
	}
	sort.Slice(result, func(i, j int) bool {
		return result[i].Slug < result[j].Slug
	})
	return result
}

func normalizePDFArguments(raw []map[string]interface{}) []PDFArgument {
	result := make([]PDFArgument, 0, len(raw))
	for _, entry := range raw {
		arg := PDFArgument{
			Name:  valueToString(entry["name"]),
			Value: valueToString(entry["value"]),
		}
		if arg.Name == "" {
			arg.Name = arg.Value
		}
		arg.Slug = makeSlug(arg.Name)
		if apps, ok := entry["appnames"]; ok {
			arg.AppNames = extractStringList(apps, "appname")
		}
		result = append(result, arg)
	}
	sort.Slice(result, func(i, j int) bool {
		return result[i].Slug < result[j].Slug
	})
	return result
}

func normalizeCategories(raw []interface{}) []string {
	if len(raw) == 0 {
		return nil
	}
	categories := make([]string, 0, len(raw))
	for _, entry := range raw {
		name := valueToString(entry)
		if name == "" {
			continue
		}
		categories = append(categories, name)
	}
	sort.Strings(categories)
	return categories
}

func normalizeAvail(raw []map[string]interface{}) []AvailEntry {
	result := make([]AvailEntry, 0, len(raw))
	for _, entry := range raw {
		avail := AvailEntry{
			ID:       valueToString(entry["id"]),
			Value:    valueToString(entry["value"]),
			Duration: valueToString(entry["duration"]),
			Interval: valueToString(entry["interval"]),
		}
		if avail.ID == "" && avail.Value == "" {
			continue
		}
		result = append(result, avail)
	}
	sort.Slice(result, func(i, j int) bool {
		if result[i].Value == result[j].Value {
			return result[i].ID < result[j].ID
		}
		return result[i].Value < result[j].Value
	})
	return result
}

func extractStringList(value interface{}, key string) []string {
	switch v := value.(type) {
	case map[string]interface{}:
		if key != "" {
			if raw, ok := v[key]; ok {
				return extractStringList(raw, "")
			}
		}
		var list []string
		for _, val := range v {
			list = append(list, extractStringList(val, "")...)
		}
		return list
	case []interface{}:
		list := make([]string, 0, len(v))
		for _, item := range v {
			list = append(list, extractStringList(item, "")...)
		}
		return list
	case string:
		if v == "" {
			return nil
		}
		return []string{v}
	}
	return nil
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
