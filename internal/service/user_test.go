package service

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/internal/domain"
)

func TestValidatePassword(t *testing.T) {
	t.Parallel()

	cases := []struct {
		name       string
		password   string
		disallowed []string
		wantErr    bool
	}{
		{
			name:     "valid password",
			password: "Aa123456!",
			wantErr:  false,
		},
		{
			name:     "too short",
			password: "Aa12",
			wantErr:  true,
		},
		{
			name:     "missing uppercase",
			password: "aa123456",
			wantErr:  true,
		},
		{
			name:     "missing lowercase",
			password: "AA123456",
			wantErr:  true,
		},
		{
			name:     "missing digit",
			password: "AAbbccdd",
			wantErr:  true,
		},
		{
			name:       "contains disallowed word",
			password:   "Aa123456username",
			disallowed: []string{"username"},
			wantErr:    true,
		},
		{
			name:       "contains disallowed word case insensitive",
			password:   "Aa123456Email",
			disallowed: []string{"email"},
			wantErr:    true,
		},
	}

	for _, tc := range cases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			err := ValidatePassword(tc.password, tc.disallowed...)
			if tc.wantErr {
				require.Error(t, err, "expected error for %s", tc.name)
			} else {
				require.NoError(t, err, "unexpected error for %s", tc.name)
			}
		})
	}
}

func TestSanitizeUser(t *testing.T) {
	t.Parallel()

	input := &domain.User{
		ID:           "user-1",
		Email:        "runner@example.com",
		Username:     "StreetSam",
		PasswordHash: "$2a$10$example",
		Roles:        []string{domain.RolePlayer},
	}

	sanitized := sanitizeUser(input)

	assert.NotSame(t, input, sanitized, "sanitizeUser should return a copy")
	assert.Empty(t, sanitized.PasswordHash)
	assert.Equal(t, input.Email, sanitized.Email)
	assert.Equal(t, input.Username, sanitized.Username)
}
