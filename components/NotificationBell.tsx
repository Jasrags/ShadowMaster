"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
    Button, 
    MenuTrigger, 
    Popover, 
    Menu, 
    MenuItem,
    Link as AriaLink
} from "react-aria-components";
import { 
    Bell, 
    Circle, 
    Trash2, 
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Users,
    Award,
    FileText
} from "lucide-react";
import { CampaignNotification, NotificationType } from "@/lib/types/campaign";
import Link from "next/link";

export function NotificationBell() {
    const [notifications, setNotifications] = useState<CampaignNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);

    const fetchNotifications = async () => {
        try {
            const response = await fetch("/api/notifications");
            const data = await response.json();
            if (data.success) {
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds for new notifications
        pollingInterval.current = setInterval(fetchNotifications, 30000);
        return () => {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        };
    }, []);

    const markAsRead = async (id: string) => {
        try {
            const response = await fetch(`/api/notifications/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ read: true })
            });
            if (response.ok) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };

    const markAllRead = async () => {
        try {
            const response = await fetch("/api/notifications/mark-all-read", { method: "POST" });
            if (response.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() })));
                setUnreadCount(0);
            }
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const dismissNotification = async (id: string) => {
        try {
            const response = await fetch(`/api/notifications/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dismissed: true })
            });
            if (response.ok) {
                const wasUnread = notifications.find(n => n.id === id)?.read === false;
                setNotifications(prev => prev.filter(n => n.id !== id));
                if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error("Failed to dismiss notification:", err);
        }
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case "campaign_invite": return <Users className="w-4 h-4 text-purple-500" />;
            case "character_approved": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case "character_rejected": return <AlertCircle className="w-4 h-4 text-red-500" />;
            case "karma_awarded": return <Award className="w-4 h-4 text-yellow-500" />;
            case "session_reminder": return <Calendar className="w-4 h-4 text-blue-500" />;
            case "mentioned": return <AlertCircle className="w-4 h-4 text-orange-500" />;
            case "post_created": return <FileText className="w-4 h-4 text-indigo-500" />;
            default: return <Bell className="w-4 h-4 text-zinc-400" />;
        }
    };

    return (
        <MenuTrigger>
            <Button
                className="relative flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 dark:focus:ring-indigo-400"
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-black">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </Button>
            <Popover className="z-60 mt-2 w-80 sm:w-96 origin-top-right rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800/50">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            onPress={markAllRead}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            Mark all read
                        </Button>
                    )}
                </div>
                
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <Bell className="mb-2 h-8 w-8 text-zinc-200 dark:text-zinc-800" />
                            <p className="text-sm text-zinc-500">No notifications yet</p>
                        </div>
                    ) : (
                        <Menu className="outline-none">
                            {notifications.map((n) => (
                                <MenuItem
                                    key={n.id}
                                    onAction={() => !n.read && markAsRead(n.id)}
                                    className={`relative flex gap-3 border-b border-zinc-50 px-4 py-3 outline-none transition-colors last:border-0 hover:bg-zinc-50 dark:border-zinc-900/50 dark:hover:bg-zinc-900/40 ${!n.read ? "bg-indigo-50/30 dark:bg-indigo-900/10" : ""}`}
                                >
                                    <div className="mt-1 shrink-0">
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-sm ${!n.read ? "font-bold text-zinc-900 dark:text-zinc-50" : "font-medium text-zinc-600 dark:text-zinc-400"}`}>
                                                {n.title}
                                            </p>
                                            {!n.read && <Circle className="h-2 w-2 fill-indigo-500 text-indigo-500" />}
                                        </div>
                                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                            {n.message}
                                        </p>
                                        <div className="mt-2 flex items-center gap-3">
                                            <span className="text-[10px] font-medium text-zinc-400 uppercase">
                                                {new Date(n.createdAt).toLocaleDateString()}
                                            </span>
                                            {n.actionUrl && (
                                                <Link 
                                                    href={n.actionUrl}
                                                    className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                                >
                                                    View <ExternalLink className="h-2.5 w-2.5" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            onPress={() => dismissNotification(n.id)}
                                            className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                                            aria-label="Dismiss"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </MenuItem>
                            ))}
                        </Menu>
                    )}
                </div>
                
                <div className="border-t border-zinc-100 p-2 dark:border-zinc-800/50 text-center">
                    <AriaLink
                        href="/settings/notifications"
                        className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 uppercase tracking-widest"
                    >
                        Notification Settings
                    </AriaLink>
                </div>
            </Popover>
        </MenuTrigger>
    );
}
