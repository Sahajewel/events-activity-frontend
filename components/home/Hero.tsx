/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Search,
  Calendar,
  Users,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { usePublicStats } from "@/hooks/useAdmin";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/hooks/useAuth";

export function Hero() {
  const { data: stats } = usePublicStats();
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // 🔥 Fetch featured/trending events
  const { data: featuredEvents } = useQuery({
    queryKey: ["featured-events"],
    queryFn: async () => {
      const res = await api.get("/events?limit=4&featured=true");
      return res.data.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // 🎯 Auto-rotate featured events
  useEffect(() => {
    if (!featuredEvents || featuredEvents.length === 0) return;

    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [featuredEvents]);

  // 💡 Helper functions
  const formatNumber = (num: number): string => {
    if (!num) return "0";
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // 🎨 Default fallback events with better variety
  const defaultEvents = [
    {
      name: "Music Concert",
      category: "Music",
      icon: Calendar,
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      date: "This Weekend",
    },
    {
      name: "Tech Meetup",
      category: "Technology",
      icon: Sparkles,
      gradient: "from-purple-500 via-purple-600 to-pink-600",
      date: "Tomorrow",
    },
    {
      name: "Hiking Adventure",
      category: "Outdoors",
      icon: TrendingUp,
      gradient: "from-green-500 via-emerald-600 to-teal-600",
      date: "Next Week",
    },
    {
      name: "Food Festival",
      category: "Food & Drink",
      icon: Users,
      gradient: "from-orange-500 via-red-500 to-pink-600",
      date: "This Saturday",
    },
  ];

  // Use real events or fallback to defaults
  const displayEvents =
    featuredEvents?.length > 0 ? featuredEvents.slice(0, 4) : defaultEvents;

  // 📊 Stats data with fallbacks
  const heroStats = [
    {
      value: stats?.totalUsers ? `${formatNumber(stats.totalUsers)}+` : "10K+",
      label: "Active Members",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      value: stats?.totalEvents
        ? `${formatNumber(stats.totalEvents)}+`
        : "500+",
      label: "Events Monthly",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      value: stats?.totalBookings
        ? `${formatNumber(stats.totalBookings)}+`
        : "4.8★",
      label: stats?.totalBookings ? "Bookings" : "User Rating",
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-purple-50/50 to-background py-12 md:py-20 lg:py-28">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>
                Join {formatNumber(stats?.totalUsers || 10000)}+ Members
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                Never Miss an{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Event
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                  >
                    <path
                      d="M2 10C50 2 150 2 198 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-primary/30"
                    />
                  </svg>
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-primary bg-clip-text text-transparent">
                  Find Your Crew
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Connect with like-minded people for concerts, sports, hiking,
                and more. Because experiences are{" "}
                <span className="font-semibold text-foreground">
                  better when shared
                </span>
                .
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link href="/events" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 shadow-lg hover:shadow-xl transition-all group"
                >
                  <Search className="h-5 w-5" />
                  Explore Events
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto gap-2 border-2 hover:bg-primary/5"
                >
                  <Users className="h-5 w-5" />
                  Join Community
                </Button>
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6 pt-6 lg:pt-8">
              {heroStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="group relative p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all hover:scale-105"
                >
                  <div className="relative z-10">
                    <p
                      className={`text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Event Cards Grid */}
          <div className="relative mt-8 lg:mt-0">
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 blur-3xl opacity-30" />

            <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
              {/* Left Column */}
              <div className="space-y-3 sm:space-y-4">
                {displayEvents.slice(0, 2).map((event: any, idx: number) => {
                  const Icon = event.icon || Calendar;
                  const gradient =
                    event.gradient || "from-blue-500 to-blue-600";

                  return (
                    <div
                      key={idx}
                      className={`group relative ${
                        idx === 0 ? "h-48 sm:h-56" : "h-40 sm:h-48"
                      } rounded-2xl bg-gradient-to-br ${gradient} p-4 sm:p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden`}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10">
                        <Icon className="h-7 w-7 sm:h-8 sm:w-8 mb-2 sm:mb-3 opacity-90" />
                        <h3 className="font-bold text-base sm:text-lg mb-1 line-clamp-1">
                          {event.name}
                        </h3>
                        {event.attendees && (
                          <p className="text-xs sm:text-sm opacity-90">
                            {event.attendees} people joined
                          </p>
                        )}
                        {event.date && (
                          <p className="text-xs opacity-75 mt-1">
                            {event.date}
                          </p>
                        )}
                      </div>

                      {/* Pulsing dot for featured events */}
                      {idx === currentEventIndex && (
                        <div className="absolute top-3 right-3">
                          <span className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Column - offset */}
              <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
                {displayEvents.slice(2, 4).map((event: any, idx: number) => {
                  const Icon = event.icon || Users;
                  const gradient =
                    event.gradient || "from-purple-500 to-purple-600";

                  return (
                    <div
                      key={idx + 2}
                      className={`group relative ${
                        idx === 0 ? "h-40 sm:h-48" : "h-48 sm:h-56"
                      } rounded-2xl bg-gradient-to-br ${gradient} p-4 sm:p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden`}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10">
                        <Icon className="h-7 w-7 sm:h-8 sm:w-8 mb-2 sm:mb-3 opacity-90" />
                        <h3 className="font-bold text-base sm:text-lg mb-1 line-clamp-1">
                          {event.name}
                        </h3>
                        {event.attendees && (
                          <p className="text-xs sm:text-sm opacity-90">
                            {event.attendees} attending
                          </p>
                        )}
                        {event.date && (
                          <p className="text-xs opacity-75 mt-1">
                            {event.date}
                          </p>
                        )}
                      </div>

                      {/* Pulsing dot for featured events */}
                      {idx + 2 === currentEventIndex && (
                        <div className="absolute top-3 right-3">
                          <span className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-background/95 backdrop-blur-sm border border-border rounded-full shadow-lg text-xs sm:text-sm font-medium whitespace-nowrap">
              🔥 {formatNumber(stats?.totalEvents || 500)}+ Events This Month
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </section>
  );
}
