# API Layer

The `api` package handles HTTP requests and responses. It translates between HTTP and the service layer, managing routing, middleware, and session handling.

## Purpose

- Handle HTTP requests and responses
- Parse request bodies and validate input
- Call service layer methods
- Format responses for clients
- Manage authentication and authorization
- Provide middleware for cross-cutting concerns

## What Goes Here

### HTTP Handlers

Functions that handle HTTP requests:

```go
type Handlers struct {
    UserService      *service.UserService
    CharacterService *service.CharacterService
    Sessions         *SessionManager
}

func (h *Handlers) RegisterUser(w http.ResponseWriter, r *http.Request) {
    var req registerRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }
    
    user, err := h.UserService.Register(req.Email, req.Username, req.Password)
    if err != nil {
        // Handle error and return appropriate status code
        return
    }
    
    // Format and return response
    json.NewEncoder(w).Encode(userResponse{
        ID:       user.ID,
        Email:    user.Email,
        Username: user.Username,
        Roles:    convertRolesToStrings(user.Roles),
    })
}
```

### Request/Response DTOs

Structs for parsing requests and formatting responses:

```go
type registerRequest struct {
    Email    string `json:"email"`
    Username string `json:"username"`
    Password string `json:"password"`
}

type userResponse struct {
    ID       string   `json:"id"`
    Email    string   `json:"email"`
    Username string   `json:"username"`
    Roles    []string `json:"roles"`
}
```

### Middleware

Functions for cross-cutting concerns:

```go
func CorsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        
        next.ServeHTTP(w, r)
    })
}
```

### Session Management

Handling user sessions and authentication:

```go
type SessionManager struct {
    secret     string
    expiry     time.Duration
    secureOnly bool
}

func (sm *SessionManager) RequireAuth(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        session := sm.GetSession(r)
        if session == nil || session.UserID == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }
        next.ServeHTTP(w, r)
    })
}
```

## Examples

### Complete Handler Example

```go
func (h *Handlers) LoginUser(w http.ResponseWriter, r *http.Request) {
    var req loginRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }
    
    user, err := h.UserService.Authenticate(req.Email, req.Password)
    if err != nil {
        if err == service.ErrInvalidCredentials {
            http.Error(w, "Invalid credentials", http.StatusUnauthorized)
            return
        }
        http.Error(w, "Internal server error", http.StatusInternalServerError)
        return
    }
    
    // Create session
    session := h.Sessions.CreateSession(user.ID)
    h.Sessions.SetSession(w, session)
    
    // Return user info
    json.NewEncoder(w).Encode(userResponse{
        ID:       user.ID,
        Email:    user.Email,
        Username: user.Username,
        Roles:    convertRolesToStrings(user.Roles),
    })
}
```

## Rules

1. **Thin Layer**: Handlers should be thin - delegate to services, don't implement business logic
2. **Error Mapping**: Map service errors to appropriate HTTP status codes
3. **Input Validation**: Validate and sanitize all input from requests
4. **Response Formatting**: Format domain objects into appropriate response DTOs
5. **Security**: Never expose sensitive data (passwords, internal IDs, etc.) in responses

## What NOT to Put Here

- ❌ Business logic (goes in `service`)
- ❌ Domain model definitions (goes in `domain`)
- ❌ Data access code (goes in `repository`)
- ❌ Complex validation logic (goes in `service`)

## Common Patterns

### Error Handling

```go
if err != nil {
    switch err {
    case service.ErrUserNotFound:
        http.Error(w, "User not found", http.StatusNotFound)
    case service.ErrInvalidCredentials:
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
    default:
        log.Printf("Internal error: %v", err)
        http.Error(w, "Internal server error", http.StatusInternalServerError)
    }
    return
}
```

### Authentication Middleware

```go
r.Group(func(r chi.Router) {
    r.Use(sessionManager.RequireAuth)
    r.Get("/api/characters", handlers.GetCharacters)
    r.Post("/api/characters", handlers.CreateCharacter)
})
```

### Role-Based Authorization

```go
r.Group(func(r chi.Router) {
    r.Use(sessionManager.RequireAuth)
    r.Use(sessionManager.RequireRole(domain.RoleAdministrator))
    r.Get("/api/users", handlers.GetUsers)
    r.Put("/api/users/{id}", handlers.UpdateUser)
})
```

