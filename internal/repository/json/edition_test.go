package jsonrepo

import (
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/internal/domain"
	"shadowmaster/pkg/storage"
)

func TestEditionRepository(t *testing.T) {
	dir := t.TempDir()
	store, err := storage.NewJSONStore(dir)
	require.NoError(t, err)

	repo := NewEditionRepository(store)

	t.Run("requires edition", func(t *testing.T) {
		data, err := repo.GetCharacterCreationData("")
		assert.Error(t, err)
		assert.Nil(t, data)
		assert.Contains(t, err.Error(), "edition key is required")
	})

	t.Run("loads SR5 data from Go code", func(t *testing.T) {
		data, err := repo.GetCharacterCreationData("sr5")
		require.NoError(t, err)
		require.NotNil(t, data)
		assert.NotNil(t, data.Priorities)
		assert.NotEmpty(t, data.Metatypes)
		assert.NotEmpty(t, data.CreationMethods)
	})

	t.Run("loads SR3 data from Go code", func(t *testing.T) {
		data, err := repo.GetCharacterCreationData("sr3")
		require.NoError(t, err)
		require.NotNil(t, data)
		assert.NotNil(t, data.Priorities)
		assert.NotEmpty(t, data.Metatypes)
		assert.NotEmpty(t, data.CreationMethods)
	})

	t.Run("fails for unsupported edition", func(t *testing.T) {
		data, err := repo.GetCharacterCreationData("sr6")
		assert.Error(t, err)
		assert.Nil(t, data)
		assert.Contains(t, err.Error(), "unsupported edition")
	})

	t.Run("loads campaign support from JSON when available", func(t *testing.T) {
		edition := "sr5"
		support := domain.CampaignSupport{
			Factions: []domain.CampaignFactionPreset{{ID: "f1", Name: "Faction"}},
		}
		require.NoError(t, store.Write(filepath.Join("editions", edition, campaignSupportFilename), support))

		data, err := repo.GetCharacterCreationData(edition)
		require.NoError(t, err)
		require.NotNil(t, data)
		require.NotNil(t, data.CampaignSupport)
		require.Len(t, data.CampaignSupport.Factions, 1)
		assert.Equal(t, "f1", data.CampaignSupport.Factions[0].ID)
	})

	t.Run("handles missing campaign support file gracefully", func(t *testing.T) {
		edition := "sr3"
		// Don't create campaign support file

		data, err := repo.GetCharacterCreationData(edition)
		require.NoError(t, err)
		require.NotNil(t, data)
		// Campaign support should be nil when file doesn't exist
		assert.Nil(t, data.CampaignSupport)
		// But character creation data should still be loaded from Go
		assert.NotNil(t, data.Priorities)
		assert.NotEmpty(t, data.Metatypes)
	})
}
