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

type chummerPacksFile struct {
	Categories struct {
		Category []interface{} `json:"category"`
	} `json:"categories"`
	Packs struct {
		Pack []map[string]interface{} `json:"pack"`
	} `json:"packs"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type PackItem struct {
	Name       string            `json:"name"`
	Category   string            `json:"category,omitempty"`
	Quantity   string            `json:"quantity,omitempty"`
	Rating     string            `json:"rating,omitempty"`
	Mount      string            `json:"mount,omitempty"`
	Selection  string            `json:"selection,omitempty"`
	Attributes map[string]string `json:"attributes,omitempty"`
	Children   []PackItem        `json:"children,omitempty"`
}

type NormalizedPack struct {
	Name         string            `json:"name"`
	Slug         string            `json:"slug"`
	Category     string            `json:"category,omitempty"`
	CategorySlug string            `json:"category_slug,omitempty"`
	NuyenBP      string            `json:"nuyen_bp,omitempty"`
	Attributes   map[string]string `json:"attributes,omitempty"`
	Armor        []PackItem        `json:"armor,omitempty"`
	Weapons      []PackItem        `json:"weapons,omitempty"`
	Gear         []PackItem        `json:"gear,omitempty"`
	Vehicles     []PackItem        `json:"vehicles,omitempty"`
	Cyberware    []PackItem        `json:"cyberware,omitempty"`
	Bioware      []PackItem        `json:"bioware,omitempty"`
	Programs     []PackItem        `json:"programs,omitempty"`
	Drones       []PackItem        `json:"drones,omitempty"`
	Lifestyle    []PackItem        `json:"lifestyle,omitempty"`
}

type Output struct {
	Metadata struct {
		Source        SourceMetadata `json:"source"`
		GeneratedBy   string         `json:"generated_by"`
		CategoryCount int            `json:"category_count"`
		PackCount     int            `json:"pack_count"`
	} `json:"metadata"`
	Categories []string         `json:"categories"`
	Packs      []NormalizedPack `json:"packs"`
}

const (
	inputPath  = "data/chummer/packs.json"
	outputPath = "data/editions/sr5/packs/all.json"
)

var sectionKeys = map[string]string{
	"armors":     "armor",
	"weapons":    "weapon",
	"gears":      "gear",
	"vehicles":   "vehicle",
	"cyberware":  "cyberware",
	"biowares":   "bioware",
	"programs":   "program",
	"drones":     "drone",
	"lifestyles": "lifestyle",
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

	var parsed chummerPacksFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Packs.Pack) == 0 {
		return errors.New("no packs found")
	}

	categories := normalizeCategories(parsed.Categories.Category)
	packs := normalizePacks(parsed.Packs.Pack)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Packs Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(packs),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerpacks (ShadowMaster)"
	output.Metadata.CategoryCount = len(categories)
	output.Metadata.PackCount = len(packs)
	output.Categories = categories
	output.Packs = packs

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

	fmt.Printf("Normalized %d packs into %s\n", len(packs), outputPath)
	return nil
}

func normalizeCategories(raw []interface{}) []string {
	if len(raw) == 0 {
		return nil
	}
	categories := make([]string, 0, len(raw))
	for _, entry := range raw {
		if name := valueToString(entry); name != "" {
			categories = append(categories, name)
		}
	}
	sort.Strings(categories)
	return categories
}

func normalizePacks(raw []map[string]interface{}) []NormalizedPack {
	packs := make([]NormalizedPack, 0, len(raw))
	for _, entry := range raw {
		pack := NormalizedPack{
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "name":
				pack.Name = valueToString(val)
			case "category":
				pack.Category = valueToString(val)
				pack.CategorySlug = makeSlug(pack.Category)
			case "nuyenbp":
				pack.NuyenBP = valueToString(val)
			default:
				if subkey, ok := sectionKeys[key]; ok {
					pack = assignSection(pack, key, val, subkey)
				} else if serialized := serializeValue(val); serialized != "" {
					pack.Attributes[key] = serialized
				}
			}
		}
		if len(pack.Attributes) == 0 {
			pack.Attributes = nil
		}
		pack.Slug = makeSlug(pack.Name)
		packs = append(packs, pack)
	}
	sort.Slice(packs, func(i, j int) bool {
		if packs[i].Category == packs[j].Category {
			return packs[i].Name < packs[j].Name
		}
		return packs[i].Category < packs[j].Category
	})
	return packs
}

func assignSection(pack NormalizedPack, key string, value interface{}, itemKey string) NormalizedPack {
	items := normalizePackItems(value, itemKey)
	if len(items) == 0 {
		return pack
	}
	switch key {
	case "armors":
		pack.Armor = append(pack.Armor, items...)
	case "weapons":
		pack.Weapons = append(pack.Weapons, items...)
	case "gears":
		pack.Gear = append(pack.Gear, items...)
	case "vehicles":
		pack.Vehicles = append(pack.Vehicles, items...)
	case "cyberware":
		pack.Cyberware = append(pack.Cyberware, items...)
	case "biowares":
		pack.Bioware = append(pack.Bioware, items...)
	case "programs":
		pack.Programs = append(pack.Programs, items...)
	case "drones":
		pack.Drones = append(pack.Drones, items...)
	case "lifestyles":
		pack.Lifestyle = append(pack.Lifestyle, items...)
	}
	return pack
}

func normalizePackItems(value interface{}, itemKey string) []PackItem {
	if value == nil {
		return nil
	}
	switch v := value.(type) {
	case map[string]interface{}:
		if raw, ok := v[itemKey]; ok {
			return normalizePackItems(raw, itemKey)
		}
		return []PackItem{parsePackItem(v, itemKey)}
	case []interface{}:
		items := make([]PackItem, 0, len(v))
		for _, item := range v {
			if m, ok := item.(map[string]interface{}); ok {
				items = append(items, parsePackItem(m, itemKey))
			}
		}
		return items
	}
	return nil
}

func parsePackItem(entry map[string]interface{}, itemKey string) PackItem {
	item := PackItem{
		Attributes: make(map[string]string),
	}
	if nameVal, ok := entry["name"]; ok {
		switch name := nameVal.(type) {
		case map[string]interface{}:
			item.Name = valueToString(name["+content"])
			if sel := valueToString(name["+@select"]); sel != "" {
				item.Selection = sel
			}
		default:
			item.Name = valueToString(nameVal)
		}
	}
	if item.Name == "" {
		item.Name = "Unnamed"
	}
	item.Category = valueToString(entry["category"])
	item.Quantity = valueToString(entry["qty"])
	item.Rating = valueToString(entry["rating"])
	item.Mount = valueToString(entry["mount"])

	for key, val := range entry {
		if key == "name" || key == "category" || key == "qty" || key == "rating" || key == "mount" {
			continue
		}
		if subkey, ok := sectionKeys[key]; ok {
			item.Children = append(item.Children, normalizePackItems(val, subkey)...)
		} else if serialized := serializeValue(val); serialized != "" {
			item.Attributes[key] = serialized
		}
	}

	if len(item.Attributes) == 0 {
		item.Attributes = nil
	}
	if len(item.Children) == 0 {
		item.Children = nil
	}
	return item
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
