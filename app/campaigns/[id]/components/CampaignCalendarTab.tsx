"use client";

import { useState } from "react";
import type { Campaign, CampaignEvent } from "@/lib/types";
import { Plus, Clock, Trophy, CheckCircle2 } from "lucide-react";
import SessionRewardDialog from "./SessionRewardDialog";
import type { CampaignSession } from "@/lib/types";

interface CampaignCalendarTabProps {
  campaign: Campaign;
  userRole: "gm" | "player";
}

type DisplayItem =
  | CampaignEvent
  | (CampaignSession & { displayTitle: string; date: string; type: "session" });

export default function CampaignCalendarTab({ campaign, userRole }: CampaignCalendarTabProps) {
  const [events, setEvents] = useState<CampaignEvent[]>(campaign.events || []);
  const [showForm, setShowForm] = useState(false);

  // New Event State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<"session" | "deadline" | "downtime" | "other">("session");
  const [submitting, setSubmitting] = useState(false);

  // Reward Dialog State
  const [selectedSession, setSelectedSession] = useState<CampaignSession | null>(null);
  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);

  const handleCompleteSession = (session: CampaignSession) => {
    setSelectedSession(session);
    setIsRewardDialogOpen(true);
  };

  const handleRewardSuccess = () => {
    // Since the parent CampaignDetailPage handles the campaign state,
    // we should ideally have a refresh mechanism.
    // For now, reload is the existing pattern in this component.
    window.location.reload();
  };

  const isSession = (
    item: DisplayItem
  ): item is CampaignSession & { displayTitle: string; date: string; type: "session" } => {
    return item.type === "session";
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Combine date and time to ISO
      const dateTime = new Date(`${date}T${time || "00:00"}`).toISOString();

      if (type === "session") {
        const res = await fetch(`/api/campaigns/${campaign.id}/sessions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            scheduledAt: dateTime,
            durationMinutes: 180, // Default duration
            notes: description,
          }),
        });
        const data = await res.json();
        if (data.success) {
          // Refresh the entire page or at least fetch the updated campaign to get the new session
          // Since we pass campaign as prop, we ideally should have an onUpdate callback,
          // but for now we can just push to a local list or reload.
          // Given the limitation, we will manually append to our derived list for immediate feedback
          // but a full reload ensures correctness.
          window.location.reload();
        }
      } else {
        const res = await fetch(`/api/campaigns/${campaign.id}/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            date: dateTime,
            type,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setEvents(
            [...events, data.event].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
          );
          setShowForm(false);
          // Reset form
          setTitle("");
          setDescription("");
          setDate("");
          setTime("");
          setType("session");
        }
      }
    } catch (error) {
      console.error("Failed to create event", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Merge events and sessions for display
  const sessions = (campaign.sessions || []).map((session, index) => ({
    ...session,
    displayTitle: `Session ${index + 1}: ${session.title || "Untitled"}`,
    date: session.scheduledAt,
    type: "session" as const,
  }));

  const allItems: DisplayItem[] = [...events, ...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Filter out past events for upcoming view
  const now = new Date();
  const upcomingEvents = allItems.filter((e) => new Date(e.date) >= now);
  const pastEvents = allItems.filter((e) => new Date(e.date) < now);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Schedule & Events</h3>
        {userRole === "gm" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        )}
      </div>

      {showForm && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Event Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as "session" | "deadline" | "downtime" | "other")
                  }
                  className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                >
                  <option value="session">Game Session</option>
                  <option value="downtime">Downtime</option>
                  <option value="deadline">Deadline</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                {submitting ? "Adding..." : "Add Event"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Upcoming
          </h4>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
                >
                  <div className="flex flex-col items-center justify-center rounded bg-indigo-50 px-3 py-2 text-center dark:bg-indigo-900/20">
                    <span className="text-xs font-semibold uppercase text-indigo-700 dark:text-indigo-400">
                      {new Date(event.date).toLocaleDateString(undefined, { month: "short" })}
                    </span>
                    <span className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {isSession(event) ? event.displayTitle : event.title}
                      </h5>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                          isSession(event) && event.status === "completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {isSession(event) && event.status === "completed"
                          ? "Completed"
                          : event.type}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Clock className="h-4 w-4" />
                        {new Date(event.date).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      {userRole === "gm" && isSession(event) && event.status !== "completed" && (
                        <button
                          onClick={() => handleCompleteSession(event)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <Trophy className="h-3.5 w-3.5" />
                          Complete & Award
                        </button>
                      )}
                    </div>
                    {"description" in event && event.description && (
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                        {event.description}
                      </p>
                    )}
                    {isSession(event) && event.recap && (
                      <div className="mt-3 rounded-md bg-zinc-50 p-3 dark:bg-zinc-900/50">
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                          Recap
                        </p>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3">
                          {event.recap}
                        </p>
                      </div>
                    )}
                    {isSession(event) && event.status === "completed" && (
                      <div className="mt-3 flex items-center gap-4 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                          <Trophy className="h-3.5 w-3.5" />
                          {event.karmaAwarded || 0} Karma
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Rewards Distributed
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 italic">No upcoming events scheduled.</p>
          )}
        </div>

        {pastEvents.length > 0 && (
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Past Events
            </h4>
            <div className="space-y-3 opacity-60">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <div className="text-sm font-medium text-zinc-500">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="font-medium text-zinc-700 dark:text-zinc-300">{event.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reward Dialog */}
      {selectedSession && (
        <SessionRewardDialog
          isOpen={isRewardDialogOpen}
          onClose={() => setIsRewardDialogOpen(false)}
          campaign={campaign}
          session={selectedSession}
          onSuccess={handleRewardSuccess}
        />
      )}
    </div>
  );
}
