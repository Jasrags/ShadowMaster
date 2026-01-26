"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "react-aria-components";
import { useAuth } from "@/lib/auth/AuthProvider";

type BannerStatus = "idle" | "sending" | "sent" | "error" | "rate_limited";

/**
 * Email Verification Banner
 *
 * Displays an amber banner for unverified users prompting them to verify their email.
 * Features:
 * - Resend verification email button
 * - Status messages (sent, error, rate limited)
 * - Dismissible (X button) - persists for session
 * - Shows verification success from URL params
 */
export function EmailVerificationBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [status, setStatus] = useState<BannerStatus>("idle");
  const [showVerified, setShowVerified] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const hasProcessedUrlRef = useRef(false);

  // Check URL params for verification status (one-time on mount)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasProcessedUrlRef.current) return;
    hasProcessedUrlRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const verified = params.get("verified");
    const verification = params.get("verification");
    const reason = params.get("reason");

    // Defer state updates to avoid synchronous cascading renders
    queueMicrotask(() => {
      if (verified === "true") {
        setShowVerified(true);
        // Clear the URL params after showing the message
        const url = new URL(window.location.href);
        url.searchParams.delete("verified");
        window.history.replaceState({}, "", url.toString());
        // Auto-dismiss success message after 5 seconds
        setTimeout(() => setShowVerified(false), 5000);
      }

      if (verification === "error") {
        switch (reason) {
          case "expired":
            setVerificationError("Your verification link has expired. Please request a new one.");
            break;
          case "invalid":
            setVerificationError("Invalid verification link. Please request a new one.");
            break;
          default:
            setVerificationError("Verification failed. Please try again.");
        }
        // Clear the URL params
        const url = new URL(window.location.href);
        url.searchParams.delete("verification");
        url.searchParams.delete("reason");
        window.history.replaceState({}, "", url.toString());
      }

      if (verification === "already_verified") {
        // Clear the URL params - user is already verified
        const url = new URL(window.location.href);
        url.searchParams.delete("verification");
        window.history.replaceState({}, "", url.toString());
      }
    });
  }, []);

  // Don't render if user is not logged in or email is verified
  if (!user || user.emailVerified) {
    // Show verification success toast even for verified users
    if (showVerified) {
      return (
        <div className="bg-green-600 text-white px-4 py-3">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5" />
              <span>Your email has been verified successfully!</span>
            </div>
            <Button
              onPress={() => setShowVerified(false)}
              className="p-1 hover:bg-green-700 rounded transition-colors"
              aria-label="Dismiss"
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      );
    }
    return null;
  }

  // Don't render if dismissed
  if (dismissed && !verificationError) {
    return null;
  }

  const handleResend = async () => {
    setStatus("sending");
    setVerificationError(null);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("sent");
        // Reset to idle after showing success
        setTimeout(() => setStatus("idle"), 5000);
      } else if (response.status === 429) {
        setStatus("rate_limited");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "sending":
        return "Sending verification email...";
      case "sent":
        return "Verification email sent! Check your inbox.";
      case "rate_limited":
        return "Too many requests. Please try again later.";
      case "error":
        return "Failed to send email. Please try again.";
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="bg-amber-600 text-white px-4 py-3">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <MailIcon className="h-5 w-5 shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            {verificationError ? (
              <span className="text-sm font-medium">{verificationError}</span>
            ) : (
              <span className="text-sm font-medium">
                Please verify your email address to secure your account.
              </span>
            )}
            {statusMessage && (
              <span
                className={`text-sm ${
                  status === "sent"
                    ? "text-green-200"
                    : status === "error" || status === "rate_limited"
                      ? "text-red-200"
                      : "text-amber-200"
                }`}
              >
                {statusMessage}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onPress={handleResend}
            isDisabled={status === "sending"}
            className="px-3 py-1.5 text-sm font-medium bg-white/20 hover:bg-white/30 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "sending" ? "Sending..." : "Resend email"}
          </Button>
          <Button
            onPress={() => {
              setDismissed(true);
              setVerificationError(null);
            }}
            className="p-1 hover:bg-amber-700 rounded transition-colors"
            aria-label="Dismiss"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
