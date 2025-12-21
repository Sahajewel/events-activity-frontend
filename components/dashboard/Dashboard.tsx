/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Booking } from "@/types";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Eye,
  Star,
  Ticket,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency, formatDate } from "@/lib/utils";
import { api } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

export function UserDashboard() {
  const {
    data: bookings,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const response = await api.get<{ data: Booking[] }>(
        "/bookings/my-bookings"
      );
      return response.data.data;
    },
    refetchInterval: 30000, // ✅ Auto refetch every 30 seconds
    refetchOnWindowFocus: true, // ✅ Refetch when window focus
  });

  const upcomingBookings = bookings?.filter(
    (b) => b.status !== "CANCELLED" && new Date(b.event!.date) > new Date()
  );
  const pastBookings = bookings?.filter(
    (b) => new Date(b.event!.date) <= new Date()
  );
  const cancelledBookings = bookings?.filter(
    (b: any) => b.status === "CANCELLED"
  );

  const totalSpent =
    bookings?.reduce((sum: any, b: any) => sum + b.amount, 0) || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Bookings",
      value: bookings?.length || 0,
      icon: Ticket,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/10",
    },
    {
      title: "Upcoming Events",
      value: upcomingBookings?.length || 0,
      icon: Calendar,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-500/10 to-green-600/10",
    },
    {
      title: "Past Events",
      value: pastBookings?.length || 0,
      icon: Clock,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-500/10 to-purple-600/10",
    },
    {
      title: "Total Spent",
      value: formatCurrency(totalSpent),
      icon: TrendingUp,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-500/10 to-orange-600/10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              My Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your event bookings and experiences
            </p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <Link href="/events">
            <Button size="lg" className="gap-2 shadow-lg w-full md:w-auto">
              <Calendar className="h-5 w-5" />
              Browse Events
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {statsCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card
                key={idx}
                className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <CardHeader className="pb-2 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg mb-2`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-xl md:text-3xl font-bold">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bookings Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-full md:max-w-md h-auto">
            <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
              Upcoming
              {upcomingBookings && upcomingBookings.length > 0 && (
                <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                  {upcomingBookings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="past" className="text-xs sm:text-sm">
              Past
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs sm:text-sm">
              Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings && upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking: any) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card className="border-2 border-dashed">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No Upcoming Events
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Start exploring amazing events and create unforgettable
                    memories
                  </p>
                  <Link href="/events">
                    <Button size="lg" className="gap-2">
                      Browse Events
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings && pastBookings.length > 0 ? (
              pastBookings.map((booking: any) => (
                <BookingCard key={booking.id} booking={booking} isPast />
              ))
            ) : (
              <Card className="border-2 border-dashed">
                <CardContent className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No past events yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledBookings && cancelledBookings.length > 0 ? (
              cancelledBookings.map((booking: any) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card className="border-2 border-dashed">
                <CardContent className="text-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-muted-foreground">No cancelled bookings</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  isPast,
}: {
  booking: Booking;
  isPast?: boolean;
}) {
  const event = booking.event!;

  const statusConfig = {
    CONFIRMED: {
      variant: "default" as const,
      icon: CheckCircle2,
      label: "Confirmed",
    },
    CANCELLED: {
      variant: "destructive" as const,
      icon: XCircle,
      label: "Cancelled",
    },
    COMPLETED: {
      variant: "secondary" as const,
      icon: CheckCircle2,
      label: "Completed",
    },
  };

  const status =
    statusConfig[booking.status as keyof typeof statusConfig] ||
    statusConfig.CONFIRMED;
  const StatusIcon = status.icon;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:border-primary/50">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Event Image */}
          <div className="relative w-full md:w-32 h-48 md:h-32 shrink-0 rounded-xl overflow-hidden">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                <Calendar className="h-10 w-10 text-primary" />
              </div>
            )}
            <Badge
              className="absolute top-2 right-2 shadow-lg"
              variant="secondary"
            >
              {event.type}
            </Badge>
          </div>

          {/* Event Details */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="flex-1">
                <Link href={`/events/${event.id}`}>
                  <h3 className="text-lg md:text-xl font-bold hover:text-primary transition-colors line-clamp-1 group-hover:underline">
                    {event.name}
                  </h3>
                </Link>
              </div>
              <Badge variant={status.variant} className="gap-1 w-fit">
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-500" />
                </div>
                <span className="truncate">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-green-500" />
                </div>
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t">
              <div>
                <span className="text-sm text-muted-foreground">
                  Amount Paid:{" "}
                </span>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(booking.amount)}
                </span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link
                  href={`/events/${event.id}`}
                  className="flex-1 sm:flex-none"
                >
                  <Button variant="outline" size="sm" className="gap-2 w-full">
                    <Eye className="h-4 w-4" />
                    Details
                  </Button>
                </Link>
                {/* {isPast && booking.status === "COMPLETED" && (
                  <Button size="sm" className="gap-2 flex-1 sm:flex-none">
                    <Star className="h-4 w-4" />
                    Review
                  </Button>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
