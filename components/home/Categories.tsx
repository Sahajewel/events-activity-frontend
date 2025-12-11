/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Music,
  Bike,
  Laptop,
  UtensilsCrossed,
  Palette,
  Dumbbell,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/hooks/useAuth";

export function Categories() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 🔥 Fetch real category counts from backend
  const { data: categoryCounts } = useQuery({
    queryKey: ["category-counts"],
    queryFn: async () => {
      const res = await api.get("/events/categories/counts");
      return res.data.data || {};
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });

  const categories = [
    {
      name: "Music & Concerts",
      icon: Music,
      count: categoryCounts?.Music || 120,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/10",
      hoverBg: "hover:bg-pink-500/20",
      link: "/events?category=Music",
      trend: "+12%",
      description: "Live shows, festivals & concerts",
    },
    {
      name: "Sports & Fitness",
      icon: Dumbbell,
      count: categoryCounts?.Sports || 85,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      hoverBg: "hover:bg-green-500/20",
      link: "/events?category=Sports",
      trend: "+8%",
      description: "Games, workouts & competitions",
    },
    {
      name: "Technology",
      icon: Laptop,
      count: categoryCounts?.Technology || 95,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      hoverBg: "hover:bg-blue-500/20",
      link: "/events?category=Technology",
      trend: "+15%",
      description: "Meetups, hackathons & workshops",
    },
    {
      name: "Food & Dining",
      icon: UtensilsCrossed,
      count: categoryCounts?.Food || 70,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-500/10",
      hoverBg: "hover:bg-orange-500/20",
      link: "/events?category=Food",
      trend: "+10%",
      description: "Food tours, tastings & dinners",
    },
    {
      name: "Arts & Culture",
      icon: Palette,
      count: categoryCounts?.Arts || 60,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-500/10",
      hoverBg: "hover:bg-purple-500/20",
      link: "/events?category=Arts",
      trend: "+7%",
      description: "Galleries, theater & exhibitions",
    },
    {
      name: "Outdoor & Adventure",
      icon: Bike,
      count: categoryCounts?.Outdoor || 75,
      color: "from-teal-500 to-green-500",
      bgColor: "bg-teal-500/10",
      hoverBg: "hover:bg-teal-500/20",
      link: "/events?category=Outdoor",
      trend: "+9%",
      description: "Hiking, cycling & exploration",
    },
  ];

  // Find most popular category
  const mostPopular = categories.reduce((prev, current) =>
    prev.count > current.count ? prev : current
  );

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            Browse by Interest
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Explore Categories
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Find activities that match your interests and passions
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mb-12">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isHovered = hoveredIndex === index;
            const isMostPopular = category.name === mostPopular.name;

            return (
              <Link
                key={index}
                href={category.link}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`
                  group relative bg-card border-2 rounded-2xl p-4 sm:p-5 md:p-6 
                  text-center transition-all duration-300 cursor-pointer h-full
                  ${
                    isHovered
                      ? "border-primary/50 shadow-2xl -translate-y-2 scale-105"
                      : "border-border hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
                  }
                `}
                >
                  {/* Popular Badge */}
                  {isMostPopular && (
                    <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                      <TrendingUp className="h-3 w-3" />
                      <span className="hidden sm:inline">Hot</span>
                    </div>
                  )}

                  {/* Icon Container */}
                  <div
                    className={`
                    relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 
                    rounded-xl md:rounded-2xl bg-gradient-to-br ${
                      category.color
                    } 
                    mx-auto mb-3 sm:mb-4 flex items-center justify-center 
                    shadow-lg transition-all duration-300
                    ${
                      isHovered
                        ? "scale-110 shadow-2xl rotate-3"
                        : "group-hover:scale-105"
                    }
                  `}
                  >
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 text-white" />

                    {/* Glow effect */}
                    <div
                      className={`
                      absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br ${category.color} 
                      opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300
                    `}
                    />
                  </div>

                  {/* Category Name */}
                  <h3 className="font-bold text-xs sm:text-sm md:text-base mb-1 sm:mb-2 leading-tight">
                    {category.name}
                  </h3>

                  {/* Event Count */}
                  <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-muted-foreground mb-2">
                    <span className="font-semibold text-foreground">
                      {category.count}+
                    </span>
                    <span className="hidden sm:inline">Events</span>
                  </div>

                  {/* Trend Badge - Show on hover or active */}
                  <div
                    className={`
                    flex items-center justify-center gap-1 text-xs text-green-600 font-medium
                    transition-all duration-300 overflow-hidden
                    ${isHovered ? "max-h-6 opacity-100" : "max-h-0 opacity-0"}
                  `}
                  >
                    <TrendingUp className="h-3 w-3" />
                    <span>{category.trend} this week</span>
                  </div>

                  {/* Description - Desktop only, show on hover */}
                  <div
                    className={`
                    hidden lg:block text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50
                    transition-all duration-300 overflow-hidden
                    ${isHovered ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}
                  `}
                  >
                    {category.description}
                  </div>

                  {/* Hover Arrow */}
                  <div
                    className={`
                    absolute bottom-2 right-2 transition-all duration-300
                    ${
                      isHovered
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-2"
                    }
                  `}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center`}
                    >
                      <ArrowRight className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-6 p-6 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 border border-primary/20 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-foreground">
                  Can&apos;t find what you&apos;re looking for?
                </p>
                <p className="text-sm text-muted-foreground">
                  Explore all events or create your own
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link href="/events" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group">
                  Browse All Events
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>New events added daily</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>All categories verified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Free to browse</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}
