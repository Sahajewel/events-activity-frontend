"use client";

import { User } from "@/types";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./useAuth";

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      const response = await api.get<{ data: User }>(`/users/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.patch("/users/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      // Update stored user
      localStorage.setItem("user", JSON.stringify(data.data));
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
}
