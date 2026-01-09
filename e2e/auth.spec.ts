import { test, expect, type Page } from "@playwright/test";

// Helper to generate unique test users
function generateTestUser() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return {
    email: `test-${timestamp}-${random}@example.com`,
    username: `testuser${timestamp}${random}`.substring(0, 20), // Keep username reasonable length
    password: "TestPass123!",
  };
}

// Helper to sign up a new user and optionally stay logged in or sign out
async function createTestUser(page: Page, signOut = false) {
  const user = generateTestUser();

  await page.goto("/signup");
  await page.locator("#email").fill(user.email);
  await page.locator("#username").fill(user.username);
  await page.locator("#password").fill(user.password);
  await page.locator("#confirmPassword").fill(user.password);
  await page.getByRole("button", { name: "Sign Up" }).click();

  // Wait for redirect to home page
  await page.waitForURL("/", { timeout: 15000 });

  if (signOut) {
    // Sign out via API
    await page.goto("/api/auth/signout", { waitUntil: "networkidle" });
  }

  return user;
}

test.describe("Sign Up", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
  });

  test("should display sign up form", async ({ page }) => {
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#username")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#confirmPassword")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
  });

  test("should have required field attributes", async ({ page }) => {
    // Form fields should have required validation attributes
    await expect(page.locator("#email")).toHaveAttribute("required", "");
    await expect(page.locator("#username")).toHaveAttribute("required", "");
    await expect(page.locator("#password")).toHaveAttribute("required", "");
    await expect(page.locator("#confirmPassword")).toHaveAttribute(
      "required",
      ""
    );
  });

  test("should have email type for email field", async ({ page }) => {
    // Email field should have type="email" for browser validation
    await expect(page.locator("#email")).toHaveAttribute("type", "email");
  });

  test("should show error for weak password", async ({ page }) => {
    await page.locator("#email").fill("test@example.com");
    await page.locator("#username").fill("testuser");
    await page.locator("#password").fill("weak");
    await page.locator("#confirmPassword").fill("weak");
    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.locator("#password-error")).toBeVisible();
    await expect(page.locator("#password-error")).toContainText(/password/i);
  });

  test("should show error for password mismatch", async ({ page }) => {
    await page.locator("#email").fill("test@example.com");
    await page.locator("#username").fill("testuser");
    await page.locator("#password").fill("TestPass123!");
    await page.locator("#confirmPassword").fill("DifferentPass123!");
    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.locator("#confirmPassword-error")).toBeVisible();
    await expect(page.locator("#confirmPassword-error")).toContainText(/match/i);
  });

  test("should show error for short username", async ({ page }) => {
    await page.locator("#email").fill("test@example.com");
    await page.locator("#username").fill("ab");
    await page.locator("#password").fill("TestPass123!");
    await page.locator("#confirmPassword").fill("TestPass123!");
    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.locator("#username-error")).toBeVisible();
    await expect(page.locator("#username-error")).toContainText(/username/i);
  });

  test("should successfully create account and redirect to home", async ({
    page,
  }) => {
    const user = generateTestUser();

    await page.locator("#email").fill(user.email);
    await page.locator("#username").fill(user.username);
    await page.locator("#password").fill(user.password);
    await page.locator("#confirmPassword").fill(user.password);
    await page.getByRole("button", { name: "Sign Up" }).click();

    // Should show loading state
    await expect(
      page.getByRole("button", { name: "Creating Account..." })
    ).toBeVisible();

    // Should redirect to home page after successful signup
    await page.waitForURL("/", { timeout: 15000 });
    await expect(page).toHaveURL("/");
  });

  test("should show error for duplicate email", async ({ page }) => {
    const user = generateTestUser();

    // First signup
    await page.locator("#email").fill(user.email);
    await page.locator("#username").fill(user.username);
    await page.locator("#password").fill(user.password);
    await page.locator("#confirmPassword").fill(user.password);
    await page.getByRole("button", { name: "Sign Up" }).click();
    await page.waitForURL("/", { timeout: 15000 });

    // Go back to signup to try with same email
    await page.goto("/signup");

    await page.locator("#email").fill(user.email);
    await page.locator("#username").fill("differentuser123");
    await page.locator("#password").fill(user.password);
    await page.locator("#confirmPassword").fill(user.password);
    await page.getByRole("button", { name: "Sign Up" }).click();

    // Server error appears in the general error box
    await expect(page.getByText(/already exists/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should navigate to sign in page via link", async ({ page }) => {
    await page.getByRole("link", { name: /sign in/i }).click();
    await expect(page).toHaveURL("/signin");
  });
});

test.describe("Sign In", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signin");
  });

  test("should display sign in form", async ({ page }) => {
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });

  test("should have required field attributes", async ({ page }) => {
    // Form fields should have required validation attributes
    await expect(page.locator("#email")).toHaveAttribute("required", "");
    await expect(page.locator("#password")).toHaveAttribute("required", "");
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.locator("#email").fill("nonexistent@example.com");
    await page.locator("#password").fill("WrongPassword123!");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Server error appears in the general error box
    await expect(page.getByText(/invalid email or password/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should successfully sign in and redirect to home", async ({ page }) => {
    // Create a fresh user first
    const user = await createTestUser(page, true);

    // Now test sign in
    await page.goto("/signin");
    await page.locator("#email").fill(user.email);
    await page.locator("#password").fill(user.password);
    await page.getByRole("button", { name: "Sign In" }).click();

    // Should show loading state
    await expect(
      page.getByRole("button", { name: "Signing In..." })
    ).toBeVisible();

    // Should redirect to home page after successful sign in
    await page.waitForURL("/", { timeout: 15000 });
    await expect(page).toHaveURL("/");
  });

  test("should show error for wrong password", async ({ page }) => {
    // Create a user first
    const user = await createTestUser(page, true);

    // Try to sign in with wrong password
    await page.goto("/signin");
    await page.locator("#email").fill(user.email);
    await page.locator("#password").fill("WrongPassword123!");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Server error appears in the general error box
    await expect(page.getByText(/invalid email or password/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should navigate to sign up page via link", async ({ page }) => {
    await page.getByRole("link", { name: /sign up/i }).click();
    await expect(page).toHaveURL("/signup");
  });

  test("should have remember me checkbox", async ({ page }) => {
    const rememberMe = page.locator("#rememberMe");
    await expect(rememberMe).toBeVisible();
    await expect(rememberMe).not.toBeChecked();

    await rememberMe.check();
    await expect(rememberMe).toBeChecked();
  });
});

test.describe("Sign Out", () => {
  test("should sign out via API endpoint", async ({ page }) => {
    // Sign up first
    await createTestUser(page, false);
    await expect(page).toHaveURL("/");

    // Sign out via API endpoint
    await page.goto("/api/auth/signout", { waitUntil: "networkidle" });

    // Verify we can access signin page (meaning we're logged out)
    await page.goto("/signin");
    await expect(page).toHaveURL("/signin");
    await expect(page.locator("#email")).toBeVisible();
  });
});

test.describe("Auth Flow Integration", () => {
  test("should complete full signup -> signout -> signin flow", async ({
    page,
  }) => {
    const user = generateTestUser();

    // Sign up
    await page.goto("/signup");
    await page.locator("#email").fill(user.email);
    await page.locator("#username").fill(user.username);
    await page.locator("#password").fill(user.password);
    await page.locator("#confirmPassword").fill(user.password);
    await page.getByRole("button", { name: "Sign Up" }).click();
    await page.waitForURL("/", { timeout: 15000 });

    // Verify we're on home page
    await expect(page).toHaveURL("/");

    // Sign out
    await page.goto("/api/auth/signout", { waitUntil: "networkidle" });

    // Sign in with same credentials
    await page.goto("/signin");
    await page.locator("#email").fill(user.email);
    await page.locator("#password").fill(user.password);
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForURL("/", { timeout: 15000 });

    // Verify we're back on home page
    await expect(page).toHaveURL("/");
  });
});
