import { Book } from "@/lib/types";
import { BookOpen } from "lucide-react";

interface BookCardProps {
  book: Book;
  isCore?: boolean;
}

export default function BookCard({ book, isCore }: BookCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border ${isCore ? "border-primary/50 bg-primary/5" : "border-border bg-card"}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-md ${isCore ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
        >
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-medium text-foreground">{book.title}</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {book.categories.map((cat) => (
              <span
                key={cat}
                className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground capitalize"
              >
                {cat}
              </span>
            ))}
            {isCore && (
              <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
                Core Rulebook
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
