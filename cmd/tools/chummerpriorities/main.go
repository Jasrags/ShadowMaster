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

type chummerPrioritiesFile struct {
	Categories struct {
		Category []interface{} `json:"category"`
	} `json:"categories"`
	PriorityTables struct {
		PriorityTable []interface{} `json:"prioritytable"`
	} `json:"prioritytables"`
	PrioritySumToTenValues map[string]string `json:"priortysumtotenvalues"`
	Priorities             struct {
		Priority []map[string]interface{} `json:"priority"`
	} `json:"priorities"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type PriorityMetavariant struct {
	Name  string            `json:"name"`
	Value string            `json:"value,omitempty"`
	Karma string            `json:"karma,omitempty"`
	Notes map[string]string `json:"notes,omitempty"`
}

type PriorityMetatype struct {
	Name         string                `json:"name"`
	Value        string                `json:"value,omitempty"`
	Karma        string                `json:"karma,omitempty"`
	Metavariants []PriorityMetavariant `json:"metavariants,omitempty"`
	Attributes   map[string]string     `json:"attributes,omitempty"`
}

type PriorityMagic struct {
	Type       string            `json:"type"`
	Rating     string            `json:"rating,omitempty"`
	Spells     string            `json:"spells,omitempty"`
	Sprites    string            `json:"sprites,omitempty"`
	Skills     string            `json:"skills,omitempty"`
	SkillGroup string            `json:"skill_group,omitempty"`
	Resonance  string            `json:"resonance,omitempty"`
	Notes      map[string]string `json:"notes,omitempty"`
	Attributes map[string]string `json:"attributes,omitempty"`
}

type PriorityEntry struct {
	ID           string             `json:"id"`
	Name         string             `json:"name"`
	Slug         string             `json:"slug"`
	Value        string             `json:"value"`
	Category     string             `json:"category"`
	CategorySlug string             `json:"category_slug"`
	Description  string             `json:"description,omitempty"`
	Notes        map[string]string  `json:"notes,omitempty"`
	Attributes   map[string]string  `json:"attributes,omitempty"`
	Metatypes    []PriorityMetatype `json:"metatypes,omitempty"`
	Magic        []PriorityMagic    `json:"magic_options,omitempty"`
}

type Output struct {
	Metadata struct {
		Source        SourceMetadata `json:"source"`
		GeneratedBy   string         `json:"generated_by"`
		CategoryCount int            `json:"category_count"`
		TableCount    int            `json:"table_count"`
		PriorityCount int            `json:"priority_count"`
	} `json:"metadata"`
	Categories []string          `json:"categories"`
	Tables     []string          `json:"tables"`
	SumToTen   map[string]string `json:"sum_to_ten_values"`
	Priorities []PriorityEntry   `json:"priorities"`
}

const (
	inputPath  = "data/chummer/priorities.json"
	outputPath = "data/editions/sr5/priorities/all.json"
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

	var parsed chummerPrioritiesFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Priorities.Priority) == 0 {
		return errors.New("no priorities found")
	}

	categories := normalizeStringList(parsed.Categories.Category)
	tables := normalizeStringList(parsed.PriorityTables.PriorityTable)
	priorities := normalizePriorities(parsed.Priorities.Priority)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Priority Tables Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(priorities),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerpriorities (ShadowMaster)"
	output.Metadata.CategoryCount = len(categories)
	output.Metadata.TableCount = len(tables)
	output.Metadata.PriorityCount = len(priorities)
	output.Categories = categories
	output.Tables = tables
	output.SumToTen = parsed.PrioritySumToTenValues
	output.Priorities = priorities

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

	fmt.Printf("Normalized %d priorities into %s\n", len(priorities), outputPath)
	return nil
}

func normalizeStringList(raw []interface{}) []string {
	if len(raw) == 0 {
		return nil
	}
	list := make([]string, 0, len(raw))
	for _, entry := range raw {
		if name := valueToString(entry); name != "" {
			list = append(list, name)
		}
	}
	sort.Strings(list)
	return list
}

func normalizePriorities(raw []map[string]interface{}) []PriorityEntry {
	entries := make([]PriorityEntry, 0, len(raw))
	for _, entry := range raw {
		priority := PriorityEntry{
			Notes:      make(map[string]string),
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				priority.ID = valueToString(val)
			case "name":
				priority.Name = valueToString(val)
			case "value":
				priority.Value = valueToString(val)
			case "category":
				priority.Category = valueToString(val)
				priority.CategorySlug = makeSlug(priority.Category)
			case "description":
				priority.Description = valueToString(val)
			case "notes":
				if serialized := serializeValue(val); serialized != "" {
					priority.Notes["raw"] = serialized
				}
			case "metatypes":
				priority.Metatypes = normalizeMetatypes(val)
			case "magic":
				priority.Magic = normalizeMagicOptions(val)
			default:
				if serialized := serializeValue(val); serialized != "" {
					priority.Attributes[key] = serialized
				}
			}
		}
		if len(priority.Notes) == 0 {
			priority.Notes = nil
		}
		if len(priority.Attributes) == 0 {
			priority.Attributes = nil
		}
		if priority.ID == "" {
			priority.ID = makeSlug(priority.Category, priority.Value)
		}
		if priority.Name == "" {
			priority.Name = fmt.Sprintf("%s - %s", priority.Value, priority.Category)
		}
		priority.Slug = makeSlug(priority.Name)
		entries = append(entries, priority)
	}
	sort.Slice(entries, func(i, j int) bool {
		if entries[i].Category == entries[j].Category {
			return entries[i].Value < entries[j].Value
		}
		return entries[i].Category < entries[j].Category
	})
	return entries
}

func normalizeMetatypes(value interface{}) []PriorityMetatype {
	if value == nil {
		return nil
	}
	switch v := value.(type) {
	case map[string]interface{}:
		if raw, ok := v["metatype"]; ok {
			return normalizeMetatypes(raw)
		}
		return []PriorityMetatype{parseMetatype(v)}
	case []interface{}:
		metatypes := make([]PriorityMetatype, 0, len(v))
		for _, item := range v {
			if m, ok := item.(map[string]interface{}); ok {
				metatypes = append(metatypes, parseMetatype(m))
			}
		}
		sort.Slice(metatypes, func(i, j int) bool {
			return metatypes[i].Name < metatypes[j].Name
		})
		return metatypes
	}
	return nil
}

func parseMetatype(entry map[string]interface{}) PriorityMetatype {
	meta := PriorityMetatype{
		Attributes: make(map[string]string),
	}
	meta.Name = valueToString(entry["name"])
	meta.Value = valueToString(entry["value"])
	meta.Karma = valueToString(entry["karma"])
	for key, val := range entry {
		if key == "name" || key == "value" || key == "karma" {
			continue
		}
		if key == "metavariants" {
			meta.Metavariants = normalizeMetavariants(val)
			continue
		}
		if serialized := serializeValue(val); serialized != "" {
			meta.Attributes[key] = serialized
		}
	}
	if len(meta.Attributes) == 0 {
		meta.Attributes = nil
	}
	return meta
}

func normalizeMetavariants(value interface{}) []PriorityMetavariant {
	if value == nil {
		return nil
	}
	switch v := value.(type) {
	case map[string]interface{}:
		if raw, ok := v["metavariant"]; ok {
			return normalizeMetavariants(raw)
		}
		return []PriorityMetavariant{parseMetavariant(v)}
	case []interface{}:
		variants := make([]PriorityMetavariant, 0, len(v))
		for _, item := range v {
			if m, ok := item.(map[string]interface{}); ok {
				variants = append(variants, parseMetavariant(m))
			}
		}
		sort.Slice(variants, func(i, j int) bool {
			return variants[i].Name < variants[j].Name
		})
		return variants
	}
	return nil
}

func parseMetavariant(entry map[string]interface{}) PriorityMetavariant {
	variant := PriorityMetavariant{
		Notes: make(map[string]string),
	}
	variant.Name = valueToString(entry["name"])
	variant.Value = valueToString(entry["value"])
	variant.Karma = valueToString(entry["karma"])
	for key, val := range entry {
		if key == "name" || key == "value" || key == "karma" {
			continue
		}
		if serialized := serializeValue(val); serialized != "" {
			variant.Notes[key] = serialized
		}
	}
	if len(variant.Notes) == 0 {
		variant.Notes = nil
	}
	return variant
}

func normalizeMagicOptions(value interface{}) []PriorityMagic {
	if value == nil {
		return nil
	}
	switch v := value.(type) {
	case map[string]interface{}:
		if raw, ok := v["spellcastingoption"]; ok {
			return normalizeMagicOptions(raw)
		}
		if raw, ok := v["magicalgate"]; ok {
			return normalizeMagicOptions(raw)
		}
		if raw, ok := v["magical"]; ok {
			return normalizeMagicOptions(raw)
		}
		return []PriorityMagic{parseMagicOption(v)}
	case []interface{}:
		options := make([]PriorityMagic, 0, len(v))
		for _, item := range v {
			if m, ok := item.(map[string]interface{}); ok {
				options = append(options, parseMagicOption(m))
			}
		}
		return options
	}
	return nil
}

func parseMagicOption(entry map[string]interface{}) PriorityMagic {
	option := PriorityMagic{
		Notes:      make(map[string]string),
		Attributes: make(map[string]string),
	}
	option.Type = valueToString(entry["name"])
	option.Rating = valueToString(entry["rating"])
	option.Spells = valueToString(entry["spells"])
	option.Sprites = valueToString(entry["sprites"])
	option.Skills = valueToString(entry["skills"])
	option.SkillGroup = valueToString(entry["skillgroup"])
	option.Resonance = valueToString(entry["resonance"])

	for key, val := range entry {
		if key == "name" || key == "rating" || key == "spells" || key == "sprites" || key == "skills" || key == "skillgroup" || key == "resonance" {
			continue
		}
		if serialized := serializeValue(val); serialized != "" {
			option.Attributes[key] = serialized
		}
	}
	if len(option.Notes) == 0 {
		option.Notes = nil
	}
	if len(option.Attributes) == 0 {
		option.Attributes = nil
	}
	return option
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
