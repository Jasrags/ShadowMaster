import { CreationMethod } from "@/lib/types";
import { UserPlus } from "lucide-react";

interface CreationMethodCardProps {
  method: CreationMethod;
  isDefault?: boolean;
  onSelect: (methodId: string) => void;
}

export default function CreationMethodCard({
  method,
  isDefault,
  onSelect,
}: CreationMethodCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border transition-colors ${
        isDefault
          ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50"
          : "border-border bg-card hover:border-muted-foreground/30"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-md ${
              isDefault
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <UserPlus className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-foreground">{method.name}</h4>
              {isDefault && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20">
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{method.description}</p>
          </div>
        </div>
        <button
          onClick={() => onSelect(method.id)}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 whitespace-nowrap"
        >
          Select
        </button>
      </div>
    </div>
  );
}
