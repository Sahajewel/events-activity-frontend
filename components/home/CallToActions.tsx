"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Users,
  Calendar,
  Star,
  Sparkles,
  Check,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import { usePublicStats } from "@/hooks/useAdmin";

export function CallToAction() {
  const { data: stats } = usePublicStats();
  const [activeFeature, setActiveFeature] = useState(0);

  // 🎯 Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 💡 Format numbers
  const formatNumber = (num: number): string => {
    if (!num) return "0";
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const features = [
    {
      icon: Shield,
      text: "100% Free to Join",
      subtext: "No hidden charges",
    },
    {
      icon: Zap,
      text: "Instant Access",
      subtext: "Start browsing now",
    },
    {
      icon: Star,
      text: "Verified Events",
      subtext: "Safe & secure",
    },
  ];

  const benefits = [
    "Connect with like-minded people",
    "Discover amazing local events",
    "Build lasting friendships",
    "Create unforgettable memories",
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main Content Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 border border-white/20">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-purple-600/20 border border-primary/30 rounded-full text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                <span>
                  Join {formatNumber(stats?.totalUsers || 10000)}+ Members Today
                </span>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground bg-clip-text">
                  Ready to Start Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Journey?
                </span>
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Join thousands of people discovering new experiences and making
                meaningful connections every day.
              </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10 p-4 md:p-6 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 rounded-2xl border border-primary/10">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    {formatNumber(stats?.totalUsers || 10000)}+
                  </p>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Members
                </p>
              </div>

              <div className="text-center border-x border-border/50">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {formatNumber(stats?.totalEvents || 500)}+
                  </p>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Events
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    4.8
                  </p>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Rating
                </p>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Check className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <span className="text-sm md:text-base font-medium text-foreground">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-base md:text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all group bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] duration-500"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/events" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base md:text-lg px-8 py-6 border-2 hover:bg-primary/5 transition-all"
                >
                  Browse Events
                </Button>
              </Link>
            </div>

            {/* Rotating Features */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                const isActive = activeFeature === idx;

                return (
                  <div
                    key={idx}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-500
                      ${
                        isActive
                          ? "bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/50 scale-105"
                          : "bg-background/50 border-border/50 hover:border-primary/30"
                      }
                    `}
                  >
                    <div
                      className={`
                      w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 
                      flex items-center justify-center transition-transform duration-300
                      ${isActive ? "scale-110" : ""}
                    `}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs md:text-sm font-semibold leading-tight">
                        {feature.text}
                      </p>
                      <p className="text-xs text-muted-foreground leading-tight">
                        {feature.subtext}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs md:text-sm text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Secure & private</span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium">
                <strong>{formatNumber(stats?.totalUsers || 10000)}+</strong>{" "}
                people joined this month
              </span>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
