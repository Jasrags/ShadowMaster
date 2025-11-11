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

type chummerWeaponsFile struct {
	Categories struct {
		Category []map[string]interface{} `json:"category"`
	} `json:"categories"`
	Weapons struct {
		Weapon []map[string]interface{} `json:"weapon"`
	} `json:"weapons"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type WeaponCategory struct {
	Name        string `json:"name"`
	BlackMarket string `json:"black_market,omitempty"`
	Type        string `json:"type,omitempty"`
	GunnerySpec string `json:"gunnery_spec,omitempty"`
}

type WeaponComponent struct {
	Name       string            `json:"name"`
	Attributes map[string]string `json:"attributes,omitempty"`
}

type WeaponEntry struct {
	ID           string            `json:"id"`
	Name         string            `json:"name"`
	Slug         string            `json:"slug"`
	Category     string            `json:"category"`
	CategorySlug string            `json:"category_slug"`
	Type         string            `json:"type,omitempty"`
	Source       string            `json:"source,omitempty"`
	Page         string            `json:"page,omitempty"`
	Stats        map[string]string `json:"stats,omitempty"`
	Accessories  []WeaponComponent `json:"accessories,omitempty"`
	Mods         []WeaponComponent `json:"mods,omitempty"`
	Gear         []WeaponComponent `json:"gear,omitempty"`
	AmmoOptions  []WeaponComponent `json:"ammo_options,omitempty"`
	Attributes   map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source        SourceMetadata `json:"source"`
		GeneratedBy   string         `json:"generated_by"`
		CategoryCount int            `json:"category_count"`
		WeaponCount   int            `json:"weapon_count"`
	} `json:"metadata"`
	Categories []WeaponCategory `json:"categories"`
	Weapons    []WeaponEntry    `json:"weapons"`
}

const (
	inputPath  = "data/chummer/weapons.json"
	outputPath = "data/editions/sr5/weapons/all.json"
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

	var parsed chummerWeaponsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Weapons.Weapon) == 0 {
		return errors.New("no weapons found")
	}

	categories := normalizeCategories(parsed.Categories.Category)
	weapons := normalizeWeapons(parsed.Weapons.Weapon)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Weapons Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(weapons),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerweapons (ShadowMaster)"
	output.Metadata.CategoryCount = len(categories)
	output.Metadata.WeaponCount = len(weapons)
	output.Categories = categories
	output.Weapons = weapons

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

	fmt.Printf("Normalized %d weapons into %s\n", len(weapons), outputPath)
	return nil
}

func normalizeCategories(raw []map[string]interface{}) []WeaponCategory {
	categories := make([]WeaponCategory, 0, len(raw))
	for _, entry := range raw {
		categories = append(categories, WeaponCategory{
			Name:        valueToString(entry["+content"]),
			BlackMarket: valueToString(entry["+@blackmarket"]),
			Type:        valueToString(entry["+@type"]),
			GunnerySpec: valueToString(entry["+@gunneryspec"]),
		})
	}
	sort.Slice(categories, func(i, j int) bool {
		return categories[i].Name < categories[j].Name
	})
	return categories
}

func normalizeWeapons(raw []map[string]interface{}) []WeaponEntry {
	weapons := make([]WeaponEntry, 0, len(raw))
	for _, entry := range raw {
		weapon := WeaponEntry{
			Stats:      make(map[string]string),
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				weapon.ID = valueToString(val)
			case "name":
				weapon.Name = valueToString(val)
			case "category":
				weapon.Category = valueToString(val)
				weapon.CategorySlug = makeSlug(weapon.Category)
			case "type":
				weapon.Type = valueToString(val)
			case "source":
				weapon.Source = valueToString(val)
			case "page":
				weapon.Page = valueToString(val)
			case "accessories":
				weapon.Accessories = normalizeComponents(val)
			case "mods":
				weapon.Mods = normalizeComponents(val)
			case "gears":
				weapon.Gear = normalizeComponents(val)
			case "ammooptions":
				weapon.AmmoOptions = normalizeComponents(val)
			default:
				if str := valueToString(val); str != "" {
					weapon.Stats[key] = str
				} else if serialized := serializeValue(val); serialized != "" {
					weapon.Attributes[key] = serialized
				}
			}
		}
		if weapon.ID == "" {
			weapon.ID = makeSlug(weapon.Name, weapon.Category)
		}
		if weapon.Name == "" {
			weapon.Name = "Unnamed Weapon"
		}
		weapon.Slug = makeSlug(weapon.Name)
		if len(weapon.Stats) == 0 {
			weapon.Stats = nil
		}
		if len(weapon.Attributes) == 0 {
			weapon.Attributes = nil
		}
		weapons = append(weapons, weapon)
	}

	sort.Slice(weapons, func(i, j int) bool {
		if weapons[i].Category == weapons[j].Category {
			return weapons[i].Name < weapons[j].Name
		}
		return weapons[i].Category < weapons[j].Category
	})
	return weapons
}

func normalizeComponents(value interface{}) []WeaponComponent {
	if value == nil {
		return nil
	}
	switch v := value.(type) {
	case map[string]interface{}:
		if raw, ok := v["accessory"]; ok {
			return normalizeComponents(raw)
		}
		if raw, ok := v["gear"]; ok {
			return normalizeComponents(raw)
		}
		if raw, ok := v["mod"]; ok {
			return normalizeComponents(raw)
		}
		comp := WeaponComponent{
			Attributes: make(map[string]string),
		}
		if name, ok := v["name"]; ok {
			comp.Name = valueToString(name)
		}
		if comp.Name == "" {
			comp.Name = valueToString(v["id"])
		}
		for key, val := range v {
			if key == "name" || key == "id" {
				continue
			}
			if serialized := serializeValue(val); serialized != "" {
				comp.Attributes[key] = serialized
			}
		}
		if len(comp.Attributes) == 0 {
			comp.Attributes = nil
		}
		if comp.Name == "" && len(comp.Attributes) == 0 {
			return nil
		}
		if comp.Name == "" {
			comp.Name = "Unnamed"
		}
		return []WeaponComponent{comp}
	case []interface{}:
		comps := make([]WeaponComponent, 0, len(v))
		for _, item := range v {
			comps = append(comps, normalizeComponents(item)...)
		}
		if len(comps) == 0 {
			return nil
		}
		return comps
	case string:
		if v == "" {
			return nil
		}
		return []WeaponComponent{{Name: v}}
	}
	return nil
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
