/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Users,
  Calendar,
  TrendingUp,
  Activity,
  UserCheck,
  Settings,
  Shield,
  Eye,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { api } from "@/hooks/useAuth";
import { toast } from "sonner";
import Link from "next/link";

export function AdminDashboard() {
  const queryClient = useQueryClient();

  // ১. ড্যাশবোর্ড স্ট্যাটাস ফেচ করা
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await api.get("/admin/dashboard");
      return response.data.data;
    },
  });

  // ২. পেন্ডিং হোস্ট রিকোয়েস্ট ফেচ করা
  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ["host-requests"],
    queryFn: async () => {
      const response = await api.get("/admin/host-requests");
      return response.data.data;
    },
  });

  if (statsLoading || requestsLoading) {
    return <LoadingSpinner className="py-20" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Control Center</h1>
          <p className="text-muted-foreground">
            Comprehensive platform management and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" /> System Settings
          </Button>
        </div>
      </div>

      {/* Stats Grid - Visual Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Users",
            val: stats?.stats.totalUsers,
            icon: Users,
            color: "text-blue-500",
          },
          {
            title: "Total Hosts",
            val: stats?.stats.totalHosts,
            icon: Shield,
            color: "text-purple-500",
          },
          {
            title: "Total Events",
            val: stats?.stats.totalEvents,
            icon: Calendar,
            color: "text-green-500",
          },
          {
            title: "Total Revenue",
            val: `$${stats?.stats.totalRevenue.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-orange-500",
          },
        ].map((item, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.val || 0}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🚀 SMART Management Section with Tabs */}
      <Tabs defaultValue="management" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="requests">Host Requests</TabsTrigger>
          <TabsTrigger value="activities">Recent Activity</TabsTrigger>
        </TabsList>

        {/* --- Management Tab --- */}
        <TabsContent value="management" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:border-primary/50 cursor-pointer transition-all">
              <CardHeader>
                <Users className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>
                  Verify, suspend, or update platform members.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/admin/users">Open User Manager</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 cursor-pointer transition-all">
              <CardHeader>
                <Shield className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Manage Hosts</CardTitle>
                <CardDescription>
                  Oversee event hosts and hosting permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/admin/hosts">View All Hosts</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 cursor-pointer transition-all">
              <CardHeader>
                <Calendar className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle>Manage Events</CardTitle>
                <CardDescription>
                  Review and moderate all platform events.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/admin/events">Event Control</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- Host Requests Tab --- */}
        <TabsContent value="requests" className="mt-6">
          {/* আপনার আগের হোস্ট রিকোয়েস্ট টেবিল কোডটি এখানে বসিয়ে দিন */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Memberships</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-10 text-muted-foreground">
              {requests?.length > 0
                ? "You have pending requests to approve."
                : "No pending requests."}
              <br />
              <Button className="mt-4" variant="link">
                Go to Requests Page
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Activity Tab --- */}
        <TabsContent value="activities" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats?.recentBookings.map((b: any) => (
                  <div
                    key={b.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span>
                      {b.user.fullName} booked <b>{b.event.name}</b>
                    </span>
                    <span className="text-xs">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>New Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats?.recentEvents.map((e: any) => (
                  <div
                    key={e.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span>
                      {e.name} by {e.host.fullName}
                    </span>
                    <span className="text-xs">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
