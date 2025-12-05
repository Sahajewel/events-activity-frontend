/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useUserBookings } from "@/hooks";
import { BookingCard } from "@/components/booking/BookingCard";

export default function MyBookingsPage() {
  const { data: bookings, isLoading } = useUserBookings();

  const upcomingBookings = bookings?.filter(
    (b) =>
      (b.status === "CONFIRMED" || b.status === "PENDING") &&
      new Date(b.event!.date) > new Date()
  );

  const pastBookings = bookings?.filter(
    (b) =>
      (b.status === "CONFIRMED" || b.status === "COMPLETED") &&
      new Date(b.event!.date) <= new Date()
  );

  const cancelledBookings = bookings?.filter((b) => b.status === "CANCELLED");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoadingSpinner className="flex-1" />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My Bookings</h1>
            <p className="text-xl text-primary-foreground/90">
              Manage your event bookings
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBookings?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastBookings?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({cancelledBookings?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingBookings && upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking: any) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <EmptyState
                  icon={CalendarIcon}
                  title="No Upcoming Bookings"
                  description="You haven't booked any upcoming events yet"
                  action={
                    <Link href="/events">
                      <Button>Explore Events</Button>
                    </Link>
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastBookings && pastBookings.length > 0 ? (
                pastBookings.map((booking: any) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <EmptyState
                  icon={CalendarIcon}
                  title="No Past Bookings"
                  description="You haven't attended any events yet"
                />
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {cancelledBookings && cancelledBookings.length > 0 ? (
                cancelledBookings.map((booking: any) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <EmptyState
                  icon={CalendarIcon}
                  title="No Cancelled Bookings"
                  description="You haven't cancelled any bookings"
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12 bg-card border rounded-xl">
      <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {action}
    </div>
  );
}
