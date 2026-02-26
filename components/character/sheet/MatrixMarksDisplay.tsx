"use client";

import { useState } from "react";
import type { Character } from "@/lib/types";
import type { MarkTargetType, MatrixMark } from "@/lib/types/matrix";
import { useMatrixMarks, useMatrixSession } from "@/lib/matrix";
import { getAuthorizationLevel } from "@/lib/rules/matrix/mark-tracker";
import { Crosshair, ChevronDown, ChevronRight, Plus, Minus, Trash2 } from "lucide-react";
import { DisplayCard } from "./DisplayCard";

interface MatrixMarksDisplayProps {
  character: Character;
}

const AUTH_LEVEL_COLORS: Record<string, string> = {
  Outsider: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  User: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  Security: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  Admin: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const TARGET_TYPE_COLORS: Record<MarkTargetType, { label: string; style: string }> = {
  device: {
    label: "Device",
    style: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
  persona: {
    label: "Persona",
    style: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  },
  file: {
    label: "File",
    style: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  },
  host: {
    label: "Host",
    style: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  ic: {
    label: "IC",
    style: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  },
};

// ---------------------------------------------------------------------------
// MarkRow — expandable row for a mark held on a target
// ---------------------------------------------------------------------------

function MarkRow({
  mark,
  onAddOne,
  onRemoveOne,
  onRemoveAll,
}: {
  mark: MatrixMark;
  onAddOne: () => void;
  onRemoveOne: () => void;
  onRemoveAll: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const authLevel = getAuthorizationLevel(mark.markCount);
  const typeInfo = TARGET_TYPE_COLORS[mark.targetType];
  const authStyle = AUTH_LEVEL_COLORS[authLevel] ?? AUTH_LEVEL_COLORS.Outsider;

  return (
    <div className="[&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50">
      <div
        className="flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronDown className="h-3 w-3 shrink-0 text-zinc-400" />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0 text-zinc-400" />
        )}

        <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {mark.targetName}
        </span>

        {/* Target type badge */}
        <span
          className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${typeInfo.style}`}
        >
          {typeInfo.label}
        </span>

        {/* Auth level badge */}
        <span
          className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${authStyle}`}
        >
          {authLevel}
        </span>

        <div className="flex-1" />

        {/* Mark count stepper */}
        <div className="flex shrink-0 items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onRemoveOne}
            className="rounded p-0.5 text-zinc-500 transition-colors hover:bg-zinc-300/50 dark:text-zinc-400 dark:hover:bg-zinc-600/50"
            title="Remove 1 mark"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="min-w-[28px] rounded bg-zinc-200 px-1.5 py-0.5 text-center font-mono text-[10px] font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
            {mark.markCount}/3
          </span>
          <button
            onClick={onAddOne}
            disabled={mark.markCount >= 3}
            className="rounded p-0.5 text-zinc-500 transition-colors hover:bg-zinc-300/50 disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-600/50"
            title="Add 1 mark"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="ml-5 space-y-1.5 border-l-2 border-zinc-200 px-3 pb-2 dark:border-zinc-700">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold">Placed:</span>{" "}
            {new Date(mark.placedAt).toLocaleString()}
          </p>

          {mark.expiresAt && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold">Expires:</span>{" "}
              {new Date(mark.expiresAt).toLocaleString()}
            </p>
          )}

          {mark.markCount > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveAll();
              }}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10"
            >
              <Trash2 className="h-3 w-3" />
              Remove All
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ReceivedMarkRow — non-expandable row for marks received on self
// ---------------------------------------------------------------------------

function ReceivedMarkRow({
  mark,
  onAddOne,
  onRemoveAll,
}: {
  mark: MatrixMark;
  onAddOne: () => void;
  onRemoveAll: () => void;
}) {
  const authLevel = getAuthorizationLevel(mark.markCount);
  const typeInfo = TARGET_TYPE_COLORS[mark.targetType];
  const authStyle = AUTH_LEVEL_COLORS[authLevel] ?? AUTH_LEVEL_COLORS.Outsider;

  return (
    <div className="[&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50">
      <div className="flex items-center gap-2 px-3 py-1.5">
        <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {mark.targetName}
        </span>

        {/* Source type badge */}
        <span
          className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${typeInfo.style}`}
        >
          {typeInfo.label}
        </span>

        {/* Auth level badge */}
        <span
          className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${authStyle}`}
        >
          {authLevel}
        </span>

        <div className="flex-1" />

        {/* Mark count stepper */}
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            onClick={onRemoveAll}
            className="rounded p-0.5 text-zinc-500 transition-colors hover:bg-zinc-300/50 dark:text-zinc-400 dark:hover:bg-zinc-600/50"
            title="Remove received marks"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="min-w-[28px] rounded bg-zinc-200 px-1.5 py-0.5 text-center font-mono text-[10px] font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
            {mark.markCount}/3
          </span>
          <button
            onClick={onAddOne}
            disabled={mark.markCount >= 3}
            className="rounded p-0.5 text-zinc-500 transition-colors hover:bg-zinc-300/50 disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-600/50"
            title="Add 1 received mark"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PlaceMarkForm — inline form to place marks on a target
// ---------------------------------------------------------------------------

function PlaceMarkForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (
    targetId: string,
    targetType: MarkTargetType,
    targetName: string,
    count: number
  ) => void;
  onCancel: () => void;
}) {
  const [targetName, setTargetName] = useState("");
  const [targetType, setTargetType] = useState<MarkTargetType>("device");
  const [markCount, setMarkCount] = useState(1);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = targetName.trim();
    if (!trimmed) return;
    const targetId = trimmed.toLowerCase().replace(/\s+/g, "-");
    onSubmit(targetId, targetType, trimmed, markCount);
    setTargetName("");
    setTargetType("device");
    setMarkCount(1);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <input
        type="text"
        placeholder="Target name"
        value={targetName}
        onChange={(e) => setTargetName(e.target.value)}
        className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder:text-zinc-500"
        autoFocus
      />
      <div className="flex items-center gap-2">
        <select
          value={targetType}
          onChange={(e) => setTargetType(e.target.value as MarkTargetType)}
          className="min-w-0 flex-1 rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
        >
          <option value="device">Device</option>
          <option value="persona">Persona</option>
          <option value="file">File</option>
          <option value="host">Host</option>
          <option value="ic">IC</option>
        </select>
        <input
          type="number"
          min={1}
          max={3}
          value={markCount}
          onChange={(e) => setMarkCount(Math.min(3, Math.max(1, Number(e.target.value))))}
          className="w-12 shrink-0 rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          title="Mark count"
        />
        <button
          type="button"
          onClick={onCancel}
          className="shrink-0 rounded px-2 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!targetName.trim()}
          className="shrink-0 rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
        >
          Place Mark
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// ReceiveMarkForm — inline form to record marks placed on self
// ---------------------------------------------------------------------------

function ReceiveMarkForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (mark: MatrixMark) => void;
  onCancel: () => void;
}) {
  const [sourceName, setSourceName] = useState("");
  const [sourceType, setSourceType] = useState<MarkTargetType>("persona");
  const [markCount, setMarkCount] = useState(1);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = sourceName.trim();
    if (!trimmed) return;
    const mark: MatrixMark = {
      id: `mark-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      targetId: trimmed.toLowerCase().replace(/\s+/g, "-"),
      targetType: sourceType,
      targetName: trimmed,
      markCount,
      placedAt: new Date().toISOString(),
    };
    onSubmit(mark);
    setSourceName("");
    setSourceType("persona");
    setMarkCount(1);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <input
        type="text"
        placeholder="Source name"
        value={sourceName}
        onChange={(e) => setSourceName(e.target.value)}
        className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder:text-zinc-500"
        autoFocus
      />
      <div className="flex items-center gap-2">
        <select
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value as MarkTargetType)}
          className="min-w-0 flex-1 rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
        >
          <option value="device">Device</option>
          <option value="persona">Persona</option>
          <option value="file">File</option>
          <option value="host">Host</option>
          <option value="ic">IC</option>
        </select>
        <input
          type="number"
          min={1}
          max={3}
          value={markCount}
          onChange={(e) => setMarkCount(Math.min(3, Math.max(1, Number(e.target.value))))}
          className="w-12 shrink-0 rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          title="Mark count"
        />
        <button
          type="button"
          onClick={onCancel}
          className="shrink-0 rounded px-2 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!sourceName.trim()}
          className="shrink-0 rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
        >
          Add Received
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// MatrixMarksDisplay — main component
// ---------------------------------------------------------------------------

export function MatrixMarksDisplay({}: MatrixMarksDisplayProps) {
  const { marksHeld, marksReceived } = useMatrixMarks();
  const {
    placeMark,
    removeMark,
    clearAllMarks,
    receiveMarkOnSelf,
    removeReceivedMark,
    hasMatrixHardware,
  } = useMatrixSession();

  const [showPlaceForm, setShowPlaceForm] = useState(false);
  const [showReceiveForm, setShowReceiveForm] = useState(false);

  if (!hasMatrixHardware) return null;

  const hasAnyMarks = marksHeld.length > 0 || marksReceived.length > 0;

  return (
    <DisplayCard
      id="sheet-matrix-marks"
      title="Matrix Marks"
      icon={<Crosshair className="h-4 w-4 text-emerald-400" />}
      collapsible
      defaultCollapsed
      headerAction={
        hasAnyMarks ? (
          <button
            onClick={clearAllMarks}
            className="rounded px-2 py-0.5 text-[10px] font-medium text-red-500 transition-colors hover:bg-red-500/10"
          >
            Clear All
          </button>
        ) : undefined
      }
    >
      <div className="space-y-3">
        {/* Marks Held section */}
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Marks Held
            </span>
            {marksHeld.length > 0 && (
              <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                {marksHeld.length}
              </span>
            )}
          </div>

          {marksHeld.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              {marksHeld.map((mark) => (
                <MarkRow
                  key={mark.targetId}
                  mark={mark}
                  onAddOne={() => placeMark(mark.targetId, mark.targetType, mark.targetName, 1)}
                  onRemoveOne={() => removeMark(mark.targetId, 1)}
                  onRemoveAll={() => removeMark(mark.targetId)}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs italic text-zinc-400 dark:text-zinc-500">No marks placed</p>
          )}

          {showPlaceForm ? (
            <div className="mt-2">
              <PlaceMarkForm
                onSubmit={(targetId, targetType, targetName, count) => {
                  placeMark(targetId, targetType, targetName, count);
                  setShowPlaceForm(false);
                }}
                onCancel={() => setShowPlaceForm(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowPlaceForm(true)}
              className="mt-2 flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-500/10 dark:text-emerald-400"
            >
              <Plus className="h-3 w-3" />
              Place Mark
            </button>
          )}
        </div>

        {/* Marks On You section */}
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Marks On You
            </span>
            {marksReceived.length > 0 && (
              <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                {marksReceived.length}
              </span>
            )}
          </div>

          {marksReceived.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              {marksReceived.map((mark) => (
                <ReceivedMarkRow
                  key={mark.id}
                  mark={mark}
                  onAddOne={() =>
                    receiveMarkOnSelf({
                      ...mark,
                      markCount: 1,
                    })
                  }
                  onRemoveAll={() => removeReceivedMark(mark.targetId)}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs italic text-zinc-400 dark:text-zinc-500">No marks received</p>
          )}

          {showReceiveForm ? (
            <div className="mt-2">
              <ReceiveMarkForm
                onSubmit={(mark) => {
                  receiveMarkOnSelf(mark);
                  setShowReceiveForm(false);
                }}
                onCancel={() => setShowReceiveForm(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowReceiveForm(true)}
              className="mt-2 flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-500/10 dark:text-emerald-400"
            >
              <Plus className="h-3 w-3" />
              Add Received
            </button>
          )}
        </div>
      </div>
    </DisplayCard>
  );
}
