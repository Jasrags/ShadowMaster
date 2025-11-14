package jsonrepo

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestLoadIndexDefaults(t *testing.T) {
	idx, err := LoadIndex([]byte("not json"))
	require.NoError(t, err)
	require.NotNil(t, idx)
	assert.Empty(t, idx.Characters)
	assert.Empty(t, idx.Users)
}

func TestLoadIndexInitializesNilMaps(t *testing.T) {
	payload := map[string]interface{}{
		"characters": nil,
		"groups":     nil,
	}
	data, err := json.Marshal(payload)
	require.NoError(t, err)

	idx, err := LoadIndex(data)
	require.NoError(t, err)
	require.NotNil(t, idx)
	idx.Campaigns["c1"] = "campaigns/c1.json"
	idx.UserCharacters["u1"] = []string{"char-1"}
}

func TestIndexMarshal(t *testing.T) {
	idx := NewIndex()
	idx.Characters["char-1"] = "characters/char-1.json"
	data, err := idx.Marshal()
	require.NoError(t, err)
	assert.Contains(t, string(data), "char-1")
}
