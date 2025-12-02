"use client";

import React from "react";
import Link from "next/link";
import {
  Music,
  Bike,
  Laptop,
  UtensilsCrossed,
  Palette,
  Dumbbell,
} from "lucide-react";

export function Categories() {
  const categories = [
    {
      name: "Music & Concerts",
      icon: Music,
      count: "120+ Events",
      color: "from-pink-500 to-rose-500",
      link: "/events?type=Music",
    },
    {
      name: "Sports & Fitness",
      icon: Dumbbell,
      count: "85+ Events",
      color: "from-green-500 to-emerald-500",
      link: "/events?type=Sports",
    },
    {
      name: "Technology",
      icon: Laptop,
      count: "95+ Events",
      color: "from-blue-500 to-cyan-500",
      link: "/events?type=Technology",
    },
    {
      name: "Food & Dining",
      icon: UtensilsCrossed,
      count: "70+ Events",
      color: "from-orange-500 to-amber-500",
      link: "/events?type=Food",
    },
    {
      name: "Arts & Culture",
      icon: Palette,
      count: "60+ Events",
      color: "from-purple-500 to-violet-500",
      link: "/events?type=Arts",
    },
    {
      name: "Outdoor & Adventure",
      icon: Bike,
      count: "75+ Events",
      color: "from-teal-500 to-green-500",
      link: "/events?type=Outdoor",
    },
  ];

  return (
    <section className="py-20 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Explore Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find activities that match your interests and passions
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link key={index} href={category.link}>
                <div className="group bg-card border rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                  <div
                    className={`w-16 h-16 rounded-xl bg-linear-to-br ${category.color} mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1 text-sm">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {category.count}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
