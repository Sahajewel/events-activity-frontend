/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Ban, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function EventControlPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  // ১. ইভেন্ট ডেটা ফেচ করা (Pagination সহ)
  const { data: eventData, isLoading } = useQuery({
    queryKey: ["admin-events", page],
    queryFn: async () => {
      const res = await api.get(`/events?page=${page}&limit=${limit}`);
      return res.data.data;
    },
  });

  const events = eventData?.data || [];
  const meta = eventData?.pagination;

  // ২. ইভেন্ট ক্যান্সেল মিউটেশন
  const cancelEvent = useMutation({
    mutationFn: async (eventId: string) => {
      await api.patch(`/admin/events/${eventId}/status`, {
        status: "CANCELLED",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event cancelled successfully!");
    },
  });

  // ৩. ইভেন্ট ডিলিট মিউটেশন
  const deleteEvent = useMutation({
    mutationFn: async (eventId: string) => {
      await api.delete(`/events/${eventId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event removed permanently!");
    },
  });

  if (isLoading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="container mx-auto py-10 px-4">
      <Navbar></Navbar>
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-12 flex px-4">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Event Moderation</h1>
          <p className="text-primary-foreground/90">
            Manage and review platform activities.
          </p>
        </div>
        <Badge variant="outline" className="text-lg py-1 px-4 text-white">
          Total: {meta?.total || 0} Events
        </Badge>
      </div>

      <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
        {/* Consistent Table Container */}
        <div className="min-h-[600px] flex flex-col justify-between">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Host Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event: any) => (
                <TableRow
                  key={event.id}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <TableCell className="font-semibold">{event.name}</TableCell>
                  <TableCell>{event.host?.fullName || "Unknown"}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        event.status === "UPCOMING"
                          ? "bg-blue-500 text-white"
                          : event.status === "CANCELLED"
                          ? "bg-red-500 text-white"
                          : "bg-green-600 text-white"
                      }
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {/* Cancel Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cancelEvent.mutate(event.id)}
                      disabled={
                        cancelEvent.isPending || event.status === "CANCELLED"
                      }
                    >
                      <Ban className="h-4 w-4 mr-1" />{" "}
                      {cancelEvent.isPending ? "..." : "Cancel"}
                    </Button>

                    {/* 🚀 স্মার্ট ডিলিট মোডাল (AlertDialog) */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deleteEvent.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete <b>{event.name}</b>.
                            All related data and bookings for this event will be
                            lost.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => deleteEvent.mutate(event.id)}
                          >
                            Yes, Delete Permanently
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
              {/* Empty Data Placeholder */}
              {events.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-20 text-muted-foreground italic"
                  >
                    No events available on this page.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Consistent Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/5 mt-auto">
            <div className="text-sm text-muted-foreground">
              Page <b>{page}</b> of <b>{meta?.totalPages || 1}</b>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPage((p) => Math.max(p - 1, 1));
                  window.scrollTo(0, 0);
                }}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <span className="font-bold text-sm bg-primary text-white w-8 h-8 flex items-center justify-center rounded-md">
                {page}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPage((p) => p + 1);
                  window.scrollTo(0, 0);
                }}
                disabled={page >= (meta?.totalPages || 1)}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
