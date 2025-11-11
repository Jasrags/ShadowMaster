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

type chummerMetatypesFile struct {
	Categories struct {
		Category []interface{} `json:"category"`
	} `json:"categories"`
	Metatypes struct {
		Metatype []map[string]interface{} `json:"metatype"`
	} `json:"metatypes"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type AttributeRange struct {
	Min string `json:"min,omitempty"`
	Max string `json:"max,omitempty"`
	Aug string `json:"aug,omitempty"`
}

type NormalizedQualities struct {
	Positive []string `json:"positive,omitempty"`
	Negative []string `json:"negative,omitempty"`
}

type MovementProfile struct {
	Walk   string `json:"walk,omitempty"`
	Run    string `json:"run,omitempty"`
	Sprint string `json:"sprint,omitempty"`
}

type NormalizedMetatype struct {
	ID            string                    `json:"id"`
	Name          string                    `json:"name"`
	Slug          string                    `json:"slug"`
	Category      string                    `json:"category,omitempty"`
	CategorySlug  string                    `json:"category_slug,omitempty"`
	Karma         string                    `json:"karma,omitempty"`
	Attributes    map[string]AttributeRange `json:"attributes,omitempty"`
	Movement      *MovementProfile          `json:"movement,omitempty"`
	Qualities     *NormalizedQualities      `json:"qualities,omitempty"`
	Bonus         map[string]string         `json:"bonus,omitempty"`
	Source        string                    `json:"source,omitempty"`
	Page          string                    `json:"page,omitempty"`
	Metavariants  []NormalizedMetatype      `json:"metavariants,omitempty"`
	AttributesRaw map[string]string         `json:"attributes_raw,omitempty"`
}

type NormalizedCategory struct {
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type Output struct {
	Metadata struct {
		Source        SourceMetadata `json:"source"`
		GeneratedBy   string         `json:"generated_by"`
		CategoryCount int            `json:"category_count"`
		MetatypeCount int            `json:"metatype_count"`
	} `json:"metadata"`
	Categories []NormalizedCategory `json:"categories"`
	Metatypes  []NormalizedMetatype `json:"metatypes"`
}

const (
	inputPath  = "data/chummer/metatypes.json"
	outputPath = "data/editions/sr5/metatypes/all.json"
)

var attributeSpecs = []struct {
	Prefix string
	Name   string
}{
	{"bod", "body"},
	{"agi", "agility"},
	{"rea", "reaction"},
	{"str", "strength"},
	{"cha", "charisma"},
	{"int", "intuition"},
	{"log", "logic"},
	{"wil", "willpower"},
	{"ini", "initiative"},
	{"edg", "edge"},
	{"mag", "magic"},
	{"res", "resonance"},
	{"ess", "essence"},
	{"dep", "depth"},
}

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

	var parsed chummerMetatypesFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Metatypes.Metatype) == 0 {
		return errors.New("no metatypes found")
	}

	categories := normalizeCategories(parsed.Categories.Category)
	metatypes := normalizeMetatypes(parsed.Metatypes.Metatype)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Metatypes Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(metatypes),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummermetatypes (ShadowMaster)"
	output.Metadata.CategoryCount = len(categories)
	output.Metadata.MetatypeCount = len(metatypes)
	output.Categories = categories
	output.Metatypes = metatypes

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

	fmt.Printf("Normalized %d metatypes into %s\n", len(metatypes), outputPath)
	return nil
}

func normalizeCategories(raw []interface{}) []NormalizedCategory {
	if len(raw) == 0 {
		return nil
	}
	categories := make([]NormalizedCategory, 0, len(raw))
	for _, entry := range raw {
		name := valueToString(entry)
		if name == "" {
			continue
		}
		categories = append(categories, NormalizedCategory{
			Name: name,
			Slug: makeSlug(name),
		})
	}
	sort.Slice(categories, func(i, j int) bool {
		return categories[i].Name < categories[j].Name
	})
	return categories
}

func normalizeMetatypes(raw []map[string]interface{}) []NormalizedMetatype {
	metatypes := make([]NormalizedMetatype, 0, len(raw))
	for _, entry := range raw {
		metatypes = append(metatypes, normalizeMetatype(entry))
	}
	sort.Slice(metatypes, func(i, j int) bool {
		if metatypes[i].Category == metatypes[j].Category {
			return metatypes[i].Name < metatypes[j].Name
		}
		return metatypes[i].Category < metatypes[j].Category
	})
	return metatypes
}

func normalizeMetatype(entry map[string]interface{}) NormalizedMetatype {
	metatype := NormalizedMetatype{
		Attributes:    make(map[string]AttributeRange),
		Bonus:         make(map[string]string),
		AttributesRaw: make(map[string]string),
	}

	handled := map[string]struct{}{}

	set := func(key string) { handled[key] = struct{}{} }

	if id, ok := entry["id"]; ok {
		metatype.ID = valueToString(id)
		set("id")
	}
	if name, ok := entry["name"]; ok {
		metatype.Name = valueToString(name)
		set("name")
	}
	if karma, ok := entry["karma"]; ok {
		metatype.Karma = valueToString(karma)
		set("karma")
	}
	if category, ok := entry["category"]; ok {
		metatype.Category = valueToString(category)
		metatype.CategorySlug = makeSlug(metatype.Category)
		set("category")
	}

	for _, spec := range attributeSpecs {
		min := valueToString(entry[spec.Prefix+"min"])
		max := valueToString(entry[spec.Prefix+"max"])
		aug := valueToString(entry[spec.Prefix+"aug"])
		if min != "" || max != "" || aug != "" {
			metatype.Attributes[spec.Name] = AttributeRange{Min: min, Max: max, Aug: aug}
		}
		set(spec.Prefix + "min")
		set(spec.Prefix + "max")
		set(spec.Prefix + "aug")
	}

	walk := valueToString(entry["walk"])
	run := valueToString(entry["run"])
	sprint := valueToString(entry["sprint"])
	if walk != "" || run != "" || sprint != "" {
		metatype.Movement = &MovementProfile{Walk: walk, Run: run, Sprint: sprint}
	}
	set("walk")
	set("run")
	set("sprint")

	if bonus, ok := entry["bonus"]; ok {
		if serialized := serializeValue(bonus); serialized != "" {
			metatype.Bonus["raw"] = serialized
		}
		set("bonus")
	}

	if qualities, ok := entry["qualities"]; ok {
		metatype.Qualities = normalizeQualities(qualities)
		set("qualities")
	}

	if source, ok := entry["source"]; ok {
		metatype.Source = valueToString(source)
		set("source")
	}
	if page, ok := entry["page"]; ok {
		metatype.Page = valueToString(page)
		set("page")
	}

	if metavariants, ok := entry["metavariants"]; ok {
		metatype.Metavariants = normalizeMetavariants(metavariants)
		set("metavariants")
	}

	for key, val := range entry {
		if _, already := handled[key]; already {
			continue
		}
		if serialized := serializeValue(val); serialized != "" {
			metatype.AttributesRaw[key] = serialized
		}
	}

	if len(metatype.AttributesRaw) == 0 {
		metatype.AttributesRaw = nil
	}
	if len(metatype.Attributes) == 0 {
		metatype.Attributes = nil
	}
	if len(metatype.Bonus) == 0 {
		metatype.Bonus = nil
	}

	if metatype.ID == "" {
		metatype.ID = makeSlug(metatype.Name)
	}
	if metatype.Name == "" {
		metatype.Name = "Unnamed Metatype"
	}
	metatype.Slug = makeSlug(metatype.Name)

	return metatype
}

func normalizeMetavariants(value interface{}) []NormalizedMetatype {
	if value == nil {
		return nil
	}
	switch v := value.(type) {
	case map[string]interface{}:
		if raw, ok := v["metavariant"]; ok {
			return normalizeMetavariants(raw)
		}
		// treat as single metavariant object
		return []NormalizedMetatype{normalizeMetatype(v)}
	case []interface{}:
		variants := make([]NormalizedMetatype, 0, len(v))
		for _, item := range v {
			if m, ok := item.(map[string]interface{}); ok {
				variants = append(variants, normalizeMetatype(m))
			}
		}
		sort.Slice(variants, func(i, j int) bool {
			if variants[i].Category == variants[j].Category {
				return variants[i].Name < variants[j].Name
			}
			return variants[i].Category < variants[j].Category
		})
		return variants
	}
	return nil
}

func normalizeQualities(value interface{}) *NormalizedQualities {
	if value == nil {
		return nil
	}
	result := &NormalizedQualities{}
	switch v := value.(type) {
	case map[string]interface{}:
		if pos, ok := v["positive"]; ok {
			result.Positive = extractQualities(pos)
		}
		if neg, ok := v["negative"]; ok {
			result.Negative = extractQualities(neg)
		}
	default:
		result.Positive = extractQualities(v)
	}
	if len(result.Positive) == 0 && len(result.Negative) == 0 {
		return nil
	}
	return result
}

func extractQualities(value interface{}) []string {
	switch v := value.(type) {
	case map[string]interface{}:
		if raw, ok := v["quality"]; ok {
			return extractQualities(raw)
		}
		if content := valueToString(v["+content"]); content != "" {
			sel := valueToString(v["+@select"])
			if sel != "" {
				return []string{fmt.Sprintf("%s (%s)", content, sel)}
			}
			return []string{content}
		}
		var list []string
		for key, val := range v {
			if strings.HasPrefix(key, "quality") {
				list = append(list, valueToString(val))
			}
		}
		for _, val := range v {
			list = append(list, extractQualities(val)...)
		}
		return uniqueStrings(list)
	case []interface{}:
		list := make([]string, 0, len(v))
		for _, item := range v {
			list = append(list, extractQualities(item)...)
		}
		return uniqueStrings(list)
	case string:
		if v == "" {
			return nil
		}
		return []string{v}
	}
	return nil
}

func uniqueStrings(values []string) []string {
	seen := make(map[string]struct{}, len(values))
	var result []string
	for _, v := range values {
		v = strings.TrimSpace(v)
		if v == "" {
			continue
		}
		if _, ok := seen[v]; ok {
			continue
		}
		seen[v] = struct{}{}
		result = append(result, v)
	}
	sort.Strings(result)
	return result
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
