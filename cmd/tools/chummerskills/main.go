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

type chummerSkillsFile struct {
	SkillGroups struct {
		Names []string `json:"name"`
	} `json:"skillgroups"`
	Categories struct {
		Category []map[string]interface{} `json:"category"`
	} `json:"categories"`
	Skills struct {
		Skill []map[string]interface{} `json:"skill"`
	} `json:"skills"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type SkillCategory struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

type SkillSpec struct {
	Name       string            `json:"name"`
	Attributes map[string]string `json:"attributes,omitempty"`
}

type SkillEntry struct {
	ID           string            `json:"id"`
	Name         string            `json:"name"`
	Slug         string            `json:"slug"`
	Attribute    string            `json:"attribute"`
	Category     string            `json:"category"`
	CategorySlug string            `json:"category_slug"`
	Group        string            `json:"group,omitempty"`
	Defaultable  bool              `json:"defaultable"`
	Source       string            `json:"source,omitempty"`
	Page         string            `json:"page,omitempty"`
	Specs        []SkillSpec       `json:"specializations,omitempty"`
	Attributes   map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source        SourceMetadata `json:"source"`
		GeneratedBy   string         `json:"generated_by"`
		GroupCount    int            `json:"group_count"`
		CategoryCount int            `json:"category_count"`
		SkillCount    int            `json:"skill_count"`
	} `json:"metadata"`
	Groups     []string        `json:"groups"`
	Categories []SkillCategory `json:"categories"`
	Skills     []SkillEntry    `json:"skills"`
}

const (
	inputPath  = "data/chummer/skills.json"
	outputPath = "data/editions/sr5/skills/all.json"
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

	var parsed chummerSkillsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Skills.Skill) == 0 {
		return errors.New("no skills found")
	}

	groups := normalizeGroups(parsed.SkillGroups.Names)
	categories := normalizeCategories(parsed.Categories.Category)
	skills := normalizeSkills(parsed.Skills.Skill)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Skills Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(skills),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerskills (ShadowMaster)"
	output.Metadata.GroupCount = len(groups)
	output.Metadata.CategoryCount = len(categories)
	output.Metadata.SkillCount = len(skills)
	output.Groups = groups
	output.Categories = categories
	output.Skills = skills

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

	fmt.Printf("Normalized %d skills into %s\n", len(skills), outputPath)
	return nil
}

func normalizeGroups(raw []string) []string {
	groups := make([]string, 0, len(raw))
	for _, name := range raw {
		trimmed := strings.TrimSpace(name)
		if trimmed != "" {
			groups = append(groups, trimmed)
		}
	}
	sort.Strings(groups)
	return groups
}

func normalizeCategories(raw []map[string]interface{}) []SkillCategory {
	categories := make([]SkillCategory, 0, len(raw))
	for _, entry := range raw {
		categories = append(categories, SkillCategory{
			Name: valueToString(entry["+content"]),
			Type: valueToString(entry["+@type"]),
		})
	}
	sort.Slice(categories, func(i, j int) bool {
		if categories[i].Type == categories[j].Type {
			return categories[i].Name < categories[j].Name
		}
		return categories[i].Type < categories[j].Type
	})
	return categories
}

func normalizeSkills(raw []map[string]interface{}) []SkillEntry {
	skills := make([]SkillEntry, 0, len(raw))
	for _, entry := range raw {
		skill := SkillEntry{
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				skill.ID = valueToString(val)
			case "name":
				skill.Name = valueToString(val)
			case "attribute":
				skill.Attribute = valueToString(val)
			case "category":
				skill.Category = valueToString(val)
				skill.CategorySlug = makeSlug(skill.Category)
			case "skillgroup":
				skill.Group = valueToString(val)
			case "default":
				skill.Defaultable = parseBool(val)
			case "source":
				skill.Source = valueToString(val)
			case "page":
				skill.Page = valueToString(val)
			case "specs":
				skill.Specs = normalizeSpecs(val)
			default:
				if serialized := serializeValue(val); serialized != "" {
					skill.Attributes[key] = serialized
				}
			}
		}
		if skill.ID == "" {
			skill.ID = makeSlug(skill.Name, skill.Category)
		}
		if skill.Name == "" {
			skill.Name = "Unnamed Skill"
		}
		skill.Slug = makeSlug(skill.Name)
		if len(skill.Attributes) == 0 {
			skill.Attributes = nil
		}
		skills = append(skills, skill)
	}

	sort.Slice(skills, func(i, j int) bool {
		if skills[i].Category == skills[j].Category {
			return skills[i].Name < skills[j].Name
		}
		return skills[i].Category < skills[j].Category
	})
	return skills
}

func normalizeSpecs(value interface{}) []SkillSpec {
	if value == nil {
		return nil
	}
	switch v := value.(type) {
	case map[string]interface{}:
		if raw, ok := v["spec"]; ok {
			return normalizeSpecs(raw)
		}
	case []interface{}:
		specs := make([]SkillSpec, 0, len(v))
		for _, item := range v {
			switch spec := item.(type) {
			case string:
				specs = append(specs, SkillSpec{Name: spec})
			case map[string]interface{}:
				name := valueToString(spec["+content"])
				if name == "" {
					name = valueToString(spec["name"])
				}
				entry := SkillSpec{Name: name}
				attr := make(map[string]string)
				for key, val := range spec {
					if key == "+content" || key == "name" {
						continue
					}
					if serialized := serializeValue(val); serialized != "" {
						attr[key] = serialized
					}
				}
				if len(attr) == 0 {
					attr = nil
				}
				entry.Attributes = attr
				specs = append(specs, entry)
			}
		}
		if len(specs) == 0 {
			return nil
		}
		sort.Slice(specs, func(i, j int) bool {
			return specs[i].Name < specs[j].Name
		})
		return specs
	}
	return nil
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
