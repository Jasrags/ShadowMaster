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

type chummerVehiclesFile struct {
	Categories struct {
		Category []map[string]interface{} `json:"category"`
	} `json:"categories"`
	ModCategories struct {
		Category []map[string]interface{} `json:"category"`
	} `json:"modcategories"`
	WeaponMountCategories struct {
		Category map[string]interface{} `json:"category"`
	} `json:"weaponmountcategories"`
	Vehicles struct {
		Vehicle []map[string]interface{} `json:"vehicle"`
	} `json:"vehicles"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type VehicleCategory struct {
	Name        string `json:"name"`
	BlackMarket string `json:"black_market,omitempty"`
}

type VehicleComponent struct {
	Name       string            `json:"name"`
	Attributes map[string]string `json:"attributes,omitempty"`
}

type VehicleEntry struct {
	ID           string             `json:"id"`
	Name         string             `json:"name"`
	Slug         string             `json:"slug"`
	Category     string             `json:"category"`
	CategorySlug string             `json:"category_slug"`
	Source       string             `json:"source,omitempty"`
	Page         string             `json:"page,omitempty"`
	Stats        map[string]string  `json:"stats,omitempty"`
	Gear         []VehicleComponent `json:"gear,omitempty"`
	Mods         []VehicleComponent `json:"mods,omitempty"`
	WeaponMounts []VehicleComponent `json:"weapon_mounts,omitempty"`
	Attributes   map[string]string  `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source                   SourceMetadata `json:"source"`
		GeneratedBy              string         `json:"generated_by"`
		CategoryCount            int            `json:"category_count"`
		ModCategoryCount         int            `json:"mod_category_count"`
		WeaponMountCategoryCount int            `json:"weapon_mount_category_count"`
		VehicleCount             int            `json:"vehicle_count"`
	} `json:"metadata"`
	Categories            []VehicleCategory `json:"categories"`
	ModCategories         []VehicleCategory `json:"mod_categories"`
	WeaponMountCategories []VehicleCategory `json:"weapon_mount_categories"`
	Vehicles              []VehicleEntry    `json:"vehicles"`
}

const (
	inputPath  = "data/chummer/vehicles.json"
	outputPath = "data/editions/sr5/vehicles/all.json"
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

	var parsed chummerVehiclesFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Vehicles.Vehicle) == 0 {
		return errors.New("no vehicles found")
	}

	categories := normalizeCategories(parsed.Categories.Category)
	modCategories := normalizeCategories(parsed.ModCategories.Category)
	weaponMountCategories := normalizeWeaponMountCategories(parsed.WeaponMountCategories.Category)
	vehicles := normalizeVehicles(parsed.Vehicles.Vehicle)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Vehicles Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(vehicles),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummervehicles (ShadowMaster)"
	output.Metadata.CategoryCount = len(categories)
	output.Metadata.ModCategoryCount = len(modCategories)
	output.Metadata.WeaponMountCategoryCount = len(weaponMountCategories)
	output.Metadata.VehicleCount = len(vehicles)
	output.Categories = categories
	output.ModCategories = modCategories
	output.WeaponMountCategories = weaponMountCategories
	output.Vehicles = vehicles

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

	fmt.Printf("Normalized %d vehicles into %s\n", len(vehicles), outputPath)
	return nil
}

func normalizeCategories(raw []map[string]interface{}) []VehicleCategory {
	categories := make([]VehicleCategory, 0, len(raw))
	for _, entry := range raw {
		categories = append(categories, VehicleCategory{
			Name:        valueToString(entry["+content"]),
			BlackMarket: valueToString(entry["+@blackmarket"]),
		})
	}
	sort.Slice(categories, func(i, j int) bool {
		return categories[i].Name < categories[j].Name
	})
	return categories
}

func normalizeWeaponMountCategories(raw map[string]interface{}) []VehicleCategory {
	if len(raw) == 0 {
		return nil
	}
	cat := VehicleCategory{
		Name:        valueToString(raw["+content"]),
		BlackMarket: valueToString(raw["+@blackmarket"]),
	}
	return []VehicleCategory{cat}
}

func normalizeVehicles(raw []map[string]interface{}) []VehicleEntry {
	vehicles := make([]VehicleEntry, 0, len(raw))
	for _, entry := range raw {
		vehicle := VehicleEntry{
			Stats:      make(map[string]string),
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				vehicle.ID = valueToString(val)
			case "name":
				vehicle.Name = valueToString(val)
			case "category":
				vehicle.Category = valueToString(val)
				vehicle.CategorySlug = makeSlug(vehicle.Category)
			case "source":
				vehicle.Source = valueToString(val)
			case "page":
				vehicle.Page = valueToString(val)
			case "gears":
				vehicle.Gear = normalizeComponents(val, "gear")
			case "mods":
				vehicle.Mods = normalizeComponents(val, "name")
			case "weaponmounts":
				vehicle.WeaponMounts = normalizeComponents(val, "mount")
			default:
				if str := valueToString(val); str != "" {
					vehicle.Stats[key] = str
				} else if serialized := serializeValue(val); serialized != "" {
					vehicle.Attributes[key] = serialized
				}
			}
		}
		if vehicle.ID == "" {
			vehicle.ID = makeSlug(vehicle.Name, vehicle.Category)
		}
		if vehicle.Name == "" {
			vehicle.Name = "Unnamed Vehicle"
		}
		vehicle.Slug = makeSlug(vehicle.Name)
		if len(vehicle.Stats) == 0 {
			vehicle.Stats = nil
		}
		if len(vehicle.Attributes) == 0 {
			vehicle.Attributes = nil
		}
		vehicles = append(vehicles, vehicle)
	}

	sort.Slice(vehicles, func(i, j int) bool {
		if vehicles[i].Category == vehicles[j].Category {
			return vehicles[i].Name < vehicles[j].Name
		}
		return vehicles[i].Category < vehicles[j].Category
	})
	return vehicles
}

func normalizeComponents(value interface{}, entryKey string) []VehicleComponent {
	if value == nil {
		return nil
	}
	switch v := value.(type) {
	case map[string]interface{}:
		if entryKey != "" {
			if raw, ok := v[entryKey]; ok {
				return normalizeComponents(raw, "")
			}
		}
		comp := VehicleComponent{
			Attributes: make(map[string]string),
		}
		if name, ok := v["name"]; ok {
			comp.Name = valueToString(name)
		}
		for key, val := range v {
			if key == "name" {
				continue
			}
			if serialized := serializeValue(val); serialized != "" {
				comp.Attributes[key] = serialized
			}
		}
		if comp.Name == "" {
			comp.Name = "Unnamed"
		}
		if len(comp.Attributes) == 0 {
			comp.Attributes = nil
		}
		return []VehicleComponent{comp}
	case []interface{}:
		comps := make([]VehicleComponent, 0, len(v))
		for _, item := range v {
			comps = append(comps, normalizeComponents(item, entryKey)...)
		}
		return comps
	case string:
		return []VehicleComponent{
			{
				Name: v,
			},
		}
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
