# Service Layer

The `service` package contains business logic and use cases. Services orchestrate domain objects and coordinate with repositories to implement application functionality.

## Purpose

- Implement business logic and use cases
- Validate business rules
- Coordinate between domain objects and repositories
- Handle complex operations that require multiple steps
- Provide a clean API for the API layer

## What Goes Here

### Service Structs

Each service should:
- Have a struct that holds repository dependencies
- Provide methods for business operations
- Handle validation and business rules
- Return domain objects or errors

### Business Logic

Operations like:
- User registration (with validation, password hashing, role assignment)
- Authentication (password verification, session management)
- Complex workflows that span multiple domain objects
- Business rule enforcement

## Examples

### UserService

```go
type UserService struct {
    repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) *UserService {
    return &UserService{repo: repo}
}

func (s *UserService) Register(email, username, password string) (*domain.User, error) {
    // Validate password
    if err := validatePassword(password); err != nil {
        return nil, ErrWeakPassword
    }
    
    // Check if email exists
    _, err := s.repo.GetByEmail(email)
    if err == nil {
        return nil, ErrEmailExists
    }
    
    // Hash password
    passwordHash, err := hashPassword(password)
    if err != nil {
        return nil, err
    }
    
    // Create user
    user := &domain.User{
        ID:           generateID(),
        Email:        email,
        Username:     username,
        PasswordHash: passwordHash,
        Roles:        []domain.Role{domain.RolePlayer},
        CreatedAt:    time.Now(),
        UpdatedAt:    time.Now(),
    }
    
    return user, s.repo.Create(user)
}
```

### Service Errors

```go
var (
    ErrUserNotFound       = errors.New("user not found")
    ErrInvalidCredentials = errors.New("invalid email or password")
    ErrEmailExists        = errors.New("email already exists")
    ErrWeakPassword       = errors.New("password does not meet requirements")
)
```

## Rules

1. **Depend on Interfaces**: Services should depend on repository interfaces, not concrete implementations
2. **Business Logic Only**: Don't put HTTP-specific code here (request parsing, response formatting)
3. **Return Domain Objects**: Services return domain entities, not DTOs or API responses
4. **Error Handling**: Use domain-specific errors, not generic ones
5. **Single Responsibility**: Each service should handle one domain concept (UserService, CharacterService, etc.)

## What NOT to Put Here

- ❌ HTTP request/response handling (goes in `api`)
- ❌ Database-specific code (goes in `repository`)
- ❌ Domain model definitions (goes in `domain`)
- ❌ Infrastructure concerns (logging, metrics - use dependency injection)

