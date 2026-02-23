import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import {
  createHorse as createHorseApi,
  getAllHorses,
  getHorsesStats,
  getMyHorses,
} from "../../services/apiHorse";
import { HORSE_USER_RES, LIMIT_RES } from "@/constants";
import { HorsesStatsResponse } from "@/types";
import { useTranslation } from "react-i18next";

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
    queryFn: () => getMyHorses({ page, limit: HORSE_USER_RES }),
    placeholderData: (previousData) => previousData,
  });

  return { horses, count, totalPages, isFetching, error };
}

export function useGetAllHorses() {
  const [searchParams] = useSearchParams();

  // Pagination
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // Query with optimized settings
  const {
    data: { horses = [], count, totalPages } = {},
    error,
    isFetching,
  } = useQuery({
    queryKey: ["horses", page],
    queryFn: () => getAllHorses({ page, limit: LIMIT_RES }),
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

export function useCreateHorse() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const {
    mutate: createHorse,
    isPending,
    error,
  } = useMutation({
    mutationFn: createHorseApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["horses"] });
      queryClient.invalidateQueries({ queryKey: ["device-options"] });
      toast.success(t("horses.horseCreatedSuccess"));
    },
    onError: (err: Error) => {
      toast.error(
        err.message || t("horses.createHorseFailed", "Failed to create horse"),
      );
    },
  });

  return { createHorse, isPending, error };
}
