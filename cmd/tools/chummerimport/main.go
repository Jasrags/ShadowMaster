package main

import (
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type metadata struct {
	Source      string `json:"source"`
	Dataset     string `json:"dataset"`
	ExtractedAt string `json:"extracted_at"`
	InputBytes  int    `json:"input_bytes"`
}

type output struct {
	Metadata metadata    `json:"metadata"`
	Data     interface{} `json:"data"`
}

func main() {
	var (
		inputPath  string
		outputPath string
		dataset    string
	)

	flag.StringVar(&inputPath, "input", "", "Path to source JSON file (required)")
	flag.StringVar(&outputPath, "output", "", "Path to write normalized JSON (required)")
	flag.StringVar(&dataset, "dataset", "", "Dataset name override (optional)")
	flag.Parse()

	if inputPath == "" || outputPath == "" {
		fmt.Fprintln(os.Stderr, "input and output flags are required")
		flag.Usage()
		os.Exit(2)
	}

	rawBytes, err := os.ReadFile(inputPath)
	if err != nil {
		exitErr(fmt.Errorf("read input: %w", err))
	}

	var data interface{}
	if err := json.Unmarshal(rawBytes, &data); err != nil {
		exitErr(fmt.Errorf("decode json: %w", err))
	}

	if dataset == "" {
		base := filepath.Base(inputPath)
		dataset = strings.TrimSuffix(base, filepath.Ext(base))
		if dataset == "" {
			exitErr(errors.New("unable to derive dataset name"))
		}
	}

	out := output{
		Metadata: metadata{
			Source:      filepath.ToSlash(inputPath),
			Dataset:     dataset,
			ExtractedAt: time.Now().UTC().Format(time.RFC3339),
			InputBytes:  len(rawBytes),
		},
		Data: data,
	}

	normalized, err := json.MarshalIndent(out, "", "  ")
	if err != nil {
		exitErr(fmt.Errorf("encode output: %w", err))
	}

	if err := ensureDir(filepath.Dir(outputPath)); err != nil {
		exitErr(err)
	}

	if err := os.WriteFile(outputPath, normalized, 0o644); err != nil {
		exitErr(fmt.Errorf("write output: %w", err))
	}

	fmt.Printf("Imported %s -> %s\n", inputPath, outputPath)
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

func exitErr(err error) {
	fmt.Fprintf(os.Stderr, "error: %v\n", err)
	os.Exit(1)
}
