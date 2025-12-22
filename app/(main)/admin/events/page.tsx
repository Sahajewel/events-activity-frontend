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
import { Card } from "@/components/ui/card";

export default function EventControlPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  // 1. Get Events
  const {
    data: eventData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-events", page],
    queryFn: async () => {
      const res = await api.get(`/events?page=${page}&limit=${limit}`);
      return res.data.data;
    },
  });

  const events = eventData?.data || [];
  const meta = eventData?.pagination;

  // 2. Cancel Event Mutation

  // 3. Delete Event Mutation (The Fix)
  // EventControlPage.tsx e Delete Mutation
  const deleteEvent = useMutation({
    mutationFn: async (eventId: string) => {
      // ❌ Bhul chilo: /admin/events/${eventId}
      // ✅ Sothik: /events/${eventId}
      return await api.delete(`/events/${eventId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event deleted successfully!");
    },
  });

  // EventControlPage.tsx e Cancel (Patch) Mutation
  const cancelEvent = useMutation({
    mutationFn: async (eventId: string) => {
      // Jodi status update er alada route na thake, tobe update route-e patch koren
      return await api.patch(`/events/${eventId}`, { status: "CANCELLED" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event cancelled!");
    },
  });

  if (isLoading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-10 px-4 max-w-7xl">
        <Card className="mb-8 border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-purple-600 p-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Event Moderation
                </h1>
                <p className="mt-2 text-white/80 font-medium">
                  Manage and review all platform events
                </p>
              </div>
              <Badge
                variant="secondary"
                className="text-lg px-6 py-2 bg-white/20 border-white/30 text-white"
              >
                Total Events: {meta?.total || 0}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="border shadow-sm bg-card">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">All Events List</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[300px]">Event Name</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No events found.
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event: any) => (
                    <TableRow
                      key={event.id}
                      className="hover:bg-muted/5 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {event.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {event.host?.fullName || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`
                          ${
                            event.status === "UPCOMING"
                              ? "border-blue-500 text-blue-500"
                              : ""
                          }
                          ${
                            event.status === "CANCELLED"
                              ? "border-red-500 text-red-500"
                              : ""
                          }
                          ${
                            event.status === "ONGOING"
                              ? "border-green-500 text-green-500"
                              : ""
                          }
                        `}
                        >
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelEvent.mutate(event.id)}
                          disabled={
                            cancelEvent.isPending ||
                            event.status === "CANCELLED"
                          }
                        >
                          <Ban className="h-4 w-4 mr-1" /> Cancel
                        </Button>

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
                                This will permanently delete{" "}
                                <strong>{event.name}</strong>. This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => deleteEvent.mutate(event.id)}
                              >
                                {deleteEvent.isPending
                                  ? "Deleting..."
                                  : "Delete Permanently"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {page} of {meta.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= meta.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
      <Footer />
    </div>
  );
}
