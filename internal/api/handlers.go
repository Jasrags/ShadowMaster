package api

import (
	"encoding/json"
	"net/http"
	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
	"shadowmaster/internal/repository/json"
)

// Handlers wraps repository instances for API handlers
type Handlers struct {
	CharacterRepo repository.CharacterRepository
	GroupRepo     repository.GroupRepository
	CampaignRepo  repository.CampaignRepository
	SessionRepo   repository.SessionRepository
	SceneRepo     repository.SceneRepository
}

// NewHandlers creates a new handlers instance
func NewHandlers(repos *jsonrepo.Repositories) *Handlers {
	return &Handlers{
		CharacterRepo: repos.Character,
		GroupRepo:     repos.Group,
		CampaignRepo:  repos.Campaign,
		SessionRepo:   repos.Session,
		SceneRepo:     repos.Scene,
	}
}

// Character handlers

// GetCharacters handles GET /api/characters
func (h *Handlers) GetCharacters(w http.ResponseWriter, r *http.Request) {
	characters, err := h.CharacterRepo.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	respondJSON(w, http.StatusOK, characters)
}

// GetCharacter handles GET /api/characters/{id}
func (h *Handlers) GetCharacter(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	character, err := h.CharacterRepo.GetByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	respondJSON(w, http.StatusOK, character)
}

// CreateCharacter handles POST /api/characters
func (h *Handlers) CreateCharacter(w http.ResponseWriter, r *http.Request) {
	var character domain.Character
	if err := json.NewDecoder(r.Body).Decode(&character); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.CharacterRepo.Create(&character); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusCreated, character)
}

// UpdateCharacter handles PUT /api/characters/{id}
func (h *Handlers) UpdateCharacter(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var character domain.Character
	if err := json.NewDecoder(r.Body).Decode(&character); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	character.ID = id
	if err := h.CharacterRepo.Update(&character); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusOK, character)
}

// DeleteCharacter handles DELETE /api/characters/{id}
func (h *Handlers) DeleteCharacter(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if err := h.CharacterRepo.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Group handlers

// GetGroups handles GET /api/groups
func (h *Handlers) GetGroups(w http.ResponseWriter, r *http.Request) {
	groups, err := h.GroupRepo.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	respondJSON(w, http.StatusOK, groups)
}

// GetGroup handles GET /api/groups/{id}
func (h *Handlers) GetGroup(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	group, err := h.GroupRepo.GetByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	respondJSON(w, http.StatusOK, group)
}

// CreateGroup handles POST /api/groups
func (h *Handlers) CreateGroup(w http.ResponseWriter, r *http.Request) {
	var group domain.Group
	if err := json.NewDecoder(r.Body).Decode(&group); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.GroupRepo.Create(&group); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusCreated, group)
}

// UpdateGroup handles PUT /api/groups/{id}
func (h *Handlers) UpdateGroup(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var group domain.Group
	if err := json.NewDecoder(r.Body).Decode(&group); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	group.ID = id
	if err := h.GroupRepo.Update(&group); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusOK, group)
}

// DeleteGroup handles DELETE /api/groups/{id}
func (h *Handlers) DeleteGroup(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if err := h.GroupRepo.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Campaign handlers

// GetCampaigns handles GET /api/campaigns
func (h *Handlers) GetCampaigns(w http.ResponseWriter, r *http.Request) {
	campaigns, err := h.CampaignRepo.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	respondJSON(w, http.StatusOK, campaigns)
}

// GetCampaign handles GET /api/campaigns/{id}
func (h *Handlers) GetCampaign(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	campaign, err := h.CampaignRepo.GetByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	respondJSON(w, http.StatusOK, campaign)
}

// CreateCampaign handles POST /api/campaigns
func (h *Handlers) CreateCampaign(w http.ResponseWriter, r *http.Request) {
	var campaign domain.Campaign
	if err := json.NewDecoder(r.Body).Decode(&campaign); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.CampaignRepo.Create(&campaign); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusCreated, campaign)
}

// UpdateCampaign handles PUT /api/campaigns/{id}
func (h *Handlers) UpdateCampaign(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var campaign domain.Campaign
	if err := json.NewDecoder(r.Body).Decode(&campaign); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	campaign.ID = id
	if err := h.CampaignRepo.Update(&campaign); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusOK, campaign)
}

// DeleteCampaign handles DELETE /api/campaigns/{id}
func (h *Handlers) DeleteCampaign(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if err := h.CampaignRepo.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Session handlers

// GetSessions handles GET /api/sessions
func (h *Handlers) GetSessions(w http.ResponseWriter, r *http.Request) {
	sessions, err := h.SessionRepo.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	respondJSON(w, http.StatusOK, sessions)
}

// GetSession handles GET /api/sessions/{id}
func (h *Handlers) GetSession(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	session, err := h.SessionRepo.GetByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	respondJSON(w, http.StatusOK, session)
}

// CreateSession handles POST /api/sessions
func (h *Handlers) CreateSession(w http.ResponseWriter, r *http.Request) {
	var session domain.Session
	if err := json.NewDecoder(r.Body).Decode(&session); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.SessionRepo.Create(&session); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusCreated, session)
}

// UpdateSession handles PUT /api/sessions/{id}
func (h *Handlers) UpdateSession(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var session domain.Session
	if err := json.NewDecoder(r.Body).Decode(&session); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	session.ID = id
	if err := h.SessionRepo.Update(&session); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusOK, session)
}

// DeleteSession handles DELETE /api/sessions/{id}
func (h *Handlers) DeleteSession(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if err := h.SessionRepo.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Scene handlers

// GetScenes handles GET /api/scenes
func (h *Handlers) GetScenes(w http.ResponseWriter, r *http.Request) {
	scenes, err := h.SceneRepo.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	respondJSON(w, http.StatusOK, scenes)
}

// GetScene handles GET /api/scenes/{id}
func (h *Handlers) GetScene(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	scene, err := h.SceneRepo.GetByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	respondJSON(w, http.StatusOK, scene)
}

// CreateScene handles POST /api/scenes
func (h *Handlers) CreateScene(w http.ResponseWriter, r *http.Request) {
	var scene domain.Scene
	if err := json.NewDecoder(r.Body).Decode(&scene); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.SceneRepo.Create(&scene); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusCreated, scene)
}

// UpdateScene handles PUT /api/scenes/{id}
func (h *Handlers) UpdateScene(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var scene domain.Scene
	if err := json.NewDecoder(r.Body).Decode(&scene); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	scene.ID = id
	if err := h.SceneRepo.Update(&scene); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusOK, scene)
}

// DeleteScene handles DELETE /api/scenes/{id}
func (h *Handlers) DeleteScene(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if err := h.SceneRepo.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// respondJSON sends a JSON response
func respondJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
