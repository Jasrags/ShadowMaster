/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Minimum 8 characters, at least one uppercase, one lowercase, one number, one special character
 */
export function isStrongPassword(password: string): boolean {
  if (password.length < 8) {
    return false;
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

/**
 * Get password strength error message
 */
export function getPasswordStrengthError(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  const missing: string[] = [];
  if (!hasUpperCase) missing.push("uppercase letter");
  if (!hasLowerCase) missing.push("lowercase letter");
  if (!hasNumber) missing.push("number");
  if (!hasSpecialChar) missing.push("special character");
  
  if (missing.length > 0) {
    return `Password must contain at least one ${missing.join(", ")}`;
  }
  
  return null;
}

/**
 * Validate username length
 * Username must be between 3 and 50 characters
 */
export function isValidUsername(username: string): boolean {
  return username.length >= 3 && username.length <= 50;
}

/**
 * Get username validation error message
 */
export function getUsernameError(username: string): string | null {
  if (username.length < 3) {
    return "Username must be at least 3 characters long";
  }
  if (username.length > 50) {
    return "Username must be no more than 50 characters long";
  }
  return null;
}

