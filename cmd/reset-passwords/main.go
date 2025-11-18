package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID           string   `json:"id"`
	Email        string   `json:"email"`
	Username     string   `json:"username"`
	PasswordHash string   `json:"password_hash"`
	Roles        []string `json:"roles"`
	CreatedAt    string   `json:"created_at"`
	UpdatedAt    string   `json:"updated_at"`
}

func main() {
	if len(os.Args) < 4 {
		fmt.Println("Usage: go run main.go <data-directory> <username> <new-password>")
		fmt.Println("Example: go run main.go ../../data player1 YEG4tev_wft1dpd2wgj")
		os.Exit(1)
	}

	dataDir := os.Args[1]
	username := strings.TrimSpace(os.Args[2])
	password := os.Args[3]

	if username == "" {
		fmt.Println("Error: username cannot be empty")
		os.Exit(1)
	}

	if password == "" {
		fmt.Println("Error: password cannot be empty")
		os.Exit(1)
	}

	// Hash the password
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("Error hashing password: %v\n", err)
		os.Exit(1)
	}

	// Find user by username (case-insensitive)
	usersDir := filepath.Join(dataDir, "users")
	entries, err := os.ReadDir(usersDir)
	if err != nil {
		fmt.Printf("Error reading users directory: %v\n", err)
		os.Exit(1)
	}

	usernameLower := strings.ToLower(username)
	var foundUser *User
	var userFile string

	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".json") {
			continue
		}

		filename := filepath.Join(usersDir, entry.Name())
		data, err := os.ReadFile(filename)
		if err != nil {
			continue
		}

		var user User
		if err := json.Unmarshal(data, &user); err != nil {
			continue
		}

		if strings.ToLower(user.Username) == usernameLower {
			foundUser = &user
			userFile = filename
			break
		}
	}

	if foundUser == nil {
		fmt.Printf("Error: user with username '%s' not found\n", username)
		os.Exit(1)
	}

	// Update password hash
	foundUser.PasswordHash = string(hashed)

	// Write back to file
	updatedData, err := json.MarshalIndent(foundUser, "", "  ")
	if err != nil {
		fmt.Printf("Error marshaling user: %v\n", err)
		os.Exit(1)
	}

	if err := os.WriteFile(userFile, updatedData, 0644); err != nil {
		fmt.Printf("Error writing user file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Successfully updated password for user: %s (%s)\n", foundUser.Username, foundUser.Email)
}
