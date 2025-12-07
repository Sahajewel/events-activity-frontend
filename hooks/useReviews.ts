/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./useAuth";

export function useEventReviews(eventId: string) {
  return useQuery({
    queryKey: ["event-reviews", eventId],
    queryFn: async () => {
      const response = await api.get(`/reviews/event/${eventId}`);
      return response.data.data;
    },
    enabled: !!eventId,
  });
}

export function useHostReviews(hostId: string) {
  return useQuery({
    queryKey: ["host-reviews", hostId],
    queryFn: async () => {
      const response = await api.get(`/reviews/host/${hostId}`);
      return response.data.data;
    },
    enabled: !!hostId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      eventId: string;
      rating: number;
      comment?: string;
    }) => {
      const response = await api.post("/reviews", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["host-reviews"] });
      toast.success("Review submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit review");
    },
  });
}

// hooks/useReviews.ts - Add new hook

export function useUserReviewForEvent(eventId: string, userId: string) {
  return useQuery({
    queryKey: ["user-event-review", eventId, userId],
    queryFn: async () => {
      const response = await api.get(`/reviews/event/${eventId}`);
      const reviews = response.data.data.reviews;
      return reviews.find((r: any) => r.userId === userId);
    },
    enabled: !!eventId && !!userId,
  });
}
