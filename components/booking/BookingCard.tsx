"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Loader2,
  X,
  Eye,
  Star,
  CheckCircle2,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
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

  const statusConfig = {
    CONFIRMED: {
      variant: "default" as const,
      icon: CheckCircle2,
      label: "Confirmed",
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    PENDING: {
      variant: "secondary" as const,
      icon: AlertCircle,
      label: "Payment Pending",
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
    },
    CANCELLED: {
      variant: "destructive" as const,
      icon: X,
      label: "Cancelled",
      color: "text-red-600",
      bgColor: "bg-red-500/10",
    },
    COMPLETED: {
      variant: "outline" as const,
      icon: CheckCircle2,
      label: "Completed",
      color: "text-gray-600",
      bgColor: "bg-gray-500/10",
    },
  };

  const status =
    statusConfig[booking.status as keyof typeof statusConfig] ||
    statusConfig.CONFIRMED;
  const StatusIcon = status.icon;

  const handleCancel = async () => {
    await cancelBooking.mutateAsync(booking.id);
  };

  return (
    <>
      <Card className="group hover:shadow-2xl hover:border-primary/50 transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Event Image */}
            <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0 overflow-hidden">
              {event.imageUrl ? (
                <Image
                  src={event.imageUrl}
                  alt={event.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Calendar className="h-12 w-12 md:h-16 md:w-16 text-primary/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r" />

              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <Badge
                  variant="secondary"
                  className="backdrop-blur-sm bg-white/90 text-foreground shadow-lg"
                >
                  {event.type}
                </Badge>
              </div>
            </div>

            {/* Event Details */}
            <div className="flex-1 p-4 sm:p-5 md:p-6 space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Link href={`/events/${event.id}`}>
                    <h3 className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {event.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event?.description}
                  </p>
                </div>

                <Badge
                  variant={status.variant}
                  className="gap-1.5 self-start whitespace-nowrap"
                >
                  <StatusIcon className="h-3.5 w-3.5" />
                  {status.label}
                </Badge>
              </div>

              {/* Event Info Grid */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Date & Time</p>
                    <p className="text-sm font-medium truncate">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium truncate">
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount Paid</p>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(booking.amount)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <Link
                    href={`/events/${event.id}`}
                    className="flex-1 sm:flex-none"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 w-full"
                    >
                      <Eye className="h-4 w-4" />
                      Details
                    </Button>
                  </Link>

                  {needsPayment && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setShowPaymentDialog(true)}
                      className="gap-2 flex-1 sm:flex-none shadow-lg"
                    >
                      <CreditCard className="h-4 w-4" />
                      Pay Now
                    </Button>
                  )}

                  {isCompleted && (
                    <div className="flex-1 sm:flex-none">
                      <ReviewDialog eventId={event.id} hostId={event.hostId} />
                    </div>
                  )}

                  {canCancel && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-2 flex-1 sm:flex-none"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            Cancel Booking?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="space-y-2">
                            <p>Are you sure you want to cancel this booking?</p>
                            <div className="p-3 bg-muted rounded-lg text-sm">
                              <p className="font-medium text-foreground mb-1">
                                {event.name}
                              </p>
                              <p className="text-muted-foreground">
                                {formatDate(event.date)}
                              </p>
                            </div>
                            <p className="text-xs">
                              This action cannot be undone and you may lose your
                              spot.
                            </p>
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
