"use client";

import React, { useState } from "react";
import {
  Search,
  Users,
  Calendar,
  PartyPopper,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      icon: Search,
      title: "Browse Events",
      description: "Discover activities that match your interests in your area",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      hoverColor: "hover:bg-blue-500/20",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-600",
      features: ["50+ events monthly", "Smart filters", "Location-based"],
    },
    {
      icon: Users,
      title: "Connect with People",
      description: "Find like-minded individuals who share your passions",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      hoverColor: "hover:bg-purple-500/20",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-600",
      features: ["10+ members", "Verified profiles", "Chat before meet"],
    },
    {
      icon: Calendar,
      title: "Join & Book",
      description: "Secure your spot and get ready for an amazing experience",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      hoverColor: "hover:bg-green-500/20",
      borderColor: "border-green-500/30",
      textColor: "text-green-600",
      features: ["Instant booking", "Secure payment", "Easy cancellation"],
    },
    {
      icon: PartyPopper,
      title: "Enjoy Together",
      description:
        "Attend events, make memories, and build lasting friendships",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      hoverColor: "hover:bg-orange-500/20",
      borderColor: "border-orange-500/30",
      textColor: "text-orange-600",
      features: ["New experiences", "Real connections", "Lasting memories"],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">
            <CheckCircle2 className="h-4 w-4" />
            Simple 4-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            How It Works
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started is simple. Follow these easy steps to join your next
            adventure.
          </p>
        </div>

        {/* Steps Grid - Desktop & Tablet */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;

            return (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Connector Line - Only show on lg screens between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 -right-4 xl:-right-6 w-8 xl:w-12 z-0">
                    <div className="flex items-center justify-center h-full">
                      <ArrowRight
                        className={`h-6 w-6 transition-all duration-300 ${
                          isActive
                            ? "text-primary scale-110"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Card */}
                <div
                  className={`
                  relative bg-card border-2 rounded-2xl p-6 text-center 
                  transition-all duration-300 h-full flex flex-col
                  ${
                    isActive
                      ? `${step.borderColor} shadow-xl -translate-y-2 scale-105`
                      : "border-border hover:border-primary/20 hover:shadow-lg hover:-translate-y-1"
                  }
                `}
                >
                  {/* Step Number Badge */}
                  <div
                    className={`
                    absolute -top-4 -right-4 w-10 h-10 rounded-full 
                    bg-gradient-to-br ${step.color} 
                    flex items-center justify-center text-white font-bold text-lg shadow-lg
                    transition-transform duration-300
                    ${isActive ? "scale-110" : "group-hover:scale-105"}
                  `}
                  >
                    {index + 1}
                  </div>

                  {/* Icon Container */}
                  <div
                    className={`
                    w-16 h-16 lg:w-20 lg:h-20 rounded-2xl 
                    bg-gradient-to-br ${step.color} 
                    mx-auto mb-6 flex items-center justify-center 
                    shadow-lg transition-all duration-300
                    ${
                      isActive
                        ? "scale-110 shadow-2xl"
                        : "group-hover:scale-105"
                    }
                  `}
                  >
                    <Icon className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-bold mb-3 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground mb-4 flex-grow">
                    {step.description}
                  </p>

                  {/* Features - Show on hover/active */}
                  <div
                    className={`
                    space-y-2 transition-all duration-300 overflow-hidden
                    ${isActive ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
                  `}
                  >
                    <div className="pt-4 border-t border-border/50">
                      {step.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2
                            className={`h-3 w-3 ${step.textColor}`}
                          />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Steps List - Mobile */}
        <div className="md:hidden space-y-4 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;

            return (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 to-transparent" />
                )}

                {/* Card */}
                <div
                  className={`
                    relative bg-card border-2 rounded-2xl p-5 
                    transition-all duration-300
                    ${
                      isActive
                        ? `${step.borderColor} shadow-lg`
                        : "border-border active:border-primary/20"
                    }
                  `}
                  onClick={() => setActiveStep(isActive ? null : index)}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon & Number */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`
                        w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} 
                        flex items-center justify-center shadow-md
                        transition-transform duration-300
                        ${isActive ? "scale-105" : ""}
                      `}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div
                        className={`
                        absolute -top-2 -right-2 w-7 h-7 rounded-full 
                        bg-gradient-to-br ${step.color} 
                        flex items-center justify-center text-white font-bold text-sm shadow-md
                      `}
                      >
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {step.description}
                      </p>

                      {/* Features */}
                      <div
                        className={`
                        space-y-2 transition-all duration-300 overflow-hidden
                        ${
                          isActive
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0"
                        }
                      `}
                      >
                        {step.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                          >
                            <CheckCircle2
                              className={`h-3 w-3 ${step.textColor}`}
                            />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-6 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 border border-primary/20 rounded-2xl">
            <div className="text-center sm:text-left">
              <p className="font-semibold text-foreground mb-1">
                Ready to get started?
              </p>
              <p className="text-sm text-muted-foreground">
                Join thousands of happy members today
              </p>
            </div>
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="gap-2 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto group"
              >
                Start Your Journey
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Free to join</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
