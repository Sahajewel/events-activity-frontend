/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Trash2, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";
import { useDeleteUser, useToggleUserStatus } from "@/hooks/useAdmin";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";

export default function HostManagementPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: hostData, isLoading } = useQuery({
    queryKey: ["admin-hosts", page],
    queryFn: async () => {
      const res = await api.get(`/users?role=HOST&page=${page}&limit=${limit}`);
      return res.data.data;
    },
  });

  const hosts = hostData?.data || [];
  const meta = hostData?.pagination;

  const deleteUser = useDeleteUser();
  const toggleStatus = useToggleUserStatus();

  if (isLoading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-10 px-4 max-w-7xl">
        {/* Header */}
        <Card className="mb-8 border-0 shadow-lg">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-900 dark:to-orange-800 rounded-t-lg p-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Host Board</h1>
                <p className="mt-2 text-white/80">
                  Manage authorized event creators
                </p>
              </div>
              <Badge
                variant="secondary"
                className="text-lg px-6 py-2 bg-white/20 border-white/30"
              >
                Total Hosts: {meta?.total || 0}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Table Card */}
        <Card className="border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">All Hosts</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Host Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hosts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No hosts registered yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  hosts.map((host: any) => (
                    <TableRow
                      key={host.id}
                      className="hover:bg-muted/5 dark:hover:bg-muted/20"
                    >
                      <TableCell className="font-medium">
                        {host.fullName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {host.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            host.isActive
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                          }
                        >
                          {host.isActive ? "Active" : "Suspended"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus.mutate(host.id)}
                          disabled={toggleStatus.isPending}
                        >
                          <ShieldAlert className="h-4 w-4 mr-1" />
                          {host.isActive ? "Suspend" : "Activate"}
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={deleteUser.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Host?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Permanently delete{" "}
                                <strong>{host.fullName}</strong>? This cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => deleteUser.mutate(host.id)}
                              >
                                Delete Permanently
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

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/5">
                <p className="text-sm text-muted-foreground">
                  Page <strong>{page}</strong> of{" "}
                  <strong>{meta.totalPages}</strong>
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(page - 1, 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-3 py-1 bg-amber-600 text-white rounded text-sm font-medium">
                    {page}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= meta.totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Footer />
      </div>
    </div>
  );
}
