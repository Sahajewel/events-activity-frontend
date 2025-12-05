"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Loader2, X } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
// import { useCancelBooking } from "@/hooks/useBookings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import { PaymentDialog } from "@/components/payment/PaymentDialog";
import { Booking, useCancelBooking } from "@/hooks/useBooking";

// import type { Booking } from "@/hooks/useBooking";

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const cancelBooking = useCancelBooking();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const event = booking.event!;
  const isPast = new Date(event.date) < new Date();
  const isCompleted = booking.status === "COMPLETED";
  const canCancel = booking.status === "CONFIRMED" && !isPast;
  const needsPayment = booking.status === "PENDING";

  const handleCancel = async () => {
    await cancelBooking.mutateAsync(booking.id);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-6 flex-col md:flex-row">
            {/* Event Image */}
            <div className="relative w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
              {event.imageUrl ? (
                <Image
                  src={event.imageUrl}
                  alt={event.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Event Details */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-4 flex-wrap">
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
                      : booking.status === "PENDING"
                      ? "secondary"
                      : "outline"
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
                  <span className="truncate">{event.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t flex-wrap gap-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">Amount Paid: </span>
                  <span className="font-semibold">
                    {formatCurrency(booking.amount)}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Link href={`/events/${event.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>

                  {needsPayment && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setShowPaymentDialog(true)}
                    >
                      Pay Now
                    </Button>
                  )}

                  {isCompleted && (
                    <ReviewDialog eventId={event.id} hostId={event.hostId} />
                  )}

                  {canCancel && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this booking? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleCancel}
                            disabled={cancelBooking.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {cancelBooking.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              "Cancel Booking"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {needsPayment && (
        <PaymentDialog
          bookingId={booking.id}
          amount={booking.amount}
          eventName={event.name}
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          onSuccess={() => setShowPaymentDialog(false)}
        />
      )}
    </>
  );
}
