/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventStatus, BookingStatus } from "@/types";

export function getStatusColor(status: EventStatus | BookingStatus): string {
  const colors: Record<string, string> = {
    OPEN: "bg-green-100 text-green-800",
    FULL: "bg-yellow-100 text-yellow-800",
    CANCELLED: "bg-red-100 text-red-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getStatusBadgeVariant(
  status: EventStatus | BookingStatus
): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<string, any> = {
    OPEN: "default",
    CONFIRMED: "default",
    FULL: "secondary",
    PENDING: "secondary",
    CANCELLED: "destructive",
    COMPLETED: "outline",
  };
  return variants[status] || "outline";
}

export function isEventUpcoming(eventDate: string): boolean {
  return new Date(eventDate) > new Date();
}

export function isEventPast(eventDate: string): boolean {
  return new Date(eventDate) <= new Date();
}

export function canJoinEvent(event: {
  status: EventStatus;
  maxParticipants: number;
  bookings?: any[];
}): boolean {
  if (event.status !== "OPEN") return false;
  const bookedCount = event.bookings?.length || 0;
  return bookedCount < event.maxParticipants;
}

export function getEventSpotsLeft(event: {
  maxParticipants: number;
  bookings?: any[];
}): number {
  const bookedCount = event.bookings?.length || 0;
  return Math.max(0, event.maxParticipants - bookedCount);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function getErrorMessage(error: any): string {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
