package api

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"net/http"
	"sync"
	"time"

	"shadowmaster/internal/domain"
)

type Session struct {
	ID        string
	UserID    string
	Roles     []domain.Role
	ExpiresAt time.Time
}

type SessionManager struct {
	mu       sync.RWMutex
	sessions map[string]*Session
	secret   string
	duration time.Duration
	secure   bool // Set to true in production
}

func NewSessionManager(secret string, duration time.Duration, secure bool) *SessionManager {
	sm := &SessionManager{
		sessions: make(map[string]*Session),
		secret:   secret,
		duration: duration,
		secure:   secure,
	}

	// Cleanup expired sessions periodically
	go sm.cleanup()

	return sm
}

func (sm *SessionManager) Create(w http.ResponseWriter, userID string, roles []domain.Role) error {
	sessionID, err := generateSessionID()
	if err != nil {
		return err
	}

	session := &Session{
		ID:        sessionID,
		UserID:    userID,
		Roles:     roles,
		ExpiresAt: time.Now().Add(sm.duration),
	}

	sm.mu.Lock()
	sm.sessions[sessionID] = session
	sm.mu.Unlock()

	cookie := &http.Cookie{
		Name:     "session",
		Value:    sessionID,
		Path:     "/",
		HttpOnly: true,
		Secure:   sm.secure,
		SameSite: http.SameSiteLaxMode,
		Expires:  session.ExpiresAt,
	}

	http.SetCookie(w, cookie)
	return nil
}

func (sm *SessionManager) Get(r *http.Request) (*Session, error) {
	cookie, err := r.Cookie("session")
	if err != nil {
		return nil, err
	}

	sm.mu.RLock()
	session, exists := sm.sessions[cookie.Value]
	sm.mu.RUnlock()

	if !exists {
		return nil, http.ErrNoCookie
	}

	if time.Now().After(session.ExpiresAt) {
		sm.Delete(r)
		return nil, http.ErrNoCookie
	}

	return session, nil
}

func (sm *SessionManager) Delete(r *http.Request) {
	cookie, err := r.Cookie("session")
	if err != nil {
		return
	}

	sm.mu.Lock()
	delete(sm.sessions, cookie.Value)
	sm.mu.Unlock()
}

func (sm *SessionManager) Clear(w http.ResponseWriter) {
	cookie := &http.Cookie{
		Name:     "session",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   sm.secure,
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now(),
		MaxAge:   -1,
	}
	http.SetCookie(w, cookie)
}

func (sm *SessionManager) WithSession(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, err := sm.Get(r)
		if err == nil {
			// Store session in context for handlers to access
			ctx := context.WithValue(r.Context(), "session", session)
			r = r.WithContext(ctx)
		}
		next.ServeHTTP(w, r)
	})
}

func (sm *SessionManager) RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, err := sm.Get(r)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Store session in context for handlers to access
		ctx := context.WithValue(r.Context(), "session", session)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (sm *SessionManager) RequireRole(roles ...domain.Role) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			session, err := sm.Get(r)
			if err != nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			hasRole := false
			for _, requiredRole := range roles {
				for _, userRole := range session.Roles {
					if userRole == requiredRole {
						hasRole = true
						break
					}
				}
				if hasRole {
					break
				}
			}

			if !hasRole {
				http.Error(w, "Forbidden", http.StatusForbidden)
				return
			}

			ctx := context.WithValue(r.Context(), "session", session)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func (sm *SessionManager) cleanup() {
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	for range ticker.C {
		sm.mu.Lock()
		now := time.Now()
		for id, session := range sm.sessions {
			if now.After(session.ExpiresAt) {
				delete(sm.sessions, id)
			}
		}
		sm.mu.Unlock()
	}
}

func generateSessionID() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(bytes), nil
}

