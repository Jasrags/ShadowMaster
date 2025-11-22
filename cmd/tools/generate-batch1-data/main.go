package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

func main() {
	generators := []string{
		"generate-options-data",
		"generate-contacts-data",
		"generate-paragons-data",
		"generate-streams-data",
		"generate-echoes-data",
		"generate-ranges-data",
		"generate-tips-data",
		"generate-complexforms-data",
		"generate-spiritpowers-data",
	}

	baseDir := "cmd/tools"
	for _, gen := range generators {
		genPath := filepath.Join(baseDir, gen, "main.go")
		if _, err := os.Stat(genPath); os.IsNotExist(err) {
			fmt.Printf("⚠ Generator not found: %s\n", genPath)
			continue
		}

		fmt.Printf("Running %s...\n", gen)
		cmd := exec.Command("go", "run", genPath)
		cmd.Dir = "."
		output, err := cmd.CombinedOutput()
		if err != nil {
			fmt.Printf("❌ Error running %s: %v\n", gen, err)
			fmt.Printf("Output: %s\n", string(output))
		} else {
			fmt.Printf("✓ %s completed\n", gen)
		}
	}
}

