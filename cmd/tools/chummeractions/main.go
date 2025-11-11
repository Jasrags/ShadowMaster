package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"
)

type chummerActionsFile struct {
	Version string `json:"version"`
	Actions struct {
		Action []map[string]interface{} `json:"action"`
	} `json:"actions"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type CategoryMetadata struct {
	Name  string `json:"name"`
	Slug  string `json:"slug"`
	Count int    `json:"count"`
}

type NormalizedAction struct {
	ID              string              `json:"id"`
	Name            string              `json:"name"`
	Category        string              `json:"category,omitempty"`
	CategorySlug    string              `json:"category_slug,omitempty"`
	Type            string              `json:"type"`
	SpecName        string              `json:"spec_name,omitempty"`
	RequiresUnlock  bool                `json:"requires_unlock,omitempty"`
	InitiativeCost  int                 `json:"initiative_cost,omitempty"`
	EdgeCost        int                 `json:"edge_cost,omitempty"`
	Test            map[string]string   `json:"test,omitempty"`
	Boosts          []map[string]string `json:"boosts,omitempty"`
	SourceBook      string              `json:"source_book,omitempty"`
	SourcePage      string              `json:"source_page,omitempty"`
	AdditionalAttrs map[string]string   `json:"additional_attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source      SourceMetadata     `json:"source"`
		Categories  []CategoryMetadata `json:"categories"`
		ActionCount int                `json:"action_count"`
		GeneratedBy string             `json:"generated_by"`
	} `json:"metadata"`
	ActionsByCategory map[string][]NormalizedAction `json:"actions_by_category"`
}

const (
	inputPath  = "data/chummer/actions.json"
	outputPath = "data/editions/sr5/actions/all.json"
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

	var parsed chummerActionsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Actions.Action) == 0 {
		return errors.New("no actions found in input")
	}

	actionsByCategory := make(map[string][]NormalizedAction)

	for _, action := range parsed.Actions.Action {
		n := normalizeAction(action)
		category := n.Category
		if category == "" {
			category = "General"
			n.Category = category
			n.CategorySlug = makeSlug(category)
		}
		actionsByCategory[category] = append(actionsByCategory[category], n)
	}

	var categoryNames []string
	for name := range actionsByCategory {
		categoryNames = append(categoryNames, name)
	}
	sort.Strings(categoryNames)

	var categories []CategoryMetadata
	total := 0

	for _, name := range categoryNames {
		items := actionsByCategory[name]
		sort.Slice(items, func(i, j int) bool {
			if items[i].Name == items[j].Name {
				return items[i].ID < items[j].ID
			}
			return items[i].Name < items[j].Name
		})
		actionsByCategory[name] = items
		categories = append(categories, CategoryMetadata{
			Name:  name,
			Slug:  makeSlug(name),
			Count: len(items),
		})
		total += len(items)
	}

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Actions Dataset",
		Version:     parsed.Version,
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: total,
	}
	output.Metadata.Categories = categories
	output.Metadata.ActionCount = total
	output.Metadata.GeneratedBy = "cmd/tools/chummeractions (ShadowMaster)"
	output.ActionsByCategory = actionsByCategory

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

	fmt.Printf("Normalized %d actions into %s\n", total, outputPath)
	return nil
}

func normalizeAction(action map[string]interface{}) NormalizedAction {
	n := NormalizedAction{
		Test:            make(map[string]string),
		AdditionalAttrs: make(map[string]string),
	}

	for key, value := range action {
		switch key {
		case "id":
			n.ID = valueToString(value)
		case "name":
			n.Name = valueToString(value)
		case "category":
			n.Category = valueToString(value)
			if n.Category != "" {
				n.CategorySlug = makeSlug(n.Category)
			}
		case "type":
			n.Type = valueToString(value)
		case "specname":
			n.SpecName = valueToString(value)
		case "initiativecost":
			n.InitiativeCost = parseInt(valueToString(value))
		case "edgecost":
			n.EdgeCost = parseInt(valueToString(value))
		case "requireunlock":
			n.RequiresUnlock = parseBool(value)
		case "source":
			n.SourceBook = valueToString(value)
		case "page":
			n.SourcePage = valueToString(value)
		case "test":
			if m, ok := value.(map[string]interface{}); ok {
				for tk, tv := range m {
					str := valueToString(tv)
					if str != "" {
						n.Test[tk] = str
					}
				}
			}
		case "boosts":
			n.Boosts = normalizeBoosts(value)
		default:
			strVal := valueToString(value)
			if strVal != "" {
				n.AdditionalAttrs[key] = strVal
			}
		}
	}

	if len(n.Test) == 0 {
		n.Test = nil
	}
	if len(n.Boosts) == 0 {
		n.Boosts = nil
	}
	if len(n.AdditionalAttrs) == 0 {
		n.AdditionalAttrs = nil
	}
	if n.ID == "" {
		n.ID = makeSlug(n.Category, n.Name)
	}
	if n.Name == "" {
		n.Name = "Unnamed Action"
	}
	return n
}

func normalizeBoosts(value interface{}) []map[string]string {
	if value == nil {
		return nil
	}
	convert := func(v interface{}) map[string]string {
		result := make(map[string]string)
		if m, ok := v.(map[string]interface{}); ok {
			for k, val := range m {
				str := valueToString(val)
				if str != "" {
					result[k] = str
				}
			}
		}
		if len(result) == 0 {
			return nil
		}
		return result
	}

	var boosts []map[string]string

	switch v := value.(type) {
	case map[string]interface{}:
		if inner, exists := v["boost"]; exists {
			switch innerVal := inner.(type) {
			case []interface{}:
				for _, item := range innerVal {
					if converted := convert(item); converted != nil {
						boosts = append(boosts, converted)
					}
				}
			default:
				if converted := convert(innerVal); converted != nil {
					boosts = append(boosts, converted)
				}
			}
		} else {
			if converted := convert(v); converted != nil {
				boosts = append(boosts, converted)
			}
		}
	case []interface{}:
		for _, item := range v {
			if converted := convert(item); converted != nil {
				boosts = append(boosts, converted)
			}
		}
	default:
		if converted := convert(v); converted != nil {
			boosts = append(boosts, converted)
		}
	}

	return boosts
}

func parseInt(input string) int {
	input = strings.TrimSpace(input)
	if input == "" {
		return 0
	}
	val, err := strconv.Atoi(input)
	if err != nil {
		return 0
	}
	return val
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
