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

type chummerStringsFile struct {
	MatrixAttributes struct {
		Keys []string `json:"key"`
	} `json:"matrixattributes"`
	Elements struct {
		Element []string `json:"element"`
	} `json:"elements"`
	Immunities struct {
		Immunity []string `json:"immunity"`
	} `json:"immunities"`
	SpiritCategories struct {
		Category []string `json:"category"`
	} `json:"spiritcategories"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
}

type Output struct {
	Metadata struct {
		Source      SourceMetadata `json:"source"`
		GeneratedBy string         `json:"generated_by"`
	} `json:"metadata"`
	MatrixAttributes []string `json:"matrix_attributes"`
	Elements         []string `json:"elements"`
	Immunities       []string `json:"immunities"`
	SpiritCategories []string `json:"spirit_categories"`
}

const (
	inputPath  = "data/chummer/strings.json"
	outputPath = "data/editions/sr5/strings/all.json"
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

	var parsed chummerStringsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.MatrixAttributes.Keys) == 0 && len(parsed.Elements.Element) == 0 && len(parsed.Immunities.Immunity) == 0 && len(parsed.SpiritCategories.Category) == 0 {
		return errors.New("no strings found")
	}

	matrixAttributes := normalizeList(parsed.MatrixAttributes.Keys)
	elements := normalizeList(parsed.Elements.Element)
	immunities := normalizeList(parsed.Immunities.Immunity)
	spiritCategories := normalizeList(parsed.SpiritCategories.Category)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Strings Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerstrings (ShadowMaster)"
	output.MatrixAttributes = matrixAttributes
	output.Elements = elements
	output.Immunities = immunities
	output.SpiritCategories = spiritCategories

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

	fmt.Printf("Normalized strings data into %s\n", outputPath)
	return nil
}

func normalizeList(raw []string) []string {
	list := make([]string, 0, len(raw))
	for _, item := range raw {
		trimmed := strings.TrimSpace(item)
		if trimmed != "" {
			list = append(list, trimmed)
		}
	}
	sort.Strings(list)
	return list
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
