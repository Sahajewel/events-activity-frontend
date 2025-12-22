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

export default function UserManagementPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: userData, isLoading } = useQuery({
    queryKey: ["admin-users", page],
    queryFn: async () => {
      const res = await api.get(`/users?role=USER&page=${page}&limit=${limit}`);
      return res.data.data;
    },
  });

  const users = userData?.data || [];
  const meta = userData?.pagination;

  const deleteUser = useDeleteUser();
  const toggleStatus = useToggleUserStatus();

  if (isLoading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-10 px-4 max-w-7xl">
        {/* Header */}
        <Card className="mb-8 border-0 shadow-lg">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 dark:from-blue-900 dark:to-cyan-800 rounded-t-lg p-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  General Users
                </h1>
                <p className="mt-2 text-white/80">
                  Manage regular platform members
                </p>
              </div>
              <Badge
                variant="secondary"
                className="text-lg px-6 py-2 bg-white/20 border-white/30"
              >
                Total Users: {meta?.total || 0}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Table Card */}
        <Card className="border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">All Users</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>User Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No users found on this page.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user: any) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-muted/5 dark:hover:bg-muted/20"
                    >
                      <TableCell className="font-medium">
                        {user.fullName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            user.isActive
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                          }
                        >
                          {user.isActive ? "Active" : "Suspended"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus.mutate(user.id)}
                          disabled={toggleStatus.isPending}
                        >
                          <ShieldAlert className="h-4 w-4 mr-1" />
                          {user.isActive ? "Suspend" : "Activate"}
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
                              <AlertDialogTitle>Delete User?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Permanently delete{" "}
                                <strong>{user.fullName}</strong>? This cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => deleteUser.mutate(user.id)}
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
                  <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium">
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
