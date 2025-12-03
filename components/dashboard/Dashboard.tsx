"use client";
import { useQuery } from "@tanstack/react-query";
import { Booking } from "@/types";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Clock } from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { formatCurrency, formatDate } from "@/lib/utils";
import { api } from "@/hooks/useAuth";

export function UserDashboard() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const response = await api.get<{ data: Booking[] }>(
        "/bookings/my-bookings"
      );
      return response.data.data;
    },
  });

  const upcomingBookings = bookings?.filter(
    (b) => b.status !== "CANCELLED" && new Date(b.event!.date) > new Date()
  );
  const pastBookings = bookings?.filter(
    (b) => new Date(b.event!.date) <= new Date()
  );

  if (isLoading) {
    return <LoadingSpinner className="py-20" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
        <p className="text-muted-foreground">Manage your event bookings</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{bookings?.length || 0}</div>
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
              {upcomingBookings?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Past Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {pastBookings?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings && upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <div className="text-center py-12 bg-card border rounded-xl">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">No Upcoming Events</h3>
              <p className="text-muted-foreground mb-4">
                Start exploring events to join
              </p>
              <Link href="/events">
                <Button>Browse Events</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings && pastBookings.length > 0 ? (
            pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} isPast />
            ))
          ) : (
            <div className="text-center py-12 bg-card border rounded-xl">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No past events yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {bookings?.filter((b) => b.status === "CANCELLED").length ? (
            bookings
              .filter((b) => b.status === "CANCELLED")
              .map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
          ) : (
            <div className="text-center py-12 bg-card border rounded-xl">
              <p className="text-muted-foreground">No cancelled bookings</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BookingCard({
  booking,
  isPast,
}: {
  booking: Booking;
  isPast?: boolean;
}) {
  const event = booking.event!;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <div className="relative w-32 h-32 shrink-0 rounded-lg overflow-hidden">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/events/${event.id}`}>
                  <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                    {event.name}
                  </h3>
                </Link>
                <Badge variant="outline" className="mt-1">
                  {event.type}
                </Badge>
              </div>
              <Badge
                variant={
                  booking.status === "CONFIRMED"
                    ? "default"
                    : booking.status === "CANCELLED"
                    ? "destructive"
                    : "secondary"
                }
              >
                {booking.status}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="text-sm">
                <span className="text-muted-foreground">Amount Paid: </span>
                <span className="font-semibold">
                  {formatCurrency(booking.amount)}
                </span>
              </div>
              <div className="flex gap-2">
                <Link href={`/events/${event.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                {isPast && booking.status === "COMPLETED" && (
                  <Button size="sm">Leave Review</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
