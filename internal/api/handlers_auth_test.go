package api_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"shadowmaster/internal/api"
	"shadowmaster/internal/domain"
	jsonrepo "shadowmaster/internal/repository/json"
	"shadowmaster/internal/service"
	"strings"
	"testing"
	"time"
)

func setupAuthTest(t *testing.T) (*api.Handlers, *api.SessionManager) {
	dir := t.TempDir()
	repos, err := jsonrepo.NewRepositories(dir)
	if err != nil {
		t.Fatalf("new repositories: %v", err)
	}

	sessionManager := api.NewSessionManager("test-secret", time.Hour, false)
	handlers := api.NewHandlers(
		repos,
		service.NewCharacterService(repos.Character),
		service.NewUserService(repos.User),
		sessionManager,
		service.NewCampaignService(repos.Campaign, repos.Edition, repos.Books),
		service.NewSessionService(repos.Session, repos.Campaign),
		service.NewSceneService(repos.Scene, repos.Session),
	)

	return handlers, sessionManager
}

func TestRegisterUser(t *testing.T) {
	handlers, _ := setupAuthTest(t)

	tests := []struct {
		name           string
		requestBody    map[string]string
		expectedStatus int
		expectUser     bool
		expectAdmin    bool
	}{
		{
			name: "first user becomes admin",
			requestBody: map[string]string{
				"email":    "admin@test.com",
				"username": "admin",
				"password": "Test1234",
			},
			expectedStatus: http.StatusCreated,
			expectUser:     true,
			expectAdmin:    true,
		},
		{
			name: "second user becomes player",
			requestBody: map[string]string{
				"email":    "player@test.com",
				"username": "player",
				"password": "Test1234",
			},
			expectedStatus: http.StatusCreated,
			expectUser:     true,
			expectAdmin:    false,
		},
		{
			name: "missing email",
			requestBody: map[string]string{
				"username": "test",
				"password": "Test1234",
			},
			expectedStatus: http.StatusBadRequest,
			expectUser:     false,
		},
		{
			name: "missing username",
			requestBody: map[string]string{
				"email":    "test@test.com",
				"password": "Test1234",
			},
			expectedStatus: http.StatusBadRequest,
			expectUser:     false,
		},
		{
			name: "missing password",
			requestBody: map[string]string{
				"email":    "test@test.com",
				"username": "test",
			},
			expectedStatus: http.StatusBadRequest,
			expectUser:     false,
		},
		{
			name: "weak password",
			requestBody: map[string]string{
				"email":    "test@test.com",
				"username": "test",
				"password": "weak",
			},
			expectedStatus: http.StatusBadRequest,
			expectUser:     false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			body, _ := json.Marshal(tt.requestBody)
			req := httptest.NewRequest(http.MethodPost, "/api/auth/register", bytes.NewReader(body))
			req.Header.Set("Content-Type", "application/json")
			rr := httptest.NewRecorder()

			handlers.RegisterUser(rr, req)

			if rr.Code != tt.expectedStatus {
				t.Errorf("expected status %d, got %d. Body: %s", tt.expectedStatus, rr.Code, rr.Body.String())
				return
			}

			if tt.expectUser {
				var response struct {
					User struct {
						ID       string   `json:"id"`
						Email    string   `json:"email"`
						Username string   `json:"username"`
						Roles    []string `json:"roles"`
					} `json:"user"`
				}

				if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
					t.Fatalf("failed to decode response: %v", err)
				}

				if response.User.ID == "" {
					t.Error("expected user ID to be set")
				}
				if response.User.Email != strings.ToLower(tt.requestBody["email"]) {
					t.Errorf("expected email %s, got %s", strings.ToLower(tt.requestBody["email"]), response.User.Email)
				}
				if response.User.Username != tt.requestBody["username"] {
					t.Errorf("expected username %s, got %s", tt.requestBody["username"], response.User.Username)
				}

				hasAdmin := false
				for _, role := range response.User.Roles {
					if role == domain.RoleAdministrator {
						hasAdmin = true
						break
					}
				}

				if tt.expectAdmin && !hasAdmin {
					t.Error("expected user to have administrator role")
				}
				if !tt.expectAdmin && hasAdmin {
					t.Error("expected user to not have administrator role")
				}

				// Check for session cookie
				cookies := rr.Result().Cookies()
				foundSessionCookie := false
				for _, cookie := range cookies {
					if cookie.Name == "shadowmaster_session" {
						foundSessionCookie = true
						if cookie.Value == "" {
							t.Error("expected session cookie to have a value")
						}
						break
					}
				}
				if !foundSessionCookie {
					t.Error("expected session cookie to be set")
				}
			}
		})
	}
}

func TestLoginUser(t *testing.T) {
	handlers, _ := setupAuthTest(t)

	// First, register a user
	registerBody := map[string]string{
		"email":    "test@test.com",
		"username": "testuser",
		"password": "Test1234",
	}
	body, _ := json.Marshal(registerBody)
	req := httptest.NewRequest(http.MethodPost, "/api/auth/register", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	handlers.RegisterUser(rr, req)

	if rr.Code != http.StatusCreated {
		t.Fatalf("failed to register user: %d", rr.Code)
	}

	tests := []struct {
		name           string
		requestBody    map[string]string
		expectedStatus int
		expectUser     bool
		expectCookie   bool
	}{
		{
			name: "valid credentials",
			requestBody: map[string]string{
				"email":    "test@test.com",
				"password": "Test1234",
			},
			expectedStatus: http.StatusOK,
			expectUser:     true,
			expectCookie:   true,
		},
		{
			name: "invalid email",
			requestBody: map[string]string{
				"email":    "wrong@test.com",
				"password": "Test1234",
			},
			expectedStatus: http.StatusUnauthorized,
			expectUser:     false,
			expectCookie:   false,
		},
		{
			name: "invalid password",
			requestBody: map[string]string{
				"email":    "test@test.com",
				"password": "WrongPassword",
			},
			expectedStatus: http.StatusUnauthorized,
			expectUser:     false,
			expectCookie:   false,
		},
		{
			name: "missing email",
			requestBody: map[string]string{
				"password": "Test1234",
			},
			expectedStatus: http.StatusBadRequest,
			expectUser:     false,
			expectCookie:   false,
		},
		{
			name: "missing password",
			requestBody: map[string]string{
				"email": "test@test.com",
			},
			expectedStatus: http.StatusBadRequest,
			expectUser:     false,
			expectCookie:   false,
		},
		{
			name: "case insensitive email",
			requestBody: map[string]string{
				"email":    "TEST@TEST.COM",
				"password": "Test1234",
			},
			expectedStatus: http.StatusOK,
			expectUser:     true,
			expectCookie:   true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			body, _ := json.Marshal(tt.requestBody)
			req := httptest.NewRequest(http.MethodPost, "/api/auth/login", bytes.NewReader(body))
			req.Header.Set("Content-Type", "application/json")
			rr := httptest.NewRecorder()

			handlers.LoginUser(rr, req)

			if rr.Code != tt.expectedStatus {
				t.Errorf("expected status %d, got %d. Body: %s", tt.expectedStatus, rr.Code, rr.Body.String())
				return
			}

			if tt.expectUser {
				var response struct {
					User struct {
						ID       string   `json:"id"`
						Email    string   `json:"email"`
						Username string   `json:"username"`
						Roles    []string `json:"roles"`
					} `json:"user"`
				}

				if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
					t.Fatalf("failed to decode response: %v", err)
				}

				if response.User.Email != "test@test.com" {
					t.Errorf("expected email test@test.com, got %s", response.User.Email)
				}
				if response.User.Username != "testuser" {
					t.Errorf("expected username testuser, got %s", response.User.Username)
				}
			}

			// Check for session cookie
			cookies := rr.Result().Cookies()
			foundSessionCookie := false
			for _, cookie := range cookies {
				if cookie.Name == "shadowmaster_session" {
					foundSessionCookie = true
					if tt.expectCookie && cookie.Value == "" {
						t.Error("expected session cookie to have a value")
					}
					if !tt.expectCookie && cookie.Value != "" {
						t.Error("expected session cookie to not be set")
					}
					break
				}
			}
			if tt.expectCookie && !foundSessionCookie {
				t.Error("expected session cookie to be set")
			}
		})
	}
}

func TestGetCurrentUser(t *testing.T) {
	handlers, sessionManager := setupAuthTest(t)

	// Register and login a user
	registerBody := map[string]string{
		"email":    "test@test.com",
		"username": "testuser",
		"password": "Test1234",
	}
	body, _ := json.Marshal(registerBody)
	req := httptest.NewRequest(http.MethodPost, "/api/auth/register", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	handlers.RegisterUser(rr, req)

	var registerResponse struct {
		User struct {
			ID    string   `json:"id"`
			Roles []string `json:"roles"`
		} `json:"user"`
	}
	json.Unmarshal(rr.Body.Bytes(), &registerResponse)

	// Get session cookie
	var sessionCookie *http.Cookie
	for _, cookie := range rr.Result().Cookies() {
		if cookie.Name == "shadowmaster_session" {
			sessionCookie = cookie
			break
		}
	}

	if sessionCookie == nil {
		t.Fatal("expected session cookie from registration")
	}

	tests := []struct {
		name           string
		includeCookie  bool
		expectedStatus int
		expectUser     bool
	}{
		{
			name:           "with valid session",
			includeCookie:  true,
			expectedStatus: http.StatusOK,
			expectUser:     true,
		},
		{
			name:           "without session",
			includeCookie:  false,
			expectedStatus: http.StatusOK,
			expectUser:     false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, "/api/auth/me", nil)
			if tt.includeCookie {
				req.AddCookie(sessionCookie)
			}
			rr := httptest.NewRecorder()

			// Need to use middleware to set session in context
			handler := sessionManager.WithSession(http.HandlerFunc(handlers.GetCurrentUser))
			handler.ServeHTTP(rr, req)

			if rr.Code != tt.expectedStatus {
				t.Errorf("expected status %d, got %d. Body: %s", tt.expectedStatus, rr.Code, rr.Body.String())
				return
			}

			var response struct {
				User *struct {
					ID       string   `json:"id"`
					Email    string   `json:"email"`
					Username string   `json:"username"`
					Roles    []string `json:"roles"`
				} `json:"user"`
			}

			if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
				t.Fatalf("failed to decode response: %v", err)
			}

			if tt.expectUser {
				if response.User == nil {
					t.Error("expected user to be present")
					return
				}
				if response.User.ID != registerResponse.User.ID {
					t.Errorf("expected user ID %s, got %s", registerResponse.User.ID, response.User.ID)
				}
				if response.User.Email != "test@test.com" {
					t.Errorf("expected email test@test.com, got %s", response.User.Email)
				}
			} else {
				if response.User != nil {
					t.Error("expected user to be nil")
				}
			}
		})
	}
}

func TestLogoutUser(t *testing.T) {
	handlers, sessionManager := setupAuthTest(t)

	// Register a user to get a session
	registerBody := map[string]string{
		"email":    "test@test.com",
		"username": "testuser",
		"password": "Test1234",
	}
	body, _ := json.Marshal(registerBody)
	req := httptest.NewRequest(http.MethodPost, "/api/auth/register", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	handlers.RegisterUser(rr, req)

	// Get session cookie
	var sessionCookie *http.Cookie
	for _, cookie := range rr.Result().Cookies() {
		if cookie.Name == "shadowmaster_session" {
			sessionCookie = cookie
			break
		}
	}

	if sessionCookie == nil {
		t.Fatal("expected session cookie from registration")
	}

	tests := []struct {
		name           string
		includeCookie  bool
		expectedStatus int
		expectCleared  bool
	}{
		{
			name:           "with valid session",
			includeCookie:  true,
			expectedStatus: http.StatusNoContent,
			expectCleared:  true,
		},
		{
			name:           "without session",
			includeCookie:  false,
			expectedStatus: http.StatusUnauthorized,
			expectCleared:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodPost, "/api/auth/logout", nil)
			if tt.includeCookie {
				req.AddCookie(sessionCookie)
			}
			rr := httptest.NewRecorder()

			// Need to use both middlewares: WithSession to extract cookie, then RequireAuth
			handler := sessionManager.WithSession(
				sessionManager.RequireAuth(http.HandlerFunc(handlers.LogoutUser)),
			)
			handler.ServeHTTP(rr, req)

			if rr.Code != tt.expectedStatus {
				t.Errorf("expected status %d, got %d", tt.expectedStatus, rr.Code)
				return
			}

			if tt.expectCleared {
				// Check that cookie is cleared
				cookies := rr.Result().Cookies()
				foundClearedCookie := false
				for _, cookie := range cookies {
					if cookie.Name == "shadowmaster_session" {
						foundClearedCookie = true
						if cookie.Value != "" {
							t.Error("expected session cookie to be cleared (empty value)")
						}
						if cookie.MaxAge >= 0 {
							t.Error("expected session cookie MaxAge to be negative")
						}
						break
					}
				}
				if !foundClearedCookie {
					t.Error("expected cleared session cookie to be present")
				}
			}
		})
	}
}

func TestAuthFlow(t *testing.T) {
	handlers, sessionManager := setupAuthTest(t)

	// 1. Register a new user
	registerBody := map[string]string{
		"email":    "flow@test.com",
		"username": "flowuser",
		"password": "Test1234",
	}
	body, _ := json.Marshal(registerBody)
	req := httptest.NewRequest(http.MethodPost, "/api/auth/register", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	handlers.RegisterUser(rr, req)

	if rr.Code != http.StatusCreated {
		t.Fatalf("registration failed: %d, body: %s", rr.Code, rr.Body.String())
	}

	var registerResponse struct {
		User struct {
			ID string `json:"id"`
		} `json:"user"`
	}
	json.Unmarshal(rr.Body.Bytes(), &registerResponse)

	// Get session cookie from registration
	var sessionCookie *http.Cookie
	for _, cookie := range rr.Result().Cookies() {
		if cookie.Name == "shadowmaster_session" {
			sessionCookie = cookie
			break
		}
	}

	if sessionCookie == nil {
		t.Fatal("expected session cookie from registration")
	}

	// 2. Verify we can get current user with the session
	req = httptest.NewRequest(http.MethodGet, "/api/auth/me", nil)
	req.AddCookie(sessionCookie)
	rr = httptest.NewRecorder()
	handler := sessionManager.WithSession(http.HandlerFunc(handlers.GetCurrentUser))
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("get current user failed: %d", rr.Code)
	}

	var meResponse struct {
		User struct {
			ID string `json:"id"`
		} `json:"user"`
	}
	json.Unmarshal(rr.Body.Bytes(), &meResponse)

	if meResponse.User.ID != registerResponse.User.ID {
		t.Errorf("expected user ID %s, got %s", registerResponse.User.ID, meResponse.User.ID)
	}

	// 3. Logout
	req = httptest.NewRequest(http.MethodPost, "/api/auth/logout", nil)
	req.AddCookie(sessionCookie)
	rr = httptest.NewRecorder()
	handler = sessionManager.WithSession(
		sessionManager.RequireAuth(http.HandlerFunc(handlers.LogoutUser)),
	)
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusNoContent {
		t.Fatalf("logout failed: %d", rr.Code)
	}

	// 4. Verify we can't get current user after logout
	req = httptest.NewRequest(http.MethodGet, "/api/auth/me", nil)
	// Don't add cookie - it should be cleared
	rr = httptest.NewRecorder()
	handler = sessionManager.WithSession(http.HandlerFunc(handlers.GetCurrentUser))
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("get current user after logout failed: %d", rr.Code)
	}

	var meAfterLogout struct {
		User *struct {
			ID string `json:"id"`
		} `json:"user"`
	}
	json.Unmarshal(rr.Body.Bytes(), &meAfterLogout)

	if meAfterLogout.User != nil {
		t.Error("expected user to be nil after logout")
	}

	// 5. Login again
	loginBody := map[string]string{
		"email":    "flow@test.com",
		"password": "Test1234",
	}
	body, _ = json.Marshal(loginBody)
	req = httptest.NewRequest(http.MethodPost, "/api/auth/login", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	handlers.LoginUser(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("login failed: %d, body: %s", rr.Code, rr.Body.String())
	}

	// Get new session cookie
	var newSessionCookie *http.Cookie
	for _, cookie := range rr.Result().Cookies() {
		if cookie.Name == "shadowmaster_session" {
			newSessionCookie = cookie
			break
		}
	}

	if newSessionCookie == nil {
		t.Fatal("expected session cookie from login")
	}

	// 6. Verify we can get current user with new session
	req = httptest.NewRequest(http.MethodGet, "/api/auth/me", nil)
	req.AddCookie(newSessionCookie)
	rr = httptest.NewRecorder()
	handler = sessionManager.WithSession(http.HandlerFunc(handlers.GetCurrentUser))
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("get current user after login failed: %d", rr.Code)
	}

	var meAfterLogin struct {
		User struct {
			ID string `json:"id"`
		} `json:"user"`
	}
	json.Unmarshal(rr.Body.Bytes(), &meAfterLogin)

	if meAfterLogin.User.ID != registerResponse.User.ID {
		t.Errorf("expected user ID %s, got %s", registerResponse.User.ID, meAfterLogin.User.ID)
	}
}

