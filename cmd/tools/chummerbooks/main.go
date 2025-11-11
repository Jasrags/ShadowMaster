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

type chummerBooksFile struct {
	Books struct {
		Book []map[string]interface{} `json:"book"`
	} `json:"books"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedMatch struct {
	Language string `json:"language"`
	Page     string `json:"page,omitempty"`
	Text     string `json:"text,omitempty"`
}

type NormalizedBook struct {
	ID          string            `json:"id"`
	Name        string            `json:"name"`
	Code        string            `json:"code"`
	Permanent   bool              `json:"permanent,omitempty"`
	Matches     []NormalizedMatch `json:"matches,omitempty"`
	Attributes  map[string]string `json:"attributes,omitempty"`
	SourceShort string            `json:"source_short,omitempty"`
}

type Output struct {
	Metadata struct {
		Source      SourceMetadata `json:"source"`
		GeneratedBy string         `json:"generated_by"`
	} `json:"metadata"`
	Books []NormalizedBook `json:"books"`
}

const (
	inputPath  = "data/chummer/books.json"
	outputPath = "data/editions/sr5/books/all.json"
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

	var parsed chummerBooksFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Books.Book) == 0 {
		return errors.New("no books found in source")
	}

	var books []NormalizedBook
	for _, book := range parsed.Books.Book {
		books = append(books, normalizeBook(book))
	}

	sort.Slice(books, func(i, j int) bool {
		switch strings.Compare(books[i].Code, books[j].Code) {
		case -1:
			return true
		case 1:
			return false
		default:
			return books[i].Name < books[j].Name
		}
	})

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Books Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(books),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerbooks (ShadowMaster)"
	output.Books = books

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

	fmt.Printf("Normalized %d books into %s\n", len(books), outputPath)
	return nil
}

func normalizeBook(book map[string]interface{}) NormalizedBook {
	n := NormalizedBook{
		Attributes: make(map[string]string),
	}

	for key, value := range book {
		switch key {
		case "id":
			n.ID = valueToString(value)
		case "name":
			n.Name = valueToString(value)
		case "code":
			n.Code = valueToString(value)
		case "permanent":
			n.Permanent = parseBool(value)
		case "matches":
			n.Matches = normalizeMatches(value)
		default:
			strVal := valueToString(value)
			if strVal != "" {
				n.Attributes[key] = strVal
			}
		}
	}

	if len(n.Attributes) == 0 {
		n.Attributes = nil
	}

	if n.ID == "" {
		n.ID = makeSlug(n.Code, n.Name)
	}
	if n.Name == "" {
		n.Name = "Unnamed Book"
	}

	return n
}

func normalizeMatches(value interface{}) []NormalizedMatch {
	if value == nil {
		return nil
	}

	appendMatch := func(raw map[string]interface{}, target *[]NormalizedMatch) {
		match := NormalizedMatch{
			Language: valueToString(raw["language"]),
			Page:     valueToString(raw["page"]),
			Text:     valueToString(raw["text"]),
		}
		if match.Language == "" && match.Page == "" && match.Text == "" {
			return
		}
		*target = append(*target, match)
	}

	var matches []NormalizedMatch

	switch v := value.(type) {
	case map[string]interface{}:
		if inner, ok := v["match"]; ok {
			switch innerVal := inner.(type) {
			case []interface{}:
				for _, item := range innerVal {
					if asMap, ok := item.(map[string]interface{}); ok {
						appendMatch(asMap, &matches)
					}
				}
			case map[string]interface{}:
				appendMatch(innerVal, &matches)
			}
		} else {
			appendMatch(v, &matches)
		}
	case []interface{}:
		for _, item := range v {
			if asMap, ok := item.(map[string]interface{}); ok {
				appendMatch(asMap, &matches)
			}
		}
	}

	return matches
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

func parseBool(value interface{}) bool {
	switch v := value.(type) {
	case bool:
		return v
	case string:
		v = strings.TrimSpace(strings.ToLower(v))
		return v == "true" || v == "1" || v == "yes"
	default:
		return false
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
