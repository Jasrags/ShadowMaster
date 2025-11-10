package service

import (
	"shadowmaster/internal/domain"
	jsonrepo "shadowmaster/internal/repository/json"
	"shadowmaster/pkg/storage"
	"testing"
	"time"
)

func TestSessionServiceCreateAndUpdate(t *testing.T) {
	dir := t.TempDir()
	store, err := storage.NewJSONStore(dir)
	if err != nil {
		t.Fatalf("new store: %v", err)
	}
	index := jsonrepo.NewIndex()
	campaignRepo := jsonrepo.NewCampaignRepository(store, index)
	sessionRepo := jsonrepo.NewSessionRepository(store, index)
	service := NewSessionService(sessionRepo, campaignRepo)

	campaign := &domain.Campaign{
		Name:    "Night Ops",
		Edition: "sr5",
	}
	if err := campaignRepo.Create(campaign); err != nil {
		t.Fatalf("create campaign: %v", err)
	}

	session := &domain.Session{
		CampaignID:  campaign.ID,
		Name:        "Session One",
		SessionDate: time.Now(),
	}
	if _, err := service.CreateSession(session); err != nil {
		t.Fatalf("create session: %v", err)
	}

	if session.Status != "Planned" {
		t.Fatalf("expected default status planned, got %s", session.Status)
	}

	session.Status = "Active"
	if _, err := service.UpdateSession(session.ID, session); err != nil {
		t.Fatalf("update session: %v", err)
	}

	session.CampaignID = "other"
	if _, err := service.UpdateSession(session.ID, session); err == nil {
		t.Fatal("expected error when attempting to change campaign ID")
	}
}

func TestSessionServiceRequiresCampaign(t *testing.T) {
	dir := t.TempDir()
	store, _ := storage.NewJSONStore(dir)
	index := jsonrepo.NewIndex()
	sessionRepo := jsonrepo.NewSessionRepository(store, index)
	service := NewSessionService(sessionRepo, jsonrepo.NewCampaignRepository(store, index))

	session := &domain.Session{Name: "Invalid"}
	if _, err := service.CreateSession(session); err == nil {
		t.Fatal("expected error when campaign ID missing")
	}
}
