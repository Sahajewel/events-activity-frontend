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
  TrendingUp,
  Clock,
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
    <Link href={`/events/${event.id}`} className="group block h-full">
      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-52 md:h-56 overflow-hidden flex-shrink-0">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 dark:from-primary/30 dark:via-purple-500/30 dark:to-pink-500/30 flex items-center justify-center">
              <Calendar className="h-20 w-20 text-primary/40 dark:text-primary/60" />
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
            <Badge
              variant="secondary"
              className="backdrop-blur-md bg-white/95 dark:bg-gray-900/95 text-foreground shadow-lg font-medium"
            >
              {event.type}
            </Badge>
            <Badge
              variant={isFull ? "destructive" : "default"}
              className="backdrop-blur-md shadow-lg font-medium"
            >
              {isFull ? "Full" : event.status}
            </Badge>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-3 right-3 z-10">
            <div className="px-3 py-1.5 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">
                {event.joiningFee === 0
                  ? "Free"
                  : formatCurrency(event.joiningFee)}
              </span>
            </div>
          </div>

          {/* Trending Badge (if applicable) */}
          {fillPercentage >= 80 && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
                <TrendingUp className="h-3 w-3" />
                HOT
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 md:p-6 space-y-4 flex-1 flex flex-col">
          {/* Title & Description */}
          <div className="flex-1 min-h-[80px]">
            <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2 leading-tight">
              {event.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Event Info Grid */}
          <div className="space-y-3">
            {/* Date */}
            <div className="flex items-center gap-2.5 text-sm">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium">
                  Date
                </p>
                <p className="text-sm font-semibold truncate">
                  {formatDate(event.date)}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2.5 text-sm">
              <div className="w-9 h-9 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-4 w-4 text-green-500 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium">
                  Location
                </p>
                <p className="text-sm font-semibold truncate">
                  {event.location}
                </p>
              </div>
            </div>

            {/* Participants Progress */}
            <div className="flex items-center gap-2.5 text-sm">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 text-purple-500 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground font-medium">
                    Participants
                  </span>
                  <span className="text-xs font-bold">
                    <span className="text-primary">{bookedCount}</span>
                    <span className="text-muted-foreground">
                      /{event.maxParticipants}
                    </span>
                  </span>
                </div>
                <div className="w-full bg-muted dark:bg-muted/50 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      fillPercentage >= 90
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : fillPercentage >= 70
                        ? "bg-gradient-to-r from-orange-500 to-orange-600"
                        : "bg-gradient-to-r from-primary to-purple-600"
                    }`}
                    style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {spotsLeft > 0 ? `${spotsLeft} spots left` : "Fully booked"}
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {Math.round(fillPercentage)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Host Info */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50 dark:border-border gap-3 mt-auto">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Avatar className="h-9 w-9 ring-2 ring-primary/10 dark:ring-primary/20 flex-shrink-0">
                <AvatarImage
                  src={event?.host?.profileImage}
                  alt={event?.host?.fullName}
                />
                <AvatarFallback className="bg-primary/10 dark:bg-primary/20">
                  <User className="h-4 w-4 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">
                  {event?.host?.fullName}
                </p>
                <p className="text-xs text-muted-foreground">Event Host</p>
              </div>
            </div>

            {/* Status Indicator */}
            {fillPercentage >= 70 && fillPercentage < 90 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/20 flex-shrink-0 border border-orange-500/20">
                <TrendingUp className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
                  Filling Fast
                </span>
              </div>
            )}

            {fillPercentage >= 90 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 dark:bg-red-500/20 flex-shrink-0 border border-red-500/20">
                <Clock className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                <span className="text-xs font-bold text-red-700 dark:text-red-400">
                  Almost Full
                </span>
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
