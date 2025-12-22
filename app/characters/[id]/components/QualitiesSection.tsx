"use client";

import React from "react";
import { useQualities } from "@/lib/rules";
import type { Character, QualitySelection, QualityEffect } from "@/lib/types";
import type { Theme } from "@/lib/themes";
import type { QualityData } from "@/lib/rules/loader-types";
import { Info, Clock, AlertCircle } from "lucide-react";

interface QualitiesSectionProps {
  character: Character;
  theme?: Theme;
}

export function QualitiesSection({ character }: QualitiesSectionProps) {
  const { positive: positiveData, negative: negativeData } = useQualities();

  const renderQualityList = (selections: QualitySelection[], isPositive: boolean) => {
    if (!selections || selections.length === 0) return null;

    return (
      <div className="space-y-4">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block ml-1">
          {isPositive ? 'Positive Qualities' : 'Negative Qualities'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-0.5">
          {selections.map((selection) => {
            const id = typeof selection === 'string' 
              ? selection 
              : (selection.qualityId || selection.id || '');
            const data = (isPositive
              ? positiveData.find((q: QualityData) => q.id === id)
              : negativeData.find((q: QualityData) => q.id === id)) as QualityData | undefined;

            const name = data?.name || (id ? id.replace(/-/g, ' ') : 'Unknown Quality');

            const rawSelection = typeof selection === 'string' ? {} as Partial<QualitySelection> : selection;
            const creationState = character.metadata?.creationState;
            const stateSelections = creationState && typeof creationState === 'object' && 'selections' in creationState 
              ? creationState.selections as Record<string, unknown>
              : undefined;
            const qualityLevels = stateSelections && typeof stateSelections === 'object' && 'qualityLevels' in stateSelections
              ? stateSelections.qualityLevels as Record<string, number | undefined> | undefined
              : undefined;
            const qualitySpecifications = stateSelections && typeof stateSelections === 'object' && 'qualitySpecifications' in stateSelections
              ? stateSelections.qualitySpecifications as Record<string, string | undefined> | undefined
              : undefined;
            
            const level = rawSelection.rating ?? qualityLevels?.[id];
            const spec = rawSelection.specification ?? qualitySpecifications?.[id];

            const extraParts: string[] = [];
            if (level !== undefined && level !== null) {
              if (data?.levels) {
                const levelInfo = data.levels.find((l: { level: number; name?: string }) => l.level === level);
                if (levelInfo) {
                  extraParts.push(levelInfo.name);
                } else {
                  extraParts.push(`Rating ${level}`);
                }
              } else {
                extraParts.push(`Rating ${level}`);
              }
            }

            if (spec) {
              extraParts.push(spec);
            }

            if (character.sinnerQuality && id === 'sinner') {
              extraParts.push(character.sinnerQuality.charAt(0).toUpperCase() + character.sinnerQuality.slice(1));
            }

            const extra = extraParts.join(", ");

            // Effects visualization

            return (
              <div
                key={id}
                className={`group relative flex flex-col p-3 bg-muted/30 rounded border-l-2 transition-all ${
                  isPositive ? 'border-emerald-500/30' : 'border-red-500/30'
                } hover:bg-muted/50`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">
                      {name}
                    </span>
                    {rawSelection.gmApproved === false && (
                      <span 
                        className="flex items-center gap-0.5 text-[8px] px-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded font-bold uppercase"
                        title="Awaiting GM Approval"
                      >
                        <Clock className="w-2 h-2" />
                        Pending
                      </span>
                    )}
                  </div>
                  {extra && (
                    <span className="text-[10px] font-mono text-amber-500 dark:text-amber-400 font-bold px-1.5 py-0.5 bg-background/50 rounded-sm">
                      {extra}
                    </span>
                  )}
                </div>
                
                <p className="text-[10px] text-muted-foreground line-clamp-1 group-hover:line-clamp-none transition-all">
                  {data?.summary || id}
                </p>

                {((data?.effects || []) as QualityEffect[]).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {((data?.effects || []) as QualityEffect[]).map((eff, idx) => (
                      <span 
                        key={idx}
                        className="text-[9px] px-1.5 py-px bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-mono uppercase"
                        title={eff.description}
                      >
                        {eff.type.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}

                {/* Dynamic State Visualization */}
                {rawSelection.dynamicState && (
                  <div className="mt-2 pt-2 border-t border-border/30">
                    {rawSelection.dynamicState.type === 'addiction' && (
                      <div className="flex items-center gap-1.5 text-[9px] text-amber-500 dark:text-amber-400 font-medium">
                        <AlertCircle className="w-2.5 h-2.5" />
                        <span>
                          {rawSelection.dynamicState.state.severity.toUpperCase()} • {rawSelection.dynamicState.state.substance} ({rawSelection.dynamicState.state.substanceType})
                        </span>
                      </div>
                    )}
                    {rawSelection.dynamicState.type === 'allergy' && (
                      <div className="flex items-center gap-1.5 text-[9px] text-amber-500 dark:text-amber-400 font-medium">
                        <AlertCircle className="w-2.5 h-2.5" />
                        <span>
                          {rawSelection.dynamicState.state.severity.toUpperCase()} • {rawSelection.dynamicState.state.allergen} ({rawSelection.dynamicState.state.prevalence})
                        </span>
                      </div>
                    )}
                    {rawSelection.dynamicState.type === 'dependent' && (
                      <div className="flex items-center gap-1.5 text-[9px] text-amber-500 dark:text-amber-400 font-medium">
                        <AlertCircle className="w-2.5 h-2.5" />
                        <span>
                          TIER {rawSelection.dynamicState.state.tier} • {rawSelection.dynamicState.state.relationship} ({rawSelection.dynamicState.state.currentStatus})
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {data?.description && (
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const hasQualities = (character.positiveQualities?.length || 0) > 0 || (character.negativeQualities?.length || 0) > 0;

  if (!hasQualities) {
    return (
      <div className="p-4 rounded border border-border/50 bg-muted/10 italic text-sm text-muted-foreground">
        No qualities selected.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {renderQualityList(character.positiveQualities || [], true)}
      {renderQualityList(character.negativeQualities || [], false)}
    </div>
  );
}
