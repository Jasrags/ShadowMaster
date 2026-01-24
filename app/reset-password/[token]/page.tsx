"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Link } from "react-aria-components";
import { isStrongPassword, getPasswordStrengthError } from "@/lib/auth/validation";

type TokenStatus = "loading" | "valid" | "invalid" | "expired";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default function ResetPasswordPage({ params }: PageProps) {
  const { token } = use(params);
  const router = useRouter();

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("loading");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  // Validate token on mount
  useEffect(() => {
    async function validateToken() {
      try {
        const response = await fetch("/api/auth/reset-password/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.valid) {
          setTokenStatus("valid");
        } else if (data.reason === "expired") {
          setTokenStatus("expired");
        } else {
          setTokenStatus("invalid");
        }
      } catch {
        setTokenStatus("invalid");
      }
    }

    validateToken();
  }, [token]);

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!password) {
      errors.password = "Password is required";
    } else if (!isStrongPassword(password)) {
      errors.password =
        getPasswordStrengthError(password) || "Password does not meet strength requirements";
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
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to signin with success message
        router.push("/signin?reset=success");
      } else {
        if (data.error?.includes("expired")) {
          setTokenStatus("expired");
        } else if (data.error?.includes("invalid") || data.error?.includes("already been used")) {
          setTokenStatus("invalid");
        } else {
          setError(data.error || "Failed to reset password");
        }
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (tokenStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
        <main className="w-full max-w-md px-6 py-12">
          <div className="rounded-lg bg-zinc-50 p-8 shadow-lg dark:bg-zinc-900">
            <div className="flex flex-col items-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
              <p className="text-zinc-600 dark:text-zinc-400">Validating reset link...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Expired token state
  if (tokenStatus === "expired") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
        <main className="w-full max-w-md px-6 py-12">
          <div className="rounded-lg bg-zinc-50 p-8 shadow-lg dark:bg-zinc-900">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
                <svg
                  className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="mb-4 text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Link Expired
            </h1>

            <p className="mb-6 text-center text-zinc-600 dark:text-zinc-400">
              This password reset link has expired. Reset links are only valid for 1 hour.
            </p>

            <Link
              href="/forgot-password"
              className="block w-full rounded-md bg-foreground px-4 py-2 text-center font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Request New Link
            </Link>

            <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-500">
              <Link
                href="/signin"
                className="font-medium text-zinc-700 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                Back to Sign In
              </Link>
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Invalid token state
  if (tokenStatus === "invalid") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
        <main className="w-full max-w-md px-6 py-12">
          <div className="rounded-lg bg-zinc-50 p-8 shadow-lg dark:bg-zinc-900">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <svg
                  className="h-8 w-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="mb-4 text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Invalid Link
            </h1>

            <p className="mb-6 text-center text-zinc-600 dark:text-zinc-400">
              This password reset link is invalid or has already been used.
            </p>

            <Link
              href="/forgot-password"
              className="block w-full rounded-md bg-foreground px-4 py-2 text-center font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Request New Link
            </Link>

            <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-500">
              <Link
                href="/signin"
                className="font-medium text-zinc-700 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                Back to Sign In
              </Link>
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Valid token - show reset form
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="w-full max-w-md px-6 py-12">
        <div className="rounded-lg bg-zinc-50 p-8 shadow-lg dark:bg-zinc-900">
          <h1 className="mb-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            Reset Password
          </h1>
          <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                New Password <span className="text-red-500">*</span>
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
                className={`w-full rounded-md border px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:ring-zinc-600 ${
                  validationErrors.password
                    ? "border-red-500 dark:border-red-500"
                    : "border-zinc-200 dark:border-zinc-700"
                }`}
                placeholder="••••••••"
              />
              {validationErrors.password && (
                <p
                  id="password-error"
                  className="text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {validationErrors.password}
                </p>
              )}
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Must be at least 8 characters with uppercase, lowercase, number, and special
                character.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
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
                aria-describedby={
                  validationErrors.confirmPassword ? "confirmPassword-error" : undefined
                }
                className={`w-full rounded-md border px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:ring-zinc-600 ${
                  validationErrors.confirmPassword
                    ? "border-red-500 dark:border-red-500"
                    : "border-zinc-200 dark:border-zinc-700"
                }`}
                placeholder="••••••••"
              />
              {validationErrors.confirmPassword && (
                <p
                  id="confirmPassword-error"
                  className="text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-foreground px-4 py-2 font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-[#ccc]"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              href="/signin"
              className="font-medium text-zinc-950 underline hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
