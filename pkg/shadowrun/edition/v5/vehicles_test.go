package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataVehicleCategories(t *testing.T) {
	assert.NotEmpty(t, DataVehicleCategories, "DataVehicleCategories should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Bikes category",
			id:           "bikes",
			expectedName: "Bikes",
		},
		{
			name:         "Cars category",
			id:           "cars",
			expectedName: "Cars",
		},
		{
			name:         "Trucks category",
			id:           "trucks",
			expectedName: "Trucks",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			category, ok := DataVehicleCategories[tt.id]
			require.True(t, ok, "Category %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, category.Name)
		})
	}
}

func TestDataVehicles(t *testing.T) {
	assert.NotEmpty(t, DataVehicles, "DataVehicles should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Dodge Scoot Scooter",
			id:           "dodge_scoot_scooter",
			expectedName: "Dodge Scoot (Scooter)",
		},
		{
			name:         "Daihatsu-Caterpillar Horseman",
			id:           "daihatsu_caterpillar_horseman",
			expectedName: "Daihatsu-Caterpillar Horseman",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			vehicle, ok := DataVehicles[tt.id]
			require.True(t, ok, "Vehicle %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, vehicle.Name)
		})
	}
}

func TestDataVehicleModifications(t *testing.T) {
	assert.NotEmpty(t, DataVehicleModifications, "DataVehicleModifications should not be empty")
}

func TestDataWeaponMounts(t *testing.T) {
	assert.NotEmpty(t, DataWeaponMounts, "DataWeaponMounts should not be empty")
}

func TestVehicleFields(t *testing.T) {
	vehicle, ok := DataVehicles["dodge_scoot_scooter"]
	require.True(t, ok, "Vehicle 'dodge_scoot_scooter' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Name", "Name", func() bool { return vehicle.Name != "" }},
		{"Category", "Category", func() bool { return vehicle.Category != "" }},
		{"Source", "Source", func() bool { return vehicle.Source != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}
