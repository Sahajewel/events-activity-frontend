"use client";

import Link from "next/link";
import Image from "next/image";
import { Event } from "@/types";
import {
  Calendar,
  MapPin,
  Users,
  User,
  DollarSign,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency, formatDate } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const bookedCount = event._count?.bookings || 0;
  const spotsLeft = event.maxParticipants - bookedCount;
  const isFull = event.status === "FULL" || spotsLeft <= 0;
  const fillPercentage = (bookedCount / event.maxParticipants) * 100;

  return (
    <Link href={`/events/${event.id}`}>
      <div className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Calendar className="h-16 w-16 md:h-20 md:w-20 text-primary/40" />
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            <Badge
              variant="secondary"
              className="backdrop-blur-sm bg-white/90 text-foreground shadow-lg"
            >
              {event.type}
            </Badge>
            <Badge
              variant={isFull ? "destructive" : "default"}
              className="backdrop-blur-sm shadow-lg"
            >
              {isFull ? "Full" : event.status}
            </Badge>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-3 right-3">
            <div className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">
                {event.joiningFee === 0
                  ? "Free"
                  : formatCurrency(event.joiningFee)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 md:p-6 space-y-4 flex-1 flex flex-col">
          {/* Title & Description */}
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2 leading-tight">
              {event.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Event Info */}
          <div className="space-y-2.5">
            {/* Date */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-4 w-4 text-blue-500" />
              </div>
              <span className="text-muted-foreground truncate">
                {formatDate(event.date)}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-4 w-4 text-green-500" />
              </div>
              <span className="text-muted-foreground truncate">
                {event.location}
              </span>
            </div>

            {/* Participants Progress */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 text-purple-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted-foreground text-xs">
                    {bookedCount}/{event.maxParticipants}
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    {spotsLeft} left
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      fillPercentage >= 90
                        ? "bg-red-500"
                        : fillPercentage >= 70
                        ? "bg-orange-500"
                        : "bg-primary"
                    }`}
                    style={{ width: `${fillPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Host Info */}
          <div className="flex items-center justify-between pt-4 border-t border-border gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-primary/10 flex-shrink-0">
                <AvatarImage
                  src={event?.host?.profileImage}
                  alt={event?.host?.fullName}
                />
                <AvatarFallback className="bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium truncate">
                  {event?.host?.fullName}
                </p>
                <p className="text-xs text-muted-foreground">Host</p>
              </div>
            </div>

            {/* Trending Badge */}
            {fillPercentage >= 70 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 flex-shrink-0">
                <TrendingUp className="h-3 w-3 text-orange-500" />
                <span className="text-xs font-medium text-orange-700">Hot</span>
              </div>
            )}
          </div>
        </div>

        {/* Hover Effect Indicator */}
        <div className="h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
    </Link>
  );
}
