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

type chummerSpellsFile struct {
	Categories struct {
		Category []map[string]interface{} `json:"category"`
	} `json:"categories"`
	Spells struct {
		Spell []map[string]interface{} `json:"spell"`
	} `json:"spells"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type SpellCategory struct {
	Name            string `json:"name"`
	UseSkill        string `json:"use_skill,omitempty"`
	AlchemicalSkill string `json:"alchemical_skill,omitempty"`
	AdeptSkill      string `json:"adept_skill,omitempty"`
}

type SpellEntry struct {
	ID           string            `json:"id"`
	Name         string            `json:"name"`
	Slug         string            `json:"slug"`
	Category     string            `json:"category"`
	CategorySlug string            `json:"category_slug"`
	Damage       string            `json:"damage,omitempty"`
	Descriptor   string            `json:"descriptor,omitempty"`
	Duration     string            `json:"duration,omitempty"`
	Drain        string            `json:"drain_value,omitempty"`
	Range        string            `json:"range,omitempty"`
	Type         string            `json:"type,omitempty"`
	Source       string            `json:"source,omitempty"`
	Page         string            `json:"page,omitempty"`
	Attributes   map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source        SourceMetadata `json:"source"`
		GeneratedBy   string         `json:"generated_by"`
		CategoryCount int            `json:"category_count"`
		SpellCount    int            `json:"spell_count"`
	} `json:"metadata"`
	Categories []SpellCategory `json:"categories"`
	Spells     []SpellEntry    `json:"spells"`
}

const (
	inputPath  = "data/chummer/spells.json"
	outputPath = "data/editions/sr5/spells/all.json"
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

	var parsed chummerSpellsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Spells.Spell) == 0 {
		return errors.New("no spells found")
	}

	categories := normalizeCategories(parsed.Categories.Category)
	spells := normalizeSpells(parsed.Spells.Spell)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Spells Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(spells),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerspells (ShadowMaster)"
	output.Metadata.CategoryCount = len(categories)
	output.Metadata.SpellCount = len(spells)
	output.Categories = categories
	output.Spells = spells

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

	fmt.Printf("Normalized %d spells into %s\n", len(spells), outputPath)
	return nil
}

func normalizeCategories(raw []map[string]interface{}) []SpellCategory {
	categories := make([]SpellCategory, 0, len(raw))
	for _, entry := range raw {
		categories = append(categories, SpellCategory{
			Name:            valueToString(entry["+content"]),
			UseSkill:        valueToString(entry["+@useskill"]),
			AlchemicalSkill: valueToString(entry["+@alchemicalskill"]),
			AdeptSkill:      valueToString(entry["+@barehandedadeptskill"]),
		})
	}
	sort.Slice(categories, func(i, j int) bool {
		return categories[i].Name < categories[j].Name
	})
	return categories
}

func normalizeSpells(raw []map[string]interface{}) []SpellEntry {
	spells := make([]SpellEntry, 0, len(raw))
	for _, entry := range raw {
		spell := SpellEntry{
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				spell.ID = valueToString(val)
			case "name":
				spell.Name = valueToString(val)
			case "category":
				spell.Category = valueToString(val)
				spell.CategorySlug = makeSlug(spell.Category)
			case "damage":
				spell.Damage = valueToString(val)
			case "descriptor":
				spell.Descriptor = valueToString(val)
			case "duration":
				spell.Duration = valueToString(val)
			case "dv":
				spell.Drain = valueToString(val)
			case "range":
				spell.Range = valueToString(val)
			case "type":
				spell.Type = valueToString(val)
			case "source":
				spell.Source = valueToString(val)
			case "page":
				spell.Page = valueToString(val)
			default:
				if serialized := serializeValue(val); serialized != "" {
					spell.Attributes[key] = serialized
				}
			}
		}
		if spell.ID == "" {
			spell.ID = makeSlug(spell.Name, spell.Category)
		}
		if spell.Name == "" {
			spell.Name = "Unnamed Spell"
		}
		spell.Slug = makeSlug(spell.Name)
		if len(spell.Attributes) == 0 {
			spell.Attributes = nil
		}
		spells = append(spells, spell)
	}

	sort.Slice(spells, func(i, j int) bool {
		if spells[i].Category == spells[j].Category {
			return spells[i].Name < spells[j].Name
		}
		return spells[i].Category < spells[j].Category
	})
	return spells
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
