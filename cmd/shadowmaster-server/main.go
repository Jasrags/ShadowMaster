package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"time"

	"shadowmaster/internal/api"
	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository/json"
	"shadowmaster/internal/service"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

var (
	Version   = "dev"
	BuildTime = "unknown"
	GitCommit = "unknown"
)

func main() {
	port := flag.String("port", "8080", "Server port")
	webPath := flag.String("web", "./web/static", "Path to web static files")
	dataPath := flag.String("data", "./data", "Path to data directory")
	flag.Parse()

	// Initialize repositories
	userRepo, err := json.NewUserRepository(*dataPath)
	if err != nil {
		log.Fatalf("Failed to initialize user repository: %v", err)
	}

	characterRepo, err := json.NewCharacterRepository(*dataPath)
	if err != nil {
		log.Fatalf("Failed to initialize character repository: %v", err)
	}

	// Initialize services
	userService := service.NewUserService(userRepo)
	characterService := service.NewCharacterService(characterRepo)

	// Initialize session manager
	sessionSecret := os.Getenv("SESSION_SECRET")
	if sessionSecret == "" {
		sessionSecret = "change-me-in-production"
	}
	sessionManager := api.NewSessionManager(sessionSecret, 7*24*time.Hour, false)

	// Initialize handlers
	handlers := api.NewHandlers(userService, characterService, sessionManager)

	// Setup router
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(api.CorsMiddleware)
	r.Use(api.LoggingMiddleware)
	r.Use(sessionManager.WithSession) // Load session if exists

	// Health check
	r.Get("/health", handlers.HealthCheck)
	r.Head("/health", handlers.HealthCheck)

	// API routes
	r.Route("/api", func(r chi.Router) {
		// Public auth routes
		r.Post("/auth/register", handlers.RegisterUser)
		r.Post("/auth/login", handlers.LoginUser)

		// Protected auth routes
		r.Group(func(r chi.Router) {
			r.Use(sessionManager.RequireAuth)
			r.Get("/auth/me", handlers.GetCurrentUser)
			r.Post("/auth/logout", handlers.LogoutUser)
			r.Post("/auth/password", handlers.ChangePassword)

			// Character routes
			r.Post("/characters", handlers.CreateCharacter)
			r.Get("/characters", handlers.GetCharacters)
			r.Get("/characters/{id}", handlers.GetCharacter)
			r.Put("/characters/{id}", handlers.UpdateCharacter)
			r.Delete("/characters/{id}", handlers.DeleteCharacter)

			// Priority tables route (for character creation)
			r.Get("/priority-tables", handlers.GetPriorityTables)

			// User lookup route (for getting user info by ID)
			r.Get("/users/{id}", handlers.GetUser)

			// Admin-only routes
			r.Group(func(r chi.Router) {
				r.Use(sessionManager.RequireRole(domain.RoleAdministrator))
				r.Get("/users", handlers.GetUsers)
				r.Put("/users/{id}", handlers.UpdateUser)
				r.Delete("/users/{id}", handlers.DeleteUser)
			})
		})
	})

	// Serve static files
	fileServer := http.FileServer(http.Dir(*webPath))
	r.Handle("/*", fileServer)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, *webPath+"/index.html")
	})

	log.Printf("Starting ShadowMaster server")
	log.Printf("Version: %s (built %s, commit %s)", Version, BuildTime, GitCommit)
	log.Printf("Port: %s", *port)
	log.Printf("Web files: %s", *webPath)
	log.Printf("Data directory: %s", *dataPath)

	if err := http.ListenAndServe(":"+*port, r); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
