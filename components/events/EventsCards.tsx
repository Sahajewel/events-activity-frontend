"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Event } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Calendar, MapPin, Users, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const bookedCount = event._count?.bookings || 0;
  const spotsLeft = event.maxParticipants - bookedCount;
  const isFull = event.status === "FULL" || spotsLeft <= 0;

  return (
    <Link href={`/events/${event.id}`}>
      <div className="group bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
              <Calendar className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge
              variant={
                isFull
                  ? "destructive"
                  : event.status === "OPEN"
                  ? "default"
                  : "secondary"
              }
            >
              {isFull ? "Full" : event.status}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{event.type}</Badge>
            </div>
            <h3 className="text-xl font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {event.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {event.description}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {bookedCount}/{event.maxParticipants} joined
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={event.host.profileImage}
                  alt={event.host.fullName}
                />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{event.host.fullName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                {event.joiningFee === 0
                  ? "Free"
                  : formatCurrency(event.joiningFee)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
