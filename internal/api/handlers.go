package api

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/service"
	"shadowmaster/pkg/shadowrun/v5/creation"
)

type Handlers struct {
	UserService      *service.UserService
	CharacterService *service.CharacterService
	Sessions         *SessionManager
}

func NewHandlers(userService *service.UserService, characterService *service.CharacterService, sessions *SessionManager) *Handlers {
	return &Handlers{
		UserService:      userService,
		CharacterService: characterService,
		Sessions:         sessions,
	}
}

type registerRequest struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type changePasswordRequest struct {
	CurrentPassword string `json:"current_password"`
	NewPassword     string `json:"new_password"`
}

type updateUserRequest struct {
	Username *string  `json:"username"`
	Roles    []string `json:"roles"`
}

type userResponse struct {
	ID       string   `json:"id"`
	Email    string   `json:"email"`
	Username string   `json:"username"`
	Roles    []string `json:"roles"`
}

type createCharacterRequest struct {
	Name           string `json:"name"`
	Edition        string `json:"edition"`
	CreationMethod string `json:"creation_method"`
	PlayLevel      string `json:"play_level"`
}

type characterResponse struct {
	ID                string                      `json:"id"`
	Name              string                      `json:"name"`
	Description       string                      `json:"description"`
	Age               string                      `json:"age"`
	Gender            string                      `json:"gender"`
	Height            string                      `json:"height"`
	Weight            string                      `json:"weight"`
	State             string                      `json:"state"`
	UserID            string                      `json:"user_id"`
	EditionData       domain.EditionData          `json:"edition_data"`
	PriorityAssignment *domain.PriorityAssignment `json:"priority_assignment,omitempty"`
	CreatedAt         string                      `json:"created_at"`
	UpdatedAt         string                      `json:"updated_at"`
}

func (h *Handlers) RegisterUser(w http.ResponseWriter, r *http.Request) {
	var req registerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	req.Email = strings.TrimSpace(req.Email)
	req.Username = strings.TrimSpace(req.Username)
	if req.Email == "" || req.Username == "" || req.Password == "" {
		respondError(w, http.StatusBadRequest, "email, username, and password are required")
		return
	}

	user, err := h.UserService.Register(req.Email, req.Username, req.Password)
	if err != nil {
		status := http.StatusBadRequest
		if err == service.ErrEmailExists || err == service.ErrUsernameExists {
			status = http.StatusConflict
		}
		respondError(w, status, err.Error())
		return
	}

	// Auto-login after registration
	if err := h.Sessions.Create(w, user.ID, user.Roles); err != nil {
		respondError(w, http.StatusInternalServerError, "failed to create session")
		return
	}

	respondJSON(w, http.StatusCreated, userResponse{
		ID:       user.ID,
		Email:    user.Email,
		Username: user.Username,
		Roles:    rolesToStrings(user.Roles),
	})
}

func (h *Handlers) LoginUser(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	user, err := h.UserService.Authenticate(req.Email, req.Password)
	if err != nil {
		respondError(w, http.StatusUnauthorized, "invalid email or password")
		return
	}

	if err := h.Sessions.Create(w, user.ID, user.Roles); err != nil {
		respondError(w, http.StatusInternalServerError, "failed to create session")
		return
	}

	respondJSON(w, http.StatusOK, userResponse{
		ID:       user.ID,
		Email:    user.Email,
		Username: user.Username,
		Roles:    rolesToStrings(user.Roles),
	})
}

func (h *Handlers) LogoutUser(w http.ResponseWriter, r *http.Request) {
	h.Sessions.Clear(w)
	w.WriteHeader(http.StatusNoContent)
}

func (h *Handlers) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	session, err := h.Sessions.Get(r)
	if err != nil {
		respondError(w, http.StatusUnauthorized, "not authenticated")
		return
	}

	user, err := h.UserService.GetUser(session.UserID)
	if err != nil {
		respondError(w, http.StatusNotFound, "user not found")
		return
	}

	respondJSON(w, http.StatusOK, userResponse{
		ID:       user.ID,
		Email:    user.Email,
		Username: user.Username,
		Roles:    rolesToStrings(user.Roles),
	})
}

func (h *Handlers) ChangePassword(w http.ResponseWriter, r *http.Request) {
	session, err := h.Sessions.Get(r)
	if err != nil {
		respondError(w, http.StatusUnauthorized, "not authenticated")
		return
	}

	var req changePasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if err := h.UserService.ChangePassword(session.UserID, req.CurrentPassword, req.NewPassword); err != nil {
		status := http.StatusBadRequest
		if err == service.ErrInvalidCredentials {
			status = http.StatusUnauthorized
		}
		respondError(w, status, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handlers) GetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := h.UserService.GetAllUsers()
	if err != nil {
		respondError(w, http.StatusInternalServerError, "failed to get users")
		return
	}

	responses := make([]userResponse, len(users))
	for i, user := range users {
		responses[i] = userResponse{
			ID:       user.ID,
			Email:    user.Email,
			Username: user.Username,
			Roles:    rolesToStrings(user.Roles),
		}
	}

	respondJSON(w, http.StatusOK, responses)
}

func (h *Handlers) UpdateUser(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "id")
	if userID == "" {
		respondError(w, http.StatusBadRequest, "user ID is required")
		return
	}

	var req updateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	// Convert role strings to domain roles if provided
	var userRoles []domain.Role
	if req.Roles != nil {
		roles := stringsToRoles(req.Roles)
		if roles == nil {
			respondError(w, http.StatusBadRequest, "invalid role provided")
			return
		}
		userRoles = roles
	}

	// Update user
	user, err := h.UserService.UpdateUser(userID, req.Username, userRoles)
	if err != nil {
		status := http.StatusBadRequest
		if err == service.ErrUserNotFound {
			status = http.StatusNotFound
		} else if err == service.ErrUsernameExists {
			status = http.StatusConflict
		}
		respondError(w, status, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, userResponse{
		ID:       user.ID,
		Email:    user.Email,
		Username: user.Username,
		Roles:    rolesToStrings(user.Roles),
	})
}

func (h *Handlers) DeleteUser(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "id")
	if userID == "" {
		respondError(w, http.StatusBadRequest, "user ID is required")
		return
	}

	if err := h.UserService.DeleteUser(userID); err != nil {
		if err == service.ErrUserNotFound {
			respondError(w, http.StatusNotFound, "user not found")
			return
		}
		respondError(w, http.StatusInternalServerError, "failed to delete user")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handlers) CreateCharacter(w http.ResponseWriter, r *http.Request) {
	session, err := h.Sessions.Get(r)
	if err != nil {
		respondError(w, http.StatusUnauthorized, "not authenticated")
		return
	}

	var req createCharacterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	// Validate name
	req.Name = strings.TrimSpace(req.Name)
	if req.Name == "" {
		respondError(w, http.StatusBadRequest, "character name is required")
		return
	}

	// Validate edition data
	if req.Edition == "" || req.CreationMethod == "" || req.PlayLevel == "" {
		respondError(w, http.StatusBadRequest, "edition, creation method, and play level are required")
		return
	}

	editionData := domain.EditionData{
		Edition:        req.Edition,
		CreationMethod: req.CreationMethod,
		PlayLevel:      req.PlayLevel,
	}

	character, err := h.CharacterService.CreateCharacter(session.UserID, req.Name, editionData)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "failed to create character")
		return
	}

	respondJSON(w, http.StatusCreated, characterResponse{
		ID:                character.ID,
		Name:              character.Name,
		Description:       character.Description,
		Age:               character.Age,
		Gender:            character.Gender,
		Height:            character.Height,
		Weight:            character.Weight,
		State:             string(character.State),
		UserID:            character.UserID,
		EditionData:       character.EditionData,
		PriorityAssignment: character.PriorityAssignment,
		CreatedAt:         character.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:         character.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	})
}

func (h *Handlers) GetCharacters(w http.ResponseWriter, r *http.Request) {
	session, err := h.Sessions.Get(r)
	if err != nil {
		respondError(w, http.StatusUnauthorized, "not authenticated")
		return
	}

	characters, err := h.CharacterService.GetCharactersByUserID(session.UserID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "failed to get characters")
		return
	}

	responses := make([]characterResponse, len(characters))
	for i, character := range characters {
		responses[i] = characterResponse{
			ID:                character.ID,
			Name:              character.Name,
			Description:       character.Description,
			Age:               character.Age,
			Gender:            character.Gender,
			Height:            character.Height,
			Weight:            character.Weight,
			State:             string(character.State),
			UserID:            character.UserID,
			EditionData:       character.EditionData,
			PriorityAssignment: character.PriorityAssignment,
			CreatedAt:         character.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
			UpdatedAt:         character.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
		}
	}

	respondJSON(w, http.StatusOK, responses)
}

func (h *Handlers) GetCharacter(w http.ResponseWriter, r *http.Request) {
	session, err := h.Sessions.Get(r)
	if err != nil {
		respondError(w, http.StatusUnauthorized, "not authenticated")
		return
	}

	characterID := chi.URLParam(r, "id")
	if characterID == "" {
		respondError(w, http.StatusBadRequest, "character ID is required")
		return
	}

	character, err := h.CharacterService.GetCharacter(characterID)
	if err != nil {
		if err == service.ErrCharacterNotFound {
			respondError(w, http.StatusNotFound, "character not found")
			return
		}
		respondError(w, http.StatusInternalServerError, "failed to get character")
		return
	}

	// Verify the character belongs to the user
	if character.UserID != session.UserID {
		respondError(w, http.StatusForbidden, "you can only view your own characters")
		return
	}

	respondJSON(w, http.StatusOK, characterResponse{
		ID:                character.ID,
		Name:              character.Name,
		Description:       character.Description,
		Age:               character.Age,
		Gender:            character.Gender,
		Height:            character.Height,
		Weight:            character.Weight,
		State:             string(character.State),
		UserID:            character.UserID,
		EditionData:       character.EditionData,
		PriorityAssignment: character.PriorityAssignment,
		CreatedAt:         character.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:         character.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	})
}

func (h *Handlers) UpdateCharacter(w http.ResponseWriter, r *http.Request) {
	session, err := h.Sessions.Get(r)
	if err != nil {
		respondError(w, http.StatusUnauthorized, "not authenticated")
		return
	}

	characterID := chi.URLParam(r, "id")
	if characterID == "" {
		respondError(w, http.StatusBadRequest, "character ID is required")
		return
	}

	// Get the current character
	character, err := h.CharacterService.GetCharacter(characterID)
	if err != nil {
		if err == service.ErrCharacterNotFound {
			respondError(w, http.StatusNotFound, "character not found")
			return
		}
		respondError(w, http.StatusInternalServerError, "failed to get character")
		return
	}

	// Verify the character belongs to the user
	if character.UserID != session.UserID {
		respondError(w, http.StatusForbidden, "you can only update your own characters")
		return
	}

	// Decode the update request
	var req struct {
		Name               *string                      `json:"name"`
		Description        *string                      `json:"description"`
		Age                *string                      `json:"age"`
		Gender             *string                      `json:"gender"`
		Height             *string                      `json:"height"`
		Weight             *string                      `json:"weight"`
		PriorityAssignment *domain.PriorityAssignment   `json:"priority_assignment,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	// Update fields if provided
	if req.Name != nil {
		character.Name = *req.Name
	}
	if req.Description != nil {
		character.Description = *req.Description
	}
	if req.Age != nil {
		character.Age = *req.Age
	}
	if req.Gender != nil {
		character.Gender = *req.Gender
	}
	if req.Height != nil {
		character.Height = *req.Height
	}
	if req.Weight != nil {
		character.Weight = *req.Weight
	}
	if req.PriorityAssignment != nil {
		character.PriorityAssignment = req.PriorityAssignment
	}

	// Save the updated character
	if err := h.CharacterService.UpdateCharacter(character); err != nil {
		respondError(w, http.StatusInternalServerError, "failed to update character: "+err.Error())
		return
	}

	respondJSON(w, http.StatusOK, characterResponse{
		ID:                character.ID,
		Name:              character.Name,
		Description:       character.Description,
		Age:               character.Age,
		Gender:            character.Gender,
		Height:            character.Height,
		Weight:            character.Weight,
		State:             string(character.State),
		UserID:            character.UserID,
		EditionData:       character.EditionData,
		PriorityAssignment: character.PriorityAssignment,
		CreatedAt:         character.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:         character.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	})
}

func (h *Handlers) DeleteCharacter(w http.ResponseWriter, r *http.Request) {
	session, err := h.Sessions.Get(r)
	if err != nil {
		respondError(w, http.StatusUnauthorized, "not authenticated")
		return
	}

	characterID := chi.URLParam(r, "id")
	if characterID == "" {
		respondError(w, http.StatusBadRequest, "character ID is required")
		return
	}

	// Verify the character belongs to the user
	character, err := h.CharacterService.GetCharacter(characterID)
	if err != nil {
		if err == service.ErrCharacterNotFound {
			respondError(w, http.StatusNotFound, "character not found")
			return
		}
		respondError(w, http.StatusInternalServerError, "failed to get character")
		return
	}

	if character.UserID != session.UserID {
		respondError(w, http.StatusForbidden, "you can only delete your own characters")
		return
	}

	if err := h.CharacterService.DeleteCharacter(characterID); err != nil {
		if err == service.ErrCharacterNotFound {
			respondError(w, http.StatusNotFound, "character not found")
			return
		}
		respondError(w, http.StatusInternalServerError, "failed to delete character")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handlers) GetUser(w http.ResponseWriter, r *http.Request) {
	_, err := h.Sessions.Get(r)
	if err != nil {
		respondError(w, http.StatusUnauthorized, "not authenticated")
		return
	}

	userID := chi.URLParam(r, "id")
	if userID == "" {
		respondError(w, http.StatusBadRequest, "user ID is required")
		return
	}

	user, err := h.UserService.GetUser(userID)
	if err != nil {
		if err == service.ErrUserNotFound {
			respondError(w, http.StatusNotFound, "user not found")
			return
		}
		respondError(w, http.StatusInternalServerError, "failed to get user")
		return
	}

	respondJSON(w, http.StatusOK, userResponse{
		ID:       user.ID,
		Email:    user.Email,
		Username: user.Username,
		Roles:    rolesToStrings(user.Roles),
	})
}

func (h *Handlers) GetPriorityTables(w http.ResponseWriter, r *http.Request) {
	playLevel := r.URL.Query().Get("play_level")
	if playLevel == "" {
		playLevel = "experienced"
	}

	var level creation.PlayLevel
	switch playLevel {
	case "street":
		level = creation.PlayLevelStreet
	case "prime":
		level = creation.PlayLevelPrime
	default:
		level = creation.PlayLevelExperienced
	}

	tables := creation.GetPriorityTables(level)
	config := creation.GetPlayLevelConfig(level)

	response := map[string]interface{}{
		"tables": tables,
		"config": config,
	}

	respondJSON(w, http.StatusOK, response)
}

func (h *Handlers) HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

// Helper functions
func respondJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func respondError(w http.ResponseWriter, status int, message string) {
	respondJSON(w, status, map[string]string{"error": message})
}

func rolesToStrings(roles []domain.Role) []string {
	result := make([]string, len(roles))
	for i, role := range roles {
		result[i] = string(role)
	}
	return result
}

func stringsToRoles(roleStrings []string) []domain.Role {
	roles := make([]domain.Role, 0, len(roleStrings))
	for _, roleStr := range roleStrings {
		role := domain.Role(strings.ToLower(roleStr))
		// Validate role
		switch role {
		case domain.RoleAdministrator, domain.RoleGamemaster, domain.RolePlayer:
			roles = append(roles, role)
		default:
			return nil // Invalid role found
		}
	}
	return roles
}
