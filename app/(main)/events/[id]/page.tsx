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
import { Separator } from "@/components/ui/separator";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Star,
  ArrowLeft,
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
  const [successfullyBooked, setSuccessfullyBooked] = useState(false);
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
  const isBooked = event?.bookings?.some((b: any) => b.userId === user?.id);
  // ... অন্য স্টেটের সাথে এটি যোগ করুন
  const [isJustBooked, setIsJustBooked] = useState(false);
  // ===========================
  // JOIN EVENT — NO PAYMENT
  // ===========================
  const handleJoinEvent = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to join this event");
      router.push("/login");
      return;
    }

    setJoining(true);

    try {
      await createBooking.mutateAsync(eventId);

      // বুকিং সফল হওয়া মাত্র লোকাল স্টেট আপডেট করুন
      setIsJustBooked(true);

      toast.success("You have successfully joined this event!");

      // সামান্য সময় অপেক্ষা করুন যাতে ইউজার বাটন পরিবর্তন দেখতে পায়, তারপর রিডাইরেক্ট
      setTimeout(() => {
        router.push("/my-bookings");
      }, 1500);
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Event not found</h2>
            <p className="text-muted-foreground mb-4">
              The event you're looking for doesn't exist
            </p>
            <Link href="/events">
              <Button>Browse Events</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ---------- HERO IMAGE ---------- */}
      <div className="relative h-96 w-full">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
            <Calendar className="h-32 w-32 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Badge className="mb-2">{event.type}</Badge>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {event.name}
            </h1>
          </div>
        </div>
      </div>

      {/* ---------- CONTENT ---------- */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-card border rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {/* Info */}
            <div className="bg-card border rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Event Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(event.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Participants</p>
                    <p className="text-sm text-muted-foreground">
                      {bookedCount} / {event.maxParticipants} joined
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Price</p>
                    <p className="text-sm text-muted-foreground">
                      {event.joiningFee === 0
                        ? "Free"
                        : formatCurrency(event.joiningFee)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Host */}
            <div className="bg-card border rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Hosted By</h2>
              <Link href={`/profile/${event.host.id}`}>
                <div className="flex items-center gap-4 hover:bg-muted/50 p-4 rounded-lg transition-colors">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={event.host.profileImage}
                      alt={event.host.fullName}
                    />
                    <AvatarFallback>
                      {getInitials(event.host.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      {event.host.fullName}
                    </p>

                    {event.host.averageRating && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span>{event.host.averageRating} rating</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <div className="bg-card border rounded-xl p-6">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-primary">
                    {event.joiningFee === 0
                      ? "Free"
                      : formatCurrency(event.joiningFee)}
                  </p>
                  <p className="text-sm text-muted-foreground">per person</p>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={isFull ? "destructive" : "default"}>
                      {isFull ? "Full" : "Available"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spots Left</span>
                    <span className="font-medium">{spotsLeft}</span>
                  </div>
                </div>

                {/* Host / Already Joined / Join */}
                {/* ডান পাশের বাটনের লজিক অংশটি এইভাবে পরিবর্তন করুন */}

                {/* Host / Already Joined / Join */}
                {/* Host / Already Booked / Join */}
                {isHost ? (
                  <Link href={`/events/${event.id}/edit`}>
                    <Button className="w-full">Edit Event</Button>
                  </Link>
                ) : hasJoined || isBooked ? ( // যদি বুকিং লিস্টে ইউজার আইডি থাকে তবে এটি কাজ করবে
                  <Button
                    className="w-full bg-gray-400 cursor-not-allowed"
                    disabled
                  >
                    Already Booked
                  </Button>
                ) : isFull ? (
                  <Button
                    className="w-full bg-gray-400 cursor-not-allowed"
                    disabled
                  >
                    Event Full
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    disabled={joining}
                    onClick={handleJoinEvent}
                  >
                    {joining ? "Joining..." : "Join Event"}
                  </Button>
                )}
                {/* Review Button */}
                {canReview && (
                  <div className="mt-4">
                    <ReviewDialog eventId={event.id} hostId={event.hostId} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
