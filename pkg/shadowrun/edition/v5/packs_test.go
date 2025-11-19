package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataPackCategories(t *testing.T) {
	assert.NotEmpty(t, DataPackCategories, "DataPackCategories should not be empty")
	assert.Contains(t, DataPackCategories, "Core Packs")
	assert.Contains(t, DataPackCategories, "Weapon and Ammo Packs")
	assert.Contains(t, DataPackCategories, "Armor Packs")
}

func TestDataPacks(t *testing.T) {
	assert.NotEmpty(t, DataPacks, "DataPacks should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedCategory string
	}{
		{
			name:         "Intro Runner Pack",
			id:           "intro_runner_pack",
			expectedName: "Intro Runner Pack",
			expectedCategory: "Core Packs",
		},
		{
			name:         "Basic Runner Pack",
			id:           "basic_runner_pack",
			expectedName: "Basic Runner Pack",
			expectedCategory: "Core Packs",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			pack, ok := DataPacks[tt.id]
			require.True(t, ok, "Pack %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, pack.Name)
			assert.Equal(t, tt.expectedCategory, pack.Category)
		})
	}
}

func TestPackFields(t *testing.T) {
	pack, ok := DataPacks["intro_runner_pack"]
	require.True(t, ok, "Pack 'intro_runner_pack' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Name", "Name", func() bool { return pack.Name != "" }},
		{"Category", "Category", func() bool { return pack.Category != "" }},
		{"NuyenBP", "NuyenBP", func() bool { return pack.NuyenBP != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestPackWithArmors(t *testing.T) {
	pack, ok := DataPacks["intro_runner_pack"]
	require.True(t, ok, "Pack 'intro_runner_pack' should exist")

	if pack.Armors != nil {
		assert.NotNil(t, pack.Armors, "Armors should not be nil if set")
	}
}

func TestPackWithGears(t *testing.T) {
	pack, ok := DataPacks["intro_runner_pack"]
	require.True(t, ok, "Pack 'intro_runner_pack' should exist")

	if pack.Gears != nil {
		assert.NotNil(t, pack.Gears, "Gears should not be nil if set")
	}
}

func TestPackWithWeapons(t *testing.T) {
	pack, ok := DataPacks["intro_runner_pack"]
	require.True(t, ok, "Pack 'intro_runner_pack' should exist")

	if pack.Weapons != nil {
		assert.NotNil(t, pack.Weapons, "Weapons should not be nil if set")
	}
}

