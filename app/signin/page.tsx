"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "react-aria-components";
import { useAuth } from "@/lib/auth/AuthProvider";
import { isValidEmail } from "@/lib/auth/validation";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const { signIn } = useAuth();
  const searchParams = useSearchParams();

  // Check for reset success message on mount
  useEffect(() => {
    if (searchParams.get("reset") === "success") {
      setSuccessMessage(
        "Your password has been reset successfully. Please sign in with your new password."
      );
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn({ email, password, rememberMe });
      if (!result.success) {
        setError(result.error || "Sign in failed");
      }
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="w-full max-w-md px-6 py-12">
        <div className="rounded-lg bg-zinc-50 p-8 shadow-lg dark:bg-zinc-900">
          <h1 className="mb-6 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {successMessage && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-200">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
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
                className={`w-full rounded-md border px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:ring-zinc-600 ${
                  validationErrors.email
                    ? "border-red-500 dark:border-red-500"
                    : "border-zinc-200 dark:border-zinc-700"
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
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
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
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Forgot password?
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-5 w-5 rounded border-2 border-zinc-200 bg-zinc-50 text-zinc-950 focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:checked:bg-zinc-50 dark:checked:border-zinc-50"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-foreground px-4 py-2 font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-[#ccc]"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-zinc-950 underline hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
