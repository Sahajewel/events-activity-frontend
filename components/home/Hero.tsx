"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Tag,
  Gift,
} from "lucide-react";
import { usePublicStats } from "@/hooks/useAdmin";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/hooks/useAuth";
import AIEventAssistant from "../AI/AIEventAssistance";

export function Hero() {
  const { data: stats } = usePublicStats();
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // 🔥 Fetch featured events
  const { data: featuredEvents } = useQuery({
    queryKey: ["featured-events"],
    queryFn: async () => {
      const res = await api.get("/events?limit=4&featured=true");
      return res.data.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // 🎯 Auto rotate events
  useEffect(() => {
    if (!featuredEvents || featuredEvents.length === 0) return;
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [featuredEvents]);

  const formatNumber = (num: number): string => {
    if (!num) return "0";
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // 🎨 Default fallback events
  const defaultEvents = [
    {
      name: "Music Concert",
      icon: Calendar,
      gradient: "from-blue-500 to-indigo-600",
      date: "This Weekend",
    },
    {
      name: "Tech Meetup",
      icon: Sparkles,
      gradient: "from-purple-500 to-pink-600",
      date: "Tomorrow",
    },
    {
      name: "Hiking Adventure",
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-600",
      date: "Next Week",
    },
    {
      name: "Food Festival",
      icon: Users,
      gradient: "from-orange-500 to-red-500",
      date: "This Saturday",
    },
  ];

  const displayEvents =
    featuredEvents?.length > 0 ? featuredEvents.slice(0, 4) : defaultEvents;

  const heroStats = [
    {
      value: `${formatNumber(stats?.totalUsers || 10000)}+`,
      label: "Active Members",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      value: `${formatNumber(stats?.totalEvents || 500)}+`,
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
      {/* 🔥 OFFER BANNER */}
      <div className="container mx-auto px-4 mb-10">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 p-[2px] shadow-xl">
          <div className="relative rounded-2xl bg-background px-6 py-5 md:px-10 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                <Gift className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm font-semibold text-primary flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  Welcome Offer
                </p>
                <h3 className="text-lg md:text-xl font-bold">
                  Get{" "}
                  <span className="text-orange-600 font-extrabold">
                    20% OFF
                  </span>{" "}
                  on your event booking
                </h3>
                <p className="text-xs text-muted-foreground">
                  Use promo code{" "}
                  <span className="font-mono font-semibold text-orange-600">
                    WELCOME20
                  </span>{" "}
                  at checkout • Limited time offer
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-5 py-2 rounded-full border-2 border-dashed border-orange-400 bg-orange-50 dark:bg-orange-950 text-orange-600 font-mono font-bold text-lg">
              <Tag className="h-4 w-4" />
              WELCOME20
            </div>
          </div>
        </div>
      </div>

      {/* MAIN HERO */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Join {formatNumber(stats?.totalUsers || 10000)}+ Members
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              Never Miss an{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Event
              </span>
              <br />
              Find Your Crew
            </h1>

            <p className="text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Connect with like-minded people for concerts, sports, hiking, and
              more. Experiences are better when shared.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/events">
                <Button size="lg" className="gap-2">
                  <Search className="h-5 w-5" />
                  Explore Events
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/register">
                <Button size="lg" variant="outline" className="gap-2">
                  <Users className="h-5 w-5" />
                  Join Community
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6">
              {heroStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border bg-background/60 backdrop-blur p-4"
                >
                  <p
                    className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-4">
            {displayEvents.map((event: any, idx: number) => {
              const Icon = event.icon || Calendar;
              return (
                <div
                  key={idx}
                  className={`relative rounded-2xl p-5 text-white bg-gradient-to-br ${
                    event.gradient
                  } shadow-lg ${
                    idx === currentEventIndex ? "scale-105" : ""
                  } transition`}
                >
                  <Icon className="h-7 w-7 mb-2" />
                  <h3 className="font-semibold">{event.name}</h3>
                  <p className="text-xs opacity-80">{event.date}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AIEventAssistant />
    </section>
  );
}
