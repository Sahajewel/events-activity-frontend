/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, api } from "@/hooks/useAuth";
import Pusher from "pusher-js";
import { toast } from "sonner";

import {
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Search,
  Plus,
  LayoutDashboard,
  BookMarked,
  UserCheck,
  Settings,
  Bell,
  Crown,
  Moon,
  Sun,
  Sparkles,
  TrendingUp,
  Shield,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "../contexts/ThemeContexts";

// Notification interface
interface NotificationData {
  id: string;
  title: string;
  message: string;
  eventId: string;
  type: string;
  timestamp: string;
  read: boolean;
}

const getInitials = (fullName: string) => {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0][0] ?? "";
  const last = parts[parts.length - 1][0] ?? "";
  return (first + last).toUpperCase();
};

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return time.toLocaleDateString();
};

// Get role badge
const getRoleBadge = (role: string) => {
  const roleConfig: Record<
    string,
    { label: string; icon: any; color: string }
  > = {
    ADMIN: { label: "Admin", icon: Crown, color: "bg-purple-500" },
    HOST: { label: "Host", icon: Shield, color: "bg-blue-500" },
    USER: { label: "User", icon: UserCircle, color: "bg-green-500" },
  };

  return roleConfig[role] || roleConfig.USER;
};

// ✅ Get global notifications (not user-specific) - Always shows last 10 events
const getGlobalNotifications = (): NotificationData[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("global_event_notifications");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Return last 10 notifications
      return (parsed || []).slice(0, 10);
    }
  } catch (error) {
    console.error("Error loading global notifications:", error);
  }

  return [];
};

// ✅ Save global notifications
const saveGlobalNotifications = (notifications: NotificationData[]) => {
  if (typeof window === "undefined") return;

  try {
    // Keep only last 10 notifications
    const limited = notifications.slice(0, 10);
    localStorage.setItem("global_event_notifications", JSON.stringify(limited));
  } catch (error) {
    console.error("Error saving notifications:", error);
  }
};

// ✅ Load user-specific read status
const getUserReadStatus = (userId: string): Record<string, boolean> => {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(`user_read_status_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading read status:", error);
  }

  return {};
};

// ✅ Save user read status
const saveUserReadStatus = (
  userId: string,
  readStatus: Record<string, boolean>
) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      `user_read_status_${userId}`,
      JSON.stringify(readStatus)
    );
  } catch (error) {
    console.error("Error saving read status:", error);
  }
};

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ✅ Load global notifications (same for all users)
  const [globalNotifications, setGlobalNotifications] = useState<
    NotificationData[]
  >(getGlobalNotifications());

  // ✅ User-specific read status
  const [userReadStatus, setUserReadStatus] = useState<Record<string, boolean>>(
    () => {
      if (typeof window === "undefined") return {};
      return user ? getUserReadStatus(user.id) : {};
    }
  );
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // ✅ Calculate unread count based on user read status
  const unreadCount = useMemo(() => {
    if (!user) return 0;
    return globalNotifications.filter((n) => !userReadStatus[n.id]).length;
  }, [globalNotifications, userReadStatus, user]);

  // ✅ Fetch recent events on login (for missed notifications)
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchRecentEvents = async () => {
      try {
        const response = await api.get(
          "/events?limit=10&sortBy=createdAt&sortOrder=desc"
        );
        const events = response.data.data || [];

        // Convert events to notifications
        const eventNotifications: NotificationData[] = events.map(
          (event: any) => ({
            id: event.id,
            title: "New Event Available! 🔥",
            message: `${event.host?.fullName || "Someone"} created: ${
              event.name
            }`,
            eventId: event.id,
            type: event.type,
            timestamp: event.createdAt || new Date().toISOString(),
            read: false,
          })
        );

        // Merge with existing notifications (avoid duplicates)
        const existingIds = new Set(globalNotifications.map((n) => n.id));
        const newNotifications = eventNotifications.filter(
          (n) => !existingIds.has(n.id)
        );

        if (newNotifications.length > 0) {
          const updated = [...newNotifications, ...globalNotifications].slice(
            0,
            10
          );
          setGlobalNotifications(updated);
          saveGlobalNotifications(updated);
        }
      } catch (error) {
        console.error("Error fetching recent events:", error);
      }
    };

    fetchRecentEvents();
  }, [isAuthenticated, user]);

  // ✅ Save global notifications whenever they change
  useEffect(() => {
    if (globalNotifications.length > 0) {
      saveGlobalNotifications(globalNotifications);
    }
  }, [globalNotifications]);

  // ✅ Save user read status whenever it changes
  useEffect(() => {
    if (user && Object.keys(userReadStatus).length > 0) {
      saveUserReadStatus(user.id, userReadStatus);
    }
  }, [userReadStatus, user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    if (!isAuthenticated || !user) {
      window.removeEventListener("scroll", handleScroll);
      return;
    }

    console.log("🚀 Setting up Pusher notifications for:", user.fullName);

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
      forceTLS: true,
    });

    const channel = pusher.subscribe("events-channel");
    console.log("📡 Subscribed to events-channel");

    channel.bind("new-event", (data: any) => {
      console.log("🔔 Notification received:", data);

      const newNotification: NotificationData = {
        id: data.id || Date.now().toString(),
        title: data.title || "New Event!",
        message: data.message || "Click to see details.",
        eventId: data.id || "",
        type: data.type || "",
        timestamp: new Date().toISOString(),
        read: false,
      };

      // Add to global notifications
      setGlobalNotifications((prev) => [newNotification, ...prev].slice(0, 10));

      toast.info(data.title, {
        description: data.message,
        action: {
          label: "View Event",
          onClick: () => {
            router.push(`/events/${data.id}`);
          },
        },
      });

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(data.title, {
          body: data.message,
          icon: "/logo.png",
        });
      }
    });

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [isAuthenticated, user, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const markNotificationsAsRead = () => {
    if (!user) return;

    const newReadStatus = { ...userReadStatus };
    globalNotifications.forEach((n) => {
      newReadStatus[n.id] = true;
    });
    setUserReadStatus(newReadStatus);
  };

  const handleNotificationClick = (eventId: string) => {
    setIsNotificationOpen(false); // ✅ Close dropdown
    router.push(`/events/${eventId}`); // ✅ Navigate to event
  };

  const clearNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGlobalNotifications((prev) => prev.filter((n) => n.id !== id));

    // Remove from read status too
    if (user) {
      const newReadStatus = { ...userReadStatus };
      delete newReadStatus[id];
      setUserReadStatus(newReadStatus);
    }
  };

  const clearAllNotifications = () => {
    setGlobalNotifications([]);
    if (user) {
      setUserReadStatus({});
      saveUserReadStatus(user.id, {});
    }
    localStorage.removeItem("global_event_notifications");
  };

  const navLinks = isAuthenticated
    ? [
        { href: "/", label: "Home", icon: Home },
        ...(user?.role === "ADMIN" ||
        user?.role === "USER" ||
        user?.role === "HOST"
          ? [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }]
          : []),
        ...(user?.role === "USER" || user?.role === "HOST"
          ? [{ href: "/events", label: "Events", icon: Search }]
          : []),
        ...(user?.role === "HOST"
          ? [{ href: "/events/create", label: "Create", icon: Plus }]
          : []),
        ...(user?.role === "USER"
          ? [{ href: "/my-bookings", label: "Bookings", icon: BookMarked }]
          : []),
        ...(user?.role === "USER" || user?.role === "HOST"
          ? [{ href: "/my-events", label: "My Events", icon: Calendar }]
          : []),
        ...(user?.role === "USER"
          ? [{ href: "/become-host", label: "Become Host", icon: UserCheck }]
          : []),
      ]
    : [
        { href: "/", label: "Home", icon: Home },
        { href: "/events", label: "Events", icon: Search },
        { href: "/become-host", label: "Become Host", icon: UserCheck },
      ];

  const roleInfo = user ? getRoleBadge(user.role) : null;

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl shadow-md"
            : "bg-background/95 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 md:h-18 items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 group transition-transform hover:scale-105"
            >
              <div className="relative">
                <Calendar className="h-7 w-7 md:h-8 md:w-8 text-primary transition-transform group-hover:rotate-12" />
                {user?.role === "ADMIN" && (
                  <Crown className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500" />
                )}
              </div>
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                EventHub
              </span>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link?.icon;
                const isActive = pathname === link?.href;
                return (
                  <Link key={link?.href} href={link?.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`flex items-center gap-2 transition-all ${
                        isActive ? "shadow-md" : "hover:bg-primary/10"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden xl:inline">{link?.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hidden md:flex hover:bg-primary/10"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>

              {isAuthenticated ? (
                <>
                  <DropdownMenu
                    open={isNotificationOpen}
                    onOpenChange={(open) => {
                      setIsNotificationOpen(open);
                      if (open) markNotificationsAsRead();
                    }}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative hover:bg-primary/10 transition-colors"
                      >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-background animate-bounce font-bold">
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-96 max-w-[calc(100vw-2rem)] p-0"
                    >
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Notifications
                          </h3>
                          {globalNotifications.length > 0 && (
                            <button
                              onClick={clearAllNotifications}
                              className="text-xs text-primary hover:text-primary/80 font-semibold"
                            >
                              Clear All
                            </button>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {unreadCount} new notification
                            {unreadCount > 1 ? "s" : ""}
                          </p>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {globalNotifications.length === 0 ? (
                          <div className="p-8 text-center text-sm text-muted-foreground">
                            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                            <p>No notifications</p>
                            <p className="text-xs mt-1">
                              We&apos;ll notify you when new events arrive
                            </p>
                          </div>
                        ) : (
                          globalNotifications.map((n) => {
                            const isRead = userReadStatus[n.id] || false;
                            return (
                              <DropdownMenuItem
                                key={n.id}
                                className={`p-4 cursor-pointer border-b last:border-0 focus:bg-muted ${
                                  !isRead
                                    ? "bg-blue-50/50 dark:bg-blue-950/20"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleNotificationClick(n.eventId)
                                }
                              >
                                <div className="flex gap-3 w-full">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                                    {n.type === "Music" ? (
                                      "🎵"
                                    ) : n.type === "Sports" ? (
                                      "⚽"
                                    ) : n.type === "Technology" ? (
                                      "💻"
                                    ) : n.type === "Food" ? (
                                      "🍔"
                                    ) : (
                                      <Calendar className="h-5 w-5 text-white" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <p className="text-sm font-semibold line-clamp-1">
                                        {n.title}
                                      </p>
                                      <button
                                        onClick={(e) =>
                                          clearNotification(n.id, e)
                                        }
                                        className="hover:bg-muted rounded-full p-1"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                      {n.message}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-muted-foreground">
                                        {formatTimeAgo(n.timestamp)}
                                      </span>
                                      {!isRead && (
                                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </DropdownMenuItem>
                            );
                          })
                        )}
                      </div>

                      {globalNotifications.length > 0 && (
                        <div className="p-3 bg-muted/50 border-t">
                          <button
                            onClick={() => {
                              setIsNotificationOpen(false);
                              router.push("/events");
                            }}
                            className="w-full text-center text-sm text-primary hover:text-primary/80 font-semibold flex items-center justify-center gap-1"
                          >
                            <TrendingUp className="h-4 w-4" />
                            Browse All Events
                          </button>
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-9 w-9 md:h-10 md:w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all"
                      >
                        <Avatar className="h-9 w-9 md:h-10 md:w-10">
                          <AvatarImage
                            src={user?.profileImage}
                            alt={user?.fullName}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold">
                            {getInitials(user?.fullName || "")}
                          </AvatarFallback>
                        </Avatar>
                        {user?.role === "ADMIN" && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-600 rounded-full border-2 border-background flex items-center justify-center">
                            <Crown className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuLabel>
                        <div className="flex items-center gap-3 py-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.profileImage} />
                            <AvatarFallback>
                              {getInitials(user?.fullName || "")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate">
                              {user?.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user?.email}
                            </p>
                            {roleInfo && (
                              <div className="mt-1.5">
                                <Badge
                                  variant="secondary"
                                  className="text-xs gap-1"
                                >
                                  <roleInfo.icon className="h-3 w-3" />
                                  {roleInfo.label}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/profile/${user?.id}`}
                          className="cursor-pointer w-full flex items-center"
                        >
                          <User className="mr-2 h-4 w-4" /> My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/settings"
                          className="cursor-pointer w-full flex items-center"
                        >
                          <Settings className="mr-2 h-4 w-4" /> Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ✅ Smart Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm lg:hidden pt-16">
          <div className="h-full overflow-y-auto">
            <div className="container mx-auto px-4 py-6 space-y-4">
              {/* ✅ Theme Toggle for Mobile */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium">Theme</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="gap-2"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className="w-full justify-start h-12 text-base gap-3"
                      >
                        <Icon className="h-5 w-5" />
                        {link.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>

              {/* User Info Section */}
              {isAuthenticated && user && (
                <div className="mt-6 p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profileImage} />
                      <AvatarFallback>
                        {getInitials(user.fullName || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {roleInfo && (
                    <Badge variant="secondary" className="gap-1">
                      <roleInfo.icon className="h-3 w-3" />
                      {roleInfo.label}
                    </Badge>
                  )}
                </div>
              )}

              {/* Logout Button */}
              {isAuthenticated && (
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  variant="destructive"
                  className="w-full h-12 gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              )}

              {/* Login/Register for non-authenticated users */}
              {!isAuthenticated && (
                <div className="space-y-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full h-12">
                      Login
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full h-12">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
