package api

import (
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
	jsonrepo "shadowmaster/internal/repository/json"
	"shadowmaster/internal/service"
	sr3 "shadowmaster/pkg/shadowrun/edition/v3"
	"strings"
)

// Handlers wraps repository instances for API handlers
type Handlers struct {
	CharacterRepo    repository.CharacterRepository
	GroupRepo        repository.GroupRepository
	CampaignRepo     repository.CampaignRepository
	SessionRepo      repository.SessionRepository
	SceneRepo        repository.SceneRepository
	EditionRepo      repository.EditionDataRepository
	UserRepo         repository.UserRepository
	CharacterService *service.CharacterService
	UserService      *service.UserService
	Sessions         *SessionManager
	CampaignService  *service.CampaignService
	SessionService   *service.SessionService
	SceneService     *service.SceneService
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

type campaignResponse struct {
	*domain.Campaign
	GameplayRules *service.GameplayRules `json:"gameplay_rules,omitempty"`
	CanEdit       bool                   `json:"can_edit"`
	CanDelete     bool                   `json:"can_delete"`
}

type campaignCharacterCreationResponse struct {
	CampaignID     string                        `json:"campaign_id"`
	Edition        string                        `json:"edition"`
	CreationMethod string                        `json:"creation_method"`
	EditionData    *domain.CharacterCreationData `json:"edition_data"`
	GameplayRules  *service.GameplayRules        `json:"gameplay_rules,omitempty"`
}

type userResponse struct {
	ID       string   `json:"id"`
	Email    string   `json:"email"`
	Username string   `json:"username"`
	Roles    []string `json:"roles"`
}

type campaignCreateRequest struct {
	Name           string                       `json:"name"`
	Description    string                       `json:"description"`
	GroupID        string                       `json:"group_id"`
	GMName         string                       `json:"gm_name"`
	GMUserID       string                       `json:"gm_user_id"`
	Edition        string                       `json:"edition"`
	CreationMethod string                       `json:"creation_method"`
	GameplayLevel  string                       `json:"gameplay_level"`
	Theme          string                       `json:"theme"`
	HouseRuleNotes string                       `json:"house_rule_notes"`
	Automation     map[string]bool              `json:"automation"`
	Factions       []campaignFactionRequest     `json:"factions"`
	Locations      []campaignLocationRequest    `json:"locations"`
	Placeholders   []campaignPlaceholderRequest `json:"placeholders"`
	SessionSeed    *campaignSessionSeedRequest  `json:"session_seed"`
	PlayerUserIDs  []string                     `json:"player_user_ids"`
	Players        []campaignPlayerRequest      `json:"players"`
	Status         string                       `json:"status"`
	EnabledBooks   []string                     `json:"enabled_books"`
}

type campaignUpdateRequest struct {
	Name           *string                       `json:"name"`
	Description    *string                       `json:"description"`
	GMName         *string                       `json:"gm_name"`
	GMUserID       *string                       `json:"gm_user_id"`
	GameplayLevel  *string                       `json:"gameplay_level"`
	Theme          *string                       `json:"theme"`
	HouseRuleNotes *string                       `json:"house_rule_notes"`
	Automation     *map[string]bool              `json:"automation"`
	Factions       *[]campaignFactionRequest     `json:"factions"`
	Locations      *[]campaignLocationRequest    `json:"locations"`
	Placeholders   *[]campaignPlaceholderRequest `json:"placeholders"`
	SessionSeed    *campaignSessionSeedRequest   `json:"session_seed"`
	PlayerUserIDs  *[]string                     `json:"player_user_ids"`
	Players        *[]campaignPlayerRequest      `json:"players"`
	Status         *string                       `json:"status"`
	CreationMethod *string                       `json:"creation_method"`
	Edition        *string                       `json:"edition"`
	EnabledBooks   *[]string                     `json:"enabled_books"`
}

type campaignFactionRequest struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Tags  string `json:"tags"`
	Notes string `json:"notes"`
}

type campaignLocationRequest struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Descriptor string `json:"descriptor"`
}

type campaignPlaceholderRequest struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Role string `json:"role"`
}

type campaignSessionSeedRequest struct {
	Title         string `json:"title"`
	Objectives    string `json:"objectives"`
	SceneTemplate string `json:"scene_template"`
	Summary       string `json:"summary"`
	Skip          bool   `json:"skip"`
}

type campaignPlayerRequest struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}

// NewHandlers creates a new handlers instance
func NewHandlers(
	repos *jsonrepo.Repositories,
	charService *service.CharacterService,
	userService *service.UserService,
	sessions *SessionManager,
	campaignService *service.CampaignService,
	sessionService *service.SessionService,
	sceneService *service.SceneService,
) *Handlers {
	return &Handlers{
		CharacterRepo:    repos.Character,
		GroupRepo:        repos.Group,
		CampaignRepo:     repos.Campaign,
		SessionRepo:      repos.Session,
		SceneRepo:        repos.Scene,
		EditionRepo:      repos.Edition,
		UserRepo:         repos.User,
		CharacterService: charService,
		UserService:      userService,
		Sessions:         sessions,
		CampaignService:  campaignService,
		SessionService:   sessionService,
		SceneService:     sceneService,
	}
}

// Auth handlers

// RegisterUser handles POST /api/auth/register
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
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.Sessions.Create(w, user.ID, user.Roles); err != nil {
		respondError(w, http.StatusInternalServerError, "failed to create session")
		return
	}

	respondJSON(w, http.StatusCreated, map[string]interface{}{
		"user": user,
	})
}

// LoginUser handles POST /api/auth/login
func (h *Handlers) LoginUser(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	req.Email = strings.TrimSpace(req.Email)
	if req.Email == "" || req.Password == "" {
		respondError(w, http.StatusBadRequest, "email and password are required")
		return
	}

	user, err := h.UserService.Authenticate(req.Email, req.Password)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCredentials) {
			respondError(w, http.StatusUnauthorized, "invalid email or password")
			return
		}
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	if err := h.Sessions.Create(w, user.ID, user.Roles); err != nil {
		respondError(w, http.StatusInternalServerError, "failed to create session")
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"user": user,
	})
}

// LogoutUser handles POST /api/auth/logout
func (h *Handlers) LogoutUser(w http.ResponseWriter, r *http.Request) {
	h.Sessions.Clear(w)
	w.WriteHeader(http.StatusNoContent)
}

// GetCurrentUser handles GET /api/auth/me
func (h *Handlers) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	session := GetSessionFromContext(r.Context())
	if session == nil {
		respondJSON(w, http.StatusOK, map[string]interface{}{
			"user": nil,
		})
		return
	}

	user, err := h.UserService.GetUserByID(session.UserID)
	if err != nil {
		respondJSON(w, http.StatusOK, map[string]interface{}{
			"user": nil,
		})
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"user": user,
	})
}

// ChangePassword handles POST /api/auth/password
func (h *Handlers) ChangePassword(w http.ResponseWriter, r *http.Request) {
	session := GetSessionFromContext(r.Context())
	if session == nil {
		var err error
		session, err = h.Sessions.Get(r)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}
	}

	var req changePasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if strings.TrimSpace(req.CurrentPassword) == "" || strings.TrimSpace(req.NewPassword) == "" {
		respondError(w, http.StatusBadRequest, "current_password and new_password are required")
		return
	}

	if err := h.UserService.ChangePasswordWithCurrent(session.UserID, req.CurrentPassword, req.NewPassword); err != nil {
		if errors.Is(err, service.ErrInvalidCredentials) {
			respondError(w, http.StatusUnauthorized, "invalid current password")
			return
		}
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
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

// GetEditionCharacterCreationData handles GET /api/editions/{edition}/character-creation
func (h *Handlers) GetEditionCharacterCreationData(w http.ResponseWriter, r *http.Request) {
	edition := r.PathValue("edition")
	if edition == "" {
		http.Error(w, "edition path parameter is required", http.StatusBadRequest)
		return
	}

	if h.EditionRepo == nil {
		http.Error(w, "edition repository not configured", http.StatusInternalServerError)
		return
	}

	data, err := h.EditionRepo.GetCharacterCreationData(edition)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			http.Error(w, "edition data not found", http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"edition":            edition,
		"character_creation": data,
	})
}

// GetEditionBooks handles GET /api/editions/{edition}/books
func (h *Handlers) GetEditionBooks(w http.ResponseWriter, r *http.Request) {
	edition := r.PathValue("edition")
	if edition == "" {
		respondError(w, http.StatusBadRequest, "edition is required")
		return
	}

	books, err := h.CampaignService.ListSourceBooks(edition)
	if err != nil {
		respondServiceError(w, err)
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"books": books,
	})
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
	var req struct {
		Name        string      `json:"name"`
		PlayerName  string      `json:"player_name"`
		Edition     string      `json:"edition"`
		EditionData interface{} `json:"edition_data"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// If SR3 edition with priority data, use character service
	if req.Edition == "sr3" && h.CharacterService != nil {
		editionDataMap, ok := req.EditionData.(map[string]interface{})
		if ok {
			priorities := service.PrioritySelection{
				Magic:      getStringFromMap(editionDataMap, "magic_priority", ""),
				Metatype:   getStringFromMap(editionDataMap, "metatype_priority", ""),
				Attributes: getStringFromMap(editionDataMap, "attr_priority", ""),
				Skills:     getStringFromMap(editionDataMap, "skills_priority", ""),
				Resources:  getStringFromMap(editionDataMap, "resources_priority", ""),
			}

			// Validate that all priorities are assigned (A-E)
			if priorities.Magic == "" || priorities.Metatype == "" || priorities.Attributes == "" ||
				priorities.Skills == "" || priorities.Resources == "" {
				http.Error(w, "All priorities (A-E) must be assigned to each category", http.StatusBadRequest)
				return
			}

			character, err := h.CharacterService.CreateSR3Character(req.Name, req.PlayerName, priorities)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			respondJSON(w, http.StatusCreated, character)
			return
		}
	}

	// Fallback to direct creation
	character := &domain.Character{
		Name:        req.Name,
		PlayerName:  req.PlayerName,
		Edition:     req.Edition,
		EditionData: req.EditionData,
	}

	if err := h.CharacterRepo.Create(character); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusCreated, character)
}

// getStringFromMap safely extracts a string value from a map
func getStringFromMap(m map[string]interface{}, key, defaultValue string) string {
	if val, ok := m[key]; ok {
		if str, ok := val.(string); ok {
			return str
		}
	}
	return defaultValue
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

// GetActiveSkills handles GET /api/skills/active
func (h *Handlers) GetActiveSkills(w http.ResponseWriter, r *http.Request) {
	skills := sr3.GetAllActiveSkills()
	respondJSON(w, http.StatusOK, map[string]interface{}{
		"skills":     skills,
		"categories": sr3.ActiveSkillCategories,
	})
}

// GetKnowledgeSkills handles GET /api/skills/knowledge
func (h *Handlers) GetKnowledgeSkills(w http.ResponseWriter, r *http.Request) {
	skills := sr3.GetAllKnowledgeSkills()
	respondJSON(w, http.StatusOK, map[string]interface{}{
		"skills":     skills,
		"categories": sr3.KnowledgeSkillCategories,
	})
}

// GetWeapons handles GET /api/equipment/weapons
func (h *Handlers) GetWeapons(w http.ResponseWriter, r *http.Request) {
	weapons := sr3.GetAllWeapons()
	weaponType := r.URL.Query().Get("type")
	if weaponType != "" {
		filtered := sr3.GetWeaponsByType(weaponType)
		respondJSON(w, http.StatusOK, map[string]interface{}{
			"weapons": filtered,
		})
		return
	}
	respondJSON(w, http.StatusOK, map[string]interface{}{
		"weapons": weapons,
	})
}

// GetArmor handles GET /api/equipment/armor
func (h *Handlers) GetArmor(w http.ResponseWriter, r *http.Request) {
	armor := sr3.GetAllArmor()
	armorType := r.URL.Query().Get("type")
	if armorType != "" {
		filtered := sr3.GetArmorByType(armorType)
		respondJSON(w, http.StatusOK, map[string]interface{}{
			"armor": filtered,
		})
		return
	}
	respondJSON(w, http.StatusOK, map[string]interface{}{
		"armor": armor,
	})
}

// GetCyberware handles GET /api/equipment/cyberware
func (h *Handlers) GetCyberware(w http.ResponseWriter, r *http.Request) {
	cyberware := sr3.GetAllCyberware()
	respondJSON(w, http.StatusOK, map[string]interface{}{
		"cyberware": cyberware,
	})
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
	allCampaigns, err := h.CampaignService.ListCampaigns()
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	session := GetSessionFromContext(r.Context())
	// Filter campaigns based on user role
	filteredCampaigns := h.filterCampaignsByRole(allCampaigns, session)

	response := make([]campaignResponse, 0, len(filteredCampaigns))
	for _, campaign := range filteredCampaigns {
		payload, err := h.buildCampaignResponse(session, campaign)
		if err != nil {
			respondServiceError(w, err)
			return
		}
		response = append(response, *payload)
	}

	respondJSON(w, http.StatusOK, response)
}

// GetCampaign handles GET /api/campaigns/{id}
func (h *Handlers) GetCampaign(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	campaign, err := h.CampaignService.GetCampaign(id)
	if err != nil {
		respondServiceError(w, err)
		return
	}
	session := GetSessionFromContext(r.Context())
	payload, err := h.buildCampaignResponse(session, campaign)
	if err != nil {
		respondServiceError(w, err)
		return
	}
	respondJSON(w, http.StatusOK, payload)
}

// GetCampaignCharacterCreationData handles GET /api/campaigns/{id}/character-creation
func (h *Handlers) GetCampaignCharacterCreationData(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		respondError(w, http.StatusBadRequest, "campaign id is required")
		return
	}

	campaign, err := h.CampaignService.GetCampaign(id)
	if err != nil {
		respondServiceError(w, err)
		return
	}

	if h.EditionRepo == nil {
		respondError(w, http.StatusInternalServerError, "edition repository not configured")
		return
	}

	editionData, err := h.EditionRepo.GetCharacterCreationData(campaign.Edition)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	rules, err := h.CampaignService.DescribeGameplayRules(campaign)
	if err != nil {
		respondServiceError(w, err)
		return
	}

	respondJSON(w, http.StatusOK, campaignCharacterCreationResponse{
		CampaignID:     campaign.ID,
		Edition:        campaign.Edition,
		CreationMethod: campaign.CreationMethod,
		EditionData:    editionData,
		GameplayRules:  rules,
	})
}

// CreateCampaign handles POST /api/campaigns
func (h *Handlers) CreateCampaign(w http.ResponseWriter, r *http.Request) {
	var req campaignCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	session := GetSessionFromContext(r.Context())
	campaign, err := h.CampaignService.CreateCampaign(service.CampaignCreateInput{
		Name:           req.Name,
		Description:    req.Description,
		GroupID:        req.GroupID,
		GMName:         req.GMName,
		GMUserID:       req.GMUserID,
		Edition:        req.Edition,
		CreationMethod: req.CreationMethod,
		GameplayLevel:  req.GameplayLevel,
		Theme:          req.Theme,
		HouseRuleNotes: req.HouseRuleNotes,
		Automation:     cloneAutomation(req.Automation),
		Factions:       toDomainFactions(req.Factions),
		Locations:      toDomainLocations(req.Locations),
		Placeholders:   toDomainPlaceholders(req.Placeholders),
		SessionSeed:    toDomainSessionSeed(req.SessionSeed),
		PlayerUserIDs:  normalizePlayerUserIDs(req.PlayerUserIDs),
		Players:        toDomainPlayers(req.Players),
		Status:         req.Status,
		EnabledBooks:   req.EnabledBooks,
	})
	if err != nil {
		respondServiceError(w, err)
		return
	}

	payload, err := h.buildCampaignResponse(session, campaign)
	if err != nil {
		respondServiceError(w, err)
		return
	}
	respondJSON(w, http.StatusCreated, payload)
}

// UpdateCampaign handles PUT /api/campaigns/{id}
func (h *Handlers) UpdateCampaign(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var req campaignUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	session := GetSessionFromContext(r.Context())
	existing, err := h.CampaignService.GetCampaign(id)
	if err != nil {
		respondServiceError(w, err)
		return
	}

	if !canManageCampaign(existing, session) {
		respondServiceError(w, service.ErrForbidden)
		return
	}

	campaign, err := h.CampaignService.UpdateCampaign(id, service.CampaignUpdateInput{
		Name:           req.Name,
		Description:    req.Description,
		GMName:         req.GMName,
		GMUserID:       req.GMUserID,
		GameplayLevel:  req.GameplayLevel,
		Theme:          req.Theme,
		HouseRuleNotes: req.HouseRuleNotes,
		Automation:     cloneAutomationPtr(req.Automation),
		Factions:       toDomainFactionsPtr(req.Factions),
		Locations:      toDomainLocationsPtr(req.Locations),
		Placeholders:   toDomainPlaceholdersPtr(req.Placeholders),
		SessionSeed:    toDomainSessionSeedPtr(req.SessionSeed),
		PlayerUserIDs:  toPlayerIDsPtr(req.PlayerUserIDs),
		Players:        toDomainPlayersPtr(req.Players),
		Status:         req.Status,
		CreationMethod: req.CreationMethod,
		Edition:        req.Edition,
		EnabledBooks:   req.EnabledBooks,
	})
	if err != nil {
		respondServiceError(w, err)
		return
	}

	payload, err := h.buildCampaignResponse(session, campaign)
	if err != nil {
		respondServiceError(w, err)
		return
	}
	respondJSON(w, http.StatusOK, payload)
}

// DeleteCampaign handles DELETE /api/campaigns/{id}
func (h *Handlers) DeleteCampaign(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	session := GetSessionFromContext(r.Context())
	campaign, err := h.CampaignService.GetCampaign(id)
	if err != nil {
		respondServiceError(w, err)
		return
	}

	if !canManageCampaign(campaign, session) {
		respondServiceError(w, service.ErrForbidden)
		return
	}

	if err := h.CampaignService.DeleteCampaign(id); err != nil {
		respondServiceError(w, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func toDomainFactions(source []campaignFactionRequest) []domain.CampaignFaction {
	if len(source) == 0 {
		return nil
	}
	result := make([]domain.CampaignFaction, 0, len(source))
	for _, item := range source {
		id := strings.TrimSpace(item.ID)
		name := strings.TrimSpace(item.Name)
		if id == "" && name == "" {
			continue
		}
		result = append(result, domain.CampaignFaction{
			ID:    id,
			Name:  name,
			Tags:  strings.TrimSpace(item.Tags),
			Notes: strings.TrimSpace(item.Notes),
		})
	}
	if len(result) == 0 {
		return nil
	}
	return result
}

func toDomainFactionsPtr(source *[]campaignFactionRequest) *[]domain.CampaignFaction {
	if source == nil {
		return nil
	}
	cloned := toDomainFactions(*source)
	return &cloned
}

func toDomainLocations(source []campaignLocationRequest) []domain.CampaignLocation {
	if len(source) == 0 {
		return nil
	}
	result := make([]domain.CampaignLocation, 0, len(source))
	for _, item := range source {
		id := strings.TrimSpace(item.ID)
		name := strings.TrimSpace(item.Name)
		if id == "" && name == "" {
			continue
		}
		result = append(result, domain.CampaignLocation{
			ID:         id,
			Name:       name,
			Descriptor: strings.TrimSpace(item.Descriptor),
		})
	}
	if len(result) == 0 {
		return nil
	}
	return result
}

func toDomainLocationsPtr(source *[]campaignLocationRequest) *[]domain.CampaignLocation {
	if source == nil {
		return nil
	}
	cloned := toDomainLocations(*source)
	return &cloned
}

func toDomainPlaceholders(source []campaignPlaceholderRequest) []domain.CampaignPlaceholder {
	if len(source) == 0 {
		return nil
	}
	result := make([]domain.CampaignPlaceholder, 0, len(source))
	for _, item := range source {
		id := strings.TrimSpace(item.ID)
		name := strings.TrimSpace(item.Name)
		if id == "" && name == "" {
			continue
		}
		result = append(result, domain.CampaignPlaceholder{
			ID:   id,
			Name: name,
			Role: strings.TrimSpace(item.Role),
		})
	}
	if len(result) == 0 {
		return nil
	}
	return result
}

func toDomainPlaceholdersPtr(source *[]campaignPlaceholderRequest) *[]domain.CampaignPlaceholder {
	if source == nil {
		return nil
	}
	cloned := toDomainPlaceholders(*source)
	return &cloned
}

func toDomainSessionSeed(source *campaignSessionSeedRequest) *domain.CampaignSessionSeed {
	if source == nil {
		return nil
	}
	seed := &domain.CampaignSessionSeed{
		Title:         strings.TrimSpace(source.Title),
		Objectives:    strings.TrimSpace(source.Objectives),
		SceneTemplate: strings.TrimSpace(source.SceneTemplate),
		Summary:       strings.TrimSpace(source.Summary),
		Skip:          source.Skip,
	}
	if seed.Title == "" && seed.Objectives == "" && seed.SceneTemplate == "" && seed.Summary == "" && !seed.Skip {
		return nil
	}
	return seed
}

func toDomainSessionSeedPtr(source *campaignSessionSeedRequest) **domain.CampaignSessionSeed {
	if source == nil {
		return nil
	}
	seed := toDomainSessionSeed(source)
	return &seed
}

func toDomainPlayers(source []campaignPlayerRequest) []domain.CampaignPlayerReference {
	if len(source) == 0 {
		return nil
	}
	result := make([]domain.CampaignPlayerReference, 0, len(source))
	seen := make(map[string]struct{})
	for _, item := range source {
		id := strings.TrimSpace(item.ID)
		if id == "" {
			continue
		}
		if _, exists := seen[id]; exists {
			continue
		}
		seen[id] = struct{}{}
		result = append(result, domain.CampaignPlayerReference{
			ID:       id,
			Username: strings.TrimSpace(item.Username),
		})
	}
	if len(result) == 0 {
		return nil
	}
	return result
}

func toDomainPlayersPtr(source *[]campaignPlayerRequest) *[]domain.CampaignPlayerReference {
	if source == nil {
		return nil
	}
	cloned := toDomainPlayers(*source)
	return &cloned
}

func toPlayerIDsPtr(source *[]string) *[]string {
	if source == nil {
		return nil
	}
	cloned := normalizePlayerUserIDs(*source)
	return &cloned
}

func cloneAutomation(source map[string]bool) map[string]bool {
	if len(source) == 0 {
		return nil
	}
	result := make(map[string]bool, len(source))
	for key, value := range source {
		trimmed := strings.TrimSpace(key)
		if trimmed == "" {
			continue
		}
		result[trimmed] = value
	}
	if len(result) == 0 {
		return nil
	}
	return result
}

func cloneAutomationPtr(source *map[string]bool) *map[string]bool {
	if source == nil {
		return nil
	}
	cloned := cloneAutomation(*source)
	return &cloned
}

func normalizePlayerUserIDs(source []string) []string {
	if len(source) == 0 {
		return nil
	}
	seen := make(map[string]struct{}, len(source))
	result := make([]string, 0, len(source))
	for _, id := range source {
		trimmed := strings.TrimSpace(id)
		if trimmed == "" {
			continue
		}
		if _, exists := seen[trimmed]; exists {
			continue
		}
		seen[trimmed] = struct{}{}
		result = append(result, trimmed)
	}
	if len(result) == 0 {
		return nil
	}
	return result
}

// GetUsers handles GET /api/users
func (h *Handlers) GetUsers(w http.ResponseWriter, r *http.Request) {
	roleQuery := strings.TrimSpace(r.URL.Query().Get("role"))
	var filters []string
	if roleQuery != "" {
		for _, part := range strings.Split(roleQuery, ",") {
			part = strings.TrimSpace(part)
			if part != "" {
				filters = append(filters, part)
			}
		}
	}

	users, err := h.UserService.ListUsers(filters...)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	response := make([]userResponse, 0, len(users))
	for _, user := range users {
		response = append(response, userResponse{
			ID:       user.ID,
			Email:    user.Email,
			Username: user.Username,
			Roles:    user.Roles,
		})
	}

	respondJSON(w, http.StatusOK, response)
}

// Session handlers

// GetSessions handles GET /api/sessions
func (h *Handlers) GetSessions(w http.ResponseWriter, r *http.Request) {
	sessions, err := h.SessionService.ListSessions()
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusOK, sessions)
}

// GetSession handles GET /api/sessions/{id}
func (h *Handlers) GetSession(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	session, err := h.SessionService.GetSession(id)
	if err != nil {
		respondServiceError(w, err)
		return
	}
	respondJSON(w, http.StatusOK, session)
}

// CreateSession handles POST /api/sessions
func (h *Handlers) CreateSession(w http.ResponseWriter, r *http.Request) {
	var session domain.Session
	if err := json.NewDecoder(r.Body).Decode(&session); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	created, err := h.SessionService.CreateSession(&session)
	if err != nil {
		respondServiceError(w, err)
		return
	}

	respondJSON(w, http.StatusCreated, created)
}

// UpdateSession handles PUT /api/sessions/{id}
func (h *Handlers) UpdateSession(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var session domain.Session
	if err := json.NewDecoder(r.Body).Decode(&session); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	updated, err := h.SessionService.UpdateSession(id, &session)
	if err != nil {
		respondServiceError(w, err)
		return
	}

	respondJSON(w, http.StatusOK, updated)
}

// DeleteSession handles DELETE /api/sessions/{id}
func (h *Handlers) DeleteSession(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if err := h.SessionService.DeleteSession(id); err != nil {
		respondServiceError(w, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Scene handlers

// GetScenes handles GET /api/scenes
func (h *Handlers) GetScenes(w http.ResponseWriter, r *http.Request) {
	scenes, err := h.SceneService.ListScenes()
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusOK, scenes)
}

// GetScene handles GET /api/scenes/{id}
func (h *Handlers) GetScene(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	scene, err := h.SceneService.GetScene(id)
	if err != nil {
		respondServiceError(w, err)
		return
	}
	respondJSON(w, http.StatusOK, scene)
}

// CreateScene handles POST /api/scenes
func (h *Handlers) CreateScene(w http.ResponseWriter, r *http.Request) {
	var scene domain.Scene
	if err := json.NewDecoder(r.Body).Decode(&scene); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	created, err := h.SceneService.CreateScene(&scene)
	if err != nil {
		respondServiceError(w, err)
		return
	}

	respondJSON(w, http.StatusCreated, created)
}

// UpdateScene handles PUT /api/scenes/{id}
func (h *Handlers) UpdateScene(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var scene domain.Scene
	if err := json.NewDecoder(r.Body).Decode(&scene); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	updated, err := h.SceneService.UpdateScene(id, &scene)
	if err != nil {
		respondServiceError(w, err)
		return
	}

	respondJSON(w, http.StatusOK, updated)
}

// DeleteScene handles DELETE /api/scenes/{id}
func (h *Handlers) DeleteScene(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if err := h.SceneService.DeleteScene(id); err != nil {
		respondServiceError(w, err)
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

func respondError(w http.ResponseWriter, status int, message string) {
	respondJSON(w, status, map[string]string{"error": message})
}

func respondServiceError(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, service.ErrCampaignNotFound),
		errors.Is(err, service.ErrSessionNotFound),
		errors.Is(err, service.ErrSceneNotFound):
		respondError(w, http.StatusNotFound, err.Error())
	case errors.Is(err, service.ErrCampaignEditionRequired),
		errors.Is(err, service.ErrCampaignCreationMethodRequired),
		errors.Is(err, service.ErrCampaignImmutableEdition),
		errors.Is(err, service.ErrCampaignImmutableCreation),
		errors.Is(err, service.ErrCampaignUnknownGameplayLevel),
		errors.Is(err, service.ErrSessionCampaignRequired),
		errors.Is(err, service.ErrSessionImmutableCampaign),
		errors.Is(err, service.ErrSceneSessionRequired),
		errors.Is(err, service.ErrSceneImmutableSession):
		respondError(w, http.StatusBadRequest, err.Error())
	case errors.Is(err, service.ErrForbidden):
		respondError(w, http.StatusForbidden, err.Error())
	default:
		respondError(w, http.StatusInternalServerError, err.Error())
	}
}

func (h *Handlers) buildCampaignResponse(session *SessionData, campaign *domain.Campaign) (*campaignResponse, error) {
	if campaign == nil {
		return &campaignResponse{Campaign: nil}, nil
	}

	rules, err := h.CampaignService.DescribeGameplayRules(campaign)
	if err != nil {
		return nil, err
	}

	canManage := canManageCampaign(campaign, session)

	return &campaignResponse{
		Campaign:      campaign,
		GameplayRules: rules,
		CanEdit:       canManage,
		CanDelete:     canManage,
	}, nil
}

func canManageCampaign(campaign *domain.Campaign, session *SessionData) bool {
	if campaign == nil || session == nil {
		return false
	}

	if session.HasRole(domain.RoleAdministrator) {
		return true
	}

	if campaign.GmUserID == "" {
		return false
	}

	if !strings.EqualFold(session.UserID, campaign.GmUserID) {
		return false
	}

	return session.HasRole(domain.RoleGamemaster) || session.HasRole(domain.RoleAdministrator)
}

// filterCampaignsByRole filters campaigns based on the user's roles.
// - Administrator: returns all campaigns
// - Gamemaster: returns campaigns where the user is the GM
// - Player: returns campaigns where the user is a player
// If a user has multiple roles, returns the union of campaigns from all applicable roles.
func (h *Handlers) filterCampaignsByRole(campaigns []*domain.Campaign, session *SessionData) []*domain.Campaign {
	if session == nil {
		return []*domain.Campaign{}
	}

	// Administrator sees all campaigns
	if session.HasRole(domain.RoleAdministrator) {
		return campaigns
	}

	filtered := make([]*domain.Campaign, 0)
	seen := make(map[string]bool) // Track campaign IDs to avoid duplicates

	// Gamemaster: campaigns where user is the GM
	if session.HasRole(domain.RoleGamemaster) {
		for _, campaign := range campaigns {
			if campaign.GmUserID != "" && strings.EqualFold(campaign.GmUserID, session.UserID) {
				if !seen[campaign.ID] {
					filtered = append(filtered, campaign)
					seen[campaign.ID] = true
				}
			}
		}
	}

	// Player: campaigns where user is in player_user_ids
	if session.HasRole(domain.RolePlayer) {
		for _, campaign := range campaigns {
			for _, playerID := range campaign.PlayerUserIDs {
				if strings.EqualFold(playerID, session.UserID) {
					if !seen[campaign.ID] {
						filtered = append(filtered, campaign)
						seen[campaign.ID] = true
					}
					break
				}
			}
		}
	}

	return filtered
}
