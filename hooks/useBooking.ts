/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  amount: number;
  createdAt: string;
  event?: {
    id: string;
    name: string;
    type: string;
    date: string;
    location: string;
    imageUrl?: string;
    hostId: string;
  };
}

// Get user's bookings
export const useUserBookings = () => {
  return useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const response = await api.get<{ data: Booking[] }>(
        "/bookings/my-bookings"
      );
      return response.data.data;
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await api.post(`/bookings`, { eventId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create booking");
    },
  });
};

// Cancel booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await api.patch(`/bookings/${bookingId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      toast.success("Booking cancelled successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    },
  });
};
