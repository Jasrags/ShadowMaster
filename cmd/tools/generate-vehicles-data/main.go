package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadVehiclesFromXML("data/chummerxml/vehicles.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateVehiclesDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/vehicles_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalVehicles := 0
	if data.Vehicles != nil {
		totalVehicles = len(data.Vehicles.Vehicle)
	}
	totalWeaponMounts := 0
	if data.WeaponMounts != nil {
		totalWeaponMounts = len(data.WeaponMounts.WeaponMount)
	}
	categoryCount := 0
	if len(data.Categories) > 0 {
		categoryCount = len(data.Categories[0].Category)
	}
	modCategoryCount := 0
	if len(data.ModCategories) > 0 {
		modCategoryCount = len(data.ModCategories[0].Category)
	}
	weaponMountCategoryCount := 0
	if len(data.WeaponMountCategories) > 0 {
		weaponMountCategoryCount = len(data.WeaponMountCategories[0].Category)
	}
	limitCount := 0
	if len(data.Limits) > 0 {
		limitCount = len(data.Limits[0].Limit)
	}
	fmt.Printf("  Categories: %d, ModCategories: %d, WeaponMountCategories: %d, Limits: %d, Vehicles: %d, WeaponMounts: %d\n",
		categoryCount,
		modCategoryCount,
		weaponMountCategoryCount,
		limitCount,
		totalVehicles,
		totalWeaponMounts)
}

func generateVehiclesDataCode(data *v5.VehiclesChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from vehicles.xml. DO NOT EDIT.\n\n")
	b.WriteString("var vehiclesData = &VehiclesChummer{\n")

	// Categories
	if len(data.Categories) > 0 && len(data.Categories[0].Category) > 0 {
		b.WriteString("\tCategories: []VehicleCategories{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tCategory: []VehicleCategory{\n")
		for _, cat := range data.Categories[0].Category {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tContent: %q,\n", cat.Content))
			if cat.Blackmarket != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tBlackmarket: stringPtr(%q),\n", *cat.Blackmarket))
			}
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// ModCategories
	if len(data.ModCategories) > 0 && len(data.ModCategories[0].Category) > 0 {
		b.WriteString("\tModCategories: []ModCategories{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tCategory: []ModCategory{\n")
		for _, cat := range data.ModCategories[0].Category {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tContent: %q,\n", cat.Content))
			if cat.Blackmarket != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tBlackmarket: stringPtr(%q),\n", *cat.Blackmarket))
			}
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// WeaponMountCategories
	if len(data.WeaponMountCategories) > 0 && len(data.WeaponMountCategories[0].Category) > 0 {
		b.WriteString("\tWeaponMountCategories: []WeaponMountCategories{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tCategory: []WeaponMountCategory{\n")
		for _, cat := range data.WeaponMountCategories[0].Category {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tContent: %q,\n", cat.Content))
			if cat.Blackmarket != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tBlackmarket: stringPtr(%q),\n", *cat.Blackmarket))
			}
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Limits
	if len(data.Limits) > 0 && len(data.Limits[0].Limit) > 0 {
		b.WriteString("\tLimits: []Limits{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tLimit: []Limit{\n")
		for _, limit := range data.Limits[0].Limit {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tContent: %q,\n", limit.Content))
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Vehicles - simplified, omit complex nested structures
	if data.Vehicles != nil && len(data.Vehicles.Vehicle) > 0 {
		b.WriteString("\tVehicles: &Vehicles{\n")
		b.WriteString("\t\tVehicle: []Vehicle{\n")
		b.WriteString(fmt.Sprintf("\t\t\t// %d vehicles omitted (complex nested structure)\n", len(data.Vehicles.Vehicle)))
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Mods - simplified
	if data.Mods != nil {
		b.WriteString("\tMods: &VehicleMods{},\n")
		b.WriteString("\t// Complex mods structure omitted\n")
	}

	// WeaponMounts
	if data.WeaponMounts != nil && len(data.WeaponMounts.WeaponMount) > 0 {
		b.WriteString("\tWeaponMounts: &WeaponMountItems{\n")
		b.WriteString("\t\tWeaponMount: []WeaponMountItem{\n")
		for _, mount := range data.WeaponMounts.WeaponMount {
			b.WriteString("\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\tID: %q,\n", mount.ID))
			b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", mount.Name))
			b.WriteString(fmt.Sprintf("\t\t\t\tAvail: %q,\n", mount.Avail))
			b.WriteString(fmt.Sprintf("\t\t\t\tCategory: %q,\n", mount.Category))
			b.WriteString(fmt.Sprintf("\t\t\t\tCost: %q,\n", mount.Cost))

			// Embedded Visibility
			if mount.Hide != nil || mount.IgnoreSourceDisabled != nil {
				b.WriteString("\t\t\t\tVisibility: common.Visibility{\n")
				if mount.Hide != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\tHide: stringPtr(%q),\n", *mount.Hide))
				}
				if mount.IgnoreSourceDisabled != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *mount.IgnoreSourceDisabled))
				}
				b.WriteString("\t\t\t\t},\n")
			}

			// SourceReference
			b.WriteString("\t\t\t\tSourceReference: common.SourceReference{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tSource: %q,\n", mount.Source))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tPage: %q,\n", mount.Page))
			b.WriteString("\t\t\t\t},\n")

			// Optional fields
			if mount.Create != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tCreate: stringPtr(%q),\n", *mount.Create))
			}
			if mount.OptionalDrone != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tOptionalDrone: stringPtr(%q),\n", *mount.OptionalDrone))
			}
			if mount.Slots != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tSlots: stringPtr(%q),\n", *mount.Slots))
			}
			if mount.WeaponCategories != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tWeaponCategories: stringPtr(%q),\n", *mount.WeaponCategories))
			}
			if mount.WeaponCapacity != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tWeaponCapacity: stringPtr(%q),\n", *mount.WeaponCapacity))
			}
			if mount.WeaponFilter != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tWeaponFilter: stringPtr(%q),\n", *mount.WeaponFilter))
			}

			// Optional Forbidden
			if mount.Forbidden != nil {
				b.WriteString("\t\t\t\tForbidden: &common.Forbidden{},\n")
			}

			// Optional Required
			if mount.Required != nil {
				b.WriteString("\t\t\t\tRequired: &common.Required{},\n")
			}

			b.WriteString("\t\t\t},\n")
		}
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// WeaponMountMods - simplified
	if data.WeaponMountMods != nil {
		b.WriteString("\tWeaponMountMods: &VehicleWeaponMountMods{},\n")
		b.WriteString("\t// Complex weapon mount mods structure omitted\n")
	}

	b.WriteString("}\n\n")

	b.WriteString("// GetVehiclesData returns the loaded vehicles data.\n")
	b.WriteString("func GetVehiclesData() *VehiclesChummer {\n")
	b.WriteString("\treturn vehiclesData\n")
	b.WriteString("}\n")

	return b.String()
}

