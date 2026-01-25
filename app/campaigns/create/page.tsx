"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  Edition,
  Book,
  CreationMethod,
  GameplayLevel,
  CampaignVisibility,
  CampaignTemplate,
} from "@/lib/types";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function CreateCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editionCode, setEditionCode] = useState("");
  const [enabledBookIds, setEnabledBookIds] = useState<string[]>([]);
  const [enabledCreationMethodIds, setEnabledCreationMethodIds] = useState<string[]>([]);
  const [gameplayLevel, setGameplayLevel] = useState<GameplayLevel>("experienced");
  const [visibility, setVisibility] = useState<CampaignVisibility>("invite-only");
  const [maxPlayers, setMaxPlayers] = useState<number | undefined>(undefined);

  // Data for dropdowns
  const [editions, setEditions] = useState<Edition[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [creationMethods, setCreationMethods] = useState<CreationMethod[]>([]);
  const [loadingEditions, setLoadingEditions] = useState(true);

  // Template state
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  // Fetch editions and templates on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [editionsRes, templatesRes] = await Promise.all([
          fetch("/api/editions"),
          fetch("/api/campaigns/templates"),
        ]);

        const editionsData = await editionsRes.json();
        const templatesData = await templatesRes.json();

        if (editionsData.success) {
          setEditions(editionsData.editions || []);
        }
        if (templatesData.success) {
          setTemplates(templatesData.templates || []);
        }
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setLoadingEditions(false);
        setLoadingTemplates(false);
      }
    }
    fetchData();
  }, []);

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setTitle(template.name);
      setDescription(template.description || "");
      setEditionCode(template.editionCode);
      setEnabledBookIds(template.enabledBookIds);
      setEnabledCreationMethodIds(template.enabledCreationMethodIds);
      setGameplayLevel(template.gameplayLevel);
      // Optionally set visibility or other fields
    } else if (templateId === "") {
      // Reset if deselected
      setTitle("");
      setDescription("");
      setEditionCode("");
      setEnabledBookIds([]);
      setEnabledCreationMethodIds([]);
      setGameplayLevel("experienced");
    }
  };

  // Fetch books and creation methods when edition changes
  useEffect(() => {
    if (!editionCode) {
      setBooks([]);
      setCreationMethods([]);
      setEnabledBookIds([]);
      setEnabledCreationMethodIds([]);
      return;
    }

    async function fetchEditionDetails() {
      try {
        const res = await fetch(`/api/editions/${editionCode}`);
        const data = await res.json();
        if (data.success) {
          setBooks(data.books || []);
          setCreationMethods(data.creationMethods || []);
          // Auto-select core book and default creation method
          const coreBook = data.books?.find((b: Book) => b.isCore);
          if (coreBook) {
            setEnabledBookIds([coreBook.id]);
          }
          const defaultMethod = data.creationMethods?.[0];
          if (defaultMethod) {
            setEnabledCreationMethodIds([defaultMethod.id]);
          }
        }
      } catch {
        console.error("Failed to load edition details");
      }
    }
    fetchEditionDetails();
  }, [editionCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || undefined,
          editionCode,
          enabledBookIds,
          enabledCreationMethodIds,
          gameplayLevel,
          visibility,
          maxPlayers: maxPlayers || undefined,
        }),
      });

      const data = await res.json();

      if (data.success && data.campaign) {
        router.push(`/campaigns/${data.campaign.id}`);
      } else {
        setError(data.error || "Failed to create campaign");
      }
    } catch {
      setError("An error occurred while creating the campaign");
    } finally {
      setLoading(false);
    }
  };

  const toggleBookId = (bookId: string) => {
    setEnabledBookIds((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const toggleMethodId = (methodId: string) => {
    setEnabledCreationMethodIds((prev) =>
      prev.includes(methodId) ? prev.filter((id) => id !== methodId) : [...prev, methodId]
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => router.push("/campaigns")}
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Campaigns
      </button>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Create Campaign</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Set up a new campaign with your preferred rules and settings.
        </p>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Template Selection */}
          {templates.length > 0 && (
            <div className="rounded-md border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/30 dark:bg-indigo-900/10">
              <label
                htmlFor="template"
                className="block text-sm font-medium text-indigo-900 dark:text-indigo-400"
              >
                Start from Template (Optional)
              </label>
              <p className="mb-2 text-xs text-indigo-700/70 dark:text-indigo-400/70">
                Pre-fill this form with a saved campaign configuration.
              </p>
              <select
                id="template"
                value={selectedTemplateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="mt-1 block w-full rounded-md border border-indigo-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-indigo-800 dark:bg-zinc-800 dark:text-white"
                disabled={loadingTemplates}
              >
                <option value="">No Template (Clean Start)</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.editionCode.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Campaign Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              maxLength={100}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="Enter campaign title"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="Describe your campaign (optional)"
            />
          </div>

          {/* Edition */}
          <div>
            <label
              htmlFor="edition"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Edition *
            </label>
            <select
              id="edition"
              value={editionCode}
              onChange={(e) => setEditionCode(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              disabled={loadingEditions}
            >
              <option value="">Select an edition</option>
              {editions.map((edition) => (
                <option key={edition.shortCode} value={edition.shortCode}>
                  {edition.name}
                </option>
              ))}
            </select>
          </div>

          {/* Books */}
          {editionCode && books.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Enabled Books *
              </label>
              <div className="mt-2 space-y-2">
                {books.map((book) => (
                  <label key={book.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enabledBookIds.includes(book.id)}
                      onChange={() => toggleBookId(book.id)}
                      className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {book.title}
                      {book.isCore && (
                        <span className="ml-1 text-xs text-indigo-600 dark:text-indigo-400">
                          (Core)
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Creation Methods */}
          {editionCode && creationMethods.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Allowed Creation Methods *
              </label>
              <div className="mt-2 space-y-2">
                {creationMethods.map((method) => (
                  <label key={method.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enabledCreationMethodIds.includes(method.id)}
                      onChange={() => toggleMethodId(method.id)}
                      className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{method.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Gameplay Level */}
          <div>
            <label
              htmlFor="gameplayLevel"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Gameplay Level *
            </label>
            <select
              id="gameplayLevel"
              value={gameplayLevel}
              onChange={(e) => setGameplayLevel(e.target.value as GameplayLevel)}
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              <option value="street">Street Level</option>
              <option value="experienced">Experienced</option>
              <option value="prime-runner">Prime Runner</option>
            </select>
          </div>

          {/* Visibility */}
          <div>
            <label
              htmlFor="visibility"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Visibility *
            </label>
            <select
              id="visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as CampaignVisibility)}
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              <option value="private">Private (GM only)</option>
              <option value="invite-only">Invite Only (with code)</option>
              <option value="public">Public</option>
            </select>
          </div>

          {/* Max Players */}
          <div>
            <label
              htmlFor="maxPlayers"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Max Players (optional)
            </label>
            <input
              type="number"
              id="maxPlayers"
              value={maxPlayers || ""}
              onChange={(e) => setMaxPlayers(e.target.value ? parseInt(e.target.value) : undefined)}
              min={1}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="Leave blank for unlimited"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push("/campaigns")}
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !title ||
                !editionCode ||
                enabledBookIds.length === 0 ||
                enabledCreationMethodIds.length === 0
              }
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/40 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Campaign"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
