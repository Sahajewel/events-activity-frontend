"use client";

import React from "react";
import { Users, Calendar, TrendingUp, DollarSign } from "lucide-react";
import { usePublicStats } from "@/hooks/useAdmin"; // 🔥 Changed from useAdminStats
import { LoadingSpinner } from "../shared/LoadingSpinner";

export function Stats() {
  // 🔥 Use public stats hook instead
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
      <section className="py-20 bg-gradient-to-br from-primary to-purple-600">
        <div className="container mx-auto px-4 flex justify-center items-center min-h-[200px]">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  // 🔥 Direct access - no nested stats object
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
    <section className="py-20 bg-gradient-to-br from-primary via-purple-600 to-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Our Impact in Numbers
          </h2>
          <p className="text-white/80 text-lg">
            Join our growing community of event enthusiasts
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {statsConfig.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
                  </div>

                  <div className="mb-2">
                    <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 tracking-tight">
                      {stat.value}
                    </p>
                    <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-white/60 to-transparent transition-all duration-500 rounded-full" />
                  </div>

                  <p className="text-white/90 font-medium text-sm md:text-base">
                    {stat.label}
                  </p>

                  {stat.rawValue >= 1000 && (
                    <p className="text-white/60 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {stat.rawValue.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full opacity-50" />
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
            <span className="text-white font-medium">
              {stats.totalHosts || 0}+ Active Hosts
            </span>
            <span className="text-white/60 mx-2">•</span>
            <span className="text-white font-medium">
              {stats.upcomingEvents || 0}+ Upcoming Events
            </span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-xs flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live stats • Updated in real-time
          </p>
        </div>
      </div>
    </section>
  );
}
