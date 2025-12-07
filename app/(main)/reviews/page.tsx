/* eslint-disable @typescript-eslint/no-explicit-any */
// app/reviews/page.tsx - Update koro

"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUserBookings } from "@/hooks/useEvents";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Star, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReviewsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { data: bookings, isLoading } = useUserBookings();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // ✅ Filter COMPLETED bookings
  const completedBookings =
    bookings?.filter((booking: any) => booking.status === "COMPLETED") || [];

  console.log("All bookings:", bookings);
  console.log("Completed bookings:", completedBookings);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoadingSpinner className="flex-1" />
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">My Reviews</h1>
            <p className="text-primary-foreground/90">
              Review events you&apos;ve attended
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {completedBookings.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Events to Review</h2>
              <p className="text-muted-foreground mb-4">
                You haven&apos;t completed any events yet
              </p>
              <Link href="/events">
                <Button>Browse Events</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedBookings.map((booking: any) => {
                // ✅ Check if user already reviewed this event
                const hasReviewed = booking.event?.reviews?.some(
                  (review: any) => review.userId === user?.id
                );

                return (
                  <Card
                    key={booking.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-1">
                        {booking.event?.name || "Unknown Event"}
                      </CardTitle>
                      <Badge variant="secondary">
                        {booking.event?.type || "Event"}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {booking.event?.date
                              ? formatDate(booking.event.date)
                              : "Date not available"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="line-clamp-1">
                            {booking.event?.location ||
                              "Location not available"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/events/${booking.eventId}`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            className="w-full"
                            size="sm"
                          >
                            View Event
                          </Button>
                        </Link>

                        {/* ✅ Show different button based on review status */}
                        {hasReviewed ? (
                          // ✅ Show "Reviewed" button if already reviewed
                          <Button variant="secondary" size="sm" disabled>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Reviewed
                          </Button>
                        ) : (
                          // ✅ Show "Leave Review" button if NOT reviewed
                          <ReviewDialog
                            eventId={booking.eventId}
                            hostId={booking.event?.hostId}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
