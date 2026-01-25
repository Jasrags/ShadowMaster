import { Edition, EditionCode } from "@/lib/types";
import { Book, Layers, ArrowRight } from "lucide-react";

interface EditionCardProps {
  edition: Edition;
  onSelect: (code: EditionCode) => void;
  isSelected?: boolean;
}

// Get neon card class based on edition code
function getEditionCardClass(editionCode: EditionCode): string {
  // Map editions to thematic colors
  switch (editionCode) {
    case "sr5":
      return "neon-card-sam"; // Green - the "classic" modern edition
    case "sr6":
      return "neon-card-decker"; // Cyan - newest, most "tech forward"
    case "sr4":
    case "sr4a":
      return "neon-card-mage"; // Purple - the "wireless matrix" era
    case "sr3":
      return "neon-card-face"; // Amber - the "chrome" era
    default:
      return "neon-card-sam"; // Default green
  }
}

// Get hover color based on edition
function getEditionHoverColor(editionCode: EditionCode): string {
  switch (editionCode) {
    case "sr5":
      return "group-hover:text-emerald-500";
    case "sr6":
      return "group-hover:text-cyan-500";
    case "sr4":
    case "sr4a":
      return "group-hover:text-violet-500";
    case "sr3":
      return "group-hover:text-amber-500";
    default:
      return "group-hover:text-emerald-500";
  }
}

// Get accent color for icon background
function getEditionAccentColor(editionCode: EditionCode): {
  bg: string;
  bgHover: string;
  text: string;
} {
  switch (editionCode) {
    case "sr5":
      return {
        bg: "bg-emerald-500/10",
        bgHover: "group-hover:bg-emerald-500 group-hover:text-white",
        text: "text-emerald-500",
      };
    case "sr6":
      return {
        bg: "bg-cyan-500/10",
        bgHover: "group-hover:bg-cyan-500 group-hover:text-white",
        text: "text-cyan-500",
      };
    case "sr4":
    case "sr4a":
      return {
        bg: "bg-violet-500/10",
        bgHover: "group-hover:bg-violet-500 group-hover:text-white",
        text: "text-violet-500",
      };
    case "sr3":
      return {
        bg: "bg-amber-500/10",
        bgHover: "group-hover:bg-amber-500 group-hover:text-white",
        text: "text-amber-500",
      };
    default:
      return {
        bg: "bg-emerald-500/10",
        bgHover: "group-hover:bg-emerald-500 group-hover:text-white",
        text: "text-emerald-500",
      };
  }
}

export default function EditionCard({ edition, onSelect, isSelected }: EditionCardProps) {
  const cardClass = getEditionCardClass(edition.shortCode);
  const hoverColor = getEditionHoverColor(edition.shortCode);
  const accentColors = getEditionAccentColor(edition.shortCode);

  return (
    <div
      onClick={() => onSelect(edition.shortCode)}
      className={`group relative overflow-hidden rounded-xl border bg-card cursor-pointer transition-all duration-300 neon-card ${cardClass} ${
        isSelected ? "ring-2 ring-primary/50 shadow-lg" : ""
      }`}
    >
      <div className="p-6 pt-7">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className={`text-2xl font-bold text-foreground transition-colors ${hoverColor}`}>
              {edition.name}
            </h3>
            <span className="inline-block mt-1 text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              Released {edition.releaseYear}
            </span>
          </div>
          <div
            className={`p-2 rounded-full ${accentColors.bg} ${accentColors.text} ${accentColors.bgHover} transition-colors`}
          >
            <Layers className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>

        <p className="text-muted-foreground mb-6 line-clamp-3">{edition.description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Book className="w-4 h-4" aria-hidden="true" />
            <span className="font-mono font-semibold text-foreground">
              {edition.bookIds.length}
            </span>
            <span>Books</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-muted/30 border-t border-border flex justify-between items-center group-hover:bg-muted/50 transition-colors">
        <span className="text-sm font-medium text-foreground">View Details</span>
        <ArrowRight
          className={`w-4 h-4 ${accentColors.text} transform group-hover:translate-x-1 transition-transform`}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
