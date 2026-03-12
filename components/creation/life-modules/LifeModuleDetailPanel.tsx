"use client";

/**
 * LifeModuleDetailPanel
 *
 * Shows the details of a selected life module including its grants
 * (attributes, skills, qualities, contacts, etc.).
 */

import type { LifeModule } from "@/lib/types";
import { PHASE_INFO } from "./constants";

interface LifeModuleDetailPanelProps {
  readonly module: LifeModule;
  readonly subModule?: LifeModule;
}

export function LifeModuleDetailPanel({ module, subModule }: LifeModuleDetailPanelProps) {
  const displayModule = subModule ?? module;
  const phaseInfo = PHASE_INFO[module.phase];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {module.name}
          {subModule && (
            <span className="text-zinc-500 dark:text-zinc-400"> — {subModule.name}</span>
          )}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {phaseInfo.label} · {displayModule.karmaCost} Karma
          {displayModule.yearsAdded ? ` · +${displayModule.yearsAdded} years` : ""}
          {displayModule.pageReference && ` · p. ${displayModule.pageReference}`}
        </p>
      </div>

      {/* Description */}
      {displayModule.description && (
        <p className="text-xs text-zinc-600 dark:text-zinc-400">{displayModule.description}</p>
      )}

      {/* Grants */}
      <div className="space-y-2">
        {/* Attribute modifiers */}
        {displayModule.attributeModifiers &&
          Object.keys(displayModule.attributeModifiers).length > 0 && (
            <GrantSection title="Attributes">
              {Object.entries(displayModule.attributeModifiers).map(([attr, val]) => (
                <GrantPill key={attr} label={formatAttrName(attr)} value={`+${val}`} />
              ))}
            </GrantSection>
          )}

        {/* Active skills */}
        {displayModule.activeSkills && Object.keys(displayModule.activeSkills).length > 0 && (
          <GrantSection title="Active Skills">
            {Object.entries(displayModule.activeSkills).map(([skill, ranks]) => (
              <GrantPill key={skill} label={formatSkillName(skill)} value={`${ranks}`} />
            ))}
          </GrantSection>
        )}

        {/* Skill groups */}
        {displayModule.skillGroups && Object.keys(displayModule.skillGroups).length > 0 && (
          <GrantSection title="Skill Groups">
            {Object.entries(displayModule.skillGroups).map(([group, ranks]) => (
              <GrantPill key={group} label={formatSkillName(group)} value={`${ranks}`} />
            ))}
          </GrantSection>
        )}

        {/* Knowledge skills */}
        {displayModule.knowledgeSkills && Object.keys(displayModule.knowledgeSkills).length > 0 && (
          <GrantSection title="Knowledge Skills">
            {Object.entries(displayModule.knowledgeSkills).map(([skill, ranks]) => (
              <GrantPill
                key={skill}
                label={formatSkillName(skill)}
                value={`${ranks}`}
                variant="knowledge"
              />
            ))}
          </GrantSection>
        )}

        {/* Languages */}
        {displayModule.languages && Object.keys(displayModule.languages).length > 0 && (
          <GrantSection title="Languages">
            {Object.entries(displayModule.languages).map(([lang, ranks]) => (
              <GrantPill
                key={lang}
                label={lang}
                value={ranks > 0 ? `${ranks}` : "N"}
                variant="knowledge"
              />
            ))}
          </GrantSection>
        )}

        {/* Qualities */}
        {displayModule.qualities && displayModule.qualities.length > 0 && (
          <GrantSection title="Qualities">
            {displayModule.qualities.map((q) => (
              <GrantPill
                key={q.id}
                label={formatSkillName(q.id)}
                value={q.type === "positive" ? "+" : "−"}
                variant={q.type === "positive" ? "positive" : "negative"}
              />
            ))}
          </GrantSection>
        )}

        {/* Contacts */}
        {displayModule.contacts && displayModule.contacts.length > 0 && (
          <GrantSection title="Contacts">
            {displayModule.contacts.map((c, i) => (
              <GrantPill
                key={`contact-${i}`}
                label={c.archetype}
                value={`C${c.connection}/L${c.loyalty}`}
              />
            ))}
          </GrantSection>
        )}

        {/* Nuyen bonus */}
        {displayModule.nuyenBonus && displayModule.nuyenBonus > 0 && (
          <GrantSection title="Nuyen">
            <GrantPill label="Bonus" value={`${displayModule.nuyenBonus.toLocaleString()}¥`} />
          </GrantSection>
        )}
      </div>

      {/* Notes */}
      {displayModule.notes && (
        <p className="rounded-md bg-amber-50 px-2 py-1.5 text-[10px] text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          {displayModule.notes}
        </p>
      )}
    </div>
  );
}

// =============================================================================
// HELPERS
// =============================================================================

function GrantSection({
  title,
  children,
}: {
  readonly title: string;
  readonly children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {title}
      </h4>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

function GrantPill({
  label,
  value,
  variant = "default",
}: {
  readonly label: string;
  readonly value: string;
  readonly variant?: "default" | "positive" | "negative" | "knowledge";
}) {
  const variantClasses = {
    default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    positive: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    negative: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    knowledge: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${variantClasses[variant]}`}
    >
      <span>{label}</span>
      <span className="font-mono font-bold">{value}</span>
    </span>
  );
}

function formatAttrName(id: string): string {
  const names: Record<string, string> = {
    body: "BOD",
    agility: "AGI",
    reaction: "REA",
    strength: "STR",
    willpower: "WIL",
    logic: "LOG",
    intuition: "INT",
    charisma: "CHA",
    edge: "EDG",
    magic: "MAG",
    resonance: "RES",
  };
  return names[id] ?? id.toUpperCase().slice(0, 3);
}

function formatSkillName(id: string): string {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
