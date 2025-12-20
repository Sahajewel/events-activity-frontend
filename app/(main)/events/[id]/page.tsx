/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useEvent } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  ArrowLeft,
  Clock,
  Share2,
  Heart,
  Info,
  MapPinned,
  User,
  Sparkles,
} from "lucide-react";
import { formatDateTime, getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { useCreateBooking } from "@/hooks/useBooking";
import { BookingForm } from "@/components/booking/BookingForm";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { data: event, isLoading } = useEvent(eventId);
  const { user, isAuthenticated } = useAuth();
  const createBooking = useCreateBooking();
  const [joining, setJoining] = useState(false);

  const bookedCount =
    event?.bookings
      ?.filter((b: any) => b.status === "CONFIRMED" || b.status === "PENDING")
      .reduce((sum: number, b: any) => sum + (b.quantity || 1), 0) || 0;

  const spotsLeft = event ? event.maxParticipants - bookedCount : 0;
  const isFull = event?.status === "FULL" || spotsLeft <= 0;
  const isHost = user?.id === event?.hostId;
  const userBooking = event?.bookings?.find((b: any) => b.userId === user?.id);
  const hasJoined = !!userBooking;
  const canReview = userBooking?.status === "CONFIRMED";
  const fillPercentage = event
    ? (bookedCount / event.maxParticipants) * 100
    : 0;

  const handleJoinEvent = async (quantity: number, couponCode?: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to join this event");
      router.push("/login");
      return;
    }

    setJoining(true);
    try {
      const bookingData: any = { eventId, quantity };
      if (couponCode) bookingData.couponCode = couponCode;

      await createBooking.mutateAsync(bookingData);

      toast.success(
        `Successfully booked ${quantity} ${
          quantity === 1 ? "spot" : "spots"
        }! 🎉`
      );
      setTimeout(() => router.push("/my-bookings"), 1500);
    } catch (error: any) {
      setJoining(false);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoadingSpinner className="flex-1" />
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The event you're looking for doesn't exist or has been removed
              </p>
              <Link href="/events">
                <Button>Browse Events</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar></Navbar>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
        {/* Hero Image Section */}
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Calendar className="h-24 w-24 md:h-32 md:w-32 text-primary/40" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

          {/* Top Actions Bar */}
          <div className="absolute top-0 inset-x-0 p-4 md:p-6 flex items-center justify-between z-10">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.back()}
              className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 shadow-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 shadow-lg"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 shadow-lg"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bottom Content */}
          <div className="absolute bottom-0 inset-x-0 p-4 md:p-8 space-y-4">
            <div className="container mx-auto max-w-7xl">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-white/95 dark:bg-gray-900/95 text-foreground backdrop-blur-sm text-sm px-3 py-1">
                  {event.type}
                </Badge>
                {isFull && (
                  <Badge
                    variant="destructive"
                    className="backdrop-blur-sm text-sm px-3 py-1"
                  >
                    Event Full
                  </Badge>
                )}
                {event.joiningFee === 0 && (
                  <Badge className="bg-green-500 text-white backdrop-blur-sm text-sm px-3 py-1">
                    Free Event
                  </Badge>
                )}
                {fillPercentage >= 80 && !isFull && (
                  <Badge className="bg-orange-500 text-white backdrop-blur-sm text-sm px-3 py-1 animate-pulse">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Filling Fast
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl leading-tight">
                {event.name}
              </h1>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mt-4 text-white/90">
                <div className="flex items-center gap-2 backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-full">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-full">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {bookedCount}/{event.maxParticipants} Joined
                  </span>
                </div>
                <div className="flex items-center gap-2 backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-full">
                  <MapPinned className="h-4 w-4" />
                  <span className="text-sm font-medium">{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Info Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-medium">
                        Date
                      </p>
                      <p className="text-sm font-bold truncate">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-green-500 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-medium">
                        Time
                      </p>
                      <p className="text-sm font-bold">
                        {new Date(event.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-medium">
                        Attendees
                      </p>
                      <p className="text-sm font-bold">
                        {bookedCount}/{event.maxParticipants}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <Star className="h-6 w-6 text-orange-500 dark:text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-medium">
                        Spots Left
                      </p>
                      <p className="text-sm font-bold">{spotsLeft}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* About Section */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    About This Event
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </CardContent>
              </Card>

              {/* Event Details Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date & Time */}
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-1 text-foreground">
                        Date & Time
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(event.date)}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-100 dark:border-green-900/50">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-green-500 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-1 text-foreground">
                        Location
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.location}
                      </p>
                    </div>
                  </div>

                  {/* Participants Progress */}
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-100 dark:border-purple-900/50">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-2 text-foreground">
                        Participants
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-bold text-foreground">
                            {bookedCount} / {event.maxParticipants}
                          </span>
                        </div>
                        <div className="w-full bg-muted dark:bg-muted/50 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              fillPercentage >= 90
                                ? "bg-gradient-to-r from-red-500 to-red-600"
                                : fillPercentage >= 70
                                ? "bg-gradient-to-r from-orange-500 to-orange-600"
                                : "bg-gradient-to-r from-purple-500 to-pink-600"
                            }`}
                            style={{
                              width: `${Math.min(fillPercentage, 100)}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {spotsLeft > 0
                            ? `${spotsLeft} spots remaining`
                            : "Event is full"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Host Section */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Meet Your Host</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/profile/${event.host.id}`}>
                    <div className="flex items-center gap-4 p-4 hover:bg-muted/50 rounded-xl transition-colors group">
                      <Avatar className="h-16 w-16 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                        <AvatarImage
                          src={event.host.profileImage}
                          alt={event.host.fullName}
                        />
                        <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-purple-600 text-white">
                          {getInitials(event.host.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {event.host.fullName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Event Organizer
                        </p>
                        {event.host.averageRating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="text-sm font-medium">
                              {event.host.averageRating}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              rating
                            </span>
                          </div>
                        )}
                      </div>
                      <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - Booking Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                <BookingForm
                  event={event}
                  isHost={isHost}
                  hasJoined={hasJoined}
                  isFull={isFull}
                  spotsLeft={spotsLeft}
                  joining={joining}
                  onJoinEvent={handleJoinEvent}
                />

                {/* Review Button */}
                {canReview && (
                  <ReviewDialog eventId={event.id} hostId={event.hostId} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
