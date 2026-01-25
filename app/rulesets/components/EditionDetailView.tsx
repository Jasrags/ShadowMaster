import { useState, useEffect } from "react";
import { Edition, EditionCode, Book, CreationMethod } from "@/lib/types";
import { X, ArrowRight, Loader2, BookOpen, UserPlus, Layers } from "lucide-react";
import BookCard from "./BookCard";
import CreationMethodCard from "./CreationMethodCard";
import ContentPreview from "./ContentPreview";

interface EditionDetailViewProps {
  editionCode: EditionCode;
  onClose: () => void;
}

export default function EditionDetailView({ editionCode, onClose }: EditionDetailViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    edition: Edition;
    books: Book[];
    creationMethods: CreationMethod[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"overview" | "content" | "books" | "methods">(
    "overview"
  );

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/editions/${editionCode}`);
        const result = await res.json();

        if (result.success) {
          setData(result);
        } else {
          setError(result.error || "Failed to load edition details");
        }
      } catch (err) {
        setError("An error occurred while loading details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [editionCode]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-card">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" aria-hidden="true" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-full bg-card p-6 text-center">
        <p className="text-destructive mb-4">{error || "Data not available"}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  const { edition, books, creationMethods } = data;

  return (
    <div className="h-full overflow-y-auto bg-card border-l border-border animate-in slide-in-from-right duration-300">
      {/* Header with neon accent */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border">
        <div className="p-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{edition.name}</h2>
            <p className="text-sm font-mono text-muted-foreground">
              Released {edition.releaseYear}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <div className="neon-divider mx-4" />
      </div>

      <div className="p-6 space-y-8">
        {/* Actions */}
        <div className="flex flex-col gap-3">
          <a
            href={`/characters/create/sheet?edition=${edition.shortCode}`}
            className="w-full py-3 px-4 bg-emerald-600 text-white font-semibold rounded-lg text-center transition-all hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
          >
            Create Character
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        {/* Tabs with emerald accent */}
        <div className="flex border-b border-border overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === "overview"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === "content"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4" aria-hidden="true" />
              Content
            </span>
          </button>
          <button
            onClick={() => setActiveTab("books")}
            className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === "books"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Books ({books.length})
          </button>
          <button
            onClick={() => setActiveTab("methods")}
            className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === "methods"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Creation Methods ({creationMethods?.length || 0})
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{edition.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                    <span className="font-semibold text-sm">Books Available</span>
                  </div>
                  <p className="text-2xl font-bold font-mono">{books.length}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
                    <UserPlus className="w-4 h-4" aria-hidden="true" />
                    <span className="font-semibold text-sm">Creation Methods</span>
                  </div>
                  <p className="text-2xl font-bold font-mono">{creationMethods?.length || 0}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <ContentPreview editionCode={edition.shortCode} />
            </div>
          )}

          {activeTab === "books" && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {books.map((book) => (
                <BookCard key={book.id} book={book} isCore={book.isCore} />
              ))}
              {books.length === 0 && (
                <p className="text-muted-foreground italic text-center py-8">
                  No books available for this edition.
                </p>
              )}
            </div>
          )}

          {activeTab === "methods" && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {creationMethods?.map((method) => (
                <CreationMethodCard
                  key={method.id}
                  method={method}
                  isDefault={method.id === edition.defaultCreationMethodId}
                  onSelect={() =>
                    (window.location.href = `/characters/create/sheet?edition=${edition.shortCode}`)
                  }
                />
              ))}
              {(!creationMethods || creationMethods.length === 0) && (
                <p className="text-muted-foreground italic text-center py-8">
                  No creation methods available for this edition.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
