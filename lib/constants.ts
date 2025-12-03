export const EVENT_TYPES = [
  "Music",
  "Sports",
  "Technology",
  "Food",
  "Arts",
  "Outdoor",
  "Gaming",
  "Education",
  "Business",
  "Health",
] as const;

export const EVENT_STATUSES = [
  "OPEN",
  "FULL",
  "CANCELLED",
  "COMPLETED",
] as const;

export const USER_ROLES = ["USER", "HOST", "ADMIN"] as const;

export const BOOKING_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
] as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  EVENTS: "/events",
  EVENT_DETAILS: (id: string) => `/events/${id}`,
  CREATE_EVENT: "/events/create",
  EDIT_EVENT: (id: string) => `/events/${id}/edit`,
  DASHBOARD: "/dashboard",
  PROFILE: (id: string) => `/profile/${id}`,
  MY_EVENTS: "/my-events",
} as const;
