# Repository Layer

The `repository` package provides data access abstractions. It defines interfaces for data persistence and contains concrete implementations for different storage backends.

## Purpose

- Define data access interfaces (abstractions)
- Implement concrete storage backends (JSON files, databases, etc.)
- Provide a clean separation between business logic and data storage
- Enable easy swapping of storage implementations

## Structure

```
repository/
├── interfaces.go          # Repository interface definitions
├── json/                  # JSON file-based implementation
│   ├── user.go
│   └── character.go
└── [future: postgres/]    # Future database implementations
```

## What Goes Here

### Repository Interfaces

Interfaces that define the contract for data access:

```go
type UserRepository interface {
    Create(user *domain.User) error
    GetByID(id string) (*domain.User, error)
    GetByEmail(email string) (*domain.User, error)
    GetByUsername(username string) (*domain.User, error)
    GetAll() ([]*domain.User, error)
    Update(user *domain.User) error
    Delete(id string) error
    Count() (int, error)
}
```

### Concrete Implementations

Subdirectories contain specific implementations:
- `json/` - Stores data in JSON files on disk
- Future: `postgres/`, `mysql/`, `mongodb/`, etc.

## Examples

### JSON Repository Implementation

```go
type UserRepository struct {
    dataPath string
    mu       sync.RWMutex
    index    *indexData
}

func NewUserRepository(dataPath string) (*UserRepository, error) {
    repo := &UserRepository{
        dataPath: dataPath,
        index: &indexData{
            Users:      make(map[string]string),
            UserEmails: make(map[string]string),
            Usernames:  make(map[string]string),
        },
    }
    
    // Ensure data directory exists
    if err := os.MkdirAll(filepath.Join(dataPath, "users"), 0755); err != nil {
        return nil, fmt.Errorf("failed to create users directory: %w", err)
    }
    
    // Load index
    if err := repo.loadIndex(); err != nil {
        return nil, fmt.Errorf("failed to load index: %w", err)
    }
    
    return repo, nil
}

func (r *UserRepository) Create(user *domain.User) error {
    r.mu.Lock()
    defer r.mu.Unlock()
    
    // Check for duplicates
    if id, exists := r.index.UserEmails[user.Email]; exists {
        return fmt.Errorf("email already exists: %s", id)
    }
    
    // Serialize and save
    // ... implementation details
}
```

## Rules

1. **Implement Interfaces**: All repository implementations must satisfy the interface
2. **Thread Safety**: Use mutexes or other synchronization for concurrent access
3. **Error Handling**: Return clear, descriptive errors
4. **No Business Logic**: Repositories only handle data access, not business rules
5. **Domain Objects**: Work with domain entities, not DTOs or database-specific types

## Implementation Guidelines

### For JSON Implementations

- Use an index file for fast lookups
- Store individual entity files in subdirectories
- Handle file I/O errors gracefully
- Use proper file locking or mutexes for concurrent access

### For Future Database Implementations

- Use database connection pooling
- Handle transactions appropriately
- Map between database types and domain types
- Handle connection errors and retries

## What NOT to Put Here

- ❌ Business logic (goes in `service`)
- ❌ Domain model definitions (goes in `domain`)
- ❌ HTTP handling (goes in `api`)
- ❌ Validation beyond data integrity (goes in `service`)

