"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "react-aria-components";
import { useAuth } from "@/lib/auth/AuthProvider";
import { isValidEmail } from "@/lib/auth/validation";

type AuthMode = "magic-link" | "password";

/**
 * Error messages for magic link errors from URL params
 */
const errorMessages: Record<string, string> = {
  invalid_link: "This sign-in link is invalid or has already been used.",
  link_expired: "This sign-in link has expired. Please request a new one.",
  account_locked: "Your account is temporarily locked. Please try again later.",
  email_not_verified: "Please verify your email before using magic links.",
  account_suspended: "Your account has been suspended. Please contact support.",
};

/**
 * Component that reads search params and sets messages
 * Must be wrapped in Suspense boundary
 */
function SearchParamsHandler({
  onResetSuccess,
  onError,
}: {
  onResetSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("reset") === "success") {
      onResetSuccess(
        "Your password has been reset successfully. Please sign in with your new password."
      );
    }

    const errorParam = searchParams.get("error");
    if (errorParam && errorMessages[errorParam]) {
      onError(errorMessages[errorParam]);
    }
  }, [searchParams, onResetSuccess, onError]);

  return null;
}

export default function SigninPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("magic-link");
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

  // Magic link specific state
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState("");

  const { signIn } = useAuth();

  // Memoize handlers for SearchParamsHandler
  const handleResetSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
  }, []);

  const handleError = useCallback((message: string) => {
    setError(message);
  }, []);

  const validatePasswordForm = (): boolean => {
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

  const validateMagicLinkForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Invalid email format";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validatePasswordForm()) {
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

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateMagicLinkForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMagicLinkSent(true);
        setMagicLinkEmail(email);
      } else {
        setError(data.error || "Failed to send magic link");
      }
    } catch {
      setError("Failed to send magic link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendMagicLink = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: magicLinkEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage("A new sign-in link has been sent to your email.");
      } else {
        setError(data.error || "Failed to resend magic link");
      }
    } catch {
      setError("Failed to resend magic link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryDifferentEmail = () => {
    setMagicLinkSent(false);
    setMagicLinkEmail("");
    setEmail("");
    setError(null);
    setSuccessMessage(null);
  };

  const switchAuthMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setError(null);
    setSuccessMessage(null);
    setValidationErrors({});
    setMagicLinkSent(false);
    setMagicLinkEmail("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      {/* Suspense boundary for useSearchParams */}
      <Suspense fallback={null}>
        <SearchParamsHandler onResetSuccess={handleResetSuccess} onError={handleError} />
      </Suspense>

      <main className="w-full max-w-md px-6 py-12">
        <div className="rounded-lg bg-zinc-50 p-8 shadow-lg dark:bg-zinc-900">
          <h1 className="mb-6 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">Sign In</h1>

          {/* Auth Mode Toggle */}
          <div className="mb-6 flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => switchAuthMode("magic-link")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                authMode === "magic-link"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => switchAuthMode("password")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                authMode === "password"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              Password
            </button>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-200">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Magic Link Mode */}
          {authMode === "magic-link" && (
            <>
              {magicLinkSent ? (
                // Magic link sent success state
                <div className="space-y-4">
                  <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                    <h2 className="mb-2 font-medium text-blue-900 dark:text-blue-100">
                      Check your email
                    </h2>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      We sent a sign-in link to{" "}
                      <span className="font-medium">{magicLinkEmail}</span>
                    </p>
                    <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                      Click the link in the email to sign in. The link expires in 15 minutes.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleResendMagicLink}
                      disabled={isLoading}
                      className="w-full rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      {isLoading ? "Sending..." : "Resend link"}
                    </button>
                    <button
                      type="button"
                      onClick={handleTryDifferentEmail}
                      className="w-full rounded-md px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      Try a different email
                    </button>
                  </div>
                </div>
              ) : (
                // Magic link request form
                <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Enter your email and we&apos;ll send you a link to sign in instantly.
                  </p>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="magic-link-email"
                      className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="magic-link-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-invalid={!!validationErrors.email}
                      aria-describedby={
                        validationErrors.email ? "magic-link-email-error" : undefined
                      }
                      className={`w-full rounded-md border px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:ring-zinc-600 ${
                        validationErrors.email
                          ? "border-red-500 dark:border-red-500"
                          : "border-zinc-200 dark:border-zinc-700"
                      }`}
                      placeholder="you@example.com"
                    />
                    {validationErrors.email && (
                      <p
                        id="magic-link-email-error"
                        className="text-sm text-red-600 dark:text-red-400"
                        role="alert"
                      >
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-md bg-foreground px-4 py-2 font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-[#ccc]"
                    >
                      {isLoading ? "Sending..." : "Send sign-in link"}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Password Mode */}
          {authMode === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
                  <p
                    id="email-error"
                    className="text-sm text-red-600 dark:text-red-400"
                    role="alert"
                  >
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
                  className="h-5 w-5 rounded border-2 border-zinc-200 bg-zinc-50 text-zinc-950 focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:checked:border-zinc-50 dark:checked:bg-zinc-50"
                />
                <label
                  htmlFor="rememberMe"
                  className="cursor-pointer text-sm text-zinc-700 dark:text-zinc-300"
                >
                  Remember me
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-md bg-foreground px-4 py-2 font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-[#ccc]"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>
          )}

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
