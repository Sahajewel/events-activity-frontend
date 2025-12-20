// src/components/layout/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

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
  Star,
  UserCheck,
  Settings,
  Bell,
  Crown,
  Moon,
  Sun,
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

const getInitials = (fullName: string) => {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0][0] ?? "";
  const last = parts[parts.length - 1][0] ?? "";
  return (first + last).toUpperCase();
};

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme(); // Use theme context
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 🎯 Scroll Detection Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // 📱 Navigation links based on auth and role
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

  return (
    <>
      <nav
        className={`
          sticky top-0 z-50 w-full border-b transition-all duration-300
          ${
            scrolled
              ? "bg-background/80 backdrop-blur-xl shadow-md"
              : "bg-background/95 backdrop-blur-sm"
          }
        `}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 md:h-18 items-center justify-between">
            {/* Logo */}
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link?.icon;
                const isActive = pathname === link?.href;
                return (
                  <Link key={link?.href} href={link?.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`
                        flex items-center gap-2 transition-all
                        ${isActive ? "shadow-md" : "hover:bg-primary/10"}
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden xl:inline">{link?.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hidden md:flex hover:bg-primary/10 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hidden md:flex hover:bg-primary/10 transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </Button>

                  {/* User Dropdown */}
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
                        {user?.role === "HOST" && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-background flex items-center justify-center">
                            <Star className="h-3 w-3 text-white fill-white" />
                          </div>
                        )}
                        {user?.role === "ADMIN" && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full border-2 border-background flex items-center justify-center">
                            <Crown className="h-3 w-3 text-white fill-white" />
                          </div>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuLabel>
                        <div className="flex items-center gap-3 py-2">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={user?.profileImage}
                              alt={user?.fullName}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold text-lg">
                              {getInitials(user?.fullName || "")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {user?.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user?.email}
                            </p>
                            <Badge
                              variant="secondary"
                              className="w-fit mt-1 text-xs"
                            >
                              {user?.role}
                            </Badge>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <Link
                          href={`/profile/${user?.id}`}
                          className="cursor-pointer"
                        >
                          <User className="mr-2 h-4 w-4" />
                          My Profile
                        </Link>
                      </DropdownMenuItem>

                      {user?.role === "ADMIN" && (
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/10"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="shadow-md hover:shadow-lg transition-shadow"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-primary/10"
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed right-0 top-16 bottom-0 w-full max-w-sm bg-background border-l shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              {/* User Info in Mobile Menu */}
              {isAuthenticated && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarImage
                      src={user?.profileImage}
                      alt={user?.fullName}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold">
                      {getInitials(user?.fullName || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {user?.role}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
                  Navigation
                </p>
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
                        className={`
                          w-full justify-start gap-3 h-12 text-base
                          ${isActive ? "shadow-md" : ""}
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        {link.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>

              {/* Dark Mode Toggle (Mobile) */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
                  Appearance
                </p>
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="w-full justify-start gap-3 h-12"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="h-5 w-5" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="h-5 w-5" />
                      Light Mode
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Actions */}
              {isAuthenticated && user?.role === "ADMIN" && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
                    Quick Actions
                  </p>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-12"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Dashboard
                    </Button>
                  </Link>
                </div>
              )}

              {/* Auth Buttons (Mobile) */}
              {!isAuthenticated ? (
                <div className="space-y-2 pt-4 border-t">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full h-12">
                      Login
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full h-12 shadow-md">Sign Up</Button>
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
