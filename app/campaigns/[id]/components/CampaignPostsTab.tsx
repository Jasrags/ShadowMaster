"use client";

import { useState } from "react";
import type { Campaign, CampaignPost } from "@/lib/types";
import { MessageSquare, Plus, Pin, Send } from "lucide-react";

interface CampaignPostsTabProps {
  campaign: Campaign;
  userRole: "gm" | "player";
}

export default function CampaignPostsTab({ campaign, userRole }: CampaignPostsTabProps) {
  const [posts, setPosts] = useState<CampaignPost[]>(campaign.posts || []);
  const [showForm, setShowForm] = useState(false);

  // New Post State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"announcement" | "rumor" | "general">("general");
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          type,
          isPinned,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPosts([data.post, ...posts]);
        setShowForm(false);
        // Reset form
        setTitle("");
        setContent("");
        setType("general");
        setIsPinned(false);
      }
    } catch (error) {
      console.error("Failed to create post", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "announcement":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case "rumor":
        return "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800";
      default:
        return "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800";
    }
  };

  // Sort: Pinned first, then newest
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Bulletin Board</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New Post
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Title
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
                onChange={(e) => setType(e.target.value as "general" | "announcement" | "rumor")}
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              >
                <option value="general">General</option>
                <option value="announcement">Announcement (Official)</option>
                <option value="rumor">Rumor (In-Character)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              />
            </div>

            {userRole === "gm" && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
                />
                <label
                  htmlFor="isPinned"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Pin this post
                </label>
              </div>
            )}

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
                <Send className="h-4 w-4" />
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post) => (
            <div
              key={post.id}
              className={`rounded-lg border p-4 shadow-sm ${getBgColor(post.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {post.isPinned && <Pin className="h-4 w-4 rotate-45 text-orange-500" />}
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{post.title}</h4>
                    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 capitalize">
                      {post.type}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Posted {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-3 prose prose-zinc prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
            <MessageSquare className="h-12 w-12 text-zinc-400" />
            <h3 className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
              No posts yet
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Start a conversation or post an announcement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
