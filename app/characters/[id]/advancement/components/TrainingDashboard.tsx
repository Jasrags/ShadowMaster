"use client";

import { useState, useCallback } from "react";
import { Button } from "react-aria-components";
import type { Character, TrainingPeriod } from "@/lib/types";
import { getActiveTraining } from "@/lib/rules/advancement/completion";
import { CheckCircle, Clock, Pause } from "lucide-react";

interface TrainingDashboardProps {
  character: Character;
  onCharacterUpdate: (updatedCharacter: Character) => void;
}

export function TrainingDashboard({ character, onCharacterUpdate }: TrainingDashboardProps) {
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const activeTraining = getActiveTraining(character);

  // Calculate progress percentage
  const calculateProgress = (training: TrainingPeriod): number => {
    if (training.requiredTime === 0) return 100;
    return Math.min(100, Math.round((training.timeSpent / training.requiredTime) * 100));
  };

  // Calculate days remaining
  const calculateDaysRemaining = (training: TrainingPeriod): number => {
    if (training.status === "completed") return 0;
    return Math.max(0, training.requiredTime - training.timeSpent);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  // Handle complete training
  const handleCompleteTraining = useCallback(
    async (trainingId: string) => {
      setIsSubmitting(trainingId);

      try {
        const response = await fetch(`/api/characters/${character.id}/training/${trainingId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "complete" }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to complete training");
        }

        onCharacterUpdate(result.character);
      } catch (err) {
        console.error("Failed to complete training:", err);
        // TODO: Show error message to user
      } finally {
        setIsSubmitting(null);
      }
    },
    [character.id, onCharacterUpdate]
  );

  if (activeTraining.length === 0) {
    return (
      <div className="p-8 text-center rounded-lg border border-zinc-700 bg-zinc-800/50">
        <Clock className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
        <p className="text-zinc-400">No active training periods</p>
        <p className="text-sm text-zinc-500 mt-2">Start an advancement to begin training</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeTraining.map((training) => {
        const progress = calculateProgress(training);
        const daysRemaining = calculateDaysRemaining(training);
        const isCompleted = training.status === "completed";
        const isInterrupted = training.status === "interrupted";

        return (
          <div key={training.id} className="p-4 rounded-lg border border-zinc-700 bg-zinc-800/50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-zinc-100">{training.targetName}</h3>
                  {isCompleted && <CheckCircle className="h-4 w-4 text-emerald-400" />}
                  {isInterrupted && <Pause className="h-4 w-4 text-amber-400" />}
                  {!isCompleted && !isInterrupted && <Clock className="h-4 w-4 text-blue-400" />}
                </div>
                <div className="text-sm text-zinc-400">
                  {training.type === "attribute" ? "Attribute" : "Skill"} Advancement
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-zinc-400">
                  {training.timeSpent} / {training.requiredTime} days
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Complete"}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Training Details */}
            <div className="grid grid-cols-2 gap-4 text-xs text-zinc-500 mb-3">
              <div>
                <span className="block">Started:</span>
                <span className="text-zinc-300">{formatDate(training.startDate)}</span>
              </div>
              {training.expectedCompletionDate && (
                <div>
                  <span className="block">Expected:</span>
                  <span className="text-zinc-300">
                    {formatDate(training.expectedCompletionDate)}
                  </span>
                </div>
              )}
              {training.instructorBonus && (
                <div>
                  <span className="block">Instructor:</span>
                  <span className="text-emerald-400">25% time reduction</span>
                </div>
              )}
              {training.timeModifier && training.timeModifier > 0 && (
                <div>
                  <span className="block">Time Modifier:</span>
                  <span className="text-amber-400">+{training.timeModifier}%</span>
                </div>
              )}
            </div>

            {/* Actions */}
            {!isCompleted && (
              <div className="flex gap-2 pt-3 border-t border-zinc-700">
                <Button
                  onPress={() => handleCompleteTraining(training.id)}
                  isDisabled={isSubmitting === training.id}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-medium rounded transition-colors"
                >
                  {isSubmitting === training.id ? "Completing..." : "Complete Training"}
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
