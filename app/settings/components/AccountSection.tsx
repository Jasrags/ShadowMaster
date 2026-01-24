import { useState } from "react";
import { User, Mail, Save, CheckCircle, AlertCircle, Send } from "lucide-react";

interface AccountSectionProps {
  user: {
    username: string;
    email: string;
    role: string[];
    createdAt: string;
    lastLogin?: string | null;
    emailVerified: boolean;
    emailVerifiedAt?: string | null;
  };
  onUpdate: (updates: { email?: string; username?: string }) => Promise<void>;
}

type VerificationStatus = "idle" | "sending" | "sent" | "error" | "rate_limited";

export function AccountSection({ user, onUpdate }: AccountSectionProps) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle");

  const handleSendVerification = async () => {
    setVerificationStatus("sending");

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setVerificationStatus("sent");
        // Reset to idle after showing success
        setTimeout(() => setVerificationStatus("idle"), 5000);
      } else if (response.status === 429) {
        setVerificationStatus("rate_limited");
      } else {
        setVerificationStatus("error");
      }
    } catch {
      setVerificationStatus("error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await onUpdate({ username, email });
      setMessage({ type: "success", text: "Account updated successfully." });
    } catch {
      setMessage({ type: "error", text: "Failed to update account." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm transition-colors">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-medium text-foreground">Account Information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your account details and profile information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {message && (
            <div
              className={`rounded-md p-4 transition-colors ${
                message.type === "success"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-foreground/80">
              Username
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-input bg-background text-foreground px-3 py-2 focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground/80">
              Email Address
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-input bg-background text-foreground px-3 py-2 focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            {/* Email Verification Status */}
            <div className="mt-3">
              {user.emailVerified ? (
                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    Verified
                    {user.emailVerifiedAt && (
                      <span className="text-muted-foreground ml-1">
                        on {new Date(user.emailVerifiedAt).toLocaleDateString()}
                      </span>
                    )}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>Not verified</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSendVerification}
                      disabled={verificationStatus === "sending"}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-3.5 w-3.5" />
                      {verificationStatus === "sending" ? "Sending..." : "Send verification email"}
                    </button>
                    {verificationStatus === "sent" && (
                      <span className="text-sm text-emerald-600 dark:text-emerald-400">
                        Email sent! Check your inbox.
                      </span>
                    )}
                    {verificationStatus === "rate_limited" && (
                      <span className="text-sm text-red-600 dark:text-red-400">
                        Too many requests. Try again later.
                      </span>
                    )}
                    {verificationStatus === "error" && (
                      <span className="text-sm text-red-600 dark:text-red-400">
                        Failed to send. Please try again.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground/80">Role</label>
              <div className="mt-1 block w-full rounded-md border border-border bg-muted px-3 py-2 text-muted-foreground">
                {user.role.join(", ")}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80">Member Since</label>
              <div className="mt-1 block w-full rounded-md border border-border bg-muted px-3 py-2 text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-black"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
