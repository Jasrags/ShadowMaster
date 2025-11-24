package main

import (
	"fmt"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadParagonsFromXML("data/chummerxml/paragons.xml")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	fmt.Printf("Version: %v\n", data.Version)
	fmt.Printf("Categories: %d\n", len(data.Categories))
	fmt.Printf("Paragons: %d\n", len(data.Paragons))
	if len(data.Paragons) > 0 {
		fmt.Printf("Paragons[0].Paragon: %d\n", len(data.Paragons[0].Paragon))
	}
}

