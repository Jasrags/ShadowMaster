package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataCategories(t *testing.T) {
	assert.NotEmpty(t, DataCategories, "DataCategories should not be empty")

	tests := []struct {
		name           string
		id             string
		expectedName   string
		checkBlackMarket bool
	}{
		{
			name:           "Armor category",
			id:             "Armor",
			expectedName:   "Armor",
			checkBlackMarket: true,
		},
		{
			name:           "Clothing category",
			id:             "Clothing",
			expectedName:   "Clothing",
			checkBlackMarket: true,
		},
		{
			name:           "Cloaks category",
			id:             "Cloaks",
			expectedName:   "Cloaks",
			checkBlackMarket: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			category, ok := DataCategories[tt.id]
			require.True(t, ok, "Category %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, category.Name)
			if tt.checkBlackMarket {
				assert.NotEmpty(t, category.BlackMarket, "BlackMarket should not be empty")
			}
		})
	}
}

func TestDataModCategories(t *testing.T) {
	assert.NotEmpty(t, DataModCategories, "DataModCategories should not be empty")

	category, ok := DataModCategories["General"]
	require.True(t, ok, "Mod category 'General' should exist")
	assert.Equal(t, "General", category.Name)
	assert.NotEmpty(t, category.BlackMarket, "BlackMarket should not be empty")
}

func TestDataArmors(t *testing.T) {
	assert.NotEmpty(t, DataArmors, "DataArmors should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Armor Jacket",
			id:           "armor_jacket",
			expectedName: "Armor Jacket",
		},
		{
			name:         "Actioneer Business Clothes",
			id:           "actioneer_business_clothes",
			expectedName: "Actioneer Business Clothes",
		},
		{
			name:         "Armor Clothing",
			id:           "armor_clothing",
			expectedName: "Armor Clothing",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			armor, ok := DataArmors[tt.id]
			require.True(t, ok, "Armor %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, armor.Name)
			assert.NotEmpty(t, armor.Category, "Category should not be empty")
			assert.NotEmpty(t, armor.Source, "Source should not be empty")
		})
	}
}

func TestDataArmorMods(t *testing.T) {
	assert.NotEmpty(t, DataArmorMods, "DataArmorMods should not be empty")

	mod, ok := DataArmorMods["electrochromic_clothing"]
	require.True(t, ok, "Armor mod 'electrochromic_clothing' should exist")
	assert.NotEmpty(t, mod.Name, "Name should not be empty")
	assert.NotEmpty(t, mod.Category, "Category should not be empty")
	assert.NotEmpty(t, mod.Source, "Source should not be empty")
}

func TestArmorFields(t *testing.T) {
	armor, ok := DataArmors["armor_jacket"]
	require.True(t, ok, "Armor 'armor_jacket' should exist")

	tests := []struct {
		name     string
		field    string
		checkFn  func() bool
	}{
		{"Name", "Name", func() bool { return armor.Name != "" }},
		{"Category", "Category", func() bool { return armor.Category != "" }},
		{"Armor", "Armor", func() bool { return armor.Armor != "" }},
		{"ArmorCapacity", "ArmorCapacity", func() bool { return armor.ArmorCapacity != "" }},
		{"Avail", "Avail", func() bool { return armor.Avail != "" }},
		{"Cost", "Cost", func() bool { return armor.Cost != "" }},
		{"Source", "Source", func() bool { return armor.Source != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestArmorModFields(t *testing.T) {
	mod, ok := DataArmorMods["electrochromic_clothing"]
	require.True(t, ok, "Armor mod 'electrochromic_clothing' should exist")

	tests := []struct {
		name     string
		field    string
		checkFn  func() bool
	}{
		{"Name", "Name", func() bool { return mod.Name != "" }},
		{"Category", "Category", func() bool { return mod.Category != "" }},
		{"Armor", "Armor", func() bool { return mod.Armor != "" }},
		{"ArmorCapacity", "ArmorCapacity", func() bool { return mod.ArmorCapacity != "" }},
		{"Avail", "Avail", func() bool { return mod.Avail != "" }},
		{"Cost", "Cost", func() bool { return mod.Cost != "" }},
		{"Source", "Source", func() bool { return mod.Source != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}
