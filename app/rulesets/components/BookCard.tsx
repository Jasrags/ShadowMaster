import { Book } from "@/lib/types";
import { BookOpen } from "lucide-react";

interface BookCardProps {
  book: Book;
  isCore?: boolean;
}

export default function BookCard({ book, isCore }: BookCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border transition-colors ${
        isCore
          ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50"
          : "border-border bg-card hover:border-muted-foreground/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-md ${
            isCore
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <BookOpen className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h4 className="font-medium text-foreground">{book.title}</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {book.categories.map((cat) => (
              <span
                key={cat}
                className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground capitalize font-mono"
              >
                {cat}
              </span>
            ))}
            {isCore && (
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20">
                Core Rulebook
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
