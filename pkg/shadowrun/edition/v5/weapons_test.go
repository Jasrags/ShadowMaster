package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataWeaponCategories(t *testing.T) {
	assert.NotEmpty(t, DataWeaponCategories, "DataWeaponCategories should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Blades category",
			id:           "blades",
			expectedName: "Blades",
		},
		{
			name:         "Assault Rifles category",
			id:           "assault_rifles",
			expectedName: "Assault Rifles",
		},
		{
			name:         "Heavy Pistols category",
			id:           "heavy_pistols",
			expectedName: "Heavy Pistols",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			category, ok := DataWeaponCategories[tt.id]
			require.True(t, ok, "Category %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, category.Name)
		})
	}
}

func TestDataWeapons(t *testing.T) {
	assert.NotEmpty(t, DataWeapons, "DataWeapons should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Ares Thunderstruck Gauss Rifle",
			id:           "ares_thunderstruck_gauss_rifle",
			expectedName: "Ares Thunderstruck Gauss Rifle",
		},
		{
			name:         "Ares Vigorous Assault Cannon",
			id:           "ares_vigorous_assault_cannon",
			expectedName: "Ares Vigorous Assault Cannon",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			weapon, ok := DataWeapons[tt.id]
			require.True(t, ok, "Weapon %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, weapon.Name)
		})
	}
}

func TestDataWeaponAccessories(t *testing.T) {
	assert.NotEmpty(t, DataWeaponAccessories, "DataWeaponAccessories should not be empty")

	accessory, ok := DataWeaponAccessories["silencer_ares_light_fire_70"]
	require.True(t, ok, "Accessory 'silencer_ares_light_fire_70' should exist")
	assert.NotNil(t, accessory.Name, "Accessory Name should not be nil")
}

func TestWeaponCategoryFields(t *testing.T) {
	category, ok := DataWeaponCategories["assault_rifles"]
	require.True(t, ok, "Category 'assault_rifles' should exist")

	assert.NotEmpty(t, category.Type, "Type should not be empty")
	assert.NotEmpty(t, category.BlackMarket, "BlackMarket should not be empty")
}

func TestWeaponFields(t *testing.T) {
	weapon, ok := DataWeapons["ares_thunderstruck_gauss_rifle"]
	require.True(t, ok, "Weapon 'ares_thunderstruck_gauss_rifle' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Name", "Name", func() bool { return weapon.Name != "" }},
		{"Category", "Category", func() bool { return weapon.Category != "" }},
		{"Type", "Type", func() bool { return weapon.Type != "" }},
		{"Source", "Source", func() bool { return weapon.Source != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestWeaponAccessoryFields(t *testing.T) {
	accessory, ok := DataWeaponAccessories["silencer_ares_light_fire_70"]
	require.True(t, ok, "Accessory 'silencer_ares_light_fire_70' should exist")
	assert.NotNil(t, accessory.Name, "Accessory Name should not be nil")
}
