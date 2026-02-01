"use client";

import { useEffect, useState } from "react";
import { Link } from "react-aria-components";
import type { Character } from "@/lib/types";
import { useAuth } from "@/lib/auth/AuthProvider";
import { CharacterImportDialog } from "./components/CharacterImportDialog";
import { StabilityShield } from "@/components/sync";
import { BaseModalRoot, ModalBody, ModalFooter } from "@/components/ui";
import { AlertTriangle, X } from "lucide-react";

// Extended character type with owner info for admin mode
interface CharacterWithOwner extends Character {
  ownerUsername?: string;
}

// =============================================================================
// ICONS
// =============================================================================

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 10h16M4 14h16M4 18h16"
      />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

// =============================================================================
// DELETE CONFIRMATION MODAL
// =============================================================================

interface DeleteCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  characterName: string;
  isDeleting: boolean;
}

function DeleteCharacterModal({
  isOpen,
  onClose,
  onConfirm,
  characterName,
  isDeleting,
}: DeleteCharacterModalProps) {
  return (
    <BaseModalRoot isOpen={isOpen} onClose={onClose} size="sm" zIndex={60}>
      {({ close }) => (
        <>
          {/* Red-themed danger header */}
          <div className="flex items-center justify-between border-b border-red-200 bg-red-50 px-6 py-4 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">
                Delete Character
              </h2>
            </div>
            <button
              onClick={close}
              aria-label="Close modal"
              className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-800 dark:hover:text-red-300"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <ModalBody className="p-6">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Are you sure you want to delete
                </p>
                <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {characterName}
                </p>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                This action cannot be undone. All character data will be permanently removed.
              </p>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="flex w-full justify-end gap-3">
              <button
                onClick={close}
                disabled={isDeleting}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4" />
                    Delete Character
                  </>
                )}
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}

// =============================================================================
// ARCHETYPE HELPERS
// =============================================================================

// Get neon card class based on character archetype/magical path
function getArchetypeCardClass(character: CharacterWithOwner): string {
  const path = character.magicalPath;
  if (path === "full-mage" || path === "aspected-mage" || path === "explorer") {
    return "neon-card-mage";
  }
  if (path === "adept") {
    return "neon-card-face"; // Adepts get amber/face color
  }
  if (path === "technomancer") {
    return "neon-card-decker";
  }
  // Default to sam (green) for mundane characters
  return "neon-card-sam";
}

// Get hover text color based on archetype
function getArchetypeHoverColor(character: CharacterWithOwner): string {
  const path = character.magicalPath;
  if (path === "full-mage" || path === "aspected-mage" || path === "explorer") {
    return "group-hover:text-violet-500 dark:group-hover:text-violet-400";
  }
  if (path === "adept") {
    return "group-hover:text-amber-500 dark:group-hover:text-amber-400";
  }
  if (path === "technomancer") {
    return "group-hover:text-blue-500 dark:group-hover:text-blue-400";
  }
  return "group-hover:text-emerald-500 dark:group-hover:text-emerald-400";
}

// Get archetype label and color for display
function getArchetypeLabel(character: CharacterWithOwner): { label: string; colorClass: string } {
  const path = character.magicalPath;
  if (path === "full-mage" || path === "aspected-mage" || path === "explorer") {
    return { label: path.replace(/-/g, " "), colorClass: "text-violet-500 dark:text-violet-400" };
  }
  if (path === "adept") {
    return { label: "Adept", colorClass: "text-amber-500 dark:text-amber-400" };
  }
  if (path === "technomancer") {
    return { label: "Technomancer", colorClass: "text-blue-500 dark:text-blue-400" };
  }
  return { label: "Mundane", colorClass: "text-emerald-600 dark:text-emerald-400" };
}

// =============================================================================
// STATUS BADGE COMPONENT
// =============================================================================

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active:
      "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
    draft:
      "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30",
    retired:
      "bg-zinc-500/10 text-zinc-700 border-zinc-500/20 dark:bg-zinc-500/20 dark:text-zinc-400 dark:border-zinc-500/30",
    deceased:
      "bg-red-500/10 text-red-700 border-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
  };

  return (
    <span
      className={`px-2 py-0.5 text-xs font-mono uppercase rounded border ${styles[status] || styles.draft}`}
    >
      {status}
    </span>
  );
}

// =============================================================================
// CHARACTER CARD COMPONENT
// =============================================================================

type SortOption = "updated" | "name" | "karma" | "created";
type ViewMode = "grid" | "list";

interface CharacterCardProps {
  character: CharacterWithOwner;
  onDeleteClick: (character: CharacterWithOwner) => void;
  viewMode?: ViewMode;
  isAdminMode?: boolean;
}

function CharacterCard({
  character,
  onDeleteClick,
  viewMode = "grid",
  isAdminMode = false,
}: CharacterCardProps) {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteClick(character);
  };

  const cardClass = getArchetypeCardClass(character);
  const hoverColor = getArchetypeHoverColor(character);
  const archetype = getArchetypeLabel(character);

  // List view variant
  if (viewMode === "list") {
    return (
      <Link
        href={
          character.status === "draft"
            ? `/characters/${character.id}/edit`
            : `/characters/${character.id}`
        }
        className="group relative block"
      >
        <div
          className={`relative rounded-lg border border-border bg-card neon-card ${cardClass} transition-all duration-300`}
        >
          <div className="flex items-center gap-4 p-4 pt-5">
            {/* Name & Metatype */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h3
                  className={`font-bold text-foreground truncate transition-colors ${hoverColor}`}
                >
                  {character.name || "Unnamed Runner"}
                </h3>
                <StabilityShield
                  characterId={character.id}
                  size="sm"
                  syncStatus={character.syncStatus}
                  legalityStatus={character.legalityStatus}
                />
                <div className="shrink-0">
                  <StatusBadge status={character.status} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm">
                <span className="text-muted-foreground capitalize">
                  {character.metatype || "Unknown"}
                </span>
                {character.magicalPath && character.magicalPath !== "mundane" && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className={`capitalize ${archetype.colorClass}`}>{archetype.label}</span>
                  </>
                )}
                <span className="text-muted-foreground">•</span>
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  {character.editionCode}
                </span>
                {isAdminMode && character.ownerUsername && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-xs text-amber-500 dark:text-amber-400">
                      Owner: {character.ownerUsername}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-6 text-sm">
              <div className="text-center">
                <span className="block text-xs text-muted-foreground uppercase tracking-wide">
                  Karma
                </span>
                <span className="font-mono font-bold stat-karma">
                  {character.karmaCurrent ?? 0}
                </span>
              </div>
              <div className="text-center">
                <span className="block text-xs text-muted-foreground uppercase tracking-wide">
                  Nuyen
                </span>
                <span className="font-mono font-bold stat-nuyen">
                  ¥{((character.nuyen ?? 0) / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="text-center">
                <span className="block text-xs text-muted-foreground uppercase tracking-wide">
                  ESS
                </span>
                <span className="font-mono font-bold stat-essence">
                  {(character.specialAttributes?.essence ?? 6).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Date & Delete */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden md:block font-mono">
                {new Date(character.updatedAt || character.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={handleDeleteClick}
                className="p-1.5 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                aria-label={`Delete ${character.name || "character"}`}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view (default)
  return (
    <Link
      href={
        character.status === "draft"
          ? `/characters/${character.id}/edit`
          : `/characters/${character.id}`
      }
      className="group relative block"
    >
      <div
        className={`relative rounded-lg border border-border bg-card neon-card ${cardClass} transition-all duration-300`}
      >
        {/* Card content with padding to account for accent bar */}
        <div className="relative p-5 pt-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3
                  className={`font-bold text-lg text-foreground truncate transition-colors ${hoverColor}`}
                >
                  {character.name || "Unnamed Runner"}
                </h3>
                <StabilityShield
                  characterId={character.id}
                  size="sm"
                  syncStatus={character.syncStatus}
                  legalityStatus={character.legalityStatus}
                />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground capitalize">
                  {character.metatype || "Unknown"}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  {character.editionCode}
                </span>
              </div>
            </div>
            <div className="shrink-0">
              <StatusBadge status={character.status} />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 bg-muted/30 dark:bg-zinc-800/50 rounded border border-border/50">
              <span className="block text-xs text-muted-foreground uppercase tracking-wide">
                Karma
              </span>
              <span className="text-sm font-mono font-bold stat-karma">
                {character.karmaCurrent ?? 0}
              </span>
            </div>
            <div className="text-center p-2 bg-muted/30 dark:bg-zinc-800/50 rounded border border-border/50">
              <span className="block text-xs text-muted-foreground uppercase tracking-wide">
                Nuyen
              </span>
              <span className="text-sm font-mono font-bold stat-nuyen">
                ¥{((character.nuyen ?? 0) / 1000).toFixed(0)}k
              </span>
            </div>
            <div className="text-center p-2 bg-muted/30 dark:bg-zinc-800/50 rounded border border-border/50">
              <span className="block text-xs text-muted-foreground uppercase tracking-wide">
                ESS
              </span>
              <span className="text-sm font-mono font-bold stat-essence">
                {(character.specialAttributes?.essence ?? 6).toFixed(1)}
              </span>
            </div>
          </div>

          {/* Owner info in admin mode */}
          {isAdminMode && character.ownerUsername && (
            <div className="flex items-center gap-2 mb-4 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded">
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Owner: <span className="font-medium">{character.ownerUsername}</span>
              </span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            {/* Archetype label */}
            <span className={`text-xs font-medium capitalize ${archetype.colorClass}`}>
              {archetype.label}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">
                {new Date(character.updatedAt || character.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={handleDeleteClick}
                className="p-1.5 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                aria-label={`Delete ${character.name || "character"}`}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// =============================================================================
// EMPTY STATE COMPONENT
// =============================================================================

function EmptyState() {
  return (
    <div className="rounded-lg border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 p-12 text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 p-4 flex items-center justify-center">
        <UserIcon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-foreground">No characters yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Get started by creating your first Shadowrun character.
      </p>
      <div className="mt-6">
        <Link
          href="/characters/create/sheet"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-background"
        >
          <PlusIcon className="h-4 w-4" />
          Create Character
        </Link>
      </div>
    </div>
  );
}

// =============================================================================
// LOADING STATE COMPONENT
// =============================================================================

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-card p-5 animate-pulse neon-card neon-card-default"
        >
          <div className="pt-1">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-muted rounded" />
                <div className="h-4 w-24 bg-muted rounded" />
              </div>
              <div className="h-5 w-16 bg-muted rounded" />
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-12 bg-muted/50 rounded" />
              ))}
            </div>
            <div className="h-px bg-border" />
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// FILTER TABS COMPONENT
// =============================================================================

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: Record<string, number>;
}

function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  const filters = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "draft", label: "Drafts" },
    { id: "retired", label: "Retired" },
  ];

  return (
    <div className="flex gap-1 p-1 bg-muted/50 dark:bg-zinc-800/50 rounded-lg border border-border">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            activeFilter === filter.id
              ? "bg-background text-foreground shadow-sm border border-emerald-500/30 dark:border-emerald-500/50"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50 border border-transparent"
          }`}
        >
          {filter.label}
          {counts[filter.id] !== undefined && (
            <span
              className={`ml-1.5 text-xs font-mono ${
                activeFilter === filter.id
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              }`}
            >
              ({counts[filter.id]})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function CharactersPage() {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<CharacterWithOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isImporting, setIsImporting] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Admin mode state
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [owners, setOwners] = useState<Array<{ id: string; username: string }>>([]);
  const [ownerFilter, setOwnerFilter] = useState<string>("");

  // Delete modal state
  const [characterToDelete, setCharacterToDelete] = useState<CharacterWithOwner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role?.includes("administrator") ?? false;

  useEffect(() => {
    async function fetchCharacters() {
      setLoading(true);
      setError(null);

      try {
        const url = isAdminMode
          ? `/api/characters?admin=true${ownerFilter ? `&ownerId=${ownerFilter}` : ""}`
          : "/api/characters";
        const response = await fetch(url);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to load characters");
        }

        setCharacters(data.characters || []);

        // Store owners for filter dropdown (admin mode only)
        if (data.owners) {
          setOwners(data.owners);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchCharacters();
  }, [isAdminMode, ownerFilter]);

  // Reset owner filter when exiting admin mode
  useEffect(() => {
    if (!isAdminMode) {
      setOwnerFilter("");
    }
  }, [isAdminMode]);

  const handleDeleteClick = (character: CharacterWithOwner) => {
    setCharacterToDelete(character);
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setCharacterToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!characterToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/characters/${characterToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCharacters((prev) => prev.filter((c) => c.id !== characterToDelete.id));
        setCharacterToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete character:", error);
    }
    setIsDeleting(false);
  };

  const handleImport = async (characterData: object) => {
    setIsImporting(true);
    try {
      const response = await fetch("/api/characters/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ character: characterData }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to import character");
      }

      // Add new character to list
      setCharacters((prev) => [data.character, ...prev]);

      // Select appropriate filter to view new character
      if (activeFilter !== "all" && data.character.status !== activeFilter) {
        setActiveFilter("all");
      }

      setShowImportDialog(false);
      alert(`Successfully imported "${data.character.name}"`);
    } catch (err) {
      console.error("Import error:", err);
      alert(err instanceof Error ? err.message : "Failed to import character");
    } finally {
      setIsImporting(false);
    }
  };

  // Filter and sort characters
  const filteredCharacters = characters
    .filter((c) => {
      // Status filter
      if (activeFilter !== "all" && c.status !== activeFilter) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const nameMatch = (c.name || "").toLowerCase().includes(query);
        const metatypeMatch = (c.metatype || "").toLowerCase().includes(query);
        const pathMatch = (c.magicalPath || "").toLowerCase().includes(query);
        return nameMatch || metatypeMatch || pathMatch;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "karma":
          return (b.karmaCurrent ?? 0) - (a.karmaCurrent ?? 0);
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "updated":
        default:
          return (
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime()
          );
      }
    });

  // Calculate counts for filter tabs
  const counts: Record<string, number> = {
    all: characters.length,
    active: characters.filter((c) => c.status === "active").length,
    draft: characters.filter((c) => c.status === "draft").length,
    retired: characters.filter((c) => c.status === "retired").length,
  };

  return (
    <div className="bg-grid min-h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Characters</h1>
            {isAdminMode && (
              <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded font-mono uppercase">
                Admin Mode
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdminMode
              ? "Viewing all characters across all users"
              : "Manage your Shadowrun characters"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Admin Mode Toggle - only shown to admins */}
          {isAdmin && (
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                isAdminMode
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 shadow-lg shadow-amber-500/10"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              title={isAdminMode ? "Exit admin mode" : "Enter admin mode to view all characters"}
            >
              <ShieldIcon className="h-4 w-4" />
              {isAdminMode ? "Exit Admin" : "Admin View"}
            </button>
          )}
          <button
            onClick={() => setShowImportDialog(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted hover:border-zinc-500/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <UploadIcon className="h-4 w-4" />
            Import JSON
          </button>

          <Link
            href="/characters/create/sheet"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-background"
          >
            <PlusIcon className="h-4 w-4" />
            Create Character
          </Link>
        </div>
      </div>

      {/* Neon divider */}
      <div className="neon-divider" />

      <CharacterImportDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={handleImport}
        loading={isImporting}
      />

      {/* Error State */}
      {error && (
        <div className="alert-banner-accent rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Content */}
      {!loading && !error && (
        <>
          {characters.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Toolbar: Filter, Search, Sort, View */}
              <div className="flex flex-col gap-4">
                {/* Top row: Filters and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <FilterTabs
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    counts={counts}
                  />

                  {/* View Toggle */}
                  <div className="flex items-center gap-1 p-1 bg-muted/50 dark:bg-zinc-800/50 rounded-lg border border-border">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded transition-all ${
                        viewMode === "grid"
                          ? "bg-background text-foreground shadow-sm border border-emerald-500/30 dark:border-emerald-500/50"
                          : "text-muted-foreground hover:text-foreground border border-transparent"
                      }`}
                      aria-label="Grid view"
                    >
                      <GridIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded transition-all ${
                        viewMode === "list"
                          ? "bg-background text-foreground shadow-sm border border-emerald-500/30 dark:border-emerald-500/50"
                          : "text-muted-foreground hover:text-foreground border border-transparent"
                      }`}
                      aria-label="List view"
                    >
                      <ListIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom row: Search and Sort */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search by name, metatype, or path..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Clear search"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Owner Filter (Admin Mode) */}
                  {isAdminMode && owners.length > 0 && (
                    <select
                      value={ownerFilter}
                      onChange={(e) => setOwnerFilter(e.target.value)}
                      className="px-3 py-2 text-sm bg-background border border-amber-500/30 rounded-lg text-foreground focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none cursor-pointer"
                    >
                      <option value="">All Owners</option>
                      {owners.map((owner) => (
                        <option key={owner.id} value={owner.id}>
                          {owner.username}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="updated">Recently Updated</option>
                    <option value="created">Recently Created</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="karma">Karma (High-Low)</option>
                  </select>
                </div>
              </div>

              {/* Results count */}
              {searchQuery && (
                <div className="text-sm text-muted-foreground">
                  Found{" "}
                  <span className="font-mono font-semibold text-foreground">
                    {filteredCharacters.length}
                  </span>{" "}
                  character
                  {filteredCharacters.length !== 1 ? "s" : ""}
                  {searchQuery && (
                    <>
                      {" "}
                      matching &quot;
                      <span className="text-emerald-600 dark:text-emerald-400">{searchQuery}</span>
                      &quot;
                    </>
                  )}
                </div>
              )}

              {/* Character Grid/List */}
              {filteredCharacters.length === 0 ? (
                <div className="text-center py-12 rounded-lg border border-dashed border-border bg-muted/10">
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? `No characters matching "${searchQuery}"`
                      : `No ${activeFilter === "all" ? "" : activeFilter} characters found`}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCharacters.map((character) => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      onDeleteClick={handleDeleteClick}
                      viewMode="grid"
                      isAdminMode={isAdminMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCharacters.map((character) => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      onDeleteClick={handleDeleteClick}
                      viewMode="list"
                      isAdminMode={isAdminMode}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteCharacterModal
        isOpen={characterToDelete !== null}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        characterName={characterToDelete?.name || "Unnamed Runner"}
        isDeleting={isDeleting}
      />
    </div>
  );
}
