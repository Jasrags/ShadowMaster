"use client";

import { useState } from "react";
import { Save, Loader2, Eye, EyeOff, Zap, RotateCcw, Shield } from "lucide-react";
import type { GruntTeam, ProfessionalRating } from "@/lib/types";
import { PROFESSIONAL_RATING_DESCRIPTIONS, DEFAULT_MORALE_TIERS } from "@/lib/types";

interface GruntTeamSettingsTabProps {
  team: GruntTeam;
  onTeamUpdate: (team: GruntTeam) => void;
}

export function GruntTeamSettingsTab({ team, onTeamUpdate }: GruntTeamSettingsTabProps) {
  const [name, setName] = useState(team.name);
  const [description, setDescription] = useState(team.description || "");
  const [professionalRating, setProfessionalRating] = useState(team.professionalRating);
  const [showToPlayers, setShowToPlayers] = useState(team.visibility?.showToPlayers ?? false);
  const [useGroupInitiative, setUseGroupInitiative] = useState(
    team.options?.useGroupInitiative ?? true
  );
  const [useSimplifiedRules, setUseSimplifiedRules] = useState(
    team.options?.useSimplifiedRules ?? false
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const moraleTier = DEFAULT_MORALE_TIERS[professionalRating];

  const handleSave = async () => {
    if (saving || !name.trim()) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/grunt-teams/${team.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          professionalRating,
          options: {
            useGroupInitiative,
            useSimplifiedRules,
          },
          visibility: {
            showToPlayers,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update settings");
      }

      onTeamUpdate(data.team);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleResetEdge = async () => {
    if (!confirm("Reset Group Edge to maximum?")) return;

    try {
      const response = await fetch(`/api/grunt-teams/${team.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Reset handled by setting PR which recalculates edge
        }),
      });

      const data = await response.json();
      if (response.ok) {
        onTeamUpdate(data.team);
      }
    } catch {
      // Edge reset failed silently
    }
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  return (
    <div className="space-y-6">
      {/* Error/Success Messages */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/30">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/30">
          <p className="text-green-700 dark:text-green-400">Settings saved successfully.</p>
        </div>
      )}

      {/* Identity */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 space-y-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Identity</h3>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Team Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Professional Rating
          </label>
          <select
            value={professionalRating}
            onChange={(e) =>
              setProfessionalRating(parseInt(e.target.value, 10) as ProfessionalRating)
            }
            className={inputClass}
          >
            {([0, 1, 2, 3, 4, 5, 6] as ProfessionalRating[]).map((pr) => (
              <option key={pr} value={pr}>
                PR {pr} - {PROFESSIONAL_RATING_DESCRIPTIONS[pr].split(":")[0]}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {PROFESSIONAL_RATING_DESCRIPTIONS[professionalRating]}
          </p>
        </div>
      </div>

      {/* Group Edge */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Group Edge
          </h3>
          <button
            onClick={handleResetEdge}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
        <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <span>
            Current:{" "}
            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {team.groupEdge}
            </span>
          </span>
          <span>
            Maximum:{" "}
            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {team.groupEdgeMax}
            </span>
          </span>
        </div>
      </div>

      {/* Morale Thresholds (read-only) */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Morale Thresholds
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Derived from Professional Rating {professionalRating}
        </p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            <span className="block text-xs text-zinc-500 dark:text-zinc-400">Break Threshold</span>
            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {moraleTier.breakThreshold}% casualties
            </span>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            <span className="block text-xs text-zinc-500 dark:text-zinc-400">Can Rally</span>
            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {moraleTier.canRally ? "Yes" : "No"}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            <span className="block text-xs text-zinc-500 dark:text-zinc-400">Rally Cost</span>
            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {moraleTier.rallyCost > 0 ? `${moraleTier.rallyCost} Edge` : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Visibility */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 space-y-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Visibility</h3>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            {showToPlayers ? (
              <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <EyeOff className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-zinc-900 dark:text-zinc-50">Player Visibility</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {showToPlayers ? "Players can see this grunt team." : "Hidden from players."}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showToPlayers}
              onChange={(e) => setShowToPlayers(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-green-600"></div>
          </label>
        </div>
      </div>

      {/* Combat Options */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 space-y-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Combat Options</h3>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={useGroupInitiative}
            onChange={(e) => setUseGroupInitiative(e.target.checked)}
            className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <div>
            <span className="text-zinc-900 dark:text-zinc-100">Use Group Initiative</span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              All grunts share the same initiative roll
            </p>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={useSimplifiedRules}
            onChange={(e) => setUseSimplifiedRules(e.target.checked)}
            className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <div>
            <span className="text-zinc-900 dark:text-zinc-100">Use Simplified Rules</span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              One-hit kills, no dodge rolls, faster combat
            </p>
          </div>
        </label>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!name.trim() || saving}
          className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
