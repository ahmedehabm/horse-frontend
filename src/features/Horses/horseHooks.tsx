import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { getHorsesStats, getMyHorses } from "../../services/apiHorse";
import { LIMIT_RES } from "@/constants";
import { HorsesStatsResponse } from "@/types";

export function useGetHorsesUser() {
  const [searchParams] = useSearchParams();

  // Pagination
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // Query with optimized settings
  const {
    data: { horses = [], count, totalPages } = {},
    error,
    isFetching,
  } = useQuery({
    queryKey: ["horses-user", page],
    queryFn: () => getMyHorses({ page, limit: LIMIT_RES }),
    placeholderData: (previousData) => previousData,
  });

  return { horses, count, totalPages, isFetching, error };
}

// hooks/useGetHorsesStats.ts
export function useGetHorsesStats() {
  const { data, error, isFetching } = useQuery<HorsesStatsResponse>({
    queryKey: ["horses-stats"],
    queryFn: () => getHorsesStats(),
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
  });

  return {
    activeFeedings: data?.activeFeedings ?? [],
    activeStream: data?.activeStream ?? null,
    isFetching,
    error,
  };
}

export function useGetActiveFeedingStatus(horseId: string) {
  const { activeFeedings, isFetching, error } = useGetHorsesStats();

  const activeFeedingStatus =
    activeFeedings.find((f) => f.horseId === horseId) ?? null;

  return { activeFeedingStatus, isFetching, error };
}
/**
 * Hook to get active stream status
 */
export function useGetActiveStreamStatus() {
  const { activeStream, isFetching, error } = useGetHorsesStats();

  return {
    activeStream,
    isFetching,
    error,
  };
}
