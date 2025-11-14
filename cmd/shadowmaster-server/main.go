package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"shadowmaster/internal/api"
	"shadowmaster/internal/domain"
	jsonrepo "shadowmaster/internal/repository/json"
	"shadowmaster/internal/service"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	dataPath := flag.String("data", "./data", "Path to data directory")
	port := flag.String("port", "8080", "Server port")
	webPath := flag.String("web", "./web/static", "Path to web static files")
	flag.Parse()

	// Initialize repositories
	repos, err := jsonrepo.NewRepositories(*dataPath)
	if err != nil {
		log.Fatalf("Failed to initialize repositories: %v", err)
	}

	// Initialize services
	characterService := service.NewCharacterService(repos.Character)
	userService := service.NewUserService(repos.User)
	campaignService := service.NewCampaignService(repos.Campaign, repos.Edition, repos.Books)
	sessionService := service.NewSessionService(repos.Session, repos.Campaign)
	sceneService := service.NewSceneService(repos.Scene, repos.Session)

	sessionSecret := os.Getenv("SESSION_SECRET")
	sessionManager := api.NewSessionManager(sessionSecret, 7*24*time.Hour, false)

	// Initialize handlers
	handlers := api.NewHandlers(repos, characterService, userService, sessionManager, campaignService, sessionService, sceneService)

	// Setup router
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(corsMiddleware)
	r.Use(sessionManager.WithSession)

	// API routes
	r.Route("/api", func(r chi.Router) {
		// Auth routes
		r.Post("/auth/register", handlers.RegisterUser)
		r.Post("/auth/login", handlers.LoginUser)
		r.Get("/auth/me", handlers.GetCurrentUser)
		r.Group(func(r chi.Router) {
			r.Use(sessionManager.RequireAuth)
			r.Post("/auth/logout", handlers.LogoutUser)
			r.Post("/auth/password", handlers.ChangePassword)
			r.Route("/users", func(r chi.Router) {
				r.Use(sessionManager.RequireRole(domain.RoleAdministrator, domain.RoleGamemaster))
				r.Get("/", handlers.GetUsers)
			})
		})

		// Character routes
		r.Get("/characters", handlers.GetCharacters)
		r.Get("/characters/{id}", handlers.GetCharacter)
		r.Post("/characters", handlers.CreateCharacter)
		r.Put("/characters/{id}", handlers.UpdateCharacter)
		r.Delete("/characters/{id}", handlers.DeleteCharacter)

		// Edition metadata
		r.Get("/editions/{edition}/character-creation", handlers.GetEditionCharacterCreationData)
		r.Get("/editions/{edition}/books", handlers.GetEditionBooks)

		// Skills routes
		r.Get("/skills/active", handlers.GetActiveSkills)
		r.Get("/skills/knowledge", handlers.GetKnowledgeSkills)

		// Equipment routes
		r.Get("/equipment/weapons", handlers.GetWeapons)
		r.Get("/equipment/armor", handlers.GetArmor)
		r.Get("/equipment/cyberware", handlers.GetCyberware)

		// Group routes
		r.Get("/groups", handlers.GetGroups)
		r.Get("/groups/{id}", handlers.GetGroup)
		r.Post("/groups", handlers.CreateGroup)
		r.Put("/groups/{id}", handlers.UpdateGroup)
		r.Delete("/groups/{id}", handlers.DeleteGroup)

		// Campaign routes
		r.Route("/campaigns", func(r chi.Router) {
			r.Get("/", handlers.GetCampaigns)
			r.Get("/{id}", handlers.GetCampaign)
			r.Get("/{id}/character-creation", handlers.GetCampaignCharacterCreationData)

			r.Group(func(r chi.Router) {
				r.Use(sessionManager.RequireRole(domain.RoleAdministrator, domain.RoleGamemaster))
				r.Post("/", handlers.CreateCampaign)
				r.Put("/{id}", handlers.UpdateCampaign)
				r.Delete("/{id}", handlers.DeleteCampaign)
			})
		})

		// Session routes
		r.Route("/sessions", func(r chi.Router) {
			r.Get("/", handlers.GetSessions)
			r.Get("/{id}", handlers.GetSession)

			r.Group(func(r chi.Router) {
				r.Use(sessionManager.RequireRole(domain.RoleAdministrator, domain.RoleGamemaster))
				r.Post("/", handlers.CreateSession)
				r.Put("/{id}", handlers.UpdateSession)
				r.Delete("/{id}", handlers.DeleteSession)
			})
		})

		// Scene routes
		r.Route("/scenes", func(r chi.Router) {
			r.Get("/", handlers.GetScenes)
			r.Get("/{id}", handlers.GetScene)

			r.Group(func(r chi.Router) {
				r.Use(sessionManager.RequireRole(domain.RoleAdministrator, domain.RoleGamemaster))
				r.Post("/", handlers.CreateScene)
				r.Put("/{id}", handlers.UpdateScene)
				r.Delete("/{id}", handlers.DeleteScene)
			})
		})
	})

	// Serve static files
	fileServer := http.FileServer(http.Dir(*webPath))
	r.Handle("/*", fileServer)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, *webPath+"/index.html")
	})

	log.Printf("Starting server on port %s", *port)
	log.Printf("Data directory: %s", *dataPath)
	log.Printf("Web files: %s", *webPath)
	if err := http.ListenAndServe(":"+*port, r); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

// corsMiddleware handles CORS headers with support for credentials
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		
		// Allow specific origins for credentials
		allowedOrigins := []string{
			"http://localhost:5173", // Vite dev server
			"http://localhost:3000", // Alternative dev port
			"http://127.0.0.1:5173",
			"http://127.0.0.1:3000",
		}
		
		// Check if origin is allowed
		allowed := false
		for _, allowedOrigin := range allowedOrigins {
			if origin == allowedOrigin {
				allowed = true
				break
			}
		}
		
		// If origin is allowed, use it; otherwise use wildcard (no credentials)
		if allowed {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
		} else {
			// For non-browser requests or unknown origins, allow all (no credentials)
			w.Header().Set("Access-Control-Allow-Origin", "*")
		}
		
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Expose-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
