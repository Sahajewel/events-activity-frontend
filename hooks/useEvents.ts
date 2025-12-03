/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Event, PaginatedResponse, Booking } from "@/types";
import { toast } from "sonner";
import { api } from "./useAuth";

// Get all events with filters
export function useEvents(filters?: any) {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: async () => {
      const response = await api.get<{ data: PaginatedResponse<Event> }>(
        "/events",
        {
          params: filters,
        }
      );
      return response.data.data;
    },
  });
}

// Get single event by ID
export function useEvent(id: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const response = await api.get<{ data: Event }>(`/events/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

// Create new event
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post("/events", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create event");
    },
  });
}

// Update event
export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.patch(`/events/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      toast.success("Event updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update event");
    },
  });
}

// Delete event
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete event");
    },
  });
}

// Join event (create booking)
export function useJoinEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await api.post("/bookings", { eventId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      toast.success("Successfully joined event!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to join event");
    },
  });
}

// Cancel booking
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await api.patch(`/bookings/${bookingId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      toast.success("Booking cancelled successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    },
  });
}

// Get user bookings
export function useUserBookings() {
  return useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const response = await api.get<{ data: Booking[] }>(
        "/bookings/my-bookings"
      );
      return response.data.data;
    },
  });
}

// Get event bookings (for hosts)
export function useEventBookings(eventId: string) {
  return useQuery({
    queryKey: ["event-bookings", eventId],
    queryFn: async () => {
      const response = await api.get<{ data: Booking[] }>(
        `/bookings/event/${eventId}`
      );
      return response.data.data;
    },
    enabled: !!eventId,
  });
}
