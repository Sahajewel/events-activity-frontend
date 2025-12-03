/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { api, useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { EventCard } from "@/components/events/EventsCards";

export default function MyEventsPage() {
  const { user, isAuthenticated } = useAuth();

  const { data: hostedEvents, isLoading: loadingHosted } = useQuery({
    queryKey: ["my-hosted-events"],
    queryFn: async () => {
      const response = await api.get<{ data: Event[] }>("/events/my-hosted");
      return response.data.data;
    },
    enabled:
      isAuthenticated && (user?.role === "HOST" || user?.role === "ADMIN"),
  });

  const { data: bookings, isLoading: loadingBookings } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const response = await api.get("/bookings/my-bookings");
      return response.data.data;
    },
    enabled: isAuthenticated,
  });

  const isLoading = loadingHosted || loadingBookings;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Please Login</h2>
            <p className="text-muted-foreground mb-4">
              You need to login to view your events
            </p>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isHost = user?.role === "HOST" || user?.role === "ADMIN";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">My Events</h1>
                <p className="text-primary-foreground/90">
                  {isHost
                    ? "Manage your hosted and joined events"
                    : "View events you've joined"}
                </p>
              </div>
              {isHost && (
                <Link href="/events/create">
                  <Button variant="secondary" size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Create Event
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <LoadingSpinner className="py-20" />
          ) : (
            <Tabs
              defaultValue={isHost ? "hosted" : "joined"}
              className="space-y-6"
            >
              <TabsList>
                {isHost && (
                  <TabsTrigger value="hosted">Hosted Events</TabsTrigger>
                )}
                <TabsTrigger value="joined">Joined Events</TabsTrigger>
              </TabsList>

              {isHost && (
                <TabsContent value="hosted" className="space-y-6">
                  {hostedEvents && hostedEvents.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {hostedEvents.map((event: any) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-card border rounded-xl">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-semibold mb-2">
                        No Hosted Events
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first event to get started
                      </p>
                      <Link href="/events/create">
                        <Button>Create Event</Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>
              )}

              <TabsContent value="joined" className="space-y-6">
                {bookings && bookings.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking: any) => (
                      <EventCard key={booking.id} event={booking.event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card border rounded-xl">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Joined Events
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Browse events and join ones that interest you
                    </p>
                    <Link href="/events">
                      <Button>Browse Events</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
