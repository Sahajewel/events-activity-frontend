/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Testimonials.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { useGetPublicTestimonials } from "@/hooks/useReviews";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { getInitials } from "@/lib/utils";

const REVIEWS_PER_PAGE = 3;
const ROTATION_INTERVAL = 6000; // 6 সেকেন্ড

export function Testimonials() {
  const { data: testimonials, isLoading } = useGetPublicTestimonials();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const totalSlides = testimonials
    ? Math.ceil(testimonials.length / REVIEWS_PER_PAGE)
    : 0;

  // 💡 স্লাইড পরিবর্তন করার optimized ফাংশন
  const navigateSlide = useCallback(
    (dir: "next" | "prev") => {
      setDirection(dir === "next" ? "right" : "left");

      setCurrentIndex((prevIndex) => {
        if (dir === "next") {
          return (prevIndex + 1) % totalSlides;
        } else {
          return (prevIndex - 1 + totalSlides) % totalSlides;
        }
      });
    },
    [totalSlides]
  );

  // 💡 Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        navigateSlide("prev");
        setIsPaused(true);
      } else if (e.key === "ArrowRight") {
        navigateSlide("next");
        setIsPaused(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateSlide]);

  // 💡 Auto-play logic
  useEffect(() => {
    if (!isPaused && testimonials && testimonials.length > REVIEWS_PER_PAGE) {
      const interval = setInterval(() => {
        navigateSlide("next");
      }, ROTATION_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [testimonials, isPaused, navigateSlide]);

  if (isLoading) {
    return (
      <section className="py-20 bg-background flex justify-center items-center min-h-[600px]">
        <LoadingSpinner />
      </section>
    );
  }

  if (!testimonials || testimonials.length < REVIEWS_PER_PAGE) {
    return null;
  }

  const startIndex = currentIndex * REVIEWS_PER_PAGE;
  const displayTestimonials = testimonials.slice(
    startIndex,
    startIndex + REVIEWS_PER_PAGE
  );

  // 💡 Progress bar calculation
  const progressPercentage = ((currentIndex + 1) / totalSlides) * 100;

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            What People Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy members who found their community
          </p>
        </div>

        {/* Main Carousel Container */}
        <div className="relative">
          {/* Reviews Grid with Smooth Transition */}
          <div
            className="relative min-h-[420px] mb-8"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              key={currentIndex}
              className={`grid md:grid-cols-3 gap-6 transition-all duration-700 ease-out
                ${
                  direction === "right"
                    ? "animate-slide-in-right"
                    : "animate-slide-in-left"
                }
              `}
            >
              {displayTestimonials.map((testimonial: any, idx: number) => (
                <div
                  key={testimonial.id}
                  className="bg-card border border-border/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30"
                  style={{
                    animationDelay: `${idx * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                    opacity: 0,
                  }}
                >
                  {/* Quote Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <Quote className="h-10 w-10 text-primary/70" />
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (testimonial.rating || 5)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-muted-foreground mb-6 italic line-clamp-4 min-h-[96px] text-sm leading-relaxed">
                    {testimonial.comment ||
                      "Great experience! I highly recommend it."}
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                      <AvatarImage
                        src={testimonial.user.profileImage}
                        alt={testimonial.user.fullName}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(testimonial.user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {testimonial.user.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {testimonial.event?.name || "Community Member"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4">
            {/* Previous Button */}
            <button
              onClick={() => navigateSlide("prev")}
              className="group p-3 bg-background border-2 border-border rounded-full shadow-md hover:shadow-xl hover:border-primary hover:bg-primary/5 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous testimonials"
              disabled={totalSlides <= 1}
            >
              <ChevronLeft className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center gap-2 px-4">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? "right" : "left");
                    setCurrentIndex(index);
                    setIsPaused(true);
                  }}
                  className={`relative h-2 rounded-full transition-all duration-300 hover:scale-110 ${
                    currentIndex === index
                      ? "w-8 bg-primary shadow-lg shadow-primary/50"
                      : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {currentIndex === index && !isPaused && (
                    <div
                      className="absolute inset-0 bg-primary/30 rounded-full animate-pulse"
                      style={{ animationDuration: `${ROTATION_INTERVAL}ms` }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => navigateSlide("next")}
              className="group p-3 bg-background border-2 border-border rounded-full shadow-md hover:shadow-xl hover:border-primary hover:bg-primary/5 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next testimonials"
              disabled={totalSlides <= 1}
            >
              <ChevronRight className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="group p-3 bg-background border-2 border-border rounded-full shadow-md hover:shadow-xl hover:border-primary hover:bg-primary/5 transition-all duration-300 ml-2"
              aria-label={isPaused ? "Resume auto-play" : "Pause auto-play"}
            >
              {isPaused ? (
                <Play className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
              ) : (
                <Pause className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
              )}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              {currentIndex + 1} / {totalSlides}
            </p>
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-center text-xs text-muted-foreground mt-6 opacity-60">
          Use arrow keys or hover to pause • Auto-advances every{" "}
          {ROTATION_INTERVAL / 1000}s
        </p>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.7s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.7s ease-out;
        }
      `}</style>
    </section>
  );
}
