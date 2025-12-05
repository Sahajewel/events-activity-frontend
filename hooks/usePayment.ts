/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./useAuth";

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await api.post("/payments/create-intent", { bookingId });
      return response.data.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create payment");
    },
  });
}

// hooks/usePayment.ts
export function useConfirmPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentIntentId: string) => {
      if (!paymentIntentId) {
        throw new Error("paymentIntentId is required");
      }

      const response = await api.post("/payments/confirm", {
        paymentIntentId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Payment successful!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Payment failed");
    },
  });
}

export function usePaymentHistory() {
  return useQuery({
    queryKey: ["payment-history"],
    queryFn: async () => {
      const response = await api.get("/payments/history");
      return response.data.data;
    },
  });
}
