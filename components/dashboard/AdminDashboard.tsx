/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, TrendingUp, Activity, UserCheck } from "lucide-react";
import { api } from "@/hooks/useAuth";
import { toast } from "sonner";

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

  // ৩. রিকোয়েস্ট অ্যাপ্রুভ করার মিউটেশন
  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await api.patch(
        `/admin/host-requests/${requestId}/approve`
      );
      return response.data;
    },
    onSuccess: () => {
      // ডেটা রিফ্রেশ করা
      queryClient.invalidateQueries({ queryKey: ["host-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("User successfully promoted to HOST!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to approve request");
    },
  });

  if (statsLoading || requestsLoading) {
    return <LoadingSpinner className="py-20" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Platform overview and management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.stats.totalUsers || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Hosts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.stats.totalHosts || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.stats.totalEvents || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats?.stats.totalRevenue || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Host Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <CardTitle>Host Membership Requests</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {requests && requests.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">User Details</th>
                    <th className="px-4 py-3 font-semibold">User Message</th>
                    <th className="px-4 py-3 font-semibold text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {requests.map((req: any) => (
                    <tr key={req.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium">{req.user.fullName}</div>
                        <div className="text-xs text-muted-foreground">
                          {req.user.email}
                        </div>
                      </td>
                      <td className="px-4 py-3 italic text-muted-foreground">
                        {req.message || "No message provided"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(req.id)}
                          disabled={approveMutation.isPending}
                        >
                          {approveMutation.isPending
                            ? "Approving..."
                            : "Make Host"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg">
              No pending host requests found.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentBookings?.map((booking: any) => (
                <div
                  key={booking.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{booking.user.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.event.name}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentEvents?.map((event: any) => (
                <div
                  key={event.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-xs text-muted-foreground">
                      by {event.host.fullName}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
