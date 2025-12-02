"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Users } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-purple-50 to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Never Miss an Event{" "}
                <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Find Your Crew
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Connect with like-minded people for concerts, sports, hiking,
                and more. Because experiences are better when shared.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/events">
                <Button size="lg" className="gap-2">
                  <Search className="h-5 w-5" />
                  Explore Events
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="gap-2">
                  <Users className="h-5 w-5" />
                  Join Community
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-primary">10K+</p>
                <p className="text-sm text-muted-foreground">Active Members</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Events Monthly</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">4.8★</p>
                <p className="text-sm text-muted-foreground">User Rating</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-48 rounded-2xl bg-linear-to-br from-blue-400 to-blue-600 p-6 text-white shadow-xl">
                  <Calendar className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-2">Music Concert</h3>
                  <p className="text-sm text-blue-50">50 people joined</p>
                </div>
                <div className="h-40 rounded-2xl bg-linear-to-br from-green-400 to-green-600 p-6 text-white shadow-xl">
                  <Users className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold">Hiking Trip</h3>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-40 rounded-2xl bg-linear-to-br from-purple-400 to-purple-600 p-6 text-white shadow-xl">
                  <Search className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold">Tech Meetup</h3>
                </div>
                <div className="h-48 rounded-2xl bg-linear-to-br from-orange-400 to-orange-600 p-6 text-white shadow-xl">
                  <Calendar className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-2">Food Festival</h3>
                  <p className="text-sm text-orange-50">This Weekend</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
