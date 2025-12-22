/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

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

  // Chart Data based on Main Stats
  const chartData = [
    { name: "Total Events", value: events?.length || 0, fill: "#3b82f6" },
    { name: "Upcoming", value: upcomingEvents?.length || 0, fill: "#10b981" },
    { name: "Total Bookings", value: totalBookings, fill: "#8b5cf6" },
    { name: "Total Revenue", value: totalRevenue, fill: "#f97316" },
  ];

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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-10 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Host Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground font-medium italic">
              Manage your events and grow your community
            </p>
          </div>
          <Link href="/events/create" className="w-full md:w-auto">
            <Button size="lg" className="gap-2 shadow-lg w-full font-bold">
              <Plus className="h-5 w-5" /> Create Event
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
                className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-muted/50 bg-card"
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
                  <CardTitle className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-xl md:text-3xl font-bold mb-1">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-500 font-bold">
                    <TrendingUp className="h-3 w-3" /> {stat.change}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Performance Chart Card */}
        <Card className="border shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">
                Performance Overview
              </CardTitle>
              <CardDescription>
                Visual comparison of your hosting metrics
              </CardDescription>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="currentColor"
                    opacity={0.1}
                  />
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "currentColor", opacity: 0.6 }}
                    dy={10}
                  />
                  <YAxis tickLine={false} axisLine={false} tick={false} />
                  <Tooltip
                    cursor={{ fill: "currentColor", opacity: 0.1 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-card border border-border p-3 rounded-xl shadow-xl">
                            <p className="text-sm font-bold text-foreground mb-1">
                              {payload[0].payload.name}
                            </p>
                            <p className="text-lg font-extrabold text-primary">
                              {payload[0].payload.name === "Total Revenue"
                                ? formatCurrency(payload[0].value as number)
                                : payload[0].value}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={55}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        fillOpacity={0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-muted/50 pb-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Your Hosted Events
            </h2>
            <Badge variant="secondary" className="font-bold px-3 py-1">
              {events?.length} Events
            </Badge>
          </div>

          {events && events.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed bg-muted/20">
              <CardContent className="text-center py-20 text-muted-foreground italic">
                No events found. Start by creating one!
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
    OPEN: { color: "bg-emerald-500", label: "Open" },
    CLOSED: { color: "bg-rose-500", label: "Closed" },
    CANCELLED: { color: "bg-slate-500", label: "Cancelled" },
  };

  const status =
    statusConfig[event.status as keyof typeof statusConfig] ||
    statusConfig.OPEN;

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-muted/40 bg-card/60 backdrop-blur-sm">
      <div className="relative h-52 overflow-hidden">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-muted/50 flex items-center justify-center">
            <Calendar className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge
            className={`${status.color} text-white border-none font-bold shadow-md`}
          >
            {status.label}
          </Badge>
          {isUpcoming && (
            <Badge className="bg-blue-600 text-white border-none font-bold shadow-md">
              Upcoming
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        <Link href={`/events/${event.id}`}>
          <h3 className="font-bold text-xl line-clamp-1 hover:text-primary transition-colors">
            {event.name}
          </h3>
        </Link>
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground bg-muted/30 p-2 rounded-lg">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/10">
            <span className="text-[10px] uppercase font-bold opacity-70 block mb-1">
              Bookings
            </span>
            <p className="text-xl font-bold">{bookingsCount}</p>
          </div>
          <div className="text-center p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
            <span className="text-[10px] uppercase font-bold opacity-70 block mb-1">
              Revenue
            </span>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(revenue)}
            </p>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Link href={`/events/${event.id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full font-semibold"
            >
              View
            </Button>
          </Link>
          <Link href={`/events/${event.id}/edit`} className="flex-1">
            <Button size="sm" className="w-full font-semibold shadow-md">
              Edit
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
