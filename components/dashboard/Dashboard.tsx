/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  TrendingUp,
  Ticket,
  RefreshCw,
  MapPin,
  Eye,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency, formatDate } from "@/lib/utils";
import { api } from "@/hooks/useAuth";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function UserDashboard() {
  const {
    data: bookings,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const response = await api.get("/bookings/my-bookings");
      return response.data.data;
    },
    refetchInterval: 30000,
  });

  // --- Filtering Logic ---
  const upcoming = bookings?.filter(
    (b: any) => b.status !== "CANCELLED" && new Date(b.event.date) > new Date()
  );
  const past = bookings?.filter(
    (b: any) => b.status !== "CANCELLED" && new Date(b.event.date) <= new Date()
  );
  const cancelled = bookings?.filter((b: any) => b.status === "CANCELLED");
  const totalSpent =
    bookings?.reduce((sum: number, b: any) => sum + b.amount, 0) || 0;

  const bookingPieData = [
    { name: "Upcoming", value: upcoming?.length || 0 },
    { name: "Past", value: past?.length || 0 },
    { name: "Cancelled", value: cancelled?.length || 0 },
  ].filter((d) => d.value > 0);

  const PIE_COLORS = ["#10b981", "#3b82f6", "#ef4444"];

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-10">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              My Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 font-medium">
              Track your event experiences and spending
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="gap-2 bg-background shadow-sm"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
            <Link href="/events" className="flex-1 md:flex-none">
              <Button size="lg" className="gap-2 w-full shadow-lg">
                Browse Events
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Total Bookings"
            value={bookings?.length}
            icon={Ticket}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Upcoming"
            value={upcoming?.length}
            icon={Calendar}
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Past Events"
            value={past?.length}
            icon={Clock}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Total Spent"
            value={formatCurrency(totalSpent)}
            icon={TrendingUp}
            color="from-orange-500 to-orange-600"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pie Chart Card */}
          <Card className="border-muted/60 shadow-sm h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Activity Mix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                {bookingPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bookingPieData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {bookingPieData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm italic">
                    No data to display
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bookings Tabs & List */}
          <Card className="lg:col-span-2 border-muted/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">My Event Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50">
                  <TabsTrigger value="upcoming">
                    Upcoming ({upcoming?.length})
                  </TabsTrigger>
                  <TabsTrigger value="past">Past ({past?.length})</TabsTrigger>
                  <TabsTrigger value="cancelled">
                    Cancelled ({cancelled?.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                  {upcoming && upcoming.length > 0 ? (
                    upcoming.map((booking: any) => (
                      <BookingListItem key={booking.id} booking={booking} />
                    ))
                  ) : (
                    <EmptyState message="No upcoming events found." />
                  )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                  {past && past.length > 0 ? (
                    past.map((booking: any) => (
                      <BookingListItem key={booking.id} booking={booking} />
                    ))
                  ) : (
                    <EmptyState message="You haven't attended any events yet." />
                  )}
                </TabsContent>

                <TabsContent value="cancelled" className="space-y-4">
                  {cancelled && cancelled.length > 0 ? (
                    cancelled.map((booking: any) => (
                      <BookingListItem key={booking.id} booking={booking} />
                    ))
                  ) : (
                    <EmptyState message="No cancelled bookings." />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Internal Helper Components ---

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="hover:shadow-md transition-all border-muted/60">
      <CardHeader className="pb-2 p-4 md:p-6">
        <div
          className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-md mb-2`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <div className="text-xl md:text-2xl font-bold tracking-tight">
          {value || 0}
        </div>
      </CardContent>
    </Card>
  );
}

function BookingListItem({ booking }: { booking: any }) {
  const isCancelled = booking.status === "CANCELLED";

  return (
    <div className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-all">
      <div className="relative w-full sm:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={booking.event.imageUrl || "/api/placeholder/400/320"}
          alt={booking.event.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-base truncate pr-4">
            {booking.event.name}
          </h4>
          <Badge
            variant={isCancelled ? "destructive" : "outline"}
            className="flex-shrink-0"
          >
            {booking.status}
          </Badge>
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            <Calendar className="h-3 w-3" /> {formatDate(booking.event.date)}
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            <MapPin className="h-3 w-3" /> {booking.event.location || "Online"}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="font-semibold text-sm">
            {formatCurrency(booking.amount)}
          </p>
          <Link href={`/events/${booking.event.id}`}>
            <Button size="sm" variant="ghost" className="h-8 gap-2 text-xs">
              <Eye className="h-3.5 w-3.5" /> Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed rounded-xl">
      <Ticket className="h-10 w-10 text-muted-foreground/30 mb-3" />
      <p className="text-muted-foreground text-sm font-medium">{message}</p>
    </div>
  );
}
