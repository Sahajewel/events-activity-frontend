"use client";

import React from "react";
import { Users, Calendar, Star, MapPin } from "lucide-react";

export function Stats() {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Active Members",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Calendar,
      value: "500+",
      label: "Events Monthly",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Star,
      value: "4.8/5",
      label: "Average Rating",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: MapPin,
      value: "15+",
      label: "Cities Covered",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className="py-20 bg-linear-to-br from-primary to-purple-600">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center text-white">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                  <Icon className="h-8 w-8" />
                </div>
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-primary-foreground/80">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
