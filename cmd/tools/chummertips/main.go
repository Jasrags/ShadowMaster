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

type chummerTipsFile struct {
	Tips struct {
		Tip []map[string]interface{} `json:"tip"`
	} `json:"tips"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type TipEntry struct {
	ID          string            `json:"id"`
	Text        string            `json:"text"`
	ChargenOnly bool              `json:"chargen_only"`
	CareerOnly  bool              `json:"career_only"`
	Required    map[string]string `json:"required,omitempty"`
	Forbidden   map[string]string `json:"forbidden,omitempty"`
	Attributes  map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source      SourceMetadata `json:"source"`
		GeneratedBy string         `json:"generated_by"`
		TipCount    int            `json:"tip_count"`
	} `json:"metadata"`
	Tips []TipEntry `json:"tips"`
}

const (
	inputPath  = "data/chummer/tips.json"
	outputPath = "data/editions/sr5/tips/all.json"
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

	var parsed chummerTipsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Tips.Tip) == 0 {
		return errors.New("no tips found")
	}

	tips := normalizeTips(parsed.Tips.Tip)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Tips Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(tips),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummertips (ShadowMaster)"
	output.Metadata.TipCount = len(tips)
	output.Tips = tips

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

	fmt.Printf("Normalized %d tips into %s\n", len(tips), outputPath)
	return nil
}

func normalizeTips(raw []map[string]interface{}) []TipEntry {
	tips := make([]TipEntry, 0, len(raw))
	for _, entry := range raw {
		tip := TipEntry{
			Required:   make(map[string]string),
			Forbidden:  make(map[string]string),
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				tip.ID = valueToString(val)
			case "text":
				tip.Text = valueToString(val)
			case "chargenonly":
				tip.ChargenOnly = parseBool(val)
			case "careeronly":
				tip.CareerOnly = parseBool(val)
			case "required":
				if serialized := serializeValue(val); serialized != "" {
					tip.Required["raw"] = serialized
				}
			case "forbidden":
				if serialized := serializeValue(val); serialized != "" {
					tip.Forbidden["raw"] = serialized
				}
			default:
				if serialized := serializeValue(val); serialized != "" {
					tip.Attributes[key] = serialized
				}
			}
		}
		if tip.ID == "" {
			tip.ID = makeSlug(tip.Text)
		}
		if tip.Text == "" {
			tip.Text = "Unnamed Tip"
		}
		if len(tip.Required) == 0 {
			tip.Required = nil
		}
		if len(tip.Forbidden) == 0 {
			tip.Forbidden = nil
		}
		if len(tip.Attributes) == 0 {
			tip.Attributes = nil
		}
		tips = append(tips, tip)
	}

	sort.Slice(tips, func(i, j int) bool {
		return tips[i].Text < tips[j].Text
	})
	return tips
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
