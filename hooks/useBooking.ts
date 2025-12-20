/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/hooks/useAuth";
import { ValidatedCoupon } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  amount: number;
  quantity?: number;
  subtotal?: number;
  discount?: number;
  couponCode?: string;
  createdAt: string;

  event?: {
    id: string;
    name: string;
    description?: string;
    type: string;
    date: string;
    location: string;
    imageUrl?: string;
    hostId: string;
    joiningFee: number;
  };

  payment?: {
    id: string;
    status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
    amount: number;
  };
}

interface CreateBookingData {
  eventId: string;
  quantity?: number;
  couponCode?: string;
}

interface ValidateCouponData {
  code: string;
  eventId: string;
  quantity: number;
}

// ✅ User bookings
export const useUserBookings = () => {
  return useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const res = await api.get("/bookings/my-bookings");
      return res.data.data as Booking[];
    },
  });
};

// ✅ Create booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookingData) => {
      const res = await api.post("/bookings", data);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Booking successful 🎉");
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Booking failed");
    },
  });
};

// ✅ Validate coupon (FIXED & TYPED)
export const useValidateCoupon = () => {
  return useMutation<ValidatedCoupon, any, ValidateCouponData>({
    mutationFn: async (data) => {
      const res = await api.post("/bookings/validate-coupon", data);
      return res.data.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Invalid coupon");
    },
  });
};

// ✅ Cancel booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await api.patch(`/bookings/${bookingId}/cancel`);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Booking cancelled");
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
