import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    location: z.string().optional(),
    bio: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const eventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  type: z.string().min(1, "Event type is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(3, "Location is required"),
  minParticipants: z.number().int().positive().optional(),
  maxParticipants: z
    .number()
    .int()
    .positive()
    .min(1, "Max participants is required"),
  joiningFee: z.number().nonnegative(),
});

export const reviewSchema = z.object({
  eventId: z.uuid("Invalid event ID"),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .optional(),
});

export const profileSchema = z.object({
  fullName: z.string().min(2).optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  interests: z.array(z.string()).optional(),
});
