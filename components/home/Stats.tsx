"use client";

import React from "react";
import { Users, Calendar, TrendingUp, DollarSign } from "lucide-react";
import { usePublicStats } from "@/hooks/useAdmin";
import { LoadingSpinner } from "../shared/LoadingSpinner";

export function Stats() {
  const { data: statsData, isLoading } = usePublicStats();

  const formatNumber = (num: number): string => {
    if (!num || num === 0) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatRevenue = (amount: number): string => {
    if (!amount || amount === 0) return "$0";
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount}`;
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-primary to-purple-600 dark:from-purple-900 dark:via-primary dark:to-purple-900">
        <div className="container mx-auto px-4 flex justify-center items-center min-h-[200px]">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  const stats = statsData || {};

  const statsConfig = [
    {
      icon: Users,
      value: formatNumber(stats.totalUsers || 0) + "+",
      label: "Active Members",
      rawValue: stats.totalUsers || 0,
    },
    {
      icon: Calendar,
      value: formatNumber(stats.totalEvents || 0) + "+",
      label: "Total Events",
      rawValue: stats.totalEvents || 0,
    },
    {
      icon: TrendingUp,
      value: formatNumber(stats.totalBookings || 0) + "+",
      label: "Bookings Made",
      rawValue: stats.totalBookings || 0,
    },
    {
      icon: DollarSign,
      value: formatRevenue(stats.totalRevenue || 0),
      label: "Total Revenue",
      rawValue: stats.totalRevenue || 0,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-purple-600 to-primary dark:from-purple-900 dark:via-purple-800 dark:to-primary relative overflow-hidden">
      {/* Subtle background glows */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white dark:bg-purple-400 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white dark:bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-white/90 dark:text-white/80 text-lg max-w-2xl mx-auto">
            Join our growing community of event enthusiasts
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {statsConfig.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
                  </div>

                  <div className="mb-2">
                    <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
                      {stat.value}
                    </p>
                    <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-white/60 to-transparent transition-all duration-700 rounded-full" />
                  </div>

                  <p className="text-white/90 dark:text-white/80 font-medium text-sm md:text-base">
                    {stat.label}
                  </p>

                  {stat.rawValue >= 1000 && (
                    <p className="text-white/60 dark:text-white/40 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {stat.rawValue.toLocaleString()} exactly
                    </p>
                  )}
                </div>

                {/* Corner glow effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>

        {/* Bottom extra stats */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 px-8 py-4 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-full border border-white/20 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-lg">
                {stats.totalHosts || 0}+
              </span>
              <span className="text-white/80 dark:text-white/70">
                Active Hosts
              </span>
            </div>
            <span className="hidden sm:inline text-white/40">•</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-lg">
                {stats.upcomingEvents || 0}+
              </span>
              <span className="text-white/80 dark:text-white/70">
                Upcoming Events
              </span>
            </div>
          </div>
        </div>

        {/* Live indicator */}
        <div className="mt-8 text-center">
          <p className="text-white/60 dark:text-white/50 text-xs flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live stats • Updated in real-time
          </p>
        </div>
      </div>
    </section>
  );
}
