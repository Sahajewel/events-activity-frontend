/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  TrendingUp,
  Shield,
  Settings,
  Eye,
  ArrowRight,
  DollarSign,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Crown,
} from "lucide-react";
import { api } from "@/hooks/useAuth";
import Link from "next/link";

export function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await api.get("/admin/dashboard");
      return response.data.data;
    },
  });

  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ["host-requests"],
    queryFn: async () => {
      const response = await api.get("/admin/host-requests");
      return response.data.data;
    },
  });

  if (statsLoading || requestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Users",
      value: stats?.stats.totalUsers || 0,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/10",
      change: "+12%",
      changeType: "increase" as const,
    },
    {
      title: "Total Hosts",
      value: stats?.stats.totalHosts || 0,
      icon: Shield,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-500/10 to-purple-600/10",
      change: "+8%",
      changeType: "increase" as const,
    },
    {
      title: "Active Events",
      value: stats?.stats.totalEvents || 0,
      icon: Calendar,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-500/10 to-green-600/10",
      change: "+15%",
      changeType: "increase" as const,
    },
    {
      title: "Total Revenue",
      value: `$${(stats?.stats.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-500/10 to-orange-600/10",
      change: "+23%",
      changeType: "increase" as const,
    },
  ];

  const managementCards = [
    {
      title: "Manage Users",
      description: "Verify, suspend, or update platform members",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      href: "/admin/users",
      count: stats?.stats.totalUsers || 0,
    },
    {
      title: "Manage Hosts",
      description: "Oversee event hosts and hosting permissions",
      icon: Shield,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      href: "/admin/hosts",
      count: stats?.stats.totalHosts || 0,
    },
    {
      title: "Manage Events",
      description: "Review and moderate all platform events",
      icon: Calendar,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      href: "/admin/events",
      count: stats?.stats.totalEvents || 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Admin Control Center
              </h1>
            </div>
            <p className="text-muted-foreground">
              Comprehensive platform management and insights
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" size="sm">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
            <Button variant="outline" className="gap-2" size="sm">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activity Log</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl md:text-3xl font-bold mb-1">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500 font-medium">
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">
                      from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="management" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-full md:max-w-md h-auto">
            <TabsTrigger value="management" className="text-xs sm:text-sm">
              Management
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-xs sm:text-sm">
              Requests
              {requests?.length > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-2 px-1.5 py-0 text-xs"
                >
                  {requests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activities" className="text-xs sm:text-sm">
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-6 mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {managementCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <Card
                    key={idx}
                    className="group hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          <Icon className={`h-6 w-6 ${card.color}`} />
                        </div>
                        <Badge variant="secondary">{card.count}</Badge>
                      </div>
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                      <CardDescription>{card.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={card.href}>
                        <Button
                          className="w-full gap-2 group-hover:gap-3 transition-all"
                          variant="outline"
                        >
                          Open Manager
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Host Requests Tab */}
          <TabsContent value="requests" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      Pending Host Requests
                    </CardTitle>
                    <CardDescription>
                      Review and approve user requests to become hosts
                    </CardDescription>
                  </div>
                  {requests?.length > 0 && (
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {requests.length}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {requests && requests.length > 0 ? (
                  <div className="space-y-3">
                    {requests.slice(0, 5).map((request: any) => (
                      <div
                        key={request.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{request.user.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.user.email}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link href="/host-requests">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    <Link href="/host-requests">
                      <Button variant="outline" className="w-full mt-2">
                        View All Requests
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

          {/* Activity Tab */}
          <TabsContent value="activities" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Recent Bookings
                  </CardTitle>
                  <CardDescription>Latest booking activities</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.recentBookings?.length > 0 ? (
                    <div className="space-y-3">
                      {stats.recentBookings.map((b: any) => (
                        <div
                          key={b.id}
                          className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {b.user.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              booked{" "}
                              <span className="font-medium">
                                {b.event.name}
                              </span>
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No recent bookings
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* New Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    New Events
                  </CardTitle>
                  <CardDescription>Recently created events</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.recentEvents?.length > 0 ? (
                    <div className="space-y-3">
                      {stats.recentEvents.map((e: any) => (
                        <div
                          key={e.id}
                          className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {e.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              by{" "}
                              <span className="font-medium">
                                {e.host.fullName}
                              </span>
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {new Date(e.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No recent events
                    </div>
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
