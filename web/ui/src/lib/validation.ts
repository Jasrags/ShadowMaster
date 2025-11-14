// Validation utilities

export function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return 'Email address is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
}

export function validatePasswordMatch(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}

export function validateUsername(username: string): string | null {
  if (!username.trim()) {
    return 'Username is required';
  }
  if (username.trim().length < 2) {
    return 'Username must be at least 2 characters long';
  }
  return null;
}

