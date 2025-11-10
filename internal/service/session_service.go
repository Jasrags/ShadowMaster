package service

import (
	"fmt"
	"strings"
	"time"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
)

// SessionService manages sessions.
type SessionService struct {
	sessionRepo  repository.SessionRepository
	campaignRepo repository.CampaignRepository
}

// NewSessionService constructs a SessionService.
func NewSessionService(sessionRepo repository.SessionRepository, campaignRepo repository.CampaignRepository) *SessionService {
	return &SessionService{
		sessionRepo:  sessionRepo,
		campaignRepo: campaignRepo,
	}
}

// ListSessions returns all sessions.
func (s *SessionService) ListSessions() ([]*domain.Session, error) {
	return s.sessionRepo.GetAll()
}

// GetSession fetches a session by ID.
func (s *SessionService) GetSession(id string) (*domain.Session, error) {
	session, err := s.sessionRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrSessionNotFound, err)
	}
	return session, nil
}

// CreateSession validates and persists a session.
func (s *SessionService) CreateSession(session *domain.Session) (*domain.Session, error) {
	if strings.TrimSpace(session.CampaignID) == "" {
		return nil, ErrSessionCampaignRequired
	}

	if _, err := s.campaignRepo.GetByID(session.CampaignID); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrCampaignNotFound, err)
	}

	if session.Status == "" {
		session.Status = "Planned"
	}

	if err := s.sessionRepo.Create(session); err != nil {
		return nil, err
	}
	return session, nil
}

// UpdateSession updates editable fields of a session.
func (s *SessionService) UpdateSession(id string, session *domain.Session) (*domain.Session, error) {
	existing, err := s.sessionRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrSessionNotFound, err)
	}

	if existing.CampaignID != "" && session.CampaignID != "" && existing.CampaignID != session.CampaignID {
		return nil, ErrSessionImmutableCampaign
	}

	session.ID = existing.ID
	session.CampaignID = existing.CampaignID
	session.CreatedAt = existing.CreatedAt
	if session.SessionDate.IsZero() {
		session.SessionDate = existing.SessionDate
	}
	if session.Status == "" {
		session.Status = existing.Status
	}

	if err := s.sessionRepo.Update(session); err != nil {
		return nil, err
	}
	return session, nil
}

// DeleteSession deletes a session.
func (s *SessionService) DeleteSession(id string) error {
	return s.sessionRepo.Delete(id)
}

// EnsureSessionDate sets default session date if unset.
func EnsureSessionDate(session *domain.Session) {
	if session.SessionDate.IsZero() {
		session.SessionDate = time.Now()
	}
}
