package edition

import (
	"fmt"
	"sync"
)

var (
	registry   = make(map[string]EditionHandler)
	registryMu sync.RWMutex
)

// Register registers an edition handler in the global registry.
// This should be called during application initialization for each supported edition.
// If an edition is already registered, Register will overwrite it.
func Register(handler EditionHandler) {
	registryMu.Lock()
	defer registryMu.Unlock()
	registry[handler.Edition()] = handler
}

// GetHandler retrieves an edition handler by edition identifier.
// Returns an error if the edition is not registered.
func GetHandler(edition string) (EditionHandler, error) {
	registryMu.RLock()
	defer registryMu.RUnlock()
	
	handler, ok := registry[edition]
	if !ok {
		return nil, fmt.Errorf("unsupported edition: %s", edition)
	}
	return handler, nil
}

// ListEditions returns a list of all registered edition identifiers.
func ListEditions() []string {
	registryMu.RLock()
	defer registryMu.RUnlock()
	
	editions := make([]string, 0, len(registry))
	for edition := range registry {
		editions = append(editions, edition)
	}
	return editions
}

// IsRegistered checks if an edition is registered.
func IsRegistered(edition string) bool {
	registryMu.RLock()
	defer registryMu.RUnlock()
	
	_, ok := registry[edition]
	return ok
}

