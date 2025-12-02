/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import { useEvents } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/EventsCards";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ArrowRight } from "lucide-react";

export function FeaturedEvents() {
  const { data, isLoading } = useEvents({
    limit: 6,
    sortBy: "date",
    sortOrder: "asc",
  });

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover exciting activities happening near you
            </p>
          </div>
          <Link href="/events">
            <Button variant="outline" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner className="py-20" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {!isLoading && data?.data.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No events found. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
