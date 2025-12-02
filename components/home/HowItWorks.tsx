"use client";

import React from "react";
import { Search, Users, Calendar, PartyPopper } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Browse Events",
      description: "Discover activities that match your interests in your area",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      title: "Connect with People",
      description: "Find like-minded individuals who share your passions",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Calendar,
      title: "Join & Book",
      description: "Secure your spot and get ready for an amazing experience",
      color: "from-green-500 to-green-600",
    },
    {
      icon: PartyPopper,
      title: "Enjoy Together",
      description:
        "Attend events, make memories, and build lasting friendships",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started is simple. Follow these easy steps to join your next
            adventure.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                <div className="bg-card border rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                  <div
                    className={`w-16 h-16 rounded-xl bg-linear-to-br ${step.color} mx-auto mb-4 flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="mb-3 text-2xl font-bold text-primary">
                    {(index + 1).toString().padStart(2, "0")}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/3 -right-4 w-8 text-primary">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
