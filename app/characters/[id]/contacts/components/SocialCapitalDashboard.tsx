"use client";

import React from "react";
import type { SocialCapital, SocialContact } from "@/lib/types";
import type { Theme } from "@/lib/themes";
import { THEMES, DEFAULT_THEME } from "@/lib/themes";

interface SocialCapitalDashboardProps {
  socialCapital: SocialCapital;
  contacts: SocialContact[];
  theme?: Theme;
}

export function SocialCapitalDashboard({
  socialCapital,
  contacts,
  theme,
}: SocialCapitalDashboardProps) {
  const t = theme || THEMES[DEFAULT_THEME];

  // Calculate archetype distribution
  const archetypeDistribution = contacts.reduce<Record<string, number>>((acc, c) => {
    acc[c.archetype] = (acc[c.archetype] || 0) + 1;
    return acc;
  }, {});

  const topArchetypes = Object.entries(archetypeDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Calculate budget percentage
  const budgetPercentage = socialCapital.maxContactPoints > 0
    ? Math.round((socialCapital.usedContactPoints / socialCapital.maxContactPoints) * 100)
    : 0;

  // Get bar color based on usage
  const getBarColor = () => {
    if (budgetPercentage >= 90) return "bg-red-500";
    if (budgetPercentage >= 75) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="space-y-4">
      {/* Budget Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-mono text-muted-foreground uppercase">Contact Points</span>
          <span className={`font-mono font-bold ${t.colors.heading}`}>
            {socialCapital.usedContactPoints} / {socialCapital.maxContactPoints}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full ${getBarColor()} transition-all duration-300`}
            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] mt-1 text-muted-foreground">
          <span>{socialCapital.availableContactPoints} points available</span>
          <span>{budgetPercentage}% used</span>
        </div>
      </div>

      {/* Contact Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className={`p-3 rounded text-center ${t.colors.card} border ${t.colors.border}`}>
          <div className="text-[10px] text-muted-foreground uppercase font-mono">Total</div>
          <div className={`text-xl font-bold ${t.colors.heading}`}>
            {socialCapital.totalContacts}
          </div>
        </div>
        <div className={`p-3 rounded text-center ${t.colors.card} border ${t.colors.border}`}>
          <div className="text-[10px] text-emerald-400 uppercase font-mono">Active</div>
          <div className="text-xl font-bold text-emerald-400">
            {socialCapital.activeContacts}
          </div>
        </div>
        <div className={`p-3 rounded text-center ${t.colors.card} border ${t.colors.border}`}>
          <div className="text-[10px] text-red-400 uppercase font-mono">Burned</div>
          <div className="text-xl font-bold text-red-400">
            {socialCapital.burnedContacts}
          </div>
        </div>
        <div className={`p-3 rounded text-center ${t.colors.card} border ${t.colors.border}`}>
          <div className="text-[10px] text-amber-400 uppercase font-mono">Inactive</div>
          <div className="text-xl font-bold text-amber-400">
            {socialCapital.inactiveContacts}
          </div>
        </div>
      </div>

      {/* Archetype Distribution */}
      {topArchetypes.length > 0 && (
        <div>
          <div className="text-[10px] font-mono text-muted-foreground uppercase mb-2">
            Network Composition
          </div>
          <div className="space-y-1">
            {topArchetypes.map(([archetype, count]) => {
              const pct = Math.round((count / socialCapital.totalContacts) * 100);
              return (
                <div key={archetype} className="flex items-center gap-2">
                  <div className="w-20 text-xs text-muted-foreground truncate">{archetype}</div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${t.colors.accentBg}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-12 text-xs text-muted-foreground text-right font-mono">
                    {count} ({pct}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modifiers (if any) */}
      {(socialCapital.networkingBonus !== 0 ||
        socialCapital.socialLimitModifier !== 0 ||
        socialCapital.loyaltyBonus !== 0) && (
        <div className="pt-3 border-t border-border/50">
          <div className="text-[10px] font-mono text-muted-foreground uppercase mb-2">
            Active Modifiers
          </div>
          <div className="flex flex-wrap gap-2">
            {socialCapital.networkingBonus !== 0 && (
              <span
                className={`text-[10px] px-2 py-1 rounded ${
                  socialCapital.networkingBonus > 0
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                Networking {socialCapital.networkingBonus > 0 ? "+" : ""}
                {socialCapital.networkingBonus}
              </span>
            )}
            {socialCapital.socialLimitModifier !== 0 && (
              <span
                className={`text-[10px] px-2 py-1 rounded ${
                  socialCapital.socialLimitModifier > 0
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                Social Limit {socialCapital.socialLimitModifier > 0 ? "+" : ""}
                {socialCapital.socialLimitModifier}
              </span>
            )}
            {socialCapital.loyaltyBonus !== 0 && (
              <span
                className={`text-[10px] px-2 py-1 rounded ${
                  socialCapital.loyaltyBonus > 0
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                Loyalty {socialCapital.loyaltyBonus > 0 ? "+" : ""}
                {socialCapital.loyaltyBonus}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Warnings */}
      {socialCapital.burnedContacts > 0 && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
          <strong>Warning:</strong> You have {socialCapital.burnedContacts} burned contact
          {socialCapital.burnedContacts > 1 ? "s" : ""}. These relationships may be repairable
          with karma investment.
        </div>
      )}
    </div>
  );
}
