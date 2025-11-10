package service

import (
	"shadowmaster/internal/domain"
	jsonrepo "shadowmaster/internal/repository/json"
	"shadowmaster/pkg/storage"
	"testing"
)

func TestSceneServiceCreateAndUpdate(t *testing.T) {
	dir := t.TempDir()
	store, err := storage.NewJSONStore(dir)
	if err != nil {
		t.Fatalf("new store: %v", err)
	}

	index := jsonrepo.NewIndex()
	campaignRepo := jsonrepo.NewCampaignRepository(store, index)
	sessionRepo := jsonrepo.NewSessionRepository(store, index)
	sceneRepo := jsonrepo.NewSceneRepository(store, index)

	campaign := &domain.Campaign{Name: "Campaign", Edition: "sr5"}
	if err := campaignRepo.Create(campaign); err != nil {
		t.Fatalf("create campaign: %v", err)
	}

	session := &domain.Session{CampaignID: campaign.ID, Name: "Session"}
	if err := sessionRepo.Create(session); err != nil {
		t.Fatalf("create session: %v", err)
	}

	service := NewSceneService(sceneRepo, sessionRepo)

	scene := &domain.Scene{
		SessionID: session.ID,
		Name:      "Scene 1",
		Type:      "Combat",
	}

	if _, err := service.CreateScene(scene); err != nil {
		t.Fatalf("create scene: %v", err)
	}
	if scene.Status != "Planned" {
		t.Fatalf("expected default status planned, got %s", scene.Status)
	}

	scene.Status = "Active"
	if _, err := service.UpdateScene(scene.ID, scene); err != nil {
		t.Fatalf("update scene: %v", err)
	}

	scene.SessionID = "other"
	if _, err := service.UpdateScene(scene.ID, scene); err == nil {
		t.Fatal("expected error when attempting to change session ID")
	}
}

func TestSceneServiceRequiresSession(t *testing.T) {
	dir := t.TempDir()
	store, _ := storage.NewJSONStore(dir)
	index := jsonrepo.NewIndex()
	sceneRepo := jsonrepo.NewSceneRepository(store, index)
	service := NewSceneService(sceneRepo, jsonrepo.NewSessionRepository(store, index))

	scene := &domain.Scene{Name: "Invalid Scene"}
	if _, err := service.CreateScene(scene); err == nil {
		t.Fatal("expected error when session ID missing")
	}
}
