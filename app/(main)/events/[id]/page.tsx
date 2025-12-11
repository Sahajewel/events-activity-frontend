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
  DollarSign,
  Star,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit,
  Share2,
  Heart,
  Info,
} from "lucide-react";
import { formatDateTime, formatCurrency, getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { useCreateBooking } from "@/hooks/useBooking";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { data: event, isLoading } = useEvent(eventId);
  const { user, isAuthenticated } = useAuth();
  const createBooking = useCreateBooking();
  const [joining, setJoining] = useState(false);

  const bookedCount =
    event?.bookings?.filter((b: any) => b.status === "CONFIRMED").length || 0;
  const spotsLeft = event ? event.maxParticipants - bookedCount : 0;
  const isFull = event?.status === "FULL" || spotsLeft <= 0;
  const isHost = user?.id === event?.hostId;
  const userBooking = event?.bookings?.find((b: any) => b.userId === user?.id);
  const hasJoined = !!userBooking;
  const canReview = userBooking?.status === "CONFIRMED";

  const handleJoinEvent = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to join this event");
      router.push("/login");
      return;
    }

    setJoining(true);
    try {
      await createBooking.mutateAsync(eventId);
      toast.success("You have successfully joined this event! 🎉");
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
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Navbar />

      {/* Hero Image Section */}
      <div className="relative h-64 md:h-96 lg:h-[500px] w-full">
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
            <Calendar className="h-24 w-24 md:h-32 md:w-32 text-primary/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Header Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-8">
          {/* Top Bar */}
          <div className="flex items-start justify-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.back()}
              className="backdrop-blur-sm bg-white/90 hover:bg-white shadow-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="backdrop-blur-sm bg-white/90 hover:bg-white shadow-lg"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="backdrop-blur-sm bg-white/90 hover:bg-white shadow-lg"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bottom Content */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white/90 text-foreground backdrop-blur-sm">
                {event.type}
              </Badge>
              {isFull && (
                <Badge variant="destructive" className="backdrop-blur-sm">
                  Event Full
                </Badge>
              )}
              {event.joiningFee === 0 && (
                <Badge className="bg-green-500 text-white backdrop-blur-sm">
                  Free Event
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
              {event.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Info Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium truncate">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="text-sm font-medium">
                      {new Date(event.date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Attendees</p>
                    <p className="text-sm font-medium">
                      {bookedCount}/{event.maxParticipants}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-sm font-medium">
                      {event.joiningFee === 0
                        ? "Free"
                        : formatCurrency(event.joiningFee)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  About This Event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium mb-1">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium mb-1">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(event.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium mb-1">Participants</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-background rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              (bookedCount / event.maxParticipants) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {bookedCount} / {event.maxParticipants}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Host Section */}
            <Card>
              <CardHeader>
                <CardTitle>Meet Your Host</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/profile/${event.host.id}`}>
                  <div className="flex items-center gap-4 p-4 hover:bg-muted/50 rounded-lg transition-colors">
                    <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                      <AvatarImage
                        src={event.host.profileImage}
                        alt={event.host.fullName}
                      />
                      <AvatarFallback className="text-lg font-semibold">
                        {getInitials(event.host.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">
                        {event.host.fullName}
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
                    <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <Card className="shadow-xl">
                <CardContent className="p-6 space-y-6">
                  {/* Price */}
                  <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl">
                    <p className="text-4xl font-bold text-primary mb-1">
                      {event.joiningFee === 0
                        ? "Free"
                        : formatCurrency(event.joiningFee)}
                    </p>
                    <p className="text-sm text-muted-foreground">per person</p>
                  </div>

                  <Separator />

                  {/* Status Info */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Status
                      </span>
                      <Badge variant={isFull ? "destructive" : "default"}>
                        {isFull ? "Full" : "Available"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Spots Left
                      </span>
                      <span className="font-semibold text-lg">{spotsLeft}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  {isHost ? (
                    <Link href={`/events/${event.id}/edit`}>
                      <Button className="w-full h-12 gap-2 shadow-lg" size="lg">
                        <Edit className="h-5 w-5" />
                        Edit Event
                      </Button>
                    </Link>
                  ) : hasJoined ? (
                    <Button className="w-full h-12" disabled size="lg">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Already Joined
                    </Button>
                  ) : isFull ? (
                    <Button
                      className="w-full h-12"
                      disabled
                      variant="secondary"
                      size="lg"
                    >
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Event Full
                    </Button>
                  ) : (
                    <Button
                      className="w-full h-12 gap-2 shadow-lg hover:shadow-xl transition-all"
                      disabled={joining}
                      onClick={handleJoinEvent}
                      size="lg"
                    >
                      {joining ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Joining...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-5 w-5" />
                          Join Event
                        </>
                      )}
                    </Button>
                  )}

                  {/* Review Button */}
                  {canReview && (
                    <ReviewDialog eventId={event.id} hostId={event.hostId} />
                  )}

                  {/* Trust Badges */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Secure booking</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Instant confirmation</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>24/7 support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
