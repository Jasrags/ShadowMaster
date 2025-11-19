package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDataLicenses(t *testing.T) {
	assert.NotEmpty(t, DataLicenses, "DataLicenses should not be empty")
	assert.GreaterOrEqual(t, len(DataLicenses), 30, "Should have at least 30 licenses")

	tests := []struct {
		name           string
		expectedLicense string
	}{
		{
			name:           "Adept License exists",
			expectedLicense: "Adept License",
		},
		{
			name:           "Firearms License exists",
			expectedLicense: "Firearms License",
		},
		{
			name:           "Driver's License exists",
			expectedLicense: "Driver's License",
		},
		{
			name:           "Mage License exists",
			expectedLicense: "Mage License",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			found := false
			for _, license := range DataLicenses {
				if license == tt.expectedLicense {
					found = true
					break
				}
			}
			assert.True(t, found, "License %s should exist", tt.expectedLicense)
		})
	}
}

func TestDataLicensesNotEmpty(t *testing.T) {
	for _, license := range DataLicenses {
		assert.NotEmpty(t, license, "License name should not be empty")
	}
}

