/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ShieldAlert } from "lucide-react";
import { useDeleteUser, useToggleUserStatus } from "@/hooks/useAdmin";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function UserManagementPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users"); // Admin logic on backend filters USERs
      return res.data.data;
    },
  });

  const deleteUser = useDeleteUser();
  const toggleStatus = useToggleUserStatus();

  if (isLoading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="container mx-auto py-10">
      <Navbar></Navbar>
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">User Management</h1>
        </div>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data?.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>

                {/* 💡 স্ট্যাটাস কলাম ফিক্স */}
                <TableCell>
                  <Badge
                    className={
                      user.isActive
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 text-white"
                    }
                    variant="default"
                  >
                    {user.isActive ? "Active" : "Banned"}
                  </Badge>
                </TableCell>

                {/* 💡 অ্যাকশন কলাম ফিক্স */}
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus.mutate(user.id)}
                    disabled={toggleStatus.isPending}
                  >
                    {toggleStatus.isPending ? "..." : "Toggle"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteUser.mutate(user.id)}
                    disabled={deleteUser.isPending}
                  >
                    {deleteUser.isPending ? "..." : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Footer></Footer>
    </div>
  );
}
