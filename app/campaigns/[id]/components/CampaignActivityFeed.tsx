"use client";

import React, { useEffect, useState } from "react";
import { CampaignActivityEvent, CampaignActivityType } from "@/lib/types/campaign";
import {
  UserPlus,
  UserMinus,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Award,
  Settings,
  MapPin,
  MessageSquare,
  Clock,
} from "lucide-react";

interface CampaignActivityFeedProps {
  campaignId: string;
}

export function CampaignActivityFeed({ campaignId }: CampaignActivityFeedProps) {
  const [activities, setActivities] = useState<CampaignActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/campaigns/${campaignId}/activity?limit=20`);
        const data = await response.json();
        if (data.success) {
          setActivities(data.activities);
        } else {
          setError(data.error || "Failed to fetch activities");
        }
      } catch {
        setError("An error occurred while fetching activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [campaignId]);

  const getIcon = (type: CampaignActivityType) => {
    switch (type) {
      case "player_joined":
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case "player_left":
        return <UserMinus className="w-4 h-4 text-red-500" />;
      case "character_created":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "character_approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "character_rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "session_scheduled":
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case "session_completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "karma_awarded":
        return <Award className="w-4 h-4 text-yellow-500" />;
      case "post_created":
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      case "campaign_updated":
        return <Settings className="w-4 h-4 text-gray-500" />;
      case "location_added":
        return <MapPin className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
              <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-500 py-4">{error}</div>;
  }

  if (activities.length === 0) {
    return <div className="text-sm text-zinc-500 py-4 italic text-center">No recent activity.</div>;
  }

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-4 top-0 bottom-2 w-px bg-zinc-200 dark:bg-zinc-800" />

      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="relative flex gap-4 items-start pl-2">
            {/* Icon Node */}
            <div className="relative z-10 w-4 h-4 mt-1.5 flex items-center justify-center bg-white dark:bg-zinc-950 rounded-full shadow-sm">
              {getIcon(activity.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline gap-2">
                <p className="text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
                  {activity.description}
                </p>
                <span className="text-[10px] uppercase font-medium text-zinc-400 whitespace-nowrap">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
              {activity.targetName && (
                <p className="mt-1 text-xs text-zinc-500 font-medium truncate">
                  {activity.targetType}: {activity.targetName}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
