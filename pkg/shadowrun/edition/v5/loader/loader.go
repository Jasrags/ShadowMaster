package loader

import (
	"encoding/xml"
	"fmt"
	"io"
	"os"
)

// LoadXMLFile loads an XML file and unmarshals it into the provided struct
func LoadXMLFile[T any](filePath string) (*T, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open file %s: %w", filePath, err)
	}
	defer file.Close()

	var result T
	decoder := xml.NewDecoder(file)
	if err := decoder.Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to decode XML from %s: %w", filePath, err)
	}

	return &result, nil
}

// LoadXMLReader loads XML from an io.Reader and unmarshals it into the provided struct
func LoadXMLReader[T any](reader io.Reader) (*T, error) {
	var result T
	decoder := xml.NewDecoder(reader)
	if err := decoder.Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to decode XML: %w", err)
	}

	return &result, nil
}

// StreamXMLFile processes an XML file in a streaming fashion, calling the handler for each item
// This is useful for large files where we want to process items in batches
func StreamXMLFile[T any](
	filePath string,
	itemTag string,
	handler func(item T) error,
	batchSize int,
) error {
	file, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("failed to open file %s: %w", filePath, err)
	}
	defer file.Close()

	decoder := xml.NewDecoder(file)
	var count int
	var batch []T

	for {
		token, err := decoder.Token()
		if err == io.EOF {
			// Process remaining items in batch
			if len(batch) > 0 {
				for _, item := range batch {
					if err := handler(item); err != nil {
						return fmt.Errorf("handler error at item %d: %w", count, err)
					}
					count++
				}
			}
			break
		}
		if err != nil {
			return fmt.Errorf("failed to read token: %w", err)
		}

		// Check if this is the start of an item element
		if se, ok := token.(xml.StartElement); ok && se.Name.Local == itemTag {
			var item T
			if err := decoder.DecodeElement(&item, &se); err != nil {
				return fmt.Errorf("failed to decode element at position %d: %w", count, err)
			}

			batch = append(batch, item)

			// Process batch when it reaches the desired size
			if len(batch) >= batchSize {
				for _, item := range batch {
					if err := handler(item); err != nil {
						return fmt.Errorf("handler error at item %d: %w", count, err)
					}
					count++
				}
				batch = batch[:0] // Clear batch
			}
		}
	}

	return nil
}

