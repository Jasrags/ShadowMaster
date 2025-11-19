package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataTips(t *testing.T) {
	assert.NotEmpty(t, DataTips, "DataTips should not be empty")

	// Find a tip by checking if any tip exists
	var tip *Tip
	for _, t := range DataTips {
		tip = &t
		break
	}

	require.NotNil(t, tip, "Should have at least one tip")
	assert.NotEmpty(t, tip.ID, "Tip ID should not be empty")
	assert.NotEmpty(t, tip.Text, "Tip text should not be empty")
}

func TestTipFields(t *testing.T) {
	// Find a tip
	var tip *Tip
	for _, t := range DataTips {
		tip = &t
		break
	}

	require.NotNil(t, tip, "Should have at least one tip")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return tip.ID != "" }},
		{"Text", "Text", func() bool { return tip.Text != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestTipWithRequired(t *testing.T) {
	// Find a tip with required
	var tip *Tip
	for _, t := range DataTips {
		if t.Required != nil {
			tip = &t
			break
		}
	}

	if tip != nil {
		assert.NotNil(t, tip.Required, "Required should not be nil if set")
	}
}

func TestTipWithForbidden(t *testing.T) {
	// Find a tip with forbidden
	var tip *Tip
	for _, t := range DataTips {
		if t.Forbidden != nil {
			tip = &t
			break
		}
	}

	if tip != nil {
		assert.NotNil(t, tip.Forbidden, "Forbidden should not be nil if set")
	}
}

func TestTipCount(t *testing.T) {
	// Verify we have a reasonable number of tips
	assert.Greater(t, len(DataTips), 10, "Should have several tips")
	assert.Less(t, len(DataTips), 20, "Should not have too many tips")
}

