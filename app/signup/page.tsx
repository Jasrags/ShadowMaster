"use client";

import { useState } from "react";
import { Link } from "react-aria-components";
import { useAuth } from "@/lib/auth/AuthProvider";
import { isValidEmail, isStrongPassword, getPasswordStrengthError } from "@/lib/auth/validation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { signUp } = useAuth();

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Invalid email format";
    }

    if (!username) {
      errors.username = "Username is required";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (!isStrongPassword(password)) {
      errors.password = getPasswordStrengthError(password) || "Password does not meet strength requirements";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp({ email, username, password });
      if (!result.success) {
        setError(result.error || "Sign up failed");
      }
    } catch (err) {
      console.error("Sign up error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-md px-6 py-12">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
          <h1 className="mb-6 text-3xl font-semibold text-black dark:text-zinc-50">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={!!validationErrors.email}
                aria-describedby={validationErrors.email ? "email-error" : undefined}
                className={`w-full rounded-md border px-3 py-2 text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:ring-zinc-600 ${validationErrors.email
                    ? "border-red-500 dark:border-red-500"
                    : "border-zinc-300 dark:border-zinc-700"
                  }`}
                placeholder="you@example.com"
              />
              {validationErrors.email && (
                <p id="email-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-invalid={!!validationErrors.username}
                aria-describedby={validationErrors.username ? "username-error" : undefined}
                className={`w-full rounded-md border px-3 py-2 text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:ring-zinc-600 ${validationErrors.username
                    ? "border-red-500 dark:border-red-500"
                    : "border-zinc-300 dark:border-zinc-700"
                  }`}
                placeholder="username"
              />
              {validationErrors.username && (
                <p id="username-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {validationErrors.username}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-invalid={!!validationErrors.password}
                aria-describedby={validationErrors.password ? "password-error" : undefined}
                className={`w-full rounded-md border px-3 py-2 text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:ring-zinc-600 ${validationErrors.password
                    ? "border-red-500 dark:border-red-500"
                    : "border-zinc-300 dark:border-zinc-700"
                  }`}
                placeholder="••••••••"
              />
              {validationErrors.password && (
                <p id="password-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                aria-invalid={!!validationErrors.confirmPassword}
                aria-describedby={validationErrors.confirmPassword ? "confirmPassword-error" : undefined}
                className={`w-full rounded-md border px-3 py-2 text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:ring-zinc-600 ${validationErrors.confirmPassword
                    ? "border-red-500 dark:border-red-500"
                    : "border-zinc-300 dark:border-zinc-700"
                  }`}
                placeholder="••••••••"
              />
              {validationErrors.confirmPassword && (
                <p id="confirmPassword-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-foreground px-4 py-2 font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-[#ccc]"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-zinc-950 underline hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

