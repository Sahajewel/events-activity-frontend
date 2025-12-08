/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./useAuth";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await api.get("/admin/dashboard");
      return response.data.data;
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await api.patch(`/admin/users/${userId}/role`, { role });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User role updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update role");
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.patch(`/admin/users/${userId}/toggle-status`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User status updated!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
}
// useHostRequests ফেচ করার জন্য
export function useHostRequests() {
  return useQuery({
    queryKey: ["host-requests"],
    queryFn: async () => {
      const response = await api.get("/admin/host-requests"); // আপনার ব্যাকএন্ড এন্ডপয়েন্ট
      return response.data.data;
    },
  });
}

// রিকোয়েস্ট অ্যাপ্রুভ করার জন্য
export function useApproveHostRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await api.patch(
        `/admin/host-requests/${requestId}/approve`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] }); // স্ট্যাটস আপডেট হবে
      toast.success("User promoted to HOST successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Action failed");
    },
  });
}
// ইউজার হোস্ট হওয়ার রিকোয়েস্ট পাঠানোর জন্য
export function useCreateHostRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: string) => {
      // 💡 আপনার ব্যাকএন্ড এন্ডপয়েন্ট অনুযায়ী '/admin/host-requests'
      const response = await api.post("/admin/host-requests", { message });
      return response.data;
    },
    onSuccess: () => {
      // সফল হলে হোস্ট রিকোয়েস্ট লিস্ট ইনভ্যালিডেট করা (অ্যাডমিনের জন্য)
      queryClient.invalidateQueries({ queryKey: ["host-requests"] });
      toast.success("Your request has been submitted to the admin!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit request");
    },
  });
}
