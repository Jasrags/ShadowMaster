"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Save,
  Crown,
  Star,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type {
  GruntTeam,
  ProfessionalRating,
  GruntStats,
  LieutenantStats,
  GruntSpecialist,
  UpdateGruntTeamRequest,
} from "@/lib/types";
import { GruntStatsEditor } from "../../components/GruntStatsEditor";
import { PROFESSIONAL_RATING_DESCRIPTIONS } from "@/lib/types";

interface EditFormState {
  name: string;
  description: string;
  professionalRating: ProfessionalRating;
  initialSize: number;
  baseGrunts: GruntStats;
  hasLieutenant: boolean;
  lieutenant?: LieutenantStats;
  specialists: GruntSpecialist[];
  showToPlayers: boolean;
  useGroupInitiative: boolean;
  useSimplifiedRules: boolean;
}

export default function EditGruntTeamPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  const teamId = params.teamId as string;

  const [team, setTeam] = useState<GruntTeam | null>(null);
  const [formState, setFormState] = useState<EditFormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basics: true,
    stats: true,
    lieutenant: false,
    specialists: false,
    visibility: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const fetchTeam = useCallback(async () => {
    try {
      const response = await fetch(`/api/grunt-teams/${teamId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch grunt team");
      }

      const fetchedTeam: GruntTeam = data.team;
      setTeam(fetchedTeam);
      setFormState({
        name: fetchedTeam.name,
        description: fetchedTeam.description || "",
        professionalRating: fetchedTeam.professionalRating,
        initialSize: fetchedTeam.initialSize,
        baseGrunts: { ...fetchedTeam.baseGrunts },
        hasLieutenant: !!fetchedTeam.lieutenant,
        lieutenant: fetchedTeam.lieutenant ? { ...fetchedTeam.lieutenant } : undefined,
        specialists: fetchedTeam.specialists ? [...fetchedTeam.specialists] : [],
        showToPlayers: fetchedTeam.visibility?.showToPlayers ?? false,
        useGroupInitiative: fetchedTeam.options?.useGroupInitiative ?? true,
        useSimplifiedRules: fetchedTeam.options?.useSimplifiedRules ?? false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleSave = async () => {
    if (!formState || saving) return;

    setSaving(true);
    setError(null);

    try {
      const request: UpdateGruntTeamRequest = {
        name: formState.name.trim(),
        description: formState.description.trim() || undefined,
        professionalRating: formState.professionalRating,
        initialSize: formState.initialSize,
        baseGrunts: formState.baseGrunts,
        lieutenant: formState.hasLieutenant ? formState.lieutenant : null,
        specialists: formState.specialists.length > 0 ? formState.specialists : undefined,
        options: {
          useGroupInitiative: formState.useGroupInitiative,
          useSimplifiedRules: formState.useSimplifiedRules,
        },
        visibility: {
          showToPlayers: formState.showToPlayers,
        },
      };

      const response = await fetch(`/api/grunt-teams/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update grunt team");
      }

      router.push(`/campaigns/${campaignId}/grunt-teams/${teamId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update grunt team");
      setSaving(false);
    }
  };

  const updateSpecialist = (index: number, field: keyof GruntSpecialist, value: string) => {
    if (!formState) return;
    setFormState({
      ...formState,
      specialists: formState.specialists.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    });
  };

  const removeSpecialist = (index: number) => {
    if (!formState) return;
    setFormState({
      ...formState,
      specialists: formState.specialists.filter((_, i) => i !== index),
    });
  };

  const addSpecialist = () => {
    if (!formState || formState.specialists.length >= 2) return;
    setFormState({
      ...formState,
      specialists: [
        ...formState.specialists,
        { id: `specialist-${Date.now()}`, type: "", description: "" },
      ],
    });
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error && !team) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
          <p className="text-red-700 dark:text-red-400">{error}</p>
          <button
            onClick={() => router.push(`/campaigns/${campaignId}/grunt-teams`)}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Back to Grunt Teams
          </button>
        </div>
      </div>
    );
  }

  if (!formState) return null;

  const SectionToggle = ({
    title,
    section,
    icon: Icon,
    iconColor,
  }: {
    title: string;
    section: string;
    icon?: React.ComponentType<{ className?: string }>;
    iconColor?: string;
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full py-3"
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`h-5 w-5 ${iconColor || "text-zinc-400"}`} />}
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="h-5 w-5 text-zinc-400" />
      ) : (
        <ChevronDown className="h-5 w-5 text-zinc-400" />
      )}
    </button>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/campaigns/${campaignId}/grunt-teams/${teamId}`)}
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Team
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Edit Grunt Team</h1>
          {team && <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{team.name}</p>}
        </div>
        <button
          onClick={handleSave}
          disabled={!formState.name.trim() || saving}
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
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/30">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <SectionToggle title="Basic Info" section="basics" />
          {expandedSections.basics && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  rows={3}
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Professional Rating
                  </label>
                  <select
                    value={formState.professionalRating}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        professionalRating: parseInt(e.target.value, 10) as ProfessionalRating,
                      })
                    }
                    className={inputClass}
                  >
                    {([0, 1, 2, 3, 4, 5, 6] as ProfessionalRating[]).map((pr) => (
                      <option key={pr} value={pr}>
                        PR {pr} - {PROFESSIONAL_RATING_DESCRIPTIONS[pr].split(":")[0]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Team Size
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formState.initialSize}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        initialSize: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Base Stats */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <SectionToggle title="Base Statistics" section="stats" />
          {expandedSections.stats && (
            <div className="pt-2">
              <GruntStatsEditor
                stats={formState.baseGrunts}
                onChange={(stats) => setFormState({ ...formState, baseGrunts: stats })}
                templateStats={team?.baseGrunts}
              />
            </div>
          )}
        </div>

        {/* Lieutenant */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <SectionToggle
            title="Lieutenant"
            section="lieutenant"
            icon={Crown}
            iconColor="text-amber-500"
          />
          {expandedSections.lieutenant && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  A lieutenant provides leadership bonuses and can boost PR.
                </p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.hasLieutenant}
                    onChange={(e) =>
                      setFormState({ ...formState, hasLieutenant: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {formState.hasLieutenant && (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/10 p-4">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Lieutenant stats are derived from the base grunt template with +4 bonus to key
                    attributes. Full lieutenant customization coming in a future update.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Specialists */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <SectionToggle
            title="Specialists"
            section="specialists"
            icon={Star}
            iconColor="text-indigo-500"
          />
          {expandedSections.specialists && (
            <div className="space-y-4 pt-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Add up to 2 specialists with unique roles.
              </p>

              {formState.specialists.map((spec, index) => (
                <div
                  key={spec.id}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      Specialist {index + 1}
                    </span>
                    <button
                      onClick={() => removeSpecialist(index)}
                      className="text-sm text-red-600 hover:text-red-500 dark:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Type
                      </label>
                      <input
                        type="text"
                        value={spec.type}
                        onChange={(e) => updateSpecialist(index, "type", e.target.value)}
                        placeholder="e.g., Mage, Sniper, Rigger"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={spec.description}
                        onChange={(e) => updateSpecialist(index, "description", e.target.value)}
                        placeholder="Brief description"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formState.specialists.length < 2 && (
                <button
                  onClick={addSpecialist}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-dashed border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600"
                >
                  <Star className="h-4 w-4" />
                  Add Specialist
                </button>
              )}
            </div>
          )}
        </div>

        {/* Visibility & Options */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <SectionToggle title="Visibility & Options" section="visibility" />
          {expandedSections.visibility && (
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  {formState.showToPlayers ? (
                    <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-50">Player Visibility</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {formState.showToPlayers
                      ? "Players can see this grunt team."
                      : "Hidden from players."}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.showToPlayers}
                    onChange={(e) =>
                      setFormState({ ...formState, showToPlayers: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-50">Combat Options</h4>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.useGroupInitiative}
                    onChange={(e) =>
                      setFormState({ ...formState, useGroupInitiative: e.target.checked })
                    }
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
                    checked={formState.useSimplifiedRules}
                    onChange={(e) =>
                      setFormState({ ...formState, useSimplifiedRules: e.target.checked })
                    }
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
            </div>
          )}
        </div>
      </div>

      {/* Bottom Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!formState.name.trim() || saving}
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
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
