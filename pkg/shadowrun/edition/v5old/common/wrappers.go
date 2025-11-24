package common

// SingleOrSlice is a helper type for fields that can be either a single value or a slice
// This provides type safety while maintaining JSON compatibility
type SingleOrSlice[T any] struct {
	value   T
	values  []T
	isSlice bool
}

// NewSingle creates a SingleOrSlice with a single value
func NewSingle[T any](value T) SingleOrSlice[T] {
	return SingleOrSlice[T]{
		value:   value,
		isSlice: false,
	}
}

// NewSlice creates a SingleOrSlice with a slice of values
func NewSlice[T any](values []T) SingleOrSlice[T] {
	return SingleOrSlice[T]{
		values:  values,
		isSlice: true,
	}
}

// IsSlice returns true if this contains a slice, false if it contains a single value
func (s *SingleOrSlice[T]) IsSlice() bool {
	return s.isSlice
}

// Single returns the single value (panics if IsSlice() is true)
func (s *SingleOrSlice[T]) Single() T {
	if s.isSlice {
		panic("SingleOrSlice contains a slice, not a single value")
	}
	return s.value
}

// Slice returns the slice of values (panics if IsSlice() is false)
func (s *SingleOrSlice[T]) Slice() []T {
	if !s.isSlice {
		panic("SingleOrSlice contains a single value, not a slice")
	}
	return s.values
}

// Value returns the value as interface{} for JSON marshaling
// This allows the type to work with existing JSON structures
func (s *SingleOrSlice[T]) Value() interface{} {
	if s.isSlice {
		return s.values
	}
	return s.value
}

// Helper functions for working with interface{} fields during migration

// AsSlice attempts to convert an interface{} to a slice of the specified type
// Returns the slice and true if successful, nil and false otherwise
func AsSlice[T any](v interface{}) ([]T, bool) {
	if v == nil {
		return nil, false
	}
	
	switch val := v.(type) {
	case []T:
		return val, true
	case T:
		return []T{val}, true
	case []interface{}:
		result := make([]T, 0, len(val))
		for _, item := range val {
			if t, ok := item.(T); ok {
				result = append(result, t)
			} else {
				return nil, false
			}
		}
		return result, true
	default:
		return nil, false
	}
}

// AsSingle attempts to convert an interface{} to a single value of the specified type
// Returns the value and true if successful, zero value and false otherwise
func AsSingle[T any](v interface{}) (T, bool) {
	if v == nil {
		var zero T
		return zero, false
	}
	
	if t, ok := v.(T); ok {
		return t, true
	}
	
	var zero T
	return zero, false
}

// IsSlice checks if an interface{} value is a slice
func IsSlice(v interface{}) bool {
	if v == nil {
		return false
	}
	switch v.(type) {
	case []interface{}, []string, []int, []float64:
		return true
	default:
		// Use reflection for other slice types
		// For now, we'll use a simple check
		return false
	}
}

