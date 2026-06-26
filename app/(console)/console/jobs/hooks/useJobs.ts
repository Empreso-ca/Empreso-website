"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

type Filters = {
  q?: string;
  location?: string;
  company?: string;
  jobType?: string;
  source?: string;
  remote?: string;
};

export function useJobs(filters: Filters) {
  return useInfiniteQuery({
    queryKey: ["jobs", filters],

    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      if (pageParam) {
        params.set("cursor", String(pageParam));
      }

      params.set("limit", "50");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs?${params}`
      );

      if (!res.ok) {
        throw new Error("Failed");
      }
      
      return res.json();
    },

    initialPageParam: null,

    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
  });
}