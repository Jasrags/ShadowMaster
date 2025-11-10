package api

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"
)

const (
	sessionCookieName = "shadowmaster_session"
	sessionVersion    = "v1"
)

// SessionData holds information extracted from a session cookie.
type SessionData struct {
	UserID string   `json:"user_id"`
	Roles  []string `json:"roles"`
}

// SessionManager handles issuing and validating signed session cookies.
type SessionManager struct {
	secret    []byte
	cookieTTL time.Duration
	secure    bool
}

// NewSessionManager creates a new session manager using the provided secret.
// If ttl is zero, sessions default to 7 days.
func NewSessionManager(secret string, ttl time.Duration, secure bool) *SessionManager {
	if secret == "" {
		secret = "shadowmaster-default-secret"
	}
	if ttl <= 0 {
		ttl = 7 * 24 * time.Hour
	}
	return &SessionManager{
		secret:    []byte(secret),
		cookieTTL: ttl,
		secure:    secure,
	}
}

// Create writes a session cookie for the provided user ID and roles.
func (sm *SessionManager) Create(w http.ResponseWriter, userID string, roles []string) error {
	payload := sm.encodePayload(userID, roles)
	signature := sm.sign(payload)
	token := payload + "." + signature

	http.SetCookie(w, &http.Cookie{
		Name:     sessionCookieName,
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   sm.secure,
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(sm.cookieTTL),
	})
	return nil
}

// Clear removes the session cookie.
func (sm *SessionManager) Clear(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     sessionCookieName,
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   sm.secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
	})
}

// Get extracts session data from the request cookie.
func (sm *SessionManager) Get(r *http.Request) (*SessionData, error) {
	cookie, err := r.Cookie(sessionCookieName)
	if err != nil {
		return nil, err
	}

	parts := strings.Split(cookie.Value, ".")
	if len(parts) != 2 {
		return nil, errors.New("invalid session token")
	}

	payload, signature := parts[0], parts[1]
	if !sm.verify(payload, signature) {
		return nil, errors.New("invalid session signature")
	}

	values := strings.Split(payload, "|")
	if len(values) != 4 {
		return nil, errors.New("invalid session payload")
	}

	if values[0] != sessionVersion {
		return nil, fmt.Errorf("unsupported session version: %s", values[0])
	}

	userID := values[1]
	roles := []string{}
	if values[3] != "" {
		for _, role := range strings.Split(values[3], ",") {
			role = strings.TrimSpace(role)
			if role != "" {
				roles = append(roles, role)
			}
		}
	}

	return &SessionData{
		UserID: userID,
		Roles:  roles,
	}, nil
}

// WithSession stores session data in the request context when available.
func (sm *SessionManager) WithSession(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, err := sm.Get(r)
		if err == nil {
			ctx := context.WithValue(r.Context(), sessionContextKey, session)
			next.ServeHTTP(w, r.WithContext(ctx))
			return
		}
		next.ServeHTTP(w, r)
	})
}

// RequireAuth ensures a valid session is present.
func (sm *SessionManager) RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session := GetSessionFromContext(r.Context())
		if session == nil {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// RequireRole ensures the current session includes at least one of the provided roles.
func (sm *SessionManager) RequireRole(roles ...string) func(http.Handler) http.Handler {
	roleSet := make(map[string]struct{}, len(roles))
	for _, role := range roles {
		roleSet[strings.ToLower(role)] = struct{}{}
	}
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			session := GetSessionFromContext(r.Context())
			if session == nil {
				http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
				return
			}
			for _, role := range session.Roles {
				if _, ok := roleSet[strings.ToLower(role)]; ok {
					next.ServeHTTP(w, r)
					return
				}
			}
			http.Error(w, http.StatusText(http.StatusForbidden), http.StatusForbidden)
		})
	}
}

func (sm *SessionManager) encodePayload(userID string, roles []string) string {
	roleValue := strings.Join(roles, ",")
	return fmt.Sprintf("%s|%s|%d|%s", sessionVersion, userID, time.Now().Unix(), roleValue)
}

func (sm *SessionManager) sign(payload string) string {
	mac := hmac.New(sha256.New, sm.secret)
	mac.Write([]byte(payload))
	return base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
}

func (sm *SessionManager) verify(payload, signature string) bool {
	expected := sm.sign(payload)
	return hmac.Equal([]byte(signature), []byte(expected))
}

type contextKey string

var sessionContextKey contextKey = "shadowmaster_session"

// GetSessionFromContext extracts session data set by middleware.
func GetSessionFromContext(ctx context.Context) *SessionData {
	if ctx == nil {
		return nil
	}
	if session, ok := ctx.Value(sessionContextKey).(*SessionData); ok {
		return session
	}
	return nil
}
