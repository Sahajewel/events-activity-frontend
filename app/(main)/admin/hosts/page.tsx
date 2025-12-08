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
import {
  Trash2,
  ShieldAlert,
  UserMinus,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";
import {
  useDeleteUser,
  useToggleUserStatus,
  useUpdateUserRole,
} from "@/hooks/useAdmin";

export default function HostManagementPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // 💡 ১. শুধুমাত্র হোস্টদের ডাটা ফেচ করা হচ্ছে (role=HOST ফিল্টার দিয়ে)
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
  const updateRole = useUpdateUserRole();

  if (isLoading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold">Host Board</h1>
            <p className="text-muted-foreground">
              Manage authorized event hosts.
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="text-md px-4 py-2 border-yellow-500 text-yellow-600"
        >
          Total Hosts: {meta?.total || 0}
        </Badge>
      </div>

      <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
        {/* Consistent Table UI */}
        <div className="min-h-[580px] flex flex-col justify-between">
          <Table>
            <TableHeader className="bg-yellow-50/50">
              <TableRow>
                <TableHead>Host Details</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Hosting Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hosts.map((host: any) => (
                <TableRow
                  key={host.id}
                  className="hover:bg-yellow-50/20 transition-colors"
                >
                  <TableCell className="font-semibold">
                    {host.fullName}
                  </TableCell>
                  <TableCell>{host.email}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        host.isActive
                          ? "bg-green-600 text-white"
                          : "bg-red-500 text-white"
                      }
                    >
                      {host.isActive ? "Active Host" : "Suspended"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {/* Demote Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      title="Demote to User"
                      className="border-yellow-200 hover:bg-yellow-50"
                      onClick={() =>
                        updateRole.mutate({ userId: host.id, role: "USER" })
                      }
                      disabled={updateRole.isPending}
                    >
                      <UserMinus className="h-4 w-4 mr-1" /> Demote
                    </Button>

                    {/* Suspend Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus.mutate(host.id)}
                      disabled={toggleStatus.isPending}
                    >
                      <ShieldAlert className="h-4 w-4 mr-1" />{" "}
                      {host.isActive ? "Suspend" : "Activate"}
                    </Button>

                    {/* 🚀 স্মার্ট ডিলিট মোডাল */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Host <b>{host.fullName}</b> will be permanently
                            removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => deleteUser.mutate(host.id)}
                          >
                            Delete Host
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
              {hosts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20 italic">
                    No hosts registered yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Intuitive Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-yellow-50/10 mt-auto">
            <div className="text-sm text-muted-foreground">
              Showing Page <b>{page}</b> of <b>{meta?.totalPages || 1}</b>
            </div>
            <div className="flex items-center space-x-2">
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
              <div className="bg-yellow-500 text-white px-3 py-1 rounded font-bold">
                {page}
              </div>
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
    </div>
  );
}
