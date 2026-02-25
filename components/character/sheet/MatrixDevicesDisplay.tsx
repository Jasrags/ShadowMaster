"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Character } from "@/lib/types";
import type { CharacterCommlink } from "@/lib/types/matrix";
import { DisplayCard } from "./DisplayCard";
import { Monitor, Star, Smartphone, AlertTriangle, ChevronDown } from "lucide-react";
import {
  getActiveCyberdeck,
  getCharacterCyberdecks,
  getCharacterCommlinks,
} from "@/lib/rules/matrix/cyberdeck-validator";

interface MatrixDevicesDisplayProps {
  character: Character;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
}

const DEVICE_TYPE_BADGE = {
  cyberdeck: {
    label: "Cyberdeck",
    style: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  commlink: {
    label: "Commlink",
    style: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
} as const;

const LEGALITY_BADGE: Record<string, { label: string; style: string }> = {
  restricted: {
    label: "R",
    style: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  forbidden: {
    label: "F",
    style: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  },
};

const CONDITION_BADGE: Record<string, { label: string; style: string }> = {
  bricked: {
    label: "Bricked",
    style: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  },
  destroyed: {
    label: "Destroyed",
    style: "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400",
  },
};

export function MatrixDevicesDisplay({
  character,
  onCharacterUpdate,
  editable,
}: MatrixDevicesDisplayProps) {
  const [switchOpen, setSwitchOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const switchBtnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number } | null>(null);

  // Position the dropdown portal relative to the switch button
  useEffect(() => {
    if (switchOpen && switchBtnRef.current) {
      const rect = switchBtnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }, [switchOpen]);

  // Close dropdown on outside click (use "click" not "mousedown" so portal
  // button onClick handlers fire before the dropdown is removed from the DOM)
  useEffect(() => {
    if (!switchOpen) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (dropdownRef.current?.contains(target) || switchBtnRef.current?.contains(target)) return;
      setSwitchOpen(false);
    }
    function handleScroll() {
      setSwitchOpen(false);
    }
    document.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [switchOpen]);

  const cyberdecks = useMemo(() => getCharacterCyberdecks(character), [character]);
  const commlinks = useMemo(() => getCharacterCommlinks(character), [character]);
  const activeDeck = useMemo(() => getActiveCyberdeck(character), [character]);

  const totalDevices = cyberdecks.length + commlinks.length;

  // Determine the active device ID — use character.activeMatrixDeviceId directly
  // so switching to a commlink is reflected immediately
  const activeDeviceId = useMemo(() => {
    const explicitId = character.activeMatrixDeviceId;
    if (explicitId) {
      // Verify it matches a device on this character
      const matchesDeck = cyberdecks.some((d) => d.id === explicitId || d.catalogId === explicitId);
      const matchesComm = commlinks.some((c) => c.id === explicitId || c.catalogId === explicitId);
      if (matchesDeck || matchesComm) return explicitId;
    }
    // Fallback: active cyberdeck, then first commlink
    if (activeDeck) return activeDeck.id ?? activeDeck.catalogId;
    if (commlinks.length > 0) return commlinks[0].id ?? commlinks[0].catalogId;
    return null;
  }, [character.activeMatrixDeviceId, activeDeck, cyberdecks, commlinks]);

  const allDevices = useMemo(() => {
    const devices: Array<{ id: string; name: string; type: "cyberdeck" | "commlink" }> = [];
    for (const deck of cyberdecks) {
      devices.push({
        id: deck.id ?? deck.catalogId,
        name: deck.customName ?? deck.name,
        type: "cyberdeck",
      });
    }
    for (const comm of commlinks) {
      devices.push({
        id: comm.id ?? comm.catalogId,
        name: (comm as CharacterCommlink).customName ?? comm.name,
        type: "commlink",
      });
    }
    return devices;
  }, [cyberdecks, commlinks]);

  const handleSwitchDevice = useCallback(
    async (newDeviceId: string) => {
      if (!onCharacterUpdate || saving) return;
      setSaving(true);
      setSwitchOpen(false);
      try {
        const res = await fetch(`/api/characters/${character.id}/matrix`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activeDeviceId: newDeviceId }),
        });
        if (res.ok) {
          onCharacterUpdate({ ...character, activeMatrixDeviceId: newDeviceId });
        }
      } finally {
        setSaving(false);
      }
    },
    [character, onCharacterUpdate, saving]
  );

  if (totalDevices === 0) return null;

  const activeDeviceName = allDevices.find((d) => d.id === activeDeviceId)?.name ?? "None";

  return (
    <DisplayCard
      id="sheet-matrix-devices"
      title="Matrix Devices"
      icon={<Monitor className="h-4 w-4 text-emerald-400" />}
      collapsible
    >
      <div className="space-y-3">
        {/* Cyberdecks */}
        {cyberdecks.map((deck) => {
          const deckId = deck.id ?? deck.catalogId;
          const isActive = deckId === activeDeviceId;
          const deckCondition = deck.condition ?? "functional";
          return (
            <div
              key={deckId}
              className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50"
            >
              {/* Name + DR row */}
              <div className="flex min-w-0 items-center gap-1.5">
                {isActive && (
                  <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                )}
                <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                  {deck.customName ?? deck.name}
                </span>
                <span className="ml-auto" />
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${DEVICE_TYPE_BADGE.cyberdeck.style}`}
                >
                  {DEVICE_TYPE_BADGE.cyberdeck.label}
                </span>
                {deck.legality && LEGALITY_BADGE[deck.legality] && (
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${LEGALITY_BADGE[deck.legality].style}`}
                  >
                    {LEGALITY_BADGE[deck.legality].label}
                  </span>
                )}
                {deckCondition !== "functional" && CONDITION_BADGE[deckCondition] && (
                  <span
                    className={`flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${CONDITION_BADGE[deckCondition].style}`}
                  >
                    <AlertTriangle className="h-2.5 w-2.5" />
                    {CONDITION_BADGE[deckCondition].label}
                  </span>
                )}
                <span className="shrink-0 whitespace-nowrap rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
                  DR {deck.deviceRating}
                </span>
              </div>

              {/* Stats: slots + ASDF on one line */}
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                <span className="font-mono">
                  Slots {deck.loadedPrograms.length}/{deck.programSlots}
                </span>
                {deck.currentConfig && (
                  <>
                    <span>·</span>
                    <span className="font-mono">
                      A{deck.currentConfig.attack} S{deck.currentConfig.sleaze} D
                      {deck.currentConfig.dataProcessing} F{deck.currentConfig.firewall}
                    </span>
                  </>
                )}
              </div>

              {/* Loaded programs */}
              {deck.loadedPrograms.length > 0 && (
                <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  Programs:{" "}
                  {deck.loadedPrograms
                    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
                    .join(", ")}
                </div>
              )}
            </div>
          );
        })}

        {/* Commlinks */}
        {commlinks.map((comm) => {
          const commId = comm.id ?? comm.catalogId;
          const isActive = commId === activeDeviceId;
          const fullComm = comm as CharacterCommlink;
          const commCondition = fullComm.condition ?? "functional";
          return (
            <div
              key={commId}
              className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50"
            >
              {/* Name + DR row */}
              <div className="flex min-w-0 items-center gap-1.5">
                {isActive && (
                  <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                )}
                <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                  {fullComm.customName ?? comm.name}
                </span>
                <span className="ml-auto" />
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${DEVICE_TYPE_BADGE.commlink.style}`}
                >
                  {DEVICE_TYPE_BADGE.commlink.label}
                </span>
                {fullComm.legality && LEGALITY_BADGE[fullComm.legality] && (
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${LEGALITY_BADGE[fullComm.legality].style}`}
                  >
                    {LEGALITY_BADGE[fullComm.legality].label}
                  </span>
                )}
                {commCondition !== "functional" && CONDITION_BADGE[commCondition] && (
                  <span
                    className={`flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${CONDITION_BADGE[commCondition].style}`}
                  >
                    <AlertTriangle className="h-2.5 w-2.5" />
                    {CONDITION_BADGE[commCondition].label}
                  </span>
                )}
                <span className="shrink-0 whitespace-nowrap rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
                  DR {comm.deviceRating}
                </span>
              </div>

              {/* Stats row */}
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                <span className="font-mono">
                  DP {fullComm.dataProcessing} · FW {fullComm.firewall}
                </span>
                <span>·</span>
                <span>¥{fullComm.cost.toLocaleString()}</span>
                <span>·</span>
                <span>Avail {fullComm.availability}</span>
              </div>
            </div>
          );
        })}

        {/* Active device footer */}
        {totalDevices > 0 && (
          <div className="flex items-center justify-between border-t border-zinc-200 pt-2.5 dark:border-zinc-700">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <span>Active:</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                <Star className="mr-0.5 inline h-3 w-3 fill-amber-400 text-amber-400" />
                {activeDeviceName}
              </span>
            </div>

            {editable && allDevices.length > 1 && (
              <>
                <button
                  ref={switchBtnRef}
                  onClick={() => setSwitchOpen(!switchOpen)}
                  disabled={saving}
                  className="flex items-center gap-1 rounded border border-zinc-300 px-2 py-1 text-[11px] font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  {saving ? "Saving…" : "Switch"}
                  <ChevronDown className="h-3 w-3" />
                </button>
                {switchOpen &&
                  dropdownPos &&
                  createPortal(
                    <div
                      ref={dropdownRef}
                      className="fixed z-50 min-w-[180px] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                      style={{ top: dropdownPos.top, right: dropdownPos.right }}
                    >
                      {allDevices
                        .filter((d) => d.id !== activeDeviceId)
                        .map((device) => (
                          <button
                            key={device.id}
                            onClick={() => handleSwitchDevice(device.id)}
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          >
                            {device.type === "cyberdeck" ? (
                              <Monitor className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Smartphone className="h-3 w-3 text-zinc-500" />
                            )}
                            <span>{device.name}</span>
                            <span
                              className={`ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase ${DEVICE_TYPE_BADGE[device.type].style}`}
                            >
                              {DEVICE_TYPE_BADGE[device.type].label}
                            </span>
                          </button>
                        ))}
                    </div>,
                    document.body
                  )}
              </>
            )}
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
