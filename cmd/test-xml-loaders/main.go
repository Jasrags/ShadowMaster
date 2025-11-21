package main

import (
	"fmt"
	"os"

	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	xmlDir := "data/chummerxml"
	if len(os.Args) > 1 {
		xmlDir = os.Args[1]
	}

	fmt.Printf("Testing XML loaders with directory: %s\n\n", xmlDir)

	if err := loader.TestAllLoaders(xmlDir); err != nil {
		fmt.Fprintf(os.Stderr, "Error testing loaders: %v\n", err)
		os.Exit(1)
	}
}

