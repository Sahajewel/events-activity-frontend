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
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import {
  useDeleteUser,
  useToggleUserStatus,
  useUpdateUserRole,
} from "@/hooks/useAdmin";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function UserManagementPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // 💡 ১. শুধুমাত্র সাধারণ ইউজারদের ডাটা ফেচ করা হচ্ছে (role=USER ফিল্টার দিয়ে)
  const { data: userData, isLoading } = useQuery({
    queryKey: ["admin-users", page],
    queryFn: async () => {
      // API call এ ?role=USER প্যারামিটার যোগ করা হয়েছে
      const res = await api.get(`/users?role=USER&page=${page}&limit=${limit}`);
      return res.data.data;
    },
  });

  const users = userData?.data || [];
  const meta = userData?.pagination;

  const deleteUser = useDeleteUser();
  const toggleStatus = useToggleUserStatus();
  // useUpdateUserRole এখানে লাগবে না, কারণ এখানে রোল আপডেট করা হচ্ছে না।

  if (isLoading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <Navbar></Navbar>
      <div className="container mx-auto py-10 px-4">
        <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-12 flex px-4">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">General User Management</h1>
            <p className="text-muted-foreground">
              Manage platform users with USER role.
            </p>
          </div>
          <Badge variant="secondary" className="text-md px-4 py-2">
            Total Users: {meta?.total || 0}
          </Badge>
        </div>

        <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
          {/* Consistent Height Container */}
          <div className="min-h-[580px] flex flex-col justify-between">
            <Table>
              <TableHeader className="bg-blue-50/50">
                <TableRow>
                  <TableHead>User Details</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-blue-50/20 transition-colors"
                  >
                    <TableCell className="font-semibold">
                      {user.fullName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.isActive
                            ? "bg-green-600 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {user.isActive ? "Active" : "Banned/Suspended"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {/* Status Toggle Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus.mutate(user.id)}
                        disabled={toggleStatus.isPending}
                      >
                        <ShieldAlert className="h-4 w-4 mr-1" /> Toggle
                      </Button>

                      {/* Smart Delete Modal (AlertDialog) */}
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
                            <AlertDialogTitle>
                              Confirm Permanent Deletion?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              User <b>{user.fullName}</b> (Role: USER) will be
                              permanently deleted. This action is irreversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => deleteUser.mutate(user.id)}
                            >
                              Yes, Delete User
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 italic">
                      No general users found on this page.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t bg-blue-50/10 mt-auto">
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
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <div className="bg-primary text-white px-3 py-1 rounded font-bold text-xs">
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
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
}
