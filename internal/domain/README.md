# Domain Layer

The `domain` package contains the core business entities and domain models. These are the fundamental building blocks of the application that represent real-world concepts.

## Purpose

- Define core business entities (structs/types)
- Contain simple domain logic (methods on domain objects)
- Be completely independent of infrastructure (no database, HTTP, or external dependencies)
- Represent the "truth" of what the application models

## What Goes Here

### Domain Entities

Core business objects that represent concepts in your domain. Each entity should:
- Be a struct with clear fields
- Have methods for simple domain logic (e.g., `HasRole()`, `IsValid()`)
- Not depend on any external packages (except standard library)
- Be serializable (for JSON storage/API responses)

### Domain Types

Related types, constants, and enums that are part of the domain model.

## Examples

### User Entity

```go
type User struct {
    ID           string     `json:"id"`
    Email        string     `json:"email"`
    Username     string     `json:"username"`
    PasswordHash string     `json:"-"` // Never serialize password hash
    Roles        []Role     `json:"roles"`
    CreatedAt    time.Time  `json:"created_at"`
    UpdatedAt    time.Time  `json:"updated_at"`
    DeletedAt    *time.Time `json:"deleted_at,omitempty"`
    LastLoginAt  *time.Time `json:"last_login_at,omitempty"`
}

func (u *User) HasRole(role Role) bool {
    return slices.Contains(u.Roles, role)
}
```

### Role Type

```go
type Role string

const (
    RoleAdministrator Role = "administrator"
    RoleGamemaster    Role = "gamemaster"
    RolePlayer        Role = "player"
)
```

## Rules

1. **No Infrastructure Dependencies**: Domain models should not import database, HTTP, or external service packages
2. **Pure Business Logic**: Only simple methods that operate on the entity itself
3. **No Side Effects**: Domain methods should not perform I/O or external calls
4. **Immutable When Possible**: Consider making entities immutable or providing clear update patterns

## What NOT to Put Here

- ❌ HTTP request/response structs (goes in `api`)
- ❌ Database-specific code (goes in `repository`)
- ❌ Business logic that requires external services (goes in `service`)
- ❌ Validation that requires repository access (goes in `service`)

