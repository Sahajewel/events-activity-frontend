"use client";

import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { EventCard } from "@/components/events/EventsCards";
import { api } from "@/hooks/useAuth";

export function HostDashboard() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["my-hosted-events"],
    queryFn: async () => {
      const response = await api.get<{ data: Event[] }>("/events/my-hosted");
      return response.data.data;
    },
  });

  const upcomingEvents = events?.filter(
    (e) => new Date(e.date) > new Date() && e.status === "OPEN"
  );
  const totalBookings =
    events?.reduce((sum, e) => sum + (e._count?.bookings || 0), 0) || 0;
  const totalRevenue =
    events?.reduce((sum, e) => {
      const bookings = e._count?.bookings || 0;
      return sum + e.joiningFee * bookings;
    }, 0) || 0;

  if (isLoading) {
    return <LoadingSpinner className="py-20" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Host Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your events and bookings
          </p>
        </div>
        <Link href="/events/create">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{events?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {upcomingEvents?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Your Events</h2>
        {events && events.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border rounded-xl">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">No Events Created</h3>
            <p className="text-muted-foreground mb-4">
              Start hosting events and grow your community
            </p>
            <Link href="/events/create">
              <Button>Create Your First Event</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
