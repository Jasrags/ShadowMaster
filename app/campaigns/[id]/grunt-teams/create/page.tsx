"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check,
  Users,
  Crown,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";
import type {
  Campaign,
  GruntTemplate,
  ProfessionalRating,
  CreateGruntTeamRequest,
  GruntStats,
  LieutenantStats,
} from "@/lib/types";
import { ProfessionalRatingBadge } from "../components/ProfessionalRatingBadge";
import { PROFESSIONAL_RATING_DESCRIPTIONS } from "@/lib/types";

type WizardStep = "basics" | "template" | "lieutenant" | "specialists" | "visibility" | "review";

const STEPS: { id: WizardStep; label: string }[] = [
  { id: "basics", label: "Basic Info" },
  { id: "template", label: "Template" },
  { id: "lieutenant", label: "Lieutenant" },
  { id: "specialists", label: "Specialists" },
  { id: "visibility", label: "Visibility" },
  { id: "review", label: "Review" },
];

interface FormState {
  name: string;
  description: string;
  professionalRating: ProfessionalRating;
  initialSize: number;
  templateId?: string;
  baseGrunts?: GruntStats;
  addLieutenant: boolean;
  lieutenant?: Partial<LieutenantStats>;
  specialists: Array<{ type: string; description: string }>;
  showToPlayers: boolean;
  useGroupInitiative: boolean;
  useSimplifiedRules: boolean;
}

const DEFAULT_FORM_STATE: FormState = {
  name: "",
  description: "",
  professionalRating: 2,
  initialSize: 6,
  addLieutenant: false,
  specialists: [],
  showToPlayers: false,
  useGroupInitiative: true,
  useSimplifiedRules: false,
};

export default function CreateGruntTeamPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [templates, setTemplates] = useState<GruntTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState<WizardStep>("basics");
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

  const fetchCampaign = useCallback(async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch campaign");
      }

      if (data.userRole !== "gm") {
        throw new Error("Only GMs can create grunt teams");
      }

      setCampaign(data.campaign);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }, [campaignId]);

  const fetchTemplates = useCallback(async (editionCode: string) => {
    try {
      const response = await fetch(`/api/editions/${editionCode}/grunt-templates`);
      const data = await response.json();

      if (response.ok) {
        setTemplates(data.templates || []);
      }
    } catch {
      // Templates are optional, so don't error out
      console.warn("Failed to fetch grunt templates");
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchCampaign();
      setLoading(false);
    };
    init();
  }, [fetchCampaign]);

  useEffect(() => {
    if (campaign?.editionCode) {
      fetchTemplates(campaign.editionCode);
    }
  }, [campaign?.editionCode, fetchTemplates]);

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const goNext = () => {
    if (!isLastStep) {
      setCurrentStep(STEPS[currentStepIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (!isFirstStep) {
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case "basics":
        return formState.name.trim().length > 0 && formState.initialSize > 0;
      case "template":
        return true; // Template is optional
      case "lieutenant":
        return true; // Lieutenant is optional
      case "specialists":
        return formState.specialists.length <= 2;
      case "visibility":
        return true;
      case "review":
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const request: CreateGruntTeamRequest = {
        name: formState.name.trim(),
        description: formState.description.trim() || undefined,
        professionalRating: formState.professionalRating,
        initialSize: formState.initialSize,
        templateId: formState.templateId,
        baseGrunts: formState.baseGrunts,
        specialists: formState.specialists.length > 0
          ? formState.specialists.map((s) => ({
              type: s.type,
              description: s.description,
            }))
          : undefined,
        options: {
          useGroupInitiative: formState.useGroupInitiative,
          useSimplifiedRules: formState.useSimplifiedRules,
        },
        visibility: {
          showToPlayers: formState.showToPlayers,
        },
      };

      // Add lieutenant if enabled
      if (formState.addLieutenant && formState.lieutenant) {
        // Note: Full lieutenant stats would need to be populated from template or custom input
        // For now, we'll rely on the API to validate
      }

      const response = await fetch(`/api/campaigns/${campaignId}/grunt-teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create grunt team");
      }

      router.push(`/campaigns/${campaignId}/grunt-teams/${data.team.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create grunt team");
      setSubmitting(false);
    }
  };

  const selectTemplate = (template: GruntTemplate) => {
    setFormState((prev) => ({
      ...prev,
      templateId: template.id,
      professionalRating: template.professionalRating,
      baseGrunts: template.baseGrunts,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error && !campaign) {
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/campaigns/${campaignId}/grunt-teams`)}
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Grunt Teams
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Create Grunt Team
        </h1>
        {campaign && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {campaign.title}
          </p>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const isComplete = index < currentStepIndex;
            const isCurrent = step.id === currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    isComplete
                      ? "bg-indigo-600 text-white"
                      : isCurrent
                      ? "border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                      : "border-2 border-zinc-300 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
                  }`}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span
                  className={`ml-2 hidden text-sm sm:block ${
                    isCurrent
                      ? "font-medium text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {step.label}
                </span>
                {index < STEPS.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 w-8 sm:w-16 ${
                      isComplete
                        ? "bg-indigo-600"
                        : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/30">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Step Content */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
        {/* Basics Step */}
        {currentStep === "basics" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Team Name *
              </label>
              <input
                type="text"
                value={formState.name}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Lone Star Patrol Squad"
                className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Description
              </label>
              <textarea
                value={formState.description}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Brief description of the grunt team..."
                rows={3}
                className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Professional Rating *
                </label>
                <select
                  value={formState.professionalRating}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      professionalRating: parseInt(e.target.value, 10) as ProfessionalRating,
                    }))
                  }
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  {([0, 1, 2, 3, 4, 5, 6] as ProfessionalRating[]).map((pr) => (
                    <option key={pr} value={pr}>
                      PR {pr} - {PROFESSIONAL_RATING_DESCRIPTIONS[pr].split(":")[0]}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {PROFESSIONAL_RATING_DESCRIPTIONS[formState.professionalRating]}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Team Size *
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={formState.initialSize}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      initialSize: parseInt(e.target.value, 10) || 1,
                    }))
                  }
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Template Step */}
        {currentStep === "template" && (
          <div className="space-y-4">
            <p className="text-zinc-600 dark:text-zinc-400">
              Select a template to pre-populate grunt statistics, or skip to configure manually.
            </p>

            {templates.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center">
                <Users className="mx-auto h-12 w-12 text-zinc-400 opacity-50" />
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                  No templates available. You can skip this step and the team will use default statistics.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {templates
                  .filter((t) => t.professionalRating === formState.professionalRating)
                  .map((template) => (
                    <button
                      key={template.id}
                      onClick={() => selectTemplate(template)}
                      className={`p-4 rounded-lg border text-left transition-colors ${
                        formState.templateId === template.id
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-zinc-900 dark:text-zinc-50">
                          {template.name}
                        </span>
                        <ProfessionalRatingBadge rating={template.professionalRating} size="sm" />
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {template.description}
                      </p>
                    </button>
                  ))}
              </div>
            )}

            {formState.templateId && (
              <button
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    templateId: undefined,
                    baseGrunts: undefined,
                  }))
                }
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
              >
                Clear selection
              </button>
            )}
          </div>
        )}

        {/* Lieutenant Step */}
        {currentStep === "lieutenant" && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                  Add Lieutenant
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  A lieutenant provides leadership bonuses and can boost the team&apos;s Professional Rating.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.addLieutenant}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      addLieutenant: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {formState.addLieutenant && (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-900/10 p-4">
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Lieutenant stats will be derived from the base grunt template with +4 bonus to key attributes.
                  Full lieutenant customization coming in a future update.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Specialists Step */}
        {currentStep === "specialists" && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <Star className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                  Add Specialists (Optional)
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Add up to 2 specialists with unique roles. Maximum 2 specialists per team.
                </p>
              </div>
            </div>

            {formState.specialists.map((spec, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    Specialist {index + 1}
                  </span>
                  <button
                    onClick={() =>
                      setFormState((prev) => ({
                        ...prev,
                        specialists: prev.specialists.filter((_, i) => i !== index),
                      }))
                    }
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
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          specialists: prev.specialists.map((s, i) =>
                            i === index ? { ...s, type: e.target.value } : s
                          ),
                        }))
                      }
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
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          specialists: prev.specialists.map((s, i) =>
                            i === index ? { ...s, description: e.target.value } : s
                          ),
                        }))
                      }
                      placeholder="Brief description"
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                </div>
              </div>
            ))}

            {formState.specialists.length < 2 && (
              <button
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    specialists: [...prev.specialists, { type: "", description: "" }],
                  }))
                }
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-dashed border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600"
              >
                <Star className="h-4 w-4" />
                Add Specialist
              </button>
            )}
          </div>
        )}

        {/* Visibility Step */}
        {currentStep === "visibility" && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                {formState.showToPlayers ? (
                  <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <EyeOff className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                  Player Visibility
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {formState.showToPlayers
                    ? "Players can see this grunt team in the campaign view."
                    : "This grunt team is hidden from players."}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.showToPlayers}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      showToPlayers: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-zinc-900 dark:text-zinc-50">Combat Options</h4>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.useGroupInitiative}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      useGroupInitiative: e.target.checked,
                    }))
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
                    setFormState((prev) => ({
                      ...prev,
                      useSimplifiedRules: e.target.checked,
                    }))
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

        {/* Review Step */}
        {currentStep === "review" && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
              Review Your Grunt Team
            </h3>

            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Name</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {formState.name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Professional Rating</span>
                <ProfessionalRatingBadge rating={formState.professionalRating} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Team Size</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {formState.initialSize} grunts
                </span>
              </div>

              {formState.templateId && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Template</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {templates.find((t) => t.id === formState.templateId)?.name || "Selected"}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Lieutenant</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {formState.addLieutenant ? "Yes" : "No"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Specialists</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {formState.specialists.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Player Visibility</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {formState.showToPlayers ? "Visible" : "Hidden"}
                </span>
              </div>
            </div>

            {formState.description && (
              <div>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Description</span>
                <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                  {formState.description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={isFirstStep}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        {isLastStep ? (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || submitting}
            className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Create Team
              </>
            )}
          </button>
        ) : (
          <button
            onClick={goNext}
            disabled={!canProceed()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
