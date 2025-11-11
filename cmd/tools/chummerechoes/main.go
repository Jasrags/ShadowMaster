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

type chummerEchoesFile struct {
	Echoes struct {
		Echo []map[string]interface{} `json:"echo"`
	} `json:"echoes"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedEcho struct {
	ID         string            `json:"id"`
	Name       string            `json:"name"`
	SourceBook string            `json:"source_book,omitempty"`
	SourcePage string            `json:"source_page,omitempty"`
	Limit      string            `json:"limit,omitempty"`
	Attributes map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source      SourceMetadata `json:"source"`
		GeneratedBy string         `json:"generated_by"`
		EchoCount   int            `json:"echo_count"`
	} `json:"metadata"`
	Echoes []NormalizedEcho `json:"echoes"`
}

const (
	inputPath  = "data/chummer/echoes.json"
	outputPath = "data/editions/sr5/echoes/all.json"
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

	var parsed chummerEchoesFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Echoes.Echo) == 0 {
		return errors.New("no echoes found")
	}

	echoes := normalizeEchoes(parsed.Echoes.Echo)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Echoes Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(echoes),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerechoes (ShadowMaster)"
	output.Metadata.EchoCount = len(echoes)
	output.Echoes = echoes

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

	fmt.Printf("Normalized %d echoes into %s\n", len(echoes), outputPath)
	return nil
}

func normalizeEchoes(raw []map[string]interface{}) []NormalizedEcho {
	var echoes []NormalizedEcho
	for _, entry := range raw {
		echo := NormalizedEcho{
			Attributes: make(map[string]string),
		}
		for key, value := range entry {
			switch key {
			case "id":
				echo.ID = valueToString(value)
			case "name":
				echo.Name = valueToString(value)
			case "source":
				echo.SourceBook = valueToString(value)
			case "page":
				echo.SourcePage = valueToString(value)
			case "limit":
				echo.Limit = valueToString(value)
			default:
				if str := serializeValue(value); str != "" {
					echo.Attributes[key] = str
				}
			}
		}
		if len(echo.Attributes) == 0 {
			echo.Attributes = nil
		}
		if echo.ID == "" {
			echo.ID = makeSlug(echo.Name)
		}
		if echo.Name == "" {
			echo.Name = "Unnamed Echo"
		}
		echoes = append(echoes, echo)
	}

	sort.Slice(echoes, func(i, j int) bool {
		return echoes[i].Name < echoes[j].Name
	})

	return echoes
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
