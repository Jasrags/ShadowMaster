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
	})

	t.Run("fails when character creation data missing", func(t *testing.T) {
		data, err := repo.GetCharacterCreationData("sr5")
		assert.Error(t, err)
		assert.Nil(t, data)
	})

	t.Run("loads character creation and campaign support", func(t *testing.T) {
		edition := "test"
		creation := domain.CharacterCreationData{
			Priorities: map[string]map[string]domain.PriorityOption{
				"metatype": {
					"A": {Label: "Metatype A"},
				},
			},
		}
		require.NoError(t, store.Write(filepath.Join("editions", edition, characterCreationFilename), creation))

		support := domain.CampaignSupport{
			Factions: []domain.CampaignFactionPreset{{ID: "f1", Name: "Faction"}},
		}
		require.NoError(t, store.Write(filepath.Join("editions", edition, campaignSupportFilename), support))

		data, err := repo.GetCharacterCreationData(edition)
		require.NoError(t, err)
		require.NotNil(t, data)
		assert.Equal(t, "Metatype A", data.Priorities["metatype"]["A"].Label)
		require.NotNil(t, data.CampaignSupport)
		require.Len(t, data.CampaignSupport.Factions, 1)
		assert.Equal(t, "f1", data.CampaignSupport.Factions[0].ID)
	})

	t.Run("handles missing campaign support file", func(t *testing.T) {
		edition := "sr6"
		creation := domain.CharacterCreationData{
			Metatypes: []domain.MetatypeDefinition{{ID: "m1", Name: "Human"}},
		}
		require.NoError(t, store.Write(filepath.Join("editions", edition, characterCreationFilename), creation))

		data, err := repo.GetCharacterCreationData(edition)
		require.NoError(t, err)
		require.NotNil(t, data)
		assert.Nil(t, data.CampaignSupport)
		assert.Equal(t, "Human", data.Metatypes[0].Name)
	})
}
