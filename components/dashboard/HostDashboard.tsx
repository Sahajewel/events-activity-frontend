/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  BarChart3,
  Star,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/hooks/useAuth";
import { formatCurrency, formatDate } from "@/lib/utils";

export function HostDashboard() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["my-hosted-events"],
    queryFn: async () => {
      const response = await api.get<{ data: Event[] }>("/events/my-hosted");
      return response.data.data;
    },
  });

  const upcomingEvents = events?.filter(
    (e) => new Date(e.date) > new Date() && e.status === "OPEN"
  );
  const totalBookings =
    events?.reduce((sum, e) => sum + (e._count?.bookings || 0), 0) || 0;
  const totalRevenue =
    events?.reduce((sum, e) => {
      const bookings = e._count?.bookings || 0;
      return sum + e.joiningFee * bookings;
    }, 0) || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Events",
      value: events?.length || 0,
      icon: Calendar,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/10",
      change: "+12%",
    },
    {
      title: "Upcoming Events",
      value: upcomingEvents?.length || 0,
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-500/10 to-green-600/10",
      change: "+8%",
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: Ticket,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-500/10 to-purple-600/10",
      change: "+15%",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-500/10 to-orange-600/10",
      change: "+23%",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Host Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Manage your events and grow your community
            </p>
          </div>
          <Link href="/events/create" className="w-full md:w-auto">
            <Button size="lg" className="gap-2 shadow-lg w-full">
              <Plus className="h-5 w-5" />
              Create Event
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
                  <div className="text-xl md:text-3xl font-bold mb-1">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500 font-medium">
                      {stat.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Events Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Events</h2>
            <Button variant="outline" className="gap-2" size="sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">View Analytics</span>
            </Button>
          </div>

          {events && events.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed">
              <CardContent className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Events Created</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Start hosting events and build an amazing community of
                  like-minded people
                </p>
                <Link href="/events/create">
                  <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Create Your First Event
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const bookingsCount = event._count?.bookings || 0;
  const revenue = event.joiningFee * bookingsCount;
  const isUpcoming = new Date(event.date) > new Date();

  const statusConfig = {
    OPEN: { color: "bg-green-500", label: "Open" },
    CLOSED: { color: "bg-red-500", label: "Closed" },
    CANCELLED: { color: "bg-gray-500", label: "Cancelled" },
  };

  const status =
    statusConfig[event.status as keyof typeof statusConfig] ||
    statusConfig.OPEN;

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center">
            <Calendar className="h-16 w-16 text-primary/50" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge className={`${status.color} text-white shadow-lg`}>
            {status.label}
          </Badge>
          {isUpcoming && (
            <Badge className="bg-blue-500 text-white shadow-lg">Upcoming</Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <Link href={`/events/${event.id}`}>
            <h3 className="font-bold text-lg line-clamp-1 hover:text-primary transition-colors group-hover:underline">
              {event.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {event.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-blue-500" />
          </div>
          <span className="truncate">{formatDate(event.date)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Bookings</span>
            </div>
            <p className="text-lg font-bold">{bookingsCount}</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Revenue</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(revenue)}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Link href={`/events/${event.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Eye className="h-4 w-4" />
              View
            </Button>
          </Link>
          <Link href={`/events/${event.id}/edit`} className="flex-1">
            <Button size="sm" className="w-full gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
