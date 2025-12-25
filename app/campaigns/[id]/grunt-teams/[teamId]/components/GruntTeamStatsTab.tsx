"use client";

import { Crown, Star, Shield, Heart, Brain, Zap, Target, Users } from "lucide-react";
import type { GruntTeam, GruntStats, LieutenantStats, GruntSpecialist } from "@/lib/types";
import { ProfessionalRatingBadge } from "../../components/ProfessionalRatingBadge";

interface GruntTeamStatsTabProps {
  team: GruntTeam;
  userRole: "gm" | "player";
}

function AttributeCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
      <Icon className="h-4 w-4 text-zinc-400" />
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="ml-auto font-mono font-bold text-zinc-900 dark:text-zinc-100">
        {value}
      </span>
    </div>
  );
}

function StatsSection({
  title,
  stats,
  icon: Icon,
  iconColor,
}: {
  title: string;
  stats: GruntStats;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
}) {
  const attributes = stats.attributes;

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className={`h-5 w-5 ${iconColor || "text-zinc-400"}`} />}
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
      </div>

      {/* Attributes Grid */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Attributes
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <AttributeCard label="BOD" value={attributes.body} icon={Shield} />
          <AttributeCard label="AGI" value={attributes.agility} icon={Target} />
          <AttributeCard label="REA" value={attributes.reaction} icon={Zap} />
          <AttributeCard label="STR" value={attributes.strength} icon={Heart} />
          <AttributeCard label="WIL" value={attributes.willpower} icon={Brain} />
          <AttributeCard label="LOG" value={attributes.logic} icon={Brain} />
          <AttributeCard label="INT" value={attributes.intuition} icon={Brain} />
          <AttributeCard label="CHA" value={attributes.charisma} icon={Users} />
        </div>
        {(stats.magic !== undefined || stats.resonance !== undefined || stats.essence !== undefined) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {stats.magic !== undefined && (
              <AttributeCard label="MAG" value={stats.magic} icon={Star} />
            )}
            {stats.resonance !== undefined && (
              <AttributeCard label="RES" value={stats.resonance} icon={Star} />
            )}
            <AttributeCard label="ESS" value={stats.essence} icon={Heart} />
          </div>
        )}
      </div>

      {/* Skills */}
      {Object.keys(stats.skills).length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.skills).map(([skill, rating]) => (
              <span
                key={skill}
                className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-sm"
              >
                <span className="text-zinc-700 dark:text-zinc-300">{skill}</span>
                <span className="ml-1 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  {rating}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Condition Monitor Size */}
      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <Shield className="h-4 w-4" />
        <span>Condition Monitor: {stats.conditionMonitorSize} boxes</span>
      </div>

      {/* Weapons */}
      {stats.weapons && stats.weapons.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Weapons
          </h4>
          <ul className="space-y-1">
            {stats.weapons.map((weapon, idx) => (
              <li
                key={idx}
                className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2"
              >
                <span>•</span>
                <span>{weapon.name}</span>
                {weapon.damage && (
                  <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded">
                    {weapon.damage}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Armor */}
      {stats.armor && stats.armor.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Armor
          </h4>
          <ul className="space-y-1">
            {stats.armor.map((armor, idx) => (
              <li
                key={idx}
                className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2"
              >
                <span>•</span>
                <span>{armor.name}</span>
                {armor.rating !== undefined && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded">
                    {armor.rating}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function LieutenantSection({ lieutenant }: { lieutenant: LieutenantStats }) {
  return (
    <div className="mt-6">
      <StatsSection
        title="Lieutenant"
        stats={lieutenant}
        icon={Crown}
        iconColor="text-amber-500"
      />
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {lieutenant.canBoostProfessionalRating && (
          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
            Can Boost PR
          </span>
        )}
        {lieutenant.usesIndividualInitiative && (
          <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded">
            Individual Initiative
          </span>
        )}
        {lieutenant.leadershipSkill !== undefined && (
          <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded">
            Leadership: {lieutenant.leadershipSkill}
          </span>
        )}
      </div>
    </div>
  );
}

function SpecialistCard({ specialist }: { specialist: GruntSpecialist }) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Star className="h-4 w-4 text-indigo-500" />
        <h4 className="font-medium text-zinc-900 dark:text-zinc-50">
          {specialist.type}
        </h4>
      </div>
      {specialist.description && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
          {specialist.description}
        </p>
      )}
      {specialist.statModifications && (
        <div className="text-xs space-y-1">
          {specialist.statModifications.skills &&
            Object.entries(specialist.statModifications.skills).map(
              ([skill, mod]) => (
                <span
                  key={skill}
                  className="inline-block mr-2 px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded"
                >
                  {skill}: +{mod}
                </span>
              )
            )}
        </div>
      )}
      {specialist.usesIndividualInitiative && (
        <span className="inline-block mt-2 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded text-xs">
          Individual Initiative
        </span>
      )}
    </div>
  );
}

export function GruntTeamStatsTab({ team, userRole }: GruntTeamStatsTabProps) {
  const isGM = userRole === "gm";

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <ProfessionalRatingBadge rating={team.professionalRating} showLabel size="md" />
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Users className="h-4 w-4" />
            <span>Team Size: {team.initialSize}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>
              Group Edge: {team.groupEdge}/{team.groupEdgeMax}
            </span>
          </div>
        </div>

        {team.description && (
          <p className="text-zinc-600 dark:text-zinc-400">{team.description}</p>
        )}

        {/* Visibility (GM only) */}
        {isGM && (
          <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Visibility Settings
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span
                className={`px-2 py-1 rounded ${
                  team.visibility?.showToPlayers
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                }`}
              >
                {team.visibility?.showToPlayers ? "Visible to Players" : "Hidden from Players"}
              </span>
              {team.visibility?.revealedStats && team.visibility.revealedStats.length > 0 && (
                <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded">
                  Revealed: {team.visibility.revealedStats.join(", ")}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Base Grunts Stats */}
      <StatsSection
        title="Base Grunt Statistics"
        stats={team.baseGrunts}
        icon={Users}
        iconColor="text-zinc-500"
      />

      {/* Lieutenant */}
      {team.lieutenant && <LieutenantSection lieutenant={team.lieutenant} />}

      {/* Specialists */}
      {team.specialists && team.specialists.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-indigo-500" />
            Specialists ({team.specialists.length})
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {team.specialists.map((specialist) => (
              <SpecialistCard key={specialist.id} specialist={specialist} />
            ))}
          </div>
        </div>
      )}

      {/* Options */}
      {isGM && team.options && (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Team Options
          </h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {team.options.useGroupInitiative !== undefined && (
              <span
                className={`px-2 py-1 rounded ${
                  team.options.useGroupInitiative
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {team.options.useGroupInitiative
                  ? "Group Initiative"
                  : "Individual Initiative"}
              </span>
            )}
            {team.options.useSimplifiedRules !== undefined && (
              <span
                className={`px-2 py-1 rounded ${
                  team.options.useSimplifiedRules
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {team.options.useSimplifiedRules
                  ? "Simplified Rules"
                  : "Standard Rules"}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
