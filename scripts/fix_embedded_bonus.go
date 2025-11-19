package main

import (
	"fmt"
	"go/ast"
	"go/format"
	"go/parser"
	"go/token"
	"os"
	"strings"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintf(os.Stderr, "Usage: %s <file.go> [bonus_type] [package_prefix]\n", os.Args[0])
		os.Exit(1)
	}

	filename := os.Args[1]
	bonusType := "BiowareBonus"
	if len(os.Args) > 2 {
		bonusType = os.Args[2]
	}
	packagePrefix := "common"
	if len(os.Args) > 3 {
		packagePrefix = os.Args[3]
	}

	// Read the file
	src, err := os.ReadFile(filename)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading file: %v\n", err)
		os.Exit(1)
	}

	// Parse the file
	fset := token.NewFileSet()
	file, err := parser.ParseFile(fset, filename, src, parser.ParseComments)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error parsing file: %v\n", err)
		os.Exit(1)
	}

	// Transform the AST
	ast.Inspect(file, func(n ast.Node) bool {
		compLit, ok := n.(*ast.CompositeLit)
		if !ok {
			return true
		}

		// Check if this is a &BiowareBonus{...} literal
		sel, ok := compLit.Type.(*ast.UnaryExpr)
		if !ok || sel.Op != token.AND {
			return true
		}

		ident, ok := sel.X.(*ast.Ident)
		if !ok || ident.Name != bonusType {
			return true
		}

		// This is a &BiowareBonus{...} literal
		// Wrap all fields in BaseBonus: common.BaseBonus{...}
		if len(compLit.Elts) == 0 {
			return true
		}

		// Create the embedded BaseBonus struct
		baseBonusType := &ast.SelectorExpr{
			X:   ast.NewIdent(packagePrefix),
			Sel: ast.NewIdent("BaseBonus"),
		}

		baseBonusLit := &ast.CompositeLit{
			Type: baseBonusType,
			Elts: compLit.Elts,
		}

		// Create the key-value expression for BaseBonus field
		baseBonusKeyValue := &ast.KeyValueExpr{
			Key:   ast.NewIdent("BaseBonus"),
			Value: baseBonusLit,
		}

		// Replace the elements with the BaseBonus field
		compLit.Elts = []ast.Expr{baseBonusKeyValue}

		return true
	})

	// Write the transformed file
	var buf strings.Builder
	err = format.Node(&buf, fset, file)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error formatting: %v\n", err)
		os.Exit(1)
	}

	err = os.WriteFile(filename, []byte(buf.String()), 0644)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Transformed %s literals in %s\n", bonusType, filename)
}

