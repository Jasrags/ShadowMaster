package common

// Helper functions for working with interface{} fields that represent single values or slices
// These can be used during migration to provide type-safe access to fields

// GetStringOrSlice converts an interface{} to a string or []string
// Returns the value as a string if single, or the first element if it's a slice
func GetStringOrSlice(v interface{}) (string, bool) {
	if v == nil {
		return "", false
	}
	
	switch val := v.(type) {
	case string:
		return val, true
	case []string:
		if len(val) > 0 {
			return val[0], true
		}
		return "", false
	case []interface{}:
		if len(val) > 0 {
			if str, ok := val[0].(string); ok {
				return str, true
			}
		}
		return "", false
	default:
		return "", false
	}
}

// GetStringSlice converts an interface{} to []string
// Returns nil if conversion is not possible
func GetStringSlice(v interface{}) []string {
	if v == nil {
		return nil
	}
	
	switch val := v.(type) {
	case []string:
		return val
	case string:
		return []string{val}
	case []interface{}:
		result := make([]string, 0, len(val))
		for _, item := range val {
			if str, ok := item.(string); ok {
				result = append(result, str)
			}
		}
		return result
	default:
		return nil
	}
}

// IsStringSlice checks if an interface{} is a string slice (or single string)
func IsStringSlice(v interface{}) bool {
	if v == nil {
		return false
	}
	
	switch v.(type) {
	case string, []string, []interface{}:
		return true
	default:
		return false
	}
}

