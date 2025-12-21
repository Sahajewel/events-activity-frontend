/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { Bell, Calendar, Sparkles, X, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

// Types
interface Notification {
  id: string | number;
  title: string;
  message: string;
  eventId: string;
  type: string;
  timestamp: string;
  read: boolean;
}

// Pusher type declaration for CDN loaded script
declare global {
  interface Window {
    Pusher: any;
  }
}

// Simulated user data - replace with your actual auth hook
const useAuth = () => ({
  isAuthenticated: true,
  user: { id: "123", role: "USER", fullName: "John Doe" },
});

export default function NotificationSystem() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Show toast notification - defined before useEffect
  const showToast = useCallback((title: string, message: string): void => {
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 z-[9999] bg-white dark:bg-gray-800 border-2 border-primary rounded-lg shadow-2xl p-4 max-w-sm animate-slideIn";
    toast.innerHTML = `
      <div class="flex gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="font-bold text-sm mb-1">${title}</h4>
          <p class="text-xs text-gray-600 dark:text-gray-400">${message}</p>
        </div>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease-out";
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 5000);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    console.log("🚀 Setting up Pusher for user:", user.id);

    const script = document.createElement("script");
    script.src = "https://js.pusher.com/8.2.0/pusher.min.js";
    script.async = true;

    script.onload = () => {
      // Pusher is now available on window after script loads
      const pusher = new window.Pusher("1e585517d24cb8cf7fc4", {
        cluster: "ap3",
        forceTLS: true,
      });

      const channel = pusher.subscribe("events-channel");

      console.log("📡 Subscribed to events-channel");

      channel.bind("new-event", (data: any) => {
        console.log("🔔 New notification received:", data);

        const newNotification: Notification = {
          id: data.id || Date.now().toString(),
          title: data.title || "New Event Created!",
          message: data.message || "A new event is now available",
          eventId: data.id || "",
          type: data.type || "",
          timestamp: new Date().toISOString(),
          read: false,
        };

        setNotifications((prev: Notification[]) => [newNotification, ...prev]);
        setUnreadCount((prev: number) => prev + 1);

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(newNotification.title, {
            body: newNotification.message,
            icon: "/logo.png",
            badge: "/logo.png",
          });
        }

        showToast(newNotification.title, newNotification.message);
      });
    };

    document.head.appendChild(script);

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isAuthenticated, user, showToast]);

  const markAsRead = useCallback((): void => {
    setUnreadCount(0);
    setNotifications((prev: Notification[]) =>
      prev.map((n: Notification) => ({ ...n, read: true }))
    );
  }, []);

  const handleNotificationClick = useCallback(
    (eventId: string): void => {
      if (eventId) {
        router.push(`/events/${eventId}`);
      }
    },
    [router]
  );

  const clearNotification = useCallback(
    (id: string | number, e: React.MouseEvent<HTMLButtonElement>): void => {
      e.stopPropagation();
      setNotifications((prev: Notification[]) =>
        prev.filter((n: Notification) => n.id !== id)
      );
      setUnreadCount((prev: number) => Math.max(0, prev - 1));
    },
    []
  );

  const clearAll = useCallback((): void => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const navigateToEvents = useCallback((): void => {
    router.push("/events");
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) markAsRead();
          }}
          className="relative w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 font-bold animate-bounce">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Panel */}
            <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Notifications
                  </h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-primary hover:text-primary/80 font-semibold"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                {unreadCount > 0 && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    You have {unreadCount} new notification
                    {unreadCount > 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                      <Bell className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No new notifications
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                      We&apos;ll notify you when something new arrives
                    </p>
                  </div>
                ) : (
                  notifications.map((notification: Notification) => (
                    <div
                      key={notification.id}
                      onClick={() =>
                        handleNotificationClick(notification.eventId)
                      }
                      className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors relative group ${
                        !notification.read
                          ? "bg-blue-50/50 dark:bg-blue-950/20"
                          : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          {notification.type === "Music" ? (
                            "🎵"
                          ) : notification.type === "Sports" ? (
                            "⚽"
                          ) : notification.type === "Technology" ? (
                            "💻"
                          ) : notification.type === "Food" ? (
                            "🍔"
                          ) : (
                            <Calendar className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm line-clamp-1">
                              {notification.title}
                            </h4>
                            <button
                              onClick={(
                                e: React.MouseEvent<HTMLButtonElement>
                              ) => clearNotification(notification.id, e)}
                              className="opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1 transition-all"
                              aria-label="Clear notification"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={navigateToEvents}
                    className="w-full text-center text-sm text-primary hover:text-primary/80 font-semibold flex items-center justify-center gap-1"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Browse All Events
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return time.toLocaleDateString();
}
