package service

import (
	"shadowmaster/internal/domain"
	"testing"
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
			if (err != nil) != tc.wantErr {
				t.Fatalf("ValidatePassword(%q) error = %v, wantErr %v", tc.password, err, tc.wantErr)
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

	if sanitized == input {
		t.Fatal("sanitizeUser should return a copy, not the original pointer")
	}
	if sanitized.PasswordHash != "" {
		t.Errorf("sanitizeUser.PasswordHash = %q, want empty", sanitized.PasswordHash)
	}
	if sanitized.Email != input.Email || sanitized.Username != input.Username {
		t.Error("sanitizeUser should retain non-sensitive fields")
	}
}
