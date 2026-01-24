import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  isStrongPassword,
  getPasswordStrengthError,
  isValidUsername,
  getUsernameError,
} from "../validation";

describe("validation", () => {
  describe("isValidEmail", () => {
    it("returns true for valid email formats", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@example.com")).toBe(true);
      expect(isValidEmail("user+tag@example.com")).toBe(true);
      expect(isValidEmail("user@subdomain.example.com")).toBe(true);
      expect(isValidEmail("a@b.co")).toBe(true);
      expect(isValidEmail("user_name@example.com")).toBe(true);
      expect(isValidEmail("user%tag@example.com")).toBe(true);
      expect(isValidEmail("test123@example.co.uk")).toBe(true);
    });

    it("returns false for emails without @", () => {
      expect(isValidEmail("testexample.com")).toBe(false);
      expect(isValidEmail("test")).toBe(false);
    });

    it("returns false for emails without domain", () => {
      expect(isValidEmail("test@")).toBe(false);
      expect(isValidEmail("test@.com")).toBe(false);
    });

    it("returns false for emails without TLD", () => {
      expect(isValidEmail("test@example")).toBe(false);
      expect(isValidEmail("test@example.")).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isValidEmail("")).toBe(false);
    });

    it("returns false for emails with spaces", () => {
      expect(isValidEmail("test @example.com")).toBe(false);
      expect(isValidEmail("test@ example.com")).toBe(false);
      expect(isValidEmail(" test@example.com")).toBe(false);
    });

    it("returns false for emails exceeding max length", () => {
      const longLocalPart = "a".repeat(250);
      expect(isValidEmail(`${longLocalPart}@example.com`)).toBe(false);
    });

    it("returns false for emails with invalid TLD length", () => {
      // TLD too short (1 char)
      expect(isValidEmail("test@example.c")).toBe(false);
      // TLD too long (11+ chars)
      expect(isValidEmail("test@example.verylongtld")).toBe(false);
    });

    it("returns false for emails starting with special characters", () => {
      expect(isValidEmail(".test@example.com")).toBe(false);
      expect(isValidEmail("+test@example.com")).toBe(false);
      expect(isValidEmail("_test@example.com")).toBe(false);
    });

    it("returns false for emails ending with special characters in local part", () => {
      expect(isValidEmail("test.@example.com")).toBe(false);
      expect(isValidEmail("test+@example.com")).toBe(false);
    });

    it("returns false for domains starting/ending with hyphens", () => {
      expect(isValidEmail("test@-example.com")).toBe(false);
      expect(isValidEmail("test@example-.com")).toBe(false);
    });

    it("returns false for numeric TLDs", () => {
      expect(isValidEmail("test@example.123")).toBe(false);
    });
  });

  describe("isStrongPassword", () => {
    it("returns true for strong passwords meeting all requirements", () => {
      expect(isStrongPassword("Password1!")).toBe(true);
      expect(isStrongPassword("Abcd1234!@")).toBe(true);
      expect(isStrongPassword("MyP@ssw0rd")).toBe(true);
      expect(isStrongPassword("Complex$Pass9")).toBe(true);
    });

    it("returns false for passwords under 8 characters", () => {
      expect(isStrongPassword("Pass1!")).toBe(false);
      expect(isStrongPassword("Ab1!xyz")).toBe(false); // 7 chars
    });

    it("returns true for passwords exactly 8 characters meeting all requirements", () => {
      expect(isStrongPassword("Abcd12!@")).toBe(true); // exactly 8 chars
    });

    it("returns true for passwords over 8 characters meeting all requirements", () => {
      expect(isStrongPassword("Abcd123!@")).toBe(true); // 9 chars
    });

    it("returns false for passwords without uppercase", () => {
      expect(isStrongPassword("password1!")).toBe(false);
    });

    it("returns false for passwords without lowercase", () => {
      expect(isStrongPassword("PASSWORD1!")).toBe(false);
    });

    it("returns false for passwords without numbers", () => {
      expect(isStrongPassword("Password!!")).toBe(false);
    });

    it("returns false for passwords without special characters", () => {
      expect(isStrongPassword("Password12")).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isStrongPassword("")).toBe(false);
    });
  });

  describe("getPasswordStrengthError", () => {
    it("returns null for strong passwords", () => {
      expect(getPasswordStrengthError("Password1!")).toBeNull();
      expect(getPasswordStrengthError("Abcd1234!@")).toBeNull();
    });

    it("returns length error for passwords under 8 characters", () => {
      expect(getPasswordStrengthError("Pass1!")).toBe(
        "Password must be at least 8 characters long"
      );
      expect(getPasswordStrengthError("Ab1!xyz")).toBe(
        "Password must be at least 8 characters long"
      );
    });

    it("returns missing uppercase error", () => {
      expect(getPasswordStrengthError("password1!")).toBe(
        "Password must contain at least one uppercase letter"
      );
    });

    it("returns missing lowercase error", () => {
      expect(getPasswordStrengthError("PASSWORD1!")).toBe(
        "Password must contain at least one lowercase letter"
      );
    });

    it("returns missing number error", () => {
      expect(getPasswordStrengthError("Password!!")).toBe(
        "Password must contain at least one number"
      );
    });

    it("returns missing special character error", () => {
      expect(getPasswordStrengthError("Password12")).toBe(
        "Password must contain at least one special character"
      );
    });

    it("returns combined error for multiple missing requirements", () => {
      const error = getPasswordStrengthError("password");
      expect(error).toContain("uppercase letter");
      expect(error).toContain("number");
      expect(error).toContain("special character");
    });

    it("returns length error first even if other requirements missing", () => {
      expect(getPasswordStrengthError("abc")).toBe("Password must be at least 8 characters long");
    });

    it("returns null for empty string when checking only missing requirements", () => {
      // Empty string fails length check first
      expect(getPasswordStrengthError("")).toBe("Password must be at least 8 characters long");
    });
  });

  describe("isValidUsername", () => {
    it("returns true for usernames between 3 and 50 characters", () => {
      expect(isValidUsername("abc")).toBe(true); // 3 chars (minimum)
      expect(isValidUsername("username")).toBe(true);
      expect(isValidUsername("a".repeat(50))).toBe(true); // 50 chars (maximum)
    });

    it("returns false for usernames under 3 characters", () => {
      expect(isValidUsername("ab")).toBe(false); // 2 chars
      expect(isValidUsername("a")).toBe(false);
    });

    it("returns false for usernames over 50 characters", () => {
      expect(isValidUsername("a".repeat(51))).toBe(false); // 51 chars
      expect(isValidUsername("a".repeat(100))).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isValidUsername("")).toBe(false);
    });

    it("accepts usernames with special characters if within length", () => {
      expect(isValidUsername("user_name")).toBe(true);
      expect(isValidUsername("user-name")).toBe(true);
      expect(isValidUsername("user.name")).toBe(true);
    });
  });

  describe("getUsernameError", () => {
    it("returns null for valid usernames", () => {
      expect(getUsernameError("abc")).toBeNull();
      expect(getUsernameError("username")).toBeNull();
      expect(getUsernameError("a".repeat(50))).toBeNull();
    });

    it("returns too short error for usernames under 3 characters", () => {
      expect(getUsernameError("ab")).toBe("Username must be at least 3 characters long");
      expect(getUsernameError("a")).toBe("Username must be at least 3 characters long");
    });

    it("returns too long error for usernames over 50 characters", () => {
      expect(getUsernameError("a".repeat(51))).toBe(
        "Username must be no more than 50 characters long"
      );
    });

    it("returns too short error for empty string", () => {
      expect(getUsernameError("")).toBe("Username must be at least 3 characters long");
    });
  });
});
