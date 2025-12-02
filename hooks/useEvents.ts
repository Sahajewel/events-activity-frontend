"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "./useAuth";

interface EventQuery {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: string;
}

export const useEvents = (params: EventQuery = {}) => {
  return useQuery({
    queryKey: ["events", params],
    queryFn: async () => {
      const res = await api.get("/events", {
        params, // query params automatically added (limit, sortBy etc.)
      });
      return res.data; // expected: { data: [...] }
    },
    staleTime: 1000 * 30, // 30 sec
  });
};
