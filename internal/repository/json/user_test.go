package jsonrepo

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/internal/domain"
	"shadowmaster/pkg/storage"
)

func TestUserRepository(t *testing.T) {
	dir := t.TempDir()
	store, err := storage.NewJSONStore(dir)
	require.NoError(t, err)

	index := NewIndex()
	repo := NewUserRepository(store, index)

	user := &domain.User{Email: "Runner@example.com", Username: "Runner", PasswordHash: "hash"}
	require.NoError(t, repo.Create(user))
	assert.NotEmpty(t, user.ID)

	// creating another user with same email should fail
	dupeEmail := &domain.User{Email: "runner@example.com", Username: "Other", PasswordHash: "hash"}
	err = repo.Create(dupeEmail)
	assert.Error(t, err)

	// creating another user with same username should fail
	dupeUsername := &domain.User{Email: "other@example.com", Username: "RUNNER", PasswordHash: "hash"}
	err = repo.Create(dupeUsername)
	assert.Error(t, err)

	loaded, err := repo.GetByID(user.ID)
	require.NoError(t, err)
	assert.Equal(t, "Runner@example.com", loaded.Email)

	byEmail, err := repo.GetByEmail(" runner@example.com ")
	require.NoError(t, err)
	assert.Equal(t, user.ID, byEmail.ID)

	byUsername, err := repo.GetByUsername("RUNNER")
	require.NoError(t, err)
	assert.Equal(t, user.ID, byUsername.ID)

	users, err := repo.GetAll()
	require.NoError(t, err)
	require.Len(t, users, 1)

	user.Email = "new@example.com"
	user.Username = "Shadow"
	require.NoError(t, repo.Update(user))

	updated, err := repo.GetByID(user.ID)
	require.NoError(t, err)
	assert.Equal(t, "new@example.com", updated.Email)
	assert.Equal(t, "Shadow", updated.Username)
	assert.WithinDuration(t, time.Now(), updated.UpdatedAt, time.Second)

	// ensure indexes updated
	_, err = repo.GetByEmail("runner@example.com")
	assert.Error(t, err)

	byNewEmail, err := repo.GetByEmail("new@example.com")
	require.NoError(t, err)
	assert.Equal(t, user.ID, byNewEmail.ID)

	require.NoError(t, repo.Delete(user.ID))
	_, err = repo.GetByID(user.ID)
	assert.Error(t, err)

	_, err = repo.GetByEmail("new@example.com")
	assert.Error(t, err)
	_, err = repo.GetByUsername("shadow")
	assert.Error(t, err)
}
