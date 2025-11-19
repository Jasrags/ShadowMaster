package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDataMatrixAttributes(t *testing.T) {
	assert.NotEmpty(t, DataMatrixAttributes, "DataMatrixAttributes should not be empty")
	assert.Contains(t, DataMatrixAttributes, "String_Attack", "Should contain String_Attack")
	assert.Contains(t, DataMatrixAttributes, "String_DataProcessing", "Should contain String_DataProcessing")
}

func TestDataElements(t *testing.T) {
	assert.NotEmpty(t, DataElements, "DataElements should not be empty")
	assert.Contains(t, DataElements, "Fire", "Should contain Fire")
	assert.Contains(t, DataElements, "Cold", "Should contain Cold")
}

func TestDataImmunities(t *testing.T) {
	assert.NotEmpty(t, DataImmunities, "DataImmunities should not be empty")
	assert.Contains(t, DataImmunities, "Age", "Should contain Age")
	assert.Contains(t, DataImmunities, "Normal Weapons", "Should contain Normal Weapons")
}

func TestDataSpiritCategories(t *testing.T) {
	assert.NotEmpty(t, DataSpiritCategories, "DataSpiritCategories should not be empty")
	assert.Contains(t, DataSpiritCategories, "Combat", "Should contain Combat")
	assert.Contains(t, DataSpiritCategories, "Detection", "Should contain Detection")
}

func TestStringCounts(t *testing.T) {
	assert.Equal(t, 4, len(DataMatrixAttributes), "Should have 4 matrix attributes")
	assert.Equal(t, 7, len(DataElements), "Should have 7 elements")
	assert.Equal(t, 2, len(DataImmunities), "Should have 2 immunities")
	assert.Equal(t, 5, len(DataSpiritCategories), "Should have 5 spirit categories")
}

