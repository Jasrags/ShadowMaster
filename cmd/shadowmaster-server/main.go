package main

import (
	"flag"
	"log"
	"net/http"
	"shadowmaster/internal/api"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	
	jsonrepo "shadowmaster/internal/repository/json"
	"shadowmaster/internal/service"
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
	
	// Initialize handlers
	handlers := api.NewHandlers(repos, characterService)

	// Setup router
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(corsMiddleware)

	// API routes
	r.Route("/api", func(r chi.Router) {
		// Character routes
		r.Get("/characters", handlers.GetCharacters)
		r.Get("/characters/{id}", handlers.GetCharacter)
		r.Post("/characters", handlers.CreateCharacter)
		r.Put("/characters/{id}", handlers.UpdateCharacter)
		r.Delete("/characters/{id}", handlers.DeleteCharacter)
		
		// Skills routes
		r.Get("/skills/active", handlers.GetActiveSkills)
		r.Get("/skills/knowledge", handlers.GetKnowledgeSkills)

		// Group routes
		r.Get("/groups", handlers.GetGroups)
		r.Get("/groups/{id}", handlers.GetGroup)
		r.Post("/groups", handlers.CreateGroup)
		r.Put("/groups/{id}", handlers.UpdateGroup)
		r.Delete("/groups/{id}", handlers.DeleteGroup)

		// Campaign routes
		r.Get("/campaigns", handlers.GetCampaigns)
		r.Get("/campaigns/{id}", handlers.GetCampaign)
		r.Post("/campaigns", handlers.CreateCampaign)
		r.Put("/campaigns/{id}", handlers.UpdateCampaign)
		r.Delete("/campaigns/{id}", handlers.DeleteCampaign)

		// Session routes
		r.Get("/sessions", handlers.GetSessions)
		r.Get("/sessions/{id}", handlers.GetSession)
		r.Post("/sessions", handlers.CreateSession)
		r.Put("/sessions/{id}", handlers.UpdateSession)
		r.Delete("/sessions/{id}", handlers.DeleteSession)

		// Scene routes
		r.Get("/scenes", handlers.GetScenes)
		r.Get("/scenes/{id}", handlers.GetScene)
		r.Post("/scenes", handlers.CreateScene)
		r.Put("/scenes/{id}", handlers.UpdateScene)
		r.Delete("/scenes/{id}", handlers.DeleteScene)
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

// corsMiddleware handles CORS headers
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
