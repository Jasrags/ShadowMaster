package storage

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"
)

// JSONStore provides thread-safe JSON file storage
type JSONStore struct {
	basePath string
	mu       sync.RWMutex
}

// NewJSONStore creates a new JSON file store
func NewJSONStore(basePath string) (*JSONStore, error) {
	if err := os.MkdirAll(basePath, 0755); err != nil {
		return nil, fmt.Errorf("failed to create base directory: %w", err)
	}
	return &JSONStore{
		basePath: basePath,
	}, nil
}

// Read reads a JSON file and unmarshals it into the provided value
func (s *JSONStore) Read(filename string, v interface{}) error {
	s.mu.RLock()
	defer s.mu.RUnlock()

	path := filepath.Join(s.basePath, filename)
	data, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("failed to read file %s: %w", path, err)
	}

	if err := json.Unmarshal(data, v); err != nil {
		return fmt.Errorf("failed to unmarshal JSON from %s: %w", path, err)
	}

	return nil
}

// Write writes a value to a JSON file atomically
func (s *JSONStore) Write(filename string, v interface{}) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	path := filepath.Join(s.basePath, filename)
	dir := filepath.Dir(path)

	// Ensure directory exists
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("failed to create directory %s: %w", dir, err)
	}

	// Marshal to JSON
	data, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal JSON: %w", err)
	}

	// Write to temporary file first (atomic write)
	tmpPath := path + ".tmp"
	if err := os.WriteFile(tmpPath, data, 0644); err != nil {
		return fmt.Errorf("failed to write temp file %s: %w", tmpPath, err)
	}

	// Rename temp file to final location (atomic on most filesystems)
	if err := os.Rename(tmpPath, path); err != nil {
		os.Remove(tmpPath) // Clean up temp file on error
		return fmt.Errorf("failed to rename temp file to %s: %w", path, err)
	}

	return nil
}

// Exists checks if a file exists
func (s *JSONStore) Exists(filename string) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()

	path := filepath.Join(s.basePath, filename)
	_, err := os.Stat(path)
	return err == nil
}

// Delete removes a JSON file
func (s *JSONStore) Delete(filename string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	path := filepath.Join(s.basePath, filename)
	if err := os.Remove(path); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to delete file %s: %w", path, err)
	}
	return nil
}

// List returns all files in a directory
func (s *JSONStore) List(subdir string) ([]string, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	path := filepath.Join(s.basePath, subdir)
	entries, err := os.ReadDir(path)
	if err != nil {
		if os.IsNotExist(err) {
			return []string{}, nil
		}
		return nil, fmt.Errorf("failed to read directory %s: %w", path, err)
	}

	var files []string
	for _, entry := range entries {
		if !entry.IsDir() && filepath.Ext(entry.Name()) == ".json" {
			files = append(files, entry.Name())
		}
	}

	return files, nil
}

// ReadRaw reads a file as raw bytes
func (s *JSONStore) ReadRaw(filename string) ([]byte, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	path := filepath.Join(s.basePath, filename)
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read file %s: %w", path, err)
	}
	return data, nil
}
