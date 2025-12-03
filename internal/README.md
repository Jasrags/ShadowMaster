# Internal Package

The `internal` package contains the core application logic organized in a layered architecture. This directory structure follows clean architecture principles, separating concerns into distinct layers.

## Architecture Overview

```
internal/
├── domain/        # Core business entities (domain models)
├── service/       # Business logic and use cases
├── repository/    # Data access layer (interfaces and implementations)
└── api/          # HTTP handlers, middleware, and session management
```

## Layer Dependencies

The layers follow a strict dependency rule:

```
api → service → repository (interface) → repository (implementation)
```

- **API** depends on **Service**
- **Service** depends on **Repository** (interface only)
- **Repository** implementations are independent

This ensures:
- Business logic is independent of HTTP and storage
- Easy to test (can swap implementations)
- Easy to change storage backends
- Clear separation of concerns

## Directory Structure

### `/domain`
Core business entities and domain models. See [domain/README.md](./domain/README.md)

**Examples**: `User`, `Character`, `Role`

### `/service`
Business logic and use cases. See [service/README.md](./service/README.md)

**Examples**: `UserService`, `CharacterService`

### `/repository`
Data access interfaces and implementations. See [repository/README.md](./repository/README.md)

**Examples**: `UserRepository` interface, `json.UserRepository` implementation

### `/api`
HTTP handlers, middleware, and session management. See [api/README.md](./api/README.md)

**Examples**: `Handlers`, `SessionManager`, middleware functions

## Design Principles

1. **Dependency Inversion**: High-level modules (service) don't depend on low-level modules (repository implementations). Both depend on abstractions (interfaces).

2. **Single Responsibility**: Each layer has one clear purpose:
   - Domain: Define entities
   - Service: Implement business logic
   - Repository: Handle data access
   - API: Handle HTTP

3. **Interface Segregation**: Repository interfaces are focused and specific to their domain.

4. **Testability**: Each layer can be tested independently by mocking dependencies.

## Adding New Features

When adding a new feature (e.g., "Campaigns"):

1. **Domain**: Create `domain/campaign.go` with `Campaign` struct
2. **Repository**: 
   - Add `CampaignRepository` interface to `repository/interfaces.go`
   - Implement `json/campaign.go`
3. **Service**: Create `service/campaign.go` with `CampaignService`
4. **API**: Add handlers to `api/handlers.go` and register routes

## Testing Strategy

- **Domain**: Unit tests for domain methods
- **Service**: Unit tests with mocked repositories
- **Repository**: Integration tests with actual storage
- **API**: HTTP tests with mocked services

## See Also

- [Domain Layer Documentation](./domain/README.md)
- [Service Layer Documentation](./service/README.md)
- [Repository Layer Documentation](./repository/README.md)
- [API Layer Documentation](./api/README.md)

