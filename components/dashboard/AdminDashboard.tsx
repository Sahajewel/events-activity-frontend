/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Calendar,
  Shield,
  Settings,
  ArrowRight,
  DollarSign,
  Crown,
  Activity,
  AlertCircle,
  Clock,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { api } from "@/hooks/useAuth";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export function AdminDashboard() {
  // 1. Fetch Admin Stats (Top Cards & Recent Activity)
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await api.get("/admin/dashboard");
      return response.data.data;
    },
  });

  // 2. Fetch Host Requests for the Badge & Tab
  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ["host-requests"],
    queryFn: async () => {
      const response = await api.get("/admin/host-requests");
      return response.data.data;
    },
  });

  // 3. Fetch Events for Charts
  const { data: rawEventsResponse, isLoading: eventsLoading } = useQuery({
    queryKey: ["all-events-dashboard"],
    queryFn: async () => {
      const response = await api.get("/events?limit=1000");
      return response.data.data;
    },
  });

  // Chart Data Processing
  const { userPieData, eventStatusData } = useMemo(() => {
    const totalUsers = stats?.stats?.totalUsers || 0;
    const totalHosts = stats?.stats?.totalHosts || 0;
    const uData = [
      { name: "Total Users", value: totalUsers },
      { name: "Hosts", value: totalHosts },
    ];

    const events = Array.isArray(rawEventsResponse?.data)
      ? rawEventsResponse.data
      : [];
    const openCount = events.filter((e: any) =>
      ["UPCOMING", "ONGOING", "OPEN"].includes(e.status?.toUpperCase())
    ).length;
    const completedCount = events.filter(
      (e: any) => e.status?.toUpperCase() === "COMPLETED"
    ).length;
    const cancelledCount = events.filter(
      (e: any) => e.status?.toUpperCase() === "CANCELLED"
    ).length;

    const eData = [
      { status: "Open", count: openCount },
      { status: "Completed", count: completedCount },
      { status: "Cancelled", count: cancelledCount },
    ];

    return { userPieData: uData, eventStatusData: eData };
  }, [stats, rawEventsResponse]);

  const PIE_COLORS = ["#3b82f6", "#a855f7"];

  if (statsLoading || eventsLoading || requestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-10">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-primary rounded-lg shadow-lg shadow-primary/20">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                Admin Control Center
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage platform members, events, and monitor performance
            </p>
          </div>
          <Button variant="outline" className="gap-2 shadow-sm">
            <Settings className="h-4 w-4" /> Settings
          </Button>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats?.stats?.totalUsers}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Hosts"
            value={stats?.stats?.totalHosts}
            icon={Shield}
            color="bg-purple-500"
          />
          <StatCard
            title="Active Events"
            value={stats?.stats?.totalEvents}
            icon={Calendar}
            color="bg-green-500"
          />
          <StatCard
            title="Total Revenue"
            value={`$${(stats?.stats?.totalRevenue || 0).toLocaleString()}`}
            icon={DollarSign}
            color="bg-orange-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">User Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userPieData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {userPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Events Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventStatusData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section (Management, Requests, Activity) */}
        <Tabs defaultValue="management" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="requests" className="relative">
              Requests
              {requests?.length > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-2 px-1.5 h-5 min-w-5 justify-center rounded-full"
                >
                  {requests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activities">Activity</TabsTrigger>
          </TabsList>

          {/* TAB 1: MANAGEMENT */}
          <TabsContent value="management" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <ManageCard
                title="Manage Users"
                desc="Verify, suspend, or update platform members"
                count={stats?.stats?.totalUsers}
                icon={Users}
                color="text-blue-500"
                bg="bg-blue-100"
                href="/admin/users"
              />
              <ManageCard
                title="Manage Hosts"
                desc="Oversee event hosts and hosting permissions"
                count={stats?.stats?.totalHosts}
                icon={Shield}
                color="text-purple-500"
                bg="bg-purple-100"
                href="/admin/hosts"
              />
              <ManageCard
                title="Manage Events"
                desc="Review and moderate all platform events"
                count={stats?.stats?.totalEvents}
                icon={Calendar}
                color="text-green-500"
                bg="bg-green-100"
                href="/admin/events"
              />
            </div>
          </TabsContent>

          {/* TAB 2: HOST REQUESTS */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" /> Pending
                  Host Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {requests && requests.length > 0 ? (
                  <div className="space-y-3">
                    {requests.slice(0, 5).map((request: any) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{request.user.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.user.email}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />{" "}
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Link href="/host-requests">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" /> View
                          </Button>
                        </Link>
                      </div>
                    ))}
                    <Link href="/host-requests" className="block mt-4">
                      <Button variant="outline" className="w-full">
                        View All Requests{" "}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No pending requests at the moment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: ACTIVITY */}
          <TabsContent value="activities">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-md flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" /> Recent
                    Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats?.recentBookings?.map((b: any) => (
                    <div
                      key={b.id}
                      className="flex justify-between text-sm border-b pb-2 last:border-0"
                    >
                      <div>
                        <span className="font-semibold">{b.user.fullName}</span>{" "}
                        booked{" "}
                        <span className="text-primary font-medium">
                          {b.event.name}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )) || (
                    <p className="text-center text-muted-foreground py-4">
                      No recent bookings
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-md flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" /> New Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats?.recentEvents?.map((e: any) => (
                    <div
                      key={e.id}
                      className="flex justify-between text-sm border-b pb-2 last:border-0"
                    >
                      <div>
                        <span className="font-semibold">{e.name}</span> by{" "}
                        <span className="text-muted-foreground italic">
                          {e.host.fullName}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {new Date(e.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )) || (
                    <p className="text-center text-muted-foreground py-4">
                      No recent events
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Sub-components
function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-sm overflow-hidden group">
      <CardContent className="p-0 flex items-stretch h-24">
        <div
          className={`${color} w-2 flex-shrink-0 group-hover:w-3 transition-all`}
        />
        <div className="flex-1 flex items-center justify-between px-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <h3 className="text-3xl font-bold tracking-tight">{value || 0}</h3>
          </div>
          <Icon
            className={`h-10 w-10 ${color.replace(
              "bg-",
              "text-"
            )} opacity-10 group-hover:opacity-20 transition-opacity`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ManageCard({ title, desc, count, icon: Icon, color, bg, href }: any) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-muted/50 flex flex-col h-full">
      <CardHeader className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <div
            className={`p-4 rounded-2xl ${bg} group-hover:scale-110 transition-transform`}
          >
            <Icon className={`h-7 w-7 ${color}`} />
          </div>
          <Badge variant="secondary" className="font-bold text-base px-3">
            {count || 0}
          </Badge>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="mt-2 text-sm leading-relaxed">
          {desc}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Link href={href}>
          <Button
            variant="outline"
            className="w-full gap-2 group-hover:bg-primary group-hover:text-white transition-all"
          >
            Open Manager <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
