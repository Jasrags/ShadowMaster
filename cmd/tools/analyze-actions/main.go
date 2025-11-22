package main

import (
	"fmt"
	"os"

	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	filePath := "data/chummerxml/actions.xml"
	if len(os.Args) > 1 {
		filePath = os.Args[1]
	}

	if err := loader.AnalyzeActions(filePath); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}
